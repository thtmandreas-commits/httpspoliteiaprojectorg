import { useState, useCallback } from 'react';
import { useSignalEngine } from '@/hooks/useSignalEngine';
import { SignalPanel } from './SignalPanel';
import { LiveSignalFetcher } from './LiveSignalFetcher';
import { NewsItem } from '@/types/simulation';
import { Signal } from '@/types/signals';
import { sampleNews } from '@/data/loopData';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Radio, BarChart3, Newspaper } from 'lucide-react';

const categoryConfig = {
  accelerating: {
    label: 'Loop accelerating',
    icon: TrendingUp,
    className: 'bg-flow-accelerating/10 text-flow-accelerating'
  },
  stabilizing: {
    label: 'Loop stabilizing',
    icon: TrendingDown,
    className: 'bg-flow-stabilizing/10 text-flow-stabilizing'
  },
  noise: {
    label: 'Noise',
    icon: Radio,
    className: 'bg-muted text-muted-foreground'
  }
};

function NewsCard({ item }: { item: NewsItem }) {
  const config = categoryConfig[item.category];
  const Icon = config.icon;

  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex items-start gap-2">
          <div className={cn('p-1.5 rounded', config.className)}>
            <Icon className="w-3 h-3" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium leading-tight">{item.headline}</h4>
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              <span>{item.source}</span>
              <span>•</span>
              <span>{item.date}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
              {item.summary}
            </p>
            <div className="mt-2">
              <span className={cn('text-[10px] px-2 py-0.5 rounded-full', config.className)}>
                {config.label}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

type ViewMode = 'signals' | 'headlines';

export function NowScreen() {
  const [viewMode, setViewMode] = useState<ViewMode>('signals');
  const { aggregatedSignals, loopPressure, loopPressureTrend, addLiveSignals, signals } = useSignalEngine();
  
  const handleSignalsReceived = useCallback((newSignals: Signal[]) => {
    addLiveSignals(newSignals);
  }, [addLiveSignals]);
  
  const accelerating = sampleNews.filter(n => n.category === 'accelerating');
  const stabilizing = sampleNews.filter(n => n.category === 'stabilizing');
  const noise = sampleNews.filter(n => n.category === 'noise');

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold">Now</h3>
        <p className="text-xs text-muted-foreground mt-1">
          {viewMode === 'signals' 
            ? 'Aggregated directional signals from public information.'
            : 'Sample headlines categorized by loop impact.'}
        </p>
      </div>

      {/* View Toggle */}
      <div className="flex rounded-lg bg-muted p-1">
        <button
          onClick={() => setViewMode('signals')}
          className={cn(
            'flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md text-xs font-medium transition-colors',
            viewMode === 'signals' 
              ? 'bg-background shadow-sm text-foreground' 
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          Signals
        </button>
        <button
          onClick={() => setViewMode('headlines')}
          className={cn(
            'flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md text-xs font-medium transition-colors',
            viewMode === 'headlines' 
              ? 'bg-background shadow-sm text-foreground' 
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Newspaper className="w-3.5 h-3.5" />
          Headlines
        </button>
      </div>

      {viewMode === 'signals' ? (
        <>
          {/* Live Signal Fetcher */}
          <LiveSignalFetcher onSignalsReceived={handleSignalsReceived} />
          
          <SignalPanel 
            aggregatedSignals={aggregatedSignals}
            loopPressure={loopPressure}
            loopPressureTrend={loopPressureTrend}
          />
        </>
      ) : (
        <>
          {/* Filter summary */}
          <div className="flex items-center gap-2 text-xs">
            <span className={cn('px-2 py-1 rounded-full', categoryConfig.accelerating.className)}>
              {accelerating.length} accelerating
            </span>
            <span className={cn('px-2 py-1 rounded-full', categoryConfig.stabilizing.className)}>
              {stabilizing.length} stabilizing
            </span>
            <span className={cn('px-2 py-1 rounded-full', categoryConfig.noise.className)}>
              {noise.length} noise
            </span>
          </div>

          {/* News Feed */}
          <div className="space-y-2">
            {sampleNews.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
