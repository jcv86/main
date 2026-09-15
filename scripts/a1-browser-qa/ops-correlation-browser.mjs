import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { spawn } from 'node:child_process'

assert.equal(process.env.A1_BROWSER_LAB, 'yes', 'Only the disposable browser lab may run this test')

const root = resolve(process.env.A1_LAB_ROOT)
const base = 'http://localhost:3109'
const status = JSON.parse(readFileSync(join(root, 'status.json'), 'utf8'))
const fixtures = JSON.parse(readFileSync(join(root, 'fixtures.private.json'), 'utf8'))
assert.ok(['127.0.0.1', 'localhost'].includes(new URL(status.API_URL).hostname), 'Remote Supabase forbidden')

const requireTool = createRequire(join(process.env.A1_TOOLS_ROOT, 'package.json'))
const { chromium } = requireTool('playwright')
const alpha = fixtures.users.find((user) => user.label === 'alpha')
assert.ok(alpha)

let logs = ''
const server = spawn(
  process.execPath,
  [join(process.cwd(), 'node_modules/next/dist/bin/next'), 'dev', '--hostname', 'localhost', '--port', '3109'],
  {
    cwd: join(root, 'app-runtime'),
    env: {
      ...process.env,
      NEXT_PUBLIC_SUPABASE_URL: status.API_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: status.ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: status.SERVICE_ROLE_KEY,
      NEXT_TELEMETRY_DISABLED: '1',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  },
)
server.stdout.on('data', (chunk) => { logs += String(chunk) })
server.stderr.on('data', (chunk) => { logs += String(chunk) })

let browser
try {
  let ready = false
  for (let attempt = 0; attempt < 120; attempt += 1) {
    if (server.exitCode !== null) throw new Error('Lab server stopped before readiness')
    try {
      if ((await fetch(base)).ok) {
        ready = true
        break
      }
    } catch {}
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 500))
  }
  assert.ok(ready, 'Correlation lab server did not become ready')

  browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } })
  await context.route('**/*', (route) => {
    const hostname = new URL(route.request().url()).hostname
    return ['127.0.0.1', 'localhost'].includes(hostname) ? route.continue() : route.abort()
  })
  const page = await context.newPage()

  await page.goto(`${base}/auth/signin?next=%2F`)
  await page.getByLabel('Correo de prueba', { exact: true }).fill(alpha.email)
  await page.getByLabel('Contraseña de prueba', { exact: true }).fill(fixtures.password)
  await page.getByRole('button', { name: 'Entrar al laboratorio' }).click()
  await page.waitForURL(`${base}/`)

  const requestId = `dtc-browser-runtime-${Date.now().toString(36)}`
  const result = await page.evaluate(async ({ requestId }) => {
    const response = await fetch('/api/gamification/global', {
      headers: { 'x-dtc-request-id': requestId },
      cache: 'no-store',
    })
    return {
      status: response.status,
      headerRequestId: response.headers.get('x-dtc-request-id'),
      body: await response.json(),
    }
  }, { requestId })

  assert.equal(result.status, 200)
  assert.equal(result.headerRequestId, requestId)
  assert.equal(result.body.request_id, requestId)
  assert.equal(result.body.available, false)
  assert.equal(result.body.availability_reason, 'unavailable')

  await page.waitForTimeout(500)
  assert.ok(logs.includes(requestId), 'Server log must include the browser request id')
  assert.ok(logs.includes('gamification.global.failed'), 'Server log must include the structured failure event')
  assert.ok(!logs.includes(alpha.email), 'Structured logs must not expose the synthetic user email')
  assert.ok(!logs.includes(fixtures.password), 'Structured logs must not expose credentials')

  writeFileSync(
    join(root, 'evidence', 'ops-correlation.json'),
    JSON.stringify({
      commit: process.env.A1_SOURCE_COMMIT,
      scope: 'real browser -> real Next middleware -> real API route -> structured server log; disposable local Supabase only',
      requestIdMatchedBrowserApiAndLog: true,
      failureWasDeliberateMissingGamificationTables: true,
      userIdentifierPresentInStructuredLog: false,
      verdict: 'PASS',
    }, null, 2),
  )
  console.log('DTC ops correlation browser: PASS (browser -> middleware -> API -> redacted log)')
} finally {
  if (browser) await browser.close()
  server.kill('SIGTERM')
}
