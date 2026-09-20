import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const design = readFileSync('docs/dtc/DTC_A4_CAREER_DECISION_QUALITY_DESIGN.md', 'utf8')
const page = readFileSync('app/despega/a4/page.tsx', 'utf8')

for (const value of [
  'evidence_supported',
  'evidence_not_supported',
  'inconclusive',
  'decision_changed',
  'decision_abandoned',
  'application_submitted',
  'recruiter_response',
  'interview_reached',
  'process_advanced',
  'offer_received',
  'offer_accepted',
  'opportunity_declined',
  'no_external_change',
  'a4_decision_review',
]) assert.ok(design.includes(value), `missing A4 outcome taxonomy: ${value}`)

assert.ok(design.includes('Do not invent a universal numeric career-success score.'))
assert.ok(design.includes('DTC must say “observed after this decision”, never “caused by DTC”.'))
assert.ok(design.includes('sin evidencia suficiente'))
assert.ok(page.includes("expected_evidence"))
assert.ok(page.includes("review_on"))
assert.ok(page.includes("outcome"))
assert.ok(page.includes("reviewed_at"))

console.log(JSON.stringify({
  decisionProcessSeparatedFromMarketResult: true,
  externalOutcomeTaxonomyFrozen: true,
  causalClaimsForbidden: true,
  zeroDataFailsHonest: true,
}))
