-- Add progress tracking flags to despega_user_profiles (HIGH-PRIORITY FIX #5)
-- Purpose: Single source of truth for user progression + navigation logic
-- Enables smart prerequisite redirects without checking multiple tables

ALTER TABLE despega_user_profiles
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS a1_cerebral_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS a1_results_saved BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS conozcamonos_2_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS a2_route_generated BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS a2_missions_started BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS a3_intro_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS a3_entrevista_0_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS a3_training_started BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS a4_unlocked BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS last_module_visited VARCHAR(100),
ADD COLUMN IF NOT EXISTS last_module_visited_at TIMESTAMP;

-- Create function to atomically update progress flags
CREATE OR REPLACE FUNCTION public.update_progress_flag(
  p_user_id UUID,
  p_flag_name VARCHAR,
  p_flag_value BOOLEAN
)
RETURNS BOOLEAN AS $$
DECLARE
  v_query TEXT;
BEGIN
  -- Build safe dynamic query using parameter names
  v_query := format(
    'UPDATE despega_user_profiles SET %I = $1, updated_at = NOW() WHERE user_id = $2',
    p_flag_name
  );
  
  EXECUTE v_query USING p_flag_value, p_user_id;
  
  RETURN TRUE;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Error updating flag %: %', p_flag_name, SQLERRM;
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check prerequisites
CREATE OR REPLACE FUNCTION public.check_user_prerequisites(
  p_user_id UUID,
  p_required_flags TEXT[]
)
RETURNS BOOLEAN AS $$
DECLARE
  v_profile RECORD;
  v_flag TEXT;
  v_flag_value BOOLEAN;
BEGIN
  SELECT * INTO v_profile FROM despega_user_profiles WHERE user_id = p_user_id;
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  FOREACH v_flag IN ARRAY p_required_flags LOOP
    v_flag_value := (v_profile::jsonb ->> v_flag)::BOOLEAN;
    IF NOT v_flag_value THEN
      RETURN FALSE;
    END IF;
  END LOOP;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execution
GRANT EXECUTE ON FUNCTION public.update_progress_flag(UUID, VARCHAR, BOOLEAN) TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_user_prerequisites(UUID, TEXT[]) TO authenticated;

-- Add comments
COMMENT ON COLUMN despega_user_profiles.onboarding_completed IS
'User completed Conozcámonos-1 intake (5-7 questions)';

COMMENT ON COLUMN despega_user_profiles.a1_cerebral_completed IS
'User completed A1 Cerebral DISC assessment (28 questions)';

COMMENT ON COLUMN despega_user_profiles.a1_results_saved IS
'A1 results processed and saved to user_a1_profiles';

COMMENT ON COLUMN despega_user_profiles.conozcamonos_2_completed IS
'User completed Conozcámonos-2 (energy & support preferences)';

COMMENT ON COLUMN despega_user_profiles.a2_route_generated IS
'A2 90-day route calculated based on profile';

COMMENT ON COLUMN despega_user_profiles.a2_missions_started IS
'User started first A2 mission';

COMMENT ON COLUMN despega_user_profiles.a3_intro_completed IS
'User viewed A3 intro/orientation';

COMMENT ON COLUMN despega_user_profiles.a3_entrevista_0_completed IS
'User completed practice interview 0';

COMMENT ON COLUMN despega_user_profiles.a3_training_started IS
'User started formal A3 training';

COMMENT ON COLUMN despega_user_profiles.a4_unlocked IS
'User has access to A4 (context coach)';

COMMENT ON COLUMN despega_user_profiles.last_module_visited IS
'Last module path user accessed (for smart resumption)';

COMMENT ON COLUMN despega_user_profiles.last_module_visited_at IS
'Timestamp of last visit (for analytics)';

COMMENT ON FUNCTION public.update_progress_flag IS
'Atomically update single progress flag and timestamp.
Used by each module to mark completion.
Prevents race conditions on flag updates.';

COMMENT ON FUNCTION public.check_user_prerequisites IS
'Verify user has completed required flags before accessing module.
Returns TRUE only if all required_flags are TRUE.
Used for prerequisite checking in middleware.';
