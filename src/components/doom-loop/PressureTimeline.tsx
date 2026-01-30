import { useMemo } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  ReferenceDot
} from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { pressureHistory, getPressureStats, PressureDataPoint } from '@/data/pressureHistory';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus, Calendar, Activity } from 'lucide-react';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: PressureDataPoint }>;
  label?: string;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  
  const data = payload[0].payload;
  const pressurePercent = Math.round(data.pressure * 100);
  const level = data.pressure > 0.65 ? 'Elevated' : 
                data.pressure > 0.45 ? 'Moderate' : 'Low';
  const levelColor = data.pressure > 0.65 ? 'text-flow-accelerating' : 
                     data.pressure > 0.45 ? 'text-status-stressed' : 'text-flow-stabilizing';
  
  return (
    <div className="bg-card border rounded-lg shadow-lg p-2 text-xs">
      <div className="font-medium">{data.date}</div>
      <div className={cn('font-bold text-sm', levelColor)}>
        {pressurePercent}% — {level}
      </div>
      {data.event && (
        <div className="text-muted-foreground italic mt-1 max-w-32">
          {data.event}
        </div>
      )}
    </div>
  );
}

export function PressureTimeline() {
  const stats = useMemo(() => getPressureStats(pressureHistory), []);
  
  const eventPoints = useMemo(() => 
    pressureHistory.filter(d => d.event), []);
  
  const trendIcon = stats.trend === 'increasing' ? TrendingUp :
                    stats.trend === 'decreasing' ? TrendingDown : Minus;
  const TrendIcon = trendIcon;
  
  const trendColor = stats.trend === 'increasing' ? 'text-flow-accelerating' :
                     stats.trend === 'decreasing' ? 'text-flow-stabilizing' : 'text-muted-foreground';
  
  const weekChangeColor = stats.weekChange > 0 ? 'text-flow-accelerating' : 
                          stats.weekChange < 0 ? 'text-flow-stabilizing' : 'text-muted-foreground';
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold">Pressure Timeline</span>
          </div>
          <span className="text-[10px] text-muted-foreground">Past 30 days</span>
        </div>
        
        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-muted/50 rounded-lg p-2 text-center">
            <div className="text-[10px] text-muted-foreground">7-day Δ</div>
            <div className={cn('text-sm font-bold flex items-center justify-center gap-0.5', weekChangeColor)}>
              {stats.weekChange > 0 ? '+' : ''}{Math.round(stats.weekChange * 100)}%
            </div>
          </div>
          <div className="bg-muted/50 rounded-lg p-2 text-center">
            <div className="text-[10px] text-muted-foreground">30-day Δ</div>
            <div className={cn('text-sm font-bold', stats.monthChange > 0 ? 'text-flow-accelerating' : 'text-flow-stabilizing')}>
              {stats.monthChange > 0 ? '+' : ''}{Math.round(stats.monthChange * 100)}%
            </div>
          </div>
          <div className="bg-muted/50 rounded-lg p-2 text-center">
            <div className="text-[10px] text-muted-foreground">Trend</div>
            <div className={cn('text-sm font-bold flex items-center justify-center gap-0.5', trendColor)}>
              <TrendIcon className="w-3 h-3" />
              <span className="capitalize text-xs">{stats.trend}</span>
            </div>
          </div>
        </div>
        
        {/* Chart */}
        <div className="h-40 -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={pressureHistory} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="pressureGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                tickFormatter={(value, index) => {
                  // Show fewer labels on mobile
                  if (index === 0 || index === pressureHistory.length - 1) return value;
                  if (index === Math.floor(pressureHistory.length / 2)) return value;
                  return '';
                }}
              />
              
              <YAxis 
                domain={[0, 1]}
                tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${Math.round(value * 100)}%`}
                ticks={[0.25, 0.5, 0.75]}
              />
              
              {/* Threshold lines */}
              <ReferenceLine 
                y={0.65} 
                stroke="hsl(var(--flow-accelerating))" 
                strokeDasharray="3 3" 
                strokeOpacity={0.5}
              />
              <ReferenceLine 
                y={0.45} 
                stroke="hsl(var(--status-stressed))" 
                strokeDasharray="3 3" 
                strokeOpacity={0.3}
              />
              
              <Tooltip content={<CustomTooltip />} />
              
              <Area
                type="monotone"
                dataKey="pressure"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#pressureGradient)"
                dot={false}
                activeDot={{ r: 4, fill: 'hsl(var(--primary))' }}
              />
              
              {/* Event markers */}
              {eventPoints.map((point, i) => (
                <ReferenceDot
                  key={i}
                  x={point.date}
                  y={point.pressure}
                  r={4}
                  fill="hsl(var(--background))"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-2 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-flow-accelerating opacity-50" style={{ borderStyle: 'dashed' }} />
            <span>Elevated (65%)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full border-2 border-primary bg-background" />
            <span>Key event</span>
          </div>
        </div>
        
        {/* Events list */}
        {eventPoints.length > 0 && (
          <div className="mt-3 pt-3 border-t">
            <div className="text-[10px] font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
              <Activity className="w-3 h-3" />
              Notable signal events
            </div>
            <div className="space-y-1">
              {eventPoints.slice(-3).map((point, i) => (
                <div key={i} className="flex items-center justify-between text-[10px]">
                  <span className="text-muted-foreground">{point.date}</span>
                  <span className="text-foreground truncate max-w-48">{point.event}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
