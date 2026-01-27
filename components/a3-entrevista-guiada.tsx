'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

interface Entrevista {
  id: string
  titulo: string
  descripcion: string
  tipo: 'educacion' | 'asistencia' | 'transicion'
  preguntas: string[]
  duracion_estimada: number
}

interface EntrevistGuiadaProps {
  entrevista: Entrevista
  onComplete: (respuestas: string[]) => Promise<void>
}

export default function EntrevistGuiada({ entrevista, onComplete }: EntrevistGuiadaProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [respuestas, setRespuestas] = useState<string[]>(new Array(entrevista.preguntas.length).fill(''))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [completed, setCompleted] = useState(false)

  const handleRespuestaChange = (text: string) => {
    const newRespuestas = [...respuestas]
    newRespuestas[currentQuestion] = text
    setRespuestas(newRespuestas)
  }

  const handleNext = () => {
    if (currentQuestion < entrevista.preguntas.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      await onComplete(respuestas)
      setCompleted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar respuestas')
    } finally {
      setLoading(false)
    }
  }

  if (completed) {
    return (
      <Card className="p-8 bg-slate-800 border-slate-700 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle2 className="w-16 h-16 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Entrevista Completada</h2>
        <p className="text-gray-400 mb-6">Tu respuesta será analizada por nuestro sistema de IA</p>
        <Button onClick={() => window.location.reload()}>Volver al inicio</Button>
      </Card>
    )
  }

  const progress = ((currentQuestion + 1) / entrevista.preguntas.length) * 100

  return (
    <Card className="p-6 bg-slate-800 border-slate-700">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">{entrevista.titulo}</h2>
            <p className="text-gray-400 text-sm mt-1">{entrevista.descripcion}</p>
          </div>
          <span className="text-xs bg-slate-700 px-3 py-1 rounded-full text-gray-300 capitalize">
            {entrevista.tipo}
          </span>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Pregunta {currentQuestion + 1} de {entrevista.preguntas.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Current Question */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          {entrevista.preguntas[currentQuestion]}
        </h3>
        
        <Textarea
          value={respuestas[currentQuestion]}
          onChange={(e) => handleRespuestaChange(e.target.value)}
          placeholder="Tu respuesta aquí..."
          className="min-h-32 bg-slate-700 border-slate-600 text-white placeholder-gray-500"
        />
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span className="text-red-400 text-sm">{error}</span>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between gap-3">
        <Button
          onClick={handlePrev}
          disabled={currentQuestion === 0 || loading}
          variant="outline"
          className="border-slate-600 text-gray-300 hover:bg-slate-700"
        >
          Anterior
        </Button>

        <div className="space-x-2">
          {currentQuestion < entrevista.preguntas.length - 1 ? (
            <Button
              onClick={handleNext}
              disabled={!respuestas[currentQuestion] || loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Siguiente
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={loading || respuestas.some(r => !r)}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Procesando...
                </>
              ) : (
                'Completar'
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Question indicators */}
      <div className="mt-6 flex gap-1 flex-wrap">
        {entrevista.preguntas.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentQuestion(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentQuestion
                ? 'bg-blue-500 w-6'
                : respuestas[idx]
                ? 'bg-green-500'
                : 'bg-slate-600'
            }`}
          />
        ))}
      </div>
    </Card>
  )
}
