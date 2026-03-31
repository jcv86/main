// V1 Analytics Hook - Centralizado para trackear eventos
// Uso: const { trackEvent } = useV1Analytics(); trackEvent('c1_started', { ... })

'use client'

import { useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { V1AnalyticsEvent, V1EventType } from './types'

// Generate session ID on first use
const getSessionId = () => {
  if (typeof window === 'undefined') return ''
  let sessionId = sessionStorage.getItem('v1_session_id')
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem('v1_session_id', sessionId)
  }
  return sessionId
}

export const useV1Analytics = () => {
  const pathname = usePathname()

  const trackEvent = useCallback((event: V1EventType, metadata?: Record<string, any>) => {
    const sessionId = getSessionId()
    
    // Determine stage from pathname
    const stage = pathname.includes('/a1') ? 'a1'
      : pathname.includes('/a2') ? 'a2'
      : pathname.includes('/a3') ? 'a3'
      : pathname.includes('/a4') ? 'a4'
      : pathname.includes('/conozcamonos') ? 'c1'
      : 'cross'

    const analyticsEvent: V1AnalyticsEvent = {
      event,
      stage: stage as any,
      timestamp: new Date().toISOString(),
      sessionId,
      metadata: {
        timeOnPage: sessionStorage.getItem(`${stage}_page_start`) 
          ? Date.now() - parseInt(sessionStorage.getItem(`${stage}_page_start`) || '0')
          : 0,
        deviceType: typeof window !== 'undefined' && window.innerWidth < 768 ? 'mobile' : 'desktop',
        ...metadata
      }
    }

    // Send to analytics endpoint
    if (typeof window !== 'undefined') {
      fetch('/api/v1-analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(analyticsEvent)
      }).catch(err => console.warn('[v0] Analytics event failed:', err))

      // Also log locally for debugging
      console.log('[v0] [ANALYTICS]', event, analyticsEvent)
    }
  }, [pathname])

  const trackPageView = useCallback(() => {
    const stage = pathname.includes('/a1') ? 'a1'
      : pathname.includes('/a2') ? 'a2'
      : pathname.includes('/a3') ? 'a3'
      : pathname.includes('/a4') ? 'a4'
      : pathname.includes('/conozcamonos') ? 'c1'
      : 'cross'
    
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(`${stage}_page_start`, Date.now().toString())
    }
  }, [pathname])

  return { trackEvent, trackPageView }
}

// Convenience hook to track stage entry
export const useTrackStageEntry = (stage: 'c1' | 'a1' | 'a2' | 'a3' | 'a4') => {
  const { trackEvent, trackPageView } = useV1Analytics()

  return useCallback(() => {
    trackPageView()
    const eventMap = {
      c1: 'c1_started' as V1EventType,
      a1: 'a1_intro_viewed' as V1EventType,
      a2: 'a2_intro_viewed' as V1EventType,
      a3: 'a3_page_viewed' as V1EventType,
      a4: 'a4_page_viewed' as V1EventType,
    }
    trackEvent(eventMap[stage])
  }, [trackEvent, trackPageView])
}
