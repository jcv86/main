import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/utils/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const body = await request.json()
    const { responses } = body

    if (!responses) {
      return NextResponse.json({ error: 'No responses provided' }, { status: 400 })
    }

    // Guardar el test completado
    const { data, error } = await supabase
      .from('despega_cerebral_test')
      .insert({
        user_id: user.id,
        responses: responses,
        completed_at: new Date().toISOString(),
        status: 'completed'
      })
      .select()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('[v0] Error saving test:', error)
    return NextResponse.json(
      { error: 'Error guardando test' },
      { status: 500 }
    )
  }
}
