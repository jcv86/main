'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  Lock,
  Search,
  Unlock,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { A2_DAYS, type A2Day } from '@/lib/a2-days-config'

type PhaseFilter = 'all' | A2Day['phase']
type Horizon = 30 | 60 | 90

interface A2RouteSummary {
  id: string
  code: string
  name: string
  description: string | null
  durationDays: number
  source: string
}

interface A2ProgressResponse {
  current_day: number
  highest_unlocked_day: number
  progress_percentage: number
  completed_tasks: number
  completed_days: number[]
  total_tasks: number
  status: string
  route: A2RouteSummary | null
}

const EMPTY_PROGRESS: A2ProgressResponse = {
  current_day: 1,
  highest_unlocked_day: 1,
  progress_percentage: 0,
  completed_tasks: 0,
  completed_days: [],
  total_tasks: 90,
  status: 'not_started',
  route: null,
}

const PHASE_NAME: Record<A2Day['phase'], string> = {
  clarity: 'Claridad',
  material: 'Material',
  interview: 'Entrevista',
  'real-action': 'Acción Real',
  refinement: 'Refinamiento',
}

const PHASE_COLOR: Record<A2Day['phase'], string> = {
  clarity: 'bg-blue-600/10 text-blue-400 border-blue-500/30',
  material: 'bg-purple-600/10 text-purple-400 border-purple-500/30',
  interview: 'bg-fuchsia-600/10 text-fuchsia-300 border-fuchsia-500/30',
  'real-action': 'bg-green-600/10 text-green-400 border-green-500/30',
  refinement: 'bg-amber-600/10 text-amber-400 border-amber-500/30',
}

const HORIZONS: Array<{ value: Horizon; label: string }> = [
  { value: 30, label: 'Ciclo inicial · 30 días' },
  { value: 60, label: 'Extender · 60 días' },
  { value: 90, label: 'Ruta completa · 90 días' },
]

export default function A2DashboardPage() {
  const router = useRouter()
  const [filter, setFilter] = useState<PhaseFilter>('all')
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

        const data = (await response.json()) as A2ProgressResponse
        if (!active) return
        setProgress({
          ...EMPTY_PROGRESS,
          ...data,
          completed_days: Array.isArray(data.completed_days) ? data.completed_days : [],
        })
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

  const completedSet = useMemo(
    () => new Set(progress.completed_days),
    [progress.completed_days],
  )

  const filteredDays = useMemo(
    () =>
      Object.entries(A2_DAYS)
        .filter(([dayNumber, day]) => {
          const numericDay = Number(dayNumber)
          if (numericDay > horizon) return false
          if (filter !== 'all' && day.phase !== filter) return false
          if (search && !day.title.toLowerCase().includes(search.toLowerCase())) return false
          return true
        })
        .sort((left, right) => Number(left[0]) - Number(right[0])),
    [filter, horizon, search],
  )

  const completedInHorizon = progress.completed_days.filter((day) => day <= horizon).length
  const progressPercent = Math.min(100, Math.round((completedInHorizon / horizon) * 100))

  const phaseSummaries = [
    {
      key: 'clarity',
      days: '1–10',
      title: 'Claridad Profesional',
      description: 'Define dirección, foco y una hipótesis de avance concreta.',
      color: 'from-blue-600 to-cyan-600',
      visible: true,
    },
    {
      key: 'material',
      days: '11–30',
      title: 'Material y práctica',
      description: 'Convierte tu experiencia en evidencia, relato y práctica utilizable.',
      color: 'from-purple-600 to-pink-600',
      visible: true,
    },
    {
      key: 'real-action',
      days: '31–60',
      title: 'Acción Real',
      description: 'Lleva el trabajo a conversaciones, postulaciones y práctica aplicada.',
      color: 'from-green-600 to-emerald-600',
      visible: horizon >= 60,
    },
    {
      key: 'refinement',
      days: '61–90',
      title: 'Refinamiento',
      description: 'Integra resultados, fortalece brechas y consolida tu evolución.',
      color: 'from-amber-600 to-orange-600',
      visible: horizon >= 90,
    },
  ].filter((phase) => phase.visible)

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-400">
            A2 · Tu Ruta
          </p>
          <h1 className="text-4xl font-bold">Tu ciclo de avance</h1>
          <p className="max-w-3xl text-slate-400">
            {progress.route?.description ||
              'Comienza con un ciclo de 30 días y amplíalo cuando necesites más recorrido.'}
          </p>
          {progress.route && (
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <Badge className="border-cyan-500/30 bg-cyan-500/10 text-cyan-300">
                {progress.route.name}
              </Badge>
              <span className="text-xs text-slate-500">
                Seleccionada desde tu información de A1
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

        <section className="mb-8 rounded-lg border border-[rgb(80,160,170)] bg-slate-950 p-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">Tu progreso real</h2>
              <p className="text-sm text-slate-400">
                {completedInHorizon} de {horizon} días completados · Día actual{' '}
                {progress.current_day}
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

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar día…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded border border-[rgb(80,160,170)] bg-slate-950 px-4 py-2 pl-10 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {(
              [
                'all',
                'clarity',
                'material',
                'interview',
                'real-action',
                'refinement',
              ] as PhaseFilter[]
            ).map((phase) => (
              <button
                key={phase}
                type="button"
                onClick={() => setFilter(phase)}
                className={`whitespace-nowrap rounded px-4 py-2 text-sm font-medium transition-colors ${
                  filter === phase
                    ? 'bg-cyan-600 text-white'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {phase === 'all' ? 'Todos' : PHASE_NAME[phase]}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredDays.map(([dayNumber, day]) => {
            const numericDay = Number(dayNumber)
            const isUnlocked = numericDay <= progress.highest_unlocked_day
            const isCompleted = completedSet.has(numericDay)
            const isCurrent = numericDay === progress.current_day

            return (
              <button
                key={numericDay}
                id={`dia-${numericDay}`}
                type="button"
                onClick={() =>
                  isUnlocked && router.push(`/despega/a2/dia-${numericDay}`)
                }
                disabled={!isUnlocked}
                className={`group relative text-left transition-all duration-200 ${
                  isUnlocked
                    ? 'cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/20'
                    : 'cursor-not-allowed opacity-55'
                }`}
              >
                <div
                  className={`h-full rounded-lg border bg-slate-950 p-4 ${
                    isCurrent
                      ? 'border-cyan-400 ring-1 ring-cyan-400/30'
                      : 'border-[rgb(80,160,170)]'
                  }`}
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-cyan-400">
                        Día {numericDay}
                      </span>
                      {isCompleted && <CheckCircle2 className="h-5 w-5 text-green-400" />}
                    </div>
                    {!isUnlocked && <Lock className="h-4 w-4 text-slate-600" />}
                  </div>

                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <Badge className={`border ${PHASE_COLOR[day.phase]}`}>
                      {PHASE_NAME[day.phase]}
                    </Badge>
                    {isCurrent && (
                      <Badge className="border-cyan-400/40 bg-cyan-400/10 text-cyan-200">
                        Día actual
                      </Badge>
                    )}
                  </div>

                  <h3 className="mb-1 line-clamp-2 font-bold text-white">{day.title}</h3>
                  <p className="mb-3 line-clamp-2 text-sm text-slate-400">{day.subtitle}</p>

                  {day.unlocksA3Module && (
                    <div className="mb-3 rounded border border-green-600/30 bg-green-600/10 px-2 py-1">
                      <p className="flex items-center gap-1 text-xs font-medium text-green-400">
                        <Unlock className="h-3 w-3" />
                        Entrenamiento: {day.unlocksA3Module}
                      </p>
                    </div>
                  )}

                  <div className="flex items-end justify-between">
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Calendar className="h-3 w-3" />
                      {day.estimatedHours}h
                    </span>
                    {isUnlocked && (
                      <ChevronRight className="h-4 w-4 text-cyan-400 transition-transform group-hover:translate-x-1" />
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {phaseSummaries.map((phase) => (
            <div
              key={phase.key}
              className="rounded-lg border border-[rgb(80,160,170)] bg-slate-950 p-4"
            >
              <div className={`mb-3 h-1 w-full rounded-full bg-gradient-to-r ${phase.color}`} />
              <p className="mb-1 text-xs font-medium text-slate-400">Días {phase.days}</p>
              <h3 className="mb-2 text-sm font-bold text-white">{phase.title}</h3>
              <p className="text-xs text-slate-400">{phase.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
