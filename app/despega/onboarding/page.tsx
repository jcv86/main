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

  // STEP 2: Instrucciones Detalladas
  if (step === "instructions") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-8 pb-8">
          {/* Hero Section */}
          <div className="text-center space-y-3 py-8">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-50">
              Descubre Tu Perfil DISC
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
          </div>

          {/* What is DISC */}
          <Card className="border-0 shadow-lg bg-white dark:bg-slate-900">
            <CardContent className="pt-8">
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-50">¿Qué es el Modelo DISC?</h2>
              <p className="text-slate-700 dark:text-slate-300 mb-4 text-lg leading-relaxed">
                DISC es una teoría psicológica de personalidad que describe <strong>cómo actúas naturalmente</strong> en diferentes situaciones. Es como una brújula que te ayuda a entender tu estilo único de comunicación, trabajo y relaciones.
              </p>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                DISC son 4 letras que representan los 4 estilos de personalidad principales. La mayoría de personas tienen un estilo dominante, pero todos tenemos un poco de cada uno en diferentes contextos.
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                <strong>Importante:</strong> No hay perfil mejor o peor. Cada estilo tiene fortalezas únicas y valiosas. El objetivo es entenderte para maximizar tu potencial.
              </p>
            </CardContent>
          </Card>

          {/* The 4 Dimensions */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Los 4 Estilos DISC</h2>
            
            {/* D - Dominance */}
            <Card className="border-l-8 border-l-red-500 shadow-lg overflow-hidden">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="md:col-span-1">
                    <div className="text-6xl mb-3">⚡</div>
                    <h3 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">D</h3>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">DOMINANCIA</p>
                    <div className="w-8 h-1 bg-red-500 rounded mt-2"></div>
                  </div>
                  <div className="md:col-span-3 space-y-3">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Filosofía: Uso Activo de Fuerza</p>
                      <p className="text-slate-700 dark:text-slate-300">
                        Los D superan resistencias en el ambiente mediante acción directa y decisiva.
                      </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded">
                        <p className="font-semibold text-red-900 dark:text-red-300 text-sm mb-1">Cómo Actúan</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">Orientados a resultados, toman decisiones rápidamente, lideran con confianza, van directo al punto</p>
                      </div>
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded">
                        <p className="font-semibold text-red-900 dark:text-red-300 text-sm mb-1">Fortalezas</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">Liderazgo, decisión, competencia, determinación, coraje, eficiencia</p>
                      </div>
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded">
                        <p className="font-semibold text-red-900 dark:text-red-300 text-sm mb-1">Motivación Laboral</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">Control, poder, resultados tangibles, desafíos, ambientes dinámicos</p>
                      </div>
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded">
                        <p className="font-semibold text-red-900 dark:text-red-300 text-sm mb-1">Preferencias</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">Liderazgo, emprendimiento, cambio, competencia, autonomía</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* I - Influence */}
            <Card className="border-l-8 border-l-yellow-500 shadow-lg overflow-hidden">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="md:col-span-1">
                    <div className="text-6xl mb-3">🌟</div>
                    <h3 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">I</h3>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">INFLUENCIA</p>
                    <div className="w-8 h-1 bg-yellow-500 rounded mt-2"></div>
                  </div>
                  <div className="md:col-span-3 space-y-3">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Filosofía: Uso de Encanto</p>
                      <p className="text-slate-700 dark:text-slate-300">
                        Los I superan obstáculos mediante carisma, persuasión y conexión con otras personas.
                      </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                        <p className="font-semibold text-yellow-900 dark:text-yellow-300 text-sm mb-1">Cómo Actúan</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">Entusiastas, carismáticos, conectan fácilmente, optimistas, amantes de atención</p>
                      </div>
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                        <p className="font-semibold text-yellow-900 dark:text-yellow-300 text-sm mb-1">Fortalezas</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">Comunicación, entusiasmo, carisma, persuasión, energía positiva, empatía</p>
                      </div>
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                        <p className="font-semibold text-yellow-900 dark:text-yellow-300 text-sm mb-1">Motivación Laboral</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">Reconocimiento, actividad social, diversión, visibilidad, colaboración</p>
                      </div>
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                        <p className="font-semibold text-yellow-900 dark:text-yellow-300 text-sm mb-1">Preferencias</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">Ventas, presentaciones, networking, trabajo en equipo, creatividad</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* S - Steadiness */}
            <Card className="border-l-8 border-l-green-500 shadow-lg overflow-hidden">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="md:col-span-1">
                    <div className="text-6xl mb-3">🛡️</div>
                    <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">S</h3>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">ESTABILIDAD</p>
                    <div className="w-8 h-1 bg-green-500 rounded mt-2"></div>
                  </div>
                  <div className="md:col-span-3 space-y-3">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Filosofía: Aceptación Voluntaria</p>
                      <p className="text-slate-700 dark:text-slate-300">
                        Los S aceptan voluntariamente los requisitos, con paciencia, apoyo y consistencia.
                      </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded">
                        <p className="font-semibold text-green-900 dark:text-green-300 text-sm mb-1">Cómo Actúan</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">Confiables, pacientes, colaborativos, apoyan a otros, crean armonía, evitan conflictos</p>
                      </div>
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded">
                        <p className="font-semibold text-green-900 dark:text-green-300 text-sm mb-1">Fortalezas</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">Empatía, paciencia, loyalidad, consistencia, confiabilidad, trabajo en equipo</p>
                      </div>
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded">
                        <p className="font-semibold text-green-900 dark:text-green-300 text-sm mb-1">Motivación Laboral</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">Estabilidad, equipo, armonía, relaciones significativas, seguridad</p>
                      </div>
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded">
                        <p className="font-semibold text-green-900 dark:text-green-300 text-sm mb-1">Preferencias</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">Roles de apoyo, servicio al cliente, coaching, ambientes estables</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* C - Conscientiousness */}
            <Card className="border-l-8 border-l-blue-500 shadow-lg overflow-hidden">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="md:col-span-1">
                    <div className="text-6xl mb-3">🔍</div>
                    <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">C</h3>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">CUMPLIMIENTO</p>
                    <div className="w-8 h-1 bg-blue-500 rounded mt-2"></div>
                  </div>
                  <div className="md:col-span-3 space-y-3">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Filosofía: Adaptación Cautelosa</p>
                      <p className="text-slate-700 dark:text-slate-300">
                        Los C se adaptan cautelosamente, con precisión, análisis y enfoque en calidad.
                      </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                        <p className="font-semibold text-blue-900 dark:text-blue-300 text-sm mb-1">Cómo Actúan</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">Analíticos, precisos, orientados a calidad, les importa detalle, datos y corrección</p>
                      </div>
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                        <p className="font-semibold text-blue-900 dark:text-blue-300 text-sm mb-1">Fortalezas</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">Precisión, análisis, atención al detalle, planificación, calidad, pensamiento crítico</p>
                      </div>
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                        <p className="font-semibold text-blue-900 dark:text-blue-300 text-sm mb-1">Motivación Laboral</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">Precisión, datos, trabajo bien hecho, estándares altos, competencia técnica</p>
                      </div>
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                        <p className="font-semibold text-blue-900 dark:text-blue-300 text-sm mb-1">Preferencias</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">Roles técnicos, análisis, investigación, procesos claros, documentación</p>
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
                  <div className="text-3xl min-w-fit">🚀</div>
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
            <Button onClick={() => setStep("camino")} className="w-full h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all rounded-lg bg-gradient-to-r from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-600 dark:from-slate-100 dark:to-slate-300 dark:text-slate-900">
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
