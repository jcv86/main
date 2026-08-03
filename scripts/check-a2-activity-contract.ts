import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  A2_ACTIVITY_TIMEZONE,
  A2_ACTIVITY_WINDOW_DAYS,
  buildA2ActivitySummary,
} from '../lib/a2/activity'

function source(path: string): string {
  return readFileSync(join(process.cwd(), path), 'utf8')
}

const now = new Date('2026-08-10T12:00:00.000Z')

const empty = buildA2ActivitySummary([], now, A2_ACTIVITY_TIMEZONE)
assert.equal(empty.state, 'no_activity')
assert.equal(empty.activeDays, 0)
assert.equal(empty.currentStreak, 0)
assert.equal(empty.longestStreak, 0)
assert.equal(empty.daysSinceLastActivity, null)
assert.equal(empty.window.length, A2_ACTIVITY_WINDOW_DAYS)
assert.equal(empty.window.at(-1)?.date, '2026-08-10')
assert.equal(empty.window.at(-1)?.isToday, true)

const activeToday = buildA2ActivitySummary(
  [
    { day: 1, activityAt: '2026-08-08T12:00:00.000Z' },
    { day: 2, activityAt: '2026-08-09T12:00:00.000Z' },
    { day: 3, activityAt: '2026-08-10T10:00:00.000Z' },
    { day: 4, activityAt: '2026-08-10T11:00:00.000Z' },
  ],
  now,
  A2_ACTIVITY_TIMEZONE,
)
assert.equal(activeToday.state, 'active_today')
assert.equal(activeToday.activeDays, 3)
assert.equal(activeToday.currentStreak, 3)
assert.equal(activeToday.longestStreak, 3)
assert.equal(activeToday.activeDaysLast7Days, 3)
assert.equal(activeToday.completionsLast7Days, 4)
assert.equal(activeToday.daysSinceLastActivity, 0)
assert.equal(activeToday.lastActivityDate, '2026-08-10')
assert.equal(
  activeToday.window.find((day) => day.date === '2026-08-10')?.count,
  2,
)

const activeYesterday = buildA2ActivitySummary(
  [
    { day: 1, activityAt: '2026-08-08T12:00:00.000Z' },
    { day: 2, activityAt: '2026-08-09T12:00:00.000Z' },
  ],
  now,
  A2_ACTIVITY_TIMEZONE,
)
assert.equal(activeYesterday.state, 'active_yesterday')
assert.equal(activeYesterday.currentStreak, 2)
assert.equal(activeYesterday.daysSinceLastActivity, 1)

const paused = buildA2ActivitySummary(
  [
    { day: 1, activityAt: '2026-08-05T12:00:00.000Z' },
    { day: 2, activityAt: '2026-08-06T12:00:00.000Z' },
    { day: 3, activityAt: '2026-08-07T12:00:00.000Z' },
    { day: 4, activityAt: 'invalid-date' },
    { day: 5, activityAt: '2026-08-12T12:00:00.000Z' },
  ],
  now,
  A2_ACTIVITY_TIMEZONE,
)
assert.equal(paused.state, 'paused')
assert.equal(paused.currentStreak, 0)
assert.equal(paused.longestStreak, 3)
assert.equal(paused.daysSinceLastActivity, 3)
assert.equal(paused.lastActivityDate, '2026-08-07')

const splitStreaks = buildA2ActivitySummary(
  [
    { activityAt: '2026-08-01T12:00:00.000Z' },
    { activityAt: '2026-08-02T12:00:00.000Z' },
    { activityAt: '2026-08-04T12:00:00.000Z' },
    { activityAt: '2026-08-05T12:00:00.000Z' },
    { activityAt: '2026-08-06T12:00:00.000Z' },
    { activityAt: '2026-08-09T12:00:00.000Z' },
  ],
  now,
  A2_ACTIVITY_TIMEZONE,
)
assert.equal(splitStreaks.currentStreak, 1)
assert.equal(splitStreaks.longestStreak, 3)

const activityRoute = source('app/api/a2/activity/route.ts')
const activityPanel = source('components/a2-activity-continuity-panel.tsx')
const a2Layout = source('app/despega/a2/layout.tsx')
const migration = source('migrations/04-a2-preserve-completion-time.sql')

assert.ok(activityRoute.includes(".select('day, created_at, completed_at')"))
assert.ok(
  activityRoute.includes(
    'textValue(row.created_at) || textValue(row.completed_at) || null',
  ),
  'Immutable created_at must be preferred over mutable compatibility timestamps',
)
assert.ok(activityRoute.includes('buildA2ActivitySummary(records'))
assert.ok(activityRoute.includes('A2_ACTIVITY_TIMEZONE'))

assert.ok(a2Layout.includes('A2ActivityContinuityPanel'))
assert.ok(activityPanel.includes("pathname !== '/despega/a2'"))
assert.ok(activityPanel.includes("fetch('/api/a2/activity'"))
assert.ok(activityPanel.includes('Ventana de 14 días'))
assert.ok(activityPanel.includes('No bloquea misiones'))
assert.ok(activityPanel.includes('no modifica el avance secuencial'))

for (const forbidden of [
  'debes ',
  'deberías',
  'recomendamos',
  'perdiste',
  'rompiste',
  'castigo',
]) {
  assert.ok(
    !activityPanel.toLowerCase().includes(forbidden),
    `Activity continuity must stay neutral: ${forbidden}`,
  )
}

assert.ok(migration.includes('preserve_a2_completion_timestamp'))
assert.ok(migration.includes('before update on public.a2_user_task_completions'))
assert.ok(migration.includes('new.completed_at := old.completed_at'))
assert.ok(migration.includes('new.created_at := old.created_at'))
assert.ok(migration.includes('set search_path = public, pg_temp'))
assert.ok(
  migration.includes(
    'revoke all on function public.preserve_a2_completion_timestamp() from authenticated',
  ),
)

console.log(
  JSON.stringify({
    timezone: A2_ACTIVITY_TIMEZONE,
    windowDays: A2_ACTIVITY_WINDOW_DAYS,
    activeTodayStreak: activeToday.currentStreak,
    pausedLongestStreak: paused.longestStreak,
    originalCompletionDatePreferred: true,
    pausesPreserveProgress: true,
  }),
)
