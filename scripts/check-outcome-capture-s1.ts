import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const route = readFileSync('app/api/outcomes/observations/route.ts', 'utf8')
const card = readFileSync('components/outcomes/outcome-progress-card.tsx', 'utf8')

for (const required of [
  'supabase.auth.getUser()',
  'createAdminClient()',
  "from('dtc_outcome_observations')",
  "from('dtc_outcome_snapshots')",
  'compareOutcomePair',
  'user_id: user.id',
  "measurementRole: z.enum(['baseline', 'follow_up'])",
]) assert.ok(route.includes(required), `missing capture contract: ${required}`)

assert.ok(!route.includes('body.userId'), 'client must never choose outcome owner')
assert.ok(!route.includes('userId: z.'), 'payload schema must not accept a user id')
assert.ok(route.includes('Observation does not match instrument contract'), 'server must reject mismatched instrument payloads')
assert.ok(route.includes('normalized_delta: result.normalizedDelta'), 'snapshot must persist only comparator output')
assert.ok(route.includes('dimensions,confidence,observed_at'), 'snapshot derivation must read persisted confidence')

assert.ok(card.includes('Tu evidencia de progreso'))
assert.ok(card.includes('Todavía no tenemos una medición comparable para afirmar mejora.'))
assert.ok(card.includes('Cambio observado'))
assert.ok(card.includes('no demuestra por sí solo que DTC haya causado el resultado'))
assert.ok(!card.includes('mejoraste gracias'))

console.log(JSON.stringify({
  authenticatedWriter: true,
  serverOwnedIdentity: true,
  strictInstrumentBoundary: true,
  failClosedScorecard: true,
  noCausalClaim: true,
}))
