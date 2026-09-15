-- Wave 4: close the residual SECURITY DEFINER RPC surface identified by the
-- 2026-09-15 read-only DTCFINAL advisor/preflight.
--
-- Rules:
-- 1. Functions with no active application callsite are removed from client
--    Data API execution while preserving service-role access where useful.
-- 2. Trigger functions are not callable by browser roles. The one active
--    auth.users trigger keeps explicit supabase_auth_admin execution.
-- 3. complete_a2_mission remains an authenticated API because the current
--    server route calls it with the user's JWT and the function binds all
--    mutations to auth.uid(). Anonymous execution is removed and search_path
--    is pinned to an empty path; all relations in its body are schema-qualified.

-- Active authenticated RPC: keep only the roles that actually need it.
revoke execute on function public.complete_a2_mission(uuid, jsonb) from public, anon;
grant execute on function public.complete_a2_mission(uuid, jsonb) to authenticated, service_role;
alter function public.complete_a2_mission(uuid, jsonb) set search_path = '';

-- Retired/no-callsite client RPCs. Keep service-role execution for controlled
-- server/admin use without leaving a browser-facing endpoint.
revoke execute on function public.cleanup_old_notifications() from public, anon, authenticated;
grant execute on function public.cleanup_old_notifications() to service_role;

revoke execute on function public.complete_a2_day(integer, jsonb) from public, anon, authenticated;
grant execute on function public.complete_a2_day(integer, jsonb) to service_role;
alter function public.complete_a2_day(integer, jsonb) set search_path = '';

revoke execute on function public.get_recent_achievements(uuid, integer) from public, anon, authenticated;
grant execute on function public.get_recent_achievements(uuid, integer) to service_role;

revoke execute on function public.get_recommended_books(uuid) from public, anon, authenticated;
grant execute on function public.get_recommended_books(uuid) to service_role;

revoke execute on function public.mark_all_notifications_as_read() from public, anon, authenticated;
grant execute on function public.mark_all_notifications_as_read() to service_role;

revoke execute on function public.mark_all_notifications_as_read(uuid) from public, anon, authenticated;
grant execute on function public.mark_all_notifications_as_read(uuid) to service_role;

revoke execute on function public.mark_notification_as_read(uuid) from public, anon, authenticated;
grant execute on function public.mark_notification_as_read(uuid) to service_role;

revoke execute on function public.notify_evaluation_completed() from public, anon, authenticated;
grant execute on function public.notify_evaluation_completed() to service_role;

revoke execute on function public.user_has_permission(uuid, text) from public, anon, authenticated;
grant execute on function public.user_has_permission(uuid, text) to service_role;

-- Trigger-only legacy functions do not belong on the Data API. Six of these
-- currently have no trigger binding; handle_oauth_user_creation is the one
-- active AFTER INSERT trigger on auth.users in DTCFINAL.
revoke execute on function public.handle_new_auth_user() from public, anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.handle_oauth_user() from public, anon, authenticated;
revoke execute on function public.handle_oauth_user_creation() from public, anon, authenticated;
revoke execute on function public.initialize_new_user() from public, anon, authenticated;
revoke execute on function public.initialize_user_data() from public, anon, authenticated;

grant execute on function public.handle_oauth_user_creation() to supabase_auth_admin;
-- Its body already qualifies all tables as public.*; remove public from the
-- lookup path while keeping pg_catalog built-ins implicitly available.
alter function public.handle_oauth_user_creation() set search_path = '';
