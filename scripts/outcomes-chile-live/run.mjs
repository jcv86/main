#!/usr/bin/env node
/** Real Preview -> Next route handlers -> Supabase integration. Secrets enter only through stdin. */
import { createHash, randomBytes, randomUUID } from 'node:crypto'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import {
  API_PATH, PAGE_PATH, OWNED_TABLES, CASCADE_TABLES, PROJECT_REF, VERCEL_PROJECT_ID, LiveFailure,
  atomicPrivateJson, check, chileDate, cooperativeCancellation, failureCode, httpDiagnostic, memoryCookies,
  requestTracker, revokeThenRemove, sameJson, sdkData, settledValues, validateConfig,
} from './guards.mjs'
import { browserPreflight, runBrowserJourney } from './browser.mjs'

const argv = process.argv.slice(2)
const execute = argv.length === 1 && argv[0] === '--execute'
let config
let admin
let app
let evidenceReady = false
let readingInput = false
let activeCase = 'setup'
const cancellation = cooperativeCancellation()
const requests = requestTracker()
const runId = randomUUID()
const users = []
const invitations = []
const startedAt = new Date().toISOString()
const report = {
  scope: 'live-next-supabase-outcomes-chile', mode: execute ? 'execute' : 'preflight',
  runReference: runId,
  verdict: 'NO_GO', startedAt, cases: [], httpDiagnostics: [], browserDiagnostics: [], cleanup: { required: execute, completed: false },
  limitations: [
    'Deployment identity is a recent operator-provided Vercel attestation, checked against local HEAD; the runner does not call Vercel management APIs.',
    'Synthetic password sessions are issued by real Supabase Auth. Google/LinkedIn OAuth and email delivery are outside this test.',
    'The database is the explicitly allowlisted DTCFINAL project. Writes are restricted to new synthetic identities and their disposable invitations.',
    'Benchmark values are never inserted, changed or asserted as product outcomes by this runner.',
  ],
}

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    if (!cancellation.request(signal)) return
    process.stdout.write(JSON.stringify({ status: 'CANCELLATION_REQUESTED', signal }) + '\n')
    // Interrupting stdin is safe; an active HTTP request is never aborted by a signal.
    if (readingInput) process.stdin.destroy()
  })
}

function saveCheckpoint(phase) {
  check(evidenceReady, 'RECOVERY_CHECKPOINT_NOT_READY')
  atomicPrivateJson(join(config.evidenceDirectory, 'checkpoint.json'), {
    formatVersion: 2, runReference: runId, startedAt, updatedAt: new Date().toISOString(), phase,
    projectRef: PROJECT_REF, vercelProjectId: VERCEL_PROJECT_ID,
    deployment: { origin: config.target.origin, id: config.target.deploymentId, commitSha: config.target.commitSha },
    users: users.map(({ id, label }) => ({ id, label })),
    invitations: invitations.map(({ id, hash, claimId, userId }) => ({ id, tokenHash: hash, claimId, userId })),
  })
}

function privateHeaders(response) {
  check(/private/i.test(response.headers.get('cache-control') ?? '') && /no-store/i.test(response.headers.get('cache-control') ?? ''), 'PRIVATE_NO_STORE_MISSING')
  check(!/\bHIT\b/i.test(response.headers.get('x-vercel-cache') ?? ''), 'PRIVATE_RESPONSE_CACHED')
}

async function runCase(name, callback) {
  activeCase = name
  const start = Date.now()
  try {
    cancellation.check()
    const facts = await callback()
    cancellation.check()
    report.cases.push({ name, status: 'PASS', milliseconds: Date.now() - start, ...(facts ? { facts } : {}) })
    process.stdout.write(JSON.stringify({ case: name, status: 'PASS' }) + '\n')
  } catch (error) {
    report.cases.push({ name, status: 'FAIL', code: failureCode(error), milliseconds: Date.now() - start })
    throw error
  }
}

function recordHttpDiagnostic(diagnostic, transport = 'http') {
  report.httpDiagnostics.push({ case: activeCase, transport, ...diagnostic })
}

function recordBrowserDiagnostic(diagnostic) {
  report.browserDiagnostics.push({ case: activeCase, ...diagnostic })
}

async function readInput() {
  let text = ''
  readingInput = true
  process.stdout.write(JSON.stringify({ status: 'AWAITING_STDIN', mode: report.mode }) + '\n')
  try {
    for await (const chunk of process.stdin) {
      cancellation.check()
      text += chunk.toString()
      check(Buffer.byteLength(text) <= 64 * 1024, 'CONFIG_TOO_LARGE')
    }
  } finally { readingInput = false }
  cancellation.check()
  try { return JSON.parse(text) } catch { throw new LiveFailure('CONFIG_MUST_BE_JSON_ON_STDIN') }
}

function restrictedFetch(origin) {
  return async (input, init = {}) => {
    cancellation.check()
    const url = new URL(input instanceof Request ? input.url : input)
    check(url.origin === origin, 'SDK_CROSS_ORIGIN_REQUEST_BLOCKED')
    return requests.track(async () => {
      try {
        const response = await fetch(input, { ...init, redirect: 'error', signal: init.signal ?? AbortSignal.timeout(30_000) })
        // Complete the response before releasing the request from the cleanup barrier.
        await response.clone().arrayBuffer()
        return response
      } catch { throw new LiveFailure('SDK_TRANSPORT_UNAVAILABLE') }
    })
  }
}

function makeAppTransport() {
  return async (path, { owner, method = 'GET', body, json = true } = {}) => {
    cancellation.check()
    check(path === API_PATH || path === PAGE_PATH || ['/api/health/live', '/api/health/ready', '/api/auth/pilot-status'].includes(path), 'APP_PATH_NOT_ALLOWLISTED')
    const headers = new Headers({ 'Accept': json ? 'application/json' : 'text/html', 'Cache-Control': 'no-store' })
    const cookie = [config.vercelProtectionCookies.map(({ name, value }) => `${name}=${value}`).join('; '), owner?.cookies.header()].filter(Boolean).join('; ')
    if (cookie) headers.set('Cookie', cookie)
    if (body !== undefined) headers.set('Content-Type', 'application/json')
    if (config.vercelProtectionBypass) headers.set('x-vercel-protection-bypass', config.vercelProtectionBypass)
    const response = await requests.track(async () => {
      try {
        const received = await fetch(config.target.origin + path, {
          method, headers, redirect: 'manual', cache: 'no-store',
          ...(body !== undefined ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(45_000),
        })
        await received.clone().arrayBuffer()
        return received
      } catch { throw new LiveFailure('APP_TRANSPORT_UNAVAILABLE') }
    })
    owner?.cookies.receive(response)
    const metadata = {
      path, method, status: response.status,
      contentType: response.headers.get('content-type'), retryAfter: response.headers.get('retry-after'),
    }
    let data
    let jsonState = 'unread'
    if (json && metadata.contentType?.includes('application/json')) {
      try { data = await response.json(); jsonState = 'parsed' } catch { jsonState = 'invalid' }
    }
    recordHttpDiagnostic(httpDiagnostic({ ...metadata, data, jsonState }))
    // A real rate limit is a failed gate. Do not retry, wait out, or bypass the policy.
    check(response.status !== 429, 'APP_RATE_LIMITED')
    if (!json) return response
    check(metadata.contentType?.includes('application/json'), 'APP_JSON_EXPECTED_CHECK_PREVIEW_PROTECTION')
    check(jsonState === 'parsed', 'APP_RESPONSE_NOT_JSON')
    cancellation.check()
    return { response, data }
  }
}

async function getSummary(owner) {
  const result = await app(API_PATH, { owner })
  check(result.response.status === 200, 'AUTHENTICATED_SUMMARY_FAILED')
  privateHeaders(result.response)
  check(Array.isArray(result.data?.workspace?.history) && Array.isArray(result.data.workspace.followups), 'WORKSPACE_CONTRACT_MISSING')
  return result.data
}

async function post(owner, body, expectedStatus = 201, expectedCode) {
  const result = await app(API_PATH, { owner, method: 'POST', body })
  check(result.response.status === expectedStatus, `CAPTURE_EXPECTED_${expectedStatus}`)
  privateHeaders(result.response)
  if (expectedCode) check(result.data.error === expectedCode, 'CAPTURE_PUBLIC_CODE_MISMATCH')
  if (expectedStatus < 300) check(typeof result.data?.data?.id === 'string' && result.data.data.verification_status === 'self_reported', 'CAPTURE_VERIFIED_RESPONSE_INVALID')
  return result.data
}

async function ownedCount(table, owner, client = admin) {
  check(CASCADE_TABLES.includes(table) && users.includes(owner), 'UNOWNED_ROW_QUERY_BLOCKED')
  const result = await client.from(table).select('user_id', { count: 'exact', head: true }).eq('user_id', owner.id)
  sdkData(result, 'OWNER_COUNT_UNAVAILABLE')
  check(Number.isInteger(result.count), 'OWNER_COUNT_NOT_EXACT')
  return result.count
}

async function createSyntheticUser(label) {
  cancellation.check()
  const owner = {
    label, id: randomUUID(), email: `dtc-live-${runId}-${label.toLowerCase()}@example.invalid`,
    password: randomBytes(36).toString('base64url') + 'aA1!', cookies: memoryCookies(), tokens: new Set(),
  }
  // Assign the UUID before the request so a lost creation response is still recoverable by exact ID.
  users.push(owner)
  saveCheckpoint('work')
  const existing = await admin.auth.admin.getUserById(owner.id)
  check(existing.error?.status === 404 && !existing.data?.user, 'SYNTHETIC_USER_ID_NOT_EMPTY')
  cancellation.check()
  const created = sdkData(await admin.auth.admin.createUser({
    id: owner.id, email: owner.email, password: owner.password, email_confirm: true,
    app_metadata: { dtc_live_run: runId, synthetic: true },
    user_metadata: { full_name: `Control sintético DTC ${label}` },
  }), 'SYNTHETIC_USER_CREATION_FAILED')
  check(created.user?.id === owner.id, 'SYNTHETIC_USER_ID_MISMATCH')
  cancellation.check()
  owner.auth = createServerClient(config.supabase.url, config.supabase.publicKey, {
    auth: { autoRefreshToken: false, detectSessionInUrl: false },
    cookies: { getAll: owner.cookies.getAll, setAll: owner.cookies.setAll },
    global: { fetch: restrictedFetch(config.supabase.url) },
  })
  owner.auth.auth.onAuthStateChange((_event, session) => { if (session?.access_token) owner.tokens.add(session.access_token) })
  const signedIn = sdkData(await owner.auth.auth.signInWithPassword({ email: owner.email, password: owner.password }), 'SYNTHETIC_PASSWORD_AUTH_FAILED')
  check(signedIn.user?.id === owner.id && signedIn.session?.access_token && owner.cookies.header(), 'REAL_AUTH_SESSION_MISSING')
  owner.tokens.add(signedIn.session.access_token)
  const verified = sdkData(await owner.auth.auth.getUser(), 'SUPABASE_USER_VERIFICATION_FAILED')
  check(verified.user?.id === owner.id && verified.user.role === 'authenticated', 'AUTH_IDENTITY_OR_ROLE_MISMATCH')
  return owner
}

async function grantPilotThroughExistingRpc(owner) {
  cancellation.check()
  check(users.includes(owner), 'UNOWNED_PILOT_GRANT_BLOCKED')
  const token = randomBytes(32).toString('base64url')
  const invitation = { id: randomUUID(), hash: createHash('sha256').update(token).digest('hex'), claimId: randomUUID(), userId: owner.id }
  invitations.push(invitation)
  saveCheckpoint('work')
  sdkData(await admin.from('pilot_invitations').insert({
    id: invitation.id, token_hash: invitation.hash, status: 'issued', expires_at: new Date(Date.now() + 20 * 60_000).toISOString(),
  }).select('id').single(), 'SYNTHETIC_INVITATION_CREATION_FAILED')
  const claimed = sdkData(await admin.rpc('claim_pilot_invitation', { p_token_hash: invitation.hash, p_claim_id: invitation.claimId }), 'PILOT_CLAIM_RPC_FAILED')
  check(claimed?.[0]?.allowed === true && claimed[0].invitation_id === invitation.id, 'PILOT_CLAIM_DENIED')
  const access = sdkData(await admin.rpc('resolve_pilot_access', { p_user_id: owner.id, p_claim_id: invitation.claimId }), 'PILOT_REDEEM_RPC_FAILED')
  check(access?.[0]?.allowed === true && access[0].access_kind === 'invited', 'PILOT_CAPACITY_OR_REDEMPTION_DENIED')
  const status = await app('/api/auth/pilot-status', { owner })
  check(status.response.status === 200 && status.data.allowed === true, 'APP_PILOT_ACCESS_NOT_CONFIRMED')
}

async function cleanup() {
  const result = { required: true, completed: false, resourcesAbsent: false, usersCreatedOrAttempted: users.length, usersDeleted: 0, usersAlreadyAbsent: 0,
    usersVerifiedAbsent: 0, ownersWithCascadesVerified: 0, invitationsCreatedOrAttempted: invitations.length, invitationsDeleted: 0, invitationsVerifiedAbsent: 0,
    ownedRowsRemaining: 0, cascadeRelationsVerified: CASCADE_TABLES, revocations: [], errors: [] }
  for (const owner of users) {
    try {
      const found = await admin.auth.admin.getUserById(owner.id)
      if (found.error?.status === 404 && !found.data?.user) {
        result.usersAlreadyAbsent++
        result.usersVerifiedAbsent++
        for (const table of CASCADE_TABLES) result.ownedRowsRemaining += await ownedCount(table, owner)
        result.ownersWithCascadesVerified++
        continue
      }
      const user = sdkData(found, 'CLEANUP_USER_LOOKUP_FAILED')?.user
      check(user?.id === owner.id && user.email === owner.email && user.app_metadata?.dtc_live_run === runId && user.app_metadata.synthetic === true, 'CLEANUP_OWNER_MARKER_MISMATCH')
      await revokeThenRemove({
        tokens: owner.tokens,
        revoke: (token) => admin.auth.admin.signOut(token, 'global'),
        onRevocation(diagnostic) {
          result.revocations.push(diagnostic)
          if (diagnostic.outcome === 'failed') result.errors.push('CLEANUP_SESSION_REVOCATION_FAILED')
        },
        async remove() {
          sdkData(await admin.auth.admin.deleteUser(owner.id), 'CLEANUP_USER_DELETE_FAILED')
          const absent = await admin.auth.admin.getUserById(owner.id)
          check(absent.error?.status === 404 && !absent.data?.user, 'CLEANUP_AUTH_USER_REMAINS')
          result.usersDeleted++
          result.usersVerifiedAbsent++
          for (const table of CASCADE_TABLES) result.ownedRowsRemaining += await ownedCount(table, owner)
          result.ownersWithCascadesVerified++
          if (owner.cookies.header()) {
            const oldSession = await app(API_PATH, { owner })
            check(oldSession.response.status === 401, 'DELETED_SYNTHETIC_SESSION_STILL_AUTHENTICATED')
          }
        },
      })
    } catch (error) { result.errors.push(failureCode(error)) }
    finally { owner.password = ''; owner.tokens.clear(); owner.cookies.clear() }
  }
  for (const invitation of invitations) {
    try {
      const found = await admin.from('pilot_invitations').select('id,token_hash,claimed_by_claim_id,claimed_by_user_id').eq('id', invitation.id).maybeSingle()
      const row = sdkData(found, 'CLEANUP_INVITATION_LOOKUP_FAILED')
      if (!row) { result.invitationsVerifiedAbsent++; continue }
      check(row.token_hash === invitation.hash
        && (row.claimed_by_claim_id === null || row.claimed_by_claim_id === invitation.claimId)
        && (row.claimed_by_user_id === null || row.claimed_by_user_id === invitation.userId), 'CLEANUP_INVITATION_MARKER_MISMATCH')
      let deletion = admin.from('pilot_invitations').delete().eq('id', invitation.id).eq('token_hash', invitation.hash)
      deletion = row.claimed_by_claim_id === null ? deletion.is('claimed_by_claim_id', null) : deletion.eq('claimed_by_claim_id', invitation.claimId)
      deletion = row.claimed_by_user_id === null ? deletion.is('claimed_by_user_id', null) : deletion.eq('claimed_by_user_id', invitation.userId)
      sdkData(await deletion, 'CLEANUP_INVITATION_DELETE_FAILED')
      const remaining = await admin.from('pilot_invitations').select('id', { count: 'exact', head: true }).eq('id', invitation.id)
      sdkData(remaining, 'CLEANUP_INVITATION_CHECK_FAILED')
      check(remaining.count === 0, 'CLEANUP_INVITATION_REMAINS')
      result.invitationsDeleted++
      result.invitationsVerifiedAbsent++
    } catch (error) { result.errors.push(failureCode(error)) }
  }
  result.resourcesAbsent = result.usersVerifiedAbsent === users.length && result.ownersWithCascadesVerified === users.length
    && result.invitationsVerifiedAbsent === invitations.length && result.ownedRowsRemaining === 0
  result.completed = result.errors.length === 0 && result.resourcesAbsent
  return result
}

try {
  check(argv.length === 0 || execute || (argv.length === 1 && argv[0] === '--preflight'), 'ONLY_PREFLIGHT_OR_EXECUTE_ALLOWED')
  config = validateConfig(await readInput())
  // Never overwrite evidence from an earlier run, and create the directory before any remote writes.
  mkdirSync(config.evidenceDirectory, { recursive: false, mode: 0o700 })
  evidenceReady = true
  report.target = { ...config.target, identitySource: 'operator-vercel-attestation' }
  report.source = config.source
  saveCheckpoint('preflight')
  process.stdout.write(JSON.stringify({ runReference: runId, mode: report.mode, status: 'STARTED' }) + '\n')
  admin = createClient(config.supabase.url, config.supabase.serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
    global: { fetch: restrictedFetch(config.supabase.url) },
  })
  app = makeAppTransport()
  await runCase('anonymous-api-and-private-page-boundary', async () => {
    for (const method of ['GET', 'POST']) {
      const result = await app(API_PATH, { method, ...(method === 'POST' ? { body: {} } : {}) })
      check(result.response.status === 401, 'ANONYMOUS_OUTCOMES_NOT_REJECTED')
      privateHeaders(result.response)
    }
    const page = await app(PAGE_PATH, { json: false })
    const location = page.headers.get('location')
    check([303, 307, 308].includes(page.status) && location, 'ANONYMOUS_PAGE_NOT_REDIRECTED')
    const destination = new URL(location, config.target.origin)
    check(destination.origin === config.target.origin && destination.pathname === '/auth/signin', 'ANONYMOUS_PAGE_WRONG_REDIRECT')
    return { apiReadsAndWritesRequireSession: true, privatePageRequiresSession: true }
  })
  await runCase('supabase-schema-and-preview-readiness', async () => {
    const ready = await app('/api/health/ready')
    check(ready.response.status === 200 && ready.data.status === 'ready', 'PREVIEW_DATABASE_NOT_READY')
    const unusedOwner = randomUUID()
    for (const table of OWNED_TABLES) {
      const result = await admin.from(table).select('user_id', { count: 'exact', head: true }).eq('user_id', unusedOwner)
      sdkData(result, 'OUTCOMES_SCHEMA_OR_SERVICE_ACL_NOT_READY')
      check(result.count === 0, 'UNEXPECTED_PREFLIGHT_OWNER_COLLISION')
    }
    sdkData(await admin.from('dtc_chile_benchmarks').select('id', { head: true }).limit(0), 'BENCHMARK_SCHEMA_NOT_READY')
    const capacity = await admin.from('pilot_memberships').select('id', { count: 'exact', head: true }).eq('access_kind', 'invited')
    sdkData(capacity, 'PILOT_CAPACITY_LOOKUP_FAILED')
    check(Number.isInteger(capacity.count) && capacity.count <= 98, 'TWO_SYNTHETIC_PILOT_PLACES_REQUIRED')
    return { outcomesRelations: OWNED_TABLES.length, previewDatabaseReady: true, pilotCapacityAvailable: true }
  })
  await runCase('browser-tooling-preflight', async () => browserPreflight(config.browser, {
    target: config.target, supabaseOrigin: config.supabase.url, vercelProtectionBypass: config.vercelProtectionBypass, vercelProtectionCookies: config.vercelProtectionCookies,
    requests, cancellation, onHttpDiagnostic: (diagnostic) => recordHttpDiagnostic(diagnostic, 'browser'), onBrowserDiagnostic: recordBrowserDiagnostic,
  }))
  if (!execute) {
    report.verdict = 'CONDITIONAL_GO'
    report.conditions = ['Live synthetic writes, two-owner isolation, browser persistence and cleanup still require --execute.']
    report.cleanup = { required: false, completed: true, remoteWrites: 0 }
  } else {
    let a
    let b
    let employmentBody
    let employmentResponse
    let due
    await runCase('real-supabase-sessions-and-pilot-entitlements', async () => {
      a = await createSyntheticUser('A')
      b = await createSyntheticUser('B')
      await grantPilotThroughExistingRpc(a)
      await grantPilotThroughExistingRpc(b)
      return { newSyntheticIdentities: 2, serverVerifiedAuthSessions: 2, existingPilotRpcGrants: 2, emailsSent: 0 }
    })
    await runCase('fresh-owners-have-empty-workspaces', async () => {
      for (const owner of [a, b]) {
        const summary = await getSummary(owner)
        check(summary.workspace.historyCount === 0 && summary.workspace.employmentOptionCount === 0 && summary.workspace.followupCount === 0, 'NEW_OWNER_HAS_EXISTING_OUTCOMES')
      }
    })
    await runCase('search-and-baseline-capture-through-next', async () => {
      await post(a, { action: 'job_search_event', requestId: randomUUID(), eventType: 'application', occurredAt: chileDate(45) + 'T12:00:00.000Z', targetRole: 'DTC control sintético A', userId: b.id, user_id: b.id, verification_status: 'verified' })
      await post(a, { action: 'salary_outcome', requestId: randomUUID(), measurementRole: 'baseline', monthlyNetClp: 800_000, measuredAt: chileDate(50) })
      check(await ownedCount('dtc_job_search_events', a) === 1 && await ownedCount('dtc_job_search_events', b) === 0, 'CLIENT_OWNER_OVERRIDE_ACCEPTED')
    })
    await runCase('concurrent-http-retry-is-one-employment-and-three-followups', async () => {
      employmentBody = { action: 'employment_outcome', requestId: randomUUID(), outcomeType: 'job_started', effectiveDate: chileDate(40), roleTitle: 'DTC control sintético A', employmentCategory: 'private_employee', regionCode: '13' }
      const responses = await settledValues([post(a, employmentBody), post(a, employmentBody)])
      check(sameJson(responses[0], responses[1]), 'CONCURRENT_REPLAY_RESPONSE_CHANGED')
      employmentResponse = responses[0]
      check(await ownedCount('dtc_employment_outcomes', a) === 1 && await ownedCount('dtc_outcome_followups', a) === 3, 'CONCURRENT_EMPLOYMENT_OR_FOLLOWUP_DUPLICATED')
      const records = await admin.from('dtc_outcome_write_requests').select('request_id', { count: 'exact', head: true }).eq('user_id', a.id).eq('request_id', employmentBody.requestId)
      sdkData(records, 'REQUEST_LEDGER_READ_FAILED')
      check(records.count === 1, 'CONCURRENT_REQUEST_LEDGER_DUPLICATED')
      return { concurrentRequests: 2, savedEmployments: 1, savedFollowups: 3, savedReservations: 1 }
    })
    await runCase('linked-income-persists-in-fresh-summary', async () => {
      await post(a, { action: 'salary_outcome', requestId: randomUUID(), measurementRole: 'new_role', monthlyNetClp: 1_000_000, measuredAt: chileDate(35), employmentOutcomeId: employmentResponse.data.id })
      const summary = await getSummary(a)
      check(summary.workspace.historyCount === 4 && summary.workspace.followupCount === 3 && summary.funnel.applications === 1, 'PERSISTED_WORKSPACE_COUNTS_WRONG')
      check(summary.economic.monthlyLiftClp === 200_000 && summary.economic.baselineMonthlyNetClp === 800_000 && summary.economic.latestMonthlyNetClp === 1_000_000, 'PERSISTED_ECONOMIC_VALUES_WRONG')
      due = summary.workspace.followups.find((row) => row.day === 30)
      check(due?.canComplete === true && due.employmentOutcomeId === employmentResponse.data.id, 'DUE_FOLLOWUP_MISSING')
      check(summary.workspace.followups.filter((row) => row.state === 'upcoming').length === 2, 'FUTURE_FOLLOWUPS_WRONG')
    })
    await runCase('retry-after-new-session-preserves-original-response', async () => {
      const refreshed = sdkData(await a.auth.auth.refreshSession(), 'REAL_SESSION_REFRESH_FAILED')
      check(refreshed.session?.access_token, 'REFRESHED_SESSION_MISSING')
      a.tokens.add(refreshed.session.access_token)
      check(sameJson(await post(a, employmentBody), employmentResponse), 'RETRY_AFTER_REFRESH_CHANGED_RESPONSE')
      await post(a, { ...employmentBody, roleTitle: 'Cambio sintético rechazado' }, 409, 'IDEMPOTENCY_KEY_REUSED')
      check(await ownedCount('dtc_employment_outcomes', a) === 1, 'REFRESH_RETRY_CREATED_DUPLICATE')
    })
    await runCase('second-owner-cannot-read-or-change-first-owner-outcomes', async () => {
      const own = await getSummary(b)
      check(own.workspace.historyCount === 0 && own.workspace.followupCount === 0, 'SECOND_OWNER_SUMMARY_LEAK')
      for (const table of OWNED_TABLES.filter((table) => table !== 'dtc_outcome_write_requests')) {
        check(await ownedCount(table, a, b.auth) === 0, 'DIRECT_RLS_OWNER_LEAK')
      }
      const ownRead = sdkData(await a.auth.from('dtc_employment_outcomes').select('id').eq('user_id', a.id), 'OWN_RLS_READ_FAILED')
      check(ownRead.length === 1 && ownRead[0].id === employmentResponse.data.id, 'OWN_RLS_READ_MISSING')
      await post(b, { action: 'salary_outcome', requestId: randomUUID(), measurementRole: 'new_role', monthlyNetClp: 1, measuredAt: chileDate(), employmentOutcomeId: employmentResponse.data.id }, 422, 'INVALID_EMPLOYMENT_OUTCOME_ID')
      await post(b, { action: 'complete_followup', requestId: randomUUID(), followupId: due.id, employmentActive: false, sameRole: null }, 404, 'FOLLOWUP_NOT_FOUND')
      check(await ownedCount('dtc_salary_outcomes', b) === 0 && await ownedCount('dtc_outcome_write_requests', b) === 0, 'FAILED_FOREIGN_WRITES_LEFT_RECORDS')
      const forbiddenRpc = await b.auth.rpc('capture_dtc_chile_outcome', { p_user_id: a.id, p_request_id: randomUUID(), p_action: 'job_search_event', p_payload: {} })
      check(forbiddenRpc.error?.code === '42501', 'BROWSER_CAN_CALL_SERVICE_CAPTURE_RPC')
      const forbiddenLedger = await b.auth.from('dtc_outcome_write_requests').select('request_id').eq('user_id', b.id).limit(1)
      check(forbiddenLedger.error?.code === '42501', 'BROWSER_CAN_READ_REQUEST_PAYLOAD_LEDGER')
      return { ownerScopedSummary: true, directRlsIsolation: true, foreignSalaryRejected: true, foreignFollowupRejected: true, serviceRpcDenied: true, privateLedgerDenied: true }
    })
    await runCase('request-key-is-scoped-to-owner', async () => {
      const response = await post(b, { ...employmentBody, roleTitle: 'DTC control sintético B' })
      check(response.data.id !== employmentResponse.data.id, 'REQUEST_KEY_SHARED_BETWEEN_OWNERS')
      check(await ownedCount('dtc_employment_outcomes', b) === 1, 'SECOND_OWNER_INDEPENDENT_CAPTURE_FAILED')
    })
    await runCase('future-followup-rejected-without-reservation', async () => {
      const summary = await getSummary(a)
      const future = summary.workspace.followups.find((row) => row.day === 90)
      const requestId = randomUUID()
      await post(a, { action: 'complete_followup', requestId, followupId: future.id, employmentActive: true, sameRole: true }, 409, 'FOLLOWUP_NOT_DUE')
      const records = await admin.from('dtc_outcome_write_requests').select('request_id', { count: 'exact', head: true }).eq('user_id', a.id).eq('request_id', requestId)
      sdkData(records, 'REJECTED_REQUEST_READ_FAILED')
      check(records.count === 0, 'REJECTED_FOLLOWUP_LEFT_RESERVATION')
    })
    await runCase('contended-due-followup-first-response-cannot-be-overwritten', async () => {
      const first = { action: 'complete_followup', requestId: randomUUID(), followupId: due.id, employmentActive: true, sameRole: true }
      const second = { ...first, requestId: randomUUID(), employmentActive: false, sameRole: null }
      const responses = await settledValues([app(API_PATH, { owner: a, method: 'POST', body: first }), app(API_PATH, { owner: a, method: 'POST', body: second })])
      responses.forEach((result) => privateHeaders(result.response))
      check(responses.map((result) => result.response.status).sort().join(',') === '200,409', 'CONTENDED_FOLLOWUP_STATUSES_WRONG')
      const winnerIndex = responses.findIndex((result) => result.response.status === 200)
      const winner = responses[winnerIndex].data
      check(responses[1 - winnerIndex].data.error === 'FOLLOWUP_ALREADY_COMPLETED', 'CONTENDED_FOLLOWUP_LOSER_CODE_WRONG')
      check(sameJson(await post(a, winnerIndex === 0 ? first : second, 200), winner), 'FOLLOWUP_REPLAY_CHANGED')
      const after = (await getSummary(a)).workspace.followups.find((row) => row.id === due.id)
      check(after.state === 'completed' && after.canComplete === false && after.employmentActive === winner.data.employment_active && after.sameRole === winner.data.same_role, 'FOLLOWUP_WINNER_NOT_PERSISTED')
      return { concurrentReplies: 2, savedReply: 1, overwriteRejected: true, replayStable: true }
    })
    await runCase('real-browser-capture-refresh-followup-mobile-and-desktop', async () => {
      const browserConfig = {
        target: config.target, supabase: { url: config.supabase.url },
        browser: config.browser, evidenceDirectory: config.evidenceDirectory,
        vercelProtectionBypass: config.vercelProtectionBypass,
        vercelProtectionCookies: config.vercelProtectionCookies,
      }
      const browser = await runBrowserJourney({ config: browserConfig, a, b, getSummary, post, cancellation, requests,
        onHttpDiagnostic: (diagnostic) => recordHttpDiagnostic(diagnostic, 'browser'),
        onBrowserDiagnostic: recordBrowserDiagnostic,
      })
      report.browser = browser
      return { browserCases: browser.cases.length, screenshots: browser.screenshots.length, apiMocks: 0 }
    })
    report.verdict = 'GO'
  }
} catch (error) {
  report.verdict = 'NO_GO'
  report.failure = cancellation.requested ? `CANCELLED_BY_${cancellation.requested}` : failureCode(error)
} finally {
  cancellation.beginDrain()
  await requests.drain()
  cancellation.beginCleanup()
  activeCase = 'cleanup'
  if (execute && admin && (users.length || invitations.length)) {
    try { saveCheckpoint('cleanup') } catch { report.checkpointUpdateFailed = true }
    report.cleanup = await cleanup()
    if (!report.cleanup.completed) report.verdict = 'NO_GO'
  } else if (execute) report.cleanup = { required: true, completed: true, remoteWrites: 0 }
  if (cancellation.requested) { report.cancellationRequested = cancellation.requested; report.verdict = 'NO_GO' }
  report.finishedAt = new Date().toISOString()
  report.passed = report.cases.filter((entry) => entry.status === 'PASS').length
  report.failed = report.cases.filter((entry) => entry.status === 'FAIL').length
  if (evidenceReady) {
    try { saveCheckpoint(report.cleanup.completed ? 'complete' : 'incomplete') }
    catch { report.checkpointUpdateFailed = true; report.verdict = 'NO_GO' }
    try { writeFileSync(join(config.evidenceDirectory, 'report.json'), JSON.stringify(report, null, 2) + '\n', { flag: 'wx', mode: 0o600 }) }
    catch { report.verdict = 'NO_GO'; report.evidenceWriteFailed = true }
  }
  // No raw exceptions, responses, owner IDs, request IDs, cookies, passwords or keys leave this process.
  process.stdout.write(JSON.stringify(report) + '\n')
  process.exitCode = report.verdict === 'NO_GO' ? 1 : 0
}
