import Link from 'next/link'
import {
  ArrowRight,
  BarChart3,
  Brain,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  Compass,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PhaseTransitionHandler } from '@/components/phase-transition-handler'
import { PrintReportButton } from '@/components/reports/print-report-button'
import type { A1ProfessionalReport } from '@/lib/reports/a1-professional-report'

interface A1CanonicalReportProps {
  report: A1ProfessionalReport
}

function displayDate(value: string | null): string {
  if (!value) return 'Fecha no disponible'
  return new Intl.DateTimeFormat('es-CL', {
    timeZone: 'America/Santiago',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value))
}

function present(value: string): string {
  return value || 'No informado'
}

function withoutArticle(value: string): string {
  return value.replace(/^(el|la|los|las)\s+/i, '')
}

export function A1CanonicalReport({ report }: A1CanonicalReportProps) {
  const primary = report.dimensions.find((dimension) => dimension.key === report.primary)!
  const secondary = report.dimensions.find((dimension) => dimension.key === report.secondary)!
  const contextRows = [
    ['Situación actual', present(report.context.currentSituation)],
    ['Experiencia', present(report.context.experience)],
    ['Desafío declarado', present(report.context.currentChallenge)],
    ['Objetivo a 90 días', present(report.context.objective90Days)],
    ['Sector de interés', present(report.context.sector)],
    ['Rol objetivo', present(report.context.targetRole)],
  ]
  const workLenses = [
    {
      icon: Compass,
      title: 'Decisión y ejecución',
      body: `${primary.name} aporta ${primary.strength.toLowerCase()}. ${secondary.name} funciona como un segundo recurso disponible para modular la forma de avanzar.`,
    },
    {
      icon: MessageCircle,
      title: 'Comunicación',
      body: `La combinación ${report.combinationName} sugiere observar cómo el ritmo de ${primary.professionalName.toLowerCase()} convive con ${secondary.professionalName.toLowerCase()}.`,
    },
    {
      icon: Users,
      title: 'Colaboración',
      body: `Tu lectura combina tendencias de ${withoutArticle(primary.name).toLowerCase()} y ${withoutArticle(secondary.name).toLowerCase()}; el contexto y la conducta observable determinan cómo aparecen en cada equipo.`,
    },
    {
      icon: ShieldCheck,
      title: 'Bajo presión',
      body: `La principal tensión a vigilar es “${primary.development.toLowerCase()}”. No es un diagnóstico: es una hipótesis para contrastar con situaciones reales.`,
    },
  ]

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white print:bg-white print:px-0 print:py-0 print:text-slate-950">
      <div className="mx-auto max-w-6xl space-y-8 print:max-w-none print:space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
          <Button asChild variant="ghost"><Link href="/despega/dashboard">Volver al panel</Link></Button>
          <PrintReportButton />
        </div>

        <header className="relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/15 via-slate-900 to-indigo-500/10 p-7 md:p-10 print:break-after-page print:border-slate-300 print:bg-white">
          <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <Badge className="border-cyan-400/30 bg-cyan-400/10 text-cyan-100 print:border-slate-300 print:bg-white print:text-slate-700">
                A1 · Despega Cerebral
              </Badge>
              <p className="mt-6 text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300 print:text-slate-600">
                Informe profesional de autoconocimiento
              </p>
              <h1 className="mt-3 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
                {report.combinationName}
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-300 print:text-slate-700">
                Una lectura integrada de tu patrón conductual, tu contexto profesional y el objetivo que declaraste. Sirve como hipótesis de trabajo para construir evidencia en A2, practicar en A3 y contrastar decisiones en A4.
              </p>
            </div>
            <div className="grid min-w-52 gap-3 text-sm text-slate-300 print:text-slate-700">
              <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4" />{displayDate(report.assessmentDate)}</p>
              <p className="flex items-center gap-2"><BarChart3 className="h-4 w-4" />28 elecciones forzadas</p>
              <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" />{report.answeredContextItems} respuestas de contexto</p>
              <p className="text-xs text-slate-500 print:text-slate-500">Informe generado el {displayDate(report.generatedAt)}</p>
            </div>
          </div>
        </header>

        <section aria-labelledby="executive-summary" className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr] print:break-inside-avoid">
          <Card className="border-cyan-400/25 bg-cyan-400/5 print:border-slate-300 print:bg-white">
            <CardHeader>
              <Brain className="h-7 w-7 text-cyan-300 print:text-slate-700" />
              <CardTitle id="executive-summary">Síntesis ejecutiva</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 leading-relaxed text-slate-300 print:text-slate-700">
              <p>
                Tu patrón principal es <strong className="text-white print:text-slate-950">{primary.name}</strong>, con <strong className="text-white print:text-slate-950">{secondary.name}</strong> como tendencia secundaria. En conjunto forman el patrón <strong className="text-white print:text-slate-950">{report.combinationName}</strong>.
              </p>
              <p>
                Esto describe preferencias relativas dentro de esta evaluación; no determina capacidad, personalidad completa ni compatibilidad automática con un cargo. Su valor aparece al contrastarlo con ejemplos concretos de tu experiencia.
              </p>
            </CardContent>
          </Card>
          <Card className="border-indigo-400/25 bg-indigo-400/5 print:border-slate-300 print:bg-white">
            <CardHeader><CardTitle>Tu foco declarado</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><p className="text-xs uppercase tracking-[0.16em] text-indigo-200/70 print:text-slate-500">Objetivo a 90 días</p><p className="mt-2 leading-relaxed text-slate-200 print:text-slate-800">{present(report.context.objective90Days)}</p></div>
              <div><p className="text-xs uppercase tracking-[0.16em] text-indigo-200/70 print:text-slate-500">Rol y sector</p><p className="mt-2 text-slate-200 print:text-slate-800">{present(report.context.targetRole)} · {present(report.context.sector)}</p></div>
            </CardContent>
          </Card>
        </section>

        <section aria-labelledby="profile-heading" className="space-y-5 print:break-before-page">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300 print:text-slate-600">Lectura conductual</p>
            <h2 id="profile-heading" className="mt-2 text-3xl font-semibold">Tu perfil en cuatro dimensiones</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400 print:text-slate-600">Cada indicador convierte el puntaje neto del cuestionario a una escala relativa 0–100, centrada en 50. Las cuatro cifras son independientes y no tienen que sumar 100%.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {report.dimensions.map((dimension) => (
              <Card key={dimension.key} className="break-inside-avoid border-slate-800 bg-slate-900/80 print:border-slate-300 print:bg-white">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{dimension.key} · {dimension.professionalName}</p><h3 className="mt-2 text-2xl font-semibold">{dimension.name}</h3></div>
                    <span className="text-3xl font-semibold" style={{ color: dimension.color }}>{dimension.score}</span>
                  </div>
                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800 print:bg-slate-200"><div className="h-full rounded-full" style={{ width: `${dimension.score}%`, backgroundColor: dimension.color }} /></div>
                  <div className="mt-5 grid gap-3 text-sm leading-relaxed sm:grid-cols-2">
                    <p className="text-slate-300 print:text-slate-700"><strong className="text-white print:text-slate-950">Recurso:</strong> {dimension.strength}</p>
                    <p className="text-slate-400 print:text-slate-600"><strong className="text-white print:text-slate-950">A observar:</strong> {dimension.development}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-2 print:break-before-page">
          <Card className="border-emerald-400/25 bg-emerald-400/5 print:border-slate-300 print:bg-white">
            <CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5" />Recursos probables</CardTitle></CardHeader>
            <CardContent><ul className="space-y-3 text-sm text-slate-200 print:text-slate-700">{report.strengths.map((item) => <li key={item} className="flex gap-3"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300 print:text-slate-700" />{item}</li>)}</ul></CardContent>
          </Card>
          <Card className="border-amber-400/25 bg-amber-400/5 print:border-slate-300 print:bg-white">
            <CardHeader><CardTitle className="flex items-center gap-2"><Target className="h-5 w-5" />Tensiones para contrastar</CardTitle></CardHeader>
            <CardContent><ul className="space-y-3 text-sm text-slate-200 print:text-slate-700">{report.tensions.map((item) => <li key={item} className="flex gap-3"><Compass className="mt-0.5 h-4 w-4 shrink-0 text-amber-300 print:text-slate-700" />{item}</li>)}</ul></CardContent>
          </Card>
        </section>

        <section aria-labelledby="work-heading" className="space-y-5">
          <div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-300 print:text-slate-600">Aplicación profesional</p><h2 id="work-heading" className="mt-2 text-3xl font-semibold">Cómo leer este patrón en el trabajo</h2></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {workLenses.map(({ icon: Icon, title, body }) => <Card key={title} className="break-inside-avoid border-slate-800 bg-slate-900/70 print:border-slate-300 print:bg-white"><CardContent className="p-5"><Icon className="h-6 w-6 text-indigo-300 print:text-slate-700" /><h3 className="mt-4 font-semibold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-slate-400 print:text-slate-600">{body}</p></CardContent></Card>)}
          </div>
        </section>

        <section aria-labelledby="context-heading" className="space-y-5 print:break-before-page">
          <div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-purple-300 print:text-slate-600">Contexto declarado</p><h2 id="context-heading" className="mt-2 text-3xl font-semibold">La realidad que completa el perfil</h2><p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400 print:text-slate-600">Estas respuestas fueron entregadas por ti. Se muestran como contexto, no como conclusiones de la evaluación conductual.</p></div>
          <Card className="border-slate-800 bg-slate-900/70 print:border-slate-300 print:bg-white"><CardContent className="grid gap-0 p-0 md:grid-cols-2">{contextRows.map(([label, value]) => <div key={label} className="border-b border-slate-800 p-5 odd:md:border-r print:border-slate-200"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p><p className="mt-2 text-sm leading-relaxed text-slate-200 print:text-slate-800">{value}</p></div>)}</CardContent></Card>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-slate-800 bg-slate-900/70 print:border-slate-300 print:bg-white"><CardHeader><Briefcase className="h-5 w-5" /><CardTitle className="text-lg">Habilidades objetivo</CardTitle></CardHeader><CardContent className="text-sm text-slate-400 print:text-slate-600">{report.context.targetSkills.length ? report.context.targetSkills.join(' · ') : 'No informadas'}</CardContent></Card>
            <Card className="border-slate-800 bg-slate-900/70 print:border-slate-300 print:bg-white"><CardHeader><CalendarDays className="h-5 w-5" /><CardTitle className="text-lg">Tiempo y estructura</CardTitle></CardHeader><CardContent className="space-y-2 text-sm text-slate-400 print:text-slate-600"><p>{present(report.context.availableTime)}</p><p>{present(report.context.planStyle)}</p></CardContent></Card>
            <Card className="border-slate-800 bg-slate-900/70 print:border-slate-300 print:bg-white"><CardHeader><ShieldCheck className="h-5 w-5" /><CardTitle className="text-lg">Barreras declaradas</CardTitle></CardHeader><CardContent className="text-sm text-slate-400 print:text-slate-600">{report.context.barriers.length ? report.context.barriers.join(' · ') : 'No informadas'}</CardContent></Card>
          </div>
        </section>

        <section aria-labelledby="bridge-heading" className="space-y-5">
          <div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300 print:text-slate-600">De la lectura a la evidencia</p><h2 id="bridge-heading" className="mt-2 text-3xl font-semibold">Cómo continúa tu recorrido</h2></div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ['A2 · Traducir', 'Convierte el objetivo y las tensiones observables en acciones, entregables y revisiones desde el primer ciclo de 30 días de Tu Ruta.'],
              ['A3 · Practicar', 'Contrasta el perfil con tu conducta en respuestas, conversaciones y simulaciones verificadas, con el primer checkpoint desde el Día 7.'],
              ['A4 · Observar', 'Conecta tu dirección profesional con señales de mercado y decisiones que puedan revisarse con evidencia.'],
            ].map(([title, body]) => <Card key={title} className="break-inside-avoid border-emerald-400/20 bg-emerald-400/5 print:border-slate-300 print:bg-white"><CardContent className="p-6"><p className="font-semibold text-emerald-200 print:text-slate-950">{title}</p><p className="mt-3 text-sm leading-relaxed text-slate-400 print:text-slate-600">{body}</p></CardContent></Card>)}
          </div>
        </section>

        <Card className="border-slate-800 bg-slate-900/70 print:break-before-page print:border-slate-300 print:bg-white">
          <CardHeader><CardTitle>Metodología, alcance y límites</CardTitle></CardHeader>
          <CardContent className="grid gap-5 text-sm leading-relaxed text-slate-400 print:text-slate-600 md:grid-cols-2">
            <p><strong className="text-slate-200 print:text-slate-900">Qué representa:</strong> una lectura de preferencias conductuales relativas obtenida mediante 28 elecciones “más/menos”, integrada con respuestas de contexto entregadas por el usuario.</p>
            <p><strong className="text-slate-200 print:text-slate-900">Qué no representa:</strong> un diagnóstico clínico, una evaluación de capacidad, una garantía de desempeño o una recomendación automática de cargo. Las hipótesis deben contrastarse con conducta y evidencia real.</p>
          </CardContent>
        </Card>

        <footer className="break-inside-avoid border-t border-slate-800 pt-5 text-xs leading-relaxed text-slate-500 print:border-slate-300 print:text-slate-600">
          <p><strong className="text-slate-300 print:text-slate-800">Documento personal de orientación.</strong> Generado el {displayDate(report.generatedAt)} con evidencia disponible hasta el {displayDate(report.assessmentDate)}.</p>
          <p className="mt-1">Este archivo reproduce el informe autenticado de DespegaTuCarrera. No constituye una certificación, diagnóstico ni garantía de desempeño.</p>
        </footer>

        <div className="flex flex-wrap gap-3 print:hidden">
          <Button asChild variant="outline"><Link href="/despega/reporte-integral">Ver reporte integral<ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
        </div>
        <div className="print:hidden">
          <PhaseTransitionHandler currentPhase="a1" isComplete nextPhaseLabel="Continuar a la introducción de Tu Ruta" nextPhaseUrl="/despega/a2/intro" />
        </div>
      </div>
    </main>
  )
}
