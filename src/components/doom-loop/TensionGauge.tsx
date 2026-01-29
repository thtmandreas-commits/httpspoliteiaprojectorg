import { cn } from '@/lib/utils';

interface TensionGaugeProps {
  tension: number;
  level: 'stable' | 'stressed' | 'critical';
  className?: string;
}

const levelConfig = {
  stable: {
    label: 'Stable',
    color: 'bg-status-stable',
    textColor: 'text-status-stable',
    description: 'System under control'
  },
  stressed: {
    label: 'Stressed',
    color: 'bg-status-stressed',
    textColor: 'text-status-stressed',
    description: 'Growing instability'
  },
  critical: {
    label: 'Critical',
    color: 'bg-status-critical',
    textColor: 'text-status-critical',
    description: 'Reinforcing breakdown'
  }
};

export function TensionGauge({ tension, level, className }: TensionGaugeProps) {
  const config = levelConfig[level];
  
  return (
    <div className={cn('p-4 rounded-lg bg-card border', className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">System Tension</span>
        <span className={cn('text-sm font-semibold', config.textColor)}>
          {config.label}
        </span>
      </div>
      
      <div className="h-3 bg-muted rounded-full overflow-hidden mb-2">
        <div
          className={cn('h-full transition-all duration-700 ease-out', config.color)}
          style={{ width: `${tension * 100}%` }}
        />
      </div>
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>0%</span>
        <span className={config.textColor}>{config.description}</span>
        <span>100%</span>
      </div>
    </div>
  );
}
