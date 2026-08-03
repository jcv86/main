import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { phaseMetadata } from '@/lib/phase-metadata'
import { createAdminClient } from '@/lib/supabase/server'
import { getJourneyForCurrentUser } from '@/lib/journey/service'
import { repairLegacyC2Completion } from '@/lib/journey/transitions'

export const metadata: Metadata = {
  title: phaseMetadata.c2.title,
  description: phaseMetadata.c2.description,
  openGraph: {
    title: phaseMetadata.c2.title,
    description: phaseMetadata.c2.description,
  },
}

export default async function Conozcamonos2Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const journey = await getJourneyForCurrentUser()
  if (!journey) redirect('/auth/signin')

  const supabase = createAdminClient()
  const [profileResult, assessmentResult] = await Promise.all([
    supabase
      .from('despega_user_profiles')
      .select(
        'onboarding_conozcamonos_1_completed, onboarding_completed, a1_report_seen, conozcamonos_2_completed, onboarding_conozcamonos_2_completed, a2_route_generated',
      )
      .eq('user_id', journey.user.id)
      .maybeSingle(),
    supabase
      .from('a1_cerebral_assessment')
      .select('user_id')
      .eq('user_id', journey.user.id)
      .order('completed_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  if (profileResult.error || assessmentResult.error) {
    throw profileResult.error || assessmentResult.error
  }

  const profile = profileResult.data
  const c1Completed = Boolean(
    profile?.onboarding_conozcamonos_1_completed || profile?.onboarding_completed,
  )
  if (!c1Completed) redirect('/despega/conozcamonos-1')
  if (!assessmentResult.data) redirect('/despega/a1-cerebral')

  const legacyC2 = Boolean(
    profile?.onboarding_conozcamonos_2_completed || profile?.a2_route_generated,
  )
  if (legacyC2 && !profile?.conozcamonos_2_completed) {
    await repairLegacyC2Completion(journey.user.id)
  }

  const c2Completed = Boolean(profile?.conozcamonos_2_completed || legacyC2)
  if (c2Completed) {
    redirect(profile?.a1_report_seen ? '/despega/a2/intro' : '/despega/a1-report')
  }

  return children
}
