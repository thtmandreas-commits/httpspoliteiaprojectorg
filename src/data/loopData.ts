import { LoopNode, LoopConnection, CountryScenario, Intervention, NewsItem, QuestionnaireQuestion } from '@/types/simulation';

export const loopNodes: LoopNode[] = [
  {
    id: 'ai',
    label: 'AI Automation',
    shortLabel: 'AI',
    description: 'Rapid deployment of AI systems replacing human cognitive and physical labor across industries',
    category: 'ai',
    intensity: 0.5
  },
  {
    id: 'labor',
    label: 'Labor Displacement',
    shortLabel: 'Jobs',
    description: 'Reduction in demand for human workers as tasks become automated',
    category: 'labor',
    intensity: 0.5
  },
  {
    id: 'income',
    label: 'Income Decline',
    shortLabel: 'Income',
    description: 'Falling wages and reduced earning capacity for displaced workers',
    category: 'labor',
    intensity: 0.5
  },
  {
    id: 'consumption',
    label: 'Consumption Drop',
    shortLabel: 'Spending',
    description: 'Reduced consumer spending due to lower incomes',
    category: 'fiscal',
    intensity: 0.5
  },
  {
    id: 'fertility',
    label: 'Fertility Decline',
    shortLabel: 'Births',
    description: 'Falling birth rates driven by economic insecurity and pessimism',
    category: 'demographic',
    intensity: 0.5
  },
  {
    id: 'aging',
    label: 'Population Aging',
    shortLabel: 'Aging',
    description: 'Rising median age and dependency ratio',
    category: 'demographic',
    intensity: 0.5
  },
  {
    id: 'fiscal',
    label: 'Fiscal Pressure',
    shortLabel: 'Deficit',
    description: 'Growing gap between tax revenue and social obligations',
    category: 'fiscal',
    intensity: 0.5
  },
  {
    id: 'capital',
    label: 'Capital Concentration',
    shortLabel: 'Wealth',
    description: 'Increasing share of economic gains flowing to capital owners',
    category: 'capital',
    intensity: 0.5
  }
];

export const loopConnections: LoopConnection[] = [
  { from: 'ai', to: 'labor', type: 'reinforcing', strength: 0.9, description: 'AI directly replaces human tasks' },
  { from: 'labor', to: 'income', type: 'reinforcing', strength: 0.85, description: 'Fewer jobs means lower wages' },
  { from: 'income', to: 'consumption', type: 'reinforcing', strength: 0.8, description: 'Less income reduces spending' },
  { from: 'consumption', to: 'fiscal', type: 'reinforcing', strength: 0.7, description: 'Lower spending cuts tax revenue' },
  { from: 'income', to: 'fertility', type: 'reinforcing', strength: 0.6, description: 'Economic stress deters family formation' },
  { from: 'fertility', to: 'aging', type: 'reinforcing', strength: 0.9, description: 'Fewer births accelerates aging' },
  { from: 'aging', to: 'fiscal', type: 'reinforcing', strength: 0.85, description: 'More retirees strain budgets' },
  { from: 'fiscal', to: 'ai', type: 'reinforcing', strength: 0.5, description: 'Fiscal pressure drives automation' },
  { from: 'ai', to: 'capital', type: 'reinforcing', strength: 0.8, description: 'AI profits flow to owners' },
  { from: 'capital', to: 'ai', type: 'reinforcing', strength: 0.7, description: 'Capital funds more AI development' },
  { from: 'capital', to: 'consumption', type: 'balancing', strength: 0.3, description: 'Wealthy consume less proportionally' }
];

export const countryScenarios: CountryScenario[] = [
  {
    id: 'japan',
    name: 'Japan',
    flag: '🇯🇵',
    description: 'Advanced aging, low immigration, high automation adoption',
    params: { aiAdoptionSpeed: 75, welfareLevel: 60, immigrationRate: 10, redistributionLevel: 40 },
    highlights: ['Oldest population globally', 'Robot density leader', 'Strict immigration policy']
  },
  {
    id: 'korea',
    name: 'South Korea',
    flag: '🇰🇷',
    description: 'Lowest fertility, rapid digitization, high inequality',
    params: { aiAdoptionSpeed: 80, welfareLevel: 35, immigrationRate: 15, redistributionLevel: 30 },
    highlights: ['0.7 fertility rate', 'Highest robot density', 'Youth unemployment crisis']
  },
  {
    id: 'china',
    name: 'China',
    flag: '🇨🇳',
    description: 'Rapid aging transition, AI superpower ambitions, limited welfare',
    params: { aiAdoptionSpeed: 85, welfareLevel: 25, immigrationRate: 5, redistributionLevel: 25 },
    highlights: ['Demographic cliff approaching', 'AI investment surge', 'Hukou system constraints']
  },
  {
    id: 'eu',
    name: 'European Union',
    flag: '🇪🇺',
    description: 'Strong welfare, moderate automation, aging but immigration buffer',
    params: { aiAdoptionSpeed: 55, welfareLevel: 75, immigrationRate: 45, redistributionLevel: 65 },
    highlights: ['Strong social safety nets', 'AI regulation focus', 'Migration debates']
  },
  {
    id: 'usa',
    name: 'United States',
    flag: '🇺🇸',
    description: 'High inequality, tech leadership, immigration dependent',
    params: { aiAdoptionSpeed: 70, welfareLevel: 40, immigrationRate: 55, redistributionLevel: 35 },
    highlights: ['Tech sector dominance', 'Wealth concentration', 'Immigration politics']
  }
];

export const interventions: Intervention[] = [
  {
    id: 'ubi',
    name: 'Universal Basic Income',
    description: 'Unconditional cash transfers to all citizens',
    targetNodes: ['income', 'consumption', 'fertility'],
    effectiveness: 'uncertain',
    tradeoffs: ['Fiscal cost', 'Inflation risk', 'Work incentive debates'],
    paramEffects: { welfareLevel: 30, redistributionLevel: 25 }
  },
  {
    id: 'robot-tax',
    name: 'Robot/AI Tax',
    description: 'Tax on automation to fund worker transitions',
    targetNodes: ['ai', 'fiscal', 'capital'],
    effectiveness: 'medium',
    tradeoffs: ['May slow innovation', 'Capital flight risk', 'Definition challenges'],
    paramEffects: { aiAdoptionSpeed: -15, redistributionLevel: 15 }
  },
  {
    id: 'immigration',
    name: 'Skilled Immigration',
    description: 'Increase immigration to offset demographic decline',
    targetNodes: ['aging', 'fiscal', 'labor'],
    effectiveness: 'medium',
    tradeoffs: ['Social integration', 'Brain drain from source', 'Political resistance'],
    paramEffects: { immigrationRate: 30 }
  },
  {
    id: 'pronatalist',
    name: 'Pro-natalist Policy',
    description: 'Financial incentives for family formation',
    targetNodes: ['fertility', 'aging'],
    effectiveness: 'low',
    tradeoffs: ['Slow to impact', 'High cost per birth', 'Doesn\'t address root causes'],
    paramEffects: { welfareLevel: 10 }
  },
  {
    id: 'retraining',
    name: 'Mass Retraining',
    description: 'Government-funded skills programs for displaced workers',
    targetNodes: ['labor', 'income'],
    effectiveness: 'low',
    tradeoffs: ['Skills mismatch', 'Age barriers', 'Pace of change too fast'],
    paramEffects: { welfareLevel: 15 }
  },
  {
    id: 'wealth-tax',
    name: 'Wealth Tax',
    description: 'Annual tax on accumulated wealth above threshold',
    targetNodes: ['capital', 'fiscal'],
    effectiveness: 'uncertain',
    tradeoffs: ['Enforcement difficulty', 'Capital flight', 'Valuation complexity'],
    paramEffects: { redistributionLevel: 25 }
  },
  {
    id: 'ai-pause',
    name: 'AI Development Pause',
    description: 'Moratorium on advanced AI development',
    targetNodes: ['ai', 'labor'],
    effectiveness: 'uncertain',
    tradeoffs: ['Competitive disadvantage', 'Enforcement globally', 'Black market AI'],
    paramEffects: { aiAdoptionSpeed: -40 }
  },
  {
    id: 'ownership',
    name: 'Distributed AI Ownership',
    description: 'Policies ensuring broad ownership of AI capital',
    targetNodes: ['capital', 'income'],
    effectiveness: 'uncertain',
    tradeoffs: ['Implementation complexity', 'First-mover disadvantage', 'Coordination problem'],
    paramEffects: { redistributionLevel: 35 }
  }
];

export const sampleNews: NewsItem[] = [
  {
    id: '1',
    headline: 'OpenAI launches agent that can autonomously code entire applications',
    source: 'Tech Review',
    date: '2025-01-28',
    category: 'accelerating',
    relatedNodes: ['ai', 'labor'],
    summary: 'New AI agent can complete complex software projects, threatening developer jobs'
  },
  {
    id: '2',
    headline: 'South Korea fertility rate drops to record 0.68',
    source: 'Demographics Today',
    date: '2025-01-27',
    category: 'accelerating',
    relatedNodes: ['fertility', 'aging'],
    summary: 'Continued decline despite billions in government incentives'
  },
  {
    id: '3',
    headline: 'EU proposes AI dividend fund for displaced workers',
    source: 'Brussels Post',
    date: '2025-01-26',
    category: 'stabilizing',
    relatedNodes: ['income', 'fiscal'],
    summary: 'New fund would redistribute AI productivity gains to affected workers'
  },
  {
    id: '4',
    headline: 'Amazon warehouses now 90% automated',
    source: 'Logistics Weekly',
    date: '2025-01-25',
    category: 'accelerating',
    relatedNodes: ['ai', 'labor', 'capital'],
    summary: 'Fulfillment centers operate with minimal human workforce'
  },
  {
    id: '5',
    headline: 'Germany expands points-based immigration system',
    source: 'Migration Monitor',
    date: '2025-01-24',
    category: 'stabilizing',
    relatedNodes: ['aging', 'labor'],
    summary: 'New policy aims to attract 400,000 skilled workers annually'
  },
  {
    id: '6',
    headline: 'Top 10 tech billionaires now worth more than bottom 50 countries',
    source: 'Wealth Watch',
    date: '2025-01-23',
    category: 'accelerating',
    relatedNodes: ['capital'],
    summary: 'AI boom concentrates unprecedented wealth in few hands'
  },
  {
    id: '7',
    headline: 'Japan pilots universal basic services in three prefectures',
    source: 'Asia Pacific News',
    date: '2025-01-22',
    category: 'stabilizing',
    relatedNodes: ['income', 'consumption', 'welfare'],
    summary: 'Free housing, healthcare, and transport for all residents'
  },
  {
    id: '8',
    headline: 'Retail sector sheds 200,000 jobs as AI checkout expands',
    source: 'Labor Report',
    date: '2025-01-21',
    category: 'accelerating',
    relatedNodes: ['labor', 'income'],
    summary: 'Automated stores eliminate cashier and stocking positions'
  }
];

export const questionnaireQuestions: QuestionnaireQuestion[] = [
  {
    id: 'q1',
    question: 'How do you primarily earn your income?',
    options: [
      { text: 'Salary from cognitive/knowledge work', nodeAffinity: 'labor', weight: 0.9 },
      { text: 'Salary from physical/manual work', nodeAffinity: 'labor', weight: 1.0 },
      { text: 'Business ownership or investments', nodeAffinity: 'capital', weight: 0.9 },
      { text: 'Government benefits or pension', nodeAffinity: 'fiscal', weight: 0.8 }
    ]
  },
  {
    id: 'q2',
    question: 'How replaceable is your current work by AI in the next 5 years?',
    options: [
      { text: 'Highly replaceable', nodeAffinity: 'ai', weight: 1.0 },
      { text: 'Partially replaceable', nodeAffinity: 'ai', weight: 0.6 },
      { text: 'Unlikely to be replaced', nodeAffinity: 'labor', weight: 0.3 },
      { text: 'AI will augment my work', nodeAffinity: 'capital', weight: 0.5 }
    ]
  },
  {
    id: 'q3',
    question: 'What is your current life stage?',
    options: [
      { text: 'Young adult, no children', nodeAffinity: 'fertility', weight: 0.7 },
      { text: 'Parent of young children', nodeAffinity: 'fertility', weight: 0.5 },
      { text: 'Middle-aged, children grown', nodeAffinity: 'aging', weight: 0.6 },
      { text: 'Retired or near retirement', nodeAffinity: 'aging', weight: 1.0 }
    ]
  },
  {
    id: 'q4',
    question: 'How would you describe your financial security?',
    options: [
      { text: 'Living paycheck to paycheck', nodeAffinity: 'income', weight: 1.0 },
      { text: 'Some savings, but vulnerable', nodeAffinity: 'income', weight: 0.7 },
      { text: 'Comfortable with reserves', nodeAffinity: 'consumption', weight: 0.4 },
      { text: 'Wealthy, assets generate income', nodeAffinity: 'capital', weight: 0.9 }
    ]
  },
  {
    id: 'q5',
    question: 'What concerns you most about the next decade?',
    options: [
      { text: 'Finding or keeping stable work', nodeAffinity: 'labor', weight: 1.0 },
      { text: 'Affording healthcare and retirement', nodeAffinity: 'fiscal', weight: 0.9 },
      { text: 'The world my children will inherit', nodeAffinity: 'fertility', weight: 0.8 },
      { text: 'Maintaining my standard of living', nodeAffinity: 'consumption', weight: 0.7 }
    ]
  }
];
