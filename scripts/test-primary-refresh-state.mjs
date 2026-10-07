import assert from 'node:assert/strict'
import {
  activePrimaryCooldowns, carryPrimaryCooldowns, readPrimaryCooldowns,
  withPrimaryReadDeadline, PRIMARY_STATE_READ_BUDGET_MS,
} from '../lib/opportunities/primary-refresh-state.ts'
import { runOpportunityRefreshCron, OPPORTUNITY_REFRESH_BUDGET_MS } from '../lib/opportunities/refresh-catalog.ts'
import { readChileTrabajosRefreshCandidates } from '../lib/opportunities/refresh-candidates.ts'
import { fetchGetOnBoardBatch } from '../lib/opportunities/sources/getonboard.ts'
import { matchesPostgrestFilter } from './lib/postgrest-filter-fixture.mjs'

const NOW = new Date('2026-10-07T21:15:00.000Z')
const SECRET = 'synthetic-primary-refresh-test-secret'
const later = (hours, now = NOW) => new Date(now.getTime() + hours * 3600000).toISOString()
const passed = []
async function test(name, action) { await action(); passed.push(name) }

function chileJob(id = '3666989') {
  return {
    source: 'chiletrabajos', sourceId: id, originalUrl: 'https://www.chiletrabajos.cl/trabajo/' + id,
    title: 'Analista de operaciones', company: 'Empresa sintética', location: 'Santiago',
    workMode: 'onsite', publishedAt: '2026-10-01', expiresAt: '2027-01-01',
    description: 'Analizar operaciones y presentar informes.', verificationStatus: 'verified_active',
  }
}
function chileBatch(overrides = {}) {
  const job = chileJob()
  return {
    source: 'chiletrabajos', fetchedAt: NOW.toISOString(), listingUrl: '',
    jobs: [job], verifiedJobs: [job], failedJobs: [],
    diagnostics: {
      discovered: 1, probed: 1, active: 1, stale: 0, parse_failed: 0, unavailable: 0,
      irrelevant: 0, returned: 1, budget_exhausted: false, candidate_limit_reached: false,
      discovery_status: 'ok', outcome: 'ok', maintenance_selected: 0, maintenance_probed: 0,
    }, ...overrides,
  }
}
function employerBatch() {
  const id = '22222222-2222-4222-8222-222222222222'
  const job = {
    source: 'lever', sourceId: 'fintual:' + id, originalUrl: 'https://jobs.lever.co/fintual/' + id,
    title: 'Analista financiero', company: 'Fintual', location: 'Santiago, Chile',
    remote: false, workMode: 'onsite', publishedAt: null, lastVerifiedAt: NOW.toISOString(),
    description: 'Evaluar riesgos y preparar informes financieros.', requirements: [], skills: [],
    verificationStatus: 'verified_active',
  }
  return { jobs: [job], boards: [{
    source: 'lever', board: 'fintual', boardKey: 'lever:fintual', outcome: 'ok',
    received: 1, accepted: 1, rejected: 0, excluded: 0, returned: 1,
    completeSnapshot: true, observedSourceIds: [job.sourceId],
  }] }
}
function oldRow(id = '3666989') {
  return {
    source: 'chiletrabajos', source_id: id, original_url: 'https://www.chiletrabajos.cl/trabajo/' + id,
    title: 'Analista de operaciones', company: 'Empresa sintética', region: 'Metropolitana', location: 'Santiago',
    verification_status: 'verified_active', last_verified_at: later(-30), updated_at: later(-30),
    expires_at: '2027-01-01',
  }
}
function execution(state, overrides = {}) {
  return {
    job_name: 'a4-opportunities', status: 'success', completed_at: later(-3),
    execution_summary: { primary_cooldowns: state, employer_cooldowns: {} }, ...overrides,
  }
}

/** Independent, lazy PostgREST model; only awaited writes mutate local rows. */
function memoryDb({ rows = [], executions = [], ...config } = {}) {
  const tables = { a4_verified_opportunities: structuredClone(rows), cron_job_executions: structuredClone(executions) }
  const calls = []
  const fieldValue = (row, field) => field.split('->').reduce((value, key) => value?.[key], row)
  class Query {
    constructor(table) { this.table = table; this.operation = 'select'; this.filters = []; this.sorts = []; this.max = Infinity }
    select(columns) { this.columns = columns; return this }
    eq(field, value) { this.filters.push(row => fieldValue(row, field) === value); return this }
    in(field, values) { this.filters.push(row => values.includes(fieldValue(row, field))); return this }
    lte(field, value) { this.filters.push(row => fieldValue(row, field) != null && fieldValue(row, field) <= value); return this }
    gte(field, value) { this.filters.push(row => fieldValue(row, field) != null && fieldValue(row, field) >= value); return this }
    or(expression) { this.filters.push(row => matchesPostgrestFilter(row, expression)); return this }
    not(field, operator, value) {
      assert.equal(operator, 'is'); assert.equal(value, null)
      if (field.startsWith('execution_summary->')) this.stateKey = field.split('->')[1]
      this.filters.push(row => fieldValue(row, field) != null)
      return this
    }
    like(field, value) { this.filters.push(row => String(fieldValue(row, field)).startsWith(value.slice(0, -1))); return this }
    order(field, options) { this.sorts.push({ field, ...options }); return this }
    limit(value) { this.max = value; return this }
    maybeSingle() { this.single = true; return this }
    abortSignal(signal) { this.signal = signal; return this }
    upsert(payload) { this.operation = 'upsert'; this.payload = payload; return this }
    update(payload) { this.operation = 'update'; this.payload = payload; return this }
    async execute() {
      calls.push({ table: this.table, operation: this.operation, stateKey: this.stateKey, signal: this.signal, payload: this.payload })
      if (this.signal?.aborted) return { data: null, error: new Error('Aborted') }
      if (this.stateKey === 'primary_cooldowns') {
        if (config.failPrimaryState) return { data: null, error: new Error('DO_NOT_EXPOSE_PRIVATE_STATE_FAILURE') }
        if (config.hangPrimaryState) return new Promise(() => {})
        config.onPrimaryStateRead?.()
      }
      const rows = tables[this.table]
      assert.ok(rows, 'Only the two existing catalog/ledger tables are allowed')
      const selected = rows.filter(row => this.filters.every(predicate => predicate(row)))
      selected.sort((a, b) => {
        for (const sort of this.sorts) {
          const difference = String(fieldValue(a, sort.field)).localeCompare(String(fieldValue(b, sort.field))) * (sort.ascending ? 1 : -1)
          if (difference) return difference
        }
        return 0
      })
      const limited = selected.slice(0, this.max)
      if (this.operation === 'upsert') {
        if (this.payload.some(row => row.source === config.failUpsertSource)) return { error: new Error('DO_NOT_EXPOSE_PRIVATE_WRITE_FAILURE') }
        if (config.waitForUpsert) return config.waitForUpsert(this.signal)
        for (const row of this.payload) {
          const existing = rows.find(item => item.source === row.source && item.source_id === row.source_id)
          if (existing) Object.assign(existing, structuredClone(row))
          else rows.push(structuredClone(row))
        }
        return { error: null }
      }
      if (this.operation === 'update') {
        if (this.payload.verification_status === config.failUpdateStatus) {
          return { error: new Error('DO_NOT_EXPOSE_PRIVATE_UPDATE_FAILURE'), count: 0 }
        }
        if (this.payload.verification_status === config.stallUpdateStatus) return config.waitForUpdate(this.signal)
        for (const row of limited) Object.assign(row, structuredClone(this.payload))
        return { error: null, count: limited.length }
      }
      return { data: this.single ? structuredClone(limited[0] ?? null) : structuredClone(limited), error: null }
    }
    then(resolve, reject) { return this.execute().then(resolve, reject) }
  }
  return { tables, calls, config, from: table => new Query(table) }
}

async function run(db, overrides = {}) {
  const { slot = 0, owns = async () => true, ...dependencies } = overrides
  const now = dependencies.now ?? (() => NOW)
  const completions = []
  const response = await runOpportunityRefreshCron(new Request('https://dtc.test/api/cron/a4-opportunities', {
    headers: { authorization: 'Bearer ' + SECRET },
  }), {
    env: { VERCEL_ENV: 'production', CRON_SECRET: SECRET }, createDb: () => db, now,
    acquireLease: async () => ({ status: 'acquired', slot, owns, complete: async (success, summary) => {
      completions.push({ success, summary: structuredClone(summary), liveSummary: summary })
      db.tables.cron_job_executions.push(execution(undefined, {
        status: success ? 'success' : 'failure', completed_at: now().toISOString(),
        execution_summary: structuredClone(summary),
      }))
    } }),
    fetchChileBatch: async () => chileBatch(), fetchGetOnBoard: async () => [],
    readChileCandidates: async () => [], fetchEmployerBatch: async () => ({ jobs: [], boards: [] }),
    ...dependencies,
  })
  const body = await response.json()
  assert.doesNotMatch(JSON.stringify(body), /DO_NOT_EXPOSE/)
  return { response, body, completions }
}
const catalogWrites = db => db.calls.filter(call => call.table === 'a4_verified_opportunities' && call.operation !== 'select')
const metrics = (upserted, invalidated = 0, rejected = 0, outcome = 'ok') => ({ upserted, invalidated, rejected, outcome })
async function accelerated(budget, action) {
  const original = globalThis.setTimeout
  globalThis.setTimeout = (fn, ms, ...args) => original(fn, ms === budget ? 5 : ms, ...args)
  try { return await action() } finally { globalThis.setTimeout = original }
}

await test('cooldown state retains only fixed sources, future dates and canonical ISO values', () => {
  assert.deepEqual(activePrimaryCooldowns({ chiletrabajos: later(10), getonboard: later(0), arbitrary_host: 'private' }, NOW), { chiletrabajos: later(10) })
  for (const invalid of [null, [], { chiletrabajos: 'private invalid date' }, { getonboard: 42 }]) {
    assert.throws(() => activePrimaryCooldowns(invalid, NOW))
  }
})
await test('shorter retry dates never reduce either existing wait and expired entries disappear', () => {
  const previous = { chiletrabajos: later(12), getonboard: later(30) }
  assert.deepEqual(carryPrimaryCooldowns(previous, 'chiletrabajos', later(3), NOW), previous)
  assert.deepEqual(carryPrimaryCooldowns(previous, 'chiletrabajos', later(15), NOW), { ...previous, chiletrabajos: later(15) })
  assert.deepEqual(activePrimaryCooldowns(previous, new Date(later(31))), {})
  assert.throws(() => carryPrimaryCooldowns(previous, 'chiletrabajos', 'invalid private wait', NOW))
})
await test('state reads select the newest completed snapshot and skip newer legacy or failed reads', async () => {
  const db = memoryDb({ executions: [
    execution({ chiletrabajos: later(10) }),
    execution({ getonboard: later(4) }, { completed_at: later(-9) }),
    execution({ getonboard: later(99) }, { job_name: 'unrelated', completed_at: later(-1) }),
    execution({ getonboard: later(99) }, { status: 'running', completed_at: null }),
    execution(undefined, { status: 'failure', completed_at: later(-1), execution_summary: { error: 'PRIMARY_STATE_UNAVAILABLE' } }),
  ] })
  assert.deepEqual(await readPrimaryCooldowns(db, { now: NOW }), { chiletrabajos: later(10) })
  assert.equal(db.calls.length, 1)
  assert.equal(db.calls[0].operation, 'select')
})
await test('state reads reject aborted requests before and after the database response', async () => {
  const before = new AbortController(); before.abort()
  const db = memoryDb()
  await assert.rejects(readPrimaryCooldowns(db, { now: NOW, signal: before.signal }), { name: 'AbortError' })
  assert.equal(db.calls.length, 0)
  const after = new AbortController()
  const late = memoryDb({ onPrimaryStateRead: () => after.abort() })
  await assert.rejects(readPrimaryCooldowns(late, { now: NOW, signal: after.signal }), { name: 'AbortError' })
})
await test('legacy executions without primary state retain the existing provider flow', async () => {
  const db = memoryDb({ executions: [execution(undefined, { execution_summary: { employer_cooldowns: {}, upserted: 12 } })] })
  const { response, body } = await run(db)
  assert.equal(response.status, 200)
  assert.deepEqual(body.primary_cooldowns, {})
  assert.deepEqual(body.primary_persistence, metrics(1))
})
await test('a Chiletrabajos cooldown covers a different city before candidate or provider reads', async () => {
  const db = memoryDb({ executions: [execution({ chiletrabajos: later(10), getonboard: later(20) })] })
  const { response, body } = await run(db, {
    slot: 1,
    readChileCandidates: async () => assert.fail('Cooldown must precede candidate reads'),
    fetchChileBatch: async () => assert.fail('A city rotation must not bypass a host wait'),
    fetchEmployerBatch: async () => employerBatch(),
  })
  assert.equal(response.status, 200)
  assert.equal(body.scope, 'Valparaíso')
  assert.equal(body.diagnostics.outcome, 'cooldown')
  assert.deepEqual(body.primary_persistence, metrics(0, 0, 0, 'cooldown'))
  assert.deepEqual(body.employer_boards[0].persistence, metrics(1))
  assert.equal(body.upserted, 1)
})
await test('a Get on Board cooldown skips its source and expires at the exact boundary', async () => {
  const db = memoryDb({ executions: [execution({ getonboard: later(18) })] })
  const first = await run(db, { slot: 5, fetchGetOnBoard: async () => assert.fail('Cooldown must defer Get on Board') })
  assert.equal(first.response.status, 200)
  assert.equal(first.body.diagnostics.outcome, 'cooldown')
  let resumed = 0
  const second = await run(db, { slot: 11, now: () => new Date(later(18)), fetchGetOnBoard: async () => { resumed++; return [] } })
  assert.equal(second.response.status, 200)
  assert.equal(resumed, 1)
  assert.deepEqual(second.body.primary_cooldowns, {})
})
await test('unreadable primary state fails closed only for primary and cannot erase a previous wait', async () => {
  const db = memoryDb({ executions: [execution({ chiletrabajos: later(10) })], failPrimaryState: true })
  const { response, body } = await run(db, {
    fetchChileBatch: async () => assert.fail('Unknown cooldown state must block the source'),
    fetchEmployerBatch: async () => employerBatch(),
  })
  assert.equal(response.status, 503)
  assert.equal(body.outcome, 'partial')
  assert.equal(body.source_errors.chiletrabajos, 'PRIMARY_STATE_UNAVAILABLE')
  assert.equal(Object.hasOwn(body, 'primary_cooldowns'), false)
  assert.deepEqual(body.primary_persistence, metrics(0, 0, 0, 'not_attempted'))
  assert.deepEqual(body.employer_boards[0].persistence, metrics(1))
  db.config.failPrimaryState = false
  assert.deepEqual(await readPrimaryCooldowns(db, { now: NOW }), { chiletrabajos: later(10) })
})
await test('malformed stored state is neither exported nor treated as an empty cooldown', async () => {
  const db = memoryDb({ executions: [execution({ chiletrabajos: 'DO_NOT_EXPOSE_PRIVATE_INVALID_WAIT' })] })
  const { body } = await run(db, { fetchChileBatch: async () => assert.fail('Malformed wait must fail closed') })
  assert.equal(body.source_errors.chiletrabajos, 'PRIMARY_STATE_UNAVAILABLE')
  assert.equal(Object.hasOwn(body, 'primary_cooldowns'), false)
})
await test('the real Get on Board 429 adapter persists Retry-After across the next scheduled visit', async () => {
  let calls = 0
  const db = memoryDb({ executions: [execution({ chiletrabajos: later(36) })] })
  const first = await run(db, {
    slot: 5,
    fetchGetOnBoardBatch: (category, page, options) => fetchGetOnBoardBatch(category, page, {
      ...options, now: () => NOW.getTime(), fetchImpl: async () => {
        calls++
        return new Response('', { status: 429, headers: { 'Retry-After': '86400' } })
      },
    }),
    fetchEmployerBatch: async () => employerBatch(),
  })
  assert.equal(first.response.status, 503)
  assert.equal(first.body.diagnostics.failure_code, 'http_429')
  assert.deepEqual(first.body.primary_cooldowns, { chiletrabajos: later(36), getonboard: later(24) })
  assert.equal(first.body.upserted, 1)
  const next = await run(db, { slot: 11, now: () => new Date(later(18)), fetchGetOnBoard: async () => assert.fail('Persisted wait must be honored') })
  assert.equal(next.body.diagnostics.outcome, 'cooldown')
  assert.equal(calls, 1)
})
await test('a partial Chiletrabajos response keeps valid rows and carries Retry-After to the next city', async () => {
  const db = memoryDb()
  const batch = chileBatch()
  batch.diagnostics.outcome = 'partial'
  batch.diagnostics.failure_code = 'http_429'
  batch.diagnostics.retryAfterUntil = later(10)
  const first = await run(db, { fetchChileBatch: async () => batch })
  assert.equal(first.response.status, 503)
  assert.equal(first.body.outcome, 'partial')
  assert.deepEqual(first.body.primary_persistence, metrics(1))
  assert.deepEqual(first.body.primary_cooldowns, { chiletrabajos: later(10) })
  const next = await run(db, { slot: 1, now: () => new Date(later(3)), fetchChileBatch: async () => assert.fail('No retry on the next city') })
  assert.equal(next.body.diagnostics.outcome, 'cooldown')
})
await test('the real candidate reader feeds at most three preferred IDs without renewing them before a probe', async () => {
  const old = oldRow()
  const db = memoryDb({ rows: [old] })
  let inspected = false
  const { response, body } = await run(db, {
    readChileCandidates: readChileTrabajosRefreshCandidates,
    fetchChileBatch: async (_search, location, limit, options) => {
      assert.equal(location, 'Santiago'); assert.equal(limit, 12)
      assert.equal(options.maxCandidates, 12); assert.equal(options.budgetMs, 35000)
      assert.deepEqual(options.preferredIds, [old.source_id])
      assert.equal(db.tables.a4_verified_opportunities[0].last_verified_at, old.last_verified_at)
      assert.equal(catalogWrites(db).length, 0)
      inspected = true
      return chileBatch()
    },
  })
  assert.equal(inspected, true)
  assert.equal(response.status, 200)
  assert.equal(db.tables.a4_verified_opportunities.length, 1)
  assert.equal(db.tables.a4_verified_opportunities[0].last_verified_at, NOW.toISOString())
  assert.deepEqual(body.primary_persistence, metrics(1))
})
await test('a failed candidate read preserves all twelve discovery places and records a partial refresh', async () => {
  const db = memoryDb()
  const { response, body } = await run(db, {
    readChileCandidates: async () => { throw new Error('DO_NOT_EXPOSE_PRIVATE_CANDIDATE_FAILURE') },
    fetchChileBatch: async (_search, _location, limit, options) => {
      assert.equal(limit, 12); assert.equal(options.maxCandidates, 12)
      assert.equal(Object.hasOwn(options, 'preferredIds'), false)
      return chileBatch()
    },
  })
  assert.equal(response.status, 503)
  assert.equal(body.source_errors.chiletrabajos, 'PRIMARY_MAINTENANCE_UNAVAILABLE')
  assert.equal(body.diagnostics.maintenance_selection_status, 'unavailable')
  assert.deepEqual(body.primary_persistence, metrics(1))
})
await test('a stalled state read has its own deadline and leaves time for ATS persistence', async () => {
  await accelerated(PRIMARY_STATE_READ_BUDGET_MS, async () => {
    const db = memoryDb({ hangPrimaryState: true })
    const { response, body } = await run(db, {
      fetchChileBatch: async () => assert.fail('A state timeout cannot contact the provider'),
      fetchEmployerBatch: async () => employerBatch(),
    })
    assert.equal(response.status, 503)
    assert.equal(body.source_errors.chiletrabajos, 'PRIMARY_STATE_UNAVAILABLE')
    assert.equal(body.upserted, 1)
    assert.equal(db.calls.find(call => call.stateKey === 'primary_cooldowns').signal.aborted, true)
    assert.equal(Object.hasOwn(body, 'primary_cooldowns'), false)
  })
})
await test('a candidate read that ignores its deadline cannot later change the chosen work or catalog', async () => {
  await accelerated(PRIMARY_STATE_READ_BUDGET_MS, async () => {
    let release
    let candidateSignal
    let calls = 0
    const db = memoryDb()
    const { body } = await run(db, {
      readChileCandidates: async (_db, _location, options) => {
        candidateSignal = options.signal
        return new Promise(resolve => { release = resolve })
      },
      fetchChileBatch: async (_search, _location, _limit, options) => {
        calls++; assert.equal(options.preferredIds, undefined); return chileBatch()
      },
    })
    assert.equal(candidateSignal.aborted, true)
    assert.equal(body.source_errors.chiletrabajos, 'PRIMARY_MAINTENANCE_UNAVAILABLE')
    const before = structuredClone(db.tables)
    release(['3666991'])
    await new Promise(resolve => setImmediate(resolve))
    assert.equal(calls, 1)
    assert.deepEqual(db.tables, before)
  })
})
await test('primary write failure does not credit accepted rows and ATS reports only its confirmed writes', async () => {
  const db = memoryDb({ failUpsertSource: 'chiletrabajos' })
  const { response, body } = await run(db, { fetchEmployerBatch: async () => employerBatch() })
  assert.equal(response.status, 503)
  assert.deepEqual(body.primary_persistence, metrics(0, 0, 0, 'failed'))
  assert.deepEqual(body.employer_boards[0].persistence, metrics(1))
  assert.equal(body.upserted, 1)
})
await test('employer write failure does not turn its accepted count into persistence', async () => {
  const db = memoryDb({ failUpsertSource: 'lever' })
  const { body } = await run(db, { fetchEmployerBatch: async () => employerBatch() })
  assert.equal(body.employer_boards[0].accepted, 1)
  assert.deepEqual(body.employer_boards[0].persistence, metrics(0, 0, 0, 'failed'))
  assert.deepEqual(body.primary_persistence, metrics(1))
  assert.equal(body.upserted, 1)
})
await test('an earlier successful invalidation remains counted when the following primary upsert fails', async () => {
  const old = oldRow('3666990')
  const db = memoryDb({ rows: [old], failUpsertSource: 'chiletrabajos' })
  const { body } = await run(db, { fetchChileBatch: async () => chileBatch({ failedJobs: [{ sourceId: old.source_id, verificationStatus: 'unavailable' }] }) })
  assert.deepEqual(body.primary_persistence, metrics(0, 1, 0, 'partial'))
  assert.equal(body.invalidated, 1)
  assert.equal(db.tables.a4_verified_opportunities[0].last_verified_at, old.last_verified_at)
})
await test('parsed negatives retain confirmed invalidation counts when the active upsert fails, without bypassing identity validation', async () => {
  const stale = oldRow('3666990')
  const invalid = oldRow('3666991')
  const db = memoryDb({ rows: [stale, invalid], failUpsertSource: 'chiletrabajos' })
  const { response, body, completions } = await run(db, {
    fetchChileBatch: async () => chileBatch({ verifiedJobs: [
      { ...chileJob(stale.source_id), verificationStatus: 'stale' },
      { ...chileJob(invalid.source_id), verificationStatus: 'stale', originalUrl: 'https://unreviewed.invalid/trabajo/' + invalid.source_id },
      chileJob(),
    ] }),
  })
  assert.equal(response.status, 503)
  assert.deepEqual(body.primary_persistence, metrics(0, 1, 1, 'partial'))
  assert.equal(body.invalidated, 1)
  assert.equal(body.rejected, 1)
  assert.equal(completions[0].summary.invalidated, 1)
  assert.equal(db.tables.a4_verified_opportunities[0].verification_status, 'stale')
  assert.equal(db.tables.a4_verified_opportunities[1].verification_status, 'verified_active')
  assert.equal(db.tables.a4_verified_opportunities[0].last_verified_at, stale.last_verified_at)
  assert.equal(db.tables.a4_verified_opportunities[1].last_verified_at, invalid.last_verified_at)
  assert.equal(catalogWrites(db).length, 2)
})
await test('a later negative-status UPDATE failure cannot erase or double-count the previous confirmed status group', async () => {
  const stale = oldRow('3666990')
  const unknown = oldRow('3666991')
  const db = memoryDb({ rows: [stale, unknown], failUpdateStatus: 'unknown' })
  const { response, body, completions } = await run(db, {
    fetchChileBatch: async () => chileBatch({ verifiedJobs: [
      { ...chileJob(stale.source_id), verificationStatus: 'stale' },
      { ...chileJob(unknown.source_id), verificationStatus: 'unknown' },
      chileJob(),
    ] }),
  })
  assert.equal(response.status, 503)
  assert.deepEqual(body.primary_persistence, metrics(0, 1, 0, 'partial'))
  assert.equal(body.invalidated, 1)
  assert.equal(completions[0].summary.invalidated, 1)
  assert.deepEqual(catalogWrites(db).map(call => call.payload.verification_status), ['stale', 'unknown'])
  assert.equal(db.tables.a4_verified_opportunities[0].verification_status, 'stale')
  assert.equal(db.tables.a4_verified_opportunities[1].verification_status, 'verified_active')
  assert.equal(db.tables.a4_verified_opportunities[0].last_verified_at, stale.last_verified_at)
})
await test('an active offer that expires between collection and writing retains its confirmed downgrade when the next upsert fails', async () => {
  const old = oldRow('3666990')
  const db = memoryDb({ rows: [old], failUpsertSource: 'chiletrabajos' })
  let clock = NOW
  const { response, body } = await run(db, {
    now: () => clock,
    fetchChileBatch: async () => {
      const expiredBeforeWrite = { ...chileJob(old.source_id), expiresAt: new Date(NOW.getTime() + 1000).toISOString() }
      clock = new Date(NOW.getTime() + 2000)
      return chileBatch({ verifiedJobs: [expiredBeforeWrite, chileJob()] })
    },
  })
  assert.equal(response.status, 503)
  assert.deepEqual(body.primary_persistence, metrics(0, 1, 0, 'partial'))
  assert.equal(body.invalidated, 1)
  assert.equal(db.tables.a4_verified_opportunities[0].verification_status, 'stale')
  assert.equal(db.tables.a4_verified_opportunities[0].last_verified_at, old.last_verified_at)
})
await test('a failed absence reconciliation preserves confirmed employer insertion statistics', async () => {
  const db = memoryDb()
  const { body } = await run(db, {
    fetchEmployerBatch: async () => employerBatch(),
    reconcileEmployerSnapshot: async () => { throw new Error('DO_NOT_EXPOSE_PRIVATE_RECONCILIATION_FAILURE') },
  })
  assert.deepEqual(body.employer_boards[0].persistence, metrics(1, 0, 0, 'partial'))
  assert.equal(body.upserted, body.primary_persistence.upserted + body.employer_boards[0].persistence.upserted)
  assert.equal(body.error, 'PERSISTENCE_FAILED')
})
await test('lease loss before a primary write leaves all counters at zero and retains loaded waits', async () => {
  const db = memoryDb({ executions: [execution({ getonboard: later(12) })] })
  const { body } = await run(db, { owns: async () => false, fetchEmployerBatch: async () => employerBatch() })
  assert.equal(body.error, 'LEASE_LOST')
  assert.equal(catalogWrites(db).length, 0)
  assert.deepEqual(body.primary_persistence, metrics(0, 0, 0, 'failed'))
  assert.deepEqual(body.employer_boards[0].persistence, metrics(0, 0, 0, 'not_attempted'))
  assert.deepEqual(body.primary_cooldowns, { getonboard: later(12) })
})
await test('global abort carries loaded primary state and a late provider result cannot write', async () => {
  await accelerated(OPPORTUNITY_REFRESH_BUDGET_MS, async () => {
    let release
    const db = memoryDb({ executions: [execution({ getonboard: later(12) })] })
    const { body } = await run(db, {
      fetchChileBatch: async () => new Promise(resolve => { release = resolve }),
      fetchEmployerBatch: async () => employerBatch(),
    })
    assert.equal(body.error, 'REFRESH_BUDGET_EXHAUSTED')
    assert.equal(catalogWrites(db).length, 0)
    assert.deepEqual(body.primary_cooldowns, { getonboard: later(12) })
    release(chileBatch())
    await new Promise(resolve => setImmediate(resolve))
    assert.equal(catalogWrites(db).length, 0)
  })
})
await test('a confirmed downgrade survives abort while the next UPSERT is pending and its late acknowledgment is ignored', async () => {
  await accelerated(OPPORTUNITY_REFRESH_BUDGET_MS, async () => {
    let release
    const old = oldRow('3666990')
    const db = memoryDb({ rows: [old], waitForUpsert: async () => new Promise(resolve => { release = resolve }) })
    const { body, completions } = await run(db, {
      fetchChileBatch: async () => chileBatch({ verifiedJobs: [
        { ...chileJob(old.source_id), verificationStatus: 'stale' }, chileJob(),
      ] }),
    })
    assert.equal(body.error, 'REFRESH_BUDGET_EXHAUSTED')
    assert.equal(body.invalidated, 1)
    assert.deepEqual(body.primary_persistence, metrics(0, 1, 0, 'partial'))
    assert.equal(completions[0].summary.invalidated, 1)
    assert.equal(db.tables.a4_verified_opportunities[0].verification_status, 'stale')
    assert.equal(db.tables.a4_verified_opportunities[0].last_verified_at, old.last_verified_at)
    const before = structuredClone(completions[0].liveSummary)
    const writes = catalogWrites(db).length
    release({ error: null })
    await new Promise(resolve => setImmediate(resolve))
    assert.deepEqual(completions[0].liveSummary, before)
    assert.equal(catalogWrites(db).length, writes)
  })
})
await test('abort between negative status groups keeps earlier counts and forbids later statements after a delayed response', async () => {
  await accelerated(OPPORTUNITY_REFRESH_BUDGET_MS, async () => {
    let release
    const rows = [oldRow('3666990'), oldRow('3666991'), oldRow('3666992')]
    const db = memoryDb({ rows, stallUpdateStatus: 'unknown', waitForUpdate: async () => new Promise(resolve => { release = resolve }) })
    const { body, completions } = await run(db, {
      fetchChileBatch: async () => chileBatch({ verifiedJobs: [
        { ...chileJob('3666990'), verificationStatus: 'stale' },
        { ...chileJob('3666991'), verificationStatus: 'unknown' },
        { ...chileJob('3666992'), verificationStatus: 'verified_restricted' },
        chileJob(),
      ] }),
    })
    assert.equal(body.error, 'REFRESH_BUDGET_EXHAUSTED')
    assert.deepEqual(body.primary_persistence, metrics(0, 1, 0, 'partial'))
    assert.equal(body.invalidated, 1)
    assert.deepEqual(catalogWrites(db).map(call => call.payload.verification_status), ['stale', 'unknown'])
    const before = structuredClone(completions[0].liveSummary)
    release({ error: null, count: 1 })
    await new Promise(resolve => setImmediate(resolve))
    assert.deepEqual(completions[0].liveSummary, before)
    assert.equal(catalogWrites(db).length, 2)
  })
})
await test('an already aborted bounded read never starts its callback', async () => {
  const controller = new AbortController(); controller.abort()
  await assert.rejects(withPrimaryReadDeadline(async () => assert.fail('Aborted read callback'), controller.signal), { name: 'AbortError' })
})

console.log(JSON.stringify({ suite: 'primary-refresh-state', passed: passed.length, cases: passed, externalNetworkRequests: 0, liveDatabaseWrites: 0 }))
