import { NextRequest, NextResponse } from 'next/server'
import { guardarRespuestasEntrevista } from '@/lib/a3-entrevista-logic'

export async function POST(request: NextRequest) {
  try {
    const { userId, entrevistaId, respuestas } = await request.json()

    if (!userId || !entrevistaId || !respuestas) {
      return NextResponse.json(
        { error: 'Datos requeridos faltantes' },
        { status: 400 }
      )
    }

    const resultado = await guardarRespuestasEntrevista(userId, entrevistaId, respuestas)

    console.log('[v0] A3: Entrevista guardada:', resultado.id)

    return NextResponse.json({
      success: true,
      data: resultado,
      message: 'Entrevista guardada exitosamente'
    })
  } catch (error) {
    console.error('[v0] A3 Error al guardar entrevista:', error)
    return NextResponse.json(
      { error: 'Error al guardar la entrevista' },
      { status: 500 }
    )
  }
}
