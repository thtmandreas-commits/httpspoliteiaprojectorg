import { Signal, SignalCategory, TimeWindowedSignal, TimeWindow } from '@/types/signals';

// Sample signals representing abstracted system-level indicators
// These are derived from ephemeral inputs (headlines, data points) but store only direction and weight

const DAY = 86400000;

export const sampleSignals: Signal[] = [
  // Capital-Labor Domain
  {
    id: 's1',
    category: 'capital_labor_decoupling',
    direction: 'increasing',
    strength: 'strong',
    timestamp: Date.now() - DAY * 2,
    affectedNodes: ['capital', 'income'],
    weight: 0.9
  },
  {
    id: 's2',
    category: 'capital_labor_decoupling',
    direction: 'increasing',
    strength: 'moderate',
    timestamp: Date.now() - DAY * 15,
    affectedNodes: ['capital', 'income'],
    weight: 0.7
  },
  {
    id: 's3',
    category: 'automation_substitution',
    direction: 'increasing',
    strength: 'strong',
    timestamp: Date.now() - DAY * 1,
    affectedNodes: ['ai', 'labor'],
    weight: 0.95
  },
  {
    id: 's4',
    category: 'automation_substitution',
    direction: 'increasing',
    strength: 'moderate',
    timestamp: Date.now() - DAY * 5,
    affectedNodes: ['ai', 'labor'],
    weight: 0.7
  },
  {
    id: 's5',
    category: 'automation_substitution',
    direction: 'increasing',
    strength: 'strong',
    timestamp: Date.now() - DAY * 45,
    affectedNodes: ['ai', 'labor'],
    weight: 0.8
  },
  {
    id: 's6',
    category: 'wage_compression',
    direction: 'increasing',
    strength: 'moderate',
    timestamp: Date.now() - DAY * 3,
    affectedNodes: ['income', 'consumption'],
    weight: 0.65
  },
  {
    id: 's7',
    category: 'wage_compression',
    direction: 'stable',
    strength: 'weak',
    timestamp: Date.now() - DAY * 20,
    affectedNodes: ['income', 'consumption'],
    weight: 0.3
  },

  // Demographic Domain
  {
    id: 's8',
    category: 'family_formation_friction',
    direction: 'increasing',
    strength: 'moderate',
    timestamp: Date.now() - DAY * 4,
    affectedNodes: ['fertility', 'consumption'],
    weight: 0.6
  },
  {
    id: 's9',
    category: 'fertility_decline',
    direction: 'increasing',
    strength: 'strong',
    timestamp: Date.now() - DAY * 2,
    affectedNodes: ['fertility', 'aging'],
    weight: 0.85
  },
  {
    id: 's10',
    category: 'fertility_decline',
    direction: 'increasing',
    strength: 'strong',
    timestamp: Date.now() - DAY * 30,
    affectedNodes: ['fertility', 'aging'],
    weight: 0.9
  },
  {
    id: 's11',
    category: 'dependency_ratio_stress',
    direction: 'increasing',
    strength: 'moderate',
    timestamp: Date.now() - DAY * 10,
    affectedNodes: ['aging', 'fiscal'],
    weight: 0.7
  },
  {
    id: 's12',
    category: 'dependency_ratio_stress',
    direction: 'increasing',
    strength: 'strong',
    timestamp: Date.now() - DAY * 60,
    affectedNodes: ['aging', 'fiscal'],
    weight: 0.8
  },

  // Fiscal Domain
  {
    id: 's13',
    category: 'tax_base_erosion',
    direction: 'increasing',
    strength: 'moderate',
    timestamp: Date.now() - DAY * 5,
    affectedNodes: ['fiscal', 'income'],
    weight: 0.6
  },
  {
    id: 's14',
    category: 'welfare_system_strain',
    direction: 'increasing',
    strength: 'moderate',
    timestamp: Date.now() - DAY * 8,
    affectedNodes: ['fiscal', 'aging'],
    weight: 0.65
  },
  {
    id: 's15',
    category: 'welfare_system_strain',
    direction: 'increasing',
    strength: 'weak',
    timestamp: Date.now() - DAY * 40,
    affectedNodes: ['fiscal', 'aging'],
    weight: 0.4
  },

  // Political Domain
  {
    id: 's16',
    category: 'policy_paralysis',
    direction: 'stable',
    strength: 'moderate',
    timestamp: Date.now() - DAY * 6,
    affectedNodes: ['fiscal', 'labor'],
    weight: 0.5
  },
  {
    id: 's17',
    category: 'legitimacy_erosion',
    direction: 'increasing',
    strength: 'weak',
    timestamp: Date.now() - DAY * 12,
    affectedNodes: ['consumption', 'fertility'],
    weight: 0.4
  },

  // Adaptation Domain (stabilizing signals)
  {
    id: 's18',
    category: 'redistribution_experimentation',
    direction: 'increasing',
    strength: 'moderate',
    timestamp: Date.now() - DAY * 3,
    affectedNodes: ['income', 'capital'],
    weight: 0.6
  },
  {
    id: 's19',
    category: 'redistribution_experimentation',
    direction: 'increasing',
    strength: 'weak',
    timestamp: Date.now() - DAY * 25,
    affectedNodes: ['income', 'capital'],
    weight: 0.35
  },
  {
    id: 's20',
    category: 'structural_adaptation',
    direction: 'increasing',
    strength: 'weak',
    timestamp: Date.now() - DAY * 7,
    affectedNodes: ['labor', 'fiscal'],
    weight: 0.4
  },
  {
    id: 's21',
    category: 'structural_adaptation',
    direction: 'stable',
    strength: 'weak',
    timestamp: Date.now() - DAY * 50,
    affectedNodes: ['labor', 'fiscal'],
    weight: 0.25
  },
  
  // Some counter-signals for nuance
  {
    id: 's22',
    category: 'automation_substitution',
    direction: 'decreasing',
    strength: 'weak',
    timestamp: Date.now() - DAY * 4,
    affectedNodes: ['ai', 'labor'],
    weight: 0.3
  },
  {
    id: 's23',
    category: 'wage_compression',
    direction: 'decreasing',
    strength: 'weak',
    timestamp: Date.now() - DAY * 35,
    affectedNodes: ['income', 'consumption'],
    weight: 0.25
  }
];

// Generate sample time-windowed signals for heatmap
export function generateTimeWindowedSignals(signals: Signal[]): TimeWindowedSignal[] {
  const categories: SignalCategory[] = [
    'capital_labor_decoupling',
    'automation_substitution',
    'wage_compression',
    'family_formation_friction',
    'fertility_decline',
    'dependency_ratio_stress',
    'tax_base_erosion',
    'welfare_system_strain',
    'policy_paralysis',
    'legitimacy_erosion',
    'redistribution_experimentation',
    'structural_adaptation'
  ];

  const windows: TimeWindow[] = ['7d', '30d', '90d'];
  const windowMs: Record<TimeWindow, number> = {
    '7d': 7 * DAY,
    '30d': 30 * DAY,
    '90d': 90 * DAY
  };

  return categories.map(category => {
    const categorySignals = signals.filter(s => s.category === category);
    
    const windowData = {} as Record<TimeWindow, { direction: number; confidence: number; signalCount: number }>;
    
    windows.forEach(window => {
      const cutoff = Date.now() - windowMs[window];
      const windowSignals = categorySignals.filter(s => s.timestamp >= cutoff);
      
      if (windowSignals.length === 0) {
        windowData[window] = { direction: 0, confidence: 0.1, signalCount: 0 };
      } else {
        // Calculate net direction
        let dirSum = 0;
        let weightSum = 0;
        windowSignals.forEach(s => {
          const dirValue = s.direction === 'increasing' ? 1 : s.direction === 'decreasing' ? -1 : 0;
          const strengthMult = s.strength === 'strong' ? 1 : s.strength === 'moderate' ? 0.6 : 0.3;
          dirSum += dirValue * strengthMult * s.weight;
          weightSum += s.weight;
        });
        
        const direction = weightSum > 0 ? Math.max(-1, Math.min(1, dirSum / weightSum)) : 0;
        
        // Confidence based on signal count and consistency
        const volumeFactor = Math.min(1, windowSignals.length / 3);
        const directions = windowSignals.map(s => s.direction);
        const dominant = directions.filter(d => d === directions[0]).length / directions.length;
        const confidence = volumeFactor * 0.4 + dominant * 0.6;
        
        windowData[window] = { 
          direction, 
          confidence: Math.max(0.2, Math.min(1, confidence)), 
          signalCount: windowSignals.length 
        };
      }
    });
    
    return { category, windows: windowData };
  });
}

// Pre-computed sample for preview safety
export const sampleTimeWindowedSignals = generateTimeWindowedSignals(sampleSignals);
