import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = createClient()
  const userId = request.nextUrl.searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 })
  }

  try {
    const { data: entrevistas } = await supabase
      .from('a3_entrevistas')
      .select('*')
      .order('orden')

    const { data: userProgress } = await supabase
      .from('a3_user_entrevistas')
      .select('*')
      .eq('user_id', userId)

    return NextResponse.json({
      entrevistas,
      completadas: userProgress?.length || 0
    })
  } catch (error) {
    console.error('[v0] Error fetching entrevistas:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const body = await request.json()

  const { userId, entrevistaId, respuestas, score, tipo } = body

  if (!userId || !entrevistaId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    const { data, error } = await supabase
      .from('a3_user_entrevistas')
      .insert({
        user_id: userId,
        entrevista_id: entrevistaId,
        respuestas,
        score,
        tipo,
        estado: 'completada',
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('[v0] Error saving entrevista:', error)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}
