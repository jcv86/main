import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'
import ts from 'typescript'
import { completeOutcomeFollowup, recordEmploymentOutcome, recordJobSearchEvent, recordSalaryOutcome } from '../lib/outcomes-chile/capture'
import * as validation from '../lib/outcomes-chile/capture-validation'

const USER = '00000000-0000-4000-8000-000000000001'
const OTHER_USER = '00000000-0000-4000-8000-000000000002'
const EMPLOYMENT = '00000000-0000-4000-8000-000000000003'
const REQUEST = '10000000-0000-4000-8000-000000000001'
const NOW = new Date('2026-10-08T02:30:00.000Z') // Still October 7 in Santiago.
const event = { requestId: REQUEST, eventType: 'interview', occurredAt: '2026-10-07T10:00:00-03:00' }
const employment = { requestId: REQUEST, outcomeType: 'job_started', effectiveDate: '2026-10-07', roleTitle: 'Analista' }
const salary = { requestId: REQUEST, measurementRole: 'baseline', monthlyNetClp: 850000, measuredAt: '2026-10-07' }

const followup = { requestId: REQUEST, followupId: EMPLOYMENT, employmentActive: true, sameRole: null }

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
    await assert.rejects(recordJobSearchEvent(USER, input, mock.db, NOW), invalid('INVALID_INPUT'))
    await assert.rejects(recordEmploymentOutcome(USER, input, mock.db, NOW), invalid('INVALID_INPUT'))
    await assert.rejects(recordSalaryOutcome(USER, input, mock.db, NOW), invalid('INVALID_INPUT'))
  }
  for (const amount of [undefined, null, '', ' ', '850000', true, false, [], {}, NaN, Infinity, -1, 100000001, 850000.5]) {
    await assert.rejects(recordSalaryOutcome(USER, { ...salary, monthlyNetClp: amount }, mock.db, NOW), invalid('INVALID_MONTHLY_NET_CLP'))
  }
  for (const date of ['2025-02-29', '2026-02-30', '2026-04-31', '2026-13-01', '2026-01-00', '0000-01-01', '2026-1-07', '2026-10-07T00:00:00Z']) {
    await assert.rejects(recordEmploymentOutcome(USER, { ...employment, effectiveDate: date }, mock.db, NOW), invalid('INVALID_EFFECTIVE_DATE'))
    await assert.rejects(recordSalaryOutcome(USER, { ...salary, measuredAt: date }, mock.db, NOW), invalid('INVALID_MEASURED_AT'))
  }
  for (const date of ['2025-02-29T10:00:00Z', '2026-02-30T10:00:00Z', '2026-10-07', '2026-10-07T10:00:00', '2026-10-07T24:00:00Z', '2026-10-07T10:60:00Z', '2026-10-07T10:00:60Z', '2026-10-07T10:00:00+24:00', 'October 7, 2026']) {
    await assert.rejects(recordJobSearchEvent(USER, { ...event, occurredAt: date }, mock.db, NOW), invalid('INVALID_OCCURRED_AT'))
  }
  for (const id of ['', false, 1, [], {}, 'another-person', EMPLOYMENT + ' ']) {
    await assert.rejects(recordSalaryOutcome(USER, { ...salary, employmentOutcomeId: id }, mock.db, NOW), invalid('INVALID_EMPLOYMENT_OUTCOME_ID'))
  }
  await assert.rejects(recordEmploymentOutcome(USER, { ...employment, roleTitle: ' ' }, mock.db, NOW), invalid('ROLE_REQUIRED'))
  await assert.rejects(recordEmploymentOutcome(USER, { ...employment, roleTitle: 'x'.repeat(161) }, mock.db, NOW), invalid('INVALID_ROLE_TITLE'))
  await assert.rejects(recordEmploymentOutcome(USER, { ...employment, workMode: false }, mock.db, NOW), invalid('INVALID_WORK_MODE'))
  await assert.rejects(recordJobSearchEvent(USER, { ...event, eventType: ['interview'] }, mock.db, NOW), invalid('INVALID_EVENT_TYPE'))
  await assert.rejects(recordJobSearchEvent(USER, { ...event, sourceChannel: '' }, mock.db, NOW), invalid('INVALID_SOURCE_CHANNEL'))
  assert.equal(mock.requests.length, 0, 'invalid input must fail before any database access')
  assert.equal(validation.validateEmploymentOutcome({ ...employment, effectiveDate: '2024-02-29' }).effective_date, '2024-02-29')
  assert.equal(validation.validateSalaryOutcome({ ...salary, monthlyNetClp: 0 }).monthly_net_clp, 0)
  assert.equal(validation.validateSalaryOutcome({ ...salary, monthlyNetClp: 100000000 }).monthly_net_clp, 100000000)
  for (const requestId of [undefined, null, '', 1, false, [], 'bad-uuid']) {
    await assert.rejects(recordEmploymentOutcome(USER, { ...employment, requestId }, mock.db, NOW), invalid('INVALID_REQUEST_ID'))
    await assert.rejects(completeOutcomeFollowup(USER, { ...followup, requestId }, mock.db), invalid('INVALID_REQUEST_ID'))
  }
  assert.equal(validation.captureTodayChile(NOW), '2026-10-07')
  assert.equal(validation.captureTodayChile(new Date('2026-10-08T03:00:00Z')), '2026-10-08')
  assert.throws(() => validation.validateEmploymentOutcome({ ...employment, effectiveDate: '2026-10-08' }, NOW), invalid('FUTURE_EFFECTIVE_DATE'))
  assert.throws(() => validation.validateSalaryOutcome({ ...salary, measuredAt: '2026-10-08' }, NOW), invalid('FUTURE_MEASURED_AT'))
  assert.throws(() => validation.validateJobSearchEvent({ ...event, occurredAt: '2026-10-08T02:30:00.001Z' }, NOW), invalid('FUTURE_OCCURRED_AT'))
  assert.equal(validation.validateJobSearchEvent({ ...event, occurredAt: NOW.toISOString() }, NOW).occurred_at, NOW.toISOString())
  for (const employmentActive of [undefined, null, '', 'true', 0, 1]) {
    await assert.rejects(completeOutcomeFollowup(USER, { ...followup, employmentActive }, mock.db), invalid('INVALID_EMPLOYMENT_ACTIVE'))
  }
  for (const sameRole of ['true', 0, [], {}]) {
    await assert.rejects(completeOutcomeFollowup(USER, { ...followup, sameRole }, mock.db), invalid('INVALID_SAME_ROLE'))
  }
  await assert.rejects(completeOutcomeFollowup(USER, { ...followup, followupId: 'other-user' }, mock.db), invalid('INVALID_FOLLOWUP_ID'))
  await assert.rejects(completeOutcomeFollowup(USER, { ...followup, employmentActive: false, sameRole: false }, mock.db), invalid('INVALID_SAME_ROLE'))
  assert.deepEqual(validation.validateFollowupCompletion({ ...followup, employmentActive: false }), { followup_id: EMPLOYMENT, employment_active: false, same_role: null })
  assert.equal(mock.requests.length, 0)
}

async function checkPersistence() {
  const hostile = { userId: OTHER_USER, user_id: OTHER_USER, verification_status: 'verified', verificationStatus: 'verified', evidence_refs: ['forged'], completedAt: '1990-01-01', monthlyNetClp: 999999 }
  for (const [record, input, action] of [
    [recordJobSearchEvent, event, 'job_search_event'],
    [recordEmploymentOutcome, employment, 'employment_outcome'],
    [recordSalaryOutcome, { ...salary, monthlyNetClp: 0 }, 'salary_outcome'],
  ] as const) {
    const returned = { id: EMPLOYMENT, verification_status: 'self_reported' }
    const mock = database([{ body: returned }])
    assert.deepEqual(await record(USER, { ...hostile, ...input }, mock.db, NOW), returned)
    mock.assertDrained()
    assert.equal(mock.requests.length, 1)
    assert.equal(mock.requests[0].method, 'POST')
    assert.equal(mock.requests[0].url.pathname, '/rest/v1/rpc/capture_dtc_chile_outcome')
    assert.equal(mock.requests[0].body?.p_user_id, USER)
    assert.equal(mock.requests[0].body?.p_request_id, REQUEST)
    assert.equal(mock.requests[0].body?.p_action, action)
    const payload = mock.requests[0].body?.p_payload as Record<string, unknown>
    for (const key of ['user_id', 'userId', 'requestId', 'verification_status', 'verificationStatus', 'evidence_refs', 'completedAt']) assert.ok(!(key in payload))
    if (action === 'job_search_event') assert.equal(payload.occurred_at, '2026-10-07T13:00:00.000Z')
    if (action === 'salary_outcome') {
      assert.equal(payload.monthly_net_clp, 0)
      assert.equal(payload.employment_outcome_id, null)
    }
  }

  const linked = database([{ body: { id: 'salary' } }])
  await recordSalaryOutcome(USER, { ...salary, measurementRole: 'new_role', employmentOutcomeId: EMPLOYMENT }, linked.db, NOW)
  linked.assertDrained()
  assert.equal(linked.requests.length, 1, 'ownership and persistence must share the RPC transaction')
  assert.equal((linked.requests[0].body?.p_payload as Record<string, unknown>).employment_outcome_id, EMPLOYMENT)

  const completed = { id: EMPLOYMENT, employment_active: false, same_role: null, completed_at: '2026-10-07T14:00:00Z', verification_status: 'self_reported' }
  const complete = database([{ body: completed }])
  assert.deepEqual(await completeOutcomeFollowup(USER, { ...hostile, ...followup, employmentActive: false }, complete.db), completed)
  assert.equal(complete.requests.length, 1)
  assert.equal(complete.requests[0].body?.p_action, 'complete_followup')
  assert.deepEqual(complete.requests[0].body?.p_payload, { followup_id: EMPLOYMENT, employment_active: false, same_role: null })

  // Normalize before reserving a key: object order, text padding and UUID case
  // must not create a different request payload when the UI retries.
  const replay = database([{ body: completed }, { body: completed }])
  await recordEmploymentOutcome(USER, { ...employment, roleTitle: '  Analista  ', requestId: REQUEST.toUpperCase() }, replay.db, NOW)
  await recordEmploymentOutcome(USER, employment, replay.db, NOW)
  assert.deepEqual(replay.requests[0].body, replay.requests[1].body)

  for (const code of ['IDEMPOTENCY_KEY_REUSED', 'FOLLOWUP_NOT_DUE', 'FOLLOWUP_ALREADY_COMPLETED', 'FOLLOWUP_VERIFICATION_LOCKED']) {
    const mock = database([{ body: { code: 'PT409', message: code }, status: 409 }])
    await assert.rejects(completeOutcomeFollowup(USER, followup, mock.db), (error: unknown) => error instanceof validation.OutcomeCaptureConflictError && error.message === code)
  }
  const missing = database([{ body: { code: 'PT404', message: 'FOLLOWUP_NOT_FOUND' }, status: 404 }])
  await assert.rejects(completeOutcomeFollowup(USER, followup, missing.db), validation.OutcomeCaptureNotFoundError)
  const wrongOwner = database([{ body: { code: 'PT422', message: 'INVALID_EMPLOYMENT_OUTCOME_ID' }, status: 422 }])
  await assert.rejects(recordSalaryOutcome(USER, { ...salary, employmentOutcomeId: EMPLOYMENT }, wrongOwner.db, NOW), invalid('INVALID_EMPLOYMENT_OUTCOME_ID'))
  const scheduleFailed = database([{ body: { code: 'P0001', message: 'followup scheduling failed' }, status: 400 }])
  await assert.rejects(recordEmploymentOutcome(USER, employment, scheduleFailed.db, NOW), (error: { code?: string }) => error.code === 'P0001')
  assert.equal(scheduleFailed.requests.length, 1)
  const unknownConflict = database([{ body: { code: 'PT409', message: 'PRIVATE_DATABASE_DETAIL' }, status: 409 }])
  await assert.rejects(completeOutcomeFollowup(USER, followup, unknownConflict.db), (error: unknown) => !(error instanceof validation.OutcomeCaptureConflictError))
  const emptyResult = database([{ body: null }])
  await assert.rejects(recordEmploymentOutcome(USER, employment, emptyResult.db, NOW), /OUTCOME_CAPTURE_FAILED/)
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
  const capture = (action: string, validate: (body: unknown, now?: Date) => unknown) => async (userId: string, body: unknown) => {
    calls.push({ action, userId })
    validation.validateCaptureRequestId(body)
    validate(body, NOW)
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
      completeOutcomeFollowup: capture('complete_followup', validation.validateFollowupCompletion),
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
  await responseBody(await healthy.POST(request({ action: 'complete_followup', ...followup })), 200)
  assert.deepEqual(healthy.calls.pop(), { action: 'complete_followup', userId: USER })
  const missingKey = await responseBody(await healthy.POST(request({ action: 'employment_outcome', ...employment, requestId: undefined })), 422)
  assert.equal(missingKey.error, 'INVALID_REQUEST_ID')
  const badSalary = await responseBody(await healthy.POST(request({ action: 'salary_outcome', ...salary, monthlyNetClp: null })), 422)
  assert.equal(badSalary.error, 'INVALID_MONTHLY_NET_CLP')

  for (const code of ['IDEMPOTENCY_KEY_REUSED', 'FOLLOWUP_NOT_DUE', 'FOLLOWUP_ALREADY_COMPLETED', 'FOLLOWUP_VERIFICATION_LOCKED']) {
    const conflicted = httpHarness({ captureError: new validation.OutcomeCaptureConflictError(code) })
    assert.equal((await responseBody(await conflicted.POST(request({ action: 'complete_followup', ...followup })), 409)).error, code)
    assert.equal(conflicted.logs.length, 0)
  }
  const missingFollowup = httpHarness({ captureError: new validation.OutcomeCaptureNotFoundError() })
  assert.equal((await responseBody(await missingFollowup.POST(request({ action: 'complete_followup', ...followup })), 404)).error, 'FOLLOWUP_NOT_FOUND')

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
    linkedOutcomeOwnership: 'checked-inside-rpc',
    requestId: 'required-normalized-owner-scoped',
    observedDates: 'server-now-and-chile-calendar',
    followupCompletion: 'service-rpc-with-conflict-codes',
    employmentWrite: 'single-idempotent-rpc-with-database-trigger',
    databaseAtomicity: 'requires-separate-SQL-verification',
    initialVerification: 'self_reported',
    privateResponses: [200, 201, 400, 401, 404, 409, 422, 500, 503],
  }))
}

main().catch((error) => { console.error(error); process.exitCode = 1 })
