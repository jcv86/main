import Link from 'next/link'
import { redirect } from 'next/navigation'
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Map } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PrintReportButton } from '@/components/reports/print-report-button'
import { getJourneyForCurrentUser } from '@/lib/journey/service'
import { loadA2Report } from '@/lib/reports/user-report-data'

export const dynamic = 'force-dynamic'

export default async function A2ResultadosPage() {
  const journey = await getJourneyForCurrentUser()
  if (!journey) redirect('/auth/signin?next=/despega/a2/resultados')
  if (!journey.access.a2) redirect('/despega/a1-report')
  const report = await loadA2Report(journey.user.id)
  const finalReview = report.reviews[2]

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
            <Button asChild variant="ghost"><Link href="/despega/a2"><ArrowLeft className="mr-2 h-4 w-4" />Volver a Tu Ruta</Link></Button>
            <PrintReportButton />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">Reporte basado en evidencia persistida</p>
            <h1 className="mt-2 text-4xl font-bold md:text-5xl">Tu Ruta · A2</h1>
            <p className="mt-3 max-w-3xl text-slate-300">Resume tus 90 días sin inventar conclusiones. Las tasas se calculan desde entregas, validaciones y checkpoints guardados.</p>
          </div>
        </header>
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Días completados', `${report.completedDays}/90`],
            ['Cierre de ruta', `${finalReview.closureScore}/100`],
            ['Días con evidencia', `${finalReview.evidenceDays}/90`],
            ['Checkpoints A3', `${finalReview.checkpointsCompleted}/${finalReview.checkpointsRequired}`],
          ].map(([label, value]) => <Card key={label} className="border-slate-800 bg-slate-900"><CardContent className="p-5"><p className="text-sm text-slate-400">{label}</p><p className="mt-2 text-3xl font-bold">{value}</p></CardContent></Card>)}
        </section>
        <section className="grid gap-4 md:grid-cols-3">
          {report.reviews.map((review) => <Card key={review.horizon} className="border-slate-800 bg-slate-900/80"><CardHeader><CardTitle>Ciclo de {review.horizon} días</CardTitle></CardHeader><CardContent className="space-y-3 text-sm text-slate-300"><p>{review.completedDays}/{review.horizon} días · {review.completionRate}%</p><p>Validación: {review.validationRate}%</p><p>Evidencia: {review.evidenceRate}%</p><p>Checkpoints: {review.checkpointRate}%</p></CardContent></Card>)}
        </section>
        <section className="grid gap-4 md:grid-cols-2">
          <Card className="border-emerald-500/30 bg-emerald-500/10"><CardHeader><CardTitle className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5" />Evidencia consolidada</CardTitle></CardHeader><CardContent><ul className="space-y-2 text-sm text-emerald-50">{(finalReview.strengths.length ? finalReview.strengths : ['Aún no hay fortalezas suficientes para consolidar.']).map((item) => <li key={item}>• {item}</li>)}</ul></CardContent></Card>
          <Card className="border-amber-500/30 bg-amber-500/10"><CardHeader><CardTitle className="flex items-center gap-2"><AlertCircle className="h-5 w-5" />Pendientes observables</CardTitle></CardHeader><CardContent><ul className="space-y-2 text-sm text-amber-50">{(finalReview.gaps.length ? finalReview.gaps : ['No hay brechas pendientes en el cierre de 90 días.']).map((item) => <li key={item}>• {item}</li>)}</ul></CardContent></Card>
        </section>
        <div className="flex flex-wrap gap-3 print:hidden"><Button asChild><Link href="/despega/a3/resultados"><Map className="mr-2 h-4 w-4" />Ver reporte A3</Link></Button><Button asChild variant="outline"><Link href="/despega/reporte-integral">Reporte integral<ArrowRight className="ml-2 h-4 w-4" /></Link></Button></div>
      </div>
    </main>
  )
}
