"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, Database, BookOpen, Trash2, Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "@/components/session-wrapper"

interface Document {
  id: string
  title: string
  file_type: string
  category: string
  tags: string[]
  is_active: boolean
  created_at: string
  chunk_count?: number
}

interface Book {
  id: string
  title: string
  author: string
  category: string
  is_active: boolean
}

export default function AdminBrainPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [books, setBooks] = useState<Book[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const { toast } = useToast()
  const { user } = useSession()

  useEffect(() => {
    if (user?.email) {
      checkAdminStatus()
      loadDocuments()
      loadBooks()
    }
  }, [user?.email])

  const checkAdminStatus = async () => {
    if (!user?.email) return

    try {
      const response = await fetch(`/api/admin/check?email=${encodeURIComponent(user.email)}`)
      const data = await response.json()
      setIsAdmin(data.isAdmin)

      if (!data.isAdmin) {
        toast({
          title: "Acceso Denegado",
          description: "No tienes permisos de administrador",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error checking admin status:", error)
    }
  }

  const loadDocuments = async () => {
    try {
      const response = await fetch("/api/admin/brain/documents")
      const data = await response.json()
      setDocuments(data.documents || [])
    } catch (error) {
      console.error("Error loading documents:", error)
    }
  }

  const loadBooks = async () => {
    try {
      const response = await fetch("/api/books")
      const data = await response.json()
      setBooks(data.books || [])
    } catch (error) {
      console.error("Error loading books:", error)
    }
  }

  const handleFileUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("[v0] ========== UPLOAD START ==========")

    const formData = new FormData(e.currentTarget)

    console.log("[v0] Form data contents:")
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`[v0]   ${key}:`, {
          name: value.name,
          type: value.type,
          size: value.size,
        })
      } else {
        console.log(`[v0]   ${key}:`, value)
      }
    }

    setIsUploading(true)
    try {
      console.log("[v0] Sending upload request to /api/admin/brain/upload...")

      const response = await fetch("/api/admin/brain/upload", {
        method: "POST",
        body: formData,
      })

      console.log("[v0] Response received:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries()),
      })

      const responseText = await response.text()
      console.log("[v0] Response text:", responseText)

      let data
      try {
        data = JSON.parse(responseText)
        console.log("[v0] Parsed JSON data:", data)
      } catch (parseError) {
        console.error("[v0] ERROR: Failed to parse response as JSON")
        console.error("[v0] Parse error:", parseError)
        console.error("[v0] Response was:", responseText)
        throw new Error(`Server returned invalid JSON: ${responseText.substring(0, 100)}`)
      }

      if (!response.ok) {
        console.error("[v0] ERROR: Response not OK")
        console.error("[v0] Error data:", data)
        throw new Error(data.error || "Error al subir documento")
      }

      console.log("[v0]  Upload successful!")

      toast({
        title: "Documento Subido",
        description: `${data.document.title} ha sido procesado y agregado al cerebro`,
      })

      loadDocuments()
      e.currentTarget.reset()

      console.log("[v0] ========== UPLOAD SUCCESS ==========")
    } catch (error: any) {
      console.error("[v0] ========== UPLOAD ERROR ==========")
      console.error("[v0] Error type:", error.constructor?.name)
      console.error("[v0] Error message:", error.message)
      console.error("[v0] Full error:", error)

      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const toggleDocumentStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/brain/documents/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !currentStatus }),
      })

      if (!response.ok) throw new Error("Error al actualizar estado")

      toast({
        title: "Estado Actualizado",
        description: `Documento ${!currentStatus ? "activado" : "desactivado"}`,
      })

      loadDocuments()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const deleteDocument = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este documento del cerebro?")) return

    try {
      const response = await fetch(`/api/admin/brain/documents/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Error al eliminar documento")

      toast({
        title: "Documento Eliminado",
        description: "El documento ha sido removido del cerebro",
      })

      loadDocuments()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Acceso Denegado</CardTitle>
            <CardDescription>No tienes permisos para acceder a esta página</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const stats = {
    totalDocuments: documents.length,
    activeDocuments: documents.filter((d) => d.is_active).length,
    totalBooks: books.length,
    totalChunks: documents.reduce((sum, d) => sum + (d.chunk_count || 0), 0),
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Administración del Cerebro</h1>
        <p className="text-muted-foreground">
          Gestiona el conocimiento centralizado: biblioteca + documentos + datasets
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Documentos Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDocuments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Documentos Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeDocuments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Libros en Biblioteca</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBooks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Chunks Procesados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalChunks}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="upload" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upload">
            <Upload className="w-4 h-4 mr-2" />
            Subir Contenido
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="w-4 h-4 mr-2" />
            Documentos ({documents.length})
          </TabsTrigger>
          <TabsTrigger value="books">
            <BookOpen className="w-4 h-4 mr-2" />
            Biblioteca ({books.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subir Nuevo Contenido al Cerebro</CardTitle>
              <CardDescription>
                Sube PDFs, CSVs, datasets u otros archivos para expandir el conocimiento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFileUpload} className="space-y-4">
                <div>
                  <Label htmlFor="file">Archivo *</Label>
                  <Input
                    id="file"
                    name="file"
                    type="file"
                    accept=".pdf,.csv,.txt,.doc,.docx"
                    required
                    disabled={isUploading}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Formatos soportados: PDF, CSV, TXT, DOC, DOCX</p>
                </div>

                <div>
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Ej: Guía de Desarrollo Profesional 2024"
                    required
                    disabled={isUploading}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Categoría</Label>
                    <Input
                      id="category"
                      name="category"
                      placeholder="Ej: Carrera, Psicometría, Datasets"
                      disabled={isUploading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tags">Tags (separados por coma)</Label>
                    <Input id="tags" name="tags" placeholder="Ej: desarrollo, carrera, guía" disabled={isUploading} />
                  </div>
                </div>

                <Button type="submit" disabled={isUploading} className="w-full">
                  {isUploading ? (
                    <>Procesando...</>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Subir y Procesar
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <div className="space-y-2">
            {documents.map((doc) => (
              <Card key={doc.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{doc.title}</h3>
                      {!doc.is_active && <Badge variant="secondary">Inactivo</Badge>}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {doc.file_type?.toUpperCase()}
                      </span>
                      {doc.category && (
                        <span className="flex items-center gap-1">
                          <Database className="w-3 h-3" />
                          {doc.category}
                        </span>
                      )}
                      <span>{doc.chunk_count || 0} chunks</span>
                      <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                    </div>
                    {doc.tags && doc.tags.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {doc.tags.map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => toggleDocumentStatus(doc.id, doc.is_active)}>
                      {doc.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => deleteDocument(doc.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {documents.length === 0 && (
              <Card>
                <CardContent className="text-center py-8 text-muted-foreground">
                  No hay documentos en el cerebro. Sube el primer documento.
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="books" className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-4">
                Los libros de la biblioteca están automáticamente disponibles en el cerebro. Gestiona la biblioteca
                desde la sección de administración de usuarios.
              </p>
              <div className="text-2xl font-bold">{books.length} libros disponibles</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
