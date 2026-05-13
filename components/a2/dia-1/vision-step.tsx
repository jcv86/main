'use client'

import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

interface Dia1VisionStepProps {
  answers: {
    role: string
    environment: string
    result: string
  }
  onUpdate: (answers: any) => void
  onNext: () => void
}

export default function Dia1VisionStep({ answers, onUpdate, onNext }: Dia1VisionStepProps) {
  const isValid = answers.role.length > 5 && answers.environment.length > 5 && answers.result.length > 5

  const isWeakAnswer = (text: string) => {
    const weak = ['no sé', 'algo mejor', 'cualquier cosa', 'ganar más']
    return weak.some(w => text.toLowerCase().includes(w))
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2 text-foreground">Paso 1: Escribe tu visión</h2>
        <p className="text-sm text-muted-foreground mb-2">
          Responde estas 3 preguntas de forma simple. No busques perfección todavía. El coach te ayudará a mejorar después.
        </p>
        <div className="text-xs font-medium text-muted-foreground">⏱️ Tiempo estimado: 10 min</div>
      </div>

      <div className="space-y-6">
        {/* Question 1 */}
        <div className="space-y-2">
          <label className="block font-semibold text-foreground">
            1. ¿Qué rol profesional quieres conseguir o construir en los próximos 3 años?
          </label>
          <p className="text-xs text-muted-foreground mb-2">
            Ejemplo: Coordinador de operaciones, Project Manager, Analista de datos, Jefe comercial, Diseñador UX, Desarrollador, etc.
          </p>
          <textarea
            value={answers.role}
            onChange={(e) => onUpdate({ ...answers, role: e.target.value })}
            placeholder="Escribe tu respuesta aquí..."
            className="w-full h-24 p-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {answers.role && isWeakAnswer(answers.role) && (
            <div className="flex gap-2 text-xs text-amber-600 dark:text-amber-400">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>Tu respuesta es demasiado general. Intenta agregar un rol específico.</span>
            </div>
          )}
        </div>

        {/* Question 2 */}
        <div className="space-y-2">
          <label className="block font-semibold text-foreground">
            2. ¿En qué tipo de empresa o entorno te gustaría trabajar?
          </label>
          <p className="text-xs text-muted-foreground mb-2">
            Ejemplo: empresa tecnológica, empresa internacional, startup, empresa estable, trabajo remoto, sector público, educación, minería, salud, retail, etc.
          </p>
          <textarea
            value={answers.environment}
            onChange={(e) => onUpdate({ ...answers, environment: e.target.value })}
            placeholder="Escribe tu respuesta aquí..."
            className="w-full h-24 p-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {answers.environment && isWeakAnswer(answers.environment) && (
            <div className="flex gap-2 text-xs text-amber-600 dark:text-amber-400">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>Tu respuesta es demasiado general. Intenta ser más específico.</span>
            </div>
          )}
        </div>

        {/* Question 3 */}
        <div className="space-y-2">
          <label className="block font-semibold text-foreground">
            3. ¿Qué resultado concreto quieres lograr con tu carrera?
          </label>
          <p className="text-xs text-muted-foreground mb-2">
            Ejemplo: mejor salario, más estabilidad, cambiar de industria, crecer a liderazgo, conseguir mi primer trabajo, trabajar remoto, mejorar confianza, etc.
          </p>
          <textarea
            value={answers.result}
            onChange={(e) => onUpdate({ ...answers, result: e.target.value })}
            placeholder="Escribe tu respuesta aquí..."
            className="w-full h-24 p-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {answers.result && isWeakAnswer(answers.result) && (
            <div className="flex gap-2 text-xs text-amber-600 dark:text-amber-400">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>Tu respuesta es demasiado general. Intenta agregar un objetivo concreto.</span>
            </div>
          )}
        </div>
      </div>

      {/* Validation Summary */}
      <div className="p-4 bg-muted/50 rounded-lg border border-border">
        <h3 className="font-semibold text-sm mb-2 text-foreground">Resumen de respuestas</h3>
        <div className="space-y-1 text-sm">
          <div className="flex items-start gap-2">
            <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold ${answers.role ? 'bg-green-600' : 'bg-muted-foreground'}`}>
              {answers.role ? '✓' : '1'}
            </span>
            <span className="text-muted-foreground">Rol profesional: {answers.role ? 'completado' : 'pendiente'}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold ${answers.environment ? 'bg-green-600' : 'bg-muted-foreground'}`}>
              {answers.environment ? '✓' : '2'}
            </span>
            <span className="text-muted-foreground">Entorno de trabajo: {answers.environment ? 'completado' : 'pendiente'}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold ${answers.result ? 'bg-green-600' : 'bg-muted-foreground'}`}>
              {answers.result ? '✓' : '3'}
            </span>
            <span className="text-muted-foreground">Resultado concreto: {answers.result ? 'completado' : 'pendiente'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
