'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  FileText, 
  Plus, 
  Search, 
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
  Loader,
  Eye,
  Edit,
  Trash2,
  Download,
  X
} from 'lucide-react'
import Link from 'next/link'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { createClient } from '@/lib/supabase/client'
import type { DTCDocument, DocumentType, DocumentStatus } from '@/lib/supabase/dtc-documents'

interface DocumentStats {
  total: number
  byType: Record<string, number>
  byStatus: Record<string, number>
}

const DOCUMENT_TYPES = [
  { value: 'route_contract', label: 'Contrato de Ruta', icon: FileText, color: 'text-blue-400' },
  { value: 'evidence_vault', label: 'Bóveda de Evidencia', icon: FileCheck, color: 'text-purple-400' },
  { value: 'market_signal', label: 'Señal de Mercado', icon: BarChart, color: 'text-cyan-400' },
  { value: 'candidate_board', label: 'Tablero Candidato', icon: User, color: 'text-green-400' },
  { value: 'test_introduction', label: 'Test de Intro', icon: Target, color: 'text-yellow-400' },
  { value: 'professional_identity', label: 'Identidad Profesional', icon: Briefcase, color: 'text-orange-400' },
  { value: 'career_mirror', label: 'Espejo de Carrera', icon: TrendingUp, color: 'text-teal-400' },
  { value: 'work_memory', label: 'Memoria de Trabajo', icon: FileText, color: 'text-pink-400' },
  { value: 'value_inventory', label: 'Inventario de Valor', icon: CheckCircle, color: 'text-indigo-400' },
  { value: 'value_statement', label: 'Declaración de Valor', icon: MessageSquare, color: 'text-red-400' },
  { value: 'achievement_story', label: 'Historia de Logros', icon: FileCheck, color: 'text-amber-400' },
  { value: 'cv_bullet', label: 'CV Bullet', icon: FileText, color: 'text-blue-400' },
  { value: 'daily_mission', label: 'Misión Diaria', icon: Target, color: 'text-green-400' },
  { value: 'a3_learning_output', label: 'Output de A3', icon: TrendingUp, color: 'text-purple-400' },
  { value: 'a4_portfolio_entry', label: 'Entrada de Portafolio', icon: Briefcase, color: 'text-cyan-400' },
]

const STATUS_BADGES: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  draft: { label: 'Borrador', variant: 'secondary' },
  review: { label: 'En Revisión', variant: 'outline' },
  revision: { label: 'Revisión', variant: 'outline' },
  approved: { label: 'Aprobado', variant: 'default' },
  final: { label: 'Final', variant: 'default' },
}

export default function A4DocumentsPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuthRedirect()
  const [documents, setDocuments] = useState<DTCDocument[]>([])
  const [stats, setStats] = useState<DocumentStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Fetch documents using client-side Supabase (works with auth)
  const fetchDocuments = useCallback(async () => {
    if (authLoading || !user) return

    try {
      setLoading(true)
      setError(null)
      
      const supabase = createClient()
      
      // Build query
      let query = supabase
        .from('dtc_documents')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
      
      if (filterType) {
        query = query.eq('type', filterType)
      }
      if (filterStatus) {
        query = query.eq('status', filterStatus)
      }
      
      const { data, error: fetchError } = await query
      
      if (fetchError) {
        console.error('[v0] Error fetching documents:', fetchError)
        setError('Error al cargar documentos')
        return
      }
      
      const docs = (data || []) as DTCDocument[]
      setDocuments(docs)
      
      // Calculate stats
      const docStats: DocumentStats = {
        total: docs.length,
        byType: {},
        byStatus: {}
      }
      
      docs.forEach(doc => {
        docStats.byType[doc.type] = (docStats.byType[doc.type] || 0) + 1
        docStats.byStatus[doc.status] = (docStats.byStatus[doc.status] || 0) + 1
      })
      
      setStats(docStats)
    } catch (err) {
      console.error('[v0] Error in fetchDocuments:', err)
      setError('Error al cargar documentos')
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
    if (!user) return
    
    try {
      const supabase = createClient()
      const { error: deleteError } = await supabase
        .from('dtc_documents')
        .delete()
        .eq('id', docId)
        .eq('user_id', user.id)
      
      if (deleteError) {
        console.error('[v0] Error deleting document:', deleteError)
        setError('Error al eliminar el documento')
        return
      }
      
      setDocuments(documents.filter(d => d.id !== docId))
    } catch (err) {
      console.error('[v0] Error in handleDelete:', err)
      setError('Error al eliminar el documento')
    }
  }
  
  const clearFilters = () => {
    setFilterType(null)
    setFilterStatus(null)
    setSearchQuery('')
  }

  // Filter documents by search query
  const filteredDocuments = documents.filter(doc => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return doc.title.toLowerCase().includes(query) || 
           (doc.content?.toLowerCase().includes(query) || false)
  })

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-12 w-12 text-[rgb(80,160,170)] animate-spin" />
      </div>
    )
  }

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
                Mi Workspace DTC
              </h1>
              <p className="text-muted-foreground mt-1">
                Gestiona todos tus documentos, contratos y evidencia en un solo lugar.
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
                    <p className="text-2xl font-bold">{(stats.byStatus?.approved || 0) + (stats.byStatus?.final || 0)}</p>
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
                    <p className="text-2xl font-bold">{(stats.byStatus?.review || 0) + (stats.byStatus?.revision || 0)}</p>
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
          
          <div className="flex gap-2 flex-wrap">
            <select
              value={filterType || ''}
              onChange={(e) => setFilterType(e.target.value || null)}
              className="px-3 py-2 rounded-lg bg-slate-900/50 border border-[rgb(80,160,170)] text-foreground text-sm"
            >
              <option value="">Filtrar por tipo...</option>
              {DOCUMENT_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
            
            <select
              value={filterStatus || ''}
              onChange={(e) => setFilterStatus(e.target.value || null)}
              className="px-3 py-2 rounded-lg bg-slate-900/50 border border-[rgb(80,160,170)] text-foreground text-sm"
            >
              <option value="">Filtrar por estado...</option>
              <option value="draft">Borrador</option>
              <option value="review">En Revisión</option>
              <option value="approved">Aprobado</option>
              <option value="final">Final</option>
            </select>
            
            {(filterType || filterStatus || searchQuery) && (
              <Button variant="outline" size="sm" onClick={clearFilters} className="border-[rgb(80,160,170)]">
                <X className="h-4 w-4 mr-1" />
                Limpiar filtros
              </Button>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Documents List */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="h-8 w-8 text-[rgb(80,160,170)] animate-spin" />
              </div>
            ) : filteredDocuments.length === 0 ? (
              <Card className="bg-slate-900/50 border-[rgb(80,160,170)]">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    {documents.length === 0 ? 'No hay documentos' : 'No hay documentos que coincidan con los filtros'}
                  </h3>
                  <p className="text-muted-foreground text-center mb-4">
                    {documents.length === 0 
                      ? 'Comienza a crear tus documentos profesionales o completa las actividades en A2 para generar documentos automáticamente.'
                      : 'Intenta ajustar los filtros de búsqueda.'
                    }
                  </p>
                  {documents.length === 0 && (
                    <Link href="/despega/a4/documents/new">
                      <Button className="bg-[rgba(80,160,170,0.6)] hover:bg-[rgba(80,160,170,0.8)]">
                        <Plus className="h-4 w-4 mr-2" />
                        Crear documento
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredDocuments.map((doc) => (
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
                              {doc.source_module && ` • ${doc.source_module}`}
                              {doc.related_day && ` • Día ${doc.related_day}`}
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
                        {doc.content?.substring(0, 150) || doc.ai_summary || 'Sin contenido'}
                        {(doc.content?.length || 0) > 150 ? '...' : ''}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(doc.updated_at)}
                        </span>
                        <div className="flex items-center gap-2">
                          {doc.tags && doc.tags.length > 0 && (
                            <span className="text-[rgb(80,160,170)]">
                              {doc.tags.slice(0, 2).join(', ')}
                            </span>
                          )}
                          <span>v{doc.version}</span>
                        </div>
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

          {/* Document Details Panel */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-900/50 border-[rgb(80,160,170)] sticky top-4">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">
                  Selecciona un documento para ver los detalles
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
