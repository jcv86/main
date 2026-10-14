import { captureHistory, captureInstrumentKey, savedCaptureFromRow } from '@/lib/outcomes/response-history'
import { NextResponse } from 'next/server'
import { createAdminClient, createClient } from '@/lib/supabase/server'
import {
  CAPTURE_INSTRUMENTS, CaptureValidationError, MAX_CAPTURE_BODY_BYTES,
  OUTCOME_CAPTURE_VERSION, captureNextAction, captureObservation,
  isRecord, parseOutcomeCapture, type OutcomeCapture,
} from '@/lib/outcomes/response-capture'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
const headers = {
  'Cache-Control': 'private, no-store, max-age=0',
  'CDN-Cache-Control': 'no-store', 'Vercel-CDN-Cache-Control': 'no-store',
}
const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers })

async function readBoundedJson(request: Request): Promise<unknown> {
  if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') {
    throw new CaptureValidationError('Envía las respuestas en formato JSON.', 415)
  }
  const reader = request.body?.getReader()
  if (!reader) throw new CaptureValidationError('Faltan las respuestas del ejercicio.')
  const decoder = new TextDecoder('utf-8', { fatal: true })
  let bytes = 0
  let text = ''
  try {
    while (true) {
      const part = await reader.read()
      if (part.done) break
      bytes += part.value.byteLength
      if (bytes > MAX_CAPTURE_BODY_BYTES) {
        await reader.cancel().catch(() => undefined)
        throw new CaptureValidationError('El registro supera el tamaño permitido.', 413)
      }
      text += decoder.decode(part.value, { stream: true })
    }
    text += decoder.decode()
    return JSON.parse(text)
  } catch (error) {
    if (error instanceof CaptureValidationError) throw error
    throw new CaptureValidationError('No pudimos leer las respuestas. Revisa el formato.')
  } finally { reader.releaseLock() }
}

function storedResponse(capture: OutcomeCapture, observedAt: string, reused = false) {
  return json({
    stored: true, observationId: capture.observationId, observedAt, reused,
    instrumentVersion: OUTCOME_CAPTURE_VERSION,
    measurementStatus: 'recorded_pending_evaluation',
    comparable: false, normalizedBaseline: null, normalizedLatest: null, normalizedDelta: null,
    confidence: null,
    nextAction: captureNextAction(CAPTURE_INSTRUMENTS[capture.instrumentKey], capture.measurementRole),
  }, reused ? 200 : 201)
}

function sameCapture(row: unknown, capture: OutcomeCapture): row is Record<string, unknown> {
  if (!isRecord(row) || row.id !== capture.observationId
      || row.instrument_key !== capture.instrumentKey || row.instrument_version !== OUTCOME_CAPTURE_VERSION
      || row.outcome_key !== capture.outcomeKey || row.measurement_role !== capture.measurementRole
      || typeof row.observed_at !== 'string' || !Number.isFinite(Date.parse(row.observed_at))
      || !isRecord(row.response_payload)) return false
  const answers = row.response_payload
  const keys = Object.keys(capture.responsePayload)
  return Object.keys(answers).length === keys.length
    && keys.every(key => answers[key] === capture.responsePayload[key])
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return json({ error: 'Vuelve a iniciar sesión para guardar tus respuestas.' }, 401)
    const origin = request.headers.get('origin')
    if ((origin && origin !== new URL(request.url).origin)
        || request.headers.get('sec-fetch-site') === 'cross-site') {
      return json({ error: 'No se permite guardar desde este origen.' }, 403)
    }
    const capture = parseOutcomeCapture(await readBoundedJson(request))
    const observedAt = new Date().toISOString()
    const admin = createAdminClient()
    const { data, error } = await admin.from('dtc_outcome_observations')
      .insert(captureObservation(capture, user.id, observedAt))
      .select('id,observed_at').single()
    if (error?.code === '23505') {
      // A retry uses the same UUID. Read through the owner's session and RLS, never an unrestricted admin lookup.
      const existing = await supabase.from('dtc_outcome_observations')
        .select('id,outcome_key,measurement_role,instrument_key,instrument_version,response_payload,observed_at')
        .eq('user_id', user.id).eq('id', capture.observationId).maybeSingle()
      if (!existing.error && sameCapture(existing.data, capture)) {
        return storedResponse(capture, existing.data.observed_at as string, true)
      }
      return json({ error: 'No pudimos confirmar este registro. Conserva tus respuestas y revisa el estado antes de volver a enviarlo.' }, 409)
    }
    if (error || !data || data.id !== capture.observationId || typeof data.observed_at !== 'string'
        || !Number.isFinite(Date.parse(data.observed_at))) {
      return json({ error: 'No pudimos confirmar el guardado. Tus respuestas siguen en el formulario.' }, 503)
    }
    // v1 scores and snapshots are not rewritten. Raw response capture does not generate a numeric improvement.
    return storedResponse(capture, data.observed_at)
  } catch (error) {
    if (error instanceof CaptureValidationError) return json({ error: error.message }, error.status)
    return json({ error: 'No pudimos confirmar el guardado. Conservamos tus respuestas para reintentar.' }, 503)
  }
}

/** Session/RLS reads only. A refresh never initializes or rewrites outcomes. */
export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return json({ error: 'Vuelve a iniciar sesión para revisar tus respuestas.' }, 401)
    const url = new URL(request.url)
    const instrumentKey = captureInstrumentKey(url.searchParams.get('instrument'))
    if (!instrumentKey || url.searchParams.getAll('instrument').length !== 1
        || [...url.searchParams.keys()].some(key => key !== 'instrument')) {
      return json({ error: 'Elige un ejercicio válido para revisar tus respuestas.' }, 400)
    }
    const now = new Date()
    const signal = AbortSignal.timeout(8000)
    const read = (role: 'baseline' | 'follow_up') => supabase.from('dtc_outcome_observations')
      .select('id,outcome_key,measurement_role,instrument_key,instrument_version,response_payload,observed_at')
      .eq('user_id', user.id).eq('outcome_key', CAPTURE_INSTRUMENTS[instrumentKey].outcomeKey)
      .eq('instrument_key', instrumentKey).eq('instrument_version', OUTCOME_CAPTURE_VERSION)
      .eq('measurement_role', role).order('observed_at', { ascending: false })
      .order('id', { ascending: false }).limit(1).abortSignal(signal).maybeSingle()
    const [initial, latest] = await Promise.all([read('baseline'), read('follow_up')])
    if (initial.error || latest.error) throw new Error('Capture history unavailable')
    return json(captureHistory(instrumentKey,
      savedCaptureFromRow(initial.data, instrumentKey, 'baseline', now),
      savedCaptureFromRow(latest.data, instrumentKey, 'follow_up', now)))
  } catch {
    return json({ error: 'No pudimos recuperar tus respuestas. Esto no significa que no estén guardadas.' }, 503)
  }
}
