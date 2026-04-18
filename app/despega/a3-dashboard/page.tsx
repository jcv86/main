'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { ASection, ASectionPart } from '@/components/a-section-layout'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PhaseTransitionHandler } from '@/components/phase-transition-handler'
import { Loader2, Video, FileText, Briefcase, TrendingUp, CheckCircle2, Clock, Zap, Target, ArrowRight } from 'lucide-react'

interface TrainingProgress {
  interview_0: boolean
  cv_prepared: boolean
  market_insights: boolean
  trainings_done: number
}

export default function TrainingDashboardPage() {
  const [progress, setProgress] = useState<TrainingProgress | null>(null)
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

      // Check Training Sessions
      const { data: trainings } = await supabase
        .from('user_a3_simulations')
        .select('id')
        .eq('user_id', user.id)

      setProgress({
        interview_0: !!interview?.length,
        cv_prepared: !!cv?.length,
        market_insights: !!market?.length,
        trainings_done: trainings?.length || 0
      })

      console.log('[v0] Training progress loaded')
    } catch (err) {
      console.error('[v0] Error loading training progress:', err)
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
          <p className="text-muted/30">Cargando tu progreso de entrenamiento...</p>
        </div>
      </div>
    )
  }

  if (!progress) return null

  const completedItems = [
    progress.interview_0,
    progress.cv_prepared,
    progress.market_insights,
    progress.trainings_done >= 2
  ].filter(Boolean).length

  const completionPercentage = (completedItems / 4) * 100

  const activityCards = [
    // ENTRENAMIENTO CONVERSACIONAL (NUEVO - DESTACADO)
    {
      category: 'ENTRENAMIENTO CONVERSACIONAL',
      icon: Video,
      title: 'Entrevista Conversacional con IA',
      description: 'Entrevista real con IA como entrevistador. Cámara activa. Análisis multimodal: postura, tono, gestos, contenido. Feedback inmediato.',
      status: 'pending',
      action: 'Comenzar',
      href: '/despega/a3/conversational-interview',
      badge: '🎥 Video Real'
    },
    
    // FUNDACIÓN
    {
      category: 'FUNDACIÓN',
      icon: Video,
      title: 'Interview 0: Tu Pitch Personal',
      description: 'Practica tus respuestas personales a 5 preguntas clave que aparecen en CUALQUIER entrevista. Base sólida.',
      status: progress.interview_0 ? 'completed' : 'pending',
      action: progress.interview_0 ? 'Ver respuestas' : 'Comenzar',
      href: '/despega/interview-0',
      badge: '5 preguntas'
    },
    {
      category: 'FUNDACIÓN',
      icon: FileText,
      title: 'CV ATS Optimizer',
      description: 'Optimiza tu CV para pasar filtros automáticos. Formatos ATS y creativo lado a lado.',
      status: progress.cv_prepared ? 'completed' : 'pending',
      action: progress.cv_prepared ? 'Ver CV' : 'Generar CV',
      href: '/despega/a3/cv-ats',
      badge: 'ATS Ready'
    },
    
    // ENTRENAMIENTO GUIADO
    {
      category: 'ENTRENAMIENTO GUIADO',
      icon: Briefcase,
      title: 'Entrenamientos Guiados',
      description: '6 preguntas con guía paso a paso. Usa STAR method. Input voz y texto. Feedback IA en tiempo real.',
      status: 'pending',
      action: 'Comenzar',
      href: '/despega/a3/entrenamiento-guiado',
      badge: '6 preguntas'
    },
    {
      category: 'ENTRENAMIENTO GUIADO',
      icon: Briefcase,
      title: 'Análisis Multimodal con Video',
      description: 'Grabate respondiendo. IA analiza: postura, tono, gestos, coherencia emocional. Feedback profundo.',
      status: 'pending',
      action: 'Grabar Video',
      href: '/despega/a3/analisis-multimodal',
      badge: 'Con IA Vision'
    },
    
    // ENTRENAMIENTO ESTRUCTURADO
    {
      category: 'ENTRENAMIENTO ESTRUCTURADO',
      icon: Target,
      title: 'Entrenamientos Estructurados',
      description: 'Entrenamientos conductuales y técnicos con presión moderada. Construye confianza sistemáticamente.',
      status: 'pending',
      action: 'Practicar',
      href: '/despega/a3/entrenamiento-estructurado',
      badge: 'Intermedio'
    },
    {
      category: 'ENTRENAMIENTO ESTRUCTURADO',
      icon: TrendingUp,
      title: 'Ajuste por Vacante',
      description: 'Pega un job posting. IA analiza skills match y genera respuestas personalizadas para ESA vacante.',
      status: 'pending',
      action: 'Ajustar',
      href: '/despega/a3/ajuste-por-vacante',
      badge: 'Personalizado'
    },
    
    // DESAFÍO MÁXIMO
    {
      category: 'DESAFÍO MÁXIMO',
      icon: Zap,
      title: 'Entrenamientos Desafiantes',
      description: 'Entrenamientos intensos. Preguntas difíciles sin guía. Simula presión real de entrevista ejecutiva.',
      status: 'pending',
      action: 'Desafiarse',
      href: '/despega/a3/entrenamiento-desafiante',
      badge: 'Avanzado'
    },
    {
      category: 'DESAFÍO MÁXIMO',
      icon: Briefcase,
      title: 'Market Intelligence',
      description: 'Analiza tendencias, salarios, empresas que contratan en tu sector. Contexto laboral estratégico.',
      status: progress.market_insights ? 'completed' : 'pending',
      action: progress.market_insights ? 'Ver análisis' : 'Generar',
      href: '/despega/market-insights',
      badge: 'Mercado Real'
    },
  ]

  return (
    <ASection
      title="Entrenamiento Intensivo"
      subtitle="Práctica y Feedback Realista para Entrevistas"
      icon="🎯"
      colorClass="from-blue to-blue"
    >
      {/* EXPLICACIÓN */}
      <ASectionPart title="¿Qué es Entrenamiento Intensivo?" icon={<Zap />}>
        <p className="text-muted/30 mb-4">
          Esta es tu fase de práctica intensiva. Aquí realizas entrenamientos realistas de entrevistas, recibes feedback inmediato, 
          y ajustas tu enfoque basado en análisis. Combinas tu Interview 0, CV optimizado e inteligencia del mercado 
          en entrenamientos prácticos que te preparan para situaciones reales.
        </p>
        <p className="text-muted/40 text-sm">
          🎯 Enfoque: Práctica realista, feedback de IA, iteración y mejora continua durante 30-60 días.
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
              className="h-full bg-gradient-to-r from-blue to-blue rounded-full transition-all"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <p className="text-xs text-muted/40">{completedItems} de 4 módulos completados</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {activityCards.map((card, i) => {
            const isCompleted = card.status === 'completed'
            return (
              <div key={i} className={`p-3 rounded-[28px] border ${isCompleted ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-slate-800/20 border-slate-700'}`}>
                <div className="flex items-center gap-2 mb-1">
                  {isCompleted ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Clock className="w-4 h-4 text-muted/40" />}
                  <p className="text-sm font-semibold text-white">{card.title}</p>
                </div>
                <p className="text-xs text-muted/40 ml-6">{isCompleted ? 'Completado' : 'Pendiente'}</p>
              </div>
            )
          })}
        </div>
      </ASectionPart>

      {/* RESULTADOS */}
      <ASectionPart title="Todas Tus Herramientas de Entrenamiento" icon={<CheckCircle2 />}>
        <div className="space-y-8">
          {['FUNDACIÓN', 'ENTRENAMIENTO GUIADO', 'ENTRENAMIENTO ESTRUCTURADO', 'DESAFÍO MÁXIMO'].map((category) => {
            const categoryCards = activityCards.filter(card => card.category === category)
            return (
              <div key={category}>
                <h3 className="text-sm font-bold text-cyan-400 mb-4 uppercase tracking-wider">{category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categoryCards.map((card, i) => {
                    const Icon = card.icon
                    const isCompleted = card.status === 'completed'

                    return (
                      <Card key={i} className="bg-slate-800/40 border-slate-700 hover:border-cyan-500/50 transition-colors group">
                        <CardHeader>
                          <div className="flex items-start justify-between mb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                              <Icon className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300" />
                              {card.title}
                            </CardTitle>
                            {card.badge && <Badge className="text-xs bg-blue/50/20 text-cyan-300 border-cyan-500/50">{card.badge}</Badge>}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-sm text-muted/40">{card.description}</p>
                          {isCompleted && <Badge className="bg-green/50/20 text-emerald-400 border border-emerald-500/50">✓ Completado</Badge>}
                          <Button 
                            onClick={() => router.push(card.href)}
                            className={`w-full group/btn transition-all ${isCompleted ? 'bg-slate-700 hover:bg-slate-600' : 'bg-blue hover:bg-cyan-700'}`}
                          >
                            {card.action}
                            <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* PROGRESO RESUMEN */}
        <div className="mt-8 p-6 bg-gradient-to-r from-cyan-900/20 to-teal-900/20 border border-cyan-500/30 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-white font-semibold mb-1">Tu Progreso General</h4>
              <p className="text-sm text-muted/40">Completadas: Interview 0 + CV base + Market Insights</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-cyan-400">{Math.round(completionPercentage)}%</p>
            </div>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-gradient-to-r from-blue to-blue rounded-full transition-all"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <p className="text-xs text-muted/40">{completedItems} de 4 componentes base completados</p>
        </div>
      </ASectionPart>

      {/* RECOMENDACIONES */}
      <ASectionPart title="Tu Camino de Entrenamiento Recomendado" icon={<Target />}>
        <div className="space-y-6">
          {completionPercentage === 0 && (
            <div className="p-6 bg-gradient-to-r from-cyan-900/30 to-teal-900/30 border border-cyan-500/30 rounded-lg">
              <h4 className="text-white font-semibold mb-2">Comienza aquí</h4>
              <p className="text-muted/30 text-sm mb-4">
                La base es fundamental. Completa Interview 0 primero - es la piedra angular de todas tus entrevistas.
              </p>
              <Button onClick={() => router.push('/despega/interview-0')} className="bg-blue hover:bg-cyan-700">
                Comenzar Interview 0
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {completionPercentage > 0 && completionPercentage < 50 && (
            <div className="p-6 bg-gradient-to-r from-cyan-900/30 to-teal-900/30 border border-cyan-500/30 rounded-lg">
              <h4 className="text-white font-semibold mb-2">Siguiente: Entrenamiento Guiado</h4>
              <p className="text-muted/30 text-sm mb-4">
                Ya tienes tu base. Ahora practica con guía. Los Entrenamientos Guiados te enseñan la metodología STAR y te dan feedback IA en tiempo real.
              </p>
              <Button onClick={() => router.push('/despega/a3/entrenamiento-guiado')} className="bg-blue hover:bg-cyan-700">
                Ir a Entrenamientos Guiados
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {completionPercentage >= 50 && completionPercentage < 100 && (
            <div className="p-6 bg-gradient-to-r from-cyan-900/30 to-teal-900/30 border border-cyan-500/30 rounded-lg">
              <h4 className="text-white font-semibold mb-2">Intensifica: Desafío Máximo</h4>
              <p className="text-muted/30 text-sm mb-4">
                Estás en buena forma. Es momento de desafiarte. Los Entrenamientos Desafiantes te preparan para presión real de entrevista ejecutiva.
              </p>
              <Button onClick={() => router.push('/despega/a3/entrenamiento-desafiante')} className="bg-blue hover:bg-teal-700">
                Ir a Entrenamientos Desafiantes
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {completionPercentage === 100 && (
            <PhaseTransitionHandler
              currentPhase="a3"
              isComplete={true}
              nextPhaseLabel="La Realidad: Ejecución y Contexto"
              nextPhaseUrl="/despega/a4"
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-800/40 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg">4 Principios del Módulo de Entrenamiento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm text-muted/30">
                  <p className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" /> Progresión: Guiado → Estructurado → Desafío</p>
                  <p className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" /> Feedback: Análisis IA después de cada sesión</p>
                  <p className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" /> Video: Analiza postura, tono, gestos reales</p>
                  <p className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" /> Personalización: Ajusta respuestas por vacante</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/40 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg">Tips de Experto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-sm text-muted/30">
                  <li>• Practiquen 2-3 entrenamientos por semana para máximo progreso</li>
                  <li>• Mira el video de ti mismo - es incómodo pero transformador</li>
                  <li>• Ajusta tus respuestas según feedback IA</li>
                  <li>• Usa CV ATS optimizado para cada candidatura</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </ASectionPart>
    </ASection>
  )
}
