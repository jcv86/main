// Behavioral coverage of A1 -> A2 evidence, real SSR markup, and server boundaries.
// Source loaders/authentication are synthetic; no live account or database is used.
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')
const React = require('react')
const { renderToStaticMarkup } = require('react-dom/server')
const { createClient: sdkClient } = require('@supabase/supabase-js')
// Existing UI primitives use Next's JSX transform; tsx's jsx:preserve test
// loader uses the classic runtime. This binding affects this test process only.
Object.assign(globalThis, { React })
const { DISC_TEST_QUESTIONS } = require('../lib/disc-test-questions.ts')
const { validateAndScoreDiscResponses } = require('../lib/a1/disc-scoring.ts')
const { buildA1ProfessionalReport } = require('../lib/reports/a1-professional-report.ts')
const { CLARIFICATION_KEY } = require('../lib/a1/individual-understanding.ts')
const { UNDERSTANDING_VERSION } = require('../lib/a1/individual-evidence.ts')
const { buildA2A1Orientation } = require('../lib/a2/a1-orientation.ts')
const legacy = require('../lib/a2/route-recommendation.ts')
const { resolveA2Route, getA2ProgressSnapshot } = require('../lib/a2/server-progress.ts')
const { buildA2RouteAdaptation } = require('../lib/a2/route-adaptation.ts')
const { A2_DAILY_MISSIONS } = require('../lib/a2-missions-full.ts')

const cases = []
const test = (name, run) => cases.push({ name, run })
const revision = 'a'.repeat(64)
function selections(chooseMore, chooseLess) {
  const more = {}, less = {}
  for (const [index, question] of DISC_TEST_QUESTIONS.entries()) {
    more[question.id] = question.opciones[chooseMore(index)].texto
    less[question.id] = question.opciones[chooseLess(index)].texto
  }
  const result = validateAndScoreDiscResponses({ more, less })
  assert.equal(result.valid, true, result.errors.join('; '))
  return result.value
}
const scored = selections(index => index < 20 ? 0 : 1, index => index % 2 ? 2 : 3)
const tied = selections(index => index % 4, index => (index + 1) % 4)
const input = {
  rawScores: scored.scores,
  assessmentResponses: scored.responses,
  sourceRevision: revision,
  c1Responses: { '4': 'Objetivo inicial', '6': ['3-5 horas'] },
  c2Responses: { '1': 'Coordinar mejor mis proyectos', '5': 'Menos de 5 horas' },
}
const report = overrides => buildA1ProfessionalReport({ ...input, ...overrides })
const orientation = overrides => buildA2A1Orientation(report(overrides))

test('the same verified answers retain their MORE and LESS meaning in A2', () => {
  const original = report()
  const snapshot = JSON.stringify(original)
  const actual = buildA2A1Orientation(original)
  assert.equal(actual.state, 'current')
  assert.equal(actual.canContinue, true)
  const items = actual.domains.flatMap(domain => domain.evidence)
  assert.equal(items.length, 28)
  for (const item of items) {
    assert.equal(item.more, scored.responses.more[item.questionId])
    assert.equal(item.less, scored.responses.less[item.questionId])
    assert.notEqual(item.more, item.less)
  }
  assert.equal(JSON.stringify(original), snapshot)
  assert.equal(actual.context.objective, 'Coordinar mejor mis proyectos')
  assert.equal(actual.context.availableTime, 'Menos de 5 horas')
  assert.equal(actual.context.targetRole, null, 'A personal goal does not require a job title')
  for (const field of ['rawScores', 'intensities', 'strengths', 'primaryScore', 'confidence', 'recommendedRoute', 'clarificationEditRevision']) {
    assert.equal(Object.hasOwn(actual, field), false, field)
  }
})

test('opposite net preferences do not become the same A2 interpretation', () => {
  const opposite = validateAndScoreDiscResponses({ more: scored.responses.less, less: scored.responses.more }).value
  for (const key of ['D', 'I', 'S', 'C']) assert.equal(opposite.scores[key], -scored.scores[key])
  const original = orientation()
  const changed = orientation({ rawScores: opposite.scores, assessmentResponses: opposite.responses })
  assert.notDeepEqual(changed.domains, original.domains)
  for (const domain of changed.domains) for (const item of domain.evidence) {
    assert.equal(item.more, scored.responses.less[item.questionId])
    assert.equal(item.less, scored.responses.more[item.questionId])
  }
})

test('a fully answered zero profile remains ambiguous and can continue', () => {
  assert.deepEqual(tied.scores, { D: 0, I: 0, S: 0, C: 0 })
  const actual = orientation({ rawScores: tied.scores, assessmentResponses: tied.responses, dominantPattern: 'D', secondaryPattern: 'I' })
  assert.equal(actual.canContinue, true)
  assert.equal(actual.patternStatus, 'ambiguous')
  assert.ok(actual.patternMessage)
  assert.equal(actual.domains.flatMap(domain => domain.evidence).length, 28)
})

for (const scores of [{ D: 14, I: 14, S: -14, C: -14 }, { D: 28, I: -28, S: 0, C: 0 }, { D: 0, I: 0, S: 0, C: 0 }]) {
  test('historical ties retain uncertainty: ' + JSON.stringify(scores), () => {
    const actual = orientation({ rawScores: scores, assessmentResponses: undefined, dominantPattern: 'D', secondaryPattern: 'I' })
    assert.equal(actual.canContinue, true)
    assert.equal(actual.state, 'historical')
    assert.equal(actual.patternStatus, 'ambiguous')
    assert.deepEqual(actual.domains, [])
  })
}
test('compatible historical integer strings preserve context without invented responses', () => {
  const actual = orientation({ rawScores: { D: '20', I: '8', S: '-14', C: '-14' }, assessmentResponses: undefined })
  assert.equal(actual.canContinue, true)
  assert.equal(actual.state, 'historical')
  assert.equal(actual.context.objective, 'Coordinar mejor mis proyectos')
  assert.deepEqual(actual.domains, [])
  assert.deepEqual(actual.clarifications, [])
})
test('complete historical answers without metadata use the canonical verification', () => {
  const actual = orientation({ assessmentResponses: { more: scored.responses.more, less: scored.responses.less } })
  assert.equal(actual.state, 'current')
  assert.equal(actual.canContinue, true)
})

for (const rawScores of [{}, { D: 4, I: -4 }, { D: '', I: null, S: undefined }]) {
  test('incomplete evidence does not become a neutral profile: ' + JSON.stringify(rawScores), () => {
    const actual = orientation({ rawScores, assessmentResponses: undefined })
    assert.equal(actual.state, 'incomplete')
    assert.equal(actual.canContinue, false)
    assert.equal(actual.patternStatus, 'unavailable')
    assert.equal(actual.context.objective, 'Coordinar mejor mis proyectos')
    assert.deepEqual(actual.domains, [])
  })
}
for (const rawScores of [{ D: Infinity, I: 0, S: 0, C: 0 }, { D: 'bad', I: 0, S: 0, C: 0 }, { D: 4, I: 4, S: 0, C: 0 }, { D: 28, I: 28, S: -28, C: -28 }]) {
  test('invalid evidence is distinguished from missing data: ' + String(rawScores.D), () => {
    const actual = orientation({ rawScores, assessmentResponses: undefined })
    assert.equal(actual.state, 'incompatible')
    assert.equal(actual.canContinue, false)
    assert.deepEqual(actual.domains, [])
  })
}
test('unknown questionnaire versions are not interpreted as the current instrument', () => {
  const actual = orientation({ assessmentResponses: { ...scored.responses, _meta: { questionnaireVersion: 'future.v9' } } })
  assert.equal(actual.state, 'incompatible')
  assert.equal(actual.canContinue, false)
  assert.deepEqual(actual.domains, [])
})
test('mismatching scores and original answers require review', () => {
  const actual = orientation({ rawScores: { D: 21, I: 7, S: -14, C: -14 } })
  assert.equal(actual.canContinue, false)
  assert.equal(actual.state, 'incompatible')
})

const question = report().understanding.questions[0]
const envelope = {
  version: UNDERSTANDING_VERSION, revision, savedAt: '2026-11-02T12:00:00.000Z',
  answers: { selections: { [question.id]: 'no_example' }, recognition: 'not_represents' },
}
test('the person’s disagreement and declined example survive the handoff', () => {
  const actual = orientation({ c2Responses: { ...input.c2Responses, [CLARIFICATION_KEY]: envelope } })
  assert.equal(actual.recognition.id, 'not_represents')
  assert.equal(actual.clarifications.length, 1)
  assert.equal(actual.clarifications[0].isEvidence, false)
  assert.equal(actual.canContinue, true)
})
for (const kind of ['stale', 'invalid']) test(kind + ' clarifications are not presented as current evidence', () => {
  const changed = kind === 'stale' ? { ...envelope, revision: 'b'.repeat(64) } : { ...envelope, answers: { selections: { unknown: 'made-up' }, recognition: 'represents' } }
  const actual = orientation({ c2Responses: { ...input.c2Responses, [CLARIFICATION_KEY]: changed } })
  assert.deepEqual(actual.clarifications, [])
  assert.equal(actual.recognition, null)
  assert.ok(actual.clarificationNotice)
  assert.equal(actual.canContinue, true)
})

function loadSource(relativePath, overrides = {}) {
  const file = path.join(process.cwd(), relativePath)
  const compiled = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText
  const module = { exports: {} }
  new Function('require', 'module', 'exports', compiled)(key => {
    if (Object.hasOwn(overrides, key)) return overrides[key]
    if (key.startsWith('@/')) return require(path.join(process.cwd(), key.slice(2)))
    return require(key)
  }, module, module.exports)
  return module.exports
}

test('real SSR shows provenance and feedback, without scores or invented classifications', () => {
  const { A2CanonicalIntro } = loadSource('components/a2-canonical-intro.tsx', {
    'next/navigation': { useRouter: () => ({ push() {}, refresh() {} }) },
  })
  const value = orientation({ c2Responses: { ...input.c2Responses, '1': '<script>private()</script>', [CLARIFICATION_KEY]: envelope } })
  const html = renderToStaticMarkup(React.createElement(A2CanonicalIntro, { orientation: value }))
  assert.equal((html.match(/Más como tú:/g) || []).length, 28)
  assert.equal((html.match(/Menos como tú:/g) || []).length, 28)
  assert.match(html, /No me representa/)
  assert.match(html, /Queda pendiente un ejemplo/)
  assert.match(html, /&lt;script&gt;private\(\)&lt;\/script&gt;/)
  assert.doesNotMatch(html, /<script>|dimensión dominante|\bmatch\b|\d+%|diagnóstico/)
  assert.match(html, /href="\/despega\/a1-report"/)
  assert.match(html, /href="\/despega\/conozcamonos-2"/)
  assert.match(html, /Comenzar Tu Ruta de 30 días/)
  assert.doesNotMatch(html, new RegExp(revision))
  assert.doesNotMatch(html, /<main\b/, 'The real AppShell supplies the main landmark')
})

test('the declared personal path keeps interview preparation optional in the real intro', () => {
  const { A2CanonicalIntro } = loadSource('components/a2-canonical-intro.tsx', {
    'next/navigation': { useRouter: () => ({ push() {}, refresh() {} }) },
  })
  for (const practicePath of ['persona', 'profesional', 'ambos']) {
    const html = renderToStaticMarkup(React.createElement(A2CanonicalIntro, { orientation: orientation(), practicePath }))
    assert.match(html, /Comenzar Tu Ruta de 30 días/)
    if (practicePath === 'persona') {
      assert.match(html, /las revisiones y el cierre continúan en Tu Ruta/)
      assert.match(html, /Entrenamiento para entrevistas es opcional/)
      assert.doesNotMatch(html, /mercado real|checkpoints|Día 7/)
    } else {
      assert.match(html, /checkpoints desde el Día 7/)
    }
  }
})

class Redirect extends Error { constructor(destination) { super(destination); this.destination = destination } }
const redirect = destination => { throw new Redirect(destination) }
test('server page authenticates before loading, and uses only the authenticated owner', async () => {
  let loads = 0, user = null, value = report()
  const { default: Page } = loadSource('app/despega/a2/intro/page.tsx', {
    'next/navigation': { redirect },
    '@/components/a2-canonical-intro': { A2CanonicalIntro: 'A2CanonicalIntro' },
    '@/lib/journey/service': { getJourneyForCurrentUser: async () => user },
    '@/lib/reports/user-report-data': { loadA1Report: async id => { loads++; assert.equal(id, 'verified-owner'); return value } },
  })
  await assert.rejects(Page, error => error.destination === '/auth/signin')
  assert.equal(loads, 0)
  user = { user: { id: 'verified-owner' } }
  value = null
  await assert.rejects(Page, error => error.destination === '/despega/a1-cerebral')
  value = report({ rawScores: {}, assessmentResponses: undefined })
  await assert.rejects(Page, error => error.destination === '/despega/a1-report')
  value = report({ rawScores: tied.scores, assessmentResponses: tied.responses })
  const result = await Page()
  assert.equal(result.props.orientation.canContinue, true)
  assert.equal(result.props.orientation.patternStatus, 'ambiguous')
  assert.equal(result.props.practicePath, 'ambos')
  user.profile = { camino_foco: 'persona', camino_persona_active: true, camino_profesional_active: false }
  assert.equal((await Page()).props.practicePath, 'persona')
  user.profile = { camino_foco: 'profesional', camino_persona_active: false, camino_profesional_active: true }
  assert.equal((await Page()).props.practicePath, 'profesional')
})

// Exercise the real resolver and Supabase SDK with a synthetic HTTP transport.
// This verifies query boundaries and behavior, not live Postgres/RLS enforcement.
const routeOwner = '00000000-0000-4000-8000-000000000001'
const otherRouteOwner = '00000000-0000-4000-8000-000000000002'
const routeCatalog = ['LIDER_EJ', 'TECH_ESP', 'EMPREND', 'COLAB_EX'].map((codigo, index) => ({
  id: `00000000-0000-4000-8000-00000000010${index}`, codigo,
  nombre: `Ruta guardada ${codigo}`, descripcion: 'Contexto histórico conservado.',
  duracion_dias: 90, activo: true, created_at: '2026-01-01T00:00:00Z',
}))
function routeHarness(tables = {}, failedTable = null) {
  const calls = []
  const rows = {
    a2_user_route_progress: [], a2_route_recommendations: [],
    a2_learning_routes: routeCatalog, a1_tests_results: [],
    despega_journey_state: [], a2_user_task_completions: [], ...tables,
  }
  const client = sdkClient('https://synthetic.invalid', 'synthetic-public-key', {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: async (target, init = {}) => {
      const url = new URL(String(target))
      const table = url.pathname.split('/').at(-1)
      calls.push({ table, method: init.method || 'GET', params: url.searchParams })
      assert.equal(url.hostname, 'synthetic.invalid')
      assert.equal(init.method || 'GET', 'GET', 'Resolving a route must not persist a new assignment')
      assert.ok(Object.hasOwn(rows, table), table)
      if (table === failedTable) return new Response(JSON.stringify({ code: 'XX000', message: 'PRIVATE_DATABASE_DETAIL' }), {
        status: 500, headers: { 'Content-Type': 'application/json' },
      })
      let selected = rows[table]
      for (const [key, value] of url.searchParams) {
        if (value.startsWith('eq.')) selected = selected.filter(row => String(row[key]) === value.slice(3))
        if (value === 'not.is.null') selected = selected.filter(row => row[key] != null)
      }
      if (url.searchParams.has('limit')) selected = selected.slice(0, Number(url.searchParams.get('limit')))
      const columns = url.searchParams.get('select').split(',')
      return new Response(JSON.stringify(selected.map(row => Object.fromEntries(columns.map(key => [key, row[key]])))), {
        status: 200, headers: { 'Content-Type': 'application/json' },
      })
    } },
  })
  return { client, calls }
}

test('a new user gets canonical missions without a career assignment or invented route row', async () => {
  const h = routeHarness()
  const route = await resolveA2Route(routeOwner, h.client)
  assert.equal(route, null)
  assert.deepEqual(h.calls.map(call => call.table), ['a2_user_route_progress', 'a2_route_recommendations'])
  const adaptation = buildA2RouteAdaptation(route, A2_DAILY_MISSIONS[1])
  assert.equal(adaptation.routeCode, 'RUTA_DTC')
  assert.equal(adaptation.routeName, 'Tu Ruta DTC')
  assert.ok(adaptation.qualitySignals.length > 0)
  assert.deepEqual(await getA2ProgressSnapshot(routeOwner, h.client), {
    currentDay: 1, highestUnlockedDay: 1, activeHorizon: 30, source: 'default',
  })
  assert.ok(h.calls.every(call => call.method === 'GET'))
})

test('legacy DISC labels cannot select a route even when their corresponding catalog rows exist', async () => {
  for (const profile_type of ['D-I dominante estratega lider', 'C técnico', 'I creativo emprendedor', 'S colaborador', '']) {
    const h = routeHarness({ a1_tests_results: [{ user_id: routeOwner, profile_type, resultado_texto: profile_type }] })
    assert.equal(await resolveA2Route(routeOwner, h.client), null)
    assert.ok(h.calls.every(call => call.table !== 'a1_tests_results' && call.table !== 'a2_learning_routes'))
    for (const call of h.calls) assert.equal(call.params.get('user_id'), `eq.${routeOwner}`)
  }
})

test('saved route and historical progress stay intact, including an inactive historical catalog row', async () => {
  const saved = { ...routeCatalog[0], activo: false }
  const h = routeHarness({
    a2_learning_routes: [saved, ...routeCatalog.slice(1)],
    a2_user_route_progress: [{ user_id: routeOwner, route_id: saved.id, dia_actual: 41 }],
    a2_route_recommendations: [{ user_id: routeOwner, route_id: routeCatalog[1].id }],
  })
  const route = await resolveA2Route(routeOwner, h.client)
  assert.equal(route.id, saved.id)
  assert.equal(route.name, saved.nombre)
  assert.equal(route.source, 'progress')
  assert.equal(route.durationDays, 90)
  assert.ok(h.calls.every(call => call.table !== 'a2_route_recommendations'))
  assert.deepEqual(await getA2ProgressSnapshot(routeOwner, h.client), {
    currentDay: 41, highestUnlockedDay: 41, activeHorizon: 60, source: 'route',
  })
})

test('an existing recommendation stays compatible without reading A1 or assigning another route', async () => {
  const h = routeHarness({ a2_route_recommendations: [{ user_id: routeOwner, route_id: routeCatalog[2].id }] })
  const route = await resolveA2Route(routeOwner, h.client)
  assert.equal(route.id, routeCatalog[2].id)
  assert.equal(route.source, 'recommendation')
  assert.deepEqual(h.calls.map(call => call.table), ['a2_user_route_progress', 'a2_route_recommendations', 'a2_learning_routes'])
})

test('another owner’s historical route never supplies the current user’s route', async () => {
  const h = routeHarness({
    a2_user_route_progress: [{ user_id: otherRouteOwner, route_id: routeCatalog[0].id }],
    a2_route_recommendations: [{ user_id: otherRouteOwner, route_id: routeCatalog[1].id }],
  })
  assert.equal(await resolveA2Route(routeOwner, h.client), null)
  assert.ok(h.calls.every(call => call.params.get('user_id') === `eq.${routeOwner}`))
})

test('a missing saved catalog row never selects an arbitrary active route', async () => {
  const h = routeHarness({ a2_user_route_progress: [{ user_id: routeOwner, route_id: 'missing-route' }] })
  assert.equal(await resolveA2Route(routeOwner, h.client), null)
  const catalogReads = h.calls.filter(call => call.table === 'a2_learning_routes')
  assert.equal(catalogReads.length, 1)
  assert.equal(catalogReads[0].params.get('id'), 'eq.missing-route')
})

test('database failures do not masquerade as the absence of a saved route', async () => {
  for (const [tables, failedTable] of [
    [{}, 'a2_user_route_progress'],
    [{}, 'a2_route_recommendations'],
    [{ a2_user_route_progress: [{ user_id: routeOwner, route_id: routeCatalog[0].id }] }, 'a2_learning_routes'],
    [{ a2_route_recommendations: [{ user_id: routeOwner, route_id: routeCatalog[0].id }] }, 'a2_learning_routes'],
  ]) {
    const h = routeHarness(tables, failedTable)
    await assert.rejects(() => resolveA2Route(routeOwner, h.client), error => {
      assert.match(error.message, /^No pudimos recuperar/)
      assert.doesNotMatch(error.message, /PRIVATE_DATABASE_DETAIL/)
      return true
    })
    assert.equal(h.calls.at(-1).table, failedTable, 'A failed historical read cannot select a replacement')
  }
})

for (const failedTable of ['despega_journey_state', 'a2_user_task_completions', 'a2_user_route_progress']) {
  test('progress read failure cannot reset the user to day one: ' + failedTable, async () => {
    const h = routeHarness({}, failedTable)
    await assert.rejects(() => getA2ProgressSnapshot(routeOwner, h.client), error => {
      assert.match(error.message, /^No pudimos recuperar/)
      assert.doesNotMatch(error.message, /PRIVATE_DATABASE_DETAIL/)
      return true
    })
    assert.ok(h.calls.every(call => call.method === 'GET'))
    if (failedTable !== 'a2_user_route_progress') {
      assert.ok(h.calls.every(call => call.table !== 'a2_user_route_progress'), 'Failed canonical reads must not reach compatibility defaults')
    }
  })
}

test('legacy bookmarks go through the authenticated compatibility bridge', () => {
  for (const file of ['app/despega/a2/camino/page.tsx', 'app/despega/a2/recomendaciones/page.tsx']) {
    const { default: Page } = loadSource(file, { 'next/navigation': { redirect } })
    assert.throws(Page, error => error.destination === '/despega/a2-routes')
  }
})
test('legacy helper cannot produce NaN, match percentages, or a career from any profile', () => {
  for (const profile of [scored.scores, tied.scores, { D: 28, I: -28, S: 0, C: 0 }, { D: 100, I: 0, S: 0, C: 0 }, {}, null]) {
    const value = legacy.recommendRouteByDISC(profile)
    assert.equal(value.recommendedRoute, null)
    assert.equal(value.confidence, null)
    assert.deepEqual(value.altRoutes, [])
    assert.equal(value.nextPath, '/despega/a2-routes')
    assert.equal(legacy.scoreRouteForDISC('profesional', profile), null)
  }
})
test('retired API preserves authentication and gives a no-store canonical handoff', async () => {
  let user = null, fail = false
  const { GET } = loadSource('app/api/a2/route-recommendation/route.ts', {
    '@/lib/auth/server-user': { resolveServerUser: async () => { if (fail) throw Error('PRIVATE PROVIDER DETAIL'); return user } },
  })
  let response = await GET()
  assert.equal(response.status, 401)
  assert.equal(response.headers.get('cache-control'), 'private, no-store')
  user = { id: 'verified-owner' }
  response = await GET()
  assert.equal(response.status, 410)
  const body = await response.json()
  assert.equal(body.nextPath, '/despega/a2-routes')
  assert.equal(body.recommendedRoute, null)
  assert.equal(body.confidence, null)
  assert.equal(response.headers.get('cache-control'), 'private, no-store')
  fail = true
  response = await GET()
  assert.equal(response.status, 503)
  assert.doesNotMatch(await response.text(), /PRIVATE/)
})

;(async () => {
  let failed = 0
  for (const { name, run } of cases) {
    try { await run() } catch (error) { failed++; console.error(JSON.stringify({ name, error: error.message, stack: error.stack })) }
  }
  console.log(JSON.stringify({ suite: 'a1-a2-evidence-handoff', cases: cases.length, passed: cases.length - failed, failed, renderedMarkup: 'real React SSR', browserChecked: false, liveDatabaseWrites: 0 }))
  if (failed) process.exitCode = 1
})()
