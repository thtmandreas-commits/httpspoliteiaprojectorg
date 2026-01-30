import { AggregatedSignal } from '@/types/signals';
import { signalExamples } from '@/data/signalData';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  ChevronDown, 
  ChevronUp,
  Activity,
  AlertCircle
} from 'lucide-react';
import { useState } from 'react';

interface SignalPanelProps {
  aggregatedSignals: AggregatedSignal[];
  loopPressure: number;
  loopPressureTrend: 'increasing' | 'decreasing' | 'stable';
}

function DirectionIndicator({ direction, confidence }: { direction: number; confidence: number }) {
  const opacity = 0.4 + confidence * 0.6;
  
  if (direction > 0.2) {
    return (
      <div className="flex items-center gap-0.5" style={{ opacity }}>
        <TrendingUp className="w-4 h-4 text-flow-accelerating" />
        {direction > 0.6 && <TrendingUp className="w-3 h-3 text-flow-accelerating" />}
      </div>
    );
  }
  if (direction < -0.2) {
    return (
      <div className="flex items-center gap-0.5" style={{ opacity }}>
        <TrendingDown className="w-4 h-4 text-flow-stabilizing" />
        {direction < -0.6 && <TrendingDown className="w-3 h-3 text-flow-stabilizing" />}
      </div>
    );
  }
  return <Minus className="w-4 h-4 text-muted-foreground" style={{ opacity }} />;
}

function TrendBadge({ trend }: { trend: 'strengthening' | 'weakening' | 'holding' }) {
  if (trend === 'strengthening') {
    return (
      <span className="flex items-center gap-0.5 text-[10px] text-flow-accelerating">
        <ChevronUp className="w-3 h-3" />
        Strengthening
      </span>
    );
  }
  if (trend === 'weakening') {
    return (
      <span className="flex items-center gap-0.5 text-[10px] text-flow-stabilizing">
        <ChevronDown className="w-3 h-3" />
        Weakening
      </span>
    );
  }
  return (
    <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
      <Minus className="w-3 h-3" />
      Holding
    </span>
  );
}

function SignalCard({ signal }: { signal: AggregatedSignal }) {
  const [showExamples, setShowExamples] = useState(false);
  const examples = signalExamples[signal.category] || [];
  
  const confidenceLabel = signal.confidence > 0.7 ? 'High' : 
                          signal.confidence > 0.4 ? 'Medium' : 'Low';
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium">{signal.label}</h4>
              <TrendBadge trend={signal.trend} />
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {signal.description}
            </p>
            <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
              <span>{signal.signalCount} signals</span>
              <span>•</span>
              <span>{confidenceLabel} confidence</span>
            </div>
          </div>
          <DirectionIndicator direction={signal.netDirection} confidence={signal.confidence} />
        </div>
        
        {examples.length > 0 && (
          <div className="mt-2 pt-2 border-t">
            <button
              onClick={() => setShowExamples(!showExamples)}
              className="text-[10px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              {showExamples ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              Illustrative patterns
            </button>
            {showExamples && (
              <ul className="mt-1.5 space-y-1 text-[10px] text-muted-foreground italic">
                {examples.slice(0, 2).map((ex, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <span className="text-muted-foreground/50">•</span>
                    {ex}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function SignalPanel({ aggregatedSignals, loopPressure, loopPressureTrend }: SignalPanelProps) {
  const activeSigs = aggregatedSignals.filter(s => s.signalCount > 0);
  const accelerating = activeSigs.filter(s => s.netDirection > 0.2);
  const stabilizing = activeSigs.filter(s => s.netDirection < -0.2);
  
  const pressurePercent = Math.round(loopPressure * 100);
  const pressureLevel = loopPressure > 0.65 ? 'Elevated' : 
                        loopPressure > 0.45 ? 'Moderate' : 'Low';
  const pressureColor = loopPressure > 0.65 ? 'text-flow-accelerating' : 
                        loopPressure > 0.45 ? 'text-status-stressed' : 'text-flow-stabilizing';
  
  return (
    <div className="space-y-4">
      {/* Loop Pressure Summary */}
      <Card className="border-l-4 border-l-primary">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold">Signal Aggregation</span>
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className={cn('text-2xl font-bold', pressureColor)}>
                {pressureLevel}
              </div>
              <div className="text-xs text-muted-foreground">
                Loop pressure at {pressurePercent}%
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-xs">
                {loopPressureTrend === 'increasing' && (
                  <>
                    <TrendingUp className="w-3 h-3 text-flow-accelerating" />
                    <span className="text-flow-accelerating">Pressure increasing</span>
                  </>
                )}
                {loopPressureTrend === 'decreasing' && (
                  <>
                    <TrendingDown className="w-3 h-3 text-flow-stabilizing" />
                    <span className="text-flow-stabilizing">Pressure decreasing</span>
                  </>
                )}
                {loopPressureTrend === 'stable' && (
                  <>
                    <Minus className="w-3 h-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Pressure stable</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Pressure bar */}
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={cn(
                'h-full transition-all duration-700',
                loopPressure > 0.65 ? 'bg-flow-accelerating' : 
                loopPressure > 0.45 ? 'bg-status-stressed' : 'bg-flow-stabilizing'
              )}
              style={{ width: `${pressurePercent}%` }}
            />
          </div>
          
          <div className="flex items-center gap-2 mt-3 text-[10px] text-muted-foreground">
            <AlertCircle className="w-3 h-3" />
            <span>Aggregated from {activeSigs.reduce((sum, s) => sum + s.signalCount, 0)} directional signals</span>
          </div>
        </CardContent>
      </Card>
      
      {/* Signal Summary */}
      <div className="flex items-center gap-2 text-xs">
        <span className="px-2 py-1 rounded-full bg-flow-accelerating/10 text-flow-accelerating">
          {accelerating.length} accelerating
        </span>
        <span className="px-2 py-1 rounded-full bg-flow-stabilizing/10 text-flow-stabilizing">
          {stabilizing.length} stabilizing
        </span>
        <span className="px-2 py-1 rounded-full bg-muted text-muted-foreground">
          {activeSigs.length - accelerating.length - stabilizing.length} neutral
        </span>
      </div>
      
      {/* Individual Signals */}
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-muted-foreground">Signal Categories</h4>
        {activeSigs.map(signal => (
          <SignalCard key={signal.category} signal={signal} />
        ))}
      </div>
      
      {/* Disclaimer */}
      <p className="text-[10px] text-muted-foreground/70 text-center italic px-4">
        Signals represent directional indicators only. No predictions, prescriptions, or normative statements implied.
      </p>
    </div>
  );
}
