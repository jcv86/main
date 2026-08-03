begin;

create table if not exists public.a4_daily_evidence_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  snapshot_date date not null,
  timezone text not null default 'America/Santiago',
  priority text not null,
  active_signals integer not null default 0,
  facts integer not null default 0,
  hypotheses integer not null default 0,
  recent_signals integer not null default 0,
  stale_signals integer not null default 0,
  low_confidence_hypotheses integer not null default 0,
  covered_categories integer not null default 0,
  category_counts jsonb not null default '{}'::jsonb,
  overdue_reviews integer not null default 0,
  reviews_today integer not null default 0,
  reviews_next_7_days integer not null default 0,
  reviews_later integer not null default 0,
  open_decisions integer not null default 0,
  closed_decisions integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint a4_daily_snapshot_user_date_unique unique (user_id, snapshot_date),
  constraint a4_daily_snapshot_timezone_valid
    check (timezone = 'America/Santiago'),
  constraint a4_daily_snapshot_priority_valid
    check (priority in (
      'overdue_reviews',
      'reviews_today',
      'building_evidence',
      'refresh_sources',
      'monitoring'
    )),
  constraint a4_daily_snapshot_nonnegative_counts
    check (
      active_signals >= 0
      and facts >= 0
      and hypotheses >= 0
      and recent_signals >= 0
      and stale_signals >= 0
      and low_confidence_hypotheses >= 0
      and covered_categories between 0 and 7
      and overdue_reviews >= 0
      and reviews_today >= 0
      and reviews_next_7_days >= 0
      and reviews_later >= 0
      and open_decisions >= 0
      and closed_decisions >= 0
    ),
  constraint a4_daily_snapshot_signal_balance
    check (active_signals = facts + hypotheses),
  constraint a4_daily_snapshot_category_counts_object
    check (jsonb_typeof(category_counts) = 'object')
);

create index if not exists a4_daily_snapshot_user_date_idx
  on public.a4_daily_evidence_snapshots (user_id, snapshot_date desc);

create index if not exists a4_daily_snapshot_user_priority_idx
  on public.a4_daily_evidence_snapshots (user_id, priority, snapshot_date desc);

drop trigger if exists set_a4_daily_snapshot_updated_at
  on public.a4_daily_evidence_snapshots;
create trigger set_a4_daily_snapshot_updated_at
before update on public.a4_daily_evidence_snapshots
for each row execute function public.set_a4_canonical_updated_at();

alter table public.a4_daily_evidence_snapshots enable row level security;

revoke all on public.a4_daily_evidence_snapshots from anon, authenticated;
grant select on public.a4_daily_evidence_snapshots to authenticated;
grant all on public.a4_daily_evidence_snapshots to service_role;

drop policy if exists "Users read own daily evidence snapshots"
  on public.a4_daily_evidence_snapshots;
create policy "Users read own daily evidence snapshots"
on public.a4_daily_evidence_snapshots
for select
to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

comment on table public.a4_daily_evidence_snapshots is
  'Server-owned daily A4 cuts. Stores deterministic counters and category coverage derived from canonical signals and decisions; never user-supplied conclusions.';
comment on column public.a4_daily_evidence_snapshots.category_counts is
  'Count of active signals by the seven canonical A4 categories at the time of the cut.';

commit;
