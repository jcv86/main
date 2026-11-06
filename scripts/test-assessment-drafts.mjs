import assert from 'node:assert/strict'
import fs from 'node:fs'
import { validateAssessmentDraft } from '../lib/assessment-drafts.ts'
import { serializeC1DraftAnswers, restoreC1DraftAnswers, serializeC1FinalAnswers,
  c1TextLimitError, C1_CUSTOM_RESPONSES_KEY as customKey } from '../lib/c1-responses.ts'
import { buildA1ProfessionalReport } from '../lib/reports/a1-professional-report.ts'

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

// The draft API must preserve what the participant entered, including both Otro
// questions. Exercise the same serialization, validation and restoration as the UI.
const selected = { 1: ['Independiente/Freelancer', 'Otro'], 3: 'Quiero explicar mi contexto laboral.', 5: ['Otro'] }
const details = { 1: '  Combino trabajo estacional y un proyecto propio.  ', 5: 'Alterno entre dos hogares familiares.' }
const draftAnswers = serializeC1DraftAnswers(selected, details)
const roundTrip = validateAssessmentDraft('c1', { schemaVersion: 1, currentQuestion: 4, answers: JSON.parse(JSON.stringify(draftAnswers)), timings: [] })
assert.equal(roundTrip.valid, true)
assert.deepEqual(restoreC1DraftAnswers(roundTrip.draft.answers), { responses: selected, customResponses: details })
assert.deepEqual(restoreC1DraftAnswers(validC1.draft.answers), {
  responses: { 1: ['Empleado de tiempo completo'], 2: ['5-10 años'] }, customResponses: {},
}, 'Existing drafts remain readable without migration')
const finalAnswers = serializeC1FinalAnswers(selected, details)
assert.deepEqual(finalAnswers[1], ['Independiente/Freelancer', `Otro: ${details[1].trim()}`])
assert.deepEqual(finalAnswers[5], [`Otro: ${details[5]}`])
assert.equal(Object.hasOwn(finalAnswers, customKey), false, 'Reports retain their existing numeric-key answer shape')
assert.deepEqual(selected[1], ['Independiente/Freelancer', 'Otro'], 'Submission must not mutate the still-retryable draft')
const inactive = serializeC1DraftAnswers({ 1: ['Desempleado'], 5: [] }, details)
assert.deepEqual(inactive, { 1: ['Desempleado'] }, 'Deselected answers and their old text are not saved')
assert.deepEqual(serializeC1FinalAnswers({ 1: ['Desempleado'] }, details), { 1: ['Desempleado'] })
assert.deepEqual(serializeC1FinalAnswers({ 1: ['Otro'] }, { 1: '  ' }), { 1: ['Otro'] }, 'Optional blank detail preserves the existing option')
for (const invalidAnswers of [
  { 1: ['Otro'], [customKey]: { 1: 'x'.repeat(501) } },
  { 1: ['Otro'], [customKey]: { 2: 'This question has no Other choice.' } },
  { 1: ['Otro'], [customKey]: { 99: 'Unknown question' } },
  { 1: ['Otro'], [customKey]: { 1: ['wrong type'] } },
  { 1: ['Otro'], [customKey]: ['wrong shape'] },
  { 1: ['Desempleado'], [customKey]: { 1: 'Inactive detail' } },
  { 1: ['Otro'], unexpected: { 1: 'Unrecognized metadata' } },
]) assert.equal(validateAssessmentDraft('c1', { schemaVersion: 1, currentQuestion: 0, answers: invalidAnswers }).valid, false)
assert.equal(validateAssessmentDraft('c1', { schemaVersion: 1, currentQuestion: 0,
  answers: { 1: ['Otro'], [customKey]: { 1: 'x'.repeat(500) } } }).valid, true)
assert.match(c1TextLimitError({ 1: ['Otro'] }, { 1: 'x'.repeat(501) }), /pregunta 1.*500/)
assert.match(c1TextLimitError({ 3: 'x'.repeat(501) }, {}), /pregunta 3.*500/)
assert.equal(c1TextLimitError({ 1: ['Desempleado'] }, { 1: 'x'.repeat(501) }), null)
assert.equal(c1TextLimitError({ 1: ['Otro'] }, { 1: 'x'.repeat(500) }), null)
const report = buildA1ProfessionalReport({ rawScores: { D: 5, I: 3, S: -2, C: -6 }, c1Responses: finalAnswers })
assert.ok(report.context.currentSituation.includes(details[1].trim()), 'Actual report reader must retain the custom situation')
assert.ok(report.understanding.context.situation.includes(details[1].trim()), 'Individual context must retain the same declaration')

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

console.log(JSON.stringify({ assessmentDrafts: true, canonicalC1Readers: true, c1CustomTextRoundTrip: true,
  legacyDrafts: true, inactiveTextExcluded: true, boundedCustomInput: true, finalReportFidelity: true }))
