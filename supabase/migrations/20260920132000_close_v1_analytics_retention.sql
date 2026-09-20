-- DTC-C16 closure: least-privilege grants + physical retention for raw pilot analytics.
-- Raw v1_analytics rows have a hard 90-day expiry and are physically purged daily.

-- Reconcile grants inherited from the legacy table. RLS already restricts row access,
-- but table-level privileges should reflect the intended client surface as well.
revoke all on table public.v1_analytics from anon;
revoke all on table public.v1_analytics from authenticated;
grant select, insert on table public.v1_analytics to authenticated;

revoke all on sequence public.v1_analytics_id_seq from anon;
revoke all on sequence public.v1_analytics_id_seq from authenticated;
grant usage, select on sequence public.v1_analytics_id_seq to authenticated;

-- Remove any rows already past their declared retention boundary at migration time.
delete from public.v1_analytics
where expires_at <= now();

-- Supabase Cron is backed by pg_cron. Keep the scheduler in Postgres so retention
-- does not depend on browser traffic or application availability.
create extension if not exists pg_cron with schema pg_catalog;

grant usage on schema cron to postgres;
grant all privileges on all tables in schema cron to postgres;

-- Re-running this migration definition with the same name updates/replaces the job.
select cron.schedule(
  'dtc-v1-analytics-retention-daily',
  '17 4 * * *',
  $$delete from public.v1_analytics where expires_at <= now();$$
);

comment on table public.v1_analytics is
  'Allowlisted, owner-scoped product events. Raw rows expire within 90 days and are physically purged daily.';
