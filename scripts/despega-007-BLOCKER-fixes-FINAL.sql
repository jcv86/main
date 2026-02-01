-- ============================================================================
-- BLOCKER FIX #1: IDEMPOTENT MISSION COMPLETION
-- ============================================================================
-- Add ciclo_actual column if missing
ALTER TABLE IF EXISTS despega_user_misiones
ADD COLUMN IF NOT EXISTS ciclo_actual INTEGER DEFAULT 30;

-- Create partial unique index (prevents duplicate completions per cycle)
CREATE UNIQUE INDEX IF NOT EXISTS idx_mission_completed 
ON despega_user_misiones(user_id, mision_id, ciclo_actual) 
WHERE completed = TRUE;


-- ============================================================================
-- BLOCKER FIX #2: CYCLE_ID UNIQUE IDENTIFICATION
-- ============================================================================
-- Add cycle_id columns if missing to enable multi-cycle support

ALTER TABLE IF EXISTS despega_pilar_progress 
ADD COLUMN IF NOT EXISTS cycle_id UUID DEFAULT gen_random_uuid();

ALTER TABLE IF EXISTS despega_score_events 
ADD COLUMN IF NOT EXISTS cycle_id UUID DEFAULT gen_random_uuid();

-- Create index for cycle-based queries
CREATE INDEX IF NOT EXISTS idx_pilar_progress_cycle
ON despega_pilar_progress(user_id, pilar, cycle_id);

-- Update UNIQUE constraint to prevent ciclo 30 UPSERT from overwriting ciclo 31
ALTER TABLE IF EXISTS despega_pilar_progress 
DROP CONSTRAINT IF EXISTS unique_pilar_progress_per_cycle;

ALTER TABLE IF EXISTS despega_pilar_progress 
ADD CONSTRAINT unique_pilar_progress_cycle 
UNIQUE(user_id, pilar, cycle_id);


-- ============================================================================
-- BLOCKER FIX #3: COMPLETE_MISSION_TRANSACTION (ATOMIC RPC)
-- ============================================================================
-- RPC function ensures atomicity + idempotence for mission completion

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

  -- Check if already completed (IDEMPOTENCE - prevents double-click duplicates)
  SELECT completed INTO v_already_completed
  FROM despega_user_misiones
  WHERE user_id = p_user_id 
    AND mision_id = p_mision_id
    AND ciclo_actual = 30;

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

  -- Get mission pilar (typically 'a1_cerebral')
  v_mission_pilar := 'a1_cerebral';

  -- STEP 1: Mark mission as completed (atomic update)
  UPDATE despega_user_misiones SET
    completed = TRUE,
    completed_at = v_now,
    puntos_earned = p_puntos,
    user_notes = p_notes,
    updated_at = v_now
  WHERE user_id = p_user_id 
    AND mision_id = p_mision_id
    AND ciclo_actual = 30;

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
    points_accumulated = points_accumulated + p_puntos,
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
