-- Add context and attempt tracking fields to test_results table
ALTER TABLE test_results
ADD COLUMN IF NOT EXISTS attempt_number INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS user_context JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS personal_goals TEXT,
ADD COLUMN IF NOT EXISTS current_situation TEXT,
ADD COLUMN IF NOT EXISTS career_stage TEXT,
ADD COLUMN IF NOT EXISTS priority_focus TEXT;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_test_results_attempt ON test_results(user_email, test_name, attempt_number DESC);

-- Update existing records to have attempt_number = 1
UPDATE test_results 
SET attempt_number = 1 
WHERE attempt_number IS NULL;

-- Add comment
COMMENT ON COLUMN test_results.attempt_number IS 'Tracks how many times user has taken this test (1st, 2nd, 3rd+)';
COMMENT ON COLUMN test_results.user_context IS 'User personal context including goals, situation, stage';
