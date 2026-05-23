'use client'

import { useState } from 'react'
import { DTCDocument, updateDocument } from '@/lib/supabase/dtc-documents'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Loader } from 'lucide-react'

interface DocumentEditorProps {
  document: DTCDocument | null
  userId: string
  onSave: () => void
  onCancel: () => void
}

export function DocumentEditor({ document, userId, onSave, onCancel }: DocumentEditorProps) {
  const [title, setTitle] = useState(document?.title || '')
  const [content, setContent] = useState(document?.content || '')
  const [status, setStatus] = useState<string>(document?.status || 'draft')
  const [isSaving, setIsSaving] = useState(false)

  async function handleSave() {
    if (!title.trim() || !content.trim()) {
      alert('Por favor completa los campos requeridos')
      return
    }

    setIsSaving(true)
    try {
      if (document) {
        // Update existing document
        const { error } = await updateDocument(userId, document.id, {
          title,
          content,
          status: status as any,
        })
        if (error) throw error
      } else {
        // Creating new document would require additional logic
        // For now, we only support editing existing documents
        alert('Por favor selecciona un documento para editar')
        return
      }
      onSave()
    } catch (err) {
      console.error('[v0] Error saving document:', err)
      alert('Error al guardar el documento')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="bg-stone-900 rounded-lg p-6 space-y-4">
      <h3 className="text-lg font-semibold text-[rgb(80,160,170)]">
        {document ? 'Editar Documento' : 'Nuevo Documento'}
      </h3>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Título</label>
        <Input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Título del documento"
          disabled={isSaving}
          className="bg-black border-[rgb(80,160,170)] text-white placeholder-gray-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Contenido</label>
        <Textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Contenido del documento..."
          rows={8}
          disabled={isSaving}
          className="resize-none bg-black border-[rgb(80,160,170)] text-white placeholder-gray-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Estado</label>
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          disabled={isSaving}
          className="w-full px-3 py-2 border border-[rgb(80,160,170)] rounded-md bg-black text-white"
        >
          <option value="draft">Borrador</option>
          <option value="review">En Revisión</option>
          <option value="revision">Revisión</option>
          <option value="approved">Aprobado</option>
          <option value="final">Final</option>
        </select>
      </div>

      <div className="flex gap-2 pt-4">
        <Button onClick={handleSave} disabled={isSaving} className="flex-1 bg-[rgba(80,160,170,0.5)] hover:bg-[rgba(80,160,170,0.6)]-600 text-white">
          {isSaving ? (
            <>
              <Loader className="animate-spin mr-2" size={16} />
              Guardando...
            </>
          ) : (
            'Guardar'
          )}
        </Button>
        <Button onClick={onCancel} variant="outline" disabled={isSaving} className="flex-1 border-[rgb(80,160,170)] text-gray-300 hover:bg-stone-900">
          Cancelar
        </Button>
      </div>
    </div>
  )
}
