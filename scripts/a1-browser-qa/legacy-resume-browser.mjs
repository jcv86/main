import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { createWriteStream, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { spawn } from 'node:child_process'

assert.equal(process.env.A1_BROWSER_LAB, 'yes', 'Only the disposable browser lab may run')

const root = resolve(process.env.A1_LAB_ROOT)
const appRoot = join(root, 'app-runtime')
const base = 'http://localhost:3113'
const status = JSON.parse(readFileSync(join(root, 'status.json'), 'utf8'))
const fixtures = JSON.parse(readFileSync(join(root, 'fixtures.private.json'), 'utf8'))
assert.ok(['127.0.0.1', 'localhost'].includes(new URL(status.API_URL).hostname), 'Remote Supabase forbidden')

const write = (path, content) => {
  const target = join(appRoot, path)
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, content)
}

const legacyRoutes = [
  'app/despega/conozcamonos/1/page.tsx',
  'app/despega/conozcamonos/2/page.tsx',
  'app/despega/conozcamonos/3/page.tsx',
  'app/despega/conozcamonos/4/page.tsx',
  'app/despega/conozcamonos-3/page.tsx',
  'app/despega/conozcamonos-4/page.tsx',
]
for (const path of legacyRoutes) write(path, readFileSync(join(process.cwd(), path), 'utf8'))

write('app/despega/a3/career-mirror/page.tsx', `export default function Page(){return <h1>CANONICAL CAREER MIRROR RESUME</h1>}\n`)
write('app/despega/conozcamonos-1/page.tsx', `export default function Page(){return <h1>CANONICAL C1 RESUME</h1>}\n`)

const requireTool = createRequire(join(process.env.A1_TOOLS_ROOT, 'package.json'))
const { chromium } = requireTool('playwright')
const serverLog = join(root, 'legacy-resume-server.private.log')
const output = createWriteStream(serverLog)
const server = spawn(
  process.execPath,
  [join(process.cwd(), 'node_modules/next/dist/bin/next'), 'dev', '--hostname', 'localhost', '--port', '3113'],
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

async function login(page, user, nextPath) {
  await page.goto(`${base}/auth/signin?next=${encodeURIComponent(nextPath)}`)
  await page.getByLabel('Correo de prueba', { exact: true }).fill(user.email)
  await page.getByLabel('Contraseña de prueba', { exact: true }).fill(fixtures.password)
  await page.getByRole('button', { name: 'Entrar al laboratorio' }).click()
}

let browser
try {
  let ready = false
  for (let attempt = 0; attempt < 120; attempt += 1) {
    if (server.exitCode !== null) throw new Error('Legacy resume server stopped before readiness')
    try {
      if ((await fetch(base)).ok) { ready = true; break }
    } catch {}
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 500))
  }
  assert.ok(ready, 'Legacy resume server did not become ready')

  browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
  await context.route('**/*', (route) => {
    const host = new URL(route.request().url()).hostname
    return ['127.0.0.1', 'localhost'].includes(host) ? route.continue() : route.abort()
  })
  const page = await context.newPage()

  const alpha = fixtures.users.find((user) => user.label === 'alpha')
  const beta = fixtures.users.find((user) => user.label === 'beta')
  assert.ok(alpha && beta)

  await login(page, alpha, '/despega/conozcamonos/3')
  await page.waitForURL('**/despega/a3/career-mirror')
  await page.getByRole('heading', { name: 'CANONICAL CAREER MIRROR RESUME' }).waitFor()

  for (const path of [
    '/despega/conozcamonos/1',
    '/despega/conozcamonos/2',
    '/despega/conozcamonos/3',
    '/despega/conozcamonos/4',
    '/despega/conozcamonos-3',
    '/despega/conozcamonos-4',
  ]) {
    await page.goto(base + path)
    await page.waitForURL('**/despega/a3/career-mirror')
    assert.equal(await page.getByRole('heading', { name: 'CANONICAL CAREER MIRROR RESUME' }).count(), 1)
  }
  console.log('Legacy resume: A2 Day 7 checkpoint converges to canonical Career Mirror: PASS')

  await context.clearCookies()
  await login(page, beta, '/despega/conozcamonos/4')
  await page.waitForURL('**/despega/conozcamonos-1')
  await page.getByRole('heading', { name: 'CANONICAL C1 RESUME' }).waitFor()
  console.log('Legacy resume: incomplete onboarding converges to canonical C1: PASS')

  writeFileSync(
    join(root, 'evidence/legacy-resume-results.json'),
    JSON.stringify({
      commit: process.env.A1_SOURCE_COMMIT,
      scope: 'real legacy route modules + canonical journey service/flow + local Supabase Auth/PostgREST',
      checks: [
        'all six legacy routes converge to career-mirror for A2 Day 7 checkpoint user',
        'incomplete onboarding converges to canonical C1',
      ],
      productionOrPreviewNetworkUsed: false,
      verdict: 'PASS',
    }, null, 2),
  )
} catch (error) {
  process.exitCode = 1
  writeFileSync(
    join(root, 'evidence/legacy-resume-results.json'),
    JSON.stringify({
      commit: process.env.A1_SOURCE_COMMIT,
      verdict: 'FAIL',
      message: error instanceof Error ? error.message : 'unknown',
    }, null, 2),
  )
  console.error('Legacy resume browser failed; inspect sanitized result artifact.')
} finally {
  if (browser) await browser.close()
  server.kill('SIGTERM')
  output.end()
}
