'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CareerMirrorModule() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the coaching session version
    router.replace('/despega/a3/career-mirror-coach')
  }, [router])

  return (
    <div className="min-h-screen bg-black/95 flex items-center justify-center">
      <div className="text-center">
        <p className="text-white/60">Cargando Espejo de Carrera...</p>
      </div>
    </div>
  )
}
