import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { createRequire } from 'node:module'
import { createWriteStream, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { CLOSURE_BASE as base, CLOSURE_PORT, closureLab, closureServerEnv,
  readClosureFixtures, safeFailure } from './closure-lab.mjs'
import { verifySavedObjective } from './closure-objective.mjs'

const { root, app, repo, status, evidence } = closureLab()
const fixture = readClosureFixtures(root)
const manifest = JSON.parse(readFileSync(join(root, 'closure-prepared.json'), 'utf8'))
assert.ok(manifest.copied.some(item => item.path === 'app/despega/layout.tsx'))
const requireTool = createRequire(join(process.env.A1_TOOLS_ROOT, 'package.json'))
const requireApp = createRequire(join(repo, 'package.json'))
const { chromium } = requireTool('playwright')
const { default: AxeBuilder } = requireTool('@axe-core/playwright')
const { createClient } = requireApp('@supabase/supabase-js')
const { Client } = requireApp('pg')
const db = new Client({ connectionString: status.DB_URL })
const alpha = fixture.users.find(user => user.label === 'closure-alpha')
const beta = fixture.users.find(user => user.label === 'closure-beta')
assert.ok(alpha && beta)
const steps = [], accessibility = [], javascriptErrors = [], phaseRequestCounts = [], blockedHosts = new Set()
const captures = new Map(), secrets = [fixture.password, status.ANON_KEY, status.SERVICE_ROLE_KEY, status.DB_URL]
let browser, server, serverLog, phase = 'setup', activeStep = 'setup', apiRequests = 0
let alphaContext, betaContext
const record = name => { steps.push({ name, status: 'PASS' }); console.log(`Closure acceptance: ${name}: PASS`) }
const pause = ms => new Promise(resolve => setTimeout(resolve, ms))

async function stopServer() {
  if (server && server.exitCode === null) {
    const ended = once(server, 'exit')
    server.kill('SIGTERM')
    const timeout = setTimeout(() => server?.kill('SIGKILL'), 5000)
    await ended
    clearTimeout(timeout)
  }
  serverLog?.end()
  if (server) phaseRequestCounts.push({ phase, browserApiRequests:apiRequests })
  server = null
}

async function startPhase(name) {
  // Sessions live in real Auth/cookies across fresh Next processes. Each bounded
  // phase stays below the unchanged in-memory API limiter; no limiter is mocked.
  for (const context of [alphaContext, betaContext]) {
    if (context) for (const page of context.pages()) await page.close()
  }
  await stopServer()
  phase = name
  apiRequests = 0
  serverLog = createWriteStream(join(root, `closure-${name}-server.private.log`), { mode: 0o600 })
  server = spawn(process.execPath, [join(repo, 'node_modules/next/dist/bin/next'),
    'dev', '--hostname', 'localhost', '--port', String(CLOSURE_PORT)], {
    cwd: app, env: closureServerEnv(status), stdio: ['ignore', 'pipe', 'pipe'],
  })
  server.stdout.pipe(serverLog); server.stderr.pipe(serverLog)
  for (let attempt = 0; attempt < 120; attempt += 1) {
    assert.equal(server.exitCode, null, 'Local Next server stopped before readiness')
    try { if ((await fetch(base)).ok) return } catch {}
    await pause(500)
  }
  throw new Error('Local Next server was not ready within 60 seconds')
}

async function context() {
  const value = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' })
  // Only deny remote network; never intercept/fulfil Auth, PostgREST, APIs or pages.
  await value.route('**/*', route => {
    const url = new URL(route.request().url())
    if (['localhost', '127.0.0.1'].includes(url.hostname)) return route.continue()
    blockedHosts.add(url.hostname)
    return route.abort()
  })
  value.on('page', page => {
    page.setDefaultTimeout(30000)
    page.setDefaultNavigationTimeout(60000)
    page.on('pageerror', error => javascriptErrors.push({ phase, name: error.name }))
    page.on('request', request => {
      if (new URL(request.url()).origin === base && new URL(request.url()).pathname.startsWith('/api/')) apiRequests += 1
    })
  })
  return value
}

async function login(page, user, next = '/despega/a1-outcome-baseline') {
  await page.goto(`${base}/auth/signin?next=${encodeURIComponent(next)}`)
  await page.getByLabel('Correo de prueba', { exact: true }).fill(user.email)
  await page.getByLabel('Contraseña de prueba', { exact: true }).fill(fixture.password)
  await page.getByRole('button', { name: 'Entrar al laboratorio', exact: true }).click()
  await page.waitForURL(url => url.pathname === next)
  assert.ok((await page.context().cookies()).some(cookie => /^sb-.*-auth-token/.test(cookie.name)), 'Real SSR session cookie missing')
}

async function api(page, method, body, path = '/api/outcomes/observations') {
  return page.evaluate(async ({ method, body, path }) => {
    const response = await fetch(path, { method, cache: 'no-store',
      ...(body === undefined ? {} : { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }) })
    return { status: response.status, cache: response.headers.get('cache-control'), body: await response.json() }
  }, { method, body, path })
}

function assertPrivate(response) {
  assert.ok(response.cache?.includes('private') && response.cache?.includes('no-store'), 'Outcome response must be private and uncacheable')
}

function assertUnscored(body) {
  assert.equal(body.instrumentVersion, fixture.instrumentVersion)
  assert.equal(body.measurementStatus, 'recorded_pending_evaluation')
  assert.equal(body.comparable, false)
  for (const key of ['normalizedBaseline', 'normalizedLatest', 'normalizedDelta', 'confidence']) assert.equal(body[key], null)
  assert.ok(!Object.hasOwn(body, 'score'), 'Capture must not report a capability score')
}

function instrument(stage) {
  const value = fixture.instruments.find(item => item.stage === stage)
  assert.ok(value)
  return value
}

function responsesFor(value, role, owner = 'ALPHA') {
  return Object.fromEntries(value.prompts.map(({ key }, index) => [key,
    `CASO SINTÉTICO ${owner} ${value.stage.toUpperCase()} ${role} ${index + 1}: describo una acción concreta, reviso el resultado observado y explico qué todavía necesito comprobar.`]))
}

function historyResponse(page, key) {
  return page.waitForResponse(response => {
    const url = new URL(response.url())
    return url.origin === base && url.pathname === '/api/outcomes/observations'
      && url.searchParams.get('instrument') === key && response.request().method() === 'GET'
  })
}

async function assertStoredOnce(capture, user = alpha) {
  const result = await db.query(`select id,response_payload,score,score_scale_min,score_scale_max,dimensions,confidence
    from public.dtc_outcome_observations where user_id=$1 and instrument_key=$2 and measurement_role=$3`,
  [user.id, capture.instrumentKey, capture.measurementRole])
  assert.equal(result.rowCount, 1, 'Save/reload/continue or retry must not create a second observation')
  const row = result.rows[0]
  assert.equal(row.id, capture.observationId)
  assert.deepEqual(row.response_payload, capture.responsePayload)
  for (const key of ['score','score_scale_min','score_scale_max','confidence']) assert.equal(row[key], null)
  assert.deepEqual(row.dimensions, {})
}

async function visual(page, name) {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 })
    await page.evaluate(() => document.fonts.ready)
    const bounds = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth }))
    assert.ok(bounds.scroll <= bounds.width + 1, `Horizontal overflow on ${name} at ${width}`)
    const scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
    const violations = scan.violations.map(item => ({ id:item.id, impact:item.impact,
      targets:item.nodes.map(node => node.target) }))
    accessibility.push({ page:name, width, violations })
    await page.screenshot({ path:join(evidence, `closure-${name}-${width}.png`), fullPage:true })
    assert.equal(violations.filter(item => ['serious','critical'].includes(item.impact)).length, 0,
      `Serious/critical WCAG violation on ${name} at ${width}; see closure-results.json`)
  }
  record(`${name}_real_appshell_390_1440_axe_overflow`)
}

const destinations = {
  'a1-baseline': { label:'Continuar al análisis de A1', path:'/despega/a1-cerebral-intro', heading:'Despega Cerebral: revisa tus preferencias' },
  'a1-follow_up': { label:'Continuar a Tu Ruta', path:'/despega/a2/intro', heading:'Convierte tu objetivo en acción' },
  'a2-baseline': { label:'Volver a Tu Ruta', path:'/despega/a2', heading:'Tu ciclo de avance' },
  'a2-follow_up': { label:'Volver a Tu Ruta', path:'/despega/a2', heading:'Tu ciclo de avance' },
  'a3-baseline': { label:'Volver a Entrenamiento', path:'/despega/a3', heading:'Ruta básica de preparación para entrevistas' },
  'a3-follow_up': { label:'Volver a Entrenamiento', path:'/despega/a3', heading:'Ruta básica de preparación para entrevistas' },
}

async function capturePage(page, stage, role) {
  const value = instrument(stage), name = `${stage}-${role}`, destination = destinations[name]
  const path = `/despega/${stage}-outcome-${role.replace('_', '-')}`
  activeStep = `${name}_capture_reload_continue`
  const read = historyResponse(page, value.key)
  await page.goto(base + path)
  assert.equal((await read).status(), 200, 'Real history endpoint must be available')
  await page.getByRole('heading', { name:value.label, exact:true }).waitFor()
  await page.getByRole('navigation', { name:'Navegación principal', exact:true }).waitFor()
  assert.equal(await page.locator('[data-lab-chrome]').count(), 0, 'Previous minimal shell must be replaced')
  const form = page.getByRole('region', { name:value.label, exact:true })
  assert.ok((await form.innerText()).includes('no asigna una nota de capacidad'))
  const responsePayload = responsesFor(value, role)
  for (const { key, label } of value.prompts) await form.getByLabel(label, { exact:true }).fill(responsePayload[key])
  await visual(page, `${name}-form`)

  let postCount = 0
  const countPosts = request => {
    if (new URL(request.url()).pathname === '/api/outcomes/observations' && request.method() === 'POST') postCount += 1
  }
  page.on('request', countPosts)
  try {
    const saveResponse = page.waitForResponse(response => new URL(response.url()).pathname === '/api/outcomes/observations'
      && response.request().method() === 'POST')
    await form.getByRole('button', { name: role === 'baseline' ? 'Guardar mi punto de partida' : 'Guardar mi seguimiento', exact:true }).click()
    const saved = await saveResponse
    assert.equal(saved.status(), 201, 'Initial save must use the actual insert route')
    const capture = saved.request().postDataJSON(), savedBody = await saved.json()
    assertUnscored(savedBody)
    assert.equal(savedBody.observationId, capture.observationId)
    assert.equal(capture.instrumentKey, value.key)
    assert.equal(capture.measurementRole, role)
    assert.deepEqual(capture.responsePayload, responsePayload)
    await page.getByRole('heading', { name:'Tus respuestas quedaron guardadas', exact:true }).waitFor()
    assert.equal(new URL(page.url()).pathname, path, 'Save must wait for explicit continuation')
    await assertStoredOnce(capture)

    const reloaded = historyResponse(page, value.key)
    await page.reload()
    const actualRead = await reloaded
    assert.equal(actualRead.status(), 200)
    const history = await actualRead.json()
    assert.equal(history.evaluationStatus, 'not_evaluated')
    assert.equal(history.comparable, false)
    const restored = role === 'baseline' ? history.baseline : history.followUp
    assert.equal(restored.observationId, capture.observationId)
    assert.deepEqual(restored.responsePayload, responsePayload)
    assert.equal(history.pairStatus, role === 'baseline' ? 'baseline_only' : 'available')
    const continuation = page.getByRole('button', { name:destination.label, exact:true })
    await continuation.waitFor()
    assert.equal(await continuation.isEnabled(), true, 'Confirmed read must allow continuation after refresh')
    assert.equal(await form.locator('textarea').count(), 0, 'A confirmed record resumes without requiring fresh answers')
    const summary = role === 'baseline' ? 'Leer mis respuestas: punto de partida' : 'Leer mis respuestas: seguimiento'
    await form.getByText(summary, { exact:true }).click()
    for (const answer of Object.values(responsePayload)) {
      assert.equal(await form.getByText(answer, { exact:true }).isVisible(), true, 'Persisted answer must be readable after refresh')
    }
    await visual(page, `${name}-restored`)
    await continuation.click()
    await page.waitForURL(url => url.pathname === destination.path)
    await page.getByRole('heading', { name:destination.heading, exact:true }).waitFor()
    assert.equal(postCount, 1, 'Reload and continuation must not POST an additional capture')
    await assertStoredOnce(capture)
    captures.set(name, capture)
    record(`${name}_save_reload_real_destination_without_duplicate`)
    return capture
  } finally { page.off('request', countPosts) }
}

async function journeyLink(page, expected, click = false) {
  await page.goto(base + '/despega/recorrido')
  await page.getByRole('heading', { name:'Tu siguiente paso tiene contexto', exact:true }).waitFor()
  const link = page.locator('[data-next-step]')
  assert.equal(await link.getAttribute('href'), expected, 'Canonical journey must recognize 2-capture evidence')
  record(`journey_recognizes_${expected.split('/').at(-1)}_from_current_capture`)
  if (click) { await link.click(); await page.waitForURL(url => url.pathname === expected) }
}

async function scopedClient(user) {
  const client = createClient(status.API_URL, status.ANON_KEY, { auth:{ persistSession:false, autoRefreshToken:false } })
  const signedIn = await client.auth.signInWithPassword({ email:user.email, password:fixture.password })
  assert.ok(!signedIn.error && signedIn.data.session, 'Real local password authentication failed')
  secrets.push(signedIn.data.session.access_token, signedIn.data.session.refresh_token)
  const verified = await client.auth.getUser()
  assert.equal(verified.data.user?.id, user.id, 'Auth server must verify the owner JWT')
  return client
}

try {
  await db.connect()
  browser = await chromium.launch({ headless:true })
  await startPhase('a1')
  alphaContext = await context()
  let page = await alphaContext.newPage()
  activeStep = 'anonymous_boundary'
  await page.goto(base + '/despega/a1-outcome-baseline')
  await page.waitForURL(url => url.pathname === '/auth/signin')
  const noSessionGet = await api(page, 'GET', undefined, '/api/outcomes/observations?instrument=a1_professional_clarity')
  const noSessionPost = await api(page, 'POST', {})
  assert.equal(noSessionGet.status, 401); assert.equal(noSessionPost.status, 401)
  assertPrivate(noSessionGet); assertPrivate(noSessionPost)
  record('anonymous_page_redirect_and_api_401')
  await login(page, alpha)
  await capturePage(page, 'a1', 'baseline')
  await page.getByRole('button', { name:'Comenzar las 28 preguntas', exact:true }).waitFor()
  record('a1_intro_reads_current_capture_version')
  await journeyLink(page, '/despega/a1-outcome-follow-up', true)
  await capturePage(page, 'a1', 'follow_up')
  const transition = page.waitForResponse(response => new URL(response.url()).pathname === '/api/journey/transition'
    && response.request().method() === 'POST')
  await page.getByRole('button', { name:'Comenzar Tu Ruta de 30 días', exact:true }).click()
  assert.equal((await transition).status(), 200)
  await page.waitForURL(url => url.pathname === '/despega/a2')
  await page.getByRole('heading', { name:'Tu ciclo de avance', exact:true }).waitFor()
  const flags = await db.query('select a2_intro_seen from public.despega_user_profiles where user_id=$1', [alpha.id])
  assert.equal(flags.rows[0].a2_intro_seen, true)
  record('real_a2_intro_transition_persists_canonical_flag')

  await startPhase('a2')
  page = await alphaContext.newPage()
  await capturePage(page, 'a2', 'baseline')
  // Fixture milestone only: this suite does not claim to complete 30 missions.
  await db.query(`insert into public.a2_user_task_completions(user_id,day,mission_type,validation_status,completed_at)
    select $1,day,'closure_fixture','legacy',now() from generate_series(1,30) day`, [alpha.id])
  await db.query(`update public.despega_journey_state set current_a2_day=30,highest_a2_day_unlocked=30,
    a2_started_at=now(),a2_completed_at=now(),metadata='{"a2_horizon":30}' where user_id=$1`, [alpha.id])
  await journeyLink(page, '/despega/a2-outcome-follow-up', true)
  await capturePage(page, 'a2', 'follow_up')
  const a2Read = await api(page, 'GET', undefined, '/api/a2/progress')
  assert.equal(a2Read.status, 200)
  assert.equal(a2Read.body.completed_tasks, 30)
  record('real_a2_destination_reads_seeded_milestone')

  await startPhase('a3')
  page = await alphaContext.newPage()
  await capturePage(page, 'a3', 'baseline')
  // Explicit local route-closure fixture; it is not evidence of interview ability.
  const moduleIds = ['career-mirror','value-mining-lab','cv-builder-studio','job-decoder','answer-architecture',
    'coach-practice-room','communication-gym','first-recruiter-simulation','risk-difficult-questions-lab','basic-interview-mission']
  await db.query('update public.a3_user_progress set completed_module_ids=$2,updated_at=now() where user_id=$1', [alpha.id,moduleIds])
  await db.query(`update public.a3_route_progression set route_completed_at=now(),current_module_number=10,
    total_completed=10,updated_at=now() where user_id=$1`, [alpha.id])
  await journeyLink(page, '/despega/a3-outcome-follow-up', true)
  await capturePage(page, 'a3', 'follow_up')
  await journeyLink(page, '/despega/a4')
  await page.setViewportSize({ width:390, height:844 })
  await page.getByRole('button', { name:'Abrir navegación', exact:true }).click()
  await page.getByRole('dialog', { name:'Navegación móvil', exact:true }).waitFor()
  await page.screenshot({ path:join(evidence,'closure-appshell-navigation-390.png'), fullPage:true })
  await page.keyboard.press('Escape')
  assert.equal(await page.getByRole('dialog', { name:'Navegación móvil', exact:true }).count(), 0)
  record('real_mobile_appshell_navigation_opens_and_closes')

  await startPhase('owner-boundary')
  activeStep = 'real_auth_owner_boundary'
  page = await alphaContext.newPage()
  await page.goto(base + '/despega/a1-outcome-baseline')
  await page.getByRole('button', { name:'Continuar al análisis de A1', exact:true }).waitFor()
  betaContext = await context()
  const otherPage = await betaContext.newPage()
  await login(otherPage, beta)
  const alphaClient = await scopedClient(alpha), betaClient = await scopedClient(beta)
  const anon = createClient(status.API_URL, status.ANON_KEY, { auth:{ persistSession:false, autoRefreshToken:false } })
  const original = captures.get('a1-baseline')
  const ownerRead = await alphaClient.from('dtc_outcome_observations').select('id,user_id,response_payload').eq('id', original.observationId)
  assert.equal(ownerRead.error, null); assert.equal(ownerRead.data.length, 1)
  assert.equal(ownerRead.data[0].user_id, alpha.id)
  const crossRead = await betaClient.from('dtc_outcome_observations').select('id,response_payload').eq('user_id',alpha.id)
  assert.equal(crossRead.error, null); assert.deepEqual(crossRead.data, [])
  const anonymousRead = await anon.from('dtc_outcome_observations').select('id').limit(1)
  assert.equal(anonymousRead.error?.code, '42501')
  record('real_jwt_postgrest_owner_select_cross_owner_empty_anon_denied')

  const forbiddenInsert = await alphaClient.from('dtc_outcome_observations').insert({ id:randomUUID(), user_id:alpha.id,
    outcome_key:original.outcomeKey,stage:'a1',measurement_role:'baseline',instrument_key:original.instrumentKey,
    instrument_version:fixture.instrumentVersion,response_payload:original.responsePayload })
  const forbiddenUpdate = await alphaClient.from('dtc_outcome_observations').update({score:99}).eq('id',original.observationId)
  const forbiddenDelete = await alphaClient.from('dtc_outcome_observations').delete().eq('id',original.observationId)
  for (const result of [forbiddenInsert,forbiddenUpdate,forbiddenDelete]) assert.equal(result.error?.code, '42501')
  record('direct_authenticated_insert_update_delete_denied')

  activeStep = 'actual_api_uuid_retry_and_owner_boundary'
  const retry = await api(page,'POST',original)
  assert.equal(retry.status,200); assert.equal(retry.body.reused,true)
  assert.equal(retry.body.observationId,original.observationId); assertUnscored(retry.body); assertPrivate(retry)
  const changed = { ...original,responsePayload:{ ...original.responsePayload,
    [Object.keys(original.responsePayload)[0]]:'Este texto sintético cambió y no debe sobrescribir el registro original existente.' } }
  assert.equal((await api(page,'POST',changed)).status,409)
  const collision = await api(otherPage,'POST',original)
  assert.equal(collision.status,409)
  assert.ok(!JSON.stringify(collision.body).includes(Object.values(original.responsePayload)[0]))
  await assertStoredOnce(original)
  record('same_owner_uuid_retry_idempotent_changed_or_cross_owner_uuid_conflict')

  const emptyOther = await api(otherPage,'GET',undefined,`/api/outcomes/observations?instrument=${original.instrumentKey}`)
  assert.equal(emptyOther.status,200); assert.equal(emptyOther.body.pairStatus,'empty')
  assertPrivate(emptyOther)
  assert.equal((await api(otherPage,'GET',undefined,`/api/outcomes/observations?instrument=${original.instrumentKey}&user_id=${alpha.id}`)).status,400)
  assert.equal((await api(otherPage,'POST',{...original,observationId:randomUUID(),user_id:alpha.id})).status,400)
  const crossOrigin = await page.request.post(base+'/api/outcomes/observations', {
    headers:{Origin:'https://example.invalid'},data:{...original,observationId:randomUUID()},
  })
  assert.equal(crossOrigin.status(),403)
  record('actual_history_and_api_reject_owner_override_and_cross_origin')

  const betaCapture = {...original,observationId:randomUUID(),responsePayload:responsesFor(instrument('a1'),'baseline','BETA')}
  const betaSaved = await api(otherPage,'POST',betaCapture)
  assert.equal(betaSaved.status,201); assertUnscored(betaSaved.body)
  const betaRead = historyResponse(otherPage,original.instrumentKey)
  await otherPage.reload()
  const betaHistory = await (await betaRead).json()
  assert.equal(betaHistory.baseline.observationId,betaCapture.observationId)
  assert.equal(betaHistory.followUp,null)
  assert.deepEqual(betaHistory.baseline.responsePayload,betaCapture.responsePayload)
  await otherPage.getByRole('button',{name:'Continuar al análisis de A1',exact:true}).waitFor()
  await assertStoredOnce(betaCapture,beta)
  const reverseRead = await alphaClient.from('dtc_outcome_observations').select('id').eq('id',betaCapture.observationId)
  assert.equal(reverseRead.error,null); assert.deepEqual(reverseRead.data,[])
  record('second_owner_saves_and_recovers_only_own_answers')

  const count = await db.query(`select user_id,count(*)::int as records from public.dtc_outcome_observations
    where user_id=any($1::uuid[]) group by user_id`, [[alpha.id,beta.id]])
  assert.equal(count.rows.find(row=>row.user_id===alpha.id)?.records,6)
  assert.equal(count.rows.find(row=>row.user_id===beta.id)?.records,1)
  const scores = await db.query(`select count(*)::int as records from public.dtc_outcome_observations
    where user_id=any($1::uuid[]) and (score is not null or score_scale_min is not null
      or score_scale_max is not null or confidence is not null or dimensions <> '{}'::jsonb)`, [[alpha.id,beta.id]])
  assert.equal(scores.rows[0].records,0)
  assert.equal((await db.query('select count(*)::int as records from public.dtc_outcome_snapshots where user_id=any($1::uuid[])',[[alpha.id,beta.id]])).rows[0].records,0)
  record('six_pages_plus_second_owner_persist_seven_unscored_records_no_snapshots')

  await startPhase('saved-objective')
  activeStep = 'saved_objective_real_auth_rls_and_revision_conflict'
  page = await alphaContext.newPage()
  await page.goto(base + '/despega/a1-outcome-baseline')
  await page.getByRole('button',{name:'Continuar al análisis de A1',exact:true}).waitFor()
  const secondSession = await context(), secondPage = await secondSession.newPage()
  await login(secondPage,alpha)
  await verifySavedObjective({ page, secondPage, api, db, alpha, beta, alphaClient, betaClient, record })
  await secondSession.close()

  assert.deepEqual(javascriptErrors,[])
  assert.equal(blockedHosts.size,0,'Real tested pages must not require any remote browser resource')
  record('no_javascript_exceptions_or_external_browser_requests')
} catch (error) {
  process.exitCode = 1
  const message = safeFailure(error,secrets)
  steps.push({name:activeStep,status:'FAIL',message})
  console.error(`Closure acceptance failed at ${activeStep}: ${message}`)
} finally {
  if (browser) await browser.close()
  await stopServer()
  await db.end()
  writeFileSync(join(evidence,'closure-results.json'),JSON.stringify({
    commit:process.env.A1_SOURCE_COMMIT,scope:'real local Auth/JWT/RLS and unmodified application pages/layout/contexts/APIs',
    steps,accessibility,javascriptErrors,phaseRequestCounts,blockedExternalHosts:[...blockedHosts],
    viewportWidths:[390,1440],captureVersion:fixture.instrumentVersion,
    outcomeEvaluation:'not_evaluated; no generated scores, confidence or snapshots',
    fixtureMilestones:'A2 day 30 and A3 route closure were seeded, not completed by these tests',
    notVerified:manifest.notVerified,verdict:process.exitCode?'FAIL':'PASS',
  },null,2))
}
