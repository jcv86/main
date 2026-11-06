import { NextResponse } from 'next/server'
import type { GuidedNextAction } from '@/lib/journey/next-action'
import {
  A2_PLAN_ACTOR_HEADER, A2_PLAN_EXPECTED_ACTOR_HEADER,
  a2PlanCommandSchema, a2PlanReceiptSchema, a2PlanToday, a2PlanViewSchema, a2PlanMutationResponseSchema,
  assessA2PlanFreshness, validateA2PlanTransition,
  type A2PlanCommand, type A2PlanContextSnapshot, type A2PlanReceipt, type A2PlanView,
} from './plan-contract'
import type { A2PlanSlot } from './plan-service'

export class A2PlanApiFailure extends Error {
  constructor(readonly status: number, readonly code: string, readonly publicMessage: string) {
    super(code)
  }
}

export interface A2PlanContextRead { snapshot: A2PlanContextSnapshot; guidance: GuidedNextAction }
export interface A2PlanApiPorts<Owner extends { id: string }> {
  authorize(request: Request): Promise<Owner>
  verifyOwner(owner: Owner): Promise<boolean>
  readSlot(owner: Owner): Promise<A2PlanSlot>
  readContext(owner: Owner): Promise<A2PlanContextRead>
  readReceipt(owner: Owner, command: A2PlanCommand): Promise<A2PlanReceipt | null>
  mutate(owner: Owner, command: A2PlanCommand, snapshot: A2PlanContextSnapshot | null): Promise<A2PlanReceipt>
  now?(): Date
}

const MAX_BODY_BYTES = 16_000
const BODY_TIMEOUT_MS = 5_000
const privateHeaders = {
  'Cache-Control': 'private, no-store',
  'CDN-Cache-Control': 'no-store',
  'Vercel-CDN-Cache-Control': 'no-store',
  Vary: 'Cookie',
}

async function readCommandJson(request: Request): Promise<unknown> {
  if (Number(request.headers.get('content-length')) > MAX_BODY_BYTES) {
    throw new A2PlanApiFailure(413, 'request_too_large', 'El plan supera el tamaño permitido.')
  }
  const reader = request.body?.getReader()
  if (!reader) throw new A2PlanApiFailure(400, 'invalid_json', 'No pudimos leer el plan.')
  let timer: ReturnType<typeof setTimeout> | undefined
  let abort: (() => void) | undefined
  const timeout = new Promise<never>((_, reject) => {
    abort = () => {
      void reader.cancel().catch(() => {})
      reject(new A2PlanApiFailure(408, 'request_interrupted', 'El envío se interrumpió. Tu edición se conserva.'))
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
      if (bytes > MAX_BODY_BYTES) {
        void reader.cancel().catch(() => {})
        throw new A2PlanApiFailure(413, 'request_too_large', 'El plan supera el tamaño permitido.')
      }
      text += decoder.decode(value, { stream: true })
    }
    return JSON.parse(text + decoder.decode())
  })()
  try { return await Promise.race([reading, timeout]) }
  catch (error) {
    if (error instanceof A2PlanApiFailure) throw error
    throw new A2PlanApiFailure(400, 'invalid_json', 'No pudimos leer el plan.')
  } finally {
    if (timer) clearTimeout(timer)
    if (abort) request.signal.removeEventListener('abort', abort)
    void reader.cancel().catch(() => {})
    reader.releaseLock()
  }
}

function assertTransition(command: A2PlanCommand, slot: A2PlanSlot, view: A2PlanView, today: string) {
  if (command.expectedRevision !== slot.revision) {
    throw new A2PlanApiFailure(409, 'plan_conflict', 'Hay una versión más reciente. Revisa los cambios antes de guardar tu edición.')
  }
  if (command.operation === 'save' || command.operation === 'resume') {
    if (!view.context?.available) throw new A2PlanApiFailure(503, 'plan_context_unavailable', 'No pudimos verificar el contexto. Tu edición se conserva; vuelve a cargarlo.')
    if (command.expectedContextHash !== view.context.hash) {
      throw new A2PlanApiFailure(409, 'plan_context_changed', 'El contexto cambió. Revisa el objetivo y el siguiente paso antes de confirmar.')
    }
  }
  const result = validateA2PlanTransition(slot.plan, command, view.freshness, today)
  if (result.ok === true) return
  const explanations: Record<string, string> = {
    plan_expired: 'La fecha de revisión pasó. Revisa el plan y elige una fecha vigente.',
    plan_review_date_invalid: 'Elige una fecha de revisión entre hoy y los próximos 30 días.',
    plan_context_changed: 'Revisa y confirma el plan con el contexto actual antes de retomarlo.',
    plan_context_unavailable: 'No pudimos verificar el contexto. Tu edición se conserva.',
    plan_incomplete: 'Revisa los pasos: marca lo que realizaste o dejaste antes de cerrar el plan.',
    plan_not_found: 'No hay un plan guardado para realizar esa acción.',
  }
  throw new A2PlanApiFailure(result.code === 'plan_context_unavailable' ? 503 : 409, result.code,
    explanations[result.code] ?? 'El estado del plan cambió. Vuelve a cargarlo antes de continuar.')
}

function checkedReceipt(value: unknown, command: A2PlanCommand): A2PlanReceipt {
  const receipt = a2PlanReceiptSchema.parse(value)
  const states = { save: 'active', pause: 'paused', resume: 'active', complete: 'completed', cancel: 'cancelled', delete: 'deleted' } as const
  if (receipt.requestId !== command.requestId || receipt.revision !== command.expectedRevision + 1
    || receipt.state !== states[command.operation]) throw new Error('receipt_mismatch')
  return receipt
}

/** The same handlers serve the real route and controlled transport tests. */
export function createA2PlanHandlers<Owner extends { id: string }>(ports: A2PlanApiPorts<Owner>) {
  async function handle(request: Request, writing: boolean) {
    let owner: Owner | undefined
    let view: A2PlanView | undefined
    let mutationAttempted = false
    const json = (body: unknown, status = 200) => NextResponse.json(body, {
      status, headers: { ...privateHeaders, ...(owner ? { [A2_PLAN_ACTOR_HEADER]: owner.id } : {}) },
    })
    const verify = async () => {
      if (!owner || !await ports.verifyOwner(owner)) {
        view = undefined
        throw new A2PlanApiFailure(409, 'session_changed', 'La sesión cambió. Recarga la página antes de continuar.')
      }
    }
    const readView = async (slot: A2PlanSlot): Promise<A2PlanView> => {
      let current: A2PlanContextRead | null = null
      try { current = await ports.readContext(owner!) } catch { /* Keep the stored plan, mark its source unavailable. */ }
      return a2PlanViewSchema.parse({
        version: 'dtc-a2-plan-view.v1', revision: slot.revision, plan: slot.plan,
        context: current?.snapshot ?? null, guidance: current?.guidance ?? null,
        freshness: assessA2PlanFreshness(slot.plan, current?.snapshot ?? null, a2PlanToday(ports.now?.() ?? new Date())),
      })
    }
    try {
      owner = await ports.authorize(request)
      if (request.headers.get(A2_PLAN_EXPECTED_ACTOR_HEADER) !== owner.id) {
        throw new A2PlanApiFailure(409, 'session_changed', 'La sesión cambió. Recarga la página antes de continuar.')
      }
      if (writing) {
        const origin = request.headers.get('origin'), site = request.headers.get('sec-fetch-site')
        if (origin !== new URL(request.url).origin || (site !== null && site !== 'same-origin')) {
          throw new A2PlanApiFailure(403, 'origin_not_allowed', 'Abre tu plan desde Tu Ruta.')
        }
        if ((request.headers.get('content-type') ?? '').split(';')[0].trim().toLowerCase() !== 'application/json') {
          throw new A2PlanApiFailure(415, 'invalid_content_type', 'El plan debe enviarse como JSON.')
        }
        const parsed = a2PlanCommandSchema.safeParse(await readCommandJson(request))
        if (!parsed.success) throw new A2PlanApiFailure(400, 'invalid_plan_request', 'Revisa el propósito, los pasos y la fecha del plan.')
        const command = parsed.data
        // Replay comes before mutable date, source, revision and transition checks.
        // It returns an old receipt plus the CURRENT slot; it never reinstates history.
        const prior = await ports.readReceipt(owner, command)
        if (prior) {
          const receipt = checkedReceipt(prior, command)
          const current = await ports.readSlot(owner)
          if (current.revision < receipt.revision) throw new Error('receipt_not_visible')
          view = await readView(current)
          await verify()
          return json(a2PlanMutationResponseSchema.parse({ ...view, receipt: { ...receipt, replayed: true } }))
        }
        const slot = await ports.readSlot(owner)
        view = await readView(slot)
        try { assertTransition(command, slot, view, a2PlanToday(ports.now?.() ?? new Date())) }
        catch (preconditionError) {
          // Another identical request can commit after the first receipt lookup.
          // The new slot and its receipt are atomic, so check again before a
          // mutable precondition is allowed to hide that successful replay.
          const raced = await ports.readReceipt(owner, command)
          if (!raced) throw preconditionError
          const receipt = checkedReceipt(raced, command)
          const current = await ports.readSlot(owner)
          if (current.revision < receipt.revision) throw new Error('receipt_not_visible')
          view = await readView(current)
          await verify()
          return json(a2PlanMutationResponseSchema.parse({ ...view, receipt: { ...receipt, replayed: true } }))
        }
        await verify()
        if (request.signal.aborted) throw new A2PlanApiFailure(408, 'request_interrupted', 'El envío se interrumpió. Puedes reintentar la misma edición.')
        mutationAttempted = true
        const receipt = checkedReceipt(await ports.mutate(owner, command,
          command.operation === 'save' || command.operation === 'resume' ? view.context : null), command)
        const current = await ports.readSlot(owner)
        if (current.revision < receipt.revision) throw new Error('receipt_not_visible')
        view = await readView(current)
        await verify()
        return json(a2PlanMutationResponseSchema.parse({ ...view, receipt }))
      }
      view = await readView(await ports.readSlot(owner))
      await verify()
      return json(view)
    } catch (error) {
      if (owner && (mutationAttempted || (error instanceof A2PlanApiFailure && error.code === 'plan_conflict'))) {
        try { view = await readView(await ports.readSlot(owner)) }
        catch { view = undefined }
      }
      // Do not send personal snapshots when final identity verification failed.
      if (owner && view) {
        try { await verify() } catch (identityError) { error = identityError; view = undefined }
      }
      const failure = error instanceof A2PlanApiFailure ? error
        : new A2PlanApiFailure(503, 'plan_unavailable', 'No pudimos confirmar el estado del plan. Tu edición se conserva; reintenta para recuperar el resultado.')
      return json({ error: failure.publicMessage, code: failure.code, ...(view ? { view } : {}) }, failure.status)
    }
  }
  return { GET: (request: Request) => handle(request, false), POST: (request: Request) => handle(request, true) }
}
