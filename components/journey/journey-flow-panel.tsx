import Link from 'next/link'
import { ArrowRight, CheckCircle2, Lock, Circle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { JourneyFlow } from '@/lib/journey/flow'

const labels = { locked: 'Pendiente de habilitación', completed: 'Completado', active: 'En curso', available: 'Disponible' }

export function JourneyFlowPanel({ flow }: { flow: JourneyFlow }) {
  return <section aria-labelledby="flow-heading" className="space-y-6" data-dtc-flow>
    <header className="max-w-3xl space-y-3">
      <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Un recorrido, cuatro etapas</p>
      <h1 id="flow-heading" className="text-3xl font-semibold sm:text-4xl">Tu siguiente paso tiene contexto</h1>
      <p className="text-sm leading-relaxed text-muted-foreground">A1 aporta autoconocimiento; A2 organiza acciones; A3 permite practicar; A4 conecta señales y decisiones. Cada etapa conserva un significado distinto.</p>
    </header>
    <section aria-labelledby="flow-next-heading" className="rounded-2xl border border-border bg-card p-5 sm:p-7">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tu siguiente acción</p>
      <h2 id="flow-next-heading" className="mt-3 text-2xl font-semibold">{flow.next.title}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">{flow.next.description}</p>
      <Button asChild className="mt-5 h-auto min-h-11 whitespace-normal bg-emerald-700 py-3 text-white hover:bg-emerald-800"><Link href={flow.next.href} data-next-step>{flow.next.label}<ArrowRight aria-hidden="true" className="ml-2 h-4 w-4 shrink-0" /></Link></Button>
    </section>
    <nav aria-label="Etapas y requisitos del recorrido A1 a A4" className="grid gap-4 md:grid-cols-2">
      {flow.cards.map(card => <article key={card.id} className="flex min-w-0 flex-col rounded-2xl border border-border bg-card p-5 sm:p-6" data-stage-id={card.id}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold">{card.id}</p>
          <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">{card.state === 'locked' ? <Lock aria-hidden="true" className="h-4 w-4" /> : card.state === 'completed' ? <CheckCircle2 aria-hidden="true" className="h-4 w-4" /> : <Circle aria-hidden="true" className="h-3 w-3" />}{labels[card.state as keyof typeof labels]}</span>
        </div>
        <h2 className="mt-3 text-xl font-semibold">{card.title}</h2>
        <p className="mt-3 text-sm leading-relaxed">{card.purpose}</p>
        <p className="mt-3 text-sm font-medium">{card.detail}</p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{card.carried}</p>
        {card.href ? <Button asChild variant="outline" className="mt-5"><Link href={card.href}>Abrir {card.id}<ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" /></Link></Button> : <p className="mt-5 rounded-xl border border-border p-3 text-xs leading-relaxed text-muted-foreground">Esta vista no habilita etapas ni modifica tu progreso. El servidor verifica los requisitos al ingresar.</p>}
      </article>)}
    </nav>
    <section aria-label="Cómo se cuenta el progreso" className="rounded-2xl border border-border p-5">
      <h2 className="text-lg font-semibold">Progreso registrado, no supuesto</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Tu ciclo activo de A2 es de {flow.activeHorizon} días: {flow.cycleCompletedDays} tienen una finalización registrada. Un día habilitado no se cuenta como completado y una ampliación a 60/90 no ocurre desde esta página.</p>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">A4 necesita el cierre registrado de la ruta de Entrenamiento y acceso autorizado. No basta con llegar a diez sesiones ni con una etiqueta antigua.</p>
    </section>
    <div className="flex flex-wrap gap-3"><Button asChild variant="outline"><Link href="/despega/dashboard">Volver al panel</Link></Button><Button asChild variant="outline"><Link href="/despega/reporte-integral">Ver mi reporte integral</Link></Button></div>
  </section>
}
