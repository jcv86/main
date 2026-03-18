'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { generatePersonalizedRoute, type PersonalizedRoute } from '@/lib/route-generator'
import { calculateDiscProfile } from '@/lib/disc-calculator'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, Calendar, Target, CheckCircle2, AlertCircle } from 'lucide-react'

export default function A2RoutesPage() {
  const [route, setRoute] = useState<PersonalizedRoute | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedMilestone, setExpandedMilestone] = useState<30 | 60 | 90 | null>(30)
  const { user, loading: authLoading } = useAuthRedirect()
  const supabase = createClient()

  useEffect(() => {
    if (authLoading || !user?.id) return
    loadAndGenerateRoute()
  }, [authLoading, user?.id])

  const loadAndGenerateRoute = async () => {
    try {
      // Get DISC profile
      const { data: discData } = await supabase
        .from('user_a1_profiles')
        .select('disc_profile')
        .eq('user_id', user?.id)
        .single()

      if (!discData?.disc_profile) {
        setError('No se encontró perfil DISC. Por favor completa A1.')
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
      <ASection
        title="A2: Ruta"
        subtitle="Tu plan personalizado de 90 días"
        icon="🗺️"
        colorClass="from-blue-500 to-cyan-500"
      >
        <ASectionPart title="Error" icon={<AlertCircle />}>
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <Button 
            onClick={() => loadAndGenerateRoute()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Reintentar
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </ASectionPart>
      </ASection>
    )
  }

  return (
    <ASection
      title="A2: Ruta"
      subtitle="Tu plan personalizado de 90 días"
      icon="🗺️"
      colorClass="from-blue-500 to-cyan-500"
    >
      {/* EXPLICACIÓN */}
      <ASectionPart title="¿Qué es A2: Ruta?" icon={<Zap />}>
        <p className="text-slate-300 mb-4">
          En A2 creamos tu plan de acción personalizado para los próximos 90 días. Este plan se basa en tu perfil DISC, 
          tus objetivos profesionales y el tiempo que puedes dedicar cada semana. Es tu hoja de ruta para llevar 
          tu desarrollo al siguiente nivel.
        </p>
        <p className="text-slate-400 text-sm">
          ⏱️ Duración: 90 días estructurados en 3 fases de 30 días cada una con hitos específicos.
        </p>
      </ASectionPart>

      {/* FLUJO / PROCESO */}
      <ASectionPart title="Tu Progreso en A2" icon={<MapPin />}>
        <div className="space-y-4">
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
        </div>
      </ASectionPart>

      {/* RESULTADOS */}
      <ASectionPart title="Tus 90 Días Estructurados" icon={<Calendar />}>
        <div className="space-y-6">
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
                    {data.actions.map((action) => (
                      <div
                        key={action.day}
                        className="flex gap-4 pb-4 border-b border-slate-700 last:border-b-0"
                      >
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white">
                            {action.day}
                          </div>
                        </div>
                        <div className="flex-1 pt-1">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-white">
                              {action.title}
                            </h4>
                            <Badge className="bg-slate-700 text-slate-100 hover:bg-slate-600">
                              {action.type}
                            </Badge>
                          </div>
                          <p className="text-slate-400 mb-2">
                            {action.description}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-slate-400">
                            <Calendar className="w-4 h-4" />
                            {action.timeEstimate} minutos
                          </div>
                          {action.resources && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {action.resources.map((res) => (
                                <Badge key={res} variant="outline" className="text-xs border-slate-600 text-slate-300">
                                  {res}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Success Metrics */}
        <div className="bg-gradient-to-br from-emerald-900/20 to-emerald-800/10 border border-emerald-500/30 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-bold text-emerald-400 mb-4">Métricas de Éxito</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {route.successMetrics.map((metric, i) => (
              <div key={i} className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <p className="text-slate-300">{metric}</p>
              </div>
            ))}
          </div>
        </div>
      </ASectionPart>

      {/* DASHBOARD / ACCIONES */}
      <ASectionPart title="Próximos Pasos" icon={<CheckCircle2 />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-slate-800/40 border-slate-700 hover:border-blue-500/50 transition-colors">
            <CardHeader>
              <CardTitle className="text-lg">Ver Detalle del Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-slate-400">
                Expande cada fase (30, 60, 90 días) para ver las acciones detalladas de cada semana y lo que necesitas completar.
              </p>
              <p className="text-xs text-slate-500">Haz clic en cualquier fase arriba para expandir</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/40 border-slate-700 hover:border-blue-500/50 transition-colors">
            <CardHeader>
              <CardTitle className="text-lg">Avanzar a A3</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-slate-400">
                Una vez entiendas tu ruta, dirígete a <span className="font-semibold">A3: Impulso</span> para prepararte 
                para entrevistas y construcción de marca.
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

        <div className="mt-6 p-6 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-blue-500/30 rounded-lg">
          <p className="text-slate-300 mb-4">
            <strong>Este es tu plan. Adáptalo según sea necesario.</strong> La vida acontece, y el plan puede cambiar. 
            Si necesitas ajustes o tienes preguntas, habla con el coach.
          </p>
          <Button variant="outline" className="border-blue-500 hover:border-blue-400 hover:text-blue-400">
            Hablar con el Coach
          </Button>
        </div>
      </ASectionPart>
    </ASection>
