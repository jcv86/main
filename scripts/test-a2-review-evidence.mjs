/** Actual AG05 contracts, source readers, plan hashing and route.
 * The real Supabase SELECT builder talks only to synthetic HTTP/session ports.
 * This suite does not claim live SQL/RLS, browser, or model evidence. */
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { createRequire } from 'node:module'
import { resolve, join } from 'node:path'
import ts from 'typescript'
import { createClient } from '@supabase/supabase-js'
import { buildJourneyFlow } from '../lib/journey/flow.ts'
import { buildGuidedNextAction } from '../lib/journey/next-action.ts'
import * as contract from '../lib/a2/review-evidence-contract.ts'
import * as planContract from '../lib/a2/plan-contract.ts'
import * as captureContract from '../lib/outcomes/response-capture.ts'
import * as captureHistory from '../lib/outcomes/response-history.ts'
import * as planApi from '../lib/a2/plan-api.ts'

const require = createRequire(import.meta.url), modules = new Map()
const serverPaths = ['lib/a2/plan-context.ts', 'lib/a2/plan-service.ts', 'lib/a2/review-evidence-service.ts']
function loadServer(file) {
  const filename = resolve(file)
  if (modules.has(filename)) return modules.get(filename).exports
  assert.ok(serverPaths.some(path => resolve(path) === filename), 'Unexpected server source')
  const module = { exports: {} }; modules.set(filename, module)
  const compiled = ts.transpileModule(readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText
  new Function('require', 'module', 'exports', compiled)(key => {
    if (key === 'server-only') return {}
    if (key === './plan-contract') return planContract
    if (key === './review-evidence-contract') return contract
    if (key === './plan-context') return loadServer('lib/a2/plan-context.ts')
    if (key === '@/lib/outcomes/response-history') return captureHistory
    if (key === '@/lib/outcomes/response-capture') return captureContract
    if (key.startsWith('node:')) return require(key)
    throw Error('Unexpected server dependency: ' + key)
  }, module, module.exports)
  return module.exports
}
const contextService = loadServer('lib/a2/plan-context.ts')
const planService = loadServer('lib/a2/plan-service.ts')
const service = loadServer('lib/a2/review-evidence-service.ts')
const { makeA2PlanContextSnapshot, readA2PlanContextSnapshot } = contextService
const USER = '00000000-0000-4000-8000-000000005001', OTHER = '00000000-0000-4000-8000-000000005002'
const INITIAL = '00000000-0000-4000-8000-000000005010', FOLLOW = '00000000-0000-4000-8000-000000005011'
const OPEN = '00000000-0000-4000-8000-000000005020', CLOSED = '00000000-0000-4000-8000-000000005021'
const SIGNAL = '00000000-0000-4000-8000-000000005030', PLAN = '00000000-0000-4000-8000-000000005040'
const STEP = '00000000-0000-4000-8000-000000005041', REQUEST = '00000000-0000-4000-8000-000000005042'
const NOW = new Date('2026-11-06T20:00:00.000Z'), TODAY = '2026-11-06', PRIVATE = 'PRIVATE_SYNTHETIC_FAILURE'
let externalNetworkCalls = 0, syntheticDatabaseHttp = 0
globalThis.fetch = async () => { externalNetworkCalls++; throw Error('External HTTP is forbidden') }
const tests = [], test = (name, run) => tests.push({ name, run }), copy = value => structuredClone(value)

function flow(path = 'profesional', allowed = { a3: true, a4: true }) {
  return buildJourneyFlow({
    profile: { camino_foco: path, onboarding_conozcamonos_1_completed: true, a1_cerebral_intro_seen: true,
      a1_cerebral_completed: true, conozcamonos_2_completed: true, a1_report_seen: true, a2_intro_seen: true },
    access: { a1: true, a2: true, ...allowed }, currentModule: 'A2', highestA2DayUnlocked: 3,
    completedA2Days: [1, 2], completedA3Modules: ['career-mirror'], a3RouteClosed: allowed.a4,
  })
}
const FLOW = flow(), ACCESS = { a3: true, a4: true }
const GUIDANCE = buildGuidedNextAction(FLOW, { objective: { status: 'missing' }, adjustment: { status: 'missing' } })

function capture(role = 'baseline', overrides = {}) {
  return {
    id: role === 'baseline' ? INITIAL : FOLLOW, user_id: USER, stage: 'a3', outcome_key: 'interview_capability',
    instrument_key: 'a3_structured_interview', instrument_version: '2-capture', measurement_role: role,
    response_payload: {
      behavioral: 'Organicé la conversación con mi equipo y conservé las preguntas que quedaron pendientes.',
      value_fit: 'Mi experiencia permite ordenar problemas concretos del equipo con ejemplos propios y revisables.',
      challenge: 'Todavía necesito practicar respuestas concisas y estoy preparando una nueva conversación con ejemplos.',
    },
    observed_at: role === 'baseline' ? '2026-11-04T18:00:00.123456+00:00' : '2026-11-05T18:00:00.123457+00:00',
    score: null, score_scale_min: null, score_scale_max: null, confidence: null, dimensions: {}, ...overrides,
  }
}
function decision(closed = false, overrides = {}) {
  return { id: closed ? CLOSED : OPEN, user_id: USER, signal_id: SIGNAL,
    decision: 'Preparar una conversación sobre el rol que estoy explorando.',
    rationale: 'Quiero contrastar mi interés con las tareas concretas que realiza el equipo.',
    expected_evidence: 'Conservaré una respuesta concreta sobre las tareas y los próximos pasos disponibles.',
    status: closed ? 'reviewed' : 'testing', review_on: closed ? '2026-11-04' : TODAY,
    outcome: closed ? 'La persona respondió y todavía debo aclarar las responsabilidades específicas.' : null,
    reviewed_at: closed ? '2026-11-04T18:00:00.123456Z' : null,
    review_classification: closed ? 'inconclusive' : null,
    external_outcomes: closed ? ['recruiter_response'] : [],
    created_at: '2026-11-01T18:00:00.000000Z', updated_at: closed ? '2026-11-04T18:00:00.123457Z' : '2026-11-02T18:00:00.000000Z',
    ...overrides,
  }
}
function sourceRows(overrides = {}) {
  return { baseline: capture(), followUp: capture('follow_up'), nextReview: decision(), latestReview: decision(true), plan: null, ...overrides }
}
function database(rows = sourceRows(), options = {}) {
  const calls = []; let authReads = 0
  const client = createClient('https://synthetic.invalid', 'synthetic-public-key', {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: async (url, init = {}) => {
      syntheticDatabaseHttp++
      const parsed = new URL(url), table = parsed.pathname.split('/').at(-1)
      calls.push({ table, query: parsed.searchParams, method: init.method ?? 'GET' })
      assert.equal(parsed.origin, 'https://synthetic.invalid'); assert.equal(init.method ?? 'GET', 'GET')
      assert.equal(parsed.searchParams.get('user_id'), 'eq.' + USER)
      assert.ok(['dtc_outcome_observations', 'a4_decision_log', 'a2_reviewed_plans'].includes(table))
      let key
      if (table === 'dtc_outcome_observations') {
        assert.equal(parsed.searchParams.get('select'), service.A2_REVIEW_CAPTURE_SELECT)
        for (const [field, value] of [['stage', 'a3'], ['outcome_key', 'interview_capability'], ['instrument_key', 'a3_structured_interview'], ['instrument_version', '2-capture']]) {
          assert.equal(parsed.searchParams.get(field), 'eq.' + value)
        }
        assert.equal(parsed.searchParams.get('order'), 'observed_at.desc,id.desc')
        key = parsed.searchParams.get('measurement_role') === 'eq.baseline' ? 'baseline' : 'followUp'
      } else if (table === 'a4_decision_log') {
        assert.equal(parsed.searchParams.get('select'), service.A2_REVIEW_DECISION_SELECT)
        key = parsed.searchParams.get('status') === 'in.(watching,testing,committed)' ? 'nextReview' : 'latestReview'
        assert.equal(parsed.searchParams.get('status'), key === 'nextReview' ? 'in.(watching,testing,committed)' : 'in.(reviewed,discarded)')
        assert.equal(parsed.searchParams.get('order'), key === 'nextReview' ? 'review_on.asc,created_at.asc,id.asc' : 'reviewed_at.desc.nullslast,updated_at.desc,id.desc')
      } else {
        assert.equal(parsed.searchParams.get('select'), planService.A2_PLAN_SELECT); key = 'plan'
      }
      if (table !== 'a2_reviewed_plans') { assert.equal(parsed.searchParams.get('limit'), '1'); assert.ok(init.signal instanceof AbortSignal) }
      if (options.throwFor?.includes(key)) throw Error(PRIVATE)
      if (options.failFor?.includes(key)) return Response.json({ code: 'XX001', message: PRIVATE }, { status: 503 })
      if (options.rawFor?.[key]) return Response.json(options.rawFor[key])
      return Response.json(rows[key] === null ? [] : [rows[key]])
    } },
  })
  client.auth.getUser = async () => {
    authReads++
    if (options.authThrow) throw Error(PRIVATE)
    const userId = typeof options.actor === 'function' ? options.actor(authReads) : options.actor === undefined ? USER : options.actor
    return { data: { user: userId ? { id: userId } : null }, error: options.authError ? Error(PRIVATE) : null }
  }
  return { client, calls, get authReads() { return authReads } }
}
async function evidence(rows = sourceRows(), options = {}) {
  const db = database(rows, options)
  return service.readA2ReviewEvidence(db.client, USER, FLOW, ACCESS, NOW)
}
function emptyHistory() { return { instrumentKey: 'a3_structured_interview', instrumentVersion: '2-capture', baseline: null,
  followUp: null, pairStatus: 'empty', evaluationStatus: 'not_evaluated', comparable: false } }
function missingEvidence() { return { version: contract.A2_REVIEW_EVIDENCE_VERSION,
  a3: { status: 'missing', history: emptyHistory() }, a4: { status: 'missing', nextReview: null, latestReview: null } } }
function plan(contextSnapshot) {
  return { id: PLAN, revision: 1, state: 'active', content: { version: 'dtc-a2-plan.v1', purpose: 'Practicar una respuesta con evidencia propia.', constraints: '',
    reviewDate: '2026-11-13', steps: [{ id: STEP, title: 'Preparar un ejemplo', action: 'Conservar una situación y una pregunta para revisar.', status: 'pending' }] },
    contextSnapshot, createdAt: NOW.toISOString(), updatedAt: NOW.toISOString(), confirmedAt: NOW.toISOString() }
}
function planRow(value) { return { user_id: USER, plan_id: value.id, revision: value.revision, status: value.state,
  content: value.content, context_snapshot: value.contextSnapshot, reviewed_at: value.confirmedAt,
  review_date: value.content.reviewDate, created_at: value.createdAt, updated_at: value.updatedAt, deleted_at: null } }

test('Same instant in PostgreSQL/UTC formats preserves six fractional digits', () => {
  assert.equal(contract.canonicalA2ReviewInstant('2026-11-06T17:00:00.123456-03:00'), '2026-11-06T20:00:00.123456Z')
  assert.equal(contract.canonicalA2ReviewInstant('2026-11-06T20:00:00.1Z'), '2026-11-06T20:00:00.100000Z')
  assert.equal(contract.canonicalA2ReviewInstant('2026-11-06T20:00:00Z'), '2026-11-06T20:00:00.000000Z')
  for (const invalid of ['2026-02-30T20:00:00Z', '2026-11-06T24:00:00Z', '2026-11-06T20:00:00', '2026-11-06T20:00:00.1234567Z', '0000-01-01T00:00:00Z', '2026-11-06T20:00:00+24:00']) {
    assert.equal(contract.canonicalA2ReviewInstant(invalid), null)
  }
})
test('Four bounded SELECTs use session/owner filters, exact instruments and deterministic tie orders', async () => {
  const db = database(), value = await service.readA2ReviewEvidence(db.client, USER, FLOW, ACCESS, NOW)
  assert.equal(db.calls.length, 4); assert.equal(db.authReads, 2)
  assert.equal(value.a3.history.pairStatus, 'available'); assert.equal(value.a3.history.comparable, false)
  assert.equal(value.a3.history.evaluationStatus, 'not_evaluated'); assert.equal(value.a4.latestReview.id, CLOSED)
  assert.equal(value.a4.latestReview.updatedAt, '2026-11-04T18:00:00.123457Z')
  assert.ok(!JSON.stringify(value).includes('score'))
})
test('Two successful empty sources are verified missing, never failed reads or invented zero scores', async () => {
  assert.deepEqual(await evidence(sourceRows({ baseline: null, followUp: null, nextReview: null, latestReview: null })), missingEvidence())
})
test('Personal practice skips professional SQL even with later stages enabled', async () => {
  const db = database(), value = await service.readA2ReviewEvidence(db.client, USER, flow('persona'), ACCESS, NOW)
  assert.equal(db.calls.length, 0); assert.equal(db.authReads, 2)
  assert.equal(value.a3.status, 'not_applicable'); assert.equal(value.a4.status, 'not_applicable')
  assert.equal(contract.buildA2ReviewSuggestion(value, TODAY).suggestedAction, null)
})
test('Locked source stages issue no SQL and remain distinct from missing records', async () => {
  const db = database(), value = await service.readA2ReviewEvidence(db.client, USER, flow('profesional', { a3: false, a4: false }), { a3: false, a4: false }, NOW)
  assert.equal(db.calls.length, 0); assert.equal(value.a3.status, 'locked'); assert.equal(value.a4.status, 'locked')
})
test('A4 also requires canonical Radar availability even if the access boolean is true', async () => {
  const db = database(), value = await service.readA2ReviewEvidence(db.client, USER, { ...FLOW, radarAvailable: false }, ACCESS, NOW)
  assert.equal(db.calls.length, 2); assert.equal(value.a4.status, 'locked'); assert.ok(db.calls.every(c => c.table === 'dtc_outcome_observations'))
})
for (const options of [{ failFor: ['baseline'] }, { throwFor: ['followUp'] }, { rawFor: { baseline: [capture(), capture()] } }]) {
  test('A failed or malformed A3 read is unavailable while the verified A4 section remains', async () => {
    const value = await evidence(sourceRows(), options)
    assert.equal(value.a3.status, 'unavailable'); assert.equal(value.a3.history, null); assert.equal(value.a4.status, 'available')
    assert.equal(contract.a2ReviewEvidenceAvailable(value), false); assert.ok(!JSON.stringify(value).includes(PRIVATE))
  })
}
for (const [name, changes] of [
  ['wrong owner', { user_id: OTHER }], ['wrong stage', { stage: 'a2' }], ['v1 score instrument', { instrument_version: '1' }],
  ['wrong instrument', { instrument_key: 'a2_execution_checkpoint' }], ['wrong outcome', { outcome_key: 'execution_capability' }],
  ['wrong measurement role', { measurement_role: 'external_outcome' }], ['invented score', { score: 0 }],
  ['score scale', { score_scale_min: 0 }], ['confidence', { confidence: 1 }], ['dimensions', { dimensions: { structure: 4 } }],
  ['missing provenance field', { confidence: undefined }], ['too-long text', { response_payload: { ...capture().response_payload, behavioral: 'a '.repeat(451) } }],
  ['unexpected answer', { response_payload: { ...capture().response_payload, extra: 'additional answer' } }],
  ['ambiguous timestamp', { observed_at: '2026-11-04T18:00:00' }], ['future record', { observed_at: '2026-11-07T00:00:00Z' }],
]) test('A3 rejects ' + name + ' without replacing it with absence', async () => {
  const value = await evidence(sourceRows({ baseline: capture('baseline', changes) }))
  assert.equal(value.a3.status, 'unavailable'); assert.equal(value.a3.history, null)
})
test('A one-microsecond later follow-up is temporally ordered but remains unevaluated', async () => {
  const value = await evidence(sourceRows({ baseline: capture('baseline', { observed_at: '2026-11-04T18:00:00.123456Z' }),
    followUp: capture('follow_up', { observed_at: '2026-11-04T18:00:00.123457Z' }) }))
  assert.equal(value.a3.history.pairStatus, 'available'); assert.equal(value.a3.history.comparable, false)
})
for (const [name, baseline, followUp, pairStatus] of [
  ['initial only', capture(), null, 'baseline_only'], ['follow-up only', null, capture('follow_up'), 'follow_up_only'],
  ['same timestamp', capture(), capture('follow_up', { observed_at: capture().observed_at }), 'out_of_order'],
  ['earlier follow-up', capture(), capture('follow_up', { observed_at: '2026-11-03T18:00:00Z' }), 'out_of_order'],
]) test('A3 preserves ' + name + ' without inferring improvement', async () => {
  const value = await evidence(sourceRows({ baseline, followUp }))
  assert.equal(value.a3.history.pairStatus, pairStatus); assert.equal(value.a3.history.evaluationStatus, 'not_evaluated')
})
for (const [name, changes] of [
  ['wrong owner', { user_id: OTHER }], ['unknown status', { status: 'successful' }], ['missing review time', { reviewed_at: null }],
  ['empty reviewed outcome', { outcome: null }], ['unknown classification', { review_classification: 'proved_capability' }],
  ['invented external event', { external_outcomes: ['DTC_caused_job'] }], ['duplicated outcome', { external_outcomes: ['offer_received', 'offer_received'] }],
  ['future revision', { updated_at: '2026-11-08T18:00:00Z' }], ['revision before review', { updated_at: '2026-11-04T18:00:00.123455Z' }],
  ['oversized result', { outcome: 'a'.repeat(1_201) }], ['unknown ID', { id: 'forged-id' }],
]) test('A4 rejects ' + name + ' without consuming a malformed declared result', async () => {
  const value = await evidence(sourceRows({ latestReview: decision(true, changes) }))
  assert.equal(value.a4.status, 'unavailable'); assert.equal(value.a4.latestReview, null); assert.equal(value.a3.status, 'available')
})
test('A4 read failure stays unavailable and does not become no external change', async () => {
  const value = await evidence(sourceRows(), { failFor: ['nextReview'] })
  assert.equal(value.a4.status, 'unavailable'); assert.equal(value.a4.nextReview, null); assert.equal(value.a4.latestReview, null)
})
test('A discarded decision with a dated nullable outcome is a declaration, not a negative capability score', async () => {
  const value = await evidence(sourceRows({ latestReview: decision(true, { status: 'discarded', outcome: null, review_classification: 'decision_abandoned', external_outcomes: [] }) }))
  assert.equal(value.a4.status, 'available'); assert.equal(value.a4.latestReview.outcome, null)
})
test('An open decision returned by the closed query fails the source instead of claiming a result', async () => {
  const value = await evidence(sourceRows({ latestReview: decision(false, { id: CLOSED }) }))
  assert.equal(value.a4.status, 'unavailable')
})
test('The same decision observed on both sides of a concurrent status change is unavailable', async () => {
  const value = await evidence(sourceRows({ latestReview: decision(true, { id: OPEN }) }))
  assert.equal(value.a4.status, 'unavailable')
})
for (const [name, options, expected, calls] of [
  ['different actor initially', { actor: OTHER }, 'a2_review_session_changed', 0],
  ['missing actor initially', { actor: null }, 'a2_review_session_changed', 0],
  ['changed actor after reads', { actor: index => index === 1 ? USER : OTHER }, 'a2_review_session_changed', 4],
  ['Auth unavailable', { authError: true }, 'a2_review_session_unavailable', 0],
  ['Auth exception', { authThrow: true }, 'a2_review_session_unavailable', 0],
]) test('Identity ' + name + ' rejects the whole context', async () => {
  const db = database(sourceRows(), options)
  await assert.rejects(() => service.readA2ReviewEvidence(db.client, USER, FLOW, ACCESS, NOW), { message: expected })
  assert.equal(db.calls.length, calls)
})
test('Strict review contracts reject fabricated scores, source fields and status/content mismatches', async () => {
  const value = await evidence()
  for (const mutate of [v => { v.score = 100 }, v => { v.a3.history.comparable = true }, v => { v.a3.history.evaluationStatus = 'evaluated' },
    v => { v.a3.status = 'missing' }, v => { v.a3.history.baseline.sourceUrl = 'https://unexpected.invalid' },
    v => { v.a4.status = 'locked' }, v => { v.a4.latestReview.strategicScore = 100 },
    v => { v.a4.nextReview = v.a4.latestReview }, v => { v.a3.history.pairStatus = 'empty' }]) {
    const changed = copy(value); mutate(changed); assert.equal(contract.a2ReviewEvidenceSchema.safeParse(changed).success, false)
  }
})
test('Date-dependent suggestions do not add today/capture time to a stable context hash', async () => {
  const value = await evidence(sourceRows({ latestReview: null }))
  assert.equal(contract.buildA2ReviewSuggestion(value, '2026-11-05').kind, 'compare_a3_responses')
  assert.equal(contract.buildA2ReviewSuggestion(value, TODAY).kind, 'review_a4_due')
  assert.equal(contract.buildA2ReviewSuggestion(value, '2026-11-07').kind, 'review_a4_due')
  const before = makeA2PlanContextSnapshot(FLOW, GUIDANCE, NOW, value)
  const later = makeA2PlanContextSnapshot(FLOW, GUIDANCE, new Date('2026-11-07T20:00:00Z'), value)
  assert.equal(before.hash, later.hash); assert.notEqual(before.capturedAt, later.capturedAt)
  assert.ok(!Object.hasOwn(before.projection.reviewEvidence, 'today'))
})
test('Only available consumed records expose allowlisted source references', async () => {
  const value = await evidence(), refs = contract.a2ReviewSourceRefs(value)
  assert.deepEqual(refs.map(ref => ref.id), [...contract.A2_REVIEW_SOURCE_IDS])
  assert.ok(refs.every(ref => ['/despega/a3-outcome-baseline', '/despega/a3-outcome-follow-up', '/despega/a4'].includes(ref.href)))
  assert.deepEqual(contract.a2ReviewSourceRefs(missingEvidence()), [])
})
test('Model context keeps only declared text, statuses and dates while removing record IDs and embedded links', async () => {
  const rows = sourceRows()
  rows.baseline.response_payload.behavioral += ` Documento https://private.invalid/${INITIAL} y registro ${INITIAL}.`
  rows.latestReview.outcome += ` Más detalle [mi enlace](https://private.invalid/${CLOSED}) ${CLOSED}.`
  const value = await evidence(rows), before = JSON.stringify(value), model = contract.buildA2ReviewModelContext(value)
  const serialized = JSON.stringify(model)
  for (const privateValue of [INITIAL, FOLLOW, OPEN, CLOSED, SIGNAL, USER, 'https://', 'private.invalid', 'recordId', 'signalId', 'hash']) {
    assert.ok(!serialized.includes(privateValue), privateValue)
  }
  assert.equal(model.kind, 'recorded_user_declarations'); assert.equal(model.a3.evaluationStatus, 'not_evaluated')
  assert.equal(model.a3.comparable, false); assert.equal(model.a4.causation, 'not_established')
  assert.equal(model.a4.evidenceMeaning, 'user_declaration_only'); assert.equal(JSON.stringify(value), before)
  assert.equal(contract.a2ReviewModelContextSchema.safeParse({ ...model, actorId: USER }).success, false)
})
test('Old v1 snapshots remain parseable byte-for-byte without a new default or hash rewrite', () => {
  const legacy = makeA2PlanContextSnapshot(FLOW, GUIDANCE, NOW)
  assert.equal(Object.hasOwn(legacy.projection, 'reviewEvidence'), false)
  assert.deepEqual(readA2PlanContextSnapshot(copy(legacy)), legacy)
  assert.equal(makeA2PlanContextSnapshot(FLOW, GUIDANCE, NOW, undefined).hash, legacy.hash)
  assert.equal(makeA2PlanContextSnapshot(FLOW, GUIDANCE, NOW, missingEvidence()).hash === legacy.hash, false)
})
test('One microsecond, a response edit and source deletion each invalidate a reviewed context', async () => {
  const value = await evidence(), original = makeA2PlanContextSnapshot(FLOW, GUIDANCE, NOW, value)
  for (const mutate of [v => { v.a4.latestReview.updatedAt = '2026-11-04T18:00:00.123458Z' },
    v => { v.a3.history.baseline.responsePayload.challenge += ' Conservo una pregunta adicional.' },
    v => { v.a4.latestReview = null }]) {
    const changed = copy(value); mutate(changed)
    const current = makeA2PlanContextSnapshot(FLOW, GUIDANCE, NOW, changed)
    assert.notEqual(current.hash, original.hash)
    assert.equal(planContract.assessA2PlanFreshness(plan(original), current, TODAY).status, 'changed')
  }
})
test('Equivalent source instants do not create false plan staleness', async () => {
  const value = await evidence(), equivalent = copy(value)
  equivalent.a4.latestReview.updatedAt = '2026-11-04T15:00:00.123457-03:00'
  equivalent.a3.history.baseline.observedAt = '2026-11-04T15:00:00.123456-03:00'
  assert.equal(makeA2PlanContextSnapshot(FLOW, GUIDANCE, NOW, value).hash, makeA2PlanContextSnapshot(FLOW, GUIDANCE, NOW, equivalent).hash)
})
test('An applicable failed source blocks current confirmation while retaining a valid partial snapshot', async () => {
  const value = await evidence(sourceRows(), { failFor: ['baseline'] })
  const snapshot = makeA2PlanContextSnapshot(FLOW, GUIDANCE, NOW, value)
  assert.equal(snapshot.available, false); assert.equal(snapshot.projection.reviewEvidence.a4.status, 'available')
  assert.deepEqual(readA2PlanContextSnapshot(snapshot), snapshot)
})
test('Plan source availability and the personal-path boundary cannot be forged', () => {
  const personalFlow = flow('persona'), guidance = buildGuidedNextAction(personalFlow, { adjustment: { status: 'missing' } })
  assert.throws(() => makeA2PlanContextSnapshot(personalFlow, guidance, NOW, missingEvidence()))
  const personalEvidence = { version: contract.A2_REVIEW_EVIDENCE_VERSION, a3: { status: 'not_applicable', history: null },
    a4: { status: 'not_applicable', nextReview: null, latestReview: null } }
  assert.equal(makeA2PlanContextSnapshot(personalFlow, guidance, NOW, personalEvidence).available, true)
  assert.throws(() => makeA2PlanContextSnapshot(FLOW, GUIDANCE, NOW, personalEvidence))
})
test('Plan assistant memory compares the same sixth-argument evidence snapshot', async () => {
  const value = await evidence(), snapshot = makeA2PlanContextSnapshot(FLOW, GUIDANCE, NOW, value)
  const db = database(sourceRows({ plan: planRow(plan(snapshot)) }))
  const current = await planService.readA2PlanAssistantEvidence(db.client, USER, FLOW, GUIDANCE, NOW, value)
  assert.equal(current.status, 'available')
  const changed = copy(value); changed.a4.latestReview.updatedAt = '2026-11-04T18:00:00.123458Z'
  assert.equal((await planService.readA2PlanAssistantEvidence(db.client, USER, FLOW, GUIDANCE, NOW, changed)).status, 'changed')
  const partial = copy(value); partial.a3 = { status: 'unavailable', history: null }
  assert.equal((await planService.readA2PlanAssistantEvidence(db.client, USER, FLOW, GUIDANCE, NOW, partial)).status, 'unavailable')
})

function routeHarness(options = {}) {
  const db = database(options.rows ?? sourceRows(), options.database), modes = []
  const journey = options.noJourney ? null : { user: { id: USER }, access: { a2: true, ...ACCESS } }
  const module = { exports: {} }, dependencies = {
    '@/lib/supabase/server': { createClient: async () => db.client, createAdminClient: () => { throw Error('GET must not write or call RPC') } },
    '@/lib/journey/service': { getJourneyForCurrentUser: async mode => { modes.push(mode); return journey } },
    '@/lib/journey/flow-service': { readJourneyFlow: async () => FLOW },
    '@/lib/journey/next-action-service': { readGuidedNextAction: async () => GUIDANCE },
    '@/lib/a2/api-access': { checkA2PilotAccess: async () => 'allowed' },
    '@/lib/a2/plan-api': planApi, '@/lib/a2/plan-contract': planContract, '@/lib/a2/plan-context': contextService,
    '@/lib/a2/plan-service': planService, '@/lib/a2/review-evidence-service': service,
  }
  const compiled = ts.transpileModule(readFileSync('app/api/a2/plan/route.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText
  new Function('require', 'module', 'exports', compiled)(key => {
    if (!Object.hasOwn(dependencies, key)) throw Error('Unexpected route dependency: ' + key)
    return dependencies[key]
  }, module, module.exports)
  return { db, modes, async get() {
    const response = await module.exports.GET(new Request('https://dtc.test/api/a2/plan', { headers: { [planContract.A2_PLAN_EXPECTED_ACTOR_HEADER]: USER } }))
    return { status: response.status, body: await response.json() }
  } }
}
test('Actual plan GET reads the canonical journey without initialization and returns review evidence', async () => {
  const h = routeHarness(), result = await h.get()
  assert.equal(result.status, 200); assert.deepEqual(h.modes, ['read-only'])
  assert.equal(result.body.context.projection.reviewEvidence.a3.status, 'available')
  assert.equal(result.body.context.projection.reviewEvidence.a4.status, 'available')
  assert.ok(h.db.calls.every(call => call.method === 'GET'))
})
test('Missing canonical journey returns 403 with no initialization or private source reads', async () => {
  const h = routeHarness({ noJourney: true }), result = await h.get()
  assert.equal(result.status, 403); assert.equal(result.body.code, 'journey_access_required')
  assert.deepEqual(h.modes, ['read-only']); assert.equal(h.db.calls.length, 0)
})
test('Actual plan GET delivers partial unavailable context without claiming that the saved evidence is empty', async () => {
  const h = routeHarness({ database: { failFor: ['baseline'] } }), result = await h.get()
  assert.equal(result.status, 200); assert.equal(result.body.context.available, false)
  assert.equal(result.body.context.projection.reviewEvidence.a3.status, 'unavailable')
  assert.equal(result.body.context.projection.reviewEvidence.a4.status, 'available')
})
test('Plan POST rejects a changed source hash before mutation and keeps the current view reviewable', async () => {
  const previous = makeA2PlanContextSnapshot(FLOW, GUIDANCE, NOW, missingEvidence())
  const current = makeA2PlanContextSnapshot(FLOW, GUIDANCE, NOW, await evidence())
  let writes = 0
  const handlers = planApi.createA2PlanHandlers({ now: () => NOW,
    authorize: async () => ({ id: USER }), verifyOwner: async () => true,
    readSlot: async () => ({ revision: 0, plan: null }), readContext: async () => ({ snapshot: current, guidance: GUIDANCE }),
    readReceipt: async () => null, mutate: async () => { writes++; throw Error('Must not mutate') },
  })
  const response = await handlers.POST(new Request('https://dtc.test/api/a2/plan', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://dtc.test', [planContract.A2_PLAN_EXPECTED_ACTOR_HEADER]: USER },
    body: JSON.stringify({ version: 'dtc-a2-plan-command.v1', requestId: REQUEST, operation: 'save', expectedRevision: 0,
      expectedContextHash: previous.hash, content: plan(previous).content }) }))
  const body = await response.json()
  assert.equal(response.status, 409); assert.equal(body.code, 'plan_context_changed'); assert.equal(writes, 0)
  assert.equal(body.view.context.hash, current.hash)
})
test('Plan POST rejects an applicable unavailable source before any new write', async () => {
  const value = await evidence(sourceRows(), { failFor: ['latestReview'] })
  const current = makeA2PlanContextSnapshot(FLOW, GUIDANCE, NOW, value); let writes = 0
  const handlers = planApi.createA2PlanHandlers({ now: () => NOW,
    authorize: async () => ({ id: USER }), verifyOwner: async () => true,
    readSlot: async () => ({ revision: 0, plan: null }), readContext: async () => ({ snapshot: current, guidance: GUIDANCE }),
    readReceipt: async () => null, mutate: async () => { writes++; throw Error('Must not mutate') },
  })
  const response = await handlers.POST(new Request('https://dtc.test/api/a2/plan', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://dtc.test', [planContract.A2_PLAN_EXPECTED_ACTOR_HEADER]: USER },
    body: JSON.stringify({ version: 'dtc-a2-plan-command.v1', requestId: REQUEST, operation: 'save', expectedRevision: 0,
      expectedContextHash: current.hash, content: plan(current).content }) }))
  assert.equal(response.status, 503); assert.equal((await response.json()).code, 'plan_context_unavailable'); assert.equal(writes, 0)
})

const results = []
for (const { name, run } of tests) {
  try { await run(); results.push({ name, status: 'passed' }) }
  catch (error) { results.push({ name, status: 'failed', error: error.message }); console.error(name + ': ' + error.stack); process.exitCode = 1 }
}
assert.equal(externalNetworkCalls, 0)
const sourcePaths = ['lib/a2/review-evidence-contract.ts', 'lib/a2/review-evidence-service.ts', 'lib/a2/plan-contract.ts',
  'lib/a2/plan-context.ts', 'lib/a2/plan-service.ts', 'app/api/a2/plan/route.ts', 'scripts/test-a2-review-evidence.mjs']
const summary = { suite: 'a2-review-evidence', cases: results.length, passed: results.filter(result => result.status === 'passed').length,
  actualContracts: true, actualSourceReader: true, actualSupabaseSelectBuilder: true, actualPlanRoute: true, actualContextHashing: true,
  sessionAndHttp: 'synthetic', realSqlOrRls: false, modelCalls: 0, externalNetworkCalls, syntheticDatabaseHttp,
  sourceHashes: sourcePaths.map(path => ({ path, sha256: createHash('sha256').update(readFileSync(path)).digest('hex') })), results }
if (process.env.DTC_AGENTIC_QA_OUTPUT) {
  mkdirSync(process.env.DTC_AGENTIC_QA_OUTPUT, { recursive: true })
  writeFileSync(join(process.env.DTC_AGENTIC_QA_OUTPUT, 'a2-review-evidence.json'), JSON.stringify(summary, null, 2) + '\n')
}
console.log(JSON.stringify({ suite: summary.suite, cases: summary.cases, passed: summary.passed, externalNetworkCalls,
  syntheticDatabaseHttp, realSqlOrRls: false, modelCalls: 0 }))
