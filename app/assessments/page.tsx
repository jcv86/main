"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"

interface Assessment {
  id: string
  title: string
  description: string
  category: "personality" | "technical" | "soft-skills" | "career"
  duration: string
  difficulty: "Básico" | "Intermedio" | "Avanzado"
  status: "completed" | "in-progress" | "not-started"
  score?: number
  completedAt?: Date
  href: string
  icon: keyof typeof Icons
}

const assessments: Assessment[] = [
  {
    id: "personality-test",
    title: "Test de Personalidad DISC",
    description: "Descubre tu tipo de personalidad y cómo interactúas con otros",
    category: "personality",
    duration: "15 min",
    difficulty: "Básico",
    status: "completed",
    score: 85,
    completedAt: new Date("2024-01-15"),
    href: "/personality-test",
    icon: "user",
  },
  {
    id: "big-five",
    title: "Big Five Personality",
    description: "Evaluación completa de los cinco grandes factores de personalidad",
    category: "personality",
    duration: "20 min",
    difficulty: "Intermedio",
    status: "completed",
    score: 78,
    completedAt: new Date("2024-01-10"),
    href: "/big-five-test",
    icon: "user",
  },
  {
    id: "technical-skills",
    title: "Habilidades Técnicas",
    description: "Evalúa tus competencias técnicas en diferentes áreas",
    category: "technical",
    duration: "30 min",
    difficulty: "Avanzado",
    status: "in-progress",
    href: "/technical-skills-test",
    icon: "laptop",
  },
  {
    id: "soft-skills",
    title: "Habilidades Blandas",
    description: "Mide tus competencias interpersonales y de comunicación",
    category: "soft-skills",
    duration: "25 min",
    difficulty: "Intermedio",
    status: "not-started",
    href: "/soft-skills-test",
    icon: "user",
  },
  {
    id: "career-assessment",
    title: "Evaluación de Carrera",
    description: "Identifica las mejores opciones profesionales para ti",
    category: "career",
    duration: "35 min",
    difficulty: "Intermedio",
    status: "not-started",
    href: "/career-assessment",
    icon: "user",
  },
]

const categoryLabels = {
  personality: "Personalidad",
  technical: "Técnicas",
  "soft-skills": "Habilidades Blandas",
  career: "Carrera",
}

const statusLabels = {
  completed: "Completado",
  "in-progress": "En Progreso",
  "not-started": "No Iniciado",
}

const statusColors = {
  completed: "bg-green-500",
  "in-progress": "bg-yellow-500",
  "not-started": "bg-gray-500",
}

export default function AssessmentsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [filteredAssessments, setFilteredAssessments] = useState(assessments)

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredAssessments(assessments)
    } else {
      setFilteredAssessments(assessments.filter((a) => a.category === selectedCategory))
    }
  }, [selectedCategory])

  const completedCount = assessments.filter((a) => a.status === "completed").length
  const totalCount = assessments.length
  const averageScore =
    assessments.filter((a) => a.score).reduce((acc, a) => acc + (a.score || 0), 0) /
    assessments.filter((a) => a.score).length

  const getStatusIcon = (status: Assessment["status"]) => {
    switch (status) {
      case "completed":
        return <Icons.check className="h-4 w-4 text-green-600" />
      case "in-progress":
        return <Icons.spinner className="h-4 w-4 text-yellow-600" />
      case "not-started":
        return <Icons.plus className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Hub de Evaluaciones</h1>
        <p className="text-muted-foreground">
          Descubre tus fortalezas y áreas de mejora a través de nuestras evaluaciones especializadas
        </p>
      </div>

      {/* Progress Overview */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progreso General</CardTitle>
            <Icons.user className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedCount}/{totalCount}
            </div>
            <Progress value={(completedCount / totalCount) * 100} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {Math.round((completedCount / totalCount) * 100)}% completado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Puntuación Promedio</CardTitle>
            <Icons.user className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isNaN(averageScore) ? "--" : Math.round(averageScore)}
              {!isNaN(averageScore) && <span className="text-sm font-normal">/100</span>}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Basado en {assessments.filter((a) => a.score).length} evaluaciones
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próxima Recomendación</CardTitle>
            <Icons.user className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">Habilidades Blandas</div>
            <p className="text-xs text-muted-foreground mt-1">Complementa tu perfil técnico</p>
            <Button size="sm" className="mt-2" asChild>
              <Link href="/soft-skills-test">Comenzar</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Assessments List */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="personality">Personalidad</TabsTrigger>
          <TabsTrigger value="technical">Técnicas</TabsTrigger>
          <TabsTrigger value="soft-skills">Blandas</TabsTrigger>
          <TabsTrigger value="career">Carrera</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAssessments.map((assessment) => (
              <Card key={assessment.id} className="relative overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn("h-2 w-2 rounded-full", statusColors[assessment.status])} />
                      <Badge variant="outline" className="text-xs">
                        {categoryLabels[assessment.category]}
                      </Badge>
                    </div>
                    {getStatusIcon(assessment.status)}
                  </div>
                  <CardTitle className="text-lg">{assessment.title}</CardTitle>
                  <CardDescription>{assessment.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span>⏱️ {assessment.duration}</span>
                    <Badge variant="secondary" className="text-xs">
                      {assessment.difficulty}
                    </Badge>
                  </div>

                  {assessment.status === "completed" && assessment.score && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Puntuación</span>
                        <span className="font-medium">{assessment.score}/100</span>
                      </div>
                      <Progress value={assessment.score} className="h-2" />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{statusLabels[assessment.status]}</span>
                    <Button size="sm" asChild>
                      <Link href={assessment.href}>
                        {assessment.status === "completed"
                          ? "Ver Resultados"
                          : assessment.status === "in-progress"
                            ? "Continuar"
                            : "Comenzar"}
                      </Link>
                    </Button>
                  </div>

                  {assessment.completedAt && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Completado el {assessment.completedAt.toLocaleDateString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Recommendations */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recomendaciones Personalizadas</CardTitle>
          <CardDescription>Basado en tus evaluaciones completadas, te sugerimos estos próximos pasos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3 p-4 border rounded-lg">
              <Icons.user className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium">Desarrolla Habilidades Blandas</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Complementa tu perfil técnico con habilidades de comunicación y liderazgo
                </p>
                <Button size="sm" variant="outline" className="mt-2 bg-transparent" asChild>
                  <Link href="/soft-skills-test">Evaluar Ahora</Link>
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 border rounded-lg">
              <Icons.user className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium">Explora Opciones de Carrera</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Descubre nuevas oportunidades profesionales alineadas con tu perfil
                </p>
                <Button size="sm" variant="outline" className="mt-2 bg-transparent" asChild>
                  <Link href="/career-assessment">Comenzar</Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
