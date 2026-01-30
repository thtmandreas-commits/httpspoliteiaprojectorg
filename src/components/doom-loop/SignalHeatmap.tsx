import { TimeWindowedSignal, TimeWindow, signalCategoryMeta, signalDomains, SignalCategory } from '@/types/signals';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

interface SignalHeatmapProps {
  timeWindowedSignals: TimeWindowedSignal[];
}

const windows: TimeWindow[] = ['7d', '30d', '90d'];

function HeatmapCell({ direction, confidence }: { direction: number; confidence: number }) {
  // Direction determines color: positive = red (stress), negative = blue (stabilizing), neutral = grey
  // Confidence determines opacity
  
  const getColorClass = () => {
    if (Math.abs(direction) < 0.15) return 'bg-muted-foreground';
    if (direction > 0) return 'bg-flow-accelerating';
    return 'bg-flow-stabilizing';
  };
  
  const opacity = 0.2 + confidence * 0.7;
  
  return (
    <div 
      className={cn('w-full h-6 rounded-sm transition-all', getColorClass())}
      style={{ opacity }}
      title={`Direction: ${direction > 0 ? '+' : ''}${(direction * 100).toFixed(0)}%, Confidence: ${(confidence * 100).toFixed(0)}%`}
    />
  );
}

function DomainGroup({ 
  label, 
  categories, 
  signals 
}: { 
  label: string; 
  categories: SignalCategory[];
  signals: TimeWindowedSignal[];
}) {
  return (
    <div className="mb-3 last:mb-0">
      <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 px-1">
        {label}
      </div>
      <div className="space-y-1">
        {categories.map(category => {
          const signalData = signals.find(s => s.category === category);
          const meta = signalCategoryMeta[category];
          
          return (
            <div key={category} className="grid grid-cols-[1fr_auto] gap-2 items-center">
              <div className="text-[11px] truncate pl-1" title={meta.description}>
                {meta.label}
              </div>
              <div className="grid grid-cols-3 gap-1 w-20">
                {windows.map(window => {
                  const windowData = signalData?.windows[window] || { direction: 0, confidence: 0.1 };
                  return (
                    <HeatmapCell 
                      key={window}
                      direction={windowData.direction}
                      confidence={windowData.confidence}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SignalHeatmap({ timeWindowedSignals }: SignalHeatmapProps) {
  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-semibold">Signal Heatmap</h4>
          <div className="grid grid-cols-3 gap-1 w-20 text-[9px] text-muted-foreground text-center">
            <span>7d</span>
            <span>30d</span>
            <span>90d</span>
          </div>
        </div>
        
        {Object.entries(signalDomains).map(([key, domain]) => (
          <DomainGroup
            key={key}
            label={domain.label}
            categories={domain.categories}
            signals={timeWindowedSignals}
          />
        ))}
        
        {/* Legend */}
        <div className="mt-4 pt-3 border-t flex items-center justify-center gap-4 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-flow-accelerating opacity-70" />
            <span>Accelerating</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-muted-foreground opacity-50" />
            <span>Neutral</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-flow-stabilizing opacity-70" />
            <span>Stabilizing</span>
          </div>
        </div>
        
        <div className="mt-2 flex items-start gap-1.5 text-[9px] text-muted-foreground/60">
          <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
          <span>Opacity indicates confidence. Directional indicators only—no precise values implied.</span>
        </div>
      </CardContent>
    </Card>
  );
}
