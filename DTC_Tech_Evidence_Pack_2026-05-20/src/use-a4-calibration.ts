"use client"

import { useCoachStrategicContext } from "@/components/coach-strategic-provider"

/**
 * Sistema de calibración dinámico
 * El A4 Score (0-100) ajusta toda la experiencia:
 * - A1: Lenguaje y complejidad de explicaciones
 * - A2: Dificultad de misiones (1-5)
 * - A3: Ambigüedad de simulaciones (0-100%)
 * - Coach: Nivel de exigencia (0-100%)
 */

export interface CalibrationParameters {
  a1_language_level: "simple" | "standard" | "advanced" | "expert"
  a1_explanation_depth: number // 1-10
  a2_mission_difficulty: number // 1-5
  a2_mission_complexity: number // 1-5
  a3_ambiguity_level: number // 0-100
  a3_challenge_intensity: number // 1-5
  coach_demand_level: number // 0-100
  coach_directiveness: "supportive" | "balanced" | "challenging"
  content_density: number // pages per concept (1-5)
  pacing: "slow" | "moderate" | "fast"
}

export function useA4Calibration(): CalibrationParameters {
  const strategicContext = useCoachStrategicContext()
  const score = strategicContext.a4_current_score || 0
  const level = strategicContext.a4_score_level || "beginner"

  // Map score (0-100) to calibration parameters
  const calculateCalibration = (): CalibrationParameters => {
    let a1Language: "simple" | "standard" | "advanced" | "expert" = "simple"
    let a1Depth = 3
    let a2Difficulty = 1
    let a2Complexity = 1
    let a3Ambiguity = 10
    let a3Challenge = 1
    let coachDemand = 20
    let coachDirectiveness: "supportive" | "balanced" | "challenging" = "supportive"
    let contentDensity = 1
    let pacing: "slow" | "moderate" | "fast" = "slow"

    // Beginner (0-25): Máximo soporte, mínima complejidad
    if (score <= 25) {
      a1Language = "simple"
      a1Depth = 2
      a2Difficulty = 1
      a2Complexity = 1
      a3Ambiguity = 5
      a3Challenge = 1
      coachDemand = 15
      coachDirectiveness = "supportive"
      contentDensity = 1
      pacing = "slow"
    }
    // Intermediate (26-50): Soporte + desafío moderado
    else if (score <= 50) {
      a1Language = "standard"
      a1Depth = 4
      a2Difficulty = 2
      a2Complexity = 2
      a3Ambiguity = 25
      a3Challenge = 2
      coachDemand = 40
      coachDirectiveness = "balanced"
      contentDensity = 2
      pacing = "moderate"
    }
    // Advanced (51-75): Desafío progresivo
    else if (score <= 75) {
      a1Language = "advanced"
      a1Depth = 6
      a2Difficulty = 3
      a2Complexity = 3
      a3Ambiguity = 50
      a3Challenge = 3
      coachDemand = 65
      coachDirectiveness = "balanced"
      contentDensity = 3
      pacing = "moderate"
    }
    // Master (76-100): Máximo desafío, mínimo soporte
    else {
      a1Language = "expert"
      a1Depth = 9
      a2Difficulty = 5
      a2Complexity = 5
      a3Ambiguity = 85
      a3Challenge = 5
      coachDemand = 90
      coachDirectiveness = "challenging"
      contentDensity = 5
      pacing = "fast"
    }

    return {
      a1_language_level: a1Language,
      a1_explanation_depth: a1Depth,
      a2_mission_difficulty: a2Difficulty,
      a2_mission_complexity: a2Complexity,
      a3_ambiguity_level: a3Ambiguity,
      a3_challenge_intensity: a3Challenge,
      coach_demand_level: coachDemand,
      coach_directiveness: coachDirectiveness,
      content_density: contentDensity,
      pacing: pacing,
    }
  }

  return calculateCalibration()
}
