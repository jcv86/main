import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

type EvidenceLevel = 'runtime_only' | 'mixed_runtime_and_source' | 'source_only'

const DOMAIN_TESTS: Record<string, EvidenceLevel> = {
  'scripts/check-a2-day1-scoring.ts': 'runtime_only',
  'scripts/check-a2-specialized-days-contract.ts': 'mixed_runtime_and_source',
  'scripts/check-a2-cycle-contract.ts': 'mixed_runtime_and_source',
  'scripts/check-a2-horizon-contract.ts': 'mixed_runtime_and_source',
  'scripts/check-a2-cycle-review-contract.ts': 'mixed_runtime_and_source',
  'scripts/check-a2-route-adaptation-contract.ts': 'mixed_runtime_and_source',
  'scripts/check-a2-activity-contract.ts': 'mixed_runtime_and_source',
  'scripts/check-a1-a2-a3-journey-contract.ts': 'source_only',
  'scripts/check-a3-active-completion-contract.ts': 'mixed_runtime_and_source',
  'scripts/check-a3-job-decoder-contract.ts': 'mixed_runtime_and_source',
  'scripts/check-a3-answer-architecture-contract.ts': 'mixed_runtime_and_source',
  'scripts/check-a3-coach-practice-contract.ts': 'mixed_runtime_and_source',
  'scripts/check-a3-communication-gym-contract.ts': 'mixed_runtime_and_source',
  'scripts/check-a3-first-recruiter-simulation-contract.ts': 'mixed_runtime_and_source',
  'scripts/check-a3-difficult-questions-contract.ts': 'mixed_runtime_and_source',
  'scripts/check-a3-basic-interview-mission-contract.ts': 'mixed_runtime_and_source',
  'scripts/check-a3-route-overview-contract.ts': 'mixed_runtime_and_source',
  'scripts/check-a3-legacy-simulation-retirement-contract.ts': 'source_only',
  'scripts/check-a3-interview-response-atomicity-contract.ts': 'source_only',
  'scripts/check-a3-reward-endpoint-retirement-contract.ts': 'source_only',
  'scripts/check-unverified-training-reward-retirement-contract.ts': 'source_only',
  'scripts/check-a3-a4-transition-contract.ts': 'source_only',
  'scripts/check-a4-signal-decision-contract.ts': 'mixed_runtime_and_source',
  'scripts/check-a4-evidence-pulse-contract.ts': 'mixed_runtime_and_source',
  'scripts/check-a4-daily-snapshot-contract.ts': 'mixed_runtime_and_source',
  'scripts/check-a4-daily-cron-contract.ts': 'mixed_runtime_and_source',
  'scripts/check-a4-job-matching-contract.ts': 'source_only',
  'scripts/check-a4-public-job-seed-retirement-contract.ts': 'source_only',
  'scripts/check-a1-c4-continuity-contract.ts': 'mixed_runtime_and_source',
  'scripts/check-dtc-critical-contract.ts': 'mixed_runtime_and_source',
  'scripts/check-gamification-integrity-contract.ts': 'source_only',
  'scripts/check-admin-surface-retirement-contract.ts': 'source_only',
  'scripts/check-demo-auth-retirement-contract.ts': 'source_only',
}

const root = process.cwd()
const workflow = readFileSync(
  join(root, '.github/workflows/typecheck.yml'),
  'utf8',
)
const workflowTests = [
  ...workflow.matchAll(/npx tsx (scripts\/check-[^\s]+\.ts)/g),
]
  .map((match) => match[1])
  .filter(
    (path) =>
      path !== 'scripts/check-test-evidence-matrix.ts' &&
      path !== 'scripts/check-build-warning-contract.ts',
  )

assert.equal(
  new Set(workflowTests).size,
  workflowTests.length,
  'Each domain test must appear only once in the workflow.',
)
assert.deepEqual(
  [...workflowTests].sort(),
  Object.keys(DOMAIN_TESTS).sort(),
  'The evidence manifest and the CI workflow must cover the same domain tests.',
)

const counts: Record<EvidenceLevel, number> = {
  runtime_only: 0,
  mixed_runtime_and_source: 0,
  source_only: 0,
}

for (const [path, level] of Object.entries(DOMAIN_TESTS)) {
  const content = readFileSync(join(root, path), 'utf8')
  const readsSource = content.includes('readFileSync')
  const importsRuntimeLibrary = /from ['"]\.\.\/lib\//.test(content)
  const hasAssertions = content.includes('assert.')

  assert.ok(hasAssertions, `${path} must contain executable assertions.`)
  assert.ok(
    !path.toLowerCase().includes('end-to-end'),
    `${path} must not claim end-to-end coverage without live HTTP execution.`,
  )

  if (level === 'runtime_only') {
    assert.equal(readsSource, false, `${path} is not runtime-only.`)
    assert.equal(importsRuntimeLibrary, true, `${path} must execute product logic.`)
  } else if (level === 'mixed_runtime_and_source') {
    assert.equal(readsSource, true, `${path} must inspect source contracts.`)
    assert.equal(importsRuntimeLibrary, true, `${path} must also execute product logic.`)
  } else {
    assert.equal(readsSource, true, `${path} must inspect source contracts.`)
    assert.equal(importsRuntimeLibrary, false, `${path} is not source-only.`)
  }

  counts[level] += 1
}

assert.equal(Object.keys(DOMAIN_TESTS).length, 33)
assert.deepEqual(counts, {
  runtime_only: 1,
  mixed_runtime_and_source: 21,
  source_only: 11,
})

console.log(
  JSON.stringify({
    domainTests: Object.keys(DOMAIN_TESTS).length,
    evidenceLevels: counts,
    liveHttpTestsInCi: 0,
    liveDatabaseTestsInCi: 0,
    browserEndToEndTestsInCi: 0,
    interpretation:
      'Green means runtime fixtures and/or source contracts passed; it does not mean live HTTP or live database integration was executed.',
  }),
)
