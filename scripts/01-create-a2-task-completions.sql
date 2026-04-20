-- Create a2_user_task_completions table for tracking completed tasks
CREATE TABLE a2_user_task_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phase INTEGER NOT NULL, -- 30, 60, or 90
  day INTEGER NOT NULL,
  task_title TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Composite unique key: one completion per task per user per phase
  UNIQUE(user_id, phase, day, task_title)
);

-- Create index for faster queries
CREATE INDEX idx_a2_completions_user_id ON a2_user_task_completions(user_id);
CREATE INDEX idx_a2_completions_phase ON a2_user_task_completions(user_id, phase);

-- Enable RLS (Row Level Security)
ALTER TABLE a2_user_task_completions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see and manage their own completions
CREATE POLICY "Users can view their own task completions"
  ON a2_user_task_completions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own task completions"
  ON a2_user_task_completions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own task completions"
  ON a2_user_task_completions
  FOR DELETE
  USING (auth.uid() = user_id);

-- Add comments for documentation
COMMENT ON TABLE a2_user_task_completions IS 'Tracks completed tasks for A2 routes (90-day plan tracking)';
COMMENT ON COLUMN a2_user_task_completions.phase IS 'Phase number: 30, 60, or 90 days';
COMMENT ON COLUMN a2_user_task_completions.day IS 'Day within the phase (1-30)';
COMMENT ON COLUMN a2_user_task_completions.task_title IS 'Title of the completed task for deduplication';
