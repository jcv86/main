"use client"

import { useState, useEffect } from "react"
import { BookOpen, Clock, Target, TrendingUp, Calendar, Star, Award, BarChart3, PieChart, Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ReadingStats {
  totalBooksRead: number
  totalReadingTime: number
  averageProgress: number
  currentStreak: number
  booksInProgress: number
  favoriteCategory: string
  monthlyGoal: number
  monthlyProgress: number
}

interface BookProgress {
  id: number
  title: string
  author: string
  category: string
  progress_percentage: number
  reading_time_minutes: number
  last_read_at: string
}

interface CategoryStats {
  category: string
  books_read: number
  total_time: number
  average_rating: number
}

export default function ReadingAnalyticsDashboard() {
  const [stats, setStats] = useState<ReadingStats>({
    totalBooksRead: 0,
    totalReadingTime: 0,
    averageProgress: 0,
    currentStreak: 0,
    booksInProgress: 0,
    favoriteCategory: "",
    monthlyGoal: 5,
    monthlyProgress: 0,
  })
  const [booksInProgress, setBooksInProgress] = useState<BookProgress[]>([])
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([])
  const [monthlyGoal, setMonthlyGoal] = useState(5)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      setLoading(true)

      // Get authenticated user
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        console.error('[v0] User not authenticated')
        setLoading(false)
        return
      }

      // Load reading progress data using user ID (not email)
      const { data: progressData, error: progressError } = await supabase
        .from("user_reading_progress")
        .select(`
          *,
          knowledge_base (
            title,
            author,
            category
          )
        `)
        .eq("user_id", user.id)

      if (progressError) throw progressError

      // Load book reviews for ratings
      const { data: reviewsData, error: reviewsError } = await supabase
        .from("book_reviews")
        .select("*")
        .eq("user_id", user.id)

      if (reviewsError) throw reviewsError

      // Load reading sessions
      const { data: sessionsData, error: sessionsError } = await supabase
        .from("reading_sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("session_start", { ascending: false })

      if (sessionsError) throw sessionsError

      // Calculate statistics
      const completedBooks = progressData?.filter((book) => book.progress_percentage === 100) || []
      const inProgressBooks =
        progressData?.filter((book) => book.progress_percentage > 0 && book.progress_percentage < 100) || []

      const totalReadingTime = progressData?.reduce((sum, book) => sum + (book.reading_time_minutes || 0), 0) || 0
      const averageProgress = progressData?.length
        ? Math.round(progressData.reduce((sum, book) => sum + book.progress_percentage, 0) / progressData.length)
        : 0

      // Calculate category statistics
      const categoryMap = new Map<string, { books: number; time: number; ratings: number[] }>()

      progressData?.forEach((book) => {
        const category = book.knowledge_base?.category || "Sin categoría"
        const existing = categoryMap.get(category) || { books: 0, time: 0, ratings: [] }

        existing.books += book.progress_percentage === 100 ? 1 : 0
        existing.time += book.reading_time_minutes || 0

        const review = reviewsData?.find((r) => r.book_id === book.book_id)
        if (review?.rating) {
          existing.ratings.push(review.rating)
        }

        categoryMap.set(category, existing)
      })

      const categoryStatsArray = Array.from(categoryMap.entries()).map(([category, data]) => ({
        category,
        books_read: data.books,
        total_time: data.time,
        average_rating: data.ratings.length ? data.ratings.reduce((a, b) => a + b, 0) / data.ratings.length : 0,
      }))

      const favoriteCategory =
        categoryStatsArray.reduce((prev, current) => (prev.books_read > current.books_read ? prev : current))
          ?.category || ""

      // Calculate current month progress
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      const monthlyCompletedBooks = completedBooks.filter((book) => {
        const completedDate = new Date(book.last_read_at)
        return completedDate.getMonth() === currentMonth && completedDate.getFullYear() === currentYear
      }).length

      // Calculate reading streak (simplified - consecutive days with reading activity)
      const recentSessions = sessionsData?.slice(0, 30) || []
      let currentStreak = 0
      const today = new Date()

      for (let i = 0; i < 30; i++) {
        const checkDate = new Date(today)
        checkDate.setDate(today.getDate() - i)

        const hasActivity = recentSessions.some((session) => {
          const sessionDate = new Date(session.session_start)
          return sessionDate.toDateString() === checkDate.toDateString()
        })

        if (hasActivity) {
          currentStreak++
        } else if (i > 0) {
          break
        }
      }

      setStats({
        totalBooksRead: completedBooks.length,
        totalReadingTime,
        averageProgress,
        currentStreak,
        booksInProgress: inProgressBooks.length,
        favoriteCategory,
        monthlyGoal,
        monthlyProgress: monthlyCompletedBooks,
      })

      setBooksInProgress(
        inProgressBooks.map((book) => ({
          id: book.book_id,
          title: book.knowledge_base?.title || "Título desconocido",
          author: book.knowledge_base?.author || "Autor desconocido",
          category: book.knowledge_base?.category || "Sin categoría",
          progress_percentage: book.progress_percentage,
          reading_time_minutes: book.reading_time_minutes || 0,
          last_read_at: book.last_read_at,
        })),
      )

      setCategoryStats(categoryStatsArray.sort((a, b) => b.books_read - a.books_read))
    } catch (error) {
      console.error("Error loading analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateMonthlyGoal = async () => {
    // In a real app, you'd save this to the database
    setStats({ ...stats, monthlyGoal })
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 animate-pulse mx-auto mb-4 text-blue-600" />
          <p>Cargando estadísticas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">📊 Análisis de Lectura</h1>
        <p className="text-xl text-gray-600">Seguimiento detallado de tu progreso y hábitos de lectura</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="progress">Progreso</TabsTrigger>
          <TabsTrigger value="categories">Categorías</TabsTrigger>
          <TabsTrigger value="goals">Objetivos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Libros Completados</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalBooksRead}</div>
                <p className="text-xs text-muted-foreground">{stats.booksInProgress} en progreso</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tiempo de Lectura</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatTime(stats.totalReadingTime)}</div>
                <p className="text-xs text-muted-foreground">
                  Promedio: {Math.round(stats.totalReadingTime / Math.max(stats.totalBooksRead, 1))}m por libro
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Racha Actual</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.currentStreak}</div>
                <p className="text-xs text-muted-foreground">días consecutivos</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Progreso Promedio</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.averageProgress}%</div>
                <p className="text-xs text-muted-foreground">en todos los libros</p>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Goal Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Objetivo Mensual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Progreso: {stats.monthlyProgress} de {stats.monthlyGoal} libros
                  </span>
                  <Badge variant={stats.monthlyProgress >= stats.monthlyGoal ? "default" : "secondary"}>
                    {Math.round((stats.monthlyProgress / stats.monthlyGoal) * 100)}%
                  </Badge>
                </div>
                <Progress value={(stats.monthlyProgress / stats.monthlyGoal) * 100} className="h-3" />
                {stats.monthlyProgress >= stats.monthlyGoal && (
                  <div className="flex items-center gap-2 text-green-600">
                    <Award className="h-4 w-4" />
                    <span className="text-sm font-medium">¡Objetivo cumplido!</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Favorite Category */}
          {stats.favoriteCategory && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Categoría Favorita
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <Badge variant="default" className="text-lg px-4 py-2">
                    {stats.favoriteCategory}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">Tu categoría más leída este mes</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Libros en Progreso</CardTitle>
            </CardHeader>
            <CardContent>
              {booksInProgress.length > 0 ? (
                <div className="space-y-4">
                  {booksInProgress.map((book) => (
                    <div key={book.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{book.title}</h4>
                          <p className="text-sm text-gray-600">por {book.author}</p>
                        </div>
                        <Badge variant="secondary">{book.category}</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progreso</span>
                          <span>{book.progress_percentage}%</span>
                        </div>
                        <Progress value={book.progress_percentage} className="h-2" />
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Tiempo: {formatTime(book.reading_time_minutes)}</span>
                          <span>Última lectura: {new Date(book.last_read_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No tienes libros en progreso</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Estadísticas por Categoría
              </CardTitle>
            </CardHeader>
            <CardContent>
              {categoryStats.length > 0 ? (
                <div className="space-y-4">
                  {categoryStats.map((category, index) => (
                    <div key={category.category} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{category.category}</h4>
                        <div className="flex items-center gap-2">
                          {category.average_rating > 0 && (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span className="text-sm">{category.average_rating.toFixed(1)}</span>
                            </div>
                          )}
                          <Badge variant={index === 0 ? "default" : "secondary"}>#{index + 1}</Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Libros leídos:</span>
                          <span className="font-medium ml-2">{category.books_read}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Tiempo total:</span>
                          <span className="font-medium ml-2">{formatTime(category.total_time)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No hay estadísticas de categorías disponibles</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Configurar Objetivos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Objetivo mensual de libros</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="1"
                    max="50"
                    value={monthlyGoal}
                    onChange={(e) => setMonthlyGoal(Number.parseInt(e.target.value) || 1)}
                    className="w-20"
                  />
                  <span className="text-sm text-gray-600">libros por mes</span>
                  <Button onClick={updateMonthlyGoal} size="sm">
                    Actualizar
                  </Button>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Progreso Actual</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Este mes:</span>
                    <span className="font-medium">
                      {stats.monthlyProgress} / {stats.monthlyGoal}
                    </span>
                  </div>
                  <Progress value={(stats.monthlyProgress / stats.monthlyGoal) * 100} className="h-2" />
                  <p className="text-xs text-gray-600">
                    {stats.monthlyGoal - stats.monthlyProgress > 0
                      ? `Te faltan ${stats.monthlyGoal - stats.monthlyProgress} libros para cumplir tu objetivo`
                      : "¡Felicidades! Has cumplido tu objetivo mensual"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Calendar className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <div className="text-2xl font-bold">{stats.currentStreak}</div>
                      <p className="text-sm text-gray-600">Días consecutivos</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Clock className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <div className="text-2xl font-bold">{formatTime(stats.totalReadingTime)}</div>
                      <p className="text-sm text-gray-600">Tiempo total</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Award className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                      <div className="text-2xl font-bold">{stats.totalBooksRead}</div>
                      <p className="text-sm text-gray-600">Libros completados</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
