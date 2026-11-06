// Real password Route Handler, NextResponse and Supabase SSR/Auth SDK.
// Next's request cookie store and HTTP transport are synthetic; one explicit
// fault injection simulates an SDK cleanup that cannot be confirmed. No live account or RLS claim.
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import ts from 'typescript'
import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createClient as createSdkClient } from '@supabase/supabase-js'
import {
  PILOT_CLAIM_COOKIE, createInvitationCookieValue,
} from '../lib/auth/invitation-cookie.ts'
import { emailLoginErrorMessage, getEmailLoginContext } from '../lib/auth/email-login.ts'

const require = createRequire(import.meta.url)
const URL_BASE = 'https://synthetic.invalid'
const USER = '22222222-2222-4222-8222-222222222222'
const CLAIM = '11111111-1111-4111-8111-111111111111'
const SECRET = 'synthetic-invitation-cookie-secret-local-test-only'
const SESSION_COOKIE = 'sb-synthetic-auth-token'
const CREDENTIALS = { email: 'synthetic@example.invalid', password: 'synthetic-test-only' }
const source = readFileSync('app/api/auth/email-login/route.ts', 'utf8')
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText
const tests = []
const test = (name, run) => tests.push({ name, run })
const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { 'Content-Type': 'application/json', 'X-Supabase-Api-Version': '2024-01-01' },
})

function sessionFixture(previous = false) {
  const now = Math.floor(Date.now() / 1000)
  const token = [
    { alg: 'HS256', typ: 'JWT' },
    { sub: USER, aud: 'authenticated', role: 'authenticated', iat: now, exp: now + 3600,
      session_id: previous ? '44444444-4444-4444-8444-444444444444' : '33333333-3333-4333-8333-333333333333' },
  ].map(value => Buffer.from(JSON.stringify(value)).toString('base64url')).join('.') + '.synthetic-signature'
  return {
    access_token: token, refresh_token: previous ? 'synthetic-previous-refresh-token' : 'synthetic-new-refresh-token', token_type: 'bearer',
    expires_in: 3600, expires_at: now + 3600,
    user: { id: USER, aud: 'authenticated', role: 'authenticated', email: CREDENTIALS.email,
      email_confirmed_at: '2026-11-01T00:00:00Z', app_metadata: {}, user_metadata: {},
      created_at: '2026-11-01T00:00:00Z' },
  }
}

function harness(options = {}) {
  const events = [], cookies = new Map(), cookieWrites = [], revokedSessionIds = []
  const signedClaim = createInvitationCookieValue(CLAIM, SECRET)
  if (options.claim !== undefined) cookies.set(PILOT_CLAIM_COOKIE, options.claim === true ? signedClaim : options.claim)
  if (options.existingSession) cookies.set(SESSION_COOKIE, 'base64-' + Buffer.from(JSON.stringify(sessionFixture(true))).toString('base64url'))
  const originalSession = cookies.get(SESSION_COOKIE)
  let authClients = 0, adminClients = 0, client
  const cookieStore = {
    get: name => cookies.has(name) ? { name, value: cookies.get(name) } : undefined,
    getAll: () => [...cookies].map(([name, value]) => ({ name, value })),
    set: (name, value, cookieOptions = {}) => {
      cookieWrites.push({ name, removed: !value || cookieOptions.maxAge === 0 })
      if (!value || cookieOptions.maxAge === 0) cookies.delete(name)
      else cookies.set(name, value)
    },
  }
  const transport = async (target, init = {}) => {
    const url = new URL(String(target))
    assert.equal(url.origin, URL_BASE, 'Only the synthetic transport may run.')
    if (url.pathname === '/auth/v1/token') {
      assert.equal(url.searchParams.get('grant_type'), 'password')
      const input = JSON.parse(init.body)
      events.push({ type: 'password', email: input.email, password: input.password })
      if (options.authFailure) return json({ code: options.authFailure.code, message: 'PRIVATE_AUTH_DETAIL' }, options.authFailure.status)
      if (options.malformedAuth) return json({ user: sessionFixture().user })
      return json(sessionFixture())
    }
    if (url.pathname === '/auth/v1/logout') {
      events.push({ type: 'signout', scope: url.searchParams.get('scope') })
      const authorization = new Headers(init.headers).get('authorization')
      revokedSessionIds.push(JSON.parse(Buffer.from(authorization.split('.')[1], 'base64url').toString()).session_id)
      return options.revokeFailure ? json({ message: 'PRIVATE_REVOKE_DETAIL' }, 503) : new Response(null, { status: 204 })
    }
    if (url.pathname === '/rest/v1/rpc/resolve_pilot_access') {
      const input = JSON.parse(init.body)
      events.push({ type: 'policy', ...input })
      if (options.policyFailure) return json({ code: 'XX000', message: 'PRIVATE_POLICY_DETAIL' }, 503)
      if (options.policyData !== undefined) return json(options.policyData)
      return json([{ allowed: options.allowed ?? true, access_kind: 'invited', membership_id: 'synthetic-membership' }])
    }
    throw Error('Unexpected synthetic transport path: ' + url.pathname)
  }
  const makeServerClient = (url, key, opts) => {
    authClients++
    assert.equal(url, URL_BASE)
    client = createServerClient(url, key, { ...opts, global: { fetch: transport } })
    if (options.cleanupUnconfirmed) {
      client.auth.signOut = async ({ scope }) => { events.push({ type: 'signout', scope }); return { error: null } }
    }
    return client
  }
  const makeAdmin = () => {
    adminClients++
    if (options.adminThrows) throw new Error('PRIVATE_ADMIN_CONFIGURATION')
    return createSdkClient(URL_BASE, 'synthetic-admin-key', {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }, global: { fetch: transport },
    })
  }
  const dependencies = {
    'next/server': { NextResponse },
    'next/headers': { cookies: async () => cookieStore },
    '@supabase/ssr': { createServerClient: makeServerClient },
    '@/lib/supabase/server': {
      createAdminClient: makeAdmin,
      createClient: async () => makeServerClient(URL_BASE, 'synthetic-anon-key', {
        cookies: { getAll: cookieStore.getAll, setAll: values => values.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) },
      }),
    },
  }
  const module = { exports: {} }
  new Function('require', 'module', 'exports', compiled)(name => {
    if (Object.hasOwn(dependencies, name)) return dependencies[name]
    if (name.startsWith('@/lib/auth/')) return require('../' + name.slice(2) + '.ts')
    throw new Error('Unexpected route dependency: ' + name)
  }, module, module.exports)

  return {
    events, cookies, cookieWrites, signedClaim, originalSession, revokedSessionIds,
    get authClients() { return authClients },
    get adminClients() { return adminClients },
    get client() { return client },
    async post(value = CREDENTIALS, raw, query = '') {
      const response = await module.exports.POST(new Request(URL_BASE + '/api/auth/email-login' + query, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: raw ?? JSON.stringify(value),
      }))
      // Apply only cookies that the response would deliver to a browser. The baseline
      // server factory also supports Next's mutable request cookie store above.
      for (const cookie of response.cookies.getAll()) cookieStore.set(cookie.name, cookie.value, cookie)
      const body = await response.json()
      assert.doesNotMatch(JSON.stringify(body), /PRIVATE_|access_token|refresh_token|membership_id|synthetic@example/)
      return { response, body }
    },
  }
}

test('malformed JSON and non-object payloads return 400 before Auth', async () => {
  for (const raw of ['{', 'null', '[]', '"text"']) {
    const h = harness(), { response } = await h.post(undefined, raw)
    assert.equal(response.status, 400)
    assert.equal(h.authClients, 0)
  }
})
test('missing or oversized credentials never reach Auth', async () => {
  for (const value of [{}, { email: ' ', password: 'x' }, { ...CREDENTIALS, password: '' },
    { ...CREDENTIALS, email: 'x'.repeat(255) }, { ...CREDENTIALS, password: 'x'.repeat(257) }]) {
    const h = harness(), { response } = await h.post(value)
    assert.equal(response.status, 400)
    assert.equal(h.authClients, 0)
  }
})
test('service outage is 503, retains claim and does not authorize or sign out', async () => {
  const h = harness({ claim: true, authFailure: { status: 503 } })
  const { response, body } = await h.post()
  assert.equal(response.status, 503)
  assert.equal(body.error, 'authentication_unavailable')
  assert.equal(h.cookies.get(PILOT_CLAIM_COOKIE), h.signedClaim)
  assert.deepEqual(h.events.map(event => event.type), ['password'])
})
test('provider quota is 429 rather than bad credentials', async () => {
  const h = harness({ claim: true, authFailure: { status: 429, code: 'over_request_rate_limit' } })
  const { response, body } = await h.post()
  assert.equal(response.status, 429)
  assert.equal(body.error, 'rate_limited')
  assert.equal(h.cookies.get(PILOT_CLAIM_COOKIE), h.signedClaim)
  assert.equal(h.adminClients, 0)
})
test('wrong password is 401 and preserves an existing browser session and invitation', async () => {
  const h = harness({ claim: true, existingSession: true, authFailure: { status: 400, code: 'invalid_credentials' } })
  const { response, body } = await h.post()
  assert.equal(response.status, 401)
  assert.equal(body.error, 'invalid_credentials')
  assert.equal(h.cookies.get(PILOT_CLAIM_COOKIE), h.signedClaim)
  assert.equal(h.cookies.get(SESSION_COOKIE), h.originalSession)
  assert.deepEqual(h.events.map(event => event.type), ['password'])
})
test('unconfirmed email is actionable without consuming the invitation', async () => {
  const h = harness({ claim: true, authFailure: { status: 400, code: 'email_not_confirmed' } })
  const { response, body } = await h.post()
  assert.equal(response.status, 403)
  assert.equal(body.error, 'email_not_confirmed')
  assert.equal(h.cookies.get(PILOT_CLAIM_COOKIE), h.signedClaim)
  assert.equal(h.adminClients, 0)
})
test('successful password precedes redemption of the signed invitation and sends SSR session cookies', async () => {
  const h = harness({ claim: true })
  const { response, body } = await h.post({ email: '  SYNTHETIC@EXAMPLE.INVALID ', password: '  exact password  ' })
  assert.equal(response.status, 200)
  assert.deepEqual(body, { success: true })
  assert.deepEqual(h.events.map(event => event.type), ['password', 'policy'])
  assert.equal(h.events[0].email, CREDENTIALS.email)
  assert.equal(h.events[0].password, '  exact password  ')
  assert.deepEqual(h.events[1], { type: 'policy', p_user_id: USER, p_claim_id: CLAIM })
  assert.equal(h.cookies.has(PILOT_CLAIM_COOKIE), false)
  assert.ok(h.cookies.get(SESSION_COOKIE), 'The success response must already contain the session cookie.')
  assert.match(response.headers.get('cache-control'), /private, no-store/)
})
test('an existing member can enter without an invitation', async () => {
  const h = harness(), { response } = await h.post()
  assert.equal(response.status, 200)
  assert.equal(h.events.find(event => event.type === 'policy')?.p_claim_id, null)
  assert.ok(h.cookies.get(SESSION_COOKIE))
})
test('valid password without pilot access is 403 and retires the new current session', async () => {
  const h = harness({ claim: true, allowed: false })
  const { response, body } = await h.post()
  assert.equal(response.status, 403)
  assert.equal(body.error, 'access_required')
  assert.equal(h.cookies.has(SESSION_COOKIE), false)
  assert.equal(h.cookies.has(PILOT_CLAIM_COOKIE), false)
  assert.deepEqual(h.events.find(event => event.type === 'signout'), { type: 'signout', scope: 'local' })
  assert.equal((await h.client.auth.getSession()).data.session, null)
})
test('forged claim and public invitation parameters cannot authorize access', async () => {
  for (const claim of [CLAIM, CLAIM + '.tampered', undefined]) {
    const h = harness({ claim, allowed: false })
    const { response } = await h.post({ ...CREDENTIALS, claimId: CLAIM, invited: true }, undefined, '?invited=1&claimId=' + CLAIM)
    assert.equal(response.status, 403)
    assert.equal(h.events.find(event => event.type === 'policy')?.p_claim_id, null)
    assert.equal(h.cookies.has(SESSION_COOKIE), false)
  }
})
test('policy outage clears the new session, retains the invitation and permits a later retry', async () => {
  const options = { claim: true, policyFailure: true }
  const h = harness(options)
  const failure = await h.post()
  assert.equal(failure.response.status, 503)
  assert.equal(failure.body.error, 'authentication_unavailable')
  assert.equal(h.cookies.get(PILOT_CLAIM_COOKIE), h.signedClaim)
  assert.equal(h.cookies.has(SESSION_COOKIE), false)
  options.policyFailure = false
  const success = await h.post()
  assert.equal(success.response.status, 200)
  assert.equal(h.cookies.has(PILOT_CLAIM_COOKIE), false)
  assert.ok(h.cookies.get(SESSION_COOKIE))
})
test('unexpected policy results never grant access or consume a claim', async () => {
  for (const policyData of [[], null, {}, [{ allowed: 'true' }]]) {
    const h = harness({ claim: true, policyData })
    const { response } = await h.post()
    assert.equal(response.status, 503)
    assert.equal(h.cookies.get(PILOT_CLAIM_COOKIE), h.signedClaim)
    assert.equal(h.cookies.has(SESSION_COOKIE), false)
  }
})
test('missing policy configuration is recoverable and clears the new session', async () => {
  const h = harness({ claim: true, adminThrows: true }), { response } = await h.post()
  assert.equal(response.status, 503)
  assert.equal(h.cookies.get(PILOT_CLAIM_COOKIE), h.signedClaim)
  assert.equal(h.cookies.has(SESSION_COOKIE), false)
})
test('a malformed Auth success is never permission to enter', async () => {
  const h = harness({ claim: true, malformedAuth: true }), { response } = await h.post()
  assert.equal(response.status, 503)
  assert.equal(h.adminClients, 0)
  assert.equal(h.cookies.get(PILOT_CLAIM_COOKIE), h.signedClaim)
  assert.equal(h.cookies.has(SESSION_COOKIE), false)
})
test('a remote revoke failure does not retain the denied local session', async () => {
  const h = harness({ allowed: false, revokeFailure: true }), { response } = await h.post()
  assert.equal(response.status, 403)
  assert.equal(h.cookies.has(SESSION_COOKIE), false)
  assert.equal((await h.client.auth.getSession()).data.session, null)
})
test('an unconfirmed cleanup emits no new session or success', async () => {
  const h = harness({ claim: true, allowed: false, cleanupUnconfirmed: true }), { response, body } = await h.post()
  assert.equal(response.status, 503)
  assert.notEqual(body.success, true)
  assert.equal(h.cookies.has(SESSION_COOKIE), false)
  assert.equal(h.cookies.get(PILOT_CLAIM_COOKIE), h.signedClaim)
})
test('a policy outage during a new login preserves the previous browser session', async () => {
  const h = harness({ existingSession: true, claim: true, policyFailure: true })
  const { response } = await h.post()
  assert.equal(response.status, 503)
  assert.equal(h.cookies.get(SESSION_COOKIE) === h.originalSession, true, 'The previous browser cookie must remain unchanged.')
  assert.equal(h.cookies.get(PILOT_CLAIM_COOKIE), h.signedClaim)
  assert.equal((await h.client.auth.getSession()).data.session, null, 'The new staged SDK session is still retired.')
  assert.deepEqual(h.events.find(event => event.type === 'signout'), { type: 'signout', scope: 'local' })
  assert.deepEqual(h.revokedSessionIds, ['33333333-3333-4333-8333-333333333333'])
})
test('a denied new login preserves the previous browser session without accepting the new account', async () => {
  const h = harness({ existingSession: true, claim: true, allowed: false })
  const { response, body } = await h.post()
  assert.equal(response.status, 403)
  assert.equal(body.error, 'access_required')
  assert.equal(h.cookies.get(SESSION_COOKIE) === h.originalSession, true, 'The previous browser cookie must remain unchanged.')
  assert.equal(h.cookies.has(PILOT_CLAIM_COOKIE), false)
  assert.equal((await h.client.auth.getSession()).data.session, null)
  assert.deepEqual(h.revokedSessionIds, ['33333333-3333-4333-8333-333333333333'])
})
test('the return link preserves the requested journey, invitation context and recognized recovery', () => {
  const next = '/despega/a2/m1?step=2&tab=practice#resume'
  const context = getEmailLoginContext(new URLSearchParams({ next, invited: '1', reason: 'authentication_verification_failed' }).toString())
  const back = new URL(context.signInHref, URL_BASE)
  assert.equal(context.nextPath, next)
  assert.equal(back.pathname, '/auth/signin')
  assert.equal(back.searchParams.get('next'), next)
  assert.equal(back.searchParams.get('invited'), '1')
  assert.equal(back.searchParams.get('reason'), 'authentication_verification_failed')
  assert.ok(context.recovery)
})
test('direct email entry has a journey default and untrusted return targets stay on this site', () => {
  assert.equal(getEmailLoginContext('').nextPath, '/despega/recorrido')
  for (const next of ['https://other.invalid', '//other.invalid/path', '/\\other.invalid']) {
    const context = getEmailLoginContext(new URLSearchParams({ next }).toString())
    assert.equal(context.nextPath, '/despega')
    assert.equal(new URL(context.signInHref, URL_BASE).searchParams.get('next'), '/despega')
  }
})
test('unsupported public recovery values are neither rendered nor forwarded', () => {
  const context = getEmailLoginContext('next=/despega/recorrido&reason=PRIVATE_INJECTED_MESSAGE&invited=true')
  assert.equal(context.recovery, null)
  assert.equal(context.invited, false)
  assert.equal(new URL(context.signInHref, URL_BASE).searchParams.has('reason'), false)
  assert.equal(new URL(context.signInHref, URL_BASE).searchParams.has('invited'), false)
})
test('HTML outages and middleware quota responses produce safe actionable Spanish messages', () => {
  const unavailable = emailLoginErrorMessage(503, null)
  const rateLimited = emailLoginErrorMessage(429, { message: 'PRIVATE_UPSTREAM_DIAGNOSTIC', retryAfter: 300 })
  assert.match(unavailable, /Intenta nuevamente/)
  assert.match(rateLimited, /Espera unos minutos/)
  assert.doesNotMatch(rateLimited, /PRIVATE_|retryAfter/)
  assert.equal(emailLoginErrorMessage(503, { message: 'PRIVATE_DATABASE_DETAIL' }), unavailable)
})

const fixture = {
  NEXT_PUBLIC_SUPABASE_URL: URL_BASE, NEXT_PUBLIC_SUPABASE_ANON_KEY: 'synthetic-anon-key',
  SUPABASE_SERVICE_ROLE_KEY: 'synthetic-server-role-key-for-local-tests-only', PILOT_INVITATION_COOKIE_SECRET: SECRET,
}
const previousEnv = new Map(Object.keys(fixture).map(name => [name, process.env[name]]))
const previousFetch = globalThis.fetch
let networkCalls = 0, failed = 0
try {
  Object.assign(process.env, fixture)
  globalThis.fetch = async () => { networkCalls++; throw new Error('Network forbidden in email-login regression tests.') }
  for (const { name, run } of tests) {
    try { await run(); console.log('PASS ' + name) }
    catch (error) { failed++; console.error('FAIL ' + name + ': ' + error.message) }
  }
  assert.equal(networkCalls, 0)
  console.log(JSON.stringify({ suite: 'email-login', cases: tests.length, passed: tests.length - failed, failed,
    handler: 'real', sdk: 'real', http: 'synthetic', liveNetworkCalls: networkCalls }))
  if (failed) process.exitCode = 1
} finally {
  globalThis.fetch = previousFetch
  for (const [name, value] of previousEnv) {
    if (value === undefined) delete process.env[name]
    else process.env[name] = value
  }
}
