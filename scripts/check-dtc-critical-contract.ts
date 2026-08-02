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
const publicJourney = source('components/dtc/journey-canonical.tsx')
const publicClosing = source('components/dtc/closing-canonical.tsx')
const landing = source('components/dtc/dtc-landing.tsx')
const legacyA2Dashboard = source('app/despega/a2/dashboard/page.tsx')
const journeyService = source('lib/journey/service.ts')
const completeDay = source('app/api/a2/complete-day/route.ts')
const xpActivity = source('app/api/gamification/xp-activity/route.ts')

for (const [path, content] of [
  ['app/despega/dashboard/page.tsx', dashboard],
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

assert.match(legacyA2Dashboard, /redirect\(['"]\/despega\/a2['"]\)/)
assert.ok(!legacyA2Dashboard.includes('a3_unlocked: true'))
assert.ok(!legacyA2Dashboard.includes('PhaseTransitionHandler'))

assert.ok(journeyService.includes("A2: '/despega/a2'"))
assert.ok(!journeyService.includes("A2: '/despega/a2/dashboard'"))
assert.ok(!journeyService.includes("return '/despega/a2-routes'"))

assert.ok(completeDay.includes('evaluateDay1Submission'))
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
    legacyA2DashboardRedirects: true,
    day1ServerScoring: true,
    publicXpWritesDisabled: true,
  }),
)
