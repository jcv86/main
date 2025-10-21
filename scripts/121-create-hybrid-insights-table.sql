-- Create table for storing hybrid AI insights
CREATE TABLE IF NOT EXISTS cerebro_hybrid_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  test_type VARCHAR(100) NOT NULL,
  insights JSONB NOT NULL,
  recommendations JSONB NOT NULL,
  development_plan JSONB NOT NULL,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_hybrid_insights_user_test 
  ON cerebro_hybrid_insights(user_id, test_type, generated_at DESC);

-- Add comment
COMMENT ON TABLE cerebro_hybrid_insights IS 'Stores hybrid insights combining OpenAI and Cerebro intelligence';
