import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { SupabaseCareerService } from '@/lib/career/supabase-career-service'
import { loadA1Report } from '@/lib/reports/user-report-data'
import { IdentityOverview } from '@/components/career/identity-overview'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Identidad profesional | DespegaTuCarrera',
  description: 'Preferencias, objetivos y evidencia de tu recorrido profesional.',
  robots: { index: false, follow: false },
}

export default async function CareerIdentityPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) redirect('/auth/signin?next=/despega/career-identity')
  const admin = createAdminClient()
  const { data: accessRows, error: accessError } = await admin.rpc('resolve_pilot_access', { p_user_id: user.id, p_claim_id: null })
  if (accessError) throw new Error('No pudimos verificar tu acceso.')
  const access = Array.isArray(accessRows) ? accessRows[0] : accessRows
  if (!access?.allowed) return <section role="status" className="rounded-2xl border border-border p-6"><h1 className="text-2xl font-semibold">Acceso piloto requerido</h1><p className="mt-3 text-muted-foreground">Tu sesión está activa, pero esta cuenta todavía no tiene acceso a la experiencia piloto. No se ha consultado tu identidad profesional.</p></section>
  const career = new SupabaseCareerService(supabase)
  const [identity, a1] = await Promise.all([career.getIdentity(user.id), loadA1Report(user.id)])
  // No ensureIdentity on reads: opening this page must not create or repair personal records.
  const context = identity ? await career.getContext(user.id) : null
  return <IdentityOverview a1={a1} context={context} />
}
