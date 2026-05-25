-- DTC AgentOS Database Migration
-- Run this migration to add the required tables for the AgentOS system
-- Version: 1.0.0
-- Date: 2026-05-24

-- ============================================================================
-- MEMORY ITEMS TABLE
-- Stores semantic user memories extracted from all stages (C1, A1, C2, A2, A3, A4)
-- ============================================================================

CREATE TABLE IF NOT EXISTS memory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source_type TEXT NOT NULL CHECK (source_type IN ('c1', 'a1', 'c2', 'a2', 'a3', 'a4', 'coaching', 'system')),
  source_id UUID,
  memory_type TEXT NOT NULL CHECK (memory_type IN (
    'career_goal', 'role_target', 'skill', 'strength', 'weakness', 'achievement',
    'challenge', 'communication_style', 'interview_pattern', 'learning_preference',
    'constraint', 'motivation', 'company_preference', 'market_region',
    'evidence', 'star_story', 'feedback_received'
  )),
  title TEXT,
  content TEXT NOT NULL,
  confidence NUMERIC DEFAULT 0.8 CHECK (confidence >= 0 AND confidence <= 1),
  importance NUMERIC DEFAULT 0.5 CHECK (importance >= 0 AND importance <= 1),
  metadata JSONB DEFAULT '{}',
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_memory_items_user ON memory_items(user_id);
CREATE INDEX IF NOT EXISTS idx_memory_items_type ON memory_items(user_id, memory_type);
CREATE INDEX IF NOT EXISTS idx_memory_items_source ON memory_items(user_id, source_type);
CREATE INDEX IF NOT EXISTS idx_memory_items_valid ON memory_items(user_id) WHERE valid_until IS NULL;
CREATE INDEX IF NOT EXISTS idx_memory_items_importance ON memory_items(user_id, importance DESC);

-- RLS Policy
ALTER TABLE memory_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own memories"
  ON memory_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own memories"
  ON memory_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own memories"
  ON memory_items FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================================
-- AGENT RUNS TABLE
-- Logs every AI agent interaction for debugging and analytics
-- ============================================================================

CREATE TABLE IF NOT EXISTS agent_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  command TEXT NOT NULL,
  agent TEXT NOT NULL,
  mode TEXT NOT NULL,
  module_id TEXT,
  input_context JSONB DEFAULT '{}',
  output_data JSONB DEFAULT '{}',
  tokens_used INTEGER,
  duration_ms INTEGER,
  success BOOLEAN NOT NULL DEFAULT true,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_agent_runs_user ON agent_runs(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_runs_command ON agent_runs(user_id, command);
CREATE INDEX IF NOT EXISTS idx_agent_runs_created ON agent_runs(created_at DESC);

-- RLS Policy
ALTER TABLE agent_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own agent runs"
  ON agent_runs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert agent runs"
  ON agent_runs FOR INSERT
  WITH CHECK (true);

-- ============================================================================
-- A3 EVALUATIONS TABLE
-- Stores detailed interview answer evaluations
-- ============================================================================

CREATE TABLE IF NOT EXISTS a3_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL,
  agent_id TEXT NOT NULL,
  session_id UUID,
  question_id TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  scores JSONB NOT NULL DEFAULT '[]',
  total_score INTEGER NOT NULL CHECK (total_score >= 0 AND total_score <= 100),
  overall_feedback TEXT,
  strengths TEXT[] DEFAULT '{}',
  improvements TEXT[] DEFAULT '{}',
  pattern_observed TEXT,
  next_recommendation TEXT,
  confidence NUMERIC DEFAULT 0.8,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_a3_evaluations_user ON a3_evaluations(user_id);
CREATE INDEX IF NOT EXISTS idx_a3_evaluations_module ON a3_evaluations(user_id, module_id);
CREATE INDEX IF NOT EXISTS idx_a3_evaluations_score ON a3_evaluations(user_id, total_score DESC);
CREATE INDEX IF NOT EXISTS idx_a3_evaluations_session ON a3_evaluations(session_id);

-- RLS Policy
ALTER TABLE a3_evaluations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own evaluations"
  ON a3_evaluations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert evaluations"
  ON a3_evaluations FOR INSERT
  WITH CHECK (true);

-- ============================================================================
-- A3 USER PROGRESS TABLE
-- Tracks user progress through A3 modules and levels
-- ============================================================================

CREATE TABLE IF NOT EXISTS a3_user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'locked' CHECK (status IN ('locked', 'unlocked', 'in_progress', 'completed')),
  current_level TEXT DEFAULT 'basic' CHECK (current_level IN ('basic', 'advanced', 'pro')),
  progress_percent INTEGER DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
  attempts INTEGER DEFAULT 0,
  best_score INTEGER,
  last_attempt_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  unlocked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, module_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_a3_progress_user ON a3_user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_a3_progress_status ON a3_user_progress(user_id, status);

-- RLS Policy
ALTER TABLE a3_user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own progress"
  ON a3_user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON a3_user_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert progress"
  ON a3_user_progress FOR INSERT
  WITH CHECK (true);

-- ============================================================================
-- UNLOCK EVENTS TABLE
-- Logs when users unlock modules, levels, or features
-- ============================================================================

CREATE TABLE IF NOT EXISTS unlock_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  unlock_key TEXT NOT NULL,
  unlock_type TEXT NOT NULL CHECK (unlock_type IN ('module', 'level', 'feature')),
  unlocked_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_unlock_events_user ON unlock_events(user_id);
CREATE INDEX IF NOT EXISTS idx_unlock_events_key ON unlock_events(user_id, unlock_key);

-- RLS Policy
ALTER TABLE unlock_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own unlock events"
  ON unlock_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert unlock events"
  ON unlock_events FOR INSERT
  WITH CHECK (true);

-- ============================================================================
-- DOCUMENT INSIGHTS TABLE
-- Stores AI-extracted insights from A4 documents
-- ============================================================================

CREATE TABLE IF NOT EXISTS document_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_id UUID NOT NULL,
  insight_type TEXT NOT NULL CHECK (insight_type IN ('achievement', 'star_story', 'evidence', 'strength', 'improvement', 'keyword')),
  content TEXT NOT NULL,
  confidence NUMERIC DEFAULT 0.8,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_document_insights_user ON document_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_document_insights_doc ON document_insights(document_id);
CREATE INDEX IF NOT EXISTS idx_document_insights_type ON document_insights(user_id, insight_type);

-- RLS Policy
ALTER TABLE document_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own document insights"
  ON document_insights FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert document insights"
  ON document_insights FOR INSERT
  WITH CHECK (true);

-- ============================================================================
-- EVIDENCE LINKS TABLE
-- Links evidence from documents to interview answers
-- ============================================================================

CREATE TABLE IF NOT EXISTS evidence_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source_type TEXT NOT NULL CHECK (source_type IN ('document', 'evaluation', 'memory')),
  source_id UUID NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('evaluation', 'document', 'module')),
  target_id UUID NOT NULL,
  link_type TEXT NOT NULL CHECK (link_type IN ('supports', 'references', 'contradicts')),
  strength NUMERIC DEFAULT 0.8,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_evidence_links_user ON evidence_links(user_id);
CREATE INDEX IF NOT EXISTS idx_evidence_links_source ON evidence_links(source_type, source_id);
CREATE INDEX IF NOT EXISTS idx_evidence_links_target ON evidence_links(target_type, target_id);

-- RLS Policy
ALTER TABLE evidence_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own evidence links"
  ON evidence_links FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert evidence links"
  ON evidence_links FOR INSERT
  WITH CHECK (true);

-- ============================================================================
-- CONTEXT SNAPSHOTS TABLE
-- Caches built context for faster subsequent requests
-- ============================================================================

CREATE TABLE IF NOT EXISTS context_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  command TEXT NOT NULL,
  context_data JSONB NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, command)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_context_snapshots_user ON context_snapshots(user_id);
CREATE INDEX IF NOT EXISTS idx_context_snapshots_expires ON context_snapshots(expires_at);

-- RLS Policy
ALTER TABLE context_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own context snapshots"
  ON context_snapshots FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can manage context snapshots"
  ON context_snapshots FOR ALL
  USING (true);

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to get user memory summary
CREATE OR REPLACE FUNCTION get_user_memory_summary(p_user_id UUID)
RETURNS TABLE(
  memory_type TEXT,
  count BIGINT,
  avg_importance NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    mi.memory_type::TEXT,
    COUNT(*)::BIGINT,
    AVG(mi.importance)::NUMERIC
  FROM memory_items mi
  WHERE mi.user_id = p_user_id
    AND mi.valid_until IS NULL
  GROUP BY mi.memory_type
  ORDER BY avg_importance DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user readiness score based on multiple factors
CREATE OR REPLACE FUNCTION calculate_user_readiness(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_memory_score INTEGER := 0;
  v_module_score INTEGER := 0;
  v_document_score INTEGER := 0;
  v_interview_score INTEGER := 0;
  v_total_score INTEGER := 0;
BEGIN
  -- Memory score (max 25 points)
  SELECT LEAST(25, COUNT(*) * 2)::INTEGER INTO v_memory_score
  FROM memory_items
  WHERE user_id = p_user_id AND valid_until IS NULL;

  -- Module progress score (max 30 points)
  SELECT COALESCE(SUM(CASE status 
    WHEN 'completed' THEN 3 
    WHEN 'in_progress' THEN 1 
    ELSE 0 
  END), 0)::INTEGER INTO v_module_score
  FROM a3_user_progress
  WHERE user_id = p_user_id;

  -- Document score (max 25 points)
  SELECT LEAST(25, COUNT(*) * 5)::INTEGER INTO v_document_score
  FROM dtc_documents
  WHERE user_id = p_user_id;

  -- Interview score (max 20 points based on average evaluation)
  SELECT COALESCE(AVG(total_score) / 5, 0)::INTEGER INTO v_interview_score
  FROM a3_evaluations
  WHERE user_id = p_user_id;

  v_total_score := v_memory_score + v_module_score + v_document_score + v_interview_score;
  
  RETURN LEAST(100, v_total_score);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_memory_items_updated_at
  BEFORE UPDATE ON memory_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_a3_user_progress_updated_at
  BEFORE UPDATE ON a3_user_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- GRANTS
-- ============================================================================

-- Grant access to authenticated users
GRANT SELECT, INSERT, UPDATE ON memory_items TO authenticated;
GRANT SELECT ON agent_runs TO authenticated;
GRANT SELECT ON a3_evaluations TO authenticated;
GRANT SELECT, UPDATE ON a3_user_progress TO authenticated;
GRANT SELECT ON unlock_events TO authenticated;
GRANT SELECT ON document_insights TO authenticated;
GRANT SELECT ON evidence_links TO authenticated;
GRANT SELECT ON context_snapshots TO authenticated;

-- Grant execute on functions
GRANT EXECUTE ON FUNCTION get_user_memory_summary(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_user_readiness(UUID) TO authenticated;
