/** Actual UI + local Auth/API/PostgreSQL. Run with node --import tsx after the plan seed/SQL phase. */
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { createRequire } from 'node:module'
import { createWriteStream, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { closureLab, closureServerEnv, safeFailure } from './closure-lab.mjs'
import { AUTH_VIEWPORTS, assertAuthSources } from './auth-lab.mjs'
import { a2PlanViewSchema, a2PlanMutationResponseSchema, a2PlanToday } from '../../lib/a2/plan-contract.ts'

const { root, app, repo, status, evidence } = closureLab()
const port = 3119, base = `http://localhost:${port}`, path = '/api/a2/plan', coach = '/despega/a2/coach'
const actorHeader = 'x-dtc-plan-actor', expectedActorHeader = 'X-DTC-Expected-Plan-Actor'
const fixture = JSON.parse(readFileSync(join(root, 'a2-plan-fixtures.private.json'), 'utf8'))
const manifest = JSON.parse(readFileSync(join(root, 'a2-plan-prepared.json'), 'utf8'))
assert.equal(fixture.scope, 'disposable-local-a2-plan')
assert.equal(manifest.environment, fixture.scope)
assert.equal(fixture.users.length, 3)
assert.equal(new Set(fixture.users.map(user => user.id)).size, 3)
assert.ok(typeof fixture.password === 'string' && fixture.password.length >= 32)
for (const label of ['a2-plan-desktop', 'a2-plan-mobile', 'a2-plan-locked']) {
  const user = fixture.users.find(item => item.label === label)
  assert.ok(user && user.email === `dtc-qa-${label}@example.invalid`)
}
assertAuthSources(JSON.parse(readFileSync(join(root, 'auth-prepared.json'), 'utf8')), app, repo)
for (const item of manifest.copied) {
  const source = readFileSync(join(repo, item.path)), copied = readFileSync(join(app, item.path))
  assert.deepEqual(source, copied, `Real source changed in the plan lab: ${item.path}`)
  assert.equal(createHash('sha256').update(copied).digest('hex'), item.sha256)
}
const requireTools = createRequire(join(process.env.A1_TOOLS_ROOT, 'package.json'))
const requireApp = createRequire(join(repo, 'package.json'))
const { chromium } = requireTools('playwright')
const { default: AxeBuilder } = requireTools('@axe-core/playwright')
const { Client } = requireApp('pg')
const db = new Client({ connectionString: status.DB_URL })
const secrets = [fixture.password, status.ANON_KEY, status.SERVICE_ROLE_KEY, status.DB_URL]
const steps = [], accessibility = [], layouts = [], javascriptErrors = [], requestFailures = [], controlledFaults = []
const blockedHosts = new Set(), actors = new WeakMap(), contexts = new Set()
const invariantTables = ['despega_user_profiles', 'despega_journey_state', 'a2_user_task_completions',
  'a3_user_progress', 'a3_route_progression', 'user_gamification_profile', 'user_dtc_balance']
let browser, server, log, phase = 'setup', failure = null, planReadRevoked = false, objectiveReadRevoked = false
const record = name => { steps.push({ phase, name, status: 'PASS' }); console.log(`A2 plan acceptance: ${phase}: ${name}: PASS`) }
const card = page => page.locator('[data-a2-reviewed-plan]')
const deferred = () => { let resolve; const promise = new Promise(done => { resolve = done }); return { promise, resolve } }
async function bounded(promise, message) {
  let timer
  try { return await Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(message)), 30_000) })]) }
  finally { clearTimeout(timer) }
}
function reviewDate() {
  const date = new Date(`${a2PlanToday()}T12:00:00Z`)
  date.setUTCDate(date.getUTCDate() + 7)
  return date.toISOString().slice(0, 10)
}
async function progress(userId) {
  const result = {}
  for (const table of invariantTables) {
    const rows = await db.query(`select coalesce(jsonb_agg(to_jsonb(t) order by to_jsonb(t)::text),'[]'::jsonb) as value from public.${table} t where user_id=$1`, [userId])
    result[table] = rows.rows[0].value
  }
  return result
}
async function persistence(userId) {
  const result = await db.query(`select
    (select coalesce(jsonb_agg(to_jsonb(t)),'[]'::jsonb) from public.a2_reviewed_plans t where user_id=$1) as slots,
    (select coalesce(jsonb_agg(to_jsonb(t) order by revision),'[]'::jsonb) from dtc_private.a2_plan_revisions t where user_id=$1) as revisions,
    (select coalesce(jsonb_agg(to_jsonb(t) order by result_revision),'[]'::jsonb) from dtc_private.a2_plan_receipts t where user_id=$1) as receipts`, [userId])
  return result.rows[0]
}
function same(actual, expected, message) { assert.ok(JSON.stringify(actual) === JSON.stringify(expected), message) }
async function assertSaved(userId, body) {
  const saved = await persistence(userId)
  assert.equal(saved.slots.length, 1)
  assert.equal(saved.slots[0].revision, body.revision)
  if (body.plan) {
    assert.equal(saved.slots[0].plan_id, body.plan.id)
    assert.equal(saved.slots[0].status, body.plan.state)
    assert.deepEqual(saved.slots[0].content, body.plan.content)
    assert.deepEqual(saved.slots[0].context_snapshot, body.plan.contextSnapshot)
  } else {
    assert.equal(saved.slots[0].status, 'deleted')
    assert.equal(saved.slots[0].content, null)
    assert.equal(saved.slots[0].context_snapshot, null)
    assert.equal(saved.revisions.length, 0, 'Deletion purges every content-bearing revision')
  }
  if (body.receipt) assert.ok(saved.receipts.some(item => item.request_id === body.receipt.requestId
    && item.result_revision === body.receipt.revision && item.result_status === body.receipt.state))
  return saved
}
function observe(page, method) {
  const waiting = page.waitForResponse(response => new URL(response.url()).pathname === path && response.request().method() === method)
    .then(async response => ({ status: response.status(), headers: response.headers(), body: await response.json(),
      command: method === 'POST' ? response.request().postDataJSON() : null,
      expectedActor: response.request().headers()[expectedActorHeader.toLowerCase()] }))
  waiting.catch(() => {})
  return waiting
}
async function idle(page) { await page.locator('[data-a2-reviewed-plan][aria-busy="false"]').waitFor() }
function checked(result, page, expectedStatus = 200) {
  assert.equal(result.status, expectedStatus, 'Actual plan API status matches its UI action')
  assert.match(result.headers['cache-control'] || '', /no-store/)
  assert.equal(result.expectedActor, actors.get(page), 'Every plan request binds the observed owner')
  assert.equal(result.headers[actorHeader], actors.get(page), 'Only the verified owner response may reach the card')
  if (result.status === 200) {
    if (result.command) a2PlanMutationResponseSchema.parse(result.body)
    else a2PlanViewSchema.parse(result.body)
  } else if (result.body.view) a2PlanViewSchema.parse(result.body.view)
  return result
}
async function clickPlan(page, label, expectedStatus = 200) {
  const response = observe(page, 'POST')
  await card(page).getByRole('button', { name: label, exact: true }).click()
  const result = checked(await response, page, expectedStatus)
  await idle(page)
  return result
}
async function readPlan(page, label = 'Volver a comprobar mi plan', expectedStatus = 200) {
  const response = observe(page, 'GET')
  await card(page).getByRole('button', { name: label, exact: true }).click()
  const result = checked(await response, page, expectedStatus)
  await idle(page)
  return result.body
}
async function newContext(viewport, ip) {
  const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height },
    reducedMotion: 'reduce', extraHTTPHeaders: { 'x-forwarded-for': `192.0.2.${ip}` } })
  contexts.add(context)
  await context.route('**/*', route => {
    const url = new URL(route.request().url())
    if (['localhost', '127.0.0.1'].includes(url.hostname)) return route.continue()
    blockedHosts.add(url.hostname); return route.abort()
  })
  return context
}
async function newPage(context) {
  const page = await context.newPage()
  page.setDefaultTimeout(30000); page.setDefaultNavigationTimeout(60000)
  page.on('pageerror', error => javascriptErrors.push({ phase, name: error.name }))
  page.on('requestfailed', request => requestFailures.push({ phase, path: new URL(request.url()).pathname,
    method: request.method(), error: request.failure()?.errorText || 'request_failed' }))
  return page
}
async function login(page, user, destination = coach) {
  actors.set(page, user.id)
  await page.goto(`${base}/auth/email-login?next=${encodeURIComponent(destination)}`)
  await page.getByLabel('Correo electrónico', { exact: true }).fill(user.email)
  await page.getByLabel('Contraseña', { exact: true }).fill(fixture.password)
  const signedIn = page.waitForResponse(response => new URL(response.url()).pathname === '/api/auth/email-login' && response.request().method() === 'POST')
    .then(response => ({ status: response.status(), cache: response.headers()['cache-control'] }))
  const initial = destination === coach ? observe(page, 'GET') : null
  await page.getByRole('button', { name: 'Ingresar', exact: true }).click()
  const result = await signedIn
  assert.equal(result.status, 200, 'Use the actual email form and local Auth')
  assert.match(result.cache || '', /no-store/)
  if (!initial) { await page.waitForURL(url => url.pathname !== '/auth/email-login'); return null }
  await page.waitForURL(url => url.pathname === coach)
  const view = checked(await initial, page).body
  await idle(page)
  return view
}
async function fillDraft(page, purpose, count = 2) {
  await card(page).getByLabel('Propósito del plan', { exact: true }).fill(purpose)
  await card(page).getByLabel('Restricciones que quieres respetar', { exact: true }).fill('Dos bloques de diez minutos; conservaré una nota sintética.')
  while (await card(page).getByLabel(/^Título del paso \d+$/).count() < count) await card(page).getByRole('button', { name: 'Agregar paso', exact: true }).click()
  for (let index = 1; index <= count; index++) {
    await card(page).getByLabel(`Título del paso ${index}`, { exact: true }).fill(`Paso sintético ${index}`)
    await card(page).getByLabel(`Qué harás en el paso ${index}`, { exact: true }).fill(`Practicar una acción acotada ${index} y escribir qué necesito revisar.`)
  }
  await card(page).getByLabel('Cuándo revisarás el plan', { exact: true }).fill(reviewDate())
}
async function deletePlan(page, testCancel = false) {
  await card(page).getByText('Más opciones del plan', { exact: true }).click()
  await card(page).getByRole('button', { name: 'Eliminar contenido del plan', exact: true }).click()
  await page.waitForFunction(() => document.activeElement?.textContent === 'Conservar contenido')
  if (testCancel) {
    const before = await persistence(actors.get(page))
    await card(page).getByRole('button', { name: 'Conservar contenido', exact: true }).click()
    same(await persistence(actors.get(page)), before, 'Cancel deletion must not change any saved row')
    await card(page).getByRole('button', { name: 'Eliminar contenido del plan', exact: true }).click()
  }
  return clickPlan(page, 'Eliminar definitivamente')
}
async function visual(page, name) {
  await page.evaluate(() => document.fonts.ready)
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
  const layout = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth }))
  layouts.push({ phase, name, ...layout })
  assert.ok(layout.document <= layout.viewport + 1, `Plan layout overflows: ${name}`)
  await page.screenshot({ path: join(evidence, `a2-plan-${phase}-${name}.png`), fullPage: true })
  const scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
  const violations = scan.violations.map(item => ({ id: item.id, impact: item.impact, targets: item.nodes.map(node => node.target) }))
  accessibility.push({ phase, name, violations, incomplete: scan.incomplete.map(item => item.id) })
  assert.equal(violations.filter(item => ['serious', 'critical'].includes(item.impact)).length, 0, `Plan accessibility: ${name}`)
}
async function localFault(table, revoked) {
  assert.ok(['a2_reviewed_plans', 'career_search_intents'].includes(table))
  await db.query(`${revoked ? 'revoke select on' : 'grant select on'} public.${table} ${revoked ? 'from' : 'to'} authenticated`)
  if (table === 'a2_reviewed_plans') planReadRevoked = revoked
  else objectiveReadRevoked = revoked
}

try {
  await db.connect()
  for (const user of fixture.users) {
    const initial = await persistence(user.id)
    assert.equal(initial.slots.length + initial.revisions.length + initial.receipts.length, 0, 'Browser owners begin without plan state')
  }
  log = createWriteStream(join(root, 'a2-plan-server.private.log'), { mode: 0o600 })
  server = spawn(process.execPath, [join(repo, 'node_modules/next/dist/bin/next'), 'dev', '--hostname', 'localhost', '--port', String(port)], {
    cwd: app, env: { ...closureServerEnv(status), NEXT_PUBLIC_APP_URL: base }, stdio: ['ignore', 'pipe', 'pipe'],
  })
  server.stdout.pipe(log); server.stderr.pipe(log)
  let ready = false
  for (let attempt = 0; attempt < 120; attempt++) {
    assert.equal(server.exitCode, null, 'Plan Next server stopped early')
    try { if ((await fetch(base)).ok) { ready = true; break } } catch {}
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  assert.ok(ready, 'Plan local Next readiness timed out')
  browser = await chromium.launch({ headless: true })

  for (const viewport of AUTH_VIEWPORTS) {
    phase = viewport.name
    const user = fixture.users.find(item => item.label === `a2-plan-${phase}`)
    const other = fixture.users.find(item => item.label === `a2-plan-${phase === 'desktop' ? 'mobile' : 'desktop'}`)
    const context = await newContext(viewport, viewport.ipOffset + 120)
    const page = await newPage(context)
    const initial = await login(page, user)
    assert.equal(initial.plan, null); assert.equal(initial.revision, 0)
    assert.equal(initial.context?.available, true, 'Actual canonical context must be readable before creating a plan')
    const baseline = await progress(user.id)
    record('actual email login and owner GET show no prior plan')
    await card(page).getByRole('button', { name: 'Preparar mi plan', exact: true }).click()
    assert.equal(await card(page).getByRole('button', { name: 'Guardar y activar plan', exact: true }).isDisabled(), true)
    await fillDraft(page, `Plan sintético ${phase}: practicar y revisar sin avanzar módulos.`)
    if (phase === 'mobile') {
      for (let index = 0; index < 3; index++) await card(page).getByRole('button', { name: 'Agregar paso', exact: true }).click()
      assert.equal(await card(page).getByLabel(/^Título del paso \d+$/).count(), 5)
      assert.equal(await card(page).getByRole('button', { name: 'Agregar paso', exact: true }).isDisabled(), true)
      for (const index of [5, 4, 3]) await card(page).getByRole('button', { name: `Quitar paso ${index}`, exact: true }).click()
      await page.waitForFunction(() => document.activeElement?.id.includes('-title'))
      record('mobile editor caps steps at five and preserves focus when removing them')
    }
    await visual(page, 'editor')
    let saved = (await clickPlan(page, 'Guardar y activar plan')).body
    assert.equal(saved.receipt.replayed, false); assert.equal(saved.revision, 1)
    await assertSaved(user.id, saved)
    await clickPlan(page, 'Pausar plan')
    const reload = observe(page, 'GET')
    await page.reload()
    const recovered = checked(await reload, page).body
    await idle(page)
    assert.equal(recovered.plan.state, 'paused')
    assert.equal(recovered.plan.content.purpose, saved.plan.content.purpose)
    assert.equal(recovered.revision, 2)
    assert.equal(await page.getByLabel('Tu pregunta', { exact: true }).inputValue(), '')
    saved = (await clickPlan(page, 'Retomar plan')).body
    assert.equal(saved.plan.state, 'active'); assert.equal(saved.revision, 3)
    record('explicit save persists through reload and paused plans resume from the same owner slot')
    await card(page).getByRole('button', { name: 'Editar plan', exact: true }).click()
    await card(page).getByLabel('Propósito del plan', { exact: true }).fill(`Corrección sintética ${phase}: dos pasos revisados.`)
    await card(page).getByLabel('Estado del paso 1', { exact: true }).selectOption('reported_done')
    await card(page).getByLabel('Estado del paso 2', { exact: true }).selectOption('skipped')
    await clickPlan(page, 'Guardar y activar plan')
    saved = (await clickPlan(page, 'Marcar plan como realizado')).body
    assert.equal(saved.plan.state, 'completed')
    await visual(page, 'completed')
    await card(page).getByRole('button', { name: 'Preparar otro plan', exact: true }).click()
    await card(page).getByLabel('Estado del paso 1', { exact: true }).selectOption('pending')
    await card(page).getByLabel('Estado del paso 2', { exact: true }).selectOption('pending')
    await clickPlan(page, 'Guardar y activar plan')
    saved = (await clickPlan(page, 'Cancelar plan')).body
    assert.equal(saved.plan.state, 'cancelled')
    record('correction, declared step completion, completion and cancellation preserve explicit user control')

    if (phase === 'desktop') {
      await card(page).getByRole('button', { name: 'Preparar otro plan', exact: true }).click()
      await card(page).getByLabel('Propósito del plan', { exact: true }).fill('Plan sintético para comparar dos sesiones.')
      await clickPlan(page, 'Guardar y activar plan')
      const secondContext = await newContext(viewport, 151)
      const second = await newPage(secondContext)
      await login(second, user)
      await card(page).getByRole('button', { name: 'Editar plan', exact: true }).click()
      const retained = 'Mi borrador local conserva esta corrección sintética.'
      await card(page).getByLabel('Propósito del plan', { exact: true }).fill(retained)
      await card(second).getByRole('button', { name: 'Editar plan', exact: true }).click()
      await card(second).getByLabel('Propósito del plan', { exact: true }).fill('Edición guardada desde la segunda sesión sintética.')
      const reached = deferred(), release = deferred()
      const holdBeforeWrite = async route => {
        if (route.request().method() !== 'POST') return route.fallback()
        reached.resolve(); await bounded(release.promise, 'Timed out releasing a stale revision request'); await route.continue()
      }
      await page.route(base + path, holdBeforeWrite)
      const conflicting = observe(page, 'POST')
      try {
        await card(page).getByRole('button', { name: 'Guardar y activar plan', exact: true }).click()
        await bounded(reached.promise, 'The real UI did not submit its held revision')
        await clickPlan(second, 'Guardar y activar plan')
        release.resolve()
        const result = checked(await conflicting, page, 409)
        assert.equal(result.body.code, 'plan_conflict')
        await idle(page)
      } finally { release.resolve(); await page.unroute(base + path, holdBeforeWrite) }
      assert.equal(await card(page).getByLabel('Propósito del plan', { exact: true }).inputValue(), retained)
      assert.equal(await card(page).getByRole('button', { name: 'Guardar y activar plan', exact: true }).isDisabled(), true)
      await visual(page, 'conflict-retains-draft')
      await card(page).getByRole('button', { name: 'Revisé los cambios y quiero conservar mi borrador', exact: true }).click()
      saved = (await clickPlan(page, 'Guardar y activar plan')).body
      assert.equal(saved.plan.content.purpose, retained)
      await assertSaved(user.id, saved)
      record('real CAS conflict preserves the local draft until explicit comparison and a fresh save')

      // A source edit is deliberate local fixture setup, never a plan side effect.
      await card(page).getByRole('button', { name: 'Editar plan', exact: true }).click()
      await card(page).getByLabel('Propósito del plan', { exact: true }).fill('Borrador sintético que requiere revisar el objetivo actualizado.')
      const previousHash = saved.context.hash
      await db.query(`insert into public.career_search_intents(user_id,target_roles,is_primary,is_active,source)
        values($1,'["Analista sintético de revisión"]'::jsonb,true,true,'user_confirmed')`, [user.id])
      const changed = await clickPlan(page, 'Guardar y activar plan', 409)
      assert.equal(changed.body.code, 'plan_context_changed')
      assert.notEqual(changed.body.view.context.hash, previousHash)
      assert.equal(await card(page).getByRole('button', { name: 'Guardar y activar plan', exact: true }).isDisabled(), true)
      await card(page).getByRole('button', { name: 'Revisé los cambios y quiero conservar mi borrador', exact: true }).click()
      saved = (await clickPlan(page, 'Guardar y activar plan')).body
      assert.equal(saved.plan.contextSnapshot.hash, changed.body.view.context.hash)
      const next = page.locator('[data-guided-next-action]').locator('..')
        .getByRole('link', { name: saved.guidance.action.label, exact: true })
      assert.equal(await next.getAttribute('href'), saved.guidance.action.href, 'Continuation remains the canonical current action')
      record('source changes require explicit re-review and preserve the canonical continuation')

      await localFault('career_search_intents', true)
      try {
        const unavailable = await readPlan(page)
        assert.equal(unavailable.freshness.status, 'unavailable')
        assert.equal(unavailable.plan.id, saved.plan.id)
        assert.equal(await card(page).getByRole('button', { name: 'Editar plan', exact: true }).isDisabled(), true)
        controlledFaults.push({ phase, kind: 'local_source_select_revoked', preservedSavedPlan: true })
      } finally { await localFault('career_search_intents', false) }
      await readPlan(page)
      await localFault('a2_reviewed_plans', true)
      try {
        const failed = observe(page, 'GET')
        await page.reload()
        checked(await failed, page, 503)
        await idle(page)
        assert.equal(await card(page).getByRole('button', { name: 'Preparar mi plan', exact: true }).count(), 0)
        await card(page).getByRole('alert').waitFor()
        controlledFaults.push({ phase, kind: 'local_plan_select_revoked', emptyPlanNotFabricated: true })
      } finally { await localFault('a2_reviewed_plans', false) }
      await readPlan(page)
      record('real read and source failures preserve saved data and never present a false fresh or empty plan')

      // Returning to the tab refreshes the real GET without changing the editor.
      await card(page).getByRole('button', { name: 'Editar plan', exact: true }).click()
      const focusDraft = 'Este borrador sintético se conserva al volver a la pestaña.'
      await card(page).getByLabel('Propósito del plan', { exact: true }).fill(focusDraft)
      const sibling = await newPage(context)
      await sibling.goto(`${base}/auth/email-login`)
      await sibling.bringToFront()
      await db.query("update public.career_search_intents set target_roles='[\"Coordinación sintética revisada\"]'::jsonb where user_id=$1", [user.id])
      const returning = observe(page, 'GET')
      await page.bringToFront()
      checked(await returning, page)
      await idle(page)
      assert.equal(await card(page).getByLabel('Propósito del plan', { exact: true }).inputValue(), focusDraft)
      assert.equal(await card(page).getByRole('button', { name: 'Guardar y activar plan', exact: true }).isDisabled(), true)
      await card(page).getByRole('button', { name: 'Revisé los cambios y quiero conservar mi borrador', exact: true }).click()
      await clickPlan(page, 'Guardar y activar plan')
      await sibling.close()
      record('a real tab return refreshes source freshness while retaining the editor for explicit review')

      await card(page).getByRole('button', { name: 'Editar plan', exact: true }).click()
      const pendingPurpose = 'Solicitud sintética con confirmación perdida; conservar este borrador.'
      await card(page).getByLabel('Propósito del plan', { exact: true }).fill(pendingPurpose)
      const committed = deferred()
      let lostCommand, transportPosts = 0
      const loseDelivery = async route => {
        if (route.request().method() !== 'POST') return route.fallback()
        try {
          assert.equal(++transportPosts, 1)
          lostCommand = route.request().postDataJSON()
          const response = await route.fetch({ timeout: 30000, maxRetries: 0, maxRedirects: 0 })
          assert.equal(response.status(), 200)
          const body = a2PlanMutationResponseSchema.parse(await response.json())
          await assertSaved(user.id, body)
          assert.equal(body.receipt.replayed, false)
          await route.abort('connectionreset')
          committed.resolve({ body })
        } catch (error) { await route.abort('failed').catch(() => {}); committed.resolve({ error }) }
      }
      await page.route(base + path, loseDelivery)
      try {
        await card(page).getByRole('button', { name: 'Guardar y activar plan', exact: true }).click()
        const result = await bounded(committed.promise, 'Did not observe a committed plan before response loss')
        if (result.error) throw result.error
        await idle(page)
        await card(page).getByRole('group', { name: 'Confirmar la solicitud pendiente', exact: true }).waitFor()
        assert.equal(await card(page).getByLabel('Propósito del plan', { exact: true }).inputValue(), pendingPurpose)
        assert.equal(transportPosts, 1, 'Uncertain writes never retry automatically')
      } finally { await page.unroute(base + path, loseDelivery) }
      await readPlan(second)
      const deleted = (await deletePlan(second, true)).body
      await assertSaved(user.id, deleted)
      const current = await readPlan(page, 'Comprobar estado actual')
      assert.equal(current.plan, null)
      assert.equal(await card(page).getByLabel('Propósito del plan', { exact: true }).inputValue(), pendingPurpose)
      await card(page).getByRole('button', { name: 'Reintentar la misma solicitud', exact: true }).waitFor()
      const beforeReplay = await persistence(user.id)
      const replay = await clickPlan(page, 'Reintentar la misma solicitud')
      assert.deepEqual(replay.command, lostCommand, 'Recovery must resend the exact prior command/requestId')
      assert.equal(replay.body.receipt.replayed, true)
      assert.equal(replay.body.plan, null)
      assert.ok(replay.body.receipt.revision < replay.body.revision)
      same(await persistence(user.id), beforeReplay, 'An old save receipt must not restore deleted content or write another revision')
      assert.equal(await card(page).getByLabel('Propósito del plan', { exact: true }).count(), 0)
      assert.equal(await card(page).locator('[data-a2-plan-summary]').count(), 0)
      await visual(page, 'replay-after-deletion')
      controlledFaults.push({ phase, kind: 'lost_200_after_verified_sql_commit', exactReplay: true, laterDeletionPreserved: true })
      record('lost ACK retains the draft; GET does not confirm the command; exact replay returns receipt plus current deletion')
      await secondContext.close(); contexts.delete(secondContext)

      await card(page).getByRole('button', { name: 'Preparar mi plan', exact: true }).click()
      await fillDraft(page, 'Plan sintético después de borrar el anterior.')
      await clickPlan(page, 'Guardar y activar plan')
      await card(page).getByRole('button', { name: 'Editar plan', exact: true }).click()
      const privateMarker = 'CONTENIDO_SINTETICO_DEL_ACTOR_ANTERIOR'
      await card(page).getByLabel('Propósito del plan', { exact: true }).fill(privateMarker)
      const oldDelivered = deferred(), allowDelivery = deferred(), deliveryDone = deferred()
      const delayedResponse = async route => {
        if (route.request().method() !== 'POST') return route.fallback()
        try {
          const response = await route.fetch({ timeout: 30000, maxRetries: 0, maxRedirects: 0 })
          assert.equal(response.status(), 200)
          await assertSaved(user.id, a2PlanMutationResponseSchema.parse(await response.json()))
          oldDelivered.resolve({ ok: true })
          await bounded(allowDelivery.promise, 'Account-switch delivery was not released')
          await route.fulfill({ response }).catch(() => {})
          deliveryDone.resolve({ ok: true })
        } catch (error) { oldDelivered.resolve({ error }); deliveryDone.resolve({ error }); await route.abort('failed').catch(() => {}) }
      }
      await page.route(base + path, delayedResponse)
      try {
        await card(page).getByRole('button', { name: 'Guardar y activar plan', exact: true }).click()
        const sent = await bounded(oldDelivered.promise, 'Old actor response was not observed')
        if (sent.error) throw sent.error
        const switcher = await newPage(context)
        const otherBefore = await persistence(other.id)
        const otherView = await login(switcher, other)
        assert.equal(otherView.plan, null, 'The second actor must not receive the first actor plan')
        allowDelivery.resolve()
        const delivered = await bounded(deliveryDone.promise, 'Old actor response did not finish')
        if (delivered.error) throw delivered.error
        await page.getByRole('alert').filter({ hasText: 'La sesión cambió.' }).waitFor()
        assert.equal(await page.locator('[data-a2-reviewed-plan],textarea,[role="log"],[data-guided-next-action]').count(), 0)
        assert.equal((await page.locator('body').innerText()).includes(privateMarker), false)
        same(await persistence(other.id), otherBefore, 'Changing accounts cannot write the old draft into the second owner')
        await visual(page, 'account-change')
        await switcher.close()
      } finally { allowDelivery.resolve(); await page.unroute(base + path, delayedResponse) }
      record('actual account change during delivery clears personal UI and cannot apply the prior actor response')
    } else {
      const deleted = (await deletePlan(page, true)).body
      await assertSaved(user.id, deleted)
      await visual(page, 'deleted')
      record('mobile deletion requires confirmation, purges content and retains the owner revision tombstone')
    }
    same(await progress(user.id), baseline, 'Plan actions must not change profile, journey, task completions, module progress, XP or balance')
    record('all plan operations leave the complete canonical progress and XP snapshots unchanged')
    await context.close(); contexts.delete(context)
  }

  phase = 'access'
  const locked = fixture.users.find(user => user.label === 'a2-plan-locked')
  const context = await newContext(AUTH_VIEWPORTS[0], 152)
  const page = await newPage(context)
  await page.goto(`${base}/auth/email-login`)
  const apiRead = actor => page.evaluate(async ({ actor, path, expectedActorHeader }) => {
    const response = await fetch(path, { credentials: 'same-origin', cache: 'no-store', headers: { [expectedActorHeader]: actor } })
    return { status: response.status, body: await response.json() }
  }, { actor, path, expectedActorHeader })
  assert.equal((await apiRead(locked.id)).status, 401)
  await login(page, locked, '/despega/dashboard')
  const denied = await apiRead(locked.id)
  assert.equal(denied.status, 403); assert.equal(denied.body.code, 'journey_access_required')
  const untouched = await persistence(locked.id)
  assert.equal(untouched.slots.length + untouched.revisions.length + untouched.receipts.length, 0)
  record('actual API rejects anonymous and admitted-but-A2-locked owners without creating a plan')
  assert.equal(javascriptErrors.length, 0, 'Unexpected JavaScript errors in the actual plan UI')
  assert.equal(blockedHosts.size, 0, 'Plan acceptance attempted an external request')
} catch (error) {
  failure = safeFailure(error, secrets)
  console.error('A2 plan acceptance failed:', failure)
  process.exitCode = 1
} finally {
  for (const context of contexts) await context.close().catch(() => {})
  await browser?.close().catch(() => {})
  try {
    if (planReadRevoked) await localFault('a2_reviewed_plans', false)
    if (objectiveReadRevoked) await localFault('career_search_intents', false)
  } catch (error) { failure ||= safeFailure(error, secrets); process.exitCode = 1 }
  await db.end().catch(() => {})
  if (server && server.exitCode === null) {
    const ended = once(server, 'exit')
    server.kill('SIGTERM')
    const timer = setTimeout(() => server?.kill('SIGKILL'), 5000)
    await ended; clearTimeout(timer)
  }
  log?.end()
  writeFileSync(join(evidence, 'a2-plan-browser-results.json'), JSON.stringify({
    commit: process.env.A1_SOURCE_COMMIT, scope: manifest.environment, verdict: failure ? 'FAIL' : 'PASS',
    steps, accessibility, layouts, javascriptErrors, blockedHosts: [...blockedHosts], requestFailures,
    controlledFaults, progressTablesCompared: invariantTables, failure,
    transport: 'Actual local UI, email Auth, API, RLS and SQL; no successful plan API response is mocked.',
    notVerified: manifest.notVerified,
  }, null, 2))
}
