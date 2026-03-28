import { useCallback } from 'react'

export type EngagementAction = 
  | 'view_radar'
  | 'read_news'
  | 'save_news'
  | 'view_test'
  | 'complete_test'
  | 'save_resource'
  | 'view_resource'
  | 'view_personalized'

export interface EngagementEvent {
  userId: string
  action: EngagementAction
  section: string
  points: number
  completed: boolean
  metadata?: Record<string, any>
}

const POINTS_MAP: Record<EngagementAction, number> = {
  'view_radar': 5,
  'read_news': 10,
  'save_news': 15,
  'view_test': 10,
  'complete_test': 50,
  'save_resource': 15,
  'view_resource': 10,
  'view_personalized': 5,
}

export function useA4Engagement(userId: string | undefined) {
  const trackEngagement = useCallback(
    async (action: EngagementAction, section: string, metadata?: Record<string, any>) => {
      if (!userId) return

      try {
        const points = POINTS_MAP[action]
        const response = await fetch('/api/despega/engagement', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            action,
            section,
            points,
            completed: true,
            metadata,
          }),
        })

        if (!response.ok) throw new Error('Failed to track engagement')

        return await response.json()
      } catch (error) {
        console.error('[v0] Error tracking engagement:', error)
      }
    },
    [userId]
  )

  return { trackEngagement }
}
