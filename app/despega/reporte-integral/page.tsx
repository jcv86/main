import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft, Brain, CheckCircle2, Compass, Map, Radar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PrintReportButton } from '@/components/reports/print-report-button'
import { getJourneyForCurrentUser } from '@/lib/journey/service'
import { loadA2Report, loadA3Report, loadA4Report } from '@/lib/reports/user-report-data'

export const dynamic = 'force-dynamic'

export default async function ReporteIntegralPage() {
  const journey = await getJourneyForCurrentUser()
  if (!journey) redirect('/auth/signin?next=/despega/reporte-integral')
  const [a2, a3, a4] = await Promise.all([
    loadA2Report(journey.user.id),
    loadA3Report(journey.user.id),
    loadA4Report(journey.user.id),
  ])
  const a2Final = a2.reviews[2]
  const sections = [
    { title: 'A1 · Autoconocimiento', icon: Brain, value: journey.state.a1CompletedAt ? 'Completado' : 'En progreso', detail: 'El perfil detallado permanece en tu informe A1.', href: '/despega/a1-report' },
    { title: 'A2 · Tu Ruta', icon: Map, value: `${a2.completedDays}/90 días`, detail: `Cierre ${a2Final.closureScore}/100 · evidencia ${a2Final.evidenceRate}%`, href: '/despega/a2/resultados' },
    { title: 'A3 · Entrenamiento', icon: Compass, value: `${a3.completedModules}/10 módulos`, detail: a3.averageScore === null ? 'Sin puntajes completados' : `Promedio ${a3.averageScore}/100`, href: '/despega/a3/resultados' },
    { title: 'A4 · Radar', icon: Radar, value: `${a4.pulse.activeSignals.length} señales activas`, detail: `${a4.decisions.length} decisiones · ${a4.pulse.coveredCategories} categorías cubiertas`, href: '/despega/a4/resultados' },
  ]
  return <main className="min-h-screen bg-slate-950 px-4 py-10 text-white"><div className="mx-auto max-w-6xl space-y-8">
    <header className="space-y-5"><div className="flex flex-wrap items-center justify-between gap-3 print:hidden"><Button asChild variant="ghost"><Link href="/despega/dashboard"><ArrowLeft className="mr-2 h-4 w-4" />Volver al panel</Link></Button><PrintReportButton /></div><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">DespegaTuCarrera</p><h1 className="mt-2 text-4xl font-bold md:text-5xl">Reporte integral A1–A4</h1><p className="mt-3 max-w-3xl text-slate-300">Una vista trazable de tu recorrido. Cada cifra proviene de progreso, sesiones o evidencia persistida; no reemplaza asesoría profesional ni garantiza resultados laborales.</p></div></header>
    <section className="grid gap-4 md:grid-cols-2">{sections.map((section) => { const Icon=section.icon; return <Card key={section.title} className="border-slate-800 bg-slate-900/80"><CardHeader><CardTitle className="flex items-center gap-2"><Icon className="h-5 w-5 text-emerald-300" />{section.title}</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{section.value}</p><p className="mt-2 text-sm text-slate-400">{section.detail}</p><Button asChild variant="link" className="mt-3 px-0 print:hidden"><Link href={section.href}>Abrir detalle</Link></Button></CardContent></Card>})}</section>
    <Card className="border-emerald-500/30 bg-emerald-500/10"><CardContent className="p-6"><p className="flex items-center gap-2 font-semibold"><CheckCircle2 className="h-5 w-5" />Próxima acción verificable</p><p className="mt-2 text-sm text-emerald-50/80">{a4.pulse.activeSignals.length === 0 ? 'Registra tu primera señal en A4 con fuente, fecha y clasificación.' : a4.pulse.reviewQueue.length > 0 ? 'Revisa la próxima decisión programada y registra el resultado observado.' : 'Añade una decisión vinculada a una señal activa y define su fecha de revisión.'}</p><Button asChild className="mt-5 print:hidden"><Link href="/despega/a4#a4-workspace">Continuar en A4</Link></Button></CardContent></Card>
  </div></main>
}
