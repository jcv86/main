'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface XPGainEvent {
  action: string
  xp: number
  multiplier?: number
  total_xp?: number
  level_up?: boolean
  new_level?: number
}

export function useXPTracking() {
  const supabase = createClient()
  const [xpEvent, setXPEvent] = useState<XPGainEvent | null>(null)

  const recordXPGain = async (
    userEmail: string,
    action: string,
    xp: number,
    multiplier: number = 1
  ) => {
    try {
      // Call API to record XP gain
      const response = await fetch('/api/gamification/xp-gain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail,
          action,
          xp,
          multiplier,
        })
      })

      if (response.ok) {
        const result = await response.json()
        
        // Show XP popup
        setXPEvent({
          action,
          xp: result.xp_gained,
          multiplier: result.multiplier,
          total_xp: result.total_xp,
          level_up: result.level_up,
          new_level: result.new_level
        })

        // Auto-hide after 4 seconds
        setTimeout(() => setXPEvent(null), 4000)
      }
    } catch (error) {
      console.error('[v0] Error recording XP gain:', error)
    }
  }

  return { recordXPGain, xpEvent, clearXPEvent: () => setXPEvent(null) }
}
