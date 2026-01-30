import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Signal classification keywords
const signalClassifiers = {
  automation_adoption: {
    keywords: ['ai', 'artificial intelligence', 'robot', 'automat', 'machine learning', 'gpt', 'chatbot', 'algorithm', 'neural', 'deep learning'],
    direction: 'increasing' as const,
  },
  labor_demand: {
    keywords: ['layoff', 'job cut', 'unemployment', 'hiring freeze', 'workforce reduction', 'downsizing', 'redundanc'],
    direction: 'decreasing' as const,
  },
  labor_demand_positive: {
    keywords: ['hiring', 'job growth', 'employment rise', 'new jobs', 'recruitment surge'],
    direction: 'increasing' as const,
    category: 'labor_demand' as const,
  },
  capital_efficiency: {
    keywords: ['profit', 'margin', 'productivity', 'efficiency', 'shareholder', 'dividend', 'buyback', 'earnings'],
    direction: 'increasing' as const,
  },
  fiscal_pressure: {
    keywords: ['deficit', 'debt', 'pension', 'social security', 'medicare', 'government spending', 'budget', 'fiscal'],
    direction: 'increasing' as const,
  },
  demographic_shift: {
    keywords: ['birth rate', 'fertility', 'aging population', 'demographic', 'population decline', 'elderly', 'retirement age'],
    direction: 'increasing' as const,
  },
  income_distribution: {
    keywords: ['inequality', 'wealth gap', 'billionaire', 'top 1%', 'income disparity', 'wage stagnation', 'wealth concentration'],
    direction: 'increasing' as const,
  },
  consumption_patterns: {
    keywords: ['consumer spending', 'retail sales', 'consumer confidence', 'purchasing', 'consumption'],
    direction: 'decreasing' as const,
  },
  workforce_participation: {
    keywords: ['labor force', 'workforce participation', 'early retirement', 'disability claim', 'not in labor force'],
    direction: 'decreasing' as const,
  },
};

// Affected nodes mapping
const categoryNodes: Record<string, string[]> = {
  automation_adoption: ['ai', 'labor'],
  labor_demand: ['labor', 'income'],
  capital_efficiency: ['capital', 'ai'],
  fiscal_pressure: ['fiscal', 'aging'],
  demographic_shift: ['fertility', 'aging'],
  income_distribution: ['income', 'consumption', 'capital'],
  consumption_patterns: ['consumption', 'fiscal'],
  workforce_participation: ['labor', 'aging', 'fiscal'],
};

interface RSSItem {
  title: string;
  description?: string;
  pubDate?: string;
  link?: string;
}

interface ClassifiedSignal {
  id: string;
  category: string;
  direction: 'increasing' | 'decreasing' | 'stable';
  strength: 'weak' | 'moderate' | 'strong';
  timestamp: number;
  affectedNodes: string[];
  weight: number;
  sourceHint?: string; // Abstract hint, not the actual headline
}

// Parse RSS XML to extract items
function parseRSS(xml: string): RSSItem[] {
  const items: RSSItem[] = [];
  const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi;
  let match;
  
  while ((match = itemRegex.exec(xml)) !== null) {
    const itemContent = match[1];
    
    const titleMatch = /<title[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/i.exec(itemContent);
    const descMatch = /<description[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/description>/i.exec(itemContent);
    const pubDateMatch = /<pubDate[^>]*>(.*?)<\/pubDate>/i.exec(itemContent);
    const linkMatch = /<link[^>]*>(.*?)<\/link>/i.exec(itemContent);
    
    if (titleMatch) {
      items.push({
        title: titleMatch[1].replace(/<[^>]*>/g, '').trim(),
        description: descMatch ? descMatch[1].replace(/<[^>]*>/g, '').trim() : undefined,
        pubDate: pubDateMatch ? pubDateMatch[1].trim() : undefined,
        link: linkMatch ? linkMatch[1].trim() : undefined,
      });
    }
  }
  
  return items;
}

// Classify a headline into signal categories
function classifyHeadline(title: string, description?: string): ClassifiedSignal | null {
  const text = `${title} ${description || ''}`.toLowerCase();
  
  for (const [key, config] of Object.entries(signalClassifiers)) {
    const matchCount = config.keywords.filter(kw => text.includes(kw.toLowerCase())).length;
    
    if (matchCount > 0) {
      const category = (config as any).category || key;
      const strength = matchCount >= 3 ? 'strong' : matchCount >= 2 ? 'moderate' : 'weak';
      const weight = strength === 'strong' ? 0.9 : strength === 'moderate' ? 0.6 : 0.3;
      
      // Create abstract hint (not the actual headline)
      const sourceHint = `Signal detected in ${category.replace(/_/g, ' ')} category`;
      
      return {
        id: `sig_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        category,
        direction: config.direction,
        strength,
        timestamp: Date.now(),
        affectedNodes: categoryNodes[category] || [],
        weight,
        sourceHint,
      };
    }
  }
  
  return null;
}

// Fetch RSS feeds from multiple sources
async function fetchRSSFeeds(): Promise<RSSItem[]> {
  const feeds = [
    // Business/Economy feeds
    'https://feeds.bbci.co.uk/news/business/rss.xml',
    'https://rss.nytimes.com/services/xml/rss/nyt/Business.xml',
    'https://feeds.reuters.com/reuters/businessNews',
  ];
  
  const allItems: RSSItem[] = [];
  
  for (const feedUrl of feeds) {
    try {
      const response = await fetch(feedUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; SignalEngine/1.0)',
        },
      });
      
      if (response.ok) {
        const xml = await response.text();
        const items = parseRSS(xml);
        allItems.push(...items.slice(0, 10)); // Limit per feed
      }
    } catch (error) {
      console.error(`Failed to fetch ${feedUrl}:`, error);
    }
  }
  
  return allItems;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Fetching RSS feeds...');
    const items = await fetchRSSFeeds();
    console.log(`Fetched ${items.length} items`);
    
    // Classify headlines into signals
    const signals: ClassifiedSignal[] = [];
    const seenCategories = new Set<string>();
    
    for (const item of items) {
      const signal = classifyHeadline(item.title, item.description);
      
      if (signal) {
        // Limit signals per category to avoid over-representation
        const categoryCount = signals.filter(s => s.category === signal.category).length;
        if (categoryCount < 3) {
          signals.push(signal);
          seenCategories.add(signal.category);
        }
      }
    }
    
    // Aggregate signals by category
    const aggregated: Record<string, {
      count: number;
      avgWeight: number;
      dominantDirection: 'increasing' | 'decreasing' | 'stable';
      signals: ClassifiedSignal[];
    }> = {};
    
    for (const signal of signals) {
      if (!aggregated[signal.category]) {
        aggregated[signal.category] = {
          count: 0,
          avgWeight: 0,
          dominantDirection: signal.direction,
          signals: [],
        };
      }
      aggregated[signal.category].count++;
      aggregated[signal.category].signals.push(signal);
    }
    
    // Calculate averages
    for (const category of Object.keys(aggregated)) {
      const catSignals = aggregated[category].signals;
      aggregated[category].avgWeight = catSignals.reduce((sum, s) => sum + s.weight, 0) / catSignals.length;
    }
    
    const result = {
      success: true,
      timestamp: Date.now(),
      totalItemsScanned: items.length,
      signalsDetected: signals.length,
      categoriesFound: Object.keys(aggregated).length,
      signals,
      aggregated,
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
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
