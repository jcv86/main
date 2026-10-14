import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const route = readFileSync('app/api/outcomes/observations/route.ts', 'utf8')
const card = readFileSync('components/outcomes/outcome-progress-card.tsx', 'utf8')

// v2 records answers without trusting a browser score. The historical scorecard contract remains below.
const capture = readFileSync('lib/outcomes/response-capture.ts', 'utf8')
const history = readFileSync('lib/outcomes/response-history.ts', 'utf8')
for (const required of ['supabase.auth.getUser()', 'createAdminClient()', "from('dtc_outcome_observations')",
  'parseOutcomeCapture', 'captureObservation(capture, user.id', ".eq('user_id', user.id)", 'comparable: false']) {
  assert.ok(route.includes(required), `missing capture contract: ${required}`)
}
assert.ok(!route.includes("from('dtc_outcome_snapshots')"), 'raw capture must not rewrite evaluated snapshots')
assert.ok(!route.includes('compareOutcomePair'), 'capture must not imply a numerical improvement')
assert.ok(!route.includes('body.userId'), 'client must never choose outcome owner')
assert.ok(capture.includes("OUTCOME_CAPTURE_VERSION = '2-capture'"))
assert.ok(capture.includes("value.outcomeKey !== instrument.outcomeKey"), 'server rejects mismatched instrument')
assert.ok(capture.includes('score: null, score_scale_min: null, score_scale_max: null'))
assert.ok(capture.includes('dimensions: {}, confidence: null'))
assert.ok(capture.includes('response_payload: capture.responsePayload'))
assert.ok(history.includes("evaluationStatus: 'not_evaluated'"))

assert.ok(card.includes('Tu evidencia de progreso'))
assert.ok(card.includes('Todavía no tenemos una medición comparable para afirmar mejora.'))
assert.ok(card.includes('Cambio observado'))
assert.ok(card.includes('no demuestra por sí solo que DTC haya causado el resultado'))
assert.ok(!card.includes('mejoraste gracias'))

console.log(JSON.stringify({
  authenticatedWriter: true,
  serverOwnedIdentity: true,
  strictInstrumentBoundary: true,
  unevaluatedCapture: true,
  ownerBoundReadback: true,
  failClosedScorecard: true,
  noCausalClaim: true,
}))
