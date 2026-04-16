'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getNextRequiredPage } from '@/lib/redirect-logic'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { useCoach } from '@/contexts/coach-context'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { A3ProgressTracker } from '@/components/a3-progress-tracker'
import { A3TrainingLevels } from '@/components/a3-training-levels'
import Link from 'next/link'
import { Target, Zap, Brain, Video, Award, TrendingUp, ArrowRight, BarChart3, MessageCircle, Lightbulb, CheckCircle2 } from 'lucide-react'
import { useV1Analytics } from '@/lib/v1-analytics/use-v1-analytics'

export default function A3Page() {
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [a3Progress, setA3Progress] = useState<any>(null)
  const [userDiscProfile, setUserDiscProfile] = useState<string | null>(null)
  const { user, loading: authLoading } = useAuthRedirect()
  const router = useRouter()
  const supabase = createClient()
  const { currentProgress, coachMessages } = useCoach()
  const { trackEvent } = useV1Analytics()

  useEffect(() => {
    if (authLoading || !user?.id) return
    trackEvent('a3_page_viewed')
    loadData()
  }, [authLoading, user?.id, trackEvent])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Check prerequisites using centralized logic
      const nextPage = await getNextRequiredPage(user?.id)
      if (!nextPage.includes('/a3')) {
        console.log('[v0] User not ready for A3, redirecting to:', nextPage)
        trackEvent('error_occurred', { errorType: 'prerequisite_failed' })
        router.push(nextPage)
        return
      }

      // Load user profile
      const { data: profileData } = await supabase
        .from('despega_user_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle()

      setUserProfile(profileData)

      // Get user DISC profile from A1 test results
      const { data: a1Results } = await supabase
        .from('a1_tests_results')
        .select('result, profile_type')
        .eq('user_id', user?.id)
        .eq('test_name', 'Despega Cerebral')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (a1Results) {
        const discProfile = a1Results.profile_type || a1Results.result?.dominantProfile
        console.log('[v0] User DISC profile for A3 personalization:', discProfile)
        setUserDiscProfile(discProfile)
        trackEvent('a3_training_level_started', {})
      }

      // Load A3 progress if exists
      const { data: a3Data } = await supabase
        .from('despega_a3_progress')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      if (a3Data) {
        setA3Progress(a3Data)
      }
    } catch (error) {
      console.log('[v0] Error loading A3 data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDiscDescription = () => {
    switch (userDiscProfile?.toUpperCase()) {
      case 'D': return 'Entrenamientos de Liderazgo Decisivo - Enfocados en tomar decisiones rápidas, delegar y manejar conflictos'
      case 'I': return 'Entrenamientos de Influencia - Enfocados en persuasión, networking, y construcción de relaciones estratégicas'
      case 'S': return 'Entrenamientos de Colaboración - Enfocados en empatía, trabajo en equipo, y apoyo a otros'
      case 'C': return 'Entrenamientos de Precisión - Enfocados en análisis, validación de datos, y excelencia técnica'
      default: return 'Entrenamientos Personalizados'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-cyan-200 border-t-cyan-600 animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Cargando entrenamientos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* WELCOME HERO - A3 VERSION */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 dark:from-orange-800 dark:to-amber-800 rounded-lg p-8 text-white shadow-lg">
          <div className="max-w-3xl">
            <p className="text-orange-100 text-sm font-semibold uppercase tracking-wider mb-2">Fase A3: Entrenamiento Aplicado - Entrevista 0 + Preparación</p>
            <h1 className="text-4xl font-bold mb-3">Entrena como Profesional. Verdaderamente.</h1>
            <p className="text-lg text-orange-50 mb-4">
              Empezamos con Entrevista 0: tu diagnóstico de preparación en luz, fondo, audio, postura, presencia, y lenguaje.
              Luego avanzas en 4 niveles: guiada → estructurada → desafiante → maestría. 
              Cada sesión te prepara para situaciones reales.
            </p>
            {userDiscProfile && (
              <div className="mb-4 p-3 bg-white/20 rounded-lg border border-white/30">
                <p className="text-sm text-orange-100 font-semibold mb-1">Tu enfoque de entrenamiento:</p>
                <p className="text-base font-bold text-white">{getDiscDescription()}</p>
              </div>
            )}
            <div className="flex gap-3">
              <Button className="bg-white text-orange-700 hover:bg-orange-50 font-semibold" size="lg">
                Comenzar Entrenamientos
              </Button>
              <Button className="bg-white/20 text-white border border-white hover:bg-white/30 font-semibold" size="lg">
                Ver Guía
              </Button>
            </div>
          </div>
        </div>

        {/* QUICK START GUIDE - A3 VERSION */}
        <Card className="border-2 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20">
          <CardHeader>
            <CardTitle className="text-xl">Primeros Pasos en Entrenamientos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold">1</div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-50">Entiende los Módulos de Entrenamiento</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">A3 tiene 3 módulos: Entrevistas, Presentaciones y Decisiones Estratégicas. Cada uno progresa del básico al experto.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold">2</div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-50">Comienza con el Módulo de Entrevistas</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Practica con entrevistadores reales simulados, recibe feedback instantáneo y mejora cada respuesta.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold">3</div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-50">Practica en Progresión</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">No saltes niveles. El progreso es acumulativo: básico → intermedio → avanzado → maestría.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold">4</div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-50">Registra tu Empleabilidad</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Tu score de empleabilidad mejora con cada sesión. Es un indicador real de qué tan preparado estás para el mercado.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white dark:bg-slate-800 shadow-md">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {a3Progress?.sessions_completed || 0}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Sesiones Completadas</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 shadow-md">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                {a3Progress?.employability_score || 'Calcular'}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Score de Empleabilidad</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 shadow-md">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {a3Progress?.hours_trained || 0}h
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Horas Entrenadas</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 shadow-md">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {a3Progress?.interviews_mastered || 0}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Entrevistas Dominadas</p>
            </CardContent>
          </Card>
        </div>

      {/* PROGRESS SECTION - NEW */}
        {user?.id && (
          <>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Tu Progreso</h2>
              <p className="text-slate-600 dark:text-slate-400">Monitorea tu desarrollo y mejora continua</p>
            </div>
            <A3ProgressTracker userId={user.id} level="basico" />
          </>
        )}

        {/* TRAINING LEVELS SECTION */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Módulo de Entrevistas</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Progresa a través de tres niveles de dificultad. Completa cada uno antes de avanzar al siguiente.
          </p>
        </div>
        {user?.id && <A3TrainingLevels userProgress={a3Progress?.levelProgress} />}

        {/* Diagnosis Card - Entrevista 0 */}
        <Card className="border-2 border-purple-200 dark:border-purple-800 hover:shadow-lg transition">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              Entrevista 0: Tu Diagnóstico
            </CardTitle>
            <CardDescription>
              Baseline de preparación profesional
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Antes de entrenar, conoce tu punto de partida. Evaluamos luz, fondo, audio, postura, presencia y comunicación.
            </p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {['Luz', 'Fondo', 'Audio', 'Postura', 'Presencia', 'Lenguaje'].map((item) => (
                <div key={item} className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded text-center">
                  <p className="text-xs font-semibold text-purple-900 dark:text-purple-300">{item}</p>
                </div>
              ))}
            </div>
            <Link href="/despega/a3/entrevista-0" className="block">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                Comenzar Diagnóstico <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Resources Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                Tips Profesionales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3">
                <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                <p className="text-sm text-slate-600 dark:text-slate-400">Usa el método STAR: Situación, Tarea, Acción, Resultado</p>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                <p className="text-sm text-slate-600 dark:text-slate-400">Practica frente a espejo antes de cada nivel</p>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                <p className="text-sm text-slate-600 dark:text-slate-400">Registra tus respuestas para auto-análisis</p>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                <p className="text-sm text-slate-600 dark:text-slate-400">Revisa retroalimentación después de cada intento</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Tu Empleabilidad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-lg">
                <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">
                  {a3Progress?.employability_score || 'Iniciar'}
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Score de empleabilidad actual</p>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Tu score aumenta con cada sesión completada y cada mejora de feedback implementada.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
