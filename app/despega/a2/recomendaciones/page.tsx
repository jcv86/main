"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { getDemoUser } from "@/lib/auth/demo-user"
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

      // Match the demo fallback used across A1/A3/A4 journey pages.
      let userId = user?.id
      if (!userId) {
        const demoUser = getDemoUser()
        if (!demoUser) {
          router.push("/auth/signin")
          return
        }
        userId = demoUser.id
      }

      // Load user profile
      const { data: profileData } = await supabase
        .from("despega_user_profiles")
        .select("*")
        .eq("user_id", userId)
        .single()

      if (profileData) {
        setUserProfile(profileData)
      }

      // Load A1 results
      const { data: a1Data } = await supabase
        .from("despega_a1_test_results")
        .select("*")
        .eq("user_id", userId)
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
        icon: "",
        color: "from-yellow-500500",
        borderColor: "border-yellow/20 dark:border-yellow",
        bgColor: "bg-yellow/5 dark:bg-yellow/20",
        textColor: "text-yellow dark:text-yellow/10",
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
        icon: "",
        color: "from-green",
        borderColor: "border-green/20 dark:border-green",
        bgColor: "bg-green/5 dark:bg-green/20",
        textColor: "text-green dark:text-green/10",
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
        icon: "",
        color: "from-red/50500",
        borderColor: "border-red/20 dark:border-pink-800",
        bgColor: "bg-red/5 dark:bg-red/20",
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
        name: "Plan Ejecutivo",
        description: "Ejecuta con precisión y consistencia tu estrategia",
        icon: "📋",
        color: "from-purple/50/50",
        borderColor: "border-purple/30 dark:border-purple",
        bgColor: "bg-purple/5 dark:bg-purple/20",
        textColor: "text-purple dark:text-purple/10",
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
      <div className="min-h-screen bg-background">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green"></div>
          <p className="mt-4 text-muted-foreground dark:text-muted-foreground">Personalizando tus rutas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto py-12 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <Badge variant="outline" className="mx-auto">
            Rutas Personalizadas para Ti
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-muted/90 dark:text-muted/5">
            Tus Rutas Recomendadas
          </h1>
          <p className="text-lg text-muted-foreground dark:text-muted-foreground max-w-2xl mx-auto">
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
                  : "border-muted/20 dark:border-card"
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
                          <h3 className="font-bold text-lg text-muted/90 dark:text-muted/5">
                            {route.name}
                          </h3>
                          <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                            {route.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className={`text-2xl font-bold ${route.textColor}`}>
                        {route.matchScore}%
                      </div>
                      <p className="text-xs text-muted-foreground dark:text-muted-foreground">
                        Match para ti
                      </p>
                    </div>
                  </div>

                  {/* Match Score Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-muted-foreground dark:text-muted-foreground">
                        Alineación con tu perfil
                      </span>
                      <span className="text-xs text-muted-foreground dark:text-muted-foreground">
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
                      <p className="text-xs font-semibold text-muted-foreground dark:text-muted-foreground mb-2">
                        Duración
                      </p>
                      <p className="text-sm text-muted/90 dark:text-muted/5 font-medium">
                        {route.duration}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground dark:text-muted-foreground mb-2">
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
                    className={`w-full ${`}
                      selectedRoute === route.id
                        ? "bg-green/80 hover:bg-green/70 dark:bg-green dark:hover:bg-green"
                        : ""`}
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
        <Card className="border-0 bg-yellow/5 dark:bg-amber-900/20 border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground dark:text-white/85">
              <strong> Consejo:</strong> Todas estas rutas son poderosas. Elige la que resuena más con tu objetivo inmediato. Puedes explorar otras después.
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
