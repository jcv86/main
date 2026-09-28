'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PageContainer, PageStack } from '@/components/layout/page-foundation'
import { A1ProfessionalClarityForm } from '@/components/outcomes/a1-professional-clarity-form'

export default function A1OutcomeFollowUpPage() {
  const router = useRouter()
  const [followUpCompleted, setFollowUpCompleted] = useState(false)

  return (
    <PageContainer className="max-w-3xl">
      <PageStack>
        <A1ProfessionalClarityForm
          role="follow_up"
          onSaved={() => setFollowUpCompleted(true)}
        />
        <Button
          type="button"
          onClick={() => router.push('/despega/a2/intro')}
          disabled={!followUpCompleted}
          className="w-full"
        >
          {followUpCompleted ? 'Continuar a Tu Ruta' : 'Guarda la medición para continuar'}
        </Button>
      </PageStack>
    </PageContainer>
  )
}
