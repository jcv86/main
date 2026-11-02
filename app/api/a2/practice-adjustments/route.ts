import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import { getJourneyForCurrentUser } from '@/lib/journey/service'
import { checkA2PilotAccess } from '@/lib/a2/api-access'
import { getA2ProgressSnapshot } from '@/lib/a2/server-progress'
import { adjustmentRequestSchema, adjustmentContent, readAdjustmentContent } from '@/lib/a2/practice-adjustment'

const TYPE = 'a2_practice_adjustment'
const headers = { 'Cache-Control': 'private, no-store', 'CDN-Cache-Control': 'no-store', 'Vercel-CDN-Cache-Control': 'no-store' }
const MAX_BODY_BYTES = 80_000

async function readBoundedJson(request: Request): Promise<unknown> {
  if (Number(request.headers.get('content-length')) > MAX_BODY_BYTES) throw new Error('too_large')
  const reader = request.body?.getReader()
  if (!reader) throw new Error('invalid_json')
  const decoder = new TextDecoder('utf-8', { fatal: true })
  let bytes = 0
  let text = ''
  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      bytes += value.byteLength
      if (bytes > MAX_BODY_BYTES) {
        await reader.cancel()
        throw new Error('too_large')
      }
      text += decoder.decode(value, { stream: true })
    }
    return JSON.parse(text + decoder.decode())
  } finally {
    reader.releaseLock()
  }
}

export async function GET(request: Request) {
  try {
    const user = await resolveServerUser()
    if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401, headers })
    const pilot = await checkA2PilotAccess(user.id)
    if (pilot !== 'allowed') return NextResponse.json({ error: pilot === 'denied' ? 'Necesitas acceso al piloto.' : 'No pudimos verificar tu acceso al piloto.' }, { status: pilot === 'denied' ? 403 : 503, headers })
    const day = Number(new URL(request.url).searchParams.get('day'))
    if (!Number.isInteger(day) || day < 1 || day > 90) return NextResponse.json({ error: 'Día inválido' }, { status: 400, headers })
    const supabase = await createClient()
    const { data, error } = await supabase.from('dtc_documents')
      .select('id,content,created_at').eq('user_id', user.id).eq('type', TYPE).eq('related_day', day)
      .order('created_at', { ascending: false }).limit(10)
    if (error) return NextResponse.json({ error: 'No pudimos recuperar tus ajustes.' }, { status: 500, headers })
    return NextResponse.json({ adjustments: (data || []).flatMap((row) => {
      const content = readAdjustmentContent(row.content)
      return content ? [{ id: row.id, createdAt: row.created_at, ...content }] : []
    }) }, { headers })
  } catch {
    return NextResponse.json({ error: 'No pudimos recuperar tus ajustes.' }, { status: 500, headers })
  }
}

export async function POST(request: Request) {
  try {
    const user = await resolveServerUser()
    if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401, headers })
    const pilot = await checkA2PilotAccess(user.id)
    if (pilot !== 'allowed') return NextResponse.json({ error: pilot === 'denied' ? 'Necesitas acceso al piloto.' : 'No pudimos verificar tu acceso al piloto.' }, { status: pilot === 'denied' ? 403 : 503, headers })
    const journey = await getJourneyForCurrentUser()
    if (!journey || journey.user.id !== user.id || !journey.access.a2) {
      return NextResponse.json({ error: 'Completa tu punto de partida antes de guardar ajustes de Tu Ruta.' }, { status: 403, headers })
    }
    const origin = request.headers.get('origin')
    const fetchSite = request.headers.get('sec-fetch-site')
    if (origin !== new URL(request.url).origin || (fetchSite !== null && fetchSite !== 'same-origin')) {
      return NextResponse.json({ error: 'Origen no permitido.' }, { status: 403, headers })
    }
    const contentType = (request.headers.get('content-type') || '').split(';')[0].trim().toLowerCase()
    if (contentType !== 'application/json') return NextResponse.json({ error: 'Usa JSON para guardar el ajuste.' }, { status: 415, headers })
    let body: unknown
    try {
      body = await readBoundedJson(request)
    } catch (error) {
      const oversized = error instanceof Error && error.message === 'too_large'
      return NextResponse.json({ error: oversized ? 'El ajuste supera el tamaño permitido.' : 'Solicitud JSON inválida.' }, { status: oversized ? 413 : 400, headers })
    }
    const parsed = adjustmentRequestSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'Indica qué conservarás, una próxima acción y una fecha válida.' }, { status: 400, headers })
    const supabase = await createClient()
    const snapshot = await getA2ProgressSnapshot(user.id, supabase)
    if (parsed.data.dayNumber > snapshot.highestUnlockedDay) return NextResponse.json({ error: 'Este día todavía no está disponible.' }, { status: 409, headers })
    const content = JSON.stringify(adjustmentContent(parsed.data))
    // Append only. Never update completions, XP or an earlier adjustment.
    const { error } = await supabase.from('dtc_documents').insert({
      id: parsed.data.requestId,
      user_id: user.id,
      title: `Ajuste de práctica · Día ${parsed.data.dayNumber}`,
      type: TYPE,
      source_module: 'a2',
      related_day: parsed.data.dayNumber,
      source: 'user',
      status: 'draft',
      content,
    })
    if (error) {
      if (error.code !== '23505') throw error
      const { data: prior, error: priorError } = await supabase.from('dtc_documents')
        .select('id,content').eq('id', parsed.data.requestId).eq('user_id', user.id).eq('type', TYPE).maybeSingle()
      if (priorError || !prior || prior.content !== content) return NextResponse.json({ error: 'Este identificador ya fue usado; vuelve a guardar el ajuste.' }, { status: 409, headers })
    }
    return NextResponse.json({ success: true, id: parsed.data.requestId, adjustment: adjustmentContent(parsed.data) }, { headers })
  } catch {
    return NextResponse.json({ error: 'No pudimos guardar el ajuste. Tu avance anterior se conserva.' }, { status: 500, headers })
  }
}
