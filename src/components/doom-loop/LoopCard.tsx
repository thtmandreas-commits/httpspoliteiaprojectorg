import { LoopNode } from '@/types/simulation';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface LoopCardProps {
  node: LoopNode;
  isHighlighted?: boolean;
  onClick?: () => void;
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

export function LoopCard({ node, isHighlighted, onClick }: LoopCardProps) {
  return (
    <Card 
      className={cn(
        'border-l-4 cursor-pointer transition-all hover:bg-accent/50',
        categoryColors[node.category],
        isHighlighted && 'ring-2 ring-primary bg-primary/5'
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
          <div className="flex items-center gap-1 shrink-0">
            <TrendIcon trend={node.trend} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
