"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"

// Test Despega Cerebral - Formato DISC Estándar
// 4 opciones por pregunta: elegir MÁS parecida y MENOS parecida
// Basado en: D=Dominio, I=Influencia, S=Estabilidad, C=Cumplimiento(Enfoque)
const TEST_A1_QUESTIONS = [
  {
    id: 1,
    question: "¿Cuál te describe mejor?",
    options: [
      { text: "Soy decisivo y voy directo a los resultados", type: "D" }, // Plan Ejecutivo
      { text: "Soy entusiasta e inspiro a otros", type: "I" }, // Relaciones
      { text: "Soy calmado y consistente", type: "S" }, // Energía
      { text: "Soy preciso y meticuloso", type: "C" }, // Enfoque
    ],
  },
  {
    id: 2,
    question: "En el trabajo, tiendo a ser...",
    options: [
      { text: "Competitivo y orientado al logro", type: "D" }, // Plan Ejecutivo
      { text: "Carismático y motivador", type: "I" }, // Relaciones
      { text: "Armonioso y colaborativo", type: "S" }, // Energía
      { text: "Analítico y enfocado en la calidad", type: "C" }, // Enfoque
    ],
  },
  {
    id: 3,
    question: "Cuando enfrento presión, yo...",
    options: [
      { text: "Actúo rápido y tomo decisiones", type: "D" }, // Plan Ejecutivo
      { text: "Mantengo la energía y motivo al equipo", type: "I" }, // Relaciones
      { text: "Permanezco tranquilo y enfocado", type: "S" }, // Energía
      { text: "Profundizo en los detalles para asegurar calidad", type: "C" }, // Enfoque
    ],
  },
  {
    id: 4,
    question: "Mi mayor fortaleza es...",
    options: [
      { text: "Mi capacidad para ejecutar y lograr objetivos", type: "D" }, // Plan Ejecutivo
      { text: "Mi capacidad para conectar y influir en otros", type: "I" }, // Relaciones
      { text: "Mi consistencia y confiabilidad", type: "S" }, // Energía
      { text: "Mi atención al detalle y precisión", type: "C" }, // Enfoque
    ],
  },
  {
    id: 5,
    question: "Prefiero trabajar con personas que sean...",
    options: [
      { text: "Directas y enfocadas en resultados", type: "D" }, // Plan Ejecutivo
      { text: "Optimistas y conectadas socialmente", type: "I" }, // Relaciones
      { text: "Cooperativas y estables", type: "S" }, // Energía
      { text: "Rigurosas y basadas en hechos", type: "C" }, // Enfoque
    ],
  },
  {
    id: 6,
    question: "En mi equipo, soy conocido por ser...",
    options: [
      { text: "El que impulsa la acción y cierra deals", type: "D" }, // Plan Ejecutivo
      { text: "El que levanta energía y crea ambiente", type: "I" }, // Relaciones
      { text: "El que mantiene la estabilidad del grupo", type: "S" }, // Energía
      { text: "El que garantiza los estándares de calidad", type: "C" }, // Enfoque
    ],
  },
  {
    id: 7,
    question: "Lo que más me motiva es...",
    options: [
      { text: "Ganar y lograr objetivos ambiciosos", type: "D" }, // Plan Ejecutivo
      { text: "Impactar positivamente en otros", type: "I" }, // Relaciones
      { text: "Contribuir de forma consistente", type: "S" }, // Energía
      { text: "Hacer las cosas bien y correctamente", type: "C" }, // Enfoque
    ],
  },
  {
    id: 8,
    question: "Mi desafío principal es...",
    options: [
      { text: "A veces puedo ser muy impulsivo", type: "D" }, // Plan Ejecutivo
      { text: "A veces me disperso en demasiadas cosas", type: "I" }, // Relaciones
      { text: "A veces me cuesta adaptarme al cambio", type: "S" }, // Energía
      { text: "A veces soy muy exigente con los detalles", type: "C" }, // Enfoque
    ],
  },
]

type Step = "intro" | "camino" | "test" | "results"
type SelectionType = "most" | "least"

export default function DespegaOnboarding() {
  const [step, setStep] = useState<Step>("intro")
  const [caminoPersona, setCaminoPersona] = useState(false)
  const [caminoProfesional, setCaminoProfesional] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<Record<number, { most: number; least: number }>>({})
  const [results, setResults] = useState<{
    D: number
    I: number
    S: number
    C: number
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
  const currentResponse = responses[question.id]
  const isAnswered = currentResponse && currentResponse.most !== undefined && currentResponse.least !== undefined
  const canSelectLeast = currentResponse?.most !== undefined && currentResponse.most !== currentResponse.least

  const handleSelect = (optionIndex: number, type: SelectionType) => {
    const existing = responses[question.id] || { most: undefined, least: undefined }
    const updated = { ...existing, [type]: optionIndex }
    
    // Evitar seleccionar la misma opción para both
    if (updated.most === updated.least && updated.least !== undefined) {
      return
    }
    
    setResponses({ ...responses, [question.id]: updated })
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
      D: 0, // Plan Ejecutivo
      I: 0, // Relaciones
      S: 0, // Energía
      C: 0, // Enfoque
    }

    // Contar respuestas: +1 por "most", -1 por "least"
    TEST_A1_QUESTIONS.forEach((q) => {
      const response = responses[q.id]
      if (response) {
        const mostOption = q.options[response.most]
        const leastOption = q.options[response.least]
        
        if (mostOption) {
          scores[mostOption.type as keyof typeof scores]++
        }
        if (leastOption) {
          scores[leastOption.type as keyof typeof scores]--
        }
      }
    })

    // Normalizar a 0-100 (rango esperado: -16 a +16)
    const normalize = (score: number) => {
      return Math.max(0, Math.min(100, ((score + 16) / 32) * 100))
    }

    const normalizedScores = {
      D: normalize(scores.D),
      I: normalize(scores.I),
      S: normalize(scores.S),
      C: normalize(scores.C),
    }

    const total = (normalizedScores.D + normalizedScores.I + normalizedScores.S + normalizedScores.C) / 4
    
    // Determinar nivel
    let nivel = "Equilibrado"
    if (total > 75) nivel = "Alto"
    else if (total > 50) nivel = "Moderado"
    else nivel = "Por Desarrollar"

    setResults({
      D: normalizedScores.D,
      I: normalizedScores.I,
      S: normalizedScores.S,
      C: normalizedScores.C,
      total,
      nivel,
    })

    // Save to database
    if (userId) {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        const userEmail = authUser?.email

        // Create user profile
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

        // Save test results
        const scoreTotalPercentage = Math.round(total)
        const resultados = {
          D: Math.round(normalizedScores.D),
          I: Math.round(normalizedScores.I),
          S: Math.round(normalizedScores.S),
          C: Math.round(normalizedScores.C),
          energia: Math.round(normalizedScores.S), // S = Energía
          enfoque: Math.round(normalizedScores.C), // C = Enfoque
          relaciones: Math.round(normalizedScores.I), // I = Relaciones
          plan_ejecutivo: Math.round(normalizedScores.D), // D = Plan Ejecutivo
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
        }

        // Save to unified_test_results
        if (userEmail) {
          const { error: unifiedError } = await supabase.from("unified_test_results").insert({
            user_email: userEmail,
            test_type: "despega_cerebral",
            test_results: resultados,
          })
          if (unifiedError) {
            console.error("[v0] Error saving to unified_test_results:", unifiedError.message)
          }
        }

        // Initialize pilar progress
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

        // Initialize rankings
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
        }
      } catch (error) {
        console.error("[v0] Error saving onboarding data:", error)
      } finally {
        setLoading(false)
        setStep("results")
      }
    } else {
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
                Descubre tu perfil DISC en 2 minutos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Este test evalúa 4 dimensiones clave de tu comportamiento profesional:
                </p>
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <span className="text-orange-600 font-bold">D</span>
                    <div>
                      <p className="font-semibold">Dominio (Plan Ejecutivo)</p>
                      <p className="text-sm text-muted-foreground">Tu capacidad para decidir y ejecutar</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-purple-600 font-bold">I</span>
                    <div>
                      <p className="font-semibold">Influencia (Relaciones)</p>
                      <p className="text-sm text-muted-foreground">Tu capacidad para conectar e influir</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-600 font-bold">S</span>
                    <div>
                      <p className="font-semibold">Steadiness (Energía)</p>
                      <p className="text-sm text-muted-foreground">Tu capacidad para mantener calma</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-600 font-bold">C</span>
                    <div>
                      <p className="font-semibold">Conscientiousness (Enfoque)</p>
                      <p className="text-sm text-muted-foreground">Tu atención al detalle y calidad</p>
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
                
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground">Selecciona cuál TE DESCRIBE MÁS:</p>
                  <div className="space-y-2 mb-6">
                    {question.options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelect(idx, "most")}
                        className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                          currentResponse?.most === idx
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-950 ring-2 ring-blue-300"
                            : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                        }`}
                      >
                        <p className="font-medium text-sm">{option.text}</p>
                      </button>
                    ))}
                  </div>

                  <p className="text-xs font-semibold text-muted-foreground">Selecciona cuál TE DESCRIBE MENOS:</p>
                  <div className="space-y-2">
                    {question.options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelect(idx, "least")}
                        disabled={!canSelectLeast || currentResponse?.most === idx}
                        className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                          currentResponse?.least === idx
                            ? "border-red-500 bg-red-50 dark:bg-red-950 ring-2 ring-red-300"
                            : currentResponse?.most === idx || !canSelectLeast
                            ? "border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 opacity-50 cursor-not-allowed"
                            : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                        }`}
                      >
                        <p className="font-medium text-sm">{option.text}</p>
                      </button>
                    ))}
                  </div>
                </div>
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
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Tu Perfil DISC Despega Cerebral</CardTitle>
                <CardDescription className="text-center">
                  Score General: <span className="text-2xl font-bold text-blue-600">{Math.round(results.total)}%</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* D - Dominance */}
                <div className="p-4 rounded-lg border border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-900">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-orange-900 dark:text-orange-100">D - Dominio (Plan Ejecutivo)</h4>
                    <span className="text-sm font-bold text-orange-600 dark:text-orange-400">{Math.round(results.D)}%</span>
                  </div>
                  <Progress value={results.D} className="h-2" />
                  <p className="text-sm text-orange-800 dark:text-orange-200 mt-2">
                    {results.D > 75 ? "Decisivo y orientado a resultados" : results.D > 50 ? "Moderadamente decidido" : "Necesitas mayor decisión"}
                  </p>
                </div>

                {/* I - Influence */}
                <div className="p-4 rounded-lg border border-purple-200 bg-purple-50 dark:bg-purple-950 dark:border-purple-900">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-purple-900 dark:text-purple-100">I - Influencia (Relaciones)</h4>
                    <span className="text-sm font-bold text-purple-600 dark:text-purple-400">{Math.round(results.I)}%</span>
                  </div>
                  <Progress value={results.I} className="h-2" />
                  <p className="text-sm text-purple-800 dark:text-purple-200 mt-2">
                    {results.I > 75 ? "Carismático e inspirador" : results.I > 50 ? "Buscas conectar" : "Necesitas desarrollar influencia"}
                  </p>
                </div>

                {/* S - Steadiness */}
                <div className="p-4 rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-900">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100">S - Steadiness (Energía)</h4>
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{Math.round(results.S)}%</span>
                  </div>
                  <Progress value={results.S} className="h-2" />
                  <p className="text-sm text-blue-800 dark:text-blue-200 mt-2">
                    {results.S > 75 ? "Calmado y consistente" : results.S > 50 ? "Buscas equilibrio" : "Necesitas mayor estabilidad"}
                  </p>
                </div>

                {/* C - Conscientiousness */}
                <div className="p-4 rounded-lg border border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-900">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-green-900 dark:text-green-100">C - Conscientiousness (Enfoque)</h4>
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">{Math.round(results.C)}%</span>
                  </div>
                  <Progress value={results.C} className="h-2" />
                  <p className="text-sm text-green-800 dark:text-green-200 mt-2">
                    {results.C > 75 ? "Analítico y riguroso" : results.C > 50 ? "Buscas precisión" : "Necesitas desarrollar rigor"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Action Button */}
            <div className="text-center">
              <Button
                onClick={() => router.push("/dashboard")}
                className="h-12 text-base font-semibold px-8"
              >
                Ir a Mi Dashboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
