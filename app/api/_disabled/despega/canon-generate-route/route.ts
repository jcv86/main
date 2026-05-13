import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { CanonRulesEngine } from '@/lib/canon-rules-engine'
import { generateRoute30Days } from '@/lib/canon-routes-generator'

// NIVEL 4: Validación y Sanitización
const sanitizeText = (text: string, maxLength: number = 200): string => {
  if (!text) return ''
  // Remove URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g
  let sanitized = text.replace(urlRegex, '')
  // Remove insultos/spam patterns
  const spamPatterns = /[!]{3,}|[*]{3,}|viagra|casino|poker|xxx/gi
  sanitized = sanitized.replace(spamPatterns, '')
  // Trim and limit length
  return sanitized.trim().slice(0, maxLength)
}

const validateResponses = (responses: any): { valid: boolean; errors: string[]; adjusted: any } => {
  const errors: string[] = []
  const adjusted = { ...responses }

  // Check for contradictions
  if (adjusted.tiempo_disponible_diario_minutos && adjusted.no_disponibilidad_periodos) {
    if (adjusted.tiempo_disponible_diario_minutos < 15 && adjusted.no_disponibilidad_periodos.includes('mañana')) {
      errors.push('Contradicción: no disponible en mañana pero solo 15 min diarios')
      adjusted.no_disponibilidad_periodos = adjusted.no_disponibilidad_periodos.filter((p: string) => p !== 'mañana')
    }
  }

  // Validate energy-session duration compatibility
  if (adjusted.energia_nivel && adjusted.session_duration) {
    if (adjusted.energia_nivel <= 3 && adjusted.session_duration > 45) {
      errors.push('Ajuste: energía baja pero sesiones largas, reduciendo a sesiones cortas')
      adjusted.session_duration = 15
    }
  }

  // Validate objectives viability
  if (adjusted.meta_30_dias && adjusted.tiempo_disponible_diario_minutos) {
    const tiempoTotal = adjusted.tiempo_disponible_diario_minutos * 30
    if (tiempoTotal < 300 && adjusted.meta_30_dias === 'cambio-carrera') {
      errors.push('Ajuste: objetivo de cambio de carrera requiere mínimo 300 min/mes, reduciendo a meta de especialización')
      adjusted.meta_30_dias = 'especializacion'
    }
  }

  // Sanitize text fields
  if (adjusted.contexto_vida) {
    adjusted.contexto_vida = sanitizeText(adjusted.contexto_vida, 200)
  }
  if (adjusted.metrica_exito) {
    adjusted.metrica_exito = sanitizeText(adjusted.metrica_exito, 150)
  }

  return { valid: errors.length === 0, errors, adjusted }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id } = body

    if (!user_id) {
      return NextResponse.json({ error: 'user_id required' }, { status: 400 })
    }

    const supabase = await createClient()

    // 1. Get C1 responses (if any)
    const { data: c1Responses } = await supabase
      .from('canon_conozcamonos_1_responses')
      .select('responses')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    // 2. Get C2-Paso1 responses
    const { data: c2Paso1Responses, error: c2Error } = await supabase
      .from('canon_conozcamonos_2_responses')
      .select('*')
      .eq('user_id', user_id)
      .eq('paso', 1)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (c2Error || !c2Paso1Responses) {
      console.error('[v0] Error fetching C2 responses:', c2Error)
      return NextResponse.json({ error: 'C2 responses not found' }, { status: 404 })
    }

    // 3. Get C2-Paso2 responses (if any)
    const { data: c2Paso2Responses } = await supabase
      .from('canon_conozcamonos_2_responses')
      .select('responses')
      .eq('user_id', user_id)
      .eq('paso', 2)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    // 4. Get DISC profile
    const { data: a1Results } = await supabase
      .from('a1_tests_results')
      .select('result')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    const profileType = a1Results?.result?.dominantProfile || 'D'

    // NIVEL 4: Validate and adjust C2-Paso1 responses
    const { valid, errors, adjusted } = validateResponses(c2Paso1Responses.responses || {})
    if (errors.length > 0) {
      console.log('[v0] Nivel 4 validations found issues:', errors)
    }

    // 2. Execute rules to get actions using static method
    const generatedRoute = CanonRulesEngine.generateRoute(
      c2Paso1Responses.responses || {},
      profileType,
      c1Responses?.responses || {}
    )
    console.log('[v0] Executed rules, got generated route:', generatedRoute)

    // 3. Store the generated route and related data
    const route30 = generatedRoute

    // 4. Check if route already exists for this user+cycle
    const { data: existingRoute } = await supabase
      .from('canon_generated_routes')
      .select('id')
      .eq('user_id', user_id)
      .eq('phase', 30)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    let routeId: string

    if (existingRoute) {
      // Update existing route
      const { data: updated, error: updateError } = await supabase
        .from('canon_generated_routes')
        .update({
          route_data: route30,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingRoute.id)
        .select('id')
        .single()

      if (updateError) {
        console.error('[v0] Error updating route:', updateError)
        return NextResponse.json({ error: 'Failed to update route' }, { status: 500 })
      }

      routeId = updated.id
    } else {
      // Insert new route
      const { data: inserted, error: insertError } = await supabase
        .from('canon_generated_routes')
        .insert({
          user_id,
          phase: 30,
          route_data: route30,
          created_at: new Date().toISOString(),
        })
        .select('id')
        .single()

      if (insertError) {
        console.error('[v0] Error inserting route:', insertError)
        return NextResponse.json({ error: 'Failed to insert route' }, { status: 500 })
      }

      routeId = inserted.id
    }

    // 5. Create trazability entries for the key tasks from milestones
    const allTareas = [
      ...(route30.mision_30?.tareas_clave || []),
      ...(route30.mision_60?.tareas_clave || []),
      ...(route30.mision_90?.tareas_clave || [])
    ]

    const trazabilityEntries = allTareas.map((tarea: string, index: number) => ({
      user_id,
      route_id: routeId,
      action_id: `tarea_${index}`,
      action_title: tarea,
      source_response_ids: [],
      source_response_text: JSON.stringify({ milestone_task: tarea }),
      created_at: new Date().toISOString(),
    }))

    if (trazabilityEntries.length > 0) {
      const { error: trazError } = await supabase
        .from('canon_user_journey_trazability')
        .insert(trazabilityEntries)

      if (trazError) {
        console.error('[v0] Error inserting trazability:', trazError)
        // Don't fail on trazability error - route is already saved
      }
    }

    console.log('[v0] Route generated successfully for user', user_id)

    return NextResponse.json({
      success: true,
      route_id: routeId,
      actions_count: allTareas.length,
      route: route30,
    })
  } catch (error) {
    console.error('[v0] Error in canon-generate-route:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
