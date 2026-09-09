import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const migration = readFileSync(
  'supabase/migrations/20260909210000_harden_a3_user_progress_p2.sql',
  'utf8',
).toLowerCase()
const rollback = readFileSync(
  'supabase/rollbacks/20260909210000_harden_a3_user_progress_p2.sql',
  'utf8',
).toLowerCase()

assert.ok(migration.includes('alter table public.a3_user_progress enable row level security'))
assert.ok(migration.includes('a3_user_progress.user_id must be non-null text/varchar'))

for (const operation of ['select', 'insert', 'update']) {
  assert.ok(migration.includes(`create policy a3_user_progress_owner_${operation}`))
}

assert.ok(migration.includes("roles = array['public']::name[]"))
assert.ok(migration.includes("unexpected a3_user_progress policy inventory"))
assert.ok(migration.includes("for select to authenticated\n  using ((select auth.uid())::text = user_id)"))
assert.ok(migration.includes("for insert to authenticated\n  with check ((select auth.uid())::text = user_id)"))
assert.ok(migration.includes("for update to authenticated\n  using ((select auth.uid())::text = user_id)\n  with check ((select auth.uid())::text = user_id)"))

for (const legacyPolicy of [
  '"users can view own a3 progress"',
  '"users can insert own a3 progress"',
  '"users can update own a3 progress"',
]) {
  assert.ok(migration.includes(`drop policy if exists ${legacyPolicy}`))
}

assert.ok(migration.includes('(select auth.uid())::text = user_id'))
assert.ok(migration.includes('revoke all on table public.a3_user_progress from public, anon, authenticated'))
assert.ok(migration.includes('grant select, insert, update on table public.a3_user_progress to authenticated'))
assert.ok(!migration.includes('grant all'))
assert.ok(!migration.includes('for delete'))

assert.ok(rollback.includes('manual break-glass rollback only'))
assert.ok(rollback.includes('grant all on table public.a3_user_progress to anon, authenticated'))
assert.ok(rollback.includes('using (true)'))
assert.ok(rollback.includes('with check (true)'))

console.log(JSON.stringify({
  rlsP2MigrationContract: true,
  ownerScopedTables: 1,
  anonymousPrivileges: 0,
  rollbackDocumented: true,
}))
