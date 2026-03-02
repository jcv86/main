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
    description: "Dónde vive tu identidad - Noticias, Cultura, Biblioteca",
    color: "bg-cyan-500",
    lightColor: "bg-cyan-100",
    textColor: "text-cyan-800",
    href: "/despega/a4",
    icon: "🌍",
  },
  {
    id: "a3_entrenamientos",
    name: "A3: Entrenamientos Avanzados",
    description: "Simulaciones y feedback en tiempo real",
    color: "bg-purple-500",
    lightColor: "bg-purple-100",
    textColor: "text-purple-800",
    href: "/despega/a3",
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
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push("/login")
          return
        }

        // Check if onboarding is completed by looking for test results
        const { data: testResults } = await supabase
          .from("a1_tests_results")
          .select("id")
          .eq("user_id", user.id)
          .eq("test_name", "Despega Cerebral")
          .limit(1)

        // Always load profile data regardless of test completion
        const { data: profileData } = await supabase
          .from("despega_user_profiles")
          .select("*")
          .eq("user_id", user.id)
          .single()

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
      } catch (error) {
        console.error("[v0] Error loading dashboard:", error)
      } finally {
        setLoading(false)
      }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Onboarding Prompt if not completed */}
        {/* This will be checked elsewhere - for now, just load the dashboard */}
        
        {/* Welcome Section */}
        <div className="mb-12">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white text-balance">
              Tu Transformación de 90 Días Comienza Ahora
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl">
              Basado en tu evaluación inicial, aquí está tu ruta personalizada de desarrollo
            </p>
          </div>
        </div>

        {/* Hero Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {/* Puntos */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl opacity-75 group-hover:opacity-100 blur transition duration-300" />
            <div className="relative bg-slate-800 rounded-xl p-6 space-y-2">
              <div className="text-sm text-slate-400 font-medium">PUNTOS TOTALES</div>
              <div className="text-4xl font-bold text-white">{rankings?.score_general || 0}</div>
              <div className="text-xs text-slate-400">Gana más completando tareas</div>
            </div>
          </div>

          {/* Ranking */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl opacity-75 group-hover:opacity-100 blur transition duration-300" />
            <div className="relative bg-slate-800 rounded-xl p-6 space-y-2">
              <div className="text-sm text-slate-400 font-medium">TU RANKING</div>
              <div className="text-4xl font-bold text-white">#{rankings?.rank_general || "-"}</div>
              <div className="text-xs text-slate-400">De todos los usuarios</div>
            </div>
          </div>

          {/* Progreso */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl opacity-75 group-hover:opacity-100 blur transition duration-300" />
            <div className="relative bg-slate-800 rounded-xl p-6 space-y-2">
              <div className="text-sm text-slate-400 font-medium">PROGRESO TOTAL</div>
              <div className="text-4xl font-bold text-white">{Math.round(totalProgress)}%</div>
              <div className="text-xs text-slate-400">De tu transformación</div>
            </div>
          </div>

          {/* Nivel */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl opacity-75 group-hover:opacity-100 blur transition duration-300" />
            <div className="relative bg-slate-800 rounded-xl p-6 space-y-2">
              <div className="text-sm text-slate-400 font-medium">TU NIVEL</div>
              <div className="text-4xl font-bold text-white capitalize">{a1Results?.nivel_detectado || "-"}</div>
              <div className="text-xs text-slate-400">Detectado en A1</div>
            </div>
          </div>
        </div>

        {/* A1 Diagnóstico */}
        {a1Results && (
          <div className="mb-12">
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-2">Tu Perfil DISC</h2>
              <p className="text-slate-400 mb-8">Estas son tus dimensiones clave de personalidad</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: "Energía", value: a1Results.score_energia, color: "from-blue-500 to-cyan-500" },
                  { label: "Enfoque", value: a1Results.score_enfoque, color: "from-purple-500 to-pink-500" },
                  { label: "Relaciones", value: a1Results.score_relaciones, color: "from-green-500 to-emerald-500" },
                  { label: "Plan Ejecutivo", value: a1Results.score_plan_ejecutivo, color: "from-orange-500 to-red-500" },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-300">{item.label}</span>
                      <span className={`text-xl font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                        {item.value}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${item.color} transition-all duration-500`}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Los 4 Pilares */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">Tu Ruta de 90 Días</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {PILARES.map((pilar, idx) => {
              const progress = getPilarProgress(pilar.id)
              const colors = [
                "from-blue-600 to-cyan-600",
                "from-green-600 to-emerald-600",
                "from-purple-600 to-pink-600",
                "from-orange-600 to-red-600",
              ]
              const gradientBg = colors[idx % colors.length]

              return (
                <Link key={pilar.id} href={pilar.href}>
                  <div className="group cursor-pointer h-full">
                    <div className={`absolute inset-0 bg-gradient-to-r ${gradientBg} rounded-xl opacity-0 group-hover:opacity-10 blur transition duration-300`} />
                    <div className="relative bg-slate-800 border border-slate-700 rounded-xl p-8 hover:border-slate-600 transition h-full space-y-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center gap-3">
                            <span className="text-4xl">{pilar.icon}</span>
                            <div>
                              <h3 className="text-xl font-bold text-white">{pilar.name}</h3>
                              <p className="text-sm text-slate-400">{pilar.description}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-400">Día {progress.ciclo_dia} de {progress.ciclo_actual}</span>
                          <span className={`text-lg font-bold bg-gradient-to-r ${gradientBg} bg-clip-text text-transparent`}>
                            {progress.progreso}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${gradientBg} transition-all duration-500`}
                            style={{ width: `${progress.progreso}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center text-xs text-slate-400 pt-2">
                          <span>⚡ {progress.score} puntos</span>
                          <span className={`bg-gradient-to-r ${gradientBg} bg-clip-text text-transparent font-semibold`}>
                            Ciclo {progress.ciclo_actual}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Acciones Rápidas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { href: "/despega/a2/dashboard", icon: "🧭", label: "Mi Sprint" },
              { href: "/despega/rankings", icon: "🏆", label: "Rankings" },
              { href: "/despega/a4/noticias", icon: "📰", label: "Noticias" },
              { href: "/despega/a4/biblioteca", icon: "📚", label: "Biblioteca" },
            ].map((action, idx) => (
              <Link key={idx} href={action.href}>
                <button className="w-full group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-700 to-slate-600 rounded-xl opacity-0 group-hover:opacity-100 blur transition duration-300" />
                  <div className="relative bg-slate-800 border border-slate-700 rounded-xl p-4 space-y-2 group-hover:border-slate-600 transition">
                    <div className="text-3xl">{action.icon}</div>
                    <div className="text-sm font-medium text-white">{action.label}</div>
                  </div>
                </button>
              </Link>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        {profile && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Próximos Pasos</h2>
            <div className="space-y-4">
              {!profile.camino_persona_active && (
                <div className="flex items-start gap-4 pb-4 border-b border-slate-700">
                  <div className="text-2xl">1️⃣</div>
                  <div>
                    <h3 className="font-semibold text-white">Activa tu Camino Persona</h3>
                    <p className="text-sm text-slate-400">Desarrolla tu propósito personal y claridad de vida</p>
                  </div>
                </div>
              )}
              {!profile.camino_profesional_active && (
                <div className="flex items-start gap-4 pb-4 border-b border-slate-700">
                  <div className="text-2xl">2️⃣</div>
                  <div>
                    <h3 className="font-semibold text-white">Activa tu Camino Profesional</h3>
                    <p className="text-sm text-slate-400">Transforma tu carrera en los próximos 90 días</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-4">
                <div className="text-2xl">🎯</div>
                <div>
                  <h3 className="font-semibold text-white">Completa tus Sprints</h3>
                  <p className="text-sm text-slate-400">Cada día, una pequeña acción. 90 días, una transformación</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
