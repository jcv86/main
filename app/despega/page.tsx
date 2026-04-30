'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { calculateReadinessScore, type ReadinessScore } from '@/lib/readiness-score'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Loader2, CheckCircle2, Clock, AlertCircle, TrendingUp, ArrowRight, Zap } from 'lucide-react'

interface UserProgress {
  a1_completed: boolean
  a2_completed: boolean
  a3_progress: any
  a4_active: boolean
}

export default function DespegazoDashboard() {
  const [readiness, setReadiness] = useState<ReadinessScore | null>(null)
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadUserProgress()
  }, [])

  const loadUserProgress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user?.id) {
        router.push('/auth/signin')
        return
      }

      setUserName(user.email?.split('@')[0] || 'User')

      const { data: a1 } = await supabase
        .from('a1_cerebral_assessment')
        .select('*')
        .eq('user_id', user.id)
        .limit(1)

      // If A1 is not completed, redirect to welcome page
      if (!a1 || a1.length === 0) {
        console.log('[v0] A1 not completed, redirecting to welcome')
        router.push('/despega/bienvenida')
        return
      }

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
      console.log('[v0] Progress loaded')
    } catch (err) {
      console.error('[v0] Error loading progress:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !progress || !readiness) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-purple/40" />
          <p className="text-white/85">Cargando tu dashboard...</p>
        </div>
      </div>
    )
  }

  const stages = [
    {
      name: 'A1: El Ritual',
      description: 'Descubre tu perfil DISC y potencial único',
      completed: progress.a1_completed,
      href: '/despega/a1-report',
      score: readiness.a1_completeness,
      icon: '🎯',
      color: 'from-purple/50'
    },
    {
      name: 'A2: Exploración',
      description: 'Tu plan personalizado de 90 días',
      completed: progress.a2_completed,
      href: '/despega/a2-routes',
      score: readiness.a2_completeness,
      icon: '🗺️',
      color: 'from-blue'
    },
    {
      name: 'A3: Entrenamiento',
      description: 'Prepárate para entrevistas y destaca',
      completed:
        progress.a3_progress.interview_0 &&
        progress.a3_progress.cv_prepared &&
        progress.a3_progress.market_insights,
      href: '/despega/a3',
      score: readiness.a3_completeness,
      icon: '⚡',
      color: 'from-blue'
    },
    {
      name: 'A4: La Realidad',
      description: 'Monitoreo continuo y oportunidades',
      completed: progress.a4_active,
      href: '/despega/a4-radar',
      score: readiness.a4_completeness,
      icon: '📡',
      color: 'from-blue/50'
    }
  ]

  const scoreColor =
    readiness.overall_score >= 80
      ? 'text-emerald-400'
      : readiness.overall_score >= 60
      ? 'text-yellow-400'
      : 'text-orange-400'

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Header - Improved */}
        <div className="mb-20">
          <div className="flex items-start gap-6 mb-8">
            <div className="text-6xl md:text-7xl">💫</div>
            <div className="flex-1">
              <h1 className="text-6xl md:text-7xl font-black text-white leading-tight mb-4">
                Tu Transformación <br/>
                Comienza Aquí
              </h1>
              <p className="text-xl text-white/90 max-w-3xl leading-relaxed">
                Sigue tu progreso a través de 4 etapas de desarrollo profesional intenso. 
                Alcanza el 80+ de readiness para estar completamente listo para oportunidades.
              </p>
            </div>
          </div>
          <div className="h-1 w-32 bg-gradient-to-r from-purple to-blue rounded-full"></div>
        </div>

        {/* Readiness Score Card - Improved */}
        <div className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Score Display */}
            <div className="lg:col-span-1 flex flex-col justify-center">
              <div className="bg-gradient-to-br from-purple/20 to-blue/20 border-2 border-purple/40 rounded-2xl p-10 text-center">
                <p className="text-white/75 text-lg font-semibold mb-3">Tu Readiness Score</p>
                <div className={`text-8xl font-black mb-4 ${scoreColor}`}>
                  {readiness.overall_score}
                </div>
                <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden border border-white/30 mb-4">
                  <div
                    className="h-full bg-gradient-to-r from-purple to-blue transition-all duration-500"
                    style={{ width: `${readiness.overall_score}%` }}
                  />
                </div>
                <p className="text-white/80 text-sm">
                  {readiness.overall_score >= 80 
                    ? '¡Listo para oportunidades!' 
                    : `${100 - readiness.overall_score} puntos para estar listo`}
                </p>
              </div>
            </div>

            {/* Next Steps */}
            <div className="lg:col-span-2">
              <h3 className="text-3xl font-bold text-white mb-8">Próximos Pasos Recomendados</h3>
              <div className="space-y-4">
                {readiness.recommendations.slice(0, 4).map((rec, i) => (
                  <div key={i} className="flex gap-4 p-5 bg-background/50 border border-white/10 rounded-xl hover:border-white/20 transition-all">
                    <div className="text-2xl flex-shrink-0">
                      {i === 0 ? '1️⃣' : i === 1 ? '2️⃣' : i === 2 ? '3️⃣' : '4️⃣'}
                    </div>
                    <p className="text-white/90 font-semibold leading-relaxed">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Strengths & Gaps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="bg-gradient-to-br from-green/20 to-emerald/20 border-2 border-green/40 rounded-2xl p-10">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <CheckCircle2 className="w-7 h-7 text-green" /> Tus Fortalezas
            </h3>
            <ul className="space-y-3">
              {readiness.strengths.length > 0 ? (
                readiness.strengths.map((strength, i) => (
                  <li key={i} className="text-white/90 text-lg font-semibold flex gap-3">
                    <span className="text-green">✓</span> {strength}
                  </li>
                ))
              ) : (
                <p className="text-white/75 italic">Completa más etapas para ver tus fortalezas</p>
              )}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-orange/20 to-red/20 border-2 border-orange/40 rounded-2xl p-10">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <AlertCircle className="w-7 h-7 text-orange" /> Áreas de Mejora
            </h3>
            <ul className="space-y-3">
              {readiness.gaps.length > 0 ? (
                readiness.gaps.map((gap, i) => (
                  <li key={i} className="text-white/90 text-lg font-semibold flex gap-3">
                    <span className="text-orange">→</span> {gap}
                  </li>
                ))
              ) : (
                <p className="text-green font-bold text-lg">¡Excelente! Todo completado, sigue adelante</p>
              )}
            </ul>
          </div>
        </div>

        {/* Progress by Stage - Better Cards */}
        <div className="mb-20">
          <h2 className="text-4xl font-black text-white mb-10">Tu Camino de 4 Etapas</h2>

          <div className="space-y-5">
            {stages.map((stage, i) => (
              <div
                key={i}
                onClick={() => router.push(stage.href)}
                className="group cursor-pointer bg-gradient-to-r from-background to-background/50 border-2 border-white/10 hover:border-white/30 rounded-2xl p-8 transition-all hover:shadow-xl"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-6 flex-1">
                    <div className="text-5xl flex-shrink-0">{stage.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-3xl font-black text-white group-hover:text-purple transition-colors">
                          {stage.name}
                        </h3>
                        <span className="text-sm font-bold px-3 py-1 rounded-full bg-white/10 text-white/75">
                          Etapa {i + 1}
                        </span>
                      </div>
                      <p className="text-white/80 text-lg">{stage.description}</p>
                    </div>
                  </div>
                  
                  {stage.completed ? (
                    <Badge className="bg-green/30 text-green border-2 border-green/50 ml-6 px-4 py-2 text-base font-bold">
                      ✓ Completado
                    </Badge>
                  ) : (
                    <div className="ml-6 text-center">
                      <div className="text-4xl font-black text-purple mb-1">{Math.round(stage.score)}%</div>
                      <p className="text-white/60 text-sm font-semibold">Progreso</p>
                    </div>
                  )}
                </div>

                <Progress value={stage.score} className="h-3 bg-white/20 rounded-full mb-6" />

                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push(stage.href)
                  }}
                  className={`w-full font-bold text-lg py-6 ${
                    stage.completed
                      ? 'bg-green/30 hover:bg-green/40 text-green border-2 border-green/50'
                      : 'bg-purple hover:bg-purple/90 text-white border-2 border-purple/50'
                  }`}
                >
                  {stage.completed ? 'Ver Resultados' : 'Continuar Ahora'}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Button
            onClick={() => router.push('/despega/conozcamonos-1')}
            variant="outline"
            className="h-16 border-2 border-white/30 hover:border-purple/60 text-white hover:text-purple font-bold text-lg rounded-xl"
          >
            <Clock className="w-6 h-6 mr-3" />
            Continuar Mi Jornada
          </Button>
          <Button
            onClick={() => loadUserProgress()}
            className="h-16 bg-purple hover:bg-purple/90 font-bold text-lg text-white rounded-xl border-2 border-purple/50"
          >
            <TrendingUp className="w-6 h-6 mr-3" />
            Actualizar Mi Progreso
          </Button>
        </div>

        {/* Motivational Footer */}
        <div className="bg-gradient-to-r from-purple/20 to-blue/20 border-2 border-purple/40 rounded-2xl p-8 text-center">
          <p className="text-white/90 text-lg font-semibold mb-3">
            🚀 Tu Score Se Actualiza Automáticamente
          </p>
          <p className="text-white/75">
            Alcanza <span className="font-bold text-purple">80+</span> para estar completamente listo. 
            Cada acción te acerca más a tu transformación.
          </p>
        </div>
      </div>
    </div>
  )
}
