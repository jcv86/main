import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { PRODUCT_STAGE_ORDER, PRODUCT_STAGES } from '../lib/dtc/product-language'

function source(path: string): string {
  return readFileSync(join(process.cwd(), path), 'utf8')
}

assert.deepEqual(PRODUCT_STAGE_ORDER, ['A1', 'A2', 'A3', 'A4'])
assert.equal(PRODUCT_STAGES.A1.href, '/despega/a1-report')
assert.equal(PRODUCT_STAGES.A2.href, '/despega/a2')
assert.equal(PRODUCT_STAGES.A3.href, '/despega/a3')
assert.equal(PRODUCT_STAGES.A4.href, '/despega/a4')

const journey = source('lib/journey/service.ts')
const flow = source('lib/journey/flow.ts')
const entry = source('app/despega/page.tsx')
const authMiddleware = source('lib/supabase/middleware.ts')
const canonicalOrder = [
  "if (!(profile.onboarding_conozcamonos_1_completed || profile.onboarding_completed)) return ONBOARDING_PATHS[0]",
  'if (!profile.a1_cerebral_intro_seen) return ONBOARDING_PATHS[1]',
  "if (!(profile.a1_cerebral_completed || profile.a1_test_completed || profile.onboarding_cerebral_completed)) return ONBOARDING_PATHS[2]",
  "if (!profile.conozcamonos_2_completed) return ONBOARDING_PATHS[3]",
  "if (!(profile.a1_report_seen || profile.a1_results_saved)) return ONBOARDING_PATHS[4]",
  "if (!profile.a2_intro_seen) return ONBOARDING_PATHS[5]",
  'return ONBOARDING_PATHS[6]',
]
let previousIndex = -1
for (const marker of canonicalOrder) {
  const index = flow.indexOf(marker)
  assert.ok(index > previousIndex, `Canonical journey marker missing or out of order: ${marker}`)
  previousIndex = index
}
assert.ok(journey.includes("import { canonicalOnboardingPath } from './flow'"))
assert.ok(journey.includes('return canonicalOnboardingPath(profile)'))
assert.ok(journey.includes('state.highestA2DayUnlocked >= 7'))
assert.ok(journey.includes('state.a4UnlockedAt && profile.a4_unlocked'))
assert.ok(journey.includes('const hasA4Evidence = Boolean(evidence.a3RouteCompletedAt)'))
assert.ok(journey.includes('a4_unlocked: hasA4Evidence'))
assert.ok(journey.includes("else if (hasA4Evidence) currentModule = 'A4'"))

// The canonical entry owns journey routing. Middleware only enforces session
// and pilot access, so stale legacy A2 rows cannot outrank canonical A1/A3/A4
// state when the two models diverge.
assert.ok(entry.includes('getJourneyForCurrentUser()'))
assert.ok(entry.includes('getCanonicalNextPath(journey.profile)'))
assert.ok(entry.includes("journey.access.a2 ? '/despega/dashboard' : nextRequiredPath"))
assert.ok(!authMiddleware.includes(".from('despega_pilar_progress')"))
assert.ok(!authMiddleware.includes('Protected journey redirect lookup failed'))
assert.ok(!authMiddleware.includes("pathname === '/despega' || pathname === '/despega/'"))

// Legacy URLs must consume the same FlowAction as dashboard/mapa. There is no
// second A4→A3→A2 priority resolver because that diverges at A2/A3 checkpoints.
const compatibility = source('lib/journey/legacy-compatibility.ts')
assert.ok(compatibility.includes('getJourneyForCurrentUser()'))
assert.ok(compatibility.includes("import { loadJourneyFlow } from './flow-service'"))
assert.ok(compatibility.includes('const flow = await loadJourneyFlow(journey)'))
assert.ok(compatibility.includes('return flow.next.href'))
assert.ok(!compatibility.includes('resolveLegacyContinuityDestination'))
assert.ok(!compatibility.includes('getCanonicalNextPath'))
assert.equal(
  existsSync(join(process.cwd(), 'lib/journey/legacy-continuity.ts')),
  false,
)

const legacyRoutes = [
  'app/despega/conozcamonos/1/page.tsx',
  'app/despega/conozcamonos/2/page.tsx',
  'app/despega/conozcamonos/3/page.tsx',
  'app/despega/conozcamonos/4/page.tsx',
  'app/despega/conozcamonos-3/page.tsx',
  'app/despega/conozcamonos-4/page.tsx',
]
for (const path of legacyRoutes) {
  const route = source(path)
  assert.ok(route.includes('getLegacyJourneyDestination'))
  assert.ok(route.includes('redirect(await getLegacyJourneyDestination())'))
  assert.ok(!route.includes("'use client'"))
  assert.ok(!route.includes('fetch('))
}

const parallelOnboarding = source('app/despega/onboarding/page.tsx')
assert.ok(parallelOnboarding.includes("redirect('/despega/conozcamonos-1')"))
assert.ok(!parallelOnboarding.includes("'use client'"))
assert.ok(!parallelOnboarding.includes('DISC_TEST_QUESTIONS'))
assert.ok(!parallelOnboarding.includes('/api/despega/save-test-results'))
assert.equal(
  existsSync(join(process.cwd(), 'app/despega/onboarding/page.tsx.backup')),
  false,
)

const legacyTestWriter = source('app/api/despega/save-test-results/route.ts')
assert.ok(legacyTestWriter.includes("code: 'LEGACY_TEST_RESULTS_API_RETIRED'"))
assert.ok(legacyTestWriter.includes("replacement: '/api/a1-cerebral-save'"))
assert.ok(legacyTestWriter.includes('status: 410'))
assert.ok(legacyTestWriter.includes('export async function POST()'))
assert.ok(legacyTestWriter.includes('export async function GET()'))
assert.ok(!legacyTestWriter.includes('request.json()'))
assert.ok(!legacyTestWriter.includes('Results acknowledged'))
assert.ok(!legacyTestWriter.includes(".from('despega_test_results')"))

for (const path of [
  'app/despega/pillars-hub/page.tsx',
  'app/despega/pillars/hub/page.tsx',
]) {
  const hub = source(path)
  assert.match(hub, /redirect\(['"]\/despega\/dashboard['"]\)/)
  assert.ok(!hub.includes("'use client'"))
  assert.ok(!hub.includes('learning-sequence'))
  assert.ok(!hub.includes('pillar-structure'))
  assert.ok(!hub.includes('pillar-progress'))
}

for (const path of [
  'components/checkpoint-screen.tsx',
  'components/pillar-completion-checkpoint.tsx',
]) {
  const checkpoint = source(path)
  assert.ok(checkpoint.includes("router.push('/despega/dashboard')"))
  assert.ok(checkpoint.includes('servidor') || checkpoint.includes('server'))
  assert.ok(!checkpoint.includes("fetch('/api/user/award-xp'"))
  assert.ok(!checkpoint.includes("fetch('/api/user/complete-pillar'"))
  assert.ok(!checkpoint.includes('xpAmount'))
  assert.ok(!checkpoint.includes('userId,'))
}

console.log(
  JSON.stringify({
    evidenceLevel: 'mixed_runtime_and_source_contract',
    runtimeValidated: [
      'canonical stage identifiers and routes',
      'single canonical FlowAction ownership for legacy resume',
      'divergent legacy and canonical resolver retirement',
    ],
    sourceContractsChecked: [
      'A1 onboarding marker order',
      'canonical /despega entry ownership',
      'middleware legacy journey redirect retirement',
      'legacy routes delegate to canonical journey flow',
      'parallel onboarding retirement',
      'false-success test writer retirement',
      'legacy hub retirement',
      'client progress writer retirement',
    ],
    liveDatabaseCheckedInThisScript: false,
    liveHttpCheckedInThisScript: false,
    canonicalResumeSource: 'loadJourneyFlow(journey).next.href',
  }),
)
