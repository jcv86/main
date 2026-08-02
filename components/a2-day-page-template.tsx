'use client'

import { useState } from 'react'
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
import { A2DailyMissionCard } from '@/components/a2-daily-mission-card'
import { getA3CheckpointForDay } from '@/lib/a3-checkpoint-map'

interface A2DayPageTemplateProps {
  dayNumber: number
  onComplete?: () => void
  children?: React.ReactNode
  mission?: { type: string; title: string; whyItMatters: string }
  userId?: string
  routeContext?: any
}

const taskTypeLabels: Record<
  string,
  { label: string; icon: React.ReactNode; color: string }
> = {
  learning: {
    label: 'Aprender',
    icon: <BookOpen className="h-4 w-4" />,
    color: 'bg-blue-500/20 text-blue-400',
  },
  practice: {
    label: 'Practicar',
    icon: <Wrench className="h-4 w-4" />,
    color: 'bg-yellow-500/20 text-yellow-400',
  },
  networking: {
    label: 'Conectar',
    icon: <Users className="h-4 w-4" />,
    color: 'bg-pink-500/20 text-pink-400',
  },
  planning: {
    label: 'Planificar',
    icon: <ClipboardList className="h-4 w-4" />,
    color: 'bg-purple-500/20 text-purple-400',
  },
  milestone: {
    label: 'Hito',
    icon: <Trophy className="h-4 w-4" />,
    color: 'bg-green-500/20 text-emerald-400',
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
  const configMission = A2_DAILY_MISSIONS[dayNumber]
  const mission = customMission ? { ...configMission, ...customMission } : configMission
  const checkpoint = getA3CheckpointForDay(dayNumber)

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
  const typeInfo = taskTypeLabels[mission.missionType] || taskTypeLabels.planning

  const completeGenericDay = async () => {
    if (isCompleting) return
    setIsCompleting(true)
    setCompletionError(null)

    try {
      const response = await fetch('/api/a2/complete-day', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ dayNumber }),
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error || 'No pudimos completar el día.')
      }

      onComplete?.()
      const resolvedNextDay = result.progression?.nextDay || nextDay
      router.push(
        resolvedNextDay
          ? `/despega/a2#dia-${resolvedNextDay}`
          : '/despega/a2',
      )
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
                  Checkpoint A3
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
              onStart={() => {
                console.log('[v0] Starting mission for day', dayNumber)
              }}
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

            {checkpoint && (
              <div className="space-y-4 rounded-[28px] border border-[rgba(80,160,170,0.2)] bg-emerald-500/5 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-emerald-300">
                      Checkpoint de Entrenamiento
                    </h3>
                    <p className="mt-2 leading-relaxed text-white/80">
                      Desde este día se habilita{' '}
                      <strong>
                        Módulo {checkpoint.moduleNumber}: {checkpoint.moduleTitle}
                      </strong>
                      .
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
                disabled={isCompleting}
                className="flex-1 rounded-full border border-purple-500/80 bg-purple-600/80 py-6 font-semibold text-white transition-all duration-200 hover:border-purple-500 hover:bg-purple-600 disabled:opacity-60"
              >
                {isCompleting ? 'Guardando…' : nextDay ? 'Completar día' : 'Completar ruta'}
                {!isCompleting && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
