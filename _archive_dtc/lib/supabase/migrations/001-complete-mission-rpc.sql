-- Complete A1 Mission Atomic Transaction RPC
-- Prevents: points duplication, half-written data, non-idempotent updates
-- Usage: SELECT complete_a1_mission_transaction(user_id, mission_id, cycle_id, points, pilar)

CREATE OR REPLACE FUNCTION public.complete_a1_mission_transaction(
  p_user_id UUID,
  p_mission_id UUID,
  p_cycle_id UUID,
  p_points INTEGER,
  p_pilar VARCHAR
)
RETURNS JSONB AS $$
DECLARE
  v_now TIMESTAMP := NOW();
  v_expires_at TIMESTAMP := NOW() + INTERVAL '30 days';
  v_mission_status RECORD;
  v_new_balance INTEGER;
  v_pilar_progress INTEGER;
BEGIN
  
  -- STEP 1: Verify mission exists and not completed (idempotency)
  SELECT * INTO v_mission_status
  FROM despega_a1_results
  WHERE id = p_mission_id
    AND user_id = p_user_id
    AND completed = FALSE;  -- CRITICAL: Only proceed if not completed
  
  IF NOT FOUND THEN
    -- Already completed or doesn't exist - idempotent return
    RETURN jsonb_build_object(
      'success', FALSE,
      'error', 'Mission already completed or not found',
      'idempotent', TRUE
    );
  END IF;
  
  -- STEP 2: Mark mission as completed (atomic)
  UPDATE despega_a1_results
  SET completed = TRUE,
      updated_at = v_now
  WHERE id = p_mission_id
    AND user_id = p_user_id
    AND completed = FALSE;  -- Double-check race condition
  
  -- STEP 3: Add points to user balance (with upsert for new users)
  INSERT INTO user_dtc_balance (user_id, balance, lifetime_earned)
  VALUES (p_user_id, p_points, p_points)
  ON CONFLICT (user_id) DO UPDATE
  SET balance = user_dtc_balance.balance + EXCLUDED.balance,
      lifetime_earned = user_dtc_balance.lifetime_earned + EXCLUDED.lifetime_earned,
      updated_at = v_now;
  
  SELECT balance INTO v_new_balance
  FROM user_dtc_balance
  WHERE user_id = p_user_id;
  
  -- STEP 4: Log transaction for audit trail
  INSERT INTO dtc_transactions (
    user_id, amount, transaction_type, description, related_to, related_id, created_at
  ) VALUES (
    p_user_id, p_points, 'earn', 
    'Mission completed: ' || p_pilar,
    'mission_complete', p_mission_id, v_now
  );
  
  -- STEP 5: Update pilar progress (atomic with cycle tracking)
  UPDATE despega_pilar_progress
  SET progress_percent = progress_percent + (p_points::NUMERIC / 100),
      missions_completed = missions_completed + 1,
      updated_at = v_now
  WHERE user_id = p_user_id
    AND pilar_name = p_pilar
    AND cycle_id = p_cycle_id;
  
  -- If no existing progress for this cycle, insert new
  IF NOT FOUND THEN
    INSERT INTO despega_pilar_progress (
      user_id, pilar_name, cycle_id, progress_percent, missions_completed, created_at
    ) VALUES (
      p_user_id, p_pilar, p_cycle_id,
      (p_points::NUMERIC / 100), 1, v_now
    );
  END IF;
  
  SELECT progress_percent INTO v_pilar_progress
  FROM despega_pilar_progress
  WHERE user_id = p_user_id
    AND pilar_name = p_pilar
    AND cycle_id = p_cycle_id;
  
  -- STEP 6: Update user gamification profile
  INSERT INTO user_gamification_profile (user_id, total_xp)
  VALUES (p_user_id, p_points)
  ON CONFLICT (user_id) DO UPDATE
  SET total_xp = user_gamification_profile.total_xp + EXCLUDED.total_xp,
      updated_at = v_now;
  
  -- Return success with all updated values
  RETURN jsonb_build_object(
    'success', TRUE,
    'new_balance', v_new_balance,
    'pilar_progress', v_pilar_progress,
    'updated_at', v_now,
    'completed_at', v_expires_at
  );
  
EXCEPTION WHEN OTHERS THEN
  -- Automatic rollback on any error
  RETURN jsonb_build_object(
    'success', FALSE,
    'error', SQLERRM,
    'sqlstate', SQLSTATE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execution to authenticated users
GRANT EXECUTE ON FUNCTION public.complete_a1_mission_transaction(
  UUID, UUID, UUID, INTEGER, VARCHAR
) TO authenticated;

-- Add comments for documentation
COMMENT ON FUNCTION public.complete_a1_mission_transaction IS
'Atomic transaction for mission completion. Prevents double-click duplication.
Updates: mission status, DTC balance, transaction log, pilar progress, XP.
Returns: {success: bool, new_balance: int, pilar_progress: decimal, updated_at: timestamp}
Idempotent: returns False if mission already completed (safe for retries)';
