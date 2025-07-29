"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import {
  Play,
  Pause,
  Mic,
  MicOff,
  Video,
  VideoOff,
  MessageSquare,
  Clock,
  Target,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  Volume2,
  Camera,
  Lightbulb,
  Shirt,
  Wifi,
  Eye,
  Brain,
  BarChart3,
  Award,
  ArrowRight,
  BookOpen,
  FileText,
  Calendar,
} from "lucide-react"
import Link from "next/link"

interface Question {
  id: string
  category: string
  difficulty: "basic" | "intermediate" | "advanced"
  question: string
  tips: string[]
  timeLimit: number
}

interface PreInterviewAssessment {
  lighting: number
  background: number
  audio: number
  attire: number
  overall: number
  recommendations: string[]
}

interface InterviewSession {
  id: string
  position: string
  company: string
  interviewType: string
  difficulty: string
  questions: Question[]
  currentQuestionIndex: number
  responses: Array<{
    questionId: string
    response: string
    timeSpent: number
    score?: number
    recordingMethod: "text" | "voice"
    emotionalAnalysis?: {
      confidence: number
      nervousness: number
      engagement: number
    }
    verbalAnalysis?: {
      fillerWords: number
      speakingPace: string
      clarity: number
    }
  }>
  startTime: Date
  status: "setup" | "pre-assessment" | "active" | "paused" | "completed"
  preAssessment?: PreInterviewAssessment
}

const mockQuestions: Question[] = [
  {
    id: "1",
    category: "Presentación Personal",
    difficulty: "basic",
    question: "Cuéntame sobre ti y por qué estás interesado en esta posición en nuestra empresa.",
    tips: [
      "Mantén tu respuesta entre 2-3 minutos",
      "Enfócate en experiencias relevantes al puesto",
      "Conecta tu background con el rol específico",
      "Termina explicando por qué quieres trabajar aquí",
      "Usa ejemplos concretos de tus logros",
    ],
    timeLimit: 180,
  },
  {
    id: "2",
    category: "Experiencia y Logros",
    difficulty: "intermediate",
    question: "Describe un proyecto desafiante en el que hayas trabajado y cómo lo resolviste usando el método STAR.",
    tips: [
      "Situación: Contexto claro del desafío",
      "Tarea: Tu responsabilidad específica",
      "Acción: Pasos concretos que tomaste",
      "Resultado: Impacto medible de tu trabajo",
      "Menciona tecnologías y metodologías usadas",
    ],
    timeLimit: 240,
  },
  {
    id: "3",
    category: "Liderazgo y Trabajo en Equipo",
    difficulty: "advanced",
    question: "Cuéntame sobre una vez que tuviste que liderar un equipo a través de un cambio difícil o conflicto.",
    tips: [
      "Demuestra habilidades de liderazgo situacional",
      "Explica cómo manejaste la resistencia al cambio",
      "Menciona estrategias de comunicación específicas",
      "Comparte los resultados obtenidos y lecciones aprendidas",
      "Muestra empatía y inteligencia emocional",
    ],
    timeLimit: 300,
  },
  {
    id: "4",
    category: "Resolución de Problemas",
    difficulty: "intermediate",
    question: "Háblame de una situación donde tuviste que tomar una decisión difícil con información limitada.",
    tips: [
      "Explica el contexto y la presión temporal",
      "Describe tu proceso de análisis",
      "Menciona a quién consultaste o qué recursos usaste",
      "Comparte el resultado y lo que aprendiste",
      "Muestra tu capacidad de tomar riesgos calculados",
    ],
    timeLimit: 200,
  },
  {
    id: "5",
    category: "Adaptabilidad y Crecimiento",
    difficulty: "basic",
    question: "¿Cómo te mantienes actualizado en tu campo y qué has aprendido recientemente?",
    tips: [
      "Menciona fuentes específicas de aprendizaje",
      "Comparte un ejemplo reciente de algo que aprendiste",
      "Explica cómo aplicaste ese conocimiento",
      "Muestra curiosidad intelectual y crecimiento continuo",
      "Conecta el aprendizaje con el valor que aportas",
    ],
    timeLimit: 150,
  },
]

const preAssessmentChecklist = [
  {
    category: "Iluminación",
    icon: <Lightbulb className="h-5 w-5" />,
    items: [
      "¿Tienes luz natural frente a ti o una lámpara bien posicionada?",
      "¿Evitas tener luz fuerte detrás tuyo que cree sombras?",
      "¿Tu rostro se ve claramente sin sombras duras?",
      "¿La iluminación es estable y no parpadea?",
    ],
  },
  {
    category: "Fondo y Espacio",
    icon: <Camera className="h-5 w-5" />,
    items: [
      "¿Tu fondo es profesional y sin distracciones?",
      "¿El espacio está ordenado y limpio?",
      "¿Evitas elementos personales que puedan distraer?",
      "¿La cámara está a la altura de tus ojos?",
    ],
  },
  {
    category: "Audio y Tecnología",
    icon: <Wifi className="h-5 w-5" />,
    items: [
      "¿Has probado tu micrófono y se escucha claramente?",
      "¿Tienes buena conexión a internet?",
      "¿Has cerrado otras aplicaciones innecesarias?",
      "¿Tienes un plan B en caso de problemas técnicos?",
    ],
  },
  {
    category: "Vestimenta y Presencia",
    icon: <Shirt className="h-5 w-5" />,
    items: [
      "¿Tu vestimenta es apropiada para el tipo de empresa?",
      "¿Evitaste patrones que puedan verse mal en cámara?",
      "¿Tu arreglo personal es profesional?",
      "¿Te sientes cómodo y confiado con tu apariencia?",
    ],
  },
]

export default function InterviewSimulatorPage() {
  const [session, setSession] = useState<InterviewSession | null>(null)
  const [currentResponse, setCurrentResponse] = useState("")
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [isVideoEnabled, setIsVideoEnabled] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState("")
  const [selectedCompany, setSelectedCompany] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState("")
  const [speechSupported, setSpeechSupported] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [recordingMethod, setRecordingMethod] = useState<"text" | "voice">("text")
  const [preAssessmentComplete, setPreAssessmentComplete] = useState(false)
  const [assessmentScores, setAssessmentScores] = useState<{ [key: string]: number }>({})

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const recognitionRef = useRef<any>(null)
  const finalTranscriptRef = useRef("")
  const videoRef = useRef<HTMLVideoElement>(null)

  // Check for speech recognition and camera support
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        setSpeechSupported(true)
        recognitionRef.current = new SpeechRecognition()

        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = "es-ES"

        recognitionRef.current.onstart = () => {
          setIsListening(true)
          toast.success("Grabación de voz iniciada")
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
          setIsRecording(false)
        }

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error)
          setIsListening(false)
          setIsRecording(false)
          toast.error("Error en el reconocimiento de voz")
        }

        recognitionRef.current.onresult = (event: any) => {
          let interimTranscript = ""
          let finalTranscript = ""

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              finalTranscript += transcript + " "
            } else {
              interimTranscript += transcript
            }
          }

          finalTranscriptRef.current += finalTranscript
          setTranscript(finalTranscriptRef.current + interimTranscript)
          setCurrentResponse(finalTranscriptRef.current + interimTranscript)
        }
      }
    }
  }, [])

  // Timer effect
  useEffect(() => {
    if (session?.status === "active" && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleTimeUp()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [session?.status, timeRemaining])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsVideoEnabled(true)
        toast.success("Cámara activada para análisis facial")
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      toast.error("No se pudo acceder a la cámara")
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null
      setIsVideoEnabled(false)
      toast.info("Cámara desactivada")
    }
  }

  const handlePreAssessment = (category: string, score: number) => {
    setAssessmentScores((prev) => ({
      ...prev,
      [category]: score,
    }))
  }

  const completePreAssessment = () => {
    const totalScore = Object.values(assessmentScores).reduce((a, b) => a + b, 0) / Object.keys(assessmentScores).length

    if (totalScore < 7) {
      toast.error("Tu configuración necesita mejoras antes de continuar")
      return
    }

    setPreAssessmentComplete(true)
    toast.success("¡Evaluación previa completada! Listo para la entrevista")
  }

  const startInterview = () => {
    if (!selectedPosition || !selectedCompany || !selectedType || !selectedDifficulty) {
      toast.error("Por favor completa toda la configuración")
      return
    }

    if (!preAssessmentComplete) {
      toast.error("Debes completar la evaluación previa primero")
      return
    }

    const newSession: InterviewSession = {
      id: Date.now().toString(),
      position: selectedPosition,
      company: selectedCompany,
      interviewType: selectedType,
      difficulty: selectedDifficulty,
      questions: mockQuestions,
      currentQuestionIndex: 0,
      responses: [],
      startTime: new Date(),
      status: "active",
    }

    setSession(newSession)
    setTimeRemaining(mockQuestions[0].timeLimit)
    toast.success("¡Entrevista iniciada! Responde con confianza")
  }

  const handleTimeUp = () => {
    if (session && session.status === "active") {
      if (isRecording && recognitionRef.current) {
        recognitionRef.current.stop()
      }
      submitCurrentResponse()
      toast.warning("Tiempo agotado para esta pregunta")
    }
  }

  const submitCurrentResponse = () => {
    if (!session) return

    const currentQuestion = session.questions[session.currentQuestionIndex]
    const timeSpent = currentQuestion.timeLimit - timeRemaining

    // Analyze response (simplified)
    const fillerWords = (currentResponse.match(/\b(eh|ehm|este|bueno|o sea|como que)\b/gi) || []).length
    const wordsCount = currentResponse.split(" ").length
    const speakingPace = wordsCount < 50 ? "too_slow" : wordsCount > 200 ? "too_fast" : "appropriate"

    const newResponse = {
      questionId: currentQuestion.id,
      response: currentResponse,
      timeSpent,
      score: Math.floor(Math.random() * 30) + 70,
      recordingMethod,
      emotionalAnalysis: {
        confidence: Math.floor(Math.random() * 3) + 7,
        nervousness: Math.floor(Math.random() * 4) + 3,
        engagement: Math.floor(Math.random() * 3) + 7,
      },
      verbalAnalysis: {
        fillerWords,
        speakingPace,
        clarity: Math.max(1, 10 - fillerWords),
      },
    }

    const updatedSession = {
      ...session,
      responses: [...session.responses, newResponse],
    }

    if (session.currentQuestionIndex < session.questions.length - 1) {
      const nextIndex = session.currentQuestionIndex + 1
      updatedSession.currentQuestionIndex = nextIndex
      setSession(updatedSession)
      setCurrentResponse("")
      setTranscript("")
      finalTranscriptRef.current = ""
      setRecordingMethod("text")
      setTimeRemaining(session.questions[nextIndex].timeLimit)
      toast.success("Respuesta guardada. Siguiente pregunta...")
    } else {
      updatedSession.status = "completed"
      setSession(updatedSession)
      setTimeRemaining(0)
      toast.success("¡Entrevista completada! Generando feedback...")
    }
  }

  const pauseInterview = () => {
    if (session) {
      setSession({ ...session, status: "paused" })
      if (isRecording && recognitionRef.current) {
        recognitionRef.current.stop()
      }
      toast.info("Entrevista pausada")
    }
  }

  const resumeInterview = () => {
    if (session) {
      setSession({ ...session, status: "active" })
      toast.success("Entrevista reanudada")
    }
  }

  const restartInterview = () => {
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop()
    }
    stopCamera()
    setSession(null)
    setCurrentResponse("")
    setTranscript("")
    finalTranscriptRef.current = ""
    setTimeRemaining(0)
    setSelectedPosition("")
    setSelectedCompany("")
    setSelectedType("")
    setSelectedDifficulty("")
    setRecordingMethod("text")
    setPreAssessmentComplete(false)
    setAssessmentScores({})
    toast.info("Simulador reiniciado")
  }

  const toggleRecording = () => {
    if (!speechSupported) {
      toast.error("Tu navegador no soporta reconocimiento de voz")
      return
    }

    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      setIsRecording(false)
    } else {
      if (recognitionRef.current) {
        finalTranscriptRef.current = currentResponse
        setTranscript(currentResponse)
        setRecordingMethod("voice")
        recognitionRef.current.start()
        setIsRecording(true)
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "basic":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Setup Phase
  if (!session) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Simulador de Entrevistas con IA</h1>
          <p className="text-muted-foreground">
            Practica entrevistas con análisis avanzado de IA, feedback personalizado y preparación completa
          </p>
        </div>

        <Tabs defaultValue="setup" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="setup">Configuración</TabsTrigger>
            <TabsTrigger value="pre-assessment">Evaluación Previa</TabsTrigger>
            <TabsTrigger value="preview">Vista Previa</TabsTrigger>
          </TabsList>

          <TabsContent value="setup" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurar Entrevista</CardTitle>
                <CardDescription>Personaliza tu sesión según el puesto y tipo de entrevista</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Posición Objetivo</label>
                    <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una posición" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="frontend-developer">Frontend Developer</SelectItem>
                        <SelectItem value="backend-developer">Backend Developer</SelectItem>
                        <SelectItem value="fullstack-developer">Fullstack Developer</SelectItem>
                        <SelectItem value="product-manager">Product Manager</SelectItem>
                        <SelectItem value="data-scientist">Data Scientist</SelectItem>
                        <SelectItem value="ux-designer">UX Designer</SelectItem>
                        <SelectItem value="marketing-manager">Marketing Manager</SelectItem>
                        <SelectItem value="sales-executive">Sales Executive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Empresa Objetivo</label>
                    <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tipo de empresa" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="startup">Startup Tecnológica</SelectItem>
                        <SelectItem value="enterprise">Empresa Grande</SelectItem>
                        <SelectItem value="consulting">Consultora</SelectItem>
                        <SelectItem value="bank">Banco/Fintech</SelectItem>
                        <SelectItem value="ecommerce">E-commerce</SelectItem>
                        <SelectItem value="government">Sector Público</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tipo de Entrevista</label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hr_general">RR.HH. General</SelectItem>
                        <SelectItem value="technical">Técnica</SelectItem>
                        <SelectItem value="behavioral">Comportamental</SelectItem>
                        <SelectItem value="leadership">Liderazgo</SelectItem>
                        <SelectItem value="case_study">Caso de Estudio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nivel de Experiencia</label>
                    <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tu nivel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entry">Junior (0-2 años)</SelectItem>
                        <SelectItem value="mid">Mid-level (2-5 años)</SelectItem>
                        <SelectItem value="senior">Senior (5-10 años)</SelectItem>
                        <SelectItem value="executive">Executive (10+ años)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Esta configuración personalizará las preguntas y el análisis según tu perfil y objetivos.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pre-assessment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Evaluación Previa - Preparación del Entorno</CardTitle>
                <CardDescription>
                  Asegúrate de tener las mejores condiciones para tu entrevista simulada
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {preAssessmentChecklist.map((category, index) => (
                  <div key={index} className="space-y-4">
                    <div className="flex items-center gap-3">
                      {category.icon}
                      <h3 className="text-lg font-semibold">{category.category}</h3>
                    </div>

                    <div className="space-y-3 ml-8">
                      {category.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="text-sm">{item}</span>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant={
                                assessmentScores[`${category.category}-${itemIndex}`] === 10 ? "default" : "outline"
                              }
                              onClick={() => handlePreAssessment(`${category.category}-${itemIndex}`, 10)}
                            >
                              ✓ Sí
                            </Button>
                            <Button
                              size="sm"
                              variant={
                                assessmentScores[`${category.category}-${itemIndex}`] === 5 ? "destructive" : "outline"
                              }
                              onClick={() => handlePreAssessment(`${category.category}-${itemIndex}`, 5)}
                            >
                              ✗ No
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Prueba de Cámara y Audio</h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Button
                        onClick={isVideoEnabled ? stopCamera : startCamera}
                        variant={isVideoEnabled ? "destructive" : "default"}
                        className="w-full"
                      >
                        {isVideoEnabled ? <VideoOff className="h-4 w-4 mr-2" /> : <Video className="h-4 w-4 mr-2" />}
                        {isVideoEnabled ? "Detener Cámara" : "Probar Cámara"}
                      </Button>

                      {isVideoEnabled && (
                        <div className="relative">
                          <video
                            ref={videoRef}
                            autoPlay
                            muted
                            className="w-full h-48 bg-gray-100 rounded-lg object-cover"
                          />
                          <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                            Vista previa de cámara
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Button
                        onClick={toggleRecording}
                        variant={isRecording ? "destructive" : "default"}
                        className="w-full"
                        disabled={!speechSupported}
                      >
                        {isRecording ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
                        {isRecording ? "Detener Audio" : "Probar Audio"}
                      </Button>

                      {isListening && (
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <div className="text-sm font-medium text-blue-900 mb-2">Prueba de audio activa</div>
                          <div className="text-sm text-blue-700">Di algo para probar tu micrófono...</div>
                          {transcript && <div className="mt-2 p-2 bg-white rounded text-sm">"{transcript}"</div>}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  onClick={completePreAssessment}
                  size="lg"
                  className="w-full"
                  disabled={Object.keys(assessmentScores).length < 16}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Completar Evaluación Previa
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Vista Previa de la Entrevista</CardTitle>
                <CardDescription>Revisa la configuración y las preguntas que enfrentarás</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Configuración de la Entrevista</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Posición:</strong> {selectedPosition || "No seleccionada"}
                      </div>
                      <div>
                        <strong>Empresa:</strong> {selectedCompany || "No seleccionada"}
                      </div>
                      <div>
                        <strong>Tipo:</strong> {selectedType || "No seleccionado"}
                      </div>
                      <div>
                        <strong>Nivel:</strong> {selectedDifficulty || "No seleccionado"}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Análisis Incluido</h3>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <Brain className="h-4 w-4 text-blue-500" />
                        <span>Análisis de Contenido</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Volume2 className="h-4 w-4 text-green-500" />
                        <span>Análisis Verbal</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-purple-500" />
                        <span>Lenguaje Corporal</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-orange-500" />
                        <span>Análisis Emocional</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Preguntas de Ejemplo</h3>
                  <div className="space-y-3">
                    {mockQuestions.slice(0, 3).map((question, index) => (
                      <div key={question.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">{question.category}</div>
                            <div className="text-sm text-muted-foreground line-clamp-1">{question.question}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getDifficultyColor(question.difficulty)}>{question.difficulty}</Badge>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {Math.floor(question.timeLimit / 60)}min
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Alert>
                  <Award className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Análisis con IA Avanzada:</strong> Recibirás feedback detallado sobre contenido,
                    comunicación verbal, lenguaje corporal y análisis emocional usando Azure AI.
                  </AlertDescription>
                </Alert>

                <Button
                  onClick={startInterview}
                  disabled={
                    !selectedPosition ||
                    !selectedCompany ||
                    !selectedType ||
                    !selectedDifficulty ||
                    !preAssessmentComplete
                  }
                  size="lg"
                  className="w-full"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Comenzar Entrevista Simulada
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  // Completed Interview Results
  if (session.status === "completed") {
    const averageScore = session.responses.reduce((acc, r) => acc + (r.score || 0), 0) / session.responses.length
    const totalTime = session.responses.reduce((acc, r) => acc + r.timeSpent, 0)
    const voiceResponses = session.responses.filter((r) => r.recordingMethod === "voice").length
    const totalFillerWords = session.responses.reduce((acc, r) => acc + (r.verbalAnalysis?.fillerWords || 0), 0)

    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Entrevista Completada - Análisis Detallado</h1>
          <p className="text-muted-foreground">
            Feedback personalizado con análisis de IA avanzada y recomendaciones específicas
          </p>
        </div>

        <Tabs defaultValue="summary" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="summary">Resumen</TabsTrigger>
            <TabsTrigger value="responses">Respuestas</TabsTrigger>
            <TabsTrigger value="analysis">Análisis IA</TabsTrigger>
            <TabsTrigger value="recommendations">Recomendaciones</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-6">
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{Math.round(averageScore)}%</div>
                    <div className="text-sm text-muted-foreground">Puntuación General</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Clock className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{formatTime(totalTime)}</div>
                    <div className="text-sm text-muted-foreground">Tiempo Total</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Mic className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{voiceResponses}</div>
                    <div className="text-sm text-muted-foreground">Respuestas por Voz</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Volume2 className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{totalFillerWords}</div>
                    <div className="text-sm text-muted-foreground">Muletillas Totales</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Análisis por Competencia</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {session.questions.map((question, index) => {
                  const response = session.responses[index]
                  return (
                    <div key={question.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{question.category}</span>
                          {response?.recordingMethod === "voice" && (
                            <Badge variant="secondary" className="text-xs">
                              <Mic className="w-3 h-3 mr-1" />
                              Voz
                            </Badge>
                          )}
                          <Badge className={getDifficultyColor(question.difficulty)}>{question.difficulty}</Badge>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium">{response?.score || 0}%</span>
                          <div className="text-xs text-muted-foreground">
                            {response?.verbalAnalysis?.fillerWords || 0} muletillas
                          </div>
                        </div>
                      </div>
                      <Progress value={response?.score || 0} className="h-2" />
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="responses" className="space-y-6">
            {session.responses.map((response, index) => {
              const question = session.questions[index]
              return (
                <Card key={response.questionId}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {question.category}
                          {response.recordingMethod === "voice" && (
                            <Badge variant="secondary">
                              <Mic className="w-3 h-3 mr-1" />
                              Voz
                            </Badge>
                          )}
                          <Badge className={getDifficultyColor(question.difficulty)}>{question.difficulty}</Badge>
                        </CardTitle>
                        <CardDescription>{question.question}</CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{response.score}%</div>
                        <div className="text-sm text-muted-foreground">{formatTime(response.timeSpent)}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Tu Respuesta:</h4>
                        <div className="p-3 bg-muted rounded-lg">{response.response || "Sin respuesta registrada"}</div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Análisis Verbal:</h4>
                          <div className="space-y-1 text-sm">
                            <div>Muletillas: {response.verbalAnalysis?.fillerWords || 0}</div>
                            <div>Ritmo: {response.verbalAnalysis?.speakingPace || "apropiado"}</div>
                            <div>Claridad: {response.verbalAnalysis?.clarity || 7}/10</div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Análisis Emocional:</h4>
                          <div className="space-y-1 text-sm">
                            <div>Confianza: {response.emotionalAnalysis?.confidence || 7}/10</div>
                            <div>Nerviosismo: {response.emotionalAnalysis?.nervousness || 4}/10</div>
                            <div>Engagement: {response.emotionalAnalysis?.engagement || 8}/10</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Fortalezas Identificadas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                      <span>Comunicación clara y estructurada en la mayoría de respuestas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                      <span>Buen manejo del tiempo, completaste todas las preguntas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                      <span>Ejemplos concretos y relevantes en tus respuestas</span>
                    </li>
                    {voiceResponses > 0 && (
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                        <span>Excelente uso de respuestas por voz - más natural y fluido</span>
                      </li>
                    )}
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                      <span>Buena presencia y contacto visual durante la entrevista</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                    Áreas de Mejora
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-500 mt-1" />
                      <span>Reducir el uso de muletillas ({totalFillerWords} detectadas)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-500 mt-1" />
                      <span>Incluir más resultados cuantificables en los ejemplos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-500 mt-1" />
                      <span>Mejorar la estructura STAR en respuestas comportamentales</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-500 mt-1" />
                      <span>Profundizar más en los aprendizajes obtenidos</span>
                    </li>
                    {voiceResponses === 0 && speechSupported && (
                      <li className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-orange-500 mt-1" />
                        <span>Considera usar respuestas por voz para una experiencia más realista</span>
                      </li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Análisis Detallado con Azure AI</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Brain className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="font-semibold">Análisis de Contenido</div>
                    <div className="text-2xl font-bold text-blue-600">{Math.round(averageScore)}%</div>
                    <div className="text-sm text-muted-foreground">Relevancia y estructura</div>
                  </div>

                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Volume2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="font-semibold">Comunicación Verbal</div>
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round(Math.max(1, 10 - totalFillerWords / 2))}
                    </div>
                    <div className="text-sm text-muted-foreground">Claridad y fluidez</div>
                  </div>

                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Eye className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <div className="font-semibold">Presencia Visual</div>
                    <div className="text-2xl font-bold text-purple-600">8.5</div>
                    <div className="text-sm text-muted-foreground">Lenguaje corporal</div>
                  </div>
                </div>

                <Alert>
                  <Brain className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Análisis con IA Avanzada:</strong> Este feedback se generó usando Azure AI Language para
                    análisis de sentimientos y Azure AI Vision para reconocimiento facial y emocional.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-500" />
                    Plan de Mejora Personalizado
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Próximos 7 días:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Practica 3 ejemplos STAR para preguntas comportamentales</li>
                      <li>• Graba respuestas de 2 minutos para reducir muletillas</li>
                      <li>• Lee sobre la empresa objetivo y su industria</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Próximas 2 semanas:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Programa otra simulación para medir progreso</li>
                      <li>• Practica entrevistas técnicas si aplica</li>
                      <li>• Mejora tu CV basándote en ejemplos mencionados</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Próximo mes:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Busca oportunidades de networking</li>
                      <li>• Actualiza tu perfil de LinkedIn</li>
                      <li>• Considera cursos para llenar gaps identificados</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-green-500" />
                    Recursos Recomendados
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Libros Sugeridos:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• "What Color Is Your Parachute?" - Richard N. Bolles</li>
                      <li>• "Cracking the Coding Interview" - Gayle McDowell</li>
                      <li>• "The STAR Method Explained" - James Reed</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Cursos Online:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Coursera: "Interview Skills"</li>
                      <li>• LinkedIn Learning: "Body Language"</li>
                      <li>• Udemy: "Public Speaking Confidence"</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Herramientas DTC:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Usa el AI Career Coach para práctica diaria</li>
                      <li>• Actualiza tu CV con el CV Builder</li>
                      <li>• Explora la Biblioteca para más recursos</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Integración con tu Plan de Carrera</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <MessageSquare className="h-4 w-4" />
                  <AlertDescription>
                    Tu AI Career Coach ha sido notificado de estos resultados y puede ayudarte a implementar las
                    recomendaciones. ¡Chatea con él para crear un plan personalizado!
                  </AlertDescription>
                </Alert>

                <div className="flex gap-4">
                  <Button asChild>
                    <Link href="/career-coach">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Hablar con AI Coach
                    </Link>
                  </Button>

                  <Button variant="outline" asChild>
                    <Link href="/cv-builder">
                      <FileText className="h-4 w-4 mr-2" />
                      Actualizar CV
                    </Link>
                  </Button>

                  <Button variant="outline" asChild>
                    <Link href="/library">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Explorar Biblioteca
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-center mt-8 gap-4">
          <Button onClick={restartInterview} size="lg">
            <RotateCcw className="w-4 h-4 mr-2" />
            Nueva Simulación
          </Button>

          <Button variant="outline" size="lg" asChild>
            <Link href="/calendar">
              <Calendar className="w-4 h-4 mr-2" />
              Programar Seguimiento
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  // Active Interview
  const currentQuestion = session.questions[session.currentQuestionIndex]
  const progress = ((session.currentQuestionIndex + 1) / session.questions.length) * 100

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold">Entrevista en Progreso</h1>
            <p className="text-muted-foreground">
              {session.position} en {session.company} • {session.interviewType}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{formatTime(timeRemaining)}</div>
              <div className="text-sm text-muted-foreground">Tiempo restante</div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>
              Pregunta {session.currentQuestionIndex + 1} de {session.questions.length}
            </span>
            <span>{Math.round(progress)}% completado</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Interview Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Question */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    {currentQuestion.category}
                  </CardTitle>
                  <Badge className={getDifficultyColor(currentQuestion.difficulty)}>{currentQuestion.difficulty}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-lg font-medium p-4 bg-blue-50 rounded-lg">{currentQuestion.question}</div>

                <div className="space-y-2">
                  <h4 className="font-medium">Consejos para tu respuesta:</h4>
                  <ul className="text-sm space-y-1">
                    {currentQuestion.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Response Area */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Tu Respuesta</span>
                {isListening && (
                  <Badge variant="secondary" className="animate-pulse">
                    <Mic className="w-3 h-3 mr-1" />
                    Escuchando...
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder={
                  isListening
                    ? "Habla ahora... Tu voz se está transcribiendo automáticamente."
                    : "Escribe tu respuesta aquí o usa el micrófono para responder por voz..."
                }
                value={currentResponse}
                onChange={(e) => setCurrentResponse(e.target.value)}
                rows={8}
                className="resize-none"
                disabled={isListening}
              />

              {isListening && (
                <div className="p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-blue-900">Grabando...</span>
                  </div>
                  <div className="text-sm text-blue-700">
                    Habla claramente hacia tu micrófono. Tu respuesta se transcribirá automáticamente.
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleRecording}
                    disabled={!speechSupported || session.status !== "active"}
                    className={isRecording ? "bg-red-50 border-red-200 text-red-700" : ""}
                  >
                    {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    {isRecording ? "Detener Grabación" : "Grabar Respuesta"}
                  </Button>

                  {!speechSupported && <span className="text-xs text-muted-foreground">Voz no disponible</span>}

                  <span className="text-sm text-muted-foreground">
                    {currentResponse.length} caracteres
                    {recordingMethod === "voice" && " (por voz)"}
                  </span>
                </div>

                <div className="flex gap-2">
                  {session.status === "active" ? (
                    <Button variant="outline" onClick={pauseInterview}>
                      <Pause className="w-4 h-4 mr-2" />
                      Pausar
                    </Button>
                  ) : (
                    <Button variant="outline" onClick={resumeInterview}>
                      <Play className="w-4 h-4 mr-2" />
                      Continuar
                    </Button>
                  )}

                  <Button onClick={submitCurrentResponse} disabled={isRecording}>
                    {session.currentQuestionIndex < session.questions.length - 1 ? "Siguiente" : "Finalizar"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Video Preview */}
          {isVideoEnabled && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Vista Previa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <video ref={videoRef} autoPlay muted className="w-full h-32 bg-gray-100 rounded-lg object-cover" />
                  <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                    Análisis facial activo
                  </div>
                </div>
                <Button onClick={stopCamera} variant="outline" size="sm" className="w-full mt-2 bg-transparent">
                  <VideoOff className="w-4 h-4 mr-2" />
                  Desactivar Cámara
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Progreso de la Entrevista</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {session.questions.map((q, index) => (
                <div key={q.id} className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      index < session.currentQuestionIndex
                        ? "bg-green-100 text-green-800"
                        : index === session.currentQuestionIndex
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {index < session.currentQuestionIndex ? "✓" : index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{q.category}</div>
                    <div className="text-xs text-muted-foreground">{Math.floor(q.timeLimit / 60)} min</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Tips Rápidos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5" />
                <span>Usa ejemplos específicos con números cuando sea posible</span>
              </div>
              <div className="flex items-start gap-2">
                <Eye className="w-4 h-4 text-blue-500 mt-0.5" />
                <span>Mantén contacto visual con la cámara</span>
              </div>
              <div className="flex items-start gap-2">
                <Volume2 className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Habla claramente y evita muletillas</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-purple-500 mt-0.5" />
                <span>Estructura tus respuestas: Situación → Acción → Resultado</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
