'use client'

import { useState } from 'react'
import { Module } from '@/app/despega/a3/data/mock-dashboard'
import { ModuleCard } from './module-card'
import { ChevronDown, ChevronUp, Lock, CheckCircle2 } from 'lucide-react'

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
  
  // Determine unlock conditions
  const getUnlockInfo = (level: number, allLevels: LevelGroup[]) => {
    if (level === 1) return { isLocked: false, reason: '' }
    
    const previousLevel = allLevels[level - 2]
    const isPreviousComplete = previousLevel && 
      previousLevel.modules.length > 0 && 
      previousLevel.modules.every(m => m.status === 'completed')
    
    return {
      isLocked: !isPreviousComplete,
      reason: `Se desbloquea tras completar: ${allLevels[level - 2]?.title}`
    }
  }
  
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
        const unlockInfo = getUnlockInfo(levelGroup.level, levels)
        const isLocked = unlockInfo.isLocked
        
        return (
          <div
            key={levelGroup.level}
            className={`border rounded-lg overflow-hidden transition ${
              isLocked 
                ? 'border-white/5 bg-white/2 opacity-60' 
                : 'border-white/10 hover:border-white/20'
            }`}
          >
            {/* Level header */}
            <button
              onClick={() => !isLocked && setExpandedLevel(isExpanded ? null : levelGroup.level)}
              disabled={isLocked}
              className={`w-full p-4 flex items-center justify-between group transition ${
                isLocked
                  ? 'bg-white/2 cursor-not-allowed'
                  : 'bg-gradient-to-r from-white/5 to-white/2 hover:from-white/10 hover:to-white/5'
              }`}
            >
              <div className="flex-1 text-left space-y-1">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isLocked
                      ? 'bg-white/10'
                      : 'bg-gradient-to-br from-training to-training/60'
                  }`}>
                    {isLocked ? (
                      <Lock className="w-4 h-4 text-white/40" />
                    ) : isLevelComplete ? (
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    ) : (
                      <span className="text-sm font-bold text-white">{levelGroup.level}</span>
                    )}
                  </div>
                  <h3 className={`text-lg font-semibold ${isLocked ? 'text-white/40' : 'text-white'}`}>{levelGroup.title}</h3>
                  {isLevelComplete && (
                    <span className="text-xs font-semibold text-green-400 bg-green-500/20 px-2 py-1 rounded">Completado</span>
                  )}
                  {isLocked && (
                    <span className="text-xs font-semibold text-white/40 bg-white/10 px-2 py-1 rounded">Bloqueado</span>
                  )}
                </div>
                <p className={`text-sm ml-11 ${isLocked ? 'text-white/30' : 'text-white/60'}`}>{levelGroup.description}</p>
                {isLocked && (
                  <p className="text-xs text-white/40 ml-11 italic">{unlockInfo.reason}</p>
                )}
              </div>
              
              <div className="flex items-center gap-4 ml-4">
                <div className="text-right text-sm">
                  <div className={`font-mono ${isLocked ? 'text-white/30' : 'text-training'}`}>{completedCount}/{totalCount}</div>
                  <div className={`text-xs ${isLocked ? 'text-white/30' : 'text-white/60'}`}>completados</div>
                </div>
                {!isLocked && (
                  <div className="group-hover:text-training transition">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                )}
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
