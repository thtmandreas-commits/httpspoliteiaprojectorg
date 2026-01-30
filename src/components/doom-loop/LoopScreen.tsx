import { SimulationParams, LoopNode } from '@/types/simulation';
import { AggregatedSignal } from '@/types/signals';
import { LoopCard } from './LoopCard';
import { ParamSlider } from './ParamSlider';
import { TensionGauge } from './TensionGauge';
import { signalCategoryMeta } from '@/types/signals';

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
      
      {/* Loop Cards */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-muted-foreground">The Feedback Loop</h3>
        <div className="grid gap-2">
          {orderedNodes.map((node, index) => (
            <div key={node.id} className="relative">
              <LoopCard 
                node={node} 
                stressLevel={nodeStressMap[node.id]}
              />
              {index < orderedNodes.length - 1 && (
                <div className="absolute left-1/2 -bottom-1 w-0.5 h-2 bg-border" />
              )}
            </div>
          ))}
        </div>
        {/* Loop indicator - connects back to start */}
        <div className="flex justify-center">
          <div className="text-xs text-muted-foreground italic">↻ Loop reinforces</div>
        </div>
      </div>

      {/* Sliders */}
      <div className="pt-4 border-t space-y-4">
        <h3 className="text-sm font-semibold">Adjust Parameters</h3>
        <ParamSlider
          label="AI Adoption Speed"
          value={params.aiAdoptionSpeed}
          onChange={(v) => onParamChange('aiAdoptionSpeed', v)}
        />
        <ParamSlider
          label="Welfare Level"
          value={params.welfareLevel}
          onChange={(v) => onParamChange('welfareLevel', v)}
        />
        <ParamSlider
          label="Immigration Rate"
          value={params.immigrationRate}
          onChange={(v) => onParamChange('immigrationRate', v)}
        />
        <ParamSlider
          label="Redistribution"
          value={params.redistributionLevel}
          onChange={(v) => onParamChange('redistributionLevel', v)}
        />
      </div>
    </div>
  );
}
