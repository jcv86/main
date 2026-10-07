'use client'

import { BadgeCheck, Briefcase, CalendarDays, ExternalLink, FileText, Send, TrendingDown, TrendingUp, Wallet } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { PageSection } from '@/components/layout/page-foundation'
import type { OutcomeVerification } from '@/lib/outcomes-chile/impact'
import type { ChileHistoryItem, OutcomesChileSummary } from '@/lib/outcomes-chile/workspace'
import { formatClp, formatDate, formatNumber } from './client'

export function VerificationBadge({ status }: { status: OutcomeVerification }) {
  const label = status === 'verified' ? 'Verificado' : status === 'corroborated' ? 'Con respaldo' : 'Declarado por ti'
  return <span className={`inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${status === 'verified' ? 'border-emerald-300/25 bg-emerald-300/10 text-emerald-200' : 'border-border bg-muted/40 text-muted-foreground'}`}>
    {status === 'verified' && <BadgeCheck className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}{label}
  </span>
}

const PAIR_MESSAGES = {
  missing_latest: 'Agrega una medición posterior para conocer el cambio.',
  missing_baseline: 'Falta un ingreso inicial con una fecha anterior.',
  no_earlier_baseline: 'El ingreso inicial debe tener una fecha anterior a la nueva medición.',
  ambiguous_baseline: 'Hay ingresos iniciales distintos para la misma fecha. La comparación requiere revisión.',
  ambiguous_latest: 'Hay ingresos distintos para la última fecha. La comparación requiere revisión.',
  comparable: '',
}

export function OutcomeOverview({ summary }: { summary: OutcomesChileSummary }) {
  const { observed, delta, verification } = summary.impact
  const difference = delta.versusBaseline
  const change = difference.comparable ? difference.monthlyClp : null
  const baselineEmpty = difference.status === 'ambiguous_baseline'
    ? { label: 'Por revisar', detail: PAIR_MESSAGES.ambiguous_baseline }
    : difference.status === 'ambiguous_latest'
      ? { label: 'Por seleccionar', detail: PAIR_MESSAGES.ambiguous_latest }
      : difference.status === 'no_earlier_baseline'
        ? { label: 'Sin referencia anterior', detail: PAIR_MESSAGES.no_earlier_baseline }
        : { label: 'Sin registro', detail: 'Registra tu punto de partida.' }
  const latestEmpty = difference.status === 'ambiguous_latest'
    ? { label: 'Por revisar', detail: PAIR_MESSAGES.ambiguous_latest }
    : { label: 'Sin registro', detail: 'Agrega una nueva medición.' }
  const measurements = [
    { title: 'Ingreso inicial', data: observed.salary.baseline, empty: baselineEmpty },
    { title: 'Último ingreso registrado', data: observed.salary.latest, empty: latestEmpty },
  ]
  return <PageSection title="Tu evolución registrada" description="Ingresos líquidos mensuales en pesos chilenos. Cada cifra conserva su fecha y estado de evidencia.">
    <div className="grid gap-4 md:grid-cols-3">
      {measurements.map(item => <Card key={item.title}><CardContent className="flex h-full min-w-0 flex-col p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3"><h3 className="text-sm font-medium text-muted-foreground">{item.title}</h3><Wallet className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" /></div>
        <p className={`mt-4 break-words font-bold tracking-tight ${item.data ? 'text-2xl sm:text-3xl' : 'text-xl text-muted-foreground'}`}>{item.data ? formatClp(item.data.monthlyNetClp) : item.empty.label}</p>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">{item.data ? formatDate(item.data.measuredAt) : item.empty.detail}</p>
        {item.data && <div className="mt-auto pt-4"><VerificationBadge status={item.data.verification} /></div>}
      </CardContent></Card>)}
      <Card className={change !== null && change > 0 ? 'border-emerald-300/25' : ''}><CardContent className="flex h-full min-w-0 flex-col p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3"><h3 className="text-sm font-medium text-muted-foreground">Cambio mensual observado</h3>{change !== null && change < 0 ? <TrendingDown className="h-4 w-4 text-amber-200" aria-hidden="true" /> : <TrendingUp className="h-4 w-4 text-muted-foreground" aria-hidden="true" />}</div>
        <p className={`mt-4 break-words font-bold tracking-tight ${change === null ? 'text-xl text-muted-foreground' : change < 0 ? 'text-2xl text-amber-200 sm:text-3xl' : change > 0 ? 'text-2xl text-emerald-200 sm:text-3xl' : 'text-2xl sm:text-3xl'}`}>{change === null ? 'Por completar' : `${change > 0 ? '+' : ''}${formatClp(change)}`}</p>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">{change === null ? PAIR_MESSAGES[difference.status]
          : difference.percent !== null ? `${difference.percent > 0 ? '+' : ''}${formatNumber(difference.percent)}% respecto de tu ingreso inicial.`
            : 'Tu ingreso inicial fue $0; mostramos el cambio en pesos.'}</p>
        {difference.comparable && verification.salaryPair && <div className="mt-auto pt-4"><VerificationBadge status={verification.salaryPair} /></div>}
      </CardContent></Card>
    </div>
    <div className="grid grid-cols-3 gap-3 rounded-[var(--dtc-radius-lg)] border border-border bg-card/60 p-4 sm:gap-5 sm:p-5">
      {[
        { label: 'Postulaciones', value: observed.jobSearch.applications, icon: Send },
        { label: 'Entrevistas', value: observed.jobSearch.interviews, icon: Briefcase },
        { label: 'Ofertas', value: observed.jobSearch.offers, icon: FileText },
      ].map(({ label, value, icon: Icon }) => <div key={label} className="min-w-0 text-center">
        <Icon className="mx-auto mb-2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <p className="text-2xl font-bold tabular-nums sm:text-3xl">{formatNumber(value)}</p><p className="mt-1 break-words text-xs text-muted-foreground sm:text-sm">{label}</p>
      </div>)}
    </div>
    <p className="text-xs leading-5 text-muted-foreground">Son eventos registrados; una misma búsqueda puede tener varios. La evolución observada no demuestra que DTC haya causado un cambio de ingreso o empleo.</p>
  </PageSection>
}

const SOURCES = { ine_esi: 'INE · Encuesta Suplementaria de Ingresos', ine_ene: 'INE · Encuesta Nacional de Empleo', sence_enadel: 'SENCE · ENADEL', other_official: 'Otra fuente oficial' }
const SPECIFICITY = {
  region_occupation_education: 'Región, ocupación y educación', region_occupation: 'Región y ocupación',
  occupation: 'Ocupación', region: 'Región', national: 'Nacional',
}
const METRICS = {
  monthly_labor_income_mean: 'Ingreso laboral medio mensual', monthly_labor_income_median: 'Ingreso laboral mediano mensual',
  employment_rate: 'Tasa de ocupación', unemployment_rate: 'Tasa de desocupación', vacancy_demand: 'Demanda de vacantes', skill_demand: 'Demanda de habilidades',
}
const EMPLOYMENT_CATEGORIES: Record<string, string> = {
  private_employee: 'Empleados del sector privado', public_employee: 'Empleados del sector público',
  self_employed: 'Personas que trabajan por cuenta propia', employer: 'Empleadores', other: 'Otra categoría laboral',
}

function referenceLink(value: string): string | null {
  try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password ? url.href : null } catch { return null }
}

export function ChileBenchmarkPanel({ summary }: { summary: OutcomesChileSummary }) {
  const benchmark = summary.impact.benchmark
  const href = benchmark ? referenceLink(benchmark.sourceRef) : null
  return <section aria-labelledby="chile-reference-title"><Card className="h-full"><CardContent className="space-y-5 p-5 sm:p-6">
    <div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--dtc-indigo-300)]">Contexto de mercado</p><h2 id="chile-reference-title" className="mt-2 text-xl font-semibold tracking-tight">Una referencia de Chile</h2></div>
    {benchmark ? <>
      <div><p className="text-sm text-muted-foreground">{METRICS[benchmark.metricKey]}</p><p className="mt-2 break-words text-3xl font-bold tracking-tight">{benchmark.unit === 'clp_month' ? formatClp(benchmark.value) : `${formatNumber(benchmark.value)}${benchmark.unit === 'percent' ? '%' : benchmark.unit === 'index' ? ' · índice' : ''}`}</p></div>
      <dl className="grid gap-x-5 gap-y-4 text-sm sm:grid-cols-2">
        <div className="min-w-0"><dt className="text-xs text-muted-foreground">Fuente</dt><dd className="mt-1 break-words font-medium">{SOURCES[benchmark.sourceKey]}</dd></div>
        <div><dt className="text-xs text-muted-foreground">Período observado</dt><dd className="mt-1 font-medium">{benchmark.sourcePeriod}</dd></div>
        <div><dt className="text-xs text-muted-foreground">Publicado</dt><dd className="mt-1">{formatDate(benchmark.publishedAt)}</dd></div>
        <div><dt className="text-xs text-muted-foreground">Información disponible al</dt><dd className="mt-1">{formatDate(benchmark.asOf)}</dd></div>
        <div><dt className="text-xs text-muted-foreground">Cobertura de la referencia</dt><dd className="mt-1">{SPECIFICITY[benchmark.specificity]}</dd></div>
        <div><dt className="text-xs text-muted-foreground">Muestra publicada</dt><dd className="mt-1">{benchmark.sampleSize === null ? 'No informada' : formatNumber(benchmark.sampleSize)}</dd></div>
        {benchmark.dimensions.employmentCategory && <div className="sm:col-span-2"><dt className="text-xs text-muted-foreground">Categoría laboral de la referencia</dt><dd className="mt-1 break-words">{Object.hasOwn(EMPLOYMENT_CATEGORIES, benchmark.dimensions.employmentCategory) ? EMPLOYMENT_CATEGORIES[benchmark.dimensions.employmentCategory] : benchmark.dimensions.employmentCategory}</dd></div>}
      </dl>
      <p className="text-xs leading-5 text-muted-foreground">{benchmark.reliabilityStatus === 'official_microdata_derived' ? 'Referencia calculada a partir de microdatos oficiales.' : 'Dato publicado por la fuente oficial.'}</p>
      <p className="rounded-xl border border-border bg-background/35 p-4 text-xs leading-6 text-muted-foreground">El ingreso laboral de esta fuente sirve como contexto. Su definición no está homologada con tu ingreso líquido, por lo que no calculamos una brecha salarial.</p>
      {href ? <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-md text-sm font-medium text-[hsl(var(--ring))] underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Consultar publicación original<ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" /><span className="sr-only"> (abre otra pestaña)</span></a>
        : <p className="break-all text-xs leading-5 text-muted-foreground">Referencia: {benchmark.sourceRef}</p>}
    </> : <div className="space-y-3 rounded-xl border border-dashed border-border p-5">
      <p className="font-medium">Aún no hay una referencia compatible</p><p className="text-sm leading-6 text-muted-foreground">Mostraremos una fuente oficial cuando tenga el período, la cobertura y la evidencia necesarios. Tus propios registros siguen siendo el punto de partida para observar tu evolución.</p>
    </div>}
  </CardContent></Card></section>
}

function HistoryRows({ items }: { items: ChileHistoryItem[] }) {
  const icons = { event: Send, employment: Briefcase, salary: Wallet, followup: CalendarDays }
  return <ol className="divide-y divide-border/70">{items.map(item => {
    const Icon = icons[item.kind]
    return <li key={`${item.kind}:${item.id}`} className="flex min-w-0 gap-3 py-4 first:pt-0">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/35"><Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" /></span>
      <div className="min-w-0 flex-1"><div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1"><h3 className="break-words text-sm font-semibold">{item.title}</h3><time dateTime={item.date} className="text-xs text-muted-foreground">{formatDate(item.date)}</time></div>
        {item.detail && <p className="mt-1 break-words text-sm leading-6 text-muted-foreground">{item.detail}</p>}
        {item.monthlyNetClp !== null && <p className="mt-2 text-base font-semibold tabular-nums">{formatClp(item.monthlyNetClp)} <span className="text-xs font-normal text-muted-foreground">líquidos al mes</span></p>}
        <div className="mt-2"><VerificationBadge status={item.verification} /></div>
      </div>
    </li>
  })}</ol>
}

export function OutcomeHistory({ summary }: { summary: OutcomesChileSummary }) {
  const { history, historyCount, historyTruncated } = summary.workspace
  return <section aria-labelledby="outcome-history-title"><Card className="h-full"><CardContent className="space-y-5 p-5 sm:p-6">
    <div><h2 id="outcome-history-title" className="text-xl font-semibold tracking-tight">Actividad reciente</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">Tus hechos registrados, ordenados por la fecha en que ocurrieron.</p></div>
    {history.length ? <><HistoryRows items={history.slice(0, 5)} />{history.length > 5 && <details className="border-t border-border pt-4"><summary className="cursor-pointer rounded-md text-sm font-medium leading-6 text-[hsl(var(--ring))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Ver {history.length - 5} registros más</summary><div className="mt-5"><HistoryRows items={history.slice(5)} /></div></details>}</>
      : <p className="rounded-xl border border-dashed border-border p-5 text-sm leading-6 text-muted-foreground">Tu primer registro aparecerá aquí. Podrás volver a su fecha, su monto y su estado de evidencia.</p>}
    {historyTruncated && <p className="text-xs leading-5 text-muted-foreground">Esta vista incluye los {history.length} registros más recientes de {historyCount}. Los indicadores consideran todos los registros elegibles.</p>}
  </CardContent></Card></section>
}
