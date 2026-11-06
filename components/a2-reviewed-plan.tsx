'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ClipboardList, Loader2, Plus, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  A2_PLAN_ACTOR_HEADER, A2_PLAN_EXPECTED_ACTOR_HEADER,
  a2PlanContentSchema, a2PlanViewSchema, a2PlanMutationResponseSchema, a2PlanToday, validateA2PlanReviewDate,
  type A2PlanCommand, type A2PlanContent, type A2PlanView,
} from '@/lib/a2/plan-contract'

type Operation = A2PlanCommand['operation']
type DraftBase = { revision: number; contextHash: string | null }
const field = 'w-full min-w-0 rounded-lg border border-input bg-background px-3 py-2 text-base text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
const primary = 'min-h-11 bg-emerald-700 text-white hover:bg-emerald-800'
const stateLabels = { active: 'Activo', paused: 'En pausa', completed: 'Marcado como realizado', cancelled: 'Cancelado' } as const
const stepLabels = { pending: 'Por hacer', reported_done: 'Lo realicé', skipped: 'Lo dejé' } as const
const operationState = { save: 'active', pause: 'paused', resume: 'active', complete: 'completed', cancel: 'cancelled', delete: 'deleted' } as const

function dateLabel(value: string) {
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value)
  return new Intl.DateTimeFormat('es-CL', { dateStyle: 'medium', ...(dateOnly ? {} : { timeStyle: 'short' as const }),
    timeZone: dateOnly ? 'UTC' : 'America/Santiago' }).format(new Date(dateOnly ? `${value}T12:00:00Z` : value))
}

function lastReviewDate(today: string) {
  const date = new Date(`${today}T12:00:00Z`)
  date.setUTCDate(date.getUTCDate() + 30)
  return date.toISOString().slice(0, 10)
}

function boundedWait<T>(signal: AbortSignal, work: () => Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    const cancel = () => reject(new Error('plan_request_cancelled'))
    if (signal.aborted) { cancel(); return }
    signal.addEventListener('abort', cancel, { once: true })
    Promise.resolve().then(() => {
      if (signal.aborted) throw new Error('plan_request_cancelled')
      return work()
    }).then(value => {
      signal.removeEventListener('abort', cancel)
      if (signal.aborted) cancel()
      else resolve(value)
    }, error => { signal.removeEventListener('abort', cancel); reject(error) })
  })
}

function PlanSummary({ plan }: { plan: NonNullable<A2PlanView['plan']> }) {
  return <div className="min-w-0 space-y-3 break-words" data-a2-plan-summary>
    <p className="text-sm font-semibold text-foreground">{stateLabels[plan.state]}</p>
    <p className="whitespace-pre-wrap text-sm leading-6">{plan.content.purpose}</p>
    {plan.content.constraints && <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground"><strong className="text-foreground">Tengo en cuenta:</strong> {plan.content.constraints}</p>}
    <ol aria-label="Pasos del plan guardado" className="list-inside list-decimal space-y-3 text-sm">
      {plan.content.steps.map(step => <li key={step.id} className="break-words">
        <span className="font-semibold">{step.title}</span>
        <p className="mt-1 whitespace-pre-wrap leading-6">{step.action}</p>
        <p className="mt-1 text-muted-foreground">{stepLabels[step.status]}</p>
        {step.note && <p className="mt-1 whitespace-pre-wrap text-muted-foreground">{step.note}</p>}
      </li>)}
    </ol>
    <p className="text-sm">Revisión elegida: <time dateTime={plan.content.reviewDate}>{dateLabel(plan.content.reviewDate)}</time></p>
    <p className="text-xs leading-5 text-muted-foreground">Guardado el <time dateTime={plan.updatedAt}>{dateLabel(plan.updatedAt)}</time>.</p>
  </div>
}

/** Only an explicitly reviewed plan persists; the surrounding conversation does not. */
export function A2ReviewedPlan({ actorId, onSessionChanged, onGuidanceUpdated }: {
  actorId: string; onSessionChanged: () => void; onGuidanceUpdated: (guidance: NonNullable<A2PlanView['guidance']>) => void
}) {
  const [client] = useState(() => createClient())
  const [view, setView] = useState<A2PlanView | null>(null)
  const [busy, setBusy] = useState<Operation | 'read' | null>('read')
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [draft, setDraft] = useState<A2PlanContent | null>(null)
  const [draftBase, setDraftBase] = useState<DraftBase | null>(null)
  const [needsReview, setNeedsReview] = useState(false)
  const [uncertain, setUncertain] = useState(false)
  const [verificationFailed, setVerificationFailed] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState(false)
  const viewRef = useRef<A2PlanView | null>(null)
  const draftBaseRef = useRef<DraftBase | null>(null)
  const pendingCommand = useRef<A2PlanCommand | null>(null)
  const requestGeneration = useRef(0)
  const controllerRef = useRef<AbortController | null>(null)
  const alive = useRef(true)
  const busyRef = useRef(false)
  const invalidSession = useRef(false)
  const onSessionChangedRef = useRef(onSessionChanged)
  const onGuidanceUpdatedRef = useRef(onGuidanceUpdated)
  const purposeRef = useRef<HTMLTextAreaElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const keepContentRef = useRef<HTMLButtonElement>(null)
  onSessionChangedRef.current = onSessionChanged
  onGuidanceUpdatedRef.current = onGuidanceUpdated

  const today = a2PlanToday()
  const latestDate = lastReviewDate(today)
  const contextAvailable = !verificationFailed && view?.context?.available === true && view.freshness.status !== 'unavailable'
  const parsedDraft = draft ? a2PlanContentSchema.safeParse(draft) : null
  const dateValid = Boolean(draft && validateA2PlanReviewDate(draft.reviewDate, today).ok)
  const canSave = parsedDraft?.success === true && dateValid && contextAvailable && !needsReview
    && draftBase?.revision === view?.revision && draftBase?.contextHash === view?.context?.hash
  const plan = view?.plan
  const canComplete = Boolean(plan && plan.content.steps.every(step => step.status !== 'pending')
    && plan.content.steps.some(step => step.status === 'reported_done'))

  function invalidate() {
    invalidSession.current = true
    requestGeneration.current++
    controllerRef.current?.abort()
    pendingCommand.current = null
    viewRef.current = null
    draftBaseRef.current = null
    setView(null); setDraft(null); setDraftBase(null); setError(null); setNotice(null)
    setUncertain(false); setBusy(null); busyRef.current = false
    onSessionChangedRef.current()
  }

  function applyView(next: A2PlanView) {
    viewRef.current = next
    setView(next)
    setVerificationFailed(false)
    if (next.guidance) onGuidanceUpdatedRef.current(next.guidance)
    const base = draftBaseRef.current
    if (base && (base.revision !== next.revision || base.contextHash !== next.context?.hash || !next.context?.available)) {
      setNeedsReview(true)
    }
  }

  async function exchange(command?: A2PlanCommand) {
    if (busyRef.current || invalidSession.current || !alive.current) return
    busyRef.current = true
    setBusy(command?.operation || 'read'); setError(null); setNotice(null)
    const generation = ++requestGeneration.current
    const controller = new AbortController()
    controllerRef.current = controller
    const timer = window.setTimeout(() => controller.abort(), 30_000)
    const current = () => alive.current && !invalidSession.current && generation === requestGeneration.current
    const verifyActor = async () => {
      const { data: { user }, error: authError } = await boundedWait<{
        data: { user: { id: string } | null }; error: unknown
      }>(controller.signal, () => client.auth.getUser())
      if (!current()) return false
      if (authError || !user || user.id !== actorId) { invalidate(); return false }
      return true
    }
    let sent = false
    try {
      if (!await verifyActor()) return
      sent = Boolean(command)
      const response = await boundedWait(controller.signal, () => fetch('/api/a2/plan', {
        method: command ? 'POST' : 'GET', credentials: 'same-origin', cache: 'no-store', signal: controller.signal,
        headers: { [A2_PLAN_EXPECTED_ACTOR_HEADER]: actorId, ...(command ? { 'Content-Type': 'application/json' } : {}) },
        ...(command ? { body: JSON.stringify(command) } : {}),
      }))
      const payload = await boundedWait(controller.signal, () => response.json().catch(() => null))
      if (!current() || !await verifyActor()) return
      const responseActor = response.headers.get(A2_PLAN_ACTOR_HEADER)
      if (response.status === 401 || payload?.code === 'session_changed' || (responseActor && responseActor !== actorId)) {
        invalidate(); return
      }
      if (!response.ok) {
        let receivedCurrentView = false
        if (responseActor === actorId) {
          const latest = a2PlanViewSchema.safeParse(payload?.view)
          if (latest.success) { applyView(latest.data); receivedCurrentView = true }
        }
        if (!receivedCurrentView && (!command || response.status === 409 || response.status >= 500)) setVerificationFailed(true)
        const definiteRejection = responseActor === actorId && [400, 403, 409, 413, 415].includes(response.status)
        if (command && definiteRejection) { pendingCommand.current = null; setUncertain(false) }
        else if (command) setUncertain(true)
        if (response.status === 409 && draftBaseRef.current) setNeedsReview(true)
        setError(responseActor === actorId && typeof payload?.error === 'string' && payload.error.length <= 500
          ? payload.error : 'No pudimos comprobar tu plan. Tu edición se conserva; vuelve a intentarlo.')
        return
      }
      if (responseActor !== actorId) throw new Error('unverified_plan_actor')

      if (command) {
        const result = a2PlanMutationResponseSchema.safeParse(payload)
        if (!result.success) throw new Error('invalid_plan_receipt')
        const { receipt, ...rawView } = result.data
        const latest = a2PlanViewSchema.parse(rawView)
        if (receipt.requestId !== command.requestId || receipt.revision !== command.expectedRevision + 1
          || receipt.state !== operationState[command.operation] || receipt.revision > latest.revision
          || (latest.plan && latest.plan.id !== receipt.planId)) throw new Error('mismatched_plan_receipt')
        applyView(latest)
        pendingCommand.current = null
        setUncertain(false); setDeleteConfirmation(false)
        setDraft(null); setDraftBase(null); draftBaseRef.current = null; setNeedsReview(false)
        if (receipt.revision !== latest.revision) {
          setNotice(latest.plan
            ? 'Tu solicitud anterior quedó confirmada. Se muestra el plan actual, que tuvo cambios posteriores.'
            : 'Tu solicitud anterior quedó confirmada. El contenido se eliminó después y continúa eliminado.')
        } else {
          const notices: Record<Operation, string> = {
            save: 'Plan guardado y activo. Podrás retomarlo cuando vuelvas.',
            pause: 'Plan en pausa. Puedes revisarlo y retomarlo después.',
            resume: 'Plan retomado.',
            complete: 'Registramos que marcaste este plan como realizado.',
            cancel: 'Plan cancelado. Puedes preparar otro cuando lo necesites.',
            delete: 'El contenido de este plan fue eliminado.',
          }
          setNotice(notices[command.operation])
        }
        window.requestAnimationFrame(() => { if (current()) titleRef.current?.focus() })
      } else {
        const result = a2PlanViewSchema.safeParse(payload)
        if (!result.success) throw new Error('invalid_plan_view')
        applyView(result.data)
        if (pendingCommand.current) setNotice('Recuperamos el estado actual. Aún falta confirmar tu solicitud anterior; puedes reintentar la misma solicitud.')
      }
    } catch {
      if (current()) {
        setVerificationFailed(true)
        if (command && sent) setUncertain(true)
        setError(command
          ? 'No pudimos confirmar el cambio. Tu edición se conserva; reintenta la misma solicitud para comprobarlo.'
          : 'No pudimos cargar tu plan guardado. Vuelve a comprobarlo antes de preparar uno nuevo.')
      }
    } finally {
      window.clearTimeout(timer)
      if (current()) { busyRef.current = false; setBusy(null) }
    }
  }

  useEffect(() => {
    alive.current = true
    void exchange()
    const refreshOnReturn = () => {
      if (document.visibilityState === 'visible' && !busyRef.current && !pendingCommand.current) void exchange()
    }
    window.addEventListener('focus', refreshOnReturn)
    document.addEventListener('visibilitychange', refreshOnReturn)
    return () => {
      alive.current = false
      requestGeneration.current++
      controllerRef.current?.abort()
      pendingCommand.current = null
      busyRef.current = false
      window.removeEventListener('focus', refreshOnReturn)
      document.removeEventListener('visibilitychange', refreshOnReturn)
    }
  }, [actorId, client])

  function startEditing() {
    const current = viewRef.current
    if (!current || busyRef.current || uncertain || verificationFailed) return
    const savedAction = current.guidance?.adjustment?.nextAction || ''
    const value: A2PlanContent = current.plan ? structuredClone(current.plan.content) : {
      version: 'dtc-a2-plan.v1', purpose: '', constraints: '', reviewDate: '',
      steps: [{ id: crypto.randomUUID(), title: '', action: savedAction.length <= 600 ? savedAction : '', status: 'pending' }],
    }
    const base = { revision: current.revision, contextHash: current.context?.hash || null }
    setDraft(value); setDraftBase(base); draftBaseRef.current = base
    setNeedsReview(['changed', 'expired', 'unavailable'].includes(current.freshness.status) || !current.context?.available)
    pendingCommand.current = null; setError(null); setNotice(null); setDeleteConfirmation(false)
    window.requestAnimationFrame(() => purposeRef.current?.focus())
  }

  function discardEditing() {
    if (busyRef.current || uncertain) return
    setDraft(null); setDraftBase(null); draftBaseRef.current = null
    pendingCommand.current = null; setNeedsReview(false); setError(null)
    titleRef.current?.focus()
  }

  function reviewCurrentContext() {
    const current = viewRef.current
    if (!current?.context?.available || !draft || busyRef.current || uncertain || verificationFailed) return
    const base = { revision: current.revision, contextHash: current.context.hash }
    setDraftBase(base); draftBaseRef.current = base
    setNeedsReview(false); pendingCommand.current = null; setError(null)
    setNotice('El borrador conserva tus cambios y ahora toma en cuenta el contexto que acabas de revisar.')
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    if (!canSave || !draft || !draftBase?.contextHash || busyRef.current || uncertain) return
    const parsed = a2PlanContentSchema.safeParse(draft)
    const currentDay = a2PlanToday()
    if (!parsed.success || !validateA2PlanReviewDate(parsed.data.reviewDate, currentDay).ok) return
    const command: A2PlanCommand = { version: 'dtc-a2-plan-command.v1', requestId: crypto.randomUUID(),
      expectedRevision: draftBase.revision, operation: 'save', content: parsed.data, expectedContextHash: draftBase.contextHash }
    pendingCommand.current = command
    void exchange(command)
  }

  function transition(operation: Exclude<Operation, 'save'>) {
    const current = viewRef.current
    if (!current?.plan || busyRef.current || uncertain || draft) return
    if (operation === 'resume' && (current.freshness.status !== 'current' || !current.context?.available)) { startEditing(); return }
    const base = { version: 'dtc-a2-plan-command.v1' as const, requestId: crypto.randomUUID(), expectedRevision: current.revision }
    const command: A2PlanCommand = operation === 'resume'
      ? { ...base, operation, expectedContextHash: current.context!.hash }
      : { ...base, operation }
    pendingCommand.current = command
    void exchange(command)
  }

  function updateStep(id: string, values: Partial<A2PlanContent['steps'][number]>) {
    setDraft(current => current ? { ...current, steps: current.steps.map(step => step.id === id ? { ...step, ...values } : step) } : current)
  }

  function addStep() {
    if (!draft || draft.steps.length >= 5) return
    const id = crypto.randomUUID()
    setDraft(current => current ? { ...current, steps: [...current.steps, { id, title: '', action: '', status: 'pending' }] } : current)
    window.requestAnimationFrame(() => document.getElementById(`a2-plan-${id}-title`)?.focus())
  }

  function removeStep(id: string) {
    if (!draft || draft.steps.length <= 1) return
    const index = draft.steps.findIndex(step => step.id === id)
    const next = draft.steps.filter(step => step.id !== id)
    setDraft(current => current ? { ...current, steps: current.steps.filter(step => step.id !== id) } : current)
    window.requestAnimationFrame(() => document.getElementById(`a2-plan-${next[Math.min(index, next.length - 1)].id}-title`)?.focus())
  }

  if (invalidSession.current) return null

  return <Card className="min-w-0" data-a2-reviewed-plan aria-busy={busy !== null}>
    <CardHeader>
      <CardTitle ref={titleRef} tabIndex={-1} className="flex items-center gap-2 text-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <ClipboardList className="h-5 w-5 shrink-0" aria-hidden="true" />Tu plan revisado
      </CardTitle>
      <CardDescription>Guarda lo que decides intentar y recupéralo cuando vuelvas. Los pasos reflejan lo que declaras y revisas.</CardDescription>
    </CardHeader>
    <CardContent className="min-w-0 space-y-4">
      {busy === 'read' && <p role="status" className="text-sm text-muted-foreground">Buscando tu plan guardado…</p>}
      {error && <Alert variant="destructive" role="alert"><AlertDescription>{error}</AlertDescription></Alert>}
      {notice && <p role="status" className="rounded-lg border border-emerald-600/40 bg-emerald-950/40 p-3 text-sm leading-6 text-emerald-100">{notice}</p>}
      {uncertain && <div className="space-y-3 rounded-lg border border-border p-3" role="group" aria-label="Confirmar la solicitud pendiente">
        <p className="text-sm leading-6">Falta comprobar si tu solicitud quedó guardada. Reintentar conserva la misma solicitud.</p>
        <div className="flex flex-wrap gap-2">
          <Button type="button" className={primary} disabled={busy !== null} onClick={() => { if (pendingCommand.current) void exchange(pendingCommand.current) }}>Reintentar la misma solicitud</Button>
          <Button type="button" variant="outline" className="min-h-11" disabled={busy !== null} onClick={() => void exchange()}>Comprobar estado actual</Button>
        </div>
      </div>}

      {view && <>
        {plan ? draft ? <details open={needsReview} className="min-w-0 rounded-lg border border-border p-3">
          <summary className="cursor-pointer rounded-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Ver el plan guardado actualmente</summary>
          <div className="mt-3"><PlanSummary plan={plan} /></div>
        </details> : <PlanSummary plan={plan} />
          : <p className="text-sm leading-6 text-muted-foreground">{view.revision > 0 ? 'El contenido del plan anterior fue eliminado.' : 'Todavía no has guardado un plan. Puedes preparar uno con el próximo paso que quieres intentar.'}</p>}

        {(view.freshness.status === 'changed' || view.freshness.status === 'expired' || view.freshness.status === 'unavailable') && <p role="status" className="rounded-lg border border-amber-600/40 bg-amber-950/30 p-3 text-sm leading-6 text-amber-100">
          {view.freshness.status === 'changed' ? 'Tu recorrido o contexto cambió. Revisa el plan antes de volver a usarlo.'
            : view.freshness.status === 'expired' ? 'La fecha de revisión de este plan pasó. Revisa sus pasos y elige una nueva fecha.'
              : 'No pudimos verificar el contexto actual. Tu plan guardado se conserva; vuelve a comprobarlo antes de activarlo.'}
        </p>}
        {!plan && !view.context?.available && <p role="status" className="rounded-lg border border-amber-600/40 bg-amber-950/30 p-3 text-sm leading-6 text-amber-100">
          No pudimos verificar tu contexto actual. Vuelve a comprobarlo para preparar un plan con tu recorrido vigente.
        </p>}

        {!draft && !uncertain && <div className="flex flex-wrap gap-2">
          <Button type="button" className={primary} disabled={busy !== null || !contextAvailable} onClick={startEditing}>
            {!plan ? 'Preparar mi plan' : ['changed', 'expired'].includes(view.freshness.status) ? 'Revisar plan' : plan.state === 'completed' || plan.state === 'cancelled' ? 'Preparar otro plan' : 'Editar plan'}
          </Button>
          {plan?.state === 'active' && <Button type="button" variant="outline" className="min-h-11" disabled={busy !== null} onClick={() => transition('pause')}>Pausar plan</Button>}
          {plan?.state === 'paused' && <Button type="button" variant="outline" className="min-h-11" disabled={busy !== null || !contextAvailable} onClick={() => transition('resume')}>Retomar plan</Button>}
          {plan && ['active', 'paused'].includes(plan.state) && <>
            <Button type="button" variant="outline" className="min-h-11" disabled={busy !== null || !canComplete} aria-describedby={!canComplete ? 'a2-plan-complete-help' : undefined} onClick={() => transition('complete')}>Marcar plan como realizado</Button>
            <Button type="button" variant="outline" className="min-h-11" disabled={busy !== null} onClick={() => transition('cancel')}>Cancelar plan</Button>
            {!canComplete && <p id="a2-plan-complete-help" className="w-full text-xs leading-5 text-muted-foreground">Para marcarlo como realizado, edita los pasos e indica cuáles realizaste o dejaste.</p>}
          </>}
        </div>}

        {draft && <form onSubmit={submit} aria-label="Editar mi plan" className="min-w-0 space-y-4">
          {!plan && view.guidance?.adjustment && view.guidance.adjustment.nextAction.length > 600 && <details open className="min-w-0 rounded-lg border border-border p-3">
            <summary className="cursor-pointer text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Tu ajuste guardado como referencia</summary>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Tu ajuste es más largo que un paso. Revísalo y escribe una acción de hasta 600 caracteres.</p>
            <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6">{view.guidance.adjustment.nextAction}</p>
          </details>}
          <fieldset disabled={busy !== null || uncertain} className="min-w-0 space-y-4">
            <legend className="mb-3 font-semibold">Revisa lo que quieres guardar</legend>
            <label htmlFor="a2-plan-purpose" className="block space-y-2 text-sm font-medium">Propósito del plan</label>
            <textarea ref={purposeRef} id="a2-plan-purpose" value={draft.purpose} maxLength={500} rows={3} required className={field}
              onChange={event => setDraft(current => current ? { ...current, purpose: event.target.value } : current)} placeholder="¿Qué quieres lograr con estos pasos?" />
            <label htmlFor="a2-plan-constraints" className="block text-sm font-medium">Restricciones que quieres respetar</label>
            <textarea id="a2-plan-constraints" value={draft.constraints} maxLength={1000} rows={2} className={field}
              onChange={event => setDraft(current => current ? { ...current, constraints: event.target.value } : current)} placeholder="Por ejemplo, el tiempo o los recursos disponibles." />
            {draft.steps.map((step, index) => <fieldset key={step.id} className="min-w-0 space-y-3 rounded-lg border border-border p-3">
              <legend className="px-1 text-sm font-semibold">Paso {index + 1}</legend>
              <label htmlFor={`a2-plan-${step.id}-title`} className="block text-sm font-medium">Título del paso {index + 1}</label>
              <input id={`a2-plan-${step.id}-title`} value={step.title} maxLength={120} required className={field} onChange={event => updateStep(step.id, { title: event.target.value })} />
              <label htmlFor={`a2-plan-${step.id}-action`} className="block text-sm font-medium">Qué harás en el paso {index + 1}</label>
              <textarea id={`a2-plan-${step.id}-action`} value={step.action} maxLength={600} required rows={3} className={field} onChange={event => updateStep(step.id, { action: event.target.value })} />
              <label htmlFor={`a2-plan-${step.id}-status`} className="block text-sm font-medium">Estado del paso {index + 1}</label>
              <select id={`a2-plan-${step.id}-status`} value={step.status} className={field} onChange={event => updateStep(step.id, { status: event.target.value as A2PlanContent['steps'][number]['status'] })}>
                {Object.entries(stepLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
              <label htmlFor={`a2-plan-${step.id}-note`} className="block text-sm font-medium">Nota del paso {index + 1} (opcional)</label>
              <textarea id={`a2-plan-${step.id}-note`} value={step.note || ''} maxLength={300} rows={2} className={field} onChange={event => updateStep(step.id, { note: event.target.value })} />
              <Button type="button" variant="outline" className="min-h-11" disabled={draft.steps.length <= 1} onClick={() => removeStep(step.id)} aria-label={`Quitar paso ${index + 1}`}><Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />Quitar paso</Button>
            </fieldset>)}
            <Button type="button" variant="outline" className="min-h-11" disabled={draft.steps.length >= 5} onClick={addStep}><Plus className="mr-2 h-4 w-4" aria-hidden="true" />Agregar paso</Button>
            <label htmlFor="a2-plan-review-date" className="block text-sm font-medium">Cuándo revisarás el plan</label>
            <input id="a2-plan-review-date" type="date" value={draft.reviewDate} min={today} max={latestDate} required className={field}
              aria-describedby="a2-plan-review-help" onChange={event => setDraft(current => current ? { ...current, reviewDate: event.target.value } : current)} />
            <p id="a2-plan-review-help" className="text-xs leading-5 text-muted-foreground">Elige una fecha entre hoy y los próximos 30 días. Es una fecha para que revises tu plan al volver.</p>
          </fieldset>

          {needsReview && <section aria-label="Revisar el contexto actual" className="space-y-3 rounded-lg border border-amber-600/40 bg-amber-950/20 p-3">
            <p className="font-medium text-amber-100">Revisa los cambios antes de guardar</p>
            <p className="text-sm leading-6">Tu borrador conserva lo que escribiste. Compáralo con el plan guardado y el contexto actual.</p>
            {view.guidance && <div className="space-y-2 text-sm leading-6">
              <p><strong>Siguiente paso actual:</strong> {view.guidance.action.title}</p>
              {view.guidance.objective && <p><strong>Objetivo guardado:</strong> {view.guidance.objective.summary}</p>}
              {view.guidance.adjustment && <p><strong>Ajuste guardado:</strong> {view.guidance.adjustment.nextAction}</p>}
            </div>}
            <Button type="button" variant="outline" className="h-auto min-h-11 whitespace-normal" disabled={busy !== null || uncertain || !contextAvailable} onClick={reviewCurrentContext}>Revisé los cambios y quiero conservar mi borrador</Button>
          </section>}
          <div className="flex flex-wrap gap-2">
            <Button type="submit" className={primary} disabled={busy !== null || uncertain || !canSave}>{busy === 'save' ? <><Loader2 className="mr-2 h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />Guardando plan…</> : 'Guardar y activar plan'}</Button>
            <Button type="button" variant="outline" className="min-h-11" disabled={busy !== null || uncertain} onClick={discardEditing}>Descartar edición</Button>
          </div>
        </form>}

        {!draft && plan && !uncertain && <details className="min-w-0 border-t border-border pt-3">
          <summary className="cursor-pointer rounded-sm text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Más opciones del plan</summary>
          <div className="mt-3 space-y-3">
            {!deleteConfirmation ? <Button type="button" variant="outline" className="min-h-11" disabled={busy !== null} onClick={() => {
              setDeleteConfirmation(true)
              window.requestAnimationFrame(() => keepContentRef.current?.focus())
            }}>Eliminar contenido del plan</Button> : <div role="group" aria-label="Confirmar eliminación del contenido" className="space-y-3 rounded-lg border border-destructive p-3">
              <p className="text-sm leading-6">¿Eliminar el contenido de este plan? El texto y sus versiones guardadas no podrán recuperarse.</p>
              <div className="flex flex-wrap gap-2">
                <Button type="button" ref={keepContentRef} variant="outline" className="min-h-11" disabled={busy !== null} onClick={() => setDeleteConfirmation(false)}>Conservar contenido</Button>
                <Button type="button" variant="destructive" className="min-h-11 bg-[#b91c1c] text-white hover:bg-[#991b1b] hover:text-white" disabled={busy !== null} onClick={() => transition('delete')}>Eliminar definitivamente</Button>
              </div>
            </div>}
          </div>
        </details>}
        {view.context && <p className="text-xs leading-5 text-muted-foreground">Contexto comprobado el <time dateTime={view.context.capturedAt}>{dateLabel(view.context.capturedAt)}</time>.</p>}
      </>}

      {!uncertain && <Button type="button" variant="outline" className="min-h-11" disabled={busy !== null} onClick={() => void exchange()}>Volver a comprobar mi plan</Button>}
      {busy !== null && busy !== 'read' && busy !== 'save' && <p role="status" className="text-sm text-muted-foreground">Comprobando el cambio de tu plan…</p>}
    </CardContent>
  </Card>
}
