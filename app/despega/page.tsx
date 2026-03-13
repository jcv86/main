'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { calculateReadinessScore, type ReadinessScore } from '@/lib/readiness-score'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Loader2, CheckCircle2, Clock, AlertCircle, TrendingUp } from 'lucide-react'

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

      // Get user name
      setUserName(user.email?.split('@')[0] || 'User')

      // Check A1
      const { data: a1 } = await supabase
        .from('user_a1_profiles')
        .select('*')
        .eq('user_id', user.id)
        .limit(1)

      // Check A2
      const { data: a2 } = await supabase
        .from('user_a2_routes')
        .select('*')
        .eq('user_id', user.id)
        .limit(1)

      // Check A3
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

      // Check A4
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

      // Calculate readiness
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <p className="text-slate-600 dark:text-slate-400">Cargando tu dashboard...</p>
        </div>
      </div>
    )
  }

  const stages = [
    {
      name: 'A1: Origen',
      description: 'Conozcamonos + DISC + Report',
      completed: progress.a1_completed,
      href: '/despega/a1-report',
      score: readiness.a1_completeness
    },
    {
      name: 'A2: Ruta',
      description: '30/60/90 días personalizados',
      completed: progress.a2_completed,
      href: '/despega/a2-routes',
      score: readiness.a2_completeness
    },
    {
      name: 'A3: Impulso',
      description: 'Interview + CV + Simulaciones',
      completed:
        progress.a3_progress.interview_0 &&
        progress.a3_progress.cv_prepared &&
        progress.a3_progress.market_insights,
      href: '/despega/a3-dashboard',
      score: readiness.a3_completeness
    },
    {
      name: 'A4: Radar',
      description: 'News + Progress + Monitoring',
      completed: progress.a4_active,
      href: '/despega/a4-radar',
      score: readiness.a4_completeness
    }
  ]

  const scoreColor =
    readiness.overall_score >= 80
      ? 'text-green-600 dark:text-green-400'
      : readiness.overall_score >= 60
      ? 'text-yellow-600 dark:text-yellow-400'
      : 'text-orange-600 dark:text-orange-400'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Hola {userName}! Tu Transformación Despega
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Sigue tu progreso a través de A1, A2, A3, A4
          </p>
        </div>

        {/* Readiness Score */}
        <Card className="p-8 mb-12 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className={`text-6xl font-bold ${scoreColor} mb-2`}>
                {readiness.overall_score}
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Readiness Score</p>
            </div>

            <div className="md:col-span-2">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">
                Recomendación:
              </h3>
              <div className="space-y-2">
                {readiness.recommendations.map((rec, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <TrendingUp className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-700 dark:text-slate-300">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Strengths and Gaps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="p-6 border-l-4 border-green-500">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Fortalezas
            </h3>
            <ul className="space-y-2">
              {readiness.strengths.length > 0 ? (
                readiness.strengths.map((strength, i) => (
                  <li key={i} className="flex gap-2 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    {strength}
                  </li>
                ))
              ) : (
                <p className="text-slate-500">Completa más etapas</p>
              )}
            </ul>
          </Card>

          <Card className="p-6 border-l-4 border-orange-500">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Áreas de Mejora
            </h3>
            <ul className="space-y-2">
              {readiness.gaps.length > 0 ? (
                readiness.gaps.map((gap, i) => (
                  <li key={i} className="flex gap-2 text-slate-700 dark:text-slate-300">
                    <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                    {gap}
                  </li>
                ))
              ) : (
                <p className="text-slate-500">¡Excelente, todo completo!</p>
              )}
            </ul>
          </Card>
        </div>

        {/* Progress by Stage */}
        <div className="space-y-6 mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Progreso por Etapa
          </h2>

          {stages.map((stage, i) => (
            <Card key={i} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {stage.name}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    {stage.description}
                  </p>
                </div>
                {stage.completed && (
                  <Badge className="bg-green-600 hover:bg-green-700">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Completo
                  </Badge>
                )}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Progreso</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {Math.round(stage.score)}%
                  </span>
                </div>
                <Progress value={stage.score} className="h-2" />
              </div>

              <Button
                onClick={() => router.push(stage.href)}
                variant={stage.completed ? 'outline' : 'default'}
                className={stage.completed ? '' : 'bg-purple-600 hover:bg-purple-700'}
              >
                {stage.completed ? 'Ver Detalles' : 'Continuar'}
              </Button>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <Button
            onClick={() => router.push('/despega/conozcamonos-1')}
            variant="outline"
            className="h-12"
          >
            <Clock className="w-4 h-4 mr-2" />
            Comenzar o Continuar
          </Button>
          <Button
            onClick={() => loadUserProgress()}
            className="h-12 bg-purple-600 hover:bg-purple-700"
          >
            Actualizar Progreso
          </Button>
        </div>

        {/* Footer */}
        <Card className="p-6 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
          <p className="text-blue-900 dark:text-blue-200 text-sm">
            <strong>Consejo:</strong> Tu Readiness Score se actualiza automáticamente conforme completas cada etapa. 
            Alcanza 80+ para estar completamente listo para aplicar a oportunidades.
          </p>
        </Card>
      </div>
    </div>
  )
}
