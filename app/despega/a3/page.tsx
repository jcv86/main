'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useCoach } from '@/contexts/coach-context'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Target, Zap, Brain, Video, Award, TrendingUp, ArrowRight } from 'lucide-react'

export default function A3Page() {
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [a3Progress, setA3Progress] = useState<any>(null)
  const [userDiscProfile, setUserDiscProfile] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()
  const { progress } = useCoach()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/signin')
        return
      }

      // Load user profile
      const { data: profile } = await supabase
        .from('despega_user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      setUserProfile(profile)

      // Get user DISC profile from A1 test results
      const { data: a1Results } = await supabase
        .from('a1_tests_results')
        .select('result, profile_type')
        .eq('user_id', user.id)
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Cargando entrenamientos...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* WELCOME HERO - A3 VERSION */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 dark:from-orange-800 dark:to-amber-800 rounded-lg p-8 text-white shadow-lg">
          <div className="max-w-3xl">
            <p className="text-orange-100 text-sm font-semibold uppercase tracking-wider mb-2">Fase A3: Aterrizaje y Entrenamiento</p>
            <h1 className="text-4xl font-bold mb-3">Entrena como profesional antes de hacerlo en vivo</h1>
            <p className="text-lg text-orange-50 mb-4">
              Completaste tu descubrimiento personal en A1 y tu plan en A2. Ahora es momento de practicar en entrenamientos realistas. 
              A3 te pone en escenarios desafiantes donde practicas entrevistas, presentaciones y decisiones estratégicas con feedback en tiempo real.
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
              <Button variant="outline" className="border-white text-white hover:bg-white/10" size="lg">
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
          {/* Diagnosis Card */}
          <Card className="border-2 border-purple-200 dark:border-purple-800 hover:shadow-lg transition">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                Diagnosis de Empleabilidad
              </CardTitle>
              <CardDescription>
                Evaluación inicial para calibrar tu nivel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Cuestionario rápido que evalúa tu claridad de perfil, fortalezas, gaps, y nivel de preparación para entrenamientos.
              </p>
              <ul className="text-sm space-y-1 text-slate-700 dark:text-slate-300">
                <li>✓ 5 preguntas clave</li>
                <li>✓ Identifica gaps de habilidades</li>
                <li>✓ Calibra dificultad de entrenamientos</li>
              </ul>
              <Link href="/despega/a3/diagnosis" className="block">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Comenzar Diagnosis <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Interview Simulations Card */}
          <Card className="border-2 border-indigo-200 dark:border-indigo-800 hover:shadow-lg transition">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5 text-indigo-600" />
                Simulaciones de Entrevista
              </CardTitle>
              <CardDescription>
                4 tipos progresivos de entrenamientos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                De lo básico a lo avanzado: guiada, estructurada, desafiante, y bajo presión máxima.
              </p>
              <ul className="text-sm space-y-1 text-slate-700 dark:text-slate-300">
                <li>✓ Feedback inmediato en video</li>
                <li>✓ Análisis de comportamiento multimodal</li>
                <li>✓ Preguntas adaptativas</li>
              </ul>
              <Link href="/despega/a3/simulations" className="block">
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                  Ir a Simulaciones <ArrowRight className="ml-2 w-4 h-4" />
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
              <Button className="w-full bg-blue-600 hover:bg-blue-700" disabled>
                Próximamente
              </Button>
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
                Visualiza tu evolución a través de todas tus simulaciones y entrenamientos.
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

        {/* Tips */}
        <Card className="border-0 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
          <CardContent className="pt-6 flex gap-3">
            <div className="w-5 h-5 flex-shrink-0 text-purple-600 text-lg">💡</div>
            <div>
              <div className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Cómo aprovechar A3</div>
              <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-1">
                <li>✓ Comienza con diagnosis para entender tu nivel actual</li>
                <li>✓ Elige simulaciones según tu objetivo (básico → avanzado)</li>
                <li>✓ Revisa feedback del coach después de cada sesión</li>
                <li>✓ Repite el mismo tipo hasta dominar, luego sube dificultad</li>
                <li>✓ Practica mínimo 3 veces por semana para avance real</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
