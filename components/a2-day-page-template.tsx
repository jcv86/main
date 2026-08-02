'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ClipboardList,
  Trophy,
  Users,
  Wrench,
  Zap,
} from 'lucide-react'
import { A2_DAILY_MISSIONS } from '@/lib/a2-missions-full'
import type { A2DailyMission } from '@/lib/a2-mission.types'
import { A2DailyMissionCard } from '@/components/a2-daily-mission-card'
import { A2GenericMissionWorkspace } from '@/components/a2-generic-mission-workspace'
import { getA3CheckpointForDay } from '@/lib/a3-checkpoint-map'
import { completeA2Day } from '@/lib/a2/client-completion'
import {
  normalizeA2MissionSubmission,
  requiresUniversalA2Submission,
  validateA2MissionSubmission,
  type A2MissionSubmission,
} from '@/lib/a2/day-submission'

interface A2DayPageTemplateProps {
  dayNumber: number
  onComplete?: () => void
  children?: React.ReactNode
  mission?: Partial<A2DailyMission>
  userId?: string
  routeContext?: any
}

const EMPTY_SUBMISSION: A2MissionSubmission = {
  summary: '',
  evidence: '',
  reflection: '',
  metrics: '',
  artifactUrl: '',
  completedInstructions: [],
}

const taskTypeLabels: Record<
  string,
  { label: string; icon: React.ReactNode; color: string }
> = {
  roadmap_gate: {
    label: 'Contrato',
    icon: <ClipboardList className="h-4 w-4" />,
    color: 'bg-purple-500/20 text-purple-300',
  },
  mirror: {
    label: 'Autoconocimiento',
    icon: <BookOpen className="h-4 w-4" />,
    color: 'bg-blue-500/20 text-blue-300',
  },
  evidence: {
    label: 'Evidencia',
    icon: <ClipboardList className="h-4 w-4" />,
    color: 'bg-cyan-500/20 text-cyan-300',
  },
  builder: {
    label: 'Construcción',
    icon: <Wrench className="h-4 w-4" />,
    color: 'bg-purple-500/20 text-purple-300',
  },
  market_intel: {
    label: 'Mercado',
    icon: <BookOpen className="h-4 w-4" />,
    color: 'bg-blue-500/20 text-blue-300',
  },
  coach_forge: {
    label: 'Coach',
    icon: <Users className="h-4 w-4" />,
    color: 'bg-fuchsia-500/20 text-fuchsia-300',
  },
  field_action: {
    label: 'Acción real',
    icon: <Users className="h-4 w-4" />,
    color: 'bg-emerald-500/20 text-emerald-300',
  },
  performance_drill: {
    label: 'Práctica',
    icon: <Wrench className="h-4 w-4" />,
    color: 'bg-amber-500/20 text-amber-300',
  },
  a3_checkpoint: {
    label: 'Entrenamiento',
    icon: <Trophy className="h-4 w-4" />,
    color: 'bg-emerald-500/20 text-emerald-300',
  },
  debrief: {
    label: 'Reflexión',
    icon: <BookOpen className="h-4 w-4" />,
    color: 'bg-sky-500/20 text-sky-300',
  },
  milestone: {
    label: 'Hito',
    icon: <Trophy className="h-4 w-4" />,
    color: 'bg-emerald-500/20 text-emerald-300',
  },
}

export function A2DayPageTemplate({
  dayNumber,
  onComplete,
  children,
  mission: customMission,
  routeContext,
}: A2DayPageTemplateProps) {
  const router = useRouter()
  const [isCompleting, setIsCompleting] = useState(false)
  const [completionError, setCompletionError] = useState<string | null>(null)
  const [submission, setSubmission] = useState<A2MissionSubmission>(EMPTY_SUBMISSION)
  const [draftReady, setDraftReady] = useState(false)
  const configMission = A2_DAILY_MISSIONS[dayNumber]
  const mission = configMission
    ? ({ ...configMission, ...customMission } as A2DailyMission)
    : null
  const checkpoint = getA3CheckpointForDay(dayNumber)
  const needsEvidence = Boolean(
    mission && !children && requiresUniversalA2Submission(mission),
  )
  const draftKey = `dtc:a2:mission-draft:${dayNumber}`

  const liveValidation = useMemo(
    () =>
      mission
        ? validateA2MissionSubmission(mission, submission)
        : {
            passed: false,
            score: 0,
            passScore: 100,
            mode: 'structural' as const,
            errors: ['La misión no está configurada.'],
            strengths: [],
            criteria: [],
            normalized: EMPTY_SUBMISSION,
          },
    [mission, submission],
  )

  useEffect(() => {
    if (!mission || !needsEvidence) {
      setDraftReady(true)
      return
    }

    try {
      const stored = window.localStorage.getItem(draftKey)
      if (stored) {
        setSubmission(
          normalizeA2MissionSubmission(mission, JSON.parse(stored)),
        )
      }
    } catch (error) {
      console.error('[v0] Error restoring A2 mission draft:', error)
      window.localStorage.removeItem(draftKey)
    } finally {
      setDraftReady(true)
    }
  }, [draftKey, mission, needsEvidence])

  useEffect(() => {
    if (!draftReady || !needsEvidence) return

    window.localStorage.setItem(draftKey, JSON.stringify(submission))
  }, [draftKey, draftReady, needsEvidence, submission])

  if (!mission) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="max-w-md rounded-[28px] border border-purple-500/40 bg-slate-900/50 p-6 text-center">
          <h2 className="mb-2 text-xl font-bold text-white">Día no encontrado</h2>
          <p className="mb-4 text-slate-400">
            El día {dayNumber} no existe en la configuración.
          </p>
          <Button
            onClick={() => router.push('/despega/a2')}
            className="border border-purple-500/80 bg-purple-600/70 text-white transition-all duration-200 hover:border-purple-500 hover:bg-purple-600/90"
          >
            Volver a Tu Ruta
          </Button>
        </div>
      </div>
    )
  }

  const prevDay = dayNumber > 1 ? dayNumber - 1 : null
  const nextDay = dayNumber < 90 ? dayNumber + 1 : null
  const typeInfo = taskTypeLabels[mission.missionType] || taskTypeLabels.builder

  const completeGenericDay = async () => {
    if (isCompleting) return
    setIsCompleting(true)
    setCompletionError(null)

    try {
      const result = await completeA2Day(
        dayNumber,
        needsEvidence ? submission : undefined,
      )
      onComplete?.()
      if (needsEvidence) window.localStorage.removeItem(draftKey)
      router.push(result.nextPath)
      router.refresh()
    } catch (error) {
      console.error('[v0] Error completing A2 day:', error)
      setCompletionError(
        error instanceof Error ? error.message : 'No pudimos completar el día.',
      )
    } finally {
      setIsCompleting(false)
    }
  }

  const completionDisabled =
    isCompleting || (needsEvidence && !liveValidation.passed)

  return (
    <div className="min-h-screen bg-background">
      <div
        className="border-b"
        style={{
          backgroundColor: 'rgba(90, 90, 150, 0)',
          borderColor: 'rgba(80, 160, 170, 0.2)',
        }}
      >
        <div className="mx-auto max-w-4xl px-4 py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge
                className="text-white"
                style={{
                  backgroundColor: 'rgba(90, 90, 150, 0.8)',
                  borderColor: 'rgba(80, 160, 170, 0.2)',
                }}
              >
                Día {dayNumber}
              </Badge>
              <Badge className={typeInfo.color}>
                {typeInfo.icon}
                <span className="ml-1">{typeInfo.label}</span>
              </Badge>
              {checkpoint && (
                <Badge className="border-emerald-500/40 bg-emerald-500/20 text-emerald-300">
                  Checkpoint de Entrenamiento
                </Badge>
              )}
            </div>
            <Button
              onClick={() => router.push('/despega/a2')}
              variant="ghost"
              size="sm"
              className="rounded-[12px] px-3 py-1 text-sm transition-all duration-200"
              style={{
                backgroundColor: 'rgba(90, 90, 150, 0.6)',
                color: 'rgba(255, 255, 255, 0.8)',
              }}
            >
              ← Volver a Tu Ruta
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
        {children ? (
          children
        ) : (
          <>
            <A2DailyMissionCard
              mission={mission}
              dayNumber={dayNumber}
              isCompleted={false}
              isAvailable
              isA3Checkpoint={Boolean(checkpoint)}
              a3ModuleName={
                checkpoint
                  ? `Módulo ${checkpoint.moduleNumber}: ${checkpoint.moduleTitle}`
                  : undefined
              }
              onStart={() => undefined}
            />

            {routeContext && (
              <div className="space-y-4 rounded-[28px] border border-blue-500/40 bg-blue-500/5 p-6">
                <h3 className="text-lg font-semibold text-blue-300">
                  Tu contexto en esta misión
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {routeContext.c1 && (
                    <div className="rounded-lg border border-[rgb(80,160,170)]/40 bg-slate-800/40 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Tu identidad
                      </p>
                      <p className="mt-2 font-medium text-white">
                        {routeContext.c1.targetRole}
                      </p>
                      <p className="mt-1 text-sm text-slate-400">
                        {routeContext.c1.industry}
                      </p>
                    </div>
                  )}
                  {routeContext.a1 && (
                    <div className="rounded-lg border border-[rgb(80,160,170)]/40 bg-slate-800/40 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Tu estilo
                      </p>
                      <p className="mt-2 font-medium capitalize text-white">
                        {routeContext.a1.communicationStyle}
                      </p>
                    </div>
                  )}
                  {routeContext.c2 && (
                    <div className="rounded-lg border border-[rgb(80,160,170)]/40 bg-slate-800/40 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Tu evidencia
                      </p>
                      <p className="mt-2 font-medium text-white">
                        {routeContext.c2.achievements?.length || 0} logros
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-4 rounded-[28px] border border-[rgba(80,160,170,0.2)] bg-purple-500/5 p-6">
              <h3 className="text-lg font-semibold text-purple-300">
                ¿Por qué es importante?
              </h3>
              <p className="leading-relaxed text-white/80">{mission.whyItMatters}</p>
            </div>

            {needsEvidence && draftReady && (
              <A2GenericMissionWorkspace
                mission={mission}
                value={submission}
                validation={liveValidation}
                onChange={setSubmission}
              />
            )}

            {needsEvidence && !draftReady && (
              <p className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 text-sm text-slate-400">
                Recuperando tu borrador…
              </p>
            )}

            {checkpoint && (
              <div className="space-y-4 rounded-[28px] border border-[rgba(80,160,170,0.2)] bg-emerald-500/5 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-emerald-300">
                      Checkpoint de Entrenamiento
                    </h3>
                    <p className="mt-2 leading-relaxed text-white/80">
                      Completa{' '}
                      <strong>
                        Módulo {checkpoint.moduleNumber}: {checkpoint.moduleTitle}
                      </strong>{' '}
                      y vuelve para validar este día.
                    </p>
                  </div>
                  <Zap className="h-6 w-6 flex-shrink-0 text-emerald-400" />
                </div>

                <Button
                  onClick={() => router.push(checkpoint.route)}
                  className="w-full rounded-lg border border-emerald-500/80 bg-emerald-600/80 py-6 text-base font-semibold text-white transition-all duration-200 hover:border-emerald-500 hover:bg-emerald-600"
                >
                  Abrir {checkpoint.moduleTitle}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}

        {!children && (
          <div className="space-y-3 pt-4">
            {completionError && (
              <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200">
                {completionError}
              </p>
            )}
            {needsEvidence && (
              <p className="text-center text-xs text-slate-500">
                El borrador se guarda automáticamente en este dispositivo.
              </p>
            )}
            <div className="flex gap-4">
              {prevDay && (
                <Button
                  onClick={() => router.push(`/despega/a2/dia-${prevDay}`)}
                  className="flex-1 rounded-full border-2 bg-slate-950/40 py-6 font-semibold text-cyan-300 transition-all duration-200"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Anterior
                </Button>
              )}
              <Button
                onClick={completeGenericDay}
                disabled={completionDisabled}
                className="flex-1 rounded-full border border-purple-500/80 bg-purple-600/80 py-6 font-semibold text-white transition-all duration-200 hover:border-purple-500 hover:bg-purple-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isCompleting
                  ? 'Guardando…'
                  : checkpoint
                    ? 'Validar checkpoint'
                    : nextDay
                      ? 'Registrar y continuar'
                      : 'Completar ruta'}
                {!isCompleting && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
