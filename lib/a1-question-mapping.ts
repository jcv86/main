/**
 * A1 Question-to-Score Mapper (Issue #2: Consistent 1-10 normalization)
 * Maps real-world question responses to 1-10 scale consistently
 */

// Sueño (hours/night)
export function mapSleepToScore(hours: number): number {
  if (hours <= 4) return 2
  if (hours <= 5) return 3
  if (hours <= 6) return 4
  if (hours <= 7) return 6
  if (hours <= 8) return 8
  if (hours <= 9) return 9
  return 10
}

// Ejercicio (frequency per week)
export function mapExerciseToScore(timesPerWeek: number): number {
  if (timesPerWeek === 0) return 1
  if (timesPerWeek <= 1) return 3
  if (timesPerWeek <= 2) return 5
  if (timesPerWeek <= 3) return 6
  if (timesPerWeek <= 4) return 7
  if (timesPerWeek <= 5) return 8
  return 10
}

// Hidratación (self-reported consistency)
export function mapHydrationToScore(consistency: "never" | "sometimes" | "often" | "always"): number {
  const map: Record<string, number> = {
    never: 1,
    sometimes: 4,
    often: 7,
    always: 10,
  }
  return map[consistency] || 5
}

// Ritual matutino (has one, frequency)
export function mapMorningRitualToScore(hasRitual: boolean, frequency: "never" | "sometimes" | "usually" | "always"): number {
  if (!hasRitual) return 2
  const map: Record<string, number> = {
    never: 2,
    sometimes: 4,
    usually: 7,
    always: 10,
  }
  return map[frequency] || 5
}

// Concentración/Enfoque (self-rated)
export function mapFocusToScore(rating: number): number {
  // User rates 1-10 directly, but we normalize to ensure consistency
  return Math.min(10, Math.max(1, rating))
}

// Multi-tasking (number of simultaneous tasks - INVERSE scoring)
export function mapMultitaskingToScore(simultaneousTasks: number): number {
  // More tasks = lower score (bad for focus)
  if (simultaneousTasks >= 5) return 2
  if (simultaneousTasks >= 4) return 3
  if (simultaneousTasks >= 3) return 5
  if (simultaneousTasks >= 2) return 7
  return 9 // Single-tasking = good
}

// Phone-free time (minutes/hours without checking)
export function mapPhoneFreeToScore(minutes: number): number {
  if (minutes < 15) return 1
  if (minutes < 30) return 2
  if (minutes < 60) return 3
  if (minutes < 120) return 5
  if (minutes < 240) return 7
  return 10 // 4+ hours
}

// Daily planning (clarity of tasks)
export function mapDailyPlanToScore(clarity: "none" | "loose" | "moderate" | "detailed"): number {
  const map: Record<string, number> = {
    none: 1,
    loose: 3,
    moderate: 6,
    detailed: 9,
  }
  return map[clarity] || 5
}

// Reactivity ratio (% reactive vs proactive - INVERSE)
export function mapReactivityToScore(percentReactive: number): number {
  // 100% reactive = 1, 0% reactive = 10
  return Math.round((100 - percentReactive) / 10)
}

// Contacto frecuente (times per week with close people)
export function mapContactFreqToScore(timesPerWeek: number): number {
  if (timesPerWeek === 0) return 1
  if (timesPerWeek <= 1) return 3
  if (timesPerWeek <= 2) return 5
  if (timesPerWeek <= 3) return 6
  if (timesPerWeek <= 5) return 7
  if (timesPerWeek <= 7) return 8
  return 10 // Daily
}

// Help-asking (comfort level)
export function mapAskForHelpToScore(comfort: "never" | "rarely" | "sometimes" | "usually" | "always"): number {
  const map: Record<string, number> = {
    never: 1,
    rarely: 3,
    sometimes: 5,
    usually: 7,
    always: 9,
  }
  return map[comfort] || 5
}

// Feedback reception (quality of feedback & openness)
export function mapFeedbackToScore(feedback: "none" | "critical_only" | "balanced" | "supportive_growth"): number {
  const map: Record<string, number> = {
    none: 1,
    critical_only: 3,
    balanced: 6,
    supportive_growth: 9,
  }
  return map[feedback] || 5
}

// Social circle (size and quality)
export function mapCircleToScore(hasCircle: boolean, quality: "distant" | "moderate" | "close"): number {
  if (!hasCircle) return 1
  const map: Record<string, number> = {
    distant: 4,
    moderate: 6,
    close: 9,
  }
  return map[quality] || 5
}

// Gratitude expression (frequency)
export function mapGratitudeToScore(frequency: "rarely" | "sometimes" | "often" | "daily"): number {
  const map: Record<string, number> = {
    rarely: 2,
    sometimes: 5,
    often: 7,
    daily: 9,
  }
  return map[frequency] || 5
}

// Goals clarity (3-month horizon)
export function mapGoalsToScore(goalsClarity: "none" | "vague" | "moderate" | "clear"): number {
  const map: Record<string, number> = {
    none: 1,
    vague: 3,
    moderate: 6,
    clear: 9,
  }
  return map[goalsClarity] || 5
}

// Review ritual (frequency of weekly/monthly reviews)
export function mapReviewRitualToScore(hasRitual: boolean, frequency: "never" | "monthly" | "biweekly" | "weekly"): number {
  if (!hasRitual) return 1
  const map: Record<string, number> = {
    never: 1,
    monthly: 4,
    biweekly: 6,
    weekly: 9,
  }
  return map[frequency] || 5
}

// Task prioritization (method)
export function mapPrioritizationToScore(method: "random" | "urgent_only" | "mixed" | "strategic"): number {
  const map: Record<string, number> = {
    random: 1,
    urgent_only: 3,
    mixed: 6,
    strategic: 9,
  }
  return map[method] || 5
}

// Decision-making system
export function mapDecisionSystemToScore(system: "gut_feeling" | "ad_hoc" | "framework" | "deliberate"): number {
  const map: Record<string, number> = {
    gut_feeling: 2,
    ad_hoc: 4,
    framework: 7,
    deliberate: 9,
  }
  return map[system] || 5
}

// Progress measurement
export function mapProgressMeasureToScore(measured: "no" | "occasional" | "regular" | "systematic"): number {
  const map: Record<string, number> = {
    no: 1,
    occasional: 3,
    regular: 6,
    systematic: 9,
  }
  return map[measured] || 5
}

/**
 * Apply all mappers to raw answers and return normalized 1-10 scores
 */
export function normalizeAnswersTo110(rawAnswers: any): {
  energia: number[]
  enfoque: number[]
  relaciones: number[]
  plan_ejecutivo: number[]
} {
  return {
    energia: [
      mapSleepToScore(rawAnswers.q1_sleep_hours),
      mapExerciseToScore(rawAnswers.q2_exercise_freq),
      mapHydrationToScore(rawAnswers.q3_hydration),
      mapMorningRitualToScore(rawAnswers.q4_has_ritual, rawAnswers.q4_ritual_freq),
      mapFocusToScore(rawAnswers.q5_energy_general),
    ],
    enfoque: [
      mapFocusToScore(rawAnswers.q6_concentration),
      mapMultitaskingToScore(rawAnswers.q7_simultaneous_tasks),
      mapPhoneFreeToScore(rawAnswers.q8_phone_free_minutes),
      mapDailyPlanToScore(rawAnswers.q9_daily_plan),
      mapReactivityToScore(rawAnswers.q10_reactive_pct),
    ],
    relaciones: [
      mapContactFreqToScore(rawAnswers.q11_contact_freq),
      mapAskForHelpToScore(rawAnswers.q12_ask_help),
      mapFeedbackToScore(rawAnswers.q13_feedback),
      mapCircleToScore(rawAnswers.q14_has_circle, rawAnswers.q14_circle_quality),
      mapGratitudeToScore(rawAnswers.q15_gratitude),
    ],
    plan_ejecutivo: [
      mapGoalsToScore(rawAnswers.q16_goals),
      mapReviewRitualToScore(rawAnswers.q17_has_review, rawAnswers.q17_review_freq),
      mapPrioritizationToScore(rawAnswers.q18_prioritization),
      mapDecisionSystemToScore(rawAnswers.q19_decision_system),
      mapProgressMeasureToScore(rawAnswers.q20_progress_measure),
    ],
  }
}
