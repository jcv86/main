/** Actual AppShell, chat/plan components and CSS; synthetic Auth and plan HTTP.
 * Focuses on evidence provenance, preserved edits and pending commands.
 * This does not certify SQL, RLS, real Auth, a model or participant usefulness.
 */
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { createServer } from 'node:http'
import { createRequire } from 'node:module'
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { buildJourneyFlow } from '../lib/journey/flow.ts'
import { buildGuidedNextAction } from '../lib/journey/next-action.ts'
import { a2PlanToday, a2PlanCommandSchema, a2PlanContentSchema, a2PlanViewSchema, a2PlanMutationResponseSchema,
  buildA2PlanContextProjection, assessA2PlanFreshness } from '../lib/a2/plan-contract.ts'
import { a2ReviewEvidenceSchema } from '../lib/a2/review-evidence-contract.ts'

assert.equal(process.env.DTC_AGENTIC_BROWSER_LAB, 'yes', 'Run only in a disposable synthetic fixture')
const root = process.cwd(), repoRequire = createRequire(join(root, 'package.json'))
const toolsRoot = process.env.DTC_AGENTIC_BROWSER_TOOLS
const toolRequire = toolsRoot ? createRequire(join(resolve(toolsRoot), 'package.json')) : repoRequire
const playwright = toolRequire('playwright'), esbuild = repoRequire('esbuild')
const work = mkdtempSync(join(tmpdir(), 'dtc-plan-evidence-ui-'))
const output = resolve(process.env.DTC_AGENTIC_QA_OUTPUT || work)
mkdirSync(output, { recursive: true })
const USER = '00000000-0000-4000-8000-000000000001', OTHER = '00000000-0000-4000-8000-000000000002'
const PLAN = '00000000-0000-4000-8000-000000000701'
const BASELINE = '00000000-0000-4000-8000-000000000801', FOLLOW_UP = '00000000-0000-4000-8000-000000000802'
const DECISION = '00000000-0000-4000-8000-000000000901', SIGNAL = '00000000-0000-4000-8000-000000000902'
const today = a2PlanToday()
const date = offset => { const d = new Date(`${today}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + offset); return d.toISOString().slice(0, 10) }
const instant = offset => `${date(offset)}T12:00:00.000000Z`
const hash = value => createHash('sha256').update(value).digest('hex')
const checks = [], accessibility = [], runtimeErrors = [], externalRequests = [], screenshots = []
const check = (name, condition) => { assert.ok(condition, name); checks.push(name) }
const deferred = () => { let resolve; const promise = new Promise(done => { resolve = done }); return { promise, resolve } }
const sourcePaths = ['components/a2-plan-evidence-review.tsx', 'components/a2-reviewed-plan.tsx', 'components/a2-chat-coach.tsx',
  'components/a2-assistant-action.tsx', 'components/layout/app-shell.tsx', 'lib/a2/plan-contract.ts',
  'lib/a2/review-evidence-contract.ts', 'app/globals.css', 'app/design-system.css', 'tailwind.config.ts',
  'scripts/test-a2-plan-review-evidence-ui.mjs']
const sourceHashes = () => sourcePaths.map(path => ({ path, sha256: hash(readFileSync(join(root, path))) }))
let browser, server, browserVersion, sourcesAtBuild

function evidence(variant = 'recorded') {
  const payload = {
    behavioral: 'Conservé una experiencia concreta de mi proyecto y distinguí lo que hice personalmente.',
    value_fit: 'Quiero explicar con hechos mi aporte al rol que estoy explorando actualmente.',
    challenge: 'Necesito ordenar mi ejemplo y reconocer qué resultado todavía no puedo confirmar.',
  }
  const baseline = { observationId: BASELINE, observedAt: instant(-4), measurementRole: 'baseline', responsePayload: payload }
  const followUp = { observationId: FOLLOW_UP, observedAt: instant(-2), measurementRole: 'follow_up',
    responsePayload: { ...payload, challenge: 'Ahora quiero revisar una idea concreta sin inventar cifras ni prometer un resultado externo.' } }
  const history = { instrumentKey: 'a3_structured_interview', instrumentVersion: '2-capture', baseline, followUp,
    pairStatus: 'available', evaluationStatus: 'not_evaluated', comparable: false }
  const decision = { id: DECISION, signalId: SIGNAL, decision: 'Probar una conversación breve para contrastar mi supuesto.',
    rationale: 'Quiero contar con una observación concreta antes de cambiar el siguiente paso de mi plan.',
    expectedEvidence: 'Una respuesta que permita confirmar o descartar el supuesto que anoté.',
    status: 'reviewed', reviewOn: date(-3), outcome: 'Registré que la evidencia fue inconclusa y todavía necesito contrastar mi supuesto.',
    reviewedAt: instant(-1), reviewClassification: 'inconclusive', externalOutcomes: ['no_external_change'],
    createdAt: instant(-5), updatedAt: instant(-1) }
  const value = { version: 'dtc-a2-review-evidence.v1', a3: { status: 'available', history },
    a4: { status: 'available', nextReview: null, latestReview: decision } }
  if (variant === 'changed' || variant === 'later') {
    value.a4.latestReview = { ...decision, updatedAt: `${date(-1)}T12:00:00.00000${variant === 'changed' ? 1 : 2}Z`,
      outcome: variant === 'changed' ? 'CAMBIO DE FUENTE: decidí contrastar otra observación antes de continuar.' : 'CAMBIO POSTERIOR: conservaré el resultado anterior y revisaré una nueva pregunta.' }
  }
  if (variant === 'unavailable') value.a3 = { status: 'unavailable', history: null }
  if (variant === 'missing-locked') {
    value.a3 = { status: 'missing', history: { ...history, baseline: null, followUp: null, pairStatus: 'empty' } }
    value.a4 = { status: 'locked', nextReview: null, latestReview: null }
  }
  if (variant === 'personal') {
    value.a3 = { status: 'not_applicable', history: null }
    value.a4 = { status: 'not_applicable', nextReview: null, latestReview: null }
  }
  return a2ReviewEvidenceSchema.parse(value)
}

function fixture(value = evidence(), personal = false) {
  const flow = buildJourneyFlow({
    profile: { camino_foco: personal ? 'persona' : 'profesional', onboarding_conozcamonos_1_completed: true,
      a1_cerebral_intro_seen: true, a1_cerebral_completed: true, conozcamonos_2_completed: true, a1_report_seen: true, a2_intro_seen: true },
    access: { a1: true, a2: true, a3: true, a4: true }, currentModule: 'A2', highestA2DayUnlocked: 3,
    completedA2Days: [1, 2], completedA3Modules: [], a3RouteClosed: false,
  })
  const guidance = buildGuidedNextAction(flow, { objective: { status: 'missing' }, adjustment: { status: 'missing' } })
  const projected = buildA2PlanContextProjection(flow, guidance, value)
  const context = { version: 'dtc-a2-plan-context.v1', capturedAt: new Date().toISOString(), ...projected,
    hash: hash(JSON.stringify(projected.projection)) }
  return { flow, guidance, context }
}

async function prepare() {
  sourcesAtBuild = sourceHashes()
  const stubs = {
    '@/lib/supabase/client': `const callbacks=new Set();const state={userId:${JSON.stringify(USER)},
      emit(userId){this.userId=userId;for(const callback of callbacks)callback(userId?'SIGNED_IN':'SIGNED_OUT',userId?{user:{id:userId}}:null)}};
      window.__reviewAuth=state;const client={auth:{getUser:async()=>({data:{user:state.userId?{id:state.userId,email:'synthetic-review@example.test'}:null},error:null}),
      onAuthStateChange(callback){callbacks.add(callback);queueMicrotask(()=>{if(callbacks.has(callback))callback('INITIAL_SESSION',{user:{id:state.userId}})});
        return {data:{subscription:{unsubscribe(){callbacks.delete(callback)}}}}}}};export const createClient=()=>client;`,
    '@/hooks/use-auth-redirect': `export const useAuthRedirect=()=>({user:{id:${JSON.stringify(USER)},email:'synthetic-review@example.test'}});`,
    'next/link': `import React from 'react';export default React.forwardRef(function FixtureLink({href,children,prefetch,replace,scroll,...rest},ref){return <a ref={ref} href={typeof href==='string'?href:href.pathname} {...rest}>{children}</a>});`,
    'next/navigation': `export const usePathname=()=>'/despega/a2/coach';`,
    'swr': `export default function useSWR(){return {data:{available:true,availability_reason:null,total_xp:0,current_level:1,xp_to_next_level:100,xp_progress_percent:0,daily_streak:0},isLoading:false}}`,
  }
  const entry = `import React from 'react';import {createRoot} from 'react-dom/client';
    import {AppShell} from '${root}/components/layout/app-shell';import {A2ChatCoach} from '${root}/components/a2-chat-coach';
    const fixtures={normal:${JSON.stringify(fixture())},personal:${JSON.stringify(fixture(evidence('personal'), true))}};
    const initial=new URLSearchParams(location.search).get('path')==='personal'?fixtures.personal:fixtures.normal;
    const transport={ignoreAbort:false,started:0,settled:0};window.__reviewTransport=transport;const original=window.fetch.bind(window);
    window.fetch=async(input,init)=>{if(String(input)!=='/api/a2/plan'||init?.method!=='POST')return original(input,init);
      transport.started++;try{return await original(input,transport.ignoreAbort?{...init,signal:undefined}:init)}finally{transport.settled++}};
    createRoot(document.getElementById('root')).render(<AppShell flow={initial.flow}>
      <h1 className="mb-6 text-2xl font-bold">Revisa tu siguiente paso</h1>
      <A2ChatCoach actorId=${JSON.stringify(USER)} initialGuidance={initial.guidance}/>
    </AppShell>);`
  await esbuild.build({ stdin: { contents: entry, loader: 'tsx', resolveDir: root }, outfile: join(work, 'app.js'),
    bundle: true, platform: 'browser', format: 'esm', jsx: 'automatic', target: 'es2022', tsconfig: join(root, 'tsconfig.json'),
    nodePaths: [join(root, 'node_modules')], define: { 'process.env.NODE_ENV': '"production"' }, logLevel: 'silent',
    plugins: [{ name: 'review-evidence-synthetic-ports', setup(build) {
      build.onResolve({ filter: /.*/ }, args => Object.hasOwn(stubs, args.path) ? { path: args.path, namespace: 'review-fixture' } : undefined)
      build.onLoad({ filter: /.*/, namespace: 'review-fixture' }, args => ({ contents: stubs[args.path], loader: 'tsx', resolveDir: root }))
    } }],
  })
  const css = readFileSync(join(root, 'app/globals.css'), 'utf8').replace(/^@import url\(.*$/gm, '')
    + '\n' + readFileSync(join(root, 'app/design-system.css'), 'utf8')
  writeFileSync(join(work, 'style-input.css'), css)
  execFileSync(join(root, 'node_modules/.bin/tailwindcss'), ['-c', join(root, 'tailwind.config.ts'), '-i', join(work, 'style-input.css'), '-o', join(work, 'style.css')], { cwd: root, stdio: 'pipe' })
  server = createServer((request, response) => {
    const url = new URL(request.url, 'http://127.0.0.1')
    if (url.pathname === '/app.js' || url.pathname === '/style.css') {
      response.writeHead(200, { 'Content-Type': url.pathname.endsWith('.js') ? 'text/javascript' : 'text/css', 'Cache-Control': 'no-store' })
      response.end(readFileSync(join(work, url.pathname.slice(1)))); return
    }
    if (url.pathname !== '/') { response.writeHead(404); response.end('Outside the synthetic rendering fixture'); return }
    response.writeHead(200, { 'Content-Type': 'text/html', 'Cache-Control': 'no-store' })
    response.end('<!doctype html><html lang="es-CL" class="dark"><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>DTC · revisión de evidencia sintética</title><link rel="stylesheet" href="/style.css"></head><body style="--font-montserrat:Arial;--font-lora:Georgia"><div id="root"></div><script type="module" src="/app.js"></script></body></html>')
  })
  await new Promise(done => server.listen(0, '127.0.0.1', done))
  return `http://127.0.0.1:${server.address().port}`
}

async function launch() {
  const options = { headless: true }
  if (process.env.DTC_AGENTIC_CHROMIUM_PATH) {
    const chromium = (await import(pathToFileURL(toolRequire.resolve('@sparticuz/chromium')).href)).default
    options.executablePath = resolve(process.env.DTC_AGENTIC_CHROMIUM_PATH)
    options.args = chromium.args.filter(arg => !['--disable-web-security', '--disable-site-isolation-trials', '--allow-running-insecure-content'].includes(arg))
    const binaryRoot = dirname(options.executablePath)
    options.env = { ...process.env, LD_LIBRARY_PATH: `${join(binaryRoot, 'al2023/lib')}:${binaryRoot}`, FONTCONFIG_PATH: join(binaryRoot, 'fonts') }
  }
  return playwright.chromium.launch(options)
}

async function main() {
  const origin = await prepare()
  for (const width of [390, 1440]) {
    browser = await launch(); browserVersion = browser.version()
    const context = await browser.newContext({ viewport: { width, height: 844 }, reducedMotion: 'reduce' })
    const page = await context.newPage(); page.setDefaultTimeout(8_000)
    page.on('pageerror', error => runtimeErrors.push({ width, message: error.message }))
    const state = { current: fixture(), plan: null, revision: 0, gets: 0, posts: [], writes: 0, receipts: new Map(), policy: null, received: deferred() }
    const view = () => a2PlanViewSchema.parse({ version: 'dtc-a2-plan-view.v1', revision: state.revision, plan: state.plan,
      context: state.current.context, guidance: state.current.guidance, freshness: assessA2PlanFreshness(state.plan, state.current.context, today) })
    await context.route('**/*', async route => {
      const request = route.request(), url = new URL(request.url())
      if (url.origin !== origin) { externalRequests.push({ width, origin: url.origin }); await route.abort(); return }
      if (!url.pathname.startsWith('/api/')) { await route.continue(); return }
      assert.equal(url.pathname, '/api/a2/plan', 'The evidence panel must not add an endpoint or model call')
      assert.equal(request.headers()['x-dtc-expected-plan-actor'], USER)
      const json = (body, status = 200) => route.fulfill({ status,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'private, no-store', 'X-DTC-Plan-Actor': USER }, body: JSON.stringify(body) })
      if (request.method() === 'GET') { state.gets++; return json(view()) }
      assert.equal(request.method(), 'POST')
      const command = a2PlanCommandSchema.parse(request.postDataJSON()), raw = request.postData(), policy = state.policy || {}
      state.policy = null; state.posts.push({ command, raw }); state.received.resolve()
      assert.equal(command.operation, 'save')
      let receipt = state.receipts.get(command.requestId)
      if (receipt) receipt = { ...receipt, replayed: true }
      else {
        if (!state.current.context.available || command.expectedContextHash !== state.current.context.hash || command.expectedRevision !== state.revision) {
          return json({ code: 'plan_context_changed', error: 'Tus registros cambiaron. Revísalos antes de confirmar.', view: view() }, 409)
        }
        const committedAt = new Date().toISOString()
        state.revision++; state.writes++
        state.plan = { id: PLAN, revision: state.revision, state: 'active', content: a2PlanContentSchema.parse(command.content),
          contextSnapshot: structuredClone(state.current.context), createdAt: state.plan?.createdAt || committedAt,
          updatedAt: committedAt, confirmedAt: committedAt }
        receipt = { requestId: command.requestId, planId: PLAN, revision: state.revision, state: 'active', committedAt, replayed: false }
        state.receipts.set(command.requestId, receipt)
      }
      const result = a2PlanMutationResponseSchema.parse({ ...view(), receipt })
      if (policy.hold) await policy.hold
      if (policy.abort) { await route.abort('connectionreset'); return }
      return json(result)
    })
    const card = () => page.locator('[data-a2-reviewed-plan]')
    const panel = () => page.locator('[data-a2-plan-evidence-review]')
    const idle = () => page.waitForFunction(() => document.querySelector('[data-a2-reviewed-plan]')?.getAttribute('aria-busy') === 'false')
    const purpose = () => card().getByLabel('Propósito del plan', { exact: true })
    const save = () => card().getByRole('button', { name: 'Guardar y activar plan', exact: true })
    const refresh = async () => { await card().getByRole('button', { name: 'Volver a comprobar mi plan', exact: true }).click(); await idle() }
    const acknowledge = () => card().getByRole('button', { name: 'Revisé los cambios y quiero conservar mi borrador', exact: true }).click()
    const audit = async stage => {
      await page.addScriptTag({ path: repoRequire.resolve('axe-core/axe.min.js') })
      const scanned = await page.evaluate(async () => window.axe.run(document, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
      }))
      accessibility.push({ width, stage, violations: scanned.violations.map(item => ({ id: item.id, impact: item.impact,
        nodes: item.nodes.map(node => ({ target: node.target, html: node.html, failureSummary: node.failureSummary })) })),
        incomplete: scanned.incomplete.map(item => ({ id: item.id, nodes: item.nodes.map(node => ({ target: node.target, failureSummary: node.failureSummary })) })) })
      assert.equal(scanned.violations.length, 0, `${width}/${stage}: axe violations`)
      check(`${width}/${stage}: no horizontal overflow`, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
      const file = `${stage}-${width}.png`; await page.screenshot({ path: join(output, file), fullPage: true, timeout: 30_000 }); screenshots.push(file)
    }
    try {
      await page.goto(origin); await panel().waitFor(); await idle()
      const initialGets = state.gets
      await panel().getByText('Ver registros usados', { exact: true }).click()
      await panel().getByText('Respuestas declaradas por ti; sin evaluación de capacidad.', { exact: true }).waitFor()
      check(`${width}: source details reuse the plan read and do not write`, state.gets === initialGets && state.posts.length === 0)
      check(`${width}: A4 result is attributed as a declaration with expected evidence`, (await panel().innerText()).includes('Resultado declarado por ti:') && (await panel().innerText()).includes('Esperabas observar:'))
      const sourceText = await panel().innerText()
      check(`${width}: source identifiers stay out of product text`, ![BASELINE, FOLLOW_UP, DECISION, SIGNAL].some(id => sourceText.includes(id)))
      const links = await panel().locator('a').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')))
      check(`${width}: source links use only the internal allowlist`, links.length > 0 && links.every(href => ['/despega/a3-outcome-baseline', '/despega/a3-outcome-follow-up', '/despega/a4'].includes(href)))
      check(`${width}: all displayed records remain linked when the suggestion prioritizes A4`, ['/despega/a3-outcome-baseline', '/despega/a3-outcome-follow-up', '/despega/a4'].every(href => links.includes(href)))
      check(`${width}: chosen review date is not mislabeled as its recorded timestamp`, await panel().locator(`time[datetime="${date(-3)}"]`).evaluate(node => node.parentElement.textContent.startsWith('Fecha elegida para revisar:'))
        && await panel().locator(`time[datetime="${instant(-1)}"]`).count() > 0)
      await panel().getByRole('button', { name: 'Revisar antes de preparar mi plan', exact: true }).focus()
      await page.keyboard.press('Enter')
      await purpose().waitFor()
      // The editor intentionally focuses its field in requestAnimationFrame.
      // Visibility can precede that frame; wait for the actual keyboard outcome.
      await page.waitForFunction(() => document.activeElement === document.querySelector('#a2-plan-purpose'))
      check(`${width}: keyboard review opens and focuses the existing editor`, await purpose().evaluate(node => document.activeElement === node))
      await purpose().fill('Conservar mi siguiente paso con un ejemplo propio.')
      await card().getByLabel('Título del paso 1', { exact: true }).fill('Revisar una evidencia concreta')
      await card().getByLabel('Qué harás en el paso 1', { exact: true }).fill('Anotar lo que observé y lo que todavía necesito comprobar.')
      await card().getByLabel('Cuándo revisarás el plan', { exact: true }).fill(date(7))
      check(`${width}: preparing and editing do not write`, state.posts.length === 0)
      await audit('review')
      await save().click(); await idle()
      check(`${width}: explicit save confirms the reviewed context once`, state.writes === 1 && state.plan.contextSnapshot.hash === state.current.context.hash)
      await panel().getByRole('button', { name: 'Revisar mi plan', exact: true }).click()
      await purpose().fill('MI EDICIÓN CONSERVADA al revisar las fuentes.')
      await panel().getByRole('button', { name: 'Volver a mi edición', exact: true }).click()
      check(`${width}: returning to the edit preserves text and focuses it`, await purpose().inputValue() === 'MI EDICIÓN CONSERVADA al revisar las fuentes.' && await purpose().evaluate(node => document.activeElement === node))
      state.current = fixture(evidence('changed'))
      await save().click(); await idle()
      const rejected = state.posts.at(-1).command
      check(`${width}: source conflict preserves edits and prevents unreviewed save`, await purpose().inputValue() === 'MI EDICIÓN CONSERVADA al revisar las fuentes.' && await save().isDisabled() && state.writes === 1)
      check(`${width}: changed evidence is visible before acknowledgement`, (await panel().innerText()).includes('CAMBIO DE FUENTE:'))
      await audit('source-changed')
      await acknowledge(); await save().click(); await idle()
      check(`${width}: reconfirmation uses a new command and current evidence`, state.posts.at(-1).command.requestId !== rejected.requestId
        && state.posts.at(-1).command.expectedContextHash === state.current.context.hash && state.plan.content.purpose === 'MI EDICIÓN CONSERVADA al revisar las fuentes.')

      await panel().getByRole('button', { name: 'Revisar mi plan', exact: true }).click()
      await purpose().fill('BORRADOR con lectura temporalmente indisponible.')
      state.current = fixture(evidence('unavailable')); await refresh()
      check(`${width}: applicable unavailable source preserves draft and blocks new confirmation`, await purpose().inputValue() === 'BORRADOR con lectura temporalmente indisponible.'
        && await save().isDisabled() && await panel().getByRole('button', { name: 'Volver a mi edición', exact: true }).isDisabled())
      check(`${width}: partial evidence remains distinct from missing data`, (await panel().innerText()).includes('No pudimos recuperar tus respuestas.')
        && (await panel().innerText()).includes('Resultado declarado por ti:'))
      await audit('unavailable')
      state.current = fixture(evidence('changed')); await refresh(); await acknowledge()
      state.policy = { abort: true }
      await save().click(); await idle()
      const uncertainWrite = state.posts.at(-1), writes = state.writes
      check(`${width}: pending confirmation cannot be replaced by the evidence CTA`, await panel().getByRole('button', { name: 'Volver a mi edición', exact: true }).isDisabled())
      state.current = fixture(evidence('later'))
      await card().getByRole('button', { name: 'Reintentar la misma solicitud', exact: true }).click(); await idle()
      check(`${width}: new evidence does not rewrite an uncertain command`, state.posts.at(-1).raw === uncertainWrite.raw && state.writes === writes)
      check(`${width}: settled receipt keeps the confirmed plan and exposes newer context`, await card().getByText('Tu recorrido o contexto cambió. Revisa el plan antes de volver a usarlo.', { exact: true }).isVisible()
        && state.plan.content.purpose === 'BORRADOR con lectura temporalmente indisponible.')

      state.current = fixture(evidence('missing-locked')); await page.goto(origin); await panel().waitFor(); await idle()
      await panel().getByText('Ver registros usados', { exact: true }).click()
      check(`${width}: verified missing and locked sources have separate messages`, (await panel().innerText()).includes('No hay respuestas guardadas en esta versión del ejercicio.')
        && (await panel().innerText()).includes('El Radar aún no está habilitado en tu recorrido.') && !(await panel().getByRole('button').isDisabled()))
      state.current = fixture(evidence('personal'), true); await page.goto(origin + '?path=personal'); await panel().waitFor(); await idle()
      await panel().getByText('Ver registros usados', { exact: true }).click()
      check(`${width}: personal path has no interview prompts or source navigation`, await panel().getByText('Esta fuente no se usa en tu camino personal.', { exact: true }).count() === 2
        && await panel().locator('a').count() === 0 && !(await panel().innerText()).includes('registra un intento inicial'))
      await audit('personal')

      state.current = fixture(evidence()); await page.goto(origin); await panel().waitFor(); await idle()
      await panel().getByRole('button', { name: 'Revisar mi plan', exact: true }).click()
      await purpose().fill('TEXTO PRIVADO ANTES DEL CAMBIO DE CUENTA')
      await acknowledge()
      const held = deferred(); state.received = deferred(); state.policy = { hold: held.promise }
      await page.evaluate(() => { window.__reviewTransport.ignoreAbort = true })
      await save().click(); await state.received.promise
      await page.evaluate(other => window.__reviewAuth.emit(other), OTHER)
      await page.getByRole('link', { name: 'Volver a abrir el asistente', exact: true }).waitFor()
      held.resolve()
      await page.waitForFunction(() => window.__reviewTransport.started === window.__reviewTransport.settled)
      check(`${width}: account change removes evidence and draft and ignores late response`, await panel().count() === 0 && await card().count() === 0
        && !(await page.locator('main').innerText()).includes('TEXTO PRIVADO ANTES DEL CAMBIO DE CUENTA'))
      check(`${width}: account alert separates its sentence and reopen link`, (await page.getByRole('alert').innerText()).includes('correcto. Volver a abrir el asistente'))
    } finally { await context.close(); await browser.close(); browser = null }
  }
  check('no uncaught JavaScript errors', runtimeErrors.length === 0)
  check('no external network requests', externalRequests.length === 0)
  check('component, contracts and harness sources unchanged during the run', JSON.stringify(sourcesAtBuild) === JSON.stringify(sourceHashes()))
}

let failure
try { await main() } catch (error) { failure = error; console.error(error) }
finally {
  writeFileSync(join(output, 'a2-plan-review-evidence-ui.json'), JSON.stringify({ suite: 'a2-plan-review-evidence-ui', status: failure ? 'failed' : 'passed',
    checks, accessibility, actualComponents: true, actualAppShell: true, authAndHttp: 'synthetic', actualDatabaseOrRls: false,
    liveModelQuality: false, fonts: 'system Arial and Georgia', browserVersion, viewports: [{ width: 390, height: 844 }, { width: 1440, height: 844 }],
    runtimeErrors, externalRequests, screenshots, sources: sourcesAtBuild, sourcesAtEnd: sourceHashes(),
    sourcesUnchangedDuringRun: JSON.stringify(sourcesAtBuild) === JSON.stringify(sourceHashes()), failure: failure?.message }, null, 2) + '\n')
  if (browser) await browser.close()
  if (server) await new Promise(done => server.close(done))
}
console.log(JSON.stringify({ output, status: failure ? 'failed' : 'passed', checks: checks.length, axeAudits: accessibility.length }))
if (failure) process.exitCode = 1
