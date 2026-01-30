import { useState, useCallback, useMemo } from 'react';
import { SimulationParams, LoopNode } from '@/types/simulation';
import { loopNodes, loopConnections } from '@/data/loopData';

const defaultParams: SimulationParams = {
  aiAdoptionSpeed: 50,
  incomeFloorRedistribution: 50,
  immigrationOpenness: 50,
  costOfLivingPressure: 50,
  stateCapacity: 50
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
    const { 
      aiAdoptionSpeed, 
      incomeFloorRedistribution, 
      immigrationOpenness, 
      costOfLivingPressure, 
      stateCapacity 
    } = params;
    
    // Calculate intensities with counteracting effects
    // Higher AI adoption increases labor displacement but state capacity can partially buffer
    const aiIntensity = (aiAdoptionSpeed / 100) * (1 - stateCapacity * 0.002);
    
    // Labor stress from AI, partially offset by redistribution
    const laborIntensity = Math.min(1, aiIntensity * 0.8 * (1 - incomeFloorRedistribution * 0.003));
    
    // Income affected by labor, cost of living, and redistribution (counteracting)
    const incomeIntensity = Math.min(1, 
      (laborIntensity * 0.6 + costOfLivingPressure / 100 * 0.4) * 
      (1 - incomeFloorRedistribution * 0.004)
    );
    
    // Consumption follows income but cost of living creates drag
    const consumptionIntensity = Math.min(1, 
      incomeIntensity * 0.7 + (costOfLivingPressure / 100) * 0.3
    );
    
    // Fertility affected by income stress, cost of living, and immigration can offset
    const fertilityIntensity = Math.min(1, 
      incomeIntensity * 0.5 + (costOfLivingPressure / 100) * 0.3 - 
      (immigrationOpenness / 100) * 0.2
    );
    
    // Aging stress offset by immigration, but limited by state capacity
    const agingIntensity = Math.min(1, 
      Math.max(0, fertilityIntensity * 0.6 - (immigrationOpenness / 100) * 0.3) * 
      (1 - stateCapacity * 0.003)
    );
    
    // Fiscal pressure from aging and consumption decline, state capacity helps
    const fiscalIntensity = Math.min(1, 
      (agingIntensity * 0.4 + consumptionIntensity * 0.3 + incomeFloorRedistribution / 100 * 0.3) *
      (1 - stateCapacity * 0.004)
    );
    
    // Capital concentration from AI, redistribution creates counterforce
    const capitalIntensity = Math.min(1, 
      aiIntensity * 0.7 * (1 - incomeFloorRedistribution * 0.005)
    );

    return {
      ai: Math.max(0, aiIntensity),
      labor: Math.max(0, laborIntensity),
      income: Math.max(0, incomeIntensity),
      consumption: Math.max(0, consumptionIntensity),
      fertility: Math.max(0, fertilityIntensity),
      aging: Math.max(0, agingIntensity),
      fiscal: Math.max(0, fiscalIntensity),
      capital: Math.max(0, capitalIntensity)
    };
  }, [params]);

  // Calculate trends - often neutral due to counteracting effects
  const nodeTrends = useMemo(() => {
    const { 
      aiAdoptionSpeed, 
      incomeFloorRedistribution, 
      immigrationOpenness,
      stateCapacity 
    } = params;
    
    const getTrend = (intensity: number, counterforce: number): 'up' | 'down' | 'neutral' => {
      const netEffect = intensity - counterforce;
      // Higher threshold for showing trend - most things stay neutral
      if (netEffect > 0.25) return 'up';
      if (netEffect < -0.25) return 'down';
      return 'neutral';
    };

    return {
      ai: aiAdoptionSpeed > 70 ? 'up' : aiAdoptionSpeed < 30 ? 'down' : 'neutral',
      labor: getTrend(nodeIntensities.labor, incomeFloorRedistribution * 0.008),
      income: getTrend(nodeIntensities.income, incomeFloorRedistribution * 0.006),
      consumption: 'neutral' as const, // Consumption trends are ambiguous
      fertility: getTrend(nodeIntensities.fertility, immigrationOpenness * 0.005),
      aging: getTrend(nodeIntensities.aging, immigrationOpenness * 0.006),
      fiscal: getTrend(nodeIntensities.fiscal, stateCapacity * 0.008),
      capital: getTrend(nodeIntensities.capital, incomeFloorRedistribution * 0.007)
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
      ai: 0.15,
      labor: 0.15,
      income: 0.15,
      consumption: 0.1,
      fertility: 0.1,
      aging: 0.15,
      fiscal: 0.15,
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
