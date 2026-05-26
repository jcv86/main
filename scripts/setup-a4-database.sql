-- Phase 4: A4 Document Intelligence Database Setup

-- Document insights table
CREATE TABLE IF NOT EXISTS document_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_id UUID NOT NULL,
  insight_type TEXT NOT NULL,
  content TEXT NOT NULL,
  confidence NUMERIC DEFAULT 0.8,
  linked_modules TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_document_insights_user ON document_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_document_insights_type ON document_insights(insight_type);

-- Evidence links table (connects documents to objectives/modules)
CREATE TABLE IF NOT EXISTS evidence_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_id UUID NOT NULL,
  linked_to_type TEXT NOT NULL,
  linked_to_id UUID,
  strength NUMERIC DEFAULT 0.5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_evidence_links_user ON evidence_links(user_id);
CREATE INDEX IF NOT EXISTS idx_evidence_links_doc ON evidence_links(document_id);
CREATE INDEX IF NOT EXISTS idx_evidence_links_type ON evidence_links(linked_to_type);

-- Document recommendations table
CREATE TABLE IF NOT EXISTS document_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL,
  interview_score INTEGER NOT NULL,
  recommendation_title TEXT NOT NULL,
  recommendation_reason TEXT NOT NULL,
  target_module TEXT NOT NULL,
  priority TEXT NOT NULL,
  actioned_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_recommendations_user ON document_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_module ON document_recommendations(module_id);

-- Row Level Security Policies

-- document_insights: Users can only see their own
ALTER TABLE document_insights ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS document_insights_user_isolation ON document_insights;
CREATE POLICY document_insights_user_isolation ON document_insights
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS document_insights_insert ON document_insights;
CREATE POLICY document_insights_insert ON document_insights
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- evidence_links: Users can only see their own
ALTER TABLE evidence_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS evidence_links_user_isolation ON evidence_links;
CREATE POLICY evidence_links_user_isolation ON evidence_links
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS evidence_links_insert ON evidence_links;
CREATE POLICY evidence_links_insert ON evidence_links
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- document_recommendations: Users can only see their own
ALTER TABLE document_recommendations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS recommendations_user_isolation ON document_recommendations;
CREATE POLICY recommendations_user_isolation ON document_recommendations
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS recommendations_insert ON document_recommendations;
CREATE POLICY recommendations_insert ON document_recommendations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_insights_confidence ON document_insights(confidence DESC);
CREATE INDEX IF NOT EXISTS idx_links_strength ON evidence_links(strength DESC);
CREATE INDEX IF NOT EXISTS idx_recommendations_priority ON document_recommendations(priority, created_at DESC);

-- Comments for documentation
COMMENT ON TABLE document_insights IS 'Extracted insights from user documents for A4 analysis';
COMMENT ON TABLE evidence_links IS 'Links between documents and career goals/modules for evidence tracking';
COMMENT ON TABLE document_recommendations IS 'Personalized document recommendations based on interview performance';

COMMENT ON COLUMN document_insights.insight_type IS 'Type: strength_indicator, experience_evidence, skill_demonstration, impact_metric';
COMMENT ON COLUMN evidence_links.linked_to_type IS 'Type: career_goal, module, interview, weakness';
COMMENT ON COLUMN document_recommendations.priority IS 'Priority: high, medium, low';
