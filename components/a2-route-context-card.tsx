'use client'

import { Compass, FileSearch, Route, Target } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { A2RouteAdaptation } from '@/lib/a2/route-adaptation'

interface A2RouteContextCardProps {
  adaptation: A2RouteAdaptation
  compact?: boolean
}

export function A2RouteContextCard({
  adaptation,
  compact = false,
}: A2RouteContextCardProps) {
  return (
    <section className="rounded-[28px] border border-cyan-500/25 bg-gradient-to-br from-cyan-500/10 via-slate-950/55 to-purple-500/10 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="border-cyan-500/35 bg-cyan-500/15 text-cyan-200">
              <Route className="mr-1 h-3.5 w-3.5" />
              {adaptation.routeName}
            </Badge>
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
              Enfoque de tu ruta
            </span>
          </div>
          <h2 className="mt-3 text-xl font-bold text-white">
            {adaptation.focus}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300">
            {adaptation.focusQuestion}
          </p>
        </div>
        <Compass className="h-7 w-7 flex-shrink-0 text-cyan-300" />
      </div>

      <div className={`mt-5 grid gap-4 ${compact ? '' : 'lg:grid-cols-2'}`}>
        <div className="rounded-xl border border-white/5 bg-slate-950/45 p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-purple-200">
            <FileSearch className="h-4 w-4" />
            Evidencia conectada con tu ruta
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            {adaptation.evidencePrompt}
          </p>
        </div>

        <div className="rounded-xl border border-white/5 bg-slate-950/45 p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-emerald-200">
            <Target className="h-4 w-4" />
            Aplicación observable
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            {adaptation.applicationPrompt}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Señales de calidad para esta misión
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {adaptation.qualitySignals.map((signal) => (
            <span
              key={signal}
              className="rounded-full border border-slate-700 bg-slate-900/65 px-3 py-1.5 text-xs text-slate-300"
            >
              {signal}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
