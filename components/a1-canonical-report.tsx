import Link from 'next/link'
import { ArrowRight, BarChart3, CalendarDays, CheckCircle2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PhaseTransitionHandler } from '@/components/phase-transition-handler'
import { PrintReportButton } from '@/components/reports/print-report-button'
import { ReportPrintStyles } from '@/components/reports/report-print-styles'
import { ReportProvenance } from '@/components/reports/report-provenance'
import { A1IndividualSection } from '@/components/reports/a1-individual-section'
import reportStyles from '@/components/reports/report-document.module.css'
import type { A1ProfessionalReport } from '@/lib/reports/a1-professional-report'
import { formatReportDate } from '@/lib/reports/report-evidence'

interface A1CanonicalReportProps { report: A1ProfessionalReport }
const panel = 'border-slate-700 bg-slate-900/80 print:border-slate-300 print:bg-white print:text-slate-950'

export function A1CanonicalReport({ report }: A1CanonicalReportProps) {
  const primary = report.dimensions.find((dimension) => dimension.key === report.primary)
  const secondary = report.dimensions.find((dimension) => dimension.key === report.secondary)
  const canInterpret = report.interpretationAvailable && primary !== undefined && secondary !== undefined
  return (
    <article aria-label="Informe A1 Despega Cerebral" className={`${reportStyles.document} min-h-screen bg-slate-950 px-4 py-10 text-white print:bg-white print:px-0 print:py-0 print:text-slate-950`} data-dtc-report="a1" data-report-status={report.scoreEvidence.status}>
      <ReportPrintStyles />
      <div className="mx-auto max-w-6xl space-y-8 print:max-w-none print:space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 print:hidden" data-report-actions>
          <Button asChild variant="ghost"><Link href="/despega/dashboard">Volver al panel</Link></Button><PrintReportButton />
        </div>
        <header data-report-card className="rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/15 via-slate-900 to-indigo-500/10 p-6 md:p-10">
          <Badge className="border-cyan-400/30 bg-cyan-400/10 text-cyan-100 print:text-slate-900">A1 “Despega Cerebral”</Badge>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">Informe profesional de autoconocimiento</p>
          <h1 className="mt-3 max-w-4xl text-3xl font-semibold leading-tight sm:text-4xl md:text-6xl">{report.combinationName}</h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-300">Una lectura de tus elecciones, tu contexto y los matices que puedes aportar. No eres una etiqueta: las preferencias pueden expresarse de manera distinta según la situación.</p>
          <div className="mt-6 flex flex-wrap gap-5 text-sm text-slate-300">
            <p className="flex items-center gap-2"><CalendarDays aria-hidden="true" className="h-4 w-4 shrink-0" />{formatReportDate(report.assessmentDate)}</p>
            <p className="flex items-center gap-2"><BarChart3 aria-hidden="true" className="h-4 w-4 shrink-0" />{report.scoreEvidence.availableDimensions}/4 puntajes disponibles</p>
            <p className="flex items-center gap-2"><CheckCircle2 aria-hidden="true" className="h-4 w-4 shrink-0" />{report.answeredContextItems} respuestas de contexto</p>
          </div>
          {canInterpret && <p className="mt-5 text-sm leading-relaxed text-slate-200">El patrón global combina <strong>{primary.name}</strong> y <strong>{secondary.name}</strong>. Las secciones siguientes muestran qué respuestas sustentan y matizan esa lectura.</p>}
        </header>

        {!report.reviewable && <section role="status" data-report-card className="rounded-2xl border border-amber-400/40 p-6"><h2 className="text-xl font-semibold">La lectura requiere revisión</h2><p className="mt-3 text-sm leading-relaxed text-slate-200">Hay datos ausentes, no válidos o que no concuerdan con el registro de respuestas. No los sustituimos por puntajes neutros ni asignamos un perfil para completar el informe.</p><Button asChild variant="outline" className="mt-4 print:hidden"><Link href="/despega/a1-cerebral">Revisar mi evaluación A1</Link></Button></section>}

        <A1IndividualSection value={report.understanding} editRevision={report.clarificationEditRevision} />

        <section aria-labelledby="profile-heading" className="space-y-5">
          <div><p className="text-sm font-semibold uppercase tracking-wider text-cyan-300">Referencia del cuestionario</p><h2 id="profile-heading" className="mt-2 text-3xl font-semibold">Tus cuatro dimensiones</h2><p className="mt-3 text-sm leading-relaxed text-slate-400">La escala 0–100 es una transformación visual del puntaje neto, centrada en 50. No son percentiles ni probabilidades. Las elecciones “más/menos” vinculan los cuatro puntajes: no son mediciones estadísticamente independientes. Un dato ausente no equivale a cero ni a 50.</p></div>
          <div className="grid gap-4 md:grid-cols-2" data-report-scores>{report.dimensions.map((dimension) => <Card key={dimension.key} data-report-card data-report-dimension={dimension.key} className={panel}><CardContent className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{dimension.key} · {dimension.professionalName}</p><h3 className="mt-2 text-2xl font-semibold">{dimension.name}</h3></div><span className="shrink-0 text-3xl font-semibold" aria-label={dimension.score === null ? 'Sin puntaje verificable' : `Intensidad relativa ${dimension.score} de 100`}>{dimension.score ?? '—'}</span></div>
            {dimension.score !== null ? <><div role="meter" aria-label={`Intensidad relativa de ${dimension.name}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={dimension.score} className="mt-5 h-2 overflow-hidden rounded-full bg-slate-700"><div className="h-full rounded-full" style={{ width: `${dimension.score}%`, backgroundColor: dimension.color }} /></div><p className="mt-2 text-xs text-slate-400">Puntaje neto: {dimension.rawScore}. Rango: −{report.questionCount} a {report.questionCount}.</p></> : <p className="mt-4 text-sm text-amber-200">Sin puntaje verificable.</p>}
            {report.understanding.responseState === 'available' && <p className="mt-2 text-xs text-slate-400">Elegido como “más”: {report.understanding.selections[dimension.key].more} veces · como “menos”: {report.understanding.selections[dimension.key].less} veces.</p>}
          </CardContent></Card>)}</div>
        </section>

        {canInterpret && <section aria-labelledby="hypotheses-heading" className="space-y-4"><div><h2 id="hypotheses-heading" className="text-2xl font-semibold">Hipótesis asociadas al patrón</h2><p className="mt-2 text-sm leading-relaxed text-slate-400">Estas referencias generales pertenecen al patrón, no son capacidades demostradas. Su pertinencia se contrasta con las respuestas y experiencias de tu lectura individual.</p></div><div className="grid gap-5 md:grid-cols-2"><Card data-report-card className={panel}><CardHeader><CardTitle>Recursos probables</CardTitle></CardHeader><CardContent><ul className="space-y-3 text-sm text-slate-300">{report.strengths.map((text) => <li key={text}>{text}</li>)}</ul></CardContent></Card><Card data-report-card className={panel}><CardHeader><CardTitle>Tensiones para contrastar</CardTitle></CardHeader><CardContent><ul className="space-y-3 text-sm text-slate-300">{report.tensions.map((text) => <li key={text}>{text}</li>)}</ul></CardContent></Card></div></section>}

        <section aria-label="Preferencias y restricciones declaradas" className="grid gap-4 md:grid-cols-2">{[
          ['Habilidades que quieres desarrollar', report.context.targetSkills.join(' · ')],
          ['Barreras que declaraste', report.context.barriers.join(' · ')],
          ['Disponibilidad y estructura', [report.context.availableTime, report.context.planStyle].filter(Boolean).join(' · ')],
          ['Cómo prefieres aprender', report.context.learningPreferences.join(' · ')],
        ].map(([title, text]) => <Card key={title} data-report-card className={panel}><CardHeader><CardTitle className="text-lg">{title}</CardTitle></CardHeader><CardContent className="text-sm leading-relaxed text-slate-300">{text || 'No informado'}</CardContent></Card>)}</section>

        <section aria-labelledby="bridge-heading" className="space-y-5"><h2 id="bridge-heading" className="text-3xl font-semibold">Cómo continúa tu recorrido</h2><div className="grid gap-4 md:grid-cols-3">{[
          ['A2 · Traducir', 'A2 “Tu Ruta”', 'Comienza con un ciclo de 30 días, ampliable a 60/90. Traduce tu objetivo en acciones y evidencia revisable.'],
          ['A3 · Practicar', 'A3 “Entrenamiento”', 'Contrasta las hipótesis con ejercicios y conversaciones, con el primer checkpoint desde el Día 7.'],
          ['A4 · Observar', 'A4 “Radar Estratégico”', 'Conecta tu dirección profesional con señales y decisiones que puedas revisar.'],
        ].map(([purpose, title, text]) => <Card key={title} data-report-card className={panel}><CardContent className="p-6"><p className="text-xs uppercase tracking-wider text-slate-400">{purpose}</p><h3 className="mt-2 font-semibold text-emerald-200">{title}</h3><p className="mt-3 text-sm leading-relaxed text-slate-300">{text}</p></CardContent></Card>)}</div></section>

        <Card data-report-card className={panel}><CardHeader><CardTitle>Metodología, alcance y límites</CardTitle></CardHeader><CardContent className="space-y-3 text-sm leading-relaxed text-slate-300"><p>El cuestionario conserva sus {report.questionCount} elecciones “más/menos”. El cálculo y la lectura están versionados; las aclaraciones se guardan aparte y no cambian el resultado original.</p><p>Las seis agrupaciones situacionales son explicativas, no escalas psicométricas adicionales. Identificarse con un texto no demuestra su validez. Este módulo no mide inteligencia, integridad, funcionamiento cerebral ni aptitud para un cargo, y no ofrece diagnósticos ni garantías laborales.</p><p>Los resultados históricos no se reescriben. Cuando las respuestas originales faltan o corresponden a una versión no compatible, se indica la limitación.</p></CardContent></Card>
        <ReportProvenance report={report} />
        <div className="flex flex-wrap gap-3 print:hidden" data-report-actions><Button asChild variant="outline"><Link href="/despega/reporte-integral">Ver reporte integral<ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" /></Link></Button></div>
        {report.reviewable && <div className="print:hidden" data-report-actions><PhaseTransitionHandler currentPhase="a1" isComplete nextPhaseLabel="Continuar a la introducción de Tu Ruta" nextPhaseUrl="/despega/a2/intro" /></div>}
      </div>
    </article>
  )
}
