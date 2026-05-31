'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePillarAccess } from '@/hooks/use-pillar-access'
import type { PillarName } from '@/hooks/use-pillar-access'

interface PillarGateProps {
  requiredPillar: PillarName
  fallbackPath?: string
  children: React.ReactNode
}

/**
 * Component that gates content access by pillar completion
 * Redirects to onboarding if user hasn't completed prerequisites
 */
export function PillarGate({
  requiredPillar,
  fallbackPath = '/despega/conozcamonos-1',
  children,
}: PillarGateProps) {
  const router = useRouter()
  const { canAccessPillar, loading, error } = usePillarAccess()

  useEffect(() => {
    if (loading) return

    if (!canAccessPillar(requiredPillar)) {
      console.log(`[v0] User cannot access pillar ${requiredPillar}, redirecting to ${fallbackPath}`)
      router.push(fallbackPath)
    }
  }, [loading, requiredPillar, canAccessPillar, router, fallbackPath])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <p className="text-destructive font-semibold">Error verificando acceso</p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    )
  }

  if (!canAccessPillar(requiredPillar)) {
    return null // Component will redirect via useEffect
  }

  return <>{children}</>
}
