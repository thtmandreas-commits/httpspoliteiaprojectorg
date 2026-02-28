import { cn } from '@/lib/utils';

interface BrandHeaderProps {
  showSubtitle?: boolean;
  showTrustBadge?: boolean;
  className?: string;
}

export function BrandHeader({ 
  showSubtitle = true, 
  showTrustBadge = false,
  className 
}: BrandHeaderProps) {
  return (
    <div className={cn('text-center', className)}>
      {/* Main Title */}
      <h1 
        className="text-2xl font-black tracking-[0.15em] uppercase"
        style={{ 
          color: 'hsl(var(--brand-title))',
          letterSpacing: '0.12em',
          fontStretch: 'condensed'
        }}
      >
        THE GREAT DOOM LOOP
      </h1>
      
      {/* Subtitle */}
      {showSubtitle && (
        <p 
          className="text-[10px] tracking-[0.25em] uppercase mt-0.5"
          style={{ color: 'hsl(var(--brand-subtitle))' }}
        >
          The feedback loop reshaping labor, capital, and civilization
        </p>
      )}
      
      {/* Trust Badge */}
      {showTrustBadge && (
        <div 
          className="mt-2 text-[9px] tracking-wider"
          style={{ color: 'hsl(var(--brand-trust))' }}
        >
          <span className="opacity-80">No sign-ups.</span>
          <span className="mx-1.5 opacity-40">·</span>
          <span className="opacity-80">No paywall.</span>
          <span className="mx-1.5 opacity-40">·</span>
          <span className="opacity-80">Ever.</span>
        </div>
      )}
    </div>
  );
}
