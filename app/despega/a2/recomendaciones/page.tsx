"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, Zap } from "lucide-react"

interface RouteRecommendation {
  id: string
  name: string
  description: string
  icon: string
  color: string
  borderColor: string
  bgColor: string
  textColor: string
  duration: string
  skills: string[]
  matchScore: number
  why: string
}

export default function RecomendacionesPage() {
  const [loading, setLoading] = useState(true)
  const [routes, setRoutes] = useState<RouteRecommendation[]>([])
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [a1Results, setA1Results] = useState<any>(null)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push("/login")
        return
      }

      // Load user profile
      const { data: profileData } = await supabase
        .from("despega_user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single()

      if (profileData) {
        setUserProfile(profileData)
      }

      // Load A1 results
      const { data: a1Data } = await supabase
        .from("despega_a1_test_results")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (a1Data) {
        setA1Results(a1Data)
      }

      // Generate route recommendations based on A1 and selected camino
      const recommendedRoutes = generateRouteRecommendations(a1Data, profileData?.a2_camino || "hibrido")
      setRoutes(recommendedRoutes)

      setLoading(false)
    }

    loadData()
  }, [supabase, router])

  const generateRouteRecommendations = (a1Data: any, camino: string): RouteRecommendation[] => {
    // Calcular scores para personalizar recomendaciones
    const energiaScore = a1Data?.score_energia || 50
    const enfoqueScore = a1Data?.score_enfoque || 50
    const relacionesScore = a1Data?.score_relaciones || 50
    const planScore = a1Data?.score_plan_ejecutivo || 50

    const allRoutes = [
      {
        id: "energia",
        name: "Energía y Vitalidad",
        description: "Optimiza tu energía física y mental para un rendimiento sostenible",
        icon: "⚡",
        color: "from-yellow-500 to-amber-500",
        borderColor: "border-yellow-200 dark:border-yellow-800",
        bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
        textColor: "text-yellow-900 dark:text-yellow-100",
        duration: "30-90 días",
        skills: ["Gestión de energía", "Sueño reparador", "Nutrición inteligente", "Estrés"],
        matchScore: Math.round((100 - energiaScore) * 0.7 + 30),
        why: energiaScore < 40 
          ? "Tu energía es un área de oportunidad. Esta ruta la transforma."
          : "Consolidar tu energía te abre más puertas."
      },
      {
        id: "enfoque",
        name: "Enfoque y Productividad",
        description: "Domina tu atención y logra resultados con precisión",
        icon: "🎯",
        color: "from-green-500 to-emerald-500",
        borderColor: "border-green-200 dark:border-green-800",
        bgColor: "bg-green-50 dark:bg-green-900/20",
        textColor: "text-green-900 dark:text-green-100",
        duration: "30-60 días",
        skills: ["Deep Work", "Priorización", "Bloques de tiempo", "Gestión de distracciones"],
        matchScore: Math.round((100 - enfoqueScore) * 0.7 + 30),
        why: enfoqueScore < 40
          ? "El enfoque es tu apalancador. Todo mejora cuando lo logras."
          : "Tu enfoque es fuerte. Refinarlo te hace imparable."
      },
      {
        id: "relaciones",
        name: "Relaciones Significativas",
        description: "Construye conexiones profundas y comunicación efectiva",
        icon: "🤝",
        color: "from-pink-500 to-rose-500",
        borderColor: "border-pink-200 dark:border-pink-800",
        bgColor: "bg-pink-50 dark:bg-pink-900/20",
        textColor: "text-pink-900 dark:text-pink-100",
        duration: "60-90 días",
        skills: ["Comunicación", "Empatía", "Resolución de conflictos", "Liderazgo relacional"],
        matchScore: Math.round((100 - relacionesScore) * 0.7 + 30),
        why: relacionesScore < 40
          ? "Las relaciones son tu fundamento. Invertir aquí lo cambia todo."
          : "Tus relaciones son sólidas. Ahora harlas más estratégicas."
      },
      {
        id: "plan_ejecutivo",
        name: "Plan y Ejecución",
        description: "Ejecuta con precisión y consistencia tu estrategia",
        icon: "📋",
        color: "from-purple-500 to-indigo-500",
        borderColor: "border-purple-200 dark:border-purple-800",
        bgColor: "bg-purple-50 dark:bg-purple-900/20",
        textColor: "text-purple-900 dark:text-purple-100",
        duration: "30-90 días",
        skills: ["Planificación", "Decisiones estratégicas", "Rituales", "Revisión semanal"],
        matchScore: Math.round((100 - planScore) * 0.7 + 30),
        why: planScore < 40
          ? "Necesitas estructura. Esta ruta te la proporciona sistemáticamente."
          : "Tu plan es fuerte. Ahora escalarlo con consistencia."
      }
    ]

    // Filtrar según camino
    let filtered = allRoutes
    if (camino === "persona") {
      filtered = allRoutes.filter(r => ["energia", "relaciones"].includes(r.id))
    } else if (camino === "profesional") {
      filtered = allRoutes.filter(r => ["enfoque", "plan_ejecutivo"].includes(r.id))
    }

    // Ordenar por match score descendente y tomar top 3
    return filtered
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3)
      .map(route => ({
        ...route,
        matchScore: Math.min(route.matchScore, 95)
      }))
  }

  const handleSelectRoute = async (routeId: string) => {
    if (!userProfile) return

    setSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Save route selection
      await supabase
        .from("despega_user_profiles")
        .update({ a2_route_selected: routeId })
        .eq("user_id", user.id)

      setSelectedRoute(routeId)
      
      // Navigate to mission definition
      setTimeout(() => {
        router.push("/despega/a2/mision-90-dias")
      }, 300)
    } catch (error) {
      console.error("Error saving route:", error)
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Personalizando tus rutas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 overflow-y-auto">
      <div className="max-w-4xl mx-auto py-12 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <Badge variant="outline" className="mx-auto">
            Rutas Personalizadas para Ti
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-50">
            Tus Rutas Recomendadas
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Basadas en tu patrón A1 y tu objetivo. Selecciona una para comenzar.
          </p>
        </div>

        {/* Route Cards */}
        <div className="space-y-4">
          {routes.map((route) => (
            <Card
              key={route.id}
              className={`cursor-pointer transition-all border-2 overflow-hidden hover:shadow-md ${
                selectedRoute === route.id
                  ? `${route.borderColor} shadow-lg`
                  : "border-slate-200 dark:border-slate-700"
              }`}
              onClick={() => handleSelectRoute(route.id)}
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header Row */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{route.icon}</span>
                        <div>
                          <h3 className="font-bold text-lg text-slate-900 dark:text-slate-50">
                            {route.name}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {route.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className={`text-2xl font-bold ${route.textColor}`}>
                        {route.matchScore}%
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Match para ti
                      </p>
                    </div>
                  </div>

                  {/* Match Score Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                        Alineación con tu perfil
                      </span>
                      <span className="text-xs text-slate-600 dark:text-slate-400">
                        {route.matchScore}%
                      </span>
                    </div>
                    <Progress value={route.matchScore} className="h-2" />
                  </div>

                  {/* Why Recommended */}
                  <div className={`p-3 rounded-lg ${route.bgColor}`}>
                    <p className={`text-sm ${route.textColor}`}>
                      <strong>Por qué recomendada:</strong> {route.why}
                    </p>
                  </div>

                  {/* Details Grid */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                        Duración
                      </p>
                      <p className="text-sm text-slate-900 dark:text-slate-50 font-medium">
                        {route.duration}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                        Habilidades a Desarrollar
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {route.skills.map((skill, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <Button
                    onClick={() => handleSelectRoute(route.id)}
                    disabled={submitting}
                    className={`w-full ${
                      selectedRoute === route.id
                        ? "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                        : ""
                    }`}
                  >
                    {selectedRoute === route.id ? (
                      <>
                        Continuar con esta Ruta <ArrowRight className="ml-2 w-4 h-4" />
                      </>
                    ) : (
                      <>
                        Explorar esta Ruta <ArrowRight className="ml-2 w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Box */}
        <Card className="border-0 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              <strong>💡 Consejo:</strong> Todas estas rutas son poderosas. Elige la que resuena más con tu objetivo inmediato. Puedes explorar otras después.
            </p>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex gap-3 pt-4">
          <Link href="/despega/a2/camino" className="flex-1">
            <Button variant="outline" className="w-full">
              Cambiar Camino
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
