-- P2: isolate the active aggregate A3 progress row by authenticated owner.
-- Preflight aborts on production schema drift so the migration fails closed.

begin;

do $preflight$
declare
  table_owner text;
begin
  if to_regclass('public.a3_user_progress') is null then
    raise exception 'P2 RLS preflight failed: public.a3_user_progress is missing';
  end if;

  select pg_get_userbyid(c.relowner)
    into table_owner
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
   where n.nspname = 'public'
     and c.relname = 'a3_user_progress'
     and c.relkind in ('r', 'p');

  if table_owner is null or table_owner in ('anon', 'authenticated', 'service_role') then
    raise exception 'P2 RLS preflight failed: unsafe owner %', table_owner;
  end if;

  if not exists (
    select 1 from information_schema.columns
     where table_schema = 'public'
       and table_name = 'a3_user_progress'
       and column_name = 'user_id'
       and udt_name in ('text', 'varchar')
       and is_nullable = 'NO'
  ) then
    raise exception 'P2 RLS preflight failed: a3_user_progress.user_id must be non-null text/varchar';
  end if;

  if (select count(*) from pg_policies
       where schemaname = 'public' and tablename = 'a3_user_progress') <> 3
     or exists (
       select 1
         from pg_policies
        where schemaname = 'public'
          and tablename = 'a3_user_progress'
          and not (
            roles = array['public']::name[]
            and (
              (policyname = 'Users can view own A3 progress' and cmd = 'SELECT' and qual = 'true' and with_check is null)
              or (policyname = 'Users can insert own A3 progress' and cmd = 'INSERT' and qual is null and with_check = 'true')
              or (policyname = 'Users can update own A3 progress' and cmd = 'UPDATE' and qual = 'true' and with_check is null)
            )
          )
     ) then
    raise exception 'P2 RLS preflight failed: unexpected a3_user_progress policy inventory';
  end if;
end
$preflight$;

alter table public.a3_user_progress enable row level security;

drop policy if exists "Users can insert own A3 progress" on public.a3_user_progress;
drop policy if exists "Users can update own A3 progress" on public.a3_user_progress;
drop policy if exists "Users can view own A3 progress" on public.a3_user_progress;
drop policy if exists a3_user_progress_owner_select on public.a3_user_progress;
drop policy if exists a3_user_progress_owner_insert on public.a3_user_progress;
drop policy if exists a3_user_progress_owner_update on public.a3_user_progress;

create policy a3_user_progress_owner_select
  on public.a3_user_progress for select to authenticated
  using ((select auth.uid())::text = user_id);

create policy a3_user_progress_owner_insert
  on public.a3_user_progress for insert to authenticated
  with check ((select auth.uid())::text = user_id);

create policy a3_user_progress_owner_update
  on public.a3_user_progress for update to authenticated
  using ((select auth.uid())::text = user_id)
  with check ((select auth.uid())::text = user_id);

revoke all on table public.a3_user_progress from public, anon, authenticated;
grant select, insert, update on table public.a3_user_progress to authenticated;

commit;

-- Manual rollback:
-- supabase/rollbacks/20260909210000_harden_a3_user_progress_p2.sql
