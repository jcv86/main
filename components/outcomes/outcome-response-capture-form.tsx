'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  CAPTURE_INSTRUMENTS, MAX_RESPONSE_CHARACTERS, OUTCOME_CAPTURE_VERSION,
  captureNextAction, isRecord, responseWordCount,
  type CaptureInstrumentKey, type MeasurementRole,
} from '@/lib/outcomes/response-capture'

export interface OutcomeCaptureFormProps { role: MeasurementRole; onSaved?: () => void }

/** Reuses the existing A1/A2/A3 entry points; capturing answers is not grading capability. */
export function OutcomeResponseCaptureForm({ instrumentKey, role, onSaved }: OutcomeCaptureFormProps & { instrumentKey: CaptureInstrumentKey }) {
  const instrument = CAPTURE_INSTRUMENTS[instrumentKey]
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const requestRef = useRef<AbortController | null>(null)
  const retryRef = useRef<{ fingerprint: string; id: string } | null>(null)
  const mountedRef = useRef(true)
  const busyRef = useRef(false)
  const formId = useId()
  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false; requestRef.current?.abort() }
  }, [])
  const complete = instrument.prompts.every(({ key }) => {
    const value = responses[key] ?? ''
    return value.length <= MAX_RESPONSE_CHARACTERS && responseWordCount(value) >= instrument.minimumWords
  })

  async function save() {
    if (!complete || busyRef.current || saved) return
    busyRef.current = true
    setSaving(true); setError('')
    const controller = new AbortController()
    requestRef.current = controller
    const timer = setTimeout(() => controller.abort(), 15000)
    try {
      const responsePayload = Object.fromEntries(instrument.prompts.map(({ key }) => [key, responses[key].trim()]))
      const fingerprint = JSON.stringify({ instrumentKey, role, responsePayload })
      if (retryRef.current?.fingerprint !== fingerprint) {
        retryRef.current = { fingerprint, id: crypto.randomUUID() }
      }
      const observationId = retryRef.current.id
      const response = await fetch('/api/outcomes/observations', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: controller.signal,
        body: JSON.stringify({ observationId, instrumentKey, instrumentVersion: OUTCOME_CAPTURE_VERSION,
          outcomeKey: instrument.outcomeKey, measurementRole: role, responsePayload }),
      })
      const body: unknown = await response.json()
      if (!mountedRef.current) return
      if (!response.ok) {
        const message = response.status === 401 ? 'Vuelve a iniciar sesión. No cierres esta página antes de conservar tus respuestas.'
          : response.status === 409 ? 'No pudimos confirmar este registro. Conserva tus respuestas y revisa el estado antes de reenviarlo.'
          : response.status === 400 || response.status === 413 ? 'Revisa la extensión y las respuestas requeridas del ejercicio.'
          : 'No pudimos confirmar el guardado. Tus respuestas siguen aquí; puedes reintentar.'
        setError(message); return
      }
      if (!isRecord(body) || body.stored !== true || body.observationId !== observationId
          || body.instrumentVersion !== OUTCOME_CAPTURE_VERSION
          || body.measurementStatus !== 'recorded_pending_evaluation') {
        setError('La respuesta del servidor no permite confirmar el guardado. Conservamos tu texto.'); return
      }
      setSaved(true)
    } catch {
      if (mountedRef.current) setError('La conexión no permitió confirmar el guardado. Conservamos tus respuestas; reintentar no debe duplicar el mismo registro.')
    } finally {
      clearTimeout(timer)
      busyRef.current = false
      if (mountedRef.current) setSaving(false)
    }
  }

  return <section className="min-w-0 space-y-5 rounded-2xl border border-border bg-card p-4 sm:p-6" aria-labelledby={formId + '-title'}>
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{role === 'baseline' ? 'Tu punto de partida' : 'Tu registro de seguimiento'}</p>
      <h2 id={formId + '-title'} className="mt-2 text-2xl font-bold">{instrument.label}</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Registra con tus propias palabras lo que puedes explicar hoy y qué lo respalda. Este ejercicio no asigna una nota de capacidad ni una probabilidad de conseguir empleo.
      </p>
    </div>
    {saved ? <div className="space-y-4">
      <div role="status" className="rounded-xl border border-border p-4">
        <h3 className="font-semibold">Tus respuestas quedaron guardadas</h3>
        <p className="mt-2 text-sm">Estado: registradas, pendientes de evaluación.</p>
        <p className="mt-2 text-sm text-muted-foreground">Guardar un ejercicio no demuestra una mejora. Para afirmarla se necesita una evaluación válida de evidencia comparable; no basta con escribir más o usar ciertas palabras.</p>
      </div>
      <details className="rounded-xl border border-border p-4">
        <summary className="min-h-11 cursor-pointer font-medium">Revisar lo que guardé</summary>
        <dl className="mt-3 space-y-4">{instrument.prompts.map(({ key, label }) => <div key={key}>
          <dt className="text-sm font-semibold">{label}</dt>
          <dd className="mt-1 whitespace-pre-wrap break-words text-sm text-muted-foreground">{responses[key]}</dd>
        </div>)}</dl>
      </details>
      <p className="text-sm leading-6"><strong>Tu siguiente paso: </strong>{captureNextAction(instrument, role)}</p>
      {onSaved && <Button type="button" className="min-h-11 w-full" onClick={onSaved}>Continuar mi recorrido</Button>}
    </div> : <form className="space-y-5" onSubmit={event => { event.preventDefault(); void save() }}>
      {instrument.prompts.map(({ key, label, prompt }) => <div key={key} className="space-y-2">
        <label htmlFor={formId + '-' + key} className="block text-sm font-semibold">{label}</label>
        <p id={formId + '-' + key + '-help'} className="text-sm text-muted-foreground">{prompt}</p>
        <Textarea id={formId + '-' + key} aria-describedby={formId + '-' + key + '-help'}
          value={responses[key] ?? ''} rows={4} maxLength={MAX_RESPONSE_CHARACTERS} disabled={saving}
          onChange={event => { setResponses(current => ({ ...current, [key]: event.target.value })); setError('') }} />
      </div>)}
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={!complete || saving} className="min-h-11 w-full">
        {saving ? 'Guardando respuestas…' : role === 'baseline' ? 'Guardar mi punto de partida' : 'Guardar mi seguimiento'}
      </Button>
      <p className="text-xs leading-5 text-muted-foreground">Cada respuesta admite entre {instrument.minimumWords} palabras y {MAX_RESPONSE_CHARACTERS} caracteres. Es un límite del formulario, no una medida de la calidad de tu respuesta. No reconstruyas respuestas pasadas: este registro cuenta desde ahora.</p>
    </form>}
  </section>
}
