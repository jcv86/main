import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  buildA2CycleReview,
  type A2CycleReviewRecord,
} from '../lib/a2/cycle-review'

function source(path: string): string {
  return readFileSync(join(process.cwd(), path), 'utf8')
}

const empty = buildA2CycleReview(30, [])
assert.equal(empty.status, 'not_started')
assert.equal(empty.completedDays, 0)
assert.equal(empty.closureScore, 0)
assert.equal(empty.checkpointsRequired, 3)
assert.ok(empty.gaps.some((gap) => gap.includes('30 días')))

const partialRecords: A2CycleReviewRecord[] = Array.from(
  { length: 10 },
  (_, index) => ({
    day: index + 1,
    missionType: index === 4 ? 'field_action' : 'builder',
    validationStatus: index === 6 ? 'checkpoint' : 'structural',
    score: 80,
    hasEvidence: true,
    completedAt: `2026-01-${String(index + 1).padStart(2, '0')}T12:00:00.000Z`,
  }),
)
const partial = buildA2CycleReview(30, partialRecords)
assert.equal(partial.status, 'in_progress')
assert.equal(partial.completedDays, 10)
assert.equal(partial.completionRate, 33)
assert.equal(partial.realActionDays, 1)
assert.equal(partial.averageScore, 80)
assert.ok(partial.gaps.some((gap) => gap.includes('20 días')))

const checkpointDays = new Set([7, 16, 27])
const completeRecords: A2CycleReviewRecord[] = Array.from(
  { length: 30 },
  (_, index) => {
    const day = index + 1
    return {
      day,
      missionType: day % 5 === 0 ? 'field_action' : 'builder',
      validationStatus: checkpointDays.has(day) ? 'checkpoint' : 'structural',
      score: 85,
      hasEvidence: true,
      completedAt: `2026-02-${String(Math.min(day, 28)).padStart(2, '0')}T12:00:00.000Z`,
    }
  },
)
const complete30 = buildA2CycleReview(30, completeRecords)
assert.equal(complete30.status, 'ready_to_extend')
assert.equal(complete30.completedDays, 30)
assert.equal(complete30.completionRate, 100)
assert.equal(complete30.validationRate, 100)
assert.equal(complete30.evidenceRate, 100)
assert.equal(complete30.checkpointsCompleted, 3)
assert.equal(complete30.checkpointRate, 100)
assert.equal(complete30.realActionDays, 6)
assert.equal(complete30.averageScore, 85)
assert.equal(complete30.closureScore, 100)
assert.equal(complete30.gaps.length, 0)
assert.ok(complete30.strengths.length >= 4)

const complete90 = buildA2CycleReview(
  90,
  Array.from({ length: 90 }, (_, index) => {
    const day = index + 1
    const isCheckpoint = [7, 16, 27, 35, 43, 51, 58, 68, 78, 88].includes(day)
    return {
      day,
      missionType: day % 6 === 0 ? 'field_action' : 'builder',
      validationStatus: isCheckpoint ? 'checkpoint' : 'structural',
      score: 90,
      hasEvidence: true,
      completedAt: '2026-03-01T12:00:00.000Z',
    }
  }),
)
assert.equal(complete90.status, 'completed')
assert.equal(complete90.checkpointsCompleted, 10)
assert.equal(complete90.closureScore, 100)

const duplicated = buildA2CycleReview(30, [
  completeRecords[0],
  { ...completeRecords[0], score: 10 },
])
assert.equal(duplicated.completedDays, 1, 'Duplicate completion rows must count once')

const progressRoute = source('app/api/a2/progress/route.ts')
const dashboard = source('app/despega/a2/page.tsx')
const reviewCard = source('components/a2-cycle-review-card.tsx')

assert.ok(progressRoute.includes('buildA2CycleReview('))
assert.ok(progressRoute.includes('active_cycle_review: activeCycleReview'))
assert.ok(progressRoute.includes('cycle_reviews: cycleReviews'))
assert.ok(progressRoute.includes('REVIEW_HORIZONS.map'))
assert.ok(progressRoute.includes('missionType: record.mission_type'))
assert.ok(progressRoute.includes('hasEvidence: record.has_evidence'))

assert.ok(dashboard.includes('A2CycleReviewCard'))
assert.ok(dashboard.includes('active_cycle_review'))
assert.ok(dashboard.includes('cycle_reviews'))
assert.ok(dashboard.includes('selectedCycleReview'))
assert.ok(dashboard.includes('review={progress.active_cycle_review}'))
assert.ok(dashboard.includes('review={selectedCycleReview}'))

for (const label of [
  'Cierre verificable',
  'Solidez registrada',
  'Señales consolidadas',
  'Aspectos todavía abiertos',
  'Acciones reales',
]) {
  assert.ok(reviewCard.includes(label), `Review card must show ${label}`)
}
assert.ok(reviewCard.includes('No decide por ti'))
for (const forbidden of ['Te recomendamos', 'Deberías extender', 'Debes extender']) {
  assert.ok(!reviewCard.includes(forbidden), `Review must not prescribe: ${forbidden}`)
}

console.log(
  JSON.stringify({
    horizons: [30, 60, 90],
    evidenceBasedClosure: true,
    checkpointCoverage: [3, 7, 10],
    neutralDecisionSupport: true,
  }),
)
