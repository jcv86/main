"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Download, Copy } from "lucide-react"

interface Book {
  id: number
  title: string
  author: string
  category: string
  content: string
  slug: string
}

export default function BooksTablePage() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("/api/books")
        const data = await response.json()
        setBooks(data)
      } catch (error) {
        console.error("Error loading books:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [])

  const getWordCount = (text: string) => {
    if (!text) return 0
    return text.split(/\s+/).filter((word) => word.length > 0).length
  }

  const getEstimatedPages = (wordCount: number) => {
    // Assuming ~250 words per page
    return Math.ceil(wordCount / 250)
  }

  const getReadingTime = (wordCount: number) => {
    // Assuming 200 words per minute reading speed
    return Math.ceil(wordCount / 200)
  }

  const exportToCSV = () => {
    const headers = ["ID", "Título", "Autor", "Categoría", "Palabras", "Páginas (est.)", "Tiempo Lectura (min)"]

    const rows = books.map((book) => {
      const wordCount = getWordCount(book.content)
      const pages = getEstimatedPages(wordCount)
      const readingTime = getReadingTime(wordCount)

      return [book.id, `"${book.title}"`, `"${book.author}"`, book.category, wordCount, pages, readingTime].join(",")
    })

    const csv = [headers.join(","), ...rows].join("\n")

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "libros-detalle.csv"
    link.click()
  }

  const copyToClipboard = () => {
    const headers = ["ID", "Título", "Autor", "Categoría", "Palabras", "Páginas (est.)", "Tiempo Lectura (min)"]

    const rows = books.map((book) => {
      const wordCount = getWordCount(book.content)
      const pages = getEstimatedPages(wordCount)
      const readingTime = getReadingTime(wordCount)

      return [book.id, book.title, book.author, book.category, wordCount, pages, readingTime].join("\t")
    })

    const text = [headers.join("\t"), ...rows].join("\n")

    navigator.clipboard.writeText(text)
    alert("Tabla copiada al portapapeles")
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando libros...</p>
          </div>
        </div>
      </div>
    )
  }

  const totalWords = books.reduce((sum, book) => sum + getWordCount(book.content), 0)
  const totalPages = books.reduce((sum, book) => sum + getEstimatedPages(getWordCount(book.content)), 0)
  const totalReadingTime = books.reduce((sum, book) => sum + getReadingTime(getWordCount(book.content)), 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">Tabla de Libros - Detalles de Contenido</CardTitle>
            <div className="flex gap-2">
              <Button onClick={copyToClipboard} variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Copiar
              </Button>
              <Button onClick={exportToCSV} size="sm">
                <Download className="h-4 w-4 mr-2" />
                Descargar CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-blue/5 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Total Libros</p>
              <p className="text-2xl font-bold text-blue">{books.length}</p>
            </div>
            <div className="bg-green/5 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Total Palabras</p>
              <p className="text-2xl font-bold text-green">{totalWords.toLocaleString()}</p>
            </div>
            <div className="bg-purple/5 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Total Páginas (est.)</p>
              <p className="text-2xl font-bold text-purple">{totalPages.toLocaleString()}</p>
            </div>
            <div className="bg-orange/5 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Tiempo Total (horas)</p>
              <p className="text-2xl font-bold text-orange">{Math.round(totalReadingTime / 60)}</p>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">ID</TableHead>
                  <TableHead className="min-w-[250px]">Título</TableHead>
                  <TableHead className="min-w-[150px]">Autor</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead className="text-right">Palabras</TableHead>
                  <TableHead className="text-right">Páginas (est.)</TableHead>
                  <TableHead className="text-right">Lectura (min)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {books.map((book) => {
                  const wordCount = getWordCount(book.content)
                  const pages = getEstimatedPages(wordCount)
                  const readingTime = getReadingTime(wordCount)

                  return (
                    <TableRow key={book.id}>
                      <TableCell className="font-medium">{book.id}</TableCell>
                      <TableCell className="font-medium">{book.title}</TableCell>
                      <TableCell>{book.author}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue/10 text-blue">
                          {book.category}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">{wordCount.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{pages}</TableCell>
                      <TableCell className="text-right">{readingTime}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          <div className="mt-6 p-4 bg-muted/5 rounded-lg">
            <h3 className="font-semibold mb-2">Nota sobre los cálculos:</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>
                • <strong>Palabras:</strong> Conteo real de palabras en el contenido de cada libro
              </li>
              <li>
                • <strong>Páginas estimadas:</strong> Basado en ~250 palabras por página
              </li>
              <li>
                • <strong>Tiempo de lectura:</strong> Basado en una velocidad de lectura de 200 palabras por minuto
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
