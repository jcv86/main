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
  const [loadingInsights, setLoadingInsights] = useState(false)
  const [insights, setInsights] = useState<any>(null)
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
        
        // Generar insights con IA en background después de mostrar resultados
        if (userId && results) {
          generateAIInsights(userId, results)
        }
      }
    } else {
      setLoading(false)
      setStep("results")
      
      // Generar insights sin userId si no hay autenticación
      if (results) {
        generateAIInsights(null, results)
      }
    }
  }

  const generateAIInsights = async (userId: string | null, testResults: any) => {
    console.log("[v0] Starting AI insights generation with:", { userId, testResults })
    setLoadingInsights(true)
    try {
      const payload = {
        testType: "despega_cerebral",
        results: testResults,
        userId: userId || "anonymous",
        testResponses: responses,
      }
      console.log("[v0] Sending payload to /api/post-test-insights-simple:", payload)

      // Try simple endpoint first
      const response = await fetch("/api/post-test-insights-simple", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      console.log("[v0] API response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[v0] API error response:", errorText)
        return
      }

      const data = await response.json()
      console.log("[v0] AI Insights received:", data)
      setInsights(data)
    } catch (error) {
      console.error("[v0] Error generating AI insights:", error)
    } finally {
      setLoadingInsights(false)
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

        {/* RESULTS STEP - Professional Report */}
        {step === "results" && results && (
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* PORTADA */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
              <CardContent className="pt-12 pb-12 text-center">
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold text-blue-900 dark:text-blue-100">INFORME DESPEGA CEREBRAL</h1>
                  <p className="text-lg text-blue-700 dark:text-blue-200">Perfil de Comportamiento DISC</p>
                  <div className="pt-4 border-t-2 border-blue-300 dark:border-blue-700 mt-6">
                    <p className="text-sm text-blue-600 dark:text-blue-400">Usuario: <span className="font-semibold">{session?.user?.email || "Usuario"}</span></p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">Fecha: <span className="font-semibold">{new Date().toLocaleDateString("es-ES")}</span></p>
                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">Score General: <span className="text-2xl font-bold text-blue-700">{Math.round(results.total)}%</span></p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* TABLA DE PUNTUACIONES */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Tus Puntuaciones DISC</CardTitle>
                <CardDescription>Análisis de los cuatro estilos de comportamiento</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* D - Dominance */}
                <div className="p-4 rounded-lg border border-orange-200 bg-orange-50 dark:bg-orange-950">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h4 className="font-bold text-orange-900 dark:text-orange-100">D - Dominio</h4>
                      <p className="text-xs text-orange-700 dark:text-orange-300">Orientación a resultados y decisión</p>
                    </div>
                    <span className="text-2xl font-bold text-orange-600">{Math.round(results.D)}%</span>
                  </div>
                  <Progress value={results.D} className="h-2" />
                </div>

                {/* I - Influence */}
                <div className="p-4 rounded-lg border border-purple-200 bg-purple-50 dark:bg-purple-950">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h4 className="font-bold text-purple-900 dark:text-purple-100">I - Influencia</h4>
                      <p className="text-xs text-purple-700 dark:text-purple-300">Motivación y conexión con personas</p>
                    </div>
                    <span className="text-2xl font-bold text-purple-600">{Math.round(results.I)}%</span>
                  </div>
                  <Progress value={results.I} className="h-2" />
                </div>

                {/* S - Steadiness */}
                <div className="p-4 rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-950">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h4 className="font-bold text-blue-900 dark:text-blue-100">S - Estabilidad</h4>
                      <p className="text-xs text-blue-700 dark:text-blue-300">Serenidad y apoyo consistente</p>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">{Math.round(results.S)}%</span>
                  </div>
                  <Progress value={results.S} className="h-2" />
                </div>

                {/* C - Conscientiousness */}
                <div className="p-4 rounded-lg border border-green-200 bg-green-50 dark:bg-green-950">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h4 className="font-bold text-green-900 dark:text-green-100">C - Consciencia</h4>
                      <p className="text-xs text-green-700 dark:text-green-300">Rigor, precisión y cumplimiento</p>
                    </div>
                    <span className="text-2xl font-bold text-green-600">{Math.round(results.C)}%</span>
                  </div>
                  <Progress value={results.C} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* ASÍ ES TU FORMA NATURAL DE ACTUAR */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Así es tu forma natural de actuar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200">
                    <p className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Tu estilo predominante:</p>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      {results.D > results.I && results.D > results.S && results.D > results.C
                        ? "Actúas con decisión y enfoque en resultados. Vas directo al objetivo, prefieres la velocidad y la eficiencia. Eres directo en la comunicación y buscas soluciones rápidas."
                        : results.I > results.D && results.I > results.S && results.I > results.C
                        ? "Actúas motivando y conectando con otros. Eres natural persuadiendo y generando entusiasmo. Tu carisma es tu fortaleza en cualquier equipo."
                        : results.S > results.D && results.S > results.I && results.S > results.C
                        ? "Actúas buscando estabilidad y apoyo continuo. Eres confiable, consistente y apoyas a otros sin necesidad de reconocimiento. Tu fortaleza es la constancia."
                        : "Actúas con análisis y precisión. Prefieres verificar antes de actuar, buscas exactitud en cada detalle. Tu rigor es tu gran contribución."}
                    </p>
                  </div>

                  <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200">
                    <p className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">⚠️ Lo que puede incomodarte:</p>
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      {results.D > results.I && results.D > results.S && results.D > results.C
                        ? "Ambigüedad, procesos lentos, falta de claridad en objetivos. Te incomoda perder tiempo en detalles innecesarios."
                        : results.I > results.D && results.I > results.S && results.I > results.C
                        ? "Trabajo rutinario, entornos sin interacción social, crítica directa. Te desmotiva la soledad o la falta de reconocimiento."
                        : results.S > results.D && results.S > results.I && results.S > results.C
                        ? "Cambios abruptos, presión excesiva, ambientes caóticos. Te incomoda la incertidumbre y la falta de estructura."
                        : "Improvisación, errores, falta de exactitud. Te incomoda trabajar sin datos o con información incompleta."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* TUS FORTALEZAS */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Tus fortalezas visibles y cómo conectas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-bold text-lg">Lo que sabes hacer bien</h4>
                    <ul className="space-y-2">
                      <li className="flex gap-3">
                        <span className="text-blue-600 text-lg">✓</span>
                        <span className="text-sm">
                          {results.D > results.I && results.D > results.S && results.D > results.C
                            ? "Tomar decisiones rápidas bajo presión"
                            : results.I > results.D && results.I > results.S && results.I > results.C
                            ? "Motivar y inspirar a equipos hacia objetivos comunes"
                            : results.S > results.D && results.S > results.I && results.S > results.C
                            ? "Mantener consistencia y ser un apoyo confiable"
                            : "Garantizar calidad y exactitud en cada tarea"}
                        </span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-blue-600 text-lg">✓</span>
                        <span className="text-sm">
                          {results.D > results.I && results.D > results.S && results.D > results.C
                            ? "Alcanzar objetivos y lograr resultados medibles"
                            : results.I > results.D && results.I > results.S && results.I > results.C
                            ? "Construir redes y crear conexiones significativas"
                            : results.S > results.D && results.S > results.I && results.S > results.C
                            ? "Generar confianza y seguridad en el equipo"
                            : "Detectar errores antes de que escalen problemas"}
                        </span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-blue-600 text-lg">✓</span>
                        <span className="text-sm">
                          {results.D > results.I && results.D > results.S && results.D > results.C
                            ? "Liderar con confianza y autoría"
                            : results.I > results.D && results.I > results.S && results.I > results.C
                            ? "Comunicar de forma clara y persuasiva"
                            : results.S > results.D && results.S > results.I && results.S > results.C
                            ? "Apoyar a otros sin buscar reconocimiento"
                            : "Trabajar con precisión y estándares altos"}
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-bold text-lg">Así colaboras con otros</h4>
                    <ul className="space-y-2">
                      <li className="flex gap-3">
                        <span className="text-purple-600 text-lg">→</span>
                        <span className="text-sm">
                          {results.D > results.I && results.D > results.S && results.D > results.C
                            ? "Prefieres roles claros y autonomía"
                            : results.I > results.D && results.I > results.S && results.I > results.C
                            ? "Te conectas bien con equipos colaborativos"
                            : results.S > results.D && results.S > results.I && results.S > results.C
                            ? "Eres el pilar de estabilidad del equipo"
                            : "Colaboras mejor en roles técnicos especializados"}
                        </span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-purple-600 text-lg">→</span>
                        <span className="text-sm">
                          {results.D > results.I && results.D > results.S && results.D > results.C
                            ? "Te comunicas de forma directa y eficiente"
                            : results.I > results.D && results.I > results.S && results.I > results.C
                            ? "Creas un ambiente positivo y motivador"
                            : results.S > results.D && results.S > results.I && results.S > results.C
                            ? "Eres predecible y generas confianza"
                            : "Trabajas con precisión y documentación clara"}
                        </span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-purple-600 text-lg">→</span>
                        <span className="text-sm">
                          {results.D > results.I && results.D > results.S && results.D > results.C
                            ? "Respetas la competencia y los resultados"
                            : results.I > results.D && results.I > results.S && results.I > results.C
                            ? "Inspiras y elevas el ánimo del grupo"
                            : results.S > results.D && results.S > results.I && results.S > results.C
                            ? "Escuchas y entiendes las necesidades de otros"
                            : "Proporcionas análisis y perspectiva crítica"}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* OPORTUNIDADES DE CRECIMIENTO */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Oportunidades de crecimiento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200">
                    <h4 className="font-bold text-orange-900 dark:text-orange-100 mb-3">Para desarrollarte:</h4>
                    <ul className="space-y-2">
                      <li className="text-sm text-orange-800 dark:text-orange-200 flex gap-2">
                        <span>📌</span>
                        <span>
                          {results.D > results.I && results.D > results.S && results.D > results.C
                            ? "Practica escuchar activamente antes de decidir"
                            : results.I > results.D && results.I > results.S && results.I > results.C
                            ? "Desarrolla disciplina en seguimiento de detalles"
                            : results.S > results.D && results.S > results.I && results.S > results.C
                            ? "Aprende a tomar riesgos calculados"
                            : "Mejora tu comunicación más allá de lo formal"}
                        </span>
                      </li>
                      <li className="text-sm text-orange-800 dark:text-orange-200 flex gap-2">
                        <span>📌</span>
                        <span>
                          {results.D > results.I && results.D > results.S && results.D > results.C
                            ? "Cultiva empatía y considere perspectivas ajenas"
                            : results.I > results.D && results.I > results.S && results.I > results.C
                            ? "Fortalece tu capacidad analítica"
                            : results.S > results.D && results.S > results.I && results.S > results.C
                            ? "Desarrolla mayor assertividad"
                            : "Practica la delegación y confianza en otros"}
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200">
                    <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-3">Dónde puedes brillar:</h4>
                    <ul className="space-y-2">
                      <li className="text-sm text-blue-800 dark:text-blue-200 flex gap-2">
                        <span>⭐</span>
                        <span>
                          {results.D > results.I && results.D > results.S && results.D > results.C
                            ? "Roles de liderazgo y toma de decisiones estratégica"
                            : results.I > results.D && results.I > results.S && results.I > results.C
                            ? "Roles de comunicación, ventas y relaciones públicas"
                            : results.S > results.D && results.S > results.I && results.S > results.C
                            ? "Roles de soporte, coordinación y mentoring"
                            : "Roles técnicos, análisis y aseguramiento de calidad"}
                        </span>
                      </li>
                      <li className="text-sm text-blue-800 dark:text-blue-200 flex gap-2">
                        <span>⭐</span>
                        <span>
                          {results.D > results.I && results.D > results.S && results.D > results.C
                            ? "Ambientes competitivos con objetivos claros"
                            : results.I > results.D && results.I > results.S && results.I > results.C
                            ? "Equipos colaborativos con interacción constante"
                            : results.S > results.D && results.S > results.I && results.S > results.C
                            ? "Entornos estables con procesos definidos"
                            : "Proyectos que requieran precisión y control de calidad"}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* LOADING INSIGHTS */}
            {loadingInsights && (
              <Card className="border-0 shadow-lg bg-blue-50 dark:bg-blue-950">
                <CardContent className="pt-6 pb-6">
                  <div className="flex items-center gap-3 justify-center">
                    <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                    <p className="text-sm text-blue-700 dark:text-blue-300">Generando recomendaciones personalizadas...</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* AI INSIGHTS */}
            {insights && (
              <>
                {insights.insights && insights.insights.length > 0 && (
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>Análisis Profundo Personalizado</CardTitle>
                      <CardDescription>Insights específicos basados en tu perfil</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {insights.insights.slice(0, 5).map((insight: any, idx: number) => (
                        <div key={idx} className="p-4 border rounded-lg bg-gradient-to-r from-transparent to-blue-50 dark:to-blue-950">
                          <div className="flex justify-between items-start gap-3 mb-2">
                            <h4 className="font-semibold text-sm">{insight.title}</h4>
                            <span className={`text-xs font-bold px-2 py-1 rounded ${
                              insight.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' :
                              insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300' :
                              'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
                            }`}>
                              {insight.priority.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-foreground">{insight.description}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {insights.recommendations && insights.recommendations.length > 0 && (
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>Recursos Recomendados</CardTitle>
                      <CardDescription>De nuestra biblioteca especializada</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {insights.recommendations.slice(0, 4).map((rec: any, idx: number) => (
                        <div key={idx} className="p-3 border rounded-lg">
                          <h4 className="font-semibold text-sm">{rec.title}</h4>
                          <p className="text-sm text-muted-foreground">{rec.description}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {/* CTA BUTTON */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-blue-700">
              <CardContent className="pt-8 pb-8 text-center">
                <h3 className="text-xl font-bold text-white mb-3">Tu análisis está listo</h3>
                <p className="text-blue-100 mb-6">Accede a tu dashboard para explorar tu perfil completo y comenzar tu viaje de desarrollo</p>
                <Button 
                  onClick={() => router.push("/dashboard")}
                  className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-6 text-base"
                >
                  Ir a Mi Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
