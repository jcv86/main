import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft, Brain, CheckCircle2, Compass, Map, Radar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PrintReportButton } from '@/components/reports/print-report-button'
import { ReportProvenance } from '@/components/reports/report-provenance'
import { ReportPrintStyles } from '@/components/reports/report-print-styles'
import reportStyles from '@/components/reports/report-document.module.css'
import { formatReportDate } from '@/lib/reports/report-evidence'
import { getJourneyForCurrentUser } from '@/lib/journey/service'
import { loadJourneyFlow } from '@/lib/journey/flow-service'
import { loadA1Report, loadA2Report, loadA3Report, loadA4Report } from '@/lib/reports/user-report-data'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Reporte integral A1–A4 | DespegaTuCarrera', robots: { index: false, follow: false } }
const panel = 'border-slate-700 bg-slate-900/80 print:border-slate-300 print:bg-white print:text-slate-950'

export default async function ReporteIntegralPage() {
  const journey = await getJourneyForCurrentUser()
  if (!journey) redirect('/auth/signin?next=/despega/reporte-integral')
  const [flow, a1, a2, a3, a4] = await Promise.all([loadJourneyFlow(journey),loadA1Report(journey.user.id), loadA2Report(journey.user.id), loadA3Report(journey.user.id), loadA4Report(journey.user.id)])
  const generatedAt = new Date().toISOString()
  const a2Final = a2.reviews[2]
  const a1Ready = a1?.reviewable === true
  const sections = [
    { title: 'A2 “Tu Ruta”', icon: Map, value: `${a2.completedDays} días completados`, detail: `Balance acumulado a 90 días: cierre ${a2Final.closureScore}/100 · evidencia ${a2Final.evidenceRate}%`, href: '/despega/a2/resultados' },
    { title: 'A3 “Entrenamiento”', icon: Compass, value: `${a3.completedModules}/10 módulos`, detail: a3.averageScore === null ? 'Sin puntajes completados' : `Promedio ${a3.averageScore}/100`, href: '/despega/a3/resultados' },
    { title: 'A4 “Radar Estratégico”', icon: Radar, value: `${a4.pulse.activeSignals.length} señales activas`, detail: `${a4.decisions.length} decisiones · ${a4.pulse.coveredCategories} categorías cubiertas`, href: '/despega/a4/resultados' },
  ]
  const nextAction = { ...flow.next, text: flow.next.description }
  const a1Summary = a1?.interpretationAvailable
    ? `Patrón principal ${a1.dimensions.find((dimension) => dimension.key === a1.primary)?.name} con ${a1.dimensions.find((dimension) => dimension.key === a1.secondary)?.name} como tendencia secundaria. Contrasta esta lectura con tus respuestas por situación y con evidencia durante el recorrido.`
    : a1Ready ? 'Hay preferencias empatadas. A1 conserva esa ambigüedad y ofrece contexto y respuestas por situación sin asignarte una combinación arbitraria. Un empate no impide continuar.'
      : a1 ? 'Hay datos ausentes o que requieren revisión. No se rellenan con puntajes neutros ni perfiles arbitrarios.' : 'Abre A1 para revisar el estado de tu evaluación y del informe.'

  return <article aria-label="Reporte integral A1 a A4" data-dtc-report="integral" className={`${reportStyles.document} min-h-screen bg-slate-950 px-4 py-10 text-white print:bg-white print:text-slate-950`}>
    <ReportPrintStyles />
    <div className="mx-auto max-w-6xl space-y-8">
      <header className="space-y-5"><div className="flex flex-wrap items-center justify-between gap-3 print:hidden" data-report-actions><Button asChild variant="ghost"><Link href="/despega/dashboard"><ArrowLeft aria-hidden="true" className="mr-2 h-4 w-4" />Volver al panel</Link></Button><PrintReportButton /></div><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">DespegaTuCarrera</p><h1 className="mt-2 text-4xl font-bold md:text-5xl">Reporte integral A1–A4</h1><p className="mt-3 max-w-3xl text-slate-300">Una vista trazable de tu recorrido. Las interpretaciones son orientativas y no garantizan resultados laborales.</p><p className="mt-3 text-sm text-slate-400">A2 “Tu Ruta” comienza con 30 días y puede ampliarse a 60/90. Los balances acumulados no equivalen a una certificación.</p><p className="mt-2 text-xs text-slate-400">Generado el {formatReportDate(generatedAt)}.</p></div></header>
      <Card data-report-card className={panel}><CardHeader><p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">La base interpretativa del recorrido</p><CardTitle className="flex items-center gap-2 text-2xl"><Brain aria-hidden="true" className="h-6 w-6 shrink-0 text-cyan-300" />A1 “Despega Cerebral”</CardTitle></CardHeader><CardContent className="grid gap-6 lg:grid-cols-[1fr_0.8fr]"><div><p className="text-3xl font-bold">{a1?.combinationName || (journey.state.a1CompletedAt ? 'Evaluación completada; informe no disponible' : 'En progreso')}</p><p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">{a1Summary}</p>{a1 && <p className="mt-3 text-xs text-slate-400">{a1.scoreEvidence.availableDimensions}/4 puntajes disponibles · {a1.understanding.answerCount} respuestas situacionales recuperadas · {a1.answeredContextItems} respuestas de contexto.</p>}<Button asChild variant="link" className="mt-3 px-0 print:hidden"><Link href="/despega/a1-report">Abrir informe profesional A1</Link></Button></div><dl className="grid gap-3 text-sm"><div className="rounded-xl border border-slate-700 p-4"><dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">Objetivo declarado</dt><dd className="mt-2 whitespace-pre-wrap text-slate-200">{a1?.context.objective90Days || 'No informado'}</dd></div><div className="rounded-xl border border-slate-700 p-4"><dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">Rol objetivo</dt><dd className="mt-2 text-slate-200">{a1?.context.targetRole || 'No informado'}</dd></div></dl></CardContent></Card>
      <section aria-label="Evidencia por etapa" className="grid gap-4 md:grid-cols-3">{sections.map((section) => { const Icon = section.icon; return <Card key={section.title} data-report-card className={panel}><CardHeader><CardTitle className="flex items-center gap-2"><Icon aria-hidden="true" className="h-5 w-5 shrink-0 text-emerald-300" />{section.title}</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{section.value}</p><p className="mt-2 text-sm text-slate-400">{section.detail}</p><Button asChild variant="link" className="mt-3 px-0 print:hidden"><Link href={section.href}>Abrir detalle</Link></Button></CardContent></Card> })}</section>
      <Card data-report-card className={panel}><CardContent className="p-6"><h2 className="flex items-center gap-2 font-semibold"><CheckCircle2 aria-hidden="true" className="h-5 w-5 shrink-0" />Próxima acción verificable</h2><p className="mt-2 text-sm text-slate-300">{nextAction.text}</p><Button asChild className="mt-5 bg-emerald-700 text-white hover:bg-emerald-800 print:hidden"><Link href={nextAction.href}>{nextAction.label}</Link></Button><Button asChild variant="link" className="mt-3 print:hidden"><Link href="/despega/recorrido">Ver el recorrido A1–A4 y sus requisitos</Link></Button></CardContent></Card>
      {a1 && <section aria-label="Trazabilidad de las fuentes de A1"><ReportProvenance report={a1} /></section>}
      <p className="border-t border-slate-700 pt-4 text-xs leading-relaxed text-slate-400">Este reporte reúne los datos disponibles al consultar cada etapa. No es una captura histórica sincronizada, un documento firmado ni una garantía de desempeño. La impresión conserva el contenido de esta vista.</p>
    </div>
  </article>
}
