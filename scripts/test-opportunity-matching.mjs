import assert from 'node:assert/strict'
import fs from 'node:fs'
import ts from 'typescript'
import * as matching from '../lib/opportunities/matching.ts'
import * as taxonomy from '../lib/opportunities/taxonomy.ts'
import { planOpportunityQueries } from '../lib/opportunities/search-intent.ts'

const { createOpportunityMatcher, filterOpportunities, searchFiltersFromStoredIntent } = matching
const tests = []
const test = (name, run) => tests.push({ name, run })

const job = (overrides = {}) => ({
  source: 'chiletrabajos',
  source_id: '100',
  title: 'Ingeniero de datos',
  normalized_title: 'Ingeniero de datos',
  company: 'Empresa de prueba',
  location: 'Santiago',
  region: 'Metropolitana',
  work_mode: 'remote',
  category_key: 'leadership', // Deliberately old, incorrect classification.
  category_label: 'Gerencia y Dirección',
  original_url: 'https://www.chiletrabajos.cl/trabajo/100',
  published_at: '2026-10-07',
  expires_at: '2099-01-01',
  verification_status: 'verified_active',
  last_verified_at: '2026-10-07T16:00:00.000Z',
  description: 'Oferta de prueba para validar filtros.',
  requirements: [],
  skills: [],
  ...overrides,
})

test('all area keys and labels resolve directly', () => {
  for (const category of [...taxonomy.OPPORTUNITY_CATEGORIES, taxonomy.OTHER_OPPORTUNITY_CATEGORY]) {
    assert.equal(taxonomy.resolveOpportunityCategory(category.key)?.key, category.key)
    assert.equal(taxonomy.resolveOpportunityCategory(category.label)?.key, category.key)
    assert.equal(taxonomy.categorizeOpportunity(category.label).key, category.key)
  }
  assert.equal(taxonomy.resolveOpportunityCategory('Personas y RRHH')?.key, 'people')
  assert.equal(taxonomy.resolveOpportunityCategory('not an area'), null)
})

test('leadership acronyms do not match inside ordinary job words', () => {
  assert.equal(taxonomy.categorizeOpportunity('Conductor').key, 'operations')
  assert.equal(taxonomy.categorizeOpportunity('Ingeniero de proyectos').key, 'engineering')
  assert.notEqual(taxonomy.categorizeOpportunity('Arquitecto').key, 'leadership')
  assert.notEqual(taxonomy.categorizeOpportunity('Inspector de calidad').key, 'leadership')
  assert.notEqual(taxonomy.categorizeOpportunity('Analista de coordinación').key, 'leadership')
  for (const acronym of ['CEO', 'CFO', 'COO', 'CTO']) {
    assert.equal(taxonomy.categorizeOpportunity(acronym + ' / Chile').key, 'leadership')
  }
})

test('an explicit area selects its category even in precise mode', () => {
  for (const target of ['technology', 'Tecnología, Datos y Producto']) {
    const accepts = createOpportunityMatcher({ targetRoles: [target], breadth: 'precise' })
    assert.equal(accepts(job()), true)
    assert.equal(accepts(job({ title: 'Gerente general' })), false)
  }
  assert.equal(createOpportunityMatcher({ targetRoles: ['Ingeniería y Proyectos'] })(
    job({ title: 'Ingeniero de proyectos' })
  ), true)
})

test('current title overrides obsolete stored categories', () => {
  assert.equal(createOpportunityMatcher({ targetRoles: ['leadership'] })(job()), false)
  assert.equal(createOpportunityMatcher({ targetRoles: ['technology'] })(job()), true)
})

test('precise roles require a full phrase and never widen to the entire area', () => {
  const accepts = createOpportunityMatcher({ targetRoles: ['Contador'], breadth: 'precise' })
  assert.equal(accepts(job({ title: 'Contador senior - Santiago' })), true)
  assert.equal(accepts(job({ title: 'Auditor financiero' })), false)
  assert.equal(accepts(job({ title: 'Subcontador' })), false)
  assert.equal(createOpportunityMatcher({ targetRoles: ['Analista de datos'], breadth: 'precise' })(
    job({ title: 'Analista de metadatos' })
  ), false)
})

test('related broadens using explicit alternatives; precise does not', () => {
  const precise = { targetRoles: ['Gerente de riesgo'], breadth: 'precise' }
  assert.equal(createOpportunityMatcher(precise)(job({ title: 'Risk Manager' })), false)
  assert.equal(createOpportunityMatcher({ ...precise, breadth: 'related' })(
    job({ title: 'Risk Manager' })
  ), true)
  assert.equal(createOpportunityMatcher({ targetRoles: ['Contador'], breadth: 'related' })(
    job({ title: 'Analista contable' })
  ), true)
  assert.equal(createOpportunityMatcher({ targetRoles: ['Contador'], breadth: 'related' })(
    job({ title: 'Auditor financiero' })
  ), false)
})

test('exploratory can widen to a recognized area but never to arbitrary other jobs', () => {
  assert.equal(createOpportunityMatcher({ targetRoles: ['Contador'], breadth: 'exploratory' })(
    job({ title: 'Auditor financiero' })
  ), true)
  assert.equal(createOpportunityMatcher({ targetRoles: ['Barista'], breadth: 'exploratory' })(
    job({ title: 'Peluquero' })
  ), false)
})

test('adjacent queries tolerate accents and do not match inside other words', () => {
  const intent = { targetRoles: ['Analista de crédito'], breadth: 'related', locations: [], workModes: [] }
  assert.ok(planOpportunityQueries(intent).includes('credit manager'))
  assert.ok(planOpportunityQueries({ ...intent, targetRoles: ['Analista de credito'] }).includes('credit manager'))
  assert.equal(planOpportunityQueries({ ...intent, targetRoles: ['Acreditor'] }).includes('credit manager'), false)
})

test('region filters reject unknown locations and never infer region from a title', () => {
  const accepts = createOpportunityMatcher({ locations: ['Metropolitana'] })
  assert.equal(accepts(job()), true)
  assert.equal(accepts(job({ location: 'Concepción', region: 'Biobío' })), false)
  assert.equal(accepts(job({ title: 'Ingeniero de datos - Santiago', location: null, region: null })), false)
  assert.equal(accepts(job({ location: 'Chile', region: null })), false)
  assert.equal(accepts(job({ location: 'Santiago', region: null })), true)
})

test('region aliases, punctuation and conflicting locations are handled conservatively', () => {
  assert.equal(taxonomy.resolveChileRegion('Región Metropolitana'), 'Metropolitana')
  assert.equal(taxonomy.resolveChileRegion('RM'), 'Metropolitana')
  assert.equal(taxonomy.resolveChileRegion("O'Higgins"), 'O’Higgins')
  assert.equal(taxonomy.resolveChileRegion('Biobío'), 'Biobío')
  assert.equal(taxonomy.inferChileRegion('Santiago / Concepción'), null)
  assert.equal(taxonomy.inferChileRegion('Comercial'), null)
  assert.equal(createOpportunityMatcher({ locations: ["O'Higgins"] })(
    job({ location: 'Rancagua', region: 'O’Higgins' })
  ), true)
})

test('one or two selected modes require explicit matching metadata', () => {
  const accepts = createOpportunityMatcher({ workModes: ['hybrid', 'remote'] })
  assert.equal(accepts(job({ work_mode: 'remote' })), true)
  assert.equal(accepts(job({ work_mode: 'hybrid' })), true)
  assert.equal(accepts(job({ work_mode: 'onsite' })), false)
  assert.equal(accepts(job({ work_mode: null })), false)
  assert.equal(accepts(job({ work_mode: 'unknown' })), false)
  assert.equal(createOpportunityMatcher({ workModes: ['onsite'] })(job({ work_mode: 'remote' })), false)
})

test('empty modes and the legacy all-modes encoding mean any modality', () => {
  const unknown = job({ work_mode: null })
  assert.equal(createOpportunityMatcher({ workModes: [] })(unknown), true)
  assert.equal(createOpportunityMatcher({ workModes: ['onsite', 'hybrid', 'remote'] })(unknown), true)
  // "Flexible" has no current UI definition; retain known modes without inventing metadata.
  assert.equal(createOpportunityMatcher({ workModes: ['flexible'] })(unknown), false)
  assert.equal(createOpportunityMatcher({ workModes: ['flexible'] })(job()), true)
  assert.equal(createOpportunityMatcher({ workModes: ['invalid'] })(job()), false)
})

test('role widening preserves region and mode on every selection', () => {
  const filters = {
    targetRoles: ['Contador'], breadth: 'exploratory',
    locations: ['Metropolitana'], workModes: ['remote'],
  }
  const outside = job({ source_id: '200', title: 'Auditor financiero', location: 'Concepción', region: 'Biobío' })
  const unknown = job({ source_id: '201', title: 'Contador', work_mode: null })
  const inside = job({ source_id: '202', title: 'Auditor financiero' })
  assert.deepEqual(filterOpportunities([outside, unknown], filters), [])
  assert.deepEqual(filterOpportunities([outside, unknown, inside], filters).map(item => item.source_id), ['202'])
})

test('the saved intent shape keeps all filters and valid breadth', () => {
  const actual = searchFiltersFromStoredIntent({
    target_roles: ['Tecnología, Datos y Producto', 'Ingeniero de datos'],
    locations: ['Metropolitana'], work_modes: ['hybrid', 'remote'], breadth: 'precise',
  })
  assert.deepEqual(actual, {
    targetRoles: ['Tecnología, Datos y Producto', 'Ingeniero de datos'],
    locations: ['Metropolitana'], workModes: ['hybrid', 'remote'], breadth: 'precise',
  })
  assert.equal(createOpportunityMatcher(actual)(job()), true)
  assert.equal(createOpportunityMatcher(actual)(job({ work_mode: null })), false)
  assert.deepEqual(searchFiltersFromStoredIntent({ target_roles: [' Contador ', 1, 'Contador'], breadth: 'bad' }), {
    targetRoles: ['Contador'], breadth: 'related', locations: [], workModes: [],
  })
  assert.deepEqual(searchFiltersFromStoredIntent(null), {
    targetRoles: [], breadth: 'related', locations: [], workModes: [],
  })
})

// Execute the real route bodies with controlled boundaries. Any new provider dependency,
// database mutation or second index read fails these fixtures instead of making a network call.
function routeHarness(path, { user = { id: 'test-user' }, allowed = true, intent = null, rows = [], indexError = false } = {}) {
  const calls = { admin: 0, index: 0, tables: [], predicates: [] }
  const query = {
    select() { return query },
    eq(key, value) { calls.predicates.push([key, value]); return query },
    async maybeSingle() { return { data: intent, error: null } },
  }
  const supabase = {
    from(table) {
      assert.equal(table, 'career_search_intents')
      calls.tables.push(table)
      return query
    },
  }
  const modules = {
    'next/server': { NextResponse: { json(body, init = {}) {
      return new Response(JSON.stringify(body), { status: init.status || 200, headers: { 'content-type': 'application/json' } })
    } } },
    '@/lib/auth/server-user': { resolveServerUser: async () => user },
    '@/lib/supabase/server': { createAdminClient() { calls.admin++; return supabase } },
    '@/lib/a4/access-control': {
      checkA4Access: async () => ({ canAccess: allowed, reason: 'a3_incomplete' }),
      getA4AccessDenialMessage: () => 'Completa A3 para acceder.',
    },
    '@/lib/opportunities/matching': matching,
    '@/lib/opportunities/taxonomy': taxonomy,
    '@/lib/opportunities/verified-index': { readVerifiedOpportunities: async (_db, limit) => {
      calls.index++
      assert.equal(limit, 500)
      if (indexError) throw new Error('Simulated unavailable index')
      return rows
    } },
  }
  const source = fs.readFileSync(new URL('../' + path, import.meta.url), 'utf8')
  const compiled = ts.transpileModule(source, {
    fileName: path, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText
  const module = { exports: {} }
  new Function('require', 'module', 'exports', compiled)((name) => {
    assert.ok(Object.hasOwn(modules, name), 'Unexpected route dependency: ' + name)
    return modules[name]
  }, module, module.exports)
  return { GET: module.exports.GET, calls }
}

const resultsPath = 'app/api/a4/opportunities/for-me/route.ts'
const catalogPath = 'app/api/a4/opportunities/catalog/route.ts'

test('both actual GET routes stop before database reads for unauthenticated users', async () => {
  for (const path of [resultsPath, catalogPath]) {
    const route = routeHarness(path, { user: null })
    const response = await route.GET(new Request('https://dtc.test/api'))
    assert.equal(response.status, 401)
    assert.equal(route.calls.admin, 0)
    assert.equal(route.calls.index, 0)
  }
})

test('both actual GET routes preserve the A4 access guard', async () => {
  for (const path of [resultsPath, catalogPath]) {
    const route = routeHarness(path, { allowed: false })
    const response = await route.GET(new Request('https://dtc.test/api'))
    assert.equal(response.status, 403)
    assert.equal(route.calls.index, 0)
    assert.deepEqual(route.calls.tables, [])
  }
})

test('results route applies current user intent once and preserves response fields', async () => {
  const intent = {
    target_roles: ['Tecnología, Datos y Producto'],
    breadth: 'related', locations: ['Metropolitana'], work_modes: ['remote'],
  }
  const rows = [
    job(),
    job({ source_id: '101', location: 'Concepción', region: 'Biobío' }),
    job({ source_id: '102', work_mode: null }),
    job({ source_id: '103', title: 'Contador' }),
  ]
  const route = routeHarness(resultsPath, { intent, rows })
  const response = await route.GET()
  assert.equal(response.status, 200)
  const body = await response.json()
  assert.equal(route.calls.index, 1)
  assert.ok(route.calls.predicates.some(([key, value]) => key === 'user_id' && value === 'test-user'))
  assert.equal(body.count, 1)
  assert.equal(body.needs_intent, false)
  assert.equal(body.inventory_status, 'ready')
  assert.equal(body.result_status, 'matches')
  assert.equal(body.opportunities[0].sourceId, '100')
  assert.equal(body.opportunities[0].workMode, 'remote')
  assert.equal(body.opportunities[0].originalUrl, rows[0].original_url)
})

test('catalog and result routes apply the same region and work mode constraints', async () => {
  const rows = [job(), job({ source_id: '101', work_mode: null }), job({ source_id: '102', region: 'Biobío', location: 'Concepción' })]
  const catalog = routeHarness(catalogPath, { rows })
  const response = await catalog.GET(new Request('https://dtc.test/api?region=Metropolitana&mode=remote'))
  assert.equal(response.status, 200)
  const body = await response.json()
  assert.equal(body.total, 1)
  assert.equal(body.total_available, 3)
  assert.equal(body.areas[0].label, 'Tecnología, Datos y Producto')
  assert.equal(catalog.calls.index, 1)
  assert.deepEqual(catalog.calls.tables, [])
})

test('an empty index reports inventory_empty and does not trigger network work', async () => {
  const route = routeHarness(resultsPath, { rows: [], intent: { target_roles: ['Contador'] } })
  const response = await route.GET()
  assert.equal(response.status, 200)
  const body = await response.json()
  assert.equal(body.inventory_status, 'empty')
  assert.equal(body.result_status, 'inventory_empty')
  assert.equal(body.count, 0)
  assert.equal(route.calls.index, 1)
  const catalog = routeHarness(catalogPath)
  const catalogBody = await (await catalog.GET(new Request('https://dtc.test/api'))).json()
  assert.equal(catalogBody.inventory_status, 'empty')
  assert.deepEqual(catalogBody.areas, [])
})

test('a valid inventory with no match does not silently widen the search', async () => {
  const route = routeHarness(resultsPath, {
    rows: [job({ region: 'Biobío', location: 'Concepción' })],
    intent: { target_roles: ['Ingeniero de datos'], locations: ['Metropolitana'], work_modes: ['remote'] },
  })
  const response = await route.GET()
  const body = await response.json()
  assert.equal(response.status, 200)
  assert.equal(body.inventory_status, 'ready')
  assert.equal(body.result_status, 'no_matches')
  assert.equal(body.count, 0)
  assert.equal(route.calls.index, 1)
})

test('an absent intent preserves the available_now contract', async () => {
  const route = routeHarness(resultsPath, { rows: [job({ work_mode: null })] })
  const body = await (await route.GET()).json()
  assert.equal(body.needs_intent, true)
  assert.equal(body.mode, 'available_now')
  assert.equal(body.count, 1)
  assert.equal(body.opportunities[0].workMode, null)
})

test('unavailable index reports an error instead of a healthy empty catalog', async () => {
  for (const path of [resultsPath, catalogPath]) {
    const route = routeHarness(path, { indexError: true })
    const response = await route.GET(new Request('https://dtc.test/api'))
    assert.equal(response.status, 503)
    const body = await response.json()
    assert.equal(typeof body.error, 'string')
    assert.equal(body.inventory_status, undefined)
  }
})

for (const { name, run } of tests) {
  try { await run() } catch (error) {
    throw new Error('Opportunity matching regression failed: ' + name, { cause: error })
  }
}
console.log(JSON.stringify({ opportunity_matching: 'passed', cases: tests.length, route_boundaries: 'passed' }))
