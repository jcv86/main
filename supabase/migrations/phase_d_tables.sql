-- Phase D Tables (Days 27-30)
-- Checkpoint validation, recruiter perspective, foundation portfolio, and arc closure

-- Day 27 - A3 Checkpoint 3 validation results
CREATE TABLE a2_a3_checkpoint_3 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_number INT NOT NULL DEFAULT 27,
  
  -- Checkpoint validation results
  cv_structure_valid BOOLEAN DEFAULT FALSE,
  summary_confirmed BOOLEAN DEFAULT FALSE,
  bullets_confirmed BOOLEAN DEFAULT FALSE,
  skills_confirmed BOOLEAN DEFAULT FALSE,
  language_cleaned BOOLEAN DEFAULT FALSE,
  recruiter_ready BOOLEAN DEFAULT FALSE,
  
  -- Assets validated
  validated_assets JSONB DEFAULT '[]'::jsonb,
  missing_assets JSONB DEFAULT '[]'::jsonb,
  
  -- CV validation result
  cv_readability_score INT CHECK (cv_readability_score >= 0 AND cv_readability_score <= 100),
  recruiter_readiness_score INT CHECK (recruiter_readiness_score >= 0 AND recruiter_readiness_score <= 100),
  
  -- Basic CV Draft reference
  basic_cv_draft_id UUID,
  
  -- Checkpoint completion
  checkpoint_passed BOOLEAN DEFAULT FALSE,
  checkpoint_feedback TEXT,
  xp_awarded INT DEFAULT 120,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_checkpoint_3 UNIQUE(user_id, day_number),
  CONSTRAINT valid_scores CHECK (
    (cv_readability_score IS NULL OR (cv_readability_score >= 0 AND cv_readability_score <= 100)) AND
    (recruiter_readiness_score IS NULL OR (recruiter_readiness_score >= 0 AND recruiter_readiness_score <= 100))
  )
);

-- Day 28 - Recruiter perspective analysis
CREATE TABLE a2_recruiter_perspective (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_number INT NOT NULL DEFAULT 28,
  
  -- CV Draft being reviewed
  cv_draft_id UUID,
  
  -- 10-second scan answers
  first_10_seconds TEXT,
  confidence_part TEXT,
  doubt_part TEXT,
  recruiter_question TEXT,
  
  -- DTC recruiter simulation
  first_impression TEXT,
  visible_strengths JSONB DEFAULT '[]'::jsonb,
  possible_doubts JSONB DEFAULT '[]'::jsonb,
  likely_questions JSONB DEFAULT '[]'::jsonb,
  
  -- User improvement note
  improvement_focus VARCHAR(255),
  improvement_note TEXT,
  
  -- Validation
  scan_complete BOOLEAN DEFAULT FALSE,
  simulation_generated BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_recruiter_perspective UNIQUE(user_id, day_number)
);

-- Day 29 - Foundation Portfolio
CREATE TABLE a2_foundation_portfolio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_number INT NOT NULL DEFAULT 29,
  
  -- First-month assets gathered
  assets_included JSONB DEFAULT '[]'::jsonb,
  
  -- Asset status
  complete_assets JSONB DEFAULT '[]'::jsonb,
  partial_assets JSONB DEFAULT '[]'::jsonb,
  missing_assets JSONB DEFAULT '[]'::jsonb,
  needs_revision_assets JSONB DEFAULT '[]'::jsonb,
  
  -- Portfolio summary
  who_you_are TEXT,
  provable_value JSONB DEFAULT '[]'::jsonb,
  market_signals JSONB DEFAULT '[]'::jsonb,
  cv_asset_status VARCHAR(100),
  next_steps_month_2 TEXT,
  
  -- Portfolio export
  portfolio_content JSONB,
  export_format VARCHAR(50),
  export_url VARCHAR(500),
  saved_externally BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_foundation_portfolio UNIQUE(user_id, day_number)
);

-- Day 30 - Foundation Review & Arc 1 Closure
CREATE TABLE a2_foundation_review (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_number INT NOT NULL DEFAULT 30,
  
  -- Foundation completeness checks
  roadmap_passed BOOLEAN DEFAULT FALSE,
  a3_module_1_complete BOOLEAN DEFAULT FALSE,
  a3_module_2_complete BOOLEAN DEFAULT FALSE,
  a3_module_3_complete BOOLEAN DEFAULT FALSE,
  foundation_portfolio_exists BOOLEAN DEFAULT FALSE,
  basic_cv_draft_exists BOOLEAN DEFAULT FALSE,
  value_evidence_exists BOOLEAN DEFAULT FALSE,
  
  -- Foundation scoring (1-10 scale)
  claridad_profesional INT CHECK (claridad_profesional >= 1 AND claridad_profesional <= 10),
  evidencia_valor INT CHECK (evidencia_valor >= 1 AND evidencia_valor <= 10),
  estructura_cv INT CHECK (estructura_cv >= 1 AND estructura_cv <= 10),
  conexion_mercado INT CHECK (conexion_mercado >= 1 AND conexion_mercado <= 10),
  consistencia_ruta INT CHECK (consistencia_ruta >= 1 AND consistencia_ruta <= 10),
  preparacion_siguiente INT CHECK (preparacion_siguiente >= 1 AND preparacion_siguiente <= 10),
  
  -- Overall foundation score
  overall_foundation_score DECIMAL(4, 2) DEFAULT 0.00,
  
  -- Review result
  review_status VARCHAR(100),
  -- Possible values: 'ready_for_arc_2', 'ready_with_improvements', 'needs_revision'
  
  -- Improvement recommendations
  recommendations JSONB DEFAULT '[]'::jsonb,
  
  -- Arc 1 closure
  arc_1_complete BOOLEAN DEFAULT FALSE,
  arc_2_eligible BOOLEAN DEFAULT FALSE,
  user_feedback TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_foundation_review UNIQUE(user_id, day_number),
  CONSTRAINT valid_scores CHECK (
    (claridad_profesional IS NULL OR (claridad_profesional >= 1 AND claridad_profesional <= 10)) AND
    (evidencia_valor IS NULL OR (evidencia_valor >= 1 AND evidencia_valor <= 10)) AND
    (estructura_cv IS NULL OR (estructura_cv >= 1 AND estructura_cv <= 10)) AND
    (conexion_mercado IS NULL OR (conexion_mercado >= 1 AND conexion_mercado <= 10)) AND
    (consistencia_ruta IS NULL OR (consistencia_ruta >= 1 AND consistencia_ruta <= 10)) AND
    (preparacion_siguiente IS NULL OR (preparacion_siguiente >= 1 AND preparacion_siguiente <= 10))
  )
);

-- Enable RLS
ALTER TABLE a2_a3_checkpoint_3 ENABLE ROW LEVEL SECURITY;
ALTER TABLE a2_recruiter_perspective ENABLE ROW LEVEL SECURITY;
ALTER TABLE a2_foundation_portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE a2_foundation_review ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own checkpoint 3 data" 
ON a2_a3_checkpoint_3 FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own checkpoint 3 data" 
ON a2_a3_checkpoint_3 FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own checkpoint 3 data" 
ON a2_a3_checkpoint_3 FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own recruiter perspective data" 
ON a2_recruiter_perspective FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own recruiter perspective data" 
ON a2_recruiter_perspective FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recruiter perspective data" 
ON a2_recruiter_perspective FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own foundation portfolio" 
ON a2_foundation_portfolio FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own foundation portfolio" 
ON a2_foundation_portfolio FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own foundation portfolio" 
ON a2_foundation_portfolio FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own foundation review" 
ON a2_foundation_review FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own foundation review" 
ON a2_foundation_review FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own foundation review" 
ON a2_foundation_review FOR UPDATE 
USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_a2_checkpoint_3_user_day ON a2_a3_checkpoint_3(user_id, day_number);
CREATE INDEX idx_a2_recruiter_perspective_user_day ON a2_recruiter_perspective(user_id, day_number);
CREATE INDEX idx_a2_foundation_portfolio_user_day ON a2_foundation_portfolio(user_id, day_number);
CREATE INDEX idx_a2_foundation_review_user_day ON a2_foundation_review(user_id, day_number);
