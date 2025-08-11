"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Brain,
  BookOpen,
  Lightbulb,
  Quote,
  StickyNote,
  Link2,
  Clock,
  Target,
  TrendingUp,
  Search,
  Tags,
  Star,
  Zap,
  Timer,
} from "lucide-react"
import { toast } from "sonner"

interface LibraryInsight {
  id: string
  content: string
  insight_type: "reflection" | "quote" | "note" | "connection"
  importance: "low" | "medium" | "high" | "critical"
  tags: string[]
  page_number?: number
  created_at: string
}

interface ReadingSession {
  id: string
  book_id: string
  start_time: string
  end_time?: string
  pages_read: number
  insights_captured: number
  comprehension_score?: number
  notes: string
}

interface LibraryMemoryStats {
  total_books_in_memory: number
  total_insights: number
  total_reading_time: number
  favorite_topics: string[]
  comprehension_average: number
  books_completed: number
  current_streak: number
}

interface LibraryMirixIntegrationProps {
  bookId: string
  bookTitle: string
  userId: string
  currentPage?: number
  chapterId?: string
}

export function LibraryMirixIntegration({
  bookId,
  bookTitle,
  userId,
  currentPage,
  chapterId,
}: LibraryMirixIntegrationProps) {
  const [insights, setInsights] = useState<LibraryInsight[]>([])
  const [stats, setStats] = useState<LibraryMemoryStats | null>(null)
  const [currentSession, setCurrentSession] = useState<ReadingSession | null>(null)
  const [isCapturingInsight, setIsCapturingInsight] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)

  // Form states
  const [insightContent, setInsightContent] = useState("")
  const [insightType, setInsightType] = useState<"reflection" | "quote" | "note" | "connection">("reflection")
  const [insightImportance, setInsightImportance] = useState<"low" | "medium" | "high" | "critical">("medium")
  const [insightTags, setInsightTags] = useState("")

  useEffect(() => {
    loadBookInsights()
    loadStats()
  }, [bookId, userId])

  const loadBookInsights = async () => {
    try {
      const response = await fetch(`/api/library/mirix-integration?action=insights&userId=${userId}&bookId=${bookId}`)
      const result = await response.json()
      if (result.data) {
        setInsights(result.data)
      }
    } catch (error) {
      console.error("Error loading insights:", error)
    }
  }

  const loadStats = async () => {
    try {
      const response = await fetch(`/api/library/mirix-integration?action=stats&userId=${userId}`)
      const result = await response.json()
      if (result.data) {
        setStats(result.data)
      }
    } catch (error) {
      console.error("Error loading stats:", error)
    }
  }

  const startReadingSession = async () => {
    try {
      const response = await fetch("/api/library/mirix-integration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "start_session",
          userId,
          bookId,
        }),
      })
      const result = await response.json()
      if (result.data) {
        setCurrentSession(result.data)
        toast.success("Sesión de lectura iniciada")
      }
    } catch (error) {
      toast.error("Error al iniciar sesión")
    }
  }

  const endReadingSession = async (pagesRead: number, comprehensionScore?: number, notes?: string) => {
    if (!currentSession) return

    try {
      const response = await fetch("/api/library/mirix-integration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "end_session",
          userId,
          sessionId: currentSession.id,
          pagesRead,
          comprehensionScore,
          notes,
        }),
      })
      const result = await response.json()
      if (result.data) {
        setCurrentSession(null)
        loadStats()
        toast.success("Sesión de lectura finalizada")
      }
    } catch (error) {
      toast.error("Error al finalizar sesión")
    }
  }

  const captureInsight = async () => {
    if (!insightContent.trim()) return

    setLoading(true)
    try {
      const tags = insightTags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)

      const response = await fetch("/api/library/mirix-integration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "capture_insight",
          userId,
          bookId,
          content: insightContent,
          type: insightType,
          importance: insightImportance,
          tags,
          chapterId,
          pageNumber: currentPage,
        }),
      })

      const result = await response.json()
      if (result.data) {
        setInsights((prev) => [result.data, ...prev])
        setInsightContent("")
        setInsightTags("")
        setIsCapturingInsight(false)
        toast.success("Insight capturado en Mirix")
        loadStats()
      }
    } catch (error) {
      toast.error("Error al capturar insight")
    } finally {
      setLoading(false)
    }
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "reflection":
        return <Lightbulb className="h-4 w-4" />
      case "quote":
        return <Quote className="h-4 w-4" />
      case "note":
        return <StickyNote className="h-4 w-4" />
      case "connection":
        return <Link2 className="h-4 w-4" />
      default:
        return <Brain className="h-4 w-4" />
    }
  }

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const filteredInsights = insights.filter(
    (insight) =>
      insight.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      insight.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500 rounded-full">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Mirix Memory - {bookTitle}</CardTitle>
              <CardDescription>Sistema inteligente de captura y conexión de conocimientos</CardDescription>
            </div>
          </div>
        </CardHeader>
        {stats && (
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.total_insights}</div>
                <div className="text-sm text-gray-600">Insights Totales</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.total_books_in_memory}</div>
                <div className="text-sm text-gray-600">Libros en Memoria</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{Math.floor(stats.total_reading_time / 60)}h</div>
                <div className="text-sm text-gray-600">Tiempo Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.current_streak}</div>
                <div className="text-sm text-gray-600">Racha Días</div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Controles de sesión */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5" />
            Sesión de Lectura
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!currentSession ? (
            <Button onClick={startReadingSession} className="w-full">
              <Clock className="h-4 w-4 mr-2" />
              Iniciar Sesión de Lectura
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium">
                  Sesión activa desde {new Date(currentSession.start_time).toLocaleTimeString()}
                </span>
              </div>
              <Button
                onClick={() => endReadingSession(currentPage || 0, undefined, "")}
                variant="outline"
                className="w-full"
              >
                <Target className="h-4 w-4 mr-2" />
                Finalizar Sesión
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Captura de insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Capturar Insight
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Dialog open={isCapturingInsight} onOpenChange={setIsCapturingInsight}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <Lightbulb className="h-4 w-4 mr-2" />
                Nuevo Insight
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Capturar Nuevo Insight</DialogTitle>
                <DialogDescription>Guarda una reflexión, cita o nota importante de tu lectura</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Tipo de Insight</label>
                    <Select value={insightType} onValueChange={(value: any) => setInsightType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reflection">💭 Reflexión</SelectItem>
                        <SelectItem value="quote">💬 Cita</SelectItem>
                        <SelectItem value="note">📝 Nota</SelectItem>
                        <SelectItem value="connection">🔗 Conexión</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Importancia</label>
                    <Select value={insightImportance} onValueChange={(value: any) => setInsightImportance(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">🟢 Baja</SelectItem>
                        <SelectItem value="medium">🟡 Media</SelectItem>
                        <SelectItem value="high">🟠 Alta</SelectItem>
                        <SelectItem value="critical">🔴 Crítica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Contenido del Insight</label>
                  <Textarea
                    value={insightContent}
                    onChange={(e) => setInsightContent(e.target.value)}
                    placeholder="Escribe tu insight, reflexión o nota..."
                    rows={4}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Tags (separados por comas)</label>
                  <Input
                    value={insightTags}
                    onChange={(e) => setInsightTags(e.target.value)}
                    placeholder="productividad, liderazgo, estrategia..."
                  />
                </div>
                {currentPage && <div className="text-sm text-gray-600">📖 Página actual: {currentPage}</div>}
                <div className="flex gap-2">
                  <Button onClick={captureInsight} disabled={loading} className="flex-1">
                    {loading ? "Guardando..." : "Capturar Insight"}
                  </Button>
                  <Button variant="outline" onClick={() => setIsCapturingInsight(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Lista de insights */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Insights de este Libro ({insights.length})
            </CardTitle>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar insights..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredInsights.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay insights capturados aún</p>
                <p className="text-sm">Comienza a capturar tus reflexiones y aprendizajes</p>
              </div>
            ) : (
              filteredInsights.map((insight) => (
                <Card key={insight.id} className="border-l-4 border-l-purple-500">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getInsightIcon(insight.insight_type)}
                        <Badge variant="outline" className="capitalize">
                          {insight.insight_type}
                        </Badge>
                        <Badge className={getImportanceColor(insight.importance)}>{insight.importance}</Badge>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(insight.created_at).toLocaleDateString()}
                        {insight.page_number && ` • Pág. ${insight.page_number}`}
                      </div>
                    </div>
                    <p className="text-gray-800 mb-3 leading-relaxed">{insight.content}</p>
                    {insight.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {insight.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            <Tags className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas detalladas */}
      {stats && stats.favorite_topics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Tus Temas Favoritos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {stats.favorite_topics.map((topic, index) => (
                <Badge key={topic} variant="outline" className="text-sm">
                  <Star className="h-3 w-3 mr-1" />#{topic}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default LibraryMirixIntegration
