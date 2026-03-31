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
import Link from 'next/link'
import { Target, Zap, Brain, Video, Award, TrendingUp, ArrowRight, BarChart3, MessageCircle } from 'lucide-react'

export default function A3Page() {
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [a3Progress, setA3Progress] = useState<any>(null)
  const [userDiscProfile, setUserDiscProfile] = useState<string | null>(null)
  const { user, loading: authLoading } = useAuthRedirect()
  const router = useRouter()
  const supabase = createClient()
  const { currentProgress, coachMessages } = useCoach()

  useEffect(() => {
    if (authLoading || !user?.id) return
    loadData()
  }, [authLoading, user?.id])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Check prerequisites using centralized logic
      const nextPage = await getNextRequiredPage(user?.id)
      if (!nextPage.includes('/a3')) {
        console.log('[v0] User not ready for A3, redirecting to:', nextPage)
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

        {/* Main Training Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Diagnosis Card - Now ENTREVISTA 0 */}
          <Card className="border-2 border-purple-200 dark:border-purple-800 hover:shadow-lg transition md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                Entrevista 0: Tu Punto de Partida
              </CardTitle>
              <CardDescription>
                Diagnóstico de preparación profesional integral
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Antes de entrenar entrevistas, necesitamos tu baseline: ¿Cómo te ves? ¿Suenas seguro? ¿Tu fondo dice algo sobre ti? 
                ¿Tu postura comunica presencia? Entrevista 0 calibra estos elementos.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded text-center">
                  <p className="text-xs font-semibold text-purple-900 dark:text-purple-300">Luz</p>
                </div>
                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded text-center">
                  <p className="text-xs font-semibold text-indigo-900 dark:text-indigo-300">Fondo</p>
                </div>
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-center">
                  <p className="text-xs font-semibold text-blue-900 dark:text-blue-300">Audio</p>
                </div>
                <div className="p-2 bg-cyan-50 dark:bg-cyan-900/20 rounded text-center">
                  <p className="text-xs font-semibold text-cyan-900 dark:text-cyan-300">Postura</p>
                </div>
                <div className="p-2 bg-teal-50 dark:bg-teal-900/20 rounded text-center">
                  <p className="text-xs font-semibold text-teal-900 dark:text-teal-300">Presencia</p>
                </div>
              </div>
              <Link href="/despega/a3/entrevista-0" className="block">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Comenzar Entrevista 0 <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Interview Training Card - Now emphasizing progression */}
          <Card className="border-2 border-indigo-200 dark:border-indigo-800 hover:shadow-lg transition md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5 text-indigo-600" />
                Entrenamientos: 4 Niveles Progresivos
              </CardTitle>
              <CardDescription>
                De básico a maestría: guiada → estructurada → desafiante → bajo presión
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Después de Entrevista 0, avanzas en 4 niveles de dificultad. Cada uno te prepara para situaciones más reales.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  <span className="text-lg font-bold text-green-600">▸</span>
                  <span className="text-sm font-semibold text-green-900 dark:text-green-300">Guiada: Preguntas claras, respuestas estructuradas</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                  <span className="text-lg font-bold text-yellow-600">▸▸</span>
                  <span className="text-sm font-semibold text-yellow-900 dark:text-yellow-300">Estructurada: Preguntas más complejas</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                  <span className="text-lg font-bold text-orange-600">▸▸▸</span>
                  <span className="text-sm font-semibold text-orange-900 dark:text-orange-300">Desafiante: Preguntas inesperadas, casos</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-900/20 rounded">
                  <span className="text-lg font-bold text-red-600">▸▸▸▸</span>
                  <span className="text-sm font-semibold text-red-900 dark:text-red-300">Maestría: Bajo presión, tiempo límite, jurado</span>
                </div>
              </div>
              <Link href="/despega/a3/simulations" className="block">
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                  Ir a Entrenamientos <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Behavioral Analysis Card */}
          <Card className="border-2 border-blue-200 dark:border-blue-800 hover:shadow-lg transition">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                Análisis Multimodal
              </CardTitle>
              <CardDescription>
                Visual, voz, y lenguaje corporal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Feedback detallado sobre postura, contacto visual, tono de voz, gestos, y coherencia emocional.
              </p>
              <ul className="text-sm space-y-1 text-slate-700 dark:text-slate-300">
                <li>✓ Detección de microexpresiones</li>
                <li>✓ Análisis de confianza y coherencia</li>
                <li>✓ Recomendaciones específicas</li>
              </ul>
              <Link href="/despega/a3/analisis-multimodal" className="block">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Análisis Multimodal <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Entrenamiento Guiado Card */}
          <Card className="border-2 border-rose-200 dark:border-rose-800 hover:shadow-lg transition">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-rose-600" />
                Entrenamiento Guiado
              </CardTitle>
              <CardDescription>
                Práctica estructurada con mentor IA
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Sesiones paso a paso con un mentor IA que te guía, explica qué mejorar, y práctica contigo.
              </p>
              <ul className="text-sm space-y-1 text-slate-700 dark:text-slate-300">
                <li>✓ Módulos temáticos (STAR, Técnicas, Negociación)</li>
                <li>✓ Explicación de mejores prácticas</li>
                <li>✓ Práctica repetida con retroalimentación</li>
              </ul>
              <Link href="/despega/a3/entrenamiento-guiado" className="block">
                <Button className="w-full bg-rose-600 hover:bg-rose-700">
                  Entrenamiento Guiado <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* CV ATS Card */}
          <Card className="border-2 border-cyan-200 dark:border-cyan-800 hover:shadow-lg transition">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-cyan-600" />
                CV ATS Optimizado
              </CardTitle>
              <CardDescription>
                Tu CV según tu desempeño DTC
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Construido automáticamente según lo que demostraste en DTC. Formatos: estándar, ATS, y actualizable según vacantes.
              </p>
              <ul className="text-sm space-y-1 text-slate-700 dark:text-slate-300">
                <li>✓ Extrae información de A1 y A2</li>
                <li>✓ Múltiples formatos exportables</li>
                <li>✓ Optimizado para ATS</li>
              </ul>
              <Link href="/despega/a3/cv-ats" className="block">
                <Button className="w-full bg-cyan-600 hover:bg-cyan-700">
                  Mi CV ATS <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Ajuste por Vacante Card */}
          <Card className="border-2 border-teal-200 dark:border-teal-800 hover:shadow-lg transition">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-teal-600" />
                Ajuste por Vacante
              </CardTitle>
              <CardDescription>
                Personaliza CV y respuestas por oferta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Pega una oferta de trabajo y obtén: CV ajustado, respuestas personalizadas, y simulación específica.
              </p>
              <ul className="text-sm space-y-1 text-slate-700 dark:text-slate-300">
                <li>✓ Análisis de JD</li>
                <li>✓ Mapeo de skills vs vacante</li>
                <li>✓ CV y respuestas personalizadas</li>
              </ul>
              <Link href="/despega/a3/ajuste-por-vacante" className="block">
                <Button className="w-full bg-teal-600 hover:bg-teal-700">
                  Ajustar a Vacante <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Analytics & Dashboard Card */}
          <Card className="border-2 border-purple-200 dark:border-purple-800 hover:shadow-lg transition">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                Mi Dashboard A3
              </CardTitle>
              <CardDescription>
                Analytics y métricas de desempeño
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Visualiza tu puntuación general, fortalezas, áreas de mejora, y tendencias en el tiempo.
              </p>
              <ul className="text-sm space-y-1 text-slate-700 dark:text-slate-300">
                <li>✓ Puntuación general</li>
                <li>✓ Gráficos de progreso</li>
                  <li>✓ Comparativa de entrenamientos</li>
              </ul>
              <Link href="/despega/a3/analytics" className="block">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Ver Dashboard <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Feedback & Coaching Card */}
          <Card className="border-2 border-indigo-200 dark:border-indigo-800 hover:shadow-lg transition">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-indigo-600" />
                Feedback del Coach
              </CardTitle>
              <CardDescription>
                Análisis detallado y recomendaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Recibe feedback específico de tu Coach IA con identificación de fortalezas, áreas de mejora e insights.
              </p>
              <ul className="text-sm space-y-1 text-slate-700 dark:text-slate-300">
                <li>✓ Análisis por simulación</li>
                <li>✓ Recomendaciones accionables</li>
                <li>✓ Seguimiento de mejoras</li>
              </ul>
              <Link href="/despega/a3/feedback" className="block">
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                  Ver Feedback <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Progress & History Card */}
          <Card className="border-2 border-green-200 dark:border-green-800 hover:shadow-lg transition">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Mi Progreso
              </CardTitle>
              <CardDescription>
                Historial y mejora en el tiempo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Visualiza tu evolución a través de todos tus entrenamientos y sesiones prácticas.
              </p>
              <ul className="text-sm space-y-1 text-slate-700 dark:text-slate-300">
                <li>✓ Comparación antes/después</li>
                <li>✓ Habilidades mejoradas</li>
                <li>✓ Certificados logrados</li>
              </ul>
              <Link href="/despega/a3/progress" className="block">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Ver Progreso <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Coach Context Card */}
        <Card className="border-0 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              Tu Coach A3 en Cada Paso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-700 dark:text-slate-300">
              Sofia y Dani acompañan cada entrenamiento. Pueden analizar tu video en tiempo real, explicar gaps, y sugerir ajustes específicos para mejorar.
            </p>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                "Veo que tu tono es muy rápido al hablar. Intenta desacelerar en los puntos clave - da espacio para que la otra persona procese. Aquí está el video analizado..."
              </p>
            </div>
          </CardContent>
        </Card>

        {/* A4 PROGRESSION CTA - Next Phase */}
        <Card className="border-2 border-cyan-500 dark:border-cyan-600 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/50 dark:to-blue-950/50 shadow-lg">
          <CardContent className="pt-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex-1">
                <Badge className="mb-3 bg-cyan-600 hover:bg-cyan-700">Fase Final</Badge>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">
                  Domina el Contexto: A4 Radar Estratégico
                </h3>
                <p className="text-slate-700 dark:text-slate-300 mb-4">
                  Una vez domines tus habilidades de entrevista en A3, accede a análisis profundo del mercado laboral, tendencias de industria y oportunidades emergentes con 7 capas de análisis estratégico.
                </p>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li className="flex gap-2">
                    <span className="text-cyan-600">✓</span>
                    <span>Noticias curadas del mercado diariamente</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-cyan-600">✓</span>
                    <span>7 capas de análisis para decisiones informadas</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-cyan-600">✓</span>
                    <span>Contexto de industria personalizado a tu perfil</span>
                  </li>
                </ul>
              </div>
              <Link href="/despega/a4" className="flex-shrink-0 w-full md:w-auto">
                <Button className="w-full md:w-auto bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-8 py-6 text-base shadow-lg">
                  Ver A4 Radar <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="p-6 mb-8 border-0 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
          <CardContent className="flex gap-3">
            <div className="w-5 h-5 flex-shrink-0 text-purple-600 text-lg">💡</div>
            <div>
              <div className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Cómo progresar en entrenamiento de entrevistas</div>
              <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-1">
                <li>✓ Comienza con diagnosis para entender tu nivel actual</li>
                <li>✓ Elige entrenamientos según tu objetivo (básico → avanzado)</li>
                <li>✓ Revisa feedback del coach después de cada sesión</li>
                <li>✓ Repite el mismo tipo hasta dominar, luego sube dificultad</li>
                <li>✓ Practica mínimo 3 veces por semana para avance real</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
