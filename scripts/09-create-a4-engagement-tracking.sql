-- A4 Engagement Tracking Table for A/B Testing and Metrics
CREATE TABLE IF NOT EXISTS a4_engagement_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type VARCHAR NOT NULL, -- 'radar_view', 'news_read', 'test_completed', 'action_taken', etc.
  feature VARCHAR NOT NULL, -- Feature being engaged with
  duration_seconds INT, -- How long user spent on feature
  completed BOOLEAN DEFAULT FALSE, -- Whether they completed the action
  variant VARCHAR DEFAULT 'standard', -- 'standard' or 'calibrated' for A/B test
  a4_score_at_event FLOAT, -- What was their A4 score when this happened
  metadata JSONB, -- Additional context
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_a4_engagement_user_date ON a4_engagement_tracking(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_a4_engagement_variant ON a4_engagement_tracking(variant);
CREATE INDEX IF NOT EXISTS idx_a4_engagement_event ON a4_engagement_tracking(event_type);

-- Enable Row Level Security
ALTER TABLE a4_engagement_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see their own engagement data
CREATE POLICY "Users can view own engagement" ON a4_engagement_tracking
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own engagement" ON a4_engagement_tracking
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Signal History Table (already exists, but adding here for completeness)
-- This stores detected signals from economic data
CREATE TABLE IF NOT EXISTS a4_signal_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  signal_type VARCHAR NOT NULL, -- 'structural', 'tactical', 'contextual', 'weak_signal'
  title VARCHAR NOT NULL,
  intensity VARCHAR NOT NULL, -- 'low', 'medium', 'high'
  description TEXT,
  action_recommended TEXT, -- What user should do
  metadata JSONB, -- Economic data that triggered signal
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index for signal queries
CREATE INDEX IF NOT EXISTS idx_a4_signal_user_date ON a4_signal_history(user_id, created_at);

-- Enable RLS
ALTER TABLE a4_signal_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own signals" ON a4_signal_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own signals" ON a4_signal_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);
