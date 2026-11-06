/** Read-only aggregate gate. It cannot change a rollout, deployment or database. */
import { readFileSync, statSync } from 'node:fs'
import { evaluateA2SwarmCanaryEvidence } from '../lib/a2/swarm/canary-evidence.ts'

const args = process.argv.slice(2)
if (args.length === 1 && args[0] === '--help') {
  console.log('Usage: node --import tsx scripts/check-a2-swarm-canary.mjs --evidence <aggregate.json> --expected <identity.json>\nRead-only recommendation: exit 0 eligible_for_review, 1 rollback, 2 hold. Synthetic evidence is never eligible. No activation or publication is performed.')
  process.exit(0)
}

function readJson(path) {
  const stat = statSync(path)
  if (!stat.isFile() || stat.size > 64_000) throw new Error('invalid_file')
  return JSON.parse(readFileSync(path, 'utf8'))
}

try {
  if (args.length !== 4 || args[0] !== '--evidence' || args[2] !== '--expected') throw new Error('invalid_arguments')
  const result = evaluateA2SwarmCanaryEvidence(readJson(args[1]), readJson(args[3]))
  console.log(JSON.stringify(result))
  process.exitCode = result.decision === 'eligible_for_review' ? 0 : result.decision === 'rollback' ? 1 : 2
} catch {
  // Never echo paths, supplied JSON, credentials or arbitrary parsing errors.
  console.log(JSON.stringify({ decision: 'hold', reasons: ['invalid_input_files_or_arguments'], identity: null, policyVersion: 'dtc-a2-swarm-canary-policy.v1' }))
  process.exitCode = 2
}
