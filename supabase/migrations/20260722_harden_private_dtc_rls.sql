-- Enable RLS only on existing private DTC tables that expose a user_id column.
-- Existing ownership policies remain intact. This migration is idempotent.

do $$
declare
  target_table text;
  private_tables constant text[] := array[
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
    'interview_sessions'
  ];
begin
  foreach target_table in array private_tables loop
    if exists (
      select 1
      from information_schema.columns as columns
      where columns.table_schema = 'public'
        and columns.table_name = target_table
        and columns.column_name = 'user_id'
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
