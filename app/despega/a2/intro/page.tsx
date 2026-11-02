import { redirect } from 'next/navigation'
import { A2CanonicalIntro } from '@/components/a2-canonical-intro'
import { getJourneyForCurrentUser } from '@/lib/journey/service'
import { loadA1Report } from '@/lib/reports/user-report-data'
import { buildA2A1Orientation } from '@/lib/a2/a1-orientation'

export const dynamic = 'force-dynamic'

export default async function YourRouteIntroPage() {
  const journey = await getJourneyForCurrentUser()
  if (!journey) redirect('/auth/signin')

  const report = await loadA1Report(journey.user.id)
  if (!report) redirect('/despega/a1-cerebral')

  const orientation = buildA2A1Orientation(report)
  // Ties and compatible historical records remain reviewable. Missing, invalid
  // or incompatible evidence is reviewed in A1 instead of becoming a neutral score.
  if (!orientation.canContinue) redirect('/despega/a1-report')

  return <A2CanonicalIntro orientation={orientation} />
}
