'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Loader2, CheckCircle2 } from 'lucide-react'
// import { DashboardState, Module } from './data/mock-dashboard'
// Temporarily remove problematic imports to isolate the issue
// import { A3GeneralProgress } from '@/components/a3-general-progress'
// import { LevelsAccordion } from '@/components/a3/levels-accordion'
// import { Pillar3DetailedProgress } from '@/components/pillar3-detailed-progress'
// import { PILLAR3_MODULES, PILLAR3_LEVELS } from '@/lib/pillar3-config'

// Dummy config for testing
const PILLAR3_LEVELS: any = {
  1: { id: 1, name: 'Level 1', moduleIds: [] },
  2: { id: 2, name: 'Level 2', moduleIds: [] },
  3: { id: 3, name: 'Level 3', moduleIds: [] },
  4: { id: 4, name: 'Level 4', moduleIds: [] },
}
const PILLAR3_MODULES: any = {}

// Build modules array from pillar3 config with moduleStates
function buildModulesFromConfig(moduleStates: Record<string, string>): any[] {
  const modules: any[] = []
  
  try {
    // Define all 10 modules with their metadata
    const allModules = [
      { id: 'auditoria-inicial', level: 1, title: 'Auditoría Inicial', description: 'Prepárate entrando a ti mismo y cómo te perceibe tu entrevistador', xp: 70, dtc: 4 },
      { id: 'metodo-star', level: 2, title: 'Método STAR', description: 'Estructura de respuestas que los entrevistadores esperan', xp: 120, dtc: 4 },
      { id: 'cv-inteligente', level: 2, title: 'CV Inteligente', description: 'Optimiza tu CV para ATS y reclutadores', xp: 120, dtc: 4 },
      { id: 'analisis-vacante', level: 2, title: 'Análisis de Vacante', description: 'Decodifica lo que busca la empresa', xp: 120, dtc: 4 },
      { id: 'analisis-multimodal', level: 2, title: 'Análisis Multimodal', description: 'Voz, cuerpo y palabras alineadas', xp: 120, dtc: 4 },
      { id: 'entrenamiento-guiado', level: 3, title: 'Entrenamiento Guiado', description: 'Práctica con feedback personalizado', xp: 120, dtc: 4 },
      { id: 'entrenamiento-estructurado', level: 3, title: 'Entrenamiento Estructurado', description: 'Simulaciones estructuradas reales', xp: 120, dtc: 4 },
      { id: 'entrenamiento-desafiante', level: 3, title: 'Entrenamiento Desafiante', description: 'Desafíos bajo presión máxima', xp: 120, dtc: 4 },
      { id: 'entrenamiento-conversacional', level: 3, title: 'Entrenamiento Conversacional', description: 'Conexión natural con entrevistador', xp: 120, dtc: 4 },
      { id: 'simulacion-real', level: 4, title: 'Simulación Real', description: 'Entrevista completa bajo condiciones reales', xp: 40, dtc: 4 },
    ]
    
    // For each module, determine its status based on moduleStates and sequential unlock
    // Sequential: module N requires module N-1 completion
    for (let i = 0; i < allModules.length; i++) {
      const moduleMeta = allModules[i]
      const status = (moduleStates[moduleMeta.id] || 'locked') as 'available' | 'in_progress' | 'completed' | 'locked'
      
      // Generate prerequisite text based on sequential unlock logic
      let unlockText: string | undefined = undefined
      if (status === 'locked' && i > 0) {
        unlockText = `Desbloquea al completar: ${allModules[i - 1].title}`
      }
      
      modules.push({
        id: moduleMeta.id,
        level: moduleMeta.level,
        title: moduleMeta.title,
        description: moduleMeta.description,
        status,
        xp: status === 'completed' ? moduleMeta.xp : 0,
        maxXp: moduleMeta.xp,
        progress: status === 'completed' ? 100 : status === 'in_progress' ? 50 : 0,
        unlockText,
      })
    }
    
    return modules
  } catch (error) {
    console.error('[v0] Error in buildModulesFromConfig:', error)
    return []
  }
}

export default function A3EntrenamientoIntensivo() {
  console.log('[v0] A3 component rendering...')
  const router = useRouter()
  const searchParams = useSearchParams()
  const refreshParam = searchParams?.get('refresh')
  
  console.log('[v0] Hooks called successfully')
  
  const [dashboardData, setDashboardData] = useState<any>({
    totalXp: 0,
    maxXp: 280,
    modules: [],
    moduleStates: {},
    completedModuleIds: [],
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  console.log('[v0] State initialized')

  // Fetch real user progress on mount and on route change
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setError(null)
        console.log('[v0] A3 page: Fetching user progress...')
        const response = await fetch('/api/a3/user-progress', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include', // CRITICAL: Send session cookies
          cache: 'no-store' // Force fresh fetch from server
        })
        if (response.ok) {
          const { progress } = await response.json()
          console.log('[v0] A3 page: API response received', {
            moduleStates: progress.moduleStates,
            completedModuleIds: progress.completedModuleIds,
            totalXp: progress.totalXp,
          })
          
          // Build modules from config using moduleStates from API
          const modules = buildModulesFromConfig(progress.moduleStates || {})
          
          // Update dashboard data with real progress
          setDashboardData({
            totalXp: progress.totalXp || 0,
            maxXp: progress.maxXp || 280,
            modules,
            moduleStates: progress.moduleStates || {},
            completedModuleIds: progress.completedModuleIds || [],
          })
          
          setIsLoading(false)
        } else {
          console.error('[v0] A3 page: API returned error', response.status)
          throw new Error(`API returned ${response.status}`)
        }
      } catch (error) {
        console.error('[v0] A3 page: API fetch failed', error)
        const errorMsg = error instanceof Error ? error.message : String(error)
        setError(errorMsg)
        
        // Build default modules with Level 1 available, rest locked
        const defaultModuleStates: { [key: string]: 'available' | 'in_progress' | 'completed' | 'locked' } = {
          'auditoria-inicial': 'available',
          'metodo-star': 'locked',
          'cv-inteligente': 'locked',
          'analisis-vacante': 'locked',
          'analisis-multimodal': 'locked',
          'entrenamiento-guiado': 'locked',
          'entrenamiento-estructurado': 'locked',
          'entrenamiento-desafiante': 'locked',
          'entrenamiento-conversacional': 'locked',
          'simulacion-real': 'locked',
        }
        const modules = buildModulesFromConfig(defaultModuleStates)
        
        setDashboardData({
          totalXp: 0,
          maxXp: 280,
          modules,
          moduleStates: defaultModuleStates,
          completedModuleIds: [],
        })
        setIsLoading(false)
      }
    }

    // Initial fetch on mount
    fetchProgress()

    // Refetch when page becomes visible (user returns from subpage)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('[v0] Page visible, refreshing progress...')
        fetchProgress()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [refreshParam])

  // Show error state if something went wrong
  if (error && isLoading === false) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 p-8 bg-red-500/10 border border-red-500/50 rounded-lg max-w-md">
          <h2 className="text-xl font-bold text-red-400">Error al cargar</h2>
          <p className="text-white/70 text-sm">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Reintentar
          </Button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-training animate-spin" />
          <p className="text-white/70">Cargando tu progreso...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Epic animated background grid */}
      <div className="fixed inset-0 -z-10 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-training/20 via-transparent to-training/10"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-training/30 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-training/20 rounded-full mix-blend-screen filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-12 space-y-16 relative z-10">
        {/* ========== EPIC HEADER ========== */}
        <div className="space-y-8">
          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Link href="/despega">
              <Button variant="ghost" size="sm" className="hover:bg-muted/20 transition-all">
                <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                Volver
              </Button>
            </Link>
            <Badge className="bg-training/30 text-training border border-training/50 shadow-lg shadow-training/20 animate-pulse">
              Pilar 3: Entrenamiento Intensivo
            </Badge>
          </div>

          {/* Epic Hero Title */}
          <div className="space-y-4 relative">
            {/* Animated gradient background */}
            <div className="absolute -inset-4 bg-gradient-to-r from-training/20 via-transparent to-training/20 rounded-2xl blur-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <h1 className="text-7xl md:text-8xl font-black bg-gradient-to-r from-training via-training/80 to-training/60 bg-clip-text text-transparent drop-shadow-2xl">
              Domina Entrevistas
            </h1>
            <h2 className="text-4xl md:text-5xl font-bold text-white/90">en 10 Módulos de Aprendizaje</h2>
            
            <p className="text-lg md:text-xl text-white/80 max-w-3xl leading-relaxed font-light">
              Desde tu primera <span className="text-training font-semibold">auditoría</span> hasta una <span className="text-training font-semibold">simulación real</span>. 
              Cada hito desbloquea nuevas herramientas, evidencia de avance y mayor preparación para entrevistas que importan.
            </p>

            {/* Quick CTA */}
            <Link href="/despega/interview-0" className="inline-block">
              <Button className="bg-gradient-to-r from-training to-training/80 hover:shadow-lg hover:shadow-training/50 transition-all transform hover:scale-105 text-white px-8 py-6 text-lg font-bold">
                Comenzar Ahora
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* ========== CLEAR PROGRESS & UNLOCK STATUS ========== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Overall Progress */}
          <div className="md:col-span-2 rounded-lg border border-training/30 bg-white/5 p-6">
            <p className="text-sm text-white/60 uppercase font-bold mb-3">Progreso General</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-white font-semibold">{dashboardData.modules?.filter((m: any) => m.status === 'completed').length || 0} / 10 Módulos Completados</p>
                <span className="text-training font-bold">{Math.round(((dashboardData.modules?.filter((m: any) => m.status === 'completed').length || 0) / 10) * 100)}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-training to-training/60 transition-all duration-500"
                  style={{ width: `${((dashboardData.modules?.filter((m: any) => m.status === 'completed').length || 0) / 10) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* XP Reward Tracker */}
          <div className="rounded-lg border border-training/30 bg-white/5 p-6">
            <p className="text-sm text-white/60 uppercase font-bold mb-3">XP Ganados</p>
            <p className="text-3xl font-bold text-training">{dashboardData.totalXp}</p>
            <p className="text-xs text-white/50 mt-1">de {dashboardData.maxXp} XP totales</p>
          </div>
        </div>

        {/* ========== MODULE OVERVIEW SECTION ========== */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Tu Camino de Aprendizaje</h2>
            <p className="text-white/70">Completa cada módulo para desbloquear el siguiente.</p>
          </div>
          
          {/* Modules list will be rendered here */}
          {dashboardData.modules && dashboardData.modules.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.modules.map((module: any) => {
                // Determine navigation path based on module ID
                const getModulePath = () => {
                  if (module.id === 'auditoria-inicial') {
                    return '/despega/interview-0'
                  } else {
                    // Route to the first lesson (lesson 1) of the training module
                    return `/despega/a3/entrenamiento-guiado/${module.id}/1`
                  }
                }
                
                // Determine if module is clickable (available or in_progress or completed)
                const isClickable = module.status !== 'locked'
                const modulePath = getModulePath()
                
                return (
                  <div 
                    key={module.id}
                    onClick={() => {
                      if (isClickable) {
                        console.log('[v0] Navigating to module:', module.id, 'path:', modulePath)
                        router.push(modulePath)
                      }
                    }}
                    className={`rounded-lg border border-training/30 bg-white/5 p-6 transition-all ${
                      isClickable 
                        ? 'hover:bg-white/10 hover:border-training/50 cursor-pointer hover:shadow-lg hover:shadow-training/10' 
                        : 'opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white">{module.title}</h3>
                        <p className="text-white/70 text-sm mt-1">{module.description}</p>
                        {module.unlockText && (
                          <p className="text-training/80 text-xs mt-2">{module.unlockText}</p>
                        )}
                      </div>
                      <div className="ml-4 flex flex-col items-end gap-2">
                        {module.status === 'completed' ? (
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-success" />
                            <Button
                              onClick={() => {
                                const routeMap: Record<string, string> = {
                                  'auditoria-inicial': '/despega/interview-0',
                                  'metodo-star': '/despega/a3/metodo-star',
                                  'cv-inteligente': '/despega/a3/cv-inteligente',
                                  'analisis-vacante': '/despega/a3/analisis-vacante',
                                  'analisis-multimodal': '/despega/a3/analisis-multimodal',
                                  'entrenamiento-guiado': '/despega/a3/entrenamiento-guiado',
                                  'entrenamiento-estructurado': '/despega/a3/entrenamiento-estructurado',
                                  'entrenamiento-desafiante': '/despega/a3/entrenamiento-desafiante',
                                  'entrenamiento-conversacional': '/despega/a3/entrenamiento-conversacional',
                                  'simulacion-real': '/despega/a3/simulacion-real',
                                }
                                router.push(routeMap[module.id] || '/despega/a3')
                              }}
                              size="sm"
                              className="bg-success/20 text-success hover:bg-success/30 border border-success/50"
                              variant="outline"
                            >
                              Pasar De Nuevo
                            </Button>
                          </div>
                        ) : (
                          <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                            module.status === 'in_progress' ? 'bg-training/20 text-training' :
                            module.status === 'available' ? 'bg-blue/20 text-blue' :
                            'bg-white/10 text-white/50'
                          }`}>
                            {module.status === 'in_progress' ? 'En Progreso' :
                             module.status === 'available' ? 'Disponible' :
                             'Bloqueado'}
                          </span>
                        )}
                        <span className="text-xs text-white/60">{module.progress}% completado</span>
                      </div>
                    </div>
                    {module.maxXp && (
                      <div className="mt-4 flex items-center gap-2">
                        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-training transition-all"
                            style={{ width: `${module.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-white/60">{module.xp}/{module.maxXp} XP</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-white/50">
              <p>Cargando módulos...</p>
            </div>
          )}
        </div>

        {/* ========== SIMPLE NEXT STEP MESSAGE ========== */}
        <div className="rounded-lg border border-training/30 bg-white/5 p-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Tu Próximo Paso</h3>
            {dashboardData.modules && dashboardData.modules.length > 0 ? (
              (() => {
                const completedCount = dashboardData.modules.filter((m: any) => m.status === 'completed').length
                const nextModule = dashboardData.modules.find((m: any) => m.status === 'available' || m.status === 'in_progress')
                
                if (completedCount === 0) {
                  return <p className="text-white/80">Comienza con la <strong>Auditoría Inicial</strong>. Este es el primer paso para prepararte correctamente.</p>
                } else if (completedCount === 10) {
                  return <p className="text-white/80">¡Felicitaciones! Has completado los 10 módulos. Has ganado <strong>{dashboardData.totalXp} XP</strong> en total y desbloqueado premios exclusivos.</p>
                } else if (nextModule) {
                  return <p className="text-white/80">Excelente progreso ({completedCount}/10). Continúa con <strong>{nextModule.name}</strong> para seguir avanzando en tu camino.</p>
                } else {
                  return <p className="text-white/80">Vas muy bien. Sigue completando módulos para mejorar tus habilidades.</p>
                }
              })()
            ) : (
              <p className="text-white/80">Cargando tu progreso...</p>
            )}
          </div>
        </div>
      </div>

      {/* Simplified CSS for essential animations */}
      <style jsx>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideup {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
