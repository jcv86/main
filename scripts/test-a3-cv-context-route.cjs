// Production handler and Supabase SDK, with synthetic HTTP. No live Auth/RLS claim.
const assert = require('node:assert/strict')
const fs = require('node:fs')
const ts = require('typescript')
const { createClient } = require('@supabase/supabase-js')
const { NextResponse } = require('next/server')
const cv = require('../lib/a3/cv-builder.ts')

const USER = '00000000-0000-4000-8000-000000000301'
const OTHER = '00000000-0000-4000-8000-000000000302'
const canonical = { user_id: USER, module_id: 'cv-builder-studio', completed_at: '2026-09-01T10:00:00Z', deliverable: {
  fullName: 'Persona de prueba', professionalSummary: 'Versión canónica revisada después de completar.',
  pendingFacts: 'Confirmar una fecha.', factsConfirmed: false, evidenceKind: 'project',
} }
const alias = { user_id: USER, module_id: 'module-3', completed_at: '2026-10-15T10:00:00Z', deliverable: {
  fullName: 'Persona de prueba', professionalSummary: 'Versión anterior del alias.',
} }
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
const tests = []
const test = (name, run) => tests.push({ name, run })

function harness(options = {}) {
  const rows = structuredClone(options.rows || [])
  const calls = []
  const transport = async (target, init = {}) => {
    const url = new URL(String(target))
    assert.equal(url.hostname, 'synthetic.invalid')
    assert.equal(url.pathname, '/rest/v1/a3_module_completion')
    assert.equal(init.method, 'GET', 'Restoring a CV never writes completion rows.')
    assert.equal(url.searchParams.get('user_id'), 'eq.' + USER)
    assert.equal(url.searchParams.get('module_id'), 'in.(cv-builder-studio,module-3)')
    assert.equal(url.searchParams.get('limit'), '2')
    assert.equal(url.searchParams.has('order'), false, 'Completion dates cannot choose the latest edited CV.')
    const columns = url.searchParams.get('select').split(',')
    assert.deepEqual(columns, ['module_id', 'deliverable', 'completed_at'])
    calls.push({ method: init.method, params: [...url.searchParams] })
    if (options.transportError) throw new Error('PRIVATE_TRANSPORT_DETAIL')
    if (options.readError) return json({ code: 'XX001', message: 'PRIVATE_DATABASE_DETAIL' }, 500)
    const selected = rows.filter(row => row.user_id === USER && ['cv-builder-studio', 'module-3'].includes(row.module_id)).slice(0, 2)
    return json(selected.map(row => Object.fromEntries(columns.map(column => [column, row[column]]))))
  }
  const client = createClient('https://synthetic.invalid', 'synthetic-public-key', {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }, global: { fetch: transport },
  })
  const dependencies = {
    'next/server': { NextResponse },
    '@/lib/auth/server-user': { resolveServerUser: async () => {
      if (options.authError) throw new Error('PRIVATE_AUTH_DETAIL')
      return options.anonymous ? null : { id: USER, source: 'supabase' }
    } },
    '@/lib/supabase/server': { createClient: async () => client },
    '@/lib/a3/cv-builder': cv,
  }
  const module = { exports: {} }
  const source = fs.readFileSync('app/api/a3/module-context/cv-builder-studio/route.ts', 'utf8')
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
  new Function('require', 'module', 'exports', compiled)(name => {
    assert.ok(Object.hasOwn(dependencies, name), 'Unexpected dependency: ' + name)
    return dependencies[name]
  }, module, module.exports)
  return { calls, get: async () => {
    const response = await module.exports.GET()
    assert.equal(response.headers.get('cache-control'), 'private, no-store')
    assert.equal(response.headers.get('cdn-cache-control'), 'no-store')
    assert.equal(response.headers.get('vercel-cdn-cache-control'), 'no-store')
    const body = await response.json()
    assert.doesNotMatch(JSON.stringify(body), /PRIVATE_/)
    return { response, body }
  } }
}

test('canonical edited CV wins even with an earlier initial completion date', async () => {
  for (const rows of [[alias, canonical], [canonical, alias]]) {
    const h = harness({ rows })
    const { response, body } = await h.get()
    assert.equal(response.status, 200)
    assert.deepEqual(body.savedCv, cv.normalizeCvBuilderState(canonical.deliverable))
    assert.equal(body.completedAt, canonical.completed_at)
    assert.equal(h.calls.length, 1)
  }
})
test('alias is used only when the canonical row is absent', async () => {
  const { response, body } = await harness({ rows: [alias] }).get()
  assert.equal(response.status, 200)
  assert.deepEqual(body.savedCv, cv.normalizeCvBuilderState(alias.deliverable))
  assert.equal(body.completedAt, alias.completed_at)
})
test('an existing empty canonical row does not resurrect an older alias', async () => {
  const { body } = await harness({ rows: [alias, { ...canonical, deliverable: null }] }).get()
  assert.deepEqual(body.savedCv, cv.normalizeCvBuilderState(null))
  assert.equal(body.completedAt, canonical.completed_at)
})
test('empty history remains empty', async () => {
  const { response, body } = await harness().get()
  assert.equal(response.status, 200)
  assert.deepEqual(body, { savedCv: null, completedAt: null })
})
test('another owner cannot supply a canonical row or leak a CV', async () => {
  const foreign = { ...canonical, user_id: OTHER, deliverable: { fullName: 'PRIVATE_FOREIGN_CV' } }
  const onlyForeign = await harness({ rows: [foreign] }).get()
  assert.deepEqual(onlyForeign.body, { savedCv: null, completedAt: null })
  const withOwnAlias = await harness({ rows: [foreign, alias] }).get()
  assert.deepEqual(withOwnAlias.body.savedCv, cv.normalizeCvBuilderState(alias.deliverable))
})
test('read and transport failures remain errors rather than empty or fallback success', async () => {
  for (const failure of [{ readError: true }, { transportError: true }]) {
    const { response, body } = await harness({ ...failure, rows: [canonical, alias] }).get()
    assert.equal(response.status, 500)
    assert.equal(Object.hasOwn(body, 'savedCv'), false)
  }
})
test('unauthenticated and failed identity checks do not read completion data', async () => {
  for (const [options, status] of [[{ anonymous: true }, 401], [{ authError: true }, 500]]) {
    const h = harness(options)
    assert.equal((await h.get()).response.status, status)
    assert.equal(h.calls.length, 0)
  }
})

;(async () => {
  for (const { name, run } of tests) { await run(); console.log('PASS ' + name) }
  console.log(JSON.stringify({ suite: 'a3-cv-context-route', passed: tests.length, evidence: 'real_handler_next_response_and_sdk_synthetic_http', liveAuthOrRls: false }))
})().catch(error => { console.error(error); process.exitCode = 1 })
