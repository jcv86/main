-- P1: protect legacy personal data and make public catalog tables read-only.
-- Preflight aborts on schema drift so this migration fails closed.

begin;

do $preflight$
declare
  target_table text;
  table_owner text;
begin
  foreach target_table in array array['test_results', 'user_profiles', 'books', 'a4_noticias'] loop
    if to_regclass(format('public.%I', target_table)) is null then
      raise exception 'P1 RLS preflight failed: public.% is missing', target_table;
    end if;

    select pg_get_userbyid(c.relowner)
      into table_owner
      from pg_class c
      join pg_namespace n on n.oid = c.relnamespace
     where n.nspname = 'public'
       and c.relname = target_table
       and c.relkind in ('r', 'p');

    if table_owner is null or table_owner in ('anon', 'authenticated', 'service_role') then
      raise exception 'P1 RLS preflight failed: unsafe owner % for public.%', table_owner, target_table;
    end if;
  end loop;

  if not exists (
    select 1 from information_schema.columns
     where table_schema = 'public' and table_name = 'test_results'
       and column_name = 'user_email' and udt_name in ('text', 'varchar') and is_nullable = 'NO'
  ) then
    raise exception 'P1 RLS preflight failed: test_results.user_email must be non-null text/varchar';
  end if;

  if not exists (
    select 1 from information_schema.columns
     where table_schema = 'public' and table_name = 'user_profiles'
       and column_name = 'email' and udt_name in ('text', 'varchar') and is_nullable = 'NO'
  ) then
    raise exception 'P1 RLS preflight failed: user_profiles.email must be non-null text/varchar';
  end if;
end
$preflight$;

alter table public.test_results enable row level security;
drop policy if exists test_results_owner_select on public.test_results;
drop policy if exists test_results_owner_insert on public.test_results;
drop policy if exists test_results_owner_update on public.test_results;

create policy test_results_owner_select
  on public.test_results for select to authenticated
  using (
    (select auth.uid()) is not null
    and lower(user_email::text) = lower((select auth.jwt() ->> 'email'))
  );
create policy test_results_owner_insert
  on public.test_results for insert to authenticated
  with check (
    (select auth.uid()) is not null
    and lower(user_email::text) = lower((select auth.jwt() ->> 'email'))
  );
create policy test_results_owner_update
  on public.test_results for update to authenticated
  using (
    (select auth.uid()) is not null
    and lower(user_email::text) = lower((select auth.jwt() ->> 'email'))
  )
  with check (
    (select auth.uid()) is not null
    and lower(user_email::text) = lower((select auth.jwt() ->> 'email'))
  );

revoke all on table public.test_results from anon, authenticated;
grant select, insert, update on table public.test_results to authenticated;
revoke all on sequence public.test_results_id_seq from anon, authenticated;
grant usage, select on sequence public.test_results_id_seq to authenticated;

alter table public.user_profiles enable row level security;
drop policy if exists user_profiles_owner_select on public.user_profiles;
drop policy if exists user_profiles_owner_insert on public.user_profiles;
drop policy if exists user_profiles_owner_update on public.user_profiles;

create policy user_profiles_owner_select
  on public.user_profiles for select to authenticated
  using (
    (select auth.uid()) is not null
    and lower(email::text) = lower((select auth.jwt() ->> 'email'))
  );
create policy user_profiles_owner_insert
  on public.user_profiles for insert to authenticated
  with check (
    (select auth.uid()) is not null
    and lower(email::text) = lower((select auth.jwt() ->> 'email'))
  );
create policy user_profiles_owner_update
  on public.user_profiles for update to authenticated
  using (
    (select auth.uid()) is not null
    and lower(email::text) = lower((select auth.jwt() ->> 'email'))
  )
  with check (
    (select auth.uid()) is not null
    and lower(email::text) = lower((select auth.jwt() ->> 'email'))
  );

revoke all on table public.user_profiles from anon, authenticated;
grant select, insert, update on table public.user_profiles to authenticated;
revoke all on sequence public.user_profiles_id_seq from anon, authenticated;
grant usage, select on sequence public.user_profiles_id_seq to authenticated;

alter table public.books enable row level security;
drop policy if exists "Books are insertable by authenticated users" on public.books;
drop policy if exists "Books are updatable by authenticated users" on public.books;
drop policy if exists "Books are viewable by everyone" on public.books;
drop policy if exists books_public_read on public.books;
create policy books_public_read
  on public.books for select to anon, authenticated
  using (true);
revoke all on table public.books from anon, authenticated;
grant select on table public.books to anon, authenticated;

alter table public.a4_noticias enable row level security;
drop policy if exists a4_noticias_public_read on public.a4_noticias;
create policy a4_noticias_public_read
  on public.a4_noticias for select to anon, authenticated
  using (true);
revoke all on table public.a4_noticias from anon, authenticated;
grant select on table public.a4_noticias to anon, authenticated;

commit;

-- Manual rollback:
-- supabase/rollbacks/20260909170000_harden_legacy_profiles_results_and_catalogs_p1.sql
