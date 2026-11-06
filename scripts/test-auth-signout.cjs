// DTC-AUTH-03: actual middleware, route, SSR cookie codec and installed Auth SDK.
// All credentials/accounts/transports are synthetic; no hosted backend is used.
const assert = require('node:assert/strict')
const fs = require('node:fs')
const { execFileSync } = require('node:child_process')
const ts = require('typescript')
const { NextRequest, NextResponse } = require('next/server')
const { createServerClient } = require('@supabase/ssr')
const { clearCurrentSession } = require('../lib/auth/current-session.ts')
const baseline = process.env.DTC_TEST_AUTH_BASELINE
const tests = []
const test = (name, run) => tests.push({ name, run })
const source = path => baseline
  ? execFileSync('git', ['show', `${baseline}:${path}`], { encoding: 'utf8' })
  : fs.readFileSync(path, 'utf8')
function compile(path, dependencies) {
  const compiled = ts.transpileModule(source(path), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText
  const module = { exports: {} }
  new Function('require', 'module', 'exports', compiled)(key => {
    if (Object.hasOwn(dependencies, key)) return dependencies[key]
    if (key.startsWith('@/')) return require('../' + key.slice(2))
    return require(key)
  }, module, module.exports)
  return module.exports
}
const { middleware } = compile('middleware.ts', {})
const request = (path, ip, method = 'GET') => new NextRequest(`http://localhost:3000${path}`, {
  method, headers: { 'x-forwarded-for': ip },
})

test('five pilot-status reads do not consume a login attempt', async () => {
  const ip = '198.18.2.1'
  for (let i = 0; i < 5; i++) assert.equal((await middleware(request('/api/auth/pilot-status', ip))).status, 200)
  assert.equal((await middleware(request('/api/auth/email-login', ip, 'POST'))).status, 200)
})
test('logout still reaches its handler after the five-attempt login allowance', async () => {
  const ip = '198.18.2.2'
  for (let i = 0; i < 5; i++) assert.equal((await middleware(request('/api/auth/email-login', ip, 'POST'))).status, 200)
  const blocked = await middleware(request('/api/auth/email-login', ip, 'POST'))
  assert.equal(blocked.status, 429)
  assert.ok(Number(blocked.headers.get('retry-after')) > 0)
  assert.equal((await middleware(request('/api/auth/signout', ip, 'POST'))).status, 200)
  // Only the existing POST logout operation is exempt, not an auth wildcard.
  assert.equal((await middleware(request('/api/auth/signout', ip))).status, 429)
})
test('logout remains possible after ordinary API exhaustion', async () => {
  const ip = '198.18.2.3'
  for (let i = 0; i < 100; i++) assert.equal((await middleware(request('/api/auth/pilot-status', ip))).status, 200)
  assert.equal((await middleware(request('/api/auth/pilot-status', ip))).status, 429)
  assert.equal((await middleware(request('/api/auth/signout', ip, 'POST'))).status, 200)
  assert.equal((await middleware(request('/api/auth/email-login', ip, 'POST'))).status, 200)
})
test('login keeps five attempts and a fifteen-minute window', async () => {
  const originalNow = Date.now
  let now = originalNow()
  Date.now = () => now
  try {
    const ip = '198.18.2.4'
    for (let i = 0; i < 5; i++) assert.equal((await middleware(request('/api/auth/email-login', ip, 'POST'))).status, 200)
    assert.equal((await middleware(request('/api/auth/email-login', ip, 'POST'))).status, 429)
    now += 15 * 60 * 1000 - 1
    assert.equal((await middleware(request('/api/auth/email-login', ip, 'POST'))).status, 429)
    now += 2
    assert.equal((await middleware(request('/api/auth/email-login', ip, 'POST'))).status, 200)
  } finally { Date.now = originalNow }
})

const USER_ID = '00000000-0000-4000-8000-000000000031'
const USER = {
  id: USER_ID, email: 'logout-fixture@example.invalid', aud: 'authenticated', role: 'authenticated',
  created_at: '2026-11-01T00:00:00Z', app_metadata: {}, user_metadata: {}, identities: [],
}
const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { 'Content-Type': 'application/json' },
})
async function routeHarness(options = {}) {
  const jar = new Map()
  const revokeScopes = []
  const cookieStore = {
    getAll: () => Array.from(jar, ([name, value]) => ({ name, value })),
    set: (name, value) => value ? jar.set(name, value) : jar.delete(name),
    delete: name => jar.delete(name),
  }
  const transport = async target => {
    const url = new URL(String(target))
    assert.equal(url.hostname, 'logout.synthetic.invalid')
    if (url.pathname === '/auth/v1/token') {
      if (url.searchParams.get('grant_type') === 'refresh_token' && options.expiredSession) {
        return json({ code: 'refresh_token_not_found', msg: 'Synthetic session has expired.' }, 400)
      }
      const expires_at = Math.floor(Date.now() / 1000) + (options.expiredSession ? -60 : 3600)
      const access_token = [
        { alg: 'HS256', typ: 'JWT' },
        { sub: USER_ID, role: 'authenticated', exp: expires_at, session_id: 'synthetic-session' },
      ].map(value => Buffer.from(JSON.stringify(value)).toString('base64url')).join('.') + '.synthetic'
      return json({ access_token, refresh_token: 'synthetic-refresh', expires_in: 3600,
        expires_at, token_type: 'bearer', user: options.chunkedSession
          ? { ...USER, user_metadata: { synthetic_claim: 'fixture'.repeat(1000) } }
          : USER })
    }
    if (url.pathname === '/auth/v1/logout') {
      revokeScopes.push(url.searchParams.get('scope'))
      return options.revokeFails
        ? json({ code: 'unexpected_failure', message: 'PRIVATE_REVOCATION_DETAIL' }, 503)
        : new Response(null, { status: 204 })
    }
    throw new Error(`Unexpected synthetic request: ${url.pathname}`)
  }
  const sdk = (url, key, config) => {
    const client = createServerClient(url, key, { ...config, global: { fetch: transport } })
    if (options.retainSession) client.auth.signOut = async () => ({ error: new Error('PRIVATE_STORAGE_DETAIL') })
    return client
  }
  const legacyClient = () => sdk('https://logout.synthetic.invalid', 'synthetic-public-key', {
    cookies: { getAll: cookieStore.getAll, setAll: updates => updates.forEach(({ name, value }) => cookieStore.set(name, value)) },
  })
  const seed = legacyClient()
  await seed.auth.initialize()
  assert.ifError((await seed.auth.signInWithPassword({ email: USER.email, password: 'Synthetic-password-123!' })).error)
  const authCookies = () => [...jar.keys()].filter(name => name.startsWith('sb-logout-auth-token'))
  assert.ok(authCookies().length, 'fixture must establish actual SSR session cookies')
  jar.set('demo_user', 'retired-synthetic-cookie')
  const before = new Map(jar)
  const route = compile('app/api/auth/signout/route.ts', {
    'next/headers': { cookies: async () => cookieStore },
    'next/server': { NextResponse },
    '@supabase/ssr': { createServerClient: options.createThrows ? () => { throw new Error('PRIVATE_CONFIG_DETAIL') } : sdk },
    '@/lib/supabase/server': { createClient: async () => legacyClient() },
    '@/lib/auth/current-session': { clearCurrentSession },
  })
  return { jar, before, revokeScopes, authCookies, post: async (accept = 'application/json') => {
    const response = await route.POST(new Request('http://localhost:3000/api/auth/signout', {
      method: 'POST', headers: { accept },
    }))
    for (const { name, value } of response.cookies.getAll()) cookieStore.set(name, value)
    return response
  } }
}
const previousEnv = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
}
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://logout.synthetic.invalid'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'synthetic-public-key'

test('JSON logout confirms current scope and deletes real SSR cookies', async () => {
  const h = await routeHarness()
  const response = await h.post()
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { success: true, scope: 'local' })
  assert.deepEqual(h.revokeScopes, ['local'])
  assert.deepEqual(h.authCookies(), [])
  assert.equal(h.jar.has('demo_user'), false)
  assert.match(response.headers.get('cache-control'), /private, no-store/)
})
test('SDK local deletion is confirmed even when remote revocation returns 503', async () => {
  const h = await routeHarness({ revokeFails: true })
  const response = await h.post()
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { success: true, scope: 'local' })
  assert.deepEqual(h.revokeScopes, ['local'])
  assert.deepEqual(h.authCookies(), [])
})
test('expired and already-removed sessions can still finish logout', async () => {
  const h = await routeHarness({ expiredSession: true })
  const originalError = console.error
  const reported = []
  console.error = (...args) => reported.push(args)
  try {
    for (let i = 0; i < 2; i++) {
      const response = await h.post()
      assert.equal(response.status, 200)
      assert.deepEqual(await response.json(), { success: true, scope: 'local' })
      assert.deepEqual(h.authCookies(), [])
    }
  } finally { console.error = originalError }
  for (const [error] of reported) assert.equal(error.message, 'Synthetic session has expired.')
})
test('every chunk of a large SSR session is removed on the confirmed response', async () => {
  const h = await routeHarness({ chunkedSession: true })
  assert.ok(h.authCookies().length > 1, 'fixture must contain multiple cookie chunks')
  assert.equal((await h.post()).status, 200)
  assert.deepEqual(h.authCookies(), [])
})
test('unconfirmed local deletion returns 503 without redirect or cookie changes', async () => {
  const h = await routeHarness({ retainSession: true })
  const response = await h.post()
  assert.equal(response.status, 503)
  assert.equal(response.headers.get('location'), null)
  assert.deepEqual(h.jar, h.before)
  assert.equal((await response.json()).success, false)
})
test('configuration/handler failures remain recoverable and hide internals', async () => {
  const h = await routeHarness({ createThrows: true })
  const response = await h.post()
  assert.equal(response.status, 503)
  assert.equal(response.headers.get('location'), null)
  assert.deepEqual(h.jar, h.before)
  assert.doesNotMatch(await response.text(), /PRIVATE_/)
})
test('native POST fallback redirects only after removing the current session', async () => {
  const h = await routeHarness()
  const response = await h.post('text/html')
  assert.equal(response.status, 303)
  assert.equal(new URL(response.headers.get('location')).pathname, '/auth/signin')
  assert.deepEqual(h.revokeScopes, ['local'])
  assert.deepEqual(h.authCookies(), [])
})

if (baseline) {
  test('original AppShell does not navigate when logout returns 429', async () => {
    const file = ts.createSourceFile('shell.tsx', source('components/layout/app-shell.tsx'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
    let handler
    const visit = node => {
      if (ts.isVariableDeclaration(node) && node.name.getText(file) === 'handleLogout') handler = node.initializer.getText(file)
      ts.forEachChild(node, visit)
    }
    visit(file)
    assert.ok(handler)
    const navigations = []
    const run = new Function('fetch', 'router', `return (${handler})`)(
      async () => json({ error: 'rate_limited' }, 429), { replace: path => navigations.push(path) },
    )
    await run()
    assert.deepEqual(navigations, [])
  })
} else {
  const originalFetch = global.fetch
  const originalWindow = global.window
  async function clientRun(responseOrError, cleanupThrows = false) {
    const navigations = [], requests = []
    let cleanupCalls = 0
    global.fetch = async (...args) => {
      requests.push(args)
      if (responseOrError instanceof Error) throw responseOrError
      return responseOrError
    }
    global.window = { location: { replace: path => navigations.push(path) } }
    const client = compile('lib/auth/signout-client.ts', {
      '@/lib/supabase/client': { createClient: () => ({ auth: {} }) },
      '@/lib/auth/current-session': { clearCurrentSession: async () => {
        cleanupCalls++
        if (cleanupThrows) throw new Error('synthetic notification error')
        return { cleared: true, revocationConfirmed: true }
      } },
    })
    let error
    try { await client.signOutCurrentBrowser() } catch (caught) { error = caught }
    finally { global.fetch = originalFetch; global.window = originalWindow }
    return { navigations, requests, cleanupCalls, error }
  }
  for (const status of [429, 503]) test(`client preserves its session and view after HTTP ${status}`, async () => {
    const result = await clientRun(json({ success: false }, status))
    assert.ok(result.error)
    assert.deepEqual(result.navigations, [])
    assert.equal(result.cleanupCalls, 0)
  })
  test('client preserves its session and view after a network failure', async () => {
    const result = await clientRun(new TypeError('synthetic offline'))
    assert.ok(result.error)
    assert.deepEqual(result.navigations, [])
    assert.equal(result.cleanupCalls, 0)
  })
  test('client does not confuse an HTML redirect or malformed confirmation with logout', async () => {
    for (const response of [new Response('<html>signin</html>'), json({ success: true }), json({ success: false })]) {
      const result = await clientRun(response)
      assert.ok(result.error)
      assert.deepEqual(result.navigations, [])
      assert.equal(result.cleanupCalls, 0)
    }
  })
  test('confirmed logout notifies the SDK and replaces the document', async () => {
    for (const cleanupThrows of [false, true]) {
      const result = await clientRun(json({ success: true, scope: 'local' }), cleanupThrows)
      assert.ifError(result.error)
      assert.equal(result.cleanupCalls, 1)
      assert.deepEqual(result.navigations, ['/auth/signin'])
      assert.equal(result.requests[0][1].headers.Accept, 'application/json')
    }
  })
}

;(async () => {
  let failed = 0
  for (const { name, run } of tests) {
    try { await run(); console.log(`PASS ${name}`) }
    catch (error) { failed++; console.error(`FAIL ${name}: ${error.message}`) }
  }
  for (const [key, previous] of [['NEXT_PUBLIC_SUPABASE_URL', previousEnv.url], ['NEXT_PUBLIC_SUPABASE_ANON_KEY', previousEnv.key]]) {
    if (previous === undefined) delete process.env[key]
    else process.env[key] = previous
  }
  console.log(JSON.stringify({ suite: 'DTC-AUTH-03', baseline: baseline || null, passed: tests.length - failed, failed }))
  if (failed) process.exitCode = 1
})()
