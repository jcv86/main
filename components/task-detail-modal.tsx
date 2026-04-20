'use client'

import { useState } from 'react'
import { X, ExternalLink, BookOpen, CheckCircle, Lightbulb, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { TaskDetail } from '@/lib/task-details'

interface TaskDetailModalProps {
  task: TaskDetail
  isOpen: boolean
  onClose: () => void
}

export function TaskDetailModal({ task, isOpen, onClose }: TaskDetailModalProps) {
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set([0]))

  if (!isOpen) return null

  const toggleStep = (stepNumber: number) => {
    const newExpanded = new Set(expandedSteps)
    if (newExpanded.has(stepNumber)) {
      newExpanded.delete(stepNumber)
    } else {
      newExpanded.add(stepNumber)
    }
    setExpandedSteps(newExpanded)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <Card className="bg-card border border-border w-full max-w-3xl max-h-[95vh] overflow-hidden flex flex-col rounded-2xl">
        {/* Header with gradient */}
        <div className="sticky top-0 bg-gradient-to-r from-exploration/20 to-training/20 border-b border-border px-8 py-6 flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-exploration/20 text-exploration rounded-full text-xs font-semibold">
                Día {task.day}
              </span>
            </div>
            <h2 className="text-3xl font-bold text-foreground">{task.title}</h2>
            <p className="text-sm text-muted-foreground mt-2">{task.objective}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted/20 rounded-lg transition text-muted-foreground hover:text-foreground"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 px-8 py-6 space-y-8 pb-8">
          {/* Full Description */}
          <div className="bg-muted/5 border border-border rounded-xl p-4">
            <p className="text-sm text-muted-foreground leading-relaxed">{task.fullDescription}</p>
          </div>

          {/* Steps */}
          <div>
            <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-exploration" />
              Pasos a Seguir
            </h3>
            <div className="space-y-3">
              {task.steps.map((step) => (
                <div key={step.stepNumber}>
                  <button
                    onClick={() => toggleStep(step.stepNumber)}
                    className="w-full p-4 bg-muted/5 hover:bg-muted/10 border border-border rounded-lg transition flex items-start gap-4 text-left"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-exploration/20 text-exploration rounded-full flex items-center justify-center font-semibold text-sm">
                      {step.stepNumber}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground">{step.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{step.duration}</p>
                    </div>
                    <span className="flex-shrink-0 text-muted-foreground">
                      {expandedSteps.has(step.stepNumber) ? '▲' : '▼'}
                    </span>
                  </button>

                  {expandedSteps.has(step.stepNumber) && (
                    <div className="mt-2 ml-12 pl-4 border-l-2 border-exploration/30 space-y-3">
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                      {step.tips && step.tips.length > 0 && (
                        <div className="bg-training/5 border border-training/20 rounded-lg p-3 space-y-2">
                          <p className="text-xs font-semibold text-training flex items-center gap-2">
                            <Lightbulb className="w-4 h-4" />
                            Tips
                          </p>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {step.tips.map((tip, i) => (
                              <li key={i} className="flex gap-2">
                                <span className="text-training">•</span>
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {step.example && (
                        <div className="bg-exploration/5 border border-exploration/20 rounded-lg p-3">
                          <p className="text-xs font-semibold text-exploration mb-2">Ejemplo:</p>
                          <p className="text-xs text-muted-foreground italic">{step.example}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-training" />
              Recursos Recomendados
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {task.resources.map((resource, idx) => (
                <a
                  key={idx}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-4 bg-muted/5 hover:bg-muted/10 border border-border rounded-lg hover:border-training/50 transition"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="px-2 py-1 bg-training/20 text-training rounded text-xs font-semibold capitalize">
                      {resource.type}
                    </span>
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-training transition" />
                  </div>
                  <p className="font-semibold text-foreground group-hover:text-training transition line-clamp-2">
                    {resource.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">{resource.description}</p>
                  {resource.duration && (
                    <p className="text-xs text-exploration mt-2 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {resource.duration}
                    </p>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Expected Output */}
          {task.expectedOutput && (
            <div className="bg-exploration/5 border border-exploration/30 rounded-xl p-4">
              <p className="text-sm font-semibold text-exploration flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4" />
                Output Esperado
              </p>
              <p className="text-sm text-muted-foreground">{task.expectedOutput}</p>
            </div>
          )}

          {/* Success Criteria */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-ritual" />
              Criterios de Éxito
            </h3>
            <div className="space-y-2">
              {task.successCriteria.map((criterion, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 bg-ritual/5 border border-ritual/20 rounded-lg"
                >
                  <span className="text-ritual font-bold text-lg">✓</span>
                  <span className="text-sm text-muted-foreground">{criterion}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer - Action buttons */}
        <div className="sticky bottom-0 bg-card border-t border-border px-8 py-4 flex justify-end gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="border-border hover:bg-muted/10"
          >
            Cerrar
          </Button>
          <Button className="bg-exploration hover:bg-exploration/90">
            Empezar Ahora
          </Button>
        </div>
      </Card>
    </div>
  )
}
