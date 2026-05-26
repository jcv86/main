/**
 * Dev Mode System for DTC AgentOS
 * 
 * Allows inspection, seeding demo data, and simulation without affecting production
 */

import { createClient } from '@/lib/supabase/server'
import type { DTCContext } from '../types'

export interface DevModeResponse {
  status: 'missing_context' | 'seeded' | 'inspected' | 'simulated'
  missing?: string[]
  availableActions?: {
    action: string
    description: string
    blocks?: string[]
    warning?: string
  }[]
  data?: any
}

export const DEV_MODE_BEHAVIORS = {
  inspect: {
    description: 'View any screen without executing logic',
    actions: ['view_screen', 'show_missing_context'],
    fakeData: false,
  },
  seed: {
    description: 'Generate consistent demo data',
    actions: [
      'generate_c1',
      'generate_a1',
      'generate_c2',
      'generate_a2_days',
      'generate_a3_progress',
      'generate_a4_documents',
    ],
    fakeData: true,
    seedProfile: 'travis',
  },
  simulate: {
    description: 'Simulate real user with all rules enforced',
    actions: ['respect_unlocks', 'respect_days', 'respect_dependencies'],
    fakeData: false,
  },
} as const

export type DevModeBehavior = keyof typeof DEV_MODE_BEHAVIORS

/**
 * Handle missing context in dev mode
 */
export async function handleMissingContext(
  userId: string,
  command: string,
  missing: string[]
): Promise<DevModeResponse> {
  return {
    status: 'missing_context',
    missing,
    availableActions: [
      {
        action: 'generate_dev_seed',
        description: 'Create demo data for missing blocks',
      },
      {
        action: 'complete_missing_block',
        description: 'Complete the required blocks manually',
        blocks: missing,
      },
      {
        action: 'run_with_limited_context',
        description: 'Run command with available context only',
        warning: 'Results may be incomplete or inaccurate',
      },
    ],
  }
}

/**
 * Seed demo data for a user (Travis profile)
 */
export async function seedDemoData(
  userId: string,
  options: {
    includeC1?: boolean
    includeA1?: boolean
    includeC2?: boolean
    includeA2Days?: boolean
    includeA3Progress?: boolean
    includeA4Documents?: boolean
  } = {}
): Promise<DevModeResponse> {
  const supabase = await createClient()
  const seededData: Record<string, any> = {}

  // Default to seeding everything
  const {
    includeC1 = true,
    includeA1 = true,
    includeC2 = true,
    includeA2Days = true,
    includeA3Progress = true,
    includeA4Documents = true,
  } = options

  // Travis Demo Profile
  const travisProfile = {
    name: 'Travis Demo',
    email: 'travis@demo.dtc.com',
    careerGoal: 'General Manager en empresa tech de rápido crecimiento',
    currentRole: 'Director de Operaciones',
    yearsExperience: 12,
    targetIndustry: 'Technology / SaaS',
    motivation: 'Quiero liderar una empresa completa, no solo un área',
  }

  try {
    // Seed C1 data
    if (includeC1) {
      const c1Data = {
        user_id: userId,
        nombre_completo: travisProfile.name,
        situacion_laboral: 'Empleado buscando cambio',
        horas_semanales: '10-15 horas',
        estilo_aprendizaje: 'Visual y práctico',
        objetivo_carrera: travisProfile.careerGoal,
        motivacion_principal: travisProfile.motivation,
        created_at: new Date().toISOString(),
      }

      const { error: c1Error } = await supabase
        .from('canon_conozcamonos_1_responses')
        .upsert(c1Data, { onConflict: 'user_id' })

      if (!c1Error) {
        seededData.c1 = c1Data

        // Also create memory items for C1
        await supabase.from('memory_items').insert([
          {
            user_id: userId,
            source_type: 'c1',
            memory_type: 'career_goal',
            content: travisProfile.careerGoal,
            confidence: 0.9,
            importance: 1.0,
          },
          {
            user_id: userId,
            source_type: 'c1',
            memory_type: 'motivation',
            content: travisProfile.motivation,
            confidence: 0.9,
            importance: 0.8,
          },
        ])
      }
    }

    // Seed A1 data
    if (includeA1) {
      const a1Data = {
        user_id: userId,
        disc_profile: {
          dominant: 'D',
          scores: { D: 85, I: 60, S: 40, C: 55 },
          description: 'Perfil Dominante - Orientado a resultados',
        },
        strengths: [
          'Liderazgo estratégico',
          'Toma de decisiones bajo presión',
          'Comunicación ejecutiva',
        ],
        weaknesses: [
          'Delegación efectiva',
          'Paciencia con procesos largos',
          'Documentación de procesos',
        ],
        communication_style: 'Directo, conciso, orientado a resultados',
        created_at: new Date().toISOString(),
      }

      const { error: a1Error } = await supabase
        .from('a1_profile_insights')
        .upsert(a1Data, { onConflict: 'user_id' })

      if (!a1Error) {
        seededData.a1 = a1Data

        // Create memory items for A1
        await supabase.from('memory_items').insert([
          {
            user_id: userId,
            source_type: 'a1',
            memory_type: 'strength',
            content: 'Liderazgo estratégico',
            confidence: 0.85,
            importance: 0.9,
          },
          {
            user_id: userId,
            source_type: 'a1',
            memory_type: 'strength',
            content: 'Toma de decisiones bajo presión',
            confidence: 0.85,
            importance: 0.85,
          },
          {
            user_id: userId,
            source_type: 'a1',
            memory_type: 'weakness',
            content: 'Delegación efectiva',
            confidence: 0.8,
            importance: 0.9,
          },
          {
            user_id: userId,
            source_type: 'a1',
            memory_type: 'weakness',
            content: 'Documentación de procesos',
            confidence: 0.75,
            importance: 0.7,
          },
          {
            user_id: userId,
            source_type: 'a1',
            memory_type: 'communication_style',
            content: 'Directo, conciso, orientado a resultados',
            confidence: 0.9,
            importance: 0.8,
          },
        ])
      }
    }

    // Seed C2 data
    if (includeC2) {
      const c2Data = {
        user_id: userId,
        confirmed_goal: travisProfile.careerGoal,
        target_role: 'General Manager / Country Manager',
        target_industry: travisProfile.targetIndustry,
        target_region: 'LATAM',
        salary_expectation: '$180,000 - $250,000 USD',
        timeline: '6-12 meses',
        created_at: new Date().toISOString(),
      }

      const { error: c2Error } = await supabase
        .from('canon_conozcamonos_2_responses')
        .upsert(c2Data, { onConflict: 'user_id' })

      if (!c2Error) {
        seededData.c2 = c2Data

        // Create memory for C2
        await supabase.from('memory_items').insert([
          {
            user_id: userId,
            source_type: 'c2',
            memory_type: 'target_role',
            content: 'General Manager / Country Manager',
            confidence: 0.95,
            importance: 1.0,
          },
          {
            user_id: userId,
            source_type: 'c2',
            memory_type: 'market_region',
            content: 'LATAM - Technology / SaaS',
            confidence: 0.9,
            importance: 0.85,
          },
        ])
      }
    }

    // Seed A2 days
    if (includeA2Days) {
      const daysToSeed = [
        { day: 1, title: 'Día 1: Definición de Identidad', completed: true },
        { day: 2, title: 'Día 2: Análisis FODA Personal', completed: true },
        { day: 3, title: 'Día 3: Primeros Logros STAR', completed: true },
        { day: 4, title: 'Día 4: CV Borrador Inicial', completed: false },
        { day: 5, title: 'Día 5: Práctica de Presentación', completed: false },
      ]

      for (const day of daysToSeed) {
        await supabase.from('dtc_days').upsert(
          {
            user_id: userId,
            day_number: day.day,
            title: day.title,
            status: day.completed ? 'completed' : 'pending',
            completed_at: day.completed ? new Date().toISOString() : null,
          },
          { onConflict: 'user_id,day_number' }
        )
      }

      seededData.a2Days = daysToSeed
    }

    // Seed A3 progress
    if (includeA3Progress) {
      const modulesToSeed = [
        { moduleId: 'auditoria-inicial', status: 'completed', score: 85 },
        { moduleId: 'metodo-star', status: 'completed', score: 78 },
        { moduleId: 'cv-inteligente', status: 'in_progress', score: null },
      ]

      for (const mod of modulesToSeed) {
        await supabase.from('a3_session_attempts').upsert(
          {
            user_id: userId,
            module_id: mod.moduleId,
            status: mod.status,
            score: mod.score,
            created_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,module_id' }
        )
      }

      seededData.a3Progress = modulesToSeed
    }

    // Seed A4 documents
    if (includeA4Documents) {
      const documentsToSeed = [
        {
          title: 'CV Borrador v1',
          type: 'cv_draft',
          content: 'Contenido del CV borrador...',
          status: 'draft',
        },
        {
          title: 'Historia STAR: Liderazgo de Crisis',
          type: 'star_answer',
          content:
            'Situación: Durante la pandemia, nuestro equipo enfrentó...',
          status: 'completed',
        },
      ]

      for (const doc of documentsToSeed) {
        await supabase.from('dtc_documents').upsert(
          {
            user_id: userId,
            title: doc.title,
            document_type: doc.type,
            content: doc.content,
            status: doc.status,
            created_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,title' }
        )
      }

      seededData.a4Documents = documentsToSeed
    }

    return {
      status: 'seeded',
      data: seededData,
    }
  } catch (error) {
    console.error('[v0] Error seeding demo data:', error)
    return {
      status: 'missing_context',
      missing: ['seed_failed'],
      data: { error: String(error) },
    }
  }
}

/**
 * Inspect current state for a user
 */
export async function inspectUserState(userId: string): Promise<{
  c1Complete: boolean
  a1Complete: boolean
  c2Complete: boolean
  a2DaysCompleted: number
  a3ModulesCompleted: number
  a4DocumentsCreated: number
  memoryItemsCount: number
  missingBlocks: string[]
}> {
  const supabase = await createClient()

  // Check each block
  const [c1Result, a1Result, c2Result, daysResult, modulesResult, docsResult, memoryResult] =
    await Promise.all([
      supabase
        .from('canon_conozcamonos_1_responses')
        .select('id')
        .eq('user_id', userId)
        .single(),
      supabase.from('a1_profile_insights').select('id').eq('user_id', userId).single(),
      supabase
        .from('canon_conozcamonos_2_responses')
        .select('id')
        .eq('user_id', userId)
        .single(),
      supabase
        .from('dtc_days')
        .select('id')
        .eq('user_id', userId)
        .eq('status', 'completed'),
      supabase
        .from('a3_session_attempts')
        .select('id')
        .eq('user_id', userId)
        .eq('status', 'completed'),
      supabase.from('dtc_documents').select('id').eq('user_id', userId),
      supabase.from('memory_items').select('id').eq('user_id', userId),
    ])

  const c1Complete = !!c1Result.data
  const a1Complete = !!a1Result.data
  const c2Complete = !!c2Result.data
  const a2DaysCompleted = daysResult.data?.length || 0
  const a3ModulesCompleted = modulesResult.data?.length || 0
  const a4DocumentsCreated = docsResult.data?.length || 0
  const memoryItemsCount = memoryResult.data?.length || 0

  const missingBlocks: string[] = []
  if (!c1Complete) missingBlocks.push('c1')
  if (!a1Complete) missingBlocks.push('a1')
  if (!c2Complete) missingBlocks.push('c2')
  if (a2DaysCompleted === 0) missingBlocks.push('a2')
  if (a3ModulesCompleted === 0) missingBlocks.push('a3')
  if (a4DocumentsCreated === 0) missingBlocks.push('a4')

  return {
    c1Complete,
    a1Complete,
    c2Complete,
    a2DaysCompleted,
    a3ModulesCompleted,
    a4DocumentsCreated,
    memoryItemsCount,
    missingBlocks,
  }
}

/**
 * Check if user is in dev mode
 */
export async function isDevModeUser(userId: string): Promise<boolean> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('despega_user_profiles')
    .select('is_demo, email')
    .eq('user_id', userId)
    .single()

  if (!data) return false

  // Check if demo user or specific dev emails
  return (
    data.is_demo === true ||
    data.email?.includes('@demo.') ||
    data.email?.includes('travis@')
  )
}

export default {
  DEV_MODE_BEHAVIORS,
  handleMissingContext,
  seedDemoData,
  inspectUserState,
  isDevModeUser,
}
