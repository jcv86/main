"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Briefcase,
  Users,
  Heart,
  Home,
  MessageSquare,
  Play,
  RotateCcw,
  CheckCircle2,
  Lightbulb,
  ArrowLeft,
  Send,
  Clock,
  Target,
  Star,
  ChevronRight,
  Award,
} from "lucide-react"

// Types
interface SimulationScenario {
  id: string
  title: string
  description: string
  category: "entrevista" | "conversacion"
  subcategory: string
  difficulty: "principiante" | "intermedio" | "avanzado"
  duration: string
  objectives: string[]
  context: string
  aiRole: string
  userRole: string
  tips: string[]
  evaluationCriteria: string[]
}

interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  feedback?: {
    type: "positive" | "improvement"
    text: string
  }
}

interface SimulationResult {
  score: number
  strengths: string[]
  improvements: string[]
  tips: string[]
}

// Scenarios Data
const entrevistaScenarios: SimulationScenario[] = [
  {
    id: "entrevista-conductual",
    title: "Entrevista Conductual (STAR)",
    description: "Practica responder preguntas sobre situaciones pasadas usando el método STAR",
    category: "entrevista",
    subcategory: "conductual",
    difficulty: "principiante",
    duration: "15-20 min",
    objectives: [
      "Dominar el método STAR (Situación, Tarea, Acción, Resultado)",
      "Estructurar respuestas claras y concisas",
      "Destacar logros y aprendizajes",
    ],
    context:
      "Estás en una entrevista para un puesto que te interesa. El entrevistador te hará preguntas sobre situaciones pasadas.",
    aiRole: "Entrevistador de RRHH experimentado",
    userRole: "Candidato al puesto",
    tips: [
      "Usa ejemplos específicos y reales",
      "Cuantifica resultados cuando sea posible",
      "Mantén respuestas entre 1-2 minutos",
    ],
    evaluationCriteria: ["Estructura STAR", "Claridad", "Relevancia", "Impacto demostrado"],
  },
  {
    id: "entrevista-tecnica",
    title: "Entrevista Técnica",
    description: "Prepárate para preguntas técnicas de tu área profesional",
    category: "entrevista",
    subcategory: "tecnica",
    difficulty: "intermedio",
    duration: "20-30 min",
    objectives: [
      "Demostrar conocimiento técnico profundo",
      "Explicar conceptos complejos de forma simple",
      "Resolver problemas en tiempo real",
    ],
    context: "El líder técnico evalúa tus conocimientos y capacidad de resolver problemas.",
    aiRole: "Líder técnico / Manager de área",
    userRole: "Candidato técnico",
    tips: [
      "Piensa en voz alta mientras resuelves",
      "No temas decir 'no sé' pero ofrece cómo lo investigarías",
      "Haz preguntas clarificadoras",
    ],
    evaluationCriteria: [
      "Conocimiento técnico",
      "Resolución de problemas",
      "Comunicación técnica",
      "Pensamiento crítico",
    ],
  },
  {
    id: "entrevista-case",
    title: "Case Interview",
    description: "Resuelve casos de negocio como en consultorías top",
    category: "entrevista",
    subcategory: "case",
    difficulty: "avanzado",
    duration: "30-45 min",
    objectives: [
      "Estructurar problemas complejos",
      "Hacer análisis cuantitativos rápidos",
      "Comunicar recomendaciones claras",
    ],
    context: "Una empresa de consultoría evalúa tu capacidad analítica con un caso de negocio real.",
    aiRole: "Consultor senior / Partner",
    userRole: "Candidato a consultor",
    tips: [
      "Pide tiempo para estructurar tu enfoque",
      "Usa frameworks pero no seas rígido",
      "Resume hallazgos al final",
    ],
    evaluationCriteria: ["Estructura del análisis", "Cálculos", "Creatividad", "Síntesis"],
  },
  {
    id: "entrevista-negociacion",
    title: "Negociación Salarial",
    description: "Practica negociar tu compensación de forma efectiva",
    category: "entrevista",
    subcategory: "negociacion",
    difficulty: "intermedio",
    duration: "15-20 min",
    objectives: [
      "Comunicar tu valor de forma convincente",
      "Manejar objeciones con elegancia",
      "Lograr un acuerdo beneficioso",
    ],
    context: "Te han ofrecido el puesto y es momento de negociar el paquete de compensación.",
    aiRole: "Gerente de RRHH / Hiring Manager",
    userRole: "Candidato seleccionado",
    tips: [
      "Investiga rangos salariales del mercado",
      "No aceptes la primera oferta",
      "Considera todo el paquete, no solo el salario",
    ],
    evaluationCriteria: ["Preparación", "Asertividad", "Flexibilidad", "Resultado final"],
  },
]

const conversacionScenarios: SimulationScenario[] = [
  {
    id: "conv-jefe-aumento",
    title: "Pedir Aumento a tu Jefe",
    description: "Prepara una conversación efectiva para solicitar un aumento",
    category: "conversacion",
    subcategory: "jefe",
    difficulty: "intermedio",
    duration: "15-20 min",
    objectives: [
      "Presentar argumentos sólidos basados en logros",
      "Manejar respuestas negativas con profesionalismo",
      "Negociar alternativas si el aumento no es posible",
    ],
    context: "Llevas tiempo en tu puesto con buen desempeño y quieres solicitar un aumento.",
    aiRole: "Tu jefe directo",
    userRole: "Empleado solicitando aumento",
    tips: [
      "Prepara una lista de logros cuantificables",
      "Elige el momento adecuado",
      "Ten un número específico en mente",
    ],
    evaluationCriteria: ["Preparación", "Profesionalismo", "Manejo de objeciones", "Asertividad"],
  },
  {
    id: "conv-jefe-conflicto",
    title: "Resolver Conflicto con Jefe",
    description: "Aborda un desacuerdo o problema con tu superior",
    category: "conversacion",
    subcategory: "jefe",
    difficulty: "avanzado",
    duration: "20-25 min",
    objectives: [
      "Expresar tu punto de vista sin ser confrontacional",
      "Escuchar activamente la perspectiva del otro",
      "Encontrar soluciones colaborativas",
    ],
    context: "Hay un conflicto o desacuerdo importante que necesitas resolver con tu jefe.",
    aiRole: "Tu jefe con quien tienes el conflicto",
    userRole: "Empleado buscando resolver el conflicto",
    tips: [
      "Enfócate en el problema, no en la persona",
      "Usa 'yo siento' en lugar de 'tú hiciste'",
      "Propón soluciones concretas",
    ],
    evaluationCriteria: ["Control emocional", "Comunicación asertiva", "Escucha activa", "Orientación a soluciones"],
  },
  {
    id: "conv-pareja-finanzas",
    title: "Hablar de Finanzas con tu Pareja",
    description: "Aborda temas de dinero de forma constructiva",
    category: "conversacion",
    subcategory: "pareja",
    difficulty: "intermedio",
    duration: "20-25 min",
    objectives: [
      "Expresar preocupaciones financieras sin culpar",
      "Escuchar y validar la perspectiva del otro",
      "Crear un plan financiero conjunto",
    ],
    context: "Necesitas hablar sobre finanzas con tu pareja - puede ser gastos, ahorro, o planes futuros.",
    aiRole: "Tu pareja",
    userRole: "Tú iniciando la conversación",
    tips: [
      "Elige un momento tranquilo, no durante una crisis",
      "Habla de 'nuestras finanzas', no 'tu problema'",
      "Propón metas compartidas",
    ],
    evaluationCriteria: ["Empatía", "Claridad", "Colaboración", "Orientación al futuro"],
  },
  {
    id: "conv-pareja-limites",
    title: "Establecer Límites con tu Pareja",
    description: "Comunica necesidades y límites de forma saludable",
    category: "conversacion",
    subcategory: "pareja",
    difficulty: "avanzado",
    duration: "20-25 min",
    objectives: [
      "Expresar necesidades claramente",
      "Establecer límites sin dañar la relación",
      "Negociar acuerdos mutuamente respetuosos",
    ],
    context: "Necesitas establecer un límite importante con tu pareja sobre algún aspecto de la relación.",
    aiRole: "Tu pareja",
    userRole: "Tú estableciendo el límite",
    tips: ["Sé específico sobre lo que necesitas", "Explica el 'por qué' detrás del límite", "Ofrece alternativas"],
    evaluationCriteria: ["Claridad", "Respeto mutuo", "Firmeza", "Flexibilidad"],
  },
  {
    id: "conv-familia-independencia",
    title: "Hablar de Independencia con Familia",
    description: "Comunica decisiones de vida a familiares que pueden no estar de acuerdo",
    category: "conversacion",
    subcategory: "familia",
    difficulty: "intermedio",
    duration: "20-25 min",
    objectives: [
      "Comunicar decisiones de vida con respeto",
      "Manejar opiniones contrarias sin conflicto",
      "Mantener la relación mientras afirmas tu autonomía",
    ],
    context: "Necesitas comunicar una decisión importante (mudarte, cambiar de carrera, etc.) a tu familia.",
    aiRole: "Familiar (padre/madre/hermano)",
    userRole: "Tú comunicando tu decisión",
    tips: [
      "Muestra que has pensado bien la decisión",
      "Agradece su preocupación aunque no estés de acuerdo",
      "No pidas permiso, comparte información",
    ],
    evaluationCriteria: ["Asertividad", "Respeto", "Claridad", "Manejo de emociones"],
  },
  {
    id: "conv-familia-conflicto",
    title: "Resolver Conflicto Familiar",
    description: "Aborda un problema o tensión con un familiar cercano",
    category: "conversacion",
    subcategory: "familia",
    difficulty: "avanzado",
    duration: "25-30 min",
    objectives: [
      "Abordar el conflicto de forma constructiva",
      "Expresar sentimientos sin atacar",
      "Buscar reconciliación o entendimiento",
    ],
    context: "Hay un conflicto o tensión con un familiar que quieres resolver.",
    aiRole: "El familiar con quien tienes el conflicto",
    userRole: "Tú buscando resolver el conflicto",
    tips: [
      "Reconoce tu parte en el conflicto",
      "Enfócate en el futuro, no solo en el pasado",
      "Sé paciente, puede tomar varias conversaciones",
    ],
    evaluationCriteria: ["Vulnerabilidad", "Responsabilidad", "Empatía", "Paciencia"],
  },
]

const allScenarios = [...entrevistaScenarios, ...conversacionScenarios]

// Icons by subcategory
const subcategoryIcons: Record<string, React.ReactNode> = {
  conductual: <MessageSquare className="h-5 w-5" />,
  tecnica: <Briefcase className="h-5 w-5" />,
  case: <Target className="h-5 w-5" />,
  negociacion: <Award className="h-5 w-5" />,
  jefe: <Briefcase className="h-5 w-5" />,
  pareja: <Heart className="h-5 w-5" />,
  familia: <Home className="h-5 w-5" />,
}

const difficultyColors: Record<string, string> = {
  principiante: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  intermedio: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  avanzado: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
}

export default function SimulacionesClient() {
  const [activeTab, setActiveTab] = useState<"entrevistas" | "conversaciones" | "historial">("entrevistas")
  const [selectedScenario, setSelectedScenario] = useState<SimulationScenario | null>(null)
  const [simulationActive, setSimulationActive] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [simulationComplete, setSimulationComplete] = useState(false)
  const [result, setResult] = useState<SimulationResult | null>(null)
  const [messageCount, setMessageCount] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const startSimulation = () => {
    if (!selectedScenario) return

    setSimulationActive(true)
    setMessages([
      {
        id: "system-1",
        role: "system",
        content: `**Simulación: ${selectedScenario.title}**\n\n${selectedScenario.context}\n\n*${selectedScenario.aiRole} te está esperando...*`,
        timestamp: new Date(),
      },
      {
        id: "assistant-1",
        role: "assistant",
        content: getOpeningMessage(selectedScenario),
        timestamp: new Date(),
      },
    ])
    setMessageCount(0)
    setSimulationComplete(false)
    setResult(null)
  }

  const getOpeningMessage = (scenario: SimulationScenario): string => {
    const openings: Record<string, string> = {
      "entrevista-conductual":
        "Buenos días, gracias por venir. Soy María del equipo de Recursos Humanos. Hoy me gustaría conocerte mejor a través de algunas situaciones que hayas vivido. Para empezar, cuéntame sobre una vez que tuviste que manejar un conflicto en el trabajo. ¿Qué pasó y cómo lo resolviste?",
      "entrevista-tecnica":
        "Hola, soy Carlos, el líder técnico del equipo. Antes de entrar en detalles técnicos, me gustaría que me cuentes brevemente sobre tu experiencia y qué tecnologías dominas. ¿Cuál dirías que es tu mayor fortaleza técnica?",
      "entrevista-case":
        "Bienvenido a la entrevista de casos. Soy Partner en la firma. Te voy a presentar un caso real: nuestro cliente es una cadena de gimnasios que ha visto caer sus membresías un 30% en el último año. ¿Cómo estructurarías el análisis de este problema?",
      "entrevista-negociacion":
        "Me alegra que hayamos llegado a esta etapa. Estamos muy interesados en que te unas al equipo. Hemos preparado una oferta inicial: el salario base sería de $X anuales más el paquete estándar de beneficios. ¿Qué te parece?",
      "conv-jefe-aumento":
        "Hola, pasa. Me dijiste que querías hablar de algo importante. Tengo unos 20 minutos antes de mi próxima reunión. ¿De qué se trata?",
      "conv-jefe-conflicto":
        "Me llegó tu solicitud de reunión. Supongo que es sobre lo que pasó la semana pasada. Adelante, te escucho.",
      "conv-pareja-finanzas":
        "Vi que pusiste 'conversación importante' en el calendario. ¿Está todo bien? ¿De qué quieres que hablemos?",
      "conv-pareja-limites":
        "Noto que has estado algo distante últimamente. Me preocupa. ¿Hay algo que necesites decirme?",
      "conv-familia-independencia":
        "Qué bueno que viniste a visitarnos. Tu madre me dijo que tenías algo que contarnos. ¿Qué pasa, hijo/a?",
      "conv-familia-conflicto": "Bueno, aquí estamos. Hace tiempo que no hablamos bien. ¿Por dónde quieres empezar?",
    }
    return openings[scenario.id] || "Hola, estoy listo para comenzar. ¿Cómo te gustaría empezar?"
  }

  const sendMessage = async () => {
    if (!input.trim() || !selectedScenario || isLoading) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setMessageCount((prev) => prev + 1)

    try {
      const response = await fetch("/api/simulation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenario: selectedScenario,
          messages: [...messages, userMessage].filter((m) => m.role !== "system"),
          messageCount: messageCount + 1,
        }),
      })

      const data = await response.json()

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
        feedback: data.feedback,
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Check if simulation should end (after ~8-10 exchanges or natural conclusion)
      if (data.shouldEnd || messageCount >= 8) {
        setSimulationComplete(true)
        setResult(data.evaluation)
      }
    } catch (error) {
      console.error("Error in simulation:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const resetSimulation = () => {
    setSelectedScenario(null)
    setSimulationActive(false)
    setMessages([])
    setSimulationComplete(false)
    setResult(null)
    setMessageCount(0)
  }

  // Render scenario selection
  const renderScenarioList = (scenarios: SimulationScenario[]) => (
    <div className="grid gap-4 md:grid-cols-2">
      {scenarios.map((scenario) => (
        <Card
          key={scenario.id}
          className={`cursor-pointer transition-all hover:shadow-md hover:border-primary/50 ${
            selectedScenario?.id === scenario.id ? "border-primary shadow-md" : ""
          }`}
          onClick={() => setSelectedScenario(scenario)}
        >
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {subcategoryIcons[scenario.subcategory]}
                <CardTitle className="text-lg">{scenario.title}</CardTitle>
              </div>
              <Badge className={difficultyColors[scenario.difficulty]}>{scenario.difficulty}</Badge>
            </div>
            <CardDescription>{scenario.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {scenario.duration}
              </span>
              <span className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                {scenario.objectives.length} objetivos
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  // Render simulation chat
  if (simulationActive && selectedScenario) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={resetSimulation}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Salir de la simulación
            </Button>
            <Badge variant="outline" className="text-sm">
              <Clock className="h-3 w-3 mr-1" />
              {selectedScenario.duration}
            </Badge>
          </div>

          {/* Scenario info */}
          <Card className="mb-4">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                {subcategoryIcons[selectedScenario.subcategory]}
                <CardTitle>{selectedScenario.title}</CardTitle>
              </div>
              <CardDescription>
                <strong>Tu rol:</strong> {selectedScenario.userRole} | <strong>IA:</strong> {selectedScenario.aiRole}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex flex-wrap gap-2">
                {selectedScenario.tips.map((tip, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    <Lightbulb className="h-3 w-3 mr-1" />
                    {tip}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Progreso de la simulación</span>
              <span>{Math.min(messageCount, 10)}/10 intercambios</span>
            </div>
            <Progress value={Math.min(messageCount * 10, 100)} />
          </div>

          {/* Chat area */}
          <Card className="mb-4">
            <ScrollArea className="h-[400px] p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id}>
                    {message.role === "system" ? (
                      <div className="bg-muted/50 rounded-lg p-4 text-center text-sm">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: message.content
                              .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                              .replace(/\*(.*?)\*/g, "<em>$1</em>")
                              .replace(/\n/g, "<br/>"),
                          }}
                        />
                      </div>
                    ) : (
                      <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          {message.feedback && (
                            <div
                              className={`mt-2 pt-2 border-t text-xs ${
                                message.feedback.type === "positive"
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-yellow-600 dark:text-yellow-400"
                              }`}
                            >
                              {message.feedback.type === "positive" ? (
                                <CheckCircle2 className="h-3 w-3 inline mr-1" />
                              ) : (
                                <Lightbulb className="h-3 w-3 inline mr-1" />
                              )}
                              {message.feedback.text}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex gap-1">
                        <span className="animate-bounce">.</span>
                        <span className="animate-bounce delay-100">.</span>
                        <span className="animate-bounce delay-200">.</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </Card>

          {/* Results */}
          {simulationComplete && result && (
            <Card className="mb-4 border-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Resultados de la Simulación
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold text-primary">{result.score}/100</div>
                  <Progress value={result.score} className="flex-1" />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-green-600 dark:text-green-400 mb-2 flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" />
                      Fortalezas
                    </h4>
                    <ul className="space-y-1 text-sm">
                      {result.strengths.map((s, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Star className="h-3 w-3 mt-1 text-green-500" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-yellow-600 dark:text-yellow-400 mb-2 flex items-center gap-1">
                      <Lightbulb className="h-4 w-4" />
                      Áreas de Mejora
                    </h4>
                    <ul className="space-y-1 text-sm">
                      {result.improvements.map((s, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <ChevronRight className="h-3 w-3 mt-1 text-yellow-500" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-muted rounded-lg p-4">
                  <h4 className="font-medium mb-2">Tips para Mejorar</h4>
                  <ul className="space-y-1 text-sm">
                    {result.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Lightbulb className="h-3 w-3 mt-1 text-primary" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => startSimulation()} className="flex-1">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Repetir Simulación
                  </Button>
                  <Button variant="outline" onClick={resetSimulation} className="flex-1 bg-transparent">
                    Elegir Otro Escenario
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Input area */}
          {!simulationComplete && (
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                placeholder="Escribe tu respuesta..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button onClick={sendMessage} disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Main view - scenario selection
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Simulaciones DTC</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Practica entrevistas laborales y conversaciones difíciles en un entorno seguro. La IA actúa como tu
            contraparte y te da retroalimentación en tiempo real.
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="entrevistas" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Entrevistas
            </TabsTrigger>
            <TabsTrigger value="conversaciones" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Conversaciones
            </TabsTrigger>
            <TabsTrigger value="historial" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Historial
            </TabsTrigger>
          </TabsList>

          <TabsContent value="entrevistas">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Entrevistas Laborales</h2>
              <p className="text-muted-foreground">
                Prepárate para diferentes tipos de entrevistas con práctica realista.
              </p>
            </div>
            {renderScenarioList(entrevistaScenarios)}
          </TabsContent>

          <TabsContent value="conversaciones">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Conversaciones Difíciles</h2>
              <p className="text-muted-foreground">Practica conversaciones importantes con jefe, pareja y familia.</p>
            </div>

            {/* Jefe */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Con tu Jefe
              </h3>
              {renderScenarioList(conversacionScenarios.filter((s) => s.subcategory === "jefe"))}
            </div>

            {/* Pareja */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Con tu Pareja
              </h3>
              {renderScenarioList(conversacionScenarios.filter((s) => s.subcategory === "pareja"))}
            </div>

            {/* Familia */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                <Home className="h-5 w-5" />
                Con tu Familia
              </h3>
              {renderScenarioList(conversacionScenarios.filter((s) => s.subcategory === "familia"))}
            </div>
          </TabsContent>

          <TabsContent value="historial">
            <Card>
              <CardHeader>
                <CardTitle>Historial de Simulaciones</CardTitle>
                <CardDescription>Revisa tus simulaciones anteriores y tu progreso</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No tienes simulaciones completadas aún.</p>
                  <p className="text-sm">Completa una simulación para ver tu progreso aquí.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Selected scenario details */}
        {selectedScenario && !simulationActive && (
          <Card className="mt-6 border-primary">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {subcategoryIcons[selectedScenario.subcategory]}
                  <CardTitle>{selectedScenario.title}</CardTitle>
                </div>
                <Badge className={difficultyColors[selectedScenario.difficulty]}>{selectedScenario.difficulty}</Badge>
              </div>
              <CardDescription>{selectedScenario.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Contexto</h4>
                <p className="text-sm text-muted-foreground">{selectedScenario.context}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Objetivos</h4>
                  <ul className="space-y-1 text-sm">
                    {selectedScenario.objectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Target className="h-3 w-3 mt-1 text-primary" />
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Tips</h4>
                  <ul className="space-y-1 text-sm">
                    {selectedScenario.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Lightbulb className="h-3 w-3 mt-1 text-yellow-500" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Criterios de Evaluación</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedScenario.evaluationCriteria.map((criterion, i) => (
                    <Badge key={i} variant="outline">
                      {criterion}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button onClick={startSimulation} className="w-full" size="lg">
                <Play className="h-4 w-4 mr-2" />
                Iniciar Simulación
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
