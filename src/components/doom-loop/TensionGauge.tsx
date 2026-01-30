import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';

interface TensionGaugeProps {
  tension: number;
  level: 'stable' | 'stressed' | 'critical';
  className?: string;
  // Signal-driven additions
  signalPressure?: number;
  signalTrend?: 'increasing' | 'decreasing' | 'stable';
  hasSignalData?: boolean;
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

const TrendIcon = ({ trend }: { trend: 'increasing' | 'decreasing' | 'stable' }) => {
  if (trend === 'increasing') return <TrendingUp className="w-3 h-3 text-flow-accelerating" />;
  if (trend === 'decreasing') return <TrendingDown className="w-3 h-3 text-flow-stabilizing" />;
  return <Minus className="w-3 h-3 text-muted-foreground" />;
};

export function TensionGauge({ 
  tension, 
  level, 
  className,
  signalPressure = 0,
  signalTrend = 'stable',
  hasSignalData = false
}: TensionGaugeProps) {
  const config = levelConfig[level];
  
  return (
    <div className={cn('p-4 rounded-lg bg-card border', className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">System Tension</span>
        <span className={cn('text-sm font-semibold', config.textColor)}>
          {config.label}
        </span>
      </div>
      
      {/* Main tension bar */}
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

      {/* Signal pressure indicator - only show when signal data exists */}
      {hasSignalData && (
        <div className="mt-3 pt-3 border-t border-border/50">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Live Signal Pressure</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendIcon trend={signalTrend} />
              <span className="text-xs font-medium">
                {Math.round(signalPressure * 100)}%
              </span>
            </div>
          </div>
          
          {/* Signal pressure mini bar */}
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full transition-all duration-500',
                signalPressure > 0.7 ? 'bg-flow-accelerating' :
                signalPressure > 0.4 ? 'bg-status-stressed' :
                'bg-flow-stabilizing'
              )}
              style={{ width: `${signalPressure * 100}%` }}
            />
          </div>
          
          <p className="text-[9px] text-muted-foreground/70 mt-1.5 text-center">
            Derived from real-time signal aggregation
          </p>
        </div>
      )}
    </div>
  );
}
