'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Zap, TrendingUp, Target, Award } from 'lucide-react'
import { mockDashboardData } from './data/mock-dashboard'
import { ProgressBar } from '@/components/a3/progress-bar'
import { SkillsGrid } from '@/components/a3/skills-grid'
import { LevelsAccordion } from '@/components/a3/levels-accordion'
import { BadgesGrid } from '@/components/a3/badges-grid'

export default function A3EntrenamientoIntensivo() {
  const [dashboardData] = useState(mockDashboardData)

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto px-4 py-12 space-y-16">
        {/* ========== HEADER SECTION ========== */}
        <div className="space-y-6">
          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Link href="/despega">
              <Button variant="ghost" size="sm" className="hover:bg-muted/20">
                <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                Volver
              </Button>
            </Link>
            <Badge className="bg-training/20 text-training border border-training/30">
              Pilar 3: Entrenamiento Intensivo
            </Badge>
          </div>

          {/* Hero Title */}
          <div className="space-y-3">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-training to-training/60 bg-clip-text text-transparent">
              Domina Entrevistas en 4 Niveles
            </h1>
            <p className="text-lg text-white/70 max-w-3xl">
              Entrena desde tu primera auditoría hasta una simulación real. Cada hito desbloquea nuevas herramientas, evidencia de avance y mayor preparación para entrevistas reales.
            </p>
          </div>
        </div>

        {/* ========== CURRENT STATE CARD ========== */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Level and Milestone */}
          <div className="md:col-span-2 border border-training/30 rounded-lg p-6 bg-gradient-to-br from-training/10 to-training/5">
            <p className="text-xs text-training uppercase font-semibold tracking-wider mb-2">Estado Actual</p>
            <h2 className="text-3xl font-bold text-white mb-1">{dashboardData.currentLevel}</h2>
            <p className="text-white/60 mb-4">Siguiente: {dashboardData.nextMilestone}</p>
            <p className="text-sm text-white/50">{dashboardData.nextReward}</p>
          </div>

          {/* Stats */}
          {[
            { icon: Zap, label: 'XP Ganados', value: `${dashboardData.totalXp}/${dashboardData.maxXp}` },
            { icon: Award, label: 'Completados', value: `${dashboardData.completedModules}/${dashboardData.totalModules}` },
            { icon: TrendingUp, label: 'Progreso', value: `${dashboardData.progressPct}%` }
          ].map((stat, i) => {
            const Icon = stat.icon
            return (
              <div key={i} className="border border-white/10 rounded-lg p-6 bg-white/5 hover:bg-white/10 transition">
                <div className="flex items-start justify-between mb-2">
                  <Icon className="w-5 h-5 text-training" />
                  <p className="text-xs text-white/50">{stat.label}</p>
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            )
          })}
        </div>

        {/* ========== MAIN PROGRESS BAR ========== */}
        <div className="border border-training/20 rounded-lg p-6 bg-gradient-to-r from-training/10 to-training/5">
          <ProgressBar
            percentage={dashboardData.progressPct}
            currentXp={dashboardData.totalXp}
            maxXp={dashboardData.maxXp}
            label="Progreso hacia entrevista real"
            animated={true}
          />
        </div>

        {/* ========== SKILLS SECTION ========== */}
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Habilidades Entrenadas</h2>
            <p className="text-white/60">Cada módulo mejora una habilidad específica. Mira tu progreso en cada área.</p>
          </div>
          <SkillsGrid skills={dashboardData.skills} />
        </div>

        {/* ========== LEVELS & MODULES SECTION ========== */}
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Tu Camino de Entrenamiento</h2>
            <p className="text-white/60">Completa cada nivel para desbloquear herramientas y entrenamientos nuevos.</p>
          </div>
          <LevelsAccordion modules={dashboardData.modules} />
        </div>

        {/* ========== BADGES SECTION ========== */}
        <div className="space-y-6">
          <BadgesGrid badges={dashboardData.badges} />
        </div>

        {/* ========== MOTIVATIONAL MESSAGE ========== */}
        <div className="border border-green-500/30 rounded-lg p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10">
          <div className="flex gap-4">
            <div className="text-3xl">🎯</div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Tu Próximo Paso</h3>
              <p className="text-white/70">
                {dashboardData.progressPct < 25
                  ? 'Comienza con la Auditoría Inicial. Este es el cimiento para toda tu preparación. Revisa tu cámara, luz, audio y presencia.'
                  : dashboardData.progressPct < 50
                  ? 'Continúa con las herramientas de preparación. Domina el Método STAR y prepara tu CV para crear una base sólida.'
                  : dashboardData.progressPct < 75
                  ? 'Ahora es tiempo de entrenar en entrevistas reales. Comienza con la Entrevista Guiada y aumenta la dificultad.'
                  : 'Ya estás listo. Realiza la Simulación Real para verificar que estás preparado para una entrevista verdadera.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
