"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BookOpen,
  CheckCircle,
  Clock,
  Users,
  ArrowRight,
  Star,
  Play,
  FileText,
  MessageSquare,
  Target,
  TrendingUp,
  Briefcase,
  GraduationCap,
  User,
  Shield,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface Step {
  id: string
  title: string
  description: string
  icon: any
  completed: boolean
  link: string
  estimatedTime: number
}

export default function GettingStartedPage() {
  const [completedSteps, setCompletedSteps] = useState<string[]>([])

  const steps: Step[] = [
    {
      id: "profile",
      title: "Completa tu perfil",
      description: "Agrega tu información personal, experiencia y habilidades para personalizar tu experiencia.",
      icon: User,
      completed: completedSteps.includes("profile"),
      link: "/profile",
      estimatedTime: 5,
    },
    {
      id: "assessment",
      title: "Realiza evaluaciones",
      description:
        "Completa nuestras evaluaciones de personalidad y habilidades para obtener recomendaciones personalizadas.",
      icon: GraduationCap,
      completed: completedSteps.includes("assessment"),
      link: "/skills-assessment",
      estimatedTime: 15,
    },
    {
      id: "cv",
      title: "Crea tu CV",
      description: "Utiliza nuestro generador de CV con IA para crear un currículum profesional y atractivo.",
      icon: FileText,
      completed: completedSteps.includes("cv"),
      link: "/cv-builder",
      estimatedTime: 10,
    },
    {
      id: "goals",
      title: "Define tus objetivos",
      description: "Establece metas profesionales claras y crea un plan de acción para alcanzarlas.",
      icon: Target,
      completed: completedSteps.includes("goals"),
      link: "/goals",
      estimatedTime: 8,
    },
    {
      id: "coach",
      title: "Habla con el AI Coach",
      description: "Inicia una conversación con nuestro coach de carrera con IA para obtener consejos personalizados.",
      icon: MessageSquare,
      completed: completedSteps.includes("coach"),
      link: "/career-coach",
      estimatedTime: 5,
    },
    {
      id: "jobs",
      title: "Explora oportunidades",
      description: "Busca empleos que coincidan con tu perfil y configura alertas para nuevas oportunidades.",
      icon: Briefcase,
      completed: completedSteps.includes("jobs"),
      link: "/job-search",
      estimatedTime: 10,
    },
  ]

  const toggleStepCompletion = (stepId: string) => {
    if (completedSteps.includes(stepId)) {
      setCompletedSteps(completedSteps.filter((id) => id !== stepId))
    } else {
      setCompletedSteps([...completedSteps, stepId])
    }
  }

  const completionPercentage = (completedSteps.length / steps.length) * 100
  const totalEstimatedTime = steps.reduce((total, step) => total + step.estimatedTime, 0)

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <BookOpen className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold">Guía de Inicio</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Bienvenido a tu plataforma de desarrollo profesional. Sigue estos pasos para aprovechar al máximo todas las
          herramientas disponibles.
        </p>
      </div>

      {/* Article Info */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge className="bg-blue-100 text-blue-800">Inicio</Badge>
              <Badge variant="outline">Principiante</Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {totalEstimatedTime} min total
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                1,250 vistas
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="h-4 w-4 fill-current text-yellow-500" />
                4.8
              </div>
            </div>
            <Button variant="outline">
              <BookOpen className="h-4 w-4 mr-2" />
              Guardar artículo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Tu Progreso
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Progreso de configuración</span>
            <span className="text-sm text-muted-foreground">
              {completedSteps.length} de {steps.length} completados
            </span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
          <p className="text-sm text-muted-foreground">
            {completionPercentage === 100
              ? "¡Felicitaciones! Has completado todos los pasos iniciales."
              : `Completa ${steps.length - completedSteps.length} pasos más para finalizar tu configuración.`}
          </p>
        </CardContent>
      </Card>

      {/* Getting Started Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Pasos para Comenzar
          </CardTitle>
          <p className="text-muted-foreground">
            Sigue estos pasos en orden para configurar tu cuenta y comenzar tu desarrollo profesional.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isCompleted = completedSteps.includes(step.id)

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
                    <Icon className="h-4 w-4" />
                    <h3 className={`font-semibold ${isCompleted ? "text-green-600" : ""}`}>{step.title}</h3>
                    <Badge variant="outline" className="text-xs">
                      {step.estimatedTime} min
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => toggleStepCompletion(step.id)}>
                    {isCompleted ? "Desmarcar" : "Marcar como completado"}
                  </Button>
                  <Link href={step.link}>
                    <Button size="sm">
                      {isCompleted ? "Revisar" : "Comenzar"}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Key Features Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Características Principales</CardTitle>
          <p className="text-muted-foreground">Conoce las herramientas más importantes de la plataforma.</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold">AI Career Coach</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Recibe consejos personalizados de carrera con nuestro coach de IA especializado en el mercado chileno.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-green-600" />
                <h4 className="font-semibold">Evaluaciones</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Descubre tu personalidad, habilidades técnicas y soft skills con nuestras evaluaciones especializadas.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-600" />
                <h4 className="font-semibold">Generador de CV</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Crea CVs profesionales con IA que se adapten a cada oportunidad laboral específica.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-orange-600" />
                <h4 className="font-semibold">Búsqueda de Empleos</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Encuentra oportunidades laborales relevantes y configura alertas automáticas.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-red-600" />
                <h4 className="font-semibold">Biblioteca</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Accede a libros de desarrollo profesional con funciones de lectura avanzadas y TTS.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-yellow-600" />
                <h4 className="font-semibold">Gestión de Objetivos</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Define y rastrea tus metas profesionales con nuestro sistema de objetivos inteligente.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips for Success */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Consejos para el Éxito
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold">Mantén tu perfil actualizado</h4>
                <p className="text-sm text-muted-foreground">
                  Actualiza regularmente tu información, experiencia y habilidades para recibir recomendaciones más
                  precisas.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold">Interactúa con el AI Coach</h4>
                <p className="text-sm text-muted-foreground">
                  Haz preguntas específicas sobre tu carrera, el mercado laboral chileno y estrategias de desarrollo
                  profesional.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold">Establece objetivos claros</h4>
                <p className="text-sm text-muted-foreground">
                  Define metas específicas, medibles y con plazos definidos para mantener el enfoque en tu desarrollo.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold">Aprovecha la biblioteca</h4>
                <p className="text-sm text-muted-foreground">
                  Lee libros de desarrollo profesional y utiliza las funciones de TTS para aprender mientras realizas
                  otras actividades.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Próximos Pasos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/knowledge-base/career-planning">
              <Button variant="outline" className="w-full h-auto p-4 flex items-center gap-3 bg-transparent">
                <Target className="h-6 w-6" />
                <div className="text-left">
                  <div className="font-semibold">Planificación de Carrera</div>
                  <div className="text-xs text-muted-foreground">Aprende a crear un plan estratégico</div>
                </div>
                <ArrowRight className="h-4 w-4 ml-auto" />
              </Button>
            </Link>

            <Link href="/career-coach">
              <Button className="w-full h-auto p-4 flex items-center gap-3">
                <MessageSquare className="h-6 w-6" />
                <div className="text-left">
                  <div className="font-semibold">Hablar con AI Coach</div>
                  <div className="text-xs opacity-90">Obtén consejos personalizados ahora</div>
                </div>
                <ArrowRight className="h-4 w-4 ml-auto" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Support */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            ¿Necesitas Ayuda?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Si tienes preguntas o necesitas asistencia adicional, estamos aquí para ayudarte.
          </p>
          <div className="flex gap-2">
            <Link href="/career-coach">
              <Button variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Preguntar al AI Coach
              </Button>
            </Link>
            <Link href="/knowledge-base">
              <Button variant="outline">
                <BookOpen className="h-4 w-4 mr-2" />
                Ver más artículos
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
