"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"
import { DISC_TEST_QUESTIONS } from "@/lib/disc-test-questions"
import { DiscResultsPage } from "@/components/disc-results-page"

// Test A1 Base - Despega Cerebral con Modelo DISC Adaptado
// Using DISC test questions from library
const TEST_QUESTIONS = DISC_TEST_QUESTIONS

type Step = "intro" | "camino" | "test" | "results"

export default function DespegaOnboarding() {
  const [step, setStep] = useState<Step>("intro")
  const [caminoPersona, setCaminoPersona] = useState(false)
  const [caminoProfesional, setCaminoProfesional] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  // New format: responses track { questionId: { mas: dimensionIndex, menos: dimensionIndex } }
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

  const question = TEST_QUESTIONS[currentQuestion]
  const progress = ((currentQuestion + 1) / TEST_QUESTIONS.length) * 100

  const handleSelect = (value: number) => {
    setResponses({ ...responses, [question.id]: value })
  }

  const handleNext = () => {
    if (currentQuestion < TEST_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculateResults()
    }
  }

  const calculateResults = async () => {
    setLoading(true)
    
    // Calculate DISC scores using bidirectional method
    const scores = {
      D: 0,
      I: 0,
      S: 0,
      C: 0,
    }

    TEST_QUESTIONS.forEach((q) => {
      const response = responses[q.id]
      if (response?.mas) {
        // MÁS como yo suma +2
        scores[response.mas] += 2
      }
      if (response?.menos) {
        // MENOS como yo resta -1
        scores[response.menos] -= 1
      }
    })

    // Normalize scores to 0-100 scale
    const normalizedScores = {
      D: Math.max(0, Math.min(100, ((scores.D + 50) / 100) * 100)),
      I: Math.max(0, Math.min(100, ((scores.I + 50) / 100) * 100)),
      S: Math.max(0, Math.min(100, ((scores.S + 50) / 100) * 100)),
      C: Math.max(0, Math.min(100, ((scores.C + 50) / 100) * 100)),
    }

    // Find dominant and secondary profiles
    const sorted = Object.entries(normalizedScores)
      .sort(([, a], [, b]) => b - a)
      .map(([key]) => key as "D" | "I" | "S" | "C")

    const dominantProfile = sorted[0]
    const secondaryProfile = sorted[1]
    const total = (normalizedScores.D + normalizedScores.I + normalizedScores.S + normalizedScores.C) / 4

    const finalResults = {
      ...normalizedScores,
      dominantProfile,
      secondaryProfile,
      total,
    }
    setResults(finalResults)

    // Save to database
    if (userId) {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        const userEmail = authUser?.email

        // Save user profile
        const { error: profileError } = await supabase.from("despega_user_profiles").upsert(
          {
            user_id: userId,
            camino_persona_active: caminoPersona,
            camino_profesional_active: caminoProfesional,
            camino_foco: caminoPersona && caminoProfesional ? "ambos" : caminoPersona ? "persona" : "profesional",
            onboarding_completed: true,
            disc_profile: dominantProfile,
            disc_secondary: secondaryProfile,
          },
          { onConflict: "user_id" }
        )
        
        if (profileError) {
          console.error("[v0] Error saving user profile:", profileError.message)
        }

        // Save test results
        const { error: discError } = await supabase.from("despega_disc_results").insert({
          user_id: userId,
          d_score: Math.round(normalizedScores.D),
          i_score: Math.round(normalizedScores.I),
          s_score: Math.round(normalizedScores.S),
          c_score: Math.round(normalizedScores.C),
          dominant_profile: dominantProfile,
          secondary_profile: secondaryProfile,
          respuestas: responses,
          completed_at: new Date().toISOString(),
        })
        
        if (discError) {
          console.error("[v0] Error saving DISC results:", discError.message)
        }

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push("/dashboard?refetch=true")
        }, 2000)
      } catch (error) {
        console.error("[v0] Unexpected error:", error)
      }
    }

    setLoading(false)
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

  // STEP 3: Test - TestDISCOnline Format
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
                <CardTitle>El Espejo - Tu Diagnóstico Inicial</CardTitle>
                <CardDescription>
                  Elige la opción que MÁS te describe y la que MENOS te describe
                </CardDescription>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Pregunta {currentQuestion + 1} de {TEST_QUESTIONS.length}</span>
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
                {currentQuestion === TEST_QUESTIONS.length - 1 ? "Ver Resultados" : "Siguiente"}
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

            {/* Radar Chart */}
            <div className="bg-white p-4 rounded-lg border">
              <CompetencyRadarChart
                data={[
                  {
                    name: "Energía",
                    value: results.energia * 20,
                    fullMark: 100,
                  },
                  {
                    name: "Enfoque",
                    value: results.enfoque * 20,
                    fullMark: 100,
                  },
                  {
                    name: "Relaciones",
                    value: results.relaciones * 20,
                    fullMark: 100,
                  },
                  {
                    name: "Plan Ejecutivo",
                    value: results.plan_ejecutivo * 20,
                    fullMark: 100,
                  },
                ]}
                title=""
                description=""
                strokeColor="#3b82f6"
                fillColor="#3b82f7"
                height={350}
              />
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
                      <p className="text-sm font-medium">Sereno y Equilibrado</p>
                      <p className="text-sm text-muted-foreground">Tu estabilidad emocional es una fortaleza. Mantienes la calma bajo presión, recuperas equilibrio rápidamente y transmites confianza.</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-2"><strong>Tu poder:</strong> Eres el ancla del equipo. Tu serenidad inspira confianza. Lidera en crisis y situaciones de alta presión.</p>
                    </>
                  ) : results.energia > 2.5 ? (
                    <>
                      <p className="text-sm font-medium">Buscas Mayor Estabilidad</p>
                      <p className="text-sm text-muted-foreground">Te afectan las situaciones inesperadas, pero recuperas el equilibrio. Buscas consistencia pero a veces pierdes el ritmo.</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-2"><strong>Herramienta:</strong> Crea rutinas que te anclen (meditación, ejercicio, lectura). Una hora de "tu tiempo" diario sin interrupciones.</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium">Necesitas Desarrollar Estabilidad</p>
                      <p className="text-sm text-muted-foreground">Te estresa fácilmente y recuperarte toma tiempo. Necesitas desarrollar resiliencia emocional y técnicas de manejo del estrés.</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-2"><strong>Comienza hoy:</strong> Práctica 5 min de respiración profunda cada mañana. Practica meditación. Esto restaura tu base.</p>
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
                      <p className="text-sm font-medium">Meticuloso y Preciso</p>
                      <p className="text-sm text-muted-foreground">Tu concentración es una fortaleza clave. Te obsesiona la calidad, los detalles y la precisión. Evitas errores con rigor analítico.</p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-2"><strong>Tu poder:</strong> Eres el guardián de la calidad. Tus análisis profundos previenen errores costosos. Lidera procesos críticos donde la precisión es vital.</p>
                    </>
                  ) : results.enfoque > 2.5 ? (
                    <>
                      <p className="text-sm font-medium">Buscas Precisión</p>
                      <p className="text-sm text-muted-foreground">Tienes capacidad para el enfoque profundo, pero no siempre la mantienes. Buscas calidad pero a veces la abandones por rapidez.</p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-2"><strong>Técnica:</strong> Define estándares claros para cada tarea. Revisa solo UNA vez al final. Confía en tu proceso, no en perfeccionismo infinito.</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium">Necesitas Desarrollar Rigor</p>
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
                      <p className="text-sm font-medium">Inspirador y Conectado</p>
                      <p className="text-sm text-muted-foreground">Tu capacidad de conexión es natural. Inspiras a otros, influyes sin imponer, y generas entusiasmo genuino a tu alrededor.</p>
                      <p className="text-xs text-orange-600 dark:text-orange-400 mt-2"><strong>Tu poder:</strong> Eres un catalizador social. Tu carisma abre puertas. Lidera movimientos, comunidades y transformaciones basadas en personas.</p>
                    </>
                  ) : results.relaciones > 2.5 ? (
                    <>
                      <p className="text-sm font-medium">Buscas Conectar</p>
                      <p className="text-sm text-muted-foreground">Tienes buena presencia social, pero a veces te reservas. Puedes influir, pero necesitas más confianza en tu impacto.</p>
                      <p className="text-xs text-orange-600 dark:text-orange-400 mt-2"><strong>Desarrollo:</strong> Practica compartir tus opiniones con más libertad. Una conexión genuina cada semana. Celebra pequeños momentos de influencia.</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium">Necesitas Desarrollar Influencia</p>
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
                      <p className="text-sm font-medium">Líder Decisivo</p>
                      <p className="text-sm text-muted-foreground">Tu impulso por resultados es natural. Decides rápido, ejecutas con determinación y logras objetivos bajo presión.</p>
                      <p className="text-xs text-purple-600 dark:text-purple-400 mt-2"><strong>Tu poder:</strong> Eres un catalizador de acción. Tu visión se convierte en realidad. Lidera transformaciones estratégicas y grandes proyectos.</p>
                    </>
                  ) : results.plan_ejecutivo > 2.5 ? (
                    <>
                      <p className="text-sm font-medium">Buscas Mayor Ejecución</p>
                      <p className="text-sm text-muted-foreground">Tienes intención de lograr resultados, pero a veces necesitas impulso. Planificas bien pero la ejecución falta consistencia.</p>
                      <p className="text-xs text-purple-600 dark:text-purple-400 mt-2"><strong>Técnica:</strong> Visualiza objetivos a 3 años. Divide en metas trimestrales. Revisa progreso cada lunes. Esto crea accountability.</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium">Necesitas Desarrollar Liderazgo</p>
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
                  Basado en los insights de 120+ libros de desarrollo profesional seleccionamos estos 2 libros para ti:
                </p>
                <div className="space-y-3 text-sm">
                  {results.nivel === "principiante" ? (
                    <>
                      <div className="bg-white dark:bg-slate-800 p-3 rounded-lg">
                        <p className="text-blue-800 dark:text-blue-200"><strong>Libro 1:</strong> "Los 7 Hábitos de la Gente Altamente Efectiva"</p>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">Construye una base sólida desarrollando una dimensión a la vez.</p>
                      </div>
                      <div className="bg-white dark:bg-slate-800 p-3 rounded-lg">
                        <p className="text-blue-800 dark:text-blue-200"><strong>Libro 2:</strong> "Atomic Habits" - James Clear</p>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">Transforma tu vida con pequeños cambios consistentes cada día.</p>
                      </div>
                    </>
                  ) : results.nivel === "intermedio" ? (
                    <>
                      <div className="bg-white dark:bg-slate-800 p-3 rounded-lg">
                        <p className="text-blue-800 dark:text-blue-200"><strong>Libro 1:</strong> "Deep Work" - Cal Newport</p>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">Potencia tu enfoque y crea trabajo de impacto genuino.</p>
                      </div>
                      <div className="bg-white dark:bg-slate-800 p-3 rounded-lg">
                        <p className="text-blue-800 dark:text-blue-200"><strong>Libro 2:</strong> "Mindset" - Carol Dweck</p>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">Desarrolla tu mentalidad de crecimiento y acelera tu evolución.</p>
                      </div>
                    </>
                  ) : results.nivel === "avanzado" ? (
                    <>
                      <div className="bg-white dark:bg-slate-800 p-3 rounded-lg">
                        <p className="text-blue-800 dark:text-blue-200"><strong>Libro 1:</strong> "El Monje que vendió su Ferrari"</p>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">Integra sabiduría con liderazgo transformacional.</p>
                      </div>
                      <div className="bg-white dark:bg-slate-800 p-3 rounded-lg">
                        <p className="text-blue-800 dark:text-blue-200"><strong>Libro 2:</strong> "Start with Why" - Simon Sinek</p>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">Inspira a otros desde tu propósito y crea impacto duradero.</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-white dark:bg-slate-800 p-3 rounded-lg">
                        <p className="text-blue-800 dark:text-blue-200"><strong>Libro 1:</strong> "The Mastery Manual"</p>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">Transforma tu expertise en impacto y legado.</p>
                      </div>
                      <div className="bg-white dark:bg-slate-800 p-3 rounded-lg">
                        <p className="text-blue-800 dark:text-blue-200"><strong>Libro 2:</strong> "Stolen Focus" - Johann Hari</p>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">Comprende los desafíos modernos y domina tu concentración.</p>
                      </div>
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
              {loading ? "Guardando..." : "Ir a mi Dashboard"}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}
