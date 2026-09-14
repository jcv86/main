export type A2DayAccessDecision =
  | { allowed: true }
  | { allowed: false; redirectDay: number }

export function parseExtendedA2DaySegment(segment: string): number | null {
  const match = /^dia-(\d{1,2})$/.exec(segment)
  if (!match) return null

  const day = Number(match[1])
  return day >= 11 && day <= 90 ? day : null
}

export function resolveA2DayAccess(
  requestedDay: number,
  highestUnlockedDay: number,
): A2DayAccessDecision {
  const safeUnlockedDay = Number.isInteger(highestUnlockedDay)
    ? Math.min(90, Math.max(1, highestUnlockedDay))
    : 1

  if (
    !Number.isInteger(requestedDay) ||
    requestedDay < 1 ||
    requestedDay > 90 ||
    requestedDay > safeUnlockedDay
  ) {
    return { allowed: false, redirectDay: safeUnlockedDay }
  }

  return { allowed: true }
}
