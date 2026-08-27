'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'

interface Day6ArchetypeSelectorProps {
  onArchetypeSelected: (archetype: string, description: string) => Promise<void>
  isLoading: boolean
}

const ARCHETYPES = [
  {
    name: 'Organizador',
    description: 'Estructuras procesos, coordina equipos, asegura que todo funcione como reloj',
  },
  {
    name: 'Solucionador',
    description: 'Resuelve problemas complejos, piensa sistémicamente, propone alternativas',
  },
  {
    name: 'Operador',
    description: 'Ejecuta bien, cumple deadlines, maneja multiples tareas en paralelo',
  },
  {
    name: 'Conector',
    description: 'Construye relaciones, genera alianzas, facilita colaboración',
  },
  {
    name: 'Constructor',
    description: 'Crea desde cero, innova, lanza nuevas iniciativas',
  },
  {
    name: 'Analista',
    description: 'Mira datos profundamente, identifica patrones, cuestiona supuestos',
  },
  {
    name: 'Mentor',
    description: 'Desarrolla personas, lidera con ejemplo, transmite conocimiento',
  },
  {
    name: 'Buscador',
    description: 'Explora nuevas oportunidades, aprende constantemente, se adapta rápido',
  },
  {
    name: 'Catalizador',
    description: 'Acelera cambio, motiva otros, genera momentum',
  },
]

export function Day6ArchetypeSelector({
  onArchetypeSelected,
  isLoading,
}: Day6ArchetypeSelectorProps) {
  const [selectedArchetype, setSelectedArchetype] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const handleSelectArchetype = async () => {
    if (!selectedArchetype) return

    setIsSaving(true)
    try {
      const archetype = ARCHETYPES.find((a) => a.name === selectedArchetype)
      await onArchetypeSelected(selectedArchetype, archetype?.description || '')
    } catch (err) {
      console.error('[v0] Error selecting archetype:', err)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Elige Tu Arquetipo Profesional</h2>
        <p className="text-white/70">9 arquetipos que definen cómo contribuyes al mercado</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {ARCHETYPES.map((archetype) => (
          <button
            type="button"
            key={archetype.name}
            onClick={() => setSelectedArchetype(archetype.name)}
            className={`p-4 rounded-lg transition-all border-2 text-left ${
              selectedArchetype === archetype.name
                ? 'border-cyan-400'
                : 'border-purple-500/40'
            }`}
            style={{
              backgroundColor:
                selectedArchetype === archetype.name
                  ? 'rgba(80, 160, 170, 0.15)'
                  : 'rgba(90, 90, 150, 0.05)',
            }}
          >
            <p className="font-semibold text-white text-sm">{archetype.name}</p>
            <p className="text-xs text-white/70 mt-2 line-clamp-2">{archetype.description}</p>
          </button>
        ))}
      </div>

      <div className="rounded-lg p-4 border border-purple-500/40" style={{ backgroundColor: 'rgba(90, 90, 150, 0.05)' }}>
        <p className="text-white/70 text-sm">
          No es fijo. Puedes cambiar. Pero hoy, ¿cuál te describe mejor?
        </p>
      </div>

      <Button
        type="button"
        onClick={handleSelectArchetype}
        disabled={!selectedArchetype || isSaving || isLoading}
        className="w-full py-6 text-white font-semibold rounded-full"
        style={{ backgroundColor: 'rgba(90, 90, 150, 0.8)' }}
      >
        {isSaving ? 'Guardando...' : 'Siguiente: Forjar Identidades'}
        <ChevronRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  )
}
