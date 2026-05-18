-- Phase A: Days 11-15 Database Tables
-- Created: 2026-05-18
-- Purpose: Value Alchemy & Proof System tables

-- Table 1: a2_value_statements (Days 11-12 input)
-- Stores value statements with coaching enhancements
CREATE TABLE IF NOT EXISTS a2_value_statements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_number INT NOT NULL CHECK (day_number IN (11, 12)),
  statement_text TEXT NOT NULL,
  coach_enhanced TEXT,
  category VARCHAR(50),
  original_seed_text TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, day_number, statement_text)
);

CREATE INDEX idx_a2_value_statements_user_day ON a2_value_statements(user_id, day_number);
CREATE INDEX idx_a2_value_statements_user_created ON a2_value_statements(user_id, created_at);

-- Table 2: a2_value_inventory (Day 12 output)
-- Ranked and classified value statements
CREATE TABLE IF NOT EXISTS a2_value_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_number INT NOT NULL DEFAULT 12,
  statement_id UUID NOT NULL REFERENCES a2_value_statements(id) ON DELETE CASCADE,
  statement_text TEXT NOT NULL,
  category VARCHAR(100),
  rank INT CHECK (rank BETWEEN 1 AND 5),
  strength_score INT CHECK (strength_score BETWEEN 1 AND 10),
  best_use VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, rank)
);

CREATE INDEX idx_a2_value_inventory_user_day ON a2_value_inventory(user_id, day_number);
CREATE INDEX idx_a2_value_inventory_rank ON a2_value_inventory(user_id, rank);

-- Table 3: a2_proof_map (Day 13 output)
-- Maps proof types and fragments to value statements
CREATE TABLE IF NOT EXISTS a2_proof_map (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_number INT NOT NULL DEFAULT 13,
  statement_id UUID NOT NULL REFERENCES a2_value_statements(id) ON DELETE CASCADE,
  statement_text TEXT NOT NULL,
  proof_types JSONB DEFAULT '[]'::jsonb,
  proof_fragments JSONB DEFAULT '[]'::jsonb,
  fragment_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, statement_id)
);

CREATE INDEX idx_a2_proof_map_user_day ON a2_proof_map(user_id, day_number);
CREATE INDEX idx_a2_proof_map_fragments ON a2_proof_map(user_id, fragment_count);

-- Table 4: a2_achievement_stories (Days 14-15 output)
-- Achievement stories with context, action, result
CREATE TABLE IF NOT EXISTS a2_achievement_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_number INT NOT NULL CHECK (day_number IN (14, 15)),
  story_index INT NOT NULL CHECK (story_index BETWEEN 1 AND 3),
  statement_id UUID REFERENCES a2_value_statements(id) ON DELETE SET NULL,
  
  -- Story components (raw user input)
  context_scene TEXT,
  context_situation TEXT,
  context_problem TEXT,
  action_what TEXT,
  action_decisions TEXT,
  action_tools TEXT,
  result_changed TEXT,
  result_benefited TEXT,
  result_learned TEXT,
  
  -- Coach-enhanced version
  coach_polished_story TEXT,
  coach_problem_framing TEXT,
  coach_action_framing TEXT,
  coach_result_framing TEXT,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, story_index)
);

CREATE INDEX idx_a2_achievement_stories_user_day ON a2_achievement_stories(user_id, day_number);
CREATE INDEX idx_a2_achievement_stories_story_index ON a2_achievement_stories(user_id, story_index);

-- Table 5: a2_a3_checkpoint_package (Day 15 output)
-- Packaged data for A3 Module 2 validation
CREATE TABLE IF NOT EXISTS a2_a3_checkpoint_package (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_number INT NOT NULL DEFAULT 15,
  
  -- Packaged data
  value_statements JSONB NOT NULL DEFAULT '[]'::jsonb,
  achievement_stories JSONB NOT NULL DEFAULT '[]'::jsonb,
  proof_map JSONB NOT NULL DEFAULT '[]'::jsonb,
  inventory JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- A3 validation
  a3_module_id VARCHAR(50),
  a3_checkpoint_status VARCHAR(50) DEFAULT 'pending',
  a3_validation_response JSONB,
  a3_achievement_bank JSONB,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, day_number)
);

CREATE INDEX idx_a2_a3_checkpoint_package_user ON a2_a3_checkpoint_package(user_id);
CREATE INDEX idx_a2_a3_checkpoint_package_status ON a2_a3_checkpoint_package(a3_checkpoint_status);

-- Enable RLS on all tables
ALTER TABLE a2_value_statements ENABLE ROW LEVEL SECURITY;
ALTER TABLE a2_value_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE a2_proof_map ENABLE ROW LEVEL SECURITY;
ALTER TABLE a2_achievement_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE a2_a3_checkpoint_package ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (users can only see their own data)
CREATE POLICY a2_value_statements_user_policy ON a2_value_statements
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY a2_value_inventory_user_policy ON a2_value_inventory
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY a2_proof_map_user_policy ON a2_proof_map
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY a2_achievement_stories_user_policy ON a2_achievement_stories
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY a2_a3_checkpoint_package_user_policy ON a2_a3_checkpoint_package
  FOR ALL USING (auth.uid() = user_id);
