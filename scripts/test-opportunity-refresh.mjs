import assert from 'node:assert/strict'
import {
  readVerifiedOpportunities,
  upsertVerifiedOpportunities,
  invalidateOpportunityVerifications,
  OPPORTUNITY_FRESHNESS_MS,
} from '../lib/opportunities/verified-index.ts'
import {
  runOpportunityRefreshCron as runProductionOpportunityRefreshCron,
  planOpportunityRefresh,
  OPPORTUNITY_REFRESH_BUDGET_MS,
} from '../lib/opportunities/refresh-catalog.ts'
import { acquireOpportunityRefreshLease } from '../lib/opportunities/refresh-lease.ts'
import { fetchGetOnBoardJobs } from '../lib/opportunities/sources/getonboard.ts'

const NOW = new Date('2026-10-07T17:00:00.000Z')
const SECRET = 'local-test-cron-secret-with-32-characters'
const executed = []

// Legacy provider cases remain hermetic while the production route also runs ATS.
function runOpportunityRefreshCron(request, dependencies) {
  return runProductionOpportunityRefreshCron(request, {
    fetchEmployerBatch: async () => ({ jobs: [], boards: [] }),
    ...dependencies,
  })
}

const catalogCalls = (db) => db.calls.filter((call) => call.table === 'a4_verified_opportunities')
async function test(name, action) {
  await action()
  executed.push(name)
}

function chileJob(overrides = {}) {
  return {
    source: 'chiletrabajos',
    sourceId: '3666989',
    originalUrl: 'https://www.chiletrabajos.cl/trabajo/auxiliar-de-aseo-santiago-3666989',
    title: 'Auxiliar de Aseo - Santiago',
    company: 'MF Motores',
    location: 'Santiago',
    workMode: 'onsite',
    publishedAt: '2026-10-01',
    expiresAt: '2026-12-21',
    description: 'Mantener el orden y la limpieza de las instalaciones.',
    verificationStatus: 'verified_active',
    ...overrides,
  }
}

function boardJob(overrides = {}) {
  const sourceId = overrides.sourceId ?? 'software-developer-empresa-real'
  return {
    source: 'getonboard',
    sourceId,
    title: 'Software Developer',
    company: 'Empresa de tecnología',
    location: null,
    remote: true,
    description: '<p>Desarrollar aplicaciones web.</p>',
    requirements: ['Experiencia en desarrollo'],
    skills: ['TypeScript'],
    originalUrl: 'https://www.getonbrd.com/jobs/programming/' + sourceId,
    publishedAt: '2026-10-01',
    lastVerifiedAt: NOW.toISOString(),
    verificationStatus: 'verified_active',
    raw: { data: { id: sourceId } },
    ...overrides,
  }
}

function indexedRow(overrides = {}) {
  return {
    source: 'chiletrabajos',
    source_id: '3666989',
    original_url: 'https://www.chiletrabajos.cl/trabajo/3666989',
    title: 'Ingeniero de proyectos',
    normalized_title: 'Ingeniero de proyectos',
    category_key: 'leadership',
    category_label: 'Gerencia y Dirección',
    company: 'Empresa',
    location: null,
    region: 'Metropolitana',
    work_mode: null,
    published_at: '2026-10-01',
    expires_at: '2026-12-21 (en 75 días)',
    description: 'PUBLICIDAD',
    requirements: [],
    skills: [],
    verification_status: 'verified_active',
    last_verified_at: '2026-10-07T16:00:00.000Z',
    ...overrides,
  }
}

/** Minimal PostgREST behavior: real mutations are applied only when awaited. */
function memoryDb(initialRows = [], config = {}) {
  const tables = {
    a4_verified_opportunities: structuredClone(initialRows),
    cron_job_executions: structuredClone(config.executions ?? []),
  }
  const calls = []
  class Query {
    constructor(table, operation = 'select', payload = null) {
      this.table = table
      this.operation = operation
      this.payload = payload
      this.filters = []
      this.resultLimit = Infinity
      this.single = false
    }
    select() { return this }
    eq(field, value) { this.filters.push((row) => row[field] === value); return this }
    gte(field, value) { this.filters.push((row) => row[field] >= value); return this }
    lte(field, value) { this.filters.push((row) => row[field] <= value); return this }
    in(field, values) { this.filters.push((row) => values.includes(row[field])); return this }
    not(field, operator, value) {
      assert.equal(operator, 'is')
      assert.equal(value, null)
      this.filters.push((row) => field.split('->').reduce((item, key) => item?.[key], row) != null)
      return this
    }
    order() { return this }
    limit(value) { this.resultLimit = value; return this }
    maybeSingle() { this.single = true; return this }
    update(payload) { this.operation = 'update'; this.payload = payload; return this }
    upsert(payload) { this.operation = 'upsert'; this.payload = payload; return this }
    abortSignal(signal) { this.signal = signal; return this }
    async execute() {
      calls.push({ table: this.table, operation: this.operation, payload: this.payload, signal: this.signal })
      if (this.signal?.aborted) return { error: new Error('Aborted'), data: null, count: 0 }
      if (this.operation === 'rpc') return { data: config.rpcData, error: config.rpcError ?? null }
      if (this.operation === 'upsert' && config.failUpsert) return { error: new Error('Upsert failed') }
      if (this.operation === 'update' && config.failUpdate) return { error: new Error('Update failed') }
      const rows = tables[this.table] ?? []
      const selected = rows.filter((row) => this.filters.every((filter) => filter(row))).slice(0, this.resultLimit)
      if (this.operation === 'update') {
        for (const row of selected) Object.assign(row, structuredClone(this.payload))
        return { error: null, count: selected.length }
      }
      if (this.operation === 'upsert') {
        for (const value of this.payload) {
          const old = rows.find((row) => row.source === value.source && row.source_id === value.source_id)
          if (old) Object.assign(old, structuredClone(value))
          else rows.push(structuredClone(value))
        }
        return { error: null, count: this.payload.length }
      }
      return { error: null, data: this.single ? selected[0] ?? null : structuredClone(selected) }
    }
    then(resolve, reject) { return this.execute().then(resolve, reject) }
  }
  return {
    tables,
    calls,
    from: (table) => new Query(table),
    rpc: (name) => new Query(name, 'rpc'),
  }
}

function request({ method = 'GET', authorization = 'Bearer ' + SECRET } = {}) {
  return new Request('https://www.despegatucarrera.com/api/cron/a4-opportunities', {
    method,
    headers: authorization ? { authorization } : {},
  })
}

function leaseFixture(slot = 0, owns = true) {
  const completed = []
  return {
    completed,
    lease: {
      status: 'acquired',
      slot,
      owns: async () => owns,
      complete: async (success, summary) => { completed.push({ success, summary }) },
    },
  }
}

function batchFixture(overrides = {}) {
  return {
    source: 'chiletrabajos',
    fetchedAt: NOW.toISOString(),
    listingUrl: 'https://www.chiletrabajos.cl/encuentra-un-empleo',
    jobs: [chileJob()],
    verifiedJobs: [chileJob()],
    failedJobs: [],
    diagnostics: {
      discovered: 30, probed: 1, active: 1, stale: 0, parse_failed: 0,
      unavailable: 0, irrelevant: 0, returned: 1, budget_exhausted: false,
      discovery_status: 'ok', outcome: 'ok',
    },
    ...overrides,
  }
}

await test('Fresh cutoff, future verification and expiry are enforced without writes', async () => {
  const rows = [
    indexedRow(),
    indexedRow({ source_id: '3666990', original_url: 'https://www.chiletrabajos.cl/trabajo/3666990',
      last_verified_at: new Date(NOW.getTime() - OPPORTUNITY_FRESHNESS_MS).toISOString(), expires_at: '2026-10-07' }),
    indexedRow({ source_id: '3666991', original_url: 'https://www.chiletrabajos.cl/trabajo/3666991',
      last_verified_at: new Date(NOW.getTime() - OPPORTUNITY_FRESHNESS_MS - 1).toISOString() }),
    indexedRow({ source_id: '3666992', original_url: 'https://www.chiletrabajos.cl/trabajo/3666992', expires_at: '2026-10-06' }),
    indexedRow({ source_id: '3666993', original_url: 'https://www.chiletrabajos.cl/trabajo/3666993', expires_at: 'unrecognized date' }),
    indexedRow({ source_id: '3666994', original_url: 'https://www.chiletrabajos.cl/trabajo/3666994',
      last_verified_at: '2026-10-07T17:00:00.001Z' }),
    indexedRow({ source_id: '3666995', original_url: 'https://www.chiletrabajos.cl/trabajo/3666995', verification_status: 'unknown' }),
  ]
  const db = memoryDb(rows)
  const result = await readVerifiedOpportunities(db, 500, { now: NOW })
  assert.deepEqual(result.map((row) => row.source_id), ['3666989', '3666990'])
  assert.equal(result[0].category_key, 'engineering')
  assert.equal(result[0].region, null)
  assert.equal(result[0].description, null)
  assert.equal(result[0].expires_at, '2026-12-21')
  assert.ok(db.calls.every((call) => call.operation === 'select'))
  assert.deepEqual(db.tables.a4_verified_opportunities, rows)
})

await test('Wrong job identity and external Chiletrabajos links are excluded', async () => {
  const db = memoryDb([
    indexedRow({ original_url: 'https://www.chiletrabajos.cl/trabajo/1234567' }),
    indexedRow({ original_url: 'https://example.org/trabajo/3666989' }),
    indexedRow({ original_url: 'https://www.chiletrabajos.cl/' }),
  ])
  assert.deepEqual(await readVerifiedOpportunities(db, 100, { now: NOW }), [])
})

await test('Work modes are explicit and Get on Board metadata is preserved', async () => {
  const db = memoryDb()
  const jobs = [
    chileJob({ sourceId: '3666989', workMode: 'remote' }),
    chileJob({ sourceId: '3666990', originalUrl: 'https://www.chiletrabajos.cl/trabajo/3666990', workMode: 'hybrid' }),
    chileJob({ sourceId: '3666991', originalUrl: 'https://www.chiletrabajos.cl/trabajo/3666991', workMode: 'onsite' }),
    chileJob({ sourceId: '3666992', originalUrl: 'https://www.chiletrabajos.cl/trabajo/3666992',
      title: 'Ingeniero comercial Santiago', location: null, workMode: null, description: 'PUBLICIDAD' }),
    boardJob(),
    boardJob({ sourceId: 'technology-124', remote: false }),
  ]
  const result = await upsertVerifiedOpportunities(db, jobs, { now: NOW })
  assert.equal(result.upserted, 6)
  const stored = db.tables.a4_verified_opportunities
  assert.deepEqual(stored.map((row) => row.work_mode), ['remote', 'hybrid', 'onsite', null, 'remote', null])
  assert.equal(stored[3].region, null)
  assert.equal(stored[3].description, null)
  assert.equal(stored[4].description, 'Desarrollar aplicaciones web.')
  assert.deepEqual(stored[4].skills, ['TypeScript'])
  assert.deepEqual(stored[4].source_payload, boardJob().raw)
  assert.equal(stored[0].original_url, chileJob().originalUrl)
})

await test('Failed verification changes status without renewing last_verified_at', async () => {
  for (const verificationStatus of ['stale', 'unknown', 'unavailable']) {
    const db = memoryDb([indexedRow()])
    const result = await upsertVerifiedOpportunities(db, [chileJob({ verificationStatus })], { now: NOW })
    assert.equal(result.upserted, 0)
    assert.equal(result.invalidated, 1)
    const row = db.tables.a4_verified_opportunities[0]
    assert.equal(row.verification_status, verificationStatus)
    assert.equal(row.last_verified_at, '2026-10-07T16:00:00.000Z')
    assert.equal(row.title, 'Ingeniero de proyectos')
    assert.ok(db.calls.every((call) => call.operation !== 'upsert'))
  }
})

await test('Expired active input is invalidated and a negative duplicate wins', async () => {
  const db = memoryDb([indexedRow()])
  const result = await upsertVerifiedOpportunities(db, [
    chileJob(),
    chileJob({ expiresAt: '2020-01-01' }),
  ], { now: NOW })
  assert.equal(result.upserted, 0)
  assert.equal(db.tables.a4_verified_opportunities[0].verification_status, 'stale')
  assert.equal(db.tables.a4_verified_opportunities[0].last_verified_at, '2026-10-07T16:00:00.000Z')
  assert.equal((await readVerifiedOpportunities(db, 100, { now: NOW })).length, 0)
})

await test('Persistence failures propagate instead of reporting imported jobs', async () => {
  const db = memoryDb([], { failUpsert: true })
  await assert.rejects(upsertVerifiedOpportunities(db, [chileJob()], { now: NOW }), /Upsert failed/)
  assert.equal(db.tables.a4_verified_opportunities.length, 0)
  const invalidationDb = memoryDb([indexedRow()], { failUpdate: true })
  await assert.rejects(invalidateOpportunityVerifications(invalidationDb, 'chiletrabajos', [
    { sourceId: '3666989', verificationStatus: 'unknown' },
  ], { now: NOW }), /Update failed/)
})

await test('Cron environment and authorization gates perform no I/O', async () => {
  for (const VERCEL_ENV of ['preview', 'development', undefined]) {
    const response = await runOpportunityRefreshCron(request(), {
      env: { VERCEL_ENV, CRON_SECRET: SECRET },
      createDb() { assert.fail('Non-production must not create a DB client') },
    })
    assert.equal(response.status, 200)
    assert.equal((await response.json()).reason, 'NON_PRODUCTION')
  }
  for (const [req, secret, expectedStatus] of [
    [request(), '', 503],
    [request(), 'short', 503],
    [request({ authorization: 'Bearer wrong' }), SECRET, 401],
    [request({ authorization: '' }), SECRET, 401],
    [request({ method: 'POST' }), SECRET, 405],
  ]) {
    const response = await runOpportunityRefreshCron(req, {
      env: { VERCEL_ENV: 'production', CRON_SECRET: secret },
      createDb() { assert.fail('Rejected request must not create a DB client') },
    })
    assert.equal(response.status, expectedStatus)
    assert.match(response.headers.get('cache-control'), /no-store/)
  }
})

await test('Scheduled Chiletrabajos refresh has one bounded fetch and invalidates failures', async () => {
  const db = memoryDb([
    indexedRow({ source_id: '3666990', original_url: 'https://www.chiletrabajos.cl/trabajo/3666990' }),
    indexedRow({ source_id: '3666991', original_url: 'https://www.chiletrabajos.cl/trabajo/3666991' }),
  ])
  const fixture = leaseFixture(0)
  let calls = 0
  const response = await runOpportunityRefreshCron(request(), {
    env: { VERCEL_ENV: 'production', CRON_SECRET: SECRET },
    createDb: () => db, now: () => NOW,
    acquireLease: async () => fixture.lease,
    fetchChileBatch: async (search, location, limit, options) => {
      calls += 1
      assert.equal(search, '')
      assert.equal(location, 'Santiago')
      assert.equal(limit, 12)
      assert.equal(options.maxCandidates, 12)
      assert.equal(options.budgetMs, 35000)
      assert.equal(options.timeoutMs, 5000)
      assert.ok(options.signal instanceof AbortSignal)
      return batchFixture({
        verifiedJobs: [
          chileJob(),
          chileJob({ sourceId: '3666990', originalUrl: 'https://www.chiletrabajos.cl/trabajo/3666990', verificationStatus: 'stale' }),
        ],
        failedJobs: [{ sourceId: '3666991', verificationStatus: 'unavailable' }],
      })
    },
    fetchGetOnBoard: async () => assert.fail('Only one source is fetched per slot'),
  })
  assert.equal(response.status, 200)
  const body = await response.json()
  assert.equal(calls, 1)
  assert.equal(body.upserted, 1)
  assert.equal(body.invalidated, 2)
  assert.equal(fixture.completed[0].success, true)
  for (const id of ['3666990', '3666991']) {
    const row = db.tables.a4_verified_opportunities.find((item) => item.source_id === id)
    assert.notEqual(row.verification_status, 'verified_active')
    assert.equal(row.last_verified_at, '2026-10-07T16:00:00.000Z')
  }
})

await test('Duplicate and overlapping runs do not fetch or write the catalog', async () => {
  for (const status of ['overlap', 'already_attempted']) {
    const db = memoryDb()
    const response = await runOpportunityRefreshCron(request(), {
      env: { VERCEL_ENV: 'production', CRON_SECRET: SECRET },
      createDb: () => db, now: () => NOW,
      acquireLease: async () => ({ status }),
      fetchChileBatch: async () => assert.fail('Duplicate must not fetch'),
      fetchGetOnBoard: async () => assert.fail('Duplicate must not fetch'),
    })
    assert.equal(response.status, 200)
    assert.equal((await response.json()).skipped, true)
    assert.equal(db.calls.length, 0)
  }
})

await test('Lost lease prevents catalog writes and records failure', async () => {
  const db = memoryDb()
  const fixture = leaseFixture(0, false)
  const response = await runOpportunityRefreshCron(request(), {
    env: { VERCEL_ENV: 'production', CRON_SECRET: SECRET },
    createDb: () => db, now: () => NOW,
    acquireLease: async () => fixture.lease,
    fetchChileBatch: async () => batchFixture(),
  })
  assert.equal(response.status, 503)
  assert.equal((await response.json()).error, 'LEASE_LOST')
  assert.equal(catalogCalls(db).length, 0)
  assert.equal(fixture.completed[0].success, false)
})

await test('Provider outage preserves older verification and records a failed run', async () => {
  const db = memoryDb([indexedRow()])
  const fixture = leaseFixture(0)
  const response = await runOpportunityRefreshCron(request(), {
    env: { VERCEL_ENV: 'production', CRON_SECRET: SECRET },
    createDb: () => db, now: () => NOW,
    acquireLease: async () => fixture.lease,
    fetchChileBatch: async () => batchFixture({
      jobs: [], verifiedJobs: [], failedJobs: [],
      diagnostics: { ...batchFixture().diagnostics, discovery_status: 'unavailable', outcome: 'unavailable', active: 0, returned: 0 },
    }),
  })
  assert.equal(response.status, 503)
  assert.equal((await response.json()).upserted, 0)
  assert.equal(catalogCalls(db).length, 0)
  assert.equal(db.tables.a4_verified_opportunities[0].last_verified_at, '2026-10-07T16:00:00.000Z')
  assert.equal(fixture.completed[0].success, false)
})

await test('Upsert failure causes a failed ledger completion', async () => {
  const db = memoryDb([], { failUpsert: true })
  const fixture = leaseFixture(0)
  const response = await runOpportunityRefreshCron(request(), {
    env: { VERCEL_ENV: 'production', CRON_SECRET: SECRET },
    createDb: () => db, now: () => NOW,
    acquireLease: async () => fixture.lease,
    fetchChileBatch: async () => batchFixture(),
  })
  assert.equal(response.status, 503)
  assert.equal((await response.json()).error, 'PERSISTENCE_FAILED')
  assert.equal(fixture.completed[0].success, false)
})

await test('Global work budget aborts before persistence (accelerated timer)', async () => {
  const realSetTimeout = globalThis.setTimeout
  const db = memoryDb()
  const fixture = leaseFixture(0)
  assert.equal(OPPORTUNITY_REFRESH_BUDGET_MS, 50000)
  globalThis.setTimeout = (callback, delay, ...args) =>
    realSetTimeout(callback, delay === OPPORTUNITY_REFRESH_BUDGET_MS ? 1 : delay, ...args)
  try {
    const response = await runOpportunityRefreshCron(request(), {
      env: { VERCEL_ENV: 'production', CRON_SECRET: SECRET },
      createDb: () => db, now: () => NOW,
      acquireLease: async () => fixture.lease,
      fetchChileBatch: async () => {
        await new Promise((resolve) => realSetTimeout(resolve, 10))
        return batchFixture()
      },
    })
    assert.equal(response.status, 503)
    assert.equal((await response.json()).error, 'REFRESH_BUDGET_EXHAUSTED')
    assert.equal(catalogCalls(db).length, 0)
    assert.equal(fixture.completed[0].success, false)
  } finally {
    globalThis.setTimeout = realSetTimeout
  }
})

await test('Get on Board remains scheduled, limited and explicitly remote', async () => {
  assert.equal(planOpportunityRefresh(0).location, 'Santiago')
  assert.equal(planOpportunityRefresh(4).location, 'Puerto Montt')
  assert.equal(planOpportunityRefresh(5).source, 'getonboard')
  assert.deepEqual(planOpportunityRefresh(6), planOpportunityRefresh(0))
  const db = memoryDb()
  const fixture = leaseFixture(5)
  let calls = 0
  const response = await runOpportunityRefreshCron(request(), {
    env: { VERCEL_ENV: 'production', CRON_SECRET: SECRET },
    createDb: () => db, now: () => NOW,
    acquireLease: async () => fixture.lease,
    fetchChileBatch: async () => assert.fail('Only one source is fetched per slot'),
    fetchGetOnBoard: async (category, page, options) => {
      calls += 1
      assert.equal(category, 'programming')
      assert.equal(page, 1)
      assert.equal(options.timeoutMs, 8000)
      return Array.from({ length: 31 }, (_, index) => boardJob({ sourceId: 'job-' + index, remote: index === 0 }))
    },
  })
  assert.equal(response.status, 200)
  assert.equal(calls, 1)
  assert.equal((await response.json()).upserted, 30)
  assert.equal(db.tables.a4_verified_opportunities[0].work_mode, 'remote')
  assert.equal(db.tables.a4_verified_opportunities[1].work_mode, null)
})

await test('Get on Board timeout cancels its sole request', async () => {
  const realFetch = globalThis.fetch
  let calls = 0
  globalThis.fetch = async (_url, options) => {
    calls += 1
    return new Promise((_resolve, reject) => {
      if (options.signal.aborted) reject(new DOMException('Aborted', 'AbortError'))
      else options.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), { once: true })
    })
  }
  try {
    await assert.rejects(fetchGetOnBoardJobs('programming', 1, { timeoutMs: 2 }), { name: 'AbortError' })
    assert.equal(calls, 1)
  } finally {
    globalThis.fetch = realFetch
  }
})

await test('Lease client validates ownership and finalizes only its own running row', async () => {
  let clock = NOW
  const token = '12345678-1234-4234-8234-123456789abc'
  const db = memoryDb([], {
    rpcData: {
      status: 'acquired', execution_id: token, slot: 0,
      started_at: NOW.toISOString(),
      lease_expires_at: new Date(NOW.getTime() + 120000).toISOString(),
    },
    executions: [
      { id: token, job_name: 'a4-opportunities', status: 'running' },
      { id: 'another-run', job_name: 'another-job', status: 'running' },
    ],
  })
  const lease = await acquireOpportunityRefreshLease(db, undefined, () => clock)
  assert.equal(lease.status, 'acquired')
  assert.equal(await lease.owns(), true)
  await lease.complete(false, { error: 'PERSISTENCE_FAILED' })
  assert.equal(db.tables.cron_job_executions[0].status, 'failure')
  assert.equal(db.tables.cron_job_executions[1].status, 'running')
  assert.equal(db.tables.cron_job_executions[0].execution_summary.slot, 0)
  clock = new Date(NOW.getTime() + 120001)
  const before = db.calls.length
  assert.equal(await lease.owns(), false)
  assert.equal(db.calls.length, before)
})

console.log(JSON.stringify({
  suite: 'opportunity-refresh',
  passed: executed.length,
  cases: executed,
  externalNetworkRequests: 0,
  liveDatabaseWrites: 0,
}))
