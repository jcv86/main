'use client'

import { Button } from '@/components/ui/button'
import { Check, Download } from 'lucide-react'
import { type ProfessionalIdentity } from '@/lib/supabase/a2-intro-identity'

interface Day6ExportProps {
  identity: ProfessionalIdentity
  onComplete: () => Promise<void>
  isSubmitting: boolean
}

export function Day6Export({ identity, onComplete, isSubmitting }: Day6ExportProps) {
  const handleExport = () => {
    const content = `
IDENTIDAD PROFESIONAL FORJADA
========================================

Arquetipo: ${identity.candidate_archetype}
Validada el: ${new Date().toLocaleDateString('es-AR')}

---

VERSIÓN SIMPLE
${identity.version_simple}

---

VERSIÓN RECRUITER
${identity.version_recruiter}

---

VERSIÓN ENTREVISTA (STAR)
${identity.version_interview}

---

Estado: ${identity.is_validated ? 'VALIDADA' : 'En proceso'}
Resultado Stress Test: ${identity.stress_test_result ? JSON.parse(identity.stress_test_result).questions_answered + ' preguntas respondidas' : 'Pendiente'}

========================================
Exportado desde Despega Tu Carrera - Día 6
    `.trim()

    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content))
    element.setAttribute('download', `identidad-profesional-${Date.now()}.txt`)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Tu Identidad Profesional Forjada</h2>
        <p className="text-white/70">Revisar, exportar y completar Día 6</p>
      </div>

      {/* Identity Summary */}
      <div className="space-y-3">
        <div className="rounded-lg p-6 border border-purple-500/40" style={{ backgroundColor: 'rgba(90, 90, 150, 0.05)' }}>
          <p className="text-xs font-semibold text-white/60 mb-2">ARQUETIPO</p>
          <p className="text-white font-semibold">{identity.candidate_archetype}</p>
        </div>

        <div className="rounded-lg p-6 border border-purple-500/40" style={{ backgroundColor: 'rgba(90, 90, 150, 0.05)' }}>
          <p className="text-xs font-semibold text-white/60 mb-2">VERSIÓN SIMPLE</p>
          <p className="text-white">{identity.version_simple}</p>
        </div>

        <div className="rounded-lg p-6 border border-purple-500/40" style={{ backgroundColor: 'rgba(90, 90, 150, 0.05)' }}>
          <p className="text-xs font-semibold text-white/60 mb-2">VERSIÓN RECRUITER</p>
          <p className="text-white">{identity.version_recruiter}</p>
        </div>

        <div className="rounded-lg p-6 border border-purple-500/40" style={{ backgroundColor: 'rgba(90, 90, 150, 0.05)' }}>
          <p className="text-xs font-semibold text-white/60 mb-2">VERSIÓN ENTREVISTA</p>
          <p className="text-white">{identity.version_interview}</p>
        </div>

        {identity.is_validated && (
          <div className="rounded-lg p-4 border border-green-500/40" style={{ backgroundColor: 'rgba(34, 197, 94, 0.05)' }}>
            <p className="text-green-300 text-sm flex gap-2 items-center">
              <Check className="w-4 h-4" />
              Identidad validada y lista para usar
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={handleExport}
          className="py-6 text-white font-semibold rounded-full flex gap-2 justify-center items-center"
          style={{ backgroundColor: 'rgba(90, 90, 150, 0.8)' }}
        >
          <Download className="w-4 h-4" />
          Exportar TXT
        </Button>

        <Button
          onClick={onComplete}
          disabled={isSubmitting}
          className="py-6 text-white font-semibold rounded-full"
          style={{ backgroundColor: 'rgba(80, 160, 170, 0.8)' }}
        >
          {isSubmitting ? 'Completando...' : 'Completar Día 6'}
          <Check className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
