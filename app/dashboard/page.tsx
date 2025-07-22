"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  BookOpen,
  Brain,
  Briefcase,
  Clock,
  FileText,
  MessageSquare,
  Play,
  Star,
  Target,
  TrendingUp,
  Trophy,
  User,
  Users,
} from "lucide-react"
import Link from "next/link"
import { UDDCareerRecommendations } from "@/components/udd-career-recommendations"
import {
  getUserStats,
  getUserProgress,
  getUserAchievements,
  getUserCareerGoals,
  getLibraryBooks,
  type UserStats,
  type UserProgress,
  type Achievement,
  type CareerGoal,
} from "@/lib/database"

// Mock data for UDD career recommendations
const mockPersonalityResults = {
  openness: 0.7,
  conscientiousness: 0.8,
  extraversion: 0.6,
  agreeableness: 0.7,
  neuroticism: 0.3,
}

const mockUserSkills = ["Programación", "Análisis", "Comunicación", "Liderazgo", "Resolución de Problemas"]

const mockJobInterests = ["Tecnología", "Innovación", "Consultoría", "Educación"]

export default function DashboardPage() {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [goals, setGoals] = useState<CareerGoal[]>([])
  const [recentBooks, setRecentBooks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const userId = "demo-user-id" // In a real app, this would come from auth context

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [statsData, progressData, achievementsData, goalsData, booksData] = await Promise.all([
          getUserStats(userId),
          getUserProgress(userId),
          getUserAchievements(userId),
          getUserCareerGoals(userId),
          getLibraryBooks(),
        ])

        setStats(statsData)
        setProgress(progressData)
        setAchievements(achievementsData)
        setGoals(goalsData)
        setRecentBooks(booksData.data?.slice(0, 3) || [])
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [userId])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Bienvenido a tu plataforma de desarrollo profesional</p>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Evaluaciones Completadas</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_assessments}</div>
              <p className="text-xs text-muted-foreground">+1 desde la semana pasada</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Metas Completadas</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed_goals}</div>
              <p className="text-xs text-muted-foreground">de {stats.active_goals} metas activas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nivel Promedio de Habilidades</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avg_skill_level}/10</div>
              <p className="text-xs text-muted-foreground">+0.5 desde el mes pasado</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Logros Obtenidos</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.achievements_count}</div>
              <p className="text-xs text-muted-foreground">¡Sigue así!</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="tests">Tests</TabsTrigger>
          <TabsTrigger value="goals">Metas</TabsTrigger>
          <TabsTrigger value="library">Biblioteca</TabsTrigger>
          <TabsTrigger value="udd-careers">Carreras UDD</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Progress Overview */}
          {progress && (
            <Card>
              <CardHeader>
                <CardTitle>Tu Progreso General</CardTitle>
                <CardDescription>Resumen de tu desarrollo profesional</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progreso General</span>
                    <span>{progress.overall_progress}%</span>
                  </div>
                  <Progress value={progress.overall_progress} className="h-2" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Personalidad</span>
                      <span>{progress.personality_progress}%</span>
                    </div>
                    <Progress value={progress.personality_progress} className="h-1" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Habilidades</span>
                      <span>{progress.skills_progress}%</span>
                    </div>
                    <Progress value={progress.skills_progress} className="h-1" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Coaching</span>
                      <span>{progress.coaching_progress}%</span>
                    </div>
                    <Progress value={progress.coaching_progress} className="h-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Achievements */}
          <Card>
            <CardHeader>
              <CardTitle>Logros Recientes</CardTitle>
              <CardDescription>Tus últimos logros y reconocimientos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {achievements.slice(0, 3).map((achievement) => (
                  <div key={achievement.id} className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Trophy className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{achievement.title}</h4>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                    <div className="text-xs text-gray-500">{new Date(achievement.earned_at).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tests" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-blue-600" />
                  Test de Personalidad
                </CardTitle>
                <CardDescription>Descubre tu tipo de personalidad y fortalezas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Completado
                  </Badge>
                  <Link href="/personality-results">
                    <Button variant="outline" size="sm">
                      Ver Resultados
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  Test DISC
                </CardTitle>
                <CardDescription>Evalúa tu estilo de comportamiento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">Disponible</Badge>
                  <Link href="/disc-test">
                    <Button size="sm">
                      <Play className="h-4 w-4 mr-2" />
                      Comenzar Test
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  Habilidades Técnicas
                </CardTitle>
                <CardDescription>Evalúa tus competencias técnicas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">Disponible</Badge>
                  <Link href="/technical-skills-test">
                    <Button size="sm">
                      <Play className="h-4 w-4 mr-2" />
                      Comenzar Test
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-pink-600" />
                  Habilidades Blandas
                </CardTitle>
                <CardDescription>Mide tus habilidades interpersonales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">Disponible</Badge>
                  <Link href="/soft-skills-test">
                    <Button size="sm">
                      <Play className="h-4 w-4 mr-2" />
                      Comenzar Test
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-orange-600" />
                  Simulador de Entrevistas
                </CardTitle>
                <CardDescription>Practica tus habilidades de entrevista</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">Disponible</Badge>
                  <Link href="/interview-simulator">
                    <Button size="sm">
                      <Play className="h-4 w-4 mr-2" />
                      Comenzar Test
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-indigo-600" />
                  Evaluación General
                </CardTitle>
                <CardDescription>Evaluación completa de habilidades</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">Disponible</Badge>
                  <Link href="/skills-assessment">
                    <Button size="sm">
                      <Play className="h-4 w-4 mr-2" />
                      Comenzar Test
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Metas de Carrera</CardTitle>
              <CardDescription>Tus objetivos profesionales y su progreso</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {goals.map((goal) => (
                  <div key={goal.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{goal.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge
                            variant={goal.priority === "alta" ? "destructive" : "secondary"}
                            className={
                              goal.priority === "alta"
                                ? "bg-red-100 text-red-800"
                                : goal.priority === "media"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                            }
                          >
                            {goal.priority}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            Fecha objetivo: {new Date(goal.target_date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Badge variant={goal.status === "activa" ? "default" : "secondary"}>{goal.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="library" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentBooks.map((book) => (
              <Card key={book.id} className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {book.category}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{book.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
                  <CardDescription className="text-sm text-gray-600">por {book.author}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{book.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-gray-600">{book.readingTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-600">{book.difficulty}</span>
                    </div>
                  </div>
                  <Link href={`/library/reader/${book.id}`}>
                    <Button className="w-full">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Comenzar a Leer
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Link href="/library">
              <Button variant="outline" size="lg">
                Ver Toda la Biblioteca
              </Button>
            </Link>
          </div>
        </TabsContent>

        <TabsContent value="udd-careers" className="space-y-6">
          <UDDCareerRecommendations
            personalityResults={mockPersonalityResults}
            userSkills={mockUserSkills}
            jobInterests={mockJobInterests}
          />
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <div className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Continúa tu desarrollo profesional</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/career-coach">
                <Button
                  variant="outline"
                  className="w-full h-20 flex flex-col items-center justify-center gap-2 bg-transparent"
                >
                  <MessageSquare className="h-6 w-6" />
                  <span className="text-sm">Coach IA</span>
                </Button>
              </Link>
              <Link href="/cv-builder">
                <Button
                  variant="outline"
                  className="w-full h-20 flex flex-col items-center justify-center gap-2 bg-transparent"
                >
                  <FileText className="h-6 w-6" />
                  <span className="text-sm">CV Builder</span>
                </Button>
              </Link>
              <Link href="/job-search">
                <Button
                  variant="outline"
                  className="w-full h-20 flex flex-col items-center justify-center gap-2 bg-transparent"
                >
                  <Briefcase className="h-6 w-6" />
                  <span className="text-sm">Buscar Empleo</span>
                </Button>
              </Link>
              <Link href="/library">
                <Button
                  variant="outline"
                  className="w-full h-20 flex flex-col items-center justify-center gap-2 bg-transparent"
                >
                  <BookOpen className="h-6 w-6" />
                  <span className="text-sm">Biblioteca</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
