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
      {/* Main KPI Card - 2 Metrics */}
      <Card className="border-training/30 bg-gradient-to-br from-training/10 via-training/5 to-background overflow-hidden">
        <CardContent className="pt-8 pb-8">
          <div className="grid grid-cols-2 gap-12">
            {/* Metric 1: Time */}
            <div className="text-center space-y-3">
              <Clock className="w-10 h-10 mx-auto opacity-70" style={{ color: 'rgb(170, 70, 170)' }} />
              <div>
                <p className="text-5xl font-bold text-white">{progress.totalMinutes}</p>
                <p className="text-xs mt-2 uppercase tracking-wider text-white">minutos entrenado</p>
              </div>
            </div>

            {/* Metric 2: Level */}
            <div className="text-center space-y-3">
              <TrendingUp className="w-10 h-10 mx-auto opacity-70" style={{ color: 'rgb(170, 70, 170)' }} />
              <div>
                <p className="text-5xl font-bold text-white">{progress.currentLevel}</p>
                <p className="text-xs mt-2 uppercase tracking-wider text-white">tu nivel</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
