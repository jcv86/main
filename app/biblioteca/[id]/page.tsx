'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, BookOpen, User, Star, Share2, Bookmark, AlertCircle, TrendingUp, CheckCircle } from 'lucide-react'
import Link from 'next/link'

interface Book {
  id: string
  title: string
  author: string
  description: string
  category: string
  rating: number
  pages: number
  published_year: number
  difficulty: string
  reading_time: string
  key_topics: string[]
  tags: string[]
  is_recommended: boolean
  content?: string
  cover_url?: string
}

export default function BookDetailPage() {
  const params = useParams()
  const router = useRouter()
  const bookId = params.id as string
  
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [relatedBooks, setRelatedBooks] = useState<Book[]>([])
  const [readingProgress, setReadingProgress] = useState(0)
  const [showProgress, setShowProgress] = useState(false)

  useEffect(() => {
    const loadBook = async () => {
      try {
        const response = await fetch(`/api/books/${bookId}`)
        if (!response.ok) throw new Error('Book not found')
        const data = await response.json()
        setBook(data)
        
        // Load related books
        if (data.category) {
          const relatedResponse = await fetch(`/api/books?category=${data.category}&limit=3`)
          const related = await relatedResponse.json()
          setRelatedBooks(related.filter((b: Book) => b.id !== bookId))
        }
        
        // Check if bookmarked
        const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]')
        setIsBookmarked(bookmarks.includes(bookId))
        
        // Load reading progress
        const progress = localStorage.getItem(`progress_${bookId}`)
        setReadingProgress(progress ? parseInt(progress) : 0)
      } catch (error) {
        console.error('[v0] Error loading book:', error)
      } finally {
        setLoading(false)
      }
    }

    loadBook()
  }, [bookId])

  const handleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]')
    if (isBookmarked) {
      const updated = bookmarks.filter((id: string) => id !== bookId)
      localStorage.setItem('bookmarks', JSON.stringify(updated))
    } else {
      bookmarks.push(bookId)
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
    }
    setIsBookmarked(!isBookmarked)
  }

  const handleProgressUpdate = (newProgress: number) => {
    setReadingProgress(newProgress)
    localStorage.setItem(`progress_${bookId}`, newProgress.toString())
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: book?.title,
        text: `Estoy leyendo "${book?.title}" por ${book?.author}`,
        url: window.location.href,
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-slate-950 dark:to-slate-900 p-4">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" onClick={() => router.back()} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 dark:bg-slate-700 rounded-lg mb-6"></div>
            <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2 mb-8"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-slate-950 dark:to-slate-900 p-4 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-lg font-semibold mb-4">Libro no encontrado</p>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Lo sentimos, no pudimos encontrar este libro.</p>
            <Button onClick={() => router.push('/biblioteca')} className="w-full">
              Volver a la Biblioteca
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const difficultyColors: Record<string, string> = {
    'basico': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'intermedio': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'avanzado': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Navigation */}
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>

        {/* Main Book Card */}
        <Card className="mb-8 border-2 border-purple-200 dark:border-purple-900">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Book Cover Placeholder */}
              <div className="md:col-span-1">
                <div className="bg-gradient-to-br from-purple-400 to-blue-600 rounded-lg h-96 flex items-center justify-center">
                  <BookOpen className="w-32 h-32 text-white opacity-30" />
                </div>
                <Button 
                  onClick={handleBookmark} 
                  className="w-full mt-4"
                  variant={isBookmarked ? 'default' : 'outline'}
                >
                  <Bookmark className="w-4 h-4 mr-2" />
                  {isBookmarked ? 'Guardado' : 'Guardar'}
                </Button>
              </div>

              {/* Book Info */}
              <div className="md:col-span-2">
                <div className="mb-4 flex flex-wrap gap-2">
                  <Badge variant="default" className="bg-purple-600">{book.category}</Badge>
                  {book.is_recommended && (
                    <Badge className="bg-green-600 flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Recomendado
                    </Badge>
                  )}
                  <Badge className={difficultyColors[book.difficulty?.toLowerCase() || 'intermedio']}>
                    {book.difficulty}
                  </Badge>
                </div>

                <h1 className="text-4xl font-bold mb-2 text-foreground">{book.title}</h1>
                
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-gray-500" />
                  <span className="text-lg text-gray-700 dark:text-gray-300">{book.author}</span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(book.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 dark:text-gray-400">({book.rating}/5.0)</span>
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg">{book.description}</p>

                {/* Book Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 dark:bg-slate-800 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Páginas</div>
                    <div className="text-2xl font-bold text-blue-600">{book.pages}</div>
                  </div>
                  <div className="bg-green-50 dark:bg-slate-800 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Tiempo Lectura</div>
                    <div className="text-2xl font-bold text-green-600">{book.reading_time}</div>
                  </div>
                  <div className="bg-purple-50 dark:bg-slate-800 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Año</div>
                    <div className="text-2xl font-bold text-purple-600">{book.published_year}</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Comenzar Lectura
                  </Button>
                  <Button variant="outline" onClick={handleShare}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Compartir
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reading Progress */}
        {showProgress && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Mi Progreso de Lectura
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>{readingProgress}% completado</span>
                    <span className="text-sm text-gray-600">{Math.round(readingProgress * book.pages / 100)} páginas</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all" 
                      style={{ width: `${readingProgress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {[25, 50, 75, 100].map((percent) => (
                    <Button
                      key={percent}
                      variant={readingProgress === percent ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleProgressUpdate(percent)}
                    >
                      {percent}%
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Key Topics */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Temas Clave</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {book.key_topics?.map((topic) => (
                <Badge key={topic} variant="secondary">{topic}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Etiquetas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {book.tags?.map((tag) => (
                <Link key={tag} href={`/biblioteca?tag=${tag}`}>
                  <Badge variant="outline" className="cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900">
                    #{tag}
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Related Books */}
        {relatedBooks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Libros Relacionados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {relatedBooks.map((relatedBook) => (
                  <Card key={relatedBook.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm line-clamp-2">{relatedBook.title}</CardTitle>
                      <div className="flex items-center text-xs text-gray-600 mt-1">
                        <User className="w-3 h-3 mr-1" />
                        {relatedBook.author}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => router.push(`/biblioteca/${relatedBook.id}`)}
                      >
                        Ver Detalles
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
