import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve, sep } from 'node:path'
import { buildUi, loadTool, repository } from './build.mjs'
import { assertNoOverflow, auditAccessibility, launchBrowser, openExperience, syntheticBackend } from './browser.mjs'
import { DUE_FOLLOWUP_ID, FIXTURE_DATE, FIXTURE_NOW, SYNTHETIC_BENCHMARK } from './fixtures.ts'

const commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repository, encoding: 'utf8' }).trim()
const workingTreeDirty = execFileSync('git', ['status', '--porcelain', '--untracked-files=normal'], { cwd: repository, encoding: 'utf8' }).trim().length > 0
const output = resolve(process.env.DTC_OUTCOMES_UI_EVIDENCE_ROOT ?? join(tmpdir(), `dtc-outcomes-ui-${commit.slice(0, 8)}-${Date.now()}`))
assert.ok(!output.startsWith(repository + sep), 'Generated browser evidence must remain outside the source checkout')
mkdirSync(output, { recursive: true })
const assets = await buildUi()
let browserVersion = null
let infrastructureError = null
const cases = []
const screenshots = []
const accessibility = []
const MOBILE = { width: 390, height: 844 }
const DESKTOP = { width: 1440, height: 960 }

async function ready(page) {
  await page.getByRole('heading', { name: 'Mis resultados laborales', exact: true }).waitFor({ state: 'visible' })
  await page.getByRole('tab', { name: 'Ingreso', exact: true }).waitFor({ state: 'visible' })
  await page.evaluate(() => document.fonts.ready)
}

async function incomeForm(page) {
  await page.getByRole('tab', { name: 'Ingreso', exact: true }).click()
  const form = page.getByRole('form', { name: 'Registrar ingreso', exact: true })
  await form.waitFor({ state: 'visible' })
  return form
}

async function saved(page) {
  await page.getByRole('status').filter({ hasText: 'Registro guardado. Ya puedes revisar tu avance.' }).waitFor({ state: 'visible' })
}

function metric(page, name) {
  return page.getByRole('heading', { name, exact: true }).locator('..').locator('..')
}

async function shot(page, name) {
  const path = join(output, name + '.png')
  await page.locator('#main-content').screenshot({ path, animations: 'disabled' })
  screenshots.push({ name, path, viewport: page.viewportSize(), captured: 'actual-content-with-authenticated-shell-substituted' })
}

async function runCase(name, scenario, options, test, viewport = MOBILE) {
  // The packaged headless shell uses a single process; closing a context can
  // close that process. A fresh browser also isolates every in-memory retry key.
  const browser = await launchBrowser()
  browserVersion = browser.version()
  const backend = syntheticBackend(scenario, options)
  let view
  const start = Date.now()
  try {
    view = await openExperience(browser, assets, backend, viewport)
    await test(view.page, backend, view)
    assert.deepEqual(view.errors, [], 'uncaught browser runtime errors')
    assert.deepEqual(view.blocked, [], 'experience attempted an external request')
    const overflow = await assertNoOverflow(view.page)
    cases.push({ name, verdict: 'PASS', viewport, milliseconds: Date.now() - start, writes: backend.requests.length, acceptedSyntheticWrites: backend.accepted.size, reads: backend.reads.length, overflow })
    console.log(`PASS ${name}`)
  } catch (error) {
    try { if (view) await shot(view.page, 'failure-' + name) } catch { /* Preserve the original failure if screenshot also fails. */ }
    cases.push({ name, verdict: 'FAIL', viewport, error: error.message, browserErrors: view?.errors ?? [], blockedRequests: view?.blocked ?? [], consoleErrors: view?.transportErrors ?? [] })
    console.error(`FAIL ${name}: ${error.message}`)
  } finally {
    await browser.close()
  }
}

try {
  await runCase('mobile-render-keyboard-focus', 'populated', {}, async (page) => {
    await ready(page)
    assert.match(await metric(page, 'Cambio mensual observado').innerText(), /\+\$200\.000/)
    await shot(page, 'mobile-overview')
    await page.getByRole('button', { name: 'Registrar un resultado', exact: true }).focus()
    await page.keyboard.press('Enter')
    assert.equal(await page.evaluate(() => document.activeElement.id), 'outcome-capture-title')
    await page.keyboard.press('Tab')
    assert.equal(await page.evaluate(() => document.activeElement.getAttribute('role')), 'tab')
    await page.keyboard.press('ArrowRight')
    await page.getByRole('tab', { name: 'Trabajo', exact: true, selected: true }).waitFor()
    assert.equal(await page.getByRole('tab', { name: 'Trabajo', exact: true }).getAttribute('aria-selected'), 'true')
    await page.keyboard.press('ArrowRight')
    await page.getByRole('tab', { name: 'Ingreso', exact: true, selected: true }).waitFor()
    assert.equal(await page.getByRole('tab', { name: 'Ingreso', exact: true }).getAttribute('aria-selected'), 'true')
    const focus = await page.evaluate(() => {
      const style = getComputedStyle(document.activeElement)
      return { style: style.outlineStyle, width: parseFloat(style.outlineWidth), shadow: style.boxShadow }
    })
    assert.ok(focus.style !== 'none' && focus.width >= 2, `keyboard focus is not visibly outlined: ${JSON.stringify(focus)}`)
    await shot(page, 'mobile-income-keyboard-focus')
    const axe = await auditAccessibility(page)
    accessibility.push({ case: 'mobile-render-keyboard-focus', ...axe })
    assert.deepEqual(axe.violations, [], 'mobile accessibility violations')
  })

  await runCase('desktop-render-accessibility', 'populated', { benchmark: SYNTHETIC_BENCHMARK }, async (page, backend) => {
    await ready(page)
    const heading = await page.getByRole('heading', { name: 'Mis resultados laborales', exact: true }).boundingBox()
    assert.ok(heading.width > 0 && heading.x >= 288, 'desktop content must reserve the real sidebar width')
    const reference = page.getByRole('region', { name: 'Una referencia de Chile', exact: true })
    assert.match(await reference.innerText(), /\$765\.432/)
    for (const label of ['Fuente', 'Período observado', 'Publicado', 'Información disponible al', 'Cobertura de la referencia', 'Nacional', 'Muestra publicada', 'No informada']) {
      await reference.getByText(label, { exact: true }).waitFor()
    }
    assert.match(await reference.innerText(), /referencia sintética, sin publicación real; no citar/)
    assert.match(await reference.innerText(), /no calculamos una brecha salarial/)
    assert.equal(backend.summary().impact.delta.versusBenchmark.comparable, false)
    await shot(page, 'desktop-overview')
    const axe = await auditAccessibility(page)
    accessibility.push({ case: 'desktop-render-accessibility', ...axe })
    assert.deepEqual(axe.violations, [], 'desktop accessibility violations')
  }, DESKTOP)

  await runCase('loading-503-empty-retry', 'empty', { readSteps: [{ delayMs: 700, status: 503, body: { error: 'Synthetic unavailable' } }] }, async (page, backend) => {
    await page.getByRole('heading', { name: 'Preparando tus resultados…', exact: true }).waitFor({ state: 'visible' })
    await page.getByRole('heading', { name: 'Tus resultados no están disponibles ahora', exact: true }).waitFor({ state: 'visible' })
    await shot(page, 'mobile-read-unavailable')
    await page.getByRole('button', { name: 'Reintentar', exact: true }).click()
    await ready(page)
    await page.getByRole('heading', { name: 'Tu primer registro abre este recorrido', exact: true }).waitFor({ state: 'visible' })
    assert.equal(backend.reads.length, 2)
    assert.equal(backend.requests.length, 0)
    await shot(page, 'mobile-empty')
  })

  for (const [name, expected, explanation] of [
    ['zero', /\+\$800\.000/, /Tu ingreso inicial fue \$0/],
    ['negative', /\$-200\.000/, /-16,7%/],
    ['ambiguous', /Por completar/, /Hay ingresos distintos para la última fecha/],
  ]) {
    await runCase('salary-' + name, name, {}, async (page) => {
      await ready(page)
      const text = await metric(page, 'Cambio mensual observado').innerText()
      assert.match(text, expected)
      assert.match(text, explanation)
      assert.doesNotMatch(text, /NaN|Infinity|undefined/)
      if (name === 'ambiguous') {
        const latest = await metric(page, 'Último ingreso registrado').innerText()
        assert.match(latest, /Por revisar/)
        assert.doesNotMatch(latest, /Sin registro/)
      }
      await shot(page, 'mobile-salary-' + name)
    })
  }

  await runCase('empty-income-invalid-and-explicit-zero', 'empty', {}, async (page, backend) => {
    await ready(page)
    const form = await incomeForm(page)
    const amount = form.getByLabel('Ingreso líquido mensual (CLP)', { exact: true })
    await form.getByRole('button', { name: 'Guardar ingreso', exact: true }).click()
    assert.equal(await amount.evaluate((input) => input.validity.valueMissing), true)
    assert.equal(backend.requests.length, 0)
    await amount.fill('-1')
    await form.getByRole('button', { name: 'Guardar ingreso', exact: true }).click()
    assert.equal(await amount.evaluate((input) => input.validity.rangeUnderflow), true)
    assert.equal(backend.requests.length, 0)
    await amount.fill('0')
    await form.getByRole('button', { name: 'Guardar ingreso', exact: true }).click()
    await saved(page)
    assert.equal(backend.requests[0].monthlyNetClp, 0)
    assert.equal(typeof backend.requests[0].monthlyNetClp, 'number')
    assert.equal(backend.evidence.salary.length, 1)
    await form.getByRole('button', { name: 'Registrar otro ingreso', exact: true }).click()
    assert.equal(await amount.inputValue(), '')
    assert.equal(backend.requests.length, 1, 'starting another record must not submit the cleared form')
    assert.equal(await page.evaluate(() => document.activeElement.id), 'outcome-salary-type')
  })

  await runCase('lost-response-double-click-idempotent-retry', 'empty', { writeSteps: [{ delayMs: 400, commitThenAbort: true }, { delayMs: 200 }] }, async (page, backend) => {
    await ready(page)
    const form = await incomeForm(page)
    const amount = form.getByLabel('Ingreso líquido mensual (CLP)', { exact: true })
    await amount.fill('850000')
    await form.getByLabel('Fecha de este ingreso', { exact: true }).fill('2026-08-01')
    await form.getByRole('button', { name: 'Guardar ingreso', exact: true }).evaluate((button) => { button.click(); button.click() })
    const error = form.getByRole('alert')
    await error.waitFor({ state: 'visible' })
    assert.equal(await error.evaluate((element) => document.activeElement === element), true, 'error notice should receive focus')
    assert.equal(await amount.inputValue(), '850000')
    assert.equal(backend.requests.length, 1, 'the synchronous submit lock must prevent two requests')
    assert.equal(backend.accepted.size, 1)
    await page.getByRole('tab', { name: 'Trabajo', exact: true }).click()
    await page.getByRole('tab', { name: 'Ingreso', exact: true }).click()
    assert.equal(await amount.inputValue(), '850000', 'switching forms must retain draft data')
    await shot(page, 'mobile-unconfirmed-write')
    await form.getByRole('button', { name: 'Reintentar: guardar ingreso', exact: true }).click()
    await saved(page)
    assert.equal(backend.requests.length, 2)
    assert.equal(backend.requests[0].requestId, backend.requests[1].requestId, 'the retry must reuse its request ID')
    assert.deepEqual(backend.requests[0], backend.requests[1])
    assert.equal(backend.accepted.size, 1)
    assert.equal(backend.evidence.salary.length, 1, 'one committed synthetic measurement after a lost response and retry')
  })

  await runCase('refresh-503-retains-employment-draft', 'populated', { readSteps: [{}, { status: 503, body: { error: 'Synthetic unavailable' } }, {}] }, async (page, backend) => {
    await ready(page)
    await page.getByRole('tab', { name: 'Trabajo', exact: true }).click()
    const form = page.getByRole('form', { name: 'Registrar trabajo', exact: true })
    await form.getByLabel('Nombre del cargo', { exact: true }).fill('Coordinador de proyectos · borrador')
    await form.getByLabel('Fecha en que comenzó', { exact: true }).fill('2026-09-15')
    await page.getByRole('button', { name: 'Actualizar', exact: true }).click()
    await page.getByRole('alert').filter({ hasText: 'No pudimos actualizar tus resultados.' }).waitFor({ state: 'visible' })
    assert.equal(await form.getByLabel('Nombre del cargo', { exact: true }).inputValue(), 'Coordinador de proyectos · borrador')
    assert.equal(await form.getByLabel('Fecha en que comenzó', { exact: true }).inputValue(), '2026-09-15')
    await page.getByRole('button', { name: 'Reintentar consulta', exact: true }).click()
    await page.getByRole('alert').filter({ hasText: 'No pudimos actualizar tus resultados.' }).waitFor({ state: 'hidden' })
    assert.equal(await form.getByLabel('Nombre del cargo', { exact: true }).inputValue(), 'Coordinador de proyectos · borrador')
    assert.equal(backend.requests.length, 0)
  })

  await runCase('write-503-retains-key-and-draft', 'empty', { writeSteps: [{ status: 503 }, {}] }, async (page, backend) => {
    await ready(page)
    const form = await incomeForm(page)
    await form.getByLabel('Ingreso líquido mensual (CLP)', { exact: true }).fill('975000')
    await form.getByRole('button', { name: 'Guardar ingreso', exact: true }).click()
    await form.getByRole('alert').filter({ hasText: 'El servicio no está disponible' }).waitFor({ state: 'visible' })
    assert.equal(await form.getByLabel('Ingreso líquido mensual (CLP)', { exact: true }).inputValue(), '975000')
    await form.getByRole('button', { name: 'Reintentar: guardar ingreso', exact: true }).click()
    await saved(page)
    assert.equal(backend.requests[0].requestId, backend.requests[1].requestId)
    assert.equal(backend.accepted.size, 1)
  })

  await runCase('expired-session-hides-personal-data-and-retains-memory', 'populated', { writeSteps: [{ status: 401, body: { error: 'No autenticado' } }] }, async (page, backend) => {
    await ready(page)
    const form = await incomeForm(page)
    await form.getByLabel('Ingreso líquido mensual (CLP)', { exact: true }).fill('975000')
    await form.getByRole('button', { name: 'Guardar ingreso', exact: true }).click()
    await page.getByRole('heading', { name: 'Vuelve a ingresar para continuar', exact: true }).waitFor({ state: 'visible' })
    assert.equal(await page.locator('#outcome-salary-amount').isVisible(), false)
    assert.equal(await page.locator('#outcome-salary-amount').inputValue(), '975000')
    assert.equal(await page.getByRole('heading', { name: 'Tu evolución registrada', exact: true }).count(), 0)
    const login = page.getByRole('link', { name: 'Volver a ingresar', exact: true })
    assert.equal(await login.getAttribute('href'), '/auth/signin?next=%2Fdespega%2Fresultados-laborales')
    assert.equal(backend.accepted.size, 0)
    await shot(page, 'mobile-expired-session')
  })

  await runCase('followup-required-answers-and-single-completion', 'populated', { writeSteps: [{ delayMs: 300 }] }, async (page, backend) => {
    await ready(page)
    assert.equal(await page.getByRole('button', { name: /^Responder seguimiento/ }).count(), 1)
    await page.getByRole('button', { name: /^Responder seguimiento de 90 días/ }).click()
    const form = page.getByRole('form', { name: /^Responder seguimiento de 90 días/ })
    await form.getByRole('button', { name: 'Guardar seguimiento', exact: true }).click()
    assert.equal(backend.requests.length, 0)
    await form.getByLabel('¿Sigues trabajando en este empleo?', { exact: true }).selectOption('yes')
    await form.getByLabel('¿Sigues en el mismo cargo? (opcional)', { exact: true }).selectOption('no')
    await form.getByRole('button', { name: 'Guardar seguimiento', exact: true }).evaluate((button) => { button.click(); button.click() })
    await page.getByText('Con un cambio de cargo.', { exact: true }).waitFor({ state: 'visible' })
    assert.equal(backend.requests.length, 1)
    assert.equal(backend.requests[0].followupId, DUE_FOLLOWUP_ID)
    assert.equal(backend.requests[0].employmentActive, true)
    assert.equal(backend.requests[0].sameRole, false)
    assert.equal(await page.getByRole('button', { name: /^Responder seguimiento/ }).count(), 0)
    assert.equal(await page.evaluate(() => document.activeElement.id), `followup-heading-${DUE_FOLLOWUP_ID}`)
    await shot(page, 'mobile-followup-completed')
  })

  await runCase('followup-unspecified-role-is-not-inferred', 'populated', {}, async (page, backend) => {
    await ready(page)
    await page.getByRole('button', { name: /^Responder seguimiento de 90 días/ }).click()
    const form = page.getByRole('form', { name: /^Responder seguimiento de 90 días/ })
    const active = form.getByLabel('¿Sigues trabajando en este empleo?', { exact: true })
    assert.equal(await active.evaluate((element) => document.activeElement === element), true)
    await active.selectOption('yes')
    const sameRole = form.getByLabel('¿Sigues en el mismo cargo? (opcional)', { exact: true })
    assert.equal(await sameRole.inputValue(), '')
    await form.getByRole('button', { name: 'Guardar seguimiento', exact: true }).click()
    const completed = page.getByRole('heading', { name: 'Seguimiento de 90 días', exact: true }).locator('xpath=ancestor::li')
    await completed.getByText('Respondido', { exact: true }).waitFor()
    assert.equal(backend.requests[0].employmentActive, true)
    assert.equal(backend.requests[0].sameRole, null, 'an omitted optional answer must remain unknown')
    assert.equal(await completed.getByText('En el mismo cargo.', { exact: true }).count(), 0)
    assert.equal(await completed.getByText('Con un cambio de cargo.', { exact: true }).count(), 0)
  })

  await runCase('future-date-and-needs-review-are-not-capturable', 'needs_review', {}, async (page, backend) => {
    await ready(page)
    await page.getByText('Requiere revisión', { exact: true }).waitFor({ state: 'visible' })
    assert.equal(await page.getByRole('button', { name: /^Responder seguimiento/ }).count(), 0)
    await page.getByRole('tab', { name: 'Trabajo', exact: true }).click()
    const form = page.getByRole('form', { name: 'Registrar trabajo', exact: true })
    const date = form.getByLabel('Fecha en que comenzó', { exact: true })
    assert.equal(await date.getAttribute('max'), FIXTURE_DATE)
    await date.fill('2026-10-08')
    await form.getByLabel('Nombre del cargo', { exact: true }).fill('Cargo futuro de prueba')
    await form.getByRole('button', { name: 'Guardar trabajo', exact: true }).click()
    assert.equal(await date.evaluate((input) => input.validity.rangeOverflow), true)
    assert.equal(backend.requests.length, 0)
  })

  await runCase('event-timezone-future-validation-and-new-record-focus', 'empty', {}, async (page, backend) => {
    await ready(page)
    const form = page.getByRole('form', { name: 'Registrar evento de búsqueda', exact: true })
    const date = form.getByLabel('Fecha y hora', { exact: true })
    assert.equal(await date.inputValue(), '2026-10-07T10:00')
    await date.fill('2026-10-08T10:00')
    await form.getByRole('button', { name: 'Guardar evento', exact: true }).click()
    await form.getByRole('alert').filter({ hasText: 'La fecha y hora están en el futuro.' }).waitFor({ state: 'visible' })
    assert.equal(backend.requests.length, 0)
    await date.fill('2026-10-07T09:45')
    await form.getByRole('button', { name: 'Guardar evento', exact: true }).click()
    await saved(page)
    assert.equal(backend.requests[0].occurredAt, '2026-10-07T12:45:00.000Z')
    await form.getByRole('button', { name: 'Registrar otro evento', exact: true }).click()
    assert.equal(await page.evaluate(() => document.activeElement.id), 'outcome-event-type')
    assert.equal(backend.requests.length, 1, 'starting a new event must not auto-submit a second event')
  })
} catch (error) {
  infrastructureError = error.message
  console.error(`FAIL laboratory infrastructure: ${error.message}`)
} finally {
  const verdict = infrastructureError || cases.length === 0 || cases.some((entry) => entry.verdict === 'FAIL') ? 'NO_GO' : 'GO'
  const report = {
    verdict, commit, workingTreeDirty, sourceRevision: { baseCommit: commit, dirty: workingTreeDirty },
    generatedAt: new Date().toISOString(), fixtureComputedAt: FIXTURE_NOW,
    infrastructureError,
    environment: 'isolated-Chromium-local-intercepted-transport',
    versions: { ...assets.versions, chromium: browserVersion, playwright: loadTool('playwright/package.json').version, axe: loadTool('axe-core').version },
    fontMode: assets.fontMode, sourceHashes: assets.sourceHashes, cases, accessibility, screenshots,
    genuine: ['actual client experience and child components', 'actual form state and request/session code', 'real React DOM in Chromium', 'globals.css and design-system.css in application order', 'impact/workspace builders used for synthetic API fixtures', 'native form validation, keyboard focus and accessibility tree'],
    substituted: ['authenticated application shell', 'API responses, persisted rows and request replay cache are synthetic', 'fixed browser clock and Santiago timezone', 'no production environment variables'],
    notVerified: ['production authentication and redirects', 'real database persistence or RPC idempotency', 'deployment integration', ...(assets.fontMode === 'Arial-system-fallback' ? ['production Montserrat font metrics'] : [])],
  }
  writeFileSync(join(output, 'report.json'), JSON.stringify(report, null, 2))
  console.log(JSON.stringify({ outcomesChileUi: verdict, cases: cases.length, passed: cases.filter((entry) => entry.verdict === 'PASS').length, report: join(output, 'report.json'), screenshots: screenshots.length, fontMode: assets.fontMode }))
  if (verdict !== 'GO') process.exitCode = 1
}
