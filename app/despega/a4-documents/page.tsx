'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getAllUserDocuments, type DTCDocument } from '@/lib/supabase/dtc-documents'
import { DocumentCard } from '@/components/a4-document-card'
import { DocumentEditor } from '@/components/a4-document-editor'
import { DocumentFilter } from '@/components/a4-document-filter'
import { Button } from '@/components/ui/button'
import { Plus, FileText, Loader } from 'lucide-react'

export default function A4DocumentsPage() {
  const [documents, setDocuments] = useState<DTCDocument[]>([])
  const [filteredDocuments, setFilteredDocuments] = useState<DTCDocument[]>([])
  const [selectedDocument, setSelectedDocument] = useState<DTCDocument | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [filterType, setFilterType] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    loadDocuments()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [documents, filterType, filterStatus])

  async function loadDocuments() {
    try {
      setIsLoading(true)
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user?.id) return

      setUserId(user.id)
      const { data: docs, error } = await getAllUserDocuments(user.id)
      if (error) throw error
      setDocuments(docs || [])
    } catch (err) {
      console.error('[v0] Error loading documents:', err)
    } finally {
      setIsLoading(false)
    }
  }

  function applyFilters() {
    let filtered = [...documents]

    if (filterType) {
      filtered = filtered.filter(doc => doc.type === filterType)
    }

    if (filterStatus) {
      filtered = filtered.filter(doc => doc.status === filterStatus)
    }

    setFilteredDocuments(filtered)
  }

  function handleSelectDocument(doc: DTCDocument) {
    setSelectedDocument(doc)
    setIsEditing(false)
  }

  function handleEditDocument(doc: DTCDocument) {
    setSelectedDocument(doc)
    setIsEditing(true)
  }

  function handleDocumentSaved() {
    setIsEditing(false)
    setSelectedDocument(null)
    loadDocuments()
  }

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: 'rgba(232, 93, 117, 0.2)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[rgb(80,160,170)] mb-2">Mi Workspace DTC</h1>
          <p className="text-base text-gray-300">
            Gestiona todos tus documentos, contratos y evidencia en un solo lugar.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Documents List */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <DocumentFilter
                onFilterTypeChange={setFilterType}
                onFilterStatusChange={setFilterStatus}
              />
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="animate-spin text-[rgb(80,160,170)]" size={32} />
              </div>
            ) : filteredDocuments.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="mx-auto mb-4 text-gray-400" size={48} />
                <p className="text-gray-400 mb-4">No hay documentos que coincidan con los filtros</p>
                <Button onClick={() => setIsEditing(true)} className="bg-[rgba(80,160,170,0.5)] hover:bg-[rgba(80,160,170,0.6)]-600 text-white">
                  <Plus className="mr-2" size={16} />
                  Crear documento
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDocuments.map(doc => (
                  <DocumentCard
                    key={doc.id}
                    document={doc}
                    isSelected={selectedDocument?.id === doc.id}
                    onSelect={handleSelectDocument}
                    onEdit={handleEditDocument}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Detail View / Editor */}
          <div className="lg:col-span-1">
            {isEditing && userId ? (
              <DocumentEditor
                document={selectedDocument}
                userId={userId}
                onSave={handleDocumentSaved}
                onCancel={() => {
                  setIsEditing(false)
                  setSelectedDocument(null)
                }}
              />
            ) : selectedDocument ? (
              <div className="bg-stone-900 rounded-lg p-6">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-[rgb(80,160,170)] mb-2">{selectedDocument.title}</h2>
                  <div className="flex gap-2 mb-4">
                    <span className="px-3 py-1 bg-[rgba(80,160,170,0.5)]/20 text-[rgb(80,160,170)] rounded-full text-sm">
                      {selectedDocument.type}
                    </span>
                    <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">
                      {selectedDocument.status}
                    </span>
                  </div>
                </div>

                <div className="text-gray-300 mb-6 text-sm">
                  {selectedDocument.content && <p>{selectedDocument.content}</p>}
                </div>

                {selectedDocument.ai_summary && (
                  <div className="mb-6 p-4 bg-gray-900 rounded-lg">
                    <h3 className="font-semibold text-sm mb-2 text-[rgb(80,160,170)]">Resumen IA</h3>
                    <p className="text-sm text-gray-400">{selectedDocument.ai_summary}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button onClick={() => handleEditDocument(selectedDocument)} className="flex-1 bg-[rgba(80,160,170,0.5)] hover:bg-[rgba(80,160,170,0.6)]-600 text-white">
                    Editar
                  </Button>
                  <Button variant="outline" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-900">
                    Descargar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-stone-900 rounded-lg p-6 text-center">
                <FileText className="mx-auto mb-4 text-gray-500" size={32} />
                <p className="text-gray-400">Selecciona un documento para ver los detalles</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
