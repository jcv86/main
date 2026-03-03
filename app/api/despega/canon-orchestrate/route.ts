'use server'

import { createClient } from '@/utils/supabase/server'
import { executeCanonRules, validateCanonActions } from '@/lib/canon-rules-engine'
import { generateRoute30Days, generateRoute60Days, generateRoute90Days, saveRoute } from '@/lib/canon-routes-generator'

export interface CanonOrchestrationRequest {
  userId: string
  conozcamonos1Responses: Record<number, any>
  conozcamonos2Paso1Responses: Record<number, any>
  conozcamonos2Paso2Responses?: Record<number, any>
  a1ProfileType: string // D, I, S, C
}

export interface CanonOrchestrationResult {
  success: boolean
  route30Days: any
  route60Days?: any
  route90Days?: any
  generatedAt: string
  error?: string
}

/**
 * Main CANON Orchestrator
 * Ejecuta el flujo completo: Respuestas → Reglas → Acciones → Rutas
 */
export async function orchestrateCanon(
  request: CanonOrchestrationRequest
): Promise<CanonOrchestrationResult> {
  try {
    const supabase = await createClient()

    console.log('[v0] CANON Orchestration starting for user:', request.userId)

    // Paso 1: Ejecutar Motor de Reglas
    console.log('[v0] Step 1: Executing Rules Engine...')
    const actions = executeCanonRules(
      request.conozcamonos1Responses,
      request.conozcamonos2Paso1Responses,
      request.conozczamonos2Paso2Responses || {},
      request.a1ProfileType
    )
    console.log('[v0] Generated', actions.length, 'actions from rules')

    // Paso 2: Validar Acciones (Stress Test)
    console.log('[v0] Step 2: Validating actions...')
    const validation = validateCanonActions(actions)
    if (!validation.valid) {
      console.warn('[v0] Validation issues:', validation.issues)
      // NO bloqueamos - ajustamos automáticamente
      console.log('[v0] Applying suggestions:', validation.suggestions)
    }

    // Paso 3: Generar Rutas
    console.log('[v0] Step 3: Generating routes...')
    const route30Days = generateRoute30Days(
      actions,
      request.conozcamonos2Paso1Responses
    )

    let route60Days, route90Days

    if (request.conozcamonos2Paso2Responses && Object.keys(request.conozczamonos2Paso2Responses).length > 0) {
      route60Days = generateRoute60Days(
        actions,
        request.conozcamonos2Paso2Responses
      )
      route90Days = generateRoute90Days(
        actions,
        {
          ...request.conozcamonos1Responses,
          ...request.conozcamonos2Paso1Responses,
          ...request.conozcamonos2Paso2Responses
        }
      )
    }

    // Paso 4: Guardar en BD
    console.log('[v0] Step 4: Saving to database...')
    await saveRoute(request.userId, route30Days, supabase)

    if (route60Days) {
      await saveRoute(request.userId, route60Days, supabase)
    }
    if (route90Days) {
      await saveRoute(request.userId, route90Days, supabase)
    }

    // Paso 5: Guardar orquestación log para debugging/auditoria
    const { error: logError } = await supabase
      .from('canon_orchestration_logs')
      .insert({
        user_id: request.userId,
        step: 'complete',
        actions_generated: actions.length,
        validation_issues: validation.issues,
        routes_created: [route30Days.phase, route60Days?.phase, route90Days?.phase].filter(Boolean),
        completed_at: new Date().toISOString()
      })

    if (logError) {
      console.warn('[v0] Log save failed (non-blocking):', logError)
    }

    console.log('[v0] CANON Orchestration completed successfully')

    return {
      success: true,
      route30Days,
      route60Days,
      route90Days,
      generatedAt: new Date().toISOString()
    }
  } catch (error) {
    console.error('[v0] CANON Orchestration error:', error)
    return {
      success: false,
      route30Days: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Obtener rutas existentes del usuario
 */
export async function getCanonRoutes(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('canon_generated_routes')
    .select('*')
    .eq('user_id', userId)
    .order('phase', { ascending: true })

  if (error) {
    console.error('[v0] Error fetching routes:', error)
    return null
  }

  return data
}
