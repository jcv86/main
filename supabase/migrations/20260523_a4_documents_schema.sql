-- A4 DTC Documents Knowledge Layer - Extended Schema Migration
-- This migration extends the existing dtc_documents table and adds supporting tables
-- for the complete A4 Document Intelligence System

-- ============================================
-- 1. Extend existing dtc_documents table
-- ============================================

-- Add missing columns to dtc_documents if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'dtc_documents' AND column_name = 'plain_text') THEN
    ALTER TABLE dtc_documents ADD COLUMN plain_text TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'dtc_documents' AND column_name = 'visibility') THEN
    ALTER TABLE dtc_documents ADD COLUMN visibility VARCHAR(20) DEFAULT 'private';
  END IF;
END $$;

-- ============================================
-- 2. Document Versions (history tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS dtc_document_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES dtc_documents(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  content TEXT NOT NULL,
  plain_text TEXT,
  change_reason TEXT,
  created_by VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(document_id, version_number)
);

-- Index for fast version lookups
CREATE INDEX IF NOT EXISTS idx_document_versions_doc_id ON dtc_document_versions(document_id);

-- ============================================
-- 3. Document Blocks (structured content)
-- ============================================
CREATE TABLE IF NOT EXISTS dtc_document_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES dtc_documents(id) ON DELETE CASCADE,
  block_type VARCHAR(50) NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for ordered block retrieval
CREATE INDEX IF NOT EXISTS idx_document_blocks_doc_order ON dtc_document_blocks(document_id, order_index);

-- ============================================
-- 4. Document Relations (many-to-many)
-- ============================================
CREATE TABLE IF NOT EXISTS dtc_document_relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_document_id UUID NOT NULL REFERENCES dtc_documents(id) ON DELETE CASCADE,
  target_document_id UUID NOT NULL REFERENCES dtc_documents(id) ON DELETE CASCADE,
  relation_type VARCHAR(50) NOT NULL,
  strength INTEGER DEFAULT 50 CHECK (strength >= 0 AND strength <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(source_document_id, target_document_id, relation_type)
);

-- Indexes for relation lookups
CREATE INDEX IF NOT EXISTS idx_doc_relations_source ON dtc_document_relations(source_document_id);
CREATE INDEX IF NOT EXISTS idx_doc_relations_target ON dtc_document_relations(target_document_id);
CREATE INDEX IF NOT EXISTS idx_doc_relations_type ON dtc_document_relations(relation_type);

-- ============================================
-- 5. Route Document Requirements
-- ============================================
CREATE TABLE IF NOT EXISTS dtc_route_document_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_type VARCHAR(50),
  day_number INTEGER,
  a3_module_id VARCHAR(50),
  required_document_type VARCHAR(50) NOT NULL,
  requirement_level VARCHAR(20) NOT NULL DEFAULT 'required',
  min_count INTEGER DEFAULT 1,
  completion_rule TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CHECK (day_number IS NOT NULL OR a3_module_id IS NOT NULL)
);

-- Index for day/module lookups
CREATE INDEX IF NOT EXISTS idx_route_requirements_day ON dtc_route_document_requirements(day_number);
CREATE INDEX IF NOT EXISTS idx_route_requirements_module ON dtc_route_document_requirements(a3_module_id);

-- ============================================
-- 6. AI Extractions from Documents
-- ============================================
CREATE TABLE IF NOT EXISTS dtc_document_ai_extractions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES dtc_documents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  extraction_type VARCHAR(50) NOT NULL,
  extracted_json JSONB NOT NULL DEFAULT '{}',
  confidence INTEGER DEFAULT 0 CHECK (confidence >= 0 AND confidence <= 100),
  model_used VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for extraction lookups
CREATE INDEX IF NOT EXISTS idx_ai_extractions_doc ON dtc_document_ai_extractions(document_id);
CREATE INDEX IF NOT EXISTS idx_ai_extractions_user ON dtc_document_ai_extractions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_extractions_type ON dtc_document_ai_extractions(extraction_type);

-- ============================================
-- 7. Profile Signals (critical for intelligence)
-- ============================================
CREATE TABLE IF NOT EXISTS dtc_profile_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  source_document_id UUID REFERENCES dtc_documents(id) ON DELETE SET NULL,
  source_module VARCHAR(20) NOT NULL,
  signal_type VARCHAR(50) NOT NULL,
  signal_value TEXT NOT NULL,
  confidence INTEGER DEFAULT 0 CHECK (confidence >= 0 AND confidence <= 100),
  weight INTEGER DEFAULT 5 CHECK (weight >= 0 AND weight <= 10),
  polarity VARCHAR(20) DEFAULT 'neutral',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for signal queries
CREATE INDEX IF NOT EXISTS idx_profile_signals_user ON dtc_profile_signals(user_id);
CREATE INDEX IF NOT EXISTS idx_profile_signals_type ON dtc_profile_signals(signal_type);
CREATE INDEX IF NOT EXISTS idx_profile_signals_module ON dtc_profile_signals(source_module);
CREATE INDEX IF NOT EXISTS idx_profile_signals_active ON dtc_profile_signals(user_id, is_active);

-- ============================================
-- 8. User Profile Snapshots (point-in-time)
-- ============================================
CREATE TABLE IF NOT EXISTS dtc_user_profile_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  route_day INTEGER NOT NULL,
  snapshot_json JSONB NOT NULL DEFAULT '{}',
  profile_summary TEXT,
  strengths_summary TEXT,
  weaknesses_summary TEXT,
  evidence_summary TEXT,
  interview_readiness_score INTEGER DEFAULT 0 CHECK (interview_readiness_score >= 0 AND interview_readiness_score <= 100),
  cv_readiness_score INTEGER DEFAULT 0 CHECK (cv_readiness_score >= 0 AND cv_readiness_score <= 100),
  application_readiness_score INTEGER DEFAULT 0 CHECK (application_readiness_score >= 0 AND application_readiness_score <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for snapshot queries
CREATE INDEX IF NOT EXISTS idx_profile_snapshots_user ON dtc_user_profile_snapshots(user_id);
CREATE INDEX IF NOT EXISTS idx_profile_snapshots_day ON dtc_user_profile_snapshots(route_day);
CREATE INDEX IF NOT EXISTS idx_profile_snapshots_user_day ON dtc_user_profile_snapshots(user_id, route_day DESC);

-- ============================================
-- 9. Analysis Jobs Queue
-- ============================================
CREATE TABLE IF NOT EXISTS dtc_analysis_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  document_id UUID REFERENCES dtc_documents(id) ON DELETE SET NULL,
  job_type VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  input_payload JSONB DEFAULT '{}',
  output_payload JSONB,
  error TEXT,
  priority INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for job processing
CREATE INDEX IF NOT EXISTS idx_analysis_jobs_status ON dtc_analysis_jobs(status);
CREATE INDEX IF NOT EXISTS idx_analysis_jobs_user ON dtc_analysis_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_jobs_pending ON dtc_analysis_jobs(status, priority, created_at) 
  WHERE status = 'pending';

-- ============================================
-- 10. Day Document Sets (pre-configured)
-- ============================================
CREATE TABLE IF NOT EXISTS dtc_day_document_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_number INTEGER NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  required_documents JSONB DEFAULT '[]',
  optional_documents JSONB DEFAULT '[]',
  generated_documents JSONB DEFAULT '[]',
  completion_criteria JSONB DEFAULT '{}',
  related_a3_module VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for day lookups
CREATE INDEX IF NOT EXISTS idx_day_document_sets_day ON dtc_day_document_sets(day_number);

-- ============================================
-- Enable RLS on all new tables
-- ============================================
ALTER TABLE dtc_document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE dtc_document_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE dtc_document_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE dtc_route_document_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE dtc_document_ai_extractions ENABLE ROW LEVEL SECURITY;
ALTER TABLE dtc_profile_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE dtc_user_profile_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE dtc_analysis_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE dtc_day_document_sets ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS Policies
-- ============================================

-- Document Versions: Users can view versions of their documents
CREATE POLICY "users_view_own_doc_versions" ON dtc_document_versions
  FOR SELECT USING (
    document_id IN (SELECT id FROM dtc_documents WHERE user_id = auth.uid())
  );

CREATE POLICY "users_insert_own_doc_versions" ON dtc_document_versions
  FOR INSERT WITH CHECK (
    document_id IN (SELECT id FROM dtc_documents WHERE user_id = auth.uid())
  );

-- Document Blocks: Users can manage blocks of their documents
CREATE POLICY "users_manage_own_doc_blocks" ON dtc_document_blocks
  FOR ALL USING (
    document_id IN (SELECT id FROM dtc_documents WHERE user_id = auth.uid())
  );

-- Document Relations: Users can manage relations of their documents
CREATE POLICY "users_manage_own_doc_relations" ON dtc_document_relations
  FOR ALL USING (
    source_document_id IN (SELECT id FROM dtc_documents WHERE user_id = auth.uid())
  );

-- Route Requirements: Everyone can view
CREATE POLICY "everyone_view_route_requirements" ON dtc_route_document_requirements
  FOR SELECT USING (true);

-- AI Extractions: Users can view their own
CREATE POLICY "users_view_own_extractions" ON dtc_document_ai_extractions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "system_manage_extractions" ON dtc_document_ai_extractions
  FOR ALL USING (true);

-- Profile Signals: Users can view their own
CREATE POLICY "users_view_own_signals" ON dtc_profile_signals
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "system_manage_signals" ON dtc_profile_signals
  FOR ALL USING (true);

-- Profile Snapshots: Users can view their own
CREATE POLICY "users_view_own_snapshots" ON dtc_user_profile_snapshots
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "system_manage_snapshots" ON dtc_user_profile_snapshots
  FOR ALL USING (true);

-- Analysis Jobs: Users can view their own
CREATE POLICY "users_view_own_jobs" ON dtc_analysis_jobs
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "system_manage_jobs" ON dtc_analysis_jobs
  FOR ALL USING (true);

-- Day Document Sets: Everyone can view
CREATE POLICY "everyone_view_day_sets" ON dtc_day_document_sets
  FOR SELECT USING (true);

-- ============================================
-- Seed initial day document requirements (examples)
-- ============================================
INSERT INTO dtc_day_document_sets (day_number, title, required_documents, optional_documents, generated_documents) VALUES
  (1, 'El Contrato de Tu Ruta', '["route_contract", "identity_statement"]', '["reflection"]', '["coach_feedback"]'),
  (5, 'Evidencia Base', '["evidence_item"]', '["cv_bullet"]', '["ai_profile_analysis"]'),
  (10, 'Checkpoint A1', '["psychological_profile", "work_style_profile"]', '["reflection"]', '["profile_snapshot"]'),
  (15, 'CV Draft Inicial', '["cv_draft"]', '["linkedin_profile"]', '["coach_feedback"]'),
  (20, 'Job Analysis', '["job_analysis", "role_fit_matrix"]', '["company_research"]', '["ai_profile_analysis"]'),
  (30, 'STAR Bank Setup', '["star_answer"]', '["evidence_item"]', '["coach_feedback"]'),
  (35, 'Decodificar Oferta', '["job_analysis", "role_fit_matrix", "evidence_item"]', '["company_research", "interview_answer"]', '["coach_feedback", "ai_profile_analysis"]'),
  (45, 'Interview Prep', '["interview_answer", "star_answer"]', '["interview_transcript"]', '["module_feedback"]'),
  (60, 'Mid-Route Review', '["cv_draft", "evidence_vault_summary"]', '["profile_snapshot"]', '["coach_feedback", "ai_profile_analysis"]'),
  (90, 'Final Portfolio', '["final_deliverable", "executive_summary"]', '["portfolio_asset"]', '["profile_snapshot"]')
ON CONFLICT (day_number) DO NOTHING;

-- ============================================
-- Helper function: Get document count by type for user/day
-- ============================================
CREATE OR REPLACE FUNCTION get_user_document_count(
  p_user_id UUID,
  p_document_type VARCHAR(50),
  p_day_number INTEGER DEFAULT NULL
) RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_count
  FROM dtc_documents
  WHERE user_id = p_user_id
    AND type = p_document_type
    AND (p_day_number IS NULL OR related_day = p_day_number)
    AND status NOT IN ('draft', 'archived');
  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Helper function: Check if day can be completed
-- ============================================
CREATE OR REPLACE FUNCTION can_complete_day(
  p_user_id UUID,
  p_day_number INTEGER
) RETURNS BOOLEAN AS $$
DECLARE
  v_day_set RECORD;
  v_required TEXT;
  v_count INTEGER;
BEGIN
  -- Get day document set
  SELECT * INTO v_day_set
  FROM dtc_day_document_sets
  WHERE day_number = p_day_number;
  
  IF NOT FOUND THEN
    RETURN TRUE; -- No requirements defined
  END IF;
  
  -- Check each required document
  FOR v_required IN SELECT jsonb_array_elements_text(v_day_set.required_documents)
  LOOP
    v_count := get_user_document_count(p_user_id, v_required, p_day_number);
    IF v_count < 1 THEN
      RETURN FALSE;
    END IF;
  END LOOP;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
