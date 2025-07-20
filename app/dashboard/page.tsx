"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  User,
  Trophy,
  Target,
  BookOpen,
  MessageSquare,
  TrendingUp,
  Award,
  Star,
  Flag,
  Code,
  Brain,
  Users,
  BarChart3,
  PieChart,
  Activity,
  Clock,
} from "lucide-react"
import Link from "next/link"

// Mock data types
interface UserStats {
  total_assessments: number
  completed_goals: number
  avg_skill_level: number
}

interface UserProgress {
  overall_progress: number
  personality_progress: number
  skills_progress: number
  goals_progress: number
  interview_progress: number
  coaching_progress: number
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  earned_at: string
}

interface CareerGoal {
  id: string
  title: string
  description: string
  priority: string
  target_date: string
}

// Mock data
const mockStats: UserStats = {
  total_assessments: 3,
  completed_goals: 2,
  avg_skill_level: 7.5,
}

const mockProgress: UserProgress = {
  overall_progress: 65,
  personality_progress: 80,
  skills_progress: 60,
  goals_progress: 45,
  interview_progress: 30,
  coaching_progress: 70,
}

const mockAchievements: Achievement[] = [
  {
    id: "1",
    title: "Primera Evaluación",
    description: "Completaste tu primera evaluación de personalidad",
    icon: "star",
    earned_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    title: "Meta Alcanzada",
    description: "Lograste tu primera meta profesional",
    icon: "target",
    earned_at: "2024-01-10T15:30:00Z",
  },
  {
    id: "3",
    title: "Desarrollador Activo",
    description: "Completaste 5 ejercicios de programación",
    icon: "code",
    earned_at: "2024-01-05T09:15:00Z",
  },
]

const mockGoals: CareerGoal[] = [
  {
    id: "1",
    title: "Mejorar habilidades en React",
    description: "Completar curso avanzado de React y crear 3 proyectos",
    priority: "alta",
    target_date: "2024-03-01T00:00:00Z",
  },
  {
    id: "2",
    title: "Preparación para entrevistas",
    description: "Practicar 20 entrevistas simuladas",
    priority: "media",
    target_date: "2024-02-15T00:00:00Z",
  },
  {
    id: "3",
    title: "Networking profesional",
    description: "Conectar con 10 profesionales del sector",
    priority: "baja",
    target_date: "2024-04-01T00:00:00Z",
  },
]

// Custom Chart Components
const SkillsProgressChart = ({ data }: { data: any[] }) => {
  return (
    <div className="space-y-4">
      {data.map((skill, index) => {
        const progress = (skill.current / skill.target) * 100
        const improvement = skill.current - skill.previous

        return (
          <div key={skill.name} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{skill.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {skill.current}/{skill.target}
                </span>
                {improvement > 0 && (
                  <span className="text-xs text-green-600 flex items-center">
                    +{improvement}% <TrendingUp className="w-3 h-3 ml-1" />
                  </span>
                )}
              </div>
            </div>
            <div className="relative">
              <Progress value={progress} className="h-2" />
              <div
                className="absolute top-0 h-2 bg-blue-200 rounded-full"
                style={{ width: `${(skill.previous / skill.target) * 100}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

const SkillsDistributionChart = ({ data }: { data: any[] }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  let currentAngle = 0

  const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"]

  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <svg width="200" height="200" className="transform -rotate-90">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100
            const angle = (item.value / total) * 360
            const radius = 80
            const centerX = 100
            const centerY = 100

            const startAngle = currentAngle
            const endAngle = currentAngle + angle
            currentAngle += angle

            const startAngleRad = (startAngle * Math.PI) / 180
            const endAngleRad = (endAngle * Math.PI) / 180

            const x1 = centerX + radius * Math.cos(startAngleRad)
            const y1 = centerY + radius * Math.sin(startAngleRad)
            const x2 = centerX + radius * Math.cos(endAngleRad)
            const y2 = centerY + radius * Math.sin(endAngleRad)

            const largeArcFlag = angle > 180 ? 1 : 0

            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              "Z",
            ].join(" ")

            return (
              <path
                key={item.name}
                d={pathData}
                fill={colors[index % colors.length]}
                className="hover:opacity-80 transition-opacity cursor-pointer"
                style={{ opacity: 0.8 }}
              />
            )
          })}
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">Skills</div>
            <div className="text-sm text-gray-600">Distribution</div>
          </div>
        </div>
      </div>

      <div className="ml-6 space-y-2">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />
            <span className="text-sm">{item.name}</span>
            <span className="text-sm text-muted-foreground">
              {item.value}% {item.improvement && <span className="text-green-600">+{item.improvement}%</span>}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState<UserStats>(mockStats)
  const [progress, setProgress] = useState<UserProgress>(mockProgress)
  const [achievements, setAchievements] = useState<Achievement[]>(mockAchievements)
  const [goals, setGoals] = useState<CareerGoal[]>(mockGoals)
  const [loading, setLoading] = useState(false)

  // Mock data for charts
  const skillsProgressData = [
    { name: "JavaScript", current: 85, target: 90, previous: 80 },
    { name: "React", current: 80, target: 85, previous: 75 },
    { name: "Node.js", current: 75, target: 80, previous: 70 },
    { name: "Python", current: 70, target: 85, previous: 65 },
    { name: "SQL", current: 65, target: 75, previous: 60 },
  ]

  const skillsDistributionData = [
    { name: "Frontend", value: 35, improvement: 5 },
    { name: "Backend", value: 25, improvement: 3 },
    { name: "Database", value: 20, improvement: 2 },
    { name: "DevOps", value: 15, improvement: 4 },
    { name: "Mobile", value: 5, improvement: 1 },
  ]

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const getAchievementIcon = (iconName: string) => {
    const icons = {
      star: Star,
      target: Target,
      flag: Flag,
      code: Code,
      message: MessageSquare,
    }
    return icons[iconName as keyof typeof icons] || Star
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "alta":
        return "bg-red-100 text-red-800"
      case "media":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-green-100 text-green-800"
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Panel de Control</h1>
          <p className="text-gray-600 mt-1">Bienvenido de vuelta, aquí está tu progreso profesional</p>
        </div>
        <div className="flex items-center space-x-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder-user.jpg" alt="Usuario" />
            <AvatarFallback>
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Evaluaciones Completadas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_assessments}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Trophy className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Metas Completadas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completed_goals}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Nivel Promedio</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avg_skill_level}/10</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Progreso General</p>
                <p className="text-2xl font-bold text-gray-900">{progress.overall_progress}%</p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Activity className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Progreso por Área</CardTitle>
              <CardDescription>Tu avance en diferentes competencias profesionales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Evaluación de Personalidad</span>
                    <span>{progress.personality_progress}%</span>
                  </div>
                  <Progress value={progress.personality_progress} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Habilidades Técnicas</span>
                    <span>{progress.skills_progress}%</span>
                  </div>
                  <Progress value={progress.skills_progress} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Metas Profesionales</span>
                    <span>{progress.goals_progress}%</span>
                  </div>
                  <Progress value={progress.goals_progress} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Simulador de Entrevistas</span>
                    <span>{progress.interview_progress}%</span>
                  </div>
                  <Progress value={progress.interview_progress} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Coaching Profesional</span>
                    <span>{progress.coaching_progress}%</span>
                  </div>
                  <Progress value={progress.coaching_progress} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Progreso de Habilidades
                </CardTitle>
                <CardDescription>Comparación entre tu nivel actual y objetivos</CardDescription>
              </CardHeader>
              <CardContent>
                <SkillsProgressChart data={skillsProgressData} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Distribución de Habilidades
                </CardTitle>
                <CardDescription>Porcentaje de dominio por tecnología</CardDescription>
              </CardHeader>
              <CardContent>
                <SkillsDistributionChart data={skillsDistributionData} />
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
              <CardDescription>Continúa tu desarrollo profesional</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="/personality-test">
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  >
                    <Brain className="h-6 w-6" />
                    <span className="text-xs">Test Personalidad</span>
                  </Button>
                </Link>
                <Link href="/technical-skills-test">
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent hover:bg-green-50 hover:border-green-300 transition-colors"
                  >
                    <Code className="h-6 w-6" />
                    <span className="text-xs">Skills Técnicas</span>
                  </Button>
                </Link>
                <Link href="/interview-simulator">
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent hover:bg-purple-50 hover:border-purple-300 transition-colors"
                  >
                    <MessageSquare className="h-6 w-6" />
                    <span className="text-xs">Simulador</span>
                  </Button>
                </Link>
                <Link href="/career-coach">
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent hover:bg-orange-50 hover:border-orange-300 transition-colors"
                  >
                    <Users className="h-6 w-6" />
                    <span className="text-xs">Coach</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Recent Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-500" />
                Logros Recientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {achievements.slice(0, 3).map((achievement) => {
                  const Icon = getAchievementIcon(achievement.icon)
                  return (
                    <div key={achievement.id} className="flex items-start space-x-3">
                      <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Icon className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{achievement.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{achievement.description}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(achievement.earned_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Active Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-500" />
                Metas Activas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {goals.slice(0, 3).map((goal) => (
                  <div key={goal.id} className="border rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">{goal.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">{goal.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={getPriorityColor(goal.priority)} variant="secondary">
                            {goal.priority}
                          </Badge>
                          <span className="text-xs text-gray-400">
                            {new Date(goal.target_date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle>Próximos Pasos Recomendados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link href="/personality-test">
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer">
                    <Brain className="h-5 w-5 text-blue-600" />
                    <span className="text-sm">Completa tu evaluación de personalidad</span>
                  </div>
                </Link>
                <Link href="/career-coach">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer">
                    <Clock className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Programa una sesión de coaching</span>
                  </div>
                </Link>
                <Link href="/cv-builder">
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer">
                    <BookOpen className="h-5 w-5 text-purple-600" />
                    <span className="text-sm">Actualiza tu CV con nuevas habilidades</span>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
