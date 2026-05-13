'use client'

import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { useState } from 'react'

interface Dia1ActionsStepProps {
  actions: {
    clarity: string[]
    material: string[]
    interview: string[]
    realAction: string[]
  }
  milestones: any
  onUpdate: (actions: any) => void
  onNext: () => void
  onPrevious: () => void
}

const categoryExamples = {
  clarity: ['Revisar mi diagnóstico', 'Definir mi perfil profesional', 'Identificar mis fortalezas', 'Reconocer mis bloqueos'],
  material: ['Mejorar mi CV', 'Identificar logros', 'Crear una versión base de mi presentación profesional', 'Organizar mi experiencia'],
  interview: ['Crear respuestas básicas', 'Practicar presentación personal', 'Preparar preguntas difíciles', 'Mejorar claridad al hablar'],
  realAction: ['Buscar vacantes', 'Guardar oportunidades', 'Crear tracker', 'Enviar primeras postulaciones', 'Hacer seguimiento'],
}

export default function Dia1ActionsStep({
  actions,
  milestones,
  onUpdate,
  onNext,
  onPrevious,
}: Dia1ActionsStepProps) {
  const [inputs, setInputs] = useState({
    clarity: '',
    material: '',
    interview: '',
    realAction: '',
  })

  const addAction = (category: keyof typeof actions) => {
    const text = inputs[category].trim()
    if (text) {
      const updated = { ...actions }
      updated[category] = [...updated[category], text]
      onUpdate(updated)
      setInputs({ ...inputs, [category]: '' })
    }
  }

  const removeAction = (category: keyof typeof actions, index: number) => {
    const updated = { ...actions }
    updated[category] = updated[category].filter((_, i) => i !== index)
    onUpdate(updated)
  }

  const isComplete = actions.clarity.length > 0 && actions.material.length > 0 && actions.interview.length > 0 && actions.realAction.length > 0

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2 text-foreground">Paso 4: Crea tu plan de acciones</h2>
        <p className="text-sm text-muted-foreground mb-2">
          Convierte tu visión y tus hitos en un plan simple de acciones para los primeros 30 días.
        </p>
        <div className="text-xs font-medium text-muted-foreground">⏱️ Tiempo estimado: 20 min</div>
      </div>

      <div className="space-y-6">
        {/* Clarity Actions */}
        <ActionCategory
          title="1. Claridad"
          description="Acciones para entender tu perfil, dirección y bloqueos"
          category="clarity"
          actions={actions.clarity}
          input={inputs.clarity}
          examples={categoryExamples.clarity}
          onInputChange={(text) => setInputs({ ...inputs, clarity: text })}
          onAdd={() => addAction('clarity')}
          onRemove={(idx) => removeAction('clarity', idx)}
        />

        {/* Material Actions */}
        <ActionCategory
          title="2. Material profesional"
          description="Acciones para mejorar tu CV y presentación"
          category="material"
          actions={actions.material}
          input={inputs.material}
          examples={categoryExamples.material}
          onInputChange={(text) => setInputs({ ...inputs, material: text })}
          onAdd={() => addAction('material')}
          onRemove={(idx) => removeAction('material', idx)}
        />

        {/* Interview Actions */}
        <ActionCategory
          title="3. Preparación de entrevista"
          description="Acciones para crear y practicar respuestas"
          category="interview"
          actions={actions.interview}
          input={inputs.interview}
          examples={categoryExamples.interview}
          onInputChange={(text) => setInputs({ ...inputs, interview: text })}
          onAdd={() => addAction('interview')}
          onRemove={(idx) => removeAction('interview', idx)}
        />

        {/* Real Action */}
        <ActionCategory
          title="4. Acción real"
          description="Acciones en el mercado laboral: búsqueda, postulación, seguimiento"
          category="realAction"
          actions={actions.realAction}
          input={inputs.realAction}
          examples={categoryExamples.realAction}
          onInputChange={(text) => setInputs({ ...inputs, realAction: text })}
          onAdd={() => addAction('realAction')}
          onRemove={(idx) => removeAction('realAction', idx)}
        />
      </div>

      {/* Summary */}
      <div className="p-4 bg-muted/50 rounded-lg border border-border">
        <h3 className="font-semibold text-sm mb-3 text-foreground">Estado del plan</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Acciones de claridad:</span>
            <span className="font-medium text-foreground">{actions.clarity.length} {actions.clarity.length > 0 ? '✓' : ''}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Material profesional:</span>
            <span className="font-medium text-foreground">{actions.material.length} {actions.material.length > 0 ? '✓' : ''}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Preparación de entrevista:</span>
            <span className="font-medium text-foreground">{actions.interview.length} {actions.interview.length > 0 ? '✓' : ''}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Acción real:</span>
            <span className="font-medium text-foreground">{actions.realAction.length} {actions.realAction.length > 0 ? '✓' : ''}</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 pt-4 border-t border-border">
        <Button
          variant="outline"
          onClick={onPrevious}
          className="flex-1"
        >
          Anterior
        </Button>
        <Button
          onClick={onNext}
          disabled={!isComplete}
          className="flex-1"
        >
          Siguiente
        </Button>
      </div>
    </div>
  )
}

interface ActionCategoryProps {
  title: string
  description: string
  category: string
  actions: string[]
  input: string
  examples: string[]
  onInputChange: (text: string) => void
  onAdd: () => void
  onRemove: (index: number) => void
}

function ActionCategory({
  title,
  description,
  actions,
  input,
  examples,
  onInputChange,
  onAdd,
  onRemove,
}: ActionCategoryProps) {
  return (
    <div className="space-y-3 p-4 bg-muted/30 rounded-lg border border-border">
      <div>
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>

      <div className="text-xs text-muted-foreground p-2 bg-background rounded border border-border">
        <span className="font-medium block mb-1">Ejemplos:</span>
        {examples.map((ex, idx) => (
          <div key={idx} className="text-muted-foreground">• {ex}</div>
        ))}
      </div>

      {/* Current Actions */}
      {actions.length > 0 && (
        <div className="space-y-2">
          {actions.map((action, idx) => (
            <div key={idx} className="flex items-start justify-between gap-2 p-2 bg-background rounded border border-border">
              <span className="text-sm text-foreground flex-1">{action}</span>
              <button
                onClick={() => onRemove(idx)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              onAdd()
            }
          }}
          placeholder="Agrega una acción..."
          className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <Button
          onClick={onAdd}
          disabled={!input.trim()}
          variant="outline"
          size="sm"
        >
          Agregar
        </Button>
      </div>
    </div>
  )
}
