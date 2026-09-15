-- Assertions for Wave 6 fixed SECURITY DEFINER search paths.
do $verify$
declare
  sig text;
  fn_oid oid;
  config_text text;
begin
  foreach sig in array array[
    'public.add_admin_email(text,text)','public.check_user_prerequisites(uuid,text[])','public.cleanup_old_notifications()',
    'public.create_notification(uuid,text,text,text,text,text,text,text)','public.create_reminder_notification(uuid,text,text,text)',
    'public.ensure_user_profile(uuid,text)','public.ensure_user_session(uuid)','public.generate_job_recommendations(uuid)',
    'public.get_books_with_progress(uuid)','public.get_notification_stats(uuid)','public.get_recent_achievements(uuid,integer)',
    'public.get_recommended_books(uuid)','public.get_user_book_progress(uuid,uuid)','public.get_user_dashboard_data(uuid)',
    'public.get_user_progress_summary(uuid)','public.get_user_reading_stats(uuid)','public.get_user_role(text)',
    'public.get_user_stats(uuid)','public.handle_new_user()','public.initialize_new_user()','public.initialize_user_data()',
    'public.is_admin_email(text)','public.is_admin(uuid)','public.mark_all_notifications_as_read()',
    'public.mark_all_notifications_as_read(uuid)','public.mark_notification_as_read(uuid,uuid)',
    'public.mark_notification_as_read(uuid)','public.notify_achievement_unlocked(uuid,text,text)',
    'public.notify_evaluation_completed()','public.notify_new_job_opportunity(uuid,text,text,text)',
    'public.remove_admin_email(text)','public.update_progress_flag(uuid,character varying,boolean)',
    'public.update_user_book_progress(uuid,uuid,integer,integer,integer,text,integer)',
    'public.update_user_progress(uuid,character varying,integer,json)','public.update_user_progress(uuid,text,integer,json)',
    'public.update_user_progress(uuid,text,integer,jsonb)','public.user_has_permission(uuid,text)'
  ] loop
    fn_oid := to_regprocedure(sig);
    if fn_oid is null then
      raise exception 'missing fixture function %', sig;
    end if;

    select array_to_string(proconfig, ',') into config_text from pg_proc where oid = fn_oid;
    if config_text is null or position('search_path=pg_catalog, public, pg_temp' in config_text) = 0 then
      raise exception 'search_path not pinned for %: %', sig, config_text;
    end if;
    if not (select prosecdef from pg_proc where oid = fn_oid) then
      raise exception '% lost SECURITY DEFINER', sig;
    end if;
    if has_function_privilege('anon', fn_oid, 'execute') then
      raise exception 'anon execute unexpectedly enabled on %', sig;
    end if;
    if has_function_privilege('authenticated', fn_oid, 'execute') then
      raise exception 'authenticated execute unexpectedly enabled on %', sig;
    end if;
    if not has_function_privilege('service_role', fn_oid, 'execute') then
      raise exception 'service_role execute missing on %', sig;
    end if;
  end loop;
end
$verify$;

select 'wave6_service_only_definer_search_path_pass' as verdict;
