"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Brain,
  Target,
  FileText,
  Briefcase,
  Star,
  Clock,
  CheckCircle,
  ArrowRight,
  Zap,
  Trophy,
  MessageSquare,
  BarChart3,
  TrendingUp,
  Flame,
} from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data for demonstration
  const userStats = {
    level: 12,
    xp: 2450,
    xpToNext: 500,
    booksRead: 8,
    currentStreak: 15,
    totalReadingTime: 1240,
    weeklyGoal: 5,
    weeklyProgress: 3,
  }

  const quickActions = [
    {
      title: "Continuar Leyendo",
      description: "Retoma tu libro actual",
      icon: BookOpen,
      href: "/library",
      color: "bg-blue-500",
    },
    {
      title: "Test de Personalidad",
      description: "Evalúa tu perfil DISC",
      icon: Brain,
      href: "/personality-test",
      color: "bg-purple-500",
    },
    {
      title: "Crear CV",
      description: "Genera tu currículum",
      icon: FileText,
      href: "/cv-builder",
      color: "bg-green-500",
    },
    {
      title: "Buscar Empleos",
      description: "Explora oportunidades",
      icon: Briefcase,
      href: "/job-search",
      color: "bg-orange-500",
    },
    {
      title: "Coach IA",
      description: "Obtén consejos personalizados",
      icon: MessageSquare,
      href: "/career-coach",
      color: "bg-red-500",
    },
    {
      title: "Establecer Metas",
      description: "Define nuevos objetivos",
      icon: Target,
      href: "/goals",
      color: "bg-indigo-500",
    },
  ]

  const currentBooks = [
    {
      id: "1",
      title: "Hábitos Atómicos",
      author: "James Clear",
      progress: 65,
      coverImage: "/books/atomic-habits.jpg",
    },
    {
      id: "2",
      title: "Lean In",
      author: "Sheryl Sandberg",
      progress: 25,
      coverImage: "/books/lean-in.jpg",
    },
  ]

  const recentActivity = [
    {
      id: "1",
      type: "reading",
      title: "Progreso en Hábitos Atómicos",
      description: "Completaste el capítulo 3",
      timestamp: "Hace 2 horas",
      icon: BookOpen,
    },
    {
      id: "2",
      type: "test",
      title: "Test DISC completado",
      description: "Puntuación: 85/100",
      timestamp: "Ayer",
      icon: Brain,
    },
    {
      id: "3",
      type: "achievement",
      title: "Nuevo logro desbloqueado",
      description: "Lector Constante - 7 días",
      timestamp: "Hace 2 días",
      icon: Trophy,
    },
  ]

  const skills = [
    { name: "Liderazgo", progress: 75, level: 8 },
    { name: "Comunicación", progress: 60, level: 7 },
    { name: "Análisis", progress: 45, level: 6 },
    { name: "Gestión", progress: 85, level: 9 },
  ]

  const achievements = [
    {
      id: "1",
      title: "Primer Libro",
      description: "Completaste tu primer libro",
      icon: "📚",
      unlocked: true,
    },
    {
      id: "2",
      title: "Racha de Fuego",
      description: "15 días consecutivos leyendo",
      icon: "🔥",
      unlocked: true,
    },
    {
      id: "3",
      title: "Experto en Tests",
      description: "Completa 5 evaluaciones",
      icon: "🎯",
      unlocked: false,
      progress: 3,
      total: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">¡Bienvenido de vuelta! 👋</h1>
            <p className="text-gray-600 mt-1">Continúa tu desarrollo profesional. Tienes grandes progresos.</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1">
              <Trophy className="w-4 h-4 mr-1" />
              Nivel {userStats.level}
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Nivel Actual</p>
                  <p className="text-3xl font-bold text-blue-900">{userStats.level}</p>
                  <div className="mt-2">
                    <Progress
                      value={(userStats.xp / (userStats.xp + userStats.xpToNext)) * 100}
                      className="h-2 bg-blue-200"
                    />
                    <p className="text-xs text-blue-600 mt-1">
                      {userStats.xp} / {userStats.xp + userStats.xpToNext} XP
                    </p>
                  </div>
                </div>
                <div className="p-3 bg-blue-500 rounded-full">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Libros Leídos</p>
                  <p className="text-3xl font-bold text-green-900">{userStats.booksRead}</p>
                  <p className="text-xs text-green-600 mt-1">{Math.round(userStats.totalReadingTime / 60)}h total</p>
                </div>
                <div className="p-3 bg-green-500 rounded-full">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Racha Actual</p>
                  <p className="text-3xl font-bold text-orange-900">{userStats.currentStreak}</p>
                  <p className="text-xs text-orange-600 mt-1">días consecutivos</p>
                </div>
                <div className="p-3 bg-orange-500 rounded-full">
                  <Flame className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Meta Semanal</p>
                  <p className="text-3xl font-bold text-purple-900">
                    {userStats.weeklyProgress}/{userStats.weeklyGoal}
                  </p>
                  <div className="mt-2">
                    <Progress
                      value={(userStats.weeklyProgress / userStats.weeklyGoal) * 100}
                      className="h-2 bg-purple-200"
                    />
                  </div>
                </div>
                <div className="p-3 bg-purple-500 rounded-full">
                  <Target className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-500" />
              Acciones Rápidas
            </CardTitle>
            <CardDescription>Accede rápidamente a las funciones más importantes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href}>
                  <Card className="hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer border-0 bg-gradient-to-br from-white to-gray-50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${action.color}`}>
                          <action.icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{action.title}</h3>
                          <p className="text-sm text-gray-600">{action.description}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-1 rounded-lg">
            <TabsTrigger
              value="overview"
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <BarChart3 className="h-4 w-4" />
              Resumen
            </TabsTrigger>
            <TabsTrigger
              value="reading"
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <BookOpen className="h-4 w-4" />
              Lectura
            </TabsTrigger>
            <TabsTrigger
              value="skills"
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <Brain className="h-4 w-4" />
              Habilidades
            </TabsTrigger>
            <TabsTrigger
              value="achievements"
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <Trophy className="h-4 w-4" />
              Logros
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Current Reading */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-green-500" />
                    Lectura Actual
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentBooks.map((book) => (
                    <div key={book.id} className="flex gap-4">
                      <div className="w-16 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{book.title}</h3>
                        <p className="text-sm text-gray-600">{book.author}</p>
                        <div className="mt-2">
                          <Progress value={book.progress} className="h-2" />
                          <p className="text-xs text-gray-600 mt-1">{book.progress}% completado</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button asChild className="w-full">
                    <Link href="/library">Ver Biblioteca Completa</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-500" />
                    Actividad Reciente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3">
                        <div className="p-2 bg-gray-100 rounded-full">
                          <activity.icon className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{activity.title}</h3>
                          <p className="text-sm text-gray-600">{activity.description}</p>
                          <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reading" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-green-500" />
                    Progreso de Lectura
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{userStats.booksRead}</p>
                      <p className="text-xs text-blue-600">Libros Completados</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">
                        {Math.round(userStats.totalReadingTime / 60)}h
                      </p>
                      <p className="text-xs text-green-600">Tiempo Total</p>
                    </div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">{userStats.currentStreak}</p>
                    <p className="text-xs text-orange-600">Días Consecutivos</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Recomendaciones
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900">Continúa "Hábitos Atómicos"</h4>
                    <p className="text-sm text-blue-700 mt-1">Estás en el 65% del libro. ¡Sigue así!</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-900">Prueba "Trabajo Profundo"</h4>
                    <p className="text-sm text-green-700 mt-1">Basado en tus intereses en productividad.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Progreso de Habilidades
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {skills.map((skill, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-gray-600">Nivel {skill.level}</span>
                      </div>
                      <Progress value={skill.progress} className="h-2" />
                      <p className="text-xs text-gray-500 mt-1">{skill.progress}% al siguiente nivel</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-500" />
                    Próximas Evaluaciones
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link href="/technical-skills-test">
                    <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <h4 className="font-semibold">Test de Habilidades Técnicas</h4>
                      <p className="text-sm text-gray-600">Evalúa tus conocimientos técnicos</p>
                    </div>
                  </Link>
                  <Link href="/soft-skills-test">
                    <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <h4 className="font-semibold">Test de Habilidades Blandas</h4>
                      <p className="text-sm text-gray-600">Mide tus competencias interpersonales</p>
                    </div>
                  </Link>
                  <Link href="/personality-test">
                    <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <h4 className="font-semibold">Test de Personalidad DISC</h4>
                      <p className="text-sm text-gray-600">Descubre tu perfil de personalidad</p>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    Logros Desbloqueados
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {achievements
                    .filter((a) => a.unlocked)
                    .map((achievement) => (
                      <div key={achievement.id} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{achievement.icon}</div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-yellow-900">{achievement.title}</h3>
                            <p className="text-sm text-yellow-600">{achievement.description}</p>
                          </div>
                          <CheckCircle className="h-5 w-5 text-yellow-500" />
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-500" />
                    En Progreso
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {achievements
                    .filter((a) => !a.unlocked)
                    .map((achievement) => (
                      <div key={achievement.id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl opacity-50">{achievement.icon}</div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-700">{achievement.title}</h3>
                            <p className="text-sm text-gray-600">{achievement.description}</p>
                            {achievement.progress && achievement.total && (
                              <div className="mt-2">
                                <Progress value={(achievement.progress / achievement.total) * 100} className="h-1" />
                                <p className="text-xs text-gray-500 mt-1">
                                  {achievement.progress}/{achievement.total}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">¿Listo para el siguiente paso?</h2>
            <p className="text-blue-100 mb-6">Explora nuevas oportunidades y acelera tu desarrollo profesional</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="secondary">
                <Link href="/library">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Explorar Biblioteca
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600"
              >
                <Link href="/career-coach">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Hablar con Coach IA
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
