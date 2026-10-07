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
    languages: ['Español'], is_primary: true, is_active: true,
    source: 'user_confirmed', created_at: NOW, updated_at: NOW, ...overrides,
  }
}

const source = readFileSync(resolve('app/api/a4/search-intents/route.ts'), 'utf8')
const compiled = ts.transpileModule(source, {
  fileName: 'route.ts',
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
}).outputText

function harness(options = {}) {
  const rows = clone(options.rows ?? [row()])
  const reads = [], writes = [], authCalls = [], accessCalls = []
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
        if (options.concurrent && this.columns === 'id,updated_at') {
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
  const db = { from: table => new Query(table) }
  const ports = {
    'next/server': { NextResponse },
    '@/lib/auth/server-user': { resolveServerUser: async () => {
      authCalls.push(true)
      if (options.authThrows) throw new Error(PRIVATE)
      return options.user === undefined ? { id: USER } : options.user
    } },
    '@/lib/supabase/server': { createAdminClient: () => db },
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
  new Function('require', 'module', 'exports', 'fetch', compiled)(name => {
    assert.ok(Object.hasOwn(ports, name), 'Unexpected import: ' + name)
    return ports[name]
  }, module, module.exports, () => assert.fail('No external requests are allowed'))
  return { ...module.exports, rows, reads, writes, authCalls, accessCalls }
}

const input = overrides => ({
  targetRoles: ['Ingeniería y Proyectos'], breadth: 'related',
  locations: ['Valparaíso'], workModes: ['hybrid'], isPrimary: true, ...overrides,
})
const request = value => new Request('https://dtc.example.invalid/api/a4/search-intents', {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(value),
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
  const bad = new Request('https://dtc.example.invalid/api/a4/search-intents', { method: 'POST', body: '{' })
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
  const body = await result(await h.POST(request(input())), 201)
  assert.equal(body.intent.is_primary, true)
  assert.deepEqual(h.rows.slice(0, 2), prior)
  assert.equal(h.writes.length, 1); assert.equal(h.writes[0].kind, 'insert')
})
test('concurrent first saves create exactly one primary and report the other conflict', async () => {
  const h = harness({ rows: [], concurrent: true })
  const responses = await Promise.all([h.POST(request(input())), h.POST(request(input({ targetRoles: ['Salud'] })))])
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
  const body = await result(await h.POST(request(input({
    user_id: OTHER, userId: OTHER, id: 'foreign', source: 'career_identity_seeded', is_active: false,
  }))), 200)
  assert.equal(body.intent.id, ID); assert.equal(body.intent.source, 'user_confirmed')
  assert.equal(body.intent.is_active, true); assert.deepEqual(h.rows[1], priorForeign)
})
test('first-insert failures never change previously stored searches', async () => {
  const h = harness({ rows: [row({ is_primary: false })], writeError: true })
  const prior = clone(h.rows)
  await result(await h.POST(request(input())), 503)
  assert.deepEqual(h.rows, prior); assert.equal(h.writes.length, 1)
})
test('a 200-character role survives exploration-to-save without silent truncation', async () => {
  const role = 'Ingeniería '.repeat(20).slice(0, 200).trim()
  assert.ok(role.length > 160)
  const h = harness()
  const body = await result(await h.POST(request(input({ targetRoles: [role] }))), 200)
  assert.deepEqual(body.intent.target_roles, [role])
})
test('role/location/mode limits normalize bounded values and preserve Spanish text', async () => {
  const h = harness()
  const body = await result(await h.POST(request(input({
    targetRoles: [' Ingeniería ', 'Ingeniería', ...Array.from({ length: 12 }, (_, i) => 'Cargo ' + i)],
    locations: Array.from({ length: 9 }, (_, i) => 'Región ' + i),
    workModes: ['remote', 'invalid', 'onsite', 'remote'],
  }))), 200)
  assert.equal(body.intent.target_roles[0], 'Ingeniería')
  assert.equal(body.intent.target_roles.length, 8); assert.equal(body.intent.locations.length, 6)
  assert.deepEqual(body.intent.work_modes, ['remote', 'onsite'])
})

let passed = 0
for (const item of cases) {
  await item.run()
  passed++
  process.stdout.write('PASS ' + item.name + '\n')
}
process.stdout.write(JSON.stringify({ suite: 'a4-search-intents', passed, total: cases.length }) + '\n')
