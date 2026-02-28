import { useState, useCallback } from 'react';
import { SimulationParams, LoopNode } from '@/types/simulation';
import { AggregatedSignal, signalCategoryMeta } from '@/types/signals';
import { Card, CardContent } from '@/components/ui/card';
import { LoopCard } from './LoopCard';
import { LoopConnectionLink } from './LoopConnectionLink';
import { SensitivityToggle } from './SensitivityToggle';
import { TensionGauge } from './TensionGauge';
import { TrendingDown, TrendingUp, Minus, Info, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoopScreenProps {
  nodes: LoopNode[];
  params: SimulationParams;
  onParamChange: (key: keyof SimulationParams, value: number) => void;
  overallTension: number;
  tensionLevel: 'stable' | 'stressed' | 'critical';
  // Signal engine integration
  aggregatedSignals?: AggregatedSignal[];
  signalLoopPressure?: number;
  signalPressureTrend?: 'increasing' | 'decreasing' | 'stable';
}

// Node order with their outgoing connections
const nodeSequence = [
  { id: 'ai', connectsTo: 'labor' },
  { id: 'labor', connectsTo: 'income' },
  { id: 'income', connectsTo: 'consumption' },
  { id: 'consumption', connectsTo: 'fertility' },
  { id: 'fertility', connectsTo: 'aging' },
  { id: 'aging', connectsTo: 'fiscal' },
  { id: 'fiscal', connectsTo: 'capital' },
  { id: 'capital', connectsTo: 'prices' },
  { id: 'prices', connectsTo: null },
];

// Calculate node stress from signals
function calculateNodeStress(nodeId: string, signals: AggregatedSignal[]): number {
  const affectingSignals = signals.filter(s => s.affectedNodes.includes(nodeId));
  
  if (affectingSignals.length === 0) return 0;
  
  let stressSum = 0;
  let weightSum = 0;
  
  affectingSignals.forEach(signal => {
    const meta = signalCategoryMeta[signal.category];
    const weight = signal.confidence;
    
    if (meta.isAccelerating) {
      stressSum += Math.max(0, signal.netDirection) * weight;
    } else {
      stressSum -= Math.max(0, signal.netDirection) * weight * 0.5;
    }
    weightSum += weight;
  });
  
  return weightSum > 0 ? Math.max(0, Math.min(1, stressSum / weightSum)) : 0;
}

export function LoopScreen({ 
  nodes, 
  params, 
  onParamChange, 
  overallTension, 
  tensionLevel,
  aggregatedSignals = [],
  signalLoopPressure = 0,
  signalPressureTrend = 'stable'
}: LoopScreenProps) {
  const [openConnection, setOpenConnection] = useState<string | null>(null);
  const [deflationOpen, setDeflationOpen] = useState(false);

  const handleConnectionToggle = useCallback((connectionKey: string) => {
    setOpenConnection(prev => prev === connectionKey ? null : connectionKey);
  }, []);

  const handleConnectionClose = useCallback(() => {
    setOpenConnection(null);
  }, []);

  // Arrange nodes in a circular conceptual order
  const orderedNodes = [
    nodes.find(n => n.id === 'ai'),
    nodes.find(n => n.id === 'labor'),
    nodes.find(n => n.id === 'income'),
    nodes.find(n => n.id === 'consumption'),
    nodes.find(n => n.id === 'fertility'),
    nodes.find(n => n.id === 'aging'),
    nodes.find(n => n.id === 'fiscal'),
    nodes.find(n => n.id === 'capital'),
    nodes.find(n => n.id === 'prices'),
  ].filter(Boolean) as LoopNode[];

  // Calculate node stress levels from signals
  const nodeStressMap = orderedNodes.reduce((acc, node) => {
    acc[node.id] = calculateNodeStress(node.id, aggregatedSignals);
    return acc;
  }, {} as Record<string, number>);

  // Blend slider-based tension with signal-derived pressure
  const blendedTension = aggregatedSignals.length > 0 
    ? overallTension * 0.5 + signalLoopPressure * 0.5 
    : overallTension;

  // Determine level based on blended tension
  const blendedLevel = blendedTension > 0.7 ? 'critical' : 
                       blendedTension > 0.4 ? 'stressed' : 'stable';

  return (
    <div className="space-y-4">
      <TensionGauge 
        tension={blendedTension} 
        level={blendedLevel}
        signalPressure={signalLoopPressure}
        signalTrend={signalPressureTrend}
        hasSignalData={aggregatedSignals.length > 0}
      />
      
      {/* Loop Cards with radial background emphasis */}
      <div className="space-y-0 relative">
        {/* Subtle radial gradient for visual gravity - theme aware */}
        <div 
          className="absolute inset-0 -z-10 pointer-events-none dark:opacity-50"
          style={{
            background: 'radial-gradient(ellipse at center top, hsl(var(--muted)) 0%, transparent 70%)',
            transform: 'translateY(-20px)',
          }}
        />
        
        <h3 className="text-sm font-semibold text-muted-foreground mb-2">The Feedback Loop</h3>
        <div className="space-y-0">
          {orderedNodes.map((node, index) => {
            const nextNode = orderedNodes[index + 1];
            const connectionKey = nextNode ? `${node.id}->${nextNode.id}` : null;
            const isLastNode = index === orderedNodes.length - 1;
            
            return (
              <div key={node.id} className="relative">
                <LoopCard 
                  node={node} 
                  stressLevel={nodeStressMap[node.id]}
                  onClick={handleConnectionClose}
                />
                
                {/* Connection link to next node */}
                {!isLastNode && connectionKey && (
                  <LoopConnectionLink
                    fromNodeId={node.id}
                    toNodeId={nextNode.id}
                    isOpen={openConnection === connectionKey}
                    onToggle={() => handleConnectionToggle(connectionKey)}
                    onClose={handleConnectionClose}
                  />
                )}
              </div>
            );
          })}
        </div>
        {/* Loop indicator - connects back to start */}
        <div className="flex justify-center pt-2">
          <div className="text-xs text-muted-foreground/60 italic tracking-wide">↻ Loop reinforces</div>
        </div>
      </div>

      {/* Deflation Dual-Effect Explainer — Collapsible */}
      <Card className="border-l-4 border-l-primary bg-primary/5">
        <button
          onClick={() => setDeflationOpen(!deflationOpen)}
          className="w-full p-3 flex items-center justify-between gap-2 text-left"
        >
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-primary shrink-0" />
            <h4 className="text-xs font-semibold text-foreground">
              Deflation: The Double-Edged Catalyst
            </h4>
          </div>
          <ChevronDown className={cn('w-3.5 h-3.5 text-muted-foreground transition-transform', deflationOpen && 'rotate-180')} />
        </button>
        {deflationOpen && (
          <CardContent className="px-3 pb-3 pt-0 pl-9 space-y-2">
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              AI-driven deflation is unique in the loop — it simultaneously <span className="text-flow-accelerating font-medium">destabilizes</span> and <span className="text-flow-stabilizing font-medium">stabilizes</span> different parts of the system.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-[10px] font-semibold text-flow-accelerating">
                  <TrendingUp className="w-3 h-3" />
                  Destabilizing
                </div>
                <ul className="text-[10px] text-muted-foreground space-y-0.5 pl-4">
                  <li className="list-disc">Squeezes corporate margins</li>
                  <li className="list-disc">Shrinks nominal tax revenue</li>
                  <li className="list-disc">Amplifies real debt burden</li>
                </ul>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-[10px] font-semibold text-flow-stabilizing">
                  <TrendingDown className="w-3 h-3" />
                  Stabilizing
                </div>
                <ul className="text-[10px] text-muted-foreground space-y-0.5 pl-4">
                  <li className="list-disc">Boosts real purchasing power</li>
                  <li className="list-disc">Offsets wage compression</li>
                  <li className="list-disc">Lowers cost of essentials</li>
                </ul>
              </div>
            </div>
            <p className="text-[9px] text-muted-foreground/60 italic">
              Who wins depends on where you sit: capital owners and governments face pressure; consumers with stable income benefit.
            </p>
          </CardContent>
        )}
      </Card>

      <div className="pt-4 border-t border-border/50 space-y-4">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-foreground/90">Test Sensitivity</h3>
          <p className="text-xs text-muted-foreground/70 leading-relaxed">
            These controls test system sensitivity, not solutions.
          </p>
        </div>
        
        <div className="space-y-4">
          <SensitivityToggle
            label="AI Adoption Speed"
            value={params.aiAdoptionSpeed}
            onChange={(v) => onParamChange('aiAdoptionSpeed', v)}
          />
          <SensitivityToggle
            label="Income Floor / Redistribution"
            value={params.incomeFloorRedistribution}
            onChange={(v) => onParamChange('incomeFloorRedistribution', v)}
          />
          <SensitivityToggle
            label="Immigration Openness"
            value={params.immigrationOpenness}
            onChange={(v) => onParamChange('immigrationOpenness', v)}
          />
          <SensitivityToggle
            label="Cost of Living Pressure"
            value={params.costOfLivingPressure}
            onChange={(v) => onParamChange('costOfLivingPressure', v)}
          />
          <SensitivityToggle
            label="State Capacity"
            value={params.stateCapacity}
            onChange={(v) => onParamChange('stateCapacity', v)}
          />
        </div>
      </div>
    </div>
  );
}
