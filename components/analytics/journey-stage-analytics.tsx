'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useV1Analytics } from '@/lib/v1-analytics/use-v1-analytics'
import type { V1EventType } from '@/lib/v1-analytics/types'

type FunnelStage = 'a1' | 'a2' | 'a3' | 'a4'

const STAGE_EVENT: Record<FunnelStage, V1EventType> = {
  a1: 'a1_intro_viewed',
  a2: 'a2_dashboard_viewed',
  a3: 'a3_page_viewed',
  a4: 'a4_page_viewed',
}

function stageFromPath(pathname: string): FunnelStage | null {
  if (pathname.includes('/a1')) return 'a1'
  if (pathname.includes('/a2')) return 'a2'
  if (pathname.includes('/a3')) return 'a3'
  if (pathname.includes('/a4')) return 'a4'
  return null
}

export function JourneyStageAnalytics() {
  const pathname = usePathname()
  const { trackEvent, trackPageView } = useV1Analytics()

  useEffect(() => {
    const stage = stageFromPath(pathname)
    if (!stage || typeof window === 'undefined') return

    const seenKey = `v1_funnel_stage_seen_${stage}`
    if (sessionStorage.getItem(seenKey) === '1') return

    trackPageView()
    trackEvent(STAGE_EVENT[stage])
    sessionStorage.setItem(seenKey, '1')
  }, [pathname, trackEvent, trackPageView])

  return null
}
