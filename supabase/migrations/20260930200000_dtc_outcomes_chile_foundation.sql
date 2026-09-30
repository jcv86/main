-- DTC Outcomes Chile — Data Foundation v1.
-- Separates product capability outcomes from labor-market, employment and economic outcomes.
-- Sensitive outcome records are owner-readable and server-written.

create table if not exists public.dtc_job_search_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  event_type text not null check (event_type in ('application','employer_response','screening','interview','process_advance','rejection','offer','withdrawal')),
  occurred_at timestamptz not null,
  source_channel text null check (source_channel is null or source_channel in ('dtc_a4','linkedin','job_board','referral','direct','recruiter','other')),
  target_role text null check (target_role is null or char_length(target_role) <= 160),
  occupation_code text null check (occupation_code is null or char_length(occupation_code) <= 40),
  region_code text null check (region_code is null or char_length(region_code) <= 20),
  process_ref uuid null,
  evidence_refs jsonb not null default '[]'::jsonb check (jsonb_typeof(evidence_refs)='array'),
  verification_status text not null default 'self_reported' check (verification_status in ('self_reported','corroborated','verified')),
  created_at timestamptz not null default now()
);
create index if not exists dtc_job_search_events_user_time_idx on public.dtc_job_search_events(user_id,occurred_at desc);
create index if not exists dtc_job_search_events_type_time_idx on public.dtc_job_search_events(event_type,occurred_at desc);

create table if not exists public.dtc_employment_outcomes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  outcome_type text not null check (outcome_type in ('job_started','role_change','promotion','return_to_work')),
  effective_date date not null,
  role_title text not null check (char_length(trim(role_title)) between 1 and 160),
  occupation_code text null check (occupation_code is null or char_length(occupation_code) <= 40),
  region_code text null check (region_code is null or char_length(region_code) <= 20),
  work_mode text null check (work_mode is null or work_mode in ('onsite','hybrid','remote')),
  employment_category text null check (employment_category is null or employment_category in ('private_employee','public_employee','employer','self_employed','other')),
  source_channel text null check (source_channel is null or source_channel in ('dtc_a4','linkedin','job_board','referral','direct','recruiter','other')),
  verification_status text not null default 'self_reported' check (verification_status in ('self_reported','corroborated','verified')),
  evidence_refs jsonb not null default '[]'::jsonb check (jsonb_typeof(evidence_refs)='array'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists dtc_employment_outcomes_user_date_idx on public.dtc_employment_outcomes(user_id,effective_date desc);

create table if not exists public.dtc_salary_outcomes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  employment_outcome_id uuid null references public.dtc_employment_outcomes(id) on delete set null,
  measurement_role text not null check (measurement_role in ('baseline','new_role','follow_up')),
  monthly_net_clp integer not null check (monthly_net_clp between 0 and 100000000),
  hours_per_week numeric null check (hours_per_week is null or (hours_per_week > 0 and hours_per_week <= 100)),
  measured_at date not null,
  verification_status text not null default 'self_reported' check (verification_status in ('self_reported','corroborated','verified')),
  evidence_refs jsonb not null default '[]'::jsonb check (jsonb_typeof(evidence_refs)='array'),
  created_at timestamptz not null default now()
);
create index if not exists dtc_salary_outcomes_user_date_idx on public.dtc_salary_outcomes(user_id,measured_at desc);

create table if not exists public.dtc_outcome_followups (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  employment_outcome_id uuid null references public.dtc_employment_outcomes(id) on delete cascade,
  followup_day integer not null check (followup_day in (30,90,180)),
  due_at date not null,
  completed_at timestamptz null,
  employment_active boolean null,
  same_role boolean null,
  monthly_net_clp integer null check (monthly_net_clp is null or monthly_net_clp between 0 and 100000000),
  verification_status text not null default 'self_reported' check (verification_status in ('self_reported','corroborated','verified')),
  created_at timestamptz not null default now(),
  unique(user_id,employment_outcome_id,followup_day)
);
create index if not exists dtc_outcome_followups_due_idx on public.dtc_outcome_followups(due_at) where completed_at is null;

create table if not exists public.dtc_chile_benchmarks (
  id uuid primary key default gen_random_uuid(),
  source_key text not null check (source_key in ('ine_esi','ine_ene','sence_enadel','other_official')),
  source_period text not null check (char_length(source_period) between 4 and 40),
  metric_key text not null check (metric_key in ('monthly_net_income_mean','monthly_net_income_median','employment_rate','unemployment_rate','vacancy_demand','skill_demand')),
  region_code text null check (region_code is null or char_length(region_code) <= 20),
  occupation_code text null check (occupation_code is null or char_length(occupation_code) <= 40),
  education_level text null check (education_level is null or char_length(education_level) <= 80),
  employment_category text null check (employment_category is null or char_length(employment_category) <= 80),
  industry_code text null check (industry_code is null or char_length(industry_code) <= 40),
  value_numeric numeric not null,
  unit text not null check (unit in ('clp_month','percent','count','index')),
  sample_size integer null check (sample_size is null or sample_size >= 0),
  reliability_status text not null default 'official_published' check (reliability_status in ('official_published','official_microdata_derived','suppressed_low_sample')),
  source_ref text not null check (char_length(source_ref) between 1 and 500),
  published_at date null,
  ingested_at timestamptz not null default now()
);
create index if not exists dtc_chile_benchmarks_lookup_idx on public.dtc_chile_benchmarks(metric_key,source_period,region_code,occupation_code);

create table if not exists public.dtc_outcome_verifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject_type text not null check (subject_type in ('job_search_event','employment_outcome','salary_outcome','followup')),
  subject_id uuid not null,
  method text not null check (method in ('self_report','document','linked_event','manual_review','system_evidence')),
  status text not null check (status in ('pending','corroborated','verified','rejected')),
  evidence_refs jsonb not null default '[]'::jsonb check (jsonb_typeof(evidence_refs)='array'),
  verified_at timestamptz null,
  created_at timestamptz not null default now()
);
create index if not exists dtc_outcome_verifications_subject_idx on public.dtc_outcome_verifications(subject_type,subject_id,created_at desc);

-- Owner read, server-owned writes. Benchmarks are authenticated-readable and server-owned.
do $$
declare t text;
begin
  foreach t in array array[
    'dtc_job_search_events','dtc_employment_outcomes','dtc_salary_outcomes',
    'dtc_outcome_followups','dtc_outcome_verifications'
  ] loop
    execute format('alter table public.%I enable row level security',t);
    execute format('alter table public.%I force row level security',t);
    execute format('drop policy if exists %I on public.%I',t||'_owner_select',t);
    execute format('create policy %I on public.%I for select to authenticated using ((select auth.uid())=user_id)',t||'_owner_select',t);
    execute format('revoke all on table public.%I from anon, authenticated',t);
    execute format('grant select on table public.%I to authenticated',t);
  end loop;
end $$;

alter table public.dtc_chile_benchmarks enable row level security;
alter table public.dtc_chile_benchmarks force row level security;
drop policy if exists dtc_chile_benchmarks_authenticated_select on public.dtc_chile_benchmarks;
create policy dtc_chile_benchmarks_authenticated_select on public.dtc_chile_benchmarks for select to authenticated using (true);
revoke all on table public.dtc_chile_benchmarks from anon, authenticated;
grant select on table public.dtc_chile_benchmarks to authenticated;

comment on table public.dtc_job_search_events is 'Server-written job-search funnel events for DTC Outcomes Chile.';
comment on table public.dtc_employment_outcomes is 'Employment outcomes with explicit verification status; employer identity is intentionally not required.';
comment on table public.dtc_salary_outcomes is 'Net monthly CLP salary measurements used for observed economic impact. Never infer causal impact from this table alone.';
comment on table public.dtc_outcome_followups is '30/90/180-day persistence checks for employment outcomes.';
comment on table public.dtc_chile_benchmarks is 'Versioned official Chile labor-market benchmarks. Store source period and reliability; never overwrite history.';
comment on table public.dtc_outcome_verifications is 'Audit trail that separates self-report, corroboration and verification.';
