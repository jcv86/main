import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

const migrationPath = 'supabase/migrations/20260914212058_harden_legacy_auth_and_privileged_rpc_p0.sql'
const migration = readFileSync(migrationPath, 'utf8')

const sealedTables = ['sessions', 'verification_tokens', 'admin_emails', 'user_roles']
for (const table of sealedTables) {
  assert.match(migration, new RegExp(`alter table public\\.${table} enable row level security`, 'i'))
  assert.match(migration, new RegExp(`revoke all privileges on table public\\.${table} from anon, authenticated`, 'i'))
}

assert.match(migration, /alter table public\.accounts enable row level security/i)
assert.match(migration, /create policy accounts_owner_select[\s\S]*to authenticated[\s\S]*auth\.uid\(\)[\s\S]*user_id/i)
assert.match(migration, /revoke all privileges on table public\.accounts from anon/i)
assert.match(migration, /grant select on table public\.accounts to authenticated/i)

const revokedRpcs = [
  'add_admin_email',
  'remove_admin_email',
  'create_notification',
  'ensure_user_profile',
  'ensure_user_session',
  'get_user_dashboard_data',
  'get_user_cv_data',
  'update_progress_flag',
  'update_user_book_progress',
  'update_user_progress',
]
for (const rpc of revokedRpcs) {
  assert.match(
    migration,
    new RegExp(`revoke execute on function public\\.${rpc}\\(`, 'i'),
    `${rpc} must be removed from the public Data API`,
  )
}

const callsiteScan = spawnSync(
  'rg',
  [
    '-n',
    '-g', '!node_modules',
    '-g', '!.next',
    '-g', '!_archive_dtc/**',
    '-g', '!DTC_Tech_Evidence_Pack*/**',
    '-g', '!supabase/migrations/**',
    '-g', '!lib/supabase/migrations/**',
    '-g', '!scripts/check-security-p0-contract.ts',
    revokedRpcs.map((rpc) => `\\.rpc\\(['\"]${rpc}['\"]`).join('|'),
    'app', 'components', 'hooks', 'lib',
  ],
  { encoding: 'utf8' },
)
assert.ok(callsiteScan.status === 0 || callsiteScan.status === 1, callsiteScan.stderr)
const activeSource = callsiteScan.stdout.trim()

assert.equal(activeSource, '', `revoked RPC still has an active direct callsite:\n${activeSource}`)

console.log(JSON.stringify({
  contract: 'security-p0',
  migration: migrationPath,
  sealedTables,
  accountsAccess: 'authenticated owner SELECT only',
  revokedRpcNames: revokedRpcs.length,
}, null, 2))
