import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { 
  countrySignalProfiles, 
  CountrySignalProfile,
  getPressureLevel,
  getPressureColor,
  getPressureBgColor
} from '@/data/countrySignals';
import { signalCategoryMeta, signalDomains, SignalCategory } from '@/types/signals';
import { TrendingUp, TrendingDown, Minus, ChevronRight, AlertTriangle, Shield, BarChart3 } from 'lucide-react';

interface CountryCardProps {
  profile: CountrySignalProfile;
  isSelected: boolean;
  onClick: () => void;
}

function CountryCard({ profile, isSelected, onClick }: CountryCardProps) {
  const pressurePercent = Math.round(profile.loopPressure * 100);
  const level = getPressureLevel(profile.loopPressure);
  
  const TrendIcon = profile.pressureTrend === 'increasing' ? TrendingUp :
                    profile.pressureTrend === 'decreasing' ? TrendingDown : Minus;

  return (
    <Card 
      className={cn(
        'cursor-pointer transition-all',
        isSelected ? 'ring-2 ring-primary border-primary' : 'hover:border-primary/50'
      )}
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{profile.flag}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">{profile.name}</span>
              <div className={cn('flex items-center gap-1 text-xs font-medium', getPressureColor(profile.loopPressure))}>
                <TrendIcon className="w-3 h-3" />
              </div>
            </div>
            <div className="mt-1.5">
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className={cn('h-full rounded-full transition-all', getPressureBgColor(profile.loopPressure))}
                  style={{ width: `${pressurePercent}%` }}
                />
              </div>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className={cn('text-[10px] capitalize', getPressureColor(profile.loopPressure))}>
                {level} pressure
              </span>
              <ChevronRight className="w-3 h-3 text-muted-foreground" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface DomainHeatmapProps {
  profile: CountrySignalProfile;
  domain: { label: string; categories: SignalCategory[] };
}

function DomainHeatmap({ profile, domain }: DomainHeatmapProps) {
  return (
    <div className="mb-2">
      <div className="text-[9px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
        {domain.label}
      </div>
      <div className="grid grid-cols-3 gap-1">
        {domain.categories.map(cat => {
          const score = profile.categoryScores[cat];
          const meta = signalCategoryMeta[cat];
          const isStress = meta.isAccelerating;
          
          // Score > 0.5 = concerning for stress categories, positive for adaptation
          const intensity = score.score;
          const colorClass = isStress 
            ? (intensity > 0.6 ? 'bg-flow-accelerating' : intensity > 0.4 ? 'bg-status-stressed' : 'bg-muted-foreground')
            : (intensity > 0.4 ? 'bg-flow-stabilizing' : 'bg-muted-foreground');
          
          return (
            <div 
              key={cat}
              className={cn('h-4 rounded-sm', colorClass)}
              style={{ opacity: 0.3 + intensity * 0.6 }}
              title={`${meta.label}: ${score.trend}`}
            />
          );
        })}
      </div>
    </div>
  );
}

function CountryDetail({ profile }: { profile: CountrySignalProfile }) {
  const level = getPressureLevel(profile.loopPressure);
  
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-2">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="text-3xl">{profile.flag}</span>
        <div>
          <h4 className="font-semibold">{profile.name}</h4>
          <div className={cn('flex items-center gap-1.5 text-sm', getPressureColor(profile.loopPressure))}>
            <BarChart3 className="w-3.5 h-3.5" />
            <span className="capitalize">{level} pressure</span>
          </div>
        </div>
      </div>

      {/* Pressure Bar */}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className={cn('h-full rounded-full transition-all', getPressureBgColor(profile.loopPressure))}
          style={{ width: `${profile.loopPressure * 100}%` }}
        />
      </div>

      {/* Domain Heatmaps */}
      <Card>
        <CardContent className="p-3">
          <div className="text-xs font-medium mb-2">Signal Profile</div>
          {Object.entries(signalDomains).map(([key, domain]) => (
            <DomainHeatmap key={key} profile={profile} domain={domain} />
          ))}
          <div className="flex items-center justify-center gap-4 mt-3 pt-2 border-t text-[9px] text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-flow-accelerating opacity-70" />
              Stress
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-muted-foreground opacity-50" />
              Neutral
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-flow-stabilizing opacity-70" />
              Adapting
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk & Stabilizing Factors */}
      <div className="grid grid-cols-2 gap-2">
        <Card>
          <CardContent className="p-2.5">
            <div className="flex items-center gap-1.5 text-[10px] font-medium text-flow-accelerating mb-1.5">
              <AlertTriangle className="w-3 h-3" />
              Risk Factors
            </div>
            <ul className="space-y-0.5">
              {profile.riskFactors.map((f, i) => (
                <li key={i} className="text-[10px] text-muted-foreground">• {f}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-2.5">
            <div className="flex items-center gap-1.5 text-[10px] font-medium text-flow-stabilizing mb-1.5">
              <Shield className="w-3 h-3" />
              Stabilizing
            </div>
            <ul className="space-y-0.5">
              {profile.stabilizingFactors.map((f, i) => (
                <li key={i} className="text-[10px] text-muted-foreground">• {f}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function CountrySignalComparison() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  
  const selectedProfile = countrySignalProfiles.find(p => p.countryId === selectedCountry);
  
  // Sort by pressure descending
  const sortedProfiles = [...countrySignalProfiles].sort((a, b) => b.loopPressure - a.loopPressure);

  return (
    <div className="space-y-3">
      <div className="text-xs font-medium text-muted-foreground">
        Regional Loop Pressure Comparison
      </div>
      
      {selectedProfile ? (
        <>
          <button 
            onClick={() => setSelectedCountry(null)}
            className="text-xs text-primary hover:underline"
          >
            ← Back to comparison
          </button>
          <CountryDetail profile={selectedProfile} />
        </>
      ) : (
        <div className="space-y-2">
          {sortedProfiles.map(profile => (
            <CountryCard 
              key={profile.countryId}
              profile={profile}
              isSelected={selectedCountry === profile.countryId}
              onClick={() => setSelectedCountry(profile.countryId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
