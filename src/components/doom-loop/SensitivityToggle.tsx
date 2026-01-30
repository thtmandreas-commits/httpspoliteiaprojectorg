import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface SensitivityToggleProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export function SensitivityToggle({
  label,
  value,
  onChange,
  className
}: SensitivityToggleProps) {
  const isExtreme = value <= 5 || value >= 95;
  const isVeryExtreme = value === 0 || value === 100;
  
  return (
    <div className={cn('space-y-1.5 relative', className)}>
      <div className="flex items-center justify-between">
        <span className={cn(
          'text-sm transition-colors duration-300',
          isExtreme ? 'text-foreground/80' : 'text-muted-foreground'
        )}>
          {label}
        </span>
        <div className="flex items-center gap-1.5">
          {/* Subtle strain indicator */}
          {isExtreme && (
            <span 
              className={cn(
                'text-[10px] uppercase tracking-wider transition-opacity duration-500',
                isVeryExtreme 
                  ? 'text-muted-foreground/60 animate-pulse' 
                  : 'text-muted-foreground/40'
              )}
            >
              {value <= 5 ? 'min' : 'max'}
            </span>
          )}
          <span className={cn(
            'text-xs font-mono tabular-nums transition-all duration-300',
            isVeryExtreme 
              ? 'text-foreground/70' 
              : 'text-muted-foreground/70'
          )}>
            {value}
          </span>
        </div>
      </div>
      
      {/* Slider with extreme value styling */}
      <div className="relative">
        {/* Subtle glow effect at extremes */}
        {isVeryExtreme && (
          <div 
            className={cn(
              'absolute inset-0 -z-10 rounded-full opacity-30 blur-sm transition-opacity duration-500',
              value === 0 
                ? 'bg-gradient-to-r from-muted-foreground/20 to-transparent' 
                : 'bg-gradient-to-l from-muted-foreground/20 to-transparent'
            )}
          />
        )}
        
        <Slider
          value={[value]}
          onValueChange={([v]) => onChange(v)}
          min={0}
          max={100}
          step={1}
          className={cn(
            'w-full transition-opacity duration-300',
            isExtreme ? 'opacity-90' : 'opacity-70 hover:opacity-100'
          )}
        />
      </div>
      
      {/* Edge tension indicator bar */}
      <div className="h-px w-full relative overflow-hidden">
        <div 
          className={cn(
            'absolute inset-0 transition-all duration-500',
            isVeryExtreme 
              ? 'bg-gradient-to-r from-border/40 via-border/60 to-border/40' 
              : 'bg-transparent'
          )}
          style={{
            opacity: isVeryExtreme ? 1 : 0,
          }}
        />
      </div>
    </div>
  );
}
