-- Add missing columns to coach_context_snapshots table
ALTER TABLE coach_context_snapshots
ADD COLUMN IF NOT EXISTS a1_insights JSONB,
ADD COLUMN IF NOT EXISTS a2_progress JSONB,
ADD COLUMN IF NOT EXISTS a3_feedback JSONB,
ADD COLUMN IF NOT EXISTS a4_intel JSONB,
ADD COLUMN IF NOT EXISTS coaching_history JSONB DEFAULT '[]'::jsonb;

-- Create indices for better query performance
CREATE INDEX IF NOT EXISTS idx_coach_context_a1_insights ON coach_context_snapshots USING GIN (a1_insights);
CREATE INDEX IF NOT EXISTS idx_coach_context_a2_progress ON coach_context_snapshots USING GIN (a2_progress);
CREATE INDEX IF NOT EXISTS idx_coach_context_a3_feedback ON coach_context_snapshots USING GIN (a3_feedback);
CREATE INDEX IF NOT EXISTS idx_coach_context_a4_intel ON coach_context_snapshots USING GIN (a4_intel);

-- Update timestamp
ALTER TABLE coach_context_snapshots
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
