import { useState } from 'react'
import { ChevronDown, ChevronUp, Lock, CheckCircle2, Circle, Coins, Zap, Play } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  PILLAR3_LEVELS,
  PILLAR3_LEVEL_ORDER,
  PILLAR3_MODULES,
  TOTAL_PILLAR3_XP,
  TOTAL_PILLAR3_DTC,
  getLevelXp,
  getLevelDtc,
  resolveCanonicalId,
  buildModuleStates,
  type Pillar3LevelId,
  type Pillar3ModuleId,
} from '@/lib/pillar3-config'

type ModuleStatus = 'locked' | 'available' | 'in_progress' | 'completed'

interface Pillar3DetailedProgressProps {
  moduleStates: Record<string, ModuleStatus> | undefined
  completedModuleIds: string[]
  totalXp?: number
  totalDtc?: number
}

export function Pillar3DetailedProgress({
  moduleStates,
  completedModuleIds,
  totalXp,
  totalDtc,
}: Pillar3DetailedProgressProps) {
  const [expandedLevels, setExpandedLevels] = useState<Set<Pillar3LevelId>>(new Set([1]))

  // Resolve all completed IDs to canonical for consistent comparison
  const completedCanonical = new Set(
    completedModuleIds
      .map((id) => resolveCanonicalId(id))
      .filter((id): id is Pillar3ModuleId => id !== null)
  )

  // If moduleStates is empty/undefined, derive from canonical config
  // This ensures Level 1 is always 'in_progress' by default
  const derivedModuleStates =
    moduleStates && Object.keys(moduleStates).length > 0
      ? moduleStates
      : buildModuleStates(completedModuleIds)

  const getModuleStatus = (moduleId: Pillar3ModuleId): ModuleStatus => {
    if (completedCanonical.has(moduleId)) return 'completed'
    return (derivedModuleStates[moduleId] as ModuleStatus) ?? 'locked'
  }

  // Aggregate progress per level
  const calculateLevelProgress = (levelId: Pillar3LevelId) => {
    const moduleIds = PILLAR3_LEVELS[levelId].moduleIds
    const completed = moduleIds.filter((id) => completedCanonical.has(id)).length
    const totalXp = getLevelXp(levelId)
    const totalDtc = getLevelDtc(levelId)
    const earnedXp = moduleIds.reduce(
      (sum, id) => sum + (completedCanonical.has(id) ? PILLAR3_MODULES[id].xp : 0),
      0
    )
    const earnedDtc = moduleIds.reduce(
      (sum, id) => sum + (completedCanonical.has(id) ? PILLAR3_MODULES[id].dtc : 0),
      0
    )
    const percentage = totalXp > 0 ? (earnedXp / totalXp) * 100 : 0
    return { completed, totalXp, totalDtc, earnedXp, earnedDtc, percentage, total: moduleIds.length }
  }

  // Determine level status from its modules
  const getLevelStatus = (levelId: Pillar3LevelId): ModuleStatus => {
    const moduleIds = PILLAR3_LEVELS[levelId].moduleIds
    const allLocked = moduleIds.every((id) => getModuleStatus(id) === 'locked')
    const allCompleted = moduleIds.every((id) => completedCanonical.has(id))
    const someCompleted = moduleIds.some((id) => completedCanonical.has(id))

    if (allLocked) return 'locked'
    if (allCompleted) return 'completed'
    if (someCompleted) return 'in_progress'
    return 'available'
  }

  // Compute global totals (use props if provided, else derive from canonical config)
  const overallEarnedXp =
    totalXp ??
    PILLAR3_LEVEL_ORDER.reduce((sum, lid) => sum + calculateLevelProgress(lid).earnedXp, 0)
  const overallEarnedDtc =
    totalDtc ??
    PILLAR3_LEVEL_ORDER.reduce((sum, lid) => sum + calculateLevelProgress(lid).earnedDtc, 0)

  const overallXpPct = (overallEarnedXp / TOTAL_PILLAR3_XP) * 100
  const overallDtcPct = (overallEarnedDtc / TOTAL_PILLAR3_DTC) * 100
  const completedLevels = PILLAR3_LEVEL_ORDER.filter(
    (lid) => getLevelStatus(lid) === 'completed'
  ).length

  // Status icon for module rows
  const getStatusIcon = (status: ModuleStatus) => {
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

  const getLevelColorClass = (status: ModuleStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 border-green-500/40'
      case 'locked':
        return 'bg-white/5 border-white/10'
      case 'in_progress':
        return 'bg-cyan-500/10 border-cyan-500/30'
      default:
        return 'bg-purple-500/10 border-purple-500/30'
    }
  }

  return (
    <div className="space-y-6">
      {/* Overall Progress Summary - shows BOTH XP and DTC */}
      <Card className="border-muted/30 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
        <CardContent className="pt-6 pb-6">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Tu Progreso en Pillar 3</h3>
                <p className="text-xs text-white/60 mt-1">
                  {completedLevels} / 4 niveles completados
                </p>
              </div>
              <div className="text-right space-y-1">
                <div className="flex items-center justify-end gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-bold text-white">
                    {overallEarnedXp} / {TOTAL_PILLAR3_XP} XP
                  </span>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <Coins className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-bold text-white">
                    {overallEarnedDtc} / {TOTAL_PILLAR3_DTC} DTC
                  </span>
                </div>
              </div>
            </div>

            {/* XP Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-cyan-400 font-medium">Experiencia (XP)</span>
                <span className="text-white/60">{Math.round(overallXpPct)}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${overallXpPct}%`,
                    background: 'linear-gradient(90deg, rgb(34,211,238) 0%, rgb(168,85,247) 100%)',
                  }}
                />
              </div>
            </div>

            {/* DTC Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-yellow-400 font-medium">Tokens (DTC)</span>
                <span className="text-white/60">{Math.round(overallDtcPct)}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${overallDtcPct}%`,
                    background: 'linear-gradient(90deg, rgb(250,204,21) 0%, rgb(245,158,11) 100%)',
                  }}
                />
              </div>
            </div>

            <p className="text-xs text-white/50 text-center pt-1">
              Hacia &quot;Listo para Entrevista Real&quot;
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Per-Level Progress */}
      <div className="space-y-3">
        {PILLAR3_LEVEL_ORDER.map((levelId) => {
          const level = PILLAR3_LEVELS[levelId]
          const levelStatus = getLevelStatus(levelId)
          const isExpanded = expandedLevels.has(levelId)
          const progress = calculateLevelProgress(levelId)
          const isLocked = levelStatus === 'locked'

          return (
            <Card
              key={levelId}
              className={`border transition overflow-hidden ${getLevelColorClass(levelStatus)}`}
            >
              {/* Level Header */}
              <button
                onClick={() => {
                  const next = new Set(expandedLevels)
                  if (isExpanded) next.delete(levelId)
                  else next.add(levelId)
                  setExpandedLevels(next)
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
                          : levelStatus === 'in_progress'
                            ? 'bg-cyan-500/20'
                            : 'bg-purple-500/20'
                    }`}
                  >
                    {levelStatus === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    ) : levelStatus === 'locked' ? (
                      <Lock className="w-5 h-5 text-white/30" />
                    ) : (
                      <span
                        className={
                          levelStatus === 'in_progress' ? 'text-cyan-400' : 'text-purple-400'
                        }
                      >
                        {levelId}
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className={`font-semibold ${isLocked ? 'text-white/40' : 'text-white'}`}>
                      {level.name}
                    </h4>
                    <p className={`text-sm ${isLocked ? 'text-white/30' : 'text-white/60'}`}>
                      {level.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 ml-4">
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Zap className={`w-3.5 h-3.5 ${isLocked ? 'text-white/30' : 'text-cyan-400'}`} />
                      <span
                        className={`text-sm font-semibold ${
                          isLocked ? 'text-white/30' : 'text-cyan-400'
                        }`}
                      >
                        {progress.earnedXp}/{progress.totalXp}
                      </span>
                    </div>
                    <div className="flex items-center justify-end gap-1.5 mt-0.5">
                      <Coins
                        className={`w-3.5 h-3.5 ${isLocked ? 'text-white/30' : 'text-yellow-400'}`}
                      />
                      <span
                        className={`text-xs font-semibold ${
                          isLocked ? 'text-white/30' : 'text-yellow-400'
                        }`}
                      >
                        {progress.earnedDtc}/{progress.totalDtc}
                      </span>
                    </div>
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

              {/* Expanded Module List */}
              {isExpanded && !isLocked && (
                <CardContent className="pt-4 pb-4 border-t border-white/10">
                  <div className="space-y-3">
                    {level.moduleIds.map((moduleId) => {
                      const module = PILLAR3_MODULES[moduleId]
                      const modStatus = getModuleStatus(moduleId)
                      const isCompleted = modStatus === 'completed'

                      return (
                        <div key={moduleId} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              {getStatusIcon(modStatus)}
                              <div>
                                <p
                                  className={`text-sm font-medium ${
                                    isCompleted ? 'text-green-400' : 'text-white/80'
                                  }`}
                                >
                                  {module.name}
                                </p>
                                <p className="text-xs text-white/50 mt-0.5">
                                  {module.description}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 ml-4">
                              <div className="text-right text-xs space-y-0.5">
                                <div className="flex items-center justify-end gap-1">
                                  <Zap
                                    className={`w-3 h-3 ${
                                      isCompleted ? 'text-green-400' : 'text-cyan-400/70'
                                    }`}
                                  />
                                  <span
                                    className={`font-semibold ${
                                      isCompleted ? 'text-green-400' : 'text-white/70'
                                    }`}
                                  >
                                    {isCompleted ? module.xp : 0}/{module.xp} XP
                                  </span>
                                </div>
                                <div className="flex items-center justify-end gap-1">
                                  <Coins
                                    className={`w-3 h-3 ${
                                      isCompleted ? 'text-green-400' : 'text-yellow-400/70'
                                    }`}
                                  />
                                  <span
                                    className={`font-semibold ${
                                      isCompleted ? 'text-green-400' : 'text-white/70'
                                    }`}
                                  >
                                    {isCompleted ? module.dtc : 0}/{module.dtc} DTC
                                  </span>
                                </div>
                              </div>
                              
                              {/* Launch button for audit module */}
                              {moduleId === 'auditoria-inicial' && !isCompleted && (
                                <Link
                                  href="/despega/interview-0"
                                  className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold rounded-md flex items-center gap-1.5 transition whitespace-nowrap"
                                >
                                  <Play className="w-3.5 h-3.5" />
                                  Comenzar
                                </Link>
                              )}
                            </div>
                          </div>

                          {/* Module progress bar */}
                          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${isCompleted ? 100 : 0}%`,
                                background: isCompleted ? 'rgb(34, 197, 94)' : 'rgb(34, 211, 238)',
                              }}
                            />
                          </div>
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

      {/* Completion Banner */}
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
