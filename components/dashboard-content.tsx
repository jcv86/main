// Dashboard component - displays real user data from Supabase
"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ChevronRight } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useSession } from "@/components/session-wrapper"

export function DashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user: sessionUser } = useSession()
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<any>(null)
  const [testResults, setTestResults] = useState<any>(null)
  const [goals, setGoals] = useState<any[]>([])
  const [refreshKey, setRefreshKey] = useState(0)

  const shouldRefetch = searchParams?.get("refetch") === "true"

  const loadData = async () => {
    if (!sessionUser?.id) return

    const supabase = createClient()
    setLoading(true)

    try {
      // Load user progress
      const { data: progress } = await supabase
        .from("a1_progress")
        .select("*")
        .eq("user_id", sessionUser.id)
        .single()

      console.log("[v0] Progress data:", progress)

      // Load test results - get the most recent one
      const { data: results } = await supabase
        .from("unified_test_results")
        .select("*")
        .eq("user_email", sessionUser.email)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      console.log("[v0] Test results:", results)

      // Load goals
      const { data: userGoals } = await supabase
        .from("career_goals")
        .select("*")
        .eq("user_id", sessionUser.id)

      // Load reading stats
      const { data: readingStats } = await supabase
        .from("user_reading_stats")
        .select("*")
        .eq("user_id", sessionUser.id)
        .single()

      setUserData({
        ...progress,
        reading: readingStats,
      })
      setTestResults(results)
      setGoals(userGoals || [])
    } catch (error) {
      console.error("[v0] Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [sessionUser?.id, sessionUser?.email, refreshKey])

  // Auto-refetch when coming back from test completion
  useEffect(() => {
    if (shouldRefetch) {
      console.log("[v0] Refetch triggered, waiting before reload...")
      // Add a small delay to allow database to update
      const timer = setTimeout(() => {
        console.log("[v0] Executing refetch...")
        setRefreshKey(prev => prev + 1)
        // Clean up the URL
        window.history.replaceState({}, "", "/dashboard")
      }, 800)
      
      return () => clearTimeout(timer)
    }
  }, [shouldRefetch])

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-muted rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const activeGoalsCount = goals.filter((g) => g.status === "active").length
  const goalsProgress = goals.length > 0
    ? Math.round(goals.reduce((sum, g) => sum + (g.progress || 0), 0) / goals.length)
    : 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="mb-8 px-2">
        <h1 className="text-5xl font-bold bg-background">
          Tu Dashboard
        </h1>
        <p className="text-lg text-muted-foreground dark:text-white/85">Bienvenido a tu centro de comando Despega</p>
      </div>

      {/* Debug Info - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="bg-yellow/5 dark:bg-yellow/20 border-2 border-yellow/20 dark:border-yellow/50">
          <CardHeader>
            <CardTitle className="text-sm">DEBUG INFO</CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-1 font-mono">
            <p>User: {sessionUser?.email}</p>
            <p>Tests Completed: {userData?.tests_completed || 0}</p>
            <p>Has Test Results: {testResults ? 'YES' : 'NO'}</p>
            <p>Refresh Key: {refreshKey}</p>
          </CardContent>
        </Card>
      )}

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Tests Completados */}
        <Card className="border-2 border-purple/20 dark:border-purple/50 bg-transparent shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple dark:text-purple-200">Tests Completados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple dark:text-purple-300">{userData?.tests_completed || 0}</div>
            <Progress value={((userData?.tests_completed || 0) / 6) * 100} className="mt-2" />
            <p className="text-xs text-muted-foreground dark:text-muted-foreground mt-1">de 6 tests disponibles</p>
          </CardContent>
        </Card>

        {/* Metas Activas */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Metas Activas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeGoalsCount}</div>
            <Progress value={goalsProgress} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">Progreso promedio: {goalsProgress}%</p>
          </CardContent>
        </Card>

        {/* Libros Leídos */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Libros Leídos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{userData?.reading?.books_read || 0}</div>
            <Progress value={(userData?.reading?.reading_streak || 0) * 10} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">Racha: {userData?.reading?.reading_streak || 0} días</p>
          </CardContent>
        </Card>

        {/* Puntos */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Puntos Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{userData?.reading?.points || 0}</div>
            <Progress value={Math.min((userData?.reading?.points || 0) / 1000 * 100, 100)} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">Nivel {userData?.reading?.level || 1}</p>
          </CardContent>
        </Card>
      </div>

      {/* Test Results Section */}
      {testResults?.test_results && (
        <Card>
          <CardHeader>
            <CardTitle>Mi Perfil Despega Cerebral</CardTitle>
            <CardDescription>
              Resultado de tu evaluación de personalidad
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Perfil Scores Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* D Score - Impulsor */}
                <div className="p-4 bg-red/5 dark:bg-red/20 rounded-[28px] border border-red/20 dark:border-red">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">⚡</span>
                    <span className="text-2xl font-bold text-red">{testResults.test_results.d_score || 0}%</span>
                  </div>
                  <p className="text-sm font-medium text-red dark:text-red/30">Impulsor</p>
                  <Progress value={testResults.test_results.d_score || 0} className="mt-2" />
                  <p className="text-xs text-red dark:text-red/40 mt-1">Decisión y Resultados</p>
                </div>

                {/* I Score - Catalizador */}
                <div className="p-4 bg-yellow/5 dark:bg-yellow/20 rounded-[28px] border border-yellow/20 dark:border-yellow">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">✨</span>
                    <span className="text-2xl font-bold text-yellow">{testResults.test_results.i_score || 0}%</span>
                  </div>
                  <p className="text-sm font-medium text-yellow dark:text-yellow-200">Catalizador</p>
                  <Progress value={testResults.test_results.i_score || 0} className="mt-2" />
                  <p className="text-xs text-yellow dark:text-yellow/40 mt-1">Entusiasmo y Conexión</p>
                </div>

                {/* S Score - Estabilizador */}
                <div className="p-4 bg-green/5 dark:bg-green/20 rounded-[28px] border border-green/20 dark:border-green">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🌱</span>
                    <span className="text-2xl font-bold text-green">{testResults.test_results.s_score || 0}%</span>
                  </div>
                  <p className="text-sm font-medium text-green dark:text-green/30">Estabilizador</p>
                  <Progress value={testResults.test_results.s_score || 0} className="mt-2" />
                  <p className="text-xs text-green dark:text-green/40 mt-1">Paciencia y Apoyo</p>
                </div>

                {/* C Score - Arquitecto */}
                <div className="p-4 bg-blue/5 dark:bg-blue/20 rounded-[28px] border border-blue/20 dark:border-blue">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🏗️</span>
                    <span className="text-2xl font-bold text-blue">{testResults.test_results.c_score || 0}%</span>
                  </div>
                  <p className="text-sm font-medium text-blue dark:text-blue-200">Arquitecto</p>
                  <Progress value={testResults.test_results.c_score || 0} className="mt-2" />
                  <p className="text-xs text-blue dark:text-blue/40 mt-1">Precisión y Análisis</p>
                </div>
              </div>

              {/* Dominant Profile */}
              {testResults.test_results.dominant_profile && (
                <div className="p-4 bg-background">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Tu Perfil Dominante</p>
                  <p className="text-2xl font-bold text-purple">{testResults.test_results.dominant_profile}</p>
                  {testResults.test_results.secondary_profile && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Perfil Secundario: <span className="font-semibold">{testResults.test_results.secondary_profile}</span>
                    </p>
                  )}
                </div>
              )}

              {/* Caminos Activos */}
              <div className="grid grid-cols-2 gap-4">
                {testResults.test_results.camino_persona && (
                  <div className="p-3 bg-purple/5 dark:bg-purple/20 rounded border border-purple/20 dark:border-purple">
                    <p className="text-sm font-medium text-purple dark:text-purple-200">Camino Personal</p>
                    <p className="text-xs text-purple dark:text-purple/40 mt-1">Activado</p>
                  </div>
                )}
                {testResults.test_results.camino_profesional && (
                  <div className="p-3 bg-blue/5 dark:bg-blue/20 rounded border border-blue/20 dark:border-blue">
                    <p className="text-sm font-medium text-blue dark:text-blue-200">Camino Profesional</p>
                    <p className="text-xs text-blue dark:text-blue/40 mt-1">Activado</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Goals Progress */}
      {goals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Metas en Progreso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {goals.map((goal) => (
              <div key={goal.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{goal.title}</span>
                  <span className="text-sm text-muted-foreground">{goal.progress}%</span>
                </div>
                <Progress value={goal.progress || 0} />
                {goal.target_date && (
                  <p className="text-xs text-muted-foreground">
                    Vencimiento: {new Date(goal.target_date).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Próximos Pasos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {!userData?.tests_completed || userData.tests_completed < 6 ? (
              <Button onClick={() => router.push("/despega/onboarding")} className="w-full justify-between">
                <span>Completar Evaluación</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : null}
            <Button variant="outline" onClick={() => router.push("/biblioteca")} className="w-full justify-between">
              <span>Explorar Biblioteca</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
