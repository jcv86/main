'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, Video, FileText, Briefcase, TrendingUp, CheckCircle2, Clock } from 'lucide-react'

interface A3Progress {
  interview_0: boolean
  cv_prepared: boolean
  market_insights: boolean
  simulations_done: number
}

export default function A3DashboardPage() {
  const [progress, setProgress] = useState<A3Progress | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user, loading: authLoading } = useAuthRedirect()
  const supabase = createClient()

  useEffect(() => {
    if (authLoading || !user?.id) return
    loadProgress()
  }, [authLoading, user?.id])

  const loadProgress = async () => {
    try {
      // Check Interview 0
      const { data: interview } = await supabase
        .from('user_a3_interview_0')
        .select('id')
        .eq('user_id', user?.id)
        .limit(1)

      // Check CV
      const { data: cv } = await supabase
        .from('user_a3_cv')
        .select('id')
        .eq('user_id', user?.id)
        .limit(1)

      // Check Market Insights
      const { data: market } = await supabase
        .from('user_a3_market_insights')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)

      // Check Simulations
      const { data: sims } = await supabase
        .from('user_a3_simulations')
        .select('id')
        .eq('user_id', user.id)

      setProgress({
        interview_0: !!interview?.length,
        cv_prepared: !!cv?.length,
        market_insights: !!market?.length,
        simulations_done: sims?.length || 0
      })

      console.log('[v0] A3 progress loaded')
    } catch (err) {
      console.error('[v0] Error loading A3 progress:', err)
      setError('Error al cargar progreso')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <p className="text-slate-600 dark:text-slate-400">Cargando tu progreso A3...</p>
        </div>
      </div>
    )
  }

  if (!progress) return null

  const completedItems = [
    progress.interview_0,
    progress.cv_prepared,
    progress.market_insights,
    progress.simulations_done >= 2
  ].filter(Boolean).length

  const completionPercentage = (completedItems / 4) * 100

  const activityCards = [
    {
      icon: Video,
      title: 'Interview 0: Tu Pitch Personal',
      description: 'Practica tus respuestas a las 5 preguntas clave para cualquier entrevista',
      status: progress.interview_0 ? 'completed' : 'pending',
      action: progress.interview_0 ? 'Ver respuestas' : 'Comenzar',
      href: '/despega/interview-0'
    },
    {
      icon: FileText,
      title: 'CV Builder',
      description: 'Crea o actualiza tu CV con ATS optimization para el rol objetivo',
      status: progress.cv_prepared ? 'completed' : 'pending',
      action: progress.cv_prepared ? 'Editar CV' : 'Crear CV',
      href: '/despega/cv-builder'
    },
    {
      icon: TrendingUp,
      title: 'Market Intelligence',
      description: 'Analiza el mercado: salarios, tendencias, empresas que contratan',
      status: progress.market_insights ? 'completed' : 'pending',
      action: progress.market_insights ? 'Ver análisis' : 'Generar análisis',
      href: '/despega/market-insights'
    },
    {
      icon: Briefcase,
      title: 'Entrenamiento de Entrevista',
      description: 'Practica con entrenamientos realistas de entrevistas técnicas y conductuales',
      status: progress.simulations_done >= 2 ? 'completed' : 'pending',
      action: `${progress.simulations_done > 0 ? `${progress.simulations_done} completadas` : 'Comenzar'}`,
      href: '/despega/interview-simulations'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            A3: Impulso - Preparación Integral
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Domina cada aspecto de tu candidatura y entrevistas
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="p-8 mb-8 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Tu Progreso A3
            </h2>
            <div className="text-right">
              <div className="text-4xl font-bold text-purple-600">{Math.round(completionPercentage)}%</div>
              <p className="text-slate-600 dark:text-slate-400 text-sm">{completedItems} de 4 completados</p>
            </div>
          </div>
          <div className="h-3 bg-slate-300 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full transition-all"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </Card>

        {/* Activity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {activityCards.map((card, i) => {
            const Icon = card.icon
            const isCompleted = card.status === 'completed'

            return (
              <Card key={i} className={`p-6 hover:shadow-lg transition ${isCompleted ? 'bg-green-50 dark:bg-green-950' : ''}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900">
                    <Icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  {isCompleted && (
                    <Badge className="bg-green-600 hover:bg-green-700">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Completado
                    </Badge>
                  )}
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {card.title}
                </h3>

                <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
                  {card.description}
                </p>

                <Button
                  onClick={() => router.push(card.href)}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {card.action}
                </Button>
              </Card>
            )
          })}
        </div>

        {/* Tips */}
        <Card className="p-6 mb-8 border-l-4 border-blue-500">
          <h3 className="font-bold text-slate-900 dark:text-white mb-3">
            Estrategia de A3: Impulso
          </h3>
          <ul className="space-y-2 text-slate-700 dark:text-slate-300 text-sm">
            <li>✓ <strong>Interview 0</strong> - Practica las preguntas que SIEMPRE hacen</li>
            <li>✓ <strong>CV Optimizado</strong> - Haz que ATS te encuentre, que humans te contraten</li>
            <li>✓ <strong>Market Intel</strong> - Conoce el mercado mejor que la competencia</li>
            <li>✓ <strong>Simulaciones</strong> - Practica hasta estar 100% confiado en entrevistas</li>
          </ul>
        </Card>

        {/* Navigation */}
        <div className="flex gap-4 justify-between">
          <Button
            variant="outline"
            onClick={() => router.push('/despega/a2-routes')}
          >
            Volver a A2
          </Button>
          <Button
            onClick={() => router.push('/despega/a4-radar')}
            disabled={completionPercentage < 50}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Continuar a A4: Radar
          </Button>
        </div>
      </div>
    </div>
  )
}
