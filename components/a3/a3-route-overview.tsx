'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Loader2,
  Lock,
  MapPin,
  Play,
  RotateCcw,
  Target,
  Trophy,
} from 'lucide-react'
import { A2ProgressDisplay } from '@/components/a2-progress-display'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  A3_MODULES,
  A3_TOTAL_XP,
  type A3ModuleId,
} from '@/lib/a3/module-catalog'
import { A3_ROUTE_OVERVIEW } from '@/lib/a3/route-overview'

type ModuleStatus = 'locked' | 'available' | 'in_progress' | 'completed'

interface A3AccessState {
  moduleId: A3ModuleId
  moduleName: string
  moduleNumber: number
  checkpointDay: number
  status: ModuleStatus
  reason: string
  prerequisitesCompleted: boolean
  day1PresentationMet: boolean
  currentDayMet: boolean
}

interface A3ModuleResult {
  bestScore: number
  totalAttempts: number
  completedAt: string | null
}

interface A3RouteState {
  currentModuleNumber: number
  totalCompleted: number
  canReplayModules7To10: boolean
  advancedUnlockedAt: string | null
  proUnlockedAt: string | null
  routeCompletedAt: string | null
}

interface A3ProgressPayload {
  totalXp: number
  maxXp: number
  progressPct: number
  completedModules: number
  totalModules: number
  moduleStates: Record<string, ModuleStatus>
  completedModuleIds: A3ModuleId[]
  accessStates: A3AccessState[]
  moduleResults: Partial<Record<A3ModuleId, A3ModuleResult>>
  nextAvailableModuleId: A3ModuleId | null
  a2CurrentDay: number
  route: A3RouteState
}

interface ProgressResponse {
  success?: boolean
  progress?: A3ProgressPayload
  error?: string
}

const EMPTY_ROUTE: A3RouteState = {
  currentModuleNumber: 1,
  totalCompleted: 0,
  canReplayModules7To10: false,
  advancedUnlockedAt: null,
  proUnlockedAt: null,
  routeCompletedAt: null,
}

const EMPTY_PROGRESS: A3ProgressPayload = {
  totalXp: 0,
  maxXp: A3_TOTAL_XP,
  progressPct: 0,
  completedModules: 0,
  totalModules: A3_MODULES.length,
  moduleStates: Object.fromEntries(A3_MODULES.map((module) => [module.id, 'locked'])),
  completedModuleIds: [],
  accessStates: [],
  moduleResults: {},
  nextAvailableModuleId: null,
  a2CurrentDay: 1,
  route: EMPTY_ROUTE,
}

function dateLabel(value: string | null): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function statusBadge(status: ModuleStatus) {
  if (status === 'completed') {
    return <Badge className="border-emerald-500/30 bg-emerald-500/10 text-emerald-300">Completado</Badge>
  }
  if (status === 'in_progress') {
    return <Badge className="border-cyan-500/30 bg-cyan-500/10 text-cyan-300">En progreso</Badge>
  }
  if (status === 'available') {
    return <Badge className="border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-300">Disponible</Badge>
  }
  return <Badge variant="outline" className="text-muted-foreground">Bloqueado</Badge>
}

function missingPrerequisiteNames(moduleId: A3ModuleId, completed: A3ModuleId[]): string[] {
  const module = A3_MODULES.find((item) => item.id === moduleId)
  if (!module) return []
  return module.requiredPreviousModules
    .filter((id) => !completed.includes(id))
    .map((id) => A3_MODULES.find((item) => item.id === id)?.title || id)
}

function blockedReasons(
  moduleId: A3ModuleId,
  access: A3AccessState | undefined,
  progress: A3ProgressPayload,
): string[] {
  if (!access || access.status !== 'locked') return []
  const reasons: string[] = []
  if (!access.day1PresentationMet) {
    reasons.push('Completa y aprueba el Día 1 de Tu Ruta.')
  }
  if (!access.currentDayMet) {
    reasons.push(`Se habilita en el Día ${access.checkpointDay}; actualmente vas en el Día ${progress.a2CurrentDay}.`)
  }
  if (!access.prerequisitesCompleted) {
    const missing = missingPrerequisiteNames(moduleId, progress.completedModuleIds)
    if (missing.length) reasons.push(`Completa primero: ${missing.join(', ')}.`)
  }
  return reasons.length ? reasons : [access.reason || 'Este módulo todavía no está disponible.']
}

export function A3RouteOverview() {
  const [progress, setProgress] = useState<A3ProgressPayload>(EMPTY_PROGRESS)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [completedNotice, setCompletedNotice] = useState<A3ModuleId | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const completed = params.get('completed')
    if (completed && A3_MODULES.some((module) => module.id === completed)) {
      setCompletedNotice(completed as A3ModuleId)
    }

    fetch('/api/a3/user-progress', {
      credentials: 'include',
      cache: 'no-store',
    })
      .then(async (response) => {
        const payload = (await response.json().catch(() => ({}))) as ProgressResponse
        if (!response.ok || !payload.progress) {
          throw new Error(payload.error || 'No pudimos cargar tu progreso de Entrenamiento.')
        }
        setProgress(payload.progress)
      })
      .catch((error) => {
        setLoadError(
          error instanceof Error
            ? error.message
            : 'No pudimos cargar tu progreso de Entrenamiento.',
        )
      })
      .finally(() => setLoading(false))
  }, [])

  const accessByModule = useMemo(
    () =>
      Object.fromEntries(
        progress.accessStates.map((state) => [state.moduleId, state]),
      ) as Partial<Record<A3ModuleId, A3AccessState>>,
    [progress.accessStates],
  )

  const nextModule = A3_MODULES.find(
    (module) => module.id === progress.nextAvailableModuleId,
  )
  const routeCompleted = Boolean(progress.route.routeCompletedAt) ||
    progress.completedModules === A3_MODULES.length
  const completedModule = completedNotice
    ? A3_MODULES.find((module) => module.id === completedNotice)
    : null

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p>Cargando tu ruta de Entrenamiento…</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl space-y-8 px-4 py-8 sm:py-12">
        <div>
          <Link href="/despega">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Despega
            </Button>
          </Link>
        </div>

        <section className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-3xl space-y-3">
              <Badge variant="outline">A3 · Entrenamiento</Badge>
              <h1 className="text-3xl font-bold sm:text-4xl">Ruta básica de preparación para entrevistas</h1>
              <p className="text-base text-muted-foreground sm:text-lg">
                Diez módulos conectados que transforman tu experiencia en evidencia, respuestas practicadas y una entrevista final verificable.
              </p>
            </div>
            <div className="rounded-xl border bg-card p-4 text-sm sm:min-w-52">
              <p className="text-muted-foreground">Estado observado</p>
              <p className="mt-1 text-lg font-semibold">
                {routeCompleted ? 'Ruta básica completada' : nextModule ? nextModule.title : 'Sin módulo disponible'}
              </p>
            </div>
          </div>
        </section>

        {completedModule ? (
          <Card className="border-emerald-500/30 bg-emerald-500/5 p-5">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-400" />
              <div>
                <p className="font-semibold">{completedModule.title} registrado</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Tu puntaje, entregable y progreso fueron actualizados. Las repeticiones no vuelven a entregar XP.
                </p>
              </div>
            </div>
          </Card>
        ) : null}

        {loadError ? (
          <Card className="border-destructive/30 bg-destructive/5 p-5">
            <p className="flex items-center gap-2 font-medium text-destructive">
              <AlertCircle className="h-5 w-5" /> {loadError}
            </p>
          </Card>
        ) : null}

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Tu Ruta</p>
            <p className="mt-1 text-2xl font-bold">Día {progress.a2CurrentDay}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Módulos</p>
            <p className="mt-1 text-2xl font-bold">{progress.completedModules}/{progress.totalModules}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">XP verificado</p>
            <p className="mt-1 text-2xl font-bold">{progress.totalXp}/{progress.maxXp}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Avance</p>
            <p className="mt-1 text-2xl font-bold">{progress.progressPct}%</p>
          </Card>
        </section>

        <Card className="space-y-3 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold">Progreso verificado de A3</p>
              <p className="text-sm text-muted-foreground">Calculado desde completitudes y XP persistidos.</p>
            </div>
            <Badge variant={routeCompleted ? 'default' : 'secondary'}>
              {routeCompleted ? 'Cerrada' : 'Activa'}
            </Badge>
          </div>
          <Progress value={progress.progressPct} />
        </Card>

        {routeCompleted ? (
          <Card className="space-y-4 border-fuchsia-500/30 bg-fuchsia-500/5 p-6">
            <div className="flex items-start gap-3">
              <Trophy className="mt-1 h-6 w-6 text-fuchsia-300" />
              <div className="space-y-2">
                <h2 className="text-xl font-bold">Ruta básica completada</h2>
                <p className="text-muted-foreground">
                  El cierre quedó registrado{progress.route.routeCompletedAt ? ` el ${dateLabel(progress.route.routeCompletedAt)}` : ''}. Puedes repetir cualquier módulo completado para mejorar tu mejor puntaje; una repetición no duplica XP.
                </p>
                {progress.route.proUnlockedAt ? (
                  <Badge className="border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-200">
                    Desbloqueo Pro registrado
                  </Badge>
                ) : null}
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link href="/despega/a3/first-recruiter-simulation" className="sm:flex-1">
                <Button variant="outline" className="w-full">Repetir primera simulación</Button>
              </Link>
              <Link href="/despega/a3/basic-interview-mission" className="sm:flex-1">
                <Button className="w-full">Repetir misión final</Button>
              </Link>
            </div>
          </Card>
        ) : nextModule ? (
          <Card className="border-fuchsia-500/20 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Siguiente módulo disponible</p>
                <p className="mt-1 text-xl font-semibold">{nextModule.number}. {nextModule.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">Checkpoint Día {nextModule.checkpointDay} · {nextModule.xp} XP</p>
              </div>
              <Link href={nextModule.route}>
                <Button className="w-full sm:w-auto"><Play className="mr-2 h-4 w-4" /> Continuar ruta</Button>
              </Link>
            </div>
          </Card>
        ) : null}

        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-fuchsia-300" />
            <h2 className="text-2xl font-bold">Checkpoints conectados con Tu Ruta</h2>
          </div>
          <A2ProgressDisplay />
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold">Los 10 módulos</h2>
            <p className="mt-1 text-muted-foreground">
              La disponibilidad proviene del servidor y considera Día 1, checkpoint de Tu Ruta y prerrequisitos completados.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {A3_MODULES.map((module) => {
              const access = accessByModule[module.id]
              const status = access?.status || progress.moduleStates[module.id] || 'locked'
              const overview = A3_ROUTE_OVERVIEW[module.id]
              const result = progress.moduleResults[module.id]
              const reasons = blockedReasons(module.id, access, progress)
              const completed = status === 'completed'
              const unlocked = status === 'available' || status === 'in_progress' || completed

              return (
                <Card
                  key={module.id}
                  className={`flex flex-col p-5 ${status === 'locked' ? 'opacity-75' : ''}`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border bg-muted/30 font-bold">
                        {completed ? <CheckCircle2 className="h-5 w-5 text-emerald-400" /> : status === 'locked' ? <Lock className="h-4 w-4" /> : module.number}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">Módulo {module.number}</p>
                          {statusBadge(status)}
                        </div>
                        <h3 className="mt-1 text-lg font-semibold">{module.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{overview.outcome}</p>
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-2 text-xs sm:flex-col sm:items-end">
                      <Badge variant="outline">Día {module.checkpointDay}</Badge>
                      <Badge variant="outline">{module.xp} XP</Badge>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 rounded-lg border bg-muted/10 p-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-medium uppercase text-muted-foreground">Evidencia que construyes</p>
                      <p className="mt-1 text-sm">{overview.evidence}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase text-muted-foreground">Forma de práctica</p>
                      <p className="mt-1 text-sm">{overview.practiceMode}</p>
                    </div>
                  </div>

                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    {overview.requirements.map((requirement) => (
                      <li key={requirement} className="flex gap-2">
                        <Target className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>{requirement}</span>
                      </li>
                    ))}
                  </ul>

                  {result ? (
                    <div className="mt-4 flex flex-wrap gap-2 text-xs">
                      <Badge variant="secondary">Mejor puntaje: {result.bestScore}/100</Badge>
                      <Badge variant="secondary">Intentos: {result.totalAttempts}</Badge>
                      {result.completedAt ? <Badge variant="secondary">Completado: {dateLabel(result.completedAt)}</Badge> : null}
                    </div>
                  ) : null}

                  {reasons.length ? (
                    <div className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
                      <p className="flex items-center gap-2 text-sm font-medium text-amber-200">
                        <Clock3 className="h-4 w-4" /> Pendiente para desbloquear
                      </p>
                      <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                        {reasons.map((reason) => <li key={reason}>• {reason}</li>)}
                      </ul>
                    </div>
                  ) : null}

                  <div className="mt-auto pt-5">
                    {unlocked ? (
                      <Link href={module.route}>
                        <Button className="w-full">
                          {completed ? <RotateCcw className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                          {completed ? 'Repetir módulo' : status === 'in_progress' ? 'Continuar módulo' : 'Comenzar módulo'}
                        </Button>
                      </Link>
                    ) : (
                      <Button disabled className="w-full"><Lock className="mr-2 h-4 w-4" /> Módulo bloqueado</Button>
                    )}
                  </div>
                </Card>
              )
            })}
          </div>
        </section>

        <Card className="p-5">
          <h2 className="font-semibold">Cómo se registra el progreso</h2>
          <div className="mt-4 grid gap-4 text-sm text-muted-foreground sm:grid-cols-3">
            <p><strong className="text-foreground">1. Acceso.</strong> Cada módulo verifica Día 1, checkpoint y prerrequisitos en el servidor.</p>
            <p><strong className="text-foreground">2. Evidencia.</strong> El módulo exige un entregable y un puntaje mínimo de 75/100.</p>
            <p><strong className="text-foreground">3. Persistencia.</strong> Sesión, puntaje, progreso y XP se guardan juntos; repetir no duplica XP.</p>
          </div>
        </Card>
      </div>
    </main>
  )
}
