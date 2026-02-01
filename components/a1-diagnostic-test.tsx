'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

const QUESTIONS = [
  { id: 'q1', text: '¿Cuántas horas duermes por noche?', type: 'range', min: 4, max: 10 },
  { id: 'q2', text: '¿Cómo es tu energía general?', type: 'choice', options: ['Muy baja', 'Baja', 'Normal', 'Buena', 'Excelente'] },
  { id: 'q3', text: '¿Ejercicio por semana?', type: 'choice', options: ['Nunca', '1-2 veces', '3-4 veces', '5-6 veces', 'Diario'] },
  { id: 'q4', text: '¿Consistencia del sueño?', type: 'range', min: 1, max: 10 },
  { id: 'q5', text: '¿Vasos de agua diarios?', type: 'range', min: 0, max: 10 },
  { id: 'q6', text: '¿Tiempo de concentración sin distracciones?', type: 'choice', options: ['Menos de 15 min', '15-30 min', '30-60 min', '1-2 horas', 'Más de 2 horas'] },
  { id: 'q7', text: '¿Frecuencia de revisar notificaciones?', type: 'choice', options: ['Constantemente', 'Cada 5-10 min', 'Cada 15-30 min', 'Ocasionalmente', 'Casi nunca'] },
  { id: 'q8', text: '¿Tareas completadas efectivamente por día?', type: 'range', min: 1, max: 10 },
  { id: 'q9', text: '¿Claridad de prioridades para hoy?', type: 'range', min: 1, max: 10 },
  { id: 'q10', text: '¿Tiempo perdido en tareas no prioritarias?', type: 'choice', options: ['Más del 50%', '30-50%', '20-30%', '10-20%', 'Menos del 10%'] },
  { id: 'q11', text: '¿Frecuencia de contacto con amigos/colegas?', type: 'choice', options: ['Casi nunca', 'Ocasionalmente', 'A veces', 'Regularmente', 'Frecuentemente'] },
  { id: 'q12', text: '¿Capacidad de escucha activa?', type: 'range', min: 1, max: 10 },
  { id: 'q13', text: '¿Relaciones profesionales significativas?', type: 'choice', options: ['Ninguna', '1-3', '4-8', '9-15', 'Más de 15'] },
  { id: 'q14', text: '¿Facilidad para expresar gratitud?', type: 'range', min: 1, max: 10 },
  { id: 'q15', text: '¿Comodidad pidiendo ayuda?', type: 'range', min: 1, max: 10 },
  { id: 'q16', text: '¿Claridad sobre tus metas principales?', type: 'range', min: 1, max: 10 },
  { id: 'q17', text: '¿Frecuencia de planificación semanal?', type: 'choice', options: ['Nunca', 'Ocasionalmente', 'Semanalmente', '2 veces/semana', 'Diariamente'] },
  { id: 'q18', text: '¿Decisiones importantes por semana?', type: 'range', min: 0, max: 20 },
  { id: 'q19', text: '¿Ejecución de lo que planificas?', type: 'choice', options: ['Muy mal', 'Mal', 'Regular', 'Bien', 'Excelente'] },
  { id: 'q20', text: '¿Tienes ritual matutino preparatorio?', type: 'choice', options: ['No tengo', 'Irregular', 'Corto (5-10 min)', 'Moderado (10-30 min)', 'Robusto (30+ min)'] },
]

export default function A1DiagnosticTest({ onComplete }: { onComplete: (data: any) => void }) {
  const [idx, setIdx] = useState(0)
  const [ans, setAns] = useState<Record<string, any>>({})
  const [fin, setFin] = useState(false)

  const curr = QUESTIONS[idx]
  const answered = curr && ans[curr.id] !== undefined

  // Safety check - if no current question, show error
  if (!curr || !QUESTIONS.length) {
    return (
      <div className="w-full max-w-2xl mx-auto p-8 bg-red-50 border-2 border-red-300 rounded-lg text-center">
        <h2 className="text-2xl font-bold text-red-900 mb-2">Error de carga</h2>
        <p className="text-red-700">No se pudieron cargar las preguntas del diagnóstico.</p>
        <p className="text-sm text-red-600 mt-2">Índice: {idx}, Total de preguntas: {QUESTIONS.length}</p>
      </div>
    )
  }

  const handleAnswer = (value: any) => {
    setAns(prev => ({ ...prev, [curr.id]: value }))
  }

  const handleNext = () => {
    if (idx < QUESTIONS.length - 1) {
      setIdx(idx + 1)
    } else {
      setFin(true)
      onComplete({ responses: ans })
    }
  }

  // Completion screen
  if (fin) {
    return (
      <div className="w-full max-w-2xl mx-auto p-8 text-center bg-green-50 rounded-lg border-2 border-green-200">
        <h2 className="text-3xl font-bold mb-4 text-green-900">✓ Diagnóstico Completado</h2>
        <p className="text-green-700 text-lg">Tus respuestas han sido registradas correctamente.</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-sm font-semibold mb-3 text-gray-700">
          <span>Pregunta {idx + 1} de {QUESTIONS.length}</span>
          <span className="text-blue-600">{Object.keys(ans).length} respondidas</span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${((idx + 1) / QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white border-2 border-gray-300 rounded-lg p-10 min-h-96 flex flex-col justify-between shadow-md">
        <div>
          {/* Question Title */}
          <h2 className="text-3xl font-bold mb-10 text-gray-900 leading-tight">
            {curr.text}
          </h2>

          {/* Range Input */}
          {curr.type === 'range' && (
            <div className="space-y-8">
              <input
                type="range"
                min={curr.min}
                max={curr.max}
                value={ans[curr.id] !== undefined ? ans[curr.id] : curr.min}
                onChange={(e) => handleAnswer(Number(e.target.value))}
                className="w-full h-3 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="text-center pt-4">
                <span className="text-5xl font-bold text-blue-600">
                  {ans[curr.id] !== undefined ? ans[curr.id] : curr.min}
                </span>
              </div>
            </div>
          )}

          {/* Multiple Choice */}
          {curr.type === 'choice' && (
            <div className="space-y-4">
              {curr.options?.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt)}
                  className={`w-full p-5 text-left border-2 rounded-lg font-semibold text-lg transition-all ${
                    ans[curr.id] === opt
                      ? 'border-blue-500 bg-blue-100 text-blue-900'
                      : 'border-gray-300 bg-white text-gray-900 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-4 mt-10 pt-8 border-t-2 border-gray-200">
          <Button
            onClick={() => setIdx(Math.max(0, idx - 1))}
            disabled={idx === 0}
            variant="outline"
            className="flex-1 py-6 text-lg"
          >
            ← Anterior
          </Button>
          <Button
            onClick={handleNext}
            disabled={!answered}
            className="flex-1 py-6 text-lg"
          >
            {idx === QUESTIONS.length - 1 ? '✓ Completar' : 'Siguiente →'}
          </Button>
        </div>
      </div>
    </div>
  )
}
