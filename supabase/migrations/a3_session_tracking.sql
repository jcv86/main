-- A3 Session Tracking Tables
-- Tracks all A3 module attempts, character interactions, and performance data

-- Create enum types
CREATE TYPE session_type AS ENUM ('coach_training', 'interviewer_simulation');
CREATE TYPE character_type AS ENUM ('coach', 'sofia', 'elena', 'bruno');
CREATE TYPE difficulty_level AS ENUM ('adaptive', 'basic', 'advanced', 'pro');

-- Main session attempts table
CREATE TABLE a3_session_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL,
  module_number INT,
  session_type session_type NOT NULL,
  lead_character character_type NOT NULL,
  difficulty difficulty_level NOT NULL,
  is_route_checkpoint BOOLEAN DEFAULT false,
  is_replay BOOLEAN DEFAULT false,
  related_a2_day INT,
  status TEXT DEFAULT 'in_progress', -- 'in_progress', 'completed', 'abandoned'
  progress INT DEFAULT 0,
  score INT,
  feedback TEXT,
  transcript JSONB,
  deliverable JSONB,
  session_started_at TIMESTAMP DEFAULT now(),
  session_completed_at TIMESTAMP,
  duration_seconds INT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),

  UNIQUE(user_id, module_id, is_replay, created_at)
);

-- Session progress checkpoints
CREATE TABLE a3_session_checkpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES a3_session_attempts(id) ON DELETE CASCADE,
  checkpoint_number INT NOT NULL,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  score INT,
  feedback TEXT,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);

-- Character interaction log
CREATE TABLE a3_character_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES a3_session_attempts(id) ON DELETE CASCADE,
  character character_type NOT NULL,
  message_type TEXT NOT NULL, -- 'question', 'feedback', 'guidance', 'evaluation'
  content TEXT NOT NULL,
  user_response TEXT,
  evaluation_score INT,
  timestamp TIMESTAMP DEFAULT now()
);

-- A3 completion tracking
CREATE TABLE a3_module_completion (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL,
  module_number INT,
  completed_at TIMESTAMP DEFAULT now(),
  total_attempts INT DEFAULT 1,
  best_score INT,
  deliverable JSONB,
  UNIQUE(user_id, module_id)
);

-- A3 replay practice sessions
CREATE TABLE a3_replay_practice (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL,
  character character_type NOT NULL,
  difficulty difficulty_level NOT NULL,
  attempt_number INT DEFAULT 1,
  score INT,
  feedback TEXT,
  practice_date TIMESTAMP DEFAULT now(),
  created_at TIMESTAMP DEFAULT now()
);

-- A3 route progression
CREATE TABLE a3_route_progression (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_module_number INT DEFAULT 1,
  total_completed INT DEFAULT 0,
  route_level TEXT DEFAULT 'basic', -- 'basic', 'advanced', 'pro'
  route_completed_at TIMESTAMP,
  can_replay_modules_7_10 BOOLEAN DEFAULT false,
  advanced_unlocked_at TIMESTAMP,
  pro_unlocked_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_a3_sessions_user_id ON a3_session_attempts(user_id);
CREATE INDEX idx_a3_sessions_module_id ON a3_session_attempts(module_id);
CREATE INDEX idx_a3_sessions_character ON a3_session_attempts(lead_character);
CREATE INDEX idx_a3_sessions_status ON a3_session_attempts(status);
CREATE INDEX idx_a3_checkpoints_session ON a3_session_checkpoints(session_id);
CREATE INDEX idx_a3_interactions_session ON a3_character_interactions(session_id);
CREATE INDEX idx_a3_completion_user ON a3_module_completion(user_id);
CREATE INDEX idx_a3_replay_user ON a3_replay_practice(user_id);
CREATE INDEX idx_a3_progress_user ON a3_route_progression(user_id);

-- Enable Row Level Security
ALTER TABLE a3_session_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE a3_session_checkpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE a3_character_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE a3_module_completion ENABLE ROW LEVEL SECURITY;
ALTER TABLE a3_replay_practice ENABLE ROW LEVEL SECURITY;
ALTER TABLE a3_route_progression ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Users can only see their own data
CREATE POLICY "Users can view own sessions" ON a3_session_attempts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" ON a3_session_attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON a3_session_attempts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own checkpoints" ON a3_session_checkpoints
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM a3_session_attempts
      WHERE id = session_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own completion" ON a3_module_completion
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own completion" ON a3_module_completion
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own replay" ON a3_replay_practice
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own replay" ON a3_replay_practice
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own progression" ON a3_route_progression
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progression" ON a3_route_progression
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progression" ON a3_route_progression
  FOR UPDATE USING (auth.uid() = user_id);

