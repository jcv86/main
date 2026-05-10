'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Lock, CheckCircle2, Circle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { PILLAR3_POINTS_CONFIG } from '@/lib/pillar3-points-system'

interface ModuleState {
  [key: string]: 'locked' | 'available' | 'in_progress' | 'completed'
}

interface Pillar3DetailedProgressProps {
  moduleStates: ModuleState
  completedModuleIds: string[]
  totalXp?: number
}

interface LevelConfig {
  id: string
  name: string
  description: string
  modules: Array<{ id: string; name: string; points: number }>
  order: number
}

export function Pillar3DetailedProgress({
  moduleStates,
  completedModuleIds,
  totalXp = 0,
}: Pillar3DetailedProgressProps) {
  const [expandedLevels, setExpandedLevels] = useState<Set<number>>(new Set([1]))

  // Define the 4 levels with their modules
  const levels: LevelConfig[] = [
    {
      id: 'level1',
      name: 'Auditoría Inicial',
      description: 'Evaluación base de tu presentación profesional',
      modules: [
        { id: 'auditoria-inicial', name: 'Guía del Coach - Auditoría Inicial', points: 40 },
      ],
      order: 1,
    },
    {
      id: 'level2',
      name: 'Herramientas de Preparación',
      description: 'Domina técnicas esenciales de entrevista',
      modules: [
        { id: 'metodo-star', name: 'Método STAR', points: 120 },
        { id: 'cv-inteligente', name: 'CV Inteligente', points: 120 },
        { id: 'analisis-vacante', name: 'Análisis de Vacante', points: 120 },
        { id: 'analisis-multicanal', name: 'Análisis Multimodal', points: 120 },
      ],
      order: 2,
    },
    {
      id: 'level3',
      name: 'Entrenamientos Progresivos',
      description: 'Practica en contextos cada vez más desafiantes',
      modules: [
        { id: 'entrevista-guiada', name: 'Entrevista Guiada', points: 120 },
        { id: 'entrevista-estructurada', name: 'Entrevista Estructurada', points: 120 },
        { id: 'entrevista-desafiante', name: 'Entrevista Desafiante', points: 120 },
        { id: 'entrevista-conversacional', name: 'Entrevista Conversacional', points: 120 },
      ],
      order: 3,
    },
    {
      id: 'level4',
      name: 'Simulación Real',
      description: 'Simulación completa bajo presión real',
      modules: [
        { id: 'simulacion-completa', name: 'Simulación Completa', points: 0 },
      ],
      order: 4,
    },
  ]

  // Calculate XP for each level
  const calculateLevelProgress = (levelModules: LevelConfig['modules']) => {
    const completed = levelModules.filter((mod) =>
      completedModuleIds.includes(mod.id)
    ).length
    const totalPoints = levelModules.reduce((sum, mod) => sum + mod.points, 0)
    const earnedPoints = levelModules.reduce((sum, mod) => {
      if (completedModuleIds.includes(mod.id)) {
        return sum + mod.points
      }
      return sum
    }, 0)
    const percentage = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0

    return { completed, totalPoints, earnedPoints, percentage }
  }

  // Get module status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-400" />
      case 'locked':
        return <Lock className="w-5 h-5 text-white/30" />
      case 'in_progress':
        return <Circle className="w-5 h-5 text-cyan-400 fill-cyan-400/20" />
      default:
        return <Circle className="w-5 h-5 text-white/40" />
    }
  }

  // Get level status color
  const getLevelColorClass = (levelStatus: string) => {
    switch (levelStatus) {
      case 'completed':
        return 'bg-green-500/20 border-green-500/40'
      case 'locked':
        return 'bg-white/5 border-white/10'
      case 'in_progress':
        return 'bg-cyan-500/10 border-cyan-500/30'
      default:
        return 'bg-white/5 border-white/10'
    }
  }

  // Determine level status
  const getLevelStatus = (level: LevelConfig) => {
    const allModulesLocked = level.modules.every(
      (mod) => moduleStates[mod.id] === 'locked'
    )
    const allModulesCompleted = level.modules.every(
      (mod) => completedModuleIds.includes(mod.id)
    )
    const someCompleted = level.modules.some((mod) =>
      completedModuleIds.includes(mod.id)
    )

    if (allModulesLocked) return 'locked'
    if (allModulesCompleted) return 'completed'
    if (someCompleted) return 'in_progress'
    return 'available'
  }

  // Calculate overall progress
  const overallEarnedXp = levels.reduce((sum, level) => {
    const progress = calculateLevelProgress(level.modules)
    return sum + progress.earnedPoints
  }, 0)
  const overallPercentage = (overallEarnedXp / 1000) * 100
  const completedLevels = levels.filter((l) => getLevelStatus(l) === 'completed')
    .length

  return (
    <div className="space-y-6">
      {/* Overall Progress Summary */}
      <Card className="border-muted/30 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
        <CardContent className="pt-6 pb-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Tu Progreso en Pillar 3</h3>
              <div className="text-right">
                <div className="text-sm font-bold text-white">
                  {overallEarnedXp} / 1000 XP
                </div>
                <div className="text-xs text-white/60">
                  {completedLevels} / 4 secciones
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Progress
                value={overallPercentage}
                className="h-2"
                style={{ accentColor: 'rgb(168, 85, 247)' }}
              />
              <div className="flex justify-between text-xs text-white/60">
                <span>{Math.round(overallPercentage)}%</span>
                <span>Hacia listo para entrevista real</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Level Progress */}
      <div className="space-y-3">
        {levels.map((level) => {
          const levelStatus = getLevelStatus(level)
          const isExpanded = expandedLevels.has(level.order)
          const progress = calculateLevelProgress(level.modules)
          const isLocked = levelStatus === 'locked'

          return (
            <Card
              key={level.id}
              className={`border transition overflow-hidden ${getLevelColorClass(levelStatus)}`}
            >
              {/* Level Header */}
              <button
                onClick={() => {
                  const newExpanded = new Set(expandedLevels)
                  if (isExpanded) {
                    newExpanded.delete(level.order)
                  } else {
                    newExpanded.add(level.order)
                  }
                  setExpandedLevels(newExpanded)
                }}
                disabled={isLocked}
                className={`w-full p-4 flex items-center justify-between transition ${
                  isLocked ? 'cursor-not-allowed' : 'hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3 flex-1 text-left">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      levelStatus === 'completed'
                        ? 'bg-green-500/30'
                        : levelStatus === 'locked'
                          ? 'bg-white/10'
                          : 'bg-cyan-500/20'
                    }`}
                  >
                    {levelStatus === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    ) : levelStatus === 'locked' ? (
                      <Lock className="w-5 h-5 text-white/30" />
                    ) : (
                      <span className={levelStatus === 'in_progress' ? 'text-cyan-400' : 'text-white/60'}>
                        {level.order}
                      </span>
                    )}
                  </div>

                  <div>
                    <h4
                      className={`font-semibold ${
                        isLocked ? 'text-white/40' : 'text-white'
                      }`}
                    >
                      {level.name}
                    </h4>
                    <p className={`text-sm ${isLocked ? 'text-white/30' : 'text-white/60'}`}>
                      {level.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 ml-4">
                  <div className="text-right">
                    <div
                      className={`text-sm font-semibold ${
                        isLocked ? 'text-white/30' : 'text-cyan-400'
                      }`}
                    >
                      {progress.earnedPoints}/{progress.totalPoints}
                    </div>
                    <div className="text-xs text-white/50">XP</div>
                  </div>

                  {!isLocked && (
                    <div className="text-white/60">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  )}
                </div>
              </button>

              {/* Level Modules (Expanded) */}
              {isExpanded && !isLocked && (
                <CardContent className="pt-4 pb-4 border-t border-white/10 bg-white/2">
                  <div className="space-y-3">
                    {level.modules.map((mod) => {
                      const modStatus = moduleStates[mod.id] || 'locked'
                      const isCompleted = completedModuleIds.includes(mod.id)

                      return (
                        <div key={mod.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              {getStatusIcon(modStatus)}
                              <div>
                                <p
                                  className={`text-sm font-medium ${
                                    isCompleted ? 'text-green-400' : 'text-white/80'
                                  }`}
                                >
                                  {mod.name}
                                </p>
                              </div>
                            </div>
                            <div className="text-right text-xs">
                              <span
                                className={`font-semibold ${
                                  isCompleted ? 'text-green-400' : 'text-white/60'
                                }`}
                              >
                                {isCompleted ? mod.points : 0}/{mod.points}
                              </span>
                              <span className="text-white/40 ml-1">XP</span>
                            </div>
                          </div>

                          {/* Module progress bar */}
                          <Progress
                            value={isCompleted ? 100 : 0}
                            className="h-1.5"
                            style={{
                              accentColor: isCompleted ? 'rgb(34, 197, 94)' : 'rgb(34, 211, 238)',
                            }}
                          />
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>

      {/* Completion Info */}
      {completedLevels === 4 && (
        <Card className="border-green-500/40 bg-green-500/10">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-400" />
              <div>
                <p className="font-semibold text-green-400">¡Pillar 3 Completado!</p>
                <p className="text-sm text-white/70">
                  Has dominado todas las habilidades necesarias para entrevistas reales.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
