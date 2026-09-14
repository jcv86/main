import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const migrationPath = 'supabase/migrations/20260914213622_harden_inactive_and_unambiguous_relations_wave2.sql'
const migration = readFileSync(migrationPath, 'utf8')

const listMatch = migration.match(/foreach target_table in array array\[([\s\S]*?)\]\s*loop/i)
assert.ok(listMatch, 'inactive relation inventory is missing')
const inactiveRelations = [...listMatch[1].matchAll(/'([a-z0-9_]+)'/g)].map((match) => match[1])
assert.equal(inactiveRelations.length, 145, 'wave 2 must seal exactly the audited 145 inactive relations')
assert.equal(new Set(inactiveRelations).size, inactiveRelations.length, 'inactive relation inventory contains duplicates')
assert.match(migration, /alter table public\.%I enable row level security/i)
assert.match(migration, /revoke all privileges on table public\.%I from anon, authenticated/i)

const ownerRelations: Record<string, string> = {
  achievements: 'select, insert',
  ai_insights_from_coaching: 'select, insert',
  user_coaching_memory: 'select, insert, update',
  user_performance_context: 'select, update',
  user_progress: 'select, insert, update',
  user_reading_stats: 'select, insert, update',
}

for (const [table, privileges] of Object.entries(ownerRelations)) {
  assert.ok(!inactiveRelations.includes(table), `${table} cannot be classified as inactive`)
  assert.match(migration, new RegExp(`alter table public\\.${table} enable row level security`, 'i'))
  assert.match(migration, new RegExp(`revoke all privileges on table public\\.${table} from anon, authenticated`, 'i'))
  assert.match(migration, new RegExp(`grant ${privileges} on table public\\.${table} to authenticated`, 'i'))
}

const publicCatalogs = ['chilevalora_profiles', 'despega_misiones', 'despega_rutas', 'job_listings']
for (const table of publicCatalogs) {
  assert.ok(!inactiveRelations.includes(table), `${table} cannot be classified as inactive`)
  assert.match(migration, new RegExp(`alter table public\\.${table} enable row level security`, 'i'))
  assert.match(migration, new RegExp(`revoke all privileges on table public\\.${table} from anon, authenticated`, 'i'))
  assert.match(migration, new RegExp(`grant select on table public\\.${table} to anon, authenticated`, 'i'))
}

const deliberatelyDeferred = ['cv_data', 'user_chilevalora_interactions']
for (const table of deliberatelyDeferred) {
  assert.ok(!inactiveRelations.includes(table), `${table} must remain deferred pending an owner-bound replacement`)
  assert.doesNotMatch(migration, new RegExp(`alter table public\\.${table}`, 'i'))
}

// No direct .from() callsite exists for these tables, but active SECURITY
// INVOKER RPCs depend on the caller retaining access to them.
for (const table of ['embedding_generation_logs', 'skill_benchmarks']) {
  assert.ok(!inactiveRelations.includes(table), `${table} must remain available to its active RPC`)
}

console.log(JSON.stringify({
  contract: 'security-wave2',
  migration: migrationPath,
  before: { rlsDisabled: 190, advisor0007: 69 },
  hardened: { inactive: inactiveRelations.length, ownerScoped: 6, publicCatalogs: 4 },
  estimatedAfter: { rlsDisabled: 35, advisor0007: 2 },
  deferredActiveRelations: 33,
  deferredRpcDependencies: 2,
}, null, 2))
