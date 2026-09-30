'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PageContainer, PageStack } from '@/components/layout/page-foundation'
import { A2ExecutionOutcomeForm } from '@/components/outcomes/a2-execution-outcome-form'

export default function A2OutcomeFollowUpPage() {
  const router = useRouter()
  const [completed, setCompleted] = useState(false)
  return (
    <PageContainer className="max-w-3xl">
      <PageStack>
        <A2ExecutionOutcomeForm role="follow_up" onSaved={() => setCompleted(true)} />
        <Button type="button" onClick={() => router.push('/despega/a2')} disabled={!completed} className="w-full">
          {completed ? 'Volver a Tu Ruta' : 'Guarda la medición para continuar'}
        </Button>
      </PageStack>
    </PageContainer>
  )
}
