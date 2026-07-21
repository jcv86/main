import { NextResponse } from 'next/server'
import { getSharedJourneyContext } from '@/lib/journey/service'

export async function GET() {
  try {
    const context = await getSharedJourneyContext()
    if (!context) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    return NextResponse.json(context, {
      headers: { 'Cache-Control': 'private, no-store' },
    })
  } catch (error) {
    console.error('[v0] Unable to build shared journey context:', error)
    return NextResponse.json({ error: 'No se pudo cargar el contexto' }, { status: 500 })
  }
}
