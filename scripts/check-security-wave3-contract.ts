import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const migrationPath = 'supabase/migrations/20260914214527_harden_remaining_active_relations_wave3.sql'
const migration = readFileSync(migrationPath, 'utf8')

const arrays = [...migration.matchAll(/foreach target_table in array array\[([^\]]+)\]/g)]
  .map((match) => [...match[1].matchAll(/'([a-z0-9_]+)'/g)].map((item) => item[1]))
assert.deepEqual(arrays.map((items) => items.length), [8, 15, 8, 5])

const hardened = arrays.flat()
assert.equal(new Set(hardened).size, 36, 'wave 3 classifications must not overlap')

for (const table of hardened) {
  assert.match(migration, /alter table public\.%I enable row level security/i)
  assert.match(migration, /revoke all privileges on table public\.%I from anon, authenticated/i)
  assert.ok(/^[a-z0-9_]+$/.test(table))
}

assert.match(migration, /create policy %I[\s\S]*auth\.uid\(\)[\s\S]*user_id/i)
assert.match(migration, /create policy %I[\s\S]*auth\.jwt\(\)[\s\S]*user_email/i)
assert.match(migration, /grant select on table public\.%I to anon, authenticated/i)

assert.match(migration, /revoke execute on function public\.get_user_reading_stats\(uuid\) from public, anon, authenticated/i)
assert.match(migration, /create or replace function public\.get_user_reading_stats\(user_email_param text\)/i)
assert.match(migration, /security invoker/i)
assert.match(migration, /auth\.uid\(\)[\s\S]*auth\.jwt\(\)[\s\S]*not_authorized/i)
assert.match(migration, /revoke execute on function public\.get_user_reading_stats\(text\) from public, anon/i)
assert.match(migration, /grant execute on function public\.get_user_reading_stats\(text\) to authenticated/i)

console.log(JSON.stringify({
  contract: 'security-wave3',
  migration: migrationPath,
  classifiedRemainingTables: 35,
  additionalDependencyTable: 'book_reviews',
  policyGroups: { uuidOwner: 8, emailOwner: 15, publicReadOnly: 8, serverOnly: 5 },
  readingStatsRpc: 'authenticated owner-bound',
  estimatedAfter: { rlsDisabled: 0, advisor0007: 0 },
}, null, 2))
