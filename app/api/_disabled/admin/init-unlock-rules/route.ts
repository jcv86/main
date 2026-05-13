import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    // Define all module unlock rules
    const unlockRules = [
      {
        module_id: 'auditoria-inicial',
        module_name: 'Auditoría Inicial',
        level: 1,
        sequence_order: 1,
        prerequisite_module_id: null,
        xp_required: 0
      },
      {
        module_id: 'metodo-star',
        module_name: 'Método STAR',
        level: 2,
        sequence_order: 2,
        prerequisite_module_id: 'auditoria-inicial',
        xp_required: 70
      },
      {
        module_id: 'cv-inteligente',
        module_name: 'CV Inteligente',
        level: 2,
        sequence_order: 3,
        prerequisite_module_id: 'auditoria-inicial',
        xp_required: 70
      },
      {
        module_id: 'analisis-vacante',
        module_name: 'Análisis de Vacante',
        level: 2,
        sequence_order: 4,
        prerequisite_module_id: 'auditoria-inicial',
        xp_required: 70
      },
      {
        module_id: 'analisis-multimodal',
        module_name: 'Análisis Multimodal',
        level: 2,
        sequence_order: 5,
        prerequisite_module_id: 'auditoria-inicial',
        xp_required: 70
      },
      {
        module_id: 'entrenamiento-guiado',
        module_name: 'Entrenamiento Guiado',
        level: 3,
        sequence_order: 6,
        prerequisite_module_id: 'metodo-star',
        xp_required: 140
      },
      {
        module_id: 'entrenamiento-estructurado',
        module_name: 'Entrenamiento Estructurado',
        level: 3,
        sequence_order: 7,
        prerequisite_module_id: 'entrenamiento-guiado',
        xp_required: 140
      },
      {
        module_id: 'entrenamiento-desafiante',
        module_name: 'Entrenamiento Desafiante',
        level: 3,
        sequence_order: 8,
        prerequisite_module_id: 'entrenamiento-estructurado',
        xp_required: 140
      },
      {
        module_id: 'entrenamiento-conversacional',
        module_name: 'Entrenamiento Conversacional',
        level: 3,
        sequence_order: 9,
        prerequisite_module_id: 'entrenamiento-desafiante',
        xp_required: 140
      },
      {
        module_id: 'simulacion-real',
        module_name: 'Simulación Real',
        level: 4,
        sequence_order: 10,
        prerequisite_module_id: 'entrenamiento-conversacional',
        xp_required: 280
      }
    ]
    
    // Clear existing rules
    await supabase
      .from('a3_module_unlock_rules')
      .delete()
      .gt('sequence_order', 0)
    
    // Insert new rules
    const { data, error } = await supabase
      .from('a3_module_unlock_rules')
      .insert(unlockRules)
      .select()
    
    if (error) {
      return NextResponse.json(
        { error: `Failed to insert rules: ${error.message}` },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: `Initialized ${data?.length || 0} module unlock rules`,
      rules: data
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to initialize' },
      { status: 500 }
    )
  }
}
