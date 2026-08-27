'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import {
  ArrowRight,
  CheckCircle2,
  Circle,
  Lock,
  Map,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

interface CycleProgress {
  month: number
  percentage: number
  completed: boolean
}

interface A2ProgressData {
  current_month: number
  current_day: number
  highest_unlocked_day: number
  progress_percentage: number
  completed_tasks: number
  total_tasks: number
  status: string
  month_progress: CycleProgress[]
}

const CYCLES = [
  {
    number: 1,
    name: 'Ciclo inicial',
    range: 'Días 1–30',
    description: 'Convierte tu diagnóstico en una primera misión concreta.',
  },
  {
    number: 2,
    name: 'Extensión a 60 días',
    range: 'Días 31–60',
    description: 'Profundiza lo que está funcionando y corrige fricciones.',
  },
  {
    number: 3,
    name: 'Integración a 90 días',
    range: 'Días 61–90',
    description: 'Integra práctica, evidencia y decisiones de largo alcance.',
  },
] as const

async function fetcher(url: string): Promise<A2ProgressData> {
  const response = await fetch(url, {
    credentials: 'include',
    cache: 'no-store',
  })
  if (!response.ok) throw new Error('No pudimos cargar el progreso de Tu Ruta.')
  return response.json()
}

export function A2ProgressSidebar() {
  const [expandedCycle, setExpandedCycle] = useState(1)
  const { data, error, isLoading } = useSWR<A2ProgressData>(
    '/api/a2/progress',
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval: 0,
      dedupingInterval: 5000,
    },
  )

  useEffect(() => {
    if (data?.current_month) setExpandedCycle(data.current_month)
  }, [data?.current_month])

  if (isLoading) {
    return (
      <aside className="hidden h-screen w-72 border-r bg-muted/5 p-6 lg:block">
        <div className="space-y-4 animate-pulse">
          <div className="h-5 w-2/3 rounded bg-muted/50" />
          <div className="h-2 rounded bg-muted/40" />
          {[1, 2, 3].map((cycle) => (
            <div key={cycle} className="h-24 rounded-xl bg-muted/30" />
          ))}
        </div>
      </aside>
    )
  }

  if (error || !data) {
    return (
      <aside className="hidden h-screen w-72 border-r bg-muted/5 p-6 lg:block">
        <p className="text-sm font-medium">Tu Ruta</p>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          No pudimos cargar el progreso. Puedes continuar desde el dashboard.
        </p>
        <Button asChild variant="outline" size="sm" className="mt-4 w-full">
          <Link href="/despega/a2">Volver a Tu Ruta</Link>
        </Button>
      </aside>
    )
  }

  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 overflow-y-auto border-r bg-muted/5 p-6 lg:block">
      <div className="space-y-6">
        <header>
          <div className="flex items-center gap-2 text-primary">
            <Map className="h-5 w-5" />
            <h2 className="font-semibold">Tu Ruta</h2>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Comienza con 30 días y expande el recorrido según tu avance.
          </p>
        </header>

        <section className="space-y-2" aria-label="Progreso general de Tu Ruta">
          <div className="flex items-center justify-between text-xs">
            <span>Día {data.current_day}</span>
            <span className="font-semibold text-primary">
              {data.progress_percentage}%
            </span>
          </div>
          <Progress value={data.progress_percentage} />
          <p className="text-xs text-muted-foreground">
            {data.completed_tasks} de {data.total_tasks} días completados
          </p>
        </section>

        <nav className="space-y-3" aria-label="Ciclos de Tu Ruta">
          {CYCLES.map((cycle, index) => {
            const progress = data.month_progress?.[index] ?? {
              month: cycle.number,
              percentage: 0,
              completed: false,
            }
            const active = data.current_month === cycle.number
            const available = cycle.number <= data.current_month || progress.completed
            const expanded = expandedCycle === cycle.number

            return (
              <div key={cycle.number} className="rounded-xl border bg-background/40">
                <button
                  type="button"
                  onClick={() => available && setExpandedCycle(cycle.number)}
                  className="flex w-full items-start gap-3 p-4 text-left"
                  aria-expanded={expanded}
                  disabled={!available}
                >
                  <span className="mt-0.5 text-primary">
                    {progress.completed ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : active ? (
                      <Circle className="h-5 w-5 fill-primary/20" />
                    ) : (
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">{cycle.name}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {cycle.range}
                    </span>
                    <span className="mt-3 block">
                      <Progress value={progress.percentage} className="h-1.5" />
                    </span>
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {progress.percentage}%
                  </span>
                </button>

                {expanded && available && (
                  <div className="border-t px-4 py-3">
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {cycle.description}
                    </p>
                    {active && (
                      <p className="mt-2 text-xs font-medium text-primary">
                        Ciclo actual
                      </p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        <Button asChild className="w-full">
          <Link href={`/despega/a2/dia-${data.highest_unlocked_day}`}>
            Continuar día {data.highest_unlocked_day}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </aside>
  )
}
