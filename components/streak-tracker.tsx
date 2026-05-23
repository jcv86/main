'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Flame, Calendar, Award } from 'lucide-react'

interface StreakData {
  current_streak: number
  longest_streak: number
  last_activity_date: string
  next_milestone: number
  days_until_milestone: number
  is_active_today: boolean
  activity_log: Array<{
    date: string
    active: boolean
  }>
}

interface StreakTrackerProps {
  userId?: string
}

export function StreakTracker({ userId }: StreakTrackerProps) {
  const [streak, setStreak] = useState<StreakData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const params = new URLSearchParams()
        if (userId) params.append('userId', userId)

        const res = await fetch(`/api/gamification/streak?${params}`)
        if (!res.ok) throw new Error('Failed to fetch streak')

        const data = await res.json()
        setStreak(data)
        setError(null)
      } catch (err) {
        console.error('[v0] Error fetching streak:', err)
        setError('Failed to load streak data')
      } finally {
        setLoading(false)
      }
    }

    fetchStreak()
  }, [userId])

  if (loading) {
    return <Card className="h-48 animate-pulse bg-muted" />
  }

  if (error) {
    return (
      <Card className="border-[rgb(80,160,170)]-200 bg-[rgba(80,160,170,0.5)]-50">
        <CardContent className="pt-6 text-[rgb(80,160,170)]-800">{error}</CardContent>
      </Card>
    )
  }

  if (!streak) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          No streak data available
        </CardContent>
      </Card>
    )
  }

  const streakPercentage = Math.min(100, (streak.current_streak / streak.next_milestone) * 100)
  const daysToMilestone = streak.days_until_milestone || 0

  return (
    <div className="space-y-6">
      {/* Main Streak Card */}
      <Card className="bg-gradient-to-br from-orange-50 via-red-50 to-amber-50 border-orange-300 overflow-hidden">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Flame className="h-6 w-6 text-orange-600 animate-pulse" />
                Daily Streak
              </CardTitle>
              <CardDescription>Keep the fire burning!</CardDescription>
            </div>
            {streak.is_active_today && (
              <Badge className="bg-green-600 text-white animate-pulse">Active Today</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Streak */}
          <div className="space-y-3">
            <div className="text-center">
              <div className="text-6xl font-bold text-orange-600">{streak.current_streak}</div>
              <p className="text-sm text-muted-foreground mt-1">Days in a row</p>
            </div>

            {/* Alert for streak maintenance */}
            {!streak.is_active_today && streak.current_streak > 0 && (
              <Alert className="bg-yellow-50 border-yellow-200">
                <AlertDescription className="text-yellow-800">
                  Don&apos;t break your streak! Complete an activity today to keep it going.
                </AlertDescription>
              </Alert>
            )}

            {streak.current_streak === 0 && (
              <Alert className="bg-blue-50 border-blue-200">
                <AlertDescription className="text-blue-800">
                  Start your first streak today by completing a mission or interview!
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Progress to Next Milestone */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">Progress to {streak.next_milestone} days</span>
              <span className="text-muted-foreground">{Math.round(streakPercentage)}%</span>
            </div>
            <Progress value={streakPercentage} className="h-3" />
            <p className="text-xs text-muted-foreground mt-2">
              {daysToMilestone > 0
                ? `${daysToMilestone} more days to next milestone!`
                : 'Milestone reached!'}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-orange-200">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-amber-700 mb-1">
                <Award className="h-4 w-4" />
                <span className="text-sm font-medium">Longest</span>
              </div>
              <div className="text-3xl font-bold text-amber-600">{streak.longest_streak}</div>
              <p className="text-xs text-muted-foreground">days</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-blue-700 mb-1">
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-medium">Last</span>
              </div>
              <div className="text-sm font-medium">
                {new Date(streak.last_activity_date).toLocaleDateString()}
              </div>
              <p className="text-xs text-muted-foreground">active</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Streak Milestones Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Milestone Rewards</CardTitle>
          <CardDescription>Earn rewards for maintaining streaks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between p-2 rounded bg-blue-50">
              <span>🔥 3 Day Streak</span>
              <Badge variant="secondary">+50 XP</Badge>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-green-50">
              <span>🔥 7 Day Streak</span>
              <Badge className="bg-green-600">+100 XP</Badge>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-purple-50">
              <span>🔥 14 Day Streak</span>
              <Badge className="bg-purple-600">+150 XP</Badge>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-amber-50">
              <span>🔥 30 Day Streak</span>
              <Badge className="bg-amber-600">+250 XP + Badge</Badge>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-[rgba(80,160,170,0.5)]-50">
              <span>🏆 100 Day Streak</span>
              <Badge className="bg-[rgba(80,160,170,0.5)]-600">+500 XP + Trophy</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
