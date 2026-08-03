import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

function source(path: string): string {
  return readFileSync(join(process.cwd(), path), 'utf8')
}

const legacyA1Result = source('app/despega/a1/resultado/page.tsx')
const a1ReportLayout = source('app/despega/a1-report/layout.tsx')
const a1Report = source('components/a1-canonical-report.tsx')
const phaseTransition = source('components/phase-transition-handler.tsx')
const transitionRoute = source('app/api/journey/transition/route.ts')
const transitionService = source('lib/journey/transitions.ts')
const c2Page = source('app/despega/conozcamonos-2/page.tsx')
const c2Layout = source('app/despega/conozcamonos-2/layout.tsx')
const c2Route = source('app/api/journey/complete-c2/route.ts')
const a2IntroPage = source('app/despega/a2/intro/page.tsx')
const a2IntroLayout = source('app/despega/a2/intro/layout.tsx')
const a2Intro = source('components/a2-canonical-intro.tsx')
const legacyA2Bridge = source('app/despega/a2-routes/page.tsx')
const a2Layout = source('app/despega/a2/layout.tsx')
const a2Boundary = source('components/a2-access-boundary.tsx')
const moduleAccessRoute = source('app/api/journey/module-access/route.ts')
const day7Bridge = source('components/a2-day7-card-export.tsx')
const a3Layout = source('app/despega/a3/layout.tsx')

assert.ok(legacyA1Result.includes("redirect('/despega/a1-report')"))
assert.ok(a1ReportLayout.includes('repairLegacyC2Completion'))
assert.ok(a1ReportLayout.includes("redirect('/despega/conozcamonos-2')"))
assert.ok(a1ReportLayout.includes('recordJourneyTransition'))
assert.ok(a1ReportLayout.includes('<A1CanonicalReport'))
assert.ok(!a1ReportLayout.includes('return children'))

assert.ok(a1Report.includes('A1 diagnostica'))
assert.ok(a1Report.includes('A2 traduce'))
assert.ok(a1Report.includes('A3 entrena'))
assert.ok(a1Report.includes('30 días'))
assert.ok(a1Report.includes('Día 7'))
assert.equal((a1Report.match(/PhaseTransitionHandler/g) || []).length, 2)
assert.ok(a1Report.includes('nextPhaseUrl="/despega/a2/intro"'))
assert.ok(!a1Report.includes('90 días de acciones'))

assert.ok(phaseTransition.includes("fetch('/api/journey/transition'"))
assert.ok(phaseTransition.includes("credentials: 'include'"))
assert.ok(!phaseTransition.includes('createClient'))
assert.ok(!phaseTransition.includes(".from('despega_user_profiles')"))
assert.ok(transitionRoute.includes('resolveServerUser'))
assert.ok(transitionRoute.includes('recordJourneyTransition'))

const c2Requirement = transitionService.indexOf(
  "throw new Error('Completa Conozcámonos 2 antes de abrir tu informe final.')",
)
const reportRequirement = transitionService.indexOf(
  "throw new Error('Completa A1 y revisa tu informe antes de iniciar Tu Ruta.')",
)
assert.ok(c2Requirement >= 0)
assert.ok(reportRequirement > c2Requirement)
assert.ok(transitionService.includes("return { nextPath: '/despega/a2/intro' }"))
assert.ok(transitionService.includes("return { nextPath: '/despega/a2' }"))
assert.ok(transitionService.includes('repairLegacyC2Completion'))
assert.ok(transitionService.includes('markA3JourneyVisited'))

assert.ok(c2Page.includes("fetch('/api/journey/complete-c2'"))
assert.ok(c2Page.includes('Generar informe A1'))
assert.ok(!c2Page.includes('createClient'))
assert.ok(!c2Page.includes('/despega/a2-routes'))
assert.ok(c2Layout.includes("redirect('/despega/conozcamonos-1')"))
assert.ok(c2Layout.includes("redirect('/despega/a1-cerebral')"))
assert.ok(c2Layout.includes("'/despega/a1-report'"))
assert.ok(c2Route.includes(".from('canon_conozcamonos_2_responses')"))
assert.ok(c2Route.includes('conozcamonos_2_completed: true'))
assert.ok(c2Route.includes('onboarding_conozcamonos_2_completed: true'))
assert.ok(c2Route.includes("nextPath: '/despega/a1-report'"))
assert.ok(!c2Route.includes('a2_route_generated: true'))

assert.ok(a2IntroPage.includes('<A2CanonicalIntro'))
assert.ok(!a2IntroPage.includes('createClient'))
assert.ok(a2IntroLayout.includes("redirect('/despega/conozcamonos-2')"))
assert.ok(a2IntroLayout.includes("redirect('/despega/a1-report')"))
assert.ok(a2Intro.includes("step: 'a2_intro'"))
assert.ok(a2Intro.includes('Comenzar Tu Ruta de 30 días'))
assert.ok(a2Intro.includes('ampliable a 60 y'))
assert.ok(a2Intro.includes('Desde el Día 7'))

assert.ok(legacyA2Bridge.includes('repairLegacyC2Completion'))
assert.ok(legacyA2Bridge.includes("redirect('/despega/a1-report')"))
assert.ok(legacyA2Bridge.includes("redirect('/despega/a2/intro')"))
assert.ok(a2Layout.includes('<A2AccessBoundary>'))
assert.ok(a2Boundary.includes("pathname === '/despega/a2/intro'"))
assert.ok(a2Boundary.includes("module-access?module=A2"))
assert.ok(moduleAccessRoute.includes('getModuleAccess'))
assert.ok(moduleAccessRoute.includes('getCanonicalNextPath'))

assert.ok(day7Bridge.includes("includes('career-mirror')"))
assert.ok(day7Bridge.includes("'/despega/a3/career-mirror'"))
assert.ok(day7Bridge.includes('!checkpointCompleted'))
assert.ok(day7Bridge.includes('Verificar Módulo 1'))
assert.ok(day7Bridge.includes("window.addEventListener('focus'"))
assert.ok(a3Layout.includes('repairLegacyC2Completion'))
assert.ok(a3Layout.includes('markA3JourneyVisited'))
assert.ok(a3Layout.includes("requireJourneyModule('A3')"))

console.log(
  JSON.stringify({
    canonicalOrder: [
      'Conozcámonos 1',
      'Despega Cerebral',
      'Conozcámonos 2',
      'Informe A1',
      'Introducción A2',
      'Tu Ruta',
      'Checkpoint A3 Día 7',
    ],
    a1IncludesC2AndReport: true,
    a2StartsAt30Days: true,
    serverTransitions: true,
    canonicalC2Flag: true,
    directA2AccessGuarded: true,
    realA3CheckpointRequired: true,
    legacyCompatibilityRepaired: true,
  }),
)
