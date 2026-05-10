'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Zap, TrendingUp, Award, Rocket, Loader2 } from 'lucide-react'
import { mockDashboardData, DashboardState } from './data/mock-dashboard'
import { A3GeneralProgress } from '@/components/a3-general-progress'
import { ProgressBar } from '@/components/a3/progress-bar'
import { SkillsGrid } from '@/components/a3/skills-grid'
import { LevelsAccordion } from '@/components/a3/levels-accordion'
import { BadgesGrid } from '@/components/a3/badges-grid'

export default function A3EntrenamientoIntensivo() {
  const [dashboardData, setDashboardData] = useState<DashboardState>(mockDashboardData)
  const [hoveredStat, setHoveredStat] = useState<number | null>(null)
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

  // Fetch real user progress on mount
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await fetch('/api/a3/user-progress')
        if (response.ok) {
          const { progress } = await response.json()
          
          // Update dashboard data with real progress
          setDashboardData(prev => {
            const updated = { ...prev }
            updated.currentLevel = progress.currentLevel
            updated.progressPct = progress.progressPct
            updated.totalXp = progress.totalXp
            updated.maxXp = progress.maxXp
            updated.nextMilestone = progress.nextMilestone
            updated.nextReward = progress.nextReward
            updated.completedModules = progress.completedModules
            
            // Update module statuses based on real completion data
            updated.modules = prev.modules.map(module => {
              const status = progress.moduleStates[module.id]
              if (status) {
                return {
                  ...module,
                  status: status as 'available' | 'in_progress' | 'completed' | 'locked',
                  xp: status === 'completed' ? module.maxXp : module.xp,
                  progress: status === 'completed' ? 100 : status === 'in_progress' ? 60 : 0,
                }
              }
              return module
            })

            // Calculate completed sections for the general progress bar
            const sections = calculateCompletedSections(updated.modules)
            setCompletedSections(sections)

            // Update skills with real values
            updated.skills = prev.skills.map(skill => ({
              ...skill,
              value: progress.skills[skill.id] || skill.value
            }))

            return updated
          })
        }
      } catch {
        // Use mock data if API fails
      } finally {
        setIsLoading(false)
      }
    }

    fetchProgress()
  }, [])

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

        {/* ========== EPIC STATE CARDS ========== */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Main Level Card */}
          <div className="md:col-span-2 group relative overflow-hidden rounded-xl border border-training/40 bg-gradient-to-br from-training/20 to-training/5 p-8 hover:border-training/60 transition-all duration-300 shadow-lg shadow-training/10 hover:shadow-training/30">
            <div className="absolute inset-0 bg-gradient-to-r from-training/0 via-training/10 to-training/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative z-10">
              <p className="text-xs text-training uppercase font-bold tracking-widest mb-4">Estado Actual</p>
              <h2 className="text-4xl font-black text-transparent bg-gradient-to-r from-white to-white/70 bg-clip-text mb-3">
                {dashboardData.currentLevel}
              </h2>
              <div className="space-y-2">
                <p className="text-training font-bold">Próximo: {dashboardData.nextMilestone}</p>
                <p className="text-sm text-white/60">{dashboardData.nextReward}</p>
              </div>
            </div>
          </div>

          {/* Epic Stats */}
          {[
            { icon: Zap, label: 'XP Ganados', value: `${dashboardData.totalXp}`, max: `/${dashboardData.maxXp}`, color: 'from-yellow-500/50 to-training/50' },
            { icon: Award, label: 'Completados', value: `${dashboardData.completedModules}`, max: `/${dashboardData.totalModules}`, color: 'from-green-500/50 to-training/50' },
            { icon: TrendingUp, label: 'Progreso', value: `${dashboardData.progressPct}`, max: '%', color: 'from-blue-500/50 to-training/50' }
          ].map((stat, i) => {
            const Icon = stat.icon
            return (
              <div
                key={i}
                className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 hover:border-training/50 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-training/30"
                onMouseEnter={() => setHoveredStat(i)}
                onMouseLeave={() => setHoveredStat(null)}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                <div className="relative z-10">
                  <Icon className={`w-6 h-6 mb-3 transition-all duration-300 ${hoveredStat === i ? 'text-training scale-125 animate-bounce' : 'text-white/60'}`} />
                  <p className="text-xs text-white/60 uppercase font-bold tracking-wide mb-2">{stat.label}</p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-4xl font-black text-white">{stat.value}</p>
                    <p className="text-sm text-white/60 font-bold">{stat.max}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* ========== EPIC PROGRESS BAR ========== */}
        <div className="group relative overflow-hidden rounded-xl border border-training/30 bg-gradient-to-r from-training/15 to-training/5 p-8 hover:border-training/50 transition-all duration-300 shadow-2xl shadow-training/20">
          <div className="absolute inset-0 bg-gradient-to-r from-training/20 via-transparent to-training/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <ProgressBar
              percentage={dashboardData.progressPct}
              currentXp={dashboardData.totalXp}
              maxXp={dashboardData.maxXp}
              label="Progreso hacia Entrevista Real"
              animated={true}
            />
          </div>
        </div>

        {/* ========== SKILLS SECTION - EPIC ========== */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-white">Habilidades en Combate</h2>
            <p className="text-white/70">Cada módulo fortalece una habilidad. Mira tu arsenal crecer.</p>
          </div>
          <SkillsGrid skills={dashboardData.skills} />
        </div>

        {/* ========== EPIC LEVELS SECTION ========== */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-white">Tu Jornada Épica</h2>
            <p className="text-white/70">Completa cada nivel para desbloquear superpoderes y entrenamientos legendarios.</p>
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

        {/* ========== BADGES SECTION - EPIC ========== */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-white">Insignias & Logros</h2>
            <p className="text-white/70">Desbloquea badges exclusivas mientras avanzas. ¡Colecciónalas todas!</p>
          </div>
          <BadgesGrid badges={dashboardData.badges} />
        </div>

        {/* ========== EPIC MOTIVATIONAL MESSAGE ========== */}
        <div className="group relative overflow-hidden rounded-2xl border-2 border-training/60 bg-gradient-to-r from-training/20 via-training/10 to-training/5 p-8 md:p-12 shadow-2xl shadow-training/30 hover:shadow-training/50 transition-all duration-300">
          <div className="absolute -inset-1 bg-gradient-to-r from-training/40 via-training/20 to-training/40 opacity-20 group-hover:opacity-40 blur transition-opacity duration-300 -z-10"></div>
          
          <div className="relative z-10 space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h3 className="text-3xl md:text-4xl font-black text-transparent bg-gradient-to-r from-white to-training bg-clip-text mb-3">
                  {dashboardData.progressPct < 25
                    ? 'Inicia tu Viaje'
                    : dashboardData.progressPct < 50
                    ? 'Acelera tu Entrenamiento'
                    : dashboardData.progressPct < 75
                    ? 'Domina las Entrevistas'
                    : 'Eres Prácticamente Invencible'}
                </h3>
                <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                  {dashboardData.progressPct < 25
                    ? 'Comienza con la Auditoría Inicial. Este es el cimiento de todo. Revisa tu cámara, luz, audio, presencia y pitch. ¡Tu futuro se construye hoy!'
                    : dashboardData.progressPct < 50
                    ? 'Domina el Método STAR y prepara tu CV. Estás construyendo una base sólida que te hará destacar en cualquier entrevista.'
                    : dashboardData.progressPct < 75
                    ? 'Es hora de entrenar en entrevistas reales. Comienza con la Guiada y aumenta la dificultad. ¡Cada entrevista es una victoria!'
                    : '¡Ya estás listo! Realiza la Simulación Real para verificar que estás en top form. ¡Nada puede detenerte ahora!'}
                </p>
              </div>
            </div>
            
            <Link href="/despega/a3/entrenamiento-guiado" className="inline-block">
              <Button className="bg-gradient-to-r from-training to-training/80 hover:shadow-lg hover:shadow-training/60 transition-all transform hover:scale-110 text-white px-8 py-6 text-lg font-bold mt-4">
                {dashboardData.progressPct < 25 ? 'Comenzar Ahora' : 'Continuar Entrenando'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* ========== EPIC FOOTER MESSAGE ========== */}
        <div className="border-t border-white/10 pt-12 text-center space-y-4">
          <p className="text-2xl font-black text-transparent bg-gradient-to-r from-training via-white to-training bg-clip-text">
            La excelencia no es un destino, es un viaje.
          </p>
          <p className="text-white/60 text-lg">
            Cada entrenamiento te acerca más a dominar entrevistas.
          </p>
        </div>
      </div>

      {/* Animated decorative elements */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(170, 70, 170, 0.3); }
          50% { box-shadow: 0 0 40px rgba(170, 70, 170, 0.6); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
