// Real route + real Supabase SDK, synthetic HTTP transport. No live RLS claim.
const assert = require('node:assert/strict')
const fs = require('node:fs')
const ts = require('typescript')
const { createClient: sdkClient } = require('@supabase/supabase-js')
const adjustment = require('../lib/a2/practice-adjustment.ts')
const USER = '00000000-0000-4000-8000-000000000001'
const OTHER = '00000000-0000-4000-8000-000000000002'
const ID = '00000000-0000-4000-8000-000000000701'
const base = {
  requestId: ID, dayNumber: 3, outcome: 'could_not', barrier: 'time',
  retainedWork: 'Conservo mi primera observación.', nextAction: 'Practicaré diez minutos.', reviewDate: '2026-11-03',
  draft: { summary: 'Observé una reunión.', evidence: 'Esperé antes de responder.', reflection: 'Repetiré la pausa.', metrics: '', artifactUrl: '', completedInstructions: [0] },
}
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
const tests = []
const test = (name, run) => tests.push({ name, run })
function harness(options = {}) {
  const rows = structuredClone(options.rows || []), writes = [], calls = [], pilotCalls = []
  let lost = false
  const transport = async (target, init = {}) => {
    const url = new URL(String(target))
    assert.equal(url.hostname, 'synthetic.invalid')
    if (url.pathname === '/rest/v1/rpc/resolve_pilot_access') {
      const args = JSON.parse(init.body)
      assert.deepEqual(args, { p_user_id: USER, p_claim_id: null })
      pilotCalls.push(args)
      if (options.pilotThrows) throw Error('PRIVATE_PILOT_DETAIL')
      if (options.pilotError) return json({ code: 'XX003', message: 'PRIVATE_PILOT_DETAIL' }, 500)
      return json(Object.hasOwn(options, 'pilotData') ? options.pilotData : [{ allowed: !options.noPilot, access_kind: 'invited', membership_id: ID }])
    }
    assert.equal(url.pathname, '/rest/v1/dtc_documents')
    calls.push({ method: init.method, params: [...url.searchParams] })
    if (init.method === 'POST') {
      if (options.writeError) return json({ code: 'XX001', message: 'PRIVATE_WRITE_DETAIL' }, 500)
      const row = JSON.parse(init.body)
      assert.equal(row.user_id, USER)
      if (rows.some(existing => existing.id === row.id)) return json({ code: '23505', message: 'PRIVATE_DUPLICATE_DETAIL' }, 409)
      rows.push({ ...row, created_at: '2026-11-02T12:00:00Z' }); writes.push(row)
      if (options.loseResponse && !lost) { lost = true; throw Error('PRIVATE_NETWORK_DETAIL') }
      return json(null, 201)
    }
    assert.equal(url.searchParams.get('user_id'), 'eq.' + USER)
    if (options.readError) return json({ code: 'XX002', message: 'PRIVATE_READ_DETAIL' }, 500)
    let selected = rows.filter(row => row.user_id === USER)
    for (const [key, value] of url.searchParams) if (value.startsWith('eq.')) selected = selected.filter(row => String(row[key]) === value.slice(3))
    if (url.searchParams.has('limit')) selected = selected.slice(0, Number(url.searchParams.get('limit')))
    const columns = url.searchParams.get('select').split(',')
    return json(selected.map(row => Object.fromEntries(columns.map(key => [key, row[key]]))))
  }
  const client = sdkClient('https://synthetic.invalid', 'synthetic-public-key', { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }, global: { fetch: transport } })
  const dependencies = {
    'next/server': { NextResponse: { json: (body, init = {}) => new Response(JSON.stringify(body), { status: init.status || 200, headers: { 'Content-Type': 'application/json', ...init.headers } }) } },
    '@/lib/supabase/server': { createClient: async () => client, createAdminClient: () => client },
    '@/lib/auth/server-user': { resolveServerUser: async () => { if (options.authThrows) throw Error('PRIVATE_AUTH_DETAIL'); return options.anonymous ? null : { id: USER } } },
    '@/lib/journey/service': { getJourneyForCurrentUser: async () => ({ user: { id: options.wrongJourneyOwner ? OTHER : USER }, access: { a2: !options.beforeA2 } }) },
    '@/lib/a2/server-progress': { getA2ProgressSnapshot: async userId => { assert.equal(userId, USER); return { highestUnlockedDay: options.highestDay || 3 } } },
    '@/lib/a2/practice-adjustment': adjustment,
    '@/lib/a2-missions-full': {},
    '@/lib/a3-checkpoint-map': {},
    '@/lib/a2/horizon': {},
    '@/lib/a2/practice-path': {},
    '@/lib/a2/server-practice-path': {},
    '@/lib/a2/day-submission': {},
    '@/lib/a2/specialized-day-validation': {},
    '@/lib/a2/day1-scoring': {},
  }
  const load = path => {
    const module = { exports: {} }
    const compiled = ts.transpileModule(fs.readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
    new Function('require', 'module', 'exports', compiled)(key => { assert.ok(Object.hasOwn(dependencies, key), key); return dependencies[key] }, module, module.exports)
    return module.exports
  }
  dependencies['@/lib/a2/api-access'] = load('lib/a2/api-access.ts')
  const route = load('app/api/a2/practice-adjustments/route.ts')
  const completeRoute = load('app/api/a2/complete-day/route.ts')
  const inspect = async response => {
    assert.match(response.headers.get('cache-control'), /private, no-store/)
    assert.equal(response.headers.get('vercel-cdn-cache-control'), 'no-store')
    const body = await response.json()
    assert.doesNotMatch(JSON.stringify(body), /PRIVATE_/)
    return { response, body }
  }
  return { rows, writes, calls, pilotCalls,
    post: async (value = base, headers = {}, raw) => inspect(await route.POST(new Request('https://synthetic.invalid/api/a2/practice-adjustments', { method: 'POST', headers: { origin: 'https://synthetic.invalid', 'content-type': 'application/json', ...headers }, body: raw ?? JSON.stringify(value) }))),
    get: async () => inspect(await route.GET(new Request('https://synthetic.invalid/api/a2/practice-adjustments?day=3'))),
    complete: () => completeRoute.POST(new Request('https://synthetic.invalid/api/a2/complete-day', { method: 'POST', headers: { origin: 'https://synthetic.invalid', 'content-type': 'application/json' }, body: JSON.stringify({ dayNumber: 1, submission: {} }) })),
  }
}
test('actual authorization precedes persistence', async () => {
  for (const [options, status] of [[{ anonymous: true }, 401], [{ beforeA2: true }, 403], [{ wrongJourneyOwner: true }, 403], [{ authThrows: true }, 500]]) {
    const h = harness(options)
    assert.equal((await h.post()).response.status, status)
    assert.equal(h.calls.length, 0)
  }
})
test('pilot is required even with prior A2 evidence; verification failures remain unavailable', async () => {
  for (const [options, status] of [[{ noPilot: true }, 403], [{ pilotError: true }, 503], [{ pilotThrows: true }, 503], [{ pilotData: [] }, 503], [{ pilotData: [{ allowed: 'true' }] }, 503], [{ pilotData: [{ allowed: true }, { allowed: true }] }, 503]]) {
    const h = harness(options)
    assert.equal((await h.post()).response.status, status)
    assert.equal((await h.get()).response.status, status)
    assert.equal(h.pilotCalls.length, 2)
    assert.equal(h.calls.length, 0)
    assert.equal(h.writes.length, 0)
  }
})
test('complete-day cannot bypass pilot or canonical A2 authorization at day one', async () => {
  for (const [options, status] of [[{ anonymous: true }, 401], [{ noPilot: true }, 403], [{ beforeA2: true }, 403], [{ wrongJourneyOwner: true }, 403], [{ pilotError: true }, 503]]) {
    const h = harness(options)
    const response = await h.complete()
    assert.equal(response.status, status)
    assert.doesNotMatch(JSON.stringify(await response.json()), /PRIVATE_/)
    assert.equal(h.calls.length, 0)
    assert.equal(h.writes.length, 0)
  }
})
test('origin, fetch site, MIME and encoding fail before any document call', async () => {
  for (const [headers, raw, status] of [
    [{ origin: '' }, undefined, 403], [{ origin: 'null' }, undefined, 403], [{ origin: 'https://other.invalid' }, undefined, 403],
    [{ 'sec-fetch-site': 'cross-site' }, undefined, 403], [{ 'sec-fetch-site': 'same-site' }, undefined, 403],
    [{ 'content-type': 'application/json-malicious' }, undefined, 415], [{ 'content-type': 'text/plain' }, undefined, 415],
    [{}, '{', 400], [{}, new Uint8Array([0xc3, 0x28]), 400], [{}, 'á'.repeat(40001), 413],
  ]) {
    const h = harness(); assert.equal((await h.post(base, headers, raw)).response.status, status); assert.equal(h.calls.length, 0)
  }
})
test('owner injection and locked days fail closed', async () => {
  const h = harness()
  assert.equal((await h.post({ ...base, user_id: OTHER })).response.status, 400)
  assert.equal((await h.post({ ...base, dayNumber: 4 })).response.status, 409)
  assert.equal(h.calls.length, 0)
})
test('NO PUDE and CAMBIAR keep drafts and return them from owner history', async () => {
  const h = harness()
  assert.equal((await h.post()).response.status, 200)
  assert.equal((await h.post({ ...base, requestId: '00000000-0000-4000-8000-000000000702', outcome: 'change', barrier: 'resources' })).response.status, 200)
  const { body } = await h.get()
  assert.equal(body.adjustments.length, 2)
  assert.deepEqual(body.adjustments[0].draft, base.draft)
  assert.deepEqual(body.adjustments[1].draft, base.draft)
  assert.equal(h.writes.length, 2)
  assert.ok(h.calls.every(call => call.method === 'GET' || call.method === 'POST'))
})
test('identical retry and lost response are idempotent', async () => {
  for (const options of [{}, { loseResponse: true }]) {
    const h = harness(options)
    assert.equal((await h.post()).response.status, options.loseResponse ? 500 : 200)
    assert.equal((await h.post()).response.status, 200)
    assert.equal(h.writes.length, 1)
  }
})
test('another owner collision reveals no content and never updates', async () => {
  const h = harness({ rows: [{ id: ID, user_id: OTHER, type: 'a2_practice_adjustment', related_day: 3, content: 'PRIVATE_FOREIGN_CONTENT' }] })
  assert.equal((await h.post()).response.status, 409)
  assert.equal((await h.get()).body.adjustments.length, 0)
  assert.equal(h.writes.length, 0)
})
test('same ID with changed content does not overwrite earlier work', async () => {
  const h = harness(); await h.post()
  assert.equal((await h.post({ ...base, retainedWork: 'Contenido nuevo.' })).response.status, 409)
  assert.equal(h.writes.length, 1)
  assert.equal(JSON.parse(h.rows[0].content).retainedWork, base.retainedWork)
})
test('persistence and history errors stay errors', async () => {
  const h = harness({ writeError: true, readError: true })
  assert.equal((await h.post()).response.status, 500)
  assert.equal((await h.get()).response.status, 500)
  assert.equal(h.writes.length, 0)
})
;(async () => { for (const { name, run } of tests) { await run() } console.log(JSON.stringify({ evidenceLevel: 'real_route_and_sdk_synthetic_http', tests: tests.length, beforeA2Denied: true, ownerHistoryRestoresDraft: true, idempotentAppendOnly: true, liveAuthOrRls: false })) })().catch(error => { console.error(error); process.exitCode = 1 })
