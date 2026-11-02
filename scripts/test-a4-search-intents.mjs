import * as objectiveApi from '../lib/opportunities/objective-api.ts'
import * as laborObjective from '../lib/opportunities/labor-objective.ts'
import * as savedSearch from '../lib/opportunities/saved-search.ts'
import * as employerIndustry from '../lib/opportunities/employer-industry.ts'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import ts from 'typescript'
import { NextResponse } from 'next/server'

// Execute the actual route with a constraint-enforcing, synthetic database.
// No request leaves the process and no production account is read or changed.
const USER = '00000000-0000-4000-8000-000000000701'
const OTHER = '00000000-0000-4000-8000-000000000702'
const ID = '00000000-0000-4000-8000-000000000711'
const PRIVATE = 'SYNTHETIC_PRIVATE_ERROR_NEVER_RETURN'
const NOW = '2026-10-07T22:00:00.000Z'
const cases = []
const test = (name, run) => cases.push({ name, run })
const clone = value => structuredClone(value)

function row(overrides = {}) {
  return {
    id: ID, user_id: USER, name: 'Búsqueda existente',
    target_roles: ['Analista'], breadth: 'related', locations: ['Metropolitana'],
    work_modes: [], industries: ['Tecnología'], excluded_industries: [],
    seniority_min: 'junior', salary_min_clp: 900000, employment_types: [],
    languages: ['Español'], is_primary: true, is_active: true, functional_areas: [], objective_stage: 'specific', unknown_industry_policy: 'exclude', location_preference: 'selected',
    source: 'user_confirmed', created_at: NOW, updated_at: NOW, ...overrides,
  }
}

const source = readFileSync(resolve('app/api/a4/search-intents/route.ts'), 'utf8')
const compiled = ts.transpileModule(source, {
  fileName: 'route.ts',
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
}).outputText
const earlyCompiled = ts.transpileModule(readFileSync(resolve('app/api/career/objective/route.ts'), 'utf8'), {
  fileName: 'route.ts', compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
}).outputText

function harness(options = {}) {
  const rows = clone(options.rows ?? [row()])
  const reads = [], writes = [], authCalls = [], accessCalls = [], pilotCalls = []
  let tick = 0, nextId = 800, waiting = 0, release
  const gate = new Promise(resolveGate => { release = resolveGate })
  class Query {
    constructor(table) {
      assert.equal(table, 'career_search_intents')
      this.kind = 'select'; this.filters = []; this.columns = '*'; this.sort = []
      this.max = Infinity; this.singular = false
    }
    select(columns) { this.columns = columns; return this }
    eq(key, value) { this.filters.push([key, value]); return this }
    order(key, { ascending }) { this.sort.push([key, ascending]); return this }
    limit(max) { this.max = max; return this }
    maybeSingle() { this.singular = true; return this }
    single() { this.singular = true; this.required = true; return this }
    insert(value) { this.kind = 'insert'; this.value = clone(value); return this }
    update(value) { this.kind = 'update'; this.value = clone(value); return this }
    delete() { assert.fail('Saving an intent must not delete any search') }
    matches(value) { return this.filters.every(([key, wanted]) => value[key] === wanted) }
    project(value) {
      assert.notEqual(this.columns, '*', 'Private route must use an explicit projection')
      return Object.fromEntries(this.columns.split(',').map(key => [key, clone(value[key])]))
    }
    async execute() {
      const call = { kind: this.kind, filters: clone(this.filters), value: clone(this.value), columns: this.columns }
      if (this.kind === 'select') {
        reads.push(call)
        if (options.readThrows) throw new Error(PRIVATE)
        if (options.readError) return { data: null, error: { message: PRIVATE } }
        if (Object.hasOwn(options, 'rawRead')) return { data: clone(options.rawRead), error: null }
        let selected = rows.filter(item => this.matches(item))
        for (const [key, ascending] of [...this.sort].reverse()) {
          selected.sort((a, b) => (a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0) * (ascending ? 1 : -1))
        }
        const projected = selected.slice(0, this.max).map(item => this.project(item))
        if (this.singular && projected.length > 1) return { data: null, error: { code: 'PGRST116' } }
        const response = { data: this.singular ? projected[0] ?? null : projected, error: null }
        // Both callers have seen the same old state before either write starts.
        if (options.concurrent && this.singular && this.columns === laborObjective.OBJECTIVE_COLUMNS) {
          if (++waiting === 2) release()
          await gate
        }
        return response
      }

      writes.push(call)
      await options.beforeWrite?.({ rows, call })
      if (options.writeThrows) throw new Error(PRIVATE)
      if (options.writeError) return { data: null, error: { code: 'XX000', message: PRIVATE } }
      if (this.kind === 'insert') {
        const value = row({
          id: '00000000-0000-4000-8000-' + String(nextId++).padStart(12, '0'),
          name: 'Mi búsqueda principal', industries: [], excluded_industries: [],
          seniority_min: null, salary_min_clp: null, employment_types: [], languages: [],
          ...this.value,
        })
        if (value.is_active && value.is_primary && rows.some(item =>
          item.user_id === value.user_id && item.is_active && item.is_primary)) {
          return { data: null, error: { code: '23505', message: PRIVATE } }
        }
        rows.push(value)
        return { data: this.project(value), error: null }
      }
      const matched = rows.filter(item => this.matches(item))
      assert.ok(matched.length <= 1, 'A save must not mutate several search rows')
      for (const item of matched) {
        Object.assign(item, this.value, { updated_at: new Date(Date.parse(NOW) + ++tick).toISOString() })
      }
      if (options.acknowledgementLost) throw new Error(PRIVATE)
      return { data: matched[0] ? this.project(matched[0]) : null, error: null }
    }
    then(success, failure) { return this.execute().then(success, failure) }
  }
  const db = { from: table => new Query(table), auth: { getUser: async () => {
    authCalls.push(true)
    if (options.authThrows) throw new Error(PRIVATE)
    return { data: { user: options.user === undefined ? { id: USER } : options.user }, error: options.sessionError ? new Error(PRIVATE) : null }
  } } }
  const pilotAdmin = { rpc: async (name, args) => {
    assert.equal(name, 'resolve_pilot_access')
    assert.deepEqual(args, { p_user_id: USER, p_claim_id: null })
    pilotCalls.push(args)
    if (options.accessThrows) throw new Error(PRIVATE)
    return { data: [{ allowed: options.pilotAllowed !== false }], error: options.pilotError ? new Error(PRIVATE) : null }
  }, from() { assert.fail('Early objective persistence must use the authenticated session client, not admin') } }
  const ports = {
    '@/lib/opportunities/objective-api': objectiveApi, '@/lib/opportunities/labor-objective': laborObjective, '@/lib/opportunities/saved-search': savedSearch, '@/lib/opportunities/employer-industry': employerIndustry,
    'next/server': { NextResponse },
    '@/lib/auth/server-user': { resolveServerUser: async () => {
      authCalls.push(true)
      if (options.authThrows) throw new Error(PRIVATE)
      return options.user === undefined ? { id: USER } : options.user
    } },
    '@/lib/supabase/server': { createAdminClient: () => options.early ? pilotAdmin : db, createClient: async () => db },
    '@/lib/a4/access-control': {
      checkA4Access: async (userId, client) => {
        accessCalls.push(userId); assert.equal(client, db)
        if (options.accessThrows) throw new Error(PRIVATE)
        return { canAccess: options.canAccess !== false, reason: options.canAccess === false ? 'A3_ROUTE_NOT_COMPLETED' : null }
      },
      getA4AccessDenialMessage: () => 'Acceso A4 pendiente',
    },
  }
  const module = { exports: {} }
  new Function('require', 'module', 'exports', 'fetch', options.early ? earlyCompiled : compiled)(name => {
    assert.ok(Object.hasOwn(ports, name), 'Unexpected import: ' + name)
    return ports[name]
  }, module, module.exports, () => assert.fail('No external requests are allowed'))
  return { ...module.exports, rows, reads, writes, authCalls, accessCalls, pilotCalls }
}

const input = overrides => ({
  targetRoles: ['Ingeniería y Proyectos'], breadth: 'related',
  locations: ['Valparaíso'], workModes: ['hybrid'], isPrimary: true, expectedRevision: { id: ID, updatedAt: NOW }, ...overrides,
})
const request = value => new Request('https://dtc.example.invalid/api/a4/search-intents', {
  method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://dtc.example.invalid' }, body: JSON.stringify(value),
})
async function result(response, status) {
  assert.equal(response.status, status)
  assert.match(response.headers.get('cache-control'), /private.*no-store/)
  assert.equal(response.headers.get('cdn-cache-control'), 'no-store')
  assert.equal(response.headers.get('vercel-cdn-cache-control'), 'no-store')
  const body = await response.json()
  assert.ok(!JSON.stringify(body).includes(PRIVATE))
  assert.ok(!JSON.stringify(body).includes(USER))
  assert.ok(!JSON.stringify(body).includes(OTHER))
  return body
}
function noWrites(h) { assert.deepEqual(h.writes, []) }

test('anonymous GET and POST fail closed before private reads', async () => {
  const h = harness({ user: null })
  await result(await h.GET(), 401)
  await result(await h.POST(request(input())), 401)
  assert.deepEqual(h.reads, []); noWrites(h); assert.deepEqual(h.accessCalls, [])
})
test('signed-in users without A4 access cannot read or change searches', async () => {
  const h = harness({ canAccess: false })
  await result(await h.GET(), 403)
  await result(await h.POST(request(input())), 403)
  assert.deepEqual(h.reads, []); noWrites(h)
})
test('failed auth/access checks return sanitized private availability errors', async () => {
  for (const option of [{ authThrows: true }, { accessThrows: true }]) {
    const h = harness(option)
    await result(await h.GET(), 503)
    await result(await h.POST(request(input())), 503)
    assert.deepEqual(h.reads, []); noWrites(h)
  }
})
test('GET returns only active owner searches with the primary first', async () => {
  const h = harness({ rows: [
    row({ id: 'secondary', is_primary: false }), row(),
    row({ id: 'foreign', user_id: OTHER }),
    row({ id: 'inactive', is_active: false, is_primary: false }),
  ] })
  const body = await result(await h.GET(), 200)
  assert.deepEqual(body.intents.map(item => item.id), [ID, 'secondary'])
  assert.ok(body.intents.every(item => !Object.hasOwn(item, 'user_id')))
  noWrites(h)
})
test('failed or malformed GET never returns partial data', async () => {
  for (const options of [{ readError: true }, { readThrows: true }, { rawRead: null }]) {
    const h = harness(options)
    await result(await h.GET(), 503); noWrites(h)
  }
})
test('invalid inputs do not read or mutate the current primary', async () => {
  for (const value of [null, [], {}, input({ targetRoles: [] }), input({ targetRoles: [null, ' '] }),
    input({ salaryMinClp: -1 }), input({ salaryMinClp: 2147483648 }), input({ salaryMinClp: '100' })]) {
    const h = harness()
    await result(await h.POST(request(value)), 400)
    assert.deepEqual(h.reads, []); noWrites(h)
  }
})
test('malformed JSON is a controlled validation response', async () => {
  const h = harness()
  const bad = new Request('https://dtc.example.invalid/api/a4/search-intents', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://dtc.example.invalid' }, body: '{' })
  await result(await h.POST(bad), 400); noWrites(h)
})
test('updating a primary is one owner-bound statement and preserves its identity/history', async () => {
  const h = harness({ rows: [row(), row({ id: 'secondary', is_primary: false }), row({ id: 'foreign', user_id: OTHER })] })
  const prior = clone(h.rows)
  const body = await result(await h.POST(request(input())), 200)
  assert.equal(body.intent.id, ID); assert.equal(body.intent.is_primary, true)
  assert.deepEqual(body.intent.target_roles, ['Ingeniería y Proyectos'])
  assert.equal(body.intent.created_at, NOW)
  assert.deepEqual(body.intent.industries, ['Tecnología'])
  assert.deepEqual(body.intent.languages, ['Español'])
  assert.equal(body.intent.salary_min_clp, 900000)
  assert.equal(body.intent.name, 'Búsqueda existente')
  assert.deepEqual(h.rows.slice(1), prior.slice(1))
  assert.equal(h.writes.length, 1); assert.equal(h.writes[0].kind, 'update')
  assert.ok(h.writes[0].filters.some(([key, value]) => key === 'user_id' && value === USER))
  assert.ok(h.writes[0].filters.some(([key, value]) => key === 'updated_at' && value === NOW))
  assert.ok(!Object.hasOwn(h.writes[0].value, 'is_primary'), 'Never demote the current primary')
})
test('explicitly supplied advanced preferences can be updated or cleared', async () => {
  const h = harness()
  const body = await result(await h.POST(request(input({
    name: '  Mi foco  ', industries: [], languages: [' Inglés ', 'Inglés'],
    seniorityMin: null, salaryMinClp: null,
  }))), 200)
  assert.equal(body.intent.name, 'Mi foco'); assert.deepEqual(body.intent.industries, [])
  assert.deepEqual(body.intent.languages, ['Inglés'])
  assert.equal(body.intent.seniority_min, null); assert.equal(body.intent.salary_min_clp, null)
})
test('read failures and invalid identities stop before any save', async () => {
  for (const options of [{ readError: true }, { readThrows: true }, { rawRead: { id: ID } }]) {
    const h = harness(options); const prior = clone(h.rows)
    await result(await h.POST(request(input())), 503)
    noWrites(h); assert.deepEqual(h.rows, prior)
  }
})
test('a failed update leaves the old primary and unrelated searches intact', async () => {
  for (const options of [{ writeError: true }, { writeThrows: true }]) {
    const h = harness(options); const prior = clone(h.rows)
    await result(await h.POST(request(input())), 503)
    assert.equal(h.writes.length, 1); assert.deepEqual(h.rows, prior)
  }
})
test('a lost acknowledgement cannot leave the account without a primary or trigger a retry', async () => {
  const h = harness({ acknowledgementLost: true })
  const body = await result(await h.POST(request(input())), 503)
  assert.match(body.error, /confirmar/)
  assert.equal(h.rows.filter(item => item.is_primary && item.is_active).length, 1)
  assert.equal(h.writes.length, 1); assert.equal(h.rows[0].id, ID)
})
test('an intervening save returns conflict and does not overwrite the winner', async () => {
  const h = harness({ beforeWrite: ({ rows }) => Object.assign(rows[0], {
    updated_at: '2026-10-07T22:00:01.000Z', target_roles: ['Cambio de otra sesión'],
  }) })
  await result(await h.POST(request(input())), 409)
  assert.deepEqual(h.rows[0].target_roles, ['Cambio de otra sesión'])
  assert.equal(h.writes.length, 1)
})
test('a new primary is created without changing existing secondary or foreign searches', async () => {
  const h = harness({ rows: [row({ id: 'secondary', is_primary: false }), row({ id: 'foreign', user_id: OTHER })] })
  const prior = clone(h.rows)
  const body = await result(await h.POST(request(input({ expectedRevision: null }))), 201)
  assert.equal(body.intent.is_primary, true)
  assert.deepEqual(h.rows.slice(0, 2), prior)
  assert.equal(h.writes.length, 1); assert.equal(h.writes[0].kind, 'insert')
})
test('concurrent first saves create exactly one primary and report the other conflict', async () => {
  const h = harness({ rows: [], concurrent: true })
  const responses = await Promise.all([h.POST(request(input({ expectedRevision: null }))), h.POST(request(input({ targetRoles: ['Salud'], expectedRevision: null })))])
  assert.deepEqual(responses.map(item => item.status).sort(), [201, 409])
  for (const response of responses) await result(response, response.status)
  assert.equal(h.rows.filter(item => item.is_active && item.is_primary).length, 1)
  assert.equal(h.writes.length, 2)
})
test('concurrent updates keep one primary, one winner and an explicit conflict', async () => {
  const h = harness({ concurrent: true })
  const responses = await Promise.all([h.POST(request(input())), h.POST(request(input({ targetRoles: ['Salud'] })))])
  assert.deepEqual(responses.map(item => item.status).sort(), [200, 409])
  for (const response of responses) await result(response, response.status)
  assert.equal(h.rows.length, 1); assert.equal(h.rows[0].id, ID)
  assert.equal(h.rows[0].is_primary, true); assert.equal(h.writes.length, 2)
})
test('saving a secondary never demotes or edits the existing primary', async () => {
  const h = harness(); const prior = clone(h.rows[0])
  await result(await h.POST(request(input({ isPrimary: false }))), 201)
  assert.deepEqual(h.rows[0], prior); assert.equal(h.rows[1].is_primary, false)
  assert.equal(h.reads.length, 0)
})
test('client ownership, identity and source fields cannot select another account', async () => {
  const h = harness({ rows: [row(), row({ id: 'foreign', user_id: OTHER })] })
  const priorForeign = clone(h.rows[1])
  await result(await h.POST(request(input({ user_id: OTHER, userId: OTHER, id: 'foreign', source: 'career_identity_seeded', is_active: false }))), 400)
  assert.deepEqual(h.rows[1], priorForeign); noWrites(h)
})
test('first-insert failures never change previously stored searches', async () => {
  const h = harness({ rows: [row({ is_primary: false })], writeError: true })
  const prior = clone(h.rows)
  await result(await h.POST(request(input({ expectedRevision: null }))), 503)
  assert.deepEqual(h.rows, prior); assert.equal(h.writes.length, 1)
})
test('a 200-character role survives exploration-to-save without silent truncation', async () => {
  const role = 'Ingeniería '.repeat(20).slice(0, 200).trim()
  assert.ok(role.length > 160)
  const h = harness()
  const body = await result(await h.POST(request(input({ targetRoles: [role] }))), 200)
  assert.deepEqual(body.intent.target_roles, [role])
})
test('oversized lists and invalid modalities fail rather than widening the objective', async () => {
  for (const patch of [{ targetRoles: Array.from({length: 9}, (_, i) => 'Cargo '+i) }, { locations: Array(7).fill('Maule') }, { workModes: ['remote','invalid'] }]) {
    const h = harness(); await result(await h.POST(request(input(patch))), 400); noWrites(h)
  }
})

test('client revision from an older read conflicts before writing, not only during the current request', async () => {
  const h = harness({ rows: [row({ updated_at: '2026-10-08T00:00:00Z' })] })
  await result(await h.POST(request(input())), 409); noWrites(h)
})
test('missing revision is not permission to overwrite an existing primary', async () => {
  const h = harness(); const value = input(); delete value.expectedRevision
  await result(await h.POST(request(value)), 400); noWrites(h)
})
test('exploration without a fictional role persists and reads all objective dimensions', async () => {
  const h = harness({ rows: [] })
  const filters = { targetRoles: [], functionalAreas: [], objectiveStage: 'exploring', locations: [], locationPreference: 'unspecified', workModes: [], breadth: 'related', industries: ['Minería'], excludedIndustries: ['Comercio'], unknownIndustryPolicy: 'include' }
  const body = await result(await h.POST(request({ ...filters, isPrimary: true, expectedRevision: null })), 201)
  const confirmed = savedSearch.confirmedSavedSearch(body, filters)
  assert.deepEqual(confirmed.filters.targetRoles, [])
  assert.equal(confirmed.filters.objectiveStage, 'exploring')
  const read = savedSearch.primarySearchFromResponse(await result(await h.GET(), 200))
  assert.deepEqual(read.filters, confirmed.filters)
})
test('specific area-only objective is valid while an empty specific direction is rejected', async () => {
  const h = harness()
  const body = await result(await h.POST(request(input({ targetRoles: [], functionalAreas: ['finance'], objectiveStage: 'specific' }))), 200)
  assert.deepEqual(body.intent.target_roles, []); assert.deepEqual(body.intent.functional_areas, ['Finanzas y Contabilidad'])
  const invalid = harness(); await result(await invalid.POST(request(input({ targetRoles: [], functionalAreas: [], objectiveStage: 'specific' }))), 400); noWrites(invalid)
})
test('malformed new fields and contradictory restrictions never disappear during normalization', async () => {
  for (const patch of [{ functionalAreas: null }, { functionalAreas: ['inventada'] }, { objectiveStage: 'maybe' }, { industries: null }, { unknownIndustryPolicy: 'guess' }, { locationPreference: 'any' }, { industries: ['Minería'], excludedIndustries: ['Minería'] }]) {
    const h = harness(); await result(await h.POST(request(input(patch))), 400); noWrites(h)
  }
})
test('cross-origin, wrong content type and oversized JSON fail without mutation', async () => {
  for (const [headers, body, expected] of [
    [{ Origin: 'https://other.invalid', 'Content-Type': 'application/json' }, JSON.stringify(input()), 403],
    [{ Origin: 'https://dtc.example.invalid', 'Sec-Fetch-Site': 'same-site', 'Content-Type': 'application/json' }, JSON.stringify(input()), 403],
    [{ Origin: 'https://dtc.example.invalid', 'Content-Type': 'text/plain' }, JSON.stringify(input()), 415],
    [{ Origin: 'https://dtc.example.invalid', 'Content-Type': 'application/json', 'Content-Length': '99999' }, '{}', 413],
    [{ Origin: 'https://dtc.example.invalid', 'Content-Type': 'application/json' }, JSON.stringify({ pad: 'x'.repeat(32769) }), 413],
  ]) {
    const h = harness(); await result(await h.POST(new Request('https://dtc.example.invalid/api/a4/search-intents', { method: 'POST', headers, body })), expected); noWrites(h)
  }
})

test('early objective requires a verified session and pilot access before private reads', async () => {
  for (const [options, status] of [[{ user: null }, 401], [{ sessionError: true }, 401], [{ pilotAllowed: false }, 403], [{ pilotError: true }, 503], [{ accessThrows: true }, 503]]) {
    const h = harness({ early: true, ...options })
    await result(await h.GET(), status)
    await result(await h.POST(request(input())), status)
    assert.deepEqual(h.reads, []); noWrites(h); assert.deepEqual(h.accessCalls, [])
  }
})
test('a pilot can define an early objective without A4 access and without unlocking A4', async () => {
  const h = harness({ early: true, canAccess: false, rows: [row({ user_id: OTHER })] })
  const filters = laborObjective.completeOpportunityFilters({ targetRoles: [], functionalAreas: ['Finanzas y Contabilidad'], objectiveStage: 'exploring', locations: [], locationPreference: 'unspecified', workModes: [], breadth: 'related', industries: ['Minería'], unknownIndustryPolicy: 'include' })
  const saved = await result(await h.POST(request({ ...filters, isPrimary: true, expectedRevision: null })), 201)
  assert.deepEqual(savedSearch.confirmedSavedSearch(saved, filters).filters, filters)
  assert.deepEqual(h.accessCalls, []); assert.equal(h.pilotCalls.length, 1)
  assert.equal(h.writes.length, 1); assert.equal(h.rows.find(item => item.user_id === OTHER).target_roles[0], 'Analista')
  const radar = harness({ rows: h.rows, canAccess: false })
  await result(await radar.GET(), 403); noWrites(radar)
})
test('early saved objective is recovered identically by the real A4 reader when access is later available', async () => {
  const early = harness({ early: true })
  const filters = laborObjective.completeOpportunityFilters({ targetRoles: ['Contador'], functionalAreas: ['Finanzas y Contabilidad'], objectiveStage: 'specific', locations: ['Biobío'], workModes: ['hybrid'], breadth: 'precise', industries: ['Minería'], excludedIndustries: ['Comercio'], unknownIndustryPolicy: 'exclude' })
  const updated = await result(await early.POST(request({ ...filters, expectedRevision: { id: ID, updatedAt: NOW } })), 200)
  const earlyRead = savedSearch.primarySearchFromResponse(await result(await early.GET(), 200))
  const radarRead = savedSearch.primarySearchFromResponse(await result(await harness({ rows: early.rows }).GET(), 200))
  assert.deepEqual(earlyRead, radarRead)
  assert.deepEqual(earlyRead.filters, filters)
  assert.equal(earlyRead.advanced.salaryMinClp, 900000)
  assert.deepEqual(earlyRead.advanced.languages, ['Español'])
  assert.equal(updated.intent.id, ID)
  assert.ok(early.reads.every(call => call.filters.some(([key, value]) => key === 'user_id' && value === USER)))
})
test('early edit conflicts and failures retain the confirmed objective and cannot target another owner', async () => {
  const conflict = harness({ early: true, rows: [row({ updated_at: '2026-10-08T00:00:00Z' })] })
  await result(await conflict.POST(request(input())), 409); noWrites(conflict)
  const failed = harness({ early: true, writeError: true })
  await result(await failed.POST(request(input())), 503)
  assert.deepEqual(failed.rows, [row()])
  const foreign = harness({ early: true })
  await result(await foreign.POST(request(input({ userId: OTHER }))), 400); noWrites(foreign)
})
test('early endpoint uses the same bounded same-origin write contract', async () => {
  const h = harness({ early: true })
  await result(await h.POST(new Request('https://dtc.example.invalid/api/career/objective', {
    method: 'POST', headers: { Origin: 'https://foreign.invalid', 'Content-Type': 'application/json' }, body: JSON.stringify(input()),
  })), 403)
  noWrites(h)
})

let passed = 0
for (const item of cases) {
  await item.run()
  passed++
  process.stdout.write('PASS ' + item.name + '\n')
}
process.stdout.write(JSON.stringify({ suite: 'a4-search-intents', passed, total: cases.length }) + '\n')
