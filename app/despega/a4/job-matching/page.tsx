import { Metadata } from 'next'
import { JobMatchingResults } from './job-matching-results'
import { SearchIntentForm } from './search-intent-form'
import { createClient } from '@/lib/supabase/server'
import { resolveServerUser } from '@/lib/auth/server-user'

export const metadata: Metadata = {
  title: 'Oportunidades para ti - A4 | Despega Tu Carrera',
  description: 'Oportunidades laborales reales explicadas con la evidencia disponible en tu recorrido.',
}

export default async function JobMatchingPage() {
  const user = await resolveServerUser()
  let seedRole: string | null = null
  if (user) {
    const supabase = await createClient()
    const { data } = await supabase.from('career_identities').select('target_roles').eq('user_id', user.id).maybeSingle()
    const roles = Array.isArray(data?.target_roles) ? data.target_roles : []
    seedRole = typeof roles[0] === 'string' ? roles[0] : null
  }
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">A4 · Oportunidades</p>
          <h1 className="mt-2 text-4xl font-bold text-slate-900">Trabajos que vale la pena revisar</h1>
          <p className="mt-3 max-w-3xl text-lg text-slate-600">
            Priorizamos publicaciones trazables y explicamos la evidencia disponible. Una recomendación no garantiza encaje, entrevista ni oferta.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="font-semibold text-slate-900">Evidencia, no un porcentaje mágico</p>
            <p className="mt-2 text-sm text-slate-600">Separamos requisitos respaldados, parciales, faltantes y desconocidos.</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="font-semibold text-slate-900">Publicación original</p>
            <p className="mt-2 text-sm text-slate-600">Una oportunidad sólo debe recomendarse si existe una fuente original trazable y vigente.</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="font-semibold text-slate-900">LinkedIn + fuentes verificables</p>
            <p className="mt-2 text-sm text-slate-600">LinkedIn es una fuente objetivo. No afirmamos cobertura completa hasta contar con una vía autorizada y verificable.</p>
          </div>
        </div>
        <SearchIntentForm seedRole={seedRole} />
        <div className="mt-10"><JobMatchingResults /></div>
      </div>
    </main>
  )
}
