'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, Target, TrendingUp, Zap, CheckCircle2, Flame, Star, Award, Sparkles } from 'lucide-react'

interface RouteProgressData {
  totalDays: number
  completedDays: number
  completionPercentage: number
  currentLevel: number
  xpPoints: number
  xpToNextLevel: number
  badges: string[]
  streak: number
  routeName: string
  nextMilestone: string
}

interface RouteChallengeData {
  name: string
  description: string
  reward: number
  progress: number
  total: number
}

interface RouteProgressDashboardProps {
  routeName?: string
  totalDays?: number
  completedDays?: number
  streak?: number
  badges?: string[]
}

export default function RouteProgressDashboard({ 
  routeName = 'Tu Ruta',
  totalDays = 90,
  completedDays = 0,
  streak = 0,
  badges = []
}: RouteProgressDashboardProps) {
  const [progress, setProgress] = useState<RouteProgressData | null>(null)
  const [challenge, setChallenge] = useState<RouteChallengeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isHydrated, setIsHydrated] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (!isHydrated) return

    // Simulate loading route progress data
    setTimeout(() => {
      const completionPercentage = Math.round((completedDays / totalDays) * 100)
      const currentLevel = Math.floor(completedDays / 15) + 1
      const xpPoints = (completedDays % 15) * 67
      const xpToNextLevel = 1000 - xpPoints

      setProgress({
        totalDays,
        completedDays,
        completionPercentage,
        currentLevel,
        xpPoints,
        xpToNextLevel,
        badges,
        streak,
        routeName,
        nextMilestone: completedDays < 30 ? '30 días' : completedDays < 60 ? '60 días' : '90 días'
      })

      setChallenge({
        name: `Completa ${routeName}`,
        description: `${totalDays - completedDays} días restantes para terminar tu ruta`,
        reward: 500,
        progress: completedDays,
        total: totalDays
      })

      setLoading(false)
    }, 300)
  }, [isHydrated, completedDays, totalDays, routeName, streak, badges])

  if (!isHydrated || loading || !progress) {
    return null
  }

  const handleClaimReward = async () => {
    // Placeholder for reward logic
    console.log('[v0] Route challenge reward claimed')
  }

  return (
    <div className="space-y-6">
      {/* MINIMALIST HEADER - Only progress bar + expand button */}
      <div className="relative overflow-hidden rounded-lg p-8" style={{ backgroundColor: 'rgb(20, 20, 20)', border: '1px solid rgb(50, 50, 50)' }}>
        {/* Subtle animated background elements */}
        <div className="absolute top-0 right-0 w-40 h-40 opacity-5" style={{ backgroundColor: 'rgb(170, 70, 170)', borderRadius: '50%', animation: 'pulse 3s infinite' }} />
        <div className="absolute bottom-0 left-10 w-32 h-32 opacity-5" style={{ backgroundColor: 'rgb(170, 70, 170)', borderRadius: '50%', animation: 'pulse 4s infinite 1s' }} />
        
        <div className="relative z-10 space-y-6">
          {/* Level Badge + Streak */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Level Badge */}
              <div className="relative">
                <div className="w-20 h-20 rounded-full flex items-center justify-center font-bold text-2xl text-white" style={{ backgroundColor: 'rgb(170, 70, 170)', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)' }}>
                  {progress.currentLevel}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-gray-600 rounded-full p-1" style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)' }}>
                  <Star className="w-5 h-5 text-gray-300 fill-gray-300" />
                </div>
              </div>
              
              <div>
                <p className="text-white font-bold text-lg">{progress.routeName}</p>
                <p className="text-sm text-gray-400">Día {progress.completedDays} • Nivel {progress.currentLevel}</p>
              </div>
            </div>
            
            {/* Streak Display */}
            <div className="text-right">
              <div className="flex items-center justify-end gap-2 mb-2">
                <Flame className="w-6 h-6 text-gray-400" style={{ fill: 'currentColor' }} />
                <span className="text-3xl font-bold text-gray-300">{progress.streak}</span>
              </div>
              <p className="text-xs text-gray-500">días seguidos</p>
            </div>
          </div>
          
          {/* Progress to Next Milestone */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-300">Progreso</span>
              <span className="text-sm font-bold text-gray-400">{progress.completedDays} / {progress.totalDays} días</span>
            </div>
            <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-1000 ease-out rounded-full"
                style={{ 
                  width: `${progress.completionPercentage}%`,
                  backgroundColor: 'rgb(170, 70, 170)',
                  boxShadow: '0 0 8px rgba(170, 70, 170, 0.4)'
                }}
              />
            </div>
          </div>

          {/* "Leer más" Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm font-medium text-gray-400 hover:text-white transition-colors pt-2"
          >
            {isExpanded ? '↓ Ver menos' : '↑ Leer más'}
          </button>
        </div>
      </div>

      {/* Expandable Content Section */}
      {isExpanded && (
        <div className="space-y-4 animate-in fade-in duration-300">
          {/* Main KPI Cards Grid */}
          <div className="grid md:grid-cols-3 gap-4">
            {/* Days Completed */}
            <Card className="bg-gray-900 overflow-hidden border-0 relative" style={{ borderLeft: '3px solid rgb(100, 100, 100)' }}>
              <CardContent className="pt-6 pb-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <Clock className="w-8 h-8 text-gray-400" />
                  <div>
                    <p className="text-4xl font-bold text-white">{progress.completedDays}</p>
                    <p className="text-xs mt-2 text-gray-500">días completados</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Days Remaining */}
            <Card className="bg-gray-900 overflow-hidden border-0 relative" style={{ borderLeft: '3px solid rgb(170, 70, 170)' }}>
              <CardContent className="pt-6 pb-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <Target className="w-8 h-8" style={{ color: 'rgb(170, 70, 170)' }} />
                  <div>
                    <p className="text-4xl font-bold text-white">{progress.totalDays - progress.completedDays}</p>
                    <p className="text-xs mt-2 text-gray-500">días restantes</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Completion % */}
            <Card className="bg-gray-900 overflow-hidden border-0 relative" style={{ borderLeft: '3px solid rgb(100, 100, 100)' }}>
              <CardContent className="pt-6 pb-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <TrendingUp className="w-8 h-8 text-gray-400" />
                  <div>
                    <p className="text-4xl font-bold text-white">{progress.completionPercentage}%</p>
                    <p className="text-xs mt-2 text-gray-500">completado</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

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

          {/* Overall Progress Section */}
          <Card className="bg-gray-900 border-0 overflow-hidden relative" style={{ borderLeft: '3px solid rgb(170, 70, 170)' }}>
            <CardContent className="pt-8 pb-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-gray-800">
                      <Sparkles className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Progreso de Ruta</p>
                      <p className="text-xs text-gray-500">Tu avance en {progress.routeName}</p>
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
                  <p className="text-xs text-gray-600 text-center">Próximo hito: {progress.nextMilestone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Challenge Card */}
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
                        <p className="font-bold text-white text-base">{challenge.name}</p>
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
      `}</style>
    </div>
  )
}
