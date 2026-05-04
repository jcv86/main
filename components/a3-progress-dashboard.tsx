'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, Target, TrendingUp, Zap, CheckCircle2, Flame, Star, Award, Sparkles } from 'lucide-react'

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

    const loadData = async () => {
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
        console.log('[v0] Progress data loaded:', data)
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

    const loadChallenge = async () => {
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

    // Initial load
    loadData()
    loadChallenge()

    // Refresh every 5 seconds to show live updates from training sessions
    const interval = setInterval(() => {
      console.log('[v0] Auto-refreshing progress data')
      loadData()
      loadChallenge()
    }, 5000)

    return () => clearInterval(interval)
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
      {/* GAMIFIED HEADER - Duolingo Style */}
      <div className="relative overflow-hidden rounded-lg p-8" style={{ backgroundColor: 'linear-gradient(135deg, rgba(170, 70, 170, 0.15) 0%, rgba(80, 160, 170, 0.1) 100%)', border: '2px solid rgb(170, 70, 170)' }}>
        {/* Animated background elements */}
        <div className="absolute top-0 right-0 w-40 h-40 opacity-10" style={{ backgroundColor: 'rgb(170, 70, 170)', borderRadius: '50%', animation: 'pulse 3s infinite' }} />
        <div className="absolute bottom-0 left-10 w-32 h-32 opacity-10" style={{ backgroundColor: 'rgb(80, 160, 170)', borderRadius: '50%', animation: 'pulse 4s infinite 1s' }} />
        
        <div className="relative z-10 space-y-6">
          {/* Level Badge + Streak */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Level Badge */}
              <div className="relative">
                <div className="w-20 h-20 rounded-full flex items-center justify-center font-bold text-2xl text-white" style={{ background: 'linear-gradient(135deg, rgb(170, 70, 170) 0%, rgb(80, 160, 170) 100%)', boxShadow: '0 8px 24px rgba(170, 70, 170, 0.4)' }}>
                  {progress.currentLevel}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-amber-400 rounded-full p-1" style={{ boxShadow: '0 4px 12px rgba(251, 191, 36, 0.4)' }}>
                  <Star className="w-5 h-5 text-amber-900 fill-amber-900" />
                </div>
              </div>
              
              <div>
                <p className="text-white font-bold text-lg">¡Excelente progreso!</p>
                <p className="text-sm text-white/80">Nivel {progress.currentLevel} - {progress.xpToNextLevel} XP para el próximo nivel</p>
              </div>
            </div>
            
            {/* Streak Display */}
            <div className="text-right">
              <div className="flex items-center justify-end gap-2 mb-2">
                <Flame className="w-6 h-6 text-orange-500" style={{ fill: 'currentColor' }} />
                <span className="text-3xl font-bold text-orange-500">{progress.streak}</span>
              </div>
              <p className="text-xs text-white/60">días seguidos</p>
            </div>
          </div>
          
          {/* XP Progress to Next Level */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-white">Experiencia Acumulada</span>
              <span className="text-sm font-bold" style={{ color: 'rgb(170, 70, 170)' }}>{progress.xpPoints} / {progress.xpPoints + progress.xpToNextLevel} XP</span>
            </div>
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-1000 ease-out rounded-full"
                style={{ 
                  width: `${(progress.xpPoints / (progress.xpPoints + progress.xpToNextLevel)) * 100}%`,
                  background: 'linear-gradient(90deg, rgb(170, 70, 170) 0%, rgb(236, 72, 153) 100%)',
                  boxShadow: '0 0 20px rgba(170, 70, 170, 0.6)'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main KPI Cards Grid - Training Colors */}
      <div className="grid grid-cols-3 gap-4">
        {/* Metric 1: Time - Blue */}
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 overflow-hidden border-0 relative" style={{ borderLeft: '4px solid rgb(59, 130, 246)' }}>
          <CardContent className="pt-6 pb-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <Clock className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-4xl font-bold text-white">{progress.totalMinutes}</p>
                <p className="text-xs mt-2 text-blue-300">minutos entrenado</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metric 2: Sessions - Purple (Training Primary) */}
        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 overflow-hidden border-0 relative" style={{ borderLeft: '4px solid rgb(170, 70, 170)' }}>
          <CardContent className="pt-6 pb-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <Target className="w-8 h-8" style={{ color: 'rgb(170, 70, 170)' }} />
              <div>
                <p className="text-4xl font-bold text-white">{progress.totalSessions}</p>
                <p className="text-xs mt-2" style={{ color: 'rgb(170, 70, 170)' }}>sesiones completadas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metric 3: Completion - Cyan/Teal */}
        <Card className="bg-gradient-to-br from-cyan-500/10 to-teal-600/5 overflow-hidden border-0 relative" style={{ borderLeft: '4px solid rgb(80, 160, 170)' }}>
          <CardContent className="pt-6 pb-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <TrendingUp className="w-8 h-8" style={{ color: 'rgb(80, 160, 170)' }} />
              <div>
                <p className="text-4xl font-bold text-white">{progress.completionPercentage}%</p>
                <p className="text-xs mt-2" style={{ color: 'rgb(80, 160, 170)' }}>del programa</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Badges Section - Achievements */}
      {progress.badges.length > 0 && (
        <Card className="bg-gradient-to-br from-amber-500/10 to-orange-600/5 border-0 overflow-hidden" style={{ borderLeft: '4px solid rgb(217, 119, 6)' }}>
          <CardContent className="pt-6 pb-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-white">Logros Desbloqueados</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {progress.badges.slice(0, 4).map((badge, idx) => (
                  <div key={idx} className="p-3 bg-white/5 rounded-lg border border-white/10 flex items-center gap-2 text-center" style={{ animation: `fadeIn 0.5s ease-out ${idx * 0.1}s both` }}>
                    <span className="text-lg">{badge.split(' ')[0]}</span>
                    <span className="text-xs text-white/80">{badge.split(' ').slice(1).join(' ')}</span>
                  </div>
                ))}
              </div>
              {progress.badges.length > 4 && (
                <p className="text-xs text-white/60 text-center">+ {progress.badges.length - 4} logros más</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overall Progress Section - Enhanced */}
      <Card className="bg-gradient-to-br from-purple-500/5 to-pink-600/5 border-0 overflow-hidden relative" style={{ borderLeft: '4px solid rgb(170, 70, 170)' }}>
        <CardContent className="pt-8 pb-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(170, 70, 170, 0.15)' }}>
                  <Sparkles className="w-5 h-5" style={{ color: 'rgb(170, 70, 170)' }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Progreso del Programa</p>
                  <p className="text-xs text-white/60">Camino hacia la maestría</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold" style={{ color: 'rgb(170, 70, 170)' }}>{progress.completionPercentage}%</p>
                <p className="text-xs text-white/60">completado</p>
              </div>
            </div>

            {/* Animated Progress Bar */}
            <div className="space-y-2">
              <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden" style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)' }}>
                <div
                  className="h-4 transition-all duration-1000 ease-out rounded-full"
                  style={{ 
                    width: `${progress.completionPercentage}%`, 
                    backgroundColor: 'rgb(170, 70, 170)',
                    boxShadow: '0 0 20px rgba(170, 70, 170, 0.6)',
                  }}
                />
              </div>
              <p className="text-xs text-white/60 text-center">Sigue entrenando para desbloquear nuevos desafíos</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Challenge Card - Duolingo Style */}
      {challenge && (
        <Card className="bg-gradient-to-br from-pink-500/10 to-rose-600/5 overflow-hidden border-0 relative" style={{ borderLeft: '4px solid rgb(236, 72, 153)' }}>
          <CardContent className="pt-6 pb-6">
            <div className="space-y-4">
              {/* Challenge Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-3 rounded-lg mt-0.5" style={{ backgroundColor: 'rgba(236, 72, 153, 0.15)' }}>
                    <Zap className="w-5 h-5 flex-shrink-0 text-pink-500" style={{ fill: 'currentColor' }} />
                  </div>
                  <div>
                    <p className="font-bold text-white text-base">Desafío Activo: {challenge.name}</p>
                    <p className="text-xs text-white/60 mt-0.5">{challenge.description}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 bg-gradient-to-br from-pink-500/20 to-rose-600/10 px-4 py-2 rounded-lg">
                  <p className="text-2xl font-bold text-pink-500">+{challenge.reward}</p>
                  <p className="text-xs text-white/60">puntos</p>
                </div>
              </div>

              {/* Challenge Progress */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-white">Progreso: {challenge.progress}/{challenge.total}</span>
                  <span className="text-sm font-bold text-pink-500">
                    {Math.round((challenge.progress / challenge.total) * 100)}%
                  </span>
                </div>
                <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden" style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)' }}>
                  <div
                    className="h-3 transition-all duration-700 ease-out rounded-full"
                    style={{
                      width: `${Math.min(
                        (challenge.progress / challenge.total) * 100,
                        100
                      )}%`,
                      backgroundColor: 'rgb(236, 72, 153)',
                      boxShadow: '0 0 15px rgba(236, 72, 153, 0.5)'
                    }}
                  />
                </div>
              </div>

              {/* CTA Button */}
              {challenge.progress >= challenge.total ? (
                <Button
                  onClick={handleClaimReward}
                  disabled={claimingReward}
                  className="w-full mt-4 gap-2 font-bold text-base py-6 hover:shadow-lg transition-shadow"
                  style={{ background: 'linear-gradient(135deg, rgb(170, 70, 170) 0%, rgb(236, 72, 153) 100%)', color: '#ffffff', border: 'none' }}
                >
                  <CheckCircle2 className="w-5 h-5" />
                  {claimingReward ? 'Reclamando...' : '¡Reclamar Recompensa!'}
                </Button>
              ) : (
                <div className="text-center text-sm font-semibold mt-4 p-4 rounded-lg" style={{ backgroundColor: 'rgba(236, 72, 153, 0.1)', color: 'rgb(236, 72, 153)' }}>
                  Completa {challenge.total - challenge.progress} más para desbloquear esta recompensa
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 0.1;
          }
          50% {
            opacity: 0.2;
          }
        }
      `}</style>

    </div>
  )
}
