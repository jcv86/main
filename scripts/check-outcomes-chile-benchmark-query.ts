import assert from 'node:assert/strict'
import { createClient } from '@supabase/supabase-js'
import { resolveChileBenchmark } from '../lib/outcomes-chile/benchmark-resolver'
import type { ChileBenchmarkRequest, ChileBenchmarkRow } from '../lib/outcomes-chile/benchmark-selector'

const request: ChileBenchmarkRequest = {
  metricKey: 'monthly_labor_income_median',
  regionCode: '13',
  occupationCode: 'fixture-occupation',
  educationLevel: 'fixture-education',
  employmentCategory: 'private_employee',
  industryCode: 'fixture-industry',
  asOf: '2026-10-07',
}

// Synthetic transport fixtures only. No official data, network or credentials.
function row(index: number, changes: Partial<ChileBenchmarkRow> = {}): ChileBenchmarkRow {
  return {
    id: `fixture-${String(index).padStart(5, '0')}`,
    source_key: 'ine_esi',
    source_period: '2025',
    metric_key: 'monthly_labor_income_median',
    region_code: null,
    occupation_code: null,
    education_level: null,
    employment_category: null,
    industry_code: null,
    value_numeric: 1000,
    unit: 'clp_month',
    sample_size: 100,
    reliability_status: 'official_published',
    source_ref: 'urn:dtc:test-fixture:income',
    published_at: '2026-06-01',
    ...changes,
  }
}

type RecordedRequest = { url: URL; method: string; headers: Headers }
type PageReply = { body: unknown; count?: number | null; status?: number }

function database(reply: (request: RecordedRequest, index: number) => PageReply) {
  const requests: RecordedRequest[] = []
  const db = createClient('https://dtc-benchmark-test.invalid', 'test-only-key', {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: async (input, init) => {
        const url = new URL(typeof input === 'string' ? input : input instanceof URL ? input.href : input.url)
        assert.equal(url.hostname, 'dtc-benchmark-test.invalid')
        const recorded = { url, method: init?.method ?? 'GET', headers: new Headers(init?.headers) }
        requests.push(recorded)
        const result = reply(recorded, requests.length - 1)
        const headers = new Headers({ 'Content-Type': 'application/json' })
        if (result.count !== undefined && result.count !== null) {
          const offset = Number(url.searchParams.get('offset'))
          const length = Array.isArray(result.body) ? result.body.length : 0
          headers.set('Content-Range', `${length ? `${offset}-${offset + length - 1}` : '*'}/${result.count}`)
        }
        return new Response(JSON.stringify(result.body), { status: result.status ?? 200, headers })
      },
    },
  })
  return { db, requests }
}

function dataset(rows: ChileBenchmarkRow[]) {
  return database(({ url }) => {
    const offset = Number(url.searchParams.get('offset'))
    const limit = Number(url.searchParams.get('limit'))
    return { body: rows.slice(offset, offset + limit), count: rows.length }
  })
}

function assertQuery(actual: RecordedRequest, offset: number) {
  assert.equal(actual.method, 'GET', 'Benchmark resolution is read-only')
  assert.equal(actual.url.pathname, '/rest/v1/dtc_chile_benchmarks')
  assert.equal(actual.url.searchParams.get('metric_key'), 'eq.monthly_labor_income_median')
  assert.equal(actual.url.searchParams.get('published_at'), 'lte.2026-10-07')
  assert.equal(actual.url.searchParams.get('reliability_status'), 'in.(official_published,official_microdata_derived)')
  assert.equal(actual.url.searchParams.get('order'), 'id.asc')
  assert.equal(actual.url.searchParams.get('offset'), String(offset))
  assert.equal(actual.url.searchParams.get('limit'), '500')
  assert.ok(actual.headers.get('Prefer')?.includes('count=exact'))
  const selected = actual.url.searchParams.get('select')?.split(',') ?? []
  for (const column of ['industry_code', 'employment_category', 'source_period', 'published_at', 'source_ref', 'sample_size', 'reliability_status']) {
    assert.ok(selected.includes(column), `Missing provenance or matching field: ${column}`)
  }
}

async function checkPagination() {
  const specific = row(1200, {
    region_code: '13',
    occupation_code: 'fixture-occupation',
    education_level: 'fixture-education',
    employment_category: 'private_employee',
    industry_code: 'fixture-industry',
  })
  const base = Array.from({ length: 1200 }, (_, index) => row(index))
  const mock = dataset([...base, specific])
  const result = await resolveChileBenchmark(request, mock.db)
  assert.equal(result?.benchmarkId, specific.id, 'A matching row beyond the first 1000 must prevent a false national fallback')
  assert.equal(result?.specificity, 'region_occupation_education')
  assert.equal(result?.asOf, request.asOf)
  assert.equal(mock.requests.length, 3)
  mock.requests.forEach((recorded, index) => assertQuery(recorded, index * 500))

  const fallback = dataset([...base, { ...specific, industry_code: 'other-industry' }])
  const fallbackResult = await resolveChileBenchmark(request, fallback.db)
  assert.equal(fallbackResult?.benchmarkId, base[0].id, 'A late-page industry mismatch still falls back conservatively')
  assert.equal(fallbackResult?.specificity, 'national')
  assert.equal(fallback.requests.length, 3)

  const empty = dataset([])
  assert.equal(await resolveChileBenchmark(request, empty.db), null)
  assert.equal(empty.requests.length, 1)
  const exactPage = dataset(base.slice(0, 500))
  assert.equal((await resolveChileBenchmark(request, exactPage.db))?.benchmarkId, base[0].id)
  assert.equal(exactPage.requests.length, 1, 'Exact count avoids an unnecessary empty page')
}

async function checkIncompleteReads() {
  const firstPage = Array.from({ length: 500 }, (_, index) => row(index))
  const scenarios: Array<{ name: string; error: string; calls: number; reply: (request: RecordedRequest, index: number) => PageReply }> = [
    {
      name: 'server truncation', error: 'CHILE_BENCHMARK_INCOMPLETE_READ', calls: 1,
      reply: () => ({ body: firstPage.slice(0, 100), count: 501 }),
    },
    {
      name: 'empty trailing page', error: 'CHILE_BENCHMARK_INCOMPLETE_READ', calls: 2,
      reply: (_, index) => ({ body: index === 0 ? firstPage : [], count: 501 }),
    },
    {
      name: 'duplicate across pages', error: 'CHILE_BENCHMARK_DATA_CHANGED_RETRY', calls: 2,
      reply: (_, index) => ({ body: index === 0 ? firstPage : [row(499)], count: 501 }),
    },
    {
      name: 'duplicate within page', error: 'CHILE_BENCHMARK_DATA_CHANGED_RETRY', calls: 1,
      reply: () => ({ body: [row(0), row(0)], count: 2 }),
    },
    {
      name: 'changed count', error: 'CHILE_BENCHMARK_DATA_CHANGED_RETRY', calls: 2,
      reply: (_, index) => ({ body: index === 0 ? firstPage : [row(500), row(501)], count: index === 0 ? 501 : 502 }),
    },
    {
      name: 'explicit maximum', error: 'CHILE_BENCHMARK_RESULT_LIMIT_EXCEEDED', calls: 1,
      reply: () => ({ body: firstPage, count: 20001 }),
    },
    {
      name: 'missing exact count', error: 'CHILE_BENCHMARK_COUNT_UNAVAILABLE', calls: 1,
      reply: () => ({ body: [row(0)], count: null }),
    },
  ]
  for (const scenario of scenarios) {
    const mock = database(scenario.reply)
    await assert.rejects(resolveChileBenchmark(request, mock.db), new RegExp(scenario.error), scenario.name)
    assert.equal(mock.requests.length, scenario.calls, `${scenario.name}: never return partial fallback or loop indefinitely`)
    mock.requests.forEach((recorded, index) => assertQuery(recorded, index * 500))
  }

  const unavailable = database(() => ({ body: { code: '42501', message: 'test query unavailable' }, status: 400 }))
  await assert.rejects(resolveChileBenchmark(request, unavailable.db), (error: { code?: string }) => error.code === '42501')
  assert.equal(unavailable.requests.length, 1, 'Query failures must not become an empty successful reference')

  const invalid = database(() => { throw new Error('Invalid cutoff reached the database') })
  await assert.rejects(resolveChileBenchmark({ ...request, asOf: '2026-02-30' }, invalid.db), /INVALID_CHILE_BENCHMARK_AS_OF/)
  assert.equal(invalid.requests.length, 0)
}

async function main() {
  await checkPagination()
  await checkIncompleteReads()
  console.log(JSON.stringify({
    benchmarkQuery: 'PASS',
    transport: 'real-supabase-sdk-with-in-memory-fetch',
    candidateRows: 1201,
    pages: 3,
    conservativeFallbackAcrossPages: true,
    incompleteReadsRejected: true,
    duplicateAndChangingRowsRejected: true,
    explicitMaximum: 20000,
    liveDatabaseWrites: 0,
  }))
}

main().catch((error) => { console.error(error); process.exitCode = 1 })
