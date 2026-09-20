'use client'

import { useRouter } from 'next/navigation'
import { A3InterviewOutcomeForm } from '@/components/outcomes/a3-interview-outcome-form'

export default function A3OutcomeBaselinePage() {
  const router = useRouter()
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-10">
      <A3InterviewOutcomeForm
        role="baseline"
        onSaved={() => window.setTimeout(() => router.push('/despega/a3?outcomeBaseline=done'), 900)}
      />
    </main>
  )
}
