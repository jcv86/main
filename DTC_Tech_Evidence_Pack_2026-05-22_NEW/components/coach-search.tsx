'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Brain, Search, Loader2, BookOpen } from 'lucide-react'

interface Book {
  id: string | number
  title: string
  author: string
  category?: string
  description?: string
  rating?: number
  tags?: string[]
  key_topics?: string[]
}

interface SearchProps {
  userProfile?: any
}

export function CoachSearch({ userProfile }: SearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [reasoning, setReasoning] = useState('')

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/coach/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery, userProfile }),
      })

      if (!response.ok) throw new Error('Search failed')

      const data = await response.json()
      setResults(data.results || [])
      setReasoning(data.reasoning || '')
    } catch (error) {
      console.error('[v0] Search error:', error)
      setResults([])
      setReasoning('Error en la búsqueda')
    } finally {
      setIsLoading(false)
    }
  }

  const suggestedSearches = ['Liderazgo', 'Comunicación', 'Productividad', 'Inteligencia Emocional']

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cerebro Inteligente</CardTitle>
        <CardDescription>Búsqueda semántica sobre contenido personalizado basada en tu perfil</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Busca estrategias, libros, conceptos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSearch()}
                disabled={isLoading}
                className="pl-10"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={isLoading}
              className="bg-blue/80 hover:bg-blue/70"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Buscar'}
            </Button>
          </div>

          {/* Results or Empty State */}
          {results.length === 0 ? (
            <div className="bg-muted/5 dark:bg-transparent rounded-[28px] p-8 text-center">
              <Brain className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                {searchQuery ? `Buscando: "${searchQuery}"` : 'Empieza a buscar contenido personalizado'}
              </p>
              <p className="text-sm text-muted-foreground">
                El Cerebro Inteligente busca a través de libros, artículos y estrategias basadas en tu perfil de El Ritual
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reasoning && (
                <div className="bg-blue/5 dark:bg-blue/20 border border-blue/20 dark:border-blue/50 rounded-[28px] p-4">
                  <p className="text-sm text-blue dark:text-blue/10">
                    <strong>Búsqueda:</strong> {reasoning}
                  </p>
                </div>
              )}
              
              <div className="space-y-3">
                {results.map((book) => (
                  <div
                    key={`${book.id}-${book.title}`}
                    className="border border-muted/20 dark:border-muted/70 rounded-[28px] p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <BookOpen className="w-5 h-5 text-blue mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-semibold">{book.title}</h4>
                        <p className="text-sm text-muted-foreground dark:text-muted-foreground mb-2">
                          por {book.author}
                        </p>
                        {book.description && (
                          <p className="text-sm text-muted-foreground dark:text-white/85 mb-2">
                            {book.description}
                          </p>
                        )}
                        <div className="flex gap-2 flex-wrap">
                          {book.category && (
                            <span className="text-xs bg-muted/20 dark:bg-muted/70 px-2 py-1 rounded">
                              {book.category}
                            </span>
                          )}
                          {(book.key_topics || book.tags)?.slice(0, 2).map((tag) => (
                            <span key={tag} className="text-xs bg-blue/10 dark:bg-blue/30 text-blue dark:text-blue-200 px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      {book.rating && (
                        <div className="text-right flex-shrink-0">
                          <div className="text-2xl font-bold text-orange">{book.rating}</div>
                          <div className="text-xs text-muted-foreground">★</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Searches */}
          <div>
            <h3 className="font-semibold mb-3">Búsquedas sugeridas:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {suggestedSearches.map((search) => (
                <Button
                  key={search}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery(search)
                  }}
                  disabled={isLoading}
                >
                  {search}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
