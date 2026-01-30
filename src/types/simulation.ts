export interface SimulationParams {
  aiAdoptionSpeed: number;
  welfareLevel: number;
  immigrationRate: number;
  redistributionLevel: number;
}

export interface LoopNode {
  id: string;
  label: string;
  shortLabel: string;
  description: string;
  category: 'ai' | 'labor' | 'demographic' | 'fiscal' | 'capital';
  intensity: number;
  trend: 'up' | 'down' | 'neutral';
}

export interface LoopConnection {
  from: string;
  to: string;
  type: 'reinforcing' | 'balancing';
  strength: number;
  description: string;
}

export interface CountryScenario {
  id: string;
  name: string;
  flag: string;
  description: string;
  params: SimulationParams;
  highlights: string[];
  metrics: CountryMetrics;
}

export interface CountryMetrics {
  birthRateTrend: 'declining' | 'stable' | 'growing';
  workforceTrend: 'shrinking' | 'stable' | 'growing';
  fiscalStress: 'low' | 'medium' | 'high' | 'critical';
  aiExposure: 'low' | 'medium' | 'high' | 'very-high';
}

export interface Intervention {
  id: string;
  name: string;
  description: string;
  targetNodes: string[];
  effectiveness: 'high' | 'medium' | 'low' | 'uncertain';
  tradeoffs: string[];
  paramEffects: Partial<SimulationParams>;
}

export interface NewsItem {
  id: string;
  headline: string;
  source: string;
  date: string;
  category: 'accelerating' | 'stabilizing' | 'noise';
  relatedNodes: string[];
  summary: string;
}

export interface QuestionnaireQuestion {
  id: string;
  question: string;
  options: {
    text: string;
    nodeAffinity: string;
    weight: number;
  }[];
}

export interface QuestionnaireResult {
  stage: number;
  stageName: string;
  interpretation: string;
}
