import { resolveServerUser } from '@/lib/auth/server-user'
import { requireJourneyModule } from '@/lib/journey/service'
import {
  markA3JourneyVisited,
  repairLegacyC2Completion,
} from '@/lib/journey/transitions'

export default async function A3Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser = await resolveServerUser()
  if (currentUser) await repairLegacyC2Completion(currentUser.id)

  const journey = await requireJourneyModule('A3')
  await markA3JourneyVisited(journey.user.id)

  return <div className="min-h-screen">{children}</div>
}
