-- Ensure all cerebro tables exist

-- Create cerebro_insights table if it doesn't exist
CREATE TABLE IF NOT EXISTS cerebro_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email VARCHAR(255) NOT NULL,
  insight_type VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  confidence_score DECIMAL(3,2),
  source VARCHAR(50),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create test_combination_patterns table if it doesn't exist
CREATE TABLE IF NOT EXISTS test_combination_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pattern_name VARCHAR(255) NOT NULL,
  test_types TEXT[] NOT NULL,
  description TEXT,
  career_recommendations TEXT[],
  skill_focus TEXT[],
  confidence_score DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chilean_market_insights table if it doesn't exist
CREATE TABLE IF NOT EXISTS chilean_market_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  industry VARCHAR(255) NOT NULL,
  role_title VARCHAR(255) NOT NULL,
  demand_level VARCHAR(50),
  avg_salary_range VARCHAR(100),
  required_skills TEXT[],
  growth_trend VARCHAR(50),
  description TEXT,
  source VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_cerebro_insights_user_email ON cerebro_insights(user_email);
CREATE INDEX IF NOT EXISTS idx_cerebro_insights_type ON cerebro_insights(insight_type);
CREATE INDEX IF NOT EXISTS idx_test_patterns_types ON test_combination_patterns USING gin(test_types);
CREATE INDEX IF NOT EXISTS idx_market_insights_industry ON chilean_market_insights(industry);
