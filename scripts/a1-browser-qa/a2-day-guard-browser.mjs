import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { createWriteStream, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { spawn } from 'node:child_process'

assert.equal(process.env.A1_BROWSER_LAB, 'yes')
const root = resolve(process.env.A1_LAB_ROOT)
const appRoot = join(root, 'app-runtime')
const base = 'http://localhost:3113'
const status = JSON.parse(readFileSync(join(root, 'status.json'), 'utf8'))
const fixtures = JSON.parse(readFileSync(join(root, 'fixtures.private.json'), 'utf8'))
assert.ok(['127.0.0.1', 'localhost'].includes(new URL(status.API_URL).hostname), 'Remote Supabase forbidden')
const alpha = fixtures.users.find((user) => user.label === 'alpha')
assert.ok(alpha)

const layoutTarget = join(appRoot, 'app/despega/a2/[day]/layout.tsx')
mkdirSync(dirname(layoutTarget), { recursive: true })
writeFileSync(layoutTarget, readFileSync(join(process.cwd(), 'app/despega/a2/[day]/layout.tsx'), 'utf8'))
writeFileSync(join(dirname(layoutTarget), 'page.tsx'), `export default async function Page({params}){const {day}=await params;return <main><h1>A2 DAY SENTINEL {day}</h1></main>}\n`)

const requireTool = createRequire(join(process.env.A1_TOOLS_ROOT, 'package.json'))
const { chromium } = requireTool('playwright')
const output = createWriteStream(join(root, 'a2-day-guard.private.log'))
const server = spawn(process.execPath, [join(process.cwd(), 'node_modules/next/dist/bin/next'), 'dev', '--hostname', 'localhost', '--port', '3113'], {
  cwd: appRoot,
  env: { ...process.env, NEXT_PUBLIC_SUPABASE_URL: status.API_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY: status.ANON_KEY, SUPABASE_SERVICE_ROLE_KEY: status.SERVICE_ROLE_KEY, NEXT_TELEMETRY_DISABLED: '1' },
  stdio: ['ignore', 'pipe', 'pipe'],
})
server.stdout.pipe(output); server.stderr.pipe(output)
let browser
try {
  let ready = false
  for (let attempt = 0; attempt < 120; attempt += 1) {
    if (server.exitCode !== null) throw new Error('A2 guard server stopped before readiness')
    try { if ((await fetch(base)).ok) { ready = true; break } } catch {}
    await new Promise((r) => setTimeout(r, 500))
  }
  assert.ok(ready, 'A2 guard server did not become ready')

  browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
  await context.route('**/*', (route) => ['localhost', '127.0.0.1'].includes(new URL(route.request().url()).hostname) ? route.continue() : route.abort())
  const page = await context.newPage()

  await page.goto(base + '/auth/signin?next=%2Fdespega%2Fa2%2Fdia-31')
  await page.getByLabel('Correo de prueba', { exact: true }).fill(alpha.email)
  await page.getByLabel('Contraseña de prueba', { exact: true }).fill(fixtures.password)
  await page.getByRole('button', { name: 'Entrar al laboratorio' }).click()
  await page.waitForURL('**/despega/a2/dia-7')
  assert.equal(await page.getByText(/A2 DAY SENTINEL/).count(), 0)

  for (const requested of [31, 61, 90]) {
    await page.goto(base + `/despega/a2/dia-${requested}`)
    await page.waitForURL('**/despega/a2/dia-7')
    assert.equal(await page.getByText(/A2 DAY SENTINEL/).count(), 0, `Day ${requested} content rendered before guard`)
  }

  writeFileSync(join(root, 'evidence', 'a2-day-guard.json'), JSON.stringify({ commit: process.env.A1_SOURCE_COMMIT, highestUnlockedDay: 7, blockedDirectDays: [31, 61, 90], redirectDay: 7, productionLayoutUsed: true, verdict: 'PASS' }, null, 2))
  console.log('DTC A2 direct-day SSR guard: PASS (31/61/90 -> day 7 before render)')
} finally {
  if (browser) await browser.close()
  server.kill('SIGTERM')
  output.end()
}
