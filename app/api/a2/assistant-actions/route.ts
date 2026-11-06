import { createAdminClient, createClient } from '@/lib/supabase/server'
import { getJourneyForCurrentUser } from '@/lib/journey/service'
import { readJourneyFlow } from '@/lib/journey/flow-service'
import { guidedPracticeDay } from '@/lib/journey/next-action'
import { readGuidedNextAction } from '@/lib/journey/next-action-service'
import { checkA2PilotAccess } from '@/lib/a2/api-access'
import { A2ActionApiFailure, createA2ActionHandlers } from '@/lib/a2/assistant-action-api'
import { A2_ACTION_EXPECTED_ACTOR_HEADER, a2ActionReceiptSchema, type A2ActionCommand } from '@/lib/a2/assistant-action-contract'
import { makeA2PlanContextSnapshot, readA2PlanContextSnapshot } from '@/lib/a2/plan-context'
import { readA2ActionEffect } from '@/lib/a2/assistant-action-service'
import { readA2ReviewEvidence } from '@/lib/a2/review-evidence-service'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

async function authorize(request: Request) {
  const client = await createClient()
  const { data: { user }, error } = await client.auth.getUser()
  if (error || !user) throw new A2ActionApiFailure(401, 'authentication_required', 'Vuelve a iniciar sesión para revisar tu ajuste.')
  if (request.headers.get(A2_ACTION_EXPECTED_ACTOR_HEADER) !== user.id) {
    throw new A2ActionApiFailure(409, 'session_changed', 'La sesión cambió. Recarga la página antes de continuar.')
  }
  if (request.method === 'POST') {
    const site = request.headers.get('sec-fetch-site')
    if (request.headers.get('origin') !== new URL(request.url).origin || (site !== null && site !== 'same-origin')) {
      throw new A2ActionApiFailure(403, 'origin_not_allowed', 'Abre el ajuste desde Tu Ruta.')
    }
  }
  const pilot = await checkA2PilotAccess(user.id)
  if (pilot !== 'allowed') throw new A2ActionApiFailure(pilot === 'denied' ? 403 : 503, 'pilot_access_unavailable',
    pilot === 'denied' ? 'Necesitas acceso al piloto para guardar ajustes.' : 'No pudimos verificar el acceso al piloto. Vuelve a intentarlo.')
  const journey = await getJourneyForCurrentUser('read-only')
  if (!journey) throw new A2ActionApiFailure(403, 'journey_access_required', 'Completa tu punto de partida antes de ajustar la práctica de Tu Ruta.')
  if (journey.user.id !== user.id) throw new A2ActionApiFailure(409, 'session_changed', 'La sesión cambió. Recarga la página antes de continuar.')
  if (!journey.access.a2) throw new A2ActionApiFailure(403, 'journey_access_required', 'Completa tu punto de partida antes de ajustar la práctica de Tu Ruta.')
  return { id: user.id, client, journey }
}

function databaseFailure(error: { code?: string; message?: string }): never {
  const known: Array<[string, number, string, string]> = [
    ['a2_action_request_conflict', 409, 'action_request_conflict', 'Ese envío corresponde a otra edición. Revisa el ajuste antes de volver a guardar.'],
    ['a2_action_context_changed', 409, 'action_context_changed', 'El contexto cambió. Revísalo antes de confirmar el ajuste.'],
    ['a2_action_context_unavailable', 503, 'action_context_unavailable', 'No pudimos verificar el contexto. Tu edición se conserva.'],
    ['a2_action_day_changed', 409, 'action_day_changed', 'El día pendiente cambió. Revisa el siguiente paso antes de confirmar.'],
    ['a2_action_review_date_invalid', 409, 'action_review_date_invalid', 'Elige una fecha de revisión entre hoy y los próximos 30 días.'],
    ['a2_plan_access_required', 403, 'pilot_access_unavailable', 'Tu acceso al piloto cambió. Vuelve a verificarlo.'],
    ['a2_action_invalid_payload', 400, 'invalid_action_request', 'Revisa el trabajo conservado, la siguiente acción y la fecha del ajuste.'],
  ]
  for (const [match, status, code, safe] of known) if (error.message === match) throw new A2ActionApiFailure(status, code, safe)
  throw new A2ActionApiFailure(503, 'action_unavailable', 'No pudimos confirmar el resultado. Reintenta el mismo envío para recuperarlo.')
}

async function rpc(name: 'read_a2_assistant_action_receipt' | 'confirm_a2_assistant_action', actorId: string, command: A2ActionCommand, snapshot?: unknown) {
  const { data, error } = await createAdminClient().rpc(name, {
    p_user_id: actorId, p_command: command,
    ...(name === 'confirm_a2_assistant_action' ? { p_context_snapshot: snapshot ?? null } : {}),
  })
  if (error) databaseFailure(error)
  if (data === null && name === 'read_a2_assistant_action_receipt') return null
  return a2ActionReceiptSchema.parse(data)
}

const handlers = createA2ActionHandlers({
  authorize,
  verifyOwner: async owner => {
    const { data, error } = await owner.client.auth.getUser()
    return !error && data.user?.id === owner.id
  },
  readContext: async owner => {
    const flow = await readJourneyFlow(owner.journey, owner.client)
    const [guidance, reviewEvidence] = await Promise.all([
      readGuidedNextAction(owner.journey, flow, owner.client),
      readA2ReviewEvidence(owner.client, owner.id, flow, owner.journey.access),
    ])
    // The server supplies the snapshot. The submitted command contains only the
    // fingerprint of the context reviewed in the browser, never its authority.
    const snapshot = readA2PlanContextSnapshot(makeA2PlanContextSnapshot(flow, guidance, new Date(), reviewEvidence))
    return { dayNumber: guidedPracticeDay(flow), snapshot, guidance }
  },
  readReceipt: (owner, command) => rpc('read_a2_assistant_action_receipt', owner.id, command),
  mutate: async (owner, command, snapshot) => {
    const receipt = await rpc('confirm_a2_assistant_action', owner.id, command, snapshot)
    if (!receipt) throw new Error('a2_action_receipt_missing')
    return receipt
  },
  readEffect: (owner, command, receipt) => readA2ActionEffect(owner.client, owner.id, command, receipt),
})

export const GET = handlers.GET
export const POST = handlers.POST
