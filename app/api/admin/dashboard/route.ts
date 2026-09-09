import { NextResponse } from 'next/server'

import { getSuperadminUser } from '@/lib/auth/require-superadmin'
import { createAdminClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
const noStore = { 'Cache-Control': 'private, no-store, max-age=0' }

export async function GET() {
  if (!(await getSuperadminUser())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403, headers: noStore })
  }

  const admin = createAdminClient()
  const activeSince = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const [profiles, active, a1, progress, rankings] = await Promise.all([
    admin.from('despega_user_profiles').select('*').order('created_at', { ascending: false }),
    admin.from('despega_user_profiles').select('id', { count: 'exact', head: true }).gte('last_activity', activeSince),
    admin.from('despega_a1_results').select('score_energia,score_enfoque,score_relaciones,score_plan_ejecutivo'),
    admin.from('despega_pilar_progress').select('pilar,progreso,score'),
    admin.from('despega_rankings').select('user_id,score_total').order('score_total', { ascending: false }).limit(5),
  ])

  if (profiles.error || active.error || a1.error || progress.error || rankings.error) {
    return NextResponse.json({ error: 'Unable to load admin dashboard' }, { status: 500, headers: noStore })
  }

  return NextResponse.json({
    profiles: profiles.data ?? [],
    activeUsers: active.count ?? 0,
    a1Results: a1.data ?? [],
    pillarProgress: progress.data ?? [],
    rankings: rankings.data ?? [],
  }, { headers: noStore })
}
