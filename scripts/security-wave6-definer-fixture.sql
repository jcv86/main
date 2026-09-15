-- Disposable metadata-only fixture for Wave 6.
-- Return values are irrelevant: PostgreSQL identifies functions for ALTER by
-- name + argument types, so these synthetic bodies only reproduce signatures,
-- SECURITY DEFINER state, and server-only execution grants.

create function public.add_admin_email(text,text) returns void language plpgsql security definer as $$ begin null; end $$;
create function public.check_user_prerequisites(uuid,text[]) returns void language plpgsql security definer as $$ begin null; end $$;
create function public.cleanup_old_notifications() returns void language plpgsql security definer as $$ begin null; end $$;
create function public.create_notification(uuid,text,text,text,text,text,text,text) returns void language plpgsql security definer as $$ begin null; end $$;
create function public.create_reminder_notification(uuid,text,text,text) returns void language plpgsql security definer as $$ begin null; end $$;
create function public.ensure_user_profile(uuid,text) returns void language plpgsql security definer as $$ begin null; end $$;
create function public.ensure_user_session(uuid) returns void language plpgsql security definer as $$ begin null; end $$;
create function public.generate_job_recommendations(uuid) returns void language plpgsql security definer as $$ begin null; end $$;
create function public.get_books_with_progress(uuid) returns void language plpgsql security definer as $$ begin null; end $$;
create function public.get_notification_stats(uuid) returns void language plpgsql security definer as $$ begin null; end $$;
create function public.get_recent_achievements(uuid,integer) returns void language plpgsql security definer as $$ begin null; end $$;
create function public.get_recommended_books(uuid) returns void language plpgsql security definer as $$ begin null; end $$;
create function public.get_user_book_progress(uuid,uuid) returns void language plpgsql security definer as $$ begin null; end $$;
create function public.get_user_dashboard_data(uuid) returns void language plpgsql security definer as $$ begin null; end $$;
create function public.get_user_progress_summary(uuid) returns void language plpgsql security definer as $$ begin null; end $$;
create function public.get_user_reading_stats(uuid) returns void language plpgsql security definer as $$ begin null; end $$;
create function public.get_user_role(text) returns void language plpgsql security definer as $$ begin null; end $$;
create function public.get_user_stats(uuid) returns void language plpgsql security definer as $$ begin null; end $$;
create function public.handle_new_user() returns trigger language plpgsql security definer as $$ begin return new; end $$;
create function public.initialize_new_user() returns trigger language plpgsql security definer as $$ begin return new; end $$;
create function public.initialize_user_data() returns trigger language plpgsql security definer as $$ begin return new; end $$;
create function public.is_admin_email(text) returns void language plpgsql security definer as $$ begin null; end $$;
create function public.is_admin(uuid) returns void language plpgsql security definer as $$ begin null; end $$;
create function public.mark_all_notifications_as_read() returns void language plpgsql security definer as $$ begin null; end $$;
create function public.mark_all_notifications_as_read(uuid) returns void language plpgsql security definer as $$ begin null; end $$;
create function public.mark_notification_as_read(uuid,uuid) returns void language plpgsql security definer as $$ begin null; end $$;
create function public.mark_notification_as_read(uuid) returns void language plpgsql security definer as $$ begin null; end $$;
create function public.notify_achievement_unlocked(uuid,text,text) returns void language plpgsql security definer as $$ begin null; end $$;
create function public.notify_evaluation_completed() returns trigger language plpgsql security definer as $$ begin return new; end $$;
create function public.notify_new_job_opportunity(uuid,text,text,text) returns void language plpgsql security definer as $$ begin null; end $$;
create function public.remove_admin_email(text) returns void language plpgsql security definer as $$ begin null; end $$;
create function public.update_progress_flag(uuid,character varying,boolean) returns void language plpgsql security definer as $$ begin null; end $$;
create function public.update_user_book_progress(uuid,uuid,integer,integer,integer,text,integer) returns void language plpgsql security definer as $$ begin null; end $$;
create function public.update_user_progress(uuid,character varying,integer,json) returns void language plpgsql security definer as $$ begin null; end $$;
create function public.update_user_progress(uuid,text,integer,json) returns void language plpgsql security definer as $$ begin null; end $$;
create function public.update_user_progress(uuid,text,integer,jsonb) returns void language plpgsql security definer as $$ begin null; end $$;
create function public.user_has_permission(uuid,text) returns void language plpgsql security definer as $$ begin null; end $$;

do $grants$
declare
  sig text;
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
    execute format('revoke execute on function %s from public, anon, authenticated', sig);
    execute format('grant execute on function %s to service_role', sig);
  end loop;
end
$grants$;
