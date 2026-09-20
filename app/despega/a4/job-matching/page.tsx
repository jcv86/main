import { Metadata } from 'next'
import { OpportunitySearchExperience } from './opportunity-search-experience'
import { createClient } from '@/lib/supabase/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import { PageContainer, PageHeader, PageSection, PageStack } from '@/components/layout/page-foundation'
import { Badge } from '@/components/ui/badge'
import { Compass, SearchCheck, ShieldCheck } from 'lucide-react'

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
    <PageContainer className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <PageStack>
        <PageHeader
          eyebrow="A4 · Radar Estratégico"
          title="Oportunidades que merecen tu atención"
          description="Define hacia dónde quieres moverte. DTC contrasta esa intención con publicaciones vigentes y conserva la fuente original para que decidas con evidencia."
          actions={<Badge variant="outline" className="border-border bg-card text-muted-foreground">Beta · Fuentes verificables</Badge>}
        />

        <PageSection>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(var(--dtc-indigo-900))] text-white"><Compass className="h-5 w-5"/></div>
              <p className="font-semibold tracking-tight text-foreground">Tú marcas la dirección</p>
              <p className="mt-1.5 text-sm leading-6 text-muted-foreground">La búsqueda nace de los cargos y condiciones que confirmas, no de una categoría impuesta por un portal.</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(var(--dtc-indigo-900))] text-white"><SearchCheck className="h-5 w-5"/></div>
              <p className="font-semibold tracking-tight text-foreground">Relevancia antes que volumen</p>
              <p className="mt-1.5 text-sm leading-6 text-muted-foreground">Si no encontramos evidencia suficiente de relación con tu búsqueda, preferimos mostrar cero resultados.</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(var(--dtc-indigo-900))] text-white"><ShieldCheck className="h-5 w-5"/></div>
              <p className="font-semibold tracking-tight text-foreground">Fuente trazable</p>
              <p className="mt-1.5 text-sm leading-6 text-muted-foreground">Cada oportunidad conserva su publicación original y su estado de vigencia. Sin fuente verificable, no la recomendamos.</p>
            </div>
          </div>
        </PageSection>

        <OpportunitySearchExperience seedRole={seedRole} />
      </PageStack>
    </PageContainer>
  )
}
