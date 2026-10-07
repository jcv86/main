import assert from 'node:assert/strict'
import { EMPLOYER_BOARDS } from '../lib/opportunities/sources/employers.ts'
import {
  activeEmployerCooldowns,
  carryEmployerCooldowns,
  readEmployerCooldowns,
  EMPLOYER_REFRESH_BUDGET_MS,
} from '../lib/opportunities/employer-refresh.ts'
import {
  runOpportunityRefreshCron,
  planOpportunityRefresh,
  OPPORTUNITY_REFRESH_BUDGET_MS,
} from '../lib/opportunities/refresh-catalog.ts'

const NOW = new Date('2026-10-07T20:00:00.000Z')
const SECRET = 'only-a-local-fixture-secret-for-tests'
const BOARD = EMPLOYER_BOARDS.find((board) => board.source === 'lever')
const OTHER_BOARD = EMPLOYER_BOARDS.find((board) => board.source === 'greenhouse')
assert.ok(BOARD)
assert.ok(OTHER_BOARD)
const key = (board) => board.source + ':' + board.board
const hostCooldowns = (board, until) => Object.fromEntries(EMPLOYER_BOARDS
  .filter((item) => item.source === board.source).map((item) => [key(item), until]))
const later = (hours, now = NOW) => new Date(now.getTime() + hours * 3600000).toISOString()
const passed = []

async function test(name, action) {
  await action()
  passed.push(name)
}

function job(board = BOARD, suffix = 1, overrides = {}) {
  const id = board.source === 'lever'
    ? '22222222-2222-4222-8222-' + String(suffix).padStart(12, '0')
    : String(7000000 + suffix)
  return {
    source: board.source,
    sourceId: board.board + ':' + id,
    title: 'Analista de riesgo',
    company: board.company,
    location: 'Santiago, Chile',
    remote: false,
    workMode: 'onsite',
    description: 'Analizar el riesgo de crédito.',
    requirements: ['Experiencia en análisis de riesgo'],
    skills: [],
    originalUrl: board.source === 'lever'
      ? 'https://jobs.lever.co/' + board.board + '/' + id
      : 'https://job-boards.greenhouse.io/' + board.board + '/jobs/' + id,
    publishedAt: null,
    lastVerifiedAt: NOW.toISOString(),
    verificationStatus: 'verified_active',
    raw: { public: true },
    ...overrides,
  }
}

function indexed(value = job()) {
  return {
    source: value.source,
    source_id: value.sourceId,
    original_url: value.originalUrl,
    title: value.title,
    company: value.company,
    location: value.location,
    verification_status: 'verified_active',
    last_verified_at: later(-1),
  }
}

function boardResult(board = BOARD, jobs = [job(board)], overrides = {}) {
  return {
    source: board.source,
    board: board.board,
    boardKey: key(board),
    outcome: jobs.length ? 'ok' : 'no_matches',
    received: jobs.length,
    accepted: jobs.length,
    rejected: 0,
    excluded: 0,
    returned: jobs.length,
    completeSnapshot: true,
    observedSourceIds: jobs.map((item) => item.sourceId),
    ...overrides,
  }
}

function employerBatch(board = BOARD, jobs = [job(board)], overrides = {}) {
  return { jobs, boards: [boardResult(board, jobs, overrides)] }
}

function chileBatch() {
  const value = {
    source: 'chiletrabajos', sourceId: '3666989',
    originalUrl: 'https://www.chiletrabajos.cl/trabajo/3666989',
    title: 'Analista de operaciones', company: 'Empresa de prueba', location: 'Santiago',
    workMode: 'onsite', publishedAt: '2026-10-01', expiresAt: '2026-12-21',
    description: 'Analizar operaciones.', verificationStatus: 'verified_active',
  }
  return {
    source: 'chiletrabajos', fetchedAt: NOW.toISOString(), listingUrl: '',
    jobs: [value], verifiedJobs: [value], failedJobs: [],
    diagnostics: {
      discovered: 1, probed: 1, active: 1, stale: 0, parse_failed: 0, unavailable: 0,
      irrelevant: 0, returned: 1, budget_exhausted: false, candidate_limit_reached: false,
      discovery_status: 'ok', outcome: 'ok',
    },
  }
}

function execution(cooldowns, overrides = {}) {
  return {
    job_name: 'a4-opportunities', status: 'success',
    started_at: later(-3), completed_at: later(-3),
    execution_summary: { employer_cooldowns: cooldowns },
    ...overrides,
  }
}

/** Model the PostgREST operators used here, including SQL-like scoped updates. */
function memoryDb(rows = [], executions = [], config = {}) {
  const tables = {
    a4_verified_opportunities: structuredClone(rows),
    cron_job_executions: structuredClone(executions),
  }
  const calls = []
  const fieldValue = (row, field) => field.split('->').reduce((value, part) => value?.[part], row)
  class Query {
    constructor(table) { this.table = table; this.operation = 'select'; this.filters = []; this.max = Infinity }
    select() { return this }
    eq(field, value) { this.filters.push((row) => fieldValue(row, field) === value); return this }
    in(field, values) { this.filters.push((row) => values.includes(fieldValue(row, field))); return this }
    not(field, operator, value) {
      assert.equal(operator, 'is'); assert.equal(value, null)
      this.filters.push((row) => fieldValue(row, field) != null)
      return this
    }
    like(field, value) {
      assert.match(value, /^[a-z0-9-]+:%$/)
      this.filters.push((row) => String(fieldValue(row, field)).startsWith(value.slice(0, -1)))
      return this
    }
    order(field, options) { this.sort = { field, ...options }; return this }
    limit(value) { this.max = value; return this }
    maybeSingle() { this.single = true; return this }
    abortSignal(signal) { this.signal = signal; return this }
    update(value) { this.operation = 'update'; this.payload = value; return this }
    upsert(value) { this.operation = 'upsert'; this.payload = value; return this }
    async execute() {
      calls.push({ table: this.table, operation: this.operation, payload: this.payload, signal: this.signal })
      if (this.signal?.aborted) return { data: null, error: new Error('Aborted'), count: 0 }
      if (config.failStateRead && this.table === 'cron_job_executions') {
        return { data: null, error: new Error('Private internal DB failure') }
      }
      const rows = tables[this.table]
      const selected = rows.filter((row) => this.filters.every((filter) => filter(row)))
      if (this.sort) selected.sort((a, b) => String(a[this.sort.field]).localeCompare(String(b[this.sort.field])) * (this.sort.ascending ? 1 : -1))
      const limited = selected.slice(0, this.max)
      if (this.operation === 'upsert') {
        if (this.payload.some((row) => row.source === config.failSource)) return { error: new Error('Source write failed') }
        for (const value of this.payload) {
          const sameUrl = rows.find((row) => row.original_url === value.original_url)
          if (sameUrl && (sameUrl.source !== value.source || sameUrl.source_id !== value.source_id)) {
            return { error: new Error('Unique original URL violated') }
          }
        }
        for (const value of this.payload) {
          const old = rows.find((row) => row.source === value.source && row.source_id === value.source_id)
          if (old) Object.assign(old, structuredClone(value))
          else rows.push(structuredClone(value))
        }
        return { error: null }
      }
      if (this.operation === 'update') {
        for (const row of limited) Object.assign(row, structuredClone(this.payload))
        return { error: null, count: limited.length }
      }
      return { data: this.single ? structuredClone(limited[0] ?? null) : structuredClone(limited), error: null }
    }
    then(resolve, reject) { return this.execute().then(resolve, reject) }
  }
  return { tables, calls, config, from: (table) => new Query(table) }
}

async function run(db, overrides = {}) {
  const completions = []
  const now = overrides.now ?? (() => NOW)
  const lease = {
    status: 'acquired', slot: 0, owns: async () => true,
    complete: async (success, summary) => {
      completions.push({ success, summary })
      db.tables.cron_job_executions.push(execution(summary.employer_cooldowns, {
        status: success ? 'success' : 'failure', started_at: now().toISOString(),
        completed_at: now().toISOString(), execution_summary: structuredClone(summary),
      }))
    },
  }
  const response = await runOpportunityRefreshCron(new Request('https://dtc.test/api/cron/a4-opportunities', {
    headers: { authorization: 'Bearer ' + SECRET },
  }), {
    env: { VERCEL_ENV: 'production', CRON_SECRET: SECRET }, createDb: () => db,
    now, acquireLease: async () => lease,
    fetchChileBatch: async () => chileBatch(), fetchGetOnBoard: async () => [],
    fetchEmployerBatch: async () => ({ jobs: [], boards: [] }),
    ...overrides,
  })
  return { response, body: await response.json(), completions, lease }
}

const catalogWrites = (db) => db.calls.filter((call) => call.table === 'a4_verified_opportunities' && call.operation !== 'select')

await test('cooldowns come only from the latest completed A4 state and expire by the actual clock', async () => {
  const db = memoryDb([], [
    execution({ [key(BOARD)]: later(12) }, { completed_at: later(-6) }),
    execution({ [key(BOARD)]: later(6), [key(OTHER_BOARD)]: later(-1), 'lever:unknown': later(9) }),
    execution({}, { job_name: 'another-cron', completed_at: later(-1) }),
    execution({}, { status: 'running', completed_at: null }),
    execution(undefined, { completed_at: later(-1), execution_summary: { error: 'EMPLOYER_STATE_UNAVAILABLE' } }),
  ])
  assert.deepEqual(await readEmployerCooldowns(db, { now: NOW }), hostCooldowns(BOARD, later(6)))
  assert.equal(db.calls.length, 1)
  assert.equal(db.calls[0].operation, 'select')
})

await test('cooldowns cover every board on the same provider and a shorter Retry-After never advances retry time', () => {
  const previous = { ...hostCooldowns(BOARD, later(12)), ...hostCooldowns(OTHER_BOARD, later(8)) }
  const rows = [boardResult(BOARD, [], { outcome: 'rate_limited', completeSnapshot: false, retryAfterUntil: later(3) })]
  assert.deepEqual(carryEmployerCooldowns(previous, rows, NOW), previous)
  assert.deepEqual(activeEmployerCooldowns(previous, new Date(later(13))), {})
  assert.throws(() => activeEmployerCooldowns({ [key(BOARD)]: 'not-a-date' }, NOW))
})

await test('primary and employer retrieval run concurrently without extending the six-target rotation', async () => {
  let primaryStarted = false
  let employerStarted = false
  const db = memoryDb()
  const { response, body } = await run(db, {
    fetchChileBatch: async () => {
      primaryStarted = true
      await new Promise((resolve) => setTimeout(resolve, 15))
      assert.equal(employerStarted, true)
      return chileBatch()
    },
    fetchEmployerBatch: async (_slot, options) => {
      employerStarted = true
      assert.equal(primaryStarted, true)
      assert.ok(options.budgetMs > 0 && options.budgetMs < EMPLOYER_REFRESH_BUDGET_MS)
      assert.equal(options.timeoutMs, 8000)
      return employerBatch()
    },
  })
  assert.equal(response.status, 200)
  assert.equal(body.success, true)
  assert.equal(body.upserted, 2)
  assert.equal(body.outcome, 'ok')
  assert.deepEqual(planOpportunityRefresh(6), planOpportunityRefresh(0))
  assert.equal(planOpportunityRefresh(5).source, 'getonboard')
})

await test('a failed primary provider still persists a valid employer batch and records partial failure', async () => {
  const db = memoryDb()
  const { response, body, completions } = await run(db, {
    fetchChileBatch: async () => { throw new Error('DO_NOT_EXPOSE_PRIVATE_PROVIDER_EXCEPTION') },
    fetchEmployerBatch: async () => employerBatch(),
  })
  assert.equal(response.status, 503)
  assert.equal(body.success, false)
  assert.equal(body.outcome, 'partial')
  assert.equal(body.upserted, 1)
  assert.equal(db.tables.a4_verified_opportunities[0].source, BOARD.source)
  assert.equal(completions[0].success, false)
  assert.ok(!JSON.stringify(body).includes('DO_NOT_EXPOSE'))
  assert.ok(!JSON.stringify(body).includes('observedSourceIds'))
})

await test('partial Get on Board normalization stays visible as partial even when valid jobs are stored', async () => {
  const db = memoryDb()
  const sourceId = 'analista-riesgo-empresa-real'
  const value = {
    ...job(), source: 'getonboard', sourceId,
    originalUrl: 'https://www.getonbrd.com/jobs/' + sourceId,
  }
  const { response, body } = await run(db, {
    acquireLease: async () => ({ status: 'acquired', slot: 5, owns: async () => true, complete: async () => {} }),
    fetchChileBatch: async () => assert.fail('Get on Board slot cannot call Chiletrabajos'),
    fetchGetOnBoardBatch: async () => ({
      source: 'getonboard', fetchedAt: NOW.toISOString(), jobs: [value],
      diagnostics: { received: 2, considered: 2, normalized: 1, rejected: 1, returned: 1, outcome: 'partial' },
    }),
  })
  assert.equal(response.status, 503)
  assert.equal(body.upserted, 1)
  assert.equal(body.diagnostics.outcome, 'partial')
  assert.equal(body.outcome, 'partial')
  assert.equal(body.success, false)
})

await test('an employer provider failure preserves primary work and carries unrelated cooldowns', async () => {
  const cooldowns = hostCooldowns(OTHER_BOARD, later(9))
  const db = memoryDb([], [execution(cooldowns)])
  const { response, body } = await run(db, {
    fetchEmployerBatch: async () => { throw new Error('Private upstream failure') },
  })
  assert.equal(response.status, 503)
  assert.equal(body.outcome, 'partial')
  assert.equal(body.upserted, 1)
  assert.equal(body.source_errors.employers, 'EMPLOYER_PROVIDER_UNAVAILABLE')
  assert.deepEqual(body.employer_cooldowns, cooldowns)
})

await test('Retry-After survives a failed primary and reaches the next execution before provider calls', async () => {
  const cooldown = later(12)
  const db = memoryDb()
  const first = await run(db, {
    fetchChileBatch: async () => { throw new Error('Unavailable') },
    fetchEmployerBatch: async () => employerBatch(BOARD, [], {
      outcome: 'rate_limited', completeSnapshot: false, retryAfterUntil: cooldown,
    }),
  })
  assert.equal(first.response.status, 503)
  assert.deepEqual(first.body.employer_cooldowns, hostCooldowns(BOARD, cooldown))
  let checkedBeforeFetch = false
  const next = await run(db, {
    now: () => new Date(later(3)),
    fetchEmployerBatch: async (_slot, options) => {
      assert.equal(options.cooldowns[key(BOARD)], cooldown)
      for (const other of EMPLOYER_BOARDS.filter((board) => board.source === BOARD.source)) {
        assert.equal(options.cooldowns[key(other)], cooldown)
      }
      checkedBeforeFetch = true
      return employerBatch(BOARD, [], { outcome: 'cooldown', completeSnapshot: false, retryAfterUntil: cooldown })
    },
  })
  assert.equal(checkedBeforeFetch, true)
  assert.equal(next.response.status, 200)
  assert.equal(next.body.employer_boards[0].outcome, 'cooldown')
  assert.deepEqual(next.body.employer_cooldowns, hostCooldowns(BOARD, cooldown))
})

await test('one limited employer never discards another healthy company', async () => {
  const values = [job(OTHER_BOARD)]
  const db = memoryDb()
  const { response, body } = await run(db, {
    fetchEmployerBatch: async () => ({
      jobs: values,
      boards: [
        boardResult(BOARD, [], { outcome: 'rate_limited', completeSnapshot: false, retryAfterUntil: later(6) }),
        boardResult(OTHER_BOARD, values),
      ],
    }),
  })
  assert.equal(response.status, 503)
  assert.equal(body.outcome, 'partial')
  assert.equal(body.upserted, 2)
  assert.ok(db.tables.a4_verified_opportunities.some((row) => row.source_id === values[0].sourceId))
})

await test('unknown cooldown state blocks only ATS and cannot replace the previous durable snapshot', async () => {
  const cooldowns = hostCooldowns(BOARD, later(12))
  const db = memoryDb([], [execution(cooldowns)], { failStateRead: true })
  const { response, body } = await run(db, {
    fetchEmployerBatch: async () => assert.fail('Do not call ATS without its cooldown state'),
  })
  assert.equal(response.status, 503)
  assert.equal(body.upserted, 1)
  assert.equal(body.source_errors.employers, 'EMPLOYER_STATE_UNAVAILABLE')
  assert.equal(Object.hasOwn(body, 'employer_cooldowns'), false)
  db.config.failStateRead = false
  assert.deepEqual(await readEmployerCooldowns(db, { now: NOW }), cooldowns)
})

await test('a failed primary write does not prevent valid employer persistence', async () => {
  const db = memoryDb([], [], { failSource: 'chiletrabajos' })
  const { response, body } = await run(db, { fetchEmployerBatch: async () => employerBatch() })
  assert.equal(response.status, 503)
  assert.equal(body.error, 'PERSISTENCE_FAILED')
  assert.equal(body.upserted, 1)
  assert.equal(db.tables.a4_verified_opportunities[0].source, BOARD.source)
})

await test('a failed employer write cannot reconcile away old jobs and primary work remains', async () => {
  const old = indexed(job(BOARD, 9))
  const db = memoryDb([old], [], { failSource: BOARD.source })
  const { response, body } = await run(db, {
    fetchEmployerBatch: async () => employerBatch(),
    reconcileEmployerSnapshot: async () => assert.fail('Failed upsert cannot reconcile'),
  })
  assert.equal(response.status, 503)
  assert.equal(body.upserted, 1)
  assert.equal(db.tables.a4_verified_opportunities[0].verification_status, 'verified_active')
  assert.equal(db.tables.a4_verified_opportunities[0].last_verified_at, old.last_verified_at)
})

await test('partial snapshots may add verified jobs but never retire absent jobs', async () => {
  const old = indexed(job(BOARD, 9))
  const db = memoryDb([old])
  const { response, body } = await run(db, {
    fetchEmployerBatch: async () => employerBatch(BOARD, [job()], { outcome: 'partial', completeSnapshot: false, rejected: 1 }),
    reconcileEmployerSnapshot: async () => assert.fail('Partial snapshot cannot reconcile'),
  })
  assert.equal(response.status, 503)
  assert.equal(body.upserted, 2)
  assert.equal(body.invalidated, 0)
  assert.equal(db.tables.a4_verified_opportunities[0].verification_status, 'verified_active')
})

await test('a complete empty company snapshot retires only that company without renewing verification', async () => {
  const old = indexed(job(BOARD, 9))
  const other = indexed(job(OTHER_BOARD, 9))
  const db = memoryDb([old, other])
  const { response, body } = await run(db, { fetchEmployerBatch: async () => employerBatch(BOARD, []) })
  assert.equal(response.status, 200)
  assert.equal(body.invalidated, 1)
  assert.equal(db.tables.a4_verified_opportunities[0].verification_status, 'stale')
  assert.equal(db.tables.a4_verified_opportunities[0].last_verified_at, old.last_verified_at)
  assert.equal(db.tables.a4_verified_opportunities[1].verification_status, 'verified_active')
})

await test('lease ownership is checked again between primary and employer writes', async () => {
  const db = memoryDb()
  let checks = 0
  const { response, body } = await run(db, {
    fetchEmployerBatch: async () => employerBatch(),
    acquireLease: async () => ({ status: 'acquired', slot: 0, owns: async () => ++checks === 1, complete: async () => {} }),
  })
  assert.equal(response.status, 503)
  assert.equal(body.error, 'LEASE_LOST')
  assert.equal(body.outcome, 'partial')
  assert.equal(body.upserted, 1)
  assert.equal(catalogWrites(db).length, 1)
})

await test('lease ownership is checked again before absence reconciliation', async () => {
  const old = indexed(job(BOARD, 9))
  const db = memoryDb([old])
  let checks = 0
  const { response, body } = await run(db, {
    fetchEmployerBatch: async () => employerBatch(),
    acquireLease: async () => ({ status: 'acquired', slot: 0, owns: async () => ++checks <= 2, complete: async () => {} }),
  })
  assert.equal(response.status, 503)
  assert.equal(body.error, 'LEASE_LOST')
  assert.equal(body.upserted, 2)
  assert.equal(db.tables.a4_verified_opportunities[0].verification_status, 'verified_active')
  assert.equal(catalogWrites(db).length, 2)
})

await test('ATS has an independent hard deadline even when a provider ignores its signal', async () => {
  const original = globalThis.setTimeout
  let providerSignal
  globalThis.setTimeout = (action, ms, ...args) => original(action, ms === EMPLOYER_REFRESH_BUDGET_MS ? 1 : ms, ...args)
  try {
    const db = memoryDb()
    const { response, body } = await run(db, {
      fetchEmployerBatch: async (_slot, options) => {
        providerSignal = options.signal
        return new Promise(() => {})
      },
    })
    assert.equal(response.status, 503)
    assert.equal(body.upserted, 1)
    assert.equal(body.source_errors.employers, 'EMPLOYER_BUDGET_EXHAUSTED')
    assert.equal(providerSignal.aborted, true)
  } finally {
    globalThis.setTimeout = original
  }
})

await test('global cancellation prevents writes and still carries a loaded cooldown snapshot', async () => {
  const original = globalThis.setTimeout
  globalThis.setTimeout = (action, ms, ...args) => original(action, ms === OPPORTUNITY_REFRESH_BUDGET_MS ? 1 : ms, ...args)
  try {
    const cooldowns = hostCooldowns(BOARD, later(12))
    const db = memoryDb([], [execution(cooldowns)])
    const { response, body } = await run(db, {
      fetchChileBatch: async () => new Promise(() => {}),
      fetchEmployerBatch: async () => new Promise(() => {}),
    })
    assert.equal(response.status, 503)
    assert.equal(body.error, 'REFRESH_BUDGET_EXHAUSTED')
    assert.equal(catalogWrites(db).length, 0)
    assert.deepEqual(body.employer_cooldowns, cooldowns)
  } finally {
    globalThis.setTimeout = original
  }
})

await test('ledger finalization has a hard budget even if the completion dependency ignores abort', async () => {
  const original = globalThis.setTimeout
  let completionSignal
  globalThis.setTimeout = (action, ms, ...args) => original(action, ms === 3000 ? 1 : ms, ...args)
  try {
    const db = memoryDb()
    const { response, body } = await run(db, {
      acquireLease: async () => ({
        status: 'acquired', slot: 0, owns: async () => true,
        complete: async (_success, _summary, signal) => {
          completionSignal = signal
          return new Promise(() => {})
        },
      }),
    })
    assert.equal(response.status, 503)
    assert.equal(body.error, 'REFRESH_COMPLETION_FAILED')
    assert.equal(body.outcome, 'partial')
    assert.equal(body.upserted, 1)
    assert.equal(completionSignal.aborted, true)
  } finally {
    globalThis.setTimeout = original
  }
})

console.log(JSON.stringify({ suite: 'employer-refresh', passed: passed.length, cases: passed, externalNetworkRequests: 0, liveDatabaseWrites: 0 }))
