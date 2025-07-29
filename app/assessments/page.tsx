"use client"

import * as React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"

interface Assessment {
  id: string
  title: string
  description: string
  type: "personality" | "skills" | "technical" | "soft-skills"
  duration: number
  questions_count: number
  completed: boolean
  score?: number
  completed_at?: string
  href: string
  icon: keyof typeof Icons
}

const assessments: Assessment[] = [
  {
    id: "personality-test",
    title: "Test de Personalidad DISC",
    description: "Descubre tu estilo de personalidad y cómo interactúas con otros en el entorno laboral.",
    type: "personality",
    duration: 15,
    questions_count: 28,
    completed: true,
    score: 85,
    completed_at: "2024-01-15",
    href: "/personality-test",
    icon: "user",
  },
  {
    id: "big-five-test",
    title: "Test Big Five",
    description: "Evaluación completa de los cinco grandes factores de personalidad.",
    type: "personality",
    duration: 20,
    questions_count: 44,
    completed: false,
    href: "/big-five-test",
    icon: "user",
  },
  {
    id: "soft-skills-test",
    title: "Evaluación de Habilidades Blandas",
    description: "Mide tus competencias interpersonales, comunicación y liderazgo.",
    type: "soft-skills",
    duration: 25,
    questions_count: 35,
    completed: true,
    score: 78,
    completed_at: "2024-01-10",
    href: "/soft-skills-test",
    icon: "user",
  },
  {
    id: "technical-skills-test",
    title: "Evaluación de Habilidades Técnicas",
    description: "Evalúa tus competencias técnicas específicas según tu área profesional.",
    type: "technical",
    duration: 45,
    questions_count: 50,
    completed: false,
    href: "/technical-skills-test",
    icon: "laptop",
  },
  {
    id: "skills-assessment",
    title: "Evaluación General de Habilidades",
    description: "Evaluación integral de tus competencias profesionales y técnicas.",
    type: "skills",
    duration: 30,
    questions_count: 40,
    completed: true,
    score: 92,
    completed_at: "2024-01-20",
    href: "/skills-assessment",
    icon: "check",
  },
  {
    id: "adaptive-skills-test",
    title: "Test Adaptativo de Habilidades",
    description: "Evaluación que se adapta a tu nivel de conocimiento en tiempo real.",
    type: "skills",
    duration: 35,
    questions_count: 30,
    completed: false,
    href: "/adaptive-skills-test",
    icon: "settings",
  },
]

const typeColors = {
  personality: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  skills: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  technical: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  "soft-skills": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
}

const typeLabels = {
  personality: "Personalidad",
  skills: "Habilidades",
  technical: "Técnico",
  "soft-skills": "Habilidades Blandas",
}

export default function AssessmentsPage() {
  const [filter, setFilter] = React.useState<string>("all")

  const completedAssessments = assessments.filter((a) => a.completed)
  const totalAssessments = assessments.length
  const completionRate = Math.round((completedAssessments.length / totalAssessments) * 100)

  const filteredAssessments = filter === "all" ? assessments : assessments.filter((a) => a.type === filter)

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col space-y-8">
        {/* Header */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Evaluaciones</h1>
              <p className="text-muted-foreground">
                Descubre tus fortalezas y áreas de mejora a través de nuestras evaluaciones especializadas.
              </p>
            </div>
          </div>

          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icons.check className="h-5 w-5" />
                Tu Progreso
              </CardTitle>
              <CardDescription>
                Has completado {completedAssessments.length} de {totalAssessments} evaluaciones disponibles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progreso general</span>
                  <span>{completionRate}%</span>
                </div>
                <Progress value={completionRate} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
            Todas
          </Button>
          {Object.entries(typeLabels).map(([key, label]) => (
            <Button key={key} variant={filter === key ? "default" : "outline"} size="sm" onClick={() => setFilter(key)}>
              {label}
            </Button>
          ))}
        </div>

        {/* Assessments Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAssessments.map((assessment) => {
            const Icon = Icons[assessment.icon]
            return (
              <Card key={assessment.id} className="relative overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{assessment.title}</CardTitle>
                        <Badge variant="secondary" className={cn("text-xs", typeColors[assessment.type])}>
                          {typeLabels[assessment.type]}
                        </Badge>
                      </div>
                    </div>
                    {assessment.completed && (
                      <div className="flex items-center gap-1 text-green-600">
                        <Icons.check className="h-4 w-4" />
                        <span className="text-sm font-medium">Completado</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{assessment.description}</p>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{assessment.duration} min</span>
                    <span>{assessment.questions_count} preguntas</span>
                  </div>

                  {assessment.completed && assessment.score && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Puntuación</span>
                        <span className="font-medium">{assessment.score}/100</span>
                      </div>
                      <Progress value={assessment.score} className="h-2" />
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button asChild className="flex-1">
                      <Link href={assessment.href}>{assessment.completed ? "Ver Resultados" : "Comenzar Test"}</Link>
                    </Button>
                    {assessment.completed && (
                      <Button variant="outline" size="icon" asChild>
                        <Link href={`${assessment.href}/results`}>
                          <Icons.arrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Recommendations */}
        {completedAssessments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icons.help className="h-5 w-5" />
                Recomendaciones Personalizadas
              </CardTitle>
              <CardDescription>
                Basado en tus evaluaciones completadas, te sugerimos los siguientes pasos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium">Próximos pasos recomendados:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Completa tu evaluación técnica para un perfil más completo</li>
                    <li>• Revisa tus resultados de personalidad para mejorar tu CV</li>
                    <li>• Programa una sesión con el AI Career Coach</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Recursos sugeridos:</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/cv-builder">Actualizar CV</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/career-coach">Career Coach</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/library">Biblioteca</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
