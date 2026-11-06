import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { closureLab, safeFailure } from './closure-lab.mjs'

const { root, status, evidence } = closureLab()
const secrets = [status.DB_URL, status.ANON_KEY, status.SERVICE_ROLE_KEY]
let failure = null, result
try {
  const command = spawnSync('supabase', ['db', 'advisors', '--local', '--workdir', join(root, 'stack'),
    '--type', 'security', '--level', 'warn', '--fail-on', 'none', '--output-format', 'json'],
  { encoding: 'utf8', timeout: 120000, maxBuffer: 8 * 1024 * 1024 })
  assert.equal(command.status, 0, safeFailure(new Error(
    `Local security advisors failed: ${command.error?.message ?? command.stderr ?? command.signal ?? 'unknown'}`), secrets))
  const value = JSON.parse(command.stdout)
  const items = Array.isArray(value) ? value : value?.message === 'db advisors' ? value.results : null
  assert.ok(Array.isArray(items) && items.every(item => item && typeof item.name === 'string' && typeof item.level === 'string'))
  const relevant = items.filter(item => /a2_reviewed_plans|a2_plan_|read_a2_plan_receipt|mutate_a2_reviewed_plan/.test(JSON.stringify(item.metadata ?? {})))
  const findings = relevant.map(item => ({ name: item.name, level: item.level,
    schema: item.metadata?.schema, object: item.metadata?.name ?? item.metadata?.table }))
  result = { command: 'supabase db advisors --local --type security --level warn --output-format json',
    cliVersion: '2.117.0', scope: 'candidate A2 plan tables, private history/receipts and functions',
    totalLaboratoryFindings: items.length, candidateFindings: findings, remoteOperations: 0 }
  assert.equal(findings.length, 0, 'Candidate A2 plan objects have security advisor findings')
} catch (error) { failure = safeFailure(error, secrets); process.exitCode = 1 }
writeFileSync(join(evidence, 'a2-plan-advisors.json'), JSON.stringify({ ...result,
  verdict: failure ? 'FAIL' : 'PASS', failure }, null, 2))
if (failure) console.error('A2 plan local advisors failed:', failure)
else console.log('A2 plan local security advisors: PASS (no candidate warning/error; unrelated findings counted separately).')
