import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import './check-outcome-page-continuity'

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

// This proves the selected opaque sRGB colors, not full browser accessibility.
// Keep the normal and hover button states independently above the small-text threshold.
const form = readFileSync('components/outcomes/outcome-response-capture-form.tsx', 'utf8')
const actionClass = form.match(/const CAPTURE_ACTION_CLASS = '([^']+)'/)?.[1]
assert.ok(actionClass, 'capture actions must share an explicit contrast contract')
assert.equal((form.match(/className=\{CAPTURE_ACTION_CLASS\}/g) ?? []).length, 2)
assert.match(actionClass, /(?:^|\s)text-white(?:\s|$)/)
assert.match(actionClass, /(?:^|\s)hover:text-white(?:\s|$)/)
const normalColor = actionClass.match(/(?:^|\s)bg-\[(#[0-9a-fA-F]{6})\](?:\s|$)/)?.[1]
const hoverColor = actionClass.match(/(?:^|\s)hover:bg-\[(#[0-9a-fA-F]{6})\](?:\s|$)/)?.[1]
assert.ok(normalColor && hoverColor, 'both backgrounds must be opaque six-digit sRGB colors')
function relativeLuminance(hex: string): number {
  const channels = [1, 3, 5].map(offset => {
    const srgb = Number.parseInt(hex.slice(offset, offset + 2), 16) / 255
    return srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4
  })
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
}
const contrastRatios = [normalColor, hoverColor].map(hex => 1.05 / (relativeLuminance(hex) + 0.05))
assert.ok(contrastRatios.every(ratio => ratio >= 4.5), 'white action labels need at least 4.5:1 contrast')

console.log(JSON.stringify({
  authenticatedWriter: true,
  serverOwnedIdentity: true,
  strictInstrumentBoundary: true,
  unevaluatedCapture: true,
  ownerBoundReadback: true,
  failClosedScorecard: true,
  noCausalClaim: true,
  captureActionColorContrast: contrastRatios.map(ratio => Number(ratio.toFixed(2))),
  contrastScope: 'selected_srgb_colors_only_not_browser_accessibility',
}))
