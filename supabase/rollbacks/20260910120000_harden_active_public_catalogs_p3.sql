-- MANUAL BREAK-GLASS ROLLBACK ONLY. Restores the insecure pre-P3 browser-write posture.

begin;
drop policy if exists biblioteca_public_read on public.biblioteca;
create policy "Users can view biblioteca" on public.biblioteca for select to public using (true);
create policy biblioteca_insertable_by_auth on public.biblioteca for insert to public with check (auth.role() = 'authenticated');
create policy biblioteca_readable_by_all on public.biblioteca for select to public using (true);
create policy biblioteca_updateable_by_auth on public.biblioteca for update to public using (auth.role() = 'authenticated');
alter table public.biblioteca disable row level security;
grant all on table public.biblioteca to anon, authenticated;

drop policy if exists knowledge_base_public_read on public.knowledge_base;
alter table public.knowledge_base disable row level security;
grant all on table public.knowledge_base to anon, authenticated;
grant usage on sequence public.knowledge_base_id_seq to anon, authenticated;
commit;
