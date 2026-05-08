-- Create table to track which training modules have been completed by each user (to prevent duplicate XP)
CREATE TABLE IF NOT EXISTS a3_training_module_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  training_module_id uuid,
  training_type VARCHAR NOT NULL,
  first_completion_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  xp_awarded_at TIMESTAMP WITH TIME ZONE,
  xp_amount INTEGER NOT NULL DEFAULT 0,
  is_first_completion BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, training_type)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_training_completions_user_id ON a3_training_module_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_training_completions_training_type ON a3_training_module_completions(training_type);
CREATE INDEX IF NOT EXISTS idx_training_completions_first_completion_at ON a3_training_module_completions(first_completion_at DESC);

-- Enable RLS
ALTER TABLE a3_training_module_completions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS "Users can view own training completions" ON a3_training_module_completions;
CREATE POLICY "Users can view own training completions"
  ON a3_training_module_completions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own training completions" ON a3_training_module_completions;
CREATE POLICY "Users can insert own training completions"
  ON a3_training_module_completions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can manage training completions" ON a3_training_module_completions;
CREATE POLICY "System can manage training completions"
  ON a3_training_module_completions
  USING (true);
