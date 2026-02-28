// Signal Engine Types - Fixed 13-category taxonomy for loop variable modulation
// These categories represent system-level stress indicators, not news content

export type SignalCategory = 
  // Capital-Labor Domain
  | 'capital_labor_decoupling'
  | 'automation_substitution'
  | 'wage_compression'
  // Demographic Domain
  | 'family_formation_friction'
  | 'fertility_decline'
  | 'dependency_ratio_stress'
  // Fiscal Domain
  | 'tax_base_erosion'
  | 'welfare_system_strain'
  // Political Domain
  | 'policy_paralysis'
  | 'legitimacy_erosion'
  // Price Domain
  | 'deflationary_pressure'
  // Adaptation Domain
  | 'redistribution_experimentation'
  | 'structural_adaptation';

export type SignalDirection = 'increasing' | 'decreasing' | 'stable';

export type SignalStrength = 'weak' | 'moderate' | 'strong';

export type TimeWindow = '7d' | '30d' | '90d';

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

// Time-windowed aggregation for heatmap
export interface TimeWindowedSignal {
  category: SignalCategory;
  windows: Record<TimeWindow, {
    direction: number; // -1 to 1
    confidence: number; // 0 to 1 (opacity)
    signalCount: number;
  }>;
}

export interface SignalEngineState {
  signals: Signal[];
  aggregatedSignals: AggregatedSignal[];
  timeWindowedSignals: TimeWindowedSignal[];
  lastUpdated: number;
  // Overall loop pressure derived from all signals
  loopPressure: number;
  loopPressureTrend: 'increasing' | 'decreasing' | 'stable';
}

// Domain groupings for UI organization
export const signalDomains = {
  capital_labor: {
    label: 'Capital–Labor',
    categories: ['capital_labor_decoupling', 'automation_substitution', 'wage_compression'] as SignalCategory[]
  },
  demographic: {
    label: 'Demographic',
    categories: ['family_formation_friction', 'fertility_decline', 'dependency_ratio_stress'] as SignalCategory[]
  },
  fiscal: {
    label: 'Fiscal',
    categories: ['tax_base_erosion', 'welfare_system_strain'] as SignalCategory[]
  },
  political: {
    label: 'Political',
    categories: ['policy_paralysis', 'legitimacy_erosion'] as SignalCategory[]
  },
  price: {
    label: 'Price',
    categories: ['deflationary_pressure'] as SignalCategory[]
  },
  adaptation: {
    label: 'Adaptation',
    categories: ['redistribution_experimentation', 'structural_adaptation'] as SignalCategory[]
  }
};

// Category metadata for display
export const signalCategoryMeta: Record<SignalCategory, { 
  label: string; 
  description: string;
  affectedNodes: string[];
  isAccelerating: boolean; // true = stress signal, false = stabilizing signal
}> = {
  capital_labor_decoupling: {
    label: 'Capital–Labor Decoupling',
    description: 'Divergence between capital returns and labor compensation',
    affectedNodes: ['capital', 'income'],
    isAccelerating: true
  },
  automation_substitution: {
    label: 'Automation Substitution',
    description: 'Replacement of human labor by automated systems',
    affectedNodes: ['ai', 'labor'],
    isAccelerating: true
  },
  wage_compression: {
    label: 'Wage Compression',
    description: 'Downward pressure on wages across skill levels',
    affectedNodes: ['income', 'consumption'],
    isAccelerating: true
  },
  family_formation_friction: {
    label: 'Family Formation Friction',
    description: 'Barriers to household formation and childbearing',
    affectedNodes: ['fertility', 'consumption'],
    isAccelerating: true
  },
  fertility_decline: {
    label: 'Fertility Decline Momentum',
    description: 'Self-reinforcing decline in birth rates',
    affectedNodes: ['fertility', 'aging'],
    isAccelerating: true
  },
  dependency_ratio_stress: {
    label: 'Dependency Ratio Stress',
    description: 'Rising ratio of dependents to working-age population',
    affectedNodes: ['aging', 'fiscal'],
    isAccelerating: true
  },
  tax_base_erosion: {
    label: 'Tax Base Erosion',
    description: 'Shrinking revenue base from employment and consumption',
    affectedNodes: ['fiscal', 'income'],
    isAccelerating: true
  },
  welfare_system_strain: {
    label: 'Welfare System Strain',
    description: 'Growing gap between obligations and resources',
    affectedNodes: ['fiscal', 'aging'],
    isAccelerating: true
  },
  policy_paralysis: {
    label: 'Policy Paralysis',
    description: 'Inability to implement structural reforms',
    affectedNodes: ['fiscal', 'labor'],
    isAccelerating: true
  },
  legitimacy_erosion: {
    label: 'Legitimacy Erosion',
    description: 'Declining trust in institutions and social contract',
    affectedNodes: ['consumption', 'fertility'],
    isAccelerating: true
  },
  redistribution_experimentation: {
    label: 'Redistribution Experimentation',
    description: 'Novel approaches to income and wealth redistribution',
    affectedNodes: ['income', 'capital'],
    isAccelerating: false
  },
  structural_adaptation: {
    label: 'Structural Adaptation Capacity',
    description: 'System flexibility and reform implementation',
    affectedNodes: ['labor', 'fiscal'],
    isAccelerating: false
  },
  deflationary_pressure: {
    label: 'Deflationary Pressure',
    description: 'AI-driven price collapse squeezing margins and fiscal revenue while boosting consumer purchasing power',
    affectedNodes: ['capital', 'fiscal', 'consumption'],
    isAccelerating: true
  }
};
