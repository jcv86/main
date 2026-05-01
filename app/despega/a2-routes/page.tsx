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
import { Loader2, Calendar, Target, CheckCircle2, AlertCircle, ArrowRight, Zap, MapPin, Download, Trophy, RotateCcw, Lock } from 'lucide-react'
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
  getTaskId,
  resetAllCompletions
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
  const [isResetting, setIsResetting] = useState(false)
  const [showRuta, setShowRuta] = useState(true)
  const [showComoFunciona, setShowComoFunciona] = useState(true)
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

  // Reset all completions
  const handleResetProgress = async () => {
    if (!confirm('¿Resetear todo tu progreso a cero? Esta acción no se puede deshacer.')) return
    setIsResetting(true)
    try {
      await resetAllCompletions()
      setCompletedTasks(new Set())
      setExpandedMilestone(30)
    } catch (err) {
      console.error('[v0] Error resetting progress:', err)
    } finally {
      setIsResetting(false)
    }
  }

  // Check if a month phase is locked (previous month must be 100% complete)
  const isMonthLocked = (days: 30 | 60 | 90): boolean => {
    if (days === 30) return false
    const prevDays = days === 60 ? 30 : 60
    const prev = getPhaseProgressLocal(prevDays)
    return prev.total > 0 && prev.completed < prev.total
  }

  // Calculate phase progress (local helper used inside isMonthLocked)
  const getPhaseProgressLocal = (days: 30 | 60 | 90) => {
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
          <Loader2 className="h-8 w-8 animate-spin text-white" />
          <p className="text-white/85">Generando tu ruta personalizada...</p>
        </div>
      </div>
    )
  }

  if (error || !route) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-transparent border-red/50 p-8">
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
            Tu Ruta: De Aquí a Imprescindible
          </h1>
          <p className="text-xl text-white/85">Tu plan personalizado de 90 días mapeado a conversaciones reales</p>
        </div>

        {/* Success Banner - First element */}
        <Card className="bg-purple/20 border-0 rounded-2xl shadow-lg">
          <CardContent className="pt-8 pb-8 px-8">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-[28px] bg-purple/30 flex-shrink-0">
                <CheckCircle2 className="w-8 h-8 text-purple" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-purple text-lg mb-1">Ruta Generada!</h4>
                <p className="text-sm text-white/85 mb-3">Tu plan de 90 días personalizado está listo y se adapta a tu ritmo</p>
                <div className="flex items-center gap-2 text-xs text-white/70">
                  <Calendar className="w-4 h-4" />
                  <span>Próximo hito: Completa la Fase 1 en los próximos 30 días</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Intro Section - Collapsible */}
        <div className="border border-blue/30 rounded-xl overflow-hidden">
          <button
            onClick={() => setShowRuta(!showRuta)}
            className="w-full flex items-center justify-between px-5 py-4 bg-blue/5 hover:bg-blue/10 transition-colors text-left group"
          >
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-blue" />
              <span className="font-semibold text-white text-lg">Tu Ruta 7/30/90</span>
              {!showRuta && (
                <span className="text-xs text-white/40 font-normal">Haz clic para ver las 3 fases</span>
              )}
            </div>
            <ArrowRight className={`w-4 h-4 text-blue/60 transition-transform duration-200 ${showRuta ? 'rotate-90' : ''}`} />
          </button>

          {showRuta && (
            <div className="p-5 space-y-4 border-t border-blue/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 7 Days */}
                <div className="border-l-4 border-blue bg-blue/5 rounded-r-xl p-4">
                  <p className="text-xs font-bold text-blue uppercase tracking-widest mb-1">SEMANA 1</p>
                  <h3 className="text-xl font-black text-white mb-2">7 Días</h3>
                  <p className="text-white/75 text-sm leading-relaxed mb-3">Prepárate para tu primera conversación de LinkedIn. Optimiza perfil, prepara pitch elevator de 30 segundos.</p>
                  <p className="text-xs text-blue font-semibold">Conversacion: LinkedIn</p>
                </div>

                {/* 30 Days */}
                <div className="border-l-4 border-blue bg-blue/5 rounded-r-xl p-4">
                  <p className="text-xs font-bold text-blue uppercase tracking-widest mb-1">MES 1</p>
                  <h3 className="text-xl font-black text-white mb-2">30 Días</h3>
                  <p className="text-white/75 text-sm leading-relaxed mb-3">Domina entrevista técnica o conductual. Practica respuestas STAR, manejo de objeciones, cierre de oportunidades.</p>
                  <p className="text-xs text-blue font-semibold">Conversacion: Entrevista</p>
                </div>

                {/* 90 Days */}
                <div className="border-l-4 border-blue bg-blue/5 rounded-r-xl p-4">
                  <p className="text-xs font-bold text-blue uppercase tracking-widest mb-1">TRIMESTRE</p>
                  <h3 className="text-xl font-black text-white mb-2">90 Días</h3>
                  <p className="text-white/75 text-sm leading-relaxed mb-3">Negocia tu propuesta. Habla de sueldo, beneficios, rol, vision de carrera con seguridad y profesionalismo.</p>
                  <p className="text-xs text-blue font-semibold">Conversacion: Career</p>
                </div>
              </div>
              <p className="text-white/60 text-sm text-center pt-2 border-t border-blue/10">
                Cada fase te transforma en una pieza imprescindible para tus potenciales empleadores. No es solo conseguir un trabajo, es posicionar tu carrera para los proximos 10 anos.
              </p>
            </div>
          )}
        </div>

        {/* What is this phase - Collapsible */}
        <div className="border border-blue/30 rounded-xl overflow-hidden">
          <button
            onClick={() => setShowComoFunciona(!showComoFunciona)}
            className="w-full flex items-center justify-between px-5 py-4 bg-blue/5 hover:bg-blue/10 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-blue" />
              <span className="font-semibold text-white text-lg">Como Funciona Tu Ruta</span>
              {!showComoFunciona && (
                <span className="text-xs text-white/40 font-normal">Haz clic para ver los detalles</span>
              )}
            </div>
            <ArrowRight className={`w-4 h-4 text-blue/60 transition-transform duration-200 ${showComoFunciona ? 'rotate-90' : ''}`} />
          </button>

          {showComoFunciona && (
            <div className="p-5 border-t border-blue/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-l-4 border-blue bg-blue/5 rounded-r-xl p-4">
                  <h3 className="font-bold text-white mb-1">Acciones Concretas</h3>
                  <p className="text-white/70 text-sm">Cada tarea esta mapeada a una conversacion real: LinkedIn networking, entrevistas o negociacion de cargo.</p>
                </div>
                <div className="border-l-4 border-blue bg-blue/5 rounded-r-xl p-4">
                  <h3 className="font-bold text-white mb-1">Progresion Estructurada</h3>
                  <p className="text-white/70 text-sm">3 fases claramente definidas: Fundamentos, Aceleracion, Dominio. Cada una te acerca a ser imprescindible.</p>
                </div>
                <div className="border-l-4 border-blue bg-blue/5 rounded-r-xl p-4">
                  <h3 className="font-bold text-white mb-1">Personalizacion</h3>
                  <p className="text-white/70 text-sm">Tu ruta es unica segun tu perfil cerebral, objetivos y nivel actual. No hay dos rutas iguales.</p>
                </div>
                <div className="border-l-4 border-blue bg-blue/5 rounded-r-xl p-4">
                  <h3 className="font-bold text-white mb-1">Trackeo Real</h3>
                  <p className="text-white/70 text-sm">Marca tareas como completadas y ve tu progreso en tiempo real. Gana badges y hitos conforme avanzas.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tu Progreso y Logros - Section at the START */}
        <div className="space-y-6 pt-8 border-t border-white/10">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-3xl font-bold text-white flex items-center gap-2">
              <Trophy className="w-8 h-8 text-blue" />
              Tu Progreso en la Ruta de 90 Días
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetProgress}
              disabled={isResetting || completedTasks.size === 0}
              className="border-red/40 text-red/80 hover:bg-red/10 hover:text-red hover:border-red/60 gap-2"
            >
              <RotateCcw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
              {isResetting ? 'Reseteando...' : 'Resetear progreso'}
            </Button>
          </div>

          {/* 3-Phase Progress Tracker */}
          <div className="bg-purple/5 border border-purple/20 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-6">Cómo va tu Progreso</h3>
            <div className="space-y-4">
              {([30, 60, 90] as const).map((days, idx) => {
                const phaseData = getMilestoneData(days)
                const progress = getPhaseProgress(days)
                const progressPercent = progress.total > 0 ? (progress.completed / progress.total) * 100 : 0
                
                return (
                  <div key={days} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple/20 border border-purple/40 flex-shrink-0">
                    <span className="text-sm font-bold text-purple">{idx + 1}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-white">{phaseData.label}</p>
                          <p className="text-xs text-white/60">{phaseData.milestone}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-white">{Math.round(progressPercent)}%</p>
                        <p className="text-xs text-white/60">{progress.completed}/{progress.total} tareas</p>
                      </div>
                    </div>
                    <div className="w-full bg-muted/60 rounded-full h-2.5">
                      <div
                        className="bg-gradient-to-r from-purple to-blue h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Overall Progress Summary */}
            <div className="mt-6 pt-6 border-t border-purple/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/80 mb-1">Progreso Total</p>
                  <p className="text-2xl font-bold text-white">{Math.round((calculateTotalProgress().completed / calculateTotalProgress().total) * 100)}%</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white/80 mb-1">{calculateTotalProgress().completed} de {calculateTotalProgress().total}</p>
                  <p className="text-xs text-purple">Tareas completadas</p>
                </div>
              </div>
            </div>
          </div>



          {/* Achievements & Recommendations Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="bg-transparent border-muted/80 lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Trophy className="w-5 h-5 text-blue" />
                  Tus Logros Desbloqueados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AchievementsDisplay
                  completedTasks={calculateTotalProgress().completed}
                  totalTasks={calculateTotalProgress().total}
                />
              </CardContent>
            </Card>

            <Card className="bg-transparent border-muted/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Zap className="w-5 h-5 text-blue" />
                  Qué Sigue
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

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-muted/30 border-muted/50 p-4">
              <div className="text-center">
                  <p className="text-2xl font-bold text-blue mb-1">{calculateTotalProgress().completed}</p>
                <p className="text-xs text-white/70">Tareas Completadas</p>
              </div>
            </Card>
            <Card className="bg-muted/30 border-muted/50 p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue mb-1">{calculateTotalProgress().total - calculateTotalProgress().completed}</p>
                <p className="text-xs text-white/70">Tareas Restantes</p>
              </div>
            </Card>
            <Card className="bg-muted/30 border-muted/50 p-4">
              <div className="text-center">
                  <p className="text-2xl font-bold text-blue mb-1">3</p>
                <p className="text-xs text-white/70">Fases Disponibles</p>
              </div>
            </Card>
            <Card className="bg-muted/30 border-muted/50 p-4">
              <div className="text-center">
                  <p className="text-2xl font-bold text-blue mb-1">90</p>
                <p className="text-xs text-white/70">Días de Plan</p>
              </div>
            </Card>
          </div>
        </div>

        {/* Main Route Breakdown - Tus 90 Días Estructurados */}
        <Card className="bg-transparent border-muted/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white text-2xl">
              <MapPin className="w-7 h-7 text-blue" />
              Tus 90 Días Estructurados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {([30, 60, 90] as const).map((days) => {
              const milestoneData = getMilestoneData(days)
              const tasks = ([...(route[`route_${days}days` as keyof typeof route] as any[] || [])]).sort((a: any, b: any) => a.day - b.day)
              const phaseProgress = getPhaseProgress(days)
              const isExpanded = expandedMilestone === days
              const monthLocked = isMonthLocked(days)
              const phaseNum = days === 30 ? '1' : days === 60 ? '2' : '3'
              const prevMonthLabel = days === 60 ? 'Mes 1' : days === 90 ? 'Mes 2' : null

              return (
                <div key={days} className={`border rounded-lg overflow-hidden transition-opacity ${monthLocked ? 'border-muted/20 opacity-60' : 'border-muted/50'}`}>
                  <button
                    onClick={() => !monthLocked && setExpandedMilestone(isExpanded ? null : days)}
                    className={`w-full flex items-center justify-between p-4 transition-colors text-left ${monthLocked ? 'bg-muted/10 cursor-not-allowed' : 'bg-muted/20 hover:bg-muted/30 cursor-pointer'}`}
                    disabled={monthLocked}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${monthLocked ? 'bg-muted/20 border border-muted/30 text-muted/50' : 'bg-blue/20 border border-blue/40 text-blue'}`}>
                        {monthLocked ? <Lock className="w-4 h-4" /> : phaseNum}
                      </div>
                      <div>
                        <p className={`font-semibold ${monthLocked ? 'text-white/40' : 'text-white'}`}>{milestoneData.label}</p>
                        {monthLocked
                          ? <p className="text-xs text-white/30">Completa {prevMonthLabel} al 100% para desbloquear</p>
                          : <p className="text-xs text-white/60">{milestoneData.milestone} · {tasks.length} tareas</p>
                        }
                      </div>
                    </div>
                    {!monthLocked && (
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-white">
                          {phaseProgress.completed}/{phaseProgress.total}
                        </span>
                        <ArrowRight className={`w-4 h-4 text-white/60 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </div>
                    )}
                  </button>
                  {isExpanded && !monthLocked && (
                    <div className="p-4 space-y-3">
                      {tasks.map((task: any, taskIdx: number) => {
                        const taskId = getTaskId(days, task.day, task.title)
                        const prevTask = taskIdx > 0 ? tasks[taskIdx - 1] : null
                        const prevTaskId = prevTask ? getTaskId(days, prevTask.day, prevTask.title) : null
                        const isDayLocked = taskIdx > 0 && prevTaskId !== null && !completedTasks.has(prevTaskId)
                        return (
                          <TaskCard
                            key={taskIdx}
                            task={task}
                            taskId={taskId}
                            completed={completedTasks.has(taskId)}
                            onComplete={() => handleTaskComplete(taskId)}
                            locked={isDayLocked}
                          />
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Resources Library Section */}
        <div className="pt-8 border-t border-white/10">
          <ResourceLibrary />
        </div>

        {/* Tu Siguiente Paso - At the VERY END */}
        <div className="pt-8 border-t border-white/10">
          <Card className="bg-blue/10 border-2 border-blue/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white text-2xl">
                <CheckCircle2 className="w-6 h-6 text-white" />
                Tu Siguiente Paso
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <p className="text-white/90 text-lg">
                  <strong>1. Completa tu ruta de 90 días:</strong>
                </p>
                <p className="text-white/80">
                  Trabaja en las 3 fases de tu plan personalizado (Fundamentos → Aceleración → Dominio). Marca cada tarea completada para rastrear tu progreso.
                </p>
              </div>
              <div className="space-y-3">
                <p className="text-white/90 text-lg">
                  <strong>2. Entonces accede a Entrenamiento Intensivo:</strong>
                </p>
                <p className="text-white/80 mb-4">
                  Una vez completes tu ruta, estarás listo para practicar con entrenamientos avanzados y prepararte para entrevistas reales.
                </p>
                <Button
                  onClick={() => router.push('/despega/a3')}
                  className="w-full bg-blue hover:bg-blue/80 text-white py-6 text-base font-semibold"
                >
                  Comenzar Entrenamiento Intensivo
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
              <div className="p-4 bg-background/80 border border-white/10 rounded-lg">
                <p className="text-white/80 text-sm">
                  El plan es flexible. Si necesitas cambios o tienes preguntas, habla con el coach en cualquier momento.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
