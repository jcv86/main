'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Loader2, Lock, CheckCircle2 } from 'lucide-react'
import { DashboardState } from './data/mock-dashboard'
import { A3GeneralProgress } from '@/components/a3-general-progress'
import { LevelsAccordion } from '@/components/a3/levels-accordion'
import { Pillar3DetailedProgress } from '@/components/pillar3-detailed-progress'

export default function A3EntrenamientoIntensivo() {
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

  // Calculate completed sections (Pillar 3 has 4 sections)
  // A section is complete when all its modules are 100% done
  const calculateCompletedSections = (modules: typeof mockDashboardData.modules) => {
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
        console.log('[v0] A3 page: Fetching user progress...')
        const response = await fetch('/api/a3/user-progress')
        if (response.ok) {
          const { progress } = await response.json()
          console.log('[v0] A3 page: API response received', {
            moduleStates: progress.moduleStates,
            completedModuleIds: progress.completedModuleIds,
            totalXp: progress.totalXp,
          })
          
          // Update dashboard data with real progress
          setDashboardData(prev => {
            const updated = { ...prev }
            updated.totalXp = progress.totalXp
            updated.maxXp = progress.maxXp
            
            // Update module statuses based on real completion data
            updated.modules = prev.modules.length > 0 ? prev.modules.map(module => {
              const status = progress.moduleStates[module.id]
              if (status) {
                console.log(`[v0] Module ${module.id} status: ${module.status} -> ${status}`)
                // Calculate progress based on status and milestones
                let newProgress = module.progress
                if (status === 'completed') {
                  newProgress = 100
                } else if (status === 'available') {
                  newProgress = 0
                } else if (status === 'locked') {
                  newProgress = 0
                } else if (status === 'in_progress' && module.milestones) {
                  // For in_progress modules, calculate based on completed milestones
                  const completedMilestones = module.milestones.filter(m => m.completed).length
                  newProgress = Math.round((completedMilestones / module.milestones.length) * 100)
                }
                
                return {
                  ...module,
                  status: status as 'available' | 'in_progress' | 'completed' | 'locked',
                  xp: status === 'completed' ? module.maxXp : module.xp,
                  progress: newProgress,
                }
              }
              return module
            }) : progress.modules || []

            // Update module states and completed IDs for detailed progress component
            updated.moduleStates = progress.moduleStates
            updated.completedModuleIds = progress.completedModuleIds

            // Calculate completed sections for the general progress bar
            const sections = calculateCompletedSections(updated.modules)
            setCompletedSections(sections)

            return updated
          })
        } else {
          console.error('[v0] A3 page: API returned error', response.status)
          throw new Error(`API returned ${response.status}`)
        }
      } catch (error) {
        console.error('[v0] A3 page: API fetch failed', error)
        // Show error state - user needs real data
        setDashboardData({
          totalXp: 0,
          maxXp: 280,
          modules: [],
          moduleStates: {},
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
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [refreshParam])

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
              <Rocket className="w-3 h-3 mr-2" />
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
            <Link href="/despega/a3/entrenamiento-guiado" className="inline-block">
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
          <A3GeneralProgress 
            currentStep={1}
            totalSteps={4}
            currentLabel="Pillar 3 - Entrenamiento Intensivo"
            completedSections={completedSections}
            totalSections={4}
            variant="default"
          />
          
          <LevelsAccordion modules={dashboardData.modules} />
        </div>

        {/* ========== DETAILED PILLAR 3 PROGRESS ========== */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Estado de Cada Módulo</h2>
            <p className="text-white/70">Visualiza tu progreso por módulo y desbloquea el siguiente al completar.</p>
          </div>
          
          <Pillar3DetailedProgress
            moduleStates={dashboardData.moduleStates || {}}
            completedModuleIds={dashboardData.completedModuleIds || []}
            totalXp={dashboardData.totalXp}
            totalDtc={dashboardData.totalDtc}
          />
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
