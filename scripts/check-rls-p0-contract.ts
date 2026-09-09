import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const migration = readFileSync(
  'supabase/migrations/20260909153000_harden_profiles_and_unified_results_p0.sql',
  'utf8',
).toLowerCase()
const rollback = readFileSync(
  'supabase/rollbacks/20260909153000_harden_profiles_and_unified_results_p0.sql',
  'utf8',
).toLowerCase()

for (const contract of [
  "array['profiles', 'unified_test_results']",
  "column_name = 'id' and udt_name = 'uuid' and is_nullable = 'no'",
  "column_name = 'user_email' and udt_name in ('text', 'varchar') and is_nullable = 'no'",
  'alter table public.profiles enable row level security',
  'drop policy if exists "public access" on public.profiles',
  'create policy profiles_owner_select',
  'create policy profiles_owner_insert',
  'create policy profiles_owner_update',
  'to authenticated',
  '(select auth.uid()) = id',
  'revoke all on table public.profiles from anon, authenticated',
  'grant select, insert, update on table public.profiles to authenticated',
  'alter table public.unified_test_results enable row level security',
  'drop policy if exists "system can insert test results"',
  'create policy unified_test_results_owner_select',
  "lower(user_email::text) = lower((select auth.jwt() ->> 'email'))",
  'revoke all on table public.unified_test_results from anon, authenticated',
  'grant select on table public.unified_test_results to authenticated',
]) {
  assert.ok(migration.includes(contract), `missing P0 RLS migration contract: ${contract}`)
}

assert.ok(!migration.includes('to anon'), 'P0 migration must not grant or create an anon policy')
assert.ok(!migration.includes('grant all'), 'P0 migration must use least-privilege grants')
assert.ok(!migration.includes('alter table public.profiles force row level security'))
assert.ok(!migration.includes('alter table public.unified_test_results force row level security'))

for (const rollbackContract of [
  'manual break-glass rollback only',
  'create policy "public access"',
  'create policy "system can insert test results"',
  'grant all on table public.profiles to anon, authenticated',
  'grant all on table public.unified_test_results to anon, authenticated',
]) {
  assert.ok(rollback.includes(rollbackContract), `missing documented rollback: ${rollbackContract}`)
}

console.log(JSON.stringify({ rlsP0MigrationContract: true, rollbackDocumented: true }))
