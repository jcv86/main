'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight, Loader, AlertCircle } from 'lucide-react'
import { Day8VaultImport } from './a2-day8-vault-import'
import { Day8MemoryCaptureForm } from './a2-day8-memory-capture-form'
import { Day8CoachMemoryTagger } from './a2-day8-coach-memory-tagger'
import { Day8MemoryMapReview } from './a2-day8-memory-map-review'
import {
  createWorkMemory,
  getWorkMemories,
  updateWorkMemory,
  bulkUpdateWorkMemories,
  type WorkMemory,
} from '@/lib/supabase/a2-days7-8'
import { ensureTravisDataForDay } from '@/lib/travis-seed-supabase'
import { isTravisMode } from '@/lib/travis-form-data'
import { saveDayDocument, formatDocumentContent } from '@/lib/supabase/dtc-documents-phase2'

interface Day8ExperienceProps {
  onComplete: (submission: any) => Promise<void>
  userId?: string
}

export function Day8Experience({ onComplete, userId }: Day8ExperienceProps) {
  const [step, setStep] = useState(1)
  const [memories, setMemories] = useState<WorkMemory[]>([])
  const [selectedMemories, setSelectedMemories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDevMode, setIsDevMode] = useState(false)

  // Load existing data on mount (with Travis auto-seed)
  useEffect(() => {
    const travisMode = isTravisMode()
    setIsDevMode(travisMode)
    
    if (userId) {
      initializeDay8(travisMode)
    }
  }, [userId])

  const initializeDay8 = async (travisMode: boolean) => {
    if (!userId) return
    setIsLoading(true)
    
    try {
      if (travisMode) {
        await ensureTravisDataForDay(userId, 8)
      }
      await loadDay8Data()
    } catch (err) {
      console.error('[v0] Error initializing Day 8:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const loadDay8Data = async () => {
    if (!userId) return
    try {
      const { data: memories, error: memoriesError } = await getWorkMemories(userId, 8)
      if (memoriesError && memoriesError.code !== 'PGRST116') throw memoriesError
      if (memories && memories.length > 0) {
        setMemories(memories)
        setSelectedMemories(memories.filter(m => m.is_selected).map(m => m.id))
        const completedCount = memories.filter((memory) =>
          memory.memory_text?.trim().length >= 10 &&
          memory.memory_where?.trim().length >= 3 &&
          memory.memory_why_remember?.trim().length >= 5
        ).length
        const taggedCount = memories.filter((memory) => (memory.coach_tags || []).length > 0).length
        const selectedCount = memories.filter((memory) => memory.is_selected).length
        if (selectedCount >= 3 || taggedCount >= 3) setStep(5)
        else if (completedCount >= 5) setStep(4)
        else setStep(3)
      }
    } catch (err) {
      console.error('[v0] Error loading Day 8 data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVaultImported = async (vaultData: any) => {
    if (!userId) return

    setIsLoading(true)
    try {
      const { data: existing, error: existingError } = await getWorkMemories(userId, 8)
      if (existingError && existingError.code !== 'PGRST116') throw existingError
      const newMemories: WorkMemory[] = [...(existing || [])]
      const existingIds = new Set(newMemories.map((memory) => memory.memory_id))
      for (let i = 0; i < vaultData.count; i++) {
        if (existingIds.has(i + 1)) continue
        const { data: memory, error } = await createWorkMemory(userId, {
          day_number: 8,
          memory_id: i + 1,
          memory_text: '',
          memory_where: '',
          memory_why_remember: '',
          is_selected: false,
          creation_timestamp: new Date().toISOString(),
          source_from_day_2: vaultData.fromDay2,
          status: 'in_progress',
        })
        if (error) throw error
        if (memory) newMemories.push(memory)
      }
      setMemories(newMemories)
      setStep(3)
    } catch (err) {
      console.error('[v0] Error importing vault:', err)
      setError('Error al importar bóveda.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const handleMemoryCaptured = async (memoryData: {
    memory_id: number
    memory_text: string
    memory_where: string
    memory_why_remember: string
  }) => {
    if (!userId) return

    setIsLoading(true)
    try {
      const existingMemory = memories.find(m => m.memory_id === memoryData.memory_id)
      if (existingMemory) {
        const { data: updated, error } = await updateWorkMemory(existingMemory.id, userId, {
          memory_text: memoryData.memory_text,
          memory_where: memoryData.memory_where,
          memory_why_remember: memoryData.memory_why_remember,
        })
        if (error) throw error
        if (updated) {
          setMemories(memories.map(m => m.id === updated.id ? updated : m))
        }
      }
    } catch (err) {
      console.error('[v0] Error capturing memory:', err)
      setError('Error al capturar memoria.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const handleMemoriesTagged = async (taggedMemories: Array<{
    id: string
    tags: string[]
  }>) => {
    if (!userId) return

    setIsLoading(true)
    try {
      const updates = taggedMemories.map(tm => ({
        id: tm.id,
        data: { coach_tags: tm.tags },
      }))
      const { data: updated, error } = await bulkUpdateWorkMemories(userId, updates)
      if (error) throw error
      if (updated) {
        setMemories(updated as WorkMemory[])
        setStep(5)
      }
    } catch (err) {
      console.error('[v0] Error tagging memories:', err)
      setError('Error al etiquetar memorias.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const handleMemoriesSelected = async (selected: string[]) => {
    if (!userId) return

    setIsLoading(true)
    try {
      const updates = memories.map(m => ({
        id: m.id,
        data: { is_selected: selected.includes(m.id) },
      }))
      const { data: updated, error } = await bulkUpdateWorkMemories(userId, updates)
      if (error) throw error
      if (updated) {
        setMemories(updated as WorkMemory[])
        setSelectedMemories(selected)
      }
    } catch (err) {
      console.error('[v0] Error selecting memories:', err)
      setError('Error al seleccionar memorias.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const handleCompleteDay = async () => {
    setIsSubmitting(true)
    try {
      await onComplete({
        dayNumber: 8,
        workMemories: memories,
        selectedMemories,
        completedAt: new Date().toISOString(),
      })
    } catch (err) {
      console.error('[v0] Error completing Day 8:', err)
      setError('Error al completar el día.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4">
      {error && (
        <div className="rounded-lg p-4 border border-red-500/40" style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)' }}>
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        </div>
      )}

      {isLoading && step === 1 && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader className="w-8 h-8 text-cyan-400 animate-spin" />
          <p className="text-white/70">Cargando tus memorias...</p>
        </div>
      )}

      {step === 1 && !isLoading && (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-3">Excavación de Memoria Profesional</h2>
            <p className="text-white/70">Extrae tus 10 mejores historias de trabajo reales</p>
          </div>

          <div className="rounded-lg p-6 border border-purple-500/40" style={{ backgroundColor: 'rgba(90, 90, 150, 0.1)' }}>
            <h3 className="text-white font-semibold mb-4">Hoy buscamos:</h3>
            <ul className="space-y-3 text-white/80">
              <li className="flex gap-3">
                <span style={{ color: 'rgb(80, 160, 170)' }}>✓</span>
                <span>10 memorias laborales crudas (What / Where / Why Remember)</span>
              </li>
              <li className="flex gap-3">
                <span style={{ color: 'rgb(80, 160, 170)' }}>✓</span>
                <span>Etiquetar cada una por impacto, habilidades y tipo</span>
              </li>
              <li className="flex gap-3">
                <span style={{ color: 'rgb(80, 160, 170)' }}>✓</span>
                <span>Seleccionar al menos 3 para construcción STAR</span>
              </li>
              <li className="flex gap-3">
                <span style={{ color: 'rgb(80, 160, 170)' }}>✓</span>
                <span>Exportar tu Mapa de Memorias</span>
              </li>
            </ul>
          </div>

          <Button
            onClick={() => setStep(2)}
            className="w-full py-6 text-white font-semibold rounded-full"
            style={{ backgroundColor: 'rgba(90, 90, 150, 0.8)' }}
          >
            Comenzar Excavación
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {step === 2 && (
        <Day8VaultImport
          onVaultImported={handleVaultImported}
          isLoading={isLoading}
        />
      )}

      {step === 3 && memories.length > 0 && (
        <Day8MemoryCaptureForm
          memories={memories}
          onMemoryCaptured={handleMemoryCaptured}
          isLoading={isLoading}
          onNext={() => setStep(4)}
        />
      )}

      {step === 4 && memories.length > 0 && (
        <Day8CoachMemoryTagger
          memories={memories}
          onMemoriesTagged={handleMemoriesTagged}
          isLoading={isLoading}
        />
      )}

      {step === 5 && memories.length > 0 && (
        <Day8MemoryMapReview
          memories={memories}
          selectedMemories={selectedMemories}
          onMemoriesSelected={handleMemoriesSelected}
          onComplete={handleCompleteDay}
          isLoading={isLoading}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  )
}
