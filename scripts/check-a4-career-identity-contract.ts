import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const migration = readFileSync(
  join(process.cwd(), 'supabase/migrations/20260804160000_a4_career_identity_strategic_evidence.sql'),
  'utf8',
)

for (const required of [
  'sync_a4_signal_to_career_identity',
  'sync_a4_decision_to_career_identity',
  'a4_signal_career_identity_sync',
  'a4_decision_career_identity_sync',
  "'a4-signal-' || new.id::text",
  "'a4-decision-' || new.id::text",
  "'verified_market_signal'",
  "'strategic_decision'",
  "'contextOnly', true",
  "new.status = 'reviewed'",
  'career_identities',
  'career_evidence',
  'career_agent_events',
  'on conflict (user_id, source_module, source_type, source_ref)',
]) {
  assert.ok(migration.includes(required), `missing A4 Career Identity invariant: ${required}`)
}

assert.ok(migration.includes('security invoker'))
assert.ok(migration.includes('set search_path = public'))
assert.ok(!migration.toLowerCase().includes('security definer'))
assert.ok(!migration.toLowerCase().includes('service_role'))

for (const fn of [
  'public.sync_a4_signal_to_career_identity()',
  'public.sync_a4_decision_to_career_identity()',
]) {
  assert.ok(migration.includes(`revoke all on function ${fn} from public`))
  assert.ok(migration.includes(`revoke all on function ${fn} from anon`))
  assert.ok(migration.includes(`revoke all on function ${fn} from authenticated`))
}

assert.ok(migration.includes("coalesce(new.confidence, 1)::numeric * 20"))
assert.ok(migration.includes("then 90 else 70 end"))
assert.ok(migration.includes("'review_strategic_decision'"))
assert.ok(!migration.includes('career_skills'))
assert.ok(!migration.includes('career_skill_edges'))

console.log('A4 Career Identity strategic evidence contract passed')
