import { SignalCategory } from '@/types/signals';

export interface CountrySignalProfile {
  countryId: string;
  name: string;
  flag: string;
  loopPressure: number; // 0-1
  pressureTrend: 'increasing' | 'decreasing' | 'stable';
  categoryScores: Record<SignalCategory, {
    score: number; // -1 to 1 (negative = stabilizing, positive = accelerating)
    trend: 'up' | 'down' | 'stable';
  }>;
  riskFactors: string[];
  stabilizingFactors: string[];
}

export const countrySignalProfiles: CountrySignalProfile[] = [
  {
    countryId: 'japan',
    name: 'Japan',
    flag: '🇯🇵',
    loopPressure: 0.78,
    pressureTrend: 'increasing',
    categoryScores: {
      automation_adoption: { score: 0.85, trend: 'up' },
      labor_demand: { score: -0.6, trend: 'down' },
      capital_efficiency: { score: 0.7, trend: 'up' },
      fiscal_pressure: { score: 0.8, trend: 'up' },
      demographic_shift: { score: 0.9, trend: 'up' },
      income_distribution: { score: 0.3, trend: 'stable' },
      consumption_patterns: { score: -0.4, trend: 'down' },
      workforce_participation: { score: -0.5, trend: 'down' }
    },
    riskFactors: ['World\'s oldest population', 'Debt-to-GDP 260%', 'Labor shortage crisis'],
    stabilizingFactors: ['High automation readiness', 'Strong social cohesion']
  },
  {
    countryId: 'korea',
    name: 'South Korea',
    flag: '🇰🇷',
    loopPressure: 0.85,
    pressureTrend: 'increasing',
    categoryScores: {
      automation_adoption: { score: 0.9, trend: 'up' },
      labor_demand: { score: -0.5, trend: 'down' },
      capital_efficiency: { score: 0.8, trend: 'up' },
      fiscal_pressure: { score: 0.6, trend: 'up' },
      demographic_shift: { score: 0.95, trend: 'up' },
      income_distribution: { score: 0.5, trend: 'up' },
      consumption_patterns: { score: -0.5, trend: 'down' },
      workforce_participation: { score: -0.4, trend: 'down' }
    },
    riskFactors: ['0.7 fertility rate', 'Chaebol concentration', 'Youth unemployment'],
    stabilizingFactors: ['Tech infrastructure', 'Education investment']
  },
  {
    countryId: 'china',
    name: 'China',
    flag: '🇨🇳',
    loopPressure: 0.72,
    pressureTrend: 'increasing',
    categoryScores: {
      automation_adoption: { score: 0.85, trend: 'up' },
      labor_demand: { score: -0.3, trend: 'down' },
      capital_efficiency: { score: 0.75, trend: 'up' },
      fiscal_pressure: { score: 0.5, trend: 'up' },
      demographic_shift: { score: 0.7, trend: 'up' },
      income_distribution: { score: 0.4, trend: 'stable' },
      consumption_patterns: { score: 0.2, trend: 'stable' },
      workforce_participation: { score: -0.2, trend: 'down' }
    },
    riskFactors: ['Demographic cliff by 2030', 'Property market stress', 'Youth employment crisis'],
    stabilizingFactors: ['State capacity', 'AI investment scale', 'Manufacturing base']
  },
  {
    countryId: 'eu',
    name: 'European Union',
    flag: '🇪🇺',
    loopPressure: 0.52,
    pressureTrend: 'stable',
    categoryScores: {
      automation_adoption: { score: 0.4, trend: 'stable' },
      labor_demand: { score: -0.2, trend: 'stable' },
      capital_efficiency: { score: 0.3, trend: 'stable' },
      fiscal_pressure: { score: 0.5, trend: 'up' },
      demographic_shift: { score: 0.4, trend: 'stable' },
      income_distribution: { score: -0.2, trend: 'down' },
      consumption_patterns: { score: 0.1, trend: 'stable' },
      workforce_participation: { score: 0.1, trend: 'stable' }
    },
    riskFactors: ['Fragmented policy', 'Slow innovation adoption', 'Pension obligations'],
    stabilizingFactors: ['Strong welfare systems', 'Immigration buffer', 'AI regulation']
  },
  {
    countryId: 'usa',
    name: 'United States',
    flag: '🇺🇸',
    loopPressure: 0.65,
    pressureTrend: 'increasing',
    categoryScores: {
      automation_adoption: { score: 0.75, trend: 'up' },
      labor_demand: { score: -0.3, trend: 'stable' },
      capital_efficiency: { score: 0.85, trend: 'up' },
      fiscal_pressure: { score: 0.6, trend: 'up' },
      demographic_shift: { score: 0.3, trend: 'stable' },
      income_distribution: { score: 0.6, trend: 'up' },
      consumption_patterns: { score: 0.2, trend: 'stable' },
      workforce_participation: { score: 0.1, trend: 'stable' }
    },
    riskFactors: ['Wealth inequality', 'Weak safety nets', 'Healthcare costs'],
    stabilizingFactors: ['Tech leadership', 'Immigration', 'Capital markets depth']
  }
];

// Get pressure level category
export function getPressureLevel(pressure: number): 'low' | 'moderate' | 'elevated' | 'high' | 'critical' {
  if (pressure < 0.3) return 'low';
  if (pressure < 0.5) return 'moderate';
  if (pressure < 0.65) return 'elevated';
  if (pressure < 0.8) return 'high';
  return 'critical';
}

// Get color class for pressure level
export function getPressureColor(pressure: number): string {
  const level = getPressureLevel(pressure);
  switch (level) {
    case 'low': return 'text-flow-stabilizing';
    case 'moderate': return 'text-muted-foreground';
    case 'elevated': return 'text-status-stressed';
    case 'high': return 'text-flow-accelerating';
    case 'critical': return 'text-destructive';
  }
}

export function getPressureBgColor(pressure: number): string {
  const level = getPressureLevel(pressure);
  switch (level) {
    case 'low': return 'bg-flow-stabilizing';
    case 'moderate': return 'bg-muted-foreground';
    case 'elevated': return 'bg-status-stressed';
    case 'high': return 'bg-flow-accelerating';
    case 'critical': return 'bg-destructive';
  }
}
