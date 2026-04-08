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

  const question = CHALLENGING_QUESTIONS[currentQuestion]
  const progress = (completedQuestions.length / CHALLENGING_QUESTIONS.length) * 100
  const currentScore = scores[currentQuestion]
  const averageScore = completedQuestions.length > 0
    ? Math.round(completedQuestions.reduce((acc, idx) => acc + (scores[idx] || 0), 0) / completedQuestions.length)
    : 0

  const handleQuestionComplete = (score?: number) => {
    if (score) {
      setScores({ ...scores, [currentQuestion]: score })
    }
    if (!completedQuestions.includes(currentQuestion)) {
      setCompletedQuestions([...completedQuestions, currentQuestion])
    }
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
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link href="/despega/a3-dashboard" className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300">
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Link>
          <div className="flex gap-4 items-center">
            <Badge className="bg-red-600">DESAFÍO MÁXIMO</Badge>
            <Badge className="bg-purple-600">{completedQuestions.length}/{CHALLENGING_QUESTIONS.length} Completadas</Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Training Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-purple-500/30 bg-gradient-to-br from-purple-950/30 to-slate-950">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Badge className={`mb-3 ${getScoreColor(question.expectedScoreMin)}`}>
                      {question.difficulty} - Puntuación Esperada: {question.expectedScoreMin}+
                    </Badge>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Crown className="w-6 h-6 text-purple-400" />
                      Entrenamiento Desafiante - Pregunta {currentQuestion + 1}
                    </CardTitle>
                  </div>
                  <Zap className="w-8 h-8 text-purple-400" />
                </div>
                <p className="text-slate-300 text-lg font-medium">{question.question}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Progreso del desafío</span>
                    <span className="text-purple-400 font-semibold">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Competencies Being Evaluated */}
                <div className="bg-purple-900/30 border border-purple-500/20 rounded-lg p-4">
                  <p className="text-sm font-semibold text-purple-300 mb-2">Competencias Evaluadas:</p>
                  <div className="flex flex-wrap gap-2">
                    {question.competencies.map((comp) => (
                      <Badge key={comp} variant="outline" className="border-purple-500/50 text-purple-300">
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
                    onClick={() => handleQuestionComplete()}
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                  >
                    Siguiente Desafío
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Executive Dashboard */}
          <div className="space-y-4">
            {/* Score Overview */}
            <Card className="border-purple-500/30 bg-gradient-to-br from-purple-900/30 to-slate-900/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                  Puntuación Ejecutiva
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-slate-400 mb-2">Promedio General</p>
                  <div className="flex items-end gap-2">
                    <span className={`text-3xl font-bold ${averageScore >= 75 ? 'text-green-400' : 'text-yellow-400'}`}>
                      {averageScore}
                    </span>
                    <span className="text-xs text-slate-400 pb-1">/100</span>
                  </div>
                </div>
                {currentScore !== undefined && (
                  <div className="pt-4 border-t border-slate-700">
                    <p className="text-xs text-slate-400 mb-2">Respuesta Actual</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-purple-400">{currentScore}</span>
                      <Badge className={getScoreColor(currentScore)}>
                        {getScoreLabel(currentScore)}
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Questions Overview */}
            <Card className="border-slate-700 bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-lg">Desafíos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-96 overflow-y-auto">
                {CHALLENGING_QUESTIONS.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestion(idx)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      idx === currentQuestion
                        ? 'bg-purple-600/30 border border-purple-500/50'
                        : completedQuestions.includes(idx)
                        ? 'bg-green-600/20 border border-green-500/30'
                        : 'bg-slate-800/50 border border-slate-700/30 hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
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
                        <p className="text-xs font-semibold text-slate-400 mb-1">Pregunta {idx + 1}</p>
                        <p className="text-sm text-slate-200 line-clamp-2">{q.question}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Warning */}
            {averageScore > 0 && averageScore < 75 && (
              <Card className="border-yellow-500/30 bg-yellow-950/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-yellow-400">
                    <AlertCircle className="w-5 h-5" />
                    Retroalimentación
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-yellow-200">
                  <p>Tu puntuación promedio está por debajo del estándar ejecutivo. Enfócate en:</p>
                  <ul className="mt-2 space-y-1 text-xs">
                    <li>• Mejorar tu narrativa y estructura</li>
                    <li>• Ser más específico con ejemplos</li>
                    <li>• Demostrar mayor impacto de negocio</li>
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-purple-400 mb-3">Entrenamiento Desafiante - Fase 3</h3>
          <p className="text-slate-300 mb-4">
            Este es el nivel máximo de entrenamiento, diseñado para prepararte para entrevistas ejecutivas de alto nivel. Las preguntas son desafiantes, sin guía, y requieren respuestas profundas que demuestren madurez ejecutiva, autorreflexión, y capacidad de liderazgo transformacional.
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-300">
            <li className="flex gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400 flex-shrink-0" />
              <span>Análisis multimodal ejecutivo-grade</span>
            </li>
            <li className="flex gap-2">
              <BarChart3 className="w-5 h-5 text-purple-400 flex-shrink-0" />
              <span>Puntuaciones comparativas vs. ejecutivos C-Suite</span>
            </li>
            <li className="flex gap-2">
              <Crown className="w-5 h-5 text-purple-400 flex-shrink-0" />
              <span>Recomendaciones personalizadas para mejora</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  )
}
