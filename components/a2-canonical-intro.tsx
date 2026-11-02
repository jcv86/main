'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, BookOpen, Loader2, Target, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  createRequestId,
  DTC_REQUEST_ID_HEADER,
} from '@/lib/observability/request-id'
import type { A2A1Orientation } from '@/lib/a2/a1-orientation'
import type { A2PracticePath } from '@/lib/a2/practice-path'

interface TransitionPayload {
  success?: boolean
  nextPath?: string
  error?: string
  request_id?: string
}

export function A2CanonicalIntro({ orientation, practicePath = 'ambos' }: {
  orientation: A2A1Orientation
  practicePath?: A2PracticePath
}) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isPersonal = practicePath === 'persona'

  const beginRoute = async () => {
    if (!orientation.canContinue || submitting) return
    setSubmitting(true)
    setError(null)
    try {
      const requestId = createRequestId()
      const response = await fetch('/api/journey/transition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          [DTC_REQUEST_ID_HEADER]: requestId,
        },
        credentials: 'include',
        body: JSON.stringify({ step: 'a2_intro' }),
      })
      const payload = (await response.json().catch(() => ({}))) as TransitionPayload
      const supportId = payload.request_id || response.headers.get(DTC_REQUEST_ID_HEADER) || requestId
      if (!response.ok || !payload.nextPath) {
        throw new Error(`${payload.error || 'No pudimos iniciar Tu Ruta.'} Código de soporte: ${supportId}`)
      }

      router.push(payload.nextPath)
      router.refresh()
    } catch (transitionError) {
      setError(
        transitionError instanceof Error
          ? transitionError.message
          : 'No pudimos iniciar Tu Ruta.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <article className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-4xl space-y-8">
        <header className="space-y-4 text-center">
          <Badge variant="secondary">A2 · Tu Ruta</Badge>
          <h1 className="text-4xl font-semibold text-foreground md:text-6xl">
            Convierte tu objetivo en acción
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Tu Ruta conecta tu objetivo, tus respuestas y la práctica en un primer
            ciclo de 30 días, ampliable a 60 y 90 cuando decidas continuar.
          </p>
        </header>

        <Card className="border-border bg-card">
          <CardContent className="space-y-6 pt-7">
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">Tu punto de partida</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{orientation.summary}</p>
              {orientation.patternMessage ? (
                <p role="status" className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm leading-relaxed text-foreground">
                  {orientation.patternMessage}
                </p>
              ) : null}
            </div>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Objetivo que declaraste</dt>
                <dd className="mt-2 whitespace-pre-wrap break-words text-sm text-foreground">{orientation.context.objective || 'Aún no hay un objetivo declarado.'}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tiempo disponible</dt>
                <dd className="mt-2 whitespace-pre-wrap break-words text-sm text-foreground">{orientation.context.availableTime || 'Aún no has indicado tu disponibilidad.'}</dd>
              </div>
              {orientation.context.targetRole ? <div className="sm:col-span-2">
                <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rol que te interesa</dt>
                <dd className="mt-2 whitespace-pre-wrap break-words text-sm text-foreground">{orientation.context.targetRole}</dd>
              </div> : null}
            </dl>
            {orientation.recognition ? <div className="rounded-xl border border-emerald-500/30 p-4 text-sm">
              <p className="text-foreground">Sobre la lectura de A1 indicaste: <strong>{orientation.recognition.label}</strong>.</p>
              {orientation.recognition.id !== 'represents' ? <p className="mt-2 text-muted-foreground">Conservamos ese matiz. Puedes revisar la lectura y usar la práctica para explorar qué se ajusta a tu situación.</p> : null}
            </div> : null}
            {orientation.clarifications.length > 0 ? <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Los matices que añadiste</h3>
              <dl className="space-y-3">{orientation.clarifications.map((item) => <div key={item.domain}>
                <dt className="text-sm font-medium text-foreground">{item.title}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.statement}{!item.isEvidence ? ' · Queda pendiente un ejemplo de esa situación.' : ''}</dd>
              </div>)}</dl>
            </div> : null}
            {orientation.clarificationNotice ? <p role="status" className="text-sm leading-relaxed text-muted-foreground">{orientation.clarificationNotice}</p> : null}
            {orientation.domains.length > 0 ? <details className="rounded-xl border border-border p-4">
              <summary className="cursor-pointer text-sm font-semibold text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">Revisar las respuestas de A1</summary>
              <div className="mt-4 space-y-5">{orientation.domains.map((domain) => <section key={domain.id} aria-labelledby={`a2-origin-${domain.id}`}>
                <h3 id={`a2-origin-${domain.id}`} className="text-sm font-semibold text-foreground">{domain.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{domain.reading}</p>
                <ul className="mt-3 space-y-3">{domain.evidence.map((item) => <li key={item.questionId} className="border-l-2 border-border pl-3 text-sm leading-relaxed text-muted-foreground">
                  <p className="font-medium">{item.question}</p>
                  <p>Más como tú: «{item.more}».</p>
                  <p>Menos como tú: «{item.less}».</p>
                </li>)}</ul>
              </section>)}</div>
            </details> : null}
            <p className="text-sm leading-relaxed text-muted-foreground">{orientation.state === 'current'
              ? 'Estas elecciones describen preferencias en las situaciones del cuestionario. La práctica aportará evidencia para decidir qué trabajar.'
              : 'Tu objetivo y disponibilidad siguen siendo la referencia para organizar la práctica.'}</p>
            <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm font-medium">
              <Link href="/despega/a1-report" className="text-primary underline underline-offset-4">Revisar mi informe A1</Link>
              <Link href="/despega/conozcamonos-2" className="text-primary underline underline-offset-4">Revisar mi objetivo y disponibilidad</Link>
            </div>
          </CardContent>
        </Card>

        <section className="grid gap-4 md:grid-cols-3">
          <Card className="border-cyan-500/20 bg-cyan-500/5">
            <CardHeader>
              <Zap className="h-6 w-6 text-cyan-300" />
              <CardTitle>Ciclo inicial</CardTitle>
              <CardDescription>30 días</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Acciones concretas, evidencia y revisiones para establecer una base real.
            </CardContent>
          </Card>
          <Card className="border-purple-500/20 bg-purple-500/5">
            <CardHeader>
              <Target className="h-6 w-6 text-purple-300" />
              <CardTitle>Extensión opcional</CardTitle>
              <CardDescription>60 días</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Profundización basada en tus resultados, no una obligación automática.
            </CardContent>
          </Card>
          <Card className="border-emerald-500/20 bg-emerald-500/5">
            <CardHeader>
              <BookOpen className="h-6 w-6 text-emerald-300" />
              <CardTitle>Integración</CardTitle>
              <CardDescription>90 días</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {isPersonal
                ? 'Consolidación de lo practicado, revisión de tus evidencias y próximos pasos para tu objetivo.'
                : 'Consolidación, mercado real y checkpoints progresivos de Entrenamiento.'}
            </CardContent>
          </Card>
        </section>

        <Card className="border-indigo-500/30 bg-indigo-500/10 p-6">
          <p className="text-sm leading-relaxed text-foreground">
            {isPersonal
              ? 'En tu camino personal, las revisiones y el cierre continúan en Tu Ruta. Entrenamiento para entrevistas es opcional; puedes explorarlo cuando esté disponible y se relacione con tu objetivo.'
              : 'Entrenamiento no espera al final de Tu Ruta: se abre en checkpoints desde el Día 7. Cada módulo utiliza la evidencia que construiste en A1 y A2.'}
          </p>
        </Card>

        {error && (
          <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-foreground">
            {error}
          </p>
        )}

        <Button
          onClick={() => void beginRoute()}
          disabled={submitting || !orientation.canContinue}
          className="h-14 w-full bg-indigo-600 text-base font-semibold text-white hover:bg-indigo-500"
        >
          {submitting ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <ArrowRight className="mr-2 h-5 w-5" />
          )}
          Comenzar Tu Ruta de 30 días
        </Button>
      </div>
    </article>
  )
}
