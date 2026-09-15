-- Assertions for residual privileged RPC hardening.
do $verify$
declare
  fn text;
  config_text text;
begin
  -- The one live authenticated API remains callable by signed-in users and
  -- service role, but never anon/PUBLIC.
  if has_function_privilege('anon', 'public.complete_a2_mission(uuid,jsonb)', 'execute') then
    raise exception 'anon can still execute complete_a2_mission';
  end if;
  if not has_function_privilege('authenticated', 'public.complete_a2_mission(uuid,jsonb)', 'execute') then
    raise exception 'authenticated lost complete_a2_mission';
  end if;
  if not has_function_privilege('service_role', 'public.complete_a2_mission(uuid,jsonb)', 'execute') then
    raise exception 'service_role lost complete_a2_mission';
  end if;
  select array_to_string(p.proconfig, ',') into config_text
    from pg_proc p where p.oid = 'public.complete_a2_mission(uuid,jsonb)'::regprocedure;
  if config_text is null or config_text like '%public%' then
    raise exception 'complete_a2_mission search_path not hardened: %', config_text;
  end if;

  -- Browser roles must not execute retired/server-only RPCs.
  foreach fn in array array[
    'public.cleanup_old_notifications()',
    'public.complete_a2_day(integer,jsonb)',
    'public.get_recent_achievements(uuid,integer)',
    'public.get_recommended_books(uuid)',
    'public.mark_all_notifications_as_read()',
    'public.mark_all_notifications_as_read(uuid)',
    'public.mark_notification_as_read(uuid)',
    'public.notify_evaluation_completed()',
    'public.user_has_permission(uuid,text)',
    'public.handle_new_auth_user()',
    'public.handle_new_user()',
    'public.handle_oauth_user()',
    'public.handle_oauth_user_creation()',
    'public.initialize_new_user()',
    'public.initialize_user_data()'
  ] loop
    if has_function_privilege('anon', fn, 'execute') then
      raise exception 'anon execute remains on %', fn;
    end if;
    if has_function_privilege('authenticated', fn, 'execute') then
      raise exception 'authenticated execute remains on %', fn;
    end if;
  end loop;

  -- Controlled server access remains available where explicitly retained.
  foreach fn in array array[
    'public.cleanup_old_notifications()',
    'public.complete_a2_day(integer,jsonb)',
    'public.get_recent_achievements(uuid,integer)',
    'public.get_recommended_books(uuid)',
    'public.mark_all_notifications_as_read()',
    'public.mark_all_notifications_as_read(uuid)',
    'public.mark_notification_as_read(uuid)',
    'public.notify_evaluation_completed()',
    'public.user_has_permission(uuid,text)'
  ] loop
    if not has_function_privilege('service_role', fn, 'execute') then
      raise exception 'service_role execute missing on %', fn;
    end if;
  end loop;

  if not has_function_privilege('supabase_auth_admin', 'public.handle_oauth_user_creation()', 'execute') then
    raise exception 'supabase_auth_admin cannot execute active auth trigger function';
  end if;
  select array_to_string(p.proconfig, ',') into config_text
    from pg_proc p where p.oid = 'public.handle_oauth_user_creation()'::regprocedure;
  if config_text is null or config_text like '%public%' then
    raise exception 'handle_oauth_user_creation search_path not hardened: %', config_text;
  end if;
end
$verify$;

-- Trigger execution is independent from browser RPC EXECUTE grants once the
-- trigger exists. Exercise the trigger after the revokes; the explicit ACL
-- assertion above separately proves supabase_auth_admin retains EXECUTE.
begin;
insert into public.wave4_trigger_probe(note) values ('trigger-still-runs');
rollback;

select 'wave4_residual_rpc_surface_pass' as verdict;
