'use client'

import { DTCDocument } from '@/lib/supabase/dtc-documents'
import { Button } from '@/components/ui/button'
import { Edit, FileText, Calendar } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

interface DocumentCardProps {
  document: DTCDocument
  isSelected?: boolean
  onSelect: (doc: DTCDocument) => void
  onEdit: (doc: DTCDocument) => void
}

export function DocumentCard({ document, isSelected, onSelect, onEdit }: DocumentCardProps) {
  const createdDate = new Date(document.created_at)

  const statusColors: Record<string, string> = {
    draft: 'bg-stone-800',
    review: 'bg-stone-800',
    revision: 'bg-stone-800',
    approved: 'bg-stone-800',
    final: 'bg-stone-800',
  }

  const statusBadgeColors: Record<string, string> = {
    draft: 'text-gray-300 bg-gray-700',
    review: 'text-gray-300 bg-gray-700',
    revision: 'text-gray-300 bg-gray-700',
    approved: 'text-gray-300 bg-gray-700',
    final: 'text-gray-300 bg-gray-700',
  }

  return (
    <div
      onClick={() => onSelect(document)}
      className={`p-4 rounded-lg cursor-pointer transition-all ${
        isSelected
          ? 'bg-stone-800 ring-2 ring-red-500'
          : `bg-stone-900 hover:bg-stone-800 ${statusColors[document.status]}`
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-red-400 mb-1">{document.title}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <FileText size={14} />
            <span className="capitalize">{document.type}</span>
            {document.related_day && (
              <>
                <span>•</span>
                <span>Day {document.related_day}</span>
              </>
            )}
          </div>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium ${statusBadgeColors[document.status]}`}>
          {document.status}
        </span>
      </div>

      {document.content && (
        <p className="text-sm text-gray-400 mb-3 line-clamp-2">{document.content}</p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Calendar size={12} />
          <span>{formatDistanceToNow(createdDate, { addSuffix: true, locale: es })}</span>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={e => {
            e.stopPropagation()
            onEdit(document)
          }}
          className="text-red-400 hover:text-red-300 hover:bg-stone-800"
        >
          <Edit size={14} className="mr-1" />
          Editar
        </Button>
      </div>
    </div>
  )
}
