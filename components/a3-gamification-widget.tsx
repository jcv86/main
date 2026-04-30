'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Zap, Flame, Trophy } from 'lucide-react'

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
        const response = await fetch('/api/a3/gamification', {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        })
        if (!response.ok) {
          console.error('[v0] Gamification API error:', response.status)
          throw new Error(`Failed to fetch gamification: ${response.status}`)
        }
        const data = await response.json()
        setGamification(data)
      } catch (error) {
        console.error('[v0] Error fetching gamification:', error)
        setGamification({
          currentLevel: 1,
          totalXp: 0,
          xpToNextLevel: 1000,
          streak: 0,
          badges: [],
          nextChallenge: null,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchGamification()
  }, [])

  if (loading) {
    return <div className="h-40 bg-muted/20 rounded-lg animate-pulse" />
  }

  if (!gamification) {
    return null
  }

  const xpPercentage = Math.min(
    (gamification.totalXp / (gamification.totalXp + gamification.xpToNextLevel)) * 100,
    100
  )

  return (
    <div className="space-y-4">
      {/* XP and Level */}
      <Card className="border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-background">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Zap className="w-10 h-10 text-amber-400" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Nivel</p>
                <p className="text-4xl font-bold text-white">{gamification.currentLevel}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">XP</p>
              <p className="text-3xl font-bold text-amber-400">{gamification.totalXp}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">{gamification.xpToNextLevel} XP para siguiente</p>
            <div className="w-full bg-muted/40 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-400 to-amber-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${xpPercentage}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Streak and Badges Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-background">
          <CardContent className="pt-4 pb-4 text-center">
            <div className="flex justify-center mb-2">
              <Flame className="w-6 h-6 text-emerald-500" />
            </div>
            <p className="text-3xl font-bold text-emerald-500">{gamification.streak}</p>
            <p className="text-xs text-muted-foreground mt-1">racha de días</p>
          </CardContent>
        </Card>

        <Card className="border-purple/30 bg-gradient-to-br from-purple/10 to-background">
          <CardContent className="pt-4 pb-4 text-center">
            <div className="flex justify-center mb-2">
              <Trophy className="w-6 h-6 text-purple" />
            </div>
            <p className="text-3xl font-bold text-purple">{gamification.badges.length}</p>
            <p className="text-xs text-muted-foreground mt-1">badges</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Challenge */}
      {gamification.nextChallenge && (
        <Card className="border-training/30 bg-gradient-to-br from-training/10 to-background">
          <CardContent className="pt-4 pb-4">
            <div className="mb-3">
              <p className="font-semibold text-white">{gamification.nextChallenge.name}</p>
              <p className="text-xs text-training/80 mt-1">{gamification.nextChallenge.description}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">{gamification.nextChallenge.progress}/{gamification.nextChallenge.total}</span>
                <span className="text-amber-400">+{gamification.nextChallenge.reward} XP</span>
              </div>
              <div className="w-full bg-muted/40 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-training to-amber-400 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      (gamification.nextChallenge.progress / gamification.nextChallenge.total) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
