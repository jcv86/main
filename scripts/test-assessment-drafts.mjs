import assert from 'node:assert/strict'
import fs from 'node:fs'
import { validateAssessmentDraft } from '../lib/assessment-drafts.ts'

const migration = fs.readFileSync('supabase/migrations/20260826010000_assessment_drafts.sql', 'utf8')
const route = fs.readFileSync('app/api/assessments/drafts/[assessmentType]/route.ts', 'utf8')

assert.match(migration, /enable row level security/i)
assert.match(migration, /unique\s*\(user_id, assessment_type\)/i)
assert.match(migration, /auth\.uid\(\).*user_id/i)
assert.match(migration, /revoke all .* anon/i)
assert.doesNotMatch(route, /searchParams.*user|body\.user_id|p_user_id/i, 'draft API must not trust a client user ID')

const validC1 = validateAssessmentDraft('c1', {
  schemaVersion: 1,
  currentQuestion: 1,
  answers: { 1: ['Empleado de tiempo completo'], 2: ['5-10 años'] },
  timings: [],
})
assert.equal(validC1.valid, true)
assert.equal(validateAssessmentDraft('c1', { schemaVersion: 1, currentQuestion: 7, answers: {}, timings: [] }).valid, false)
assert.equal(validateAssessmentDraft('c1', { schemaVersion: 1, currentQuestion: 0, answers: { 1: ['opción inventada'] }, timings: [] }).valid, false)

const validA1 = validateAssessmentDraft('a1', {
  schemaVersion: 1,
  currentQuestion: 0,
  answers: { more: { 1: 'Decidido y directo' }, less: { 1: 'Analítico y preciso' } },
  timings: [{ questionId: 1, responseTime: 12 }],
})
assert.equal(validA1.valid, true)
assert.equal(validateAssessmentDraft('a1', { schemaVersion: 1, currentQuestion: 0, answers: { more: { 1: 'Decidido y directo' }, less: { 1: 'Decidido y directo' } }, timings: [] }).valid, false)

for (const path of ['app/api/a1/insights/route.ts', 'app/api/a2/coach-assist/route.ts', 'app/despega/a1-report/page.tsx']) {
  const source = fs.readFileSync(path, 'utf8')
  assert.match(source, /canon_conozcamonos_1_responses/)
  assert.doesNotMatch(source, /\.from\(['"]conozcamonos_1_responses['"]\)/)
}

console.log(JSON.stringify({ assessmentDrafts: true, canonicalC1Readers: true }))
