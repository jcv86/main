import { Metadata } from 'next'
import { OpportunitySearchExperience } from './opportunity-search-experience'
import { createClient } from '@/lib/supabase/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import { PageContainer, PageHeader, PageStack } from '@/components/layout/page-foundation'

export const metadata: Metadata = {
  title: 'Oportunidades para ti - A4 | Despega Tu Carrera',
  description: 'Encuentra oportunidades laborales alineadas con lo que estás buscando.',
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
          eyebrow="Oportunidades"
          title="Encuentra tu próximo trabajo"
          description="Cuéntanos qué estás buscando y te mostraremos oportunidades que puedan interesarte."
        />
        <OpportunitySearchExperience seedRole={seedRole} />
      </PageStack>
    </PageContainer>
  )
}
