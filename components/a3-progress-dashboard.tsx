'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, Target, TrendingUp, Zap, CheckCircle2, Flame, Star, Award, Sparkles, ArrowRight } from 'lucide-react'

interface ProgressData {
  totalMinutes: number
  totalSessions: number
  completionPercentage: number
  totalPointsEarned?: number
  totalPossiblePoints?: number
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
  achievement?: any
  nextAchievement?: any
  pointsToNextMilestone?: number
  unlockedAchievements?: any[]
  moduleProgress?: Record<string, number>
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
  const [isExpanded, setIsExpanded] = useState(false)

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
          totalPointsEarned: 0,
          totalPossiblePoints: 1000,
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
      {/* PROGRESS BAR - SIMPLIFIED PROFILE STYLE */}
      <div className="border-2 border-violet/40 rounded-lg p-6 transition-all hover:shadow-lg hover:bg-background/80" style={{ backgroundColor: 'rgb(5, 5, 5)' }}>
        <div className="space-y-4">
          {/* Header with Title and Progress % */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold" style={{ color: 'rgb(170, 70, 170)' }}>
                Progreso Entrenamiento
              </h3>
              <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(170, 70, 170, 0.1)', border: '1px solid rgba(170, 70, 170, 0.3)', color: 'rgb(170, 70, 170)' }}>
                Etapa 3
              </span>
            </div>
            <div className="text-right">
              <div style={{ color: 'rgb(170, 70, 170)', fontSize: '24px', fontWeight: 'bold' }}>
                {progress.completionPercentage}%
              </div>
              <p className="text-xs text-white/60">Progreso</p>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-white/70">Prepárate para entrevistas y destaca</p>

          {/* Simple Progress Bar */}
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full transition-all duration-1000 ease-out rounded-full"
              style={{ 
                width: `${progress.completionPercentage}%`,
                backgroundColor: 'rgb(170, 70, 170)',
                boxShadow: '0 0 8px rgba(170, 70, 170, 0.4)'
              }}
            />
          </div>

          {/* Action Button */}
          <Button 
            className="w-full font-bold text-sm py-4 transition-all active:scale-95 rounded-[20px] text-white border-2"
            style={{
              backgroundColor: 'rgb(170, 70, 170, 0.6)',
              borderColor: 'rgb(170, 70, 170, 0.6)'
            }}
          >
            Continuar Ahora
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Expandable Content Section */}
      {isExpanded && (
        <div className="space-y-4 animate-in fade-in duration-300">
          {/* Achievement Milestones */}
          {progress.unlockedAchievements && progress.unlockedAchievements.length > 0 && (
            <Card className="bg-gray-900 border-0 overflow-hidden" style={{ borderLeft: '3px solid rgb(170, 70, 170)' }}>
              <CardContent className="pt-6 pb-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-gray-400" />
                    <h3 className="font-bold text-white">Logros de Hito</h3>
                  </div>
                  
                  {/* Milestone Progress */}
                  <div className="space-y-3">
                    {/* Achievement Bars */}
                    <div className="flex gap-2 items-center">
                      {[0, 25, 50, 75, 100].map((milestone) => {
                        const isUnlocked = progress.completionPercentage >= milestone
                        return (
                          <div key={milestone} className="flex-1 text-center">
                            <div 
                              className="h-12 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-300"
                              style={{
                                backgroundColor: isUnlocked ? 'rgb(170, 70, 170)' : 'rgb(50, 50, 50)',
                                color: isUnlocked ? '#ffffff' : 'rgb(100, 100, 100)',
                                boxShadow: isUnlocked ? '0 0 12px rgba(170, 70, 170, 0.3)' : 'none',
                              }}
                            >
                              {milestone}%
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    
                    {/* Current Achievement */}
                    {progress.achievement && (
                      <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{progress.achievement.icon}</span>
                          <div className="flex-1">
                            <p className="font-bold text-white text-sm">{progress.achievement.title}</p>
                            <p className="text-xs text-gray-400">{progress.achievement.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-300">+{progress.achievement.points}</p>
                            <p className="text-xs text-gray-600">puntos</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Next Achievement */}
                    {progress.nextAchievement && progress.pointsToNextMilestone && progress.pointsToNextMilestone > 0 && (
                      <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 border-dashed">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl opacity-50">{progress.nextAchievement.icon}</span>
                          <div className="flex-1">
                            <p className="font-bold text-gray-500 text-sm">{progress.nextAchievement.title}</p>
                            <p className="text-xs text-gray-600">Próximo hito</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-500">{progress.pointsToNextMilestone} pts</p>
                            <p className="text-xs text-gray-600">para desbloquear</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Main KPI Cards Grid - Grayscale */}
          <div className="grid grid-cols-4 gap-4">
            {/* Metric 1: Time */}
            <Card className="bg-gray-900 overflow-hidden border-0 relative" style={{ borderLeft: '3px solid rgb(100, 100, 100)' }}>
              <CardContent className="pt-6 pb-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <Clock className="w-8 h-8 text-gray-400" />
                  <div>
                    <p className="text-4xl font-bold text-white">{progress.totalMinutes}</p>
                    <p className="text-xs mt-2 text-gray-500">minutos entrenado</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Metric 2: Sessions */}
            <Card className="bg-gray-900 overflow-hidden border-0 relative" style={{ borderLeft: '3px solid rgb(170, 70, 170)' }}>
              <CardContent className="pt-6 pb-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <Target className="w-8 h-8" style={{ color: 'rgb(170, 70, 170)' }} />
                  <div>
                    <p className="text-4xl font-bold text-white">{progress.totalSessions}</p>
                    <p className="text-xs mt-2 text-gray-500">sesiones completadas</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Metric 3: Points */}
            <Card className="bg-gray-900 overflow-hidden border-0 relative" style={{ borderLeft: '3px solid rgb(34, 197, 94)' }}>
              <CardContent className="pt-6 pb-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <Award className="w-8 h-8" style={{ color: 'rgb(34, 197, 94)' }} />
                  <div>
                    <p className="text-4xl font-bold text-white">{Math.round(progress.totalPointsEarned || 0)}</p>
                    <p className="text-xs mt-2 text-gray-500">puntos ganados</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Metric 4: Completion */}
            <Card className="bg-gray-900 overflow-hidden border-0 relative" style={{ borderLeft: '3px solid rgb(100, 100, 100)' }}>
              <CardContent className="pt-6 pb-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <TrendingUp className="w-8 h-8 text-gray-400" />
                  <div>
                    <p className="text-4xl font-bold text-white">{progress.completionPercentage}%</p>
                    <p className="text-xs mt-2 text-gray-500">del programa</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Points Section */}
          {progress.totalPointsEarned !== undefined && progress.totalPossiblePoints && (
            <Card className="bg-gray-900 overflow-hidden border-0 relative" style={{ borderLeft: '3px solid rgb(170, 70, 170)' }}>
              <CardContent className="pt-6 pb-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-gray-400" />
                      <span className="text-sm font-semibold text-white">Puntos Pillar 3</span>
                    </div>
                    <span className="text-2xl font-bold text-gray-300">{Math.round(progress.totalPointsEarned)} / {progress.totalPossiblePoints}</span>
                  </div>
                  <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-3 transition-all duration-1000 ease-out rounded-full"
                      style={{
                        width: `${(progress.totalPointsEarned / progress.totalPossiblePoints) * 100}%`,
                        backgroundColor: 'rgb(170, 70, 170)',
                        boxShadow: '0 0 8px rgba(170, 70, 170, 0.3)',
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 text-center">Completa las 7 partes de Pillar 3 para obtener 1000 puntos</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Badges Section - Achievements */}
          {progress.badges.length > 0 && (
            <Card className="bg-gray-900 border-0 overflow-hidden" style={{ borderLeft: '3px solid rgb(100, 100, 100)' }}>
              <CardContent className="pt-6 pb-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-gray-400" />
                    <h3 className="font-bold text-white">Logros Desbloqueados</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {progress.badges.slice(0, 4).map((badge, idx) => (
                      <div key={idx} className="p-3 bg-gray-800 rounded-lg border border-gray-700 flex items-center gap-2 text-center" style={{ animation: `fadeIn 0.5s ease-out ${idx * 0.1}s both` }}>
                        <span className="text-lg">{badge.split(' ')[0]}</span>
                        <span className="text-xs text-gray-400">{badge.split(' ').slice(1).join(' ')}</span>
                      </div>
                    ))}
                  </div>
                  {progress.badges.length > 4 && (
                    <p className="text-xs text-gray-600 text-center">+ {progress.badges.length - 4} logros más</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Overall Progress Section - Minimalist */}
          <Card className="bg-gray-900 border-0 overflow-hidden relative" style={{ borderLeft: '3px solid rgb(170, 70, 170)' }}>
            <CardContent className="pt-8 pb-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-gray-800">
                      <Sparkles className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Progreso General</p>
                      <p className="text-xs text-gray-500">Tu avance en el programa</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-gray-300">{progress.completionPercentage}%</p>
                    <p className="text-xs text-gray-600">completado</p>
                  </div>
                </div>

                {/* Animated Progress Bar */}
                <div className="space-y-2">
                  <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden" style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.4)' }}>
                    <div
                      className="h-4 transition-all duration-1000 ease-out rounded-full"
                      style={{ 
                        width: `${progress.completionPercentage}%`, 
                        backgroundColor: 'rgb(170, 70, 170)',
                        boxShadow: '0 0 8px rgba(170, 70, 170, 0.3)',
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 text-center">Continúa entrenando para desbloquear nuevos desafíos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Challenge Card - Minimalist */}
          {challenge && (
            <Card className="bg-gray-900 overflow-hidden border-0 relative" style={{ borderLeft: '3px solid rgb(170, 70, 170)' }}>
              <CardContent className="pt-6 pb-6">
                <div className="space-y-4">
                  {/* Challenge Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-3 rounded-lg mt-0.5 bg-gray-800">
                        <Zap className="w-5 h-5 flex-shrink-0 text-gray-400" style={{ fill: 'currentColor' }} />
                      </div>
                      <div>
                        <p className="font-bold text-white text-base">Desafío Activo: {challenge.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{challenge.description}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 bg-gray-800 px-4 py-2 rounded-lg">
                      <p className="text-2xl font-bold text-gray-300">+{challenge.reward}</p>
                      <p className="text-xs text-gray-600">puntos</p>
                    </div>
                  </div>

                  {/* Challenge Progress */}
                  <div className="space-y-3 pt-2 border-t border-gray-800">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-gray-400">Progreso: {challenge.progress}/{challenge.total}</span>
                      <span className="text-sm font-bold text-gray-400">
                        {Math.round((challenge.progress / challenge.total) * 100)}%
                      </span>
                    </div>
                    <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden" style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.4)' }}>
                      <div
                        className="h-3 transition-all duration-700 ease-out rounded-full"
                        style={{
                          width: `${Math.min(
                            (challenge.progress / challenge.total) * 100,
                            100
                          )}%`,
                          backgroundColor: 'rgb(170, 70, 170)',
                          boxShadow: '0 0 8px rgba(170, 70, 170, 0.3)'
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
                      style={{ backgroundColor: 'rgb(170, 70, 170)', color: '#ffffff', border: 'none' }}
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      {claimingReward ? 'Reclamando...' : 'Reclamar Recompensa'}
                    </Button>
                  ) : (
                    <div className="text-center text-sm font-semibold mt-4 p-4 rounded-lg bg-gray-800 text-gray-400">
                      Completa {challenge.total - challenge.progress} más para desbloquear esta recompensa
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
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
        @keyframes in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>

    </div>
  )
}
