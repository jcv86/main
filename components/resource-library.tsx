'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ResourceCard } from '@/components/resource-card'
import { CategoryTabs } from '@/components/category-tabs'
import { Loader2, BookOpen } from 'lucide-react'
import {
  fetchAllResources,
  fetchResourcesByCategory,
  fetchCategories,
  type Resource
} from '@/lib/supabase/resource-library'

export function ResourceLibrary() {
  const [resources, setResources] = useState<Resource[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

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

  // Filter resources by search term
  const filteredResources = resources.filter(resource => {
    const searchLower = searchTerm.toLowerCase()
    return (
      resource.title.toLowerCase().includes(searchLower) ||
      resource.description.toLowerCase().includes(searchLower) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchLower))
    )
  })

  return (
    <Card className="bg-transparent border-muted/80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <BookOpen className="w-5 h-5 text-blue-400" />
          Biblioteca de Recursos Útiles
        </CardTitle>
        <p className="text-sm text-white/60 mt-2">
          {filteredResources.length} recursos disponibles
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search input */}
        <input
          type="text"
          placeholder="Buscar recursos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 bg-muted/40 border border-muted/60 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-500/50 text-sm"
        />

        {/* Category tabs */}
        <CategoryTabs
          categories={categories}
          onCategoryChange={handleCategoryChange}
          isLoading={isLoading}
        />

        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
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
