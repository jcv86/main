'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { getRankingTier, formatXP, formatDTC, getStreakStatus, getLevelFromXP } from '@/lib/gamification/calculations'
import { Flame, Zap, Trophy, Coins, Target, TrendingUp } from 'lucide-react'

interface GamificationProfileEnhancedProps {
  userId?: string
}

export function GamificationProfileEnhanced({ userId }: GamificationProfileEnhancedProps) {
  const [stats, setStats] = useState<any>(null)
  const [dtcBalance, setDTCBalance] = useState<any>(null)
  const [ranking, setRanking] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch global gamification stats
        const globalRes = await fetch('/api/gamification/global')
        const globalData = await globalRes.json()
        setStats(globalData)

        // Fetch DTC balance
        if (userId) {
          const dtcRes = await fetch(`/api/gamification/dtc-balance?userId=${userId}`)
          const dtcData = await dtcRes.json()
          setDTCBalance(dtcData)
        }

        // Fetch user rankings
        const rankRes = await fetch('/api/gamification/rankings?limit=1')
        const rankData = await rankRes.json()
        setRanking(rankData)

        setError(null)
      } catch (err) {
        console.error('[v0] Error fetching gamification data:', err)
        setError('Failed to load gamification stats')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [userId])

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="h-32 animate-pulse bg-muted" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-[rgb(80,160,170)]-200 bg-[rgba(80,160,170,0.5)]-50">
        <CardContent className="pt-6 text-[rgb(80,160,170)]-800">{error}</CardContent>
      </Card>
    )
  }

  const levelInfo = getLevelFromXP(stats?.total_xp || 0)
  const tierInfo = getRankingTier(ranking?.current_user_rank || 1000)
  const streakInfo = getStreakStatus(stats?.daily_streak || 0)
  const nextLevelProgress = levelInfo.currentXP / (levelInfo.nextLevelXP || 1)

  return (
    <div className="space-y-6">
      {/* Main Level & XP Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl">Level {levelInfo.level}</CardTitle>
              <CardDescription>{formatXP(stats?.total_xp || 0)} Total XP</CardDescription>
            </div>
            <div className="text-5xl">{tierInfo.icon}</div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Progress to Level {levelInfo.level + 1}</span>
              <span className="text-muted-foreground">
                {formatXP(levelInfo.currentXP)} / {formatXP(levelInfo.nextLevelXP || 0)}
              </span>
            </div>
            <Progress value={nextLevelProgress * 100} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Ranking & Rating Tier */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Ranking
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold">{ranking?.current_user_rank || 'N/A'}</div>
              <Badge variant="secondary">{tierInfo.tier}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">{tierInfo.description}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              Streak
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold">{stats?.daily_streak || 0}</div>
              <span className="text-xs text-muted-foreground">days</span>
            </div>
            <p className="text-xs">{streakInfo.message}</p>
          </CardContent>
        </Card>
      </div>

      {/* DTC Coins & Balance */}
      <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-amber-600" />
            DTC Coins Balance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Current Balance</div>
              <div className="text-2xl font-bold">{dtcBalance?.balance || 0}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Lifetime Earned</div>
              <div className="text-2xl font-bold">{dtcBalance?.lifetime_earned || 0}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Lifetime Spent</div>
              <div className="text-2xl font-bold">{dtcBalance?.lifetime_spent || 0}</div>
            </div>
          </div>
          <div className="pt-2 border-t border-amber-200">
            <p className="text-xs text-muted-foreground">
              Earn DTC coins by completing interviews, unlocking badges, and achieving milestones. Spend them on premium tips and special features.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* XP Breakdown by Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            XP Distribution by Section
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {/* A3 */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-sm font-medium">Entrenamiento Intensivo (A3)</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {formatXP(stats?.breakdown?.a3_xp || 0)}
                </span>
              </div>
              <Progress value={(stats?.breakdown?.a3_xp / stats?.total_xp) * 100 || 0} className="h-2" />
            </div>

            {/* A4 */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500" />
                  <span className="text-sm font-medium">Módulos de Conocimiento (A4)</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {formatXP(stats?.breakdown?.a4_xp || 0)}
                </span>
              </div>
              <Progress value={(stats?.breakdown?.a4_xp / stats?.total_xp) * 100 || 0} className="h-2" />
            </div>

            {/* Interviews */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm font-medium">Entrevistas</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {formatXP(stats?.breakdown?.interview_bonus || 0)}
                </span>
              </div>
              <Progress value={(stats?.breakdown?.interview_bonus / stats?.total_xp) * 100 || 0} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Badges & Achievements */}
      {stats?.badges && stats.badges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Recent Badges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {stats.badges.slice(0, 8).map((badge: string, idx: number) => (
                <Badge key={idx} variant="secondary">
                  {badge}
                </Badge>
              ))}
              {stats.badges.length > 8 && (
                <Badge variant="outline">+{stats.badges.length - 8} more</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">A3 Progress</div>
              <div className="text-sm font-medium">{stats?.sections?.a3?.progress || 0}%</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">A4 Progress</div>
              <div className="text-sm font-medium">{stats?.sections?.a4?.progress || 0}%</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">A3 Sessions</div>
              <div className="text-sm font-medium">{stats?.sections?.a3?.sessions || 0}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Interviews Completed</div>
              <div className="text-sm font-medium">{stats?.sections?.interviews?.total_completed || 0}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
