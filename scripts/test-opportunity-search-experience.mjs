import assert from 'node:assert/strict'
import fs from 'node:fs'
import ts from 'typescript'
import { createHash } from 'node:crypto'
import * as matching from '../lib/opportunities/matching.ts'
import * as taxonomy from '../lib/opportunities/taxonomy.ts'
import * as queryHelpers from '../lib/opportunities/search-query.ts'
import { OPPORTUNITY_SOURCE_LABELS } from '../lib/opportunities/types.ts'

const cases = []
const test = (name, run) => cases.push({ name, run })
const ROOT = new URL('../', import.meta.url)
const BASE = { targetRoles: [], breadth: 'related', locations: ['Metropolitana'], workModes: [] }
const ROWS = Array.from({ length: 43 }, (_, index) => ({
  source: 'chiletrabajos', source_id: String(7000000 + index), original_url: 'https://www.chiletrabajos.cl/trabajo/' + (7000000 + index),
  title: 'Ingeniero de datos', company: 'Empresa sintética', location: 'Santiago', region: 'Metropolitana', work_mode: 'remote',
  published_at: null, expires_at: null, verification_status: 'verified_active', last_verified_at: '2026-10-07T22:00:00Z',
  description: 'Oferta sintética, sin datos reales.', requirements: [], skills: [], source_payload: { forbidden: true },
}))
function compile(path, modules) {
  const source = fs.readFileSync(new URL(path, ROOT), 'utf8')
  const output = ts.transpileModule(source, { fileName: path, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText
  const module = { exports: {} }
  new Function('require', 'module', 'exports', output)(name => {
    assert.ok(Object.hasOwn(modules, name), 'Uncontrolled dependency: ' + name)
    return modules[name]
  }, module, module.exports)
  return module.exports
}
function route(path, options = {}) {
  const calls = { tables: [], predicates: [], reads: 0, admin: 0 }
  const rows = options.rows ?? ROWS
  const dbQuery = {
    select(columns) { assert.equal(columns, 'target_roles,breadth,locations,work_modes'); return this },
    eq(key, value) { calls.predicates.push([key, value]); return this },
    async maybeSingle() { return { data: options.intent ?? null, error: options.intentError ?? null } },
  }
  const db = { from(table) { assert.equal(table, 'career_search_intents'); calls.tables.push(table); return dbQuery } }
  const modules = {
    'next/server': { NextResponse: { json: (body, init = {}) => new Response(JSON.stringify(body), { status: init.status ?? 200, headers: { 'Content-Type': 'application/json', ...init.headers } }) } },
    'node:crypto': { createHash },
    '@/lib/auth/server-user': { resolveServerUser: async () => { if (options.authThrows) throw new Error('PRIVATE_AUTH_DETAIL'); return options.anonymous ? null : { id: 'synthetic-owner' } } },
    '@/lib/supabase/server': { createAdminClient: () => { calls.admin++; if (options.adminThrows) throw new Error('PRIVATE_ADMIN_DETAIL'); return db } },
    '@/lib/a4/access-control': { checkA4Access: async () => { if (options.accessThrows) throw new Error('PRIVATE_ACCESS_DETAIL'); return { canAccess: options.allowed !== false, reason: 'a3_incomplete' } }, getA4AccessDenialMessage: () => 'Acceso no disponible.' },
    '@/lib/opportunities/matching': matching, '@/lib/opportunities/taxonomy': taxonomy, '@/lib/opportunities/search-query': queryHelpers,
    '@/lib/opportunities/verified-index': { readVerifiedOpportunityInventory: async (_db, limit) => {
      calls.reads++; assert.equal(limit, 500)
      if (options.indexError) throw new Error('Synthetic unavailable index')
      return { opportunities: rows, scope: { limit, limitReached: options.limited ?? false } }
    } },
  }
  const { GET } = compile(path, modules)
  return { calls, async get(params = '') { const response = await GET(new Request('https://synthetic.test/api?' + params)); return { response, body: await response.json() } } }
}
const RESULTS = 'app/api/a4/opportunities/for-me/route.ts'
const CATALOG = 'app/api/a4/opportunities/catalog/route.ts'

test('both routes preserve auth, A4 guard and private no-store before catalog reads', async () => {
  for (const path of [RESULTS, CATALOG]) for (const option of [{ anonymous: true }, { allowed: false }]) {
    const testRoute = route(path, option)
    const { response } = await testRoute.get('view=explore')
    assert.equal(response.status, option.anonymous ? 401 : 403)
    assert.match(response.headers.get('cache-control'), /private, no-store/)
    assert.equal(testRoute.calls.reads, 0)
    assert.deepEqual(testRoute.calls.tables, [])
  }
})
test('exploration uses explicit role, region and modality without reading saved preferences', async () => {
  const testRoute = route(RESULTS, { intentError: new Error('Must not read saved search') })
  const { response, body } = await testRoute.get('view=explore&role=Ingeniero+de+datos&region=Metropolitana&mode=remote&breadth=precise')
  assert.equal(response.status, 200)
  assert.equal(body.mode, 'explore')
  assert.equal(body.total_matching, 43)
  assert.equal(body.count, 18)
  assert.deepEqual(body.applied_filters, { targetRoles: ['Ingeniero de datos'], locations: ['Metropolitana'], workModes: ['remote'], breadth: 'precise' })
  assert.deepEqual(testRoute.calls.tables, [])
  assert.ok(body.opportunities.every(row => !Object.hasOwn(row, 'source_payload')))
})
test('a saved no-match and a positive exploration are distinct truthful views', async () => {
  const intent = { target_roles: ['Contador'], locations: ['Biobío'], work_modes: ['onsite'], breadth: 'precise' }
  const saved = route(RESULTS, { intent })
  const body = (await saved.get('view=saved&region=Metropolitana')).body
  assert.equal(body.mode, 'saved'); assert.equal(body.result_status, 'no_matches')
  assert.deepEqual(body.applied_filters, matching.searchFiltersFromStoredIntent(intent))
  assert.ok(saved.calls.predicates.some(([key, value]) => key === 'user_id' && value === 'synthetic-owner'))
  const explored = await route(RESULTS, { intent }).get('view=explore&region=Metropolitana')
  assert.equal(explored.body.total_matching, 43)
  assert.equal(explored.body.result_status, 'matches')
})
test('an unavailable saved search never silently falls back to all offers', async () => {
  const saved = route(RESULTS, { intentError: new Error('synthetic') })
  const { response } = await saved.get('view=saved')
  assert.equal(response.status, 500); assert.equal(saved.calls.reads, 0)
})
test('catalog preview counts every selected filter while facets remain available', async () => {
  const { body } = await route(CATALOG).get('region=Metropolitana&mode=remote&role=Contador&breadth=precise')
  assert.equal(body.total, 0)
  assert.equal(body.total_available, 43)
  assert.ok(body.areas.length > 0)
  assert.deepEqual(body.applied_filters.targetRoles, ['Contador'])
})
test('all 43 matching offers can be read in bounded pages without repeated identities', async () => {
  const testRoute = route(RESULTS)
  const first = (await testRoute.get('view=explore')).body
  const second = (await testRoute.get('view=explore&offset=18&snapshot=' + first.pagination.snapshot)).body
  const third = (await testRoute.get('view=explore&offset=36&snapshot=' + first.pagination.snapshot)).body
  assert.deepEqual([first.count, second.count, third.count], [18, 18, 7])
  assert.equal(third.pagination.next_offset, null)
  assert.equal(new Set([...first.opportunities, ...second.opportunities, ...third.opportunities].map(row => row.source + ':' + row.sourceId)).size, 43)
  assert.equal(testRoute.calls.reads, 3)
})
test('changed inventory or changed filters cannot append an incompatible page', async () => {
  const first = (await route(RESULTS).get('view=explore')).body
  for (const [options, query] of [[{ rows: ROWS.slice(1) }, 'view=explore'], [{}, 'view=explore&region=Metropolitana']]) {
    const { response, body } = await route(RESULTS, options).get(query + '&offset=18&snapshot=' + first.pagination.snapshot)
    assert.equal(response.status, 409); assert.equal(body.code, 'inventory_changed')
  }
})
test('malformed or oversized queries fail before reading the inventory', async () => {
  for (const query of ['view=other', 'view=explore&mode=imaginary', 'offset=18', 'offset=-1', 'offset=999', 'offset=1', 'breadth=anything', 'role=', 'view=explore&view=saved', 'role=' + 'a'.repeat(201), Array.from({ length: 9 }, () => 'role=a').join('&')]) {
    const testRoute = route(RESULTS)
    const { response } = await testRoute.get(query)
    assert.equal(response.status, 400, query); assert.equal(testRoute.calls.reads, 0)
  }
})
test('bounded inventory and unavailable/empty states retain distinct response semantics', async () => {
  assert.equal((await route(RESULTS, { limited: true }).get('view=explore')).body.scope.limitReached, true)
  assert.equal((await route(RESULTS, { rows: [] }).get('view=explore')).body.result_status, 'inventory_empty')
  assert.equal((await route(RESULTS, { indexError: true }).get('view=explore')).response.status, 503)
  assert.equal((await route(RESULTS).get()).body.mode, 'available_now')
})

// Execute actual client component bodies with a deterministic hook scheduler.
// UI primitives are inert trees; effects/events/fetch cancellation run unchanged.
const jsx = (type, props) => ({ type, props: props ?? {} })
function nodes(value) {
  if (Array.isArray(value)) return value.flatMap(nodes)
  if (!value || typeof value !== 'object') return []
  return [value, ...nodes(value.props?.children)]
}
function textOf(value) {
  if (Array.isArray(value)) return value.map(textOf).join(' ').replace(/\s+/g, ' ').trim()
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  return value?.props ? textOf(value.props.children) : ''
}
function button(tree, label) {
  const match = nodes(tree).find(node => ['button', 'Button'].includes(node.type) && textOf(node) === label)
  assert.ok(match, 'Missing action ' + label); return match
}
function renderer(path, exportName, initialProps = {}) {
  const state = []; const effects = []; let cursor = 0; let pending = []; let dirty = true; let tree; let props = initialProps
  const react = {
    useState(initial) {
      const index = cursor++
      if (!Object.hasOwn(state, index)) state[index] = typeof initial === 'function' ? initial() : initial
      return [state[index], value => { state[index] = typeof value === 'function' ? value(state[index]) : value; dirty = true }]
    },
    useRef(initial) { const index = cursor++; if (!Object.hasOwn(state, index)) state[index] = { current: initial }; return state[index] },
    useEffect(run, deps) {
      const index = cursor++
      const previous = effects[index]
      if (!previous || !deps || deps.some((value, index) => !Object.is(value, previous.deps[index]))) {
        pending.push(() => { previous?.cleanup?.(); effects[index] = { deps, cleanup: run() } })
      }
    },
  }
  const components = { SearchIntentForm: 'SearchIntentForm', RealOpportunityResults: 'RealOpportunityResults' }
  const modules = {
    react, 'react/jsx-runtime': { jsx, jsxs: jsx, Fragment: 'Fragment' },
    'lucide-react': Object.fromEntries(['ExternalLink', 'MapPin', 'CalendarDays', 'SearchX', 'ArrowRight', 'Search', 'X'].map(name => [name, name])),
    'next/link': { __esModule: true, default: 'Link' },
    '@/components/ui/card': Object.fromEntries(['Card', 'CardContent', 'CardHeader', 'CardTitle'].map(name => [name, name])),
    '@/components/ui/button': { Button: 'Button' },
    '@/lib/opportunities/types': { OPPORTUNITY_SOURCE_LABELS },
    '@/lib/opportunities/search-query': queryHelpers,
    './search-intent-form': components, './real-opportunity-results': components,
  }
  const Component = compile(path, modules)[exportName]
  function render() {
    let count = 0
    do { dirty = false; cursor = 0; tree = Component(props); const work = pending; pending = []; work.forEach(run => run()); assert.ok(++count < 30) } while (dirty)
    return tree
  }
  return {
    get tree() { return render() },
    setProps(next) { props = next; dirty = true; return render() },
    async flush() { for (let i = 0; i < 4; i++) { await new Promise(resolve => setImmediate(resolve)); render() }; return tree },
    unmount() { effects.forEach(effect => effect?.cleanup?.()) },
  }
}
const EXPERIENCE = 'app/despega/a4/job-matching/opportunity-search-experience.tsx'
const FORM = 'app/despega/a4/job-matching/search-intent-form.tsx'
const COMPONENT = 'app/despega/a4/job-matching/real-opportunity-results.tsx'
const publicJob = id => ({ source: 'chiletrabajos', sourceId: id, title: 'Oferta ' + id, company: 'Empresa sintética', location: 'Santiago', originalUrl: 'https://www.chiletrabajos.cl/trabajo/' + id, publishedAt: null, expiresAt: null, verificationStatus: 'verified_active' })
function payload(ids, overrides = {}) {
  return { needs_intent: false, mode: 'explore', opportunities: ids.map(publicJob), applied_filters: BASE, inventory_status: 'ready', total_matching: ids.length, scope: { limit: 500, limitReached: false }, pagination: { offset: 0, next_offset: null, snapshot: 'a'.repeat(64) }, ...overrides }
}
const response = (body, status = 200) => new Response(JSON.stringify(body), { status })
async function mockedFetch(implementation, run) {
  const previous = globalThis.fetch
  globalThis.fetch = implementation
  try { await run() } finally { globalThis.fetch = previous }
}

test('the real parent keeps draft changes separate from applied results and preserves them across views', () => {
  const app = renderer(EXPERIENCE, 'OpportunitySearchExperience', { seedRole: 'Contador' })
  let form = nodes(app.tree).find(node => node.type === 'SearchIntentForm')
  const edited = { ...BASE, targetRoles: ['Contador'], locations: ['Biobío'] }
  form.props.onChange(edited)
  assert.deepEqual(nodes(app.tree).find(node => node.type === 'RealOpportunityResults').props.filters, BASE)
  form = nodes(app.tree).find(node => node.type === 'SearchIntentForm')
  assert.deepEqual(form.props.value, edited)
  form.props.onApply(edited)
  assert.deepEqual(nodes(app.tree).find(node => node.type === 'RealOpportunityResults').props.filters, edited)
  button(app.tree, 'Mi búsqueda guardada').props.onClick()
  assert.equal(nodes(app.tree).find(node => node.type === 'RealOpportunityResults').props.view, 'saved')
  button(app.tree, 'Explorar ofertas').props.onClick()
  assert.deepEqual(nodes(app.tree).find(node => node.type === 'SearchIntentForm').props.value, edited)
  app.unmount()
})
test('an unsubmitted role survives switching to saved search and back without becoming applied', () => {
  const app = renderer(EXPERIENCE, 'OpportunitySearchExperience', {})
  nodes(app.tree).find(node => node.type === 'SearchIntentForm').props.onRoleChange('Analista de datos')
  assert.equal(nodes(app.tree).find(node => node.type === 'SearchIntentForm').props.role, 'Analista de datos')
  button(app.tree, 'Mi búsqueda guardada').props.onClick()
  assert.equal(nodes(app.tree).some(node => node.type === 'SearchIntentForm'), false)
  button(app.tree, 'Explorar ofertas').props.onClick()
  const form = nodes(app.tree).find(node => node.type === 'SearchIntentForm')
  assert.equal(form.props.role, 'Analista de datos')
  assert.deepEqual(form.props.value.targetRoles, [])
  assert.deepEqual(nodes(app.tree).find(node => node.type === 'RealOpportunityResults').props.filters.targetRoles, [])
  app.unmount()
})
test('form exploration and clearing use no POST; only explicit save sends the compatible payload once', async () => {
  const calls = []; const applied = []; const saved = []; const changes = []
  await mockedFetch(async (url, init = {}) => {
    calls.push({ url, init })
    return response(init.method === 'POST' ? { intent: { target_roles: ['Contador'] } } : { total: 0, areas: [], roles: [], inventory_status: 'ready' }, init.method === 'POST' ? 201 : 200)
  }, async () => {
    const value = { ...BASE, targetRoles: ['Contador'] }
    const form = renderer(FORM, 'SearchIntentForm', { role: '', onRoleChange() {}, value, applied: BASE, onChange: next => changes.push(next), onApply: next => applied.push(next), onSaved: () => saved.push(true), saving: false, onSavingChange: () => {} })
    await form.flush()
    nodes(form.tree).find(node => node.type === 'form').props.onSubmit({ preventDefault() {} })
    assert.deepEqual(applied, [value]); assert.equal(calls.filter(call => call.init.method === 'POST').length, 0)
    button(form.tree, 'Limpiar filtros').props.onClick()
    assert.equal(calls.filter(call => call.init.method === 'POST').length, 0)
    await button(form.tree, 'Guardar como mi búsqueda').props.onClick()
    assert.equal(calls.filter(call => call.init.method === 'POST').length, 1)
    assert.deepEqual(JSON.parse(calls.find(call => call.init.method === 'POST').init.body), { ...value, isPrimary: true })
    assert.equal(saved.length, 1); form.unmount()
  })
})
test('catalog response races cannot replace the newer draft availability', async () => {
  const pending = []
  await mockedFetch((url, init) => new Promise(resolve => pending.push({ url, init, resolve })), async () => {
    const props = { role: '', onRoleChange() {}, value: BASE, applied: BASE, onChange() {}, onApply() {}, onSaved() {}, saving: false, onSavingChange() {} }
    const form = renderer(FORM, 'SearchIntentForm', props); form.tree
    form.setProps({ ...props, value: { ...BASE, locations: ['Biobío'] } })
    assert.equal(pending.length, 2); assert.equal(pending[0].init.signal.aborted, true)
    pending[1].resolve(response({ total: 4, areas: [], roles: [], inventory_status: 'ready' })); await form.flush()
    pending[0].resolve(response({ total: 32, areas: [], roles: [], inventory_status: 'ready' })); await form.flush()
    assert.match(textOf(form.tree), /4 ofertas disponibles/); assert.doesNotMatch(textOf(form.tree), /32 ofertas disponibles/)
    form.unmount()
  })
})
test('saved filters remain visible and no matches offers exploration without saving', async () => {
  let explored = 0; const calls = []
  await mockedFetch(async (url, init) => { calls.push({ url, init }); return response(payload([], { mode: 'saved', applied_filters: { ...BASE, targetRoles: ['Contador'], locations: ['Biobío'] } })) }, async () => {
    const ui = renderer(COMPONENT, 'RealOpportunityResults', { view: 'saved', filters: BASE, onExplore: () => explored++ })
    await ui.flush()
    assert.match(textOf(ui.tree), /Tu búsqueda guardada no tiene coincidencias ahora/)
    assert.match(textOf(ui.tree), /Contador/); assert.match(textOf(ui.tree), /Biobío/)
    button(ui.tree, 'Explorar sin cambiar mi búsqueda').props.onClick()
    assert.equal(explored, 1); assert.equal(calls.length, 1)
    assert.equal(calls[0].url, '/api/a4/opportunities/for-me?view=saved')
    assert.equal(calls[0].init.method, undefined); ui.unmount()
  })
})
test('more results append once and report the displayed count against all matches', async () => {
  let calls = 0
  await mockedFetch(async () => response(++calls === 1 ? payload(['7000001'], { total_matching: 2, pagination: { offset: 0, next_offset: 18, snapshot: 'a'.repeat(64) } }) : payload(['7000002'], { total_matching: 2 })), async () => {
    const ui = renderer(COMPONENT, 'RealOpportunityResults', { view: 'explore', filters: BASE })
    await ui.flush(); assert.match(textOf(ui.tree), /Mostrando 1 de 2 ofertas/)
    await button(ui.tree, 'Ver más ofertas').props.onClick(); await ui.flush()
    assert.match(textOf(ui.tree), /Mostrando 2 de 2 ofertas/)
    assert.equal(nodes(ui.tree).filter(node => node.type === 'CardTitle').length, 2)
    ui.unmount()
  })
})
test('a late page from old filters cannot mix with the new applied results', async () => {
  const pending = []
  await mockedFetch((url, init) => new Promise(resolve => pending.push({ url, init, resolve })), async () => {
    const ui = renderer(COMPONENT, 'RealOpportunityResults', { view: 'explore', filters: BASE }); ui.tree
    pending[0].resolve(response(payload(['7000001'], { total_matching: 2, pagination: { offset: 0, next_offset: 18, snapshot: 'a'.repeat(64) } }))); await ui.flush()
    const more = button(ui.tree, 'Ver más ofertas').props.onClick(); ui.tree
    ui.setProps({ view: 'explore', filters: { ...BASE, locations: ['Biobío'] } })
    assert.equal(pending[1].init.signal.aborted, true)
    pending[2].resolve(response(payload(['7000003'], { applied_filters: { ...BASE, locations: ['Biobío'] } }))); await ui.flush()
    pending[1].resolve(response(payload(['7000002']))); await more; await ui.flush()
    assert.match(textOf(ui.tree), /Oferta 7000003/)
    assert.doesNotMatch(textOf(ui.tree), /Oferta 700000[12]/); ui.unmount()
  })
})
test('a changed inventory reloads the first page with a visible explanation', async () => {
  let calls = 0
  await mockedFetch(async () => {
    calls++
    if (calls === 1) return response(payload(['7000001'], { pagination: { offset: 0, next_offset: 18, snapshot: 'a'.repeat(64) } }))
    if (calls === 2) return response({ code: 'inventory_changed', error: 'Changed' }, 409)
    return response(payload(['7000002']))
  }, async () => {
    const ui = renderer(COMPONENT, 'RealOpportunityResults', { view: 'explore', filters: BASE }); await ui.flush()
    await button(ui.tree, 'Ver más ofertas').props.onClick(); await ui.flush()
    assert.match(textOf(ui.tree), /Las ofertas se actualizaron/)
    assert.match(textOf(ui.tree), /Oferta 7000002/); assert.doesNotMatch(textOf(ui.tree), /Oferta 7000001/)
    ui.unmount()
  })
})
test('initial failure has recovery and bounded inventory is never advertised as the entire market', async () => {
  for (const status of [401, 403, 503]) await mockedFetch(async () => response({ error: 'Synthetic' }, status), async () => {
    const ui = renderer(COMPONENT, 'RealOpportunityResults', { view: 'explore', filters: BASE }); await ui.flush()
    assert.match(textOf(ui.tree), status === 401 ? /Volver a iniciar sesión/ : status === 403 ? /Volver a mi recorrido/ : /Reintentar/)
    ui.unmount()
  })
  await mockedFetch(async () => response(payload(['7000001'], { scope: { limit: 500, limitReached: true } })), async () => {
    const ui = renderer(COMPONENT, 'RealOpportunityResults', { view: 'explore', filters: BASE }); await ui.flush()
    assert.match(textOf(ui.tree), /del catálogo consultado/); assert.match(textOf(ui.tree), /hasta 500 ofertas verificadas/)
    ui.unmount()
  })
})

test('auth, admin-client and access failures return a sanitized private 503', async () => {
  for (const path of [RESULTS, CATALOG]) for (const options of [{ authThrows: true }, { adminThrows: true }, { accessThrows: true }]) {
    const { response, body } = await route(path, options).get('view=explore')
    assert.equal(response.status, 503)
    assert.match(response.headers.get('cache-control'), /private, no-store/)
    assert.doesNotMatch(JSON.stringify(body), /PRIVATE_/)
  }
})
test('expired or revoked access while loading more clears cards and exposes the proper recovery', async () => {
  for (const status of [401, 403]) {
    let calls = 0
    await mockedFetch(async () => ++calls === 1 ? response(payload(['7000001'], { pagination: { offset: 0, next_offset: 18, snapshot: 'a'.repeat(64) } })) : response({ error: 'Synthetic boundary' }, status), async () => {
      const ui = renderer(COMPONENT, 'RealOpportunityResults', { view: 'explore', filters: BASE }); await ui.flush()
      await button(ui.tree, 'Ver más ofertas').props.onClick(); await ui.flush()
      assert.match(textOf(ui.tree), status === 401 ? /Volver a iniciar sesión/ : /Volver a mi recorrido/)
      assert.doesNotMatch(textOf(ui.tree), /Oferta 7000001/)
      ui.unmount()
    })
  }
})
test('a page failure retains existing offers and retries that page without duplicates', async () => {
  const urls = []
  await mockedFetch(async url => {
    urls.push(url)
    if (urls.length === 1) return response(payload(['7000001'], { total_matching: 2, pagination: { offset: 0, next_offset: 18, snapshot: 'a'.repeat(64) } }))
    if (urls.length === 2) return response({ error: 'Synthetic unavailable page' }, 503)
    return response(payload(['7000002'], { total_matching: 2 }))
  }, async () => {
    const ui = renderer(COMPONENT, 'RealOpportunityResults', { view: 'explore', filters: BASE }); await ui.flush()
    await button(ui.tree, 'Ver más ofertas').props.onClick(); await ui.flush()
    assert.match(textOf(ui.tree), /Oferta 7000001/)
    await button(ui.tree, 'Reintentar cargar más').props.onClick(); await ui.flush()
    assert.equal(urls[1], urls[2]); assert.match(textOf(ui.tree), /Mostrando 2 de 2/)
    assert.equal(nodes(ui.tree).filter(node => node.type === 'CardTitle').length, 2)
    ui.unmount()
  })
})
test('a declared goal never fabricates a skill gap or matches inside another title word', async () => {
  for (const title of ['Subdirector', 'Director de Operaciones']) await mockedFetch(async () => response(payload(['7000001'], { opportunities: [{ ...publicJob('7000001'), title }] })), async () => {
    const ui = renderer(COMPONENT, 'RealOpportunityResults', { view: 'explore', filters: BASE, profileEvidence: { targetRole: 'Director', strengths: [], missingProof: [], nextBestActions: [] } }); await ui.flush()
    assert.doesNotMatch(textOf(ui.tree), /Trabajar esta brecha|El cargo se alinea|Evidencia de tu perfil relacionada/)
    if (title === 'Subdirector') assert.doesNotMatch(textOf(ui.tree), /Coincidencia de título/)
    else assert.match(textOf(ui.tree), /Coincidencia de título con tu objetivo declarado: Director/)
    ui.unmount()
  })
})
test('save failure keeps the draft and does not announce a successful saved search', async () => {
  let saved = 0; let changes = 0; const saving = []
  await mockedFetch(async (_url, init = {}) => init.method === 'POST' ? response({ error: 'Tu búsqueda cambió mientras guardabas. Vuelve a intentarlo.' }, 409) : response({ total: 0, areas: [], roles: [], inventory_status: 'ready' }), async () => {
    const form = renderer(FORM, 'SearchIntentForm', { role: '', onRoleChange() {}, value: { ...BASE, targetRoles: ['Contador'] }, applied: BASE, onChange: () => changes++, onApply() {}, onSaved: () => saved++, saving: false, onSavingChange: value => saving.push(value) }); await form.flush()
    await button(form.tree, 'Guardar como mi búsqueda').props.onClick(); await form.flush()
    assert.equal(saved, 0); assert.equal(changes, 0); assert.deepEqual(saving, [true, false])
    assert.match(textOf(form.tree), /Tu búsqueda cambió mientras guardabas/)
    form.unmount()
  })
})
test('all three modes truthfully display Any mode for draft and legacy saved filters', async () => {
  const filters = { ...BASE, workModes: ['onsite', 'hybrid', 'remote'] }
  await mockedFetch(async url => response(url.includes('/catalog') ? { total: 1, areas: [], roles: [], inventory_status: 'ready' } : payload(['7000001'], { applied_filters: filters })), async () => {
    const form = renderer(FORM, 'SearchIntentForm', { role: '', onRoleChange() {}, value: filters, applied: filters, onChange() {}, onApply() {}, onSaved() {}, saving: false, onSavingChange() {} }); await form.flush()
    const label = nodes(form.tree).find(node => node.type === 'label' && textOf(node) === 'Cualquier modalidad')
    assert.equal(nodes(label).find(node => node.type === 'input').props.checked, true)
    const ui = renderer(COMPONENT, 'RealOpportunityResults', { view: 'saved', filters: BASE }); await ui.flush()
    const chips = nodes(ui.tree).find(node => node.props['aria-label'] === 'Filtros aplicados')
    assert.match(textOf(chips), /Cualquier modalidad/)
    assert.doesNotMatch(textOf(chips), /Presencial|Híbrido|Remoto/)
    form.unmount(); ui.unmount()
  })
})

let failed = 0
const originalFetch = globalThis.fetch
let externalRequests = 0
globalThis.fetch = async () => { externalRequests++; throw new Error('External network forbidden in this test') }
try {
  for (const { name, run } of cases) {
    try { await run() } catch (error) { failed++; console.error(JSON.stringify({ test: name, error: error.message, stack: error.stack })) }
  }
  assert.equal(externalRequests, 0)
} finally { globalThis.fetch = originalFetch }
console.log(JSON.stringify({ opportunity_search_experience: failed ? 'failed' : 'passed', cases: cases.length, passed: cases.length - failed, failed, externalRequests, liveDatabaseWrites: 0 }))
if (failed) process.exitCode = 1
