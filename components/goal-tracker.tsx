"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Target, Plus, CheckCircle, Clock, AlertCircle, Calendar, TrendingUp } from "lucide-react"

interface Goal {
  id: string
  title: string
  description: string
  category: string
  status: string
  priority: string
  target_date: string
  progress: number
  created_at: string
}

export function GoalTracker({ userId }: { userId: string }) {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    category: "assessment",
    priority: "medium",
    targetDate: "",
  })

  useEffect(() => {
    fetchGoals()
  }, [userId])

  const fetchGoals = async () => {
    try {
      const response = await fetch(`/api/career-goals?userId=${userId}`)
      const data = await response.json()
      setGoals(data.goals || [])
    } catch (error) {
      console.error("Error fetching goals:", error)
    } finally {
      setLoading(false)
    }
  }

  const createGoal = async () => {
    try {
      const response = await fetch("/api/career-goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          ...newGoal,
        }),
      })

      if (response.ok) {
        setIsDialogOpen(false)
        setNewGoal({ title: "", description: "", category: "assessment", priority: "medium", targetDate: "" })
        fetchGoals()
      }
    } catch (error) {
      console.error("Error creating goal:", error)
    }
  }

  const updateGoalProgress = async (goalId: string, progress: number) => {
    try {
      await fetch("/api/career-goals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goalId,
          progress,
          status: progress >= 100 ? "completed" : "in_progress",
        }),
      })
      fetchGoals()
    } catch (error) {
      console.error("Error updating goal:", error)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "in_progress":
        return <Clock className="h-5 w-5 text-blue-600" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />
    }
  }

  if (loading) {
    return <div className="text-center py-8">Cargando metas...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Target className="h-6 w-6 text-purple-600" />
            Mis Metas de Carrera
          </h2>
          <p className="text-muted-foreground">Establece y rastrea tus objetivos profesionales</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Meta
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nueva Meta</DialogTitle>
              <DialogDescription>Define un objetivo profesional que quieras alcanzar</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Título</label>
                <Input
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  placeholder="Ej: Completar certificación en liderazgo"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Descripción</label>
                <Textarea
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  placeholder="Describe tu meta en detalle..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Categoría</label>
                  <Select
                    value={newGoal.category}
                    onValueChange={(value) => setNewGoal({ ...newGoal, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="assessment">Evaluaciones</SelectItem>
                      <SelectItem value="learning">Aprendizaje</SelectItem>
                      <SelectItem value="career">Carrera</SelectItem>
                      <SelectItem value="skills">Habilidades</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Prioridad</label>
                  <Select
                    value={newGoal.priority}
                    onValueChange={(value) => setNewGoal({ ...newGoal, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="medium">Media</SelectItem>
                      <SelectItem value="low">Baja</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Fecha Objetivo</label>
                <Input
                  type="date"
                  value={newGoal.targetDate}
                  onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                />
              </div>
              <Button onClick={createGoal} className="w-full bg-purple-600 hover:bg-purple-700">
                Crear Meta
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {goals.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No tienes metas aún</h3>
            <p className="text-muted-foreground mb-4">
              Crea tu primera meta profesional para comenzar a rastrear tu progreso
            </p>
            <Button onClick={() => setIsDialogOpen(true)} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Crear Primera Meta
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {goals.map((goal) => (
            <Card key={goal.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3 flex-1">
                    {getStatusIcon(goal.status)}
                    <div className="flex-1">
                      <CardTitle className="text-lg">{goal.title}</CardTitle>
                      <CardDescription>{goal.description}</CardDescription>
                    </div>
                  </div>
                  <Badge className={getPriorityColor(goal.priority)}>{goal.priority}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progreso</span>
                    <span className="font-medium">{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {new Date(goal.target_date).toLocaleDateString("es-ES")}
                  </div>
                  {goal.status !== "completed" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateGoalProgress(goal.id, Math.min(goal.progress + 25, 100))}
                      >
                        <TrendingUp className="h-4 w-4 mr-1" />
                        +25%
                      </Button>
                      {goal.progress < 100 && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => updateGoalProgress(goal.id, 100)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Completar
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
