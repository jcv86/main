import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { phaseMetadata } from '@/lib/phase-metadata'
import { createAdminClient } from '@/lib/supabase/server'
import { getJourneyForCurrentUser } from '@/lib/journey/service'
import {
  recordJourneyTransition,
  repairLegacyC2Completion,
} from '@/lib/journey/transitions'

export const metadata: Metadata = {
  title: phaseMetadata.a1Report.title,
  description: phaseMetadata.a1Report.description,
  openGraph: {
    title: phaseMetadata.a1Report.title,
    description: phaseMetadata.a1Report.description,
  },
}

export default async function A1ReportLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const journey = await getJourneyForCurrentUser()
  if (!journey) redirect('/auth/signin')

  await repairLegacyC2Completion(journey.user.id)

  const supabase = createAdminClient()
  const { data: profile, error } = await supabase
    .from('despega_user_profiles')
    .select(
      'conozcamonos_2_completed, onboarding_conozcamonos_2_completed, a2_route_generated',
    )
    .eq('user_id', journey.user.id)
    .maybeSingle()

  if (error) throw error
  const c2Completed = Boolean(
    profile?.conozcamonos_2_completed ||
      profile?.onboarding_conozcamonos_2_completed ||
      profile?.a2_route_generated,
  )
  if (!c2Completed) redirect('/despega/conozcamonos-2')

  try {
    await recordJourneyTransition(journey.user.id, 'a1_report')
  } catch {
    redirect('/despega/a1-cerebral')
  }

  return children
}
