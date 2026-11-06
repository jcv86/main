import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { closureLab, safeFailure } from './closure-lab.mjs'

const { root, status, evidence } = closureLab()
assert.equal(JSON.parse(readFileSync(join(root, 'a2-review-evidence-prepared.json'), 'utf8')).environment,
  'disposable-local-a2-review-evidence')
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
  const relevant = items.filter(item => /dtc_outcome_observations|a4_verified_signals|a4_decision_log|set_a4_canonical_updated_at|a2_reviewed_plans|a2_plan_|read_a2_plan_receipt|mutate_a2_reviewed_plan/.test(JSON.stringify(item.metadata ?? {})))
  const findings = relevant.map(item => ({ name: item.name, level: item.level,
    schema: item.metadata?.schema, object: item.metadata?.name ?? item.metadata?.table }))
  result = { command: 'supabase db advisors --local --type security --level warn --output-format json',
    cliVersion: '2.117.0', scope: 'existing A3 capture, A4 signal/decision source objects and reused A2 plan persistence',
    totalLaboratoryFindings: items.length, candidateFindings: findings, remoteOperations: 0 }
  assert.equal(findings.length, 0, 'AG05 source or reused plan objects have security advisor findings')
} catch (error) { failure = safeFailure(error, secrets); process.exitCode = 1 }
writeFileSync(join(evidence, 'a2-review-evidence-advisors.json'), JSON.stringify({ ...result,
  verdict: failure ? 'FAIL' : 'PASS', failure }, null, 2))
if (failure) console.error('AG05 local advisors failed:', failure)
else console.log('AG05 local security advisors: PASS (no candidate warning/error; unrelated findings counted separately).')
