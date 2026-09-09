import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store, max-age=0',
  'CDN-Cache-Control': 'no-store',
}

export async function GET() {
  return NextResponse.json(
    { status: 'ok' },
    { status: 200, headers: NO_STORE_HEADERS },
  )
}
