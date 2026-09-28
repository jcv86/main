import { Metadata } from 'next'
import { OpportunitySearchExperience } from './opportunity-search-experience'
import { createClient } from '@/lib/supabase/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import { PageContainer, PageHeader, PageStack } from '@/components/layout/page-foundation'
import { getLiveUserProfile } from '@/lib/a4/profile-snapshot'
import { Card, CardContent } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Oportunidades para ti - A4 | Despega Tu Carrera',
  description: 'Encuentra oportunidades laborales alineadas con lo que estás buscando.',
}

export default async function JobMatchingPage() {
  const user = await resolveServerUser()
  let seedRole: string | null = null
  let liveProfile = null
  if (user) {
    const supabase = await createClient()
    const { data } = await supabase.from('career_identities').select('target_roles').eq('user_id', user.id).maybeSingle()
    const roles = Array.isArray(data?.target_roles) ? data.target_roles : []
    seedRole = typeof roles[0] === 'string' ? roles[0] : null
    liveProfile = await getLiveUserProfile(user.id)
  }
  return (
    <PageContainer className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <PageStack>
        <PageHeader
          eyebrow="Oportunidades"
          title="Encuentra tu próximo trabajo"
          description="Cuéntanos qué estás buscando y te mostraremos oportunidades que puedan interesarte."
        />
        {liveProfile ? (
          <Card className="border-border bg-card shadow-sm">
            <CardContent className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-sm font-semibold text-foreground">Tu contexto de búsqueda</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Usamos lo aprendido en tu recorrido para darte contexto antes de abrir una oferta.
                  No asignamos un porcentaje de match sin evidencia explícita del cargo.
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  {liveProfile.targetRole ? (
                    <span className="rounded-full bg-muted px-3 py-1.5 text-foreground">
                      Objetivo: {liveProfile.targetRole}
                    </span>
                  ) : null}
                  <span className="rounded-full bg-muted px-3 py-1.5 text-foreground">
                    CV {liveProfile.cvReadiness}/100
                  </span>
                  <span className="rounded-full bg-muted px-3 py-1.5 text-foreground">
                    Entrevista {liveProfile.interviewReadiness}/100
                  </span>
                  <span className="rounded-full bg-muted px-3 py-1.5 text-foreground">
                    Postulación {liveProfile.applicationReadiness}/100
                  </span>
                </div>
              </div>
              <div className="max-w-md rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Antes de postular
                </p>
                <p className="mt-2 text-sm font-medium text-foreground">
                  {liveProfile.nextBestActions[0] || liveProfile.missingProof[0] || 'Revisa la oferta y confirma que puedes demostrar sus requisitos clave.'}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : null}
        <OpportunitySearchExperience seedRole={seedRole} />
      </PageStack>
    </PageContainer>
  )
}
