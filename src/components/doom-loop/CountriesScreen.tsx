import { useState } from 'react';
import { CountryScenario } from '@/types/simulation';
import { countryScenarios } from '@/data/loopData';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TrendingDown, TrendingUp, Minus, ChevronLeft, AlertTriangle, Cpu } from 'lucide-react';

interface CountriesScreenProps {
  onSelectCountry?: (country: CountryScenario) => void;
}

const TrendBadge = ({ label, trend }: { label: string; trend: string }) => {
  const getIcon = () => {
    if (trend === 'declining' || trend === 'shrinking') return <TrendingDown className="w-3 h-3" />;
    if (trend === 'growing') return <TrendingUp className="w-3 h-3" />;
    return <Minus className="w-3 h-3" />;
  };

  const getColor = () => {
    if (trend === 'declining' || trend === 'shrinking') return 'text-flow-accelerating';
    if (trend === 'growing') return 'text-flow-stabilizing';
    return 'text-muted-foreground';
  };

  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className={cn('flex items-center gap-1 text-xs font-medium capitalize', getColor())}>
        {getIcon()}
        {trend}
      </div>
    </div>
  );
};

const StressBadge = ({ level }: { level: string }) => {
  const getColor = () => {
    if (level === 'critical') return 'text-flow-accelerating';
    if (level === 'high') return 'text-status-stressed';
    if (level === 'medium') return 'text-muted-foreground';
    return 'text-flow-stabilizing';
  };

  return (
    <div className="flex items-center justify-between py-2 border-b border-border">
      <span className="text-xs text-muted-foreground">Fiscal Stress</span>
      <div className={cn('flex items-center gap-1 text-xs font-medium capitalize', getColor())}>
        <AlertTriangle className="w-3 h-3" />
        {level}
      </div>
    </div>
  );
};

const ExposureBadge = ({ level }: { level: string }) => {
  const getColor = () => {
    if (level === 'very-high') return 'text-flow-accelerating';
    if (level === 'high') return 'text-status-stressed';
    return 'text-muted-foreground';
  };

  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-xs text-muted-foreground">AI Exposure</span>
      <div className={cn('flex items-center gap-1 text-xs font-medium capitalize', getColor())}>
        <Cpu className="w-3 h-3" />
        {level.replace('-', ' ')}
      </div>
    </div>
  );
};

export function CountriesScreen({ onSelectCountry }: CountriesScreenProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedCountry = countryScenarios.find(c => c.id === selectedId);

  if (selectedCountry) {
    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
        <button 
          onClick={() => setSelectedId(null)}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Countries
        </button>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{selectedCountry.flag}</span>
              <div>
                <h2 className="text-lg font-bold">{selectedCountry.name}</h2>
                <p className="text-xs text-muted-foreground">{selectedCountry.description}</p>
              </div>
            </div>

            <div className="border rounded-lg p-3 bg-muted/30">
              <TrendBadge label="Birth Rate" trend={selectedCountry.metrics.birthRateTrend} />
              <TrendBadge label="Workforce" trend={selectedCountry.metrics.workforceTrend} />
              <StressBadge level={selectedCountry.metrics.fiscalStress} />
              <ExposureBadge level={selectedCountry.metrics.aiExposure} />
            </div>

            <div className="mt-4">
              <div className="text-xs font-medium text-muted-foreground mb-2">Key Factors</div>
              <div className="flex flex-wrap gap-1">
                {selectedCountry.highlights.map((h, i) => (
                  <span key={i} className="text-[10px] px-2 py-1 bg-muted rounded-full">
                    {h}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {onSelectCountry && (
          <button
            onClick={() => onSelectCountry(selectedCountry)}
            className="w-full text-sm text-primary hover:underline"
          >
            Load this scenario into the simulation →
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold">Country Scenarios</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Select a country to view its demographic and economic profile.
        </p>
      </div>

      <div className="grid gap-2">
        {countryScenarios.map((country) => (
          <Card
            key={country.id}
            className="cursor-pointer transition-all hover:border-primary/50 hover:bg-accent/30"
            onClick={() => setSelectedId(country.id)}
          >
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{country.flag}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{country.name}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {country.description}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
