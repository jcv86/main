import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const migration = readFileSync(
  'supabase/migrations/20260909170000_harden_legacy_profiles_results_and_catalogs_p1.sql',
  'utf8',
).toLowerCase()
const rollback = readFileSync(
  'supabase/rollbacks/20260909170000_harden_legacy_profiles_results_and_catalogs_p1.sql',
  'utf8',
).toLowerCase()

for (const table of ['test_results', 'user_profiles', 'books', 'a4_noticias']) {
  assert.ok(migration.includes(`alter table public.${table} enable row level security`))
  assert.ok(migration.includes(`revoke all on table public.${table} from anon, authenticated`))
}

for (const table of ['test_results', 'user_profiles']) {
  for (const operation of ['select', 'insert', 'update']) {
    assert.ok(migration.includes(`create policy ${table}_owner_${operation}`))
  }
}

assert.ok(migration.includes("lower(user_email::text) = lower((select auth.jwt() ->> 'email'))"))
assert.ok(migration.includes("lower(email::text) = lower((select auth.jwt() ->> 'email'))"))
assert.ok(migration.includes('grant select, insert, update on table public.test_results to authenticated'))
assert.ok(migration.includes('grant select, insert, update on table public.user_profiles to authenticated'))
assert.ok(migration.includes('grant select on table public.books to anon, authenticated'))
assert.ok(migration.includes('grant select on table public.a4_noticias to anon, authenticated'))
assert.ok(!migration.includes('grant all'))
assert.ok(!migration.includes('for delete'))

for (const legacyPolicy of [
  '"books are insertable by authenticated users"',
  '"books are updatable by authenticated users"',
]) {
  assert.ok(migration.includes(`drop policy if exists ${legacyPolicy}`))
  assert.ok(!migration.includes(`create policy ${legacyPolicy}`))
}

assert.ok(rollback.includes('manual break-glass rollback only'))
assert.ok(rollback.includes('alter table public.test_results disable row level security'))
assert.ok(rollback.includes('alter table public.user_profiles disable row level security'))
assert.ok(rollback.includes('grant all on table public.books to anon, authenticated'))
assert.ok(rollback.includes('grant all on table public.a4_noticias to anon, authenticated'))

console.log(JSON.stringify({
  rlsP1MigrationContract: true,
  personalTables: 2,
  publicReadOnlyCatalogs: 2,
  rollbackDocumented: true,
}))
