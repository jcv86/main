'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, Target, TrendingUp, Zap, CheckCircle2 } from 'lucide-react'

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
  const [claimingReward, setClaimingReward] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (!isHydrated) return
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
  }, [isHydrated])

  const handleClaimReward = async () => {
    if (!challenge) return
    
    setClaimingReward(true)
    try {
      const response = await fetch('/api/a3/gamification/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          challengeName: challenge.name,
          reward: challenge.reward,
        }),
      })

      if (response.ok) {
        // Refresh data after claiming
        const progressResponse = await fetch('/api/a3/progress', {
          credentials: 'include',
        })
        if (progressResponse.ok) {
          const updatedProgress = await progressResponse.json()
          setProgress(updatedProgress)
        }

        // Refresh challenge
        const challengeResponse = await fetch('/api/a3/gamification', {
          credentials: 'include',
        })
        if (challengeResponse.ok) {
          const challengeData = await challengeResponse.json()
          if (challengeData.nextChallenge) {
            setChallenge(challengeData.nextChallenge)
          }
        }
      }
    } catch (error) {
      console.error('[v0] Error claiming reward:', error)
    } finally {
      setClaimingReward(false)
    }
  }

  if (loading) {
    return <div className="h-32 bg-muted/20 rounded-lg animate-pulse" />
  }

  if (!progress) {
    return null
  }

  if (!isHydrated) {
    return (
      <div className="space-y-6">
        <div className="h-24 bg-muted/20 animate-pulse" style={{ borderRadius: '0px', borderColor: 'rgb(170, 70, 170)' }} />
        <div className="h-24 bg-muted/20 animate-pulse" style={{ borderRadius: '0px', borderColor: 'rgb(170, 70, 170)' }} />
        <div className="h-32 bg-muted/20 animate-pulse" style={{ borderRadius: '0px', borderColor: 'rgb(170, 70, 170)' }} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Main KPI Card - 2 Metrics */}
      <Card className="bg-gradient-to-br from-training/10 via-training/5 to-background overflow-hidden" style={{ borderRadius: '0px', borderColor: 'rgb(170, 70, 170)' }}>
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

      {/* Overall Progress Section */}
      <Card className="bg-gradient-to-br from-training/5 to-background" style={{ borderRadius: '0px', borderColor: 'rgb(170, 70, 170)' }}>
        <CardContent className="pt-6 pb-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2" style={{ backgroundColor: 'rgba(170, 70, 170, 0.1)' }}>
                  <TrendingUp className="w-5 h-5" style={{ color: 'rgb(170, 70, 170)' }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Progreso General</p>
                  <p className="text-xs text-muted-foreground">Tu avance en el programa</p>
                </div>
              </div>
              <p className="text-2xl font-bold" style={{ color: 'rgb(170, 70, 170)' }}>{progress.completionPercentage}%</p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-muted/30 h-2 overflow-hidden" style={{ borderColor: 'rgb(170, 70, 170)' }}>
              <div
                className="h-2 transition-all duration-700 ease-out"
                style={{ 
                  width: `${progress.completionPercentage}%`, 
                  backgroundColor: 'rgb(170, 70, 170)'
                }}
              />
            </div>

            {/* Progress Text */}
            <p className="text-xs text-muted-foreground text-center">Sigue entrenando para desbloquear nuevos desafíos</p>
          </div>
        </CardContent>
      </Card>

      {/* Active Challenge Card */}
      {challenge && (
        <Card className="bg-gradient-to-br from-training/10 to-background overflow-hidden" style={{ borderRadius: '0px', borderColor: 'rgb(170, 70, 170)' }}>
          <CardContent className="pt-6 pb-6">
            <div className="space-y-4">
              {/* Challenge Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 mt-0.5" style={{ backgroundColor: 'rgba(170, 70, 170, 0.1)' }}>
                    <Zap className="w-5 h-5 flex-shrink-0" style={{ color: 'rgb(170, 70, 170)' }} />
                  </div>
                  <div>
                    <p className="font-bold text-white text-base">{challenge.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{challenge.description}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-2xl font-bold" style={{ color: 'rgb(170, 70, 170)' }}>+{challenge.reward}</p>
                  <p className="text-xs text-muted-foreground">puntos</p>
                </div>
              </div>

              {/* Challenge Progress */}
              <div className="space-y-2 pt-2" style={{ borderTopColor: 'rgb(170, 70, 170)' }}>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground font-medium">Progreso: {challenge.progress}/{challenge.total}</span>
                  <span className="font-semibold" style={{ color: 'rgb(170, 70, 170)' }}>
                    {Math.round((challenge.progress / challenge.total) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-muted/30 h-2 overflow-hidden" style={{ borderColor: 'rgb(170, 70, 170)' }}>
                  <div
                    className="h-2 transition-all duration-700 ease-out"
                    style={{
                      width: `${Math.min(
                        (challenge.progress / challenge.total) * 100,
                        100
                      )}%`,
                      backgroundColor: 'rgb(170, 70, 170)'
                    }}
                  />
                </div>
              </div>

              {/* CTA Button */}
              {challenge.progress >= challenge.total ? (
                <Button
                  onClick={handleClaimReward}
                  disabled={claimingReward}
                  className="w-full mt-4 gap-2"
                  style={{ backgroundColor: 'rgb(170, 70, 170)', color: '#ffffff', borderRadius: '0px' }}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {claimingReward ? 'Reclamando...' : 'Reclamar Recompensa'}
                </Button>
              ) : (
                <div className="text-center text-xs text-muted-foreground mt-4 p-3" style={{ backgroundColor: 'rgba(170, 70, 170, 0.05)' }}>
                  Completa {challenge.total - challenge.progress} más para desbloquear esta recompensa
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  )
}
