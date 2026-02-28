import { LoopNode as LoopNodeType } from '@/types/simulation';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface LoopNodeProps {
  node: LoopNodeType;
  position: { x: number; y: number };
  isActive?: boolean;
  onClick?: () => void;
  stressLevel?: number; // 0-1, from signal aggregation
  uncertainty?: number; // 0-1, visual uncertainty
}

const categoryColors: Record<string, string> = {
  ai: 'border-node-ai bg-node-ai/10 text-node-ai',
  labor: 'border-node-labor bg-node-labor/10 text-node-labor',
  demographic: 'border-node-demographic bg-node-demographic/10 text-node-demographic',
  fiscal: 'border-node-fiscal bg-node-fiscal/10 text-node-fiscal',
  capital: 'border-node-capital bg-node-capital/10 text-node-capital',
  price: 'border-primary bg-primary/10 text-primary'
};

const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'neutral' }) => {
  if (trend === 'up') return <TrendingUp className="w-3 h-3" />;
  if (trend === 'down') return <TrendingDown className="w-3 h-3" />;
  return <Minus className="w-3 h-3" />;
};

export function LoopNodeComponent({ 
  node, 
  position, 
  isActive, 
  onClick,
  stressLevel = 0,
  uncertainty = 0 
}: LoopNodeProps) {
  const intensityScale = 0.8 + node.intensity * 0.4;
  
  // Apply stress indicator - higher stress = warmer color shift
  const stressIndicator = stressLevel > 0.6 ? 'ring-2 ring-flow-accelerating/50' :
                          stressLevel > 0.3 ? 'ring-1 ring-status-stressed/40' : '';
  
  // Apply uncertainty - blur and opacity reduction
  const blurStyle = uncertainty > 0.5 ? 'blur-[0.5px]' : '';
  const baseOpacity = 0.6 + node.intensity * 0.4;
  const adjustedOpacity = baseOpacity * (1 - uncertainty * 0.3);
  
  return (
    <button
      onClick={onClick}
      className={cn(
        'absolute flex flex-col items-center justify-center',
        'w-16 h-16 rounded-full border-2 transition-all duration-300',
        'hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        categoryColors[node.category],
        isActive && 'ring-2 ring-ring ring-offset-2',
        stressIndicator,
        blurStyle
      )}
      style={{
        left: position.x - 32,
        top: position.y - 32,
        transform: `scale(${intensityScale})`,
        opacity: adjustedOpacity
      }}
    >
      <span className="text-xs font-semibold text-center leading-tight px-1">
        {node.shortLabel}
      </span>
      <div className="flex items-center gap-0.5 mt-0.5">
        <TrendIcon trend={node.trend} />
      </div>
      
      {/* Stress pulse indicator */}
      {stressLevel > 0.5 && (
        <div 
          className="absolute inset-0 rounded-full bg-flow-accelerating/20 animate-pulse"
          style={{ animationDuration: `${2 - stressLevel}s` }}
        />
      )}
    </button>
  );
}
