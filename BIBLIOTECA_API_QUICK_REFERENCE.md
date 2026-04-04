## Quick Reference: Biblioteca API Usage

### 1. Fetch All Books with Filters
```typescript
// Search for leadership books
fetch('/api/books?category=Liderazgo&limit=10')

// Search by difficulty
fetch('/api/books?difficulty=intermedio&limit=5')

// Full-text search
fetch('/api/books?search=habitos&limit=10')

// By rating (all books with rating >= 4.0)
fetch('/api/books?rating=4.0&limit=10')

// By tags
fetch('/api/books?tags=liderazgo,hábitos&limit=10')

// Combined filters
fetch('/api/books?category=Productividad&difficulty=basico&rating=4.0&limit=5')
```

### 2. Get Single Book
```typescript
// Get book by ID
fetch('/api/books/book-id-here')

// Response includes: title, author, description, category, rating, pages, etc.
```

### 3. Get Personalized Recommendations
```typescript
// Get DISC profile-based recommendations
fetch('/api/book-recommendations?profile=D&limit=6')  // Dominance profile
fetch('/api/book-recommendations?profile=I&limit=6')  // Influence profile
fetch('/api/book-recommendations?profile=S&limit=6')  // Steadiness profile
fetch('/api/book-recommendations?profile=C&limit=6')  // Conscientiousness profile
```

### 4. Use Advanced Search Component
```typescript
import { AdvancedBookSearch } from '@/components/advanced-book-search'

<AdvancedBookSearch 
  onSearch={(query) => console.log('Searching:', query)}
  onFiltersChange={(filters) => console.log('Filters:', filters)}
/>
```

### 5. Book Detail Page
```
Visit: /biblioteca/[book-slug]
Example: /biblioteca/habitos-atomicos

Features:
- Progress tracking
- Bookmark toggle
- Share buttons
- Related books
- Key topics
```

---

## Category Options
- Liderazgo (Leadership)
- Productividad (Productivity)
- Inteligencia Emocional (Emotional Intelligence)
- Psicología (Psychology)
- Carrera (Career)
- Ventas (Sales)
- Innovación (Innovation)
- Equipos (Team Building)
- Comunicación (Communication)
- Filosofía (Philosophy)
- Sistemas (Systems)
- Relaciones (Relationships)
- Mindset
- Bienestar (Wellbeing)
- Estrategia (Strategy)

## Difficulty Levels
- basico (Basic)
- intermedio (Intermediate)
- avanzado (Advanced)

## Popular Tags
- habitos, productividad, liderazgo, comunicación, relaciones-laborales
- inteligencia-emocional, negociacion, carrera, networking, transformación
- éxito, disciplina, organización, tiempo, mentorship

---

## Example Usage in Components

### Search and Display Results
```tsx
'use client'
import { useState } from 'react'

export function BookSearchDemo() {
  const [books, setBooks] = useState([])

  const handleSearch = async (query: string) => {
    const response = await fetch(
      `/api/books?search=${encodeURIComponent(query)}&limit=10`
    )
    const data = await response.json()
    setBooks(data)
  }

  return (
    <div>
      <AdvancedBookSearch onSearch={handleSearch} />
      <div>
        {books.map(book => (
          <div key={book.id}>
            <h3>{book.title}</h3>
            <p>{book.author}</p>
            <p>Rating: {book.rating}/5</p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### Get Recommendations Based on Profile
```tsx
'use client'
import { useEffect, useState } from 'react'

export function RecommendedBooks({ userProfile }) {
  const [books, setBooks] = useState([])

  useEffect(() => {
    fetch(`/api/book-recommendations?profile=${userProfile}&limit=6`)
      .then(res => res.json())
      .then(data => setBooks(data))
  }, [userProfile])

  return (
    <div>
      {books.map(book => (
        <a key={book.id} href={`/biblioteca/${book.slug}`}>
          {book.title}
        </a>
      ))}
    </div>
  )
}
```

---

## Testing the APIs

### cURL Examples
```bash
# Get all books
curl http://localhost:3000/api/books

# Search for productivity books
curl "http://localhost:3000/api/books?category=Productividad&limit=5"

# Get recommendations for D profile
curl "http://localhost:3000/api/book-recommendations?profile=D&limit=6"

# Get single book
curl "http://localhost:3000/api/books/1"
```

---

**Last Updated**: 2026-04-05
**Version**: 1.0
