import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { createWriteStream, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { spawn } from 'node:child_process'

assert.equal(process.env.A1_BROWSER_LAB, 'yes', 'Only the disposable browser lab may run')

const root = resolve(process.env.A1_LAB_ROOT)
const appRoot = join(root, 'app-runtime')
const base = 'http://localhost:3112'
const status = JSON.parse(readFileSync(join(root, 'status.json'), 'utf8'))
const fixtures = JSON.parse(readFileSync(join(root, 'fixtures.private.json'), 'utf8'))
assert.ok(['127.0.0.1', 'localhost'].includes(new URL(status.API_URL).hostname), 'Remote Supabase forbidden')

const write = (path, content) => {
  const target = join(appRoot, path)
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, content)
}

const sentinel = (label) => `export default function Page(){return <main><h1>${label}</h1></main>}\n`
for (const [path, label] of [
  ['app/demo/page.tsx', 'DEMO SENTINEL SHOULD NEVER RENDER'],
  ['app/test/page.tsx', 'TEST SENTINEL SHOULD NEVER RENDER'],
  ['app/design-system/page.tsx', 'DESIGN SENTINEL SHOULD NEVER RENDER'],
  ['app/auth/debug/page.tsx', 'AUTH DEBUG SENTINEL SHOULD NEVER RENDER'],
  ['app/auth/test/page.tsx', 'AUTH TEST SENTINEL SHOULD NEVER RENDER'],
]) write(path, sentinel(label))
write('app/despega/runtime-boundary-sentinel/page.tsx', sentinel('PROTECTED BOUNDARY SENTINEL'))

const requireTool = createRequire(join(process.env.A1_TOOLS_ROOT, 'package.json'))
const { chromium } = requireTool('playwright')
const evidence = join(root, 'evidence')
const serverLog = join(root, 'runtime-boundary-server.private.log')
const output = createWriteStream(serverLog)
const server = spawn(
  process.execPath,
  [join(process.cwd(), 'node_modules/next/dist/bin/next'), 'dev', '--hostname', 'localhost', '--port', '3112'],
  {
    cwd: appRoot,
    env: {
      ...process.env,
      VERCEL_ENV: 'preview',
      NEXT_PUBLIC_SUPABASE_URL: status.API_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: status.ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: status.SERVICE_ROLE_KEY,
      NEXT_TELEMETRY_DISABLED: '1',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  },
)
server.stdout.pipe(output)
server.stderr.pipe(output)

let browser
const checks = []
const pass = (name) => { checks.push({ name, status: 'PASS' }); console.log(`Runtime boundary: ${name}: PASS`) }
try {
  let ready = false
  for (let attempt = 0; attempt < 120; attempt += 1) {
    if (server.exitCode !== null) throw new Error('Runtime boundary server stopped before readiness')
    try {
      if ((await fetch(base)).ok) { ready = true; break }
    } catch {}
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 500))
  }
  assert.ok(ready, 'Runtime boundary server did not become ready')

  browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
  await context.route('**/*', (route) => {
    const host = new URL(route.request().url()).hostname
    return ['127.0.0.1', 'localhost'].includes(host) ? route.continue() : route.abort()
  })
  const page = await context.newPage()

  for (const path of ['/demo', '/test', '/design-system', '/auth/debug', '/auth/test']) {
    const response = await page.goto(base + path)
    assert.equal(response?.status(), 404, `${path} must be 404 in preview-equivalent runtime`)
    assert.ok(response?.headers()['x-dtc-request-id'], `${path} must keep request correlation`)
    assert.equal((await page.locator('body').innerText()).includes('SENTINEL SHOULD NEVER RENDER'), false)
  }
  pass('preview_environment_laboratories_are_real_http_404')

  await context.addCookies([
    { name: 'dtc_preview_access', value: '1', domain: 'localhost', path: '/' },
  ])
  const bypassAttempt = await page.goto(base + '/demo?preview=1')
  assert.equal(bypassAttempt?.status(), 404)
  assert.equal((await page.locator('body').innerText()).includes('SENTINEL SHOULD NEVER RENDER'), false)
  pass('legacy_preview_cookie_and_query_cannot_bypass_laboratory_boundary')

  await page.goto(base + '/despega/runtime-boundary-sentinel')
  await page.waitForURL('**/auth/signin?next=%2Fdespega%2Fruntime-boundary-sentinel')
  assert.equal(await page.getByRole('heading', { name: 'PROTECTED BOUNDARY SENTINEL' }).count(), 0)
  pass('anonymous_protected_route_redirects_before_content_render')

  const alpha = fixtures.users.find((user) => user.label === 'alpha')
  assert.ok(alpha)
  await page.getByLabel('Correo de prueba', { exact: true }).fill(alpha.email)
  await page.getByLabel('Contraseña de prueba', { exact: true }).fill(fixtures.password)
  await page.getByRole('button', { name: 'Entrar al laboratorio' }).click()
  await page.waitForURL('**/despega/runtime-boundary-sentinel')
  await page.getByRole('heading', { name: 'PROTECTED BOUNDARY SENTINEL' }).waitFor()
  pass('authenticated_pilot_member_reaches_same_protected_route')

  await context.clearCookies()
  await page.goto(base + '/despega/runtime-boundary-sentinel')
  await page.waitForURL('**/auth/signin?next=%2Fdespega%2Fruntime-boundary-sentinel')
  assert.equal(await page.getByRole('heading', { name: 'PROTECTED BOUNDARY SENTINEL' }).count(), 0)
  pass('cleared_session_cannot_restore_protected_content')

  writeFileSync(
    join(evidence, 'runtime-boundary-results.json'),
    JSON.stringify({
      commit: process.env.A1_SOURCE_COMMIT,
      scope: 'real production middleware over HTTP with VERCEL_ENV=preview; disposable local Next + Supabase only',
      checks,
      productionOrPreviewNetworkUsed: false,
      verdict: 'PASS',
    }, null, 2),
  )
} catch (error) {
  process.exitCode = 1
  checks.push({ name: 'suite', status: 'FAIL', message: error instanceof Error ? error.message : 'unknown' })
  writeFileSync(
    join(evidence, 'runtime-boundary-results.json'),
    JSON.stringify({ commit: process.env.A1_SOURCE_COMMIT, checks, verdict: 'FAIL' }, null, 2),
  )
  console.error('Runtime boundary browser failed; inspect sanitized result artifact.')
} finally {
  if (browser) await browser.close()
  server.kill('SIGTERM')
  output.end()
}
