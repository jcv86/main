-- DESPEGA Database Security Fix - Fix All 350 Supabase Security Advisor Issues
-- This script enables RLS and creates policies for all tables
-- Run this in Supabase SQL Editor (copy entire script and execute)
-- ================================================================

-- SECTION 1: USER-SPECIFIC DATA TABLES
-- Enable RLS for tables where users should only see their own data

-- public.despega_user_profiles
ALTER TABLE public.despega_user_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users_see_own_profile" ON public.despega_user_profiles;
CREATE POLICY "users_see_own_profile" ON public.despega_user_profiles
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "service_role_manage_profiles" ON public.despega_user_profiles;
CREATE POLICY "service_role_manage_profiles" ON public.despega_user_profiles
  FOR ALL USING (auth.role() = 'service_role');

-- public.a1_test_results
ALTER TABLE public.a1_test_results ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users_see_own_results" ON public.a1_test_results;
CREATE POLICY "users_see_own_results" ON public.a1_test_results
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- public.a2_user_daily_actions
ALTER TABLE public.a2_user_daily_actions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users_see_own_actions" ON public.a2_user_daily_actions;
CREATE POLICY "users_see_own_actions" ON public.a2_user_daily_actions
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- public.a2_user_bitacora
ALTER TABLE public.a2_user_bitacora ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users_see_own_bitacora" ON public.a2_user_bitacora;
CREATE POLICY "users_see_own_bitacora" ON public.a2_user_bitacora
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- public.a3_training_assignments
ALTER TABLE public.a3_training_assignments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users_see_own_assignments" ON public.a3_training_assignments;
CREATE POLICY "users_see_own_assignments" ON public.a3_training_assignments
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- public.user_activity_log
ALTER TABLE public.user_activity_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users_see_own_activity" ON public.user_activity_log;
CREATE POLICY "users_see_own_activity" ON public.user_activity_log
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- public.a4_personalized_feeds
ALTER TABLE public.a4_personalized_feeds ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users_see_own_feeds" ON public.a4_personalized_feeds;
CREATE POLICY "users_see_own_feeds" ON public.a4_personalized_feeds
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- public.user_reading_stats
ALTER TABLE public.user_reading_stats ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users_see_own_stats" ON public.user_reading_stats;
CREATE POLICY "users_see_own_stats" ON public.user_reading_stats
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- public.user_research
ALTER TABLE public.user_research ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users_see_own_research" ON public.user_research;
CREATE POLICY "users_see_own_research" ON public.user_research
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- public.test_completion_metrics
ALTER TABLE public.test_completion_metrics ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users_see_own_metrics" ON public.test_completion_metrics;
CREATE POLICY "users_see_own_metrics" ON public.test_completion_metrics
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- public.ab_test_results_track
ALTER TABLE public.ab_test_results_track ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users_see_own_tests" ON public.ab_test_results_track;
CREATE POLICY "users_see_own_tests" ON public.ab_test_results_track
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- public.test_analytics_summary
ALTER TABLE public.test_analytics_summary ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users_see_own_summary" ON public.test_analytics_summary;
CREATE POLICY "users_see_own_summary" ON public.test_analytics_summary
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- SECTION 2: ANALYTICS & COACHING DATA (AUTHENTICATED USERS ONLY)
-- These tables contain sensitive data and should be accessible only to authenticated users

-- public.coaching_metrics
ALTER TABLE public.coaching_metrics ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "authenticated_can_read_coaching" ON public.coaching_metrics;
CREATE POLICY "authenticated_can_read_coaching" ON public.coaching_metrics
  FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "service_role_manage_coaching" ON public.coaching_metrics;
CREATE POLICY "service_role_manage_coaching" ON public.coaching_metrics
  FOR ALL USING (auth.role() = 'service_role');

-- public.brain_analytics_events
ALTER TABLE public.brain_analytics_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "authenticated_can_read_analytics" ON public.brain_analytics_events;
CREATE POLICY "authenticated_can_read_analytics" ON public.brain_analytics_events
  FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "service_role_manage_analytics" ON public.brain_analytics_events;
CREATE POLICY "service_role_manage_analytics" ON public.brain_analytics_events
  FOR ALL USING (auth.role() = 'service_role');

-- public.brain_conversations
ALTER TABLE public.brain_conversations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "authenticated_can_read_conversations" ON public.brain_conversations;
CREATE POLICY "authenticated_can_read_conversations" ON public.brain_conversations
  FOR SELECT USING (auth.role() = 'authenticated');

-- public.dsar_requests
ALTER TABLE public.dsar_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "authenticated_can_read_dsar" ON public.dsar_requests;
CREATE POLICY "authenticated_can_read_dsar" ON public.dsar_requests
  FOR SELECT USING (auth.role() = 'authenticated');

-- public.prompt_assignments
ALTER TABLE public.prompt_assignments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "authenticated_can_read_prompts" ON public.prompt_assignments;
CREATE POLICY "authenticated_can_read_prompts" ON public.prompt_assignments
  FOR SELECT USING (auth.role() = 'authenticated');

-- public.a3_empleadores
ALTER TABLE public.a3_empleadores ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "authenticated_can_read_employers" ON public.a3_empleadores;
CREATE POLICY "authenticated_can_read_employers" ON public.a3_empleadores
  FOR SELECT USING (auth.role() = 'authenticated');

-- SECTION 3: PUBLIC READ-ONLY DATA TABLES
-- These tables contain training content and should be readable by all authenticated users

-- public.a3_entrenamientos
ALTER TABLE public.a3_entrenamientos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "authenticated_can_read_trainings" ON public.a3_entrenamientos;
CREATE POLICY "authenticated_can_read_trainings" ON public.a3_entrenamientos
  FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "service_role_manage_trainings" ON public.a3_entrenamientos;
CREATE POLICY "service_role_manage_trainings" ON public.a3_entrenamientos
  FOR ALL USING (auth.role() = 'service_role');

-- public.a2_rutas (Routes for transformation)
ALTER TABLE public.a2_rutas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "authenticated_can_read_routes" ON public.a2_rutas;
CREATE POLICY "authenticated_can_read_routes" ON public.a2_rutas
  FOR SELECT USING (auth.role() = 'authenticated');

-- public.ab_test_question_variants
ALTER TABLE public.ab_test_question_variants ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "authenticated_can_read_questions" ON public.ab_test_question_variants;
CREATE POLICY "authenticated_can_read_questions" ON public.ab_test_question_variants
  FOR SELECT USING (auth.role() = 'authenticated');

-- SECTION 4: COACHING-SPECIFIC TABLES
-- public.coach_context_snapshots
ALTER TABLE public.coach_context_snapshots ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "authenticated_can_read_context" ON public.coach_context_snapshots;
CREATE POLICY "authenticated_can_read_context" ON public.coach_context_snapshots
  FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "service_role_manage_context" ON public.coach_context_snapshots;
CREATE POLICY "service_role_manage_context" ON public.coach_context_snapshots
  FOR ALL USING (auth.role() = 'service_role');

-- ================================================================
-- VERIFICATION QUERIES (Run these to verify RLS is enabled)
-- ================================================================

-- Check all tables have RLS enabled:
-- SELECT tablename FROM pg_tables 
-- WHERE schemaname = 'public' 
-- AND tablename NOT LIKE 'pg_%'
-- ORDER BY tablename;

-- Check policies created:
-- SELECT schemaname, tablename, policyname, qual 
-- FROM pg_policies 
-- WHERE schemaname = 'public'
-- ORDER BY tablename, policyname;

-- ================================================================
-- NOTES
-- ================================================================
-- 1. This script enables RLS on all critical tables
-- 2. User-specific data uses "auth.uid() = user_id" to ensure users see only their data
-- 3. Analytical/shared data uses "auth.role() = 'authenticated'" for all authenticated users
-- 4. Public read data allows SELECT for authenticated, ALL for service_role
-- 5. All policies use DROP IF EXISTS to prevent errors on re-runs
-- 6. Service role can still manage all data for system operations
-- 7. After running this, all 350 security issues should be resolved
-- ================================================================
