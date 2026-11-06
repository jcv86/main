/** Actual AG04 route, handlers, context hashing and Supabase SELECT builder.
 * Session, journey/RPC ports and document store are synthetic; SQL/RLS run separately. */
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join, resolve } from 'node:path'
import ts from 'typescript'
import { createClient } from '@supabase/supabase-js'
import { buildJourneyFlow } from '../lib/journey/flow.ts'
import { buildGuidedNextAction, guidedPracticeDay } from '../lib/journey/next-action.ts'
import * as planContract from '../lib/a2/plan-contract.ts'
import * as contract from '../lib/a2/assistant-action-contract.ts'
import * as reviewContract from '../lib/a2/review-evidence-contract.ts'
import * as captureHistory from '../lib/outcomes/response-history.ts'
import * as captureContract from '../lib/outcomes/response-capture.ts'
import { createA2ActionHandlers, A2ActionApiFailure } from '../lib/a2/assistant-action-api.ts'

const require = createRequire(import.meta.url), modules = new Map()
function loadServer(file) {
  const filename = resolve(file)
  if (modules.has(filename)) return modules.get(filename).exports
  assert.ok(['lib/a2/plan-context.ts', 'lib/a2/assistant-action-service.ts', 'lib/a2/review-evidence-service.ts'].some(path => resolve(path) === filename))
  const module = { exports: {} }; modules.set(filename, module)
  const code = ts.transpileModule(readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText
  new Function('require', 'module', 'exports', code)(key => {
    if (key === 'server-only') return {}
    if (key === './plan-contract') return planContract
    if (key === './assistant-action-contract') return contract
    if (key === './review-evidence-contract') return reviewContract
    if (key === '@/lib/outcomes/response-history') return captureHistory
    if (key === '@/lib/outcomes/response-capture') return captureContract
    if (key === './plan-context') return loadServer('lib/a2/plan-context.ts')
    if (key.startsWith('node:')) return require(key)
    throw Error('Unexpected server dependency: ' + key)
  }, module, module.exports)
  return module.exports
}
const { makeA2PlanContextSnapshot, canonicalPlanJson } = loadServer('lib/a2/plan-context.ts')
const { readA2ActionEffect, A2_ACTION_DOCUMENT_SELECT } = loadServer('lib/a2/assistant-action-service.ts')
const NOW = new Date('2026-11-06T20:00:00.000Z')
const USER = '00000000-0000-4000-8000-000000004001', OTHER = '00000000-0000-4000-8000-000000004002'
const REQUEST = '00000000-0000-4000-8000-000000004010', DOCUMENT = '00000000-0000-4000-8000-000000004020'
const PRIVATE = 'PRIVATE_SYNTHETIC_DETAIL'
let externalNetworkCalls = 0, syntheticDatabaseHttp = 0
globalThis.fetch = async () => { externalNetworkCalls++; throw Error('External fetch forbidden') }
const tests = [], test = (name, run) => tests.push({ name, run })
const copy = value => structuredClone(value)

function context(overrides = {}) {
  const flow = buildJourneyFlow({
    profile: { camino_foco: 'profesional', onboarding_conozcamonos_1_completed: true, a1_cerebral_intro_seen: true,
      a1_cerebral_completed: true, conozcamonos_2_completed: true, a1_report_seen: true, a2_intro_seen: true },
    access: { a1: true, a2: true, a3: false, a4: false }, currentModule: 'A2', highestA2DayUnlocked: 3,
    completedA2Days: [1, 2], completedA3Modules: [], a3RouteClosed: false, ...overrides,
  })
  const guidance = buildGuidedNextAction(flow, { objective: { status: 'missing' }, adjustment: { status: 'missing' } })
  return { flow, dayNumber: guidedPracticeDay(flow), guidance, snapshot: makeA2PlanContextSnapshot(flow, guidance, NOW) }
}
const base = context()
function adjustment(overrides = {}) {
  return { outcome: 'could_not', barrier: 'time', retainedWork: 'Conservo mis notas revisadas.',
    nextAction: 'Practicaré un ejemplo concreto durante diez minutos.', reviewDate: '2026-11-13', ...overrides }
}
function command(overrides = {}) {
  return { version: 'dtc-a2-action-command.v1', tool: 'save_practice_adjustment', requestId: REQUEST,
    dayNumber: 3, expectedContextHash: base.snapshot.hash, adjustment: adjustment(), ...overrides }
}
function receipt(overrides = {}) {
  return { version: 'dtc-a2-action-receipt.v1', requestId: REQUEST, documentId: DOCUMENT,
    dayNumber: 3, committedAt: NOW.toISOString(), replayed: false, ...overrides }
}
function row(cmd = command(), proof = receipt()) {
  return { id: proof.documentId, user_id: USER, title: `Ajuste de práctica · Día ${cmd.dayNumber}`,
    type: 'a2_practice_adjustment', source_module: 'a2', related_day: cmd.dayNumber, source: 'user', status: 'draft',
    content: JSON.stringify(contract.a2ActionStoredContent(cmd)), created_at: proof.committedAt }
}
function database(rows, options = {}) {
  const calls = []
  const client = createClient('https://synthetic.invalid', 'synthetic-public-key', {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: async (url, init = {}) => {
      syntheticDatabaseHttp++
      const parsed = new URL(url); calls.push({ url: parsed, method: init.method ?? 'GET' })
      assert.equal(parsed.origin, 'https://synthetic.invalid')
      assert.equal(parsed.pathname, '/rest/v1/dtc_documents')
      assert.equal(init.method ?? 'GET', 'GET')
      assert.equal(parsed.searchParams.get('user_id'), 'eq.' + USER)
      assert.equal(parsed.searchParams.get('id'), 'eq.' + (options.documentId ?? DOCUMENT))
      assert.equal(parsed.searchParams.get('select'), A2_ACTION_DOCUMENT_SELECT)
      assert.equal(parsed.searchParams.has('type'), false)
      assert.equal(parsed.searchParams.has('related_day'), false)
      return Response.json(options.error ? { code: 'XX001', message: PRIVATE } : rows, { status: options.error ? 503 : 200 })
    } },
  })
  return { client, calls }
}
function request(method, body, headers = {}, options = {}) {
  return new Request('https://dtc.test/api/a2/assistant-actions', {
    method, headers: { [contract.A2_ACTION_EXPECTED_ACTOR_HEADER]: USER,
      ...(method === 'POST' ? { Origin: 'https://dtc.test', 'Content-Type': 'application/json', 'Sec-Fetch-Site': 'same-origin' } : {}), ...headers },
    ...(method === 'POST' ? { body: typeof body === 'string' ? body : JSON.stringify(body) } : {}), ...options,
  })
}
function harness(options = {}) {
  let current = copy(options.context ?? base), now = options.now ?? NOW
  let mutations = 0, lookups = 0, verifications = 0, failAfterCommit = options.failAfterCommit
  let effectFailure = options.effectFailure, contextFailure = options.contextFailure
  const receipts = new Map(), documents = new Map(), calls = []
  const commit = cmd => {
    mutations++
    const proof = receipt({ requestId: cmd.requestId, dayNumber: cmd.dayNumber, documentId: randomUUID() })
    receipts.set(cmd.requestId, { command: canonicalPlanJson(cmd), receipt: proof })
    documents.set(proof.documentId, row(cmd, proof))
    return proof
  }
  const handlers = createA2ActionHandlers({
    now: () => now,
    authorize: async () => { calls.push('authorize'); if (options.authFailure) throw options.authFailure; return { id: USER } },
    verifyOwner: async () => { verifications++; return typeof options.verify === 'function' ? options.verify(verifications) : options.verify !== false },
    readContext: async () => { calls.push('context'); if (contextFailure) throw Error(PRIVATE); return copy(current) },
    readReceipt: async (_, cmd) => {
      calls.push('receipt'); lookups++
      const prior = receipts.get(cmd.requestId)
      if (!prior && lookups === 1 && options.receiptAppearsAfterLookup) {
        commit(cmd); return null
      }
      if (!prior) return null
      if (prior.command !== canonicalPlanJson(cmd)) throw new A2ActionApiFailure(409, 'action_request_conflict', 'El envío corresponde a otra edición.')
      return { ...prior.receipt, replayed: true }
    },
    mutate: async (_, cmd, snapshot) => {
      calls.push('mutate'); assert.equal(snapshot.hash, cmd.expectedContextHash)
      if (options.mutationFailure) throw options.mutationFailure
      const proof = commit(cmd)
      if (options.removeAfterCommit) documents.delete(proof.documentId)
      if (options.changeAfterCommit) documents.get(proof.documentId).content = JSON.stringify({ ...contract.a2ActionStoredContent(cmd), nextAction: 'Una edición posterior' })
      if (failAfterCommit) { failAfterCommit = false; throw Error(PRIVATE) }
      return proof
    },
    readEffect: async (_, cmd, proof) => {
      calls.push('effect')
      const data = documents.get(proof.documentId)
      const db = database(data ? [data] : [], { documentId: proof.documentId, error: effectFailure })
      return readA2ActionEffect(db.client, USER, cmd, proof)
    },
  })
  return { receipts, documents, calls, get mutations() { return mutations }, get lookups() { return lookups },
    set context(value) { current = copy(value) }, set now(value) { now = value },
    set effectFailure(value) { effectFailure = value }, set contextFailure(value) { contextFailure = value },
    async get(headers = {}) { const response = await handlers.GET(request('GET', undefined, headers)); return { response, body: await response.json() } },
    async post(cmd = command(), headers = {}, options = {}) { const response = await handlers.POST(request('POST', cmd, headers, options)); return { response, body: await response.json() } },
  }
}

function routeHarness(journey, current = base) {
  const calls = [], module = { exports: {} }
  const dependencies = {
    '@/lib/supabase/server': {
      createClient: async () => ({ auth: { getUser: async () => {
        calls.push('session'); return { data: { user: { id: USER } }, error: null }
      } }, from: () => { calls.push('source_query'); throw Error('Unexpected professional source query') } }),
      createAdminClient: () => { calls.push('admin'); throw Error('Denied route must not call an admin client') },
    },
    '@/lib/journey/service': { getJourneyForCurrentUser: async mode => {
      calls.push({ journeyMode: mode }); return journey
    } },
    '@/lib/journey/flow-service': { readJourneyFlow: async () => { calls.push('flow'); return current.flow } },
    '@/lib/journey/next-action': { guidedPracticeDay },
    '@/lib/journey/next-action-service': { readGuidedNextAction: async () => { calls.push('guidance'); return current.guidance } },
    '@/lib/a2/api-access': { checkA2PilotAccess: async () => { calls.push('pilot'); return 'allowed' } },
    '@/lib/a2/assistant-action-api': { createA2ActionHandlers, A2ActionApiFailure },
    '@/lib/a2/assistant-action-contract': contract,
    '@/lib/a2/plan-context': loadServer('lib/a2/plan-context.ts'),
    '@/lib/a2/assistant-action-service': loadServer('lib/a2/assistant-action-service.ts'),
    '@/lib/a2/review-evidence-service': loadServer('lib/a2/review-evidence-service.ts'),
  }
  const code = ts.transpileModule(readFileSync('app/api/a2/assistant-actions/route.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText
  new Function('require', 'module', 'exports', code)(key => {
    assert.ok(Object.hasOwn(dependencies, key), 'Unexpected route dependency: ' + key)
    return dependencies[key]
  }, module, module.exports)
  return { calls, async invoke(method) {
    const response = await module.exports[method](request(method, method === 'POST' ? command() : undefined))
    return { response, body: await response.json() }
  } }
}

for (const method of ['GET', 'POST']) {
  for (const [name, journey, status, code] of [
    ['missing canonical journey', null, 403, 'journey_access_required'],
    ['different journey owner', { user: { id: OTHER }, access: { a2: true } }, 409, 'session_changed'],
    ['locked A2 access', { user: { id: USER }, access: { a2: false } }, 403, 'journey_access_required'],
  ]) test(`Actual ${method} route reads without initialization and denies ${name}`, async () => {
    const h = routeHarness(journey), result = await h.invoke(method)
    assert.equal(result.response.status, status); assert.equal(result.body.code, code)
    assert.equal(result.body.view, undefined); assert.equal(result.body.receipt, undefined)
    assert.deepEqual(h.calls, ['session', 'pilot', { journeyMode: 'read-only' }])
  })
}
test('Actual eligible GET route uses read-only journey before reading current context', async () => {
  const h = routeHarness({ user: { id: USER }, access: { a2: true, a3: false, a4: false } }), result = await h.invoke('GET')
  assert.equal(result.response.status, 200); assert.equal(result.body.dayNumber, 3)
  assert.equal(result.body.context.projection.reviewEvidence.a3.status, 'locked')
  assert.equal(result.body.context.projection.reviewEvidence.a4.status, 'locked')
  assert.equal(result.body.context.hash, makeA2PlanContextSnapshot(base.flow, base.guidance, NOW, result.body.context.projection.reviewEvidence).hash)
  assert.deepEqual(h.calls, ['session', 'pilot', { journeyMode: 'read-only' }, 'flow', 'guidance', 'session', 'session', 'session'])
})
test('Actual personal action GET skips A3 and A4 even when later stages are enabled', async () => {
  const personal = context({ profile: { camino_foco: 'persona', onboarding_conozcamonos_1_completed: true,
    a1_cerebral_intro_seen: true, a1_cerebral_completed: true, conozcamonos_2_completed: true, a1_report_seen: true, a2_intro_seen: true } })
  const h = routeHarness({ user: { id: USER }, access: { a2: true, a3: true, a4: true } }, personal)
  const result = await h.invoke('GET')
  assert.equal(result.response.status, 200)
  assert.equal(result.body.context.projection.reviewEvidence.a3.status, 'not_applicable')
  assert.equal(result.body.context.projection.reviewEvidence.a4.status, 'not_applicable')
  assert.ok(!h.calls.includes('source_query'))
})

function reviewedEvidence() {
  return reviewContract.a2ReviewEvidenceSchema.parse({ version: 'dtc-a2-review-evidence.v1',
    a3: { status: 'available', history: { instrumentKey: 'a3_structured_interview', instrumentVersion: '2-capture',
      baseline: { observationId: '00000000-0000-4000-8000-000000004030', observedAt: '2026-11-04T20:00:00.123456Z', measurementRole: 'baseline',
        responsePayload: { behavioral: 'Conservé un ejemplo propio y una pregunta para revisar después con mi equipo.',
          value_fit: 'Mi experiencia permite explorar esta función con preguntas y ejemplos propios de trabajo.',
          challenge: 'Todavía quiero practicar cómo explicar una situación concreta y conservar lo que observe.' } },
      followUp: null, pairStatus: 'baseline_only', evaluationStatus: 'not_evaluated', comparable: false } },
    a4: { status: 'available', nextReview: null, latestReview: {
      id: '00000000-0000-4000-8000-000000004040', signalId: '00000000-0000-4000-8000-000000004041',
      decision: 'Contrastar una conversación con mis preguntas pendientes.', rationale: 'Quiero revisar qué información conservé para decidir el próximo intento.',
      expectedEvidence: 'Conservar una respuesta concreta sobre las tareas del rol.', status: 'reviewed', reviewOn: '2026-11-04',
      outcome: 'Quedó una pregunta pendiente que quiero revisar en la próxima conversación.', reviewedAt: '2026-11-04T20:00:00.123456Z',
      reviewClassification: 'inconclusive', externalOutcomes: ['no_external_change'],
      createdAt: '2026-11-03T20:00:00Z', updatedAt: '2026-11-04T20:00:00.123457Z',
    } },
  })
}
function reviewedContext(value) {
  return { ...base, snapshot: makeA2PlanContextSnapshot(base.flow, base.guidance, NOW, value) }
}
for (const [source, mutate] of [
  ['A3 captured response', value => { value.a3.history.baseline.responsePayload.challenge += ' Conservo otra pregunta.' }],
  ['A4 declared result', value => { value.a4.latestReview.outcome += ' Agregué otra observación.' }],
  ['A4 microsecond revision', value => { value.a4.latestReview.updatedAt = '2026-11-04T20:00:00.123458Z' }],
]) test(`${source} changed after a proposal rejects the old confirmation fingerprint before mutation`, async () => {
  const prior = reviewedEvidence(), proposal = reviewedContext(prior), changed = copy(prior); mutate(changed)
  const h = harness({ context: reviewedContext(changed) })
  const result = await h.post(command({ expectedContextHash: proposal.snapshot.hash }))
  assert.equal(result.response.status, 409); assert.equal(result.body.code, 'action_context_changed'); assert.equal(h.mutations, 0)
})
for (const source of ['a3', 'a4']) test(`Unavailable ${source} cannot confirm a newly proposed adjustment`, async () => {
  const value = reviewedEvidence()
  value[source] = source === 'a3' ? { status: 'unavailable', history: null } : { status: 'unavailable', nextReview: null, latestReview: null }
  const current = reviewedContext(value), h = harness({ context: current })
  const result = await h.post(command({ expectedContextHash: current.snapshot.hash }))
  assert.equal(result.response.status, 503); assert.equal(result.body.code, 'action_context_unavailable'); assert.equal(h.mutations, 0)
})
test('Historical confirmed action replays after newly applicable A3/A4 evidence without changing its document', async () => {
  const h = harness(), first = await h.post(), stored = copy([...h.documents.values()])
  h.context = reviewedContext(reviewedEvidence())
  const replay = await h.post()
  assert.equal(replay.response.status, 200); assert.equal(replay.body.receipt.replayed, true)
  assert.equal(replay.body.receipt.documentId, first.body.receipt.documentId); assert.equal(h.mutations, 1)
  assert.deepEqual([...h.documents.values()], stored)
})

test('GET returns the actual canonical pending day, guidance and hashed context without a write', async () => {
  const h = harness(), { response, body } = await h.get()
  assert.equal(response.status, 200); assert.equal(body.dayNumber, 3)
  assert.deepEqual(body.guidance.action, base.flow.next); assert.equal(body.context.hash, base.snapshot.hash)
  assert.equal(contract.a2ActionViewSchema.safeParse(body).success, true)
  assert.equal(response.headers.get(contract.A2_ACTION_ACTOR_HEADER), USER)
  for (const key of ['cache-control', 'cdn-cache-control', 'vercel-cdn-cache-control']) assert.match(response.headers.get(key), /no-store/)
  assert.equal(h.mutations, 0); assert.equal(h.lookups, 0)
})
test('A non-practice canonical next step cannot be confirmed as a day action', async () => {
  const h = harness({ context: { ...base, dayNumber: null } })
  assert.equal((await h.get()).body.dayNumber, null)
  const result = await h.post(); assert.equal(result.body.code, 'action_day_changed'); assert.equal(h.mutations, 0)
})
test('Read failures remain unavailable, not an empty or zero-progress view', async () => {
  const h = harness({ contextFailure: true }), result = await h.get()
  assert.equal(result.response.status, 503); assert.equal(result.body.code, 'action_context_unavailable')
  assert.equal(result.body.view, undefined); assert.ok(!JSON.stringify(result.body).includes(PRIVATE))
})
test('A known unavailable source cannot authorize confirmation', async () => {
  const broken = context()
  broken.guidance = buildGuidedNextAction(broken.flow, { objective: { status: 'unavailable' }, adjustment: { status: 'missing' } })
  broken.snapshot = makeA2PlanContextSnapshot(broken.flow, broken.guidance, NOW)
  const h = harness({ context: broken })
  assert.equal((await h.get()).body.context.available, false)
  const result = await h.post(command({ expectedContextHash: broken.snapshot.hash }))
  assert.equal(result.body.code, 'action_context_unavailable'); assert.equal(h.mutations, 0)
})
test('Explicit confirmation returns one verified current effect and receipt', async () => {
  const h = harness(), result = await h.post()
  assert.equal(result.response.status, 200); assert.equal(result.body.effect, 'present')
  assert.deepEqual(result.body.adjustment, adjustment()); assert.equal(result.body.receipt.replayed, false)
  assert.equal(contract.a2ActionResultMatchesCommand(result.body, command()), true)
  assert.equal(h.mutations, 1); assert.equal(h.documents.size, 1); assert.equal(h.receipts.size, 1)
  assert.deepEqual(h.calls, ['authorize', 'receipt', 'context', 'mutate', 'effect'])
})
test('An identical retry reads a receipt and current effect without a second mutation', async () => {
  const h = harness(); const first = await h.post(), second = await h.post()
  assert.equal(second.response.status, 200); assert.equal(second.body.receipt.replayed, true)
  assert.equal(second.body.receipt.documentId, first.body.receipt.documentId); assert.equal(h.mutations, 1)
})
test('A lost response after commit is recovered by exactly the same command', async () => {
  const h = harness({ failAfterCommit: true }), lost = await h.post()
  assert.equal(lost.response.status, 503); assert.equal(lost.body.receipt, undefined)
  const recovered = await h.post(); assert.equal(recovered.response.status, 200)
  assert.equal(recovered.body.receipt.replayed, true); assert.equal(h.mutations, 1)
})
test('Readback failure cannot claim persistence; retry recovers the real existing effect', async () => {
  const h = harness({ effectFailure: true }), lost = await h.post()
  assert.equal(lost.response.status, 503); assert.equal(lost.body.adjustment, undefined)
  h.effectFailure = false
  const recovered = await h.post(); assert.equal(recovered.body.effect, 'present'); assert.equal(h.mutations, 1)
})
test('Replay precedes later date, day and unavailable-context preconditions', async () => {
  const h = harness(); await h.post()
  h.now = new Date('2027-01-03T20:00:00Z'); h.contextFailure = true
  const recovered = await h.post(); assert.equal(recovered.response.status, 200)
  assert.equal(recovered.body.receipt.replayed, true); assert.equal(h.mutations, 1)
})
test('A receipt appearing after initial lookup wins over a stale-context failure', async () => {
  const h = harness({ receiptAppearsAfterLookup: true, contextFailure: true }), result = await h.post()
  assert.equal(result.response.status, 200); assert.equal(result.body.receipt.replayed, true)
  assert.equal(h.lookups, 2); assert.equal(h.mutations, 1)
})
test('Changing content under the same request id is conflict, never overwrite', async () => {
  const h = harness(); await h.post()
  const result = await h.post(command({ adjustment: adjustment({ nextAction: 'Otra intención' }) }))
  assert.equal(result.response.status, 409); assert.equal(result.body.code, 'action_request_conflict'); assert.equal(h.mutations, 1)
})
for (const effect of ['changed', 'removed']) test(`A replay reports ${effect} current effect without resurrecting original content`, async () => {
  const h = harness(); const first = await h.post(), id = first.body.receipt.documentId
  if (effect === 'removed') h.documents.delete(id)
  else h.documents.get(id).content = JSON.stringify({ ...contract.a2ActionStoredContent(command()), nextAction: 'Otro texto actual' })
  const result = await h.post()
  assert.equal(result.response.status, 200); assert.equal(result.body.effect, effect); assert.equal(result.body.adjustment, null)
  assert.equal(result.body.receipt.documentId, id); assert.equal(h.mutations, 1)
  assert.ok(!JSON.stringify(result.body).includes(adjustment().nextAction))
})
for (const effect of ['changed', 'removed']) test(`A change immediately after commit is truthfully returned as ${effect}`, async () => {
  const h = harness({ changeAfterCommit: effect === 'changed', removeAfterCommit: effect === 'removed' })
  const result = await h.post(); assert.equal(result.response.status, 200)
  assert.equal(result.body.effect, effect); assert.equal(result.body.adjustment, null); assert.equal(h.mutations, 1)
})
test('Changed context is returned for explicit review without a write', async () => {
  const h = harness({ context: context({ completedA2Days: [1, 2, 3], highestA2DayUnlocked: 4 }) }), result = await h.post()
  assert.equal(result.response.status, 409); assert.equal(result.body.code, 'action_context_changed')
  assert.equal(result.body.view.dayNumber, 4); assert.equal(h.mutations, 0)
})
test('Day number cannot target a different unlocked or completed day', async () => {
  const h = harness(), result = await h.post(command({ dayNumber: 2 }))
  assert.equal(result.body.code, 'action_day_changed'); assert.equal(h.mutations, 0)
})
for (const reviewDate of ['2026-11-05', '2026-12-07']) test(`Review date ${reviewDate} is rejected before mutation`, async () => {
  const h = harness(), result = await h.post(command({ adjustment: adjustment({ reviewDate }) }))
  assert.equal(result.response.status, 409); assert.equal(result.body.code, 'action_review_date_invalid'); assert.equal(h.mutations, 0)
})
for (const reviewDate of ['2026-11-06', '2026-12-06']) test(`Review date ${reviewDate} is accepted at the inclusive Chile window`, async () => {
  const result = await harness().post(command({ adjustment: adjustment({ reviewDate }) }))
  assert.equal(result.response.status, 200); assert.equal(result.body.effect, 'present')
})
test('A UTC midnight still uses the calendar day in Chile', async () => {
  const h = harness({ now: new Date('2026-11-07T01:30:00Z') })
  assert.equal((await h.post(command({ adjustment: adjustment({ reviewDate: '2026-11-06' }) }))).response.status, 200)
})
for (const [name, patch] of [
  ['owner injection', { userId: OTHER }], ['generic tool', { tool: 'execute_command' }], ['missing confirmation fields', { adjustment: {} }],
  ['invalid date', { adjustment: adjustment({ reviewDate: '2026-02-30' }) }],
  ['NUL text', { adjustment: adjustment({ nextAction: 'bad\u0000text' }) }],
  ['unpaired surrogate', { adjustment: adjustment({ retainedWork: 'bad\ud800' }) }],
  ['forged full context', { context: base.snapshot }],
]) test(`${name} is rejected as an invalid command`, async () => {
  const h = harness(), result = await h.post(command(patch))
  assert.equal(result.response.status, 400); assert.equal(h.mutations, 0); assert.equal(h.lookups, 0)
})
for (const [name, headers, status] of [
  ['foreign origin', { Origin: 'https://foreign.invalid' }, 403],
  ['cross-site request', { 'Sec-Fetch-Site': 'cross-site' }, 403],
  ['non-JSON request', { 'Content-Type': 'text/plain' }, 415],
  ['declared oversized request', { 'Content-Length': String(contract.A2_ACTION_MAX_BODY_BYTES + 1) }, 413],
  ['different expected owner', { [contract.A2_ACTION_EXPECTED_ACTOR_HEADER]: OTHER }, 409],
]) test(`${name} is rejected before looking up a receipt`, async () => {
  const h = harness(), result = await h.post(command(), headers)
  assert.equal(result.response.status, status); assert.equal(h.mutations, 0); assert.equal(h.lookups, 0)
})
test('A streamed body exceeding the actual byte bound is rejected', async () => {
  const h = harness(), result = await h.post(' '.repeat(contract.A2_ACTION_MAX_BODY_BYTES + 1))
  assert.equal(result.response.status, 413); assert.equal(h.mutations, 0)
})
test('An interrupted stream cannot write or disclose provider/internal errors', async () => {
  const abort = new AbortController()
  const h = harness(); abort.abort()
  const result = await h.post(command(), {}, { signal: abort.signal })
  assert.equal(result.response.status, 408); assert.equal(h.mutations, 0)
  assert.ok(!JSON.stringify(result.body).includes(PRIVATE))
})
test('A never-ending stream terminates at the body budget and cancels its reader', async () => {
  let cancelled = false
  const stream = new ReadableStream({ cancel() { cancelled = true } })
  const h = harness(), started = Date.now()
  const result = await h.post(undefined, {}, { body: stream, duplex: 'half' })
  assert.equal(result.response.status, 408); assert.equal(h.mutations, 0); assert.equal(cancelled, true)
  assert.ok(Date.now() - started < 7_000)
})
test('Anonymous and unavailable access stop before context and receipt reads', async () => {
  for (const status of [401, 403, 503]) {
    const h = harness({ authFailure: new A2ActionApiFailure(status, 'access_denied', 'Acceso no disponible.') })
    assert.equal((await h.get()).response.status, status); assert.equal((await h.post()).response.status, status)
    assert.ok(h.calls.every(call => call === 'authorize')); assert.equal(h.mutations, 0)
  }
})
test('GET with a changed final owner exposes no context and no asserted actor header', async () => {
  const result = await harness({ verify: false }).get()
  assert.equal(result.body.code, 'session_changed'); assert.equal(result.body.view, undefined)
  assert.equal(result.response.headers.get(contract.A2_ACTION_ACTOR_HEADER), null)
})
test('A changed owner before confirmation prevents mutation', async () => {
  const h = harness({ verify: false }), result = await h.post()
  assert.equal(result.body.code, 'session_changed'); assert.equal(h.mutations, 0); assert.equal(result.body.view, undefined)
})
test('A changed owner after commit exposes no result, receipt or reviewed text', async () => {
  const h = harness({ verify: call => call === 1 }), result = await h.post()
  assert.equal(result.body.code, 'session_changed'); assert.equal(result.body.receipt, undefined); assert.equal(result.body.view, undefined)
  assert.equal(h.mutations, 1); assert.ok(!JSON.stringify(result.body).includes(adjustment().retainedWork))
})
test('Malformed or wrong-command receipts cannot be acknowledged', async () => {
  for (const change of [{ requestId: OTHER }, { dayNumber: 4 }, { committedAt: 'not-an-instant' }]) {
    const h = harness(); await h.post(); Object.assign(h.receipts.get(REQUEST).receipt, change)
    const result = await h.post(); assert.equal(result.response.status, 503); assert.equal(result.body.receipt, undefined)
    assert.equal(h.mutations, 1)
  }
})
test('Document readback compares JSON meaning regardless of key order', async () => {
  const value = row(); value.content = JSON.stringify(Object.fromEntries(Object.entries(JSON.parse(value.content)).reverse()))
  const result = await readA2ActionEffect(database([value]).client, USER, command(), receipt())
  assert.equal(result.effect, 'present'); assert.deepEqual(result.adjustment, adjustment())
})
for (const [name, committedAt, createdAt] of [
  ['Z and UTC offset', '2026-11-06T20:00:00.123456Z', '2026-11-06T20:00:00.123456+00:00'],
  ['nonzero offset', '2026-11-06T20:00:00.123456Z', '2026-11-06T17:00:00.123456-03:00'],
  ['fraction length', '2026-11-06T20:00:00.1234Z', '2026-11-06T20:00:00.123400+00:00'],
  ['absent and zero fraction across date boundary', '2026-11-06T23:30:00Z', '2026-11-07T01:30:00.000000+02:00'],
]) test(`Readback accepts the same precise instant with ${name}`, async () => {
  const proof = receipt({ committedAt }), value = { ...row(command(), proof), created_at: createdAt }
  const result = await readA2ActionEffect(database([value]).client, USER, command(), proof)
  assert.deepEqual(result, { effect: 'present', adjustment: adjustment() })
})
for (const createdAt of ['2026-11-06T20:00:00.123457+00:00', '2026-11-06T17:00:00.123789-03:00']) {
  test(`Readback rejects a timestamp changed below millisecond precision (${createdAt})`, async () => {
    const proof = receipt({ committedAt: '2026-11-06T20:00:00.123456Z' })
    const result = await readA2ActionEffect(database([{ ...row(command(), proof), created_at: createdAt }]).client, USER, command(), proof)
    assert.deepEqual(result, { effect: 'changed', adjustment: null })
  })
}
for (const [name, patch] of [
  ['malformed JSON', { content: '{broken' }], ['empty content', { content: null }],
  ['changed module', { source_module: 'a3' }], ['changed day', { related_day: 2 }],
  ['changed type', { type: 'other_document' }], ['changed status', { status: 'completed' }],
  ['invented AI provenance', { source: 'ai' }], ['changed title', { title: 'Other title' }],
  ['invalid timestamp', { created_at: 'bad' }], ['changed timestamp', { created_at: '2026-11-06T20:00:01Z' }],
  ['changed server suggestion', { content: JSON.stringify({ ...contract.a2ActionStoredContent(command()), suggestion: 'Injected suggestion' }) }],
  ['extra stored fields', { content: JSON.stringify({ ...contract.a2ActionStoredContent(command()), internal: 'extra' }) }],
]) test(`Effect with ${name} is changed and returns no prior content`, async () => {
  const result = await readA2ActionEffect(database([{ ...row(), ...patch }]).client, USER, command(), receipt())
  assert.deepEqual(result, { effect: 'changed', adjustment: null })
})
test('A missing document is removed, but SQL errors or mismatched identity are unavailable', async () => {
  assert.deepEqual(await readA2ActionEffect(database([]).client, USER, command(), receipt()), { effect: 'removed', adjustment: null })
  for (const db of [database([], { error: true }), database([{ ...row(), user_id: OTHER }]), database([{ ...row(), id: OTHER }])]) {
    await assert.rejects(readA2ActionEffect(db.client, USER, command(), receipt()), /a2_action_effect_unavailable/)
  }
})

const results = []
for (const { name, run } of tests) {
  try { await run(); results.push({ name, status: 'passed' }) }
  catch (error) { results.push({ name, status: 'failed', error: error.message }); console.error(name + ': ' + error.stack); process.exitCode = 1 }
}
assert.equal(externalNetworkCalls, 0)
const evidence = { suite: 'a2-action-api', cases: results.length, passed: results.filter(row => row.status === 'passed').length,
  actualRoute: true, actualHandlers: true, actualContextHashing: true, actualStorageReader: true, actualSupabaseSelectBuilder: true,
  sessionJourneyPortsAndStore: 'synthetic', syntheticDatabaseHttp, externalNetworkCalls, liveSqlOrRls: false, results }
if (process.env.DTC_AGENTIC_QA_OUTPUT) {
  mkdirSync(process.env.DTC_AGENTIC_QA_OUTPUT, { recursive: true })
  writeFileSync(join(process.env.DTC_AGENTIC_QA_OUTPUT, 'a2-action-api.json'), JSON.stringify(evidence, null, 2) + '\n')
}
console.log(JSON.stringify({ suite: evidence.suite, cases: evidence.cases, passed: evidence.passed,
  syntheticDatabaseHttp, externalNetworkCalls, liveSqlOrRls: false }))
