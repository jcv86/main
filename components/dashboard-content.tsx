"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useSession } from "@/components/session-wrapper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Zap, Users, Target, BookOpen, TrendingUp } from "lucide-react"

interface DespegaCerebralResult {
  D: number
  I: number
  S: number
  C: number
  total: number
}

interface UserProgress {
  a1_completed: boolean
  a1_score: number | null
  current_pilar: string
  progress_percentage: number
}

export function DashboardContent() {
  const { session } = useSession()
  const supabase = createClient()
  
  const [loading, setLoading] = useState(true)
  const [cerebralScore, setCerebralScore] = useState<DespegaCerebralResult | null>(null)
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)
  const [bibliotecaBooks, setBibliotecaBooks] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!session?.user?.email) return

    const loadDashboardData = async () => {
      try {
        setLoading(true)

        // Fetch Despega Cerebral results
        const { data: cerebralData, error: cerebralError } = await supabase
          .from("unified_test_results")
          .select("test_results")
          .eq("user_email", session.user.email)
          .eq("test_type", "despega_cerebral")
          .order("created_at", { ascending: false })
          .limit(1)

        if (cerebralData && cerebralData.length > 0) {
          setCerebralScore(cerebralData[0].test_results)
        }

        // Fetch Despega user profile and progress
        const { data: profileData } = await supabase
          .from("despega_user_profiles")
          .select("*")
          .eq("user_id", session.user.id)
          .single()

        if (profileData) {
          setUserProgress({
            a1_completed: profileData.a1_test_completed,
            a1_score: null,
            current_pilar: "a1_cerebral",
            progress_percentage: profileData.a1_test_completed ? 20 : 0,
          })
        }

        // Fetch recommended biblioteca books
        const { data: books } = await supabase
          .from("biblioteca")
          .select("id, title, author, category, difficulty, estimated_read_time, rating, cover_url")
          .eq("is_recommended", true)
          .limit(6)

        if (books) {
          setBibliotecaBooks(books)
        }
      } catch (err) {
        console.error("[v0] Error loading dashboard data:", err)
        setError("Error cargando datos del dashboard")
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [session?.user?.email, session?.user?.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (error) {
    return <div className="text-red-600 p-4">{error}</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Tu Dashboard Despega</h1>
        <p className="text-muted-foreground mt-1">
          {session?.user?.email}
        </p>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visión General</TabsTrigger>
          <TabsTrigger value="cerebral">Despega Cerebral</TabsTrigger>
          <TabsTrigger value="biblioteca">Biblioteca</TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-4">
          {userProgress && (
            <>
              {/* A1 Cerebral Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    A1: Despega Cerebral
                  </CardTitle>
                  <CardDescription>
                    {userProgress.a1_completed
                      ? "Test completado - Estás en el camino correcto"
                      : "Completa tu primer test para comenzar"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progreso</span>
                      <span className="font-semibold">{userProgress.progress_percentage}%</span>
                    </div>
                    <Progress value={userProgress.progress_percentage} className="h-2" />
                  </div>
                  {userProgress.a1_completed && (
                    <Badge className="w-fit" variant="default">
                      Completado
                    </Badge>
                  )}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {cerebralScore?.total || 0}%
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Score General</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {userProgress.progress_percentage}%
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Progreso Despega</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        {/* CEREBRAL TAB */}
        <TabsContent value="cerebral" className="space-y-4">
          {cerebralScore ? (
            <div className="grid grid-cols-2 gap-4">
              {/* D Score - Dominio */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold">Dominio (D)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">{cerebralScore.D}%</div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Liderazgo, decisión, ejecución
                  </p>
                </CardContent>
              </Card>

              {/* I Score - Influencia */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold">Influencia (I)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">{cerebralScore.I}%</div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Comunicación, conexión, carisma
                  </p>
                </CardContent>
              </Card>

              {/* S Score - Estabilidad */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold">Estabilidad (S)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{cerebralScore.S}%</div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Consistencia, confiabilidad, calma
                  </p>
                </CardContent>
              </Card>

              {/* C Score - Consciencia */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold">Consciencia (C)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{cerebralScore.C}%</div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Precisión, calidad, detalle
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">
                  No hay resultados de Despega Cerebral aún. Completa el test en onboarding.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* BIBLIOTECA TAB */}
        <TabsContent value="biblioteca" className="space-y-4">
          {bibliotecaBooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bibliotecaBooks.map((book) => (
                <Card key={book.id} className="overflow-hidden hover:shadow-lg transition">
                  {book.cover_url && (
                    <div className="aspect-video bg-muted overflow-hidden">
                      <img
                        src={book.cover_url}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="pt-4">
                    <h3 className="font-semibold line-clamp-2">{book.title}</h3>
                    <p className="text-sm text-muted-foreground">{book.author}</p>
                    <div className="flex gap-2 mt-3 flex-wrap">
                      <Badge variant="outline" className="text-xs">
                        {book.category}
                      </Badge>
                      {book.difficulty && (
                        <Badge variant="outline" className="text-xs">
                          {book.difficulty}
                        </Badge>
                      )}
                    </div>
                    {book.estimated_read_time && (
                      <p className="text-xs text-muted-foreground mt-2">
                        ~{book.estimated_read_time} min lectura
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No hay libros recomendados disponibles aún.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
