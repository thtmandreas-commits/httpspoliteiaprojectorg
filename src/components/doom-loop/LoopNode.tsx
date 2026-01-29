import { LoopNode as LoopNodeType } from '@/types/simulation';
import { cn } from '@/lib/utils';

interface LoopNodeProps {
  node: LoopNodeType;
  position: { x: number; y: number };
  isActive?: boolean;
  onClick?: () => void;
}

const categoryColors: Record<string, string> = {
  ai: 'border-node-ai bg-node-ai/10 text-node-ai',
  labor: 'border-node-labor bg-node-labor/10 text-node-labor',
  demographic: 'border-node-demographic bg-node-demographic/10 text-node-demographic',
  fiscal: 'border-node-fiscal bg-node-fiscal/10 text-node-fiscal',
  capital: 'border-node-capital bg-node-capital/10 text-node-capital'
};

export function LoopNodeComponent({ node, position, isActive, onClick }: LoopNodeProps) {
  const intensityScale = 0.8 + node.intensity * 0.4;
  
  return (
    <button
      onClick={onClick}
      className={cn(
        'absolute flex flex-col items-center justify-center',
        'w-16 h-16 rounded-full border-2 transition-all duration-300',
        'hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        categoryColors[node.category],
        isActive && 'ring-2 ring-ring ring-offset-2'
      )}
      style={{
        left: position.x - 32,
        top: position.y - 32,
        transform: `scale(${intensityScale})`,
        opacity: 0.6 + node.intensity * 0.4
      }}
    >
      <span className="text-xs font-semibold text-center leading-tight px-1">
        {node.shortLabel}
      </span>
      <span className="text-[10px] opacity-70">
        {Math.round(node.intensity * 100)}%
      </span>
    </button>
  );
}
