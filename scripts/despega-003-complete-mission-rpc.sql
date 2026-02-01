-- Postgres RPC Function for Mission Completion (Issue #9: Atomic Transaction)
-- Ensures mission completion, progress update, and event logging happen together

CREATE OR REPLACE FUNCTION complete_mission_transaction(
  p_user_id UUID,
  p_mision_id TEXT,
  p_user_notes TEXT,
  p_tiempo_dedicado_minutos INTEGER
) RETURNS TABLE (
  mission_completed_id UUID,
  points_earned INTEGER,
  progress_updated BOOLEAN,
  event_logged BOOLEAN
) AS $$
DECLARE
  v_mision_puntos INTEGER;
  v_pilar TEXT;
  v_current_progress INTEGER;
  v_current_points INTEGER;
  v_new_progress_pct INTEGER;
  v_mission_completed_id UUID;
  v_now TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Server-side timestamp
  v_now := NOW();

  -- Step 1: Get mission details
  SELECT puntos INTO v_mision_puntos
  FROM despega_misiones
  WHERE id = p_mision_id;

  IF v_mision_puntos IS NULL THEN
    RAISE EXCEPTION 'Mission % not found', p_mision_id;
  END IF;

  -- Step 2: Mark mission as completed (Issue #9: Atomic)
  INSERT INTO despega_user_misiones (
    user_id,
    mision_id,
    completed,
    completed_at,
    puntos_earned,
    user_notes,
    tiempo_dedicado_minutos,
    created_at
  ) VALUES (
    p_user_id,
    p_mision_id,
    TRUE,
    v_now,
    v_mision_puntos,
    p_user_notes,
    p_tiempo_dedicado_minutos,
    v_now
  ) RETURNING id INTO v_mission_completed_id;

  -- Step 3: Get current pilar progress
  SELECT pilar, missions_completed, points_accumulated
  INTO v_pilar, v_current_progress, v_current_points
  FROM despega_pilar_progress
  WHERE user_id = p_user_id AND pilar = 'a1_cerebral'
  LIMIT 1;

  -- Step 4: Calculate new progress (Issue #10: Correct formula)
  -- progress_pct = (missions_completed / total_missions) * 100
  v_new_progress_pct := ((v_current_progress + 1) * 100) / 5;

  -- Step 5: Update pilar progress (Issue #1: Separate points from diagnostic)
  UPDATE despega_pilar_progress
  SET
    missions_completed = missions_completed + 1,
    points_accumulated = points_accumulated + v_mision_puntos,
    progress_pct = v_new_progress_pct,
    updated_at = v_now
  WHERE user_id = p_user_id AND pilar = 'a1_cerebral';

  -- Step 6: Log score event for Mi Evolución (Issue #9: Time-series)
  INSERT INTO despega_score_events (
    user_id,
    event_type,
    pilar,
    diagnostic_score_at_event,
    points_delta,
    points_total,
    progress_pct_at_event,
    created_at
  ) SELECT
    p_user_id,
    'mission_completed',
    'a1_cerebral',
    diagnostic_score,
    v_mision_puntos,
    points_accumulated + v_mision_puntos,
    v_new_progress_pct,
    v_now
  FROM despega_pilar_progress
  WHERE user_id = p_user_id AND pilar = 'a1_cerebral'
  LIMIT 1;

  -- Return success
  RETURN QUERY SELECT
    v_mission_completed_id,
    v_mision_puntos,
    TRUE::BOOLEAN as progress_updated,
    TRUE::BOOLEAN as event_logged;

EXCEPTION WHEN OTHERS THEN
  RAISE EXCEPTION 'Error in mission completion: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;

-- Index for mission lookups
CREATE INDEX IF NOT EXISTS idx_despega_user_misiones_user_mission ON despega_user_misiones(user_id, mision_id, completed DESC);
