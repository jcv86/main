'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Loader2,
  Lock,
  Trophy,
  Users,
  Wrench,
  Zap,
} from 'lucide-react'
import { A2_DAILY_MISSIONS } from '@/lib/a2-missions-full'
import type { A2DailyMission } from '@/lib/a2-mission.types'
import { A2DailyMissionCard } from '@/components/a2-daily-mission-card'
import { A2GenericMissionWorkspace } from '@/components/a2-generic-mission-workspace'
import { A2RouteContextCard } from '@/components/a2-route-context-card'
import { getA3CheckpointForDay } from '@/lib/a3-checkpoint-map'
import { completeA2Day } from '@/lib/a2/client-completion'
import {
  fetchA2DayState,
  type A2DayStateResponse,
} from '@/lib/a2/client-day-state'
import { SIGN_IN_PATH } from '@/lib/auth/routes'
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
  routeContext?: {
    c1?: { targetRole?: string; industry?: string }
    a1?: { communicationStyle?: string }
    c2?: { achievements?: unknown[] }
  }
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

function errorStatus(error: unknown): number | undefined {
  return error instanceof Error && 'status' in error
    ? Number((error as Error & { status?: number }).status)
    : undefined
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
  const [completionNotice, setCompletionNotice] = useState<string | null>(null)
  const [submission, setSubmission] = useState<A2MissionSubmission>(EMPTY_SUBMISSION)
  const [draftReady, setDraftReady] = useState(false)
  const [dayState, setDayState] = useState<A2DayStateResponse | null>(null)
  const [stateLoading, setStateLoading] = useState(true)
  const [stateError, setStateError] = useState<string | null>(null)

  const mission = useMemo(() => {
    const configured = A2_DAILY_MISSIONS[dayNumber]
    if (!configured) return null
    return customMission
      ? ({ ...configured, ...customMission } as A2DailyMission)
      : configured
  }, [customMission, dayNumber])

  const checkpoint = getA3CheckpointForDay(dayNumber)
  const needsEvidence = Boolean(
    mission && !children && requiresUniversalA2Submission(mission),
  )
  const draftKey = `dtc:a2:mission-draft:${dayNumber}`
  const isCompleted = Boolean(dayState?.completion?.isCompleted)

  const loadDayState = useCallback(async () => {
    setStateLoading(true)
    try {
      const nextState = await fetchA2DayState(dayNumber)
      setDayState(nextState)
      setStateError(null)
    } catch (error) {
      console.error('[v0] Error loading A2 day state:', error)
      if (errorStatus(error) === 401) {
        router.replace(SIGN_IN_PATH)
        return
      }
      setStateError(
        error instanceof Error
          ? error.message
          : 'No pudimos verificar el estado de este día.',
      )
    } finally {
      setStateLoading(false)
    }
  }, [dayNumber, router])

  useEffect(() => {
    void loadDayState()
  }, [loadDayState])

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
    if (stateLoading || !dayState) return

    setSubmission(EMPTY_SUBMISSION)
    setDraftReady(false)

    if (!mission || !needsEvidence) {
      setDraftReady(true)
      return
    }

    const savedSubmission = dayState.completion?.submission
    if (savedSubmission) {
      setSubmission(normalizeA2MissionSubmission(mission, savedSubmission))
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
  }, [dayState, draftKey, mission, needsEvidence, stateLoading])

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
          <Button onClick={() => router.push('/despega/a2')}>
            Volver a Tu Ruta
          </Button>
        </div>
      </div>
    )
  }

  if (stateLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
          Verificando el acceso al Día {dayNumber}…
        </div>
      </div>
    )
  }

  if (stateError || !dayState) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md space-y-4 rounded-[28px] border border-amber-500/30 bg-amber-500/5 p-6 text-center">
          <h2 className="text-xl font-semibold text-white">
            No pudimos abrir este día
          </h2>
          <p className="text-sm text-amber-100">
            {stateError || 'El estado de la misión no está disponible.'}
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => router.push('/despega/a2')}
            >
              Volver a Tu Ruta
            </Button>
            <Button className="flex-1" onClick={() => void loadDayState()}>
              Reintentar
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!dayState.access.canAccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-lg space-y-5 rounded-[28px] border border-slate-700 bg-slate-950/70 p-7">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-slate-800 p-3">
              <Lock className="h-6 w-6 text-slate-400" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Día {dayNumber}
              </p>
              <h1 className="text-2xl font-bold text-white">
                Esta misión aún está bloqueada
              </h1>
            </div>
          </div>

          <ul className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-sm text-slate-300">
            {dayState.access.blockReasons.map((reason) => (
              <li key={reason} className="flex gap-2">
                <span className="text-amber-400">•</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>

          <p className="text-sm text-slate-500">
            Tu Ruta está disponible hasta el Día{' '}
            {dayState.access.highestUnlockedDay}.
          </p>

          <Button className="w-full" onClick={() => router.push('/despega/a2')}>
            Volver al día disponible
          </Button>
        </div>
      </div>
    )
  }

  const prevDay = dayNumber > 1 ? dayNumber - 1 : null
  const nextDay = dayNumber < 90 ? dayNumber + 1 : null
  const typeInfo = taskTypeLabels[mission.missionType] || taskTypeLabels.builder
  const checkpointCompleted = Boolean(dayState.checkpoint?.completed)
  const completionDisabled =
    isCompleting || (needsEvidence && !liveValidation.passed)

  const completeGenericDay = async () => {
    if (isCompleted && checkpoint) {
      router.push('/despega/a2')
      return
    }
    if (completionDisabled) return

    setIsCompleting(true)
    setCompletionError(null)
    setCompletionNotice(null)

    try {
      const result = await completeA2Day(
        dayNumber,
        needsEvidence ? submission : undefined,
      )
      onComplete?.()
      if (needsEvidence) window.localStorage.removeItem(draftKey)

      if (isCompleted) {
        await loadDayState()
        setCompletionNotice('El entregable actualizado quedó guardado.')
        return
      }

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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-[rgba(80,160,170,0.2)]">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-6">
          <div className="flex flex-wrap items-center gap-3">
            <Badge className="bg-purple-600/80 text-white">Día {dayNumber}</Badge>
            <Badge className={typeInfo.color}>
              {typeInfo.icon}
              <span className="ml-1">{typeInfo.label}</span>
            </Badge>
            <Badge className="border-cyan-500/35 bg-cyan-500/10 text-cyan-200">
              {dayState.adaptation.routeName}
            </Badge>
            {isCompleted && (
              <Badge className="border-emerald-500/40 bg-emerald-500/20 text-emerald-300">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Completado
              </Badge>
            )}
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
            className="text-white/80"
          >
            ← Volver a Tu Ruta
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-8 px-4 py-8">
        {isCompleted && (
          <section className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-emerald-200">
              <CheckCircle2 className="h-4 w-4" />
              Esta misión ya está registrada
            </p>
            <p className="mt-1 text-xs text-emerald-100/70">
              {dayState.completion?.validationStatus === 'legacy'
                ? 'Puedes revisarla; fue completada antes del sistema de evidencia.'
                : `Validación: ${dayState.completion?.validationStatus || 'completada'}${
                    typeof dayState.completion?.validation.score === 'number'
                      ? ` · ${dayState.completion.validation.score}/100`
                      : ''
                  }`}
            </p>
          </section>
        )}

        <A2RouteContextCard adaptation={dayState.adaptation} />

        {children ? (
          children
        ) : (
          <>
            <A2DailyMissionCard
              mission={mission}
              dayNumber={dayNumber}
              isCompleted={isCompleted}
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
              <section className="space-y-4 rounded-[28px] border border-blue-500/40 bg-blue-500/5 p-6">
                <h3 className="text-lg font-semibold text-blue-300">
                  Tu contexto en esta misión
                </h3>
                <div className="grid gap-4 md:grid-cols-3">
                  {routeContext.c1 && (
                    <div className="rounded-lg border border-[rgb(80,160,170)]/40 bg-slate-800/40 p-3">
                      <p className="text-xs uppercase tracking-wider text-slate-400">
                        Tu identidad
                      </p>
                      <p className="mt-2 font-medium text-white">
                        {routeContext.c1.targetRole || 'Rol en definición'}
                      </p>
                      <p className="mt-1 text-sm text-slate-400">
                        {routeContext.c1.industry || 'Industria en definición'}
                      </p>
                    </div>
                  )}
                  {routeContext.a1 && (
                    <div className="rounded-lg border border-[rgb(80,160,170)]/40 bg-slate-800/40 p-3">
                      <p className="text-xs uppercase tracking-wider text-slate-400">
                        Tu estilo
                      </p>
                      <p className="mt-2 font-medium capitalize text-white">
                        {routeContext.a1.communicationStyle || 'En construcción'}
                      </p>
                    </div>
                  )}
                  {routeContext.c2 && (
                    <div className="rounded-lg border border-[rgb(80,160,170)]/40 bg-slate-800/40 p-3">
                      <p className="text-xs uppercase tracking-wider text-slate-400">
                        Tu evidencia
                      </p>
                      <p className="mt-2 font-medium text-white">
                        {routeContext.c2.achievements?.length || 0} logros
                      </p>
                    </div>
                  )}
                </div>
              </section>
            )}

            <section className="space-y-4 rounded-[28px] border border-[rgba(80,160,170,0.2)] bg-purple-500/5 p-6">
              <h3 className="text-lg font-semibold text-purple-300">
                ¿Por qué es importante?
              </h3>
              <p className="leading-relaxed text-white/80">{mission.whyItMatters}</p>
            </section>

            {needsEvidence && draftReady && (
              <A2GenericMissionWorkspace
                mission={mission}
                value={submission}
                validation={liveValidation}
                adaptation={dayState.adaptation}
                onChange={(nextSubmission) => {
                  setSubmission(nextSubmission)
                  setCompletionNotice(null)
                }}
              />
            )}

            {needsEvidence && !draftReady && (
              <p className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 text-sm text-slate-400">
                Recuperando tu entregable…
              </p>
            )}

            {checkpoint && (
              <section className="space-y-4 rounded-[28px] border border-emerald-500/30 bg-emerald-500/5 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-emerald-300">
                      Checkpoint de Entrenamiento
                    </h3>
                    <p className="mt-2 leading-relaxed text-white/80">
                      {checkpointCompleted ? (
                        <>El módulo <strong>{checkpoint.moduleTitle}</strong> ya está completado.</>
                      ) : (
                        <>Completa <strong>{checkpoint.moduleTitle}</strong> y vuelve para validar este día.</>
                      )}
                    </p>
                  </div>
                  {checkpointCompleted ? (
                    <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-emerald-400" />
                  ) : (
                    <Zap className="h-6 w-6 flex-shrink-0 text-emerald-400" />
                  )}
                </div>
                {!checkpointCompleted && (
                  <Button
                    onClick={() => router.push(checkpoint.route)}
                    className="w-full border border-emerald-500/80 bg-emerald-600/80 py-6 text-white hover:bg-emerald-600"
                  >
                    Abrir {checkpoint.moduleTitle}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </section>
            )}
          </>
        )}

        {!children && (
          <footer className="space-y-3 border-t border-white/10 pt-6">
            {completionError && (
              <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200">
                {completionError}
              </p>
            )}
            {completionNotice && (
              <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">
                {completionNotice}
              </p>
            )}
            {needsEvidence && (
              <p className="text-center text-xs text-slate-500">
                {isCompleted
                  ? 'El entregable guardado se carga desde Tu Ruta y puede actualizarse.'
                  : 'El borrador se guarda automáticamente en este dispositivo.'}
              </p>
            )}
            <div className="flex gap-4">
              {prevDay && (
                <Button
                  onClick={() => router.push(`/despega/a2/dia-${prevDay}`)}
                  className="flex-1 border-2 bg-slate-950/40 py-6 text-cyan-300"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Anterior
                </Button>
              )}
              <Button
                onClick={completeGenericDay}
                disabled={completionDisabled}
                className="flex-1 border border-purple-500/80 bg-purple-600/80 py-6 text-white hover:bg-purple-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isCompleting
                  ? 'Guardando…'
                  : isCompleted && checkpoint
                    ? 'Volver a Tu Ruta'
                    : isCompleted
                      ? 'Actualizar entregable'
                      : checkpoint
                        ? 'Validar checkpoint'
                        : nextDay
                          ? 'Registrar y continuar'
                          : 'Completar ruta'}
                {!isCompleting && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </footer>
        )}
      </main>
    </div>
  )
}
