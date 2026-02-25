"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, Activity, BookOpen, Zap, TrendingUp } from "lucide-react"

export default function A2DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [mission, setMission] = useState<any>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [stats, setStats] = useState({
    actionsCompleted: 0,
    streak: 0,
    totalActions: 0,
    successRate: 0,
    sprintProgress: 0,
  })
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

        // Load user profile
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

          setMission(missionData)

          // Load A2 bitácora for stats
          const { data: bitacoraData } = await supabase
            .from("a2_user_bitacora")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })

          // Store debug info
          setDebugInfo({
            userId: user.id,
            userEmail: user.email,
            profileExists: !!profileData,
            missionExists: !!missionData,
            bitacoraEntries: bitacoraData?.length || 0,
            timestamp: new Date().toISOString()
          })
        }
      } catch (error) {
        // Handle error silently
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [supabase, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Cargando tu dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 overflow-y-auto">
      <div className="max-w-6xl mx-auto py-8 space-y-8">
        
        {/* WELCOME HERO - NEW */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-800 dark:to-emerald-800 rounded-lg p-8 text-white shadow-lg">
          <div className="max-w-3xl">
            <p className="text-green-100 text-sm font-semibold uppercase tracking-wider mb-2">Fase A2: Exploración y Construcción del Puente</p>
            <h1 className="text-4xl font-bold mb-3">Bienvenido a tu transformación de 90 días</h1>
            <p className="text-lg text-green-50 mb-4">
              Acabas de descubrir tu perfil DISC en A1. Ahora en A2, vamos a construir tu ruta personal hacia el cambio profesional que deseas. 
              Este es tu espacio para planificar, aprender y actuar consistentemente.
            </p>
            <div className="flex gap-3">
              <Button className="bg-white text-green-700 hover:bg-green-50 font-semibold" size="lg">
                Comenzar Ahora
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10" size="lg">
                Ver Guía
              </Button>
            </div>
          </div>
        </div>

        {/* QUICK START GUIDE - NEW */}
        <Card className="border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <span className="text-2xl">🧭</span> Primeros Pasos - Haz esto ahora
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">1</div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-50">Revisa tu Perfil DISC</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Comprende tus fortalezas y áreas de desarrollo. Tu perfil es la base de tu plan.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">2</div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-50">Empieza Sprint 1: Fundamentos (Días 1-30)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Construye los pilares básicos con acciones pequeñas y consistentes. Una acción diaria cambia todo.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">3</div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-50">Habla con tu Coach</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Tu coach personalizará la ruta según tu perfil. Hazle preguntas, él te guiará.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">4</div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-50">Registra tu Progreso</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Usa la Bitácora para registrar acciones. Los datos nutren tu plan de mejora.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA SECTION - SIMPLIFIED */}
        <div className="grid md:grid-cols-2 gap-4">
          <Link href="/despega/a2/sprint-1" className="md:col-span-2">
            <Button className="w-full h-16 bg-green-600 hover:bg-green-700 text-white text-lg font-semibold shadow-lg" size="lg">
              ▶️ Comenzar Sprint 1: Fundamentos (Días 1-30) <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>

        {/* TWO COLUMN LAYOUT */}
        <div className="grid md:grid-cols-3 gap-6">
          
          {/* LEFT: COACH SECTION - PROMINENT */}
          <div className="md:col-span-1">
            <Card className="border-2 border-purple-400 dark:border-purple-600 bg-gradient-to-b from-purple-50 to-transparent dark:from-purple-900/30 dark:to-transparent h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="text-2xl">💬</span> Tu Coach
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  <strong>Travis</strong> es tu coach de transformación. Él está aquí para guiarte, responder preguntas y personalizar tu ruta según tu progreso.
                </p>
                <Link href="/despega/a2/coach">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    💬 Chat con Coach
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT: SPRINTS OVERVIEW */}
          <div className="md:col-span-2">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Tu Plan de 90 Días</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3].map((sprintNum) => (
                  <Link key={sprintNum} href={`/despega/a2/sprint-${sprintNum}`}>
                    <div className="border rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900 dark:text-slate-50">
                            Sprint {sprintNum}: {sprintNum === 1 ? "Fundamentos" : sprintNum === 2 ? "Profundización" : "Consolidación"}
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            Días {(sprintNum - 1) * 30 + 1}-{sprintNum * 30}
                          </p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          sprintNum === 1
                            ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                            : sprintNum === 2
                            ? "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                        }`}>
                          {sprintNum === 1 ? "En progreso" : sprintNum === 2 ? "Próximo" : "Futuro"}
                        </div>
                      </div>
                      {sprintNum === 1 && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-slate-600 dark:text-slate-400">Progreso</span>
                            <span className="font-semibold">{stats.sprintProgress}%</span>
                          </div>
                          <Progress value={stats.sprintProgress} className="h-2" />
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>

        </div>

        {/* STATS SIMPLIFIED */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <Activity className="w-5 h-5 mx-auto mb-2 text-green-600 dark:text-green-400" />
              <div className="text-2xl font-bold">{stats.actionsCompleted}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Acciones</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <Zap className="w-5 h-5 mx-auto mb-2 text-amber-600 dark:text-amber-400" />
              <div className="text-2xl font-bold">{stats.streak}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Racha</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-5 h-5 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
              <div className="text-2xl font-bold">{stats.successRate}%</div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Éxito</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <BookOpen className="w-5 h-5 mx-auto mb-2 text-purple-600 dark:text-purple-400" />
              <div className="text-2xl font-bold">{stats.sprintProgress}%</div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Sprint</p>
            </CardContent>
          </Card>
        </div>

        {/* ADDITIONAL RESOURCES */}
        <Card className="border-0 bg-amber-50 dark:bg-amber-900/20">
          <CardHeader>
            <CardTitle className="text-lg">Recursos Disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-3">
              <Link href="/despega/a2/bitacora">
                <Button variant="outline" className="w-full justify-center">
                  📖 Bitácora
                </Button>
              </Link>
              <Link href="/despega/a4-base">
                <Button variant="outline" className="w-full justify-center">
                  🌍 Contexto Macro (A4)
                </Button>
              </Link>
              <Link href="/despega/a3">
                <Button variant="outline" className="w-full justify-center">
                  🎯 Entrenamientos (A3)
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
