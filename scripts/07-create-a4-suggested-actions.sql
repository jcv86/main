-- Tabla para guardar acciones sugeridas basadas en puntaje A4
CREATE TABLE IF NOT EXISTS a4_suggested_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action_title VARCHAR NOT NULL,
  action_description TEXT NOT NULL,
  difficulty_level VARCHAR CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  estimated_time_minutes INT,
  impact_score INT CHECK (impact_score >= 0 AND impact_score <= 100),
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE a4_suggested_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own actions"
  ON a4_suggested_actions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own actions"
  ON a4_suggested_actions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own actions"
  ON a4_suggested_actions FOR UPDATE
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_a4_actions_user_id ON a4_suggested_actions(user_id);
CREATE INDEX idx_a4_actions_created ON a4_suggested_actions(created_at);
CREATE INDEX idx_a4_actions_difficulty ON a4_suggested_actions(difficulty_level);
