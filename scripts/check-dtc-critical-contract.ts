import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  PRODUCT_STAGE_ORDER,
  PRODUCT_STAGES,
  type InternalJourneyStage,
} from '../lib/dtc/product-language'

function source(path: string): string {
  return readFileSync(join(process.cwd(), path), 'utf8')
}

const expectedNames: Record<InternalJourneyStage, string> = {
  A1: 'Despega Cerebral',
  A2: 'Tu Ruta',
  A3: 'Entrenamiento',
  A4: 'Radar Estratégico',
}

const expectedRoutes: Record<InternalJourneyStage, string> = {
  A1: '/despega/a1-report',
  A2: '/despega/a2',
  A3: '/despega/a3',
  A4: '/despega/a4',
}

assert.deepEqual(PRODUCT_STAGE_ORDER, ['A1', 'A2', 'A3', 'A4'])

for (const stageId of PRODUCT_STAGE_ORDER) {
  const stage = PRODUCT_STAGES[stageId]
  assert.equal(stage.internalId, stageId)
  assert.equal(stage.name, expectedNames[stageId])
  assert.equal(stage.href, expectedRoutes[stageId])
  assert.ok(!/^A[1-4]\b/.test(stage.name), `${stageId} is leaking into public product language`)
  assert.ok(stage.actionLabel.length > 5, `${stageId} needs a meaningful action label`)
}

assert.equal(
  new Set(PRODUCT_STAGE_ORDER.map((stageId) => PRODUCT_STAGES[stageId].href)).size,
  PRODUCT_STAGE_ORDER.length,
  'Every product stage must have a unique canonical route',
)

const dashboard = source('app/despega/dashboard/page.tsx')
const profile = source('app/despega/profile/page.tsx')
const signoutRoute = source('app/api/auth/signout/route.ts')
const publicJourney = source('components/dtc/journey-canonical.tsx')
const publicClosing = source('components/dtc/closing-canonical.tsx')
const landing = source('components/dtc/dtc-landing.tsx')
const legacyA2Dashboard = source('app/despega/a2/dashboard/page.tsx')
const legacyJourney = source('app/despega/journey/page.tsx')
const legacyJourneySummary = source('app/despega/journey-summary/page.tsx')
const a2Sidebar = source('components/a2-progress-sidebar.tsx')
const a2DayTemplate = source('components/a2-day-page-template.tsx')
const a2ClientCompletion = source('lib/a2/client-completion.ts')
const journeyService = source('lib/journey/service.ts')
const completeDay = source('app/api/a2/complete-day/route.ts')
const xpActivity = source('app/api/gamification/xp-activity/route.ts')

for (const [path, content] of [
  ['app/despega/dashboard/page.tsx', dashboard],
  ['app/despega/profile/page.tsx', profile],
  ['components/dtc/journey-canonical.tsx', publicJourney],
  ['components/dtc/closing-canonical.tsx', publicClosing],
] as const) {
  for (const forbiddenCopy of [
    'A1 “',
    'A2 “',
    'A3 “',
    'A4 “',
    'Resultado A1',
    'Módulos conectados',
  ]) {
    assert.ok(!content.includes(forbiddenCopy), `${path} contains legacy visible copy: ${forbiddenCopy}`)
  }
}

assert.ok(landing.includes("import CanonicalJourney from './journey-canonical'"))
assert.ok(landing.includes("import CanonicalClosing from './closing-canonical'"))
assert.ok(!landing.includes("from './journey'"))
assert.ok(!landing.includes("from './closing'"))

assert.ok(!profile.includes("'use client'"))
assert.ok(profile.includes('getJourneyForCurrentUser'))
assert.ok(profile.includes('getGamificationSummary'))
assert.ok(profile.includes('action="/api/auth/signout"'))
assert.ok(!profile.includes('/despega/a2-routes'))
assert.ok(!profile.includes('/despega/a4-radar'))
assert.ok(!profile.includes('Readiness Score'))
assert.ok(signoutRoute.includes('supabase.auth.signOut()'))
assert.ok(signoutRoute.includes('DEMO_COOKIE_NAME'))

assert.match(legacyA2Dashboard, /redirect\(['"]\/despega\/a2['"]\)/)
assert.ok(!legacyA2Dashboard.includes('a3_unlocked: true'))
assert.ok(!legacyA2Dashboard.includes('PhaseTransitionHandler'))
assert.match(legacyJourney, /redirect\(['"]\/despega\/dashboard['"]\)/)
assert.match(legacyJourneySummary, /redirect\(['"]\/despega\/profile['"]\)/)
assert.ok(!legacyJourney.includes('user_journey_progress'))
assert.ok(!legacyJourneySummary.includes('45\/90'))

assert.ok(a2Sidebar.includes("name: 'Ciclo inicial'"))
assert.ok(a2Sidebar.includes("name: 'Extensión a 60 días'"))
assert.ok(a2Sidebar.includes("name: 'Integración a 90 días'"))
assert.ok(a2Sidebar.includes('refreshInterval: 0'))
assert.ok(a2Sidebar.includes('useEffect(() =>'))
assert.ok(!a2Sidebar.includes('refreshInterval: 5000'))
assert.ok(!a2Sidebar.includes('Mes {month.month}'))
assert.ok(!a2Sidebar.includes('setExpandedMonth(currentMonth)'))

assert.ok(a2ClientCompletion.includes("credentials: 'include'"))
assert.ok(a2ClientCompletion.includes("fetch('/api/a2/complete-day'"))
assert.ok(a2ClientCompletion.includes('payload.progression?.nextDay'))
assert.ok(a2ClientCompletion.includes('nextDay > dayNumber'))
assert.ok(a2DayTemplate.includes('completeA2Day(dayNumber)'))
assert.ok(a2DayTemplate.includes('router.push(result.nextPath)'))
assert.ok(!a2DayTemplate.includes('/despega/a2#dia-'))
assert.ok(!a2DayTemplate.includes('Checkpoint A3'))

for (let day = 1; day <= 10; day += 1) {
  const dayPage = source(`app/despega/a2/dia-${day}/page.tsx`)
  assert.ok(dayPage.includes("import { completeA2Day } from '@/lib/a2/client-completion'"))
  assert.ok(dayPage.includes('await completeA2Day(DIA_NUM, submission)'))
  assert.ok(dayPage.includes('router.push(result.nextPath)'))
  assert.ok(!dayPage.includes('if (user?.id)'))
  assert.ok(!dayPage.includes('/despega/a2-routes'))
  assert.ok(!dayPage.includes('setTimeout(resolve => setTimeout'))
  assert.ok(!dayPage.includes('500'))
}

assert.ok(journeyService.includes("A2: '/despega/a2'"))
assert.ok(!journeyService.includes("A2: '/despega/a2/dashboard'"))
assert.ok(!journeyService.includes("return '/despega/a2-routes'"))

assert.ok(completeDay.includes('analyzeA2Day1Submission'))
assert.ok(completeDay.includes('{ status: 422 }'))
assert.ok(!completeDay.includes('const rawStatus = submission.passStatus'))

assert.ok(
  xpActivity.includes('status: 410') || xpActivity.includes('{ status: 410 }'),
  'Public XP write endpoint must remain disabled',
)
assert.ok(!xpActivity.includes('xp_amount: body.xp_amount'))

console.log(
  JSON.stringify({
    stages: PRODUCT_STAGE_ORDER.map((stageId) => PRODUCT_STAGES[stageId].name),
    canonicalRoutes: PRODUCT_STAGE_ORDER.map((stageId) => PRODUCT_STAGES[stageId].href),
    canonicalProfile: true,
    legacyJourneyRedirects: true,
    canonicalA2Cycles: ['30', '60', '90'],
    canonicalDayCompletion: true,
    day1ServerScoring: true,
    publicXpWritesDisabled: true,
  }),
)
