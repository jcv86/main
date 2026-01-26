import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
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
  const contentStats: any[] = []

  for (const book of books) {
    const contentLength = book.content ? book.content.trim().length : 0
    
    if (contentLength > 0) {
      withContent++
      totalChars += contentLength
      contentStats.push({
        id: book.id,
        title: book.title,
        author: book.author,
        category: book.category,
        chars: contentLength,
        has8k: contentLength >= 8000
      })
    } else {
      withoutContent++
    }
  }

  // Summary
  console.log('📊 RESUMEN:')
  console.log(`✅ Libros CON contenido: ${withContent}`)
  console.log(`❌ Libros SIN contenido: ${withoutContent}`)
  console.log(`📝 Total de caracteres: ${totalChars.toLocaleString()}`)
  console.log(`⏱️  Promedio de caracteres por libro: ${Math.round(totalChars / withContent)}\n`)

  // Books with 8000+ characters
  const with8k = contentStats.filter(b => b.has8k)
  console.log(`🏆 Libros con 8000+ caracteres: ${with8k.length}\n`)

  if (with8k.length > 0) {
    console.log('📖 LIBROS CON 8000+ CARACTERES:')
    console.log('=' . repeat(100))
    with8k.forEach((book, idx) => {
      console.log(`${idx + 1}. "${book.title}" - ${book.author}`)
      console.log(`   Caracteres: ${book.chars.toLocaleString()} | Categoría: ${book.category}`)
    })
    console.log('=' . repeat(100))
  }

  // Full list with character counts
  console.log('\n📋 LISTA COMPLETA DE TODOS LOS LIBROS Y SU CONTENIDO:')
  console.log('=' . repeat(120))
  contentStats.forEach((book, idx) => {
    const status = book.chars >= 8000 ? '✅' : '⚠️'
    console.log(`${idx + 1}. [${status}] "${book.title}"`)
    console.log(`   👤 ${book.author}`)
    console.log(`   📁 ${book.category}`)
    console.log(`   📝 ${book.chars.toLocaleString()} caracteres`)
    console.log('')
  })

  // Export summary CSV
  console.log('\n📊 RESUMEN EN FORMATO CSV:')
  console.log('ID,Título,Autor,Categoría,Caracteres,Completo')
  contentStats.forEach(book => {
    const complete = book.chars >= 8000 ? 'SÍ' : 'NO'
    console.log(`${book.id},"${book.title}","${book.author}","${book.category}",${book.chars},${complete}`)
  })
}

auditBooks().catch(console.error)
