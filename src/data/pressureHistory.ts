// Simulated historical loop pressure data over the past 30 days
// Values represent aggregated signal pressure (0-1 scale)

export interface PressureDataPoint {
  date: string;
  pressure: number;
  label: string;
  // Key events that influenced pressure (optional, for annotations)
  event?: string;
}

// Generate realistic-looking historical data with some patterns
function generatePressureHistory(): PressureDataPoint[] {
  const data: PressureDataPoint[] = [];
  const now = new Date();
  
  // Base pressure with gradual increase trend
  let basePressure = 0.42;
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Add some realistic variation
    const weekEffect = Math.sin(i / 7 * Math.PI) * 0.05; // Weekly cycles
    const trendEffect = (30 - i) * 0.008; // Gradual increase over month
    const noise = (Math.random() - 0.5) * 0.08; // Random noise
    
    // Simulate some specific events
    let eventPressure = 0;
    let event: string | undefined;
    
    if (i === 25) {
      eventPressure = 0.08;
      event = 'Major automation announcement';
    } else if (i === 18) {
      eventPressure = -0.05;
      event = 'Policy response signal';
    } else if (i === 12) {
      eventPressure = 0.12;
      event = 'Labor data release';
    } else if (i === 5) {
      eventPressure = 0.06;
      event = 'Fiscal report signals';
    }
    
    const pressure = Math.max(0.15, Math.min(0.85, 
      basePressure + weekEffect + trendEffect + noise + eventPressure
    ));
    
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    data.push({
      date: dateStr,
      pressure: Math.round(pressure * 100) / 100,
      label: `${Math.round(pressure * 100)}%`,
      event
    });
  }
  
  return data;
}

export const pressureHistory = generatePressureHistory();

// Summary statistics
export function getPressureStats(data: PressureDataPoint[]) {
  const pressures = data.map(d => d.pressure);
  const current = pressures[pressures.length - 1];
  const weekAgo = pressures[pressures.length - 8] || pressures[0];
  const monthAgo = pressures[0];
  
  const avg = pressures.reduce((a, b) => a + b, 0) / pressures.length;
  const max = Math.max(...pressures);
  const min = Math.min(...pressures);
  
  const weekChange = current - weekAgo;
  const monthChange = current - monthAgo;
  
  return {
    current,
    average: Math.round(avg * 100) / 100,
    max,
    min,
    weekChange: Math.round(weekChange * 100) / 100,
    monthChange: Math.round(monthChange * 100) / 100,
    trend: monthChange > 0.05 ? 'increasing' : monthChange < -0.05 ? 'decreasing' : 'stable'
  };
}
