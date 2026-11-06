import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { closureLab } from './closure-lab.mjs'
import { assertAuthSources } from './auth-lab.mjs'

const { root, app, repo, evidence } = closureLab()
assert.ok(existsSync(join(root, 'c1-prepared.json')), 'Run the actual C1 phase before A2 plan acceptance')
assert.ok(!existsSync(join(root, 'a2-plan-prepared.json')), 'Prepare A2 plans once per disposable stack')
assertAuthSources(JSON.parse(readFileSync(join(root, 'auth-prepared.json'), 'utf8')), app, repo)
const paths = [
  'app/despega/a2/coach/page.tsx', 'components/a2-chat-coach.tsx', 'components/a2-reviewed-plan.tsx',
  'app/api/a2/plan/route.ts', 'app/api/despega/a2-coach/route.ts',
  'lib/a2/assistant-contract.ts', 'lib/a2/swarm/contracts.ts', 'lib/a2/swarm/runtime.ts',
  'lib/a2/swarm/openai.ts', 'lib/a2/swarm/canary.ts',
  ...readdirSync(join(repo, 'lib/a2')).filter(name => /^plan.*\.ts$/.test(name)).map(name => `lib/a2/${name}`),
]
assert.ok(paths.includes('lib/a2/plan-contract.ts'), 'The shared plan contract must be present')
const copied = []
for (const path of paths) {
  const source = join(repo, path), target = join(app, path)
  assert.ok(existsSync(source), `Missing real application source: ${path}`)
  mkdirSync(dirname(target), { recursive: true })
  cpSync(source, target)
  assert.deepEqual(readFileSync(source), readFileSync(target))
  copied.push({ path, sha256: createHash('sha256').update(readFileSync(target)).digest('hex') })
}
const manifest = {
  commit: process.env.A1_SOURCE_COMMIT, environment: 'disposable-local-a2-plan', copied,
  genuine: ['actual A2 coach page, plan card, session boundary, API and server context readers',
    'real local email Auth, cookies, owner RLS, private command receipts and PostgreSQL RPC',
    'canonical journey access, objective revision and practice-adjustment readers',
    'atomic CAS/history/receipt writes, deletion tombstone and preserved canonical progress'],
  fixtures: ['two new synthetic local owners with explicitly seeded A2 eligibility and one admitted owner without A2 eligibility',
    'minimal dtc_documents source table; no preexisting adjustment or plan content',
    'synthetic C1/C2/A1 evidence is setup data, not an assessment of a real participant'],
  substitutions: ['root document/font shell inherited from the existing browser laboratory',
    'temporary database faults and intentionally dropped HTTP delivery test recovery only'],
  notVerified: ['model quality, model calls or generated plan quality', 'remote deployment or migration application',
    'atomic freshness across independent context source writes', 'a real participant completing A2 or the manual UAT cases'],
  privacy: 'Only synthetic screenshots and sanitized verdicts; no keys, passwords, cookies, HAR, browser storage or private server logs.',
}
writeFileSync(join(root, 'a2-plan-prepared.json'), JSON.stringify(manifest, null, 2))
writeFileSync(join(evidence, 'a2-plan-scope.json'), JSON.stringify(manifest, null, 2))
console.log('A2 plan phase prepared: unchanged actual UI/API, canonical context readers and local persistence.')
