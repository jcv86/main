import { createAdminClient, createClient } from '@/lib/supabase/server'
import { getJourneyForCurrentUser } from '@/lib/journey/service'
import { readJourneyFlow } from '@/lib/journey/flow-service'
import { readGuidedNextAction } from '@/lib/journey/next-action-service'
import { checkA2PilotAccess } from '@/lib/a2/api-access'
import { A2PlanApiFailure, createA2PlanHandlers } from '@/lib/a2/plan-api'
import { a2PlanReceiptSchema, A2_PLAN_EXPECTED_ACTOR_HEADER, type A2PlanCommand } from '@/lib/a2/plan-contract'
import { makeA2PlanContextSnapshot } from '@/lib/a2/plan-context'
import { readA2PlanSlot } from '@/lib/a2/plan-service'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

async function authorize(request: Request) {
  const client = await createClient()
  const { data: { user }, error } = await client.auth.getUser()
  if (error || !user) throw new A2PlanApiFailure(401, 'authentication_required', 'Vuelve a iniciar sesión para recuperar tu plan.')
  if (request.headers.get(A2_PLAN_EXPECTED_ACTOR_HEADER) !== user.id) {
    throw new A2PlanApiFailure(409, 'session_changed', 'La sesión cambió. Recarga la página antes de continuar.')
  }
  if (request.method === 'POST') {
    const site = request.headers.get('sec-fetch-site')
    if (request.headers.get('origin') !== new URL(request.url).origin || (site !== null && site !== 'same-origin')) {
      throw new A2PlanApiFailure(403, 'origin_not_allowed', 'Abre tu plan desde Tu Ruta.')
    }
  }
  const pilot = await checkA2PilotAccess(user.id)
  if (pilot !== 'allowed') throw new A2PlanApiFailure(pilot === 'denied' ? 403 : 503, 'pilot_access_unavailable',
    pilot === 'denied' ? 'Necesitas acceso al piloto para usar tu plan.' : 'No pudimos verificar el acceso al piloto. Vuelve a intentarlo.')
  const journey = await getJourneyForCurrentUser()
  if (!journey || journey.user.id !== user.id) throw new A2PlanApiFailure(409, 'session_changed', 'La sesión cambió. Recarga la página antes de continuar.')
  if (!journey.access.a2) throw new A2PlanApiFailure(403, 'journey_access_required', 'Completa tu punto de partida antes de preparar tu plan de Tu Ruta.')
  return { id: user.id, client, journey }
}

function databaseFailure(error: { code?: string; message?: string }): never {
  const message = error.message ?? ''
  const known: Array<[string, number, string, string]> = [
    ['a2_plan_request_conflict', 409, 'plan_request_conflict', 'Ese envío corresponde a otra edición. Revisa los cambios antes de volver a guardar.'],
    ['a2_plan_context_changed', 409, 'plan_context_changed', 'El contexto cambió. Revísalo antes de confirmar el plan.'],
    ['a2_plan_context_unavailable', 503, 'plan_context_unavailable', 'No pudimos verificar el contexto. Tu edición se conserva.'],
    ['a2_plan_transition_invalid', 409, 'plan_transition_invalid', 'El plan cambió o tiene pasos pendientes. Vuelve a cargarlo y revisa su estado.'],
    ['a2_plan_expired', 409, 'plan_expired', 'Revisa el plan y elige una fecha vigente antes de activarlo.'],
    ['a2_plan_conflict', 409, 'plan_conflict', 'Hay una versión más reciente. Revisa los cambios antes de guardar.'],
    ['a2_plan_access_required', 403, 'pilot_access_unavailable', 'Tu acceso al piloto cambió. Vuelve a verificarlo.'],
    ['a2_plan_invalid_payload', 400, 'invalid_plan_request', 'Revisa el propósito, los pasos y la fecha del plan.'],
  ]
  for (const [match, status, code, safe] of known) if (message === match) throw new A2PlanApiFailure(status, code, safe)
  throw new A2PlanApiFailure(503, 'plan_unavailable', 'No pudimos confirmar el estado del plan. Reintenta la misma edición para recuperar el resultado.')
}

async function rpc(name: 'read_a2_plan_receipt' | 'mutate_a2_reviewed_plan', actorId: string, command: A2PlanCommand, snapshot?: unknown) {
  const admin = createAdminClient()
  const { data, error } = await admin.rpc(name, {
    p_user_id: actorId, p_command: command,
    ...(name === 'mutate_a2_reviewed_plan' ? { p_context_snapshot: snapshot ?? null } : {}),
  })
  if (error) databaseFailure(error)
  if (data === null && name === 'read_a2_plan_receipt') return null
  return a2PlanReceiptSchema.parse(data)
}

const handlers = createA2PlanHandlers({
  authorize,
  verifyOwner: async owner => {
    const { data, error } = await owner.client.auth.getUser()
    return !error && data.user?.id === owner.id
  },
  readSlot: owner => readA2PlanSlot(owner.client, owner.id),
  readContext: async owner => {
    const flow = await readJourneyFlow(owner.journey, owner.client)
    const guidance = await readGuidedNextAction(owner.journey, flow, owner.client)
    return { snapshot: makeA2PlanContextSnapshot(flow, guidance), guidance }
  },
  readReceipt: (owner, command) => rpc('read_a2_plan_receipt', owner.id, command),
  mutate: async (owner, command, snapshot) => {
    const receipt = await rpc('mutate_a2_reviewed_plan', owner.id, command, snapshot)
    if (!receipt) throw new Error('a2_plan_receipt_missing')
    return receipt
  },
})

export const GET = handlers.GET
export const POST = handlers.POST
