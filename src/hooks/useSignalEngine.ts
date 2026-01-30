import { useState, useMemo, useCallback } from 'react';
import { 
  Signal, 
  SignalCategory, 
  AggregatedSignal, 
  SignalEngineState,
  signalCategoryMeta 
} from '@/types/signals';
import { sampleSignals } from '@/data/signalData';

const SIGNAL_DECAY_DAYS = 7; // Signals older than this have reduced weight

function calculateSignalValue(signal: Signal): number {
  const directionValue = signal.direction === 'increasing' ? 1 : 
                         signal.direction === 'decreasing' ? -1 : 0;
  const strengthMultiplier = signal.strength === 'strong' ? 1 : 
                             signal.strength === 'moderate' ? 0.6 : 0.3;
  
  // Apply time decay
  const ageInDays = (Date.now() - signal.timestamp) / (86400000);
  const decayFactor = Math.max(0.2, 1 - (ageInDays / SIGNAL_DECAY_DAYS) * 0.5);
  
  return directionValue * strengthMultiplier * signal.weight * decayFactor;
}

function aggregateSignalsByCategory(signals: Signal[]): AggregatedSignal[] {
  const categories = Object.keys(signalCategoryMeta) as SignalCategory[];
  
  return categories.map(category => {
    const categorySignals = signals.filter(s => s.category === category);
    const meta = signalCategoryMeta[category];
    
    if (categorySignals.length === 0) {
      return {
        category,
        label: meta.label,
        description: meta.description,
        netDirection: 0,
        confidence: 0,
        signalCount: 0,
        trend: 'holding' as const,
        affectedNodes: meta.affectedNodes
      };
    }
    
    // Calculate net direction
    const totalValue = categorySignals.reduce((sum, s) => sum + calculateSignalValue(s), 0);
    const netDirection = Math.max(-1, Math.min(1, totalValue / categorySignals.length));
    
    // Calculate confidence based on signal consistency
    const directions = categorySignals.map(s => s.direction);
    const dominantDirection = directions.filter(d => d === directions[0]).length;
    const consistency = dominantDirection / categorySignals.length;
    const volumeFactor = Math.min(1, categorySignals.length / 5); // More signals = more confidence
    const confidence = consistency * 0.6 + volumeFactor * 0.4;
    
    // Determine trend by comparing recent vs older signals
    const midpoint = Date.now() - 86400000 * 3;
    const recentSignals = categorySignals.filter(s => s.timestamp > midpoint);
    const olderSignals = categorySignals.filter(s => s.timestamp <= midpoint);
    
    const recentAvg = recentSignals.length > 0 
      ? recentSignals.reduce((sum, s) => sum + calculateSignalValue(s), 0) / recentSignals.length 
      : 0;
    const olderAvg = olderSignals.length > 0 
      ? olderSignals.reduce((sum, s) => sum + calculateSignalValue(s), 0) / olderSignals.length 
      : 0;
    
    let trend: 'strengthening' | 'weakening' | 'holding' = 'holding';
    if (Math.abs(recentAvg) > Math.abs(olderAvg) * 1.2) trend = 'strengthening';
    else if (Math.abs(recentAvg) < Math.abs(olderAvg) * 0.8) trend = 'weakening';
    
    return {
      category,
      label: meta.label,
      description: meta.description,
      netDirection,
      confidence,
      signalCount: categorySignals.length,
      trend,
      affectedNodes: meta.affectedNodes
    };
  });
}

function calculateLoopPressure(aggregatedSignals: AggregatedSignal[]): number {
  // Weight signals that accelerate the doom loop positively
  const acceleratingCategories: SignalCategory[] = [
    'automation_adoption',
    'capital_efficiency',
    'fiscal_pressure',
    'demographic_shift'
  ];
  
  let pressure = 0;
  let totalWeight = 0;
  
  aggregatedSignals.forEach(signal => {
    const isAccelerating = acceleratingCategories.includes(signal.category);
    const categoryWeight = signal.confidence * 0.5 + 0.5;
    
    // For accelerating categories, positive direction increases pressure
    // For stabilizing categories (labor_demand, consumption), negative direction increases pressure
    let contribution: number;
    if (isAccelerating) {
      contribution = signal.netDirection * categoryWeight;
    } else if (signal.category === 'labor_demand' || signal.category === 'consumption_patterns') {
      contribution = -signal.netDirection * categoryWeight;
    } else {
      contribution = Math.abs(signal.netDirection) * categoryWeight * 0.5;
    }
    
    pressure += contribution;
    totalWeight += categoryWeight;
  });
  
  return totalWeight > 0 ? Math.max(0, Math.min(1, (pressure / totalWeight + 1) / 2)) : 0.5;
}

export function useSignalEngine(initialSignals: Signal[] = sampleSignals) {
  const [signals, setSignals] = useState<Signal[]>(initialSignals);
  
  const aggregatedSignals = useMemo(() => 
    aggregateSignalsByCategory(signals), [signals]
  );
  
  const loopPressure = useMemo(() => 
    calculateLoopPressure(aggregatedSignals), [aggregatedSignals]
  );
  
  const loopPressureTrend = useMemo((): 'increasing' | 'decreasing' | 'stable' => {
    const trendCounts = aggregatedSignals.reduce((acc, s) => {
      if (s.trend === 'strengthening') acc.strengthening++;
      else if (s.trend === 'weakening') acc.weakening++;
      return acc;
    }, { strengthening: 0, weakening: 0 });
    
    if (trendCounts.strengthening > trendCounts.weakening + 1) return 'increasing';
    if (trendCounts.weakening > trendCounts.strengthening + 1) return 'decreasing';
    return 'stable';
  }, [aggregatedSignals]);
  
  const addSignal = useCallback((signal: Omit<Signal, 'id' | 'timestamp'>) => {
    const newSignal: Signal = {
      ...signal,
      id: `s${Date.now()}`,
      timestamp: Date.now()
    };
    setSignals(prev => [newSignal, ...prev]);
  }, []);

  // Add multiple live signals from external source
  const addLiveSignals = useCallback((newSignals: Signal[]) => {
    setSignals(prev => {
      // Merge new signals, avoiding duplicates by ID
      const existingIds = new Set(prev.map(s => s.id));
      const uniqueNew = newSignals.filter(s => !existingIds.has(s.id));
      return [...uniqueNew, ...prev];
    });
  }, []);
  
  // Get signals that affect a specific node
  const getNodeSignals = useCallback((nodeId: string) => {
    return aggregatedSignals.filter(s => s.affectedNodes.includes(nodeId));
  }, [aggregatedSignals]);
  
  // Get intensity modifier for a node based on signals
  const getNodeIntensityModifier = useCallback((nodeId: string): number => {
    const nodeSignals = aggregatedSignals.filter(s => s.affectedNodes.includes(nodeId));
    if (nodeSignals.length === 0) return 0;
    
    const avgDirection = nodeSignals.reduce((sum, s) => sum + s.netDirection * s.confidence, 0) / nodeSignals.length;
    return avgDirection * 0.2; // Signals modify intensity by up to ±20%
  }, [aggregatedSignals]);
  
  const state: SignalEngineState = {
    signals,
    aggregatedSignals,
    lastUpdated: Date.now(),
    loopPressure,
    loopPressureTrend
  };
  
  return {
    state,
    signals,
    aggregatedSignals,
    loopPressure,
    loopPressureTrend,
    addSignal,
    addLiveSignals,
    getNodeSignals,
    getNodeIntensityModifier
  };
}
