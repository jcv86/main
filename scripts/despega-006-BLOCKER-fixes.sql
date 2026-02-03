-- ============================================================================
-- BLOCKER FIX #1: IDEMPOTENT MISSION COMPLETION
-- ============================================================================
-- Problem: Double-click on "Complete Mission" duplicates +25 points
-- Solution: Add partial unique index for completed missions

-- First add ciclo_actual column if missing (for tracking cycle-specific missions)
ALTER TABLE despega_user_misiones
ADD COLUMN IF NOT EXISTS ciclo_actual INTEGER DEFAULT 30 CHECK (ciclo_actual IN (30, 60, 90));

CREATE UNIQUE INDEX IF NOT EXISTS idx_mission_completed 
ON despega_user_misiones(user_id, mision_id, ciclo_actual) 
WHERE completed = TRUE;

-- Ensures each user can only complete a mission ONCE per cycle
-- Double-click attempt silently fails (UPSERT returns existing row, no points added)


-- ============================================================================
-- BLOCKER FIX #2: CYCLE_ID UNIQUE IDENTIFICATION
-- ============================================================================
-- Problem: ciclo hardcoded = 30 causes UPSERT to overwrite previous cycle
-- Solution: Add cycle_id UUID to uniquely identify each cycle

ALTER TABLE despega_a1_results 
ADD COLUMN cycle_id UUID NOT NULL DEFAULT gen_random_uuid();

ALTER TABLE despega_pilar_progress 
ADD COLUMN cycle_id UUID NOT NULL DEFAULT gen_random_uuid();

ALTER TABLE despega_score_events 
ADD COLUMN cycle_id UUID NOT NULL DEFAULT gen_random_uuid();

-- Create index for cycle queries
CREATE INDEX idx_cycle_progression 
ON despega_pilar_progress(user_id, pilar, cycle_id, created_at DESC);

-- Update UNIQUE constraint to include cycle_id
ALTER TABLE despega_pilar_progress 
ADD CONSTRAINT unique_pilar_progress_cycle 
UNIQUE(user_id, pilar, cycle_id);

-- This prevents ciclo 30 UPSERT from overwriting ciclo 31


-- ============================================================================
-- BLOCKER FIX #3: COMPLETE_MISSION_TRANSACTION (ATOMIC RPC)
-- ============================================================================
-- Problem: completeMision() uses .upsert() = NOT atomic
-- Solution: RPC function ensures atomicity + idempotence

CREATE OR REPLACE FUNCTION complete_a1_mission_transaction(
  p_user_id UUID,
  p_mision_id TEXT,
  p_cycle_id UUID,
  p_notes TEXT,
  p_puntos INTEGER
) RETURNS TABLE (
  success BOOLEAN,
  puntos_awarded INTEGER,
  progress_pct_new INTEGER,
  message TEXT
) AS $$
DECLARE
  v_now TIMESTAMP WITH TIME ZONE;
  v_already_completed BOOLEAN;
  v_mission_pilar TEXT;
  v_progress_pct_new INTEGER;
  v_missions_total INTEGER;
  v_missions_completed INTEGER;
BEGIN
  v_now := NOW();

  -- Check if already completed (IDEMPOTENCE)
  SELECT completed INTO v_already_completed
  FROM despega_user_misiones
  WHERE user_id = p_user_id 
    AND mision_id = p_mision_id
    AND ciclo_actual = p_cycle_id;

  IF v_already_completed THEN
    -- Already completed - return silently (no duplicate points)
    RETURN QUERY SELECT 
      false::BOOLEAN,
      0::INTEGER,
      (SELECT progress_pct FROM despega_pilar_progress 
       WHERE user_id = p_user_id AND pilar = 'a1_cerebral' AND cycle_id = p_cycle_id)::INTEGER,
      'Mission already completed - no points added'::TEXT;
    RETURN;
  END IF;

  -- Get mission pilar
  SELECT pilar INTO v_mission_pilar
  FROM despega_misiones
  WHERE id = p_mision_id;

  IF v_mission_pilar IS NULL THEN
    RAISE EXCEPTION 'Mission not found: %', p_mision_id;
  END IF;

  -- STEP 1: Mark mission as completed
  UPDATE despega_user_misiones SET
    completed = TRUE,
    completed_at = v_now,
    puntos_earned = p_puntos,
    user_notes = p_notes,
    updated_at = v_now
  WHERE user_id = p_user_id 
    AND mision_id = p_mision_id
    AND ciclo_actual = p_cycle_id;

  -- STEP 2: Update pilar progress (Issue #1: scores separated)
  SELECT total_missions_in_cycle, missions_completed 
  INTO v_missions_total, v_missions_completed
  FROM despega_pilar_progress
  WHERE user_id = p_user_id 
    AND pilar = v_mission_pilar
    AND cycle_id = p_cycle_id;

  v_missions_completed := v_missions_completed + 1;
  v_progress_pct_new := (v_missions_completed::FLOAT / v_missions_total::FLOAT * 100)::INTEGER;

  UPDATE despega_pilar_progress SET
    missions_completed = v_missions_completed,
    points_accumulated = points_accumulated + p_puntos,  -- Issue #1: only from missions
    progress_pct = v_progress_pct_new,
    updated_at = v_now
  WHERE user_id = p_user_id 
    AND pilar = v_mission_pilar
    AND cycle_id = p_cycle_id;

  -- STEP 3: Log event for "Mi Evolución" time-series (Issue #9)
  INSERT INTO despega_score_events (
    user_id,
    event_type,
    pilar,
    cycle_id,
    diagnostic_score_at_event,
    points_delta,
    points_total,
    progress_pct_at_event,
    created_at
  ) VALUES (
    p_user_id,
    'mission_completed',
    v_mission_pilar,
    p_cycle_id,
    (SELECT diagnostic_score FROM despega_pilar_progress 
     WHERE user_id = p_user_id AND pilar = v_mission_pilar AND cycle_id = p_cycle_id),
    p_puntos,
    (SELECT points_accumulated FROM despega_pilar_progress 
     WHERE user_id = p_user_id AND pilar = v_mission_pilar AND cycle_id = p_cycle_id),
    v_progress_pct_new,
    v_now
  );

  RETURN QUERY SELECT 
    true::BOOLEAN,
    p_puntos::INTEGER,
    v_progress_pct_new::INTEGER,
    'Mission completed successfully'::TEXT;

EXCEPTION WHEN OTHERS THEN
  RAISE EXCEPTION 'Error completing mission: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;


-- ============================================================================
-- BONUS: UPDATE insert_a1_results_transaction to use cycle_id
-- ============================================================================
-- MODIFY this line in existing RPC:

/*
DECLARE
  v_a1_result_id UUID;
  v_cycle_id UUID := gen_random_uuid();  -- ADD THIS LINE
  v_now TIMESTAMP WITH TIME ZONE;
  ...

Then update all cycle references:
  INSERT INTO despega_a1_results (..., cycle_id, ...)
    VALUES (..., v_cycle_id, ...)
  
  INSERT INTO despega_pilar_progress (..., cycle_id, ...)
    VALUES (..., v_cycle_id, ...)
    
  INSERT INTO despega_score_events (..., cycle_id, ...)
    VALUES (..., v_cycle_id, ...)
*/
