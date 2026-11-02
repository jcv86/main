import { NextResponse } from 'next/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import { OBJECTIVE_COLUMNS, LaborObjectiveError, objectiveList, objectiveStorageValues, objectiveFromStoredFields, parseLaborObjective } from './labor-objective'
import { parsePrimarySearchRevision, SavedSearchError } from './saved-search'

const TABLE = 'career_search_intents'
const INPUT_KEYS = new Set(['targetRoles', 'functionalAreas', 'objectiveStage', 'breadth', 'locations', 'workModes', 'industries', 'excludedIndustries', 'unknownIndustryPolicy', 'locationPreference', 'name', 'seniorityMin', 'salaryMinClp', 'employmentTypes', 'languages', 'isPrimary', 'expectedRevision'])

export function privateObjectiveJson(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: {
    'Cache-Control': 'private, no-store, max-age=0', 'CDN-Cache-Control': 'no-store', 'Vercel-CDN-Cache-Control': 'no-store',
  } })
}
function conflictResponse() {
  return privateObjectiveJson({ error: 'Tu objetivo cambió en otra sesión. Conservamos tu borrador: vuelve a cargar lo guardado antes de reemplazarlo.', code: 'search_conflict' }, 409)
}
function unavailable(error: unknown) {
  const code = error && typeof error === 'object' && 'code' in error ? error.code : null
  if (code === '42703' || code === 'PGRST204') return privateObjectiveJson({
    error: 'El guardado del objetivo está temporalmente en actualización. Conserva tu borrador y vuelve a intentarlo.', code: 'objective_schema_pending',
  }, 503)
  return privateObjectiveJson({ error: 'No fue posible confirmar el guardado de tu objetivo. Tu borrador sigue disponible.' }, 503)
}
export type ObjectiveOwnerContext = { userId: string; supabase: SupabaseClient }
export type ObjectiveAuthorizer = () => Promise<ObjectiveOwnerContext | NextResponse>
class ObjectiveRequestError extends Error { constructor(message: string, readonly status: number) { super(message) } }
async function readObjectiveBody(request: Request): Promise<unknown> {
  const origin = request.headers.get('origin')
  const site = request.headers.get('sec-fetch-site')
  if (origin !== new URL(request.url).origin || (site !== null && site !== 'same-origin')) throw new ObjectiveRequestError('La solicitud debe provenir de esta aplicación.', 403)
  if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') throw new ObjectiveRequestError('Envía el objetivo en formato JSON.', 415)
  const maximum = 32_768
  const declared = request.headers.get('content-length')
  if (declared && (!/^\d+$/.test(declared) || Number(declared) > maximum)) throw new ObjectiveRequestError('El objetivo supera el tamaño permitido.', 413)
  if (!request.body) return null
  const reader = request.body.getReader()
  const chunks: Uint8Array[] = []
  let size = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > maximum) { await reader.cancel(); throw new ObjectiveRequestError('El objetivo supera el tamaño permitido.', 413) }
      chunks.push(value)
    }
  } finally { reader.releaseLock() }
  const bytes = new Uint8Array(size)
  let offset = 0
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength }
  try { return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)) }
  catch { throw new ObjectiveRequestError('Revisa el formato del objetivo laboral.', 400) }
}
export function createObjectiveHandlers(authorize: ObjectiveAuthorizer) {
  async function GET() {
    const context = await authorize()
    if (context instanceof NextResponse) return context
    try {
      const { data, error } = await context.supabase.from(TABLE).select(OBJECTIVE_COLUMNS)
        .eq('user_id', context.userId).eq('is_active', true)
        .order('is_primary', { ascending: false }).order('updated_at', { ascending: false })
        .order('id', { ascending: true }).limit(100)
      if (error || !Array.isArray(data)) throw error ?? new Error('Intent read unavailable')
      return privateObjectiveJson({ intents: data })
    } catch {
      return privateObjectiveJson({ error: 'No fue posible cargar tu objetivo guardado. Puedes reintentar sin perder tu borrador.' }, 503)
    }
  }

  async function POST(request: Request) {
    const context = await authorize()
    if (context instanceof NextResponse) return context
    let body: unknown
    try { body = await readObjectiveBody(request) }
    catch (error) { return privateObjectiveJson({ error: error instanceof ObjectiveRequestError ? error.message : 'No pudimos leer el objetivo.' }, error instanceof ObjectiveRequestError ? error.status : 400) }
    if (!body || typeof body !== 'object' || Array.isArray(body)) return privateObjectiveJson({ error: 'Revisa los datos de tu objetivo laboral.' }, 400)
    const input = body as Record<string, unknown>
    let values: Record<string, unknown>
    let expectedRevision: ReturnType<typeof parsePrimarySearchRevision> = null
    const isPrimary = input.isPrimary !== false
    try {
      if (Object.keys(input).some(key => !INPUT_KEYS.has(key)) || !Array.isArray(input.targetRoles)
          || (Object.hasOwn(input, 'isPrimary') && typeof input.isPrimary !== 'boolean')) throw new LaborObjectiveError('Revisa los campos de tu objetivo laboral.')
      if (isPrimary) expectedRevision = parsePrimarySearchRevision(input.expectedRevision)
      if (!input.targetRoles.length && input.objectiveStage === undefined) throw new LaborObjectiveError('Indica si tienes un objetivo definido o si estás explorando.')
      const objective = parseLaborObjective(input, true)
      values = { ...objectiveStorageValues(objective), source: 'user_confirmed' }
      // Omitted optional and advanced preferences retain their stored values.
      for (const [key, column] of [
        ['functionalAreas', 'functional_areas'], ['objectiveStage', 'objective_stage'], ['industries', 'industries'],
        ['excludedIndustries', 'excluded_industries'], ['unknownIndustryPolicy', 'unknown_industry_policy'],
      ] as const) if (!Object.hasOwn(input, key)) delete values[column]
      if (Object.hasOwn(input, 'name')) {
        if (typeof input.name !== 'string' || !input.name.trim() || input.name.length > 80) throw new LaborObjectiveError('El nombre debe tener entre 1 y 80 caracteres.')
        values.name = input.name.trim()
      }
      for (const [key, column] of [['employmentTypes', 'employment_types'], ['languages', 'languages']] as const) {
        if (Object.hasOwn(input, key)) values[column] = objectiveList(input[key], 6)
      }
      if (Object.hasOwn(input, 'seniorityMin')) {
        if (input.seniorityMin !== null && (typeof input.seniorityMin !== 'string' || !input.seniorityMin.trim() || input.seniorityMin.length > 60)) throw new LaborObjectiveError('Revisa la experiencia mínima.')
        values.seniority_min = typeof input.seniorityMin === 'string' ? input.seniorityMin.trim() : null
      }
      if (Object.hasOwn(input, 'salaryMinClp')) {
        if (input.salaryMinClp !== null && (!Number.isSafeInteger(input.salaryMinClp) || Number(input.salaryMinClp) < 0 || Number(input.salaryMinClp) > 2_147_483_647)) throw new LaborObjectiveError('Revisa el monto de renta mínima.')
        values.salary_min_clp = input.salaryMinClp
      }
    } catch (error) {
      if (error instanceof LaborObjectiveError || error instanceof SavedSearchError) return privateObjectiveJson({ error: error.message }, 400)
      return privateObjectiveJson({ error: 'Revisa los datos de tu objetivo laboral.' }, 400)
    }
    try {
      const { supabase, userId } = context
      if (isPrimary) {
        const { data: existing, error } = await supabase.from(TABLE).select(OBJECTIVE_COLUMNS)
          .eq('user_id', userId).eq('is_primary', true).eq('is_active', true).maybeSingle()
        if (error) throw error
        const currentRevision = existing ? parsePrimarySearchRevision({ id: existing.id, updatedAt: existing.updated_at }) : null
        if (currentRevision?.id !== expectedRevision?.id || currentRevision?.updatedAt !== expectedRevision?.updatedAt) return conflictResponse()
        if (currentRevision) {
          // Validate the actual merged objective, including fields an older editor
          // omitted. This never rewrites those omitted fields or weakens the CAS.
          try { objectiveFromStoredFields({ ...existing, ...values }) }
          catch (error) { return privateObjectiveJson({ error: error instanceof Error ? error.message : 'Revisa las preferencias del objetivo.' }, 400) }
          const result = await supabase.from(TABLE).update(values)
            .eq('id', currentRevision.id).eq('user_id', userId).eq('is_primary', true).eq('is_active', true)
            .eq('updated_at', currentRevision.updatedAt).select(OBJECTIVE_COLUMNS).maybeSingle()
          if (result.error) throw result.error
          if (!result.data) return conflictResponse()
          return privateObjectiveJson({ intent: result.data }, 200)
        }
      }
      const { data, error } = await supabase.from(TABLE).insert({
        ...values, user_id: userId, is_primary: isPrimary, is_active: true,
      }).select(OBJECTIVE_COLUMNS).single()
      if (error?.code === '23505') return conflictResponse()
      if (error || !data) throw error ?? new Error('Intent creation unavailable')
      return privateObjectiveJson({ intent: data }, 201)
    } catch (error) { return unavailable(error) }
  }

  return { GET, POST }
}
