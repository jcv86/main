import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const migrationPath = 'supabase/migrations/20260915173000_harden_security_definer_views.sql'
const migration = readFileSync(migrationPath, 'utf8')

const expectedViews = [
  'active_retention_policies','autopublish_candidates','brain_analytics',
  'canary_active_deployments','canary_deployment_health','cerebro_intelligence_metrics',
  'cip_daily_task_summary','content_license_compliance_summary','cron_active_alerts',
  'cron_health_summary','cron_job_health','dsar_pending_requests','dsar_request_summary',
  'interview_questions_with_metadata','license_compliance_summary','metric_health_status',
  'pending_review_tasks','prompt_performance','threshold_violations','unlicensed_content',
]

for (const view of expectedViews) {
  assert.ok(migration.includes(`'${view}'`), `missing ${view}`)
}
assert.equal(new Set(expectedViews).size, 20)
assert.match(migration, /alter view public\.%I set \(security_invoker = true\)/i)
assert.match(migration, /revoke all privileges on table public\.%I from public, anon, authenticated/i)
assert.match(migration, /grant select on table public\.%I to service_role/i)

console.log(JSON.stringify({
  contract: 'security-wave5-views',
  migration: migrationPath,
  hardenedViews: expectedViews.length,
  browserSelect: false,
  serviceRoleSelect: true,
  securityInvoker: true,
}, null, 2))
