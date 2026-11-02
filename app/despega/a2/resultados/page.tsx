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
  const finalReview = report.activeReview

  return (
    <article className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
            <Button asChild variant="ghost"><Link href="/despega/a2"><ArrowLeft className="mr-2 h-4 w-4" />Volver a Tu Ruta</Link></Button>
            <PrintReportButton />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">Reporte basado en evidencia persistida</p>
            <h1 className="mt-2 text-4xl font-bold md:text-5xl">Tu Ruta · A2</h1>
            <p className="mt-3 max-w-3xl text-slate-300">Tu recorrido actual es de {report.activeHorizon} días. Aquí puedes revisar las entregas y evidencias que guardaste, lo que queda pendiente y el siguiente paso que quieres practicar.</p>
          </div>
        </header>
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Días completados', `${finalReview.completedDays}/${report.activeHorizon}`],
            ['Días pendientes', String(Math.max(0, report.activeHorizon - finalReview.completedDays))],
            ['Días con evidencia', String(finalReview.evidenceDays)],
            ['Práctica elegida', report.practicePath === 'persona' ? 'Personal' : report.practicePath === 'profesional' ? 'Profesional' : 'Personal y profesional'],
          ].map(([label, value]) => <Card key={label} className="border-slate-800 bg-slate-900"><CardContent className="p-5"><p className="text-sm text-slate-400">{label}</p><p className="mt-2 text-3xl font-bold">{value}</p></CardContent></Card>)}
        </section>
        <section className="grid gap-4 md:grid-cols-3">
          {report.reviews.filter(review => review.horizon <= report.activeHorizon).map((review) => <Card key={review.horizon} className="border-slate-800 bg-slate-900/80"><CardHeader><CardTitle>Balance hasta el día {review.horizon}</CardTitle></CardHeader><CardContent className="space-y-3 text-sm text-slate-300"><p>{review.completedDays}/{review.horizon} días completados</p><p>{review.evidenceDays} días con evidencia guardada</p><p>{review.validatedDays} entregas con revisión de campos</p>{review.checkpointsRequired > 0 && <p>{review.checkpointsCompleted}/{review.checkpointsRequired} prácticas de Entrenamiento completadas</p>}</CardContent></Card>)}
        </section>
        <section className="grid gap-4 md:grid-cols-2">
          <Card className="border-emerald-500/30 bg-emerald-500/10"><CardHeader><CardTitle className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5" />Evidencia consolidada</CardTitle></CardHeader><CardContent><ul className="space-y-2 text-sm text-emerald-50">{(finalReview.strengths.length ? finalReview.strengths : ['Todavía no hay suficientes registros para este balance.']).map((item) => <li key={item}>• {item}</li>)}</ul></CardContent></Card>
          <Card className="border-amber-500/30 bg-amber-500/10"><CardHeader><CardTitle className="flex items-center gap-2"><AlertCircle className="h-5 w-5" />Pendientes observables</CardTitle></CardHeader><CardContent><ul className="space-y-2 text-sm text-amber-50">{(finalReview.gaps.length ? finalReview.gaps : ['Los registros del ciclo están completos. Revisa qué quieres mantener o ajustar.']).map((item) => <li key={item}>• {item}</li>)}</ul></CardContent></Card>
        </section>
        <div className="flex flex-wrap gap-3 print:hidden">{report.practicePath !== 'persona' && journey.access.a3 && <Button asChild><Link href="/despega/a3/resultados"><Map className="mr-2 h-4 w-4" />Ver reporte A3</Link></Button>}<Button asChild variant="outline"><Link href="/despega/reporte-integral">Reporte integral<ArrowRight className="ml-2 h-4 w-4" /></Link></Button></div>
      </div>
    </article>
  )
}
