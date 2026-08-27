'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight, Loader } from 'lucide-react'
import { WorkMemory } from '@/lib/supabase/a2-days7-8'

interface Day8CoachMemoryTaggerProps {
  memories: WorkMemory[]
  onMemoriesTagged: (taggedMemories: Array<{ id: string; tags: string[] }>) => Promise<void>
  isLoading: boolean
}

export function Day8CoachMemoryTagger({ memories, onMemoriesTagged, isLoading }: Day8CoachMemoryTaggerProps) {
  const firstUntagged = memories.findIndex((memory) => !memory.coach_tags?.length)
  const initialIndex = firstUntagged >= 0 ? firstUntagged : 0
  const [tagging, setTagging] = useState(false)
  const [current, setCurrent] = useState(initialIndex)
  const [tagsByMemory, setTagsByMemory] = useState<Record<string, string[]>>(() =>
    Object.fromEntries(memories.map((memory) => [memory.id, memory.coach_tags || []])),
  )
  const selectedTags = tagsByMemory[memories[current]?.id] || []

  const availableTags = [
    '#Liderazgo',
    '#Impacto',
    '#Estrategia',
    '#Ejecución',
    '#Innovación',
    '#Comunicación',
    '#Resolución',
    '#Crecimiento',
    '#Finanzas',
    '#Equipo',
  ]

  const handleTag = async () => {
    setTagging(true)
    try {
      if (current === memories.length - 1) {
        const allTagged = memories.map((mem) => ({
          id: mem.id,
          tags: tagsByMemory[mem.id] || [],
        }))
        await onMemoriesTagged(allTagged)
      } else {
        setCurrent((index) => index + 1)
      }
    } finally {
      setTagging(false)
    }
  }

  const memory = memories[current]
  const progress = ((current + 1) / memories.length) * 100

  const toggleTag = (tag: string) => {
    const memoryId = memories[current].id
    setTagsByMemory((currentTags) => {
      const tags = currentTags[memoryId] || []
      return {
        ...currentTags,
        [memoryId]: tags.includes(tag) ? tags.filter((item) => item !== tag) : [...tags, tag],
      }
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Paso 3: Etiquetar memorias ({current + 1}/{memories.length})</h2>
        <div className="w-full bg-white/20 rounded-full h-2 mt-3">
          <div
            className="h-2 rounded-full transition-all"
            style={{ width: `${progress}%`, backgroundColor: 'rgb(80, 160, 170)' }}
          />
        </div>
      </div>

      <div className="rounded-lg p-6 border border-cyan-400/40" style={{ backgroundColor: 'rgba(80, 160, 170, 0.05)' }}>
        <p className="text-sm font-semibold text-cyan-300 mb-3">MEMORIA #{current + 1}</p>
        <div className="text-white/80 space-y-2">
          <p><span className="font-semibold">Qué:</span> {memory.memory_text}</p>
          <p><span className="font-semibold">Dónde:</span> {memory.memory_where}</p>
          <p><span className="font-semibold">Por qué:</span> {memory.memory_why_remember}</p>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-white font-semibold">Selecciona tags relevantes:</p>
        <div className="grid grid-cols-2 gap-2">
          {availableTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                backgroundColor: selectedTags.includes(tag) ? 'rgba(80, 160, 170, 0.6)' : 'rgba(90, 90, 150, 0.3)',
                color: selectedTags.includes(tag) ? 'rgb(200, 255, 255)' : 'rgb(150, 200, 200)',
                border: `1px solid ${selectedTags.includes(tag) ? 'rgba(80, 160, 170, 1)' : 'rgba(90, 90, 150, 0.6)'}`,
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <Button
        onClick={handleTag}
        disabled={tagging || isLoading || selectedTags.length === 0}
        className="w-full py-6 text-white font-semibold rounded-full"
        style={{ backgroundColor: 'rgba(90, 90, 150, 0.8)' }}
      >
        {tagging || isLoading ? (
          <>
            <Loader className="w-4 h-4 mr-2 animate-spin" />
            Etiquetando...
          </>
        ) : (
          <>
            {current === memories.length - 1 ? 'Completar Etiquetado' : 'Siguiente Memoria'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>
    </div>
  )
}
