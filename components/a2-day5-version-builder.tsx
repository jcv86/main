'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'

interface Day5VersionBuilderProps {
  onVersionsBuilt: (versions: { versionA: string; versionB: string }) => Promise<void>
  isLoading: boolean
}

export function Day5VersionBuilder({
  onVersionsBuilt,
  isLoading,
}: Day5VersionBuilderProps) {
  const [versionA, setVersionA] = useState('')
  const [versionB, setVersionB] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const handleSaveVersions = async () => {
    setIsSaving(true)
    try {
      await onVersionsBuilt({ versionA, versionB })
    } catch (err) {
      console.error('[v0] Error saving versions:', err)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Crear 2 Versiones Iniciales</h2>
        <p className="text-white/70">Escribe cómo te presentarías en dos contextos diferentes</p>
      </div>

      <div className="space-y-4">
        {/* VERSION A - Casual */}
        <div>
          <label className="text-sm font-semibold text-white/80 mb-2 block">
            Versión A: Conversación Casual (como si hablaras con amigo)
          </label>
          <textarea
            value={versionA}
            onChange={(e) => setVersionA(e.target.value)}
            className="w-full p-4 rounded-lg text-white placeholder:text-white/40 focus:outline-none resize-none"
            style={{ backgroundColor: 'rgba(90, 90, 150, 0.1)', border: '1px solid rgba(90, 90, 150, 0.6)' }}
            rows={4}
            placeholder="Cuéntame sobre ti de forma natural..."
          />
          <p className="text-xs text-white/50 mt-1">Luego pasaremos esto por feedback de Coach</p>
        </div>

        {/* VERSION B - Professional */}
        <div>
          <label className="text-sm font-semibold text-white/80 mb-2 block">
            Versión B: Para Recruiter (profesional, estructurado)
          </label>
          <textarea
            value={versionB}
            onChange={(e) => setVersionB(e.target.value)}
            className="w-full p-4 rounded-lg text-white placeholder:text-white/40 focus:outline-none resize-none"
            style={{ backgroundColor: 'rgba(90, 90, 150, 0.1)', border: '1px solid rgba(90, 90, 150, 0.6)' }}
            rows={4}
            placeholder="Presenta tu perfil de forma profesional..."
          />
          <p className="text-xs text-white/50 mt-1">Mayor énfasis en logros cuantificables</p>
        </div>
      </div>

      <div className="rounded-lg p-4 border border-purple-500/40" style={{ backgroundColor: 'rgba(90, 90, 150, 0.05)' }}>
        <p className="text-white/70 text-sm">
          Estos son borradores. El Coach y las pruebas reales nos darán feedback para mejorarlos.
        </p>
      </div>

      <Button
        onClick={handleSaveVersions}
        disabled={isSaving || isLoading || versionA.trim().length < 20 || versionB.trim().length < 20}
        className="w-full py-6 text-white font-semibold rounded-full"
        style={{ backgroundColor: 'rgba(90, 90, 150, 0.8)' }}
      >
        {isSaving ? 'Guardando...' : 'Siguiente: Coach Feedback'}
        <ChevronRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  )
}
