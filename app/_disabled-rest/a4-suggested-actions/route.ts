import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const score = parseInt(searchParams.get('score') || '50')

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }

    // Get user's A1 profile to personalize suggestions
    const supabase = await createClient()
    const { data: userProfile } = await supabase
      .from('despega_cerebral_perfil')
      .select('*')
      .eq('user_id', userId)
      .single()

    // Generate actions based on score and profile
    const actions = generateSuggestedActions(score, userProfile)

    // Save suggestions to DB
    for (const action of actions) {
      await supabase.from('a4_suggested_actions').insert({
        user_id: userId,
        action_title: action.title,
        action_description: action.description,
        difficulty_level: action.difficulty,
        estimated_time_minutes: action.time,
        impact_score: action.impact,
      })
    }

    return NextResponse.json({ actions, count: actions.length })
  } catch (error) {
    console.error('[v0] Error generating suggested actions:', error)
    return NextResponse.json({ error: 'Failed to generate actions' }, { status: 500 })
  }
}

function generateSuggestedActions(score: number, userProfile: any) {
  const actions = []

  if (score < 30) {
    // Beginner: Foundation building
    actions.push(
      {
        title: 'Leer: Economía Básica para Profesionales',
        description: 'Comprende inflación, tasas e impacto en tu carrera. 15 min',
        difficulty: 'beginner',
        time: 15,
        impact: 10,
      },
      {
        title: 'Mapear tu sector en ciclo económico actual',
        description: '¿Tu industria es pro-cíclica o anti-cíclica? 20 min',
        difficulty: 'beginner',
        time: 20,
        impact: 15,
      },
      {
        title: 'Identificar 3 empleadores resilientes',
        description: 'Empresas que crecen incluso en recesión. 25 min',
        difficulty: 'beginner',
        time: 25,
        impact: 20,
      }
    )
  } else if (score < 60) {
    // Intermediate: Strategy building
    actions.push(
      {
        title: 'Analizar: Impacto inflación en tu salario real',
        description: 'Calcula poder adquisitivo en diferentes escenarios. 30 min',
        difficulty: 'intermediate',
        time: 30,
        impact: 25,
      },
      {
        title: 'Redefinir habilidades para mercado actual',
        description: '¿Qué skills son escasas según desempleo sector? 40 min',
        difficulty: 'intermediate',
        time: 40,
        impact: 30,
      },
      {
        title: 'Crear plan B: Sectores defensivos',
        description: 'Pivots posibles si tu sector se contrae. 45 min',
        difficulty: 'intermediate',
        time: 45,
        impact: 35,
      }
    )
  } else {
    // Advanced: Mastery level
    actions.push(
      {
        title: 'Ejercicio: Predicción de impacto macro en tu carrera',
        description: 'Escenarios a 12 meses. Cursos de acción por escenario. 60 min',
        difficulty: 'advanced',
        time: 60,
        impact: 50,
      },
      {
        title: 'Reposicionar: Convertir volatilidad en ventaja',
        description: 'Cómo usar incertidumbre macro para diferenciar. 75 min',
        difficulty: 'advanced',
        time: 75,
        impact: 60,
      },
      {
        title: 'Crear narrativa de transición resiliente',
        description: 'Story que funciona en cualquier contexto económico. 90 min',
        difficulty: 'advanced',
        time: 90,
        impact: 75,
      }
    )
  }

  return actions
}
