/** Browser prerequisite only: two native tabs, synthetic loopback pages, no application or Auth. */
import assert from 'node:assert/strict'
import { once } from 'node:events'
import { existsSync, mkdirSync, realpathSync, writeFileSync } from 'node:fs'
import { createServer } from 'node:http'
import { createRequire } from 'node:module'
import { join, resolve, sep } from 'node:path'
import { createNativeTabReturn } from './native-tab-return.mjs'
import { assertNativeTabFocusAdapter } from './prepare-native-tab-focus.mjs'

assert.equal(process.env.A1_BROWSER_LAB, 'yes', 'Explicit disposable browser lab opt-in required')
assert.ok(process.env.RUNNER_TEMP, 'Runner temporary storage is required')
const temporary = realpathSync(resolve(process.env.RUNNER_TEMP))
const evidenceDirectory = join(temporary, 'dtc-a2-swarm-evidence')
const output = join(evidenceDirectory, 'focus-visibility-preflight.json')
const labRoot = process.env.A1_LAB_ROOT ? resolve(process.env.A1_LAB_ROOT) : null
assert.ok(!labRoot || (labRoot !== evidenceDirectory && !evidenceDirectory.startsWith(labRoot + sep)),
  'Preflight evidence must remain outside the future application lab')
const labExistedBefore = labRoot ? existsSync(labRoot) : false
const startedAt = new Date().toISOString()
let browser, server, probe, nativeTabReturn = null, playwrightVersion = null, chromiumVersion = null
let nativeFocusAdapter = null
let phase = 'environment', failure = null, blockedRequests = 0, pagesServed = 0
const javascriptErrors = []

try {
  assert.ok(process.env.DISPLAY?.trim(), 'Headed Chromium requires DISPLAY; run this preflight with xvfb-run')
  assert.equal(process.env.DTC_NATIVE_TAB_FOCUS, 'yes', 'Native focus requires the scoped adapter flag')
  assert.ok(process.env.A1_TOOLS_ROOT, 'Isolated browser tools are required')
  const toolsRoot = realpathSync(resolve(process.env.A1_TOOLS_ROOT))
  assert.ok(toolsRoot.startsWith(temporary + sep), 'Browser tools must remain inside runner temporary storage')
  nativeFocusAdapter = assertNativeTabFocusAdapter()
  const requireTools = createRequire(join(toolsRoot, 'package.json'))
  const { chromium } = requireTools('playwright')
  playwrightVersion = requireTools('playwright/package.json').version
  assert.equal(playwrightVersion, '1.56.1', 'Preflight must use the same pinned Playwright as the acceptance workflow')

  phase = 'loopback_server'
  server = createServer((request, response) => {
    const pathname = new URL(request.url, 'http://127.0.0.1').pathname
    if (request.method === 'GET' && ['/primary', '/sibling'].includes(pathname)) {
      pagesServed++
      response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' })
      response.end('<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Synthetic tab focus preflight</title></head><body><main><h1>Synthetic browser prerequisite</h1><p>No account, application data or database is used.</p></main></body></html>')
    } else {
      response.writeHead(404, { 'Cache-Control': 'no-store' })
      response.end()
    }
  })
  const listening = once(server, 'listening')
  server.listen(0, '127.0.0.1')
  await listening
  const base = `http://127.0.0.1:${server.address().port}`

  phase = 'headed_chromium'
  browser = await chromium.launch({ headless: false, timeout: 15_000 })
  chromiumVersion = browser.version()
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, serviceWorkers: 'block' })
  await context.route('**/*', route => {
    if (new URL(route.request().url()).origin === base) return route.continue()
    blockedRequests++
    return route.abort()
  })
  const page = await context.newPage()
  const sibling = await context.newPage()
  for (const tab of [page, sibling]) {
    tab.setDefaultTimeout(10_000)
    tab.setDefaultNavigationTimeout(10_000)
    tab.on('pageerror', error => javascriptErrors.push(error.name))
  }
  await page.goto(base + '/primary')
  await sibling.goto(base + '/sibling')

  phase = 'native_tab_return'
  probe = await createNativeTabReturn(page, sibling, { timeout: 10_000 })
  await probe.leave()
  nativeTabReturn = await probe.returnToPage()
  assert.equal(pagesServed, 2, 'Both real tabs must load the synthetic loopback pages')
  assert.equal(blockedRequests, 0, 'The prerequisite must not attempt external network access')
  assert.deepEqual(javascriptErrors, [], 'The prerequisite must not produce JavaScript errors')
  phase = 'complete'
} catch (error) {
  failure = { phase, name: error instanceof Error ? error.name : 'Error',
    message: error instanceof Error ? error.message.slice(0, 1500) : 'Unknown preflight failure' }
} finally {
  const cleanupFailure = (error, action) => {
    failure ||= { phase: 'cleanup', name: error instanceof Error ? error.name : 'Error', message: action }
  }
  if (probe) await probe.dispose().catch(error => cleanupFailure(error, 'Could not release native tab observation'))
  if (browser) await browser.close().catch(error => cleanupFailure(error, 'Could not close the disposable browser'))
  if (server) {
    server.closeAllConnections()
    await new Promise(done => server.close(error => {
      if (error && error.code !== 'ERR_SERVER_NOT_RUNNING') cleanupFailure(error, 'Could not close the loopback server')
      done()
    }))
  }
  if (labRoot && existsSync(labRoot) !== labExistedBefore) {
    failure ||= { phase: 'isolation', name: 'Error', message: 'Preflight changed the application lab directory presence' }
  }
  mkdirSync(evidenceDirectory, { recursive: true })
  writeFileSync(output, JSON.stringify({
    suite: 'native-focus-visibility-preflight', version: 1,
    sourceCommit: process.env.A1_SOURCE_COMMIT || null,
    startedAt, finishedAt: new Date().toISOString(), status: failure ? 'FAIL' : 'PASS',
    nodeVersion: process.version, playwrightVersion, chromiumVersion, nativeFocusAdapter,
    environment: 'disposable-headed-chromium-loopback', headless: false,
    applicationStarted: false, authenticationUsed: false, databaseUsed: false,
    applicationLabCreated: Boolean(labRoot && !labExistedBefore && existsSync(labRoot)),
    pagesServed, blockedRequests, javascriptErrors,
    nativeTabReturn, failure,
  }, null, 2) + '\n')
}

console.log(JSON.stringify({ suite: 'native-focus-visibility-preflight', status: failure ? 'FAIL' : 'PASS',
  playwrightVersion, headless: false, phase: failure?.phase || 'complete', evidence: 'focus-visibility-preflight.json' }))
if (failure) process.exitCode = 1
