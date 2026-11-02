// Actual route + actual Supabase SDK, synthetic transport only. Not a live RLS certification.
const assert = require('node:assert/strict')
const fs = require('node:fs')
const ts = require('typescript')
const { createClient: sdkClient } = require('@supabase/supabase-js')
const capture = require('../lib/outcomes/response-capture.ts')
const history = require('../lib/outcomes/response-history.ts')
const cases = [], test = (name, run) => cases.push({ name, run })
const USER = '00000000-0000-4000-8000-000000000001'
const OTHER = '00000000-0000-4000-8000-000000000002'
const ID = '00000000-0000-4000-8000-000000000701'
const ID2 = '00000000-0000-4000-8000-000000000702'
const TIME = '2026-10-01T12:00:00Z'
const LATER = '2026-10-02T12:00:00Z'
const TEXT = 'Esta respuesta sintética describe un ejercicio completo sin datos de personas reales.'
const KEY = 'a1_professional_clarity'
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
function input(key = KEY, role = 'baseline', id = ID) {
  const instrument = capture.CAPTURE_INSTRUMENTS[key]
  return { observationId: id, instrumentKey: key, instrumentVersion: capture.OUTCOME_CAPTURE_VERSION,
    outcomeKey: instrument.outcomeKey, measurementRole: role,
    responsePayload: Object.fromEntries(instrument.prompts.map(({ key }) => [key, TEXT])) }
}
const stored = (value = input(), user = USER, at = TIME) => capture.captureObservation(capture.parseOutcomeCapture(value), user, at)
function harness(options = {}) {
  const rows = structuredClone(options.rows ?? []), calls = [], writes = []
  let lost = false, adminCalls = 0, networkCalls = 0
  const transport = privileged => async (target, init = {}) => {
    networkCalls++
    const url = new URL(String(target))
    assert.equal(url.hostname, 'synthetic.invalid')
    assert.equal(url.pathname, '/rest/v1/dtc_outcome_observations')
    calls.push({ privileged, method: init.method, params: [...url.searchParams] })
    if (init.method === 'POST') {
      assert.equal(privileged, true)
      if (options.writeError) return json({ code: 'XX001', message: 'PRIVATE_DATABASE_ERROR' }, 500)
      const value = JSON.parse(init.body)
      if (rows.some(row => row.id === value.id)) return json({ code: '23505', message: 'PRIVATE_CONSTRAINT' }, 409)
      rows.push(value); writes.push(value)
      if (options.loseFirstWriteResponse && !lost) { lost = true; throw Error('PRIVATE_NETWORK_DETAIL') }
      return json(options.invalidConfirmation ? { id: 'wrong', observed_at: value.observed_at } : { id: value.id, observed_at: value.observed_at }, 201)
    }
    assert.equal(privileged, false)
    if (options.readError) return json({ code: 'XX002', message: 'PRIVATE_READ_ERROR' }, 500)
    assert.equal(url.searchParams.get('user_id'), 'eq.' + USER)
    assert.notEqual(url.searchParams.get('select'), '*')
    let selected = rows.filter(row => row.user_id === USER)
    for (const [key, value] of url.searchParams) if (value.startsWith('eq.')) selected = selected.filter(row => String(row[key]) === value.slice(3))
    for (const [key, value] of url.searchParams) if (value.startsWith('in.(')) selected = selected.filter(row => value.slice(4,-1).split(',').map(v => v.replaceAll('\"','')).includes(String(row[key])))
    if (url.searchParams.has('order')) selected.sort((a, b) => b.observed_at.localeCompare(a.observed_at) || b.id.localeCompare(a.id))
    if (url.searchParams.has('limit')) selected = selected.slice(0, Number(url.searchParams.get('limit')))
    const columns = url.searchParams.get('select').split(',')
    return json(selected.map(row => Object.fromEntries(columns.map(key => [key, row[key]]))))
  }
  const client = sdkClient('https://synthetic.invalid', 'synthetic-public-key', { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }, global: { fetch: transport(false) } })
  client.auth.getUser = async () => {
    if (options.authThrows) throw Error('PRIVATE_AUTH_ERROR')
    return { data: { user: options.anonymous ? null : { id: USER } }, error: options.authError ? new Error('PRIVATE_AUTH_DETAIL') : null }
  }
  const admin = sdkClient('https://synthetic.invalid', 'synthetic-server-key', { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }, global: { fetch: transport(true) } })
  const dependencies = {
    'next/server': { NextResponse: { json: (body, init = {}) => new Response(JSON.stringify(body), { status: init.status ?? 200, headers: { 'Content-Type': 'application/json', ...init.headers } }) } },
    '@/lib/supabase/server': { createClient: async () => client, createAdminClient: () => { adminCalls++; return admin } },
    '@/lib/outcomes/response-capture': capture, '@/lib/outcomes/response-history': history,
  }
  const module = { exports: {} }
  const source = fs.readFileSync(options.statusRoute ? 'app/api/outcomes/a1-status/route.ts' : 'app/api/outcomes/observations/route.ts', 'utf8')
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
  new Function('require', 'module', 'exports', compiled)(key => { assert.ok(Object.hasOwn(dependencies, key), key); return dependencies[key] }, module, module.exports)
  const inspect = async response => {
    assert.match(response.headers.get('cache-control'), /private, no-store/)
    assert.equal(response.headers.get('vercel-cdn-cache-control'), 'no-store')
    const body = await response.json(); assert.doesNotMatch(JSON.stringify(body), /PRIVATE_/)
    return { response, body }
  }
  return { rows, calls, writes, get adminCalls() { return adminCalls }, get networkCalls() { return networkCalls },
    post: async (value = input(), headers = {}, raw) => inspect(await module.exports.POST(new Request('https://synthetic.invalid/api/outcomes/observations', {
      method: 'POST', headers: { 'content-type': 'application/json', ...headers }, body: raw ?? JSON.stringify(value),
    }))),
    get: async (query = 'instrument=' + KEY) => inspect(await module.exports.GET(new Request('https://synthetic.invalid/api/outcomes/observations?' + query))),
  }
}
for (const key of Object.keys(capture.CAPTURE_INSTRUMENTS)) for (const role of ['baseline', 'follow_up']) test(key + ': ' + role + ' persists answers but no scores', async () => {
  const h = harness(); const { response, body } = await h.post(input(key, role))
  assert.equal(response.status, 201); assert.equal(body.stored, true); assert.equal(body.comparable, false)
  assert.equal(h.writes.length, 1); assert.equal(h.writes[0].user_id, USER)
  for (const field of ['score', 'score_scale_min', 'score_scale_max', 'confidence']) assert.equal(h.writes[0][field], null)
  assert.equal(body.normalizedDelta, null); assert.ok(body.nextAction.length > 30)
})
for (const options of [{ anonymous: true }, { authError: true }, { authThrows: true }]) test('authorization precedes every read and write ' + JSON.stringify(options), async () => {
  const h = harness(options), expected = options.authThrows ? 503 : 401
  assert.equal((await h.post()).response.status, expected); assert.equal((await h.get()).response.status, expected)
  assert.equal(h.networkCalls, 0); assert.equal(h.adminCalls, 0)
})
test('request scores and forged owners fail before write', async () => {
  for (const patch of [{ score: 16 }, { confidence: 1 }, { user_id: OTHER }, { observedAt: TIME }, { dimensions: {} }]) {
    const h = harness(); assert.equal((await h.post({ ...input(), ...patch })).response.status, 400); assert.equal(h.networkCalls, 0)
  }
})
test('normal Spanish A1 responses are accepted', async () => {
  const value = input(); value.responsePayload = { target: 'Busco un cargo de análisis financiero', value: 'Organizo información financiera para apoyar decisiones', evidence: 'Preparé reportes mensuales para mi equipo', gap: 'Necesito practicar cómo presentar mis resultados' }
  assert.equal((await harness().post(value)).response.status, 201)
})
test('legacy requests require refresh without writing', async () => {
  const h = harness(); assert.equal((await h.post({ ...input(), instrumentVersion: '1' })).response.status, 409); assert.equal(h.networkCalls, 0)
})
test('origin mismatch and cross-site submissions are rejected', async () => {
  for (const headers of [{ origin: 'https://other.invalid' }, { 'sec-fetch-site': 'cross-site' }]) {
    const h = harness(); assert.equal((await h.post(input(), headers)).response.status, 403); assert.equal(h.networkCalls, 0)
  }
})
test('malformed JSON, content type and oversized bytes fail before write', async () => {
  for (const [headers, raw, status] of [[{}, '{', 400], [{ 'content-type': 'text/plain' }, '{}', 415], [{}, JSON.stringify({ content: 'á'.repeat(20000) }), 413]]) {
    const h = harness(); assert.equal((await h.post(input(), headers, raw)).response.status, status); assert.equal(h.networkCalls, 0)
  }
})
test('failed persistence or invalid confirmation never announce success', async () => {
  for (const options of [{ writeError: true }, { invalidConfirmation: true }]) {
    const { response, body } = await harness(options).post(); assert.equal(response.status, 503); assert.notEqual(body.stored, true)
  }
})
test('same-owner identical retry is idempotent', async () => {
  const h = harness(); assert.equal((await h.post()).response.status, 201)
  const second = await h.post(); assert.equal(second.response.status, 200); assert.equal(second.body.reused, true); assert.equal(h.writes.length, 1)
})
test('a lost write response is safely recognized on retry', async () => {
  const h = harness({ loseFirstWriteResponse: true }); assert.equal((await h.post()).response.status, 503)
  assert.equal((await h.post()).body.reused, true); assert.equal(h.writes.length, 1)
})
test('another owner collision reveals no other answers', async () => {
  const foreign = stored(input(), OTHER); foreign.response_payload.target = 'PRIVATE_FOREIGN_ANSWER'
  const h = harness({ rows: [foreign] }); const result = await h.post()
  assert.equal(result.response.status, 409); assert.equal(h.writes.length, 0); assert.doesNotMatch(JSON.stringify(result.body), /FOREIGN/)
})
test('same ID with changed content is not an update', async () => {
  const h = harness({ rows: [stored()] }); const value = input(); value.responsePayload.target += ' Texto cambiado.'
  assert.equal((await h.post(value)).response.status, 409); assert.equal(h.writes.length, 0); assert.deepEqual(h.rows[0], stored())
})
for (const key of Object.keys(capture.CAPTURE_INSTRUMENTS)) test(key + ': history returns only owner, version and instrument records', async () => {
  const baseline = stored(input(key)), followUp = stored(input(key, 'follow_up', ID2), USER, LATER)
  const h = harness({ rows: [baseline, followUp, { ...stored(input(key)), user_id: OTHER }, { ...stored(input(key)), instrument_version: '1' }] })
  const { response, body } = await h.get('instrument=' + key)
  assert.equal(response.status, 200); assert.equal(body.pairStatus, 'available'); assert.equal(body.comparable, false)
  assert.equal(body.baseline.observationId, ID); assert.equal(body.followUp.observationId, ID2)
  assert.equal(h.adminCalls, 0); assert.equal(h.writes.length, 0)
  assert.doesNotMatch(JSON.stringify(body), /user_id|normalized|dimensions|confidence|evidence_refs/)
  assert.ok(h.calls.every(call => call.params.some(([k, v]) => k === 'limit' && v === '1')))
})
for (const [name, rows] of [['empty', []], ['baseline_only', [stored()]], ['follow_up_only', [stored(input(KEY, 'follow_up'))]], ['out_of_order', [stored(input(), USER, LATER), stored(input(KEY, 'follow_up', ID2), USER, TIME)]]]) test('history distinguishes ' + name, async () => {
  const { body } = await harness({ rows }).get(); assert.equal(body.pairStatus, name); assert.equal(body.comparable, false)
})
test('latest baseline is selected without deleting previous records', async () => {
  const h = harness({ rows: [stored(), stored(input(KEY, 'baseline', ID2), USER, LATER)] })
  assert.equal((await h.get()).body.baseline.observationId, ID2); assert.equal(h.rows.length, 2); assert.equal(h.writes.length, 0)
})
test('unknown or injected history parameters fail closed', async () => {
  for (const query of ['', 'instrument=constructor', 'instrument=' + KEY + '&user_id=' + OTHER, 'instrument=' + KEY + '&instrument=' + KEY, 'instrument=' + KEY + '&offset=0']) {
    const h = harness(); assert.equal((await h.get(query)).response.status, 400); assert.equal(h.networkCalls, 0)
  }
})
test('history query errors remain errors rather than empty results', async () => {
  const { response, body } = await harness({ readError: true }).get(); assert.equal(response.status, 503); assert.notEqual(body.pairStatus, 'empty')
})
test('invalid and future stored responses are not treated as valid history', async () => {
  for (const patch of [{ observed_at: 'invalid' }, { observed_at: '2099-01-01T00:00:00Z' }, { response_payload: {} }, { id: 'invalid' }]) {
    assert.equal((await harness({ rows: [{ ...stored(), ...patch }] }).get()).response.status, 503)
  }
})
test('public response validation rejects a claimed improvement or mismatched pair', () => {
  const valid = history.captureHistory(KEY, history.savedCaptureFromRow(stored(), KEY, 'baseline'), null)
  assert.deepEqual(history.historyFromResponse(valid, KEY), valid)
  for (const patch of [{ comparable: true }, { evaluationStatus: 'improved' }, { pairStatus: 'available' }, { instrumentKey: 'a3_structured_interview' }]) assert.throws(() => history.historyFromResponse({ ...valid, ...patch }, KEY))
})

for (const version of ['1', '2-capture']) test('A1 status accepts captured baseline version ' + version + ' without another initial exercise', async () => {
  const h = harness({ statusRoute: true, rows: [{ ...stored(), instrument_version: version }] })
  const { response, body } = await h.get(); assert.equal(response.status, 200)
  assert.deepEqual(body, { baselineCompleted: true, followUpCompleted: false })
  assert.equal(h.adminCalls, 0); assert.equal(h.writes.length, 0)
  assert.ok(h.calls.every(call => call.params.some(([key, value]) => key === 'limit' && value === '1')))
})
test('A1 status rejects foreign, wrong-instrument and unrecognized-version records', async () => {
  for (const patch of [{ user_id: OTHER }, { instrument_version: 'unrecognized' }, { instrument_key: 'a3_structured_interview' }]) {
    const h = harness({ statusRoute: true, rows: [{ ...stored(), ...patch }] })
    assert.deepEqual((await h.get()).body, { baselineCompleted: false, followUpCompleted: false })
  }
})
test('A1 status read failure is not a completed or empty measurement', async () => {
  const h = harness({ statusRoute: true, readError: true })
  assert.equal((await h.get()).response.status, 503)
})
test('A1 status authentication failure stops all reads', async () => {
  const h = harness({ statusRoute: true, anonymous: true })
  assert.equal((await h.get()).response.status, 401); assert.equal(h.networkCalls, 0)
})

;(async () => {
  let failed = 0
  for (const { name, run } of cases) try { await run() } catch (error) { failed++; console.error(JSON.stringify({ name, error: error.message, stack: error.stack })) }
  console.log(JSON.stringify({ suite: 'outcome-capture-routes', cases: cases.length, passed: cases.length - failed, failed, sdk: 'real', transport: 'synthetic', liveDatabaseWrites: 0 }))
  if (failed) process.exitCode = 1
})()
