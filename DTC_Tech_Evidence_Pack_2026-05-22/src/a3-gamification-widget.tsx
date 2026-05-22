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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Zap className="w-10 h-10" style={{ color: 'rgb(170, 70, 170)' }} />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Nivel</p>
                <p className="text-4xl font-bold text-white">{gamification.currentLevel}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">XP</p>
              <p className="text-3xl font-bold" style={{ color: 'rgb(170, 70, 170)' }}>{gamification.totalXp}</p>
            </div>
          </div>
          
          <div className="space-y-2 mt-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Progreso</span>
              <span className="font-semibold" style={{ color: 'rgb(170, 70, 170)' }}>{Math.round(xpPercentage)}%</span>
            </div>
            <div className="w-full bg-muted/40 rounded-full h-3 overflow-hidden">
              <div
                className="h-3 rounded-full transition-all duration-500"
                style={{ width: `${xpPercentage}%`, backgroundColor: 'rgb(170, 70, 170)' }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Streak and Badges Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-background">
          <CardContent className="pt-6 pb-6 text-center">
            <div className="flex justify-center mb-3">
              <Flame className="w-8 h-8" style={{ color: 'rgb(170, 70, 170)' }} />
            </div>
            <p className="text-4xl font-bold" style={{ color: 'rgb(170, 70, 170)' }}>{gamification.streak}</p>
            <p className="text-xs text-white mt-1 uppercase tracking-wider">racha</p>
          </CardContent>
        </Card>

        <Card className="border-purple/30 bg-gradient-to-br from-purple/10 to-background">
          <CardContent className="pt-6 pb-6 text-center">
            <div className="flex justify-center mb-3">
              <Trophy className="w-8 h-8" style={{ color: 'rgb(170, 70, 170)' }} />
            </div>
            <p className="text-4xl font-bold" style={{ color: 'rgb(170, 70, 170)' }}>{gamification.badges.length}</p>
            <p className="text-xs text-white mt-1 uppercase tracking-wider">badges</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
