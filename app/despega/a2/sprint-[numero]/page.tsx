"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useCoach } from "@/contexts/coach-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { ArrowRight, CheckCircle, Circle, Zap, BookOpen, Calendar } from "lucide-react"

interface MicroAction {
  id: string
  title: string
  description: string
  day: number
  duration: string
  difficulty: "fácil" | "medio" | "desafiante"
  completed: boolean
}

interface Sprint {
  number: number
  startDay: number
  endDay: number
  theme: string
  description: string
}

export default function SprintViewerPage() {
  const params = useParams()
  const sprintNumber = parseInt(params.numero as string) || 1
  const { updateProgress } = useCoach()
  
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [mission, setMission] = useState<any>(null)
  const [actions, setActions] = useState<MicroAction[]>([])
  const [completedCount, setCompletedCount] = useState(0)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push("/login")
        return
      }

      // Load user profile with mission
      const { data: profileData } = await supabase
        .from("despega_user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single()

      if (profileData?.a2_mission_id) {
        setUserProfile(profileData)

        // Load mission
        const { data: missionData } = await supabase
          .from("a2_user_missions")
          .select("*")
          .eq("id", profileData.a2_mission_id)
          .single()

        if (missionData) {
          setMission(missionData)
          
          // Generate micro-actions for this sprint
          const sprintActions = generateSprintActions(sprintNumber, missionData.route_id)
          setActions(sprintActions)
          setCompletedCount(sprintActions.filter(a => a.completed).length)
        }
      }

      setLoading(false)
    }

    loadData()
  }, [supabase, router, sprintNumber])

  const generateSprintActions = (sprintNum: number, routeId: string): MicroAction[] => {
    const baseActions: Record<string, MicroAction[]> = {
      energia: [
        {
          id: "e1",
          title: "Establece tu hora de sueño",
          description: "Elige una hora fija para dormir. Esta será tu ancla.",
          day: 1,
          duration: "10 min",
          difficulty: "fácil",
          completed: false
        },
        {
          id: "e2",
          title: "Revisa tu rutina matutina actual",
          description: "Documenta: cuándo despiertas, qué haces en los primeros 30 min, cómo te sientes",
          day: 2,
          duration: "15 min",
          difficulty: "fácil",
          completed: false
        },
        {
          id: "e3",
          title: "Deja el teléfono 30 min antes de dormir",
          description: "Experimenta con la luz azul off. Anota cómo duermes.",
          day: 3,
          duration: "1 min",
          difficulty: "fácil",
          completed: false
        },
        {
          id: "e4",
          title: "Crea un ritual de 5 min antes de dormir",
          description: "Puede ser respiración, lectura, meditación. Lo importante es la consistencia.",
          day: 4,
          duration: "20 min",
          difficulty: "medio",
          completed: false
        },
        {
          id: "e5",
          title: "Mide tu energía a las 10am",
          description: "En una escala 1-10, ¿cómo sientes tu energía? Registra.",
          day: 5,
          duration: "2 min",
          difficulty: "fácil",
          completed: false
        },
      ],
      enfoque: [
        {
          id: "f1",
          title: "Identifica tu hora de mayor enfoque",
          description: "¿Cuándo es tu pico de concentración? ¿Mañana, tarde, noche?",
          day: 1,
          duration: "10 min",
          difficulty: "fácil",
          completed: false
        },
        {
          id: "f2",
          title: "Crea tu primer bloque de Deep Work",
          description: "Protege 90 minutos sin interrupciones. Sin email, sin Slack, sin nada.",
          day: 2,
          duration: "90 min",
          difficulty: "desafiante",
          completed: false
        },
        {
          id: "f3",
          title: "Documenta tus distracciones",
          description: "¿Qué te saca del enfoque? Notifications, personas, pensamientos. Sé específico.",
          day: 3,
          duration: "15 min",
          difficulty: "medio",
          completed: false
        },
        {
          id: "f4",
          title: "Silencia todo durante 2 horas",
          description: "Teléfono en otro cuarto. Experimenta el silencio.",
          day: 4,
          duration: "120 min",
          difficulty: "desafiante",
          completed: false
        },
        {
          id: "f5",
          title: "Review semanal: qué funcionó",
          description: "Anota: horas de enfoque totales, proyectos completados, cómo te sientes.",
          day: 7,
          duration: "20 min",
          difficulty: "medio",
          completed: false
        },
      ],
      relaciones: [
        {
          id: "r1",
          title: "Lista a las personas importantes",
          description: "¿Quién te importa? ¿Con quién quieres conectar más?",
          day: 1,
          duration: "15 min",
          difficulty: "fácil",
          completed: false
        },
        {
          id: "r2",
          title: "Ten una conversación real",
          description: "Sin teléfono. 20+ minutos. Pregunta genuina, escucha real.",
          day: 2,
          duration: "30 min",
          difficulty: "medio",
          completed: false
        },
        {
          id: "r3",
          title: "Haz un reconocimiento específico",
          description: "Dice a alguien qué aprecas de él/ella. Sé concreto.",
          day: 3,
          duration: "5 min",
          difficulty: "fácil",
          completed: false
        },
        {
          id: "r4",
          title: "Resuelve un pequeño conflicto",
          description: "Si hay tensión con alguien, abreabr conversación con curiosidad.",
          day: 4,
          duration: "30 min",
          difficulty: "desafiante",
          completed: false
        },
        {
          id: "r5",
          title: "Reflexión: cómo se sintieron las conexiones",
          description: "¿Qué cambió en tus relaciones? ¿Qué aprendiste?",
          day: 7,
          duration: "15 min",
          difficulty: "medio",
          completed: false
        },
      ],
      plan_ejecutivo: [
        {
          id: "p1",
          title: "Mapea tu situación actual",
          description: "¿Dónde estás hoy? Sé honestos con los números y contexto.",
          day: 1,
          duration: "30 min",
          difficulty: "medio",
          completed: false
        },
        {
          id: "p2",
          title: "Define tus 3 resultados clave para el sprint",
          description: "¿Qué si logras 3 cosas? Todo lo demás es bonus.",
          day: 2,
          duration: "20 min",
          difficulty: "desafiante",
          completed: false
        },
        {
          id: "p3",
          title: "Crea tu primer plan semanal",
          description: "¿Qué necesitas hacer esta semana? ¿En qué días? ¿Cuánto tiempo?",
          day: 3,
          duration: "45 min",
          difficulty: "desafiante",
          completed: false
        },
        {
          id: "p4",
          title: "Revisa y ajusta basado en realidad",
          description: "¿Es realista? ¿Qué necesitas cambiar?",
          day: 5,
          duration: "15 min",
          difficulty: "medio",
          completed: false
        },
        {
          id: "p5",
          title: "Rituales de ejecución",
          description: "¿Cuándo revisar progreso? ¿Cuándo ajustar? Fija tus rituales.",
          day: 7,
          duration: "20 min",
          difficulty: "medio",
          completed: false
        },
      ]
    }

    return (baseActions[routeId] || baseActions.energia).map(action => ({
      ...action,
      completed: Math.random() < 0.3 // Simular algunas completadas
    }))
  }

  const toggleAction = async (actionId: string) => {
    const updated = actions.map(a =>
      a.id === actionId ? { ...a, completed: !a.completed } : a
    )
    setActions(updated)
    setCompletedCount(updated.filter(a => a.completed).length)

    // Persist to database
    const { data: { user } } = await supabase.auth.getUser()
    if (user && mission) {
      console.log('[v0] Action completed, updating database and coach...')
      
      await supabase
        .from("a2_user_daily_actions")
        .upsert({
          user_id: user.id,
          mission_id: mission.id,
          action_id: actionId,
          completed: !actions.find(a => a.id === actionId)?.completed
        })

      // Update coach with new progress
      console.log('[v0] Triggering coach update...')
      await updateProgress()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green"></div>
          <p className="mt-4 text-muted-foreground dark:text-muted-foreground">Cargando tu sprint...</p>
        </div>
      </div>
    )
  }

  const sprint: Sprint = {
    number: sprintNumber,
    startDay: (sprintNumber - 1) * 30 + 1,
    endDay: sprintNumber * 30,
    theme: `Sprint ${sprintNumber}: ${sprintNumber === 1 ? "Fundamentos" : sprintNumber === 2 ? "Profundización" : "Consolidación"}`,
    description: sprintNumber === 1 
      ? "Establece los fundamentos y descubre qué funciona para ti."
      : sprintNumber === 2
      ? "Profundiza en lo que funciona y expande tu capacidad."
      : "Consolida todo en hábitos duraderos y prepárate para el siguiente nivel."
  }

  const progressPercentage = Math.round((completedCount / actions.length) * 100)
  const difficultyColors = {
    fácil: "bg-green/10 dark:bg-green/30 text-green dark:text-green/20",
    medio: "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200",
    desafiante: "bg-[rgba(80,160,170,0.5)]/10 dark:bg-[rgba(80,160,170,0.5)]/30 text-[rgb(80,160,170)] dark:text-[rgb(80,160,170)]/20"
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto py-12 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-bold text-muted/90 dark:text-muted/5">
                {sprint.theme}
              </h1>
              <p className="text-lg text-muted-foreground dark:text-muted-foreground">
                Días {sprint.startDay}-{sprint.endDay} de tu transformación
              </p>
            </div>
            <Badge className="text-base px-4 py-2 h-fit">
              {progressPercentage}% completado
            </Badge>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-muted/90 dark:text-muted/5">
                Progreso del Sprint
              </span>
              <span className="text-muted-foreground dark:text-muted-foreground">
                {completedCount} de {actions.length} acciones
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>

        {/* Sprint Info */}
        <Card className="border-0 shadow-md bg-white dark:bg-background">
          <CardContent className="p-6">
            <p className="text-muted-foreground dark:text-white/85 leading-relaxed">
              {sprint.description}
            </p>
          </CardContent>
        </Card>

        {/* Micro-Actions List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-muted/90 dark:text-muted/5 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green" />
            Tu Checklist de Acciones
          </h2>

          <div className="space-y-3">
            {actions.map((action) => (
              <Card
                key={action.id}
                className={`border-0 transition-all cursor-pointer hover:shadow-md ${
                  action.completed
                    ? "bg-green/5 dark:bg-green/10 border-l-4 border-l-green-500"
                    : "bg-white dark:bg-card"
                }`}
                onClick={() => toggleAction(action.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <div className="flex-shrink-0 pt-1">
                      <div
                        className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                          action.completed
                            ? "bg-green border-green"
                            : "border-muted/30 dark:border-muted/60"
                        }`}
                      >
                        {action.completed && (
                          <CheckCircle className="w-5 h-5 text-white" />
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold text-base ${
                        action.completed
                          ? "line-through text-muted-foreground dark:text-muted-foreground"
                          : "text-muted/90 dark:text-muted/5"
                      }`}>
                        {action.title}
                      </h3>
                      <p className={`text-sm mt-1 ${
                        action.completed
                          ? "text-muted-foreground dark:text-muted-foreground"
                          : "text-muted-foreground dark:text-muted-foreground"
                      }`}>
                        {action.description}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center gap-2 mt-3 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          Día {action.day}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          ⏱️ {action.duration}
                        </Badge>
                        <Badge className={`text-xs ${difficultyColors[action.difficulty]}`}>
                          {action.difficulty}
                        </Badge>
                      </div>
                    </div>

                    {/* Right Icon */}
                    <div className="flex-shrink-0">
                      {action.completed ? (
                        <CheckCircle className="w-6 h-6 text-green" />
                      ) : (
                        <Circle className="w-6 h-6 text-muted-foreground dark:text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Check-in Prompt */}
        {sprintNumber === 1 && (
          <Card className="border-0 shadow-md bg-background">
            <CardContent className="p-6 space-y-3">
              <h3 className="font-bold text-lg text-muted/90 dark:text-muted/5 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Reflexión Semanal
              </h3>
              <p className="text-sm text-muted-foreground dark:text-white/85">
                Al final de cada semana, reflexiona: ¿Qué salió bien? ¿Qué fue más difícil? ¿Qué aprendiste?
              </p>
              <Button variant="outline" asChild>
                <Link href="/despega/a2/bitacora">
                  Ir a tu Bitácora
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex gap-3 pt-4">
          <Link href="/despega/a2/dashboard" className="flex-1">
            <Button variant="outline" className="w-full">
              Ver Dashboard
            </Button>
          </Link>
          {sprintNumber < 3 && (
            <Link href={`/despega/a2/sprint-${sprintNumber + 1}`} className="flex-1">
              <Button className="w-full">
                Siguiente Sprint <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
