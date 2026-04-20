import { createClient } from "@/lib/supabase/server"
import { getCerebroIntelligence } from "@/lib/cerebro-intelligence"
import { z } from "zod"

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

export interface TestResult {
  testType: string
  score: number
  results: any
  completedAt: string
}

export interface CrossTestAnalysis {
  profileSummary: string
  dominantTraits: string[]
  careerAlignment: {
    topMatches: Array<{
      career: string
      matchScore: number
      reasoning: string
      chileanMarketFit: string
    }>
    industries: string[]
  }
  skillGaps: Array<{
    skill: string
    importance: string
    developmentPath: string
  }>
  developmentPriorities: Array<{
    area: string
    priority: "high" | "medium" | "low"
    timeframe: string
    actionSteps: string[]
  }>
  marketInsights: Array<{
    industry: string
    insight: string
    relevance: number
  }>
}

const CrossTestAnalysisSchema = z.object({
  profileSummary: z.string(),
  dominantTraits: z.array(z.string()),
  careerAlignment: z.object({
    topMatches: z.array(
      z.object({
        career: z.string(),
        matchScore: z.number(),
        reasoning: z.string(),
        chileanMarketFit: z.string(),
      }),
    ),
    industries: z.array(z.string()),
  }),
  skillGaps: z.array(
    z.object({
      skill: z.string(),
      importance: z.string(),
      developmentPath: z.string(),
    }),
  ),
  developmentPriorities: z.array(
    z.object({
      area: z.string(),
      priority: z.enum(["high", "medium", "low"]),
      timeframe: z.string(),
      actionSteps: z.array(z.string()),
    }),
  ),
  marketInsights: z.array(
    z.object({
      industry: z.string(),
      insight: z.string(),
      relevance: z.number(),
    }),
  ),
})

export class EnhancedTestAnalyzer {
  private supabaseInstance: any = null

  private async getSupabase() {
    if (!this.supabaseInstance) {
      this.supabaseInstance = await createClient()
    }
    return this.supabaseInstance
  }

  /**
   * Analyze multiple test results together for comprehensive insights
   */
  async analyzeCrossTestResults(userId: string): Promise<CrossTestAnalysis | null> {
    try {
      // 1. Get all test results for user
      const testResults = await this.getUserTestResults(userId)

      if (testResults.length < 2) {
        console.log("User needs at least 2 tests for cross-analysis")
        return null
      }

      // 2. Get Chilean market insights
      const marketInsights = await this.getChileanMarketInsights()

      // 3. Get user context and patterns
      const userContext = await getCerebroIntelligence().getUserContext(userId)
      const userPatterns = await getCerebroIntelligence().getUserPatterns(userId)

      // 4. Check for known test combination patterns
      const combinationPattern = await this.getTestCombinationPattern(testResults.map((t) => t.testType))

      // 5. Generate comprehensive analysis using AI
      const analysis = await this.generateCrossTestAnalysis({
        testResults,
        marketInsights,
        userContext,
        userPatterns,
        combinationPattern,
      })

      // 6. Store analysis for future reference
      await this.storeCrossTestAnalysis(userId, testResults, analysis)

      // 7. Generate predictive insights
      await this.generatePredictiveCareerInsights(userId, analysis)

      return analysis
    } catch (error) {
      console.error("Error in cross-test analysis:", error)
      return null
    }
  }

  /**
   * Get all test results for a user
   */
  private async getUserTestResults(userId: string): Promise<TestResult[]> {
    const supabase = await this.getSupabase()
    const { data: profile } = await supabase.from("user_profiles").select("email").eq("id", userId).single()

    if (!profile?.email) return []

    const { data, error } = await supabase
      .from("test_results")
      .select("*")
      .eq("user_email", profile.email)
      .order("completed_at", { ascending: false })

    if (error) {
      console.error("Error fetching test results:", error)
      return []
    }

    return (data || []).map((r) => ({
      testType: r.test_type,
      score: r.score,
      results: r.results,
      completedAt: r.completed_at,
    }))
  }

  /**
   * Get Chilean market insights
   */
  private async getChileanMarketInsights(): Promise<any[]> {
    const supabase = await this.getSupabase()
    const { data, error } = await supabase
      .from("cerebro_market_insights")
      .select("*")
      .eq("region", "Chile")
      .order("confidence_score", { ascending: false })
      .limit(10)

    if (error) {
      console.error("Error fetching market insights:", error)
      return []
    }

    return data || []
  }

  /**
   * Get test combination pattern if exists
   */
  private async getTestCombinationPattern(testTypes: string[]): Promise<any | null> {
    const supabase = await this.getSupabase()
    const combination = testTypes.sort().join("+")

    const { data, error } = await supabase
      .from("cerebro_test_combinations")
      .select("*")
      .eq("test_combination", combination)
      .single()

    if (error) return null
    return data
  }

  /**
   * Get Chilean market insights
   */
  private async getChileanMarketInsights(): Promise<any[]> {
    const { data, error } = await this.getSupabase()
      .from("cerebro_market_insights")
      .select("*")
      .eq("region", "Chile")
      .order("confidence_score", { ascending: false })
      .limit(10)

    if (error) {
      console.error("Error fetching market insights:", error)
      return []
    }

    return data || []
  }

  /**
   * Get test combination pattern if exists
   */
  private async getTestCombinationPattern(testTypes: string[]): Promise<any | null> {
    const combination = testTypes.sort().join("+")

    const { data, error } = this.getSupabase()
      .from("cerebro_test_combinations")
      .select("*")
      .eq("test_combination", combination)
      .single()

    if (error) return null
    return data
  }

  /**
   * Generate comprehensive cross-test analysis using AI
   */
  private async generateCrossTestAnalysis(context: any): Promise<CrossTestAnalysis> {
    const { testResults, marketInsights, userContext, userPatterns, combinationPattern } = context

    const prompt = `Como Cerebro, el coach IA avanzado de Despega Tu Carrera, analiza estos resultados de múltiples tests para generar un perfil profesional completo.

**Tests Completados:**
${testResults.map((t: TestResult) => `- ${t.testType}: ${t.score}% (${JSON.stringify(t.results)})`).join("\n")}

**Patrón de Combinación Conocido:**
${combinationPattern ? JSON.stringify(combinationPattern, null, 2) : "No hay patrón predefinido - análisis personalizado"}

**Contexto del Usuario:**
${userContext ? JSON.stringify(userContext, null, 2) : "Nuevo usuario"}

**Patrones de Aprendizaje:**
${userPatterns.length > 0 ? JSON.stringify(userPatterns, null, 2) : "Sin patrones previos"}

**Insights del Mercado Chileno:**
${marketInsights.map((m: any) => `- ${m.industry} (${m.insight_type}): ${m.content}`).join("\n")}

Genera un análisis completo que:
1. Sintetice los resultados de todos los tests en un perfil coherente
2. Identifique rasgos dominantes y patrones de personalidad/habilidades
3. Recomiende carreras específicas con alta alineación al perfil
4. Evalúe el fit con el mercado laboral chileno actual
5. Identifique gaps de habilidades críticos
6. Priorice áreas de desarrollo con pasos accionables
7. Incluya insights específicos del mercado chileno

Enfócate en:
- Recomendaciones específicas para Chile
- Salarios y demanda real del mercado local
- Industrias en crecimiento en Chile
- Pasos accionables y realistas
- Timeframes concretos`

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "CrossTestAnalysis",
            description: "Cross-test analysis combining multiple assessment results",
            schema: {
              type: "object",
              properties: {
                profileSummary: { type: "string" },
                dominantTraits: {
                  type: "array",
                  items: { type: "string" },
                },
                careerAlignment: {
                  type: "object",
                  properties: {
                    topMatches: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          career: { type: "string" },
                          matchScore: { type: "number" },
                          reasoning: { type: "string" },
                          chileanMarketFit: { type: "string" },
                        },
                      },
                    },
                  },
                },
                skillGaps: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      skill: { type: "string" },
                      importance: { type: "string" },
                      developmentPath: { type: "string" },
                    },
                  },
                },
                developmentPriorities: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      area: { type: "string" },
                      priority: { type: "string" },
                      timeframe: { type: "string" },
                      actionSteps: {
                        type: "array",
                        items: { type: "string" },
                      },
                    },
                  },
                },
                marketInsights: { type: "string" },
              },
              required: [
                "profileSummary",
                "dominantTraits",
                "careerAlignment",
                "skillGaps",
                "developmentPriorities",
                "marketInsights",
              ],
            },
          },
        },
      }),
    })

    const data = await response.json()
    const object = JSON.parse(data.choices[0]?.message?.content || "{}")

    return object
  }

  /**
   * Store cross-test analysis
   */
  private async storeCrossTestAnalysis(userId: string, testResults: TestResult[], analysis: CrossTestAnalysis) {
    try {
      const supabase = await this.getSupabase()
      const { data: profile } = await supabase.from("user_profiles").select("email").eq("id", userId).single()

      if (!profile?.email) {
        console.error("User profile not found")
        return
      }

      await supabase.from("cerebro_cross_test_analysis").insert({
        user_email: profile.email,
        test_types: testResults.map((t) => t.testType),
        combined_profile: {
          summary: analysis.profileSummary,
          traits: analysis.dominantTraits,
        },
        career_alignment_score: Math.round(
          analysis.careerAlignment.topMatches.reduce((sum, m) => sum + m.matchScore, 0) /
            analysis.careerAlignment.topMatches.length,
        ),
        top_career_matches: analysis.careerAlignment.topMatches,
        skill_gaps: analysis.skillGaps,
        development_priorities: analysis.developmentPriorities,
        market_fit_analysis: analysis.marketInsights,
        generated_at: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Error storing cross-test analysis:", error)
    }
  }

  /**
   * Generate predictive career insights
   */
  private async generatePredictiveCareerInsights(userId: string, analysis: CrossTestAnalysis) {
    // Generate insights for top career matches
    for (const match of analysis.careerAlignment.topMatches.slice(0, 3)) {
      await getCerebroIntelligence().generatePredictiveInsight(userId, {
        insightType: "career_opportunity",
        prediction: `${match.career} es una excelente opción de carrera para ti`,
        reasoning: `${match.reasoning}. Fit con mercado chileno: ${match.chileanMarketFit}`,
        confidenceScore: match.matchScore / 100,
        priority: match.matchScore >= 85 ? 9 : match.matchScore >= 70 ? 7 : 5,
      })
    }

    // Generate insights for skill gaps
    for (const gap of analysis.skillGaps.filter((g) => g.importance === "high").slice(0, 2)) {
      await getCerebroIntelligence().generatePredictiveInsight(userId, {
        insightType: "skill_gap",
        prediction: `Desarrollar ${gap.skill} aumentará significativamente tus oportunidades`,
        reasoning: gap.developmentPath,
        confidenceScore: 0.85,
        priority: 8,
      })
    }

    // Generate insights for high-priority development areas
    for (const priority of analysis.developmentPriorities.filter((p) => p.priority === "high")) {
      await getCerebroIntelligence().generatePredictiveInsight(userId, {
        insightType: "learning_recommendation",
        prediction: `Enfócate en ${priority.area} en los próximos ${priority.timeframe}`,
        reasoning: `Pasos: ${priority.actionSteps.join(", ")}`,
        confidenceScore: 0.9,
        priority: 9,
      })
    }
  }

  /**
   * Get latest cross-test analysis for user
   */
  async getLatestCrossTestAnalysis(userId: string): Promise<CrossTestAnalysis | null> {
    const supabase = await this.getSupabase()
    const { data: profile } = await supabase.from("user_profiles").select("email").eq("id", userId).single()

    if (!profile?.email) return null

    const { data, error } = await supabase
      .from("cerebro_cross_test_analysis")
      .select("*")
      .eq("user_email", profile.email)
      .order("generated_at", { ascending: false })
      .limit(1)
      .single()

    if (error || !data) return null

    return {
      profileSummary: data.combined_profile.summary,
      dominantTraits: data.combined_profile.traits,
      careerAlignment: {
        topMatches: data.top_career_matches,
        industries: Array.from(new Set(data.top_career_matches.map((m: any) => m.industry as string))),
      },
      skillGaps: data.skill_gaps,
      developmentPriorities: data.development_priorities,
      marketInsights: data.market_fit_analysis,
    }
  }
}

// Lazy singleton to avoid build-time initialization
let instance: EnhancedTestAnalyzer | null = null

export function getEnhancedTestAnalyzer(): EnhancedTestAnalyzer {
  if (!instance) {
    instance = new EnhancedTestAnalyzer()
  }
  return instance
}
