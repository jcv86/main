-- Assertions for disposable Wave 3 migration verification.
do $verify$
declare
  target_table text;
  policy_count integer;
  fn_security_definer boolean;
begin
  foreach target_table in array array['brain_feedback','successful_patterns'] loop
    if not (select c.relrowsecurity from pg_class c where c.oid = format('public.%I', target_table)::regclass) then
      raise exception 'RLS not enabled on %', target_table;
    end if;
    if has_table_privilege('anon', format('public.%I', target_table), 'select')
       or has_table_privilege('authenticated', format('public.%I', target_table), 'select')
       or has_table_privilege('authenticated', format('public.%I', target_table), 'insert') then
      raise exception 'Server-only table still exposed: %', target_table;
    end if;
    select count(*) into policy_count
      from pg_policy where polrelid = format('public.%I', target_table)::regclass;
    if policy_count <> 0 then
      raise exception 'Server-only table unexpectedly has client policy: %', target_table;
    end if;
  end loop;

  foreach target_table in array array[
    'cerebro_conversation_memory','cerebro_feedback_learning','cerebro_predictive_insights',
    'cerebro_reasoning_chains','cerebro_user_patterns','user_chilevalora_interactions',
    'user_journey_progress','cv_data'
  ] loop
    if not has_table_privilege('authenticated', format('public.%I', target_table), 'select') then
      raise exception 'UUID owner table missing authenticated grant: %', target_table;
    end if;
    if not exists (
      select 1 from pg_policy
      where polrelid = format('public.%I', target_table)::regclass
        and polname = target_table || '_owner_all'
    ) then
      raise exception 'UUID owner policy missing: %', target_table;
    end if;
  end loop;

  if to_regprocedure('public.get_user_reading_stats(text)') is null then
    raise exception 'Expected text reading-stats function missing';
  end if;
  select p.prosecdef into fn_security_definer
    from pg_proc p where p.oid = 'public.get_user_reading_stats(text)'::regprocedure;
  if fn_security_definer then
    raise exception 'Text reading-stats function must be SECURITY INVOKER';
  end if;
  if has_function_privilege('anon', 'public.get_user_reading_stats(text)', 'execute') then
    raise exception 'Anon can execute text reading-stats function';
  end if;
  if not has_function_privilege('authenticated', 'public.get_user_reading_stats(text)', 'execute') then
    raise exception 'Authenticated role cannot execute text reading-stats function';
  end if;
  if has_function_privilege('authenticated', 'public.get_user_reading_stats(uuid)', 'execute') then
    raise exception 'Authenticated role can still execute legacy UUID reading-stats function';
  end if;
end
$verify$;

select 'wave3_disposable_schema_pass' as verdict;
