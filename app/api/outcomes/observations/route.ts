import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient, createClient } from '@/lib/supabase/server'
import {
  A1_PROFESSIONAL_CLARITY_V1,
  A3_INTERVIEW_CAPABILITY_V1,
  compareOutcomePair,
} from '@/lib/outcomes/instruments'

const dimensionScore = z.number().int().min(0).max(4)

const payloadSchema = z.object({
  outcomeKey: z.enum(['professional_clarity', 'interview_capability']),
  measurementRole: z.enum(['baseline', 'follow_up']),
  instrumentKey: z.enum(['a1_professional_clarity', 'a3_structured_interview']),
  instrumentVersion: z.literal('1'),
  score: z.number().int().min(0).max(20),
  scoreScaleMin: z.literal(0),
  scoreScaleMax: z.union([z.literal(16), z.literal(20)]),
  dimensions: z.record(z.string(), dimensionScore),
  evidenceRefs: z.array(z.object({
    source: z.string().min(1).max(80),
    ref: z.string().min(1).max(160),
  }).strict()).max(12),
  confidence: z.number().min(0).max(1).nullable().optional(),
  responsePayload: z.record(z.string(), z.string().trim().min(1).max(900)).optional(),
}).strict()

function instrumentFor(key: string) {
  if (key === A1_PROFESSIONAL_CLARITY_V1.instrumentKey) return A1_PROFESSIONAL_CLARITY_V1
  if (key === A3_INTERVIEW_CAPABILITY_V1.instrumentKey) return A3_INTERVIEW_CAPABILITY_V1
  return null
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let json: unknown
  try {
    json = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = payloadSchema.safeParse(json)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid outcome observation' }, { status: 400 })

  const body = parsed.data
  const instrument = instrumentFor(body.instrumentKey)
  if (!instrument) return NextResponse.json({ error: 'Unknown instrument' }, { status: 400 })

  if (body.instrumentKey === 'a1_professional_clarity') {
    const requiredResponseKeys = ['target', 'value', 'evidence', 'gap']
    const payload = body.responsePayload
    const validPayload = payload
      && Object.keys(payload).length === requiredResponseKeys.length
      && requiredResponseKeys.every((key) => {
        const value = payload[key]
        return typeof value === 'string' && value.trim().split(/\s+/).filter(Boolean).length >= 5
      })

    if (!validPayload) {
      return NextResponse.json({ error: 'A1 response evidence is required' }, { status: 400 })
    }
  }

  if (
    body.outcomeKey !== instrument.outcomeKey
    || body.instrumentVersion !== instrument.instrumentVersion
    || body.scoreScaleMin !== instrument.scale.min
    || body.scoreScaleMax !== instrument.scale.max
    || !([...instrument.dimensions] as readonly string[]).every((key) => Number.isFinite(body.dimensions[key]))
  ) {
    return NextResponse.json({ error: 'Observation does not match instrument contract' }, { status: 400 })
  }

  const admin = createAdminClient()
  const observation = {
    user_id: user.id,
    outcome_key: body.outcomeKey,
    stage: instrument.stage,
    measurement_role: body.measurementRole,
    instrument_key: body.instrumentKey,
    instrument_version: body.instrumentVersion,
    score: body.score,
    score_scale_min: body.scoreScaleMin,
    score_scale_max: body.scoreScaleMax,
    dimensions: body.dimensions,
    evidence_refs: body.evidenceRefs,
    confidence: body.confidence ?? null,
    response_payload: body.responsePayload ?? null,
    observed_at: new Date().toISOString(),
  }

  const { data: inserted, error: insertError } = await admin
    .from('dtc_outcome_observations')
    .insert(observation)
    .select('id,observed_at')
    .single()

  if (insertError || !inserted) {
    console.error('[outcomes] observation write failed', { code: insertError?.code ?? 'unknown' })
    return NextResponse.json({ error: 'Outcome storage unavailable' }, { status: 503 })
  }

  const { data: rows, error: readError } = await admin
    .from('dtc_outcome_observations')
    .select('id,measurement_role,instrument_key,instrument_version,score,score_scale_min,score_scale_max,dimensions,confidence,observed_at')
    .eq('user_id', user.id)
    .eq('outcome_key', body.outcomeKey)
    .eq('instrument_key', body.instrumentKey)
    .eq('instrument_version', body.instrumentVersion)
    .order('observed_at', { ascending: true })

  if (readError) {
    return NextResponse.json({ stored: true, comparable: false, observationId: inserted.id }, { status: 201 })
  }

  const baseline = rows?.find((row) => row.measurement_role === 'baseline')
  const followUp = [...(rows ?? [])].reverse().find((row) => row.measurement_role === 'follow_up')

  if (!baseline || !followUp) {
    await admin.from('dtc_outcome_snapshots').upsert({
      user_id: user.id,
      outcome_key: body.outcomeKey,
      baseline_observation_id: baseline?.id ?? null,
      latest_observation_id: followUp?.id ?? null,
      normalized_baseline: null,
      normalized_latest: null,
      normalized_delta: null,
      comparable: false,
      confidence: null,
      next_best_action_key: null,
      computed_at: new Date().toISOString(),
    })
    return NextResponse.json({ stored: true, comparable: false, observationId: inserted.id }, { status: 201 })
  }

  const result = compareOutcomePair({
    instrumentKey: baseline.instrument_key,
    instrumentVersion: baseline.instrument_version,
    score: baseline.score,
    scoreScaleMin: baseline.score_scale_min,
    scoreScaleMax: baseline.score_scale_max,
    dimensions: baseline.dimensions as Record<string, number>,
    observedAt: baseline.observed_at,
  }, {
    instrumentKey: followUp.instrument_key,
    instrumentVersion: followUp.instrument_version,
    score: followUp.score,
    scoreScaleMin: followUp.score_scale_min,
    scoreScaleMax: followUp.score_scale_max,
    dimensions: followUp.dimensions as Record<string, number>,
    observedAt: followUp.observed_at,
  }, instrument)

  const confidenceValues = [baseline, followUp]
    .map((row) => Number((row as { confidence?: number | null }).confidence))
    .filter(Number.isFinite)
  const confidence = confidenceValues.length
    ? Math.min(...confidenceValues)
    : null

  await admin.from('dtc_outcome_snapshots').upsert({
    user_id: user.id,
    outcome_key: body.outcomeKey,
    baseline_observation_id: baseline.id,
    latest_observation_id: followUp.id,
    normalized_baseline: result.normalizedBaseline,
    normalized_latest: result.normalizedLatest,
    normalized_delta: result.normalizedDelta,
    comparable: result.comparable,
    confidence,
    next_best_action_key: null,
    computed_at: new Date().toISOString(),
  })

  return NextResponse.json({
    stored: true,
    comparable: result.comparable,
    normalizedBaseline: result.normalizedBaseline,
    normalizedLatest: result.normalizedLatest,
    normalizedDelta: result.normalizedDelta,
    observationId: inserted.id,
  }, { status: 201 })
}
