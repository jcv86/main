import assert from 'node:assert/strict'
import { readChileTrabajosRefreshCandidates } from '../lib/opportunities/refresh-candidates.ts'

const TABLE = 'a4_verified_opportunities'
const NOW = new Date('2026-10-07T21:00:00.000Z')
const CUTOFF = '2026-10-07T03:00:00.000Z'
const COLUMNS = ['source_id', 'original_url', 'region', 'verification_status', 'last_verified_at', 'updated_at', 'expires_at']
const cases = []
const test = (name, run) => cases.push({ name, run })

function row(id = '7000001', overrides = {}) {
  return {
    source: 'chiletrabajos', source_id: id,
    original_url: 'https://www.chiletrabajos.cl/trabajo/cargo-sintetico-' + id,
    region: 'Metropolitana', verification_status: 'verified_active',
    last_verified_at: '2026-10-06T12:00:00.000Z', updated_at: '2026-10-06T12:00:00.000Z',
    expires_at: null, title: 'Oferta sintética, no real', source_payload: { unneeded: 'synthetic'.repeat(1000) },
    ...overrides,
  }
}

/** SELECT-only PostgREST model: predicates, multi-column sort, limit, then projection. */
function memoryDb(initialRows = [], options = {}) {
  const rows = structuredClone(initialRows)
  const calls = []
  let writes = 0
  class Query {
    constructor(table) {
      assert.equal(table, TABLE)
      this.columns = '*'
      this.filters = []
      this.sort = []
      this.size = Infinity
    }
    select(columns) { this.columns = columns; return this }
    eq(field, value) { this.filters.push(['eq', field, value]); return this }
    in(field, value) { this.filters.push(['in', field, value]); return this }
    lte(field, value) { this.filters.push(['lte', field, value]); return this }
    order(field, { ascending = true } = {}) { this.sort.push([field, ascending]); return this }
    limit(size) { this.size = size; return this }
    abortSignal(signal) { this.signal = signal; return this }
    update() { writes++; assert.fail('Candidate reads cannot UPDATE') }
    upsert() { writes++; assert.fail('Candidate reads cannot UPSERT') }
    insert() { writes++; assert.fail('Candidate reads cannot INSERT') }
    delete() { writes++; assert.fail('Candidate reads cannot DELETE') }
    async execute() {
      const call = { columns: this.columns, filters: this.filters, sort: this.sort, limit: this.size, signal: this.signal }
      calls.push(call)
      if (options.reject) throw options.reject
      if (Object.hasOwn(options, 'response')) return options.response
      const chosen = rows.filter(candidate => this.filters.every(([operator, field, value]) => {
        const actual = candidate[field]
        if (operator === 'eq') return actual === value
        if (operator === 'in') return value.includes(actual)
        if (operator === 'lte') return typeof actual === 'string' && Number.isFinite(Date.parse(actual)) && Date.parse(actual) <= Date.parse(value)
        assert.fail('Unexpected predicate: ' + operator)
      }))
      chosen.sort((left, right) => {
        for (const [field, ascending] of this.sort) {
          const a = field.endsWith('_at') ? Date.parse(left[field]) : left[field]
          const b = field.endsWith('_at') ? Date.parse(right[field]) : right[field]
          if (a < b) return ascending ? -1 : 1
          if (a > b) return ascending ? 1 : -1
        }
        return 0
      })
      const bounded = chosen.slice(0, this.size)
      call.returned = bounded.length
      const data = bounded.map(candidate => Object.fromEntries(this.columns.split(',').map(field => [field, structuredClone(candidate[field])])))
      options.afterRead?.()
      return { data, error: null }
    }
    then(resolve, reject) { return this.execute().then(resolve, reject) }
  }
  return { rows, calls, get writes() { return writes }, from: table => new Query(table) }
}

test('the three eligible states are selected with an exact regional metadata-only query', async () => {
  const db = memoryDb([
    row('7000001'), row('7000002', { verification_status: 'unavailable' }), row('7000003', { verification_status: 'unknown' }),
  ])
  const before = structuredClone(db.rows)
  const signal = new AbortController().signal
  assert.deepEqual(await readChileTrabajosRefreshCandidates(db, 'Santiago', { now: NOW, signal }), ['7000001', '7000002', '7000003'])
  assert.equal(db.calls.length, 1)
  const [call] = db.calls
  assert.deepEqual(call.columns.split(','), COLUMNS)
  assert.deepEqual(call.filters, [
    ['eq', 'source', 'chiletrabajos'], ['eq', 'region', 'Metropolitana'],
    ['in', 'verification_status', ['verified_active', 'unavailable', 'unknown']],
    ['lte', 'last_verified_at', CUTOFF], ['lte', 'updated_at', NOW.toISOString()],
  ])
  assert.deepEqual(call.sort, [['updated_at', true], ['last_verified_at', true], ['source_id', true]])
  assert.equal(call.limit, 30)
  assert.equal(call.signal, signal)
  assert.equal(db.writes, 0)
  assert.deepEqual(db.rows, before, 'Neither freshness nor last-attempt metadata may change while reading')
})

test('city names scope maintenance to their inferred Chilean region and exclude other sources', async () => {
  for (const [city, region] of [['Santiago', 'Metropolitana'], ['Valparaíso', 'Valparaíso'], ['Concepción', 'Biobío'], ['Antofagasta', 'Antofagasta'], ['Puerto Montt', 'Los Lagos']]) {
    const db = memoryDb([
      row('7000001', { region }), row('7000002', { region: 'Otra región' }),
      row('7000003', { region, source: 'getonboard' }),
    ])
    assert.deepEqual(await readChileTrabajosRefreshCandidates(db, city, { now: NOW }), ['7000001'], city)
  }
})

test('unknown or conflicting locations do not broaden into a countrywide query', async () => {
  for (const location of ['', 'Chile', 'Remoto', 'Santiago y Concepción', 'Ciudad desconocida']) {
    const db = memoryDb([row()])
    assert.deepEqual(await readChileTrabajosRefreshCandidates(db, location, { now: NOW }), [])
    assert.equal(db.calls.length, 0)
  }
})

test('stale, closed and restricted observations are never selected for maintenance', async () => {
  const db = memoryDb(['stale', 'closed', 'verified_restricted', 'active'].map((status, index) => row(String(7000001 + index), { verification_status: status })))
  assert.deepEqual(await readChileTrabajosRefreshCandidates(db, 'Santiago', { now: NOW }), [])
})

test('the 18-hour boundary is inclusive while young and future verification clocks are excluded', async () => {
  const db = memoryDb([
    row('7000001', { last_verified_at: CUTOFF }),
    row('7000002', { last_verified_at: '2026-10-07T03:00:00.001Z' }),
    row('7000003', { last_verified_at: '2026-10-08T00:00:00.000Z' }),
    row('7000004', { updated_at: '2026-10-08T00:00:00.000Z' }),
  ])
  assert.deepEqual(await readChileTrabajosRefreshCandidates(db, 'Santiago', { now: NOW }), ['7000001'])
})

test('the least recently attempted rows win, then oldest verification, then stable ID', async () => {
  const rows = [
    row('7000005', { updated_at: '2026-10-06T14:00:00Z', last_verified_at: '2026-10-05T00:00:00Z' }),
    row('7000004', { updated_at: '2026-10-06T13:00:00Z', last_verified_at: '2026-10-06T12:00:00Z' }),
    row('7000003', { updated_at: '2026-10-06T13:00:00Z', last_verified_at: '2026-10-06T11:00:00Z' }),
    row('7000002', { updated_at: '2026-10-06T13:00:00Z', last_verified_at: '2026-10-06T11:00:00Z' }),
    row('7000001', { updated_at: '2026-10-06T10:00:00Z', last_verified_at: '2026-10-06T10:00:00Z' }),
  ]
  for (const order of [rows, rows.toReversed()]) {
    assert.deepEqual(await readChileTrabajosRefreshCandidates(memoryDb(order), 'Santiago', { now: NOW }), ['7000001', '7000002', '7000003'])
  }
})

test('one bounded read examines at most 30 rows and returns no more than three unique IDs', async () => {
  const rows = Array.from({ length: 40 }, (_, index) => row(String(7000000 + index)))
  const db = memoryDb(rows)
  assert.deepEqual(await readChileTrabajosRefreshCandidates(db, 'Santiago', { now: NOW }), ['7000000', '7000001', '7000002'])
  assert.equal(db.calls[0].returned, 30)
  assert.equal(db.calls.length, 1)
  const blocked = rows.map((value, index) => index < 29 ? { ...value, original_url: 'https://example.test/trabajo/' + value.source_id } : value)
  assert.deepEqual(await readChileTrabajosRefreshCandidates(memoryDb(blocked), 'Santiago', { now: NOW }), ['7000029'])
})

test('IDs and URLs must refer to the same HTTPS Chiletrabajos job without tracking or credentials', async () => {
  const invalid = [
    row('1234'), row('12345678901'), row('7000001 OR 1=1'), row(7000001),
    row('7000001', { original_url: 'https://www.chiletrabajos.cl/trabajo/7000002' }),
    ...['http://www.chiletrabajos.cl/trabajo/7000001', 'https://evil.test/trabajo/7000001',
      'https://www.chiletrabajos.cl.evil.test/trabajo/7000001', 'https://user:pass@www.chiletrabajos.cl/trabajo/7000001',
      'https://www.chiletrabajos.cl:8443/trabajo/7000001', 'https://www.chiletrabajos.cl/trabajo/7000001?next=evil',
      'https://www.chiletrabajos.cl/trabajo/7000001#tracking', 'https://www.chiletrabajos.cl/trabajo/7000001/more',
    ].map(original_url => row('7000001', { original_url })),
  ]
  assert.deepEqual(await readChileTrabajosRefreshCandidates(memoryDb(invalid), 'Santiago', { now: NOW }), [])
  const db = memoryDb([row('7000001'), row('7000002', { original_url: 'https://chiletrabajos.cl/trabajo/7000002/' })])
  assert.deepEqual(await readChileTrabajosRefreshCandidates(db, 'Santiago', { now: NOW }), ['7000001', '7000002'])
})

test('date-only expiry lasts through the final second of the day in Chile', async () => {
  const rows = [row('7000001', { expires_at: '2026-10-07' }), row('7000002', { expires_at: '2026-10-07 (en 1 día)' })]
  assert.deepEqual(await readChileTrabajosRefreshCandidates(memoryDb(rows), 'Santiago', { now: new Date('2026-10-08T02:59:59Z') }), ['7000001', '7000002'])
  assert.deepEqual(await readChileTrabajosRefreshCandidates(memoryDb(rows), 'Santiago', { now: new Date('2026-10-08T03:00:00Z') }), [])
})

test('expired instants and malformed expiry are excluded while null and future deadlines remain eligible', async () => {
  const rows = [
    ...['2026-10-06', NOW.toISOString(), '2026-02-31', 'unknown', 12, {}].map((expires_at, index) => row(String(7000000 + index), { expires_at })),
    row('7000010', { expires_at: '2026-10-07T21:00:00.001Z' }), row('7000011'),
    row('7000012', { expires_at: '08 de Octubre de 2026' }),
  ]
  assert.deepEqual(await readChileTrabajosRefreshCandidates(memoryDb(rows), 'Santiago', { now: NOW }), ['7000010', '7000011', '7000012'])
})

test('runtime checks reject malformed clocks, wrong region, ineligible state and young rows even if a response ignores filters', async () => {
  const rows = [
    row('7000001', { last_verified_at: 'invalid' }), row('7000002', { last_verified_at: null }),
    row('7000003', { updated_at: 'invalid' }), row('7000004', { updated_at: null }),
    row('7000005', { last_verified_at: NOW.toISOString() }), row('7000006', { updated_at: '2027-01-01T00:00:00Z' }),
    row('7000007', { region: 'Biobío' }), row('7000008', { verification_status: 'stale' }),
    row('7000009'),
  ]
  const db = memoryDb([], { response: { data: rows, error: null } })
  assert.deepEqual(await readChileTrabajosRefreshCandidates(db, 'Santiago', { now: NOW }), ['7000009'])
})

test('duplicate response IDs consume only one of the three slots', async () => {
  const db = memoryDb([], { response: { data: [row(), row(), row('7000002'), row('7000003')], error: null } })
  assert.deepEqual(await readChileTrabajosRefreshCandidates(db, 'Santiago', { now: NOW }), ['7000001', '7000002', '7000003'])
})

test('database errors and rejected transports propagate instead of resembling an empty queue', async () => {
  for (const code of ['42P01', '42501', 'PGRST205']) {
    const error = { code, message: 'Synthetic database error' }
    await assert.rejects(readChileTrabajosRefreshCandidates(memoryDb([], { response: { data: null, error } }), 'Santiago', { now: NOW }), value => value === error)
  }
  const error = new Error('Synthetic transport rejection')
  await assert.rejects(readChileTrabajosRefreshCandidates(memoryDb([], { reject: error }), 'Santiago', { now: NOW }), value => value === error)
})

test('invalid responses fail explicitly; a real empty array is a successful empty queue', async () => {
  for (const response of [null, {}, { data: null }, { data: {} }, { data: [null] }, { data: ['bad'] }, { data: [[]] }, { data: Array.from({ length: 31 }, () => row()) }]) {
    await assert.rejects(readChileTrabajosRefreshCandidates(memoryDb([], { response }), 'Santiago', { now: NOW }), /Invalid Chiletrabajos refresh candidate response/)
  }
  assert.deepEqual(await readChileTrabajosRefreshCandidates(memoryDb(), 'Santiago', { now: NOW }), [])
})

test('an already cancelled read never touches the database', async () => {
  const controller = new AbortController()
  controller.abort()
  const db = memoryDb([row()])
  await assert.rejects(readChileTrabajosRefreshCandidates(db, 'Santiago', { now: NOW, signal: controller.signal }), { name: 'AbortError' })
  assert.equal(db.calls.length, 0)
})

test('cancellation during a completed database read prevents candidate delivery', async () => {
  const controller = new AbortController()
  const db = memoryDb([row()], { afterRead: () => controller.abort() })
  await assert.rejects(readChileTrabajosRefreshCandidates(db, 'Santiago', { now: NOW, signal: controller.signal }), { name: 'AbortError' })
  assert.equal(db.calls[0].signal, controller.signal)
  assert.equal(db.writes, 0)
})

test('an invalid reference clock fails before querying', async () => {
  const db = memoryDb([row()])
  await assert.rejects(readChileTrabajosRefreshCandidates(db, 'Santiago', { now: new Date('invalid') }), RangeError)
  assert.equal(db.calls.length, 0)
})

let failed = 0
let networkRequests = 0
const previousFetch = globalThis.fetch
globalThis.fetch = async () => { networkRequests++; throw new Error('Network forbidden in synthetic candidate tests') }
try {
  for (const { name, run } of cases) {
    try { await run() } catch (error) {
      failed++
      console.error(JSON.stringify({ test: name, error: error.message, stack: error.stack }))
    }
  }
  assert.equal(networkRequests, 0)
} finally {
  globalThis.fetch = previousFetch
}
console.log(JSON.stringify({ refresh_candidates: failed ? 'failed' : 'passed', cases: cases.length, passed: cases.length - failed, failed, networkRequests, database: 'SELECT-only synthetic PostgREST; no production access' }))
if (failed) process.exitCode = 1
