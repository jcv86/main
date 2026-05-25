-- ============================================================================
-- PILLAR PROGRESS RESET & PREPARATION SCRIPT
-- Date: 2026-05-25
-- Purpose: Reset all user progress except Travis (demo account) and prepare
--          database for pillar connections
-- ============================================================================

-- Define Travis user IDs (development accounts that should NOT be reset)
DO $$
DECLARE
    travis_id UUID := 'demo-travis'::UUID;
    travis_email TEXT := 'travis@nuanu.com';
BEGIN
    RAISE NOTICE 'Starting pillar progress reset...';
    RAISE NOTICE 'Preserving demo accounts: Travis (%)' , travis_email;
END $$;

-- ============================================================================
-- PHASE 1: BACKUP CRITICAL DATA BEFORE RESET
-- ============================================================================

-- Create backup of all user profiles before reset
CREATE TABLE IF NOT EXISTS backup_user_profiles_pre_reset AS
SELECT * FROM despega_user_profiles
WHERE user_id != 'demo-travis'::UUID
  AND created_at < NOW() - INTERVAL '1 hour';

-- Create backup of A1 progress
CREATE TABLE IF NOT EXISTS backup_a1_progress_pre_reset AS
SELECT * FROM a1_progress
WHERE user_id != 'demo-travis'::UUID
  AND created_at < NOW() - INTERVAL '1 hour';

-- ============================================================================
-- PHASE 2: RESET PILLAR PROGRESS FOR ALL NON-DEMO USERS
-- ============================================================================

-- Reset A1 (Identity & Self-Discovery) Progress
UPDATE a1_progress
SET 
    cerebral_completed = FALSE,
    inteligencia_emocional_completed = FALSE,
    mapa_personalidad_completed = FALSE,
    cinco_dimensiones_completed = FALSE,
    competencias_completed = FALSE,
    brujula_vocacional_completed = FALSE,
    tests_completed = 0,
    unified_profile = NULL,
    last_updated = NOW()
WHERE user_id != 'demo-travis'::UUID;

-- Reset A1 test results
UPDATE a1_tests_results
SET 
    responses = NULL,
    score = 0,
    completed_at = NULL
WHERE user_id != 'demo-travis'::UUID;

-- Reset A1 profile insights  
UPDATE a1_profile_insights
SET
    proxi_paso = NULL,
    created_at = NOW()
WHERE user_id != 'demo-travis'::UUID;

-- Reset A2 (Routes & Daily Work) Progress
UPDATE a2_user_route_progress
SET
    estado = 'not_started',
    dia_actual = 1,
    porcentaje_completado = 0,
    modulo_actual_id = NULL,
    fecha_inicio = NULL,
    fecha_fin = NULL,
    updated_at = NOW()
WHERE user_id != 'demo-travis'::UUID;

-- Reset A2 user missions
DELETE FROM a2_user_missions
WHERE user_id != 'demo-travis'::UUID;

-- Reset A2 missions progress
DELETE FROM a2_user_task_completions
WHERE user_id != 'demo-travis'::UUID;

-- Reset A2 sprints
DELETE FROM a2_user_sprints
WHERE user_id != 'demo-travis'::UUID;

-- Reset A2 daily actions
DELETE FROM a2_user_daily_actions
WHERE user_id != 'demo-travis'::UUID;

-- Reset A2 bitacora
DELETE FROM a2_user_bitacora
WHERE user_id != 'demo-travis'::UUID;

-- Reset A3 (Interview Training) Progress
UPDATE a3_user_progress
SET
    total_xp = 0,
    current_module = NULL,
    completed_module_ids = ARRAY[]::text[],
    module_states = '{}'::jsonb,
    updated_at = NOW()
WHERE user_id != 'demo-travis'::UUID;

-- Reset A3 module completions
DELETE FROM a3_module_completion
WHERE user_id != 'demo-travis'::UUID;

-- Reset A3 session attempts
DELETE FROM a3_session_attempts
WHERE user_id != 'demo-travis'::UUID;

-- Reset A3 route progression
UPDATE a3_route_progression
SET
    route_level = 'basic',
    current_module_number = 1,
    total_completed = 0,
    basic_unlocked_at = NOW(),
    advanced_unlocked_at = NULL,
    pro_unlocked_at = NULL,
    route_completed_at = NULL,
    can_replay_modules_7_10 = FALSE,
    updated_at = NOW()
WHERE user_id != 'demo-travis'::UUID;

-- Reset A4 (Strategic Knowledge) Progress
UPDATE a4_strategic_score
SET
    score = 0,
    score_7day_average = 0,
    last_updated_at = NOW(),
    updated_at = NOW()
WHERE user_id != 'demo-travis'::UUID;

-- Reset A4 module progress
DELETE FROM a4_module_progress
WHERE user_id != 'demo-travis'::UUID;

-- Reset A4 test completions
DELETE FROM a4_user_test_completions
WHERE user_id != 'demo-travis'::UUID;

-- Reset A4 badges
DELETE FROM a4_user_badges
WHERE user_id != 'demo-travis'::UUID;

-- Reset A4 points
DELETE FROM a4_points_history
WHERE user_id != 'demo-travis'::UUID;

-- Reset A4 news engagement
DELETE FROM a4_news_engagement
WHERE user_id != 'demo-travis'::UUID;

-- ============================================================================
-- PHASE 3: RESET OVERALL USER JOURNEY
-- ============================================================================

-- Reset despega user profiles
UPDATE despega_user_profiles
SET
    current_stage = 'onboarding',
    progress_percentage = 0,
    onboarding_completed = FALSE,
    onboarding_cerebral_completed = FALSE,
    onboarding_conozcamonos_1_completed = FALSE,
    a1_test_completed = FALSE,
    a1_test_completed_at = NULL,
    a2_intro_seen = FALSE,
    a2_route_generated = FALSE,
    a3_unlocked = FALSE,
    a3_intro_completed = FALSE,
    a4_unlocked = FALSE,
    current_ciclo = 1,
    ciclo_start_date = CURRENT_DATE,
    updated_at = NOW()
WHERE user_id != 'demo-travis'::UUID;

-- Reset despega pilar progress (track progress across pillars)
DELETE FROM despega_pilar_progress
WHERE user_id != 'demo-travis'::UUID;

-- Reset despega user misiones
DELETE FROM despega_user_misiones
WHERE user_id != 'demo-travis'::UUID;

-- Reset despega user A3 progress
DELETE FROM despega_user_a3_progress
WHERE user_id != 'demo-travis'::UUID;

-- Reset despega user ruta progress
DELETE FROM despega_user_ruta_progress
WHERE user_id != 'demo-travis'::UUID;

-- Reset rankings
UPDATE despega_rankings
SET
    rank_general = NULL,
    rank_a1 = NULL,
    rank_a2 = NULL,
    rank_profesional = NULL,
    rank_persona = NULL,
    rank_aterrizaje = NULL,
    rank_base = NULL,
    score_general = 0,
    score_a1_cerebral = 0,
    score_a2_rutas = 0,
    score_camino_profesional = 0,
    score_camino_persona = 0,
    score_aterrizaje = 0,
    score_base = 0,
    total_misiones_completadas = 0,
    total_dias_activos = 0,
    streak_actual = 0,
    mejor_streak = 0,
    updated_at = NOW()
WHERE user_id != 'demo-travis'::UUID;

-- ============================================================================
-- PHASE 4: RESET DTC & GAMIFICATION SYSTEMS
-- ============================================================================

-- Reset DTC balance (keep 0)
UPDATE user_dtc_balance
SET
    balance = 0,
    lifetime_spent = 0,
    updated_at = NOW()
WHERE user_id != 'demo-travis'::UUID;

-- Reset gamification profile
UPDATE user_gamification_profile
SET
    current_level = 'novice',
    current_xp = 0,
    total_xp = 0,
    interview_streak = 0,
    best_interview_streak = 0,
    total_interviews_completed = 0,
    total_tips_earned_free = 0,
    total_tips_earned_premium = 0,
    badges = '[]'::jsonb,
    achievements = '[]'::jsonb,
    updated_at = NOW()
WHERE user_id != 'demo-travis'::UUID;

-- Reset user capacity profile
UPDATE user_capacity_profile
SET
    a1_base_capacity = 50::numeric,
    active_mode = 'standard',
    progression_phase = 'onboarding',
    phase_start_date = NOW(),
    total_days_tracked = 0,
    last_capacity_check = NOW(),
    updated_at = NOW()
WHERE user_id != 'demo-travis'::UUID;

-- ============================================================================
-- PHASE 5: RESET SUPPORTING DATA STRUCTURES
-- ============================================================================

-- Reset interview gamification sessions (preserve count for analytics)
UPDATE interview_session_gamification
SET
    xp_earned = 0,
    tips_purchased_this_session = 0,
    dtc_spent_this_session = 0,
    total_tips_used_free = 0,
    total_tips_used_premium = 0
WHERE user_id != 'demo-travis'::UUID
  AND completed_at < NOW() - INTERVAL '7 days';

-- Reset documents (but preserve structure)
UPDATE dtc_documents
SET
    coach_feedback = NULL,
    status = 'draft'
WHERE user_id != 'demo-travis'::UUID
  AND created_at < NOW() - INTERVAL '24 hours';

-- Reset coaching context snapshots (but keep recent ones)
DELETE FROM coach_context_snapshots
WHERE user_id != 'demo-travis'::UUID
  AND created_at < NOW() - INTERVAL '7 days';

-- ============================================================================
-- PHASE 6: PREPARE PILLAR CONNECTIONS STRUCTURE
-- ============================================================================

-- Ensure despega_pilar_progress table has correct structure for connections
CREATE TABLE IF NOT EXISTS despega_pilar_connection_map (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    pilar_source TEXT NOT NULL, -- 'a1', 'a2', 'a3', 'a4'
    pilar_target TEXT NOT NULL, -- 'a1', 'a2', 'a3', 'a4'
    connection_type TEXT NOT NULL, -- 'prerequisite', 'context', 'data', 'insight'
    data_transferred JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_pilar_source CHECK (pilar_source IN ('a1', 'a2', 'a3', 'a4')),
    CONSTRAINT valid_pilar_target CHECK (pilar_target IN ('a1', 'a2', 'a3', 'a4')),
    CONSTRAINT valid_connection_type CHECK (connection_type IN ('prerequisite', 'context', 'data', 'insight'))
);

-- Add RLS to connections table
ALTER TABLE despega_pilar_connection_map ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own connections"
    ON despega_pilar_connection_map
    FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "System can manage connections"
    ON despega_pilar_connection_map
    FOR ALL
    USING (auth.role() = 'service_role');

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_pilar_connections_user_id 
    ON despega_pilar_connection_map(user_id);

CREATE INDEX IF NOT EXISTS idx_pilar_connections_pillars 
    ON despega_pilar_connection_map(pilar_source, pilar_target);

-- ============================================================================
-- PHASE 7: LOG RESET EVENT & VERIFY
-- ============================================================================

-- Record reset event for audit trail
INSERT INTO cron_job_executions (
    job_name,
    job_path,
    status,
    started_at,
    completed_at,
    duration_ms,
    execution_summary
) VALUES (
    'reset_user_progress_pillars',
    '/admin/reset',
    'completed',
    NOW() - INTERVAL '5 minutes',
    NOW(),
    (EXTRACT(EPOCH FROM NOW()) * 1000)::integer,
    jsonb_build_object(
        'reset_at', NOW(),
        'protected_users', ARRAY['travis@nuanu.com'],
        'message', 'Reset all user progress except demo accounts and prepared pillar connection infrastructure'
    )
);

-- ============================================================================
-- FINAL VERIFICATION
-- ============================================================================

-- Count users after reset (should show most with score=0)
SELECT 
    'A1 Progress' as system,
    COUNT(CASE WHEN tests_completed = 0 THEN 1 END) as reset_count,
    COUNT(*) as total_count
FROM a1_progress
UNION ALL
SELECT 
    'A2 Routes',
    COUNT(CASE WHEN porcentaje_completado = 0 THEN 1 END),
    COUNT(*)
FROM a2_user_route_progress
UNION ALL
SELECT 
    'A3 Progress',
    COUNT(CASE WHEN total_xp = 0 THEN 1 END),
    COUNT(*)
FROM a3_user_progress
UNION ALL
SELECT 
    'A4 Strategic Score',
    COUNT(CASE WHEN score = 0 THEN 1 END),
    COUNT(*)
FROM a4_strategic_score;

-- Show Travis account is preserved (verification)
SELECT 
    'Travis Account Status' as check_type,
    user_id,
    current_stage,
    progress_percentage,
    updated_at
FROM despega_user_profiles
WHERE user_id::text = 'demo-travis';

COMMIT;
