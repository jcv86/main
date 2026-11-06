import { NextResponse } from 'next/server'
import type { GuidedNextAction } from '@/lib/journey/next-action'
import { a2PlanToday, validateA2PlanReviewDate, type A2PlanContextSnapshot } from './plan-contract'
import {
  A2_ACTION_ACTOR_HEADER, A2_ACTION_EXPECTED_ACTOR_HEADER, A2_ACTION_MAX_BODY_BYTES,
  a2ActionCommandSchema, a2ActionReceiptSchema, a2ActionResultSchema, a2ActionViewSchema,
  a2ActionResultMatchesCommand,
  type A2ActionCommand, type A2ActionReceipt, type A2ActionResult, type A2ActionView,
} from './assistant-action-contract'

export class A2ActionApiFailure extends Error {
  constructor(readonly status: number, readonly code: string, readonly publicMessage: string) {
    super(code)
  }
}

export interface A2ActionContextRead {
  dayNumber: number | null
  snapshot: A2PlanContextSnapshot
  guidance: GuidedNextAction
}

export interface A2ActionApiPorts<Owner extends { id: string }> {
  authorize(request: Request): Promise<Owner>
  verifyOwner(owner: Owner): Promise<boolean>
  readContext(owner: Owner): Promise<A2ActionContextRead>
  readReceipt(owner: Owner, command: A2ActionCommand): Promise<A2ActionReceipt | null>
  mutate(owner: Owner, command: A2ActionCommand, snapshot: A2PlanContextSnapshot): Promise<A2ActionReceipt>
  readEffect(owner: Owner, command: A2ActionCommand, receipt: A2ActionReceipt): Promise<Pick<A2ActionResult, 'effect' | 'adjustment'>>
  now?(): Date
}

const BODY_TIMEOUT_MS = 5_000
const privateHeaders = {
  'Cache-Control': 'private, no-store',
  'CDN-Cache-Control': 'no-store',
  'Vercel-CDN-Cache-Control': 'no-store',
  Vary: 'Cookie',
}

/** A stalled, cancelled or oversized body cannot hold an action open indefinitely. */
async function readCommandJson(request: Request): Promise<unknown> {
  if (Number(request.headers.get('content-length')) > A2_ACTION_MAX_BODY_BYTES) {
    throw new A2ActionApiFailure(413, 'request_too_large', 'El ajuste supera el tamaño permitido.')
  }
  const reader = request.body?.getReader()
  if (!reader) throw new A2ActionApiFailure(400, 'invalid_json', 'No pudimos leer el ajuste.')
  let timer: ReturnType<typeof setTimeout> | undefined
  let abort: (() => void) | undefined
  const interruption = new Promise<never>((_, reject) => {
    abort = () => {
      void reader.cancel().catch(() => {})
      reject(new A2ActionApiFailure(408, 'request_interrupted', 'El envío se interrumpió. Conserva tu edición y reintenta el mismo envío.'))
    }
    timer = setTimeout(abort, BODY_TIMEOUT_MS)
    request.signal.addEventListener('abort', abort, { once: true })
    if (request.signal.aborted) abort()
  })
  const reading = (async () => {
    const decoder = new TextDecoder('utf-8', { fatal: true })
    let bytes = 0, text = ''
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      bytes += value.byteLength
      if (bytes > A2_ACTION_MAX_BODY_BYTES) {
        void reader.cancel().catch(() => {})
        throw new A2ActionApiFailure(413, 'request_too_large', 'El ajuste supera el tamaño permitido.')
      }
      text += decoder.decode(value, { stream: true })
    }
    return JSON.parse(text + decoder.decode())
  })()
  try { return await Promise.race([reading, interruption]) }
  catch (error) {
    if (error instanceof A2ActionApiFailure) throw error
    throw new A2ActionApiFailure(400, 'invalid_json', 'No pudimos leer el ajuste.')
  } finally {
    if (timer) clearTimeout(timer)
    if (abort) request.signal.removeEventListener('abort', abort)
    void reader.cancel().catch(() => {})
    reader.releaseLock()
  }
}

function checkedReceipt(value: unknown, command: A2ActionCommand): A2ActionReceipt {
  const receipt = a2ActionReceiptSchema.parse(value)
  if (receipt.requestId !== command.requestId || receipt.dayNumber !== command.dayNumber) {
    throw new Error('a2_action_receipt_mismatch')
  }
  return receipt
}

function assertCurrentAction(command: A2ActionCommand, view: A2ActionView, today: string) {
  if (!view.context?.available) {
    throw new A2ActionApiFailure(503, 'action_context_unavailable', 'No pudimos verificar el contexto. Tu edición se conserva; vuelve a comprobarlo.')
  }
  if (command.expectedContextHash !== view.context.hash) {
    throw new A2ActionApiFailure(409, 'action_context_changed', 'El contexto cambió. Revísalo antes de confirmar el ajuste.')
  }
  if (view.dayNumber === null || view.dayNumber !== command.dayNumber
    || view.context.projection.next.href !== `/despega/a2/dia-${command.dayNumber}`
    || view.context.projection.completedDays.includes(command.dayNumber)
    || command.dayNumber > view.context.projection.activeHorizon) {
    throw new A2ActionApiFailure(409, 'action_day_changed', 'El día pendiente cambió. Revisa el siguiente paso antes de confirmar el ajuste.')
  }
  if (!validateA2PlanReviewDate(command.adjustment.reviewDate, today).ok) {
    throw new A2ActionApiFailure(409, 'action_review_date_invalid', 'Elige una fecha de revisión entre hoy y los próximos 30 días.')
  }
}

/** Executes only an explicitly submitted, typed command; model text never calls these ports. */
export function createA2ActionHandlers<Owner extends { id: string }>(ports: A2ActionApiPorts<Owner>) {
  async function handle(request: Request, writing: boolean) {
    let owner: Owner | undefined, view: A2ActionView | undefined
    let actorConfirmed = false
    let mutationAttempted = false
    const json = (body: unknown, status = 200) => NextResponse.json(body, {
      status, headers: { ...privateHeaders, ...(owner && actorConfirmed ? { [A2_ACTION_ACTOR_HEADER]: owner.id } : {}) },
    })
    const verify = async () => {
      if (!owner || !await ports.verifyOwner(owner)) {
        actorConfirmed = false; view = undefined
        throw new A2ActionApiFailure(409, 'session_changed', 'La sesión cambió. Recarga la página antes de continuar.')
      }
      actorConfirmed = true
    }
    const readView = async () => {
      let current: A2ActionContextRead
      try { current = await ports.readContext(owner!) }
      catch {
        throw new A2ActionApiFailure(503, 'action_context_unavailable', 'No pudimos verificar el contexto. Tu edición se conserva; vuelve a comprobarlo.')
      }
      return a2ActionViewSchema.parse({ version: 'dtc-a2-action-view.v1', dayNumber: current.dayNumber,
        context: current.snapshot, guidance: current.guidance })
    }
    const deliver = async (command: A2ActionCommand, value: unknown, replayed?: boolean) => {
      const original = checkedReceipt(value, command)
      const receipt = replayed === undefined ? original : { ...original, replayed }
      const effect = await ports.readEffect(owner!, command, receipt)
      const result = a2ActionResultSchema.parse({ version: 'dtc-a2-action-result.v1', receipt, ...effect })
      if (!a2ActionResultMatchesCommand(result, command)) throw new Error('a2_action_result_mismatch')
      await verify()
      return json(result)
    }
    try {
      owner = await ports.authorize(request)
      actorConfirmed = true
      if (request.headers.get(A2_ACTION_EXPECTED_ACTOR_HEADER) !== owner.id) {
        actorConfirmed = false
        throw new A2ActionApiFailure(409, 'session_changed', 'La sesión cambió. Recarga la página antes de continuar.')
      }
      if (!writing) {
        view = await readView()
        await verify()
        return json(view)
      }
      const origin = request.headers.get('origin'), site = request.headers.get('sec-fetch-site')
      if (origin !== new URL(request.url).origin || (site !== null && site !== 'same-origin')) {
        throw new A2ActionApiFailure(403, 'origin_not_allowed', 'Abre el ajuste desde Tu Ruta.')
      }
      if ((request.headers.get('content-type') ?? '').split(';')[0].trim().toLowerCase() !== 'application/json') {
        throw new A2ActionApiFailure(415, 'invalid_content_type', 'El ajuste debe enviarse como JSON.')
      }
      const parsed = a2ActionCommandSchema.safeParse(await readCommandJson(request))
      if (!parsed.success) {
        throw new A2ActionApiFailure(400, 'invalid_action_request', 'Revisa el trabajo conservado, la siguiente acción y la fecha del ajuste.')
      }
      const command = parsed.data
      // A prior committed command takes precedence over mutable context/day/date.
      // Its effect is freshly read; this branch does not write or restore content.
      const prior = await ports.readReceipt(owner, command)
      if (prior) return await deliver(command, prior, true)
      try {
        view = await readView()
        assertCurrentAction(command, view, a2PlanToday(ports.now?.() ?? new Date()))
      } catch (preconditionError) {
        // A concurrent identical command may have committed after the first lookup.
        const raced = await ports.readReceipt(owner, command)
        if (raced) return await deliver(command, raced, true)
        throw preconditionError
      }
      await verify()
      if (request.signal.aborted) {
        throw new A2ActionApiFailure(408, 'request_interrupted', 'El envío se interrumpió. Puedes reintentar la misma edición.')
      }
      mutationAttempted = true
      const receipt = await ports.mutate(owner, command, view.context!)
      return await deliver(command, receipt)
    } catch (error) {
      // An error may follow a committed transaction. Never invent success or return
      // the requested content without readback; an exact retry recovers its receipt.
      if (owner && mutationAttempted && error instanceof A2ActionApiFailure
        && ['action_context_changed', 'action_day_changed'].includes(error.code)) {
        try { view = await readView() } catch { view = undefined }
      }
      if (owner) {
        try { await verify() }
        catch (identityError) { error = identityError; view = undefined }
      }
      const failure = error instanceof A2ActionApiFailure ? error
        : new A2ActionApiFailure(503, 'action_unavailable', 'No pudimos confirmar el resultado. Tu edición se conserva; reintenta el mismo envío para recuperarlo.')
      return json({ code: failure.code, error: failure.publicMessage, ...(view ? { view } : {}) }, failure.status)
    }
  }
  return { GET: (request: Request) => handle(request, false), POST: (request: Request) => handle(request, true) }
}
