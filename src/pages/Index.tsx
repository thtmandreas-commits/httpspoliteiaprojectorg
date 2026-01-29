import { useState, useCallback } from 'react';
import { useSimulation } from '@/hooks/useSimulation';
import { LoopDiagram } from '@/components/doom-loop/LoopDiagram';
import { TensionGauge } from '@/components/doom-loop/TensionGauge';
import { ControlPanel } from '@/components/doom-loop/ControlPanel';
import { CountryExplorer } from '@/components/doom-loop/CountryExplorer';
import { InterventionsPanel } from '@/components/doom-loop/InterventionsPanel';
import { Questionnaire } from '@/components/doom-loop/Questionnaire';
import { NewsFeed } from '@/components/doom-loop/NewsFeed';
import { Navigation } from '@/components/doom-loop/Navigation';
import { CountryScenario, SimulationParams } from '@/types/simulation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsTrigger, TabsList } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

type TabId = 'loop' | 'controls' | 'countries' | 'interventions' | 'reflect' | 'news';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabId>('loop');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  
  const {
    params,
    updateParam,
    setAllParams,
    resetParams,
    nodes,
    connections,
    overallTension,
    tensionLevel
  } = useSimulation();

  const handleSelectCountry = useCallback((country: CountryScenario) => {
    setSelectedCountry(country.id);
    setAllParams(country.params);
  }, [setAllParams]);

  const handleApplyIntervention = useCallback((effects: Partial<SimulationParams>) => {
    const newParams = { ...params };
    Object.entries(effects).forEach(([key, value]) => {
      const paramKey = key as keyof SimulationParams;
      newParams[paramKey] = Math.max(0, Math.min(100, newParams[paramKey] + value));
    });
    setAllParams(newParams);
    setActiveTab('loop');
  }, [params, setAllParams]);

  return (
    <div className="min-h-screen bg-background dark pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
        <div className="max-w-lg mx-auto px-4 py-3">
          <h1 className="text-lg font-bold tracking-tight">Doom Loop</h1>
          <p className="text-xs text-muted-foreground">
            AI · Demographics · Economics
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-4">
        {activeTab === 'loop' && (
          <div className="space-y-4 animate-in fade-in">
            <TensionGauge tension={overallTension} level={tensionLevel} />
            <LoopDiagram nodes={nodes} connections={connections} />
            
            <div className="p-4 rounded-lg bg-card border">
              <h3 className="text-sm font-semibold mb-2">Understanding the Loop</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                This diagram shows a self-reinforcing feedback loop. AI automation displaces labor, 
                reducing incomes and consumption. Economic insecurity lowers fertility, accelerating 
                population aging. Aging strains public finances, creating pressure for more automation. 
                Meanwhile, productivity gains concentrate in capital owners.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Tap any node to see details. Use the Controls tab to adjust parameters.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'controls' && (
          <div className="animate-in fade-in">
            <TensionGauge tension={overallTension} level={tensionLevel} className="mb-4" />
            <ControlPanel
              params={params}
              onParamChange={updateParam}
              onReset={resetParams}
            />
          </div>
        )}

        {activeTab === 'countries' && (
          <div className="animate-in fade-in">
            <CountryExplorer
              selectedCountry={selectedCountry}
              onSelectCountry={handleSelectCountry}
            />
          </div>
        )}

        {activeTab === 'interventions' && (
          <div className="animate-in fade-in">
            <InterventionsPanel onApplyIntervention={handleApplyIntervention} />
          </div>
        )}

        {activeTab === 'reflect' && (
          <div className="animate-in fade-in">
            <Questionnaire />
          </div>
        )}

        {activeTab === 'news' && (
          <div className="animate-in fade-in">
            <NewsFeed />
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
