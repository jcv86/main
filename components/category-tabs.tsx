'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { fetchResourceCounts } from '@/lib/supabase/resource-library'

interface CategoryTabsProps {
  onCategoryChange: (category: string | null) => void
  categories: string[]
  isLoading?: boolean
}

export function CategoryTabs({
  onCategoryChange,
  categories,
  isLoading = false
}: CategoryTabsProps) {
  const [resourceCounts, setResourceCounts] = useState<Record<string, number>>({})
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    loadResourceCounts()
  }, [])

  const loadResourceCounts = async () => {
    const counts = await fetchResourceCounts()
    setResourceCounts(counts)
  }

  const handleCategoryClick = (category: string | null) => {
    setSelectedCategory(category)
    onCategoryChange(category)
  }

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {/* All Resources button */}
      <Button
        onClick={() => handleCategoryClick(null)}
        variant={selectedCategory === null ? 'default' : 'outline'}
        className={`text-xs ${
          selectedCategory === null
            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
            : 'text-white/70 hover:text-white border-muted/60 hover:border-muted/80'
        }`}
        disabled={isLoading}
      >
        Todos ({Object.values(resourceCounts).reduce((a, b) => a + b, 0)})
      </Button>

      {/* Category buttons */}
      {categories.map(category => (
        <Button
          key={category}
          onClick={() => handleCategoryClick(category)}
          variant={selectedCategory === category ? 'default' : 'outline'}
          className={`text-xs ${
            selectedCategory === category
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
              : 'text-white/70 hover:text-white border-muted/60 hover:border-muted/80'
          }`}
          disabled={isLoading}
        >
          {category} ({resourceCounts[category] || 0})
        </Button>
      ))}
    </div>
  )
}
