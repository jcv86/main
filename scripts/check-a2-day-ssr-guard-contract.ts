import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  parseExtendedA2DaySegment,
  resolveA2DayAccess,
} from '../lib/journey/a2-day-access'

function source(path: string): string {
  return readFileSync(join(process.cwd(), path), 'utf8')
}

for (const day of [11, 31, 61, 90]) {
  assert.equal(parseExtendedA2DaySegment(`dia-${day}`), day)
  assert.deepEqual(
    resolveA2DayAccess(day, day - 1),
    { allowed: false, redirectDay: day - 1 },
    `day ${day} must remain locked before its canonical unlock`,
  )
  assert.deepEqual(
    resolveA2DayAccess(day, 90),
    { allowed: true },
    `day ${day} must remain available on a completed 90-day horizon`,
  )
}

for (const invalid of ['11', 'dia-10', 'dia-91', 'dia-011', 'dia-x', '']) {
  assert.equal(parseExtendedA2DaySegment(invalid), null)
}

const layout = source('app/despega/a2/[day]/layout.tsx')
const page = source('app/despega/a2/[day]/page.tsx')
const service = source('lib/journey/service.ts')
const middleware = source('lib/supabase/middleware.ts')

assert.ok(layout.includes('await requireA2Day(day)'))
assert.ok(layout.includes('parseExtendedA2DaySegment'))
assert.ok(page.includes('<A2DayPageTemplate dayNumber={day} />'))
assert.ok(page.includes('parseExtendedA2DaySegment'))
assert.ok(service.includes('resolveA2DayAccess(day, journey.state.highestA2DayUnlocked)'))
assert.ok(!middleware.includes(".from('despega_pilar_progress')"))

console.log(JSON.stringify({
  evidenceLevel: 'runtime_and_source_contract',
  guardedRange: [11, 90],
  boundaryDaysTested: [11, 31, 61, 90],
  statesTested: ['locked', 'completed_90_day_horizon'],
  canonicalSource: 'journey.state.highestA2DayUnlocked',
}))
