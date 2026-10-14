'use client'

import { useRouter } from 'next/navigation'
import { PageContainer, PageStack } from '@/components/layout/page-foundation'
import { A1ProfessionalClarityForm } from '@/components/outcomes/a1-professional-clarity-form'

export default function A1OutcomeFollowUpPage() {
  const router = useRouter()

  return (
    <PageContainer className="max-w-3xl">
      <PageStack>
        <A1ProfessionalClarityForm
          role="follow_up"
          continueLabel="Continuar a Tu Ruta"
          onSaved={() => router.push('/despega/a2/intro')}
        />
      </PageStack>
    </PageContainer>
  )
}
