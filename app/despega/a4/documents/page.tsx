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
  BarChart,
  ArrowLeft,
  Loader
} from 'lucide-react'
import Link from 'next/link'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'

interface Document {
  id: string
  type: string
  title: string
  content: string | null
  status: string
  source: string
  source_module: string | null
  created_at: string
  updated_at: string
  metadata?: Record<string, unknown> | null
  version?: number
}

interface DocumentStats {
  total: number
  byType: Record<string, number>
  byStatus: Record<string, number>
  bySource?: Record<string, number>
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
  review: { label: 'En Revisión', variant: 'outline' },
  approved: { label: 'Aprobado', variant: 'default' },
  archived: { label: 'Archivado', variant: 'destructive' }
}

export default function A4DocumentsPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuthRedirect()
  const [documents, setDocuments] = useState<Document[]>([])
  const [stats, setStats] = useState<DocumentStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('all')
  const [error, setError] = useState<string | null>(null)

  const fetchDocuments = useCallback(async () => {
    if (authLoading || !user) return

    try {
      setLoading(true)
      setError(null)
      const params = new URLSearchParams()
      params.set('userId', user.id)
      if (filterType) params.set('type', filterType)
      if (filterStatus) params.set('status', filterStatus)
      
      const response = await fetch(`/api/a4/documents?${params.toString()}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`API error: ${response.status} - ${errorData?.error}`)
      }
      
      const data = await response.json()
      
      setDocuments(data.documents || [])
      setStats(data.stats || null)
    } catch (err) {
      console.error('[v0] Error fetching documents:', err)
      setError(err instanceof Error ? err.message : 'Error al cargar documentos')
    } finally {
      setLoading(false)
    }
  }, [filterType, filterStatus, user, authLoading])

  useEffect(() => {
    if (!authLoading && user) {
      fetchDocuments()
    }
  }, [fetchDocuments, authLoading, user])

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
    if (!confirm('¿Estás seguro de eliminar este documento?')) return
    
    try {
      const response = await fetch(`/api/a4/documents?id=${docId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setDocuments(documents.filter(d => d.id !== docId))
      } else {
        setError('Error al eliminar el documento')
      }
    } catch (err) {
      console.error('[v0] Error deleting document:', err)
      setError('Error al eliminar el documento')
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[rgb(80,160,170)]"></div>
      </div>
    )
  }

  // Return null only if not loading AND user is null - this triggers redirect in middleware
  if (!user) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <Card className="bg-slate-900/50 border-[rgb(80,160,170)]">
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center">Por favor inicia sesión para ver tus documentos.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link href="/despega/a4">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Mis Documentos
              </h1>
              <p className="text-muted-foreground mt-1">
                Gestiona tus documentos profesionales
              </p>
            </div>
          </div>
          
          <Link href="/despega/a4/documents/new">
            <Button className="bg-[rgba(80,160,170,0.6)] hover:bg-[rgba(80,160,170,0.8)] text-white">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Documento
            </Button>
          </Link>
        </div>

        {/* Error Alert */}
        {error && (
          <Card className="bg-red-900/20 border-red-500/50 mb-6">
            <CardContent className="pt-6">
              <p className="text-red-400 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {error}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-slate-900/50 border-[rgb(80,160,170)]">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-[rgb(80,160,170)]" />
                  <div>
                    <p className="text-2xl font-bold">{stats.total}</p>
                    <p className="text-xs text-muted-foreground">Total</p>
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
                    <p className="text-2xl font-bold">{stats.byStatus?.approved || 0}</p>
                    <p className="text-xs text-muted-foreground">Aprobados</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-900/50 border-[rgb(80,160,170)]">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Download className="h-8 w-8 text-blue-400" />
                  <div>
                    <p className="text-2xl font-bold">{stats.byStatus?.review || 0}</p>
                    <p className="text-xs text-muted-foreground">En Revisión</p>
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
              <option value="review">En Revisión</option>
              <option value="approved">Aprobado</option>
            </select>
          </div>
        </div>

        {/* Documents Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="h-8 w-8 text-[rgb(80,160,170)] animate-spin" />
          </div>
        ) : documents.length === 0 ? (
          <Card className="bg-slate-900/50 border-[rgb(80,160,170)]">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No hay documentos</h3>
              <p className="text-muted-foreground text-center mb-4">
                Comienza a crear tus documentos profesionales
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
            {documents.map((doc) => (
              <Card 
                key={doc.id} 
                className="bg-slate-900/50 border-[rgb(80,160,170)] hover:border-[rgba(80,160,170,0.8)] transition-colors"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {getDocumentIcon(doc.type)}
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-base line-clamp-1">
                          {doc.title}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {DOCUMENT_TYPES.find(t => t.value === doc.type)?.label || doc.type}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant={STATUS_BADGES[doc.status]?.variant || 'secondary'} className="ml-2 flex-shrink-0">
                      {STATUS_BADGES[doc.status]?.label || doc.status}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {doc.content?.substring(0, 120) || 'Sin contenido'}...
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(doc.updated_at)}
                    </span>
                    {doc.version && (
                      <span>v{doc.version}</span>
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
