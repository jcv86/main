"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"
import { DiscResultsPage } from "@/components/disc-results-page"
import { DISC_TEST_QUESTIONS } from "@/lib/disc-test-questions"

type Step = "intro" | "instructions" | "camino" | "test" | "results"

export default function DespegaOnboarding() {
  const [step, setStep] = useState<Step>("intro")
  const [caminoPersona, setCaminoPersona] = useState(false)
  const [caminoProfesional, setCaminoProfesional] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<Record<number, { mas?: "D" | "I" | "S" | "C"; menos?: "D" | "I" | "S" | "C" }>>({})
  const [results, setResults] = useState<{
    D: number
    I: number
    S: number
    C: number
    dominantProfile: "D" | "I" | "S" | "C"
    secondaryProfile: "D" | "I" | "S" | "C"
    total: number
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const question = DISC_TEST_QUESTIONS[currentQuestion]
  const progress = ((currentQuestion + 1) / DISC_TEST_QUESTIONS.length) * 100
  const currentResponse = responses[question?.id] || {}
  const selectedMas = currentResponse.mas
  const selectedMenos = currentResponse.menos
  const bothSelected = selectedMas && selectedMenos

  const handleNext = () => {
    if (currentQuestion < DISC_TEST_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculateResults()
    }
  }

  const calculateResults = async () => {
    setLoading(true)
    
    const scores = { D: 0, I: 0, S: 0, C: 0 }

    DISC_TEST_QUESTIONS.forEach((q) => {
      const response = responses[q.id]
      if (response?.mas) scores[response.mas] += 2
      if (response?.menos) scores[response.menos] -= 1
    })

    const normalizedScores = {
      D: Math.max(0, Math.min(100, Math.round((scores.D + 56) / 1.12))),
      I: Math.max(0, Math.min(100, Math.round((scores.I + 56) / 1.12))),
      S: Math.max(0, Math.min(100, Math.round((scores.S + 56) / 1.12))),
      C: Math.max(0, Math.min(100, Math.round((scores.C + 56) / 1.12))),
    }

    const sorted = Object.entries(normalizedScores)
      .sort(([, a], [, b]) => b - a)
      .map(([key]) => key as "D" | "I" | "S" | "C")

    const finalResults = {
      ...normalizedScores,
      dominantProfile: sorted[0],
      secondaryProfile: sorted[1],
      total: (normalizedScores.D + normalizedScores.I + normalizedScores.S + normalizedScores.C) / 4,
    }
    
    setResults(finalResults)
    setStep("results")

    try {
      const response = await fetch("/api/despega/save-test-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dominantProfile: finalResults.dominantProfile,
          secondaryProfile: finalResults.secondaryProfile,
          scores: normalizedScores,
          caminoPersona,
          caminoProfesional,
        }),
      })

      console.log("[v0] Save response status:", response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log("[v0] Save response data:", data)
        setTimeout(() => {
          router.push("/dashboard?refetch=true")
        }, 2000)
      } else {
        const errorData = await response.json()
        console.error("[v0] Save failed with status", response.status, ":", errorData)
      }
    } catch (error) {
      console.error("[v0] Error saving test results:", error)
    }

    setLoading(false)
  }

  // STEP 1: Intro
  if (step === "intro") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Bienvenido a Despega Cerebral</CardTitle>
            <CardDescription className="text-lg mt-2">
              Descubre tu perfil de personalidad y comienza tu viaje de transformación personal y profesional.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-foreground">
                Este test te ayudará a revelarte tu perfil de personalidad y potencial de desarrollo a través de una evaluación personalizada.
              </p>
            </div>

            <Button onClick={() => setStep("instructions")} className="w-full" size="lg">
              Comenzar Mi Transición
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // STEP 2: Instrucciones
  if (step === "instructions") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2 mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              Cómo Funciona Este Test
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Tu viaje de autoconocimiento en 3 minutos
            </p>
          </div>

          {/* Section 1: Sin respuestas correctas */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-300 dark:border-blue-700 shadow-lg overflow-hidden">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="text-4xl">✓</div>
                <div className="space-y-2 flex-1">
                  <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100">Sin Respuestas Correctas</h3>
                  <p className="text-blue-800 dark:text-blue-200">
                    No hay buenas ni malas respuestas. Tu honestidad es lo único que importa. Responde según cómo REALMENTE eres, no como crees que deberías ser.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Responde rápidamente */}
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-300 dark:border-green-700 shadow-lg overflow-hidden">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="text-4xl">⚡</div>
                <div className="space-y-2 flex-1">
                  <h3 className="text-xl font-bold text-green-900 dark:text-green-100">Responde Rápidamente</h3>
                  <p className="text-green-800 dark:text-green-200">
                    Para cada pregunta: elige la opción que MÁS te describe y la que MENOS te describe. Tu primer instinto suele ser el más preciso.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Las 4 Dimensiones DISC */}
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-300 dark:border-purple-700 shadow-lg overflow-hidden">
            <CardContent className="pt-6 space-y-4">
              <div className="flex gap-4">
                <div className="text-4xl">🧠</div>
                <div>
                  <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100">Tu Perfil DISC en 4 Dimensiones</h3>
                  <p className="text-sm text-purple-800 dark:text-purple-200 mt-1">
                    Cada dimensión representa un estilo de personalidad único. Todos tenemos un poco de cada uno.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                {/* D */}
                <div className="p-4 bg-red-100 dark:bg-red-900/40 rounded-lg border-2 border-red-400 dark:border-red-600">
                  <div className="text-3xl mb-2">⚡</div>
                  <p className="font-bold text-red-900 dark:text-red-100 mb-1">D - Dominancia</p>
                  <p className="text-xs text-red-800 dark:text-red-200">Decisión, resultados, liderazgo</p>
                </div>

                {/* I */}
                <div className="p-4 bg-yellow-100 dark:bg-yellow-900/40 rounded-lg border-2 border-yellow-400 dark:border-yellow-600">
                  <div className="text-3xl mb-2">🌟</div>
                  <p className="font-bold text-yellow-900 dark:text-yellow-100 mb-1">I - Influencia</p>
                  <p className="text-xs text-yellow-800 dark:text-yellow-200">Entusiasmo, conexión, persuasión</p>
                </div>

                {/* S */}
                <div className="p-4 bg-green-100 dark:bg-green-900/40 rounded-lg border-2 border-green-400 dark:border-green-600">
                  <div className="text-3xl mb-2">🛡️</div>
                  <p className="font-bold text-green-900 dark:text-green-100 mb-1">S - Estabilidad</p>
                  <p className="text-xs text-green-800 dark:text-green-200">Paciencia, apoyo, consistencia</p>
                </div>

                {/* C */}
                <div className="p-4 bg-blue-100 dark:bg-blue-900/40 rounded-lg border-2 border-blue-400 dark:border-blue-600">
                  <div className="text-3xl mb-2">🔍</div>
                  <p className="font-bold text-blue-900 dark:text-blue-100 mb-1">C - Cumplimiento</p>
                  <p className="text-xs text-blue-800 dark:text-blue-200">Precisión, análisis, calidad</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Qué Obtendrás */}
          <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 border-indigo-300 dark:border-indigo-700 shadow-lg overflow-hidden">
            <CardContent className="pt-6 space-y-4">
              <div className="flex gap-4">
                <div className="text-4xl">🎁</div>
                <div className="space-y-2 flex-1">
                  <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-100">Qué Obtendrás</h3>
                  <div className="grid md:grid-cols-2 gap-2 mt-3">
                    <div className="p-3 bg-indigo-200/50 dark:bg-indigo-800/50 rounded border-l-4 border-indigo-600">
                      <p className="font-semibold text-indigo-900 dark:text-indigo-100">Tu Perfil Único</p>
                      <p className="text-xs text-indigo-800 dark:text-indigo-200">Descubre cómo eres naturalmente</p>
                    </div>
                    <div className="p-3 bg-indigo-200/50 dark:bg-indigo-800/50 rounded border-l-4 border-indigo-600">
                      <p className="font-semibold text-indigo-900 dark:text-indigo-100">Tus Fortalezas</p>
                      <p className="text-xs text-indigo-800 dark:text-indigo-200">Qué haces mejor que nadie</p>
                    </div>
                    <div className="p-3 bg-indigo-200/50 dark:bg-indigo-800/50 rounded border-l-4 border-indigo-600">
                      <p className="font-semibold text-indigo-900 dark:text-indigo-100">Áreas de Crecimiento</p>
                      <p className="text-xs text-indigo-800 dark:text-indigo-200">Dónde desarrollarte más</p>
                    </div>
                    <div className="p-3 bg-indigo-200/50 dark:bg-indigo-800/50 rounded border-l-4 border-indigo-600">
                      <p className="font-semibold text-indigo-900 dark:text-indigo-100">Plan Personalizado</p>
                      <p className="text-xs text-indigo-800 dark:text-indigo-200">Próximos pasos claros</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 5: After Test */}
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-300 dark:border-orange-700 shadow-lg overflow-hidden">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="text-4xl">📚</div>
                <div className="space-y-2 flex-1">
                  <h3 className="text-xl font-bold text-orange-900 dark:text-orange-100">Después del Test</h3>
                  <p className="text-orange-800 dark:text-orange-200">
                    Recibirás libros recomendados personalizados, un análisis profundo de tu perfil, y un plan de acción adaptado a tu estilo único.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="space-y-4 pt-4">
            <Button onClick={() => setStep("camino")} className="w-full h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all rounded-lg">
              Entendido, Comenzar Mi Test
            </Button>
            <p className="text-center text-sm text-slate-600 dark:text-slate-400">
              ⏱️ Tiempo estimado: 3 minutos | 100% Honestidad = 100% Precisión
            </p>
          </div>
        </div>
      </div>
    )
  }

  // STEP 3: Selector de Camino
  if (step === "camino") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Elige Tu Camino</CardTitle>
            <CardDescription>
              Selecciona los aspectos de tu vida en los que deseas crecer.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div 
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  caminoPersona ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                }`}
                onClick={() => setCaminoPersona(!caminoPersona)}
              >
                <div className="flex items-start gap-3">
                  <Checkbox checked={caminoPersona} />
                  <div>
                    <h3 className="font-semibold text-lg">Transición Personal</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Autoconocimiento, hábitos y relaciones significativas.
                    </p>
                  </div>
                </div>
              </div>

              <div 
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  caminoProfesional ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                }`}
                onClick={() => setCaminoProfesional(!caminoProfesional)}
              >
                <div className="flex items-start gap-3">
                  <Checkbox checked={caminoProfesional} />
                  <div>
                    <h3 className="font-semibold text-lg">Transición Profesional</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Carrera, enfoque y excelencia profesional.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              onClick={() => setStep("test")} 
              className="w-full" 
              size="lg"
              disabled={!caminoPersona && !caminoProfesional}
            >
              Continuar al Test
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // STEP 3: Test
  if (step === "test") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-3xl">
          <CardHeader>
            <div className="space-y-4">
              <div>
                <CardTitle>Tu Perfil de Personalidad</CardTitle>
                <CardDescription>
                  Para cada pregunta, elige cómo eres REALMENTE en la mayoría de las situaciones
                </CardDescription>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                <p className="text-xs text-foreground">
                  💡 <strong>Recuerda:</strong> No hay respuestas correctas. Sé honesto contigo mismo para obtener un análisis preciso.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Pregunta {currentQuestion + 1} de {DISC_TEST_QUESTIONS.length}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            <h3 className="text-lg font-semibold text-center">{question?.pregunta}</h3>

            <div className="grid md:grid-cols-2 gap-6">
              {/* MÁS COMO YO */}
              <div className="space-y-3">
                <h4 className="font-semibold text-green-700 bg-green-50 p-3 rounded">
                  ✓ MÁS como yo
                </h4>
                <div className="space-y-2">
                  {question?.opciones.map((option) => (
                    <div
                      key={option.texto}
                      onClick={() =>
                        setResponses({
                          ...responses,
                          [question.id]: { ...currentResponse, mas: option.dimension },
                        })
                      }
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedMas === option.dimension
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-green-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          selectedMas === option.dimension
                            ? "border-green-500 bg-green-500"
                            : "border-gray-300"
                        }`}>
                          {selectedMas === option.dimension && (
                            <span className="text-white text-sm">✓</span>
                          )}
                        </div>
                        <span className="text-sm">{option.texto}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* MENOS COMO YO */}
              <div className="space-y-3">
                <h4 className="font-semibold text-red-700 bg-red-50 p-3 rounded">
                  ✗ MENOS como yo
                </h4>
                <div className="space-y-2">
                  {question?.opciones.map((option) => (
                    <div
                      key={option.texto}
                      onClick={() =>
                        setResponses({
                          ...responses,
                          [question.id]: { ...currentResponse, menos: option.dimension },
                        })
                      }
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedMenos === option.dimension
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200 hover:border-red-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          selectedMenos === option.dimension
                            ? "border-red-500 bg-red-500"
                            : "border-gray-300"
                        }`}>
                          {selectedMenos === option.dimension && (
                            <span className="text-white text-sm">✗</span>
                          )}
                        </div>
                        <span className="text-sm">{option.texto}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              {currentQuestion > 0 && (
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentQuestion(currentQuestion - 1)}
                  className="flex-1"
                >
                  Anterior
                </Button>
              )}
              <Button 
                onClick={handleNext}
                disabled={!bothSelected || loading}
                className="flex-1"
              >
                {currentQuestion === DISC_TEST_QUESTIONS.length - 1 ? "Ver Resultados" : "Siguiente"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // STEP 4: Results
  if (step === "results" && results) {
    return (
      <DiscResultsPage
        results={results}
        caminoPersona={caminoPersona}
        caminoProfesional={caminoProfesional}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Cargando...</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Por favor, espera.</p>
        </CardContent>
      </Card>
    </div>
  )
}
