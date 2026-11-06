/** Actual plan handlers, snapshots, contracts and Supabase SELECT builder.
 * HTTP/session/store ports are synthetic. Real SQL/CAS/RLS are tested separately in the disposable CI lab. */
import assert from 'node:assert/strict'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { createRequire } from 'node:module'
import { resolve, join, dirname } from 'node:path'
import ts from 'typescript'
import { createClient } from '@supabase/supabase-js'
import { buildJourneyFlow } from '../lib/journey/flow.ts'
import { buildGuidedNextAction } from '../lib/journey/next-action.ts'
import * as contract from '../lib/a2/plan-contract.ts'
import { createA2PlanHandlers, A2PlanApiFailure } from '../lib/a2/plan-api.ts'

const require = createRequire(import.meta.url), modules = new Map()
function loadServer(file) {
  const filename = resolve(file)
  if (modules.has(filename)) return modules.get(filename).exports
  assert.ok(['lib/a2/plan-context.ts', 'lib/a2/plan-service.ts'].some(path => resolve(path) === filename))
  const module = { exports: {} }; modules.set(filename, module)
  const code = ts.transpileModule(readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
  new Function('require', 'module', 'exports', code)(key => {
    if (key === 'server-only') return {}
    if (key === './plan-contract') return contract
    if (key === './plan-context') return loadServer('lib/a2/plan-context.ts')
    if (key.startsWith('node:')) return require(key)
    throw Error('Unexpected server dependency: ' + key)
  }, module, module.exports)
  return module.exports
}
const { makeA2PlanContextSnapshot, readA2PlanContextSnapshot, canonicalPlanJson } = loadServer('lib/a2/plan-context.ts')
const { readA2PlanSlot, readA2PlanAssistantEvidence, A2_PLAN_SELECT } = loadServer('lib/a2/plan-service.ts')
const NOW = new Date('2026-11-06T20:00:00.000Z')
const USER = '00000000-0000-4000-8000-000000000901', OTHER = '00000000-0000-4000-8000-000000000902'
const PLAN = '00000000-0000-4000-8000-000000000910', STEP = '00000000-0000-4000-8000-000000000911'
const REQUEST = '00000000-0000-4000-8000-000000000912', PRIVATE = 'PRIVATE_SYNTHETIC_DETAIL'
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
  return { flow, guidance, snapshot: makeA2PlanContextSnapshot(flow, guidance, NOW) }
}
const base = context()
function content(overrides = {}) {
  return { version: contract.A2_PLAN_VERSION, purpose: 'Preparar una presentación con ejemplos propios', constraints: 'Dispongo de diez minutos por día', reviewDate: '2026-11-13',
    steps: [{ id: STEP, title: 'Primer intento', action: 'Escribir un ejemplo concreto para revisar después.', status: 'pending' }], ...overrides }
}
function plan(overrides = {}) {
  return { id: PLAN, revision: 1, state: 'active', content: content(), contextSnapshot: base.snapshot,
    createdAt: NOW.toISOString(), updatedAt: NOW.toISOString(), confirmedAt: NOW.toISOString(), ...overrides }
}
function command(operation = 'save', overrides = {}) {
  return { version: contract.A2_PLAN_COMMAND_VERSION, requestId: REQUEST, expectedRevision: 0, operation,
    ...(operation === 'save' ? { content: content(), expectedContextHash: base.snapshot.hash } : {}),
    ...(operation === 'resume' ? { expectedContextHash: base.snapshot.hash } : {}), ...overrides }
}
function request(method, body, headers = {}, options = {}) {
  return new Request('https://dtc.test/api/a2/plan', {
    method, headers: { [contract.A2_PLAN_EXPECTED_ACTOR_HEADER]: USER, ...(method === 'POST' ? { Origin: 'https://dtc.test', 'Content-Type': 'application/json', 'Sec-Fetch-Site': 'same-origin' } : {}), ...headers },
    ...(method === 'POST' ? { body: typeof body === 'string' ? body : JSON.stringify(body) } : {}), ...options,
  })
}
function harness(options = {}) {
  let slot = copy(options.slot ?? { revision: 0, plan: null }), current = copy(options.context ?? base)
  let mutations = 0, receiptsRead = 0, verifications = 0, failAfterCommit = options.failAfterCommit
  const receipts = new Map(options.receipts ?? []), calls = []
  const handlers = createA2PlanHandlers({
    now: () => NOW,
    authorize: async () => { calls.push('authorize'); if (options.authFailure) throw options.authFailure; return { id: USER } },
    verifyOwner: async () => { verifications++; return typeof options.verify === 'function' ? options.verify(verifications) : options.verify !== false },
    readSlot: async () => { calls.push('slot'); if (options.readFailure) throw Error(PRIVATE); return copy(slot) },
    readContext: async () => { calls.push('context'); if (options.contextFailure) throw Error(PRIVATE); return copy(current) },
    readReceipt: async (_, cmd) => {
      receiptsRead++; calls.push('receipt')
      const entry = receipts.get(cmd.requestId)
      if (!entry && receiptsRead === 1 && options.receiptAppearsAfterLookup) {
        slot = { revision: 1, plan: plan() }
        receipts.set(cmd.requestId, { command: canonicalPlanJson(cmd), receipt: {
          requestId: cmd.requestId, planId: PLAN, revision: 1, state: 'active', committedAt: NOW.toISOString(), replayed: false,
        } })
        return null
      }
      if (!entry) return null
      if (entry.command !== canonicalPlanJson(cmd)) throw new A2PlanApiFailure(409, 'plan_request_conflict', 'El envío corresponde a otra edición.')
      return { ...entry.receipt, replayed: true }
    },
    mutate: async (_, cmd, snapshot) => {
      calls.push('mutate')
      if (options.race) { slot = copy(options.race); throw new A2PlanApiFailure(409, 'plan_conflict', 'Hay una versión más reciente.') }
      assert.equal(cmd.expectedRevision, slot.revision)
      mutations++
      const revision = slot.revision + 1
      const states = { save: 'active', pause: 'paused', resume: 'active', complete: 'completed', cancel: 'cancelled', delete: 'deleted' }
      const state = states[cmd.operation]
      slot = { revision, plan: cmd.operation === 'delete' ? null : plan({
        ...(slot.plan ?? {}), revision, state,
        ...(cmd.operation === 'save' ? { content: copy(cmd.content), contextSnapshot: copy(snapshot) } : {}), updatedAt: NOW.toISOString(),
      }) }
      const receipt = { requestId: cmd.requestId, planId: PLAN, revision, state, committedAt: NOW.toISOString(), replayed: false }
      receipts.set(cmd.requestId, { command: canonicalPlanJson(cmd), receipt })
      if (failAfterCommit) { failAfterCommit = false; throw Error(PRIVATE) }
      return receipt
    },
  })
  return { calls, receipts, get mutations() { return mutations }, get receiptsRead() { return receiptsRead },
    get slot() { return slot }, set slot(value) { slot = copy(value) }, set context(value) { current = copy(value) },
    async get(headers = {}) { const response = await handlers.GET(request('GET', undefined, headers)); return { response, body: await response.json() } },
    async post(cmd = command(), headers = {}, options = {}) { const response = await handlers.POST(request('POST', cmd, headers, options)); return { response, body: await response.json() } },
  }
}
function row(value = plan()) {
  return { user_id: USER, plan_id: PLAN, revision: value.revision, status: value.state, content: value.content,
    context_snapshot: value.contextSnapshot, reviewed_at: value.confirmedAt, review_date: value.content.reviewDate,
    created_at: value.createdAt, updated_at: value.updatedAt, deleted_at: null }
}
function database(rows, options = {}) {
  const calls = []
  const client = createClient('https://synthetic.invalid', 'synthetic-public-key', {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: async (url, init = {}) => {
      syntheticDatabaseHttp++
      const parsed = new URL(url); calls.push({ url: parsed, method: init.method ?? 'GET' })
      assert.equal(parsed.origin, 'https://synthetic.invalid')
      assert.equal(parsed.pathname, '/rest/v1/a2_reviewed_plans')
      assert.equal(init.method ?? 'GET', 'GET')
      assert.equal(parsed.searchParams.get('user_id'), 'eq.' + USER)
      assert.equal(parsed.searchParams.get('select'), A2_PLAN_SELECT)
      return Response.json(options.error ? { code: 'XX001', message: PRIVATE } : rows, { status: options.error ? 503 : 200 })
    } },
  })
  return { client, calls }
}

test('Content fingerprint ignores capture time and JSON key insertion order', () => {
  const later = makeA2PlanContextSnapshot(base.flow, base.guidance, new Date(NOW.getTime() + 60_000))
  assert.equal(later.hash, base.snapshot.hash); assert.notEqual(later.capturedAt, base.snapshot.capturedAt)
  assert.equal(canonicalPlanJson({ b: 2, a: 1 }), canonicalPlanJson({ a: 1, b: 2 }))
  assert.equal(canonicalPlanJson({ a: 1, absent: undefined }), canonicalPlanJson({ a: 1 }))
  assert.equal(canonicalPlanJson([undefined, 1]), '[null,1]')
})
test('Canonical progress change produces a different context', () => assert.notEqual(context({ completedA2Days: [1, 2, 3], highestA2DayUnlocked: 4 }).snapshot.hash, base.snapshot.hash))
test('Stored context hash tampering is rejected', () => assert.throws(() => readA2PlanContextSnapshot({ ...base.snapshot, hash: 'f'.repeat(64) })))
test('Real SDK reads only explicit fields for the requested owner', async () => {
  const db = database([row()]), result = await readA2PlanSlot(db.client, USER)
  assert.deepEqual(result, { revision: 1, plan: plan() }); assert.equal(db.calls.length, 1)
})
test('No row and a failed read have different results', async () => {
  assert.deepEqual(await readA2PlanSlot(database([]).client, USER), { revision: 0, plan: null })
  await assert.rejects(readA2PlanSlot(database([], { error: true }).client, USER))
})
test('A transport returning another owner is rejected despite the explicit filter', async () => {
  await assert.rejects(readA2PlanSlot(database([{ ...row(), user_id: OTHER }]).client, USER))
})
test('Tombstone preserves revision but cannot expose historical content', async () => {
  const deleted = { ...row(), status: 'deleted', revision: 5, content: null, context_snapshot: null, review_date: null, deleted_at: NOW.toISOString() }
  assert.deepEqual(await readA2PlanSlot(database([deleted]).client, USER), { revision: 5, plan: null })
  await assert.rejects(readA2PlanSlot(database([{ ...deleted, content: content() }]).client, USER))
})
test('A corrupted stored snapshot cannot enter assistant memory', async () => {
  const bad = { ...row(), context_snapshot: { ...base.snapshot, hash: 'f'.repeat(64) } }
  assert.equal((await readA2PlanAssistantEvidence(database([bad]).client, USER, base.flow, base.guidance, NOW)).status, 'unavailable')
})
test('Only active current reviewed intent reaches the model with no owner or step IDs', async () => {
  const memory = await readA2PlanAssistantEvidence(database([row()]).client, USER, base.flow, base.guidance, NOW)
  assert.equal(memory.status, 'available'); assert.equal(memory.memory.completionMeaning, 'user_declaration_only')
  for (const id of [USER, PLAN, STEP]) assert.ok(!JSON.stringify(memory).includes(id))
})
for (const state of ['paused', 'completed', 'cancelled']) test(`Inactive ${state} memory is excluded`, async () => {
  const complete = content({ steps: [{ ...content().steps[0], status: 'reported_done' }] })
  const result = await readA2PlanAssistantEvidence(database([row(plan({ state, content: complete }))]).client, USER, base.flow, base.guidance, NOW)
  assert.deepEqual(result, { status: 'inactive', memory: null })
})
test('Changed and expired plan text are excluded from assistant memory', async () => {
  const changed = context({ completedA2Days: [1, 2, 3], highestA2DayUnlocked: 4 })
  assert.equal((await readA2PlanAssistantEvidence(database([row()]).client, USER, changed.flow, changed.guidance, NOW)).status, 'changed')
  assert.equal((await readA2PlanAssistantEvidence(database([row(plan({ content: content({ reviewDate: '2026-11-05' }) }))]).client, USER, base.flow, base.guidance, NOW)).status, 'expired')
})
test('GET returns a confirmed empty slot with private no-store and actor headers', async () => {
  const result = await harness().get(); assert.equal(result.response.status, 200)
  assert.equal(result.body.plan, null); assert.equal(result.body.revision, 0); assert.equal(result.body.freshness.status, 'none')
  assert.equal(result.response.headers.get(contract.A2_PLAN_ACTOR_HEADER), USER)
  for (const header of ['Cache-Control', 'CDN-Cache-Control', 'Vercel-CDN-Cache-Control']) assert.match(result.response.headers.get(header), /no-store/)
})
test('Source failure preserves the saved plan without declaring it current', async () => {
  const result = await harness({ slot: { revision: 1, plan: plan() }, contextFailure: true }).get()
  assert.equal(result.response.status, 200); assert.equal(result.body.plan.content.purpose, content().purpose)
  assert.equal(result.body.freshness.status, 'unavailable'); assert.equal(result.body.context, null)
})
test('Storage failure never becomes a successful empty GET', async () => {
  const result = await harness({ readFailure: true }).get(); assert.equal(result.response.status, 503)
  assert.equal(result.body.plan, undefined); assert.ok(!JSON.stringify(result.body).includes(PRIVATE))
})
test('Absent authorization and mismatched expected actor cannot read plan data', async () => {
  const denied = harness({ authFailure: new A2PlanApiFailure(401, 'authentication_required', 'Inicia sesión.') })
  assert.equal((await denied.get()).response.status, 401); assert.deepEqual(denied.calls, ['authorize'])
  const wrong = harness(); assert.equal((await wrong.get({ [contract.A2_PLAN_EXPECTED_ACTOR_HEADER]: OTHER })).response.status, 409)
  assert.deepEqual(wrong.calls, ['authorize'])
})
for (const [label, headers, status] of [
  ['foreign origin', { Origin: 'https://other.test' }, 403], ['missing origin', { Origin: '' }, 403],
  ['cross-site', { 'Sec-Fetch-Site': 'cross-site' }, 403], ['wrong content type', { 'Content-Type': 'text/plain' }, 415],
]) test(`${label} cannot reach receipts or mutations`, async () => {
  const h = harness(), result = await h.post(command(), headers)
  assert.equal(result.response.status, status); assert.equal(h.receiptsRead, 0); assert.equal(h.mutations, 0)
})
test('Malformed JSON, extra control fields and an oversized UTF8 body are rejected', async () => {
  for (const [body, status] of [['{', 400], [command('save', { userId: OTHER }), 400], ['"' + 'ñ'.repeat(9000) + '"', 413]]) {
    const h = harness(); assert.equal((await h.post(body)).response.status, status); assert.equal(h.mutations, 0)
  }
})
test('Save confirms only server context and returns a receipt plus recoverable current state', async () => {
  const h = harness(), result = await h.post()
  assert.equal(result.response.status, 200); assert.equal(result.body.receipt.requestId, REQUEST)
  assert.equal(result.body.receipt.revision, 1); assert.equal(result.body.plan.contextSnapshot.hash, base.snapshot.hash)
  assert.equal(result.body.plan.content.purpose, content().purpose)
  assert.equal((await h.get()).body.plan.revision, 1)
})
test('Lost acknowledgment retries the same command without a second mutation', async () => {
  const h = harness({ failAfterCommit: true })
  assert.equal((await h.post()).response.status, 503)
  const retry = await h.post(); assert.equal(retry.response.status, 200)
  assert.equal(retry.body.receipt.replayed, true); assert.equal(retry.body.plan.revision, 1); assert.equal(h.mutations, 1)
})
test('Concurrent identical commit appearing after receipt lookup is recovered before CAS rejection', async () => {
  const h = harness({ receiptAppearsAfterLookup: true }), result = await h.post()
  assert.equal(result.response.status, 200); assert.equal(result.body.receipt.replayed, true)
  assert.equal(result.body.plan.revision, 1); assert.equal(h.mutations, 0); assert.equal(h.receiptsRead, 2)
})
test('Reusing a request ID for different content is a conflict', async () => {
  const h = harness(); await h.post()
  const result = await h.post(command('save', { content: content({ purpose: 'Otra intención' }) }))
  assert.equal(result.response.status, 409); assert.equal(result.body.code, 'plan_request_conflict'); assert.equal(h.mutations, 1)
})
test('A stale expected revision preserves and returns the newer plan', async () => {
  const h = harness({ slot: { revision: 3, plan: plan({ revision: 3 }) } }), result = await h.post()
  assert.equal(result.response.status, 409); assert.equal(result.body.code, 'plan_conflict')
  assert.equal(result.body.view.plan.revision, 3); assert.equal(h.mutations, 0)
})
test('A CAS race refreshes the conflicting response to the actual newer revision', async () => {
  const h = harness({ race: { revision: 2, plan: plan({ revision: 2 }) } }), result = await h.post()
  assert.equal(result.response.status, 409); assert.equal(result.body.view.revision, 2)
})
test('An old replay after cancellation cannot reactivate the plan despite changed sources', async () => {
  const h = harness(); await h.post()
  h.slot = { revision: 2, plan: plan({ revision: 2, state: 'cancelled' }) }
  h.context = context({ completedA2Days: [1, 2, 3], highestA2DayUnlocked: 4 })
  const result = await h.post(); assert.equal(result.response.status, 200)
  assert.equal(result.body.receipt.revision, 1); assert.equal(result.body.plan.state, 'cancelled')
  assert.equal(result.body.plan.revision, 2); assert.equal(h.mutations, 1)
})
test('Replay after deletion returns the old receipt and an empty current tombstone', async () => {
  const h = harness(); await h.post(); h.slot = { revision: 3, plan: null }
  const result = await h.post(); assert.equal(result.response.status, 200)
  assert.equal(result.body.receipt.revision, 1); assert.equal(result.body.plan, null); assert.equal(result.body.revision, 3)
})
test('A mismatched receipt is never acknowledged as success', async () => {
  const h = harness(); await h.post(); h.receipts.get(REQUEST).receipt.requestId = OTHER
  const result = await h.post(); assert.equal(result.response.status, 503); assert.equal(result.body.receipt, undefined)
})
test('Changed context blocks new confirmation without writing', async () => {
  const h = harness({ context: context({ completedA2Days: [1, 2, 3], highestA2DayUnlocked: 4 }) })
  const result = await h.post(); assert.equal(result.response.status, 409)
  assert.equal(result.body.code, 'plan_context_changed'); assert.equal(h.mutations, 0)
})
test('Unavailable context blocks save but does not prevent cancellation', async () => {
  const h = harness({ slot: { revision: 1, plan: plan() }, contextFailure: true })
  const save = await h.post(command('save', { expectedRevision: 1 })); assert.equal(save.response.status, 503)
  const cancel = await h.post(command('cancel', { expectedRevision: 1 })); assert.equal(cancel.response.status, 200)
  assert.equal(cancel.body.plan.state, 'cancelled')
})
test('Only a reviewed current paused plan can resume', async () => {
  const h = harness({ slot: { revision: 1, plan: plan({ state: 'paused' }) } })
  assert.equal((await h.post(command('resume', { expectedRevision: 1 }))).response.status, 200)
  const stale = harness({ slot: { revision: 1, plan: plan({ state: 'paused' }) }, context: context({ completedA2Days: [1, 2, 3], highestA2DayUnlocked: 4 }) })
  const result = await stale.post(command('resume', { expectedRevision: 1, expectedContextHash: context({ completedA2Days: [1, 2, 3], highestA2DayUnlocked: 4 }).snapshot.hash }))
  assert.equal(result.response.status, 409); assert.equal(stale.mutations, 0)
})
test('Completion requires reviewed declared steps and does not invoke any progress port', async () => {
  const pending = harness({ slot: { revision: 1, plan: plan() } })
  assert.equal((await pending.post(command('complete', { expectedRevision: 1 }))).response.status, 409)
  const finished = harness({ slot: { revision: 1, plan: plan({ content: content({ steps: [{ ...content().steps[0], status: 'reported_done' }] }) }) } })
  const result = await finished.post(command('complete', { expectedRevision: 1 }))
  assert.equal(result.response.status, 200); assert.equal(result.body.plan.state, 'completed')
  assert.ok(finished.calls.every(value => ['authorize', 'receipt', 'slot', 'context', 'mutate'].includes(value)))
})
test('Expired or distant review date is rejected before mutation', async () => {
  for (const reviewDate of ['2026-11-05', '2027-01-01']) {
    const h = harness(), result = await h.post(command('save', { content: content({ reviewDate }) }))
    assert.equal(result.response.status, 409); assert.equal(h.mutations, 0)
  }
})
test('A final owner change clears private data from GET and blocks pre-write mutation', async () => {
  const get = await harness({ slot: { revision: 1, plan: plan() }, verify: false }).get()
  assert.equal(get.body.code, 'session_changed'); assert.ok(!JSON.stringify(get.body).includes(content().purpose))
  const h = harness({ verify: false }), post = await h.post()
  assert.equal(post.body.code, 'session_changed'); assert.equal(h.mutations, 0)
})
test('An owner change after commit does not disclose the old plan or receipt', async () => {
  const h = harness({ verify: call => call === 1 }), result = await h.post()
  assert.equal(result.body.code, 'session_changed'); assert.equal(result.body.receipt, undefined)
  assert.equal(result.body.view, undefined); assert.equal(h.mutations, 1)
})
test('An aborted request does not write a new plan', async () => {
  const controller = new AbortController(); controller.abort()
  const h = harness(), result = await h.post(command(), {}, { signal: controller.signal })
  assert.equal(result.response.status, 408); assert.equal(h.mutations, 0)
})

const results = []
for (const { name, run } of tests) {
  try { await run(); results.push({ name, status: 'passed' }) }
  catch (error) { results.push({ name, status: 'failed', error: error.message }); console.error(name + ': ' + error.stack); process.exitCode = 1 }
}
assert.equal(externalNetworkCalls, 0)
const evidence = { suite: 'a2-plan-api', cases: results.length, passed: results.filter(r => r.status === 'passed').length,
  actualHandlers: true, actualContextHashing: true, actualStorageReader: true, actualSupabaseSelectBuilder: true,
  sessionAndStore: 'synthetic', syntheticDatabaseHttp, externalNetworkCalls, liveSqlOrRls: false, results }
if (process.env.DTC_AGENTIC_QA_OUTPUT) {
  mkdirSync(process.env.DTC_AGENTIC_QA_OUTPUT, { recursive: true })
  writeFileSync(join(process.env.DTC_AGENTIC_QA_OUTPUT, 'a2-plan-api.json'), JSON.stringify(evidence, null, 2) + '\n')
}
console.log(JSON.stringify({ suite: evidence.suite, cases: evidence.cases, passed: evidence.passed, syntheticDatabaseHttp, externalNetworkCalls, liveSqlOrRls: false }))
