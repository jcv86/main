/** Pure reviewed-plan contracts and canonical projections. No SQL, Auth or live model claims. */
import assert from 'node:assert/strict'
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { join } from 'node:path'
import { buildJourneyFlow } from '../lib/journey/flow.ts'
import { buildGuidedNextAction } from '../lib/journey/next-action.ts'
import { adjustmentContent } from '../lib/a2/practice-adjustment.ts'
import {
  A2_PLAN_VERSION, A2_PLAN_CONTEXT_VERSION, A2_PLAN_COMMAND_VERSION, A2_PLAN_VIEW_VERSION,
  A2_PLAN_MAX_CONTENT_BYTES, a2PlanContentSchema, a2PlanCommandSchema, a2PlanInstantSchema,
  a2PlanContextProjectionSchema, a2PlanContextSnapshotSchema, a2ReviewedPlanSchema,
  a2PlanReceiptSchema, a2PlanViewSchema, a2PlanMutationResponseSchema,
  a2PlanModelMemorySchema, a2PlanAssistantEvidenceSchema,
  buildA2PlanContextProjection, a2PlanProjectionAvailable, assessA2PlanFreshness, buildA2PlanModelMemory,
  validateA2PlanTransition, validateA2PlanReviewDate, a2PlanCanComplete,
  a2PlanToday, isA2PlanCalendarDate,
} from '../lib/a2/plan-contract.ts'

const cases = [], results = []
const test = (name, run) => cases.push({ name, run })
const STEP_ONE = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
const STEP_TWO = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'
const RECORD = '00000000-0000-4000-8000-000000000701'
const PLAN_ID = '00000000-0000-4000-8000-000000000801'
const REQUEST_ID = '00000000-0000-4000-8000-000000000901'
const HASH = 'a'.repeat(64), OTHER_HASH = 'b'.repeat(64)
const TODAY = '2026-11-06'
const INSTANT = '2026-11-06T17:00:00+00:00'
const current = { status: 'current', reasons: [] }
let externalNetworkCalls = 0
const realFetch = globalThis.fetch
globalThis.fetch = async () => { externalNetworkCalls++; throw new Error('Pure plan contracts must not access a network') }

function fixture({ path = 'profesional', adjustmentStatus = 'available', objectiveStatus = 'missing' } = {}) {
  const flow = buildJourneyFlow({
    profile: { camino_foco: path, onboarding_conozcamonos_1_completed: true,
      a1_cerebral_intro_seen: true, a1_cerebral_completed: true, conozcamonos_2_completed: true,
      a1_report_seen: true, a2_intro_seen: true },
    access: { a1: true, a2: true, a3: false, a4: false }, currentModule: 'A2',
    highestA2DayUnlocked: 3, completedA2Days: [1, 2], completedA3Modules: [], a3RouteClosed: false,
  })
  const guidance = buildGuidedNextAction(flow, {
    objective: { status: objectiveStatus },
    adjustment: adjustmentStatus === 'available' ? { status: 'available', value: {
      id: RECORD, created_at: INSTANT, related_day: 3,
      content: adjustmentContent({ requestId: RECORD, dayNumber: 3, outcome: 'could_not', barrier: 'time',
        retainedWork: 'Conservo un esquema de presentación.', nextAction: 'Practicar diez minutos.', reviewDate: '2026-11-07' }),
    } } : { status: adjustmentStatus },
  })
  return { flow, guidance }
}

function context(options) {
  const { flow, guidance } = fixture(options)
  const projected = buildA2PlanContextProjection(flow, guidance)
  return a2PlanContextSnapshotSchema.parse({
    version: A2_PLAN_CONTEXT_VERSION, capturedAt: INSTANT, hash: HASH,
    available: projected.available, projection: projected.projection,
  })
}

function content() {
  return { version: A2_PLAN_VERSION, purpose: 'Retomar mi presentación con una acción pequeña.', constraints: 'Dispongo de diez minutos.',
    reviewDate: '2026-11-13', steps: [
      { id: STEP_ONE, title: 'Preparar', action: 'Elegir una parte del esquema que ya conservé.', status: 'pending' },
      { id: STEP_TWO, title: 'Practicar y revisar', action: 'Ensayar diez minutos y anotar una observación propia.', status: 'pending', note: '' },
    ] }
}

function plan(state = 'active') {
  const value = { id: PLAN_ID, revision: 2, state, content: content(), contextSnapshot: context(),
    createdAt: INSTANT, updatedAt: '2026-11-06T17:01:00+00:00', confirmedAt: '2026-11-06T17:01:00+00:00' }
  if (state === 'completed') value.content.steps.forEach(step => { step.status = 'reported_done' })
  return value
}

function command(operation = 'save') {
  return { version: A2_PLAN_COMMAND_VERSION, requestId: REQUEST_ID, expectedRevision: 2, operation,
    ...(operation === 'save' ? { content: content(), expectedContextHash: HASH } : {}),
    ...(operation === 'resume' ? { expectedContextHash: HASH } : {}),
  }
}

function view(saved = plan()) {
  return { version: A2_PLAN_VIEW_VERSION, revision: saved?.revision || 0, plan: saved, context: context(),
    freshness: saved ? current : { status: 'none', reasons: ['no_saved_plan'] }, guidance: fixture().guidance }
}

function receipt() {
  return { requestId: REQUEST_ID, planId: PLAN_ID, revision: 2, state: 'active', committedAt: '2026-11-06T17:01:00Z', replayed: false }
}

function reject(schema, value) { assert.equal(schema.safeParse(value).success, false) }
function freeze(value) {
  if (value && typeof value === 'object') { Object.freeze(value); Object.values(value).forEach(freeze) }
  return value
}

test('Content normalizes declared text and UUID casing while preserving reviewed order', () => {
  const value = content()
  value.purpose = '  Propósito revisado  '
  value.constraints = '   '
  value.steps[0].id = STEP_ONE.toUpperCase()
  value.steps[0].title = '  Primer paso  '
  const parsed = a2PlanContentSchema.parse(value)
  assert.equal(parsed.purpose, 'Propósito revisado')
  assert.equal(parsed.constraints, '')
  assert.equal(parsed.steps[0].id, STEP_ONE)
  assert.equal(parsed.steps[0].title, 'Primer paso')
  assert.equal(parsed.steps[1].id, STEP_TWO)
})

test('Exactly one through five steps are supported without inventing additional work', () => {
  for (let count = 1; count <= 5; count++) {
    const value = content()
    value.steps = Array.from({ length: count }, (_, index) => ({ ...value.steps[0], id: `00000000-0000-4000-8000-${String(index + 1).padStart(12, '0')}` }))
    assert.equal(a2PlanContentSchema.parse(value).steps.length, count)
  }
  const empty = content(); empty.steps = []; reject(a2PlanContentSchema, empty)
  const tooMany = content(); tooMany.steps = Array.from({ length: 6 }, (_, index) => ({ ...tooMany.steps[0], id: `00000000-0000-4000-8000-${String(index + 1).padStart(12, '0')}` }))
  reject(a2PlanContentSchema, tooMany)
})

for (const [name, mutate] of [
  ['duplicate IDs', value => { value.steps[1].id = value.steps[0].id.toUpperCase() }],
  ['fake UUID', value => { value.steps[0].id = 'step-1' }],
  ['empty purpose', value => { value.purpose = '   ' }],
  ['oversized purpose', value => { value.purpose = 'x'.repeat(501) }],
  ['oversized constraints', value => { value.constraints = 'x'.repeat(1_001) }],
  ['oversized action', value => { value.steps[0].action = 'x'.repeat(601) }],
  ['oversized title', value => { value.steps[0].title = 'x'.repeat(121) }],
  ['oversized note', value => { value.steps[0].note = 'x'.repeat(301) }],
  ['completion-state substitution', value => { value.steps[0].status = 'completed' }],
  ['client-supplied destination', value => { value.steps[0].href = '/despega/a4' }],
  ['client-supplied tool', value => { value.steps[0].tool = 'complete_day' }],
  ['owner reassignment', value => { value.userId = RECORD }],
  ['capability score', value => { value.steps[0].score = 100 }],
  ['unsupported version', value => { value.version = 'dtc-a2-plan.v2' }],
]) {
  test(`Content rejects ${name}`, () => { const value = content(); mutate(value); reject(a2PlanContentSchema, value) })
}

test('Serialized UTF-8 byte limit is enforced in addition to character limits', () => {
  const value = content()
  value.purpose = '漢'.repeat(500); value.constraints = '漢'.repeat(1_000)
  value.steps = Array.from({ length: 5 }, (_, index) => ({
    id: `00000000-0000-4000-8000-${String(index + 1).padStart(12, '0')}`,
    title: '漢'.repeat(120), action: '漢'.repeat(600), status: 'pending', note: '漢'.repeat(300),
  }))
  assert.ok(new TextEncoder().encode(JSON.stringify(value)).byteLength > A2_PLAN_MAX_CONTENT_BYTES)
  reject(a2PlanContentSchema, value)
  const ascii = JSON.parse(JSON.stringify(value).replaceAll('漢', 'x'))
  assert.ok(a2PlanContentSchema.safeParse(ascii).success)
})

test('Calendar dates reject nonexistent days, loose formats and year zero', () => {
  for (const date of ['2026-11-06', '2028-02-29', '2026-12-31']) assert.equal(isA2PlanCalendarDate(date), true)
  for (const date of ['2026-02-29', '2026-02-30', '2026-04-31', '0000-01-01', '2026-1-1', '2026-11-06T00:00:00Z', ' 2026-11-06', '2026-13-01', 'not a date']) {
    assert.equal(isA2PlanCalendarDate(date), false)
    const value = content(); value.reviewDate = date; reject(a2PlanContentSchema, value)
  }
})

test('Save and resume dates use the inclusive 30-calendar-day window', () => {
  assert.deepEqual(validateA2PlanReviewDate(TODAY, TODAY), { ok: true })
  assert.deepEqual(validateA2PlanReviewDate('2026-12-06', TODAY), { ok: true })
  assert.deepEqual(validateA2PlanReviewDate('2026-12-07', TODAY), { ok: false, code: 'plan_review_date_invalid' })
  assert.deepEqual(validateA2PlanReviewDate('2026-11-05', TODAY), { ok: false, code: 'plan_expired' })
  assert.deepEqual(validateA2PlanReviewDate('2026-10-01', '2026-09-01'), { ok: true }, 'DST changes do not change the calendar-day count')
  assert.equal(validateA2PlanReviewDate(TODAY, 'invalid').ok, false)
})

test('Chile date uses America/Santiago independently of the host date', () => {
  assert.equal(a2PlanToday(new Date('2026-11-07T01:30:00Z')), '2026-11-06')
  assert.equal(a2PlanToday(new Date('2026-07-07T03:30:00Z')), '2026-07-06')
  assert.throws(() => a2PlanToday(NaN))
})

test('Canonical flow and guidance produce a detached minimal context with source revisions', () => {
  const input = fixture(), before = JSON.stringify(input)
  freeze(input)
  const result = buildA2PlanContextProjection(input.flow, input.guidance)
  assert.equal(result.available, true)
  assert.deepEqual(result.projection.next, input.flow.next)
  assert.deepEqual(result.projection.completedDays, [1, 2])
  assert.equal(result.projection.adjustment.dayNumber, 3)
  assert.equal(result.projection.sources.find(source => source.id === 'adjustment').recordId, RECORD)
  assert.equal(result.projection.sources.find(source => source.id === 'adjustment').recordedAt, INSTANT)
  assert.equal(JSON.stringify(input), before)
  assert.doesNotMatch(JSON.stringify(result), /a1_cerebral|rawScores|conversation|assessmentId/)
  result.projection.next.label = 'Detached result'
  assert.notEqual(input.flow.next.label, result.projection.next.label)
})

test('Normalization makes source and completed-day ordering deterministic', () => {
  const one = fixture(), two = fixture()
  two.flow.completedDays = [2, 1, 2]
  two.guidance.sources.reverse()
  assert.deepEqual(buildA2PlanContextProjection(one.flow, one.guidance), buildA2PlanContextProjection(two.flow, two.guidance))
})

test('Missing sources are valid while failed reads are unavailable', () => {
  const missing = context({ adjustmentStatus: 'missing', objectiveStatus: 'missing' })
  assert.equal(missing.available, true)
  assert.equal(a2PlanProjectionAvailable(missing.projection), true)
  assert.equal(missing.projection.objective, null)
  assert.equal(missing.projection.adjustment, null)
  const failed = context({ objectiveStatus: 'unavailable' })
  assert.equal(failed.available, false)
  assert.equal(a2PlanProjectionAvailable(failed.projection), false)
  assert.equal(failed.projection.sources.find(source => source.id === 'objective').status, 'unavailable')
  reject(a2PlanContextSnapshotSchema, { ...failed, available: true })
})

test('An omitted relevant source read cannot be labelled a verified missing row', () => {
  const { flow } = fixture()
  const guidance = buildGuidedNextAction(flow)
  const result = buildA2PlanContextProjection(flow, guidance)
  assert.equal(result.available, false)
  assert.equal(a2PlanProjectionAvailable(result.projection), false)
  assert.deepEqual(result.projection.sources.map(source => source.id), ['journey'])
})

test('Personal practice omits the workplace objective and preserves its own current action', () => {
  const input = fixture({ path: 'persona' })
  const result = buildA2PlanContextProjection(input.flow, input.guidance)
  assert.equal(result.available, true)
  assert.equal(result.projection.practicePath, 'persona')
  assert.equal(result.projection.objective, null)
  assert.equal(result.projection.sources.some(source => source.id === 'objective'), false)
  assert.deepEqual(result.projection.next, input.flow.next)
})

for (const [name, mutate] of [
  ['different canonical destination', ({ guidance }) => { guidance.action.href = '/despega/a4' }],
  ['different canonical wording', ({ guidance }) => { guidance.action.label = 'Override the server' }],
  ['external navigation', ({ flow, guidance }) => { flow.next.href = guidance.action.href = 'https://evil.invalid' }],
  ['adjustment for another day', ({ guidance }) => { guidance.adjustment.dayNumber = 4 }],
  ['adjustment for completed day', ({ flow }) => { flow.completedDays.push(3) }],
  ['unverified objective payload', ({ guidance }) => { guidance.objective = { summary: 'Invented declaration' } }],
  ['duplicate sources', ({ guidance }) => { guidance.sources[1] = { ...guidance.sources[0] } }],
  ['missing stored-source revision', ({ guidance }) => { delete guidance.sources.find(source => source.id === 'adjustment').recordedAt }],
  ['invented journey row revision', ({ guidance }) => { guidance.sources[0].recordId = RECORD; guidance.sources[0].recordedAt = INSTANT }],
  ['malformed completion row', ({ flow }) => { flow.completedDays.push('3') }],
  ['lost progress read', ({ flow }) => { flow.completedDays = null }],
]) {
  test(`Projection rejects ${name}`, () => {
    const input = fixture(); mutate(input)
    assert.throws(() => buildA2PlanContextProjection(input.flow, input.guidance))
  })
}

test('Projection rejects extra data and false availability bindings', () => {
  const value = context().projection
  reject(a2PlanContextProjectionSchema, { ...value, rawScores: { D: 12 } })
  reject(a2PlanContextProjectionSchema, { ...value, completedDays: [2, 1] })
  reject(a2PlanContextProjectionSchema, { ...value, completedDays: [1, 1] })
  const falseSource = structuredClone(value)
  falseSource.sources.find(source => source.id === 'adjustment').status = 'missing'
  reject(a2PlanContextProjectionSchema, falseSource)
})

test('Wire records accept PostgREST offset timestamps but reject forged owner or invalid receipt metadata', () => {
  assert.ok(a2ReviewedPlanSchema.safeParse(plan()).success)
  assert.ok(a2PlanReceiptSchema.safeParse(receipt()).success)
  reject(a2ReviewedPlanSchema, { ...plan(), userId: RECORD })
  reject(a2ReviewedPlanSchema, { ...plan(), confirmedAt: '2026-11-07T17:00:00+00:00' })
  reject(a2ReviewedPlanSchema, { ...plan(), state: 'deleted' })
  reject(a2PlanReceiptSchema, { ...receipt(), revision: 0 })
  reject(a2PlanReceiptSchema, { ...receipt(), content: content() })
})

test('Timestamp bounds preserve source ISO offsets without allowing an unbounded snapshot', () => {
  assert.equal(a2PlanInstantSchema.parse(INSTANT), INSTANT)
  assert.ok(a2PlanInstantSchema.safeParse('2026-11-06T17:00:00.123456+00:00').success)
  const oversized = '2026-11-06T17:00:00.' + '1'.repeat(65) + 'Z'
  assert.ok(Number.isFinite(Date.parse(oversized)))
  reject(a2PlanInstantSchema, oversized)
  const snapshot = context()
  snapshot.projection.sources.find(source => source.id === 'adjustment').recordedAt = oversized
  reject(a2PlanContextSnapshotSchema, snapshot)
})

test('Text storage boundary accepts complete Unicode and rejects NUL or lone UTF16 surrogates', () => {
  assert.ok(a2PlanContentSchema.safeParse({ ...content(), purpose: 'Practicar mañana 🧭 y revisar avances.' }).success)
  for (const invalid of ['\u0000', '\uD800', '\uDC00', '\uD800x\uDC00']) {
    reject(a2PlanContentSchema, { ...content(), purpose: 'Revisar ' + invalid + ' el plan.' })
  }
  const invalidStep = content()
  invalidStep.steps[0].note = 'Nota con \u0000 sin guardar'
  reject(a2PlanContentSchema, invalidStep)
})

test('Freshness distinguishes no plan, current, changed, unavailable and expired', () => {
  const saved = plan(), snapshot = context()
  assert.equal(assessA2PlanFreshness(null, null, TODAY).status, 'none')
  assert.deepEqual(assessA2PlanFreshness(saved, snapshot, TODAY), current)
  assert.equal(assessA2PlanFreshness(saved, { ...snapshot, hash: OTHER_HASH }, TODAY).status, 'changed')
  assert.equal(assessA2PlanFreshness(saved, null, TODAY).status, 'unavailable')
  assert.equal(assessA2PlanFreshness(saved, { ...snapshot, available: false }, TODAY).status, 'unavailable')
  assert.equal(assessA2PlanFreshness(saved, snapshot, '2026-11-14').status, 'expired')
  assert.equal(assessA2PlanFreshness(saved, snapshot, '2026-11-13').status, 'current', 'Review day is still valid')
  assert.equal(assessA2PlanFreshness(saved, snapshot, 'invalid').status, 'unavailable')
  assert.equal(assessA2PlanFreshness({ ...saved, revision: 0 }, snapshot, TODAY).status, 'unavailable')
})

test('A later observation time with the same authoritative hash is still current', () => {
  const refreshed = { ...context(), capturedAt: '2026-11-06T18:00:00+00:00' }
  assert.equal(assessA2PlanFreshness(plan(), refreshed, TODAY).status, 'current')
})

test('Lifecycle and freshness remain independent', () => {
  for (const state of ['paused', 'completed', 'cancelled']) {
    const saved = plan(state)
    assert.equal(assessA2PlanFreshness(saved, context(), TODAY).status, 'current')
    assert.equal(assessA2PlanFreshness(saved, context(), '2026-11-14').status, 'expired')
    assert.equal(saved.state, state)
  }
})

test('Commands accept only the exact fields of each operation', () => {
  for (const operation of ['save', 'pause', 'resume', 'complete', 'cancel', 'delete']) {
    assert.equal(a2PlanCommandSchema.parse(command(operation)).operation, operation)
  }
  const save = command(); delete save.expectedContextHash; reject(a2PlanCommandSchema, save)
  const resume = command('resume'); delete resume.expectedContextHash; reject(a2PlanCommandSchema, resume)
  reject(a2PlanCommandSchema, { ...command('pause'), content: content() })
  reject(a2PlanCommandSchema, { ...command('cancel'), expectedContextHash: HASH })
  reject(a2PlanCommandSchema, { ...command(), userId: RECORD })
  reject(a2PlanCommandSchema, { ...command(), state: 'completed' })
  reject(a2PlanCommandSchema, { ...command(), expectedRevision: -1 })
  reject(a2PlanCommandSchema, { ...command(), expectedRevision: 1.5 })
  reject(a2PlanCommandSchema, { ...command(), expectedContextHash: HASH.toUpperCase() })
  assert.ok(a2PlanCommandSchema.safeParse({ ...command(), expectedRevision: 0 }).success)
})

test('An explicit save can activate an initial or newly reviewed revision from any prior state', () => {
  for (const saved of [null, plan(), plan('paused'), plan('completed'), plan('cancelled')]) {
    assert.deepEqual(validateA2PlanTransition(saved, command(), { status: 'changed', reasons: ['context_changed'] }, TODAY), { ok: true })
  }
  const expired = command(); expired.content.reviewDate = '2026-11-05'
  assert.deepEqual(validateA2PlanTransition(plan(), expired, current, TODAY), { ok: false, code: 'plan_expired' })
})

test('Pause, resume and cancellation obey their source states', () => {
  for (const state of ['active', 'paused', 'completed', 'cancelled']) {
    const saved = plan(state)
    assert.equal(validateA2PlanTransition(saved, command('pause'), current, TODAY).ok, state === 'active')
    assert.equal(validateA2PlanTransition(saved, command('resume'), current, TODAY).ok, state === 'paused')
    assert.equal(validateA2PlanTransition(saved, command('cancel'), current, TODAY).ok, state === 'active' || state === 'paused')
  }
  assert.deepEqual(validateA2PlanTransition(null, command('pause'), current, TODAY), { ok: false, code: 'plan_not_found' })
})

test('Resume requires current available context and a valid review date', () => {
  const saved = plan('paused')
  for (const [status, code] of [['changed', 'plan_context_changed'], ['unavailable', 'plan_context_unavailable'], ['expired', 'plan_expired'], ['none', 'plan_context_unavailable']]) {
    assert.deepEqual(validateA2PlanTransition(saved, command('resume'), { status, reasons: [] }, TODAY), { ok: false, code })
  }
  assert.deepEqual(validateA2PlanTransition(saved, command('resume'), current, '2026-11-14'), { ok: false, code: 'plan_expired' })
})

test('A changed, unavailable or expired plan can still be cancelled or its content deleted', () => {
  for (const status of ['changed', 'unavailable', 'expired']) {
    const freshness = { status, reasons: [] }
    assert.deepEqual(validateA2PlanTransition(plan(), command('cancel'), freshness, '2026-11-14'), { ok: true })
    for (const state of ['active', 'paused', 'completed', 'cancelled']) {
      assert.deepEqual(validateA2PlanTransition(plan(state), command('delete'), freshness, '2026-11-14'), { ok: true })
    }
  }
  assert.equal(validateA2PlanTransition(null, command('delete'), current, TODAY).ok, false)
})

test('Plan completion requires explicit step declarations, not module progress', () => {
  const saved = plan()
  assert.equal(a2PlanCanComplete(saved.content), false)
  assert.deepEqual(validateA2PlanTransition(saved, command('complete'), current, TODAY), { ok: false, code: 'plan_incomplete' })
  saved.content.steps.forEach(step => { step.status = 'skipped' })
  assert.equal(a2PlanCanComplete(saved.content), false)
  saved.content.steps[0].status = 'reported_done'
  assert.equal(a2PlanCanComplete(saved.content), true)
  assert.deepEqual(validateA2PlanTransition(saved, command('complete'), current, TODAY), { ok: true })
  saved.state = 'paused'
  assert.equal(validateA2PlanTransition(saved, command('complete'), current, TODAY).ok, true)
  const invalidCompleted = plan(); invalidCompleted.state = 'completed'; reject(a2ReviewedPlanSchema, invalidCompleted)
})

test('View validates slot revision, saved plan and current guidance together', () => {
  const value = view()
  assert.ok(a2PlanViewSchema.safeParse(value).success)
  reject(a2PlanViewSchema, { ...value, revision: value.revision + 1 })
  reject(a2PlanViewSchema, { ...value, context: null })
  reject(a2PlanViewSchema, { ...value, context: { ...value.context, hash: OTHER_HASH } })
  const changedGuidance = structuredClone(value)
  changedGuidance.guidance.action.href = '/despega/a4'
  reject(a2PlanViewSchema, changedGuidance)
  assert.ok(a2PlanViewSchema.safeParse({ ...value, context: null, guidance: null,
    freshness: { status: 'unavailable', reasons: ['context_unavailable'] } }).success)
})

test('Deleted content preserves a nonzero owner-slot revision without reviving an old plan', () => {
  const deleted = { ...view(null), revision: 4 }
  assert.ok(a2PlanViewSchema.safeParse(deleted).success)
  const response = { ...deleted, receipt: { ...receipt(), revision: 4, state: 'deleted' } }
  assert.ok(a2PlanMutationResponseSchema.safeParse(response).success)
  assert.equal(response.plan, null)
})

test('Replay receipt can describe an older operation while the view preserves newer cancellation', () => {
  const saved = plan('cancelled'); saved.revision = 3
  const result = { ...view(saved), receipt: { ...receipt(), replayed: true } }
  assert.ok(a2PlanMutationResponseSchema.safeParse(result).success)
  assert.equal(result.plan.state, 'cancelled')
  assert.equal(result.receipt.state, 'active')
  reject(a2PlanViewSchema, result, 'POST must use the receipt-aware schema')
  reject(a2PlanMutationResponseSchema, { ...result, receipt: { ...result.receipt, revision: 4 } })
  reject(a2PlanMutationResponseSchema, { ...result, receipt: { ...result.receipt, planId: STEP_ONE } })
})

test('Only active and current plans become model memory', () => {
  assert.ok(buildA2PlanModelMemory(plan(), current))
  for (const state of ['paused', 'completed', 'cancelled']) assert.equal(buildA2PlanModelMemory(plan(state), current), null)
  for (const status of ['none', 'changed', 'unavailable', 'expired']) {
    assert.equal(buildA2PlanModelMemory(plan(), { status, reasons: [] }), null)
  }
  assert.equal(buildA2PlanModelMemory(null, current), null)
  assert.equal(buildA2PlanModelMemory({ ...plan(), revision: 0 }, current), null)
  assert.equal(buildA2PlanModelMemory(plan(), { status: 'current', reasons: 'invalid' }), null)
})

test('Model memory strips structural and free-text IDs/URLs while retaining declared meaning and order', () => {
  const saved = plan()
  saved.content.purpose = `Retomar ${PLAN_ID} y revisar https://example.invalid/entry.`
  saved.content.constraints = 'Sólo diez minutos. Ver www.example.invalid o //example.invalid/path.'
  saved.content.steps[0].action = 'Revisar [el material](/despega/a2/dia-3) antes de practicar.'
  saved.content.steps[0].status = 'reported_done'
  saved.content.steps[0].note = `Lo anoté en ${RECORD}.`
  const before = JSON.stringify(saved)
  const memory = buildA2PlanModelMemory(freeze(saved), current)
  assert.ok(a2PlanModelMemorySchema.safeParse(memory).success)
  assert.doesNotMatch(JSON.stringify(memory), /https?:|www\.|\/\/example|\/despega|00000000-|aaaaaaaa-aaaa|userId|recordId|contextSnapshot/)
  assert.equal(memory.kind, 'reviewed_user_intentions')
  assert.equal(memory.completionMeaning, 'user_declaration_only')
  assert.equal(memory.steps[0].status, 'reported_done')
  assert.deepEqual(memory.steps.map(step => step.position), [1, 2])
  assert.match(memory.purpose, /enlace omitido/)
  assert.equal(JSON.stringify(saved), before)
  reject(a2PlanModelMemorySchema, { ...memory, userId: RECORD })
  reject(a2PlanModelMemorySchema, { ...memory, purpose: 'Abrir https://evil.invalid' })
})

test('Assistant evidence sends unavailable states without saved content', () => {
  const memory = buildA2PlanModelMemory(plan(), current)
  assert.ok(a2PlanAssistantEvidenceSchema.safeParse({ status: 'available', memory }).success)
  for (const status of ['missing', 'inactive', 'changed', 'expired', 'unavailable']) {
    assert.ok(a2PlanAssistantEvidenceSchema.safeParse({ status, memory: null }).success)
    reject(a2PlanAssistantEvidenceSchema, { status, memory })
    reject(a2PlanAssistantEvidenceSchema, { status, memory: null, purpose: 'Hidden old text' })
  }
  reject(a2PlanAssistantEvidenceSchema, { status: 'available', memory: null })
})

test('Pure operations do not change journey completion, access, pending day or saved inputs', () => {
  const input = fixture(), saved = plan(), request = command('pause')
  const before = JSON.stringify({ input, saved, request })
  freeze(input); freeze(saved); freeze(request)
  buildA2PlanContextProjection(input.flow, input.guidance)
  assessA2PlanFreshness(saved, context(), TODAY)
  validateA2PlanTransition(saved, request, current, TODAY)
  buildA2PlanModelMemory(saved, current)
  assert.equal(JSON.stringify({ input, saved, request }), before)
  assert.deepEqual(input.flow.completedDays, [1, 2])
  assert.equal(input.flow.next.href, '/despega/a2/dia-3')
  assert.equal(input.flow.radarAvailable, false)
})

try {
  for (const { name, run } of cases) {
    try { await run(); results.push({ name, status: 'passed' }) }
    catch (error) { results.push({ name, status: 'failed', error: error.message }); process.exitCode = 1; console.error(`${name}: ${error.message}`) }
  }
  assert.equal(externalNetworkCalls, 0)
  const paths = ['lib/a2/plan-contract.ts', 'scripts/test-a2-plan-contract.mjs']
  const evidence = {
    suite: 'a2-reviewed-plan-contract', cases: cases.length, passed: results.filter(result => result.status === 'passed').length,
    actualContracts: true, actualCanonicalJourneyProjection: true, pureHelpersOnly: true,
    realDatabase: false, remoteAuth: false, modelCalls: 0, externalNetworkCalls, productionRollout: false,
    sourceHashes: paths.map(path => ({ path, sha256: createHash('sha256').update(readFileSync(path)).digest('hex') })), results,
  }
  if (process.env.DTC_AGENTIC_QA_OUTPUT) {
    mkdirSync(process.env.DTC_AGENTIC_QA_OUTPUT, { recursive: true })
    writeFileSync(join(process.env.DTC_AGENTIC_QA_OUTPUT, 'a2-plan-contract.json'), JSON.stringify(evidence, null, 2) + '\n')
  }
  console.log(JSON.stringify({ suite: evidence.suite, cases: evidence.cases, passed: evidence.passed, modelCalls: 0, externalNetworkCalls }))
} finally { globalThis.fetch = realFetch }
