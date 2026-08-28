import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft, ArrowRight, Radar, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PrintReportButton } from '@/components/reports/print-report-button'
import { pulsePriorityLabel } from '@/lib/a4/evidence-pulse'
import { getJourneyForCurrentUser } from '@/lib/journey/service'
import { loadA4Report } from '@/lib/reports/user-report-data'

export const dynamic = 'force-dynamic'

export default async function A4ResultadosPage() {
  const journey = await getJourneyForCurrentUser()
  if (!journey) redirect('/auth/signin?next=/despega/a4/resultados')
  if (!journey.access.a4) redirect('/despega/a3')
  const report = await loadA4Report(journey.user.id)
  const priority = pulsePriorityLabel(report.pulse.priority)

  return <main className="min-h-screen bg-slate-950 px-4 py-10 text-white"><div className="mx-auto max-w-6xl space-y-8">
    <header className="space-y-5"><div className="flex flex-wrap items-center justify-between gap-3 print:hidden"><Button asChild variant="ghost"><Link href="/despega/a4"><ArrowLeft className="mr-2 h-4 w-4" />Volver al Radar</Link></Button><PrintReportButton /></div><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-300">Inteligencia estratégica verificable</p><h1 className="mt-2 text-4xl font-bold md:text-5xl">Radar · A4</h1><p className="mt-3 max-w-3xl text-slate-300">No hay puntajes ficticios: este reporte crece con señales fechadas, fuentes y decisiones revisables.</p></div></header>
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[['Señales activas', String(report.pulse.activeSignals.length)], ['Hechos', String(report.pulse.facts)], ['Hipótesis', String(report.pulse.hypotheses)], ['Decisiones', String(report.decisions.length)]].map(([label,value]) => <Card key={label} className="border-slate-800 bg-slate-900"><CardContent className="p-5"><p className="text-sm text-slate-400">{label}</p><p className="mt-2 text-3xl font-bold">{value}</p></CardContent></Card>)}</section>
    <Card className="border-rose-400/30 bg-rose-400/10"><CardHeader><CardTitle className="flex items-center gap-2"><Radar className="h-5 w-5" />Prioridad actual: {priority.label}</CardTitle></CardHeader><CardContent><p className="text-rose-50/80">{priority.detail}</p><p className="mt-3 text-sm text-rose-50/60">Cobertura: {report.pulse.coveredCategories} categorías · {report.documents} documentos propios disponibles.</p></CardContent></Card>
    {report.signals.length === 0 ? <Card className="border-slate-700 bg-slate-900"><CardContent className="p-6"><p className="font-semibold">Tu Radar está listo, pero aún no tiene evidencia.</p><p className="mt-2 text-sm text-slate-300">Registra la primera señal con fuente y fecha. Después vincula una decisión y su revisión.</p><Button asChild className="mt-5 print:hidden"><Link href="/despega/a4#a4-workspace"><ShieldCheck className="mr-2 h-4 w-4" />Registrar primera señal</Link></Button></CardContent></Card> : <section className="grid gap-4 md:grid-cols-2">{report.signals.map((signal) => <Card key={signal.id} className="border-slate-800 bg-slate-900/80"><CardHeader><CardTitle className="text-lg">{signal.title}</CardTitle></CardHeader><CardContent className="space-y-2 text-sm text-slate-300"><p>{signal.summary}</p><p className="text-slate-500">{signal.classification === 'fact' ? 'Hecho' : 'Hipótesis'} · confianza {signal.confidence}/5 · {signal.source_date}</p></CardContent></Card>)}</section>}
    <div className="flex flex-wrap gap-3 print:hidden"><Button asChild><Link href="/despega/a4"><Radar className="mr-2 h-4 w-4" />Continuar Radar</Link></Button><Button asChild variant="outline"><Link href="/despega/reporte-integral">Reporte integral<ArrowRight className="ml-2 h-4 w-4" /></Link></Button></div>
  </div></main>
}
