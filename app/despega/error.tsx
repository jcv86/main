'use client'

import { useEffect } from 'react'

import { ErrorState } from '@/components/layout/async-state'
import { PageContainer, PageStack } from '@/components/layout/page-foundation'

export default function DespegaError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Despega route error', error)
  }, [error])

  return (
    <PageContainer>
      <PageStack>
        <ErrorState
          title="No pudimos abrir esta parte de tu recorrido"
          description="Puedes intentarlo nuevamente. Tu progreso guardado no se perdió."
          onRetry={reset}
        />
      </PageStack>
    </PageContainer>
  )
}
