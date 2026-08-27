'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight, Sparkles } from 'lucide-react'

interface Day5CoachFeedbackProps {
  versionA: string
  versionB: string
  onFeedbackApplied: (improvedVersion: string) => Promise<void>
  isLoading: boolean
}

export function Day5CoachFeedback({
  versionA,
  versionB,
  onFeedbackApplied,
  isLoading,
}: Day5CoachFeedbackProps) {
  const [selectedVersion, setSelectedVersion] = useState<'a' | 'b'>('a')
  const [improvedVersion, setImprovedVersion] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const coachTip =
    selectedVersion === 'a'
      ? 'Agrega números y contexto: ¿Cuántos usuarios? ¿Qué impacto?'
      : 'Suena bien profesionalmente. Ahora hazla más memorable y humana.'

  const handleApplyFeedback = async () => {
    setIsSaving(true)
    try {
      await onFeedbackApplied(improvedVersion)
    } catch (err) {
      console.error('[v0] Error applying feedback:', err)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Feedback del Coach</h2>
        <p className="text-white/70">El Coach mejora tu introducción</p>
      </div>

      {/* Version Selection */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-white/80">¿Cuál versión quieres que mejore el Coach?</label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'a', label: 'Versión A (Casual)', text: versionA },
            { id: 'b', label: 'Versión B (Profesional)', text: versionB },
          ].map((ver) => (
            <button
              key={ver.id}
              onClick={() => setSelectedVersion(ver.id as 'a' | 'b')}
              className={`p-4 rounded-lg text-left transition-all ${
                selectedVersion === ver.id
                  ? 'border-2 border-cyan-400'
                  : 'border border-purple-500/40'
              }`}
              style={{
                backgroundColor:
                  selectedVersion === ver.id ? 'rgba(80, 160, 170, 0.15)' : 'rgba(90, 90, 150, 0.05)',
              }}
            >
              <p className="text-sm font-semibold text-white mb-1">{ver.label}</p>
              <p className="text-xs text-white/70 line-clamp-2">{ver.text}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Coach Analysis */}
      <div className="rounded-lg p-6 border border-cyan-400/40" style={{ backgroundColor: 'rgba(80, 160, 170, 0.05)' }}>
        <div className="flex gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-cyan-300 flex-shrink-0" />
          <p className="text-sm font-semibold text-cyan-300">Coach Says:</p>
        </div>
        <p className="text-white/90 mb-4">{coachTip}</p>

        <label className="text-sm font-semibold text-white/80 mb-2 block">Tu versión mejorada:</label>
        <textarea
          value={improvedVersion}
          onChange={(e) => setImprovedVersion(e.target.value)}
          placeholder={
            selectedVersion === 'a'
              ? 'Agrega: Cuántos usuarios, qué sectores, qué aprendiste...'
              : 'Agrega elementos de storytelling que la hagan más humana...'
          }
          className="w-full p-4 rounded-lg text-white placeholder:text-white/40 focus:outline-none resize-none"
          style={{ backgroundColor: 'rgba(90, 90, 150, 0.1)', border: '1px solid rgba(90, 90, 150, 0.6)' }}
          rows={4}
        />
      </div>

      <Button
        onClick={handleApplyFeedback}
        disabled={isSaving || isLoading || improvedVersion.trim().length < 20}
        className="w-full py-6 text-white font-semibold rounded-full"
        style={{ backgroundColor: 'rgba(90, 90, 150, 0.8)' }}
      >
        {isSaving ? 'Guardando...' : 'Siguiente: Test Real'}
        <ChevronRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  )
}
