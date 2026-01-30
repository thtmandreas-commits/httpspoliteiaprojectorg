import { useState, useCallback } from 'react';
import { useSimulation } from '@/hooks/useSimulation';
import { LoopScreen } from '@/components/doom-loop/LoopScreen';
import { YouScreen } from '@/components/doom-loop/YouScreen';
import { CountriesScreen } from '@/components/doom-loop/CountriesScreen';
import { InterventionsScreen } from '@/components/doom-loop/InterventionsScreen';
import { NowScreen } from '@/components/doom-loop/NowScreen';
import { Navigation } from '@/components/doom-loop/Navigation';
import { CountryScenario } from '@/types/simulation';

type TabId = 'loop' | 'you' | 'countries' | 'interventions' | 'now';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabId>('loop');
  
  const {
    params,
    updateParam,
    setAllParams,
    nodes,
    overallTension,
    tensionLevel
  } = useSimulation();

  const handleSelectCountry = useCallback((country: CountryScenario) => {
    setAllParams(country.params);
    setActiveTab('loop');
  }, [setAllParams]);

  return (
    <div className="min-h-screen bg-background pb-20">
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
          <div className="animate-in fade-in">
            <LoopScreen
              nodes={nodes}
              params={params}
              onParamChange={updateParam}
              overallTension={overallTension}
              tensionLevel={tensionLevel}
            />
          </div>
        )}

        {activeTab === 'you' && (
          <div className="animate-in fade-in">
            <YouScreen />
          </div>
        )}

        {activeTab === 'countries' && (
          <div className="animate-in fade-in">
            <CountriesScreen onSelectCountry={handleSelectCountry} />
          </div>
        )}

        {activeTab === 'interventions' && (
          <div className="animate-in fade-in">
            <InterventionsScreen nodes={nodes} />
          </div>
        )}

        {activeTab === 'now' && (
          <div className="animate-in fade-in">
            <NowScreen />
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
