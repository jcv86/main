"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  Target,
  TrendingUp,
  Users,
  BookOpen,
  Award,
  Calendar,
  Clock,
  ArrowRight,
  Star,
  Briefcase,
  GraduationCap,
  MapPin,
  DollarSign,
  Building,
  Zap,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"

interface DashboardStats {
  testsCompleted: number
  skillsAssessed: number
  careerMatches: number
  completionRate: number
}

interface RecentActivity {
  id: string
  type: "test" | "assessment" | "coaching" | "application"
  title: string
  description: string
  date: string
  status: "completed" | "in-progress" | "pending"
  score?: number
}

interface CareerRecommendation {
  id: string
  title: string
  company: string
  location: string
  salary: string
  match: number
  type: "full-time" | "part-time" | "contract" | "internship"
  skills: string[]
  description: string
  isChilean: boolean
}

interface LearningPath {
  id: string
  title: string
  description: string
  progress: number
  totalModules: number
  completedModules: number
  estimatedTime: string
  difficulty: "Principiante" | "Intermedio" | "Avanzado"
  category: string
  isChileanFocused: boolean
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    testsCompleted: 0,
    skillsAssessed: 0,
    careerMatches: 0,
    completionRate: 0,
  })

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [careerRecommendations, setCareerRecommendations] = useState<CareerRecommendation[]>([])
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading Chilean-adapted data
    setTimeout(() => {
      setStats({
        testsCompleted: 3,
        skillsAssessed: 12,
        careerMatches: 8,
        completionRate: 75,
      })

      setRecentActivity([
        {
          id: "1",
          type: "test",
          title: "Evaluación de Personalidad Big Five - Chile",
          description: "Completaste tu evaluación de personalidad adaptada al contexto chileno",
          date: "2024-01-15",
          status: "completed",
          score: 85,
        },
        {
          id: "2",
          type: "assessment",
          title: "Evaluación de Habilidades Técnicas",
          description: "Evaluación de competencias técnicas para el mercado chileno",
          date: "2024-01-14",
          status: "completed",
          score: 78,
        },
        {
          id: "3",
          type: "coaching",
          title: "Sesión de Coaching Profesional",
          description: "Orientación de carrera con enfoque en oportunidades chilenas",
          date: "2024-01-13",
          status: "completed",
        },
        {
          id: "4",
          type: "test",
          title: "Test de Habilidades Blandas",
          description: "Evaluación de soft skills valoradas en empresas chilenas",
          date: "2024-01-12",
          status: "in-progress",
          score: 65,
        },
      ])

      setCareerRecommendations([
        {
          id: "1",
          title: "Product Manager Senior",
          company: "Fintual",
          location: "Santiago, Providencia",
          salary: "$3.500.000 - $5.000.000 CLP",
          match: 92,
          type: "full-time",
          skills: ["Product Strategy", "Data Analysis", "Agile", "Fintech"],
          description: "Liderar el desarrollo de productos fintech innovadores en la startup líder de Chile",
          isChilean: true,
        },
        {
          id: "2",
          title: "Innovation Manager",
          company: "Banco de Chile",
          location: "Santiago, Las Condes",
          salary: "$4.000.000 - $6.000.000 CLP",
          match: 88,
          type: "full-time",
          skills: ["Digital Transformation", "Innovation", "Banking", "Leadership"],
          description: "Impulsar la transformación digital en el banco más tradicional de Chile",
          isChilean: true,
        },
        {
          id: "3",
          title: "Head of Growth",
          company: "NotCo",
          location: "Santiago, Las Condes",
          salary: "$4.500.000 - $7.000.000 CLP",
          match: 85,
          type: "full-time",
          skills: ["Growth Hacking", "Marketing", "Analytics", "Foodtech"],
          description: "Escalar el crecimiento del unicornio chileno de foodtech a nivel regional",
          isChilean: true,
        },
        {
          id: "4",
          title: "Digital Strategy Consultant",
          company: "McKinsey Chile",
          location: "Santiago, Las Condes",
          salary: "$5.000.000 - $8.000.000 CLP",
          match: 82,
          type: "full-time",
          skills: ["Strategy", "Digital", "Consulting", "Analytics"],
          description: "Asesorar a grandes empresas chilenas en su transformación digital",
          isChilean: true,
        },
      ])

      setLearningPaths([
        {
          id: "1",
          title: "Liderazgo Empresarial Chileno",
          description: "Desarrolla habilidades de liderazgo adaptadas a la cultura empresarial nacional",
          progress: 60,
          totalModules: 8,
          completedModules: 5,
          estimatedTime: "6 semanas",
          difficulty: "Intermedio",
          category: "Liderazgo",
          isChileanFocused: true,
        },
        {
          id: "2",
          title: "Innovación y Emprendimiento en Chile",
          description: "Aprende sobre el ecosistema de startups y oportunidades de emprendimiento nacional",
          progress: 25,
          totalModules: 10,
          completedModules: 3,
          estimatedTime: "8 semanas",
          difficulty: "Intermedio",
          category: "Emprendimiento",
          isChileanFocused: true,
        },
        {
          id: "3",
          title: "Transformación Digital para Empresas Chilenas",
          description: "Competencias digitales aplicadas al contexto empresarial nacional",
          progress: 80,
          totalModules: 6,
          completedModules: 5,
          estimatedTime: "4 semanas",
          difficulty: "Avanzado",
          category: "Tecnología",
          isChileanFocused: true,
        },
        {
          id: "4",
          title: "Networking y Relaciones Profesionales en Chile",
          description: "Estrategias de networking adaptadas a la cultura profesional chilena",
          progress: 40,
          totalModules: 5,
          completedModules: 2,
          estimatedTime: "3 semanas",
          difficulty: "Principiante",
          category: "Soft Skills",
          isChileanFocused: true,
        },
      ])

      setLoading(false)
    }, 1000)
  }, [])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "test":
        return Brain
      case "assessment":
        return Target
      case "coaching":
        return Users
      case "application":
        return Briefcase
      default:
        return BookOpen
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Principiante":
        return "bg-green-100 text-green-800"
      case "Intermedio":
        return "bg-yellow-100 text-yellow-800"
      case "Avanzado":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Cargando tu dashboard personalizado para Chile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header with Chilean context */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Profesional</h1>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            🇨🇱 Adaptado para Chile
          </Badge>
        </div>
        <p className="text-gray-600">
          Tu centro de desarrollo profesional personalizado para el mercado laboral chileno
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tests Completados</p>
                <p className="text-2xl font-bold text-gray-900">{stats.testsCompleted}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Habilidades Evaluadas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.skillsAssessed}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Target className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Matches de Carrera</p>
                <p className="text-2xl font-bold text-gray-900">{stats.careerMatches}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Briefcase className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Progreso General</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completionRate}%</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <Progress value={stats.completionRate} className="mt-3" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="opportunities">Oportunidades Chile</TabsTrigger>
          <TabsTrigger value="learning">Aprendizaje</TabsTrigger>
          <TabsTrigger value="activity">Actividad</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Acciones Rápidas para Chile
              </CardTitle>
              <CardDescription>Continúa tu desarrollo profesional adaptado al mercado nacional</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link href="/personality-test">
                  <Button
                    variant="outline"
                    className="w-full h-auto p-4 flex flex-col items-start gap-2 bg-transparent"
                  >
                    <Brain className="w-5 h-5 text-blue-600" />
                    <div className="text-left">
                      <div className="font-medium">Test de Personalidad</div>
                      <div className="text-sm text-gray-500">Adaptado al contexto chileno</div>
                    </div>
                  </Button>
                </Link>

                <Link href="/skills-assessment">
                  <Button
                    variant="outline"
                    className="w-full h-auto p-4 flex flex-col items-start gap-2 bg-transparent"
                  >
                    <Target className="w-5 h-5 text-green-600" />
                    <div className="text-left">
                      <div className="font-medium">Evaluación de Habilidades</div>
                      <div className="text-sm text-gray-500">Skills para mercado nacional</div>
                    </div>
                  </Button>
                </Link>

                <Link href="/career-coach">
                  <Button
                    variant="outline"
                    className="w-full h-auto p-4 flex flex-col items-start gap-2 bg-transparent"
                  >
                    <Users className="w-5 h-5 text-purple-600" />
                    <div className="text-left">
                      <div className="font-medium">Coach Profesional</div>
                      <div className="text-sm text-gray-500">Orientación para Chile</div>
                    </div>
                  </Button>
                </Link>

                <Link href="/job-search">
                  <Button
                    variant="outline"
                    className="w-full h-auto p-4 flex flex-col items-start gap-2 bg-transparent"
                  >
                    <Briefcase className="w-5 h-5 text-orange-600" />
                    <div className="text-left">
                      <div className="font-medium">Búsqueda de Empleo</div>
                      <div className="text-sm text-gray-500">Oportunidades chilenas</div>
                    </div>
                  </Button>
                </Link>

                <Link href="/cv-builder">
                  <Button
                    variant="outline"
                    className="w-full h-auto p-4 flex flex-col items-start gap-2 bg-transparent"
                  >
                    <GraduationCap className="w-5 h-5 text-red-600" />
                    <div className="text-left">
                      <div className="font-medium">Constructor de CV</div>
                      <div className="text-sm text-gray-500">Formato chileno</div>
                    </div>
                  </Button>
                </Link>

                <Link href="/interview-simulator">
                  <Button
                    variant="outline"
                    className="w-full h-auto p-4 flex flex-col items-start gap-2 bg-transparent"
                  >
                    <Star className="w-5 h-5 text-pink-600" />
                    <div className="text-left">
                      <div className="font-medium">Simulador de Entrevistas</div>
                      <div className="text-sm text-gray-500">Empresas chilenas</div>
                    </div>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Progress Overview */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Tu Progreso en Chile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Evaluación de Personalidad</span>
                    <span className="text-green-600 font-medium">Completado</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Habilidades Técnicas</span>
                    <span className="text-green-600 font-medium">Completado</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Habilidades Blandas</span>
                    <span className="text-blue-600 font-medium">En progreso</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Perfil Profesional</span>
                    <span className="text-gray-500">Pendiente</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-600" />
                  Logros Recientes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Brain className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Evaluación Completa</div>
                    <div className="text-xs text-gray-600">Personalidad Big Five - Chile</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Target className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Skills Assessment</div>
                    <div className="text-xs text-gray-600">Habilidades técnicas evaluadas</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Coaching Session</div>
                    <div className="text-xs text-gray-600">Orientación profesional</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                Oportunidades Recomendadas en Chile
              </CardTitle>
              <CardDescription>Posiciones que coinciden con tu perfil en el mercado laboral chileno</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {careerRecommendations.map((job) => (
                  <div key={job.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{job.title}</h3>
                          {job.isChilean && (
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                              🇨🇱 Empresa Chilena
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center gap-1">
                            <Building className="w-4 h-4" />
                            {job.company}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {job.salary}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">{job.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {job.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="ml-4 text-right">
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="font-semibold text-green-600">{job.match}% match</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {job.type}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-500">
                        Actualizado hace 2 días • {Math.floor(Math.random() * 50) + 10} postulantes
                      </div>
                      <Button size="sm" variant="outline">
                        Ver Detalles
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Link href="/job-search">
                  <Button>
                    Ver Todas las Oportunidades en Chile
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="learning" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-green-600" />
                Rutas de Aprendizaje Chilenas
              </CardTitle>
              <CardDescription>Programas de desarrollo adaptados al contexto profesional chileno</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {learningPaths.map((path) => (
                  <div key={path.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{path.title}</h3>
                          {path.isChileanFocused && (
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                              🇨🇱 Enfoque Chileno
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{path.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                          <span>
                            {path.completedModules}/{path.totalModules} módulos
                          </span>
                          <span>{path.estimatedTime}</span>
                          <Badge className={getDifficultyColor(path.difficulty)} variant="secondary">
                            {path.difficulty}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {path.category}
                          </Badge>
                        </div>
                        <div className="mb-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Progreso</span>
                            <span>{path.progress}%</span>
                          </div>
                          <Progress value={path.progress} className="h-2" />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {path.progress > 0 ? (
                          <Button size="sm" variant="default">
                            Continuar
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline">
                            Comenzar
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {path.estimatedTime}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                Actividad Reciente
              </CardTitle>
              <CardDescription>Tu historial de desarrollo profesional en Chile</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const Icon = getActivityIcon(activity.type)
                  return (
                    <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="p-2 bg-gray-100 rounded-full">
                        <Icon className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-gray-900">{activity.title}</h3>
                          <Badge className={getStatusColor(activity.status)} variant="secondary">
                            {activity.status === "completed"
                              ? "Completado"
                              : activity.status === "in-progress"
                                ? "En progreso"
                                : "Pendiente"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            {new Date(activity.date).toLocaleDateString("es-CL")}
                          </div>
                          {activity.score && (
                            <div className="text-sm font-medium text-green-600">{activity.score}% completado</div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
