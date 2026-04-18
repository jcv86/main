"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, CheckCircle } from "lucide-react"

const ROUTE_INFO = {
  energia: {
    name: "Energía y Vitalidad",
    icon: "⚡",
    color: "from-yellow-500 to-amber-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    textColor: "text-yellow-900 dark:text-yellow-100",
  },
  enfoque: {
    name: "Enfoque y Productividad",
    icon: "🎯",
    color: "from-green to-green",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    textColor: "text-green-900 dark:text-green-100",
  },
  relaciones: {
    name: "Relaciones Significativas",
    icon: "🤝",
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-50 dark:bg-pink-900/20",
    textColor: "text-pink-900 dark:text-pink-100",
  },
  plan_ejecutivo: {
    name: "Plan Ejecutivo",
    icon: "📋",
    color: "from-purple-500 to-indigo-500",
    bgColor: "bg-purple/5 dark:bg-purple-900/20",
    textColor: "text-purple-900 dark:text-purple-100",
  },
}

export default function Mision90DiasPage() {
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [routeSelected, setRouteSelected] = useState<string>("energia")
  const [objective, setObjective] = useState("")
  const [constraints, setConstraints] = useState("")
  const [successMetric, setSuccessMetric] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push("/auth/signin")
        return
      }

      const { data: profileData } = await supabase
        .from("despega_user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single()

      if (profileData) {
        setUserProfile(profileData)
        if (profileData.a2_route_selected) {
          setRouteSelected(profileData.a2_route_selected)
        }
      }

      setLoading(false)
    }

    loadData()
  }, [supabase, router])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!objective.trim()) {
      newErrors.objective = "Tu objetivo es requerido"
    } else if (objective.length < 10) {
      newErrors.objective = "Tu objetivo debe ser más específico"
    }

    if (!successMetric.trim()) {
      newErrors.successMetric = "Define cómo sabrás que tuviste éxito"
    } else if (successMetric.length < 10) {
      newErrors.successMetric = "Sé más específico con tu criterio de éxito"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const missionData = {
        route_id: routeSelected,
        objective: objective.trim(),
        constraints: constraints.trim() || null,
        success_metric: successMetric.trim(),
        status: "active",
        created_at: new Date().toISOString(),
      }

      // Create mission
      const { data: mission, error: missionError } = await supabase
        .from("a2_user_missions")
        .insert({
          user_id: user.id,
          ...missionData
        })
        .select()
        .single()

      if (missionError) throw missionError

      // Update profile with mission reference
      await supabase
        .from("despega_user_profiles")
        .update({ a2_mission_id: mission.id })
        .eq("user_id", user.id)

      // CONEXIÓN A2→A3: Asignar entrenamientos automáticamente
      console.log("[v0] Starting A2→A3 connection...")
      try {
        const assignResponse = await fetch("/rest/assign-trainings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.id,
            a2_theme: routeSelected,
            a2_mission_id: mission.id,
          }),
        })

        if (assignResponse.ok) {
          const assignData = await assignResponse.json()
          console.log("[v0] A3 trainings assigned:", assignData.assignments_count)
        } else {
          console.warn("[v0] Failed to assign trainings (non-critical)")
        }
      } catch (error) {
        console.warn("[v0] Error in A2→A3 connection (non-critical):", error)
      }

      // Navigate to sprint view
      setTimeout(() => {
        router.push("/despega/a2/sprint-1")
      }, 300)
    } catch (error) {
      console.error("Error creating mission:", error)
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Preparando tu misión...</p>
        </div>
      </div>
    )
  }

  const routeInfo = ROUTE_INFO[routeSelected as keyof typeof ROUTE_INFO] || ROUTE_INFO.energia

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 overflow-y-auto">
      <div className="max-w-3xl mx-auto py-12 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <Badge variant="outline" className="mx-auto">
            Define tu Objetivo
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-50">
            Tu Misión 90 Días
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Sé específico. La claridad es poder.
          </p>
        </div>

        {/* Route Display */}
        <div className={`p-6 rounded-[28px] bg-gradient-to-r ${routeInfo.color} text-white`}>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{routeInfo.icon}</span>
            <div>
              <p className="text-sm opacity-90 font-medium">Ruta Seleccionada</p>
              <h2 className="text-2xl font-bold">{routeInfo.name}</h2>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Objective */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">¿Cuál es tu objetivo específico?</CardTitle>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                No "mejorar energía", sino "dormir 8 horas diarias y despertar sin fatiga"
              </p>
            </CardHeader>
            <CardContent className="space-y-2">
              <Textarea
                placeholder="Ej: Establecer una rutina de sueño de 8 horas sin medicamentos, mejorando mi energía matutina para ser más productivo en el trabajo..."
                value={objective}
                onChange={(e) => {
                  setObjective(e.target.value)
                  if (errors.objective) setErrors({ ...errors, objective: "" })
                }}
                className="min-h-24 resize-none"
              />
              {errors.objective && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.objective}</p>
              )}
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {objective.length} caracteres | Mínimo: 10 caracteres
              </p>
            </CardContent>
          </Card>

          {/* Constraints */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">¿Cuáles son tus restricciones o contexto?</CardTitle>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                Opcional. Ej: horario de trabajo, limitaciones físicas, etc.
              </p>
            </CardHeader>
            <CardContent className="space-y-2">
              <Textarea
                placeholder="Ej: Trabajo 8am-6pm, viajo una semana al mes, tengo lesión en espalda..."
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                className="min-h-20 resize-none"
              />
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Esto nos ayuda a personalizar aún más tu camino
              </p>
            </CardContent>
          </Card>

          {/* Success Metric */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">¿Cómo sabrás que tuviste éxito?</CardTitle>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                Define métricas claras: números, comportamientos, sentimientos
              </p>
            </CardHeader>
            <CardContent className="space-y-2">
              <Textarea
                placeholder="Ej: Dormiré 8+ horas 5 noches a la semana, me despertaré sin alarma, tendré energía hasta las 3pm, mis colegas notarán mi mejor humor..."
                value={successMetric}
                onChange={(e) => {
                  setSuccessMetric(e.target.value)
                  if (errors.successMetric) setErrors({ ...errors, successMetric: "" })
                }}
                className="min-h-24 resize-none"
              />
              {errors.successMetric && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.successMetric}</p>
              )}
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {successMetric.length} caracteres | Mínimo: 10 caracteres
              </p>
            </CardContent>
          </Card>

          {/* Info Box */}
          <Card className="border-0 bg-blue/5 dark:bg-blue-900/20 border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <p className="text-sm text-slate-700 dark:text-slate-300">
                <strong>📅 Estructura de los 90 días:</strong> Dividiremos esta misión en 3 sprints de 30 días cada uno. Cada semana tendrá un desafío y micro-acciones específicas.
              </p>
            </CardContent>
          </Card>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Link href="/despega/a2/recomendaciones" className="flex-1">
              <Button variant="outline" className="w-full" type="button">
                Cambiar Ruta
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creando...
                </>
              ) : (
                <>
                  Confirmar Misión <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
