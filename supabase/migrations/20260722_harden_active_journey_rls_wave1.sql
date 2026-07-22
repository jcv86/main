-- Harden active A1-A4 journey and progress tables with UUID ownership.
-- This migration is idempotent and intentionally excludes catalogs and email-owned legacy tables.

do $$
declare
  target_table text;
  private_tables constant text[] := array[
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
  foreach target_table in array private_tables loop
    if exists (
      select 1
      from information_schema.columns as columns
      where columns.table_schema = 'public'
        and columns.table_name = target_table
        and columns.column_name = 'user_id'
        and columns.udt_name = 'uuid'
    ) then
      execute format('alter table public.%I enable row level security', target_table);

      if not exists (
        select 1
        from pg_policies as policies
        where policies.schemaname = 'public'
          and policies.tablename = target_table
          and policies.policyname = target_table || '_owner_all'
      ) then
        execute format(
          'create policy %I on public.%I for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id)',
          target_table || '_owner_all',
          target_table
        );
      end if;
    end if;
  end loop;
end
$$;
