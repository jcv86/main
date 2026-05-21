-- Postgres RPC Function for Mission Completion (Issue #9: Atomic Transaction)
-- FIXED for production: Includes cycle_id, idempotence check, and atomic transaction
-- This function handles: mission completion, progress update, scoring, all in ONE transaction

CREATE OR REPLACE FUNCTION complete_mission_transaction(
  p_user_id UUID,
  p_mision_id TEXT,
  p_user_notes TEXT,
  p_tiempo_dedicado_minutos INTEGER
) RETURNS TABLE (
  mission_completed_id UUID,
  points_earned INTEGER,
  progress_updated BOOLEAN,
  event_logged BOOLEAN,
  idempotent_call BOOLEAN
) AS $$
DECLARE
  v_mision_puntos INTEGER;
  v_pilar TEXT;
  v_cycle_id UUID;
  v_current_progress INTEGER;
  v_current_points INTEGER;
  v_new_progress_pct INTEGER;
  v_mission_completed_id UUID;
  v_now TIMESTAMP WITH TIME ZONE;
  v_already_completed BOOLEAN;
  v_existing_completed_id UUID;
BEGIN
  -- Server-side timestamp
  v_now := NOW();

  -- Step 1: Get mission details
  SELECT puntos, pilar INTO v_mision_puntos, v_pilar
  FROM despega_misiones
  WHERE id = p_mision_id;

  IF v_mision_puntos IS NULL THEN
    RAISE EXCEPTION 'Mission % not found', p_mision_id;
  END IF;

  -- Step 2: Get the ACTIVE cycle for this user+pilar
  -- This ensures we're working within the correct cycle context
  SELECT id INTO v_cycle_id
  FROM despega_cycles
  WHERE user_id = p_user_id 
    AND pilar = v_pilar
    AND status = 'active'
  LIMIT 1;

  IF v_cycle_id IS NULL THEN
    RAISE EXCEPTION 'No active cycle found for user % and pilar %', p_user_id, v_pilar;
  END IF;

  -- Step 3: CHECK IDEMPOTENCE - Is this mission already completed in this cycle?
  SELECT id INTO v_existing_completed_id
  FROM despega_user_misiones
  WHERE user_id = p_user_id 
    AND mision_id = p_mision_id 
    AND cycle_id = v_cycle_id
    AND completed = TRUE
  LIMIT 1;

  -- If already completed, return existing record (IDEMPOTENT - prevents double-counting)
  IF v_existing_completed_id IS NOT NULL THEN
    RETURN QUERY SELECT
      v_existing_completed_id,
      v_mision_puntos,
      FALSE::BOOLEAN as progress_updated,
      FALSE::BOOLEAN as event_logged,
      TRUE::BOOLEAN as idempotent_call;
    RETURN;
  END IF;

  -- Step 4: Mark mission as completed (INSERT ONLY if not yet completed in this cycle)
  INSERT INTO despega_user_misiones (
    user_id,
    mision_id,
    cycle_id,
    completed,
    completed_at,
    puntos_earned,
    user_notes,
    tiempo_dedicado_minutos,
    created_at
  ) VALUES (
    p_user_id,
    p_mision_id,
    v_cycle_id,
    TRUE,
    v_now,
    v_mision_puntos,
    p_user_notes,
    p_tiempo_dedicado_minutos,
    v_now
  ) RETURNING id INTO v_mission_completed_id;

  -- Step 5: Get current pilar progress FOR THIS CYCLE
  SELECT missions_completed, points_accumulated
  INTO v_current_progress, v_current_points
  FROM despega_pilar_progress
  WHERE user_id = p_user_id 
    AND pilar = v_pilar
    AND cycle_id = v_cycle_id
  LIMIT 1;

  -- Step 6: Calculate new progress (progress_pct = (missions_completed / total_missions) * 100)
  v_new_progress_pct := ((v_current_progress + 1) * 100) / 5;

  -- Step 7: Update pilar progress FOR THIS CYCLE (unique constraint: user_id, pilar, cycle_id)
  UPDATE despega_pilar_progress
  SET
    missions_completed = missions_completed + 1,
    points_accumulated = points_accumulated + v_mision_puntos,
    progress_pct = v_new_progress_pct,
    updated_at = v_now
  WHERE user_id = p_user_id 
    AND pilar = v_pilar
    AND cycle_id = v_cycle_id;

  -- Step 8: Log score event for "Mi Evolución" (time-series)
  INSERT INTO despega_score_events (
    user_id,
    pilar,
    cycle_id,
    event_type,
    diagnostic_score_at_event,
    points_delta,
    points_total,
    progress_pct_at_event,
    created_at
  ) SELECT
    p_user_id,
    v_pilar,
    v_cycle_id,
    'mission_completed',
    diagnostic_score,
    v_mision_puntos,
    points_accumulated + v_mision_puntos,
    v_new_progress_pct,
    v_now
  FROM despega_pilar_progress
  WHERE user_id = p_user_id 
    AND pilar = v_pilar
    AND cycle_id = v_cycle_id
  LIMIT 1;

  -- Return success
  RETURN QUERY SELECT
    v_mission_completed_id,
    v_mision_puntos,
    TRUE::BOOLEAN as progress_updated,
    TRUE::BOOLEAN as event_logged,
    FALSE::BOOLEAN as idempotent_call;

EXCEPTION WHEN OTHERS THEN
  RAISE EXCEPTION 'Error in mission completion: % (SQLSTATE: %)', SQLERRM, SQLSTATE;
END;
$$ LANGUAGE plpgsql;

-- Index for mission lookups (optimized for idempotence check with cycle_id)
CREATE INDEX IF NOT EXISTS idx_despega_user_misiones_user_cycle_mission 
  ON despega_user_misiones(user_id, cycle_id, mision_id, completed DESC);
