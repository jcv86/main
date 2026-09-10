-- P3: keep active public catalogs readable while restricting writes to server-side service_role clients.

begin;

do $preflight$
declare
  target_table text;
  table_owner text;
begin
  foreach target_table in array array['biblioteca', 'knowledge_base'] loop
    if to_regclass(format('public.%I', target_table)) is null then
      raise exception 'P3 RLS preflight failed: public.% is missing', target_table;
    end if;
    select pg_get_userbyid(c.relowner) into table_owner
      from pg_class c join pg_namespace n on n.oid = c.relnamespace
     where n.nspname = 'public' and c.relname = target_table and c.relkind in ('r', 'p');
    if table_owner is null or table_owner in ('anon', 'authenticated', 'service_role') then
      raise exception 'P3 RLS preflight failed: unsafe owner % for public.%', table_owner, target_table;
    end if;
  end loop;

  if (select count(*) from pg_policies where schemaname = 'public' and tablename = 'knowledge_base') <> 0 then
    raise exception 'P3 RLS preflight failed: unexpected knowledge_base policy inventory';
  end if;
  if (select count(*) from pg_policies where schemaname = 'public' and tablename = 'biblioteca') <> 4
     or exists (
       select 1 from pg_policies where schemaname = 'public' and tablename = 'biblioteca'
        and not (
          roles = array['public']::name[] and (
            (policyname in ('Users can view biblioteca', 'biblioteca_readable_by_all') and cmd = 'SELECT' and qual = 'true' and with_check is null)
            or (policyname = 'biblioteca_insertable_by_auth' and cmd = 'INSERT' and qual is null and with_check = '(auth.role() = ''authenticated''::text)')
            or (policyname = 'biblioteca_updateable_by_auth' and cmd = 'UPDATE' and qual = '(auth.role() = ''authenticated''::text)' and with_check is null)
          )
        )
     ) then
    raise exception 'P3 RLS preflight failed: unexpected biblioteca policy inventory';
  end if;
  if to_regclass('public.knowledge_base_id_seq') is null then
    raise exception 'P3 RLS preflight failed: knowledge_base_id_seq is missing';
  end if;
end
$preflight$;

alter table public.biblioteca enable row level security;
drop policy if exists "Users can view biblioteca" on public.biblioteca;
drop policy if exists biblioteca_insertable_by_auth on public.biblioteca;
drop policy if exists biblioteca_readable_by_all on public.biblioteca;
drop policy if exists biblioteca_updateable_by_auth on public.biblioteca;
drop policy if exists biblioteca_public_read on public.biblioteca;
create policy biblioteca_public_read on public.biblioteca for select to anon, authenticated using (true);
revoke all on table public.biblioteca from public, anon, authenticated;
grant select on table public.biblioteca to anon, authenticated;

alter table public.knowledge_base enable row level security;
drop policy if exists knowledge_base_public_read on public.knowledge_base;
create policy knowledge_base_public_read on public.knowledge_base for select to anon, authenticated using (true);
revoke all on table public.knowledge_base from public, anon, authenticated;
grant select on table public.knowledge_base to anon, authenticated;
revoke all on sequence public.knowledge_base_id_seq from public, anon, authenticated;

commit;

-- Manual rollback: supabase/rollbacks/20260910120000_harden_active_public_catalogs_p3.sql
