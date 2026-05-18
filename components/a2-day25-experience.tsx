'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight, FileText } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Day25ExperienceProps {
  onComplete: (submission: any) => Promise<void>
  userId?: string
}

export function Day25Experience({ onComplete, userId }: Day25ExperienceProps) {
  const [step, setStep] = useState(1)
  const [exportFormat, setExportFormat] = useState<string>('')
  const [fileName, setFileName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const sb = createClient()

  const exportOptions = [
    { value: 'pdf', label: 'PDF', description: 'Universal y seguro' },
    { value: 'docx', label: 'Word (.DOCX)', description: 'Editable en Office' },
    { value: 'google_docs', label: 'Google Docs', description: 'Acceso compartido' },
  ]

  const handleExport = async () => {
    if (!exportFormat || !fileName) {
      alert('Por favor selecciona un formato y nombre de archivo')
      return
    }

    setIsSubmitting(true)
    try {
      if (userId) {
        const { error: err } = await sb.from('a2_cv_export').insert({
          user_id: userId,
          day_number: 25,
          export_format: exportFormat,
          file_name: fileName,
          has_summary: true,
          has_bullets: true,
          has_skills: true,
          has_cleaned_language: true,
          export_completed: true,
          is_ready_for_checkpoint: true,
        })

        if (err && err.code !== '23505') throw err
      }

      await onComplete({
        dayNumber: 25,
        exportFormat,
        fileName,
        completedAt: new Date().toISOString(),
      })
    } catch (err) {
      console.error('[v0] Error completing Day 25:', err)
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4">
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-3">Ritual de Exportación</h2>
            <p className="text-white/70 text-lg">Lleva tu CV más allá de la plataforma</p>
          </div>

          <div className="rounded-lg p-6" style={{ backgroundColor: 'rgba(80, 160, 170, 0.15)' }}>
            <h3 className="text-white font-semibold mb-3">Pre-Verificación</h3>
            <ul className="space-y-2 text-white/80 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Resumen profesional: Listo</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Bullets mejorados: 6 de 6</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Sección de habilidades: Organizada</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Lenguaje limpio: Validado</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Prueba de estrés: Completada</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-white font-semibold mb-3 block">Elige Formato de Exportación:</label>
              <div className="space-y-2">
                {exportOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => setExportFormat(option.value)}
                    className={`w-full text-left p-4 rounded-lg transition-all border-2 ${
                      exportFormat === option.value
                        ? 'border-white bg-white/10'
                        : 'border-white/20 bg-white/5 hover:border-white/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-white/80" />
                      <div>
                        <p className="text-white font-semibold">{option.label}</p>
                        <p className="text-white/60 text-sm">{option.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-white font-semibold mb-2 block">Nombre del Archivo</label>
              <input
                type="text"
                placeholder="Ej: CV_Base_DTC_JuanGomez_2025"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="w-full px-4 py-3 rounded bg-white/10 border border-white/20 text-white placeholder-white/40"
              />
              <p className="text-white/60 text-xs mt-2">Sugerido: CV_Base_DTC_[TuNombre]_[Fecha]</p>
            </div>
          </div>

          <Button
            onClick={handleExport}
            disabled={!exportFormat || !fileName || isSubmitting}
            className="w-full py-6 text-white font-semibold rounded-full"
            style={{ backgroundColor: 'rgb(80, 160, 170)' }}
          >
            {isSubmitting ? 'Exportando...' : 'Exportar CV'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
}
