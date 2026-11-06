/**
 * Actual OpenAI adapter with synthetic HTTP streams only. This checks transport,
 * parsing, budgets and privacy; it does not evaluate a live model or deployment.
 * Run: node --import tsx scripts/test-a2-swarm-provider.mjs
 */
import assert from 'node:assert/strict'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { createRequire } from 'node:module'
import { resolve, dirname, extname, sep, join } from 'node:path'
import ts from 'typescript'

const require = createRequire(import.meta.url)
const cases = []
const test = (name, run) => cases.push({ name, run })
const PRIVATE = 'PRIVATE_SYNTHETIC_PROVIDER_SENTINEL'
const KEY = 'synthetic-provider-key'
const cache = new Map()
let syntheticHttpCalls = 0, forbiddenNetworkCalls = 0

function loadActual(relative) {
  const filename = resolve(relative)
  assert.ok(filename.startsWith(resolve('lib/a2/swarm') + sep))
  if (cache.has(filename)) return cache.get(filename).exports
  const loaded = { exports: {} }
  cache.set(filename, loaded)
  const compiled = ts.transpileModule(readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText
  const moduleRequire = key => {
    if (key === 'server-only') return {}
    if (key === '../assistant-action-contract') return require(resolve('lib/a2/assistant-action-contract.ts'))
    if (key.startsWith('./')) return loadActual(resolve(dirname(filename), key + (extname(key) ? '' : '.ts')))
    if (key === 'zod' || key === 'node:util') return require(key)
    throw new Error('Unexpected adapter dependency: ' + key)
  }
  const blockedFetch = async () => { forbiddenNetworkCalls++; throw new Error('Ambient transport is forbidden') }
  new Function('require', 'module', 'exports', 'fetch', 'process', compiled)(
    moduleRequire, loaded, loaded.exports, blockedFetch, { env: {} },
  )
  return loaded.exports
}

const { createOpenAISwarmCompletion } = loadActual('lib/a2/swarm/openai.ts')
const { SWARM_OUTPUT_SCHEMAS, SwarmCompletionError } = loadActual('lib/a2/swarm/contracts.ts')

const payloads = {
  sofia: { agent: 'sofia', understanding: 'La persona quiere retomar una práctica.', need: 'act',
    clarification: null, evidenceRefs: ['current_message'], limitations: [] },
  dani: { agent: 'dani', kind: 'proposal', action: 'Practicar diez minutos.', reason: 'La persona tiene poco tiempo.',
    canonicalNextHref: '/despega/a2/day/3', evidenceRefs: ['current_message'], requiresUserReview: true },
  reviewer: { agent: 'reviewer', decision: 'accept', response: 'Puedes retomar una práctica breve.',
    canonicalNextHref: '/despega/a2/day/3', evidenceRefs: ['current_message'], reason: 'grounded', proposalOnly: true },
}
function request(agent = 'sofia', overrides = {}) {
  return {
    agent,
    messages: [{ role: 'system', content: 'Devuelve el JSON de tu tarea.' }, { role: 'user', content: 'Tengo poco tiempo. ' + PRIVATE }],
    outputSchema: structuredClone(SWARM_OUTPUT_SCHEMAS[agent]),
    maxOutputTokens: agent === 'reviewer' ? 600 : 350,
    signal: new AbortController().signal,
    ...overrides,
  }
}
function envelope(payload = payloads.sofia, overrides = {}) {
  return { choices: [{ index: 0, finish_reason: 'stop', message: {
    role: 'assistant', refusal: null, content: JSON.stringify(payload),
  } }], ...overrides }
}
function fakeTransport(run) {
  const calls = []
  const fetch = async (url, init) => {
    syntheticHttpCalls++
    calls.push({ url, init })
    return run(url, init)
  }
  return { fetch, calls }
}
async function expectFailure(run, code) {
  await assert.rejects(run, error => {
    assert.ok(error instanceof SwarmCompletionError, 'The caller receives the closed adapter error type')
    assert.equal(error.code, code)
    assert.equal(error.message, code)
    assert.equal(error.cause, undefined)
    assert.doesNotMatch(JSON.stringify(error) + error.message, new RegExp(PRIVATE + '|' + KEY + '|Authorization'))
    return true
  })
}
function deferred() {
  let resolve, reject
  const promise = new Promise((yes, no) => { resolve = yes; reject = no })
  return { promise, resolve, reject }
}
async function within(promise, ms = 1_500) {
  let timer
  try {
    return await Promise.race([promise, new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error('Synthetic provider test exceeded its watchdog')), ms)
    })])
  } finally { clearTimeout(timer) }
}
function jsonResponse(value = envelope()) { return Response.json(value) }

test('Each agent uses its fixed strict schema, one bounded request and no persistence/tools', async () => {
  for (const agent of ['sofia', 'dani', 'reviewer']) {
    const synthetic = fakeTransport(() => jsonResponse(envelope(payloads[agent])))
    const complete = createOpenAISwarmCompletion(KEY, { fetch: synthetic.fetch })
    const input = request(agent)
    const original = JSON.stringify({ ...input, signal: undefined })
    const result = await complete(input)
    assert.deepEqual(result, payloads[agent])
    assert.equal(JSON.stringify({ ...input, signal: undefined }), original)
    assert.equal(synthetic.calls.length, 1)
    const { url, init } = synthetic.calls[0]
    assert.equal(url, 'https://api.openai.com/v1/chat/completions')
    assert.equal(init.method, 'POST')
    assert.equal(init.redirect, 'error', 'Authorization cannot follow a provider redirect')
    assert.equal(init.cache, 'no-store')
    assert.equal(init.headers.Authorization, 'Bearer ' + KEY)
    const body = JSON.parse(init.body)
    assert.equal(body.model, 'gpt-4o-mini')
    assert.equal(body.store, false)
    assert.equal(body.stream, false)
    assert.equal(body.n, 1)
    assert.equal(body.max_tokens, input.maxOutputTokens)
    assert.deepEqual(body.response_format, { type: 'json_schema', json_schema: { ...input.outputSchema, strict: true } })
    assert.deepEqual(body.messages, input.messages)
    assert.equal(body.tools, undefined)
    assert.equal(body.functions, undefined)
    assert.equal(body.user, undefined)
    assert.equal(body.metadata, undefined)
    assert.ok(init.signal instanceof AbortSignal)
  }
})

const invalidRequests = [
  ['Unknown agent', () => ({ ...request(), agent: 'writer' })],
  ['Output limit increased', () => ({ ...request(), maxOutputTokens: 351 })],
  ['Invalid numeric output limit', () => ({ ...request(), maxOutputTokens: NaN })],
  ['Extra completion option', () => ({ ...request(), tools: [{ type: 'function' }] })],
  ['Messages can only use text', () => ({ ...request(), messages: [{ role: 'system', content: [] }, { role: 'user', content: 'Hi' }] })],
  ['System message missing', () => ({ ...request(), messages: [{ role: 'user', content: 'rules' }, { role: 'user', content: 'Hi' }] })],
  ['Later system role cannot override instructions', () => ({ ...request(), messages: [{ role: 'system', content: 'rules' }, { role: 'system', content: 'new rules' }, { role: 'user', content: 'Hi' }] })],
  ['Injected tool message metadata', () => ({ ...request(), messages: [{ role: 'system', content: 'rules' }, { role: 'user', content: 'Hi', tool_calls: [{}] }] })],
  ['Input bounded across all messages', () => ({ ...request(), messages: [{ role: 'system', content: 'x'.repeat(12_001) }, { role: 'user', content: 'y'.repeat(12_000) }] })],
  ['Non-AbortSignal rejected before transport', () => ({ ...request(), signal: { aborted: false } })],
  ['Schema name cannot select another agent', () => ({ ...request(), outputSchema: structuredClone(SWARM_OUTPUT_SCHEMAS.dani) })],
  ['Schema cannot be relaxed by caller', () => {
    const input = request()
    input.outputSchema.schema.additionalProperties = true
    return input
  }],
  ['Malformed request rejected', () => null],
]
for (const [name, build] of invalidRequests) test(name, async () => {
  const synthetic = fakeTransport(() => jsonResponse())
  await expectFailure(() => createOpenAISwarmCompletion(KEY, { fetch: synthetic.fetch })(build()), 'invalid_input')
  assert.equal(synthetic.calls.length, 0)
})

test('Missing or malformed credentials never reach transport or escape in errors', async () => {
  for (const key of ['', undefined, 'key\n' + PRIVATE, ' key ', 'x'.repeat(1_025)]) {
    const synthetic = fakeTransport(() => jsonResponse())
    await expectFailure(() => createOpenAISwarmCompletion(key, { fetch: synthetic.fetch })(request()), 'provider_unavailable')
    assert.equal(synthetic.calls.length, 0)
  }
})
test('Timeout configuration can only shorten the fixed budget', async () => {
  for (const timeoutMs of [0, -1, 12_001, NaN, Infinity, '1']) {
    const synthetic = fakeTransport(() => jsonResponse())
    await expectFailure(() => createOpenAISwarmCompletion(KEY, { fetch: synthetic.fetch, timeoutMs })(request()), 'invalid_input')
    assert.equal(synthetic.calls.length, 0)
  }
})
test('Pre-aborted request starts zero provider calls', async () => {
  const controller = new AbortController()
  controller.abort(PRIVATE)
  const synthetic = fakeTransport(() => jsonResponse())
  await expectFailure(() => createOpenAISwarmCompletion(KEY, { fetch: synthetic.fetch })(request('sofia', { signal: controller.signal })), 'provider_failed')
  assert.equal(synthetic.calls.length, 0)
})

const invalidEnvelopes = [
  ['Provider refusal, even alongside valid-looking content', () => {
    const value = envelope()
    value.choices[0].message.refusal = PRIVATE
    return value
  }],
  ['Truncated completion is not accepted as finished', () => {
    const value = envelope()
    value.choices[0].finish_reason = 'length'
    return value
  }],
  ['Filtered completion is not accepted', () => {
    const value = envelope()
    value.choices[0].finish_reason = 'content_filter'
    return value
  }],
  ['Unsolicited tool call is rejected', () => {
    const value = envelope()
    value.choices[0].message.tool_calls = [{ id: 'synthetic', type: 'function', function: { name: 'save', arguments: '{}' } }]
    return value
  }],
  ['Wrong response role is rejected', () => {
    const value = envelope()
    value.choices[0].message.role = 'user'
    return value
  }],
  ['Multiple choices are rejected', () => ({ choices: [envelope().choices[0], envelope().choices[0]] })],
  ['Successful HTTP with error envelope is rejected', () => ({ ...envelope(), error: { message: PRIVATE } })],
  ['Markdown-wrapped content is rejected', () => {
    const value = envelope()
    value.choices[0].message.content = '```json\n' + JSON.stringify(payloads.sofia) + '\n```'
    return value
  }],
  ['Model JSON primitive is rejected', () => {
    const value = envelope()
    value.choices[0].message.content = 'null'
    return value
  }],
  ['Model JSON array is rejected', () => {
    const value = envelope()
    value.choices[0].message.content = '[]'
    return value
  }],
  ['Model JSON character limit is enforced independently of HTTP bytes', () => {
    const value = envelope()
    value.choices[0].message.content = JSON.stringify({ text: 'x'.repeat(8_000) })
    return value
  }],
]
for (const [name, build] of invalidEnvelopes) test(name, async () => {
  const synthetic = fakeTransport(() => jsonResponse(build()))
  await expectFailure(() => createOpenAISwarmCompletion(KEY, { fetch: synthetic.fetch })(request()), 'invalid_output')
  assert.equal(synthetic.calls.length, 1, 'Rejected provider output does not trigger a retry')
})

test('Non-JSON HTTP is rejected without reading an error page', async () => {
  let cancels = 0
  const response = new Response(new ReadableStream({ cancel() { cancels++ } }), {
    headers: { 'Content-Type': 'text/html' },
  })
  const synthetic = fakeTransport(() => response)
  await expectFailure(() => createOpenAISwarmCompletion(KEY, { fetch: synthetic.fetch })(request()), 'invalid_output')
  assert.equal(cancels, 1)
  assert.equal(synthetic.calls.length, 1)
})
test('Malformed outer JSON is rejected with no provider text', async () => {
  const synthetic = fakeTransport(() => new Response('{' + PRIVATE, { headers: { 'Content-Type': 'application/json' } }))
  await expectFailure(() => createOpenAISwarmCompletion(KEY, { fetch: synthetic.fetch })(request()), 'invalid_output')
  assert.equal(synthetic.calls.length, 1)
})
test('Invalid UTF-8 is rejected instead of silently replacing bytes', async () => {
  const synthetic = fakeTransport(() => new Response(Uint8Array.from([123, 0xff, 125]), { headers: { 'Content-Type': 'application/json' } }))
  await expectFailure(() => createOpenAISwarmCompletion(KEY, { fetch: synthetic.fetch })(request()), 'invalid_output')
})
test('Split multibyte UTF-8 survives bounded streaming reads', async () => {
  const bytes = new TextEncoder().encode(JSON.stringify(envelope({ text: 'Acción, revisión y café ☕.' })))
  let offset = 0
  const synthetic = fakeTransport(() => new Response(new ReadableStream({
    pull(controller) {
      if (offset >= bytes.byteLength) controller.close()
      else { controller.enqueue(bytes.slice(offset, offset + 1)); offset++ }
    },
  }), { headers: { 'Content-Type': 'application/json; charset=utf-8' } }))
  assert.deepEqual(await createOpenAISwarmCompletion(KEY, { fetch: synthetic.fetch })(request()), { text: 'Acción, revisión y café ☕.' })
})
test('Declared oversized HTTP response is cancelled before decoding', async () => {
  let cancels = 0
  const synthetic = fakeTransport(() => new Response(new ReadableStream({ cancel() { cancels++ } }), {
    headers: { 'Content-Type': 'application/json', 'Content-Length': '64001' },
  }))
  await expectFailure(() => createOpenAISwarmCompletion(KEY, { fetch: synthetic.fetch })(request()), 'invalid_output')
  assert.equal(cancels, 1)
})
test('Actual UTF-8 bytes are bounded even when Content-Length lies', async () => {
  let cancels = 0
  const bytes = new TextEncoder().encode('é'.repeat(32_001))
  const synthetic = fakeTransport(() => new Response(new ReadableStream({
    start(controller) { controller.enqueue(bytes) }, cancel() { cancels++ },
  }), { headers: { 'Content-Type': 'application/json', 'Content-Length': '10' } }))
  await expectFailure(() => createOpenAISwarmCompletion(KEY, { fetch: synthetic.fetch })(request()), 'invalid_output')
  assert.equal(cancels, 1)
})
test('HTTP failures cancel the body without consuming it or retrying', async () => {
  for (const status of [401, 429, 503]) {
    let cancels = 0
    const synthetic = fakeTransport(() => new Response(new ReadableStream({
      cancel() { cancels++; return new Promise(() => {}) },
    }), { status, headers: { 'Content-Type': 'application/json' } }))
    await within(expectFailure(() => createOpenAISwarmCompletion(KEY, { fetch: synthetic.fetch })(request()), 'provider_failed'))
    assert.equal(cancels, 1)
    assert.equal(synthetic.calls.length, 1)
  }
})
test('Thrown transport errors are sanitized with no automatic retries', async () => {
  const synthetic = fakeTransport(() => { throw new Error(PRIVATE + ' ' + KEY) })
  await expectFailure(() => createOpenAISwarmCompletion(KEY, { fetch: synthetic.fetch })(request()), 'provider_failed')
  assert.equal(synthetic.calls.length, 1)
})
test('Caller abort bounds a transport that never resolves or checks signal', async () => {
  const controller = new AbortController()
  const started = deferred()
  const synthetic = fakeTransport(() => { started.resolve(); return new Promise(() => {}) })
  const pending = createOpenAISwarmCompletion(KEY, { fetch: synthetic.fetch })(request('sofia', { signal: controller.signal }))
  await started.promise
  controller.abort(PRIVATE)
  await within(expectFailure(() => pending, 'provider_failed'))
  assert.equal(synthetic.calls.length, 1)
  assert.equal(synthetic.calls[0].init.signal.aborted, true)
})
test('Adapter deadline bounds uncooperative headers without caller abort', async () => {
  const synthetic = fakeTransport(() => new Promise(() => {}))
  await within(expectFailure(() => createOpenAISwarmCompletion(KEY, { fetch: synthetic.fetch, timeoutMs: 15 })(request()), 'provider_failed'))
  assert.equal(synthetic.calls.length, 1)
  assert.equal(synthetic.calls[0].init.signal.aborted, true)
})
test('Adapter deadline bounds an uncooperative body and requests cancellation', async () => {
  let cancels = 0
  const synthetic = fakeTransport(() => new Response(new ReadableStream({
    cancel() { cancels++; return new Promise(() => {}) },
  }), { headers: { 'Content-Type': 'application/json' } }))
  await within(expectFailure(() => createOpenAISwarmCompletion(KEY, { fetch: synthetic.fetch, timeoutMs: 15 })(request()), 'provider_failed'))
  assert.equal(cancels, 1)
  assert.equal(synthetic.calls.length, 1)
})
test('Caller abort bounds a body reader even when cancellation never settles', async () => {
  const controller = new AbortController()
  const reading = deferred()
  let cancels = 0
  const synthetic = fakeTransport(() => new Response(new ReadableStream({
    pull() { reading.resolve(); return new Promise(() => {}) },
    cancel() { cancels++; return new Promise(() => {}) },
  }), { headers: { 'Content-Type': 'application/json' } }))
  const pending = createOpenAISwarmCompletion(KEY, { fetch: synthetic.fetch })(request('sofia', { signal: controller.signal }))
  await reading.promise
  // The stream may pull on construction; wait a turn so the adapter owns its reader.
  await new Promise(resolve => setTimeout(resolve, 0))
  controller.abort(PRIVATE)
  await within(expectFailure(() => pending, 'provider_failed'))
  assert.equal(cancels, 1)
})
test('Late provider response after cancellation is discarded and cannot succeed', async () => {
  const controller = new AbortController()
  const started = deferred(), late = deferred()
  let cancels = 0
  const synthetic = fakeTransport(() => { started.resolve(); return late.promise })
  const pending = createOpenAISwarmCompletion(KEY, { fetch: synthetic.fetch })(request('sofia', { signal: controller.signal }))
  await started.promise
  controller.abort()
  await expectFailure(() => pending, 'provider_failed')
  late.resolve(new Response(new ReadableStream({ cancel() { cancels++ } }), { headers: { 'Content-Type': 'application/json' } }))
  await new Promise(resolve => setTimeout(resolve, 0))
  assert.equal(cancels, 1)
  assert.equal(synthetic.calls.length, 1)
})
test('Separate simultaneous completions do not share cancellation state', async () => {
  const first = new AbortController()
  const started = deferred(), secondResult = deferred()
  let calls = 0
  const synthetic = fakeTransport(() => {
    calls++
    if (calls === 1) { started.resolve(); return new Promise(() => {}) }
    return secondResult.promise
  })
  const complete = createOpenAISwarmCompletion(KEY, { fetch: synthetic.fetch })
  const firstRequest = complete(request('sofia', { signal: first.signal }))
  await started.promise
  const secondRequest = complete(request('dani'))
  first.abort()
  await expectFailure(() => firstRequest, 'provider_failed')
  secondResult.resolve(jsonResponse(envelope(payloads.dani)))
  assert.deepEqual(await secondRequest, payloads.dani)
  assert.equal(synthetic.calls.length, 2)
})

const results = []
for (const { name, run } of cases) {
  try { await within(Promise.resolve().then(run)); results.push({ name, status: 'passed' }) }
  catch (error) {
    results.push({ name, status: 'failed', error: error.message })
    console.error(name + ': ' + error.message)
    process.exitCode = 1
  }
}
assert.equal(forbiddenNetworkCalls, 0, 'Only injected synthetic HTTP may run')
const sourcePaths = ['lib/a2/swarm/contracts.ts', 'lib/a2/swarm/openai.ts', 'scripts/test-a2-swarm-provider.mjs']
const evidence = {
  suite: 'a2-swarm-provider', cases: cases.length, passed: results.filter(result => result.status === 'passed').length,
  actualProviderAdapter: true, http: 'synthetic', syntheticHttpCalls, externalNetworkCalls: forbiddenNetworkCalls,
  liveModelQuality: false, productionRollout: false,
  sourceHashes: sourcePaths.map(path => ({ path, sha256: createHash('sha256').update(readFileSync(path)).digest('hex') })),
  results,
}
if (process.env.DTC_AGENTIC_QA_OUTPUT) {
  mkdirSync(process.env.DTC_AGENTIC_QA_OUTPUT, { recursive: true })
  writeFileSync(join(process.env.DTC_AGENTIC_QA_OUTPUT, 'a2-swarm-provider.json'), JSON.stringify(evidence, null, 2) + '\n')
}
console.log(JSON.stringify({ suite: evidence.suite, cases: evidence.cases, passed: evidence.passed,
  syntheticHttpCalls, externalNetworkCalls: forbiddenNetworkCalls, liveModelQuality: false }))
