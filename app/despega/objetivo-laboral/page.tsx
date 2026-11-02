import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { OpportunitySearchExperience } from '@/app/despega/a4/job-matching/opportunity-search-experience'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Tu objetivo laboral | DespegaTuCarrera',
  description: 'Define o explora tu objetivo laboral y recupéralo después en el Radar.',
  robots: { index: false, follow: false },
}

export default async function LaborObjectivePage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) redirect('/auth/signin?next=/despega/objetivo-laboral')
  const admin = createAdminClient()
  const { data, error: accessError } = await admin.rpc('resolve_pilot_access', { p_user_id: user.id, p_claim_id: null })
  if (accessError) throw new Error('No pudimos verificar tu acceso.')
  const access = Array.isArray(data) ? data[0] : data
  if (access?.allowed !== true) return <section role="status" className="rounded-2xl border border-border p-6"><h1 className="text-2xl font-semibold">Acceso piloto requerido</h1><p className="mt-3 text-muted-foreground">Tu sesión está activa, pero esta cuenta todavía no tiene acceso a la experiencia piloto. No se ha consultado tu objetivo laboral.</p></section>
  return <article className="mx-auto w-full max-w-4xl space-y-6 py-6">
    <header className="space-y-3"><h1 className="text-3xl font-semibold tracking-tight">Tu próximo paso laboral</h1><p className="text-muted-foreground">Puedes guardar lo que buscas ahora y editarlo después. Cuando llegues al Radar, recuperaremos el mismo objetivo.</p><p className="text-sm text-muted-foreground">Este paso es opcional. Si tu recorrido se centra en un objetivo personal, puedes continuar sin definir un cargo laboral.</p></header>
    <OpportunitySearchExperience mode="objective" />
    <Link href="/despega/recorrido" className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Continuar mi recorrido</Link>
  </article>
}
