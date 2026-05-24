'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, Sparkles } from 'lucide-react'

interface A2Day2ClassificationProps {
  fragments: any[]
  onNext: (classified: any[]) => void
  onBack: () => void
}

export function A2Day2Classification({
  fragments,
  onNext,
  onBack,
}: A2Day2ClassificationProps) {
  const [classifiedFragments, setClassifiedFragments] = useState(fragments)
  const [isClassifying, setIsClassifying] = useState(true)

  const fragmentTypes = ['achievement', 'responsibility', 'recognition', 'number', 'other']

  useEffect(() => {
    // Simulate classification
    const timeout = setTimeout(() => {
      const classified = fragments.map((frag) => ({
        ...frag,
        type: fragmentTypes[Math.floor(Math.random() * fragmentTypes.length)],
        categories: ['skills', 'impact', 'work'],
        potentialCV: `Achieved/managed ${frag.rawText.substring(0, 40)}...`,
        potentialSTAR: {
          situation: 'Context...',
          task: 'Task...',
          action: 'Action...',
          result: 'Result...',
        },
        potentialSkills: ['Communication', 'Problem Solving', 'Leadership'],
      }))
      setClassifiedFragments(classified)
      setIsClassifying(false)
    }, 2000)

    return () => clearTimeout(timeout)
  }, [fragments])

  const handleNext = () => {
    onNext(classifiedFragments)
  }

  if (isClassifying) {
    return (
      <div className="max-w-3xl mx-auto px-4 space-y-6">
        <div
          className="rounded-lg p-8 space-y-4"
          style={{ backgroundColor: 'rgba(90, 90, 150, 0.1)' }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-5 h-5 animate-spin rounded-full border-2 border-[rgba(80,160,170,0.2)] border-t-[rgba(80,160,170,0.8)]"></div>
            <p className="text-white font-semibold">Clasificando evidencia...</p>
          </div>

          <div className="space-y-2">
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full"
                style={{
                  background: 'linear-gradient(90deg, rgba(90,90,150,0.4), rgba(90,90,150,0.8))',
                  animation: 'pulse 2s infinite',
                  width: '60%',
                }}
              ></div>
            </div>
            <p className="text-xs text-white/50">Analizando {fragments.length} fragmentos...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 space-y-6">
      {/* Header */}
      <div
        className="rounded-lg p-4"
        style={{ backgroundColor: 'rgba(90, 90, 150, 0.1)', borderColor: 'rgba(80, 160, 170, 0.2)', border: '1px solid' }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5" style={{ color: 'rgb(80, 160, 170)' }} />
          <h3 className="font-bold text-white">Evidencia Clasificada</h3>
        </div>
        <p className="text-sm text-white/70">
          DTC clasificó {classifiedFragments.length} fragmentos automáticamente.
        </p>
      </div>

      {/* Classified Fragments Preview */}
      <div className="space-y-3">
        {classifiedFragments.slice(0, 3).map((frag, idx) => (
          <div
            key={frag.id}
            className="p-4 rounded-lg"
            style={{
              backgroundColor: 'rgba(90, 90, 150, 0.05)',
              borderColor: 'rgba(80, 160, 170, 0.2)',
              border: '1px solid',
            }}
          >
            <div className="flex items-start justify-between mb-2">
              <p className="text-xs font-semibold text-white/70">Fragmento {idx + 1}</p>
              <span
                className="text-xs px-2 py-1 rounded"
                style={{
                  backgroundColor: 'rgba(80, 160, 170, 0.2)',
                  color: 'rgb(80, 160, 170)',
                }}
              >
                {frag.type}
              </span>
            </div>
            <p className="text-sm text-white/80 line-clamp-2">{frag.rawText}</p>
          </div>
        ))}
        {classifiedFragments.length > 3 && (
          <p className="text-xs text-white/50 text-center">+ {classifiedFragments.length - 3} más</p>
        )}
      </div>

      {/* CTA */}
      <div className="pt-4 border-t space-y-3" style={{ borderColor: 'rgba(80, 160, 170, 0.2)' }}>
        <button
          onClick={handleNext}
          className="w-full py-3 rounded-lg text-white font-semibold transition"
          style={{
            backgroundColor: 'rgb(90, 90, 150)',
          }}
        >
          Ver Las 3 Piezas de Oro →
        </button>

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
