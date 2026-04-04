'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { generatePersonalizedRoute, type PersonalizedRoute } from '@/lib/route-generator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, Calendar, Target, CheckCircle2, AlertCircle, ArrowRight, Zap, MapPin } from 'lucide-react'

export default function A2RoutesPage() {
  const router = useRouter()
  const [route, setRoute] = useState<PersonalizedRoute | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedMilestone, setExpandedMilestone] = useState<30 | 60 | 90 | null>(30)
  const { user, loading: authLoading } = useAuthRedirect()
  const supabase = createClient()

  // Milestone data helper
  const getMilestoneData = (days: 30 | 60 | 90) => {
    const milestonesMap = {
      30: { label: 'Mes 1', milestone: 'Fundamentos', actions: [] },
      60: { label: 'Mes 2', milestone: 'Aceleración', actions: [] },
      90: { label: 'Mes 3', milestone: 'Dominio', actions: [] }
    }
    return milestonesMap[days]
  }

  // Milestone color helper
  const getMilestoneColor = (days: 30 | 60 | 90) => {
    const colorsMap = {
      30: 'from-blue-600 to-blue-500',
      60: 'from-purple-600 to-purple-500',
      90: 'from-emerald-600 to-emerald-500'
    }
    return colorsMap[days]
  }

  useEffect(() => {
    if (authLoading || !user?.id) return
    loadAndGenerateRoute()
  }, [authLoading, user?.id])

  const loadAndGenerateRoute = async () => {
    try {
      // Get DISC profile from a1_cerebral_assessment
      const { data: discData, error: discError } = await supabase
        .from('a1_cerebral_assessment')
        .select('disc_profile, dominant_pattern, secondary_pattern')
        .eq('user_id', user?.id)
        .order('completed_at', { ascending: false })
        .limit(1)
        .single()

      if (discError || !discData?.disc_profile) {
        setError('No se encontró perfil de El Ritual. Por favor completa A1: Despega Cerebral primero.')
        return
      }

      // Get Conozcamonos 2 responses
      const { data: c2Data } = await supabase
        .from('canon_conozcamonos_2_responses')
        .select('responses')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (!c2Data?.responses) {
        setError('No se encontraron respuestas de Conozcamonos 2.')
        return
      }

      const responses = c2Data.responses

      // Generate personalized route
      const objective = responses[1] as string || 'Desarrollo profesional'
      const skills = (responses[4] as string[] || []).slice(0, 3)
      const timePerWeek = parseInt((responses[5] as string)?.split('-')[0]) || 5

      const generatedRoute = generatePersonalizedRoute(
        discData.disc_profile,
        objective,
        skills,
        timePerWeek
      )

      // Save route
      await supabase.from('user_a2_routes').upsert({
        user_id: user?.id,
        route_data: generatedRoute,
        objective,
        skills,
        updated_at: new Date().toISOString()
      })

      setRoute(generatedRoute)
      console.log('[v0] A2 Route generated successfully')
    } catch (err) {
      console.error('[v0] Error loading A2 routes:', err)
      setError('Error al generar tus rutas. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          <p className="text-slate-300">Generando tu ruta personalizada...</p>
        </div>
      </div>
    )
  }

  if (error || !route) {
    return (
      <div className="min-h-screen bg-slate-950 p-8">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-slate-900 border-red-500/50 p-8">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-2">Error en A2: Ruta</h2>
                <p className="text-red-400 text-lg mb-6">{error || 'No se encontró ruta personalizada'}</p>
                <Button 
                  onClick={() => loadAndGenerateRoute()}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Reintentar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl">🗺️</span> A2: Ruta
          </h1>
          <p className="text-lg text-slate-400">Tu plan personalizado de 90 días</p>
        </div>

        {/* What is A2 */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Zap className="w-5 h-5 text-yellow-500" />
              ¿Qué es A2: Ruta?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-300">
              En A2 creamos tu plan de acción personalizado para los próximos 90 días. Este plan se basa en tu perfil DISC, 
              tus objetivos profesionales y el tiempo que puedes dedicar cada semana. Es tu hoja de ruta para llevar 
              tu desarrollo al siguiente nivel.
            </p>
            <p className="text-slate-400 text-sm">
              ⏱️ Duración: 90 días estructurados en 3 fases de 30 días cada una con hitos específicos.
            </p>
          </CardContent>
        </Card>

        {/* Progress */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <MapPin className="w-5 h-5 text-cyan-500" />
              Tu Progreso en A2
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
              <div>
                <p className="font-semibold text-emerald-400">Ruta Generada</p>
                <p className="text-sm text-slate-400">Tu plan de 90 días personalizado está listo</p>
              </div>
            </div>
            
            <div className="p-4 bg-slate-800/30 border border-slate-700 rounded-lg">
              <p className="text-slate-300 text-sm mb-3">Próximo: Continúa a <span className="font-semibold">A3: Impulso</span> para prepararte para entrevistas</p>
              <Button 
                onClick={() => router.push('/despega/a3-dashboard')}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Ir a A3: Impulso
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 90-Day Timeline */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Calendar className="w-5 h-5 text-blue-500" />
              Tus 90 Días Estructurados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {([30, 60, 90] as const).map((days) => {
              const data = getMilestoneData(days)
              const isExpanded = expandedMilestone === days
              
              return (
                <div key={days} className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border border-slate-700/50 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedMilestone(isExpanded ? null : days)}
                    className={`w-full p-6 text-left bg-gradient-to-r ${getMilestoneColor(days)} text-white hover:opacity-90 transition`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Calendar className="w-6 h-6" />
                        <div>
                          <h3 className="text-2xl font-bold">{data.label}</h3>
                          <p className="text-white/80">{data.milestone}</p>
                        </div>
                      </div>
                      <div className="text-3xl opacity-20">{days}</div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="p-6 space-y-4 bg-slate-800/20">
                      <p className="text-slate-300">Contenido personalizado para la fase de {days} días</p>
                    </div>
                  )}
                </div>
              )
            })}

            {/* Success Metrics */}
            <div className="bg-gradient-to-br from-emerald-900/20 to-emerald-800/10 border border-emerald-500/30 rounded-lg p-6">
              <h3 className="text-lg font-bold text-emerald-400 mb-4">Métricas de Éxito</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-300">Completar todas las acciones de cada fase</p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-300">Dedicar el tiempo programado cada semana</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <CheckCircle2 className="w-5 h-5 text-purple-500" />
              Próximos Pasos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card className="bg-slate-800/40 border-slate-700 hover:border-blue-500/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg">Ver Detalle del Plan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-slate-400">
                    Expande cada fase (30, 60, 90 días) para ver las acciones detalladas.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/40 border-slate-700 hover:border-blue-500/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg">Avanzar a A3</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-slate-400">
                    Dirígete a <span className="font-semibold">A3: Impulso</span> para prepararte para entrevistas.
                  </p>
                  <Button 
                    onClick={() => router.push('/despega/a3-dashboard')}
                    className="w-full bg-blue-600 hover:bg-blue-700 mt-2"
                    size="sm"
                  >
                    Ir a A3: Impulso
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="p-6 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-blue-500/30 rounded-lg">
              <p className="text-slate-300 mb-4">
                <strong>Este es tu plan. Adáptalo según sea necesario.</strong> La vida acontece, y el plan puede cambiar. 
                Si necesitas ajustes o tienes preguntas, habla con el coach.
              </p>
              <Button variant="outline" className="border-blue-500 hover:border-blue-400 hover:text-blue-400">
                Hablar con el Coach
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
