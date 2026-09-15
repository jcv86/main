import 'server-only'

import { getSharedJourneyContext } from '@/lib/journey/service'
import { buildVeraEvidencePack, type VeraEvidencePack } from './context-pack'

export type VeraToolId = 'journey_context'

export interface VeraToolResultMap {
  journey_context: VeraEvidencePack | null
}

/**
 * Server-owned Vera tool catalogue. Tools derive identity from the verified
 * server session; callers never provide a user id.
 */
export async function runVeraTool<T extends VeraToolId>(tool: T): Promise<VeraToolResultMap[T]> {
  switch (tool) {
    case 'journey_context': {
      const context = await getSharedJourneyContext()
      return (context ? buildVeraEvidencePack(context) : null) as VeraToolResultMap[T]
    }
    default: {
      const unreachable: never = tool
      throw new Error(`Unsupported Vera tool: ${String(unreachable)}`)
    }
  }
}
