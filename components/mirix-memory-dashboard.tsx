"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "@/hooks/use-toast"
import { Brain, Plus, Search, Eye, Trash2, RefreshCw, Database, AlertCircle, Lightbulb } from "lucide-react"
import type { MirixMemory, MemoryType, ImportanceLevel } from "@/lib/mirix-memory"

interface MirixMemoryDashboardProps {
  userId: string
}

// Mock data for when API is unavailable
const mockMemories: MirixMemory[] = [
  {
    id: "1",
    user_id: "demo-user",
    agent_id: "career-coach",
    memory_type: "preference",
    title: "Preferencia de trabajo remoto",
    content: "El usuario prefiere trabajar de forma remota y valora la flexibilidad horaria.",
    metadata: { source: "conversation", confidence: 0.9 },
    importance: "high",
    tags: ["trabajo-remoto", "flexibilidad"],
    access_count: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    user_id: "demo-user",
    agent_id: "career-coach",
    memory_type: "goal",
    title: "Meta profesional: Liderazgo",
    content: "Quiere desarrollar habilidades de liderazgo y gestión de equipos en los próximos 2 años.",
    metadata: { timeline: "2 años", priority: "alta" },
    importance: "critical",
    tags: ["liderazgo", "gestión", "desarrollo"],
    access_count: 8,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
]

const mockStats = {
  total_memories: 2,
  by_type: { conversation: 0, preference: 1, insight: 0, goal: 1, context: 0 },
  by_importance: { low: 0, medium: 0, high: 1, critical: 1 },
  total_access_count: 13,
  recent_memories: 2,
}

export function MirixMemoryDashboard({ userId }: MirixMemoryDashboardProps) {
  const [memories, setMemories] = useState<MirixMemory[]>([])
  const [stats, setStats] = useState<any>(mockStats)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<MemoryType | "all">("all")
  const [filterImportance, setFilterImportance] = useState<ImportanceLevel | "all">("all")
  const [isOffline, setIsOffline] = useState(false)

  // Create memory form state
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [createForm, setCreateForm] = useState({
    title: "",
    content: "",
    memory_type: "conversation" as MemoryType,
    importance: "medium" as ImportanceLevel,
    agent_id: "career-coach",
    tags: "",
  })

  // Detail dialog state
  const [selectedMemory, setSelectedMemory] = useState<MirixMemory | null>(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)

  // Load data with fallback to mock data
  const loadData = async (showLoadingState = true) => {
    if (showLoadingState) setLoading(true)
    setError(null)

    try {
      // Try to load from API first
      const [memoriesResponse, statsResponse] = await Promise.all([
        fetch(`/api/mirix?action=memories&user_id=${userId}&limit=100`),
        fetch(`/api/mirix?action=stats&user_id=${userId}`),
      ])

      if (memoriesResponse.ok && statsResponse.ok) {
        const memoriesData = await memoriesResponse.json()
        const statsData = await statsResponse.json()

        setMemories(memoriesData.memories || [])
        setStats(statsData.stats || mockStats)
        setIsOffline(false)

        // Cache data locally
        localStorage.setItem(`mirix_memories_${userId}`, JSON.stringify(memoriesData.memories || []))
        localStorage.setItem(`mirix_stats_${userId}`, JSON.stringify(statsData.stats || mockStats))
      } else {
        throw new Error("API unavailable")
      }
    } catch (error) {
      console.warn("API unavailable, using cached/mock data:", error)
      setIsOffline(true)

      // Try to load from cache first
      try {
        const cachedMemories = localStorage.getItem(`mirix_memories_${userId}`)
        const cachedStats = localStorage.getItem(`mirix_stats_${userId}`)

        if (cachedMemories && cachedStats) {
          setMemories(JSON.parse(cachedMemories))
          setStats(JSON.parse(cachedStats))
        } else {
          // Fall back to mock data
          setMemories(mockMemories)
          setStats(mockStats)
        }
      } catch (cacheError) {
        // Final fallback to mock data
        setMemories(mockMemories)
        setStats(mockStats)
      }

      setError("Usando datos locales - API no disponible")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [userId])

  // Create memory
  const handleCreateMemory = async () => {
    if (!createForm.title.trim() || !createForm.content.trim()) {
      toast({
        title: "Error",
        description: "Título y contenido son requeridos",
        variant: "destructive",
      })
      return
    }

    try {
      const tags = createForm.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)

      if (isOffline) {
        // Create memory locally when offline
        const newMemory: MirixMemory = {
          id: Date.now().toString(),
          user_id: userId,
          agent_id: createForm.agent_id,
          memory_type: createForm.memory_type,
          title: createForm.title,
          content: createForm.content,
          metadata: { created_offline: true },
          importance: createForm.importance,
          tags,
          access_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        const updatedMemories = [newMemory, ...memories]
        setMemories(updatedMemories)
        localStorage.setItem(`mirix_memories_${userId}`, JSON.stringify(updatedMemories))

        toast({
          title: "Memoria creada (offline)",
          description: "La memoria se sincronizará cuando la conexión esté disponible",
        })
      } else {
        const response = await fetch("/api/mirix", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "store_memory",
            user_id: userId,
            agent_id: createForm.agent_id,
            memory_type: createForm.memory_type,
            title: createForm.title,
            content: createForm.content,
            importance: createForm.importance,
            tags,
          }),
        })

        if (response.ok) {
          toast({
            title: "Memoria creada",
            description: "La memoria se ha guardado exitosamente",
          })
          await loadData(false)
        } else {
          throw new Error("Failed to create memory")
        }
      }

      // Reset form
      setCreateForm({
        title: "",
        content: "",
        memory_type: "conversation",
        importance: "medium",
        agent_id: "career-coach",
        tags: "",
      })
      setShowCreateDialog(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear la memoria",
        variant: "destructive",
      })
    }
  }

  // Delete memory
  const handleDeleteMemory = async (memoryId: string) => {
    try {
      if (isOffline) {
        // Delete locally when offline
        const updatedMemories = memories.filter((m) => m.id !== memoryId)
        setMemories(updatedMemories)
        localStorage.setItem(`mirix_memories_${userId}`, JSON.stringify(updatedMemories))

        toast({
          title: "Memoria eliminada (offline)",
          description: "Los cambios se sincronizarán cuando la conexión esté disponible",
        })
      } else {
        const response = await fetch(`/api/mirix?memory_id=${memoryId}&user_id=${userId}`, {
          method: "DELETE",
        })

        if (response.ok) {
          toast({
            title: "Memoria eliminada",
            description: "La memoria se ha eliminado exitosamente",
          })
          await loadData(false)
        } else {
          throw new Error("Failed to delete memory")
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la memoria",
        variant: "destructive",
      })
    }
  }

  // Create sample data
  const createSampleData = async () => {
    const sampleMemories = [
      {
        title: "Preferencia de comunicación",
        content:
          "Prefiere comunicación directa y feedback constructivo. No le gustan las reuniones largas sin agenda clara.",
        memory_type: "preference" as MemoryType,
        importance: "high" as ImportanceLevel,
        tags: "comunicación,feedback,reuniones",
      },
      {
        title: "Objetivo de certificación",
        content: "Quiere obtener certificación en gestión de proyectos (PMP) en los próximos 6 meses.",
        memory_type: "goal" as MemoryType,
        importance: "critical" as ImportanceLevel,
        tags: "certificación,PMP,gestión-proyectos",
      },
      {
        title: "Insight sobre liderazgo",
        content:
          "Ha demostrado habilidades naturales de liderazgo en proyectos colaborativos. Tiende a motivar bien al equipo.",
        memory_type: "insight" as MemoryType,
        importance: "high" as ImportanceLevel,
        tags: "liderazgo,motivación,equipos",
      },
      {
        title: "Conversación sobre carrera",
        content: "Discutimos sus aspiraciones de transición hacia roles más estratégicos en tecnología.",
        memory_type: "conversation" as MemoryType,
        importance: "medium" as ImportanceLevel,
        tags: "carrera,estrategia,tecnología",
      },
      {
        title: "Contexto familiar",
        content:
          "Tiene responsabilidades familiares que requieren flexibilidad horaria. Valora el balance vida-trabajo.",
        memory_type: "context" as MemoryType,
        importance: "high" as ImportanceLevel,
        tags: "familia,flexibilidad,balance",
      },
    ]

    for (const sample of sampleMemories) {
      setCreateForm({
        ...sample,
        agent_id: "career-coach",
      })
      await handleCreateMemory()
    }

    toast({
      title: "Datos de ejemplo creados",
      description: "Se han creado 5 memorias de ejemplo",
    })
  }

  // Filter memories
  const filteredMemories = memories.filter((memory) => {
    const matchesSearch =
      memory.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      memory.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      memory.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = filterType === "all" || memory.memory_type === filterType
    const matchesImportance = filterImportance === "all" || memory.importance === filterImportance

    return matchesSearch && matchesType && matchesImportance
  })

  const getImportanceColor = (importance: ImportanceLevel) => {
    switch (importance) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "low":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTypeColor = (type: MemoryType) => {
    switch (type) {
      case "conversation":
        return "bg-green-100 text-green-800 border-green-200"
      case "preference":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "insight":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "goal":
        return "bg-indigo-100 text-indigo-800 border-indigo-200"
      case "context":
        return "bg-pink-100 text-pink-800 border-pink-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Cargando sistema de memoria...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold">Sistema de Memoria Mirix</h1>
            <p className="text-muted-foreground">
              Gestión inteligente de memoria para agentes de IA
              {isOffline && (
                <Badge variant="outline" className="ml-2 text-orange-600 border-orange-200">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Modo Offline
                </Badge>
              )}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => loadData()} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Memoria
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Crear Nueva Memoria</DialogTitle>
                <DialogDescription>Agrega una nueva memoria al sistema Mirix</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={createForm.title}
                    onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                    placeholder="Título de la memoria"
                  />
                </div>
                <div>
                  <Label htmlFor="content">Contenido</Label>
                  <Textarea
                    id="content"
                    value={createForm.content}
                    onChange={(e) => setCreateForm({ ...createForm, content: e.target.value })}
                    placeholder="Contenido detallado de la memoria"
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="memory_type">Tipo de Memoria</Label>
                    <Select
                      value={createForm.memory_type}
                      onValueChange={(value: MemoryType) => setCreateForm({ ...createForm, memory_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conversation">Conversación</SelectItem>
                        <SelectItem value="preference">Preferencia</SelectItem>
                        <SelectItem value="insight">Insight</SelectItem>
                        <SelectItem value="goal">Meta</SelectItem>
                        <SelectItem value="context">Contexto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="importance">Importancia</Label>
                    <Select
                      value={createForm.importance}
                      onValueChange={(value: ImportanceLevel) => setCreateForm({ ...createForm, importance: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baja</SelectItem>
                        <SelectItem value="medium">Media</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="critical">Crítica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="agent_id">Agente</Label>
                  <Select
                    value={createForm.agent_id}
                    onValueChange={(value) => setCreateForm({ ...createForm, agent_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="career-coach">Career Coach</SelectItem>
                      <SelectItem value="interview-simulator">Interview Simulator</SelectItem>
                      <SelectItem value="skill-assessor">Skill Assessor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tags">Tags (separados por comas)</Label>
                  <Input
                    id="tags"
                    value={createForm.tags}
                    onChange={(e) => setCreateForm({ ...createForm, tags: e.target.value })}
                    placeholder="tag1, tag2, tag3"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateMemory}>Crear Memoria</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {error && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-orange-800">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="memories" className="space-y-4">
        <TabsList>
          <TabsTrigger value="memories">Memorias</TabsTrigger>
          <TabsTrigger value="analytics">Analíticas</TabsTrigger>
        </TabsList>

        <TabsContent value="memories" className="space-y-4">
          {/* Search and Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar memorias..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los tipos</SelectItem>
                    <SelectItem value="conversation">Conversación</SelectItem>
                    <SelectItem value="preference">Preferencia</SelectItem>
                    <SelectItem value="insight">Insight</SelectItem>
                    <SelectItem value="goal">Meta</SelectItem>
                    <SelectItem value="context">Contexto</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterImportance} onValueChange={(value: any) => setFilterImportance(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Importancia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="critical">Crítica</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="low">Baja</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Memories List */}
          {filteredMemories.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Database className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No hay memorias</h3>
                  <p className="text-muted-foreground mb-4">
                    {memories.length === 0
                      ? "Comienza creando tu primera memoria o genera datos de ejemplo"
                      : "No se encontraron memorias que coincidan con los filtros"}
                  </p>
                  {memories.length === 0 && (
                    <div className="flex gap-2 justify-center">
                      <Button onClick={() => setShowCreateDialog(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Crear Primera Memoria
                      </Button>
                      <Button variant="outline" onClick={createSampleData}>
                        <Lightbulb className="h-4 w-4 mr-2" />
                        Datos de Ejemplo
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredMemories.map((memory) => (
                <Card key={memory.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{memory.title}</h3>
                          <Badge className={getTypeColor(memory.memory_type)}>{memory.memory_type}</Badge>
                          <Badge className={getImportanceColor(memory.importance)}>{memory.importance}</Badge>
                        </div>
                        <p className="text-muted-foreground mb-3 line-clamp-2">{memory.content}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Agente: {memory.agent_id}</span>
                          <span>Accesos: {memory.access_count}</span>
                          <span>Creado: {new Date(memory.created_at).toLocaleDateString()}</span>
                        </div>
                        {memory.tags.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {memory.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedMemory(memory)
                            setShowDetailDialog(true)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Eliminar memoria?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. La memoria será eliminada permanentemente.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteMemory(memory.id)}>
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Memorias</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total_memories}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Accesos Totales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total_access_count}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Memorias Recientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.recent_memories}</div>
                <p className="text-xs text-muted-foreground">Última semana</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Promedio Accesos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.total_memories > 0 ? Math.round(stats.total_access_count / stats.total_memories) : 0}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Por Tipo de Memoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(stats.by_type).map(([type, count]) => (
                    <div key={type} className="flex justify-between items-center">
                      <span className="capitalize">{type}</span>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Por Importancia</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(stats.by_importance).map(([importance, count]) => (
                    <div key={importance} className="flex justify-between items-center">
                      <span className="capitalize">{importance}</span>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Memory Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedMemory?.title}</DialogTitle>
            <DialogDescription>Detalles completos de la memoria</DialogDescription>
          </DialogHeader>
          {selectedMemory && (
            <div className="space-y-4">
              <div>
                <Label>Contenido</Label>
                <div className="mt-1 p-3 bg-muted rounded-md">{selectedMemory.content}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tipo</Label>
                  <Badge className={getTypeColor(selectedMemory.memory_type)}>{selectedMemory.memory_type}</Badge>
                </div>
                <div>
                  <Label>Importancia</Label>
                  <Badge className={getImportanceColor(selectedMemory.importance)}>{selectedMemory.importance}</Badge>
                </div>
              </div>
              <div>
                <Label>Agente</Label>
                <p>{selectedMemory.agent_id}</p>
              </div>
              <div>
                <Label>Tags</Label>
                <div className="flex gap-1 mt-1">
                  {selectedMemory.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <Label>Creado</Label>
                  <p>{new Date(selectedMemory.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <Label>Accesos</Label>
                  <p>{selectedMemory.access_count}</p>
                </div>
              </div>
              {selectedMemory.metadata && Object.keys(selectedMemory.metadata).length > 0 && (
                <div>
                  <Label>Metadata</Label>
                  <pre className="mt-1 p-3 bg-muted rounded-md text-xs overflow-auto">
                    {JSON.stringify(selectedMemory.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
