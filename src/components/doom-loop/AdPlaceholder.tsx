import { cn } from '@/lib/utils';

interface AdPlaceholderProps {
  variant?: 'banner' | 'block';
  className?: string;
}

export function AdPlaceholder({ variant = 'banner', className }: AdPlaceholderProps) {
  if (variant === 'banner') {
    return (
      <div 
        className={cn(
          'w-full py-2 px-3 flex items-center justify-center border-t',
          className
        )}
        style={{ 
          backgroundColor: 'hsl(var(--ad-placeholder))',
          borderColor: 'hsl(var(--ad-placeholder-border))'
        }}
      >
        <span 
          className="text-[9px] tracking-widest uppercase opacity-50"
          style={{ color: 'hsl(var(--muted-foreground))' }}
        >
          Sponsored insight
        </span>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        'w-full py-6 px-4 flex items-center justify-center rounded-md border',
        className
      )}
      style={{ 
        backgroundColor: 'hsl(var(--ad-placeholder))',
        borderColor: 'hsl(var(--ad-placeholder-border))'
      }}
    >
      <span 
        className="text-[10px] tracking-widest uppercase opacity-40"
        style={{ color: 'hsl(var(--muted-foreground))' }}
      >
        Sponsored insight
      </span>
    </div>
  );
}
