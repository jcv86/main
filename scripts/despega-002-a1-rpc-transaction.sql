-- Postgres RPC Function for A1 Test Results (Issue #7: Transaction Atomicity)
-- This ensures all inserts happen together or none at all

CREATE OR REPLACE FUNCTION insert_a1_results_transaction(
  p_user_id UUID,
  p_score_energia INTEGER,
  p_score_enfoque INTEGER,
  p_score_relaciones INTEGER,
  p_score_plan_ejecutivo INTEGER,
  p_score_overall INTEGER,
  p_context_shift BOOLEAN,
  p_context_care BOOLEAN,
  p_context_neuro BOOLEAN,
  p_context_text TEXT,
  p_context_consent BOOLEAN,
  p_now_timestamp TIMESTAMP WITH TIME ZONE,
  p_today_date DATE,
  p_expires_at TIMESTAMP WITH TIME ZONE
) RETURNS TABLE (
  result_id UUID,
  user_id_out UUID,
  overall_score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
  v_a1_result_id UUID;
  v_profile_exists BOOLEAN;
BEGIN
  -- Step 1: Issue #3 - Insert A1 results in separate table (with timestamp)
  INSERT INTO despega_a1_results (
    user_id,
    diagnostic_score_energia,
    diagnostic_score_enfoque,
    diagnostic_score_relaciones,
    diagnostic_score_plan_ejecutivo,
    diagnostic_score_overall,
    context_shift_worker,
    context_caregiving,
    context_neurodiversity,
    context_other_approved,
    ciclo,
    created_at
  ) VALUES (
    p_user_id,
    p_score_energia,
    p_score_enfoque,
    p_score_relaciones,
    p_score_plan_ejecutivo,
    p_score_overall,
    p_context_shift,
    p_context_care,
    p_context_neuro,
    p_context_consent,
    30,
    p_now_timestamp
  ) RETURNING id INTO v_a1_result_id;

  -- Step 2: Issue #4 - Store sensitive context text in vault if provided
  IF p_context_text IS NOT NULL AND p_context_consent THEN
    INSERT INTO despega_context_vault (
      user_id,
      context_other_text,
      consent_given,
      retention_days,
      expires_at,
      created_at
    ) VALUES (
      p_user_id,
      p_context_text,
      true,
      90,
      p_expires_at,
      p_now_timestamp
    );
  END IF;

  -- Step 3: Issue #2 - UPSERT user profile with valid syntax
  INSERT INTO despega_user_profiles (
    user_id,
    a1_test_completed,
    a1_test_completed_at,
    current_ciclo,
    ciclo_start_date,
    updated_at
  ) VALUES (
    p_user_id,
    true,
    p_now_timestamp,
    30,
    p_today_date,
    p_now_timestamp
  )
  ON CONFLICT (user_id) DO UPDATE SET
    a1_test_completed = true,
    a1_test_completed_at = p_now_timestamp,
    updated_at = p_now_timestamp;

  -- Step 4: Issue #1 - Initialize pilar progress with SEPARATED score types
  INSERT INTO despega_pilar_progress (
    user_id,
    pilar,
    diagnostic_score,
    points_accumulated,
    progress_pct,
    total_missions_in_cycle,
    missions_completed,
    ciclo_actual,
    ciclo_start_date,
    is_unlocked,
    created_at,
    updated_at
  ) VALUES (
    p_user_id,
    'a1_cerebral',
    p_score_overall,
    0,
    0,
    5,
    0,
    30,
    p_today_date,
    true,
    p_now_timestamp,
    p_now_timestamp
  )
  ON CONFLICT (user_id, pilar, ciclo_actual) DO UPDATE SET
    diagnostic_score = p_score_overall,
    is_unlocked = true,
    updated_at = p_now_timestamp;

  -- Step 5: Issue #9 - Log event for time-series ("Mi Evolución")
  INSERT INTO despega_score_events (
    user_id,
    event_type,
    pilar,
    diagnostic_score_at_event,
    points_delta,
    points_total,
    progress_pct_at_event,
    context_flags,
    created_at
  ) VALUES (
    p_user_id,
    'diagnostic',
    'a1_cerebral',
    p_score_overall,
    0,
    0,
    0,
    jsonb_build_object(
      'shift_worker', p_context_shift,
      'caregiving', p_context_care,
      'neurodiversity', p_context_neuro
    ),
    p_now_timestamp
  );

  -- Return success with result details
  RETURN QUERY
  SELECT
    v_a1_result_id,
    p_user_id,
    p_score_overall,
    p_now_timestamp;

EXCEPTION WHEN OTHERS THEN
  -- If any step fails, entire transaction rolls back
  RAISE EXCEPTION 'Error inserting A1 results: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Grant execution to authenticated users
GRANT EXECUTE ON FUNCTION insert_a1_results_transaction(
  UUID, INTEGER, INTEGER, INTEGER, INTEGER, INTEGER,
  BOOLEAN, BOOLEAN, BOOLEAN, TEXT, BOOLEAN,
  TIMESTAMP WITH TIME ZONE, DATE, TIMESTAMP WITH TIME ZONE
) TO authenticated;
