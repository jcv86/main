/**
 * Actual A2 assistant, dashboard, journey page and DTC CSS in Chromium.
 * Auth, server read ports, Next navigation and the assistant HTTP response are synthetic.
 * No production route, account, database, external provider or authentication bypass is created.
 * Run only in a disposable fixture: DTC_AGENTIC_BROWSER_LAB=yes node --import tsx scripts/agentic-browser-qa.mjs
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
import { adjustmentContent } from '../lib/a2/practice-adjustment.ts'

assert.equal(process.env.DTC_AGENTIC_BROWSER_LAB, 'yes', 'This script is only for the isolated synthetic fixture')
const root = process.cwd()
const repoRequire = createRequire(join(root, 'package.json'))
const qaRoot = process.env.DTC_AGENTIC_BROWSER_TOOLS
const toolRequire = qaRoot ? createRequire(join(resolve(qaRoot), 'package.json')) : repoRequire
let playwright
try { playwright = toolRequire('playwright') } catch {
  assert.ok(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, 'Provide a local Playwright installation')
  playwright = createRequire(join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, 'playwright/package.json'))('playwright')
}
const esbuild = repoRequire('esbuild')
const work = mkdtempSync(join(tmpdir(), 'dtc-agentic-ui-'))
const output = resolve(process.env.DTC_AGENTIC_QA_OUTPUT || work)
mkdirSync(output, { recursive: true })

const USER = '00000000-0000-4000-8000-000000000001'
const OTHER = '00000000-0000-4000-8000-000000000002'
const ID = '00000000-0000-4000-8000-000000000701'
const QUESTION = 'No pude realizar mi última acción. ¿Cómo la hago más abordable?'
const ANSWER = 'Puedes retomar el paso de diez minutos que dejaste definido y anotar qué lograste practicar.'
const FOLLOW_UP = '¿Qué parte puedo revisar primero?'
const FOLLOW_UP_ANSWER = 'Revisa el esquema que conservaste y elige una idea para explicar con tus propias palabras.'
const ADJUSTMENT_TEXT = 'Ensayar durante diez minutos y anotar una mejora.'
const checks = [], accessibility = [], runtimeErrors = [], networkFailures = [], externalRequests = [], screenshots = []
const check = (name, condition) => { assert.ok(condition, name); checks.push(name) }
const deferred = () => { let resolve; const promise = new Promise(done => { resolve = done }); return { promise, resolve } }
let browser, server, browserVersion

function fixture(kind = 'normal') {
  const profile = {
    camino_foco: kind === 'personal' ? 'persona' : 'profesional',
    onboarding_conozcamonos_1_completed: true, a1_cerebral_intro_seen: true,
    a1_cerebral_completed: true, conozcamonos_2_completed: true, a1_report_seen: true, a2_intro_seen: true,
  }
  const access = { a1: true, a2: true, a3: false, a4: false }
  const flow = buildJourneyFlow({ profile, access, currentModule: 'A2', highestA2DayUnlocked: kind === 'later' ? 4 : 3,
    completedA2Days: kind === 'later' ? [1, 2, 3] : [1, 2], completedA3Modules: [], a3RouteClosed: false })
  const objective = {
    id: ID, source: 'user_confirmed', target_roles: ['Analista de datos'], functional_areas: [],
    objective_stage: 'specific', breadth: 'related', locations: ['Metropolitana'], location_preference: 'selected',
    work_modes: ['hybrid'], industries: [], excluded_industries: [], unknown_industry_policy: 'exclude',
    updated_at: '2026-11-06T12:00:00Z',
  }
  const adjustment = {
    id: ID, created_at: '2026-11-06T13:00:00Z', related_day: 3,
    content: adjustmentContent({ requestId: ID, dayNumber: 3, outcome: 'could_not', barrier: 'time',
      retainedWork: 'Conservo el esquema de mi presentación.', nextAction: ADJUSTMENT_TEXT, reviewDate: '2026-11-07' }),
  }
  const guidance = buildGuidedNextAction(flow, {
    objective: kind === 'unavailable' ? { status: 'unavailable' } : { status: 'available', value: objective },
    adjustment: kind === 'unavailable' ? { status: 'unavailable' } : kind === 'later' ? { status: 'missing' } : { status: 'available', value: adjustment },
  })
  const journey = { user: { id: USER, user_metadata: { full_name: 'Persona sintética' } }, profile, access,
    state: { currentModule: 'A2', highestA2DayUnlocked: kind === 'later' ? 4 : 3 }, a4AccessSource: null }
  return { journey, flow, guidance }
}
const fixtures = Object.fromEntries(['normal', 'unavailable', 'personal', 'later'].map(kind => [kind, fixture(kind)]))

async function prepare() {
  const fixtureModule = `
    export const fixtures=${JSON.stringify(fixtures)};
    export const fixture=fixtures[new URLSearchParams(location.search).get('scenario')]||fixtures.normal;
  `
  const stubs = {
    'qa-fixtures': fixtureModule,
    '@/lib/journey/service': `import {fixture} from 'qa-fixtures';
      export const getJourneyForCurrentUser=async()=>fixture.journey;
      export const requireJourneyModule=async(module)=>{if(module!=='A2')throw Error('Unexpected fixture module');return fixture.journey};
      export const getCanonicalNextPath=async()=>fixture.flow.onboardingPath;`,
    '@/lib/journey/flow-service': `import {fixture} from 'qa-fixtures';export const loadJourneyFlow=async()=>fixture.flow;`,
    '@/lib/journey/next-action-service': `import {fixture} from 'qa-fixtures';export const loadGuidedNextAction=async()=>fixture.guidance;`,
    '@/lib/supabase/client': `
      const q=new URLSearchParams(location.search),callbacks=new Set();
      let releaseAuth;const authWait=q.get('auth')==='delayed'?new Promise(resolve=>{releaseAuth=resolve}):Promise.resolve();
      const state={userId:q.get('auth')==='missing'?null:${JSON.stringify(USER)},calls:0,fail:false,releaseAuth,
        emit(userId,event='SIGNED_IN'){this.userId=userId;for(const callback of callbacks)callback(event,userId?{user:{id:userId}}:null)}};
      window.__agenticAuth=state;
      async function getUser(){state.calls++;await authWait;if(state.fail)throw Error('Synthetic auth transport unavailable');return {data:{user:state.userId?{id:state.userId}:null},error:null}}
      function onAuthStateChange(callback){
        callbacks.add(callback);
        queueMicrotask(()=>{if(callbacks.has(callback))callback('INITIAL_SESSION',state.userId?{user:{id:state.userId}}:null)});
        return {data:{subscription:{unsubscribe(){callbacks.delete(callback)}}}};
      }
      const client={auth:{getUser,onAuthStateChange}};
      export const createClient=()=>client;`,
    'next/link': `import React from 'react';export default React.forwardRef(function FixtureLink({href,children,prefetch,replace,scroll,...rest},ref){return <a ref={ref} href={typeof href==='string'?href:href.pathname} {...rest}>{children}</a>});`,
    'next/navigation': `export function redirect(path){throw Error('Unexpected redirect in authorized page fixture: '+path)}`,
  }
  const entry = `import React from 'react';import {createRoot} from 'react-dom/client';
    import AssistantPage from '${root}/app/despega/a2/coach/page';
    import DashboardPage from '${root}/app/despega/dashboard/page';
    import JourneyPage from '${root}/app/despega/recorrido/page';
    window.__agenticTransport={started:0,settled:0,ignoreAbort:false,lastSignal:false};
    const originalFetch=window.fetch.bind(window);window.fetch=async(input,init)=>{
      if(String(input)!=='/api/despega/a2-coach')return originalFetch(input,init);
      const state=window.__agenticTransport;state.started++;state.lastSignal=Boolean(init?.signal);
      const request=state.ignoreAbort?{...init,signal:undefined}:init;
      try{return await originalFetch(input,request)}finally{state.settled++}
    };
    const page=location.pathname==='/despega/dashboard'?DashboardPage:location.pathname==='/despega/recorrido'?JourneyPage:AssistantPage;
    const content=await page();createRoot(document.getElementById('root')).render(<main>{content}</main>);
  `
  await esbuild.build({ stdin: { contents: entry, loader: 'tsx', resolveDir: root }, outfile: join(work, 'app.js'),
    bundle: true, platform: 'browser', format: 'esm', jsx: 'automatic', target: 'es2022', tsconfig: join(root, 'tsconfig.json'),
    nodePaths: [join(root, 'node_modules')], define: { 'process.env.NODE_ENV': '"production"' }, logLevel: 'silent',
    plugins: [{ name: 'isolated-server-and-auth-ports', setup(build) {
      build.onResolve({ filter: /.*/ }, args => Object.hasOwn(stubs, args.path) ? { path: args.path, namespace: 'agentic-fixture' } : undefined)
      build.onLoad({ filter: /.*/, namespace: 'agentic-fixture' }, args => ({ contents: stubs[args.path], loader: 'tsx', resolveDir: root }))
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
    if (!['/despega/a2/coach', '/despega/dashboard', '/despega/recorrido'].includes(url.pathname)) {
      response.writeHead(404, { 'Content-Type': 'text/plain' }); response.end('Outside the synthetic rendering fixture'); return
    }
    response.writeHead(200, { 'Content-Type': 'text/html', 'Cache-Control': 'no-store' })
    response.end('<!doctype html><html lang="es-CL" class="dark"><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>DTC · verificación sintética del asistente</title><link rel="stylesheet" href="/style.css"></head><body style="--font-montserrat:Arial;--font-lora:Georgia"><div id="root"></div><script type="module" src="/app.js"></script></body></html>')
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
  const base = await prepare()
  for (const width of [390, 1440]) {
    let context
    try {
      browser = await launch(); browserVersion = browser.version()
      context = await browser.newContext({ viewport: { width, height: 844 }, reducedMotion: 'reduce' })
      const page = await context.newPage(); page.setDefaultTimeout(8_000)
      page.on('pageerror', error => runtimeErrors.push({ width, message: error.message }))
      page.on('requestfailed', request => networkFailures.push({ width, path: new URL(request.url()).pathname, error: request.failure()?.errorText }))
      const state = { posts: [], plans: [], received: deferred() }
      await context.route('**/*', async route => {
        const request = route.request(), url = new URL(request.url())
        if (url.origin !== base) { externalRequests.push({ width, origin: url.origin }); await route.abort(); return }
        if (url.pathname !== '/api/despega/a2-coach') { await route.continue(); return }
        state.posts.push({ body: request.postDataJSON(), headers: await request.allHeaders() })
        const plan = state.plans.shift() || {}
        const released = deferred()
        if (plan.hold) state.release = released.resolve
        state.received.resolve()
        if (plan.hold) await released.promise
        if (plan.abort) { await route.abort('connectionrefused'); return }
        const status = plan.status ?? 200
        const body = plan.body ?? (status === 200 ? { response: plan.answer ?? ANSWER, guidance: plan.guidance ?? fixtures.normal.guidance }
          : { error: 'El asistente no pudo responder. Tu pregunta se conserva; puedes reintentar.', code: 'assistant_unavailable', guidance: plan.guidance ?? fixtures.normal.guidance })
        const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'private, no-store' }
        if (plan.actor !== null) headers['X-DTC-Actor-Id'] = plan.actor ?? USER
        await route.fulfill({ status, headers, body: JSON.stringify(body) })
      })
      const visit = async (path, query = '') => { state.posts = []; state.plans = []; state.received = deferred(); await page.goto(base + path + query) }
      const question = () => page.getByLabel('Tu pregunta', { exact: true })
      const nextLink = () => page.locator('a').filter({ hasText: /^Continuar día \d+$/ })
      const overflow = () => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)
      const screenshot = async name => { const file = `${name}-${width}.png`; await page.screenshot({ path: join(output, file), fullPage: true }); screenshots.push(file) }
      const audit = async stage => {
        await page.addScriptTag({ path: repoRequire.resolve('axe-core/axe.min.js') })
        const result = await page.evaluate(async () => window.axe.run(document.querySelector('main'), {
          runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
        }))
        accessibility.push({ width, stage, violations: result.violations.map(item => ({ id: item.id, impact: item.impact,
          nodes: item.nodes.map(node => ({ target: node.target, html: node.html, failureSummary: node.failureSummary })) })),
          incomplete: result.incomplete.map(item => ({ id: item.id, nodes: item.nodes.map(node => ({ target: node.target, html: node.html, failureSummary: node.failureSummary })) })) })
      }

      await visit('/despega/a2/coach', '?auth=delayed')
      await page.getByText('Verificando tu sesión para abrir el asistente…', { exact: true }).waitFor()
      check(`${width}: initial identity verification hides all private guidance and transcript`, await page.locator('[data-guided-next-action],textarea,[role="log"]').count() === 0)
      await page.evaluate(() => window.__agenticAuth.releaseAuth())
      await question().waitFor()
      check(`${width}: real fonts have nonzero glyph metrics`, (await page.getByRole('heading', { level: 1 }).boundingBox()).height > 20)
      check(`${width}: initial blank request cannot submit`, await page.getByRole('button', { name: 'Enviar pregunta', exact: true }).isDisabled())
      check(`${width}: saved action is visible`, await page.getByText(ADJUSTMENT_TEXT, { exact: true }).isVisible())
      check(`${width}: initial view fits the viewport`, await overflow())
      const details = page.locator('[data-guided-sources]')
      await details.locator('summary').focus(); await page.keyboard.press('Enter')
      check(`${width}: evidence details open by keyboard`, await details.evaluate(element => element.open))
      check(`${width}: evidence details have a visible focus treatment`, await details.locator('summary').evaluate(element => {
        const style = getComputedStyle(element); return style.boxShadow !== 'none' || style.outlineStyle !== 'none'
      }))
      check(`${width}: saved review date retains its calendar day`, /7/.test(await page.locator('time[datetime="2026-11-07"]').innerText()))
      await audit('initial-context')
      await nextLink().hover(); await audit('next-action-hover')
      await nextLink().focus()
      check(`${width}: continuation has a visible keyboard focus treatment`, await nextLink().evaluate(element => {
        const style = getComputedStyle(element); return style.boxShadow !== 'none' || style.outlineStyle !== 'none'
      }))

      state.plans = [{ status: 503, guidance: fixtures.later.guidance, hold: true }, {}]
      await question().fill(QUESTION)
      await page.getByRole('button', { name: 'Enviar pregunta', exact: true }).hover(); await audit('send-button-hover')
      await page.getByRole('button', { name: 'Enviar pregunta', exact: true }).click()
      await state.received.promise
      check(`${width}: in-flight question is retained read-only`, await question().inputValue() === QUESTION && await question().getAttribute('readonly') !== null)
      check(`${width}: in-flight request cannot be submitted twice`, await page.getByRole('button', { name: 'Preparando respuesta…', exact: true }).isDisabled() && state.posts.length === 1)
      state.release()
      await page.getByRole('alert').waitFor()
      check(`${width}: provider failure keeps the unanswered question`, await question().inputValue() === QUESTION)
      check(`${width}: provider failure does not invent an assistant response`, await page.getByRole('log').getByText(QUESTION, { exact: true }).count() === 0)
      check(`${width}: verified fresh next action survives provider failure`, await nextLink().getAttribute('href') === '/despega/a2/dia-4')
      check(`${width}: error returns focus to the question`, await question().evaluate(element => element === document.activeElement))
      check(`${width}: error state fits the viewport`, await overflow())
      await audit('provider-error'); await screenshot('a2-assistant-provider-error')

      await page.getByRole('button', { name: 'Reintentar pregunta', exact: true }).focus(); await page.keyboard.press('Enter')
      await page.getByRole('log').getByText(ANSWER, { exact: true }).waitFor()
      check(`${width}: retry submits the same question without phantom history`, state.posts.length === 2 && state.posts[0].body.message === state.posts[1].body.message && state.posts.every(post => post.body.conversationHistory.length === 0))
      check(`${width}: successful response clears the editor exactly once`, await question().inputValue() === '' && await page.getByRole('log').getByText(QUESTION, { exact: true }).count() === 1)
      check(`${width}: client sends explicit actor and bounded message envelope`, state.posts.every(post => post.headers['x-dtc-expected-user-id'] === USER && !('context' in post.body) && !('userId' in post.body)))
      state.plans = [{ answer: FOLLOW_UP_ANSWER }]
      await question().fill(FOLLOW_UP); await page.getByRole('button', { name: 'Enviar pregunta', exact: true }).click()
      await page.getByRole('log').getByText(FOLLOW_UP_ANSWER, { exact: true }).waitFor()
      check(`${width}: continuation sends the actual previous exchange`, state.posts[2].body.conversationHistory.length === 2 && state.posts[2].body.conversationHistory[0].content === QUESTION && state.posts[2].body.conversationHistory[1].content === ANSWER)
      check(`${width}: successful dialogue fits the viewport`, await overflow())
      await audit('successful-dialogue'); await screenshot('a2-assistant-dialogue')
      // The delayed-auth fixture applies only to the first mount. Remove its
      // control parameter before checking an ordinary browser reload.
      await page.evaluate(() => history.replaceState(null, '', '/despega/a2/coach'))
      await page.reload(); await question().waitFor()
      check(`${width}: reload does not claim persisted chat history`, !(await page.getByRole('log').innerText()).includes(ANSWER))
      check(`${width}: reload recovers saved guidance independently of chat`, await page.getByText(ADJUSTMENT_TEXT, { exact: true }).isVisible())

      state.plans = [{ status: 429, actor: null }]
      await question().fill(FOLLOW_UP); await page.getByRole('button', { name: 'Enviar pregunta', exact: true }).click()
      await page.getByRole('alert').waitFor()
      check(`${width}: middleware rate limit retains question and canonical action`, await question().inputValue() === FOLLOW_UP && await nextLink().getAttribute('href') === '/despega/a2/dia-3')
      check(`${width}: rate limit communicates the condition`, (await page.getByRole('alert').innerText()).includes('límite de consultas'))

      await visit('/despega/a2/coach')
      await question().waitFor(); state.plans = [{ hold: true, answer: 'LATE_PRIOR_OWNER_RESPONSE' }]
      await page.evaluate(() => { window.__agenticTransport.ignoreAbort = true })
      await question().fill(QUESTION); await page.getByRole('button', { name: 'Enviar pregunta', exact: true }).click()
      await state.received.promise
      await page.evaluate(other => { window.__agenticAuth.emit(other) }, OTHER)
      await page.getByRole('alert').waitFor(); state.release()
      await page.waitForFunction(() => window.__agenticTransport.settled === 1)
      check(`${width}: actor change clears question, prior context and dialogue`, await page.locator('textarea,[data-guided-next-action],[role="log"]').count() === 0)
      check(`${width}: late prior-owner response remains hidden even when cancellation is ignored`, !(await page.locator('main').innerText()).includes('LATE_PRIOR_OWNER_RESPONSE'))
      await audit('session-changed')

      await visit('/despega/a2/coach')
      await question().waitFor(); state.plans = [{ hold: true, answer: 'SILENT_ACTOR_CHANGE_RESPONSE' }]
      await question().fill(QUESTION); await page.getByRole('button', { name: 'Enviar pregunta', exact: true }).click()
      await state.received.promise
      await page.evaluate(other => { window.__agenticAuth.userId = other }, OTHER)
      state.release(); await page.getByRole('alert').waitFor()
      check(`${width}: identity is reverified before applying a delivered response`, await page.locator('textarea,[data-guided-next-action],[role="log"]').count() === 0 && !(await page.locator('main').innerText()).includes('SILENT_ACTOR_CHANGE_RESPONSE'))

      await visit('/despega/a2/coach', '?auth=missing')
      await page.getByRole('alert').waitFor()
      check(`${width}: missing initial session never exposes the server-provided context`, await page.locator('[data-guided-next-action],textarea').count() === 0 && state.posts.length === 0)

      await visit('/despega/dashboard', '?scenario=unavailable')
      await page.locator('[data-guided-next-action]').waitFor()
      check(`${width}: dashboard source failure is explicit`, await page.getByText('No pudimos verificar tu objetivo guardado. Puedes reintentar; tu siguiente paso se conserva.', { exact: true }).isVisible())
      check(`${width}: dashboard retains the authoritative next day`, await nextLink().count() >= 1 && (await nextLink().evaluateAll(links => links.map(link => link.getAttribute('href')))).every(href => href === '/despega/a2/dia-3'))
      check(`${width}: dashboard recovery points to its own page`, await page.getByRole('link', { name: 'Volver a comprobar mi contexto' }).getAttribute('href') === '/despega/dashboard')
      check(`${width}: dashboard fits with unavailable sources`, await overflow())
      await audit('dashboard-unavailable'); await screenshot('guided-dashboard-unavailable')
      await nextLink().last().hover(); await audit('dashboard-next-action-hover')
      await page.getByRole('link', { name: 'Volver a comprobar mi contexto' }).click()
      await page.getByText(ADJUSTMENT_TEXT, { exact: true }).waitFor()
      check(`${width}: context recheck renders the saved action`, await page.locator('[data-guided-adjustment]').count() === 1)

      await visit('/despega/recorrido', '?scenario=personal')
      await page.locator('[data-guided-next-action]').waitFor()
      check(`${width}: personal journey keeps its saved next step`, await page.getByText(ADJUSTMENT_TEXT, { exact: true }).isVisible())
      check(`${width}: personal journey does not add an employment goal`, await page.locator('[data-guided-objective]').count() === 0)
      check(`${width}: journey context has one continuation inside its next-step card`, await page.locator('a[href="/despega/a2/dia-3"]').count() === 1)
      check(`${width}: personal journey fits the viewport`, await overflow())
      await page.locator('[data-guided-sources] summary').focus(); await page.keyboard.press('Enter')
      check(`${width}: journey sources remain keyboard operable`, await page.locator('[data-guided-sources]').evaluate(element => element.open))
      await audit('personal-journey'); await screenshot('guided-personal-journey')
      await page.locator('a[href="/despega/a2/dia-3"]').hover(); await audit('journey-next-action-hover')

      writeFileSync(join(output, 'agentic-browser-progress.json'), JSON.stringify({ widthCompleted: width, checks, accessibility, runtimeErrors, networkFailures, externalRequests, screenshots }, null, 2))
    } finally {
      try { if (context) await context.close() } finally { if (browser) await browser.close(); browser = null }
    }
  }
  check('No uncaught browser runtime error', runtimeErrors.length === 0)
  check('No external browser request', externalRequests.length === 0)
  const violations = accessibility.reduce((sum, audit) => sum + audit.violations.length, 0)
  const incomplete = accessibility.reduce((sum, audit) => sum + audit.incomplete.length, 0)
  const sourcePaths = [
    'components/a2-chat-coach.tsx', 'components/journey/guided-next-action.tsx', 'components/journey/journey-flow-panel.tsx',
    'app/despega/a2/coach/page.tsx', 'app/despega/dashboard/page.tsx', 'app/despega/recorrido/page.tsx',
    'lib/a2/assistant-contract.ts', 'lib/journey/flow.ts', 'lib/journey/next-action.ts', 'app/globals.css', 'app/design-system.css',
  ]
  const result = {
    suite: 'agentic-ui', parentCommit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
    sourceHashes: sourcePaths.map(path => ({ path, sha256: createHash('sha256').update(readFileSync(join(root, path))).digest('hex') })),
    browser: browserVersion, viewports: ['390x844', '1440x844'], checks: checks.length, passed: checks.length,
    real: ['React components and server-page return trees', 'DTC globals.css and design-system.css', 'canonical next-action fixture builders', 'Chromium', 'axe'],
    synthetic: ['session and auth events', 'server read-port results', 'assistant HTTP transport', 'Next links as normal anchors', 'system fonts instead of remote brand fonts'],
    fullAuthenticatedShell: false, liveAuthOrRls: false, liveModelQuality: false,
    accessibility, axeViolations: violations, axeIncomplete: incomplete, runtimeErrors, networkFailures, externalRequests, screenshots, checkNames: checks,
  }
  writeFileSync(join(output, 'agentic-browser-results.json'), JSON.stringify(result, null, 2))
  console.log(JSON.stringify({ suite: result.suite, checks: checks.length, passed: checks.length, axeChecks: accessibility.length, axeViolations: violations, axeIncomplete: incomplete,
    runtimeErrors: runtimeErrors.length, externalRequests: externalRequests.length, browser: browserVersion, output }))
  if (violations) process.exitCode = 1
}

main().catch(error => {
  writeFileSync(join(output, 'agentic-browser-failure.json'), JSON.stringify({ error: error.message, stack: error.stack, checks, accessibility, runtimeErrors, networkFailures, externalRequests, screenshots }, null, 2))
  console.error(error.message); process.exitCode = 1
}).finally(async () => {
  if (browser) await browser.close()
  if (server) { server.closeAllConnections(); await new Promise(done => server.close(done)) }
})
