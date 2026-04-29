'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ResourceCard } from '@/components/resource-card'
import { CategoryTabs } from '@/components/category-tabs'
import { Loader2, BookOpen, Search, Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  fetchAllResources,
  fetchResourcesByCategory,
  fetchCategories,
  type Resource
} from '@/lib/supabase/resource-library'

type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced'
type ResourceType = 'Template' | 'Course' | 'Article' | 'Tool' | 'Report' | 'Video'

export function ResourceLibrary() {
  const [resources, setResources] = useState<Resource[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyLevel | null>(null)
  const [typeFilter, setTypeFilter] = useState<ResourceType | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    setIsLoading(true)
    try {
      const [allResources, allCategories] = await Promise.all([
        fetchAllResources(),
        fetchCategories()
      ])
      setResources(allResources)
      setCategories(allCategories)
    } catch (error) {
      console.error('[v0] Error loading resources:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCategoryChange = async (category: string | null) => {
    setSelectedCategory(category)
    setIsLoading(true)
    try {
      if (category === null) {
        const allResources = await fetchAllResources()
        setResources(allResources)
      } else {
        const categoryResources = await fetchResourcesByCategory(category)
        setResources(categoryResources)
      }
    } catch (error) {
      console.error('[v0] Error filtering resources:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Filter resources by search term, difficulty, and type
  const filteredResources = useMemo(() => {
    return resources.filter(resource => {
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch = !searchTerm || (
        resource.title.toLowerCase().includes(searchLower) ||
        resource.description.toLowerCase().includes(searchLower) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchLower))
      )
      const matchesDifficulty = !difficultyFilter || resource.difficulty_level === difficultyFilter
      const matchesType = !typeFilter || resource.resource_type === typeFilter
      
      return matchesSearch && matchesDifficulty && matchesType
    })
  }, [resources, searchTerm, difficultyFilter, typeFilter])

  return (
    <Card className="bg-card border border-border rounded-2xl">
      <CardHeader className="bg-gradient-to-r from-training/10 to-exploration/10 border-b border-border">
        <CardTitle className="flex items-center gap-2 text-foreground text-2xl">
          <BookOpen className="w-6 h-6 text-training" />
          Biblioteca de Recursos
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          {filteredResources.length} de {resources.length} recursos disponibles
        </p>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {/* Search and Filter Section */}
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por título, descripción o tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-muted/5 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-exploration/50 focus:bg-muted/10 transition text-sm"
            />
          </div>

          {/* Filter Toggle and Filters */}
          <div className="space-y-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition"
            >
              <Filter className="w-4 h-4" />
              {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
            </button>

            {showFilters && (
              <div className="bg-muted/5 border border-border rounded-lg p-4 space-y-4">
                {/* Difficulty Filter */}
                <div>
                  <label className="text-sm font-semibold text-foreground mb-2 block">
                    Nivel de Dificultad
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setDifficultyFilter(null)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                        !difficultyFilter
                          ? 'bg-exploration text-background'
                          : 'bg-muted/20 text-muted-foreground hover:bg-muted/30'
                      }`}
                    >
                      Todos
                    </button>
                    {(['Beginner', 'Intermediate', 'Advanced'] as const).map(level => (
                      <button
                        key={level}
                        onClick={() => setDifficultyFilter(level)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                          difficultyFilter === level
                            ? 'bg-exploration text-background'
                            : 'bg-muted/20 text-muted-foreground hover:bg-muted/30'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Type Filter */}
                <div>
                  <label className="text-sm font-semibold text-foreground mb-2 block">
                    Tipo de Recurso
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setTypeFilter(null)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                        !typeFilter
                          ? 'bg-training text-background'
                          : 'bg-muted/20 text-muted-foreground hover:bg-muted/30'
                      }`}
                    >
                      Todos
                    </button>
                    {(['Template', 'Course', 'Article', 'Tool', 'Report', 'Video'] as const).map(type => (
                      <button
                        key={type}
                        onClick={() => setTypeFilter(type)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                          typeFilter === type
                            ? 'bg-training text-background'
                            : 'bg-muted/20 text-muted-foreground hover:bg-muted/30'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear Filters Button */}
                {(difficultyFilter || typeFilter || searchTerm) && (
                  <button
                    onClick={() => {
                      setDifficultyFilter(null)
                      setTypeFilter(null)
                      setSearchTerm('')
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-training hover:bg-training/10 rounded-lg transition"
                  >
                    <X className="w-3 h-3" />
                    Limpiar Filtros
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Category tabs */}
        <CategoryTabs
          categories={categories}
          onCategoryChange={handleCategoryChange}
          isLoading={isLoading}
        />

        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-6 h-6 text-blue/40 animate-spin" />
          </div>
        )}

        {/* Resources grid */}
        {!isLoading && filteredResources.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResources.map(resource => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && filteredResources.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-white/60">
              {searchTerm
                ? 'No se encontraron recursos que coincidan con tu búsqueda'
                : 'No hay recursos disponibles en esta categoría'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
