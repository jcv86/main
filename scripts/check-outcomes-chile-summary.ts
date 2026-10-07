import assert from 'node:assert/strict'
import { createClient } from '@supabase/supabase-js'
import { loadOutcomesChileSummary, loadOwnedOutcomeRows } from '../lib/outcomes-chile/service'
import type { ChileBenchmarkRequest } from '../lib/outcomes-chile/benchmark-selector'

const USER = '00000000-0000-4000-8000-000000000001'
const CUTOFF = '2026-10-07T13:00:00.000Z'
type Reply = { data: unknown; count?: number | null; status?: number }

function database(reply: (table: string, offset: number, limit: number, call: number) => Reply) {
  const requests: URL[] = []
  const db = createClient('https://dtc-summary-test.invalid', 'test-only-key', {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: async (input, init) => {
      const url = new URL(typeof input === 'string' ? input : input instanceof URL ? input.href : input.url)
      assert.equal(url.hostname, 'dtc-summary-test.invalid')
      assert.equal(init?.method ?? 'GET', 'GET')
      assert.equal(url.searchParams.get('user_id'), 'eq.' + USER)
      assert.equal(url.searchParams.get('created_at'), 'lte.' + CUTOFF)
      assert.equal(url.searchParams.get('order'), 'created_at.asc,id.asc')
      assert.ok(new Headers(init?.headers).get('prefer')?.includes('count=exact'))
      const offset = Number(url.searchParams.get('offset') ?? 0)
      const limit = Number(url.searchParams.get('limit'))
      assert.equal(limit, 500)
      requests.push(url)
      const response = reply(url.pathname.split('/').pop()!, offset, limit, requests.length)
      const headers = new Headers({ 'Content-Type': 'application/json' })
      if (response.count !== undefined && response.count !== null) {
        const length = Array.isArray(response.data) ? response.data.length : 0
        headers.set('Content-Range', length ? `${offset}-${offset + length - 1}/${response.count}` : `*/${response.count}`)
      }
      return new Response(JSON.stringify(response.data), { status: response.status ?? 200, headers })
    } },
  })
  return { db, requests }
}

async function main() {
  const rows = Array.from({ length: 1201 }, (_, i) => ({ id: `event-${i}` }))
  const paginated = database((_table, offset, limit) => ({ data: rows.slice(offset, offset + limit), count: rows.length }))
  assert.equal((await loadOwnedOutcomeRows(paginated.db, 'dtc_job_search_events', 'id', USER, CUTOFF)).length, 1201)
  assert.deepEqual(paginated.requests.map((url) => url.searchParams.get('offset')), ['0', '500', '1000'])

  // A configured server cap below our requested size still gets every row.
  const capped = database((_table, offset) => ({ data: rows.slice(offset, offset + 100), count: rows.length }))
  assert.equal((await loadOwnedOutcomeRows(capped.db, 'dtc_job_search_events', 'id', USER, CUTOFF)).length, 1201)
  assert.equal(capped.requests.length, 13)

  const errorCases: Array<[string, (table: string, offset: number) => Reply, RegExp]> = [
    ['missing schema', () => ({ data: { code: 'PGRST205', message: 'table absent' }, status: 404 }), /OUTCOMES_CHILE_NOT_READY/],
    ['database read error', () => ({ data: { code: '42501', message: 'fixture detail must not escape' }, status: 400 }), /OUTCOMES_CHILE_READ_FAILED/],
    ['missing count', () => ({ data: [] }), /OUTCOMES_CHILE_INCOMPLETE_READ/],
    ['empty partial page', (_table, offset) => ({ data: offset ? [] : rows.slice(0, 500), count: 1201 }), /OUTCOMES_CHILE_INCOMPLETE_READ/],
    ['changing snapshot', (_table, offset) => ({ data: rows.slice(offset, offset + 500), count: offset ? 1200 : 1201 }), /OUTCOMES_CHILE_SNAPSHOT_CHANGED/],
    ['duplicate rows', () => ({ data: [{ id: 'duplicate' }, { id: 'duplicate' }], count: 2 }), /OUTCOMES_CHILE_INCOMPLETE_READ/],
    ['explicit maximum', () => ({ data: rows.slice(0, 500), count: 20001 }), /OUTCOMES_CHILE_READ_LIMIT/],
  ]
  for (const [name, responder, error] of errorCases) {
    const mock = database(responder)
    await assert.rejects(loadOwnedOutcomeRows(mock.db, 'dtc_job_search_events', 'id', USER, CUTOFF), error, name)
  }

  const record = { created_at: '2026-10-01T12:00:00Z', verification_status: 'self_reported' }
  const data: Record<string, unknown[]> = {
    dtc_job_search_events: [{ ...record, id: 'application', event_type: 'application', occurred_at: '2026-08-15T12:00:00Z' }],
    dtc_employment_outcomes: [{ ...record, id: 'job', role_title: 'Analista', outcome_type: 'job_started', effective_date: '2026-09-01', region_code: '13', occupation_code: '2411', employment_category: 'private_employee' }],
    dtc_salary_outcomes: [
      { ...record, id: 'baseline', measurement_role: 'baseline', monthly_net_clp: 900000, measured_at: '2026-08-01', employment_outcome_id: null },
      { ...record, id: 'latest', measurement_role: 'new_role', monthly_net_clp: 1200000, measured_at: '2026-10-01', employment_outcome_id: 'job' },
    ],
    dtc_outcome_followups: [],
  }
  const mock = database((table) => ({ data: data[table], count: data[table].length }))
  let benchmarkRequest: ChileBenchmarkRequest | null = null
  const summary = await loadOutcomesChileSummary(USER, {
    db: mock.db, now: new Date(CUTOFF),
    resolveBenchmark: async (request) => { benchmarkRequest = request; return null },
  })
  assert.equal(mock.requests.length, 4)
  assert.equal(summary.economic.monthlyLiftClp, 300000)
  assert.equal(summary.impact.delta.versusBaseline.percent, 33.33)
  assert.equal(summary.impact.delta.versusBenchmark.reason, 'benchmark_unavailable')
  assert.equal(summary.timeToJobDays, 17)
  assert.deepEqual(benchmarkRequest, {
    metricKey: 'monthly_labor_income_median', asOf: '2026-10-01', regionCode: '13', occupationCode: '2411', employmentCategory: 'private_employee',
  })
  assert.equal(summary.attribution, 'observed_not_causal')
  assert.equal(summary.workspace.employmentOptions[0].roleTitle, 'Analista')
  assert.equal(summary.workspace.historyCount, 4)
  assert.equal(summary.workspace.asOfDate, '2026-10-07')
  assert.ok(mock.requests.find((url) => url.pathname.endsWith('/dtc_employment_outcomes'))?.searchParams.get('select')?.split(',').includes('role_title'))
  assert.ok(mock.requests.find((url) => url.pathname.endsWith('/dtc_job_search_events'))?.searchParams.get('select')?.split(',').includes('target_role'))
  assert.deepEqual(summary.funnel, summary.impact.observed.jobSearch)
  assert.deepEqual(summary.economic, { ...summary.impact.observed.economic, annualizedLiftClp: summary.impact.projection.annualizedLiftClp })

  // The latest job is not assumed to explain an unlinked salary measurement.
  data.dtc_salary_outcomes[1] = { ...(data.dtc_salary_outcomes[1] as object), employment_outcome_id: null }
  await loadOutcomesChileSummary(USER, { db: mock.db, now: new Date(CUTOFF), resolveBenchmark: async (request) => {
    assert.equal(request.regionCode, null)
    assert.equal(request.occupationCode, null)
    assert.equal(request.employmentCategory, null)
    return null
  } })
  console.log(JSON.stringify({ outcomesChileSummary: 'PASS', queryTransport: 'real-sdk-with-synthetic-fetch', networkRequests: 0, ownerScope: true, paginationBeyond1000: true, incompleteReadsFailClosed: true, liveDatabase: false }))
}

main().catch((error) => { console.error(error); process.exitCode = 1 })
