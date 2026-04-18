"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  BookOpen,
  Target,
  Briefcase,
  MessageSquare,
  Play,
  CheckCircle,
  Clock,
  Star,
  TrendingUp,
} from "lucide-react"

interface TestScenario {
  id: string
  category: "test" | "book" | "skill" | "career"
  question: string
  expectedResponse: string
  difficulty: "easy" | "medium" | "hard"
  tags: string[]
}

interface TestResult {
  scenarioId: string
  success: boolean
  responseTime: number
  actualResponse: string
  timestamp: Date
}

export default function AICoachTestScenarios() {
  const [activeCategory, setActiveCategory] = useState<string>("test")
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunningTest, setIsRunningTest] = useState<string | null>(null)

  const testScenarios: TestScenario[] = [
    // Test-related scenarios
    {
      id: "test-1",
      category: "test",
      question: "¿Qué test debería hacer primero?",
      expectedResponse: "Recomendación del DISC con explicación detallada",
      difficulty: "easy",
      tags: ["beginner", "recommendation", "disc"],
    },
    {
      id: "test-2",
      category: "test",
      question: "Explícame qué mide el test DISC",
      expectedResponse: "Explicación de las 4 dimensiones DISC",
      difficulty: "medium",
      tags: ["disc", "explanation", "personality"],
    },
    {
      id: "test-3",
      category: "test",
      question: "¿Cuál es la diferencia entre RIASEC y Big Five?",
      expectedResponse: "Comparación entre tests vocacionales y de personalidad",
      difficulty: "hard",
      tags: ["riasec", "big-five", "comparison"],
    },
    {
      id: "test-4",
      category: "test",
      question: "¿Qué evaluaciones hay disponibles?",
      expectedResponse: "Lista completa de tests con tiempos estimados",
      difficulty: "easy",
      tags: ["overview", "catalog", "time"],
    },
    {
      id: "test-5",
      category: "test",
      question: "¿Para qué sirve el test de inteligencia emocional?",
      expectedResponse: "Beneficios y aplicaciones de la evaluación EQ",
      difficulty: "medium",
      tags: ["emotional-intelligence", "benefits", "applications"],
    },

    // Book-related scenarios
    {
      id: "book-1",
      category: "book",
      question: "¿Qué libros me recomiendas para liderazgo?",
      expectedResponse: "Lista categorizada por nivel con descripciones",
      difficulty: "easy",
      tags: ["leadership", "recommendations", "levels"],
    },
    {
      id: "book-2",
      category: "book",
      question: "Necesito mejorar mi comunicación, ¿qué puedo leer?",
      expectedResponse: "Libros específicos de comunicación por tipo",
      difficulty: "medium",
      tags: ["communication", "books", "improvement"],
    },
    {
      id: "book-3",
      category: "book",
      question: "¿Cuáles son los mejores libros de productividad?",
      expectedResponse: "Recomendaciones de productividad con tiempo de lectura",
      difficulty: "medium",
      tags: ["productivity", "time-management", "efficiency"],
    },
    {
      id: "book-4",
      category: "book",
      question: "¿Hay libros sobre inteligencia emocional?",
      expectedResponse: "Lista de libros EQ con niveles de dificultad",
      difficulty: "easy",
      tags: ["emotional-intelligence", "books", "psychology"],
    },
    {
      id: "book-5",
      category: "book",
      question: "¿Qué libro me ayudaría con las presentaciones?",
      expectedResponse: "Libros específicos sobre oratoria y presentaciones",
      difficulty: "medium",
      tags: ["presentations", "public-speaking", "communication"],
    },

    // Skill-related scenarios
    {
      id: "skill-1",
      category: "skill",
      question: "¿Cómo puedo desarrollar mis habilidades de comunicación?",
      expectedResponse: "Plan estructurado de desarrollo con fases",
      difficulty: "medium",
      tags: ["communication", "development-plan", "skills"],
    },
    {
      id: "skill-2",
      category: "skill",
      question: "Quiero mejorar mi liderazgo, ¿por dónde empiezo?",
      expectedResponse: "Plan de liderazgo por niveles con recursos",
      difficulty: "medium",
      tags: ["leadership", "beginner", "plan"],
    },
    {
      id: "skill-3",
      category: "skill",
      question: "¿Qué habilidades son más importantes para mi carrera?",
      expectedResponse: "Análisis de habilidades clave por industria",
      difficulty: "hard",
      tags: ["career-skills", "analysis", "priorities"],
    },
    {
      id: "skill-4",
      category: "skill",
      question: "¿Cómo puedo medir mi progreso en el desarrollo de habilidades?",
      expectedResponse: "Métricas y KPIs para seguimiento de habilidades",
      difficulty: "hard",
      tags: ["metrics", "progress", "measurement"],
    },
    {
      id: "skill-5",
      category: "skill",
      question: "¿Qué es más importante: habilidades técnicas o blandas?",
      expectedResponse: "Comparación y balance entre hard y soft skills",
      difficulty: "medium",
      tags: ["hard-skills", "soft-skills", "balance"],
    },

    // Career-related scenarios
    {
      id: "career-1",
      category: "career",
      question: "Quiero cambiar de carrera, ¿por dónde empiezo?",
      expectedResponse: "Guía de transición profesional en fases",
      difficulty: "hard",
      tags: ["career-change", "transition", "planning"],
    },
    {
      id: "career-2",
      category: "career",
      question: "¿Cómo puedo establecer objetivos profesionales?",
      expectedResponse: "Framework SMART con ejemplos específicos",
      difficulty: "medium",
      tags: ["goals", "smart", "planning"],
    },
    {
      id: "career-3",
      category: "career",
      question: "¿Cuál debería ser mi próximo paso profesional?",
      expectedResponse: "Análisis personalizado basado en perfil",
      difficulty: "hard",
      tags: ["next-steps", "personalized", "analysis"],
    },
    {
      id: "career-4",
      category: "career",
      question: "¿Cómo puedo conseguir una promoción?",
      expectedResponse: "Estrategias específicas para ascensos",
      difficulty: "medium",
      tags: ["promotion", "advancement", "strategy"],
    },
    {
      id: "career-5",
      category: "career",
      question: "¿Qué industrias tienen mejor futuro?",
      expectedResponse: "Análisis de tendencias y oportunidades",
      difficulty: "hard",
      tags: ["trends", "future", "industries"],
    },
  ]

  const runTestScenario = async (scenario: TestScenario) => {
    setIsRunningTest(scenario.id)
    const startTime = Date.now()

    try {
      // Simulate AI Coach response
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const mockResponse = generateMockResponse(scenario)
      const responseTime = Date.now() - startTime

      const result: TestResult = {
        scenarioId: scenario.id,
        success: true,
        responseTime,
        actualResponse: mockResponse,
        timestamp: new Date(),
      }

      setTestResults((prev) => [result, ...prev.filter((r) => r.scenarioId !== scenario.id)])
    } catch (error) {
      const result: TestResult = {
        scenarioId: scenario.id,
        success: false,
        responseTime: Date.now() - startTime,
        actualResponse: "Error en la respuesta",
        timestamp: new Date(),
      }

      setTestResults((prev) => [result, ...prev.filter((r) => r.scenarioId !== scenario.id)])
    } finally {
      setIsRunningTest(null)
    }
  }

  const generateMockResponse = (scenario: TestScenario): string => {
    const responses = {
      "test-1": `🎯 **Te recomiendo empezar con el Test DISC:**

**¿Por qué DISC primero?**
• Es rápido (15 minutos) y fácil de completar
• Te da insights inmediatos sobre tu estilo de comunicación
• Es fundamental para entender cómo interactúas con otros
• Los resultados son muy prácticos y aplicables

**Después del DISC, continúa con:**
1. **Big Five** - Para entender tu personalidad profunda
2. **RIASEC** - Para clarificar tus intereses vocacionales
3. **Inteligencia Emocional** - Para desarrollar habilidades interpersonales

¿Te gustaría que te explique más sobre alguno de estos tests? 🤔`,

      "test-2": `📊 **Test DISC - Todo lo que necesitas saber:**

**¿Qué mide?**
• **D**ominancia - Cómo enfrentas problemas y desafíos
• **I**nfluencia - Cómo interactúas con las personas
• **S**erenidad - Cómo respondes al ritmo y cambios
• **C**umplimiento - Cómo sigues reglas y procedimientos

**Beneficios para ti:**
✅ Mejora tu comunicación con colegas
✅ Identifica tu estilo de liderazgo natural
✅ Optimiza tu productividad personal
✅ Reduce conflictos interpersonales

**Tiempo:** 15 minutos
**Dificultad:** Fácil

¿Estás listo para descubrir tu perfil DISC? 🚀`,

      "book-1": `📚 **Libros Esenciales de Liderazgo:**

**Para Principiantes:**
• **"El Líder que no Tenía Cargo"** - Robin Sharma
  Aprende a liderar sin autoridad formal

• **"Los 21 Minutos Más Poderosos en el Día de un Líder"** - John Maxwell
  Hábitos diarios de líderes efectivos

**Para Nivel Intermedio:**
• **"Liderazgo: El Poder de la Inteligencia Emocional"** - Daniel Goleman
  Combina liderazgo con inteligencia emocional

• **"Good to Great"** - Jim Collins
  Cómo las empresas buenas se vuelven grandiosas

**Para Avanzados:**
• **"The 7 Habits of Highly Effective People"** - Stephen Covey
  Principios fundamentales de efectividad

¿Te interesa algún área específica del liderazgo? (equipos, comunicación, estrategia) 🎯`,

      "skill-1": `🗣️ **Plan de Desarrollo: Habilidades de Comunicación**

**Fase 1: Fundamentos (Semanas 1-2)**
• Practica escucha activa 15 min/día
• Lee "Comunicación No Violenta"
• Observa tu lenguaje corporal

**Fase 2: Práctica (Semanas 3-4)**
• Participa más en reuniones
• Practica presentaciones cortas
• Pide feedback específico

**Fase 3: Refinamiento (Semanas 5-6)**
• Graba y analiza tus presentaciones
• Practica técnicas de persuasión
• Desarrolla tu storytelling

**Métricas de Progreso:**
✅ Confianza al hablar en público
✅ Claridad en tus mensajes
✅ Feedback positivo de colegas
✅ Reducción de malentendidos

¿Te gustaría un plan más específico para algún aspecto? 🎯`,

      "career-1": `🔄 **Guía para Cambio de Carrera:**

**Fase 1: Autoconocimiento (Semanas 1-2)**
• Completa Test RIASEC para identificar intereses
• Evalúa tus valores y motivaciones
• Analiza tus fortalezas con Test DISC

**Fase 2: Exploración (Semanas 3-4)**
• Investiga industrias de interés
• Conecta con profesionales del área
• Identifica gaps de habilidades

**Fase 3: Preparación (Semanas 5-8)**
• Desarrolla habilidades faltantes
• Actualiza tu CV y LinkedIn
• Construye portfolio/casos de estudio

**Fase 4: Transición (Semanas 9-12)**
• Aplica estratégicamente
• Practica entrevistas
• Negocia ofertas

¿En qué fase te encuentras actualmente? 🤔`,
    }

    return responses[scenario.id as keyof typeof responses] || `Respuesta simulada para: ${scenario.question}`
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "test":
        return <Brain className="h-4 w-4" />
      case "book":
        return <BookOpen className="h-4 w-4" />
      case "skill":
        return <Target className="h-4 w-4" />
      case "career":
        return <Briefcase className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 border-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "hard":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getResultIcon = (success: boolean) => {
    return success ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Target className="h-4 w-4 text-red-600" />
  }

  const filteredScenarios = testScenarios.filter((scenario) => scenario.category === activeCategory)
  const categoryResults = testResults.filter(
    (result) => testScenarios.find((s) => s.id === result.scenarioId)?.category === activeCategory,
  )

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-600" />
            AI Coach - Escenarios de Testing
          </CardTitle>
          <p className="text-gray-600">Prueba diferentes tipos de preguntas para validar las respuestas del AI Coach</p>
        </CardHeader>
      </Card>

      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="test" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Tests
          </TabsTrigger>
          <TabsTrigger value="book" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Libros
          </TabsTrigger>
          <TabsTrigger value="skill" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Habilidades
          </TabsTrigger>
          <TabsTrigger value="career" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Carrera
          </TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Test Scenarios */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getCategoryIcon(activeCategory)}
                Escenarios de {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-4">
                  {filteredScenarios.map((scenario) => (
                    <div key={scenario.id} className="border rounded-[28px] p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm mb-2">{scenario.question}</h4>
                          <p className="text-xs text-gray-600 mb-2">{scenario.expectedResponse}</p>
                        </div>
                        <Badge className={`text-xs ml-2 ${getDifficultyColor(scenario.difficulty)}`}>
                          {scenario.difficulty}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {scenario.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <Button
                          size="sm"
                          onClick={() => runTestScenario(scenario)}
                          disabled={isRunningTest === scenario.id}
                          className="ml-2"
                        >
                          {isRunningTest === scenario.id ? (
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Testing...
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Play className="h-3 w-3" />
                              Test
                            </div>
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Test Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Resultados de Testing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-4">
                  {categoryResults.length > 0 ? (
                    categoryResults.map((result) => {
                      const scenario = testScenarios.find((s) => s.id === result.scenarioId)
                      return (
                        <div
                          key={`${result.scenarioId}-${result.timestamp.getTime()}`}
                          className="border rounded-[28px] p-4"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {getResultIcon(result.success)}
                              <span className="font-medium text-sm">{scenario?.question}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Clock className="h-3 w-3" />
                              {result.responseTime}ms
                            </div>
                          </div>

                          <div className="bg-gray-50 rounded p-3 mb-2">
                            <p className="text-xs text-gray-700 whitespace-pre-wrap">
                              {result.actualResponse.substring(0, 200)}
                              {result.actualResponse.length > 200 && "..."}
                            </p>
                          </div>

                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{result.timestamp.toLocaleTimeString()}</span>
                            <Badge variant={result.success ? "default" : "destructive"} className="text-xs">
                              {result.success ? "Exitoso" : "Error"}
                            </Badge>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-sm">No hay resultados de testing aún</p>
                      <p className="text-xs mt-2">Ejecuta algunos escenarios para ver los resultados</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Summary Stats */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Estadísticas de Testing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{testResults.length}</div>
                <div className="text-sm text-gray-600">Tests Ejecutados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{testResults.filter((r) => r.success).length}</div>
                <div className="text-sm text-gray-600">Exitosos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {testResults.length > 0
                    ? Math.round(testResults.reduce((sum, r) => sum + r.responseTime, 0) / testResults.length)
                    : 0}
                  ms
                </div>
                <div className="text-sm text-gray-600">Tiempo Promedio</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {testResults.length > 0
                    ? Math.round((testResults.filter((r) => r.success).length / testResults.length) * 100)
                    : 0}
                  %
                </div>
                <div className="text-sm text-gray-600">Tasa de Éxito</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  )
}
