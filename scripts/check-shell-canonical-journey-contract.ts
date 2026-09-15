import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { buildJourneyFlow, type FlowInput } from '../lib/journey/flow'

function source(path: string): string {
  return readFileSync(join(process.cwd(), path), 'utf8')
}

const profile = {
  onboarding_conozcamonos_1_completed: true,
  a1_cerebral_intro_seen: true,
  a1_cerebral_completed: true,
  conozcamonos_2_completed: true,
  a1_report_seen: true,
  a2_intro_seen: true,
}

function flow(overrides: Partial<FlowInput>) {
  return buildJourneyFlow({
    profile,
    access: { a1: true, a2: true, a3: false, a4: false },
    currentModule: 'A2',
    highestA2DayUnlocked: 1,
    completedA2Days: [],
    completedA3Modules: [],
    a3RouteClosed: false,
    ...overrides,
  })
}

const day7 = flow({
  access: { a1: true, a2: true, a3: true, a4: false },
  highestA2DayUnlocked: 7,
  completedA2Days: [1, 2, 3, 4, 5, 6],
})
assert.equal(day7.cards.find((card) => card.id === 'A1')?.state, 'completed')
assert.equal(day7.cards.find((card) => card.id === 'A2')?.state, 'available')
assert.equal(day7.cards.find((card) => card.id === 'A3')?.state, 'active')
assert.equal(day7.cards.find((card) => card.id === 'A4')?.state, 'locked')

const day30 = flow({
  access: { a1: true, a2: true, a3: true, a4: false },
  highestA2DayUnlocked: 30,
  completedA2Days: Array.from({ length: 30 }, (_, index) => index + 1),
  completedA3Modules: ['career-mirror'],
})
assert.equal(day30.cards.find((card) => card.id === 'A2')?.state, 'available')
assert.equal(day30.cards.find((card) => card.id === 'A3')?.state, 'active')
assert.equal(day30.cards.find((card) => card.id === 'A4')?.state, 'locked')

const a3Closed = flow({
  access: { a1: true, a2: true, a3: true, a4: true },
  currentModule: 'A4',
  highestA2DayUnlocked: 30,
  completedA2Days: Array.from({ length: 30 }, (_, index) => index + 1),
  completedA3Modules: ['career-mirror'],
  a3RouteClosed: true,
})
assert.equal(a3Closed.cards.find((card) => card.id === 'A3')?.state, 'completed')
assert.equal(a3Closed.cards.find((card) => card.id === 'A4')?.state, 'active')

const shell = source('components/layout/app-shell.tsx')
const layout = source('app/despega/layout.tsx')
const service = source('lib/journey/service.ts')
const flowService = source('lib/journey/flow-service.ts')
const gamificationRoute = source('app/api/gamification/global/route.ts')
const gamificationSummary = source('lib/gamification/server-summary.ts')

assert.ok(shell.includes('flow.cards.find'))
assert.ok(!shell.includes('currentJourneyIndex'))
assert.ok(shell.includes('aria-disabled="true"'))
assert.ok(shell.includes("state === 'active' ? 'En curso'"))
assert.ok(layout.includes('const flow = await loadJourneyFlow(journey)'))
assert.ok(layout.includes('<AppShell flow={flow}>'))
assert.ok(service.includes('cache(async function getJourneyForCurrentUser()'))
assert.ok(flowService.includes('cache(async function loadJourneyFlow(journey: FlowJourney)'))

assert.ok(!shell.includes("localStorage.getItem('demo_user')"))
assert.ok(!shell.includes('Sesión de demostración'))
assert.ok(!shell.includes('(xpData.total_xp / xpData.xp_to_next_level)'))
assert.ok(shell.includes('xpData?.available === true'))
assert.ok(shell.includes('xpData.xp_progress_percent'))
assert.ok(gamificationRoute.includes('availability_reason'))
assert.ok(gamificationRoute.includes('xp_progress_percent: summary.xpProgressPercent'))
assert.ok(gamificationSummary.includes('const queryErrors = ['))
assert.ok(gamificationSummary.includes('xpProgressPercent'))

console.log(JSON.stringify({
  evidenceLevel: 'runtime_and_source_contract',
  scenarios: ['day_7_checkpoint', 'day_30', 'a3_closed'],
  navigationStates: ['completed', 'active', 'available', 'locked'],
  lockedNavigation: false,
  duplicateJourneyReadWithinRequest: false,
  demoShellFallback: false,
  gamificationAvailabilityExplicit: true,
  gamificationProgressServerCanonical: true,
  gamificationQueryFailuresFailClosed: true,
}))
