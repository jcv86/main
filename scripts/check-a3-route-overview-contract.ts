import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  A3_MODULES,
  A3_MODULE_IDS,
  A3_TOTAL_XP,
  type A3ModuleId,
} from '../lib/a3/module-catalog'
import { A3_ROUTE_OVERVIEW } from '../lib/a3/route-overview'

function source(path: string): string {
  return readFileSync(join(process.cwd(), path), 'utf8')
}

assert.equal(A3_MODULES.length, 10)
assert.equal(A3_TOTAL_XP, 1340)
assert.deepEqual(
  Object.keys(A3_ROUTE_OVERVIEW).sort(),
  [...A3_MODULE_IDS].sort(),
)

for (const module of A3_MODULES) {
  const overview = A3_ROUTE_OVERVIEW[module.id]
  assert.ok(overview.outcome.length >= 40, `${module.id}: outcome`)
  assert.ok(overview.evidence.length >= 30, `${module.id}: evidence`)
  assert.ok(overview.practiceMode.length >= 20, `${module.id}: practice`)
  assert.equal(overview.requirements.length, 3, `${module.id}: requirements`)
  assert.ok(overview.requirements.every((item) => item.length >= 20))
}

const page = source('app/despega/a3/page.tsx')
const overview = source('components/a3/a3-route-overview.tsx')
const overviewCopy = source('lib/a3/route-overview.ts')
const progressRoute = source('app/api/a3/user-progress/route.ts')
const accessGate = source('components/a3-module-access-gate.tsx')
const accessRoute = source('app/api/a3/access-check/route.ts')

assert.ok(page.includes("import { A3RouteOverview }"))
assert.ok(page.includes('return <A3RouteOverview />'))
assert.ok(!page.includes('BASIC_LEVEL_MODULES'))
assert.ok(!page.includes('selectedPath'))

assert.ok(overview.includes("fetch('/api/a3/user-progress'"))
assert.ok(overview.includes('A3_MODULES.map'))
assert.ok(overview.includes('A3_ROUTE_OVERVIEW[module.id]'))
assert.ok(overview.includes('progress.accessStates'))
assert.ok(overview.includes('access?.status'))
assert.ok(overview.includes('access.currentDayMet'))
assert.ok(overview.includes('access.prerequisitesCompleted'))
assert.ok(overview.includes('progress.route.routeCompletedAt'))
assert.ok(overview.includes('progress.route.proUnlockedAt'))
assert.ok(overview.includes('progress.moduleResults[module.id]'))
assert.ok(overview.includes('Las repeticiones no vuelven a entregar XP'))
assert.ok(overview.includes('sm:flex-row'))
assert.ok(overview.includes('lg:grid-cols-2'))
assert.ok(overviewCopy.includes('no se almacena audio'))
assert.ok(overviewCopy.includes('no se almacena audio ni video'))

assert.ok(!overview.includes("index === 0"))
assert.ok(!overview.includes("prevStatus === 'completed'"))
assert.ok(!overview.includes('Advanced level coming soon'))
assert.ok(!overview.includes('Sofia V2'))
assert.ok(!overview.includes('1,700+'))
assert.ok(!overview.includes('Module Summary'))
assert.ok(!overview.includes('Complete modules in order'))
assert.ok(!overview.includes('virtual recruiter'))
assert.ok(!overview.includes('grabación de voz'))
assert.ok(!overview.includes('TODO: Navigate'))

assert.ok(progressRoute.includes(".from('a3_route_progression')"))
assert.ok(progressRoute.includes(".from('a3_module_completion')"))
assert.ok(progressRoute.includes('accessStates'))
assert.ok(progressRoute.includes('moduleResults'))
assert.ok(progressRoute.includes('nextAvailableModuleId'))
assert.ok(progressRoute.includes('routeCompletedAt'))
assert.ok(progressRoute.includes('proUnlockedAt'))
assert.ok(progressRoute.includes('canReplayModules7To10'))
assert.ok(progressRoute.includes('a2CurrentDay'))

assert.ok(accessRoute.includes("searchParams.get('moduleId')"))
assert.ok(accessGate.includes('/api/a3/access-check?moduleId='))
assert.ok(accessGate.includes('encodeURIComponent(moduleId)'))
assert.ok(accessGate.includes('payload.details?.currentDay'))
assert.ok(accessGate.includes('payload.details?.checkpointDay'))
assert.ok(accessGate.includes('payload.details?.day1Status'))
assert.ok(accessGate.includes("cache: 'no-store'"))
assert.ok(accessGate.includes('return <>{children}</>'))
assert.ok(!accessGate.includes("fetch('/api/a3/access-check'"))
assert.ok(!accessGate.includes('getA2MissionByDay'))

const guardedPages: Array<[A3ModuleId, string]> = [
  ['career-mirror', 'app/despega/a3/career-mirror-coach/page.tsx'],
  ['value-mining-lab', 'app/despega/a3/value-mining-lab-coach/page.tsx'],
  ['cv-builder-studio', 'app/despega/a3/cv-builder-studio/page.tsx'],
  ['job-decoder', 'app/despega/a3/job-decoder/page.tsx'],
  ['answer-architecture', 'app/despega/a3/answer-architecture/page.tsx'],
  ['coach-practice-room', 'app/despega/a3/coach-practice-room/page.tsx'],
  ['communication-gym', 'app/despega/a3/communication-gym/page.tsx'],
  ['first-recruiter-simulation', 'app/despega/a3/first-recruiter-simulation/page.tsx'],
  ['risk-difficult-questions-lab', 'app/despega/a3/risk-difficult-questions-lab/page.tsx'],
  ['basic-interview-mission', 'app/despega/a3/basic-interview-mission/page.tsx'],
]

for (const [moduleId, path] of guardedPages) {
  const guardedPage = source(path)
  assert.ok(guardedPage.includes('A3ModuleAccessGate'), `${moduleId}: gate import`)
  assert.ok(guardedPage.includes(`moduleId="${moduleId}"`), `${moduleId}: gate identity`)
}

const canonicalCoachRoute = "redirect('/despega/a3/value-mining-lab-coach')"
for (const path of [
  'app/despega/a3/value-mining-lab/page.tsx',
  'app/despega/a3/value-mining-lab-choice/page.tsx',
  'app/despega/a3/value-mining-lab-text/page.tsx',
]) {
  const legacyPage = source(path)
  assert.ok(legacyPage.includes(canonicalCoachRoute), `${path}: canonical redirect`)
  assert.ok(!legacyPage.includes('/api/a3/save-module-progress'), `${path}: legacy writer`)
  assert.ok(!legacyPage.includes('bonificación de coach'), `${path}: fake bonus`)
  assert.ok(!legacyPage.includes('Activación de cámara'), `${path}: fake camera`)
}

console.log(
  JSON.stringify({
    modules: A3_MODULES.length,
    totalXp: A3_TOTAL_XP,
    canonicalCatalog: true,
    serverAccessStateTrusted: true,
    checkpointReasonsVisible: true,
    persistedScoresVisible: true,
    routeClosureVisible: true,
    fakeAdvancedCtaRemoved: true,
    honestMediaLanguage: true,
    mobileResponsiveOverview: true,
    directModuleAccessGuarded: guardedPages.length,
    legacyValueMiningRoutesRetired: true,
  }),
)
