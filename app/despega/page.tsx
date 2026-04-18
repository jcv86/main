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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple to-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-purple/50" />
          <p className="text-muted/30">Cargando tu dashboard...</p>
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
      color: 'from-purple/50 to-blue'
    },
    {
      name: 'A2: Exploración',
      description: 'Tu plan personalizado de 90 días',
      completed: progress.a2_completed,
      href: '/despega/a2-routes',
      score: readiness.a2_completeness,
      icon: '🗺️',
      color: 'from-blue to-blue'
    },
    {
      name: 'A3: Entrenamiento',
      description: 'Prepárate para entrevistas y destaca',
      completed:
        progress.a3_progress.interview_0 &&
        progress.a3_progress.cv_prepared &&
        progress.a3_progress.market_insights,
      href: '/despega/a3-dashboard',
      score: readiness.a3_completeness,
      icon: '⚡',
      color: 'from-blue to-blue'
    },
    {
      name: 'A4: La Realidad',
      description: 'Monitoreo continuo y oportunidades',
      completed: progress.a4_active,
      href: '/despega/a4-radar',
      score: readiness.a4_completeness,
      icon: '📡',
      color: 'from-blue/50 to-green'
    }
  ]

  const scoreColor =
    readiness.overall_score >= 80
      ? 'text-emerald-400'
      : readiness.overall_score >= 60
      ? 'text-yellow/40'
      : 'text-orange/40'

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple via-background to-muted/90 text-white p-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Hero Header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-8 h-8 text-purple/40" />
            <h1 className="text-5xl md:text-6xl font-black text-white leading-tight">
              Tu Transformación <br />
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-blue/40 bg-clip-text text-transparent">
                Despega
              </span>
            </h1>
          </div>
          <p className="text-lg text-muted/40 max-w-2xl">
            Sigue tu progreso a través de 4 etapas de desarrollo profesional. 
            Alcanza el 80+ de readiness para estar completamente listo.
          </p>
        </div>

        {/* Readiness Score - Premium */}
        <div className="mb-16 bg-gradient-to-br from-purple/40 to-blue-900/40 border border-purple/50/20 rounded-2xl p-12 backdrop-blur">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center justify-center">
              <div className={`text-7xl font-black ${scoreColor} mb-2`}>
                {readiness.overall_score}
              </div>
              <p className="text-muted/40 text-sm font-semibold">Readiness Score</p>
              <div className="mt-4 w-full h-1 bg-muted/80 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${scoreColor === 'text-emerald-400' ? 'from-green/50 to-blue/40' : scoreColor === 'text-yellow/40' ? 'from-yellow-500 to-orange-400' : 'from-orange/50 to-red-400'} transition-all duration-500`}
                  style={{ width: `${readiness.overall_score}%` }}
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-xl font-bold text-white mb-6">Próximos Pasos</h3>
              <div className="space-y-3">
                {readiness.recommendations.slice(0, 3).map((rec, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <Zap className="w-5 h-5 text-purple/40 flex-shrink-0 mt-1" />
                    <p className="text-muted/20">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Strengths & Gaps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="bg-gradient-to-br from-green/40 to-blue/40 border border-green/20 rounded-xl p-6">
            <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" /> Fortalezas
            </h3>
            <ul className="space-y-2">
              {readiness.strengths.length > 0 ? (
                readiness.strengths.map((strength, i) => (
                  <li key={i} className="text-muted/30 text-sm">{strength}</li>
                ))
              ) : (
                <p className="text-muted/50">Completa más etapas</p>
              )}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-orange/40 to-red-900/40 border border-orange/20 rounded-xl p-6">
            <h3 className="text-lg font-bold text-orange/40 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" /> Áreas de Mejora
            </h3>
            <ul className="space-y-2">
              {readiness.gaps.length > 0 ? (
                readiness.gaps.map((gap, i) => (
                  <li key={i} className="text-muted/30 text-sm">{gap}</li>
                ))
              ) : (
                <p className="text-emerald-400 font-semibold">¡Excelente, todo completo!</p>
              )}
            </ul>
          </div>
        </div>

        {/* Progress by Stage - Modern Cards */}
        <div className="space-y-4 mb-16">
          <h2 className="text-3xl font-bold text-white">Tu Camino de 4 Etapas</h2>

          {stages.map((stage, i) => (
            <div
              key={i}
              onClick={() => router.push(stage.href)}
              className="group cursor-pointer bg-gradient-to-r from-muted/80/50 to-muted/70/30 border border-muted/70/50 hover:border-muted/60 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{stage.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white group-hover:text-purple/40 transition-colors">
                      {stage.name}
                    </h3>
                    <p className="text-muted/40 text-sm mt-1">{stage.description}</p>
                  </div>
                </div>
                {stage.completed ? (
                  <Badge className="bg-green/50/20 text-emerald-400 border border-green/50 ml-4">
                    ✓ Completo
                  </Badge>
                ) : (
                  <Badge className="bg-purple/50/20 text-purple/40 border border-purple/50/50 ml-4">
                    {Math.round(stage.score)}%
                  </Badge>
                )}
              </div>

              <div className="space-y-2 mb-4">
                <Progress value={stage.score} className="h-2 bg-muted/70" />
              </div>

              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  router.push(stage.href)
                }}
                className={`w-full group/btn ${
                  stage.completed
                    ? 'bg-muted/70 hover:bg-muted/60 text-muted/30'
                    : `bg-gradient-to-r ${stage.color} hover:shadow-lg text-white font-semibold`
                }`}
              >
                {stage.completed ? 'Ver Detalles' : 'Continuar'}
                <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Button
            onClick={() => router.push('/despega/conozcamonos-1')}
            variant="outline"
            className="h-12 border-muted/60 hover:border-purple/50 text-white hover:text-purple/40"
          >
            <Clock className="w-4 h-4 mr-2" />
            Comenzar o Continuar
          </Button>
          <Button
            onClick={() => loadUserProgress()}
            className="h-12 bg-purple hover:bg-purple font-semibold"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Actualizar Progreso
          </Button>
        </div>

        {/* Footer Note */}
        <div className="bg-muted/80/40 border border-muted/70 rounded-[28px] p-4 text-center">
          <p className="text-muted/40 text-sm">
            💡 Tu score se actualiza automáticamente. Alcanza <span className="font-bold text-purple/40">80+</span> para estar completamente listo.
          </p>
        </div>
      </div>
    </div>
  )
}
