import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft, ArrowRight, Dumbbell, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PrintReportButton } from '@/components/reports/print-report-button'
import { getJourneyForCurrentUser } from '@/lib/journey/service'
import { loadA3Report } from '@/lib/reports/user-report-data'

export const dynamic = 'force-dynamic'

function feedbackSummary(value: unknown): string | null {
  if (typeof value !== 'string' || !value.trim()) return null
  try {
    const parsed = JSON.parse(value) as {
      strengths?: unknown
      improvements?: unknown
      gaps?: unknown
    }
    const strengths = Array.isArray(parsed.strengths)
      ? parsed.strengths.filter((item): item is string => typeof item === 'string').slice(0, 3)
      : []
    const improvementsSource = Array.isArray(parsed.improvements)
      ? parsed.improvements
      : Array.isArray(parsed.gaps)
        ? parsed.gaps
        : []
    const improvements = improvementsSource
      .filter((item): item is string => typeof item === 'string')
      .slice(0, 2)
    const parts = [
      strengths.length ? `Fortalezas: ${strengths.join(', ')}.` : '',
      improvements.length ? `Para seguir practicando: ${improvements.join(', ')}.` : '',
    ].filter(Boolean)
    return parts.length ? parts.join(' ') : 'La sesión conserva una evaluación estructurada.'
  } catch {
    return value
  }
}

export default async function A3ResultadosPage() {
  const journey = await getJourneyForCurrentUser()
  if (!journey) redirect('/auth/signin?next=/despega/a3/resultados')
  if (!journey.access.a3) redirect('/despega/a2')
  const report = await loadA3Report(journey.user.id)

  return <main className="min-h-screen bg-slate-950 px-4 py-10 text-white"><div className="mx-auto max-w-6xl space-y-8">
    <header className="space-y-5"><div className="flex flex-wrap items-center justify-between gap-3 print:hidden"><Button asChild variant="ghost"><Link href="/despega/a3"><ArrowLeft className="mr-2 h-4 w-4" />Volver a Entrenamiento</Link></Button><PrintReportButton /></div><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-300">Sesiones verificadas</p><h1 className="mt-2 text-4xl font-bold md:text-5xl">Entrenamiento · A3</h1><p className="mt-3 max-w-3xl text-slate-300">El reporte usa únicamente sesiones completadas y conserva un resultado por módulo.</p></div></header>
    <section className="grid gap-4 sm:grid-cols-3">{[['Módulos completados', `${report.completedModules}/10`], ['Sesiones persistidas', String(report.totalSessions)], ['Promedio', report.averageScore === null ? '—' : `${report.averageScore}/100`]].map(([label,value]) => <Card key={label} className="border-slate-800 bg-slate-900"><CardContent className="p-5"><p className="text-sm text-slate-400">{label}</p><p className="mt-2 text-3xl font-bold">{value}</p></CardContent></Card>)}</section>
    {report.modules.length === 0 ? <Card className="border-amber-500/30 bg-amber-500/10"><CardContent className="p-6"><p className="font-semibold">Todavía no hay sesiones completadas.</p><p className="mt-2 text-sm text-amber-50/80">Completa un módulo de Entrenamiento para construir este reporte.</p></CardContent></Card> : <section className="grid gap-4 md:grid-cols-2">{report.modules.map((session) => { const summary = feedbackSummary(session.feedback); return <Card key={String(session.module_id)} className="border-slate-800 bg-slate-900/80"><CardHeader><CardTitle className="flex items-center justify-between gap-3 text-lg"><span>Módulo {session.module_number ?? '—'}</span><span className="text-purple-300">{session.score == null ? 'Completado' : `${session.score}/100`}</span></CardTitle></CardHeader><CardContent><p className="break-words text-sm text-slate-400">{String(session.module_id)}</p>{summary ? <p className="mt-3 text-sm text-slate-300">{summary}</p> : null}</CardContent></Card> })}</section>}
    <div className="flex flex-wrap gap-3 print:hidden"><Button asChild><Link href="/despega/a4"><Target className="mr-2 h-4 w-4" />Abrir Radar A4</Link></Button><Button asChild variant="outline"><Link href="/despega/reporte-integral"><Dumbbell className="mr-2 h-4 w-4" />Reporte integral<ArrowRight className="ml-2 h-4 w-4" /></Link></Button></div>
  </div></main>
}
