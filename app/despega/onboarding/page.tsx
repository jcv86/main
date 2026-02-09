"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"

// 28 DISC Questions - Professional Format like LiderDISC
const DISC_QUESTIONS = [
  {
    id: 1,
    options: ["Decisivo", "Entusiasta", "Tranquilo", "Cuidadoso"],
    types: ["D", "I", "S", "C"],
  },
  {
    id: 2,
    options: ["Competitivo", "Comunicativo", "Cooperativo", "Correcto"],
    types: ["D", "I", "S", "C"],
  },
  {
    id: 3,
    options: ["Dinámico", "Inspirador", "Estable", "Completo"],
    types: ["D", "I", "S", "C"],
  },
  {
    id: 4,
    options: ["Dominante", "Influyente", "Servicial", "Concienzudo"],
    types: ["D", "I", "S", "C"],
  },
  {
    id: 5,
    options: ["Atrevido", "Amable", "Amistoso", "Atento"],
    types: ["D", "I", "S", "C"],
  },
  {
    id: 6,
    options: ["Aventurero", "Animado", "Apacible", "Analítico"],
    types: ["D", "I", "S", "C"],
  },
  {
    id: 7,
    options: ["Agresivo", "Alegre", "Apaciguador", "Académico"],
    types: ["D", "I", "S", "C"],
  },
  {
    id: 8,
    options: ["Arriesgado", "Admirador", "Acomodaticio", "Abstracto"],
    types: ["D", "I", "S", "C"],
  },
  {
    id: 9,
    options: ["Blunt", "Brillante", "Bondadoso", "Básico"],
    types: ["D", "I", "S", "C"],
  },
  {
    id: 10,
    options: ["Bullidor", "Bromista", "Buscador de paz", "Buscador de verdad"],
    types: ["D", "I", "S", "C"],
  },
  {
    id: 11,
    options: ["Combativo", "Carismático", "Confiable", "Cauteloso"],
    types: ["D", "I", "S", "C"],
  },
  {
    id: 12,
    options: ["Curtido", "Conversador", "Cómodo", "Calculador"],
    types: ["D", "I", "S", "C"],
  },
  {
    id: 13,
    options: ["Directo", "Dramático", "Deseoso de complacer", "Detallista"],
    types: ["D", "I", "S", "C"],
  },
  {
    id: 14,
    options: ["Duro", "Divertido", "Dócil", "Disciplinado"],
    types: ["D", "I", "S", "C"],
  },
  {
    id: 15,
    options: ["Emprendedor", "Entusiasta", "Educado", "Exigente"],
    types: ["D", "I", "S", "C"],
  },
  {
    id: 16,
    options: ["Enérgico", "Expresivo", "Empático", "Exacto"],
    types: ["D", "I", "S", "C"],
  },
  {
    id: 17,
    options: ["Exigente", "Extrovertido", "Espontáneo", "Escrutable"],
    types: ["D", "I", "S", "C"],
  },
  {
    id: 18,
    options: ["Eficiente", "Emotivo", "Estable", "Escéptico"],
    types: ["D", "I", "S", "C"],
  },
  {
    id: 19,
    options: ["Firme", "Fascinante", "Fiel", "Formal"],
    types: ["D", "I", "S", "C"],
  },
  {
    id: 20,
    options: ["Fuerte", "Festivo", "Flexible", "Frío"],
    types: ["D", "I", "S", "C"],
  },
  {
    id: 21,
    options: ["Ganador", "Generoso", "Gentil", "Genio"],
    types: ["D", "I", "S", "C"],
  },
  {
    id: 22,
    options: ["Graduado en éxito", "Gran comunicador", "Grata presencia", "Gramatical"],
    types: ["D", "I", "S", "C"],
  },
  {
    id: 23,
    options: ["Imparable", "Inspirador", "Incondicional", "Impecable"],
    types: ["D", "I", "S", "C"],
  },
  {
    id: 24,
    options: ["Impulsivo", "Ingenioso", "Intuitivo", "Inteligente"],
    types: ["D", "I", "S", "C"],
  },
  {
    id: 25,
    options: ["Justo", "Jovial", "Juicioso", "Justo"],
    types: ["D", "I", "S", "C"],
  },
  {
    id: 26,
    options: ["Jefe nato", "Juerguista", "Jugador de equipo", "Juez de la calidad"],
    types: ["D", "I", "S", "C"],
  },
  {
    id: 27,
    options: ["Luchador", "Locuaz", "Leal", "Lógico"],
    types: ["D", "I", "S", "C"],
  },
  {
    id: 28,
    options: ["Líder", "Luminoso", "Liviano de corazón", "Letra chica"],
    types: ["D", "I", "S", "C"],
  },
]

type Step = "intro" | "test" | "results"

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>("intro")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<Record<number, { most: number; least: number }>>({})
  const [results, setResults] = useState<{ D: number; I: number; S: number; C: number } | null>(null)
  const [insights, setInsights] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      console.log("[v0] Fetching authenticated user...")
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        console.log("[v0] User found:", user.email, user.id)
        setUserId(user.id)
        setUserEmail(user.email || null)
      } else {
        console.log("[v0] No user found")
      }
    }
    getUser()
  }, [supabase])

  const handleSelection = (questionId: number, optionIndex: number, type: "most" | "least") => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [type]: optionIndex,
      },
    }))
  }

  const isQuestionAnswered = (questionId: number) => {
    return responses[questionId]?.most !== undefined && responses[questionId]?.least !== undefined && responses[questionId].most !== responses[questionId].least
  }

  const canProceed = () => {
    return isQuestionAnswered(DISC_QUESTIONS[currentQuestion].id)
  }

  const handleNext = () => {
    if (currentQuestion < DISC_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculateResults()
    }
  }

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const calculateResults = async () => {
    setLoading(true)
    try {
      let D = 0, I = 0, S = 0, C = 0

      // Score each response
      Object.entries(responses).forEach(([questionId, { most, least }]) => {
        const question = DISC_QUESTIONS.find((q) => q.id === parseInt(questionId))
        if (question) {
          // +1 for most, -1 for least
          const mostType = question.types[most]
          const leastType = question.types[least]

          if (mostType === "D") D += 1
          else if (mostType === "I") I += 1
          else if (mostType === "S") S += 1
          else if (mostType === "C") C += 1

          if (leastType === "D") D -= 1
          else if (leastType === "I") I -= 1
          else if (leastType === "S") S -= 1
          else if (leastType === "C") C -= 1
        }
      })

      // Normalize scores to 0-100 percentile
      const normalizeScore = (score: number) => {
        return Math.round(((score + 28) / 56) * 100)
      }

      const normalizedResults = {
        D: normalizeScore(D),
        I: normalizeScore(I),
        S: normalizeScore(S),
        C: normalizeScore(C),
      }

      setResults(normalizedResults)
      console.log("[v0] Calculated DISC results:", normalizedResults)

      // Save to database
      if (userId && userEmail) {
        console.log("[v0] Saving test results to database:", { userId, userEmail, normalizedResults })
        const { error } = await supabase.from("unified_test_results").insert({
          user_email: userEmail,
          user_id: userId,
          test_type: "despega_cerebral",
          test_results: normalizedResults,
        })
        if (error) {
          console.error("[v0] Error saving to database:", error)
        } else {
          console.log("[v0] Successfully saved to database")
        }
      } else {
        console.log("[v0] Missing userId or userEmail, cannot save to database")
      }

      // Generate AI insights
      console.log("[v0] Triggering AI insights generation...")
      await generateAIInsights(userId, normalizedResults)

      setStep("results")
    } catch (error) {
      console.error("[v0] Error calculating results:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateAIInsights = async (userId: string | null, testResults: any) => {
    console.log("[v0] Starting AI insights generation with:", { userId, testResults })
    try {
      const payload = {
        testType: "despega_cerebral",
        results: testResults,
        userId: userId || "anonymous",
        testResponses: responses,
      }
      console.log("[v0] Sending payload to /api/post-test-insights-simple:", JSON.stringify(payload).substring(0, 200))

      const response = await fetch("/api/post-test-insights-simple", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      console.log("[v0] API response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[v0] API error response status:", response.status, "text:", errorText.substring(0, 200))
        return
      }

      const data = await response.json()
      console.log("[v0] AI Insights received successfully:", JSON.stringify(data).substring(0, 300))
      setInsights(data)

      // También obtener recomendaciones de libros basadas en perfil DISC
      console.log("[v0] Fetching book recommendations based on DISC profile")
      try {
        const booksResponse = await fetch("/api/despega-book-recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            results: testResults,
            userId: userId || "anonymous",
          }),
        })

        if (booksResponse.ok) {
          const booksData = await booksResponse.json()
          console.log("[v0] Book recommendations received:", JSON.stringify(booksData).substring(0, 300))
          // Combinar insights con recomendaciones de libros
          setInsights((prev: any) => ({
            ...prev,
            bookRecommendations: booksData.recommendations,
            dominantProfile: booksData.dominantProfile,
          }))
        } else {
          console.error("[v0] Book recommendations failed:", booksResponse.statusText)
        }
      } catch (bookError) {
        console.error("[v0] Error fetching book recommendations:", bookError)
      }
    } catch (error) {
      console.error("[v0] Error generating AI insights:", error)
    }
  }

  const currentQ = DISC_QUESTIONS[currentQuestion]
  const currentResponse = responses[currentQ.id]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* INTRO STEP */}
        {step === "intro" && (
          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Descubre tu Perfil DISC</CardTitle>
              <CardDescription className="text-lg mt-2">
                Despega Cerebral - Test de Personalidad Profesional
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg">
                <h3 className="font-semibold mb-3">¿Cómo funciona?</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-3">
                    <span className="text-blue-600">✓</span>
                    <span>28 preguntas de 4 palabras cada una</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-600">✓</span>
                    <span>Elige la palabra MÁS parecida a ti</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-600">✓</span>
                    <span>Elige la palabra MENOS parecida a ti</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-600">✓</span>
                    <span>Tiempo estimado: 10 minutos</span>
                  </li>
                </ul>
              </div>

              <div className="bg-indigo-50 dark:bg-indigo-900 p-6 rounded-lg">
                <h3 className="font-semibold mb-3">Los 4 Estilos DISC</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex gap-2">
                    <span className="w-3 h-3 bg-orange-500 rounded mt-1"></span>
                    <div>
                      <p className="font-semibold">D - Dominio</p>
                      <p className="text-xs text-muted-foreground">Directo, decisivo</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="w-3 h-3 bg-yellow-500 rounded mt-1"></span>
                    <div>
                      <p className="font-semibold">I - Influencia</p>
                      <p className="text-xs text-muted-foreground">Entusiasta, inspirador</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="w-3 h-3 bg-green-500 rounded mt-1"></span>
                    <div>
                      <p className="font-semibold">S - Estabilidad</p>
                      <p className="text-xs text-muted-foreground">Tranquilo, leal</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="w-3 h-3 bg-blue-500 rounded mt-1"></span>
                    <div>
                      <p className="font-semibold">C - Consciencia</p>
                      <p className="text-xs text-muted-foreground">Cuidadoso, preciso</p>
                    </div>
                  </div>
                </div>
              </div>

              <Button onClick={() => setStep("test")} className="w-full h-12 text-base font-semibold">
                Comenzar Test
              </Button>
            </CardContent>
          </Card>
        )}

        {/* TEST STEP */}
        {step === "test" && (
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <div className="flex justify-between items-center mb-4">
                <CardTitle>Pregunta {currentQuestion + 1} de {DISC_QUESTIONS.length}</CardTitle>
                <span className="text-sm font-semibold text-blue-600">
                  {Math.round(((currentQuestion + 1) / DISC_QUESTIONS.length) * 100)}%
                </span>
              </div>
              <Progress value={((currentQuestion + 1) / DISC_QUESTIONS.length) * 100} className="h-2" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <p className="font-semibold text-center text-lg">Selecciona:</p>
                <div className="grid grid-cols-2 gap-3">
                  {currentQ.options.map((option, idx) => (
                    <div key={idx} className="space-y-2">
                      <Button
                        onClick={() => handleSelection(currentQ.id, idx, "most")}
                        variant={currentResponse?.most === idx ? "default" : "outline"}
                        className={`w-full h-auto py-4 px-3 text-center whitespace-normal ${
                          currentResponse?.most === idx
                            ? "ring-2 ring-green-500 bg-green-600 hover:bg-green-700"
                            : ""
                        }`}
                      >
                        {option}
                      </Button>
                      {currentResponse?.most === idx && (
                        <p className="text-xs text-center font-semibold text-green-600">MÁS PARECIDA</p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="border-t-2 my-6"></div>

                <div className="grid grid-cols-2 gap-3">
                  {currentQ.options.map((option, idx) => (
                    <div key={idx} className="space-y-2">
                      <Button
                        onClick={() => handleSelection(currentQ.id, idx, "least")}
                        variant={currentResponse?.least === idx ? "default" : "outline"}
                        className={`w-full h-auto py-4 px-3 text-center whitespace-normal ${
                          currentResponse?.least === idx
                            ? "ring-2 ring-red-500 bg-red-600 hover:bg-red-700"
                            : ""
                        }`}
                      >
                        {option}
                      </Button>
                      {currentResponse?.least === idx && (
                        <p className="text-xs text-center font-semibold text-red-600">MENOS PARECIDA</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handlePrev} variant="outline" className="flex-1" disabled={currentQuestion === 0}>
                  Anterior
                </Button>
                <Button onClick={handleNext} className="flex-1" disabled={!canProceed() || loading}>
                  {currentQuestion === DISC_QUESTIONS.length - 1 ? "Ver Resultados" : "Siguiente"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* RESULTS STEP */}
        {step === "results" && results && (
          <div className="space-y-6">
            {/* PORTADA */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
              <CardContent className="pt-12 pb-12 text-center">
                <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-2">INFORME DESPEGA CEREBRAL</h1>
                <p className="text-lg text-blue-700 dark:text-blue-200 mb-6">Perfil DISC Profesional</p>
                <div className="border-t-2 border-blue-300 dark:border-blue-700 pt-6 mt-6">
                  <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">
                    Usuario: <span className="font-semibold">{userEmail || "Usuario"}</span>
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Fecha: <span className="font-semibold">{new Date().toLocaleDateString("es-ES")}</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* SCORES */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">Tus Puntuaciones DISC</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg border-2 border-orange-300 bg-orange-50 dark:bg-orange-950">
                  <div className="flex justify-between mb-2">
                    <h4 className="font-bold text-orange-900 dark:text-orange-100">D - DOMINIO</h4>
                    <span className="text-2xl font-bold text-orange-600">{results.D}%</span>
                  </div>
                  <Progress value={results.D} className="h-3" />
                </div>

                <div className="p-4 rounded-lg border-2 border-yellow-300 bg-yellow-50 dark:bg-yellow-950">
                  <div className="flex justify-between mb-2">
                    <h4 className="font-bold text-yellow-900 dark:text-yellow-100">I - INFLUENCIA</h4>
                    <span className="text-2xl font-bold text-yellow-600">{results.I}%</span>
                  </div>
                  <Progress value={results.I} className="h-3" />
                </div>

                <div className="p-4 rounded-lg border-2 border-green-300 bg-green-50 dark:bg-green-950">
                  <div className="flex justify-between mb-2">
                    <h4 className="font-bold text-green-900 dark:text-green-100">S - ESTABILIDAD</h4>
                    <span className="text-2xl font-bold text-green-600">{results.S}%</span>
                  </div>
                  <Progress value={results.S} className="h-3" />
                </div>

                <div className="p-4 rounded-lg border-2 border-blue-300 bg-blue-50 dark:bg-blue-950">
                  <div className="flex justify-between mb-2">
                    <h4 className="font-bold text-blue-900 dark:text-blue-100">C - CONSCIENCIA</h4>
                    <span className="text-2xl font-bold text-blue-600">{results.C}%</span>
                  </div>
                  <Progress value={results.C} className="h-3" />
                </div>
              </CardContent>
            </Card>

            {/* PERFIL DOMINANTE */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Tu Perfil Predominante</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold mb-3">
                  {Math.max(results.D, results.I, results.S, results.C) === results.D
                    ? "D - DOMINIO"
                    : Math.max(results.D, results.I, results.S, results.C) === results.I
                    ? "I - INFLUENCIA"
                    : Math.max(results.D, results.I, results.S, results.C) === results.S
                    ? "S - ESTABILIDAD"
                    : "C - CONSCIENCIA"}
                </p>
                <p className="text-muted-foreground">
                  {Math.max(results.D, results.I, results.S, results.C) === results.D
                    ? "Eres un líder decidido, orientado a resultados y con capacidad para tomar decisiones rápidas."
                    : Math.max(results.D, results.I, results.S, results.C) === results.I
                    ? "Eres una persona carismática, inspiradora y con gran capacidad para conectar con otros."
                    : Math.max(results.D, results.I, results.S, results.C) === results.S
                    ? "Eres estable, confiable y leal, con gran capacidad para trabajar en equipo."
                    : "Eres cuidadoso, preciso y detallista, con alta orientación a la calidad."}
                </p>
              </CardContent>
            </Card>

            {/* CTA */}
            <Button onClick={() => router.push("/dashboard")} className="w-full h-12 text-base font-semibold">
              Ver Mi Dashboard Completo
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
