"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"

// Test A1 Cerebral - Formato Paired Comparison (2 opciones)
// Basado en modelo DISC: Energía (S), Enfoque (C), Relaciones (I), Plan Ejecutivo (D)
// Cada pregunta presenta 2 opciones, el usuario elige cuál es más como él
const TEST_A1_QUESTIONS = [
  {
    id: 1,
    question: "¿Cuál es más como tú?",
    optionA: {
      text: "Mantengo la calma bajo presión y busco estabilidad",
      category: "energia",
    },
    optionB: {
      text: "Soy decidido y voy directo hacia mis objetivos",
      category: "plan_ejecutivo",
    },
  },
  {
    id: 2,
    question: "¿Cuál es más como tú?",
    optionA: {
      text: "Analizo cada detalle y busco precisión en mi trabajo",
      category: "enfoque",
    },
    optionB: {
      text: "Conecto fácilmente con otros y construyo relaciones",
      category: "relaciones",
    },
  },
  {
    id: 3,
    question: "¿Cuál es más como tú?",
    optionA: {
      text: "Prefiero trabajar de forma consistente y confiable",
      category: "energia",
    },
    optionB: {
      text: "Prefiero innovar y asumir nuevos desafíos",
      category: "plan_ejecutivo",
    },
  },
  {
    id: 4,
    question: "¿Cuál es más como tú?",
    optionA: {
      text: "Busco perfección y reviso cada detalle meticulosamente",
      category: "enfoque",
    },
    optionB: {
      text: "Inspiro a otros y disfruto influenciar en equipo",
      category: "relaciones",
    },
  },
  {
    id: 5,
    question: "¿Cuál es más como tú?",
    optionA: {
      text: "Soy amigable y creo un ambiente armonioso",
      category: "energia",
    },
    optionB: {
      text: "Soy competitivo y orientado a resultados",
      category: "plan_ejecutivo",
    },
  },
  {
    id: 6,
    question: "¿Cuál es más como tú?",
    optionA: {
      text: "Me cuesta cambiar mis procesos una vez establecidos",
      category: "enfoque",
    },
    optionB: {
      text: "Soy carismático y motivador con los demás",
      category: "relaciones",
    },
  },
  {
    id: 7,
    question: "¿Cuál es más como tú?",
    optionA: {
      text: "Adapto mis comportamientos según el contexto",
      category: "energia",
    },
    optionB: {
      text: "Tomo decisiones rápidas sin necesidad de consenso",
      category: "plan_ejecutivo",
    },
  },
  {
    id: 8,
    question: "¿Cuál es más como tú?",
    optionA: {
      text: "Cumplo mis compromisos con disciplina exacta",
      category: "enfoque",
    },
    optionB: {
      text: "Tengo una red amplia y mantengo muchas amistades",
      category: "relaciones",
    },
  },
]

type Step = "intro" | "camino" | "test" | "results"

export default function DespegaOnboarding() {
  const [step, setStep] = useState<Step>("intro")
  const [caminoPersona, setCaminoPersona] = useState(false)
  const [caminoProfesional, setCaminoProfesional] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<Record<number, string>>({})
  const [results, setResults] = useState<{
    energia: number
    enfoque: number
    relaciones: number
    plan_ejecutivo: number
    total: number
    nivel: string
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserId(user.id)
    }
    getUser()
  }, [supabase])

  const question = TEST_A1_QUESTIONS[currentQuestion]
  const progress = ((currentQuestion + 1) / TEST_A1_QUESTIONS.length) * 100
  const isAnswered = responses[question.id] !== undefined

  const handleSelect = (option: "A" | "B") => {
    setResponses({ ...responses, [question.id]: option })
  }

  const handleNext = () => {
    if (!isAnswered) return
    
    if (currentQuestion < TEST_A1_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculateResults()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const calculateResults = async () => {
    setLoading(true)
    
    const scores = {
      energia: 0,
      enfoque: 0,
      relaciones: 0,
      plan_ejecutivo: 0,
    }
    
    const counts = {
      energia: 0,
      enfoque: 0,
      relaciones: 0,
      plan_ejecutivo: 0,
    }

    // Contar respuestas por categoría
    TEST_A1_QUESTIONS.forEach((q) => {
      const response = responses[q.id]
      if (response) {
        const selectedOption = response === "A" ? q.optionA : q.optionB
        const category = selectedOption.category as keyof typeof scores
        scores[category]++
        counts[category]++
      }
    })

    // Calcular porcentajes (0-100)
    const avgScores = {
      energia: counts.energia > 0 ? (scores.energia / counts.energia) * 100 : 0,
      enfoque: counts.enfoque > 0 ? (scores.enfoque / counts.enfoque) * 100 : 0,
      relaciones: counts.relaciones > 0 ? (scores.relaciones / counts.relaciones) * 100 : 0,
      plan_ejecutivo: counts.plan_ejecutivo > 0 ? (scores.plan_ejecutivo / counts.plan_ejecutivo) * 100 : 0,
    }

    const total = (avgScores.energia + avgScores.enfoque + avgScores.relaciones + avgScores.plan_ejecutivo) / 4
    
    // Determinar nivel
    let nivel = "Equilibrado"
    if (total > 75) nivel = "Alto"
    else if (total > 50) nivel = "Moderado"
    else nivel = "Por Desarrollar"

    setResults({
      energia: avgScores.energia,
      enfoque: avgScores.enfoque,
      relaciones: avgScores.relaciones,
      plan_ejecutivo: avgScores.plan_ejecutivo,
      total,
      nivel,
    })

    // Save to database
    if (userId) {
      try {
        // Get user email once at the beginning
        const { data: { user: authUser } } = await supabase.auth.getUser()
        const userEmail = authUser?.email

        // Create user profile with proper onConflict
        const { error: profileError } = await supabase.from("despega_user_profiles").upsert(
          {
            user_id: userId,
            camino_persona_active: caminoPersona,
            camino_profesional_active: caminoProfesional,
            camino_foco: caminoPersona && caminoProfesional ? "ambos" : caminoPersona ? "persona" : "profesional",
            onboarding_completed: true,
            a1_test_completed: true,
          },
          { onConflict: "user_id" }
        )
        
        if (profileError) {
          console.error("[v0] Error saving user profile:", profileError.message)
        }

        // Save test results with CORRECT schema
        const scoreTotalPercentage = Math.round(total)
        const resultados = {
          energia: Math.round(avgScores.energia),
          enfoque: Math.round(avgScores.enfoque),
          relaciones: Math.round(avgScores.relaciones),
          plan_ejecutivo: Math.round(avgScores.plan_ejecutivo),
        }

        const { error: a1Error } = await supabase.from("despega_a1_test_results").insert({
          user_id: userId,
          score_total: scoreTotalPercentage,
          resultados: resultados,
          respuestas: responses,
          diagnostico: nivel,
          completed_at: new Date().toISOString(),
        })
        
        if (a1Error) {
          console.error("[v0] Error saving to despega_a1_test_results:", a1Error.message)
        } else {
          console.log("[v0] Successfully saved to despega_a1_test_results")
        }

        // Also save to unified_test_results so dashboard recognizes it
        if (userEmail) {
          const { error: unifiedError } = await supabase.from("unified_test_results").insert({
            user_email: userEmail,
            test_type: "despega_cerebral",
            test_results: resultados,
          })
          if (unifiedError) {
            console.error("[v0] Error saving to unified_test_results:", unifiedError.message)
          } else {
            console.log("[v0] Successfully saved to unified_test_results")
          }
        }

        // Initialize pilar progress with proper onConflict
        const pilares = ["a1_cerebral", "a2_rutas", "aterrizaje", "base"]
        for (const pilar of pilares) {
          const { error: pilarError } = await supabase.from("despega_pilar_progress").upsert(
            {
              user_id: userId,
              pilar,
              estado: { diagnostico_completado: pilar === "a1_cerebral" },
              progreso: pilar === "a1_cerebral" ? 10 : 0,
              score: 0,
              ciclo_actual: 30,
              ciclo_dia: 1,
            },
            { onConflict: "user_id,pilar" }
          )
          
          if (pilarError) {
            console.error(`[v0] Error saving pilar ${pilar}:`, pilarError.message)
          }
        }

        // Initialize rankings with proper onConflict
        const { error: rankingError } = await supabase.from("despega_rankings").upsert(
          {
            user_id: userId,
            score_a1_cerebral: scoreTotalPercentage,
            score_a2_rutas: 0,
            score_aterrizaje: 0,
            score_base: 0,
            score_camino_persona: caminoPersona ? 5 : 0,
            score_camino_profesional: caminoProfesional ? 5 : 0,
            score_general: scoreTotalPercentage,
          },
          { onConflict: "user_id" }
        )
        
        if (rankingError) {
          console.error("[v0] Error saving to despega_rankings:", rankingError.message)
        } else {
          console.log("[v0] Successfully saved to despega_rankings")
        }
      } catch (error) {
        console.error("[v0] Error saving onboarding data:", error)
        // Don't throw - continue to show results even if saving fails
      } finally {
        setLoading(false)
        setStep("results")
      }
    } else {
      // No userId but still allow to see results
      console.warn("[v0] No userId available, skipping database save")
      setLoading(false)
      setStep("results")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-2xl mx-auto p-4 py-12">
        {/* INTRO STEP */}
        {step === "intro" && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl text-center">Despega Cerebral</CardTitle>
              <CardDescription className="text-center text-base mt-2">
                Descubre tu perfil profesional en 2 minutos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Este test evalúa 4 dimensiones clave de tu comportamiento profesional:
                </p>
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <span className="text-blue-600 font-bold">•</span>
                    <div>
                      <p className="font-semibold">Energía (Estabilidad)</p>
                      <p className="text-sm text-muted-foreground">Tu capacidad para mantener la calma y consistencia</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-600 font-bold">•</span>
                    <div>
                      <p className="font-semibold">Enfoque (Precisión)</p>
                      <p className="text-sm text-muted-foreground">Tu atención al detalle y rigor analítico</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-purple-600 font-bold">•</span>
                    <div>
                      <p className="font-semibold">Relaciones (Influencia)</p>
                      <p className="text-sm text-muted-foreground">Tu capacidad para conectar e influir en otros</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-orange-600 font-bold">•</span>
                    <div>
                      <p className="font-semibold">Plan Ejecutivo (Dominio)</p>
                      <p className="text-sm text-muted-foreground">Tu capacidad para decidir y ejecutar</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <p className="font-semibold">¿En cuál camino estás?</p>
                <div className="flex gap-3">
                  <Checkbox
                    id="camino-persona"
                    checked={caminoPersona}
                    onCheckedChange={(checked) => setCaminoPersona(checked as boolean)}
                  />
                  <Label htmlFor="camino-persona" className="flex-1 cursor-pointer">
                    <span className="font-medium">Crecimiento Personal</span>
                    <p className="text-sm text-muted-foreground font-normal">Desarrollo de tu ser</p>
                  </Label>
                </div>
                <div className="flex gap-3">
                  <Checkbox
                    id="camino-profesional"
                    checked={caminoProfesional}
                    onCheckedChange={(checked) => setCaminoProfesional(checked as boolean)}
                  />
                  <Label htmlFor="camino-profesional" className="flex-1 cursor-pointer">
                    <span className="font-medium">Desarrollo Profesional</span>
                    <p className="text-sm text-muted-foreground font-normal">Avance en tu carrera</p>
                  </Label>
                </div>
              </div>

              <Button
                onClick={() => setStep("test")}
                className="w-full h-12 text-base font-semibold"
                disabled={!caminoPersona && !caminoProfesional}
              >
                Comenzar Test
              </Button>
            </CardContent>
          </Card>
        )}

        {/* TEST STEP */}
        {step === "test" && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  Pregunta {currentQuestion + 1} de {TEST_A1_QUESTIONS.length}
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-6">{question.question}</h3>
                
                {/* Option A */}
                <button
                  onClick={() => handleSelect("A")}
                  className={`w-full p-4 mb-3 rounded-lg border-2 transition-all text-left ${
                    responses[question.id] === "A"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                      : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                  }`}
                >
                  <p className="font-medium">{question.optionA.text}</p>
                </button>

                {/* Option B */}
                <button
                  onClick={() => handleSelect("B")}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    responses[question.id] === "B"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                      : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                  }`}
                >
                  <p className="font-medium">{question.optionB.text}</p>
                </button>
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  className="flex-1"
                >
                  Anterior
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!isAnswered || loading}
                  className="flex-1"
                >
                  {currentQuestion === TEST_A1_QUESTIONS.length - 1 ? "Ver Resultados" : "Siguiente"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* RESULTS STEP */}
        {step === "results" && results && (
          <div className="space-y-6">
            {/* Main Results Card */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Tu Perfil Despega Cerebral</CardTitle>
                <CardDescription className="text-center">
                  Score General: <span className="text-2xl font-bold text-blue-600">{Math.round(results.total)}%</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Dimension Cards */}
                <div className="grid gap-4">
                  {/* Energía */}
                  <div className="p-4 rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-900">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100">Energía (Estabilidad)</h4>
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{Math.round(results.energia)}%</span>
                    </div>
                    <Progress value={results.energia} className="h-2" />
                    <p className="text-sm text-blue-800 dark:text-blue-200 mt-2">
                      {results.energia > 75 ? "Emocionalmente resiliente" : results.energia > 50 ? "Buscas equilibrio" : "Necesitas mayor estabilidad"}
                    </p>
                  </div>

                  {/* Enfoque */}
                  <div className="p-4 rounded-lg border border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-900">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-green-900 dark:text-green-100">Enfoque (Precisión)</h4>
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">{Math.round(results.enfoque)}%</span>
                    </div>
                    <Progress value={results.enfoque} className="h-2" />
                    <p className="text-sm text-green-800 dark:text-green-200 mt-2">
                      {results.enfoque > 75 ? "Analítico y riguroso" : results.enfoque > 50 ? "Buscas mayor precisión" : "Necesitas desarrollar rigor"}
                    </p>
                  </div>

                  {/* Relaciones */}
                  <div className="p-4 rounded-lg border border-purple-200 bg-purple-50 dark:bg-purple-950 dark:border-purple-900">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-purple-900 dark:text-purple-100">Relaciones (Influencia)</h4>
                      <span className="text-sm font-bold text-purple-600 dark:text-purple-400">{Math.round(results.relaciones)}%</span>
                    </div>
                    <Progress value={results.relaciones} className="h-2" />
                    <p className="text-sm text-purple-800 dark:text-purple-200 mt-2">
                      {results.relaciones > 75 ? "Inspirador y conectado" : results.relaciones > 50 ? "Buscas conectar más" : "Necesitas desarrollar conexión"}
                    </p>
                  </div>

                  {/* Plan Ejecutivo */}
                  <div className="p-4 rounded-lg border border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-900">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-orange-900 dark:text-orange-100">Plan Ejecutivo (Dominio)</h4>
                      <span className="text-sm font-bold text-orange-600 dark:text-orange-400">{Math.round(results.plan_ejecutivo)}%</span>
                    </div>
                    <Progress value={results.plan_ejecutivo} className="h-2" />
                    <p className="text-sm text-orange-800 dark:text-orange-200 mt-2">
                      {results.plan_ejecutivo > 75 ? "Líder decisivo" : results.plan_ejecutivo > 50 ? "Buscas mayor ejecución" : "Necesitas desarrollar liderazgo"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Insights Card */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Tu Insight Personalizado</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {results.energia > 3.5 ? (
                  <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-900">
                    <p className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Despega Cerebral - Estabilidad: Emocionalmente Resiliente</p>
                    <p className="text-sm text-blue-800 dark:text-blue-200">Tu fortaleza está en la estabilidad emocional. Mantienes la calma bajo presión y generas confianza en tu entorno. Eres confiable y predecible.</p>
                  </div>
                ) : results.energia > 2.5 ? (
                  <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-900">
                    <p className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Despega Cerebral - Estabilidad: Buscas Equilibrio</p>
                    <p className="text-sm text-blue-800 dark:text-blue-200">Oscila entre momentos de calma y períodos de inquietud. Reconoces la importancia de la consistencia, pero aún buscas tu ritmo natural.</p>
                  </div>
                ) : (
                  <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-900">
                    <p className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Despega Cerebral - Estabilidad: Necesitas Mayor Equilibrio</p>
                    <p className="text-sm text-blue-800 dark:text-blue-200">Experimentas fluctuaciones emocionales frecuentes. Recuperar estabilidad es prioritario para tu desempeño.</p>
                  </div>
                )}

                <Button 
                  onClick={() => router.push("/dashboard")}
                  className="w-full h-12 text-base font-semibold mt-6"
                >
                  Ir a mi Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
