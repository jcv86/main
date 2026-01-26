import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

// GET - Obtener configuración CIP actual
export async function GET(request: NextRequest) {
  try {
    // Para demo, devolver configuración por defecto
    // En producción, leer de una tabla user_settings
    const config = {
      threshold_optimal: 68,
      threshold_critical: 15,
      phase_durations: {
        a1_base: 30,
        a1_30: 60,
        a1_60: 90,
      },
      a1_base_default: 50,
      capacity_variance_max: 40, // ±40% de varianza permitida
      success_probability_multiplier: 0.85,
    }

    return NextResponse.json(config)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// POST - Actualizar configuración CIP
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar parámetros
    const { threshold_optimal, threshold_critical, a1_base_default } = body

    if (!threshold_optimal || !threshold_critical || !a1_base_default) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    if (threshold_critical >= threshold_optimal) {
      return NextResponse.json(
        { error: 'threshold_critical debe ser menor que threshold_optimal' },
        { status: 400 }
      )
    }

    // En producción, guardar en tabla user_settings
    // Por ahora, devolver configuración actualizada
    const updatedConfig = {
      threshold_optimal,
      threshold_critical,
      a1_base_default,
      phase_durations: body.phase_durations || {
        a1_base: 30,
        a1_30: 60,
        a1_60: 90,
      },
      capacity_variance_max: body.capacity_variance_max || 40,
      success_probability_multiplier: body.success_probability_multiplier || 0.85,
      updated_at: new Date().toISOString(),
    }

    return NextResponse.json(updatedConfig)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
