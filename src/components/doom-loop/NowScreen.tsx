import { useState, useCallback } from 'react';
import { useSignalEngine } from '@/hooks/useSignalEngine';
import { SignalPanel } from './SignalPanel';
import { SignalHeatmap } from './SignalHeatmap';
import { LiveSignalFetcher } from './LiveSignalFetcher';
import { CountrySignalComparison } from './CountrySignalComparison';
import { Signal } from '@/types/signals';
import { cn } from '@/lib/utils';
import { BarChart3, Globe, Grid3X3 } from 'lucide-react';

type ViewMode = 'signals' | 'heatmap' | 'countries';

export function NowScreen() {
  const [viewMode, setViewMode] = useState<ViewMode>('heatmap');
  const { aggregatedSignals, loopPressure, loopPressureTrend, addLiveSignals, timeWindowedSignals } = useSignalEngine();
  
  const handleSignalsReceived = useCallback((newSignals: Signal[]) => {
    addLiveSignals(newSignals);
  }, [addLiveSignals]);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold">Now</h3>
        <p className="text-xs text-muted-foreground mt-1">
          {viewMode === 'heatmap' 
            ? 'Aggregated directional signals across time windows.'
            : viewMode === 'signals'
            ? 'Detailed signal category analysis.'
            : 'Regional loop pressure comparison.'}
        </p>
      </div>

      {/* View Toggle */}
      <div className="flex rounded-lg bg-muted p-1">
        <button
          onClick={() => setViewMode('heatmap')}
          className={cn(
            'flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium transition-colors',
            viewMode === 'heatmap' 
              ? 'bg-background shadow-sm text-foreground' 
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Grid3X3 className="w-3.5 h-3.5" />
          Heatmap
        </button>
        <button
          onClick={() => setViewMode('signals')}
          className={cn(
            'flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium transition-colors',
            viewMode === 'signals' 
              ? 'bg-background shadow-sm text-foreground' 
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          Signals
        </button>
        <button
          onClick={() => setViewMode('countries')}
          className={cn(
            'flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium transition-colors',
            viewMode === 'countries' 
              ? 'bg-background shadow-sm text-foreground' 
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Globe className="w-3.5 h-3.5" />
          Regions
        </button>
      </div>

      {/* Live Signal Fetcher - shows on all views */}
      <LiveSignalFetcher onSignalsReceived={handleSignalsReceived} />

      {viewMode === 'heatmap' ? (
        <SignalHeatmap timeWindowedSignals={timeWindowedSignals} />
      ) : viewMode === 'signals' ? (
        <SignalPanel 
          aggregatedSignals={aggregatedSignals}
          loopPressure={loopPressure}
          loopPressureTrend={loopPressureTrend}
        />
      ) : (
        <CountrySignalComparison />
      )}
      
      {/* Privacy Notice */}
      <div className="mt-6 pt-4 border-t">
        <p className="text-[9px] text-muted-foreground/60 text-center">
          This display shows only aggregated directional signals. No raw headlines, sources, or verbatim 
          user inputs are stored. All inputs are classified into abstract categories and immediately discarded.
        </p>
      </div>
    </div>
  );
}
