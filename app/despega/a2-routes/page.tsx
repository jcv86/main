import { redirect } from 'next/navigation'
import { resolveServerUser } from '@/lib/auth/server-user'
import { createAdminClient } from '@/lib/supabase/server'
import { repairLegacyC2Completion } from '@/lib/journey/transitions'

/** Compatibility bridge for old bookmarks and callbacks. */
export default async function LegacyA2RoutesPage() {
  const currentUser = await resolveServerUser()
  if (!currentUser) redirect('/auth/signin')

  await repairLegacyC2Completion(currentUser.id)

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('despega_user_profiles')
    .select('conozcamonos_2_completed, a1_report_seen, a2_intro_seen')
    .eq('user_id', currentUser.id)
    .maybeSingle()

  if (error) throw error
  if (!data?.conozcamonos_2_completed) redirect('/despega/conozcamonos-2')
  if (!data.a1_report_seen) redirect('/despega/a1-report')
  if (!data.a2_intro_seen) redirect('/despega/a2/intro')
  redirect('/despega/a2')
}
