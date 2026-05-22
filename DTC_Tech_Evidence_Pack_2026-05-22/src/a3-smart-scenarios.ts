import { createClient } from '@/lib/supabase-server'

interface SmartTrainingScenario {
  id: string
  title: string
  description: string
  context_from_a4: string
  skills_to_practice: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration_minutes: number
  related_job_profile: string
}

export async function generateSmartTrainingScenarios(
  userId: string,
  a2Mission: string,
  a2Goals: string[],
  a4Context: {
    marketTrends: string[]
    jobProfiles: string[]
    requiredSkills: string[]
  }
): Promise<SmartTrainingScenario[]> {
  const scenarios: SmartTrainingScenario[] = []

  // Scenario 1: Market Trend Interview
  scenarios.push({
    id: `scenario_market_${userId}`,
    title: 'Entrevista sobre Tendencias del Mercado',
    description: `El entrevistador te pregunta sobre tendencias en tu industria objetivo. Debes conectar tu plan (${a2Mission.substring(0, 50)}...) con oportunidades reales del mercado.`,
    context_from_a4: a4Context.marketTrends[0] || 'Transformación digital en tu industria',
    skills_to_practice: ['strategic-thinking', 'industry-knowledge', 'communication'],
    difficulty: 'intermediate',
    duration_minutes: 15,
    related_job_profile: a4Context.jobProfiles[0] || 'Profesional general',
  })

  // Scenario 2: Skills Gap Bridge
  scenarios.push({
    id: `scenario_skills_${userId}`,
    title: 'Cierre de Brecha de Competencias',
    description: `Te presentan un desafío que requiere una habilidad que A2 identifica como brecha. Debes mostrar cómo la estás desarrollando.`,
    context_from_a4: `Requiere: ${a4Context.requiredSkills[0] || 'Liderazgo en contexto de cambio'}`,
    skills_to_practice: a4Context.requiredSkills,
    difficulty: 'advanced',
    duration_minutes: 20,
    related_job_profile: a4Context.jobProfiles[1] || 'Rol aspiracional',
  })

  // Scenario 3: Situational Excellence
  scenarios.push({
    id: `scenario_situation_${userId}`,
    title: 'Situación Real del Mercado',
    description: `Basado en A4, afrontas un escenario real que alguien en tu rol objetivo podría enfrentar. Aplica tu plan de A2.`,
    context_from_a4: a4Context.marketTrends[1] || 'Cambio organizacional',
    skills_to_practice: ['problem-solving', 'adaptability', 'decision-making'],
    difficulty: 'advanced',
    duration_minutes: 25,
    related_job_profile: a4Context.jobProfiles[0] || 'Profesional general',
  })

  return scenarios
}

export async function saveTrainingProgress(
  userId: string,
  scenarioId: string,
  score: number,
  feedback: string,
  timeSpent: number
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('despega_a3_training_progress')
    .insert({
      user_id: userId,
      scenario_id: scenarioId,
      score,
      feedback,
      time_spent_minutes: timeSpent,
      completed_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error('Error saving training progress:', error)
    throw error
  }

  return data
}

export async function getPersonalizedTrainingRecommendations(
  userId: string,
  a2Data: {
    mission: string
    goals: string[]
    weakAreas: string[]
  },
  a4Data: {
    marketOpportunities: string[]
    requiredSkills: string[]
  }
) {
  const recommendations = {
    priority_scenarios: [
      'Situación Real del Mercado',
      'Cierre de Brecha de Competencias',
      'Entrevista sobre Tendencias del Mercado',
    ],
    focus_skills: a4Data.requiredSkills,
    practice_frequency: 'daily',
    estimated_completion: '4 weeks',
    expected_improvement: '40% en competencias del mercado',
  }

  return recommendations
}
