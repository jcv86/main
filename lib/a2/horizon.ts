import type { A2Horizon } from '@/lib/a2/server-progress'

export interface A2HorizonProgression {
  nextDay: number
  highestUnlockedDay: number
  extensionRequired: boolean
  nextHorizon: A2Horizon | null
}

export function nextA2Horizon(current: A2Horizon): A2Horizon | null {
  if (current === 30) return 60
  if (current === 60) return 90
  return null
}

/**
 * Computes the next unlocked day without crossing the user's explicitly
 * selected horizon. Completing Day 30 or 60 pauses the route on the boundary
 * until the user chooses to extend it.
 */
export function resolveA2HorizonProgression(
  day: number,
  highestUnlockedDay: number,
  activeHorizon: A2Horizon,
): A2HorizonProgression {
  const nextHorizon = nextA2Horizon(activeHorizon)
  const extensionRequired = day === activeHorizon && nextHorizon !== null

  if (extensionRequired) {
    return {
      nextDay: activeHorizon,
      highestUnlockedDay: activeHorizon,
      extensionRequired: true,
      nextHorizon,
    }
  }

  const candidate =
    day >= highestUnlockedDay ? Math.min(90, day + 1) : highestUnlockedDay
  const nextDay = Math.min(activeHorizon, candidate)

  return {
    nextDay,
    highestUnlockedDay: Math.max(
      Math.min(activeHorizon, highestUnlockedDay),
      nextDay,
    ),
    extensionRequired: false,
    nextHorizon: null,
  }
}
