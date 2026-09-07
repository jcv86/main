import Link from 'next/link'
import {
  ArrowRight, BarChart3, Brain, Briefcase, CalendarDays, CheckCircle2, Compass,
  MessageCircle, ShieldCheck, Sparkles, Target, Users,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PhaseTransitionHandler } from '@/components/phase-transition-handler'
import { PrintReportButton } from '@/components/reports/print-report-button'
import { ReportPrintStyles } from '@/components/reports/report-print-styles'
import { ReportProvenance } from '@/components/reports/report-provenance'
import reportStyles from '@/components/reports/report-document.module.css'
import type { A1ProfessionalReport } from '@/lib/reports/a1-professional-report'
import { formatReportDate } from '@/lib/reports/report-evidence'

interface A1CanonicalReportProps { report: A1ProfessionalReport }
const panel = 'border-slate-700 bg-slate-900/80 print:border-slate-300 print:bg-white print:text-slate-950'
function present(value: string): string { return value || 'No informado' }
function withoutArticle(value: string): string { return value.replace(/^(el|la|los|las)\s+/i, '') }

export function A1CanonicalReport({ report }: A1CanonicalReportProps) {
  const primary = report.dimensions.find((dimension) => dimension.key === report.primary)
  const secondary = report.dimensions.find((dimension) => dimension.key === report.secondary)
  const canInterpret = report.interpretationAvailable && primary !== undefined && secondary !== undefined
  const contextRows = [
    ['Situación actual', present(report.context.currentSituation)],
    ['Experiencia', present(report.context.experience)],
    ['Desafío declarado', present(report.context.currentChallenge)],
    ['Objetivo declarado a 90 días', present(report.context.objective90Days)],
    ['Sector de interés', present(report.context.sector)],
    ['Rol objetivo', present(report.context.targetRole)],
  ]
  const workLenses = primary && secondary ? [
    { icon: Compass, title: 'Decisión y ejecución', body: `${primary.name} aporta ${primary.strength.toLowerCase()}. ${secondary.name} representa una segunda tendencia para contrastar con tu forma de avanzar.` },
    { icon: MessageCircle, title: 'Comunicación', body: `Observa cómo el enfoque de ${primary.professionalName.toLowerCase()} convive con ${secondary.professionalName.toLowerCase()} en conversaciones concretas.` },
    { icon: Users, title: 'Colaboración', body: `La lectura combina tendencias de ${withoutArticle(primary.name).toLowerCase()} y ${withoutArticle(secondary.name).toLowerCase()}; el contexto y la conducta observable determinan cómo aparecen en cada equipo.` },
    { icon: ShieldCheck, title: 'Bajo presión', body: `Una tensión para explorar es “${primary.development.toLowerCase()}”. Es una hipótesis para contrastar con situaciones reales, no un hallazgo observado sobre ti.` },
  ] : []

  return (
    <article aria-label="Informe A1 Despega Cerebral" className={`${reportStyles.document} min-h-screen bg-slate-950 px-4 py-10 text-white print:bg-white print:px-0 print:py-0 print:text-slate-950`} data-dtc-report="a1" data-report-status={report.scoreEvidence.status}>
      <ReportPrintStyles />
      <div className="mx-auto max-w-6xl space-y-8 print:max-w-none print:space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 print:hidden" data-report-actions>
          <Button asChild variant="ghost"><Link href="/despega/dashboard">Volver al panel</Link></Button>
          <PrintReportButton />
        </div>

        <header data-report-card className="rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/15 via-slate-900 to-indigo-500/10 p-6 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <Badge className="border-cyan-400/30 bg-cyan-400/10 text-cyan-100 print:text-slate-900">A1 “Despega Cerebral”</Badge>
              <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">Informe profesional de autoconocimiento</p>
              <h1 className="mt-3 max-w-4xl text-3xl font-semibold leading-tight sm:text-4xl md:text-6xl">{report.combinationName}</h1>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-300 md:text-lg">
                Tu patrón conductual y el contexto que declaraste, presentados por separado para distinguir datos de interpretación. Esta lectura orienta qué observar; no determina tus capacidades ni decide por ti.
              </p>
            </div>
            <dl className="grid gap-3 text-sm text-slate-300">
              <div><dt className="flex items-center gap-2"><CalendarDays aria-hidden="true" className="h-4 w-4 shrink-0" />Fecha de evaluación</dt><dd className="mt-1">{formatReportDate(report.assessmentDate)}</dd></div>
              <div><dt className="flex items-center gap-2"><BarChart3 aria-hidden="true" className="h-4 w-4 shrink-0" />Base del cuestionario</dt><dd className="mt-1">{report.questionCount} elecciones “más/menos” · {report.scoreEvidence.availableDimensions}/4 dimensiones disponibles</dd></div>
              <div><dt className="flex items-center gap-2"><CheckCircle2 aria-hidden="true" className="h-4 w-4 shrink-0" />Contexto declarado</dt><dd className="mt-1">{report.answeredContextItems} respuestas registradas</dd></div>
            </dl>
          </div>
        </header>

        {!canInterpret && (
          <section role="status" aria-labelledby="evidence-state-heading" data-report-card className="rounded-2xl border border-amber-400/40 bg-amber-400/10 p-6">
            <h2 id="evidence-state-heading" className="text-xl font-semibold">La interpretación necesita evidencia verificable</h2>
            <p className="mt-3 leading-relaxed text-slate-200">
              {report.scoreEvidence.status === 'complete'
                ? 'Los puntajes disponibles no permiten resolver un patrón principal y secundario inequívoco. No desempatamos por orden alfabético ni asignamos un perfil arbitrario.'
                : 'Hay puntajes ausentes o no válidos. No los reemplazamos por cero ni por una intensidad de 50, y no inferimos fortalezas o tensiones personales desde datos incompletos.'}
            </p>
            {!!report.scoreEvidence.missingDimensions.length && <p className="mt-2 text-sm">Sin dato: {report.scoreEvidence.missingDimensions.join(' · ')}.</p>}
            {!!report.scoreEvidence.invalidDimensions.length && <p className="mt-2 text-sm">Requieren revisión: {report.scoreEvidence.invalidDimensions.join(' · ')}.</p>}
            <p className="mt-3 text-sm text-slate-300">Tu contexto disponible se conserva en este informe. Revisar la evaluación no modifica tus respuestas por sí solo.</p>
            <Button asChild variant="outline" className="mt-4 print:hidden"><Link href="/despega/a1-cerebral">Revisar mi evaluación A1</Link></Button>
          </section>
        )}

        {canInterpret && (
          <section aria-labelledby="executive-summary" className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <Card data-report-card className={panel}>
              <CardHeader><Brain aria-hidden="true" className="h-7 w-7 text-cyan-300" /><CardTitle id="executive-summary">Síntesis ejecutiva</CardTitle></CardHeader>
              <CardContent className="space-y-4 leading-relaxed text-slate-300">
                <p>Tu patrón principal es <strong className="text-white">{primary.name}</strong>, con <strong className="text-white">{secondary.name}</strong> como tendencia secundaria. En conjunto forman el patrón <strong className="text-white">{report.combinationName}</strong>.</p>
                <p>Esto describe preferencias relativas dentro de esta evaluación; no determina capacidad, personalidad completa ni compatibilidad automática con un cargo. Contrástalo con ejemplos concretos de tu experiencia.</p>
                <p className="text-xs text-slate-400">{report.patternSource === 'canonical' ? 'Patrones principal y secundario: registro canónico de la evaluación.' : 'Patrones reconstruidos a partir de puntajes completos con máximos únicos; no existía un par canónico utilizable.'}</p>
              </CardContent>
            </Card>
            <Card data-report-card className={panel}>
              <CardHeader><CardTitle>Tu foco declarado</CardTitle></CardHeader>
              <CardContent className="space-y-4 text-slate-200">
                <div><p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Objetivo declarado a 90 días</p><p className="mt-2 whitespace-pre-wrap leading-relaxed">{present(report.context.objective90Days)}</p></div>
                <div><p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Rol y sector</p><p className="mt-2">{present(report.context.targetRole)} · {present(report.context.sector)}</p></div>
                <p className="text-xs text-slate-400">Este horizonte expresa tu objetivo. A2 “Tu Ruta” comienza con un ciclo de 30 días y puede ampliarse a 60/90.</p>
              </CardContent>
            </Card>
          </section>
        )}

        <section aria-labelledby="profile-heading" className="space-y-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">Puntajes disponibles</p>
            <h2 id="profile-heading" className="mt-2 text-3xl font-semibold">Tu perfil en cuatro dimensiones</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400">La escala relativa 0–100 está centrada en 50: un puntaje neto de cero corresponde a 50, pero un dato ausente no tiene intensidad. No son porcentajes, percentiles ni probabilidades, y las cuatro cifras no tienen que sumar 100.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2" data-report-scores>
            {report.dimensions.map((dimension) => (
              <Card key={dimension.key} data-report-card data-report-dimension={dimension.key} className={panel}>
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div><p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{dimension.key} · {dimension.professionalName}</p><h3 className="mt-2 text-2xl font-semibold">{dimension.name}</h3></div>
                    <span className="shrink-0 text-3xl font-semibold" aria-label={dimension.score === null ? 'Sin puntaje verificable' : `Intensidad ${dimension.score} de 100`}>{dimension.score ?? '—'}</span>
                  </div>
                  {dimension.score !== null ? <>
                    <div role="meter" aria-label={`Intensidad relativa de ${dimension.name}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={dimension.score} className="mt-5 h-2 overflow-hidden rounded-full bg-slate-700">
                      <div className="h-full rounded-full" style={{ width: `${dimension.score}%`, backgroundColor: dimension.color }} />
                    </div>
                    <p className="mt-2 text-xs text-slate-400">Puntaje neto: {dimension.rawScore}. Rango del cuestionario: −{report.questionCount} a {report.questionCount}.</p>
                  </> : <p className="mt-5 text-sm text-amber-200">Sin puntaje verificable; no se calcula una intensidad.</p>}
                  {canInterpret && <div className="mt-5 grid gap-3 text-sm leading-relaxed sm:grid-cols-2">
                    <p className="text-slate-300"><strong className="text-white">Recurso asociado:</strong> {dimension.strength}</p>
                    <p className="text-slate-400"><strong className="text-white">A observar:</strong> {dimension.development}</p>
                  </div>}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {canInterpret && <>
          <section aria-label="Hipótesis del perfil para contrastar" className="grid gap-5 lg:grid-cols-2">
            <Card data-report-card className={panel}>
              <CardHeader><CardTitle className="flex items-center gap-2"><Sparkles aria-hidden="true" className="h-5 w-5" />Recursos probables</CardTitle></CardHeader>
              <CardContent><ul className="space-y-3 text-sm text-slate-200">{report.strengths.map((item) => <li key={item} className="flex gap-3"><CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />{item}</li>)}</ul></CardContent>
            </Card>
            <Card data-report-card className={panel}>
              <CardHeader><CardTitle className="flex items-center gap-2"><Target aria-hidden="true" className="h-5 w-5" />Tensiones para contrastar</CardTitle></CardHeader>
              <CardContent><ul className="space-y-3 text-sm text-slate-200">{report.tensions.map((item) => <li key={item} className="flex gap-3"><Compass aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />{item}</li>)}</ul></CardContent>
            </Card>
          </section>
          <section aria-labelledby="work-heading" className="space-y-5">
            <div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-300">Hipótesis, no resultados observados</p><h2 id="work-heading" className="mt-2 text-3xl font-semibold">Cómo leer este patrón en el trabajo</h2></div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {workLenses.map(({ icon: Icon, title, body }) => <Card key={title} data-report-card className={panel}><CardContent className="p-5"><Icon aria-hidden="true" className="h-6 w-6 text-indigo-300" /><h3 className="mt-4 font-semibold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-slate-400">{body}</p></CardContent></Card>)}
            </div>
          </section>
        </>}

        <section aria-labelledby="context-heading" className="space-y-5">
          <div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-purple-300">Contexto declarado</p><h2 id="context-heading" className="mt-2 text-3xl font-semibold">La realidad que completa el perfil</h2><p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400">Estas respuestas fueron entregadas por ti. Se muestran como contexto, no como conclusiones de la evaluación conductual.</p></div>
          <Card data-report-card className={panel}><CardContent className="p-0"><dl className="grid md:grid-cols-2">{contextRows.map(([label, value]) => <div key={label} className="border-b border-slate-700 p-5"><dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</dt><dd className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-200">{value}</dd></div>)}</dl></CardContent></Card>
          <div className="grid gap-4 md:grid-cols-2">
            <Card data-report-card className={panel}><CardHeader><Briefcase aria-hidden="true" className="h-5 w-5" /><CardTitle className="text-lg">Habilidades objetivo</CardTitle></CardHeader><CardContent className="text-sm leading-relaxed text-slate-300">{report.context.targetSkills.length ? report.context.targetSkills.join(' · ') : 'No informadas'}</CardContent></Card>
            <Card data-report-card className={panel}><CardHeader><CalendarDays aria-hidden="true" className="h-5 w-5" /><CardTitle className="text-lg">Tiempo y estructura</CardTitle></CardHeader><CardContent className="space-y-2 text-sm text-slate-300"><p>{present(report.context.availableTime)}</p><p>{present(report.context.planStyle)}</p></CardContent></Card>
            <Card data-report-card className={panel}><CardHeader><ShieldCheck aria-hidden="true" className="h-5 w-5" /><CardTitle className="text-lg">Barreras declaradas</CardTitle></CardHeader><CardContent className="text-sm leading-relaxed text-slate-300">{report.context.barriers.length ? report.context.barriers.join(' · ') : 'No informadas'}</CardContent></Card>
            <Card data-report-card className={panel}><CardHeader><Brain aria-hidden="true" className="h-5 w-5" /><CardTitle className="text-lg">Cómo prefieres aprender</CardTitle></CardHeader><CardContent className="text-sm leading-relaxed text-slate-300">{report.context.learningPreferences.length ? report.context.learningPreferences.join(' · ') : 'No informado'}</CardContent></Card>
          </div>
        </section>

        <section aria-labelledby="bridge-heading" className="space-y-5">
          <div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">Orientación para los siguientes pasos</p><h2 id="bridge-heading" className="mt-2 text-3xl font-semibold">Cómo continúa tu recorrido</h2></div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ['A2 · Traducir', 'A2 “Tu Ruta”', 'Comienza con un ciclo de 30 días para traducir tu objetivo en acciones, entregables y revisiones. Puede ampliarse a 60/90 días.'],
              ['A3 · Practicar', 'A3 “Entrenamiento”', 'Contrasta hipótesis del perfil con respuestas, conversaciones y simulaciones del programa, con el primer checkpoint desde el Día 7.'],
              ['A4 · Observar', 'A4 “Radar Estratégico”', 'Conecta tu dirección profesional con señales y decisiones que puedas revisar con evidencia.'],
            ].map(([purpose, title, body]) => <Card key={title} data-report-card className={panel}><CardContent className="p-6"><p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">{purpose}</p><h3 className="font-semibold text-emerald-200">{title}</h3><p className="mt-3 text-sm leading-relaxed text-slate-400">{body}</p></CardContent></Card>)}
          </div>
        </section>

        <Card data-report-card className={panel}>
          <CardHeader><CardTitle>Metodología, alcance y límites</CardTitle></CardHeader>
          <CardContent className="grid gap-5 text-sm leading-relaxed text-slate-300 md:grid-cols-2">
            <p><strong className="text-white">Qué representa:</strong> una lectura de preferencias conductuales relativas mediante {report.questionCount} elecciones “más/menos”, integrada con contexto declarado. Los recursos y tensiones son hipótesis de orientación, no conductas observadas.</p>
            <p><strong className="text-white">Qué no representa:</strong> un diagnóstico clínico, una evaluación de capacidad, una certificación, una garantía de desempeño o una recomendación automática de cargo. Tu criterio y la evidencia real siguen siendo fundamentales.</p>
          </CardContent>
        </Card>
        <ReportProvenance report={report} />
        <div className="flex flex-wrap gap-3 print:hidden" data-report-actions><Button asChild variant="outline"><Link href="/despega/reporte-integral">Ver reporte integral<ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" /></Link></Button></div>
        {canInterpret && <div className="print:hidden" data-report-actions><PhaseTransitionHandler currentPhase="a1" isComplete nextPhaseLabel="Continuar a la introducción de Tu Ruta" nextPhaseUrl="/despega/a2/intro" /></div>}
      </div>
    </article>
  )
}
