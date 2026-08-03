import { redirect } from 'next/navigation'
import {
  getCanonicalNextPath,
  getJourneyForCurrentUser,
} from '@/lib/journey/service'

export default async function DespegaEntryPage() {
  const journey = await getJourneyForCurrentUser()

  if (!journey) {
    redirect('/auth/signin')
  }

  const nextRequiredPath = await getCanonicalNextPath(journey.profile)
  redirect(journey.access.a2 ? '/despega/dashboard' : nextRequiredPath)
}
