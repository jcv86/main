'use client'

import { useRouter } from 'next/navigation'
import { PageContainer, PageStack } from '@/components/layout/page-foundation'
import { A2ExecutionOutcomeForm } from '@/components/outcomes/a2-execution-outcome-form'

export default function A2OutcomeFollowUpPage() {
  const router = useRouter()
  return (
    <PageContainer className="max-w-3xl">
      <PageStack>
        <A2ExecutionOutcomeForm
          role="follow_up"
          continueLabel="Volver a Tu Ruta"
          onSaved={() => router.push('/despega/a2')}
        />
      </PageStack>
    </PageContainer>
  )
}
