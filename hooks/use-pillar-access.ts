'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export type PillarName = 'a1' | 'a2' | 'a3' | 'a4'

export interface PillarAccessStatus {
  completedPillars: PillarName[]
  canAccess: {
    a1: boolean
    a2: boolean
    a3: boolean
    a4: boolean
  }
  loading: boolean
  error: string | null
}

/**
 * Hook to check user's pillar access status
 * Fetches from /api/auth/pillar-status
 */
export function usePillarAccess() {
  const router = useRouter()
  const supabase = createClient()
  const [status, setStatus] = useState<PillarAccessStatus>({
    completedPillars: [],
    canAccess: { a1: false, a2: false, a3: false, a4: false },
    loading: true,
    error: null,
  })

  useEffect(() => {
    const checkPillarAccess = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          setStatus(prev => ({
            ...prev,
            loading: false,
            error: 'Not authenticated',
          }))
          return
        }

        const response = await fetch('/api/auth/pillar-status', {
          method: 'GET',
          credentials: 'include',
        })

        if (!response.ok) {
          throw new Error('Failed to fetch pillar status')
        }

        const data = await response.json()
        setStatus({
          completedPillars: data.completedPillars || [],
          canAccess: data.canAccess || { a1: true, a2: false, a3: false, a4: false },
          loading: false,
          error: null,
        })
      } catch (error) {
        console.error('[v0] Error checking pillar access:', error)
        setStatus(prev => ({
          ...prev,
          loading: false,
          error: String(error),
        }))
      }
    }

    checkPillarAccess()
  }, [supabase])

  const canAccessPillar = (pillar: PillarName): boolean => {
    return status.canAccess[pillar] ?? false
  }

  const redirectIfNoAccess = (pillar: PillarName, redirectPath = '/despega/conozcamonos-1') => {
    if (!canAccessPillar(pillar)) {
      router.push(redirectPath)
    }
  }

  return {
    ...status,
    canAccessPillar,
    redirectIfNoAccess,
  }
}
