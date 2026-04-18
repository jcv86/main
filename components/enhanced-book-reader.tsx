"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  BookOpen,
  Clock,
  User,
  Star,
  Bookmark,
  Share2,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Settings,
  Eye,
  Heart,
  Download,
} from "lucide-react"

interface BookReaderProps {
  bookId: string
  title: string
  author: string
  content: string
  estimatedReadTime: number
  category: string
  tags: string[]
  difficulty: string
}

export default function EnhancedBookReader({
  bookId,
  title,
  author,
  content,
  estimatedReadTime,
  category,
  tags,
  difficulty,
}: BookReaderProps) {
  const [readingProgress, setReadingProgress] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [notes, setNotes] = useState("")
  const [fontSize, setFontSize] = useState(16)
  const [readingTime, setReadingTime] = useState(0)
  const [showSettings, setShowSettings] = useState(false)

  // Simular páginas dividiendo el contenido
  const wordsPerPage = 300
  const words = content.split(" ")
  const totalPages = Math.ceil(words.length / wordsPerPage)

  const getCurrentPageContent = () => {
    const startIndex = (currentPage - 1) * wordsPerPage
    const endIndex = startIndex + wordsPerPage
    return words.slice(startIndex, endIndex).join(" ")
  }

  // Calcular progreso de lectura
  useEffect(() => {
    const progress = (currentPage / totalPages) * 100
    setReadingProgress(progress)
  }, [currentPage, totalPages])

  // Simular tiempo de lectura
  useEffect(() => {
    const timer = setInterval(() => {
      setReadingTime((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "principiante":
        return "bg-green/10 text-green"
      case "intermedio":
        return "bg-yellow/10 text-yellow"
      case "avanzado":
        return "bg-red/10 text-red-800"
      default:
        return "bg-muted/10 text-gray-800"
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">{title}</h1>
                <Badge className={getDifficultyColor(difficulty)}>{difficulty}</Badge>
              </div>

              <div className="flex items-center gap-4 text-muted/60 mb-4">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {author}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {Math.round(estimatedReadTime / 60)}h lectura
                </div>
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  Tiempo: {formatTime(readingTime)}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline">{category}</Badge>
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={isBookmarked ? "text-blue" : ""}
              >
                <Bookmark className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsLiked(!isLiked)}
                className={isLiked ? "text-red" : ""}
              >
                <Heart className="h-4 w-4" />
              </Button>

              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>

              <Button variant="outline" size="sm">
                <Download className="h-4 w-4" />
              </Button>

              <Button variant="outline" size="sm" onClick={() => setShowSettings(!showSettings)}>
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted/60">
              <span>Progreso de lectura</span>
              <span>{Math.round(readingProgress)}%</span>
            </div>
            <Progress value={readingProgress} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-8">
              {/* Settings Panel */}
              {showSettings && (
                <div className="mb-6 p-4 bg-muted/5 rounded-lg">
                  <h3 className="font-semibold mb-3">Configuración de Lectura</h3>
                  <div className="flex items-center gap-4">
                    <label className="text-sm">Tamaño de fuente:</label>
                    <Button variant="outline" size="sm" onClick={() => setFontSize(Math.max(12, fontSize - 2))}>
                      A-
                    </Button>
                    <span className="text-sm">{fontSize}px</span>
                    <Button variant="outline" size="sm" onClick={() => setFontSize(Math.min(24, fontSize + 2))}>
                      A+
                    </Button>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="prose max-w-none leading-relaxed" style={{ fontSize: `${fontSize}px` }}>
                <div className="whitespace-pre-wrap">{getCurrentPageContent()}</div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t">
                <Button variant="outline" onClick={prevPage} disabled={currentPage === 1}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Anterior
                </Button>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted/60">
                    Página {currentPage} de {totalPages}
                  </span>
                </div>

                <Button variant="outline" onClick={nextPage} disabled={currentPage === totalPages}>
                  Siguiente
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Reading Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estadísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted/60">Progreso</span>
                <span className="text-sm font-medium">{Math.round(readingProgress)}%</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted/60">Tiempo leyendo</span>
                <span className="text-sm font-medium">{formatTime(readingTime)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted/60">Páginas restantes</span>
                <span className="text-sm font-medium">{totalPages - currentPage}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted/60">Tiempo estimado</span>
                <span className="text-sm font-medium">
                  {Math.round((estimatedReadTime * (1 - readingProgress / 100)) / 60)}m
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <MessageCircle className="h-5 w-5 mr-2" />
                Mis Notas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Escribe tus notas y reflexiones aquí..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[120px] resize-none"
              />
              <Button className="w-full mt-3" size="sm">
                Guardar Nota
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Star className="h-4 w-4 mr-2" />
                Calificar Libro
              </Button>

              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Share2 className="h-4 w-4 mr-2" />
                Compartir Progreso
              </Button>

              <Button variant="outline" className="w-full justify-start bg-transparent">
                <BookOpen className="h-4 w-4 mr-2" />
                Libros Relacionados
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
