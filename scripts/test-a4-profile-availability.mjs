import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

// Execute real profile and consumer bodies with synthetic SELECT-only ports.
// This file never connects to Supabase, fetches a URL, or stores a snapshot.
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const USER = '00000000-0000-4000-8000-000000000501'
const OTHER = '00000000-0000-4000-8000-000000000502'
const PRIVATE_ERROR = 'SYNTHETIC_PRIVATE_DATABASE_DETAILS_MUST_NOT_ESCAPE'
const cases = []
const test = (name, run) => cases.push({ name, run })
const clone = value => structuredClone(value)
const jsx = (type, props, key) => ({ type, props: props ?? {}, key })
const ui = (...names) => Object.fromEntries(names.map(name => [name, 'ui:' + name]))
const icons = new Proxy({}, { get: (_target, key) => key === '__esModule' ? true : 'icon:' + String(key) })

function signal(index, signal_type, signal_value, overrides = {}) {
  return {
    id: 'synthetic-signal-' + index, user_id: USER, signal_type, signal_value,
    weight: 5, confidence: 80, polarity: 'positive', is_active: true,
    source_module: 'a2', source_document_id: 'synthetic-document',
    created_at: '2026-10-01T12:00:00.000Z', ...overrides,
  }
}

function validSignals() {
  return [
    signal(1, 'proof_of_value', 'Resultado documentado A', { confidence: 70 }),
    signal(2, 'proof_of_value', 'Resultado documentado B'),
    signal(3, 'proof_of_value', 'Resultado documentado C', { confidence: 90 }),
    signal(4, 'evidence_gap', 'Demostrar impacto medible', { weight: 7, polarity: 'negative' }),
    signal(5, 'interview_risk', 'Explicar cambio laboral', { weight: 8, polarity: 'negative' }),
    signal(6, 'cv_gap', 'Cuantificar responsabilidades', { weight: 9, polarity: 'negative' }),
    signal(7, 'strength', 'Análisis', { weight: 9, confidence: 90 }),
    signal(8, 'strength', 'Comunicación', { weight: 8, confidence: 90 }),
    signal(9, 'confidence_level', 'Confianza declarada', { confidence: 90 }),
    signal(10, 'career_goal', 'Liderar análisis de riesgo'),
    signal(11, 'target_role', 'Analista de riesgo'),
    signal(12, 'work_style', 'structured'),
    signal(13, 'communication_style', 'concise'),
    signal(14, 'learning_style', 'practical'),
    signal(15, 'missing_metric', 'Medir tiempo ahorrado', { weight: 6, polarity: 'negative' }),
  ]
}

function memoryDb(options = {}) {
  const tables = {
    dtc_profile_signals: clone(options.signals ?? validSignals()),
    dtc_documents: [], a3_session_attempts: [], a4_verified_signals: [],
    a4_decision_log: [], a4_daily_evidence_snapshots: [],
    career_identities: [{ user_id: USER, target_roles: ['Objetivo sintético existente'] }],
  }
  const queries = []
  class Query {
    constructor(table) {
      assert.ok(Object.hasOwn(tables, table), 'Unexpected table: ' + table)
      this.table = table; this.columns = '*'; this.filters = []; this.sort = []
      this.max = Infinity; this.singular = false
    }
    select(columns = '*') { this.columns = columns; return this }
    eq(field, value) { this.filters.push(['eq', field, value]); return this }
    in(field, value) { this.filters.push(['in', field, value]); return this }
    gte(field, value) { this.filters.push(['gte', field, value]); return this }
    lte(field, value) { this.filters.push(['lte', field, value]); return this }
    lt(field, value) { this.filters.push(['lt', field, value]); return this }
    not(field, operator, value) { assert.equal(operator, 'eq'); this.filters.push(['neq', field, value]); return this }
    order(field, { ascending = true } = {}) { this.sort.push([field, ascending]); return this }
    limit(value) { assert.ok(Number.isInteger(value) && value > 0); this.max = value; return this }
    maybeSingle() { this.singular = true; return this }
    insert() { assert.fail('Profile availability must not create database records') }
    update() { assert.fail('Profile availability must not update database records') }
    upsert() { assert.fail('Profile availability must not upsert database records') }
    delete() { assert.fail('Profile availability must not delete database records') }
    matches(row) {
      return this.filters.every(([op, field, value]) => {
        if (op === 'eq') return row[field] === value
        if (op === 'neq') return row[field] !== value
        if (op === 'in') return value.includes(row[field])
        if (op === 'gte') return row[field] >= value
        if (op === 'lte') return row[field] <= value
        if (op === 'lt') return row[field] < value
        assert.fail('Unexpected filter: ' + op)
      })
    }
    async execute() {
      const entry = { table: this.table, columns: this.columns, filters: clone(this.filters), limit: this.max }
      queries.push(entry)
      if (this.table === 'dtc_profile_signals') {
        const index = queries.filter(query => query.table === this.table).length
        const fault = options.fault?.(entry, index)
        if (fault?.reject) throw new Error(PRIVATE_ERROR)
        if (fault?.error) return { data: null, error: { ...fault.error, message: PRIVATE_ERROR, details: PRIVATE_ERROR } }
        if (fault && Object.hasOwn(fault, 'data')) return { data: clone(fault.data), error: null }
      }
      let rows = tables[this.table].filter(row => this.matches(row))
      for (const [field, ascending] of [...this.sort].reverse()) {
        rows.sort((a, b) => (a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0) * (ascending ? 1 : -1))
      }
      rows = rows.slice(0, this.max)
      const data = rows.map(row => this.columns === '*' ? clone(row) : Object.fromEntries(
        this.columns.split(',').map(field => field.trim()).map(field => [field, clone(row[field])]),
      ))
      return { data: this.singular ? data[0] ?? null : data, error: null }
    }
    then(success, failure) { return this.execute().then(success, failure) }
  }
  return { tables, queries, from: table => new Query(table) }
}

const compiledCache = new Map()
function harness(options = {}) {
  const db = memoryDb(options)
  const logs = []
  const documentCalls = []
  const client = () => {
    if (options.clientThrows) throw new Error(PRIVATE_ERROR)
    return options.clientAbsent ? null : db
  }
  const documentEngine = {
    getDocumentsByType: async (userId, type) => {
      assert.equal(userId, USER); documentCalls.push({ method: 'type', type })
      if (options.documentReject === 'type') throw new Error(PRIVATE_ERROR)
      return type === 'identity_statement' && options.documents !== false
        ? [{ id: 'synthetic-identity', user_id: USER, type, ai_summary: 'Identidad documental de QA' }] : []
    },
    getDocumentsByUser: async (userId, args) => {
      assert.equal(userId, USER); documentCalls.push({ method: 'user', args })
      if (options.documentReject === 'user') throw new Error(PRIVATE_ERROR)
      return options.documents !== false ? [{ id: 'synthetic-cv', user_id: USER, type: 'cv_draft', related_day: 12 }] : []
    },
    getDocumentsByA3Module: async (userId, moduleId) => {
      assert.equal(userId, USER); documentCalls.push({ method: 'a3', moduleId }); return []
    },
    getDocumentsByDay: async () => [], getRequiredDocumentsForDay: async () => null,
    canCompleteDayDocuments: async () => ({ canComplete: false, missing: [] }),
  }
  const modules = {
    '@/lib/supabase/client': { createClient: client },
    '@/lib/supabase/server': { createClient: async () => db, createAdminClient: () => db },
    './document-engine': documentEngine,
    '@/lib/journey/service': { requireJourneyModule: async module => {
      assert.equal(module, 'A4')
      return { user: { id: USER }, access: { a1: true, a2: false, a3: false, a4: true }, a4AccessSource: 'qa_entitlement', state: { a4UnlockedAt: null } }
    } },
    '@/lib/auth/server-user': { resolveServerUser: async () => ({ id: USER }) },
    'react/jsx-runtime': { jsx, jsxs: jsx, Fragment: 'fragment' },
    'next/link': { __esModule: true, default: 'a' },
    'lucide-react': icons,
    '@/components/layout/page-foundation': ui('PageContainer', 'PageHeader', 'PageStack'),
    '@/components/ui/button': ui('Button'), '@/components/ui/badge': ui('Badge'),
    '@/components/ui/card': ui('Card', 'CardContent'),
    '@/components/a4/daily-snapshot-history': ui('DailySnapshotHistory'),
    '@/components/a4/evidence-pulse': ui('EvidencePulse'),
    '@/components/a4/strategic-radar-workspace': ui('StrategicRadarWorkspace'),
    '@/lib/a4/daily-snapshots': { normalizeA4DailySnapshot: () => assert.fail('No synthetic daily snapshots') },
    './opportunity-search-experience': ui('OpportunitySearchExperience'),
  }
  const allowed = new Set(['lib/a4/profile-signals.ts', 'lib/a4/profile-snapshot.ts', 'lib/a4/context-integration.ts'])
  const loaded = new Map()
  function load(path) {
    if (loaded.has(path)) return loaded.get(path)
    const source = readFileSync(resolve(ROOT, path), 'utf8')
    let compiled = compiledCache.get(source)
    if (!compiled) {
      compiled = ts.transpileModule(source, { fileName: path, compilerOptions: {
        module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true,
      } }).outputText
      compiledCache.set(source, compiled)
    }
    const module = { exports: {} }
    new Function('require', 'module', 'exports', 'console', 'fetch', compiled)(name => {
      if (Object.hasOwn(modules, name)) return modules[name]
      const base = name.startsWith('@/') ? name.slice(2) : name.startsWith('.')
        ? relative(ROOT, resolve(ROOT, dirname(path), name)) : null
      const target = base?.endsWith('.ts') ? base : base + '.ts'
      assert.ok(allowed.has(target), 'Unexpected dependency in ' + path + ': ' + name)
      return load(target)
    }, module, module.exports,
    { error: (...args) => logs.push(args), warn: (...args) => logs.push(args), log: () => {} },
    () => assert.fail('Network is forbidden in profile availability regression tests'))
    loaded.set(path, module.exports)
    return module.exports
  }
  return { db, logs, documentCalls, load }
}

const rawMethods = ['getUserSignals', 'getWeaknesses', 'getSignalStats']
const profile = h => h.load('lib/a4/profile-snapshot.ts').getLiveUserProfile(USER)
const signalQueries = h => h.db.queries.filter(query => query.table === 'dtc_profile_signals')
function assertOwnerActive(h) {
  assert.ok(signalQueries(h).length > 0)
  for (const query of signalQueries(h)) {
    assert.ok(query.filters.some(([op, field, value]) => op === 'eq' && field === 'user_id' && value === USER))
    assert.ok(query.filters.some(([op, field, value]) => op === 'eq' && field === 'is_active' && value === true))
  }
}
async function expectUnavailable(h, method, code) {
  const signals = h.load('lib/a4/profile-signals.ts')
  await assert.rejects(() => signals[method](USER), error => {
    assert.ok(error instanceof signals.A4ProfileSignalsUnavailableError)
    assert.equal(error.code, code)
    assert.equal(error.cause, undefined)
    assert.ok(!String(error).includes(PRIVATE_ERROR))
    assert.ok(!JSON.stringify(error).includes(PRIVATE_ERROR))
    return true
  })
  assert.deepEqual(h.logs, [], 'Only the profile boundary should log an unavailable result')
}
function assertSanitizedLog(h) {
  assert.equal(h.logs.length, 1)
  assert.ok(!JSON.stringify(h.logs).includes(PRIVATE_ERROR))
  assert.ok(h.logs[0].some(item => item && typeof item === 'object' && typeof item.code === 'string'))
}
function nodes(value) {
  if (value == null || typeof value === 'boolean') return []
  if (Array.isArray(value)) return value.flatMap(nodes)
  if (typeof value !== 'object') return [value]
  return [value, ...nodes(value.props?.children)]
}
const visibleText = value => nodes(value).filter(node => ['string', 'number'].includes(typeof node)).join(' ')

test('all raw readers distinguish an absent client from an empty result', async () => {
  for (const method of rawMethods) {
    const h = harness({ clientAbsent: true })
    await expectUnavailable(h, method, 'client_unavailable')
    assert.equal(h.db.queries.length, 0)
  }
})

test('42P01 and PostgREST missing-table errors become sanitized schema_unavailable failures', async () => {
  for (const method of rawMethods) {
    for (const code of ['42P01', 'PGRST205']) {
      const h = harness({ fault: () => ({ error: { code } }) })
      await expectUnavailable(h, method, 'schema_unavailable')
      assertOwnerActive(h)
    }
  }
})

test('permission, network and rejected reads cannot masquerade as empty signals or zero statistics', async () => {
  for (const method of rawMethods) {
    for (const config of [
      { fault: () => ({ error: { code: '42501' } }) },
      { fault: () => ({ error: { code: 'FETCH_ERROR' } }) },
      { fault: () => ({ reject: true }) },
      { clientThrows: true },
    ]) await expectUnavailable(harness(config), method, 'read_failed')
  }
})

test('unexpected response shapes are unavailable instead of silently empty', async () => {
  for (const method of rawMethods) {
    for (const data of [null, {}, 'invalid-response']) {
      await expectUnavailable(harness({ fault: () => ({ data }) }), method, 'invalid_response')
    }
  }
})

test('score helpers propagate failed evidence instead of returning their numeric baselines', async () => {
  for (const method of ['getEvidenceQualityScore', 'getCVReadinessScore', 'getInterviewReadinessScore']) {
    await expectUnavailable(harness({ fault: () => ({ error: { code: '42P01' } }) }), method, 'schema_unavailable')
  }
})

test('legitimate empty raw reads retain empty arrays and truthful zero signal counts', async () => {
  const h = harness({ signals: [] })
  const signals = h.load('lib/a4/profile-signals.ts')
  assert.deepEqual(await signals.getUserSignals(USER), [])
  assert.deepEqual(await signals.getWeaknesses(USER), [])
  assert.deepEqual(await signals.getSignalStats(USER), { total: 0, byType: {}, byPolarity: {}, avgConfidence: 0 })
  assertOwnerActive(h)
  assert.deepEqual(h.logs, [])
})

test('empty probe stops before fan-out and documents, including foreign and inactive-only signals', async () => {
  for (const rows of [[], [signal(90, 'strength', 'Ajena', { user_id: OTHER })], [signal(91, 'strength', 'Inactiva', { is_active: false })]]) {
    const h = harness({ signals: rows })
    assert.equal(await profile(h), null)
    assert.equal(signalQueries(h).length, 1)
    assert.equal(signalQueries(h)[0].limit, 1)
    assert.deepEqual(h.documentCalls, [])
    assert.deepEqual(h.logs, [])
    assertOwnerActive(h)
  }
})

test('initial profile failures return null, stop fan-out and log only a sanitized code', async () => {
  for (const config of [
    { clientAbsent: true }, { clientThrows: true },
    { fault: () => ({ error: { code: '42P01' } }) },
    { fault: () => ({ error: { code: '42501' } }) },
    { fault: () => ({ reject: true }) },
    { fault: () => ({ data: null }) },
  ]) {
    const h = harness(config)
    assert.equal(await profile(h), null)
    assert.ok(signalQueries(h).length <= 1)
    assert.deepEqual(h.documentCalls, [])
    assertSanitizedLog(h)
  }
})

test('a valid probe followed by a failed or rejected nested read never publishes a partial profile', async () => {
  const unhandled = []
  const capture = reason => unhandled.push(reason)
  process.on('unhandledRejection', capture)
  try {
    for (const mode of ['error', 'reject']) {
      const h = harness({ fault: query => {
        if (!query.filters.some(([op, field, value]) => op === 'eq' && field === 'signal_type' && value === 'confidence_level')) return undefined
        return mode === 'reject' ? { reject: true } : { error: { code: '42501' } }
      } })
      assert.equal(await profile(h), null)
      assert.ok(signalQueries(h).length > 1)
      assert.equal(signalQueries(h)[0].limit, 1)
      assert.deepEqual(h.documentCalls, [])
      assertSanitizedLog(h)
      assertOwnerActive(h)
    }
    await new Promise(resolve => setImmediate(resolve))
    assert.deepEqual(unhandled, [])
  } finally { process.off('unhandledRejection', capture) }
})

test('document rejection after valid signal reads also returns a wholly unavailable profile', async () => {
  for (const documentReject of ['type', 'user']) {
    const h = harness({ documentReject })
    assert.equal(await profile(h), null)
    assert.ok(signalQueries(h).length > 1)
    assertSanitizedLog(h)
  }
})

test('valid existing signals preserve calculations, meaningful values, ownership and active filtering', async () => {
  const h = harness({ signals: [
    ...validSignals(),
    signal(90, 'cv_gap', 'No pertenece al usuario', { user_id: OTHER, weight: 100 }),
    signal(91, 'interview_risk', 'Ya inactiva', { is_active: false, weight: 100 }),
  ] })
  const before = clone(h.db.tables)
  const result = await profile(h)
  assert.ok(result)
  assert.equal(result.userId, USER)
  assert.equal(result.evidenceQuality, 58)
  assert.equal(result.cvReadiness, 47)
  assert.equal(result.interviewReadiness, 63)
  assert.equal(result.applicationReadiness, 56)
  assert.deepEqual(result.strengths, ['Análisis', 'Comunicación'])
  assert.equal(result.targetRole, 'Analista de riesgo')
  assert.equal(result.professionalIdentity, 'Identidad documental de QA')
  assert.equal(result.communicationStyle, 'concise')
  assert.equal(result.workStyle, 'structured')
  assert.equal(result.currentRouteFocus, 'cv_development')
  assert.equal(result.recommendedCoachStrategy, 'focus_interview_prep')
  assert.deepEqual(result.missingProof, ['Demostrar impacto medible', 'Medir tiempo ahorrado'])
  assert.deepEqual(result.interviewRisks, ['Explicar cambio laboral'])
  assert.equal(result.nextBestActions[0], 'Mejorar CV: Cuantificar responsabilidades')
  const stats = await h.load('lib/a4/profile-signals.ts').getSignalStats(USER)
  assert.equal(stats.total, 15)
  assert.equal(stats.byType.proof_of_value, 3)
  assert.equal(stats.byType.strength, 2)
  assert.equal(stats.avgConfidence, 82)
  assert.deepEqual(h.db.tables, before)
  assertOwnerActive(h)
  assert.deepEqual(h.logs, [])
})

test('landing and job matching render unavailable state without baseline scores or a no-gaps claim', async () => {
  for (const path of ['app/despega/a4/page.tsx', 'app/despega/a4/job-matching/page.tsx']) {
    for (const config of [{ signals: [] }, { fault: () => ({ error: { code: '42P01' } }) }]) {
      const h = harness(config)
      const tree = await h.load(path).default()
      const text = visibleText(tree)
      assert.match(text, /no está disponible/i)
      assert.doesNotMatch(text, /\b(?:50|60|53)\s*(?:\/\s*100|%)/)
      assert.doesNotMatch(text, /No hay brechas de evidencia|no tienes brechas/i)
      assert.ok(!text.includes(PRIVATE_ERROR))
      if (path.includes('job-matching')) {
        const search = nodes(tree).find(node => node?.type === 'ui:OpportunitySearchExperience')
        assert.ok(search, 'Search must remain available without a calculated profile')
        assert.equal(search.props.profileEvidence, null)
        assert.equal(search.props.seedRole, 'Objetivo sintético existente')
      }
      assert.equal(signalQueries(h).length, 1)
    }
  }
})

test('valid profiles still render their existing scores on landing and job matching', async () => {
  for (const path of ['app/despega/a4/page.tsx', 'app/despega/a4/job-matching/page.tsx']) {
    const h = harness()
    const text = visibleText(await h.load(path).default())
    for (const value of [47, 63, 56]) assert.match(text, new RegExp('\\b' + value + '\\s*/\\s*100'))
    assert.doesNotMatch(text, /Tu perfil de acción no está disponible|Tu contexto de búsqueda aún no está disponible/)
    assertOwnerActive(h)
  }
})

test('A3, coach, CV and interview consumers accept unavailable profiles without rejected context promises', async () => {
  for (const [method, args, field] of [
    ['getA3ModuleKnowledgeContext', [USER, 'module-1'], 'liveUserProfile'],
    ['getCoachContext', [USER], 'userProfile'],
    ['getCVContext', [USER], 'profile'],
    ['getInterviewContext', [USER], 'profile'],
  ]) {
    const h = harness({ documents: false, fault: () => ({ error: { code: '42P01' } }) })
    const result = await h.load('lib/a4/context-integration.ts')[method](...args)
    assert.equal(result[field], null)
    assert.ok(!JSON.stringify(result).includes(PRIVATE_ERROR))
    if (method === 'getCoachContext') {
      assert.deepEqual(result.recommendedFocus, ['Revisar tu perfil y la evidencia disponible'])
      assert.ok(!JSON.stringify(result.recommendedFocus).includes('%'))
    }
    assertSanitizedLog(h)
  }
})

let failures = 0
for (const { name, run } of cases) {
  try { await run(); console.log('PASS ' + name) }
  catch (error) { failures++; console.error('FAIL ' + name); console.error(error) }
}
console.log(JSON.stringify({ suite: 'a4-profile-availability', passed: cases.length - failures, failed: failures, total: cases.length, evidence: 'real_helpers_contexts_and_page_bodies_with_synthetic_io', networkRequests: 0, databaseWrites: 0 }))
if (failures) process.exitCode = 1
