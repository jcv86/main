// Prepared regression cases. Run only in an authorized isolated environment:
// node --import tsx scripts/test-outcome-response-capture.cjs
// This suite has not been executed as part of the initial draft.
const assert = require('node:assert/strict')
const {
  CAPTURE_INSTRUMENTS, OUTCOME_CAPTURE_VERSION, CaptureValidationError,
  parseOutcomeCapture, captureObservation, captureNextAction, responseWordCount,
} = require('../lib/outcomes/response-capture.ts')

const cases = []
const test = (name, run) => cases.push({ name, run })
const ID = '00000000-0000-4000-8000-000000000701'
const TEXT = 'Esta respuesta sintética describe un ejercicio de ejemplo sin datos personales reales.'
function input(key = 'a1_professional_clarity', role = 'baseline') {
  const instrument = CAPTURE_INSTRUMENTS[key]
  return {
    observationId: ID, instrumentKey: key, instrumentVersion: OUTCOME_CAPTURE_VERSION,
    outcomeKey: instrument.outcomeKey, measurementRole: role,
    responsePayload: Object.fromEntries(instrument.prompts.map(({ key }) => [key, TEXT])),
  }
}
function rejects(value, status = 400) {
  assert.throws(() => parseOutcomeCapture(value), error => error instanceof CaptureValidationError && error.status === status)
}

for (const key of Object.keys(CAPTURE_INSTRUMENTS)) {
  for (const role of ['baseline', 'follow_up']) {
    test(`${key}: accepts complete ${role} responses without accepting a score`, () => {
      const value = input(key, role)
      const result = parseOutcomeCapture(value)
      assert.equal(result.instrumentKey, key)
      assert.equal(result.measurementRole, role)
      assert.deepEqual(result.responsePayload, value.responsePayload)
      assert.equal(Object.hasOwn(result, 'score'), false)
    })
  }
}

test('Spanish, spaces, tabs and newlines use the same word boundary', () => {
  const text = 'Necesito\tpreparar\nmejor mis ejemplos de gestión'
  assert.equal(responseWordCount(text), 7)
  const value = input()
  value.responsePayload.target = text
  assert.equal(parseOutcomeCapture(value).responsePayload.target, text)
})
test('normal A1 responses meet the five-word input threshold', () => {
  const value = input()
  value.responsePayload = {
    target: 'Busco un cargo de análisis financiero',
    value: 'Organizo información financiera para apoyar decisiones',
    evidence: 'Preparé reportes mensuales para mi equipo',
    gap: 'Necesito practicar cómo presentar mis resultados',
  }
  assert.deepEqual(parseOutcomeCapture(value).responsePayload, value.responsePayload)
})
test('legacy clients receive an upgrade response before any capture can be built', () => {
  rejects({ ...input(), instrumentVersion: '1', score: 16, confidence: 1 }, 409)
})
test('unknown versions, instruments, phases and outcomes fail closed', () => {
  for (const patch of [
    { instrumentVersion: 'future' }, { instrumentKey: 'toString' }, { instrumentKey: 'constructor' },
    { instrumentKey: 'unknown' }, { measurementRole: 'external_outcome' },
    { outcomeKey: 'interview_capability' }, { observationId: 'not-an-id' },
  ]) rejects({ ...input(), ...patch })
})
test('client scores, identity, timestamps and references cannot be persisted as evidence', () => {
  for (const [key, value] of Object.entries({
    score: 16, confidence: 1, dimensions: {}, evidenceRefs: [], scoreScaleMin: 0,
    userId: 'different-owner', user_id: 'different-owner', observedAt: '2020-01-01', stage: 'a4',
  })) rejects({ ...input(), [key]: value })
})
test('missing or extra response keys are rejected', () => {
  const missing = input(); delete missing.responsePayload.gap; rejects(missing)
  const extra = input(); extra.responsePayload.extra = TEXT; rejects(extra)
})
test('all required input shapes are checked', () => {
  for (const value of [null, [], 'text', 42, {}, { ...input(), responsePayload: [] }]) rejects(value)
})
test('empty, non-text and too-short answers are rejected', () => {
  for (const text of ['', '   ', 'una palabra', 1, null, []]) {
    const value = input(); value.responsePayload.target = text; rejects(value)
  }
})
test('overlong answers are not silently truncated', () => {
  const value = input(); value.responsePayload.target = 'palabra '.repeat(130); rejects(value)
})
test('capture normalization does not mutate the request', () => {
  const value = input(); value.responsePayload.target = '  ' + TEXT + '  '
  const previous = structuredClone(value)
  assert.equal(parseOutcomeCapture(value).responsePayload.target, TEXT)
  assert.deepEqual(value, previous)
})
test('server identity and observation time are explicit inputs, not answer metadata', () => {
  const value = captureObservation(parseOutcomeCapture(input()), 'synthetic-owner', '2026-10-14T12:00:00Z')
  assert.equal(value.user_id, 'synthetic-owner')
  assert.equal(value.observed_at, '2026-10-14T12:00:00Z')
  assert.equal(value.instrument_version, '2-capture')
  assert.equal(value.id, ID)
})
test('repetition can never produce a score or confidence from capture', () => {
  const value = input()
  for (const key of Object.keys(value.responsePayload)) value.responsePayload[key] = 'resultado '.repeat(30).trim()
  const record = captureObservation(parseOutcomeCapture(value), 'synthetic-owner', '2026-10-14T12:00:00Z')
  for (const key of ['score', 'score_scale_min', 'score_scale_max', 'confidence']) assert.equal(record[key], null)
  assert.deepEqual(record.dimensions, {})
  assert.equal(Object.hasOwn(record, 'normalized_delta'), false)
})
test('evidence references refer only to the current captured answers', () => {
  const record = captureObservation(parseOutcomeCapture(input()), 'synthetic-owner', '2026-10-14T12:00:00Z')
  assert.equal(record.evidence_refs.length, 4)
  assert.ok(record.evidence_refs.every(ref => ref.source === 'captured_response' && ref.ref.startsWith(ID + '#')))
})
test('each stage offers a next step without an uncalibrated score', () => {
  for (const instrument of Object.values(CAPTURE_INSTRUMENTS)) {
    assert.ok(captureNextAction(instrument, 'baseline').length > 30)
    assert.ok(captureNextAction(instrument, 'follow_up').length > 30)
    assert.notEqual(captureNextAction(instrument, 'baseline'), captureNextAction(instrument, 'follow_up'))
  }
})

let failed = 0
for (const { name, run } of cases) {
  try { run() } catch (error) { failed++; console.error(JSON.stringify({ name, error: error.message })) }
}
console.log(JSON.stringify({ suite: 'outcome-response-capture', cases: cases.length, passed: cases.length - failed, failed, liveDatabaseWrites: 0 }))
if (failed) process.exitCode = 1
