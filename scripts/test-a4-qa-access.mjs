import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'
import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'node:crypto'
import * as searchQuery from '../lib/opportunities/search-query.ts'
import * as opportunityMatching from '../lib/opportunities/matching.ts'
import * as personalOrientation from '../lib/opportunities/personal-orientation.ts'

// This suite executes production module, route and component bodies against
// synthetic boundaries. It has no credentials, network access or database writes.
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const USER = '00000000-0000-4000-8000-000000000401'
const OTHER = '00000000-0000-4000-8000-000000000402'
const NOW = '2026-10-07T21:00:00.000Z'
const EXPIRES = '2026-10-08T21:00:00.000Z'
const PRIVATE_ERROR = 'SYNTHETIC_PRIVATE_DATABASE_ERROR'
const cases = []
const test = (name, run) => cases.push({ name, run })
const clone = value => structuredClone(value)

function stateRow(overrides = {}) {
  return {
    user_id: USER, current_module: 'A1', current_a2_day: 1,
    highest_a2_day_unlocked: 1, a1_completed_at: null, a2_started_at: null,
    a2_completed_at: null, a3_unlocked_at: null, a4_unlocked_at: null,
    version: 1, metadata: { a2_horizon: 30 }, ...overrides,
  }
}

function profileRow(overrides = {}) {
  return {
    user_id: USER, onboarding_conozcamonos_1_completed: false,
    a1_cerebral_intro_seen: false, a1_cerebral_completed: false,
    a1_results_saved: false, a1_report_seen: false, a2_intro_seen: false,
    conozcamonos_2_completed: false, a2_route_generated: false,
    a3_unlocked: false, a4_unlocked: false, ...overrides,
  }
}

/** Independent SELECT semantics, projection, owner filters and single-row errors. */
function memoryDb(options = {}) {
  const tables = {
    a4_qa_entitlements: [{ user_id: USER, expires_at: EXPIRES }],
    pilot_memberships: [{ user_id: USER, access_kind: 'invited' }],
    despega_journey_state: [stateRow()],
    despega_user_profiles: [profileRow()],
    a3_route_progression: [], a1_tests_results: [], a1_cerebral_assessment: [],
    a2_user_task_completions: [], a2_user_route_progress: [], a3_user_progress: [],
    dtc_outcome_observations: [], a3_session_attempts: [], dtc_documents: [],
    a4_verified_signals: [], a4_decision_log: [], a4_daily_evidence_snapshots: [],
    canon_generated_routes: [], a4_strategic_score: [], career_search_intents: [],
    ...clone(options.tables ?? {}),
  }
  const calls = { auth: 0, admin: 0, reads: [], rpc: [], writes: [] }
  const identity = options.user === undefined ? { id: USER } : options.user
  class Query {
    constructor(table) {
      assert.ok(Object.hasOwn(tables, table), 'Unexpected table: ' + table)
      this.table = table; this.columns = '*'; this.filters = []; this.sort = []
      this.max = Infinity; this.singular = false
    }
    select(columns = '*') { this.columns = columns; return this }
    eq(field, value) { this.filters.push(['eq', field, value]); return this }
    gt(field, value) { this.filters.push(['gt', field, value]); return this }
    in(field, value) { this.filters.push(['in', field, value]); return this }
    not(field, operator, value) {
      assert.equal(operator, 'is'); assert.equal(value, null)
      this.filters.push(['not-null', field]); return this
    }
    order(field, { ascending = true } = {}) { this.sort.push([field, ascending]); return this }
    limit(value) { assert.ok(Number.isInteger(value) && value > 0); this.max = value; return this }
    single() { this.singular = true; this.required = true; return this }
    maybeSingle() { this.singular = true; return this }
    insert(value) { return this.write('insert', value) }
    update(value) { return this.write('update', value) }
    upsert(value) { return this.write('upsert', value) }
    delete() { return this.write('delete') }
    write(operation, value) {
      calls.writes.push({ table: this.table, operation, value })
      throw new Error('Access verification attempted a database write: ' + operation + ' ' + this.table)
    }
    matches(row) {
      return this.filters.every(([operator, field, value]) => {
        if (operator === 'eq') return row[field] === value
        if (operator === 'in') return value.includes(row[field])
        if (operator === 'not-null') return row[field] != null
        if (operator === 'gt') return Date.parse(row[field]) > Date.parse(value)
        assert.fail('Unhandled filter: ' + operator)
      })
    }
    async execute() {
      calls.reads.push({ table: this.table, columns: this.columns, filters: clone(this.filters) })
      if (options.rejectTable === this.table) throw new Error(PRIVATE_ERROR)
      if (options.errorTable === this.table) return { data: null, error: { message: PRIVATE_ERROR } }
      if (Object.hasOwn(options.rawResponses ?? {}, this.table)) {
        return { data: clone(options.rawResponses[this.table]), error: null }
      }
      let rows = tables[this.table].filter(row => this.matches(row))
      for (const [field, ascending] of [...this.sort].reverse()) {
        rows.sort((a, b) => (a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0) * (ascending ? 1 : -1))
      }
      rows = rows.slice(0, this.max)
      if (this.singular && (rows.length > 1 || (this.required && !rows.length))) {
        return { data: null, error: { code: 'PGRST116', message: 'Synthetic single-row cardinality violation' } }
      }
      const selected = rows.map(row => this.columns === '*' ? clone(row) : Object.fromEntries(
        this.columns.split(',').map(field => field.trim()).map(field => [field, clone(row[field])]),
      ))
      return { data: this.singular ? selected[0] ?? null : selected, error: null }
    }
    then(success, failure) { return this.execute().then(success, failure) }
  }
  const db = {
    tables, calls,
    auth: { getUser: async () => {
      calls.auth++
      return { data: { user: identity }, error: options.authError ?? null }
    } },
    from: table => new Query(table),
    rpc: async (name, params) => {
      calls.rpc.push({ name, params })
      // Existing journey initialization runs against an already-present row.
      // No permissions or completion markers can be created by this fixture.
      assert.equal(name, 'ensure_despega_journey_state', 'Unexpected RPC in access resolution')
      assert.equal(params.p_user_id, identity?.id)
      assert.ok(tables.despega_journey_state.some(row => row.user_id === params.p_user_id))
      return { data: null, error: null }
    },
  }
  return db
}

const jsx = (type, props, key) => ({ type, props: props ?? {}, key })
const ui = (...names) => Object.fromEntries(names.map(name => [name, 'ui:' + name]))
const icons = new Proxy({}, { get: (_target, name) => name === '__esModule' ? true : 'icon:' + String(name) })
const redirect = path => { throw Object.assign(new Error('Synthetic redirect: ' + path), { redirectPath: path }) }
const compiledCache = new Map()

/** Only explicit test ports replace I/O; authorization and route logic remain real. */
function harness(options = {}) {
  const db = memoryDb(options)
  const clock = { value: Date.parse(NOW) }
  class FixtureDate extends Date {
    constructor(...args) { super(...(args.length ? args : [clock.value])) }
    static now() { return clock.value }
  }
  const calls = { protectedReads: 0, personalReads: 0, report: 0, logs: [] }
  const loaded = new Map()
  const modules = {
    'server-only': {},
    'node:crypto': { createHash },
    '@/lib/opportunities/search-query': searchQuery,
    'react': {
      cache: fn => fn, useState: value => [value, () => {}],
      useRef: value => ({ current: value }), useEffect: () => {},
    },
    'react/jsx-runtime': { jsx, jsxs: jsx, Fragment: 'fragment' },
    'next/server': { NextResponse },
    'next/navigation': { redirect, usePathname: () => '/despega/a4', useRouter: () => ({ replace: () => assert.fail('Unexpected navigation event') }) },
    'next/link': { __esModule: true, default: 'a' },
    'lucide-react': icons,
    'swr': { __esModule: true, default: () => ({ data: null, isLoading: false }) },
    '@/lib/supabase/server': {
      createClient: async () => db,
      createAdminClient: () => { db.calls.admin++; return db },
    },
    '@/lib/utils': { cn: (...parts) => parts.filter(part => typeof part === 'string').join(' ') },
    '@/hooks/use-auth-redirect': { useAuthRedirect: () => ({ user: { id: USER, email: 'a4-qa@example.invalid' } }) },
    '@/components/ui/button': ui('Button'),
    '@/components/ui/card': ui('Card', 'CardContent', 'CardHeader', 'CardTitle'),
    '@/components/ui/badge': ui('Badge'),
    '@/components/ui/progress': ui('Progress'),
    '@/components/layout/page-foundation': ui('PageContainer', 'PageHeader', 'PageStack'),
    '@/components/a4/daily-snapshot-history': ui('DailySnapshotHistory'),
    '@/components/a4/evidence-pulse': ui('EvidencePulse'),
    '@/components/a4/strategic-radar-workspace': ui('StrategicRadarWorkspace'),
    '@/components/reports/print-report-button': ui('PrintReportButton'),
    '@/lib/a4/daily-snapshots': { normalizeA4DailySnapshot: () => assert.fail('Empty synthetic data must not produce snapshots') },
    '@/components/a4/journey-context-card': ui('JourneyContextCard'),
    '@/lib/a4/journey-context': { loadA4JourneyContext: async id => {
      assert.equal(id, USER)
      return { status: 'empty', identity: { status: 'empty', targetRole: null, updatedAt: null }, a1: { status: 'empty', completedAt: null }, a2: { status: 'empty', completedDays: 0, lastCompletedAt: null }, a3: { status: 'empty', completedModules: 0, lastCompletedAt: null } }
    } },
    '@/lib/a4/evidence-pulse': { pulsePriorityLabel: () => ({ label: 'Sin evidencia', detail: 'Sin señales registradas.' }) },
    '@/lib/reports/user-report-data': { loadA4Report: async id => {
      calls.report++; assert.equal(id, USER)
      return { signals: [], decisions: [], documents: 0, pulse: { priority: 'no_evidence', activeSignals: [], facts: 0, hypotheses: 0, coveredCategories: 0 } }
    } },
    '@/lib/reports/a1-professional-report': { buildA1ProfessionalReport: () => assert.fail('No assessment must be synthesized for A4 access') },
    '@/lib/a1/individual-evidence': { record: value => value },
    '@/lib/observability/request-id': { createRequestId: () => 'synthetic-access-check' },
    '@/lib/observability/server-log': { logOperationalError: () => {}, logOperationalEvent: () => {} },
    '@/lib/opportunities/verified-index': { readVerifiedOpportunityInventory: async client => {
      calls.protectedReads++; assert.equal(client, db); return { opportunities: [], scope: { limit: 500, limitReached: false } }
    } },
    '@/lib/opportunities/matching': opportunityMatching,
    '@/lib/opportunities/personal-orientation': personalOrientation,
    '@/lib/opportunities/personal-context': { loadOpportunityPersonalContext: async id => {
      calls.personalReads++; assert.equal(id, USER)
      return { version: 1, status: 'empty', revision: 'synthetic-empty', sources: [], evidence: [] }
    } },
    '@/lib/opportunities/taxonomy': { catalogFromJobs: () => ({ areas: [], roles: [] }), regionCatalogFromJobs: () => [] },
  }
  const realDependencies = new Set([
    'lib/a4/qa-entitlement.ts', 'lib/a4/access-control.ts',
    'lib/journey/service.ts', 'lib/journey/flow.ts', 'lib/journey/flow-service.ts',
    'lib/journey/a2-day-access.ts', 'lib/journey/transitions.ts',
    'lib/a2/server-progress.ts', 'lib/auth/server-user.ts', 'lib/auth/pilot-access.ts',
  ])
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
    const requirePort = name => {
      if (Object.hasOwn(modules, name)) return modules[name]
      const candidate = name.startsWith('@/') ? name.slice(2) : name.startsWith('.')
        ? relative(ROOT, resolve(ROOT, dirname(path), name)) : null
      const target = candidate?.endsWith('.ts') ? candidate : candidate + '.ts'
      assert.ok(realDependencies.has(target), 'Unexpected import in ' + path + ': ' + name)
      return load(target)
    }
    new Function('require', 'module', 'exports', 'console', 'Date', 'fetch', compiled)(
      requirePort, module, module.exports,
      { error: (...args) => calls.logs.push(args), warn: (...args) => calls.logs.push(args), log: () => {} },
      FixtureDate, () => assert.fail('Network is forbidden in the A4 access suite'),
    )
    loaded.set(path, module.exports)
    return module.exports
  }
  return { db, clock, calls, modules, load }
}

function assertNoAccessWrites(h) {
  assert.deepEqual(h.db.calls.writes, [])
  assert.ok(h.db.calls.rpc.every(call => call.name === 'ensure_despega_journey_state'))
}
function assertOwnerReads(h, tables) {
  const reads = h.db.calls.reads.filter(read => !tables || tables.includes(read.table))
  assert.ok(reads.length > 0)
  assert.ok(reads.every(read => read.filters.some(([op, field, value]) => op === 'eq' && field === 'user_id' && value === USER)))
}
async function entitled(h, userId = USER, now = new Date(NOW)) {
  return h.load('lib/a4/qa-entitlement.ts').hasActiveA4QaEntitlement(userId, h.db, now)
}
async function journey(h) { return h.load('lib/journey/service.ts').getJourneyForCurrentUser() }
async function expectRedirect(action, path) {
  await assert.rejects(action, error => typeof error?.redirectPath === 'string' && error.redirectPath.startsWith(path))
}
function nodes(value) {
  if (value == null || typeof value === 'boolean') return []
  if (Array.isArray(value)) return value.flatMap(nodes)
  if (typeof value !== 'object') return [value]
  if (typeof value.type === 'function') return nodes(value.type(value.props))
  return [value, ...nodes(value.props?.children)]
}
const visibleText = value => nodes(value).filter(node => ['string', 'number'].includes(typeof node)).join(' ')
const request = path => new Request('https://a4-qa.example.invalid' + path)

test('active entitlement requires matching user, valid future expiry and existing pilot membership', async () => {
  const h = harness()
  assert.equal(await entitled(h), true)
  assertOwnerReads(h, ['a4_qa_entitlements', 'pilot_memberships'])
  const permissionRead = h.db.calls.reads.find(read => read.table === 'a4_qa_entitlements')
  assert.ok(permissionRead.filters.some(([op, field, value]) => op === 'gt' && field === 'expires_at' && value === NOW))
  assert.deepEqual(h.db.calls.rpc, [])
  assertNoAccessWrites(h)
})

test('missing, expired, exactly-expiring and another user permission never grant access', async () => {
  for (const rows of [[], [{ user_id: USER, expires_at: '2026-10-06T21:00:00Z' }], [{ user_id: USER, expires_at: NOW }], [{ user_id: OTHER, expires_at: EXPIRES }]]) {
    const h = harness({ tables: { a4_qa_entitlements: rows } })
    assert.equal(await entitled(h), false)
    assertNoAccessWrites(h)
  }
})

test('permission response identity and expiry are validated even if transport returns an incoherent row', async () => {
  for (const row of [
    { user_id: OTHER, expires_at: EXPIRES }, { expires_at: EXPIRES },
    ...[undefined, null, '', 'not-a-date', false, true, 9e15, NOW].map(expires_at => ({ user_id: USER, expires_at })),
    [], [{ user_id: USER, expires_at: EXPIRES }],
  ]) {
    const h = harness({ rawResponses: { a4_qa_entitlements: row } })
    assert.equal(await entitled(h), false, 'Malformed entitlement: ' + JSON.stringify(row))
  }
})

test('invalid identity or verification time cannot create an entitlement', async () => {
  for (const userId of ['', ' ', null, undefined, 123]) {
    const h = harness()
    const fn = h.load('lib/a4/qa-entitlement.ts').hasActiveA4QaEntitlement
    assert.equal(await fn(userId, h.db, new Date(NOW)), false)
    assertNoAccessWrites(h)
  }
  assert.equal(await entitled(harness(), USER, new Date('invalid')), false)
})

test('absent, foreign, malformed and failed pilot membership cannot turn QA into pilot admission', async () => {
  const configs = [
    { tables: { pilot_memberships: [] } },
    { tables: { pilot_memberships: [{ user_id: OTHER }] } },
    { rawResponses: { pilot_memberships: { user_id: OTHER } } },
    { rawResponses: { pilot_memberships: {} } },
    { rawResponses: { pilot_memberships: [{ user_id: USER }] } },
    { errorTable: 'pilot_memberships' }, { rejectTable: 'pilot_memberships' },
  ]
  for (const config of configs) {
    const h = harness(config)
    assert.equal(await entitled(h), false)
    assert.deepEqual(h.db.calls.rpc, [])
    assertNoAccessWrites(h)
  }
})

test('permission query errors, rejected promises and duplicate rows all fail closed', async () => {
  for (const config of [
    { errorTable: 'a4_qa_entitlements' }, { rejectTable: 'a4_qa_entitlements' },
    { tables: { a4_qa_entitlements: [{ user_id: USER, expires_at: EXPIRES }, { user_id: USER, expires_at: EXPIRES }] } },
  ]) {
    const h = harness(config)
    assert.equal(await entitled(h), false)
    assertNoAccessWrites(h)
  }
})

test('shared A4 API guard identifies QA without manufacturing an A3 closure date', async () => {
  const h = harness()
  const access = await h.load('lib/a4/access-control.ts').checkA4Access(USER, h.db)
  assert.equal(access.canAccess, true)
  assert.equal(access.accessSource, 'qa_entitlement')
  assert.equal(access.routeCompletedAt, null)
  assert.equal(access.reason, null)
  assertNoAccessWrites(h)
})

test('verified journey closure remains the normal access source and survives an entitlement outage', async () => {
  const closed = '2026-10-06T18:00:00'
  const h = harness({ tables: { a3_route_progression: [{ user_id: USER, route_completed_at: closed }] }, errorTable: 'a4_qa_entitlements' })
  const access = await h.load('lib/a4/access-control.ts').checkA4Access(USER, h.db)
  assert.equal(access.canAccess, true)
  assert.equal(access.accessSource, 'journey')
  assert.equal(access.routeCompletedAt, closed)
  assert.ok(!h.db.calls.reads.some(read => read.table === 'a4_qa_entitlements'))
})

test('journey integration enables only A4 and preserves raw profile, state and outcomes', async () => {
  const h = harness()
  const before = clone(h.db.tables)
  const result = await journey(h)
  assert.deepEqual(result.access, { a1: true, a2: false, a3: false, a4: true })
  assert.equal(result.a4AccessSource, 'qa_entitlement')
  assert.equal(result.state.currentModule, 'A1')
  for (const key of ['a1CompletedAt', 'a2StartedAt', 'a2CompletedAt', 'a3UnlockedAt', 'a4UnlockedAt']) assert.equal(result.state[key], null)
  for (const value of Object.values(result.outcomes)) assert.equal(value, false)
  assert.equal(result.profile.a4_unlocked, false)
  assert.equal(result.profile.a1_cerebral_completed, false)
  assert.equal(result.profile.conozcamonos_2_completed, false)
  assert.deepEqual(h.db.tables, before)
  assertOwnerReads(h)
  assertNoAccessWrites(h)
})

test('anonymous journey has no access data, admin reads or initialization RPC', async () => {
  const h = harness({ user: null })
  assert.equal(await journey(h), null)
  assert.equal(h.db.calls.admin, 0)
  assert.deepEqual(h.db.calls.reads, [])
  assert.deepEqual(h.db.calls.rpc, [])
})

test('invalid QA or unavailable entitlement storage leaves incomplete journey blocked', async () => {
  for (const config of [
    { tables: { a4_qa_entitlements: [] } }, { tables: { pilot_memberships: [] } },
    { tables: { a4_qa_entitlements: [{ user_id: USER, expires_at: NOW }] } },
    { errorTable: 'a4_qa_entitlements' }, { errorTable: 'pilot_memberships' },
  ]) {
    const h = harness(config)
    const result = await journey(h)
    assert.deepEqual(result.access, { a1: true, a2: false, a3: false, a4: false })
    assert.equal(result.a4AccessSource, null)
    assertNoAccessWrites(h)
  }
})

test('expiration between requests revokes A4 without changing recorded progress', async () => {
  const h = harness()
  const initial = await journey(h)
  h.clock.value = Date.parse(EXPIRES)
  const after = await journey(h)
  assert.equal(initial.access.a4, true)
  assert.equal(after.access.a4, false)
  assert.equal(after.a4AccessSource, null)
  assert.deepEqual(after.state, initial.state)
  assert.deepEqual(after.profile, initial.profile)
  assert.deepEqual(after.outcomes, initial.outcomes)
  assertNoAccessWrites(h)
})

test('canonical module guards accept QA for A4 and keep A2 and A3 prerequisites intact', async () => {
  const h = harness()
  const service = h.load('lib/journey/service.ts')
  assert.equal((await service.requireJourneyModule('A4')).a4AccessSource, 'qa_entitlement')
  await expectRedirect(() => service.requireJourneyModule('A2'), '/despega/conozcamonos-1')
  await expectRedirect(() => service.requireJourneyModule('A3'), '/despega/conozcamonos-1')
  assertNoAccessWrites(h)
})

test('shared flow opens the A4 card while retaining onboarding, A2/A3 locks and completion count', async () => {
  const h = harness()
  const result = await journey(h)
  const flow = await h.load('lib/journey/flow-service.ts').readJourneyFlow(result, h.db)
  assert.equal(flow.radarAvailable, true)
  assert.equal(flow.onboardingPath, '/despega/conozcamonos-1')
  assert.equal(flow.next.href, '/despega/conozcamonos-1')
  assert.equal(flow.completedStages, 0)
  assert.equal(flow.cards.find(card => card.id === 'A2').state, 'locked')
  assert.equal(flow.cards.find(card => card.id === 'A3').state, 'locked')
  const radar = flow.cards.find(card => card.id === 'A4')
  assert.equal(radar.href, '/despega/a4')
  assert.notEqual(radar.state, 'locked')
  assert.match(radar.detail, /autorizad|temporal/i)
  assert.doesNotMatch(radar.detail, /respaldado por el cierre|cierre de A3 registrado/i)
  assert.deepEqual(flow.completedDays, [])
  assertOwnerReads(h)
  assertNoAccessWrites(h)
})

test('source label alone and ordinary access without A3 closure cannot unlock the navigation card', () => {
  const h = harness()
  const build = h.load('lib/journey/flow.ts').buildJourneyFlow
  const input = {
    profile: profileRow(), access: { a1: true, a2: false, a3: false, a4: false },
    currentModule: 'A1', highestA2DayUnlocked: 1, completedA2Days: [],
    completedA3Modules: [], a3RouteClosed: false, a4AccessSource: 'qa_entitlement',
  }
  assert.equal(build(input).radarAvailable, false)
  assert.equal(build({ ...input, access: { ...input.access, a4: true }, a4AccessSource: 'journey' }).radarAvailable, false)
})

test('module-access API consumes effective access instead of recalculating raw progress', async () => {
  const h = harness()
  const service = h.load('lib/journey/service.ts')
  h.modules['@/lib/journey/service'] = { ...service, getModuleAccess: () => assert.fail('API discarded effective access and recomputed raw progression') }
  const route = h.load('app/api/journey/module-access/route.ts')
  for (const [module, expected] of [['A1', true], ['A2', false], ['A3', false], ['A4', true]]) {
    const response = await route.GET(request('/api/journey/module-access?module=' + module))
    assert.equal(response.status, 200)
    const body = await response.json()
    assert.equal(body.canAccess, expected, module)
    if (module === 'A4') assert.equal(body.nextPath, null)
  }
  assertNoAccessWrites(h)
})

test('module-access rejects anonymous callers and does not initialize or repair their journey', async () => {
  const h = harness({ user: null })
  const response = await h.load('app/api/journey/module-access/route.ts').GET(request('/api/journey/module-access?module=A4'))
  assert.equal(response.status, 401)
  assert.deepEqual(h.db.calls.reads, [])
  assertNoAccessWrites(h)
})

test('shared context API returns effective A4 access with unchanged completion evidence', async () => {
  const h = harness()
  const response = await h.load('app/api/journey/context/route.ts').GET()
  assert.equal(response.status, 200)
  assert.match(response.headers.get('cache-control'), /private.*no-store/)
  const body = await response.json()
  assert.deepEqual(body.access, { a1: true, a2: false, a3: false, a4: true })
  assert.equal(body.state.a4UnlockedAt, null)
  assert.equal(body.state.currentModule, 'A1')
  assertNoAccessWrites(h)
})

test('catalog and personalized APIs use the same effective QA access before inventory and private context', async () => {
  for (const path of ['catalog', 'for-me']) {
    const h = harness()
    const response = await h.load('app/api/a4/opportunities/' + path + '/route.ts').GET(request('/api/a4/opportunities/' + path))
    assert.equal(response.status, 200)
    assert.equal((await response.json()).inventory_status, 'empty')
    assert.equal(h.calls.protectedReads, 1)
    assert.equal(h.calls.personalReads, path === 'for-me' ? 1 : 0)
    assertNoAccessWrites(h)
  }
})

test('catalog and personalized APIs reject no-session, no-pilot, expired and failed grants before inventory or private context', async () => {
  for (const path of ['catalog', 'for-me']) {
    for (const [config, status] of [
      [{ user: null }, 401], [{ tables: { pilot_memberships: [] } }, 403],
      [{ tables: { a4_qa_entitlements: [] } }, 403],
      [{ tables: { a4_qa_entitlements: [{ user_id: USER, expires_at: NOW }] } }, 403],
      [{ errorTable: 'a4_qa_entitlements' }, 403],
    ]) {
      const h = harness(config)
      const response = await h.load('app/api/a4/opportunities/' + path + '/route.ts').GET(request('/api/a4/opportunities/' + path))
      assert.equal(response.status, status, path)
      assert.equal(h.calls.protectedReads, 0)
      assert.equal(h.calls.personalReads, 0)
      assertNoAccessWrites(h)
    }
  }
})

test('A4 landing and results allow QA, preserve empty evidence and make no claim of completed A3', async () => {
  for (const path of ['app/despega/a4/page.tsx', 'app/despega/a4/resultados/page.tsx']) {
    const h = harness()
    const rendered = await h.load(path).default()
    const text = visibleText(rendered)
    assert.ok(text.length > 0)
    assert.doesNotMatch(text, /Habilitado por el cierre persistido de Entrenamiento|Acceso respaldado por el cierre de A3/i)
    if (path.endsWith('/a4/page.tsx')) {
      assert.match(text, /autorizad|temporal/i)
      assert.match(text, /0\/10/)
    } else {
      assert.equal(h.calls.report, 1)
      assert.match(text, /aún no tiene evidencia/)
    }
    assertNoAccessWrites(h)
  }
})

test('A4 landing and results deny anonymous and unentitled users before reading protected page data', async () => {
  for (const path of ['app/despega/a4/page.tsx', 'app/despega/a4/resultados/page.tsx']) {
    for (const config of [{ user: null }, { tables: { a4_qa_entitlements: [] } }]) {
      const h = harness(config)
      await expectRedirect(() => h.load(path).default(), config.user === null ? '/auth/signin' : '/despega/')
      assert.equal(h.calls.report, 0)
      assert.ok(!h.db.calls.reads.some(read => ['a4_verified_signals', 'a4_decision_log', 'a4_daily_evidence_snapshots'].includes(read.table)))
      assertNoAccessWrites(h)
    }
  }
})

test('rendered navbar links A4, locks A2/A3 and does not mark their progress completed', async () => {
  const h = harness()
  const result = await journey(h)
  const flow = await h.load('lib/journey/flow-service.ts').readJourneyFlow(result, h.db)
  const tree = h.load('components/layout/app-shell.tsx').AppShell({ flow, children: 'Synthetic content' })
  const all = nodes(tree)
  assert.ok(all.some(node => node?.type === 'a' && node.props.href === '/despega/a4' && visibleText(node).includes('A4 · Radar Estratégico')))
  for (const stage of ['A2 · Tu Ruta', 'A3 · Entrenamiento']) {
    const locked = all.find(node => node?.props?.['aria-disabled'] === 'true' && visibleText(node).includes(stage))
    assert.ok(locked, 'Expected locked stage: ' + stage)
    assert.ok(!nodes(locked).some(node => node?.props?.['aria-label'] === 'Completado'))
  }
})

test('initial entry preserves the true pending onboarding path after a grant', async () => {
  const h = harness()
  await expectRedirect(() => h.load('app/despega/page.tsx').default(), '/despega/conozcamonos-1')
  assertNoAccessWrites(h)
})

test('protected page middleware still requires session and pilot admission independent of A4 QA', async () => {
  const previous = Object.fromEntries(['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY'].map(key => [key, process.env[key]]))
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://synthetic.example.invalid'
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'synthetic-anon'
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'synthetic-service'
  try {
    for (const [user, admitted, expected] of [[null, true, 'signin'], [{ id: USER }, false, 'access_required'], [{ id: USER }, true, 'allowed']]) {
      const h = harness({ user })
      let pilotReads = 0
      h.modules['@supabase/ssr'] = { createServerClient: () => h.db }
      h.modules['@supabase/supabase-js'] = { createClient: () => ({ rpc: async (name, args) => {
        pilotReads++; assert.equal(name, 'resolve_pilot_access'); assert.deepEqual(args, { p_user_id: USER, p_claim_id: null })
        return { data: { allowed: admitted }, error: null }
      } }) }
      const response = await h.load('lib/supabase/middleware.ts').updateSession(new NextRequest('https://a4-qa.example.invalid/despega/a4'))
      if (expected === 'allowed') assert.equal(response.headers.get('location'), null)
      else {
        assert.equal(response.status, 307)
        const url = new URL(response.headers.get('location'))
        assert.equal(url.pathname, '/auth/signin')
        if (expected === 'access_required') assert.equal(url.searchParams.get('error'), 'access_required')
      }
      assert.equal(pilotReads, user ? 1 : 0)
    }
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key]
      else process.env[key] = value
    }
  }
})

let failures = 0
for (const { name, run } of cases) {
  try { await run(); console.log('PASS ' + name) }
  catch (error) { failures++; console.error('FAIL ' + name); console.error(error) }
}
console.log(JSON.stringify({ suite: 'a4-qa-access', passed: cases.length - failures, failed: failures, total: cases.length, evidence: 'real_modules_routes_components_with_synthetic_io', productionRequests: 0, databaseWrites: 0 }))
if (failures) process.exitCode = 1
