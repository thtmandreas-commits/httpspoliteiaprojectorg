import { NewsItem } from '@/types/simulation';
import { sampleNews } from '@/data/loopData';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, ExternalLink } from 'lucide-react';

interface NewsFeedProps {
  className?: string;
}

export function NewsFeed({ className }: NewsFeedProps) {
  const accelerating = sampleNews.filter(n => n.category === 'accelerating');
  const stabilizing = sampleNews.filter(n => n.category === 'stabilizing');

  return (
    <div className={cn('space-y-4', className)}>
      <div>
        <h3 className="text-sm font-semibold">Now Feed</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Recent headlines categorized by loop impact. Sample data for demonstration.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-flow-accelerating" />
            <span className="text-xs font-medium text-flow-accelerating">Loop Accelerating</span>
          </div>
          <div className="space-y-2">
            {accelerating.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-flow-stabilizing" />
            <span className="text-xs font-medium text-flow-stabilizing">Loop Stabilizing</span>
          </div>
          <div className="space-y-2">
            {stabilizing.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function NewsCard({ item }: { item: NewsItem }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium leading-tight">{item.headline}</h4>
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              <span>{item.source}</span>
              <span>•</span>
              <span>{item.date}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">{item.summary}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {item.relatedNodes.map(node => (
                <Badge key={node} variant="secondary" className="text-[10px]">
                  {node}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
