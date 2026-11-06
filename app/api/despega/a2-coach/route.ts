import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getJourneyForCurrentUser } from '@/lib/journey/service'
import { readJourneyFlow } from '@/lib/journey/flow-service'
import { readGuidedNextAction } from '@/lib/journey/next-action-service'
import { loadA1AgentContext } from '@/lib/dtc-agentos/context/a1-context'
import { checkA2PilotAccess } from '@/lib/a2/api-access'
import {
  a2AssistantRequestSchema, buildA2AssistantMessages,
  A2_ASSISTANT_ACTOR_HEADER, A2_ASSISTANT_EXPECTED_ACTOR_HEADER,
  type A2A1Evidence,
} from '@/lib/a2/assistant-contract'
import type { GuidedNextAction } from '@/lib/journey/next-action'
import { DTC_REQUEST_ID_HEADER, resolveRequestId } from '@/lib/observability/request-id'
import { logOperationalEvent } from '@/lib/observability/server-log'
import { selectA2Swarm } from '@/lib/a2/swarm/canary'
import { runA2Swarm } from '@/lib/a2/swarm/runtime'
import { createOpenAISwarmCompletion } from '@/lib/a2/swarm/openai'
import { A2_SWARM_BUDGET_MS } from '@/lib/a2/swarm/contracts'
import { readA2PlanAssistantEvidence } from '@/lib/a2/plan-service'
import { makeA2PlanContextSnapshot } from '@/lib/a2/plan-context'
import { guidedPracticeDay } from '@/lib/journey/next-action'
import { a2ActionProposalSchema, type A2ActionProposal } from '@/lib/a2/assistant-action-contract'

const MAX_BODY_BYTES = 64_000
const BODY_TIMEOUT_MS = 5_000
const GENERATION_BUDGET_MS = 25_000
const MIN_FALLBACK_BUDGET_MS = 1_000
const MAX_PROVIDER_BODY_BYTES = 32_000

class GenerationFailure extends Error {
  constructor(readonly code: 'assistant_generation_failed' | 'assistant_invalid_response') {
    super(code)
  }
}

/** Bounds headers AND body decoding even when a transport ignores cancellation. */
function withinGenerationBudget<T>(signal: AbortSignal, work: () => Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) { reject(new Error('generation_cancelled')); return }
    const cancel = () => reject(new Error('generation_cancelled'))
    signal.addEventListener('abort', cancel, { once: true })
    Promise.resolve().then(() => {
      if (signal.aborted) throw new Error('generation_cancelled')
      return work()
    }).then(
      value => { signal.removeEventListener('abort', cancel); resolve(value) },
      error => { signal.removeEventListener('abort', cancel); reject(error) },
    )
  })
}

async function readProviderJson(response: Response, signal: AbortSignal): Promise<unknown> {
  const reader = response.body?.getReader()
  if (!reader) throw new GenerationFailure('assistant_invalid_response')
  const decoder = new TextDecoder('utf-8', { fatal: true })
  let size = 0, text = ''
  const cancel = () => { void reader.cancel().catch(() => {}) }
  signal.addEventListener('abort', cancel, { once: true })
  try {
    if (signal.aborted) throw new GenerationFailure('assistant_invalid_response')
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > MAX_PROVIDER_BODY_BYTES) throw new GenerationFailure('assistant_invalid_response')
      text += decoder.decode(value, { stream: true })
    }
    return JSON.parse(text + decoder.decode())
  } catch {
    // Cancellation is best effort and never extends the response budget.
    void reader.cancel().catch(() => {})
    throw new GenerationFailure('assistant_invalid_response')
  } finally {
    signal.removeEventListener('abort', cancel)
    reader.releaseLock()
  }
}

async function readBoundedJson(request: Request): Promise<unknown> {
  if (Number(request.headers.get('content-length')) > MAX_BODY_BYTES) throw new Error('too_large')
  const reader = request.body?.getReader()
  if (!reader) throw new Error('invalid_json')
  let timer: ReturnType<typeof setTimeout> | undefined
  let interrupt: (() => void) | undefined
  const interrupted = new Promise<never>((_, reject) => {
    interrupt = () => {
      reject(new Error('request_interrupted'))
      void reader.cancel().catch(() => {})
    }
    timer = setTimeout(interrupt, BODY_TIMEOUT_MS)
    request.signal.addEventListener('abort', interrupt, { once: true })
    if (request.signal.aborted) interrupt()
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
        throw new Error('too_large')
      }
      text += decoder.decode(value, { stream: true })
    }
    return JSON.parse(text + decoder.decode())
  })()
  try { return await Promise.race([interrupted, reading]) }
  finally {
    if (timer) clearTimeout(timer)
    if (interrupt) request.signal.removeEventListener('abort', interrupt)
    void reader.cancel().catch(() => {})
    reader.releaseLock()
  }
}

export async function POST(request: Request) {
  const requestId = resolveRequestId(request.headers)
  let actorId: string | undefined
  let guidance: GuidedNextAction | undefined
  let responseStatus: number | undefined
  const respond = (body: Record<string, unknown>, status: number) => {
    responseStatus = status
    return NextResponse.json(body, {
    status,
    headers: {
      'Cache-Control': 'private, no-store',
      'CDN-Cache-Control': 'no-store',
      'Vercel-CDN-Cache-Control': 'no-store',
      [DTC_REQUEST_ID_HEADER]: requestId,
      ...(actorId ? { [A2_ASSISTANT_ACTOR_HEADER]: actorId } : {}),
    },
    })
  }
  const fail = (status: number, code: string, error: string) => respond({ error, code, ...(guidance ? { guidance } : {}) }, status)

  try {
    const client = await createClient()
    const { data: { user }, error: authError } = await client.auth.getUser()
    if (authError || !user) return fail(401, 'authentication_required', 'Vuelve a iniciar sesión para continuar.')
    actorId = user.id
    if (request.headers.get(A2_ASSISTANT_EXPECTED_ACTOR_HEADER) !== actorId) {
      return fail(409, 'session_changed', 'La sesión cambió. Recarga la página antes de continuar.')
    }
    const origin = request.headers.get('origin')
    const fetchSite = request.headers.get('sec-fetch-site')
    if (origin !== new URL(request.url).origin || (fetchSite !== null && fetchSite !== 'same-origin')) {
      return fail(403, 'origin_not_allowed', 'Abre el asistente desde Tu Ruta.')
    }
    if ((request.headers.get('content-type') || '').split(';')[0].trim().toLowerCase() !== 'application/json') {
      return fail(415, 'invalid_content_type', 'La consulta debe enviarse como JSON.')
    }
    let payload: unknown
    try { payload = await readBoundedJson(request) } catch (error) {
      if (error instanceof Error && error.message === 'request_interrupted') {
        return fail(408, 'request_interrupted', 'El envío de la consulta se interrumpió. Tu pregunta se conserva; puedes reintentar.')
      }
      const oversized = error instanceof Error && error.message === 'too_large'
      return fail(oversized ? 413 : 400, oversized ? 'request_too_large' : 'invalid_json', oversized ? 'La consulta es demasiado larga.' : 'No pudimos leer la consulta.')
    }
    const parsed = a2AssistantRequestSchema.safeParse(payload)
    if (!parsed.success) return fail(400, 'invalid_assistant_request', 'Revisa el texto de la consulta y vuelve a intentarlo.')
    if (request.signal.aborted) return fail(408, 'request_interrupted', 'El envío de la consulta se interrumpió. Puedes reintentar.')

    const pilot = await checkA2PilotAccess(actorId)
    if (pilot !== 'allowed') return fail(pilot === 'denied' ? 403 : 503, 'pilot_access_unavailable', pilot === 'denied' ? 'Necesitas acceso al piloto para usar el asistente.' : 'No pudimos verificar el acceso al piloto. Intenta nuevamente.')
    const journey = await getJourneyForCurrentUser()
    if (!journey || journey.user.id !== actorId) return fail(409, 'session_changed', 'La sesión cambió. Recarga la página antes de continuar.')
    if (!journey.access.a2) return fail(403, 'journey_access_required', 'Completa tu punto de partida antes de abrir el asistente de Tu Ruta.')
    const flow = await readJourneyFlow(journey, client)
    guidance = await readGuidedNextAction(journey, flow, client)
    const plan = await readA2PlanAssistantEvidence(client, actorId, flow, guidance)

    let a1: A2A1Evidence
    try { a1 = { status: 'available', data: await loadA1AgentContext(client, actorId) } }
    catch (error) {
      if (error instanceof Error && error.message === 'A1_CONTEXT_ACCESS_DENIED') {
        guidance = undefined
        return fail(409, 'session_changed', 'La sesión cambió. Recarga la página antes de continuar.')
      }
      a1 = { status: 'unavailable' }
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) return fail(503, 'assistant_not_configured', 'El asistente no está disponible ahora. Puedes continuar con tu siguiente acción.')

    // Only the verified actor and server configuration select the cohort. This
    // does not bypass pilot admission, module access or source ownership above.
    const selection = selectA2Swarm(actorId, {
      DTC_A2_SWARM_MODE: process.env.DTC_A2_SWARM_MODE,
      DTC_A2_SWARM_KILL_SWITCH: process.env.DTC_A2_SWARM_KILL_SWITCH,
      DTC_A2_SWARM_ROLLOUT_ID: process.env.DTC_A2_SWARM_ROLLOUT_ID,
      DTC_A2_SWARM_REVISION: process.env.DTC_A2_SWARM_REVISION,
      DTC_A2_SWARM_PERCENT: process.env.DTC_A2_SWARM_PERCENT,
      DTC_A2_SWARM_ALLOWLIST: process.env.DTC_A2_SWARM_ALLOWLIST,
    })
    const startedAt = Date.now()
    const candidateSha = /^[a-f0-9]{40}$/.test(process.env.VERCEL_GIT_COMMIT_SHA || '')
      ? process.env.VERCEL_GIT_COMMIT_SHA! : null
    const deploymentId = /^dpl_[A-Za-z0-9]{8,64}$/.test(process.env.VERCEL_DEPLOYMENT_ID || '')
      ? process.env.VERCEL_DEPLOYMENT_ID! : null
    const generation = new AbortController()
    const cancelGeneration = () => generation.abort()
    request.signal.addEventListener('abort', cancelGeneration, { once: true })
    if (request.signal.aborted) generation.abort()
    const timeout = setTimeout(cancelGeneration, GENERATION_BUDGET_MS)
    let served: 'none' | 'baseline' | 'swarm' = 'none'
    let generated: 'none' | 'baseline' | 'swarm' = 'none'
    let outcome = 'unavailable'
    let fallbackReason = 'none'
    let swarmCalls = 0, baselineCalls = 0
    let swarmStage = 'none', swarmElapsedMs = 0

    const verifyCurrentActor = async (): Promise<Response | null> => {
      try {
        const { data: { user: current }, error } = await withinGenerationBudget(generation.signal, () => client.auth.getUser())
        if (error || !current || current.id !== actorId) {
          guidance = undefined
          outcome = 'session_changed'
          return fail(409, 'session_changed', 'La sesión cambió. Recarga la página antes de continuar.')
        }
        return null
      } catch {
        guidance = undefined
        if (request.signal.aborted) {
          outcome = 'cancelled'
          return fail(499, 'assistant_cancelled', 'La consulta se canceló. Puedes volver a intentarlo.')
        }
        if (generation.signal.aborted) {
          outcome = 'deadline_exceeded'
          return fail(503, 'assistant_unavailable', 'La respuesta tardó o no pudo llegar. Tu pregunta se conserva; puedes reintentar.')
        }
        outcome = 'session_unavailable'
        return fail(503, 'session_verification_unavailable', 'No pudimos verificar la sesión. Recarga antes de continuar.')
      }
    }

    try {
      if (generation.signal.aborted) throw new Error('generation_cancelled')
      let answer: string | undefined
      let actionProposal: A2ActionProposal | undefined
      if (selection.variant === 'swarm') {
        const result = await runA2Swarm({ request: parsed.data, flow, guidance, a1, plan }, {
          complete: createOpenAISwarmCompletion(apiKey, { fetch }),
          signal: generation.signal,
          budgetMs: Math.min(A2_SWARM_BUDGET_MS, GENERATION_BUDGET_MS - (Date.now() - startedAt)),
        })
        swarmCalls = result.trace.callsStarted
        swarmStage = result.trace.failureStage || 'none'
        swarmElapsedMs = result.trace.elapsedMs
        if (result.ok === true) {
          answer = result.response; generated = 'swarm'
          if (result.adjustment) {
            // Models supply editable text only. Destination and review binding
            // are derived from the authorized server snapshot, never model IDs.
            const dayNumber = guidedPracticeDay(flow)
            const snapshot = makeA2PlanContextSnapshot(flow, guidance)
            if (dayNumber !== null && snapshot.available) actionProposal = a2ActionProposalSchema.parse({
              version: 'dtc-a2-action-proposal.v1', tool: 'save_practice_adjustment',
              dayNumber, expectedContextHash: snapshot.hash, draft: result.adjustment,
            })
          }
        }
        else {
          fallbackReason = result.reason
          if (generation.signal.aborted || GENERATION_BUDGET_MS - (Date.now() - startedAt) < MIN_FALLBACK_BUDGET_MS) {
            throw new Error('generation_cancelled')
          }
          const changed = await verifyCurrentActor()
          if (changed) return changed
          if (generation.signal.aborted || GENERATION_BUDGET_MS - (Date.now() - startedAt) < MIN_FALLBACK_BUDGET_MS) {
            throw new Error('generation_cancelled')
          }
        }
      }

      if (answer === undefined) {
        answer = await withinGenerationBudget(generation.signal, async () => {
          baselineCalls++
          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              messages: buildA2AssistantMessages(parsed.data, flow, guidance!, a1, plan),
              temperature: 0.35, max_tokens: 600, store: false,
            }),
            signal: generation.signal,
            cache: 'no-store', redirect: 'error',
          })
          if (!response.ok) { void response.body?.cancel().catch(() => {}); throw new GenerationFailure('assistant_generation_failed') }
          const result = await readProviderJson(response, generation.signal) as { error?: unknown; choices?: Array<{
            finish_reason?: unknown; message?: { role?: unknown; content?: unknown; refusal?: unknown; tool_calls?: unknown; function_call?: unknown }
          }> } | null
          if (!result || typeof result !== 'object' || (result.error !== undefined && result.error !== null)
            || !Array.isArray(result.choices) || result.choices.length !== 1) {
            throw new GenerationFailure('assistant_invalid_response')
          }
          const choice = result?.choices?.[0]
          const text = choice?.message?.content
          if (choice?.finish_reason !== 'stop' || choice?.message?.role !== 'assistant'
            || (choice.message.refusal !== undefined && choice.message.refusal !== null)
            || (choice.message.function_call !== undefined && choice.message.function_call !== null)
            || (choice.message.tool_calls !== undefined && (!Array.isArray(choice.message.tool_calls) || choice.message.tool_calls.length !== 0))
            || typeof text !== 'string' || !text.trim() || text.length > 6_000) {
            throw new GenerationFailure('assistant_invalid_response')
          }
          return text.trim()
        })
        generated = 'baseline'
      }

      if (generation.signal.aborted) throw new Error('generation_cancelled')
      // A plan may be corrected, paused or deleted while generation is running.
      // Do not deliver a response grounded in a plan revision that is no longer
      // available to this request. This remains a dated read, not a source lock.
      let actionContextChanged = false
      const latestPlan = await withinGenerationBudget(generation.signal, async () => {
        if (plan.status !== 'available' && !actionProposal) return readA2PlanAssistantEvidence(client, actorId!, flow, guidance!)
        const currentFlow = await readJourneyFlow(journey, client)
        const currentGuidance = await readGuidedNextAction(journey, currentFlow, client)
        if (actionProposal) {
          const currentContext = makeA2PlanContextSnapshot(currentFlow, currentGuidance)
          actionContextChanged = !currentContext.available || currentContext.hash !== actionProposal.expectedContextHash
            || guidedPracticeDay(currentFlow) !== actionProposal.dayNumber
        }
        const currentPlan = await readA2PlanAssistantEvidence(client, actorId!, currentFlow, currentGuidance)
        guidance = currentGuidance
        return currentPlan
      })
      const changed = await verifyCurrentActor()
      if (changed) return changed
      if (generation.signal.aborted) throw new Error('generation_cancelled')
      if (actionContextChanged) {
        outcome = 'action_context_changed'
        return fail(503, 'assistant_context_changed', 'Tu recorrido o ajuste cambió mientras revisábamos la consulta. Tu pregunta se conserva; vuelve a enviarla para usar el estado actual.')
      }
      if (JSON.stringify(latestPlan) !== JSON.stringify(plan)) {
        outcome = 'reviewed_plan_changed'
        return fail(503, 'assistant_context_changed', 'Tu plan cambió mientras revisábamos la consulta. Tu pregunta se conserva; vuelve a enviarla para usar el estado actual.')
      }
      outcome = fallbackReason === 'none' ? 'completed' : 'fallback_completed'
      served = generated
      logOperationalEvent({ event: 'a2.assistant.completed', requestId, route: '/api/despega/a2-coach', status: 200,
        metadata: { history_items: parsed.data.conversationHistory.length, a1_available: a1.status === 'available' } })
      return respond({ response: answer, guidance, ...(actionProposal ? { actionProposal } : {}) }, 200)
    } catch (error) {
      if (request.signal.aborted) {
        guidance = undefined
        outcome = 'cancelled'
        return fail(499, 'assistant_cancelled', 'La consulta se canceló. Puedes volver a intentarlo.')
      }
      if (generation.signal.aborted) {
        guidance = undefined
        outcome = 'deadline_exceeded'
        return fail(503, 'assistant_unavailable', 'La respuesta tardó o no pudo llegar. Tu pregunta se conserva; puedes reintentar.')
      }
      const changed = await verifyCurrentActor()
      if (changed) return changed
      if (error instanceof GenerationFailure) {
        outcome = error.code
        return fail(502, error.code, error.code === 'assistant_invalid_response'
          ? 'No recibimos una respuesta válida. Puedes reintentar.'
          : 'El asistente no pudo responder. Tu pregunta se conserva; puedes reintentar.')
      }
      outcome = generation.signal.aborted ? 'deadline_exceeded' : 'unavailable'
      return fail(503, 'assistant_unavailable', 'La respuesta tardó o no pudo llegar. Tu pregunta se conserva; puedes reintentar.')
    } finally {
      clearTimeout(timeout)
      generation.abort()
      request.signal.removeEventListener('abort', cancelGeneration)
      logOperationalEvent({ event: 'a2.assistant.execution', requestId, route: '/api/despega/a2-coach', status: responseStatus,
        metadata: {
          selected_variant: selection.variant, served_variant: served, cohort_reason: selection.reason,
          generated_variant: generated, candidate_sha: candidateSha, deployment_id: deploymentId,
          rollout_id: selection.rolloutId, config_revision: selection.configRevision,
          outcome, fallback_reason: fallbackReason, swarm_failure_stage: swarmStage,
          swarm_calls: swarmCalls, baseline_calls: baselineCalls, model_calls: swarmCalls + baselineCalls,
          swarm_elapsed_ms: swarmElapsedMs, elapsed_ms: Math.max(0, Date.now() - startedAt),
        } })
    }
  } catch {
    logOperationalEvent({ event: 'a2.assistant.context_unavailable', requestId, route: '/api/despega/a2-coach', status: 503 })
    return fail(503, 'context_unavailable', 'No pudimos verificar tu recorrido. Tu pregunta se conserva; recarga o vuelve a intentarlo.')
  }
}
