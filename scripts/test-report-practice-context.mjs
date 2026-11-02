import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'
import * as cycleReview from '../lib/a2/cycle-review.ts'
import * as practicePath from '../lib/a2/practice-path.ts'
import * as serverProgress from '../lib/a2/server-progress.ts'

// Real report loaders and review logic with synthetic database I/O only.
const USER = '00000000-0000-4000-8000-000000000701'
const OTHER = '00000000-0000-4000-8000-000000000702'
const compiled = ts.transpileModule(readFileSync('lib/reports/user-report-data.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText
function fixture({ path = 'persona', horizon = 30, errorTable, completed = 30 } = {}) {
  const tables = {
    despega_user_profiles: [{ user_id: USER, camino_foco: path }],
    despega_journey_state: [{ user_id: USER, metadata: horizon ? { a2_horizon: horizon } : {}, highest_a2_day_unlocked: completed + 1 }],
    a2_user_task_completions: [
      ...Array.from({ length: completed }, (_, i) => ({ user_id: USER, day: i + 1, mission_type: 'builder', validation_status: 'structural', validation_result: { score: 100 }, submission: { evidence: 'Una observación propia guardada.' }, completed_at: '2026-11-02T12:00:00Z' })),
      { user_id: OTHER, day: 90, submission: { evidence: 'Otra persona' }, completed_at: '2026-11-02T13:00:00Z' },
    ],
    a3_session_attempts: [
      { user_id: USER, module_id: 'career-mirror', module_number: 1, status: 'completed', score: 100, feedback: 'Un ejemplo guardado.', created_at: '2026-11-02T12:00:00Z' },
      { user_id: OTHER, module_id: 'cv-builder-studio', module_number: 3, status: 'completed', score: 100, feedback: 'Dato ajeno', created_at: '2026-11-02T13:00:00Z' },
    ],
  }
  const reads = []
  const db = { from(table) {
    assert.ok(Object.hasOwn(tables, table), table)
    let columns = '*', one = false
    const filters = []
    const query = {
      select(value) { columns = value; return query },
      eq(key, value) { filters.push(row => row[key] === value); return query },
      not(key, op, value) { assert.equal(op, 'is'); assert.equal(value, null); filters.push(row => row[key] !== null); return query },
      order() { return query },
      maybeSingle() { one = true; return query },
      then(resolve, reject) {
        reads.push({ table, columns })
        if (table === errorTable) return Promise.resolve({ data: null, error: { message: 'PRIVATE_FIXTURE_ERROR' } }).then(resolve, reject)
        const rows = tables[table].filter(row => filters.every(check => check(row))).map(row => Object.fromEntries(columns.split(',').map(key => [key, row[key]])))
        return Promise.resolve({ data: one ? rows[0] ?? null : rows, error: null }).then(resolve, reject)
      },
    }
    return query
  } }
  const modules = {
    'server-only': {}, '@/lib/a2/cycle-review': cycleReview,
    '@/lib/a2/practice-path': practicePath, '@/lib/a2/server-progress': serverProgress,
    '@/lib/supabase/server': { createAdminClient: () => db },
    '@/lib/a4/evidence-pulse': {}, '@/lib/reports/a1-professional-report': {}, '@/lib/a1/source-revision': {},
  }
  const exports = {}
  new Function('require', 'exports', compiled)(name => { assert.ok(Object.hasOwn(modules, name), name); return modules[name] }, exports)
  return { ...exports, reads }
}
let passed = 0
const personal = await fixture().loadA2Report(USER)
assert.equal(personal.activeHorizon, 30)
assert.equal(personal.activeReview.completedDays, 30)
assert.equal(personal.activeReview.checkpointsRequired, 0)
assert.equal(personal.activeReview.gaps.some(value => value.includes('Entrenamiento')), false)
assert.equal(personal.completedDays, 30, 'Another owner must not extend this report.')
passed++
const professional = await fixture({ path: 'profesional' }).loadA2Report(USER)
assert.ok(professional.activeReview.checkpointsRequired > 0)
assert.ok(professional.activeReview.gaps.some(value => value.includes('Entrenamiento')))
passed++
const extended = await fixture({ horizon: 60, completed: 40 }).loadA2Report(USER)
assert.equal(extended.activeReview.horizon, 60)
assert.equal(extended.completedDays, 40)
passed++
const historical = await fixture({ horizon: null, completed: 61 }).loadA2Report(USER)
assert.equal(historical.activeHorizon, 90)
passed++
for (const errorTable of ['despega_user_profiles', 'despega_journey_state', 'a2_user_task_completions']) {
  await assert.rejects(fixture({ errorTable }).loadA2Report(USER), error => !error.message.includes('PRIVATE_FIXTURE_ERROR'))
  passed++
}
const a3Fixture = fixture()
const a3 = await a3Fixture.loadA3Report(USER)
assert.equal(a3.completedModules, 1)
assert.equal(a3.totalSessions, 1)
assert.equal(Object.hasOwn(a3, 'averageScore'), false)
assert.equal(Object.hasOwn(a3.modules[0], 'score'), false)
passed++
await assert.rejects(fixture().loadA2Report(''))
await assert.rejects(fixture().loadA3Report(''))
passed++
console.log(JSON.stringify({ suite: 'report-practice-context', passed, evidence: 'real_loaders_and_review_logic_with_synthetic_database_io', liveDatabase: false }))
