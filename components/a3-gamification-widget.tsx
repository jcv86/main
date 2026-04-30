'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Zap, Trophy, Flame, Target } from 'lucide-react'

interface GamificationData {
  currentLevel: number
  totalXp: number
  xpToNextLevel: number
  streak: number
  badges: string[]
  nextChallenge: {
    name: string
    description: string
    reward: number
    progress: number
    total: number
  } | null
}

export default function A3GamificationWidget() {
  const [gamification, setGamification] = useState<GamificationData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGamification = async () => {
      try {
        const response = await fetch('/api/a3/gamification')
        if (!response.ok) throw new Error('Failed to fetch gamification data')
        const data = await response.json()
        setGamification(data)
      } catch (error) {
        console.error('[v0] Error fetching gamification:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGamification()
  }, [])

  if (loading) {
    return null
  }

  if (!gamification) {
    return null
  }

  const xpPercentage = (gamification.totalXp / (gamification.totalXp + gamification.xpToNextLevel)) * 100

  return (
    <div className="space-y-4">
      {/* XP Bar and Level */}
      <Card className="border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-amber-500/5">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/20 border-2 border-amber-500">
                  <Zap className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground dark:text-white/70">Nivel</p>
                  <p className="text-2xl font-bold text-amber-500">{gamification.currentLevel}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground dark:text-white/70">XP Acumulado</p>
                <p className="text-lg font-semibold text-white">{gamification.totalXp.toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs text-muted-foreground dark:text-white/60">
                <span>Progreso al Nivel {gamification.currentLevel + 1}</span>
                <span>{gamification.xpToNextLevel} XP para siguiente</span>
              </div>
              <Progress value={Math.min(xpPercentage, 100)} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Streak and Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-4 h-4 text-emerald-500" />
              <p className="text-xs text-muted-foreground dark:text-white/70">Racha</p>
            </div>
            <p className="text-2xl font-bold text-emerald-500">{gamification.streak} días</p>
            <p className="text-xs text-muted-foreground dark:text-white/60 mt-1">
              ¡Mantén la consistencia!
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple/30 bg-gradient-to-br from-purple/10 to-purple/5">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-4 h-4 text-purple" />
              <p className="text-xs text-muted-foreground dark:text-white/70">Badges</p>
            </div>
            <p className="text-2xl font-bold text-purple">{gamification.badges.length}</p>
            <p className="text-xs text-muted-foreground dark:text-white/60 mt-1">
              desbloqueados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Active Challenge */}
      {gamification.nextChallenge && (
        <Card className="border-training/30 bg-gradient-to-br from-training/10 to-training/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-training" />
              Desafío Activo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="font-semibold text-white">{gamification.nextChallenge.name}</p>
              <p className="text-sm text-muted-foreground dark:text-white/70 mt-1">
                {gamification.nextChallenge.description}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground dark:text-white/60">
                <span>
                  {gamification.nextChallenge.progress} / {gamification.nextChallenge.total}
                </span>
                <span className="text-amber-500">+{gamification.nextChallenge.reward} XP</span>
              </div>
              <Progress
                value={
                  (gamification.nextChallenge.progress / gamification.nextChallenge.total) * 100
                }
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
