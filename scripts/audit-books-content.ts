import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

async function auditBooks() {
  console.log('📚 Auditando biblioteca de libros...\n')

  // Fetch all books
  const { data: books, error } = await supabase
    .from('knowledge_base')
    .select('id, title, author, category, content')
    .order('id', { ascending: true })

  if (error) {
    console.error('Error fetching books:', error)
    return
  }

  if (!books || books.length === 0) {
    console.log('No books found')
    return
  }

  console.log(`Total de libros en BD: ${books.length}\n`)

  // Analyze content
  let withContent = 0
  let withoutContent = 0
  let totalChars = 0
  const bookStats = []

  for (const book of books) {
    const contentLength = book.content ? book.content.length : 0
    
    if (contentLength > 0) {
      withContent++
      totalChars += contentLength
      bookStats.push({
        id: book.id,
        title: book.title,
        author: book.author,
        chars: contentLength,
        hasEnoughContent: contentLength >= 8000
      })
    } else {
      withoutContent++
    }
  }

  // Print statistics
  console.log('=== ESTADÍSTICAS GENERALES ===')
  console.log(`Libros con contenido: ${withContent}`)
  console.log(`Libros sin contenido: ${withoutContent}`)
  console.log(`Promedio de caracteres: ${totalChars > 0 ? Math.round(totalChars / withContent) : 0}\n`)

  // Books with 8000+ characters
  const booksWithEnoughContent = bookStats.filter(b => b.hasEnoughContent)
  console.log(`=== LIBROS CON 8000+ CARACTERES ===`)
  console.log(`Total: ${booksWithEnoughContent.length}\n`)
  
  booksWithEnoughContent.forEach((book, index) => {
    console.log(`${index + 1}. "${book.title}" - ${book.author}`)
    console.log(`   Caracteres: ${book.chars}\n`)
  })

  // Books that need content
  const booksNeedingContent = books.filter(b => !b.content || b.content.length === 0)
  console.log(`\n=== LIBROS SIN CONTENIDO (${booksNeedingContent.length}) ===\n`)
  booksNeedingContent.slice(0, 20).forEach((book, index) => {
    console.log(`${index + 1}. "${book.title}" - ${book.author}`)
  })
  
  if (booksNeedingContent.length > 20) {
    console.log(`... y ${booksNeedingContent.length - 20} más\n`)
  }

  // Summary
  console.log('\n=== RESUMEN ===')
  console.log(`Libros en español con contenido completo (8000+ chars): ${booksWithEnoughContent.length}/${books.length}`)
  console.log(`Cobertura: ${Math.round((booksWithEnoughContent.length / books.length) * 100)}%`)
}

auditBooks().catch(console.error)
