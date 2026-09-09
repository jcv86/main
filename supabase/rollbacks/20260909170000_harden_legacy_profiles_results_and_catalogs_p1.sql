-- MANUAL BREAK-GLASS ROLLBACK ONLY.
-- Recreates the insecure posture observed before P1. Apply only to recover a
-- confirmed regression, then replace it immediately with corrected hardening.

begin;

drop policy if exists test_results_owner_select on public.test_results;
drop policy if exists test_results_owner_insert on public.test_results;
drop policy if exists test_results_owner_update on public.test_results;
alter table public.test_results disable row level security;
grant all on table public.test_results to anon, authenticated;
grant all on sequence public.test_results_id_seq to anon, authenticated;

drop policy if exists user_profiles_owner_select on public.user_profiles;
drop policy if exists user_profiles_owner_insert on public.user_profiles;
drop policy if exists user_profiles_owner_update on public.user_profiles;
alter table public.user_profiles disable row level security;
grant all on table public.user_profiles to anon, authenticated;
grant all on sequence public.user_profiles_id_seq to anon, authenticated;

drop policy if exists books_public_read on public.books;
create policy "Books are insertable by authenticated users"
  on public.books for insert to public
  with check (auth.role() = 'authenticated');
create policy "Books are updatable by authenticated users"
  on public.books for update to public
  using (auth.role() = 'authenticated');
create policy "Books are viewable by everyone"
  on public.books for select to public
  using (true);
alter table public.books disable row level security;
grant all on table public.books to anon, authenticated;

drop policy if exists a4_noticias_public_read on public.a4_noticias;
alter table public.a4_noticias disable row level security;
grant all on table public.a4_noticias to anon, authenticated;

commit;
