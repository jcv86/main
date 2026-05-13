'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Navigation, Zap, Target, BookOpen, Users } from 'lucide-react'

interface TrainingCommandCenterProps {
  currentDay: number
  todaysTask?: React.ReactNode
  routeProgress?: React.ReactNode
  activeModule?: React.ReactNode
  modulesList?: React.ReactNode
  milestones?: React.ReactNode
}

export function TrainingCommandCenter({
  currentDay,
  todaysTask,
  routeProgress,
  activeModule,
  modulesList,
  milestones,
}: TrainingCommandCenterProps) {
  return (
    <div className="space-y-8 py-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Zap className="w-6 h-6" style={{ color: 'rgb(170,70,170)' }} />
          <h1 className="text-3xl font-bold text-white">Centro de Comando de Entrenamiento</h1>
        </div>
        <p className="text-white/60">
          Tu espacio unificado para aprender (A3), ejecutar acciones reales (A2) y avanzar en tu carrera
        </p>
      </div>

      {/* Day indicator */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[rgb(170,70,170)]/10 to-[rgb(80,160,170)]/10 border border-[rgb(170,70,170)]/30 rounded-lg">
        <div className="text-2xl font-bold text-[rgb(170,70,170)]">Día {currentDay}/90</div>
        <div className="flex-1 h-2 bg-black/40 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[rgb(170,70,170)] to-[rgb(80,160,170)]"
            style={{ width: `${(currentDay / 90) * 100}%` }}
          />
        </div>
      </div>

      {/* A2 Section: Today's Task */}
      {todaysTask && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[rgb(80,160,170)]" />
            <h2 className="text-2xl font-bold text-white">Tu Tarea de Hoy (A2: Acciones Reales)</h2>
            <Badge className="bg-[rgb(80,160,170)]/20 text-[rgb(80,160,170)]">Roadmap Engine</Badge>
          </div>
          <p className="text-white/60 text-sm">Lo que necesitas hacer hoy para avanzar en tu carrera</p>
          {todaysTask}
        </section>
      )}

      {/* A2 Section: Route Progress */}
      {routeProgress && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-[rgb(170,70,170)]" />
            <h2 className="text-2xl font-bold text-white">Progreso de Ruta (A2 vs A3)</h2>
            <Badge className="bg-[rgb(170,70,170)]/20 text-[rgb(170,70,170)]">Métricas Reales</Badge>
          </div>
          <p className="text-white/60 text-sm">Tu progreso en el roadmap y en los módulos de aprendizaje</p>
          {routeProgress}
        </section>
      )}

      {/* A3 Section: Active Module */}
      {activeModule && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[rgb(80,160,170)]" />
            <h2 className="text-2xl font-bold text-white">Tu Módulo Activo (A3: Aprendizaje)</h2>
            <Badge className="bg-[rgb(80,160,170)]/20 text-[rgb(80,160,170)]">Sistema de Aprendizaje</Badge>
          </div>
          <p className="text-white/60 text-sm">El módulo recomendado para hoy basado en tu roadmap</p>
          {activeModule}
        </section>
      )}

      {/* A3 Section: Full Module List */}
      {modulesList && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-[rgb(170,70,170)]" />
            <h2 className="text-2xl font-bold text-white">Mapa de 10 Módulos (A3)</h2>
            <Badge className="bg-[rgb(170,70,170)]/20 text-[rgb(170,70,170)]">1,340 XP Total</Badge>
          </div>
          <p className="text-white/60 text-sm">Tu ruta completa de aprendizaje estructurado</p>
          {modulesList}
        </section>
      )}

      {/* A2 Section: Milestones */}
      {milestones && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-[rgb(80,160,170)]" />
            <h2 className="text-2xl font-bold text-white">Hitos (A2: Checkpoints)</h2>
            <Badge className="bg-[rgb(80,160,170)]/20 text-[rgb(80,160,170)]">Progreso 90 días</Badge>
          </div>
          <p className="text-white/60 text-sm">Tus objetivos a los 30, 60 y 90 días</p>
          {milestones}
        </section>
      )}

      {/* Info Box */}
      <Card className="bg-gradient-to-br from-[rgb(170,70,170)]/5 to-[rgb(80,160,170)]/5 border-[rgb(170,70,170)]/30">
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-[rgb(80,160,170)]" />
                <h3 className="font-semibold text-[rgb(80,160,170)]">A2: Roadmap Engine</h3>
              </div>
              <p className="text-white/70 text-sm">
                Tu planificador de acciones personalizadas. Define qué hacer cada día para avanzar en tu carrera. Incluye tareas reales como buscar empleos, conectar con profesionales, praticar entrevistas.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-[rgb(170,70,170)]" />
                <h3 className="font-semibold text-[rgb(170,70,170)]">A3: Sistema de Aprendizaje</h3>
              </div>
              <p className="text-white/70 text-sm">
                Tu programa de 10 módulos con 1,340 XP. Aprende, practica y prueba tu conocimiento en entrevistas reales. Certificación al completar todos los módulos.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
