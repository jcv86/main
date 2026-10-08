import assert from 'node:assert/strict'
import fs from 'node:fs'
import ts from 'typescript'
import { createHash } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'
import * as matching from '../lib/opportunities/matching.ts'
import * as taxonomy from '../lib/opportunities/taxonomy.ts'
import { planOpportunityQueries } from '../lib/opportunities/search-intent.ts'
import * as searchQuery from '../lib/opportunities/search-query.ts'
import { readVerifiedOpportunities, readVerifiedOpportunityInventory } from '../lib/opportunities/verified-index.ts'
import { matchesPostgrestFilter } from './lib/postgrest-filter-fixture.mjs'

const { createOpportunityEvaluator, createOpportunityMatcher, filterOpportunities, rankOpportunities, searchFiltersFromStoredIntent } = matching
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

test('reviewed translations are symmetric and preserve precise title semantics', () => {
  for (const [spanish, english] of [
    ['Analista de datos', 'Data Analyst'], ['Ingeniera de datos', 'Data Engineer'],
    ['Científico de datos', 'Data Scientist'], ['Ingeniero de software', 'Software Engineer'],
    ['Gerente de riesgo', 'Risk Manager'], ['Gerente de operaciones', 'Operations Manager'],
    ['Analista financiero', 'Financial Analyst'], ['Contadora', 'Accountant'],
    ['Ejecutivo de cuentas', 'Account Executive'], ['Reclutadora', 'Recruiter'],
  ]) for (const [requested, title] of [[spanish, english], [english, spanish]]) {
    const filters = { targetRoles: [requested], breadth: 'related' }
    const match = createOpportunityEvaluator(filters)(job({ title }))
    assert.equal(match?.kind, 'equivalent', requested + ' → ' + title)
    assert.equal(match.reasons[0].code, 'reviewed_equivalent')
    assert.ok(match.reasons[0].label.includes(requested))
    assert.equal(createOpportunityEvaluator({ ...filters, breadth: 'precise' })(job({ title })), null)
  }
})

test('equivalents never cross into distinct data or account occupations', () => {
  const data = createOpportunityEvaluator({ targetRoles: ['Analista de datos'], breadth: 'related' })
  for (const title of ['Data Scientist', 'Data Engineer', 'Database Administrator', 'Metadata Analyst', 'Data Entry Clerk']) {
    assert.equal(data(job({ title })), null, title)
  }
  assert.equal(data(job({ title: 'Senior Data Analyst' }))?.kind, 'equivalent')
  const accounts = createOpportunityEvaluator({ targetRoles: ['Ejecutivo de cuentas'], breadth: 'related' })
  assert.equal(accounts(job({ title: 'Account Executive' }))?.kind, 'equivalent')
  assert.equal(accounts(job({ title: 'Account Manager' })), null)
  assert.equal(accounts(job({ title: 'Accounting Analyst' })), null)
})

test('a translated role keeps seniority and domain qualifiers instead of silently dropping them', () => {
  const senior = createOpportunityEvaluator({ targetRoles: ['Senior Data Analyst'], breadth: 'related' })
  assert.equal(senior(job({ title: 'Senior Analista de datos' }))?.kind, 'equivalent')
  assert.equal(senior(job({ title: 'Analista de datos senior' }))?.kind, 'equivalent')
  assert.equal(senior(job({ title: 'Junior Analista de datos' })), null)
  assert.equal(senior(job({ title: 'Analista de datos' })), null)
  const junior = createOpportunityEvaluator({ targetRoles: ['Analista de datos junior'], breadth: 'related' })
  assert.equal(junior(job({ title: 'Junior Data Analyst' }))?.kind, 'equivalent')
  assert.equal(junior(job({ title: 'Senior Data Analyst' })), null)
  const clinical = createOpportunityEvaluator({ targetRoles: ['Analista de datos clínicos'], breadth: 'related' })
  assert.equal(clinical(job({ title: 'Data Analyst' })), null)
  assert.equal(clinical(job({ title: 'Clinical Data Analyst' })), null)
})

test('a direct target takes precedence over another target translated to the same title', () => {
  const match = createOpportunityEvaluator({ targetRoles: ['Analista de datos', 'Data Analyst'], breadth: 'related' })(job({ title: 'Data Analyst' }))
  assert.equal(match.kind, 'title')
  assert.equal(match.reasons[0].label, 'Coincide con el cargo buscado: Data Analyst')
})

test('one evaluator produces auditable relevance tiers without changing inclusion', () => {
  const filters = { targetRoles: ['Contador', 'technology'], breadth: 'exploratory' }
  const rows = [
    job({ source_id: '5', title: 'Auditor financiero' }),
    job({ source_id: '4', title: 'Data Scientist' }),
    job({ source_id: '3', title: 'Analista contable' }),
    job({ source_id: '2', title: 'Accountant' }),
    job({ source_id: '1', title: 'Contador', last_verified_at: '2026-10-06T18:00:00Z' }),
    job({ source_id: '6', title: 'Nurse' }),
  ]
  const ranked = rankOpportunities(rows, filters)
  assert.deepEqual(ranked.map(value => value.source_id), ['1', '2', '3', '4', '5'])
  assert.deepEqual(ranked.map(value => value.match.kind), ['title', 'equivalent', 'related', 'category', 'expanded_category'])
  assert.deepEqual(ranked.map(value => value.match.rank), [0, 1, 2, 3, 4])
  assert.deepEqual(new Set(ranked.map(value => value.source_id)), new Set(filterOpportunities(rows, filters).map(value => value.source_id)))
  assert.equal(ranked[3].match.reasons[0].code, 'selected_category')
  assert.equal(ranked[4].match.reasons[0].code, 'expanded_category')
  assert.ok(rows.every(value => !Object.hasOwn(value, 'match')))
  assert.equal(rows[0].source_id, '5')
})

test('equivalent and area explanations never relax region or known-mode boundaries', () => {
  for (const targetRoles of [['Analista de datos'], ['technology']]) {
    const evaluate = createOpportunityEvaluator({ targetRoles, breadth: 'exploratory', locations: ['Metropolitana'], workModes: ['remote'] })
    const accepted = evaluate(job({ title: 'Data Analyst' }))
    assert.equal(accepted.reasons.some(value => value.code === 'region' && value.label.includes('Metropolitana')), true)
    assert.equal(accepted.reasons.some(value => value.code === 'work_mode' && value.label.includes('remota')), true)
    for (const change of [{ location: 'Concepción', region: 'Biobío' }, { location: null, region: null }, { work_mode: null }, { work_mode: 'onsite' }]) {
      assert.equal(evaluate(job({ title: 'Data Analyst', ...change })), null)
    }
  }
})

test('unknown mode stays explicit in an all-roles search and never becomes a claimed capability', () => {
  const match = createOpportunityEvaluator()(job({ work_mode: null }))
  assert.equal(match.kind, 'all')
  assert.equal(match.reasons[0].code, 'all_roles')
  assert.equal(match.reasons[1].code, 'work_mode_unreported')
  assert.doesNotMatch(JSON.stringify(match), /probabilidad|contratación|compatibilidad|preparación/i)
})

test('relevance ties preserve verification, source and id order independently of input order', () => {
  const rows = [
    job({ source: 'lever', source_id: 'a', last_verified_at: '2026-10-07T17:00:00Z' }),
    job({ source: 'greenhouse', source_id: 'b', last_verified_at: '2026-10-07T17:00:00Z' }),
    job({ source: 'greenhouse', source_id: 'a', last_verified_at: '2026-10-07T17:00:00.000Z' }),
    job({ source_id: 'recent', last_verified_at: '2026-10-07T18:00:00Z' }),
  ]
  for (const order of [rows, rows.toReversed()]) {
    assert.deepEqual(rankOpportunities(order).map(value => value.source + ':' + value.source_id), [
      'chiletrabajos:recent', 'greenhouse:a', 'greenhouse:b', 'lever:a',
    ])
  }
})

test('clear English occupation families receive useful categories without substring evidence', () => {
  for (const [title, expected] of [
    ['Senior Account Executive', 'commercial'], ['Financial Analyst', 'finance'], ['Accounting Analyst', 'finance'],
    ['Operations Specialist', 'operations'], ['Warehouse Supervisor', 'operations'], ['Supply Chain Planner', 'operations'],
    ['Data Scientist', 'technology'], ['Product Owner', 'technology'], ['Backend Developer', 'technology'],
    ['Salesforce Developer', 'technology'], ['Human Resources Analyst', 'people'], ['Recruiter', 'people'],
    ['Content Strategist', 'marketing'], ['Legal Counsel', 'legal'], ['Executive Assistant', 'administration'],
    ['Civil Engineer', 'engineering'], ['Registered Nurse', 'health'], ['School Teacher', 'education'],
    ['Auxiliar Administrativo', 'administration'], ['Auxiliar de bodega', 'operations'],
    ['Analista financiera', 'finance'], ['Enfermera', 'health'], ['Profesora', 'education'],
  ]) assert.equal(taxonomy.categorizeOpportunity(title).key, expected, title)
  for (const title of ['PeopleSoft Consultant', 'Wholesale Coordinator', 'Biodata Specialist', 'Subcontador', 'Auxiliar']) {
    assert.equal(taxonomy.categorizeOpportunity(title).key, 'other', title)
  }
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
    '@/lib/opportunities/search-query': searchQuery,
    'node:crypto': { createHash },
    '@/lib/opportunities/verified-index': { readVerifiedOpportunities: async (_db, limit) => {
      calls.index++
      assert.equal(limit, 500)
      if (indexError) throw new Error('Simulated unavailable index')
      return rows
    }, readVerifiedOpportunityInventory: async (_db, limit) => {
      calls.index++
      assert.equal(limit, 500)
      if (indexError) throw new Error('Simulated unavailable index')
      return { opportunities: rows, scope: { limit: 500, limitReached: false } }
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
  assert.equal(body.opportunities[0].match.kind, 'category')
  assert.equal(body.opportunities[0].match.reasons[0].code, 'selected_category')
})

test('the actual endpoint ranks before pagination and keeps every matching identity exactly once', async () => {
  const rows = Array.from({ length: 43 }, (_, index) => job({
    source_id: String(800 + index), title: index === 42 ? 'Analista de datos' : 'Data Analyst',
    last_verified_at: index === 42 ? '2026-10-06T18:00:00Z' : '2026-10-07T16:00:00Z',
  }))
  const route = routeHarness(resultsPath, { rows })
  const base = 'https://dtc.test/api?view=explore&role=Analista+de+datos&breadth=related'
  const first = await (await route.GET(new Request(base))).json()
  assert.equal(first.total_matching, 43)
  assert.equal(first.count, 18)
  assert.equal(first.opportunities[0].sourceId, '842')
  assert.equal(first.opportunities[0].match.kind, 'title')
  assert.ok(first.opportunities.slice(1).every(value => value.match.kind === 'equivalent'))
  const second = await (await route.GET(new Request(base + '&offset=18&snapshot=' + first.pagination.snapshot))).json()
  const third = await (await route.GET(new Request(base + '&offset=36&snapshot=' + first.pagination.snapshot))).json()
  const all = [...first.opportunities, ...second.opportunities, ...third.opportunities]
  assert.equal(all.length, 43)
  assert.equal(new Set(all.map(value => value.source + ':' + value.sourceId)).size, 43)
  assert.equal(third.pagination.next_offset, null)
})

test('a changed public title, requirement or explanation invalidates the next page without a new verification timestamp', async () => {
  const rows = Array.from({ length: 20 }, (_, index) => job({ source_id: String(900 + index), title: 'Data Analyst' }))
  const base = 'https://dtc.test/api?view=explore&role=Analista+de+datos&breadth=related'
  const first = await (await routeHarness(resultsPath, { rows }).GET(new Request(base))).json()
  for (const change of [
    { title: 'Analista de datos' }, { description: 'Requisitos actualizados por la empresa.' },
    { requirements: ['Experiencia con SQL'] }, { skills: ['SQL'] }, { work_mode: null },
    { field_evidence: [{ field: 'skills', value: 'SQL', excerpt: 'Experiencia con SQL', origin: 'description', section: 'Requisitos' }] },
  ]) {
    const changedRows = rows.map((row, index) => index === 19 ? { ...row, ...change } : row)
    const response = await routeHarness(resultsPath, { rows: changedRows }).GET(new Request(base + '&offset=18&snapshot=' + first.pagination.snapshot))
    assert.equal(response.status, 409, JSON.stringify(change))
    assert.equal((await response.json()).code, 'inventory_changed')
  }
})

test('equivalent ordered public results reuse a snapshot despite raw row order and private bookkeeping changes', async () => {
  const rows = Array.from({ length: 20 }, (_, index) => job({ source_id: String(950 + index), title: 'Data Analyst' }))
  const base = 'https://dtc.test/api?view=explore&role=Analista+de+datos&breadth=related'
  const first = await (await routeHarness(resultsPath, { rows }).GET(new Request(base))).json()
  const unchanged = rows.toReversed().map(row => ({ ...row, source_payload: { private: 'must not affect public pages' }, updated_at: '2026-10-07T18:00:00Z' }))
  const response = await routeHarness(resultsPath, { rows: unchanged }).GET(new Request(base + '&offset=18&snapshot=' + first.pagination.snapshot))
  assert.equal(response.status, 200)
  const body = await response.json()
  assert.equal(body.pagination.snapshot, first.pagination.snapshot)
  assert.doesNotMatch(JSON.stringify(body), /source_payload|private bookkeeping|updated_at/)
})

test('the result DTO exposes field evidence and derived match reasons through its explicit public projection', async () => {
  const evidence = [{ field: 'skills', value: 'SQL', excerpt: 'Experiencia con SQL', origin: 'description', section: 'Requisitos' }]
  const row = job({
    field_evidence: evidence, source_payload: { private: true }, user_id: 'private-owner',
    match: { rank: -999, kind: 'untrusted', reasons: [{ code: 'untrusted', label: 'Do not trust raw row fields' }] },
  })
  const body = await (await routeHarness(resultsPath, { rows: [row] }).GET(new Request('https://dtc.test/api?view=explore&role=Ingeniero+de+datos'))).json()
  assert.deepEqual(body.opportunities[0].fieldEvidence, evidence)
  assert.equal(body.opportunities[0].match.kind, 'title')
  assert.equal(body.opportunities[0].match.rank, 0)
  assert.doesNotMatch(JSON.stringify(body), /untrusted|source_payload|user_id|private-owner/)
})

test('catalog counts and ordered results agree on reviewed equivalents under the same hard filters', async () => {
  const rows = [job({ title: 'Data Analyst' }), job({ title: 'Data Scientist' }), job({ title: 'Data Analyst', work_mode: null })]
  const query = 'view=explore&role=Analista+de+datos&breadth=related&region=Metropolitana&mode=remote'
  const catalog = await (await routeHarness(catalogPath, { rows }).GET(new Request('https://dtc.test/api?' + query))).json()
  const result = await (await routeHarness(resultsPath, { rows }).GET(new Request('https://dtc.test/api?' + query))).json()
  assert.equal(catalog.total, 1)
  assert.equal(result.total_matching, catalog.total)
  assert.equal(result.opportunities[0].match.kind, 'equivalent')
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

const READ_NOW = new Date('2026-10-08T02:59:59.999Z')
const readableRow = (id, overrides = {}) => job({
  source_id: String(id), original_url: 'https://www.chiletrabajos.cl/trabajo/' + id,
  published_at: '2026-10-07', last_verified_at: '2026-10-07T22:00:00.000Z',
  ...overrides,
})

function indexDb(rows, { ignoreFilters = false } = {}) {
  const calls = []
  return { calls, from(table) {
    assert.equal(table, 'a4_verified_opportunities')
    const filters = [], orders = [], log = { limit: null, logical: [], orders }
    const query = {
      select() { return query },
      eq(field, value) { filters.push(row => row[field] === value); return query },
      gte(field, value) { filters.push(row => row[field] >= value); return query },
      lte(field, value) { filters.push(row => row[field] <= value); return query },
      or(expression) { log.logical.push(expression); filters.push(row => matchesPostgrestFilter(row, expression)); return query },
      order(field, { ascending }) { orders.push([field, ascending]); return query },
      limit(value) { log.limit = value; return query },
      then(resolve, reject) {
        const selected = rows.filter(row => ignoreFilters || filters.every(filter => filter(row)))
        selected.sort((a, b) => {
          for (const [field, ascending] of orders) if (a[field] !== b[field]) return (a[field] < b[field] ? -1 : 1) * (ascending ? 1 : -1)
          return 0
        })
        calls.push(log)
        return Promise.resolve({ data: selected.slice(0, log.limit), error: null }).then(resolve, reject)
      },
    }
    return query
  } }
}

test('five hundred expired rows cannot hide a valid row beyond the previous window', async () => {
  for (const expires_at of ['2026-10-06', READ_NOW.toISOString()]) {
    const expired = Array.from({ length: 500 }, (_, index) => readableRow(7100000 + index, { expires_at }))
    const db = indexDb([...expired, readableRow(7200000)])
    const inventory = await readVerifiedOpportunityInventory(db, 500, { now: READ_NOW })
    assert.deepEqual(inventory.opportunities.map(row => row.source_id), ['7200000'])
    assert.deepEqual(inventory.scope, { limit: 500, limitReached: false })
    assert.equal(db.calls.length, 1)
    assert.equal(db.calls[0].limit, 500)
  }
})

test('five hundred scheduled publications are excluded before the bounded selection', async () => {
  for (const published_at of ['2026-10-08', '2026-10-08T03:00:00.000Z']) {
    const scheduled = Array.from({ length: 500 }, (_, index) => readableRow(7100000 + index, { published_at }))
    const rows = await readVerifiedOpportunities(indexDb([...scheduled, readableRow(7200000)]), 500, { now: READ_NOW })
    assert.deepEqual(rows.map(row => row.source_id), ['7200000'])
  }
})

test('expiry and publication guards are conjunctive and defend against ignored database filters', async () => {
  const rows = [
    readableRow(7100001, { expires_at: '2026-10-06', published_at: null }),
    readableRow(7100002, { expires_at: null, published_at: '2026-10-09' }),
    readableRow(7100003, { expires_at: 'bad', published_at: null }),
    readableRow(7100004, { expires_at: null, published_at: 'bad' }),
    readableRow(7100005, { expires_at: null, published_at: null }),
  ]
  for (const ignoreFilters of [false, true]) {
    const result = await readVerifiedOpportunities(indexDb(rows, { ignoreFilters }), 500, { now: READ_NOW })
    assert.deepEqual(result.map(row => row.source_id), ['7100005'])
  }
})

test('date-only expiry and publication follow Chile midnight in summer and winter', async () => {
  for (const [day, before, midnight] of [
    ['2026-10-07', '2026-10-08T02:59:59.999Z', '2026-10-08T03:00:00.000Z'],
    ['2026-07-07', '2026-07-08T03:59:59.999Z', '2026-07-08T04:00:00.000Z'],
  ]) {
    const rows = [readableRow(7100001, { published_at: day, expires_at: day, last_verified_at: before })]
    assert.equal((await readVerifiedOpportunities(indexDb(rows), 500, { now: new Date(before) })).length, 1)
    assert.equal((await readVerifiedOpportunities(indexDb(rows), 500, { now: new Date(midnight) })).length, 0)
  }
})

test('explicit-offset legacy timestamps retain their real instant semantics', async () => {
  const now = new Date('2026-10-07T21:00:00.000Z')
  const rows = [
    readableRow(7100001, { expires_at: '2026-10-07T18:00:00-03:00' }),
    readableRow(7100002, { expires_at: '2026-10-07T18:00:01-03:00' }),
    readableRow(7100003, { published_at: '2026-10-07T18:00:01-03:00' }),
    readableRow(7100004, { published_at: '2026-10-07T18:00:00-03:00' }),
  ].map(row => ({ ...row, last_verified_at: now.toISOString() }))
  assert.deepEqual((await readVerifiedOpportunities(indexDb(rows), 500, { now })).map(row => row.source_id), ['7100002', '7100004'])
})

test('a bounded inventory has stable ties and never claims completeness at the cap', async () => {
  const rows = [readableRow(7100003), readableRow(7100001), readableRow(7100002)]
  for (const order of [rows, rows.toReversed()]) {
    const db = indexDb(order)
    const result = await readVerifiedOpportunityInventory(db, 2, { now: READ_NOW })
    assert.deepEqual(result.opportunities.map(row => row.source_id), ['7100001', '7100002'])
    assert.deepEqual(result.scope, { limit: 2, limitReached: true })
    assert.deepEqual(db.calls[0].orders, [['last_verified_at', false], ['source', true], ['source_id', true]])
  }
})

test('the real Supabase builder sends one combined temporal filter without overwriting clauses', async () => {
  let calls = 0
  const client = createClient('https://synthetic.supabase.co', 'synthetic-anon-key', {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: async (input, init) => {
      calls++
      assert.equal(init.method, 'GET')
      const url = new URL(String(input))
      const clauses = url.searchParams.getAll('or')
      assert.equal(clauses.length, 1)
      const expression = clauses[0].slice(1, -1)
      assert.ok(expression.startsWith('and(or(expires_at.'))
      assert.ok(expression.includes('or(published_at.'))
      assert.equal(matchesPostgrestFilter(readableRow(7100001, { expires_at: '2026-10-06' }), expression), false)
      assert.equal(matchesPostgrestFilter(readableRow(7100001, { published_at: '2026-10-09' }), expression), false)
      assert.equal(matchesPostgrestFilter(readableRow(7100001), expression), true)
      assert.equal(url.searchParams.get('limit'), '500')
      assert.equal(url.searchParams.get('order'), 'last_verified_at.desc,source.asc,source_id.asc')
      return new Response('[]', { status: 200, headers: { 'content-type': 'application/json' } })
    } },
  })
  await readVerifiedOpportunityInventory(client, 500, { now: READ_NOW })
  assert.equal(calls, 1)
})

for (const { name, run } of tests) {
  try { await run() } catch (error) {
    throw new Error('Opportunity matching regression failed: ' + name, { cause: error })
  }
}
console.log(JSON.stringify({ opportunity_matching: 'passed', cases: tests.length, route_boundaries: 'passed' }))
