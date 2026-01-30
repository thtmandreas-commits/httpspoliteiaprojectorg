import { useState, useCallback, useMemo } from 'react';
import { SimulationParams, LoopNode } from '@/types/simulation';
import { loopNodes, loopConnections } from '@/data/loopData';

const defaultParams: SimulationParams = {
  aiAdoptionSpeed: 50,
  welfareLevel: 50,
  immigrationRate: 30,
  redistributionLevel: 40
};

export function useSimulation(initialParams: SimulationParams = defaultParams) {
  const [params, setParams] = useState<SimulationParams>(initialParams);

  const updateParam = useCallback((key: keyof SimulationParams, value: number) => {
    setParams(prev => ({ ...prev, [key]: value }));
  }, []);

  const setAllParams = useCallback((newParams: SimulationParams) => {
    setParams(newParams);
  }, []);

  const resetParams = useCallback(() => {
    setParams(defaultParams);
  }, []);

  const nodeIntensities = useMemo(() => {
    const { aiAdoptionSpeed, welfareLevel, immigrationRate, redistributionLevel } = params;
    
    // Calculate intensities based on parameters
    const aiIntensity = aiAdoptionSpeed / 100;
    const laborIntensity = Math.min(1, aiIntensity * 0.85 * (1 - welfareLevel * 0.002));
    const incomeIntensity = Math.min(1, laborIntensity * 0.8 * (1 - redistributionLevel * 0.003));
    const consumptionIntensity = Math.min(1, incomeIntensity * 0.75);
    const fertilityIntensity = Math.min(1, incomeIntensity * 0.6 * (1 - welfareLevel * 0.004));
    const agingIntensity = Math.min(1, fertilityIntensity * 0.7 + (1 - immigrationRate / 100) * 0.3);
    const fiscalIntensity = Math.min(1, (agingIntensity * 0.5 + consumptionIntensity * 0.3) * (1 - redistributionLevel * 0.002));
    const capitalIntensity = Math.min(1, aiIntensity * 0.8 * (1 - redistributionLevel * 0.005));

    return {
      ai: aiIntensity,
      labor: laborIntensity,
      income: incomeIntensity,
      consumption: consumptionIntensity,
      fertility: fertilityIntensity,
      aging: agingIntensity,
      fiscal: fiscalIntensity,
      capital: capitalIntensity
    };
  }, [params]);

  // Calculate trends based on parameter values
  const nodeTrends = useMemo(() => {
    const { aiAdoptionSpeed, welfareLevel, immigrationRate, redistributionLevel } = params;
    
    const getTrend = (intensity: number, mitigationFactor: number): 'up' | 'down' | 'neutral' => {
      const netEffect = intensity - mitigationFactor;
      if (netEffect > 0.15) return 'up';
      if (netEffect < -0.15) return 'down';
      return 'neutral';
    };

    return {
      ai: aiAdoptionSpeed > 60 ? 'up' : aiAdoptionSpeed < 40 ? 'down' : 'neutral',
      labor: getTrend(nodeIntensities.labor, welfareLevel * 0.005),
      income: nodeIntensities.income > 0.4 ? 'down' : 'up', // Income decline is bad
      consumption: nodeIntensities.consumption > 0.4 ? 'down' : 'up',
      fertility: nodeIntensities.fertility > 0.3 ? 'down' : 'neutral',
      aging: immigrationRate > 40 ? 'neutral' : 'up',
      fiscal: getTrend(nodeIntensities.fiscal, redistributionLevel * 0.003),
      capital: redistributionLevel > 50 ? 'neutral' : 'up'
    } as Record<string, 'up' | 'down' | 'neutral'>;
  }, [params, nodeIntensities]);

  const computedNodes = useMemo((): LoopNode[] => {
    return loopNodes.map(node => ({
      ...node,
      intensity: nodeIntensities[node.id as keyof typeof nodeIntensities] || 0.5,
      trend: nodeTrends[node.id] || 'neutral'
    }));
  }, [nodeIntensities, nodeTrends]);

  const overallTension = useMemo(() => {
    const weights = {
      ai: 0.2,
      labor: 0.2,
      income: 0.15,
      consumption: 0.1,
      fertility: 0.1,
      aging: 0.1,
      fiscal: 0.1,
      capital: 0.05
    };
    
    let tension = 0;
    Object.entries(nodeIntensities).forEach(([key, value]) => {
      tension += value * (weights[key as keyof typeof weights] || 0);
    });
    
    return Math.min(1, tension);
  }, [nodeIntensities]);

  const tensionLevel = useMemo((): 'stable' | 'stressed' | 'critical' => {
    if (overallTension < 0.35) return 'stable';
    if (overallTension < 0.6) return 'stressed';
    return 'critical';
  }, [overallTension]);

  return {
    params,
    updateParam,
    setAllParams,
    resetParams,
    nodes: computedNodes,
    connections: loopConnections,
    nodeIntensities,
    nodeTrends,
    overallTension,
    tensionLevel
  };
}
