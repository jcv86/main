-- Assertions for Wave 5 SECURITY DEFINER view hardening.
do $verify$
declare
  target_view text;
  options text;
begin
  foreach target_view in array array[
    'active_retention_policies','autopublish_candidates','brain_analytics',
    'canary_active_deployments','canary_deployment_health','cerebro_intelligence_metrics',
    'cip_daily_task_summary','content_license_compliance_summary','cron_active_alerts',
    'cron_health_summary','cron_job_health','dsar_pending_requests','dsar_request_summary',
    'interview_questions_with_metadata','license_compliance_summary','metric_health_status',
    'pending_review_tasks','prompt_performance','threshold_violations','unlicensed_content'
  ]
  loop
    select array_to_string(c.reloptions, ',')
      into options
      from pg_class c
      join pg_namespace n on n.oid = c.relnamespace
     where n.nspname = 'public'
       and c.relname = target_view
       and c.relkind = 'v';

    if options is null or position('security_invoker=true' in options) = 0 then
      raise exception '% is not security_invoker: %', target_view, options;
    end if;

    if has_table_privilege('anon', format('public.%I', target_view), 'select') then
      raise exception 'anon SELECT remains on %', target_view;
    end if;
    if has_table_privilege('authenticated', format('public.%I', target_view), 'select') then
      raise exception 'authenticated SELECT remains on %', target_view;
    end if;
    if not has_table_privilege('service_role', format('public.%I', target_view), 'select') then
      raise exception 'service_role SELECT missing on %', target_view;
    end if;
  end loop;
end
$verify$;

select 'wave5_security_definer_views_pass' as verdict;
