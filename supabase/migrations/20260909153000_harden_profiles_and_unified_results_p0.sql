-- P0: close public profile access and public writes to legacy assessment results.
-- Production shape verified read-only on 2026-09-09 before authoring this migration.
-- The preflight block deliberately aborts the transaction on schema drift.

begin;

do $preflight$
declare
  target_table text;
  table_owner text;
begin
  foreach target_table in array array['profiles', 'unified_test_results'] loop
    if to_regclass(format('public.%I', target_table)) is null then
      raise exception 'P0 RLS preflight failed: public.% is missing', target_table;
    end if;

    select pg_get_userbyid(c.relowner)
      into table_owner
      from pg_class c
      join pg_namespace n on n.oid = c.relnamespace
     where n.nspname = 'public'
       and c.relname = target_table
       and c.relkind in ('r', 'p');

    if table_owner is null or table_owner in ('anon', 'authenticated', 'service_role') then
      raise exception 'P0 RLS preflight failed: unsafe owner % for public.%', table_owner, target_table;
    end if;
  end loop;

  if not exists (
    select 1 from information_schema.columns
     where table_schema = 'public' and table_name = 'profiles'
       and column_name = 'id' and udt_name = 'uuid' and is_nullable = 'NO'
  ) then
    raise exception 'P0 RLS preflight failed: profiles.id must be a non-null uuid owner key';
  end if;

  if not exists (
    select 1 from information_schema.columns
     where table_schema = 'public' and table_name = 'unified_test_results'
       and column_name = 'user_email' and udt_name in ('text', 'varchar') and is_nullable = 'NO'
  ) then
    raise exception 'P0 RLS preflight failed: unified_test_results.user_email must be non-null text/varchar';
  end if;
end
$preflight$;

alter table public.profiles enable row level security;

drop policy if exists "Public access" on public.profiles;
drop policy if exists "Enable insert for authenticated users only" on public.profiles;
drop policy if exists "Service role full access to profiles" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists profiles_owner_select on public.profiles;
drop policy if exists profiles_owner_insert on public.profiles;
drop policy if exists profiles_owner_update on public.profiles;

create policy profiles_owner_select
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = id);

create policy profiles_owner_insert
  on public.profiles for insert
  to authenticated
  with check ((select auth.uid()) is not null and (select auth.uid()) = id);

create policy profiles_owner_update
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = id)
  with check ((select auth.uid()) is not null and (select auth.uid()) = id);

revoke all on table public.profiles from anon, authenticated;
grant select, insert, update on table public.profiles to authenticated;

alter table public.unified_test_results enable row level security;

drop policy if exists "System can insert test results" on public.unified_test_results;
drop policy if exists "Users can view own test results" on public.unified_test_results;
drop policy if exists unified_test_results_owner_select on public.unified_test_results;

create policy unified_test_results_owner_select
  on public.unified_test_results for select
  to authenticated
  using (
    (select auth.uid()) is not null
    and lower(user_email::text) = lower((select auth.jwt() ->> 'email'))
  );

revoke all on table public.unified_test_results from anon, authenticated;
grant select on table public.unified_test_results to authenticated;

commit;

-- Rollback is intentionally not embedded as executable SQL here. See the paired
-- supabase/rollbacks/20260909153000_harden_profiles_and_unified_results_p0.sql.
