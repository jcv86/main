import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const sql = readFileSync(
  'supabase/migrations/20260909113000_secure_v1_analytics.sql',
  'utf8',
)

for (const contract of [
  'user_id uuid not null references auth.users(id) on delete cascade',
  "expires_at timestamptz not null default (now() + interval '90 days')",
  "delete from public.v1_analytics where user_id is null",
  'alter table public.v1_analytics force row level security',
  'to authenticated',
  'with check ((select auth.uid()) = user_id)',
  'using ((select auth.uid()) = user_id and expires_at > now())',
  'revoke all on table public.v1_analytics from anon',
]) {
  assert.ok(sql.includes(contract), `missing migration contract: ${contract}`)
}

assert.ok(!sql.includes('to anon'), 'anonymous analytics access must remain revoked')
assert.ok(!sql.includes('user_id is null)'), 'anonymous ownerless reads must not be permitted')

console.log(JSON.stringify({ v1AnalyticsMigrationContract: true }))
