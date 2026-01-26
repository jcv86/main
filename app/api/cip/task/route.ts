import { NextRequest, NextResponse } from 'next/server'
import { logTaskSession } from '@/lib/cip-capacity-logic'

// POST /api/cip/task
// Registrar una tarea completada
export async function POST(request: NextRequest) {
  try {
    const { userId, task } = await request.json()

    if (!userId || !task) {
      return NextResponse.json(
        { error: 'userId y task son requeridos' },
        { status: 400 }
      )
    }

    console.log('[v0] CIP API: Registrando tarea para', userId)

    const session = await logTaskSession(userId, task)

    return NextResponse.json({
      success: true,
      data: session,
      message: `Tarea "${task.title}" registrada exitosamente`,
    })
  } catch (error) {
    console.error('[v0] CIP API Error en task:', error)
    return NextResponse.json(
      { error: 'Error al registrar tarea' },
      { status: 500 }
    )
  }
}
