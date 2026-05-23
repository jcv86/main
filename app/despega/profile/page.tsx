'use client'

import { useEffect, useState } from 'react'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { createClient } from '@/lib/supabase/client'
import { calculateReadinessScore, type ReadinessScore } from '@/lib/readiness-score'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Flame, Trophy, Zap, Award, User, LogOut, Settings, ArrowRight, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface GlobalGamificationData {
  total_xp: number
  current_level: number
  xp_to_next_level: number
  daily_streak: number
  total_points: number
  badges: string[]
  sections: Record<string, any>
  breakdown: {
    a3_xp: number
    a4_xp: number
    interview_bonus: number
  }
}

interface UserProgress {
  a1_completed: boolean
  a2_completed: boolean
  a3_progress: any
  a4_active: boolean
}

export default function ProfileDashboard() {
  const { user } = useAuthRedirect()
  const router = useRouter()
  const supabase = createClient()
  
  const [data, setData] = useState<GlobalGamificationData | null>(null)
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [readiness, setReadiness] = useState<ReadinessScore | null>(null)
  const [a3Progress, setA3Progress] = useState<{ progress: number; total_points: number }>({ progress: 0, total_points: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProgress = async () => {
      try {
        // Load gamification data
        const response = await fetch('/api/gamification/global')
        if (response.ok) {
          const gamificationData = await response.json()
          setData(gamificationData)
        }

        // Load A3 progress data (to sync with A3 dashboard)
        let a3ProgressData = { progress: 0, total_points: 0 }
        try {
          const a3Response = await fetch('/api/a3/progress', { credentials: 'include' })
          if (a3Response.ok) {
            const a3Data = await a3Response.json()
            a3ProgressData = { progress: a3Data.completionPercentage || 0, total_points: a3Data.totalPointsEarned || 0 }
            setA3Progress(a3ProgressData)
          }
        } catch (error) {
          console.error('[v0] Error fetching A3 progress:', error)
        }

        // Load stage progress data
        if (user?.id) {
          const { data: a1 } = await supabase
            .from('a1_cerebral_assessment')
            .select('*')
            .eq('user_id', user.id)
            .limit(1)

          const { data: a2 } = await supabase
            .from('user_a2_routes')
            .select('*')
            .eq('user_id', user.id)
            .limit(1)

          const { data: interview0 } = await supabase
            .from('user_a3_interview_0')
            .select('id')
            .eq('user_id', user.id)
            .limit(1)

          const { data: cv } = await supabase
            .from('user_a3_cv')
            .select('id')
            .eq('user_id', user.id)
            .limit(1)

          const { data: market } = await supabase
            .from('user_a3_market_insights')
            .select('id')
            .eq('user_id', user.id)
            .limit(1)

          const { data: sims } = await supabase
            .from('user_a3_simulations')
            .select('id')
            .eq('user_id', user.id)

          const { data: a4 } = await supabase
            .from('user_a4_radar')
            .select('*')
            .eq('user_id', user.id)
            .limit(1)

          const userProgress: UserProgress = {
            a1_completed: !!a1?.length,
            a2_completed: !!a2?.length,
            a3_progress: {
              interview_0: !!interview0?.length,
              cv_prepared: !!cv?.length,
              market_insights: !!market?.length,
              simulations_done: sims?.length || 0
            },
            a4_active: !!a4?.length
          }

          setProgress(userProgress)

          const score = calculateReadinessScore(
            userProgress.a1_completed,
            a1?.[0],
            userProgress.a2_completed,
            a2?.[0],
            userProgress.a3_progress,
            userProgress.a4_active
          )

          setReadiness(score)
        }
      } catch (error) {
        console.error('[v0] Error loading progress:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProgress()
  }, [user, supabase])

  const handleLogout = async () => {
    await fetch('/api/auth/signout', { method: 'POST' })
    router.push('/auth/signin')
  }

  if (loading || !progress || !readiness) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple"></div>
          <p className="text-muted-foreground">Cargando tu perfil...</p>
        </div>
      </div>
    )
  }

  const levelNames = ['Novato', 'Aprendiz', 'Competente', 'Experto', 'Maestro', 'Leyenda']
  const levelName = levelNames[Math.min(data?.current_level ? data.current_level - 1 : 0, levelNames.length - 1)]
  const xpPercentage = data ? (data.total_xp % 1000) / 10 : 0

  const stages = [
  {
  name: 'Progreso El Ritual',
  description: 'Descubre tu perfil DISC y potencial único',
  completed: progress.a1_completed,
  href: '/despega/a1-report',
  score: readiness.a1_completeness,
  },
  {
  name: 'Progreso Exploración',
  description: 'Tu plan personalizado de 90 días',
  completed: progress.a2_completed,
  href: '/despega/a2-routes',
  score: readiness.a2_completeness,
  },
  {
  name: 'Progreso Entrenamiento',
  description: 'Prepárate para entrevistas y destaca',
  completed:
  progress.a3_progress.interview_0 &&
  progress.a3_progress.cv_prepared &&
  progress.a3_progress.market_insights,
  href: '/despega/a3',
  score: a3Progress.progress, // Use synced A3 progress instead of readiness calculation
  },
  {
  name: 'Progreso La Realidad',
  description: 'Monitoreo continuo y oportunidades',
  completed: progress.a4_active,
  href: '/despega/a4-radar',
  score: readiness.a4_completeness,
  }
  ]

  return (
    <main className="min-h-screen bg-background py-12">
      <div className="container max-w-5xl mx-auto px-4 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-white flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue/40 to-purple/40 border border-white/20 flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              Mi Perfil
            </h1>
            <p className="text-white/70">Tu resumen de progreso y logros</p>
          </div>
          <Link href="/despega/settings">
            <Button variant="outline" size="sm" className="gap-2 border-white/20 text-white hover:bg-white/10">
              <Settings className="w-4 h-4" />
              Preferencias
            </Button>
          </Link>
        </div>

        {/* User Info Card */}
        <Card className="border-white/10 bg-white/5">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-white/60 uppercase tracking-wider mb-1">Nombre</p>
                  <p className="text-2xl font-bold text-white">
                    {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuario'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-white/60 uppercase tracking-wider mb-1">Email</p>
                  <p className="text-white/80">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-[rgb(80,160,170)]/80 hover:text-[rgb(80,160,170)]-400 hover:bg-[rgba(80,160,170,0.6)]-500/10 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Salir
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Main Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Level and XP Card */}
          <Card className="border-cyan/30 bg-gradient-to-br from-cyan/10 to-background" style={{ borderColor: 'rgba(80, 160, 170, 0.4)', backgroundColor: 'rgba(80, 160, 170, 0.1)' }}>
            <CardContent className="pt-6 pb-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Nivel Actual</p>
                    <p className="text-4xl font-bold text-white">{levelName}</p>
                    <p className="text-sm mt-1" style={{ color: 'rgba(80, 160, 170, 0.8)' }}>Nivel {data?.current_level || 0}</p>
                  </div>
                  <Zap className="w-12 h-12" style={{ color: 'rgba(80, 160, 170, 0.6)' }} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">XP Total</span>
                    <span className="font-bold text-white">{data?.total_xp.toLocaleString() || 0}</span>
                  </div>
                  <div className="w-full bg-muted/40 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple to-purple/60 h-3 rounded-full transition-all"
                      style={{ width: `${xpPercentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-right">
                    {data?.xp_to_next_level || 0} XP para siguiente nivel
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Points Card */}
          <Card className="border-cyan/30 bg-gradient-to-br from-cyan/10 to-background" style={{ borderColor: 'rgba(80, 160, 170, 0.4)', backgroundColor: 'rgba(80, 160, 170, 0.2)' }}>
            <CardContent className="pt-6 pb-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Puntos Disponibles</p>
                    <p className="text-4xl font-bold" style={{ color: 'rgba(80, 160, 170, 0.6)' }}>{data?.total_points || 0}</p>
                    <p className="text-sm mt-1" style={{ color: 'rgba(80, 160, 170)' }}>Moneda Acumulada</p>
                  </div>
                  <Award className="w-12 h-12" style={{ color: 'rgba(80, 160, 170, 0.6)' }} />
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-white/70">Usa tus puntos en diferentes partes del portal</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Readiness Score Card */}
          <Card className="border-cyan/30 bg-gradient-to-br from-cyan/10 to-background" style={{ borderColor: 'rgba(80, 160, 170, 0.4)', backgroundColor: 'rgba(80, 160, 170, 0.3)' }}>
            <CardContent className="pt-6 pb-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Readiness Score</p>
                    <p className="text-4xl font-bold" style={{ color: 'rgba(80, 160, 170, 0.6)' }}>{readiness.overall_score}</p>
                    <p className="text-sm mt-1" style={{ color: 'rgba(80, 160, 170)' }}>Progreso Global</p>
                  </div>
                  <Trophy className="w-12 h-12" style={{ color: 'rgba(80, 160, 170, 0.6)' }} />
                </div>

                <div className="space-y-2">
                  <div className="w-full bg-muted/40 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-orange to-orange/60 h-3 rounded-full transition-all"
                      style={{ width: `${readiness.overall_score}%` }}
                    />
                  </div>
                  <p className="text-xs text-white/70 text-center">
                    {readiness.overall_score >= 80 
                      ? '¡Listo para oportunidades!' 
                      : `${100 - readiness.overall_score} puntos para estar listo`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Streak Card */}
        {data?.daily_streak !== undefined && (
          <Card className="border-cyan/30 bg-gradient-to-br from-cyan/10 to-background">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Racha Actual</p>
                  <p className="text-4xl font-bold" style={{ color: 'rgba(80, 160, 170, 0.8)' }}>{data.daily_streak}</p>
                  <p className="text-sm mt-1" style={{ color: 'rgba(80, 160, 170)' }}>días consecutivos</p>
                </div>
                <Flame className="w-12 h-12" style={{ color: 'rgba(80, 160, 170, 0.4)' }} />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tu Camino de 4 Etapas */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Tu Camino de 4 Etapas</h2>
          <div className="space-y-3">
            {stages.map((stage, i) => {
              const stageColors = [
                { border: 'border-cyan/40', bg: 'bg-cyan/5', hover: 'hover:border-cyan/60', text: 'text-cyan', progress: 'from-cyan to-cyan/60', label: 'text-cyan' },
                { border: 'border-indigo/40', bg: 'bg-indigo/5', hover: 'hover:border-indigo/60', text: 'text-indigo', progress: 'from-indigo to-indigo/60', label: 'text-indigo' },
                { border: 'border-violet/40', bg: 'bg-violet/5', hover: 'hover:border-violet/60', text: 'text-violet', progress: 'from-violet to-violet/60', label: 'text-violet' },
                { border: 'border-rose/40', bg: 'bg-rose/5', hover: 'hover:border-rose/60', text: 'text-rose', progress: 'from-rose to-rose/60', label: 'text-rose' }
              ]
              const colors = stageColors[i]

              return (
                <div
                  key={i}
                  onClick={() => router.push(stage.href)}
                  className={`group cursor-pointer bg-gradient-to-r from-background to-background/50 border-2 rounded-lg p-6 transition-all hover:shadow-xl hover:bg-background/80`}
                  style={{
                    borderColor: i === 0 ? 'rgba(80, 160, 170, 0.6)'
                      : i === 1 ? 'rgba(90, 90, 150, 0.6)'
                      : i === 2 ? 'rgba(170, 70, 170, 0.4)'
                      : 'rgba(225, 120, 130, 0.4)'
                  }}
                >
                  <div className="flex items-start justify-between gap-6 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 
                          className={`text-xl font-bold transition-colors`}
                          style={{ 
                            color: i === 0 ? 'rgba(80, 160, 170, 0.8)' 
                              : i === 1 ? 'rgb(90, 90, 150)' 
                              : i === 2 ? 'rgb(170, 70, 170)' 
                              : 'rgb(225, 120, 130)'
                          }}
                        >
                          {stage.name}
                        </h3>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${colors.bg} border border-white/20`}
                          style={{
                            color: i === 0 ? 'rgb(246, 245, 244)' 
                              : i === 1 ? 'rgb(246, 245, 244)'
                              : i === 2 ? 'rgb(246, 245, 244)'
                              : 'rgb(246, 245, 244)'
                          }}
                        >
                          Etapa {i + 1}
                        </span>
                      </div>
                      <p className="text-white/80 text-sm">{stage.description}</p>
                    </div>
                    
                    {stage.completed ? (
                      <Badge className={`bg-green/30 text-green border-2 border-green/50 px-3 py-1 text-xs font-bold flex-shrink-0 h-fit`}>
                        Completado
                      </Badge>
                  ) : (
                  <div className="text-center flex-shrink-0">
                  <div 
                    className={`text-2xl font-bold mb-0.5`}
                    style={{
                      color: i === 0 ? 'rgba(80, 160, 170, 0.8)'
                        : i === 1 ? 'rgb(90, 90, 150, 0.8)'
                        : i === 2 ? 'rgb(170, 70, 170, 0.8)'
                        : 'rgb(225, 120, 130, 0.8)'
                    }}
                  >
                    {Math.round(stage.score)}%
                  </div>
                  <p className="text-white/60 text-xs font-semibold">Progreso</p>
                  </div>
                  )}
                  </div>

                  <div className={`w-full bg-muted/40 rounded-full h-2 overflow-hidden mb-4`}>
                    <div
                      className={`bg-gradient-to-r ${colors.progress} h-2 rounded-full transition-all`}
                      style={{ width: `${stage.score}%` }}
                    />
                  </div>

                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(stage.href)
                    }}
                    className={`w-full font-bold text-sm py-4 transition-all active:scale-95 rounded-[20px] text-white border-2`}
                    style={{
                      backgroundColor: i === 0 ? 'rgba(80, 160, 170, 0.6)'
                        : i === 1 ? 'rgb(90, 90, 150, 0.6)'
                        : i === 2 ? 'rgb(170, 70, 170, 0.6)'
                        : 'rgb(225, 120, 130, 0.6)',
                      borderColor: i === 0 ? 'rgba(80, 160, 170, 0.6)'
                        : i === 1 ? 'rgb(90, 90, 150, 0.6)'
                        : i === 2 ? 'rgb(170, 70, 170, 0.6)'
                        : 'rgb(225, 120, 130, 0.6)'
                    }}
                  >
                    {stage.completed ? 'Ver Resultados' : 'Continuar Ahora'}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Section Performance */}
        {data?.sections && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Desempeño por Sección</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {data.sections?.a3 && (
                <Card className="border-purple/30 bg-purple/5 hover:border-purple/50 transition-colors" style={{ borderColor: 'rgba(170, 70, 170, 0.3)', backgroundColor: 'rgba(170, 70, 170, 0.05)' }}>
                  <CardContent className="pt-6 pb-6">
                    <p className="text-sm uppercase tracking-wider font-semibold mb-3" style={{ color: 'rgb(170, 70, 170)' }}>
                      {data.sections.a3.name}
                    </p>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-white/70 text-sm">XP Ganado</span>
                        <span className="font-bold" style={{ color: 'rgb(170, 70, 170)' }}>{data.sections.a3.xp}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70 text-sm">Progreso</span>
                        <span className="font-bold" style={{ color: 'rgba(170, 70, 170, 0.8)' }}>{data.sections.a3.progress}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {data.sections?.a4 && (
                <Card className="border-red/30 bg-red/5 hover:border-[rgb(80,160,170)]/50 transition-colors">
                  <CardContent className="pt-6 pb-6">
                    <p className="text-sm text-red uppercase tracking-wider font-semibold mb-3">
                      {data.sections.a4.name}
                    </p>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-white/70 text-sm">XP Ganado</span>
                        <span className="font-bold text-red">{data.sections.a4.xp}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70 text-sm">Progreso</span>
                        <span className="font-bold text-red/80">{data.sections.a4.progress}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Badges */}
        {data?.badges && data.badges.length > 0 && (
          <Card className="border-purple/30 bg-purple/5">
            <CardContent className="pt-6 pb-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-purple" />
                Logros Desbloqueados
              </h3>
              <div className="grid md:grid-cols-3 gap-3">
                {data.badges.map((badge, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-muted/40 text-center border border-white/10">
                    <p className="text-white font-semibold text-sm">{badge}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}
