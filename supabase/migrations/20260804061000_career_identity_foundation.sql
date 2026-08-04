-- Additive Career Identity foundation. Existing A1-A4 and legacy career_goals tables remain untouched.
create extension if not exists pgcrypto;

create table if not exists public.career_identities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  version integer not null default 1 check (version > 0),
  career_stage text,
  industry text,
  experience_level text,
  target_roles jsonb not null default '[]'::jsonb,
  target_companies jsonb not null default '[]'::jsonb,
  strengths jsonb not null default '[]'::jsonb,
  growth_areas jsonb not null default '[]'::jsonb,
  values_profile jsonb not null default '{}'::jsonb,
  motivators jsonb not null default '[]'::jsonb,
  communication_profile jsonb not null default '{}'::jsonb,
  leadership_profile jsonb not null default '{}'::jsonb,
  interview_profile jsonb not null default '{}'::jsonb,
  learning_profile jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.career_identity_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  identity_id uuid not null references public.career_identities(id) on delete cascade,
  title text not null check (length(trim(title)) > 0),
  description text,
  status text not null default 'active' check (status in ('active','paused','completed','archived')),
  priority smallint not null default 3 check (priority between 1 and 5),
  target_date date,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.career_skills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  identity_id uuid not null references public.career_identities(id) on delete cascade,
  skill_key text not null check (skill_key ~ '^[a-z0-9][a-z0-9._-]*$'),
  label text not null check (length(trim(label)) > 0),
  score numeric(5,2) check (score between 0 and 100),
  confidence numeric(5,2) not null default 0 check (confidence between 0 and 100),
  trend text not null default 'unknown' check (trend in ('declining','stable','improving','unknown')),
  evidence_count integer not null default 0 check (evidence_count >= 0),
  last_evaluated_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, skill_key)
);

create table if not exists public.career_skill_edges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source_skill_id uuid not null references public.career_skills(id) on delete cascade,
  target_skill_id uuid not null references public.career_skills(id) on delete cascade,
  relationship text not null check (relationship in ('supports','depends_on','transfers_to','conflicts_with','correlates_with')),
  weight numeric(5,4) not null default 0.5 check (weight between -1 and 1),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (source_skill_id, target_skill_id, relationship),
  check (source_skill_id <> target_skill_id)
);

create table if not exists public.career_evidence (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  identity_id uuid not null references public.career_identities(id) on delete cascade,
  skill_id uuid references public.career_skills(id) on delete set null,
  source_module text not null check (source_module in ('a0','a1','a2','a3','a4','profile','agent','import','system')),
  source_type text not null check (length(trim(source_type)) > 0),
  source_ref text,
  assertion text not null check (length(trim(assertion)) > 0),
  value jsonb not null default '{}'::jsonb,
  confidence numeric(5,2) not null default 50 check (confidence between 0 and 100),
  observed_at timestamptz not null default now(),
  expires_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  check (expires_at is null or expires_at > observed_at)
);

create table if not exists public.career_memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  identity_id uuid not null references public.career_identities(id) on delete cascade,
  memory_type text not null check (memory_type in ('fact','preference','goal','constraint','pattern','decision','context')),
  key text not null check (length(trim(key)) > 0),
  content jsonb not null,
  importance numeric(5,2) not null default 50 check (importance between 0 and 100),
  confidence numeric(5,2) not null default 50 check (confidence between 0 and 100),
  valid_from timestamptz not null default now(),
  valid_until timestamptz,
  superseded_by uuid references public.career_memories(id) on delete set null,
  source_evidence_id uuid references public.career_evidence(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  check (valid_until is null or valid_until > valid_from)
);

create table if not exists public.career_profile_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  identity_id uuid not null references public.career_identities(id) on delete cascade,
  version integer not null check (version > 0),
  snapshot jsonb not null,
  reason text not null check (length(trim(reason)) > 0),
  created_at timestamptz not null default now(),
  unique (identity_id, version)
);

create table if not exists public.career_agent_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  identity_id uuid references public.career_identities(id) on delete set null,
  agent_id text not null check (length(trim(agent_id)) > 0),
  agent_version text not null check (length(trim(agent_version)) > 0),
  source_module text not null check (source_module in ('a0','a1','a2','a3','a4','profile','agent','import','system')),
  correlation_id text not null check (length(trim(correlation_id)) > 0),
  operation text not null check (length(trim(operation)) > 0),
  entity_type text not null check (length(trim(entity_type)) > 0),
  entity_id uuid,
  outcome text not null check (outcome in ('accepted','rejected','failed')),
  payload jsonb not null default '{}'::jsonb,
  error_code text,
  created_at timestamptz not null default now()
);

create index if not exists career_identity_goals_user_status_idx on public.career_identity_goals(user_id, status);
create index if not exists career_skills_user_idx on public.career_skills(user_id);
create index if not exists career_skill_edges_user_idx on public.career_skill_edges(user_id);
create index if not exists career_evidence_user_observed_idx on public.career_evidence(user_id, observed_at desc);
create index if not exists career_memories_user_key_idx on public.career_memories(user_id, key);
create index if not exists career_snapshots_identity_idx on public.career_profile_snapshots(identity_id, version desc);
create index if not exists career_agent_events_correlation_idx on public.career_agent_events(user_id, correlation_id, created_at desc);

create or replace function public.set_career_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_career_identities_updated_at on public.career_identities;
create trigger set_career_identities_updated_at before update on public.career_identities for each row execute function public.set_career_updated_at();
drop trigger if exists set_career_identity_goals_updated_at on public.career_identity_goals;
create trigger set_career_identity_goals_updated_at before update on public.career_identity_goals for each row execute function public.set_career_updated_at();
drop trigger if exists set_career_skills_updated_at on public.career_skills;
create trigger set_career_skills_updated_at before update on public.career_skills for each row execute function public.set_career_updated_at();

alter table public.career_identities enable row level security;
alter table public.career_identity_goals enable row level security;
alter table public.career_skills enable row level security;
alter table public.career_skill_edges enable row level security;
alter table public.career_evidence enable row level security;
alter table public.career_memories enable row level security;
alter table public.career_profile_snapshots enable row level security;
alter table public.career_agent_events enable row level security;

create policy career_identities_owner_all on public.career_identities for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy career_identity_goals_owner_all on public.career_identity_goals for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy career_skills_owner_all on public.career_skills for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy career_skill_edges_owner_all on public.career_skill_edges for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy career_evidence_owner_all on public.career_evidence for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy career_memories_owner_all on public.career_memories for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy career_profile_snapshots_owner_all on public.career_profile_snapshots for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy career_agent_events_owner_select on public.career_agent_events for select to authenticated using ((select auth.uid()) = user_id);
create policy career_agent_events_owner_insert on public.career_agent_events for insert to authenticated with check ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.career_identities, public.career_identity_goals, public.career_skills, public.career_skill_edges, public.career_evidence, public.career_memories, public.career_profile_snapshots to authenticated;
grant select, insert on public.career_agent_events to authenticated;

comment on table public.career_identity_goals is 'Career Identity goals isolated from the legacy public.career_goals table.';
comment on table public.career_agent_events is 'Append-only audit trail for Career Identity agent writes and rejected operations.';
