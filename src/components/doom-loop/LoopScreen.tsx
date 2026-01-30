import { SimulationParams, LoopNode } from '@/types/simulation';
import { LoopCard } from './LoopCard';
import { ParamSlider } from './ParamSlider';
import { TensionGauge } from './TensionGauge';

interface LoopScreenProps {
  nodes: LoopNode[];
  params: SimulationParams;
  onParamChange: (key: keyof SimulationParams, value: number) => void;
  overallTension: number;
  tensionLevel: 'stable' | 'stressed' | 'critical';
}

export function LoopScreen({ nodes, params, onParamChange, overallTension, tensionLevel }: LoopScreenProps) {
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

  return (
    <div className="space-y-4">
      <TensionGauge tension={overallTension} level={tensionLevel} />
      
      {/* Loop Cards */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-muted-foreground">The Feedback Loop</h3>
        <div className="grid gap-2">
          {orderedNodes.map((node, index) => (
            <div key={node.id} className="relative">
              <LoopCard node={node} />
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
