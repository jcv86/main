import { NextResponse } from 'next/server'
import { createAdminClient, createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ allowed: false }, { status: 401 })

  const admin = createAdminClient()
  const { data, error } = await admin.rpc('resolve_pilot_access', { p_user_id: user.id, p_claim_id: null })
  const access = Array.isArray(data) ? data[0] : data
  if (error) return NextResponse.json({ allowed: false }, { status: 503 })
  return NextResponse.json({ allowed: Boolean(access?.allowed), accessKind: access?.access_kind ?? null })
}
