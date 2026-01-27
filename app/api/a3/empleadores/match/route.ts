import { NextRequest, NextResponse } from 'next/server'
import { getEmpleadorMatches } from '@/lib/a3-empleadores-logic'

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId requerido' },
        { status: 400 }
      )
    }

    const matches = await getEmpleadorMatches(userId)

    console.log('[v0] A3: Obteniendo matches para', userId, ':', matches.length)

    return NextResponse.json({
      success: true,
      data: matches,
      message: 'Empleadores que coinciden con tu perfil'
    })
  } catch (error) {
    console.error('[v0] A3 Error en matching:', error)
    return NextResponse.json(
      { error: 'Error al obtener empleadores' },
      { status: 500 }
    )
  }
}
