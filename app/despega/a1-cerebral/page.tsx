'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'

export default function A1CerebralPage() {
  const router = useRouter()
  const { user, loading } = useAuthRedirect()

  useEffect(() => {
    if (!loading && user) {
      router.replace('/despega/a1-report')
    }
  }, [loading, user, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <p className="text-muted-foreground">Cargando tu evaluación...</p>
      </div>
    </div>
  )
}
