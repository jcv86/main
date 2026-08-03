import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  A3_MODULES,
  A3_MODULE_IDS,
  A3_TOTAL_XP,
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
const progressRoute = source('app/api/a3/user-progress/route.ts')

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
assert.ok(overview.includes('no se almacena audio'))
assert.ok(overview.includes('sm:flex-row'))
assert.ok(overview.includes('lg:grid-cols-2'))

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
  }),
)
