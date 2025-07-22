"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Search, Star, Clock, Download, Eye } from "lucide-react"
import Link from "next/link"

interface Book {
  id: string
  title: string
  author: string
  description: string
  category: string
  rating: number
  readingTime: string
  coverUrl: string
  epubUrl: string
  isRead: boolean
  progress: number
  tags: string[]
}

export default function LibraryPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [books, setBooks] = useState<Book[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !loading && !user) {
      router.push("/auth/login")
      return
    }

    if (mounted && user) {
      // Datos de ejemplo de libros de desarrollo profesional
      const sampleBooks: Book[] = [
        {
          id: "1",
          title: "Atomic Habits",
          author: "James Clear",
          description: "Un método fácil y comprobado para desarrollar buenos hábitos y eliminar los malos.",
          category: "desarrollo-personal",
          rating: 4.8,
          readingTime: "4h 30min",
          coverUrl: "/placeholder.svg?height=300&width=200&text=Atomic+Habits",
          epubUrl: "/books/atomic-habits.epub",
          isRead: false,
          progress: 0,
          tags: ["hábitos", "productividad", "autoayuda"],
        },
        {
          id: "2",
          title: "The 7 Habits of Highly Effective People",
          author: "Stephen R. Covey",
          description: "Principios fundamentales para el éxito personal y profesional.",
          category: "liderazgo",
          rating: 4.7,
          readingTime: "6h 15min",
          coverUrl: "/placeholder.svg?height=300&width=200&text=7+Habits",
          epubUrl: "/books/7-habits.epub",
          isRead: true,
          progress: 100,
          tags: ["liderazgo", "efectividad", "principios"],
        },
        {
          id: "3",
          title: "Lean In",
          author: "Sheryl Sandberg",
          description: "Las mujeres, el trabajo y la voluntad de liderar.",
          category: "carrera",
          rating: 4.5,
          readingTime: "5h 20min",
          coverUrl: "/placeholder.svg?height=300&width=200&text=Lean+In",
          epubUrl: "/books/lean-in.epub",
          isRead: false,
          progress: 35,
          tags: ["liderazgo femenino", "carrera", "workplace"],
        },
        {
          id: "4",
          title: "Deep Work",
          author: "Cal Newport",
          description: "Reglas para el éxito enfocado en un mundo distraído.",
          category: "productividad",
          rating: 4.6,
          readingTime: "5h 45min",
          coverUrl: "/placeholder.svg?height=300&width=200&text=Deep+Work",
          epubUrl: "/books/deep-work.epub",
          isRead: false,
          progress: 0,
          tags: ["concentración", "productividad", "trabajo"],
        },
        {
          id: "5",
          title: "Emotional Intelligence 2.0",
          author: "Travis Bradberry",
          description: "Desarrolla tu inteligencia emocional para el éxito profesional.",
          category: "habilidades-blandas",
          rating: 4.4,
          readingTime: "3h 50min",
          coverUrl: "/placeholder.svg?height=300&width=200&text=EQ+2.0",
          epubUrl: "/books/eq-2.epub",
          isRead: false,
          progress: 60,
          tags: ["inteligencia emocional", "soft skills", "comunicación"],
        },
        {
          id: "6",
          title: "The Lean Startup",
          author: "Eric Ries",
          description: "Cómo los emprendedores de hoy utilizan la innovación continua.",
          category: "emprendimiento",
          rating: 4.3,
          readingTime: "4h 10min",
          coverUrl: "/placeholder.svg?height=300&width=200&text=Lean+Startup",
          epubUrl: "/books/lean-startup.epub",
          isRead: true,
          progress: 100,
          tags: ["startup", "innovación", "emprendimiento"],
        },
      ]

      setBooks(sampleBooks)
    }
  }, [mounted, user, loading, router])

  // Show loading state
  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando biblioteca...</p>
        </div>
      </div>
    )
  }

  // Don't render anything if not authenticated
  if (!user) {
    return null
  }

  const categories = [
    { id: "all", name: "Todos los libros", count: books.length },
    {
      id: "desarrollo-personal",
      name: "Desarrollo Personal",
      count: books.filter((b) => b.category === "desarrollo-personal").length,
    },
    { id: "liderazgo", name: "Liderazgo", count: books.filter((b) => b.category === "liderazgo").length },
    { id: "carrera", name: "Desarrollo de Carrera", count: books.filter((b) => b.category === "carrera").length },
    { id: "productividad", name: "Productividad", count: books.filter((b) => b.category === "productividad").length },
    {
      id: "habilidades-blandas",
      name: "Habilidades Blandas",
      count: books.filter((b) => b.category === "habilidades-blandas").length,
    },
    {
      id: "emprendimiento",
      name: "Emprendimiento",
      count: books.filter((b) => b.category === "emprendimiento").length,
    },
  ]

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || book.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const readBooks = books.filter((book) => book.isRead)
  const currentlyReading = books.filter((book) => book.progress > 0 && book.progress < 100)
  const toRead = books.filter((book) => book.progress === 0)

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Biblioteca de Desarrollo Profesional</h1>
          <p className="text-gray-600">Expande tus conocimientos con libros especializados</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar libros..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{books.length}</p>
                <p className="text-sm text-muted-foreground">Total de Libros</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Eye className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{readBooks.length}</p>
                <p className="text-sm text-muted-foreground">Libros Leídos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{currentlyReading.length}</p>
                <p className="text-sm text-muted-foreground">Leyendo Ahora</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Star className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">4.6</p>
                <p className="text-sm text-muted-foreground">Rating Promedio</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Todos ({books.length})</TabsTrigger>
          <TabsTrigger value="reading">Leyendo ({currentlyReading.length})</TabsTrigger>
          <TabsTrigger value="read">Leídos ({readBooks.length})</TabsTrigger>
          <TabsTrigger value="to-read">Por Leer ({toRead.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {/* Categories Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="text-xs"
              >
                {category.name} ({category.count})
              </Button>
            ))}
          </div>

          {/* Books Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <Card key={book.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="p-4">
                  <div className="aspect-[3/4] relative mb-4">
                    <img
                      src={book.coverUrl || "/placeholder.svg"}
                      alt={book.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    {book.progress > 0 && (
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="bg-black/50 rounded-full p-1">
                          <div className="bg-white rounded-full h-1" style={{ width: `${book.progress}%` }} />
                        </div>
                      </div>
                    )}
                  </div>

                  <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
                  <CardDescription className="text-sm">por {book.author}</CardDescription>

                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      {book.rating}
                    </div>
                    <span>•</span>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {book.readingTime}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{book.description}</p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {book.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {book.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{book.tags.length - 2}
                      </Badge>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <Link href={`/library/reader/${book.id}`} className="flex-1">
                      <Button className="w-full" size="sm">
                        <BookOpen className="h-4 w-4 mr-2" />
                        {book.progress > 0 ? "Continuar" : "Leer"}
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reading">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentlyReading.map((book) => (
              <Card key={book.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="p-4">
                  <div className="aspect-[3/4] relative mb-4">
                    <img
                      src={book.coverUrl || "/placeholder.svg"}
                      alt={book.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="bg-black/50 rounded-full p-1">
                        <div className="bg-white rounded-full h-1" style={{ width: `${book.progress}%` }} />
                      </div>
                      <div className="text-white text-xs text-center mt-1">{book.progress}% completado</div>
                    </div>
                  </div>

                  <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
                  <CardDescription className="text-sm">por {book.author}</CardDescription>
                </CardHeader>

                <CardContent className="p-4 pt-0">
                  <Link href={`/library/reader/${book.id}`}>
                    <Button className="w-full" size="sm">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Continuar Leyendo
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="read">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {readBooks.map((book) => (
              <Card key={book.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="p-4">
                  <div className="aspect-[3/4] relative mb-4">
                    <img
                      src={book.coverUrl || "/placeholder.svg"}
                      alt={book.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-green-500">✓ Completado</Badge>
                    </div>
                  </div>

                  <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
                  <CardDescription className="text-sm">por {book.author}</CardDescription>
                </CardHeader>

                <CardContent className="p-4 pt-0">
                  <Link href={`/library/reader/${book.id}`}>
                    <Button variant="outline" className="w-full bg-transparent" size="sm">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Releer
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="to-read">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {toRead.map((book) => (
              <Card key={book.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="p-4">
                  <div className="aspect-[3/4] relative mb-4">
                    <img
                      src={book.coverUrl || "/placeholder.svg"}
                      alt={book.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>

                  <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
                  <CardDescription className="text-sm">por {book.author}</CardDescription>

                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      {book.rating}
                    </div>
                    <span>•</span>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {book.readingTime}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{book.description}</p>

                  <Link href={`/library/reader/${book.id}`}>
                    <Button className="w-full" size="sm">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Comenzar a Leer
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
