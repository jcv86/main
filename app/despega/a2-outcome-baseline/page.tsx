'use client'

import { useRouter } from 'next/navigation'
import { A2ExecutionOutcomeForm } from '@/components/outcomes/a2-execution-outcome-form'

export default function A2OutcomeBaselinePage() {
  const router = useRouter()
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-10">
      <A2ExecutionOutcomeForm role="baseline" onSaved={() => window.setTimeout(() => router.push('/despega/a2'), 900)} />
    </main>
  )
}
