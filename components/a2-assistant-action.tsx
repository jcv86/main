'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ClipboardCheck, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { A2_BARRIERS } from '@/lib/a2/practice-adjustment'
import { a2PlanToday, validateA2PlanReviewDate } from '@/lib/a2/plan-contract'
import {
  A2_ACTION_ACTOR_HEADER, A2_ACTION_EXPECTED_ACTOR_HEADER, A2_ACTION_TOOL,
  a2ActionAdjustmentSchema, a2ActionCommandSchema, a2ActionViewSchema,
  a2ActionResultSchema, a2ActionResultMatchesCommand,
  type A2ActionAdjustment, type A2ActionCommand, type A2ActionProposal, type A2ActionResult, type A2ActionView,
} from '@/lib/a2/assistant-action-contract'
import type { GuidedNextAction } from '@/lib/journey/next-action'

type DraftBase = { dayNumber: number; contextHash: string; responseRevision: number; guidance: GuidedNextAction | null }
const field = 'w-full min-w-0 rounded-lg border border-input bg-background px-3 py-2 text-base text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
const primary = 'h-auto min-h-11 whitespace-normal bg-emerald-700 text-white hover:bg-emerald-800'
// These codes prove rejection of this command. An interrupted response, denied
// access on a retry or an unverified envelope cannot disprove an earlier commit.
const definiteRejections = new Set([
  'invalid_action_request', 'origin_not_allowed', 'invalid_content_type', 'request_too_large',
  'action_request_conflict', 'action_context_changed', 'action_day_changed', 'action_review_date_invalid',
])

function boundedWait<T>(signal: AbortSignal, work: () => Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    const cancel = () => reject(new Error('action_request_cancelled'))
    if (signal.aborted) { cancel(); return }
    signal.addEventListener('abort', cancel, { once: true })
    Promise.resolve().then(() => {
      if (signal.aborted) throw new Error('action_request_cancelled')
      return work()
    }).then(value => {
      signal.removeEventListener('abort', cancel)
      if (signal.aborted) cancel()
      else resolve(value)
    }, error => { signal.removeEventListener('abort', cancel); reject(error) })
  })
}

function lastReviewDate(today: string) {
  const date = new Date(`${today}T12:00:00Z`)
  date.setUTCDate(date.getUTCDate() + 30)
  return date.toISOString().slice(0, 10)
}

function dateLabel(value: string) {
  return new Intl.DateTimeFormat('es-CL', { dateStyle: 'medium', timeZone: 'UTC' })
    .format(new Date(`${value}T12:00:00Z`))
}

function hasCurrentDay(view: A2ActionView | null): view is A2ActionView & { dayNumber: number; context: NonNullable<A2ActionView['context']> } {
  return Boolean(view?.dayNumber && view.context?.available && view.guidance
    && view.dayNumber <= view.context.projection.activeHorizon
    && !view.context.projection.completedDays.includes(view.dayNumber)
    && view.guidance.action.href === `/despega/a2/dia-${view.dayNumber}`
    && (['href', 'label', 'title', 'description'] as const).every(key => view.context!.projection.next[key] === view.guidance!.action[key]))
}

/** A proposal is never a command. The reviewed editor owns its exact retry until a receipt is verified. */
export function A2AssistantAction({ actorId, proposal, proposalGuidance, responseRevision, assistantBusy,
  onSessionChanged, onGuidanceUpdated, onSaved }: {
  actorId: string; proposal: A2ActionProposal | null; proposalGuidance: GuidedNextAction | null
  responseRevision: number; assistantBusy: boolean
  onSessionChanged: () => void; onGuidanceUpdated: (guidance: GuidedNextAction) => void; onSaved: () => void
}) {
  const [client] = useState(() => createClient())
  const [draft, setDraft] = useState<A2ActionAdjustment | null>(null)
  const [base, setBase] = useState<DraftBase | null>(null)
  const [view, setView] = useState<A2ActionView | null>(null)
  const [verifiedRevision, setVerifiedRevision] = useState<number | null>(null)
  const [verificationFailed, setVerificationFailed] = useState(false)
  const [reviewRequired, setReviewRequired] = useState(false)
  const [busy, setBusy] = useState<'read' | 'save' | null>(null)
  const [uncertain, setUncertain] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<A2ActionResult | null>(null)
  const [completedRevision, setCompletedRevision] = useState<number | null>(null)
  const pendingCommand = useRef<A2ActionCommand | null>(null)
  const pendingRevision = useRef<number | null>(null)
  const baseRef = useRef<DraftBase | null>(null)
  const viewRef = useRef<A2ActionView | null>(null)
  const busyRef = useRef(false)
  const alive = useRef(true)
  const invalidSession = useRef(false)
  const requestGeneration = useRef(0)
  const controllerRef = useRef<AbortController | null>(null)
  const responseRevisionRef = useRef(responseRevision)
  const assistantBusyRef = useRef(assistantBusy)
  const onSessionChangedRef = useRef(onSessionChanged)
  const onGuidanceUpdatedRef = useRef(onGuidanceUpdated)
  const onSavedRef = useRef(onSaved)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const retainedWorkRef = useRef<HTMLTextAreaElement>(null)
  responseRevisionRef.current = responseRevision
  assistantBusyRef.current = assistantBusy
  onSessionChangedRef.current = onSessionChanged
  onGuidanceUpdatedRef.current = onGuidanceUpdated
  onSavedRef.current = onSaved

  const today = a2PlanToday()
  const dateValid = Boolean(draft && validateA2PlanReviewDate(draft.reviewDate, today).ok)
  const parsedDraft = draft ? a2ActionAdjustmentSchema.safeParse(draft) : null
  const newerResponse = Boolean(base && base.responseRevision !== responseRevision)
  const currentContext = hasCurrentDay(view) && verifiedRevision === responseRevision && !verificationFailed
  const contextChanged = Boolean(base && view && (view.dayNumber !== base.dayNumber || view.context?.hash !== base.contextHash))
  const needsReview = reviewRequired || newerResponse || contextChanged
  const canConfirm = Boolean(draft && base && parsedDraft?.success && dateValid && currentContext && !needsReview
    && !assistantBusy && !busy && !uncertain)
  const availableProposal = proposal && completedRevision !== responseRevision ? proposal : null

  function invalidate() {
    invalidSession.current = true
    requestGeneration.current++
    controllerRef.current?.abort()
    pendingCommand.current = null; pendingRevision.current = null; baseRef.current = null; viewRef.current = null
    busyRef.current = false
    setDraft(null); setBase(null); setView(null); setResult(null); setError(null); setBusy(null); setUncertain(false)
    onSessionChangedRef.current()
  }

  function applyView(next: A2ActionView, revision: number) {
    viewRef.current = next
    setView(next); setVerifiedRevision(revision); setVerificationFailed(false)
    if (next.guidance) onGuidanceUpdatedRef.current(next.guidance)
    const previous = baseRef.current
    if (previous && (!hasCurrentDay(next) || previous.dayNumber !== next.dayNumber || previous.contextHash !== next.context.hash)) {
      setReviewRequired(true)
    }
  }

  async function exchange(command?: A2ActionCommand) {
    if (busyRef.current || invalidSession.current || !alive.current) return
    busyRef.current = true
    setBusy(command ? 'save' : 'read'); setError(null)
    const generation = ++requestGeneration.current
    const revision = responseRevisionRef.current
    const controller = new AbortController()
    controllerRef.current = controller
    const timer = window.setTimeout(() => controller.abort(), 30_000)
    const current = () => alive.current && !invalidSession.current && generation === requestGeneration.current
    let sent = false, confirmed = false
    const verifyActor = async () => {
      const { data: { user }, error: authError } = await boundedWait<{
        data: { user: { id: string } | null }; error: unknown
      }>(controller.signal, () => client.auth.getUser())
      if (!current()) return false
      if (authError || !user || user.id !== actorId) { invalidate(); return false }
      return true
    }
    const request = async (write?: A2ActionCommand) => {
      const response = await boundedWait(controller.signal, () => fetch('/api/a2/assistant-actions', {
        method: write ? 'POST' : 'GET', credentials: 'same-origin', cache: 'no-store', signal: controller.signal,
        headers: { [A2_ACTION_EXPECTED_ACTOR_HEADER]: actorId, ...(write ? { 'Content-Type': 'application/json' } : {}) },
        ...(write ? { body: JSON.stringify(write) } : {}),
      }))
      const payload = await boundedWait(controller.signal, () => response.json().catch(() => null))
      return { response, payload }
    }
    const verifyResponse = (response: Response, payload: { code?: unknown } | null) => {
      const actor = response.headers.get(A2_ACTION_ACTOR_HEADER)
      if (response.status === 401 || payload?.code === 'session_changed' || (actor && actor !== actorId)) {
        invalidate(); return false
      }
      return true
    }
    try {
      if (!await verifyActor()) return
      sent = Boolean(command)
      const { response, payload } = await request(command)
      if (!current() || !await verifyActor() || !verifyResponse(response, payload)) return
      const responseActor = response.headers.get(A2_ACTION_ACTOR_HEADER)
      if (!response.ok) {
        const latest = responseActor === actorId ? a2ActionViewSchema.safeParse(payload?.view) : null
        if (latest?.success) applyView(latest.data, revision)
        else setVerificationFailed(true)
        if (command && responseActor === actorId && [400, 403, 409, 413, 415].includes(response.status)
          && definiteRejections.has(payload?.code)) {
          pendingCommand.current = null; pendingRevision.current = null; setUncertain(false)
        } else if (command) setUncertain(true)
        if (response.status === 409) setReviewRequired(true)
        setError(responseActor === actorId && typeof payload?.error === 'string' && payload.error.length <= 500
          ? payload.error : 'No pudimos comprobar el ajuste. Tu edición se conserva; vuelve a intentarlo.')
        return
      }
      if (responseActor !== actorId) throw new Error('unverified_action_actor')
      if (!command) {
        const latest = a2ActionViewSchema.parse(payload)
        applyView(latest, revision)
        return
      }

      const checked = a2ActionResultSchema.parse(payload)
      if (!a2ActionResultMatchesCommand(checked, command)) throw new Error('mismatched_action_receipt')
      confirmed = true
      setResult(checked); setCompletedRevision(pendingRevision.current)
      pendingCommand.current = null; pendingRevision.current = null; baseRef.current = null
      setUncertain(false); setDraft(null); setBase(null); setReviewRequired(false)
      if (checked.effect === 'present') onSavedRef.current()

      // A matched receipt resolves the command even if refreshing the current
      // journey fails. That later failure must not make the write uncertain again.
      const refreshed = await request()
      if (!current() || !await verifyActor() || !verifyResponse(refreshed.response, refreshed.payload)) return
      if (!refreshed.response.ok || refreshed.response.headers.get(A2_ACTION_ACTOR_HEADER) !== actorId) {
        throw new Error('action_refresh_unavailable')
      }
      applyView(a2ActionViewSchema.parse(refreshed.payload), revision)
      window.requestAnimationFrame(() => { if (current()) titleRef.current?.focus() })
    } catch {
      if (current()) {
        setVerificationFailed(true)
        if (command && sent && !confirmed) setUncertain(true)
        if (command && !sent) { pendingCommand.current = null; pendingRevision.current = null }
        setError(confirmed
          ? 'Tu solicitud quedó confirmada, pero no pudimos actualizar el recorrido. Puedes volver a comprobar el contexto.'
          : command
            ? 'No pudimos confirmar el guardado. Tu edición se conserva; reintenta la misma solicitud para comprobarlo.'
            : 'No pudimos comprobar el día y su contexto. Tu edición se conserva; vuelve a intentarlo.')
      }
    } finally {
      window.clearTimeout(timer)
      if (current()) { busyRef.current = false; setBusy(null) }
    }
  }

  useEffect(() => {
    alive.current = true
    const refreshOnReturn = () => {
      if (document.visibilityState === 'visible' && baseRef.current && !busyRef.current
        && !pendingCommand.current && !assistantBusyRef.current) void exchange()
    }
    window.addEventListener('focus', refreshOnReturn)
    document.addEventListener('visibilitychange', refreshOnReturn)
    return () => {
      alive.current = false
      requestGeneration.current++
      controllerRef.current?.abort()
      pendingCommand.current = null; pendingRevision.current = null; baseRef.current = null; viewRef.current = null
      busyRef.current = false
      window.removeEventListener('focus', refreshOnReturn)
      document.removeEventListener('visibilitychange', refreshOnReturn)
    }
  }, [actorId, client])

  function startReview() {
    if (!availableProposal || busyRef.current || uncertain || assistantBusy || invalidSession.current) return
    const nextBase = { dayNumber: availableProposal.dayNumber, contextHash: availableProposal.expectedContextHash,
      responseRevision, guidance: proposalGuidance }
    baseRef.current = nextBase
    setBase(nextBase); setDraft({ ...availableProposal.draft, reviewDate: '' })
    setView(null); viewRef.current = null; setVerifiedRevision(null); setReviewRequired(false)
    setResult(null); setError(null); setVerificationFailed(false)
    void exchange()
    window.requestAnimationFrame(() => retainedWorkRef.current?.focus())
  }

  function acknowledgeContext() {
    const latest = viewRef.current
    if (!draft || !hasCurrentDay(latest) || !currentContext || busyRef.current || uncertain || assistantBusy) return
    const nextBase = { dayNumber: latest.dayNumber, contextHash: latest.context.hash,
      responseRevision, guidance: latest.guidance }
    baseRef.current = nextBase
    setBase(nextBase); setReviewRequired(false); setError(null)
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    if (!canConfirm || !draft || !base || busyRef.current || pendingCommand.current || invalidSession.current) return
    const checked = a2ActionAdjustmentSchema.safeParse(draft)
    if (!checked.success || !validateA2PlanReviewDate(checked.data.reviewDate, a2PlanToday()).ok) return
    const command = a2ActionCommandSchema.parse({ version: 'dtc-a2-action-command.v1', tool: A2_ACTION_TOOL,
      requestId: crypto.randomUUID(), dayNumber: base.dayNumber, expectedContextHash: base.contextHash, adjustment: checked.data })
    pendingCommand.current = command
    pendingRevision.current = base.responseRevision
    void exchange(command)
  }

  function discardReview() {
    if (busyRef.current || uncertain) return
    baseRef.current = null
    setBase(null); setDraft(null); setError(null); setReviewRequired(false)
    titleRef.current?.focus()
  }

  if (invalidSession.current || (!availableProposal && !draft && !result)) return null

  return <Card className="min-w-0" data-a2-assistant-action aria-busy={busy !== null}>
    <CardHeader>
      <CardTitle ref={titleRef} tabIndex={-1} className="flex items-center gap-2 text-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <ClipboardCheck className="h-5 w-5 shrink-0" aria-hidden="true" />Ajusta tu próximo intento
      </CardTitle>
      <CardDescription>Revisa la propuesta y elige lo que quieres guardar para tu práctica.</CardDescription>
    </CardHeader>
    <CardContent className="min-w-0 space-y-4">
      {busy && <p role="status" className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 shrink-0 animate-spin motion-reduce:animate-none" aria-hidden="true" />
        {busy === 'save' ? 'Comprobando el guardado…' : 'Comprobando el contexto actual…'}
      </p>}
      {error && <Alert variant="destructive" role="alert"><AlertDescription>{error}</AlertDescription></Alert>}
      {result && <div data-a2-action-receipt role="status" className="min-w-0 space-y-2 rounded-lg border border-emerald-600/40 bg-emerald-950/40 p-3 text-sm leading-6 text-emerald-100">
        <p className="font-semibold">{result.effect === 'changed'
          ? 'Tu solicitud anterior quedó registrada, pero el ajuste cambió después. Se conservan esos cambios.'
          : result.effect === 'removed'
            ? 'Tu solicitud anterior quedó registrada y su contenido se eliminó después. Continúa eliminado.'
            : result.receipt.replayed
              ? `Confirmamos el ajuste que guardaste para el día ${result.receipt.dayNumber}.`
              : `Ajuste guardado para el día ${result.receipt.dayNumber}.`}</p>
        {result.adjustment && <>
          <p className="whitespace-pre-wrap break-words">{result.adjustment.nextAction}</p>
          <p>Revisión elegida: <time dateTime={result.adjustment.reviewDate}>{dateLabel(result.adjustment.reviewDate)}</time>.</p>
        </>}
      </div>}
      {!draft && availableProposal && <div className="space-y-3">
        <p className="text-xs font-medium text-muted-foreground">Propuesta para el día {availableProposal.dayNumber}</p>
        <p className="whitespace-pre-wrap break-words text-sm leading-6">{availableProposal.draft.nextAction}</p>
        <Button type="button" className={primary} disabled={busy !== null || assistantBusy} onClick={startReview}>Revisar ajuste</Button>
      </div>}
      {uncertain && <div role="group" aria-label="Confirmar el ajuste pendiente" className="space-y-3 rounded-lg border border-border p-3">
        <p className="text-sm leading-6">Falta comprobar si este ajuste quedó guardado. El reintento conserva exactamente tu solicitud.</p>
        <Button type="button" className={primary} disabled={busy !== null} onClick={() => { if (pendingCommand.current) void exchange(pendingCommand.current) }}>Reintentar la misma solicitud</Button>
      </div>}
      {draft && base && <form data-a2-action-review onSubmit={submit} className="min-w-0 space-y-4">
        <p className="text-sm font-semibold">Ajuste que estás revisando: día {base.dayNumber}</p>
        {newerResponse && <p className="rounded-lg border border-border p-3 text-sm leading-6">Llegó una nueva respuesta. Tu edición se conserva; comprueba el contexto antes de confirmarla.</p>}
        {view?.guidance && <div role="group" className="min-w-0 space-y-2 rounded-lg border border-border p-3 text-sm leading-6" aria-label="Contexto actual del ajuste">
          <p className="font-semibold">{view.dayNumber ? `Día pendiente actual: ${view.dayNumber}` : 'Tu siguiente paso cambió'}</p>
          <p className="break-words">{view.guidance.action.title}</p>
          {base.guidance?.objective?.summary && base.guidance.objective.summary !== view.guidance.objective?.summary
            && <p className="break-words text-muted-foreground">Objetivo anterior: {base.guidance.objective.summary}</p>}
          {view.guidance.objective?.summary && <p className="break-words">Objetivo actual: {view.guidance.objective.summary}</p>}
          {contextChanged && view.guidance.adjustment && <p className="whitespace-pre-wrap break-words">Último ajuste guardado: {view.guidance.adjustment.nextAction}</p>}
        </div>}
        {(needsReview || verificationFailed || !currentContext) && busy !== 'read' && <div className="space-y-3 rounded-lg border border-border p-3">
          <p className="text-sm leading-6">{view && !hasCurrentDay(view)
            ? 'No pudimos verificar una práctica pendiente para este ajuste. Conserva tu edición y comprueba el recorrido.'
            : needsReview ? 'Revisa el día y el contexto actual. Tus textos se conservan para que decidas si todavía corresponden.'
              : 'Comprueba el contexto antes de confirmar el ajuste.'}</p>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" className="h-auto min-h-11 whitespace-normal" disabled={busy !== null || uncertain || assistantBusy} onClick={() => void exchange()}>Comprobar contexto actual</Button>
            {needsReview && currentContext && <Button type="button" variant="outline" className="h-auto min-h-11 whitespace-normal" disabled={busy !== null || uncertain || assistantBusy} onClick={acknowledgeContext}>Revisé el contexto; conservar mi edición</Button>}
          </div>
        </div>}
        <fieldset disabled={busy === 'save' || uncertain} className="min-w-0 space-y-4">
          <div className="space-y-2">
            <label htmlFor="a2-action-outcome" className="block text-sm font-medium">Qué necesitas cambiar</label>
            <select id="a2-action-outcome" className={field} value={draft.outcome} onChange={event => setDraft(current => current ? { ...current, outcome: event.target.value as A2ActionAdjustment['outcome'] } : current)}>
              <option value="could_not">NO PUDE</option><option value="change">CAMBIAR</option>
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="a2-action-barrier" className="block text-sm font-medium">Qué te dificultó avanzar</label>
            <select id="a2-action-barrier" className={field} value={draft.barrier} onChange={event => setDraft(current => current ? { ...current, barrier: event.target.value as A2ActionAdjustment['barrier'] } : current)}>
              {Object.entries(A2_BARRIERS).map(([key, item]) => <option key={key} value={key}>{item.label}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="a2-action-retained" className="block text-sm font-medium">Qué quieres conservar</label>
            <textarea id="a2-action-retained" ref={retainedWorkRef} required rows={3} maxLength={4_000} className={field}
              value={draft.retainedWork} onChange={event => setDraft(current => current ? { ...current, retainedWork: event.target.value } : current)}
              placeholder="Una idea, un borrador o lo que sí alcanzaste a hacer." />
          </div>
          <div className="space-y-2">
            <label htmlFor="a2-action-next" className="block text-sm font-medium">Qué intentarás ahora</label>
            <textarea id="a2-action-next" required rows={3} maxLength={2_000} className={field}
              value={draft.nextAction} onChange={event => setDraft(current => current ? { ...current, nextAction: event.target.value } : current)} />
          </div>
          <div className="space-y-2">
            <label htmlFor="a2-action-date" className="block text-sm font-medium">Fecha de revisión</label>
            <input id="a2-action-date" type="date" required className={field} min={today} max={lastReviewDate(today)}
              value={draft.reviewDate} aria-describedby="a2-action-date-help" onChange={event => setDraft(current => current ? { ...current, reviewDate: event.target.value } : current)} />
            <p id="a2-action-date-help" className="text-xs leading-5 text-muted-foreground">Elige una fecha entre hoy y los próximos 30 días.</p>
          </div>
        </fieldset>
        <p className="text-xs leading-5 text-muted-foreground">Sólo se guarda cuando confirmas. Guardar un ajuste no completa la práctica. Esta edición dura mientras mantienes abierta la página.</p>
        <div className="flex flex-wrap gap-2">
          <Button type="submit" className={primary} disabled={!canConfirm}>Confirmar y guardar ajuste</Button>
          <Button type="button" variant="outline" className="min-h-11" disabled={busy !== null || uncertain} onClick={discardReview}>Descartar edición</Button>
        </div>
      </form>}
      {!draft && verificationFailed && <Button type="button" variant="outline" className="h-auto min-h-11 whitespace-normal" disabled={busy !== null} onClick={() => void exchange()}>Comprobar contexto actual</Button>}
    </CardContent>
  </Card>
}
