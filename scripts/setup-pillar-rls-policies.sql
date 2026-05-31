/**
 * Pillar Sequence RLS Policies
 * Enforces sequential pillar access: A1 → A2 → A3 → A4
 * 
 * This script adds RLS policies to ensure users can only access pillars
 * they have completed prerequisites for.
 */

-- ====================================
-- A2 (ROUTES) - Requires A1 Complete
-- ====================================

-- A2 Route Progress - Users can only INSERT if they have A1 complete
CREATE POLICY a2_user_route_progress_insert_requires_a1
  ON a2_user_route_progress
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND (
      -- Allow if user has a1_identity record (A1 complete)
      EXISTS (
        SELECT 1 FROM a1_identity 
        WHERE user_id = auth.uid()
      )
    )
  );

-- A2 Day1 Submissions - Users can only INSERT/UPDATE if they have A1 complete
CREATE POLICY a2_day1_submissions_insert_requires_a1
  ON a2_day1_submissions
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND (
      EXISTS (
        SELECT 1 FROM a1_identity 
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY a2_day1_submissions_update_requires_a1
  ON a2_day1_submissions
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (
    user_id = auth.uid() AND (
      EXISTS (
        SELECT 1 FROM a1_identity 
        WHERE user_id = auth.uid()
      )
    )
  );

-- A2 User Bitacora - Users can only INSERT if they have A1 complete
CREATE POLICY a2_user_bitacora_insert_requires_a1
  ON a2_user_bitacora
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND (
      EXISTS (
        SELECT 1 FROM a1_identity 
        WHERE user_id = auth.uid()
      )
    )
  );

-- A2 User Missions - Users can only INSERT if they have A1 complete
CREATE POLICY a2_user_missions_insert_requires_a1
  ON a2_user_missions
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND (
      EXISTS (
        SELECT 1 FROM a1_identity 
        WHERE user_id = auth.uid()
      )
    )
  );

-- A2 User Sprints - Users can only INSERT if they have A1 complete
CREATE POLICY a2_user_sprints_insert_requires_a1
  ON a2_user_sprints
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND (
      EXISTS (
        SELECT 1 FROM a1_identity 
        WHERE user_id = auth.uid()
      )
    )
  );

-- A2 Market Signals - Users can only INSERT if they have A1 complete
CREATE POLICY a2_market_signals_insert_requires_a1
  ON a2_market_signals
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND (
      EXISTS (
        SELECT 1 FROM a1_identity 
        WHERE user_id = auth.uid()
      )
    )
  );

-- ====================================
-- A3 (INTERVIEWS) - Requires A1+A2 Complete
-- ====================================

-- A3 Module Completion - Users can only INSERT if they have A1+A2 complete
CREATE POLICY a3_module_completion_insert_requires_a1_a2
  ON a3_module_completion
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND (
      EXISTS (
        SELECT 1 FROM a1_identity 
        WHERE user_id = auth.uid()
      )
      AND
      EXISTS (
        SELECT 1 FROM a2_user_task_completions
        WHERE user_id = auth.uid()
        LIMIT 1
      )
    )
  );

-- A3 Session Attempts - Users can only INSERT if they have A1+A2 complete
CREATE POLICY a3_session_attempts_insert_requires_a1_a2
  ON a3_session_attempts
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND (
      EXISTS (
        SELECT 1 FROM a1_identity 
        WHERE user_id = auth.uid()
      )
      AND
      EXISTS (
        SELECT 1 FROM a2_user_task_completions
        WHERE user_id = auth.uid()
        LIMIT 1
      )
    )
  );

-- A3 Training Assignments - Users can only INSERT if they have A1+A2 complete
CREATE POLICY a3_training_assignments_insert_requires_a1_a2
  ON a3_training_assignments
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND (
      EXISTS (
        SELECT 1 FROM a1_identity 
        WHERE user_id = auth.uid()
      )
      AND
      EXISTS (
        SELECT 1 FROM a2_user_task_completions
        WHERE user_id = auth.uid()
        LIMIT 1
      )
    )
  );

-- A3 Interview 0 Progress - Users can only INSERT if they have A1+A2 complete
CREATE POLICY a3_interview_0_progress_insert_requires_a1_a2
  ON a3_interview_0_progress
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND (
      EXISTS (
        SELECT 1 FROM a1_identity 
        WHERE user_id = auth.uid()
      )
      AND
      EXISTS (
        SELECT 1 FROM a2_user_task_completions
        WHERE user_id = auth.uid()
        LIMIT 1
      )
    )
  );

-- A3 Route Progression - Users can only INSERT if they have A1+A2 complete
CREATE POLICY a3_route_progression_insert_requires_a1_a2
  ON a3_route_progression
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND (
      EXISTS (
        SELECT 1 FROM a1_identity 
        WHERE user_id = auth.uid()
      )
      AND
      EXISTS (
        SELECT 1 FROM a2_user_task_completions
        WHERE user_id = auth.uid()
        LIMIT 1
      )
    )
  );

-- A3 Training Module Completions - Users can only INSERT if they have A1+A2 complete
CREATE POLICY a3_training_module_completions_insert_requires_a1_a2
  ON a3_training_module_completions
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND (
      EXISTS (
        SELECT 1 FROM a1_identity 
        WHERE user_id = auth.uid()
      )
      AND
      EXISTS (
        SELECT 1 FROM a2_user_task_completions
        WHERE user_id = auth.uid()
        LIMIT 1
      )
    )
  );

-- A3 User Progress - Users can only INSERT if they have A1+A2 complete
CREATE POLICY a3_user_progress_insert_requires_a1_a2
  ON a3_user_progress
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND (
      EXISTS (
        SELECT 1 FROM a1_identity 
        WHERE user_id = auth.uid()
      )
      AND
      EXISTS (
        SELECT 1 FROM a2_user_task_completions
        WHERE user_id = auth.uid()
        LIMIT 1
      )
    )
  );

-- ====================================
-- A4 (STRATEGIC DOCUMENTS) - Requires A1+A2+A3 Complete
-- ====================================

-- A4 Documents Extended - Users can only INSERT if they have A1+A2+A3 complete
CREATE POLICY a4_documents_extended_insert_requires_a1_a2_a3
  ON a4_documents_extended
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND (
      EXISTS (
        SELECT 1 FROM a1_identity 
        WHERE user_id = auth.uid()
      )
      AND
      EXISTS (
        SELECT 1 FROM a2_user_task_completions
        WHERE user_id = auth.uid()
        LIMIT 1
      )
      AND
      EXISTS (
        SELECT 1 FROM a3_module_completion
        WHERE user_id = auth.uid()
        LIMIT 1
      )
    )
  );

-- A4 Module Progress - Users can only INSERT if they have A1+A2+A3 complete
CREATE POLICY a4_module_progress_insert_requires_a1_a2_a3
  ON a4_module_progress
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND (
      EXISTS (
        SELECT 1 FROM a1_identity 
        WHERE user_id = auth.uid()
      )
      AND
      EXISTS (
        SELECT 1 FROM a2_user_task_completions
        WHERE user_id = auth.uid()
        LIMIT 1
      )
      AND
      EXISTS (
        SELECT 1 FROM a3_module_completion
        WHERE user_id = auth.uid()
        LIMIT 1
      )
    )
  );

-- A4 Strategic Score - Users can only INSERT if they have A1+A2+A3 complete
CREATE POLICY a4_strategic_score_insert_requires_a1_a2_a3
  ON a4_strategic_score
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND (
      EXISTS (
        SELECT 1 FROM a1_identity 
        WHERE user_id = auth.uid()
      )
      AND
      EXISTS (
        SELECT 1 FROM a2_user_task_completions
        WHERE user_id = auth.uid()
        LIMIT 1
      )
      AND
      EXISTS (
        SELECT 1 FROM a3_module_completion
        WHERE user_id = auth.uid()
        LIMIT 1
      )
    )
  );

-- A4 Strategic Score History - Users can only INSERT if they have A1+A2+A3 complete
CREATE POLICY a4_strategic_score_history_insert_requires_a1_a2_a3
  ON a4_strategic_score_history
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND (
      EXISTS (
        SELECT 1 FROM a1_identity 
        WHERE user_id = auth.uid()
      )
      AND
      EXISTS (
        SELECT 1 FROM a2_user_task_completions
        WHERE user_id = auth.uid()
        LIMIT 1
      )
      AND
      EXISTS (
        SELECT 1 FROM a3_module_completion
        WHERE user_id = auth.uid()
        LIMIT 1
      )
    )
  );

-- A4 Engagement Tracking - Users can only INSERT if they have A1+A2+A3 complete
CREATE POLICY a4_engagement_tracking_insert_requires_a1_a2_a3
  ON a4_engagement_tracking
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND (
      EXISTS (
        SELECT 1 FROM a1_identity 
        WHERE user_id = auth.uid()
      )
      AND
      EXISTS (
        SELECT 1 FROM a2_user_task_completions
        WHERE user_id = auth.uid()
        LIMIT 1
      )
      AND
      EXISTS (
        SELECT 1 FROM a3_module_completion
        WHERE user_id = auth.uid()
        LIMIT 1
      )
    )
  );

-- ====================================
-- SERVICE ROLE BYPASS
-- ====================================
-- Service role bypasses RLS for admin operations
-- No additional policies needed as service role has full access by default

-- ====================================
-- ENABLE RLS ON TABLES (if not already enabled)
-- ====================================
ALTER TABLE a2_user_route_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE a2_day1_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE a2_user_bitacora ENABLE ROW LEVEL SECURITY;
ALTER TABLE a2_user_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE a2_user_sprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE a2_market_signals ENABLE ROW LEVEL SECURITY;

ALTER TABLE a3_module_completion ENABLE ROW LEVEL SECURITY;
ALTER TABLE a3_session_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE a3_training_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE a3_interview_0_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE a3_route_progression ENABLE ROW LEVEL SECURITY;
ALTER TABLE a3_training_module_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE a3_user_progress ENABLE ROW LEVEL SECURITY;

ALTER TABLE a4_documents_extended ENABLE ROW LEVEL SECURITY;
ALTER TABLE a4_module_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE a4_strategic_score ENABLE ROW LEVEL SECURITY;
ALTER TABLE a4_strategic_score_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE a4_engagement_tracking ENABLE ROW LEVEL SECURITY;
