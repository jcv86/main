"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Target,
  Clock,
  Users,
  Star,
  BookOpen,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  AlertTriangle,
  MessageSquare,
  Map,
  Compass,
  Award,
  BarChart3,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface CareerStep {
  id: string
  title: string
  description: string
  timeframe: string
  priority: "Alta" | "Media" | "Baja"
  completed: boolean
}

export default function CareerPlanningPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [completedSteps, setCompletedSteps] = useState<string[]>([])

  const careerSteps: CareerStep[] = [
    {
      id: "self-assessment",
      title: "Autoevaluación completa",
      description: "Identifica tus fortalezas, debilidades, valores y pasiones profesionales.",
      timeframe: "1-2 semanas",
      priority: "Alta",
      completed: false,
    },
    {
      id: "market-research",
      title: "Investigación del mercado",
      description: "Analiza las tendencias del mercado laboral chileno en tu área de interés.",
      timeframe: "2-3 semanas",
      priority: "Alta",
      completed: false,
    },
    {
      id: "goal-setting",
      title: "Definición de objetivos",
      description: "Establece metas profesionales específicas, medibles y con plazos definidos.",
      timeframe: "1 semana",
      priority: "Alta",
      completed: false,
    },
    {
      id: "skill-gap",
      title: "Análisis de brechas de habilidades",
      description: "Identifica las habilidades que necesitas desarrollar para alcanzar tus objetivos.",
      timeframe: "1-2 semanas",
      priority: "Media",
      completed: false,
    },
    {
      id: "action-plan",
      title: "Plan de acción detallado",
      description: "Crea un roadmap específico con pasos concretos y fechas límite.",
      timeframe: "1 semana",
      priority: "Alta",
      completed: false,
    },
    {
      id: "networking",
      title: "Estrategia de networking",
      description: "Desarrolla una red profesional sólida en tu industria.",
      timeframe: "Continuo",
      priority: "Media",
      completed: false,
    },
  ]

  const toggleStepCompletion = (stepId: string) => {
    if (completedSteps.includes(stepId)) {
      setCompletedSteps(completedSteps.filter((id) => id !== stepId))
    } else {
      setCompletedSteps([...completedSteps, stepId])
    }
  }

  const completionPercentage = (completedSteps.length / careerSteps.length) * 100

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-green-100 rounded-full">
            <Target className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold">Planificación de Carrera</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Aprende a crear un plan estratégico para tu desarrollo profesional y alcanzar tus objetivos de carrera.
        </p>
      </div>

      {/* Article Info */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge className="bg-green-100 text-green-800">Desarrollo Profesional</Badge>
              <Badge variant="outline">Intermedio</Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                12 min de lectura
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                980 vistas
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="h-4 w-4 fill-current text-yellow-500" />
                4.9
              </div>
            </div>
            <Button variant="outline">
              <BookOpen className="h-4 w-4 mr-2" />
              Guardar artículo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Progress Tracker */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Tu Progreso en Planificación
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Pasos completados</span>
            <span className="text-sm text-muted-foreground">
              {completedSteps.length} de {careerSteps.length}
            </span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
          <p className="text-sm text-muted-foreground">
            {completionPercentage === 100
              ? "¡Excelente! Has completado todos los pasos de planificación de carrera."
              : `Continúa con los siguientes ${careerSteps.length - completedSteps.length} pasos para completar tu plan.`}
          </p>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visión General</TabsTrigger>
          <TabsTrigger value="steps">Pasos Detallados</TabsTrigger>
          <TabsTrigger value="tools">Herramientas</TabsTrigger>
          <TabsTrigger value="examples">Ejemplos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Introduction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Compass className="h-5 w-5" />
                ¿Por qué es importante la planificación de carrera?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                La planificación de carrera es un proceso continuo que te ayuda a identificar tus objetivos
                profesionales y crear un roadmap para alcanzarlos. En el competitivo mercado laboral chileno, tener un
                plan claro puede marcar la diferencia entre el éxito y el estancamiento profesional.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-green-600">Beneficios de planificar</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Claridad en objetivos profesionales</li>
                    <li>• Mejor toma de decisiones de carrera</li>
                    <li>• Identificación de oportunidades</li>
                    <li>• Desarrollo dirigido de habilidades</li>
                    <li>• Mayor satisfacción laboral</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-red-600">Riesgos de no planificar</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Estancamiento profesional</li>
                    <li>• Decisiones reactivas vs. proactivas</li>
                    <li>• Pérdida de oportunidades</li>
                    <li>• Desarrollo de habilidades desalineado</li>
                    <li>• Insatisfacción y frustración</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Components */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5" />
                Componentes Clave de un Plan de Carrera
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <Target className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold">Objetivos Claros</h4>
                  <p className="text-sm text-muted-foreground">
                    Define metas específicas, medibles y con plazos definidos para tu carrera profesional.
                  </p>
                </div>

                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold">Análisis de Mercado</h4>
                  <p className="text-sm text-muted-foreground">
                    Comprende las tendencias y oportunidades en tu industria y el mercado chileno.
                  </p>
                </div>

                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                    <Award className="h-6 w-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold">Desarrollo de Habilidades</h4>
                  <p className="text-sm text-muted-foreground">
                    Identifica y desarrolla las competencias necesarias para alcanzar tus objetivos.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="steps" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pasos Detallados para la Planificación</CardTitle>
              <p className="text-muted-foreground">
                Sigue estos pasos sistemáticamente para crear tu plan de carrera personalizado.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {careerSteps.map((step, index) => {
                const isCompleted = completedSteps.includes(step.id)
                const priorityColor = {
                  Alta: "bg-red-100 text-red-800",
                  Media: "bg-yellow-100 text-yellow-800",
                  Baja: "bg-green-100 text-green-800",
                }[step.priority]

                return (
                  <div
                    key={step.id}
                    className="flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isCompleted ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <span className="text-sm font-semibold">{index + 1}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-semibold ${isCompleted ? "text-green-600" : ""}`}>{step.title}</h3>
                        <Badge className={priorityColor}>{step.priority}</Badge>
                        <Badge variant="outline" className="text-xs">
                          {step.timeframe}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>

                    <Button variant="ghost" size="sm" onClick={() => toggleStepCompletion(step.id)}>
                      {isCompleted ? "Completado" : "Marcar como completado"}
                    </Button>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tools" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Herramientas y Recursos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Herramientas de la Plataforma</h4>
                  <div className="space-y-3">
                    <Link href="/goals">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Target className="h-4 w-4 mr-2" />
                        Gestor de Objetivos
                      </Button>
                    </Link>
                    <Link href="/career-coach">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        AI Career Coach
                      </Button>
                    </Link>
                    <Link href="/skills-assessment">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Award className="h-4 w-4 mr-2" />
                        Evaluación de Habilidades
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Recursos Externos</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• LinkedIn Learning para desarrollo de habilidades</p>
                    <p>• Coursera para certificaciones profesionales</p>
                    <p>• Glassdoor para investigación salarial</p>
                    <p>• GetOnBoard para oportunidades tech en Chile</p>
                    <p>• Trabajando.com para el mercado general</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examples" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ejemplos de Planes de Carrera</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Ejemplo 1: Desarrollador Junior → Senior</h4>
                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <p className="text-sm">
                    <strong>Objetivo:</strong> Convertirse en desarrollador senior en 3 años
                  </p>
                  <p className="text-sm">
                    <strong>Pasos clave:</strong>
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Año 1: Dominar React y Node.js</li>
                    <li>• Año 2: Liderar proyectos pequeños, aprender arquitectura</li>
                    <li>• Año 3: Mentorear juniors, especializarse en cloud (AWS)</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Ejemplo 2: Transición a Product Manager</h4>
                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <p className="text-sm">
                    <strong>Objetivo:</strong> Transición desde desarrollo a PM en 2 años
                  </p>
                  <p className="text-sm">
                    <strong>Pasos clave:</strong>
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Año 1: Curso de Product Management, participar en decisiones de producto</li>
                    <li>• Año 1.5: Rol híbrido tech lead + PM junior</li>
                    <li>• Año 2: Transición completa a Product Manager</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Próximos Pasos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/goals">
              <Button className="w-full h-auto p-4 flex items-center gap-3">
                <Target className="h-6 w-6" />
                <div className="text-left">
                  <div className="font-semibold">Crear Objetivos</div>
                  <div className="text-xs opacity-90">Define tus metas profesionales</div>
                </div>
                <ArrowRight className="h-4 w-4 ml-auto" />
              </Button>
            </Link>

            <Link href="/career-coach">
              <Button variant="outline" className="w-full h-auto p-4 flex items-center gap-3 bg-transparent">
                <MessageSquare className="h-6 w-6" />
                <div className="text-left">
                  <div className="font-semibold">Consultar AI Coach</div>
                  <div className="text-xs text-muted-foreground">Obtén consejos personalizados</div>
                </div>
                <ArrowRight className="h-4 w-4 ml-auto" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Warning */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-800">Recuerda</h4>
              <p className="text-sm text-yellow-700">
                La planificación de carrera es un proceso iterativo. Revisa y ajusta tu plan regularmente basándote en
                cambios en el mercado, tus intereses y nuevas oportunidades que surjan.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
