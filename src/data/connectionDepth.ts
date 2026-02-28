import { LoopConnection } from '@/types/simulation';

export interface LinkDepthData {
  connectionId: string;
  name: string;
  effectType: 'reinforcing' | 'balancing';
  sensitivity: 'low' | 'medium' | 'high';
  amplifiers: string[];
  dampeners: string[];
}

// Extended connection data with depth information
export const connectionDepthData: Record<string, Omit<LinkDepthData, 'connectionId'>> = {
  'ai->labor': {
    name: 'Automation Displacement',
    effectType: 'reinforcing',
    sensitivity: 'high',
    amplifiers: ['Rapid AI capability gains', 'Cost pressure on firms'],
    dampeners: ['Retraining programs', 'New task creation']
  },
  'labor->income': {
    name: 'Wage Pressure',
    effectType: 'reinforcing',
    sensitivity: 'high',
    amplifiers: ['Labor surplus', 'Skill mismatches'],
    dampeners: ['Minimum wage policy', 'Unionization']
  },
  'income->consumption': {
    name: 'Spending Constraint',
    effectType: 'reinforcing',
    sensitivity: 'medium',
    amplifiers: ['Debt burden', 'Housing costs'],
    dampeners: ['Savings drawdown', 'Credit access']
  },
  'consumption->fiscal': {
    name: 'Tax Base Erosion',
    effectType: 'reinforcing',
    sensitivity: 'medium',
    amplifiers: ['Consumption tax reliance', 'Informal economy'],
    dampeners: ['Wealth taxation', 'Corporate profits']
  },
  'income->fertility': {
    name: 'Family Formation Friction',
    effectType: 'reinforcing',
    sensitivity: 'high',
    amplifiers: ['Housing unaffordability', 'Career uncertainty'],
    dampeners: ['Childcare subsidies', 'Parental leave']
  },
  'fertility->aging': {
    name: 'Demographic Momentum',
    effectType: 'reinforcing',
    sensitivity: 'low',
    amplifiers: ['Generational inertia', 'Cultural shifts'],
    dampeners: ['Immigration', 'Longevity gains']
  },
  'aging->fiscal': {
    name: 'Dependency Strain',
    effectType: 'reinforcing',
    sensitivity: 'high',
    amplifiers: ['Healthcare costs', 'Pension commitments'],
    dampeners: ['Retirement age increase', 'Private provision']
  },
  'fiscal->ai': {
    name: 'Efficiency Pressure',
    effectType: 'reinforcing',
    sensitivity: 'medium',
    amplifiers: ['Austerity politics', 'Productivity demands'],
    dampeners: ['Public investment', 'Human services priority']
  },
  'ai->capital': {
    name: 'Returns to Ownership',
    effectType: 'reinforcing',
    sensitivity: 'high',
    amplifiers: ['Winner-take-all markets', 'IP concentration'],
    dampeners: ['Antitrust action', 'Open source']
  },
  'capital->ai': {
    name: 'Investment Cycle',
    effectType: 'reinforcing',
    sensitivity: 'medium',
    amplifiers: ['VC concentration', 'Compute costs'],
    dampeners: ['Democratized tools', 'Regulation']
  },
  'capital->consumption': {
    name: 'Marginal Propensity Gap',
    effectType: 'balancing',
    sensitivity: 'low',
    amplifiers: ['Wealth hoarding', 'Asset inflation'],
    dampeners: ['Luxury spending', 'Philanthropy']
  },
  'capital->prices': {
    name: 'Automation-Driven Deflation',
    effectType: 'reinforcing',
    sensitivity: 'medium',
    amplifiers: ['Scale economies', 'AI investment surge', 'Market concentration'],
    dampeners: ['Pricing power', 'Brand moats', 'Regulatory floors']
  },
  'ai->prices': {
    name: 'Cost Collapse',
    effectType: 'reinforcing',
    sensitivity: 'high',
    amplifiers: ['Zero marginal cost dynamics', 'Open-source AI', 'Commoditization'],
    dampeners: ['IP moats', 'Regulatory barriers', 'Brand premiums']
  },
  'prices->capital': {
    name: 'Margin Squeeze',
    effectType: 'reinforcing',
    sensitivity: 'high',
    amplifiers: ['Price wars', 'Overcapacity', 'Commoditization'],
    dampeners: ['Differentiation', 'Cost leadership', 'New market creation']
  },
  'prices->fiscal': {
    name: 'Nominal Revenue Erosion',
    effectType: 'reinforcing',
    sensitivity: 'medium',
    amplifiers: ['Consumption tax reliance', 'Debt burden amplification'],
    dampeners: ['Volume growth', 'Tax base broadening']
  },
  'prices->consumption': {
    name: 'Real Purchasing Power Boost',
    effectType: 'balancing',
    sensitivity: 'medium',
    amplifiers: ['Essentials deflation', 'Service cost drops'],
    dampeners: ['Deflationary expectations', 'Delayed spending']
  },
  'prices->income': {
    name: 'Debt-Deflation Spiral',
    effectType: 'reinforcing',
    sensitivity: 'high',
    amplifiers: ['High household debt', 'Fixed-rate obligations', 'Mortgage burden'],
    dampeners: ['Debt relief programs', 'Inflation targeting', 'Variable rate adjustment']
  }
};

export function getConnectionKey(from: string, to: string): string {
  return `${from}->${to}`;
}

export function getConnectionDepth(from: string, to: string): LinkDepthData | null {
  const key = getConnectionKey(from, to);
  const data = connectionDepthData[key];
  if (!data) return null;
  return { connectionId: key, ...data };
}
