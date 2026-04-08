'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Video, Brain, Zap, TrendingUp, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { InteractiveTrainingSession } from '@/components/interactive-training-session'

const STRUCTURED_QUESTIONS = [
  {
    id: 1,
    category: 'Behavioral',
    question: 'Cuéntame sobre un momento en que tuviste que lidiar con un conflicto en el equipo. ¿Cómo lo resolviste?',
    guidance: 'Usa STAR: Situación (contexto), Tarea (tu rol), Acción (qué hiciste específicamente), Resultado (impacto). Enfócate en tu liderazgo y resolución de conflictos.',
    timeLimit: '3 minutos',
  },
  {
    id: 2,
    category: 'Technical',
    question: 'Describe un proyecto técnico complejo que lideraste. ¿Cuáles fueron los desafíos principales?',
    guidance: 'Explica la arquitectura, desafíos técnicos, tu rol de liderazgo, y el resultado. Usa números y métricas cuando sea posible.',
    timeLimit: '4 minutos',
  },
  {
    id: 3,
    category: 'Leadership',
    question: 'Cuéntame sobre un tiempo en que tuviste que motivar a tu equipo durante un período difícil.',
    guidance: 'Muestra empatía, estrategia de comunicación, acciones concretas, y resultados. Demuestra tu capacidad para liderar con propósito.',
    timeLimit: '3 minutos',
  },
  {
    id: 4,
    category: 'Problem-Solving',
    question: '¿Cómo abordas la resolución de problemas complejos? Dame un ejemplo específico.',
    guidance: 'Muestra tu proceso de pensamiento sistemático, análisis de datos, iteración, y validación de soluciones. Demuestra pensamiento crítico.',
    timeLimit: '3 minutos',
  },
  {
    id: 5,
    category: 'Career Growth',
    question: 'Cuéntame sobre tu mayor aprendizaje profesional y cómo lo aplicaste.',
    guidance: 'Muestra humildad, crecimiento continuo, autorreflexión, y aplicación práctica. Demuestra capacidad de aprender y adaptarse.',
    timeLimit: '3 minutos',
  },
  {
    id: 6,
    category: 'Vision & Strategy',
    question: '¿Cuál es tu visión para los próximos 5 años en tu carrera?',
    guidance: 'Sé ambicioso pero realista. Conecta con la misión de la empresa. Muestra crecimiento profesional y liderazgo futuro.',
    timeLimit: '2 minutos',
  },
]

export default function StructuredTrainingPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [completedQuestions, setCompletedQuestions] = useState<number[]>([])

  const question = STRUCTURED_QUESTIONS[currentQuestion]
  const progress = (completedQuestions.length / STRUCTURED_QUESTIONS.length) * 100

  const handleQuestionComplete = () => {
    if (!completedQuestions.includes(currentQuestion)) {
      setCompletedQuestions([...completedQuestions, currentQuestion])
    }
    if (currentQuestion < STRUCTURED_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link href="/despega/a3-dashboard" className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300">
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Link>
          <Badge className="bg-teal-600">{completedQuestions.length}/{STRUCTURED_QUESTIONS.length} Completadas</Badge>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Training Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-cyan-500/30 bg-gradient-to-br from-cyan-950/30 to-slate-950">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Badge className="bg-amber-600 mb-3">{question.category}</Badge>
                    <CardTitle className="text-2xl">Entrenamiento Estructurado - Pregunta {currentQuestion + 1}</CardTitle>
                  </div>
                  <Video className="w-8 h-8 text-cyan-400" />
                </div>
                <p className="text-slate-300 text-lg font-medium">{question.question}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Progreso del entrenamiento</span>
                    <span className="text-cyan-400 font-semibold">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-teal-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Video Training Session */}
                <InteractiveTrainingSession
                  question={question.question}
                  guidance={question.guidance}
                  estimatedTime={question.timeLimit}
                  trainingType="structured"
                />

                {/* Navigation */}
                <div className="flex gap-4 pt-6 border-t border-slate-700">
                  <Button
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestion === 0}
                    variant="outline"
                    className="flex-1"
                  >
                    Anterior
                  </Button>
                  <Button
                    onClick={handleQuestionComplete}
                    className="flex-1 bg-teal-600 hover:bg-teal-700"
                  >
                    Siguiente Pregunta
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Questions Overview */}
          <div className="space-y-4">
            <Card className="border-slate-700 bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-lg">Preguntas del Entrenamiento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {STRUCTURED_QUESTIONS.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestion(idx)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      idx === currentQuestion
                        ? 'bg-cyan-600/30 border border-cyan-500/50'
                        : completedQuestions.includes(idx)
                        ? 'bg-green-600/20 border border-green-500/30'
                        : 'bg-slate-800/50 border border-slate-700/30 hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {completedQuestions.includes(idx) ? (
                          <Award className="w-4 h-4 text-green-400" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-400 mb-1">{q.category}</p>
                        <p className="text-sm text-slate-200 line-clamp-2">{q.question}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="border-amber-500/30 bg-amber-950/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Brain className="w-5 h-5 text-amber-400" />
                  Consejos para el Éxito
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-300">
                <p>✓ Mantén contacto visual con la cámara</p>
                <p>✓ Habla con seguridad y claridad</p>
                <p>✓ Usa ejemplos específicos y datos</p>
                <p>✓ Respeta el tiempo límite</p>
                <p>✓ Muestra tu liderazgo y impacto</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-gradient-to-r from-cyan-900/20 to-teal-900/20 border border-cyan-500/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-cyan-400 mb-3">Entrenamiento Estructurado - Fase 2</h3>
          <p className="text-slate-300 mb-4">
            Este módulo proporciona entrenamientos conductuales y técnicos con presión moderada. Cada pregunta está diseñada para evaluarte en áreas críticas: liderazgo, resolución de problemas, visión estratégica, y crecimiento profesional.
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-300">
            <li className="flex gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400 flex-shrink-0" />
              <span>Análisis en tiempo real de postura, tono y contenido</span>
            </li>
            <li className="flex gap-2">
              <Zap className="w-5 h-5 text-cyan-400 flex-shrink-0" />
              <span>Feedback inmediato después de cada respuesta</span>
            </li>
            <li className="flex gap-2">
              <Award className="w-5 h-5 text-cyan-400 flex-shrink-0" />
              <span>Puntuaciones comparativas vs. estándares de mercado</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  )
}
