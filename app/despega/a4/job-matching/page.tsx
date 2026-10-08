import { Metadata } from 'next'
import { OpportunitySearchExperience } from './opportunity-search-experience'
import { resolveServerUser } from '@/lib/auth/server-user'
import { PageContainer, PageHeader, PageStack } from '@/components/layout/page-foundation'
import { loadA4JourneyContext } from '@/lib/a4/journey-context'
import { JourneyContextCard } from '@/components/a4/journey-context-card'

export const metadata: Metadata = {
  title: 'Oportunidades para ti - A4 | Despega Tu Carrera',
  description: 'Explora oportunidades y revisa sus cruces con tu CV, tu recorrido en DTC y tus preferencias de búsqueda.',
}

export default async function JobMatchingPage() {
  const user = await resolveServerUser()
  const context = user ? await loadA4JourneyContext(user.id) : null
  const seedRole = context?.identity.targetRole ?? null
  return (
    <PageContainer className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <PageStack>
        <PageHeader
          eyebrow="Oportunidades"
          title="Encuentra tu próximo trabajo"
          description="Explora ofertas y revisa por qué pueden interesarte, qué falta confirmar y cómo preparar tu siguiente paso."
        />
        {context && <JourneyContextCard context={context} compact />}
        <OpportunitySearchExperience seedRole={seedRole} />
      </PageStack>
    </PageContainer>
  )
}
