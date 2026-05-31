'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { 
  ArrowLeft, 
  Save, 
  Download, 
  History, 
  Eye,
  CheckCircle,
  Loader2,
  RefreshCw,
  Copy,
  FileText
} from 'lucide-react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'

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
}

export default function DocumentEditorPage() {
  const router = useRouter()
  const params = useParams()
  const documentId = params.id as string

  const [document, setDocument] = useState<Document | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [hasChanges, setHasChanges] = useState(false)
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'split'>('split')
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const fetchDocument = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/a4/documents?id=${documentId}`)
      const data = await response.json()
      
      if (response.ok && data.documents?.[0]) {
        const doc = data.documents[0]
        setDocument(doc)
        setTitle(doc.title)
        setContent(doc.content || '')
      }
    } catch (error) {
      console.error('[Document Editor] Error fetching:', error)
    } finally {
      setLoading(false)
    }
  }, [documentId])

  useEffect(() => {
    if (documentId) {
      fetchDocument()
    }
  }, [documentId, fetchDocument])

  useEffect(() => {
    if (document) {
      const changed = title !== document.title || content !== document.content
      setHasChanges(changed)
    }
  }, [title, content, document])

  // Auto-save every 30 seconds if there are changes
  useEffect(() => {
    if (!hasChanges) return

    const autoSaveTimer = setTimeout(() => {
      handleSave(false)
    }, 30000)

    return () => clearTimeout(autoSaveTimer)
  }, [hasChanges, content, title])

  const handleSave = async (showFeedback = true) => {
    if (!document) return

    try {
      setSaving(true)
      
      const response = await fetch('/api/a4/documents', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId: document.id,
          title,
          content,
          createVersion: true
        })
      })

      if (response.ok) {
        setHasChanges(false)
        setLastSaved(new Date())
        if (showFeedback) {
          // Could add toast notification here
        }
      }
    } catch (error) {
      console.error('[Document Editor] Error saving:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleMarkReady = async () => {
    if (!document) return

    try {
      await fetch('/api/a4/documents', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId: document.id,
          status: 'ready'
        })
      })
      
      fetchDocument()
    } catch (error) {
      console.error('[Document Editor] Error marking ready:', error)
    }
  }

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(content)
  }

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = window.document.createElement('a')
    a.href = url
    a.download = `${title || 'documento'}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[rgb(80,160,170)]" />
      </div>
    )
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="bg-slate-900/50 border-[rgb(80,160,170)] p-8">
          <div className="text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Documento no encontrado</h2>
            <p className="text-muted-foreground mb-4">
              El documento que buscas no existe o fue archivado
            </p>
            <Link href="/despega/a4/documents">
              <Button className="bg-[rgba(80,160,170,0.6)]">
                Volver a Documentos
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-[rgb(80,160,170)]">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/despega/a4/documents">
                <Button variant="outline" size="icon" className="border-[rgb(80,160,170)]">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              
              <div className="flex items-center gap-3">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-lg font-bold bg-transparent border-none focus:ring-0 w-auto max-w-md"
                  placeholder="Título del documento"
                />
                {hasChanges && (
                  <Badge variant="secondary" className="text-xs">
                    Sin guardar
                  </Badge>
                )}
                <Badge variant={document.status === 'ready' ? 'default' : 'secondary'}>
                  {document.status === 'ready' ? 'Listo' : 'Borrador'}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {lastSaved && (
                <span className="text-xs text-muted-foreground mr-2">
                  Guardado {lastSaved.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
              
              <div className="flex border border-[rgb(80,160,170)] rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === 'edit' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('edit')}
                  className={viewMode === 'edit' ? 'bg-[rgba(80,160,170,0.6)]' : ''}
                >
                  Editar
                </Button>
                <Button
                  variant={viewMode === 'split' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('split')}
                  className={viewMode === 'split' ? 'bg-[rgba(80,160,170,0.6)]' : ''}
                >
                  Dividido
                </Button>
                <Button
                  variant={viewMode === 'preview' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('preview')}
                  className={viewMode === 'preview' ? 'bg-[rgba(80,160,170,0.6)]' : ''}
                >
                  Vista Previa
                </Button>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyToClipboard}
                className="border-[rgb(80,160,170)]"
              >
                <Copy className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="border-[rgb(80,160,170)]"
              >
                <Download className="h-4 w-4" />
              </Button>

              {document.status !== 'ready' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkReady}
                  className="border-[rgb(80,160,170)]"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Marcar Listo
                </Button>
              )}

              <Button
                onClick={() => handleSave(true)}
                disabled={saving || !hasChanges}
                className="bg-[rgba(80,160,170,0.6)] hover:bg-[rgba(80,160,170,0.8)]"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-1" />
                    Guardar
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="container mx-auto px-4 py-6">
        <div className={`grid gap-6 ${viewMode === 'split' ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {/* Editor Panel */}
          {(viewMode === 'edit' || viewMode === 'split') && (
            <Card className="bg-slate-900/50 border-[rgb(80,160,170)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Editor (Markdown)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[calc(100vh-280px)] font-mono text-sm bg-slate-950/50 border-[rgb(80,160,170)] resize-none"
                  placeholder="Escribe o edita tu documento aquí..."
                />
              </CardContent>
            </Card>
          )}

          {/* Preview Panel */}
          {(viewMode === 'preview' || viewMode === 'split') && (
            <Card className="bg-slate-900/50 border-[rgb(80,160,170)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Vista Previa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-invert prose-sm max-w-none min-h-[calc(100vh-280px)] overflow-auto">
                  <ReactMarkdown>{content}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
