'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Download, Link as LinkIcon, Database, Check, Loader } from 'lucide-react'
import { upsertDocument } from '@/lib/supabase/dtc-documents'

interface RouteData {
  change30Days: string
  targetRole: string
  mainBlocker: string
  hypothesis?: string
  gates?: {
    identity: string
    evidence: string
    material: string
  }
  roadmap?: string
}

interface Step5ExternalSaveProps {
  onNext: () => void
  onBack: () => void
  routeData?: RouteData
  userId?: string
}

export function A2Day1Step5ExternalSave({ onNext, onBack, routeData, userId }: Step5ExternalSaveProps) {
  const [notionLink, setNotionLink] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Format route data as document content
  const formatRouteContent = () => {
    if (!routeData) return ''
    
    return `# Mi Contrato de Ruta - DTC 2026

## Mi Cambio en 30 Días
${routeData.change30Days || 'No definido'}

## Mi Rol Objetivo
${routeData.targetRole || 'No definido'}

## Mi Bloqueador Principal
${routeData.mainBlocker || 'No definido'}

## Mi Hipótesis de Ruta
${routeData.hypothesis || 'No definida'}

## Mis 3 Puertas de Validación

### PUERTA 1 - IDENTIDAD (Día 10)
${routeData.gates?.identity || 'No definida'}

### PUERTA 2 - EVIDENCIA (Día 20)
${routeData.gates?.evidence || 'No definida'}

### PUERTA 3 - MATERIAL (Día 30)
${routeData.gates?.material || 'No definida'}

## Mi Roadmap Profesional
${routeData.roadmap || 'No definido'}
`
  }

  const handleNext = async () => {
    // Auto-save to DTC Documents before proceeding
    if (userId && routeData) {
      setIsSaving(true)
      try {
        await upsertDocument(userId, 'route_contract', 'a2_day_1', {
          title: 'Mi Contrato de Ruta',
          type: 'route_contract',
          source_module: 'a2_day_1',
          related_day: 1,
          content: formatRouteContent(),
          status: 'draft',
          source: 'user',
          tags: ['day1', 'contract', 'route'],
        })
        setSaved(true)
        console.log('[v0] Day 1 route contract saved to DTC Documents')
      } catch (err) {
        console.error('[v0] Error saving to DTC Documents:', err)
      } finally {
        setIsSaving(false)
      }
    }
    onNext()
  }

  const handleDownload = () => {
    // Download as TXT file
    const content = formatRouteContent()
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'mi-contrato-de-ruta.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleCopyToClipboard = async () => {
    const content = formatRouteContent()
    await navigator.clipboard.writeText(content)
    alert('Copiado al portapapeles')
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
          {saved && <Check className="w-5 h-5 text-green-400 ml-auto" />}
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
