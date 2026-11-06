import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'
import { createClient as sdkClient } from '@supabase/supabase-js'
import { buildJourneyFlow } from '../lib/journey/flow.ts'
import * as nextAction from '../lib/journey/next-action.ts'
import { adjustmentContent } from '../lib/a2/practice-adjustment.ts'

// Real flow, coordinator, validators, service and Supabase query builder.
// Authentication and HTTP are synthetic; this suite makes no live Auth/RLS claim.
const USER = '00000000-0000-4000-8000-000000000801'
const OTHER = '00000000-0000-4000-8000-000000000802'
const OBJECTIVE = '00000000-0000-4000-8000-000000000811'
const ADJUSTMENT = '00000000-0000-4000-8000-000000000821'
const WHEN = '2026-11-06T12:00:00.000Z'
const owner = { user: { id: USER } }
const profile = {
  camino_foco: 'profesional', onboarding_conozcamonos_1_completed: true,
  a1_cerebral_intro_seen: true, a1_cerebral_completed: true,
  conozcamonos_2_completed: true, a1_report_seen: true, a2_intro_seen: true,
}
function flow(overrides = {}) {
  return buildJourneyFlow({
    profile, access: { a1: true, a2: true, a3: false, a4: false },
    currentModule: 'A2', highestA2DayUnlocked: 3, completedA2Days: [1, 2],
    completedA3Modules: [], a3RouteClosed: false, ...overrides,
  })
}
function objective(overrides = {}) {
  return {
    id: OBJECTIVE, user_id: USER, source: 'user_confirmed', is_primary: true, is_active: true,
    target_roles: ['Analista de datos'], functional_areas: [], objective_stage: 'specific',
    breadth: 'related', locations: ['Metropolitana'], location_preference: 'selected',
    work_modes: ['hybrid'], industries: [], excluded_industries: [], unknown_industry_policy: 'exclude',
    updated_at: WHEN, ...overrides,
  }
}
function adjustment(dayNumber = 3, overrides = {}, rowOverrides = {}) {
  return {
    id: ADJUSTMENT, user_id: USER, type: 'a2_practice_adjustment', related_day: dayNumber,
    content: JSON.stringify(adjustmentContent({
      requestId: ADJUSTMENT, dayNumber, outcome: 'could_not', barrier: 'time',
      retainedWork: 'Conservo la primera observación que anoté.',
      nextAction: 'Reservaré diez minutos para volver a intentarlo.', reviewDate: '2026-11-08',
      ...overrides,
    })), created_at: WHEN, ...rowOverrides,
  }
}
const compiled = ts.transpileModule(readFileSync('lib/journey/next-action-service.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText
const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { 'Content-Type': 'application/json' },
})
const allCalls = []
function harness(options = {}) {
  const calls = [], authCalls = []
  const tables = {
    career_search_intents: options.objectives ?? [],
    dtc_documents: options.adjustments ?? [],
  }
  const transport = async (target, init = {}) => {
    const url = new URL(String(target))
    const table = url.pathname.slice('/rest/v1/'.length)
    const call = { table, method: init.method ?? 'GET', params: Object.fromEntries(url.searchParams) }
    calls.push(call); allCalls.push(call)
    assert.equal(url.origin, 'https://synthetic.invalid')
    assert.ok(Object.hasOwn(tables, table), 'Only the two canonical SELECT sources are permitted')
    assert.equal(call.method, 'GET', 'No writes or RPCs are allowed')
    assert.equal(url.searchParams.get('user_id'), 'eq.' + USER)
    const columns = url.searchParams.get('select')?.split(',')
    assert.ok(columns?.length && !columns.includes('*'), 'Reads must select explicit fields')
    assert.ok(!columns.includes('user_id'), 'The returned context does not need the account id')
    if (options.throwTable === table) throw Error('PRIVATE_TRANSPORT_DETAIL')
    if (options.errorTable === table) return json({ code: 'XX001', message: 'PRIVATE_DATABASE_DETAIL' }, 503)
    let rows = tables[table].filter(row => [...url.searchParams].every(([key, value]) =>
      !value.startsWith('eq.') || String(row[key]) === value.slice(3)))
    const order = url.searchParams.get('order')?.split(',') ?? []
    rows = [...rows].sort((a, b) => {
      for (const item of order) {
        const [key, direction] = item.split('.')
        const comparison = String(a[key]).localeCompare(String(b[key]))
        if (comparison) return direction === 'desc' ? -comparison : comparison
      }
      return 0
    })
    if (url.searchParams.has('limit')) rows = rows.slice(0, Number(url.searchParams.get('limit')))
    return json(rows.map(row => Object.fromEntries(columns.map(key => [key, row[key]]))))
  }
  const client = sdkClient('https://synthetic.invalid', 'synthetic-public-key', {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }, global: { fetch: transport },
  })
  client.auth.getUser = async () => {
    authCalls.push(true)
    if (options.authThrows) throw Error('PRIVATE_AUTH_DETAIL')
    return { data: { user: options.anonymous ? null : { id: options.authUser ?? USER } }, error: options.authError ? Error('PRIVATE_AUTH_DETAIL') : null }
  }
  const dependencies = {
    'server-only': {}, react: { cache: fn => fn },
    '@/lib/supabase/server': { createClient: async () => client }, './next-action': nextAction,
  }
  const module = { exports: {} }
  new Function('require', 'module', 'exports', compiled)(key => {
    assert.ok(Object.hasOwn(dependencies, key), 'Unexpected dependency: ' + key)
    return dependencies[key]
  }, module, module.exports)
  return {
    calls, authCalls, client,
    read: (value = flow(), journey = owner) => module.exports.readGuidedNextAction(journey, value, client),
    load: (value = flow(), journey = owner) => module.exports.loadGuidedNextAction(journey, value),
  }
}
const tests = []
const test = (name, run) => tests.push({ name, run })
const source = (result, id) => result.sources.find(value => value.id === id)

test('confirmed objective and current-day intention enrich the unchanged canonical action', async () => {
  const f = flow()
  const before = structuredClone(f)
  const h = harness({ objectives: [objective()], adjustments: [adjustment()] })
  const result = await h.read(f)
  assert.deepEqual(result.action, before.next)
  assert.deepEqual(f, before, 'No progress or access mutation')
  assert.equal(result.version, 'dtc-guided-next-action.v1')
  assert.equal(result.objective.summary, 'Objetivo definido · Cargo: Analista de datos · Metropolitana · Híbrido')
  assert.deepEqual(result.adjustment, {
    dayNumber: 3, nextAction: 'Reservaré diez minutos para volver a intentarlo.',
    retainedWork: 'Conservo la primera observación que anoté.', barrierLabel: 'Me faltó tiempo', reviewDate: '2026-11-08',
  })
  assert.equal(source(result, 'objective').recordId, OBJECTIVE)
  assert.equal(source(result, 'adjustment').recordId, ADJUSTMENT)
  assert.equal(source(result, 'objective').recordedAt, WHEN)
  assert.deepEqual(result.limitations, [])
  assert.equal(h.authCalls.length, 1)
})

test('onboarding, checkpoints, measurements, training and Radar cannot be displaced by an adjustment', async () => {
  const cases = [
    { profile: {}, access: { a1: true, a2: false, a3: false, a4: false } },
    { profile: { ...profile, conozcamonos_2_completed: false } },
    { profile: { ...profile, a1_report_seen: false } },
    { access: { a1: true, a2: true, a3: true, a4: false }, highestA2DayUnlocked: 7, completedA2Days: [1, 2, 3, 4, 5, 6] },
    { access: { a1: true, a2: true, a3: true, a4: false }, currentModule: 'A3', completedA3Modules: ['career-mirror'] },
    { access: { a1: true, a2: true, a3: true, a4: true }, currentModule: 'A4', a3RouteClosed: true, a4AccessSource: 'journey' },
    { completedA2Days: Array.from({ length: 30 }, (_, i) => i + 1), highestA2DayUnlocked: 30,
      outcomes: { a1BaselineCompleted: true, a1FollowUpCompleted: true, a2BaselineCompleted: true, a2FollowUpCompleted: false } },
  ]
  for (const overrides of cases) {
    const f = flow(overrides)
    const h = harness({ objectives: [objective()], adjustments: [adjustment()] })
    const result = await h.read(f)
    assert.deepEqual(result.action, f.next)
    assert.equal(result.adjustment, undefined)
    assert.equal(source(result, 'adjustment'), undefined, 'An out-of-scope source is not reported as missing')
    assert.equal(h.calls.some(call => call.table === 'dtc_documents'), false)
  }
})

test('personal practice does not read or require a work objective', async () => {
  const f = flow({ profile: { ...profile, camino_foco: 'persona' } })
  const h = harness({ objectives: [objective()], adjustments: [adjustment()], errorTable: 'career_search_intents' })
  const result = await h.read(f)
  assert.deepEqual(result.action, f.next)
  assert.equal(result.objective, undefined)
  assert.equal(source(result, 'objective'), undefined)
  assert.equal(h.calls.some(call => call.table === 'career_search_intents'), false)
  assert.equal(result.adjustment.dayNumber, 3)
  assert.deepEqual(result.limitations, [])
})

test('empty sources remain missing while query failures remain unavailable', async () => {
  const empty = await harness().read()
  assert.equal(source(empty, 'objective').status, 'missing')
  assert.equal(source(empty, 'adjustment').status, 'missing')
  assert.deepEqual(empty.limitations, [])
  for (const [table, id] of [['career_search_intents', 'objective'], ['dtc_documents', 'adjustment']]) {
    for (const mode of ['errorTable', 'throwTable']) {
      const h = harness({ objectives: [objective()], adjustments: [adjustment()], [mode]: table })
      const result = await h.read()
      assert.equal(source(result, id).status, 'unavailable')
      assert.equal(result[id], undefined)
      assert.equal(source(result, id === 'objective' ? 'adjustment' : 'objective').status, 'available')
      assert.deepEqual(result.action, empty.action)
      assert.equal(result.limitations.length, 1)
      assert.doesNotMatch(JSON.stringify(result), /PRIVATE_/)
    }
  }
})

test('primary, active, confirmed owner objective is the only labor source', async () => {
  const h = harness({ objectives: [
    objective({ id: '00000000-0000-4000-8000-000000000812', is_primary: false }),
    objective({ id: '00000000-0000-4000-8000-000000000813', is_active: false }),
    objective({ id: '00000000-0000-4000-8000-000000000814', source: 'career_identity_seeded' }),
    objective({ id: '00000000-0000-4000-8000-000000000815', user_id: OTHER, target_roles: ['PRIVATE_FOREIGN_ROLE'] }),
  ] })
  const result = await h.read()
  assert.equal(source(result, 'objective').status, 'missing')
  assert.equal(result.objective, undefined)
  assert.doesNotMatch(JSON.stringify(result), /PRIVATE_/)
  const read = h.calls.find(call => call.table === 'career_search_intents')
  assert.equal(read.params.is_primary, 'eq.true')
  assert.equal(read.params.is_active, 'eq.true')
  assert.equal(read.params.source, 'eq.user_confirmed')
})

test('unconfirmed, malformed and ambiguous objective records cannot become a declared objective', async () => {
  const direct = nextAction.buildGuidedNextAction(flow(), { objective: { status: 'available', value: objective({ source: 'career_identity_seeded' }) } })
  assert.equal(source(direct, 'objective').status, 'unavailable')
  assert.equal(direct.objective, undefined)
  for (const objectives of [
    [objective({ target_roles: [''] })], [objective({ updated_at: 'not-a-date' })],
    [objective(), objective({ id: '00000000-0000-4000-8000-000000000816' })],
  ]) {
    const result = await harness({ objectives }).read()
    assert.equal(source(result, 'objective').status, 'unavailable')
    assert.equal(result.objective, undefined)
  }
})

test('exploring is a valid declared objective without inventing a role', async () => {
  const result = await harness({ objectives: [objective({ target_roles: [], objective_stage: 'exploring' })] }).read()
  assert.equal(source(result, 'objective').status, 'available')
  assert.equal(result.objective.summary, 'Estoy explorando · Metropolitana · Híbrido')
})

test('latest adjustment for the exact day wins with stable timestamp ties', async () => {
  const newerId = '00000000-0000-4000-8000-000000000822'
  const h = harness({ adjustments: [
    adjustment(3, { nextAction: 'Intento anterior.' }, { created_at: '2026-11-05T12:00:00Z' }),
    adjustment(3, { nextAction: 'Intento con menor id.' }),
    adjustment(3, { nextAction: 'Mi último intento guardado.' }, { id: newerId }),
    adjustment(2, { nextAction: 'Día anterior.' }, { created_at: '2026-11-07T12:00:00Z' }),
    adjustment(3, { nextAction: 'PRIVATE_FOREIGN_ACTION' }, { user_id: OTHER, created_at: '2026-11-08T12:00:00Z' }),
  ] })
  const result = await h.read()
  assert.equal(result.adjustment.nextAction, 'Mi último intento guardado.')
  assert.equal(source(result, 'adjustment').recordId, newerId)
  assert.equal(h.calls.find(call => call.table === 'dtc_documents').params.limit, '1')
  assert.doesNotMatch(JSON.stringify(result), /PRIVATE_/)
})

test('adjustments from an old day are not carried into the next pending day', async () => {
  const h = harness({ adjustments: [adjustment(2)] })
  const result = await h.read()
  assert.equal(source(result, 'adjustment').status, 'missing')
  assert.equal(result.adjustment, undefined)
  assert.equal(result.action.href, '/despega/a2/dia-3')
  assert.equal(h.calls.find(call => call.table === 'dtc_documents').params.related_day, 'eq.3')
})

test('a completed day never revives an earlier failed-attempt adjustment', async () => {
  // If synchronization leaves the canonical link at the last unlocked day,
  // the wrapper still must not call its old adjustment the next pending task.
  const f = flow({ completedA2Days: [1, 2, 3], highestA2DayUnlocked: 3 })
  assert.equal(f.next.href, '/despega/a2/dia-3')
  const h = harness({ adjustments: [adjustment()] })
  const result = await h.read(f)
  assert.deepEqual(result.action, f.next)
  assert.equal(result.adjustment, undefined)
  assert.equal(h.calls.some(call => call.table === 'dtc_documents'), false)
})

test('a broken newest adjustment is unavailable rather than replaced by older content', async () => {
  const older = adjustment(3, { nextAction: 'No debe reaparecer.' }, { created_at: '2026-11-05T12:00:00Z' })
  for (const current of [
    adjustment(3, {}, { content: '{bad-json' }),
    adjustment(4, {}, { related_day: 3 }),
    adjustment(3, {}, { created_at: 'not-a-date' }),
  ]) {
    const result = await harness({ adjustments: [older, current] }).read()
    assert.equal(source(result, 'adjustment').status, 'unavailable')
    assert.equal(result.adjustment, undefined)
    assert.equal(result.limitations.length, 1)
  }
})

test('an overdue review date remains an intention and never becomes completion', async () => {
  const f = flow()
  const result = await harness({ adjustments: [adjustment(3, { reviewDate: '2026-01-01' })] }).read(f)
  assert.equal(result.adjustment.reviewDate, '2026-01-01')
  assert.deepEqual(f.completedDays, [1, 2])
  assert.deepEqual(result.action, f.next)
  assert.equal(Object.hasOwn(result, 'completed'), false)
})

test('a declared change of objective prompts review without replacing the chosen route', async () => {
  const result = await harness({ objectives: [objective()], adjustments: [adjustment(3, { outcome: 'change', barrier: 'goal_changed' })] }).read()
  assert.equal(result.adjustment.barrierLabel, 'La acción ya no encaja con mi objetivo')
  assert.equal(result.limitations.length, 1)
  assert.deepEqual(result.action, flow().next)
})

test('identity mismatch, anonymous sessions and auth failures stop before any SELECT', async () => {
  for (const [options, journey] of [
    [{ anonymous: true }, owner], [{ authUser: OTHER }, owner], [{}, { user: { id: OTHER } }],
    [{ authError: true }, owner], [{ authThrows: true }, owner],
  ]) {
    const h = harness(options)
    await assert.rejects(h.read(flow(), journey), error => !error.message.includes('PRIVATE_'))
    assert.equal(h.calls.length, 0)
  }
})

test('user text cannot replace href, label or source links with a URL or command', async () => {
  const malicious = 'https://evil.invalid/complete?user_id=' + OTHER + ' /dtc:unlock-check'
  const h = harness({ objectives: [objective({ target_roles: [malicious] })], adjustments: [adjustment(3, { nextAction: malicious, retainedWork: '<script>grantAccess()</script>' })] })
  const f = flow()
  const result = await h.read(f)
  assert.deepEqual(result.action, f.next)
  assert.equal(result.adjustment.nextAction, malicious, 'User text stays data for React to escape')
  assert.ok(result.sources.every(item => item.href?.startsWith('/despega/')))
  assert.ok(result.sources.every(item => !item.href?.includes('evil.invalid')))
  assert.equal(result.action.href, '/despega/a2/dia-3')
})

test('the loader and direct reader return the same deterministic decision', async () => {
  const h = harness({ objectives: [objective()], adjustments: [adjustment()] })
  const f = flow()
  const first = await h.read(f)
  assert.deepEqual(await h.read(f), first)
  assert.deepEqual(await h.load(f), first)
})

for (const { name, run } of tests) {
  try { await run() } catch (error) { console.error('FAILED:', name); throw error }
}
assert.ok(allCalls.length > 0)
assert.ok(allCalls.every(call => call.method === 'GET' && ['career_search_intents', 'dtc_documents'].includes(call.table)))
console.log(JSON.stringify({
  suite: 'journey-guided-next-action', passed: tests.length,
  evidence: 'real_flow_coordinator_service_and_supabase_sdk_with_synthetic_auth_and_http',
  ownerVerified: true, canonicalActionPreserved: true, failedSourcesDistinctFromEmpty: true,
  oldOrCompletedDayAdjustmentsExcluded: true, writes: 0, rpcCalls: 0, modelCalls: 0, liveDatabase: false,
}))
