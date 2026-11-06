import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { closureLab } from './closure-lab.mjs'
import { assertAuthSources } from './auth-lab.mjs'

const { root, app, repo, evidence } = closureLab()
assert.ok(!existsSync(join(root, 'a2-action-prepared.json')), 'Prepare AG04 once per disposable stack')
assert.equal(JSON.parse(readFileSync(join(evidence, 'a2-plan-browser-results.json'), 'utf8')).verdict, 'PASS',
  'Complete the existing AG03 real Auth, SQL and browser phase before AG04')
assertAuthSources(JSON.parse(readFileSync(join(root, 'auth-prepared.json'), 'utf8')), app, repo)
const paths = [
  'app/despega/a2/coach/page.tsx', 'components/a2-chat-coach.tsx', 'components/a2-assistant-action.tsx', 'components/layout/app-shell.tsx',
  'components/a2-reviewed-plan.tsx', 'app/api/a2/assistant-actions/route.ts', 'app/api/despega/a2-coach/route.ts',
  'lib/a2/assistant-action-contract.ts', 'lib/a2/assistant-action-api.ts', 'lib/a2/assistant-action-service.ts',
  'lib/a2/assistant-contract.ts', 'lib/a2/practice-adjustment.ts', 'lib/a2/api-access.ts',
  'lib/a2/plan-contract.ts', 'lib/a2/plan-context.ts', 'lib/a2/plan-service.ts',
  'lib/journey/next-action.ts', 'lib/journey/next-action-service.ts', 'lib/journey/service.ts',
  'lib/a2/swarm/contracts.ts', 'lib/a2/swarm/runtime.ts', 'lib/a2/swarm/openai.ts', 'lib/a2/swarm/canary.ts',
]
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
  commit: process.env.A1_SOURCE_COMMIT, environment: 'disposable-local-a2-action', copied,
  genuine: ['actual coach and action-review UI with unchanged application source',
    'local email Auth, cookies, action API, owner document RLS and PostgreSQL RPC',
    'typed command, atomic document/receipt commit, readback, exact replay and anti-resurrection',
    'canonical pending day/context selection and seven canonical progress table snapshots'],
  fixtures: ['four fresh synthetic local owners: desktop, mobile, A2-locked and later pilot-revoked',
    'minimal dtc_documents table inherited explicitly from AG03; its production creation migration is absent',
    'synthetic C1/C2/A1 and admission prerequisites; no participant assessment or practice completion'],
  substitutions: ['only the assistant generation HTTP response is a declared synthetic reviewed proposal',
    'that proposal uses the action API current day/hash/guidance; no successful action API response is fabricated',
    'root document/font shell inherited from the preceding laboratory',
    'declared local source edits, deleted document and delayed/lost HTTP delivery for recovery scenarios',
    'after genuine login, the A2-locked fixture journey row is deleted locally; direct action requests must not recreate it or alter its seven canonical tables'],
  notVerified: ['real provider output, utility, latency, cost or real canary traffic',
    'remote migration, deployment, production document schema or external OAuth',
    'global transactional freshness across independent context writes',
    'physical mobile, touch or Safari; mobile means Chromium viewport 390 by 844',
    'manual UAT participant cases or effectiveness of the practice'],
  privacy: 'Only synthetic screenshots and sanitized verdicts; no credentials, cookies, HAR, storageState or private server logs.',
}
writeFileSync(join(root, 'a2-action-prepared.json'), JSON.stringify(manifest, null, 2))
writeFileSync(join(evidence, 'a2-action-scope.json'), JSON.stringify(manifest, null, 2))
console.log('AG04 prepared: actual action UI/API and persistence; only the reviewed model proposal is synthetic.')
