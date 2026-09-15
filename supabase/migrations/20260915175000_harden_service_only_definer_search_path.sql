-- Wave 6: pin the remaining service-only SECURITY DEFINER search paths.
-- Production preflight on 2026-09-15 confirmed all 37 functions below:
--   * are SECURITY DEFINER;
--   * are not executable by anon/authenticated;
--   * are executable only through controlled server/service paths;
--   * have no active trigger binding;
--   * are owned by postgres.
--
-- `pg_catalog, public, pg_temp` preserves legacy unqualified public-object
-- resolution while removing caller/session-controlled search_path behavior.
-- Browser roles cannot CREATE in public on DTCFINAL.

alter function public.add_admin_email(text, text)
  set search_path = pg_catalog, public, pg_temp;
alter function public.check_user_prerequisites(uuid, text[])
  set search_path = pg_catalog, public, pg_temp;
alter function public.cleanup_old_notifications()
  set search_path = pg_catalog, public, pg_temp;
alter function public.create_notification(uuid, text, text, text, text, text, text, text)
  set search_path = pg_catalog, public, pg_temp;
alter function public.create_reminder_notification(uuid, text, text, text)
  set search_path = pg_catalog, public, pg_temp;
alter function public.ensure_user_profile(uuid, text)
  set search_path = pg_catalog, public, pg_temp;
alter function public.ensure_user_session(uuid)
  set search_path = pg_catalog, public, pg_temp;
alter function public.generate_job_recommendations(uuid)
  set search_path = pg_catalog, public, pg_temp;
alter function public.get_books_with_progress(uuid)
  set search_path = pg_catalog, public, pg_temp;
alter function public.get_notification_stats(uuid)
  set search_path = pg_catalog, public, pg_temp;
alter function public.get_recent_achievements(uuid, integer)
  set search_path = pg_catalog, public, pg_temp;
alter function public.get_recommended_books(uuid)
  set search_path = pg_catalog, public, pg_temp;
alter function public.get_user_book_progress(uuid, uuid)
  set search_path = pg_catalog, public, pg_temp;
alter function public.get_user_dashboard_data(uuid)
  set search_path = pg_catalog, public, pg_temp;
alter function public.get_user_progress_summary(uuid)
  set search_path = pg_catalog, public, pg_temp;
alter function public.get_user_reading_stats(uuid)
  set search_path = pg_catalog, public, pg_temp;
alter function public.get_user_role(text)
  set search_path = pg_catalog, public, pg_temp;
alter function public.get_user_stats(uuid)
  set search_path = pg_catalog, public, pg_temp;
alter function public.handle_new_user()
  set search_path = pg_catalog, public, pg_temp;
alter function public.initialize_new_user()
  set search_path = pg_catalog, public, pg_temp;
alter function public.initialize_user_data()
  set search_path = pg_catalog, public, pg_temp;
alter function public.is_admin_email(text)
  set search_path = pg_catalog, public, pg_temp;
alter function public.is_admin(uuid)
  set search_path = pg_catalog, public, pg_temp;
alter function public.mark_all_notifications_as_read()
  set search_path = pg_catalog, public, pg_temp;
alter function public.mark_all_notifications_as_read(uuid)
  set search_path = pg_catalog, public, pg_temp;
alter function public.mark_notification_as_read(uuid, uuid)
  set search_path = pg_catalog, public, pg_temp;
alter function public.mark_notification_as_read(uuid)
  set search_path = pg_catalog, public, pg_temp;
alter function public.notify_achievement_unlocked(uuid, text, text)
  set search_path = pg_catalog, public, pg_temp;
alter function public.notify_evaluation_completed()
  set search_path = pg_catalog, public, pg_temp;
alter function public.notify_new_job_opportunity(uuid, text, text, text)
  set search_path = pg_catalog, public, pg_temp;
alter function public.remove_admin_email(text)
  set search_path = pg_catalog, public, pg_temp;
alter function public.update_progress_flag(uuid, character varying, boolean)
  set search_path = pg_catalog, public, pg_temp;
alter function public.update_user_book_progress(uuid, uuid, integer, integer, integer, text, integer)
  set search_path = pg_catalog, public, pg_temp;
alter function public.update_user_progress(uuid, character varying, integer, json)
  set search_path = pg_catalog, public, pg_temp;
alter function public.update_user_progress(uuid, text, integer, json)
  set search_path = pg_catalog, public, pg_temp;
alter function public.update_user_progress(uuid, text, integer, jsonb)
  set search_path = pg_catalog, public, pg_temp;
alter function public.user_has_permission(uuid, text)
  set search_path = pg_catalog, public, pg_temp;
