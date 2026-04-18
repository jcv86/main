'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mic, MicOff, BarChart3, AlertCircle, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

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
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const question = CHALLENGING_QUESTIONS[currentQuestion]
  const currentScore = scores[currentQuestion]
  const averageScore = completedQuestions.length > 0
    ? Math.round(completedQuestions.reduce((acc, idx) => acc + (scores[idx] || 0), 0) / completedQuestions.length)
    : 0

  // Initialize camera on mount
  useEffect(() => {
    const initCamera = async () => {
      try {
        console.log('[v0] Initializing camera...')
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false
        })
        console.log('[v0] Camera stream obtained:', stream)
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          console.log('[v0] Stream assigned to video element')
        }
      } catch (err) {
        console.error('[v0] Camera error:', err)
      }
    }

    initCamera()

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        console.log('[v0] Camera stopped')
      }
    }
  }, [])

  const handleStartRecording = () => {
    setIsRecording(true)
    console.log('[v0] Recording started')
  }

  const handleStopRecording = () => {
    setIsRecording(false)
    setHasResponseBeenRecorded(true)
    console.log('[v0] Recording stopped')
  }

  const handleQuestionComplete = (score?: number) => {
    if (!hasResponseBeenRecorded) {
      return
    }
    
    if (score) {
      setScores({ ...scores, [currentQuestion]: score })
    }
    if (!completedQuestions.includes(currentQuestion)) {
      setCompletedQuestions([...completedQuestions, currentQuestion])
    }
    
    setHasResponseBeenRecorded(false)
    setIsRecording(false)
    
    if (currentQuestion < CHALLENGING_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setHasResponseBeenRecorded(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'bg-green'
    if (score >= 75) return 'bg-blue'
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
              <Badge className="bg-purple text-xs">{completedQuestions.length}/{CHALLENGING_QUESTIONS.length} Completadas</Badge>
            </div>
          </div>
        </div>

        {/* Main Split-Screen Layout */}
        <div className="flex-1 overflow-hidden p-4">
          <div className="grid lg:grid-cols-5 gap-0 bg-black rounded-xl overflow-hidden shadow-2xl h-full">
            
            {/* Left Panel: Video (60%) */}
            <div className="lg:col-span-3 relative bg-black overflow-y-auto flex flex-col">
              {/* Video Stream */}
              <div className="flex-1 relative bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                
                {/* Recording indicator */}
                {isRecording && (
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 px-3 py-2 rounded-lg">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span className="text-xs text-white font-bold">GRABANDO</span>
                  </div>
                )}
              </div>

              {/* Bottom Section: Question & Controls */}
              <div className="flex-shrink-0 bg-slate-950 border-t border-slate-800 p-6 space-y-4">
                {/* Question Display */}
                <div className="space-y-3">
                  <Badge className={`${getScoreColor(question.expectedScoreMin)} text-xs w-fit`}>
                    {question.difficulty} - Esperado: {question.expectedScoreMin}+
                  </Badge>
                  <p className="text-lg font-semibold text-white">{question.question}</p>
                </div>

                {/* Guidance */}
                <div className="bg-blue/30 border border-blue/50/20 rounded-[28px] p-3">
                  <p className="text-sm text-blue/30">{question.guidance}</p>
                </div>

                {/* Recording Status */}
                {!hasResponseBeenRecorded && (
                  <div className="flex items-center gap-2 text-yellow text-sm bg-amber-950/40 border border-amber-700/40 rounded-lg px-4 py-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>Completa tu respuesta antes de continuar</span>
                  </div>
                )}

                {/* Recording Controls */}
                <div className="flex gap-3">
                  {!isRecording ? (
                    <Button
                      onClick={handleStartRecording}
                      className="flex-1 bg-red-600 hover:bg-red-700 gap-2"
                    >
                      <Mic className="w-4 h-4" />
                      Comenzar Grabación
                    </Button>
                  ) : (
                    <Button
                      onClick={handleStopRecording}
                      className="flex-1 bg-red-600 hover:bg-red-700 gap-2"
                    >
                      <MicOff className="w-4 h-4" />
                      Detener Grabación
                    </Button>
                  )}
                </div>

                {/* Navigation */}
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
                    onClick={() => handleQuestionComplete(75)}
                    disabled={!hasResponseBeenRecorded || isRecording}
                    className="flex-1 bg-purple hover:bg-purple disabled:opacity-50 disabled:cursor-not-allowed"
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
                    <p className="text-xs text-muted/40 mb-2">Promedio General</p>
                    <div className="flex items-end gap-2">
                      <span className={`text-4xl font-bold ${averageScore >= 75 ? 'text-green-400' : 'text-yellow-400'}`}>
                        {averageScore}
                      </span>
                      <span className="text-xs text-muted/40 pb-2">/100</span>
                    </div>
                  </div>
                  {currentScore !== undefined && (
                    <div className="pt-4 border-t border-slate-700">
                      <p className="text-xs text-muted/40 mb-2">Respuesta Actual</p>
                      <div className="flex items-center justify-between">
                        <span className="text-3xl font-bold text-purple-400">{currentScore}</span>
                        <Badge className={`${getScoreColor(currentScore)} text-xs`}>
                          {getScoreLabel(currentScore)}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Questions List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                <p className="text-xs font-bold text-muted/40 uppercase tracking-widest mb-3">Desafíos</p>
                {CHALLENGING_QUESTIONS.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => {
                      setCurrentQuestion(idx)
                      setHasResponseBeenRecorded(false)
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-all text-xs ${
                      idx === currentQuestion
                        ? 'bg-purple/30 border border-purple/50/50'
                        : completedQuestions.includes(idx)
                        ? 'bg-green/20 border border-green-500/30'
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
                          <div className="w-6 h-6 rounded-[20px] bg-green flex items-center justify-center">
                            <span className="text-xs text-white">✓</span>
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-slate-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-muted/40 mb-1">Pregunta {idx + 1}</p>
                        <p className="text-muted/30 line-clamp-2">{q.question}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Feedback */}
              {averageScore > 0 && averageScore < 75 && (
                <div className="p-4 border-t border-slate-800 bg-yellow-950/20 flex-shrink-0">
                  <p className="text-xs font-bold text-yellow-400 mb-2 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    Retroalimentación
                  </p>
                  <p className="text-xs text-yellow-200">
                    Enfócate en demostrar mayor impacto, ser específico con ejemplos, y mostrar madurez ejecutiva en tus respuestas.
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
