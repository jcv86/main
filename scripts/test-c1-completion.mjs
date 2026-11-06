// Execute the real Route Handler, Supabase Auth/PostgREST SDK, client helpers,
// draft hook and page handlers. Only HTTP and React/Next boundaries are synthetic.
// Database atomicity, locks, RLS and browser rendering are separate local gates.
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'
import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createClient as createSdkClient } from '@supabase/supabase-js'
import * as completion from '../lib/c1-completion.ts'
import * as answers from '../lib/c1-responses.ts'
import * as drafts from '../lib/assessment-drafts.ts'
import { CONOZCAMONOS_1_QUESTIONS as questions } from '../lib/canon-conozcamonos-1-questions.ts'

const BASE = 'https://synthetic.invalid'
const USER = '22222222-2222-4222-8222-222222222222'
const OTHER_USER = '55555555-5555-4555-8555-555555555555'
const RESPONSE = '33333333-3333-4333-8333-333333333333'
const DRAFT = '44444444-4444-4444-8444-444444444444'
const REVISION = '2026-11-06T17:00:00.123456+00:00'
const FINISHED = '2026-11-06T17:01:00.654321+00:00'
const RAW = {
  1: ['Empleado de tiempo parcial', 'Otro'], 2: ['1-3 años'],
  3: 'Ordenar mis prioridades y coordinar mejor mi trabajo con el equipo.',
  4: 'Preparar una transición profesional con un plan claro para los próximos meses.',
  5: ['Otro'], 6: ['3-5 horas'], 7: ['Práctica directa/ejercicios'],
  _customResponses: { 1: ' Un proyecto independiente ', 5: ' Con personas cercanas ' },
}
const INPUT = { schemaVersion: 1, answers: RAW, expectedDraftUpdatedAt: REVISION }
const DONE = { state: 'completed', origin: 'atomic', responseId: RESPONSE, draftId: DRAFT,
  completedAt: FINISHED, replayed: false, nextPath: completion.C1_NEXT_PATH }
const DRAFT_VALUE = { assessmentType: 'c1', schemaVersion: 1, currentQuestion: 6,
  answers: RAW, timings: [], updatedAt: REVISION, completedAt: null }
const tests = []
const test = (name, run) => tests.push({ name, run })
const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { 'Content-Type': 'application/json', 'X-Supabase-Api-Version': '2024-01-01' },
})
const statusJson = (body, userId = USER) => {
  const response = json(body)
  response.headers.set(completion.C1_ACTOR_HEADER, userId)
  return response
}
const clone = value => structuredClone(value)
const compile = source => ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText
const routeSource = compile(readFileSync('app/api/journey/complete-c1/route.ts', 'utf8'))
const draftRouteSource = compile(readFileSync('app/api/assessments/drafts/[assessmentType]/route.ts', 'utf8'))

function sessionFixture() {
  const now = Math.floor(Date.now() / 1000)
  const token = [{ alg: 'HS256', typ: 'JWT' }, {
    sub: USER, aud: 'authenticated', role: 'authenticated', iat: now, exp: now + 3600,
  }].map(value => Buffer.from(JSON.stringify(value)).toString('base64url')).join('.') + '.synthetic'
  return { access_token: token, refresh_token: 'synthetic-refresh', token_type: 'bearer',
    expires_in: 3600, expires_at: now + 3600,
    user: { id: USER, aud: 'authenticated', email: 'synthetic@example.invalid',
      role: 'authenticated', app_metadata: {}, user_metadata: {}, created_at: REVISION } }
}

function routeHarness(options = {}) {
  const calls = [], cookies = new Map()
  let adminClients = 0
  if (!options.anonymous) cookies.set('sb-synthetic-auth-token', 'base64-' + Buffer.from(JSON.stringify(sessionFixture())).toString('base64url'))
  const transport = async (target, init = {}) => {
    const url = new URL(String(target))
    assert.equal(url.origin, BASE, 'Only the synthetic transport may run.')
    calls.push({ path: url.pathname, method: init.method, body: init.body ? JSON.parse(init.body) : null })
    if (url.pathname === '/auth/v1/user') {
      if (options.authError) return json({ code: 'bad_jwt', message: 'PRIVATE_AUTH_DIAGNOSTIC' }, options.authError)
      return json(sessionFixture().user)
    }
    if (url.pathname.startsWith('/rest/v1/rpc/')) {
      if (options.databaseError) return json({ ...options.databaseError, details: 'PRIVATE_SQL_DETAIL', hint: 'PRIVATE_SQL_HINT' }, 400)
      if (options.transportError) throw new Error('PRIVATE_NETWORK_DIAGNOSTIC')
      return json(options.result ?? (url.pathname.endsWith('/get_c1_completion_status')
        ? { state: 'in_progress', draft: DRAFT_VALUE } : DONE))
    }
    if (url.pathname === '/rest/v1/assessment_drafts') {
      return init.method === 'PATCH' ? new Response(null, { status: 204 }) : json({ updated_at: REVISION })
    }
    throw new Error('Unexpected synthetic path: ' + url.pathname)
  }
  const dependencies = {
    'next/server': { NextResponse },
    '@/lib/c1-completion': completion,
    '@/lib/assessment-drafts': drafts,
    '@/lib/supabase/server': {
      createClient: async () => {
        if (options.configError) throw Error('PRIVATE_AUTH_CONFIGURATION')
        return createServerClient(BASE, 'synthetic-anon-key', { global: { fetch: transport }, cookies: {
          getAll: () => [...cookies].map(([name, value]) => ({ name, value })),
          setAll: values => values.forEach(({ name, value }) => value ? cookies.set(name, value) : cookies.delete(name)),
        } })
      },
      createAdminClient: () => {
        adminClients++
        if (options.adminConfigError) throw Error('PRIVATE_ADMIN_CONFIGURATION')
        return createSdkClient(BASE, 'synthetic-service-key', {
          auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }, global: { fetch: transport },
        })
      },
    },
  }
  const module = { exports: {} }
  new Function('require', 'module', 'exports', routeSource)(name => {
    assert.ok(Object.hasOwn(dependencies, name), 'Unmocked route dependency: ' + name)
    return dependencies[name]
  }, module, module.exports)
  const draftModule = { exports: {} }
  new Function('require', 'module', 'exports', draftRouteSource)(name => {
    assert.ok(Object.hasOwn(dependencies, name), 'Unmocked draft route dependency: ' + name)
    return dependencies[name]
  }, draftModule, draftModule.exports)
  const expectedActor = Object.hasOwn(options, 'expectedActor') ? options.expectedActor : USER
  const requestHeaders = { 'Content-Type': 'application/json',
    ...(expectedActor ? { [completion.C1_EXPECTED_ACTOR_HEADER]: expectedActor } : {}) }
  return {
    calls, get adminClients() { return adminClients },
    async request(method = 'POST', input = INPUT, raw) {
      const request = new Request(BASE + completion.C1_COMPLETION_PATH, { method,
        ...(method === 'POST' ? { headers: requestHeaders, body: raw ?? JSON.stringify(input) } : {}) })
      const response = await module.exports[method](request)
      const body = await response.json()
      assert.match(response.headers.get('cache-control'), /private, no-store/)
      assert.equal(response.headers.get('cdn-cache-control'), 'no-store')
      assert.equal(response.headers.get('vercel-cdn-cache-control'), 'no-store')
      assert.doesNotMatch(JSON.stringify(body), /PRIVATE_|access_token|refresh_token|synthetic@example/)
      return { response, body }
    },
    async draftRequest(method = 'PUT', assessmentType = 'c1') {
      const input = assessmentType === 'c1' ? DRAFT_VALUE
        : { schemaVersion: 1, currentQuestion: 0, answers: { more: {}, less: {} }, timings: [] }
      const request = new Request(BASE + '/api/assessments/drafts/' + assessmentType, {
        method, headers: requestHeaders, ...(method === 'PUT' ? { body: JSON.stringify(input) } : {}),
      })
      const response = await draftModule.exports[method](request, { params: Promise.resolve({ assessmentType }) })
      return { response, body: await response.json() }
    },
  }
}

test('partial drafts remain valid while completion requires seven complete canonical answers', () => {
  assert.equal(answers.validateC1DraftAnswers({ 3: '' }), true)
  assert.equal(answers.validateC1CompletionAnswers({ 3: '' }), false)
  assert.equal(answers.validateC1CompletionAnswers(RAW), true)
  assert.equal(answers.validateC1CompletionAnswers({ ...RAW, _customResponses: { 1: '', 5: '' } }), true)
  for (const invalid of [
    { ...RAW, 3: ' \t\n' }, { ...RAW, 4: '' }, { ...RAW, 7: [] },
    { ...RAW, 7: ['Videos', 'Videos'] }, { ...RAW, 2: ['invented'] },
    { ...RAW, 3: 'x'.repeat(501) }, { ...RAW, 8: 'invented' },
    { ...RAW, _customResponses: { 2: 'no Otro here' } },
  ]) assert.equal(answers.validateC1CompletionAnswers(invalid), false)
})

test('actor comes from verified Auth and a valid request calls exactly one atomic RPC', async () => {
  const h = routeHarness(), { response, body } = await h.request()
  assert.equal(response.status, 200)
  assert.deepEqual(body, { success: true, ...DONE })
  assert.deepEqual(h.calls.map(call => call.path), ['/auth/v1/user', '/rest/v1/rpc/complete_c1_atomic'])
  assert.deepEqual(h.calls[1].body, { p_user_id: USER, p_schema_version: 1,
    p_answers: RAW, p_expected_draft_updated_at: REVISION })
  assert.equal(h.adminClients, 1)
})

test('anonymous and expired authentication return 401 before any service-role operation', async () => {
  for (const options of [{ anonymous: true }, { authError: 401 }]) {
    for (const method of ['GET', 'POST']) {
      const h = routeHarness(options), result = await h.request(method)
      assert.equal(result.response.status, 401)
      assert.equal(result.body.error, 'authentication_required')
      assert.equal(h.adminClients, 0)
    }
  }
})

test('Auth/configuration service failures are recoverable 503 and cannot reach completion', async () => {
  for (const options of [{ authError: 503 }, { configError: true }]) {
    const h = routeHarness(options), { response, body } = await h.request()
    assert.equal(response.status, 503)
    assert.equal(body.error, 'completion_unavailable')
    assert.equal(h.adminClients, 0)
  }
})

test('malformed payloads and browser-supplied identities fail 422 before the RPC', async () => {
  for (const input of [null, [], {}, { ...INPUT, userId: USER }, { ...INPUT, operationId: 'forged' },
    { ...INPUT, schemaVersion: 2 }, { ...INPUT, expectedDraftUpdatedAt: undefined },
    { ...INPUT, expectedDraftUpdatedAt: 'yesterday' }, { ...INPUT, answers: { 3: 'partial' } }]) {
    const h = routeHarness(), { response } = await h.request('POST', input)
    assert.equal(response.status, 422)
    assert.equal(h.adminClients, 0)
  }
  const h = routeHarness()
  assert.equal((await h.request('POST', undefined, '{')).response.status, 422)
  assert.equal(h.adminClients, 0)
})

test('a first submission may explicitly expect no draft; timestamp microseconds are preserved', async () => {
  const h = routeHarness()
  assert.equal((await h.request('POST', { ...INPUT, expectedDraftUpdatedAt: null })).response.status, 200)
  assert.equal(h.calls[1].body.p_expected_draft_updated_at, null)
  assert.equal(completion.parseC1CompletionInput(INPUT).expectedDraftUpdatedAt, REVISION)
})

test('missing or changed owner rejects C1 completion and both draft mutations before writing', async () => {
  for (const expectedActor of [null, OTHER_USER]) {
    const h = routeHarness({ expectedActor })
    for (const call of [() => h.request(), () => h.draftRequest('PUT'), () => h.draftRequest('POST')]) {
      const { response, body } = await call()
      assert.equal(response.status, 409)
      assert.equal(body.error, 'session_changed')
    }
    assert.equal(h.adminClients, 0)
    assert.equal(h.calls.some(call => call.path.startsWith('/rest/')), false)
  }
})

test('C1 draft writes use only verified owner, and A1 retains its existing header-free contract', async () => {
  const c1 = routeHarness()
  assert.equal((await c1.draftRequest()).response.status, 200)
  assert.equal(c1.calls.find(call => call.path === '/rest/v1/assessment_drafts').body.user_id, USER)
  const a1 = routeHarness({ expectedActor: null })
  for (const method of ['PUT', 'POST']) assert.equal((await a1.draftRequest(method, 'a1')).response.status, 200)
})

test('only named SQL business failures map to public 403/422/409; diagnostics stay private', async () => {
  const cases = [
    ['42501', 'c1_access_required', 403, 'access_required'],
    ['22023', 'c1_invalid_payload', 422, 'invalid_answers'],
    ['22023', 'c1_unsupported_version', 422, 'invalid_answers'],
    ['P0001', 'c1_draft_changed', 409, 'draft_changed'],
    ['P0001', 'c1_already_completed_with_different_answers', 409, 'completion_conflict'],
    ['P0001', 'c1_completion_inconsistent', 409, 'recovery_required'],
    ['P0001', 'c1_legacy_completion_conflict', 409, 'recovery_required'],
    ['42501', 'permission denied for table PRIVATE_TABLE', 503, 'completion_unavailable'],
    ['XX000', 'PRIVATE_DATABASE_DIAGNOSTIC', 503, 'completion_unavailable'],
  ]
  for (const [code, message, status, error] of cases) {
    const h = routeHarness({ databaseError: { code, message } }), result = await h.request()
    assert.equal(result.response.status, status)
    assert.equal(result.body.error, error)
    assert.equal(result.body.success, false)
  }
})

test('service transport/configuration failures never report completion', async () => {
  for (const options of [{ transportError: true }, { adminConfigError: true }]) {
    const { response, body } = await routeHarness(options).request()
    assert.equal(response.status, 503)
    assert.equal(body.success, false)
  }
})

test('POST requires a verified complete receipt rather than a successful HTTP envelope', async () => {
  for (const result of [{}, [], { ...DONE, state: 'in_progress' }, { ...DONE, responseId: null },
    { ...DONE, draftId: null }, { ...DONE, completedAt: null }, { ...DONE, origin: 'inferred' },
    { ...DONE, replayed: undefined }, { ...DONE, nextPath: 'https://untrusted.invalid' }]) {
    assert.equal((await routeHarness({ result }).request()).response.status, 503)
  }
})

test('GET preserves drafts and distinguishes verified atomic/legacy completion and recovery', async () => {
  const completed = { ...DONE, draft: null }
  delete completed.replayed
  const states = [
    { state: 'not_started', draft: null }, { state: 'in_progress', draft: DRAFT_VALUE }, completed,
    { ...completed, origin: 'legacy', draftId: null },
    { state: 'recovery_required', draft: { ...DRAFT_VALUE, completedAt: FINISHED } },
    { state: 'recovery_required', draft: null },
  ]
  for (const result of states) {
    const h = routeHarness({ result }), { response, body } = await h.request('GET')
    assert.equal(response.status, 200)
    assert.equal(response.headers.get(completion.C1_ACTOR_HEADER), USER)
    assert.deepEqual(body, result)
    assert.deepEqual(h.calls[1], { path: '/rest/v1/rpc/get_c1_completion_status', method: 'POST', body: { p_user_id: USER } })
  }
})

test('malformed status never becomes an empty form or a false completion', async () => {
  for (const result of [{}, { state: 'completed', draft: null },
    { ...DONE, draft: null, completedAt: undefined }, { state: 'not_started', draft: null, responseId: RESPONSE },
    { state: 'in_progress', draft: null }, { state: 'in_progress', draft: { ...DRAFT_VALUE, updatedAt: undefined } },
    { state: 'in_progress', draft: { ...DRAFT_VALUE, completedAt: FINISHED } },
    { state: 'recovery_required', draft: {} }]) {
    assert.equal((await routeHarness({ result }).request('GET')).response.status, 503)
  }
})

test('client sends one raw atomic payload and accepts a verified replay receipt', async () => {
  const calls = []
  const result = await completion.completeC1(INPUT, USER, async (path, init) => {
    calls.push({ path, ...init })
    return json({ success: true, ...DONE, replayed: true })
  })
  assert.equal(result.replayed, true)
  assert.equal(calls.length, 1)
  assert.equal(calls[0].path, completion.C1_COMPLETION_PATH)
  assert.equal(calls[0].method, 'POST')
  assert.deepEqual(JSON.parse(calls[0].body), INPUT)
  assert.equal(calls[0].cache, 'no-store')
  assert.equal(calls[0].headers[completion.C1_EXPECTED_ACTOR_HEADER], USER)
})

test('a lost completion response can recover through GET without submitting again', async () => {
  const calls = [], before = clone(INPUT)
  const transport = async (path, init) => {
    calls.push(init.method)
    if (init.method === 'POST') throw new TypeError('synthetic lost response after server commit')
    return statusJson({ ...DONE, draft: null })
  }
  await assert.rejects(completion.completeC1(INPUT, USER, transport), { code: 'completion_unavailable' })
  const result = await completion.loadC1CompletionStatus(transport)
  assert.equal(result.state, 'completed')
  assert.deepEqual(calls, ['POST', 'GET'])
  assert.deepEqual(INPUT, before)
})

test('HTML failures, invalid success and unknown errors stay safe and recoverable in the client', async () => {
  for (const response of [new Response('PRIVATE_PROXY_FAILURE', { status: 503 }),
    json({ success: true }), json({ success: false, error: 'PRIVATE_SQL_ERROR', message: 'PRIVATE_DETAIL' }, 503)]) {
    await assert.rejects(completion.completeC1(INPUT, USER, async () => response), error => {
      assert.equal(error.code, 'completion_unavailable')
      assert.equal(error.message, completion.C1_COMPLETION_ERRORS.completion_unavailable.message)
      return true
    })
  }
})

test('status without a verified owner header cannot load a writable form', async () => {
  await assert.rejects(completion.loadC1CompletionStatus(async () => json({ state: 'in_progress', draft: DRAFT_VALUE })),
    { code: 'completion_unavailable' })
  await assert.rejects(completion.completeC1(INPUT, '', async () => { throw Error('Must not submit') }),
    { code: 'session_changed' })
})

// Run the actual component's handlers rather than reproducing their control flow.
const pageSource = ts.createSourceFile('page.tsx', readFileSync('app/despega/conozcamonos-1/page.tsx', 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
function pageHandler(name, dependencies) {
  let initializer
  const visit = node => {
    if (ts.isVariableDeclaration(node) && node.name.getText(pageSource) === name) initializer = node.initializer
    ts.forEachChild(node, visit)
  }
  visit(pageSource)
  assert.ok(initializer, 'Actual page handler exists: ' + name)
  const source = compile('const selectedHandler = ' + initializer.getText(pageSource))
  const bindings = Object.entries(dependencies).filter(([key]) => key !== 'default' && /^[A-Za-z_$][\w$]*$/.test(key))
  return new Function(...bindings.map(([key]) => key), source + '\nreturn selectedHandler')(...bindings.map(([, value]) => value))
}

function pageHarness(options = {}) {
  const restored = answers.restoreC1DraftAnswers(RAW)
  const state = { currentQuestion: options.currentQuestion ?? 6, responses: clone(restored.responses),
    customResponses: clone(restored.customResponses), loading: false, error: '', authChecked: true,
    validating: false, draftUpdatedAt: REVISION, completionFailure: null, loadedOwnerId: USER }
  const events = [], navigations = [], draftWrites = [], transitionInFlight = { current: false }
  const operationEpoch = { current: 1 }, ownerIdRef = { current: USER }, loadedAttemptRef = { current: null }
  const dependencies = { ...completion, ...answers, ...state, transitionInFlight, active: true,
    operationEpoch, ownerIdRef, loadedAttemptRef, epoch: 1, sessionLoading: false, sessionUserId: USER, loadAttempt: 0,
    question: questions[state.currentQuestion], isLastQuestion: state.currentQuestion === 6,
    isAnswered: () => true, clearDraftError: () => {},
    trackEvent: (...event) => events.push(event),
    router: { replace: path => navigations.push(path), refresh: () => navigations.push('refresh') },
    saveDraft: async input => { draftWrites.push(input); return options.saveDraft ? options.saveDraft(input) : options.saveRevision ?? FINISHED },
    completeC1: (input, ownerId) => completion.completeC1(input, ownerId, options.transport ?? (async () => json({ success: true, ...DONE }))),
    loadC1CompletionStatus: () => completion.loadC1CompletionStatus(options.statusTransport ?? (async () => statusJson({ state: 'in_progress', draft: DRAFT_VALUE }))),
    fetch: async () => { throw Error('Unexpected direct request from the page handler') },
  }
  for (const key of Object.keys(state)) dependencies['set' + key[0].toUpperCase() + key.slice(1)] = value => {
    state[key] = typeof value === 'function' ? value(state[key]) : value
  }
  dependencies.isCurrentOperation = pageHandler('isCurrentOperation', dependencies)
  dependencies.submitResponses = pageHandler('submitResponses', dependencies)
  return { state, events, navigations, draftWrites, transitionInFlight, operationEpoch, ownerIdRef, loadedAttemptRef,
    next: pageHandler('handleNext', dependencies), back: pageHandler('handleBack', dependencies),
    answer: pageHandler('handleAnswer', dependencies), custom: pageHandler('handleCustomText', dependencies),
    restore: pageHandler('restoreProgress', dependencies),
    restoreForSession: sessionUserId => pageHandler('restoreProgress', {
      ...dependencies, epoch: ++operationEpoch.current, sessionUserId,
    })() }
}

test('actual last-question handler calls only completion and navigates after its verified receipt', async () => {
  const calls = []
  const h = pageHarness({ transport: async (path, init) => {
    calls.push({ path, method: init.method, input: JSON.parse(init.body) })
    return json({ success: true, ...DONE })
  } })
  await h.next()
  assert.equal(h.draftWrites.length, 0)
  assert.deepEqual(calls, [{ path: completion.C1_COMPLETION_PATH, method: 'POST', input: INPUT }])
  assert.deepEqual(h.navigations, [completion.C1_NEXT_PATH, 'refresh'])
  assert.equal(h.events.filter(([event]) => event === 'c1_completed').length, 1)
  assert.equal(h.state.loading, true, 'Keep controls locked until navigation finishes.')
})

test('actual final failure retains Q7/custom text, unlocks retry and never reports completion', async () => {
  const h = pageHarness({ transport: async () => json({ error: 'completion_unavailable' }, 503) })
  const original = clone({ responses: h.state.responses, customResponses: h.state.customResponses })
  await h.next()
  assert.equal(h.state.currentQuestion, 6)
  assert.deepEqual({ responses: h.state.responses, customResponses: h.state.customResponses }, original)
  assert.equal(h.state.error, completion.C1_COMPLETION_ERRORS.completion_unavailable.message)
  assert.equal(h.state.loading, false)
  assert.equal(h.transitionInFlight.current, false)
  assert.equal(h.state.draftUpdatedAt, REVISION)
  assert.equal(h.draftWrites.length, 0)
  assert.equal(h.navigations.length, 0)
  assert.equal(h.events.some(([event]) => event === 'c1_completed'), false)
})

test('double activation while final request is in flight cannot duplicate the request', async () => {
  let resolve, count = 0
  const h = pageHarness({ transport: async () => { count++; return new Promise(done => { resolve = done }) } })
  const pending = h.next()
  await h.next()
  assert.equal(count, 1)
  assert.equal(h.transitionInFlight.current, true)
  resolve(json({ success: true, ...DONE }))
  await pending
  assert.equal(count, 1)
})

test('ordinary forward/back navigation retains the server draft revision for later CAS', async () => {
  for (const [currentQuestion, direction, expected] of [[4, 'next', 5], [6, 'back', 5]]) {
    const h = pageHarness({ currentQuestion })
    await h[direction]()
    assert.equal(h.state.currentQuestion, expected)
    assert.equal(h.state.draftUpdatedAt, FINISHED)
    assert.equal(h.draftWrites.length, 1)
    assert.equal(h.draftWrites[0].currentQuestion, expected)
    assert.deepEqual(h.draftWrites[0].answers, RAW)
    assert.equal(h.navigations.length, 0)
  }
})

test('actual initial GET redirects verified completion without rendering/resetting a blank form', async () => {
  const h = pageHarness({ statusTransport: async () => statusJson({ ...DONE, draft: null }) })
  const original = clone(h.state.responses)
  await h.restore()
  assert.deepEqual(h.navigations, [completion.C1_NEXT_PATH, 'refresh'])
  assert.deepEqual(h.state.responses, original)
  assert.equal(h.state.authChecked, false)
  assert.equal(h.draftWrites.length, 0)
})

test('actual initial GET restores custom text and the exact draft revision', async () => {
  const h = pageHarness()
  await h.restore()
  assert.equal(h.state.authChecked, true)
  assert.equal(h.state.currentQuestion, 6)
  assert.equal(h.state.draftUpdatedAt, REVISION)
  assert.deepEqual(answers.serializeC1DraftAnswers(h.state.responses, h.state.customResponses), RAW)
  assert.equal(h.navigations.length, 0)
})

test('legacy recovery keeps a real draft editable and never invents missing answers', async () => {
  for (const draft of [null, { ...DRAFT_VALUE, completedAt: FINISHED }]) {
    const h = pageHarness({ statusTransport: async () => statusJson({ state: 'recovery_required', draft }) })
    await h.restore()
    assert.equal(h.state.authChecked, Boolean(draft))
    assert.equal(h.state.completionFailure, 'recovery_required')
    assert.equal(h.navigations.length, 0)
    if (draft) assert.deepEqual(answers.serializeC1DraftAnswers(h.state.responses, h.state.customResponses), RAW)
  }
})

test('initial status failure blocks the form; expired session returns to canonical sign-in', async () => {
  for (const status of [503, 401]) {
    const h = pageHarness({ statusTransport: async () => json({}, status) })
    await h.restore()
    assert.equal(h.state.authChecked, false)
    assert.deepEqual(h.navigations, status === 401 ? [completion.C1_SIGN_IN_PATH] : [])
    if (status === 503) assert.match(h.state.error, /No pudimos recuperar tu avance/)
  }
})

test('actual account change clears the old answers and loads only the new verified owner', async () => {
  const h = pageHarness({ statusTransport: async () => statusJson({ state: 'not_started', draft: null }, OTHER_USER) })
  await h.restoreForSession(OTHER_USER)
  assert.equal(h.state.loadedOwnerId, OTHER_USER)
  assert.equal(h.ownerIdRef.current, OTHER_USER)
  assert.equal(h.state.currentQuestion, 0)
  assert.equal(h.state.draftUpdatedAt, null)
  assert.deepEqual(h.state.responses, {})
  assert.deepEqual(h.state.customResponses, {})
  h.answer('Videos')
  h.custom('late coach response belonging to the previous owner')
  assert.deepEqual(h.state.responses, {}, 'Callbacks retained by the previous form cannot update the new owner.')
  assert.deepEqual(h.state.customResponses, {})
})

test('expired session followed by the same account preserves unsaved text without loading an older draft', async () => {
  let statusReads = 0
  const h = pageHarness({ statusTransport: async () => { statusReads++; return statusJson({ state: 'in_progress', draft: DRAFT_VALUE }) } })
  h.loadedAttemptRef.current = 0
  const original = clone({ responses: h.state.responses, customResponses: h.state.customResponses })
  await h.restoreForSession(null)
  assert.equal(h.state.completionFailure, 'authentication_required')
  assert.equal(h.state.authChecked, true)
  await h.restoreForSession(USER)
  assert.equal(h.state.completionFailure, null)
  assert.deepEqual({ responses: h.state.responses, customResponses: h.state.customResponses }, original)
  assert.equal(statusReads, 0)
})

test('late completion success or error from the previous account cannot navigate or mark the new form', async () => {
  for (const success of [true, false]) {
    let finish
    const h = pageHarness({
      transport: async () => new Promise(resolve => { finish = resolve }),
      statusTransport: async () => statusJson({ state: 'not_started', draft: null }, OTHER_USER),
    })
    const pending = h.next()
    await h.restoreForSession(OTHER_USER)
    finish(success ? json({ success: true, ...DONE }) : json({ error: 'completion_unavailable' }, 503))
    await pending
    assert.equal(h.navigations.length, 0)
    assert.equal(h.events.some(([event]) => event === 'c1_completed'), false)
    assert.equal(h.state.error, '')
    assert.equal(h.state.currentQuestion, 0)
    assert.equal(h.state.loading, false)
    assert.deepEqual(h.state.responses, {})
  }
})

test('late draft saves from the previous account cannot advance or change the new draft revision', async () => {
  for (const [currentQuestion, direction] of [[4, 'next'], [6, 'back']]) {
    let finish
    const h = pageHarness({ currentQuestion,
      saveDraft: async () => new Promise(resolve => { finish = resolve }),
      statusTransport: async () => statusJson({ state: 'not_started', draft: null }, OTHER_USER),
    })
    const pending = h[direction]()
    await h.restoreForSession(OTHER_USER)
    finish(FINISHED)
    await pending
    assert.equal(h.state.currentQuestion, 0)
    assert.equal(h.state.draftUpdatedAt, null)
    assert.equal(h.transitionInFlight.current, false)
    assert.deepEqual(h.state.responses, {})
  }
})

test('a stale initial status response cannot restore answers after the active account changes', async () => {
  let finishFirst, reads = 0
  const h = pageHarness({ statusTransport: async () => {
    reads++
    if (reads === 1) return new Promise(resolve => { finishFirst = resolve })
    return statusJson({ state: 'not_started', draft: null }, OTHER_USER)
  } })
  const pending = h.restore()
  await h.restoreForSession(OTHER_USER)
  finishFirst(statusJson({ state: 'in_progress', draft: DRAFT_VALUE }))
  await pending
  assert.equal(h.state.loadedOwnerId, OTHER_USER)
  assert.equal(h.state.draftUpdatedAt, null)
  assert.deepEqual(h.state.responses, {})
  assert.deepEqual(h.state.customResponses, {})
})

test('actual draft hook returns only a confirmed server revision and releases saving on errors', async () => {
  const source = compile(readFileSync('lib/use-assessment-draft.ts', 'utf8'))
  for (const result of [{ saved: true, updatedAt: REVISION }, { saved: true }, { updatedAt: REVISION }, null]) {
    const states = [], calls = []
    const dependencies = {
      react: { useCallback: fn => fn, useRef: initial => ({ current: initial }), useEffect: effect => effect(),
        useState: initial => { const slot = { value: initial }; states.push(slot); return [initial, value => { slot.value = value }] } },
      '@/lib/c1-completion': completion,
    }
    const module = { exports: {} }
    new Function('require', 'module', 'exports', 'fetch', source)(name => dependencies[name], module, module.exports,
      async (path, init) => { calls.push({ path, method: init.method, owner: init.headers[completion.C1_EXPECTED_ACTOR_HEADER] }); return json(result) })
    const hook = module.exports.useAssessmentDraft('c1', USER)
    if (result?.saved === true && result.updatedAt) assert.equal(await hook.saveDraft(DRAFT_VALUE), REVISION)
    else await assert.rejects(hook.saveDraft(DRAFT_VALUE), /No pudimos confirmar el guardado/)
    assert.equal(states[1].value, false)
    assert.deepEqual(calls, [{ path: '/api/assessments/drafts/c1', method: 'PUT', owner: USER }])
  }
})

test('actual draft hook discards old-owner completion and leaves the new form unlocked', async () => {
  const states = [], effects = [], source = compile(readFileSync('lib/use-assessment-draft.ts', 'utf8'))
  let finish
  const dependencies = {
    react: { useCallback: fn => fn, useRef: initial => ({ current: initial }),
      useEffect: effect => { effects.push(effect); effect() },
      useState: initial => { const slot = { value: initial }; states.push(slot); return [initial, value => { slot.value = value }] } },
    '@/lib/c1-completion': completion,
  }
  const module = { exports: {} }
  new Function('require', 'module', 'exports', 'fetch', source)(name => dependencies[name], module, module.exports,
    async () => new Promise(resolve => { finish = resolve }))
  const hook = module.exports.useAssessmentDraft('c1', USER)
  const pending = hook.saveDraft(DRAFT_VALUE)
  effects[0]() // React runs the effect again when the expected owner changes.
  assert.equal(states[1].value, false)
  finish(json({ saved: true, updatedAt: FINISHED }))
  await assert.rejects(pending, { code: 'session_changed' })
  assert.equal(states[0].value, '')
  assert.equal(states[1].value, false)
})

const originalFetch = globalThis.fetch
let networkEscapes = 0, failed = 0
globalThis.fetch = async () => { networkEscapes++; throw new Error('Live network is forbidden in this regression suite.') }
try {
  for (const { name, run } of tests) {
    try { await run(); console.log('PASS', name) }
    catch (error) { failed++; console.error('FAIL', name, error) }
  }
  assert.equal(networkEscapes, 0)
} finally { globalThis.fetch = originalFetch }
console.log(`C1 completion regression: ${tests.length - failed}/${tests.length} passed; ${networkEscapes} live-network attempts.`)
if (failed) process.exitCode = 1
