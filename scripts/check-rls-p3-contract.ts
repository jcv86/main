import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const migration = readFileSync('supabase/migrations/20260910120000_harden_active_public_catalogs_p3.sql', 'utf8').toLowerCase()
const rollback = readFileSync('supabase/rollbacks/20260910120000_harden_active_public_catalogs_p3.sql', 'utf8').toLowerCase()

for (const table of ['biblioteca', 'knowledge_base']) {
  assert.ok(migration.includes(`alter table public.${table} enable row level security`))
  assert.ok(migration.includes(`revoke all on table public.${table} from public, anon, authenticated`))
  assert.ok(migration.includes(`grant select on table public.${table} to anon, authenticated`))
  assert.ok(migration.includes(`create policy ${table}_public_read`))
  assert.ok(migration.includes(`for select to anon, authenticated using (true)`))
}
assert.ok(migration.includes('unexpected knowledge_base policy inventory'))
assert.ok(migration.includes('unexpected biblioteca policy inventory'))
assert.ok(migration.includes("roles = array['public']::name[]"))
assert.ok(migration.includes('revoke all on sequence public.knowledge_base_id_seq from public, anon, authenticated'))
assert.ok(!migration.includes('grant all'))
assert.ok(!migration.includes('for insert to anon'))
assert.ok(!migration.includes('for update to authenticated'))
assert.ok(rollback.includes('manual break-glass rollback only'))
assert.ok(rollback.includes('alter table public.biblioteca disable row level security'))
assert.ok(rollback.includes('alter table public.knowledge_base disable row level security'))

console.log(JSON.stringify({ rlsP3MigrationContract: true, publicReadOnlyCatalogs: 2, browserWritePrivileges: 0, rollbackDocumented: true }))
