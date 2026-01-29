import { useMemo, useState } from 'react';
import { LoopNode, LoopConnection } from '@/types/simulation';
import { LoopNodeComponent } from './LoopNode';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LoopDiagramProps {
  nodes: LoopNode[];
  connections: LoopConnection[];
  className?: string;
}

export function LoopDiagram({ nodes, connections, className }: LoopDiagramProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const size = 320;
  const center = size / 2;
  const radius = 120;

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

            // Calculate curved path
            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2;
            const dx = to.x - from.x;
            const dy = to.y - from.y;
            const curveOffset = 20;
            const perpX = -dy / Math.sqrt(dx * dx + dy * dy) * curveOffset;
            const perpY = dx / Math.sqrt(dx * dx + dy * dy) * curveOffset;

            const isHighlighted = selectedNode === conn.from || selectedNode === conn.to;

            return (
              <path
                key={`${conn.from}-${conn.to}-${index}`}
                d={`M ${from.x} ${from.y} Q ${midX + perpX} ${midY + perpY} ${to.x} ${to.y}`}
                fill="none"
                stroke={conn.type === 'reinforcing' ? 'hsl(var(--flow-accelerating))' : 'hsl(var(--flow-stabilizing))'}
                strokeWidth={isHighlighted ? 2 : 1}
                strokeOpacity={isHighlighted ? 0.8 : 0.3}
                markerEnd="url(#arrowhead)"
                className="transition-all duration-300"
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {nodes.map(node => (
          <LoopNodeComponent
            key={node.id}
            node={node}
            position={nodePositions[node.id]}
            isActive={selectedNode === node.id}
            onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
          />
        ))}

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
              <div className="text-xs font-mono">{Math.round(selectedNodeData.intensity * 100)}%</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
