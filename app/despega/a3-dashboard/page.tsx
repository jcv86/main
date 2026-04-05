'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { ASection, ASectionPart } from '@/components/a-section-layout'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, Video, FileText, Briefcase, TrendingUp, CheckCircle2, Clock, Zap, Target, ArrowRight } from 'lucide-react'

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
  const router = useRouter()

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-950 to-slate-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
          <p className="text-slate-300">Cargando tu progreso A3...</p>
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
      href: '/despega/a3/simulations'
    }
  ]

  return (
    <ASection
      title="Entrenamiento Intensivo"
      subtitle="Simulación y Feedback Realista para Entrevistas"
      icon="🎯"
      colorClass="from-cyan-500 to-teal-500"
    >
      {/* EXPLICACIÓN */}
      <ASectionPart title="¿Qué es Entrenamiento Intensivo?" icon={<Zap />}>
        <p className="text-slate-300 mb-4">
          Esta es tu fase de práctica intensiva. Aquí realizas simulaciones realistas de entrevistas, recibes feedback inmediato, 
          y ajustas tu enfoque basado en análisis. Combinas tu Interview 0, CV optimizado e inteligencia del mercado 
          en entrenamientos prácticos que te preparan para situaciones reales.
        </p>
        <p className="text-slate-400 text-sm">
          🎯 Enfoque: Simulación realista, feedback de IA, iteración y mejora continua durante 30-60 días.
        </p>
      </ASectionPart>

      {/* FLUJO / PROCESO */}
      <ASectionPart title="Tu Progreso en Entrenamiento" icon={<Target />}>
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="font-semibold text-white">Completado</p>
            <p className="text-2xl font-black text-cyan-400">{Math.round(completionPercentage)}%</p>
          </div>
          <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full transition-all"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <p className="text-xs text-slate-400">{completedItems} de 4 módulos completados</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {activityCards.map((card, i) => {
            const isCompleted = card.status === 'completed'
            return (
              <div key={i} className={`p-3 rounded-lg border ${isCompleted ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-slate-800/20 border-slate-700'}`}>
                <div className="flex items-center gap-2 mb-1">
                  {isCompleted ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Clock className="w-4 h-4 text-slate-400" />}
                  <p className="text-sm font-semibold text-white">{card.title}</p>
                </div>
                <p className="text-xs text-slate-400 ml-6">{isCompleted ? 'Completado' : 'Pendiente'}</p>
              </div>
            )
          })}
        </div>
      </ASectionPart>

      {/* RESULTADOS */}
      <ASectionPart title="Componentes de Entrenamiento" icon={<CheckCircle2 />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activityCards.map((card, i) => {
            const Icon = card.icon
            const isCompleted = card.status === 'completed'

            return (
              <Card key={i} className="bg-slate-800/40 border-slate-700 hover:border-cyan-500/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Icon className="w-5 h-5 text-cyan-400" />
                    {card.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-400">{card.description}</p>
                  {isCompleted && <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/50">✓ Completado</Badge>}
                  <Button 
                    onClick={() => router.push(card.href)}
                    className={`w-full ${isCompleted ? 'bg-slate-700 hover:bg-slate-600' : 'bg-cyan-600 hover:bg-cyan-700'}`}
                  >
                    {card.action}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </ASectionPart>

      {/* DASHBOARD / ACCIONES */}
      <ASectionPart title="Próximos Pasos" icon={<CheckCircle2 />}>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-800/40 border-slate-700 hover:border-cyan-500/50 transition-colors">
              <CardHeader>
                <CardTitle className="text-lg">Estrategia de A3: Entrenamiento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm text-slate-300">
                  <p className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" /> Interview 0 - Base sólida</p>
                  <p className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" /> Simulaciones realistas</p>
                  <p className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" /> Feedback detallado</p>
                  <p className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" /> Iteración y mejora</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/40 border-slate-700 hover:border-cyan-500/50 transition-colors">
              <CardHeader>
                <CardTitle className="text-lg">Recomendación</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-slate-300">
                  {completionPercentage < 25 && 'Comienza con Interview 0. Es fundamental para todas las entrevistas.'}
                  {completionPercentage >= 25 && completionPercentage < 50 && 'Continúa con tu CV. Un CV fuerte te abre puertas.'}
                  {completionPercentage >= 50 && completionPercentage < 100 && 'Realiza entrenamientos de entrevista. La práctica construye confianza.'}
                  {completionPercentage === 100 && '¡Excelente! A3 completo. Estás listo para La Realidad.'}
                </p>
                <Button 
                  onClick={() => router.push(completionPercentage >= 50 ? '/despega/a4-intro' : activityCards.find(c => !c.status)?.href || '/')}
                  className="w-full bg-teal-600 hover:bg-teal-700"
                  size="sm"
                >
                  {completionPercentage >= 50 ? 'Ir a La Realidad' : 'Continuar'}
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="p-6 bg-gradient-to-r from-cyan-900/30 to-teal-900/30 border border-cyan-500/30 rounded-lg">
            <p className="text-slate-300 mb-4">
              <strong>¿Necesitas ayuda?</strong> Nuestro coach está disponible para revisar tu CV, practicar entrenamientos, 
              o responder preguntas sobre cualquier módulo de A3.
            </p>
            <Button variant="outline" className="border-cyan-500 hover:border-cyan-400 hover:text-cyan-400">
              Hablar con el Coach
            </Button>
          </div>
        </div>
      </ASectionPart>
    </ASection>
  )
}
