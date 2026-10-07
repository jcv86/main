'use client'

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import Link from 'next/link'
import { CheckCircle2, Loader2, Plus, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { ChileWorkspace } from '@/lib/outcomes-chile/workspace'
import {
  createOutcomeSubmissionSession, eventTimestamp, formatDate, localDateTimeValue,
  OutcomesClientError, OUTCOMES_CHILE_SIGN_IN, type OutcomeCapturePayload,
} from './client'

export interface CaptureCallbacks {
  onSaved: () => void
  onRefresh: () => void
  onSessionExpired: () => void
}

// Existing brand tokens with sufficient contrast for the button's small white label.
export const OUTCOME_PRIMARY_BUTTON = 'bg-[var(--dtc-indigo-600)] text-white hover:bg-[var(--dtc-indigo-700)]'

type SubmissionState = { phase: 'idle' | 'saving' | 'saved' | 'error'; error?: OutcomesClientError; replay?: boolean }

export function useOutcomeSubmission(callbacks: CaptureCallbacks) {
  const session = useRef<ReturnType<typeof createOutcomeSubmissionSession> | null>(null)
  if (!session.current) session.current = createOutcomeSubmissionSession()
  const busy = useRef(false)
  const mounted = useRef(true)
  const [state, setState] = useState<SubmissionState>({ phase: 'idle' })
  useEffect(() => { mounted.current = true; return () => { mounted.current = false } }, [])

  function report(error: unknown) {
    const safeError = error instanceof OutcomesClientError ? error
      : new OutcomesClientError('unconfirmed', 'No pudimos confirmar el guardado. Reintenta con los mismos datos.')
    setState({ phase: 'error', error: safeError })
    if (safeError.kind === 'session') callbacks.onSessionExpired()
  }

  async function submit(payload: OutcomeCapturePayload) {
    // React may batch button state updates; this lock takes effect synchronously.
    if (busy.current) return
    busy.current = true
    setState({ phase: 'saving' })
    try {
      const result = await session.current!.send(payload)
      if (!mounted.current) return
      setState({ phase: 'saved', replay: result === 'already_saved' })
      callbacks.onSaved()
    } catch (error) {
      if (mounted.current) report(error)
    } finally {
      busy.current = false
    }
  }

  return {
    state, submit, report,
    clearMessage: () => { if (!busy.current) setState({ phase: 'idle' }) },
    reset: () => {
      if (busy.current || !session.current!.reset()) return false
      setState({ phase: 'idle' })
      return true
    },
  }
}

export function FormField({ id, label, hint, children }: { id: string; label: string; hint?: string; children: ReactNode }) {
  return <div className="min-w-0 space-y-2">
    <label htmlFor={id} className="block text-sm font-medium text-foreground">{label}</label>
    {children}
    {hint && <p id={`${id}-hint`} className="text-xs leading-5 text-muted-foreground">{hint}</p>}
  </div>
}

export const SELECT_CLASS = 'h-11 w-full min-w-0 rounded-[12px] border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50'

export function SubmissionNotice({ state, onRefresh }: { state: SubmissionState; onRefresh: () => void }) {
  const errorRef = useRef<HTMLDivElement>(null)
  const savedRef = useRef<HTMLDivElement>(null)
  useEffect(() => { if (state.phase === 'error') errorRef.current?.focus() }, [state.phase, state.error])
  useEffect(() => { if (state.phase === 'saved') savedRef.current?.focus() }, [state.phase])
  if (state.phase === 'saved') return <div ref={savedRef} role="status" tabIndex={-1} className="flex items-start gap-2 rounded-xl border border-emerald-400/25 bg-emerald-400/10 p-4 text-sm text-emerald-200 outline-none focus-visible:ring-2 focus-visible:ring-ring">
    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
    <p>{state.replay ? 'Este registro ya estaba guardado. Actualizamos tus resultados.' : 'Registro guardado. Ya puedes revisar tu avance.'}</p>
  </div>
  if (state.phase !== 'error' || !state.error) return null
  return <div ref={errorRef} role="alert" tabIndex={-1} className="space-y-3 rounded-xl border border-amber-300/30 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100 outline-none focus-visible:ring-2 focus-visible:ring-ring">
    <p>{state.error.message}</p>
    {state.error.kind === 'session' && <Button asChild variant="outline"><Link href={OUTCOMES_CHILE_SIGN_IN}>Volver a ingresar</Link></Button>}
    {state.error.refreshSuggested && <Button type="button" variant="outline" onClick={onRefresh} className="gap-2"><RefreshCw className="h-4 w-4" aria-hidden="true" />Actualizar resultados</Button>}
  </div>
}

function FormActions({ state, label, newLabel, onNew }: { state: SubmissionState; label: string; newLabel: string; onNew: () => void }) {
  return <div className="flex flex-col gap-3 border-t border-border/70 pt-5 sm:flex-row sm:items-center sm:justify-between">
    <p className="max-w-sm text-xs leading-5 text-muted-foreground">Este registro quedará como declarado por ti. La revisión de evidencia es independiente.</p>
    {state.phase === 'saved'
      ? <Button key="new-record" type="button" variant="outline" onClick={event => { event.preventDefault(); onNew() }} className="h-auto min-h-11 shrink-0 gap-2 whitespace-normal"><Plus className="h-4 w-4 shrink-0" aria-hidden="true" />{newLabel}</Button>
      : <Button key="submit-record" type="submit" disabled={state.phase === 'saving'} className={`h-auto min-h-11 shrink-0 gap-2 whitespace-normal ${OUTCOME_PRIMARY_BUTTON}`}>
        {state.phase === 'saving' && <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />}
        {state.phase === 'saving' ? 'Guardando…' : state.phase === 'error' ? `Reintentar: ${label.toLowerCase()}` : label}
      </Button>}
  </div>
}

const CHANNELS = [['dtc_a4', 'Radar Estratégico de DTC'], ['linkedin', 'LinkedIn'], ['job_board', 'Portal de empleo'], ['referral', 'Recomendación'], ['direct', 'Contacto directo'], ['recruiter', 'Reclutador'], ['other', 'Otro']] as const
const EVENT_TYPES = [['application', 'Postulación enviada'], ['employer_response', 'Respuesta de una empresa'], ['screening', 'Evaluación inicial'], ['interview', 'Entrevista realizada'], ['process_advance', 'Avance en el proceso'], ['offer', 'Oferta recibida'], ['rejection', 'El proceso no continuó'], ['withdrawal', 'Me retiré del proceso']] as const

function EventForm(props: CaptureCallbacks) {
  const submission = useOutcomeSubmission(props)
  const firstField = useRef<HTMLSelectElement>(null)
  const [eventType, setEventType] = useState('application')
  const [occurredAt, setOccurredAt] = useState('')
  const [targetRole, setTargetRole] = useState('')
  const [sourceChannel, setSourceChannel] = useState('')
  const [zone, setZone] = useState('tu dispositivo')
  useEffect(() => {
    setOccurredAt(localDateTimeValue())
    setZone(Intl.DateTimeFormat().resolvedOptions().timeZone.replaceAll('_', ' '))
  }, [])
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      void submission.submit({ action: 'job_search_event', eventType, occurredAt: eventTimestamp(occurredAt),
        targetRole: targetRole.trim() || null, sourceChannel: sourceChannel || null, regionCode: null, occupationCode: null })
    } catch (error) { submission.report(error) }
  }
  function newRecord() {
    if (!submission.reset()) return
    setEventType('application'); setOccurredAt(localDateTimeValue()); setTargetRole(''); setSourceChannel('')
    firstField.current?.focus()
  }
  return <form onSubmit={submit} onChange={submission.clearMessage} className="space-y-5" aria-label="Registrar evento de búsqueda">
    <div><h3 className="text-lg font-semibold">Un paso en tu búsqueda</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">Registra lo que ya ocurrió para seguir tus postulaciones y conversaciones.</p></div>
    <fieldset disabled={submission.state.phase === 'saving'} className="grid min-w-0 gap-5 sm:grid-cols-2">
      <legend className="sr-only">Datos del evento de búsqueda</legend>
      <FormField id="outcome-event-type" label="¿Qué ocurrió?">
        <select ref={firstField} id="outcome-event-type" value={eventType} onChange={event => setEventType(event.target.value)} className={SELECT_CLASS} required>
          {EVENT_TYPES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </FormField>
      <FormField id="outcome-event-date" label="Fecha y hora" hint={`Según la zona horaria de tu dispositivo: ${zone}.`}>
        <Input id="outcome-event-date" type="datetime-local" value={occurredAt} onChange={event => setOccurredAt(event.target.value)} aria-describedby="outcome-event-date-hint" required className="min-w-0" />
      </FormField>
      <FormField id="outcome-event-role" label="Cargo al que postulaste (opcional)">
        <Input id="outcome-event-role" value={targetRole} onChange={event => setTargetRole(event.target.value)} maxLength={160} placeholder="Ej. Analista de operaciones" autoComplete="off" />
      </FormField>
      <FormField id="outcome-event-channel" label="¿Dónde surgió? (opcional)">
        <select id="outcome-event-channel" value={sourceChannel} onChange={event => setSourceChannel(event.target.value)} className={SELECT_CLASS}>
          <option value="">Sin especificar</option>{CHANNELS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </FormField>
    </fieldset>
    <SubmissionNotice state={submission.state} onRefresh={props.onRefresh} />
    <FormActions state={submission.state} label="Guardar evento" newLabel="Registrar otro evento" onNew={newRecord} />
  </form>
}

function EmploymentForm({ asOfDate, ...props }: CaptureCallbacks & { asOfDate: string }) {
  const submission = useOutcomeSubmission(props)
  const firstField = useRef<HTMLSelectElement>(null)
  const [outcomeType, setOutcomeType] = useState('job_started')
  const [effectiveDate, setEffectiveDate] = useState(asOfDate)
  const [roleTitle, setRoleTitle] = useState('')
  const [workMode, setWorkMode] = useState('')
  const [employmentCategory, setEmploymentCategory] = useState('')
  const [sourceChannel, setSourceChannel] = useState('')
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!roleTitle.trim()) { submission.report(new OutcomesClientError('validation', 'Escribe el nombre del cargo para guardar el trabajo.')); return }
    void submission.submit({ action: 'employment_outcome', outcomeType, effectiveDate, roleTitle: roleTitle.trim(),
      workMode: workMode || null, employmentCategory: employmentCategory || null, sourceChannel: sourceChannel || null,
      regionCode: null, occupationCode: null })
  }
  function newRecord() {
    if (!submission.reset()) return
    setOutcomeType('job_started'); setEffectiveDate(asOfDate); setRoleTitle(''); setWorkMode(''); setEmploymentCategory(''); setSourceChannel('')
    firstField.current?.focus()
  }
  return <form onSubmit={submit} onChange={submission.clearMessage} className="space-y-5" aria-label="Registrar trabajo">
    <div><h3 className="text-lg font-semibold">Un cambio en tu trabajo</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">Un nuevo empleo, una promoción o un cambio de cargo también forman parte de tu evolución.</p></div>
    <fieldset disabled={submission.state.phase === 'saving'} className="min-w-0 space-y-5">
      <legend className="sr-only">Datos del trabajo</legend>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="outcome-work-type" label="Tipo de cambio">
          <select ref={firstField} id="outcome-work-type" value={outcomeType} onChange={event => setOutcomeType(event.target.value)} className={SELECT_CLASS} required>
            <option value="job_started">Comencé un nuevo empleo</option><option value="role_change">Cambié de cargo</option><option value="promotion">Recibí una promoción</option><option value="return_to_work">Regresé al trabajo</option>
          </select>
        </FormField>
        <FormField id="outcome-work-date" label="Fecha en que comenzó" hint="Fecha del cambio laboral, según el calendario de Chile.">
          <Input id="outcome-work-date" type="date" value={effectiveDate} max={asOfDate} onChange={event => setEffectiveDate(event.target.value)} aria-describedby="outcome-work-date-hint" required />
        </FormField>
      </div>
      <FormField id="outcome-work-role" label="Nombre del cargo">
        <Input id="outcome-work-role" value={roleTitle} onChange={event => setRoleTitle(event.target.value)} maxLength={160} placeholder="Ej. Coordinador de proyectos" required autoComplete="off" />
      </FormField>
      <details className="rounded-xl border border-border bg-background/30 p-4">
        <summary className="cursor-pointer rounded-md text-sm font-medium leading-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Agregar contexto del trabajo (opcional)</summary>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <FormField id="outcome-work-category" label="Categoría laboral">
            <select id="outcome-work-category" value={employmentCategory} onChange={event => setEmploymentCategory(event.target.value)} className={SELECT_CLASS}>
              <option value="">Sin especificar</option><option value="private_employee">Empleado del sector privado</option><option value="public_employee">Empleado del sector público</option><option value="self_employed">Trabajo por cuenta propia</option><option value="employer">Empleador</option><option value="other">Otra categoría</option>
            </select>
          </FormField>
          <FormField id="outcome-work-mode" label="Modalidad">
            <select id="outcome-work-mode" value={workMode} onChange={event => setWorkMode(event.target.value)} className={SELECT_CLASS}>
              <option value="">Sin especificar</option><option value="onsite">Presencial</option><option value="hybrid">Híbrida</option><option value="remote">Remota</option>
            </select>
          </FormField>
          <FormField id="outcome-work-channel" label="¿Dónde surgió la oportunidad?">
            <select id="outcome-work-channel" value={sourceChannel} onChange={event => setSourceChannel(event.target.value)} className={SELECT_CLASS}>
              <option value="">Sin especificar</option>{CHANNELS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </FormField>
        </div>
      </details>
    </fieldset>
    <p className="text-xs leading-5 text-muted-foreground">Al guardar un trabajo, se programan seguimientos a 30, 90 y 180 días. Podrás responderlos cuando llegue su fecha.</p>
    <SubmissionNotice state={submission.state} onRefresh={props.onRefresh} />
    <FormActions state={submission.state} label="Guardar trabajo" newLabel="Registrar otro trabajo" onNew={newRecord} />
  </form>
}

function SalaryForm({ workspace, ...props }: CaptureCallbacks & { workspace: ChileWorkspace }) {
  const submission = useOutcomeSubmission(props)
  const firstField = useRef<HTMLSelectElement>(null)
  const [measurementRole, setMeasurementRole] = useState('baseline')
  const [measuredAt, setMeasuredAt] = useState(workspace.asOfDate)
  const [monthlyNetClp, setMonthlyNetClp] = useState('')
  const [employmentOutcomeId, setEmploymentOutcomeId] = useState('')
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const amount = Number(monthlyNetClp)
    if (!monthlyNetClp.trim() || !Number.isInteger(amount) || amount < 0 || amount > 100_000_000) {
      submission.report(new OutcomesClientError('validation', 'Ingresa un monto mensual en pesos, entre $0 y $100.000.000, sin decimales.')); return
    }
    void submission.submit({ action: 'salary_outcome', measurementRole, monthlyNetClp: amount, measuredAt, employmentOutcomeId: employmentOutcomeId || null })
  }
  function newRecord() {
    if (!submission.reset()) return
    setMeasurementRole('follow_up'); setMeasuredAt(workspace.asOfDate); setMonthlyNetClp(''); setEmploymentOutcomeId('')
    firstField.current?.focus()
  }
  return <form onSubmit={submit} onChange={submission.clearMessage} className="space-y-5" aria-label="Registrar ingreso">
    <div><h3 className="text-lg font-semibold">Tu ingreso, con fecha y contexto</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">Registra el monto líquido mensual que recibes. Tu ingreso inicial será el punto de partida para comparar mediciones posteriores.</p></div>
    <fieldset disabled={submission.state.phase === 'saving'} className="grid min-w-0 gap-5 sm:grid-cols-2">
      <legend className="sr-only">Datos del ingreso</legend>
      <FormField id="outcome-salary-type" label="¿Qué ingreso estás registrando?">
        <select ref={firstField} id="outcome-salary-type" value={measurementRole} onChange={event => setMeasurementRole(event.target.value)} className={SELECT_CLASS} required>
          <option value="baseline">Ingreso inicial, como punto de partida</option><option value="new_role">Ingreso de un nuevo cargo</option><option value="follow_up">Actualización de mi ingreso</option>
        </select>
      </FormField>
      <FormField id="outcome-salary-date" label="Fecha de este ingreso" hint="Para comparar, el ingreso inicial debe tener una fecha anterior a la nueva medición.">
        <Input id="outcome-salary-date" type="date" value={measuredAt} max={workspace.asOfDate} onChange={event => setMeasuredAt(event.target.value)} aria-describedby="outcome-salary-date-hint" required />
      </FormField>
      <FormField id="outcome-salary-amount" label="Ingreso líquido mensual (CLP)" hint="En pesos, sin puntos ni decimales. $0 es válido si corresponde a tu ingreso.">
        <Input id="outcome-salary-amount" type="number" inputMode="numeric" min={0} max={100_000_000} step={1} value={monthlyNetClp} onChange={event => setMonthlyNetClp(event.target.value)} placeholder="Ej. 850000" aria-describedby="outcome-salary-amount-hint" required autoComplete="off" />
      </FormField>
      <FormField id="outcome-salary-work" label="Trabajo asociado (opcional)" hint="Puedes guardar el monto aunque todavía no hayas registrado el trabajo.">
        <select id="outcome-salary-work" value={employmentOutcomeId} onChange={event => setEmploymentOutcomeId(event.target.value)} className={SELECT_CLASS} aria-describedby="outcome-salary-work-hint">
          <option value="">Sin asociar a un trabajo</option>{workspace.employmentOptions.map(job => <option key={job.id} value={job.id}>{job.roleTitle} · {formatDate(job.effectiveDate)}</option>)}
        </select>
      </FormField>
    </fieldset>
    {workspace.employmentOptionsTruncated && <p className="text-xs leading-5 text-muted-foreground">La lista muestra los {workspace.employmentOptions.length} trabajos más recientes de {workspace.employmentOptionCount} registrados.</p>}
    <SubmissionNotice state={submission.state} onRefresh={props.onRefresh} />
    <FormActions state={submission.state} label="Guardar ingreso" newLabel="Registrar otro ingreso" onNew={newRecord} />
  </form>
}

export function OutcomeCaptureSection({ workspace, ...callbacks }: CaptureCallbacks & { workspace: ChileWorkspace }) {
  return <section id="registrar-resultado" aria-labelledby="outcome-capture-title" className="scroll-mt-24">
    <Card className="overflow-hidden border-[hsl(var(--primary)/0.3)]">
      <CardHeader className="p-5 sm:p-6">
        <h2 id="outcome-capture-title" tabIndex={-1} className="rounded-md text-xl font-semibold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-2xl">Agrega un resultado</h2>
        <p className="text-sm leading-6 text-muted-foreground">Cada registro ayuda a contar tu recorrido con hechos y fechas.</p>
      </CardHeader>
      <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
        <Tabs defaultValue="event">
          <TabsList aria-label="Tipo de resultado a registrar" className="mb-6 grid h-auto w-full grid-cols-3 gap-1 p-1.5">
            <TabsTrigger value="event" className="min-h-11 px-2">Búsqueda</TabsTrigger>
            <TabsTrigger value="employment" className="min-h-11 px-2">Trabajo</TabsTrigger>
            <TabsTrigger value="salary" className="min-h-11 px-2">Ingreso</TabsTrigger>
          </TabsList>
          <TabsContent value="event" forceMount className="data-[state=inactive]:hidden"><EventForm {...callbacks} /></TabsContent>
          <TabsContent value="employment" forceMount className="data-[state=inactive]:hidden"><EmploymentForm {...callbacks} asOfDate={workspace.asOfDate} /></TabsContent>
          <TabsContent value="salary" forceMount className="data-[state=inactive]:hidden"><SalaryForm {...callbacks} workspace={workspace} /></TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  </section>
}
