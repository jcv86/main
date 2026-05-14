'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Download, Link as LinkIcon } from 'lucide-react'

interface Step5ExternalSaveProps {
  onNext: () => void
  onBack: () => void
}

export function A2Day1Step5ExternalSave({ onNext, onBack }: Step5ExternalSaveProps) {
  const [notionLink, setNotionLink] = useState('')
  const [showDownloadOption, setShowDownloadOption] = useState(false)

  const handleDownload = () => {
    // In a real app, this would generate and download a PDF or document
    alert('Download feature coming soon! For now, use the Notion template.')
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Guardar Externamente</h2>
        <p className="text-white/60">Respalda tu trabajo en Notion o descárgalo para tus registros.</p>
      </div>

      {/* Notion Option */}
      <div className="rounded-[28px] border p-4 space-y-4" style={{ backgroundColor: 'rgba(90, 90, 150, 0.1)', borderColor: 'rgba(90, 90, 150, 0.3)' }}>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-white flex items-center gap-2">
              <LinkIcon className="w-4 h-4" style={{ color: 'rgba(90, 90, 150, 0.8)' }} />
              Save to Notion
            </h3>
            <p className="text-sm text-white/60 mt-1">Link your Notion template to automatically sync your progress</p>
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-white text-sm">Notion Template Link (Optional)</Label>
          <Input
            placeholder="https://notion.so/..."
            value={notionLink}
            onChange={(e) => setNotionLink(e.target.value)}
            className="bg-slate-800/50 border-slate-600 text-white rounded-lg"
            style={{ borderColor: 'rgba(90, 90, 150, 0.3)' }}
          />
          <p className="text-xs text-white/50">If you have a Notion template, paste the link here. We&apos;ll help you keep it updated.</p>
        </div>
      </div>

      {/* Download Option */}
      <div className="rounded-[28px] border p-4 space-y-4" style={{ backgroundColor: 'rgba(90, 90, 150, 0.1)', borderColor: 'rgba(90, 90, 150, 0.3)' }}>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Download className="w-4 h-4" style={{ color: 'rgba(90, 90, 150, 0.8)' }} />
              Download Your Plan
            </h3>
            <p className="text-sm text-white/60 mt-1">Save a copy of your plan as a PDF document</p>
          </div>
        </div>
        <Button
          onClick={handleDownload}
          variant="outline"
          className="w-full font-semibold hover:opacity-80 transition"
          style={{ borderColor: 'rgba(90, 90, 150, 0.5)', color: 'rgba(90, 90, 150, 0.8)', backgroundColor: 'rgba(90, 90, 150, 0.1)' }}
          disabled
        >
          <Download className="w-4 h-4 mr-2" />
          Download PDF (Coming Soon)
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 pt-4">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex-1 text-white hover:opacity-80 transition py-6 rounded-full font-semibold"
          style={{ borderColor: 'rgba(90, 90, 150, 0.5)', backgroundColor: 'rgba(90, 90, 150, 0.1)' }}
        >
          Atrás
        </Button>
        <Button
          onClick={onNext}
          className="flex-1 text-white py-6 rounded-full font-semibold hover:opacity-80 transition"
          style={{ backgroundColor: 'rgba(90, 90, 150, 0.8)' }}
        >
          Siguiente
        </Button>
      </div>
    </div>
  )
}
