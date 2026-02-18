-- News Cache Table for NewsAPI Integration
-- Stores cached news articles to avoid hitting API limits

CREATE TABLE IF NOT EXISTS despega_news_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- NewsAPI article metadata
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  url TEXT UNIQUE NOT NULL,
  urlToImage TEXT,
  publishedAt TIMESTAMP WITH TIME ZONE,
  source_name TEXT,
  author TEXT,
  
  -- Categorization and filtering
  category TEXT, -- tech, business, startups, career, finance, leadership, innovation, market
  keywords TEXT[], -- array of keywords for search
  relevance_score FLOAT, -- 0-1 score based on A1 pattern match
  
  -- Cache management
  fetched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE, -- 6 hours from fetched_at
  is_active BOOLEAN DEFAULT true,
  
  -- Engagement tracking
  views_count INT DEFAULT 0,
  clicks_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for efficient queries
CREATE INDEX idx_despega_news_cache_category ON despega_news_cache(category);
CREATE INDEX idx_despega_news_cache_expires_at ON despega_news_cache(expires_at);
CREATE INDEX idx_despega_news_cache_is_active ON despega_news_cache(is_active);
CREATE INDEX idx_despega_news_cache_published_at ON despega_news_cache(publishedAt DESC);

-- RLS Policies
ALTER TABLE despega_news_cache ENABLE ROW LEVEL SECURITY;

-- Everyone can read news
CREATE POLICY "Anyone can read news cache"
  ON despega_news_cache FOR SELECT
  USING (true);

-- Only authenticated users can increment engagement
CREATE POLICY "Users can track engagement"
  ON despega_news_cache FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Service role can insert and manage cache
CREATE POLICY "Service role manages cache"
  ON despega_news_cache
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
