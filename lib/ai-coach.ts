import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export interface AICoachResponse {
  message: string
  suggestions?: string[]
  confidence: number
  context_used: string[]
}

export interface AIInsight {
  id: string
  type: "personality" | "career" | "development" | "compatibility"
  title: string
  content: string
  confidence: number
  source_tests: string[]
  created_at: string
}

class AICoachService {
  private async callOpenAI(messages: any[], temperature = 0.7): Promise<string> {
    try {
      const response = await fetch("/api/ai-coach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages,
          temperature,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.message || "Lo siento, no pude generar una respuesta en este momento."
    } catch (error) {
      console.error("Error calling OpenAI:", error)
      return "Lo siento, hubo un error al procesar tu solicitud. Por favor intenta de nuevo."
    }
  }

  private async getUserContext(userEmail: string): Promise<any> {
    try {
      const { data: profile } = await supabase.from("user_profiles").select("*").eq("email", userEmail).single()

      const { data: testResults } = await supabase
        .from("test_results")
        .select("*")
        .eq("user_email", userEmail)
        .order("completed_at", { ascending: false })

      const { data: activities } = await supabase
        .from("user_activities")
        .select("*")
        .eq("user_email", userEmail)
        .order("created_at", { ascending: false })
        .limit(10)

      const { data: insights } = await supabase
        .from("ai_insights")
        .select("*")
        .eq("user_email", userEmail)
        .eq("is_active", true)
        .order("created_at", { ascending: false })

      return {
        profile,
        testResults: testResults || [],
        activities: activities || [],
        insights: insights || [],
      }
    } catch (error) {
      console.error("Error fetching user context:", error)
      return { profile: null, testResults: [], activities: [], insights: [] }
    }
  }

  async interpretTestResults(userEmail: string, testName: string, results: any): Promise<string> {
    try {
      const context = await this.getUserContext(userEmail)

      const systemPrompt = `Eres un coach profesional especializado en desarrollo de carrera y análisis de personalidad. 
      Tu tarea es interpretar los resultados del test ${testName} de manera personalizada y constructiva.
      
      Contexto del usuario:
      - Tests completados: ${context.testResults.length}
      - Perfil: ${JSON.stringify(context.profile)}
      - Resultados anteriores: ${JSON.stringify(context.testResults.slice(0, 3))}
      
      Proporciona una interpretación detallada, práctica y motivadora que incluya:
      1. Análisis de los resultados principales
      2. Fortalezas identificadas
      3. Áreas de desarrollo
      4. Recomendaciones específicas para el crecimiento profesional
      5. Cómo estos resultados se relacionan con otros tests completados (si aplica)
      
      Mantén un tono profesional pero cercano, y enfócate en el crecimiento y las oportunidades.`

      const userPrompt = `Por favor interpreta mis resultados del test ${testName}:
      
      Resultados: ${JSON.stringify(results)}
      
      Quiero entender qué significan estos resultados para mi desarrollo profesional y personal.`

      const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ]

      const interpretation = await this.callOpenAI(messages, 0.7)

      // Save interpretation to database
      await supabase.from("ai_interpretations").insert({
        user_email: userEmail,
        test_name: testName,
        test_results: results,
        interpretation,
        generated_at: new Date().toISOString(),
        model_version: "gpt-4",
      })

      return interpretation
    } catch (error) {
      console.error("Error interpreting test results:", error)
      return "Lo siento, no pude generar la interpretación en este momento. Por favor intenta de nuevo más tarde."
    }
  }

  async chatWithCoach(userEmail: string, message: string, conversationHistory: any[] = []): Promise<AICoachResponse> {
    try {
      const context = await this.getUserContext(userEmail)

      const systemPrompt = `Eres un coach profesional especializado en desarrollo de carrera, liderazgo y crecimiento personal.
      
      Contexto del usuario:
      - Nombre: ${context.profile?.full_name || "Usuario"}
      - Tests completados: ${context.testResults.length}
      - XP total: ${context.profile?.total_xp || 0}
      - Objetivos de carrera: ${context.profile?.career_goals || "No especificados"}
      
      Resultados de tests disponibles:
      ${context.testResults.map((test: any) => `- ${test.test_name}: ${JSON.stringify(test.results)}`).join("\n")}
      
      Insights previos:
      ${context.insights.map((insight: any) => `- ${insight.insight_title}: ${insight.insight_content}`).join("\n")}
      
      Como coach, debes:
      1. Ser empático y motivador
      2. Proporcionar consejos prácticos y específicos
      3. Hacer referencias a los resultados de tests cuando sea relevante
      4. Sugerir acciones concretas
      5. Mantener un enfoque en el crecimiento y desarrollo
      
      Responde de manera conversacional pero profesional.`

      const messages = [
        { role: "system", content: systemPrompt },
        ...conversationHistory,
        { role: "user", content: message },
      ]

      const response = await this.callOpenAI(messages, 0.8)

      // Save conversation to database
      await supabase.from("ai_coaching_sessions").insert({
        user_email: userEmail,
        session_type: "chat",
        context_data: { test_results: context.testResults.map((t: any) => t.test_name) },
        messages: [
          ...conversationHistory,
          { role: "user", content: message },
          { role: "assistant", content: response },
        ],
      })

      return {
        message: response,
        confidence: 85,
        context_used: context.testResults.map((t: any) => t.test_name),
      }
    } catch (error) {
      console.error("Error in chat with coach:", error)
      return {
        message: "Lo siento, hubo un error al procesar tu mensaje. Por favor intenta de nuevo.",
        confidence: 0,
        context_used: [],
      }
    }
  }

  async generateInsights(userEmail: string): Promise<AIInsight[]> {
    try {
      const context = await this.getUserContext(userEmail)

      if (context.testResults.length < 2) {
        return []
      }

      const systemPrompt = `Eres un analista experto en desarrollo profesional y personalidad.
      
      Analiza los siguientes resultados de tests y genera 4-6 insights específicos y accionables:
      
      Tests completados:
      ${context.testResults.map((test: any) => `${test.test_name}: ${JSON.stringify(test.results)}`).join("\n\n")}
      
      Genera insights en estas categorías:
      1. Personalidad integrada
      2. Recomendaciones de carrera
      3. Plan de desarrollo
      4. Compatibilidad en equipos
      5. Fortalezas únicas
      6. Áreas de crecimiento
      
      Para cada insight, proporciona:
      - Un título conciso
      - Contenido específico y accionable (2-3 oraciones)
      - Nivel de confianza (0-100)
      - Tests que contribuyeron al insight
      
      Formato de respuesta: JSON array con objetos que tengan: title, content, confidence, source_tests`

      const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: "Genera insights basados en mis resultados de tests." },
      ]

      const response = await this.callOpenAI(messages, 0.6)

      try {
        const insights = JSON.parse(response)
        const processedInsights: AIInsight[] = []

        for (const insight of insights) {
          const { data } = await supabase
            .from("ai_insights")
            .insert({
              user_email: userEmail,
              insight_type: this.categorizeInsight(insight.title),
              insight_title: insight.title,
              insight_content: insight.content,
              confidence_score: insight.confidence || 80,
              source_tests: insight.source_tests || [],
            })
            .select()
            .single()

          if (data) {
            processedInsights.push({
              id: data.id,
              type: data.insight_type,
              title: data.insight_title,
              content: data.insight_content,
              confidence: data.confidence_score,
              source_tests: data.source_tests,
              created_at: data.created_at,
            })
          }
        }

        return processedInsights
      } catch (parseError) {
        console.error("Error parsing AI insights:", parseError)
        return []
      }
    } catch (error) {
      console.error("Error generating insights:", error)
      return []
    }
  }

  private categorizeInsight(title: string): "personality" | "career" | "development" | "compatibility" {
    const titleLower = title.toLowerCase()
    if (titleLower.includes("carrera") || titleLower.includes("profesional")) return "career"
    if (titleLower.includes("desarrollo") || titleLower.includes("crecimiento")) return "development"
    if (titleLower.includes("equipo") || titleLower.includes("compatibilidad")) return "compatibility"
    return "personality"
  }

  async getCareerGuidance(userEmail: string): Promise<string> {
    try {
      const context = await this.getUserContext(userEmail)

      const systemPrompt = `Eres un consultor de carrera experto. Proporciona orientación específica basada en los resultados de tests de personalidad.
      
      Resultados disponibles:
      ${context.testResults.map((test: any) => `${test.test_name}: ${JSON.stringify(test.results)}`).join("\n\n")}
      
      Proporciona:
      1. Análisis de fortalezas profesionales
      2. Roles ideales específicos
      3. Industrias recomendadas
      4. Pasos concretos para el desarrollo de carrera
      5. Habilidades a desarrollar
      
      Sé específico y práctico.`

      const messages = [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: "Necesito orientación específica para mi desarrollo de carrera basada en mis resultados de tests.",
        },
      ]

      return await this.callOpenAI(messages, 0.7)
    } catch (error) {
      console.error("Error getting career guidance:", error)
      return "Lo siento, no pude generar la orientación de carrera en este momento."
    }
  }

  async getDevelopmentPlan(userEmail: string): Promise<string> {
    try {
      const context = await this.getUserContext(userEmail)

      const systemPrompt = `Eres un coach de desarrollo profesional. Crea un plan de desarrollo personalizado.
      
      Resultados de tests:
      ${context.testResults.map((test: any) => `${test.test_name}: ${JSON.stringify(test.results)}`).join("\n\n")}
      
      Actividades recientes:
      ${context.activities.map((activity: any) => `${activity.activity_description}`).join("\n")}
      
      Crea un plan estructurado con:
      1. Objetivos a 30, 90 y 180 días
      2. Habilidades específicas a desarrollar
      3. Recursos recomendados
      4. Métricas de progreso
      5. Acciones concretas semanales
      
      Hazlo específico y medible.`

      const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: "Crea un plan de desarrollo personalizado basado en mis resultados y progreso." },
      ]

      return await this.callOpenAI(messages, 0.7)
    } catch (error) {
      console.error("Error getting development plan:", error)
      return "Lo siento, no pude generar el plan de desarrollo en este momento."
    }
  }

  async getExistingInsights(userEmail: string): Promise<AIInsight[]> {
    try {
      const { data, error } = await supabase
        .from("ai_insights")
        .select("*")
        .eq("user_email", userEmail)
        .eq("is_active", true)
        .order("created_at", { ascending: false })

      if (error) throw error

      return (data || []).map((insight: any) => ({
        id: insight.id,
        type: insight.insight_type,
        title: insight.insight_title,
        content: insight.insight_content,
        confidence: insight.confidence_score,
        source_tests: insight.source_tests || [],
        created_at: insight.created_at,
      }))
    } catch (error) {
      console.error("Error fetching existing insights:", error)
      return []
    }
  }
}

export const aiCoach = new AICoachService()
