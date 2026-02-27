import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Fixed 12-category signal taxonomy
type SignalCategory = 
  | 'capital_labor_decoupling'
  | 'automation_substitution'
  | 'wage_compression'
  | 'family_formation_friction'
  | 'fertility_decline'
  | 'dependency_ratio_stress'
  | 'tax_base_erosion'
  | 'welfare_system_strain'
  | 'policy_paralysis'
  | 'legitimacy_erosion'
  | 'redistribution_experimentation'
  | 'structural_adaptation';

// Keyword patterns for signal classification
// Headlines are ephemeral - classified and immediately discarded
const signalClassifiers: Record<SignalCategory, {
  keywords: string[];
  affectedNodes: string[];
}> = {
  capital_labor_decoupling: {
    keywords: ['profit margin', 'shareholder return', 'capital gains', 'dividend', 'buyback', 'wealth gap', 'top 1%', 'billionaire', 'stock surge', 'corporate profit', 'wealth inequality', 'income inequality', 'executive pay', 'ceo compensation', 'stock market record', 'market cap', 'private equity', 'hedge fund', 'asset price', 'wealth concentration', 'capital return', 'earnings beat', 'record profit', 'investor return', 'equity market'],
    affectedNodes: ['capital', 'income']
  },
  automation_substitution: {
    keywords: ['ai replace', 'robot', 'automate', 'machine learning', 'chatgpt', 'artificial intelligence', 'autonomous', 'gpt', 'neural', 'algorithm', 'generative ai', 'large language model', 'llm', 'deep learning', 'computer vision', 'self-driving', 'job automation', 'ai model', 'openai', 'anthropic', 'gemini', 'copilot', 'ai tool', 'ai agent', 'workforce automation', 'robotic process', 'rpa', 'ai startup', 'tech layoff', 'coding assistant', 'ai chip', 'gpu demand'],
    affectedNodes: ['ai', 'labor']
  },
  wage_compression: {
    keywords: ['wage stagnant', 'salary cut', 'pay freeze', 'income decline', 'real wage', 'purchasing power', 'minimum wage', 'wage gap', 'wage growth', 'pay gap', 'earnings decline', 'take-home pay', 'wage squeeze', 'low pay', 'gig economy', 'zero hour', 'contract work', 'freelance', 'income stagnation', 'paycheck', 'hourly wage', 'living wage', 'wage theft', 'compensation', 'labor cost'],
    affectedNodes: ['income', 'consumption']
  },
  family_formation_friction: {
    keywords: ['housing afford', 'rent crisis', 'marriage rate', 'young adult', 'cost of living', 'student debt', 'childcare cost', 'housing cost', 'first-time buyer', 'mortgage rate', 'rent increase', 'housing shortage', 'property price', 'student loan', 'household debt', 'millennial', 'gen z', 'starter home', 'unaffordable', 'housing market', 'home ownership', 'rental market', 'eviction', 'homelessness', 'shelter cost', 'daycare', 'preschool cost'],
    affectedNodes: ['fertility', 'consumption']
  },
  fertility_decline: {
    keywords: ['birth rate', 'fertility', 'population decline', 'baby bust', 'childless', 'demographic decline', 'below replacement', 'population shrink', 'fewer babies', 'demographic crisis', 'total fertility rate', 'natalist', 'pro-natalist', 'population aging', 'depopulation', 'demographic winter', 'empty cradle', 'reproductive', 'family size', 'one-child'],
    affectedNodes: ['fertility', 'aging']
  },
  dependency_ratio_stress: {
    keywords: ['aging population', 'elderly care', 'pension crisis', 'retirement age', 'dependency ratio', 'working age', 'retiree', 'old age', 'senior care', 'nursing home', 'geriatric', 'aged care', 'grey economy', 'silver tsunami', 'demographic time bomb', 'retirement fund', 'social care', 'dementia', 'elder care', 'workforce shrink', 'labor shortage', 'worker shortage'],
    affectedNodes: ['aging', 'fiscal']
  },
  tax_base_erosion: {
    keywords: ['tax revenue', 'fiscal deficit', 'tax base', 'corporate tax', 'tax evasion', 'offshore', 'budget shortfall', 'tax avoidance', 'tax haven', 'national debt', 'government debt', 'sovereign debt', 'deficit spending', 'debt ceiling', 'fiscal cliff', 'austerity', 'bond yield', 'credit rating', 'downgrade', 'treasury', 'government borrowing', 'public debt', 'fiscal gap', 'budget deficit', 'tax reform'],
    affectedNodes: ['fiscal', 'income']
  },
  welfare_system_strain: {
    keywords: ['social security', 'medicare', 'welfare cut', 'benefit reduction', 'entitlement', 'safety net', 'pension fund', 'medicaid', 'food stamp', 'snap benefit', 'universal healthcare', 'nhs', 'public health', 'welfare state', 'social protection', 'disability benefit', 'unemployment benefit', 'social insurance', 'welfare reform', 'healthcare cost', 'insurance premium', 'out of pocket', 'health spending'],
    affectedNodes: ['fiscal', 'aging']
  },
  policy_paralysis: {
    keywords: ['gridlock', 'partisan', 'reform fail', 'legislation stall', 'congress block', 'political deadlock', 'veto', 'filibuster', 'government shutdown', 'political crisis', 'coalition collapse', 'no confidence', 'impeach', 'polariz', 'divided government', 'hung parliament', 'minority government', 'political instability', 'election uncertainty', 'policy uncertainty', 'regulation delay', 'bureaucracy'],
    affectedNodes: ['fiscal', 'labor']
  },
  legitimacy_erosion: {
    keywords: ['trust decline', 'institution', 'approval rating', 'protest', 'discontent', 'populist', 'anti-establishment', 'distrust', 'corruption', 'scandal', 'misinformation', 'disinformation', 'fake news', 'conspiracy', 'civil unrest', 'riot', 'strike action', 'demonstration', 'social unrest', 'public anger', 'voter turnout', 'democratic backsliding', 'authoritarian', 'censorship', 'freedom of press'],
    affectedNodes: ['consumption', 'fertility']
  },
  redistribution_experimentation: {
    keywords: ['universal basic', 'ubi', 'wealth tax', 'guaranteed income', 'pilot program', 'social dividend', 'basic income', 'carbon tax', 'windfall tax', 'excess profit tax', 'inheritance tax', 'estate tax', 'progressive tax', 'land value tax', 'guaranteed job', 'job guarantee', 'public investment', 'stimulus check', 'cash transfer', 'sovereign wealth fund', 'reparation'],
    affectedNodes: ['income', 'capital']
  },
  structural_adaptation: {
    keywords: ['reform pass', 'policy success', 'breakthrough', 'bipartisan', 'innovation policy', 'retraining program', 'skills initiative', 'green transition', 'industrial policy', 'infrastructure bill', 'education reform', 'vocational training', 'apprenticeship', 'upskilling', 'reskilling', 'digital literacy', 'stem education', 'trade agreement', 'supply chain', 'reshoring', 'nearshoring', 'climate adaptation', 'energy transition', 'renewable energy'],
    affectedNodes: ['labor', 'fiscal']
  }
};

interface RSSItem {
  title: string;
  description?: string;
}

interface ClassifiedSignal {
  id: string;
  category: SignalCategory;
  direction: 'increasing' | 'decreasing' | 'stable';
  strength: 'weak' | 'moderate' | 'strong';
  timestamp: number;
  affectedNodes: string[];
  weight: number;
}

// Parse RSS XML to extract items (content is ephemeral)
function parseRSS(xml: string): RSSItem[] {
  const items: RSSItem[] = [];
  const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi;
  let match;
  
  while ((match = itemRegex.exec(xml)) !== null) {
    const itemContent = match[1];
    const titleMatch = /<title[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/i.exec(itemContent);
    const descMatch = /<description[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/description>/i.exec(itemContent);
    
    if (titleMatch) {
      items.push({
        title: titleMatch[1].replace(/<[^>]*>/g, '').trim(),
        description: descMatch ? descMatch[1].replace(/<[^>]*>/g, '').trim() : undefined,
      });
    }
  }
  
  return items;
}

// Classify text into signal category (text discarded after classification)
function classifyContent(text: string): { category: SignalCategory; strength: 'weak' | 'moderate' | 'strong' } | null {
  const lowerText = text.toLowerCase();
  let bestMatch: { category: SignalCategory; score: number } | null = null;
  
  for (const [category, config] of Object.entries(signalClassifiers)) {
    const matchCount = config.keywords.filter(kw => lowerText.includes(kw)).length;
    if (matchCount > 0 && (!bestMatch || matchCount > bestMatch.score)) {
      bestMatch = { category: category as SignalCategory, score: matchCount };
    }
  }
  
  if (!bestMatch) return null;
  
  const strength = bestMatch.score >= 3 ? 'strong' : bestMatch.score >= 2 ? 'moderate' : 'weak';
  return { category: bestMatch.category, strength };
}

// Infer direction from text patterns
function inferDirection(text: string): 'increasing' | 'decreasing' | 'stable' {
  const lowerText = text.toLowerCase();
  const increasingPatterns = ['rise', 'increase', 'grow', 'surge', 'spike', 'jump', 'expand', 'accelerat', 'boom', 'soar'];
  const decreasingPatterns = ['fall', 'decline', 'drop', 'shrink', 'contract', 'slow', 'cut', 'reduce', 'crash', 'plunge'];
  
  const hasIncreasing = increasingPatterns.some(p => lowerText.includes(p));
  const hasDecreasing = decreasingPatterns.some(p => lowerText.includes(p));
  
  if (hasIncreasing && !hasDecreasing) return 'increasing';
  if (hasDecreasing && !hasIncreasing) return 'decreasing';
  return 'stable';
}

interface FeedResult {
  totalFeeds: number;
  feedsResponded: number;
  feedsFailed: number;
  items: RSSItem[];
  sourceBreakdown: Record<string, number>; // source label -> item count
}

function getSourceLabel(url: string): string {
  if (url.includes('bbci.co.uk')) return 'BBC';
  if (url.includes('nytimes.com')) return 'NYT';
  if (url.includes('theguardian.com')) return 'Guardian';
  if (url.includes('aljazeera.com')) return 'Al Jazeera';
  if (url.includes('cnbc.com')) return 'CNBC';
  if (url.includes('npr.org')) return 'NPR';
  return 'Other';
}

// Fetch RSS feeds
async function fetchRSSFeeds(): Promise<FeedResult> {
  const feeds = [
    // Major broadsheets - business
    'https://feeds.bbci.co.uk/news/business/rss.xml',
    'https://rss.nytimes.com/services/xml/rss/nyt/Business.xml',
    // Wire services & finance (replacing Reuters with Al Jazeera, AP, CNBC)
    'https://www.aljazeera.com/xml/rss/all.xml',
    'https://www.cnbc.com/id/100003114/device/rss/rss.html',
    'https://feeds.npr.org/1006/rss.xml',
    // Economics & policy
    'https://feeds.bbci.co.uk/news/technology/rss.xml',
    'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml',
    'https://rss.nytimes.com/services/xml/rss/nyt/Economy.xml',
    // Labor & work
    'https://feeds.bbci.co.uk/news/education/rss.xml',
    'https://rss.nytimes.com/services/xml/rss/nyt/JobMarket.xml',
    // Demographics & society
    'https://feeds.bbci.co.uk/news/health/rss.xml',
    'https://rss.nytimes.com/services/xml/rss/nyt/Health.xml',
    // World / macro
    'https://feeds.bbci.co.uk/news/world/rss.xml',
    'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',
    // Finance & politics
    'https://feeds.bbci.co.uk/news/politics/rss.xml',
    'https://feeds.npr.org/1014/rss.xml',
    // Science & innovation
    'https://rss.nytimes.com/services/xml/rss/nyt/Science.xml',
    'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml',
    // Guardian economics & inequality
    'https://www.theguardian.com/business/economics/rss',
    'https://www.theguardian.com/technology/rss',
  ];
  
  const allItems: RSSItem[] = [];
  const sourceBreakdown: Record<string, number> = {};
  let feedsFailed = 0;
  
  for (const feedUrl of feeds) {
    const label = getSourceLabel(feedUrl);
    try {
      const response = await fetch(feedUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SignalEngine/1.0)' },
      });
      
      if (response.ok) {
        const xml = await response.text();
        const items = parseRSS(xml);
        const sliced = items.slice(0, 10);
        allItems.push(...sliced);
        sourceBreakdown[label] = (sourceBreakdown[label] || 0) + sliced.length;
      } else {
        feedsFailed++;
      }
    } catch (error) {
      console.error(`Failed to fetch ${feedUrl}:`, error);
      feedsFailed++;
    }
  }
  
  return {
    totalFeeds: feeds.length,
    feedsResponded: feeds.length - feedsFailed,
    feedsFailed,
    items: allItems,
    sourceBreakdown,
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Fetching RSS feeds...');
    const feedResult = await fetchRSSFeeds();
    console.log(`Fetched ${feedResult.items.length} items from ${feedResult.feedsResponded}/${feedResult.totalFeeds} feeds`);
    
    // Classify into signals (raw content discarded immediately)
    const signals: ClassifiedSignal[] = [];
    
    for (const item of feedResult.items) {
      const text = `${item.title} ${item.description || ''}`;
      const classification = classifyContent(text);
      
      if (!classification) continue;
      
      // Limit signals per category
      const categoryCount = signals.filter(s => s.category === classification.category).length;
      if (categoryCount >= 3) continue;
      
      const config = signalClassifiers[classification.category];
      
      signals.push({
        id: `sig_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        category: classification.category,
        direction: inferDirection(text),
        strength: classification.strength,
        timestamp: Date.now(),
        affectedNodes: config.affectedNodes,
        weight: classification.strength === 'strong' ? 0.9 : 
                classification.strength === 'moderate' ? 0.6 : 0.3
      });
    }
    
    // Aggregate by category
    const aggregated: Record<string, {
      count: number;
      avgWeight: number;
      dominantDirection: 'increasing' | 'decreasing' | 'stable';
    }> = {};
    
    for (const signal of signals) {
      if (!aggregated[signal.category]) {
        aggregated[signal.category] = {
          count: 0,
          avgWeight: 0,
          dominantDirection: signal.direction,
        };
      }
      const cat = aggregated[signal.category];
      cat.avgWeight = (cat.avgWeight * cat.count + signal.weight) / (cat.count + 1);
      cat.count++;
    }
    
    const result = {
      success: true,
      timestamp: Date.now(),
      totalItemsScanned: feedResult.items.length,
      signalsDetected: signals.length,
      categoriesFound: Object.keys(aggregated).length,
      signals,
      aggregated,
      feedStats: {
        totalFeeds: feedResult.totalFeeds,
        feedsResponded: feedResult.feedsResponded,
        feedsFailed: feedResult.feedsFailed,
        sourceBreakdown: feedResult.sourceBreakdown,
      },
      privacy: 'No raw headlines stored. All content classified and immediately discarded.'
    };
    
    console.log(`Classified ${signals.length} signals across ${Object.keys(aggregated).length} categories`);
    
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in fetch-signals:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        signals: [],
        aggregated: {}
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
