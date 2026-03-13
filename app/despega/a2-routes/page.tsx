'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
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
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadAndGenerateRoute()
  }, [])

  const loadAndGenerateRoute = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user?.id) {
        router.push('/auth/signin')
        return
      }

      // Get DISC profile
      const { data: discData } = await supabase
        .from('user_a1_profiles')
        .select('disc_profile')
        .eq('user_id', user.id)
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
        user_id: user.id,
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <p className="text-slate-600 dark:text-slate-400">Generando tus rutas personalizadas...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
        <Card className="max-w-md p-8">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <Button onClick={() => loadAndGenerateRoute()} className="w-full">
            Reintentar
          </Button>
        </Card>
      </div>
    )
  }

  if (!route) return null

  const getMilestoneColor = (days: 30 | 60 | 90) => {
    if (days === 30) return 'from-blue-500 to-blue-600'
    if (days === 60) return 'from-yellow-500 to-yellow-600'
    return 'from-green-500 to-green-600'
  }

  const getMilestoneData = (days: 30 | 60 | 90) => {
    if (days === 30) return { label: '30 Días', actions: route.route_30days, milestone: route.milestones.day_30 }
    if (days === 60) return { label: '60 Días', actions: route.route_60days, milestone: route.milestones.day_60 }
    return { label: '90 Días', actions: route.route_90days, milestone: route.milestones.day_90 }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Tu Ruta A2: Personalizados 30-60-90 Días
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Plan de acción detallado diseñado específicamente para ti
          </p>
        </div>

        {/* Success Metrics */}
        <Card className="p-8 mb-8 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Métricas de Éxito
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {route.successMetrics.map((metric, i) => (
              <div key={i} className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-slate-700 dark:text-slate-300">{metric}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Timeline Milestones */}
        <div className="space-y-6 mb-12">
          {([30, 60, 90] as const).map((days) => {
            const data = getMilestoneData(days)
            const isExpanded = expandedMilestone === days
            
            return (
              <Card key={days} className="overflow-hidden">
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
                  <div className="p-6 space-y-4">
                    {data.actions.map((action) => (
                      <div
                        key={action.day}
                        className="flex gap-4 pb-4 border-b border-slate-200 dark:border-slate-700 last:border-b-0"
                      >
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-900 dark:text-white">
                            Día {action.day}
                          </div>
                        </div>
                        <div className="flex-1 pt-1">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-slate-900 dark:text-white">
                              {action.title}
                            </h4>
                            <Badge variant={
                              action.type === 'milestone' ? 'default' :
                              action.type === 'learning' ? 'secondary' :
                              'outline'
                            }>
                              {action.type}
                            </Badge>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 mb-2">
                            {action.description}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Clock className="w-4 h-4" />
                            {action.timeEstimate} minutos
                          </div>
                          {action.resources && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {action.resources.map((res) => (
                                <Badge key={res} variant="outline" className="text-xs">
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
              </Card>
            )
          })}
        </div>

        {/* Navigation */}
        <div className="flex gap-4 justify-between">
          <Button
            variant="outline"
            onClick={() => router.push('/despega/a1-report')}
          >
            Volver a A1
          </Button>
          <Button
            onClick={() => router.push('/despega/a3-preparation')}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Continuar a A3: Impulso
          </Button>
        </div>
      </div>
    </div>
  )
}

function Clock({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}
