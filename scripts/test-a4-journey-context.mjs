import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const USER = '00000000-0000-4000-8000-000000000501'
const OTHER = '00000000-0000-4000-8000-000000000502'
const NOW = new Date('2026-10-07T23:00:00Z')
const DATE = '2026-10-06T12:00:00Z'
const SECRET = 'SYNTHETIC_PRIVATE_ERROR'
const cases = []
const test = (name, run) => cases.push({ name, run })
const valid = () => ({
  career_identities: [{ user_id: USER, target_roles: ['Analista de datos'], updated_at: DATE }],
  a1_cerebral_assessment: [{ user_id: USER, completed_at: DATE }],
  a2_user_task_completions: [{ user_id: USER, day: 1, completed_at: DATE }],
  a3_session_attempts: [{ user_id: USER, module_id: 'career-mirror', status: 'completed', session_completed_at: DATE }],
})
const empty = () => Object.fromEntries(Object.keys(valid()).map(table => [table, []]))
function harness(options = {}) {
  const tables = { dtc_documents: [], a4_verified_signals: [], a4_decision_log: [], a4_daily_evidence_snapshots: [], ...structuredClone(options.tables ?? valid()) }
  const queries = []
  class Query {
    constructor(table) { assert.ok(table in tables); this.table = table; this.filters = []; this.max = Infinity; this.single = false }
    select(columns, options = {}) { assert.ok(!columns.includes('*')); this.columns = columns; this.exactCount = options.count === 'exact'; return this }
    eq(key, value) { this.filters.push(['eq', key, value]); return this }
    not(key, op, value) { assert.equal(op, 'is'); assert.equal(value, null); this.filters.push(['notnull', key]); return this }
    order() { return this }
    limit(value) { this.max = value; return this }
    maybeSingle() { this.single = true; return this }
    then(ok, fail) { return this.execute().then(ok, fail) }
    async execute() {
      queries.push({ table: this.table, columns: this.columns, filters: this.filters, max: this.max })
      const fault = options.fault?.(this.table)
      if (fault === 'throw') throw new Error(SECRET)
      if (fault) return fault
      const result = tables[this.table].filter(row => this.filters.every(([op, key, value]) => op === 'eq' ? row[key] === value : row[key] != null)).slice(0, this.max)
        .map(row => Object.fromEntries(this.columns.split(',').map(key => [key, row[key]])))
      return { data: this.single ? result[0] ?? null : result, error: null, count: this.exactCount ? options.a3Count ?? result.length : null }
    }
  }
  const db = { auth: { getUser: async () => ({ data: { user: options.authUser === null ? null : { id: options.authUser ?? USER } }, error: options.authError ?? null }) }, from: table => new Query(table) }
  const jsx = (type, props, key) => typeof type === 'function' ? type(props) : { type, props: props ?? {}, key }
  const loaded = new Map()
  const stubs = {
    'server-only': {}, '@/lib/supabase/server': { createClient: async () => { if (options.clientFails) throw new Error(SECRET); return db }, createAdminClient: () => db },
    'react/jsx-runtime': { jsx, jsxs: jsx, Fragment: 'fragment' },
    'next/link': { __esModule: true, default: 'a' },
    '@/components/ui/card': { Card: 'card', CardContent: 'content' },
    '@/components/ui/button': { Button: 'button' }, '@/components/ui/badge': { Badge: 'badge' },
    '@/components/layout/page-foundation': { PageContainer: 'main', PageHeader: 'header', PageStack: 'stack' },
    'lucide-react': new Proxy({}, { get: (_target, name) => name === '__esModule' ? true : 'icon:' + String(name) }),
    '@/components/a4/daily-snapshot-history': { DailySnapshotHistory: 'snapshots' },
    '@/components/a4/evidence-pulse': { EvidencePulse: 'pulse' },
    '@/components/a4/strategic-radar-workspace': { StrategicRadarWorkspace: 'workspace' },
    '@/lib/a4/daily-snapshots': { normalizeA4DailySnapshot: () => assert.fail('No snapshots in synthetic fixture') },
    '@/lib/journey/service': { requireJourneyModule: async module => {
      assert.equal(module, 'A4'); return { user: { id: USER }, access: { a1: true, a2: false, a3: false, a4: true }, a4AccessSource: 'qa_entitlement', state: { a4UnlockedAt: null } }
    } },
    '@/lib/a4/journey-context': { loadA4JourneyContext: (userId, options) => api.readA4JourneyContext(db, userId, { now: NOW, ...options }) },
  }
  function load(path) {
    if (loaded.has(path)) return loaded.get(path)
    const compiled = ts.transpileModule(readFileSync(resolve(ROOT, path), 'utf8'), { fileName: path, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText
    const module = { exports: {} }
    new Function('require', 'module', 'exports', compiled)(name => {
      if (name in stubs) return stubs[name]
      if (name === '@/components/a4/journey-context-card') return load('components/a4/journey-context-card.tsx')
      assert.equal(name, '@/lib/a3/module-catalog')
      return load('lib/a3/module-catalog.ts')
    }, module, module.exports)
    loaded.set(path, module.exports); return module.exports
  }
  const api = load('lib/a4/journey-context.ts')
  return { ...api, tables, queries, db, load, run: options => api.readA4JourneyContext(db, USER, { now: NOW, ...options }) }
}
function nodes(value) {
  if (value == null || typeof value === 'boolean') return []
  if (Array.isArray(value)) return value.flatMap(nodes)
  return typeof value === 'object' ? [value, ...nodes(value.props?.children)] : [value]
}
const visible = tree => nodes(tree).filter(node => typeof node === 'string' || typeof node === 'number').join(' ')

test('canonical context is descriptive, uses bounded explicit reads and does not write', async () => {
  const h = harness(), before = structuredClone(h.tables), result = await h.run()
  assert.equal(result.status, 'available'); assert.equal(result.identity.targetRole, 'Analista de datos')
  assert.equal(result.a2.completedDays, 1); assert.equal(result.a3.completedModules, 1)
  assert.equal(h.queries.length, 4); assert.deepEqual(h.tables, before)
  for (const query of h.queries) assert.ok(query.filters.some(([op, key, value]) => op === 'eq' && key === 'user_id' && value === USER))
  assert.ok(!JSON.stringify(result).match(/score|readiness|strength|responses|feedback|user_id/))
})
test('successful absence is empty with truthful zero counts', async () => {
  const result = await harness({ tables: empty() }).run()
  assert.equal(result.status, 'empty'); assert.equal(result.a2.completedDays, 0); assert.equal(result.a3.completedModules, 0)
  assert.equal(result.identity.targetRole, null); assert.equal(result.a1.completedAt, null)
})
test('session missing, different identity and authentication failure never query personal tables', async () => {
  for (const options of [{ authUser: null }, { authUser: OTHER }, { authError: { message: SECRET } }]) {
    const h = harness(options), result = await h.run()
    assert.equal(result.status, 'degraded'); assert.equal(h.queries.length, 0); assert.equal(result.a2.completedDays, null)
    assert.ok(!JSON.stringify(result).includes(SECRET))
  }
})
test('server client initialization failure is unavailable without raw errors', async () => {
  const result = await harness({ clientFails: true }).loadA4JourneyContext(USER)
  assert.equal(result.status, 'degraded'); assert.ok(!JSON.stringify(result).includes(SECRET))
})
test('foreign rows do not contribute objectives or progress', async () => {
  const tables = Object.fromEntries(Object.entries(valid()).map(([table, rows]) => [table, rows.map(row => ({ ...row, user_id: OTHER }))]))
  const result = await harness({ tables }).run(); assert.equal(result.status, 'empty')
})
test('each failed section degrades independently and preserves verified sections', async () => {
  for (const [table, key] of [['career_identities', 'identity'], ['a1_cerebral_assessment', 'a1'], ['a2_user_task_completions', 'a2'], ['a3_session_attempts', 'a3']]) {
    for (const fault of [{ data: null, error: { code: '42P01', message: SECRET } }, 'throw']) {
      const result = await harness({ fault: candidate => candidate === table ? fault : null }).run()
      assert.equal(result.status, 'degraded'); assert.equal(result[key].status, 'unavailable')
      for (const other of ['identity', 'a1', 'a2', 'a3'].filter(other => other !== key)) assert.equal(result[other].status, 'available')
      assert.ok(!JSON.stringify(result).includes(SECRET))
    }
  }
})
test('malformed or null collection responses are unavailable, not empty', async () => {
  for (const table of ['a2_user_task_completions', 'a3_session_attempts']) {
    for (const data of [null, {}, 'invalid']) {
      const result = await harness({ fault: candidate => candidate === table ? { data, error: null } : null }).run()
      assert.equal(result[table.startsWith('a2') ? 'a2' : 'a3'].status, 'unavailable')
    }
  }
})
test('duplicate tasks and repeated sessions do not inflate unique days or modules', async () => {
  const tables = valid(); tables.a2_user_task_completions.push({ ...tables.a2_user_task_completions[0] })
  tables.a3_session_attempts.push({ ...tables.a3_session_attempts[0] })
  const result = await harness({ tables }).run()
  assert.equal(result.a2.completedDays, 1); assert.equal(result.a3.completedModules, 1)
})
test('unfinished activities and sessions are not completions', async () => {
  const tables = valid(); tables.a2_user_task_completions[0].completed_at = null; tables.a3_session_attempts[0].status = 'in_progress'
  const result = await harness({ tables }).run(); assert.equal(result.a2.status, 'empty'); assert.equal(result.a3.status, 'empty')
})
test('future dates cannot appear as verified completed evidence', async () => {
  for (const [table, field, key] of [['career_identities', 'updated_at', 'identity'], ['a1_cerebral_assessment', 'completed_at', 'a1'], ['a2_user_task_completions', 'completed_at', 'a2'], ['a3_session_attempts', 'session_completed_at', 'a3']]) {
    const tables = valid(); tables[table][0][field] = '2027-01-01T00:00:00Z'
    assert.equal((await harness({ tables }).run())[key].status, 'unavailable')
  }
})
test('invalid dates and out of range or unknown completion identifiers are unavailable', async () => {
  for (const [table, field, value, key] of [['a2_user_task_completions', 'day', 91, 'a2'], ['a2_user_task_completions', 'day', '1', 'a2'], ['a3_session_attempts', 'module_id', 'invented-module', 'a3'], ['a1_cerebral_assessment', 'completed_at', 'bad-date', 'a1']]) {
    const tables = valid(); tables[table][0][field] = value
    assert.equal((await harness({ tables }).run())[key].status, 'unavailable')
  }
})
test('unknown historic session dates remain explicitly unknown rather than generated now', async () => {
  const tables = valid(); tables.a3_session_attempts[0].session_completed_at = null
  const result = await harness({ tables }).run(); assert.equal(result.a3.status, 'available'); assert.equal(result.a3.lastCompletedAt, null)
})
test('a bounded truncated collection never becomes a claimed complete count', async () => {
  for (const [table, count, key] of [['a2_user_task_completions', 501, 'a2'], ['a3_session_attempts', 201, 'a3']]) {
    const tables = valid(); tables[table] = Array.from({ length: count }, () => ({ ...tables[table][0] }))
    const result = await harness({ tables }).run(); assert.equal(result[key].status, 'unavailable')
  }
})
test('Radar reuses its owner-scoped A3 result without an extra query', async () => {
  const h = harness(); const result = await h.run({ a3Sessions: Promise.resolve({ data: [{ module_id: 'career-mirror', status: 'completed', session_completed_at: DATE }, { module_id: 'job-decoder', status: 'in_progress' }], error: null, count: 2 }) })
  assert.equal(result.a3.completedModules, 1); assert.equal(h.queries.length, 3)
  assert.ok(!h.queries.some(query => query.table === 'a3_session_attempts'))
})
test('a failed reused A3 result is isolated and does not trigger a fallback read', async () => {
  const h = harness(); const result = await h.run({ a3Sessions: Promise.resolve({ data: null, error: { message: SECRET } }) })
  assert.equal(result.a3.status, 'unavailable'); assert.equal(result.identity.status, 'available'); assert.equal(h.queries.length, 3)
})
test('an exact shared owner count detects truncation independently of the API row cap', async () => {
  const h = harness(), data = Array.from({ length: 1000 }, () => ({ module_id: 'career-mirror', status: 'completed', session_completed_at: DATE }))
  const result = await h.run({ a3Sessions: Promise.resolve({ data, error: null, count: 1001 }) })
  assert.equal(result.a3.status, 'unavailable'); assert.equal(result.a3.completedModules, null)
  assert.equal(h.queries.length, 3)
})
test('reused A3 requires exact count and admits a complete small result', async () => {
  for (const count of [undefined, null, 0, 2]) {
    const data = [{ module_id: 'career-mirror', status: 'completed', session_completed_at: DATE }]
    const result = await harness().run({ a3Sessions: Promise.resolve({ data, error: null, count }) })
    assert.equal(result.a3.status, 'unavailable')
  }
  const data = [{ module_id: 'career-mirror', status: 'completed', session_completed_at: DATE }]
  const result = await harness().run({ a3Sessions: Promise.resolve({ data, error: null, count: 1 }) })
  assert.equal(result.a3.completedModules, 1)
})
test('compact context starts collapsed and links route records according to available evidence', async () => {
  for (const h of [harness(), harness({ tables: empty() })]) {
    const context = await h.run(), tree = h.load('components/a4/journey-context-card.tsx').JourneyContextCard({ context, compact: true })
    const list = nodes(tree), details = list.find(node => node?.type === 'details')
    assert.ok(details); assert.ok(!details.props.open)
    const links = list.filter(node => node?.type === 'a')
    assert.equal(links[0].props.href, context.a1.status === 'available' ? '/despega/a1-report' : '/despega/a1-cerebral')
    assert.ok(links.every(link => link.props.className.includes('min-h-11')))
    assert.ok(links.slice(1).every(link => link.props.href === '/despega/recorrido'))
  }
})
test('declared target roles are validated and empty roles do not fabricate a goal', async () => {
  for (const [value, status] of [[[], 'empty'], [['  '], 'empty'], [null, 'unavailable'], [[{ role: 'invented' }], 'unavailable'], [['x'.repeat(201)], 'unavailable']]) {
    const tables = valid(); tables.career_identities[0].target_roles = value
    assert.equal((await harness({ tables }).run()).identity.status, status)
  }
})
test('a subsequent request reflects changed source data rather than a cross-request cache', async () => {
  const h = harness(); assert.equal((await h.run()).identity.targetRole, 'Analista de datos')
  h.tables.career_identities = []; assert.equal((await h.run()).identity.targetRole, null)
})
test('card distinguishes empty and degraded, states provenance, and never displays readiness scores', async () => {
  for (const h of [harness(), harness({ tables: empty() }), harness({ fault: () => ({ data: null, error: { message: SECRET } }) })]) {
    const context = await h.run(), card = h.load('components/a4/journey-context-card.tsx').JourneyContextCard({ context })
    const text = visible(card); assert.match(text, /Fuente:/); assert.match(text, /No miden preparación laboral/)
    assert.doesNotMatch(text, /\b(?:50|60|53)\s*\/\s*100|No hay brechas|CV\s*\d|Entrevista\s*\d/)
    if (context.status === 'empty') assert.match(text, /Aún no hay registros completados/)
    if (context.status === 'degraded') assert.match(text, /Parte del contexto no está disponible/)
    assert.ok(!text.includes(SECRET))
  }
})
test('active pages no longer query the legacy document profile or accept readiness fields', () => {
  for (const path of ['app/despega/a4/page.tsx', 'app/despega/a4/job-matching/page.tsx']) {
    const source = readFileSync(resolve(ROOT, path), 'utf8')
    assert.match(source, /loadA4JourneyContext/); assert.doesNotMatch(source, /getLiveUserProfile|profile-snapshot|cvReadiness|applicationReadiness|interviewReadiness/)
  }
})
function sessions(scores) {
  return scores.map(score => ({ user_id: USER, module_id: 'career-mirror', status: 'completed', score, created_at: DATE, session_completed_at: DATE }))
}
function kpi(tree, label) {
  const card = nodes(tree).find(node => node?.type === 'card' && visible(node).includes(label))
  assert.ok(card, label + ' must remain available as a card')
  return visible(card)
}
test('Radar average ignores absent scores: null, empty and 80 yields only 80/100', async () => {
  const tables = valid(); tables.a3_session_attempts = sessions([null, '', 80])
  const h = harness({ tables }), tree = await h.load('app/despega/a4/page.tsx').default()
  assert.match(kpi(tree, 'Promedio de Entrenamiento'), /80\/100/)
  assert.match(kpi(tree, 'Promedio de Entrenamiento'), /1 sesión completada con puntaje válido/)
  assert.match(kpi(tree, 'Módulos A3 verificados'), /1\/10/)
  assert.match(kpi(tree, 'Módulos A3 verificados'), /3 sesiones completadas registradas/)
})
test('Radar rejects malformed, non-finite and out-of-range scores without replacing them by zero', async () => {
  const tables = valid(); tables.a3_session_attempts = sessions([null, '', ' ', 'not-number', false, [], {}, Number.NaN, Infinity, -1, 101])
  const tree = await harness({ tables }).load('app/despega/a4/page.tsx').default()
  const text = kpi(tree, 'Promedio de Entrenamiento')
  assert.match(text, /—/); assert.match(text, /Sin puntajes válidos registrados/); assert.doesNotMatch(text, /0\/100/)
})
test('Radar preserves genuine zero and numeric scores but excludes unfinished sessions', async () => {
  const tables = valid(); tables.a3_session_attempts = [...sessions([0, '80']), { ...sessions([100])[0], status: 'in_progress' }]
  const tree = await harness({ tables }).load('app/despega/a4/page.tsx').default()
  assert.match(kpi(tree, 'Promedio de Entrenamiento'), /40\/100/)
  assert.match(kpi(tree, 'Módulos A3 verificados'), /2 sesiones completadas registradas/)
})
test('Radar exact count1001/data1000 hides partial KPIs and keeps Radar and opportunities usable', async () => {
  const tables = valid(); tables.a3_session_attempts = sessions(Array(1000).fill(80))
  const tree = await harness({ tables, a3Count: 1001 }).load('app/despega/a4/page.tsx').default()
  for (const label of ['Módulos A3 verificados', 'Promedio de Entrenamiento']) {
    const text = kpi(tree, label); assert.match(text, /—/); assert.doesNotMatch(text, /\d+\/(10|100)|1000 sesiones/)
  }
  assert.match(visible(tree), /Parte del contexto no está disponible/)
  assert.ok(nodes(tree).some(node => node?.type === 'a' && node.props.href === '/despega/a4/job-matching'))
  assert.ok(nodes(tree).some(node => node?.type === 'workspace'))
  assert.doesNotMatch(visible(tree), /Secciones pendientes de recuperar/)
})
test('invalid completed A3 modules or future dates degrade KPIs as well as the context', async () => {
  for (const override of [{ module_id: 'invented-module' }, { session_completed_at: '2027-01-01T00:00:00Z' }]) {
    const tables = valid(); tables.a3_session_attempts = [{ ...sessions([80])[0], ...override }]
    const tree = await harness({ tables }).load('app/despega/a4/page.tsx').default()
    assert.match(kpi(tree, 'Módulos A3 verificados'), /—/)
    assert.match(kpi(tree, 'Promedio de Entrenamiento'), /—/)
    assert.ok(nodes(tree).some(node => node?.type === 'workspace'))
  }
})
test('an unavailable A3 read alone does not hide the Radar or publish zero progress', async () => {
  const h = harness({ fault: table => table === 'a3_session_attempts' ? { data: null, error: { message: SECRET } } : null })
  const tree = await h.load('app/despega/a4/page.tsx').default()
  assert.match(kpi(tree, 'Módulos A3 verificados'), /—/)
  assert.match(kpi(tree, 'Promedio de Entrenamiento'), /—/)
  assert.ok(nodes(tree).some(node => node?.type === 'workspace'))
  assert.ok(!visible(tree).includes(SECRET))
})
test('a rejected A3 read remains isolated and keeps the Radar and opportunities link', async () => {
  const h = harness({ fault: table => table === 'a3_session_attempts' ? 'throw' : null })
  const tree = await h.load('app/despega/a4/page.tsx').default()
  assert.match(kpi(tree, 'Módulos A3 verificados'), /—/)
  assert.match(kpi(tree, 'Promedio de Entrenamiento'), /—/)
  assert.ok(nodes(tree).some(node => node?.type === 'workspace'))
  assert.ok(nodes(tree).some(node => node?.type === 'a' && node.props.href === '/despega/a4/job-matching'))
  assert.ok(!visible(tree).includes(SECRET))
})

let failures = 0
for (const { name, run } of cases) { try { await run(); console.log('PASS', name) } catch (error) { failures++; console.error('FAIL', name, error) } }
console.log(`${cases.length - failures}/${cases.length} A4 journey context tests passed`)
if (failures) process.exitCode = 1
