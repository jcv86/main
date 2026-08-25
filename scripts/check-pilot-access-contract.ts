import assert from 'node:assert/strict'
import fs from 'node:fs'

const migrationPath = 'supabase/migrations/20260825010000_pilot_access_foundation.sql'
const sql = fs.readFileSync(migrationPath, 'utf8')
const expect = (pattern: RegExp, message: string) => assert.match(sql, pattern, message)

expect(/create table(?: if not exists)? public\.pilot_memberships/i, 'pilot membership table missing')
expect(/unique\s*\(user_id\)/i, 'membership must be unique per user')
expect(/create table(?: if not exists)? public\.pilot_invitations/i, 'pilot invitation table missing')
expect(/token_hash text not null unique/i, 'hashed token must be unique')
assert.doesNotMatch(sql, /(?:^|[,\n]\s*)token\s+text\b/im, 'plaintext invitation token is forbidden')
expect(/alter table public\.pilot_memberships enable row level security/i, 'membership RLS missing')
expect(/alter table public\.pilot_invitations enable row level security/i, 'invitation RLS missing')
expect(/public\.claim_pilot_invitation/i, 'claim function missing')
expect(/public\.resolve_pilot_access/i, 'access resolver missing')
expect(/security definer/i, 'RPCs must be security definer')
expect(/set search_path\s*=\s*pg_catalog,\s*public/i, 'RPC search_path must be fixed')
expect(/2026-08-25 00:00:00\+00/i, 'immutable rollout cutoff missing')
expect(/despega_user_profiles|canon_conozcamonos_1_responses|a1_cerebral_assessment/i, 'grandfather evidence missing')
expect(/pg_advisory_xact_lock/i, 'seat allocation lock missing')
expect(/revoke (?:all|execute).*public\.claim_pilot_invitation.*from public/i, 'claim PUBLIC execute revoke missing')
expect(/revoke (?:all|execute).*public\.resolve_pilot_access.*from public/i, 'resolve PUBLIC execute revoke missing')
expect(/revoke (?:all|execute).*from anon, authenticated/i, 'client execute revoke missing')
expect(/grant execute.*public\.claim_pilot_invitation.*to service_role/i, 'claim service role grant missing')
expect(/grant execute.*public\.resolve_pilot_access.*to service_role/i, 'resolve service role grant missing')

console.log(JSON.stringify({ pilotAccessMigration: true }))
