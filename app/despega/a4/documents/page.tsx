'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  FileText, 
  Plus, 
  Search, 
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  FileCheck,
  Briefcase,
  User,
  MessageSquare,
  Target,
  TrendingUp,
  Users,
  BarChart
} from 'lucide-react'
import Link from 'next/link'

interface Document {
  id: string
  document_type: string
  title: string
  content: string
  status: string
  source_phase: string
  created_at: string
  updated_at: string
  metadata: Record<string, unknown>
  a4_document_versions?: { id: string; version_number: number; created_at: string }[]
  a4_document_feedback?: { id: string; rating: number; created_at: string }[]
}

interface DocumentStats {
  total: number
  byType: Record<string, number>
  byStatus: Record<string, number>
}

const DOCUMENT_TYPES = [
  { value: 'cv', label: 'CV / Currículum', icon: FileText, color: 'text-blue-400' },
  { value: 'cover_letter', label: 'Carta de Presentación', icon: MessageSquare, color: 'text-purple-400' },
  { value: 'linkedin_summary', label: 'LinkedIn Summary', icon: User, color: 'text-cyan-400' },
  { value: 'elevator_pitch', label: 'Elevator Pitch', icon: Target, color: 'text-green-400' },
  { value: 'interview_prep', label: 'Prep. Entrevista', icon: Briefcase, color: 'text-yellow-400' },
  { value: 'career_roadmap', label: 'Ruta de Carrera', icon: TrendingUp, color: 'text-orange-400' },
  { value: 'skills_inventory', label: 'Inventario Habilidades', icon: CheckCircle, color: 'text-teal-400' },
  { value: 'achievements_portfolio', label: 'Portafolio Logros', icon: FileCheck, color: 'text-pink-400' },
  { value: 'network_map', label: 'Mapa de Networking', icon: Users, color: 'text-indigo-400' },
  { value: 'market_analysis', label: 'Análisis de Mercado', icon: BarChart, color: 'text-red-400' },
]

const STATUS_BADGES: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  draft: { label: 'Borrador', variant: 'secondary' },
  ready: { label: 'Listo', variant: 'default' },
  exported: { label: 'Exportado', variant: 'outline' },
  archived: { label: 'Archivado', variant: 'destructive' }
}

export default function A4DocumentsPage() {
  const router = useRouter()
  const [documents, setDocuments] = useState<Document[]>([])
  const [stats, setStats] = useState<DocumentStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('all')

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filterType) params.set('type', filterType)
      if (filterStatus) params.set('status', filterStatus)
      
      const response = await fetch(`/api/a4/documents?${params.toString()}`)
      const data = await response.json()
      
      if (response.ok) {
        setDocuments(data.documents || [])
        setStats(data.stats || null)
      }
    } catch (error) {
      console.error('[A4 Documents] Error fetching:', error)
    } finally {
      setLoading(false)
    }
  }, [filterType, filterStatus])

  useEffect(() => {
    fetchDocuments()
  }, [fetchDocuments])

  const filteredDocuments = documents.filter(doc => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return doc.title.toLowerCase().includes(query) || 
             doc.content?.toLowerCase().includes(query)
    }
    return true
  })

  const getDocumentIcon = (type: string) => {
    const docType = DOCUMENT_TYPES.find(t => t.value === type)
    const Icon = docType?.icon || FileText
    return <Icon className={`h-5 w-5 ${docType?.color || 'text-gray-400'}`} />
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-CL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const handleDelete = async (docId: string) => {
    if (!confirm('¿Estás seguro de archivar este documento?')) return
    
    try {
      const response = await fetch(`/api/a4/documents?id=${docId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        fetchDocuments()
      }
    } catch (error) {
      console.error('[A4 Documents] Error deleting:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Mis Documentos
            </h1>
            <p className="text-muted-foreground mt-1">
              Genera y gestiona tus documentos profesionales con IA
            </p>
          </div>
          
          <Link href="/despega/a4/documents/new">
            <Button className="bg-[rgba(80,160,170,0.6)] hover:bg-[rgba(80,160,170,0.8)] text-white border-[rgb(80,160,170)]">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Documento
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-slate-900/50 border-[rgb(80,160,170)]">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-[rgb(80,160,170)]" />
                  <div>
                    <p className="text-2xl font-bold">{stats.total}</p>
                    <p className="text-xs text-muted-foreground">Total Documentos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-900/50 border-[rgb(80,160,170)]">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Edit className="h-8 w-8 text-yellow-400" />
                  <div>
                    <p className="text-2xl font-bold">{stats.byStatus?.draft || 0}</p>
                    <p className="text-xs text-muted-foreground">Borradores</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-900/50 border-[rgb(80,160,170)]">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-8 w-8 text-green-400" />
                  <div>
                    <p className="text-2xl font-bold">{stats.byStatus?.ready || 0}</p>
                    <p className="text-xs text-muted-foreground">Listos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-900/50 border-[rgb(80,160,170)]">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Download className="h-8 w-8 text-blue-400" />
                  <div>
                    <p className="text-2xl font-bold">{stats.byStatus?.exported || 0}</p>
                    <p className="text-xs text-muted-foreground">Exportados</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar documentos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-900/50 border-[rgb(80,160,170)]"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterType || ''}
              onChange={(e) => setFilterType(e.target.value || null)}
              className="px-3 py-2 rounded-lg bg-slate-900/50 border border-[rgb(80,160,170)] text-foreground"
            >
              <option value="">Todos los tipos</option>
              {DOCUMENT_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
            
            <select
              value={filterStatus || ''}
              onChange={(e) => setFilterStatus(e.target.value || null)}
              className="px-3 py-2 rounded-lg bg-slate-900/50 border border-[rgb(80,160,170)] text-foreground"
            >
              <option value="">Todos los estados</option>
              <option value="draft">Borrador</option>
              <option value="ready">Listo</option>
              <option value="exported">Exportado</option>
            </select>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="bg-slate-900/50 border border-[rgb(80,160,170)]">
            <TabsTrigger value="all" className="data-[state=active]:bg-[rgba(80,160,170,0.6)]">
              Todos
            </TabsTrigger>
            <TabsTrigger value="cv" className="data-[state=active]:bg-[rgba(80,160,170,0.6)]">
              CVs
            </TabsTrigger>
            <TabsTrigger value="letters" className="data-[state=active]:bg-[rgba(80,160,170,0.6)]">
              Cartas
            </TabsTrigger>
            <TabsTrigger value="prep" className="data-[state=active]:bg-[rgba(80,160,170,0.6)]">
              Preparación
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Documents Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[rgb(80,160,170)]"></div>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <Card className="bg-slate-900/50 border-[rgb(80,160,170)]">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No hay documentos</h3>
              <p className="text-muted-foreground text-center mb-4">
                Crea tu primer documento profesional con ayuda de IA
              </p>
              <Link href="/despega/a4/documents/new">
                <Button className="bg-[rgba(80,160,170,0.6)] hover:bg-[rgba(80,160,170,0.8)]">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Documento
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map((doc) => (
              <Card 
                key={doc.id} 
                className="bg-slate-900/50 border-[rgb(80,160,170)] hover:border-[rgba(80,160,170,0.8)] transition-colors cursor-pointer"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getDocumentIcon(doc.document_type)}
                      <div>
                        <CardTitle className="text-base line-clamp-1">
                          {doc.title}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {DOCUMENT_TYPES.find(t => t.value === doc.document_type)?.label || doc.document_type}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant={STATUS_BADGES[doc.status]?.variant || 'secondary'}>
                      {STATUS_BADGES[doc.status]?.label || doc.status}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {doc.content?.substring(0, 120)}...
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(doc.updated_at)}
                    </span>
                    {doc.a4_document_versions && doc.a4_document_versions.length > 0 && (
                      <span>v{doc.a4_document_versions[0]?.version_number || 1}</span>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Link href={`/despega/a4/documents/${doc.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full border-[rgb(80,160,170)]">
                        <Eye className="h-3 w-3 mr-1" />
                        Ver
                      </Button>
                    </Link>
                    <Link href={`/despega/a4/documents/${doc.id}/edit`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full border-[rgb(80,160,170)]">
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(doc.id)}
                      className="border-[rgb(80,160,170)] hover:bg-destructive/20"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
