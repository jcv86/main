'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Clock, Target, TrendingUp, Zap } from 'lucide-react'

interface ProgressData {
  totalMinutes: number
  totalSessions: number
  completionPercentage: number
  sectionProgress: {
    name: string
    minutes: number
    sessions: number
    percentage: number
    color: string
  }[]
  currentLevel: number
  xpPoints: number
  xpToNextLevel: number
  badges: string[]
  streak: number
}

interface ChallengeData {
  name: string
  description: string
  reward: number
  progress: number
  total: number
}

export default function A3ProgressDashboard() {
  const [progress, setProgress] = useState<ProgressData | null>(null)
  const [challenge, setChallenge] = useState<ChallengeData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await fetch('/api/a3/progress', {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        })
        if (!response.ok) {
          console.error('[v0] Progress API error:', response.status)
          throw new Error(`Failed to fetch progress: ${response.status}`)
        }
        const data = await response.json()
        setProgress(data)
      } catch (error) {
        console.error('[v0] Error fetching progress:', error)
        setProgress({
          totalMinutes: 0,
          totalSessions: 0,
          completionPercentage: 0,
          sectionProgress: [],
          currentLevel: 1,
          xpPoints: 0,
          xpToNextLevel: 1000,
          badges: [],
          streak: 0,
        })
      } finally {
        setLoading(false)
      }
    }

    const fetchChallenge = async () => {
      try {
        const response = await fetch('/api/a3/gamification', {
          credentials: 'include',
        })
        if (!response.ok) return
        const data = await response.json()
        if (data.nextChallenge) {
          setChallenge(data.nextChallenge)
        }
      } catch (error) {
        console.error('[v0] Error fetching challenge:', error)
      }
    }

    fetchProgress()
    fetchChallenge()
  }, [])

  if (loading) {
    return <div className="h-32 bg-muted/20 rounded-lg animate-pulse" />
  }

  if (!progress) {
    return null
  }

  return (
    <div className="space-y-4">
      {/* Main KPI Card - 3 Metrics */}
      <Card className="border-training/30 bg-gradient-to-br from-training/10 via-training/5 to-background overflow-hidden">
        <CardContent className="pt-8 pb-8">
          <div className="grid grid-cols-3 gap-12">
            {/* Metric 1: Time */}
            <div className="text-center space-y-3">
              <Clock className="w-10 h-10 mx-auto text-training opacity-70" />
              <div>
                <p className="text-5xl font-bold text-white">{progress.totalMinutes}</p>
                <p className="text-xs text-training/80 mt-2 uppercase tracking-wider">minutos entrenado</p>
              </div>
            </div>

            {/* Metric 2: Sessions */}
            <div className="text-center space-y-3 border-l border-r border-training/20">
              <Target className="w-10 h-10 mx-auto text-training opacity-70" />
              <div>
                <p className="text-5xl font-bold text-white">{progress.totalSessions}</p>
                <p className="text-xs text-training/80 mt-2 uppercase tracking-wider">sesiones</p>
              </div>
            </div>

            {/* Metric 3: Level */}
            <div className="text-center space-y-3">
              <TrendingUp className="w-10 h-10 mx-auto text-amber-400 opacity-70" />
              <div>
                <p className="text-5xl font-bold text-white">{progress.currentLevel}</p>
                <p className="text-xs text-amber-400/80 mt-2 uppercase tracking-wider">tu nivel</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Completion Progress Bar */}
      <Card className="border-muted/20 bg-muted/5">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-white">Progreso General del Programa</p>
            <p className="text-sm font-bold text-training">{progress.completionPercentage}%</p>
          </div>
          <div className="w-full bg-muted/40 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-training via-training to-amber-400 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress.completionPercentage}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Active Challenge - Professional Layout */}
      {challenge && (
        <Card className="border-training/30 bg-gradient-to-br from-training/10 to-background">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Zap className="w-8 h-8 text-training opacity-70 flex-shrink-0" />
                <div>
                  <p className="font-bold text-white text-lg">{challenge.name}</p>
                  <p className="text-xs text-training/80 mt-0.5">{challenge.description}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Recompensa</p>
                <p className="text-2xl font-bold text-amber-400">+{challenge.reward}</p>
                <p className="text-xs text-amber-400/70">XP</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground font-medium">Progreso: {challenge.progress}/{challenge.total}</span>
                <span className="text-training font-semibold">{Math.round((challenge.progress / challenge.total) * 100)}%</span>
              </div>
              <div className="w-full bg-muted/40 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-training to-amber-400 h-2.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      (challenge.progress / challenge.total) * 100,
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
