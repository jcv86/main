import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { createWriteStream, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { CLOSURE_BASE as base, CLOSURE_PORT, closureLab, closureServerEnv, safeFailure } from './closure-lab.mjs'
import { AUTH_VIEWPORTS, assertAuthSources, authTestHeaders, readAuthFixtures } from './auth-lab.mjs'

const { root, app, repo, status, evidence } = closureLab()
const fixture = readAuthFixtures(root)
const manifest = JSON.parse(readFileSync(join(root, 'auth-prepared.json'), 'utf8'))
assertAuthSources(manifest, app, repo)
const requireTool = createRequire(join(process.env.A1_TOOLS_ROOT, 'package.json'))
const requireApp = createRequire(join(repo, 'package.json'))
const { chromium } = requireTool('playwright')
const { default: AxeBuilder } = requireTool('@axe-core/playwright')
const { Client } = requireApp('pg')
const db = new Client({ connectionString: status.DB_URL })
const secrets = [fixture.password, fixture.returning.password, status.ANON_KEY, status.SERVICE_ROLE_KEY,
  status.DB_URL, ...fixture.users.map(user => user.invitationToken).filter(Boolean)]
const steps = [], accessibility = [], layouts = [], javascriptErrors = [], consoleErrors = []
const authResponses = [], controlledFailures = [], contexts = [], requestFailures = [], backgroundReadiness = []
const expectedErrors = new Map(), blockedHosts = new Set(), backgroundReads = new WeakMap()
let browser, server, serverLog, activeStep = 'setup', controlledFault = false
const pause = ms => new Promise(resolve => setTimeout(resolve, ms))
const record = name => { steps.push({ name, status: 'PASS' }); console.log(`Real email-auth: ${name}: PASS`) }

async function startServer() {
  serverLog = createWriteStream(join(root, 'auth-server.private.log'), { mode: 0o600 })
  server = spawn(process.execPath, [join(repo, 'node_modules/next/dist/bin/next'),
    'dev', '--hostname', 'localhost', '--port', String(CLOSURE_PORT)], {
    cwd: app, env: closureServerEnv(status), stdio: ['ignore', 'pipe', 'pipe'],
  })
  server.stdout.pipe(serverLog); server.stderr.pipe(serverLog)
  for (let attempt = 0; attempt < 120; attempt += 1) {
    assert.equal(server.exitCode, null, 'Local Next server stopped before readiness')
    try { if ((await fetch(base)).ok) return } catch {}
    await pause(500)
  }
  throw new Error('Real email-auth server did not become ready within 60 seconds')
}

async function stopServer() {
  if (server && server.exitCode === null) {
    const ended = once(server, 'exit')
    server.kill('SIGTERM')
    const timer = setTimeout(() => server?.kill('SIGKILL'), 5000)
    await ended
    clearTimeout(timer)
  }
  serverLog?.end()
}

function expectError(path, statusCode) {
  if (statusCode < 400) return
  const key = `${path}:${statusCode}`
  expectedErrors.set(key, (expectedErrors.get(key) || 0) + 1)
}

async function newPage(viewport, scenario) {
  const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height },
    reducedMotion: 'reduce', extraHTTPHeaders: authTestHeaders(viewport, scenario) })
  contexts.push(context)
  // All successful requests use the real application/local Auth. The only
  // fulfilment below is a declared sign-out failure, never an admission success.
  await context.route('**/*', route => {
    const url = new URL(route.request().url())
    if (['localhost', '127.0.0.1'].includes(url.hostname)) return route.continue()
    blockedHosts.add(url.hostname)
    return route.abort()
  })
  context.on('page', page => {
    const reads = { scoreStarted: 0, economicFinished: 0, pending: new Set() }
    backgroundReads.set(page, reads)
    page.setDefaultTimeout(30000)
    page.setDefaultNavigationTimeout(60000)
    // Even during a deliberate HTTP failure, every uncaught JS error is fatal.
    page.on('pageerror', error => javascriptErrors.push({ step: activeStep,
      name: error.name, message: safeFailure(error, secrets), controlledFault }))
    page.on('console', message => {
      if (message.type() !== 'error') return
      const text = message.text()
      let path = null
      try { path = new URL(message.location().url).pathname } catch {}
      consoleErrors.push({ step: activeStep, path,
        kind: /^Failed to load resource:/.test(text) ? 'http_resource_failure' : 'javascript_console_error',
        message: safeFailure(new Error(text), secrets), controlledFault })
    })
    page.on('request', request => {
      const url = new URL(request.url())
      if (url.origin !== base) return
      if (url.pathname === '/api/a4-strategic-score') {
        reads.scoreStarted += 1
        reads.pending.add(request)
      } else if (url.pathname === '/api/banco-central-data') reads.pending.add(request)
    })
    page.on('requestfinished', request => {
      if (!reads.pending.has(request)) return
      if (new URL(request.url()).pathname === '/api/banco-central-data') reads.economicFinished += 1
      reads.pending.delete(request)
    })
    page.on('requestfailed', request => {
      reads.pending.delete(request)
      const url = new URL(request.url())
      requestFailures.push({ step: activeStep, viewport: viewport.name, scenario,
        path: url.pathname, method: request.method(), error: request.failure()?.errorText || 'unknown', controlledFault })
    })
    page.on('response', response => {
      const url = new URL(response.url())
      if (url.origin !== base || !url.pathname.startsWith('/api/auth/')) return
      const statusCode = response.status(), key = `${url.pathname}:${statusCode}`
      const expected = statusCode < 400 || (expectedErrors.get(key) || 0) > 0
      if (statusCode >= 400 && expected) expectedErrors.set(key, expectedErrors.get(key) - 1)
      authResponses.push({ step: activeStep, path: url.pathname, method: response.request().method(),
        status: statusCode, expected, controlledFault })
    })
  })
  return context.newPage()
}

async function settleBeforeNavigation(page) {
  if (new URL(page.url()).origin !== base) return
  if (await page.locator('[data-auth-lab-session]').count()) {
    // The state change confirms hydration/effects have started. The genuine
    // Coach Provider makes two sequential background reads even on sign-in.
    await page.waitForFunction(() => {
      const observer = document.querySelector('[data-auth-lab-session]')
      return observer && observer.getAttribute('data-state') !== 'loading'
    })
  }
  const reads = backgroundReads.get(page)
  for (let attempt = 0; attempt < 300; attempt += 1) {
    if (reads.pending.size === 0 && reads.scoreStarted === reads.economicFinished) {
      backgroundReadiness.push({ step: activeStep, scoreStarted: reads.scoreStarted,
        economicFinished: reads.economicFinished })
      return
    }
    await pause(100)
  }
  throw new Error('Provider background reads did not settle before an artificial test navigation; see requestFailures')
}

async function navigate(page, url) {
  // Switching between URL test cases or closing a context must not abort a
  // pending fetch in the preceding document. Product-driven login/logout
  // navigations remain untouched, and no JavaScript error is suppressed.
  await settleBeforeNavigation(page)
  await page.goto(url)
  await settleBeforeNavigation(page)
}

async function closePage(page) {
  await settleBeforeNavigation(page)
  await page.context().close()
}

async function api(page, path, { method = 'GET', body, status: expectedStatus = 200 } = {}) {
  assert.ok(path.startsWith('/api/') && !path.startsWith('//'), 'Only local application API paths are allowed')
  expectError(path, expectedStatus)
  const result = await page.evaluate(async ({ path, method, body }) => {
    const response = await fetch(path, { method, cache: 'no-store',
      headers: { Accept: 'application/json', ...(body === undefined ? {} : { 'Content-Type': 'application/json' }) },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }) })
    return { status: response.status, body: await response.json(), retryAfter: response.headers.get('retry-after') }
  }, { path, method, body })
  assert.equal(result.status, expectedStatus, `Unexpected response from ${path}`)
  return result
}

async function provider(page, user = null) {
  await page.waitForFunction(({ id }) => {
    const state = document.querySelector('[data-auth-lab-session]')
    return state?.getAttribute('data-state') === (id ? 'authenticated' : 'signed_out')
      && state.getAttribute('data-user-id') === (id || '')
  }, { id: user?.id || null })
}

async function hasSession(page) {
  return (await page.context().cookies()).some(cookie => /^sb-.*-auth-token(?:\.\d+)?$/.test(cookie.name) && cookie.value)
}

async function canonicalEntry(page, next, { invited = false } = {}) {
  await navigate(page, `${base}/auth/signin?next=${encodeURIComponent(next)}${invited ? '&invited=1' : ''}`)
  await page.getByRole('heading', { name: 'Continúa tu carrera', exact: true }).waitFor()
  const link = page.getByRole('link', { name: 'Continuar con correo y contraseña', exact: true })
  const target = new URL(await link.getAttribute('href'), base)
  assert.equal(target.origin, base)
  assert.equal(target.pathname, '/auth/email-login')
  assert.equal(target.searchParams.get('next'), next)
  if (invited) assert.equal(target.searchParams.get('invited'), '1')
  await link.focus()
  assert.ok(await link.evaluate(element => element === document.activeElement), 'Email entry must be keyboard reachable')
  await link.press('Enter')
  await page.waitForURL(url => url.pathname === '/auth/email-login' && url.searchParams.get('next') === next)
  await page.getByLabel('Correo electrónico', { exact: true }).waitFor()
}

async function submit(page, user, password, expectedStatus) {
  await settleBeforeNavigation(page)
  await page.getByLabel('Correo electrónico', { exact: true }).fill(user.email)
  await page.getByLabel('Contraseña', { exact: true }).fill(password)
  expectError('/api/auth/email-login', expectedStatus)
  const response = page.waitForResponse(response => new URL(response.url()).origin === base
    && new URL(response.url()).pathname === '/api/auth/email-login' && response.request().method() === 'POST')
  await page.getByRole('button', { name: 'Ingresar', exact: true }).click()
  const result = await response
  assert.equal(result.status(), expectedStatus, 'Real email-login returned an unexpected status')
  const body = await result.json().catch(() => null)
  if (expectedStatus >= 400) {
    await page.getByRole('alert').waitFor()
    assert.equal(new URL(page.url()).pathname, '/auth/email-login', 'Failed login must stay on the form')
    assert.ok(await page.getByRole('button', { name: 'Ingresar', exact: true }).isEnabled(), 'Failed login must allow retry')
  } else assert.equal(body?.success, true)
  return body
}

async function admitted(page, user, next) {
  await page.waitForURL(url => url.href === new URL(next, base).href)
  await page.locator('#main-content').waitFor()
  await provider(page, user)
  assert.ok(await hasSession(page), 'Successful login must set an actual Supabase SSR session')
  assert.equal((await api(page, '/api/auth/pilot-status')).body.allowed, true)
}

async function visual(page, name, viewport) {
  await page.evaluate(() => document.fonts.ready)
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
  const bounds = await page.evaluate(() => ({ width: innerWidth, document: document.documentElement.scrollWidth }))
  layouts.push({ name, viewport: viewport.name, ...bounds })
  await page.screenshot({ path: join(evidence, `auth-${viewport.name}-${name}.png`), fullPage: true })
  assert.ok(bounds.document <= bounds.width + 1, `Horizontal overflow in ${name} at ${viewport.width}`)
  const scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
  const violations = scan.violations.map(item => ({ id: item.id, impact: item.impact,
    targets: item.nodes.map(node => node.target) }))
  accessibility.push({ name, viewport: viewport.name, width: viewport.width, violations })
  assert.equal(violations.filter(item => ['serious', 'critical'].includes(item.impact)).length, 0,
    `Serious/critical accessibility failure in ${name} at ${viewport.width}`)
}

async function clickLogout(page, expectedStatus, retry = false) {
  await settleBeforeNavigation(page)
  const previousDocument = await page.evaluate(() => performance.timeOrigin)
  const name = retry ? 'Reintentar cierre de sesión' : 'Cerrar sesión'
  const button = page.getByRole('button', { name, exact: true })
  if (!(await button.isVisible())) await page.getByRole('button', { name: 'Abrir navegación', exact: true }).click()
  expectError('/api/auth/signout', expectedStatus)
  const received = page.waitForResponse(response => new URL(response.url()).origin === base
    && new URL(response.url()).pathname === '/api/auth/signout' && response.request().method() === 'POST')
  await page.getByRole('button', { name, exact: true }).click()
  const response = await received
  assert.equal(response.status(), expectedStatus)
  if (expectedStatus === 200) {
    const body = await response.json()
    assert.equal(body.success, true)
    assert.equal(body.scope, 'local')
    assert.ok(response.headers()['cache-control']?.includes('no-store'))
    await page.waitForURL(url => url.pathname === '/auth/signin')
    // The SDK's SIGNED_OUT event may schedule a soft redirect before the
    // confirmed logout replaces the document. Wait for that replacement
    // before issuing Back, or the test itself races the intended navigation.
    await page.waitForFunction(previous => performance.timeOrigin !== previous, previousDocument)
    await provider(page)
    assert.equal(await hasSession(page), false, 'Confirmed logout must clear all SSR auth cookie chunks')
  }
}

async function returning(viewport) {
  activeStep = `${viewport.name}_canonical_entry_returning`
  const page = await newPage(viewport, 'returning')
  const user = fixture.returning.users.find(item => item.label === (viewport.name === 'desktop' ? 'closure-alpha' : 'closure-beta'))
  assert.ok(user)
  const next = `/despega/recorrido?from=auth-${viewport.name}#auth-return`
  // Default and hostile next stay on a local normalized entry; no OAuth is invoked.
  for (const suffix of ['', '?next=https%3A%2F%2Fexample.invalid%2Foutside']) {
    await navigate(page, `${base}/auth/signin${suffix}`)
    const link = page.getByRole('link', { name: 'Continuar con correo y contraseña', exact: true })
    const target = new URL(await link.getAttribute('href'), base)
    assert.equal(target.origin, base)
    assert.equal(target.searchParams.get('next'), '/despega')
  }
  await provider(page)
  await visual(page, 'signin', viewport)
  await canonicalEntry(page, next)
  await provider(page)
  await visual(page, 'email-form', viewport)
  record(activeStep)

  activeStep = `${viewport.name}_declared_email_failures_allow_recovery`
  for (const fault of [
    { status: 503, type: 'text/html', body: '<!doctype html><title>Synthetic gateway unavailable</title>',
      message: 'No pudimos conectarnos al servicio de acceso', name: 'html-503' },
    { status: 429, type: 'application/json', body: JSON.stringify({ error: 'rate_limited', message: 'synthetic-provider-detail' }),
      message: 'Alcanzaste el límite de intentos de acceso', name: 'json-429' },
  ]) {
    const failLogin = route => route.fulfill({ status: fault.status, contentType: fault.type, body: fault.body })
    await page.route(`${base}/api/auth/email-login`, failLogin)
    controlledFault = true
    await submit(page, user, fixture.returning.password, fault.status)
    const alert = await page.getByRole('alert').innerText()
    assert.ok(alert.includes(fault.message), 'Recoverable email error must explain the next step')
    assert.ok(!alert.includes('synthetic-provider-detail'), 'Raw provider diagnostics must stay out of the form')
    await provider(page)
    assert.equal(await hasSession(page), false)
    controlledFailures.push({ viewport: viewport.name, path: '/api/auth/email-login', status: fault.status,
      mechanism: `${fault.name}: declared failing HTTP response only; no successful Auth is mocked`, recovered: false })
    await visual(page, `email-${fault.name}`, viewport)
    await page.unroute(`${base}/api/auth/email-login`, failLogin)
    controlledFault = false
  }
  record(activeStep)

  activeStep = `${viewport.name}_invalid_password_then_real_return_and_provider`
  await submit(page, user, `${fixture.returning.password}-incorrect`, 401)
  await provider(page)
  assert.equal(await hasSession(page), false)
  await visual(page, 'invalid-credentials', viewport)
  await submit(page, user, fixture.returning.password, 200)
  await admitted(page, user, next)
  for (const failure of controlledFailures) {
    if (failure.viewport === viewport.name && failure.path === '/api/auth/email-login') failure.recovered = true
  }
  await visual(page, 'returning-session', viewport)
  await settleBeforeNavigation(page)
  await page.reload()
  await settleBeforeNavigation(page)
  await admitted(page, user, next)
  record(activeStep)

  activeStep = `${viewport.name}_logout_failure_preserves_session_and_retries`
  const privateHistory = `/despega/recorrido?back=${viewport.name}`
  await navigate(page, base + privateHistory)
  await admitted(page, user, privateHistory)
  const failLogout = route => route.fulfill({ status: 503, contentType: 'application/json',
    body: JSON.stringify({ success: false, error: 'sign_out_unavailable', message: 'Fallo sintético controlado de cierre.' }) })
  await page.route(`${base}/api/auth/signout`, failLogout)
  controlledFault = true
  await clickLogout(page, 503)
  await page.getByRole('alert').filter({ hasText: 'No pudimos confirmar el cierre de sesión' }).waitFor()
  assert.equal(new URL(page.url()).pathname, '/despega/recorrido', 'Failed logout must not show a signed-out page')
  await provider(page, user)
  assert.ok(await hasSession(page), 'A synthetic failed response must preserve the live session')
  assert.equal((await api(page, '/api/auth/pilot-status')).body.allowed, true)
  controlledFailures.push({ viewport: viewport.name, path: '/api/auth/signout', status: 503,
    mechanism: 'one declared failing HTTP response; real session and database remain intact', recovered: false })
  await visual(page, 'logout-retry', viewport)
  await page.unroute(`${base}/api/auth/signout`, failLogout)
  controlledFault = false
  await clickLogout(page, 200, true)
  controlledFailures.at(-1).recovered = true
  record(activeStep)

  activeStep = `${viewport.name}_logout_clears_provider_cookie_and_private_history`
  // Two private documents existed before replace(signin), so Back really targets
  // authenticated history. Do not reload before checking for an exposed shell.
  await settleBeforeNavigation(page)
  await page.goBack({ waitUntil: 'domcontentloaded' })
  await page.waitForURL(url => url.pathname === '/auth/signin')
  await provider(page)
  assert.equal(await page.locator('#main-content').count(), 0, 'Back must not restore the private AppShell')
  assert.equal((await api(page, '/api/auth/pilot-status', { status: 401 })).body.allowed, false)
  await navigate(page, base + privateHistory)
  await page.waitForURL(url => url.pathname === '/auth/signin')
  await provider(page)
  assert.equal(await page.locator('#main-content').count(), 0)
  record(activeStep)
  await closePage(page)
}

async function invitation(viewport) {
  activeStep = `${viewport.name}_new_invitation_claim_and_admission`
  const page = await newPage(viewport, 'invited')
  const user = fixture.users.find(item => item.label === `auth-invited-${viewport.name}`)
  const invitationRow = async () => (await db.query(`select status,claimed_by_claim_id,claimed_by_user_id,redeemed_at
    from public.pilot_invitations where id=$1`, [user.invitationId])).rows[0]
  const membership = async () => (await db.query('select access_kind,invitation_id from public.pilot_memberships where user_id=$1', [user.id])).rows
  assert.equal((await membership()).length, 0)
  await navigate(page, `${base}/api/auth/invitation/claim?token=${encodeURIComponent(user.invitationToken)}`)
  await page.getByRole('heading', { name: 'Confirma tu invitación', exact: true }).waitFor()
  assert.equal((await invitationRow()).status, 'issued', 'Scanner-safe GET must not reserve an invitation')
  await page.getByRole('button', { name: 'Confirmar y continuar', exact: true }).click()
  await page.waitForURL(url => url.pathname === '/auth/signin' && url.searchParams.get('invited') === '1')
  const claim = (await page.context().cookies()).find(cookie => cookie.name === 'dtc_pilot_claim')
  assert.ok(claim?.httpOnly && claim.sameSite === 'Lax', 'Real signed claim must be an HttpOnly SameSite cookie')
  assert.equal((await invitationRow()).status, 'claimed')
  const next = `/despega/recorrido?new-pilot=${viewport.name}`
  await canonicalEntry(page, next, { invited: true })
  await submit(page, user, `${fixture.password}-incorrect`, 401)
  const preserved = (await page.context().cookies()).find(cookie => cookie.name === 'dtc_pilot_claim')
  assert.ok(preserved?.value === claim.value, 'Invalid password must preserve the signed claim for retry')
  assert.equal((await invitationRow()).status, 'claimed')
  assert.equal((await membership()).length, 0, 'Wrong credentials must never redeem pilot access')
  await submit(page, user, fixture.password, 200)
  await admitted(page, user, next)
  assert.equal((await page.context().cookies()).some(cookie => cookie.name === 'dtc_pilot_claim'), false)
  const memberships = await membership(), redeemed = await invitationRow()
  assert.equal(memberships.length, 1)
  assert.equal(memberships[0].access_kind, 'invited')
  assert.equal(memberships[0].invitation_id, user.invitationId)
  assert.equal(redeemed.status, 'redeemed')
  assert.equal(redeemed.claimed_by_user_id, user.id)
  assert.ok(redeemed.redeemed_at)
  assert.equal((await db.query('select user_id from public.despega_journey_state where user_id=$1', [user.id])).rowCount, 1,
    'The real protected journey must initialize the new pilot')
  await visual(page, 'new-invited-session', viewport)
  await settleBeforeNavigation(page)
  await page.reload()
  await settleBeforeNavigation(page)
  await admitted(page, user, next)
  assert.equal((await membership()).length, 1, 'Refresh must not duplicate membership')
  record(activeStep)
  await closePage(page)
}

async function outsider(viewport) {
  activeStep = `${viewport.name}_confirmed_nonmember_is_denied`
  const page = await newPage(viewport, 'outsider')
  const user = fixture.users.find(item => item.label === `auth-outsider-${viewport.name}`)
  await canonicalEntry(page, '/despega/recorrido')
  const denied = await submit(page, user, fixture.password, 403)
  assert.equal(denied.error, 'access_required')
  await provider(page)
  assert.equal(await hasSession(page), false, 'Admission denial must remove the newly established Auth session')
  assert.equal((await db.query('select user_id from public.pilot_memberships where user_id=$1', [user.id])).rowCount, 0)
  await visual(page, 'access-denied', viewport)
  await navigate(page, base + '/despega/recorrido')
  await page.waitForURL(url => url.pathname === '/auth/signin')
  await provider(page)
  assert.equal((await api(page, '/api/auth/pilot-status', { status: 401 })).body.allowed, false)
  assert.equal(await page.locator('#main-content').count(), 0)
  record(activeStep)
  await closePage(page)
}

async function quota(viewport) {
  activeStep = `${viewport.name}_login_quota_does_not_block_logout`
  const page = await newPage(viewport, 'quota')
  const user = fixture.returning.users.find(item => item.label === (viewport.name === 'desktop' ? 'closure-alpha' : 'closure-beta'))
  const next = `/despega/recorrido?quota=${viewport.name}`
  await canonicalEntry(page, next)
  await submit(page, user, fixture.returning.password, 200) // Attempt 1 of 5.
  await admitted(page, user, next)
  for (let read = 0; read < 6; read += 1) {
    assert.equal((await api(page, '/api/auth/pilot-status')).body.allowed, true)
  }
  for (let attempt = 2; attempt <= 5; attempt += 1) {
    await api(page, '/api/auth/email-login', { method: 'POST', status: 401,
      body: { email: user.email, password: `${fixture.returning.password}-incorrect` } })
  }
  const limited = await api(page, '/api/auth/email-login', { method: 'POST', status: 429,
    body: { email: user.email, password: `${fixture.returning.password}-incorrect` } })
  assert.ok(Number(limited.retryAfter) > 0, 'The unchanged login limiter must report its retry window')
  await provider(page, user)
  assert.ok(await hasSession(page), 'Failed reauthentication must not fabricate a signed-out session')
  await clickLogout(page, 200)
  await navigate(page, base + next)
  await page.waitForURL(url => url.pathname === '/auth/signin')
  await provider(page)
  assert.equal((await api(page, '/api/auth/pilot-status', { status: 401 })).body.allowed, false)
  record(activeStep)
  await closePage(page)
}

let failure
try {
  await db.connect()
  await startServer()
  browser = await chromium.launch({ headless: true })
  for (const viewport of AUTH_VIEWPORTS) {
    await returning(viewport)
    await invitation(viewport)
    await outsider(viewport)
    await quota(viewport)
  }
  assert.equal(javascriptErrors.length, 0, 'Unexpected JavaScript error; see auth-results.json')
  assert.equal(consoleErrors.filter(item => item.kind === 'javascript_console_error').length, 0,
    'Unexpected JavaScript console error; expected HTTP resource failures are recorded separately')
  assert.equal(authResponses.filter(response => !response.expected).length, 0, 'Unexpected Auth HTTP failure')
  assert.ok([...expectedErrors.values()].every(count => count === 0), 'An expected failure response was never observed')
  assert.equal(blockedHosts.size, 0, 'The tested journey attempted external network access')
  assert.equal(controlledFailures.length, 6)
  assert.ok(controlledFailures.every(item => item.recovered))
  record('both_viewports_real_auth_and_no_unexpected_javascript_or_external_network')
} catch (error) {
  failure = { step: activeStep, message: safeFailure(error, secrets) }
  process.exitCode = 1
  console.error('Real email-auth acceptance failed:', failure.message)
} finally {
  if (browser) await browser.close()
  await stopServer()
  await db.end()
  writeFileSync(join(evidence, 'auth-results.json'), JSON.stringify({
    commit: process.env.A1_SOURCE_COMMIT, verdict: failure ? 'FAIL' : 'PASS', failure,
    scope: 'real sign-in/email forms, local Supabase password Auth, invitation SQL, session Provider and AppShell logout',
    steps, accessibility, layouts, authResponses, controlledFailures, javascriptErrors, consoleErrors,
    requestFailures, backgroundReadiness,
    blockedHosts: [...blockedHosts], sourceManifest: 'auth-scope.json',
    privacy: 'Synthetic users only. No secrets, cookies, storageState, HAR, traces or private server logs.',
  }, null, 2))
}
if (!failure) console.log(`Real email-auth: PASS (${steps.length} cases, ${accessibility.length} responsive accessibility checks).`)
