import { redirect } from 'next/navigation'

import { createAdminClient, createClient } from '@/lib/supabase/server'
import { PilotInvitationForm } from './pilot-invitation-form'

export default async function PilotInvitationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/signin?next=/admin/pilot-invitations')

  const admin = createAdminClient()
  const { data: role } = await admin
    .from('user_roles_extended')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle()

  if (role?.role !== 'superadmin') redirect('/dashboard')

  return (
    <section className="mx-auto w-full max-w-2xl px-5 py-12 sm:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan">Administración del piloto</p>
      <h1 className="mt-2 text-3xl font-bold">Enviar una invitación</h1>
      <p className="mt-3 text-muted-foreground">
        Crea un acceso personal, de un solo uso y válido con vigencia de siete días.
      </p>
      <PilotInvitationForm />
    </section>
  )
}
