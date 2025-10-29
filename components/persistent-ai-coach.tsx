"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import {
  Send,
  Bot,
  User,
  Lightbulb,
  TrendingUp,
  Target,
  MessageSquare,
  Sparkles,
  Brain,
  ArrowLeft,
  Mic,
  MicOff,
} from "lucide-react"
import { useRouter } from "next/navigation"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  type?: "suggestion" | "insight" | "question"
}

interface Suggestion {
  id: string
  text: string
  category: "career" | "skills" | "development"
  priority: "high" | "medium" | "low"
}

interface Insight {
  id: string
  title: string
  description: string
  category: "personality" | "career" | "skills"
  confidence: number
  actionable: boolean
}

export function PersistentAICoach() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [insights, setInsights] = useState<Insight[]>([])
  const [activeTab, setActiveTab] = useState("chat")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [isListening, setIsListening] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const recognitionRef = useRef<any>(null)
  const isListeningRef = useRef(false)
  const noSpeechRetriesRef = useRef(0)
  const isTogglingRef = useRef(false)
  const maxRetries = 3
  const listeningTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const maxListeningTime = 30000 // 30 segundos máximo

  useEffect(() => {
    const welcomeMessage: Message = {
      id: "1",
      content:
        "¡Hola! Soy tu Coach de Carrera IA. Estoy aquí para ayudarte con orientación de carrera, desarrollo de habilidades y crecimiento profesional. Puedo analizar tus resultados de evaluación, proporcionar recomendaciones personalizadas y ayudarte a crear planes de acción. ¿En qué puedo asistirte hoy?",
      sender: "ai",
      timestamp: new Date(),
      type: "question",
    }
    setMessages([welcomeMessage])

    // Sample suggestions based on user profile
    setSuggestions([
      {
        id: "1",
        text: "Considera desarrollar tus habilidades de liderazgo a través de cursos en línea o programas de mentoría",
        category: "skills",
        priority: "high",
      },
      {
        id: "2",
        text: "Explora oportunidades de networking en tu industria para expandir tus conexiones profesionales",
        category: "career",
        priority: "medium",
      },
      {
        id: "3",
        text: "Establece reuniones regulares con tu jefe para discutir tu progreso de carrera",
        category: "development",
        priority: "high",
      },
      {
        id: "4",
        text: "Actualiza tu perfil de LinkedIn para reflejar tus logros recientes y habilidades",
        category: "career",
        priority: "medium",
      },
      {
        id: "5",
        text: "Considera obtener una certificación profesional en tu campo",
        category: "development",
        priority: "low",
      },
    ])

    // Sample insights based on assessment results
    setInsights([
      {
        id: "1",
        title: "Fuerte Pensamiento Analítico",
        description:
          "Basado en tus resultados de evaluación, demuestras excelentes capacidades de análisis y resolución de problemas. Esta es una valiosa asset en roles de liderazgo y posiciones estratégicas.",
        category: "personality",
        confidence: 92,
        actionable: true,
      },
      {
        id: "2",
        title: "Potencial de Liderazgo",
        description:
          "Tu estilo de comunicación y toma de decisiones sugieren fuerte potencial de liderazgo. Considera buscar oportunidades para liderar proyectos o mentorizar a colegas más jóvenes.",
        category: "career",
        confidence: 87,
        actionable: true,
      },
      {
        id: "3",
        title: "Estilo de Trabajo Colaborativo",
        description:
          "Demuestras una preferencia por entornos colaborativos y resolución de problemas en equipo. Esto te hace bien adaptado para roles interfuncionales y liderazgo de equipos.",
        category: "skills",
        confidence: 89,
        actionable: true,
      },
      {
        id: "4",
        title: "Mente Abierta al Crecimiento",
        description:
          "Tus respuestas indican una fuerte mente abierta al crecimiento y disposición para aprender. Esto es crucial para el avance de la carrera y adaptarse a los demandas cambiantes del mercado laboral.",
        category: "personality",
        confidence: 94,
        actionable: false,
      },
    ])
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        setSpeechSupported(true)
        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = true
        recognition.lang = "es-ES"
        recognition.maxAlternatives = 1

        recognition.onstart = () => {
          console.log("[v0] Speech recognition started")
          noSpeechRetriesRef.current = 0

          // Establecer timeout máximo de escucha
          listeningTimeoutRef.current = setTimeout(() => {
            console.log("[v0] Max listening time reached, stopping")
            if (recognitionRef.current && isListeningRef.current) {
              isListeningRef.current = false
              setIsListening(false)
              recognitionRef.current.stop()
            }
          }, maxListeningTime)
        }

        recognition.onresult = (event: any) => {
          console.log("[v0] Speech recognition result received")
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result) => result.transcript)
            .join("")

          console.log("[v0] Transcript:", transcript)
          setInputMessage(transcript)

          // Si obtuvimos un resultado final, detener
          if (event.results[event.results.length - 1].isFinal) {
            console.log("[v0] Final result received, stopping")
            isListeningRef.current = false
            setIsListening(false)
            if (listeningTimeoutRef.current) {
              clearTimeout(listeningTimeoutRef.current)
            }
          }
        }

        recognition.onerror = (event: any) => {
          console.log("[v0] Speech recognition error:", event.error)

          // Manejar el error "no-speech" de manera especial
          if (event.error === "no-speech") {
            console.log("[v0] No speech detected, retry count:", noSpeechRetriesRef.current)
            console.log("[v0] Is listening ref:", isListeningRef.current)

            // Reintentar automáticamente si no hemos excedido el límite Y todavía estamos escuchando
            if (noSpeechRetriesRef.current < maxRetries && isListeningRef.current) {
              noSpeechRetriesRef.current++
              console.log("[v0] Retrying... attempt", noSpeechRetriesRef.current)

              // Pequeña pausa antes de reintentar
              setTimeout(() => {
                if (isListeningRef.current && recognitionRef.current) {
                  try {
                    console.log("[v0] Restarting recognition")
                    recognitionRef.current.start()
                  } catch (e) {
                    console.log("[v0] Error restarting:", e)
                    isListeningRef.current = false
                    setIsListening(false)
                  }
                }
              }, 100)
              return // No ejecutar el código de limpieza abajo
            } else {
              console.log("[v0] Max retries reached or not listening, stopping")
            }
          } else if (event.error === "aborted") {
            // El usuario detuvo manualmente, no hacer nada
            console.log("[v0] Recognition aborted by user")
          } else {
            // Otros errores (not-allowed, network, etc.)
            console.error("[v0] Speech recognition error:", event.error)
          }

          // Limpiar estado
          isListeningRef.current = false
          setIsListening(false)
          if (listeningTimeoutRef.current) {
            clearTimeout(listeningTimeoutRef.current)
          }
        }

        recognition.onend = () => {
          console.log("[v0] Speech recognition ended")
          console.log("[v0] Retry count:", noSpeechRetriesRef.current)
          console.log("[v0] Is listening ref:", isListeningRef.current)

          if (noSpeechRetriesRef.current >= maxRetries || !isListeningRef.current) {
            console.log("[v0] Cleaning up listening state")
            isListeningRef.current = false
            setIsListening(false)
            if (listeningTimeoutRef.current) {
              clearTimeout(listeningTimeoutRef.current)
            }
          }
        }

        recognitionRef.current = recognition
      }
    }

    // Cleanup
    return () => {
      if (listeningTimeoutRef.current) {
        clearTimeout(listeningTimeoutRef.current)
      }
    }
  }, [])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    // Simulate AI response with more realistic delay
    setTimeout(
      () => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: generateAIResponse(inputMessage),
          sender: "ai",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiResponse])
        setIsLoading(false)
      },
      1500 + Math.random() * 1000,
    ) // 1.5-2.5 second delay
  }

  const generateAIResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase()

    // Career-related responses
    if (lowerInput.includes("career") || lowerInput.includes("job") || lowerInput.includes("promotion")) {
      return "¡Buen pregunta sobre el desarrollo de carrera! Basado en tu perfil, te recomiendo enfocarte en tres áreas clave: 1) Desarrollar tus habilidades de liderazgo a través de asignaciones de crecimiento, 2) Expandir tu red dentro y fuera de tu organización, y 3) Desarrollar experticia en tecnologías emergentes relevantes para tu campo. ¿Te gustaría que me detallara más alguna de estas áreas?"
    }

    // Skills development responses
    if (lowerInput.includes("skill") || lowerInput.includes("learn") || lowerInput.includes("develop")) {
      return "El desarrollo de habilidades es crucial para el avance de la carrera ¡Tus resultados de evaluación muestran fuertes habilidades analíticas, lo cual es excelente. Te recomiendo enfocarte en habilidades complementarias como comunicación, gestión de proyectos y pensamiento estratégico. Considera cursos en línea, talleres o encontrar un mentor en estos áreas. ¿Qué habilidades específicas te interesa desarrollar?"
    }

    // Assessment-related responses
    if (lowerInput.includes("test") || lowerInput.includes("assessment") || lowerInput.includes("result")) {
      return "¡Los resultados de tu evaluación proporcionan valiosos insights en tu estilo de trabajo y preferencias! Muestran que tienes fuertes habilidades de resolución de problemas y trabajas bien en entornos colaborativos. Estas fortalezas te posicionan bien para roles de liderazgo. Puedo ayudarte a entender cómo aprovechar estos insights para planificación de carrera. ¿Qué aspecto de tus resultados te gustaría explorar más?"
    }

    // Leadership responses
    if (lowerInput.includes("leader") || lowerInput.includes("manage") || lowerInput.includes("team")) {
      return "¡El liderazgo es un área donde demuestras gran potencial! Tu estilo de comunicación y trabajo colaborativo son sólidos fundamentos. Para desarrollarlo más, considera: 1) Solicitar retroalimentación de tus compañeros de equipo, 2) Asumir proyectos interfuncionales, 3) Encontrar un mentor de liderazgo y 4) Practicar la escucha activa y la delegación de tareas. ¿Cuáles desafíos de liderazgo estás enfrentando actualmente?"
    }

    // Networking responses
    if (lowerInput.includes("network") || lowerInput.includes("connect") || lowerInput.includes("relationship")) {
      return "¡El networking es esencial para el avance de la carrera! Aquí tienes algunas estrategias adaptadas a tu perfil: 1) Asiste a conferencias y meetups de la industria, 2) Engaja activamente en LinkedIn con comentarios y publicaciones significativas, 3) Ponte en contacto con colegas de tu escuela, 4) Únete a asociaciones profesionales en tu campo. Las conexiones de calidad son más valiosas que la cantidad. ¿Qué objetivos de networking te gustaría establecer?"
    }

    // Default responses
    const defaultResponses = [
      "¡Esa es una excelente pregunta! Basado en tus resultados de evaluación y perfil de carrera, puedo ver varias oportunidades de crecimiento. Tus habilidades analíticas y estilo de trabajo colaborativo son activos valiosos. Permíteme ayudarte a crear un plan de acción específico. ¿Cuál es tu objetivo de carrera principal en este momento?",
      "Entiendo tu preocupación, y es algo que muchos profesionales enfrentan. Tus resultados de evaluación muestran que tienes las capacidades para superar este desafío. Vamos a desglosarlo en pasos manejables y crear un plan de desarrollo que aproveche tus fortalezas.",
      "¡Esta es una área excelente en la que enfocarte! Tu perfil de personalidad sugiere que te desempeñarías bien en esta dirección. Te recomiendo empezar con pequeños objetivos alcanzables y construir momentum. ¿Qué resultado específico estás buscando alcanzar?",
      "Basado en tus resultados, tienes fuerte potencial en esta área. Te recomiendo combinar tus fortalezas naturales con un desarrollo de habilidades dirigido. Vamos a explorar estrategias específicas que se alineen con tu estilo de trabajo y aspiraciones de carrera.",
    ]

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  const handleSuggestionClick = (suggestion: Suggestion) => {
    const message: Message = {
      id: Date.now().toString(),
      content: `Dime más sobre: ${suggestion.text}`,
      sender: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, message])
    setActiveTab("chat")

    // Auto-generate AI response for the suggestion
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateSuggestionResponse(suggestion),
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
    }, 1000)
  }

  const generateSuggestionResponse = (suggestion: Suggestion): string => {
    switch (suggestion.category) {
      case "skills":
        return "¡Excelente elección! Las habilidades de liderazgo son cruciales para el avance de la carrera. Te recomiendo empezar con estas acciones específicas: 1) Voluntariarte para liderar un pequeño proyecto o iniciativa, 2) Tomar un curso en línea de liderazgo (puedo recomendarte algunos), 3) Encontrar un mentor que ejemplifique el estilo de liderazgo que admiras, 4) Practicar dar presentaciones para construir confianza. ¿Te gustaría que te ayudara a crear un plan de desarrollo de liderazgo específico de 90 días?"

      case "career":
        return "¡El networking es uno de los métodos más efectivos para el avance de la carrera! Aquí tienes un enfoque práctico: 1) Establecer un objetivo de hacer 2-3 nuevas conexiones profesionales al mes, 2) Asistir a eventos de la industria o meetups virtuales, 3) Engajar significativamente en LinkedIn comentando en publicaciones de tu campo, 4) Ponerte en contacto con colegas para entrevistas informativas. Tu estilo de trabajo colaborativo será un gran activo en el networking. ¿Qué eventos de la industria o grupos te interesan más?"

      case "development":
        return "¡Las reuniones regulares con tu jefe son increíblemente valiosas para el avance de la carrera! Aquí tienes cómo hacerlas más efectivas: 1) Preparar una agenda con tus objetivos y desafíos, 2) Pedir retroalimentación específica sobre tu rendimiento, 3) Discutir tus aspiraciones de carrera y obtener su opinión, 4) Solicitar asignaciones de crecimiento o nuevas responsabilidades. Tus habilidades analíticas te ayudarán a prepararte bien para estas reuniones. ¿Cuándo fue tu última reunión significativa de carrera con tu jefe?"

      default:
        return "¡Esta es una área excelente en la que enfocarte! Basado en tu perfil, tienes la base correcta para tener éxito en esta. Permíteme ayudarte a crear un plan de acción específico con objetivos y líneas de tiempo medibles. ¿Cuál es tu mayor desafío en esta área en este momento?"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive/10 text-destructive border-destructive/20"
      case "medium":
        return "bg-muted text-mutedForeground border-border"
      case "low":
        return "bg-secondary text-secondaryForeground border-border"
      default:
        return "bg-muted text-mutedForeground border-border"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "career":
        return Target
      case "skills":
        return TrendingUp
      case "development":
        return Lightbulb
      case "personality":
        return Brain
      default:
        return MessageSquare
    }
  }

  const quickStartQuestions = [
    "¿Cómo puedo avanzar en mi rol actual?",
    "¿Qué habilidades debería desarrollar a continuación?",
    "Ayúdame a entender mis resultados de evaluación",
    "¿Cómo puedo mejorar mis habilidades de liderazgo?",
    "¿Qué carreras se ajustan a mi personalidad?",
    "¿Cómo construyo una red profesional?",
  ]

  const toggleListening = () => {
    if (!recognitionRef.current) return

    if (isTogglingRef.current) {
      console.log("[v0] Toggle already in progress, ignoring")
      return
    }

    isTogglingRef.current = true

    if (isListening) {
      console.log("[v0] Stopping recognition manually")
      isListeningRef.current = false
      noSpeechRetriesRef.current = maxRetries
      setIsListening(false)
      recognitionRef.current.stop()
      if (listeningTimeoutRef.current) {
        clearTimeout(listeningTimeoutRef.current)
      }
      setTimeout(() => {
        isTogglingRef.current = false
      }, 300)
    } else {
      console.log("[v0] Starting recognition")
      noSpeechRetriesRef.current = 0
      isListeningRef.current = true
      setIsListening(true)
      try {
        recognitionRef.current.start()
        setTimeout(() => {
          isTogglingRef.current = false
        }, 300)
      } catch (e) {
        console.error("[v0] Error starting recognition:", e)
        isListeningRef.current = false
        setIsListening(false)
        isTogglingRef.current = false
      }
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" onClick={() => router.push("/")} className="border-border hover:bg-muted">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Inicio
          </Button>
          <Badge variant="secondary" className="bg-muted text-mutedForeground">
            <Bot className="h-3 w-3 mr-1" />
            Potenciado por IA
          </Badge>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Coach de Carrera IA</h1>
        <p className="text-mutedForeground">
          Obtén orientación profesional personalizada, insights y recomendaciones accionables basadas en tu perfil único
          y resultados de evaluación.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-muted">
          <TabsTrigger value="chat" className="data-[state=active]:bg-background">
            <MessageSquare className="h-4 w-4 mr-2" />
            Chat ({messages.length})
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="data-[state=active]:bg-background">
            <Lightbulb className="h-4 w-4 mr-2" />
            Sugerencias ({suggestions.length})
          </TabsTrigger>
          <TabsTrigger value="insights" className="data-[state=active]:bg-background">
            <Sparkles className="h-4 w-4 mr-2" />
            Insights ({insights.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="mt-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <Bot className="h-5 w-5 mr-2" />
                Sesión de Coaching de Carrera
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96 mb-4 pr-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          message.sender === "user"
                            ? "bg-foreground text-background"
                            : "bg-muted text-foreground border border-border"
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          {message.sender === "ai" && <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                          {message.sender === "user" && <User className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                          <div className="flex-1">
                            <p className="text-sm leading-relaxed">{message.content}</p>
                            <p
                              className={`text-xs mt-2 ${
                                message.sender === "user" ? "text-background/70" : "text-mutedForeground"
                              }`}
                            >
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted border border-border rounded-lg p-4 max-w-[80%]">
                        <div className="flex items-center space-x-3">
                          <Bot className="h-4 w-4" />
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-mutedForeground rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-mutedForeground rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-mutedForeground rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                          <span className="text-sm text-mutedForeground">IA está pensando...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>

              {/* Quick Start Questions */}
              {messages.length <= 1 && (
                <div className="mb-4">
                  <p className="text-sm text-mutedForeground mb-3">Preguntas rápidas para comenzar:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {quickStartQuestions.map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => setInputMessage(question)}
                        className="text-left justify-start h-auto p-3 border-border hover:bg-muted"
                      >
                        <MessageSquare className="h-3 w-3 mr-2 flex-shrink-0" />
                        <span className="text-xs">{question}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex space-x-2">
                  <Textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Pregúntame sobre tu carrera, habilidades o desarrollo profesional..."
                    className="flex-1 min-h-[60px] resize-none border-border focus:border-foreground"
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                  />
                  <div className="flex flex-col gap-2">
                    {speechSupported && (
                      <Button
                        onClick={toggleListening}
                        disabled={isLoading || isTogglingRef.current}
                        variant={isListening ? "destructive" : "outline"}
                        className={isListening ? "animate-pulse" : ""}
                        title={isListening ? "Detener grabación" : "Iniciar grabación de voz"}
                      >
                        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      </Button>
                    )}
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isLoading}
                      className="bg-foreground text-background hover:bg-foreground/90"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-mutedForeground">
                  <span>Presiona Enter para enviar, Shift+Enter para nueva línea</span>
                  {speechSupported && (
                    <span className="flex items-center gap-1">
                      <Mic className="h-3 w-3" />
                      {isListening ? (
                        <span className="text-destructive font-medium">Escuchando... (haz clic para detener)</span>
                      ) : (
                        "Haz clic en el micrófono para hablar"
                      )}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suggestions" className="mt-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <Lightbulb className="h-5 w-5 mr-2" />
                Sugerencias Personalizadas
              </CardTitle>
              <p className="text-sm text-mutedForeground mt-2">
                Recomendaciones generadas por IA basadas en tus resultados de evaluación y perfil de carrera
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {suggestions.map((suggestion) => {
                  const IconComponent = getCategoryIcon(suggestion.category)
                  return (
                    <div
                      key={suggestion.id}
                      className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <IconComponent className="h-5 w-5 text-foreground mt-0.5" />
                          <div className="flex-1">
                            <p className="text-foreground font-medium mb-2">{suggestion.text}</p>
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary" className="bg-muted text-mutedForeground">
                                {suggestion.category}
                              </Badge>
                              <Badge className={getPriorityColor(suggestion.priority)}>
                                {suggestion.priority} prioridad
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-border hover:bg-muted ml-4 bg-transparent"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSuggestionClick(suggestion)
                          }}
                        >
                          Discutir
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="mt-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <Sparkles className="h-5 w-5 mr-2" />
                Insights Generados por IA
              </CardTitle>
              <p className="text-sm text-mutedForeground mt-2">
                Análisis profundo de tus resultados de evaluación y perfil profesional
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {insights.map((insight) => {
                  const IconComponent = getCategoryIcon(insight.category)
                  return (
                    <div
                      key={insight.id}
                      className="border border-border rounded-lg p-6 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                          <IconComponent className="h-5 w-5 text-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-foreground text-lg">{insight.title}</h3>
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary" className="bg-muted text-mutedForeground">
                                {insight.category}
                              </Badge>
                              {insight.actionable && (
                                <Badge className="bg-foreground/10 text-foreground border-foreground/20">
                                  Accionable
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-mutedForeground mb-4 leading-relaxed">{insight.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-mutedForeground">Confianza:</span>
                              <Progress value={insight.confidence} className="w-24 h-2" />
                              <span className="text-sm font-medium text-foreground">{insight.confidence}%</span>
                            </div>
                            {insight.actionable && (
                              <Button
                                size="sm"
                                onClick={() => {
                                  const message = `¿Cómo puedo aprovechar mi ${insight.title.toLowerCase()} para el crecimiento de mi carrera?`
                                  setInputMessage(message)
                                  setActiveTab("chat")
                                }}
                                className="bg-foreground text-background hover:bg-foreground/90"
                              >
                                Crear Plan de Acción
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default PersistentAICoach
