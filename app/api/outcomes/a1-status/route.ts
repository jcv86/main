import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { OUTCOME_CAPTURE_VERSION } from '@/lib/outcomes/response-capture'

export const dynamic = 'force-dynamic'
const headers = { 'Cache-Control': 'private, no-store, max-age=0',
  'CDN-Cache-Control': 'no-store', 'Vercel-CDN-Cache-Control': 'no-store' }
const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers })

/** Completion of answer capture is not an evaluated improvement. Retain legacy journey continuity. */
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return json({ error: 'Vuelve a iniciar sesión.' }, 401)
    const signal = AbortSignal.timeout(8000)
    const read = (role: 'baseline' | 'follow_up') => supabase.from('dtc_outcome_observations')
      .select('measurement_role').eq('user_id', user.id)
      .eq('outcome_key', 'professional_clarity').eq('instrument_key', 'a1_professional_clarity')
      .in('instrument_version', ['1', OUTCOME_CAPTURE_VERSION]).eq('measurement_role', role)
      .limit(1).abortSignal(signal).maybeSingle()
    const [baseline, followUp] = await Promise.all([read('baseline'), read('follow_up')])
    if (baseline.error || followUp.error) throw new Error('Outcome status unavailable')
    return json({ baselineCompleted: baseline.data?.measurement_role === 'baseline',
      followUpCompleted: followUp.data?.measurement_role === 'follow_up' })
  } catch { return json({ error: 'No pudimos verificar tus registros de A1.' }, 503) }
}
