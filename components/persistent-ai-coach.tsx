"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  MessageCircle,
  Send,
  Minimize2,
  Maximize2,
  Brain,
  Target,
  TrendingUp,
  User,
  Lightbulb,
  Star,
  Clock,
  BarChart3,
  Zap,
  ChevronDown,
  ChevronUp,
  Sparkles,
  X,
  BookOpen,
  Award,
  Play,
} from "lucide-react"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  category?: string
  suggestedActions?: string[]
  isExpanded?: boolean
}

interface UserProfile {
  email: string
  name: string
  preferences: {
    communicationStyle: string
    learningStyle: string
    careerGoals: string[]
    interests: string[]
    skillLevel: string
    timeAvailability: string
  }
  conversation_history: {
    totalMessages: number
    topics: string[]
    lastActive: string
    commonQuestions: string[]
    progressTracking: Record<string, any>
  }
  personality_insights: {
    strengths: string[]
    growthAreas: string[]
    workStyle: string
    motivators: string[]
    stressors: string[]
    communicationPreferences: string[]
  }
  career_profile: {
    experience: string
    aspirations: string[]
    skillGaps: string[]
    networkingStyle: string
  }
  learning_profile: {
    completedBooks: string[]
    currentReading: string[]
    preferredFormats: string[]
    learningPace: string
    retentionStyle: string
  }
}

interface AIInsight {
  type: "strength" | "opportunity" | "recommendation" | "milestone"
  title: string
  description: string
  actionable: boolean
  priority: "high" | "medium" | "low"
  progress?: number
}

export default function PersistentAICoach() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [activeTab, setActiveTab] = useState("chat")
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize component and load user data
  useEffect(() => {
    if (isOpen && !userProfile) {
      initializeCoach()
    }
  }, [isOpen])

  // Auto-scroll to bottom of messages
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const initializeCoach = async () => {
    try {
      setIsLoading(true)

      // Load demo user profile
      const demoProfile: UserProfile = {
        email: "demo@example.com",
        name: "Usuario Demo",
        preferences: {
          communicationStyle: "professional",
          learningStyle: "visual",
          careerGoals: ["liderazgo", "desarrollo profesional"],
          interests: ["tecnología", "innovación", "gestión"],
          skillLevel: "intermediate",
          timeAvailability: "moderate",
        },
        conversation_history: {
          totalMessages: 15,
          topics: ["liderazgo", "carrera", "habilidades"],
          lastActive: new Date().toISOString(),
          commonQuestions: ["¿Cómo mejorar mi liderazgo?", "¿Qué habilidades desarrollar?"],
          progressTracking: {
            leadership: {
              currentLevel: 3,
              targetLevel: 5,
              milestones: ["Completar curso de liderazgo", "Liderar proyecto"],
              completedActions: ["Evaluación inicial"],
            },
          },
        },
        personality_insights: {
          strengths: ["Comunicación", "Análisis", "Adaptabilidad"],
          growthAreas: ["Delegación", "Gestión del tiempo"],
          workStyle: "colaborativo",
          motivators: ["Crecimiento profesional", "Impacto positivo"],
          stressors: ["Plazos ajustados", "Ambigüedad"],
          communicationPreferences: ["Directo", "Estructurado"],
        },
        career_profile: {
          experience: "5 años",
          aspirations: ["Gerente de equipo", "Consultor senior"],
          skillGaps: ["Gestión financiera", "Estrategia empresarial"],
          networkingStyle: "profesional activo",
        },
        learning_profile: {
          completedBooks: ["El Líder que no Tenía Cargo", "Hábitos Atómicos"],
          currentReading: ["Thinking, Fast and Slow"],
          preferredFormats: ["digital", "interactive"],
          learningPace: "moderate",
          retentionStyle: "practical",
        },
      }

      setUserProfile(demoProfile)

      // Generate initial insights
      generateInsights(demoProfile)

      // Load conversation history
      loadConversationHistory()

      // Add welcome message
      const welcomeMessage: Message = {
        id: "welcome-1",
        type: "assistant",
        content: `¡Hola ${demoProfile.name}! 👋 

Soy tu AI Career Coach personalizado. He analizado tu perfil y veo que tienes ${demoProfile.conversation_history.totalMessages} mensajes previos conmigo.

🎯 **Tu perfil actual:**
• Objetivos: ${demoProfile.preferences.careerGoals.join(", ")}
• Fortalezas: ${demoProfile.personality_insights.strengths.slice(0, 3).join(", ")}
• Experiencia: ${demoProfile.career_profile.experience}

🚀 **¿En qué puedo ayudarte hoy?**`,
        timestamp: new Date(),
        category: "welcome",
        suggestedActions: [
          "¿Cómo mejorar mi liderazgo?",
          "Evaluar mis habilidades actuales",
          "Crear plan de desarrollo",
          "Recomendar libros personalizados",
        ],
        isExpanded: false,
      }

      setMessages([welcomeMessage])
    } catch (error) {
      console.error("Error initializing AI Coach:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadConversationHistory = () => {
    // Simulate loading recent conversation
    const recentMessages: Message[] = [
      {
        id: "history-1",
        type: "user",
        content: "¿Cómo puedo mejorar mis habilidades de liderazgo?",
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        category: "career",
        isExpanded: false,
      },
      {
        id: "history-2",
        type: "assistant",
        content:
          "Excelente pregunta sobre liderazgo. Basado en tu perfil, te recomiendo enfocarte en tres áreas clave: comunicación efectiva, delegación estratégica y desarrollo de equipos. ¿Te gustaría profundizar en alguna de estas áreas específicamente?",
        timestamp: new Date(Date.now() - 3590000),
        category: "career",
        suggestedActions: ["Comunicación efectiva", "Delegación estratégica", "Desarrollo de equipos"],
        isExpanded: false,
      },
    ]

    // Don't add history messages to avoid duplication with welcome message
    // setMessages(prev => [...recentMessages, ...prev])
  }

  const generateInsights = (profile: UserProfile) => {
    const generatedInsights: AIInsight[] = [
      {
        type: "strength",
        title: "Fortalezas Clave Identificadas",
        description: `Tus principales fortalezas son ${profile.personality_insights.strengths.join(
          ", ",
        )}. Estas habilidades te posicionan bien para roles de liderazgo.`,
        actionable: true,
        priority: "high",
        progress: 85,
      },
      {
        type: "opportunity",
        title: "Áreas de Crecimiento",
        description: `Enfócate en desarrollar ${profile.personality_insights.growthAreas.join(
          " y ",
        )} para maximizar tu potencial de liderazgo.`,
        actionable: true,
        priority: "medium",
        progress: 45,
      },
      {
        type: "recommendation",
        title: "Plan de Desarrollo Personalizado",
        description: `Basado en tus objetivos de ${profile.preferences.careerGoals.join(
          " y ",
        )}, te recomiendo un enfoque estructurado en 3 fases.`,
        actionable: true,
        priority: "high",
        progress: 30,
      },
      {
        type: "milestone",
        title: "Progreso en Liderazgo",
        description: "Has completado el 60% de tu plan de desarrollo en liderazgo. ¡Excelente progreso!",
        actionable: false,
        priority: "low",
        progress: 60,
      },
    ]

    setInsights(generatedInsights)
  }

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage.trim(),
      timestamp: new Date(),
      isExpanded: false,
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = inputMessage.trim()
    setInputMessage("")
    setIsTyping(true)

    try {
      // Simulate AI response
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const aiResponse = generateAIResponse(currentInput, userProfile)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: aiResponse.content,
        timestamp: new Date(),
        category: aiResponse.category,
        suggestedActions: aiResponse.suggestedActions,
        isExpanded: false,
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Update conversation history
      if (userProfile) {
        setUserProfile({
          ...userProfile,
          conversation_history: {
            ...userProfile.conversation_history,
            totalMessages: userProfile.conversation_history.totalMessages + 1,
            lastActive: new Date().toISOString(),
            topics: [...new Set([...userProfile.conversation_history.topics, aiResponse.category])],
          },
        })
      }
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "Lo siento, hubo un error procesando tu mensaje. Por favor intenta de nuevo.",
        timestamp: new Date(),
        suggestedActions: ["Intentar de nuevo", "Reformular pregunta"],
        isExpanded: false,
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const generateAIResponse = (input: string, profile: UserProfile | null) => {
    const lowerInput = input.toLowerCase()

    if (lowerInput.includes("liderazgo") || lowerInput.includes("líder")) {
      return {
        content: `Excelente pregunta sobre liderazgo, ${profile?.name || "Usuario"}! 

Basado en tu perfil y experiencia de ${profile?.career_profile.experience || "varios años"}, te recomiendo enfocarte en:

🎯 **Áreas prioritarias:**
• **Comunicación efectiva**: Desarrolla tu capacidad de transmitir visión y motivar equipos
• **Delegación estratégica**: Aprende a empoderar a tu equipo mientras mantienes el control
• **Inteligencia emocional**: Fortalece tu capacidad de leer y gestionar emociones

📚 **Recursos recomendados:**
• Libro: "El Líder que no Tenía Cargo" (ya en tu lista de lectura)
• Test: Evaluación de Inteligencia Emocional
• Práctica: Liderar un proyecto pequeño esta semana

¿Te gustaría profundizar en alguna de estas áreas específicamente?`,
        category: "liderazgo",
        suggestedActions: [
          "Comunicación efectiva",
          "Delegación estratégica",
          "Inteligencia emocional",
          "Evaluar mi estilo de liderazgo",
        ],
      }
    }

    if (lowerInput.includes("habilidad") || lowerInput.includes("skill")) {
      return {
        content: `Perfecto, hablemos de desarrollo de habilidades! 💪

**Tus fortalezas actuales:**
${profile?.personality_insights.strengths.map((s) => `• ${s}`).join("\n") || "• Por evaluar"}

**Áreas de crecimiento identificadas:**
${profile?.personality_insights.growthAreas.map((g) => `• ${g}`).join("\n") || "• Por evaluar"}

**Plan de acción recomendado:**
1. **Evaluación completa**: Completa los tests pendientes para un análisis más preciso
2. **Enfoque 80/20**: Concentra el 80% de tu tiempo en desarrollar 2-3 habilidades clave
3. **Práctica deliberada**: Dedica 30 minutos diarios a practicar una habilidad específica

¿Qué habilidad específica te gustaría desarrollar primero?`,
        category: "habilidades",
        suggestedActions: [
          "Evaluar todas mis habilidades",
          "Crear plan de desarrollo",
          "Comenzar con comunicación",
          "Enfocarse en liderazgo",
        ],
      }
    }

    if (lowerInput.includes("carrera") || lowerInput.includes("trabajo") || lowerInput.includes("profesional")) {
      return {
        content: `¡Excelente momento para planificar tu carrera! 🚀

**Tu situación actual:**
• Experiencia: ${profile?.career_profile.experience || "Por definir"}
• Aspiraciones: ${profile?.career_profile.aspirations.join(", ") || "Por explorar"}
• Objetivos: ${profile?.preferences.careerGoals.join(", ") || "Por definir"}

**Recomendaciones personalizadas:**
1. **Análisis de brechas**: Identifica las habilidades necesarias para tus aspiraciones
2. **Networking estratégico**: Conecta con profesionales en tu área objetivo
3. **Desarrollo continuo**: Mantén tus habilidades actualizadas y relevantes

**Próximos pasos sugeridos:**
• Completa tu perfil profesional con más detalles
• Define objetivos SMART para los próximos 6 meses
• Identifica mentores en tu industria

¿Te gustaría que creemos un plan de carrera específico para ti?`,
        category: "carrera",
        suggestedActions: [
          "Crear plan de carrera",
          "Analizar brechas de habilidades",
          "Estrategia de networking",
          "Definir objetivos SMART",
        ],
      }
    }

    if (lowerInput.includes("libro") || lowerInput.includes("leer") || lowerInput.includes("lectura")) {
      return {
        content: `¡Me encanta que quieras seguir aprendiendo! 📚

**Libros en tu lista actual:**
${profile?.learning_profile.completedBooks.map((book) => `✅ ${book}`).join("\n") || "• Ninguno aún"}

**Leyendo actualmente:**
${profile?.learning_profile.currentReading.map((book) => `📖 ${book}`).join("\n") || "• Ninguno"}

**Recomendaciones personalizadas basadas en tus objetivos:**
• **"Radical Candor"** - Para mejorar comunicación y liderazgo
• **"The First 90 Days"** - Perfecto para transiciones profesionales
• **"Multipliers"** - Sobre cómo ser un líder que potencia a otros
• **"Emotional Intelligence 2.0"** - Para desarrollar inteligencia emocional

¿Te interesa alguno de estos libros en particular?`,
        category: "lectura",
        suggestedActions: ["Ver biblioteca completa", "Radical Candor", "The First 90 Days", "Crear plan de lectura"],
      }
    }

    // Default response
    return {
      content: `Gracias por tu pregunta, ${profile?.name || "Usuario"}! 

Como tu AI Career Coach personalizado, estoy aquí para ayudarte con:

🎯 **Desarrollo profesional**
• Planificación de carrera
• Identificación de fortalezas y áreas de mejora
• Estrategias de crecimiento

📚 **Aprendizaje continuo**
• Recomendaciones de libros personalizadas
• Planes de desarrollo de habilidades
• Recursos de formación

🧠 **Evaluaciones psicométricas**
• Tests de personalidad y habilidades
• Análisis de resultados
• Aplicación práctica de insights

¿En qué área específica te gustaría que te ayude hoy?`,
      category: "general",
      suggestedActions: [
        "Planificar mi carrera",
        "Evaluar mis habilidades",
        "Recomendar libros",
        "Hacer un test de personalidad",
      ],
    }
  }

  const handleSuggestedAction = (action: string) => {
    setInputMessage(action)
    // Auto-send the suggested action
    setTimeout(() => {
      handleSendMessage()
    }, 100)
  }

  const toggleMessageExpansion = (messageId: string) => {
    setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, isExpanded: !msg.isExpanded } : msg)))
  }

  const truncateContent = (content: string, maxLength = 300) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + "..."
  }

  const openCoach = () => {
    setIsOpen(true)
    setUnreadCount(0)
  }

  const renderMessage = (message: Message) => {
    const isLongMessage = message.content.length > 300
    const shouldTruncate = isLongMessage && !message.isExpanded

    return (
      <div key={message.id} className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}>
        {message.type === "assistant" && (
          <Avatar className="w-8 h-8 bg-blue-100 flex-shrink-0">
            <AvatarFallback>
              <Brain className="w-4 h-4 text-blue-600" />
            </AvatarFallback>
          </Avatar>
        )}

        <div className={`max-w-[85%] ${message.type === "user" ? "order-first" : ""}`}>
          <div
            className={`p-3 rounded-lg ${
              message.type === "user" ? "bg-blue-600 text-white ml-auto" : "bg-gray-100 text-gray-900"
            }`}
          >
            <div className="text-sm whitespace-pre-wrap">
              {shouldTruncate ? truncateContent(message.content) : message.content}
            </div>

            {isLongMessage && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleMessageExpansion(message.id)}
                className={`mt-2 p-1 h-auto text-xs ${
                  message.type === "user" ? "text-blue-100 hover:text-white" : "text-gray-600"
                }`}
              >
                {message.isExpanded ? (
                  <>
                    <ChevronUp className="w-3 h-3 mr-1" />
                    Mostrar menos
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3 h-3 mr-1" />
                    Mostrar más
                  </>
                )}
              </Button>
            )}
          </div>

          {message.category && message.type === "assistant" && (
            <Badge variant="secondary" className="mt-1 text-xs">
              {message.category}
            </Badge>
          )}

          {message.suggestedActions && message.suggestedActions.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {message.suggestedActions.slice(0, 4).map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestedAction(action)}
                  className="text-xs h-7 bg-white hover:bg-gray-50"
                >
                  {action}
                </Button>
              ))}
            </div>
          )}

          <div className="text-xs text-gray-500 mt-1">{message.timestamp.toLocaleTimeString()}</div>
        </div>

        {message.type === "user" && (
          <Avatar className="w-8 h-8 bg-green-100 flex-shrink-0">
            <AvatarFallback>
              <User className="w-4 h-4 text-green-600" />
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    )
  }

  const renderInsights = () => (
    <div className="space-y-4 p-4">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-yellow-500" />
        <h3 className="font-semibold">Insights Personalizados</h3>
      </div>

      {insights.map((insight, index) => (
        <Card key={index} className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {insight.type === "strength" && <Star className="w-4 h-4 text-yellow-500" />}
                {insight.type === "opportunity" && <Target className="w-4 h-4 text-blue-500" />}
                {insight.type === "recommendation" && <Lightbulb className="w-4 h-4 text-green-500" />}
                {insight.type === "milestone" && <TrendingUp className="w-4 h-4 text-purple-500" />}
                <h4 className="font-medium text-sm">{insight.title}</h4>
              </div>
              <Badge
                variant={
                  insight.priority === "high" ? "destructive" : insight.priority === "medium" ? "default" : "secondary"
                }
                className="text-xs"
              >
                {insight.priority}
              </Badge>
            </div>

            <p className="text-sm text-gray-600 mb-3">{insight.description}</p>

            {insight.progress !== undefined && (
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Progreso</span>
                  <span>{insight.progress}%</span>
                </div>
                <Progress value={insight.progress} className="h-2" />
              </div>
            )}

            {insight.actionable && (
              <Button size="sm" variant="outline" className="text-xs bg-transparent">
                <Play className="w-3 h-3 mr-1" />
                Tomar Acción
              </Button>
            )}
          </CardContent>
        </Card>
      ))}

      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-sm text-blue-900">IA Personalizada Activa</span>
          </div>
          <p className="text-xs text-blue-800 mb-2">
            Estos insights se actualizan automáticamente basándose en tu progreso y conversaciones.
          </p>
          <div className="text-xs text-blue-700 font-medium">
            🧠 Memoria persistente: {userProfile?.conversation_history.totalMessages || 0} interacciones analizadas
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderProfile = () => (
    <div className="space-y-4 p-4">
      {userProfile ? (
        <>
          <div className="text-center">
            <Avatar className="w-16 h-16 mx-auto mb-3 bg-blue-100">
              <AvatarFallback className="text-lg font-semibold text-blue-600">
                {userProfile.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <h3 className="font-semibold text-lg">{userProfile.name}</h3>
            <p className="text-sm text-gray-600">{userProfile.email}</p>
            <Badge variant="secondary" className="mt-1">
              Usuario Demo
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">Nivel</span>
                </div>
                <Badge variant="secondary">{userProfile.preferences.skillLevel}</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">Tiempo</span>
                </div>
                <Badge variant="secondary">{userProfile.preferences.timeAvailability}</Badge>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Target className="w-4 h-4" />
                Objetivos de Carrera
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-1">
                {userProfile.preferences.careerGoals.map((goal, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {goal}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Fortalezas
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-1">
                {userProfile.personality_insights.strengths.map((strength, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {strength}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Libros Completados
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1">
                {userProfile.learning_profile.completedBooks.map((book, index) => (
                  <div key={index} className="text-xs text-gray-600 flex items-center gap-1">
                    <Award className="w-3 h-3 text-green-500" />
                    {book}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Estadísticas
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Mensajes:</span>
                <span className="font-medium">{userProfile.conversation_history.totalMessages}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Temas explorados:</span>
                <span className="font-medium">{userProfile.conversation_history.topics.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Libros leídos:</span>
                <span className="font-medium">{userProfile.learning_profile.completedBooks.length}</span>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <div className="text-center py-8">
          <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-sm text-gray-500">Perfil no disponible</p>
          <p className="text-xs text-gray-400 mt-1">Inicia sesión para ver tu perfil personalizado</p>
        </div>
      )}
    </div>
  )

  if (!isOpen) {
    return (
      <Button
        onClick={openCoach}
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 z-50 transition-all duration-300 hover:scale-110"
        size="icon"
      >
        <Brain className="h-7 w-7 text-white" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs animate-pulse">
            {unreadCount}
          </Badge>
        )}
      </Button>
    )
  }

  return (
    <Card
      className={`fixed bottom-6 right-6 shadow-2xl z-50 flex flex-col transition-all duration-300 ${
        isMinimized ? "w-80 h-16" : "w-[450px] h-[700px]"
      }`}
    >
      <CardHeader className="flex-shrink-0 pb-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Career Coach
            <Badge className="bg-white/20 text-white text-xs">Demo</Badge>
            {isTyping && <span className="text-sm animate-pulse">escribiendo...</span>}
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8 text-white hover:bg-white/20"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="flex-1 min-h-0 p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Brain className="w-8 h-8 text-blue-500 animate-pulse mx-auto mb-2" />
                <p className="text-sm text-gray-600">Inicializando AI Coach...</p>
              </div>
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-3 mx-4 mt-4">
                <TabsTrigger value="chat" className="text-sm">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="insights" className="text-sm">
                  <Sparkles className="h-4 w-4 mr-1" />
                  Insights
                </TabsTrigger>
                <TabsTrigger value="profile" className="text-sm">
                  <User className="h-4 w-4 mr-1" />
                  Perfil
                </TabsTrigger>
              </TabsList>

              <TabsContent value="chat" className="flex-1 flex flex-col m-0 min-h-0 overflow-hidden">
                <ScrollArea className="flex-1 px-4 max-h-full overflow-y-auto">
                  <div className="space-y-4 py-4 min-h-0">
                    {messages.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        <Brain className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-sm">¡Hola! Soy tu AI Career Coach.</p>
                        <p className="text-xs mt-1">¿En qué puedo ayudarte hoy?</p>
                      </div>
                    ) : (
                      messages.map(renderMessage)
                    )}

                    {isTyping && (
                      <div className="flex gap-3 justify-start">
                        <Avatar className="w-8 h-8 bg-blue-100">
                          <AvatarFallback>
                            <Brain className="w-4 h-4 text-blue-600" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-gray-100 p-3 rounded-lg">
                          <div className="flex space-x-1">
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
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Escribe tu mensaje..."
                      onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                      disabled={isTyping}
                      className="text-sm"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isTyping}
                      size="sm"
                      className="px-3"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Presiona Enter para enviar • {inputMessage.length}/500
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="insights" className="flex-1 m-0 overflow-hidden">
                <ScrollArea className="h-full">{renderInsights()}</ScrollArea>
              </TabsContent>

              <TabsContent value="profile" className="flex-1 m-0 overflow-hidden">
                <ScrollArea className="h-full">{renderProfile()}</ScrollArea>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      )}
    </Card>
  )
}
