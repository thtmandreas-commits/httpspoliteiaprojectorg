import { useState, useCallback } from 'react';
import { useSimulation } from '@/hooks/useSimulation';
import { useSignalEngine } from '@/hooks/useSignalEngine';
import { LoopScreen } from '@/components/doom-loop/LoopScreen';
import { YouScreen } from '@/components/doom-loop/YouScreen';
import { CountriesScreen } from '@/components/doom-loop/CountriesScreen';
import { InterventionsScreen } from '@/components/doom-loop/InterventionsScreen';
import { NowScreen } from '@/components/doom-loop/NowScreen';
import { AboutScreen } from '@/components/doom-loop/AboutScreen';
import { Navigation } from '@/components/doom-loop/Navigation';
import { BrandHeader } from '@/components/doom-loop/BrandHeader';
import { AdPlaceholder } from '@/components/doom-loop/AdPlaceholder';
import { CountryScenario } from '@/types/simulation';
import { Signal } from '@/types/signals';

type TabId = 'loop' | 'you' | 'countries' | 'interventions' | 'now' | 'about';

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

  // Signal engine for live data integration
  const { 
    aggregatedSignals, 
    loopPressure, 
    loopPressureTrend,
    addLiveSignals 
  } = useSignalEngine();

  const handleSelectCountry = useCallback((country: CountryScenario) => {
    setAllParams(country.params);
    setActiveTab('loop');
  }, [setAllParams]);

  // Handler for when NowScreen fetches new signals
  const handleSignalsReceived = useCallback((newSignals: Signal[]) => {
    addLiveSignals(newSignals);
  }, [addLiveSignals]);

  // Show prominent branding on Loop, Now, and About screens
  const showBrandHeader = activeTab === 'loop' || activeTab === 'now' || activeTab === 'about';
  // Show trust badge only on Loop screen (first impression)
  const showTrustBadge = activeTab === 'loop';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
        <div className="max-w-lg mx-auto px-4 py-3">
          {showBrandHeader ? (
            <BrandHeader showTrustBadge={showTrustBadge} />
          ) : (
            <div className="text-center">
              <h1 
                className="text-sm font-bold tracking-[0.1em] uppercase"
                style={{ color: 'hsl(var(--brand-title))' }}
              >
                DOOM LOOP
              </h1>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-lg mx-auto px-4 py-4 w-full pb-24">
        {activeTab === 'loop' && (
          <div className="animate-in fade-in">
            <LoopScreen
              nodes={nodes}
              params={params}
              onParamChange={updateParam}
              overallTension={overallTension}
              tensionLevel={tensionLevel}
              aggregatedSignals={aggregatedSignals}
              signalLoopPressure={loopPressure}
              signalPressureTrend={loopPressureTrend}
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
          <div className="animate-in fade-in space-y-4">
            <NowScreen />
            {/* Ad placeholder in Now screen - separated from content */}
            <AdPlaceholder variant="block" className="mt-6" />
          </div>
        )}

        {activeTab === 'about' && (
          <div className="animate-in fade-in">
            <AboutScreen />
          </div>
        )}
      </main>

      {/* Ad Banner - Fixed above navigation (not shown on About) */}
      {activeTab !== 'about' && (
        <div className="fixed bottom-16 left-0 right-0 z-30">
          <AdPlaceholder variant="banner" />
        </div>
      )}

      {/* Bottom Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
