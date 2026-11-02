import { NextResponse } from 'next/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import { recommendRouteByDISC } from '@/lib/a2/route-recommendation'

const NO_STORE_HEADERS = { 'Cache-Control': 'private, no-store' }

/** Retired endpoint: old callers receive an authenticated canonical handoff. */
export async function GET() {
  try {
    const user = await resolveServerUser()
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401, headers: NO_STORE_HEADERS })
    }
    return NextResponse.json({
      ...recommendRouteByDISC(),
      code: 'disc_route_recommendation_retired',
    }, { status: 410, headers: NO_STORE_HEADERS })
  } catch {
    return NextResponse.json({ error: 'No pudimos verificar tu sesión.' }, { status: 503, headers: NO_STORE_HEADERS })
  }
}
