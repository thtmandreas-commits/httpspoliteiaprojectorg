import { cn } from '@/lib/utils';
import { Activity, Sliders, Users, ShieldAlert, Newspaper } from 'lucide-react';

type TabId = 'loop' | 'controls' | 'countries' | 'interventions' | 'reflect' | 'news';

interface NavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  className?: string;
}

const tabs = [
  { id: 'loop' as TabId, icon: Activity, label: 'Loop' },
  { id: 'controls' as TabId, icon: Sliders, label: 'Controls' },
  { id: 'countries' as TabId, icon: Users, label: 'Countries' },
  { id: 'interventions' as TabId, icon: ShieldAlert, label: 'Policy' },
  { id: 'news' as TabId, icon: Newspaper, label: 'Now' },
];

export function Navigation({ activeTab, onTabChange, className }: NavigationProps) {
  return (
    <nav className={cn('fixed bottom-0 left-0 right-0 bg-card border-t z-50', className)}>
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={cn(
              'flex flex-col items-center justify-center gap-1 px-3 py-2 transition-colors',
              activeTab === id
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
