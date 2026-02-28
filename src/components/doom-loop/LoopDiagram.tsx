import { useMemo, useState } from 'react';
import { LoopNode, LoopConnection } from '@/types/simulation';
import { LoopNodeComponent } from './LoopNode';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AggregatedSignal, signalCategoryMeta } from '@/types/signals';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const nodeTooltips: Record<string, { title: string; body: string }> = {
  ai: { title: 'The Automation Engine', body: 'AI systems increasingly handle tasks once done by humans — from coding to driving — accelerating every other pressure in the loop.' },
  labor: { title: 'The Jobs Squeeze', body: 'As machines take over tasks, demand for human workers drops. Entire occupations can shrink faster than new ones emerge.' },
  income: { title: 'The Wage Trap', body: 'When jobs vanish or shift to lower-paid work, household earnings fall — leaving less room for saving, spending, or starting families.' },
  consumption: { title: 'The Spending Slowdown', body: 'People with less money buy less. That means fewer sales, lower profits, and shrinking tax revenue — a drag on the whole economy.' },
  fertility: { title: 'The Baby Bust', body: 'Economic insecurity makes people delay or forgo having children. This isn\'t just personal — it reshapes entire societies within a generation.' },
  aging: { title: 'The Grey Wave', body: 'Fewer births plus longer lives means a rising share of retirees. Each working-age person supports more dependents over time.' },
  fiscal: { title: 'The Budget Crunch', body: 'Governments collect less tax while spending more on pensions and healthcare. The gap grows until something gives.' },
  capital: { title: 'The Wealth Divide', body: 'AI profits flow to those who own the machines and data. The rich get richer while workers\' share of the pie shrinks.' },
  prices: { title: 'Debt-Deflation Spiral', body: 'When prices fall, the real value of debt rises — people owe more in purchasing-power terms, squeezing their income and spending further.' },
};

interface LoopDiagramProps {
  nodes: LoopNode[];
  connections: LoopConnection[];
  className?: string;
  aggregatedSignals?: AggregatedSignal[];
}

export function LoopDiagram({ nodes, connections, className, aggregatedSignals = [] }: LoopDiagramProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const size = 340;
  const center = size / 2;
  const radius = 130;

  const nodePositions = useMemo(() => {
    const positions: Record<string, { x: number; y: number }> = {};
    nodes.forEach((node, index) => {
      const angle = (index / nodes.length) * 2 * Math.PI - Math.PI / 2;
      positions[node.id] = {
        x: center + Math.cos(angle) * radius,
        y: center + Math.sin(angle) * radius
      };
    });
    return positions;
  }, [nodes, center, radius]);

  // Calculate stress levels for each node based on signals
  const nodeStressLevels = useMemo(() => {
    const stressMap: Record<string, number> = {};
    
    nodes.forEach(node => {
      // Find signals that affect this node
      const affectingSignals = aggregatedSignals.filter(s => 
        s.affectedNodes.includes(node.id)
      );
      
      if (affectingSignals.length === 0) {
        stressMap[node.id] = 0;
        return;
      }
      
      // Calculate weighted stress based on signal direction and whether it's accelerating
      let stressSum = 0;
      let weightSum = 0;
      
      affectingSignals.forEach(signal => {
        const meta = signalCategoryMeta[signal.category];
        const weight = signal.confidence;
        
        if (meta.isAccelerating) {
          // Stress signals: positive direction = more stress
          stressSum += Math.max(0, signal.netDirection) * weight;
        } else {
          // Adaptation signals: positive direction = less stress
          stressSum -= Math.max(0, signal.netDirection) * weight * 0.5;
        }
        weightSum += weight;
      });
      
      stressMap[node.id] = weightSum > 0 
        ? Math.max(0, Math.min(1, stressSum / weightSum)) 
        : 0;
    });
    
    return stressMap;
  }, [nodes, aggregatedSignals]);

  // Calculate uncertainty based on signal confidence
  const nodeUncertainty = useMemo(() => {
    const uncertaintyMap: Record<string, number> = {};
    
    nodes.forEach(node => {
      const affectingSignals = aggregatedSignals.filter(s => 
        s.affectedNodes.includes(node.id)
      );
      
      if (affectingSignals.length === 0) {
        uncertaintyMap[node.id] = 0.3; // Base uncertainty when no signals
        return;
      }
      
      const avgConfidence = affectingSignals.reduce((sum, s) => sum + s.confidence, 0) / affectingSignals.length;
      uncertaintyMap[node.id] = 1 - avgConfidence;
    });
    
    return uncertaintyMap;
  }, [nodes, aggregatedSignals]);

  const selectedNodeData = nodes.find(n => n.id === selectedNode);

  return (
    <div className={className}>
      <div className="relative mx-auto" style={{ width: size, height: size }}>
        {/* SVG for connections */}
        <svg
          className="absolute inset-0"
          width={size}
          height={size}
          style={{ pointerEvents: 'none' }}
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="currentColor"
                className="text-muted-foreground/50"
              />
            </marker>
          </defs>
          {connections.map((conn, index) => {
            const from = nodePositions[conn.from];
            const to = nodePositions[conn.to];
            if (!from || !to) return null;

            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2;
            const dx = to.x - from.x;
            const dy = to.y - from.y;
            const curveOffset = 20;
            const perpX = -dy / Math.sqrt(dx * dx + dy * dy) * curveOffset;
            const perpY = dx / Math.sqrt(dx * dx + dy * dy) * curveOffset;

            const isHighlighted = selectedNode === conn.from || selectedNode === conn.to;
            
            // Connection stress based on source node stress
            const sourceStress = nodeStressLevels[conn.from] || 0;
            const connectionOpacity = isHighlighted ? 0.8 : 0.3 + sourceStress * 0.3;

            return (
              <path
                key={`${conn.from}-${conn.to}-${index}`}
                d={`M ${from.x} ${from.y} Q ${midX + perpX} ${midY + perpY} ${to.x} ${to.y}`}
                fill="none"
                stroke={conn.type === 'reinforcing' ? 'hsl(var(--flow-accelerating))' : 'hsl(var(--flow-stabilizing))'}
                strokeWidth={isHighlighted ? 2 : 1 + sourceStress}
                strokeOpacity={connectionOpacity}
                markerEnd="url(#arrowhead)"
                className="transition-all duration-300"
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {nodes.map(node => {
          const nodeEl = (
            <LoopNodeComponent
              key={node.id}
              node={node}
              position={nodePositions[node.id]}
              isActive={selectedNode === node.id}
              onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
              stressLevel={nodeStressLevels[node.id] || 0}
              uncertainty={nodeUncertainty[node.id] || 0}
            />
          );

          const tip = nodeTooltips[node.id];
          if (!tip) return nodeEl;

          return (
            <TooltipProvider key={node.id}>
              <Tooltip>
                <TooltipTrigger asChild>{nodeEl}</TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-[220px] text-xs">
                  <p className="font-semibold mb-1">{tip.title}</p>
                  <p className="text-muted-foreground">{tip.body}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}

        {/* Center indicator */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="text-xs text-muted-foreground">DOOM</div>
          <div className="text-xs text-muted-foreground">LOOP</div>
        </div>
      </div>

      {/* Selected node info */}
      {selectedNodeData && (
        <Card className="mt-4 animate-in fade-in slide-in-from-bottom-2">
          <CardHeader className="py-3">
            <CardTitle className="text-sm">{selectedNodeData.label}</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <p className="text-xs text-muted-foreground">{selectedNodeData.description}</p>
            <div className="mt-2 flex items-center gap-2">
              <div className="text-xs">Intensity:</div>
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${selectedNodeData.intensity * 100}%` }}
                />
              </div>
            </div>
            {nodeStressLevels[selectedNodeData.id] > 0 && (
              <div className="mt-2 flex items-center gap-2">
                <div className="text-xs text-flow-accelerating">Stress:</div>
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-flow-accelerating transition-all duration-500"
                    style={{ width: `${nodeStressLevels[selectedNodeData.id] * 100}%` }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
