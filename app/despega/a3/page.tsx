'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Loader2, Lock, CheckCircle2 } from 'lucide-react'
import { DashboardState, Module } from './data/mock-dashboard'
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
function buildModulesFromConfig(moduleStates: Record<string, string>): Module[] {
  const modules: Module[] = []
  
  try {
    for (const levelId of [1, 2, 3, 4] as const) {
      const level = PILLAR3_LEVELS[levelId]
      if (!level) {
        console.warn(`[v0] Level ${levelId} not found in PILLAR3_LEVELS`)
        continue
      }
      
      for (const moduleId of level.moduleIds) {
        const config = PILLAR3_MODULES[moduleId]
        if (!config) {
          console.warn(`[v0] Module ${moduleId} not found in PILLAR3_MODULES`)
          continue
        }
        
        const status = (moduleStates[moduleId] || 'locked') as 'available' | 'in_progress' | 'completed' | 'locked'
        
        // Get the name of the previous level for unlock text
        let unlockText: string | undefined
        if (levelId > 1) {
          const prevLevelId = (levelId - 1) as 1 | 2 | 3
          const prevLevel = PILLAR3_LEVELS[prevLevelId]
          if (prevLevel) {
            unlockText = `Se desbloquea tras completar: ${prevLevel.name}`
          }
        }
        
        modules.push({
          id: config.id,
          level: config.level,
          title: config.name,
          description: config.description,
          status,
          xp: status === 'completed' ? config.xp : 0,
          maxXp: config.xp,
          progress: status === 'completed' ? 100 : status === 'in_progress' ? 50 : 0,
          unlockText,
        })
      }
    }
  } catch (error) {
    console.error('[v0] Error in buildModulesFromConfig:', error)
  }
  
  return modules
}

export default function A3EntrenamientoIntensivo() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const refreshParam = searchParams?.get('refresh')
  
  const [dashboardData, setDashboardData] = useState<DashboardState>({
    totalXp: 0,
    maxXp: 280,
    modules: [],
    moduleStates: {},
    completedModuleIds: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [completedSections, setCompletedSections] = useState(0)
  const [error, setError] = useState<string | null>(null)

  // Calculate completed sections (Pillar 3 has 4 sections)
  // A section is complete when all its modules are 100% done
  const calculateCompletedSections = (modules: Module[]) => {
    // Group modules by section (level)
    const sections = [1, 2, 3, 4] // 4 sections in Pillar 3
    let completed = 0

    sections.forEach(sectionNum => {
      const sectionModules = modules.filter(m => m.level === sectionNum)
      const allComplete = sectionModules.length > 0 && sectionModules.every(m => m.status === 'completed')
      if (allComplete) completed++
    })

    return completed
  }

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
          
          // Calculate completed sections
          const sections = calculateCompletedSections(modules)
          setCompletedSections(sections)
          
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
            <h2 className="text-4xl md:text-5xl font-bold text-white/90">en 4 Niveles Épicos</h2>
            
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
                <p className="text-white font-semibold">{completedSections} / 4 Niveles Completados</p>
                <span className="text-training font-bold">{Math.round((completedSections / 4) * 100)}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-training to-training/60 transition-all duration-500"
                  style={{ width: `${(completedSections / 4) * 100}%` }}
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

        {/* ========== EPIC LEVELS SECTION ========== */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Tu Camino de Aprendizaje</h2>
            <p className="text-white/70">Completa cada nivel para desbloquear el siguiente.</p>
          </div>
          
          {/* General Progress Bar - Shows Pillar 3 completion based on sections */}
          {/* <A3GeneralProgress 
            currentStep={1}
            totalSteps={4}
            currentLabel="Pillar 3 - Entrenamiento Intensivo"
            completedSections={completedSections}
            totalSections={4}
            variant="default"
          />
          
          <LevelsAccordion modules={dashboardData.modules} /> */}
          
          <p className="text-white/50 text-sm">Components loading...</p>
        </div>

        {/* ========== DETAILED PILLAR 3 PROGRESS ========== */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Estado de Cada Módulo</h2>
            <p className="text-white/70">Visualiza tu progreso por módulo y desbloquea el siguiente al completar.</p>
          </div>
          
          {/* <Pillar3DetailedProgress
            moduleStates={dashboardData.moduleStates || {}}
            completedModuleIds={dashboardData.completedModuleIds || []}
            totalXp={dashboardData.totalXp}
          /> */}
        </div>

        {/* ========== SIMPLE NEXT STEP MESSAGE ========== */}
        <div className="rounded-lg border border-training/30 bg-white/5 p-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Tu Próximo Paso</h3>
            {completedSections === 0 && (
              <p className="text-white/80">Comienza con la <strong>Auditoría Inicial</strong>. Este es el primer paso para prepararte correctamente.</p>
            )}
            {completedSections === 1 && (
              <p className="text-white/80">Felicidades. Ahora puedes acceder a las <strong>Herramientas de Preparación</strong> para mejorar tu CV y respuestas.</p>
            )}
            {completedSections === 2 && (
              <p className="text-white/80">Excelente progreso. Continúa con los <strong>Entrenamientos Progresivos</strong> para ganar experiencia.</p>
            )}
            {completedSections === 3 && (
              <p className="text-white/80">Casi listo. Completa la <strong>Simulación Real</strong> para verificar que estás preparado.</p>
            )}
            {completedSections >= 4 && (
              <p className="text-white/80">¡Completaste todos los niveles! Has ganado <strong>{dashboardData.totalXp} XP</strong> en total.</p>
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
