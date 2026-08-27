'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
import type { A2DailyMission, A2MissionType } from '@/lib/a2-mission.types'

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
    color: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    icon: <Target className="h-4 w-4" />,
    label: 'Contrato',
  },
  mirror: {
    color: 'bg-purple-500/20 text-white/70 border-purple-500/40',
    icon: <Sparkles className="h-4 w-4" />,
    label: 'Autoconocimiento',
  },
  evidence: {
    color: 'bg-purple-500/20 text-white/70 border-purple-500/40',
    icon: <CheckCircle2 className="h-4 w-4" />,
    label: 'Evidencia',
  },
  builder: {
    color: 'bg-purple-500/20 text-white/70 border-purple-500/40',
    icon: <BookOpen className="h-4 w-4" />,
    label: 'Construcción',
  },
  market_intel: {
    color: 'bg-purple-500/20 text-white/70 border-purple-500/40',
    icon: <Target className="h-4 w-4" />,
    label: 'Mercado',
  },
  coach_forge: {
    color: 'bg-purple-500/20 text-white/70 border-purple-500/40',
    icon: <Sparkles className="h-4 w-4" />,
    label: 'Coach',
  },
  field_action: {
    color: 'bg-purple-500/20 text-white/70 border-purple-500/40',
    icon: <CheckCircle2 className="h-4 w-4" />,
    label: 'Acción real',
  },
  performance_drill: {
    color: 'bg-purple-500/20 text-white/70 border-purple-500/40',
    icon: <Target className="h-4 w-4" />,
    label: 'Práctica',
  },
  a3_checkpoint: {
    color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    icon: <Trophy className="h-4 w-4" />,
    label: 'Entrenamiento',
  },
  debrief: {
    color: 'bg-purple-500/20 text-white/70 border-purple-500/40',
    icon: <BookOpen className="h-4 w-4" />,
    label: 'Reflexión',
  },
  milestone: {
    color: 'bg-purple-500/20 text-white/70 border-purple-500/40',
    icon: <Trophy className="h-4 w-4" />,
    label: 'Hito',
  },
}

const phaseLabel: Record<A2DailyMission['phaseLabel'], string> = {
  Fundamentos: 'Fundamentos',
  'Alineación con el rol': 'Alineación con el rol',
  'Simulation & Certification': 'Simulación y certificación',
  'Master Difficult Questions & Return to Real Market':
    'Preguntas difíciles y regreso al mercado',
  'Final Applications & Offer Management':
    'Postulaciones y gestión de ofertas',
  'Final A3 Prep & Checkpoint': 'Preparación final de Entrenamiento',
  'Final Review & Next Chapter': 'Cierre y siguiente capítulo',
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
      className={`rounded-[28px] border transition-all duration-200 ${
        isCompleted
          ? 'border-green-500/40 bg-slate-900/20 hover:border-green-500/60'
          : isAvailable
            ? 'cursor-pointer border-purple-500/40 bg-slate-900/20 hover:border-purple-500/80 hover:bg-purple-500/5'
            : 'border-[rgb(80,160,170)]/20 bg-slate-900/20 opacity-60'
      }`}
    >
      <div className="space-y-4 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="border-purple-500/40 bg-purple-600/60 text-white">
                Día {dayNumber}
              </Badge>
              <Badge className={config.color}>
                {config.icon}
                <span className="ml-1">{config.label}</span>
              </Badge>
              {isA3Checkpoint && (
                <Badge className="border-emerald-500/40 bg-emerald-500/20 text-emerald-300">
                  Checkpoint de Entrenamiento
                </Badge>
              )}
              {isCompleted && (
                <Badge className="border-green-500/40 bg-green-500/20 text-green-300">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Completado
                </Badge>
              )}
            </div>

            <h3 className="text-lg font-semibold text-white">{mission.title}</h3>
            <p className="text-sm text-slate-400">{mission.subtitle}</p>
          </div>

          <div className="flex-shrink-0">
            {isCompleted ? (
              <CheckCircle2 className="h-8 w-8 text-green-400" />
            ) : isAvailable ? (
              <Button
                size="sm"
                onClick={onStart}
                className="border border-purple-500/60 bg-purple-600/10 text-purple-300 transition-all hover:border-purple-500 hover:bg-purple-600/40 hover:text-purple-200"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Lock className="h-8 w-8 text-slate-500" />
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-slate-400">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {mission.estimatedMinutes.min}-{mission.estimatedMinutes.max} min
          </span>
          <span className="text-slate-500">•</span>
          <span>{phaseLabel[mission.phaseLabel]}</span>
        </div>

        {expanded && (
          <div className="space-y-4 border-t border-purple-500/20 pt-4">
            <div>
              <h4 className="mb-2 text-xs uppercase tracking-wide text-purple-400">
                Objetivo
              </h4>
              <p className="text-sm text-slate-300">{mission.userGoal}</p>
            </div>

            <div>
              <h4 className="mb-2 text-xs uppercase tracking-wide text-purple-400">
                Pasos
              </h4>
              <ul className="list-inside list-disc space-y-1 text-sm text-slate-300">
                {mission.instructions.map((instruction) => (
                  <li key={instruction}>{instruction}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-2 text-xs uppercase tracking-wide text-purple-400">
                Entregable
              </h4>
              <p className="text-sm text-slate-300">{mission.deliverable}</p>
            </div>

            {isA3Checkpoint && a3ModuleName && (
              <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/5 p-3">
                <p className="text-sm text-emerald-300">
                  <span className="font-semibold">Módulo de Entrenamiento:</span>{' '}
                  {a3ModuleName}
                </p>
              </div>
            )}

            {blockReason && !isAvailable && (
              <div className="flex gap-2 rounded-lg border border-amber-500/40 bg-amber-500/5 p-3">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-400" />
                <p className="text-sm text-amber-200">{blockReason}</p>
              </div>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          className="mt-2 flex items-center gap-1 text-xs font-medium text-purple-400 hover:text-purple-300"
        >
          {expanded ? 'Mostrar menos' : 'Mostrar detalles'}
          <ChevronRight
            className={`h-3 w-3 transition-transform ${expanded ? 'rotate-90' : ''}`}
          />
        </button>
      </div>
    </Card>
  )
}
