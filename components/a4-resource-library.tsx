import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Bookmark, BookOpen, Music, Video, Globe, Star, Filter } from "lucide-react"

interface Resource {
  id: string
  titulo: string
  descripcion: string
  autor?: string
  tipo: "articulo" | "video" | "podcast" | "libro"
  categoria: string
  nivel: "basico" | "intermedio" | "avanzado"
  url: string
  rating: number
  tags: string[]
  duracion?: string
  imagen?: string
  guardado?: boolean
}

interface A4ResourceLibraryProps {
  resources: Resource[]
  onSaveResource?: (resourceId: string) => void
  onRemoveResource?: (resourceId: string) => void
}

const getResourceIcon = (tipo: string) => {
  const icons: Record<string, React.ReactNode> = {
    articulo: <Globe className="w-4 h-4" />,
    video: <Video className="w-4 h-4" />,
    podcast: <Music className="w-4 h-4" />,
    libro: <BookOpen className="w-4 h-4" />,
  }
  return icons[tipo] || <Globe className="w-4 h-4" />
}

const getResourceColor = (tipo: string) => {
  const colors: Record<string, string> = {
    articulo: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    video: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
    podcast: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
    libro: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  }
  return colors[tipo] || "bg-gray-100"
}

const getNivelColor = (nivel: string) => {
  const colors: Record<string, string> = {
    "basico": "bg-green-50 text-green-700 border-green-200",
    "intermedio": "bg-blue-50 text-blue-700 border-blue-200",
    "avanzado": "bg-purple-50 text-purple-700 border-purple-200",
  }
  return colors[nivel] || "bg-gray-50"
}

export function A4ResourceLibrary({ resources, onSaveResource, onRemoveResource }: A4ResourceLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [savedResources, setSavedResources] = useState<Set<string>>(new Set())

  const categories = Array.from(new Set(resources.map(r => r.categoria)))
  const types = Array.from(new Set(resources.map(r => r.tipo)))
  const levels = Array.from(new Set(resources.map(r => r.nivel)))

  const filtered = resources.filter(resource => {
    const matchesSearch = resource.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          resource.descripcion.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || resource.categoria === selectedCategory
    const matchesLevel = !selectedLevel || resource.nivel === selectedLevel
    const matchesType = !selectedType || resource.tipo === selectedType
    
    return matchesSearch && matchesCategory && matchesLevel && matchesType
  })

  const handleSaveResource = (resourceId: string) => {
    const newSaved = new Set(savedResources)
    if (newSaved.has(resourceId)) {
      newSaved.delete(resourceId)
      onRemoveResource?.(resourceId)
    } else {
      newSaved.add(resourceId)
      onSaveResource?.(resourceId)
    }
    setSavedResources(newSaved)
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Bookmark className="w-8 h-8 text-green-600" />
        <div>
          <h2 className="text-2xl font-bold">Biblioteca Curada</h2>
          <p className="text-sm text-muted-foreground">
            Recursos verificados para tu aprendizaje profesional
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="space-y-4">
        <Input
          placeholder="Buscar recursos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Type Filter */}
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Tipo
            </label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={!selectedType ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(null)}
              >
                Todos
              </Button>
              {types.map(type => (
                <Button
                  key={type}
                  variant={selectedType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(type)}
                  className="gap-1"
                >
                  {getResourceIcon(type)}
                  {type}
                </Button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Categoría</label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={!selectedCategory ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                Todas
              </Button>
              {categories.map(cat => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          {/* Level Filter */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Nivel</label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={!selectedLevel ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedLevel(null)}
              >
                Todos
              </Button>
              {levels.map(level => (
                <Button
                  key={level}
                  variant={selectedLevel === level ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLevel(level)}
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Mostrando {filtered.length} de {resources.length} recursos
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(resource => (
          <Card key={resource.id} className="hover:shadow-lg transition flex flex-col">
            {resource.imagen && (
              <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                <img
                  src={resource.imagen}
                  alt={resource.titulo}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardHeader className="flex-1">
              <div className="flex items-start justify-between gap-2 mb-2">
                <Badge className={getResourceColor(resource.tipo)}>
                  {getResourceIcon(resource.tipo)}
                  <span className="ml-1">{resource.tipo}</span>
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSaveResource(resource.id)}
                  className="h-6 w-6 p-0"
                >
                  <Bookmark
                    className={`w-4 h-4 ${savedResources.has(resource.id) ? 'fill-current' : ''}`}
                  />
                </Button>
              </div>
              <CardTitle className="text-lg line-clamp-2">{resource.titulo}</CardTitle>
              <CardDescription className="line-clamp-2 mt-1">
                {resource.descripcion}
              </CardDescription>
              
              {/* Metadata */}
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="outline" className={getNivelColor(resource.nivel)}>
                  {resource.nivel}
                </Badge>
                {resource.autor && (
                  <Badge variant="outline" className="text-xs">
                    {resource.autor}
                  </Badge>
                )}
                {resource.duracion && (
                  <Badge variant="outline" className="text-xs">
                    {resource.duracion}
                  </Badge>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mt-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.round(resource.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
                <span className="text-sm text-muted-foreground ml-1">{resource.rating}/5</span>
              </div>

              {/* Tags */}
              {resource.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {resource.tags.slice(0, 2).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                  {resource.tags.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{resource.tags.length - 2}
                    </Badge>
                  )}
                </div>
              )}
            </CardHeader>

            <CardContent className="border-t pt-4">
              <Button
                className="w-full"
                variant="outline"
                onClick={() => window.open(resource.url, '_blank')}
              >
                Abrir Recurso
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No se encontraron recursos con esos filtros</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
