"use client"

import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { useNotifications } from "@/contexts/notifications-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Brain, Target, Users, TrendingUp, Calendar, FileText, Bell, LogOut, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const { t } = useLanguage()
  const { notifications, unreadCount } = useNotifications()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  const stats = [
    { label: "Tests Completados", value: 3, total: 5, icon: Brain, color: "bg-blue-500" },
    { label: "Sesiones de Coaching", value: 2, total: 4, icon: Users, color: "bg-green-500" },
    { label: "Aplicaciones Enviadas", value: 12, total: 20, icon: FileText, color: "bg-purple-500" },
    { label: "Entrevistas Programadas", value: 3, total: 3, icon: Calendar, color: "bg-orange-500" },
  ]

  const quickActions = [
    {
      title: "Test de Personalidad DISC",
      description: "Descubre tu perfil de personalidad",
      href: "/disc-test",
      icon: Brain,
    },
    {
      title: "Evaluación de Habilidades",
      description: "Evalúa tus competencias técnicas",
      href: "/skills-assessment",
      icon: Target,
    },
    {
      title: "Sesión de Coaching",
      description: "Programa una sesión personalizada",
      href: "/career-coach",
      icon: Users,
    },
    {
      title: "Búsqueda de Empleo",
      description: "Encuentra oportunidades laborales",
      href: "/job-search",
      icon: TrendingUp,
    },
  ]

  const recentActivity = [
    { action: "Completaste el Test DISC", time: "2 horas", badge: "Completado" },
    { action: "Nueva oportunidad laboral encontrada", time: "1 día", badge: "Nuevo" },
    { action: "Sesión de coaching programada", time: "2 días", badge: "Programado" },
    { action: "Perfil actualizado", time: "3 días", badge: "Actualizado" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">CareerDev</h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost">Panel</Button>
              </Link>
              <Link href="/disc-test">
                <Button variant="ghost">Evaluaciones</Button>
              </Link>
              <Link href="/career-coach">
                <Button variant="ghost">Coaching</Button>
              </Link>
              <Link href="/job-search">
                <Button variant="ghost">Empleos</Button>
              </Link>

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </Button>

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={user.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="hidden lg:block">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </div>
                <Button variant="ghost" size="icon" onClick={logout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="bg-gray-50 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <Link href="/dashboard" className="block">
                <Button variant="ghost" className="w-full justify-start">
                  Panel
                </Button>
              </Link>
              <Link href="/disc-test" className="block">
                <Button variant="ghost" className="w-full justify-start">
                  Evaluaciones
                </Button>
              </Link>
              <Link href="/career-coach" className="block">
                <Button variant="ghost" className="w-full justify-start">
                  Coaching
                </Button>
              </Link>
              <Link href="/job-search" className="block">
                <Button variant="ghost" className="w-full justify-start">
                  Empleos
                </Button>
              </Link>
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-3 space-x-3">
                  <Avatar>
                    <AvatarImage src={user.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                </div>
                <div className="mt-3 px-3">
                  <Button variant="ghost" onClick={logout} className="w-full justify-start">
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar Sesión
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Control</h1>
          <p className="text-gray-600">Bienvenido de vuelta, {user.name}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}/{stat.total}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="mt-4">
                  <Progress value={(stat.value / stat.total) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
              <CardDescription>Continúa con tu desarrollo profesional</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href}>
                  <div className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="p-2 bg-blue-100 rounded-lg mr-4">
                      <action.icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
              <CardDescription>Tus últimas acciones en la plataforma</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">Hace {activity.time}</p>
                  </div>
                  <Badge variant="secondary">{activity.badge}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
