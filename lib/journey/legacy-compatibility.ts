import 'server-only'

import { loadJourneyFlow } from './flow-service'
import { getJourneyForCurrentUser } from './service'

/**
 * Resolve old C1-C4 / pillar URLs into the same canonical resume action used
 * by the dashboard and journey map. Legacy routes must not maintain their own
 * stage-priority rules because A2/A3 checkpoints can be concurrently available.
 */
export async function getLegacyJourneyDestination(): Promise<string> {
  const journey = await getJourneyForCurrentUser()
  if (!journey) return '/auth/signin'

  const flow = await loadJourneyFlow(journey)
  return flow.next.href
}
