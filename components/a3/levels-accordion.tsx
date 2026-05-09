'use client'

import { useState } from 'react'
import { Module } from '@/app/despega/a3/data/mock-dashboard'
import { ModuleCard } from './module-card'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface LevelsAccordionProps {
  modules: Module[]
}

interface LevelGroup {
  level: number
  title: string
  description: string
  modules: Module[]
}

export function LevelsAccordion({ modules }: LevelsAccordionProps) {
  const [expandedLevel, setExpandedLevel] = useState<number | null>(1)
  
  // Group modules by level
  const levels: LevelGroup[] = [
    {
      level: 1,
      title: 'Auditoría Inicial',
      description: 'Prepara tu entorno y presencia base antes de entrenar respuestas.',
      modules: modules.filter(m => m.level === 1)
    },
    {
      level: 2,
      title: 'Herramientas de Preparación',
      description: 'Construye material útil antes de practicar entrevistas.',
      modules: modules.filter(m => m.level === 2)
    },
    {
      level: 3,
      title: 'Entrenamientos Progresivos',
      description: 'Practica entrevistas con dificultad creciente.',
      modules: modules.filter(m => m.level === 3)
    },
    {
      level: 4,
      title: 'Simulación Real',
      description: 'Acércate lo más posible a una entrevista real.',
      modules: modules.filter(m => m.level === 4)
    }
  ]
  
  return (
    <div className="space-y-4">
      {levels.map((levelGroup) => {
        const isExpanded = expandedLevel === levelGroup.level
        const completedCount = levelGroup.modules.filter(m => m.status === 'completed').length
        const totalCount = levelGroup.modules.length
        const isLevelComplete = completedCount === totalCount && totalCount > 0
        
        return (
          <div
            key={levelGroup.level}
            className="border border-white/10 rounded-lg overflow-hidden hover:border-white/20 transition"
          >
            {/* Level header */}
            <button
              onClick={() => setExpandedLevel(isExpanded ? null : levelGroup.level)}
              className="w-full p-4 bg-gradient-to-r from-white/5 to-white/2 hover:from-white/10 hover:to-white/5 transition flex items-center justify-between group"
            >
              <div className="flex-1 text-left space-y-1">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">{levelGroup.level}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">{levelGroup.title}</h3>
                  {isLevelComplete && (
                    <span className="text-xs font-semibold text-green-400 bg-green-500/20 px-2 py-1 rounded">Completado</span>
                  )}
                </div>
                <p className="text-sm text-white/60 ml-11">{levelGroup.description}</p>
              </div>
              
              <div className="flex items-center gap-4 ml-4">
                <div className="text-right text-sm">
                  <div className="font-mono text-purple-400">{completedCount}/{totalCount}</div>
                  <div className="text-xs text-white/60">completados</div>
                </div>
                <div className="group-hover:text-purple-400 transition">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </div>
            </button>
            
            {/* Level modules */}
            {isExpanded && (
              <div className="border-t border-white/10 p-4 bg-white/2 space-y-3">
                {levelGroup.modules.map((module) => (
                  <ModuleCard key={module.id} module={module} />
                ))}
              </div>
            )}
          </div>
        )
      })}
      
      {/* Contextual message at the end */}
      <div className="mt-8 p-4 rounded-lg border border-purple-500/30 bg-purple-500/10 space-y-2">
        <p className="text-sm text-white/80">
          <span className="font-semibold text-purple-400">Próximo paso recomendado:</span>
          {' '}Completa los hitos faltantes en tu nivel actual para desbloquear nuevas herramientas y entrenamientos.
        </p>
      </div>
    </div>
  )
}
