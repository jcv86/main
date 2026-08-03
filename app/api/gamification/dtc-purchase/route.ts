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
      error: 'La compra de puntos DTC aún no está habilitada.',
      code: 'PAYMENTS_NOT_CONFIGURED',
    },
    { status: 503 },
  )
}
