-- Reuse the existing service-only cron execution ledger for a bounded lease.
-- No new table, subscription, notification, or provider credential is required.
-- Applying this migration does not execute the refresh job.

create or replace function public.acquire_a4_opportunity_refresh()
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $function$
declare
  v_now timestamptz := pg_catalog.clock_timestamp();
  v_slot bigint := pg_catalog.floor(pg_catalog.date_part('epoch', v_now) / 10800)::bigint;
  v_slot_start timestamptz := pg_catalog.to_timestamp(v_slot * 10800);
  v_execution_id uuid;
begin
  -- This short transaction lock serializes the lease check and insertion.
  -- The ledger row then holds the logical lease across HTTP requests.
  if not pg_catalog.pg_try_advisory_xact_lock(
    pg_catalog.hashtextextended('dtc:a4:opportunity-refresh', 0)
  ) then
    return pg_catalog.jsonb_build_object('status', 'overlap');
  end if;

  -- A terminated worker cannot finalize itself. Close only this job's expired
  -- runs so the monitoring ledger does not retain an endless "running" state.
  -- Do not wait on a row another transaction is already finalizing.
  update public.cron_job_executions
  set status = 'failure',
      completed_at = v_now,
      error_message = 'LEASE_EXPIRED',
      execution_summary = coalesce(execution_summary, '{}'::jsonb)
        || pg_catalog.jsonb_build_object('error', 'LEASE_EXPIRED')
  where id in (
    select id from public.cron_job_executions
    where job_name = 'a4-opportunities'
      and status = 'running'
      and started_at <= v_now - interval '120 seconds'
    for update skip locked
  );

  if exists (
    select 1 from public.cron_job_executions
    where job_name = 'a4-opportunities'
      and status = 'running'
      and started_at > v_now - interval '120 seconds'
  ) then
    return pg_catalog.jsonb_build_object('status', 'overlap');
  end if;

  -- A failed attempt also consumes its slot: retries cannot create an
  -- unbounded crawl. The next scheduled slot continues the rotation.
  if exists (
    select 1 from public.cron_job_executions
    where job_name = 'a4-opportunities'
      and started_at >= v_slot_start
      and started_at < v_slot_start + interval '3 hours'
  ) then
    return pg_catalog.jsonb_build_object('status', 'already_attempted');
  end if;

  insert into public.cron_job_executions (
    job_name, job_path, status, started_at, execution_summary
  ) values (
    'a4-opportunities',
    '/api/cron/a4-opportunities',
    'running',
    v_now,
    pg_catalog.jsonb_build_object('slot', v_slot, 'lease_seconds', 120)
  )
  returning id into v_execution_id;

  return pg_catalog.jsonb_build_object(
    'status', 'acquired',
    'execution_id', v_execution_id,
    'slot', v_slot,
    'started_at', v_now,
    'lease_expires_at', v_now + interval '120 seconds'
  );
end;
$function$;

revoke all on function public.acquire_a4_opportunity_refresh() from public, anon, authenticated;
grant execute on function public.acquire_a4_opportunity_refresh() to service_role;

comment on function public.acquire_a4_opportunity_refresh() is
  'Service-only A4 catalog refresh lease. Serializes acquisition, permits one attempt per three-hour UTC slot, and blocks overlapping 120-second runs using the existing cron ledger.';
