/**
 * AG04 actual UI/Auth/action API/PostgreSQL acceptance. The assistant's generated
 * proposal is the only successful HTTP substitution; its day/context come from
 * the real action GET. No action write, receipt or database effect is mocked.
 */
import assert from 'node:assert/strict'
import { createHash, randomUUID } from 'node:crypto'
import { createRequire } from 'node:module'
import { createWriteStream, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { closureLab, closureServerEnv, safeFailure } from './closure-lab.mjs'
import { assertAuthSources } from './auth-lab.mjs'
import { a2PlanToday } from '../../lib/a2/plan-contract.ts'
import {
  A2_ACTION_TOOL, A2_ACTION_ACTOR_HEADER, A2_ACTION_EXPECTED_ACTOR_HEADER,
  a2ActionCommandSchema, a2ActionProposalSchema, a2ActionResultSchema, a2ActionViewSchema,
  a2ActionStoredContent, a2ActionResultMatchesCommand,
} from '../../lib/a2/assistant-action-contract.ts'

const { root, app, repo, status, evidence } = closureLab()
const port = 3120, base = `http://localhost:${port}`
const actionPath = '/api/a2/assistant-actions', coachPath = '/despega/a2/coach', chatPath = '/api/despega/a2-coach'
const fixture = JSON.parse(readFileSync(join(root, 'a2-action-fixtures.private.json'), 'utf8'))
const manifest = JSON.parse(readFileSync(join(root, 'a2-action-prepared.json'), 'utf8'))
const viewports = [
  { name: 'desktop', width: 1440, height: 844, ip: 170 },
  { name: 'mobile', width: 390, height: 844, ip: 180 },
]
assert.equal(fixture.scope, 'disposable-local-a2-action')
assert.equal(manifest.environment, fixture.scope)
assert.equal(fixture.users.length, 4)
assert.equal(new Set(fixture.users.map(user => user.id)).size, 4)
assert.ok(typeof fixture.password === 'string' && fixture.password.length >= 32)
for (const label of ['a2-action-desktop', 'a2-action-mobile', 'a2-action-locked', 'a2-action-revoked']) {
  assert.ok(fixture.users.some(user => user.label === label && user.email === `dtc-qa-${label}@example.invalid`))
}
assertAuthSources(JSON.parse(readFileSync(join(root, 'auth-prepared.json'), 'utf8')), app, repo)
for (const item of manifest.copied) {
  const source = readFileSync(join(repo, item.path)), copied = readFileSync(join(app, item.path))
  assert.deepEqual(source, copied, `Actual AG04 application source changed: ${item.path}`)
  assert.equal(createHash('sha256').update(copied).digest('hex'), item.sha256)
}
const requireTools = createRequire(join(process.env.A1_TOOLS_ROOT, 'package.json'))
const requireApp = createRequire(join(repo, 'package.json'))
const { chromium } = requireTools('playwright')
const { default: AxeBuilder } = requireTools('@axe-core/playwright')
const { Client } = requireApp('pg')
const db = new Client({ connectionString: status.DB_URL })
const secrets = [fixture.password, status.DB_URL, status.ANON_KEY, status.SERVICE_ROLE_KEY]
const steps = [], accessibility = [], layouts = [], javascriptErrors = [], requestFailures = [], controlledFaults = []
const generationFixtures = [], blockedHosts = new Set(), actors = new WeakMap(), contexts = new Set()
const invariantTables = ['despega_user_profiles', 'despega_journey_state', 'a2_user_task_completions',
  'a3_user_progress', 'a3_route_progression', 'user_gamification_profile', 'user_dtc_balance']
let browser, server, log, phase = 'setup', failure = null, failureScreenshot = null, revokedOwner = null
const card = page => page.locator('[data-a2-assistant-action]')
const record = name => { steps.push({ phase, name, status: 'PASS' }); console.log(`AG04: ${phase}: ${name}: PASS`) }
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
    const rows = await db.query(`select coalesce(jsonb_agg(to_jsonb(t) order by to_jsonb(t)::text),'[]'::jsonb) as value
      from public.${table} t where user_id=$1`, [userId])
    result[table] = rows.rows[0].value
  }
  return result
}
async function persistence(userId) {
  const rows = await db.query(`select
    (select coalesce(jsonb_agg(to_jsonb(t) order by id),'[]'::jsonb) from public.dtc_documents t
      where user_id=$1 and type='a2_practice_adjustment') as documents,
    (select coalesce(jsonb_agg(to_jsonb(t) order by request_id),'[]'::jsonb) from dtc_private.a2_assistant_action_receipts t
      where user_id=$1) as receipts`, [userId])
  return rows.rows[0]
}
function same(actual, expected, message) { assert.equal(JSON.stringify(actual), JSON.stringify(expected), message) }
async function assertSaved(userId, response, command) {
  const checked = a2ActionResultSchema.parse(response)
  assert.equal(a2ActionResultMatchesCommand(checked, command), true, 'Receipt and current effect match the exact reviewed command')
  const current = await persistence(userId)
  const receipt = current.receipts.find(row => row.request_id === command.requestId)
  assert.ok(receipt, 'Actual private receipt exists after confirmed commit')
  assert.equal(receipt.document_id, checked.receipt.documentId)
  assert.equal(Date.parse(receipt.committed_at), Date.parse(checked.receipt.committedAt))
  const document = current.documents.find(row => row.id === checked.receipt.documentId)
  if (checked.effect === 'present') {
    assert.ok(document, 'A current successful effect requires the real owner document')
    assert.equal(document.related_day, command.dayNumber)
    assert.equal(document.source_module, 'a2')
    assert.equal(document.source, 'user')
    assert.equal(document.status, 'draft')
    assert.deepEqual(JSON.parse(document.content), a2ActionStoredContent(command))
  } else if (checked.effect === 'removed') assert.equal(document, undefined)
  return current
}
function observe(page, method) {
  const waiting = page.waitForResponse(response => new URL(response.url()).pathname === actionPath
    && response.request().method() === method).then(async response => ({
      status: response.status(), headers: response.headers(), body: await response.json(),
      command: method === 'POST' ? response.request().postDataJSON() : null,
      expectedActor: response.request().headers()[A2_ACTION_EXPECTED_ACTOR_HEADER.toLowerCase()],
    }))
  waiting.catch(() => {})
  return waiting
}
function checked(result, page, expectedStatus = 200) {
  assert.equal(result.status, expectedStatus, 'Actual action API status matches the UI operation')
  assert.match(result.headers['cache-control'] || '', /no-store/)
  assert.equal(result.expectedActor, actors.get(page), 'Action request binds the observed actor')
  assert.equal(result.headers[A2_ACTION_ACTOR_HEADER.toLowerCase()], actors.get(page), 'Action result belongs to the observed actor')
  if (result.status === 200) {
    if (result.command) {
      a2ActionResultSchema.parse(result.body)
      assert.equal(a2ActionResultMatchesCommand(result.body, a2ActionCommandSchema.parse(result.command)), true)
    } else a2ActionViewSchema.parse(result.body)
  } else if (result.body.view) a2ActionViewSchema.parse(result.body.view)
  return result
}
async function idle(page) { await page.locator('[data-a2-assistant-action][aria-busy="false"]').waitFor() }
async function clickAction(page, label, expectedStatus = 200) {
  const response = observe(page, 'POST')
  await card(page).getByRole('button', { name: label, exact: true }).click()
  const result = checked(await response, page, expectedStatus)
  await idle(page)
  return result
}
async function readAction(page, label = 'Comprobar contexto actual') {
  const response = observe(page, 'GET')
  await card(page).getByRole('button', { name: label, exact: true }).click()
  const result = checked(await response, page)
  await idle(page)
  return result.body
}
async function api(page, method = 'GET', body, actor = actors.get(page)) {
  return page.evaluate(async ({ path, method, body, actor, expected }) => {
    const response = await fetch(path, { method, credentials: 'same-origin', cache: 'no-store',
      headers: { [expected]: actor, ...(body === undefined ? {} : { 'Content-Type': 'application/json' }) },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }) })
    return { status: response.status, headers: Object.fromEntries(response.headers.entries()), body: await response.json() }
  }, { path: actionPath, method, body, actor, expected: A2_ACTION_EXPECTED_ACTOR_HEADER })
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
async function login(page, user, destination = coachPath) {
  actors.set(page, user.id)
  await page.goto(`${base}/auth/email-login?next=${encodeURIComponent(destination)}`)
  await page.getByLabel('Correo electrónico', { exact: true }).fill(user.email)
  await page.getByLabel('Contraseña', { exact: true }).fill(fixture.password)
  const signedIn = page.waitForResponse(response => new URL(response.url()).pathname === '/api/auth/email-login'
    && response.request().method() === 'POST').then(response => ({ status: response.status(), cache: response.headers()['cache-control'] }))
  signedIn.catch(() => {})
  await page.getByRole('button', { name: 'Ingresar', exact: true }).click()
  const result = await signedIn
  assert.equal(result.status, 200, 'Use actual email form, local Auth and pilot admission')
  assert.match(result.cache || '', /no-store/)
  await page.waitForURL(url => url.pathname === destination)
  if (destination === coachPath) {
    await page.getByLabel('Tu pregunta', { exact: true }).waitFor()
    await page.locator('[data-a2-reviewed-plan][aria-busy="false"]').waitFor()
  }
}
async function propose(page, label, { retainedWork = '', nextAction = 'Practicar diez minutos y conservar una nota para revisar.' } = {}) {
  const supplied = deferred()
  let calls = 0
  const syntheticGeneration = async route => {
    if (route.request().method() !== 'POST') return route.fallback()
    try {
      assert.equal(++calls, 1, 'The browser generation fixture is single-use')
      assert.equal(route.request().headers()['x-dtc-expected-user-id'], actors.get(page))
      // This setup read uses the actual signed-in cookie jar and unmodified API.
      const response = await page.context().request.get(base + actionPath, {
        headers: { [A2_ACTION_EXPECTED_ACTOR_HEADER]: actors.get(page) },
      })
      assert.equal(response.status(), 200)
      assert.equal(response.headers()[A2_ACTION_ACTOR_HEADER.toLowerCase()], actors.get(page))
      const view = a2ActionViewSchema.parse(await response.json())
      assert.equal(view.context?.available, true)
      assert.ok(view.dayNumber !== null)
      const proposal = a2ActionProposalSchema.parse({ version: 'dtc-a2-action-proposal.v1', tool: A2_ACTION_TOOL,
        dayNumber: view.dayNumber, expectedContextHash: view.context.hash,
        draft: { outcome: 'could_not', barrier: 'time', retainedWork, nextAction } })
      await route.fulfill({ status: 200, headers: {
        'Content-Type': 'application/json', 'Cache-Control': 'private, no-store', 'X-DTC-Actor-Id': actors.get(page),
      }, body: JSON.stringify({ response: `Propuesta sintética ${label}: revisa el ajuste y decide qué quieres conservar.`,
        guidance: view.guidance, actionProposal: proposal }) })
      generationFixtures.push({ phase, label, replacement: 'assistant-generation-http-only', contextRead: 'actual-action-api' })
      supplied.resolve({ proposal })
    } catch (error) { await route.abort('failed').catch(() => {}); supplied.resolve({ error }) }
  }
  await page.route(base + chatPath, syntheticGeneration)
  try {
    await page.getByLabel('Tu pregunta', { exact: true }).fill(`No pude practicar. Quiero revisar un ajuste sintético ${label}.`)
    await page.getByRole('button', { name: 'Enviar pregunta', exact: true }).click()
    const result = await bounded(supplied.promise, 'The actual chat did not receive its declared proposal fixture')
    if (result.error) throw result.error
    await card(page).getByRole('button', { name: 'Revisar ajuste', exact: true }).waitFor()
    assert.equal(calls, 1)
    return result.proposal
  } finally { await page.unroute(base + chatPath, syntheticGeneration) }
}
async function review(page) {
  const response = observe(page, 'GET')
  await card(page).getByRole('button', { name: 'Revisar ajuste', exact: true }).click()
  const result = checked(await response, page)
  await idle(page)
  await page.locator('[data-a2-action-review]').waitFor()
  assert.equal(result.body.context?.available, true)
  return result.body
}
async function fill(page, label) {
  await card(page).getByLabel('Qué necesitas cambiar', { exact: true }).selectOption('could_not')
  await card(page).getByLabel('Qué te dificultó avanzar', { exact: true }).selectOption('time')
  await card(page).getByLabel('Qué quieres conservar', { exact: true }).fill(`Conservo una nota sintética ${label}.`)
  await card(page).getByLabel('Qué intentarás ahora', { exact: true }).fill(`Dedicar diez minutos a una práctica sintética ${label} y registrar una duda.`)
  await card(page).getByLabel('Fecha de revisión', { exact: true }).fill(reviewDate())
}
async function visual(page, name) {
  await page.evaluate(() => document.fonts.ready)
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
  const layout = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth }))
  layouts.push({ phase, name, ...layout })
  assert.ok(layout.document <= layout.viewport + 1, `AG04 layout overflows: ${name}`)
  await page.screenshot({ path: join(evidence, `a2-action-${phase}-${name}.png`), fullPage: true })
  const scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
  const violations = scan.violations.map(item => ({ id: item.id, impact: item.impact, targets: item.nodes.map(node => node.target) }))
  accessibility.push({ phase, name, violations, incomplete: scan.incomplete.map(item => item.id) })
  assert.equal(violations.length, 0, `AG04 accessibility: ${name}`)
}

try {
  await db.connect()
  for (const user of fixture.users) {
    const state = await persistence(user.id)
    assert.equal(state.documents.length + state.receipts.length, 0, 'Browser owners begin with no adjustments or action receipts')
  }
  log = createWriteStream(join(root, 'a2-action-server.private.log'), { mode: 0o600 })
  server = spawn(process.execPath, [join(repo, 'node_modules/next/dist/bin/next'), 'dev', '--hostname', 'localhost', '--port', String(port)], {
    cwd: app, env: { ...closureServerEnv(status), NEXT_PUBLIC_APP_URL: base }, stdio: ['ignore', 'pipe', 'pipe'],
  })
  server.stdout.pipe(log); server.stderr.pipe(log)
  let ready = false
  for (let attempt = 0; attempt < 120; attempt++) {
    assert.equal(server.exitCode, null, 'AG04 Next server stopped early')
    try { if ((await fetch(base)).ok) { ready = true; break } } catch {}
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  assert.ok(ready, 'AG04 local Next readiness timed out')
  browser = await chromium.launch({ headless: true })

  for (const viewport of viewports) {
    phase = viewport.name
    const user = fixture.users.find(item => item.label === `a2-action-${phase}`)
    const other = fixture.users.find(item => item.label === `a2-action-${phase === 'desktop' ? 'mobile' : 'desktop'}`)
    const context = await newContext(viewport, viewport.ip), page = await newPage(context)
    await login(page, user)
    const baseline = await progress(user.id)
    const empty = await persistence(user.id)
    const proposal = await propose(page, `${phase}-first`)
    same(await persistence(user.id), empty, 'Receiving a model proposal must not execute a tool')
    const reviewed = await review(page)
    assert.equal(reviewed.dayNumber, proposal.dayNumber)
    assert.equal(reviewed.context.hash, proposal.expectedContextHash)
    assert.equal(await card(page).getByRole('button', { name: 'Confirmar y guardar ajuste', exact: true }).isDisabled(), true)
    await fill(page, `${phase}-first`)
    same(await persistence(user.id), empty, 'Reviewing and editing are not a database mutation')
    await visual(page, 'review')
    const first = await clickAction(page, 'Confirmar y guardar ajuste')
    assert.equal(first.body.effect, 'present'); assert.equal(first.body.receipt.replayed, false)
    const firstSaved = await assertSaved(user.id, first.body, first.command)
    assert.equal(firstSaved.documents.length, 1); assert.equal(firstSaved.receipts.length, 1)
    await page.locator('[data-a2-action-receipt]').waitFor()
    await card(page).getByText(`Ajuste guardado para el día ${proposal.dayNumber}.`, { exact: true }).waitFor()
    await visual(page, 'saved')
    record('proposal and edits do not write; explicit confirmation persists the exact reviewed adjustment and receipt')

    const beforeReplay = await persistence(user.id)
    const replay = await api(page, 'POST', first.command)
    assert.equal(replay.status, 200)
    assert.equal(replay.body.receipt.replayed, true)
    assert.equal(replay.body.effect, 'present')
    await assertSaved(user.id, replay.body, first.command)
    same(await persistence(user.id), beforeReplay, 'Duplicate confirmation does not append another adjustment or receipt')
    await page.reload()
    await page.getByLabel('Tu pregunta', { exact: true }).waitFor()
    await page.locator('[data-a2-reviewed-plan][aria-busy="false"]').waitFor()
    const recovered = await api(page)
    assert.equal(recovered.status, 200)
    const recoveredView = a2ActionViewSchema.parse(recovered.body)
    assert.equal(recoveredView.guidance.adjustment.nextAction, first.command.adjustment.nextAction)
    assert.equal(recoveredView.guidance.adjustment.retainedWork, first.command.adjustment.retainedWork)
    assert.equal(await page.getByLabel('Tu pregunta', { exact: true }).inputValue(), '')
    assert.equal(await page.locator('[data-a2-action-review]').count(), 0, 'Unconfirmed editor/chat are not advertised as persisted')
    record('identical command replays without writes and a real reload recovers the confirmed adjustment as canonical context')

    if (phase === 'desktop') {
      await propose(page, 'context-conflict')
      const previous = await review(page)
      await fill(page, 'context-conflict')
      const retained = await card(page).getByLabel('Qué intentarás ahora', { exact: true }).inputValue()
      const before = await persistence(user.id)
      await db.query(`insert into public.career_search_intents(user_id,target_roles,is_primary,is_active,source)
        values($1,'["Analista sintético AG04 revisado"]'::jsonb,true,true,'user_confirmed')`, [user.id])
      const conflict = await clickAction(page, 'Confirmar y guardar ajuste', 409)
      assert.equal(conflict.body.code, 'action_context_changed')
      same(await persistence(user.id), before, 'A stale-context confirmation cannot write an adjustment')
      assert.equal(await card(page).getByLabel('Qué intentarás ahora', { exact: true }).inputValue(), retained)
      assert.equal(await card(page).getByRole('button', { name: 'Confirmar y guardar ajuste', exact: true }).isDisabled(), true)
      const current = await readAction(page)
      assert.notEqual(current.context.hash, previous.context.hash)
      await visual(page, 'context-conflict')
      await card(page).getByRole('button', { name: 'Revisé el contexto; conservar mi edición', exact: true }).click()
      const confirmed = await clickAction(page, 'Confirmar y guardar ajuste')
      assert.notEqual(confirmed.command.requestId, conflict.command.requestId)
      assert.equal(confirmed.command.expectedContextHash, current.context.hash)
      assert.equal(confirmed.command.adjustment.nextAction, retained)
      await assertSaved(user.id, confirmed.body, confirmed.command)
      record('source changes reject stale confirmation, preserve the draft and require explicit context review before a new command')
    }

    await propose(page, `${phase}-lost-delivery`)
    await review(page)
    await fill(page, `${phase}-lost-delivery`)
    const pendingText = await card(page).getByLabel('Qué intentarás ahora', { exact: true }).inputValue()
    const committed = deferred()
    let lostCommand, lostResult, posts = 0
    const loseDelivery = async route => {
      if (route.request().method() !== 'POST') return route.fallback()
      try {
        assert.equal(++posts, 1)
        lostCommand = a2ActionCommandSchema.parse(route.request().postDataJSON())
        const response = await route.fetch({ timeout: 30000, maxRetries: 0, maxRedirects: 0 })
        assert.equal(response.status(), 200)
        lostResult = a2ActionResultSchema.parse(await response.json())
        await assertSaved(user.id, lostResult, lostCommand)
        assert.equal(lostResult.receipt.replayed, false)
        await route.abort('connectionreset')
        committed.resolve({ ok: true })
      } catch (error) { await route.abort('failed').catch(() => {}); committed.resolve({ error }) }
    }
    await page.route(base + actionPath, loseDelivery)
    try {
      await card(page).getByRole('button', { name: 'Confirmar y guardar ajuste', exact: true }).click()
      const result = await bounded(committed.promise, 'No actual committed adjustment was observed before losing its HTTP delivery')
      if (result.error) throw result.error
      await idle(page)
      await card(page).getByRole('button', { name: 'Reintentar la misma solicitud', exact: true }).waitFor()
      assert.equal(await card(page).getByLabel('Qué intentarás ahora', { exact: true }).inputValue(), pendingText)
      assert.equal(posts, 1, 'An uncertain result must not trigger an automatic write retry')
    } finally { await page.unroute(base + actionPath, loseDelivery) }
    if (phase === 'desktop') {
      // A local fixture deletion is a later event, not an API rollback. The
      // original receipt must remain and the old save may never recreate it.
      assert.equal((await db.query('delete from public.dtc_documents where user_id=$1 and id=$2 returning id',
        [user.id,lostResult.receipt.documentId])).rowCount, 1)
    }
    const beforeRetry = await persistence(user.id)
    const retried = await clickAction(page, 'Reintentar la misma solicitud')
    assert.deepEqual(retried.command, lostCommand, 'Recovery resends exactly the reviewed command, including request ID and old context hash')
    assert.equal(retried.body.receipt.replayed, true)
    assert.equal(retried.body.effect, phase === 'desktop' ? 'removed' : 'present')
    await assertSaved(user.id, retried.body, lostCommand)
    same(await persistence(user.id), beforeRetry, 'A receipt lookup cannot duplicate or resurrect a document')
    if (phase === 'desktop') {
      assert.equal(await card(page).getByText(`Ajuste guardado para el día ${lostCommand.dayNumber}.`, { exact: true }).count(), 0,
        'Deleted effect cannot be presented as a newly successful save')
    }
    await visual(page, phase === 'desktop' ? 'replay-after-deletion' : 'recovered-confirmation')
    controlledFaults.push({ phase, kind: 'lost_http_after_verified_commit', exactReplay: true,
      laterDeletion: phase === 'desktop', currentEffect: retried.body.effect, unchangedPersistenceOnReplay: true })
    record(phase === 'desktop' ? 'lost delivery preserves the exact command; retry acknowledges its receipt without resurrecting a later deletion'
      : 'mobile lost delivery retries the exact command and confirms its current saved effect without duplicate writes')

    if (phase === 'desktop') {
      await propose(page, 'account-change')
      await review(page)
      await fill(page, 'account-change')
      const marker = 'TEXTO_SINTETICO_PRIVADO_DEL_ACTOR_ANTERIOR_AG04'
      await card(page).getByLabel('Qué intentarás ahora', { exact: true }).fill(marker)
      const sent = deferred(), release = deferred(), delivered = deferred()
      const delayResponse = async route => {
        if (route.request().method() !== 'POST') return route.fallback()
        try {
          const command = a2ActionCommandSchema.parse(route.request().postDataJSON())
          const response = await route.fetch({ timeout: 30000, maxRetries: 0, maxRedirects: 0 })
          assert.equal(response.status(), 200)
          await assertSaved(user.id, a2ActionResultSchema.parse(await response.json()), command)
          sent.resolve({ ok: true })
          await bounded(release.promise, 'Account-change HTTP delivery was not released')
          await route.fulfill({ response }).catch(() => {})
          delivered.resolve({ ok: true })
        } catch (error) { sent.resolve({ error }); delivered.resolve({ error }); await route.abort('failed').catch(() => {}) }
      }
      await page.route(base + actionPath, delayResponse)
      try {
        await card(page).getByRole('button', { name: 'Confirmar y guardar ajuste', exact: true }).click()
        const result = await bounded(sent.promise, 'No old-owner commit observed before changing account')
        if (result.error) throw result.error
        const otherBefore = await persistence(other.id)
        const switcher = await newPage(context)
        await login(switcher, other)
        release.resolve()
        const done = await bounded(delivered.promise, 'The held previous-owner response did not settle')
        if (done.error) throw done.error
        await page.bringToFront()
        await page.getByRole('alert').filter({ hasText: 'La sesión cambió.' }).waitFor()
        assert.equal(await page.locator('[data-a2-assistant-action],textarea,[role="log"],[data-guided-next-action]').count(), 0)
        assert.equal((await page.locator('body').innerText()).includes(marker), false)
        same(await persistence(other.id), otherBefore, 'An account change cannot write the old command into the new owner')
        await visual(page, 'account-change')
        await switcher.close()
      } finally { release.resolve(); await page.unroute(base + actionPath, delayResponse) }
      record('account change during real committed HTTP delivery clears personal UI and rejects the prior actor result')
    }
    same(await progress(user.id), baseline, 'Adjustment actions cannot change canonical progress, completions, XP or balance')
    record('all adjustment operations preserve complete snapshots of seven canonical progress and XP tables')
    await context.close(); contexts.delete(context)
  }

  phase = 'access'
  const locked = fixture.users.find(user => user.label === 'a2-action-locked')
  const context = await newContext(viewports[0], 191), page = await newPage(context)
  await page.goto(`${base}/auth/email-login`)
  assert.equal((await api(page, 'GET', undefined, locked.id)).status, 401)
  await login(page, locked, '/despega/dashboard')
  const lockedCommand = a2ActionCommandSchema.parse({ version: 'dtc-a2-action-command.v1', tool: A2_ACTION_TOOL,
    requestId: randomUUID(), dayNumber: 1, expectedContextHash: '0'.repeat(64),
    adjustment: { outcome: 'change', barrier: 'time', retainedWork: 'Una nota sintética de acceso bloqueado',
      nextAction: 'Un paso sintético que no debe guardarse', reviewDate: reviewDate() } })
  const denied = await api(page), deniedLockedWrite = await api(page, 'POST', lockedCommand)
  for (const response of [denied, deniedLockedWrite]) {
    assert.equal(response.status, 403); assert.equal(response.body.code, 'journey_access_required')
  }
  const lockedState = await persistence(locked.id)
  assert.equal(lockedState.documents.length + lockedState.receipts.length, 0)
  record('actual API rejects anonymous reads and A2-locked reads and confirmations before any action document or receipt')

  // Setup only: this already authenticated fixture loses its canonical state.
  // Do not navigate/login afterwards: pages retain their legacy initializer.
  // These direct API calls must remain reads even when access is rejected.
  assert.equal((await db.query('delete from public.despega_journey_state where user_id=$1 returning user_id', [locked.id])).rowCount, 1)
  const absentJourneyBaseline = await progress(locked.id)
  controlledFaults.push({ phase, kind: 'missing_canonical_journey_fixture', ownerFixture: 'a2-action-locked',
    setup: 'one local journey row deleted after genuine login; existing session reused without page navigation' })
  const absentRead = await api(page), absentWrite = await api(page, 'POST', lockedCommand)
  for (const response of [absentRead, absentWrite]) {
    assert.equal(response.status, 403); assert.equal(response.body.code, 'journey_access_required')
  }
  assert.equal((await db.query('select user_id from public.despega_journey_state where user_id=$1', [locked.id])).rowCount, 0,
    'The action authorization must not initialize a missing canonical journey')
  same(await progress(locked.id), absentJourneyBaseline, 'Rejected missing-journey requests preserve all seven canonical tables after declared setup')
  same(await persistence(locked.id), lockedState, 'A missing canonical journey cannot produce a document or receipt')
  record('missing canonical state rejects read and confirmation without initialization or any canonical progress mutation')

  const revoked = fixture.users.find(user => user.label === 'a2-action-revoked')
  const revokeContext = await newContext(viewports[0], 192), revokePage = await newPage(revokeContext)
  await login(revokePage, revoked)
  const available = a2ActionViewSchema.parse((await api(revokePage)).body)
  const command = a2ActionCommandSchema.parse({ version: 'dtc-a2-action-command.v1', tool: A2_ACTION_TOOL,
    requestId: randomUUID(), dayNumber: available.dayNumber, expectedContextHash: available.context.hash,
    adjustment: { outcome: 'change', barrier: 'time', retainedWork: 'Una nota sintética', nextAction: 'Un paso sintético de diez minutos', reviewDate: reviewDate() } })
  assert.equal((await api(revokePage, 'GET', undefined, locked.id)).status, 409)
  assert.equal((await api(revokePage, 'POST', command, locked.id)).status, 409)
  const beforeRevocation = await persistence(revoked.id)
  assert.equal((await db.query('delete from public.pilot_memberships where user_id=$1 returning id', [revoked.id])).rowCount, 1)
  revokedOwner = revoked.id
  const deniedRead = await api(revokePage), deniedWrite = await api(revokePage, 'POST', command)
  assert.equal(deniedRead.status, 403); assert.equal(deniedWrite.status, 403)
  assert.equal(deniedRead.body.code, 'pilot_access_unavailable'); assert.equal(deniedWrite.body.code, 'pilot_access_unavailable')
  same(await persistence(revoked.id), beforeRevocation, 'Revoked admission and wrong actor cannot write or disclose adjustment state')
  record('wrong expected actor and revoked admission reject both read and confirmation without persistence effects')
  assert.equal(javascriptErrors.length, 0, 'Unexpected JavaScript errors in actual AG04 UI')
  assert.equal(blockedHosts.size, 0, 'AG04 laboratory attempted an external request')
} catch (error) {
  failure = safeFailure(error, secrets)
  const page = [...contexts].flatMap(context => context.pages()).reverse().find(page => !page.isClosed() && page.url().startsWith(base + '/'))
  if (page) {
    const name = `a2-action-${phase}-failure.png`
    try { await page.screenshot({ path: join(evidence, name), fullPage: true }); failureScreenshot = name } catch {}
  }
  console.error('AG04 browser acceptance failed:', failure)
  process.exitCode = 1
} finally {
  for (const context of contexts) await context.close().catch(() => {})
  await browser?.close().catch(() => {})
  try {
    if (revokedOwner) await db.query("insert into public.pilot_memberships(user_id,access_kind) values($1,'grandfathered') on conflict(user_id) do nothing", [revokedOwner])
  } catch (error) { failure ||= safeFailure(error, secrets); process.exitCode = 1 }
  await db.end().catch(() => {})
  if (server && server.exitCode === null) {
    const ended = once(server, 'exit')
    server.kill('SIGTERM')
    const timer = setTimeout(() => server?.kill('SIGKILL'), 5000)
    await ended; clearTimeout(timer)
  }
  log?.end()
  writeFileSync(join(evidence, 'a2-action-browser-results.json'), JSON.stringify({
    commit: process.env.A1_SOURCE_COMMIT, scope: manifest.environment, verdict: failure ? 'FAIL' : 'PASS',
    steps, accessibility, layouts, javascriptErrors, blockedHosts: [...blockedHosts], requestFailures,
    controlledFaults, generationFixtures, progressTablesCompared: invariantTables, failure, failureScreenshot,
    transport: 'Actual UI, email Auth, action API, owner RLS and PostgreSQL. Only assistant generation responses use declared synthetic proposals.',
    notVerified: manifest.notVerified,
  }, null, 2))
}
