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
  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-xs font-mono text-muted-foreground/70 tabular-nums">
          {value}
        </span>
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={0}
        max={100}
        step={1}
        className="w-full opacity-80 hover:opacity-100 transition-opacity"
      />
    </div>
  );
}
