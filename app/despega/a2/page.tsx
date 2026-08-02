'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  FileCheck2,
  Gauge,
  Lock,
  Search,
  Trophy,
  Unlock,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { A2_DAILY_MISSIONS } from '@/lib/a2-missions-full'
import type { A2DailyMission, A2MissionType } from '@/lib/a2-mission.types'

type Horizon = 30 | 60 | 90
type MissionGroup =
  | 'all'
  | 'identity'
  | 'build'
  | 'market'
  | 'action'
  | 'training'
  | 'review'

interface A2RouteSummary {
  id: string
  code: string
  name: string
  description: string | null
  durationDays: number
  source: string
}

interface A2DayRecord {
  day: number
  mission_type: string | null
  validation_status: string
  score: number | null
  pass_score: number | null
  passed: boolean
  has_evidence: boolean
  artifact_url: string | null
  completed_at: string | null
}

interface A2ValidationSummary {
  validated_days: number
  evidence_days: number
  structural_days: number
  specialized_days: number
  checkpoint_days: number
  legacy_days: number
  average_score: number | null
}

interface A2ProgressResponse {
  current_day: number
  highest_unlocked_day: number
  progress_percentage: number
  completed_tasks: number
  completed_days: number[]
  day_records: A2DayRecord[]
  validation_summary: A2ValidationSummary
  total_tasks: number
  status: string
  route: A2RouteSummary | null
}

const EMPTY_SUMMARY: A2ValidationSummary = {
  validated_days: 0,
  evidence_days: 0,
  structural_days: 0,
  specialized_days: 0,
  checkpoint_days: 0,
  legacy_days: 0,
  average_score: null,
}

const EMPTY_PROGRESS: A2ProgressResponse = {
  current_day: 1,
  highest_unlocked_day: 1,
  progress_percentage: 0,
  completed_tasks: 0,
  completed_days: [],
  day_records: [],
  validation_summary: EMPTY_SUMMARY,
  total_tasks: 90,
  status: 'not_started',
  route: null,
}

const HORIZONS: Array<{ value: Horizon; label: string }> = [
  { value: 30, label: 'Ciclo inicial · 30 días' },
  { value: 60, label: 'Extensión · 60 días' },
  { value: 90, label: 'Integración · 90 días' },
]

const GROUP_LABEL: Record<MissionGroup, string> = {
  all: 'Todas',
  identity: 'Identidad',
  build: 'Construcción',
  market: 'Mercado',
  action: 'Acción real',
  training: 'Entrenamiento',
  review: 'Revisión e hitos',
}

const MISSION_TYPE_LABEL: Record<A2MissionType, string> = {
  roadmap_gate: 'Contrato',
  mirror: 'Autoconocimiento',
  evidence: 'Evidencia',
  builder: 'Construcción',
  market_intel: 'Mercado',
  coach_forge: 'Coach',
  field_action: 'Acción real',
  performance_drill: 'Práctica',
  a3_checkpoint: 'Entrenamiento',
  debrief: 'Reflexión',
  milestone: 'Hito',
}

const MISSION_TYPE_COLOR: Record<A2MissionType, string> = {
  roadmap_gate: 'border-purple-500/30 bg-purple-500/10 text-purple-300',
  mirror: 'border-blue-500/30 bg-blue-500/10 text-blue-300',
  evidence: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
  builder: 'border-purple-500/30 bg-purple-500/10 text-purple-300',
  market_intel: 'border-blue-500/30 bg-blue-500/10 text-blue-300',
  coach_forge: 'border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-300',
  field_action: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  performance_drill: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  a3_checkpoint: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  debrief: 'border-sky-500/30 bg-sky-500/10 text-sky-300',
  milestone: 'border-orange-500/30 bg-orange-500/10 text-orange-300',
}

const PHASE_LABEL: Record<A2DailyMission['phaseLabel'], string> = {
  Foundation: 'Fundamentos',
  'Role Alignment': 'Alineación con el rol',
  'Simulation & Certification': 'Simulación y certificación',
  'Master Difficult Questions & Return to Real Market':
    'Preguntas difíciles y regreso al mercado',
  'Final Applications & Offer Management':
    'Postulaciones y gestión de ofertas',
  'Final A3 Prep & Checkpoint': 'Preparación final de Entrenamiento',
  'Final Review & Next Chapter': 'Cierre y siguiente capítulo',
}

function groupForMission(type: A2MissionType): Exclude<MissionGroup, 'all'> {
  if (type === 'mirror' || type === 'roadmap_gate') return 'identity'
  if (type === 'evidence' || type === 'builder' || type === 'coach_forge') {
    return 'build'
  }
  if (type === 'market_intel') return 'market'
  if (type === 'field_action' || type === 'performance_drill') return 'action'
  if (type === 'a3_checkpoint') return 'training'
  return 'review'
}

function validationLabel(record: A2DayRecord | undefined): string | null {
  if (!record) return null
  if (record.validation_status === 'checkpoint') return 'Checkpoint validado'
  if (record.validation_status === 'legacy') return 'Completado anteriormente'
  if (record.score !== null) return `Entregable validado · ${record.score}/100`
  return 'Entregable validado'
}

function horizonForDay(day: number): Horizon {
  if (day > 60) return 90
  if (day > 30) return 60
  return 30
}

export default function A2DashboardPage() {
  const router = useRouter()
  const [group, setGroup] = useState<MissionGroup>('all')
  const [search, setSearch] = useState('')
  const [horizon, setHorizon] = useState<Horizon>(30)
  const [progress, setProgress] = useState<A2ProgressResponse>(EMPTY_PROGRESS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    const loadProgress = async () => {
      try {
        const response = await fetch('/api/a2/progress', {
          credentials: 'include',
          cache: 'no-store',
        })
        if (!response.ok) throw new Error('No pudimos cargar Tu Ruta')

        const data = (await response.json()) as Partial<A2ProgressResponse>
        if (!active) return

        const normalized: A2ProgressResponse = {
          ...EMPTY_PROGRESS,
          ...data,
          completed_days: Array.isArray(data.completed_days)
            ? data.completed_days
            : [],
          day_records: Array.isArray(data.day_records) ? data.day_records : [],
          validation_summary: {
            ...EMPTY_SUMMARY,
            ...(data.validation_summary || {}),
          },
        }
        setProgress(normalized)
        setHorizon((current) =>
          Math.max(current, horizonForDay(normalized.current_day)) as Horizon,
        )
        setError(null)
      } catch (loadError) {
        console.error('[v0] Error loading A2 dashboard:', loadError)
        if (active) setError('No pudimos cargar tu avance. Intenta nuevamente.')
      } finally {
        if (active) setLoading(false)
      }
    }

    loadProgress()
    return () => {
      active = false
    }
  }, [])

  const recordByDay = useMemo(
    () => new Map(progress.day_records.map((record) => [record.day, record])),
    [progress.day_records],
  )

  const missions = useMemo(
    () =>
      Object.values(A2_DAILY_MISSIONS)
        .filter((mission) => mission.day <= horizon)
        .filter(
          (mission) =>
            group === 'all' || groupForMission(mission.missionType) === group,
        )
        .filter((mission) => {
          const query = search.trim().toLowerCase()
          if (!query) return true
          return [
            mission.title,
            mission.subtitle,
            mission.userGoal,
            mission.deliverable,
          ].some((value) => value.toLowerCase().includes(query))
        })
        .sort((left, right) => left.day - right.day),
    [group, horizon, search],
  )

  const recordsInHorizon = progress.day_records.filter(
    (record) => record.day <= horizon,
  )
  const completedInHorizon = recordsInHorizon.length
  const validatedInHorizon = recordsInHorizon.filter((record) =>
    ['structural', 'specialized', 'checkpoint'].includes(record.validation_status),
  ).length
  const evidenceInHorizon = recordsInHorizon.filter(
    (record) => record.has_evidence,
  ).length
  const checkpointsInHorizon = recordsInHorizon.filter(
    (record) => record.validation_status === 'checkpoint',
  ).length
  const scoredInHorizon = recordsInHorizon.filter(
    (record) => record.score !== null && record.validation_status !== 'legacy',
  )
  const averageScore =
    scoredInHorizon.length > 0
      ? Math.round(
          scoredInHorizon.reduce(
            (sum, record) => sum + (record.score || 0),
            0,
          ) / scoredInHorizon.length,
        )
      : null
  const progressPercent = Math.min(
    100,
    Math.round((completedInHorizon / horizon) * 100),
  )

  const stats = [
    {
      label: 'Días completados',
      value: `${completedInHorizon}/${horizon}`,
      description: `${progressPercent}% del horizonte seleccionado`,
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-400" />,
    },
    {
      label: 'Entregables validados',
      value: validatedInHorizon,
      description: `${evidenceInHorizon} con evidencia guardada`,
      icon: <ClipboardCheck className="h-5 w-5 text-cyan-400" />,
    },
    {
      label: 'Checkpoints completados',
      value: checkpointsInHorizon,
      description: 'Módulos de Entrenamiento integrados',
      icon: <Trophy className="h-5 w-5 text-amber-400" />,
    },
    {
      label: 'Puntaje promedio',
      value: averageScore === null ? '—' : `${averageScore}/100`,
      description: 'Solo evaluaciones con puntaje',
      icon: <Gauge className="h-5 w-5 text-purple-400" />,
    },
  ]

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-400">
            Tu Ruta
          </p>
          <h1 className="text-4xl font-bold">Tu ciclo de avance</h1>
          <p className="max-w-3xl text-slate-400">
            {progress.route?.description ||
              'Comienza con un ciclo de 30 días y extiéndelo a 60 o 90 según tu contexto y resultados.'}
          </p>
          {progress.route && (
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <Badge className="border-cyan-500/30 bg-cyan-500/10 text-cyan-300">
                {progress.route.name}
              </Badge>
              <span className="text-xs text-slate-500">
                Seleccionada desde tu diagnóstico de Despega Cerebral
              </span>
            </div>
          )}
        </header>

        <div className="mb-6 flex flex-wrap gap-2">
          {HORIZONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setHorizon(option.value)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                horizon === option.value
                  ? 'border-cyan-400 bg-cyan-500/15 text-cyan-200'
                  : 'border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <section className="mb-6 rounded-xl border border-[rgb(80,160,170)] bg-slate-950 p-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">Tu progreso verificable</h2>
              <p className="text-sm text-slate-400">
                Día actual {progress.current_day} · Disponible hasta el Día{' '}
                {progress.highest_unlocked_day}
              </p>
            </div>
            <p className="text-3xl font-bold text-cyan-400">{progressPercent}%</p>
          </div>
          <div className="h-3 w-full rounded-full bg-slate-900">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {loading && <p className="mt-3 text-xs text-slate-500">Cargando avance…</p>}
          {error && <p className="mt-3 text-sm text-amber-300">{error}</p>}
        </section>

        <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-slate-800 bg-slate-900/40 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {stat.label}
                </p>
                {stat.icon}
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="mt-1 text-xs text-slate-500">{stat.description}</p>
            </div>
          ))}
        </section>

        <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
            <input
              type="search"
              placeholder="Buscar por misión, objetivo o entregable…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-lg border border-[rgb(80,160,170)] bg-slate-950 px-4 py-2 pl-10 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {(Object.keys(GROUP_LABEL) as MissionGroup[]).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setGroup(option)}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  group === option
                    ? 'bg-cyan-600 text-white'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {GROUP_LABEL[option]}
              </button>
            ))}
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {missions.map((mission) => {
            const record = recordByDay.get(mission.day)
            const isUnlocked = mission.day <= progress.highest_unlocked_day
            const isCompleted = Boolean(record)
            const isCurrent = mission.day === progress.current_day
            const validation = validationLabel(record)

            return (
              <button
                key={mission.day}
                id={`dia-${mission.day}`}
                type="button"
                onClick={() =>
                  isUnlocked && router.push(`/despega/a2/dia-${mission.day}`)
                }
                disabled={!isUnlocked}
                className={`group relative text-left transition-all duration-200 ${
                  isUnlocked
                    ? 'cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/15'
                    : 'cursor-not-allowed opacity-55'
                }`}
              >
                <div
                  className={`h-full rounded-xl border bg-slate-950 p-4 ${
                    isCurrent
                      ? 'border-cyan-400 ring-1 ring-cyan-400/30'
                      : isCompleted
                        ? 'border-emerald-500/30'
                        : 'border-[rgb(80,160,170)]'
                  }`}
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-cyan-400">
                        Día {mission.day}
                      </span>
                      {isCompleted && (
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      )}
                    </div>
                    {!isUnlocked && <Lock className="h-4 w-4 text-slate-600" />}
                  </div>

                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <Badge
                      className={`border ${MISSION_TYPE_COLOR[mission.missionType]}`}
                    >
                      {MISSION_TYPE_LABEL[mission.missionType]}
                    </Badge>
                    {isCurrent && (
                      <Badge className="border-cyan-400/40 bg-cyan-400/10 text-cyan-200">
                        Día actual
                      </Badge>
                    )}
                  </div>

                  <h3 className="mb-1 line-clamp-2 font-bold text-white">
                    {mission.title}
                  </h3>
                  <p className="mb-3 line-clamp-2 text-sm text-slate-400">
                    {mission.subtitle}
                  </p>

                  {validation && (
                    <div
                      className={`mb-3 rounded-lg border px-3 py-2 ${
                        record?.validation_status === 'legacy'
                          ? 'border-slate-700 bg-slate-900/60 text-slate-400'
                          : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                      }`}
                    >
                      <p className="flex items-center gap-2 text-xs font-medium">
                        {record?.has_evidence ? (
                          <FileCheck2 className="h-4 w-4" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4" />
                        )}
                        {validation}
                      </p>
                    </div>
                  )}

                  {mission.a3Checkpoint && (
                    <div className="mb-3 rounded-lg border border-emerald-600/30 bg-emerald-600/10 px-3 py-2">
                      <p className="flex items-center gap-1 text-xs font-medium text-emerald-300">
                        <Unlock className="h-3 w-3" />
                        Entrenamiento: {mission.a3Checkpoint.moduleTitle}
                      </p>
                    </div>
                  )}

                  <p className="mb-3 line-clamp-2 text-xs text-slate-500">
                    Entregable: {mission.deliverable}
                  </p>

                  <div className="flex items-end justify-between gap-3">
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Calendar className="h-3 w-3" />
                      {mission.estimatedMinutes.min}-{mission.estimatedMinutes.max} min
                    </span>
                    <span className="line-clamp-1 text-right text-xs text-slate-600">
                      {PHASE_LABEL[mission.phaseLabel]}
                    </span>
                    {isUnlocked && (
                      <ChevronRight className="h-4 w-4 flex-shrink-0 text-cyan-400 transition-transform group-hover:translate-x-1" />
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </section>

        {missions.length === 0 && (
          <p className="rounded-xl border border-slate-800 bg-slate-900/30 p-8 text-center text-slate-400">
            No encontramos misiones con esos filtros.
          </p>
        )}
      </div>
    </div>
  )
}
