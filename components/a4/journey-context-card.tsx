import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import type { A4JourneyContext } from '@/lib/a4/journey-context'

function dateLabel(value: string | null) {
  return value ? new Intl.DateTimeFormat('es-CL', { dateStyle: 'medium', timeZone: 'America/Santiago' }).format(new Date(value)) : 'Sin fecha registrada'
}

export function JourneyContextCard({ context, canOpenA2 = false, canOpenA3 = false, compact = false }: {
  context: A4JourneyContext; canOpenA2?: boolean; canOpenA3?: boolean; compact?: boolean
}) {
  const unavailable = 'No disponible: no pudimos verificar esta fuente.'
  const sections = [
    { title: 'A1 · Autoconocimiento', source: 'Evaluación A1 registrada', href: context.a1.status === 'available' ? '/despega/a1-report' : context.a1.status === 'empty' ? '/despega/a1-cerebral' : '/despega/recorrido',
      value: context.a1.status === 'unavailable' ? unavailable : context.a1.status === 'empty' ? 'Sin evaluación completada registrada.' : `Evaluación completada · ${dateLabel(context.a1.completedAt)}` },
    { title: 'A2 · Ruta de desarrollo', source: 'Tareas completadas de tu ruta', href: canOpenA2 ? '/despega/a2' : '/despega/recorrido',
      value: context.a2.status === 'unavailable' ? unavailable : context.a2.status === 'empty' ? 'Sin días completados registrados.' : `${context.a2.completedDays} ${context.a2.completedDays === 1 ? 'día con tareas completadas' : 'días con tareas completadas'} · Último registro: ${dateLabel(context.a2.lastCompletedAt)}` },
    { title: 'A3 · Entrenamiento', source: 'Sesiones completadas de Entrenamiento', href: canOpenA3 ? '/despega/a3' : '/despega/recorrido',
      value: context.a3.status === 'unavailable' ? unavailable : context.a3.status === 'empty' ? 'Sin módulos completados registrados.' : `${context.a3.completedModules}/10 módulos con sesiones completadas · Último registro: ${dateLabel(context.a3.lastCompletedAt)}` },
  ]
  const records = <div className="grid gap-4 lg:grid-cols-3">
    {sections.map(section => <div key={section.title} className="rounded-xl border border-border bg-muted/20 p-4">
      <h3 className="font-semibold text-foreground">{section.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{section.value}</p>
      <p className="mt-3 text-xs text-muted-foreground">Fuente: {section.source}</p>
      <Link className="mt-3 inline-flex min-h-11 items-center rounded-sm text-sm font-medium text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" href={section.href}>Revisar mi recorrido<span className="sr-only"> · {section.title}</span></Link>
    </div>)}
  </div>
  return <Card className="border-border bg-card">
    <CardContent className="space-y-5 p-5 sm:p-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Tu contexto para explorar oportunidades</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Estos registros describen tu recorrido. No miden preparación laboral ni acreditan habilidades o requisitos de una oferta.</p>
        {context.identity.status === 'available' ? <p className="mt-3 break-words text-sm text-foreground"><span className="font-semibold">Objetivo declarado:</span> {context.identity.targetRole} <span className="text-muted-foreground">· Identidad profesional · {dateLabel(context.identity.updatedAt)}</span></p>
          : <p className="mt-3 text-sm text-muted-foreground">{context.identity.status === 'unavailable' ? 'Tu objetivo declarado no está disponible en este momento.' : 'Sin objetivo declarado registrado. Puedes elegirlo en los filtros de búsqueda.'}</p>}
      </div>
      {context.status === 'degraded' && <p role="status" className="rounded-lg border border-border bg-muted/40 p-3 text-sm text-muted-foreground">Parte del contexto no está disponible. Conservamos los registros que pudimos verificar; puedes seguir buscando ofertas y volver a cargar esta página para reintentar.</p>}
      {context.status === 'empty' && <p className="text-sm text-muted-foreground">Aún no hay registros completados para este contexto. Puedes seguir buscando con tus propios filtros.</p>}
      {compact ? <details className="rounded-lg border border-border p-3"><summary className="min-h-11 cursor-pointer rounded-sm py-2 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Ver registros de mi recorrido</summary><div className="mt-3">{records}</div></details> : records}
    </CardContent>
  </Card>
}
