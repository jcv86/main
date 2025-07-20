"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  User,
  BookOpen,
  Target,
  TrendingUp,
  Award,
  CheckCircle,
  Brain,
  Code,
  MessageSquare,
  Briefcase,
  Star,
  WifiOff,
  Activity,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { SyncStatusComponent } from "@/components/sync-status"
import { syncService } from "@/lib/sync-service"
import { useRouter } from "next/navigation"

interface DashboardStats {
  assessmentsCompleted: number
  skillsImproved: number
  coachingSessions: number
  jobApplications: number
}

interface SkillProgress {
  skill: string
  current: number
  target: number
  improvement: number
}

interface RecentActivity {
  id: string
  type: "assessment" | "coaching" | "application" | "skill"
  title: string
  description: string
  date: string
  status: "completed" | "in-progress" | "pending"
}

const mockStats: DashboardStats = {
  assessmentsCompleted: 8,
  skillsImproved: 12,
  coachingSessions: 5,
  jobApplications: 15,
}

const mockSkillProgress: SkillProgress[] = [
  { skill: "JavaScript", current: 85, target: 90, improvement: 15 },
  { skill: "React", current: 78, target: 85, improvement: 12 },
  { skill: "Node.js", current: 72, target: 80, improvement: 8 },
  { skill: "TypeScript", current: 68, target: 75, improvement: 18 },
  { skill: "CSS", current: 82, target: 85, improvement: 5 },
]

const mockRecentActivity: RecentActivity[] = [
  {
    id: "1",
    type: "assessment",
    title: "Evaluación Técnica Completada",
    description: "Puntuación promedio: 78%",
    date: "2024-01-15",
    status: "completed",
  },
  {
    id: "2",
    type: "coaching",
    title: "Sesión de Coaching",
    description: "Preparación para entrevistas técnicas",
    date: "2024-01-14",
    status: "completed",
  },
  {
    id: "3",
    type: "application",
    title: "Postulación Enviada",
    description: "Desarrollador Full Stack - TechCorp",
    date: "2024-01-13",
    status: "in-progress",
  },
  {
    id: "4",
    type: "skill",
    title: "Habilidad Mejorada",
    description: "React: +12 puntos",
    date: "2024-01-12",
    status: "completed",
  },
]

const SKILL_COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"]

// Simple Bar Chart Component
function SimpleBarChart({ data }: { data: SkillProgress[] }) {
  const maxValue = Math.max(...data.map((d) => Math.max(d.current, d.target)))

  return (
    <div className="space-y-4">
      {data.map((skill, index) => (
        <div key={skill.skill} className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{skill.skill}</span>
            <span className="text-xs text-gray-500">
              {skill.current}% / {skill.target}%
            </span>
          </div>
          <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
            {/* Target bar (background) */}
            <div
              className="absolute top-0 left-0 h-full bg-gray-300 rounded-lg transition-all duration-500"
              style={{ width: `${(skill.target / maxValue) * 100}%` }}
            />
            {/* Current bar (foreground) */}
            <div
              className="absolute top-0 left-0 h-full rounded-lg transition-all duration-700 flex items-center justify-end pr-2"
              style={{
                width: `${(skill.current / maxValue) * 100}%`,
                backgroundColor: SKILL_COLORS[index % SKILL_COLORS.length],
              }}
            >
              <span className="text-xs font-medium text-white">{skill.current}%</span>
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Actual: {skill.current}%</span>
            <span>Objetivo: {skill.target}%</span>
            <span className="text-green-600">+{skill.improvement}%</span>
          </div>
        </div>
      ))}
    </div>
  )
}

// Simple Pie Chart Component
function SimplePieChart({ data }: { data: SkillProgress[] }) {
  const total = data.reduce((sum, skill) => sum + skill.current, 0)
  let currentAngle = 0

  const segments = data.map((skill, index) => {
    const percentage = (skill.current / total) * 100
    const angle = (skill.current / total) * 360
    const startAngle = currentAngle
    currentAngle += angle

    return {
      ...skill,
      percentage: percentage.toFixed(1),
      angle,
      startAngle,
      color: SKILL_COLORS[index % SKILL_COLORS.length],
    }
  })

  const createPath = (centerX: number, centerY: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(centerX, centerY, radius, endAngle)
    const end = polarToCartesian(centerX, centerY, radius, startAngle)
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"

    return [
      "M",
      centerX,
      centerY,
      "L",
      start.x,
      start.y,
      "A",
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
      "Z",
    ].join(" ")
  }

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <svg width="200" height="200" className="transform -rotate-90">
          {segments.map((segment, index) => (
            <path
              key={segment.skill}
              d={createPath(100, 100, 80, segment.startAngle, segment.startAngle + segment.angle)}
              fill={segment.color}
              className="hover:opacity-80 transition-opacity cursor-pointer"
              title={`${segment.skill}: ${segment.percentage}%`}
            />
          ))}
        </svg>
      </div>
      <div className="grid grid-cols-1 gap-2 w-full">
        {segments.map((segment, index) => (
          <div key={segment.skill} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }} />
              <span className="text-sm font-medium">{segment.skill}</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">{segment.percentage}%</div>
              <div className="text-xs text-green-600">+{segment.improvement}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user, isOffline, getOfflineData } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>(mockStats)
  const [skillProgress, setSkillProgress] = useState<SkillProgress[]>(mockSkillProgress)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>(mockRecentActivity)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const loadDashboardData = async () => {
      try {
        if (user) {
          // Simulate some activity to show sync is working
          syncService.simulateActivity()

          // Load offline data if available
          const offlineAssessments = getOfflineData("skill_assessments")
          const offlineProgress = getOfflineData("assessment_progress")
          const offlineCoaching = getOfflineData("coaching_sessions")

          // Update stats based on offline data
          if (offlineAssessments.length > 0 || offlineProgress.length > 0 || offlineCoaching.length > 0) {
            setStats((prev) => ({
              ...prev,
              assessmentsCompleted: prev.assessmentsCompleted + offlineAssessments.length,
              coachingSessions: prev.coachingSessions + offlineCoaching.length,
            }))
          }
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [user, getOfflineData])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "assessment":
        return <BookOpen className="w-4 h-4" />
      case "coaching":
        return <MessageSquare className="w-4 h-4" />
      case "application":
        return <Briefcase className="w-4 h-4" />
      case "skill":
        return <TrendingUp className="w-4 h-4" />
      default:
        return <CheckCircle className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completado"
      case "in-progress":
        return "En progreso"
      case "pending":
        return "Pendiente"
      default:
        return "Desconocido"
    }
  }

  const handleQuickAction = (path: string) => {
    // Simulate activity when user performs actions
    syncService.simulateActivity()
    router.push(path)
  }

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-96 bg-gray-200 rounded"></div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                ¡Hola, {user?.user_metadata?.full_name || user?.email || "Usuario"}!
              </h1>
              <p className="text-gray-600">Aquí tienes un resumen de tu progreso profesional</p>
            </div>
            <div className="flex items-center space-x-4">
              <SyncStatusComponent variant="compact" />
              {isOffline && (
                <div className="flex items-center space-x-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <WifiOff className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">Modo sin conexión</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sync Status Card */}
        <div className="mb-8">
          <SyncStatusComponent />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Evaluaciones</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.assessmentsCompleted}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleQuickAction("/skills-assessment")}
                  className="w-full hover:bg-blue-50 hover:border-blue-200 transition-colors"
                >
                  Nueva Evaluación
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Habilidades Mejoradas</p>
                  <p className="text-2xl font-bold text-green-600">{stats.skillsImproved}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleQuickAction("/technical-skills-test")}
                  className="w-full hover:bg-green-50 hover:border-green-200 transition-colors"
                >
                  Practicar Habilidades
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sesiones de Coaching</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.coachingSessions}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <MessageSquare className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleQuickAction("/career-coach")}
                  className="w-full hover:bg-purple-50 hover:border-purple-200 transition-colors"
                >
                  Nueva Sesión
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Postulaciones</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.jobApplications}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Briefcase className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleQuickAction("/job-search")}
                  className="w-full hover:bg-orange-50 hover:border-orange-200 transition-colors"
                >
                  Buscar Empleos
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Skills Progress Chart */}
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Code className="w-5 h-5" />
                <span>Progreso de Habilidades</span>
              </CardTitle>
              <CardDescription>Comparación entre tu nivel actual y objetivos</CardDescription>
            </CardHeader>
            <CardContent>
              <SimpleBarChart data={skillProgress} />
            </CardContent>
          </Card>

          {/* Skill Distribution */}
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>Distribución de Habilidades</span>
              </CardTitle>
              <CardDescription>Porcentaje de dominio por tecnología</CardDescription>
            </CardHeader>
            <CardContent>
              <SimplePieChart data={skillProgress} />
            </CardContent>
          </Card>
        </div>

        {/* Skills Progress Details */}
        <Card className="mb-8 hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5" />
              <span>Detalle de Habilidades</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {skillProgress.map((skill) => (
                <div key={skill.skill} className="group hover:bg-gray-50 p-3 rounded-lg transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium">{skill.skill}</span>
                      <Badge
                        className={
                          skill.improvement > 10
                            ? "bg-green-100 text-green-800 border-green-200"
                            : skill.improvement > 5
                              ? "bg-blue-100 text-blue-800 border-blue-200"
                              : "bg-gray-100 text-gray-800 border-gray-200"
                        }
                      >
                        +{skill.improvement}%
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-600">
                      {skill.current}% / {skill.target}%
                    </span>
                  </div>
                  <div className="relative">
                    <Progress value={skill.current} className="h-3 group-hover:h-4 transition-all" />
                    <div
                      className="absolute top-0 h-3 group-hover:h-4 bg-gray-300 rounded-full opacity-30 transition-all"
                      style={{ width: `${skill.target}%` }}
                    />
                  </div>
                  <div className="mt-2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    Faltan {skill.target - skill.current} puntos para alcanzar el objetivo
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Actividad Reciente</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={activity.id} className="hover:bg-gray-50 p-3 rounded-lg transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-gray-100 rounded-full">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <Badge className={getStatusColor(activity.status)}>{getStatusText(activity.status)}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(activity.date).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  {index < recentActivity.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            onClick={() => handleQuickAction("/personality-test")}
            variant="outline"
            className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-blue-50 hover:border-blue-200 transition-colors"
          >
            <User className="w-6 h-6" />
            <span>Test de Personalidad</span>
          </Button>
          <Button
            onClick={() => handleQuickAction("/interview-simulator")}
            variant="outline"
            className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-green-50 hover:border-green-200 transition-colors"
          >
            <MessageSquare className="w-6 h-6" />
            <span>Simulador de Entrevistas</span>
          </Button>
          <Button
            onClick={() => handleQuickAction("/cv-builder")}
            variant="outline"
            className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-purple-50 hover:border-purple-200 transition-colors"
          >
            <Award className="w-6 h-6" />
            <span>Constructor de CV</span>
          </Button>
          <Button
            onClick={() => handleQuickAction("/profile")}
            variant="outline"
            className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-orange-50 hover:border-orange-200 transition-colors"
          >
            <Star className="w-6 h-6" />
            <span>Mi Perfil</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
