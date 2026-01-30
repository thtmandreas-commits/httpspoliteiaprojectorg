import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { getConnectionDepth, LinkDepthData } from '@/data/connectionDepth';
import { LinkDepthPanel } from './LinkDepthPanel';

interface LoopConnectionLinkProps {
  fromNodeId: string;
  toNodeId: string;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  className?: string;
}

export function LoopConnectionLink({ 
  fromNodeId, 
  toNodeId, 
  isOpen,
  onToggle,
  onClose,
  className 
}: LoopConnectionLinkProps) {
  const depthData = isOpen ? getConnectionDepth(fromNodeId, toNodeId) : null;

  return (
    <div className={cn('relative', className)}>
      {/* Tappable connection indicator */}
      <button
        onClick={onToggle}
        className={cn(
          'group flex items-center justify-center w-full py-1',
          'transition-all duration-200',
          'hover:bg-muted/30 rounded',
          isOpen && 'bg-muted/20'
        )}
        aria-label="View connection details"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-1">
          <div 
            className={cn(
              'w-px h-2.5 transition-all duration-200',
              'bg-gradient-to-b from-border to-border/50',
              'group-hover:from-primary/50 group-hover:to-primary/20',
              isOpen && 'from-primary/60 to-primary/30'
            )}
          />
          <ChevronDown 
            className={cn(
              'w-3 h-3 text-muted-foreground/40 transition-all duration-200',
              'group-hover:text-muted-foreground/70',
              isOpen && 'text-primary/60 rotate-180'
            )} 
          />
          <div 
            className={cn(
              'w-px h-2.5 transition-all duration-200',
              'bg-gradient-to-b from-border/50 to-border',
              'group-hover:from-primary/20 group-hover:to-primary/50',
              isOpen && 'from-primary/30 to-primary/60'
            )}
          />
        </div>
      </button>

      {/* Depth Panel */}
      {isOpen && depthData && (
        <div className="absolute left-4 right-4 z-20 mt-1">
          <LinkDepthPanel data={depthData} onClose={onClose} />
        </div>
      )}
    </div>
  );
}
