import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'
import ts from 'typescript'
import { recordEmploymentOutcome, recordJobSearchEvent, recordSalaryOutcome } from '../lib/outcomes-chile/capture'
import * as validation from '../lib/outcomes-chile/capture-validation'

const USER = '00000000-0000-4000-8000-000000000001'
const OTHER_USER = '00000000-0000-4000-8000-000000000002'
const EMPLOYMENT = '00000000-0000-4000-8000-000000000003'
const event = { eventType: 'interview', occurredAt: '2026-10-07T10:00:00-03:00' }
const employment = { outcomeType: 'job_started', effectiveDate: '2026-10-07', roleTitle: 'Analista' }
const salary = { measurementRole: 'baseline', monthlyNetClp: 850000, measuredAt: '2026-10-07' }

type RecordedRequest = { url: URL; method: string; body: Record<string, unknown> | null }
type MockResponse = { body: unknown; status?: number }

// Use the actual SDK against an in-memory HTTP transport. No credentials,
// external requests or database writes are involved in this script.
function database(responses: MockResponse[] = []) {
  const requests: RecordedRequest[] = []
  const remaining = [...responses]
  const db = createClient('https://dtc-capture-test.invalid', 'test-only-key', {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: async (input, init) => {
        const url = new URL(typeof input === 'string' ? input : input instanceof URL ? input.href : input.url)
        assert.equal(url.hostname, 'dtc-capture-test.invalid')
        requests.push({ url, method: init?.method ?? 'GET', body: init?.body ? JSON.parse(String(init.body)) : null })
        const result = remaining.shift()
        assert.ok(result, `unexpected request: ${init?.method} ${url.pathname}`)
        return new Response(JSON.stringify(result.body), {
          status: result.status ?? 200,
          headers: { 'Content-Type': 'application/json' },
        })
      },
    },
  })
  return { db, requests, assertDrained: () => assert.equal(remaining.length, 0) }
}

const invalid = (code: string) => (error: unknown) => error instanceof validation.OutcomeCaptureValidationError && error.message === code

async function checkValidation() {
  const mock = database()
  for (const input of [undefined, null, [], false, 0, 'salary']) {
    await assert.rejects(recordJobSearchEvent(USER, input, mock.db), invalid('INVALID_INPUT'))
    await assert.rejects(recordEmploymentOutcome(USER, input, mock.db), invalid('INVALID_INPUT'))
    await assert.rejects(recordSalaryOutcome(USER, input, mock.db), invalid('INVALID_INPUT'))
  }
  for (const amount of [undefined, null, '', ' ', '850000', true, false, [], {}, NaN, Infinity, -1, 100000001, 850000.5]) {
    await assert.rejects(recordSalaryOutcome(USER, { ...salary, monthlyNetClp: amount }, mock.db), invalid('INVALID_MONTHLY_NET_CLP'))
  }
  for (const date of ['2025-02-29', '2026-02-30', '2026-04-31', '2026-13-01', '2026-01-00', '0000-01-01', '2026-1-07', '2026-10-07T00:00:00Z']) {
    await assert.rejects(recordEmploymentOutcome(USER, { ...employment, effectiveDate: date }, mock.db), invalid('INVALID_EFFECTIVE_DATE'))
    await assert.rejects(recordSalaryOutcome(USER, { ...salary, measuredAt: date }, mock.db), invalid('INVALID_MEASURED_AT'))
  }
  for (const date of ['2025-02-29T10:00:00Z', '2026-02-30T10:00:00Z', '2026-10-07', '2026-10-07T10:00:00', '2026-10-07T24:00:00Z', '2026-10-07T10:60:00Z', '2026-10-07T10:00:60Z', '2026-10-07T10:00:00+24:00', 'October 7, 2026']) {
    await assert.rejects(recordJobSearchEvent(USER, { ...event, occurredAt: date }, mock.db), invalid('INVALID_OCCURRED_AT'))
  }
  for (const id of ['', false, 1, [], {}, 'another-person', EMPLOYMENT + ' ']) {
    await assert.rejects(recordSalaryOutcome(USER, { ...salary, employmentOutcomeId: id }, mock.db), invalid('INVALID_EMPLOYMENT_OUTCOME_ID'))
  }
  await assert.rejects(recordEmploymentOutcome(USER, { ...employment, roleTitle: ' ' }, mock.db), invalid('ROLE_REQUIRED'))
  await assert.rejects(recordEmploymentOutcome(USER, { ...employment, roleTitle: 'x'.repeat(161) }, mock.db), invalid('INVALID_ROLE_TITLE'))
  await assert.rejects(recordEmploymentOutcome(USER, { ...employment, workMode: false }, mock.db), invalid('INVALID_WORK_MODE'))
  await assert.rejects(recordJobSearchEvent(USER, { ...event, eventType: ['interview'] }, mock.db), invalid('INVALID_EVENT_TYPE'))
  await assert.rejects(recordJobSearchEvent(USER, { ...event, sourceChannel: '' }, mock.db), invalid('INVALID_SOURCE_CHANNEL'))
  assert.equal(mock.requests.length, 0, 'invalid input must fail before any database access')
  assert.equal(validation.validateEmploymentOutcome({ ...employment, effectiveDate: '2024-02-29' }).effective_date, '2024-02-29')
  assert.equal(validation.validateSalaryOutcome({ ...salary, monthlyNetClp: 0 }).monthly_net_clp, 0)
  assert.equal(validation.validateSalaryOutcome({ ...salary, monthlyNetClp: 100000000 }).monthly_net_clp, 100000000)
}

async function checkPersistence() {
  const hostile = { userId: OTHER_USER, user_id: OTHER_USER, verification_status: 'verified', verificationStatus: 'verified', evidence_refs: ['forged'] }
  for (const [record, input, table] of [
    [recordJobSearchEvent, event, 'dtc_job_search_events'],
    [recordEmploymentOutcome, employment, 'dtc_employment_outcomes'],
    [recordSalaryOutcome, { ...salary, monthlyNetClp: 0 }, 'dtc_salary_outcomes'],
  ] as const) {
    const returned = { id: EMPLOYMENT, verification_status: 'self_reported' }
    const mock = database([{ body: returned, status: 201 }])
    assert.deepEqual(await record(USER, { ...input, ...hostile }, mock.db), returned)
    mock.assertDrained()
    assert.equal(mock.requests.length, 1)
    assert.equal(mock.requests[0].method, 'POST')
    assert.equal(mock.requests[0].url.pathname, '/rest/v1/' + table)
    assert.equal(mock.requests[0].body?.user_id, USER)
    assert.equal(mock.requests[0].body?.verification_status, 'self_reported')
    assert.deepEqual(mock.requests[0].body?.evidence_refs, [])
    if (table === 'dtc_job_search_events') assert.equal(mock.requests[0].body?.occurred_at, '2026-10-07T13:00:00.000Z')
    if (table === 'dtc_salary_outcomes') {
      assert.equal(mock.requests[0].body?.monthly_net_clp, 0)
      assert.equal(mock.requests[0].body?.employment_outcome_id, null)
    }
  }

  const linked = database([{ body: [{ id: EMPLOYMENT }] }, { body: { id: 'salary' }, status: 201 }])
  await recordSalaryOutcome(USER, { ...salary, measurementRole: 'new_role', employmentOutcomeId: EMPLOYMENT }, linked.db)
  linked.assertDrained()
  assert.equal(linked.requests[0].method, 'GET')
  assert.equal(linked.requests[0].url.pathname, '/rest/v1/dtc_employment_outcomes')
  assert.equal(linked.requests[0].url.searchParams.get('id'), 'eq.' + EMPLOYMENT)
  assert.equal(linked.requests[0].url.searchParams.get('user_id'), 'eq.' + USER)
  assert.equal(linked.requests[1].body?.employment_outcome_id, EMPLOYMENT)
  assert.equal(linked.requests[1].body?.user_id, USER)

  // A missing outcome and an outcome owned by someone else have the same reply.
  const missing = database([{ body: [] }])
  await assert.rejects(recordSalaryOutcome(USER, { ...salary, employmentOutcomeId: EMPLOYMENT }, missing.db), invalid('INVALID_EMPLOYMENT_OUTCOME_ID'))
  assert.equal(missing.requests.length, 1, 'ownership rejection must not write salary')

  const lookupFailed = database([{ body: { code: '42501', message: 'lookup unavailable' }, status: 400 }])
  await assert.rejects(recordSalaryOutcome(USER, { ...salary, employmentOutcomeId: EMPLOYMENT }, lookupFailed.db), (error: { code?: string }) => error.code === '42501')
  assert.equal(lookupFailed.requests.length, 1, 'lookup failure must not write salary')

  const scheduleFailed = database([{ body: { code: 'P0001', message: 'followup scheduling failed' }, status: 400 }])
  await assert.rejects(recordEmploymentOutcome(USER, employment, scheduleFailed.db), (error: { code?: string }) => error.code === 'P0001')
  assert.equal(scheduleFailed.requests.length, 1, 'capture must use only the atomic employment insert')
  const emptyResult = database([{ body: null, status: 201 }])
  await assert.rejects(recordEmploymentOutcome(USER, employment, emptyResult.db), /OUTCOME_CAPTURE_FAILED/)
}

// Execute the actual route with external services replaced at its import
// boundary. This checks HTTP behavior without requiring a Next cookie context.
const routeSource = ts.transpileModule(readFileSync('app/api/outcomes/chile/route.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText
const instantiateRoute = new Function('require', 'module', 'exports', 'console', routeSource)

function httpHarness(options: { unauthenticated?: boolean; authError?: unknown; captureError?: unknown; summaryError?: unknown } = {}) {
  const calls: Array<{ action: string; userId: string }> = []
  const logs: unknown[] = []
  const capture = (action: string, validate: (body: unknown) => unknown) => async (userId: string, body: unknown) => {
    calls.push({ action, userId })
    validate(body)
    if (options.captureError) throw options.captureError
    return { id: EMPLOYMENT, verification_status: 'self_reported' }
  }
  const summary = { impact: { status: 'observed' } }
  const bindings = {
    'next/server': { NextResponse: { json: (body: unknown, init: ResponseInit) => Response.json(body, init) } },
    '@/lib/auth/server-user': { resolveServerUser: async () => {
      if (options.authError) throw options.authError
      return options.unauthenticated ? null : { id: USER, source: 'supabase' }
    } },
    '@/lib/outcomes-chile/capture': {
      recordJobSearchEvent: capture('job_search_event', validation.validateJobSearchEvent),
      recordEmploymentOutcome: capture('employment_outcome', validation.validateEmploymentOutcome),
      recordSalaryOutcome: capture('salary_outcome', validation.validateSalaryOutcome),
    },
    '@/lib/outcomes-chile/capture-validation': validation,
    '@/lib/outcomes-chile/service': { loadOutcomesChileSummary: async (userId: string) => {
      calls.push({ action: 'summary', userId })
      if (options.summaryError) throw options.summaryError
      return summary
    } },
  }
  const loaded = { exports: {} as { GET(): Promise<Response>; POST(request: Request): Promise<Response> } }
  instantiateRoute((specifier: keyof typeof bindings) => {
    assert.ok(specifier in bindings, `unexpected route dependency: ${specifier}`)
    return bindings[specifier]
  }, loaded, loaded.exports, { error: (...args: unknown[]) => logs.push(args) })
  return { ...loaded.exports, calls, logs, summary }
}

function request(body: unknown) {
  return new Request('https://dtc-capture-test.invalid/api/outcomes/chile', {
    method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' },
  })
}

async function responseBody(response: Response, status: number) {
  assert.equal(response.status, status)
  assert.equal(response.headers.get('Cache-Control'), 'private, no-store, max-age=0')
  assert.equal(response.headers.get('CDN-Cache-Control'), 'no-store')
  assert.equal(response.headers.get('Vercel-CDN-Cache-Control'), 'no-store')
  return response.json()
}

async function checkHttp() {
  const unauthenticated = httpHarness({ unauthenticated: true })
  await responseBody(await unauthenticated.GET(), 401)
  await responseBody(await unauthenticated.POST(request({ action: 'salary_outcome', ...salary })), 401)
  assert.equal(unauthenticated.calls.length, 0)

  const healthy = httpHarness()
  assert.deepEqual(await responseBody(await healthy.GET(), 200), healthy.summary)
  assert.deepEqual(healthy.calls.pop(), { action: 'summary', userId: USER })
  for (const input of [null, [], 'payload', true, 1, { action: 'unsupported' }]) {
    await responseBody(await healthy.POST(request(input)), 400)
  }
  await responseBody(await healthy.POST(new Request('https://dtc-capture-test.invalid/api/outcomes/chile', { method: 'POST', body: '{broken' })), 400)
  assert.equal(healthy.calls.length, 0, 'invalid HTTP bodies must never reach capture')

  for (const [action, input] of [['job_search_event', event], ['employment_outcome', employment], ['salary_outcome', salary]] as const) {
    await responseBody(await healthy.POST(request({ action, ...input, userId: OTHER_USER, user_id: OTHER_USER, verification_status: 'verified' })), 201)
    assert.deepEqual(healthy.calls.pop(), { action, userId: USER })
  }
  const badSalary = await responseBody(await healthy.POST(request({ action: 'salary_outcome', ...salary, monthlyNetClp: null })), 422)
  assert.equal(badSalary.error, 'INVALID_MONTHLY_NET_CLP')

  const sensitiveError = { code: '23514', message: 'private employment detail', details: 'private salary detail' }
  const failedWrite = httpHarness({ captureError: sensitiveError })
  const failure = await responseBody(await failedWrite.POST(request({ action: 'employment_outcome', ...employment })), 500)
  assert.equal(failure.error, 'No pudimos registrar el resultado.')
  assert.doesNotMatch(JSON.stringify(failedWrite.logs), /private employment|private salary/)
  assert.match(JSON.stringify(failedWrite.logs), /23514/)

  const unexpected = httpHarness({ captureError: new Error('INVALID_PRIVATE_DATABASE_DETAIL') })
  const unexpectedBody = await responseBody(await unexpected.POST(request({ action: 'salary_outcome', ...salary })), 500)
  assert.doesNotMatch(JSON.stringify(unexpectedBody), /PRIVATE_DATABASE/)
  const notReady = httpHarness({ summaryError: new Error('OUTCOMES_CHILE_NOT_READY') })
  await responseBody(await notReady.GET(), 503)
  const authFailure = httpHarness({ authError: new Error('session service unavailable') })
  await responseBody(await authFailure.GET(), 503)
  await responseBody(await authFailure.POST(request({ action: 'salary_outcome', ...salary })), 500)
  assert.equal(authFailure.calls.length, 0)
}

async function main() {
  await checkValidation()
  await checkPersistence()
  await checkHttp()
  console.log(JSON.stringify({
    outcomesChileCapture: 'PASS',
    identity: 'server-session',
    salaryType: 'explicit-number',
    calendarDates: 'strict',
    linkedOutcomeOwnership: 'enforced-before-write',
    employmentWrite: 'single-insert-with-database-trigger',
    databaseAtomicity: 'requires-separate-SQL-verification',
    initialVerification: 'self_reported',
    privateResponses: [200, 201, 400, 401, 422, 500, 503],
  }))
}

main().catch((error) => { console.error(error); process.exitCode = 1 })
