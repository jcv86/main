'use client'

import { useRouter } from 'next/navigation'
import { A1ProfessionalClarityForm } from '@/components/outcomes/a1-professional-clarity-form'

export default function A1OutcomeBaselinePage() {
  const router = useRouter()

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-10">
      <A1ProfessionalClarityForm
        role="baseline"
        continueLabel="Continuar al análisis de A1"
        onSaved={() => router.push('/despega/a1-cerebral-intro')}
      />
    </main>
  )
}
