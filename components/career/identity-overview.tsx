import Link from 'next/link'
import { ArrowRight, Brain, Layers, ShieldCheck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { A1ProfessionalReport } from '@/lib/reports/a1-professional-report'
import type { CareerContext } from '@/lib/career/types'
import { careerA1Projection } from '@/lib/career/a1-read-boundary'
import { formatReportDate } from '@/lib/reports/report-evidence'

export interface IdentityOverviewProps { a1: A1ProfessionalReport | null; context: CareerContext | null }

export function IdentityOverview({ a1, context }: IdentityOverviewProps) {
  const preferences = careerA1Projection(a1)
  const skills = context?.skills ?? []
  const evidence = context?.recentEvidence ?? []
  return <article className="space-y-8" aria-labelledby="identity-heading">
    <header className="max-w-3xl space-y-3"><p className="text-sm font-semibold uppercase tracking-wider text-primary">Identidad profesional</p><h1 id="identity-heading" className="text-3xl font-semibold sm:text-4xl">Lo que sabes de ti, con su evidencia</h1><p className="text-base leading-relaxed text-muted-foreground">Tus preferencias, tus objetivos y los registros de práctica tienen significados distintos. Aquí permanecen conectados, sin convertir un estilo conductual en una capacidad demostrada.</p></header>
    <section className="grid gap-4 md:grid-cols-3" aria-label="Cobertura de información">
      <Card><CardHeader><CardTitle className="text-lg">Preferencias A1</CardTitle></CardHeader><CardContent><p className="font-semibold">{a1?.reviewable ? 'Lectura disponible' : a1 ? 'Requiere revisión' : 'Sin evaluación disponible'}</p><p className="mt-2 text-sm text-muted-foreground">No son habilidades ni una prueba de aptitud.</p></CardContent></Card>
      <Card><CardHeader><CardTitle className="text-lg">Registros de habilidades</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold">{skills.length}</p><p className="mt-2 text-sm text-muted-foreground">Se excluyen las antiguas filas DISC de esta cuenta.</p></CardContent></Card>
      <Card><CardHeader><CardTitle className="text-lg">Evidencia reciente</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold">{evidence.length}</p><p className="mt-2 text-sm text-muted-foreground">Registros disponibles en esta vista; no un total histórico ni una certificación.</p></CardContent></Card>
    </section>
    <Card><CardHeader><CardTitle className="flex items-center gap-3"><Brain aria-hidden="true" className="h-6 w-6 shrink-0 text-primary" />Tu lectura A1</CardTitle></CardHeader><CardContent className="space-y-5">
      <p className="text-2xl font-semibold">{preferences.combinationName ?? 'Tu lectura empieza con Despega Cerebral'}</p>
      <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">{preferences.limitation}</p>
      {preferences.status === 'ambiguous' && <p role="status" className="rounded-xl border border-border p-4 text-sm">Hay preferencias empatadas. Conservamos los matices en vez de asignarte una combinación por orden alfabético.</p>}
      {a1?.reviewable && <><p className="text-xs text-muted-foreground">Evaluación: {formatReportDate(a1.assessmentDate)}. Misma fuente y reglas que el informe A1.</p><dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{a1.dimensions.map((dimension) => <div key={dimension.key} className="rounded-xl border border-border p-4"><dt className="text-sm font-semibold">{dimension.name}</dt><dd className="mt-2"><span className="text-2xl font-semibold">{dimension.score ?? '—'}</span><span className="ml-2 text-xs text-muted-foreground">intensidad relativa</span><p className="mt-2 text-xs text-muted-foreground">Puntaje neto: {dimension.rawScore ?? 'sin dato'}</p></dd></div>)}</dl></>}
      <Button asChild className="bg-emerald-700 text-white hover:bg-emerald-800"><Link href="/despega/a1-report">{a1 ? 'Abrir mi lectura individual' : 'Comenzar mi lectura A1'}<ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" /></Link></Button>
    </CardContent></Card>
    <section className="grid gap-4 md:grid-cols-2" aria-label="Dirección declarada"><Card><CardHeader><CardTitle className="text-lg">Objetivo que declaraste</CardTitle></CardHeader><CardContent className="whitespace-pre-wrap break-words text-sm leading-relaxed">{a1?.context.objective90Days || 'Todavía no hay un objetivo disponible para esta lectura.'}</CardContent></Card><Card><CardHeader><CardTitle className="text-lg">Rol de interés</CardTitle></CardHeader><CardContent><p className="whitespace-pre-wrap break-words text-sm">{a1?.context.targetRole || 'No informado'}</p><p className="mt-3 text-xs text-muted-foreground">Es tu interés declarado, no un cargo recomendado automáticamente por DISC.</p></CardContent></Card></section>
    <Card><CardHeader><CardTitle className="flex items-center gap-3"><Layers aria-hidden="true" className="h-5 w-5 shrink-0" />Habilidades y práctica</CardTitle></CardHeader><CardContent>
      {skills.length ? <ul className="divide-y divide-border">{skills.map((skill) => <li key={skill.id} className="flex flex-wrap justify-between gap-3 py-4"><div><p className="font-semibold">{skill.label}</p><p className="mt-1 text-xs text-muted-foreground">Último registro: {formatReportDate(skill.lastEvaluatedAt)}</p></div><p className="text-sm">{skill.score !== null && Number.isFinite(skill.score) ? `Puntaje registrado: ${skill.score}` : 'Sin puntaje registrado'}</p></li>)}</ul> : <div className="space-y-3"><p className="text-sm leading-relaxed text-muted-foreground">Todavía no hay registros de habilidades disponibles en esta vista. No usamos las preferencias D, I, S y C para llenar ese espacio.</p><Button asChild variant="outline"><Link href="/despega/reporte-integral">Ver mi recorrido y próximos pasos</Link></Button></div>}
      {skills.length > 0 && <p className="mt-4 text-xs leading-relaxed text-muted-foreground">Los puntajes conservan la unidad del registro de origen. No se suman a A1 ni se presentan como probabilidades de éxito profesional.</p>}
    </CardContent></Card>
    <footer className="flex items-start gap-3 border-t border-border pt-5 text-xs leading-relaxed text-muted-foreground"><ShieldCheck aria-hidden="true" className="h-5 w-5 shrink-0" /><p>Las proyecciones antiguas de A1 se excluyen de las habilidades y de las evidencias de este servicio. No se borran tus registros históricos. Esta separación evita mostrar confianza psicológica o capacidades que el cuestionario no mide.</p></footer>
  </article>
}
