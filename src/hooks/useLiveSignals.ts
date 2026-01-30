import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Signal, SignalCategory } from '@/types/signals';
import { toast } from 'sonner';

interface LiveSignalResponse {
  success: boolean;
  timestamp: number;
  totalItemsScanned: number;
  signalsDetected: number;
  categoriesFound: number;
  signals: Array<{
    id: string;
    category: string;
    direction: 'increasing' | 'decreasing' | 'stable';
    strength: 'weak' | 'moderate' | 'strong';
    timestamp: number;
    affectedNodes: string[];
    weight: number;
    sourceHint?: string;
  }>;
  aggregated: Record<string, {
    count: number;
    avgWeight: number;
    dominantDirection: 'increasing' | 'decreasing' | 'stable';
  }>;
}

export function useLiveSignals() {
  const [isLoading, setIsLoading] = useState(false);
  const [lastFetched, setLastFetched] = useState<number | null>(null);
  const [liveSignals, setLiveSignals] = useState<Signal[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchLiveSignals = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('fetch-signals');

      if (fnError) {
        throw new Error(fnError.message);
      }

      const response = data as LiveSignalResponse;

      if (!response.success) {
        throw new Error('Failed to fetch signals');
      }

      // Convert API signals to app Signal format
      const signals: Signal[] = response.signals.map(s => ({
        id: s.id,
        category: s.category as SignalCategory,
        direction: s.direction,
        strength: s.strength,
        timestamp: s.timestamp,
        affectedNodes: s.affectedNodes,
        weight: s.weight,
      }));

      setLiveSignals(signals);
      setLastFetched(response.timestamp);
      
      toast.success(`Ingested ${signals.length} signals from ${response.totalItemsScanned} sources`);

      return {
        signals,
        totalScanned: response.totalItemsScanned,
        categoriesFound: response.categoriesFound,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch live signals';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    liveSignals,
    isLoading,
    lastFetched,
    error,
    fetchLiveSignals,
  };
}
