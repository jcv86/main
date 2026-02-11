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

type Step = "intro" | "camino" | "test" | "results"

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

  const question = DISC_TEST_QUESTIONS[currentQuestion]
  const progress = ((currentQuestion + 1) / DISC_TEST_QUESTIONS.length) * 100

  const handleNext = () => {
    if (currentQuestion < DISC_TEST_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculateResults()
    }
  }

  const calculateResults = async () => {
    setLoading(true)
    
    // Calculate raw scores from responses
    // MÁS = +2 points, MENOS = -1 point
    const scores = { D: 0, I: 0, S: 0, C: 0 }

    DISC_TEST_QUESTIONS.forEach((q) => {
      const response = responses[q.id]
      if (response?.mas) scores[response.mas] += 2
      if (response?.menos) scores[response.menos] -= 1
    })

    console.log("[v0] Raw scores before normalization:", scores)

    // Normalize to 0-100 scale
    // Formula: (score + 50) / 100 * 100 ensures center point at 50
    // This creates a balanced scale where 50 is neutral
    const normalizedScores = {
      D: Math.max(0, Math.min(100, Math.round((scores.D + 56) / 1.12))),
      I: Math.max(0, Math.min(100, Math.round((scores.I + 56) / 1.12))),
      S: Math.max(0, Math.min(100, Math.round((scores.S + 56) / 1.12))),
      C: Math.max(0, Math.min(100, Math.round((scores.C + 56) / 1.12))),
    }

    console.log("[v0] Normalized scores (0-100):", normalizedScores)

    // Find dominant and secondary profiles based on highest scores
    const sorted = Object.entries(normalizedScores)
      .sort(([, a], [, b]) => b - a)
      .map(([key]) => key as "D" | "I" | "S" | "C")

    const finalResults = {
      ...normalizedScores,
      dominantProfile: sorted[0],
      secondaryProfile: sorted[1],
      total: (normalizedScores.D + normalizedScores.I + normalizedScores.S + normalizedScores.C) / 4,
    }
    
    console.log("[v0] Final results:", finalResults)
    console.log("[v0] Dominant profile:", finalResults.dominantProfile, "Score:", finalResults[finalResults.dominantProfile])
    console.log("[v0] Secondary profile:", finalResults.secondaryProfile, "Score:", finalResults[finalResults.secondaryProfile])
    
    setResults(finalResults)
    setStep("results")
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

            <Button onClick={() => setStep("camino")} className="w-full" size="lg">
              Comenzar Mi Transición
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // STEP 2: Selector de Camino
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
    const currentResponse = responses[question.id] || {}
    const selectedMas = currentResponse.mas
    const selectedMenos = currentResponse.menos
    const bothSelected = selectedMas && selectedMenos

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-3xl">
          <CardHeader>
            <div className="space-y-4">
              <div>
                <CardTitle>Tu Perfil DISC</CardTitle>
                <CardDescription>
                  Elige la opción que MÁS te describe y la que MENOS te describe
                </CardDescription>
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
            <h3 className="text-lg font-semibold text-center">{question.pregunta}</h3>

            <div className="grid md:grid-cols-2 gap-6">
              {/* MÁS COMO YO */}
              <div className="space-y-3">
                <h4 className="font-semibold text-green-700 bg-green-50 p-3 rounded">
                  ✓ MÁS como yo
                </h4>
                <div className="space-y-2">
                  {question.opciones.map((option) => (
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
                  {question.opciones.map((option) => (
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
                disabled={!bothSelected}
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

  // Fallback
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Procesando...</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Por favor, espera.</p>
        </CardContent>
      </Card>
    </div>
  )
}
