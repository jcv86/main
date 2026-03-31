-- V1 Analytics Table - Recolecta eventos de observación en todas las etapas
-- Stores drop-off points, confusion patterns, retention gaps

CREATE TABLE IF NOT EXISTS v1_analytics (
  id BIGSERIAL PRIMARY KEY,
  event_type VARCHAR(255) NOT NULL,
  stage VARCHAR(10) NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  session_id VARCHAR(255) NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes para queries rápidas
CREATE INDEX idx_v1_analytics_stage ON v1_analytics(stage);
CREATE INDEX idx_v1_analytics_event_type ON v1_analytics(event_type);
CREATE INDEX idx_v1_analytics_session_id ON v1_analytics(session_id);
CREATE INDEX idx_v1_analytics_user_id ON v1_analytics(user_id);
CREATE INDEX idx_v1_analytics_created_at ON v1_analytics(created_at);

-- Enable RLS
ALTER TABLE v1_analytics ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own analytics
CREATE POLICY "Users can view own analytics" ON v1_analytics
  FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Policy: Admin can see all
CREATE POLICY "Admin full access" ON v1_analytics
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Grant access
GRANT SELECT ON v1_analytics TO authenticated;
GRANT INSERT ON v1_analytics TO authenticated;
