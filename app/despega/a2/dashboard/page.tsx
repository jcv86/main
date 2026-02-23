"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useA4Calibration } from "@/hooks/use-a4-calibration"
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
  const calibration = useA4Calibration()
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

        console.log('[v0] Dashboard loading data for user:', user.id)

        // Load user profile
        const { data: profileData } = await supabase
          .from("despega_user_profiles")
          .select("*")
          .eq("user_id", user.id)
          .single()

        console.log('[v0] Profile data loaded:', profileData)

        if (profileData?.a2_mission_id) {
          setUserProfile(profileData)

          // Load mission
          const { data: missionData } = await supabase
            .from("a2_user_missions")
            .select("*")
            .eq("id", profileData.a2_mission_id)
            .single()

          console.log('[v0] Mission data loaded:', missionData)
          setMission(missionData)

          // Load A2 bitácora for stats
          const { data: bitacoraData } = await supabase
            .from("a2_user_bitacora")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })

          console.log('[v0] Bitácora data loaded:', bitacoraData?.length || 0, 'entries')

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
        console.error('[v0] Dashboard load error:', error)
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
      <div className="max-w-4xl mx-auto py-12 space-y-8">
        {/* Header */}
        <div className="space-y-3">
          <Badge variant="outline" className="w-fit">
            Tu Progreso en A2
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-50">
            Dashboard de Transformación
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            {mission?.objective || "Tu misión de 90 días"}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Completed Actions */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-4 text-center">
              <Activity className="w-6 h-6 mx-auto mb-2 text-green-600 dark:text-green-400" />
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                {stats.actionsCompleted}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Acciones completadas
              </p>
            </CardContent>
          </Card>

          {/* Streak */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-4 text-center">
              <Zap className="w-6 h-6 mx-auto mb-2 text-amber-600 dark:text-amber-400" />
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                {stats.streak}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Días de racha
              </p>
            </CardContent>
          </Card>

          {/* Success Rate */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                {stats.successRate}%
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Tasa de éxito
              </p>
            </CardContent>
          </Card>

          {/* Sprint Progress */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-4 text-center">
              <BookOpen className="w-6 h-6 mx-auto mb-2 text-purple-600 dark:text-purple-400" />
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                {stats.sprintProgress}%
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Sprint actual
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sprint Progress Overview */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            Tus 3 Sprints
          </h2>

          {[1, 2, 3].map((sprintNum) => (
            <Link key={sprintNum} href={`/despega/a2/sprint-${sprintNum}`}>
              <Card className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 dark:text-slate-50">
                          Sprint {sprintNum}: {sprintNum === 1 ? "Fundamentos" : sprintNum === 2 ? "Profundización" : "Consolidación"}
                        </h3>
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

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Progreso</span>
                        <span className="font-semibold text-slate-900 dark:text-slate-50">
                          {sprintNum === 1 ? stats.sprintProgress : sprintNum === 2 ? 0 : 0}%
                        </span>
                      </div>
                      <Progress value={sprintNum === 1 ? stats.sprintProgress : 0} className="h-2" />
                    </div>

                    <div className="flex items-center justify-end text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors">
                      Explorar Sprint <ArrowRight className="ml-2 w-4 h-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/despega/a2/sprint-1">
            <Button className="w-full h-14" size="lg">
              Continuar Sprint <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Link href="/despega/a2/bitacora">
            <Button variant="outline" className="w-full h-14" size="lg">
              📖 Bitácora
            </Button>
          </Link>
          <Link href="/despega/a2/coach">
            <Button variant="outline" className="w-full h-14" size="lg">
              💬 Chat Coach
            </Button>
          </Link>
        </div>

        {/* Transition to A3 Card */}
        <Card className="border-2 border-purple-300 dark:border-purple-600 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              Próximo: A3 - Entrenamientos Avanzados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              Una vez completes tu sprint 1, accede a A3 para entrenamientos avanzados con simulaciones de entrevistas y evaluaciones personalizadas.
            </p>
            <Link href="/despega/a3">
              <Button className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600">
                Ir a A3 - Entrenamientos <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Info Box */}
        <Card className="border-0 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              <strong>💡 Recuerda:</strong> Consistencia sobre perfección. Una pequeña acción diaria crea transformaciones extraordinarias en 90 días.
            </p>
          </CardContent>
        </Card>

        {/* Debug Info - Visible for development/verification */}
        {debugInfo && (
          <Card className="border-0 bg-slate-100 dark:bg-slate-800 border-l-4 border-l-amber-500">
            <CardHeader>
              <CardTitle className="text-sm">Estado de Datos (Debug)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex justify-between">
                <span>Usuario:</span>
                <code className="bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded">{debugInfo.userId?.slice(0, 8)}...</code>
              </div>
              <div className="flex justify-between">
                <span>Perfil guardado:</span>
                <Badge variant={debugInfo.profileExists ? "default" : "destructive"}>
                  {debugInfo.profileExists ? "✓" : "✗"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Misión guardada:</span>
                <Badge variant={debugInfo.missionExists ? "default" : "destructive"}>
                  {debugInfo.missionExists ? "✓" : "✗"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Entradas en Bitácora:</span>
                <Badge variant="outline">{debugInfo.bitacoraEntries}</Badge>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
