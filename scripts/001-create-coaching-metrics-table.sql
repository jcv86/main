-- Create coaching metrics table to track engagement, satisfaction, and completed actions
-- Based on document pages 61-63: engagement >2 messages, satisfaction >4★, action completed

CREATE TABLE IF NOT EXISTS coaching_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL,
  session_id UUID REFERENCES coaching_sessions(id) ON DELETE CASCADE,
  
  -- Engagement metrics
  message_count INTEGER DEFAULT 0,
  engagement_score NUMERIC(3,2), -- Calculated: message_count / target (2 messages)
  
  -- Satisfaction metrics
  satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
  satisfaction_feedback TEXT,
  
  -- Action completion metrics
  suggested_action TEXT,
  action_completed BOOLEAN DEFAULT FALSE,
  action_completed_at TIMESTAMP WITH TIME ZONE,
  action_notes TEXT,
  
  -- Metadata
  coach_type TEXT CHECK (coach_type IN ('sofia', 'dani', 'hybrid')),
  conversation_category TEXT, -- autoconocimiento, cv, entrevistas, crecimiento, transicion
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_coaching_metrics_user_email ON coaching_metrics(user_email);
CREATE INDEX IF NOT EXISTS idx_coaching_metrics_session_id ON coaching_metrics(session_id);
CREATE INDEX IF NOT EXISTS idx_coaching_metrics_created_at ON coaching_metrics(created_at DESC);

-- Enable RLS
ALTER TABLE coaching_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own metrics"
  ON coaching_metrics FOR SELECT
  USING (user_email = current_setting('request.jwt.claims', true)::json->>'email');

CREATE POLICY "Users can insert own metrics"
  ON coaching_metrics FOR INSERT
  WITH CHECK (user_email = current_setting('request.jwt.claims', true)::json->>'email');

CREATE POLICY "Users can update own metrics"
  ON coaching_metrics FOR UPDATE
  USING (user_email = current_setting('request.jwt.claims', true)::json->>'email');

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_coaching_metrics_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER coaching_metrics_updated_at
  BEFORE UPDATE ON coaching_metrics
  FOR EACH ROW
  EXECUTE FUNCTION update_coaching_metrics_updated_at();

-- Function to calculate engagement score
CREATE OR REPLACE FUNCTION calculate_engagement_score(msg_count INTEGER)
RETURNS NUMERIC AS $$
BEGIN
  -- Target is 2 messages according to document
  RETURN LEAST(msg_count / 2.0, 1.0);
END;
$$ LANGUAGE plpgsql;
