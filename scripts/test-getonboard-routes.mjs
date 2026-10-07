import assert from 'node:assert/strict'
import fs from 'node:fs'
import ts from 'typescript'
import { GetOnBoardProviderError, isGetOnBoardJobUrl } from '../lib/opportunities/sources/getonboard.ts'
import { upsertVerifiedOpportunities } from '../lib/opportunities/verified-index.ts'
import { filterOpportunities } from '../lib/opportunities/matching.ts'

const directPath = 'app/api/a4/opportunities/getonboard/route.ts'
const healthPath = 'app/api/health/opportunities/getonboard/route.ts'
const verifiedAt = new Date().toISOString()
const PRIVATE_SENTINEL = 'PRIVATE_PROVIDER_PAYLOAD_MUST_NOT_APPEAR'
const cases = []
const test = (name, run) => cases.push({ name, run })

function job(index = 0, overrides = {}) {
  const sourceId = 'backend-developer-empresa-real-' + index
  return {
    source: 'getonboard', sourceId, title: 'Backend Developer',
    company: 'Empresa Real', location: 'Santiago, Chile',
    remote: false, workMode: 'hybrid',
    description: 'Desarrollar servicios y colaborar con el equipo.',
    requirements: ['Experiencia en desarrollo de servicios.'], skills: ['TypeScript'],
    originalUrl: 'https://www.getonbrd.com/jobs/programming/' + sourceId,
    publishedAt: '2026-10-07T12:00:00.000Z', lastVerifiedAt: verifiedAt,
    verificationStatus: 'verified_active',
    raw: { privateData: PRIVATE_SENTINEL },
    privateUnexpectedField: PRIVATE_SENTINEL,
    ...overrides,
  }
}

function batch(jobs = [], outcome = jobs.length ? 'ok' : 'no_matches', overrides = {}) {
  return {
    source: 'getonboard', fetchedAt: verifiedAt, jobs,
    diagnostics: {
      received: jobs.length, considered: jobs.length, normalized: jobs.length,
      rejected: 0, returned: jobs.length, outcome,
      privateUnexpectedField: PRIVATE_SENTINEL,
      ...overrides,
    },
  }
}

function providerError(kind, code) {
  const error = new GetOnBoardProviderError(kind, code)
  error.message = PRIVATE_SENTINEL
  return error
}

// Execute the actual route bodies. A database operation outside the access guard,
// a second provider request or an unexpected dependency fails the fixture.
function routeHarness(path, {
  user = { id: 'test-user' },
  allowed = true,
  response = batch(),
  failure,
} = {}) {
  const calls = { auth: 0, admin: 0, access: 0, provider: [], logs: [] }
  const db = new Proxy({}, {
    get(_target, key) { throw new Error('Unexpected database operation in provider GET: ' + String(key)) },
  })
  const modules = {
    'next/server': { NextResponse: { json(body, init = {}) {
      return new Response(JSON.stringify(body), { status: init.status || 200, headers: init.headers })
    } } },
    '@/lib/auth/server-user': { resolveServerUser: async () => { calls.auth++; return user } },
    '@/lib/supabase/server': { createAdminClient: () => { calls.admin++; return db } },
    '@/lib/a4/access-control': {
      checkA4Access: async (id, client) => {
        calls.access++
        assert.equal(id, user.id)
        assert.equal(client, db)
        return { canAccess: allowed, reason: 'a3_incomplete' }
      },
      getA4AccessDenialMessage: () => 'Completa A3 para acceder.',
    },
    '@/lib/opportunities/sources/getonboard': {
      GetOnBoardProviderError,
      isGetOnBoardJobUrl,
      fetchGetOnBoardBatch: async (...args) => {
        calls.provider.push(args)
        assert.equal(calls.provider.length, 1)
        if (failure) throw failure
        return response
      },
    },
  }
  const source = fs.readFileSync(new URL('../' + path, import.meta.url), 'utf8')
  const compiled = ts.transpileModule(source, {
    fileName: path, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText
  const module = { exports: {} }
  const capturedConsole = { error: (...args) => calls.logs.push(args) }
  new Function('require', 'module', 'exports', 'console', compiled)((name) => {
    assert.ok(Object.hasOwn(modules, name), 'Unexpected route dependency: ' + name)
    return modules[name]
  }, module, module.exports, capturedConsole)
  return { GET: module.exports.GET, calls }
}

async function readResponse(route, path = directPath) {
  const request = new Request('https://dtc.test/' + path + '?category=programming')
  const response = await route.GET(request)
  const text = await response.text()
  assert.ok(!text.includes(PRIVATE_SENTINEL), 'Provider internals must not enter the response')
  assert.deepEqual(route.calls.logs, [], 'Raw provider exceptions must not be logged')
  assert.ok(response.headers.get('cache-control')?.includes('no-store'))
  return { response, body: JSON.parse(text), request }
}

test('anonymous direct requests are rejected before access checks or provider calls', async () => {
  const route = routeHarness(directPath, { user: null })
  const { response } = await readResponse(route)
  assert.equal(response.status, 401)
  assert.equal(route.calls.admin, 0)
  assert.equal(route.calls.access, 0)
  assert.equal(route.calls.provider.length, 0)
})

test('direct requests preserve the A4 access guard', async () => {
  const route = routeHarness(directPath, { allowed: false })
  const { response } = await readResponse(route)
  assert.equal(response.status, 403)
  assert.equal(route.calls.access, 1)
  assert.equal(route.calls.provider.length, 0)
})

test('direct results retain public metadata and hybrid without exposing raw provider fields', async () => {
  const route = routeHarness(directPath, { response: batch([job()]) })
  const { response, body, request } = await readResponse(route)
  assert.equal(response.status, 200)
  assert.equal(body.success, true)
  assert.equal(body.coverage, 'public_api')
  assert.equal(body.count, 1)
  assert.equal(body.opportunities[0].remote, false)
  assert.equal(body.opportunities[0].workMode, 'hybrid')
  assert.equal(body.opportunities[0].company, 'Empresa Real')
  assert.equal(body.opportunities[0].originalUrl, job().originalUrl)
  assert.equal(body.opportunities[0].raw, undefined)
  assert.equal(body.opportunities[0].privateUnexpectedField, undefined)
  assert.equal(body.diagnostics.privateUnexpectedField, undefined)
  assert.equal(route.calls.provider[0][2].signal, request.signal)
})

test('public health requires no user or database and limits its sample to three jobs', async () => {
  const jobs = Array.from({ length: 5 }, (_, index) => job(index))
  const route = routeHarness(healthPath, { response: batch(jobs) })
  const { response, body, request } = await readResponse(route, healthPath)
  assert.equal(response.status, 200)
  assert.equal(body.ok, true)
  assert.equal(body.provider, 'getonboard')
  assert.equal(body.count, 5)
  assert.equal(body.valid_original_urls, 5)
  assert.equal(body.location_resolved, 5)
  assert.equal(body.work_mode_resolved, 5)
  assert.equal(body.sample.length, 3)
  assert.equal(body.sample[0].workMode, 'hybrid')
  assert.equal(body.sample[0].description, undefined)
  assert.equal(body.diagnostics.privateUnexpectedField, undefined)
  assert.equal(route.calls.auth, 0)
  assert.equal(route.calls.admin, 0)
  assert.equal(route.calls.provider[0][2].signal, request.signal)
})

test('a genuine empty provider collection returns HTTP 200 on both routes', async () => {
  for (const path of [directPath, healthPath]) {
    const route = routeHarness(path, { response: batch() })
    const { response, body } = await readResponse(route, path)
    assert.equal(response.status, 200)
    assert.equal(path === directPath ? body.success : body.ok, true)
    assert.equal(body.count, 0)
    assert.equal(body.diagnostics.outcome, 'no_matches')
    assert.deepEqual(path === directPath ? body.opportunities : body.sample, [])
  }
})

test('a nonempty provider collection with no interpretable jobs returns HTTP 502', async () => {
  for (const path of [directPath, healthPath]) {
    const route = routeHarness(path, {
      response: batch([], 'parse_failed', {
        received: 120, considered: 30, normalized: 0, rejected: 30,
        failure_code: 'no_valid_jobs',
      }),
    })
    const { response, body } = await readResponse(route, path)
    assert.equal(response.status, 502)
    assert.equal(path === directPath ? body.success : body.ok, false)
    assert.equal(body.code, 'GETONBOARD_PAYLOAD_INVALID')
    assert.equal(body.diagnostics.received, 120)
    assert.equal(body.diagnostics.rejected, 30)
    assert.equal(body.diagnostics.failure_code, 'no_valid_jobs')
    assert.equal(body.count, 0)
  }
})

test('a malformed or missing data collection is distinguished from empty data', async () => {
  for (const path of [directPath, healthPath]) {
    const route = routeHarness(path, {
      response: batch([], 'parse_failed', { failure_code: 'payload_shape' }),
    })
    const { response, body } = await readResponse(route, path)
    assert.equal(response.status, 502)
    assert.equal(body.diagnostics.outcome, 'parse_failed')
    assert.equal(body.diagnostics.failure_code, 'payload_shape')
  }
})

test('JSON parse errors map to sanitized HTTP 502 responses', async () => {
  for (const path of [directPath, healthPath]) {
    const route = routeHarness(path, { failure: providerError('parse_failed', 'invalid_json') })
    const { response, body } = await readResponse(route, path)
    assert.equal(response.status, 502)
    assert.equal(body.code, 'GETONBOARD_PAYLOAD_INVALID')
  }
})

test('transport, timeout and unexpected exceptions map to sanitized HTTP 503 responses', async () => {
  const failures = [
    providerError('unavailable', 'http_503'),
    providerError('unavailable', 'http_429'),
    providerError('unavailable', 'network_error'),
    new DOMException(PRIVATE_SENTINEL, 'AbortError'),
    new Error(PRIVATE_SENTINEL),
  ]
  for (const path of [directPath, healthPath]) {
    for (const failure of failures) {
      const route = routeHarness(path, { failure })
      const { response, body } = await readResponse(route, path)
      assert.equal(response.status, 503)
      assert.equal(body.code, 'GETONBOARD_UNAVAILABLE')
      assert.equal(body.count, 0)
    }
  }
})

test('invalid request errors remain HTTP 400 without disclosing provider internals', async () => {
  for (const path of [directPath, healthPath]) {
    const route = routeHarness(path, { failure: providerError('invalid_request', 'invalid_category') })
    const { response, body } = await readResponse(route, path)
    assert.equal(response.status, 400)
    assert.equal(body.code, 'GETONBOARD_INVALID_REQUEST')
    assert.equal(body.count, 0)
  }
})

test('partial normalization remains usable and preserves explicit rejected counts', async () => {
  for (const path of [directPath, healthPath]) {
    const route = routeHarness(path, {
      response: batch([job()], 'partial', {
        received: 120, considered: 30, normalized: 1, rejected: 29, returned: 1,
      }),
    })
    const { response, body } = await readResponse(route, path)
    assert.equal(response.status, 200)
    assert.equal(path === directPath ? body.success : body.ok, true)
    assert.equal(body.count, 1)
    assert.equal(body.diagnostics.outcome, 'partial')
    assert.equal(body.diagnostics.rejected, 29)
  }
})

test('caller cancellation is forwarded to the sole provider call', async () => {
  for (const path of [directPath, healthPath]) {
    const controller = new AbortController()
    const request = new Request('https://dtc.test/api?category=programming', { signal: controller.signal })
    controller.abort()
    const route = routeHarness(path, { failure: new DOMException(PRIVATE_SENTINEL, 'AbortError') })
    const response = await route.GET(request)
    assert.equal(response.status, 503)
    assert.equal(route.calls.provider.length, 1)
    assert.equal(route.calls.provider[0][2].signal, request.signal)
    assert.equal(route.calls.provider[0][2].signal.aborted, true)
  }
})

test('hybrid survives indexing when remote is false; unknown stays unknown', async () => {
  const rows = []
  const db = { from(table) {
    assert.equal(table, 'a4_verified_opportunities')
    return { async upsert(values) { rows.push(...values); return { error: null } } }
  } }
  await upsertVerifiedOpportunities(db, [
    job(0),
    job(1, { remote: false, workMode: null }),
  ], { now: new Date(verifiedAt) })
  assert.equal(rows.length, 2)
  assert.equal(rows[0].work_mode, 'hybrid')
  assert.equal(rows[1].work_mode, null)
  assert.equal(filterOpportunities(rows, { workModes: ['hybrid'] }).length, 1)
  assert.equal(filterOpportunities(rows, { workModes: ['remote'] }).length, 0)
  assert.equal(filterOpportunities(rows, { workModes: ['onsite'] }).length, 0)
})

for (const { name, run } of cases) {
  try { await run() } catch (error) {
    throw new Error('Get on Board route regression failed: ' + name, { cause: error })
  }
}
console.log(JSON.stringify({
  suite: 'getonboard-routes',
  passed: cases.length,
  cases: cases.map(item => item.name),
  externalNetworkRequests: 0,
  liveDatabaseWrites: 0,
}))
