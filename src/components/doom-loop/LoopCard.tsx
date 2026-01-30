import { LoopNode } from '@/types/simulation';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface LoopCardProps {
  node: LoopNode;
  isHighlighted?: boolean;
  onClick?: () => void;
  stressLevel?: number; // 0-1 from signal aggregation
}

const categoryColors: Record<string, string> = {
  ai: 'border-l-[hsl(var(--node-ai))]',
  labor: 'border-l-[hsl(var(--node-labor))]',
  demographic: 'border-l-[hsl(var(--node-demographic))]',
  fiscal: 'border-l-[hsl(var(--node-fiscal))]',
  capital: 'border-l-[hsl(var(--node-capital))]'
};

const TrendIcon = ({ trend, stressed }: { trend: 'up' | 'down' | 'neutral'; stressed?: boolean }) => {
  if (trend === 'up') return <TrendingUp className={cn('w-4 h-4', stressed ? 'text-flow-accelerating' : 'text-muted-foreground/70')} />;
  if (trend === 'down') return <TrendingDown className={cn('w-4 h-4', stressed ? 'text-flow-stabilizing' : 'text-muted-foreground/70')} />;
  return <Minus className="w-4 h-4 text-muted-foreground/50" />;
};

export function LoopCard({ node, isHighlighted, onClick, stressLevel = 0 }: LoopCardProps) {
  const isStressed = stressLevel > 0.3;
  const isCritical = stressLevel > 0.6;
  
  // Enhanced stress styling with depth cues
  const stressStyles = isCritical 
    ? 'ring-2 ring-flow-accelerating/50 bg-gradient-to-r from-flow-accelerating/8 to-flow-accelerating/3 shadow-md shadow-flow-accelerating/10' 
    : isStressed 
    ? 'ring-1 ring-status-stressed/40 bg-gradient-to-r from-status-stressed/6 to-transparent shadow-sm shadow-status-stressed/5' 
    : '';

  // Depth cues for all cards - subtle inner shadow effect via border
  const depthStyles = isStressed 
    ? '' // Stressed cards already have visual emphasis
    : 'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6),0_1px_2px_0_rgba(0,0,0,0.03)]';

  return (
    <Card 
      className={cn(
        'border-l-4 cursor-pointer transition-all duration-300',
        'hover:shadow-md hover:translate-y-[-1px]',
        categoryColors[node.category],
        isHighlighted && 'ring-2 ring-primary bg-primary/5',
        stressStyles,
        depthStyles
      )}
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className={cn(
              'text-sm transition-all',
              isCritical ? 'font-bold text-foreground' : 
              isStressed ? 'font-semibold text-foreground' : 
              'font-medium text-foreground/85'
            )}>
              {node.label}
            </h4>
            <p className={cn(
              'text-xs mt-0.5 line-clamp-2 transition-all',
              isStressed ? 'text-muted-foreground' : 'text-muted-foreground/70'
            )}>
              {node.description}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {/* Stress indicator dot with glow effect */}
            {isStressed && (
              <div className="relative">
                <div 
                  className={cn(
                    'w-2 h-2 rounded-full',
                    isCritical ? 'bg-flow-accelerating animate-pulse' : 'bg-status-stressed'
                  )}
                  title={`Signal stress: ${Math.round(stressLevel * 100)}%`}
                />
                {isCritical && (
                  <div className="absolute inset-0 w-2 h-2 rounded-full bg-flow-accelerating/40 animate-ping" />
                )}
              </div>
            )}
            <TrendIcon trend={node.trend} stressed={isStressed} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
