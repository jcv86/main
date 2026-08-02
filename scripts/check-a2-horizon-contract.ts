import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { inferA2Horizon } from '../lib/a2/server-progress'
import {
  nextA2Horizon,
  resolveA2HorizonProgression,
} from '../lib/a2/horizon'

function source(path: string): string {
  return readFileSync(join(process.cwd(), path), 'utf8')
}

assert.equal(inferA2Horizon({}, 1), 30)
assert.equal(inferA2Horizon({}, 30), 30)
assert.equal(inferA2Horizon({}, 31), 60)
assert.equal(inferA2Horizon({}, 61), 90)
assert.equal(inferA2Horizon({ a2_horizon: 30 }, 75), 30)
assert.equal(inferA2Horizon({ a2_horizon: 60 }, 10), 60)
assert.equal(inferA2Horizon({ a2_horizon: 90 }, 10), 90)

assert.equal(nextA2Horizon(30), 60)
assert.equal(nextA2Horizon(60), 90)
assert.equal(nextA2Horizon(90), null)

assert.deepEqual(resolveA2HorizonProgression(29, 29, 30), {
  nextDay: 30,
  highestUnlockedDay: 30,
  extensionRequired: false,
  nextHorizon: null,
})
assert.deepEqual(resolveA2HorizonProgression(30, 30, 30), {
  nextDay: 30,
  highestUnlockedDay: 30,
  extensionRequired: true,
  nextHorizon: 60,
})
assert.deepEqual(resolveA2HorizonProgression(30, 31, 60), {
  nextDay: 31,
  highestUnlockedDay: 31,
  extensionRequired: false,
  nextHorizon: null,
})
assert.deepEqual(resolveA2HorizonProgression(60, 60, 60), {
  nextDay: 60,
  highestUnlockedDay: 60,
  extensionRequired: true,
  nextHorizon: 90,
})
assert.deepEqual(resolveA2HorizonProgression(90, 90, 90), {
  nextDay: 90,
  highestUnlockedDay: 90,
  extensionRequired: false,
  nextHorizon: null,
})

const serverProgress = source('lib/a2/server-progress.ts')
const completeDay = source('app/api/a2/complete-day/route.ts')
const extendHorizon = source('app/api/a2/extend-horizon/route.ts')
const progressRoute = source('app/api/a2/progress/route.ts')
const dashboard = source('app/despega/a2/page.tsx')

assert.ok(serverProgress.includes(".select('current_a2_day, highest_a2_day_unlocked, metadata')"))
assert.ok(serverProgress.includes('activeHorizon: A2Horizon'))
assert.ok(serverProgress.includes('Grandfather existing routes'))
assert.ok(serverProgress.includes('Math.min(activeHorizon'))

assert.ok(completeDay.includes('resolveA2HorizonProgression('))
assert.ok(completeDay.includes('snapshot.activeHorizon'))
assert.ok(completeDay.includes('a2_horizon: snapshot.activeHorizon'))
assert.ok(completeDay.includes('a2_extension_required: extensionRequired'))
assert.ok(completeDay.includes('a2_next_horizon: nextHorizon'))
assert.ok(completeDay.includes('extensionRequired,'))
assert.ok(completeDay.includes('nextHorizon,'))
assert.ok(
  completeDay.indexOf('resolveA2HorizonProgression(') <
    completeDay.indexOf('current_a2_day: nextDay'),
  'The horizon boundary must be resolved before journey progression is written',
)

assert.ok(extendHorizon.includes('expectedTarget = nextA2Horizon'))
assert.ok(extendHorizon.includes(".eq('day', snapshot.activeHorizon)"))
assert.ok(extendHorizon.includes('Completa el Día ${snapshot.activeHorizon}'))
assert.ok(extendHorizon.includes('a2_extension_history'))
assert.ok(extendHorizon.includes('a2_horizon: targetHorizon'))
assert.ok(extendHorizon.includes('current_a2_day: firstDay'))
assert.ok(extendHorizon.includes('nextPath: `/despega/a2/dia-${firstDay}`'))

for (const field of [
  'active_horizon',
  'next_horizon',
  'extension_available',
  'cycle_complete',
]) {
  assert.ok(progressRoute.includes(field), `Progress API must expose ${field}`)
  assert.ok(dashboard.includes(field), `Dashboard must use ${field}`)
}
assert.ok(progressRoute.includes("'awaiting_extension'"))
assert.ok(progressRoute.includes('completedDays.includes(snapshot.activeHorizon)'))
assert.ok(dashboard.includes("fetch('/api/a2/extend-horizon'"))
assert.ok(dashboard.includes('Extender a ${progress.next_horizon} días'))
assert.ok(dashboard.includes('Horizonte activo · {progress.active_horizon} días'))
assert.ok(dashboard.includes("' · vista previa'"))
assert.ok(dashboard.includes('Tú decides si Tu Ruta continúa'))

console.log(
  JSON.stringify({
    defaultHorizon: 30,
    explicitExtensions: ['30→60', '60→90'],
    legacyHorizonInference: true,
    boundaryPause: true,
    serverExtensionGate: true,
  }),
)
