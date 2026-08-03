import 'server-only'

import { getCanonicalNextPath, getJourneyForCurrentUser } from './service'

/**
 * Resolve old C1-C4 / pillar URLs into the user's real canonical journey.
 * Legacy diagnostics C3/C4 no longer exist as independent product stages.
 */
export async function getLegacyJourneyDestination(): Promise<string> {
  const journey = await getJourneyForCurrentUser()
  if (!journey) return '/auth/signin'

  if (journey.access.a4) return '/despega/a4'
  if (journey.access.a3) return '/despega/a3'
  if (journey.access.a2) {
    return `/despega/a2/dia-${journey.state.highestA2DayUnlocked}`
  }

  return getCanonicalNextPath(journey.profile)
}
