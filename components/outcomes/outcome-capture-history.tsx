'use client'

import { useEffect, useId, useState } from 'react'
import { Button } from '@/components/ui/button'
import { CAPTURE_INSTRUMENTS, type CaptureInstrument, type CaptureInstrumentKey } from '@/lib/outcomes/response-capture'
import { historyFromResponse, type CaptureHistory, type SavedCapture } from '@/lib/outcomes/response-history'

const dateLabel = (value: string) => new Intl.DateTimeFormat('es-CL', {
  dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Santiago',
}).format(new Date(value))

export function OutcomeCaptureHistory({ instrumentKey, refreshKey = 0 }: { instrumentKey: CaptureInstrumentKey; refreshKey?: number }) {
  const [history, setHistory] = useState<CaptureHistory | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [retry, setRetry] = useState(0)
  const id = useId()
  const instrument: CaptureInstrument = CAPTURE_INSTRUMENTS[instrumentKey]
  useEffect(() => {
    const controller = new AbortController()
    let current = true
    setHistory(null); setError(''); setLoading(true)
    const timer = setTimeout(() => controller.abort(), 10000)
    fetch('/api/outcomes/observations?instrument=' + encodeURIComponent(instrumentKey), {
      cache: 'no-store', signal: controller.signal,
    }).then(async response => {
      if (!response.ok) throw new Error(response.status === 401 ? 'session' : 'unavailable')
      return historyFromResponse(await response.json(), instrumentKey)
    }).then(value => { if (current) setHistory(value) })
      .catch(error => { if (current) setError(error instanceof Error && error.message === 'session'
        ? 'Vuelve a iniciar sesión para revisar tus registros.'
        : 'No pudimos recuperar tus respuestas. Esto no significa que no estén guardadas.') })
      .finally(() => { clearTimeout(timer); if (current) setLoading(false) })
    return () => { current = false; clearTimeout(timer); controller.abort() }
  }, [instrumentKey, refreshKey, retry])

  const record = (value: SavedCapture | null, label: string) => <div className="min-w-0 rounded-xl border border-border p-4">
    <h4 className="font-semibold">{label}</h4>
    {!value ? <p className="mt-2 text-sm text-muted-foreground">No hay un registro de esta etapa en la nueva versión.</p> : <>
      <p className="mt-1 text-xs text-muted-foreground"><time dateTime={value.observedAt}>{dateLabel(value.observedAt)}</time> · hora de Chile</p>
      <details className="mt-2">
        <summary className="min-h-11 cursor-pointer rounded-md py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Leer mis respuestas: {label.toLowerCase()}</summary>
        <dl className="mt-2 space-y-4">{instrument.prompts.map(({ key, label }) => <div key={key}>
          <dt className="text-sm font-semibold">{label}</dt>
          <dd className="mt-1 whitespace-pre-wrap break-words text-sm text-muted-foreground">{value.responsePayload[key]}</dd>
        </div>)}</dl>
      </details>
    </>}
  </div>
  return <section className="min-w-0 space-y-3 rounded-xl border border-border bg-background p-4" aria-labelledby={id} aria-busy={loading}>
    <h3 id={id} className="text-lg font-semibold">Mis respuestas: punto de partida y seguimiento</h3>
    <p className="text-sm leading-6 text-muted-foreground">Revisa lo que declaraste en cada momento. Comparar estos textos no demuestra por sí solo una mejora profesional. No hay una evaluación automática en curso.</p>
    {loading ? <p role="status" className="text-sm">Recuperando tus registros…</p>
      : error ? <div role="alert" className="space-y-2"><p className="text-sm">{error}</p><Button type="button" variant="outline" className="min-h-11" onClick={() => setRetry(value => value + 1)}>Reintentar lectura</Button></div>
      : history && <>
        {history.pairStatus === 'empty' ? <p className="text-sm">Todavía no hay respuestas guardadas en esta versión del ejercicio.</p> : <>
          <div className="grid min-w-0 gap-3 md:grid-cols-2">{record(history.baseline, 'Punto de partida')}{record(history.followUp, 'Seguimiento')}</div>
          {history.pairStatus === 'out_of_order' && <p className="text-sm">El punto de partida es posterior al seguimiento. No presentamos estos registros como un antes y después.</p>}
          {history.pairStatus === 'follow_up_only' && <p className="text-sm">Hay seguimiento, pero no un punto de partida de esta versión. No reconstruimos una respuesta anterior.</p>}
          {history.pairStatus === 'available' && <p className="text-sm">Tienes dos registros en orden temporal. Su calidad y cualquier cambio de capacidad siguen sin evaluar.</p>}
        </>}
        <p className="text-xs leading-5 text-muted-foreground">Se muestra el último registro de cada etapa de la versión de captura. Los registros anteriores no se modifican ni se mezclan con puntajes históricos.</p>
      </>}
  </section>
}
