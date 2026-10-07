'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowDown, CalendarDays, Loader2, Lock, RefreshCw } from 'lucide-react'
import { PageContainer, PageHeader, PageStack } from '@/components/layout/page-foundation'
import { EmptyState, ErrorState } from '@/components/layout/async-state'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { OutcomesChileSummary } from '@/lib/outcomes-chile/workspace'
import { OutcomeCaptureSection, OUTCOME_PRIMARY_BUTTON } from './capture-forms'
import { OutcomeFollowups } from './followups-panel'
import { ChileBenchmarkPanel, OutcomeHistory, OutcomeOverview } from './result-panels'
import { formatDate, loadOutcomesChile, OutcomesClientError, OUTCOMES_CHILE_SIGN_IN } from './client'

export function OutcomesChileExperience() {
  const [summary, setSummary] = useState<OutcomesChileSummary | null>(null)
  const [state, setState] = useState<'loading' | 'ready' | 'error' | 'session'>('loading')
  const [refreshing, setRefreshing] = useState(false)
  const activeRequest = useRef<AbortController | null>(null)
  const sequence = useRef(0)

  const refresh = useCallback(async () => {
    const current = ++sequence.current
    activeRequest.current?.abort()
    const controller = new AbortController()
    activeRequest.current = controller
    setRefreshing(true)
    try {
      const result = await loadOutcomesChile(controller.signal)
      if (controller.signal.aborted || current !== sequence.current) return
      setSummary(result)
      setState('ready')
    } catch (error) {
      if (controller.signal.aborted || current !== sequence.current) return
      setState(error instanceof OutcomesClientError && error.kind === 'session' ? 'session' : 'error')
    } finally {
      if (!controller.signal.aborted && current === sequence.current) setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
    return () => { sequence.current += 1; activeRequest.current?.abort() }
  }, [refresh])

  function sessionExpired() {
    sequence.current += 1
    activeRequest.current?.abort()
    setRefreshing(false)
    setState('session')
  }

  function openCapture() {
    const heading = document.getElementById('outcome-capture-title')
    heading?.focus({ preventScroll: true })
    heading?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }

  const callbacks = { onSaved: () => { void refresh() }, onRefresh: () => { void refresh() }, onSessionExpired: sessionExpired }
  return <PageContainer>
    <PageStack>
      <PageHeader eyebrow="Tu trayectoria, con evidencia" title="Mis resultados laborales"
        description="Reúne tus avances de búsqueda, cambios de trabajo e ingresos. Observa tu evolución con fechas y referencias claras."
        actions={<Button type="button" onClick={openCapture} disabled={!summary || state === 'session'} className={`gap-2 ${OUTCOME_PRIMARY_BUTTON}`}><ArrowDown className="h-4 w-4" aria-hidden="true" />Registrar un resultado</Button>} />

      {!summary && state === 'loading' && <Card><CardContent className="flex min-h-64 flex-col items-center justify-center gap-4 p-6 text-center" role="status" aria-live="polite">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground motion-reduce:animate-none" aria-hidden="true" /><h2 className="text-lg font-semibold">Preparando tus resultados…</h2><p className="max-w-md text-sm leading-6 text-muted-foreground">Estamos reuniendo tus registros y su estado de evidencia.</p>
      </CardContent></Card>}

      {state === 'session' && <Card><CardContent className="flex min-h-64 flex-col items-center justify-center gap-4 p-6 text-center" role="status">
        <Lock className="h-7 w-7 text-muted-foreground" aria-hidden="true" /><h2 className="text-xl font-semibold">Vuelve a ingresar para continuar</h2><p className="max-w-md text-sm leading-6 text-muted-foreground">Tu sesión terminó. Para consultar o guardar información personal, necesitas volver a ingresar.</p><Button asChild className={OUTCOME_PRIMARY_BUTTON}><Link href={OUTCOMES_CHILE_SIGN_IN}>Volver a ingresar</Link></Button>
        {summary && <p className="max-w-md text-xs leading-5 text-muted-foreground">Lo que aún no hayas guardado permanece sólo mientras mantengas abierta esta pantalla. No se recupera al salir o recargar.</p>}
      </CardContent></Card>}

      {!summary && state === 'error' && <ErrorState title="Tus resultados no están disponibles ahora" description="No pudimos cargar la información completa. Revisa tu conexión y vuelve a intentarlo en unos minutos." onRetry={() => { void refresh() }} />}

      {summary && <div hidden={state === 'session'}>
        <PageStack>
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
            <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4" aria-hidden="true" />Registros al {formatDate(summary.workspace.asOfDate)} · Chile</p>
            <Button type="button" variant="ghost" size="sm" onClick={() => { void refresh() }} disabled={refreshing} className="gap-2"><RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin motion-reduce:animate-none' : ''}`} aria-hidden="true" />{refreshing ? 'Actualizando…' : 'Actualizar'}</Button>
          </div>
          {state === 'error' && <div role="alert" className="flex flex-col gap-3 rounded-xl border border-amber-300/30 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100 sm:flex-row sm:items-center sm:justify-between">
            <p>No pudimos actualizar tus resultados. Sigues viendo la última consulta; los formularios conservan lo que escribiste mientras esta pantalla permanezca abierta.</p><Button type="button" variant="outline" onClick={() => { void refresh() }} disabled={refreshing} className="shrink-0">Reintentar consulta</Button>
          </div>}
          {summary.workspace.historyCount === 0 ? <EmptyState title="Tu primer registro abre este recorrido" description="Comienza con tu ingreso inicial, una postulación o un cambio de trabajo. Después podrás ver qué cambió y cómo siguió en el tiempo."
            action={<Button type="button" onClick={openCapture} className={OUTCOME_PRIMARY_BUTTON}>Agregar mi primer resultado</Button>} /> : <OutcomeOverview summary={summary} />}
          <div className="grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
            <OutcomeCaptureSection workspace={summary.workspace} {...callbacks} />
            <OutcomeFollowups summary={summary} {...callbacks} />
          </div>
          <div className="grid min-w-0 items-start gap-6 lg:grid-cols-2"><ChileBenchmarkPanel summary={summary} /><OutcomeHistory summary={summary} /></div>
          <details className="rounded-[var(--dtc-radius-lg)] border border-border bg-card/50 p-5 sm:p-6">
            <summary className="cursor-pointer rounded-md text-sm font-semibold leading-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Cómo leer estos resultados</summary>
            <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground"><p>“Declarado por ti” identifica un registro que ingresaste. “Con respaldo” indica corroboración; “Verificado” identifica evidencia revisada. Son estados distintos.</p><p>El cambio mensual compara dos mediciones de ingreso líquido con fechas diferentes. No ajusta por inflación, jornada o funciones. Cuando faltan datos o existen registros contradictorios, la comparación queda pendiente.</p><p>Una respuesta de seguimiento describe la situación al responder. Si se registra después de la fecha programada, no prueba por sí sola que la situación fuera igual en esa fecha.</p><p>{summary.impact.attribution.notice}</p></div>
          </details>
        </PageStack>
      </div>}
    </PageStack>
  </PageContainer>
}
