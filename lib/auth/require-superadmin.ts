import 'server-only'

import { redirect } from 'next/navigation'

import { createAdminClient, createClient } from '@/lib/supabase/server'

export async function getSuperadminUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) return null

  const admin = createAdminClient()
  const { data: role, error: roleError } = await admin
    .from('user_roles_extended')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle()

  if (roleError || role?.role !== 'superadmin') return null
  return user
}

export async function requireSuperadminPage(nextPath = '/admin') {
  const user = await getSuperadminUser()
  if (!user) redirect(`/auth/signin?next=${encodeURIComponent(nextPath)}`)
  return user
}
