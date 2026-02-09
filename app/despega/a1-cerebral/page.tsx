'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

// DISC-Based Questions (20 questions) - ORIGINAL WORKING VERSION
// Maps to: Dominance (D), Influence (I), Steadiness (S), Conscientiousness (C)
const A1_QUESTIONS_DISC_2024 = [
  // DOMINANCE - Results-oriented, Competitive, Direct
  { id: 1, area: "dominancia", type: "scale", text: "Prefiero tomar decisiones rápidas y directas sin hesitación", min: 1, max: 10, minLabel: "Analizo primero", maxLabel: "Decido rápido" },
  { id: 2, area: "dominancia", type: "multiple", text: "¿Cómo respondes ante desafíos o competencia?", options: ["Evito conflictos", "Prefiero cooperar", "Compito moderadamente", "Busco ganar", "Debo ganar a toda costa"], weights: [0.1, 0.25, 0.5, 0.8, 1.0] },
  { id: 3, area: "dominancia", type: "scale", text: "¿Cuánto necesitas tener control sobre las situaciones?", min: 1, max: 10, minLabel: "Poco control", maxLabel: "Control total" },
  { id: 4, area: "dominancia", type: "multiple", text: "¿Cuál es tu estilo de comunicación?", options: ["Muy diplomático", "Considerado", "Directo", "Muy directo", "Brutal honestidad"], weights: [0.1, 0.3, 0.6, 0.85, 1.0] },
  { id: 5, area: "dominancia", type: "scale", text: "¿Te gusta tomar riesgos calculados para lograr objetivos?", min: 1, max: 10, minLabel: "Prefiero seguridad", maxLabel: "Busco riesgos" },
  
  // INFLUENCE - Persuasive, Enthusiastic, Social
  { id: 6, area: "influencia", type: "multiple", text: "¿Con qué frecuencia socializas o conectas con gente nueva?", options: ["Casi nunca", "Raramente", "Ocasionalmente", "Frecuentemente", "Constantemente"], weights: [0.1, 0.3, 0.55, 0.8, 1.0] },
  { id: 7, area: "influencia", type: "scale", text: "¿Cuán fácil te resulta persuadir o convencer a otros?", min: 1, max: 10, minLabel: "Muy difícil", maxLabel: "Muy fácil" },
  { id: 8, area: "influencia", type: "multiple", text: "¿Cómo describes tu entusiasmo y optimismo?", options: ["Reservado", "Moderado", "Normal", "Entusiasta", "Extremadamente entusiasta"], weights: [0.15, 0.35, 0.55, 0.8, 0.95] },
  { id: 9, area: "influencia", type: "scale", text: "¿Disfrutas ser el centro de atención?", min: 1, max: 10, minLabel: "Prefiero pasar desapercibido", maxLabel: "Amo la atención" },
  { id: 10, area: "influencia", type: "multiple", text: "¿Cómo te adaptas a nuevas personas o entornos?", options: ["Lentamente con dificultad", "Lentamente", "Moderadamente", "Rápidamente", "Instantáneamente"], weights: [0.1, 0.3, 0.55, 0.8, 1.0] },
  
  // STEADINESS - Loyal, Patient, Stable
  { id: 11, area: "estabilidad", type: "multiple", text: "¿Cómo prefieres tu entorno de trabajo?", options: ["Muy dinámico y caótico", "Dinámico", "Equilibrado", "Estable", "Muy predecible"], weights: [1.0, 0.7, 0.55, 0.8, 0.95] },
  { id: 12, area: "estabilidad", type: "scale", text: "¿Eres paciente y tolerante con los errores de otros?", min: 1, max: 10, minLabel: "Poco paciente", maxLabel: "Muy paciente" },
  { id: 13, area: "estabilidad", type: "multiple", text: "¿Cuál es tu nivel de lealtad hacia personas o equipos?", options: ["Cambio fácilmente", "Moderadamente leal", "Leal", "Muy leal", "Extremadamente leal"], weights: [0.1, 0.35, 0.6, 0.85, 1.0] },
  { id: 14, area: "estabilidad", type: "scale", text: "¿Prefieres tareas o proyectos de largo plazo versus cambio constante?", min: 1, max: 10, minLabel: "Cambio constante", maxLabel: "Largo plazo" },
  { id: 15, area: "estabilidad", type: "multiple", text: "¿Cómo reaccionas ante cambios no esperados?", options: ["Entro en pánico", "Me perturba", "Me adapto", "Casi no me afecta", "Lo veo como oportunidad"], weights: [0.05, 0.25, 0.55, 0.75, 0.95] },
  
  // CONSCIENTIOUSNESS - Analytical, Organized, Quality-focused
  { id: 16, area: "consciencia", type: "scale", text: "¿Cuán importante es el análisis detallado antes de decidir?", min: 1, max: 10, minLabel: "Decido por intuición", maxLabel: "Necesito datos" },
  { id: 17, area: "consciencia", type: "multiple", text: "¿Cuál es tu relación con los procedimientos y reglas?", options: ["Las ignoro", "Las sigo cuando me conviene", "Generalmente las sigo", "Las sigo siempre", "Necesito más reglas"], weights: [1.0, 0.7, 0.55, 0.85, 0.95] },
  { id: 18, area: "consciencia", type: "scale", text: "¿Qué tan importante es la perfección y calidad en tu trabajo?", min: 1, max: 10, minLabel: "Está bien lo aproximado", maxLabel: "Debe ser perfecto" },
  { id: 19, area: "consciencia", type: "multiple", text: "¿Cómo manejas los errores o inconsistencias?", options: ["Los ignoro", "Los tolero", "Los noto", "Los corijo siempre", "Me obsesiono"], weights: [0.1, 0.3, 0.55, 0.8, 1.0] },
  { id: 20, area: "consciencia", type: "scale", text: "¿Necesitas evidencia o pruebas antes de aceptar información nueva?", min: 1, max: 10, minLabel: "Confío en palabras", maxLabel: "Necesito evidencia" },
]

export default function A1CerebralPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<Record<number, number>>({})
  const [results, setResults] = useState<any>(null)

  const handleAnswer = (value: number) => {
    setResponses(prev => ({
      ...prev,
      [A1_QUESTIONS_DISC_2024[currentQuestion].id]: value
    }))

    if (currentQuestion < A1_QUESTIONS_DISC_2024.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      calculateResults()
    }
  }

  const calculateResults = async () => {
    const questionToDISC: Record<number, "dominancia" | "influencia" | "estabilidad" | "consciencia"> = {
      1: "dominancia", 2: "dominancia", 3: "dominancia", 4: "dominancia", 5: "dominancia",
      6: "influencia", 7: "influencia", 8: "influencia", 9: "influencia", 10: "influencia",
      11: "estabilidad", 12: "estabilidad", 13: "estabilidad", 14: "estabilidad", 15: "estabilidad",
      16: "consciencia", 17: "consciencia", 18: "consciencia", 19: "consciencia", 20: "consciencia",
    }

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
      const dimension = questionToDISC[parseInt(qId)]
      if (dimension) {
        scores[dimension] += value
        counts[dimension] += 1
      }
    })

    const avgScores = {
      dominancia: counts.dominancia > 0 ? Math.round(scores.dominancia / counts.dominancia) : 0,
      influencia: counts.influencia > 0 ? Math.round(scores.influencia / counts.influencia) : 0,
      estabilidad: counts.estabilidad > 0 ? Math.round(scores.estabilidad / counts.estabilidad) : 0,
      consciencia: counts.consciencia > 0 ? Math.round(scores.consciencia / counts.consciencia) : 0,
    }

    const finalResults = {
      dominancia: avgScores.dominancia,
      influencia: avgScores.influencia,
      estabilidad: avgScores.estabilidad,
      consciencia: avgScores.consciencia,
    }

    // Determine user level
    const total = (avgScores.dominancia + avgScores.influencia + avgScores.estabilidad + avgScores.consciencia) / 4
    let userLevel = 'principiante'
    if (total > 7) userLevel = 'avanzado'
    else if (total > 5) userLevel = 'intermedio'

    if (user?.id) {
      try {
        await supabase.from('despega_a1_test_results').insert({
          user_id: user.id,
          resultados: finalResults,
          respuestas: responses,
          diagnostico: userLevel,
        })
      } catch (error) {
        console.error('Error saving results:', error)
      }
    }

    setResults(finalResults)
  }

  if (!user) {
    return <div className="p-8 text-center">Por favor, inicia sesión para continuar</div>
  }

  if (results) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8">Tu Perfil DISC</h1>
        
        <div className="grid grid-cols-2 gap-6">
          {Object.entries(results).map(([dimension, score]) => (
            <div key={dimension} className="p-6 border rounded-lg">
              <h3 className="text-lg font-semibold mb-2 capitalize">{dimension}</h3>
              <p className="text-3xl font-bold mb-4">{score}/10</p>
              <Progress value={(score as number) * 10} className="mb-4" />
              <p className="text-sm text-muted-foreground">
                {(score as number) > 7 ? 'Alto nivel' : (score as number) > 5 ? 'Nivel moderado' : 'Nivel bajo'}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button onClick={() => window.location.reload()}>Realizar Test Nuevamente</Button>
        </div>
      </div>
    )
  }

  const question = A1_QUESTIONS_DISC_2024[currentQuestion]
  const progress = ((currentQuestion + 1) / A1_QUESTIONS_DISC_2024.length) * 100

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <h2 className="text-lg font-semibold">Pregunta {currentQuestion + 1} de {A1_QUESTIONS_DISC_2024.length}</h2>
          <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-lg p-8 border">
        <div className="flex items-center gap-2 mb-4">
          <span className={`text-xs px-2 py-1 rounded font-semibold ${
            question.area === "dominancia" ? "bg-red-100 text-red-800" :
            question.area === "influencia" ? "bg-yellow-100 text-yellow-800" :
            question.area === "estabilidad" ? "bg-blue-100 text-blue-800" :
            "bg-green-100 text-green-800"
          }`}>
            {question.area === "dominancia" ? "🎯 Dominancia" :
             question.area === "influencia" ? "💫 Influencia" :
             question.area === "estabilidad" ? "🛡️ Estabilidad" :
             "🔍 Consciencia"}
          </span>
        </div>

        <h3 className="text-2xl font-bold mb-8">{question.text}</h3>

        {question.type === "scale" ? (
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-muted-foreground mb-4">
              <span>{question.minLabel}</span>
              <span>{question.maxLabel}</span>
            </div>
            <div className="flex justify-between gap-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handleAnswer(i + 1)}
                  className="flex-1 p-2 border rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition text-sm"
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {(question.options || []).map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(Math.round((idx + 1) / (question.options?.length || 1) * 10))}
                className="w-full p-4 text-left border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
