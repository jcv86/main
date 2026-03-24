"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash2, BookOpen, TrendingUp, Users, BarChart3 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface KnowledgeBook {
  id: number
  title: string
  category: string
  content: string
  author: string
  tags: string[]
  slug: string
  read_count: number
  created_at: string
  updated_at: string
}

export default function AdminKnowledgeBasePage() {
  const [books, setBooks] = useState<KnowledgeBook[]>([])
  const [filteredBooks, setFilteredBooks] = useState<KnowledgeBook[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingBook, setEditingBook] = useState<KnowledgeBook | null>(null)
  const { toast } = useToast()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    content: "",
    tags: "",
  })

  useEffect(() => {
    loadBooks()
  }, [])

  useEffect(() => {
    filterBooks()
  }, [books, searchTerm, selectedCategory])

  const loadBooks = async () => {
    try {
      setLoading(true)
      const { data: booksData, error: booksError } = await supabase
        .from("knowledge_base")
        .select("*")
        .order("created_at", { ascending: false })

      if (booksError) throw booksError

      const { data: categoriesData, error: categoriesError } = await supabase
        .from("knowledge_base")
        .select("category")
        .order("category")

      if (categoriesError) throw categoriesError

      const uniqueCategories = [...new Set(categoriesData?.map((c: { category: string }) => c.category) || [])]

      setBooks(booksData || [])
      setCategories(uniqueCategories)
    } catch (error) {
      console.error("Error loading books:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los libros",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterBooks = () => {
    let filtered = books

    if (searchTerm) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.content.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((book) => book.category === selectedCategory)
    }

    setFilteredBooks(filtered)
  }

  const handleAddBook = async () => {
    try {
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")

      const { data, error } = await supabase
        .from("knowledge_base")
        .insert({
          title: formData.title,
          author: formData.author,
          category: formData.category,
          content: formData.content,
          tags: tagsArray,
          slug: slug,
          read_count: 0,
        })
        .select()
        .single()

      if (error) throw error

      setBooks((prev) => [data, ...prev])
      setIsAddDialogOpen(false)
      resetForm()
      toast({
        title: "Éxito",
        description: "Libro agregado correctamente",
      })
    } catch (error) {
      console.error("Error adding book:", error)
      toast({
        title: "Error",
        description: "No se pudo agregar el libro",
        variant: "destructive",
      })
    }
  }

  const handleEditBook = async () => {
    if (!editingBook) return

    try {
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")

      const { data, error } = await supabase
        .from("knowledge_base")
        .update({
          title: formData.title,
          author: formData.author,
          category: formData.category,
          content: formData.content,
          tags: tagsArray,
          slug: slug,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingBook.id)
        .select()
        .single()

      if (error) throw error

      setBooks((prev) => prev.map((book) => (book.id === editingBook.id ? data : book)))
      setIsEditDialogOpen(false)
      setEditingBook(null)
      resetForm()
      toast({
        title: "Éxito",
        description: "Libro actualizado correctamente",
      })
    } catch (error) {
      console.error("Error updating book:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el libro",
        variant: "destructive",
      })
    }
  }

  const handleDeleteBook = async (bookId: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este libro?")) return

    try {
      const { error } = await supabase.from("knowledge_base").delete().eq("id", bookId)

      if (error) throw error

      setBooks((prev) => prev.filter((book) => book.id !== bookId))
      toast({
        title: "Éxito",
        description: "Libro eliminado correctamente",
      })
    } catch (error) {
      console.error("Error deleting book:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el libro",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (book: KnowledgeBook) => {
    setEditingBook(book)
    setFormData({
      title: book.title,
      author: book.author,
      category: book.category,
      content: book.content,
      tags: book.tags.join(", "),
    })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      category: "",
      content: "",
      tags: "",
    })
  }

  const getStats = () => {
    const totalBooks = books.length
    const totalReads = books.reduce((sum, book) => sum + book.read_count, 0)
    const avgReads = totalBooks > 0 ? Math.round(totalReads / totalBooks) : 0
    const totalCategories = categories.length

    return { totalBooks, totalReads, avgReads, totalCategories }
  }

  const stats = getStats()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <BookOpen className="h-12 w-12 animate-pulse mx-auto mb-4 text-blue-600" />
          <p>Cargando panel de administración...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Administración de Biblioteca</h1>
          <p className="text-gray-600">Gestiona la base de conocimiento de la plataforma</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Libro
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Libro</DialogTitle>
              <DialogDescription>Completa la información del libro para agregarlo a la biblioteca</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Título del libro"
                />
              </div>
              <div>
                <Label htmlFor="author">Autor</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="Nombre del autor"
                />
              </div>
              <div>
                <Label htmlFor="category">Categoría</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                    <SelectItem value="new">+ Nueva categoría</SelectItem>
                  </SelectContent>
                </Select>
                {formData.category === "new" && (
                  <Input
                    className="mt-2"
                    placeholder="Nombre de la nueva categoría"
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                )}
              </div>
              <div>
                <Label htmlFor="content">Contenido/Descripción</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Descripción del contenido del libro"
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="tags">Tags (separados por comas)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="liderazgo, productividad, desarrollo personal"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleAddBook} className="flex-1">
                  Agregar Libro
                </Button>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Libros</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBooks}</div>
            <p className="text-xs text-muted-foreground">En la biblioteca</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorías</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCategories}</div>
            <p className="text-xs text-muted-foreground">Diferentes temas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lecturas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReads}</div>
            <p className="text-xs text-muted-foreground">Veces leídos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio Lecturas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgReads}</div>
            <p className="text-xs text-muted-foreground">Por libro</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar libros por título, autor o contenido..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrar por categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Books Table */}
      <Card>
        <CardHeader>
          <CardTitle>Libros ({filteredBooks.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Autor</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Lecturas</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBooks.map((book) => (
                <TableRow key={book.id}>
                  <TableCell className="font-medium">{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{book.category}</Badge>
                  </TableCell>
                  <TableCell>{book.read_count}</TableCell>
                  <TableCell>{new Date(book.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(book)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteBook(book.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Libro</DialogTitle>
            <DialogDescription>Modifica la información del libro</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Título</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-author">Autor</Label>
              <Input
                id="edit-author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-category">Categoría</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-content">Contenido/Descripción</Label>
              <Textarea
                id="edit-content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="edit-tags">Tags (separados por comas)</Label>
              <Input
                id="edit-tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleEditBook} className="flex-1">
                Guardar Cambios
              </Button>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
