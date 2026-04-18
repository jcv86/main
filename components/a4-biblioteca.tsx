'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BookOpen, Search, Bookmark, Download, ExternalLink, Star, Clock, Users } from 'lucide-react'
import { getBibliotecaResources } from '@/lib/supabase/a4-queries'

interface Recurso {
  id: string
  titulo: string
  descripcion: string
  autor: string
  tipo: 'libro' | 'articulo' | 'podcast' | 'video' | 'reporte'
  categoria: string
  duracion?: string
  rating: number
  votos: number
  enlace?: string
  guardado?: boolean
  leido?: boolean
}

interface A4BibliotecaProps {
  recursos?: Recurso[]
}

const RECURSOS_DEFAULT: Recurso[] = [
  {
    id: '1',
    titulo: 'Thinking, Fast and Slow',
    descripcion: 'Exploración profunda de los dos sistemas de pensamiento que guían nuestras decisiones. Essential para entender sesgos cognitivos en negocios.',
    autor: 'Daniel Kahneman',
    tipo: 'libro',
    categoria: 'Toma de Decisiones',
    rating: 4.8,
    votos: 2341,
    enlace: 'https://www.amazon.com',
  },
  {
    id: '2',
    titulo: 'The Lean Startup',
    descripcion: 'Metodología revolucionaria para validar ideas de negocio rápidamente. Perfecto para entender cómo funcionan las startup en Chile.',
    autor: 'Eric Ries',
    tipo: 'libro',
    categoria: 'Emprendimiento',
    rating: 4.6,
    votos: 1823,
    enlace: 'https://www.amazon.com',
  },
  {
    id: '3',
    titulo: 'Never Split the Difference',
    descripcion: 'Técnicas de negociación de un ex-negociador del FBI. Aplicable en cualquier conversación profesional.',
    autor: 'Chris Voss',
    tipo: 'libro',
    categoria: 'Negociación',
    rating: 4.7,
    votos: 1567,
    enlace: 'https://www.amazon.com',
  },
  {
    id: '4',
    titulo: 'The Hard Thing About Hard Things',
    descripcion: 'Historias reales de liderazgo en momentos de crisis. Esencial para directivos y líderes en formación.',
    autor: 'Ben Horowitz',
    tipo: 'libro',
    categoria: 'Liderazgo',
    rating: 4.5,
    votos: 1245,
    enlace: 'https://www.amazon.com',
  },
]

const getTipoColor = (tipo: string) => {
  const colors: Record<string, { badge: string; icon: string }> = {
    libro: { badge: 'bg-blue/10 text-blue dark:bg-blue/30 dark:text-blue/30', icon: '📚' },
    articulo: { badge: 'bg-purple/10 text-purple dark:bg-purple/30 dark:text-purple/30', icon: '📄' },
    podcast: { badge: 'bg-green/10 text-green dark:bg-green/30 dark:text-green/30', icon: '🎧' },
    video: { badge: 'bg-red/10 text-red dark:bg-red/30 dark:text-red/30', icon: '🎬' },
    reporte: { badge: 'bg-orange/10 text-orange dark:bg-orange/30 dark:text-orange/30', icon: '📊' },
  }
  return colors[tipo] || { badge: 'bg-muted/10 text-gray-800', icon: '📖' }
}

const getCategoriaColor = (categoria: string) => {
  const colors: Record<string, string> = {
    'Liderazgo': 'bg-blue/10 text-blue dark:bg-blue/30 dark:text-indigo-300',
    'Emprendimiento': 'bg-red/10 text-red dark:bg-red/30 dark:text-pink-300',
    'Negociación': 'bg-cyan/10 text-cyan dark:bg-cyan/30 dark:text-cyan/30',
    'Toma de Decisiones': 'bg-yellow/10 text-yellow dark:bg-yellow/30 dark:text-yellow/30',
  }
  return colors[categoria] || 'bg-muted/10 text-gray-800'
}

export function A4Biblioteca({ recursos: initialRecursos }: A4BibliotecaProps) {
  const [recursos, setRecursos] = useState<Recurso[]>(initialRecursos || RECURSOS_DEFAULT)
  const [loading, setLoading] = useState(!initialRecursos)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTipo, setSelectedTipo] = useState<string | null>(null)
  const [selectedCategoria, setSelectedCategoria] = useState<string | null>(null)
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!initialRecursos) {
      fetchRecursos()
    }
  }, [initialRecursos])

  const fetchRecursos = async () => {
    try {
      console.log('[v0] Fetching biblioteca resources from Supabase')
      const data = await getBibliotecaResources()
      
      // Map Supabase fields to Recurso interface
      const mapped = data.map((item: any) => ({
        id: item.id,
        titulo: item.titulo || item.title || '',
        descripcion: item.descripcion || item.description || '',
        autor: item.autor || item.author || '',
        tipo: (item.tipo || item.type || 'libro').toLowerCase(),
        categoria: item.categoria || item.category || 'General',
        duracion: item.duracion || item.duration,
        rating: item.rating || 0,
        votos: item.votos || item.votes || 0,
        enlace: item.enlace || item.url || item.link,
      }))
      
      console.log('[v0] Loaded', mapped.length, 'resources from Supabase')
      setRecursos(mapped)
    } catch (error) {
      console.error('[v0] Error loading biblioteca:', error)
      setRecursos(RECURSOS_DEFAULT)
    } finally {
      setLoading(false)
    }
  }

  const categorias = [...new Set(recursos.map(r => r.categoria))]

  const filteredRecursos = recursos.filter(r => {
    const matchesSearch = r.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         r.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         r.autor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTipo = !selectedTipo || r.tipo === selectedTipo
    const matchesCategoria = !selectedCategoria || r.categoria === selectedCategoria
    return matchesSearch && matchesTipo && matchesCategoria
  })

  const tipos = [...new Set(recursos.map(r => r.tipo))]

  const handleSave = (id: string) => {
    setSavedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  return (
    <div className="w-full space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[28px] bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-xl">
            📚
          </div>
          <div>
            <h2 className="text-2xl font-bold">Biblioteca Curada</h2>
            <p className="text-sm text-muted-foreground">
              Recursos seleccionados para tu crecimiento profesional
            </p>
          </div>
        </div>
      </div>

      <Card className="bg-muted/30 border-0">
        <CardContent className="pt-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Busca libros, artículos, podcasts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div>
            <p className="text-sm font-semibold mb-2">Por Tipo:</p>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedTipo === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTipo(null)}
              >
                Todos
              </Button>
              {tipos.map(tipo => {
                const tipoInfo = getTipoColor(tipo)
                return (
                  <Button
                    key={tipo}
                    variant={selectedTipo === tipo ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTipo(tipo)}
                  >
                    {tipoInfo.icon} {tipo}
                  </Button>
                )
              })}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold mb-2">Por Categoría:</p>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedCategoria === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategoria(null)}
              >
                Todas
              </Button>
              {categorias.map(categoria => (
                <Button
                  key={categoria}
                  variant={selectedCategoria === categoria ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategoria(categoria)}
                >
                  {categoria}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recursos ({filteredRecursos.length})</h3>
          <Badge variant="outline">{savedItems.size} guardados</Badge>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Cargando biblioteca...</p>
          </div>
        ) : filteredRecursos.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            <p className="text-muted-foreground">No se encontraron recursos</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredRecursos.map(recurso => {
            const tipoInfo = getTipoColor(recurso.tipo)
            const isSaved = savedItems.has(recurso.id)

            return (
              <Card key={recurso.id} className="hover:shadow-lg transition-all group border-l-4 border-l-muted hover:border-l-primary">
                <CardContent className="pt-6 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-sm group-hover:text-purple transition line-clamp-2">
                        {recurso.titulo}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">{recurso.autor}</p>
                    </div>
                    <span className="text-lg flex-shrink-0">{tipoInfo.icon}</span>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {recurso.descripcion}
                  </p>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={tipoInfo.badge} variant="secondary">
                      {recurso.tipo}
                    </Badge>
                    <Badge className={getCategoriaColor(recurso.categoria)} variant="secondary">
                      {recurso.categoria}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      {recurso.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {recurso.votos}
                    </span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={() => handleSave(recurso.id)}
                    >
                      <Bookmark
                        className={`w-3 h-3 mr-1 ${
                          isSaved ? 'fill-primary text-purple' : 'text-muted-foreground'
                        }`}
                      />
                      {isSaved ? 'Guardado' : 'Guardar'}
                    </Button>
                    {recurso.enlace && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs"
                        asChild
                      >
                        <a href={recurso.enlace} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Ver
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
          </div>
        )}

        {filteredRecursos.length === 0 && !loading && (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <div className="text-muted-foreground">
                <p className="font-medium">No se encontraron recursos</p>
                <p className="text-sm">Intenta con otros filtros o términos de búsqueda</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 py-4">
        <Card className="bg-background">
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-blue">{recursos.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Recursos</p>
          </CardContent>
        </Card>
        <Card className="bg-background">
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-amber-600">{tipos.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Tipos</p>
          </CardContent>
        </Card>
        <Card className="bg-background">
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-green">{savedItems.size}</div>
            <p className="text-xs text-muted-foreground mt-1">Guardados</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
