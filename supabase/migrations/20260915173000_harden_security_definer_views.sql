-- Wave 5: close legacy/operational SECURITY DEFINER view exposure.
-- Read-only production preflight on 2026-09-15 found these 20 public views
-- selectable by anon/authenticated while their underlying relations are now
-- protected by RLS or server-only boundaries. No active application .from()
-- callsite depends on these views; cerebro_intelligence_metrics only appears
-- inside an unreferenced legacy method.
--
-- Keep the views available for controlled server/service-role diagnostics,
-- but make them SECURITY INVOKER and remove browser-facing SELECT grants.

do $migration$
declare
  target_view text;
begin
  foreach target_view in array array[
    'active_retention_policies',
    'autopublish_candidates',
    'brain_analytics',
    'canary_active_deployments',
    'canary_deployment_health',
    'cerebro_intelligence_metrics',
    'cip_daily_task_summary',
    'content_license_compliance_summary',
    'cron_active_alerts',
    'cron_health_summary',
    'cron_job_health',
    'dsar_pending_requests',
    'dsar_request_summary',
    'interview_questions_with_metadata',
    'license_compliance_summary',
    'metric_health_status',
    'pending_review_tasks',
    'prompt_performance',
    'threshold_violations',
    'unlicensed_content'
  ]
  loop
    if exists (
      select 1
      from pg_class c
      join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public'
        and c.relname = target_view
        and c.relkind = 'v'
    ) then
      execute format('alter view public.%I set (security_invoker = true)', target_view);
      execute format('revoke all privileges on table public.%I from public, anon, authenticated', target_view);
      execute format('grant select on table public.%I to service_role', target_view);
    end if;
  end loop;
end
$migration$;
