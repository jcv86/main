-- Add cycle_id system to enable unlimited 90-day cycles
-- Problem: Currently hardcoded ciclo = 30, loses data when cycle changes
-- Solution: UUID-based cycle tracking with unique constraint

-- STEP 1: Add cycle_id column to despega_pilar_progress
ALTER TABLE despega_pilar_progress
ADD COLUMN cycle_id UUID DEFAULT gen_random_uuid(),
ADD COLUMN started_at TIMESTAMP DEFAULT NOW();

-- STEP 2: Create unique constraint on (user_id, pilar_name, cycle_id)
-- First remove old unique constraint if exists
ALTER TABLE despega_pilar_progress
DROP CONSTRAINT IF EXISTS despega_pilar_progress_unique;

-- Add new constraint that includes cycle_id
ALTER TABLE despega_pilar_progress
ADD CONSTRAINT despega_pilar_progress_unique
UNIQUE (user_id, pilar_name, cycle_id);

-- STEP 3: Create index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_pilar_progress_cycle
ON despega_pilar_progress(user_id, cycle_id);

-- STEP 4: Track current cycle in despega_user_profiles
ALTER TABLE despega_user_profiles
ADD COLUMN current_cycle_id UUID,
ADD COLUMN current_cycle_started_at TIMESTAMP,
ADD COLUMN total_cycles_completed INTEGER DEFAULT 0;

-- STEP 5: Create index for cycle lookups
CREATE INDEX IF NOT EXISTS idx_user_current_cycle
ON despega_user_profiles(user_id, current_cycle_id);

-- STEP 6: Add function to generate new cycle for user
CREATE OR REPLACE FUNCTION public.start_new_cycle(p_user_id UUID)
RETURNS UUID AS $$
DECLARE
  v_new_cycle_id UUID := gen_random_uuid();
BEGIN
  UPDATE despega_user_profiles
  SET current_cycle_id = v_new_cycle_id,
      current_cycle_started_at = NOW(),
      total_cycles_completed = COALESCE(total_cycles_completed, 0) + 1,
      updated_at = NOW()
  WHERE user_id = p_user_id;
  
  -- Return the new cycle ID for reference
  RETURN v_new_cycle_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 7: Create function to get current cycle
CREATE OR REPLACE FUNCTION public.get_current_cycle(p_user_id UUID)
RETURNS TABLE(cycle_id UUID, started_at TIMESTAMP) AS $$
BEGIN
  RETURN QUERY
  SELECT current_cycle_id, current_cycle_started_at
  FROM despega_user_profiles
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comments
COMMENT ON COLUMN despega_pilar_progress.cycle_id IS
'UUID-based cycle identifier. Enables unlimited 90-day cycles without data loss.
Each cycle is isolated and tracked separately.';

COMMENT ON COLUMN despega_user_profiles.current_cycle_id IS
'Current active cycle. Updated when new cycle starts.
Used to track which cycle user is currently in.';

COMMENT ON FUNCTION public.start_new_cycle IS
'Initialize new 90-day cycle for user. 
Increments total_cycles_completed counter.
Returns new cycle_id for use in mission completions.';

COMMENT ON FUNCTION public.get_current_cycle IS
'Get current active cycle for user.
Returns cycle_id and start timestamp.';

-- STEP 8: Backfill existing cycle data
-- Migrate all existing data to cycle 1 (hardcoded 30 → UUID)
UPDATE despega_pilar_progress
SET cycle_id = (
  SELECT COALESCE(up.current_cycle_id, gen_random_uuid())
  FROM despega_user_profiles up
  WHERE up.user_id = despega_pilar_progress.user_id
  LIMIT 1
)
WHERE cycle_id = gen_random_uuid();

-- Initialize current_cycle_id for users without one
UPDATE despega_user_profiles
SET current_cycle_id = gen_random_uuid(),
    current_cycle_started_at = NOW(),
    total_cycles_completed = 1
WHERE current_cycle_id IS NULL;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.start_new_cycle(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_current_cycle(UUID) TO authenticated;
