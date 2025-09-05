"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, TrendingUp, Target, Lightbulb, BookOpen, Users, Award, ChevronRight, Sparkles } from "lucide-react"

interface TestResult {
  test_type: string
  score: number
  results: any
  created_at: string
}

interface UserProfile {
  full_name: string
  position: string
  department: string
  experience_years: number
  skills: string[]
  career_goals: string
  current_level: number
  total_xp: number
}

interface Insight {
  id: string
  type: "strength" | "opportunity" | "recommendation" | "trend"
  title: string
  description: string
  confidence: number
  actionable: boolean
  priority: "high" | "medium" | "low"
}

export function AiInsightsPanel() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [insights, setInsights] = useState<Insight[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const userEmail = localStorage.getItem("userEmail") || "demo@despegaturcarrera.com"

      // Load user profile and test results
      // In a real implementation, this would fetch from your API
      const mockProfile: UserProfile = {
        full_name: "Travis Johnson",
        position: "Senior Developer",
        department: "Technology",
        experience_years: 8,
        skills: ["JavaScript", "React", "Node.js", "Leadership", "Problem Solving"],
        career_goals: "Transition to Tech Lead role within 12 months",
        current_level: 7,
        total_xp: 2850,
      }

      const mockTestResults: TestResult[] = [
        {
          test_type: "DISC",
          score: 85,
          results: { D: 75, I: 60, S: 45, C: 80 },
          created_at: "2024-01-15T10:00:00Z",
        },
        {
          test_type: "Big Five",
          score: 78,
          results: {
            openness: 85,
            conscientiousness: 90,
            extraversion: 65,
            agreeableness: 70,
            neuroticism: 25,
          },
          created_at: "2024-01-14T14:30:00Z",
        },
        {
          test_type: "MBTI",
          score: 82,
          results: { type: "ENTJ", preferences: { E: 65, N: 80, T: 75, J: 85 } },
          created_at: "2024-01-13T09:15:00Z",
        },
      ]

      setUserProfile(mockProfile)
      setTestResults(mockTestResults)

      // Generate insights based on the data
      generateInsights(mockProfile, mockTestResults)
    } catch (error) {
      console.error("Error loading user data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateInsights = (profile: UserProfile, results: TestResult[]) => {
    const generatedInsights: Insight[] = [
      {
        id: "1",
        type: "strength",
        title: "Liderazgo Natural Identificado",
        description:
          "Tus resultados DISC (D: 75) y MBTI (ENTJ) indican fuertes habilidades de liderazgo. Tu perfil sugiere que eres efectivo tomando decisiones y dirigiendo equipos.",
        confidence: 0.92,
        actionable: true,
        priority: "high",
      },
      {
        id: "2",
        type: "opportunity",
        title: "Desarrollo de Habilidades Interpersonales",
        description:
          "Tu puntuación en Estabilidad (S: 45) sugiere una oportunidad para desarrollar habilidades de paciencia y colaboración en entornos de equipo.",
        confidence: 0.78,
        actionable: true,
        priority: "medium",
      },
      {
        id: "3",
        type: "recommendation",
        title: "Ruta Recomendada: Tech Lead",
        description:
          "Basado en tu experiencia (8 años) y perfil de personalidad, el rol de Tech Lead se alinea perfectamente con tus fortalezas y objetivos profesionales.",
        confidence: 0.89,
        actionable: true,
        priority: "high",
      },
      {
        id: "4",
        type: "trend",
        title: "Progreso Consistente",
        description:
          "Has completado 3 evaluaciones con puntuaciones altas (promedio: 82%). Esto demuestra un compromiso sólido con tu desarrollo profesional.",
        confidence: 0.95,
        actionable: false,
        priority: "low",
      },
    ]

    setInsights(generatedInsights)
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "strength":
        return <Award className="h-4 w-4 text-green-600" />
      case "opportunity":
        return <TrendingUp className="h-4 w-4 text-blue-600" />
      case "recommendation":
        return <Target className="h-4 w-4 text-purple-600" />
      case "trend":
        return <Sparkles className="h-4 w-4 text-yellow-600" />
      default:
        return <Lightbulb className="h-4 w-4 text-gray-600" />
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

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-600"
    if (confidence >= 0.6) return "text-yellow-600"
    return "text-red-600"
  }

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 animate-pulse" />
            <span>Analizando tu perfil...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="h-full">
      <Tabs defaultValue="insights" className="h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="progress">Progreso</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="flex-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Insights de IA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {insights.map((insight) => (
                <div key={insight.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">{getInsightIcon(insight.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{insight.title}</h4>
                        <Badge variant="outline" className={getPriorityColor(insight.priority)}>
                          {insight.priority === "high" ? "Alta" : insight.priority === "medium" ? "Media" : "Baja"}
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">{insight.description}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-gray-500">Confianza:</span>
                          <span className={getConfidenceColor(insight.confidence)}>
                            {Math.round(insight.confidence * 100)}%
                          </span>
                        </div>

                        {insight.actionable && (
                          <Button size="sm" variant="outline">
                            Ver Acciones
                            <ChevronRight className="h-3 w-3 ml-1" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="flex-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Resumen del Perfil
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {userProfile && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Nombre</label>
                      <p className="text-lg font-semibold">{userProfile.full_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Posición</label>
                      <p className="text-lg font-semibold">{userProfile.position}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Departamento</label>
                      <p>{userProfile.department}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Experiencia</label>
                      <p>{userProfile.experience_years} años</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500 mb-2 block">Objetivos Profesionales</label>
                    <p className="text-sm bg-blue-50 p-3 rounded-lg">{userProfile.career_goals}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500 mb-2 block">Habilidades Principales</label>
                    <div className="flex flex-wrap gap-2">
                      {userProfile.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500 mb-2 block">Nivel de Desarrollo</label>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Nivel {userProfile.current_level}</span>
                        <span>{userProfile.total_xp} XP</span>
                      </div>
                      <Progress value={(userProfile.current_level / 10) * 100} className="h-2" />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="flex-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Progreso de Evaluaciones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {testResults.map((result, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">{result.test_type}</h4>
                    <Badge variant={result.score >= 80 ? "default" : result.score >= 60 ? "secondary" : "outline"}>
                      {result.score}%
                    </Badge>
                  </div>

                  <Progress value={result.score} className="h-2 mb-2" />

                  <div className="text-xs text-gray-500">
                    Completado: {new Date(result.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}

              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <h4 className="font-medium mb-2">Resumen de Progreso</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Tests Completados:</span>
                    <span className="font-semibold ml-2">{testResults.length}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Puntuación Promedio:</span>
                    <span className="font-semibold ml-2">
                      {Math.round(testResults.reduce((acc, r) => acc + r.score, 0) / testResults.length)}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
