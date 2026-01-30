import { Signal, SignalCategory } from '@/types/signals';

// Sample signals derived from abstracted headline patterns
// These represent directional signals, not news content

export const sampleSignals: Signal[] = [
  // Automation signals
  {
    id: 's1',
    category: 'automation_adoption',
    direction: 'increasing',
    strength: 'strong',
    timestamp: Date.now() - 86400000 * 1,
    affectedNodes: ['ai', 'labor'],
    weight: 0.9
  },
  {
    id: 's2',
    category: 'automation_adoption',
    direction: 'increasing',
    strength: 'moderate',
    timestamp: Date.now() - 86400000 * 2,
    affectedNodes: ['ai', 'labor'],
    weight: 0.7
  },
  {
    id: 's3',
    category: 'automation_adoption',
    direction: 'increasing',
    strength: 'strong',
    timestamp: Date.now() - 86400000 * 3,
    affectedNodes: ['ai', 'labor'],
    weight: 0.85
  },
  
  // Labor demand signals
  {
    id: 's4',
    category: 'labor_demand',
    direction: 'decreasing',
    strength: 'moderate',
    timestamp: Date.now() - 86400000 * 1,
    affectedNodes: ['labor', 'income'],
    weight: 0.7
  },
  {
    id: 's5',
    category: 'labor_demand',
    direction: 'decreasing',
    strength: 'strong',
    timestamp: Date.now() - 86400000 * 2,
    affectedNodes: ['labor', 'income'],
    weight: 0.8
  },
  {
    id: 's6',
    category: 'labor_demand',
    direction: 'stable',
    strength: 'weak',
    timestamp: Date.now() - 86400000 * 4,
    affectedNodes: ['labor', 'income'],
    weight: 0.3
  },
  
  // Capital efficiency signals
  {
    id: 's7',
    category: 'capital_efficiency',
    direction: 'increasing',
    strength: 'strong',
    timestamp: Date.now() - 86400000 * 1,
    affectedNodes: ['capital', 'ai'],
    weight: 0.9
  },
  {
    id: 's8',
    category: 'capital_efficiency',
    direction: 'increasing',
    strength: 'moderate',
    timestamp: Date.now() - 86400000 * 3,
    affectedNodes: ['capital', 'ai'],
    weight: 0.6
  },
  
  // Fiscal pressure signals
  {
    id: 's9',
    category: 'fiscal_pressure',
    direction: 'increasing',
    strength: 'moderate',
    timestamp: Date.now() - 86400000 * 1,
    affectedNodes: ['fiscal', 'aging'],
    weight: 0.65
  },
  {
    id: 's10',
    category: 'fiscal_pressure',
    direction: 'increasing',
    strength: 'weak',
    timestamp: Date.now() - 86400000 * 5,
    affectedNodes: ['fiscal', 'aging'],
    weight: 0.4
  },
  
  // Demographic signals
  {
    id: 's11',
    category: 'demographic_shift',
    direction: 'increasing',
    strength: 'strong',
    timestamp: Date.now() - 86400000 * 2,
    affectedNodes: ['fertility', 'aging'],
    weight: 0.85
  },
  {
    id: 's12',
    category: 'demographic_shift',
    direction: 'increasing',
    strength: 'moderate',
    timestamp: Date.now() - 86400000 * 7,
    affectedNodes: ['fertility', 'aging'],
    weight: 0.55
  },
  
  // Income distribution signals
  {
    id: 's13',
    category: 'income_distribution',
    direction: 'increasing',
    strength: 'strong',
    timestamp: Date.now() - 86400000 * 1,
    affectedNodes: ['income', 'consumption', 'capital'],
    weight: 0.8
  },
  {
    id: 's14',
    category: 'income_distribution',
    direction: 'increasing',
    strength: 'moderate',
    timestamp: Date.now() - 86400000 * 4,
    affectedNodes: ['income', 'consumption', 'capital'],
    weight: 0.5
  },
  
  // Consumption signals
  {
    id: 's15',
    category: 'consumption_patterns',
    direction: 'decreasing',
    strength: 'moderate',
    timestamp: Date.now() - 86400000 * 2,
    affectedNodes: ['consumption', 'fiscal'],
    weight: 0.6
  },
  
  // Workforce participation signals
  {
    id: 's16',
    category: 'workforce_participation',
    direction: 'decreasing',
    strength: 'moderate',
    timestamp: Date.now() - 86400000 * 3,
    affectedNodes: ['labor', 'aging', 'fiscal'],
    weight: 0.65
  },
  
  // Some stabilizing signals
  {
    id: 's17',
    category: 'fiscal_pressure',
    direction: 'decreasing',
    strength: 'weak',
    timestamp: Date.now() - 86400000 * 2,
    affectedNodes: ['fiscal', 'aging'],
    weight: 0.3
  },
  {
    id: 's18',
    category: 'labor_demand',
    direction: 'increasing',
    strength: 'weak',
    timestamp: Date.now() - 86400000 * 6,
    affectedNodes: ['labor', 'income'],
    weight: 0.25
  }
];

// Illustrative examples (optional display, non-exhaustive)
export const signalExamples: Record<SignalCategory, string[]> = {
  automation_adoption: [
    'Enterprise AI deployment expanding',
    'Robotics integration in logistics sector',
    'Automated systems replacing routine tasks'
  ],
  labor_demand: [
    'Hiring freezes across multiple sectors',
    'Workforce reduction announcements',
    'Contract labor replacing permanent roles'
  ],
  capital_efficiency: [
    'Profit margins expanding with fewer workers',
    'Shareholder returns outpacing wages',
    'Capital investment in automation infrastructure'
  ],
  fiscal_pressure: [
    'Pension obligation growth accelerating',
    'Healthcare costs rising with aging population',
    'Tax base erosion from employment shifts'
  ],
  demographic_shift: [
    'Birth rates declining below replacement',
    'Median age rising in developed economies',
    'Working-age population shrinking'
  ],
  income_distribution: [
    'Wealth concentration metrics rising',
    'Middle-income segment contracting',
    'Top percentile income share increasing'
  ],
  consumption_patterns: [
    'Consumer confidence declining',
    'Discretionary spending contracting',
    'Debt-financed consumption rising'
  ],
  workforce_participation: [
    'Early retirement rates increasing',
    'Disability claims rising',
    'Labor force dropout rates elevated'
  ]
};
