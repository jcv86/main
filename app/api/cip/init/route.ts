import { NextRequest, NextResponse } from 'next/server'
import {
  initializeUserCapacity,
  calculateEffectiveCapacity,
  calculateSuccessProbability,
  checkCapacityThresholds,
  advancePhaseIfNeeded,
  logTaskSession,
  getUserCapacityStatus,
} from '@/lib/cip-capacity-logic'

// POST /api/cip/init
// Inicializar capacidad de un nuevo usuario (Cold Start)
export async function POST(request: NextRequest) {
  try {
    const { userId, a1Base } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'userId requerido' }, { status: 400 })
    }

    console.log('[v0] CIP API: Inicializando usuario', userId)

    const profile = await initializeUserCapacity(userId, a1Base || 100)

    return NextResponse.json({
      success: true,
      data: profile,
      message: 'Usuario inicializado exitosamente en CIP',
    })
  } catch (error) {
    console.error('[v0] CIP API Error en init:', error)
    return NextResponse.json(
      { error: 'Error al inicializar usuario' },
      { status: 500 }
    )
  }
}
