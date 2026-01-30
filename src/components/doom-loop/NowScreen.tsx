import { NewsItem } from '@/types/simulation';
import { sampleNews } from '@/data/loopData';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Radio } from 'lucide-react';

const categoryConfig = {
  accelerating: {
    label: 'Loop accelerating',
    icon: TrendingUp,
    className: 'bg-flow-accelerating/20 text-flow-accelerating'
  },
  stabilizing: {
    label: 'Loop stabilizing',
    icon: TrendingDown,
    className: 'bg-flow-stabilizing/20 text-flow-stabilizing'
  },
  noise: {
    label: 'Noise',
    icon: Radio,
    className: 'bg-muted text-muted-foreground'
  }
};

function NewsCard({ item }: { item: NewsItem }) {
  const config = categoryConfig[item.category];
  const Icon = config.icon;

  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex items-start gap-2">
          <div className={cn('p-1.5 rounded', config.className)}>
            <Icon className="w-3 h-3" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium leading-tight">{item.headline}</h4>
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              <span>{item.source}</span>
              <span>•</span>
              <span>{item.date}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
              {item.summary}
            </p>
            <div className="mt-2">
              <span className={cn('text-[10px] px-2 py-0.5 rounded-full', config.className)}>
                {config.label}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function NowScreen() {
  const accelerating = sampleNews.filter(n => n.category === 'accelerating');
  const stabilizing = sampleNews.filter(n => n.category === 'stabilizing');
  const noise = sampleNews.filter(n => n.category === 'noise');

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold">Now Feed</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Recent headlines categorized by their impact on the loop.
        </p>
      </div>

      {/* Filter summary */}
      <div className="flex items-center gap-2 text-xs">
        <span className={cn('px-2 py-1 rounded-full', categoryConfig.accelerating.className)}>
          {accelerating.length} accelerating
        </span>
        <span className={cn('px-2 py-1 rounded-full', categoryConfig.stabilizing.className)}>
          {stabilizing.length} stabilizing
        </span>
        <span className={cn('px-2 py-1 rounded-full', categoryConfig.noise.className)}>
          {noise.length} noise
        </span>
      </div>

      {/* News Feed */}
      <div className="space-y-2">
        {sampleNews.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
