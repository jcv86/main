"use client"

import { useState, useEffect } from "react"
import { Calendar, dateFnsLocalizer } from "react-big-calendar"
import { format, parse, startOfWeek, getDay } from "date-fns"
import { es } from "date-fns/locale"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Clock, Target, Plus, CheckCircle, Circle, AlertCircle, TrendingUp } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { toast } from "sonner"
import "react-big-calendar/lib/css/react-big-calendar.css"

const locales = {
  es: es,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

interface CalendarEvent {
  id: string
  title: string
  description?: string
  start: Date
  end: Date
  eventType: "goal" | "interview" | "assessment" | "coaching" | "reminder" | "deadline"
  status: "pending" | "completed" | "missed" | "in_progress"
  priority: "low" | "medium" | "high"
  relatedModule?: string
}

interface Goal {
  id: string
  title: string
  description?: string
  targetDate: Date
  progress: number
  category: "career" | "skills" | "education" | "networking"
  status: "active" | "completed" | "paused" | "cancelled"
  milestones: Milestone[]
}

interface Milestone {
  id: string
  goalId: string
  title: string
  description?: string
  completed: boolean
  completedDate?: Date
  orderIndex: number
}

// Demo data for when database is not available
const demoEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Simulación de Entrevista - Frontend Developer",
    description: "Práctica de entrevista para posición en startup tecnológica",
    start: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    end: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
    eventType: "interview",
    status: "pending",
    priority: "high",
    relatedModule: "interview-simulator",
  },
  {
    id: "2",
    title: "Completar Test de Personalidad Big Five",
    description: "Evaluación pendiente para completar perfil profesional",
    start: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    end: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
    eventType: "assessment",
    status: "pending",
    priority: "medium",
    relatedModule: "big-five-test",
  },
  {
    id: "3",
    title: "Sesión con AI Career Coach",
    description: "Revisión de progreso mensual y planificación de objetivos",
    start: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    end: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
    eventType: "coaching",
    status: "pending",
    priority: "medium",
    relatedModule: "career-coach",
  },
]

const demoGoals: Goal[] = [
  {
    id: "1",
    title: "Transición a Data Science",
    description: "Cambiar de carrera hacia Data Science con enfoque en Machine Learning",
    targetDate: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000),
    progress: 65,
    category: "career",
    status: "active",
    milestones: [
      {
        id: "1-1",
        goalId: "1",
        title: "Completar curso de Python",
        completed: true,
        completedDate: new Date(Date.now() - 2 * 30 * 24 * 60 * 60 * 1000),
        orderIndex: 1,
      },
      {
        id: "1-2",
        goalId: "1",
        title: "Aprender SQL avanzado",
        completed: true,
        completedDate: new Date(Date.now() - 1 * 30 * 24 * 60 * 60 * 1000),
        orderIndex: 2,
      },
      {
        id: "1-3",
        goalId: "1",
        title: "Proyecto de Machine Learning",
        completed: false,
        orderIndex: 3,
      },
      {
        id: "1-4",
        goalId: "1",
        title: "Certificación en Data Science",
        completed: false,
        orderIndex: 4,
      },
      {
        id: "1-5",
        goalId: "1",
        title: "Portfolio completo",
        completed: false,
        orderIndex: 5,
      },
    ],
  },
  {
    id: "2",
    title: "Mejorar Habilidades de Comunicación",
    description: "Desarrollar habilidades blandas para liderazgo y presentaciones",
    targetDate: new Date(Date.now() + 3 * 30 * 24 * 60 * 60 * 1000),
    progress: 80,
    category: "skills",
    status: "active",
    milestones: [
      {
        id: "2-1",
        goalId: "2",
        title: "Curso de presentaciones efectivas",
        completed: true,
        completedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        orderIndex: 1,
      },
      {
        id: "2-2",
        goalId: "2",
        title: "Práctica de speaking público",
        completed: false,
        orderIndex: 2,
      },
    ],
  },
  {
    id: "3",
    title: "Networking Profesional",
    description: "Expandir red de contactos en la industria tecnológica",
    targetDate: new Date(Date.now() + 4 * 30 * 24 * 60 * 60 * 1000),
    progress: 40,
    category: "networking",
    status: "active",
    milestones: [
      {
        id: "3-1",
        goalId: "3",
        title: "Asistir a 3 eventos tech",
        completed: false,
        orderIndex: 1,
      },
      {
        id: "3-2",
        goalId: "3",
        title: "Conectar con 20 profesionales",
        completed: false,
        orderIndex: 2,
      },
    ],
  },
]

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false)
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false)
  const [isNewEventDialogOpen, setIsNewEventDialogOpen] = useState(false)
  const [isNewGoalDialogOpen, setIsNewGoalDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    eventDate: "",
    eventTime: "",
    eventType: "reminder" as const,
    priority: "medium" as const,
    relatedModule: "",
  })
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    targetDate: "",
    category: "career" as const,
  })

  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)

      // Try to load from database, but fallback to demo data if it fails
      try {
        // Load calendar events
        const { data: eventsData, error: eventsError } = await supabase
          .from("calendar_events")
          .select("*")
          .order("event_date", { ascending: true })

        // Load goals with milestones
        const { data: goalsData, error: goalsError } = await supabase
          .from("goals")
          .select(`
            *,
            goal_milestones (*)
          `)
          .order("target_date", { ascending: true })

        // If database queries succeed, use the data
        if (!eventsError && !goalsError && eventsData && goalsData) {
          // Transform events data
          const transformedEvents: CalendarEvent[] = eventsData.map((event) => ({
            id: event.id,
            title: event.title,
            description: event.description,
            start: new Date(event.event_date),
            end: new Date(new Date(event.event_date).getTime() + 60 * 60 * 1000), // 1 hour default
            eventType: event.event_type,
            status: event.event_status,
            priority: event.priority,
            relatedModule: event.related_module,
          }))

          // Transform goals data
          const transformedGoals: Goal[] = goalsData.map((goal) => ({
            id: goal.id,
            title: goal.title,
            description: goal.description,
            targetDate: new Date(goal.target_date),
            progress: goal.progress,
            category: goal.category,
            status: goal.goal_status,
            milestones:
              goal.goal_milestones?.map((milestone: any) => ({
                id: milestone.id,
                goalId: milestone.goal_id,
                title: milestone.title,
                description: milestone.description,
                completed: milestone.completed,
                completedDate: milestone.completed_date ? new Date(milestone.completed_date) : undefined,
                orderIndex: milestone.order_index,
              })) || [],
          }))

          setEvents(transformedEvents)
          setGoals(transformedGoals)
        } else {
          // Fallback to demo data
          console.log("Using demo data for calendar and goals")
          setEvents(demoEvents)
          setGoals(demoGoals)
        }
      } catch (dbError) {
        // Database connection failed, use demo data
        console.log("Database not available, using demo data:", dbError)
        setEvents(demoEvents)
        setGoals(demoGoals)
      }
    } catch (error) {
      console.error("Error loading data:", error)
      // Even if there's an error, show demo data
      setEvents(demoEvents)
      setGoals(demoGoals)
      toast.error("Usando datos de demostración - base de datos no disponible")
    } finally {
      setLoading(false)
    }
  }

  const createEvent = async () => {
    try {
      const eventDateTime = new Date(`${newEvent.eventDate}T${newEvent.eventTime || "09:00"}`)

      // Try to save to database, but don't fail if it doesn't work
      try {
        const { data, error } = await supabase
          .from("calendar_events")
          .insert({
            title: newEvent.title,
            description: newEvent.description,
            event_date: eventDateTime.toISOString(),
            event_time: newEvent.eventTime,
            event_type: newEvent.eventType,
            priority: newEvent.priority,
            related_module: newEvent.relatedModule,
            event_status: "pending",
          })
          .select()
          .single()

        if (!error) {
          toast.success("Evento creado exitosamente")
        } else {
          throw error
        }
      } catch (dbError) {
        // Add to local state if database fails
        const newEventObj: CalendarEvent = {
          id: Date.now().toString(),
          title: newEvent.title,
          description: newEvent.description,
          start: eventDateTime,
          end: new Date(eventDateTime.getTime() + 60 * 60 * 1000),
          eventType: newEvent.eventType,
          status: "pending",
          priority: newEvent.priority,
          relatedModule: newEvent.relatedModule,
        }
        setEvents((prev) => [...prev, newEventObj])
        toast.success("Evento creado (modo demo)")
      }

      setIsNewEventDialogOpen(false)
      setNewEvent({
        title: "",
        description: "",
        eventDate: "",
        eventTime: "",
        eventType: "reminder",
        priority: "medium",
        relatedModule: "",
      })
      loadData()
    } catch (error) {
      console.error("Error creating event:", error)
      toast.error("Error al crear el evento")
    }
  }

  const createGoal = async () => {
    try {
      // Try to save to database, but don't fail if it doesn't work
      try {
        const { data, error } = await supabase
          .from("goals")
          .insert({
            title: newGoal.title,
            description: newGoal.description,
            target_date: new Date(newGoal.targetDate).toISOString(),
            category: newGoal.category,
            progress: 0,
            goal_status: "active",
          })
          .select()
          .single()

        if (!error) {
          toast.success("Meta creada exitosamente")
        } else {
          throw error
        }
      } catch (dbError) {
        // Add to local state if database fails
        const newGoalObj: Goal = {
          id: Date.now().toString(),
          title: newGoal.title,
          description: newGoal.description,
          targetDate: new Date(newGoal.targetDate),
          progress: 0,
          category: newGoal.category,
          status: "active",
          milestones: [],
        }
        setGoals((prev) => [...prev, newGoalObj])
        toast.success("Meta creada (modo demo)")
      }

      setIsNewGoalDialogOpen(false)
      setNewGoal({
        title: "",
        description: "",
        targetDate: "",
        category: "career",
      })
      loadData()
    } catch (error) {
      console.error("Error creating goal:", error)
      toast.error("Error al crear la meta")
    }
  }

  const updateEventStatus = async (eventId: string, status: string) => {
    try {
      // Try to update in database
      try {
        const { error } = await supabase.from("calendar_events").update({ event_status: status }).eq("id", eventId)

        if (!error) {
          toast.success("Estado actualizado")
        } else {
          throw error
        }
      } catch (dbError) {
        // Update local state if database fails
        setEvents((prev) => prev.map((event) => (event.id === eventId ? { ...event, status: status as any } : event)))
        toast.success("Estado actualizado (modo demo)")
      }

      loadData()
    } catch (error) {
      console.error("Error updating event status:", error)
      toast.error("Error al actualizar el estado")
    }
  }

  const updateMilestoneStatus = async (milestoneId: string, completed: boolean) => {
    try {
      // Try to update in database
      try {
        const updateData: any = { completed }
        if (completed) {
          updateData.completed_date = new Date().toISOString()
        } else {
          updateData.completed_date = null
        }

        const { error } = await supabase.from("goal_milestones").update(updateData).eq("id", milestoneId)

        if (!error) {
          toast.success("Hito actualizado")
        } else {
          throw error
        }
      } catch (dbError) {
        // Update local state if database fails
        setGoals((prev) =>
          prev.map((goal) => ({
            ...goal,
            milestones: goal.milestones.map((milestone) =>
              milestone.id === milestoneId
                ? {
                    ...milestone,
                    completed,
                    completedDate: completed ? new Date() : undefined,
                  }
                : milestone,
            ),
          })),
        )
        toast.success("Hito actualizado (modo demo)")
      }

      loadData()
    } catch (error) {
      console.error("Error updating milestone:", error)
      toast.error("Error al actualizar el hito")
    }
  }

  const getEventColor = (event: CalendarEvent) => {
    const colors = {
      goal: "#10B981",
      interview: "#F59E0B",
      assessment: "#3B82F6",
      coaching: "#8B5CF6",
      reminder: "#6B7280",
      deadline: "#EF4444",
    }
    return colors[event.eventType] || colors.reminder
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-red-100 text-red-800",
    }
    return colors[priority as keyof typeof colors] || colors.medium
  }

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      missed: "bg-red-100 text-red-800",
      in_progress: "bg-yellow-100 text-yellow-800",
    }
    return colors[status as keyof typeof colors] || colors.pending
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      career: "bg-purple-100 text-purple-800",
      skills: "bg-blue-100 text-blue-800",
      education: "bg-green-100 text-green-800",
      networking: "bg-orange-100 text-orange-800",
    }
    return colors[category as keyof typeof colors] || colors.career
  }

  const eventStyleGetter = (event: CalendarEvent) => {
    return {
      style: {
        backgroundColor: getEventColor(event),
        borderRadius: "5px",
        opacity: event.status === "completed" ? 0.7 : 1,
        color: "white",
        border: "0px",
        display: "block",
      },
    }
  }

  const upcomingEvents = events.filter((event) => event.start >= new Date() && event.status === "pending").slice(0, 5)

  const activeGoals = goals.filter((goal) => goal.status === "active")

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Calendario y Metas</h1>
          <p className="text-muted-foreground">Gestiona tu desarrollo profesional y objetivos de carrera</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isNewEventDialogOpen} onOpenChange={setIsNewEventDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Evento
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nuevo Evento</DialogTitle>
                <DialogDescription>Agrega un nuevo evento a tu calendario</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    placeholder="Título del evento"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    placeholder="Descripción del evento"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="eventDate">Fecha</Label>
                    <Input
                      id="eventDate"
                      type="date"
                      value={newEvent.eventDate}
                      onChange={(e) => setNewEvent({ ...newEvent, eventDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="eventTime">Hora</Label>
                    <Input
                      id="eventTime"
                      type="time"
                      value={newEvent.eventTime}
                      onChange={(e) => setNewEvent({ ...newEvent, eventTime: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="eventType">Tipo</Label>
                    <Select
                      value={newEvent.eventType}
                      onValueChange={(value: any) => setNewEvent({ ...newEvent, eventType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reminder">Recordatorio</SelectItem>
                        <SelectItem value="interview">Entrevista</SelectItem>
                        <SelectItem value="assessment">Evaluación</SelectItem>
                        <SelectItem value="coaching">Coaching</SelectItem>
                        <SelectItem value="goal">Meta</SelectItem>
                        <SelectItem value="deadline">Fecha límite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="priority">Prioridad</Label>
                    <Select
                      value={newEvent.priority}
                      onValueChange={(value: any) => setNewEvent({ ...newEvent, priority: value })}
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
                  <Label htmlFor="relatedModule">Módulo relacionado</Label>
                  <Input
                    id="relatedModule"
                    value={newEvent.relatedModule}
                    onChange={(e) => setNewEvent({ ...newEvent, relatedModule: e.target.value })}
                    placeholder="ej: cv-builder, interview-simulator"
                  />
                </div>
                <Button onClick={createEvent} className="w-full">
                  Crear Evento
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isNewGoalDialogOpen} onOpenChange={setIsNewGoalDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Target className="h-4 w-4 mr-2" />
                Nueva Meta
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nueva Meta</DialogTitle>
                <DialogDescription>Define un nuevo objetivo profesional</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="goalTitle">Título</Label>
                  <Input
                    id="goalTitle"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    placeholder="Título de la meta"
                  />
                </div>
                <div>
                  <Label htmlFor="goalDescription">Descripción</Label>
                  <Textarea
                    id="goalDescription"
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                    placeholder="Descripción de la meta"
                  />
                </div>
                <div>
                  <Label htmlFor="targetDate">Fecha objetivo</Label>
                  <Input
                    id="targetDate"
                    type="date"
                    value={newGoal.targetDate}
                    onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Categoría</Label>
                  <Select
                    value={newGoal.category}
                    onValueChange={(value: any) => setNewGoal({ ...newGoal, category: value })}
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
                <Button onClick={createGoal} className="w-full">
                  Crear Meta
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="calendar">Calendario</TabsTrigger>
          <TabsTrigger value="goals">Metas</TabsTrigger>
          <TabsTrigger value="upcoming">Próximos</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Calendario de Desarrollo Profesional
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ height: "600px" }}>
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: "100%" }}
                  eventPropGetter={eventStyleGetter}
                  onSelectEvent={(event) => {
                    setSelectedEvent(event)
                    setIsEventDialogOpen(true)
                  }}
                  messages={{
                    next: "Siguiente",
                    previous: "Anterior",
                    today: "Hoy",
                    month: "Mes",
                    week: "Semana",
                    day: "Día",
                    agenda: "Agenda",
                    date: "Fecha",
                    time: "Hora",
                    event: "Evento",
                    noEventsInRange: "No hay eventos en este rango",
                    showMore: (total) => `+ Ver más (${total})`,
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <div className="grid gap-4">
            {activeGoals.map((goal) => (
              <Card
                key={goal.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => {
                  setSelectedGoal(goal)
                  setIsGoalDialogOpen(true)
                }}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{goal.title}</CardTitle>
                    <Badge className={getCategoryColor(goal.category)}>{goal.category}</Badge>
                  </div>
                  <CardDescription>{goal.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Progreso</span>
                        <span className="text-sm text-muted-foreground">{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {format(goal.targetDate, "dd/MM/yyyy")}
                      </span>
                      <span className="text-muted-foreground">
                        {goal.milestones.filter((m) => m.completed).length} de {goal.milestones.length} hitos
                      </span>
                    </div>

                    <div className="space-y-2">
                      {goal.milestones.slice(0, 3).map((milestone) => (
                        <div key={milestone.id} className="flex items-center gap-2 text-sm">
                          {milestone.completed ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <Circle className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className={milestone.completed ? "line-through text-muted-foreground" : ""}>
                            {milestone.title}
                          </span>
                        </div>
                      ))}
                      {goal.milestones.length > 3 && (
                        <div className="text-sm text-muted-foreground">+{goal.milestones.length - 3} hitos más</div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Próximos Eventos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        <p className="text-sm text-muted-foreground">{format(event.start, "dd/MM/yyyy HH:mm")}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(event.priority)}>{event.priority}</Badge>
                        <Button size="sm" variant="outline" onClick={() => updateEventStatus(event.id, "completed")}>
                          Completar
                        </Button>
                      </div>
                    </div>
                  ))}
                  {upcomingEvents.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">No hay eventos próximos</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Resumen de Progreso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{activeGoals.length}</div>
                      <div className="text-sm text-muted-foreground">Metas Activas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {goals.filter((g) => g.status === "completed").length}
                      </div>
                      <div className="text-sm text-muted-foreground">Metas Completadas</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Progreso por Categoría</h4>
                    {["career", "skills", "education", "networking"].map((category) => {
                      const categoryGoals = activeGoals.filter((g) => g.category === category)
                      const avgProgress =
                        categoryGoals.length > 0
                          ? categoryGoals.reduce((sum, g) => sum + g.progress, 0) / categoryGoals.length
                          : 0

                      return (
                        <div key={category}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="capitalize">{category}</span>
                            <span>{Math.round(avgProgress)}%</span>
                          </div>
                          <Progress value={avgProgress} className="h-2" />
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Event Details Dialog */}
      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
            <DialogDescription>{format(selectedEvent?.start || new Date(), "dd/MM/yyyy HH:mm")}</DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Descripción</h4>
                <p className="text-sm text-muted-foreground">{selectedEvent.description || "Sin descripción"}</p>
              </div>

              <div className="flex gap-4">
                <div>
                  <h4 className="font-medium mb-1">Tipo</h4>
                  <Badge
                    className={`${
                      selectedEvent.eventType === "interview"
                        ? "bg-orange-100 text-orange-800"
                        : selectedEvent.eventType === "assessment"
                          ? "bg-blue-100 text-blue-800"
                          : selectedEvent.eventType === "coaching"
                            ? "bg-purple-100 text-purple-800"
                            : selectedEvent.eventType === "goal"
                              ? "bg-green-100 text-green-800"
                              : selectedEvent.eventType === "deadline"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {selectedEvent.eventType}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Prioridad</h4>
                  <Badge className={getPriorityColor(selectedEvent.priority)}>{selectedEvent.priority}</Badge>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Estado</h4>
                  <Badge className={getStatusColor(selectedEvent.status)}>{selectedEvent.status}</Badge>
                </div>
              </div>

              {selectedEvent.relatedModule && (
                <div>
                  <h4 className="font-medium mb-1">Módulo relacionado</h4>
                  <p className="text-sm text-muted-foreground">{selectedEvent.relatedModule}</p>
                </div>
              )}

              <div className="flex gap-2">
                {selectedEvent.status === "pending" && (
                  <Button
                    onClick={() => {
                      updateEventStatus(selectedEvent.id, "completed")
                      setIsEventDialogOpen(false)
                    }}
                    className="flex-1"
                  >
                    Marcar como Completado
                  </Button>
                )}
                {selectedEvent.status === "pending" && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      updateEventStatus(selectedEvent.id, "in_progress")
                      setIsEventDialogOpen(false)
                    }}
                    className="flex-1"
                  >
                    En Progreso
                  </Button>
                )}
                {selectedEvent.status !== "completed" && (
                  <Button
                    variant="destructive"
                    onClick={() => {
                      updateEventStatus(selectedEvent.id, "missed")
                      setIsEventDialogOpen(false)
                    }}
                    className="flex-1"
                  >
                    Marcar como Perdido
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Goal Details Dialog */}
      <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedGoal?.title}</DialogTitle>
            <DialogDescription>
              Meta objetivo: {selectedGoal && format(selectedGoal.targetDate, "dd/MM/yyyy")}
            </DialogDescription>
          </DialogHeader>
          {selectedGoal && (
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">Descripción</h4>
                <p className="text-sm text-muted-foreground">{selectedGoal.description || "Sin descripción"}</p>
              </div>

              <div className="flex gap-4">
                <div>
                  <h4 className="font-medium mb-1">Categoría</h4>
                  <Badge className={getCategoryColor(selectedGoal.category)}>{selectedGoal.category}</Badge>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Estado</h4>
                  <Badge
                    className={
                      selectedGoal.status === "active"
                        ? "bg-green-100 text-green-800"
                        : selectedGoal.status === "completed"
                          ? "bg-blue-100 text-blue-800"
                          : selectedGoal.status === "paused"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                    }
                  >
                    {selectedGoal.status}
                  </Badge>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Progreso General</h4>
                  <span className="text-sm font-medium">{selectedGoal.progress}%</span>
                </div>
                <Progress value={selectedGoal.progress} className="h-3" />
              </div>

              <div>
                <h4 className="font-medium mb-3">
                  Hitos ({selectedGoal.milestones.filter((m) => m.completed).length}/{selectedGoal.milestones.length})
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {selectedGoal.milestones
                    .sort((a, b) => a.orderIndex - b.orderIndex)
                    .map((milestone) => (
                      <div key={milestone.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <button
                          onClick={() => updateMilestoneStatus(milestone.id, !milestone.completed)}
                          className="flex-shrink-0"
                        >
                          {milestone.completed ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground hover:text-primary" />
                          )}
                        </button>
                        <div className="flex-1">
                          <h5
                            className={`font-medium ${milestone.completed ? "line-through text-muted-foreground" : ""}`}
                          >
                            {milestone.title}
                          </h5>
                          {milestone.description && (
                            <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                          )}
                          {milestone.completed && milestone.completedDate && (
                            <p className="text-xs text-green-600 mt-1">
                              Completado: {format(milestone.completedDate, "dd/MM/yyyy")}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  {selectedGoal.milestones.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">No hay hitos definidos para esta meta</p>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1" disabled>
                  Editar Meta
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent" disabled>
                  Agregar Hito
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
