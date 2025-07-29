"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/hooks/use-toast"
import {
  Target,
  Plus,
  CalendarIcon,
  CheckCircle2,
  Clock,
  TrendingUp,
  Filter,
  Eye,
  Star,
  AlertCircle,
} from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface Goal {
  id: string
  title: string
  description: string
  category: "career" | "skills" | "education" | "networking"
  priority: "low" | "medium" | "high"
  status: "active" | "completed" | "paused"
  targetDate: Date
  createdAt: Date
  progress: number
  milestones: Milestone[]
}

interface Milestone {
  id: string
  title: string
  description?: string
  completed: boolean
  dueDate?: Date
  completedAt?: Date
}

const categoryLabels = {
  career: "Carrera",
  skills: "Habilidades",
  education: "Educación",
  networking: "Networking",
}

const priorityLabels = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
}

const statusLabels = {
  active: "Activo",
  completed: "Completado",
  paused: "Pausado",
}

// Demo data for goals
const demoGoals: Goal[] = [
  {
    id: "1",
    title: "Transición a Data Science",
    description: "Cambiar mi carrera hacia Data Science con enfoque en el mercado chileno",
    category: "career",
    priority: "high",
    status: "active",
    targetDate: new Date(2024, 11, 31),
    createdAt: new Date(2024, 0, 15),
    progress: 65,
    milestones: [
      {
        id: "1-1",
        title: "Completar curso de Python para Data Science",
        completed: true,
        dueDate: new Date(2024, 2, 30),
        completedAt: new Date(2024, 2, 28),
      },
      {
        id: "1-2",
        title: "Obtener certificación en Machine Learning",
        completed: true,
        dueDate: new Date(2024, 5, 15),
        completedAt: new Date(2024, 5, 10),
      },
      {
        id: "1-3",
        title: "Crear portfolio con 3 proyectos",
        completed: false,
        dueDate: new Date(2024, 8, 30),
      },
      {
        id: "1-4",
        title: "Aplicar a 10 posiciones en Santiago",
        completed: false,
        dueDate: new Date(2024, 10, 15),
      },
    ],
  },
  {
    id: "2",
    title: "Certificación AWS Solutions Architect",
    description: "Obtener certificación AWS para mejorar oportunidades en cloud computing",
    category: "skills",
    priority: "high",
    status: "active",
    targetDate: new Date(2024, 9, 30),
    createdAt: new Date(2024, 1, 1),
    progress: 40,
    milestones: [
      {
        id: "2-1",
        title: "Completar curso AWS Fundamentals",
        completed: true,
        dueDate: new Date(2024, 3, 30),
        completedAt: new Date(2024, 3, 25),
      },
      {
        id: "2-2",
        title: "Práctica con laboratorios hands-on",
        completed: false,
        dueDate: new Date(2024, 7, 15),
      },
      {
        id: "2-3",
        title: "Tomar examen de certificación",
        completed: false,
        dueDate: new Date(2024, 9, 15),
      },
    ],
  },
  {
    id: "3",
    title: "Networking en Tech Santiago",
    description: "Expandir red profesional en el ecosistema tech de Santiago",
    category: "networking",
    priority: "medium",
    status: "active",
    targetDate: new Date(2024, 11, 31),
    createdAt: new Date(2024, 2, 1),
    progress: 75,
    milestones: [
      {
        id: "3-1",
        title: "Asistir a 5 eventos de 9punto5",
        completed: true,
        dueDate: new Date(2024, 6, 30),
        completedAt: new Date(2024, 6, 20),
      },
      {
        id: "3-2",
        title: "Conectar con 50 profesionales en LinkedIn",
        completed: true,
        dueDate: new Date(2024, 8, 15),
        completedAt: new Date(2024, 8, 10),
      },
      {
        id: "3-3",
        title: "Participar en 2 meetups de tecnología",
        completed: false,
        dueDate: new Date(2024, 10, 30),
      },
    ],
  },
  {
    id: "4",
    title: "Maestría en Ingeniería de Software",
    description: "Completar maestría para avanzar a roles de liderazgo técnico",
    category: "education",
    priority: "medium",
    status: "active",
    targetDate: new Date(2025, 11, 31),
    createdAt: new Date(2024, 0, 1),
    progress: 25,
    milestones: [
      {
        id: "4-1",
        title: "Completar primer semestre",
        completed: true,
        dueDate: new Date(2024, 5, 30),
        completedAt: new Date(2024, 5, 28),
      },
      {
        id: "4-2",
        title: "Completar segundo semestre",
        completed: false,
        dueDate: new Date(2024, 11, 30),
      },
      {
        id: "4-3",
        title: "Desarrollar tesis",
        completed: false,
        dueDate: new Date(2025, 8, 30),
      },
    ],
  },
]

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>(demoGoals)
  const [filteredGoals, setFilteredGoals] = useState<Goal[]>(demoGoals)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)

  // New goal form state
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    category: "career" as Goal["category"],
    priority: "medium" as Goal["priority"],
    targetDate: new Date(),
  })

  // Filter goals based on selected filters
  useEffect(() => {
    let filtered = goals

    if (selectedCategory !== "all") {
      filtered = filtered.filter((goal) => goal.category === selectedCategory)
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((goal) => goal.status === selectedStatus)
    }

    setFilteredGoals(filtered)
  }, [goals, selectedCategory, selectedStatus])

  // Calculate statistics
  const stats = {
    total: goals.length,
    active: goals.filter((g) => g.status === "active").length,
    completed: goals.filter((g) => g.status === "completed").length,
    averageProgress: Math.round(goals.reduce((acc, goal) => acc + goal.progress, 0) / goals.length),
  }

  const handleCreateGoal = () => {
    if (!newGoal.title.trim()) {
      toast({
        title: "Error",
        description: "El título del objetivo es requerido",
        variant: "destructive",
      })
      return
    }

    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description,
      category: newGoal.category,
      priority: newGoal.priority,
      status: "active",
      targetDate: newGoal.targetDate,
      createdAt: new Date(),
      progress: 0,
      milestones: [],
    }

    setGoals((prev) => [...prev, goal])
    setNewGoal({
      title: "",
      description: "",
      category: "career",
      priority: "medium",
      targetDate: new Date(),
    })
    setIsCreateDialogOpen(false)

    toast({
      title: "Objetivo creado",
      description: "Tu nuevo objetivo ha sido creado exitosamente",
    })
  }

  const handleToggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id === goalId) {
          const updatedMilestones = goal.milestones.map((milestone) => {
            if (milestone.id === milestoneId) {
              return {
                ...milestone,
                completed: !milestone.completed,
                completedAt: !milestone.completed ? new Date() : undefined,
              }
            }
            return milestone
          })

          const completedCount = updatedMilestones.filter((m) => m.completed).length
          const progress =
            updatedMilestones.length > 0 ? Math.round((completedCount / updatedMilestones.length) * 100) : 0

          return {
            ...goal,
            milestones: updatedMilestones,
            progress,
            status: progress === 100 ? "completed" : "active",
          }
        }
        return goal
      }),
    )

    toast({
      title: "Progreso actualizado",
      description: "El hito ha sido marcado como completado",
    })
  }

  const getPriorityColor = (priority: Goal["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
    }
  }

  const getStatusColor = (status: Goal["status"]) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "paused":
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getCategoryIcon = (category: Goal["category"]) => {
    switch (category) {
      case "career":
        return <TrendingUp className="h-4 w-4" />
      case "skills":
        return <Target className="h-4 w-4" />
      case "education":
        return <CalendarIcon className="h-4 w-4" />
      case "networking":
        return <Star className="h-4 w-4" />
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Objetivos Profesionales</h1>
          <p className="text-muted-foreground">Gestiona y da seguimiento a tus metas de desarrollo profesional</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Objetivo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Objetivo</DialogTitle>
              <DialogDescription>
                Define un nuevo objetivo profesional con sus detalles y fecha objetivo.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título del Objetivo</Label>
                <Input
                  id="title"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Ej: Obtener certificación AWS"
                />
              </div>

              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe tu objetivo en detalle..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Categoría</Label>
                  <Select
                    value={newGoal.category}
                    onValueChange={(value: Goal["category"]) => setNewGoal((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="career">Carrera</SelectItem>
                      <SelectItem value="skills">Habilidades</SelectItem>
                      <SelectItem value="education">Educación</SelectItem>
                      <SelectItem value="networking">Networking</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Prioridad</Label>
                  <Select
                    value={newGoal.priority}
                    onValueChange={(value: Goal["priority"]) => setNewGoal((prev) => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baja</SelectItem>
                      <SelectItem value="medium">Media</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Fecha Objetivo</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !newGoal.targetDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newGoal.targetDate ? (
                        format(newGoal.targetDate, "PPP", { locale: es })
                      ) : (
                        <span>Selecciona una fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={newGoal.targetDate}
                      onSelect={(date) => date && setNewGoal((prev) => ({ ...prev, targetDate: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateGoal}>Crear Objetivo</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Objetivos</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Activos</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completados</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Progreso Promedio</p>
                <p className="text-2xl font-bold">{stats.averageProgress}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filtros:</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las categorías</SelectItem>
                    <SelectItem value="career">Carrera</SelectItem>
                    <SelectItem value="skills">Habilidades</SelectItem>
                    <SelectItem value="education">Educación</SelectItem>
                    <SelectItem value="networking">Networking</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="completed">Completado</SelectItem>
                    <SelectItem value="paused">Pausado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGoals.map((goal) => (
          <Card key={goal.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(goal.category)}
                  <CardTitle className="text-lg">{goal.title}</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedGoal(goal)
                    setIsDetailsDialogOpen(true)
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription className="line-clamp-2">{goal.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge className={getPriorityColor(goal.priority)}>{priorityLabels[goal.priority]}</Badge>
                <Badge className={getStatusColor(goal.status)}>{statusLabels[goal.status]}</Badge>
                <Badge variant="outline">{categoryLabels[goal.category]}</Badge>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progreso</span>
                  <span>{goal.progress}%</span>
                </div>
                <Progress value={goal.progress} className="h-2" />
              </div>

              {/* Target Date */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarIcon className="h-4 w-4" />
                <span>Objetivo: {format(goal.targetDate, "dd MMM yyyy", { locale: es })}</span>
              </div>

              {/* Milestones Preview */}
              {goal.milestones.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    Hitos ({goal.milestones.filter((m) => m.completed).length}/{goal.milestones.length})
                  </p>
                  <div className="space-y-1">
                    {goal.milestones.slice(0, 2).map((milestone) => (
                      <div key={milestone.id} className="flex items-center gap-2 text-sm">
                        <Checkbox
                          checked={milestone.completed}
                          onCheckedChange={() => handleToggleMilestone(goal.id, milestone.id)}
                        />
                        <span className={milestone.completed ? "line-through text-muted-foreground" : ""}>
                          {milestone.title}
                        </span>
                      </div>
                    ))}
                    {goal.milestones.length > 2 && (
                      <p className="text-xs text-muted-foreground">+{goal.milestones.length - 2} hitos más</p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Goal Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          {selectedGoal && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {getCategoryIcon(selectedGoal.category)}
                  {selectedGoal.title}
                </DialogTitle>
                <DialogDescription>{selectedGoal.description}</DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Goal Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Categoría</Label>
                    <p className="text-sm">{categoryLabels[selectedGoal.category]}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Prioridad</Label>
                    <Badge className={getPriorityColor(selectedGoal.priority)}>
                      {priorityLabels[selectedGoal.priority]}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Estado</Label>
                    <Badge className={getStatusColor(selectedGoal.status)}>{statusLabels[selectedGoal.status]}</Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Fecha Objetivo</Label>
                    <p className="text-sm">{format(selectedGoal.targetDate, "dd MMM yyyy", { locale: es })}</p>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-sm font-medium">Progreso General</Label>
                    <span className="text-sm font-medium">{selectedGoal.progress}%</span>
                  </div>
                  <Progress value={selectedGoal.progress} className="h-3" />
                </div>

                {/* Milestones */}
                {selectedGoal.milestones.length > 0 && (
                  <div className="space-y-4">
                    <Label className="text-sm font-medium">
                      Hitos ({selectedGoal.milestones.filter((m) => m.completed).length}/
                      {selectedGoal.milestones.length})
                    </Label>
                    <div className="space-y-3">
                      {selectedGoal.milestones.map((milestone) => (
                        <div key={milestone.id} className="flex items-start gap-3 p-3 border rounded-lg">
                          <Checkbox
                            checked={milestone.completed}
                            onCheckedChange={() => handleToggleMilestone(selectedGoal.id, milestone.id)}
                            className="mt-0.5"
                          />
                          <div className="flex-1 space-y-1">
                            <p
                              className={cn(
                                "text-sm font-medium",
                                milestone.completed && "line-through text-muted-foreground",
                              )}
                            >
                              {milestone.title}
                            </p>
                            {milestone.description && (
                              <p className="text-xs text-muted-foreground">{milestone.description}</p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              {milestone.dueDate && (
                                <span className="flex items-center gap-1">
                                  <CalendarIcon className="h-3 w-3" />
                                  Vence: {format(milestone.dueDate, "dd MMM", { locale: es })}
                                </span>
                              )}
                              {milestone.completedAt && (
                                <span className="flex items-center gap-1 text-green-600">
                                  <CheckCircle2 className="h-3 w-3" />
                                  Completado: {format(milestone.completedAt, "dd MMM", { locale: es })}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedGoal.milestones.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                    <p>No hay hitos definidos para este objetivo</p>
                    <p className="text-sm">Considera agregar hitos para hacer seguimiento del progreso</p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Empty State */}
      {filteredGoals.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No hay objetivos</h3>
            <p className="text-muted-foreground mb-4">
              {selectedCategory !== "all" || selectedStatus !== "all"
                ? "No se encontraron objetivos con los filtros seleccionados"
                : "Comienza creando tu primer objetivo profesional"}
            </p>
            {selectedCategory === "all" && selectedStatus === "all" && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Primer Objetivo
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
