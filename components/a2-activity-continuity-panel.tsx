'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { BarChart3, Calendar, CheckCircle2, Clock } from 'lucide-react'

interface A2ActivityWindowDay {
  date: string
  count: number
  active: boolean
  isToday: boolean
}

interface A2ActivitySummaryResponse {
  success?: boolean
  timezone: string
  state: 'no_activity' | 'active_today' | 'active_yesterday' | 'paused'
  activeDays: number
  currentStreak: number
  longestStreak: number
  activeDaysLast7Days: number
  completionsLast7Days: number
  lastActivityAt: string | null
  lastActivityDate: string | null
  daysSinceLastActivity: number | null
  window: A2ActivityWindowDay[]
  error?: string
}

const EMPTY_ACTIVITY: A2ActivitySummaryResponse = {
  timezone: 'America/Santiago',
  state: 'no_activity',
  activeDays: 0,
  currentStreak: 0,
  longestStreak: 0,
  activeDaysLast7Days: 0,
  completionsLast7Days: 0,
  lastActivityAt: null,
  lastActivityDate: null,
  daysSinceLastActivity: null,
  window: [],
}

function activityMessage(activity: A2ActivitySummaryResponse): string {
  if (activity.state === 'active_today') {
    return 'Registraste actividad hoy. Tu progreso secuencial y tus entregables permanecen guardados.'
  }
  if (activity.state === 'active_yesterday') {
    return 'La continuidad calendario sigue activa; la última actividad fue ayer.'
  }
  if (activity.state === 'paused') {
    const days = activity.daysSinceLastActivity || 0
    return `La actividad está en pausa desde hace ${days} ${days === 1 ? 'día' : 'días'}. Nada de lo completado se pierde ni se bloquea.`
  }
  return 'Aún no hay actividad registrada. Tu Ruta comenzará a medir continuidad cuando completes la primera misión.'
}

function shortDate(date: string): string {
  const parsed = new Date(`${date}T12:00:00Z`)
  if (Number.isNaN(parsed.getTime())) return date
  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: 'short',
    timeZone: 'UTC',
  }).format(parsed)
}

export function A2ActivityContinuityPanel() {
  const pathname = usePathname()
  const [activity, setActivity] = useState<A2ActivitySummaryResponse>(EMPTY_ACTIVITY)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (pathname !== '/despega/a2') return

    let active = true
    setLoading(true)

    const loadActivity = async () => {
      try {
        const response = await fetch('/api/a2/activity', {
          credentials: 'include',
          cache: 'no-store',
        })
        const payload = (await response.json().catch(() => ({}))) as Partial<
          A2ActivitySummaryResponse
        >

        if (!response.ok) {
          throw new Error(payload.error || 'No pudimos cargar la continuidad.')
        }
        if (!active) return

        setActivity({
          ...EMPTY_ACTIVITY,
          ...payload,
          window: Array.isArray(payload.window) ? payload.window : [],
        })
        setError(null)
      } catch (loadError) {
        console.error('[v0] Error loading A2 activity continuity:', loadError)
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'No pudimos cargar la continuidad.',
          )
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadActivity()
    return () => {
      active = false
    }
  }, [pathname])

  if (pathname !== '/despega/a2') return null

  const metrics = [
    {
      label: 'Días con actividad',
      value: activity.activeDays,
      detail: 'Fechas reales con al menos una misión registrada',
      icon: <Calendar className="h-5 w-5 text-cyan-400" />,
    },
    {
      label: 'Continuidad actual',
      value: `${activity.currentStreak} ${activity.currentStreak === 1 ? 'día' : 'días'}`,
      detail: 'Se mantiene con actividad hoy o ayer',
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-400" />,
    },
    {
      label: 'Mayor continuidad',
      value: `${activity.longestStreak} ${activity.longestStreak === 1 ? 'día' : 'días'}`,
      detail: 'Mejor secuencia calendario observada',
      icon: <BarChart3 className="h-5 w-5 text-purple-400" />,
    },
    {
      label: 'Últimos 7 días',
      value: activity.completionsLast7Days,
      detail: `${activity.activeDaysLast7Days} días activos en la ventana`,
      icon: <Clock className="h-5 w-5 text-amber-400" />,
    },
  ]

  return (
    <section className="bg-slate-950 px-6 pt-6 text-white">
      <div className="mx-auto max-w-7xl rounded-2xl border border-cyan-500/25 bg-gradient-to-br from-cyan-500/10 via-slate-950 to-purple-500/10 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
              Continuidad real
            </p>
            <h2 className="mt-2 text-2xl font-bold">Actividad de Tu Ruta</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400">
              {activityMessage(activity)}
            </p>
          </div>
          <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1.5 text-xs text-slate-400">
            Zona horaria · Santiago
          </span>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-xl border border-white/5 bg-slate-950/55 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {metric.label}
                </p>
                {metric.icon}
              </div>
              <p className="mt-3 text-2xl font-bold text-white">{metric.value}</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {metric.detail}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-white/5 bg-slate-950/45 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-white">Ventana de 14 días</p>
            <p className="text-xs text-slate-500">
              La intensidad representa misiones registradas por fecha.
            </p>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-2 sm:grid-cols-14">
            {activity.window.map((day) => (
              <div key={day.date} className="space-y-1 text-center">
                <div
                  title={`${day.date}: ${day.count} ${day.count === 1 ? 'registro' : 'registros'}`}
                  className={`flex h-9 items-center justify-center rounded-lg border text-xs font-semibold transition ${
                    day.active
                      ? day.count >= 3
                        ? 'border-cyan-300/60 bg-cyan-400/35 text-cyan-50'
                        : day.count === 2
                          ? 'border-cyan-400/45 bg-cyan-500/25 text-cyan-100'
                          : 'border-cyan-500/35 bg-cyan-500/15 text-cyan-200'
                      : 'border-slate-800 bg-slate-900/50 text-slate-600'
                  } ${day.isToday ? 'ring-1 ring-purple-400/70' : ''}`}
                >
                  {day.count || '·'}
                </div>
                <p className="text-[10px] text-slate-600">{shortDate(day.date)}</p>
              </div>
            ))}
          </div>
        </div>

        {loading && (
          <p className="mt-4 text-xs text-slate-500">Calculando continuidad…</p>
        )}
        {error && <p className="mt-4 text-sm text-amber-300">{error}</p>}

        <p className="mt-5 border-t border-white/5 pt-4 text-xs leading-relaxed text-slate-500">
          La continuidad usa fechas reales de registro. No bloquea misiones, no
          elimina entregables y no modifica el avance secuencial de los Días 1–90.
        </p>
      </div>
    </section>
  )
}
