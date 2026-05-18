-- Phase B Database Tables (Days 16-20)
-- Checkpoint 2 + CV Preparation
-- Run with: supabase db push

-- ============================================
-- DAY 16: A3 CHECKPOINT 2 VALIDATION TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS a2_checkpoint_a3_module2 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_number INT NOT NULL CHECK (day_number = 16),
  
  -- Materials validated
  value_statements_count INT DEFAULT 5,
  achievement_stories_count INT DEFAULT 3,
  proof_fragments_count INT DEFAULT 3,
  
  -- Checkpoint validation
  stories_have_context BOOLEAN DEFAULT FALSE,
  stories_have_action BOOLEAN DEFAULT FALSE,
  stories_have_result BOOLEAN DEFAULT FALSE,
  stories_scored BOOLEAN DEFAULT FALSE,
  package_ready BOOLEAN DEFAULT FALSE,
  
  -- Achievement Bank for CV work ahead
  strongest_story_candidate TEXT,
  weak_points_to_watch TEXT,
  
  -- Status
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'passed', 'revision_needed')),
  a3_module_status TEXT DEFAULT 'not_started',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, day_number)
);

CREATE INDEX idx_checkpoint_a3_module2_user_id ON a2_checkpoint_a3_module2(user_id);
CREATE INDEX idx_checkpoint_a3_module2_status ON a2_checkpoint_a3_module2(status);

-- ============================================
-- DAYS 17-20: CV PREPARATION TABLES
-- ============================================

CREATE TABLE IF NOT EXISTS a2_cv_skeleton_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_number INT NOT NULL,
  
  -- Header section
  full_name TEXT,
  professional_title TEXT,
  location TEXT,
  contact_email TEXT,
  phone TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  
  -- Professional summary (from Day 18)
  professional_summary TEXT,
  
  -- Sections status
  header_complete BOOLEAN DEFAULT FALSE,
  summary_complete BOOLEAN DEFAULT FALSE,
  experience_complete BOOLEAN DEFAULT FALSE,
  skills_complete BOOLEAN DEFAULT FALSE,
  education_complete BOOLEAN DEFAULT FALSE,
  
  -- Last update
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, day_number)
);

CREATE INDEX idx_cv_skeleton_user_id ON a2_cv_skeleton_data(user_id);

-- CV Experience Bullets (Days 19-20)
CREATE TABLE IF NOT EXISTS a2_cv_experience_bullets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_number INT NOT NULL CHECK (day_number IN (17, 18, 19, 20)),
  
  -- Experience context
  experience_id TEXT, -- Links to a specific role/project
  experience_type TEXT CHECK (experience_type IN ('role', 'project', 'internship', 'freelance', 'volunteer', 'academic', 'personal')),
  experience_title TEXT,
  company_or_context TEXT,
  
  -- Bullet data
  bullet_raw_1 TEXT,
  bullet_raw_2 TEXT,
  bullet_raw_3 TEXT,
  
  bullet_improved_1 TEXT,
  bullet_improved_2 TEXT,
  bullet_improved_3 TEXT,
  
  -- Enhancement tracking
  coach_enhanced BOOLEAN DEFAULT FALSE,
  user_approved BOOLEAN DEFAULT FALSE,
  
  -- Values and evidence
  linked_values TEXT[], -- Array of value categories
  linked_achievements TEXT[], -- Array of achievement story IDs
  
  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'improved', 'approved', 'final')),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_cv_bullets_user_id ON a2_cv_experience_bullets(user_id);
CREATE INDEX idx_cv_bullets_day ON a2_cv_experience_bullets(day_number);
CREATE INDEX idx_cv_bullets_status ON a2_cv_experience_bullets(status);

-- CV Skills Section (Day 20)
CREATE TABLE IF NOT EXISTS a2_cv_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_number INT NOT NULL CHECK (day_number IN (18, 19, 20)),
  
  -- Skill data
  skill_name TEXT NOT NULL,
  skill_category TEXT, -- technical, soft, language, tool, etc.
  proficiency_level TEXT CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  
  -- Evidence
  evidence_from_bullets TEXT,
  evidence_from_achievements TEXT,
  
  -- Priority for CV
  priority INT DEFAULT 100, -- 1-100, higher = more important
  include_in_cv BOOLEAN DEFAULT TRUE,
  
  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'reviewed', 'approved')),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_cv_skills_user_id ON a2_cv_skills(user_id);
CREATE INDEX idx_cv_skills_priority ON a2_cv_skills(priority DESC);

-- ============================================
-- SUPPORTING TABLES FOR PHASE B
-- ============================================

CREATE TABLE IF NOT EXISTS a2_cv_evidence_folder (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Material organization
  material_type TEXT CHECK (material_type IN ('bullet_evidence', 'achievement_proof', 'metric', 'quote', 'certification')),
  material_title TEXT,
  material_content TEXT,
  material_source TEXT, -- which day/component it came from
  
  -- CV usage
  used_in_bullets TEXT[], -- Array of bullet IDs
  used_in_skills TEXT[], -- Array of skill IDs
  
  -- Tracking
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_cv_evidence_user_id ON a2_cv_evidence_folder(user_id);
CREATE INDEX idx_cv_evidence_type ON a2_cv_evidence_folder(material_type);

-- CV Readiness Tracking
CREATE TABLE IF NOT EXISTS a2_cv_readiness_check (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_number INT NOT NULL,
  
  -- Checklist items
  header_filled BOOLEAN DEFAULT FALSE,
  summary_professional BOOLEAN DEFAULT FALSE,
  bullets_show_value BOOLEAN DEFAULT FALSE,
  skills_match_target BOOLEAN DEFAULT FALSE,
  evidence_credible BOOLEAN DEFAULT FALSE,
  
  -- Overall readiness
  readiness_score INT DEFAULT 0, -- 0-100
  readiness_status TEXT DEFAULT 'draft' CHECK (readiness_status IN ('draft', 'incomplete', 'ready_for_checkpoint', 'submitted')),
  
  -- Feedback
  areas_to_improve TEXT[],
  next_steps TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, day_number)
);

CREATE INDEX idx_cv_readiness_user_id ON a2_cv_readiness_check(user_id);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE a2_checkpoint_a3_module2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE a2_cv_skeleton_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE a2_cv_experience_bullets ENABLE ROW LEVEL SECURITY;
ALTER TABLE a2_cv_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE a2_cv_evidence_folder ENABLE ROW LEVEL SECURITY;
ALTER TABLE a2_cv_readiness_check ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

CREATE POLICY "Users can view own checkpoint data" ON a2_checkpoint_a3_module2
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own checkpoint data" ON a2_checkpoint_a3_module2
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own checkpoint data" ON a2_checkpoint_a3_module2
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own CV skeleton" ON a2_cv_skeleton_data
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own CV skeleton" ON a2_cv_skeleton_data
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own CV skeleton" ON a2_cv_skeleton_data
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own CV bullets" ON a2_cv_experience_bullets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own CV bullets" ON a2_cv_experience_bullets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own CV bullets" ON a2_cv_experience_bullets
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own CV skills" ON a2_cv_skills
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own CV skills" ON a2_cv_skills
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own CV skills" ON a2_cv_skills
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own CV evidence" ON a2_cv_evidence_folder
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own CV evidence" ON a2_cv_evidence_folder
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own CV evidence" ON a2_cv_evidence_folder
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own CV readiness" ON a2_cv_readiness_check
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own CV readiness" ON a2_cv_readiness_check
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own CV readiness" ON a2_cv_readiness_check
  FOR UPDATE USING (auth.uid() = user_id);
