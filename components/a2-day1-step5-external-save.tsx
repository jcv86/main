'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Download, Link as LinkIcon, Database, Loader } from 'lucide-react'

interface Step5ExternalSaveProps {
  onNext: () => void
  onBack: () => void
}

export function A2Day1Step5ExternalSave({ onNext, onBack }: Step5ExternalSaveProps) {
  const [notionLink, setNotionLink] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const handleDownload = () => {
    const content = `# Mi Contrato de Ruta - DTC 2026

Tu documento de ruta personal para los próximos 90 días.
Se guardará automáticamente en DTC Docs.`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'mi-contrato-de-ruta.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleCopyToClipboard = async () => {
    const content = `# Mi Contrato de Ruta - DTC 2026

Tu documento de ruta personal para los próximos 90 días.
Se guardará automáticamente en DTC Docs.`
    await navigator.clipboard.writeText(content)
    alert('Copiado al portapapeles')
  }

  const handleNext = async () => {
    setIsSaving(true)
    // Show saving state briefly, then proceed
    // The actual DTC save happens in the parent component
    await new Promise(r => setTimeout(r, 300))
    setIsSaving(false)
    onNext()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Guardar Externamente</h2>
        <p className="text-white/60">Respalda tu trabajo en Notion o descárgalo para tus registros.</p>
      </div>

      {/* DTC Documents Auto-Save Notice */}
      <div className="rounded-[28px] border p-4" style={{ backgroundColor: 'rgba(232, 93, 117, 0.1)', borderColor: 'rgba(232, 93, 117, 0.3)' }}>
        <div className="flex items-center gap-3">
          <Database className="w-5 h-5" style={{ color: 'rgba(232, 93, 117, 0.8)' }} />
          <div>
            <h3 className="font-semibold text-white">Guardado Automático en DTC Docs</h3>
            <p className="text-sm text-white/60">Tu documento se guardará automáticamente al continuar. Podrás editarlo en cualquier momento desde La Realidad.</p>
          </div>
        </div>
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

      {/* Download Options */}
      <div className="rounded-[28px] border p-4 space-y-4" style={{ backgroundColor: 'rgba(90, 90, 150, 0.1)', borderColor: 'rgba(90, 90, 150, 0.3)' }}>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Download className="w-4 h-4" style={{ color: 'rgba(90, 90, 150, 0.8)' }} />
              Descargar/Copiar
            </h3>
            <p className="text-sm text-white/60 mt-1">Guarda una copia de tu plan</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={handleCopyToClipboard}
            variant="outline"
            className="font-semibold hover:opacity-80 transition"
            style={{ borderColor: 'rgba(90, 90, 150, 0.5)', color: 'rgba(90, 90, 150, 0.8)', backgroundColor: 'rgba(90, 90, 150, 0.1)' }}
          >
            Copiar al portapapeles
          </Button>
          <Button
            onClick={handleDownload}
            variant="outline"
            className="font-semibold hover:opacity-80 transition"
            style={{ borderColor: 'rgba(90, 90, 150, 0.5)', color: 'rgba(90, 90, 150, 0.8)', backgroundColor: 'rgba(90, 90, 150, 0.1)' }}
          >
            Descargar TXT
          </Button>
        </div>
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
          onClick={handleNext}
          disabled={isSaving}
          className="flex-1 text-white py-6 rounded-full font-semibold hover:opacity-80 transition"
          style={{ backgroundColor: 'rgba(90, 90, 150, 0.8)' }}
        >
          {isSaving ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              Guardando...
            </>
          ) : (
            'Siguiente'
          )}
        </Button>
      </div>
    </div>
  )
}
