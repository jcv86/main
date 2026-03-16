'use client'

// DEPRECATED: This route has been superseded by /despega/a1-cerebral
// The A1 Cerebral Assessment is the correct Despega Cerebral evaluation
// Redirecting to the correct route...

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DiscAssessmentPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the correct A1 Cerebral Assessment route
    router.push('/despega/a1-cerebral')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Redireccionando...</h1>
        <p className="text-slate-600">Estás siendo redirigido a la evaluación correcta</p>
      </div>
    </div>
  )
}
