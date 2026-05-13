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
        <h2 className="text-2xl font-bold text-white mb-2">Save Externally</h2>
        <p className="text-white/60">Back up your work to Notion or download it for your records.</p>
      </div>

      {/* Notion Option */}
      <div className="bg-slate-900/30 border border-slate-700/50 rounded-lg p-4 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-white flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-purple-400" />
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
            className="bg-slate-800/50 border-slate-600 text-white"
          />
          <p className="text-xs text-white/50">If you have a Notion template, paste the link here. We&apos;ll help you keep it updated.</p>
        </div>
      </div>

      {/* Download Option */}
      <div className="bg-slate-900/30 border border-slate-700/50 rounded-lg p-4 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-cyan-400" />
              Download Your Plan
            </h3>
            <p className="text-sm text-white/60 mt-1">Save a copy of your plan as a PDF document</p>
          </div>
        </div>
        <Button
          onClick={handleDownload}
          variant="outline"
          className="w-full"
          disabled
        >
          <Download className="w-4 h-4 mr-2" />
          Download PDF (Coming Soon)
        </Button>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex-1"
        >
          Back
        </Button>
        <Button
          onClick={onNext}
          className="flex-1 bg-cyan-600 hover:bg-cyan-700"
        >
          Continue to Upload
        </Button>
      </div>
    </div>
  )
}
