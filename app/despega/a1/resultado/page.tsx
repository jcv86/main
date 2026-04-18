'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, ArrowRight, Brain, Sparkles, TrendingUp, Target } from 'lucide-react'
import { useV1Analytics } from '@/lib/v1-analytics/use-v1-analytics'

export default function A1ResultadoPage() {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()
  const { trackEvent } = useV1Analytics()

  useEffect(() => {
    trackEvent('a1_resultado_viewed')
    loadResults()
  }, [trackEvent])

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
      trackEvent('a1_resultado_viewed', {})
    } catch (err) {
      console.error('[v0] Error loading results:', err)
      trackEvent('error_occurred', { errorType: err instanceof Error ? err.message : 'unknown' })
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
      'D': 'from-red-500 to-orange/50',
      'I': 'from-yellow-500 to-amber-500',
      'S': 'from-green to-green',
      'C': 'from-blue to-blue'
    }
    return colors[letter] || 'from-muted/50 to-muted/60'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red mb-4">{error}</p>
          <Button onClick={() => router.push('/despega/a1-cerebral')}>
            Volver al Test
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple/5 via-blue/5 to-muted/10 dark:from-background dark:via-muted/90 dark:to-muted/80 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-gradient-to-r from-purple/10 to-blue/10 dark:from-purple/30 dark:to-blue-900/30 rounded-full">
            <Brain className="w-4 h-4 text-purple dark:text-purple/40" />
            <span className="text-sm font-semibold text-purple dark:text-purple/30">Tu Perfil Despega Cerebral</span>
          </div>
          <h1 className="text-5xl font-bold bg-purple bg-clip-text text-transparent dark:from-purple-400 dark:to-blue-400 mb-4">
            Tu Mapa está Listo
          </h1>
          <p className="text-lg text-muted/70 dark:text-muted/30">
            Una visión clara de cómo te relacionas con el mundo, tus fortalezas naturales y tu potencial
          </p>
        </div>

        {/* Primary Profile */}
        <Card className="mb-8 border-0 shadow-lg bg-gradient-to-r from-white to-muted/5 dark:from-muted/90 dark:to-muted/80">
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
                <Sparkles className="w-5 h-5 text-orange" />
                Cómo Te Comunicás
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted/70 dark:text-muted/30">
                Tu tendencia natural es la de un {getDimensionName(profile.dominant_pattern).toLowerCase()}. 
                Esto significa que prefieres la acción clara, los resultados tangibles y la dirección definida. 
                Trabajas mejor cuando hay objetivos claros y libertad para ejecutar.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-green" />
                Tus Fortalezas Naturales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <ul className="space-y-2 text-muted/70 dark:text-muted/30">
                <li className="flex gap-2">
                  <span className="text-green font-bold">✓</span>
                  <span>Tomas decisiones con confianza y claridad</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green font-bold">✓</span>
                  <span>Mueves proyectos hacia adelante con energía</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green font-bold">✓</span>
                  <span>Comunicas directamente lo que piensas</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green font-bold">✓</span>
                  <span>Lidera grupos hacia resultados concretos</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange" />
                Áreas Para Crecer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <ul className="space-y-2 text-muted/70 dark:text-muted/30">
                <li className="flex gap-2">
                  <span className="text-orange font-bold">→</span>
                  <span>Desarrollar más paciencia en procesos complejos</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-orange font-bold">→</span>
                  <span>Escuchar perspectivas distintas antes de decidir</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-orange font-bold">→</span>
                  <span>Adaptar tu ritmo al de tu equipo</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-orange font-bold">→</span>
                  <span>Reflexionar antes de actuar en situaciones críticas</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple/50" />
                Tu Lectura en 4 Dimensiones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-red/5 dark:bg-red/20 rounded-[28px] border-l-4 border-red/50">
                <p className="font-semibold text-red dark:text-red/30">Energía (Acción & Dinamismo)</p>
                <p className="text-sm text-muted/70 dark:text-muted/30 mt-1">Tu capacidad para iniciar, moverte rápido y llevar momentum</p>
              </div>
              <div className="p-3 bg-yellow/5 dark:bg-yellow/20 rounded-[28px] border-l-4 border-orange">
                <p className="font-semibold text-yellow dark:text-yellow/30">Plan Ejecutivo (Influencia & Visión)</p>
                <p className="text-sm text-muted/70 dark:text-muted/30 mt-1">Tu capacidad para inspirar, comunicar dirección y llevar gente contigo</p>
              </div>
              <div className="p-3 bg-green/5 dark:bg-green/20 rounded-[28px] border-l-4 border-green">
                <p className="font-semibold text-green dark:text-green/30">Relaciones (Estabilidad & Confianza)</p>
                <p className="text-sm text-muted/70 dark:text-muted/30 mt-1">Tu capacidad para conectar, sostener y ser confiable para otros</p>
              </div>
              <div className="p-3 bg-blue/5 dark:bg-blue/20 rounded-[28px] border-l-4 border-blue/50">
                <p className="font-semibold text-blue dark:text-blue/30">Enfoque (Precisión & Profundidad)</p>
                <p className="text-sm text-muted/70 dark:text-muted/30 mt-1">Tu capacidad para analizar, refinar y asegurar calidad en lo que haces</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ⭐ A1 V2: INTERNAL TENSIONS */}
        <Card className="mb-8 border-0 shadow-lg border-2 border-yellow/30 dark:border-yellow bg-yellow/5/50 dark:bg-amber-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-900 dark:text-amber-200">
              <Sparkles className="w-5 h-5 text-yellow" />
              Tus Tensiones Internas
            </CardTitle>
            <p className="text-sm text-amber-800 dark:text-amber-300 mt-2 font-normal">Las dinámicas internas que viven en ti constantemente</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-3">
              <div className="p-3 border-l-4 border-amber-600 bg-white dark:bg-background rounded">
                <p className="font-semibold text-muted/90 dark:text-muted/10">Acción vs. Reflexión</p>
                <p className="text-sm text-muted/70 dark:text-muted/40 mt-1">Tu tendencia es lanzarse (Energía), pero tu mente pide tiempo para procesar (Enfoque). Esto crea un ritmo interno de "acelera-pausa-acelera".</p>
              </div>
              <div className="p-3 border-l-4 border-amber-600 bg-white dark:bg-background rounded">
                <p className="font-semibold text-muted/90 dark:text-muted/10">Independencia vs. Interdependencia</p>
                <p className="text-sm text-muted/70 dark:text-muted/40 mt-1">Buscas autonomía (Plan Ejecutivo), pero necesitas relaciones sólidas para crecer (Relaciones). Tenés que aprender a no cargar todo solo.</p>
              </div>
              <div className="p-3 border-l-4 border-amber-600 bg-white dark:bg-background rounded">
                <p className="font-semibold text-muted/90 dark:text-muted/10">Perfeccionismo vs. Pragmatismo</p>
                <p className="text-sm text-muted/70 dark:text-muted/40 mt-1">Querés hacerlo bien (Enfoque), pero a veces necesitás soltar y iterar (Energía). El balance entre "listo" y "perfecto" es donde crecés.</p>
              </div>
            </div>
            <p className="text-xs text-yellow dark:text-amber-300 mt-4 italic">💡 En A2, los 3 sprints de 30 días te ayudarán a convertir estas tensiones en superpotencias.</p>
          </CardContent>
        </Card>

        {/* ⭐ A1 V2: ADVANCEMENT PATTERN */}
        <Card className="mb-8 border-0 shadow-lg border-2 border-green/20 dark:border-emerald-800 bg-green/5/50 dark:bg-emerald-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200">
              <TrendingUp className="w-5 h-5 text-green" />
              Tu Patrón de Avance y Freno
            </CardTitle>
            <p className="text-sm text-emerald-800 dark:text-emerald-300 mt-2 font-normal">Dónde aceleras naturalmente vs. donde necesitas empujar</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <p className="font-semibold text-emerald-900 dark:text-emerald-200">🚀 ACELERAS EN:</p>
                <ul className="space-y-2 text-sm text-muted/70 dark:text-muted/40">
                  <li className="flex gap-2">
                    <span className="text-green font-bold">▸</span>
                    <span>Decisiones bajo presión</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green font-bold">▸</span>
                    <span>Liderar cambios grandes</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green font-bold">▸</span>
                    <span>Comunicación directa</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green font-bold">▸</span>
                    <span>Ejecutar con ambición</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <p className="font-semibold text-orange dark:text-orange/20">⚠️ TE FRENA:</p>
                <ul className="space-y-2 text-sm text-muted/70 dark:text-muted/40">
                  <li className="flex gap-2">
                    <span className="text-orange font-bold">■</span>
                    <span>Detalles y preparación excesiva</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-orange font-bold">■</span>
                    <span>Falta de cierre o follow-up</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-orange font-bold">■</span>
                    <span>Resistencia de equipo</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-orange font-bold">■</span>
                    <span>Ambigüedad o cambios de plan</span>
                  </li>
                </ul>
              </div>
            </div>
            <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-4 italic">💡 Tu Misión 90 días usará tus fortalezas de aceleración y construirá capacidad donde frenas.</p>
          </CardContent>
        </Card>

        {/* ⭐ A1 V2: PREDICTIVE INSIGHTS */}
        <Card className="mb-8 border-0 shadow-lg border-2 border-blue/30 dark:border-blue bg-blue/5/50 dark:bg-blue/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-900 dark:text-blue/20">
              <Target className="w-5 h-5 text-blue" />
              Lectura Predictiva: El Mercado Laboral y Vos
            </CardTitle>
            <p className="text-sm text-blue dark:text-indigo-300 mt-2 font-normal">Cómo tu perfil se posiciona en oportunidades reales</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-white dark:bg-background rounded-[28px] border border-blue/30 dark:border-indigo-700">
              <p className="font-semibold text-indigo-900 dark:text-blue/20 mb-2">Roles Donde Brillás</p>
              <ul className="space-y-1 text-sm text-muted/70 dark:text-muted/40">
                <li>• Liderazgo estratégico (startups, transformación digital)</li>
                <li>• Project leadership en ambientes de cambio rápido</li>
                <li>• Roles que requieren decisión rápida + visión clara</li>
              </ul>
            </div>
            <div className="p-4 bg-white dark:bg-background rounded-[28px] border border-orange/20 dark:border-orange">
              <p className="font-semibold text-orange dark:text-orange/20 mb-2">Roles a Evitar o Negociar</p>
              <ul className="space-y-1 text-sm text-muted/70 dark:text-muted/40">
                <li>• Trabajo operativo puro (muy repetitivo)</li>
                <li>• Roles sin autonomía decisoria</li>
                <li>• Ambientes con mucha burocracia o cambios de rumbo</li>
              </ul>
            </div>
            <div className="p-4 bg-white dark:bg-background rounded-[28px] border border-red/20 dark:border-red">
              <p className="font-semibold text-red dark:text-red/20 mb-2">Señal de Alerta</p>
              <p className="text-sm text-muted/70 dark:text-muted/40">Si después de 3-6 meses en un rol sigues sin autonomía clara o decisión, es probable que no es el lugar. Confía en eso.</p>
            </div>
          </CardContent>
        </Card>

        {/* Final Bridge to A2 */}
        <Card className="mb-8 border-0 shadow-lg bg-gradient-to-r from-purple/50/10 to-blue/10 dark:from-purple/20 dark:to-blue-900/20">
          <CardHeader>
            <CardTitle className="text-xl">Por Qué Esto Importa Para Tu Ruta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted/70 dark:text-muted/30">
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
        <div className="text-center space-y-4">
          <div className="p-4 bg-gradient-to-r from-purple/10 to-blue/10 dark:from-purple/30 dark:to-blue-900/30 rounded-lg">
            <p className="text-sm text-muted/70 dark:text-muted/30 mb-3 font-medium">
              Ya entiendes cómo funcionas. Los próximos 90 días son la prueba real.
            </p>
            <Button 
              onClick={() => {
                trackEvent('a1_bridge_cta_clicked', {})
                router.push('/despega/a2/intro')
              }} 
              className="gap-2 px-8 py-6 text-lg w-full bg-purple hover:from-purple-700 hover:to-blue text-white font-semibold"
              size="lg"
            >
              Comenzar tu Misión de 90 Días
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-xs text-muted/50 dark:text-muted/40">
            Fase A2: 3 sprints de 30 días cada uno → Energía, Enfoque, Relaciones, Plan Ejecutivo en acción
          </p>
        </div>
      </div>
    </div>
  )
}
