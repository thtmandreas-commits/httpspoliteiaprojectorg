import { useEffect, useState, useCallback } from 'react';
import { useLiveSignals } from '@/hooks/useLiveSignals';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { RefreshCw, Wifi, WifiOff, Clock, Zap, Play, Pause } from 'lucide-react';
import { Signal } from '@/types/signals';

const AUTO_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

interface LiveSignalFetcherProps {
  onSignalsReceived: (signals: Signal[]) => void;
}

export function LiveSignalFetcher({ onSignalsReceived }: LiveSignalFetcherProps) {
  const { isLoading, lastFetched, error, fetchLiveSignals, liveSignals } = useLiveSignals();
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [nextRefreshIn, setNextRefreshIn] = useState<number | null>(null);

  const handleFetch = useCallback(async () => {
    const result = await fetchLiveSignals();
    if (result?.signals) {
      onSignalsReceived(result.signals);
    }
  }, [fetchLiveSignals, onSignalsReceived]);

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh) {
      setNextRefreshIn(null);
      return;
    }

    // Initial fetch on mount
    handleFetch();

    // Set up interval for periodic refresh
    const intervalId = setInterval(() => {
      handleFetch();
    }, AUTO_REFRESH_INTERVAL);

    // Countdown timer
    let countdownStart = Date.now();
    const countdownId = setInterval(() => {
      const elapsed = Date.now() - countdownStart;
      const remaining = Math.max(0, AUTO_REFRESH_INTERVAL - elapsed);
      setNextRefreshIn(Math.ceil(remaining / 1000));
      
      if (remaining <= 0) {
        countdownStart = Date.now();
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
      clearInterval(countdownId);
    };
  }, [autoRefresh, handleFetch]);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const timeSinceLastFetch = lastFetched 
    ? Math.round((Date.now() - lastFetched) / 60000) 
    : null;

  return (
    <Card className="border-dashed">
      <CardContent className="p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className={cn(
              'w-2 h-2 rounded-full',
              error ? 'bg-destructive' : 
              autoRefresh ? 'bg-flow-stabilizing animate-pulse' : 
              lastFetched ? 'bg-flow-stabilizing' : 'bg-muted-foreground'
            )} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-xs font-medium">
                <Zap className="w-3 h-3 text-primary" />
                <span>Live Signal Ingestion</span>
                {autoRefresh && nextRefreshIn !== null && (
                  <span className="text-[10px] text-muted-foreground font-normal">
                    (next: {formatCountdown(nextRefreshIn)})
                  </span>
                )}
              </div>
              {lastFetched ? (
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                  <Clock className="w-2.5 h-2.5" />
                  <span>
                    Last updated {formatTime(lastFetched)}
                    {timeSinceLastFetch !== null && timeSinceLastFetch > 0 && 
                      ` (${timeSinceLastFetch}m ago)`
                    }
                  </span>
                </div>
              ) : (
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  {autoRefresh ? 'Auto-refreshing every 5 minutes' : 'Fetch real-time signals from public sources'}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              variant={autoRefresh ? "default" : "outline"}
              onClick={() => setAutoRefresh(!autoRefresh)}
              className="h-8 w-8 p-0"
              title={autoRefresh ? "Pause auto-refresh" : "Enable auto-refresh"}
            >
              {autoRefresh ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleFetch}
              disabled={isLoading}
              className="h-8 px-3 text-xs"
            >
              <RefreshCw className={cn('w-3 h-3 mr-1.5', isLoading && 'animate-spin')} />
              {isLoading ? 'Fetching...' : 'Fetch'}
            </Button>
          </div>
        </div>

        {error && (
          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-destructive">
            <WifiOff className="w-3 h-3" />
            <span>{error}</span>
          </div>
        )}

        {liveSignals.length > 0 && !error && (
          <div className="mt-2 pt-2 border-t">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-muted-foreground">
                {liveSignals.length} signals ingested
              </span>
              <div className="flex items-center gap-1 text-flow-stabilizing">
                <Wifi className="w-3 h-3" />
                <span>{autoRefresh ? 'Auto-connected' : 'Connected'}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
