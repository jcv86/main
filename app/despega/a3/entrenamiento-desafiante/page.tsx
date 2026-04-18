'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Video, Zap, Crown, TrendingUp, BarChart3, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { InteractiveTrainingSession } from '@/components/interactive-training-session'

const CHALLENGING_QUESTIONS = [
  {
    id: 1,
    difficulty: 'Crítico',
    question: 'Describe la decisión más difícil que has tomado en tu carrera. ¿Por qué fue difícil y qué aprendiste?',
    guidance: 'Demuestra pensamiento crítico, capacidad de decisión bajo presión, y madurez en reflexión. Muestra humildad pero también fortaleza de convicción.',
    expectedScoreMin: 70,
    competencies: ['Decisión Crítica', 'Madurez', 'Reflexión'],
  },
  {
    id: 2,
    difficulty: 'Crítico',
    question: 'Cuéntame de un fracaso significativo. ¿Cómo lo manejaste y qué cambió después?',
    guidance: 'La resiliencia y el aprendizaje de fracasos son críticos para liderazgo ejecutivo. Sé honesto pero enfócate en la lección y transformación.',
    expectedScoreMin: 75,
    competencies: ['Resiliencia', 'Aprendizaje', 'Transformación'],
  },
  {
    id: 3,
    difficulty: 'Crítico',
    question: '¿Cuál es tu mayor limitación como líder? ¿Cómo la estás abordando?',
    guidance: 'Autoconocimiento es signo de madurez ejecutiva. Sé específico y muestra acciones concretas para mejorar. No digas limitaciones obvias.',
    expectedScoreMin: 80,
    competencies: ['Autoconocimiento', 'Crecimiento', 'Acción'],
  },
  {
    id: 4,
    difficulty: 'Crítico',
    question: 'Describe una situación donde tuviste que gestionar a alguien más experimentado o difícil que tú.',
    guidance: 'Demuestra empatía, manejo de relaciones complejas, y diplomacia sin perder autoridad. Muestra inteligencia emocional.',
    expectedScoreMin: 78,
    competencies: ['Inteligencia Emocional', 'Diplomacia', 'Autoridad'],
  },
  {
    id: 5,
    difficulty: 'Crítico',
    question: '¿Cómo has impactado directamente en los resultados de negocio de tu organización?',
    guidance: 'Conecta tus acciones a métricas de negocio: ingresos, eficiencia, crecimiento, retención. Sé específico con números y % de impacto.',
    expectedScoreMin: 82,
    competencies: ['Impacto de Negocio', 'Cuantificación', 'Liderazgo'],
  },
  {
    id: 6,
    difficulty: 'Crítico',
    question: '¿Por qué quieres esta posición y qué harías diferente en los primeros 100 días?',
    guidance: 'Demuestra que has investigado profundamente. Ten un plan de 100 días concreto, ambicioso pero ejecutable. Muestra energía y visión.',
    expectedScoreMin: 85,
    competencies: ['Visión', 'Planificación', 'Ambición'],
  },
]

export default function ChallensingTrainingPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [completedQuestions, setCompletedQuestions] = useState<number[]>([])
  const [scores, setScores] = useState<Record<number, number>>({})
  const [isRecording, setIsRecording] = useState(false)
  const [hasResponseBeenRecorded, setHasResponseBeenRecorded] = useState(false)

  const question = CHALLENGING_QUESTIONS[currentQuestion]
  const progress = (completedQuestions.length / CHALLENGING_QUESTIONS.length) * 100
  const currentScore = scores[currentQuestion]
  const averageScore = completedQuestions.length > 0
    ? Math.round(completedQuestions.reduce((acc, idx) => acc + (scores[idx] || 0), 0) / completedQuestions.length)
    : 0

  const handleQuestionComplete = (score?: number) => {
    // Don't advance if response hasn't been recorded
    if (!hasResponseBeenRecorded) {
      return
    }
    
    if (score) {
      setScores({ ...scores, [currentQuestion]: score })
    }
    if (!completedQuestions.includes(currentQuestion)) {
      setCompletedQuestions([...completedQuestions, currentQuestion])
    }
    // Reset recording state for next question
    setHasResponseBeenRecorded(false)
    setIsRecording(false)
    
    if (currentQuestion < CHALLENGING_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'bg-green-600'
    if (score >= 75) return 'bg-blue-600'
    if (score >= 65) return 'bg-yellow-600'
    return 'bg-red-600'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 85) return 'Excelente'
    if (score >= 75) return 'Muy Bueno'
    if (score >= 65) return 'Bueno'
    return 'Necesita Mejora'
  }

  return (
    <main className="min-h-screen bg-black">
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="flex-shrink-0 border-b border-slate-800 bg-gradient-to-r from-slate-900 to-slate-950 p-4">
          <div className="flex items-center justify-between">
            <Link href="/despega/a3-dashboard" className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300">
              <ArrowLeft className="w-4 h-4" />
              Volver al Dashboard
            </Link>
            <div className="flex gap-4 items-center">
              <Badge className="bg-red-600 text-xs">DESAFÍO MÁXIMO</Badge>
              <Badge className="bg-purple-600 text-xs">{completedQuestions.length}/{CHALLENGING_QUESTIONS.length} Completadas</Badge>
            </div>
          </div>
        </div>

        {/* Main Split-Screen Layout */}
        <div className="flex-1 overflow-hidden p-4">
          <div className="grid lg:grid-cols-5 gap-0 bg-black rounded-xl overflow-hidden shadow-2xl h-full">
            
            {/* Left Panel: Training Area (60%) */}
            <div className="lg:col-span-3 relative bg-black overflow-y-auto flex flex-col">
              <div className="p-6 space-y-6 flex-1">
                <div className="space-y-3">
                  <Badge className={`${getScoreColor(question.expectedScoreMin)} text-xs`}>
                    {question.difficulty} - Puntuación Esperada: {question.expectedScoreMin}+
                  </Badge>
                  <h2 className="text-3xl font-bold flex items-center gap-3 text-white">
                    <Crown className="w-8 h-8 text-purple-400" />
                    Pregunta {currentQuestion + 1}
                  </h2>
                  <p className="text-lg text-slate-200 leading-relaxed">{question.question}</p>
                </div>

                {/* Competencies */}
                <div className="bg-purple-900/30 border border-purple-500/20 rounded-lg p-4">
                  <p className="text-sm font-semibold text-purple-300 mb-3">Competencias Evaluadas:</p>
                  <div className="flex flex-wrap gap-2">
                    {question.competencies.map((comp) => (
                      <Badge key={comp} variant="outline" className="border-purple-500/50 text-purple-300 text-xs">
                        {comp}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Video Training Session */}
                <InteractiveTrainingSession
                  question={question.question}
                  guidance={question.guidance}
                  estimatedTime="5 minutos"
                  trainingType="challenging"
                  onComplete={() => {
                    setHasResponseBeenRecorded(true)
                    setIsRecording(false)
                  }}
                />
              </div>

              {/* Navigation Buttons - Bottom */}
              <div className="flex-shrink-0 p-6 border-t border-slate-800 bg-slate-950 space-y-3">
                {!hasResponseBeenRecorded && (
                  <div className="flex items-center gap-2 text-amber-600 text-sm bg-amber-950/40 border border-amber-700/40 rounded-lg px-4 py-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>Completa la grabación de tu respuesta antes de continuar</span>
                  </div>
                )}
                <div className="flex gap-3">
                  <Button
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestion === 0}
                    variant="outline"
                    className="flex-1 border-slate-700 hover:bg-slate-800"
                  >
                    Anterior
                  </Button>
                  <Button
                    onClick={() => handleQuestionComplete()}
                    disabled={!hasResponseBeenRecorded || isRecording}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {currentQuestion === CHALLENGING_QUESTIONS.length - 1 ? 'Finalizar' : 'Siguiente Desafío'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Panel: Executive Dashboard (40%) */}
            <div className="lg:col-span-2 bg-gradient-to-b from-slate-900 to-slate-950 border-l border-slate-800 flex flex-col overflow-y-auto">
              
              {/* Score Overview */}
              <div className="p-4 border-b border-slate-800 flex-shrink-0">
                <h3 className="text-lg font-bold flex items-center gap-2 text-white mb-4">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                  Puntuación Ejecutiva
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-400 mb-2">Promedio General</p>
                    <div className="flex items-end gap-2">
                      <span className={`text-4xl font-bold ${averageScore >= 75 ? 'text-green-400' : 'text-yellow-400'}`}>
                        {averageScore}
                      </span>
                      <span className="text-xs text-slate-400 pb-2">/100</span>
                    </div>
                  </div>
                  {currentScore !== undefined && (
                    <div className="pt-4 border-t border-slate-700">
                      <p className="text-xs text-slate-400 mb-2">Respuesta Actual</p>
                      <div className="flex items-center justify-between">
                        <span className="text-3xl font-bold text-purple-400">{currentScore}</span>
                        <Badge className={getScoreColor(currentScore)} className="text-xs">
                          {getScoreLabel(currentScore)}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Questions List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Desafíos</p>
                {CHALLENGING_QUESTIONS.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => {
                      setCurrentQuestion(idx)
                      setHasResponseBeenRecorded(false)
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-all text-xs ${
                      idx === currentQuestion
                        ? 'bg-purple-600/30 border border-purple-500/50'
                        : completedQuestions.includes(idx)
                        ? 'bg-green-600/20 border border-green-500/30'
                        : 'bg-slate-800/50 border border-slate-700/30 hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5">
                        {completedQuestions.includes(idx) && scores[idx] ? (
                          <div className={`w-6 h-6 rounded-full ${getScoreColor(scores[idx])} flex items-center justify-center text-white text-xs font-bold`}>
                            {scores[idx]}
                          </div>
                        ) : completedQuestions.includes(idx) ? (
                          <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center">
                            <span className="text-xs text-white">✓</span>
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-slate-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-400 mb-1">Pregunta {idx + 1}</p>
                        <p className="text-slate-300 line-clamp-2">{q.question}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Warning */}
              {averageScore > 0 && averageScore < 75 && (
                <div className="p-4 border-t border-slate-800 bg-yellow-950/20 flex-shrink-0">
                  <p className="text-xs font-bold text-yellow-400 mb-2 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    Retroalimentación
                  </p>
                  <p className="text-xs text-yellow-200">
                    Enfócate en mejorar tu narrativa, ser más específico con ejemplos, y demostrar mayor impacto de negocio.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
