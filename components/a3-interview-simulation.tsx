"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mic, Video, Clock, AlertTriangle } from "lucide-react"

interface InterviewSimulationProps {
  level: "basico" | "intermedio" | "avanzado" | "bonus"
  type: "guiada" | "estructurada" | "desafiante" | "presion"
  onComplete: (result: any) => void
}

const INTERVIEW_QUESTIONS = {
  basico: [
    "Háblame de ti y por qué te interesa este cargo",
    "¿Cuál es tu mayor fortaleza para este rol?",
    "¿Cuál es un área donde quieres crecer?"
  ],
  intermedio: [
    "Cuéntame sobre una vez que enfrentaste un desacuerdo con un compañero y cómo lo resolviste",
    "¿Cómo manejas la presión cuando tienes múltiples proyectos simultáneos?",
    "Describe un proyecto donde asumiste liderazgo no formal"
  ],
  avanzado: [
    "Imagine que tienes 3 prioridades en conflicto y solo puedes hacer 1. ¿Cómo decides?",
    "Cuéntame sobre una situación donde fallaste. ¿Qué aprendiste?",
    "¿Cómo manejarías una situación donde tu manager está equivocado en una decisión crítica?"
  ],
  bonus: [
    "Estás liderando un proyecto donde surge un conflicto cultural con otra área. ¿Estrategia?",
    "Tienes talento talentoso pero improductivo. ¿Acción?",
    "¿Cuál es tu visión profesional en 5 años y cómo este cargo te acerca?"
  ]
}

export function A3InterviewSimulation({ level, type, onComplete }: InterviewSimulationProps) {
  const [stage, setStage] = useState<"intro" | "question" | "recording" | "feedback">("intro")
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [feedback, setFeedback] = useState<any>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordedChunksRef = useRef<Blob[]>([])

  const questions = INTERVIEW_QUESTIONS[level] || INTERVIEW_QUESTIONS.basico
  const currentQuestion = questions[currentQuestionIdx]

  useEffect(() => {
    if (isRecording) {
      const timer = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isRecording])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      recordedChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        recordedChunksRef.current.push(event.data)
      }

      mediaRecorder.start()
      setIsRecording(true)
      setStage("recording")
    } catch (err) {
      console.error("Error accessing media:", err)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      generateMockFeedback()
    }
  }

  const generateMockFeedback = () => {
    // Simulate behavioral analysis
    const mockFeedback = {
      performance_score: Math.floor(Math.random() * 40 + 60), // 60-100
      vocal_confidence: Math.floor(Math.random() * 30 + 65),
      eye_contact: Math.floor(Math.random() * 40 + 50),
      clarity: Math.floor(Math.random() * 30 + 65),
      response_depth: Math.floor(Math.random() * 30 + 60),
      
      strengths: [
        "Respuesta enfocada y relevante",
        "Buen manejo de pausas",
        "Ejemplos concretos"
      ],
      improvements: [
        "Evita muletillas (ums, ahs)",
        "Aumenta contacto visual con cámara",
        "Expande en situaciones específicas"
      ],
      coach_feedback: "Excelente respuesta. Demostraste pensamiento estructurado y capacidad de reflexión. Próxima vez, intenta dar más contexto de la situación antes de la resolución."
    }

    setFeedback(mockFeedback)
    setStage("feedback")
  }

  const moveToNextQuestion = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1)
      setRecordingTime(0)
      setStage("question")
    } else {
      completeInterview()
    }
  }

  const completeInterview = () => {
    onComplete({
      level,
      type,
      questionsCompleted: questions.length,
      averageScore: feedback?.performance_score || 0,
      observations: feedback
    })
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getTypeLabel = () => {
    const labels: Record<string, string> = {
      guiada: "Guiada (Baja Presión)",
      estructurada: "Estructurada (Presión Moderada)",
      desafiante: "Desafiante (Alta Presión)",
      presion: "Bajo Presión (Máxima Presión)"
    }
    return labels[type] || type
  }

  if (stage === "intro") {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>A3.2 - Simulación de Entrevista</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded">
              <div className="text-sm text-gray-600">Tipo</div>
              <div className="font-medium">{getTypeLabel()}</div>
            </div>
            <div className="p-4 bg-green-50 rounded">
              <div className="text-sm text-gray-600">Nivel</div>
              <div className="font-medium capitalize">{level}</div>
            </div>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded">
            <div className="font-medium text-sm mb-2">Instrucciones</div>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>• Recibirás {questions.length} preguntas</li>
              <li>• Tienes 60-90 segundos por respuesta</li>
              <li>• La cámara estará encendida durante toda la entrevista</li>
              <li>• Después de cada respuesta recibirás feedback detallado</li>
              <li>• Respira profundo y recuerda: esto es para aprender, no para juzgar</li>
            </ul>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Asegúrate de tener buena iluminación, fondo limpio y cámara a la altura de los ojos.
            </AlertDescription>
          </Alert>

          <Button onClick={startRecording} className="w-full" size="lg">
            <Video className="w-4 h-4 mr-2" />
            Comenzar Simulación
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (stage === "recording") {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Pregunta {currentQuestionIdx + 1} de {questions.length}</CardTitle>
            </div>
            <Badge className="bg-red-600 flex items-center gap-2">
              <span className="animate-pulse">●</span>
              {formatTime(recordingTime)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gray-900 rounded-lg overflow-hidden aspect-video">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          </div>

          <div className="bg-blue-50 p-4 rounded border border-blue-200">
            <div className="text-sm text-gray-600 mb-2">Pregunta</div>
            <div className="text-lg font-medium">{currentQuestion}</div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={stopRecording} className="flex-1">
              <Mic className="w-4 h-4 mr-2" />
              Terminar Respuesta
            </Button>
          </div>

          {recordingTime > 90 && (
            <Alert className="bg-orange-50 border-orange-300">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                Estás excediendo el tiempo recomendado (60-90s). Intenta ser más conciso.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    )
  }

  if (stage === "feedback" && feedback) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Feedback de tu Respuesta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score Visualization */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-[28px] border border-blue-200">
            <div className="text-sm text-gray-600 mb-2">Desempeño en esta respuesta</div>
            <div className="text-4xl font-bold text-indigo-600 mb-2">
              {feedback.performance_score}%
            </div>
            <div className="bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full"
                style={{ width: `${feedback.performance_score}%` }}
              />
            </div>
          </div>

          {/* Metric Breakdown */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded">
              <div className="text-xs text-gray-600">Confianza Vocal</div>
              <div className="text-xl font-bold">{feedback.vocal_confidence}%</div>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <div className="text-xs text-gray-600">Contacto Visual</div>
              <div className="text-xl font-bold">{feedback.eye_contact}%</div>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <div className="text-xs text-gray-600">Claridad</div>
              <div className="text-xl font-bold">{feedback.clarity}%</div>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <div className="text-xs text-gray-600">Profundidad</div>
              <div className="text-xl font-bold">{feedback.response_depth}%</div>
            </div>
          </div>

          {/* Strengths */}
          <div className="bg-green-50 p-4 rounded border border-green-200">
            <div className="font-medium text-sm mb-2">✓ Lo que funcionó</div>
            <ul className="space-y-1">
              {feedback.strengths.map((str: string, idx: number) => (
                <li key={idx} className="text-sm text-gray-700">• {str}</li>
              ))}
            </ul>
          </div>

          {/* Improvements */}
          <div className="bg-amber-50 p-4 rounded border border-amber-200">
            <div className="font-medium text-sm mb-2">→ Áreas para mejorar</div>
            <ul className="space-y-1">
              {feedback.improvements.map((imp: string, idx: number) => (
                <li key={idx} className="text-sm text-gray-700">• {imp}</li>
              ))}
            </ul>
          </div>

          {/* Coach Narrative */}
          <div className="bg-blue-50 p-4 rounded border border-blue-200 italic">
            "{feedback.coach_feedback}"
          </div>

          {/* Next Action */}
          <Button
            onClick={moveToNextQuestion}
            className="w-full"
            size="lg"
          >
            {currentQuestionIdx < questions.length - 1
              ? `Siguiente Pregunta (${currentQuestionIdx + 2}/${questions.length})`
              : "Completar Entrevista"}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return null
}
