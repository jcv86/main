import { NextResponse } from 'next/server'
import { createAdminClient, createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('dtc_outcome_observations')
    .select('measurement_role')
    .eq('user_id', user.id)
    .eq('instrument_key', 'a1_professional_clarity')
    .eq('instrument_version', '1')

  if (error) {
    console.error('[outcomes] A1 status read failed', { code: error.code })
    return NextResponse.json({ error: 'Outcome status unavailable' }, { status: 503 })
  }

  const roles = new Set((data ?? []).map((row) => row.measurement_role))
  return NextResponse.json({
    baselineCompleted: roles.has('baseline'),
    followUpCompleted: roles.has('follow_up'),
  })
}
