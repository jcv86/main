-- Canonical A1-A4 journey foundation recovered from the live DTC schema and current runtime contract.
-- Additive and idempotent: no production execution is performed by this commit.

create table if not exists public.despega_user_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.despega_user_profiles
  add column if not exists onboarding_completed boolean default false,
  add column if not exists onboarding_cerebral_completed boolean default false,
  add column if not exists onboarding_conozcamonos_1_completed boolean default false,
  add column if not exists a1_test_completed boolean default false,
  add column if not exists a1_test_completed_at timestamptz,
  add column if not exists a1_cerebral_intro_seen boolean default false,
  add column if not exists a1_cerebral_completed boolean default false,
  add column if not exists a1_results_saved boolean default false,
  add column if not exists a1_report_seen boolean default false,
  add column if not exists conozcamonos_2_completed boolean default false,
  add column if not exists a2_intro_seen boolean default false,
  add column if not exists a2_route_generated boolean default false,
  add column if not exists a2_missions_started boolean default false,
  add column if not exists a3_intro_seen boolean default false,
  add column if not exists a3_intro_completed boolean default false,
  add column if not exists a3_entrevista_0_completed boolean default false,
  add column if not exists a3_training_started boolean default false,
  add column if not exists a3_unlocked boolean default false,
  add column if not exists a4_unlocked boolean default false;

create unique index if not exists despega_user_profiles_user_id_uidx
  on public.despega_user_profiles(user_id);

create table if not exists public.despega_journey_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  current_module text not null default 'A1',
  current_a2_day integer not null default 1,
  highest_a2_day_unlocked integer not null default 1,
  a1_completed_at timestamptz,
  a2_started_at timestamptz,
  a2_completed_at timestamptz,
  a3_unlocked_at timestamptz,
  a4_unlocked_at timestamptz,
  version integer not null default 1,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.despega_journey_state
  add column if not exists current_module text not null default 'A1',
  add column if not exists current_a2_day integer not null default 1,
  add column if not exists highest_a2_day_unlocked integer not null default 1,
  add column if not exists a1_completed_at timestamptz,
  add column if not exists a2_started_at timestamptz,
  add column if not exists a2_completed_at timestamptz,
  add column if not exists a3_unlocked_at timestamptz,
  add column if not exists a4_unlocked_at timestamptz,
  add column if not exists version integer not null default 1,
  add column if not exists metadata jsonb not null default '{}'::jsonb,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create unique index if not exists despega_journey_state_user_id_uidx
  on public.despega_journey_state(user_id);
