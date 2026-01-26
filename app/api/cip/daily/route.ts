import { NextRequest, NextResponse } from 'next/server'
import {
  calculateEffectiveCapacity,
  calculateSuccessProbability,
  checkCapacityThresholds,
  advancePhaseIfNeeded,
  getUserCapacityStatus,
} from '@/lib/cip-capacity-logic'

// POST /api/cip/daily
// Calcular capacidad diaria y probabilidad de éxito
export async function POST(request: NextRequest) {
  try {
    const { userId, factors, taskContext } = await request.json()

    if (!userId || !factors || !taskContext) {
      return NextResponse.json(
        { error: 'userId, factors y taskContext son requeridos' },
        { status: 400 }
      )
    }

    console.log('[v0] CIP API: Calculando capacidad diaria para', userId)

    // Calcular capacidad efectiva
    const effectiveCapacity = await calculateEffectiveCapacity(userId, factors)

    // Calcular probabilidad de éxito
    const successProbability = await calculateSuccessProbability(
      userId,
      effectiveCapacity,
      taskContext
    )

    // Verificar umbrales y generar alertas
    const alerts = await checkCapacityThresholds(
      userId,
      successProbability,
      effectiveCapacity
    )

    // Verificar si debe avanzar de fase
    const updatedProfile = await advancePhaseIfNeeded(userId)

    // Obtener estado completo
    const status = await getUserCapacityStatus(userId)

    return NextResponse.json({
      success: true,
      data: {
        effectiveCapacity,
        successProbability,
        alerts,
        profile: updatedProfile,
        status,
      },
      message: `Capacidad: ${effectiveCapacity.toFixed(2)}% | Éxito: ${successProbability}%`,
    })
  } catch (error) {
    console.error('[v0] CIP API Error en daily:', error)
    return NextResponse.json(
      { error: 'Error al calcular capacidad diaria' },
      { status: 500 }
    )
  }
}

// GET /api/cip/daily
// Obtener estado de capacidad actual
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId requerido' }, { status: 400 })
    }

    console.log('[v0] CIP API: Obteniendo estado para', userId)

    const status = await getUserCapacityStatus(userId)

    return NextResponse.json({
      success: true,
      data: status,
    })
  } catch (error) {
    console.error('[v0] CIP API Error en GET daily:', error)
    return NextResponse.json(
      { error: 'Error al obtener estado' },
      { status: 500 }
    )
  }
}
