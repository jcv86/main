"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface UserProfile {
  camino_persona_active: boolean
  camino_profesional_active: boolean
  camino_foco: string
  onboarding_completed: boolean
  a1_test_completed: boolean
}

interface PilarProgress {
  pilar: string
  progreso: number
  score: number
  ciclo_actual: string
  ciclo_dia: number
}

interface Rankings {
  score_general: number
  rank_general: number
  score_pilar_a1: number
  score_pilar_a2: number
  score_aterrizaje: number
  score_base: number
}

interface A1Results {
  score_energia: number
  score_enfoque: number
  score_relaciones: number
  score_plan_ejecutivo: number
  nivel_detectado: string
}

const PILARES = [
  {
    id: "a1_cerebral",
    name: "A1: El Ritual",
    description: "Descubre quién eres ahora",
    color: "bg-blue-500",
    lightColor: "bg-blue-100",
    textColor: "text-blue-800",
    href: "/despega/a1-cerebral",
    icon: "🔄",
  },
  {
    id: "a2_rutas",
    name: "A2: Rutas de Transformación",
    description: "Tu motor de avance: 90 días de acciones personalizadas",
    color: "bg-green-500",
    lightColor: "bg-green-100",
    textColor: "text-green-800",
    href: "/despega/a2/intro",
    icon: "🧭",
  },
  {
    id: "a4_realidad",
    name: "A4: La Realidad",
    description: "Dónde vive tu identidad - Noticias, Coaching, Plan",
    color: "bg-cyan-500",
    lightColor: "bg-cyan-100",
    textColor: "text-cyan-800",
    href: "/despega/a4-base",
    icon: "🌍",
  },
  {
    id: "aterrizaje",
    name: "Aterrizaje",
    description: "CV, LinkedIn, Entrevistas, Negociación",
    color: "bg-orange-500",
    lightColor: "bg-orange-100",
    textColor: "text-orange-800",
    href: "/despega/aterrizaje",
    icon: "🎯",
  },
]

export default function DespegaHub() {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [pilaresProgress, setPilaresProgress] = useState<PilarProgress[]>([])
  const [rankings, setRankings] = useState<Rankings | null>(null)
  const [a1Results, setA1Results] = useState<A1Results | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push("/login")
        return
      }

      // Check if onboarding is completed
      const { data: profileData } = await supabase
        .from("despega_user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single()

      if (!profileData || !profileData.onboarding_completed) {
        router.push("/despega/onboarding")
        return
      }

      setProfile(profileData)

      // Load pilares progress
      const { data: pilaresData } = await supabase
        .from("despega_pilar_progress")
        .select("*")
        .eq("user_id", user.id)

      if (pilaresData) {
        setPilaresProgress(pilaresData)
      }

      // Load rankings
      const { data: rankingsData } = await supabase
        .from("despega_rankings")
        .select("*")
        .eq("user_id", user.id)
        .single()

      if (rankingsData) {
        setRankings(rankingsData)
      }

      // Load A1 test results
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

      setLoading(false)
    }

    loadData()
  }, [supabase, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Cargando tu dashboard...</p>
        </div>
      </div>
    )
  }

  const getPilarProgress = (pilarId: string) => {
    return pilaresProgress.find(p => p.pilar === pilarId) || { progreso: 0, score: 0, ciclo_actual: "30", ciclo_dia: 1 }
  }

  const totalProgress = pilaresProgress.length > 0 
    ? pilaresProgress.reduce((acc, p) => acc + p.progreso, 0) / pilaresProgress.length 
    : 0

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard Despega</h1>
          <p className="text-muted-foreground mt-1">Tu centro de desarrollo integral</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{rankings?.score_general || 0}</div>
                <div className="text-sm text-muted-foreground">Puntos Totales</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold">#{rankings?.rank_general || "-"}</div>
                <div className="text-sm text-muted-foreground">Ranking General</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold">{Math.round(totalProgress)}%</div>
                <div className="text-sm text-muted-foreground">Progreso Total</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold capitalize">{a1Results?.nivel_detectado || "-"}</div>
                <div className="text-sm text-muted-foreground">Tu Nivel</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Caminos Activos */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Tus Caminos Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              {profile?.camino_persona_active && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                  Camino Persona
                </Badge>
              )}
              {profile?.camino_profesional_active && (
                <Badge variant="secondary" className="bg-orange-100 text-orange-800 hover:bg-orange-200">
                  Camino Profesional
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Diagnóstico A1 Resumen */}
        {a1Results && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Tu Diagnóstico A1</CardTitle>
              <CardDescription>Resultados de tu evaluación inicial</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Energía</span>
                    <span className="font-medium">{a1Results.score_energia}%</span>
                  </div>
                  <Progress value={a1Results.score_energia} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Enfoque</span>
                    <span className="font-medium">{a1Results.score_enfoque}%</span>
                  </div>
                  <Progress value={a1Results.score_enfoque} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Relaciones</span>
                    <span className="font-medium">{a1Results.score_relaciones}%</span>
                  </div>
                  <Progress value={a1Results.score_relaciones} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Plan Ejecutivo</span>
                    <span className="font-medium">{a1Results.score_plan_ejecutivo}%</span>
                  </div>
                  <Progress value={a1Results.score_plan_ejecutivo} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Los 4 Pilares */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Los 4 Pilares</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {PILARES.map((pilar) => {
              const progress = getPilarProgress(pilar.id)
              return (
                <Link key={pilar.id} href={pilar.href}>
                  <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg ${pilar.lightColor} flex items-center justify-center text-xl`}>
                            {pilar.icon}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{pilar.name}</CardTitle>
                            <CardDescription className="text-sm">{pilar.description}</CardDescription>
                          </div>
                        </div>
                        <Badge variant="outline" className={`${pilar.lightColor} ${pilar.textColor} border-0`}>
                          Ciclo {progress.ciclo_actual}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Día {progress.ciclo_dia} de {progress.ciclo_actual}</span>
                          <span className="font-medium">{progress.progreso}%</span>
                        </div>
                        <Progress value={progress.progreso} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground pt-1">
                          <span>{progress.score} puntos</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button variant="outline" asChild className="h-auto py-4 flex-col bg-transparent">
                <Link href="/despega/rutas">
                  <span className="text-2xl mb-1">🛤️</span>
                  <span className="text-sm">Ver Rutas</span>
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-auto py-4 flex-col bg-transparent">
                <Link href="/despega/rankings">
                  <span className="text-2xl mb-1">🏆</span>
                  <span className="text-sm">Rankings</span>
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-auto py-4 flex-col bg-transparent">
                <Link href="/despega/misiones">
                  <span className="text-2xl mb-1">✅</span>
                  <span className="text-sm">Misiones del Día</span>
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-auto py-4 flex-col bg-transparent">
                <Link href="/biblioteca">
                  <span className="text-2xl mb-1">📚</span>
                  <span className="text-sm">Biblioteca</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
