'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import {
  ArrowLeft,
  Crown,
  BarChart3,
  AlertCircle,
  Loader2,
  Mic,
  Square,
  Send,
  CheckCircle2,
  TrendingUp
} from 'lucide-react'

const CHALLENGING_QUESTIONS = [
  {
    id: 1,
    number: 1,
    question: 'Describe la decisión más difícil que has tomado en tu carrera. ¿Por qué fue difícil y qué aprendiste?',
    difficulty: 'Crítico',
    expectedScoreMin: 75,
    competencies: ['Decisión Crítica', 'Madurez', 'Reflexión']
  },
  {
    id: 2,
    number: 2,
    question: '¿Cuéntame de un fracaso importante? ¿Qué pasó, cómo lo manejaste y qué lecciones sacaste?',
    difficulty: 'Crítico',
    expectedScoreMin: 75,
    competencies: ['Resiliencia', 'Autorreflexión', 'Liderazgo']
  },
  {
    id: 3,
    number: 3,
    question: 'Describe una situación donde debiste gestionar un conflicto significativo con un colega o supervisor.',
    difficulty: 'Crítico',
    expectedScoreMin: 70,
    competencies: ['Gestión de Conflictos', 'Empatía', 'Comunicación']
  },
  {
    id: 4,
    number: 4,
    question: '¿Cuál es tu mayor debilidad profesional y cómo la estás abordando?',
    difficulty: 'Crítico',
    expectedScoreMin: 70,
    competencies: ['Autoconsciencia', 'Desarrollo', 'Honestidad']
  },
  {
    id: 5,
    number: 5,
    question: 'Cuéntame sobre una decisión empresarial importante que tomaste. ¿Cuál fue el impacto medible?',
    difficulty: 'Crítico',
    expectedScoreMin: 80,
    competencies: ['Impacto Empresarial', 'Decisión Estratégica', 'Liderazgo Transformacional']
  },
  {
    id: 6,
    number: 6,
    question: '¿Cómo defines liderazgo efectivo y cómo lo ejemplificas en tu propia carrera?',
    difficulty: 'Crítico',
    expectedScoreMin: 75,
    competencies: ['Visión de Liderazgo', 'Autoconocimiento', 'Inspiración']
  }
]

export default function ChallensingTrainingPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [completedQuestions, setCompletedQuestions] = useState<number[]>([])
  const [scores, setScores] = useState<Record<number, number>>({})
  
  // Recording state
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  
  // Response state
  const [textResponse, setTextResponse] = useState('')
  const [hasResponse, setHasResponse] = useState(false)
  
  // Evaluation state
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [evaluation, setEvaluation] = useState<any>(null)
  const [evaluationError, setEvaluationError] = useState<string | null>(null)
  
  // Video refs
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const question = CHALLENGING_QUESTIONS[currentQuestion]
  const averageScore = scores && Object.values(scores).length > 0
    ? Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length)
    : 0
  const currentScore = scores[currentQuestion]

  // Initialize camera
  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: true
        })
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (err) {
        console.error('[v0] Camera error:', err)
      }
    }

    initCamera()

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  // Recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(t => t + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRecording])

  const startRecording = async () => {
    try {
      if (!streamRef.current) {
        console.error('[v0] No stream available')
        return
      }

      audioChunksRef.current = []
      const mediaRecorder = new MediaRecorder(streamRef.current)
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstart = () => {
        setIsRecording(true)
        setRecordingTime(0)
      }

      mediaRecorder.onstop = () => {
        setIsRecording(false)
        setHasResponse(true)
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
    } catch (err) {
      console.error('[v0] Recording error:', err)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
    }
  }

  const evaluateResponse = async () => {
    if (!hasResponse && !textResponse.trim()) {
      alert('Debes completar una respuesta (video o texto) antes de continuar')
      return
    }

    setIsEvaluating(true)
    setEvaluationError(null)

    try {
      const response = await fetch('/api/challenging-evaluation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.question,
          userResponse: textResponse || '[Respuesta de audio grabada]',
          difficulty: question.difficulty,
          competencies: question.competencies
        })
      })

      if (!response.ok) {
        throw new Error('Failed to evaluate response')
      }

      const result = await response.json()
      setEvaluation(result)
      setScores({ ...scores, [currentQuestion]: result.score })
      
      if (!completedQuestions.includes(currentQuestion)) {
        setCompletedQuestions([...completedQuestions, currentQuestion])
      }
    } catch (err) {
      console.error('[v0] Evaluation error:', err)
      setEvaluationError('Error al evaluar la respuesta. Intenta nuevamente.')
    } finally {
      setIsEvaluating(false)
    }
  }

  const moveToNextQuestion = () => {
    setEvaluation(null)
    setTextResponse('')
    setHasResponse(false)
    setRecordingTime(0)
    
    if (currentQuestion < CHALLENGING_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <main className="min-h-screen bg-black">
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="flex-shrink-0 border-b border-muted/80 bg-background">
          <div className="flex items-center justify-between">
            <Link href="/despega/a3" className="flex items-center gap-2 text-cyan hover:text-cyan/80">
              <ArrowLeft className="w-4 h-4" />
              Volver al Dashboard
            </Link>
            <div className="flex gap-4 items-center">
              <Badge className="bg-red">DESAFÍO MÁXIMO</Badge>
              <Badge className="bg-purple">{completedQuestions.length}/{CHALLENGING_QUESTIONS.length} Completadas</Badge>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden p-4">
          <div className="grid lg:grid-cols-5 gap-4 h-full">
            
            {/* Left Panel: Training (60%) */}
            <div className="lg:col-span-3 flex flex-col bg-muted/90/50 rounded-[28px] border border-muted/80 overflow-hidden">
              
              {/* Video Section */}
              <div className="flex-1 bg-black relative overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full h-full object-cover"
                />
                {isRecording && (
                  <div className="absolute top-4 right-4 flex items-center gap-2 bg-red px-3 py-2 rounded-lg">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span className="text-white text-sm font-mono">{formatTime(recordingTime)}</span>
                  </div>
                )}
              </div>

              {/* Question & Controls */}
              <div className="p-6 space-y-4 border-t border-muted/80 bg-background">
                
                {/* Question Display */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-bold text-muted-foreground mb-2">Pregunta {currentQuestion + 1} de {CHALLENGING_QUESTIONS.length}</h3>
                      <p className="text-lg text-white font-semibold">{question.question}</p>
                    </div>
                    <Badge className={question.difficulty === 'Crítico' ? 'bg-red' : 'bg-yellow'}>{question.difficulty}</Badge>
                  </div>
                </div>

                {/* Response Options */}
                {!evaluation ? (
                  <>
                    {/* Recording Controls */}
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-white/85">Opción 1: Grabar tu respuesta</p>
                      <div className="flex gap-2">
                        {!isRecording ? (
                          <Button
                            onClick={startRecording}
                            className="flex-1 bg-red/80 hover:bg-red/70 gap-2"
                          >
                            <Mic className="w-4 h-4" />
                            Comenzar Grabación
                          </Button>
                        ) : (
                          <Button
                            onClick={stopRecording}
                            className="flex-1 bg-muted/60 hover:bg-muted/70 gap-2"
                          >
                            <Square className="w-4 h-4" />
                            Detener Grabación
                          </Button>
                        )}
                      </div>
                      {hasResponse && <p className="text-xs text-green/40 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" />Respuesta grabada</p>}
                    </div>

                    {/* Text Input */}
                    <div className="space-y-3 border-t border-muted/80 pt-4">
                      <p className="text-sm font-semibold text-white/85">Opción 2: Escribe tu respuesta</p>
                      <textarea
                        value={textResponse}
                        onChange={(e) => {
                          setTextResponse(e.target.value)
                          setHasResponse(e.target.value.trim().length > 0)
                        }}
                        placeholder="Escribe aquí tu respuesta detallada... (mínimo 50 caracteres)"
                        className="w-full h-24 bg-muted/80 text-white border border-muted/70 rounded-[28px] p-3 text-sm focus:border-purple/50 focus:outline-none resize-none"
                      />
                      {textResponse && <p className="text-xs text-green/40 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" />Respuesta escrita ({textResponse.length} caracteres)</p>}
                    </div>

                    {/* Validation Message */}
                    {!hasResponse && (
                      <div className="flex items-start gap-2 text-yellow text-sm bg-amber-950/40 border border-amber-700/40 p-3 rounded-lg">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>Completa tu respuesta (grabación o texto) antes de enviar para evaluación</span>
                      </div>
                    )}

                    {/* Evaluate Button */}
                    <Button
                      onClick={evaluateResponse}
                      disabled={!hasResponse || isEvaluating}
                      className="w-full bg-purple/80 hover:bg-purple/70 disabled:opacity-50 gap-2"
                    >
                      {isEvaluating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Evaluando...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Enviar para Evaluación
                        </>
                      )}
                    </Button>

                    {evaluationError && (
                      <div className="flex items-start gap-2 text-red text-sm bg-red/40 border border-red/40 p-3 rounded-lg">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>{evaluationError}</span>
                      </div>
                    )}
                  </>
                ) : (
                  /* Evaluation Results */
                  <div className="space-y-4 border-t border-muted/80 pt-4">
                    <div className="bg-background">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-white/85">Tu Puntuación</p>
                        <div className="text-3xl font-bold text-purple/40">{evaluation.score}</div>
                      </div>
                      <p className="text-sm text-white/85">{evaluation.scoreExplanation}</p>
                    </div>

                    {/* Strengths */}
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-green/40 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Fortalezas Identificadas
                      </p>
                      <ul className="space-y-1 text-sm text-white/85">
                        {evaluation.strengths.map((s: string, i: number) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-green/40">•</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Improvements */}
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-yellow/40 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Áreas de Mejora
                      </p>
                      <ul className="space-y-1 text-sm text-white/85">
                        {evaluation.improvements.map((i: string, idx: number) => (
                          <li key={idx} className="flex gap-2">
                            <span className="text-yellow/40">•</span>
                            <span>{i}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Feedback */}
                    <div className="bg-muted/80/50 border border-muted/70 rounded-[28px] p-3">
                      <p className="text-xs font-semibold text-muted-foreground mb-2">RETROALIMENTACIÓN</p>
                      <p className="text-sm text-white/85">{evaluation.feedback}</p>
                    </div>

                    {/* Next Question Button */}
                    {currentQuestion < CHALLENGING_QUESTIONS.length - 1 ? (
                      <Button
                        onClick={moveToNextQuestion}
                        className="w-full bg-purple/80 hover:bg-purple/70 gap-2"
                      >
                        Siguiente Pregunta
                      </Button>
                    ) : (
                      <Button
                        onClick={() => window.location.href = '/despega/a3'}
                        className="w-full bg-green/80 hover:bg-green/70 gap-2"
                      >
                        Completar Entrenamiento
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel: Executive Dashboard (40%) */}
            <div className="lg:col-span-2 bg-background">
              
              {/* Score Overview */}
              <div className="p-4 border-b border-muted/80 flex-shrink-0">
                <h3 className="text-lg font-bold flex items-center gap-2 text-white mb-4">
                  <BarChart3 className="w-5 h-5 text-purple" />
                  Puntuación Ejecutiva
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-white/60 font-semibold mb-2">Promedio General</p>
                    <div className="flex items-end gap-2">
                      <span className={`text-4xl font-bold ${averageScore >= 75 ? 'text-green' : averageScore >= 60 ? 'text-yellow' : 'text-red'}`}>
                        {averageScore}
                      </span>
                      <span className="text-xs text-white/60 pb-2">/100</span>
                    </div>
                  </div>
                  {currentScore !== undefined && (
                    <div className="pt-4 border-t border-muted/70">
                      <p className="text-xs text-white/60 font-semibold mb-2">Esta Pregunta</p>
                      <span className="text-2xl font-bold text-purple">{currentScore}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Questions List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                <p className="text-xs font-bold text-white/70 uppercase tracking-widest mb-3">Preguntas</p>
                {CHALLENGING_QUESTIONS.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => {
                      if (completedQuestions.includes(idx)) {
                        setCurrentQuestion(idx)
                        setEvaluation(null)
                        setTextResponse('')
                        setHasResponse(false)
                      }
                    }}
                    disabled={!completedQuestions.includes(idx) && idx !== currentQuestion}
                    className={`w-full text-left p-3 rounded-lg transition-all text-xs disabled:opacity-50 ${
                      idx === currentQuestion
                        ? 'bg-purple/30 border border-purple/50 text-white'
                        : completedQuestions.includes(idx)
                        ? 'bg-green/20 border border-green/40 cursor-pointer hover:bg-green/30 text-white'
                        : 'bg-white/10 border border-white/20 text-white/80'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5">
                        {completedQuestions.includes(idx) && scores[idx] ? (
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                            scores[idx] >= 75 ? 'bg-green' : scores[idx] >= 60 ? 'bg-yellow' : 'bg-red'
                          }`}>
                            {scores[idx]}
                          </div>
                        ) : completedQuestions.includes(idx) ? (
                          <div className="w-6 h-6 rounded-[20px] bg-green flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-muted/50" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white/70 text-xs font-semibold mb-1">P{idx + 1}</p>
                        <p className="text-white/90 line-clamp-2 text-xs">{q.question}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Standard Info */}
              <div className="p-4 border-t border-muted/80 bg-background/50 flex-shrink-0">
                <p className="text-xs font-bold text-white/70 mb-2">ESTÁNDAR EJECUTIVO</p>
                <p className="text-xs text-white/85">75+ = Listo para entrevista executiva<br/>60-74 = Mejora necesaria<br/>{'<'}60 = Requiere trabajo</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
