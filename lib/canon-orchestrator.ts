'use server'

import { createClient } from '@/lib/supabase/server'
import { CanonRulesEngine } from '@/lib/canon-rules-engine'
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
    const c2Responses: any = {
      ...request.conozcamonos2Paso1Responses,
      ...request.conozcamonos2Paso2Responses
    }
    const route = CanonRulesEngine.generateRoute(
      c2Responses,
      request.a1ProfileType,
      request.conozcamonos1Responses
    )
    console.log('[v0] Generated route from rules')

    // Paso 2: Convertir Milestones a Acciones
    console.log('[v0] Step 2: Converting milestones to actions...')
    const convertMilestoneToActions = (milestone: any, phase: 30 | 60 | 90): any[] => {
      return (milestone?.tareas_clave || []).map((tarea: string, idx: number) => ({
        id: `action-${phase}-${idx}`,
        type: 'mission' as const,
        title: tarea,
        description: milestone.objetivo_principal,
        duration: 30,
        frequency: 'weekly' as const,
        phase,
        tags: milestone.formato_recomendado ? [milestone.formato_recomendado] : [],
        trazability_source_response_ids: [],
        difficulty: milestone.intensidad === 'suave' ? 'easy' : milestone.intensidad === 'moderada' ? 'medium' : 'hard',
        success_metric: milestone.metricas?.[0] || 'Completar tarea'
      }))
    }

    const actions30 = convertMilestoneToActions(route.mision_30, 30)
    const actions60 = convertMilestoneToActions(route.mision_60, 60)
    const actions90 = convertMilestoneToActions(route.mision_90, 90)

    // Paso 3: Generar Rutas
    console.log('[v0] Step 3: Generating routes...')
    const route30Days = generateRoute30Days(
      actions30,
      request.conozcamonos2Paso1Responses
    )

    let route60Days, route90Days

    if (request.conozcamonos2Paso2Responses && Object.keys(request.conozcamonos2Paso2Responses).length > 0) {
      route60Days = generateRoute60Days(
        actions60,
        request.conozcamonos2Paso2Responses
      )
      route90Days = generateRoute90Days(
        actions90,
        {
          ...request.conozcamonos1Responses,
          ...request.conozcamonos2Paso1Responses,
          ...request.conozcamonos2Paso2Responses
        }
      )
    }

    // Paso 4: Save to database
    console.log('[v0] Step 4: Saving to database...')
    await saveRoute(request.userId, route30Days, supabase)

    if (route60Days) {
      await saveRoute(request.userId, route60Days, supabase)
    }
    if (route90Days) {
      await saveRoute(request.userId, route90Days, supabase)
    }

    // Paso 5: Save orchestration log for debugging/audit
    const { error: logError } = await supabase
      .from('canon_orchestration_logs')
      .insert({
        user_id: request.userId,
        step: 'complete',
        contradicciones: route.contradicciones_detectadas,
        factores_riesgo: route.factores_riesgo,
        factores_exito: route.factores_exito,
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
      generatedAt: new Date().toISOString(),
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
