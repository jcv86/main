"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { FileText, MessageSquare, Loader2, BookOpen, Search, Brain } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Document {
  id: string
  title: string
  category: string
  tags: string[]
  file_type: string
  is_active: boolean
  created_at: string
  chunk_count: number
  type: "document"
}

interface Book {
  id: number
  title: string
  author: string
  category: string
  content: string
  tags: string[]
  slug: string
  type: "book"
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSources, setSelectedSources] = useState<Array<{ id: string | number; type: "document" | "book" }>>([])
  const [chatMessage, setChatMessage] = useState("")
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; content: string }>>([])
  const [chatting, setChatting] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    loadBrainContent()
  }, [])

  const loadBrainContent = async () => {
    try {
      // Cargar documentos activos del cerebro
      const docsResponse = await fetch("/api/admin/brain/documents")
      const docsData = await docsResponse.json()

      if (docsResponse.ok) {
        // Solo mostrar documentos activos
        const activeDocuments = (docsData.documents || [])
          .filter((doc: any) => doc.is_active)
          .map((doc: any) => ({ ...doc, type: "document" as const }))
        setDocuments(activeDocuments)
      }

      // Cargar libros de la biblioteca
      const booksResponse = await fetch("/api/books")
      const booksData = await booksResponse.json()

      if (booksResponse.ok) {
        const booksWithType = booksData.map((book: any) => ({ ...book, type: "book" as const }))
        setBooks(booksWithType)
      }
    } catch (error) {
      console.error("Error loading brain content:", error)
      toast({
        title: "Error",
        description: "Error al cargar el contenido del cerebro",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChat = async () => {
    if (!chatMessage.trim() || selectedSources.length === 0) return

    setChatting(true)
    const userMessage = chatMessage
    setChatMessage("")

    setChatMessages((prev) => [...prev, { role: "user", content: userMessage }])

    try {
      const response = await fetch("/api/documents/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          documentIds: selectedSources.filter((s) => s.type === "document").map((s) => s.id),
          bookIds: selectedSources.filter((s) => s.type === "book").map((s) => s.id),
        }),
      })

      if (!response.ok) {
        throw new Error("Chat request failed")
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ""

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          assistantMessage += chunk

          setChatMessages((prev) => {
            const newMessages = [...prev]
            if (newMessages[newMessages.length - 1]?.role === "assistant") {
              newMessages[newMessages.length - 1].content = assistantMessage
            } else {
              newMessages.push({ role: "assistant", content: assistantMessage })
            }
            return newMessages
          })
        }
      }
    } catch (error) {
      console.error("Error chatting:", error)
      toast({
        title: "Error",
        description: "Error al procesar tu pregunta",
        variant: "destructive",
      })
    } finally {
      setChatting(false)
    }
  }

  const toggleSourceSelection = (id: string | number, type: "document" | "book") => {
    setSelectedSources((prev) => {
      const exists = prev.some((s) => s.id === id && s.type === type)
      if (exists) {
        return prev.filter((s) => !(s.id === id && s.type === type))
      } else {
        return [...prev, { id, type }]
      }
    })
  }

  const isSourceSelected = (id: string | number, type: "document" | "book") => {
    return selectedSources.some((s) => s.id === id && s.type === type)
  }

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue/5 via-white to-purple/5 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Brain className="w-10 h-10 text-blue" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue to-purple-600 bg-clip-text text-transparent">
              Cerebro de Conocimiento
            </h1>
          </div>
          <p className="text-muted/60 max-w-2xl mx-auto">
            Chatea con nuestra base de conocimiento centralizada: {documents.length} documentos + {books.length} libros
            de la biblioteca
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Sources Section */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted/40 h-4 w-4" />
                  <Input
                    placeholder="Buscar en el cerebro..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Tabs defaultValue="documents" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="documents">
                    <FileText className="w-4 h-4 mr-2" />
                    Documentos ({documents.length})
                  </TabsTrigger>
                  <TabsTrigger value="biblioteca">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Biblioteca ({books.length})
                  </TabsTrigger>
                </TabsList>

                {/* Documents Tab */}
                <TabsContent value="documents" className="space-y-2 max-h-[600px] overflow-y-auto mt-4">
                  {loading ? (
                    <div className="text-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue/50" />
                      <p className="text-sm text-muted/50 mt-2">Cargando documentos...</p>
                    </div>
                  ) : filteredDocuments.length === 0 ? (
                    <div className="text-center py-8 text-muted/50">
                      <FileText className="w-12 h-12 mx-auto opacity-50 mb-2" />
                      <p className="text-sm">No se encontraron documentos</p>
                    </div>
                  ) : (
                    filteredDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          isSourceSelected(doc.id, "document")
                            ? "bg-blue/5 border-blue/30 shadow-sm"
                            : "hover:bg-muted/5 hover:border-muted/30"
                        }`}
                        onClick={() => toggleSourceSelection(doc.id, "document")}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-sm mb-1">{doc.title}</p>
                            <div className="flex flex-wrap gap-1 mb-1">
                              {doc.category && (
                                <Badge variant="outline" className="text-xs">
                                  {doc.category}
                                </Badge>
                              )}
                              <Badge variant="secondary" className="text-xs">
                                {doc.file_type?.toUpperCase()}
                              </Badge>
                            </div>
                            {doc.tags && doc.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {doc.tags.slice(0, 2).map((tag, i) => (
                                  <span key={i} className="text-xs text-muted/50">
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                            <p className="text-xs text-muted/40 mt-1">{doc.chunk_count} chunks procesados</p>
                          </div>
                          <FileText className="w-4 h-4 text-blue flex-shrink-0" />
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>

                {/* Biblioteca Tab */}
                <TabsContent value="biblioteca" className="space-y-2 max-h-[600px] overflow-y-auto mt-4">
                  {loading ? (
                    <div className="text-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-green" />
                      <p className="text-sm text-muted/50 mt-2">Cargando biblioteca...</p>
                    </div>
                  ) : filteredBooks.length === 0 ? (
                    <div className="text-center py-8 text-muted/50">
                      <BookOpen className="w-12 h-12 mx-auto opacity-50 mb-2" />
                      <p className="text-sm">No se encontraron libros</p>
                    </div>
                  ) : (
                    filteredBooks.map((book) => (
                      <div
                        key={book.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          isSourceSelected(book.id, "book")
                            ? "bg-green/5 border-green-300 shadow-sm"
                            : "hover:bg-muted/5 hover:border-muted/30"
                        }`}
                        onClick={() => toggleSourceSelection(book.id, "book")}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-sm mb-1">{book.title}</p>
                            <p className="text-xs text-muted/50 mb-1">{book.author}</p>
                            <div className="flex flex-wrap gap-1">
                              <Badge variant="outline" className="text-xs">
                                {book.category}
                              </Badge>
                              {book.tags?.slice(0, 2).map((tag, i) => (
                                <span key={i} className="text-xs text-muted/50">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <BookOpen className="w-4 h-4 text-green flex-shrink-0" />
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>
              </Tabs>

              {selectedSources.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Fuentes Seleccionadas</span>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedSources([])} className="text-xs">
                      Limpiar
                    </Button>
                  </div>
                  <Badge variant="secondary" className="w-full justify-center">
                    {selectedSources.length} fuente{selectedSources.length !== 1 ? "s" : ""}
                  </Badge>
                </div>
              )}
            </Card>
          </div>

          {/* Chat Section */}
          <div className="lg:col-span-2">
            <Card className="p-6 h-[700px] flex flex-col">
              <div className="flex items-center justify-between mb-4 pb-4 border-b">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue" />
                  Chat con el Cerebro
                </h2>
                {selectedSources.length > 0 && (
                  <Badge variant="secondary" className="text-sm">
                    {selectedSources.filter((s) => s.type === "document").length} docs +{" "}
                    {selectedSources.filter((s) => s.type === "book").length} libros
                  </Badge>
                )}
              </div>

              {selectedSources.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-muted/50">
                  <div className="text-center max-w-md">
                    <Brain className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="font-medium mb-2 text-lg">Selecciona fuentes para comenzar</p>
                    <p className="text-sm">
                      Elige documentos o libros de la biblioteca para hacer preguntas sobre su contenido. Puedes
                      seleccionar múltiples fuentes para obtener respuestas más completas.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                    {chatMessages.length === 0 ? (
                      <div className="text-center text-muted/50 py-8">
                        <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p className="font-medium mb-1">Haz tu primera pregunta</p>
                        <p className="text-sm">El cerebro analizará las fuentes seleccionadas para responderte</p>
                      </div>
                    ) : (
                      chatMessages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-[80%] p-4 rounded-lg shadow-sm ${
                              msg.role === "user"
                                ? "bg-gradient-to-r from-blue/50 to-blue text-white"
                                : "bg-white border border-muted/20 text-gray-900"
                            }`}
                          >
                            <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                          </div>
                        </div>
                      ))
                    )}
                    {chatting && (
                      <div className="flex justify-start">
                        <div className="bg-white border border-muted/20 p-4 rounded-lg shadow-sm">
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-blue/50" />
                            <span className="text-sm text-muted/60">Analizando fuentes...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Input
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleChat()}
                      placeholder="Pregunta algo sobre las fuentes seleccionadas..."
                      disabled={chatting}
                      className="flex-1"
                    />
                    <Button onClick={handleChat} disabled={!chatMessage.trim() || chatting} className="px-6">
                      {chatting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enviar"}
                    </Button>
                  </div>
                </>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
