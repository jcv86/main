-- Wave 2: restore read access for the demo (Travis) user and the community leaderboard
-- after RLS hardening, without exposing real users' data.
--
-- 1. Anon/authenticated SELECT policies scoped EXCLUSIVELY to the Travis demo UUID
--    on journey tables the demo mode reads client-side. Travis's data is fictional
--    seed data, so exposing it read-only is safe. All writes remain owner-only.
-- 2. Authenticated global SELECT on despega_rankings (community leaderboard).
--    Writes remain owner-only via despega_rankings_owner_all.

do $$
declare
  target_table text;
  demo_uuid constant uuid := '64738eef-ee31-4da9-8270-9adfa46c74ba';
  demo_readable_tables constant text[] := array[
    -- Wave 0 (private core)
    'despega_user_profiles',
    'despega_pilar_progress',
    'despega_user_misiones',
    'despega_user_ruta_progress',
    'dtc_documents',
    'dtc_activity_artifacts',
    'dtc_test_results',
    'a1_cerebral_assessment',
    'a1_conozcamonos_1',
    'a1_progress',
    'a2_conozcamonos_2',
    'a2_user_route_progress',
    'a3_cv_generado',
    'a3_entrevista_0',
    'a3_entrevistas_sesiones',
    'a3_practicas_simulaciones',
    'interview_sessions',
    -- Wave 1 (active journey)
    'a1_informe_completo',
    'a1_tests_results',
    'a1_unified_report',
    'a2_route_recommendations',
    'a2_rutas_personalizadas',
    'a2_user_actions_completed',
    'a3_entrevista_progreso_ciclos',
    'a3_progreso_entrevistas',
    'a3_scoring_empleadores',
    'a3_user_empleador_match',
    'a3_user_entrevistas',
    'a3_user_progreso',
    'a3_user_videos',
    'a3_video_progreso',
    'a4_despega_radar',
    'a4_document_deployments',
    'a4_document_labels',
    'a4_user_news_engagement',
    'calendar_events',
    'career_goals',
    'daily_capacity',
    'despega_a1_test_results',
    'despega_cerebral_perfil',
    'despega_cerebral_responses',
    'despega_perfil_informe',
    'despega_rankings',
    'dtc_progress_milestones',
    'notifications',
    'user_capacity_profile',
    'user_preferences'
  ];
begin
  foreach target_table in array demo_readable_tables loop
    if not exists (
      select 1 from information_schema.columns as columns
      where columns.table_schema = 'public'
        and columns.table_name = target_table
        and columns.column_name = 'user_id'
        and columns.udt_name = 'uuid'
    ) then
      raise exception 'Expected UUID user_id column missing on public.%', target_table;
    end if;

    if not exists (
      select 1 from pg_policies as policies
      where policies.schemaname = 'public'
        and policies.tablename = target_table
        and policies.policyname = target_table || '_demo_read'
    ) then
      execute format(
        'create policy %I on public.%I for select to anon, authenticated using (user_id = %L::uuid)',
        target_table || '_demo_read', target_table, demo_uuid
      );
    end if;
  end loop;

  -- Community leaderboard: any authenticated user can read all ranking rows.
  if not exists (
    select 1 from pg_policies as policies
    where policies.schemaname = 'public'
      and policies.tablename = 'despega_rankings'
      and policies.policyname = 'despega_rankings_authenticated_read'
  ) then
    create policy despega_rankings_authenticated_read
      on public.despega_rankings for select to authenticated using (true);
  end if;
end
$$;
