import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export interface UserPersonalityProfile {
  disc?: any
  bigFive?: any
  mbti?: any
  testHistory: any[]
  demographics: {
    email: string
    name: string
    position?: string
    experience_years?: number
    career_goals?: string
  }
}

export interface AICoachingRequest {
  userEmail: string
  sessionType: "personality_analysis" | "career_guidance" | "skill_development" | "test_interpretation"
  context: string
  specificQuestion?: string
  testResults?: any
}

export interface AIInsight {
  title: string
  content: string
  type: "personality" | "career" | "growth" | "compatibility"
  confidence: number
  sourceTests: string[]
}

export class AICoach {
  private async getUserPersonalityProfile(userEmail: string): Promise<UserPersonalityProfile> {
    try {
      // Get user profile
      const { data: profile } = await supabase.from("user_profiles").select("*").eq("email", userEmail).single()

      // Get all test results
      const { data: testResults } = await supabase
        .from("test_results")
        .select("*")
        .eq("user_email", userEmail)
        .order("completed_at", { ascending: false })

      // Organize test results by type
      const personalityProfile: UserPersonalityProfile = {
        testHistory: testResults || [],
        demographics: {
          email: userEmail,
          name: profile?.full_name || "Usuario",
          position: profile?.position,
          experience_years: profile?.experience_years,
          career_goals: profile?.career_goal || profile?.career_goals,
        },
      }

      // Extract specific test results
      if (testResults) {
        testResults.forEach((result) => {
          switch (result.test_name) {
            case "DISC Assessment":
              personalityProfile.disc = result.results
              break
            case "Big Five":
              personalityProfile.bigFive = result.results
              break
            case "MBTI":
              personalityProfile.mbti = result.results
              break
          }
        })
      }

      return personalityProfile
    } catch (error) {
      console.error("Error getting user personality profile:", error)
      throw error
    }
  }

  private buildPersonalityContext(profile: UserPersonalityProfile): string {
    let context = `Perfil del Usuario: ${profile.demographics.name}\n`

    if (profile.demographics.position) {
      context += `Posición actual: ${profile.demographics.position}\n`
    }

    if (profile.demographics.experience_years) {
      context += `Años de experiencia: ${profile.demographics.experience_years}\n`
    }

    if (profile.demographics.career_goals) {
      context += `Objetivos de carrera: ${profile.demographics.career_goals}\n`
    }

    context += "\nResultados de Tests de Personalidad:\n"

    if (profile.disc) {
      context += `\nDISC Assessment:
- Dominancia (D): ${profile.disc.D}%
- Influencia (I): ${profile.disc.I}%
- Estabilidad (S): ${profile.disc.S}%
- Cumplimiento (C): ${profile.disc.C}%
- Tipo primario: ${profile.disc.primary_type}
- Tipo secundario: ${profile.disc.secondary_type}
- Resumen: ${profile.disc.personality_summary}
`
    }

    if (profile.bigFive) {
      context += `\nBig Five:
- Apertura (O): ${profile.bigFive.O}%
- Responsabilidad (C): ${profile.bigFive.C}%
- Extraversión (E): ${profile.bigFive.E}%
- Amabilidad (A): ${profile.bigFive.A}%
- Neuroticismo (N): ${profile.bigFive.N}%
- Rasgos principales: ${profile.bigFive.primary_traits?.join(", ")}
`
    }

    if (profile.mbti) {
      context += `\nMBTI:
- Tipo: ${profile.mbti.type} (${profile.mbti.type_name})
- Descripción: ${profile.mbti.type_description}
- Rasgos: ${profile.mbti.traits?.join(", ")}
`
    }

    return context
  }

  async generatePersonalityInsights(userEmail: string): Promise<AIInsight[]> {
    try {
      const profile = await this.getUserPersonalityProfile(userEmail)
      const context = this.buildPersonalityContext(profile)

      const prompt = `Como experto en psicología organizacional y desarrollo profesional, analiza el siguiente perfil de personalidad y genera insights específicos y accionables:

${context}

Por favor, genera 4-6 insights específicos en las siguientes categorías:
1. Fortalezas de personalidad únicas
2. Áreas de desarrollo prioritarias
3. Recomendaciones de carrera específicas
4. Estrategias de comunicación y liderazgo
5. Compatibilidad en equipos de trabajo
6. Plan de desarrollo personal a 6 meses

Para cada insight, proporciona:
- Un título claro y específico
- Contenido detallado y accionable (2-3 párrafos)
- Nivel de confianza (0.0 a 1.0)
- Tests que respaldan este insight

Responde en formato JSON con esta estructura:
{
  "insights": [
    {
      "title": "string",
      "content": "string",
      "type": "personality|career|growth|compatibility",
      "confidence": number,
      "sourceTests": ["string"]
    }
  ]
}`

      const response = await this.callOpenAI(prompt, userEmail, "personality_analysis", context)

      try {
        const parsedResponse = JSON.parse(response)
        const insights: AIInsight[] = parsedResponse.insights || []

        // Save insights to database
        for (const insight of insights) {
          await supabase.from("ai_insights").insert({
            user_email: userEmail,
            insight_type: insight.type,
            insight_title: insight.title,
            insight_content: insight.content,
            confidence_score: insight.confidence,
            source_tests: insight.sourceTests,
          })
        }

        return insights
      } catch (parseError) {
        console.error("Error parsing AI response:", parseError)
        return []
      }
    } catch (error) {
      console.error("Error generating personality insights:", error)
      return []
    }
  }

  async interpretTestResults(userEmail: string, testName: string, testResults: any): Promise<string> {
    try {
      const profile = await this.getUserPersonalityProfile(userEmail)
      const context = this.buildPersonalityContext(profile)

      let specificPrompt = ""

      switch (testName) {
        case "Big Five":
          specificPrompt = `Interpreta estos resultados del Test Big Five:
- Apertura: ${testResults.O}%
- Responsabilidad: ${testResults.C}%
- Extraversión: ${testResults.E}%
- Amabilidad: ${testResults.A}%
- Neuroticismo: ${testResults.N}%
- Rasgos principales: ${testResults.primary_traits?.join(", ")}

Proporciona una interpretación detallada que incluya:
1. Qué significan estos puntajes específicos
2. Cómo se combinan estos factores en su personalidad única
3. Implicaciones para su desarrollo profesional
4. Recomendaciones específicas basadas en estos resultados
5. Cómo estos resultados se relacionan con sus otros tests (si los tiene)`
          break

        case "MBTI":
          specificPrompt = `Interpreta estos resultados del Test MBTI:
- Tipo: ${testResults.type} (${testResults.type_name})
- Descripción: ${testResults.type_description}
- Puntuaciones: E:${testResults.scores?.E} I:${testResults.scores?.I} S:${testResults.scores?.S} N:${testResults.scores?.N} T:${testResults.scores?.T} F:${testResults.scores?.F} J:${testResults.scores?.J} P:${testResults.scores?.P}

Proporciona una interpretación detallada que incluya:
1. Análisis profundo de su tipo MBTI
2. Funciones cognitivas principales y auxiliares
3. Fortalezas naturales y áreas ciegas
4. Recomendaciones de carrera específicas para su tipo
5. Estrategias de desarrollo personal
6. Cómo este tipo interactúa con otros en el trabajo`
          break

        default:
          specificPrompt = `Interpreta estos resultados del test ${testName}: ${JSON.stringify(testResults)}`
      }

      const fullPrompt = `Como psicólogo organizacional experto, proporciona una interpretación profesional y personalizada:

CONTEXTO DEL USUARIO:
${context}

INTERPRETACIÓN SOLICITADA:
${specificPrompt}

Proporciona una respuesta en español, profesional, empática y accionable de aproximadamente 400-600 palabras.`

      const response = await this.callOpenAI(fullPrompt, userEmail, "test_interpretation", JSON.stringify(testResults))
      return response
    } catch (error) {
      console.error("Error interpreting test results:", error)
      return "Lo siento, no pude generar una interpretación en este momento. Por favor, intenta de nuevo más tarde."
    }
  }

  async getCareerGuidance(userEmail: string, specificQuestion?: string): Promise<string> {
    try {
      const profile = await this.getUserPersonalityProfile(userEmail)
      const context = this.buildPersonalityContext(profile)

      const prompt = `Como consultor de carrera experto, proporciona orientación profesional personalizada basada en este perfil:

${context}

${specificQuestion ? `Pregunta específica: ${specificQuestion}` : "Proporciona orientación general de carrera"}

Incluye:
1. Análisis de fortalezas profesionales basadas en su personalidad
2. Roles y industrias ideales
3. Habilidades a desarrollar
4. Estrategias de networking y crecimiento profesional
5. Próximos pasos concretos

Respuesta en español, profesional y accionable (400-500 palabras).`

      const response = await this.callOpenAI(prompt, userEmail, "career_guidance", context)
      return response
    } catch (error) {
      console.error("Error getting career guidance:", error)
      return "Lo siento, no pude generar orientación de carrera en este momento. Por favor, intenta de nuevo más tarde."
    }
  }

  async getDevelopmentPlan(userEmail: string): Promise<string> {
    try {
      const profile = await this.getUserPersonalityProfile(userEmail)
      const context = this.buildPersonalityContext(profile)

      const prompt = `Como coach de desarrollo profesional, crea un plan de desarrollo personalizado de 6 meses:

${context}

Crea un plan estructurado que incluya:
1. Objetivos SMART específicos basados en su personalidad
2. Habilidades técnicas y blandas a desarrollar
3. Recursos de aprendizaje recomendados
4. Métricas de progreso
5. Cronograma mensual
6. Estrategias para superar desafíos basados en su personalidad

Respuesta en español, estructurada y accionable (500-700 palabras).`

      const response = await this.callOpenAI(prompt, userEmail, "skill_development", context)
      return response
    } catch (error) {
      console.error("Error getting development plan:", error)
      return "Lo siento, no pude generar un plan de desarrollo en este momento. Por favor, intenta de nuevo más tarde."
    }
  }

  private async callOpenAI(
    prompt: string,
    userEmail: string,
    sessionType: string,
    contextData: string,
  ): Promise<string> {
    try {
      const response = await fetch("/api/ai-coach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          userEmail,
          sessionType,
          contextData,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.response
    } catch (error) {
      console.error("Error calling AI coach API:", error)
      throw error
    }
  }

  async getChatResponse(userEmail: string, message: string): Promise<string> {
    try {
      const profile = await this.getUserPersonalityProfile(userEmail)
      const context = this.buildPersonalityContext(profile)

      const prompt = `Eres un coach de desarrollo profesional experto y empático. Responde a la siguiente pregunta del usuario considerando su perfil de personalidad:

PERFIL DEL USUARIO:
${context}

PREGUNTA DEL USUARIO: ${message}

Proporciona una respuesta personalizada, empática y accionable en español. Usa su información de personalidad para dar consejos específicos y relevantes.`

      const response = await this.callOpenAI(prompt, userEmail, "personality_analysis", message)
      return response
    } catch (error) {
      console.error("Error getting chat response:", error)
      return "Lo siento, no pude procesar tu pregunta en este momento. Por favor, intenta de nuevo más tarde."
    }
  }
}

export const aiCoach = new AICoach()
