/** AG05 actual UI, local Auth, source APIs/RLS and PostgreSQL plan persistence.
 * All source content is synthetic. No successful HTTP response or stored effect
 * is fabricated, and this phase makes no model-provider call. */
import assert from 'node:assert/strict'
import { createHash, randomUUID } from 'node:crypto'
import { createRequire } from 'node:module'
import { createWriteStream, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { closureLab, closureServerEnv, safeFailure } from './closure-lab.mjs'
import { assertAuthSources } from './auth-lab.mjs'
import { A2_PLAN_ACTOR_HEADER, A2_PLAN_EXPECTED_ACTOR_HEADER, a2PlanViewSchema,
  a2PlanCommandSchema, a2PlanMutationResponseSchema, a2PlanToday } from '../../lib/a2/plan-contract.ts'
import { a2ReviewEvidenceSchema } from '../../lib/a2/review-evidence-contract.ts'

const { root, app, repo, status, evidence } = closureLab()
const port = 3121, base = `http://localhost:${port}`, planPath = '/api/a2/plan', coachPath = '/despega/a2/coach'
const fixture = JSON.parse(readFileSync(join(root, 'a2-review-evidence-fixtures.private.json'), 'utf8'))
const manifest = JSON.parse(readFileSync(join(root, 'a2-review-evidence-prepared.json'), 'utf8'))
const viewports = [{ name: 'desktop', width: 1440, height: 844, ip: 200 }, { name: 'mobile', width: 390, height: 844, ip: 201 }]
assert.equal(fixture.scope, 'disposable-local-a2-review-evidence'); assert.equal(manifest.environment, fixture.scope)
assert.equal(fixture.users.length, 4); assert.equal(new Set(fixture.users.map(user => user.id)).size, 4)
assert.ok(typeof fixture.password === 'string' && fixture.password.length >= 32)
for (const kind of ['desktop', 'mobile', 'persona', 'locked']) {
  const user = fixture.users.find(user => user.label === `a2-review-evidence-${kind}`)
  assert.ok(user && user.email === `dtc-qa-${user.label}@example.invalid`)
}
assertAuthSources(JSON.parse(readFileSync(join(root, 'auth-prepared.json'), 'utf8')), app, repo)
for (const item of manifest.copied) {
  const source = readFileSync(join(repo, item.path)), copied = readFileSync(join(app, item.path))
  assert.deepEqual(source, copied, `Actual AG05 application source changed: ${item.path}`)
  assert.equal(createHash('sha256').update(copied).digest('hex'), item.sha256)
}
const requireTools = createRequire(join(process.env.A1_TOOLS_ROOT, 'package.json'))
const requireApp = createRequire(join(repo, 'package.json'))
const { chromium } = requireTools('playwright'), { default: AxeBuilder } = requireTools('@axe-core/playwright')
const { Client } = requireApp('pg'), db = new Client({ connectionString: status.DB_URL })
const secrets = [fixture.password, status.DB_URL, status.ANON_KEY, status.SERVICE_ROLE_KEY]
const invariantTables = ['despega_user_profiles', 'despega_journey_state', 'a2_user_task_completions',
  'a3_user_progress', 'a3_route_progression', 'user_gamification_profile', 'user_dtc_balance']
const sourceTables = ['dtc_outcome_observations', 'a4_verified_signals', 'a4_decision_log']
const preservedTables = [...invariantTables.map(table => `public.${table}`), ...sourceTables.map(table => `public.${table}`),
  'public.dtc_documents', 'public.a2_reviewed_plans', 'dtc_private.a2_plan_revisions',
  'dtc_private.a2_plan_receipts', 'dtc_private.a2_assistant_action_receipts']
const steps = [], accessibility = [], layouts = [], javascriptErrors = [], requestFailures = [], controlledFaults = []
const sourceChanges = [], blockedHosts = new Set(), actors = new WeakMap(), contexts = new Set(), revokedReads = new Set()
let browser, server, log, phase = 'setup', failure = null, failureScreenshot = null, revokedOwner = null
let priorSnapshot, previousOwnersPreserved = false, invalidCaptureId = null, modelRequestsFromBrowser = 0
const card = page => page.locator('[data-a2-reviewed-plan]')
const panel = page => page.locator('[data-a2-plan-evidence-review]')
const record = name => { steps.push({ phase, name, status: 'PASS' }); console.log(`AG05: ${phase}: ${name}: PASS`) }
function reviewDate() {
  const date = new Date(`${a2PlanToday()}T12:00:00Z`); date.setUTCDate(date.getUTCDate() + 7)
  return date.toISOString().slice(0, 10)
}
async function rows(tables, owners) {
  const result = {}
  for (const table of tables) result[table] = (await db.query(
    `select to_jsonb(t) as row from ${table} t where user_id::text=any($1::text[]) order by to_jsonb(t)::text`, [owners])).rows.map(row => row.row)
  return result
}
const progress = userId => rows(invariantTables.map(table => `public.${table}`), [userId])
const sources = userId => rows(sourceTables.map(table => `public.${table}`), [userId])
async function persistence(userId) {
  return (await db.query(`select
    (select coalesce(jsonb_agg(to_jsonb(t)),'[]'::jsonb) from public.a2_reviewed_plans t where user_id=$1) as slots,
    (select coalesce(jsonb_agg(to_jsonb(t) order by revision),'[]'::jsonb) from dtc_private.a2_plan_revisions t where user_id=$1) as revisions,
    (select coalesce(jsonb_agg(to_jsonb(t) order by result_revision),'[]'::jsonb) from dtc_private.a2_plan_receipts t where user_id=$1) as receipts`, [userId])).rows[0]
}
function same(actual, expected, message) { assert.deepEqual(actual, expected, message) }
async function assertSaved(userId, view, command) {
  a2PlanMutationResponseSchema.parse(view)
  const state = await persistence(userId)
  assert.equal(state.slots.length, 1); assert.equal(state.slots[0].revision, view.revision)
  assert.equal(state.slots[0].plan_id, view.plan.id)
  assert.deepEqual(state.slots[0].content, view.plan.content)
  assert.deepEqual(state.slots[0].context_snapshot, view.plan.contextSnapshot)
  assert.ok(state.receipts.some(receipt => receipt.request_id === view.receipt.requestId
    && receipt.result_revision === view.receipt.revision && receipt.result_status === view.receipt.state))
  if (command && !view.receipt.replayed) {
    assert.equal(view.revision, command.expectedRevision + 1)
    assert.equal(view.plan.contextSnapshot.hash, command.expectedContextHash)
    assert.deepEqual(view.plan.content, command.content)
    assert.deepEqual(view.plan.contextSnapshot.projection.reviewEvidence, view.context.projection.reviewEvidence)
  }
  return state
}
function checked(result, page, expectedStatus = 200) {
  assert.equal(result.status, expectedStatus, 'Actual plan API status matches the requested operation')
  assert.match(result.headers['cache-control'] || '', /no-store/)
  assert.equal(result.expectedActor, actors.get(page), 'The plan request binds its observed owner')
  assert.equal(result.headers[A2_PLAN_ACTOR_HEADER.toLowerCase()], actors.get(page), 'The plan response confirms that owner')
  if (result.status === 200) {
    if (result.command) a2PlanMutationResponseSchema.parse(result.body)
    else a2PlanViewSchema.parse(result.body)
  } else if (result.body.view) a2PlanViewSchema.parse(result.body.view)
  return result
}
function observe(page, method) {
  const waiting = page.waitForResponse(response => new URL(response.url()).pathname === planPath && response.request().method() === method)
    .then(async response => ({ status: response.status(), headers: response.headers(), body: await response.json(),
      command: method === 'POST' ? response.request().postDataJSON() : null,
      expectedActor: response.request().headers()[A2_PLAN_EXPECTED_ACTOR_HEADER.toLowerCase()] }))
  waiting.catch(() => {})
  return waiting
}
async function idle(page) { await page.locator('[data-a2-reviewed-plan][aria-busy="false"]').waitFor() }
async function clickSave(page, expectedStatus = 200) {
  const waiting = observe(page, 'POST')
  await card(page).getByRole('button', { name: 'Guardar y activar plan', exact: true }).click()
  const result = checked(await waiting, page, expectedStatus); await idle(page); return result
}
async function readPlan(page) {
  const waiting = observe(page, 'GET')
  await card(page).getByRole('button', { name: 'Volver a comprobar mi plan', exact: true }).click()
  const result = checked(await waiting, page); await idle(page); return result.body
}
async function api(page, method = 'GET', body, actor = actors.get(page), path = planPath) {
  return page.evaluate(async ({ path, method, body, actor, expected }) => {
    const response = await fetch(path, { method, credentials: 'same-origin', cache: 'no-store',
      headers: { ...(actor ? { [expected]: actor } : {}), ...(body === undefined ? {} : { 'Content-Type': 'application/json' }) },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }) })
    return { status: response.status, headers: Object.fromEntries(response.headers.entries()), body: await response.json() }
  }, { path, method, body, actor, expected: A2_PLAN_EXPECTED_ACTOR_HEADER })
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
  page.on('request', request => { if (new URL(request.url()).pathname === '/api/despega/a2-coach') modelRequestsFromBrowser++ })
  page.on('pageerror', error => javascriptErrors.push({ phase, name: error.name }))
  page.on('requestfailed', request => requestFailures.push({ phase, path: new URL(request.url()).pathname,
    method: request.method(), error: request.failure()?.errorText || 'request_failed' }))
  return page
}
async function login(page, user) {
  actors.set(page, user.id)
  await page.goto(`${base}/auth/email-login?next=${encodeURIComponent(coachPath)}`)
  await page.getByLabel('Correo electrónico', { exact: true }).fill(user.email)
  await page.getByLabel('Contraseña', { exact: true }).fill(fixture.password)
  const signedIn = page.waitForResponse(response => new URL(response.url()).pathname === '/api/auth/email-login'
    && response.request().method() === 'POST').then(response => ({ status: response.status(), cache: response.headers()['cache-control'] }))
  const initial = observe(page, 'GET')
  await page.getByRole('button', { name: 'Ingresar', exact: true }).click()
  const signed = await signedIn; assert.equal(signed.status, 200); assert.match(signed.cache || '', /no-store/)
  await page.waitForURL(url => url.pathname === coachPath)
  const view = checked(await initial, page).body
  await idle(page); await panel(page).waitFor()
  return view
}
async function fillDraft(page, purpose) {
  await card(page).getByLabel('Propósito del plan', { exact: true }).fill(purpose)
  await card(page).getByLabel('Restricciones que quieres respetar', { exact: true }).fill('Una práctica sintética de diez minutos; revisaré antes de cambiar el paso.')
  await card(page).getByLabel('Título del paso 1', { exact: true }).fill('Contrastar un intento sintético')
  await card(page).getByLabel('Qué harás en el paso 1', { exact: true }).fill('Leer mis registros y conservar una pregunta concreta para el próximo intento.')
  await card(page).getByLabel('Cuándo revisarás el plan', { exact: true }).fill(reviewDate())
}
async function openSources(page) {
  const details = panel(page).locator('details')
  if (!await details.evaluate(element => element.open)) {
    await details.locator('summary').focus(); await page.keyboard.press('Enter')
  }
  assert.equal(await details.evaluate(element => element.open), true)
}
async function visual(page, name) {
  await page.evaluate(() => document.fonts.ready)
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
  const layout = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth }))
  layouts.push({ phase, name, ...layout })
  assert.ok(layout.document <= layout.viewport + 1, `AG05 layout overflows: ${name}`)
  await page.screenshot({ path: join(evidence, `a2-review-evidence-${phase}-${name}.png`), fullPage: true })
  const scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
  const violations = scan.violations.map(item => ({ id: item.id, impact: item.impact, targets: item.nodes.map(node => node.target) }))
  accessibility.push({ phase, name, violations, incomplete: scan.incomplete.map(item => item.id) })
  assert.equal(violations.length, 0, `AG05 accessibility: ${name}`)
}
async function sourceAccess(table, revoked) {
  assert.ok(['dtc_outcome_observations', 'a4_decision_log'].includes(table))
  await db.query(`${revoked ? 'revoke select on' : 'grant select on'} public.${table} ${revoked ? 'from' : 'to'} authenticated`)
  if (revoked) revokedReads.add(table); else revokedReads.delete(table)
}
function evidenceOf(view) {
  return a2ReviewEvidenceSchema.parse(view.context?.projection.reviewEvidence)
}

try {
  await db.connect()
  priorSnapshot = await rows(preservedTables, fixture.previousOwners.map(user => user.id))
  for (const user of fixture.users) {
    const state = await persistence(user.id)
    assert.equal(state.slots.length + state.revisions.length + state.receipts.length, 0, 'AG05 owners start with no plan persistence')
  }
  log = createWriteStream(join(root, 'a2-review-evidence-server.private.log'), { mode: 0o600 })
  server = spawn(process.execPath, [join(repo, 'node_modules/next/dist/bin/next'), 'dev', '--hostname', 'localhost', '--port', String(port)], {
    cwd: app, env: { ...closureServerEnv(status), NEXT_PUBLIC_APP_URL: base }, stdio: ['ignore', 'pipe', 'pipe'],
  })
  server.stdout.pipe(log); server.stderr.pipe(log)
  let ready = false
  for (let attempt = 0; attempt < 120; attempt++) {
    assert.equal(server.exitCode, null, 'AG05 Next server stopped early')
    try { if ((await fetch(base)).ok) { ready = true; break } } catch {}
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  assert.ok(ready, 'AG05 local Next readiness timed out')
  browser = await chromium.launch({ headless: true })

  for (const viewport of viewports) {
    phase = viewport.name
    const user = fixture.users.find(user => user.label === `a2-review-evidence-${phase}`)
    const context = await newContext(viewport, viewport.ip), page = await newPage(context)
    const baseline = await progress(user.id), initialSources = await sources(user.id), empty = await persistence(user.id)
    const initial = await login(page, user), initialEvidence = evidenceOf(initial)
    assert.equal(initial.context.available, true); assert.equal(initial.revision, 0); assert.equal(initial.plan, null)
    assert.equal(initial.context.projection.practicePath, 'profesional')
    assert.equal(initial.context.projection.completedDays.length, 90)
    assert.equal(initial.context.projection.radarAvailable, true)
    assert.equal(initial.context.projection.next.href, '/despega/a4', 'Actual full progression opens A4 before evidence scenarios')
    assert.equal(initialEvidence.a3.status, 'available'); assert.equal(initialEvidence.a4.status, 'available')
    assert.equal(initialEvidence.a3.history.baseline.observationId, user.baselineId)
    assert.equal(initialEvidence.a3.history.followUp.observationId, user.followUpId)
    assert.equal(initialEvidence.a3.history.instrumentVersion, '2-capture')
    assert.equal(initialEvidence.a3.history.evaluationStatus, 'not_evaluated'); assert.equal(initialEvidence.a3.history.comparable, false)
    assert.equal(initialEvidence.a4.nextReview.id, user.openDecisionId)
    assert.equal(initialEvidence.a4.latestReview.id, user.closedDecisionId)
    assert.equal(initialEvidence.a4.latestReview.reviewClassification, 'inconclusive')
    assert.equal(JSON.stringify(initialEvidence).includes(user.legacyId), false)
    assert.equal(JSON.stringify(initialEvidence).includes('NUMERIC_V1_DECOY'), false)
    await openSources(page)
    await panel(page).getByText('Respuestas declaradas por ti; sin evaluación de capacidad.', { exact: true }).waitFor()
    await panel(page).getByText('Declaraste que la evidencia fue inconclusa.', { exact: true }).waitFor()
    assert.ok((await panel(page).innerText()).includes(user.label))
    await visual(page, 'source-review')
    const refreshed = await readPlan(page)
    assert.equal(refreshed.context.hash, initial.context.hash, 'A later read timestamp does not change the evidence fingerprint')
    same(await sources(user.id), initialSources, 'Viewing and refreshing sources are read-only')
    same(await persistence(user.id), empty, 'Viewing a suggestion cannot save a plan or receipt')
    record('real gated source read selects owner v2 captures and dated A4 decisions, excludes newer numeric v1 and performs no writes')

    await panel(page).getByRole('button', { name: 'Revisar antes de preparar mi plan', exact: true }).click()
    await fillDraft(page, `Plan de revisión sintético ${phase}`)
    const purpose = await card(page).getByLabel('Propósito del plan', { exact: true }).inputValue()
    await panel(page).getByRole('button', { name: 'Volver a mi edición', exact: true }).click()
    assert.equal(await card(page).getByLabel('Propósito del plan', { exact: true }).inputValue(), purpose)
    same(await persistence(user.id), empty, 'Explicitly opening or returning to an edit still does not write')
    await visual(page, 'editor')
    const first = await clickSave(page)
    assert.equal(first.body.receipt.replayed, false); assert.equal(first.body.revision, 1)
    await assertSaved(user.id, first.body, first.command)
    same(await sources(user.id), initialSources, 'Saving a reviewed plan cannot modify A3/A4 source evidence')
    record('only explicit confirmation saves the reviewed evidence snapshot through the existing atomic plan CAS and receipt')
    let current = first.body

    if (phase === 'desktop') {
      await panel(page).getByRole('button', { name: 'Revisar mi plan', exact: true }).click()
      const changedPurpose = 'Conservar mi edición mientras reviso el nuevo intento sintético'
      await card(page).getByLabel('Propósito del plan', { exact: true }).fill(changedPurpose)
      const before = await persistence(user.id)
      const observationId = randomUUID()
      const capture = { observationId, instrumentKey: 'a3_structured_interview', instrumentVersion: '2-capture',
        outcomeKey: 'interview_capability', measurementRole: 'follow_up', responsePayload: {
          behavioral: 'Intento sintético posterior: describí mi acción y reconocí que todavía falta verificar el resultado observado.',
          value_fit: 'Intento sintético posterior: relacioné una experiencia concreta con una necesidad, sin afirmar mejora de capacidad.',
          challenge: 'NUEVO_INTENTO_AG05 necesito practicar cómo explicar mi aporte con evidencia y revisar una duda pendiente.',
        } }
      const captured = await api(page, 'POST', capture, user.id, '/api/outcomes/observations')
      assert.equal(captured.status, 201); assert.equal(captured.body.observationId, observationId)
      assert.equal(captured.body.comparable, false); assert.equal(captured.body.normalizedDelta, null)
      const storedCapture = (await db.query('select score,confidence,response_payload from public.dtc_outcome_observations where id=$1 and user_id=$2',
        [observationId,user.id])).rows[0]
      assert.deepEqual(storedCapture, { score: null, confidence: null, response_payload: capture.responsePayload })
      sourceChanges.push({ phase, kind: 'new_a3_follow_up', transport: 'actual authenticated capture API', scored: false })
      const conflict = await clickSave(page, 409)
      assert.equal(conflict.body.code, 'plan_context_changed')
      same(await persistence(user.id), before, 'A stale source fingerprint cannot create a plan revision or receipt')
      assert.equal(await card(page).getByLabel('Propósito del plan', { exact: true }).inputValue(), changedPurpose)
      assert.equal(await card(page).getByRole('button', { name: 'Guardar y activar plan', exact: true }).isDisabled(), true)
      assert.equal(evidenceOf(conflict.body.view).a3.history.followUp.observationId, observationId)
      await visual(page, 'source-conflict')
      await card(page).getByRole('button', { name: 'Revisé los cambios y quiero conservar mi borrador', exact: true }).click()
      current = (await clickSave(page)).body
      assert.equal(current.revision, 2); assert.equal(current.plan.content.purpose, changedPurpose)
      await assertSaved(user.id, current)
      assert.equal(current.plan.contextSnapshot.projection.reviewEvidence.a3.history.followUp.observationId, observationId)
      record('a real newly captured A3 response rejects the old fingerprint, preserves edits and requires explicit re-review before saving')

      const outcome = 'La evidencia sintética me llevó a cambiar el próximo intento; no permite atribuir una mejora a DTC.'
      const reviewed = await api(page, 'PATCH', { decisionId: user.openDecisionId, status: 'reviewed', reviewOn: a2PlanToday(),
        outcome, reviewClassification: 'decision_changed', externalOutcomes: ['no_external_change'] }, user.id, '/api/a4/decisions')
      assert.equal(reviewed.status, 200); assert.equal(reviewed.body.decision.id, user.openDecisionId)
      assert.equal(reviewed.body.decision.review_classification, 'decision_changed')
      const actualDecision = (await db.query('select status,outcome,review_classification from public.a4_decision_log where id=$1 and user_id=$2',
        [user.openDecisionId,user.id])).rows[0]
      assert.deepEqual(actualDecision, { status: 'reviewed', outcome, review_classification: 'decision_changed' })
      sourceChanges.push({ phase, kind: 'a4_declared_review', transport: 'actual authenticated A4 API with server-owned write',
        externalOutcome: 'no_external_change', readerSource: 'canonical decision row; derived legacy scores are not consumed' })
      const beforeRead = await persistence(user.id), changed = await readPlan(page)
      assert.equal(changed.freshness.status, 'changed'); assert.notEqual(changed.context.hash, current.context.hash)
      const a4 = evidenceOf(changed).a4
      assert.equal(a4.nextReview, null); assert.equal(a4.latestReview.id, user.openDecisionId)
      assert.equal(a4.latestReview.outcome, outcome); assert.equal(a4.latestReview.reviewClassification, 'decision_changed')
      same(await persistence(user.id), beforeRead, 'Reading a newly reported A4 outcome does not rewrite the saved plan')
      await panel(page).getByText('Revisa lo que declaraste en Radar', { exact: true }).waitFor()
      await panel(page).getByRole('button', { name: 'Revisar mi plan', exact: true }).click()
      assert.equal(await card(page).getByRole('button', { name: 'Guardar y activar plan', exact: true }).isDisabled(), true)
      await card(page).getByRole('button', { name: 'Revisé los cambios y quiero conservar mi borrador', exact: true }).click()
      current = (await clickSave(page)).body
      assert.equal(current.revision, 3); await assertSaved(user.id, current)
      assert.equal(current.plan.contextSnapshot.projection.reviewEvidence.a4.latestReview.id, user.openDecisionId)
      await visual(page, 'reviewed-a4-plan')
      record('a real A4 review changes the dated declaration context and updates the saved snapshot only after explicit plan review')

      const beforeFault = await persistence(user.id), beforeFaultSources = await sources(user.id)
      await sourceAccess('a4_decision_log', true)
      try {
        const unavailable = await readPlan(page)
        assert.equal(unavailable.context.available, false); assert.equal(unavailable.freshness.status, 'unavailable')
        assert.equal(evidenceOf(unavailable).a4.status, 'unavailable')
        assert.equal(evidenceOf(unavailable).a4.latestReview, null)
        assert.equal(await panel(page).getByRole('button', { name: 'Revisar mi plan', exact: true }).isDisabled(), true)
        const rejected = await api(page, 'POST', { ...first.command, requestId: randomUUID(),
          expectedRevision: current.revision, expectedContextHash: current.context.hash, content: current.plan.content })
        assert.equal(rejected.status, 503); assert.equal(rejected.body.code, 'plan_context_unavailable')
        same(await persistence(user.id), beforeFault, 'Unavailable applicable evidence cannot save or silently erase the previous plan')
        same(await sources(user.id), beforeFaultSources, 'A failed source read cannot change its rows')
        await visual(page, 'source-unavailable')
        controlledFaults.push({ phase, kind: 'a4_owner_select_revoked', result: 'unavailable_not_missing', savedPlanPreserved: true })
      } finally { await sourceAccess('a4_decision_log', false) }
      const recovered = await readPlan(page)
      assert.equal(recovered.context.hash, current.context.hash); assert.equal(recovered.freshness.status, 'current')
      record('actual source permission failure is unavailable rather than empty; confirmation fails closed and recovery preserves the saved plan')

      invalidCaptureId = randomUUID()
      await db.query(`insert into public.dtc_outcome_observations(id,user_id,outcome_key,stage,measurement_role,instrument_key,
        instrument_version,score,score_scale_min,score_scale_max,dimensions,confidence,response_payload,observed_at)
        values($1,$2,'interview_capability','a3','follow_up','a3_structured_interview','2-capture',3,0,4,'{}',1,$3,clock_timestamp())`,
        [invalidCaptureId,user.id,capture.responsePayload])
      try {
        const invalid = await readPlan(page)
        assert.equal(invalid.context.available, false); assert.equal(evidenceOf(invalid).a3.status, 'unavailable')
        assert.equal(evidenceOf(invalid).a3.history, null, 'An invalid latest record cannot silently fall back to an older valid response')
        same(await persistence(user.id), beforeFault)
        controlledFaults.push({ phase, kind: 'newest_v2_capture_contains_numeric_score', result: 'unavailable_without_old_record_fallback' })
      } finally {
        await db.query('delete from public.dtc_outcome_observations where id=$1 and user_id=$2', [invalidCaptureId,user.id]); invalidCaptureId = null
      }
      assert.equal((await readPlan(page)).context.hash, current.context.hash)
      record('a newest malformed scored-v2 source blocks context instead of reviving an older valid record')
    } else {
      // A declared later local deletion is a source change. The existing numeric
      // observation remains irrelevant; no successful HTTP read is substituted.
      const beforeDeletion = await persistence(user.id)
      assert.equal((await db.query('delete from public.a4_decision_log where user_id=$1 returning id', [user.id])).rowCount, 2)
      sourceChanges.push({ phase, kind: 'a4_decisions_deleted', transport: 'declared local SQL source event', deletedRows: 2 })
      const changed = await readPlan(page)
      assert.equal(evidenceOf(changed).a4.status, 'missing'); assert.equal(changed.context.available, true)
      assert.equal(changed.freshness.status, 'changed'); assert.notEqual(changed.context.hash, current.context.hash)
      await panel(page).getByText('Contrasta tus dos registros de entrevista', { exact: true }).waitFor()
      same(await persistence(user.id), beforeDeletion, 'A missing source is reported without auto-replacing saved evidence history')
      await panel(page).getByRole('button', { name: 'Revisar mi plan', exact: true }).click()
      await card(page).getByRole('button', { name: 'Revisé los cambios y quiero conservar mi borrador', exact: true }).click()
      current = (await clickSave(page)).body
      assert.equal(current.revision, 2); await assertSaved(user.id, current)
      assert.equal(current.plan.contextSnapshot.projection.reviewEvidence.a4.status, 'missing')
      assert.equal(current.plan.contextSnapshot.projection.reviewEvidence.a3.history.comparable, false)
      await visual(page, 'reviewed-a3-plan')
      record('a real A4 source deletion is missing rather than unavailable; mobile review uses unscored A3 responses and explicitly updates the snapshot')
    }

    const beforeReplay = await persistence(user.id), currentSources = await sources(user.id)
    const replay = await api(page, 'POST', first.command)
    assert.equal(replay.status, 200); assert.equal(replay.body.receipt.replayed, true)
    assert.equal(replay.body.receipt.requestId, first.command.requestId)
    assert.equal(replay.body.revision, current.revision)
    assert.equal(replay.body.plan.contextSnapshot.hash, current.plan.contextSnapshot.hash)
    same(await persistence(user.id), beforeReplay, 'An old command receipt cannot replace a later reviewed evidence snapshot')
    const reload = observe(page, 'GET'); await page.reload()
    const reloaded = checked(await reload, page).body; await idle(page)
    assert.equal(reloaded.plan.id, current.plan.id); assert.equal(reloaded.revision, current.revision)
    assert.deepEqual(reloaded.plan.content, current.plan.content)
    assert.deepEqual(reloaded.plan.contextSnapshot, current.plan.contextSnapshot)
    assert.equal(reloaded.freshness.status, 'current')
    same(await persistence(user.id), beforeReplay, 'Reload and exact replay never append a new revision or receipt')
    same(await sources(user.id), currentSources, 'Reload and plan replay never modify source evidence')
    record('exact command replay returns the prior receipt with the current plan; reload recovers the reviewed snapshot without new writes')
    same(await progress(user.id), baseline, 'Evidence review cannot change canonical progress, completions, XP or balance')
    record('all review and persistence operations preserve complete snapshots of seven canonical progress tables')
    await context.close(); contexts.delete(context)
  }

  phase = 'access'
  const personal = fixture.users.find(user => user.label.endsWith('-persona'))
  const locked = fixture.users.find(user => user.label.endsWith('-locked'))
  const personalContext = await newContext(viewports[0], 202), personalPage = await newPage(personalContext)
  const lockedContext = await newContext(viewports[0], 203), lockedPage = await newPage(lockedContext)
  await lockedPage.goto(`${base}/auth/email-login`)
  assert.equal((await api(lockedPage, 'GET', undefined, locked.id)).status, 401)
  const personalProgress = await progress(personal.id), lockedProgress = await progress(locked.id)
  const personalSources = await sources(personal.id), lockedSources = await sources(locked.id)
  const personalInitial = await login(personalPage, personal), lockedInitial = await login(lockedPage, locked)
  assert.equal(personalInitial.context.projection.practicePath, 'persona')
  assert.equal(personalInitial.context.projection.completedDays.length, 90)
  assert.equal(evidenceOf(personalInitial).a3.status, 'not_applicable'); assert.equal(evidenceOf(personalInitial).a4.status, 'not_applicable')
  assert.equal(lockedInitial.context.projection.radarAvailable, false)
  assert.equal(lockedInitial.context.projection.completedDays.length, 0)
  assert.equal(evidenceOf(lockedInitial).a3.status, 'locked'); assert.equal(evidenceOf(lockedInitial).a4.status, 'locked')
  const personalPlans = await persistence(personal.id), lockedPlans = await persistence(locked.id)
  await sourceAccess('dtc_outcome_observations', true); await sourceAccess('a4_decision_log', true)
  try {
    for (const [page, initial] of [[personalPage, personalInitial], [lockedPage, lockedInitial]]) {
      const read = await api(page)
      assert.equal(read.status, 200); assert.equal(read.body.context.available, true)
      assert.equal(read.body.context.hash, initial.context.hash)
      assert.deepEqual(evidenceOf(read.body), evidenceOf(initial), 'Skipped sources remain untouched even when both SELECTs would fail')
      const serialized = JSON.stringify(evidenceOf(read.body))
      for (const user of fixture.users) assert.equal(serialized.includes(user.followUpId), false)
    }
    controlledFaults.push({ phase, kind: 'both_professional_source_selects_revoked',
      personalResult: 'not_applicable', lockedResult: 'locked', contextStillAvailable: true })
  } finally { for (const table of [...revokedReads]) await sourceAccess(table, false) }
  same(await sources(personal.id), personalSources); same(await sources(locked.id), lockedSources)
  same(await persistence(personal.id), personalPlans); same(await persistence(locked.id), lockedPlans)
  same(await progress(personal.id), personalProgress); same(await progress(locked.id), lockedProgress)
  record('personal and A3/A4-locked paths skip both professional source reads despite stored decoys and revoked SELECT, without any writes')

  const command = a2PlanCommandSchema.parse({ version: 'dtc-a2-plan-command.v1', requestId: randomUUID(), operation: 'save',
    expectedRevision: 0, expectedContextHash: lockedInitial.context.hash, content: { version: 'dtc-a2-plan.v1',
      purpose: 'Plan sintético que no debe guardarse sin acceso', constraints: '', reviewDate: reviewDate(),
      steps: [{ id: randomUUID(), title: 'Revisar', action: 'Comprobar el acceso antes de guardar una acción sintética.', status: 'pending' }] } })
  for (const response of [await api(lockedPage, 'GET', undefined, personal.id), await api(lockedPage, 'POST', command, personal.id)]) {
    assert.equal(response.status, 409); assert.equal(response.body.code, 'session_changed')
    assert.equal(response.body.view, undefined)
  }
  assert.equal((await db.query('delete from public.pilot_memberships where user_id=$1 returning id', [locked.id])).rowCount, 1)
  revokedOwner = locked.id
  for (const response of [await api(lockedPage), await api(lockedPage, 'POST', command)]) {
    assert.equal(response.status, 403); assert.equal(response.body.code, 'pilot_access_unavailable')
    assert.equal(response.body.view, undefined)
  }
  same(await persistence(locked.id), lockedPlans); same(await sources(locked.id), lockedSources)
  same(await progress(locked.id), lockedProgress)
  record('actual Auth, wrong expected actor and revoked pilot access reject personal context and plan writes without side effects')
  same(await rows(preservedTables, fixture.previousOwners.map(user => user.id)), priorSnapshot,
    'AG05 must preserve every prior phase owner source, progress, plan and receipt')
  previousOwnersPreserved = true
  assert.equal(javascriptErrors.length, 0, 'Unexpected JavaScript errors in actual AG05 UI')
  assert.equal(blockedHosts.size, 0, 'AG05 laboratory attempted an external request')
  assert.equal(modelRequestsFromBrowser, 0, 'This real persistence phase must not call generation')
} catch (error) {
  failure = safeFailure(error, secrets)
  const page = [...contexts].flatMap(context => context.pages()).reverse().find(page => !page.isClosed() && page.url().startsWith(base + '/'))
  if (page) {
    const name = `a2-review-evidence-${phase}-failure.png`
    try { await page.screenshot({ path: join(evidence, name), fullPage: true }); failureScreenshot = name } catch {}
  }
  console.error('AG05 browser acceptance failed:', failure); process.exitCode = 1
} finally {
  for (const context of contexts) await context.close().catch(() => {})
  await browser?.close().catch(() => {})
  try {
    for (const table of [...revokedReads]) await sourceAccess(table, false)
    if (invalidCaptureId) await db.query('delete from public.dtc_outcome_observations where id=$1', [invalidCaptureId])
    if (revokedOwner) await db.query("insert into public.pilot_memberships(user_id,access_kind) values($1,'grandfathered') on conflict(user_id) do nothing", [revokedOwner])
    if (priorSnapshot && !previousOwnersPreserved) {
      same(await rows(preservedTables, fixture.previousOwners.map(user => user.id)), priorSnapshot)
      previousOwnersPreserved = true
    }
  } catch (error) { failure ||= safeFailure(error, secrets); process.exitCode = 1 }
  await db.end().catch(() => {})
  if (server && server.exitCode === null) {
    const ended = once(server, 'exit'); server.kill('SIGTERM')
    const timer = setTimeout(() => server?.kill('SIGKILL'), 5000)
    await ended; clearTimeout(timer)
  }
  log?.end()
  writeFileSync(join(evidence, 'a2-review-evidence-browser-results.json'), JSON.stringify({
    commit: process.env.A1_SOURCE_COMMIT, scope: manifest.environment, verdict: failure ? 'FAIL' : 'PASS',
    steps, accessibility, layouts, javascriptErrors, blockedHosts: [...blockedHosts], requestFailures,
    controlledFaults, sourceChanges, progressTablesCompared: invariantTables, previousOwnersPreserved,
    previousOwnersCompared: fixture.previousOwners.length, generationResponsesSubstituted: 0, modelRequestsFromBrowser,
    transport: 'Actual UI, email Auth, plan and source APIs, owner RLS and PostgreSQL. Synthetic source fixtures and declared local faults only; no successful response is mocked.',
    notVerified: manifest.notVerified, failure, failureScreenshot,
  }, null, 2))
}
