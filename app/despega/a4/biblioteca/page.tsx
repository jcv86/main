'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { ArrowLeft, Search, BookOpen, Heart, HeartOff, Clock, User } from 'lucide-react'

export default function A4BibliotecaPage() {
  const [loading, setLoading] = useState(true)
  const [books, setBooks] = useState<any[]>([])
  const [filteredBooks, setFilteredBooks] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('todos')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const supabase = createClient()

  useEffect(() => {
    loadBooks()
  }, [])

  useEffect(() => {
    filterBooks()
  }, [searchQuery, selectedCategory, books])

  const loadBooks = async () => {
    const { data } = await supabase
      .from('biblioteca')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (data) {
      setBooks(data)
      setFilteredBooks(data)
    }
    setLoading(false)
  }

  const filterBooks = () => {
    let filtered = books

    if (selectedCategory !== 'todos') {
      filtered = filtered.filter(book => book.category === selectedCategory)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(book =>
        book.title?.toLowerCase().includes(query) ||
        book.author?.toLowerCase().includes(query) ||
        book.key_topics?.some((t: string) => t.toLowerCase().includes(query))
      )
    }

    setFilteredBooks(filtered)
  }

  const toggleFavorite = (bookId: string) => {
    setFavorites(prev => {
      const newSet = new Set(prev)
      newSet.has(bookId) ? newSet.delete(bookId) : newSet.add(bookId)
      return newSet
    })
  }

  const categories = Array.from(new Set(books.map(b => b.category))).filter(Boolean)

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/despega/a4" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Volver a A4
          </Link>
          <div className="flex items-start gap-4 mb-8">
            <div className="p-3 bg-amber-500/10 rounded-lg">
              <BookOpen className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Biblioteca Curada</h1>
              <p className="text-muted-foreground">Libros, artículos y recursos seleccionados para tu crecimiento profesional. Con notas, highlights y progreso de lectura.</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Buscar libros, autores, temas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === 'todos' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('todos')}
            >
              Todos
            </Button>
            {categories.map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground mb-4">No hay libros que coincidan con tu búsqueda</p>
            <Button variant="outline" onClick={() => { setSearchQuery(''); setSelectedCategory('todos'); }}>
              Limpiar filtros
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBooks.map((book) => (
              <Card key={book.id} className="group border-0 bg-card/70 hover:bg-card backdrop-blur-sm transition-all duration-300 hover:shadow-md overflow-hidden flex flex-col">
                {/* Book Cover */}
                {book.cover_url && (
                  <div className="relative overflow-hidden bg-muted h-48">
                    <img
                      src={book.cover_url}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <CardHeader className="flex-1">
                  <div className="flex justify-between items-start gap-2 mb-3">
                    {book.category && (
                      <Badge variant="secondary" className="text-xs">
                        {book.category}
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFavorite(book.id)}
                      className="w-8 h-8 p-0"
                    >
                      {favorites.has(book.id) ? (
                        <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                      ) : (
                        <HeartOff className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                    {book.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex-1">
                  {book.author && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
                      <User className="w-4 h-4" />
                      {book.author}
                    </p>
                  )}

                  {book.key_topics && book.key_topics.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {book.key_topics.slice(0, 2).map((topic: string, idx: number) => (
                        <span key={idx} className="text-xs bg-muted px-2 py-1 rounded">
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}

                  {book.estimated_read_time && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mb-4">
                      <Clock className="w-3 h-3" />
                      {book.estimated_read_time} min lectura
                    </p>
                  )}

                  {book.rating && (
                    <p className="text-xs mb-4">
                      {'⭐'.repeat(Math.round(book.rating))} ({book.rating.toFixed(1)}/5)
                    </p>
                  )}

                  {book.url && (
                    <Button
                      asChild
                      variant="default"
                      size="sm"
                      className="w-full"
                    >
                      <a href={book.url} target="_blank" rel="noopener noreferrer">
                        Leer
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
