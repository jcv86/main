'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, CheckCircle } from 'lucide-react'

interface A2Day2EvidenceHuntProps {
  onNext: () => void
  onBack: () => void
}

const places = [
  {
    id: 'cv',
    title: 'CV/LinkedIn Anteriores',
    description: 'Busca CV viejo o LinkedIn antiguo',
    tasks: ['Cópialo a tu Bóveda', 'Saca roles exactos, títulos, empresas, herramientas'],
  },
  {
    id: 'messages',
    title: 'Emails/WhatsApp/Slack/Teams',
    description: 'Busca reconocimiento y feedback',
    tasks: ['Busca "gracias", "perfecto", "bien hecho"', 'Copia emails/mensajes', 'Copia números mencionados'],
  },
  {
    id: 'files',
    title: 'Archivos/Reportes/Screenshots',
    description: 'Documentos que guardaste',
    tasks: ['Busca en Documentos, Desktop, Drive, Dropbox, OneDrive', 'Copia reportes, presentaciones, planillas'],
  },
  {
    id: 'memories',
    title: 'Memorias de Días de Trabajo',
    description: 'Momentos concretos que recuerdas',
    tasks: ['Resolviste problema difícil', 'Ayudaste a alguien importante', 'Manejaste crisis', 'Mejoraste métrica'],
  },
  {
    id: 'feedback',
    title: 'Feedback de Otros',
    description: 'Reconocimiento externo',
    tasks: ['Recomendaciones LinkedIn', 'Evaluaciones de desempeño', 'Testimonios', 'Feedback 1-on-1s'],
  },
]

export function A2Day2EvidenceHunt({
  onNext,
  onBack,
}: A2Day2EvidenceHuntProps) {
  const [checkedPlaces, setCheckedPlaces] = useState<Record<string, boolean>>({})

  const handleTogglePlace = (placeId: string) => {
    setCheckedPlaces((prev) => ({
      ...prev,
      [placeId]: !prev[placeId],
    }))
  }

  const checkedCount = Object.values(checkedPlaces).filter(Boolean).length
  const isComplete = checkedCount >= 5

  return (
    <div className="max-w-3xl mx-auto px-4 space-y-8">
      {/* Header */}
      <div
        className="rounded-lg p-4"
        style={{ backgroundColor: 'rgba(90, 90, 150, 0.1)', borderColor: 'rgba(90, 90, 150, 0.2)', border: '1px solid' }}
      >
        <h3 className="font-bold text-white mb-2">Caza en 5 Lugares</h3>
        <p className="text-sm text-white/70">
          Busca evidencia real. No es perfecta, es auténtica. Meta: 7+ fragmentos total.
        </p>
      </div>

      {/* Places Checklist */}
      <div className="space-y-4">
        {places.map((place) => (
          <div
            key={place.id}
            onClick={() => handleTogglePlace(place.id)}
            className="p-4 rounded-lg border-2 cursor-pointer transition-all"
            style={{
              borderColor: checkedPlaces[place.id] ? 'rgb(80, 160, 170)' : 'rgba(90, 90, 150, 0.2)',
              backgroundColor: checkedPlaces[place.id] ? 'rgba(80, 160, 170, 0.1)' : 'rgba(90, 90, 150, 0.05)',
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-white">{place.title}</h4>
                <p className="text-xs text-white/60 mt-1">{place.description}</p>
              </div>
              {checkedPlaces[place.id] && (
                <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: 'rgb(80, 160, 170)' }} />
              )}
            </div>

            <ul className="text-xs text-white/70 space-y-1 ml-4">
              {place.tasks.map((task, idx) => (
                <li key={idx}>• {task}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="text-center">
        <p className="text-sm text-white/70">
          Lugares buscados: <span className="font-semibold text-white">{checkedCount}/5</span>
        </p>
        <p className="text-xs text-white/50 mt-1">
          Meta: Mínimo 7 fragmentos cuando termines
        </p>
      </div>

      {/* Mini Lesson */}
      <div
        className="rounded-lg p-4 space-y-2"
        style={{ backgroundColor: 'rgba(80, 160, 170, 0.1)', border: '1px solid rgba(80, 160, 170, 0.2)' }}
      >
        <p className="text-sm font-semibold text-white/90">Tips para la Caza:</p>
        <ul className="text-sm text-white/70 space-y-1 ml-4">
          <li>✓ No edites mientras copias. Copia todo tal como está.</li>
          <li>✓ Si hay contexto faltante, anota una línea explicativa.</li>
          <li>✓ Incluye números (resultados, métricas, impacto).</li>
          <li>✓ Busca feedback directo de gente que trabajó contigo.</li>
        </ul>
      </div>

      {/* CTA */}
      <div className="pt-4 border-t space-y-3" style={{ borderColor: 'rgba(90, 90, 150, 0.2)' }}>
        <Button
          onClick={onNext}
          disabled={!isComplete}
          className="w-full"
          size="lg"
          style={{
            backgroundColor: isComplete ? 'rgb(90, 90, 150)' : 'rgba(90, 90, 150, 0.4)',
            color: 'white',
          }}
        >
          Tengo 7+ Fragmentos → Subir Ahora →
        </Button>

        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/50 hover:text-white/70 text-sm transition w-full justify-center"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>
      </div>
    </div>
  )
}
