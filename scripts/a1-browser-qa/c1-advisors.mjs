import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { closureLab, safeFailure } from './closure-lab.mjs'

const { root, status, evidence } = closureLab()
const secrets = [status.DB_URL, status.ANON_KEY, status.SERVICE_ROLE_KEY]
let failure = null
let result
try {
  const command = spawnSync('supabase', ['db', 'advisors', '--local', '--workdir', join(root, 'stack'),
    '--type', 'security', '--level', 'warn', '--fail-on', 'none', '--output-format', 'json'],
  { encoding: 'utf8', timeout: 120000, maxBuffer: 8 * 1024 * 1024 })
  assert.equal(command.status, 0, safeFailure(new Error(
    `Local security advisor command failed: ${command.error?.message ?? command.stderr ?? command.signal ?? 'unknown error'}`), secrets))
  const value = JSON.parse(command.stdout)
  // CLI 2.117.0 machine output is { results: [...], message: 'db advisors' }.
  // Retain the documented legacy array, but fail closed on every other shape.
  const items = Array.isArray(value) ? value : value?.message === 'db advisors' ? value.results : null
  assert.ok(Array.isArray(items), 'Unexpected local advisor JSON shape')
  assert.ok(items.every(item => item && typeof item.name === 'string' && typeof item.level === 'string'),
    'Unexpected local advisor entry')
  const relevant = items.filter(item => item.metadata?.schema === 'dtc_private'
    || /complete_c1_atomic|get_c1_completion_status|c1_completion_receipts/.test(JSON.stringify(item.metadata ?? {})))
  const findings = relevant.map(item => ({ name: item.name, level: item.level,
    schema: item.metadata?.schema, object: item.metadata?.name ?? item.metadata?.table }))
  result = { command: 'supabase db advisors --local --type security --level warn --output-format json',
    cliVersion: '2.117.0',
    scope: 'new C1 completion functions and private receipt schema in the disposable laboratory',
    totalLaboratoryFindings: items.length, candidateFindings: findings, remoteOperations: 0 }
  assert.equal(findings.length, 0, 'New C1 objects have security advisor findings')
} catch (error) {
  failure = safeFailure(error, secrets)
  process.exitCode = 1
}
writeFileSync(join(evidence, 'c1-advisors.json'), JSON.stringify({ ...result,
  verdict: failure ? 'FAIL' : 'PASS', failure }, null, 2))
if (failure) console.error('C1 local security advisors failed:', failure)
else console.log('C1 local security advisors: PASS (no warning/error on candidate objects; unrelated laboratory findings counted separately).')
