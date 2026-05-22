'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ValueMiningLabRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to choice page
    router.replace('/despega/a3/value-mining-lab-choice')
  }, [router])

  return (
    <div className="min-h-screen bg-black/95 flex items-center justify-center">
      <div className="text-center">
        <p className="text-white/60">Cargando...</p>
      </div>
    </div>
  )
}
