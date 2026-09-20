import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const design = readFileSync('docs/dtc/DTC_A4_OPPORTUNITY_ENGINE_V1.md', 'utf8')
const page = readFileSync('app/despega/a4/job-matching/page.tsx', 'utf8')
const api = readFileSync('app/api/a4/job-matching/route.ts', 'utf8')
const legacy = readFileSync('lib/supabase/a4-job-matching.ts', 'utf8')

assert.ok(design.includes('no original URL -> not recommendable'))
assert.ok(design.includes('synthetic/mock listing -> never user-facing recommendation'))
assert.ok(design.includes('source mislabeled as LinkedIn -> reject'))
assert.ok(design.includes('must not claim complete LinkedIn coverage'))
assert.ok(design.includes('supported: requirement has user evidence'))
assert.ok(design.includes('partial: related evidence exists'))
assert.ok(page.includes('Relevancia antes que volumen'))
assert.ok(page.includes('Fuente trazable'))
assert.ok(page.includes('conserva la fuente original'))
assert.ok(!page.includes('100%'))
assert.ok(!page.includes('Match accuracy powered by AI'))
assert.ok(!page.includes('Updated daily with latest job openings'))
assert.ok(api.includes(".eq('status', 'active')"))
assert.ok(api.includes('expires_date.gte'))
assert.ok(legacy.includes('return mock results'), 'legacy mock path must remain detectable until retired')

console.log(JSON.stringify({
  unsupportedClaimsRetired: true,
  originalPublicationRequired: true,
  linkedinCoverageHonest: true,
  evidenceBucketsSpecified: true,
  legacyMockPathQuarantinedByContract: true,
}))
