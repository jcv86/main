-- Create training sessions table if not exists
CREATE TABLE IF NOT EXISTS a3_training_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  training_type VARCHAR NOT NULL,
  level VARCHAR NOT NULL CHECK (level IN ('basico', 'intermedio', 'avanzado')),
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  time_spent_seconds INTEGER NOT NULL,
  questions_completed INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  rewards_earned TEXT[] DEFAULT '{}',
  started_at TIMESTAMP WITH TIME ZONE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_training_sessions_user_id ON a3_training_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_training_sessions_completed_at ON a3_training_sessions(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_training_sessions_training_type ON a3_training_sessions(training_type);
CREATE INDEX IF NOT EXISTS idx_training_sessions_level ON a3_training_sessions(level);

-- Enable RLS
ALTER TABLE a3_training_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS "Users can view own training sessions" ON a3_training_sessions;
CREATE POLICY "Users can view own training sessions"
  ON a3_training_sessions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own training sessions" ON a3_training_sessions;
CREATE POLICY "Users can insert own training sessions"
  ON a3_training_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can manage training sessions" ON a3_training_sessions;
CREATE POLICY "System can manage training sessions"
  ON a3_training_sessions
  USING (true);

-- Create view for user training stats
DROP VIEW IF EXISTS v_user_training_stats CASCADE;
CREATE VIEW v_user_training_stats AS
SELECT
  user_id,
  COUNT(*) as total_trainings,
  AVG(score)::INTEGER as average_score,
  MAX(score) as best_score,
  SUM(xp_earned) as total_xp_earned,
  SUM(time_spent_seconds) as total_time_spent_seconds,
  MAX(completed_at) as last_training_at,
  COUNT(DISTINCT DATE(completed_at)) as unique_days_trained,
  ARRAY_AGG(DISTINCT training_type) as training_types
FROM a3_training_sessions
GROUP BY user_id;
