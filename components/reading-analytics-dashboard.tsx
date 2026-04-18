"use client"

import { useState, useEffect } from "react"
import { useUser } from "@/hooks/use-user"
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

  const { user } = useUser()

  useEffect(() => {
    if (user?.email) {
      loadAnalytics()
    }
  }, [user?.email])

  const loadAnalytics = async () => {
    if (!user?.email) return
    
    try {
      setLoading(true)

      // Fetch analytics data via API
      const response = await fetch(`/api/reading-analytics?userEmail=${encodeURIComponent(user.email)}`)
      if (!response.ok) throw new Error("Failed to load analytics")

      const { stats: statsData, books: booksData, categories: categoriesData } = await response.json()

      setStats(statsData || {
        totalBooksRead: 0,
        totalReadingTime: 0,
        averageProgress: 0,
        currentStreak: 0,
        booksInProgress: 0,
        favoriteCategory: "",
        monthlyGoal: 5,
        monthlyProgress: 0,
      })
      setBooksInProgress(booksData || [])
      setCategoryStats(categoriesData || [])
    } catch (error) {
      console.error("[v0] Error loading analytics:", error)
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
          <BarChart3 className="h-12 w-12 animate-pulse mx-auto mb-4 text-blue" />
          <p>Cargando estadísticas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">📊 Análisis de Lectura</h1>
        <p className="text-xl text-muted/60">Seguimiento detallado de tu progreso y hábitos de lectura</p>
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
                  <div className="flex items-center gap-2 text-green">
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
                    <div key={book.id} className="border rounded-[28px] p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{book.title}</h4>
                          <p className="text-sm text-muted/60">por {book.author}</p>
                        </div>
                        <Badge variant="secondary">{book.category}</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progreso</span>
                          <span>{book.progress_percentage}%</span>
                        </div>
                        <Progress value={book.progress_percentage} className="h-2" />
                        <div className="flex items-center justify-between text-xs text-muted/50">
                          <span>Tiempo: {formatTime(book.reading_time_minutes)}</span>
                          <span>Última lectura: {new Date(book.last_read_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-muted/40 mx-auto mb-4" />
                  <p className="text-muted/60">No tienes libros en progreso</p>
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
                    <div key={category.category} className="border rounded-[28px] p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{category.category}</h4>
                        <div className="flex items-center gap-2">
                          {category.average_rating > 0 && (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-orange" />
                              <span className="text-sm">{category.average_rating.toFixed(1)}</span>
                            </div>
                          )}
                          <Badge variant={index === 0 ? "default" : "secondary"}>#{index + 1}</Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted/60">Libros leídos:</span>
                          <span className="font-medium ml-2">{category.books_read}</span>
                        </div>
                        <div>
                          <span className="text-muted/60">Tiempo total:</span>
                          <span className="font-medium ml-2">{formatTime(category.total_time)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <PieChart className="h-12 w-12 text-muted/40 mx-auto mb-4" />
                  <p className="text-muted/60">No hay estadísticas de categorías disponibles</p>
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
                  <span className="text-sm text-muted/60">libros por mes</span>
                  <Button onClick={updateMonthlyGoal} size="sm">
                    Actualizar
                  </Button>
                </div>
              </div>

              <div className="border rounded-[28px] p-4">
                <h4 className="font-semibold mb-2">Progreso Actual</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Este mes:</span>
                    <span className="font-medium">
                      {stats.monthlyProgress} / {stats.monthlyGoal}
                    </span>
                  </div>
                  <Progress value={(stats.monthlyProgress / stats.monthlyGoal) * 100} className="h-2" />
                  <p className="text-xs text-muted/60">
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
                      <Calendar className="h-8 w-8 mx-auto mb-2 text-blue" />
                      <div className="text-2xl font-bold">{stats.currentStreak}</div>
                      <p className="text-sm text-muted/60">Días consecutivos</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Clock className="h-8 w-8 mx-auto mb-2 text-green" />
                      <div className="text-2xl font-bold">{formatTime(stats.totalReadingTime)}</div>
                      <p className="text-sm text-muted/60">Tiempo total</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Award className="h-8 w-8 mx-auto mb-2 text-yellow" />
                      <div className="text-2xl font-bold">{stats.totalBooksRead}</div>
                      <p className="text-sm text-muted/60">Libros completados</p>
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
