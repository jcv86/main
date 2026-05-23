'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Trophy, Flame, Zap } from 'lucide-react'
import { getRankingTier } from '@/lib/gamification/calculations'

interface LeaderboardEntry {
  rank: number
  user: {
    id: string
    full_name: string
    avatar_url?: string
  }
  scores: {
    general: number
    a1_cerebral: number
    a2_rutas: number
  }
  stats: {
    active_days: number
    current_streak: number
    missions_completed: number
  }
}

interface UserStats {
  rank?: number
  streak?: number
  missions?: number
}

export function Leaderboard() {
  const [activeTab, setActiveTab] = useState('points')
  const [rankings, setRankings] = useState<LeaderboardEntry[]>([])
  const [userStats, setUserStats] = useState<UserStats>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch rankings
        const rankRes = await fetch('/api/gamification/rankings?limit=50')
        const rankData = await rankRes.json()

        if (rankData.rankings) {
          setRankings(rankData.rankings)
          setUserStats({
            rank: rankData.current_user_rank,
          })
        }

        // Fetch user stats
        const globalRes = await fetch('/api/gamification/global')
        const globalData = await globalRes.json()

        if (globalData) {
          setUserStats((prev) => ({
            ...prev,
            streak: globalData.daily_streak,
            missions: globalData.sections?.missions_completed || 0,
          }))
        }

        setError(null)
      } catch (err) {
        console.error('[v0] Error fetching leaderboard data:', err)
        setError('Failed to load leaderboard')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return rank
  }

  const renderLeaderboard = () => (
    <div className="space-y-2">
      {loading ? (
        <div className="space-y-3">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : rankings.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No rankings available yet</div>
      ) : (
        rankings.map((entry) => {
          const tierInfo = getRankingTier(entry.rank)
          const initials = entry.user.full_name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()

          return (
            <div
              key={entry.rank}
              className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted transition"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 font-bold text-sm flex-shrink-0">
                  {getMedalEmoji(entry.rank)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={entry.user.avatar_url} alt={entry.user.full_name} />
                      <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                    </Avatar>
                    <p className="font-semibold text-foreground truncate">{entry.user.full_name}</p>
                    <Badge className="text-xs" style={{ backgroundColor: tierInfo.color, color: '#fff' }}>
                      {tierInfo.tier}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    🔥 {entry.stats.current_streak} days • 🎯 {entry.stats.missions_completed} missions
                  </p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-lg font-bold">{entry.scores.general}</p>
                <p className="text-xs text-muted-foreground">pts</p>
              </div>
            </div>
          )
        })
      )}
    </div>
  )

  if (error) {
    return (
      <Card className="border-[rgb(80,160,170)]-200 bg-[rgba(80,160,170,0.5)]-50">
        <CardContent className="pt-6 text-[rgb(80,160,170)]-800">{error}</CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-amber-600" />
            <p className="text-sm text-muted-foreground">Your Rank</p>
            <p className="text-3xl font-bold">{userStats.rank ? `#${userStats.rank}` : 'N/A'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Flame className="w-8 h-8 mx-auto mb-2 text-orange-600" />
            <p className="text-sm text-muted-foreground">Current Streak</p>
            <p className="text-3xl font-bold">{userStats.streak || 0} days</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Zap className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
            <p className="text-sm text-muted-foreground">Missions Completed</p>
            <p className="text-3xl font-bold">{userStats.missions || 0}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Global Leaderboard
          </CardTitle>
          <CardDescription>Top performers on Despega</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-1">
              <TabsTrigger value="points">By Points</TabsTrigger>
            </TabsList>
            <TabsContent value="points" className="mt-6">
              {renderLeaderboard()}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
