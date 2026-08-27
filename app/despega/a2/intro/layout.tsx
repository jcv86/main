import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/server'
import { getJourneyForCurrentUser } from '@/lib/journey/service'
import { repairLegacyC2Completion } from '@/lib/journey/transitions'

export default async function A2IntroLayout({
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
      'a1_report_seen, a2_intro_seen, conozcamonos_2_completed, a2_route_generated',
    )
    .eq('user_id', journey.user.id)
    .maybeSingle()

  if (error) throw error

  const c2Completed = Boolean(
    profile?.conozcamonos_2_completed || profile?.a2_route_generated,
  )
  if (!c2Completed) redirect('/despega/conozcamonos-2')
  if (!profile?.a1_report_seen) redirect('/despega/a1-report')
  if (profile?.a2_intro_seen) redirect('/despega/a2')

  return children
}
