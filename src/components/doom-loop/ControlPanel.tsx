import { SimulationParams } from '@/types/simulation';
import { ParamSlider } from './ParamSlider';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

interface ControlPanelProps {
  params: SimulationParams;
  onParamChange: (key: keyof SimulationParams, value: number) => void;
  onReset: () => void;
  className?: string;
}

export function ControlPanel({ params, onParamChange, onReset, className }: ControlPanelProps) {
  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">Adjust Parameters</h3>
        <Button variant="ghost" size="sm" onClick={onReset}>
          <RotateCcw className="w-4 h-4 mr-1" />
          Reset
        </Button>
      </div>
      
      <div className="space-y-6">
        <ParamSlider
          label="AI Adoption Speed"
          value={params.aiAdoptionSpeed}
          onChange={(v) => onParamChange('aiAdoptionSpeed', v)}
          description="Rate of AI deployment across industries"
        />
        
        <ParamSlider
          label="Welfare Level"
          value={params.welfareLevel}
          onChange={(v) => onParamChange('welfareLevel', v)}
          description="Social safety net strength"
        />
        
        <ParamSlider
          label="Immigration Rate"
          value={params.immigrationRate}
          onChange={(v) => onParamChange('immigrationRate', v)}
          description="Net migration as demographic offset"
        />
        
        <ParamSlider
          label="Redistribution Level"
          value={params.redistributionLevel}
          onChange={(v) => onParamChange('redistributionLevel', v)}
          description="Wealth transfer policies"
        />
      </div>
    </div>
  );
}
