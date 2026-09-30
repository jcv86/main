'use client'

import { useRouter } from 'next/navigation'
import { A2ExecutionOutcomeForm } from '@/components/outcomes/a2-execution-outcome-form'
import { PageContainer } from '@/components/layout/page-foundation'

export default function A2OutcomeBaselinePage() {
  const router = useRouter()
  return (
    <PageContainer className="max-w-3xl">
      <A2ExecutionOutcomeForm role="baseline" onSaved={() => window.setTimeout(() => router.push('/despega/a2'), 900)} />
    </PageContainer>
  )
}
