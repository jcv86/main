'use client'

import { useRouter } from 'next/navigation'
import { A2ExecutionOutcomeForm } from '@/components/outcomes/a2-execution-outcome-form'

export default function A2OutcomeFollowUpPage() {
  const router = useRouter()
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-10">
      <A2ExecutionOutcomeForm role="follow_up" onSaved={() => undefined} />
      <button type="button" onClick={() => router.push('/despega/a2')} className="mt-6 text-sm text-muted-foreground underline underline-offset-4">
        Volver a Tu Ruta
      </button>
    </main>
  )
}
