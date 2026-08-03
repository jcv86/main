import 'server-only'

import { resolveLegacyContinuityDestination } from './legacy-continuity'
import { getCanonicalNextPath, getJourneyForCurrentUser } from './service'

/**
 * Resolve old C1-C4 / pillar URLs into the user's real canonical journey.
 * Legacy diagnostics C3/C4 no longer exist as independent product stages.
 */
export async function getLegacyJourneyDestination(): Promise<string> {
  const journey = await getJourneyForCurrentUser()
  if (!journey) {
    return resolveLegacyContinuityDestination({
      authenticated: false,
      access: { a2: false, a3: false, a4: false },
      highestA2DayUnlocked: 1,
      canonicalNextPath: '/despega/conozcamonos-1',
    })
  }

  return resolveLegacyContinuityDestination({
    authenticated: true,
    access: journey.access,
    highestA2DayUnlocked: journey.state.highestA2DayUnlocked,
    canonicalNextPath: await getCanonicalNextPath(journey.profile),
  })
}
