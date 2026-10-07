import { createRequire } from 'node:module'
import { join, resolve } from 'node:path'
import { API_PATH, PAGE_PATH, HTTP_DIAGNOSTIC_PATHS, LiveFailure, check, chileDate, cooperativeCancellation, httpDiagnostic, requestTracker, repository, sameJson } from './guards.mjs'

function tools(browserConfig = {}) {
  const root = browserConfig.toolsRoot ?? process.env.DTC_OUTCOMES_UI_TOOLS_ROOT
  const loader = createRequire(join(root ? resolve(root) : repository, 'package.json'))
  try {
    return { playwright: loader('playwright'), distribution: loader('@sparticuz/chromium') }
  } catch { throw new LiveFailure('PINNED_BROWSER_TOOLS_REQUIRED') }
}

async function launch(browserConfig = {}) {
  const { playwright, distribution } = tools(browserConfig)
  const binary = distribution.default ?? distribution
  const executablePath = browserConfig.executablePath ?? await binary.executablePath()
  return playwright.chromium.launch({ executablePath, headless: true, args: ['--single-process', '--no-zygote', '--disable-gpu'] })
}

export async function browserPreflight(browserConfig) {
  const browser = await launch(browserConfig)
  try { return { chromium: browser.version(), browserLaunchVerified: true } }
  finally { await browser.close() }
}

/** A real, single-hop HTTP relay: never let Playwright propagate credential overrides across redirects. */
export async function relayRealRoute(route, { expectedOrigin, headers, requests }) {
  const requestUrl = new URL(route.request().url())
  check(requestUrl.origin === expectedOrigin && !requestUrl.username && !requestUrl.password, 'RELAY_ORIGIN_MISMATCH')
  return requests.track(async () => {
    let response
    let diagnostic
    try {
      response = await route.fetch({ headers, maxRedirects: 0, maxRetries: 0, timeout: 45_000 })
      if (HTTP_DIAGNOSTIC_PATHS.includes(requestUrl.pathname)) {
        const responseHeaders = response.headers()
        let data
        let jsonState = 'unread'
        if (responseHeaders['content-type']?.includes('application/json')) {
          try { data = await response.json(); jsonState = 'parsed' } catch { jsonState = 'invalid' }
        }
        diagnostic = httpDiagnostic({ path: requestUrl.pathname, method: route.request().method(), status: response.status(),
          contentType: responseHeaders['content-type'], retryAfter: responseHeaders['retry-after'], data, jsonState,
        })
      }
      const location = response.headers().location
      if (location) {
        const destination = new URL(location, requestUrl)
        if (destination.origin !== expectedOrigin || destination.username || destination.password) {
          await route.abort('blockedbyclient')
          return { blockedRedirect: true, ...(diagnostic ? { diagnostic } : {}) }
        }
      }
      // This is the untouched real HTTP response, including the real JSON and Set-Cookie headers.
      await route.fulfill({ response })
      return { blockedRedirect: false, ...(diagnostic ? { diagnostic } : {}) }
    } catch {
      try { await route.abort('failed') } catch { /* The request may already be closed. */ }
      return { transportFailure: true, ...(diagnostic ? { diagnostic } : {}) }
    } finally { if (response) await response.dispose() }
  })
}

/** All allowed requests use the real relay; no fixture or fabricated API response exists here. */
async function openOwner({ config, owner, viewport, cancellation, requests, onHttpDiagnostic }) {
  const browser = await launch(config.browser)
  let stopNewRequests = false
  try {
    const context = await browser.newContext({ viewport, locale: 'es-CL', timezoneId: 'America/Santiago', reducedMotion: 'reduce', serviceWorkers: 'block' })
    await context.addCookies([...owner.cookies.getAll(), ...config.vercelProtectionCookies].map(({ name, value }) => ({ name, value, url: config.target.origin, secure: true, sameSite: 'Lax' })))
    const page = await context.newPage()
    page.setDefaultTimeout(25_000)
    page.setDefaultNavigationTimeout(45_000)
    const state = { runtimeErrors: 0, consoleErrors: 0, blockedExternalRequests: 0, blockedMutations: 0, blockedRedirects: 0, relayFailures: 0, outcomesHttpErrors: 0, writes: [] }
    page.on('pageerror', () => { state.runtimeErrors++ })
    page.on('console', (message) => { if (message.type() === 'error') state.consoleErrors++ })
    page.on('response', (response) => {
      if (new URL(response.url()).pathname === API_PATH && response.status() >= 400) state.outcomesHttpErrors++
    })
    await context.route('**/*', async (route) => {
      if (stopNewRequests) return route.abort('blockedbyclient')
      try { cancellation.check() } catch { return route.abort('blockedbyclient') }
      const request = route.request()
      const url = new URL(request.url())
      const write = !['GET', 'HEAD', 'OPTIONS'].includes(request.method())
      const relay = async (headers) => {
        const result = await relayRealRoute(route, { expectedOrigin: url.origin, headers, requests })
        if (result.diagnostic) onHttpDiagnostic(result.diagnostic)
        if (result.blockedRedirect) state.blockedRedirects++
        if (result.transportFailure) state.relayFailures++
      }
      if (url.origin === config.target.origin) {
        if (write && ![API_PATH, '/api/auth/signout'].includes(url.pathname)) {
          state.blockedMutations++
          return route.abort('blockedbyclient')
        }
        if (url.pathname === API_PATH && request.method() === 'POST') {
          // Only synthetic in-memory payloads. Never persist this collection or browser storage state.
          state.writes.push(request.postDataJSON())
        }
        return relay({ ...request.headers(), ...(config.vercelProtectionBypass ? { 'x-vercel-protection-bypass': config.vercelProtectionBypass } : {}) })
      }
      if (url.origin === config.supabase.url) {
        if (write && !['/auth/v1/token', '/auth/v1/logout'].includes(url.pathname)) {
          state.blockedMutations++
          return route.abort('blockedbyclient')
        }
        const headers = { ...request.headers() }
        delete headers['x-vercel-protection-bypass']
        return relay(headers)
      }
      if (!write && ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'].includes(url.origin)) {
        const headers = { ...request.headers() }
        delete headers['x-vercel-protection-bypass']
        return relay(headers)
      }
      state.blockedExternalRequests++
      return route.abort('blockedbyclient')
    })
    await page.goto(config.target.origin + PAGE_PATH, { waitUntil: 'domcontentloaded' })
    await ready(page)
    cancellation.check()
    return { browser, context, page, state, stopRequests: () => { stopNewRequests = true } }
  } catch (error) { stopNewRequests = true; await requests.drain(); await browser.close(); throw error }
}

async function ready(page) {
  await page.getByRole('heading', { name: 'Mis resultados laborales', exact: true }).waitFor({ state: 'visible' })
  await page.getByRole('tab', { name: 'Trabajo', exact: true }).waitFor({ state: 'visible' })
  await page.evaluate(() => document.fonts.ready)
}

export function captureResponse(page, action) {
  const waiter = page.waitForResponse((response) => {
    const request = response.request()
    return new URL(response.url()).pathname === API_PATH && request.method() === 'POST' && request.postDataJSON()?.action === action
  })
  // A failed click can skip the later await. Closing Chromium must not turn that
  // abandoned waiter into an unhandled rejection while remote cleanup is starting.
  waiter.catch(() => {})
  return waiter // Keep the original promise: a caller that awaits it still receives the failure.
}

async function safeCapture(view, config, label, screenshots) {
  const size = await view.page.evaluate(() => ({ width: innerWidth, content: document.documentElement.scrollWidth }))
  check(size.content <= size.width + 1, 'LIVE_BROWSER_HORIZONTAL_OVERFLOW')
  const filename = label + '.png'
  // Main excludes the account email in the actual app sidebar; every visible result is synthetic.
  await view.page.locator('#main-content').screenshot({ path: join(config.evidenceDirectory, filename), animations: 'disabled' })
  screenshots.push({ filename, viewport: view.page.viewportSize(), contents: 'real-preview-main-with-synthetic-outcomes' })
  check(view.state.runtimeErrors === 0, 'LIVE_BROWSER_RUNTIME_ERROR')
  check(view.state.blockedMutations === 0, 'LIVE_BROWSER_UNEXPECTED_MUTATION')
  check(view.state.blockedRedirects === 0, 'LIVE_BROWSER_CROSS_ORIGIN_REDIRECT')
  check(view.state.relayFailures === 0, 'LIVE_BROWSER_RELAY_FAILURE')
  check(view.state.outcomesHttpErrors === 0, 'LIVE_BROWSER_OUTCOMES_HTTP_FAILURE')
}

export async function runBrowserJourney({ config, a, b, getSummary, post, cancellation = cooperativeCancellation(), requests = requestTracker(), onHttpDiagnostic = () => {} }) {
  const evidence = { cases: [], screenshots: [], apiMocks: 0, credentialStorage: 'process-and-browser-context-memory-only' }
  let view
  let rateLimited = false
  const observe = (diagnostic) => { if (diagnostic.status === 429) rateLimited = true; onHttpDiagnostic(diagnostic) }
  let stage = 'MOBILE_ENTRY'
  try {
    cancellation.check()
    view = await openOwner({ config, owner: a, viewport: { width: 390, height: 844 }, cancellation, requests, onHttpDiagnostic: observe })
    const mobileRole = 'DTC control sintético móvil'
    stage = 'MOBILE_CAPTURE'
    await view.page.getByRole('tab', { name: 'Trabajo', exact: true }).click()
    const form = view.page.getByRole('form', { name: 'Registrar trabajo', exact: true })
    await form.getByLabel('Nombre del cargo', { exact: true }).fill(mobileRole)
    await form.getByLabel('Fecha en que comenzó', { exact: true }).fill(chileDate(35))
    cancellation.check()
    const savedEmployment = captureResponse(view.page, 'employment_outcome')
    await form.getByRole('button', { name: 'Guardar trabajo', exact: true }).click()
    const savedResponse = await savedEmployment
    cancellation.check()
    check(savedResponse.status() === 201, 'LIVE_UI_EMPLOYMENT_SAVE_FAILED')
    const created = await savedResponse.json()
    const browserPayload = view.state.writes.find((body) => body.action === 'employment_outcome')
    check(browserPayload && typeof created.data?.id === 'string', 'LIVE_UI_CAPTURE_EVIDENCE_MISSING')
    stage = 'MOBILE_RELOAD_AND_RETRY'
    await view.page.reload({ waitUntil: 'domcontentloaded' })
    await ready(view.page)
    const afterReload = await getSummary(a)
    check(afterReload.workspace.employmentOptions.some((row) => row.id === created.data.id && row.roleTitle === mobileRole), 'LIVE_UI_EMPLOYMENT_NOT_PERSISTED')
    check(afterReload.workspace.followups.filter((row) => row.employmentOutcomeId === created.data.id).length === 3, 'LIVE_UI_FOLLOWUPS_NOT_ATOMIC')
    check(sameJson(await post(a, browserPayload), created), 'LIVE_UI_REQUEST_RETRY_NOT_STABLE')
    evidence.cases.push({ name: 'mobile-real-capture-reload-and-idempotent-retry', status: 'PASS', savedEmployments: 1, scheduledFollowups: 3 })
    stage = 'MOBILE_FOLLOWUP'
    await view.page.getByRole('button', { name: `Responder seguimiento de 30 días para ${mobileRole}`, exact: true }).click()
    const followup = view.page.getByRole('form', { name: `Responder seguimiento de 30 días para ${mobileRole}`, exact: true })
    await followup.getByLabel('¿Sigues trabajando en este empleo?', { exact: true }).selectOption('yes')
    await followup.getByLabel('¿Sigues en el mismo cargo? (opcional)', { exact: true }).selectOption('yes')
    cancellation.check()
    const savedFollowup = captureResponse(view.page, 'complete_followup')
    await followup.getByRole('button', { name: 'Guardar seguimiento', exact: true }).click()
    check((await savedFollowup).status() === 200, 'LIVE_UI_FOLLOWUP_SAVE_FAILED')
    cancellation.check()
    await view.page.reload({ waitUntil: 'domcontentloaded' })
    await ready(view.page)
    const followed = (await getSummary(a)).workspace.followups.find((row) => row.employmentOutcomeId === created.data.id && row.day === 30)
    check(followed?.state === 'completed' && followed.employmentActive === true && followed.sameRole === true, 'LIVE_UI_FOLLOWUP_NOT_PERSISTED')
    const moreFollowups = view.page.getByText(/^Ver \d+ seguimientos más$/)
    if (await moreFollowups.count()) await moreFollowups.click()
    await safeCapture(view, config, 'mobile-live-outcomes', evidence.screenshots)
    evidence.cases.push({ name: 'mobile-real-due-followup-and-reload', status: 'PASS', persistedReply: true, runtimeErrors: view.state.runtimeErrors, consoleErrors: view.state.consoleErrors })
    view.stopRequests()
    await requests.drain()
    await view.browser.close()
    view = null

    stage = 'DESKTOP_SECOND_OWNER'
    cancellation.check()
    view = await openOwner({ config, owner: b, viewport: { width: 1440, height: 960 }, cancellation, requests, onHttpDiagnostic: observe })
    const mainText = await view.page.locator('#main-content').innerText()
    check(mainText.includes('DTC control sintético B') && !mainText.includes('DTC control sintético A') && !mainText.includes(mobileRole), 'LIVE_UI_SECOND_OWNER_LEAK')
    await safeCapture(view, config, 'desktop-live-owner-isolation', evidence.screenshots)
    evidence.cases.push({ name: 'desktop-real-second-owner-isolation', status: 'PASS', runtimeErrors: view.state.runtimeErrors, consoleErrors: view.state.consoleErrors })
    stage = 'REAL_SIGNOUT'
    cancellation.check()
    await view.page.getByRole('button', { name: 'Cerrar sesión', exact: true }).click()
    await view.page.waitForURL((url) => url.pathname === '/auth/signin')
    const status = await view.page.evaluate(async (path) => (await fetch(path, { cache: 'no-store', redirect: 'manual' })).status, API_PATH)
    check(status === 401, 'SIGNED_OUT_BROWSER_API_ACCESS_REMAINS')
    await view.page.goto(config.target.origin + PAGE_PATH, { waitUntil: 'domcontentloaded' })
    check(new URL(view.page.url()).pathname === '/auth/signin', 'SIGNED_OUT_BROWSER_PRIVATE_PAGE_REMAINS')
    evidence.cases.push({ name: 'actual-app-signout-removes-private-page-and-api-access', status: 'PASS' })
    check(!rateLimited, 'LIVE_BROWSER_RATE_LIMITED')
    return evidence
  } catch (error) {
    if (rateLimited) throw new LiveFailure('LIVE_BROWSER_RATE_LIMITED')
    if (error instanceof LiveFailure) throw error
    throw new LiveFailure(`LIVE_BROWSER_${stage}_FAILED`)
  } finally { view?.stopRequests(); await requests.drain(); if (view) await view.browser.close() }
}
