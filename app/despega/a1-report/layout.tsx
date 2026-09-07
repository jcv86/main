import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { A1CanonicalReport } from '@/components/a1-canonical-report'
import { phaseMetadata } from '@/lib/phase-metadata'
import { createAdminClient } from '@/lib/supabase/server'
import { getJourneyForCurrentUser } from '@/lib/journey/service'
import { recordJourneyTransition, repairLegacyC2Completion } from '@/lib/journey/transitions'
import { loadA1ReportBundle } from '@/lib/reports/user-report-data'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: phaseMetadata.a1Report.title, description: phaseMetadata.a1Report.description,
  robots: { index: false, follow: false },
  openGraph: { title: phaseMetadata.a1Report.title, description: phaseMetadata.a1Report.description },
}

export default async function A1ReportLayout({ children: _children }: { children: React.ReactNode }) {
  const journey = await getJourneyForCurrentUser()
  if (!journey) redirect('/auth/signin?next=/despega/a1-report')
  await repairLegacyC2Completion(journey.user.id)
  const admin = createAdminClient()
  const [profileResult, bundle] = await Promise.all([
    admin.from('despega_user_profiles').select('conozcamonos_2_completed,a2_route_generated').eq('user_id', journey.user.id).maybeSingle(),
    loadA1ReportBundle(journey.user.id),
  ])
  if (profileResult.error) throw new Error('No pudimos verificar tu recorrido.')
  if (!bundle) redirect('/despega/a1-cerebral')
  const profile = profileResult.data
  if (!(profile?.conozcamonos_2_completed || profile?.a2_route_generated) || !bundle.c2?.responses) redirect('/despega/conozcamonos-2')
  const report = bundle.report
  // Reviewing an honestly ambiguous profile is valid. Invalid/mismatched evidence is not.
  if (report.reviewable) {
    await recordJourneyTransition(journey.user.id, 'a1_report')
  }
  return <A1CanonicalReport report={report} />
}
