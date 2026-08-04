import { readFileSync } from 'node:fs'

const migration = readFileSync(
  'supabase/migrations/20260804140000_a2_career_identity_atomic_completion.sql',
  'utf8',
)
const route = readFileSync('app/api/a2/complete-day/route.ts', 'utf8')

function expect(source: string, pattern: RegExp, message: string) {
  if (!pattern.test(source)) throw new Error(message)
}

function reject(source: string, pattern: RegExp, message: string) {
  if (pattern.test(source)) throw new Error(message)
}

expect(migration, /sync_a2_completion_to_career_identity/, 'Missing A2 trigger function')
expect(migration, /after insert or update of completed_at, submission, validation_status, validation_result/i, 'Trigger must follow canonical completion mutations')
expect(migration, /on public\.a2_user_task_completions/i, 'Trigger must attach to canonical A2 completion table')
expect(migration, /insert into public\.career_identities/i, 'Career Identity upsert is missing')
expect(migration, /insert into public\.career_evidence/i, 'Career evidence write is missing')
expect(migration, /insert into public\.career_agent_events/i, 'Career audit write is missing')
expect(migration, /on conflict \(user_id, source_module, source_type, source_ref\)/i, 'A2 evidence must be idempotent per day')
expect(migration, /'a2-day-' \|\| new\.day::text/i, 'A2 evidence source reference must be stable')
expect(migration, /revoke all .* from authenticated/is, 'Trigger function must not be directly executable by authenticated users')
reject(migration, /security definer/i, 'Trigger must not use SECURITY DEFINER')
reject(migration, /service_role/i, 'Migration must not depend on service role credentials')

expect(route, /resolveServerUser\(\)/, 'A2 completion must preserve server-owned identity resolution')
expect(route, /validateA2MissionSubmission/, 'A2 mission validation must remain server-owned')
expect(route, /validateA2SpecializedDaySubmission/, 'Specialized day validation must remain server-owned')
expect(route, /a2_user_task_completions/, 'Canonical A2 completion writer must remain active')
reject(route, /career_evidence/, 'Route must not duplicate trigger-owned Career Evidence writes')
reject(route, /career_agent_events/, 'Route must not duplicate trigger-owned audit writes')

console.log('A2 Career Identity trigger contract passed')
