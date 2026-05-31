-- Phase C Database Tables (Days 21-26)
-- CV Building, Refinement, Stress Testing, and Export

-- Table: a2_cv_bullets (Day 21)
-- Stores 6 improved CV bullets with deep polishing
CREATE TABLE IF NOT EXISTS a2_cv_bullets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_number INT NOT NULL DEFAULT 21,
  bullet_number INT NOT NULL, -- 1-6 bullets
  raw_bullet TEXT NOT NULL,
  improved_bullet TEXT,
  action_verb VARCHAR(50),
  context TEXT,
  impact_metrics TEXT,
  polish_score INT, -- 1-10
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  CONSTRAINT valid_bullet_number CHECK (bullet_number >= 1 AND bullet_number <= 6)
);

CREATE INDEX idx_a2_cv_bullets_user ON a2_cv_bullets(user_id);
CREATE INDEX idx_a2_cv_bullets_day ON a2_cv_bullets(user_id, day_number);

-- Table: a2_cv_skills (Day 22)
-- Stores organized technical and soft skills sections
CREATE TABLE IF NOT EXISTS a2_cv_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_number INT NOT NULL DEFAULT 22,
  skill_category VARCHAR(50) NOT NULL, -- technical, soft, languages, tools
  skill_name VARCHAR(100) NOT NULL,
  proficiency_level VARCHAR(20), -- beginner, intermediate, advanced, expert
  years_experience INT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_a2_cv_skills_user ON a2_cv_skills(user_id);
CREATE INDEX idx_a2_cv_skills_category ON a2_cv_skills(user_id, skill_category);

-- Table: a2_cv_language_polish (Day 23)
-- Stores language consistency review and tone refinement
CREATE TABLE IF NOT EXISTS a2_cv_language_polish (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_number INT NOT NULL DEFAULT 23,
  section_name VARCHAR(100), -- summary, bullets, skills
  original_text TEXT NOT NULL,
  polished_text TEXT,
  issues_found TEXT[], -- array of identified issues
  tone_adjustments TEXT,
  consistency_score INT, -- 1-10
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_a2_cv_language_polish_user ON a2_cv_language_polish(user_id);
CREATE INDEX idx_a2_cv_language_polish_day ON a2_cv_language_polish(user_id, day_number);

-- Table: a2_cv_stress_test (Day 24)
-- Stores CV stress test results and scoring
CREATE TABLE IF NOT EXISTS a2_cv_stress_test (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_number INT NOT NULL DEFAULT 24,
  clarity_score INT, -- 1-10
  structure_score INT,
  specificity_score INT,
  evidence_score INT,
  market_alignment_score INT,
  quick_scan_score INT,
  professional_language_score INT,
  overall_score INT, -- average
  critical_issues TEXT[], -- array of critical fixes needed
  recommended_improvements TEXT[], -- array of suggested improvements
  optional_polish TEXT[], -- array of nice-to-have improvements
  improvements_applied INT DEFAULT 0, -- count of applied fixes
  test_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_a2_cv_stress_test_user ON a2_cv_stress_test(user_id);
CREATE INDEX idx_a2_cv_stress_test_day ON a2_cv_stress_test(user_id, day_number);

-- Table: a2_cv_export (Day 25)
-- Stores CV export and file upload information
CREATE TABLE IF NOT EXISTS a2_cv_export (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_number INT NOT NULL DEFAULT 25,
  export_format VARCHAR(20), -- pdf, docx, notion, google_docs
  file_name VARCHAR(255),
  file_path TEXT,
  file_size INT,
  file_hash VARCHAR(64),
  has_summary BOOLEAN,
  has_bullets BOOLEAN,
  has_skills BOOLEAN,
  has_cleaned_language BOOLEAN,
  export_completed BOOLEAN DEFAULT FALSE,
  is_ready_for_checkpoint BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_a2_cv_export_user ON a2_cv_export(user_id);
CREATE INDEX idx_a2_cv_export_day ON a2_cv_export(user_id, day_number);

-- Table: a2_month1_closure (Day 26-28)
-- Stores Month 1 closure review and recruiter perspective insights
CREATE TABLE IF NOT EXISTS a2_month1_closure (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_number INT NOT NULL, -- 26 or 28
  closure_type VARCHAR(20), -- export_ritual or recruiter_eyes
  
  -- For export ritual (Day 26)
  export_confirmed BOOLEAN DEFAULT FALSE,
  
  -- For recruiter eyes (Day 28)
  first_impression TEXT,
  strengths_identified TEXT[],
  doubts_identified TEXT[],
  recruiter_questions TEXT[],
  improvement_notes TEXT,
  cv_improvement_suggestions TEXT[],
  
  -- Overall
  reflection_text TEXT,
  ready_for_arc2 BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_a2_month1_closure_user ON a2_month1_closure(user_id);
CREATE INDEX idx_a2_month1_closure_day ON a2_month1_closure(user_id, day_number);

-- Enable RLS on all Phase C tables
ALTER TABLE a2_cv_bullets ENABLE ROW LEVEL SECURITY;
ALTER TABLE a2_cv_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE a2_cv_language_polish ENABLE ROW LEVEL SECURITY;
ALTER TABLE a2_cv_stress_test ENABLE ROW LEVEL SECURITY;
ALTER TABLE a2_cv_export ENABLE ROW LEVEL SECURITY;
ALTER TABLE a2_month1_closure ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Users can only access their own data
CREATE POLICY a2_cv_bullets_user_policy ON a2_cv_bullets
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY a2_cv_skills_user_policy ON a2_cv_skills
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY a2_cv_language_polish_user_policy ON a2_cv_language_polish
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY a2_cv_stress_test_user_policy ON a2_cv_stress_test
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY a2_cv_export_user_policy ON a2_cv_export
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY a2_month1_closure_user_policy ON a2_month1_closure
  FOR ALL USING (auth.uid() = user_id);
