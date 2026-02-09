'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

const ONBOARDING_QUESTIONS = [
  // DOMINANCIA - Questions 1-5
  { id: 1, category: "dominancia", question: "Prefiero tomar decisiones rápidas y directas sin hesitación", options: [{ value: 1, label: "Analizo primero" }, { value: 2, label: "Reflexiono un poco" }, { value: 3, label: "Normal" }, { value: 4, label: "Bastante directo" }, { value: 5, label: "Decido rápido" }] },
  { id: 2, category: "dominancia", question: "¿Cómo respondes ante desafíos o competencia?", options: [{ value: 1, label: "Evito conflictos" }, { value: 2, label: "Prefiero cooperar" }, { value: 3, label: "Compito moderadamente" }, { value: 4, label: "Busco ganar" }, { value: 5, label: "Debo ganar a toda costa" }] },
  { id: 3, category: "dominancia", question: "¿Cuánto necesitas tener control sobre las situaciones?", options: [{ value: 1, label: "Poco control" }, { value: 2, label: "Algo de control" }, { value: 3, label: "Equilibrado" }, { value: 4, label: "Bastante control" }, { value: 5, label: "Control total" }] },
  { id: 4, category: "dominancia", question: "¿Cuál es tu estilo de comunicación?", options: [{ value: 1, label: "Muy diplomático" }, { value: 2, label: "Considerado" }, { value: 3, label: "Directo" }, { value: 4, label: "Muy directo" }, { value: 5, label: "Brutal honestidad" }] },
  { id: 5, category: "dominancia", question: "¿Te gusta tomar riesgos calculados para lograr objetivos?", options: [{ value: 1, label: "Prefiero seguridad" }, { value: 2, label: "Riesgos bajos" }, { value: 3, label: "Riesgos moderados" }, { value: 4, label: "Riesgos altos" }, { value: 5, label: "Busco riesgos" }] },
  
  // INFLUENCIA - Questions 6-10
  { id: 6, category: "influencia", question: "¿Con qué frecuencia socializas o conectas con gente nueva?", options: [{ value: 1, label: "Casi nunca" }, { value: 2, label: "Raramente" }, { value: 3, label: "Ocasionalmente" }, { value: 4, label: "Frecuentemente" }, { value: 5, label: "Constantemente" }] },
  { id: 7, category: "influencia", question: "¿Cuán fácil te resulta persuadir o convencer a otros?", options: [{ value: 1, label: "Muy difícil" }, { value: 2, label: "Difícil" }, { value: 3, label: "Moderado" }, { value: 4, label: "Fácil" }, { value: 5, label: "Muy fácil" }] },
  { id: 8, category: "influencia", question: "¿Cómo describes tu entusiasmo y optimismo?", options: [{ value: 1, label: "Reservado" }, { value: 2, label: "Moderado" }, { value: 3, label: "Normal" }, { value: 4, label: "Entusiasta" }, { value: 5, label: "Extremadamente entusiasta" }] },
  { id: 9, category: "influencia", question: "¿Disfrutas ser el centro de atención?", options: [{ value: 1, label: "Prefiero pasar desapercibido" }, { value: 2, label: "Más bien solo" }, { value: 3, label: "Indiferente" }, { value: 4, label: "Me gusta brillar" }, { value: 5, label: "Amo la atención" }] },
  { id: 10, category: "influencia", question: "¿Cómo te adaptas a nuevas personas o entornos?", options: [{ value: 1, label: "Lentamente con dificultad" }, { value: 2, label: "Lentamente" }, { value: 3, label: "Moderadamente" }, { value: 4, label: "Rápidamente" }, { value: 5, label: "Instantáneamente" }] },
  
  // ESTABILIDAD - Questions 11-15
  { id: 11, category: "estabilidad", question: "¿Cómo prefieres tu entorno de trabajo?", options: [{ value: 1, label: "Muy dinámico" }, { value: 2, label: "Dinámico" }, { value: 3, label: "Equilibrado" }, { value: 4, label: "Estable" }, { value: 5, label: "Muy predecible" }] },
  { id: 12, category: "estabilidad", question: "¿Eres paciente y tolerante con los errores de otros?", options: [{ value: 1, label: "Poco paciente" }, { value: 2, label: "Algo impaciente" }, { value: 3, label: "Moderadamente" }, { value: 4, label: "Bastante paciente" }, { value: 5, label: "Muy paciente" }] },
  { id: 13, category: "estabilidad", question: "¿Cuál es tu nivel de lealtad hacia personas o equipos?", options: [{ value: 1, label: "Cambio fácilmente" }, { value: 2, label: "Moderadamente leal" }, { value: 3, label: "Leal" }, { value: 4, label: "Muy leal" }, { value: 5, label: "Extremadamente leal" }] },
  { id: 14, category: "estabilidad", question: "¿Prefieres tareas de largo plazo versus cambio constante?", options: [{ value: 1, label: "Cambio constante" }, { value: 2, label: "Más cambio que estabilidad" }, { value: 3, label: "Equilibrio" }, { value: 4, label: "Más estabilidad que cambio" }, { value: 5, label: "Largo plazo" }] },
  { id: 15, category: "estabilidad", question: "¿Cómo reaccionas ante cambios no esperados?", options: [{ value: 1, label: "Entro en pánico" }, { value: 2, label: "Me perturba" }, { value: 3, label: "Me adapto" }, { value: 4, label: "Casi no me afecta" }, { value: 5, label: "Lo veo como oportunidad" }] },
  
  // CONSCIENCIA - Questions 16-20
  { id: 16, category: "consciencia", question: "¿Cuán importante es el análisis detallado antes de decidir?", options: [{ value: 1, label: "Decido por intuición" }, { value: 2, label: "Poco análisis" }, { value: 3, label: "Moderado" }, { value: 4, label: "Mucho análisis" }, { value: 5, label: "Necesito datos" }] },
  { id: 17, category: "consciencia", question: "¿Cuál es tu relación con los procedimientos y reglas?", options: [{ value: 1, label: "Las ignoro" }, { value: 2, label: "Las sigo si me conviene" }, { value: 3, label: "Generalmente las sigo" }, { value: 4, label: "Las sigo siempre" }, { value: 5, label: "Necesito más reglas" }] },
  { id: 18, category: "consciencia", question: "¿Qué tan importante es la perfección y calidad en tu trabajo?", options: [{ value: 1, label: "Aproximado está bien" }, { value: 2, label: "Algo importante" }, { value: 3, label: "Moderado" }, { value: 4, label: "Muy importante" }, { value: 5, label: "Debe ser perfecto" }] },
  { id: 19, category: "consciencia", question: "¿Cómo manejas los errores o inconsistencias?", options: [{ value: 1, label: "Los ignoro" }, { value: 2, label: "Los tolero" }, { value: 3, label: "Los noto" }, { value: 4, label: "Los corijo siempre" }, { value: 5, label: "Me obsesiono" }] },
  { id: 20, category: "consciencia", question: "¿Necesitas evidencia antes de aceptar información nueva?", options: [{ value: 1, label: "Confío en palabras" }, { value: 2, label: "Algo de confianza" }, { value: 3, label: "Depende" }, { value: 4, label: "Bastante evidencia" }, { value: 5, label: "Necesito evidencia" }] },
]

export default function OnboardingPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<Record<number, number>>({})
  const [results, setResults] = useState<{
    dominancia: number
    influencia: number
    estabilidad: number
    consciencia: number
    total: number
    nivel: string
  } | null>(null)

  const handleAnswer = (value: number) => {
    setResponses(prev => ({
      ...prev,
      [ONBOARDING_QUESTIONS[currentQuestion].id]: value
    }))

    if (currentQuestion < ONBOARDING_QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      calculateResults()
    }
  }

  const calculateResults = async () => {
    const scores = {
      dominancia: 0,
      influencia: 0,
      estabilidad: 0,
      consciencia: 0,
    }
    
    const counts = {
      dominancia: 0,
      influencia: 0,
      estabilidad: 0,
      consciencia: 0,
    }

    Object.entries(responses).forEach(([qId, value]) => {
      const q = ONBOARDING_QUESTIONS.find(q => q.id === parseInt(qId))
      if (q) {
        scores[q.category as keyof typeof scores] += value
        counts[q.category as keyof typeof counts] += 1
      }
    })

    // Calculate averages (scale 1-5)
    const avgScores = {
      dominancia: counts.dominancia > 0 ? scores.dominancia / counts.dominancia : 0,
      influencia: counts.influencia > 0 ? scores.influencia / counts.influencia : 0,
      estabilidad: counts.estabilidad > 0 ? scores.estabilidad / counts.estabilidad : 0,
      consciencia: counts.consciencia > 0 ? scores.consciencia / counts.consciencia : 0,
    }

    // Determine overall level
    const total = (avgScores.dominancia + avgScores.influencia + avgScores.estabilidad + avgScores.consciencia) / 4
    let nivel = 'principiante'
    if (total > 3.5) nivel = 'avanzado'
    else if (total > 2.5) nivel = 'intermedio'

    const finalResults = {
      dominancia: Math.round(avgScores.dominancia * 20),
      influencia: Math.round(avgScores.influencia * 20),
      estabilidad: Math.round(avgScores.estabilidad * 20),
      consciencia: Math.round(avgScores.consciencia * 20),
      total: Math.round(total * 20),
      nivel,
    }

    // Save to database
    if (user?.id) {
      try {
        await supabase.from("despega_a1_test_results").insert({
          user_id: user.id,
          resultados: finalResults,
          respuestas: responses,
          diagnostico: nivel,
          score_total: Math.round(total * 20),
        })
      } catch (error) {
        console.error("Error saving results:", error)
      }
    }

    setResults(finalResults)
  }

  if (!user) {
    return <div className="p-8 text-center">Please log in to continue</div>
  }

  if (results) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg p-8">
          <h1 className="text-4xl font-bold mb-2">Nivel General</h1>
          <p className="text-xl text-muted-foreground mb-8">
            {results.total}% de potencial actual
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="font-medium">Dominancia</span>
              </div>
              <div className="text-2xl font-bold">{results.dominancia}%</div>
              <Progress value={results.dominancia} className="mt-2" />
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="font-medium">Influencia</span>
              </div>
              <div className="text-2xl font-bold">{results.influencia}%</div>
              <Progress value={results.influencia} className="mt-2" />
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="font-medium">Estabilidad</span>
              </div>
              <div className="text-2xl font-bold">{results.estabilidad}%</div>
              <Progress value={results.estabilidad} className="mt-2" />
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="font-medium">Consciencia</span>
              </div>
              <div className="text-2xl font-bold">{results.consciencia}%</div>
              <Progress value={results.consciencia} className="mt-2" />
            </div>
          </div>

          <div className="mt-8 text-center">
            <Button onClick={() => router.push('/despega/a1-cerebral')}>
              Ver Análisis Completo
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const question = ONBOARDING_QUESTIONS[currentQuestion]
  const progress = ((currentQuestion + 1) / ONBOARDING_QUESTIONS.length) * 100

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <h2 className="text-lg font-semibold">Pregunta {currentQuestion + 1} de {ONBOARDING_QUESTIONS.length}</h2>
          <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-lg p-8 border">
        <div className="flex items-center gap-2 mb-4">
          <span className={`text-xs px-2 py-1 rounded font-semibold ${
            question.category === "dominancia" ? "bg-red-100 text-red-800" :
            question.category === "influencia" ? "bg-yellow-100 text-yellow-800" :
            question.category === "estabilidad" ? "bg-blue-100 text-blue-800" :
            "bg-green-100 text-green-800"
          }`}>
            {question.category === "dominancia" ? "🎯 Dominancia" :
             question.category === "influencia" ? "💫 Influencia" :
             question.category === "estabilidad" ? "🛡️ Estabilidad" :
             "🔍 Consciencia"}
          </span>
        </div>
        
        <h3 className="text-2xl font-bold mb-8">{question.question}</h3>

        <div className="space-y-3">
          {question.options.map(option => (
            <button
              key={option.value}
              onClick={() => handleAnswer(option.value)}
              className="w-full p-4 text-left border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              <div className="flex items-center justify-between">
                <span>{option.label}</span>
                <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
