-- MANUAL BREAK-GLASS ROLLBACK ONLY.
-- This recreates the exact policy/grant posture observed before the P0 migration,
-- including the original exposure. Use only to recover a confirmed regression,
-- then reapply a corrected hardening migration immediately.

begin;

drop policy if exists profiles_owner_select on public.profiles;
drop policy if exists profiles_owner_insert on public.profiles;
drop policy if exists profiles_owner_update on public.profiles;

create policy "Enable insert for authenticated users only"
  on public.profiles for insert to public
  with check (auth.uid() = id);
create policy "Public access"
  on public.profiles for all to public
  using (true);
create policy "Service role full access to profiles"
  on public.profiles for all to service_role
  using (true) with check (true);
create policy "Users can update own profile"
  on public.profiles for update to public
  using (auth.uid() = id);
create policy "Users can view own profile"
  on public.profiles for select to public
  using (auth.uid() = id);

grant all on table public.profiles to anon, authenticated;

drop policy if exists unified_test_results_owner_select on public.unified_test_results;
create policy "System can insert test results"
  on public.unified_test_results for insert to public
  with check (true);
create policy "Users can view own test results"
  on public.unified_test_results for select to public
  using (
    user_email::text = (
      select users.email::text from auth.users
       where users.id = auth.uid()
    )
  );

grant all on table public.unified_test_results to anon, authenticated;

commit;
