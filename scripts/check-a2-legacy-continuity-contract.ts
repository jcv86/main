import assert from 'node:assert/strict'
import { reconcileA2Progress } from '../lib/a2/server-progress'

assert.deepEqual(
  reconcileA2Progress({
    currentDay: 1,
    highestUnlockedDay: 1,
    activeHorizon: 30,
    completedDays: [1, 2, 3, 4, 5],
  }),
  { currentDay: 6, highestUnlockedDay: 6 },
)

assert.deepEqual(
  reconcileA2Progress({
    currentDay: 3,
    highestUnlockedDay: 3,
    activeHorizon: 30,
    completedDays: [1, 2, 8],
  }),
  { currentDay: 3, highestUnlockedDay: 3 },
)

assert.deepEqual(
  reconcileA2Progress({
    currentDay: 17,
    highestUnlockedDay: 17,
    activeHorizon: 30,
    completedDays: [1, 2, 3],
  }),
  { currentDay: 17, highestUnlockedDay: 17 },
)

assert.deepEqual(
  reconcileA2Progress({
    currentDay: 30,
    highestUnlockedDay: 30,
    activeHorizon: 30,
    completedDays: Array.from({ length: 30 }, (_, index) => index + 1),
  }),
  { currentDay: 30, highestUnlockedDay: 30 },
)

console.log(
  JSON.stringify({
    legacySequentialProgressReconciled: true,
    sparseCompletionCannotSkipDays: true,
    canonicalProgressNeverRegresses: true,
    horizonBoundaryPreserved: true,
  }),
)
