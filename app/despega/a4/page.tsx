import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  FileText,
  Radar,
  ShieldCheck,
  Target,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { EvidencePulse } from '@/components/a4/evidence-pulse'
import { StrategicRadarWorkspace } from '@/components/a4/strategic-radar-workspace'
import { getJourneyForCurrentUser } from '@/lib/journey/service'
import { createAdminClient } from '@/lib/supabase/server'
import type { A4Decision, A4VerifiedSignal } from '@/lib/a4/strategic-radar'

function numberValue(value: unknown): number | null {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : null
}

function textValue(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function formatDate(value: unknown): string {
  if (typeof value !== 'string' || !value) return 'Sin fecha registrada'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Sin fecha registrada'
  return new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'long',
    timeZone: 'America/Santiago',
  }).format(date)
}

export default async function RadarEstrategicoPage() {
  const journey = await getJourneyForCurrentUser()
  if (!journey) redirect('/auth/signin')
  if (!journey.access.a4) redirect('/despega/a3')

  const supabase = createAdminClient()
  const userId = journey.user.id
  const [a3Result, documentsResult, signalsResult, decisionsResult] =
    await Promise.all([
      supabase
        .from('a3_session_attempts')
        .select('module_id,status,score,created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false }),
      supabase
        .from('dtc_documents')
        .select('id,title,type,status,created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20),
      supabase
        .from('a4_verified_signals')
        .select(
          'id,title,category,classification,summary,relevance,confidence,source_type,source_name,source_url,source_reference,source_date,status,created_at,updated_at',
        )
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(100),
      supabase
        .from('a4_decision_log')
        .select(
          'id,signal_id,decision,rationale,expected_evidence,status,review_on,outcome,reviewed_at,created_at,updated_at',
        )
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(100),
    ])

  if (a3Result.error) console.error('[v0] A4 A3 context error:', a3Result.error)
  if (documentsResult.error) {
    console.error('[v0] A4 document context error:', documentsResult.error)
  }
  if (signalsResult.error) console.error('[v0] A4 signal context error:', signalsResult.error)
  if (decisionsResult.error) {
    console.error('[v0] A4 decision context error:', decisionsResult.error)
  }

  const completedSessions = (a3Result.data ?? []).filter(
    (session) => session.status === 'completed',
  )
  const uniqueModules = new Set(
    completedSessions
      .map((session) => textValue(session.module_id))
      .filter(Boolean),
  )
  const scores = completedSessions
    .map((session) => numberValue(session.score))
    .filter((score): score is number => score !== null)
  const averageScore =
    scores.length > 0
      ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
      : null
  const documents = documentsResult.data ?? []
  const signals = (signalsResult.data ?? []) as A4VerifiedSignal[]
  const decisions = (decisionsResult.data ?? []) as A4Decision[]

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button asChild variant="ghost" className="text-slate-300">
              <Link href="/despega/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" /> Volver al panel
              </Link>
            </Button>
            <Badge className="border-rose-400/30 bg-rose-400/10 text-rose-200">
              Radar Estratégico · A4
            </Badge>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-300">
                Evidencia antes que opinión
              </p>
              <h1 className="mt-3 text-4xl font-bold md:text-6xl">
                Bitácora de Señales y Decisiones
              </h1>
              <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-300">
                Registra cambios relevantes, conserva su fuente y fecha, distingue hechos
                de hipótesis y deja cada decisión vinculada a una revisión futura. El Radar
                no inventa noticias, puntajes ni conclusiones para completar espacios vacíos.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 lg:min-w-72">
              <p className="flex items-center gap-2 font-semibold text-emerald-200">
                <CheckCircle2 className="h-5 w-5" /> Acceso verificado
              </p>
              <p className="mt-2 text-sm text-emerald-100/70">
                Habilitado por el cierre persistido de Entrenamiento.
              </p>
              <p className="mt-3 text-xs text-emerald-100/50">
                {formatDate(journey.state.a4UnlockedAt)}
              </p>
            </div>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: 'Módulos A3 verificados',
              value: `${uniqueModules.size}/10`,
              detail: `${completedSessions.length} sesiones persistidas`,
              icon: <Target className="h-5 w-5 text-emerald-400" />,
            },
            {
              label: 'Promedio de Entrenamiento',
              value: averageScore === null ? '—' : `${averageScore}/100`,
              detail: 'Calculado solo desde sesiones completadas',
              icon: <BarChart3 className="h-5 w-5 text-cyan-400" />,
            },
            {
              label: 'Documentos disponibles',
              value: documents.length,
              detail: 'Contexto persistido de A1, A2 y A3',
              icon: <FileText className="h-5 w-5 text-purple-400" />,
            },
            {
              label: 'Contrato de evidencia',
              value: 'Activo',
              detail: 'Fuente, fecha y clasificación obligatorias',
              icon: <ShieldCheck className="h-5 w-5 text-rose-300" />,
            },
          ].map((item) => (
            <Card key={item.label} className="border-slate-800 bg-slate-900/70">
              <CardContent className="space-y-3 p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-slate-400">{item.label}</p>
                  {item.icon}
                </div>
                <p className="text-3xl font-bold text-white">{item.value}</p>
                <p className="text-xs leading-relaxed text-slate-500">{item.detail}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <Card className="border-rose-400/25 bg-gradient-to-br from-rose-400/10 to-purple-500/5">
          <CardContent className="grid gap-4 p-6 md:grid-cols-3">
            {[
              ['1', 'Registrar', 'Describe una señal y conserva la evidencia que permite revisarla.'],
              ['2', 'Distinguir', 'Marca si es un hecho verificado o una hipótesis todavía abierta.'],
              ['3', 'Revisar', 'Vincula decisiones a evidencia futura y registra el resultado observado.'],
            ].map(([number, title, detail]) => (
              <div key={number} className="rounded-xl border border-white/10 bg-slate-950/35 p-4">
                <p className="text-xs font-semibold text-rose-300">PASO {number}</p>
                <p className="mt-2 font-semibold text-white">{title}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{detail}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <EvidencePulse signals={signals} decisions={decisions} />

        <StrategicRadarWorkspace
          initialSignals={signals}
          initialDecisions={decisions}
        />

        <Card className="border-slate-800 bg-slate-900/70">
          <CardContent className="flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="flex items-center gap-2 font-semibold text-white">
                <Radar className="h-5 w-5 text-rose-300" /> El Radar conserva el contexto
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">
                Puedes volver a Entrenamiento para revisar entregables. Las señales y
                decisiones permanecen separadas de los XP y no alteran resultados anteriores.
              </p>
            </div>
            <Button asChild variant="outline" className="shrink-0 border-white/20">
              <Link href="/despega/a3">Revisar Entrenamiento</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
