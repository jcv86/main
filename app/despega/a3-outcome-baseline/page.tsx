'use client'

import { useRouter } from 'next/navigation'
import { A3InterviewOutcomeForm } from '@/components/outcomes/a3-interview-outcome-form'
import { PageContainer } from '@/components/layout/page-foundation'

export default function A3OutcomeBaselinePage() {
  const router = useRouter()
  return (
    <PageContainer className="max-w-3xl">
      <A3InterviewOutcomeForm
        role="baseline"
        continueLabel="Volver a Entrenamiento"
        onSaved={() => router.push('/despega/a3?outcomeBaseline=done')}
      />
    </PageContainer>
  )
}
