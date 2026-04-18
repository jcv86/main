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
import { ConozcamonosUnoComponent } from "@/components/conozcamonos-uno-component"
import { ConozcamonosDosComponent } from "@/components/conozcamonos-dos-component"

type Step = "intro" | "instructions" | "conozcamonos1" | "camino" | "test" | "results" | "conozcamonos2" | "conozcamonos2-paso1" | "conozcamonos2-paso2" | "route-generated"

type QuestionResponse = {
  mas?: string
  menos?: string
}

export default function DespegaOnboarding() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState<Step>("intro")
  const [loading, setLoading] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [c1CurrentQuestion, setC1CurrentQuestion] = useState(0)
  const [c2Paso1Question, setC2Paso1Question] = useState(0)
  const [c2Paso2Question, setC2Paso2Question] = useState(0)
  const [c2Paso1Loading, setC2Paso1Loading] = useState(false)
  const [responses, setResponses] = useState<Record<number, QuestionResponse>>({})
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
    const discKeys: (keyof typeof scores)[] = ["D", "I", "S", "C"]

    DISC_TEST_QUESTIONS.forEach((q) => {
      const response = responses[q.id]
      if (response?.mas && discKeys.includes(response.mas as keyof typeof scores)) {
        scores[response.mas as keyof typeof scores] += 2
      }
      if (response?.menos && discKeys.includes(response.menos as keyof typeof scores)) {
        scores[response.menos as keyof typeof scores] -= 1
      }
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
      <div className="min-h-screen bg-gradient-to-b from-muted/5 via-muted/5 to-muted/10 dark:from-background dark:via-background dark:to-muted/90 p-4 overflow-y-auto">
        <div className="max-w-3xl mx-auto py-12 space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-5xl md:text-6xl font-bold text-muted/90 dark:text-muted/5 leading-tight">
                Despega Cerebral
              </h1>
              <p className="text-xl text-muted/60 dark:text-muted/40">
                Tu punto de partida en DespegaTuCarrera
              </p>
            </div>
          </div>

          {/* Main Content */}
          <Card className="border-0 shadow-lg bg-white dark:bg-background">
            <CardContent className="pt-8 space-y-6">
              <div className="space-y-4">
                <p className="text-lg text-muted/70 dark:text-muted/30 leading-relaxed">
                  Antes de hablar de metas, decisiones o próximos pasos, necesitamos entender algo más profundo: <strong>tu patrón natural de acción</strong>.
                </p>
                
                <p className="text-muted/60 dark:text-muted/40 leading-relaxed">
                  Todos tenemos una forma particular de movernos frente a desafíos, cambios, presión y oportunidades. No es una etiqueta. No es una caja. <strong>Es un patrón.</strong>
                </p>

                <div className="p-4 bg-muted/5 dark:bg-card/50 rounded-[28px] border border-muted/20 dark:border-card my-4">
                  <p className="text-muted/70 dark:text-muted/30">
                    En las próximas 28 preguntas explorarás cómo tiendes a actuar cuando nadie te está mirando, cuando decides rápido, cuando dudas o cuando lideras.
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-muted/60 dark:text-muted/40">
                    ✓ No hay respuestas correctas o incorrectas.
                  </p>
                  <p className="text-muted/60 dark:text-muted/40">
                    ✓ No hay perfiles mejores que otros.
                  </p>
                  <p className="text-muted/60 dark:text-muted/40">
                    ✓ Existen distintos patrones naturales de acción.
                  </p>
                </div>

                <p className="text-muted/70 dark:text-muted/30 italic pt-2">
                  En unos minutos descubrirás cuál describe mejor tu forma de moverte en el mundo.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Why Start Here Section */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue/5 to-blue/10 dark:from-blue-950 dark:to-blue-900">
              <CardContent className="pt-8">
                <h3 className="text-xl font-bold text-blue dark:text-blue/10 mb-3">¿Qué es Despega Cerebral?</h3>
                <p className="text-sm text-blue dark:text-blue/20 leading-relaxed">
                  Es la base de tu recorrido dentro de DespegaTuCarrera. Se inspira en marcos conductuales ampliamente estudiados, pero no busca encasillarte.
                </p>
                <p className="text-sm text-blue dark:text-blue/20 leading-relaxed mt-3">
                  Su objetivo es identificar tendencias de comportamiento que influyen en cómo tomas decisiones, enfrentas conflictos, lideras o colaboras.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green/5 to-green/10 dark:from-green dark:to-green">
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
          <Card className="border-0 shadow-lg bg-white dark:bg-background">
            <CardHeader>
              <CardTitle className="text-2xl">Indicaciones antes de comenzar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="text-2xl min-w-fit">1️⃣</div>
                <div>
                  <p className="font-semibold text-muted/90 dark:text-muted/10">Responde con honestidad total</p>
                  <p className="text-sm text-muted/60 dark:text-muted/40">No pienses en cómo deberías ser, sino en cómo realmente actúas.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-2xl min-w-fit">2️⃣</div>
                <div>
                  <p className="font-semibold text-muted/90 dark:text-muted/10">Tu primer impulso es el más preciso</p>
                  <p className="text-sm text-muted/60 dark:text-muted/40">No pienses demasiado en las opciones. Tu instinto es lo más acertado.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-2xl min-w-fit">3️⃣</div>
                <div>
                  <p className="font-semibold text-muted/90 dark:text-muted/10">Este es tu punto de partida</p>
                  <p className="text-sm text-muted/60 dark:text-muted/40">Primero claridad. Luego dirección.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Example Question Preview */}
          <Card className="border-2 border-blue/30 bg-gradient-to-br from-blue/5 to-white dark:from-blue/10 dark:to-muted/90">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span>Así se ve una pregunta</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-muted/70 dark:text-muted/30">Evaluación DISC Despega</span>
                <span className="text-muted/50 dark:text-muted/40">1/28</span>
              </div>
              <div className="h-1 bg-blue/20 dark:bg-blue rounded-full overflow-hidden">
                <div className="h-full bg-blue dark:bg-blue/50 rounded-full" style={{ width: '4%' }}></div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-center font-semibold text-muted/90 dark:text-muted/10">
                  Cuando enfrento un desafío importante, tiendo a ser más:
                </h4>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-green dark:text-green/40">MÁS como yo</p>
                    <div className="space-y-2">
                      <button className="w-full p-3 border border-muted/20 dark:border-card rounded-lg hover:border-green dark:hover:border-green/40 transition text-left text-sm text-muted/70 dark:text-muted/30">
                        Decidido y directo
                      </button>
                      <button className="w-full p-3 border border-muted/20 dark:border-card rounded-lg hover:border-green dark:hover:border-green/40 transition text-left text-sm text-muted/70 dark:text-muted/30">
                        Optimista e inspirador
                      </button>
                      <button className="w-full p-3 border border-muted/20 dark:border-card rounded-lg hover:border-green dark:hover:border-green/40 transition text-left text-sm text-muted/70 dark:text-muted/30">
                        Paciente y considerado
                      </button>
                      <button className="w-full p-3 border border-muted/20 dark:border-card rounded-lg hover:border-green dark:hover:border-green/40 transition text-left text-sm text-muted/70 dark:text-muted/30">
                        Analítico y preciso
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-red dark:text-red/40">MENOS como yo</p>
                    <div className="space-y-2">
                      <button className="w-full p-3 border border-muted/20 dark:border-card rounded-lg hover:border-red/50 dark:hover:border-red/40 transition text-left text-sm text-muted/70 dark:text-muted/30">
                        Decidido y directo
                      </button>
                      <button className="w-full p-3 border border-muted/20 dark:border-card rounded-lg hover:border-red/50 dark:hover:border-red/40 transition text-left text-sm text-muted/70 dark:text-muted/30">
                        Optimista e inspirador
                      </button>
                      <button className="w-full p-3 border border-muted/20 dark:border-card rounded-lg hover:border-red/50 dark:hover:border-red/40 transition text-left text-sm text-muted/70 dark:text-muted/30">
                        Paciente y considerado
                      </button>
                      <button className="w-full p-3 border border-muted/20 dark:border-card rounded-lg hover:border-red/50 dark:hover:border-red/40 transition text-left text-sm text-muted/70 dark:text-muted/30">
                        Analítico y preciso
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-xs text-muted/50 dark:text-muted/40 text-center italic">
                Selecciona una opción de cada lado para responder
              </p>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="space-y-3">
            {onboardingAlreadyCompleted && !isFirstCompletion ? (
              <>
                <Button 
                  onClick={() => router.push("/despega/a1/resultado")} 
                  className="w-full h-14 text-base font-semibold shadow-lg hover:shadow-xl transition-all rounded-[28px] bg-blue hover:bg-blue"
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
              <Button onClick={() => setStep("conozcamonos1")} className="w-full h-14 text-base font-semibold shadow-lg hover:shadow-xl transition-all rounded-lg">
                Cuando estés listo, comienza
              </Button>
            )}
            <p className="text-center text-sm text-muted/60 dark:text-muted/40">
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
      <div className="min-h-screen bg-gradient-to-b from-muted/5 to-muted/10 p-4 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-8 pb-8">
          {/* Hero Section */}
          <div className="text-center space-y-3 py-8">
            <h1 className="text-4xl md:text-5xl font-bold text-muted/90 dark:text-muted/5">
              Descubre Tu Perfil Despega Cerebral
            </h1>
            <p className="text-xl text-muted/60 dark:text-muted/40">
              Entiende cómo actúas, cómo interactúas, y cómo impulsar tu mejor versión
            </p>
            <div className="flex justify-center gap-3 text-sm text-muted/60 dark:text-muted/40 pt-2">
              <span>⏱️ 3 minutos</span>
              <span>•</span>
              <span>📊 Resultados inmediatos</span>
              <span>��</span>
              <span>🎯 100% Preciso</span>
            </div>

            {onboardingAlreadyCompleted && (
              <div className="mt-6 p-4 bg-blue/10 border-l-4 border-blue/50 rounded">
                <p className="text-blue font-semibold">
                  ✓ Ya has completado tu Despega Cerebral. Tus resultados están guardados.
                </p>
                <p className="text-blue text-sm mt-2">
                  <Link href="/despega/journey" className="underline hover:text-blue font-semibold">
                    Ver mi dashboard →
                  </Link>
                </p>
              </div>
            )}
          </div>

          {/* Qué es El Ritual - Quién Eres Ahora */}
          <Card className="border-0 shadow-lg bg-card">
            <CardContent className="pt-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">El Ritual - Quién Eres Ahora</h2>
              <p className="text-muted-foreground mb-4 text-lg leading-relaxed">
                En Despega, el test de liderazgo identifica cómo actúas naturalmente en diferentes situaciones. Es como una brújula que te ayuda a entender tu estilo único de comunicación, trabajo y relaciones.
              </p>
              <p className="text-muted-foreground mb-4">
                Existen 4 perfiles principales: <strong>Impulsor, Catalizador, Estabilizador y Arquitecto</strong>. La mayoría de personas tiene un perfil dominante, pero todos tenemos un poco de cada uno en diferentes contextos.
              </p>
              <p className="text-muted-foreground">
                <strong>Importante:</strong> No hay perfil mejor o peor. Cada uno tiene fortalezas únicas y valiosas. El objetivo es entenderte para maximizar tu potencial.
              </p>
            </CardContent>
          </Card>

          {/* The 4 Dimensions */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Los 4 Perfiles de Liderazgo</h2>
            
            {/* D - Impulsor */}
            <Card className="border-l-8 border-l-red-500 shadow-lg overflow-hidden">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="md:col-span-1">
                    <div className="text-6xl mb-3">⚡</div>
                    <h3 className="text-2xl font-bold text-red dark:text-red/40 mb-2">D</h3>
                    <p className="font-semibold text-muted/90 dark:text-muted/10">IMPULSOR</p>
                    <div className="w-8 h-1 bg-red/50 rounded mt-2"></div>
                  </div>
                  <div className="md:col-span-3 space-y-3">
                    <div>
                      <p className="font-semibold text-muted/90 dark:text-muted/10 mb-1">Filosofía: Uso Activo de Fuerza</p>
                      <p className="text-muted/70 dark:text-muted/30">
                        Los Impulsores superan resistencias mediante acción directa y decisiva. Van hacia adelante con determinación.
                      </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="p-3 bg-red/5 dark:bg-red/20 rounded">
                        <p className="font-semibold text-red dark:text-red/30 text-sm mb-1">Cómo Actúan</p>
                        <p className="text-sm text-muted/70 dark:text-muted/30">Orientados a resultados, decisiones rápidas, lideran con confianza, directos y eficientes</p>
                      </div>
                      <div className="p-3 bg-red/5 dark:bg-red/20 rounded">
                        <p className="font-semibold text-red dark:text-red/30 text-sm mb-1">Fortalezas</p>
                        <p className="text-sm text-muted/70 dark:text-muted/30">Liderazgo, decisión, competencia, determinación, coraje, eficiencia</p>
                      </div>
                      <div className="p-3 bg-red/5 dark:bg-red/20 rounded">
                        <p className="font-semibold text-red dark:text-red/30 text-sm mb-1">Motivación</p>
                        <p className="text-sm text-muted/70 dark:text-muted/30">Resultados, control, desafíos, ambientes dinámicos, autonomía</p>
                      </div>
                      <div className="p-3 bg-red/5 dark:bg-red/20 rounded">
                        <p className="font-semibold text-red dark:text-red/30 text-sm mb-1">Ambiente Ideal</p>
                        <p className="text-sm text-muted/70 dark:text-muted/30">Liderazgo, emprendimiento, cambio, competencia, responsabilidad</p>
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
                    <h3 className="text-2xl font-bold text-yellow dark:text-yellow/40 mb-2">I</h3>
                    <p className="font-semibold text-muted/90 dark:text-muted/10">CATALIZADOR</p>
                    <div className="w-8 h-1 bg-orange rounded mt-2"></div>
                  </div>
                  <div className="md:col-span-3 space-y-3">
                    <div>
                      <p className="font-semibold text-muted/90 dark:text-muted/10 mb-1">Filosofía: Uso de Encanto</p>
                      <p className="text-muted/70 dark:text-muted/30">
                        Los Catalizadores superan obstáculos mediante carisma, persuasión y conexión genuina con otras personas.
                      </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="p-3 bg-yellow/5 dark:bg-yellow/20 rounded">
                        <p className="font-semibold text-yellow dark:text-yellow/30 text-sm mb-1">Cómo Actúan</p>
                        <p className="text-sm text-muted/70 dark:text-muted/30">Entusiastas, carismáticos, conectan fácilmente, optimistas, energéticos</p>
                      </div>
                      <div className="p-3 bg-yellow/5 dark:bg-yellow/20 rounded">
                        <p className="font-semibold text-yellow dark:text-yellow/30 text-sm mb-1">Fortalezas</p>
                        <p className="text-sm text-muted/70 dark:text-muted/30">Comunicación, entusiasmo, carisma, persuasión, energía positiva</p>
                      </div>
                      <div className="p-3 bg-yellow/5 dark:bg-yellow/20 rounded">
                        <p className="font-semibold text-yellow dark:text-yellow/30 text-sm mb-1">Motivación</p>
                        <p className="text-sm text-muted/70 dark:text-muted/30">Reconocimiento, interacción social, diversión, visibilidad</p>
                      </div>
                      <div className="p-3 bg-yellow/5 dark:bg-yellow/20 rounded">
                        <p className="font-semibold text-yellow dark:text-yellow/30 text-sm mb-1">Ambiente Ideal</p>
                        <p className="text-sm text-muted/70 dark:text-muted/30">Ventas, networking, equipo, creatividad, relaciones públicas</p>
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
                    <h3 className="text-2xl font-bold text-green dark:text-green/40 mb-2">S</h3>
                    <p className="font-semibold text-muted/90 dark:text-muted/10">ESTABILIZADOR</p>
                    <div className="w-8 h-1 bg-green/50 rounded mt-2"></div>
                  </div>
                  <div className="md:col-span-3 space-y-3">
                    <div>
                      <p className="font-semibold text-muted/90 dark:text-muted/10 mb-1">Filosofía: Aceptación Voluntaria</p>
                      <p className="text-muted/70 dark:text-muted/30">
                        Los Estabilizadores aceptan voluntariamente los cambios con paciencia, apoyo y consistencia genuina.
                      </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="p-3 bg-green/5 dark:bg-green/20 rounded">
                        <p className="font-semibold text-green dark:text-green/30 text-sm mb-1">Cómo Actúan</p>
                        <p className="text-sm text-muted/70 dark:text-muted/30">Confiables, pacientes, colaborativos, apoyan genuinamente, crean armonía</p>
                      </div>
                      <div className="p-3 bg-green/5 dark:bg-green/20 rounded">
                        <p className="font-semibold text-green dark:text-green/30 text-sm mb-1">Fortalezas</p>
                        <p className="text-sm text-muted/70 dark:text-muted/30">Empatía, paciencia, loyalidad, consistencia, confiabilidad, trabajo en equipo</p>
                      </div>
                      <div className="p-3 bg-green/5 dark:bg-green/20 rounded">
                        <p className="font-semibold text-green dark:text-green/30 text-sm mb-1">Motivación</p>
                        <p className="text-sm text-muted/70 dark:text-muted/30">Estabilidad, equipo, armonía, relaciones significativas, seguridad</p>
                      </div>
                      <div className="p-3 bg-green/5 dark:bg-green/20 rounded">
                        <p className="font-semibold text-green dark:text-green/30 text-sm mb-1">Ambiente Ideal</p>
                        <p className="text-sm text-muted/70 dark:text-muted/30">Apoyo, servicio, coaching, ambientes estables, relaciones duraderas</p>
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
                    <h3 className="text-2xl font-bold text-blue dark:text-blue/40 mb-2">C</h3>
                    <p className="font-semibold text-muted/90 dark:text-muted/10">ARQUITECTO</p>
                    <div className="w-8 h-1 bg-blue/50 rounded mt-2"></div>
                  </div>
                  <div className="md:col-span-3 space-y-3">
                    <div>
                      <p className="font-semibold text-muted/90 dark:text-muted/10 mb-1">Filosofía: Adaptación Cautelosa</p>
                      <p className="text-muted/70 dark:text-muted/30">
                        Los Arquitectos se adaptan cautelosamente, con precisión, análisis profundo y enfoque en excelencia.
                      </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="p-3 bg-blue/5 dark:bg-blue/20 rounded">
                        <p className="font-semibold text-blue dark:text-blue/30 text-sm mb-1">Cómo Actúan</p>
                        <p className="text-sm text-muted/70 dark:text-muted/30">Analíticos, precisos, orientados a calidad, detallistas, orientados a datos</p>
                      </div>
                      <div className="p-3 bg-blue/5 dark:bg-blue/20 rounded">
                        <p className="font-semibold text-blue dark:text-blue/30 text-sm mb-1">Fortalezas</p>
                        <p className="text-sm text-muted/70 dark:text-muted/30">Precisión, análisis, atención al detalle, planificación, calidad, pensamiento crítico</p>
                      </div>
                      <div className="p-3 bg-blue/5 dark:bg-blue/20 rounded">
                        <p className="font-semibold text-blue dark:text-blue/30 text-sm mb-1">Motivación</p>
                        <p className="text-sm text-muted/70 dark:text-muted/30">Precisión, datos, excelencia, estándares altos, competencia técnica</p>
                      </div>
                      <div className="p-3 bg-blue/5 dark:bg-blue/20 rounded">
                        <p className="font-semibold text-blue dark:text-blue/30 text-sm mb-1">Ambiente Ideal</p>
                        <p className="text-sm text-muted/70 dark:text-muted/30">Análisis, investigación, procesos claros, documentación, roles técnicos</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Points */}
          <Card className="bg-gradient-to-r from-purple/5 to-blue/5 dark:from-purple dark:to-blue border-2 border-purple/30 dark:border-purple shadow-lg">
            <CardContent className="pt-8">
              <h2 className="text-2xl font-bold mb-6 text-muted/90 dark:text-muted/5">Puntos Clave Importantes</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="text-2xl min-w-fit">✓</div>
                    <div>
                      <p className="font-semibold text-muted/90 dark:text-muted/10">Sin respuestas correctas</p>
                      <p className="text-sm text-muted/60 dark:text-muted/40">No hay perfil superior. Todos son igualmente valiosos y necesarios.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="text-2xl min-w-fit">✓</div>
                    <div>
                      <p className="font-semibold text-muted/90 dark:text-muted/10">Honestidad total</p>
                      <p className="text-sm text-muted/60 dark:text-muted/40">Responde como REALMENTE eres, no como crees que deberías ser.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="text-2xl min-w-fit">✓</div>
                    <div>
                      <p className="font-semibold text-muted/90 dark:text-muted/10">Primer instinto</p>
                      <p className="text-sm text-muted/60 dark:text-muted/40">Responde rápidamente. Tu instinto natural es lo más preciso.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="text-2xl min-w-fit">✓</div>
                    <div>
                      <p className="font-semibold text-muted/90 dark:text-muted/10">Estilo flexible</p>
                      <p className="text-sm text-muted/60 dark:text-muted/40">Adaptamos nuestro estilo según el contexto y las personas.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What You'll Get */}
          <Card className="bg-gradient-to-r from-green/5 to-blue/5 dark:from-green dark:to-blue border-2 border-green/30 dark:border-green shadow-lg">
            <CardContent className="pt-8">
              <h2 className="text-2xl font-bold mb-6 text-muted/90 dark:text-muted/5">Qué Obtendrás de Este Test</h2>
              <div className="space-y-4">
                <div className="flex gap-4 p-4 bg-white/50 dark:bg-card/50 rounded-[28px] border-l-4 border-green">
                  <div className="text-3xl min-w-fit">📊</div>
                  <div>
                    <p className="font-semibold text-muted/90 dark:text-muted/10">Tu Perfil Personalizado</p>
                    <p className="text-sm text-muted/60 dark:text-muted/40">Descubre tu estilo natural, tus fortalezas y áreas donde puedes crecer</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-white/50 dark:bg-card/50 rounded-[28px] border-l-4 border-teal-500">
                  <div className="text-3xl min-w-fit">🎯</div>
                  <div>
                    <p className="font-semibold text-muted/90 dark:text-muted/10">Insights Accionables</p>
                    <p className="text-sm text-muted/60 dark:text-muted/40">Cómo comunicar mejor, trabajar más efectivamente y liderar según tu estilo</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-white/50 dark:bg-card/50 rounded-[28px] border-l-4 border-green">
                  <div className="text-3xl min-w-fit">📚</div>
                  <div>
                    <p className="font-semibold text-muted/90 dark:text-muted/10">Libros Recomendados</p>
                    <p className="text-sm text-muted/60 dark:text-muted/40">Seleccionamos libros estratégicos adaptados a tu perfil para acelerar tu desarrollo</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-white/50 dark:bg-card/50 rounded-[28px] border-l-4 border-teal-500">
                  <div className="text-3xl min-w-fit">���</div>
                  <div>
                    <p className="font-semibold text-muted/90 dark:text-muted/10">Plan de Acción</p>
                    <p className="text-sm text-muted/60 dark:text-muted/40">Pasos claros y concretos para tu transición profesional y personal</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="space-y-4 sticky bottom-0 bg-gradient-to-t from-muted/10 to-transparent dark:from-muted/90 dark:to-transparent pt-8 -mx-4 px-4 pb-4">
            <Button onClick={() => setStep("test")} className="w-full h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all rounded-[28px] bg-gradient-to-r from-muted/90 to-muted/70 hover:from-muted/80 hover:to-muted/60 dark:from-muted/10 dark:to-muted/30 dark:text-muted/90">
              Entiendo, Comenzar Mi Test
            </Button>
            <p className="text-center text-sm text-muted/60 dark:text-muted/40">
              Este test toma ~3 minutos. Responde con honestidad para resultados precisos.
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
      // Validar que si es texto, no esté vacío
      if (currentC1Q.type === "text") {
        const response = (c1Responses[currentC1Q.id] || "").trim()
        if (!response) {
          alert("Por favor, escribe una respuesta")
          return
        }
        if (response.length < 5) {
          alert("La respuesta es muy corta. Por favor, proporciona más detalles")
          return
        }
      }

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
              setStep("instructions")
            }
          } catch (err) {
            console.error("[v0] Error in C1 save:", err)
          }
        }
        saveC1()
      }
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-muted/90 via-muted/80 to-muted/90 flex items-center justify-center p-4">
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
                    disabled={!c1Responses[currentC1Q.id] || (c1Responses[currentC1Q.id] || "").trim().length < 5}
                  >
                    Siguiente
                  </Button>
                  {c1Responses[currentC1Q.id] && (c1Responses[currentC1Q.id] || "").trim().length < 5 && (
                    <p className="text-sm text-red">La respuesta debe tener al menos 5 caracteres</p>
                  )}
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
              <Button 
                onClick={() => setStep("test")} 
                className="w-full" 
                size="lg"
              >
                Continuar al Test
              </Button>
            </div>
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
              <div className="p-3 bg-blue/5 dark:bg-blue/20 rounded border border-blue/30 dark:border-blue/10">
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
                <h4 className="font-semibold text-green bg-green/5 p-3 rounded">
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
                        className={`p-4 rounded-[28px] border-2 cursor-pointer transition-all ${
                          isDisabledInMas
                            ? "border-muted/20 bg-muted/10 opacity-50 cursor-not-allowed"
                            : selectedMas === option.dimension
                            ? "border-green bg-green/5"
                            : "border-muted/20 hover:border-green/30"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            selectedMas === option.dimension
                              ? "border-green bg-green/50"
                              : "border-muted/30"
                          }`}>
                            {selectedMas === option.dimension && (
                              <span className="text-white text-sm">✓</span>
                            )}
                          </div>
                          <span className={`text-sm ${isDisabledInMas ? "text-muted/50" : ""}`}>
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
                <h4 className="font-semibold text-red bg-red/5 p-3 rounded">
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
                        className={`p-4 rounded-[28px] border-2 cursor-pointer transition-all ${
                          isDisabledInMenos
                            ? "border-muted/20 bg-muted/10 opacity-50 cursor-not-allowed"
                            : selectedMenos === option.dimension
                            ? "border-red/50 bg-red/5"
                            : "border-muted/20 hover:border-red/30"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            selectedMenos === option.dimension
                              ? "border-red/50 bg-red/50"
                              : "border-muted/30"
                          }`}>
                            {selectedMenos === option.dimension && (
                              <span className="text-white text-sm">✗</span>
                            )}
                          </div>
                          <span className={`text-sm ${isDisabledInMenos ? "text-muted/50" : ""}`}>
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
            <div className="bg-blue/5 dark:bg-blue border border-blue/30 dark:border-blue/10 rounded-[28px] p-4">
              <p className="text-sm text-blue dark:text-blue/10">
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
                    onChange={(e) => setC2Step1Responses({ ...c2Step1Responses, [currentC2Q.id]: e.target.value })}
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
                    className="w-full p-3 border rounded-lg dark:bg-background dark:border-card"
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
                <div className="text-xs text-muted/50 text-center pt-2">
                  Haz click en "Terminar y Continuar" para generar tu ruta
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // STEP 6: Conozc��monos 2 - Paso 2
  if (step === "conozcamonos2-paso2") {
    const C2_PASO2_QUESTIONS = [
      { id: 1, q: "Tu meta prioritaria en 30 días", type: "text" },
      { id: 2, q: "¿Qué necesitas lograr en 60 días?", type: "text" },
      { id: 3, q: "Tu visión para 90 días", type: "text" },
      { id: 4, q: "Métrica o indicador de éxito", type: "text" },
      { id: 5, q: "¿Qué apoyo/recurso necesitas?", type: "text" },
    ]

    const currentC2Step2Q = C2_PASO2_QUESTIONS[c2Paso2Question] || C2_PASO2_QUESTIONS[0]
    const c2Step2Progress = ((c2Paso2Question + 1) / C2_PASO2_QUESTIONS.length) * 100
    const isLastQuestion = c2Paso2Question === C2_PASO2_QUESTIONS.length - 1
    const isCurrentQuestionAnswered = c2Step2Responses[currentC2Step2Q.id] !== undefined

    const handleC2Step2Next = async () => {
      if (c2Paso2Question < C2_PASO2_QUESTIONS.length - 1) {
        setC2Paso2Question(c2Paso2Question + 1)
      } else {
        // All questions answered - save to DB and trigger route generation
        setC2Paso1Loading(true)
        console.log("[v0] Saving C2-Paso2 responses:", c2Step2Responses)
        try {
          const { data: { user } } = await supabase.auth.getUser()
          if (!user) {
            console.error("[v0] No user found")
            setC2Paso1Loading(false)
            return
          }

          console.log("[v0] User found, saving C2-Paso2 responses...")
          
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
            setC2Paso1Loading(false)
            return
          }

          console.log("[v0] C2-Paso2 saved successfully, triggering route generation...")
          
          // Trigger route generation and wait for it
          let routeGenerated = false
          try {
            const generateResponse = await fetch('/api/despega/canon-generate-route', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ user_id: user.id }),
            })

            if (generateResponse.ok) {
              const routeData = await generateResponse.json()
              console.log("[v0] Route generated successfully:", routeData)
              routeGenerated = true
            } else {
              const errorData = await generateResponse.json()
              console.error("[v0] Error generating route:", errorData)
            }
          } catch (routeError) {
            console.error("[v0] Error calling route generation endpoint:", routeError)
          }

          // Wait a moment to ensure data is persisted before redirecting
          await new Promise(resolve => setTimeout(resolve, 1000))

          console.log("[v0] Redirecting to dashboard...")
          setC2Paso1Loading(false)
          router.push("/despega")
        } catch (err) {
          console.error("[v0] Error saving C2-Paso2:", err)
          setC2Paso1Loading(false)
        }
      }
    }

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        {c2Paso1Loading && c2Paso2Question === C2_PASO2_QUESTIONS.length - 1 && c2Step2Responses[currentC2Step2Q.id] ? (
          // Success screen while generating and redirecting
          <Card className="w-full max-w-2xl">
            <CardContent className="pt-12 pb-12 space-y-6 text-center">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-green">¡Excelente!</h2>
                <p className="text-muted/60 dark:text-muted/40">
                  Tu ruta personalizada se está generando...
                </p>
              </div>
              <div className="bg-green/5 dark:bg-emerald-950 border border-green/20 dark:border-emerald-800 rounded-[28px] p-4 space-y-2">
                <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                  Se está creando tu plan personalizado de 30/60/90 días basado en:
                </p>
                <ul className="text-xs text-emerald-800 dark:text-emerald-200 space-y-1 text-left">
                  <li>✓ Tu Perfil de Liderazgo</li>
                  <li>✓ Tu contexto personal y profesional</li>
                  <li>✓ Tu ambiente de ejecución</li>
                  <li>✓ Tus objetivos 30/60/90</li>
                </ul>
              </div>
              <p className="text-xs text-muted/50">Redirigiendo en un momento...</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Conozcámonos - Paso 2</CardTitle>
              <CardDescription>
                Últimas preguntas para personalizar tu ruta a 60 y 90 días.
              </CardDescription>
              <div className="pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Pregunta {c2Paso2Question + 1} de {C2_PASO2_QUESTIONS.length}</span>
                  <span>{Math.round(c2Step2Progress)}%</span>
                </div>
                <Progress value={c2Step2Progress} />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-green/5 dark:bg-emerald-950 border border-green/20 dark:border-emerald-800 rounded-[28px] p-4">
                <p className="text-sm text-emerald-900 dark:text-emerald-100">
                  Tu ruta de 30 días está lista. Responde 5 preguntas más para extender a 60 y 90 días.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{currentC2Step2Q.q}</h3>

                {currentC2Step2Q.type === "text" && (
                  <div className="space-y-2">
                    <textarea
                      placeholder="Escribe aquí..."
                      value={c2Step2Responses[currentC2Step2Q.id] || ""}
                      onChange={(e) => setC2Step2Responses({ ...c2Step2Responses, [currentC2Step2Q.id]: e.target.value })}
                      className="w-full p-3 border rounded-lg dark:bg-background dark:border-card"
                      rows={3}
                      disabled={c2Paso1Loading}
                    />
                    <Button 
                      onClick={handleC2Step2Next} 
                      className="w-full" 
                      disabled={!isCurrentQuestionAnswered || c2Paso1Loading}
                    >
                      {isLastQuestion ? (c2Paso1Loading ? 'Generando ruta...' : 'Completar y Generar Ruta') : 'Continuar'}
                    </Button>
                  </div>
                )}

                {isLastQuestion && isCurrentQuestionAnswered && (
                  <div className="text-xs text-muted/50 text-center pt-2">
                    Haz click en "Completar y Generar Ruta" para crear tu plan personalizado
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }
}
