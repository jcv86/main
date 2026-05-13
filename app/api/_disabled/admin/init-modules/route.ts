import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    // Get admin secret for authorization
    const secret = request.headers.get('x-init-secret')
    const expectedSecret = process.env.ADMIN_INIT_SECRET || 'dev-secret-key'
    
    if (!secret || secret !== expectedSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('[v0] Initializing A3 module unlock rules...')
    
    // Define all 10 modules with proper XP progression
    // Each module awards 70 XP and requires progressively more XP to unlock
    const modules = [
      {
        module_id: 'auditoria-inicial',
        module_name: 'Auditoría Inicial',
        sequence_order: 1,
        prerequisite_module_id: null,
        xp_required: 0,
        xp_reward: 70,
        description: 'Preparación inicial con el coach - auditoría de entorno, presencia, audio y pitch'
      },
      {
        module_id: 'metodo-star',
        module_name: 'Método STAR',
        sequence_order: 2,
        prerequisite_module_id: 'auditoria-inicial',
        xp_required: 70,
        xp_reward: 70,
        description: 'Aprende la estructura STAR para responder preguntas de comportamiento'
      },
      {
        module_id: 'cv-inteligente',
        module_name: 'CV Inteligente',
        sequence_order: 3,
        prerequisite_module_id: 'metodo-star',
        xp_required: 140,
        xp_reward: 70,
        description: 'Optimiza tu CV para destacar en los procesos de selección'
      },
      {
        module_id: 'analisis-vacante',
        module_name: 'Análisis de Vacante',
        sequence_order: 4,
        prerequisite_module_id: 'cv-inteligente',
        xp_required: 210,
        xp_reward: 70,
        description: 'Analiza las ofertas de empleo para preparar respuestas relevantes'
      },
      {
        module_id: 'analisis-multicanal',
        module_name: 'Análisis Multicanal',
        sequence_order: 5,
        prerequisite_module_id: 'analisis-vacante',
        xp_required: 280,
        xp_reward: 70,
        description: 'Prepárate para diferentes formatos de entrevista (video, presencial, grupal)'
      },
      {
        module_id: 'entrenamiento-guiado',
        module_name: 'Entrenamiento Guiado',
        sequence_order: 6,
        prerequisite_module_id: 'analisis-multicanal',
        xp_required: 350,
        xp_reward: 70,
        description: 'Practica entrevistas con retroalimentación en tiempo real'
      },
      {
        module_id: 'entrenamiento-estructurado',
        module_name: 'Entrenamiento Estructurado',
        sequence_order: 7,
        prerequisite_module_id: 'entrenamiento-guiado',
        xp_required: 420,
        xp_reward: 70,
        description: 'Completa una serie de entrevistas estructuradas progresivas'
      },
      {
        module_id: 'entrenamiento-desafiante',
        module_name: 'Entrenamiento Desafiante',
        sequence_order: 8,
        prerequisite_module_id: 'entrenamiento-estructurado',
        xp_required: 490,
        xp_reward: 70,
        description: 'Enfrenta preguntas difíciles y situaciones de presión'
      },
      {
        module_id: 'entrenamiento-conversacional',
        module_name: 'Entrenamiento Conversacional',
        sequence_order: 9,
        prerequisite_module_id: 'entrenamiento-desafiante',
        xp_required: 560,
        xp_reward: 70,
        description: 'Práctica conversacional natural y fluida'
      },
      {
        module_id: 'simulacion-real',
        module_name: 'Simulación Real',
        sequence_order: 10,
        prerequisite_module_id: 'entrenamiento-conversacional',
        xp_required: 630,
        xp_reward: 70,
        description: 'Simulación completa de entrevista real con evaluación final'
      }
    ]

    // First, delete existing rules to ensure clean state
    const { error: deleteError } = await supabase
      .from('a3_module_unlock_rules')
      .delete()
      .neq('module_id', '')
    
    if (deleteError && deleteError.code !== 'PGRST116') {
      console.error('[v0] Error deleting existing rules:', deleteError)
    }

    // Insert all modules
    const { data, error } = await supabase
      .from('a3_module_unlock_rules')
      .insert(modules)
      .select()

    if (error) {
      console.error('[v0] Error inserting modules:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('[v0] Successfully initialized', data?.length || modules.length, 'modules')

    return NextResponse.json({
      success: true,
      message: `Initialized ${data?.length || modules.length} A3 modules`,
      modules: data || modules
    })
  } catch (error) {
    console.error('[v0] Initialization error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Initialization failed' },
      { status: 500 }
    )
  }
}
