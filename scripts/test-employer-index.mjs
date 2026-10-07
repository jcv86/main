import assert from 'node:assert/strict'
import { normalizeEmployerJob } from '../lib/opportunities/sources/employer-normalize.ts'
import { EMPLOYER_BOARDS } from '../lib/opportunities/sources/employer-registry.ts'
import {
  invalidateOpportunityVerifications,
  OpportunityPersistenceError,
  OPPORTUNITY_FRESHNESS_MS,
  readVerifiedOpportunities,
  reconcileEmployerSnapshot,
  upsertVerifiedOpportunities,
} from '../lib/opportunities/verified-index.ts'
import { filterOpportunities } from '../lib/opportunities/matching.ts'
import { runOpportunityRefreshCron } from '../lib/opportunities/refresh-catalog.ts'

const NOW = new Date('2026-10-07T20:00:00.000Z')
const OLD = new Date(NOW.getTime() - 60_000).toISOString()
const UUID = '00000000-0000-4000-8000-000000000101'
const UUID2 = '00000000-0000-4000-8000-000000000102'
const TABLE = 'a4_verified_opportunities'
const SECRET = 'synthetic-employer-integration-test-secret'
const findBoard = (source, board) => {
  const result = EMPLOYER_BOARDS.find(item => item.source === source && item.board === board)
  assert.ok(result, 'Synthetic test requires a reviewed board: ' + source + ':' + board)
  return result
}
const fintual = findBoard('lever', 'fintual')
const apply = findBoard('lever', 'applydigital')
const cabify = findBoard('greenhouse', 'cabify')
const checkr = findBoard('greenhouse', 'chile')

/** Synthetic provider records; these do not represent actual advertised jobs. */
function providerRecord(board, overrides = {}) {
  if (board.source === 'lever') {
    const id = overrides.id ?? UUID
    return {
      id, text: 'Analista de crédito',
      hostedUrl: 'https://jobs.lever.co/' + board.board + '/' + id,
      categories: { location: 'Santiago, Chile', commitment: 'Full-time' },
      country: 'CL', workplaceType: 'hybrid',
      descriptionPlain: 'Oferta sintética de QA: evaluar riesgo y preparar informes de crédito.',
      lists: [{ text: 'Requisitos', content: '<ul><li>Análisis de riesgo</li><li>Excel avanzado</li></ul>' }],
      createdAt: Date.parse('2026-10-01T12:00:00Z'),
      ...overrides,
    }
  }
  const id = overrides.id ?? 900101
  return {
    id, internal_job_id: 800101,
    title: 'Analista de crédito',
    absolute_url: 'https://job-boards.greenhouse.io/' + board.board + '/jobs/' + id,
    location: { name: 'Santiago, Chile' }, offices: [],
    content: '&lt;p&gt;Oferta sintética de QA. Modelo híbrido. Análisis de crédito.&lt;/p&gt;',
    first_published: '2026-10-01T12:00:00Z',
    updated_at: '2026-10-06T10:00:00Z',
    ...overrides,
  }
}

function normalized(board = fintual, input = {}, verifiedAt = NOW.toISOString()) {
  const result = normalizeEmployerJob(board, providerRecord(board, input), verifiedAt)
  assert.equal(result.kind, 'accepted', JSON.stringify(result))
  return result.job
}

function rowOf(job, overrides = {}) {
  return {
    source: job.source, source_id: job.sourceId, original_url: job.originalUrl,
    title: job.title, normalized_title: job.title,
    category_key: 'other', category_label: 'Otros', company: job.company,
    location: job.location, region: null, work_mode: job.workMode ?? null,
    published_at: job.publishedAt, expires_at: job.expiresAt ?? null,
    verification_status: 'verified_active', last_verified_at: OLD,
    description: job.description, requirements: job.requirements, skills: job.skills,
    updated_at: OLD, ...overrides,
  }
}

function snapshot(board = fintual, jobs = [], overrides = {}) {
  return {
    source: board.source, board: board.board, boardKey: board.source + ':' + board.board,
    outcome: jobs.length ? 'ok' : 'no_matches',
    received: jobs.length, accepted: jobs.length, rejected: 0, excluded: 0,
    returned: jobs.length, completeSnapshot: true,
    observedSourceIds: jobs.map(job => job.sourceId), ...overrides,
  }
}

const dbError = (message, code) => Object.assign(new Error(message), { code })
function assertCatalogConstraints(rows) {
  const identities = new Set()
  const urls = new Set()
  for (const row of rows) {
    for (const field of ['source', 'source_id', 'original_url', 'title', 'company', 'last_verified_at']) {
      if (typeof row[field] !== 'string' || !row[field]) throw dbError('NOT NULL: ' + field, '23502')
    }
    if (!['verified_active', 'stale', 'unavailable', 'unknown'].includes(row.verification_status)) {
      throw dbError('verification_status check constraint', '23514')
    }
    if (!Array.isArray(row.requirements) || !Array.isArray(row.skills)) throw dbError('jsonb array check constraint', '23514')
    const identity = JSON.stringify([row.source, row.source_id])
    if (identities.has(identity) || urls.has(row.original_url)) throw dbError('unique catalog constraint', '23505')
    identities.add(identity)
    urls.add(row.original_url)
  }
}

/**
 * An independent PostgREST boundary: predicates, order, projection and limits
 * run before results are returned; each mutation is atomic and enforces the
 * production catalog's unique keys, four allowed states and JSON array shape.
 * Cancellation is checked before commit. This never connects to Supabase.
 */
function memoryDb(initialRows = [], options = {}) {
  const tables = {
    [TABLE]: structuredClone(initialRows),
    cron_job_executions: structuredClone(options.executions ?? []),
  }
  assertCatalogConstraints(tables[TABLE])
  const calls = []
  const mutations = []
  const fieldValue = (row, field) => field.split('->').reduce((value, part) => value?.[part], row)
  class Query {
    constructor(table) {
      assert.ok(Object.hasOwn(tables, table), 'Unexpected table: ' + table)
      this.table = table
      this.operation = 'select'
      this.filters = []
      this.columns = '*'
      this.size = Infinity
      this.sort = []
    }
    select(columns = '*') { this.columns = columns; return this }
    eq(field, value) { this.filters.push(['eq', field, value]); return this }
    in(field, values) { this.filters.push(['in', field, values]); return this }
    gte(field, value) { this.filters.push(['gte', field, value]); return this }
    lte(field, value) { this.filters.push(['lte', field, value]); return this }
    like(field, value) { this.filters.push(['like', field, value]); return this }
    not(field, operator, value) {
      assert.equal(operator, 'is')
      assert.equal(value, null)
      this.filters.push(['not-null', field])
      return this
    }
    order(field, { ascending = true } = {}) { this.sort.push([field, ascending]); return this }
    limit(value) { assert.ok(Number.isInteger(value) && value > 0); this.size = value; return this }
    maybeSingle() { this.single = true; return this }
    update(payload, config = {}) { this.operation = 'update'; this.payload = payload; this.config = config; return this }
    upsert(payload, config = {}) { this.operation = 'upsert'; this.payload = payload; this.config = config; return this }
    abortSignal(signal) { this.signal = signal; return this }
    matches(row) {
      return this.filters.every(([operator, field, value]) => {
        const actual = fieldValue(row, field)
        if (operator === 'eq') return actual === value
        if (operator === 'in') return value.includes(actual)
        if (operator === 'gte') return actual >= value
        if (operator === 'lte') return actual <= value
        if (operator === 'not-null') return actual !== undefined && actual !== null
        if (operator === 'like') {
          const regex = '^' + value.split('').map(char => char === '%' ? '.*' : char === '_' ? '.' : char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('') + '$'
          return typeof actual === 'string' && new RegExp(regex).test(actual)
        }
        assert.fail('Unhandled PostgREST operator: ' + operator)
      })
    }
    async execute() {
      calls.push({ table: this.table, operation: this.operation, filters: structuredClone(this.filters), columns: this.columns, limit: this.size })
      if (this.signal?.aborted) return { data: null, count: 0, error: new DOMException('Aborted', 'AbortError') }
      if (options.failOperation === this.operation) return { data: null, count: 0, error: dbError('Synthetic database failure: ' + this.operation, 'XX000') }
      const current = tables[this.table]
      let selected = current.filter(row => this.matches(row))
      for (const [field, ascending] of this.sort.toReversed()) {
        selected.sort((left, right) => (fieldValue(left, field) < fieldValue(right, field) ? -1 : fieldValue(left, field) > fieldValue(right, field) ? 1 : 0) * (ascending ? 1 : -1))
      }
      selected = selected.slice(0, this.size)
      if (this.operation === 'select') {
        const project = row => this.columns === '*' ? structuredClone(row) : Object.fromEntries(this.columns.split(',').map(column => [column, structuredClone(row[column])]))
        const data = selected.map(project)
        if (this.single && data.length > 1) return { data: null, error: dbError('Multiple rows for maybeSingle', 'PGRST116') }
        options.afterSelect?.(this)
        return { data: this.single ? data[0] ?? null : data, error: null }
      }
      const next = structuredClone(current)
      try {
        if (this.operation === 'upsert') {
          assert.equal(this.config.onConflict, 'source,source_id')
          const statementKeys = new Set()
          for (const payload of this.payload) {
            const key = JSON.stringify([payload.source, payload.source_id])
            if (statementKeys.has(key)) throw dbError('ON CONFLICT cannot affect a row a second time', '21000')
            statementKeys.add(key)
            const existing = next.find(row => row.source === payload.source && row.source_id === payload.source_id)
            if (existing) Object.assign(existing, structuredClone(payload))
            else next.push(structuredClone(payload))
          }
        } else {
          assert.equal(this.operation, 'update')
          for (let index = 0; index < current.length; index++) if (selected.includes(current[index])) Object.assign(next[index], structuredClone(this.payload))
        }
        if (this.table === TABLE) assertCatalogConstraints(next)
        options.beforeCommit?.(this)
        if (this.signal?.aborted) throw new DOMException('Aborted', 'AbortError')
        tables[this.table] = next
        mutations.push({ table: this.table, operation: this.operation, payload: structuredClone(this.payload) })
        return { data: null, error: null, count: this.config.count === 'exact' ? selected.length : null }
      } catch (error) {
        return { data: null, error, count: 0 }
      }
    }
    then(resolve, reject) { return this.execute().then(resolve, reject) }
  }
  return { tables, calls, mutations, from: table => new Query(table) }
}

const cases = []
const test = (name, action) => cases.push({ name, action })

test('Lever and Greenhouse records reach personalized results with source identity and declared constraints', async () => {
  const jobs = [normalized(fintual), normalized(cabify)]
  const db = memoryDb()
  assert.deepEqual(await upsertVerifiedOpportunities(db, jobs, { now: NOW }), { upserted: 2, invalidated: 0, rejected: 0 })
  const rows = await readVerifiedOpportunities(db, 100, { now: NOW })
  assert.equal(rows.length, 2)
  for (const row of rows) {
    assert.equal(row.category_key, 'risk')
    assert.equal(row.region, 'Metropolitana')
    assert.equal(row.work_mode, 'hybrid')
    assert.ok(Array.isArray(row.requirements) && Array.isArray(row.skills))
    assert.ok(!/[<>]/.test(row.description))
    assert.equal(row.last_verified_at, NOW.toISOString())
  }
  assert.deepEqual(rows.find(row => row.source === 'lever').requirements, ['Análisis de riesgo', 'Excel avanzado'])
  const matching = { targetRoles: ['Analista de crédito'], breadth: 'precise', locations: ['Metropolitana'], workModes: ['hybrid'] }
  assert.equal(filterOpportunities(rows, matching).length, 2)
  assert.equal(filterOpportunities(rows, { ...matching, locations: ['Biobío'] }).length, 0)
  assert.equal(filterOpportunities(rows, { ...matching, workModes: ['remote'] }).length, 0)
  assert.equal(filterOpportunities(rows, { ...matching, targetRoles: ['Gerente de crédito'] }).length, 0)
})

test('country-only Chile and unknown mode remain unknown in region-specific and mode-specific searches', async () => {
  const countryOnly = normalized(fintual, { categories: { location: '' }, workplaceType: undefined })
  const db = memoryDb()
  await upsertVerifiedOpportunities(db, [countryOnly], { now: NOW })
  const rows = await readVerifiedOpportunities(db, 100, { now: NOW })
  assert.equal(rows[0].location, 'Chile')
  assert.equal(rows[0].region, null)
  assert.equal(rows[0].work_mode, null)
  assert.equal(filterOpportunities(rows).length, 1)
  assert.equal(filterOpportunities(rows, { locations: ['Metropolitana'] }).length, 0)
  assert.equal(filterOpportunities(rows, { workModes: ['remote'] }).length, 0)
})

test('explicit exclusions of Chile never enter the inventory as Chile-eligible remote vacancies', async () => {
  for (const location of [
    'Remote - Latin America (not available in Chile)',
    'Remote LATAM, excluding applicants from Chile',
  ]) {
    const result = normalizeEmployerJob(cabify, providerRecord(cabify, {
      location: { name: location }, content: 'This position is fully remote. Oferta sintética de QA.',
    }), NOW.toISOString())
    assert.notEqual(result.kind, 'accepted', 'Geographical exclusion must prevail: ' + location)
  }
})

test('negated or historical hybrid mentions do not contaminate hybrid-only matching', async () => {
  const onsite = normalized(cabify, {
    id: 900201, location: { name: 'Presencial - Santiago, Chile' },
    content: 'No ofrecemos modalidad híbrida. Modalidad presencial.',
  })
  const remote = normalized(cabify, {
    id: 900202, content: 'Experience working in a hybrid environment. This position is fully remote.',
  })
  assert.ok([null, 'onsite'].includes(onsite.workMode), 'A negated hybrid mode is not an offered mode')
  assert.ok([null, 'remote'].includes(remote.workMode), 'Prior experience must not override the offered mode')
  const db = memoryDb()
  await upsertVerifiedOpportunities(db, [onsite, remote], { now: NOW })
  const rows = await readVerifiedOpportunities(db, 100, { now: NOW })
  assert.equal(rows.length, 2)
  assert.equal(filterOpportunities(rows, { workModes: ['hybrid'] }).length, 0)
})

test('equal provider job IDs in distinct employer boards cannot collide', async () => {
  const jobs = [normalized(fintual), normalized(apply), normalized(cabify), normalized(checkr)]
  const db = memoryDb()
  assert.equal((await upsertVerifiedOpportunities(db, jobs, { now: NOW })).upserted, 4)
  const rows = await readVerifiedOpportunities(db, 100, { now: NOW })
  assert.equal(rows.length, 4)
  assert.equal(new Set(rows.map(row => row.original_url)).size, 4)
  assert.equal(new Set(rows.map(row => row.source + ':' + row.source_id)).size, 4)
})

test('exact duplicates are idempotent without merging different jobs that share a title', async () => {
  const job = normalized(fintual)
  const other = normalized(fintual, { id: UUID2 })
  const db = memoryDb()
  const result = await upsertVerifiedOpportunities(db, [job, structuredClone(job), other], { now: NOW })
  assert.deepEqual(result, { upserted: 2, invalidated: 0, rejected: 0 })
  await upsertVerifiedOpportunities(db, [job, other], { now: NOW })
  assert.equal(db.tables[TABLE].length, 2)
})

test('both index write and read independently reject forged source URLs and mismatched board identities', async () => {
  const job = normalized(fintual)
  const gh = normalized(cabify)
  const bad = [
    { ...job, originalUrl: 'https://jobs.lever.co/' + fintual.board + '/' + UUID2 },
    { ...job, originalUrl: 'https://jobs.lever.co/' + apply.board + '/' + UUID },
    { ...job, sourceId: 'unreviewed:' + UUID, originalUrl: 'https://jobs.lever.co/unreviewed/' + UUID },
    { ...job, originalUrl: 'https://jobs.lever.co.evil.example/' + fintual.board + '/' + UUID },
    { ...job, originalUrl: job.originalUrl + '?redirect=https://evil.example/' },
    { ...job, originalUrl: job.originalUrl + '#apply' },
    { ...job, originalUrl: job.originalUrl.replace('https:', 'http:') },
    { ...job, originalUrl: job.originalUrl.replace('jobs.lever.co', 'user@jobs.lever.co') },
    { ...job, originalUrl: job.originalUrl.replace('jobs.lever.co', 'jobs.lever.co:443') },
    { ...job, source: 'greenhouse' },
    { ...gh, sourceId: 'chile:900101' },
    { ...gh, originalUrl: 'https://boards-api.greenhouse.io/v1/boards/cabify/jobs/900101' },
    { ...gh, source: 'unreviewed' },
  ]
  const db = memoryDb()
  assert.deepEqual(await upsertVerifiedOpportunities(db, bad, { now: NOW }), { upserted: 0, invalidated: 0, rejected: bad.length })
  assert.equal(db.mutations.length, 0)
  for (const unsafe of bad) {
    const seeded = memoryDb([rowOf(unsafe)])
    assert.deepEqual(await readVerifiedOpportunities(seeded, 100, { now: NOW }), [])
    assert.equal(seeded.mutations.length, 0)
  }
})

test('the supported Greenhouse host aliases keep one canonical provider identity', async () => {
  const job = normalized(cabify)
  const alias = { ...job, originalUrl: job.originalUrl.replace('job-boards.', 'boards.') }
  const db = memoryDb()
  assert.equal((await upsertVerifiedOpportunities(db, [job, alias], { now: NOW })).upserted, 1)
  assert.equal((await readVerifiedOpportunities(db, 100, { now: NOW })).length, 1)
})

test('future, invalid and older-than-TTL verification clocks never create fresh vacancies', async () => {
  for (const timestamp of [new Date(NOW.getTime() + 1).toISOString(), 'invalid-time', new Date(NOW.getTime() - OPPORTUNITY_FRESHNESS_MS - 1).toISOString()]) {
    const job = { ...normalized(fintual), lastVerifiedAt: timestamp }
    const empty = memoryDb()
    assert.equal((await upsertVerifiedOpportunities(empty, [job], { now: NOW })).upserted, 0)
    assert.equal(empty.tables[TABLE].length, 0)
    const db = memoryDb([rowOf(job)])
    const result = await upsertVerifiedOpportunities(db, [job], { now: NOW })
    assert.equal(result.invalidated, 1)
    assert.equal(db.tables[TABLE][0].verification_status, 'unknown')
    assert.equal(db.tables[TABLE][0].last_verified_at, OLD)
  }
  const exact = { ...normalized(fintual), lastVerifiedAt: new Date(NOW.getTime() - OPPORTUNITY_FRESHNESS_MS).toISOString() }
  const db = memoryDb()
  assert.equal((await upsertVerifiedOpportunities(db, [exact], { now: NOW })).upserted, 1)
})

test('expired or malformed deadlines invalidate the existing job without moving its verification clock', async () => {
  for (const [deadline, expected] of [['2026-10-07T19:59:59Z', 'stale'], ['2026-02-31T12:00:00Z', 'unknown']]) {
    const original = normalized(cabify)
    const db = memoryDb([rowOf(original)])
    const result = await upsertVerifiedOpportunities(db, [{ ...original, expiresAt: deadline }], { now: NOW })
    assert.deepEqual(result, { upserted: 0, invalidated: 1, rejected: 0 })
    assert.equal(db.tables[TABLE][0].verification_status, expected)
    assert.equal(db.tables[TABLE][0].last_verified_at, OLD)
    assert.deepEqual(await readVerifiedOpportunities(db, 100, { now: NOW }), [])
  }
  const future = normalized(cabify, { application_deadline: '2026-10-08T00:00:00Z' })
  const db = memoryDb()
  assert.equal((await upsertVerifiedOpportunities(db, [future], { now: NOW })).upserted, 1)
})

test('read freshness and expiry checks prevent legacy future and expired rows from reaching matching', async () => {
  const fresh = normalized(fintual)
  const rows = [
    rowOf(fresh),
    rowOf(normalized(apply), { last_verified_at: new Date(NOW.getTime() + 1).toISOString() }),
    rowOf(normalized(cabify), { last_verified_at: new Date(NOW.getTime() - OPPORTUNITY_FRESHNESS_MS - 1).toISOString() }),
    rowOf(normalized(checkr), { expires_at: '2026-10-01T12:00:00Z' }),
  ]
  const db = memoryDb(rows)
  const before = structuredClone(db.tables[TABLE])
  const readable = await readVerifiedOpportunities(db, 100, { now: NOW })
  assert.deepEqual(readable.map(row => row.source_id), [fresh.sourceId])
  assert.equal(filterOpportunities(readable, { targetRoles: ['Analista de crédito'] }).length, 1)
  assert.deepEqual(db.tables[TABLE], before)
})

test('catalog reads project matching fields without provider payloads or write bookkeeping', async () => {
  const input = rowOf(normalized(fintual), {
    source_payload: { synthetic: 'payload not needed by catalog or matching' },
    id: 'synthetic-internal-row-id',
    description: 'Oferta sintética de QA: evaluar riesgo y preparar informes de crédito.',
  })
  const db = memoryDb([input])
  const before = structuredClone(db.tables[TABLE])
  const [result] = await readVerifiedOpportunities(db, 100, { now: NOW })
  const columns = db.calls[0].columns.split(',')
  assert.ok(!columns.includes('*') && !columns.includes('source_payload'))
  assert.equal(Object.hasOwn(result, 'source_payload'), false)
  assert.equal(Object.hasOwn(result, 'updated_at'), false)
  assert.equal(Object.hasOwn(result, 'id'), false)
  for (const field of ['source', 'source_id', 'original_url', 'title', 'company', 'published_at', 'expires_at', 'verification_status', 'last_verified_at', 'description', 'requirements', 'skills']) {
    assert.deepEqual(result[field], input[field], field + ' must preserve the public/matching value')
  }
  assert.equal(result.region, 'Metropolitana')
  assert.equal(result.category_key, 'risk')
  assert.equal(result.work_mode, 'hybrid')
  assert.equal(filterOpportunities([result], { targetRoles: ['Analista de crédito'], locations: ['Metropolitana'], workModes: ['hybrid'] }).length, 1)
  assert.deepEqual(db.tables[TABLE], before)
  assert.equal(db.mutations.length, 0)
})

test('restricted verification maps to the database unknown state and retains historical evidence', async () => {
  const job = normalized(fintual)
  for (const viaUpsert of [false, true]) {
    const db = memoryDb([rowOf(job)])
    const before = structuredClone(db.tables[TABLE][0])
    const result = viaUpsert
      ? (await upsertVerifiedOpportunities(db, [{ ...job, verificationStatus: 'verified_restricted' }], { now: NOW })).invalidated
      : await invalidateOpportunityVerifications(db, job.source, [{ sourceId: job.sourceId, verificationStatus: 'verified_restricted' }], { now: NOW })
    assert.equal(result, 1)
    const after = db.tables[TABLE][0]
    assert.equal(after.verification_status, 'unknown')
    assert.deepEqual(after, { ...before, verification_status: 'unknown', updated_at: NOW.toISOString() })
    assert.deepEqual(await readVerifiedOpportunities(db, 100, { now: NOW }), [])
  }
})

test('a negative observation wins over an active duplicate in the same ingestion batch', async () => {
  const job = normalized(fintual)
  const db = memoryDb([rowOf(job)])
  const result = await upsertVerifiedOpportunities(db, [job, { ...job, verificationStatus: 'unavailable' }, job], { now: NOW })
  assert.deepEqual(result, { upserted: 0, invalidated: 1, rejected: 0 })
  assert.equal(db.tables[TABLE][0].verification_status, 'unavailable')
  assert.equal(db.tables[TABLE][0].last_verified_at, OLD)
})

test('a complete snapshot withdraws absent jobs only within its employer and preserves observed jobs', async () => {
  const kept = normalized(fintual)
  const withdrawn = normalized(fintual, { id: UUID2 })
  const others = [normalized(apply), normalized(cabify), normalized(checkr)]
  const db = memoryDb([kept, withdrawn, ...others].map(job => rowOf(job)))
  const count = await reconcileEmployerSnapshot(db, snapshot(fintual, [kept]), { now: NOW })
  assert.equal(count, 1)
  assert.deepEqual(db.tables[TABLE].filter(row => row.verification_status === 'stale').map(row => row.source_id), [withdrawn.sourceId])
  assert.ok(db.tables[TABLE].every(row => row.last_verified_at === OLD))
  const results = await readVerifiedOpportunities(db, 100, { now: NOW })
  assert.equal(results.length, 4)
  assert.ok(results.some(row => row.source_id === kept.sourceId))
})

test('a complete empty snapshot retires only that employer and never changes already unknown evidence', async () => {
  const staleCandidate = normalized(cabify)
  const alreadyUnknown = normalized(cabify, { id: 900102 })
  const elsewhere = [normalized(checkr), normalized(fintual)]
  const db = memoryDb([
    rowOf(staleCandidate), rowOf(alreadyUnknown, { verification_status: 'unknown' }),
    ...elsewhere.map(job => rowOf(job)),
  ])
  const unknownBefore = structuredClone(db.tables[TABLE][1])
  assert.equal(await reconcileEmployerSnapshot(db, snapshot(cabify), { now: NOW }), 1)
  assert.equal(db.tables[TABLE][0].verification_status, 'stale')
  assert.deepEqual(db.tables[TABLE][1], unknownBefore)
  assert.ok(db.tables[TABLE].slice(2).every(row => row.verification_status === 'verified_active'))
})

test('failure, cooldown, parse error and incomplete snapshots can never retire cached jobs', async () => {
  for (const outcome of ['partial', 'unavailable', 'parse_failed', 'rate_limited', 'cooldown', 'ok', 'no_matches']) {
    const job = normalized(fintual)
    const db = memoryDb([rowOf(job), rowOf(normalized(cabify))])
    const before = structuredClone(db.tables[TABLE])
    const result = snapshot(fintual, [], { outcome, completeSnapshot: !['ok', 'no_matches'].includes(outcome) })
    assert.equal(await reconcileEmployerSnapshot(db, result, { now: NOW }), 0)
    assert.deepEqual(db.tables[TABLE], before)
    assert.equal(db.calls.length, 0)
  }
})

test('inconsistent complete snapshot counts and invalid identities are rejected before any retirement', async () => {
  const job = normalized(fintual)
  const invalid = [
    snapshot(fintual, [], { board: 'fintual%', boardKey: 'lever:fintual%' }),
    snapshot(fintual, [], { boardKey: 'greenhouse:fintual' }),
    snapshot(fintual, [], { observedSourceIds: [normalized(apply).sourceId] }),
    snapshot(fintual, [], { observedSourceIds: ['fintual:not-a-provider-id'], accepted: 1, returned: 1, received: 1 }),
    snapshot(fintual, [], { accepted: 1, received: 1, returned: 1 }),
    snapshot(fintual, [job], { returned: 0 }),
    snapshot(fintual, [job], { received: 0 }),
    snapshot(fintual, [job], { rejected: 1, received: 2 }),
    snapshot(fintual, [job], { outcome: 'no_matches' }),
    snapshot(fintual, [job], { observedSourceIds: [job.sourceId, job.sourceId], accepted: 2, returned: 2, received: 2 }),
  ]
  for (const result of invalid) {
    const db = memoryDb([rowOf(job), rowOf(normalized(cabify))])
    const before = structuredClone(db.tables[TABLE])
    await assert.rejects(reconcileEmployerSnapshot(db, result, { now: NOW }))
    assert.deepEqual(db.tables[TABLE], before)
    assert.equal(db.mutations.length, 0)
  }
})

test('pre-cancelled writes and cancellation after reconciliation read leave the catalog untouched', async () => {
  const job = normalized(fintual)
  const abort = new AbortController()
  abort.abort()
  for (const action of [
    db => upsertVerifiedOpportunities(db, [job], { now: NOW, signal: abort.signal }),
    db => invalidateOpportunityVerifications(db, job.source, [{ sourceId: job.sourceId, verificationStatus: 'stale' }], { now: NOW, signal: abort.signal }),
    db => reconcileEmployerSnapshot(db, snapshot(fintual), { now: NOW, signal: abort.signal }),
  ]) {
    const db = memoryDb([rowOf(job)])
    const before = structuredClone(db.tables[TABLE])
    await assert.rejects(action(db), { name: 'AbortError' })
    assert.deepEqual(db.tables[TABLE], before)
    assert.equal(db.mutations.length, 0)
    assert.equal(db.calls.length, 0, 'Pre-cancelled operations must not reach the database')
  }
  const duringRead = new AbortController()
  const db = memoryDb([rowOf(job)], { afterSelect() { duringRead.abort() } })
  const before = structuredClone(db.tables[TABLE])
  await assert.rejects(reconcileEmployerSnapshot(db, snapshot(fintual), { now: NOW, signal: duringRead.signal }), /Aborted/)
  assert.deepEqual(db.tables[TABLE], before)
  assert.equal(db.mutations.length, 0)
  assert.equal(db.calls.filter(call => call.operation === 'update').length, 0)
})

test('database read or update errors propagate without falsely reporting withdrawals', async () => {
  const job = normalized(fintual)
  for (const failOperation of ['select', 'update']) {
    const db = memoryDb([rowOf(job)], { failOperation })
    const before = structuredClone(db.tables[TABLE])
    await assert.rejects(reconcileEmployerSnapshot(db, snapshot(fintual), { now: NOW }), error => {
      if (failOperation === 'select') {
        assert.equal(error instanceof OpportunityPersistenceError, false, 'A failed read confirms no persistence attempt')
        assert.equal(error.code, 'XX000')
      } else {
        assert.ok(error instanceof OpportunityPersistenceError)
        assert.deepEqual(error.confirmed, { upserted: 0, invalidated: 0, rejected: 0 })
        assert.ok(Object.isFrozen(error.confirmed))
        assert.equal(error.message, 'Opportunity persistence did not complete')
        assert.equal(Object.hasOwn(error, 'cause'), false)
        assert.equal(JSON.stringify(error).includes('Synthetic database failure'), false)
      }
      return true
    })
    assert.deepEqual(db.tables[TABLE], before)
    assert.equal(db.mutations.length, 0)
  }
})

test('cancellation at a write boundary reports zero confirmed changes and does not proceed to another write', async () => {
  const job = normalized(fintual)
  for (const invalidate of [false, true]) {
    const controller = new AbortController()
    const db = memoryDb([rowOf(job)], { beforeCommit: () => controller.abort() })
    const before = structuredClone(db.tables[TABLE])
    const action = invalidate
      ? invalidateOpportunityVerifications(db, job.source, [{ sourceId: job.sourceId, verificationStatus: 'stale' }], { now: NOW, signal: controller.signal })
      : upsertVerifiedOpportunities(db, [job], { now: NOW, signal: controller.signal })
    await assert.rejects(action, error => {
      assert.ok(error instanceof OpportunityPersistenceError)
      assert.deepEqual(error.confirmed, { upserted: 0, invalidated: 0, rejected: 0 })
      assert.equal(Object.hasOwn(error, 'cause'), false)
      return true
    })
    assert.deepEqual(db.tables[TABLE], before)
    assert.equal(db.mutations.length, 0)
    assert.equal(db.calls.length, 1)
  }
})

function primaryBatch() {
  return {
    source: 'chiletrabajos', fetchedAt: NOW.toISOString(), listingUrl: 'https://www.chiletrabajos.cl/encuentra-un-empleo',
    jobs: [], verifiedJobs: [], failedJobs: [],
    diagnostics: { outcome: 'no_matches', discovered: 0, probed: 0, active: 0, returned: 0 },
  }
}

async function runCron(db, employers, leaseOverrides = {}) {
  const completed = []
  const response = await runOpportunityRefreshCron(new Request('https://dtc.test/api/cron/a4-opportunities', {
    headers: { authorization: 'Bearer ' + SECRET },
  }), {
    env: { VERCEL_ENV: 'production', CRON_SECRET: SECRET },
    createDb: () => db, now: () => NOW,
    acquireLease: async () => ({
      status: 'acquired', slot: 0, owns: async () => true,
      complete: async (success, summary) => completed.push({ success, summary }),
      ...leaseOverrides,
    }),
    readChileCandidates: async () => [],
    fetchChileBatch: async () => primaryBatch(),
    fetchGetOnBoard: async () => { assert.fail('Slot 0 must not query Get on Board') },
    fetchEmployerBatch: async () => employers,
  })
  return { response, body: await response.json(), completed }
}

test('the real cron persists verified employer jobs and reconciles a complete snapshot in one run', async () => {
  const job = normalized(fintual)
  const absent = normalized(fintual, { id: UUID2 })
  const otherBoard = normalized(cabify)
  const db = memoryDb([rowOf(absent), rowOf(otherBoard)])
  const { response, body, completed } = await runCron(db, { jobs: [job], boards: [snapshot(fintual, [job])] })
  assert.equal(response.status, 200)
  assert.equal(body.success, true)
  assert.equal(body.upserted, 1)
  assert.equal(body.invalidated, 1)
  assert.equal(completed.length, 1)
  assert.equal(completed[0].success, true)
  const rows = await readVerifiedOpportunities(db, 100, { now: NOW })
  assert.deepEqual(new Set(rows.map(row => row.source_id)), new Set([job.sourceId, otherBoard.sourceId]))
  assert.equal(filterOpportunities(rows, { locations: ['Metropolitana'], workModes: ['hybrid'] }).length, 2)
  assert.equal(JSON.stringify(body).includes('Oferta sintética'), false, 'The scheduler ledger must not carry job descriptions')
})

test('a partial employer response can add valid jobs but cannot retire earlier ones or hide provider failure', async () => {
  const job = normalized(fintual)
  const previous = normalized(fintual, { id: UUID2 })
  const db = memoryDb([rowOf(previous), rowOf(normalized(cabify))])
  const board = snapshot(fintual, [job], { outcome: 'partial', completeSnapshot: false, rejected: 1, received: 2 })
  const { response, body, completed } = await runCron(db, { jobs: [job], boards: [board] })
  assert.equal(response.status, 503)
  assert.equal(body.outcome, 'partial')
  assert.equal(body.upserted, 1)
  assert.equal(body.invalidated, 0)
  assert.equal(body.source_errors['lever:fintual'], 'PROVIDER_UNAVAILABLE')
  assert.ok(db.tables[TABLE].every(row => row.verification_status === 'verified_active'))
  assert.equal(completed[0].success, false)
})

test('the real cron loses write permission with its lease before employer insertion or withdrawal', async () => {
  const job = normalized(fintual)
  const db = memoryDb([rowOf(normalized(fintual, { id: UUID2 }))])
  const before = structuredClone(db.tables[TABLE])
  const { response, body, completed } = await runCron(db, { jobs: [job], boards: [snapshot(fintual, [job])] }, { owns: async () => false })
  assert.equal(response.status, 503)
  assert.equal(body.error, 'LEASE_LOST')
  assert.deepEqual(db.tables[TABLE], before)
  assert.equal(db.mutations.length, 0)
  assert.equal(completed[0].success, false)
})

let failures = 0
for (const { name, action } of cases) {
  try { await action() } catch (error) {
    failures++
    console.error(JSON.stringify({ test: name, error: error.message, stack: error.stack }))
  }
}
console.log(JSON.stringify({ employer_index: failures ? 'failed' : 'passed', cases: cases.length, passed: cases.length - failures, failed: failures, database: 'constraint-enforcing PostgREST memory; no production access' }))
if (failures) process.exitCode = 1
