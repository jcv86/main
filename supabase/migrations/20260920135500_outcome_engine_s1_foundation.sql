-- Outcome Engine S1 foundation.
-- Owner-bound observations and server-derived snapshots.
-- No free-form assessment answers are stored here.

create table if not exists public.dtc_outcome_observations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  outcome_key text not null check (outcome_key in (
    'professional_clarity',
    'execution_capability',
    'interview_capability',
    'career_decision_quality'
  )),
  stage text not null check (stage in ('a1','a2','a3','a4')),
  measurement_role text not null check (measurement_role in ('baseline','follow_up','external_outcome')),
  instrument_key text not null check (char_length(instrument_key) between 1 and 80),
  instrument_version text not null check (char_length(instrument_version) between 1 and 40),
  score numeric null,
  score_scale_min numeric null,
  score_scale_max numeric null,
  dimensions jsonb not null default '{}'::jsonb check (jsonb_typeof(dimensions) = 'object'),
  evidence_refs jsonb not null default '[]'::jsonb check (jsonb_typeof(evidence_refs) = 'array'),
  confidence numeric null check (confidence is null or (confidence >= 0 and confidence <= 1)),
  observed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint dtc_outcome_score_scale_valid check (
    (score is null and score_scale_min is null and score_scale_max is null)
    or (
      score is not null
      and score_scale_min is not null
      and score_scale_max is not null
      and score_scale_max > score_scale_min
      and score >= score_scale_min
      and score <= score_scale_max
    )
  )
);

create index if not exists idx_dtc_outcome_observations_user_key_time
  on public.dtc_outcome_observations(user_id, outcome_key, observed_at desc);

alter table public.dtc_outcome_observations enable row level security;
alter table public.dtc_outcome_observations force row level security;

drop policy if exists dtc_outcome_observations_owner_select on public.dtc_outcome_observations;
create policy dtc_outcome_observations_owner_select
  on public.dtc_outcome_observations
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

revoke all on table public.dtc_outcome_observations from anon;
revoke all on table public.dtc_outcome_observations from authenticated;
grant select on table public.dtc_outcome_observations to authenticated;

create table if not exists public.dtc_outcome_snapshots (
  user_id uuid not null references auth.users(id) on delete cascade,
  outcome_key text not null check (outcome_key in (
    'professional_clarity',
    'execution_capability',
    'interview_capability',
    'career_decision_quality'
  )),
  baseline_observation_id uuid null references public.dtc_outcome_observations(id) on delete set null,
  latest_observation_id uuid null references public.dtc_outcome_observations(id) on delete set null,
  normalized_baseline numeric null check (normalized_baseline is null or (normalized_baseline >= 0 and normalized_baseline <= 100)),
  normalized_latest numeric null check (normalized_latest is null or (normalized_latest >= 0 and normalized_latest <= 100)),
  normalized_delta numeric null check (normalized_delta is null or (normalized_delta >= -100 and normalized_delta <= 100)),
  comparable boolean not null default false,
  confidence numeric null check (confidence is null or (confidence >= 0 and confidence <= 1)),
  next_best_action_key text null check (next_best_action_key is null or char_length(next_best_action_key) <= 120),
  computed_at timestamptz not null default now(),
  primary key (user_id, outcome_key),
  constraint dtc_outcome_comparability_truth check (
    comparable
    or (normalized_delta is null)
  )
);

alter table public.dtc_outcome_snapshots enable row level security;
alter table public.dtc_outcome_snapshots force row level security;

drop policy if exists dtc_outcome_snapshots_owner_select on public.dtc_outcome_snapshots;
create policy dtc_outcome_snapshots_owner_select
  on public.dtc_outcome_snapshots
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

revoke all on table public.dtc_outcome_snapshots from anon;
revoke all on table public.dtc_outcome_snapshots from authenticated;
grant select on table public.dtc_outcome_snapshots to authenticated;

comment on table public.dtc_outcome_observations is
  'Evidence references and comparable measurements for DTC outcomes. Server-written; no free-form assessment answers.';
comment on table public.dtc_outcome_snapshots is
  'Server-derived outcome summaries. Numeric delta is null unless evidence is comparable.';
