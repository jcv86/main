"use client"

import { useState, useEffect, useRef } from "react"
import { Send, Bot, User, Lightbulb, TrendingUp, Target, BookOpen, Star, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/hooks/use-toast"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  suggestions?: string[]
}

interface CareerInsight {
  id: string
  title: string
  description: string
  category: "skills" | "market" | "opportunities" | "development"
  priority: "high" | "medium" | "low"
  actionable: boolean
}

interface MarketTrend {
  skill: string
  demand: number
  growth: number
  salary_range: string
  description: string
}

export default function CareerCoachPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [insights, setInsights] = useState<CareerInsight[]>([])
  const [marketTrends, setMarketTrends] = useState<MarketTrend[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize with welcome message and load insights
    const welcomeMessage: Message = {
      id: "welcome",
      role: "assistant",
      content: `¡Hola! Soy tu Coach de Carrera con IA. Estoy aquí para ayudarte a desarrollar tu carrera profesional en el mercado chileno.

Puedo ayudarte con:
• Análisis de tu perfil profesional
• Recomendaciones de desarrollo de habilidades
• Estrategias de búsqueda de empleo
• Planificación de carrera a largo plazo
• Insights del mercado laboral chileno

¿En qué te gustaría que te ayude hoy?`,
      timestamp: new Date(),
      suggestions: [
        "Analiza mi perfil profesional",
        "¿Qué habilidades debería desarrollar?",
        "Tendencias del mercado tecnológico en Chile",
        "Cómo mejorar mi CV",
        "Estrategias de networking profesional",
      ],
    }

    setMessages([welcomeMessage])
    loadCareerInsights()
    loadMarketTrends()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const loadCareerInsights = () => {
    const demoInsights: CareerInsight[] = [
      {
        id: "1",
        title: "Desarrolla habilidades en Cloud Computing",
        description:
          "El mercado chileno muestra alta demanda en AWS, Azure y Google Cloud. Considera obtener certificaciones.",
        category: "skills",
        priority: "high",
        actionable: true,
      },
      {
        id: "2",
        title: "Mejora tu presencia en LinkedIn",
        description: "Tu perfil necesita optimización. Agrega proyectos recientes y obtén recomendaciones.",
        category: "development",
        priority: "medium",
        actionable: true,
      },
      {
        id: "3",
        title: "Oportunidades en Fintech",
        description: "El sector fintech en Chile está creciendo 25% anual. Considera especializarte en este sector.",
        category: "opportunities",
        priority: "high",
        actionable: true,
      },
      {
        id: "4",
        title: "Tendencia hacia trabajo remoto",
        description:
          "45% de las empresas chilenas ofrecen modalidad híbrida. Desarrolla habilidades de trabajo remoto.",
        category: "market",
        priority: "medium",
        actionable: false,
      },
    ]
    setInsights(demoInsights)
  }

  const loadMarketTrends = () => {
    const demoTrends: MarketTrend[] = [
      {
        skill: "Desarrollo Full Stack",
        demand: 92,
        growth: 15,
        salary_range: "$1.8M - $3.5M CLP",
        description: "Alta demanda en React, Node.js y bases de datos modernas",
      },
      {
        skill: "Data Science",
        demand: 88,
        growth: 22,
        salary_range: "$2.2M - $4.0M CLP",
        description: "Python, Machine Learning y análisis de datos muy solicitados",
      },
      {
        skill: "DevOps/Cloud",
        demand: 85,
        growth: 28,
        salary_range: "$2.0M - $3.8M CLP",
        description: "AWS, Docker, Kubernetes en alta demanda",
      },
      {
        skill: "Ciberseguridad",
        demand: 78,
        growth: 35,
        salary_range: "$2.5M - $4.5M CLP",
        description: "Sector en crecimiento exponencial en Chile",
      },
      {
        skill: "UX/UI Design",
        demand: 75,
        growth: 18,
        salary_range: "$1.5M - $2.8M CLP",
        description: "Diseño centrado en usuario muy valorado",
      },
    ]
    setMarketTrends(demoTrends)
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

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
      // Simulate AI response
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const aiResponse = generateAIResponse(inputMessage)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse.content,
        timestamp: new Date(),
        suggestions: aiResponse.suggestions,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: "No se pudo enviar el mensaje. Intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const generateAIResponse = (userInput: string): { content: string; suggestions?: string[] } => {
    const input = userInput.toLowerCase()

    if (input.includes("perfil") || input.includes("analiza")) {
      return {
        content: `Basándome en tu perfil actual, veo que tienes una base sólida en desarrollo de software. Aquí están mis recomendaciones:

**Fortalezas identificadas:**
• Experiencia en desarrollo web
• Conocimientos en metodologías ágiles
• Habilidades de comunicación

**Áreas de mejora:**
• Certificaciones técnicas (AWS, Azure)
• Experiencia en liderazgo de equipos
• Conocimientos en arquitectura de software

**Próximos pasos recomendados:**
1. Obtener certificación AWS Solutions Architect
2. Liderar un proyecto pequeño en tu empresa actual
3. Contribuir a proyectos open source

¿Te gustaría que profundice en alguna de estas áreas?`,
        suggestions: [
          "¿Cómo obtener certificación AWS?",
          "Estrategias de liderazgo técnico",
          "Proyectos open source recomendados",
          "Plan de desarrollo a 6 meses",
        ],
      }
    }

    if (input.includes("habilidades") || input.includes("skills")) {
      return {
        content: `Para el mercado chileno actual, estas son las habilidades más demandadas en tu área:

**Habilidades Técnicas Prioritarias:**
• **Cloud Computing** (AWS, Azure) - Demanda: 95%
• **Contenedores** (Docker, Kubernetes) - Demanda: 88%
• **Microservicios** - Demanda: 82%
• **CI/CD** (Jenkins, GitLab CI) - Demanda: 79%

**Habilidades Blandas Clave:**
• Liderazgo técnico
• Comunicación efectiva
• Gestión de proyectos
• Mentoría y coaching

**Plan de Desarrollo Sugerido:**
1. **Mes 1-2:** Curso AWS Fundamentals
2. **Mes 3-4:** Proyecto práctico con Docker
3. **Mes 5-6:** Certificación AWS Solutions Architect

¿Quieres que te ayude a crear un plan detallado para alguna de estas habilidades?`,
        suggestions: [
          "Plan detallado para AWS",
          "Recursos para aprender Docker",
          "Cómo desarrollar liderazgo técnico",
          "Proyectos prácticos recomendados",
        ],
      }
    }

    if (input.includes("mercado") || input.includes("tendencias")) {
      return {
        content: `El mercado tecnológico chileno está experimentando cambios significativos:

**Tendencias Principales 2024:**
• **Transformación Digital:** 78% de empresas priorizan digitalización
• **Trabajo Híbrido:** 65% adopta modalidades flexibles
• **Fintech:** Crecimiento del 35% anual
• **E-commerce:** Expansión del 28% en plataformas digitales

**Sectores con Mayor Demanda:**
1. **Banca y Fintech** - Salarios: $2.5M - $4.5M CLP
2. **Retail Digital** - Salarios: $2.0M - $3.8M CLP
3. **Healthtech** - Salarios: $2.2M - $4.0M CLP
4. **Logística Digital** - Salarios: $1.8M - $3.2M CLP

**Oportunidades Emergentes:**
• Desarrolladores blockchain
• Especialistas en IA/ML
• Arquitectos de soluciones cloud
• Expertos en ciberseguridad

¿Te interesa explorar algún sector específico?`,
        suggestions: [
          "Oportunidades en Fintech",
          "Cómo entrar al sector bancario",
          "Tendencias en IA y ML",
          "Salarios por experiencia",
        ],
      }
    }

    if (input.includes("cv") || input.includes("currículum")) {
      return {
        content: `Para optimizar tu CV para el mercado chileno, considera estos puntos:

**Estructura Recomendada:**
1. **Datos de contacto** (incluye LinkedIn)
2. **Resumen profesional** (3-4 líneas impactantes)
3. **Experiencia laboral** (logros cuantificados)
4. **Habilidades técnicas** (organizadas por categorías)
5. **Educación y certificaciones**
6. **Proyectos destacados**

**Consejos Específicos para Chile:**
• Incluye experiencia con empresas chilenas conocidas
• Menciona conocimiento del mercado local
• Destaca experiencia en regulaciones locales (si aplica)
• Usa métricas en pesos chilenos cuando sea relevante

**Palabras Clave Importantes:**
• Transformación digital
• Metodologías ágiles
• Trabajo en equipo
• Orientación a resultados
• Innovación

**Errores Comunes a Evitar:**
• CV muy extenso (máximo 2 páginas)
• Falta de cuantificación en logros
• Información desactualizada
• Formato poco profesional

¿Quieres que revise alguna sección específica de tu CV?`,
        suggestions: [
          "Cómo escribir un resumen profesional",
          "Ejemplos de logros cuantificados",
          "Formato de CV recomendado",
          "Palabras clave por industria",
        ],
      }
    }

    if (input.includes("networking") || input.includes("contactos")) {
      return {
        content: `El networking es crucial en el mercado chileno. Aquí tienes estrategias efectivas:

**Plataformas Clave en Chile:**
• **LinkedIn** - Esencial para profesionales
• **Meetup** - Eventos técnicos y profesionales
• **Eventbrite** - Conferencias y workshops
• **Comunidades tech** - DevOps Chile, React Santiago, etc.

**Eventos Recomendados:**
• **9punto5** - Conferencia tech más grande de Chile
• **JSConf Chile** - Para desarrolladores JavaScript
• **AWS User Group Santiago** - Comunidad cloud
• **Women in Tech Chile** - Red de mujeres en tecnología

**Estrategias de Networking:**
1. **Participa activamente** en eventos online y presenciales
2. **Comparte conocimiento** en blogs o charlas
3. **Conecta con propósito** - no solo pidas, también ofrece
4. **Mantén contacto** regular con tu red

**Consejos para Chile:**
• Las relaciones personales son muy valoradas
• Participa en after-office y eventos sociales
• Considera el factor cultural en las conversaciones
• Sé genuino en tus interacciones

¿Te gustaría que te ayude a identificar eventos específicos para tu área?`,
        suggestions: [
          "Eventos tech en Santiago",
          "Cómo optimizar LinkedIn",
          "Estrategias de follow-up",
          "Comunidades por especialidad",
        ],
      }
    }

    // Default response
    return {
      content: `Entiendo tu consulta. Como tu coach de carrera, puedo ayudarte con diversos aspectos del desarrollo profesional.

Basándome en las tendencias actuales del mercado chileno, te recomiendo enfocarte en:

• **Desarrollo continuo de habilidades** técnicas y blandas
• **Construcción de una red profesional** sólida
• **Mantenerte actualizado** con las tendencias del mercado
• **Planificación estratégica** de tu carrera a largo plazo

¿Hay algún aspecto específico en el que te gustaría que profundice? Puedo ayudarte con análisis de perfil, desarrollo de habilidades, estrategias de búsqueda de empleo, o planificación de carrera.`,
      suggestions: [
        "Analiza mi situación actual",
        "¿Qué habilidades necesito?",
        "Oportunidades en mi área",
        "Plan de carrera a 5 años",
      ],
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "skills":
        return <TrendingUp className="h-4 w-4" />
      case "market":
        return <BarChart3 className="h-4 w-4" />
      case "opportunities":
        return <Target className="h-4 w-4" />
      case "development":
        return <BookOpen className="h-4 w-4" />
      default:
        return <Lightbulb className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "skills":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "market":
        return "bg-green-100 text-green-800 border-green-200"
      case "opportunities":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "development":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Coach de Carrera con IA</h1>
        <p className="text-gray-600">Recibe consejos personalizados para tu desarrollo profesional en Chile</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-blue-100">
                    <Bot className="h-5 w-5 text-blue-600" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">Coach de Carrera IA</CardTitle>
                  <p className="text-sm text-gray-600">Especializado en el mercado laboral chileno</p>
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
                        className={`flex items-start gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className={message.role === "user" ? "bg-gray-100" : "bg-blue-100"}>
                            {message.role === "user" ? (
                              <User className="h-4 w-4" />
                            ) : (
                              <Bot className="h-4 w-4 text-blue-600" />
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`rounded-lg p-3 ${
                            message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                          {message.suggestions && (
                            <div className="mt-3 space-y-2">
                              <p className="text-xs font-medium opacity-75">Sugerencias:</p>
                              <div className="flex flex-wrap gap-2">
                                {message.suggestions.map((suggestion, index) => (
                                  <Button
                                    key={index}
                                    variant="outline"
                                    size="sm"
                                    className="text-xs h-7 bg-white/10 border-white/20 hover:bg-white/20"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                  >
                                    {suggestion}
                                  </Button>
                                ))}
                              </div>
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
                            <Bot className="h-4 w-4 text-blue-600" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-gray-100 rounded-lg p-3">
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
                            <span className="text-xs text-gray-600">Analizando...</span>
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
                  placeholder="Escribe tu consulta sobre desarrollo profesional..."
                  onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                  disabled={isLoading}
                />
                <Button onClick={handleSendMessage} disabled={isLoading || !inputMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Career Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Insights Personalizados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {insights.map((insight) => (
                <div key={insight.id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(insight.category)}
                      <h4 className="font-medium text-sm">{insight.title}</h4>
                    </div>
                    <Badge variant="outline" className={getPriorityColor(insight.priority)}>
                      {insight.priority === "high" ? "Alta" : insight.priority === "medium" ? "Media" : "Baja"}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{insight.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className={getCategoryColor(insight.category)}>
                      {insight.category === "skills"
                        ? "Habilidades"
                        : insight.category === "market"
                          ? "Mercado"
                          : insight.category === "opportunities"
                            ? "Oportunidades"
                            : "Desarrollo"}
                    </Badge>
                    {insight.actionable && (
                      <Button size="sm" variant="outline" className="h-6 text-xs bg-transparent">
                        Actuar
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Market Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Tendencias del Mercado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {marketTrends.map((trend, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{trend.skill}</h4>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-xs">{trend.demand}%</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Demanda</span>
                      <span className="font-medium">{trend.demand}%</span>
                    </div>
                    <Progress value={trend.demand} className="h-1" />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Crecimiento</span>
                    <span className="text-green-600 font-medium">+{trend.growth}%</span>
                  </div>
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Salario:</span> {trend.salary_range}
                  </div>
                  <p className="text-xs text-gray-600">{trend.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
