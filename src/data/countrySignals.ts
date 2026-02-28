import { SignalCategory } from '@/types/signals';

export interface CountrySignalProfile {
  countryId: string;
  name: string;
  flag: string;
  loopPressure: number;
  pressureTrend: 'increasing' | 'decreasing' | 'stable';
  categoryScores: Record<SignalCategory, {
    score: number;
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
      capital_labor_decoupling: { score: 0.7, trend: 'up' },
      automation_substitution: { score: 0.85, trend: 'up' },
      wage_compression: { score: 0.5, trend: 'stable' },
      family_formation_friction: { score: 0.8, trend: 'up' },
      fertility_decline: { score: 0.9, trend: 'up' },
      dependency_ratio_stress: { score: 0.95, trend: 'up' },
      tax_base_erosion: { score: 0.7, trend: 'up' },
      welfare_system_strain: { score: 0.85, trend: 'up' },
      policy_paralysis: { score: 0.6, trend: 'stable' },
      legitimacy_erosion: { score: 0.3, trend: 'stable' },
      redistribution_experimentation: { score: 0.4, trend: 'stable' },
      structural_adaptation: { score: 0.3, trend: 'down' },
      deflationary_pressure: { score: 0.6, trend: 'up' }
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
      capital_labor_decoupling: { score: 0.8, trend: 'up' },
      automation_substitution: { score: 0.9, trend: 'up' },
      wage_compression: { score: 0.6, trend: 'up' },
      family_formation_friction: { score: 0.95, trend: 'up' },
      fertility_decline: { score: 0.98, trend: 'up' },
      dependency_ratio_stress: { score: 0.7, trend: 'up' },
      tax_base_erosion: { score: 0.5, trend: 'up' },
      welfare_system_strain: { score: 0.6, trend: 'up' },
      policy_paralysis: { score: 0.5, trend: 'stable' },
      legitimacy_erosion: { score: 0.4, trend: 'up' },
      redistribution_experimentation: { score: 0.3, trend: 'stable' },
      structural_adaptation: { score: 0.25, trend: 'down' },
      deflationary_pressure: { score: 0.55, trend: 'up' }
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
      capital_labor_decoupling: { score: 0.75, trend: 'up' },
      automation_substitution: { score: 0.85, trend: 'up' },
      wage_compression: { score: 0.4, trend: 'stable' },
      family_formation_friction: { score: 0.7, trend: 'up' },
      fertility_decline: { score: 0.75, trend: 'up' },
      dependency_ratio_stress: { score: 0.6, trend: 'up' },
      tax_base_erosion: { score: 0.4, trend: 'stable' },
      welfare_system_strain: { score: 0.5, trend: 'up' },
      policy_paralysis: { score: 0.3, trend: 'stable' },
      legitimacy_erosion: { score: 0.35, trend: 'stable' },
      redistribution_experimentation: { score: 0.5, trend: 'up' },
      structural_adaptation: { score: 0.6, trend: 'stable' },
      deflationary_pressure: { score: 0.5, trend: 'up' }
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
      capital_labor_decoupling: { score: 0.4, trend: 'stable' },
      automation_substitution: { score: 0.45, trend: 'stable' },
      wage_compression: { score: 0.3, trend: 'stable' },
      family_formation_friction: { score: 0.5, trend: 'stable' },
      fertility_decline: { score: 0.55, trend: 'stable' },
      dependency_ratio_stress: { score: 0.6, trend: 'up' },
      tax_base_erosion: { score: 0.4, trend: 'stable' },
      welfare_system_strain: { score: 0.55, trend: 'up' },
      policy_paralysis: { score: 0.5, trend: 'stable' },
      legitimacy_erosion: { score: 0.45, trend: 'stable' },
      redistribution_experimentation: { score: 0.6, trend: 'up' },
      structural_adaptation: { score: 0.55, trend: 'up' },
      deflationary_pressure: { score: 0.35, trend: 'stable' }
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
      capital_labor_decoupling: { score: 0.85, trend: 'up' },
      automation_substitution: { score: 0.75, trend: 'up' },
      wage_compression: { score: 0.6, trend: 'up' },
      family_formation_friction: { score: 0.5, trend: 'stable' },
      fertility_decline: { score: 0.4, trend: 'stable' },
      dependency_ratio_stress: { score: 0.45, trend: 'up' },
      tax_base_erosion: { score: 0.5, trend: 'up' },
      welfare_system_strain: { score: 0.4, trend: 'stable' },
      policy_paralysis: { score: 0.7, trend: 'up' },
      legitimacy_erosion: { score: 0.6, trend: 'up' },
      redistribution_experimentation: { score: 0.35, trend: 'stable' },
      structural_adaptation: { score: 0.4, trend: 'stable' },
      deflationary_pressure: { score: 0.7, trend: 'up' }
    },
    riskFactors: ['Wealth inequality', 'Weak safety nets', 'Healthcare costs'],
    stabilizingFactors: ['Tech leadership', 'Immigration', 'Capital markets depth']
  }
];

export function getPressureLevel(pressure: number): 'low' | 'moderate' | 'elevated' | 'high' | 'critical' {
  if (pressure < 0.3) return 'low';
  if (pressure < 0.5) return 'moderate';
  if (pressure < 0.65) return 'elevated';
  if (pressure < 0.8) return 'high';
  return 'critical';
}

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
