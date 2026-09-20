'use client'

import { useRouter } from 'next/navigation'
import { A1ProfessionalClarityForm } from '@/components/outcomes/a1-professional-clarity-form'

export default function A1OutcomeFollowUpPage() {
  const router = useRouter()

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-10">
      <A1ProfessionalClarityForm
        role="follow_up"
        onSaved={() => undefined}
      />
      <button
        type="button"
        onClick={() => router.push('/despega/conozcamonos-2')}
        className="mt-6 text-sm text-white/60 underline underline-offset-4"
      >
        Continuar cuando termines la medición
      </button>
    </main>
  )
}
