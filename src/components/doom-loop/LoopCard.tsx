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

const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'neutral' }) => {
  if (trend === 'up') return <TrendingUp className="w-4 h-4 text-flow-accelerating" />;
  if (trend === 'down') return <TrendingDown className="w-4 h-4 text-flow-stabilizing" />;
  return <Minus className="w-4 h-4 text-muted-foreground" />;
};

export function LoopCard({ node, isHighlighted, onClick, stressLevel = 0 }: LoopCardProps) {
  // Determine stress indicator styling
  const stressIndicator = stressLevel > 0.6 
    ? 'ring-2 ring-flow-accelerating/40 bg-flow-accelerating/5' 
    : stressLevel > 0.3 
    ? 'ring-1 ring-status-stressed/30 bg-status-stressed/5' 
    : '';

  return (
    <Card 
      className={cn(
        'border-l-4 cursor-pointer transition-all hover:bg-accent/50',
        categoryColors[node.category],
        isHighlighted && 'ring-2 ring-primary bg-primary/5',
        stressIndicator
      )}
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold">{node.label}</h4>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
              {node.description}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {/* Stress indicator dot */}
            {stressLevel > 0.3 && (
              <div 
                className={cn(
                  'w-2 h-2 rounded-full animate-pulse',
                  stressLevel > 0.6 ? 'bg-flow-accelerating' : 'bg-status-stressed'
                )}
                title={`Signal stress: ${Math.round(stressLevel * 100)}%`}
              />
            )}
            <TrendIcon trend={node.trend} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
