'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Clock,
  CheckCircle2,
  Lock,
  ChevronRight,
  Sparkles,
  Target,
  BookOpen,
  AlertCircle,
  Trophy,
} from 'lucide-react'
import { A2DailyMission, A2MissionType } from '@/lib/a2-mission.types'

interface A2DailyMissionCardProps {
  mission: A2DailyMission
  dayNumber: number
  isCompleted: boolean
  isAvailable: boolean
  isA3Checkpoint: boolean
  a3ModuleName?: string
  onStart: () => void
  blockReason?: string
}

const missionTypeConfig: Record<
  A2MissionType,
  { color: string; icon: React.ReactNode; label: string }
> = {
  roadmap_gate: {
    color: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    icon: <Target className="w-4 h-4" />,
    label: 'Contrato',
  },
  mirror: {
    color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    icon: <Sparkles className="w-4 h-4" />,
    label: 'Autoconocimiento',
  },
  evidence: {
    color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    icon: <CheckCircle2 className="w-4 h-4" />,
    label: 'Evidencia',
  },
  builder: {
    color: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    icon: <BookOpen className="w-4 h-4" />,
    label: 'Constructor',
  },
  market_intel: {
    color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    icon: <Target className="w-4 h-4" />,
    label: 'Inteligencia',
  },
  coach_forge: {
    color: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    icon: <Sparkles className="w-4 h-4" />,
    label: 'Coach',
  },
  field_action: {
    color: 'bg-red-500/20 text-red-300 border-red-500/30',
    icon: <CheckCircle2 className="w-4 h-4" />,
    label: 'Acción',
  },
  performance_drill: {
    color: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    icon: <Target className="w-4 h-4" />,
    label: 'Práctica',
  },
  a3_checkpoint: {
    color: 'bg-green-500/20 text-green-300 border-green-500/30',
    icon: <Trophy className="w-4 h-4" />,
    label: 'Checkpoint A3',
  },
  debrief: {
    color: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    icon: <BookOpen className="w-4 h-4" />,
    label: 'Reflexión',
  },
  milestone: {
    color: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    icon: <Trophy className="w-4 h-4" />,
    label: 'Hito',
  },
}

export function A2DailyMissionCard({
  mission,
  dayNumber,
  isCompleted,
  isAvailable,
  isA3Checkpoint,
  a3ModuleName,
  onStart,
  blockReason,
}: A2DailyMissionCardProps) {
  const [expanded, setExpanded] = useState(false)
  const config = missionTypeConfig[mission.missionType]

  return (
    <Card
      className={`transition-all duration-200 rounded-[28px] border ${
        isCompleted
          ? 'bg-slate-900/20 border-green-500/40 hover:border-green-500/60'
          : isAvailable
            ? 'bg-slate-900/20 border-purple-500/40 hover:border-purple-500/80 hover:bg-purple-500/5 cursor-pointer'
            : 'bg-slate-900/20 border-slate-700/20 opacity-60'
      }`}
    >
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                Día {dayNumber}
              </Badge>
              <Badge className={config.color}>
                {config.icon}
                <span className="ml-1">{config.label}</span>
              </Badge>
              {isA3Checkpoint && (
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                  A3 Checkpoint
                </Badge>
              )}
              {isCompleted && (
                <Badge className="bg-green-500/20 text-green-300">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Completado
                </Badge>
              )}
            </div>

            <h3 className="text-lg font-semibold text-white">{mission.title}</h3>
            <p className="text-sm text-slate-400">{mission.subtitle}</p>
          </div>

          <div className="flex-shrink-0">
            {isCompleted ? (
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            ) : isAvailable ? (
              <Button
                size="sm"
                onClick={onStart}
                className="bg-purple-600/10 hover:bg-purple-600/40 border border-purple-500/60 hover:border-purple-500/100 text-purple-300 hover:text-purple-200 transition-all duration-200"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Lock className="w-8 h-8 text-slate-500" />
            )}
          </div>
        </div>

        {/* Time & Stats */}
        <div className="flex items-center gap-4 text-sm text-slate-400">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>
              {mission.estimatedMinutes.min}-{mission.estimatedMinutes.max} min
            </span>
          </div>
          <div className="text-slate-500">•</div>
          <span className="text-slate-400">{mission.phaseLabel}</span>
        </div>

        {/* Expandable Content */}
        {expanded && (
          <div className="space-y-4 border-t border-purple-500/20 pt-4">
            {/* Goal */}
            <div>
              <h4 className="text-xs uppercase tracking-wide text-purple-400 mb-2">
                Objetivo
              </h4>
              <p className="text-sm text-slate-300">{mission.userGoal}</p>
            </div>

            {/* Instructions */}
            {mission.instructions && mission.instructions.length > 0 && (
              <div>
                <h4 className="text-xs uppercase tracking-wide text-purple-400 mb-2">
                  Pasos
                </h4>
                <ul className="text-sm text-slate-300 space-y-1 list-disc list-inside">
                  {mission.instructions.map((instruction, idx) => (
                    <li key={idx}>{instruction}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Deliverable */}
            <div>
              <h4 className="text-xs uppercase tracking-wide text-purple-400 mb-2">
                Entregable
              </h4>
              <p className="text-sm text-slate-300">{mission.deliverable}</p>
            </div>

            {/* A3 Module Info */}
            {isA3Checkpoint && a3ModuleName && (
              <div className="bg-emerald-500/5 border border-emerald-500/40 rounded-lg p-3">
                <p className="text-sm text-emerald-300">
                  <span className="font-semibold">A3 Module:</span> {a3ModuleName}
                </p>
              </div>
            )}

            {/* Block Reason */}
            {blockReason && !isAvailable && (
              <div className="bg-amber-500/5 border border-amber-500/40 rounded-lg p-3 flex gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-200">{blockReason}</p>
              </div>
            )}
          </div>
        )}

        {/* Toggle Expand */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 mt-2"
        >
          {expanded ? 'Mostrar menos' : 'Mostrar detalles'}
          <ChevronRight className={`w-3 h-3 transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </button>
      </div>
    </Card>
  )
}
