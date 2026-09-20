import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const route = readFileSync('app/api/a4/decisions/route.ts', 'utf8')
const model = readFileSync('lib/a4/strategic-radar.ts', 'utf8')
const migration = readFileSync('supabase/migrations/20260920153000_a4_outcome_review.sql', 'utf8')

for (const key of [
  'evidence_supported','evidence_not_supported','inconclusive','decision_changed','decision_abandoned',
  'application_submitted','recruiter_response','interview_reached','process_advanced',
  'offer_received','offer_accepted','opportunity_declined','no_external_change',
]) assert.ok(model.includes(key), `missing A4 review taxonomy: ${key}`)

assert.ok(route.includes("instrument_key: 'a4_decision_review'"))
assert.ok(route.includes("measurement_role: 'external_outcome'"))
assert.ok(route.includes("outcome_key: 'career_decision_quality'"))
assert.ok(route.includes("error: 'La revisión sólo puede cerrarse desde su fecha programada.'"))
assert.ok(route.includes("{ source: 'a4_decision_log', ref: data.id }"))
assert.ok(route.includes("{ source: 'a4_verified_signals', ref: signal.id }"))
assert.ok(route.includes('observed_result: data.outcome'))
assert.ok(!route.includes('caused_by_dtc'))
assert.ok(migration.includes('review_classification'))
assert.ok(migration.includes('external_outcomes'))

console.log(JSON.stringify({
  dueDateGate: true,
  sourceDecisionAndSignalRequired: true,
  externalOutcomeObservation: true,
  noCausalAttribution: true,
  taxonomyPersisted: true,
}))
