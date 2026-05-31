'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'

interface Day6IdentityForgeProps {
  archetype: string
  archetypeDescription: string
  onIdentitiesForged: (versions: {
    simple: string
    recruiter: string
    interview: string
  }) => Promise<void>
  isLoading: boolean
  onNext: () => void
}

export function Day6IdentityForge({
  archetype,
  archetypeDescription,
  onIdentitiesForged,
  isLoading,
  onNext,
}: Day6IdentityForgeProps) {
  const [versionSimple, setVersionSimple] = useState(
    `Soy un ${archetype} especializado en generar impacto. ${archetypeDescription}`
  )
  const [versionRecruiter, setVersionRecruiter] = useState(
    `Como ${archetype}, identifico oportunidades, coordino equipos y aseguro resultados medibles.`
  )
  const [versionInterview, setVersionInterview] = useState(
    'Aporto [expertise]. Mi fortaleza: [skill 1], [skill 2], [skill 3]. Cuando enfrenté [reto], aplicué [metodología] y logré [resultado cuantificado].'
  )
  const [isSaving, setIsSaving] = useState(false)

  const handleForgeIdentities = async () => {
    setIsSaving(true)
    try {
      await onIdentitiesForged({
        simple: versionSimple,
        recruiter: versionRecruiter,
        interview: versionInterview,
      })
      onNext()
    } catch (err) {
      console.error('[v0] Error forging identities:', err)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Forjar 3 Versiones de Tu Identidad</h2>
        <p className="text-white/70 mb-4">Eres un {archetype}</p>
      </div>

      <div className="space-y-4">
        {/* Simple Version */}
        <div>
          <label className="text-sm font-semibold text-white/80 mb-2 block">
            Versión Simple (tu esencia en 1-2 líneas)
          </label>
          <textarea
            value={versionSimple}
            onChange={(e) => setVersionSimple(e.target.value)}
            className="w-full p-4 rounded-lg text-white placeholder:text-white/40 focus:outline-none resize-none"
            style={{ backgroundColor: 'rgba(90, 90, 150, 0.1)', border: '1px solid rgba(90, 90, 150, 0.6)' }}
            rows={3}
            placeholder="Quién eres en la forma más simple..."
          />
        </div>

        {/* Recruiter Version */}
        <div>
          <label className="text-sm font-semibold text-white/80 mb-2 block">
            Versión Recruiter (para LinkedIn, CV, networking)
          </label>
          <textarea
            value={versionRecruiter}
            onChange={(e) => setVersionRecruiter(e.target.value)}
            className="w-full p-4 rounded-lg text-white placeholder:text-white/40 focus:outline-none resize-none"
            style={{ backgroundColor: 'rgba(90, 90, 150, 0.1)', border: '1px solid rgba(90, 90, 150, 0.6)' }}
            rows={3}
            placeholder="Cómo presentarías tu rol de manera profesional..."
          />
        </div>

        {/* Interview Version */}
        <div>
          <label className="text-sm font-semibold text-white/80 mb-2 block">
            Versión Entrevista (usa formato STAR: Situation, Task, Action, Result)
          </label>
          <textarea
            value={versionInterview}
            onChange={(e) => setVersionInterview(e.target.value)}
            className="w-full p-4 rounded-lg text-white placeholder:text-white/40 focus:outline-none resize-none"
            style={{ backgroundColor: 'rgba(90, 90, 150, 0.1)', border: '1px solid rgba(90, 90, 150, 0.6)' }}
            rows={3}
            placeholder="Con un reto específico que enfrentaste y cómo lo resolviste..."
          />
        </div>
      </div>

      <Button
        onClick={handleForgeIdentities}
        disabled={isSaving || isLoading}
        className="w-full py-6 text-white font-semibold rounded-full"
        style={{ backgroundColor: 'rgba(90, 90, 150, 0.8)' }}
      >
        {isSaving ? 'Guardando...' : 'Siguiente: Stress Test'}
        <ChevronRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  )
}
