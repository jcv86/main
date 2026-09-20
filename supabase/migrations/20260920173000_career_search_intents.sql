create table if not exists public.career_search_intents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'Mi búsqueda principal' check (length(trim(name)) between 1 and 80),
  target_roles jsonb not null default '[]'::jsonb,
  breadth text not null default 'related' check (breadth in ('precise','related','exploratory')),
  locations jsonb not null default '[]'::jsonb,
  work_modes jsonb not null default '[]'::jsonb,
  industries jsonb not null default '[]'::jsonb,
  excluded_industries jsonb not null default '[]'::jsonb,
  seniority_min text,
  salary_min_clp integer check (salary_min_clp is null or salary_min_clp >= 0),
  employment_types jsonb not null default '[]'::jsonb,
  languages jsonb not null default '[]'::jsonb,
  is_primary boolean not null default false,
  is_active boolean not null default true,
  source text not null default 'user_confirmed' check (source in ('user_confirmed','career_identity_seeded')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (jsonb_typeof(target_roles)='array' and jsonb_array_length(target_roles) > 0),
  check (jsonb_typeof(locations)='array'),
  check (jsonb_typeof(work_modes)='array')
);
create unique index if not exists career_search_intents_one_primary_idx on public.career_search_intents(user_id) where is_primary and is_active;
create index if not exists career_search_intents_user_active_idx on public.career_search_intents(user_id,is_active,updated_at desc);
alter table public.career_search_intents enable row level security;
create policy career_search_intents_owner_all on public.career_search_intents for all to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
grant select,insert,update,delete on public.career_search_intents to authenticated;
drop trigger if exists set_career_search_intents_updated_at on public.career_search_intents;
create trigger set_career_search_intents_updated_at before update on public.career_search_intents for each row execute function public.set_career_updated_at();
comment on table public.career_search_intents is 'User-confirmed job search directions. Provider categories are derived downstream and are never the user-facing intent.';
