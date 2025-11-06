export interface UserProfile {
  userId: string
  strengths: string[]
  interests: string[]
  stage: "exploration" | "decision" | "action" | "growth"
  testResults: {
    mbti?: string
    disc?: string
    bigFive?: Record<string, number>
    riasec?: Record<string, number>
    softSkills?: Record<string, number>
  }
  behavior: {
    totalSessions: number
    avgEngagement: number
    completedActions: number
    lastActive: Date
  }
}

export interface AdaptiveAction {
  type: "message" | "recommendation" | "micro_step" | "simulation"
  content: string
  priority: number
  category: string
  coach?: "sofia" | "dani"
}

export class AdaptiveLearningBlueprint {
  // Calculate dynamic user profile based on behavior and test results
  static calculateProfile(userId: string, data: any): UserProfile {
    return {
      userId,
      strengths: this.extractStrengths(data),
      interests: this.extractInterests(data),
      stage: this.determineStage(data),
      testResults: data.testResults || {},
      behavior: {
        totalSessions: data.sessions?.length || 0,
        avgEngagement: data.avgEngagement || 0,
        completedActions: data.completedActions || 0,
        lastActive: new Date(data.lastActive || Date.now()),
      },
    }
  }

  // Decision policy: rules and heuristics to determine next action
  static decideNextAction(profile: UserProfile): AdaptiveAction {
    const { stage, behavior, interests } = profile

    // Rule 1: Low engagement → Motivational message from Sofia
    if (behavior.avgEngagement < 0.5) {
      return {
        type: "message",
        content: "Veo que has estado explorando. ¿Te gustaría que te ayude a enfocarte en algo específico?",
        priority: 10,
        category: "engagement",
        coach: "sofia",
      }
    }

    // Rule 2: Exploration stage → Recommend self-knowledge tests
    if (stage === "exploration" && !profile.testResults.mbti) {
      return {
        type: "recommendation",
        content: "Te recomiendo comenzar con el test MBTI para conocer tu personalidad profesional",
        priority: 9,
        category: "autoconocimiento",
        coach: "sofia",
      }
    }

    // Rule 3: Decision stage + career interest → CV/Interview prep
    if (stage === "decision" && interests.includes("career_change")) {
      return {
        type: "micro_step",
        content: "Paso 1: Actualiza tu CV destacando habilidades transferibles",
        priority: 8,
        category: "cv_linkedin",
        coach: "dani",
      }
    }

    // Rule 4: Action stage → Interview simulation
    if (stage === "action" && behavior.completedActions > 3) {
      return {
        type: "simulation",
        content: "Estás listo para practicar una entrevista. ¿Qué cargo te interesa?",
        priority: 7,
        category: "entrevistas",
        coach: "dani",
      }
    }

    // Default: General guidance
    return {
      type: "message",
      content: "¿En qué puedo ayudarte hoy?",
      priority: 5,
      category: "general",
      coach: "sofia",
    }
  }

  // Extract strengths from test results
  private static extractStrengths(data: any): string[] {
    const strengths: string[] = []

    if (data.testResults?.disc) {
      const disc = data.testResults.disc
      if (disc.includes("D")) strengths.push("liderazgo", "decisión")
      if (disc.includes("I")) strengths.push("comunicación", "persuasión")
      if (disc.includes("S")) strengths.push("colaboración", "empatía")
      if (disc.includes("C")) strengths.push("análisis", "precisión")
    }

    return strengths
  }

  // Extract interests from behavior and test results
  private static extractInterests(data: any): string[] {
    const interests: string[] = []

    if (data.testResults?.riasec) {
      const riasec = data.testResults.riasec
      if (riasec.R > 0.7) interests.push("técnico", "práctico")
      if (riasec.I > 0.7) interests.push("investigación", "análisis")
      if (riasec.A > 0.7) interests.push("creatividad", "innovación")
      if (riasec.S > 0.7) interests.push("ayuda", "enseñanza")
      if (riasec.E > 0.7) interests.push("emprendimiento", "liderazgo")
      if (riasec.C > 0.7) interests.push("organización", "administración")
    }

    return interests
  }

  // Determine user stage based on behavior
  private static determineStage(data: any): UserProfile["stage"] {
    const sessions = data.sessions?.length || 0
    const completedTests = Object.keys(data.testResults || {}).length
    const completedActions = data.completedActions || 0

    if (completedTests === 0 && sessions < 3) return "exploration"
    if (completedTests > 0 && completedActions < 2) return "decision"
    if (completedActions >= 2 && completedActions < 5) return "action"
    return "growth"
  }

  // Track metrics for learning
  static trackMetrics(
    userId: string,
    action: AdaptiveAction,
    outcome: {
      engaged: boolean
      completed: boolean
      satisfaction?: number
    },
  ) {
    // This would log to the database for future learning
    return {
      userId,
      action,
      outcome,
      timestamp: new Date(),
    }
  }
}
