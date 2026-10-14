'use client'

import { useRouter } from 'next/navigation'
import { PageContainer, PageStack } from '@/components/layout/page-foundation'
import { A3InterviewOutcomeForm } from '@/components/outcomes/a3-interview-outcome-form'

export default function A3OutcomeFollowUpPage() {
  const router = useRouter()
  return (
    <PageContainer className="max-w-3xl">
      <PageStack>
        <A3InterviewOutcomeForm
          role="follow_up"
          continueLabel="Volver a Entrenamiento"
          onSaved={() => router.push('/despega/a3')}
        />
      </PageStack>
    </PageContainer>
  )
}
