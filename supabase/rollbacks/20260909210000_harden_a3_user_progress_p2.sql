-- MANUAL BREAK-GLASS ROLLBACK ONLY.
-- Recreates the insecure posture observed before P2. Apply only to recover a
-- confirmed regression, then replace it immediately with corrected hardening.

begin;

drop policy if exists a3_user_progress_owner_select on public.a3_user_progress;
drop policy if exists a3_user_progress_owner_insert on public.a3_user_progress;
drop policy if exists a3_user_progress_owner_update on public.a3_user_progress;

create policy "Users can view own A3 progress"
  on public.a3_user_progress for select to public
  using (true);
create policy "Users can insert own A3 progress"
  on public.a3_user_progress for insert to public
  with check (true);
create policy "Users can update own A3 progress"
  on public.a3_user_progress for update to public
  using (true);

grant all on table public.a3_user_progress to anon, authenticated;

commit;
