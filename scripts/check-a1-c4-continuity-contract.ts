import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { PRODUCT_STAGE_ORDER, PRODUCT_STAGES } from '../lib/dtc/product-language'
import { resolveLegacyContinuityDestination } from '../lib/journey/legacy-continuity'

function source(path: string): string {
  return readFileSync(join(process.cwd(), path), 'utf8')
}

const baseInput = {
  authenticated: true,
  access: { a2: false, a3: false, a4: false },
  highestA2DayUnlocked: 1,
  canonicalNextPath: '/despega/conozcamonos-1',
}

assert.equal(
  resolveLegacyContinuityDestination({ ...baseInput, authenticated: false }),
  '/auth/signin',
)
assert.equal(resolveLegacyContinuityDestination(baseInput), '/despega/conozcamonos-1')
assert.equal(
  resolveLegacyContinuityDestination({
    ...baseInput,
    canonicalNextPath: '/despega/a1-cerebral-intro',
  }),
  '/despega/a1-cerebral-intro',
)
assert.equal(
  resolveLegacyContinuityDestination({
    ...baseInput,
    canonicalNextPath: '/despega/a1/resultado',
  }),
  '/despega/a1/resultado',
)
assert.equal(
  resolveLegacyContinuityDestination({
    ...baseInput,
    access: { a2: true, a3: false, a4: false },
    highestA2DayUnlocked: 17,
  }),
  '/despega/a2/dia-17',
)
assert.equal(
  resolveLegacyContinuityDestination({
    ...baseInput,
    access: { a2: true, a3: false, a4: false },
    highestA2DayUnlocked: 999,
  }),
  '/despega/a2/dia-1',
)
assert.equal(
  resolveLegacyContinuityDestination({
    ...baseInput,
    access: { a2: true, a3: true, a4: false },
  }),
  '/despega/a3',
)
assert.equal(
  resolveLegacyContinuityDestination({
    ...baseInput,
    access: { a2: true, a3: true, a4: true },
  }),
  '/despega/a4',
)

assert.deepEqual(PRODUCT_STAGE_ORDER, ['A1', 'A2', 'A3', 'A4'])
assert.equal(PRODUCT_STAGES.A1.href, '/despega/a1-report')
assert.equal(PRODUCT_STAGES.A2.href, '/despega/a2')
assert.equal(PRODUCT_STAGES.A3.href, '/despega/a3')
assert.equal(PRODUCT_STAGES.A4.href, '/despega/a4')

const journey = source('lib/journey/service.ts')
const canonicalOrder = [
  "if (!hasCompletedC1(profile)) return MODULE_ENTRY.A1",
  "if (!profile.a1_cerebral_intro_seen) return '/despega/a1-cerebral-intro'",
  "return '/despega/a1-cerebral'",
  "if (!hasSeenA1Report(profile)) return '/despega/a1/resultado'",
  "if (!profile.a2_intro_seen) return '/despega/a2/intro'",
  "if (!hasCompletedC2(profile)) return '/despega/conozcamonos-2'",
  'return MODULE_ENTRY.A2',
]
let previousIndex = -1
for (const marker of canonicalOrder) {
  const index = journey.indexOf(marker)
  assert.ok(index > previousIndex, `Canonical journey marker missing or out of order: ${marker}`)
  previousIndex = index
}
assert.ok(journey.includes('state.highestA2DayUnlocked >= 7'))
assert.ok(journey.includes('state.a4UnlockedAt && profile.a4_unlocked'))
assert.ok(journey.includes('const hasA4Evidence = Boolean(evidence.a3RouteCompletedAt)'))
assert.ok(journey.includes('a4_unlocked: hasA4Evidence'))
assert.ok(journey.includes("else if (hasA4Evidence) currentModule = 'A4'"))

const compatibility = source('lib/journey/legacy-compatibility.ts')
assert.ok(compatibility.includes('getJourneyForCurrentUser()'))
assert.ok(compatibility.includes('getCanonicalNextPath(journey.profile)'))
assert.ok(compatibility.includes('resolveLegacyContinuityDestination'))

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
      'legacy destination resolver states',
      'canonical stage identifiers and routes',
    ],
    sourceContractsChecked: [
      'A1 onboarding marker order',
      'legacy route redirects',
      'parallel onboarding retirement',
      'false-success test writer retirement',
      'legacy hub retirement',
      'client progress writer retirement',
    ],
    liveDatabaseCheckedInThisScript: false,
    liveHttpCheckedInThisScript: false,
    finalCanonicalDestination: '/despega/a4',
  }),
)
