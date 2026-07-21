import { redirect } from 'next/navigation'
import { getCanonicalNextPath, getJourneyForCurrentUser } from '@/lib/journey/service'

export default async function DespegaEntryPage() {
  const journey = await getJourneyForCurrentUser()

  if (!journey) {
    redirect('/sign-in')
  }

  const nextRequiredPath = await getCanonicalNextPath(journey.profile)
  const onboardingComplete = Boolean(
    journey.profile.a2_route_generated || journey.profile.a2_unlocked,
  )

  redirect(onboardingComplete ? '/despega/dashboard' : nextRequiredPath)
}
