import { NextRequest, NextResponse } from 'next/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import { createAdminClient } from '@/lib/supabase/server'
import { checkA4Access, getA4AccessDenialMessage } from '@/lib/a4/access-control'
import { validateSignalInput } from '@/lib/a4/strategic-radar'
import {
  A4SourceVerificationError,
  nonExternalSourceVerification,
  verifyExternalSourceUrl,
} from '@/lib/a4/source-integrity'

const SIGNAL_COLUMNS = [
  'id',
  'title',
  'category',
  'classification',
  'summary',
  'relevance',
  'confidence',
  'source_type',
  'source_name',
  'source_url',
  'source_reference',
  'source_date',
  'source_verification_status',
  'source_authority',
  'source_checked_at',
  'source_http_status',
  'source_final_url',
  'source_verification_note',
  'status',
  'created_at',
  'updated_at',
].join(',')

async function resolveA4Request() {
  const currentUser = await resolveServerUser()
  if (!currentUser) {
    return {
      response: NextResponse.json({ error: 'No autenticado' }, { status: 401 }),
      currentUser: null,
      supabase: null,
    }
  }

  const supabase = createAdminClient()
  const access = await checkA4Access(currentUser.id, supabase)
  if (!access.canAccess) {
    return {
      response: NextResponse.json(
        { error: getA4AccessDenialMessage(), code: access.reason },
        { status: 403 },
      ),
      currentUser: null,
      supabase: null,
    }
  }

  return { response: null, currentUser, supabase }
}

export async function GET() {
  try {
    const resolved = await resolveA4Request()
    if (resolved.response) return resolved.response

    const { data, error } = await resolved.supabase!
      .from('a4_verified_signals')
      .select(SIGNAL_COLUMNS)
      .eq('user_id', resolved.currentUser!.id)
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) {
      console.error('[v0] A4 signal list error:', error)
      return NextResponse.json(
        { error: 'No pudimos cargar la bitácora de señales.' },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true, signals: data ?? [] })
  } catch (error) {
    console.error('[v0] A4 signal GET error:', error)
    return NextResponse.json(
      { error: 'No pudimos cargar la bitácora de señales.' },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const resolved = await resolveA4Request()
    if (resolved.response) return resolved.response

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 })
    }

    const validation = validateSignalInput(body)
    if (!validation.valid || !validation.value) {
      return NextResponse.json(
        {
          error: 'La señal necesita información verificable antes de guardarse.',
          validation,
        },
        { status: 422 },
      )
    }

    const value = validation.value
    let sourceVerification
    try {
      sourceVerification =
        value.sourceType === 'external_url' && value.sourceUrl
          ? await verifyExternalSourceUrl(value.sourceUrl)
          : nonExternalSourceVerification()
    } catch (error) {
      if (error instanceof A4SourceVerificationError) {
        return NextResponse.json(
          {
            error: error.message,
            validation: { valid: false, errors: [error.message], value: null },
          },
          { status: 422 },
        )
      }
      throw error
    }

    const { data, error } = await resolved.supabase!
      .from('a4_verified_signals')
      .insert({
        user_id: resolved.currentUser!.id,
        title: value.title,
        category: value.category,
        classification: value.classification,
        summary: value.summary,
        relevance: value.relevance,
        confidence: value.confidence,
        source_type: value.sourceType,
        source_name: value.sourceName,
        source_url: value.sourceUrl,
        source_reference: value.sourceReference,
        source_date: value.sourceDate,
        source_verification_status: sourceVerification.status,
        source_authority: sourceVerification.authority,
        source_checked_at: sourceVerification.checkedAt,
        source_http_status: sourceVerification.httpStatus,
        source_final_url: sourceVerification.finalUrl,
        source_verification_note: sourceVerification.note,
        status: 'active',
      })
      .select(SIGNAL_COLUMNS)
      .single()

    if (error || !data) {
      console.error('[v0] A4 signal insert error:', error)
      return NextResponse.json(
        { error: 'No pudimos guardar la señal.' },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true, signal: data }, { status: 201 })
  } catch (error) {
    console.error('[v0] A4 signal POST error:', error)
    return NextResponse.json(
      { error: 'No pudimos guardar la señal.' },
      { status: 500 },
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const resolved = await resolveA4Request()
    if (resolved.response) return resolved.response

    let body: Record<string, unknown>
    try {
      body = (await request.json()) as Record<string, unknown>
    } catch {
      return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 })
    }

    const signalId = typeof body.signalId === 'string' ? body.signalId.trim() : ''
    const action = body.action === 'verify_source' ? 'verify_source' : null

    if (signalId && action === 'verify_source') {
      const { data: signal, error: signalError } = await resolved.supabase!
        .from('a4_verified_signals')
        .select('id,source_type,source_url')
        .eq('id', signalId)
        .eq('user_id', resolved.currentUser!.id)
        .maybeSingle()

      if (signalError) {
        console.error('[v0] A4 source verification lookup error:', signalError)
        return NextResponse.json({ error: 'No pudimos cargar la fuente.' }, { status: 500 })
      }
      if (!signal) {
        return NextResponse.json({ error: 'Señal no encontrada.' }, { status: 404 })
      }

      let verification
      try {
        verification =
          signal.source_type === 'external_url' && signal.source_url
            ? await verifyExternalSourceUrl(signal.source_url)
            : nonExternalSourceVerification()
      } catch (error) {
        if (error instanceof A4SourceVerificationError) {
          const checkedAt = new Date().toISOString()
          const { data: unavailable, error: unavailableError } = await resolved.supabase!
            .from('a4_verified_signals')
            .update({
              source_verification_status: 'unavailable',
              source_authority: 'requires_corroboration',
              source_checked_at: checkedAt,
              source_http_status: null,
              source_final_url: null,
              source_verification_note: error.message,
            })
            .eq('id', signalId)
            .eq('user_id', resolved.currentUser!.id)
            .select(SIGNAL_COLUMNS)
            .maybeSingle()
          if (unavailableError || !unavailable) {
            console.error('[v0] A4 unavailable source update error:', unavailableError)
            return NextResponse.json(
              { error: 'No pudimos guardar la verificación.' },
              { status: 500 },
            )
          }
          return NextResponse.json(
            { error: error.message, signal: unavailable },
            { status: 422 },
          )
        }
        throw error
      }

      const { data: verified, error: updateError } = await resolved.supabase!
        .from('a4_verified_signals')
        .update({
          source_verification_status: verification.status,
          source_authority: verification.authority,
          source_checked_at: verification.checkedAt,
          source_http_status: verification.httpStatus,
          source_final_url: verification.finalUrl,
          source_verification_note: verification.note,
        })
        .eq('id', signalId)
        .eq('user_id', resolved.currentUser!.id)
        .select(SIGNAL_COLUMNS)
        .maybeSingle()

      if (updateError || !verified) {
        console.error('[v0] A4 source verification update error:', updateError)
        return NextResponse.json({ error: 'No pudimos guardar la verificación.' }, { status: 500 })
      }
      return NextResponse.json({ success: true, signal: verified })
    }

    const status = body.status === 'archived' ? 'archived' : body.status === 'active' ? 'active' : ''
    if (!signalId || !status) {
      return NextResponse.json(
        { error: 'La señal o el estado no son válidos.' },
        { status: 400 },
      )
    }

    const { data, error } = await resolved.supabase!
      .from('a4_verified_signals')
      .update({ status })
      .eq('id', signalId)
      .eq('user_id', resolved.currentUser!.id)
      .select(SIGNAL_COLUMNS)
      .maybeSingle()

    if (error) {
      console.error('[v0] A4 signal update error:', error)
      return NextResponse.json(
        { error: 'No pudimos actualizar la señal.' },
        { status: 500 },
      )
    }
    if (!data) {
      return NextResponse.json({ error: 'Señal no encontrada.' }, { status: 404 })
    }

    return NextResponse.json({ success: true, signal: data })
  } catch (error) {
    console.error('[v0] A4 signal PATCH error:', error)
    return NextResponse.json(
      { error: 'No pudimos actualizar la señal.' },
      { status: 500 },
    )
  }
}
