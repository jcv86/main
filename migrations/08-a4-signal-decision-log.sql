begin;

create table if not exists public.a4_verified_signals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  category text not null,
  classification text not null,
  summary text not null,
  relevance text not null,
  confidence smallint not null,
  source_type text not null,
  source_name text not null,
  source_url text,
  source_reference text,
  source_date date not null,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint a4_verified_signals_title_length
    check (char_length(btrim(title)) between 8 and 160),
  constraint a4_verified_signals_category_valid
    check (category in (
      'labor_market',
      'industry',
      'company',
      'role',
      'network',
      'personal_execution',
      'macro'
    )),
  constraint a4_verified_signals_classification_valid
    check (classification in ('fact', 'hypothesis')),
  constraint a4_verified_signals_summary_length
    check (char_length(btrim(summary)) between 30 and 1200),
  constraint a4_verified_signals_relevance_length
    check (char_length(btrim(relevance)) between 20 and 800),
  constraint a4_verified_signals_confidence_valid
    check (confidence between 1 and 5),
  constraint a4_verified_signals_source_type_valid
    check (source_type in ('external_url', 'internal_document', 'direct_observation')),
  constraint a4_verified_signals_source_name_length
    check (char_length(btrim(source_name)) between 3 and 180),
  constraint a4_verified_signals_source_evidence_present
    check (
      nullif(btrim(coalesce(source_url, '')), '') is not null
      or nullif(btrim(coalesce(source_reference, '')), '') is not null
    ),
  constraint a4_verified_signals_external_url_valid
    check (
      source_type <> 'external_url'
      or source_url ~* '^https?://[^[:space:]]+$'
    ),
  constraint a4_verified_signals_status_valid
    check (status in ('active', 'archived'))
);

create table if not exists public.a4_decision_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  signal_id uuid not null references public.a4_verified_signals(id) on delete cascade,
  decision text not null,
  rationale text not null,
  expected_evidence text not null,
  status text not null default 'watching',
  review_on date not null,
  outcome text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint a4_decision_log_decision_length
    check (char_length(btrim(decision)) between 12 and 500),
  constraint a4_decision_log_rationale_length
    check (char_length(btrim(rationale)) between 20 and 1000),
  constraint a4_decision_log_expected_evidence_length
    check (char_length(btrim(expected_evidence)) between 20 and 800),
  constraint a4_decision_log_status_valid
    check (status in ('watching', 'testing', 'committed', 'discarded', 'reviewed')),
  constraint a4_decision_log_outcome_length
    check (outcome is null or char_length(btrim(outcome)) between 10 and 1200)
);

create index if not exists a4_verified_signals_user_created_idx
  on public.a4_verified_signals (user_id, created_at desc);
create index if not exists a4_verified_signals_user_status_idx
  on public.a4_verified_signals (user_id, status, source_date desc);
create index if not exists a4_decision_log_user_review_idx
  on public.a4_decision_log (user_id, status, review_on);
create index if not exists a4_decision_log_signal_idx
  on public.a4_decision_log (signal_id, created_at desc);

create or replace function public.set_a4_canonical_updated_at()
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

revoke all on function public.set_a4_canonical_updated_at() from public;
grant execute on function public.set_a4_canonical_updated_at() to service_role;

drop trigger if exists set_a4_verified_signals_updated_at on public.a4_verified_signals;
create trigger set_a4_verified_signals_updated_at
before update on public.a4_verified_signals
for each row execute function public.set_a4_canonical_updated_at();

drop trigger if exists set_a4_decision_log_updated_at on public.a4_decision_log;
create trigger set_a4_decision_log_updated_at
before update on public.a4_decision_log
for each row execute function public.set_a4_canonical_updated_at();

alter table public.a4_verified_signals enable row level security;
alter table public.a4_decision_log enable row level security;

revoke all on public.a4_verified_signals from anon, authenticated;
revoke all on public.a4_decision_log from anon, authenticated;
grant select, insert, update, delete on public.a4_verified_signals to authenticated;
grant select, insert, update, delete on public.a4_decision_log to authenticated;
grant all on public.a4_verified_signals to service_role;
grant all on public.a4_decision_log to service_role;

drop policy if exists "Users read own verified signals" on public.a4_verified_signals;
create policy "Users read own verified signals"
on public.a4_verified_signals
for select
to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

drop policy if exists "Users create own verified signals" on public.a4_verified_signals;
create policy "Users create own verified signals"
on public.a4_verified_signals
for insert
to authenticated
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

drop policy if exists "Users update own verified signals" on public.a4_verified_signals;
create policy "Users update own verified signals"
on public.a4_verified_signals
for update
to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

drop policy if exists "Users delete own verified signals" on public.a4_verified_signals;
create policy "Users delete own verified signals"
on public.a4_verified_signals
for delete
to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

drop policy if exists "Users read own decisions" on public.a4_decision_log;
create policy "Users read own decisions"
on public.a4_decision_log
for select
to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

drop policy if exists "Users create own decisions" on public.a4_decision_log;
create policy "Users create own decisions"
on public.a4_decision_log
for insert
to authenticated
with check (
  (select auth.uid()) is not null
  and (select auth.uid()) = user_id
  and exists (
    select 1
    from public.a4_verified_signals signal
    where signal.id = signal_id
      and signal.user_id = (select auth.uid())
  )
);

drop policy if exists "Users update own decisions" on public.a4_decision_log;
create policy "Users update own decisions"
on public.a4_decision_log
for update
to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
with check (
  (select auth.uid()) is not null
  and (select auth.uid()) = user_id
  and exists (
    select 1
    from public.a4_verified_signals signal
    where signal.id = signal_id
      and signal.user_id = (select auth.uid())
  )
);

drop policy if exists "Users delete own decisions" on public.a4_decision_log;
create policy "Users delete own decisions"
on public.a4_decision_log
for delete
to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

comment on table public.a4_verified_signals is
  'Canonical A4 evidence log. Every signal preserves source, source date, classification and user relevance.';
comment on table public.a4_decision_log is
  'Canonical A4 decision register linked to verified signals and an explicit review date.';

commit;
