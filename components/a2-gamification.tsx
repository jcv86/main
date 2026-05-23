'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Flame, Zap, Gift } from 'lucide-react'
import { getLevelFromXP, formatXP, formatDTC } from '@/lib/gamification/calculations'

interface A2GamificationProps {
  userId?: string
  routeId?: string
}

interface A2Progress {
  route_name: string
  progress_percentage: number
  missions_completed: number
  total_missions: number
  current_level: number
  level_xp: number
  xp_earned_this_route: number
  dtc_earned_this_route: number
  recent_milestones: Array<{
    name: string
    xp_reward: number
    dtc_reward: number
    earned_at: string
  }>
}

export function A2Gamification({ userId, routeId }: A2GamificationProps) {
  const [progress, setProgress] = useState<A2Progress | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [claimingReward, setClaimingReward] = useState(false)

  useEffect(() => {
    const fetchA2Progress = async () => {
      try {
        const params = new URLSearchParams()
        if (userId) params.append('userId', userId)
        if (routeId) params.append('routeId', routeId)

        const res = await fetch(`/api/gamification/a2-progress?${params}`)
        if (!res.ok) throw new Error('Failed to fetch A2 progress')

        const data = await res.json()
        setProgress(data)
        setError(null)
      } catch (err) {
        console.error('[v0] Error fetching A2 progress:', err)
        setError('Failed to load route progress')
      } finally {
        setLoading(false)
      }
    }

    fetchA2Progress()
  }, [userId, routeId])

  const handleClaimReward = async () => {
    if (!progress || claimingReward) return

    setClaimingReward(true)
    try {
      const res = await fetch('/api/gamification/claim-reward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          routeId,
          xpAmount: progress.xp_earned_this_route,
          dtcAmount: progress.dtc_earned_this_route,
        }),
      })

      if (!res.ok) throw new Error('Failed to claim reward')

      // Refresh progress
      const refreshRes = await fetch(`/api/gamification/a2-progress?routeId=${routeId}`)
      const newProgress = await refreshRes.json()
      setProgress(newProgress)
    } catch (err) {
      console.error('[v0] Error claiming reward:', err)
    } finally {
      setClaimingReward(false)
    }
  }

  if (loading) {
    return (
      <Card className="h-48 animate-pulse bg-muted" />
    )
  }

  if (error || !progress) {
    return (
      <Card className="border-[rgb(80,160,170)]-200 bg-[rgba(80,160,170,0.5)]-50">
        <CardContent className="pt-6 text-[rgb(80,160,170)]-800">{error || 'No progress data'}</CardContent>
      </Card>
    )
  }

  const levelInfo = getLevelFromXP(progress.level_xp)

  return (
    <div className="space-y-4">
      {/* Route Progress Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{progress.route_name}</CardTitle>
              <CardDescription>Track your mastery progress</CardDescription>
            </div>
            <Badge className="bg-blue-600 text-white">Level {levelInfo.level}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Overall Progress */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">Overall Progress</span>
              <span className="text-muted-foreground">{progress.progress_percentage}%</span>
            </div>
            <Progress value={progress.progress_percentage} className="h-3" />
          </div>

          {/* Mission Stats */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-blue-200">
            <div>
              <div className="text-xs text-muted-foreground">Missions Completed</div>
              <div className="text-2xl font-bold">
                {progress.missions_completed} / {progress.total_missions}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Completion Rate</div>
              <div className="text-2xl font-bold">
                {Math.round((progress.missions_completed / progress.total_missions) * 100)}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* XP & DTC Earnings */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-4 w-4 text-purple-600" />
              XP This Route
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {formatXP(progress.xp_earned_this_route)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Earned during this route</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Gift className="h-4 w-4 text-amber-600" />
              DTC This Route
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">
              +{progress.dtc_earned_this_route}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Available to claim</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Milestones */}
      {progress.recent_milestones && progress.recent_milestones.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-500" />
              Recent Milestones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {progress.recent_milestones.map((milestone, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-muted"
              >
                <div>
                  <div className="font-medium text-sm">{milestone.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(milestone.earned_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <Badge variant="secondary" className="text-xs">
                    {formatXP(milestone.xp_reward)}
                  </Badge>
                  <Badge variant="outline" className="text-xs ml-1">
                    +{milestone.dtc_reward} DTC
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Claim Reward Button */}
      {progress.xp_earned_this_route > 0 || progress.dtc_earned_this_route > 0 ? (
        <Button
          onClick={handleClaimReward}
          disabled={claimingReward}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold h-12"
          size="lg"
        >
          {claimingReward ? 'Claiming...' : 'Claim Route Rewards'}
        </Button>
      ) : null}
    </div>
  )
}
