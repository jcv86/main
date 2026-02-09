"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"

// Test A1 Base - Despega Cerebral con Modelo DISC Adaptado
// DISC mapping: D→plan_ejecutivo, I→relaciones, S→energia, C→enfoque
const TEST_A1_QUESTIONS = [
  // DISC-S (Steadiness) → ENERGÍA
  {
    id: 1,
    category: "energia",
    question: "Ante situaciones inesperadas, ¿cómo reaccionas típicamente?",
    options: [
      { value: 1, label: "Me estreso rápidamente y me toma tiempo recuperarme" },
      { value: 2, label: "Me afecta, pero intento mantener la calma" },
      { value: 3, label: "Busco equilibrio entre adaptación y consistencia" },
      { value: 4, label: "Me adapto con relativa calma y serenidad" },
      { value: 5, label: "Mantengo serenidad y veo lo positivo en el cambio" },
    ],
  },
  // DISC-C (Conscientiousness) → ENFOQUE
  {
    id: 2,
    category: "enfoque",
    question: "Cuando trabajas en algo importante, ¿cuál es tu enfoque?",
    options: [
      { value: 1, label: "Salto entre tareas sin completarlas" },
      { value: 2, label: "Me cuesta mantener el enfoque prolongado" },
      { value: 3, label: "Puedo concentrarme, pero me distraigo ocasionalmente" },
      { value: 4, label: "Mantengo enfoque y atención al detalle" },
      { value: 5, label: "Profundizo al máximo nivel, verificando cada detalle" },
    ],
  },
  // DISC-I (Influence) → RELACIONES
  {
    id: 3,
    category: "relaciones",
    question: "En grupos o reuniones, ¿cuál es tu rol natural?",
    options: [
      { value: 1, label: "Me cuesta participar o hablar" },
      { value: 2, label: "Participo poco, observo más" },
      { value: 3, label: "Participo de manera equilibrada" },
      { value: 4, label: "Contribuyo activamente a la conversación" },
      { value: 5, label: "Conecto personas e inspiro participación" },
    ],
  },
  // DISC-D (Dominance) → PLAN EJECUTIVO
  {
    id: 4,
    category: "plan_ejecutivo",
    question: "Cuando estableces un objetivo, ¿qué tan directo es tu camino?",
    options: [
      { value: 1, label: "No tengo metas claras ni ejecuto bien" },
      { value: 2, label: "Tengo metas pero me cuesta ejecutarlas" },
      { value: 3, label: "Balanceo metas con flexibilidad en el proceso" },
      { value: 4, label: "Ejecuto con determinación hacia mis objetivos" },
      { value: 5, label: "Avanzo rápido hacia resultados con enfoque implacable" },
    ],
  },
  // DISC-S (Steadiness) → ENERGÍA (relaciones interpersonales)
  {
    id: 5,
    category: "energia",
    question: "¿Cómo prefieres trabajar con otros?",
    options: [
      { value: 1, label: "Prefiero evitar el trabajo en equipo" },
      { value: 2, label: "Trabajo en equipo pero necesito autonomía" },
      { value: 3, label: "Me adapto bien a distintos estilos de equipo" },
      { value: 4, label: "Disfruto la colaboración y la armonía grupal" },
      { value: 5, label: "Busco crear ambiente de confianza y apoyo mutuo" },
    ],
  },
  // DISC-C (Conscientiousness) → ENFOQUE (calidad y precisión)
  {
    id: 6,
    category: "enfoque",
    question: "¿Qué importancia tiene la calidad en tu trabajo?",
    options: [
      { value: 1, label: "Me importa terminar rápido más que la calidad" },
      { value: 2, label: "Busco equilibrio entre velocidad y calidad" },
      { value: 3, label: "Calidad es importante, pero no siempre es perfecta" },
      { value: 4, label: "Busco alta calidad en todo lo que hago" },
      { value: 5, label: "La excelencia es no negociable, reviso todo meticulosamente" },
    ],
  },
  // DISC-I (Influence) → RELACIONES (networking, influencia)
  {
    id: 7,
    category: "relaciones",
    question: "¿Cómo es tu capacidad de influencia sobre otros?",
    options: [
      { value: 1, label: "Me cuesta influir o persuadir a otros" },
      { value: 2, label: "Puedo influir en ciertos contextos" },
      { value: 3, label: "Tengo capacidad moderada para influir" },
      { value: 4, label: "Puedo persuadir e influir de manera clara" },
      { value: 5, label: "Inspiro y motivo a otros con facilidad natural" },
    ],
  },
  // DISC-D (Dominance) → PLAN EJECUTIVO (liderazgo, decisiones)
  {
    id: 8,
    category: "plan_ejecutivo",
    question: "Ante decisiones difíciles o conflictos, ¿cómo actúas?",
    options: [
      { value: 1, label: "Evito decidir o los delego siempre" },
      { value: 2, label: "Me cuesta tomar decisiones difíciles" },
      { value: 3, label: "Decido con análisis de consecuencias" },
      { value: 4, label: "Decido firmemente cuando es necesario" },
      { value: 5, label: "Tomo decisiones rápidas y resolutivas, sin titubear" },
    ],
  },
]

type Step = "intro" | "camino" | "test" | "results"

export default function DespegaOnboarding() {
  const [step, setStep] = useState<Step>("intro")
  const [caminoPersona, setCaminoPersona] = useState(false)
  const [caminoProfesional, setCaminoProfesional] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<Record<number, number>>({})
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

  const handleSelect = (value: number) => {
    setResponses({ ...responses, [question.id]: value })
  }

  const handleNext = () => {
    if (currentQuestion < TEST_A1_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculateResults()
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

    TEST_A1_QUESTIONS.forEach((q) => {
      const response = responses[q.id]
      if (response) {
        scores[q.category as keyof typeof scores] += response
        counts[q.category as keyof typeof counts]++
      }
    })

    // Calculate averages (scale 1-5)
    const avgScores = {
      energia: counts.energia > 0 ? scores.energia / counts.energia : 0,
      enfoque: counts.enfoque > 0 ? scores.enfoque / counts.enfoque : 0,
      relaciones: counts.relaciones > 0 ? scores.relaciones / counts.relaciones : 0,
      plan_ejecutivo: counts.plan_ejecutivo > 0 ? scores.plan_ejecutivo / counts.plan_ejecutivo : 0,
    }

    const total = (avgScores.energia + avgScores.enfoque + avgScores.relaciones + avgScores.plan_ejecutivo) / 4
    
    let nivel = "principiante"
    if (total >= 4) nivel = "avanzado"
    else if (total >= 3) nivel = "intermedio"

    const finalResults = { ...avgScores, total, nivel }
    setResults(finalResults)

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
        const scoreTotalPercentage = Math.round(total * 20)
        const resultados = {
          energia: Math.round(avgScores.energia * 20),
          enfoque: Math.round(avgScores.enfoque * 20),
          relaciones: Math.round(avgScores.relaciones * 20),
          plan_ejecutivo: Math.round(avgScores.plan_ejecutivo * 20),
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
            test_type: "disc",
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

  // STEP 1: Intro - "El Ritual de Entrada"
  if (step === "intro") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Bienvenido a Tu Ritual de Entrada</CardTitle>
            <CardDescription className="text-lg mt-2">
              El primer paso de tu transición consciente de identidad. Aquí descubrimos quién eres ahora, para construir quién quieres ser.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary">4</div>
                <div className="text-sm text-muted-foreground">Fases de Transición</div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary">90</div>
                <div className="text-sm text-muted-foreground">Días de Acompañamiento</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold">Tu Viaje de 4 Fases:</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span><strong>A1 El Ritual</strong> - Descubre quién eres ahora (punto de partida)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span><strong>A2 Exploración</strong> - Explora narrativas de identidades futuras</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                  <span><strong>A3 Ensayo</strong> - Practica tu identidad futura en escenarios reales</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <span><strong>A4 Realidad</strong> - Vive tu nueva identidad en el mercado</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <p className="text-sm text-foreground">
                <strong>El Espejo:</strong> Este test es tu espejo. No juzga. Solo muestra quién eres hoy, para que desde ahí construyamos juntos tu puente hacia tu siguiente versión.
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

  // STEP 2: Selector de Camino - Con contexto de transición
  if (step === "camino") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Tu Transición Comienza Aquí</CardTitle>
            <CardDescription>
              Elige los aspectos de tu vida en los que necesitas transitar. Puedes trabajar uno o ambos simultáneamente.
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
                      Tu versión más auténtica: energía, hábitos, relaciones significativas, bienestar y autoconocimiento profundo.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Quién Eres</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Cómo Te Sientes</span>
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Relaciones</span>
                    </div>
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
                      Tu rol en el mundo: enfoque, productividad, networking, estrategia de carrera y dominio de tu expertise.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Tu Rol</span>
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Tu Estrategia</span>
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Tu Carrera</span>
                    </div>
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
              Continuar al Espejo
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // STEP 3: Test A1 Base - "El Espejo"
  if (step === "test") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <div className="space-y-4">
              <div>
                <CardTitle>El Espejo - Tu Diagnóstico Inicial</CardTitle>
                <CardDescription>
                  Miramos profundo. No para juzgar, sino para ver desde dónde realmente estás transitando.
                </CardDescription>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Pregunta {currentQuestion + 1} de {TEST_A1_QUESTIONS.length}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs px-2 py-1 rounded ${
                  question.category === "energia" ? "bg-blue-100 text-blue-800" :
                  question.category === "enfoque" ? "bg-green-100 text-green-800" :
                  question.category === "relaciones" ? "bg-orange-100 text-orange-800" :
                  "bg-purple-100 text-purple-800"
                }`}>
                  {question.category.charAt(0).toUpperCase() + question.category.slice(1).replace("_", " ")}
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-4">{question.question}</h3>
              <RadioGroup 
                value={responses[question.id]?.toString() || ""} 
                onValueChange={(v) => handleSelect(parseInt(v))}
              >
                <div className="space-y-3">
                  {question.options.map((option) => (
                    <div 
                      key={option.value} 
                      className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        responses[question.id] === option.value 
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => handleSelect(option.value)}
                    >
                      <RadioGroupItem value={option.value.toString()} id={`option-${option.value}`} />
                      <Label htmlFor={`option-${option.value}`} className="cursor-pointer flex-1">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
            <div className="flex gap-3">
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
                disabled={!responses[question.id]}
                className="flex-1"
              >
                {currentQuestion === TEST_A1_QUESTIONS.length - 1 ? "Ver Resultados" : "Siguiente"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // STEP 4: Results - "Tu Punto de Partida Revelado"
  if (step === "results" && results) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Tu Punto de Partida Revelado</CardTitle>
            <CardDescription>
              El espejo ha mostrado quién eres hoy. Ahora construimos tu puente hacia quién quieres ser.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
              <p className="text-sm text-muted-foreground">Tu Estado Actual</p>
              <p className="text-3xl font-bold capitalize mt-1">{results.nivel}</p>
              <p className="text-lg text-muted-foreground">Potencial disponible: {(results.total * 20).toFixed(0)}%</p>
              <p className="text-xs text-muted-foreground mt-2">Este es tu punto de partida para la transición</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="font-medium">Energía</span>
                </div>
                <div className="text-2xl font-bold">{(results.energia * 20).toFixed(0)}%</div>
                <Progress value={results.energia * 20} className="mt-2" />
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="font-medium">Enfoque</span>
                </div>
                <div className="text-2xl font-bold">{(results.enfoque * 20).toFixed(0)}%</div>
                <Progress value={results.enfoque * 20} className="mt-2" />
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="font-medium">Relaciones</span>
                </div>
                <div className="text-2xl font-bold">{(results.relaciones * 20).toFixed(0)}%</div>
                <Progress value={results.relaciones * 20} className="mt-2" />
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500" />
                  <span className="font-medium">Plan Ejecutivo</span>
                </div>
                <div className="text-2xl font-bold">{(results.plan_ejecutivo * 20).toFixed(0)}%</div>
                <Progress value={results.plan_ejecutivo * 20} className="mt-2" />
              </div>
            </div>

            {/* INSIGHTS SECTION - Rich DISC-adapted insights */}
            <div className="space-y-4 p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg">
              <h3 className="text-xl font-bold">Tus Insights Personalizados</h3>
              <div className="space-y-4">
                {/* Energía Insight */}
                <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border-l-4 border-blue-500 space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="font-semibold text-lg">Energía ({(results.energia * 20).toFixed(0)}%)</span>
                  </div>
                  {results.energia > 3.5 ? (
                    <>
                      <p className="text-sm font-medium">Perfil DISC-S (Steadiness): Estable y Consistente</p>
                      <p className="text-sm text-muted-foreground">Tu fortaleza está en la estabilidad emocional. Mantienes la calma bajo presión y generas confianza en tu entorno. Eres confiable y predecible.</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-2"><strong>Tu poder:</strong> Eres el ancla del equipo. Tu calma inspira tranquilidad. Aprovecha esto para mediar conflictos y liderar con serenidad.</p>
                    </>
                  ) : results.energia > 2.5 ? (
                    <>
                      <p className="text-sm font-medium">Perfil DISC-S (Steadiness): Buscas Equilibrio</p>
                      <p className="text-sm text-muted-foreground">Oscila entre momentos de calma y períodos de inquietud. Reconoces la importancia de la consistencia, pero aún buscas tu ritmo natural.</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-2"><strong>Desarrollo:</strong> Practica UNA sola rutina de estabilidad (respiración, meditación o caminar). Esto te dará el ancla que necesitas.</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium">Perfil DISC-S (Steadiness): Inestabilidad Emocional</p>
                      <p className="text-sm text-muted-foreground">Experimentas fluctuaciones emocionales frecuentes. Te cuesta mantener la consistencia bajo presión. Recuperar estabilidad es prioritario.</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-2"><strong>Acción inmediata:</strong> Establece una práctica diaria de 10 min para estabilizarte (ejercicio, meditación). Esto restaurará tu base.</p>
                    </>
                  )}
                </div>

                {/* Enfoque Insight */}
                <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border-l-4 border-green-500 space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="font-semibold text-lg">Concentración & Precisión ({(results.enfoque * 20).toFixed(0)}%)</span>
                  </div>
                  {results.enfoque > 3.5 ? (
                    <>
                      <p className="text-sm font-medium">Perfil DISC-C (Conscientiousness): Meticuloso y Preciso</p>
                      <p className="text-sm text-muted-foreground">Tu concentración es una fortaleza clave. Te obsesiona la calidad, los detalles y la precisión. Evitas errores con rigor analítico.</p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-2"><strong>Tu poder:</strong> Eres el guardián de la calidad. Tus análisis profundos previenen errores costosos. Lidera procesos críticos donde la precisión es vital.</p>
                    </>
                  ) : results.enfoque > 2.5 ? (
                    <>
                      <p className="text-sm font-medium">Perfil DISC-C (Conscientiousness): Buscas Precisión</p>
                      <p className="text-sm text-muted-foreground">Tienes capacidad para el enfoque profundo, pero no siempre la mantienes. Buscas calidad pero a veces la abandones por rapidez.</p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-2"><strong>Técnica:</strong> Define estándares claros para cada tarea. Revisa solo UNA vez al final. Confía en tu proceso, no en perfeccionismo infinito.</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium">Perfil DISC-C (Conscientiousness): Necesitas Desarrollar Rigor</p>
                      <p className="text-sm text-muted-foreground">Las distracciones te dominan. Te cuesta profundizar en detalles. Necesitas crear sistemas que impongan estructura.</p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-2"><strong>Comienza:</strong> Usa checklists para cada tarea. Apaga distracciones digitales. Dedica 90 min puros a una sola tarea hoy.</p>
                    </>
                  )}
                </div>

                {/* Relaciones Insight */}
                <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border-l-4 border-orange-500 space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500" />
                    <span className="font-semibold text-lg">Conexión e Influencia ({(results.relaciones * 20).toFixed(0)}%)</span>
                  </div>
                  {results.relaciones > 3.5 ? (
                    <>
                      <p className="text-sm font-medium">Perfil DISC-I (Influence): Inspirador y Conectado</p>
                      <p className="text-sm text-muted-foreground">Tu capacidad de conexión es natural. Inspiras a otros, influyes sin imponer, y generas entusiasmo genuino a tu alrededor.</p>
                      <p className="text-xs text-orange-600 dark:text-orange-400 mt-2"><strong>Tu poder:</strong> Eres un catalizador social. Tu carisma abre puertas. Lidera movimientos, comunidades y transformaciones basadas en personas.</p>
                    </>
                  ) : results.relaciones > 2.5 ? (
                    <>
                      <p className="text-sm font-medium">Perfil DISC-I (Influence): Buscas Conectar</p>
                      <p className="text-sm text-muted-foreground">Tienes buena presencia social, pero a veces te reservas. Puedes influir, pero necesitas más confianza en tu impacto.</p>
                      <p className="text-xs text-orange-600 dark:text-orange-400 mt-2"><strong>Desarrollo:</strong> Practica compartir tus opiniones con más libertad. Una conexión genuina cada semana. Celebra pequeños momentos de influencia.</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium">Perfil DISC-I (Influence): Necesitas Desarrollar Influencia</p>
                      <p className="text-sm text-muted-foreground">Te cuesta conectar o influir. Prefieres trabajar en solitario. Desarrollar carisma y presencia social es un area importante.</p>
                      <p className="text-xs text-orange-600 dark:text-orange-400 mt-2"><strong>Comienza:</strong> Practica escucha activa sin juzgar. Haz preguntas genuinas. Conecta con UNA persona profundamente esta semana.</p>
                    </>
                  )}
                </div>

                {/* Plan Ejecutivo Insight */}
                <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border-l-4 border-purple-500 space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500" />
                    <span className="font-semibold text-lg">Liderazgo y Ejecución ({(results.plan_ejecutivo * 20).toFixed(0)}%)</span>
                  </div>
                  {results.plan_ejecutivo > 3.5 ? (
                    <>
                      <p className="text-sm font-medium">Perfil DISC-D (Dominance): Líder Decisivo</p>
                      <p className="text-sm text-muted-foreground">Tu impulso por resultados es natural. Decides rápido, ejecutas con determinación y logras objetivos bajo presión.</p>
                      <p className="text-xs text-purple-600 dark:text-purple-400 mt-2"><strong>Tu poder:</strong> Eres un catalizador de acción. Tu visión se convierte en realidad. Lidera transformaciones estratégicas y grandes proyectos.</p>
                    </>
                  ) : results.plan_ejecutivo > 2.5 ? (
                    <>
                      <p className="text-sm font-medium">Perfil DISC-D (Dominance): Buscas Mayor Ejecución</p>
                      <p className="text-sm text-muted-foreground">Tienes intención de lograr resultados, pero a veces necesitas impulso. Planificas bien pero la ejecución falta consistencia.</p>
                      <p className="text-xs text-purple-600 dark:text-purple-400 mt-2"><strong>Técnica:</strong> Visualiza objetivos a 3 años. Divide en metas trimestrales. Revisa progreso cada lunes. Esto crea accountability.</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium">Perfil DISC-D (Dominance): Necesitas Desarrollar Liderazgo</p>
                      <p className="text-sm text-muted-foreground">La ejecución es un desafío. Luchas con la toma de decisiones o la consistencia. Necesitas crear sistemas de apoyo.</p>
                      <p className="text-xs text-purple-600 dark:text-purple-400 mt-2"><strong>Estructura urgente:</strong> Crea ritual matutino: 10 min, revisa 3 prioridades, ejecuta solo esas. Mañana comienza.</p>
                    </>
                  )}
                </div>
              </div>

              {/* Overall Recommendation from knowledge base */}
              <div className="p-4 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg mt-4">
                <p className="font-semibold text-blue-900 dark:text-blue-100 mb-2">📚 Tu Ruta de Desarrollo Personalizada:</p>
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                  Basado en tu perfil y en los insights de 120+ libros de desarrollo profesional en nuestra biblioteca:
                </p>
                <div className="space-y-2 text-sm">
                  {results.nivel === "principiante" ? (
                    <>
                      <p className="text-blue-800 dark:text-blue-200"><strong>Libro recomendado:</strong> "Los 7 Hábitos de la Gente Altamente Efectiva" - Construye una base sólida desarrollando una dimensión a la vez.</p>
                      <p className="text-blue-800 dark:text-blue-200"><strong>Plan de 30 días:</strong> Semana 1: Enfócate en dormir bien. Semana 2: Agrega 20 min de ejercicio. Semana 3: Una conexión genuina. Semana 4: Consolida todo.</p>
                    </>
                  ) : results.nivel === "intermedio" ? (
                    <>
                      <p className="text-blue-800 dark:text-blue-200"><strong>Libro recomendado:</strong> "Deep Work" de Cal Newport - Tienes buen balance. Ahora potencia tu fortaleza más débil y amplifica tus fortalezas.</p>
                      <p className="text-blue-800 dark:text-blue-200"><strong>Tu enfoque:</strong> Identifica la dimensión con menor puntuación y dedica este mes a desarrollarla específicamente.</p>
                    </>
                  ) : results.nivel === "avanzado" ? (
                    <>
                      <p className="text-blue-800 dark:text-blue-200"><strong>Libro recomendado:</strong> "El Monje que vendió su Ferrari" - Eres un profesional en desarrollo continuo. Ahora enfócate en complementariedades.</p>
                      <p className="text-blue-800 dark:text-blue-200"><strong>Tu rol:</strong> Ayuda a otros en su jornada. Considera mentoría o liderazgo transformacional.</p>
                    </>
                  ) : (
                    <>
                      <p className="text-blue-800 dark:text-blue-200"><strong>Libro recomendado:</strong> "The Mastery Manual" - Has alcanzado maestría. Transforma tu experiencia en impacto duradero.</p>
                      <p className="text-blue-800 dark:text-blue-200"><strong>Próximo paso:</strong> Documenta tu metodología. Lidera con ejemplo. Eres un modelo para otros.</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">Tus Caminos Activos:</h3>
              <div className="flex gap-2">
                {caminoPersona && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    Camino Persona
                  </span>
                )}
                {caminoProfesional && (
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                    Camino Profesional
                  </span>
                )}
              </div>
            </div>

            <Button 
                onClick={() => router.push("/dashboard?refetch=true")}
              className="w-full" 
              size="lg"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Ir a mi Dashboard Despega"}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}
