"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  BookOpen,
  Brain,
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  MessageSquare,
  Play,
  Star,
  Target,
  TrendingUp,
  User,
  Users,
  Zap,
  GraduationCap,
} from "lucide-react"
import Link from "next/link"
import { UDDCareerRecommendations } from "@/components/udd-career-recommendations"

// Mock data for demonstration
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
  const [user, setUser] = useState({
    name: "Usuario Demo",
    email: "demo@ejemplo.com",
    avatar: "/placeholder-user.jpg",
  })

  const [stats, setStats] = useState({
    generalProgress: 0,
    completedTests: 0,
    totalTests: 6,
    skillsAssessed: 0,
    careerMatches: 0,
  })

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: "welcome",
      title: "Bienvenido a tu plataforma de desarrollo profesional",
      description: "Comienza explorando nuestras evaluaciones para descubrir tu potencial",
      timestamp: "Hace unos momentos",
      icon: Star,
    },
  ])

  const [availableTests, setAvailableTests] = useState([
    {
      id: "personality",
      title: "Test de Personalidad",
      description: "Descubre tus rasgos de personalidad dominantes",
      duration: "15-20 min",
      difficulty: "Fácil",
      icon: Brain,
      href: "/personality-test",
      status: "available",
      color: "bg-purple-500",
    },
    {
      id: "disc",
      title: "Evaluación DISC",
      description: "Comprende tu estilo de comportamiento y comunicación",
      duration: "10-15 min",
      difficulty: "Fácil",
      icon: Users,
      href: "/disc-test",
      status: "available",
      color: "bg-blue-500",
    },
    {
      id: "soft-skills",
      title: "Habilidades Blandas",
      description: "Evalúa tus competencias interpersonales y emocionales",
      duration: "20-25 min",
      difficulty: "Medio",
      icon: MessageSquare,
      href: "/soft-skills-test",
      status: "available",
      color: "bg-green-500",
    },
    {
      id: "technical-skills",
      title: "Habilidades Técnicas",
      description: "Mide tus competencias técnicas y profesionales",
      duration: "25-30 min",
      difficulty: "Medio",
      icon: Zap,
      href: "/technical-skills-test",
      status: "available",
      color: "bg-orange-500",
    },
    {
      id: "skills-assessment",
      title: "Evaluación Integral",
      description: "Análisis completo de todas tus habilidades",
      duration: "30-40 min",
      difficulty: "Avanzado",
      icon: Target,
      href: "/skills-assessment",
      status: "available",
      color: "bg-red-500",
    },
    {
      id: "interview",
      title: "Simulador de Entrevistas",
      description: "Practica y mejora tus habilidades de entrevista",
      duration: "20-30 min",
      difficulty: "Medio",
      icon: Briefcase,
      href: "/interview-simulator",
      status: "available",
      color: "bg-indigo-500",
    },
  ])

  const [quickActions, setQuickActions] = useState([
    {
      title: "Crear CV",
      description: "Genera tu currículum profesional",
      icon: FileText,
      href: "/cv-builder",
      color: "bg-blue-500",
    },
    {
      title: "Buscar Empleos",
      description: "Explora oportunidades laborales",
      icon: Briefcase,
      href: "/job-search",
      color: "bg-green-500",
    },
    {
      title: "Coach Profesional",
      description: "Recibe orientación personalizada",
      icon: User,
      href: "/career-coach",
      color: "bg-purple-500",
    },
    {
      title: "Biblioteca",
      description: "Accede a recursos de desarrollo",
      icon: BookOpen,
      href: "/library",
      color: "bg-orange-500",
    },
  ])

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">¡Hola, {user.name}! 👋</h1>
          <p className="text-gray-600 mt-1">Bienvenido a tu plataforma de desarrollo profesional</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Cuenta Demo Activa
          </Badge>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Progreso General</p>
                <p className="text-2xl font-bold text-gray-900">{stats.generalProgress}%</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={stats.generalProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tests Completados</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.completedTests}/{stats.totalTests}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={(stats.completedTests / stats.totalTests) * 100} className="h-2" />
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
              <div className="p-3 bg-purple-100 rounded-full">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Coincidencias Profesionales</p>
                <p className="text-2xl font-bold text-gray-900">{stats.careerMatches}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="tests" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tests">Evaluaciones</TabsTrigger>
          <TabsTrigger value="careers">Carreras UDD</TabsTrigger>
          <TabsTrigger value="actions">Acciones Rápidas</TabsTrigger>
          <TabsTrigger value="activity">Actividad Reciente</TabsTrigger>
        </TabsList>

        {/* Tests Tab */}
        <TabsContent value="tests" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Evaluaciones Disponibles
              </CardTitle>
              <CardDescription>
                Completa estas evaluaciones para obtener insights sobre tu perfil profesional
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {availableTests.map((test) => (
                  <Card key={test.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-full ${test.color}`}>
                          <test.icon className="w-6 h-6 text-white" />
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {test.difficulty}
                        </Badge>
                      </div>

                      <h3 className="font-semibold text-lg mb-2">{test.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{test.description}</p>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          {test.duration}
                        </div>
                      </div>

                      <Link href={test.href}>
                        <Button className="w-full bg-transparent" variant="outline">
                          <Play className="w-4 h-4 mr-2" />
                          Comenzar Test
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* UDD Careers Tab */}
        <TabsContent value="careers" className="space-y-6">
          <UDDCareerRecommendations
            personalityResults={mockPersonalityResults}
            userSkills={mockUserSkills}
            jobInterests={mockJobInterests}
          />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                Explorar Todas las Carreras UDD
              </CardTitle>
              <CardDescription>
                Descubre todas las opciones académicas disponibles en la Universidad del Desarrollo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/udd-careers">
                <Button className="w-full md:w-auto">Ver Catálogo Completo de Carreras</Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quick Actions Tab */}
        <TabsContent value="actions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
              <CardDescription>Herramientas y recursos para impulsar tu desarrollo profesional</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {quickActions.map((action, index) => (
                  <Link key={index} href={action.href}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-6 text-center">
                        <div className={`p-4 rounded-full ${action.color} mx-auto mb-4 w-fit`}>
                          <action.icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-semibold mb-2">{action.title}</h3>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recent Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Actividad Reciente
              </CardTitle>
              <CardDescription>Tu progreso y actividades más recientes en la plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <activity.icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{activity.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-2">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}

                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">Completa tu primera evaluación para ver más actividades aquí</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
