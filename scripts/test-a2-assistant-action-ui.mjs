/** Real chat/action components and DTC CSS; synthetic Auth and HTTP only.
 * This verifies review/recovery UI, not SQL, RLS, real Auth or model usefulness.
 * DTC_AGENTIC_BROWSER_LAB=yes node --import tsx scripts/test-a2-assistant-action-ui.mjs
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
import { a2PlanToday, buildA2PlanContextProjection, a2PlanViewSchema } from '../lib/a2/plan-contract.ts'
import { a2ActionProposalSchema, a2ActionViewSchema, a2ActionResultSchema } from '../lib/a2/assistant-action-contract.ts'

assert.equal(process.env.DTC_AGENTIC_BROWSER_LAB, 'yes', 'Only run in a disposable synthetic fixture')
const root = process.cwd(), repoRequire = createRequire(join(root, 'package.json'))
const toolsRoot = process.env.DTC_AGENTIC_BROWSER_TOOLS
const toolRequire = toolsRoot ? createRequire(join(resolve(toolsRoot), 'package.json')) : repoRequire
const playwright = toolRequire('playwright'), esbuild = repoRequire('esbuild')
const work = mkdtempSync(join(tmpdir(), 'dtc-action-ui-'))
const output = resolve(process.env.DTC_AGENTIC_QA_OUTPUT || work)
mkdirSync(output, { recursive: true })
const USER = '00000000-0000-4000-8000-000000000001', OTHER = '00000000-0000-4000-8000-000000000002'
const DOCUMENT = '00000000-0000-4000-8000-000000000701'
const today = a2PlanToday()
const reviewDate = (offset = 7) => { const value = new Date(`${today}T12:00:00Z`); value.setUTCDate(value.getUTCDate() + offset); return value.toISOString().slice(0, 10) }
const checks = [], accessibility = [], runtimeErrors = [], externalRequests = [], screenshots = []
const check = (name, condition) => { assert.ok(condition, name); checks.push(name) }
const deferred = () => { let resolve; const promise = new Promise(done => { resolve = done }); return { promise, resolve } }
const sourcePaths = ['components/a2-assistant-action.tsx', 'components/a2-chat-coach.tsx', 'components/a2-reviewed-plan.tsx', 'lib/a2/assistant-action-contract.ts', 'scripts/test-a2-assistant-action-ui.mjs']
const sourceHashes = () => sourcePaths.map(path => ({ path, sha256: createHash('sha256').update(readFileSync(join(root, path))).digest('hex') }))
let browser, server, browserVersion, sourcesAtBuild

function fixture(day = 3) {
  const flow = buildJourneyFlow({
    profile: { camino_foco: 'profesional', onboarding_conozcamonos_1_completed: true, a1_cerebral_intro_seen: true,
      a1_cerebral_completed: true, conozcamonos_2_completed: true, a1_report_seen: true, a2_intro_seen: true },
    access: { a1: true, a2: true, a3: false, a4: false }, currentModule: 'A2', highestA2DayUnlocked: day,
    completedA2Days: Array.from({ length: day - 1 }, (_, i) => i + 1), completedA3Modules: [], a3RouteClosed: false,
  })
  const guidance = buildGuidedNextAction(flow, { objective: { status: 'missing' }, adjustment: { status: 'missing' } })
  const projected = buildA2PlanContextProjection(flow, guidance)
  const context = { version: 'dtc-a2-plan-context.v1', capturedAt: new Date().toISOString(), ...projected,
    hash: createHash('sha256').update(JSON.stringify(projected.projection)).digest('hex') }
  const view = a2ActionViewSchema.parse({ version: 'dtc-a2-action-view.v1', dayNumber: day, context, guidance })
  const proposal = a2ActionProposalSchema.parse({ version: 'dtc-a2-action-proposal.v1', tool: 'save_practice_adjustment',
    dayNumber: day, expectedContextHash: context.hash,
    draft: { outcome: 'could_not', barrier: 'time', retainedWork: '', nextAction: 'Ensayar diez minutos y anotar una mejora.' } })
  return { flow, guidance, view, proposal }
}

async function prepare() {
  sourcesAtBuild = sourceHashes()
  const stubs = {
    '@/lib/supabase/client': `
      const callbacks=new Set();const state={userId:${JSON.stringify(USER)},calls:0,
        emit(userId){this.userId=userId;for(const callback of callbacks)callback(userId?'SIGNED_IN':'SIGNED_OUT',userId?{user:{id:userId}}:null)}};
      window.__actionAuth=state;const client={auth:{getUser:async()=>{state.calls++;return {data:{user:state.userId?{id:state.userId}:null},error:null}},
        onAuthStateChange(callback){callbacks.add(callback);queueMicrotask(()=>{if(callbacks.has(callback))callback('INITIAL_SESSION',{user:{id:state.userId}})});
          return {data:{subscription:{unsubscribe(){callbacks.delete(callback)}}}}}}};export const createClient=()=>client;`,
    'next/link': `import React from 'react';export default React.forwardRef(function FixtureLink({href,children,prefetch,replace,scroll,...rest},ref){return <a ref={ref} href={typeof href==='string'?href:href.pathname} {...rest}>{children}</a>});`,
  }
  const entry = `import React from 'react';import {createRoot} from 'react-dom/client';import {A2ChatCoach} from '${root}/components/a2-chat-coach';
    const state={ignoreAbort:false,started:0,settled:0};window.__actionTransport=state;const original=window.fetch.bind(window);
    window.fetch=async(input,init)=>{if(String(input)!=='/api/a2/assistant-actions'||init?.method!=='POST')return original(input,init);
      state.started++;try{return await original(input,state.ignoreAbort?{...init,signal:undefined}:init)}finally{state.settled++}};
    createRoot(document.getElementById('root')).render(<main className="mx-auto max-w-7xl p-4"><h1 className="mb-6 text-2xl font-bold">Asistente de Tu Ruta</h1>
      <A2ChatCoach actorId=${JSON.stringify(USER)} initialGuidance={${JSON.stringify(fixture().guidance)}}/></main>);`
  await esbuild.build({ stdin: { contents: entry, loader: 'tsx', resolveDir: root }, outfile: join(work, 'app.js'),
    bundle: true, platform: 'browser', format: 'esm', jsx: 'automatic', target: 'es2022', tsconfig: join(root, 'tsconfig.json'),
    nodePaths: [join(root, 'node_modules')], define: { 'process.env.NODE_ENV': '"production"' }, logLevel: 'silent',
    plugins: [{ name: 'action-ui-read-ports', setup(build) {
      build.onResolve({ filter: /.*/ }, args => Object.hasOwn(stubs, args.path) ? { path: args.path, namespace: 'action-fixture' } : undefined)
      build.onLoad({ filter: /.*/, namespace: 'action-fixture' }, args => ({ contents: stubs[args.path], loader: 'tsx', resolveDir: root }))
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
    if (url.pathname !== '/') { response.writeHead(404); response.end('Outside the UI fixture'); return }
    response.writeHead(200, { 'Content-Type': 'text/html', 'Cache-Control': 'no-store' })
    response.end('<!doctype html><html lang="es-CL" class="dark"><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>DTC · revisión de ajuste sintético</title><link rel="stylesheet" href="/style.css"></head><body style="--font-montserrat:Arial;--font-lora:Georgia"><div id="root"></div><script type="module" src="/app.js"></script></body></html>')
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
    const state = { current: fixture(), chatResponses: [], gets: 0, planGets: 0, posts: [], commits: new Map(), policy: null, received: deferred() }
    await context.route('**/*', async route => {
      const request = route.request(), url = new URL(request.url())
      if (url.origin !== origin) { externalRequests.push({ width, origin: url.origin }); await route.abort(); return }
      const json = (body, status = 200, header = 'X-DTC-Action-Actor') => route.fulfill({ status,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'private, no-store', [header]: USER }, body: JSON.stringify(body) })
      if (url.pathname === '/api/despega/a2-coach') {
        return json(state.chatResponses.shift() || { response: 'Puedes revisar una acción más pequeña.', guidance: state.current.guidance }, 200, 'X-DTC-Actor-Id')
      }
      if (url.pathname === '/api/a2/plan') {
        assert.equal(request.method(), 'GET'); state.planGets++
        return json(a2PlanViewSchema.parse({ version: 'dtc-a2-plan-view.v1', revision: 0, plan: null,
          context: state.current.view.context, guidance: state.current.guidance, freshness: { status: 'none', reasons: ['no_saved_plan'] } }), 200, 'X-DTC-Plan-Actor')
      }
      if (url.pathname !== '/api/a2/assistant-actions') { await route.continue(); return }
      assert.equal(request.headers()['x-dtc-expected-action-actor'], USER)
      if (request.method() === 'GET') { state.gets++; return json(state.current.view) }
      assert.equal(request.method(), 'POST')
      const command = request.postDataJSON(), raw = request.postData(), policy = state.policy || {}
      state.policy = null; state.posts.push({ command, raw }); state.received.resolve()
      let result = state.commits.get(command.requestId)
      if (!result && command.expectedContextHash !== state.current.view.context.hash) {
        return json({ code: 'action_context_changed', error: 'El contexto cambió. Revísalo antes de confirmar.', view: state.current.view }, 409)
      }
      if (result) result = { ...result, receipt: { ...result.receipt, replayed: true } }
      else {
        result = a2ActionResultSchema.parse({ version: 'dtc-a2-action-result.v1', effect: 'present', adjustment: command.adjustment,
          receipt: { version: 'dtc-a2-action-receipt.v1', requestId: command.requestId, documentId: DOCUMENT,
            dayNumber: command.dayNumber, committedAt: new Date().toISOString(), replayed: false } })
        state.commits.set(command.requestId, result)
      }
      if (policy.hold) await policy.hold
      if (policy.abort) { await route.abort('connectionreset'); return }
      if (policy.mismatch) result = { ...result, receipt: { ...result.receipt, requestId: OTHER } }
      return json(result)
    })
    const card = () => page.locator('[data-a2-assistant-action]')
    const idle = () => page.waitForFunction(() => document.querySelector('[data-a2-assistant-action]')?.getAttribute('aria-busy') === 'false')
    const ask = async (withProposal = true, override) => {
      state.chatResponses.push(override || { response: 'Puedes revisar una acción más pequeña.', guidance: state.current.guidance,
        ...(withProposal ? { actionProposal: state.current.proposal } : {}) })
      await page.getByLabel('Tu pregunta', { exact: true }).fill('Quiero retomar mi práctica con menos tiempo.')
      await page.getByRole('button', { name: /^(Enviar pregunta|Reintentar pregunta)$/ }).click()
      await page.waitForFunction(() => document.querySelector('#a2-assistant-question')?.value === '')
    }
    const review = async (text = 'Conservo mi ejemplo personal.') => {
      await card().getByRole('button', { name: 'Revisar ajuste', exact: true }).click(); await idle()
      await card().getByLabel('Qué quieres conservar', { exact: true }).fill(text)
      await card().getByLabel('Fecha de revisión', { exact: true }).fill(reviewDate())
    }
    const submit = () => card().getByRole('button', { name: 'Confirmar y guardar ajuste', exact: true }).click()
    const retry = () => card().getByRole('button', { name: 'Reintentar la misma solicitud', exact: true }).click()
    const audit = async stage => {
      await page.addScriptTag({ path: repoRequire.resolve('axe-core/axe.min.js') })
      const scanned = await page.evaluate(async () => window.axe.run(document.querySelector('main'), {
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
      await page.goto(origin)
      await page.getByLabel('Tu pregunta', { exact: true }).waitFor()
      await ask(false)
      check(`${width}: baseline does not invent an action proposal`, await card().count() === 0 && state.gets === 0 && state.posts.length === 0)
      await ask(); await card().getByRole('button', { name: 'Revisar ajuste', exact: true }).waitFor()
      check(`${width}: proposal is not a write or implicit context request`, state.gets === 0 && state.posts.length === 0)
      await card().getByRole('button', { name: 'Revisar ajuste', exact: true }).click(); await idle()
      check(`${width}: incomplete review cannot save`, await card().getByRole('button', { name: 'Confirmar y guardar ajuste', exact: true }).isDisabled())
      await card().getByLabel('Qué quieres conservar', { exact: true }).fill('Conservo el esquema que escribí.')
      await card().getByLabel('Qué intentarás ahora', { exact: true }).fill('Revisar sólo el primer ejemplo durante diez minutos.')
      await card().getByLabel('Qué necesitas cambiar', { exact: true }).selectOption('change')
      await card().getByLabel('Qué te dificultó avanzar', { exact: true }).selectOption('energy')
      await card().getByLabel('Fecha de revisión', { exact: true }).fill(reviewDate(31))
      check(`${width}: review date is bounded to Santiago today + 30`, await card().getByRole('button', { name: 'Confirmar y guardar ajuste', exact: true }).isDisabled()
        && await card().getByLabel('Fecha de revisión', { exact: true }).getAttribute('min') === today)
      await card().getByLabel('Fecha de revisión', { exact: true }).fill(reviewDate())
      await audit('review')
      check(`${width}: editing does not write`, state.posts.length === 0)
      await submit(); await idle()
      await card().getByText('Ajuste guardado para el día 3.', { exact: true }).waitFor()
      check(`${width}: explicit confirmation sends reviewed content once`, state.posts.length === 1
        && state.posts[0].command.adjustment.outcome === 'change' && state.posts[0].command.adjustment.barrier === 'energy'
        && state.posts[0].command.adjustment.retainedWork === 'Conservo el esquema que escribí.')
      check(`${width}: exact present effect refreshes the existing plan`, state.planGets >= 2)
      check(`${width}: confirmed proposal cannot silently submit again`, await card().getByRole('button', { name: 'Revisar ajuste', exact: true }).count() === 0)

      await ask(); await review('EDICIÓN CONSERVADA AL LLEGAR OTRA RESPUESTA')
      await ask(false)
      check(`${width}: a later baseline reply retains the open draft and requires review`, await card().getByLabel('Qué quieres conservar', { exact: true }).inputValue() === 'EDICIÓN CONSERVADA AL LLEGAR OTRA RESPUESTA'
        && await card().getByRole('button', { name: 'Confirmar y guardar ajuste', exact: true }).isDisabled())
      await card().getByRole('button', { name: 'Comprobar contexto actual', exact: true }).click(); await idle()
      await card().getByRole('button', { name: 'Revisé el contexto; conservar mi edición', exact: true }).click()
      await submit(); await idle()
      check(`${width}: explicit review keeps personal edits`, state.posts.at(-1).command.adjustment.retainedWork === 'EDICIÓN CONSERVADA AL LLEGAR OTRA RESPUESTA')

      await ask(); await review('EDICIÓN CONSERVADA CON NUEVO DÍA')
      state.current = fixture(4)
      await submit(); await idle()
      check(`${width}: changed context rejects the old draft without discarding it`, await card().getByLabel('Qué quieres conservar', { exact: true }).inputValue() === 'EDICIÓN CONSERVADA CON NUEVO DÍA'
        && await card().getByRole('button', { name: 'Confirmar y guardar ajuste', exact: true }).isDisabled())
      const rejected = state.posts.at(-1).command
      await card().getByRole('button', { name: 'Comprobar contexto actual', exact: true }).click(); await idle()
      await audit('context-changed')
      await card().getByRole('button', { name: 'Revisé el contexto; conservar mi edición', exact: true }).click()
      await submit(); await idle()
      check(`${width}: reconfirmation uses the current day/hash and a new command`, state.posts.at(-1).command.dayNumber === 4
        && state.posts.at(-1).command.expectedContextHash === state.current.view.context.hash && state.posts.at(-1).command.requestId !== rejected.requestId)

      await ask(); await review('EDICIÓN PENDIENTE INMUTABLE')
      state.policy = { abort: true }
      await submit(); await idle()
      const lost = state.posts.at(-1), commitsBefore = state.commits.size
      await ask()
      check(`${width}: a newer proposal does not replace an uncertain command`, await card().getByLabel('Qué quieres conservar', { exact: true }).inputValue() === 'EDICIÓN PENDIENTE INMUTABLE'
        && await card().getByLabel('Qué quieres conservar', { exact: true }).isDisabled())
      await audit('uncertain')
      await retry(); await idle()
      await card().getByText('Confirmamos el ajuste que guardaste para el día 4.', { exact: true }).waitFor()
      check(`${width}: lost response retry is byte-identical and settles the original command`, state.posts.at(-1).raw === lost.raw && state.commits.size === commitsBefore)

      for (const effect of ['changed', 'removed']) {
        await ask(); await review(`REPLAY ${effect}`); state.policy = { abort: true }
        await submit(); await idle()
        const original = state.posts.at(-1), previous = state.commits.get(original.command.requestId)
        state.commits.set(original.command.requestId, { ...previous, effect, adjustment: null })
        await retry(); await idle()
        const text = await card().locator('[data-a2-action-receipt]').innerText()
        check(`${width}: ${effect} receipt reports the current effect without a new-save claim`, state.posts.at(-1).raw === original.raw
          && (effect === 'changed' ? text.includes('cambió después') : text.includes('Continúa eliminado')) && !text.includes('Ajuste guardado'))
      }

      await ask(); await review('RECIBO NO COINCIDENTE'); state.policy = { mismatch: true }
      await submit(); await idle()
      check(`${width}: unmatched receipt cannot claim success`, await card().locator('[data-a2-action-receipt]').count() === 0
        && await card().getByRole('button', { name: 'Reintentar la misma solicitud', exact: true }).count() === 1)
      const mismatched = state.posts.at(-1)
      await retry(); await idle()
      check(`${width}: unmatched receipt recovery keeps the same command`, state.posts.at(-1).raw === mismatched.raw)
      await audit('confirmed')

      await ask(); await review('CONTENIDO SOLO DE LA CUENTA ANTERIOR')
      await page.evaluate(() => { window.__actionTransport.ignoreAbort = true })
      const held = deferred(); state.received = deferred(); state.policy = { hold: held.promise }
      await submit(); await state.received.promise
      await page.evaluate(other => window.__actionAuth.emit(other), OTHER)
      await page.getByText('La sesión cambió. Vuelve a abrir el asistente para continuar con el recorrido correcto.', { exact: false }).waitFor()
      held.resolve()
      await page.waitForFunction(() => window.__actionTransport.started === window.__actionTransport.settled)
      check(`${width}: account change purges draft and ignores a late committed response`, await card().count() === 0
        && !await page.locator('body').innerText().then(text => text.includes('CONTENIDO SOLO DE LA CUENTA ANTERIOR') || text.includes('Ajuste guardado')))
    } finally {
      await context.close(); await browser.close(); browser = undefined
    }
  }
  check('no uncaught JavaScript errors', runtimeErrors.length === 0)
  check('no external network requests', externalRequests.length === 0)
  check('component and harness sources unchanged during the run', JSON.stringify(sourcesAtBuild) === JSON.stringify(sourceHashes()))
}

let failure
try { await main() } catch (error) { failure = error; process.exitCode = 1 }
finally {
  if (browser) await browser.close()
  if (server) await new Promise(done => server.close(done))
  const evidence = { suite: 'a2-assistant-action-ui', status: failure ? 'failed' : 'passed', checks, accessibility,
    actualComponents: true, authAndHttp: 'synthetic', actualDatabaseOrRls: false, liveModelQuality: false,
    browserVersion, viewports: [{ width: 390, height: 844 }, { width: 1440, height: 844 }], runtimeErrors, externalRequests, screenshots,
    sources: sourcesAtBuild, sourcesAtEnd: sourceHashes(), sourcesUnchangedDuringRun: JSON.stringify(sourcesAtBuild) === JSON.stringify(sourceHashes()),
    ...(failure ? { failure: failure.message, stack: failure.stack } : {}) }
  writeFileSync(join(output, 'a2-assistant-action-ui.json'), JSON.stringify(evidence, null, 2))
  console.log(JSON.stringify({ suite: evidence.suite, status: evidence.status, checks: checks.length, axeAudits: accessibility.length,
    violations: accessibility.reduce((sum, item) => sum + item.violations.length, 0), output, ...(failure ? { failure: failure.message } : {}) }))
}
