import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { mkdir, readFile, realpath, stat, writeFile } from 'node:fs/promises'
import { dirname, isAbsolute, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { captureUiJsonResponse } from '../a1-browser-qa/closure-response.mjs'

// This is a separate, explicitly remote UAT runner. The disposable laboratory's
// loopback guards, source preparation and synthetic server are left unchanged.
const repo = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const productionRef = 'dcfrbwxbejtbcouionna'
const productionHosts = new Set(['despegatucarrera.com', 'www.despegatucarrera.com', 'despegatucarrera.pro', 'www.despegatucarrera.pro'])
const draftPath = '/api/assessments/drafts/a1'
const secrets = []
const safeMessage = value => {
  let text = String(value)
  for (const secret of secrets.filter(Boolean)) text = text.split(secret).join('[REDACTED]')
  return text.replace(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g, '[REDACTED_JWT]')
    .replace(/Bearer\s+\S+/gi, 'Bearer [REDACTED]').slice(0, 1500)
}
const isProductionHost = hostname => productionHosts.has(hostname)
  || hostname.startsWith('v0-fork-of-despega-tu-carrera-clone')
  || hostname === `${productionRef}.supabase.co`

export function validateTarget(value) {
  assert.equal(value.version, 1, 'Unsupported fixture contract')
  assert.equal(value.syntheticAccountsOnly, true, 'Only dedicated synthetic accounts are allowed')
  assert.match(value.runId, /^[a-z0-9][a-z0-9_-]{3,79}$/i, 'A safe run ID is required')
  assert.match(value.commit, /^[a-f0-9]{40}$/, 'Record the actual deployed commit')
  assert.match(value.deploymentId, /^dpl_[A-Za-z0-9]+$/, 'Record the actual deployment ID')
  assert.match(value.supabaseRef, /^[a-z]{20}$/, 'Expected a dedicated Supabase project reference')
  assert.notEqual(value.supabaseRef, productionRef, 'Production Supabase is forbidden')
  const app = new URL(value.baseUrl), backend = new URL(value.supabaseUrl)
  for (const url of [app, backend]) {
    assert.equal(url.protocol, 'https:', 'Remote UAT requires HTTPS')
    assert.equal(url.username + url.password + url.port + url.search + url.hash, '', 'Origins only; no credentials, port or query')
    assert.equal(url.pathname, '/', 'An origin without a path is required')
    assert.equal(isProductionHost(url.hostname), false, 'Production hosts are forbidden')
  }
  assert.ok(app.hostname.endsWith('.vercel.app') || app.hostname === 'uat.despegatucarrera.com', 'Use the identified UAT deployment')
  assert.equal(backend.origin, `https://${value.supabaseRef}.supabase.co`, 'Backend URL must match the exact new reference')
  return { app: app.origin, backend: backend.origin, ref: value.supabaseRef }
}

export function validateIdentityHeaders(headers, target) {
  assert.equal(headers.get('x-dtc-environment'), 'uat', 'The deployment did not identify itself as UAT')
  assert.equal(headers.get('x-dtc-uat-backend'), target.ref, 'The deployment did not attest the expected UAT backend')
}

function selfCheck() {
  const valid = {
    version: 1, syntheticAccountsOnly: true, runId: 'uat-guard-check',
    commit: '1'.repeat(40), deploymentId: 'dpl_GuardCheckOnly',
    baseUrl: 'https://dtc-uat-guard-check.vercel.app',
    supabaseRef: 'abcdefghijklmnopqrst', supabaseUrl: 'https://abcdefghijklmnopqrst.supabase.co',
  }
  const target = validateTarget(valid)
  for (const patch of [
    { baseUrl: 'https://www.despegatucarrera.com' },
    { baseUrl: 'https://v0-fork-of-despega-tu-carrera-clone-9mvlp36as.vercel.app' },
    { supabaseRef: productionRef, supabaseUrl: `https://${productionRef}.supabase.co` },
    { supabaseUrl: 'https://differentprojectxxxx.supabase.co' },
    { baseUrl: 'https://dtc-uat-guard-check.vercel.app.evil.invalid' },
    { baseUrl: 'https://secret@dtc-uat-guard-check.vercel.app' },
  ]) assert.throws(() => validateTarget({ ...valid, ...patch }))
  validateIdentityHeaders(new Headers({ 'x-dtc-environment': 'uat', 'x-dtc-uat-backend': target.ref }), target)
  assert.throws(() => validateIdentityHeaders(new Headers(), target))
  assert.throws(() => validateIdentityHeaders(new Headers({ 'x-dtc-environment': 'uat', 'x-dtc-uat-backend': productionRef }), target))
  console.log('Remote UAT guard checks: PASS; no network requests or product tests executed.')
}

async function loadPrivateFixture(path) {
  assert.ok(isAbsolute(path), 'Fixture path must be absolute and outside the repository')
  const actual = await realpath(path), info = await stat(actual)
  const inRepo = relative(repo, actual)
  assert.ok(inRepo.startsWith('..') || isAbsolute(inRepo), 'Never place credentials in the repository')
  assert.equal(info.mode & 0o077, 0, 'Fixture permissions must be 0600 or stricter')
  const fixture = JSON.parse(await readFile(actual, 'utf8'))
  const target = validateTarget(fixture)
  assert.equal(fixture.users?.length, 2, 'Exactly two dedicated synthetic users are required')
  assert.deepEqual(fixture.users.map(user => user.label).sort(), ['personal', 'professional'])
  assert.notEqual(fixture.users[0].id, fixture.users[1].id, 'Two different owners are required')
  for (const user of fixture.users) {
    assert.match(user.id, /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
    assert.match(user.email, /^dtc-uat-[a-z0-9.+_-]+@example\.invalid$/i, 'Use dedicated, non-deliverable synthetic email addresses')
    assert.ok(typeof user.password === 'string' && user.password.length >= 12, 'A dedicated strong test password is required')
    secrets.push(user.password, user.email)
  }
  assert.ok(typeof fixture.anonKey === 'string', 'A publishable/anon API key is required')
  if (!fixture.anonKey.startsWith('sb_publishable_')) {
    const payload = JSON.parse(Buffer.from(fixture.anonKey.split('.')[1] ?? '', 'base64url').toString('utf8'))
    assert.equal(payload.role, 'anon', 'Never use a service-role key in the runner')
    assert.equal(payload.ref, target.ref, 'The anon key belongs to a different backend')
  }
  assert.equal(fixture.serviceRoleKey, undefined, 'The runner must not receive service-role credentials')
  secrets.push(fixture.anonKey, fixture.protectionBypassToken)
  return { fixture, target, credentialPath: actual }
}

async function run(fixture, target, evidence) {
  const requireTools = createRequire(join(process.env.DTC_UAT_TOOLS_ROOT || repo, 'package.json'))
  const { chromium } = requireTools('playwright')
  const { default: AxeBuilder } = requireTools('@axe-core/playwright')
  const report = {
    version: 1, runId: fixture.runId, commit: fixture.commit, deploymentId: fixture.deploymentId,
    baseUrl: target.app, supabaseRef: target.ref, startedAt: new Date().toISOString(),
    scope: 'Technical UAT admission smoke using two synthetic owners and real remote Auth, SSR cookies, draft APIs and RLS. This is not acceptance of all 54 UAT cases.',
    limitations: ['No OAuth exchange, human comprehension, completed A1 assessment, A2/A3 full journey, real vacancy quality, physical mobile keyboard or real JWT-expiry test.'],
    steps: [], accessibility: [], blockedHosts: [], javascriptErrors: [], rateLimits: [], verdict: 'NO_GO',
  }
  let browser
  const tokens = new Map(), allowed = new Set([target.app, target.backend]), blocked = new Set()
  const appHeaders = fixture.protectionBypassToken ? { 'x-vercel-protection-bypass': fixture.protectionBypassToken } : {}
  async function http(url, options = {}) {
    assert.ok(allowed.has(new URL(url).origin), 'Native request outside the exact UAT origins')
    const response = await fetch(url, { ...options, redirect: 'manual', signal: AbortSignal.timeout(30000) })
    if (response.status === 429) report.rateLimits.push({
      path: new URL(url).pathname, method: options.method || 'GET', retryAfter: response.headers.get('retry-after'),
    })
    return response
  }
  async function step(name, cases, task) {
    try {
      const details = await task()
      report.steps.push({ name, cases, status: 'PASS', ...(details ? { details } : {}) })
      console.log(`UAT smoke: ${name}: PASS`)
    } catch (error) {
      report.steps.push({ name, cases, status: 'FAIL', error: safeMessage(error.message) })
      throw new Error(`Failed at ${name}`)
    }
  }
  async function context(viewport = { width: 1440, height: 1000 }) {
    const context = await browser.newContext({ viewport, reducedMotion: 'reduce', serviceWorkers: 'block' })
    await context.route('**/*', async route => {
      const request = route.request(), url = new URL(request.url())
      if (!allowed.has(url.origin)) { blocked.add(url.hostname); return route.abort() }
      return route.continue({ headers: { ...request.headers(), ...(url.origin === target.app ? appHeaders : {}) } })
    })
    context.on('page', page => {
      page.setDefaultTimeout(30000)
      page.setDefaultNavigationTimeout(45000)
      page.on('pageerror', error => report.javascriptErrors.push({ name: error.name }))
    })
    context.on('response', response => {
      if (response.status() === 429) report.rateLimits.push({
        path: new URL(response.url()).pathname, method: response.request().method(), retryAfter: response.headers()['retry-after'] || null,
      })
    })
    return context
  }
  async function api(page, path, method = 'GET', body) {
    assert.ok(path.startsWith('/api/') && !path.includes('://'))
    return page.evaluate(async ({ path, method, body }) => {
      const response = await fetch(path, { method, cache: 'no-store',
        ...(body === undefined ? {} : { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }) })
      return { status: response.status, cache: response.headers.get('cache-control'), body: await response.json().catch(() => null) }
    }, { path, method, body })
  }
  async function rest(user, query, method = 'GET', body) {
    const response = await http(`${target.backend}/rest/v1/assessment_drafts?${query}`, { method,
      headers: { apikey: fixture.anonKey, Authorization: `Bearer ${tokens.get(user.label)}`, 'Content-Type': 'application/json', Prefer: 'return=representation' },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }) })
    return { status: response.status, body: await response.json().catch(() => null) }
  }
  const queryFor = user => new URLSearchParams({ user_id: `eq.${user.id}`, assessment_type: 'eq.a1', select: 'user_id,assessment_type,current_question,answers' })
  async function login(page, user, next = '/despega/recorrido') {
    await page.goto(`${target.app}/auth/email-login?next=${encodeURIComponent(next)}`)
    await page.locator('input[type="email"]').fill(user.email)
    await page.locator('input[type="password"]').fill(user.password)
    const submitted = captureUiJsonResponse(page, request => new URL(request.url()).origin === target.app
      && new URL(request.url()).pathname === '/api/auth/email-login' && request.method() === 'POST')
    await page.getByRole('button', { name: 'Ingresar', exact: true }).click()
    assert.equal((await submitted).status, 200, 'Existing email-login API must authenticate the real account')
    await page.waitForURL(url => url.origin === target.app && url.pathname === next)
    // The desktop navigation is hidden at 390px. The authenticated shell's
    // main region is visible at both widths and requires real pilot access.
    await page.locator('main#main-content').waitFor()
    assert.ok((await page.context().cookies()).some(cookie => cookie.name.startsWith(`sb-${target.ref}-auth-token`)), 'Expected real SSR auth cookies')
  }
  async function openA1(page) {
    const loaded = captureUiJsonResponse(page, request => new URL(request.url()).pathname === draftPath && request.method() === 'GET', { afterNavigation: true })
    await page.goto(target.app + '/despega/a1-cerebral')
    const response = await loaded
    assert.equal(response.status, 200)
    await page.locator('h2[id^="a1-question-"]').waitFor()
    return response.body.draft
  }
  async function selectQuestion(page, index) {
    const id = Number((await page.locator('h2[id^="a1-question-"]').getAttribute('id')).replace('a1-question-', ''))
    const more = page.getByRole('button', { name: /, MÁS como yo$/ }), less = page.getByRole('button', { name: /, MENOS como yo$/ })
    const count = await more.count()
    assert.ok(count >= 2)
    await more.nth(index % count).click()
    assert.equal(await less.nth(index % count).isDisabled(), true)
    await less.nth((index + 1) % count).click()
    return id
  }
  async function nextQuestion(page) {
    const response = captureUiJsonResponse(page, request => new URL(request.url()).pathname === draftPath && request.method() === 'PUT')
    await page.getByRole('button', { name: 'Siguiente →', exact: true }).click()
    assert.equal((await response).status, 200)
  }
  async function visual(page, name, width) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 })
    await page.evaluate(() => document.fonts.ready)
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
    const geometry = await page.evaluate(() => ({ viewport: innerWidth, scroll: document.documentElement.scrollWidth }))
    await page.screenshot({ path: join(evidence, `${name}-${width}.png`), fullPage: true })
    assert.ok(geometry.scroll <= geometry.viewport + 1, 'Horizontal overflow')
    const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
    const violations = audit.violations.map(value => ({ id: value.id, impact: value.impact, targets: value.nodes.map(node => node.target) }))
    report.accessibility.push({ page: name, width, violations })
    assert.equal(violations.filter(value => ['serious', 'critical'].includes(value.impact)).length, 0, 'Serious/critical accessibility issue')
  }
  try {
    browser = await chromium.launch({ headless: true })
    await step('deployment_identity_before_auth_or_writes', [], async () => {
      const response = await http(target.app + '/auth/email-login', { headers: appHeaders })
      assert.equal(response.status, 200, 'Resolve deployment protection/access before running UAT')
      validateIdentityHeaders(response.headers, target)
    })
    await step('real_auth_issuer_matches_isolated_backend', [], async () => {
      for (const user of fixture.users) {
        const response = await http(`${target.backend}/auth/v1/token?grant_type=password`, { method: 'POST',
          headers: { apikey: fixture.anonKey, 'Content-Type': 'application/json' }, body: JSON.stringify({ email: user.email, password: user.password }) })
        assert.equal(response.status, 200, 'Synthetic account must already exist in the isolated backend')
        const body = await response.json()
        secrets.push(body.access_token, body.refresh_token)
        const jwt = JSON.parse(Buffer.from(body.access_token.split('.')[1], 'base64url').toString('utf8'))
        assert.equal(jwt.iss, `${target.backend}/auth/v1`)
        assert.equal(jwt.sub, user.id)
        assert.equal(body.user.id, user.id)
        tokens.set(user.label, body.access_token)
      }
    })
    const anonymous = await context(), anonPage = await anonymous.newPage()
    await step('anonymous_private_page_and_draft_rejected', ['UAT-002'], async () => {
      await anonPage.goto(target.app + '/despega/a1-cerebral')
      await anonPage.waitForURL(url => url.origin === target.app && url.pathname === '/auth/signin')
      const read = await api(anonPage, draftPath)
      assert.equal(read.status, 401)
      assert.ok(read.cache?.includes('private') && read.cache.includes('no-store'))
      assert.equal(await anonPage.locator('h2[id^="a1-question-"]').count(), 0)
    })
    await anonymous.close()
    const alpha = fixture.users.find(user => user.label === 'professional'), beta = fixture.users.find(user => user.label === 'personal')
    const alphaContext = await context(), betaContext = await context()
    const page = await alphaContext.newPage(), other = await betaContext.newPage()
    await step('real_new_pilot_email_login', ['UAT-003'], async () => {
      await login(page, alpha)
      // Entering /despega already verifies resolve_pilot_access. Avoid a
      // redundant pilot-status request: four logins plus signout consume the
      // existing five-request Auth allowance without changing that limit.
      assert.equal(await openA1(page), null, 'Use a fresh synthetic account; the runner never resets prior data')
    })
    let draft
    await step('a1_ui_save_reload_and_recover', ['UAT-019'], async () => {
      for (let count = 0; count < 2; count++) { const id = await selectQuestion(page, 0); await nextQuestion(page); await page.locator(`#a1-question-${id + 1}`).waitFor() }
      draft = (await api(page, draftPath)).body.draft
      assert.equal(draft.currentQuestion, 2)
      assert.equal(Object.keys(draft.answers.more).length, 2)
      const restored = await openA1(page)
      assert.deepEqual(restored.answers, draft.answers)
      assert.equal(restored.currentQuestion, 2)
      await page.locator('#a1-question-3').waitFor()
    })
    await step('failed_draft_write_is_visible_and_retry_persists', ['UAT-020'], async () => {
      await selectQuestion(page, 0)
      const abortPut = route => route.request().method() === 'PUT' ? route.abort('internetdisconnected') : route.fallback()
      await page.route(target.app + draftPath, abortPut)
      await page.getByRole('button', { name: 'Siguiente →', exact: true }).click()
      await page.getByRole('alert').filter({ hasText: 'No pudimos guardar tu avance.' }).waitFor()
      await page.locator('#a1-question-3').waitFor()
      await page.unroute(target.app + draftPath, abortPut)
      await nextQuestion(page); await page.locator('#a1-question-4').waitFor()
      draft = (await api(page, draftPath)).body.draft
      assert.equal(draft.currentQuestion, 3)
      assert.equal(Object.keys(draft.answers.more).length, 3)
    })
    await step('duplicate_draft_retry_keeps_one_record', ['UAT-021'], async () => {
      const payload = { schemaVersion: draft.schemaVersion, currentQuestion: draft.currentQuestion, answers: draft.answers, timings: draft.timings }
      for (let count = 0; count < 2; count++) assert.equal((await api(page, draftPath, 'PUT', payload)).status, 200)
      const own = await rest(alpha, queryFor(alpha))
      assert.equal(own.status, 200); assert.equal(own.body.length, 1)
      assert.deepEqual(own.body[0].answers, draft.answers)
    })
    await step('a1_desktop_and_mobile_render', ['UAT-047', 'UAT-048'], async () => {
      await visual(page, 'a1-draft', 1440); await visual(page, 'a1-draft', 390)
      const menu = page.getByRole('button', { name: 'Abrir navegación', exact: true })
      await menu.click()
      await page.getByRole('dialog', { name: 'Navegación móvil', exact: true }).waitFor()
      await page.getByRole('button', { name: 'Cerrar navegación', exact: true }).last().click()
    })
    await step('second_owner_and_real_draft_rls', ['UAT-049'], async () => {
      await login(other, beta)
      assert.equal(await openA1(other), null)
      const id = await selectQuestion(other, 2); await nextQuestion(other); await other.locator(`#a1-question-${id + 1}`).waitFor()
      const betaOwn = await rest(beta, queryFor(beta))
      assert.equal(betaOwn.status, 200); assert.equal(betaOwn.body.length, 1)
      const read = await rest(beta, queryFor(alpha))
      assert.equal(read.status, 200); assert.deepEqual(read.body, [])
      const update = await rest(beta, queryFor(alpha), 'PATCH', { current_question: 0, answers: { more: {}, less: {} } })
      assert.ok([200, 403].includes(update.status), 'Cross-owner update failed for an unexpected reason')
      if (update.status === 200) assert.deepEqual(update.body, [])
      if (update.status === 403) assert.equal(update.body?.code, '42501')
      const preserved = await rest(alpha, queryFor(alpha))
      assert.equal(preserved.status, 200); assert.equal(preserved.body.length, 1)
      assert.deepEqual(preserved.body[0].answers, draft.answers)
      assert.equal(preserved.body[0].current_question, 3)
    })
    await step('both_new_owners_keep_a2_and_a4_boundaries', ['UAT-017'], async () => {
      for (const current of [page, other]) {
        for (const module of ['A2', 'A4']) {
          const access = await api(current, `/api/journey/module-access?module=${module}`)
          assert.equal(access.status, 200); assert.equal(access.body.canAccess, false)
        }
        assert.equal((await api(current, '/api/a4/opportunities/catalog')).status, 403)
      }
    })
    await step('logout_browser_back_and_real_return', ['UAT-005', 'UAT-007'], async () => {
      await page.setViewportSize({ width: 1440, height: 1000 })
      const signedOut = page.waitForResponse(response => new URL(response.url()).origin === target.app
        && new URL(response.url()).pathname === '/api/auth/signout' && response.request().method() === 'POST')
      await page.getByRole('button', { name: 'Cerrar sesión', exact: true }).first().click()
      assert.equal((await signedOut).status(), 303, 'Signout must complete on the real server')
      await page.waitForURL(url => url.origin === target.app && url.pathname === '/auth/signin')
      await page.goBack()
      await page.waitForURL(url => url.origin === target.app && url.pathname === '/auth/signin')
      assert.equal((await api(page, draftPath)).status, 401)
      await login(page, alpha, '/despega/a1-cerebral')
      await page.locator('#a1-question-4').waitFor()
      assert.deepEqual((await api(page, draftPath)).body.draft.answers, draft.answers)
    })
    await step('independent_mobile_session_recovers_server_draft', ['UAT-054'], async () => {
      const mobile = await context({ width: 390, height: 844 }), mobilePage = await mobile.newPage()
      await login(mobilePage, alpha, '/despega/a1-cerebral')
      await mobilePage.locator('#a1-question-4').waitFor()
      assert.deepEqual((await api(mobilePage, draftPath)).body.draft.answers, draft.answers)
      await mobile.close()
    })
    await step('no_uncaught_javascript_production_requests_or_rate_limits', [], async () => {
      assert.deepEqual(report.javascriptErrors, [])
      assert.equal([...blocked].some(isProductionHost), false, 'The application attempted to contact a production host')
      assert.deepEqual(report.rateLimits, [], 'The run encountered a real rate limit; preserve it as execution evidence')
    })
    report.verdict = 'GO'
  } catch (error) {
    report.failure = safeMessage(error.message)
    process.exitCode = 1
  } finally {
    if (browser) await browser.close()
    report.blockedHosts = [...blocked].sort()
    report.completedAt = new Date().toISOString()
    await writeFile(join(evidence, 'remote-smoke-results.json'), JSON.stringify(report, null, 2))
    console.log(`Technical UAT admission smoke: ${report.verdict}; human UAT acceptance remains pending.`)
  }
}

async function main() {
  const args = process.argv.slice(2)
  if (args.includes('--self-check')) { selfCheck(); return }
  assert.ok(args.includes('--run') || args.includes('--validate'), 'Use --self-check, or --validate/--run --fixture <private absolute path>')
  const fixturePath = args[args.indexOf('--fixture') + 1]
  assert.ok(args.includes('--fixture') && fixturePath, 'A private fixture is required')
  const { fixture, target, credentialPath } = await loadPrivateFixture(fixturePath)
  if (!args.includes('--run')) { console.log('Private fixture contract: VALID; no network requests or product tests executed.'); return }
  const evidenceArg = args[args.indexOf('--evidence-dir') + 1]
  assert.ok(args.includes('--evidence-dir') && evidenceArg && isAbsolute(evidenceArg), 'An absolute evidence directory is required')
  const evidence = resolve(evidenceArg), nestedCredential = relative(evidence, credentialPath)
  assert.ok(nestedCredential.startsWith('..') || isAbsolute(nestedCredential), 'Evidence must never contain the private fixture')
  await mkdir(evidence, { recursive: true, mode: 0o700 })
  await run(fixture, target, evidence)
}

main().catch(error => { console.error(safeMessage(error.message)); process.exitCode = 1 })
