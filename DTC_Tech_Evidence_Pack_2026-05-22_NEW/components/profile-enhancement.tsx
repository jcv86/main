'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Trophy, Flame, Coins, Zap, TrendingUp, Target } from 'lucide-react'
import { getRankingTier, getLevelFromXP, formatXP, formatDTC } from '@/lib/gamification/calculations'

interface UserGamificationProfile {
  user: {
    id: string
    full_name: string
    avatar_url?: string
    email: string
  }
  gamification: {
    total_xp: number
    current_level: number
    daily_streak: number
    missions_completed: number
    lifetime_earned_dtc: number
  }
  ranking: {
    rank: number
    tier: string
    xp_a3: number
    xp_a2: number
    xp_a1: number
  }
  dtc: {
    balance: number
    lifetime_earned: number
    lifetime_spent: number
  }
  achievements: Array<{
    title: string
    earned_at: string
  }>
}

interface ProfileEnhancementProps {
  userId?: string
}

export function ProfileEnhancement({ userId }: ProfileEnhancementProps) {
  const [profile, setProfile] = useState<UserGamificationProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const params = new URLSearchParams()
        if (userId) params.append('userId', userId)

        const res = await fetch(`/api/user/profile-enhancement?${params}`)
        if (!res.ok) throw new Error('Failed to fetch profile')

        const data = await res.json()
        setProfile(data)
        setError(null)
      } catch (err) {
        console.error('[v0] Error fetching profile:', err)
        setError('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [userId])

  if (loading) {
    return (
      <Card className="h-96 animate-pulse bg-muted" />
    )
  }

  if (error || !profile) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6 text-red-800">{error || 'Profile not found'}</CardContent>
      </Card>
    )
  }

  const levelInfo = getLevelFromXP(profile.gamification.total_xp)
  const initials = profile.user.full_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  const tierInfo = getRankingTier(profile.ranking.rank)

  return (
    <div className="space-y-6">
      {/* Header Card - User Info + Key Stats */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={profile.user.avatar_url} alt={profile.user.full_name} />
                <AvatarFallback className="text-lg font-bold">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{profile.user.full_name}</h2>
                <p className="text-sm text-muted-foreground">{profile.user.email}</p>
                <div className="flex gap-2 mt-2">
                  <Badge className="bg-blue-600 text-white">Level {levelInfo.level}</Badge>
                  <Badge 
                    className="text-white"
                    style={{ backgroundColor: tierInfo.color }}
                  >
                    {tierInfo.tier}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-4xl font-bold text-purple-600">#{profile.ranking.rank}</div>
              <p className="text-sm text-muted-foreground">Global Rank</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="h-4 w-4 text-purple-600" />
              Total XP
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatXP(profile.gamification.total_xp)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Level {levelInfo.level}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-500" />
              Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.gamification.daily_streak}</div>
            <p className="text-xs text-muted-foreground mt-1">days active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Coins className="h-4 w-4 text-amber-600" />
              DTC Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {formatDTC(profile.dtc.balance)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Available coins</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="h-4 w-4 text-green-600" />
              Missions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.gamification.missions_completed}</div>
            <p className="text-xs text-muted-foreground mt-1">completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tabs */}
      <Tabs defaultValue="breakdown" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="breakdown">XP Breakdown</TabsTrigger>
          <TabsTrigger value="dtc">DTC Activity</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        {/* XP Breakdown */}
        <TabsContent value="breakdown" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Experience Points by Section</CardTitle>
              <CardDescription>Where you&apos;ve earned your XP</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">A1: Self Discovery</span>
                  <span className="text-muted-foreground">{formatXP(profile.ranking.xp_a1)}</span>
                </div>
                <Progress
                  value={Math.min(100, (profile.ranking.xp_a1 / profile.gamification.total_xp) * 100)}
                  className="h-2"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">A2: Professional Routes</span>
                  <span className="text-muted-foreground">{formatXP(profile.ranking.xp_a2)}</span>
                </div>
                <Progress
                  value={Math.min(100, (profile.ranking.xp_a2 / profile.gamification.total_xp) * 100)}
                  className="h-2"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">A3: Career Accelerator</span>
                  <span className="text-muted-foreground">{formatXP(profile.ranking.xp_a3)}</span>
                </div>
                <Progress
                  value={Math.min(100, (profile.ranking.xp_a3 / profile.gamification.total_xp) * 100)}
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DTC Activity */}
        <TabsContent value="dtc" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Lifetime Earned</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  +{formatDTC(profile.dtc.lifetime_earned)}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Lifetime Spent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">
                  -{formatDTC(profile.dtc.lifetime_spent)}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Current Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-600">
                  {formatDTC(profile.dtc.balance)}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Achievements */}
        <TabsContent value="achievements" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Unlocked Achievements</CardTitle>
              <CardDescription>
                {profile.achievements.length} achievements unlocked
              </CardDescription>
            </CardHeader>
            <CardContent>
              {profile.achievements.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Keep completing missions to unlock achievements!
                </p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {profile.achievements.map((achievement, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border border-amber-200 bg-amber-50 text-center"
                    >
                      <Trophy className="h-5 w-5 mx-auto mb-2 text-amber-600" />
                      <p className="text-xs font-medium">{achievement.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(achievement.earned_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
