import { cn } from '@/lib/utils';
import { LinkDepthData } from '@/data/connectionDepth';
import { ArrowDown, X } from 'lucide-react';

interface LinkDepthPanelProps {
  data: LinkDepthData;
  onClose: () => void;
  className?: string;
}

export function LinkDepthPanel({ data, onClose, className }: LinkDepthPanelProps) {
  return (
    <div 
      className={cn(
        'bg-card border border-border/60 rounded-lg shadow-lg',
        'p-3 space-y-2 animate-in fade-in scale-in duration-200',
        'dark:bg-card/95 dark:backdrop-blur-sm',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-foreground">
            {data.name}
          </h4>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={cn(
              'text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded',
              data.effectType === 'reinforcing' 
                ? 'bg-flow-accelerating/10 text-flow-accelerating' 
                : 'bg-flow-stabilizing/10 text-flow-stabilizing'
            )}>
              {data.effectType}
            </span>
            <span className={cn(
              'text-[10px] uppercase tracking-wider',
              data.sensitivity === 'high' ? 'text-flow-accelerating/80' :
              data.sensitivity === 'medium' ? 'text-muted-foreground' :
              'text-muted-foreground/60'
            )}>
              {data.sensitivity} sensitivity
            </span>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-1 rounded hover:bg-muted/50 transition-colors"
          aria-label="Close panel"
        >
          <X className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>

      {/* Amplifiers & Dampeners */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        {/* Amplifiers */}
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-flow-accelerating/70">
            Amplifiers
          </span>
          <ul className="space-y-0.5">
            {data.amplifiers.map((amp, i) => (
              <li key={i} className="text-xs text-muted-foreground leading-tight">
                {amp}
              </li>
            ))}
          </ul>
        </div>

        {/* Dampeners */}
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-flow-stabilizing/70">
            Dampeners
          </span>
          <ul className="space-y-0.5">
            {data.dampeners.map((damp, i) => (
              <li key={i} className="text-xs text-muted-foreground leading-tight">
                {damp}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
