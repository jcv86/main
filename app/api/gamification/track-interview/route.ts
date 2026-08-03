import { NextResponse } from 'next/server'
import { resolveServerUser } from '@/lib/auth/server-user'

export const runtime = 'nodejs'

export async function POST() {
  const currentUser = await resolveServerUser()

  if (!currentUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json(
    {
      error: 'Este endpoint heredado fue retirado. El XP se calcula en el flujo canónico de A3.',
      code: 'LEGACY_GAMIFICATION_ENDPOINT_RETIRED',
    },
    { status: 410 },
  )
}
