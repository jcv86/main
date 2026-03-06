"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { DiscResultsPage } from "@/components/disc-results-page"
import { DISC_TEST_QUESTIONS } from "@/lib/disc-test-questions"

type Step = "intro" | "instructions" | "conozcamonos1" | "camino" | "test" | "results" | "conozcamonos2-paso1" | "conozcamonos2-paso2"

export default function DespegaOnboarding() {
  const [step, setStep] = useState<Step>("intro")
  const [loading, setLoading] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [c1CurrentQuestion, setC1CurrentQuestion] = useState(0)
  const [c2Paso1Question, setC2Paso1Question] = useState(0)
  const [c2Paso2Question, setC2Paso2Question] = useState(0)
  const [c2Paso1Loading, setC2Paso1Loading] = useState(false)
  const [responses, setResponses] = useState<Record<number, string>>({})
  const [results, setResults] = useState<any>(null)
  const [onboardingAlreadyCompleted, setOnboardingAlreadyCompleted] = useState(false)
  const [isFirstCompletion, setIsFirstCompletion] = useState(true)
  const [skipConozcamonos, setSkipConozcamonos] = useState(false)
  const [c1Responses, setC1Responses] = useState<Record<number, string>>({})
  const [c2Step1Responses, setC2Step1Responses] = useState<Record<number, string>>({})
  const [c2Step2Responses, setC2Step2Responses] = useState<Record<number, string>>({})

  // Check if user already completed onboarding
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Check if C2-Paso2 is completed (user fully onboarded)
        const { data: c2Data } = await supabase
          .from("canon_conozcamonos_2_responses")
          .select("*")
          .eq("user_id", user.id)
          .eq("paso", 2)
          .limit(1)

        if (c2Data && c2Data.length > 0) {
          console.log("[v0] User fully completed onboarding, redirecting to dashboard with route")
          // User is fully onboarded - redirect to dashboard where route should be generated
          router.push("/despega")
          return
        }

        // Look for existing test results (A1 completed but not C2)
        const { data: results } = await supabase
          .from("a1_tests_results")
          .eq("user_id", user.id)
          .eq("test_name", "Despega Cerebral")
          .limit(1)

        if (results && results.length > 0) {
          console.log("[v0] User completed A1 test, checking C2 status...")
          
          // Check if C2-Paso1 is completed
          const { data: c2Paso1 } = await supabase
            .from("canon_conozcamonos_2_responses")
            .select("*")
            .eq("user_id", user.id)
            .eq("paso", 1)
            .limit(1)

          if (c2Paso1 && c2Paso1.length > 0) {
            console.log("[v0] User completed C2-Paso1, jumping to C2-Paso2")
            setOnboardingAlreadyCompleted(true)
            setStep("conozcamonos2-paso2")
          } else {
            console.log("[v0] User completed A1, jumping to C2-Paso1")
            setOnboardingAlreadyCompleted(true)
            setStep("conozcamonos2-paso1")
          }
        }
      } catch (error) {
        console.error("[v0] Error checking onboarding status:", error)
      } finally {
        setLoading(false)
      }
    }

    checkStatus()
  }, [router])

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
    
    console.log("[v0] Calculated results:", finalResults)
    setResults(finalResults)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      // Mark cerebral test as completed in a1_progress
      if (user) {
        const { error } = await supabase
          .from("a1_progress")
          .update({ cerebral_completed: true })
          .eq("user_id", user.id)
        
        if (error) {
          console.error("[v0] Error marking cerebral as completed:", error)
        }
      }

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

      if (response.ok) {
        const data = await response.json()
        console.log("[v0] Test results saved successfully")
        // Set step to results to show the results page
        setStep("results")
      } else {
        const errorData = await response.json()
        console.error("[v0] Error saving test results:", errorData)
        // Still show results even if save failed
        setStep("results")
      }
    } catch (error) {
      console.error("[v0] Error in calculateResults:", error)
      // Still show results even if error
      setStep("results")
    }

    setLoading(false)
  }

  // STEP 1: Intro - Despega Cerebral
  if (step === "intro") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 p-4 overflow-y-auto">
        <div className="max-w-3xl mx-auto py-12 space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-slate-50 leading-tight">
                Despega Cerebral
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-400">
                Tu punto de partida en DespegaTuCarrera
              </p>
            </div>
          </div>

          {/* Main Content */}
          <Card className="border-0 shadow-lg bg-white dark:bg-slate-900">
            <CardContent className="pt-8 space-y-6">
              <div className="space-y-4">
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                  Antes de hablar de metas, decisiones o próximos pasos, necesitamos entender algo más profundo: <strong>tu patrón natural de acción</strong>.
                </p>
                
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Todos tenemos una forma particular de movernos frente a desafíos, cambios, presión y oportunidades. No es una etiqueta. No es una caja. <strong>Es un patrón.</strong>
                </p>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 my-4">
                  <p className="text-slate-700 dark:text-slate-300">
                    En las próximas 28 preguntas explorarás cómo tiendes a actuar cuando nadie te está mirando, cuando decides rápido, cuando dudas o cuando lideras.
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-slate-600 dark:text-slate-400">
                    ✓ No hay respuestas correctas o incorrectas.
                  </p>
                  <p className="text-slate-600 dark:text-slate-400">
                    ✓ No hay perfiles mejores que otros.
                  </p>
                  <p className="text-slate-600 dark:text-slate-400">
                    ✓ Existen distintos patrones naturales de acción.
                  </p>
                </div>

                <p className="text-slate-700 dark:text-slate-300 italic pt-2">
                  En unos minutos descubrirás cuál describe mejor tu forma de moverte en el mundo.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Why Start Here Section */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
              <CardContent className="pt-8">
                <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-3">¿Qué es Despega Cerebral?</h3>
                <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                  Es la base de tu recorrido dentro de DespegaTuCarrera. Se inspira en marcos conductuales ampliamente estudiados, pero no busca encasillarte.
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed mt-3">
                  Su objetivo es identificar tendencias de comportamiento que influyen en cómo tomas decisiones, enfrentas conflictos, lideras o colaboras.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900">
              <CardContent className="pt-8">
                <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-100 mb-3">¿Por qué empezar por aquí?</h3>
                <p className="text-sm text-emerald-800 dark:text-emerald-200 leading-relaxed font-semibold">
                  Porque sin autoconocimiento, cualquier meta es aleatoria.
                </p>
                <p className="text-sm text-emerald-800 dark:text-emerald-200 leading-relaxed mt-3">
                  DespegaTuCarrera no parte por decirte qué hacer. Parte por ayudarte a entender cómo funcionas.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Key Instructions */}
          <Card className="border-0 shadow-lg bg-white dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-2xl">Indicaciones antes de comenzar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="text-2xl min-w-fit">1️⃣</div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">Responde con honestidad total</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">No pienses en cómo deberías ser, sino en cómo realmente actúas.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-2xl min-w-fit">2️⃣</div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">Tu primer impulso es el más preciso</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">No pienses demasiado en las opciones. Tu instinto es lo más acertado.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-2xl min-w-fit">3️⃣</div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">Este es tu punto de partida</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Primero claridad. Luego dirección.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="space-y-3">
            {onboardingAlreadyCompleted && !isFirstCompletion ? (
              <>
                <Button 
                  onClick={() => router.push("/despega/a1/resultado")} 
                  className="w-full h-14 text-base font-semibold shadow-lg hover:shadow-xl transition-all rounded-lg bg-blue-600 hover:bg-blue-700"
                >
                  Ver mi resultado
                </Button>
                <Button 
                  onClick={() => {
                    setStep("instructions")
                    setOnboardingAlreadyCompleted(false)
                    setIsFirstCompletion(true)
                  }} 
                  variant="outline"
                  className="w-full h-14 text-base font-semibold shadow-lg hover:shadow-xl transition-all rounded-lg"
                >
                  Repetir el test
                </Button>
              </>
            ) : (
              <Button onClick={() => setStep("instructions")} className="w-full h-14 text-base font-semibold shadow-lg hover:shadow-xl transition-all rounded-lg">
                Cuando estés listo, comienza
              </Button>
            )}
            <p className="text-center text-sm text-slate-600 dark:text-slate-400">
              ⏱️ Tiempo estimado: 3 minutos
            </p>
          </div>
        </div>
      </div>
    )
  }

  // STEP 2: Instrucciones Detalladas
  if (step === "instructions") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-8 pb-8">
          {/* Hero Section */}
          <div className="text-center space-y-3 py-8">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-50">
              Descubre Tu Perfil Despega Cerebral
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Entiende cómo actúas, cómo interactúas, y cómo impulsar tu mejor versión
            </p>
            <div className="flex justify-center gap-3 text-sm text-slate-600 dark:text-slate-400 pt-2">
              <span>⏱️ 3 minutos</span>
              <span>•</span>
              <span>📊 Resultados inmediatos</span>
              <span>•</span>
              <span>🎯 100% Preciso</span>
            </div>

            {onboardingAlreadyCompleted && (
              <div className="mt-6 p-4 bg-blue-100 border-l-4 border-blue-500 rounded">
                <p className="text-blue-800 font-semibold">
                  ✓ Ya has completado tu Despega Cerebral. Tus resultados están guardados.
                </p>
                <p className="text-blue-700 text-sm mt-2">
                  <Link href="/despega/journey" className="underline hover:text-blue-900 font-semibold">
                    Ver mi dashboard →
                  </Link>
                </p>
              </div>
            )}
          </div>

          {/* What is DISC */}
          <Card className="border-0 shadow-lg bg-white dark:bg-slate-900">
            <CardContent className="pt-8">
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-50">Tu Perfil Despega Cerebral</h2>
              <p className="text-slate-700 dark:text-slate-300 mb-4 text-lg leading-relaxed">
                En Despega, el test de personalidad identifica cómo actúas naturalmente en diferentes situaciones. Es como una brújula que te ayuda a entender tu estilo único de comunicación, trabajo y relaciones.
              </p>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Existen 4 perfiles principales: <strong>Impulsor, Catalizador, Estabilizador y Arquitecto</strong>. La mayoría de personas tiene un perfil dominante, pero todos tenemos un poco de cada uno en diferentes contextos.
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                <strong>Importante:</strong> No hay perfil mejor o peor. Cada uno tiene fortalezas únicas y valiosas. El objetivo es entenderte para maximizar tu potencial.
              </p>
            </CardContent>
          </Card>

          {/* The 4 Dimensions */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Los 4 Perfiles Despega Cerebral</h2>
            
            {/* D - Impulsor */}
            <Card className="border-l-8 border-l-red-500 shadow-lg overflow-hidden">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="md:col-span-1">
                    <div className="text-6xl mb-3">⚡</div>
                    <h3 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">D</h3>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">IMPULSOR</p>
                    <div className="w-8 h-1 bg-red-500 rounded mt-2"></div>
                  </div>
                  <div className="md:col-span-3 space-y-3">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Filosofía: Uso Activo de Fuerza</p>
                      <p className="text-slate-700 dark:text-slate-300">
                        Los Impulsores superan resistencias mediante acción directa y decisiva. Van hacia adelante con determinación.
                      </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded">
                        <p className="font-semibold text-red-900 dark:text-red-300 text-sm mb-1">Cómo Actúan</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">Orientados a resultados, decisiones rápidas, lideran con confianza, directos y eficientes</p>
                      </div>
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded">
                        <p className="font-semibold text-red-900 dark:text-red-300 text-sm mb-1">Fortalezas</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">Liderazgo, decisión, competencia, determinación, coraje, eficiencia</p>
                      </div>
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded">
                        <p className="font-semibold text-red-900 dark:text-red-300 text-sm mb-1">Motivación</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">Resultados, control, desafíos, ambientes dinámicos, autonomía</p>
                      </div>
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded">
                        <p className="font-semibold text-red-900 dark:text-red-300 text-sm mb-1">Ambiente Ideal</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">Liderazgo, emprendimiento, cambio, competencia, responsabilidad</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* I - Catalizador */}
            <Card className="border-l-8 border-l-yellow-500 shadow-lg overflow-hidden">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="md:col-span-1">
                    <div className="text-6xl mb-3">✨</div>
                    <h3 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">I</h3>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">CATALIZADOR</p>
                    <div className="w-8 h-1 bg-yellow-500 rounded mt-2"></div>
                  </div>
                  <div className="md:col-span-3 space-y-3">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Filosofía: Uso de Encanto</p>
                      <p className="text-slate-700 dark:text-slate-300">
                        Los Catalizadores superan obstáculos mediante carisma, persuasión y conexión genuina con otras personas.
                      </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                        <p className="font-semibold text-yellow-900 dark:text-yellow-300 text-sm mb-1">Cómo Actúan</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">Entusiastas, carismáticos, conectan fácilmente, optimistas, energéticos</p>
                      </div>
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                        <p className="font-semibold text-yellow-900 dark:text-yellow-300 text-sm mb-1">Fortalezas</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">Comunicación, entusiasmo, carisma, persuasión, energía positiva</p>
                      </div>
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                        <p className="font-semibold text-yellow-900 dark:text-yellow-300 text-sm mb-1">Motivación</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">Reconocimiento, interacción social, diversión, visibilidad</p>
                      </div>
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                        <p className="font-semibold text-yellow-900 dark:text-yellow-300 text-sm mb-1">Ambiente Ideal</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">Ventas, networking, equipo, creatividad, relaciones públicas</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* S - Estabilizador */}
            <Card className="border-l-8 border-l-green-500 shadow-lg overflow-hidden">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="md:col-span-1">
                    <div className="text-6xl mb-3">🌱</div>
                    <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">S</h3>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">ESTABILIZADOR</p>
                    <div className="w-8 h-1 bg-green-500 rounded mt-2"></div>
                  </div>
                  <div className="md:col-span-3 space-y-3">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Filosofía: Aceptación Voluntaria</p>
                      <p className="text-slate-700 dark:text-slate-300">
                        Los Estabilizadores aceptan voluntariamente los cambios con paciencia, apoyo y consistencia genuina.
                      </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded">
                        <p className="font-semibold text-green-900 dark:text-green-300 text-sm mb-1">Cómo Actúan</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">Confiables, pacientes, colaborativos, apoyan genuinamente, crean armonía</p>
                      </div>
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded">
                        <p className="font-semibold text-green-900 dark:text-green-300 text-sm mb-1">Fortalezas</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">Empatía, paciencia, loyalidad, consistencia, confiabilidad, trabajo en equipo</p>
                      </div>
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded">
                        <p className="font-semibold text-green-900 dark:text-green-300 text-sm mb-1">Motivación</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">Estabilidad, equipo, armonía, relaciones significativas, seguridad</p>
                      </div>
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded">
                        <p className="font-semibold text-green-900 dark:text-green-300 text-sm mb-1">Ambiente Ideal</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">Apoyo, servicio, coaching, ambientes estables, relaciones duraderas</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* C - Arquitecto */}
            <Card className="border-l-8 border-l-blue-500 shadow-lg overflow-hidden">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="md:col-span-1">
                    <div className="text-6xl mb-3">🏗️</div>
                    <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">C</h3>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">ARQUITECTO</p>
                    <div className="w-8 h-1 bg-blue-500 rounded mt-2"></div>
                  </div>
                  <div className="md:col-span-3 space-y-3">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Filosofía: Adaptación Cautelosa</p>
                      <p className="text-slate-700 dark:text-slate-300">
                        Los Arquitectos se adaptan cautelosamente, con precisión, análisis profundo y enfoque en excelencia.
                      </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                        <p className="font-semibold text-blue-900 dark:text-blue-300 text-sm mb-1">Cómo Actúan</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">Analíticos, precisos, orientados a calidad, detallistas, orientados a datos</p>
                      </div>
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                        <p className="font-semibold text-blue-900 dark:text-blue-300 text-sm mb-1">Fortalezas</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">Precisión, análisis, atención al detalle, planificación, calidad, pensamiento crítico</p>
                      </div>
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                        <p className="font-semibold text-blue-900 dark:text-blue-300 text-sm mb-1">Motivación</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">Precisión, datos, excelencia, estándares altos, competencia técnica</p>
                      </div>
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                        <p className="font-semibold text-blue-900 dark:text-blue-300 text-sm mb-1">Ambiente Ideal</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">Análisis, investigación, procesos claros, documentación, roles técnicos</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Points */}
          <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950 border-2 border-purple-300 dark:border-purple-700 shadow-lg">
            <CardContent className="pt-8">
              <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-50">Puntos Clave Importantes</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="text-2xl min-w-fit">✓</div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">Sin respuestas correctas</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">No hay perfil superior. Todos son igualmente valiosos y necesarios.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="text-2xl min-w-fit">✓</div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">Honestidad total</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Responde como REALMENTE eres, no como crees que deberías ser.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="text-2xl min-w-fit">✓</div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">Primer instinto</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Responde rápidamente. Tu instinto natural es lo más preciso.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="text-2xl min-w-fit">✓</div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">Estilo flexible</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Adaptamos nuestro estilo según el contexto y las personas.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What You'll Get */}
          <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border-2 border-emerald-300 dark:border-emerald-700 shadow-lg">
            <CardContent className="pt-8">
              <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-50">Qué Obtendrás de Este Test</h2>
              <div className="space-y-4">
                <div className="flex gap-4 p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg border-l-4 border-emerald-500">
                  <div className="text-3xl min-w-fit">📊</div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">Tu Perfil Personalizado</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Descubre tu estilo natural, tus fortalezas y áreas donde puedes crecer</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg border-l-4 border-teal-500">
                  <div className="text-3xl min-w-fit">🎯</div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">Insights Accionables</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Cómo comunicar mejor, trabajar más efectivamente y liderar según tu estilo</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg border-l-4 border-emerald-500">
                  <div className="text-3xl min-w-fit">📚</div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">Libros Recomendados</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Seleccionamos libros estratégicos adaptados a tu perfil para acelerar tu desarrollo</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg border-l-4 border-teal-500">
                  <div className="text-3xl min-w-fit">���</div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">Plan de Acción</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Pasos claros y concretos para tu transición profesional y personal</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="space-y-4 sticky bottom-0 bg-gradient-to-t from-slate-100 to-transparent dark:from-slate-900 dark:to-transparent pt-8 -mx-4 px-4 pb-4">
            <Button onClick={() => setStep("next-steps")} className="w-full h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all rounded-lg bg-gradient-to-r from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-600 dark:from-slate-100 dark:to-slate-300 dark:text-slate-900">
              Entiendo, Comenzar Mi Test
            </Button>
            <p className="text-center text-sm text-slate-600 dark:text-slate-400">
              Este test toma ~3 minutos. Responde con honestidad para resultados precisos.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // STEP 2.5: Lo que viene después
  if (step === "next-steps") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 flex items-center justify-center">
        <div className="max-w-2xl w-full space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-50">
              Lo que viene después
            </h1>
          </div>

          <Card className="border-0 shadow-lg bg-white dark:bg-slate-900">
            <CardContent className="pt-8 space-y-6">
              <div className="space-y-4">
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                  Despega Cerebral es el primer paso <strong>y la base de todo lo que viene después</strong>.
                </p>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    Una vez entiendas tu patrón, exploraremos juntos <strong>"Tu Dirección Clara"</strong>: no solo qué hacer, sino cómo avanzar según tu forma natural.
                  </p>
                </div>

                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Primero entendemos cómo funcionas. Luego construimos tu camino sobre eso.
                </p>
              </div>

              {/* Three pillars of direction clarity */}
              <div className="space-y-3 pt-4">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  "Tu Dirección Clara" incluye:
                </p>
                <div className="space-y-2">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="font-medium text-blue-900 dark:text-blue-100 text-sm mb-1">Tu Dirección Más Natural</p>
                    <p className="text-sm text-blue-800 dark:text-blue-200">El camino que mejor se alinea con cómo actúas</p>
                  </div>
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <p className="font-medium text-emerald-900 dark:text-emerald-100 text-sm mb-1">Posibles Direcciones Alineadas</p>
                    <p className="text-sm text-emerald-800 dark:text-emerald-200">Alternativas viables según tu perfil</p>
                  </div>
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                    <p className="font-medium text-amber-900 dark:text-amber-100 text-sm mb-1">Tu Forma de Avanzar con Claridad</p>
                    <p className="text-sm text-amber-800 dark:text-amber-200">Los pasos específicos para tu transición</p>
                  </div>
                </div>
              </div>

              {/* Why clarity matters */}
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 mt-4">
                <p className="text-sm font-semibold text-red-900 dark:text-red-100 mb-2">Por qué esto importa</p>
                <p className="text-sm text-red-800 dark:text-red-200">
                  Si alguien recibe un resultado y no siente "dirección clara", puede generar fricción. Por eso conectamos patrón + dirección + forma de avanzar.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="space-y-3 pt-4">
                <Button onClick={() => setStep("conozcamonos1")} className="w-full h-14 text-base font-semibold shadow-lg hover:shadow-xl transition-all rounded-lg bg-blue-600 hover:bg-blue-700">
                  Continuar con Conozcámonos
                </Button>
            <p className="text-center text-sm text-slate-600 dark:text-slate-400">
              El test dura ~3 minutos. Responde con total honestidad.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // STEP 2.5: Conozcámonos 1 - 7 preguntas pre-test para contextualizar
  if (step === "conozcamonos1") {
    const c1Questions = [
      { id: 1, q: "¿Cuál es tu situación laboral actual?", type: "select", opts: ["Empleado", "Independiente", "Desempleado", "Estudiante"] },
      { id: 2, q: "¿Años de experiencia profesional?", type: "select", opts: ["<1 año", "1-3", "3-5", "5-10", "10+"] },
      { id: 3, q: "¿Cuál es tu mayor desafío ahora?", type: "text" },
      { id: 4, q: "¿Tu objetivo para 90 días?", type: "text" },
      { id: 5, q: "¿Con quién vives?", type: "select", opts: ["Solo", "Pareja", "Familia", "Compañeros"] },
      { id: 6, q: "¿Cuánto tiempo diario para dedicar?", type: "select", opts: ["<30min", "30-60min", "1-2h", "2+ horas"] },
      { id: 7, q: "¿Qué tipo de apoyo necesitas?", type: "text" },
    ]
    
    const currentC1Q = c1Questions[c1CurrentQuestion]
    const c1Progress = ((c1CurrentQuestion + 1) / c1Questions.length) * 100

    const handleC1Next = () => {
      if (c1CurrentQuestion < c1Questions.length - 1) {
        setC1CurrentQuestion(c1CurrentQuestion + 1)
      } else {
        // NIVEL 4: Sanitize C1 responses before saving
        const sanitizeTextInput = (text: string, maxLength: number = 200): string => {
          if (!text) return ''
          // Remove URLs
          const urlRegex = /(https?:\/\/[^\s]+)/g
          let sanitized = text.replace(urlRegex, '')
          // Remove spam patterns
          const spamPatterns = /[!]{3,}|viagra|casino|poker/gi
          sanitized = sanitized.replace(spamPatterns, '')
          // Trim and limit
          return sanitized.trim().slice(0, maxLength)
        }

        const sanitizedResponses: Record<number, string> = {}
        Object.keys(c1Responses).forEach(key => {
          const val = c1Responses[parseInt(key)]
          if (typeof val === 'string') {
            sanitizedResponses[parseInt(key)] = sanitizeTextInput(val)
          } else {
            sanitizedResponses[parseInt(key)] = val
          }
        })

        // Save C1 responses to BD
        const saveC1 = async () => {
          try {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { error } = await supabase
              .from("canon_conozcamonos_1_responses")
              .insert({
                user_id: user.id,
                responses: sanitizedResponses,
                created_at: new Date().toISOString(),
              })

            if (error) {
              console.error("[v0] Error saving C1 responses:", error)
            } else {
              console.log("[v0] C1 responses saved successfully (sanitized)")
              setC1CurrentQuestion(0)
              setStep("test")
            }
          } catch (err) {
            console.error("[v0] Error in C1 save:", err)
          }
        }
        saveC1()
      }
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Conozcámonos - Contexto Inicial</CardTitle>
            <CardDescription>7 preguntas para personalizar tu experiencia</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Progress value={c1Progress} className="h-2" />
            <div className="space-y-4">
              <p className="text-lg font-semibold">{currentC1Q.q}</p>
              {currentC1Q.type === "select" ? (
                <div className="grid gap-2">
                  {currentC1Q.opts?.map((opt: string) => (
                    <Button 
                      key={opt}
                      variant="outline"
                      onClick={() => {
                        setC1Responses({ ...c1Responses, [currentC1Q.id]: opt })
                        handleC1Next()
                      }}
                      className="justify-start"
                    >
                      {opt}
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Tu respuesta..."
                    value={c1Responses[currentC1Q.id] || ""}
                    onChange={(e) => setC1Responses({ ...c1Responses, [currentC1Q.id]: e.target.value })}
                    className="w-full p-2 border rounded-md"
                  />
                  <Button 
                    onClick={handleC1Next}
                    className="w-full"
                  >
                    Siguiente
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // STEP 4: Mostrar Resultados del Test A1 - usando nuevo componente mejorado
  if (step === "results" && results) {
    return (
      <DiscResultsPage 
        results={results}
        c1Context={c1Responses}
        onContinue={() => {
          setC1CurrentQuestion(0)
          setStep("conozcamonos2-paso1")
        }}
      />
    )
  }

  // STEP 5: Selector de Camino
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
                  {question?.opciones.map((option) => {
                    const isDisabledInMas = selectedMenos === option.dimension
                    return (
                      <div
                        key={option.texto}
                        onClick={() => {
                          if (!isDisabledInMas) {
                            setResponses({
                              ...responses,
                              [question.id]: { ...currentResponse, mas: option.dimension },
                            })
                          }
                        }}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          isDisabledInMas
                            ? "border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed"
                            : selectedMas === option.dimension
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
                          <span className={`text-sm ${isDisabledInMas ? "text-gray-500" : ""}`}>
                            {option.texto}
                            {isDisabledInMas && " (Ya seleccionado en MENOS como yo)"}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* MENOS COMO YO */}
              <div className="space-y-3">
                <h4 className="font-semibold text-red-700 bg-red-50 p-3 rounded">
                  ✗ MENOS como yo
                </h4>
                <div className="space-y-2">
                  {question?.opciones.map((option) => {
                    const isDisabledInMenos = selectedMas === option.dimension
                    return (
                      <div
                        key={option.texto}
                        onClick={() => {
                          if (!isDisabledInMenos) {
                            setResponses({
                              ...responses,
                              [question.id]: { ...currentResponse, menos: option.dimension },
                            })
                          }
                        }}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          isDisabledInMenos
                            ? "border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed"
                            : selectedMenos === option.dimension
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
                          <span className={`text-sm ${isDisabledInMenos ? "text-gray-500" : ""}`}>
                            {option.texto}
                            {isDisabledInMenos && " (Ya seleccionado en MÁS como yo)"}
                          </span>
                        </div>
                      </div>
                    )
                  })}
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
        c1Context={c1Responses}
        onContinue={() => {
          setC1CurrentQuestion(0)
          setStep("conozcamonos2-paso1")
        }}
      />
    )
  }

  // STEP 5: Conozcámonos 2 - Paso 1
  if (step === "conozcamonos2-paso1") {
    const C2_PASO1_QUESTIONS = [
      { id: 1, q: "¿Cuánto tiempo disponible tienes diariamente?", type: "select", opts: ["<30 min", "30-60 min", "1-2 horas", "2+ horas"] },
      { id: 2, q: "¿Cuál es tu meta principal en 30 días?", type: "select", opts: ["Exploración", "Consolidación", "Escalamiento", "Cambio total"] },
      { id: 3, q: "Nivel de energía actual (1-10)", type: "range", min: 1, max: 10 },
      { id: 4, q: "Duración ideal de sesiones de trabajo", type: "select", opts: ["15 min", "30 min", "45 min", "60+ min"] },
      { id: 5, q: "¿Trabajas mejor solo o en equipo?", type: "select", opts: ["Solo", "Equipo pequeño", "Ambos", "Depende"] },
      { id: 6, q: "Obstáculos principales (máx 3)", type: "text" },
      { id: 7, q: "¿Tienes compromisos no-negociables?", type: "select", opts: ["Ninguno", "1-2", "3-5", "5+"] },
      { id: 8, q: "Ambiente de trabajo preferido", type: "select", opts: ["Casa", "Oficina", "Café", "Exterior"] },
      { id: 9, q: "¿Necesitas supervisión/accountability?", type: "select", opts: ["No", "Ocasional", "Semanal", "Diaria"] },
    ]

    const currentC2Q = C2_PASO1_QUESTIONS[c2Paso1Question] || C2_PASO1_QUESTIONS[0]
    const c2Progress = ((c2Paso1Question + 1) / C2_PASO1_QUESTIONS.length) * 100
    const isLastQuestion = c2Paso1Question === C2_PASO1_QUESTIONS.length - 1
    const isCurrentQuestionAnswered = c2Step1Responses[currentC2Q.id] !== undefined

    const handleC2Step1Next = async () => {
      if (c2Paso1Question < C2_PASO1_QUESTIONS.length - 1) {
        setC2Paso1Question(c2Paso1Question + 1)
      } else {
        // All questions answered - save to DB
        setC2Paso1Loading(true)
        console.log("[v0] Saving C2-Paso1 responses:", c2Step1Responses)
        try {
          const supabase = createClient()
          const { data: { user } } = await supabase.auth.getUser()
          if (!user) {
            console.error("[v0] No user found")
            setC2Paso1Loading(false)
            return
          }

          console.log("[v0] User found, saving responses...")
          
          // Save C2-Paso1 responses to database
          const { error } = await supabase
            .from("canon_conozcamonos_2_responses")
            .insert({
              user_id: user.id,
              paso: 1,
              responses: c2Step1Responses,
              created_at: new Date().toISOString(),
            })

          if (error) {
            console.error("[v0] Error saving C2-Paso1:", error)
            setC2Paso1Loading(false)
            return
          }

          console.log("[v0] C2-Paso1 saved successfully, moving to Paso 2...")
          setC2Paso2Question(0)
          setStep("conozcamonos2-paso2")
        } catch (err) {
          console.error("[v0] Error saving C2-Paso1:", err)
          setC2Paso1Loading(false)
        }
      }
    }

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Conozcámonos - Paso 1</CardTitle>
            <CardDescription>
              Ahora generaremos tu ruta personalizada de 30 días. Responde 9 preguntas cortas.
            </CardDescription>
            <div className="pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Pregunta {c2Paso1Question + 1} de {C2_PASO1_QUESTIONS.length}</span>
                <span>{Math.round(c2Progress)}%</span>
              </div>
              <Progress value={c2Progress} />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                Basados en tu Despega Cerebral, vamos a crear acciones concretas para tu transformación.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{currentC2Q.q}</h3>

              {currentC2Q.type === "select" && (
                <div className="space-y-2">
                  {currentC2Q.opts?.map((opt: string) => (
                    <Button
                      key={opt}
                      variant={c2Step1Responses[currentC2Q.id] === opt ? "default" : "outline"}
                      onClick={() => {
                        setC2Step1Responses({ ...c2Step1Responses, [currentC2Q.id]: opt })
                        if (!isLastQuestion) {
                          setTimeout(() => handleC2Step1Next(), 300)
                        }
                      }}
                      disabled={c2Paso1Loading}
                      className="justify-start w-full"
                    >
                      {opt}
                    </Button>
                  ))}
                </div>
              )}

              {currentC2Q.type === "range" && (
                <div className="space-y-4">
                  <input
                    type="range"
                    min={currentC2Q.min}
                    max={currentC2Q.max}
                    defaultValue={c2Step1Responses[currentC2Q.id] || 5}
                    onChange={(e) => setC2Step1Responses({ ...c2Step1Responses, [currentC2Q.id]: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="text-center text-lg font-semibold">
                    {c2Step1Responses[currentC2Q.id] || 5} / {currentC2Q.max}
                  </div>
                  <Button 
                    onClick={handleC2Step1Next} 
                    className="w-full"
                    disabled={c2Paso1Loading}
                  >
                    {isLastQuestion ? (c2Paso1Loading ? 'Guardando...' : 'Terminar y Continuar') : 'Continuar'}
                  </Button>
                </div>
              )}

              {currentC2Q.type === "text" && (
                <div className="space-y-2">
                  <textarea
                    placeholder="Escribe aquí..."
                    value={c2Step1Responses[currentC2Q.id] || ""}
                    onChange={(e) => setC2Step1Responses({ ...c2Step1Responses, [currentC2Q.id]: e.target.value })}
                    className="w-full p-3 border rounded-lg dark:bg-slate-900 dark:border-slate-700"
                    rows={3}
                    disabled={c2Paso1Loading}
                  />
                  <Button 
                    onClick={handleC2Step1Next} 
                    className="w-full" 
                    disabled={!isCurrentQuestionAnswered || c2Paso1Loading}
                  >
                    {isLastQuestion ? (c2Paso1Loading ? 'Guardando...' : 'Terminar y Continuar') : 'Continuar'}
                  </Button>
                </div>
              )}

              {isLastQuestion && isCurrentQuestionAnswered && (
                <div className="text-xs text-slate-500 text-center pt-2">
                  Haz click en "Terminar y Continuar" para generar tu ruta
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // STEP 6: Conozcámonos 2 - Paso 2
  if (step === "conozcamonos2-paso2") {
    const handleC2Step2Complete = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          console.error("[v0] No user found")
          return
        }

        // Save C2-Paso2 responses to database
        const { error } = await supabase
          .from("canon_conozcamonos_2_responses")
          .insert({
            user_id: user.id,
            paso: 2,
            responses: c2Step2Responses,
            created_at: new Date().toISOString(),
          })

        if (error) {
          console.error("[v0] Error saving C2-Paso2:", error)
        } else {
          console.log("[v0] C2-Paso2 saved successfully, moving to dashboard")
          router.push("/despega")
        }
      } catch (err) {
        console.error("[v0] Error in C2-Paso2 handler:", err)
      }
    }

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Conozcámonos - Paso 2</CardTitle>
            <CardDescription>
              Últimas preguntas para personalizar tu ruta a 60 y 90 días.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
              <p className="text-sm text-emerald-900 dark:text-emerald-100">
                Tu ruta de 30 días está lista. ¿Quieres extender a 60 y 90 días?
              </p>
            </div>
            <div className="space-y-4">
              <Button 
                onClick={handleC2Step2Complete} 
                className="w-full"
              >
                Ver mi Ruta Personalizada
              </Button>
              <Button 
                onClick={() => {
                  router.push("/despega")
                }} 
                variant="outline"
                className="w-full"
              >
                Saltar por ahora
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
}
