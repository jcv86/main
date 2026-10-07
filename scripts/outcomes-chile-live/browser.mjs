import { createRequire } from 'node:module'
import { join, resolve } from 'node:path'
import { API_PATH, PAGE_PATH, HTTP_DIAGNOSTIC_PATHS, LiveFailure, browserFailureCategory, check, chileDate, configuredBrowserProxy, cooperativeCancellation, httpDiagnostic, managedBrowserTrust, requestTracker, repository, sameJson } from './guards.mjs'

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
  const proxy = configuredBrowserProxy()
  const trust = managedBrowserTrust()
  try {
    const browser = await playwright.chromium.launch({ executablePath, headless: true, args: ['--single-process', '--no-zygote', '--disable-gpu'],
      ...(proxy ? { proxy } : {}), ...(trust ? { env: trust.environment } : {}),
    })
    // Keep all existing close/finally paths responsible for their own ephemeral trust directory.
    const close = browser.close.bind(browser)
    browser.close = async (...args) => { try { await close(...args) } finally { trust?.remove() } }
    return browser
  } catch (error) { trust?.remove(); throw error }
}

/** The same local setup is exercised before any synthetic identities are created. */
export async function prepareBrowserContext({ browserConfig, origin, cookies = [], viewport = { width: 390, height: 844 }, onBrowserDiagnostic = () => {} }) {
  let browser
  let stage = 'LAUNCH'
  try {
    browser = await launch(browserConfig)
    stage = 'CONTEXT'
    const context = await browser.newContext({ viewport, locale: 'es-CL', timezoneId: 'America/Santiago', reducedMotion: 'reduce', serviceWorkers: 'block' })
    stage = 'COOKIES'
    if (cookies.length) {
      check(typeof origin === 'string' && new URL(origin).origin === origin, 'LIVE_BROWSER_COOKIE_ORIGIN_INVALID')
      for (const cookie of cookies) {
        check(typeof cookie.name === 'string' && typeof cookie.value === 'string', 'LIVE_BROWSER_COOKIE_TYPE_INVALID')
        check(Buffer.byteLength(cookie.name) + Buffer.byteLength(cookie.value) <= 4096, 'LIVE_BROWSER_COOKIE_TOO_LARGE')
      }
      await context.addCookies(cookies.map(({ name, value }) => ({ name, value, url: origin, secure: true, sameSite: 'Lax' })))
    }
    stage = 'NEW_PAGE'
    const page = await context.newPage()
    page.setDefaultTimeout(25_000)
    page.setDefaultNavigationTimeout(45_000)
    return { browser, context, page }
  } catch (error) {
    const category = error instanceof LiveFailure ? 'GUARD' : browserFailureCategory(error)
    onBrowserDiagnostic({ stage, category })
    if (browser) await browser.close()
    if (error instanceof LiveFailure) throw error
    throw new LiveFailure(`LIVE_BROWSER_${stage}_${category}`)
  }
}

/** One policy is applied both to Playwright's relay and to every native redirect hop. */
export function browserRequestDecision({ url, method, targetOrigin, supabaseOrigin, readOnly = false }) {
  let parsed
  try { parsed = new URL(url) } catch { return { allowed: false, category: 'INVALID_REQUEST' } }
  if (parsed.username || parsed.password) return { allowed: false, category: 'INVALID_REQUEST' }
  const read = ['GET', 'HEAD', 'OPTIONS'].includes(method)
  const application = parsed.origin === targetOrigin
  const supabase = Boolean(supabaseOrigin) && parsed.origin === supabaseOrigin
  const font = ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'].includes(parsed.origin)
  if (!application && !supabase && !font) return { allowed: false, category: read ? 'EXTERNAL_REQUEST' : 'MUTATION' }
  if (read) return { allowed: true }
  const permittedWrite = !readOnly && method === 'POST' && ((application && [API_PATH, '/api/auth/signout'].includes(parsed.pathname))
    || (supabase && ['/auth/v1/token', '/auth/v1/logout'].includes(parsed.pathname)))
  return permittedWrite ? { allowed: true } : { allowed: false, category: 'MUTATION' }
}

/**
 * Playwright continues redirected requests without invoking context.route again.
 * This independent CDP session only allows or fails the real native request; it
 * never replaces a response, changes a header, or relaxes certificate checks.
 */
export async function installNativeRequestGuard({ context, page, policy, requests = requestTracker(),
  cancellation = cooperativeCancellation(), onBlocked = () => {}, onFailure = () => {},
}) {
  const cdp = await context.newCDPSession(page)
  const origins = new Map()
  const state = { requestsChecked: 0, redirectsChecked: 0, blockedRedirects: 0, blockedMutations: 0, blockedExternalRequests: 0, failures: 0 }
  let stopped = false
  cdp.on('Fetch.requestPaused', (event) => {
    let allowed = false
    let category
    let cancelled = stopped
    try { cancellation.check() } catch { cancelled = true }
    if (!cancelled) {
      state.requestsChecked++
      try {
        const url = new URL(event.request.url)
        const redirected = Boolean(event.redirectedRequestId)
        if (redirected) state.redirectsChecked++
        // A redirect may never change origin, even to another separately allowed service.
        const sameOriginChain = !redirected || origins.get(event.redirectedRequestId) === url.origin
        const decision = browserRequestDecision({ url: event.request.url, method: event.request.method, ...policy })
        allowed = sameOriginChain && decision.allowed
        category = !sameOriginChain ? 'REDIRECT' : decision.category
        origins.set(event.requestId, url.origin)
      } catch { category = 'INVALID_REQUEST' }
      if (!allowed) {
        if (category === 'REDIRECT') state.blockedRedirects++
        else if (category === 'MUTATION') state.blockedMutations++
        else if (category === 'EXTERNAL_REQUEST') state.blockedExternalRequests++
        else state.failures++
        onBlocked(category)
      }
    }
    // Attach the handler immediately: closing the browser must not strand a rejected command.
    requests.track(() => cdp.send(allowed ? 'Fetch.continueRequest' : 'Fetch.failRequest', allowed
      ? { requestId: event.requestId }
      : { requestId: event.requestId, errorReason: 'BlockedByClient' },
    )).catch((error) => {
      if (!stopped) { state.failures++; onFailure(browserFailureCategory(error)) }
    })
  })
  await cdp.send('Fetch.enable', { patterns: [{ urlPattern: '*', requestStage: 'Request' }] })
  return { state, stop: () => { stopped = true } }
}

export async function browserPreflight(browserConfig, { target, supabaseOrigin, vercelProtectionCookies = [], vercelProtectionBypass,
  requests = requestTracker(), cancellation = cooperativeCancellation(), onHttpDiagnostic = () => {}, onBrowserDiagnostic = () => {},
} = {}) {
  const view = await prepareBrowserContext({ browserConfig, origin: target?.origin, cookies: vercelProtectionCookies, onBrowserDiagnostic })
  let stopped = false
  let relayFailure
  let blockedRedirect = false
  let nativeGuard
  let privateResponseStatus
  let stage = 'PREFLIGHT_ROUTING'
  try {
    cancellation.check()
    if (target) {
      const policy = { targetOrigin: target.origin, supabaseOrigin, readOnly: true }
      nativeGuard = await installNativeRequestGuard({ context: view.context, page: view.page, policy, requests, cancellation,
        onBlocked: (category) => { if (category === 'REDIRECT') blockedRedirect = true },
        onFailure: (category) => onBrowserDiagnostic({ stage: 'PREFLIGHT_NATIVE_GUARD', category }),
      })
      await view.context.route('**/*', async (route) => {
        if (stopped) return route.abort('blockedbyclient')
        try { cancellation.check() } catch { return route.abort('blockedbyclient') }
        const request = route.request()
        const url = new URL(request.url())
        if (!browserRequestDecision({ url: request.url(), method: request.method(), ...policy }).allowed) return route.abort('blockedbyclient')
        const headers = { ...await request.allHeaders() }
        delete headers['x-vercel-protection-bypass']
        if (url.origin === target.origin && vercelProtectionBypass) headers['x-vercel-protection-bypass'] = vercelProtectionBypass
        const result = await relayRealRoute(route, { expectedOrigin: url.origin, headers, requests })
        if (result.diagnostic) onHttpDiagnostic(result.diagnostic)
        if (url.origin === target.origin && url.pathname === PAGE_PATH) privateResponseStatus = result.diagnostic?.status
        if (result.blockedRedirect) blockedRedirect = true
        if (result.transportFailure) { relayFailure = result.transportCategory; onBrowserDiagnostic({ stage: 'PREFLIGHT_RELAY', category: result.transportCategory }) }
      })
      stage = 'PREFLIGHT_HEALTH'
      const response = await view.page.goto(target.origin + '/api/health/live', { waitUntil: 'domcontentloaded' })
      check(response?.status() !== 429, 'LIVE_BROWSER_RATE_LIMITED')
      check(response?.status() === 200, 'LIVE_BROWSER_HEALTH_HTTP_FAILED')
      const health = await response.json()
      check(health?.status === 'ok', 'LIVE_BROWSER_HEALTH_CONTRACT_FAILED')
      check(!blockedRedirect && !relayFailure, 'LIVE_BROWSER_HEALTH_RELAY_FAILED')
      stage = 'PREFLIGHT_ANONYMOUS_REDIRECT'
      const signin = await view.page.goto(target.origin + PAGE_PATH, { waitUntil: 'domcontentloaded' })
      check(privateResponseStatus === 307, 'LIVE_BROWSER_ANONYMOUS_PRIVATE_REDIRECT_MISSING')
      const destination = new URL(view.page.url())
      check(destination.origin === target.origin && destination.pathname === '/auth/signin', 'LIVE_BROWSER_ANONYMOUS_SIGNIN_DESTINATION_FAILED')
      onHttpDiagnostic(httpDiagnostic({ path: '/auth/signin', method: 'GET', status: signin?.status(), contentType: signin?.headers()['content-type'] }))
      check(signin?.status() === 200, 'LIVE_BROWSER_ANONYMOUS_SIGNIN_HTTP_FAILED')
      check(nativeGuard.state.redirectsChecked >= 1, 'LIVE_BROWSER_NATIVE_REDIRECT_NOT_OBSERVED')
      check(nativeGuard.state.failures === 0 && nativeGuard.state.blockedMutations === 0, 'LIVE_BROWSER_PREFLIGHT_NATIVE_GUARD_FAILED')
      check(!blockedRedirect && !relayFailure, 'LIVE_BROWSER_PREFLIGHT_RELAY_FAILED')
      cancellation.check()
    }
    return { chromium: view.browser.version(), browserLaunchVerified: true, contextAndPageVerified: true,
      cookieImportVerified: true, managedProxyConfigured: Boolean(configuredBrowserProxy()), previewHealthVerified: Boolean(target),
      anonymousPrivateRedirectVerified: Boolean(target), nativeRedirectGuardVerified: Boolean(nativeGuard?.state.redirectsChecked),
    }
  } catch (error) {
    const category = error instanceof LiveFailure ? 'GUARD' : browserFailureCategory(error)
    onBrowserDiagnostic({ stage, category })
    if (blockedRedirect) throw new LiveFailure('LIVE_BROWSER_PREFLIGHT_CROSS_ORIGIN_REDIRECT')
    if (relayFailure) throw new LiveFailure(`LIVE_BROWSER_PREFLIGHT_RELAY_${relayFailure}`)
    if (error instanceof LiveFailure) throw error
    throw new LiveFailure(`LIVE_BROWSER_${stage}_${category}`)
  } finally { stopped = true; nativeGuard?.stop(); await requests.drain(); await view.browser.close() }
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
    } catch (error) {
      try { await route.abort('failed') } catch { /* The request may already be closed. */ }
      return { transportFailure: true, transportCategory: browserFailureCategory(error), ...(diagnostic ? { diagnostic } : {}) }
    } finally { if (response) await response.dispose() }
  })
}

/** Initial requests use the real relay; native redirects retain real HTTP under the CDP guard. */
async function openOwner({ config, owner, viewport, cancellation, requests, onHttpDiagnostic, onBrowserDiagnostic }) {
  const { browser, context, page } = await prepareBrowserContext({ browserConfig: config.browser, origin: config.target.origin,
    cookies: [...owner.cookies.getAll(), ...config.vercelProtectionCookies], viewport, onBrowserDiagnostic,
  })
  let stopNewRequests = false
  let nativeGuard
  let stage = 'ROUTING'
  try {
    const state = { runtimeErrors: 0, consoleErrors: 0, blockedExternalRequests: 0, blockedMutations: 0, blockedRedirects: 0, relayFailures: 0, nativeGuardFailures: 0, outcomesHttpErrors: 0, writes: [] }
    const policy = { targetOrigin: config.target.origin, supabaseOrigin: config.supabase.url }
    nativeGuard = await installNativeRequestGuard({ context, page, policy, requests, cancellation,
      onBlocked: (category) => {
        if (category === 'REDIRECT') state.blockedRedirects++
        else if (category === 'MUTATION') state.blockedMutations++
        else if (category === 'EXTERNAL_REQUEST') state.blockedExternalRequests++
        else state.nativeGuardFailures++
      },
      onFailure: (category) => { state.nativeGuardFailures++; onBrowserDiagnostic({ stage: 'NATIVE_GUARD', category }) },
    })
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
      const decision = browserRequestDecision({ url: request.url(), method: request.method(), ...policy })
      if (!decision.allowed) {
        if (decision.category === 'MUTATION') state.blockedMutations++
        else state.blockedExternalRequests++
        return route.abort('blockedbyclient')
      }
      const relay = async (headers) => {
        const result = await relayRealRoute(route, { expectedOrigin: url.origin, headers, requests })
        if (result.diagnostic) onHttpDiagnostic(result.diagnostic)
        if (result.blockedRedirect) state.blockedRedirects++
        if (result.transportFailure) { state.relayFailures++; onBrowserDiagnostic({ stage: 'RELAY', category: result.transportCategory }) }
      }
      if (url.origin === config.target.origin) {
        if (url.pathname === API_PATH && request.method() === 'POST') {
          // Only synthetic in-memory payloads. Never persist this collection or browser storage state.
          state.writes.push(request.postDataJSON())
        }
        return relay({ ...await request.allHeaders(), ...(config.vercelProtectionBypass ? { 'x-vercel-protection-bypass': config.vercelProtectionBypass } : {}) })
      }
      if (url.origin === config.supabase.url) {
        const headers = { ...await request.allHeaders() }
        delete headers['x-vercel-protection-bypass']
        return relay(headers)
      }
      if (['https://fonts.googleapis.com', 'https://fonts.gstatic.com'].includes(url.origin)) {
        const headers = { ...await request.allHeaders() }
        delete headers['x-vercel-protection-bypass']
        return relay(headers)
      }
      state.blockedExternalRequests++
      return route.abort('blockedbyclient')
    })
    stage = 'NAVIGATION'
    await page.goto(config.target.origin + PAGE_PATH, { waitUntil: 'domcontentloaded' })
    stage = 'READY'
    await ready(page)
    cancellation.check()
    return { browser, context, page, state, stopRequests: () => { stopNewRequests = true; nativeGuard.stop() } }
  } catch (error) {
    const category = error instanceof LiveFailure ? 'GUARD' : browserFailureCategory(error)
    onBrowserDiagnostic({ stage, category })
    stopNewRequests = true; nativeGuard?.stop(); await requests.drain(); await browser.close()
    if (error instanceof LiveFailure) throw error
    throw new LiveFailure(`LIVE_BROWSER_${stage}_${category}`)
  }
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
  checkBrowserState(view)
}

function checkBrowserState(view, expectedOutcomesHttpErrors = 0) {
  check(view.state.runtimeErrors === 0, 'LIVE_BROWSER_RUNTIME_ERROR')
  check(view.state.blockedMutations === 0, 'LIVE_BROWSER_UNEXPECTED_MUTATION')
  check(view.state.blockedRedirects === 0, 'LIVE_BROWSER_CROSS_ORIGIN_REDIRECT')
  check(view.state.relayFailures === 0, 'LIVE_BROWSER_RELAY_FAILURE')
  check(view.state.nativeGuardFailures === 0, 'LIVE_BROWSER_NATIVE_GUARD_FAILURE')
  check(view.state.outcomesHttpErrors === expectedOutcomesHttpErrors, 'LIVE_BROWSER_OUTCOMES_HTTP_FAILURE')
}

export async function runBrowserJourney({ config, a, b, getSummary, post, cancellation = cooperativeCancellation(), requests = requestTracker(), onHttpDiagnostic = () => {}, onBrowserDiagnostic = () => {} }) {
  const evidence = { cases: [], screenshots: [], apiMocks: 0, credentialStorage: 'process-and-browser-context-memory-only' }
  let view
  let rateLimited = false
  const observe = (diagnostic) => { if (diagnostic.status === 429) rateLimited = true; onHttpDiagnostic(diagnostic) }
  let stage = 'MOBILE_ENTRY'
  try {
    cancellation.check()
    view = await openOwner({ config, owner: a, viewport: { width: 390, height: 844 }, cancellation, requests, onHttpDiagnostic: observe, onBrowserDiagnostic })
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
    view = await openOwner({ config, owner: b, viewport: { width: 1440, height: 960 }, cancellation, requests, onHttpDiagnostic: observe, onBrowserDiagnostic })
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
    const signedOutPage = await view.page.goto(config.target.origin + PAGE_PATH, { waitUntil: 'domcontentloaded' })
    const signedOutDestination = new URL(view.page.url())
    observe(httpDiagnostic({ path: signedOutDestination.pathname, method: 'GET', status: signedOutPage?.status(), contentType: signedOutPage?.headers()['content-type'] }))
    check(signedOutDestination.origin === config.target.origin && signedOutDestination.pathname === '/auth/signin', 'SIGNED_OUT_BROWSER_PRIVATE_PAGE_REMAINS')
    check(signedOutPage?.status() === 200, 'SIGNED_OUT_BROWSER_SIGNIN_HTTP_FAILED')
    checkBrowserState(view, 1) // The explicit anonymous API check above must be the only rejected Outcomes response.
    evidence.cases.push({ name: 'actual-app-signout-removes-private-page-and-api-access', status: 'PASS' })
    check(!rateLimited, 'LIVE_BROWSER_RATE_LIMITED')
    return evidence
  } catch (error) {
    if (rateLimited) throw new LiveFailure('LIVE_BROWSER_RATE_LIMITED')
    if (error instanceof LiveFailure) throw error
    const category = browserFailureCategory(error)
    onBrowserDiagnostic({ stage, category })
    throw new LiveFailure(`LIVE_BROWSER_${stage}_${category}`)
  } finally { view?.stopRequests(); await requests.drain(); if (view) await view.browser.close() }
}
