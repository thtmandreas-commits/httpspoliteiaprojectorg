import { CountryScenario, SimulationParams } from '@/types/simulation';
import { countryScenarios } from '@/data/loopData';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CountryExplorerProps {
  selectedCountry: string | null;
  onSelectCountry: (country: CountryScenario) => void;
  className?: string;
}

export function CountryExplorer({ selectedCountry, onSelectCountry, className }: CountryExplorerProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <h3 className="text-sm font-semibold">Country Scenarios</h3>
      <p className="text-xs text-muted-foreground">
        Explore how different nations face the doom loop based on their demographic and economic profiles.
      </p>
      
      <div className="grid gap-3">
        {countryScenarios.map((country) => (
          <Card
            key={country.id}
            className={cn(
              'cursor-pointer transition-all hover:border-primary/50',
              selectedCountry === country.id && 'border-primary bg-primary/5'
            )}
            onClick={() => onSelectCountry(country)}
          >
            <CardContent className="p-3">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{country.flag}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{country.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {country.description}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {country.highlights.map((highlight, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-1.5 py-0.5 bg-muted rounded-full"
                      >
                        {highlight}
                      </span>
                    ))}
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
