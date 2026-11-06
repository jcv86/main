import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { createRequire } from 'node:module'
import { createWriteStream, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { closureLab, closureServerEnv, safeFailure } from './closure-lab.mjs'
import { AUTH_VIEWPORTS, assertAuthSources } from './auth-lab.mjs'

const { root, app, repo, status, evidence } = closureLab()
const port = 3118, base = `http://localhost:${port}`, draftPath = '/api/assessments/drafts/c1'
const fixture = JSON.parse(readFileSync(join(root, 'c1-fixtures.private.json'), 'utf8'))
assert.equal(fixture.scope, 'disposable-local-c1')
assert.equal(fixture.users.length, 2)
const manifest = JSON.parse(readFileSync(join(root, 'c1-prepared.json'), 'utf8'))
assert.equal(manifest.environment, 'disposable-local-c1')
assertAuthSources(JSON.parse(readFileSync(join(root, 'auth-prepared.json'), 'utf8')), app, repo)
for (const item of manifest.copied) {
  const source = readFileSync(join(repo, item.path)), copied = readFileSync(join(app, item.path))
  assert.deepEqual(source, copied)
  assert.equal(createHash('sha256').update(copied).digest('hex'), item.sha256)
}
const requireTools = createRequire(join(process.env.A1_TOOLS_ROOT, 'package.json'))
const requireApp = createRequire(join(repo, 'package.json'))
const { chromium } = requireTools('playwright')
const { default: AxeBuilder } = requireTools('@axe-core/playwright')
const { createClient } = requireApp('@supabase/supabase-js')
const { Client } = requireApp('pg')
const db = new Client({ connectionString: status.DB_URL })
const steps = [], accessibility = [], layouts = [], javascriptErrors = [], blockedHosts = new Set()
const secrets = [fixture.password, status.ANON_KEY, status.SERVICE_ROLE_KEY, status.DB_URL]
let browser, server, log, phase = 'setup', failure = null
const record = name => { steps.push({ phase, name, status: 'PASS' }); console.log(`C1 acceptance: ${phase}: ${name}: PASS`) }

async function request(page, method, body) {
  return page.evaluate(async ({ method, body, path }) => {
    const response = await fetch(path, { method, cache: 'no-store', credentials: 'include',
      ...(body === undefined ? {} : { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }) })
    return { status: response.status, body: await response.json() }
  }, { method, body, path: draftPath })
}
async function savedAdvance(page, name = 'Siguiente', expected = 200) {
  const response = page.waitForResponse(value => new URL(value.url()).pathname === draftPath && value.request().method() === 'PUT')
  await page.getByRole('button', { name, exact: true }).click()
  assert.equal((await response).status(), expected, 'Draft response must match the observed action')
}
async function question(page, text) {
  await page.getByRole('heading', { name: text, exact: true }).waitFor()
}
async function visual(page, name) {
  await page.evaluate(() => document.fonts.ready)
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
  const layout = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth }))
  layouts.push({ phase, name, ...layout })
  await page.screenshot({ path: join(evidence, `c1-${phase}-${name}.png`), fullPage: true })
  assert.ok(layout.document <= layout.viewport + 1, `C1 overflow: ${name}`)
  const scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
  const violations = scan.violations.map(item => ({ id: item.id, impact: item.impact, targets: item.nodes.map(node => node.target) }))
  accessibility.push({ phase, name, violations, incomplete: scan.incomplete.map(item => item.id) })
  assert.equal(violations.filter(item => ['serious', 'critical'].includes(item.impact)).length, 0, `C1 accessibility: ${name}`)
}
async function ownerBoundary(owner, other) {
  const client = createClient(status.API_URL, status.ANON_KEY, { auth: { persistSession: false, autoRefreshToken: false } })
  const login = await client.auth.signInWithPassword({ email: other.email, password: fixture.password })
  assert.ok(!login.error && login.data.session, 'Use real JWT for the second-owner boundary')
  const read = await client.from('assessment_drafts').select('answers').eq('user_id', owner.id)
  assert.equal(read.error, null); assert.deepEqual(read.data, [])
  const write = await client.from('assessment_drafts').update({ answers: { 1: ['Desempleado'] } }).eq('user_id', owner.id).select('user_id')
  assert.equal(write.error, null); assert.deepEqual(write.data, [])
  const insert = await client.from('assessment_drafts').insert({ user_id: owner.id, assessment_type: 'a1', answers: {} })
  assert.equal(insert.error?.code, '42501')
  await client.auth.signOut({ scope: 'local' })
  record('second owner cannot read, change or impersonate the draft owner')
}

try {
  await db.connect()
  log = createWriteStream(join(root, 'c1-server.private.log'), { mode: 0o600 })
  server = spawn(process.execPath, [join(repo, 'node_modules/next/dist/bin/next'), 'dev', '--hostname', 'localhost', '--port', String(port)], {
    cwd: app, env: { ...closureServerEnv(status), NEXT_PUBLIC_APP_URL: base }, stdio: ['ignore', 'pipe', 'pipe'],
  })
  server.stdout.pipe(log); server.stderr.pipe(log)
  let ready = false
  for (let attempt = 0; attempt < 120; attempt += 1) {
    assert.equal(server.exitCode, null, 'C1 Next server stopped early')
    try { if ((await fetch(base)).ok) { ready = true; break } } catch {}
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  assert.ok(ready, 'C1 local Next readiness timed out')
  browser = await chromium.launch({ headless: true })
  for (const viewport of AUTH_VIEWPORTS) {
    phase = viewport.name
    const user = fixture.users.find(item => item.label === `auth-invited-${phase}`)
    const other = fixture.users.find(item => item.id !== user.id)
    assert.equal(user.email, `dtc-qa-auth-invited-${phase}@example.invalid`)
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height },
      reducedMotion: 'reduce', extraHTTPHeaders: { 'x-forwarded-for': `192.0.2.${viewport.ipOffset + 50}` } })
    await context.route('**/*', route => {
      const url = new URL(route.request().url())
      if (['localhost', '127.0.0.1'].includes(url.hostname)) return route.continue()
      blockedHosts.add(url.hostname); return route.abort()
    })
    const page = await context.newPage()
    page.setDefaultTimeout(30000); page.setDefaultNavigationTimeout(60000)
    page.on('pageerror', error => javascriptErrors.push({ phase, name: error.name }))
    await page.goto(`${base}/auth/email-login?next=${encodeURIComponent('/despega/conozcamonos-1')}`)
    await page.getByLabel('Correo electrónico', { exact: true }).fill(user.email)
    await page.getByLabel('Contraseña', { exact: true }).fill(fixture.password)
    await page.locator('form button[type="submit"]').click()
    await page.waitForURL(url => url.pathname === '/despega/conozcamonos-1')
    await question(page, '¿Cuál es tu situación laboral actual?')
    record('actual email login opens an empty C1 for its owner')
    const detail1 = `CASO SINTÉTICO ${phase}: combino trabajo estacional con un proyecto propio.`
    const detail5 = `CASO SINTÉTICO ${phase}: alterno entre dos hogares familiares.`
    await page.getByRole('button', { name: 'Otro', exact: true }).click()
    await page.getByLabel('Especifica tu respuesta', { exact: true }).fill(detail1)
    assert.equal(await page.getByLabel('Especifica tu respuesta', { exact: true }).getAttribute('maxlength'), '500')

    // Deliberate transport failure: do not change the handler or fake success.
    let failOnce = true
    const failDraft = async route => {
      if (route.request().method() === 'PUT' && failOnce) {
        failOnce = false
        return route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ error: 'Fallo sintético de guardado.' }) })
      }
      return route.fallback()
    }
    await context.route(`${base}${draftPath}`, failDraft)
    await savedAdvance(page, 'Siguiente', 503)
    await page.getByRole('alert').filter({ hasText: 'No pudimos guardar tu avance.' }).waitFor()
    assert.equal(await page.getByLabel('Especifica tu respuesta', { exact: true }).inputValue(), detail1)
    await question(page, '¿Cuál es tu situación laboral actual?')
    await visual(page, 'save-error')
    record('failed draft save retains the custom text and current question with retry')
    await context.unroute(`${base}${draftPath}`, failDraft)
    let releaseSave
    const pendingSave = new Promise(resolve => { releaseSave = resolve })
    const slowSave = async route => {
      if (route.request().method() === 'PUT') { await pendingSave; return route.continue() }
      return route.fallback()
    }
    await context.route(`${base}${draftPath}`, slowSave)
    const savedRetry = page.waitForResponse(value => new URL(value.url()).pathname === draftPath && value.request().method() === 'PUT')
    await page.getByRole('button', { name: 'Siguiente', exact: true }).click()
    await page.locator('fieldset[disabled]').waitFor()
    assert.equal(await page.getByLabel('Especifica tu respuesta', { exact: true }).isDisabled(), true)
    assert.equal(await page.getByRole('button', { name: 'Otro', exact: true }).isDisabled(), true)
    assert.equal(await page.getByRole('button', { name: 'Asistencia Tu Coach', exact: true }).isDisabled(), true)
    releaseSave()
    assert.equal((await savedRetry).status(), 200)
    await context.unroute(`${base}${draftPath}`, slowSave)
    record('pending save freezes choices, custom text and coach controls until the saved revision completes')
    await question(page, '¿Cuántos años de experiencia profesional tienes?')
    await page.reload()
    await question(page, '¿Cuántos años de experiencia profesional tienes?')
    await savedAdvance(page, 'Atrás')
    await question(page, '¿Cuál es tu situación laboral actual?')
    assert.equal(await page.getByLabel('Especifica tu respuesta', { exact: true }).inputValue(), detail1)
    assert.equal(await page.getByRole('button', { name: 'Otro', exact: true }).getAttribute('aria-pressed'), 'true')
    await visual(page, 'restored-other')
    record('retry, reload and back restore the exact Q1 custom response')
    await ownerBoundary(user, other)

    await page.getByRole('button', { name: 'Otro', exact: true }).click()
    await page.getByRole('button', { name: 'Independiente/Freelancer', exact: true }).click()
    await savedAdvance(page)
    const inactive = await request(page, 'GET')
    assert.equal(inactive.status, 200)
    assert.equal(inactive.body.draft.answers._customResponses, undefined)
    await page.reload(); await question(page, '¿Cuántos años de experiencia profesional tienes?')
    await savedAdvance(page, 'Atrás'); await question(page, '¿Cuál es tu situación laboral actual?')
    assert.equal(await page.getByLabel('Especifica tu respuesta', { exact: true }).count(), 0)
    await page.getByRole('button', { name: 'Otro', exact: true }).click()
    assert.equal(await page.getByLabel('Especifica tu respuesta', { exact: true }).inputValue(), '')
    await page.getByLabel('Especifica tu respuesta', { exact: true }).fill(detail1)
    await savedAdvance(page); await question(page, '¿Cuántos años de experiencia profesional tienes?')
    record('deselection removes inactive custom text from the persisted draft')

    const draft = (await request(page, 'GET')).body.draft
    const answers = { ...draft.answers, 2: ['5-10 años'], 3: 'CASO SINTÉTICO: deseo organizar mis proyectos de trabajo.',
      4: 'CASO SINTÉTICO: quiero practicar la comunicación durante noventa días.' }
    const invalid = await request(page, 'PUT', { ...draft, answers: { ...answers, _customResponses: { 1: detail1, 2: 'No corresponde' } } })
    assert.equal(invalid.status, 422)
    assert.deepEqual((await request(page, 'GET')).body.draft.answers, draft.answers)
    record('actual API rejects invalid custom fields without replacing the valid draft')
    // Explicit setup for Q2/Q3/Q4 avoids claiming external AI validation coverage.
    assert.equal((await request(page, 'PUT', { schemaVersion: 1, currentQuestion: 4, answers, timings: [] })).status, 200)
    await page.reload(); await question(page, '¿Con quién vives actualmente?')
    await page.getByRole('button', { name: 'Otro', exact: true }).click()
    await page.getByLabel('Especifica tu respuesta', { exact: true }).fill(detail5)
    await savedAdvance(page); await question(page, '¿Cuánto tiempo disponible tienes por semana para tu transformación personal?')
    await page.reload(); await question(page, '¿Cuánto tiempo disponible tienes por semana para tu transformación personal?')
    await savedAdvance(page, 'Atrás'); await question(page, '¿Con quién vives actualmente?')
    assert.equal(await page.getByLabel('Especifica tu respuesta', { exact: true }).inputValue(), detail5)
    await visual(page, 'restored-household')
    record('Q5 custom text independently survives next, reload and back')
    await savedAdvance(page); await question(page, '¿Cuánto tiempo disponible tienes por semana para tu transformación personal?')
    await page.getByRole('button', { name: '3-5 horas', exact: true }).click()
    await savedAdvance(page); await question(page, '¿Qué forma de aprender funciona mejor para ti?')
    await page.getByRole('button', { name: 'Práctica directa/ejercicios', exact: true }).click()
    await savedAdvance(page, 'Continuar')
    await page.waitForURL(url => url.pathname === '/despega/a1-cerebral-intro')
    const saved = await db.query('select responses from public.canon_conozcamonos_1_responses where user_id=$1', [user.id])
    assert.equal(saved.rowCount, 1)
    assert.deepEqual(saved.rows[0].responses['1'], ['Independiente/Freelancer', `Otro: ${detail1}`])
    assert.deepEqual(saved.rows[0].responses['5'], [`Otro: ${detail5}`])
    assert.equal(saved.rows[0].responses._customResponses, undefined)
    const completion = await db.query(`select d.completed_at is not null as draft_completed,
      p.onboarding_conozcamonos_1_completed as profile_completed from public.assessment_drafts d
      join public.despega_user_profiles p on p.user_id=d.user_id where d.user_id=$1 and d.assessment_type='c1'`, [user.id])
    assert.deepEqual(completion.rows, [{ draft_completed: true, profile_completed: true }])
    assert.equal((await request(page, 'GET')).body.draft, null)
    record('final canonical response contains both details, closes its draft and advances to A1')
    await context.close()
  }
  assert.equal(javascriptErrors.length, 0, 'Unexpected JavaScript errors in C1')
  assert.equal(blockedHosts.size, 0, 'C1 attempted an external network call')
} catch (error) {
  failure = safeFailure(error, secrets)
  console.error('C1 acceptance failed:', failure)
  process.exitCode = 1
} finally {
  await browser?.close().catch(() => {})
  await db.end().catch(() => {})
  if (server && server.exitCode === null) {
    const ended = once(server, 'exit')
    server.kill('SIGTERM')
    const timer = setTimeout(() => server?.kill('SIGKILL'), 5000)
    await ended; clearTimeout(timer)
  }
  log?.end()
  writeFileSync(join(evidence, 'c1-results.json'), JSON.stringify({
    commit: process.env.A1_SOURCE_COMMIT, scope: manifest.environment, verdict: failure ? 'FAIL' : 'PASS',
    steps, accessibility, layouts, javascriptErrors, blockedHosts: [...blockedHosts],
    syntheticFaults: ['one draft PUT 503 per viewport'], failure, notVerified: manifest.notVerified,
  }, null, 2))
}
