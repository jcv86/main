export const A2_ACTIVITY_TIMEZONE = 'America/Santiago'
export const A2_ACTIVITY_WINDOW_DAYS = 14

export interface A2ActivityRecordInput {
  day?: number | null
  activityAt?: string | null
}

export type A2ActivityState =
  | 'no_activity'
  | 'active_today'
  | 'active_yesterday'
  | 'paused'

export interface A2ActivityWindowDay {
  date: string
  count: number
  active: boolean
  isToday: boolean
}

export interface A2ActivitySummary {
  timezone: string
  state: A2ActivityState
  activeDays: number
  currentStreak: number
  longestStreak: number
  activeDaysLast7Days: number
  completionsLast7Days: number
  lastActivityAt: string | null
  lastActivityDate: string | null
  daysSinceLastActivity: number | null
  window: A2ActivityWindowDay[]
}

function dateKey(value: Date, timezone: string): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(value)
  const values = new Map(parts.map((part) => [part.type, part.value]))
  return `${values.get('year')}-${values.get('month')}-${values.get('day')}`
}

function keyToOrdinal(key: string): number {
  const [year, month, day] = key.split('-').map(Number)
  return Math.floor(Date.UTC(year, month - 1, day) / 86_400_000)
}

function ordinalToKey(ordinal: number): string {
  return new Date(ordinal * 86_400_000).toISOString().slice(0, 10)
}

function parseInstant(value: string | null | undefined): Date | null {
  if (!value) return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function emptySummary(
  todayOrdinal: number,
  timezone: string,
): A2ActivitySummary {
  return {
    timezone,
    state: 'no_activity',
    activeDays: 0,
    currentStreak: 0,
    longestStreak: 0,
    activeDaysLast7Days: 0,
    completionsLast7Days: 0,
    lastActivityAt: null,
    lastActivityDate: null,
    daysSinceLastActivity: null,
    window: Array.from({ length: A2_ACTIVITY_WINDOW_DAYS }, (_, index) => {
      const ordinal = todayOrdinal - (A2_ACTIVITY_WINDOW_DAYS - 1 - index)
      return {
        date: ordinalToKey(ordinal),
        count: 0,
        active: false,
        isToday: ordinal === todayOrdinal,
      }
    }),
  }
}

/**
 * Calendar continuity is descriptive only. It does not unlock missions,
 * remove progress, award XP or alter the sequential A2 journey.
 */
export function buildA2ActivitySummary(
  records: A2ActivityRecordInput[],
  now: Date | string = new Date(),
  timezone = A2_ACTIVITY_TIMEZONE,
): A2ActivitySummary {
  const currentInstant = now instanceof Date ? now : new Date(now)
  if (Number.isNaN(currentInstant.getTime())) {
    throw new Error('Invalid reference date for A2 activity summary')
  }

  const todayKey = dateKey(currentInstant, timezone)
  const todayOrdinal = keyToOrdinal(todayKey)
  const counts = new Map<number, number>()
  const latestInstantByDay = new Map<number, Date>()

  for (const record of records) {
    const instant = parseInstant(record.activityAt)
    if (!instant) continue

    const ordinal = keyToOrdinal(dateKey(instant, timezone))
    if (ordinal > todayOrdinal) continue

    counts.set(ordinal, (counts.get(ordinal) || 0) + 1)
    const currentLatest = latestInstantByDay.get(ordinal)
    if (!currentLatest || instant.getTime() > currentLatest.getTime()) {
      latestInstantByDay.set(ordinal, instant)
    }
  }

  const activeOrdinals = Array.from(counts.keys()).sort((left, right) => left - right)
  if (activeOrdinals.length === 0) {
    return emptySummary(todayOrdinal, timezone)
  }

  let longestStreak = 1
  let runningStreak = 1
  for (let index = 1; index < activeOrdinals.length; index += 1) {
    if (activeOrdinals[index] === activeOrdinals[index - 1] + 1) {
      runningStreak += 1
      longestStreak = Math.max(longestStreak, runningStreak)
    } else {
      runningStreak = 1
    }
  }

  const lastOrdinal = activeOrdinals[activeOrdinals.length - 1]
  const daysSinceLastActivity = todayOrdinal - lastOrdinal
  let currentStreak = 0
  if (daysSinceLastActivity <= 1) {
    let cursor = lastOrdinal
    while (counts.has(cursor)) {
      currentStreak += 1
      cursor -= 1
    }
  }

  const state: A2ActivityState =
    daysSinceLastActivity === 0
      ? 'active_today'
      : daysSinceLastActivity === 1
        ? 'active_yesterday'
        : 'paused'

  const sevenDayStart = todayOrdinal - 6
  const last7Ordinals = activeOrdinals.filter((ordinal) => ordinal >= sevenDayStart)
  const completionsLast7Days = last7Ordinals.reduce(
    (total, ordinal) => total + (counts.get(ordinal) || 0),
    0,
  )
  const lastActivityInstant = latestInstantByDay.get(lastOrdinal) || null

  return {
    timezone,
    state,
    activeDays: activeOrdinals.length,
    currentStreak,
    longestStreak,
    activeDaysLast7Days: last7Ordinals.length,
    completionsLast7Days,
    lastActivityAt: lastActivityInstant?.toISOString() || null,
    lastActivityDate: ordinalToKey(lastOrdinal),
    daysSinceLastActivity,
    window: Array.from({ length: A2_ACTIVITY_WINDOW_DAYS }, (_, index) => {
      const ordinal = todayOrdinal - (A2_ACTIVITY_WINDOW_DAYS - 1 - index)
      const count = counts.get(ordinal) || 0
      return {
        date: ordinalToKey(ordinal),
        count,
        active: count > 0,
        isToday: ordinal === todayOrdinal,
      }
    }),
  }
}
