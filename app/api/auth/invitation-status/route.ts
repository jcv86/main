import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json(
    {
      error: 'Este flujo de invitaciones fue retirado',
      code: 'LEGACY_INVITATION_FLOW_RETIRED',
    },
    { status: 410, headers: { 'Cache-Control': 'no-store' } },
  )
}
