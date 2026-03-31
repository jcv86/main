'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, ArrowRight, Brain, Sparkles } from 'lucide-react'

export default function A1ResultadoPage() {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadResults()
  }, [])

  const loadResults = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user?.id) {
        router.push('/auth/signin')
        return
      }

      // Get latest A1 assessment
      const { data: assessment, error: fetchError } = await supabase
        .from('a1_cerebral_assessment')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(1)
        .single()

      if (fetchError || !assessment) {
        setError('No se encontró tu evaluación. Por favor completa el test primero.')
        return
      }

      setProfile(assessment)
      console.log('[v0] [CANONICAL] A1 resultado loaded for user')
    } catch (err) {
      console.error('[v0] Error loading results:', err)
      setError('Error al cargar tus resultados')
    } finally {
      setLoading(false)
    }
  }

  const getDimensionName = (letter: string) => {
    const names: Record<string, string> = {
      'D': 'Energía',
      'I': 'Plan Ejecutivo',
      'S': 'Relaciones',
      'C': 'Enfoque'
    }
    return names[letter] || letter
  }

  const getDimensionColor = (letter: string) => {
    const colors: Record<string, string> = {
      'D': 'from-red-500 to-orange-500',
      'I': 'from-yellow-500 to-amber-500',
      'S': 'from-green-500 to-emerald-500',
      'C': 'from-blue-500 to-cyan-500'
    }
    return colors[letter] || 'from-slate-500 to-slate-600'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => router.push('/despega/a1-cerebral')}>
            Volver al Test
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full">
            <Brain className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">Tu Perfil Despega Cerebral</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-blue-400 mb-4">
            Así Funcionas
          </h1>
          <p className="text-lg text-slate-700 dark:text-slate-300">
            Una visión clara de cómo te relacionas con el mundo, tus fortalezas naturales y tu potencial
          </p>
        </div>

        {/* Primary Profile */}
        <Card className="mb-8 border-0 shadow-lg bg-gradient-to-r from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl">Tu Dimensión Dominante</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={`p-6 bg-gradient-to-r ${getDimensionColor(profile.dominant_pattern)} rounded-lg text-white`}>
              <p className="text-sm opacity-90 mb-1">Patrón Dominante</p>
              <p className="text-4xl font-bold">{getDimensionName(profile.dominant_pattern)}</p>
              <p className="text-sm opacity-90 mt-2">Tu estilo natural de energía y acción</p>
            </div>
            
            {profile.secondary_pattern && (
              <div className={`p-4 bg-gradient-to-r ${getDimensionColor(profile.secondary_pattern)} rounded-lg text-white opacity-80`}>
                <p className="text-sm opacity-90 mb-1">Patrón Secundario</p>
                <p className="text-xl font-semibold">{getDimensionName(profile.secondary_pattern)}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Narrative Insights */}
        <div className="space-y-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                Cómo Te Comunicás
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 dark:text-slate-300">
                Tu tendencia natural es la de un {getDimensionName(profile.dominant_pattern).toLowerCase()}. 
                Esto significa que prefieres la acción clara, los resultados tangibles y la dirección definida. 
                Trabajas mejor cuando hay objetivos claros y libertad para ejecutar.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-green-500" />
                Tus Fortalezas Naturales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Tomas decisiones con confianza y claridad</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Mueves proyectos hacia adelante con energía</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Comunicas directamente lo que piensas</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Lidera grupos hacia resultados concretos</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-500" />
                Áreas Para Crecer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                <li className="flex gap-2">
                  <span className="text-orange-600 font-bold">→</span>
                  <span>Desarrollar más paciencia en procesos complejos</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-orange-600 font-bold">→</span>
                  <span>Escuchar perspectivas distintas antes de decidir</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-orange-600 font-bold">→</span>
                  <span>Adaptar tu ritmo al de tu equipo</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-orange-600 font-bold">→</span>
                  <span>Reflexionar antes de actuar en situaciones críticas</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                Tu Lectura en 4 Dimensiones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-500">
                <p className="font-semibold text-red-700 dark:text-red-300">Energía (Acción & Dinamismo)</p>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">Tu capacidad para iniciar, moverte rápido y llevar momentum</p>
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-500">
                <p className="font-semibold text-yellow-700 dark:text-yellow-300">Plan Ejecutivo (Influencia & Visión)</p>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">Tu capacidad para inspirar, comunicar dirección y llevar gente contigo</p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
                <p className="font-semibold text-green-700 dark:text-green-300">Relaciones (Estabilidad & Confianza)</p>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">Tu capacidad para conectar, sostener y ser confiable para otros</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                <p className="font-semibold text-blue-700 dark:text-blue-300">Enfoque (Precisión & Profundidad)</p>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">Tu capacidad para analizar, refinar y asegurar calidad en lo que haces</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Final Bridge to A2 */}
        <Card className="mb-8 border-0 shadow-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 dark:from-purple-900/20 dark:to-blue-900/20">
          <CardHeader>
            <CardTitle className="text-xl">Por Qué Esto Importa Para Tu Ruta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-slate-700 dark:text-slate-300">
            <p>Tu perfil Despega Cerebral no es una etiqueta, es un mapa de cómo avanzas naturalmente.</p>
            <p>Lo que viene a continuación (tu Misión 90 días en 3 sprints) estará diseñado para:</p>
            <ul className="space-y-1 ml-4">
              <li>✓ Jugar a tus fortalezas sin dejarlas estancadas</li>
              <li>✓ Trabajar las áreas que te traban, sin que se note como "corrección"</li>
              <li>✓ Llevar tu energía, enfoque, relaciones y plan ejecutivo al siguiente nivel</li>
              <li>✓ Prepararte para lo que viene después (A3: entrevistas reales, A4: radar estratégico)</li>
            </ul>
          </CardContent>
        </Card>
        <div className="text-center">
          <Button 
            onClick={() => router.push('/despega/a2/intro')} 
            className="gap-2 px-8 py-6 text-lg"
            size="lg"
          >
            Continuar a A2: Tu Ruta de 90 Días
            <ArrowRight className="w-5 h-5" />
          </Button>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-4">
            Esta información te acompañará a lo largo de tu viaje en Despega Tu Carrera
          </p>
        </div>
      </div>
    </div>
  )
}
