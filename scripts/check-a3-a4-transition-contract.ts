import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { buildJourneyFlow, type FlowInput } from '../lib/journey/flow'

function source(path: string): string {
  return readFileSync(join(process.cwd(), path), 'utf8')
}

const atomicMigration = source('migrations/06-a3-a4-atomic-transition.sql')
const guardMigration = source('migrations/07-a4-unlock-guard.sql')
const journeyService = source('lib/journey/service.ts')
const finalEndpoint = source(
  'app/api/a3/module-completion/basic-interview-mission/route.ts',
)
const clientCompletion = source('lib/a3/client-completion.ts')
const a4Page = source('app/despega/a4/page.tsx')
const a4Layout = source('app/despega/a4/layout.tsx')
const dashboard = source('app/despega/dashboard/page.tsx')

assert.ok(atomicMigration.includes('p_complete_route boolean default false'))
assert.ok(atomicMigration.includes("current_module = case"))
assert.ok(atomicMigration.includes("else 'A4'"))
assert.ok(atomicMigration.includes('a4_unlocked_at = coalesce'))
assert.ok(atomicMigration.includes('a4_unlocked = true'))
assert.ok(atomicMigration.includes("current_stage = 'a4'"))
assert.ok(atomicMigration.includes("'routeCompleted'"))
assert.ok(atomicMigration.includes("'a4Unlocked'"))
assert.ok(atomicMigration.includes("'journey'"))
assert.ok(atomicMigration.includes("'profile'"))
assert.ok(atomicMigration.includes('security invoker'))
assert.ok(atomicMigration.includes('from public, anon, authenticated'))
assert.ok(atomicMigration.includes('to service_role'))

assert.ok(guardMigration.includes('enforce_a4_requires_a3_completion'))
assert.ok(guardMigration.includes('route.route_completed_at is not null'))
assert.ok(guardMigration.includes("new.current_module := case"))
assert.ok(guardMigration.includes('new.a4_unlocked := false'))
assert.ok(guardMigration.includes('before insert or update'))
assert.ok(guardMigration.includes('despega_journey_state'))
assert.ok(guardMigration.includes('despega_user_profiles'))

assert.ok(journeyService.includes(".from('a3_route_progression')"))
assert.ok(journeyService.includes('a3RouteCompletedAt'))
assert.ok(journeyService.includes('const hasA4Evidence'))
assert.ok(journeyService.includes('a4_unlocked: hasA4Evidence'))
assert.ok(journeyService.includes('a4UnlockedAt: hasA4Evidence'))
assert.ok(journeyService.includes("if (module === 'A4' && journey.access.a3)"))
assert.ok(journeyService.includes('Boolean(state.a4UnlockedAt && profile.a4_unlocked)'))

assert.ok(finalEndpoint.includes('routeCompleted: boolean'))
assert.ok(finalEndpoint.includes('a4Unlocked: boolean'))
assert.ok(finalEndpoint.includes('!data.routeCompleted || !data.a4Unlocked'))
assert.ok(finalEndpoint.includes("code: 'A3_A4_TRANSITION_NOT_CONFIRMED'"))
assert.ok(finalEndpoint.includes('routeCompleted: data.routeCompleted'))
assert.ok(finalEndpoint.includes('a4Unlocked: data.a4Unlocked'))
assert.ok(finalEndpoint.includes("nextPath: '/despega/a4?unlocked=training-complete'"))
assert.ok(!finalEndpoint.includes('routeCompleted: true,'))
assert.ok(!finalEndpoint.includes('a4Unlocked: true,'))

assert.ok(clientCompletion.includes('a4Unlocked?: boolean'))
assert.ok(clientCompletion.includes('!payload.routeCompleted || !payload.a4Unlocked'))
assert.ok(clientCompletion.includes('window.location.assign(payload.nextPath)'))
assert.ok(clientCompletion.includes('basic-interview-mission'))

assert.ok(a4Layout.includes("requireJourneyModule('A4')"))
assert.ok(a4Page.includes('getJourneyForCurrentUser'))
assert.ok(a4Page.includes("if (!journey.access.a4) redirect('/despega/a3')"))
assert.ok(a4Page.includes('journey.state.a4UnlockedAt'))
assert.ok(a4Page.includes(".from('a4_verified_signals')"))
assert.ok(a4Page.includes(".from('a4_decision_log')"))
assert.ok(a4Page.includes('Evidencia antes que opinión'))
assert.ok(a4Page.includes('no inventa noticias'))
assert.ok(!a4Page.includes(".from('a4_noticias')"))
assert.ok(!a4Page.includes(".from('a4_signal_history')"))
assert.ok(!a4Page.includes(".from('a4_strategic_score')"))
assert.ok(!a4Page.includes('PersonalizedRadarSystem'))
assert.ok(!a4Page.includes('JobRecommendationsCard'))
assert.ok(!a4Page.includes('LinkedInProfileCard'))
assert.ok(!a4Page.includes('IA 24/7'))
assert.ok(!a4Page.includes('Colocación laboral'))
assert.ok(!a4Page.includes('2026-04-06'))
assert.ok(!a4Page.includes('Ofertas laborales personalizadas'))

// Continuation and stage state moved out of the dashboard into one shared model.
// Check the wiring plus behavior, rather than requiring the removed inline branches.
assert.ok(dashboard.includes('loadJourneyFlow(journey)'))
assert.ok(dashboard.includes('const continueAction = flow.next'))
assert.ok(dashboard.includes('flow.cards.find'))
assert.ok(dashboard.includes('flow.radarAvailable'))
assert.ok(dashboard.includes('Radar Estratégico desbloqueado'))

const fixture: FlowInput = {
  profile: {
    onboarding_conozcamonos_1_completed: true,
    a1_cerebral_intro_seen: true,
    a1_cerebral_completed: true,
    conozcamonos_2_completed: true,
    a1_report_seen: true,
    a2_intro_seen: true,
  },
  access: { a1: true, a2: true, a3: true, a4: false },
  currentModule: 'A3',
  highestA2DayUnlocked: 90,
  completedA2Days: [],
  completedA3Modules: ['career-mirror'],
  a3RouteClosed: false,
}
for (const closure of [false, true]) {
  for (const authorized of [false, true]) {
    const flow = buildJourneyFlow({ ...fixture, a3RouteClosed: closure, access: { ...fixture.access, a4: authorized } })
    const allowed = closure && authorized
    assert.equal(flow.radarAvailable, allowed)
    assert.equal(flow.next.href === '/despega/a4', allowed)
    assert.equal(flow.cards.find((card) => card.id === 'A4')?.href, allowed ? '/despega/a4' : null)
    assert.equal(flow.cards.find((card) => card.id === 'A3')?.state === 'completed', closure)
    if (allowed) {
      assert.equal(flow.next.label, 'Abrir Radar Estratégico')
      assert.equal(flow.cards.find((card) => card.id === 'A4')?.state, 'active')
    }
  }
}
const incomplete = buildJourneyFlow({ ...fixture, profile: {}, a3RouteClosed: true, access: { ...fixture.access, a4: true } })
assert.equal(incomplete.radarAvailable, false)
assert.equal(incomplete.next.href, '/despega/conozcamonos-1')
assert.equal(incomplete.cards.find((card) => card.id === 'A4')?.href, null)

console.log(
  JSON.stringify({
    transition: 'A3 -> A4',
    evidenceLevel: 'source_contracts_plus_shared_dashboard_model_runtime',
    atomicJourneyUpdate: true,
    atomicProfileUpdate: true,
    prematureUnlockGuarded: true,
    routeClosureEvidenceRequired: true,
    clientConfirmationRequired: true,
    dashboardAligned: true,
    dashboardRuntimeScenarios: 5,
    a4UsesPersistedEvidenceOnly: true,
    a4DirectAccessGuarded: true,
    deployedHttpOrDatabaseTestedHere: false,
  }),
)
