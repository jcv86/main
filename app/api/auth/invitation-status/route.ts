import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const TOTAL_INVITATIONS = 100

export async function GET() {
  try {
    const supabase = createAdminClient()

    // Contar invitaciones redimidas
    const { count, error } = await supabase
      .from('user_invitations')
      .select('id', { count: 'exact', head: true })

    if (error) throw error

    const used = count || 0
    const remaining = Math.max(0, TOTAL_INVITATIONS - used)
    const percentFilled = Math.round((used / TOTAL_INVITATIONS) * 100)

    return NextResponse.json({
      total: TOTAL_INVITATIONS,
      used,
      remaining,
      percentFilled,
      available: remaining > 0
    })
  } catch (err) {
    console.error('[v0] Error obteniendo estado invitaciones:', err)
    return NextResponse.json(
      { error: 'Error obteniendo estado' },
      { status: 500 }
    )
  }
}
