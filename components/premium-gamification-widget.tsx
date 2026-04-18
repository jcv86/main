'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@/hooks/use-user'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { 
  Flame, 
  Zap, 
  Trophy, 
  Star, 
  Target,
  Clock,
  CheckCircle2,
  TrendingUp,
  Award,
  Crown,
  Sparkles,
  Gift,
  Unlock
} from 'lucide-react'

interface GamificationData {
  daily_streak: number
  total_xp: number
  current_level: number
  xp_to_next_level: number
  phase_level: Record<string, number>
  phase_xp: Record<string, number>
  daily_challenges_completed: number
  total_achievements: number
  weekly_rank: number
  total_users: number
  last_activity: string
}

export function PremiumGamificationWidget() {
  const { user } = useUser()
  const supabase = createClient()
  const [gamification, setGamification] = useState<GamificationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showChallenges, setShowChallenges] = useState(false)

  useEffect(() => {
    if (user?.email) {
      loadGamification()
      const interval = setInterval(loadGamification, 30000) // Refresh every 30s
      return () => clearInterval(interval)
    }
  }, [user?.email])

  const loadGamification = async () => {
    if (!user?.email) return
    try {
      const response = await fetch(`/api/gamification/premium?userEmail=${encodeURIComponent(user.email)}`)
      if (response.ok) {
        const data = await response.json()
        setGamification(data)
      }
    } catch (error) {
      console.error('[v0] Error loading gamification:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !gamification) return null

  const xpProgress = (gamification.phase_xp['current'] / 1000) * 100
  const streakMultiplier = Math.min(gamification.daily_streak / 7, 2)
  const isStreakActive = gamification.last_activity && 
    (new Date().getTime() - new Date(gamification.last_activity).getTime()) < 86400000

  return (
    <div className="fixed bottom-4 right-4 w-80 z-40 space-y-3">
      {/* MAIN GAMIFICATION CARD */}
      <Card className="bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-950/40 dark:to-teal-950/40 border-2 border-cyan/20 dark:border-cyan shadow-xl hover:shadow-2xl transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan dark:text-cyan/40" />
              <CardTitle className="text-sm font-bold text-cyan dark:text-cyan/10">
                Tu Progreso
              </CardTitle>
            </div>
            <Badge className="bg-cyan text-white text-xs">
              Nivel {gamification.current_level}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* XP PROGRESS */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-semibold text-muted/70 dark:text-muted/30">
                  {gamification.total_xp.toLocaleString()} XP
                </span>
              </div>
              <span className="text-xs text-muted/60 dark:text-muted/40">
                {gamification.xp_to_next_level} para siguiente nivel
              </span>
            </div>
            <Progress value={xpProgress} className="h-2" />
          </div>

          {/* STREAK & ACHIEVEMENTS ROW */}
          <div className="grid grid-cols-3 gap-2">
            {/* DAILY STREAK */}
            <div className="bg-white/80 dark:bg-muted/90/50 rounded-[28px] p-2 text-center border border-orange/20 dark:border-orange/30">
              <div className="flex items-center justify-center gap-0.5 mb-1">
                <Flame className={`w-3 h-3 ${isStreakActive ? 'text-orange' : 'text-muted/40'}`} />
              </div>
              <p className="text-lg font-black text-orange dark:text-orange/40">
                {gamification.daily_streak}
              </p>
              <p className="text-xs text-muted/60 dark:text-muted/40">días</p>
              {streakMultiplier > 1 && (
                <Badge className="text-xs bg-orange/50/20 text-orange dark:text-orange/40 border-0 mt-1">
                  {streakMultiplier.toFixed(1)}x
                </Badge>
              )}
            </div>

            {/* CHALLENGES */}
            <div className="bg-white/80 dark:bg-muted/90/50 rounded-[28px] p-2 text-center border border-purple/20 dark:border-purple/30">
              <Target className="w-3 h-3 text-purple/50 mx-auto mb-1" />
              <p className="text-lg font-black text-purple dark:text-purple/40">
                {gamification.daily_challenges_completed}/3
              </p>
              <p className="text-xs text-muted/60 dark:text-muted/40">hoy</p>
            </div>

            {/* ACHIEVEMENTS */}
            <div className="bg-white/80 dark:bg-muted/90/50 rounded-[28px] p-2 text-center border border-green/20 dark:border-green/30">
              <Trophy className="w-3 h-3 text-green/50 mx-auto mb-1" />
              <p className="text-lg font-black text-green dark:text-green/40">
                {gamification.total_achievements}
              </p>
              <p className="text-xs text-muted/60 dark:text-muted/40">badges</p>
            </div>
          </div>

          {/* PHASE PROGRESS */}
          <div className="space-y-2 pt-2 border-t border-muted/20 dark:border-muted/70">
            <p className="text-xs font-bold text-muted/70 dark:text-muted/30 uppercase tracking-wide">
              Fase Actual - Nivel {gamification.phase_level['current']}
            </p>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-orange flex-shrink-0" />
              <Progress value={Math.min((gamification.phase_xp['current'] / 500) * 100, 100)} className="h-1.5 flex-1" />
              <span className="text-xs font-semibold text-muted/60 dark:text-muted/40">
                {gamification.phase_xp['current']}/500
              </span>
            </div>
          </div>

          {/* WEEKLY RANK */}
          <div className="bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 rounded-[28px] p-2 border border-amber-200 dark:border-amber-800/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-semibold text-amber-900 dark:text-amber-100">
                  Ranking Semanal
                </span>
              </div>
              <span className="text-sm font-black text-amber-700 dark:text-amber-300">
                #{gamification.weekly_rank}
              </span>
            </div>
            <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
              de {gamification.total_users.toLocaleString()} usuarios
            </p>
          </div>

          {/* DAILY CHALLENGES BUTTON */}
          <Button
            onClick={() => setShowChallenges(!showChallenges)}
            className="w-full bg-cyan hover:bg-cyan text-white text-sm font-semibold"
            size="sm"
          >
            <Gift className="w-4 h-4 mr-2" />
            Desafíos de Hoy ({gamification.daily_challenges_completed}/3)
          </Button>

          {/* NEXT UNLOCK */}
          <div className="bg-muted/10 dark:bg-muted/80/50 rounded p-2">
            <div className="flex items-center gap-2 text-xs">
              <Unlock className="w-3 h-3 text-muted/60 dark:text-muted/40 flex-shrink-0" />
              <span className="text-muted/70 dark:text-muted/30">
                <strong>{500 - (gamification.phase_xp['current'] % 500)} XP</strong> para próximo achievement
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* QUICK STATS FOOTER */}
      <div className="text-center text-xs text-muted/60 dark:text-muted/40 px-2">
        <p>Sigue tu racha para mantener el multiplicador activo 🔥</p>
      </div>
    </div>
  )
}
