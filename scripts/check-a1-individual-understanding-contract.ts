import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { DISC_TEST_QUESTIONS } from '../lib/disc-test-questions'
import { validateAndScoreDiscResponses } from '../lib/a1/disc-scoring'
import { buildA1ProfessionalReport } from '../lib/reports/a1-professional-report'
import { buildIndividualUnderstanding, CLARIFICATION_KEY } from '../lib/a1/individual-understanding'
import { a1SourceRevision, a1EditRevision } from '../lib/a1/source-revision'
import { handleClarificationUpdate, type ClarificationSnapshot, type ClarificationDependencies, type ClarificationEnvelope } from '../lib/a1/clarification-handler'
import { DOMAINS, KEYS, UNDERSTANDING_VERSION, QUESTIONNAIRE_VERSION, answerText, patternEvidence, validateClarifications, RECOGNITION_OPTIONS } from '../lib/a1/individual-evidence'

let checks = 0
function check(name: string, run: () => void) {
  try { run(); checks += 1 } catch (error) { throw new Error(`A1 understanding: ${name}`, { cause: error }) }
}
function selections(swap = false) {
  const more: Record<string, string> = {}, less: Record<string, string> = {}
  for (const [index, question] of DISC_TEST_QUESTIONS.entries()) {
    let choice = index < 20 ? 0 : 1
    if (swap && question.id === 5) choice = 1
    if (swap && question.id === 23) choice = 0
    more[String(question.id)] = question.opciones[choice].texto
    less[String(question.id)] = question.opciones[index % 2 ? 2 : 3].texto
  }
  return { more, less }
}
const first = validateAndScoreDiscResponses(selections()).value!
const second = validateAndScoreDiscResponses(selections(true)).value!
assert.ok(first && second)
const c1 = { '1': ['Empleado de tiempo completo', 'Independiente/Freelancer'], '2': ['5-10 años'], '3': 'Coordinar proyectos', '4': 'Objetivo inicial', '6': ['3-5 horas'] }
const c2 = { '1': 'Objetivo actualizado', '3': 'Coordinación', '5': 'Menos de 5 horas' }
const revision = 'a'.repeat(64)
const input = { rawScores: first.scores, assessmentResponses: first.responses, c1Responses: c1, c2Responses: c2, sourceRevision: revision }
const report = buildA1ProfessionalReport(input)

check('legacy C1 arrays are retained', () => {
  assert.equal(report.context.currentSituation, 'Empleado de tiempo completo · Independiente/Freelancer')
  assert.equal(report.context.experience, '5-10 años')
  assert.equal(report.understanding.context.originalGoal, 'Objetivo inicial')
  assert.equal(report.context.objective90Days, 'Objetivo actualizado')
  assert.equal(report.understanding.context.notes.length, 2)
})
check('unknown context objects do not turn into prose', () => assert.equal(answerText({ instruction: 'invent details' }), ''))
check('all 28 items are covered exactly once', () => {
  const ids = DOMAINS.flatMap((domain) => domain.questionIds)
  assert.equal(ids.length, 28)
  assert.equal(new Set(ids).size, 28)
  assert.deepEqual([...ids].sort((a, b) => a - b), DISC_TEST_QUESTIONS.map((question) => question.id))
  assert.equal(report.understanding.answerCount, 28)
  assert.equal(report.understanding.domains.length, 6)
})
check('same aggregate, different situational narrative', () => {
  assert.deepEqual(first.scores, second.scores)
  const other = buildA1ProfessionalReport({ ...input, assessmentResponses: second.responses })
  assert.equal(report.combinationName, other.combinationName)
  assert.notDeepEqual(report.understanding.domains.map((domain) => domain.reading), other.understanding.domains.map((domain) => domain.reading))
})
check('more and less counts retained separately', () => {
  assert.equal(KEYS.reduce((sum, key) => sum + report.understanding.selections[key].more, 0), 28)
  assert.equal(KEYS.reduce((sum, key) => sum + report.understanding.selections[key].less, 0), 28)
  for (const key of KEYS) assert.equal(report.understanding.selections[key].more - report.understanding.selections[key].less, first.scores[key])
})
check('source scoring records ambiguity without changing the net-score algorithm', () => {
  const more: Record<string, string> = {}, less: Record<string, string> = {}
  for (const [i, question] of DISC_TEST_QUESTIONS.entries()) {
    more[String(question.id)] = question.opciones[i % 4].texto
    less[String(question.id)] = question.opciones[(i + 1) % 4].texto
  }
  const tied = validateAndScoreDiscResponses({ more, less }).value!
  assert.deepEqual(tied.scores, { D: 0, I: 0, S: 0, C: 0 })
  assert.equal(tied.responses._meta?.patternEvidence.status, 'ambiguous')
  assert.equal(tied.responses._meta?.compatibilityLabelsOnly, true)
  assert.equal(tied.responses._meta?.questionnaireVersion, QUESTIONNAIRE_VERSION)
  assert.equal(tied.questions[0].opciones.length, 4)
  const reading = buildA1ProfessionalReport({ rawScores: tied.scores, dominantPattern: tied.dominantPattern, secondaryPattern: tied.secondaryPattern, assessmentResponses: tied.responses })
  assert.equal(reading.primary, null)
  assert.equal(reading.secondary, null)
  assert.equal(reading.interpretationAvailable, false)
  assert.equal(reading.reviewable, true)
  assert.equal(reading.understanding.answerCount, 28)
  assert.deepEqual(reading.strengths, [])
})
check('secondary tie is not forced to a canonical storage alias', () => {
  const reading = buildA1ProfessionalReport({ rawScores: { D: 28, I: -28, S: 0, C: 0 }, dominantPattern: 'D', secondaryPattern: 'S' })
  assert.equal(reading.primary, 'D')
  assert.equal(reading.secondary, null)
  assert.deepEqual(reading.understanding.pattern.secondaryCandidates, ['S', 'C'])
})
check('known response mismatch blocks interpretation', () => {
  const mismatch = buildA1ProfessionalReport({ ...input, rawScores: { D: 21, I: 7, S: -14, C: -14 } })
  assert.equal(mismatch.understanding.responseState, 'score_mismatch')
  assert.equal(mismatch.reviewable, false)
  assert.equal(mismatch.interpretationAvailable, false)
  assert.deepEqual(mismatch.strengths, [])
})
check('missing historical responses are not manufactured', () => {
  const legacy = buildA1ProfessionalReport({ rawScores: first.scores })
  assert.equal(legacy.understanding.responseState, 'missing')
  assert.equal(legacy.understanding.answerCount, 0)
  assert.equal(legacy.understanding.questions.length, 0)
})
check('unknown versions are not reinterpreted with the current instrument', () => {
  const unknown = buildA1ProfessionalReport({ ...input, assessmentResponses: { ...first.responses, _meta: { questionnaireVersion: 'future.v9' } } })
  assert.equal(unknown.understanding.responseState, 'unsupported_version')
  assert.equal(unknown.reviewable, false)
})
check('missing and malformed do not become neutral scores', () => {
  const empty = buildA1ProfessionalReport({ rawScores: {}, c1Responses: c1 })
  assert.equal(empty.reviewable, false)
  assert.equal(empty.intensities.D, null)
  assert.equal(empty.context.experience, '5-10 años')
  assert.equal(patternEvidence({ D: 1, I: null, S: 0, C: -1 }).status, 'unavailable')
})
check('four optional clarifications', () => {
  assert.equal(report.understanding.questions.length, 4)
  assert.deepEqual(validateClarifications({ selections: {}, recognition: null }, report.understanding.questions), { selections: {}, recognition: null })
})
for (const option of RECOGNITION_OPTIONS) check(`recognition ${option.id} is a perspective, not score calibration`, () => {
  const result = validateClarifications({ selections: {}, recognition: option.id }, report.understanding.questions)
  assert.equal(result?.recognition, option.id)
})
const selected = report.understanding.questions[0]
const answers = { selections: { [selected.id]: selected.options[0].id }, recognition: 'contextual' }
const envelope = { version: UNDERSTANDING_VERSION, revision, savedAt: '2026-09-07T19:00:00.000Z', answers }
check('clarifications are applied only to their source revision', () => {
  const revised = buildA1ProfessionalReport({ ...input, c2Responses: { ...c2, [CLARIFICATION_KEY]: envelope } })
  assert.equal(revised.understanding.clarificationState, 'saved')
  assert.equal(revised.understanding.clarificationStatements.length, 1)
  assert.deepEqual(revised.rawScores, report.rawScores)
  assert.equal(revised.answeredContextItems, report.answeredContextItems)
  const stale = buildA1ProfessionalReport({ ...input, sourceRevision: 'b'.repeat(64), c2Responses: { ...c2, [CLARIFICATION_KEY]: envelope } })
  assert.equal(stale.understanding.clarificationState, 'stale')
  assert.deepEqual(stale.understanding.clarificationStatements, [])
})
check('declining a question is not behavioral evidence', () => {
  const value = buildIndividualUnderstanding({ scores: first.scores, responses: first.responses, revision, c2: { [CLARIFICATION_KEY]: { ...envelope, answers: { selections: { [selected.id]: 'no_example' }, recognition: 'unsure' } } } })
  assert.equal(value.clarificationStatements[0].isEvidence, false)
})
check('source and edit revisions have different jobs', () => {
  const base = { id: 'fixture-c2', responses: c2, completed_at: '2026-09-07T18:00:00Z', updated_at: null }
  const edited = { ...base, responses: { ...c2, [CLARIFICATION_KEY]: envelope }, updated_at: '2026-09-07T19:00:00Z' }
  assert.equal(a1SourceRevision(first, c1, base), a1SourceRevision(first, c1, edited))
  assert.notEqual(a1EditRevision(base), a1EditRevision(edited))
  assert.notEqual(a1SourceRevision(first, c1, base), a1SourceRevision(second, c1, base))
  assert.notEqual(a1SourceRevision(first, c1, base), a1SourceRevision(first, { ...c1, '3': 'Otro contexto' }, base))
})
check('input is never mutated', () => {
  const original = JSON.stringify(input)
  buildA1ProfessionalReport(input)
  assert.equal(JSON.stringify(input), original)
})
check('server boundary has ownership, concurrency and verified session checks', () => {
  const route = readFileSync('app/api/a1/clarifications/route.ts', 'utf8')
  for (const token of ["auth.getUser()", "resolve_pilot_access", ".eq('user_id', userId)", ".eq('id', snapshot.c2.id)", ".eq('responses', JSON.stringify(snapshot.c2.responses))"]) assert.ok(route.includes(token), token)
  assert.ok(!route.includes('user_metadata'))
  assert.ok(!route.includes('body.user'))
  const layout = readFileSync('app/despega/a1-report/layout.tsx', 'utf8')
  assert.ok(layout.includes('loadA1ReportBundle(journey.user.id)'))
  assert.match(layout, /if \(report\.reviewable\) \{\s+await recordJourneyTransition/)
})

async function httpTests() {
  const snapshot: ClarificationSnapshot = { revision, editRevision: 'b'.repeat(64), questions: report.understanding.questions }
  let loadCalls = 0, writes = 0, lastEnvelope: ClarificationEnvelope | null = null
  const deps: ClarificationDependencies<ClarificationSnapshot> = {
    authenticate: async () => 'fixture-user',
    load: async (id) => { assert.equal(id, 'fixture-user'); loadCalls++; return snapshot },
    persist: async (id, actual, value) => { assert.equal(id, 'fixture-user'); assert.equal(actual, snapshot); writes++; lastEnvelope = value; return true },
    now: () => '2026-09-07T19:00:00.000Z',
  }
  const valid = { revision, editRevision: snapshot.editRevision, answers }
  const req = (body: unknown, origin = 'https://dtc.test', method = 'PUT') => new Request('https://dtc.test/api/a1/clarifications', {
    method, headers: { origin, 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  })
  async function expect(name: string, request: Request, expected: number, override: Partial<typeof deps> = {}) {
    const response = await handleClarificationUpdate(request, { ...deps, ...override })
    assert.equal(response.status, expected, name)
    assert.equal(response.headers.get('cache-control'), 'private, no-store')
    checks++
    return response
  }
  await expect('valid save', req(valid), 200)
  assert.equal(writes, 1)
  assert.deepEqual(lastEnvelope, envelope)
  await expect('signed out', req(valid), 401, { authenticate: async () => null })
  assert.equal(loadCalls, 1)
  await expect('cross origin', req(valid, 'https://other.test'), 403)
  await expect('missing origin', req(valid, ''), 403)
  await expect('wrong verb', req(valid, 'https://dtc.test', 'POST'), 405)
  await expect('client identity injection', req({ ...valid, user_id: 'other-user' }), 400)
  await expect('unknown question', req({ ...valid, answers: { selections: { forged: 'enough' }, recognition: null } }), 422)
  await expect('unknown option', req({ ...valid, answers: { selections: { [selected.id]: 'invented' }, recognition: null } }), 422)
  await expect('stale sources', req({ ...valid, revision: 'c'.repeat(64) }), 409)
  await expect('stale edit', req({ ...valid, editRevision: 'c'.repeat(64) }), 409)
  await expect('race at write', req(valid), 409, { persist: async () => false })
  await expect('missing report', req(valid), 422, { load: async () => null })
  const failure = await expect('provider error redacted', req(valid), 503, { load: async () => { throw new Error('PRIVATE RESPONSE SECRET') } })
  assert.ok(!(await failure.text()).includes('SECRET'))
  await expect('oversized body', req({ ...valid, padding: 'x'.repeat(9000) }), 413)
  await expect('clear optional answers', req({ ...valid, answers: { selections: {}, recognition: null } }), 200)
  let won = false
  const concurrent = { ...deps, persist: async () => { if (won) return false; won = true; return true } }
  const responses = await Promise.all([handleClarificationUpdate(req(valid), concurrent), handleClarificationUpdate(req(valid), concurrent)])
  assert.deepEqual(responses.map((response) => response.status).sort(), [200, 409])
  checks++
  console.log(`DTC A1 individual understanding: PASS (${checks} grouped behavioral/source/HTTP-handler checks; synthetic storage; no live DB or browser)`)
}
httpTests().catch((error) => { console.error(error); process.exitCode = 1 })
