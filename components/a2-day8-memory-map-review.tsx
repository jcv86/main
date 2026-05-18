'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight, Download } from 'lucide-react'
import { WorkMemory } from '@/lib/supabase/a2-days7-8'

interface Day8MemoryMapReviewProps {
  memories: WorkMemory[]
  selectedMemories: string[]
  onMemoriesSelected: (selected: string[]) => Promise<void>
  onComplete: () => Promise<void>
  isLoading: boolean
  isSubmitting: boolean
}

export function Day8MemoryMapReview({
  memories,
  selectedMemories,
  onMemoriesSelected,
  onComplete,
  isLoading,
  isSubmitting,
}: Day8MemoryMapReviewProps) {
  const [selecting, setSelecting] = useState(false)
  const [selected, setSelected] = useState<string[]>(selectedMemories)

  const handleToggleMemory = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    )
  }

  const handleSelectBest = async () => {
    setSelecting(true)
    try {
      await onMemoriesSelected(selected)
    } finally {
      setSelecting(false)
    }
  }

  const handleComplete = async () => {
    await onComplete()
  }

  const handleExport = () => {
    const mapData = JSON.stringify({
      totalMemories: memories.length,
      selectedMemories: selected.length,
      memories: memories.filter(m => selected.includes(m.id)),
      exportDate: new Date().toISOString(),
    }, null, 2)
    
    const element = document.createElement('a')
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(mapData)}`)
    element.setAttribute('download', `mapa-memorias-${new Date().toISOString().split('T')[0]}.json`)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Paso 4: Mapa de Memorias</h2>
        <p className="text-white/70">Selecciona tus 5 mejores historias para construir STAR stories</p>
      </div>

      <div className="space-y-3">
        {memories.map((memory) => (
          <button
            key={memory.id}
            onClick={() => handleToggleMemory(memory.id)}
            className="w-full text-left p-4 rounded-lg transition-all border"
            style={{
              backgroundColor: selected.includes(memory.id) ? 'rgba(80, 160, 170, 0.2)' : 'rgba(90, 90, 150, 0.1)',
              borderColor: selected.includes(memory.id) ? 'rgba(80, 160, 170, 0.6)' : 'rgba(90, 90, 150, 0.4)',
            }}
          >
            <div className="flex gap-3">
              <div
                className="w-6 h-6 rounded border-2 mt-1 flex-shrink-0"
                style={{
                  borderColor: selected.includes(memory.id) ? 'rgb(80, 160, 170)' : 'rgba(90, 90, 150, 0.6)',
                  backgroundColor: selected.includes(memory.id) ? 'rgba(80, 160, 170, 0.5)' : 'transparent',
                }}
              >
                {selected.includes(memory.id) && (
                  <p className="text-white font-bold text-center text-xs leading-5">✓</p>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white/90 text-sm truncate">{memory.memory_text}</p>
                <div className="flex gap-2 mt-1 flex-wrap">
                  {memory.coach_tags && memory.coach_tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 rounded"
                      style={{ backgroundColor: 'rgba(80, 160, 170, 0.3)', color: 'rgb(150, 200, 200)' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="rounded-lg p-4 border border-cyan-400/40" style={{ backgroundColor: 'rgba(80, 160, 170, 0.05)' }}>
        <p className="text-white/80 text-sm">
          {selected.length}/{memories.length} memorias seleccionadas
          {selected.length > 5 && ' (más de 5, ok para este ejercicio)'}
        </p>
      </div>

      <div className="space-y-3">
        <Button
          onClick={handleSelectBest}
          disabled={selecting || isLoading || selected.length === 0}
          className="w-full py-4 text-white font-semibold rounded-full border border-cyan-400/60"
          style={{ backgroundColor: 'rgba(80, 160, 170, 0.2)' }}
        >
          <Download className="w-4 h-4 mr-2" />
          Guardar Selección
        </Button>

        <Button
          onClick={handleExport}
          className="w-full py-4 text-white font-semibold rounded-full"
          style={{ backgroundColor: 'rgba(90, 90, 150, 0.6)' }}
        >
          <Download className="w-4 h-4 mr-2" />
          Descargar Mapa
        </Button>

        <Button
          onClick={handleComplete}
          disabled={isSubmitting}
          className="w-full py-6 text-white font-semibold rounded-full"
          style={{ backgroundColor: 'rgba(90, 90, 150, 0.8)' }}
        >
          {isSubmitting ? 'Completando...' : 'Completar Día 8 → Día 9'}
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
