import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const sql = readFileSync(
  'supabase/migrations/20260920132000_close_v1_analytics_retention.sql',
  'utf8',
)

for (const required of [
  'revoke all on table public.v1_analytics from authenticated',
  'grant select, insert on table public.v1_analytics to authenticated',
  'revoke all on sequence public.v1_analytics_id_seq from authenticated',
  'grant usage, select on sequence public.v1_analytics_id_seq to authenticated',
  'create extension if not exists pg_cron with schema pg_catalog',
  "'dtc-v1-analytics-retention-daily'",
  "'17 4 * * *'",
  'delete from public.v1_analytics where expires_at <= now()',
]) {
  assert.ok(sql.toLowerCase().includes(required.toLowerCase()), `missing retention contract: ${required}`)
}

assert.ok(!sql.includes('created_at <'), 'retention purge must use expires_at, not an alternate timestamp')
assert.ok(!sql.includes('user_id is null'), 'retention purge must not target ownerlessness as a proxy')
assert.ok(!sql.includes('truncate public.v1_analytics'), 'retention must never truncate all analytics')

console.log(JSON.stringify({
  v1AnalyticsRetentionContract: true,
  physicalDeletion: true,
  leastPrivilegeGrants: true,
  dailyScheduleUtc: '04:17',
}))
