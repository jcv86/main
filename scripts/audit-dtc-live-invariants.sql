-- Read-only audit for DTCFINAL. This script must return zero for every anomaly count.
-- It intentionally contains no inserts, updates, deletes or DDL.

with duplicate_snapshots as (
  select count(*)::int as anomaly_count
  from (
    select user_id, snapshot_date
    from public.a4_daily_evidence_snapshots
    group by user_id, snapshot_date
    having count(*) > 1
  ) duplicates
), snapshot_anomalies as (
  select count(*)::int as anomaly_count
  from public.a4_daily_evidence_snapshots
  where active_signals <> facts + hypotheses
     or active_signals < 0
     or covered_categories not between 0 and 7
     or jsonb_typeof(category_counts) <> 'object'
), premature_a4_unlocks as (
  select count(*)::int as anomaly_count
  from public.despega_journey_state journey
  left join public.a3_route_progression route
    on route.user_id = journey.user_id
  left join public.despega_user_profiles profile
    on profile.user_id = journey.user_id
  where (journey.a4_unlocked_at is not null or coalesce(profile.a4_unlocked, false))
    and route.route_completed_at is null
), closed_a3_without_a4 as (
  select count(*)::int as anomaly_count
  from public.a3_route_progression route
  left join public.despega_journey_state journey
    on journey.user_id = route.user_id
  left join public.despega_user_profiles profile
    on profile.user_id = route.user_id
  where route.route_completed_at is not null
    and (journey.a4_unlocked_at is null or not coalesce(profile.a4_unlocked, false))
), duplicate_a3_completions as (
  select count(*)::int as anomaly_count
  from (
    select user_id, module_id
    from public.a3_module_completion
    group by user_id, module_id
    having count(*) > 1
  ) duplicates
), invalid_a2_completions as (
  select count(*)::int as anomaly_count
  from public.a2_user_task_completions
  where day not between 1 and 90
     or completed_at is null
)
select 'duplicate_snapshot_groups' as invariant, anomaly_count from duplicate_snapshots
union all
select 'snapshot_anomaly_rows', anomaly_count from snapshot_anomalies
union all
select 'premature_a4_unlock_rows', anomaly_count from premature_a4_unlocks
union all
select 'closed_a3_without_a4_rows', anomaly_count from closed_a3_without_a4
union all
select 'duplicate_a3_completion_groups', anomaly_count from duplicate_a3_completions
union all
select 'invalid_a2_completion_rows', anomaly_count from invalid_a2_completions
order by invariant;

-- Verify A4 grants after server-owned write hardening.
select table_name, grantee,
       array_agg(privilege_type order by privilege_type) as privileges
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name in (
    'a4_verified_signals',
    'a4_decision_log',
    'a4_daily_evidence_snapshots'
  )
  and grantee in ('anon', 'authenticated', 'service_role')
group by table_name, grantee
order by table_name, grantee;

-- Verify the only authenticated A4 policies are owner-scoped SELECT policies.
select tablename, policyname, cmd, roles, qual, with_check
from pg_policies
where schemaname = 'public'
  and tablename in (
    'a4_verified_signals',
    'a4_decision_log',
    'a4_daily_evidence_snapshots'
  )
order by tablename, policyname;
