import { NextRequest, NextResponse } from 'next/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import { createAdminClient } from '@/lib/supabase/server'
import { checkA4Access, getA4AccessDenialMessage } from '@/lib/a4/access-control'
import { validateSignalInput } from '@/lib/a4/strategic-radar'

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
