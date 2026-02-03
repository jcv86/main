-- Production-Grade A1 Schema (Postgres + Supabase)
-- Features:
-- - cycle_id para evitar pisarse
-- - updated_at triggers
-- - RLS policies
-- - Indexes para queries

create extension if not exists pgcrypto;

-- ============================================
-- 1. CYCLES: A1 corre en ciclos de 30 días
-- ============================================

create table if not exists despega_cycles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  pilar text not null,
  cycle_length_days int not null default 30,
  started_at timestamptz not null default now(),
  ends_at timestamptz not null,
  status text not null default 'active' check (status in ('active', 'completed', 'archived')),
  created_at timestamptz not null default now(),
  unique(user_id, pilar, status) deferrable initially immediate
);

create index if not exists idx_despega_cycles_user_pilar on despega_cycles(user_id, pilar);
create index if not exists idx_despega_cycles_active on despega_cycles(user_id, status);

-- ============================================
-- 2. A1 RESULTS: 1 por check-in (linked to cycle)
-- ============================================

create table if not exists despega_a1_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  cycle_id uuid not null references despega_cycles(id) on delete cascade,

  diagnostic_score_energia int not null check (diagnostic_score_energia >= 0 and diagnostic_score_energia <= 100),
  diagnostic_score_enfoque int not null check (diagnostic_score_enfoque >= 0 and diagnostic_score_enfoque <= 100),
  diagnostic_score_relaciones int not null check (diagnostic_score_relaciones >= 0 and diagnostic_score_relaciones <= 100),
  diagnostic_score_plan_ejecutivo int not null check (diagnostic_score_plan_ejecutivo >= 0 and diagnostic_score_plan_ejecutivo <= 100),
  diagnostic_score_overall int not null check (diagnostic_score_overall >= 0 and diagnostic_score_overall <= 100),

  context_shift_worker boolean not null default false,
  context_caregiving boolean not null default false,
  context_neurodiversity boolean not null default false,
  context_other_approved boolean not null default false,

  created_at timestamptz not null default now()
);

create index if not exists idx_a1_results_user_cycle on despega_a1_results(user_id, cycle_id);

-- ============================================
-- 3. PILAR PROGRESS: 1 fila per user+pilar+cycle
-- ============================================

create table if not exists despega_pilar_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  pilar text not null,
  cycle_id uuid not null references despega_cycles(id) on delete cascade,

  diagnostic_score int not null check (diagnostic_score >= 0 and diagnostic_score <= 100),
  points_accumulated int not null default 0 check (points_accumulated >= 0),
  missions_completed int not null default 0 check (missions_completed >= 0),
  total_missions_in_cycle int not null default 5 check (total_missions_in_cycle > 0),
  progress_pct int not null default 0 check (progress_pct >= 0 and progress_pct <= 100),

  paquete_activo text not null default 'plan_ejecutivo',
  is_unlocked boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique(user_id, pilar, cycle_id)
);

create index if not exists idx_progress_user_pilar on despega_pilar_progress(user_id, pilar);

-- ============================================
-- 4. USER MISSIONS: linked to cycle_id + idempotent
-- ============================================

create table if not exists despega_user_misiones (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  pilar text not null default 'a1_cerebral',
  cycle_id uuid not null references despega_cycles(id) on delete cascade,

  mission_key text not null, -- e.g., 'a1_plan_ejecutivo_01'
  paquete text not null,
  dia_numero int not null check (dia_numero > 0),

  points int not null default 0 check (points >= 0),
  completed boolean not null default false,
  completed_at timestamptz,
  puntos_earned int,
  user_notes text,

  context_adapted_shift boolean not null default false,
  context_adapted_caregiving boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique(user_id, cycle_id, mission_key)
);

create index if not exists idx_user_misiones_user_cycle on despega_user_misiones(user_id, cycle_id);

-- ============================================
-- 5. SCORE EVENTS: timeline para "Mi Evolución"
-- ============================================

create table if not exists despega_score_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  pilar text not null,
  cycle_id uuid not null references despega_cycles(id) on delete cascade,

  event_type text not null check (event_type in ('diagnostic', 'mission_completed', 'cycle_completed')),
  diagnostic_score_at_event int not null default 0,
  points_delta int not null default 0,
  points_total int not null default 0,
  progress_pct_at_event int not null default 0,

  context_flags jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_score_events_user_cycle on despega_score_events(user_id, cycle_id);

-- ============================================
-- 6. CONTEXT VAULT: sensible data + expiry
-- ============================================

create table if not exists despega_context_vault (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  cycle_id uuid not null references despega_cycles(id) on delete cascade,

  context_other_text text,
  consent_given boolean not null default false,
  retention_days int not null default 90 check (retention_days > 0),
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_context_vault_expiry on despega_context_vault(expires_at);

-- ============================================
-- 7. USER PROFILES: extensions para A1 + ranking
-- ============================================

alter table if exists despega_user_profiles
  add column if not exists a1_active_cycle_id uuid references despega_cycles(id);

alter table if exists despega_user_profiles
  add column if not exists ranking_opt_in boolean not null default false;

-- ============================================
-- 8. UPDATED_AT TRIGGER (standard pattern)
-- ============================================

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

drop trigger if exists trg_progress_updated_at on despega_pilar_progress;
create trigger trg_progress_updated_at
before update on despega_pilar_progress
for each row execute function set_updated_at();

drop trigger if exists trg_user_misiones_updated_at on despega_user_misiones;
create trigger trg_user_misiones_updated_at
before update on despega_user_misiones
for each row execute function set_updated_at();

-- ============================================
-- 9. RLS (Row-Level Security)
-- ============================================

alter table despega_cycles enable row level security;
alter table despega_a1_results enable row level security;
alter table despega_pilar_progress enable row level security;
alter table despega_user_misiones enable row level security;
alter table despega_score_events enable row level security;
alter table despega_context_vault enable row level security;

-- Policies: cada usuario solo ve/modifica sus propias filas

create policy "cycles_owner_select" on despega_cycles
for select using (auth.uid() = user_id);

create policy "cycles_owner_insert" on despega_cycles
for insert with check (auth.uid() = user_id);

create policy "cycles_owner_update" on despega_cycles
for update using (auth.uid() = user_id);

create policy "a1_results_owner_select" on despega_a1_results
for select using (auth.uid() = user_id);

create policy "progress_owner_select" on despega_pilar_progress
for select using (auth.uid() = user_id);

create policy "missions_owner_select" on despega_user_misiones
for select using (auth.uid() = user_id);

create policy "events_owner_select" on despega_score_events
for select using (auth.uid() = user_id);

create policy "vault_owner_select" on despega_context_vault
for select using (auth.uid() = user_id);

-- Nota: inserts/updates se hacen SOLO a través de RPC con SECURITY DEFINER
-- No permitimos insert/update directos desde el cliente

-- ============================================
-- 10. FUNCTION: updated_at on user_profiles
-- ============================================

drop trigger if exists trg_user_profiles_updated_at on despega_user_profiles;
create trigger trg_user_profiles_updated_at
before update on despega_user_profiles
for each row execute function set_updated_at();
