import { createClient } from '@/lib/supabase/server'

/**
 * Seed script to insert sample gamification data for A3 training progress
 * Run with: npx ts-node scripts/seed-a3-gamification.ts
 */

async function seedGamificationData() {
  try {
    const supabase = await createClient()

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error('No user authenticated. Please log in first.')
      return
    }

    const userId = user.id
    console.log(`Seeding gamification data for user: ${userId}`)

    // 1. Create or update user progress record
    const { error: progressError } = await supabase.from('a3_user_progreso').upsert(
      {
        user_id: userId,
        entrevistas_completadas: 8,
        score_promedio: 82,
        fase: 'intermediate',
        competencias_desarrolladas: [
          'comunicación',
          'confianza',
          'resolución de problemas',
          'pensamiento estratégico',
        ],
        empleadores_interesados: 3,
        logros: [
          '🥈 5 Entrenamientos Completados',
          '⏱️ 5 Horas de Entrenamiento',
          '⭐ 3 Entrevistas con Score > 85',
        ],
        recomendaciones: [
          'Enfócate en mejorar tu comunicación verbal',
          'Practica más respuestas estructuradas',
          'Trabaja en tu confianza durante entrevistas en vídeo',
        ],
      },
      { onConflict: 'user_id' }
    )

    if (progressError) {
      console.error('Error updating progress:', progressError)
    } else {
      console.log('✓ Progress record created/updated')
    }

    // 2. Insert sample interview sessions (with realistic times and scores)
    const interviewSessions = [
      { time: 45, score: 78, date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, // 7 days ago
      { time: 52, score: 81, date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) },
      { time: 60, score: 85, date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
      { time: 48, score: 79, date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
      { time: 55, score: 88, date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
      { time: 50, score: 82, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
      { time: 60, score: 91, date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
      { time: 45, score: 84, date: new Date() }, // Today
    ]

    for (const session of interviewSessions) {
      const { error } = await supabase.from('a3_user_entrevistas').insert({
        user_id: userId,
        entrevista_id: '550e8400-e29b-41d4-a716-446655440000', // Dummy ID
        tiempo_real_minutos: session.time,
        score_total: session.score,
        feedback_ia: {
          strengths: ['Buena estructuración', 'Excelente comunicación'],
          improvements: ['Más ejemplos específicos'],
        },
        respuestas: {},
        created_at: session.date.toISOString(),
      })

      if (error) {
        console.error('Error inserting interview session:', error)
      }
    }

    console.log('✓ Interview sessions inserted')

    // 3. Insert training assignments completions
    const trainingModules = [
      { title: 'Método STAR Básico', minutes: 45 },
      { title: 'CV Inteligente', minutes: 40 },
      { title: 'Análisis de Vacancias', minutes: 50 },
      { title: 'Video Práctica 1', minutes: 35 },
      { title: 'Video Práctica 2', minutes: 55 },
    ]

    for (let i = 0; i < trainingModules.length; i++) {
      const module = trainingModules[i]
      const { error } = await supabase.from('a3_training_assignments').insert({
        user_id: userId,
        training_module_id: `training-${i}`,
        route_id: 'route-a3-entrenamiento',
        assigned_at: new Date(Date.now() - (10 - i) * 24 * 60 * 60 * 1000).toISOString(),
        started_at: new Date(Date.now() - (10 - i) * 24 * 60 * 60 * 1000).toISOString(),
        completed_at: new Date(Date.now() - (8 - i) * 24 * 60 * 60 * 1000).toISOString(),
        relevance_score: 85 + Math.random() * 15,
        reason: 'Recomendado por tu perfil',
      })

      if (error) {
        console.error('Error inserting training assignment:', error)
      }
    }

    console.log('✓ Training assignments inserted')

    // 4. Insert module progress (for A4 Gamification)
    const modules = [
      { title: 'Módulo 1: Preparación Básica', time: 180 },
      { title: 'Módulo 2: Técnicas Avanzadas', time: 240 },
      { title: 'Módulo 3: Simulaciones', time: 120 },
    ]

    for (let i = 0; i < modules.length; i++) {
      const module = modules[i]
      const { error } = await supabase.from('a4_module_progress').insert({
        user_id: userId,
        module_id: `mod-${i}`,
        modulo_titulo: module.title,
        tiempo_dedicado_minutos: module.time,
        completado: i < 2, // First 2 modules completed
        progreso_porcentaje: i === 0 ? 100 : i === 1 ? 100 : 65,
        completado_at: i < 2 ? new Date().toISOString() : null,
        created_at: new Date().toISOString(),
      })

      if (error) {
        console.error('Error inserting module progress:', error)
      }
    }

    console.log('✓ Module progress inserted')

    // 5. Create user gamification profile
    const { error: gamError } = await supabase
      .from('user_gamification_profile')
      .upsert(
        {
          user_id: userId,
          current_level: 3,
          current_xp: 1850,
          total_xp: 2850,
          interview_streak: 5,
          best_interview_streak: 8,
          total_interviews_completed: 8,
          total_tips_earned_free: 12,
          total_tips_earned_premium: 5,
          badges: [
            '🥈 5 Entrenamientos',
            '⏱️ 5 Horas',
            '⭐ Experto (3+ scores > 90)',
          ],
          achievements: [
            {
              name: '5 Entrenamientos',
              earned_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            },
            {
              name: '5 Horas Totales',
              earned_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            },
          ],
        },
        { onConflict: 'user_id' }
      )

    if (gamError) {
      console.error('Error updating gamification profile:', gamError)
    } else {
      console.log('✓ Gamification profile created/updated')
    }

    console.log('\n✅ Gamification data seeded successfully!')
    console.log(`   - 8 interview sessions with varied scores`)
    console.log(`   - 5 training modules completed`)
    console.log(`   - 3 modules in progress`)
    console.log(`   - Level 3 profile with achievements`)
  } catch (error) {
    console.error('Fatal error during seeding:', error)
    process.exit(1)
  }
}

seedGamificationData()
