// Dashboard component - displays real user data from Supabase
"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
      console.log("[v0] Refetch triggered, reloading data...")
      setRefreshKey(prev => prev + 1)
      // Clean up the URL
      window.history.replaceState({}, "", "/dashboard")
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
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Tests Completados */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tests Completados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{userData?.tests_completed || 0}</div>
            <Progress value={((userData?.tests_completed || 0) / 6) * 100} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">de 6 tests disponibles</p>
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
      {testResults && (
        <Card>
          <CardHeader>
            <CardTitle>Mi Perfil de Personalidad</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {testResults.test_results && Object.entries(testResults.test_results)
                  .filter(([key]) => ['d_score', 'i_score', 's_score', 'c_score'].includes(key))
                  .map(([key, value]: any) => (
                    <div key={key} className="p-4 bg-muted rounded-lg">
                      <div className="text-sm font-medium mb-2">{key.replace('_score', '').toUpperCase()}</div>
                      <div className="text-2xl font-bold mb-2">{value || 0}%</div>
                      <Progress value={value || 0} />
                    </div>
                  ))}
              </div>
              {testResults.test_results?.dominant_profile && (
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm font-medium">Perfil Dominante</p>
                  <p className="text-lg font-bold">{testResults.test_results.dominant_profile}</p>
                </div>
              )}
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
