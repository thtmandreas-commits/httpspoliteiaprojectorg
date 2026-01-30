import { SimulationParams, LoopNode } from '@/types/simulation';
import { AggregatedSignal } from '@/types/signals';
import { LoopCard } from './LoopCard';
import { SensitivityToggle } from './SensitivityToggle';
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
      
      {/* Loop Cards with radial background emphasis */}
      <div className="space-y-2 relative">
        {/* Subtle radial gradient for visual gravity - theme aware */}
        <div 
          className="absolute inset-0 -z-10 pointer-events-none dark:opacity-50"
          style={{
            background: 'radial-gradient(ellipse at center top, hsl(var(--muted)) 0%, transparent 70%)',
            transform: 'translateY(-20px)',
          }}
        />
        
        <h3 className="text-sm font-semibold text-muted-foreground">The Feedback Loop</h3>
        <div className="grid gap-2.5">
          {orderedNodes.map((node, index) => (
            <div key={node.id} className="relative">
              <LoopCard 
                node={node} 
                stressLevel={nodeStressMap[node.id]}
              />
              {index < orderedNodes.length - 1 && (
                <div 
                  className="absolute left-1/2 -bottom-1.5 w-px h-2.5 opacity-30"
                  style={{
                    background: 'linear-gradient(to bottom, hsl(var(--border)), transparent)'
                  }}
                />
              )}
            </div>
          ))}
        </div>
        {/* Loop indicator - connects back to start */}
        <div className="flex justify-center pt-1">
          <div className="text-xs text-muted-foreground/60 italic tracking-wide">↻ Loop reinforces</div>
        </div>
      </div>

      {/* Sensitivity Controls */}
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
