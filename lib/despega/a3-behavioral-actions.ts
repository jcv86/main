"use server"

import { createClient } from "@/lib/supabase/server"

// Calculate P_success probability
export async function calculatePSuccess(
  userId: string,
  currentLevel: number,
  scenarioType: string,
  preSimulationConfidence: number
) {
  const supabase = await createClient()

  // Get user's historical completion rate
  const { data: progressHistory } = await supabase
    .from("despega_user_a3_progress")
    .select("is_completed")
    .eq("user_id", userId)
    .eq("scenario_type", scenarioType)

  const completionRate = progressHistory
    ? progressHistory.filter((p: any) => p.is_completed).length / progressHistory.length
    : 0

  // Get effective capacity from A1 results
  const { data: a1Results } = await supabase
    .from("despega_user_a1_results")
    .select("score_total")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  const effectiveCapacity = (a1Results?.score_total || 50) / 100

  // Get behavioral stability from last session
  const { data: lastObservation } = await supabase
    .from("despega_a3_behavioral_observations")
    .select("behavioral_stability_score")
    .eq("user_id", userId)
    .order("recorded_at", { ascending: false })
    .limit(1)
    .single()

  const behavioralStability = (lastObservation?.behavioral_stability_score || 70) / 100

  // Calculate P_success using weighted formula
  const weights = {
    completionRate: 0.3,
    effectiveCapacity: 0.25,
    behavioralStability: 0.2,
    preConfidence: 0.15,
    levelModifier: 0.1
  }

  const levelModifier = Math.max(0.5, 1 - (currentLevel - 1) * 0.15) // Decreases with level

  const pSuccess =
    completionRate * weights.completionRate +
    effectiveCapacity * weights.effectiveCapacity +
    behavioralStability * weights.behavioralStability +
    (preSimulationConfidence / 100) * weights.preConfidence +
    levelModifier * weights.levelModifier

  // Save calculation
  await supabase.from("despega_a3_p_success_calculations").insert({
    user_id: userId,
    historical_completion_rate: completionRate,
    current_difficulty_level: currentLevel,
    effective_capacity_score: effectiveCapacity * 100,
    pre_simulation_confidence: preSimulationConfidence,
    behavioral_stability_score: behavioralStability * 100,
    p_success_probability: Math.min(1, Math.max(0, pSuccess)),
    p_success_category:
      pSuccess >= 0.7 ? "muy_alta" :
      pSuccess >= 0.55 ? "alta" :
      pSuccess >= 0.4 ? "moderada" :
      pSuccess >= 0.25 ? "baja" :
      "muy_baja",
    difficulty_relative_warning: pSuccess <= 0.15
  })

  return {
    pSuccess: Math.min(1, Math.max(0, pSuccess)),
    category:
      pSuccess >= 0.7 ? "muy_alta" :
      pSuccess >= 0.55 ? "alta" :
      pSuccess >= 0.4 ? "moderada" :
      pSuccess >= 0.25 ? "baja" :
      "muy_baja",
    isDifficult: pSuccess <= 0.15
  }
}

// Record behavioral observations from simulation
export async function recordBehavioralObservations(
  userId: string,
  simulationId: string,
  observations: {
    eyeContactPercentage: number
    voiceConfidence: number
    silenceCount: number
    verbalFillers: string[]
    responseLength: "too_short" | "too_long" | "good"
  }
) {
  const supabase = await createClient()

  await supabase.from("despega_a3_behavioral_observations").insert({
    user_id: userId,
    simulation_id: simulationId,
    eye_contact_percentage: observations.eyeContactPercentage,
    tone_confidence: observations.voiceConfidence,
    silence_count: observations.silenceCount,
    verbal_fillers: observations.verbalFillers,
    response_length_issues: observations.responseLength,
    behavioral_stability_score: (observations.eyeContactPercentage + observations.voiceConfidence) / 2
  })
}

// Record emotional state during simulation
export async function recordEmotionalState(
  userId: string,
  simulationId: string,
  emotionalData: {
    anxietyPre: number
    anxietyMax: number
    frustrationDetected: boolean
    regulationScore: number
  }
) {
  const supabase = await createClient()

  // Check for frustration and trigger adaptive difficulty
  if (emotionalData.frustrationDetected && emotionalData.regulationScore < 40) {
    // Could trigger recommendation to lower difficulty
    console.log("High frustration detected - consider recommending difficulty reduction")
  }

  await supabase.from("despega_a3_emotional_state").insert({
    user_id: userId,
    simulation_id: simulationId,
    anxiety_level_pre: emotionalData.anxietyPre,
    max_anxiety_during: emotionalData.anxietyMax,
    frustration_detected: emotionalData.frustrationDetected,
    emotional_regulation_score: emotionalData.regulationScore,
    willingness_continue: emotionalData.regulationScore > 30
  })
}

// Update difficulty level based on progression rules
export async function updateDifficultyLevel(
  userId: string,
  scenarioType: string,
  wasSuccessful: boolean
) {
  const supabase = await createClient()

  // Get current difficulty level
  const { data: currentLevel } = await supabase
    .from("despega_a3_difficulty_levels")
    .select("*")
    .eq("user_id", userId)
    .eq("scenario_type", scenarioType)
    .single()

  if (!currentLevel) {
    // Initialize at level 1
    await supabase.from("despega_a3_difficulty_levels").insert({
      user_id: userId,
      scenario_type: scenarioType,
      current_level: 1,
      unlocked_up_to_level: 1,
      solid_executions_at_level: wasSuccessful ? 1 : 0
    })
    return
  }

  let newLevel = currentLevel.current_level
  let newSolidExecutions = wasSuccessful ? currentLevel.solid_executions_at_level + 1 : 0
  let newFailedAttempts = wasSuccessful ? 0 : currentLevel.failed_attempts_at_level + 1

  // Progression rules
  // Level 1→2: 1 execution
  // Level 2→3: 3 solid executions
  // Level 3→Bonus1: 5 solid executions
  // Bonus1→Bonus2: 7 solid executions

  if (currentLevel.current_level === 1 && newSolidExecutions >= 1) {
    newLevel = 2
  } else if (currentLevel.current_level === 2 && newSolidExecutions >= 3) {
    newLevel = 3
  } else if (currentLevel.current_level === 3 && newSolidExecutions >= 5) {
    newLevel = 4
  }

  // Reset solid executions if moving to next level
  if (newLevel > currentLevel.current_level) {
    newSolidExecutions = 0
  }

  // Regression if too many failures
  if (newFailedAttempts >= 3 && newLevel > 1) {
    newLevel = Math.max(1, newLevel - 1)
    newFailedAttempts = 0
    newSolidExecutions = 0
  }

  await supabase.from("despega_a3_difficulty_levels").update({
    current_level: newLevel,
    solid_executions_at_level: newSolidExecutions,
    failed_attempts_at_level: newFailedAttempts,
    last_level_change: newLevel > currentLevel.current_level ? new Date().toISOString() : undefined
  }).eq("user_id", userId).eq("scenario_type", scenarioType)

  return {
    newLevel,
    leveled_up: newLevel > currentLevel.current_level,
    solid_executions: newSolidExecutions
  }
}

// Generate structured professional feedback
export async function generateStructuredFeedback(
  userId: string,
  simulationId: string,
  observations: any,
  performanceScore: number
) {
  const supabase = await createClient()

  const feedback = {
    user_id: userId,
    simulation_id: simulationId,
    strengths_demonstrated: generateStrengths(observations, performanceScore),
    areas_for_improvement: generateImprovements(observations, performanceScore),
    emotional_manifestation: describeEmotionalState(observations),
    behavioral_manifestation: describeBehavioralState(observations),
    actionable_adjustments: generateAdjustments(observations),
    coach_narrative: generateCoachNarrative(observations, performanceScore),
    encouragement_score: Math.min(100, performanceScore + 15) // Always encourage
  }

  await supabase.from("despega_a3_structured_feedback").insert(feedback)
  return feedback
}

function generateStrengths(observations: any, score: number): string[] {
  const strengths = []
  if (observations.eyeContactPercentage > 60) strengths.push("Buen contacto visual")
  if (observations.voiceConfidence > 70) strengths.push("Voz segura y clara")
  if (observations.silenceCount < 2) strengths.push("Fluidez en la comunicación")
  if (score > 70) strengths.push("Respuestas estructuradas")
  return strengths.length > 0 ? strengths : ["Completaste la entrevista exitosamente"]
}

function generateImprovements(observations: any, score: number): string[] {
  const improvements = []
  if (observations.eyeContactPercentage < 60) improvements.push("Aumentar contacto visual")
  if (observations.voiceConfidence < 60) improvements.push("Trabajar en confianza vocal")
  if (observations.silenceCount > 3) improvements.push("Practicar responder sin pausas largas")
  if (observations.verbalFillers?.length > 0) improvements.push("Eliminar muletillas")
  return improvements.length > 0 ? improvements : ["Sigue practicando para pulir detalles"]
}

function describeBehavioralState(observations: any): string {
  if (observations.eyeContactPercentage > 70 && observations.voiceConfidence > 70) {
    return "Presentaste seguridad en tu lenguaje corporal y tono"
  }
  return "Mostraste algunos signos de nerviosismo, que es completamente normal"
}

function describeEmotionalState(observations: any): string {
  return "Demostraste capacidad de manejar la presión y mantener enfoque"
}

function generateAdjustments(observations: any): string[] {
  const adjustments = []
  if (observations.eyeContactPercentage < 60) {
    adjustments.push("Practica mirar a la cámara como si fuera la cara del entrevistador")
  }
  if (observations.responseLength === "too_long") {
    adjustments.push("Limita respuestas a 60-90 segundos. Regla: contexto + acción + resultado")
  }
  if (observations.voiceConfidence < 60) {
    adjustments.push("Grábate practicando para escuchar tu tono. Busca variación en ritmo y volumen")
  }
  return adjustments
}

function generateCoachNarrative(observations: any, score: number): string {
  const baseMessage = score > 70
    ? "Excelente desempeño. Demostraste pensamiento claro y autenticidad."
    : score > 50
    ? "Buen intento. Tienes los fundamentos. Enfócate en los detalles de comunicación."
    : "Este es el punto de partida. Cada práctica te acerca. Persevera."

  return `${baseMessage} Recuerda: una entrevista es una conversación, no un interrogatorio. Sé auténtico.`
}

// Detect frustration and recommend adaptive difficulty
export async function checkFrustrationAndAdapt(
  userId: string,
  emotionalState: any,
  performanceScore: number,
  currentLevel: number
) {
  const frustrationScore =
    (emotionalState.frustration_detected ? 50 : 0) +
    (emotionalState.max_anxiety_during > 80 ? 30 : 0) +
    (performanceScore < 40 ? 20 : 0)

  if (frustrationScore > 70 && currentLevel > 1) {
    return {
      shouldAdapt: true,
      recommendation: "Detectamos estrés significativo. Te recomendamos bajar a nivel anterior para construir confianza",
      suggestedLevel: currentLevel - 1
    }
  }

  return {
    shouldAdapt: false,
    recommendation: "Vas en buen camino. Mantén el enfoque.",
    suggestedLevel: currentLevel
  }
}
