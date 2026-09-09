import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store, max-age=0',
  'CDN-Cache-Control': 'no-store',
}

export async function GET() {
  try {
    const supabase = createAdminClient()
    const { error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)

    if (error) throw new Error('DEPENDENCY_UNAVAILABLE')

    return NextResponse.json(
      { status: 'ready' },
      { status: 200, headers: NO_STORE_HEADERS },
    )
  } catch {
    return NextResponse.json(
      { status: 'unavailable' },
      { status: 503, headers: NO_STORE_HEADERS },
    )
  }
}
