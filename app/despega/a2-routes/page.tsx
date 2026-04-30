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
import { Loader2, Calendar, Target, CheckCircle2, AlertCircle, ArrowRight, Zap, MapPin, Download, Trophy } from 'lucide-react'
import { TaskCard } from '@/components/task-card'
import { PhaseProgress } from '@/components/phase-progress'
import { AchievementsDisplay } from '@/components/achievement-badge'
import { RecommendationsDisplay } from '@/components/recommendations-display'
import { ResourceLibrary } from '@/components/resource-library'
import { 
  fetchUserCompletions, 
  markTaskComplete, 
  unmarkTaskComplete, 
  completionsToSet,
  getTaskId 
} from '@/lib/supabase/task-completions'
import { calculateBadges, BADGES } from '@/lib/badge-system'
import { getSimpleRecommendations } from '@/lib/recommendation-engine'
import { exportProgressToPDF } from '@/lib/pdf-export'

export default function A2RoutesPage() {
  const router = useRouter()
  const [route, setRoute] = useState<PersonalizedRoute | null>(null)
  const [discProfile, setDiscProfile] = useState<string>('DISC Profile')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedMilestone, setExpandedMilestone] = useState<30 | 60 | 90 | null>(30)
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set())
  const [isSyncing, setIsSyncing] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const { user, loading: authLoading } = useAuthRedirect()
  const supabase = createClient()

  // Load completions from Supabase on mount
  useEffect(() => {
    if (authLoading || !user?.id) return
    loadCompletionsFromSupabase()
  }, [authLoading, user?.id])

  const loadCompletionsFromSupabase = async () => {
    try {
      const completions = await fetchUserCompletions()
      const completionSet = completionsToSet(completions)
      setCompletedTasks(completionSet)
      console.log('[v0] Loaded', completionSet.size, 'completed tasks from Supabase')
    } catch (err) {
      console.error('[v0] Error loading completions:', err)
      // Continue with empty set if load fails - user can still work locally
    }
  }

  // Handle task completion with Supabase sync
  const handleTaskComplete = async (taskId: string) => {
    // Optimistic update
    const newCompleted = new Set(completedTasks)
    const isCurrentlyCompleted = newCompleted.has(taskId)
    
    if (isCurrentlyCompleted) {
      newCompleted.delete(taskId)
    } else {
      newCompleted.add(taskId)
    }
    setCompletedTasks(newCompleted)

    // Parse task ID to get phase, day, and title
    const parts = taskId.split('-')
    const phase = parseInt(parts[0]) as 30 | 60 | 90
    const day = parseInt(parts[1])
    // Join remaining parts in case title has dashes
    const title = parts.slice(2).join('-')

    // Sync to Supabase in background
    setIsSyncing(true)
    try {
      if (isCurrentlyCompleted) {
        // Task was completed, now uncompleting it
        await unmarkTaskComplete(phase, day, title)
        console.log('[v0] Task unmarked in Supabase:', taskId)
      } else {
        // Task is now being completed
        await markTaskComplete(phase, day, title)
        console.log('[v0] Task marked in Supabase:', taskId)
      }
    } catch (err) {
      console.error('[v0] Error syncing task completion:', err)
      // Revert optimistic update on error
      setCompletedTasks(completedTasks)
    } finally {
      setIsSyncing(false)
    }
  }

  // Calculate phase progress
  const getPhaseProgress = (days: 30 | 60 | 90) => {
    const tasksMap = {
      30: route?.route_30days || [],
      60: route?.route_60days || [],
      90: route?.route_90days || []
    }
    const tasks = tasksMap[days]
    const completed = tasks.filter(task => 
      completedTasks.has(`${days}-${task.day}-${task.title}`)
    ).length
    return { completed, total: tasks.length }
  }

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
      30: 'from-blue',
      60: 'from-purple/50',
      90: 'from-green'
    }
    return colorsMap[days]
  }

  // Calculate total progress
  const calculateTotalProgress = () => {
    const allTasks = [...(route?.route_30days || []), ...(route?.route_60days || []), ...(route?.route_90days || [])]
    const completed = allTasks.filter(task => {
      const phases = [30, 60, 90] as const
      return phases.some(phase => 
        completedTasks.has(`${phase}-${task.day}-${task.title}`)
      )
    }).length
    return { completed, total: allTasks.length }
  }

  // Handle PDF export
  const handleExportPDF = async () => {
    if (!user || !route) return
    
    setIsExporting(true)
    try {
      const totalProgress = calculateTotalProgress()
      const completionPercentage = totalProgress.total > 0 
        ? (totalProgress.completed / totalProgress.total) * 100 
        : 0

      const unlockedBadges = calculateBadges(totalProgress.completed, totalProgress.total)
      const badgesForPDF = unlockedBadges.map(badgeId => {
        const badge = BADGES[badgeId]
        return {
          title: badge.title,
          icon: badge.icon
        }
      })
      const recommendations = getSimpleRecommendations(
        completedTasks,
        route.route_30days || [],
        route.route_60days || [],
        route.route_90days || []
      )
      const recommendationsForPDF = recommendations.map(rec => `${rec.title}: ${rec.description}`)

      await exportProgressToPDF({
        userName: user.email || 'Usuario',
        profile: discProfile,
        completedTasks: totalProgress.completed,
        totalTasks: totalProgress.total,
        badges: badgesForPDF,
        recommendations: recommendationsForPDF
      })

      console.log('[v0] PDF exported successfully')
    } catch (err) {
      console.error('[v0] Error exporting PDF:', err)
      alert('Error al exportar PDF. Por favor intenta de nuevo.')
    } finally {
      setIsExporting(false)
    }
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
      setDiscProfile(discProfile.primary || 'DISC Profile')
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
          <Loader2 className="h-8 w-8 animate-spin text-white0" />
          <p className="text-white/85">Generando tu ruta personalizada...</p>
        </div>
      </div>
    )
  }

  if (error || !route) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-transparent border-red/50/50 p-8">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-red flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-2">Ruta de 90 Días - Diseña Tu Camino</h2>
                <p className="text-red text-lg mb-6">{error || 'No se encontró ruta personalizada'}</p>
                <Button 
                  onClick={() => loadAndGenerateRoute()}
                  className="bg-blue/80 hover:bg-blue/70 text-white"
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
          <h1 className="text-5xl font-black text-white flex items-center gap-3">
            <span className="text-4xl">🗺️</span> Tu Ruta: De Aquí a Imprescindible
          </h1>
          <p className="text-xl text-white/85">Tu plan personalizado de 90 días mapeado a conversaciones reales</p>
        </div>

        {/* Main Intro Section */}
        <div className="bg-gradient-to-r from-purple/20 to-blue/20 border-2 border-purple/40 rounded-2xl p-10">
          <h2 className="text-3xl font-bold text-white mb-6">Tu Ruta 7/30/90</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* 7 Days */}
            <div className="bg-background/50 border border-white/20 rounded-xl p-6">
              <p className="text-sm font-bold text-purple uppercase tracking-wide mb-2">SEMANA 1</p>
              <h3 className="text-2xl font-black text-white mb-4">7 Días</h3>
              <p className="text-white/85 leading-relaxed mb-4">Prepárate para tu primera conversación de LinkedIn. Optimiza perfil, prepara pitch elevator de 30 segundos.</p>
              <p className="text-sm text-purple font-semibold">🎯 Conversación: LinkedIn</p>
            </div>

            {/* 30 Days */}
            <div className="bg-background/50 border border-white/20 rounded-xl p-6">
              <p className="text-sm font-bold text-blue uppercase tracking-wide mb-2">MES 1</p>
              <h3 className="text-2xl font-black text-white mb-4">30 Días</h3>
              <p className="text-white/85 leading-relaxed mb-4">Domina entrevista técnica o conductual. Practica respuestas STAR, manejo de objeciones, cierre de oportunidades.</p>
              <p className="text-sm text-blue font-semibold">🎯 Conversación: Entrevista</p>
            </div>

            {/* 90 Days */}
            <div className="bg-background/50 border border-white/20 rounded-xl p-6">
              <p className="text-sm font-bold text-green uppercase tracking-wide mb-2">TRIMESTRE</p>
              <h3 className="text-2xl font-black text-white mb-4">90 Días</h3>
              <p className="text-white/85 leading-relaxed mb-4">Negocia tu propuesta. Habla de sueldo, beneficios, rol, visión de carrera con seguridad y profesionalismo.</p>
              <p className="text-sm text-green font-semibold">🎯 Conversación: Career</p>
            </div>
          </div>
          
          <div className="bg-background/30 border border-white/10 rounded-lg p-6 text-center">
            <p className="text-white/90 leading-relaxed text-lg">
              Cada fase te transforma en una pieza imprescindible para tus potenciales empleadores. 
              No es solo conseguir un trabajo, es posicionar tu carrera para los próximos 10 años.
            </p>
          </div>
        </div>

        {/* What is this phase */}
        <Card className="bg-gradient-to-r from-blue/15 to-purple/15 border-2 border-blue/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white text-2xl">
              <Zap className="w-6 h-6 text-blue" />
              Cómo Funciona Tu Ruta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue/20 border border-blue/40">
                    <span className="text-blue font-bold text-lg">1</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg mb-2">Acciones Concretas</h3>
                  <p className="text-white/85">Cada tarea está mapeada a una conversación real: LinkedIn networking, entrevistas o negociación de cargo.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-purple/20 border border-purple/40">
                    <span className="text-purple font-bold text-lg">2</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg mb-2">Progresión Estructurada</h3>
                  <p className="text-white/85">3 fases claramente definidas: Fundamentos → Aceleración → Dominio. Cada una te acerca a ser imprescindible.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-green/20 border border-green/40">
                    <span className="text-green font-bold text-lg">3</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg mb-2">Personalización</h3>
                  <p className="text-white/85">Tu ruta es única según tu perfil cerebral, objetivos y nivel actual. No hay dos rutas iguales.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-yellow/20 border border-yellow/40">
                    <span className="text-yellow font-bold text-lg">4</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg mb-2">Trackeo Real</h3>
                  <p className="text-white/85">Marca tareas como completadas y ve tu progreso en tiempo real. Gana badges y hitos conforme avanzas.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Route Breakdown - Tus 90 Días Estructurados */}
        <Card className="bg-transparent border-muted/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Calendar className="w-5 h-5 text-purple/40" />
              Tus 90 Días Estructurados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {([30, 60, 90] as const).map((days) => {
              const data = getMilestoneData(days)
              const isExpanded = expandedMilestone === days
              
              return (
                <div key={days} className="bg-background">
                  <button
                    onClick={() => setExpandedMilestone(isExpanded ? null : days)}
                    className={`w-full p-6 text-left bg-background`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Calendar className="w-6 h-6 text-purple/40" />
                        <div>
                          <h3 className="text-2xl font-bold text-white">{data.label}</h3>
                          <p className="text-white/80">{data.milestone}</p>
                        </div>
                      </div>
                      <div className="text-3xl opacity-20 text-white">{days}</div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="p-6 space-y-6 bg-muted/80/20">
                      {/* Phase Progress */}
                      <PhaseProgress
                        phaseName={`Fase ${data.label}`}
                        completed={getPhaseProgress(days).completed}
                        total={getPhaseProgress(days).total}
                        daysRange={`${days === 30 ? '1-30' : days === 60 ? '31-60' : '61-90'} días`}
                      />

                      {/* Tasks */}
                      {data.tasks && data.tasks.length > 0 ? (
                        <div className="space-y-3">
                          {data.tasks.map((task, idx) => (
                            <TaskCard
                              key={`${days}-${idx}`}
                              task={task}
                              taskId={`${days}-${task.day}-${task.title}`}
                              completed={completedTasks.has(`${days}-${task.day}-${task.title}`)}
                              onComplete={handleTaskComplete}
                            />
                          ))}
                        </div>
                      ) : (
                        <p className="text-white/75">Contenido personalizado para la fase de {days} días</p>
                      )}
                    </div>
                  )}
                </div>
              )
            })}

            {/* Success Metrics */}
            <div className="bg-background">
              <h3 className="text-lg font-bold text-emerald-400 mb-4">Métricas de Éxito</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <p className="text-white/85">Completar todas las acciones de cada fase</p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <p className="text-white/85">Dedicar el tiempo programado cada semana</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="bg-transparent border-muted/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <CheckCircle2 className="w-5 h-5 text-white0" />
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
                  <p className="text-sm text-white/85">
                    Expande cada fase (30, 60, 90 días) para ver las acciones detalladas.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-muted/80/40 border-muted/70 hover:border-blue/50/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg">Avanzar a A3</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-white/85">
                    Dirígete a <span className="font-semibold">Entrenamiento Intensivo</span> para prepararte para entrevistas.
                  </p>
                  <Button 
                    onClick={() => router.push('/despega/a3')}
                    className="w-full bg-blue/80 hover:bg-blue/70 mt-2"
                    size="sm"
                  >
                    Continúa con Entrenamiento Intensivo
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="p-6 bg-background">
              <p className="text-white/85 mb-4">
                <strong>Este es tu plan. Adáptalo según sea necesario.</strong> La vida acontece, y el plan puede cambiar. 
                Si necesitas ajustes o tienes preguntas, habla con el coach.
              </p>
              <Button variant="outline" className="border-blue/50 hover:border-blue/40 hover:text-blue/40">
                Hablar con el Coach
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Resources Library Section */}
        <ResourceLibrary />

        {/* Tu Progreso y Logros - Now at the END */}
        <div className="space-y-6 pt-8 border-t border-white/10">
          <h2 className="text-3xl font-bold text-white flex items-center gap-2">
            <Trophy className="w-8 h-8 text-yellow-400" />
            Tu Progreso y Logros
          </h2>

          {/* Progress Card */}
          <Card className="bg-transparent border-muted/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <MapPin className="w-5 h-5 text-purple" />
                Tu Progreso en A2
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-emerald-900/20 border border-green/30 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-emerald-400">Ruta Generada</p>
                  <p className="text-sm text-white/85">Tu plan de 90 días personalizado está listo</p>
                </div>
              </div>
              
              <div className="p-4 bg-muted/80/30 border border-muted/70 rounded-lg">
                <p className="text-white/85 text-sm mb-3">Próximo: Continúa a <span className="font-semibold">Entrenamiento Intensivo</span> para prepararte para entrevistas</p>
                <Button 
                  onClick={() => router.push('/despega/a3-intro')}
                  className="w-full bg-blue/80 hover:bg-blue/70"
                >
                  Ir a Entrenamiento Intensivo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Achievements & Recommendations Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Achievements - Takes 2 columns on large screens */}
            <Card className="bg-transparent border-muted/80 lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  Tus Logros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AchievementsDisplay
                  completedTasks={calculateTotalProgress().completed}
                  totalTasks={calculateTotalProgress().total}
                />
              </CardContent>
            </Card>

            {/* Recommendations - Takes 1 column */}
            <Card className="bg-transparent border-muted/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Zap className="w-5 h-5 text-purple/40" />
                  Recomendaciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RecommendationsDisplay
                  recommendations={getSimpleRecommendations(
                    completedTasks,
                    route?.route_30days || [],
                    route?.route_60days || [],
                    route?.route_90days || []
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Export PDF Button */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              {isExporting ? 'Generando PDF...' : 'Descargar Progreso en PDF'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
