import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const source = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8')
const a2 = source('app/despega/a2/resultados/page.tsx')
const a3 = source('app/despega/a3/resultados/page.tsx')
const a4 = source('app/despega/a4/resultados/page.tsx')
const integral = source('app/despega/reporte-integral/page.tsx')
const documents = source('app/despega/a4/documents/page.tsx')
const data = source('lib/reports/user-report-data.ts')
const migration = source('supabase/migrations/20260828002558_retire_dtc_documents_demo_read.sql')

assert.ok(a2.includes('loadA2Report'))
assert.ok(a2.includes('Días completados'))
assert.ok(a3.includes('loadA3Report'))
assert.ok(a3.includes('Sesiones verificadas'))
assert.ok(a3.includes('feedbackSummary'))
assert.ok(a4.includes('loadA4Report'))
assert.ok(!a4.includes('/api/a4-insights'))
assert.ok(!a4.includes('2450'))
assert.ok(integral.includes('Reporte integral A1–A4'))
assert.ok(integral.includes('PrintReportButton'))
assert.ok(data.includes(".from('a2_user_task_completions')"))
assert.ok(data.includes(".from('a3_session_attempts')"))
assert.ok(data.includes(".from('a4_verified_signals')"))
assert.ok(documents.includes(".eq('user_id', user.id)"))
assert.ok(migration.includes('drop policy if exists dtc_documents_demo_read'))

console.log('DTC reporting contract: PASS')
