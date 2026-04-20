'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface SearchSuggestion {
  id: string
  title: string
  author: string
  category: string
  type: 'book' | 'author' | 'category'
}

interface AdvancedSearchProps {
  onSearch: (query: string) => void
  onFiltersChange?: (filters: any) => void
}

export function AdvancedBookSearch({ onSearch, onFiltersChange }: AdvancedSearchProps) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Fetch suggestions as user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([])
        return
      }

      try {
        const response = await fetch(
          `/api/books?search=${encodeURIComponent(query)}&limit=5`
        )
        const data = await response.json()
        
        const bookSuggestions = data.map((book: any) => ({
          id: book.id,
          title: book.title,
          author: book.author,
          category: book.category,
          type: 'book' as const,
        }))

        setSuggestions(bookSuggestions)
      } catch (error) {
        console.error('[v0] Error fetching suggestions:', error)
      }
    }

    const debounceTimer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounceTimer)
  }, [query])

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (searchQuery: string = query) => {
    onSearch(searchQuery)
    setShowSuggestions(false)
  }

  const addFilter = (filter: string) => {
    const newFilters = [...selectedFilters, filter]
    setSelectedFilters(newFilters)
    onFiltersChange?.(newFilters)
  }

  const removeFilter = (filter: string) => {
    const newFilters = selectedFilters.filter(f => f !== filter)
    setSelectedFilters(newFilters)
    onFiltersChange?.(newFilters)
  }

  return (
    <div className="w-full space-y-4">
      {/* Search Input */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-5 h-5 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Busca libros, autores, temas..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setShowSuggestions(true)
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch()
              }
            }}
            onFocus={() => query.length >= 2 && setShowSuggestions(true)}
            className="pl-10 pr-4"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 text-muted-foreground hover:text-muted-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute top-full left-0 right-0 mt-2 bg-transparent border border-muted/20 dark:border-muted/70 rounded-lg shadow-lg z-50"
          >
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                onClick={() => handleSearch(suggestion.title)}
                className="w-full px-4 py-3 text-left hover:bg-muted/5 dark:hover:bg-transparent border-b border-muted/10 dark:border-muted/80 last:border-b-0 flex items-center justify-between group"
              >
                <div>
                  <div className="font-medium text-foreground">{suggestion.title}</div>
                  <div className="text-sm text-muted-foreground dark:text-muted-foreground">
                    {suggestion.author} • {suggestion.category}
                  </div>
                </div>
                <Search className="w-4 h-4 text-muted-foreground group-hover:text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Filters */}
      {selectedFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedFilters.map((filter) => (
            <Badge
              key={filter}
              variant="secondary"
              className="cursor-pointer flex items-center gap-2"
              onClick={() => removeFilter(filter)}
            >
              {filter}
              <X className="w-3 h-3" />
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
