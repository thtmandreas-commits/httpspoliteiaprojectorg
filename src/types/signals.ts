// Signal Engine Types - Abstract signal categories for loop variable modulation

export type SignalCategory = 
  | 'automation_adoption'
  | 'labor_demand'
  | 'capital_efficiency'
  | 'fiscal_pressure'
  | 'demographic_shift'
  | 'income_distribution'
  | 'consumption_patterns'
  | 'workforce_participation';

export type SignalDirection = 'increasing' | 'decreasing' | 'stable';

export type SignalStrength = 'weak' | 'moderate' | 'strong';

export interface Signal {
  id: string;
  category: SignalCategory;
  direction: SignalDirection;
  strength: SignalStrength;
  timestamp: number;
  // Maps to loop node IDs this signal affects
  affectedNodes: string[];
  // Weight multiplier for aggregation (0.1 to 1.0)
  weight: number;
}

export interface AggregatedSignal {
  category: SignalCategory;
  label: string;
  description: string;
  // Net direction after aggregation (-1 to 1)
  netDirection: number;
  // Confidence based on signal volume and consistency (0 to 1)
  confidence: number;
  // Number of signals aggregated
  signalCount: number;
  // Trend over time: strengthening, weakening, or holding
  trend: 'strengthening' | 'weakening' | 'holding';
  // Which loop nodes this affects
  affectedNodes: string[];
}

export interface SignalEngineState {
  signals: Signal[];
  aggregatedSignals: AggregatedSignal[];
  lastUpdated: number;
  // Overall loop pressure derived from all signals
  loopPressure: number;
  loopPressureTrend: 'increasing' | 'decreasing' | 'stable';
}

// Category metadata for display
export const signalCategoryMeta: Record<SignalCategory, { 
  label: string; 
  description: string;
  affectedNodes: string[];
}> = {
  automation_adoption: {
    label: 'Automation Adoption',
    description: 'Rate of AI/robotics deployment in productive sectors',
    affectedNodes: ['ai', 'labor']
  },
  labor_demand: {
    label: 'Labor Demand',
    description: 'Aggregate demand for human workers across industries',
    affectedNodes: ['labor', 'income']
  },
  capital_efficiency: {
    label: 'Capital Efficiency',
    description: 'Returns on capital investment relative to labor',
    affectedNodes: ['capital', 'ai']
  },
  fiscal_pressure: {
    label: 'Fiscal Pressure',
    description: 'Strain on public finances from obligations vs revenue',
    affectedNodes: ['fiscal', 'aging']
  },
  demographic_shift: {
    label: 'Demographic Shift',
    description: 'Changes in population age structure and fertility',
    affectedNodes: ['fertility', 'aging']
  },
  income_distribution: {
    label: 'Income Distribution',
    description: 'Spread of income across population segments',
    affectedNodes: ['income', 'consumption', 'capital']
  },
  consumption_patterns: {
    label: 'Consumption Patterns',
    description: 'Aggregate consumer spending behavior',
    affectedNodes: ['consumption', 'fiscal']
  },
  workforce_participation: {
    label: 'Workforce Participation',
    description: 'Share of population actively engaged in labor',
    affectedNodes: ['labor', 'aging', 'fiscal']
  }
};
