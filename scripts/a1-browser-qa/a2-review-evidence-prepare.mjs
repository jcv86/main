import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { closureLab } from './closure-lab.mjs'
import { assertAuthSources } from './auth-lab.mjs'

const { root, app, repo, evidence } = closureLab()
assert.ok(!existsSync(join(root, 'a2-review-evidence-prepared.json')), 'Prepare AG05 once per disposable stack')
for (const prior of ['a2-plan', 'a2-action']) {
  assert.equal(JSON.parse(readFileSync(join(evidence, `${prior}-browser-results.json`), 'utf8')).verdict, 'PASS',
    'Complete the unchanged AG03 and AG04 real Auth, SQL and browser phases before AG05')
}
assertAuthSources(JSON.parse(readFileSync(join(root, 'auth-prepared.json'), 'utf8')), app, repo)
const paths = [
  'app/despega/a2/coach/page.tsx', 'components/a2-chat-coach.tsx', 'components/a2-reviewed-plan.tsx',
  'components/a2-plan-evidence-review.tsx', 'components/a2-assistant-action.tsx', 'components/layout/app-shell.tsx',
  'app/api/a2/plan/route.ts', 'app/api/despega/a2-coach/route.ts', 'app/api/outcomes/observations/route.ts',
  'app/api/a2/assistant-actions/route.ts',
  'app/api/a4/decisions/route.ts', 'app/api/a4/signals/route.ts',
  'lib/a2/review-evidence-contract.ts', 'lib/a2/review-evidence-service.ts',
  'lib/a2/plan-contract.ts', 'lib/a2/plan-context.ts', 'lib/a2/plan-api.ts', 'lib/a2/plan-service.ts',
  'lib/a2/assistant-contract.ts', 'lib/a2/api-access.ts',
  'lib/a2/assistant-action-contract.ts', 'lib/a2/assistant-action-api.ts', 'lib/a2/assistant-action-service.ts',
  'lib/a2/swarm/contracts.ts', 'lib/a2/swarm/runtime.ts', 'lib/a2/swarm/openai.ts', 'lib/a2/swarm/canary.ts',
  'lib/journey/service.ts', 'lib/journey/flow.ts', 'lib/journey/flow-service.ts',
  'lib/journey/next-action.ts', 'lib/journey/next-action-service.ts',
  'lib/outcomes/response-capture.ts', 'lib/outcomes/response-history.ts',
  'lib/outcomes/a2-execution-capability.ts', 'lib/outcomes/a3-interview-capability.ts',
  'lib/a3/module-catalog.ts', 'lib/a4/strategic-radar.ts', 'lib/a4/access-control.ts',
  'lib/a4/source-integrity.ts', 'lib/a4/qa-entitlement.ts',
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
  commit: process.env.A1_SOURCE_COMMIT, environment: 'disposable-local-a2-review-evidence', copied,
  genuine: ['actual reviewed plan and evidence-review UI, session boundary, plan API and bounded evidence reader',
    'real local email Auth, cookies, owner SELECT RLS, PostgreSQL plan CAS, history and immutable receipts',
    'actual existing A3 capture and A4 signal/decision migrations, with current server-owned write hardening',
    'source changes alter the context fingerprint; explicit review stores the new snapshot and survives reload',
    'complete snapshots of seven canonical progress tables; previous laboratory owners preserved'],
  fixtures: ['four fresh synthetic local owners: desktop, mobile, personal path and A3/A4-locked',
    'three owners have synthetic full 90-day A2 history and all ten A3 modules plus route closure for real access gating',
    'the personal-path owner retains historical professional records solely to verify non-applicability and query skipping',
    'the locked owner has A2 entry prerequisites but no A3/A4 access, despite decoy source records',
    'dated A3 v2 captures, numeric v1 decoys and A4 decisions are synthetic declared source fixtures, never participant outcomes',
    'minimal older supporting tables and document source inherited explicitly from the prior laboratory'],
  substitutions: ['root document/font shell inherited from the preceding laboratory',
    'declared local source changes and SELECT revocation faults exercise freshness and unavailable states',
    'no provider call in this browser phase; shared baseline/swarm model-context behavior uses the separate declared synthetic-transport regression suite'],
  notVerified: ['participant usefulness, career improvement, measured capability or causal benefit',
    'real model generation quality, provider latency/cost or live canary traffic',
    'independent verification of reported A4 outcomes or linked opportunity/source contents',
    'global transactional freshness across independently updated evidence sources',
    'remote migrations, production deployment or external OAuth',
    'physical mobile, touch or Safari; mobile means Chromium viewport 390 by 844',
    'the 54 manual UAT cases or replacement of the prior business GO'],
  privacy: 'Only synthetic screenshots and sanitized verdicts; no keys, passwords, cookies, HAR, storageState or private server logs.',
}
writeFileSync(join(root, 'a2-review-evidence-prepared.json'), JSON.stringify(manifest, null, 2))
writeFileSync(join(evidence, 'a2-review-evidence-scope.json'), JSON.stringify(manifest, null, 2))
console.log('AG05 prepared: actual review UI, source RLS and plan persistence; source fixtures are explicitly synthetic.')
