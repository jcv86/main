-- P0: close confirmed legacy auth/token/admin Data API exposure and RPC IDORs.
-- Deliberately narrow: objects with uncertain active dependencies are deferred.

do $migration$
begin
  if to_regclass('public.accounts') is not null then
    alter table public.accounts enable row level security;
    drop policy if exists "Allow all operations on accounts for NextAuth" on public.accounts;
    drop policy if exists "Allow authenticated users to view own accounts" on public.accounts;
    revoke all privileges on table public.accounts from anon;
    revoke insert, update, delete, truncate, references, trigger, maintain on table public.accounts from authenticated;
    grant select on table public.accounts to authenticated;
    create policy accounts_owner_select
      on public.accounts for select to authenticated
      using ((select auth.uid()) = user_id);
  end if;

  if to_regclass('public.sessions') is not null then
    alter table public.sessions enable row level security;
    drop policy if exists "Allow all operations on sessions for NextAuth" on public.sessions;
    drop policy if exists "Allow authenticated users to view own sessions" on public.sessions;
    revoke all privileges on table public.sessions from anon, authenticated;
  end if;

  if to_regclass('public.verification_tokens') is not null then
    alter table public.verification_tokens enable row level security;
    drop policy if exists "Allow all operations on verification tokens for NextAuth" on public.verification_tokens;
    revoke all privileges on table public.verification_tokens from anon, authenticated;
  end if;

  if to_regclass('public.admin_emails') is not null then
    alter table public.admin_emails enable row level security;
    drop policy if exists "Anyone can view admin emails" on public.admin_emails;
    drop policy if exists "Only admins can manage admin emails" on public.admin_emails;
    revoke all privileges on table public.admin_emails from anon, authenticated;
  end if;

  if to_regclass('public.user_roles') is not null then
    alter table public.user_roles enable row level security;
    drop policy if exists "Admins can manage roles" on public.user_roles;
    drop policy if exists "Admins can view all roles" on public.user_roles;
    drop policy if exists "Users can view their own roles" on public.user_roles;
    revoke all privileges on table public.user_roles from anon, authenticated;
  end if;
end
$migration$;

-- These SECURITY DEFINER functions accept an arbitrary user/email target and
-- do not bind it to auth.uid(), or mutate privileged state without an auth
-- check. No active application callsite depends on direct client execution.
revoke execute on function public.add_admin_email(text, text) from public, anon, authenticated;
revoke execute on function public.remove_admin_email(text) from public, anon, authenticated;
revoke execute on function public.create_notification(uuid, text, text, text, text, text, text, text) from public, anon, authenticated;
revoke execute on function public.create_reminder_notification(uuid, text, text, text) from public, anon, authenticated;
revoke execute on function public.ensure_user_profile(uuid, text) from public, anon, authenticated;
revoke execute on function public.ensure_user_session(uuid) from public, anon, authenticated;
revoke execute on function public.generate_job_recommendations(uuid) from public, anon, authenticated;
revoke execute on function public.get_books_with_progress(uuid) from public, anon, authenticated;
revoke execute on function public.get_notification_stats(uuid) from public, anon, authenticated;
revoke execute on function public.get_user_book_progress(uuid, uuid) from public, anon, authenticated;
revoke execute on function public.get_user_cv_data(uuid) from public, anon, authenticated;
revoke execute on function public.get_user_dashboard_data(uuid) from public, anon, authenticated;
revoke execute on function public.get_user_progress_summary(uuid) from public, anon, authenticated;
revoke execute on function public.get_user_role(text) from public, anon, authenticated;
revoke execute on function public.get_user_stats(uuid) from public, anon, authenticated;
revoke execute on function public.is_admin(uuid) from public, anon, authenticated;
revoke execute on function public.is_admin_email(text) from public, anon, authenticated;
revoke execute on function public.mark_notification_as_read(uuid, uuid) from public, anon, authenticated;
revoke execute on function public.notify_achievement_unlocked(uuid, text, text) from public, anon, authenticated;
revoke execute on function public.notify_new_job_opportunity(uuid, text, text, text) from public, anon, authenticated;
revoke execute on function public.update_progress_flag(uuid, varchar, boolean) from public, anon, authenticated;
revoke execute on function public.update_user_book_progress(uuid, uuid, integer, integer, integer, text, integer) from public, anon, authenticated;
revoke execute on function public.update_user_progress(uuid, varchar, integer, json) from public, anon, authenticated;
revoke execute on function public.update_user_progress(uuid, text, integer, json) from public, anon, authenticated;
revoke execute on function public.update_user_progress(uuid, text, integer, jsonb) from public, anon, authenticated;
