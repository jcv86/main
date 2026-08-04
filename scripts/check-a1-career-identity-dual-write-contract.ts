import { readFileSync } from 'node:fs'

const migration = readFileSync(
  'supabase/migrations/20260804070000_a1_career_identity_dual_write.sql',
  'utf8',
)
const permissionMigration = readFileSync(
  'supabase/migrations/20260804125500_a1_career_identity_revoke_anon.sql',
  'utf8',
)
const route = readFileSync('app/api/a1-cerebral-save/route.ts', 'utf8')

function expect(source: string, pattern: RegExp, message: string) {
  if (!pattern.test(source)) throw new Error(message)
}

function reject(source: string, pattern: RegExp, message: string) {
  if (pattern.test(source)) throw new Error(message)
}

expect(migration, /save_a1_cerebral_with_career_identity/, 'Missing atomic A1 RPC')
expect(migration, /v_user_id uuid := auth\.uid\(\)/, 'RPC must bind writes to auth.uid()')
expect(migration, /security invoker/i, 'RPC must remain SECURITY INVOKER')
expect(migration, /insert into public\.a1_cerebral_assessment/, 'Canonical A1 insert is missing')
expect(migration, /insert into public\.career_identities/, 'Career Identity upsert is missing')
expect(migration, /insert into public\.career_evidence/, 'Career evidence write is missing')
expect(migration, /insert into public\.career_agent_events/, 'Audit event write is missing')
expect(migration, /career_evidence_source_ref_uidx/, 'Evidence idempotency index is missing')
expect(migration, /on conflict \(user_id, source_module, source_type, source_ref\)/, 'Evidence retry protection is missing')
expect(migration, /grant execute .* to authenticated/is, 'RPC must be executable by authenticated users')
expect(permissionMigration, /revoke all .* from anon/is, 'Anonymous RPC execution must be explicitly revoked')
expect(permissionMigration, /revoke all .* from public/is, 'Public RPC execution must be explicitly revoked')
expect(permissionMigration, /grant execute .* to authenticated/is, 'Authenticated RPC execution must be restored')
reject(migration, /service_role/i, 'Migration must not depend on service role')
reject(migration, /security definer/i, 'A1 dual-write must not use SECURITY DEFINER')

expect(route, /auth\.getUser\(\)/, 'Route must authenticate through getUser()')
expect(route, /validateAndScoreDiscResponses/, 'Server-owned DISC scoring must be preserved')
expect(route, /\.rpc\(\s*['"]save_a1_cerebral_with_career_identity['"]/, 'Route must call atomic A1 RPC')
expect(route, /crypto\.randomUUID\(\)/, 'Route must create a correlation id')
reject(
  route,
  /\.from\(['"]a1_cerebral_assessment['"]\)\s*\.insert/s,
  'Route must not bypass the atomic RPC with a direct A1 insert',
)
reject(route, /createAdminClient/, 'Route must not use an admin Supabase client')

console.log('A1 Career Identity dual-write contract passed')
