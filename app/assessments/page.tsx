"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Icons } from "@/components/icons"

interface Assessment {
  id: string
  title: string
  description: string
  category: "personality" | "technical" | "soft-skills" | "career"
  duration: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  completed: boolean
  score?: number
  href: string
  icon: keyof typeof Icons
  badge?: string
}

const assessments: Assessment[] = [
  {
    id: "personality-disc",
    title: "Test de Personalidad DISC",
    description: "Descubre tu estilo de personalidad dominante y cómo interactúas con otros",
    category: "personality",
    duration: "15 min",
    difficulty: "Beginner",
    completed: true,
    score: 85,
    href: "/personality-test",
    icon: "brain",
  },
  {
    id: "big-five",
    title: "Big Five Personality",
    description: "Evaluación completa de los cinco grandes factores de personalidad",
    category: "personality",
    duration: "25 min",
    difficulty: "Intermediate",
    completed: true,
    score: 92,
    href: "/big-five-test",
    icon: "award",
  },
  {
    id: "soft-skills",
    title: "Habilidades Blandas",
    description: "Evalúa tus competencias interpersonales y de comunicación",
    category: "soft-skills",
    duration: "20 min",
    difficulty: "Intermediate",
    completed: false,
    href: "/soft-skills-test",
    icon: "users",
  },
  {
    id: "technical-skills",
    title: "Habilidades Técnicas",
    description: "Evaluación de competencias técnicas especializadas por área",
    category: "technical",
    duration: "30 min",
    difficulty: "Advanced",
    completed: false,
    href: "/technical-skills-test",
    icon: "target",
    badge: "NUEVO",
  },
  {
    id: "skills-assessment",
    title: "Evaluación General de Habilidades",
    description: "Evaluación integral de competencias profesionales",
    category: "career",
    duration: "35 min",
    difficulty: "Intermediate",
    completed: true,
    score: 78,
    href: "/skills-assessment",
    icon: "trophy",
  },
  {
    id: "adaptive-skills",
    title: "Test Adaptativo de Habilidades",
    description: "Evaluación que se adapta a tu nivel de conocimiento",
    category: "technical",
    duration: "Variable",
    difficulty: "Advanced",
    completed: false,
    href: "/adaptive-skills-test",
    icon: "zap",
    badge: "IA",
  },
]

const categoryLabels = {
  personality: "Personalidad",
  technical: "Técnicas",
  "soft-skills": "Habilidades Blandas",
  career: "Carrera Profesional",
}

const categoryColors = {
  personality: "bg-blue-500",
  technical: "bg-green-500",
  "soft-skills": "bg-purple-500",
  career: "bg-orange-500",
}

export default function AssessmentsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [stats, setStats] = useState({
    completed: 0,
    total: 0,
    averageScore: 0,
  })

  useEffect(() => {
    const completed = assessments.filter((a) => a.completed).length
    const total = assessments.length
    const scores = assessments.filter((a) => a.score).map((a) => a.score!)
    const averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0

    setStats({ completed, total, averageScore })
  }, [])

  const filteredAssessments =
    selectedCategory === "all" ? assessments : assessments.filter((a) => a.category === selectedCategory)

  const completionRate = Math.round((stats.completed / stats.total) * 100)

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Hub de Evaluaciones</h1>
            <p className="text-muted-foreground">
              Descubre tus fortalezas y áreas de mejora a través de evaluaciones especializadas
            </p>
          </div>
          <Button asChild>
            <Link href="/assessments/recommendations">
              <Icons.target className="mr-2 h-4 w-4" />
              Recomendaciones
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Evaluaciones Completadas</CardTitle>
              <Icons.check className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.completed}/{stats.total}
              </div>
              <Progress value={completionRate} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">{completionRate}% completado</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Puntuación Promedio</CardTitle>
              <Icons.star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageScore}%</div>
              <p className="text-xs text-muted-foreground">
                Basado en {assessments.filter((a) => a.score).length} evaluaciones
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próxima Meta</CardTitle>
              <Icons.target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">100%</div>
              <p className="text-xs text-muted-foreground">Completa todas las evaluaciones</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Assessments Grid */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="personality">Personalidad</TabsTrigger>
          <TabsTrigger value="technical">Técnicas</TabsTrigger>
          <TabsTrigger value="soft-skills">Habilidades Blandas</TabsTrigger>
          <TabsTrigger value="career">Carrera</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAssessments.map((assessment) => {
              const IconComponent = Icons[assessment.icon]
              return (
                <Card key={assessment.id} className="relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-1 h-full ${categoryColors[assessment.category]}`} />

                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <IconComponent className="h-5 w-5" />
                        <Badge variant="outline" className="text-xs">
                          {categoryLabels[assessment.category]}
                        </Badge>
                      </div>
                      {assessment.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {assessment.badge}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">{assessment.title}</CardTitle>
                    <CardDescription className="text-sm">{assessment.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Icons.clock className="mr-1 h-3 w-3" />
                        {assessment.duration}
                      </span>
                      <Badge
                        variant={
                          assessment.difficulty === "Advanced"
                            ? "destructive"
                            : assessment.difficulty === "Intermediate"
                              ? "default"
                              : "secondary"
                        }
                        className="text-xs"
                      >
                        {assessment.difficulty}
                      </Badge>
                    </div>

                    {assessment.completed && assessment.score && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Puntuación:</span>
                          <span className="font-medium">{assessment.score}%</span>
                        </div>
                        <Progress value={assessment.score} className="h-2" />
                      </div>
                    )}

                    <div className="flex gap-2">
                      {assessment.completed ? (
                        <>
                          <Button asChild variant="outline" className="flex-1 bg-transparent">
                            <Link href={`${assessment.href}/results`}>
                              <Icons.fileText className="mr-2 h-4 w-4" />
                              Ver Resultados
                            </Link>
                          </Button>
                          <Button asChild variant="default" className="flex-1">
                            <Link href={assessment.href}>
                              <Icons.target className="mr-2 h-4 w-4" />
                              Repetir
                            </Link>
                          </Button>
                        </>
                      ) : (
                        <Button asChild className="w-full">
                          <Link href={assessment.href}>
                            <Icons.zap className="mr-2 h-4 w-4" />
                            Comenzar Evaluación
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Recommendations Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Icons.target className="mr-2 h-5 w-5" />
            Recomendaciones Personalizadas
          </CardTitle>
          <CardDescription>Basado en tus resultados actuales, te recomendamos:</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start space-x-3 p-4 border rounded-lg">
              <Icons.users className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Desarrolla Habilidades Blandas</h4>
                <p className="text-sm text-muted-foreground">
                  Completa la evaluación de habilidades blandas para identificar áreas de mejora en comunicación y
                  liderazgo.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 border rounded-lg">
              <Icons.target className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Especialízate Técnicamente</h4>
                <p className="text-sm text-muted-foreground">
                  Realiza evaluaciones técnicas específicas para validar tus competencias profesionales.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
