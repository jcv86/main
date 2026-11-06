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
const completionPath = '/api/journey/complete-c1', completedPath = '/despega/a1-cerebral-intro'
const actorHeader = 'X-DTC-Actor-Id', expectedActorHeader = 'X-DTC-Expected-User-Id'
const completionError = 'No pudimos confirmar el guardado. Tus respuestas siguen aquí. Intenta de nuevo.'
const finalQuestion = '¿Qué forma de aprender funciona mejor para ti?'
const finalChoice = 'Práctica directa/ejercicios'
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
const atomicCompletion = [], controlledFailures = [], requestFailures = []
const verifiedActors = new WeakMap()
const secrets = [fixture.password, status.ANON_KEY, status.SERVICE_ROLE_KEY, status.DB_URL]
let browser, server, log, phase = 'setup', failure = null, activeCompletionFault = null
const record = name => { steps.push({ phase, name, status: 'PASS' }); console.log(`C1 acceptance: ${phase}: ${name}: PASS`) }

async function request(page, method, body, path = draftPath) {
  const expectedActor = verifiedActors.get(page)
  if (['PUT', 'POST'].includes(method)) assert.ok(expectedActor, 'Direct C1 setup writes require an actor from the actual status GET')
  return page.evaluate(async ({ method, body, path, expectedActor, actorHeader, expectedActorHeader }) => {
    const headers = { ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      ...(['PUT', 'POST'].includes(method) ? { [expectedActorHeader]: expectedActor } : {}) }
    const response = await fetch(path, { method, cache: 'no-store', credentials: 'include',
      headers, ...(body === undefined ? {} : { body: JSON.stringify(body) }) })
    return { status: response.status, actorId: response.headers.get(actorHeader), body: await response.json() }
  }, { method, body, path, expectedActor, actorHeader, expectedActorHeader })
}
async function completionSnapshot(userId) {
  const result = await db.query([
    'select',
    "(select coalesce(jsonb_agg(to_jsonb(r) order by r.id), '[]'::jsonb) from public.canon_conozcamonos_1_responses r where r.user_id=$1) as responses,",
    "(select coalesce(jsonb_agg(to_jsonb(p) order by p.user_id), '[]'::jsonb) from public.despega_user_profiles p where p.user_id=$1) as profiles,",
    "(select coalesce(jsonb_agg(to_jsonb(d) order by d.id), '[]'::jsonb) from public.assessment_drafts d where d.user_id=$1 and d.assessment_type='c1') as drafts,",
    "(select coalesce(jsonb_agg(to_jsonb(c) order by c.draft_id), '[]'::jsonb) from dtc_private.c1_completion_receipts c where c.user_id=$1) as receipts",
  ].join('\n'), [userId])
  return result.rows[0]
}
function assertSameSnapshot(actual, expected, message) {
  // Keep complete synthetic rows in memory only; failure evidence needs no answers.
  assert.ok(JSON.stringify(actual) === JSON.stringify(expected), message)
}
function c1CompletionSnapshot(snapshot) {
  // The actual A1 destination legitimately marks its introduction as viewed.
  // Preserve the complete canon/draft/receipt and only the C1 profile contract.
  return { ...snapshot, profiles: snapshot.profiles.map(profile => ({
    user_id: profile.user_id,
    onboarding_conozcamonos_1_completed: profile.onboarding_conozcamonos_1_completed,
    onboarding_conozcamonos_1_completed_at: profile.onboarding_conozcamonos_1_completed_at,
  })) }
}
function assertCompleted(snapshot, details) {
  assert.equal(snapshot.responses.length, 1, 'A completed C1 has exactly one canonical response')
  assert.equal(snapshot.profiles.length, 1, 'A completed C1 has its owner profile')
  assert.equal(snapshot.drafts.length, 1, 'The same C1 draft remains as the completed snapshot')
  assert.equal(snapshot.receipts.length, 1, 'A completed C1 has exactly one private receipt')
  const response = snapshot.responses[0], profile = snapshot.profiles[0]
  const draft = snapshot.drafts[0], receipt = snapshot.receipts[0]
  assert.deepEqual(response.responses['1'], ['Independiente/Freelancer', 'Otro: ' + details.first])
  assert.deepEqual(response.responses['5'], ['Otro: ' + details.household])
  assert.deepEqual(response.responses['7'], [finalChoice])
  assert.equal(response.responses._customResponses, undefined)
  assert.deepEqual(draft.answers._customResponses, { 1: details.first, 5: details.household })
  assert.deepEqual(draft.answers['7'], [finalChoice])
  assert.equal(profile.onboarding_conozcamonos_1_completed, true)
  assert.ok(profile.onboarding_conozcamonos_1_completed_at, 'Profile completion has a timestamp')
  assert.equal(receipt.origin, 'atomic')
  assert.equal(receipt.draft_id, draft.id)
  assert.equal(receipt.response_id, response.id)
  assert.ok(Number.isFinite(Date.parse(receipt.completed_at)), 'Receipt completion has a valid timestamp')
  assert.equal(Date.parse(response.completed_at), Date.parse(receipt.completed_at))
  assert.equal(Date.parse(draft.completed_at), Date.parse(receipt.completed_at))
  return { responseId: response.id, draftId: draft.id, completedAt: receipt.completed_at }
}
async function installCompletionFault(userId, target) {
  assert.equal(activeCompletionFault, null)
  assert.match(userId, /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
  assert.ok(fixture.users.some(user => user.id === userId), 'Faults may target only the admitted synthetic C1 owner')
  assert.ok(['profile', 'draft'].includes(target))
  const table = target === 'profile' ? 'public.despega_user_profiles' : 'public.assessment_drafts'
  assert.equal((await db.query("select to_regprocedure('dtc_private.c1_browser_fail_completion()')::text as name")).rows[0].name, null)
  await db.query([
    'create function dtc_private.c1_browser_fail_completion() returns trigger',
    "language plpgsql security invoker set search_path = '' as $$",
    'begin',
    '  if new.user_id::text = tg_argv[0] then',
    "    raise exception using errcode='P0001', message='c1_browser_synthetic_completion_failure';",
    '  end if;',
    '  return new;',
    'end; $$;',
  ].join('\n'))
  activeCompletionFault = { table, target }
  const trigger = await db.query(
    "select format('create trigger c1_browser_completion_fault before insert or update on %s for each row execute function dtc_private.c1_browser_fail_completion(%L)', $1::text, $2::text) as ddl",
    [table, userId])
  await db.query(trigger.rows[0].ddl)
}
async function removeCompletionFault() {
  if (!activeCompletionFault) return
  await db.query('drop trigger if exists c1_browser_completion_fault on ' + activeCompletionFault.table)
  await db.query('drop function dtc_private.c1_browser_fail_completion()')
  activeCompletionFault = null
}
async function completionRemainsEditable(page) {
  await page.getByRole('alert').filter({ hasText: completionError }).waitFor()
  await question(page, finalQuestion)
  assert.equal(new URL(page.url()).pathname, '/despega/conozcamonos-1')
  assert.equal(await page.getByRole('button', { name: finalChoice, exact: true }).getAttribute('aria-pressed'), 'true')
  assert.equal(await page.getByRole('button', { name: finalChoice, exact: true }).isEnabled(), true)
  assert.equal(await page.getByRole('button', { name: 'Continuar', exact: true }).isEnabled(), true)
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
    const browserWrites = []
    let lostCompletionRequest = null, recoveringCompletion = false, recoveryDestinationReached = false
    page.on('framenavigated', frame => {
      if (!recoveringCompletion || frame !== page.mainFrame()) return
      const destination = new URL(frame.url())
      if (destination.origin === base && destination.pathname === completedPath) recoveryDestinationReached = true
    })
    page.on('request', value => {
      const path = new URL(value.url()).pathname, method = value.method()
      if (!['GET', 'HEAD'].includes(method) && [draftPath, completionPath,
        '/rest/v1/canon_conozcamonos_1_responses', '/rest/v1/despega_user_profiles'].includes(path)) {
        let a1EntryMarker = false
        if (recoveryDestinationReached && new URL(page.url()).pathname === completedPath
          && path === '/rest/v1/despega_user_profiles' && method === 'POST') {
          let body
          try { body = value.postDataJSON() } catch { body = null }
          a1EntryMarker = Boolean(body && !Array.isArray(body) && body.user_id === user.id
            && body.a1_cerebral_intro_seen === true && Number.isFinite(Date.parse(body.a1_cerebral_intro_seen_at))
            && Object.keys(body).length === 3
            && Object.keys(body).every(key => ['user_id', 'a1_cerebral_intro_seen', 'a1_cerebral_intro_seen_at'].includes(key)))
        }
        browserWrites.push({ path, method, actorMatches: value.headers()[expectedActorHeader.toLowerCase()] === user.id,
          afterRecoveryDestination: recoveryDestinationReached, a1EntryMarker })
      }
    })
    page.on('requestfailed', value => requestFailures.push({ phase: viewport.name,
      path: new URL(value.url()).pathname, method: value.method(),
      error: value.failure()?.errorText || 'request_failed', controlledFault: value === lostCompletionRequest }))
    await page.goto(`${base}/auth/email-login?next=${encodeURIComponent('/despega/conozcamonos-1')}`)
    await page.getByLabel('Correo electrónico', { exact: true }).fill(user.email)
    await page.getByLabel('Contraseña', { exact: true }).fill(fixture.password)
    await page.locator('form button[type="submit"]').click()
    await page.waitForURL(url => url.pathname === '/despega/conozcamonos-1')
    await question(page, '¿Cuál es tu situación laboral actual?')
    const initialStatus = await request(page, 'GET', undefined, completionPath)
    assert.equal(initialStatus.status, 200)
    assert.equal(initialStatus.body.state, 'not_started')
    assert.equal(initialStatus.actorId, user.id)
    verifiedActors.set(page, initialStatus.actorId)
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
        controlledFailures.push({ phase, path: draftPath, method: 'PUT', kind: 'declared_http_503' })
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
    await savedAdvance(page); await question(page, finalQuestion)
    await page.getByRole('button', { name: finalChoice, exact: true }).click()
    const details = { first: detail1, household: detail5 }
    const beforeCompletion = await completionSnapshot(user.id)
    assert.equal(beforeCompletion.responses.length, 0)
    assert.equal(beforeCompletion.receipts.length, 0)
    assert.equal(beforeCompletion.drafts.length, 1)
    assert.equal(beforeCompletion.drafts[0].current_question, 6)
    assert.equal(beforeCompletion.drafts[0].completed_at, null)
    assert.ok(beforeCompletion.profiles.every(profile => !profile.onboarding_conozcamonos_1_completed))
    const finalWritesStart = browserWrites.length
    const assertFinalWrites = (count, allowA1Entry = false) => {
      const finalWrites = browserWrites.slice(finalWritesStart)
      const completionWrites = finalWrites.filter(item => !(allowA1Entry && item.afterRecoveryDestination && item.a1EntryMarker))
      assert.equal(completionWrites.length, count, 'Only the expected atomic completion POSTs may write at the last question')
      assert.ok(completionWrites.every(item => item.path === completionPath && item.method === 'POST' && item.actorMatches),
        'Final submission must bind its observed actor and must not PUT/close its draft or write canonical/profile rows from the browser')
      return finalWrites.filter(item => item.a1EntryMarker).length
    }

    // Real transaction failure after the canonical INSERT (desktop) or after
    // both canonical and profile writes (mobile), confined to this local owner.
    const faultTarget = phase === 'desktop' ? 'profile' : 'draft'
    await installCompletionFault(user.id, faultTarget)
    try {
      const failedCompletion = page.waitForResponse(value => new URL(value.url()).pathname === completionPath && value.request().method() === 'POST')
      await page.getByRole('button', { name: 'Continuar', exact: true }).click()
      const response = await failedCompletion
      assert.equal(response.status(), 503, 'A database completion failure must reach the actual UI as 503')
      assert.match(response.headers()['cache-control'] || '', /no-store/)
      controlledFailures.push({ phase, path: completionPath, method: 'POST', kind: 'local_database_trigger', target: faultTarget, status: 503 })
      await completionRemainsEditable(page)
      assertFinalWrites(1)
      const statusAfterFailure = await request(page, 'GET', undefined, completionPath)
      assert.equal(statusAfterFailure.status, 200)
      assert.equal(statusAfterFailure.body.state, 'in_progress')
      assert.equal(statusAfterFailure.body.draft.completedAt, null)
      assert.deepEqual(statusAfterFailure.body.draft.answers, beforeCompletion.drafts[0].answers)
      assertSameSnapshot(await completionSnapshot(user.id), beforeCompletion,
        'Failed completion must roll back canonical response, profile, draft and private receipt together')
      await visual(page, 'completion-rollback')
      record('real database failure rolls back all completion records and retains the editable last answer')
    } finally { await removeCompletionFault() }

    // Execute the retry exactly once against the real API. Verify its committed
    // rows before dropping only delivery of that real 200 to the browser.
    let deliveryPosts = 0, deliveryError = null, finishDeliveryObservation
    const deliveryObservation = new Promise(resolve => { finishDeliveryObservation = resolve })
    const loseConfirmedResponse = async route => {
      if (route.request().method() !== 'POST') return route.fallback()
      try {
        deliveryPosts += 1
        assert.equal(deliveryPosts, 1, 'Never repeat an intercepted completion operation')
        const response = await route.fetch({ timeout: 30000, maxRetries: 0, maxRedirects: 0 })
        assert.equal(response.status(), 200, 'Response loss is injected only after a real successful completion')
        assert.match(response.headers()['cache-control'] || '', /no-store/)
        const body = await response.json()
        assert.equal(body.success, true)
        assert.equal(body.state, 'completed')
        assert.equal(body.origin, 'atomic')
        assert.equal(body.replayed, false)
        assert.equal(body.nextPath, completedPath)
        const snapshot = await completionSnapshot(user.id)
        const identity = assertCompleted(snapshot, details)
        assert.equal(body.responseId, identity.responseId)
        assert.equal(body.draftId, identity.draftId)
        assert.equal(Date.parse(body.completedAt), Date.parse(identity.completedAt))
        lostCompletionRequest = route.request()
        controlledFailures.push({ phase, path: completionPath, method: 'POST', kind: 'response_delivery_lost_after_database_commit', status: 200 })
        await route.abort('connectionreset')
        finishDeliveryObservation({ ok: true, snapshot, identity })
      } catch (error) {
        deliveryError = error
        await route.abort('failed').catch(() => {})
        finishDeliveryObservation({ ok: false, error })
      }
    }
    await context.route(base + completionPath, loseConfirmedResponse)
    try {
      const retryRequest = page.waitForRequest(value => new URL(value.url()).pathname === completionPath && value.method() === 'POST')
      await page.getByRole('button', { name: 'Continuar', exact: true }).click()
      await retryRequest
      const observed = await deliveryObservation
      if (!observed.ok) throw observed.error
      await completionRemainsEditable(page)
      assertFinalWrites(2)
      await visual(page, 'completion-response-lost')
      record('a lost response after a verified database commit shows recovery without false success or an automatic replay')

      // The real page consumes GET status on reload. Snapshot metadata early;
      // it can navigate immediately after reading its own completion JSON.
      recoveringCompletion = true
      const recoveryResponse = page.waitForResponse(value => new URL(value.url()).pathname === completionPath && value.request().method() === 'GET')
        .then(response => ({ status: response.status(), cache: response.headers()['cache-control'] || '' }))
      await page.reload()
      const recovered = await recoveryResponse
      assert.equal(recovered.status, 200)
      assert.match(recovered.cache, /no-store/)
      await page.waitForURL(url => url.pathname === completedPath)
      assert.equal(recoveryDestinationReached, true, 'Observe the actual local A1 destination before classifying its entry marker')
      await page.waitForFunction(id => {
        const observer = document.querySelector('[data-auth-lab-session]')
        return observer?.getAttribute('data-state') === 'authenticated' && observer.getAttribute('data-user-id') === id
      }, user.id)
      // This caption is set only after the real A1 entry marker and outcome GET
      // finish, so teardown cannot race that destination's own initialization.
      await page.getByRole('button', { name: 'Registrar mi punto de partida', exact: true }).waitFor()
      const verifiedStatus = await request(page, 'GET', undefined, completionPath)
      assert.equal(verifiedStatus.status, 200)
      assert.equal(verifiedStatus.body.state, 'completed')
      assert.equal(verifiedStatus.body.responseId, observed.identity.responseId)
      assert.equal(verifiedStatus.body.draftId, observed.identity.draftId)
      assert.equal(verifiedStatus.body.nextPath, completedPath)
      const afterRecovery = await completionSnapshot(user.id)
      assertCompleted(afterRecovery, details)
      assertSameSnapshot(c1CompletionSnapshot(afterRecovery), c1CompletionSnapshot(observed.snapshot),
        'Reload must preserve all C1 completion records while A1 records its separate introduction marker')
      assert.equal((await request(page, 'GET')).body.draft, null)
      assert.equal(deliveryError, null, 'The delivery fault must not conceal a later interception failure')
      assert.equal(deliveryPosts, 1)
      const a1EntryWrites = assertFinalWrites(2, true)
      assert.ok(a1EntryWrites >= 1, 'The actual A1 page records its introduction only after reaching that destination')
      atomicCompletion.push({ phase, databaseFailureTarget: faultTarget, rollbackVerified: true,
        realCommitVerifiedBeforeResponseLoss: true, completionPosts: 2, successfulCompletionPosts: 1,
        finalDraftPuts: 0, reloadRecoveredThroughGet: true, canonicalResponses: 1, privateReceipts: 1,
        recoveryDestinationBoundaryObserved: true, a1EntryWrites })
      record('reload uses verified completion status to recover the same result without duplicate responses')
      record('final canonical response contains both details, closes its draft and advances to A1')
    } finally { await context.unroute(base + completionPath, loseConfirmedResponse) }
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
  try { await removeCompletionFault() } catch (error) {
    failure ||= safeFailure(error, secrets)
    process.exitCode = 1
  }
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
    atomicCompletion, controlledFailures, requestFailures,
    syntheticFaults: ['one draft PUT 503 per viewport', 'local owner-scoped profile failure on desktop and draft failure on mobile',
      'one real completion 200 per viewport is delivered to the test transport, verified against committed SQL rows, then aborted before browser delivery'],
    failure, notVerified: manifest.notVerified,
  }, null, 2))
}
