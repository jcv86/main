'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { generatePersonalizedRoute, type PersonalizedRoute } from '@/lib/route-generator'
import { type DespegarProfile } from '@/lib/disc-calculator'
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
      30: { label: 'Mes 1', milestone: 'Fundamentos', tasks: route?.route_30days || [] },
      60: { label: 'Mes 2', milestone: 'Aceleración', tasks: route?.route_60days || [] },
      90: { label: 'Mes 3', milestone: 'Dominio', tasks: route?.route_90days || [] }
    }
    return milestonesMap[days]
  }

  // Milestone color helper
  const getMilestoneColor = (days: 30 | 60 | 90) => {
    const colorsMap = {
      30: 'from-blue to-blue',
      60: 'from-purple to-purple/50',
      90: 'from-green to-green'
    }
    return colorsMap[days]
  }

  useEffect(() => {
    if (authLoading || !user?.id) return
    loadAndGenerateRoute()
  }, [authLoading, user?.id])

  const loadAndGenerateRoute = async () => {
    try {
      console.log('[v0] Starting A2 route generation for user:', user?.id)
      
      let discProfile: DespegarProfile = {
        energia: 50,
        enfoque: 50,
        relaciones: 50,
        plan_ejecutivo: 50,
        primary: 'energia',
        primaryScore: 50,
        secondary: 'enfoque',
        secondaryScore: 50,
      }
      let objective = 'Desarrollo profesional'
      let skills = ['Liderazgo', 'Comunicación', 'Estrategia']
      let timePerWeek = 5

      // Get DISC profile from a1_cerebral_assessment
      const { data: discData, error: discError } = await supabase
        .from('a1_cerebral_assessment')
        .select('disc_profile, dominant_pattern, secondary_pattern')
        .eq('user_id', user?.id)
        .order('completed_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      console.log('[v0] DISC profile fetch result:', { discError, hasProfile: !!discData?.disc_profile })

      if (!discError && discData?.disc_profile) {
        // Map single character to DespegarProfile dimensions
        const discChar = discData.disc_profile as string
        
        // Create profile with proper typing
        if (discChar === 'D') {
          discProfile = { energia: 75, enfoque: 50, relaciones: 50, plan_ejecutivo: 60, primary: 'energia', primaryScore: 75, secondary: 'plan_ejecutivo', secondaryScore: 60 }
        } else if (discChar === 'I') {
          discProfile = { energia: 75, enfoque: 50, relaciones: 75, plan_ejecutivo: 50, primary: 'relaciones', primaryScore: 75, secondary: 'energia', secondaryScore: 75 }
        } else if (discChar === 'S') {
          discProfile = { energia: 50, enfoque: 60, relaciones: 80, plan_ejecutivo: 50, primary: 'relaciones', primaryScore: 80, secondary: 'enfoque', secondaryScore: 60 }
        } else if (discChar === 'C') {
          discProfile = { energia: 50, enfoque: 80, relaciones: 50, plan_ejecutivo: 75, primary: 'enfoque', primaryScore: 80, secondary: 'plan_ejecutivo', secondaryScore: 75 }
        }
      }

      // Get Conozcamonos 2 responses - Try canonical table first, then fallback
      console.log('[v0] Fetching C2 responses...')
      const { data: c2Data, error: c2Error } = await supabase
        .from('canon_conozcamonos_2_responses')
        .select('responses')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      console.log('[v0] C2 responses fetch result:', { c2Error, hasResponses: !!c2Data?.responses })

      if (!c2Error && c2Data?.responses) {
        const responses = c2Data.responses
        console.log('[v0] C2 responses loaded:', Object.keys(responses))
        objective = (responses[1] as string) || objective
        skills = ((responses[4] as string[] || []).slice(0, 3)) || skills
        timePerWeek = parseInt((responses[5] as string)?.split('-')[0]) || timePerWeek
      } else if (c2Error) {
        console.log('[v0] No C2 responses found, using defaults:', c2Error)
        // Use defaults - this happens when A2 routes page loads before C2 saves
      }

      console.log('[v0] Route parameters:', { objective, skills, timePerWeek, discProfile })

      console.log('[v0] Generating route with AI...')
      const generatedRoute = await generatePersonalizedRoute(
        discProfile,
        objective,
        skills,
        timePerWeek
      )

      console.log('[v0] Route generated, saving to BD...')

      // Save route to a2_rutas_personalizadas table
      const { error: saveError } = await supabase.from('a2_rutas_personalizadas').upsert({
        user_id: user?.id,
        ruta_30_dias: { phase: 30, data: generatedRoute },
        ruta_60_dias: { phase: 60, data: generatedRoute },
        ruta_90_dias: { phase: 90, data: generatedRoute },
        focos_priorizados: skills,
        orden_avance: { objective, timePerWeek },
        ruta_activa: '30',
        updated_at: new Date().toISOString()
      })

      if (saveError) {
        console.error('[v0] Error saving route:', saveError)
        setError('Error al guardar tu ruta. Por favor intenta de nuevo.')
        return
      }

      setRoute(generatedRoute)
      console.log('[v0] A2 Route generated and saved successfully', { route: generatedRoute })
    } catch (err) {
      console.error('[v0] Error loading A2 routes:', err)
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido'
      console.error('[v0] Full error details:', { error: err })
      setError(`Error al generar tus rutas: ${errorMsg}`)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-purple/50" />
          <p className="text-muted/30">Generando tu ruta personalizada...</p>
        </div>
      </div>
    )
  }

  if (error || !route) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-muted/90 border-red/50/50 p-8">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-red flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-2">Error en A2: Ruta</h2>
                <p className="text-red/40 text-lg mb-6">{error || 'No se encontró ruta personalizada'}</p>
                <Button 
                  onClick={() => loadAndGenerateRoute()}
                  className="bg-blue hover:bg-blue text-white"
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
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl">🗺️</span> A2: Ruta
          </h1>
          <p className="text-lg text-muted/40">Tu plan personalizado de 90 días</p>
        </div>

        {/* What is A2 */}
        <Card className="bg-muted/90 border-muted/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Zap className="w-5 h-5 text-orange" />
              Tu Ruta de 90 Días (Fase de Visualización)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted/30">
              Basado en tu perfil DISC y objetivos, hemos generado tu plan personalizado de 90 días. 
              Este es el resultado de A2: Diseño de tu Ruta. Aquí visualizas las acciones, milestones y recursos 
              organizados en 3 fases progresivas para llevar tu carrera al siguiente nivel.
            </p>
            <p className="text-muted/40 text-sm">
              📋 Estructura: 3 fases de 30 días cada una con tareas específicas, recursos y hitos de progreso.
            </p>
          </CardContent>
        </Card>

        {/* Progress */}
        <Card className="bg-muted/90 border-muted/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <MapPin className="w-5 h-5 text-cyan/50" />
              Tu Progreso en A2
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-emerald-900/20 border border-green/30 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
              <div>
                <p className="font-semibold text-emerald-400">Ruta Generada</p>
                <p className="text-sm text-muted/40">Tu plan de 90 días personalizado está listo</p>
              </div>
            </div>
            
            <div className="p-4 bg-muted/80/30 border border-muted/70 rounded-lg">
              <p className="text-muted/30 text-sm mb-3">Próximo: Continúa a <span className="font-semibold">Entrenamiento Intensivo</span> para prepararte para entrevistas</p>
              <Button 
                onClick={() => router.push('/despega/a3-intro')}
                className="w-full bg-blue hover:bg-cyan"
              >
                Ir a Entrenamiento Intensivo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 90-Day Timeline */}
        <Card className="bg-muted/90 border-muted/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Calendar className="w-5 h-5 text-blue/50" />
              Tus 90 Días Estructurados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {([30, 60, 90] as const).map((days) => {
              const data = getMilestoneData(days)
              const isExpanded = expandedMilestone === days
              
              return (
                <div key={days} className="bg-gradient-to-br from-muted/80/50 to-muted/70/30 border border-muted/70/50 rounded-xl overflow-hidden">
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
                    <div className="p-6 space-y-4 bg-muted/80/20">
                      {data.tasks && data.tasks.length > 0 ? (
                        <div className="space-y-3">
                          {data.tasks.map((task, idx) => (
                            <div key={idx} className="bg-muted/70/30 border border-muted/60/30 rounded-[28px] p-4 hover:border-muted/50/50 transition">
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0">
                                  {task.type === 'learning' && <span className="text-2xl">📚</span>}
                                  {task.type === 'practice' && <span className="text-2xl">🛠️</span>}
                                  {task.type === 'networking' && <span className="text-2xl">🤝</span>}
                                  {task.type === 'planning' && <span className="text-2xl">📋</span>}
                                  {task.type === 'milestone' && <span className="text-2xl">🏆</span>}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between gap-2">
                                    <h4 className="font-semibold text-white text-sm">Día {task.day}: {task.title}</h4>
                                    <span className="text-xs bg-muted/60/50 text-muted/30 px-2 py-1 rounded whitespace-nowrap">
                                      {Math.round(task.timeEstimate / 60)}h
                                    </span>
                                  </div>
                                  <p className="text-sm text-muted/40 mt-2">{task.description}</p>
                                  {task.resources && task.resources.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      {task.resources.map((resource, ridx) => (
                                        <span key={ridx} className="text-xs bg-blue/50/20 text-blue/30 px-2 py-1 rounded">
                                          📌 {resource}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted/40">Contenido personalizado para la fase de {days} días</p>
                      )}
                    </div>
                  )}
                </div>
              )
            })}

            {/* Success Metrics */}
            <div className="bg-gradient-to-br from-green/20 to-green/10 border border-green/30 rounded-[28px] p-6">
              <h3 className="text-lg font-bold text-emerald-400 mb-4">Métricas de Éxito</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <p className="text-muted/30">Completar todas las acciones de cada fase</p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <p className="text-muted/30">Dedicar el tiempo programado cada semana</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="bg-muted/90 border-muted/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <CheckCircle2 className="w-5 h-5 text-purple/50" />
              Próximos Pasos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card className="bg-muted/80/40 border-muted/70 hover:border-blue/50/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg">Ver Detalle del Plan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted/40">
                    Expande cada fase (30, 60, 90 días) para ver las acciones detalladas.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-muted/80/40 border-muted/70 hover:border-blue/50/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg">Avanzar a A3</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted/40">
                    Dirígete a <span className="font-semibold">A3: Impulso</span> para prepararte para entrevistas.
                  </p>
                  <Button 
                    onClick={() => router.push('/despega/a3-dashboard')}
                    className="w-full bg-blue hover:bg-blue mt-2"
                    size="sm"
                  >
                    Ir a A3: Impulso
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="p-6 bg-gradient-to-r from-blue/30 to-blue/30 border border-blue/50/30 rounded-lg">
              <p className="text-muted/30 mb-4">
                <strong>Este es tu plan. Adáptalo según sea necesario.</strong> La vida acontece, y el plan puede cambiar. 
                Si necesitas ajustes o tienes preguntas, habla con el coach.
              </p>
              <Button variant="outline" className="border-blue/50 hover:border-blue/40 hover:text-blue/40">
                Hablar con el Coach
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
