'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight, Loader } from 'lucide-react'
import { WorkMemory } from '@/lib/supabase/a2-days7-8'

interface Day8MemoryCaptureFormProps {
  memories: WorkMemory[]
  onMemoryCaptured: (memoryData: any) => Promise<void>
  isLoading: boolean
  onNext: () => void
}

export function Day8MemoryCaptureForm({ memories, onMemoryCaptured, isLoading, onNext }: Day8MemoryCaptureFormProps) {
  const firstIncomplete = memories.findIndex((memory) =>
    !memory.memory_text?.trim() || !memory.memory_where?.trim() || !memory.memory_why_remember?.trim()
  )
  const initialIndex = firstIncomplete >= 0 ? firstIncomplete : 0
  const [capturing, setCapturing] = useState(false)
  const [current, setCurrent] = useState(initialIndex)
  const [what, setWhat] = useState(memories[initialIndex]?.memory_text || '')
  const [where, setWhere] = useState(memories[initialIndex]?.memory_where || '')
  const [why, setWhy] = useState(memories[initialIndex]?.memory_why_remember || '')

  const handleCapture = async () => {
    setCapturing(true)
    try {
      await onMemoryCaptured({
        memory_id: memories[current].memory_id,
        memory_text: what,
        memory_where: where,
        memory_why_remember: why,
      })
      
      if (current < memories.length - 1) {
        const next = current + 1
        setCurrent(next)
        setWhat(memories[next]?.memory_text || '')
        setWhere(memories[next]?.memory_where || '')
        setWhy(memories[next]?.memory_why_remember || '')
      } else {
        onNext()
      }
    } finally {
      setCapturing(false)
    }
  }

  if (current >= memories.length) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <p className="text-2xl font-bold text-cyan-300">✓ Memorias Capturadas</p>
          <p className="text-white/70">Todas tus {memories.length} memorias han sido registradas</p>
        </div>
        <Button
          onClick={onNext}
          className="w-full py-6 text-white font-semibold rounded-full"
          style={{ backgroundColor: 'rgba(90, 90, 150, 0.8)' }}
        >
          Siguiente: Etiquetado por Coach
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    )
  }

  const memory = memories[current]
  const progress = ((current + 1) / memories.length) * 100

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Paso 2: Capturar Memorias ({current + 1}/{memories.length})</h2>
        <div className="w-full bg-white/20 rounded-full h-2 mt-3">
          <div
            className="h-2 rounded-full transition-all"
            style={{ width: `${progress}%`, backgroundColor: 'rgb(80, 160, 170)' }}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-white font-semibold mb-2">¿Qué pasó? (WHAT)</label>
          <textarea
            value={what}
            onChange={(e) => setWhat(e.target.value)}
            placeholder="Ej: Lancé un nuevo producto que resultó en $500K MRR"
            className="w-full p-4 rounded-lg text-white placeholder:text-white/40 focus:outline-none resize-none"
            style={{ backgroundColor: 'rgba(90, 90, 150, 0.2)', border: '1px solid rgba(90, 90, 150, 0.6)' }}
            rows={3}
          />
        </div>

        <div>
          <label className="block text-white font-semibold mb-2">¿Dónde? (WHERE)</label>
          <input
            type="text"
            value={where}
            onChange={(e) => setWhere(e.target.value)}
            placeholder="Ej: Empresa X, Q3 2021, Equipo de Producto"
            className="w-full p-4 rounded-lg text-white placeholder:text-white/40 focus:outline-none"
            style={{ backgroundColor: 'rgba(90, 90, 150, 0.2)', border: '1px solid rgba(90, 90, 150, 0.6)' }}
          />
        </div>

        <div>
          <label className="block text-white font-semibold mb-2">¿Por qué la recuerdas? (WHY)</label>
          <textarea
            value={why}
            onChange={(e) => setWhy(e.target.value)}
            placeholder="Ej: Fue mi mayor logro. Mostró mi capacidad de liderazgo y pensamiento estratégico."
            className="w-full p-4 rounded-lg text-white placeholder:text-white/40 focus:outline-none resize-none"
            style={{ backgroundColor: 'rgba(90, 90, 150, 0.2)', border: '1px solid rgba(90, 90, 150, 0.6)' }}
            rows={3}
          />
        </div>
      </div>

      <Button
        onClick={handleCapture}
        disabled={capturing || isLoading || what.trim().length < 10 || where.trim().length < 3 || why.trim().length < 5}
        className="w-full py-6 text-white font-semibold rounded-full"
        style={{ backgroundColor: 'rgba(90, 90, 150, 0.8)' }}
      >
        {capturing || isLoading ? (
          <>
            <Loader className="w-4 h-4 mr-2 animate-spin" />
            Capturando...
          </>
        ) : (
          <>
            {current === memories.length - 1 ? 'Última Memoria - Siguiente' : 'Siguiente Memoria'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>
    </div>
  )
}
