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
    draft: 'bg-yellow-50 border-yellow-200',
    review: 'bg-blue-50 border-blue-200',
    revision: 'bg-orange-50 border-orange-200',
    approved: 'bg-green-50 border-green-200',
    final: 'bg-purple-50 border-purple-200',
  }

  const statusBadgeColors: Record<string, string> = {
    draft: 'text-yellow-700 bg-yellow-100',
    review: 'text-blue-700 bg-blue-100',
    revision: 'text-orange-700 bg-orange-100',
    approved: 'text-green-700 bg-green-100',
    final: 'text-purple-700 bg-purple-100',
  }

  return (
    <div
      onClick={() => onSelect(document)}
      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
        isSelected
          ? 'border-primary bg-primary/5'
          : `border-border hover:border-primary/50 ${statusColors[document.status] || 'bg-card'}`
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-1">{document.title}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{document.content}</p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
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
        >
          <Edit size={14} className="mr-1" />
          Editar
        </Button>
      </div>
    </div>
  )
}
