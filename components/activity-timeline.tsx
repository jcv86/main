'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Zap, Flame, Trophy, Coins, BookOpen } from 'lucide-react'
import { formatXP, formatDTC } from '@/lib/gamification/calculations'

interface ActivityEvent {
  id: string
  type: 'xp_gain' | 'dtc_gain' | 'level_up' | 'badge_unlock' | 'milestone' | 'achievement'
  title: string
  description: string
  value: number
  icon: string
  timestamp: string
}

interface ActivityTimelineProps {
  userId?: string
  limit?: number
}

export function ActivityTimeline({ userId, limit = 10 }: ActivityTimelineProps) {
  const [activities, setActivities] = useState<ActivityEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const params = new URLSearchParams()
        if (userId) params.append('userId', userId)
        params.append('limit', limit.toString())

        const res = await fetch(`/api/gamification/activity-timeline?${params}`)
        if (!res.ok) throw new Error('Failed to fetch activities')

        const data = await res.json()
        setActivities(data.activities || [])
        setError(null)
      } catch (err) {
        console.error('[v0] Error fetching activity timeline:', err)
        setError('Failed to load activity history')
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [userId, limit])

  const getIcon = (type: string) => {
    switch (type) {
      case 'xp_gain':
        return <Zap className="h-4 w-4 text-purple-500" />
      case 'dtc_gain':
        return <Coins className="h-4 w-4 text-amber-500" />
      case 'level_up':
        return <Trophy className="h-4 w-4 text-yellow-500" />
      case 'badge_unlock':
        return <Flame className="h-4 w-4 text-red-500" />
      case 'milestone':
        return <BookOpen className="h-4 w-4 text-blue-500" />
      case 'achievement':
        return <Trophy className="h-4 w-4 text-green-500" />
      default:
        return <Zap className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'xp_gain':
        return 'bg-purple-50 border-purple-200'
      case 'dtc_gain':
        return 'bg-amber-50 border-amber-200'
      case 'level_up':
        return 'bg-yellow-50 border-yellow-200'
      case 'badge_unlock':
        return 'bg-red-50 border-red-200'
      case 'milestone':
        return 'bg-blue-50 border-blue-200'
      case 'achievement':
        return 'bg-green-50 border-green-200'
      default:
        return 'bg-muted border-muted'
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6 text-red-800">{error}</CardContent>
      </Card>
    )
  }

  if (!activities || activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
          <CardDescription>No activities yet</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8 text-muted-foreground">
          Start completing missions and interviews to see your activity here!
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Timeline</CardTitle>
        <CardDescription>Recent gamification events and rewards</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className={`flex items-start gap-4 p-4 rounded-lg border ${getTypeColor(activity.type)}`}
            >
              <div className="mt-1">{getIcon(activity.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm">{activity.title}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
              </div>
              <div className="flex-shrink-0 text-right">
                <div className="text-lg font-bold">
                  {activity.type === 'dtc_gain' ? '+' : ''}{activity.value}
                </div>
                <div className="text-xs text-muted-foreground">
                  {activity.type === 'xp_gain' && 'XP'}
                  {activity.type === 'dtc_gain' && 'DTC'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
