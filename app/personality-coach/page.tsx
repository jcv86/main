"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Brain,
  Send,
  User,
  Sparkles,
  Target,
  TrendingUp,
  BookOpen,
  Users,
  MessageSquare,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RefreshCw,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/hooks/use-toast"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  personalityContext?: string[]
  actionItems?: string[]
}

interface PersonalityContext {
  disc?: {
    primary: string
    secondary: string
    scores: { D: number; I: number; S: number; C: number }
  }
  bigFive?: {
    openness: number
    conscientiousness: number
    extraversion: number
    agreeableness: number
    neuroticism: number
  }
  insights?: string[]
  strengths?: string[]
  growthAreas?: string[]
}

export default function PersonalityCoachPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [personalityContext, setPersonalityContext] = useState<PersonalityContext>({})
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }
    initializeCoach()
  }, [user, router])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const initializeCoach = async () => {
    try {
      // Load personality data
      const discResults = localStorage.getItem("discResults")
      const bigFiveResults = localStorage.getItem("bigFiveResults")

      const context: PersonalityContext = {}

      if (discResults) {
        const disc = JSON.parse(discResults)
        context.disc = disc
      }

      if (bigFiveResults) {
        const bigFive = JSON.parse(bigFiveResults).results
        context.bigFive = bigFive
      }

      setPersonalityContext(context)

      // Initialize conversation with personalized greeting
      const welcomeMessage = generateWelcomeMessage(context)
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: welcomeMessage,
          timestamp: new Date(),
          personalityContext: getPersonalityTags(context),
        },
      ])
    } catch (error) {
      console.error("Error initializing coach:", error)

      // Fallback welcome message
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: `¡Hola! Soy tu Coach de Personalidad con IA. Estoy aquí para ayudarte a entender mejor tu personalidad y cómo aplicarla en tu desarrollo profesional. 

Puedo ayudarte con:
• Interpretación de tus resultados de personalidad
• Estrategias personalizadas de desarrollo
• Aplicación de tu perfil en entrevistas
• Recomendaciones de carrera basadas en tu personalidad
• Desarrollo de habilidades específicas

¿En qué te gustaría que te ayude hoy?`,
          timestamp: new Date(),
        },
      ])
    }
  }

  const generateWelcomeMessage = (context: PersonalityContext): string => {
    let message = `¡Hola! Soy tu Coach de Personalidad con IA. He revisado tu perfil completo y estoy aquí para ayudarte a maximizar tu potencial profesional.`

    if (context.disc) {
      const primary = context.disc.primary
      message += `\n\n🎯 **Perfil DISC detectado: ${primary}${context.disc.secondary || ""}**\n`

      if (primary === "D") {
        message += `Veo que tienes un perfil Dominante, lo que indica liderazgo natural y orientación a resultados. Te ayudaré a aprovechar estas fortalezas en tu carrera.`
      } else if (primary === "I") {
        message += `Tu perfil Influyente muestra excelentes habilidades de comunicación y networking. Exploraremos cómo potenciar estas capacidades.`
      } else if (primary === "S") {
        message += `Tu perfil Estable indica colaboración y confiabilidad. Te guiaré para destacar estas valiosas cualidades en el mercado laboral.`
      } else if (primary === "C") {
        message += `Tu perfil Cumplidor refleja atención al detalle y análisis riguroso. Te ayudaré a posicionar estas habilidades estratégicamente.`
      }
    }

    if (context.bigFive) {
      message += `\n\n🧠 **Análisis Big Five completado**\n`

      const highTraits = []
      if (context.bigFive.openness >= 70) highTraits.push("alta creatividad")
      if (context.bigFive.conscientiousness >= 70) highTraits.push("gran responsabilidad")
      if (context.bigFive.extraversion >= 70) highTraits.push("fuerte sociabilidad")
      if (context.bigFive.agreeableness >= 70) highTraits.push("excelente colaboración")
      if (context.bigFive.neuroticism <= 30) highTraits.push("estabilidad emocional")

      if (highTraits.length > 0) {
        message += `Destacas por tu ${highTraits.join(", ")}. Esto te posiciona muy bien en el mercado laboral chileno.`
      }
    }

    message += `\n\n**¿En qué te gustaría que profundicemos?**\n• Interpretación detallada de tus resultados\n• Estrategias de desarrollo personalizadas\n• Aplicación en búsqueda de empleo\n• Preparación para entrevistas\n• Recomendaciones de carrera específicas`

    return message
  }

  const getPersonalityTags = (context: PersonalityContext): string[] => {
    const tags = []

    if (context.disc) {
      tags.push(`DISC: ${context.disc.primary}${context.disc.secondary || ""}`)
    }

    if (context.bigFive) {
      if (context.bigFive.openness >= 70) tags.push("Alta Apertura")
      if (context.bigFive.conscientiousness >= 70) tags.push("Alta Responsabilidad")
      if (context.bigFive.extraversion >= 70) tags.push("Alta Extraversión")
      if (context.bigFive.agreeableness >= 70) tags.push("Alta Amabilidad")
      if (context.bigFive.neuroticism <= 30) tags.push("Estabilidad Emocional")
    }

    return tags
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      // Simulate AI response with personality context
      const response = await generatePersonalizedResponse(inputMessage, personalityContext)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.content,
        timestamp: new Date(),
        personalityContext: response.personalityContext,
        actionItems: response.actionItems,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error generating response:", error)
      toast({
        title: "Error",
        description: "No se pudo generar la respuesta. Intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const generatePersonalizedResponse = async (
    userInput: string,
    context: PersonalityContext,
  ): Promise<{ content: string; personalityContext?: string[]; actionItems?: string[] }> => {
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const input = userInput.toLowerCase()
    const { disc, bigFive } = context

    // Career guidance responses
    if (input.includes("carrera") || input.includes("trabajo") || input.includes("empleo")) {
      let response = `Basándome en tu perfil de personalidad, aquí tienes recomendaciones específicas para tu carrera:\n\n`

      if (disc) {
        response += `**🎯 Según tu perfil DISC ${disc.primary}:**\n`

        if (disc.primary === "D") {
          response += `• Busca roles de liderazgo y toma de decisiones\n• Considera posiciones como: Gerente, Director, Emprendedor\n• Empresas ideales: Startups, consultorías, empresas en crecimiento\n• Destaca tu capacidad de liderar bajo presión\n\n`
        } else if (disc.primary === "I") {
          response += `• Enfócate en roles de comunicación y relaciones\n• Considera posiciones como: Ventas, Marketing, RRHH\n• Empresas ideales: Empresas con fuerte cultura colaborativa\n• Destaca tu networking y habilidades interpersonales\n\n`
        } else if (disc.primary === "S") {
          response += `• Busca roles estables con trabajo en equipo\n• Considera posiciones como: Coordinador, Analista, Especialista\n• Empresas ideales: Organizaciones establecidas con buena cultura\n• Destaca tu confiabilidad y capacidad de colaboración\n\n`
        } else if (disc.primary === "C") {
          response += `• Enfócate en roles analíticos y técnicos\n• Considera posiciones como: Ingeniero, Analista, Auditor\n• Empresas ideales: Organizaciones que valoran la precisión\n• Destaca tu atención al detalle y rigor analítico\n\n`
        }
      }

      if (bigFive) {
        response += `**🧠 Considerando tu perfil Big Five:**\n`

        if (bigFive.openness >= 70) {
          response += `• Tu alta apertura te hace ideal para roles innovadores\n• Busca empresas que fomenten la creatividad\n• Considera industrias como tecnología, diseño, consultoría\n\n`
        }

        if (bigFive.conscientiousness >= 70) {
          response += `• Tu alta responsabilidad es muy valorada en Chile\n• Eres ideal para roles de gestión y supervisión\n• Los empleadores confiarán en ti para proyectos críticos\n\n`
        }

        if (bigFive.extraversion >= 70) {
          response += `• Tu extraversión te abre puertas en networking\n• Considera roles customer-facing\n• El mercado chileno valora mucho las habilidades sociales\n\n`
        }
      }

      response += `**🚀 Próximos pasos recomendados:**\n• Actualiza tu CV destacando estas fortalezas\n• Practica entrevistas enfocándote en estos aspectos\n• Busca empleos en empresas que valoren tu perfil\n• Desarrolla networking en tu área de fortaleza`

      return {
        content: response,
        personalityContext: getPersonalityTags(context),
        actionItems: ["Actualizar CV", "Practicar entrevistas", "Buscar empleos", "Hacer networking"],
      }
    }

    // Interview preparation responses
    if (input.includes("entrevista") || input.includes("entrevistas")) {
      let response = `Te ayudo a prepararte para entrevistas según tu personalidad:\n\n`

      if (disc) {
        response += `**🎯 Estrategia de entrevista para perfil DISC ${disc.primary}:**\n\n`

        if (disc.primary === "D") {
          response += `**Fortalezas a destacar:**\n• Liderazgo natural y toma de decisiones\n• Orientación a resultados y logros\n• Capacidad de trabajar bajo presión\n\n**Preguntas típicas para ti:**\n• "Cuéntame sobre una vez que lideraste un equipo"\n• "¿Cómo manejas la presión y deadlines?"\n• "Describe un logro que consideres significativo"\n\n**Consejos específicos:**\n• Sé directo y conciso en tus respuestas\n• Prepara ejemplos concretos de liderazgo\n• Enfatiza resultados medibles\n• Muestra confianza sin ser agresivo\n\n`
        } else if (disc.primary === "I") {
          response += `**Fortalezas a destacar:**\n• Habilidades de comunicación y networking\n• Capacidad de influir y motivar\n• Trabajo en equipo y colaboración\n\n**Preguntas típicas para ti:**\n• "¿Cómo construyes relaciones con colegas?"\n• "Cuéntame sobre un proyecto en equipo exitoso"\n• "¿Cómo manejas conflictos interpersonales?"\n\n**Consejos específicos:**\n• Usa storytelling en tus respuestas\n• Muestra entusiasmo y energía positiva\n• Prepara ejemplos de colaboración exitosa\n• Conecta personalmente con el entrevistador\n\n`
        } else if (disc.primary === "S") {
          response += `**Fortalezas a destacar:**\n• Confiabilidad y estabilidad\n• Capacidad de colaboración\n• Adaptabilidad y paciencia\n\n**Preguntas típicas para ti:**\n• "¿Cómo te adaptas a cambios organizacionales?"\n• "Describe tu estilo de trabajo en equipo"\n• "¿Cómo manejas múltiples proyectos?"\n\n**Consejos específicos:**\n• Enfatiza tu consistencia y confiabilidad\n• Prepara ejemplos de adaptación al cambio\n• Muestra cómo apoyas a otros\n• Destaca tu estabilidad emocional\n\n`
        } else if (disc.primary === "C") {
          response += `**Fortalezas a destacar:**\n• Atención al detalle y precisión\n• Análisis riguroso y calidad\n• Seguimiento de procesos y estándares\n\n**Preguntas típicas para ti:**\n• "¿Cómo aseguras la calidad en tu trabajo?"\n• "Describe un problema complejo que resolviste"\n• "¿Cómo manejas múltiples deadlines?"\n\n**Consejos específicos:**\n• Prepara ejemplos de análisis detallado\n• Enfatiza tu metodología y proceso\n• Muestra cómo previenes errores\n• Destaca tu compromiso con la calidad\n\n`
        }
      }

      response += `**🎭 Simulacro personalizado disponible:**\nPuedes practicar entrevistas específicas para tu perfil en nuestro simulador.`

      return {
        content: response,
        personalityContext: getPersonalityTags(context),
        actionItems: ["Preparar ejemplos STAR", "Practicar storytelling", "Ensayar en simulador"],
      }
    }

    // Strengths and development
    if (input.includes("fortaleza") || input.includes("fuerte") || input.includes("desarrollo")) {
      let response = `Analicemos tus fortalezas y oportunidades de desarrollo:\n\n`

      if (disc && bigFive) {
        response += `**🌟 Tus principales fortalezas:**\n`

        // DISC strengths
        if (disc.primary === "D") response += `• Liderazgo natural (DISC D)\n`
        if (disc.primary === "I") response += `• Habilidades de comunicación (DISC I)\n`
        if (disc.primary === "S") response += `• Colaboración y estabilidad (DISC S)\n`
        if (disc.primary === "C") response += `• Análisis y precisión (DISC C)\n`

        // Big Five strengths
        if (bigFive.openness >= 70) response += `• Creatividad e innovación (Alta Apertura)\n`
        if (bigFive.conscientiousness >= 70) response += `• Organización y responsabilidad (Alta Responsabilidad)\n`
        if (bigFive.extraversion >= 70) response += `• Sociabilidad y networking (Alta Extraversión)\n`
        if (bigFive.agreeableness >= 70) response += `• Empatía y cooperación (Alta Amabilidad)\n`
        if (bigFive.neuroticism <= 30) response += `• Estabilidad emocional y manejo del estrés\n`

        response += `\n**📈 Áreas de desarrollo recomendadas:**\n`

        // Development areas
        if (bigFive.extraversion <= 40) response += `• Desarrollar habilidades de networking y presentación\n`
        if (bigFive.openness <= 40) response += `• Explorar nuevas formas de pensar y creatividad\n`
        if (bigFive.conscientiousness <= 40) response += `• Mejorar organización y seguimiento de proyectos\n`
        if (bigFive.neuroticism >= 60) response += `• Desarrollar técnicas de manejo del estrés\n`

        response += `\n**📚 Recursos recomendados:**\n• Libros específicos de nuestra biblioteca\n• Cursos de desarrollo profesional\n• Mentoring personalizado\n• Práctica con simuladores`
      }

      return {
        content: response,
        personalityContext: getPersonalityTags(context),
        actionItems: ["Identificar fortalezas clave", "Plan de desarrollo", "Buscar recursos"],
      }
    }

    // Default personalized response
    let response = `Entiendo tu consulta. Basándome en tu perfil de personalidad, puedo darte consejos más específicos.\n\n`

    if (disc) {
      response += `Como tienes un perfil DISC ${disc.primary}, te recomiendo enfocar tu desarrollo en las áreas donde naturalmente destacas. `
    }

    if (bigFive) {
      const strongTraits = []
      if (bigFive.openness >= 70) strongTraits.push("creatividad")
      if (bigFive.conscientiousness >= 70) strongTraits.push("organización")
      if (bigFive.extraversion >= 70) strongTraits.push("sociabilidad")

      if (strongTraits.length > 0) {
        response += `Tus fortalezas en ${strongTraits.join(" y ")} te dan ventajas únicas en el mercado laboral chileno.`
      }
    }

    response += `\n\n¿Te gustaría que profundice en algún aspecto específico como:\n• Desarrollo de carrera\n• Preparación para entrevistas\n• Análisis de fortalezas\n• Recomendaciones de empleos\n• Estrategias de networking?`

    return {
      content: response,
      personalityContext: getPersonalityTags(context),
    }
  }

  const handleVoiceInput = () => {
    if (!isListening) {
      setIsListening(true)
      // Simulated voice input
      setTimeout(() => {
        setIsListening(false)
        setInputMessage("¿Cómo puedo mejorar mi CV según mi personalidad?")
      }, 3000)
    } else {
      setIsListening(false)
    }
  }

  const handleVoiceOutput = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "es-ES"
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      speechSynthesis.speak(utterance)
    }
  }

  const stopVoiceOutput = () => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold">Coach de Personalidad IA</h1>
            <p className="text-muted-foreground">Conversación personalizada basada en tu perfil psicológico</p>
          </div>
        </div>

        {/* Personality Context Cards */}
        {(personalityContext.disc || personalityContext.bigFive) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {personalityContext.disc && (
              <Badge className="bg-blue-100 text-blue-800">
                <Target className="w-3 h-3 mr-1" />
                DISC: {personalityContext.disc.primary}
                {personalityContext.disc.secondary}
              </Badge>
            )}
            {personalityContext.bigFive && personalityContext.bigFive.openness >= 70 && (
              <Badge className="bg-purple-100 text-purple-800">
                <Sparkles className="w-3 h-3 mr-1" />
                Alta Creatividad
              </Badge>
            )}
            {personalityContext.bigFive && personalityContext.bigFive.conscientiousness >= 70 && (
              <Badge className="bg-green-100 text-green-800">
                <TrendingUp className="w-3 h-3 mr-1" />
                Alta Responsabilidad
              </Badge>
            )}
            {personalityContext.bigFive && personalityContext.bigFive.extraversion >= 70 && (
              <Badge className="bg-yellow-100 text-yellow-800">
                <Users className="w-3 h-3 mr-1" />
                Alta Sociabilidad
              </Badge>
            )}
            {personalityContext.bigFive && personalityContext.bigFive.neuroticism <= 30 && (
              <Badge className="bg-red-100 text-red-800">
                <TrendingUp className="w-3 h-3 mr-1" />
                Estabilidad Emocional
              </Badge>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-blue-100">
                      <Brain className="w-5 h-5 text-blue-600" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">Coach de Personalidad IA</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {personalityContext.disc
                        ? `Perfil DISC ${personalityContext.disc.primary} detectado`
                        : "Análisis de personalidad disponible"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleVoiceInput()}
                    disabled={isListening}
                    className={isListening ? "animate-pulse" : ""}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={isSpeaking ? stopVoiceOutput : () => {}}
                    disabled={!isSpeaking}
                  >
                    {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-full p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex items-start gap-3 max-w-[85%] ${message.role === "user" ? "flex-row-reverse" : ""}`}
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className={message.role === "user" ? "bg-gray-100" : "bg-blue-100"}>
                            {message.role === "user" ? (
                              <User className="w-4 h-4" />
                            ) : (
                              <Brain className="w-4 h-4 text-blue-600" />
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`rounded-lg p-4 ${
                            message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>

                          {/* Personality Context Tags */}
                          {message.personalityContext && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {message.personalityContext.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs bg-white/10 border-white/20">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {/* Action Items */}
                          {message.actionItems && (
                            <div className="mt-3 space-y-2">
                              <p className="text-xs font-medium opacity-75">Acciones recomendadas:</p>
                              <div className="flex flex-wrap gap-1">
                                {message.actionItems.map((action, index) => (
                                  <Button
                                    key={index}
                                    variant="outline"
                                    size="sm"
                                    className="text-xs h-6 bg-white/10 border-white/20 hover:bg-white/20"
                                    onClick={() => setInputMessage(`¿Cómo puedo ${action.toLowerCase()}?`)}
                                  >
                                    {action}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Voice Output Button */}
                          {message.role === "assistant" && (
                            <div className="mt-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs h-6 opacity-75 hover:opacity-100"
                                onClick={() => handleVoiceOutput(message.content)}
                                disabled={isSpeaking}
                              >
                                <Volume2 className="w-3 h-3 mr-1" />
                                Escuchar
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex items-start gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-blue-100">
                            <Brain className="w-4 h-4 text-blue-600" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-gray-100 rounded-lg p-4">
                          <div className="flex items-center gap-2">
                            <div className="animate-pulse flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-600">Analizando tu personalidad...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </CardContent>

            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Pregunta sobre tu personalidad, carrera, entrevistas..."
                  onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                  disabled={isLoading || isListening}
                  className={isListening ? "border-red-300 bg-red-50" : ""}
                />
                <Button onClick={handleSendMessage} disabled={isLoading || !inputMessage.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              {isListening && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <Mic className="w-3 h-3 animate-pulse" />
                  Escuchando... Habla ahora
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Acciones Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => setInputMessage("¿Cómo puedo mejorar mi CV según mi personalidad?")}
              >
                <Target className="w-4 h-4 mr-2" />
                Optimizar CV
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => setInputMessage("¿Qué trabajos son ideales para mi personalidad?")}
              >
                <Users className="w-4 h-4 mr-2" />
                Encontrar Empleos
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => setInputMessage("¿Cómo debo prepararme para entrevistas?")}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Preparar Entrevistas
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => setInputMessage("¿Qué habilidades debo desarrollar?")}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Desarrollar Habilidades
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => setInputMessage("¿Qué libros me recomiendas leer?")}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Leer Libros
              </Button>
            </CardContent>
          </Card>

          {/* Personality Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Tu Perfil
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {personalityContext.disc && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-sm text-blue-900 mb-1">
                    DISC: {personalityContext.disc.primary}
                    {personalityContext.disc.secondary}
                  </h4>
                  <p className="text-xs text-blue-700">
                    {personalityContext.disc.primary === "D" && "Líder natural orientado a resultados"}
                    {personalityContext.disc.primary === "I" && "Comunicador influyente y sociable"}
                    {personalityContext.disc.primary === "S" && "Colaborador estable y confiable"}
                    {personalityContext.disc.primary === "C" && "Analista preciso y sistemático"}
                  </p>
                </div>
              )}

              {personalityContext.bigFive && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Big Five Destacados:</h4>
                  {personalityContext.bigFive.openness >= 70 && (
                    <Badge variant="outline" className="text-xs">
                      Alta Creatividad
                    </Badge>
                  )}
                  {personalityContext.bigFive.conscientiousness >= 70 && (
                    <Badge variant="outline" className="text-xs">
                      Alta Responsabilidad
                    </Badge>
                  )}
                  {personalityContext.bigFive.extraversion >= 70 && (
                    <Badge variant="outline" className="text-xs">
                      Alta Sociabilidad
                    </Badge>
                  )}
                  {personalityContext.bigFive.agreeableness >= 70 && (
                    <Badge variant="outline" className="text-xs">
                      Alta Colaboración
                    </Badge>
                  )}
                  {personalityContext.bigFive.neuroticism <= 30 && (
                    <Badge variant="outline" className="text-xs">
                      Estabilidad Emocional
                    </Badge>
                  )}
                </div>
              )}

              {!personalityContext.disc && !personalityContext.bigFive && (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-3">
                    Completa tus evaluaciones para obtener consejos más personalizados
                  </p>
                  <div className="space-y-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => router.push("/disc-test")}
                    >
                      Test DISC
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => router.push("/big-five-test")}
                    >
                      Test Big Five
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Conversation Context */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                Contexto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Mensajes:</span>
                  <Badge variant="secondary">{messages.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Perfil cargado:</span>
                  <Badge variant={personalityContext.disc || personalityContext.bigFive ? "default" : "secondary"}>
                    {personalityContext.disc || personalityContext.bigFive ? "Sí" : "No"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Modo voz:</span>
                  <Badge variant={isListening || isSpeaking ? "default" : "secondary"}>
                    {isListening ? "Escuchando" : isSpeaking ? "Hablando" : "Disponible"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Integration Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push("/cv-builder")}>
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold mb-1">Actualizar CV</h3>
            <p className="text-xs text-muted-foreground">Adapta tu CV según tu personalidad</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => router.push("/interview-simulator")}
        >
          <CardContent className="p-4 text-center">
            <MessageSquare className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold mb-1">Simular Entrevista</h3>
            <p className="text-xs text-muted-foreground">Practica con preguntas personalizadas</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push("/library")}>
          <CardContent className="p-4 text-center">
            <BookOpen className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold mb-1">Biblioteca Personal</h3>
            <p className="text-xs text-muted-foreground">Libros recomendados para tu perfil</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
