import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import ts from 'typescript'
import { createClient as createSyntheticSupabaseClient } from '@supabase/supabase-js'
import { DISC_TEST_QUESTIONS } from '../lib/disc-test-questions.ts'
import { validateAndScoreDiscResponses } from '../lib/a1/disc-scoring.ts'
import { buildA1ProfessionalReport } from '../lib/reports/a1-professional-report.ts'
import { evaluateOpportunityPersonalOrientation } from '../lib/opportunities/personal-orientation.ts'

const SOURCE = readFileSync(new URL('../lib/opportunities/personal-context.ts', import.meta.url), 'utf8')
const compiled = ts.transpileModule(SOURCE, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
const id = number => '00000000-0000-4000-8000-' + String(number).padStart(12, '0')
const USER = id(501), OTHER = id(502)
const NOW = new Date('2026-10-08T05:00:00Z')
const DATE = '2026-10-07T12:00:00Z'
const PRIVATE = 'SYNTHETIC_PRIVATE_ERROR_DO_NOT_RETURN'
const cases = [], test = (name, run) => cases.push({ name, run })
const source = (context, name) => context.sources.find(value => value.source === name)
const evidence = (context, name) => context.evidence.filter(value => value.source === name)

function assessment() {
  const more = {}, less = {}
  for (const question of DISC_TEST_QUESTIONS) {
    more[question.id] = question.opciones.find(option => option.dimension === 'D').texto
    less[question.id] = question.opciones.find(option => option.dimension === 'I').texto
  }
  const scored = validateAndScoreDiscResponses({ more, less })
  assert.equal(scored.valid, true)
  return { id: id(2), user_id: USER, completed_at: DATE, responses: scored.value.responses,
    disc_profile: scored.value.scores, dominant_pattern: scored.value.dominantPattern, secondary_pattern: scored.value.secondaryPattern }
}

function task(day = 12) {
  return { id: id(100 + day), user_id: USER, source_module: 'a2', source_type: 'mission_completion', source_ref: 'a2-day-' + day,
    observed_at: DATE, expires_at: null, assertion: PRIVATE, confidence: 100,
    value: { day, validationStatus: 'structural', validation: { passed: true, score: 100 },
      submission: { evidence: 'Documenté un reporte SQL con las consultas empleadas y su resultado.', summary: 'Presenté el reporte SQL construido durante la misión.', reflection: PRIVATE, artifactUrl: 'https://private.example.test/' } },
    metadata: { identityVersion: 12, contact: PRIVATE } }
}

function valid() {
  return {
    career_identities: [{ id: id(1), user_id: USER, version: 12, target_roles: ['Analista de datos'], updated_at: DATE, strengths: [PRIVATE] }],
    a1_cerebral_assessment: [assessment()],
    a3_module_completion: [
      { id: id(3), user_id: USER, module_id: 'cv-builder-studio', completed_at: '2026-10-07T12:00:00', best_score: 100,
        deliverable: { targetRole: 'Analista de datos', skills: 'SQL, Excel y Power BI', experienceTitle: 'Analista de datos',
          achievement1: 'Construí un informe SQL para comparar resultados mensuales.', achievement2: 'Reduje el tiempo del reporte con Power BI.', achievement3: '',
          fullName: PRIVATE, email: 'synthetic@example.test', phone: '+56 9 1234 5678', professionalSummary: PRIVATE, targetKeywords: 'Java, Rust, Kubernetes', education: PRIVATE } },
      { id: id(4), user_id: USER, module_id: 'value-mining-lab', completed_at: '2026-10-07T13:00:00', best_score: 100,
        deliverable: { projectValue: 'Documenté un proyecto de análisis SQL y el resultado observado.', criticalValue: 'Describí cómo presenté información al equipo para revisar una decisión.', futureApplication: PRIVATE, nextAction: PRIVATE } },
    ],
    career_evidence: [task()],
  }
}

function harness(options = {}) {
  const tables = structuredClone(options.tables ?? valid()), queries = []
  let authCalls = 0, clientCalls = 0
  class Query {
    constructor(table) { assert.ok(Object.hasOwn(tables, table), 'Unexpected table ' + table); this.table = table; this.filters = []; this.orders = []; this.max = Infinity; this.single = false }
    select(columns) { assert.ok(!columns.includes('*')); this.columns = columns; return this }
    eq(key, value) { this.filters.push(['eq', key, value]); return this }
    in(key, values) { this.filters.push(['in', key, values]); return this }
    not(key, op, value) { assert.equal(op, 'is'); assert.equal(value, null); this.filters.push(['notnull', key]); return this }
    order(key, options = {}) { this.orders.push([key, options.ascending !== false]); return this }
    limit(value) { assert.ok(Number.isInteger(value) && value > 0 && value <= 65); this.max = value; return this }
    maybeSingle() { this.single = true; return this }
    then(ok, fail) { return this.execute().then(ok, fail) }
    async execute() {
      queries.push({ table: this.table, columns: this.columns, filters: this.filters, orders: this.orders, max: this.max })
      const fault = options.fault?.(this.table, this.columns)
      if (fault === 'throw') throw new Error(PRIVATE)
      if (fault) return fault
      let rows = tables[this.table].filter(row => this.filters.every(([op, key, value]) =>
        op === 'eq' ? row[key] === value : op === 'in' ? value.includes(row[key]) : row[key] != null))
      rows.sort((a, b) => {
        for (const [key, ascending] of this.orders) {
          const left = a[key] ?? '', right = b[key] ?? ''
          const comparison = left < right ? -1 : left > right ? 1 : 0
          if (comparison) return ascending ? comparison : -comparison
        }
        return 0
      })
      rows = rows.slice(0, this.max).map(row => Object.fromEntries(this.columns.split(',').map(column => {
        const [alias, expression] = column.includes(':') ? column.split(':') : [column, column]
        const keys = expression.split('->'), first = keys.shift()
        let value = row[first]
        for (const key of keys) value = value && typeof value === 'object' ? value[key] : null
        return [alias, value ?? null]
      })))
      return { data: this.single ? rows[0] ?? null : rows, error: null }
    }
  }
  const client = {
    auth: { getUser: async () => {
      authCalls++
      if (options.authThrows) throw new Error(PRIVATE)
      return { data: { user: options.authUser === null ? null : { id: options.authUser ?? USER } }, error: options.authError ?? null }
    } },
    from: table => new Query(table),
  }
  const modules = {
    'server-only': {}, 'node:crypto': { createHash },
    '@/lib/reports/a1-professional-report': { buildA1ProfessionalReport },
    '@/lib/supabase/server': {
      createClient: async () => { clientCalls++; if (options.clientThrows) throw new Error(PRIVATE); return client },
      createAdminClient: () => assert.fail('A personal reader must not use a privileged client'),
    },
  }
  const module = { exports: {} }
  new Function('require', 'module', 'exports', compiled)(name => {
    assert.ok(Object.hasOwn(modules, name), 'Unexpected reader dependency: ' + name)
    return modules[name]
  }, module, module.exports)
  return { ...module.exports, tables, queries, client, authCalls: () => authCalls, clientCalls: () => clientCalls,
    run: (options = {}) => module.exports.readOpportunityPersonalContext(client, USER, { now: NOW, ...options }) }
}

test('the real reader authenticates the owner and uses only bounded, explicit, read-only projections', async () => {
  const h = harness(), before = structuredClone(h.tables), result = await h.run()
  assert.equal(result.status, 'available'); assert.equal(h.authCalls(), 1); assert.equal(h.queries.length, 5)
  assert.deepEqual(h.tables, before)
  for (const query of h.queries) {
    assert.ok(query.filters.some(([op, key, value]) => op === 'eq' && key === 'user_id' && value === USER))
    assert.ok(query.max <= 21 && Number.isFinite(query.max))
    assert.doesNotMatch(query.columns, /\*|user_id|fullName|email|phone|professionalSummary|targetKeywords|score|confidence|assertion|transcript/i)
    assert.ok(!query.columns.split(',').includes('deliverable'))
    assert.ok(!query.columns.split(',').includes('value'))
    assert.ok(!query.columns.split(',').includes('responses'))
  }
  assert.equal(result.sources.length, 5); assert.ok(result.evidence.length <= 64)
  assert.doesNotMatch(JSON.stringify(result), /SYNTHETIC_PRIVATE|synthetic@example|\+56|Kubernetes|user_id|rawScores|best_score/)
})

test('the real Supabase transport serializes minimized JSON selectors and owner predicates into GET requests', async () => {
  const calls = []
  const client = createSyntheticSupabaseClient('https://dtc-synthetic.supabase.invalid', 'synthetic-anon-key', {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: async (input, init) => {
      const url = new URL(typeof input === 'string' || input instanceof URL ? input : input.url)
      assert.equal(url.origin, 'https://dtc-synthetic.supabase.invalid')
      assert.equal(init?.method, 'GET'); assert.ok(!init?.body)
      calls.push(url)
      return new Response('[]', { status: 200, headers: { 'Content-Type': 'application/json' } })
    } },
  })
  let verifiedOwner = 0
  client.auth.getUser = async () => { verifiedOwner++; return { data: { user: { id: USER } }, error: null } }
  const result = await harness().readOpportunityPersonalContext(client, USER, { now: NOW })
  assert.equal(verifiedOwner, 1); assert.equal(result.status, 'empty'); assert.equal(calls.length, 5)
  for (const url of calls) {
    assert.equal(url.searchParams.get('user_id'), 'eq.' + USER)
    assert.ok(Number(url.searchParams.get('limit')) <= 21)
    assert.doesNotMatch(url.searchParams.get('select'), /\*|email|phone|fullName/)
  }
  const cv = calls.find(url => url.searchParams.get('select').includes('skills:'))
  assert.equal(cv.pathname, '/rest/v1/a3_module_completion')
  assert.ok(cv.searchParams.get('select').includes('skills:deliverable->skills'))
  assert.equal(cv.searchParams.get('module_id'), 'in.(cv-builder-studio,module-3)')
  assert.equal(cv.searchParams.get('completed_at'), 'not.is.null')
  assert.equal(cv.searchParams.get('order'), 'completed_at.desc,id.desc')
  const a1 = calls.find(url => url.pathname.endsWith('/a1_cerebral_assessment'))
  assert.ok(a1.searchParams.get('select').includes('questionnaire_version:responses->_meta->questionnaireVersion'))
  assert.ok(a1.searchParams.get('select').includes('responses_more:responses->more'))
  const a2 = calls.find(url => url.pathname.endsWith('/career_evidence'))
  assert.ok(a2.searchParams.get('select').includes('submission_evidence:value->submission->evidence'))
  assert.equal(a2.searchParams.get('source_module'), 'eq.a2')
  assert.equal(a2.searchParams.get('source_type'), 'eq.mission_completion')
})

test('no session, another owner and authentication failures prevent every personal query', async () => {
  for (const options of [{ authUser: null }, { authUser: OTHER }, { authThrows: true }, { authError: { message: PRIVATE } }]) {
    const h = harness(options), result = await h.run()
    assert.equal(result.status, 'unavailable'); assert.equal(h.queries.length, 0); assert.deepEqual(result.evidence, [])
    assert.doesNotMatch(JSON.stringify(result), new RegExp(PRIVATE))
  }
})

test('invalid identity or clock stops before authentication and database reads', async () => {
  const h = harness()
  for (const userId of ['', 'synthetic@example.test', '../another-user']) {
    assert.equal((await h.readOpportunityPersonalContext(h.client, userId, { now: NOW })).status, 'unavailable')
  }
  assert.equal((await h.run({ now: new Date('invalid') })).status, 'unavailable')
  assert.equal(h.authCalls(), 0); assert.equal(h.queries.length, 0)
})

test('SSR client creation failure is sanitized while the normal loader still checks the owner', async () => {
  const bad = harness({ clientThrows: true }), result = await bad.loadOpportunityPersonalContext(USER, { now: NOW })
  assert.equal(result.status, 'unavailable'); assert.doesNotMatch(JSON.stringify(result), new RegExp(PRIVATE)); assert.equal(bad.queries.length, 0)
  const good = harness(); assert.equal((await good.loadOpportunityPersonalContext(USER, { now: NOW })).status, 'available')
  assert.equal(good.clientCalls(), 1); assert.equal(good.authCalls(), 1)
})

test('successful absence and foreign records contribute no personal evidence', async () => {
  for (const tables of [Object.fromEntries(Object.keys(valid()).map(key => [key, []])),
    Object.fromEntries(Object.entries(valid()).map(([key, rows]) => [key, rows.map(row => ({ ...row, user_id: OTHER }))]))]) {
    const result = await harness({ tables }).run()
    assert.equal(result.status, 'empty'); assert.deepEqual(result.evidence, []); assert.ok(result.sources.every(value => value.status === 'empty'))
  }
})

test('each source degrades independently on database errors or rejected transports', async () => {
  const queries = [['career_identities', '', 'dtc_goal'], ['a1_cerebral_assessment', '', 'dtc_a1'], ['career_evidence', '', 'dtc_a2'],
    ['a3_module_completion', 'skills:', 'cv'], ['a3_module_completion', 'project_value:', 'dtc_a3']]
  for (const [table, column, sourceName] of queries) for (const fault of ['throw', { data: null, error: { code: '42P01', message: PRIVATE } }]) {
    const result = await harness({ fault: (name, columns) => name === table && columns.includes(column) ? fault : null }).run()
    assert.equal(result.status, 'partial'); assert.equal(source(result, sourceName).status, 'unavailable')
    assert.deepEqual(evidence(result, sourceName), [])
    assert.ok(result.sources.filter(value => value.source !== sourceName).every(value => value.status === 'available'))
    assert.doesNotMatch(JSON.stringify(result), new RegExp(PRIVATE))
  }
})

test('malformed database envelopes are unavailable rather than an invented empty profile', async () => {
  for (const data of [null, {}, 'invalid']) {
    const result = await harness({ fault: table => table === 'career_evidence' ? { data, error: null } : null }).run()
    assert.equal(source(result, 'dtc_a2').status, 'unavailable')
  }
})

test('the CV projection separates experience title, aspirations, skills and achievements', async () => {
  const result = await harness().run(), cv = evidence(result, 'cv')
  assert.equal(cv.find(item => item.id.endsWith(':experienceTitle')).nature, 'declared_experience')
  assert.equal(cv.find(item => item.id.endsWith(':experienceTitle')).text, 'Analista de datos')
  assert.equal(cv.find(item => item.id.endsWith(':target-role')).nature, 'declared_goal')
  assert.equal(cv.find(item => item.id.endsWith(':achievement1')).nature, 'declared_experience')
  assert.equal(cv.filter(item => item.nature === 'declared_skill').length, 1)
  assert.ok(cv.every(item => item.href === '/despega/a3/cv-builder-studio'))
})

test('a negated CV skills list is kept intact and is never split into positive declarations', async () => {
  const tables = valid(), clause = 'No manejo SQL, Python ni Java; estoy aprendiendo Excel.'
  tables.a3_module_completion[0].deliverable.skills = clause
  const skills = evidence(await harness({ tables }).run(), 'cv').filter(item => item.nature === 'declared_skill')
  assert.equal(skills.length, 1); assert.equal(skills[0].text, clause)
})

test('the latest completed CV wins and an empty latest record does not resurrect an older CV', async () => {
  const tables = valid(), original = tables.a3_module_completion[0]
  tables.a3_module_completion.push({ ...structuredClone(original), id: id(9), module_id: 'module-3', completed_at: '2026-10-08T01:00:00', deliverable: { skills: 'Rust' } })
  const first = await harness({ tables }).run()
  assert.deepEqual(evidence(first, 'cv').map(item => item.text), ['Rust'])
  tables.a3_module_completion.at(-1).deliverable = {}
  const second = await harness({ tables }).run()
  assert.equal(source(second, 'cv').status, 'partial'); assert.deepEqual(evidence(second, 'cv'), [])
})

test('timestamp without time zone from A3 is interpreted as database UTC regardless of process timezone', async () => {
  const previous = process.env.TZ
  try {
    process.env.TZ = 'America/Los_Angeles'
    const result = await harness().run()
    assert.equal(source(result, 'cv').updatedAt, '2026-10-07T12:00:00.000Z')
    assert.equal(source(result, 'dtc_a3').updatedAt, '2026-10-07T13:00:00.000Z')
  } finally { if (previous === undefined) delete process.env.TZ; else process.env.TZ = previous }
})

test('future source dates never become completed personal evidence', async () => {
  for (const [table, index, field, sourceName] of [
    ['career_identities', 0, 'updated_at', 'dtc_goal'], ['a1_cerebral_assessment', 0, 'completed_at', 'dtc_a1'],
    ['a3_module_completion', 0, 'completed_at', 'cv'], ['a3_module_completion', 1, 'completed_at', 'dtc_a3'], ['career_evidence', 0, 'observed_at', 'dtc_a2'],
  ]) {
    const tables = valid(); tables[table][index][field] = '2027-01-01T00:00:00Z'
    const result = await harness({ tables }).run()
    assert.equal(source(result, sourceName).status, 'partial'); assert.deepEqual(evidence(result, sourceName), [])
  }
})

test('invalid calendar dates, undated sources and naive dates outside A3 do not produce evidence', async () => {
  for (const value of ['2026-02-30T12:00:00Z', '2026-10-07T24:00:00Z', 'bad-date', '2026-10-07T12:00:00', null]) {
    const tables = valid(); tables.career_identities[0].updated_at = value
    const result = await harness({ tables }).run()
    assert.equal(source(result, 'dtc_goal').status, 'partial'); assert.deepEqual(evidence(result, 'dtc_goal'), [])
  }
})

test('expired A2 evidence is excluded and future expiry remains explicit', async () => {
  const tables = valid(); tables.career_evidence[0].expires_at = '2026-10-07T23:00:00Z'
  const expired = await harness({ tables }).run(); assert.deepEqual(evidence(expired, 'dtc_a2'), [])
  tables.career_evidence[0].expires_at = '2026-10-09T12:00:00Z'
  const active = await harness({ tables }).run()
  assert.equal(evidence(active, 'dtc_a2').length, 2)
  assert.ok(evidence(active, 'dtc_a2').every(value => value.expiresAt === '2026-10-09T12:00:00.000Z'))
})

test('expiry before observation and malformed expiry are not usable evidence', async () => {
  for (const expiry of ['2026-10-06T12:00:00Z', 'invalid', {}]) {
    const tables = valid(); tables.career_evidence[0].expires_at = expiry
    const result = await harness({ tables }).run(); assert.equal(source(result, 'dtc_a2').status, 'partial'); assert.deepEqual(evidence(result, 'dtc_a2'), [])
  }
})

test('source clauses above the budget are rejected intact while other supported fields remain available', async () => {
  const tables = valid(); tables.a3_module_completion[0].deliverable.skills = 'SQL, Python ' + 'x'.repeat(2000) + ' no son mis habilidades'
  const result = await harness({ tables }).run()
  assert.equal(source(result, 'cv').status, 'partial'); assert.ok(evidence(result, 'cv').length > 0)
  assert.ok(!evidence(result, 'cv').some(value => value.nature === 'declared_skill'))
  assert.ok(result.evidence.every(value => value.text.length <= 2000))
})

test('non-string JSON fields keep their original types and cannot masquerade as declared skill text', async () => {
  for (const value of [['SQL'], { skill: 'SQL' }, 90, true]) {
    const tables = valid(); tables.a3_module_completion[0].deliverable.skills = value
    const result = await harness({ tables }).run()
    assert.equal(source(result, 'cv').status, 'partial'); assert.ok(!evidence(result, 'cv').some(value => value.nature === 'declared_skill'))
  }
})

test('incidental contacts and arbitrary URLs are rejected with their complete clause', async () => {
  for (const clause of ['SQL; correo: synthetic@example.test', 'SQL; https://private.example.test/document', 'SQL; www.private.example.test',
    'SQL; teléfono: +56 9 1234 5678', 'SQL; RUT 12.345.678-5', 'SQL; linkedin.com/in/synthetic']) {
    const tables = valid(); tables.a3_module_completion[0].deliverable.skills = clause
    tables.career_evidence[0].value.submission.evidence = clause
    tables.a3_module_completion[1].deliverable.projectValue = clause
    const result = await harness({ tables }).run()
    for (const name of ['cv', 'dtc_a2', 'dtc_a3']) assert.equal(source(result, name).status, 'partial')
    assert.ok(!result.evidence.some(value => value.text === clause))
  }
})

test('ordinary quantified achievements remain usable without becoming a generic readiness score', async () => {
  const tables = valid(), clause = 'Reduje el costo mensual en 1.000.000 CLP y el plazo en 25%.'
  tables.a3_module_completion[0].deliverable.achievement1 = clause
  const result = await harness({ tables }).run()
  assert.equal(evidence(result, 'cv').find(value => value.id.endsWith(':achievement1')).text, clause)
  assert.doesNotMatch(JSON.stringify(result), /readiness|proficiency|experience_years|match_score/)
})

test('A1 provides literal situational preferences with traceable dates, never pattern-derived skills', async () => {
  const result = await harness().run(), preferences = evidence(result, 'dtc_a1')
  assert.equal(preferences.length, 4)
  assert.ok(preferences.every(value => value.nature === 'self_reported_preference' && value.href === '/despega/a1-report'))
  assert.deepEqual(preferences.map(value => value.preferenceDomain).sort(), ['collaboration', 'communication', 'decision', 'environment'])
  for (const preference of preferences) {
    assert.match(preference.id, /^dtc_a1:[0-9a-f-]+:question-\d+$/)
    assert.match(preference.text, /como más parecido.*como menos parecido/)
    assert.match(preference.text, /no acredita una competencia/)
    assert.equal(preference.observedAt, '2026-10-07T12:00:00.000Z')
  }
  assert.doesNotMatch(JSON.stringify(result), /rawScores|intensities|dominant_pattern|secondary_pattern|Leadership|proficiency/)
})

test('an ambiguous DISC pattern still allows actual choices without asserting a resolved profile', async () => {
  const record = assessment(), report = buildA1ProfessionalReport({ rawScores: record.disc_profile, assessmentResponses: record.responses })
  assert.equal(report.understanding.pattern.status, 'ambiguous')
  const result = await harness().run()
  assert.equal(source(result, 'dtc_a1').status, 'available')
  assert.ok(evidence(result, 'dtc_a1').every(value => !/perfil dominante|Impulsor|Catalizador/.test(value.text)))
})

test('actual reader preferences reach the actual orientation engine as a reflective action without ranking credit', async () => {
  const tables = Object.fromEntries(Object.keys(valid()).map(key => [key, []]))
  tables.a1_cerebral_assessment = [assessment()]
  const context = await harness({ tables }).run()
  const result = evaluateOpportunityPersonalOrientation({
    title: 'Coordinador de soporte', requirements: ['Trabajo en equipo y colaboración.'], skills: ['trabajo en equipo'],
    field_evidence: [{ field: 'skills', value: 'trabajo en equipo', excerpt: 'Trabajo en equipo y colaboración.', origin: 'source_field' }],
  }, context, { targetRoles: [], locations: [], workModes: [], breadth: 'related' }, NOW)
  assert.equal(result.supportedTopics, 0)
  assert.equal(result.orientation.reasons.length, 0)
  assert.match(result.orientation.nextStep.label, /preferencia declarada en A1/)
  assert.ok(result.orientation.nextStep.supportIds.length > 0)
  assert.ok(result.orientation.support.every(value => value.personal.source === 'dtc_a1' && value.personal.preferenceDomain === 'collaboration'))
  assert.doesNotMatch(JSON.stringify(result), /dominas|mejor candidato|compatible al|rawScores|match_score/i)
})

test('A1 missing, inconsistent, incomplete or unsupported selections do not fall back to stored pattern labels', async () => {
  for (const alter of [
    row => { row.responses = {} },
    row => { row.disc_profile = { D: 20, I: -20, S: 0, C: 0 } },
    row => { delete row.responses.more['1'] },
    row => { row.responses._meta.questionnaireVersion = 'unreviewed-future-version' },
    row => { row.responses.more['1'] = PRIVATE },
  ]) {
    const tables = valid(); alter(tables.a1_cerebral_assessment[0])
    const result = await harness({ tables }).run()
    assert.equal(source(result, 'dtc_a1').status, 'partial'); assert.deepEqual(evidence(result, 'dtc_a1'), [])
    assert.doesNotMatch(JSON.stringify(result), new RegExp(PRIVATE))
  }
})

test('A1 unrelated metadata and free-form additions are outside its minimized projection', async () => {
  const tables = valid(); tables.a1_cerebral_assessment[0].responses.private_notes = PRIVATE
  tables.a1_cerebral_assessment[0].disc_profile.private_context = PRIVATE
  const result = await harness({ tables }).run()
  assert.equal(source(result, 'dtc_a1').status, 'available'); assert.doesNotMatch(JSON.stringify(result), new RegExp(PRIVATE))
})

test('A2 requires a canonical day reference, successful validation and actual documentation', async () => {
  for (const alter of [row => { row.source_ref = 'a2-day-99' }, row => { row.value.day = 91 }, row => { row.value.day = '12' },
    row => { row.value.validation.passed = false }, row => { row.value.validationStatus = 'checkpoint' },
    row => { row.value.submission = {} }]) {
    const tables = valid(); alter(tables.career_evidence[0])
    const result = await harness({ tables }).run()
    assert.equal(source(result, 'dtc_a2').status, 'partial'); assert.deepEqual(evidence(result, 'dtc_a2'), [])
  }
})

test('generic A2/A3 completion assertions and confidence values do not become skills', async () => {
  const tables = valid(); tables.career_evidence[0].value.submission = {}
  tables.career_evidence[0].assertion = 'Domina Python'; tables.a3_module_completion[1].deliverable = {}
  tables.career_evidence.push({ ...task(), id: id(401), source_module: 'a3', source_type: 'training_module_completion', assertion: 'Domina SQL', value: { moduleId: 'communication-gym' } })
  const result = await harness({ tables }).run()
  assert.deepEqual(evidence(result, 'dtc_a2'), []); assert.deepEqual(evidence(result, 'dtc_a3'), [])
  assert.doesNotMatch(JSON.stringify(result), /Domina|confidence|training_module_completion/)
})

test('A3 retains the latest declared past experience and excludes planned future applications', async () => {
  const tables = valid(), previous = tables.a3_module_completion[1]
  tables.a3_module_completion.push({ ...structuredClone(previous), id: id(19), module_id: 'module-2', completed_at: '2026-10-08T01:00:00', deliverable: { projectValue: 'Documenté un informe financiero con resultados.', futureApplication: 'Quiero dominar Python' } })
  const result = await harness({ tables }).run()
  assert.deepEqual(evidence(result, 'dtc_a3').map(value => value.text), ['Documenté un informe financiero con resultados.'])
  assert.ok(evidence(result, 'dtc_a3').every(value => value.nature === 'declared_experience'))
  assert.ok(evidence(result, 'dtc_a3').every(value => /declarada/.test(value.label)))
})

test('actual A3 past-work responses remain declared experience in the actual orientation engine', async () => {
  const tables = Object.fromEntries(Object.keys(valid()).map(key => [key, []]))
  tables.a3_module_completion = [{ ...valid().a3_module_completion[1], deliverable: { projectValue: 'Construí un reporte SQL para comparar resultados mensuales.' } }]
  const context = await harness({ tables }).run()
  const result = evaluateOpportunityPersonalOrientation({
    title: 'Analista', requirements: ['Experiencia con SQL.'], skills: ['SQL'],
    field_evidence: [{ field: 'skills', value: 'SQL', excerpt: 'Experiencia con SQL.', origin: 'source_field' }],
  }, context, { targetRoles: [], locations: [], workModes: [], breadth: 'related' }, NOW)
  assert.equal(result.supportedTopics, 1)
  assert.ok(result.orientation.support.every(value => value.personal.source === 'dtc_a3' && value.personal.nature === 'declared_experience'))
  assert.match(result.orientation.reasons[0].label, /experiencia que declaraste en DTC/)
  assert.doesNotMatch(result.orientation.reasons[0].label, /práctica|certificad|dominas/)
})

test('an expired latest A2 source cannot resurrect an older duplicate reference', async () => {
  const tables = valid(), older = structuredClone(tables.career_evidence[0])
  tables.career_evidence[0].observed_at = '2026-10-08T01:00:00Z'; tables.career_evidence[0].expires_at = '2026-10-08T02:00:00Z'
  older.id = id(98); tables.career_evidence.push(older)
  const result = await harness({ tables }).run(); assert.deepEqual(evidence(result, 'dtc_a2'), [])
})

test('an invalid latest A2 day or id cannot resurrect older content for its canonical reference', async () => {
  for (const alter of [row => { row.value.day = '12' }, row => { row.id = 'invalid-source-id' }]) {
    const tables = valid(), older = structuredClone(tables.career_evidence[0])
    tables.career_evidence[0].observed_at = '2026-10-08T01:00:00Z'
    alter(tables.career_evidence[0])
    older.id = id(98); tables.career_evidence.push(older)
    const result = await harness({ tables }).run()
    assert.equal(source(result, 'dtc_a2').status, 'partial')
    assert.deepEqual(evidence(result, 'dtc_a2'), [])
  }
})

test('bounded A2 history exposes partial coverage and never exceeds its evidence budget', async () => {
  const tables = valid(); tables.career_evidence = Array.from({ length: 30 }, (_, index) => task(index + 11))
  const h = harness({ tables }), result = await h.run()
  assert.equal(source(result, 'dtc_a2').status, 'partial')
  assert.equal(evidence(result, 'dtc_a2').length, 40); assert.ok(result.evidence.length <= 64)
  assert.equal(h.queries.find(value => value.table === 'career_evidence').max, 21)
})

test('invalid references, markup or control characters are excluded without losing other sources', async () => {
  for (const value of ['SQL\u0000Python', '<script>SQL</script>']) {
    const tables = valid(); tables.a3_module_completion[0].deliverable.skills = value
    const result = await harness({ tables }).run(); assert.equal(source(result, 'cv').status, 'partial')
    assert.ok(!evidence(result, 'cv').some(value => value.nature === 'declared_skill'))
  }
  const tables = valid(); tables.a3_module_completion[0].id = 'https://private.example.test'
  const result = await harness({ tables }).run(); assert.deepEqual(evidence(result, 'cv'), [])
})

test('goal labels are bounded and versioned while over-limit goals remain explicitly partial', async () => {
  const tables = valid(); tables.career_identities[0].target_roles = Array.from({ length: 10 }, (_, index) => 'Cargo ' + index)
  const result = await harness({ tables }).run()
  assert.equal(source(result, 'dtc_goal').status, 'partial'); assert.equal(evidence(result, 'dtc_goal').length, 8)
  tables.career_identities[0].target_roles = [{ role: 'invented' }, 'x'.repeat(201), 'Contador']
  const invalid = await harness({ tables }).run()
  assert.equal(source(invalid, 'dtc_goal').status, 'partial'); assert.deepEqual(evidence(invalid, 'dtc_goal').map(value => value.text), ['Contador'])
})

test('revision is stable across equivalent reads, clock changes and irrelevant private bookkeeping', async () => {
  const h = harness(), first = await h.run()
  h.tables.career_evidence[0].confidence = 1; h.tables.career_evidence[0].metadata.contact = 'Changed private field'
  h.tables.a3_module_completion.reverse(); h.tables.a3_module_completion.find(value => value.module_id === 'cv-builder-studio').deliverable.email = 'changed@example.test'
  const second = await h.run({ now: new Date('2026-10-08T06:00:00Z') })
  assert.equal(first.revision, second.revision); assert.match(first.revision, /^[0-9a-f]{64}$/)
})

test('revision changes when relevant content, identity version, source availability or expiry changes', async () => {
  const first = await harness().run()
  for (const change of [tables => { tables.a3_module_completion[0].deliverable.skills = 'Excel' }, tables => { tables.career_identities[0].version++ }]) {
    const tables = valid(); change(tables); assert.notEqual((await harness({ tables }).run()).revision, first.revision)
  }
  assert.notEqual((await harness({ fault: table => table === 'career_evidence' ? 'throw' : null }).run()).revision, first.revision)
  const tables = valid(); tables.career_evidence[0].expires_at = '2026-10-08T06:00:00Z'
  const h = harness({ tables }); assert.notEqual((await h.run()).revision, (await h.run({ now: new Date('2026-10-08T06:00:00Z') })).revision)
})

test('the public context summary excludes all evidence and unknown source properties', async () => {
  const h = harness(), value = await h.run()
  value.sources[0].private = PRIVATE
  const summary = h.getOpportunityPersonalContextSummary(value)
  assert.deepEqual(Object.keys(summary).sort(), ['revision', 'sources', 'status', 'version'])
  assert.ok(summary.sources.every(value => Object.keys(value).sort().join(',') === 'source,status,updatedAt'))
  assert.doesNotMatch(JSON.stringify(summary), /SYNTHETIC|evidence|SQL|Power BI|Analista|user_id/)
})

test('successive requests read changed source data rather than a cross-request profile cache', async () => {
  const h = harness(), first = await h.run(); h.tables.career_identities = []
  const second = await h.run(); assert.notEqual(first.revision, second.revision); assert.deepEqual(evidence(second, 'dtc_goal'), [])
  assert.equal(h.authCalls(), 2); assert.equal(h.queries.length, 10)
})

let passed = 0, externalRequests = 0
const originalFetch = globalThis.fetch
globalThis.fetch = async () => { externalRequests++; throw new Error('External requests are forbidden in this fixture') }
try {
  for (const { name, run } of cases) {
    try { await run(); passed++; console.log('PASS ' + name) }
    catch (error) { console.error('FAIL ' + name); throw error }
  }
  assert.equal(externalRequests, 0)
  console.log(JSON.stringify({ suite: 'opportunity-personal-context', passed, total: cases.length, externalRequests, databaseWrites: 0 }))
} finally { globalThis.fetch = originalFetch }
