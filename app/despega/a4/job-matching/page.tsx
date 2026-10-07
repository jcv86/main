import { Metadata } from 'next'
import { OpportunitySearchExperience } from './opportunity-search-experience'
import { resolveServerUser } from '@/lib/auth/server-user'
import { PageContainer, PageHeader, PageStack } from '@/components/layout/page-foundation'
import { loadA4JourneyContext } from '@/lib/a4/journey-context'
import { JourneyContextCard } from '@/components/a4/journey-context-card'

export const metadata: Metadata = {
  title: 'Oportunidades para ti - A4 | Despega Tu Carrera',
  description: 'Encuentra oportunidades laborales alineadas con lo que estás buscando.',
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
          description="Cuéntanos qué estás buscando y te mostraremos oportunidades que puedan interesarte."
        />
        {context && <JourneyContextCard context={context} compact />}
        <OpportunitySearchExperience
          seedRole={seedRole}
          profileEvidence={seedRole ? {
            targetRole: seedRole,
            strengths: [],
            missingProof: [],
            nextBestActions: [],
          } : null}
        />
      </PageStack>
    </PageContainer>
  )
}
