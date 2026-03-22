import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, Lightbulb, X, Loader2 } from 'lucide-react'

interface AIAssistantProps {
  question: string
  currentResponse: string
  onUseSuggestion?: (suggestion: string) => void
}

export function AIAssistant({ question, currentResponse, onUseSuggestion }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [suggestion, setSuggestion] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGetSuggestion = async () => {
    setLoading(true)
    setError('')
    setSuggestion(null)

    try {
      const response = await fetch('/api/conozcamonos/ai-suggestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          currentResponse: currentResponse || ''
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al generar sugerencia')
      }

      setSuggestion(data.suggestion)
      console.log('[v0] AI suggestion received')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar sugerencia')
      console.error('[v0] Suggestion error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="gap-2 text-blue-600 border-blue-200 hover:border-blue-300 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-950"
      >
        <Lightbulb className="w-4 h-4" />
        Asistencia IA
      </Button>
    )
  }

  return (
    <div className="space-y-3 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-2">
          <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-blue-900 dark:text-blue-100">Asistencia IA</p>
            <p className="text-sm text-blue-800 dark:text-blue-200 mt-0.5">
              {suggestion ? 'Aquí está mi sugerencia:' : 'Obtén ayuda para responder esta pregunta'}
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setIsOpen(false)
            setSuggestion(null)
            setError('')
          }}
          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {error && (
        <div className="flex gap-2 p-2 bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200 rounded text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {loading && (
        <div className="flex gap-2 items-center text-blue-700 dark:text-blue-300">
          <Loader2 className="w-4 h-4 animate-spin" />
          <p className="text-sm">Generando sugerencia...</p>
        </div>
      )}

      {suggestion && (
        <div className="space-y-3">
          <div className="p-3 bg-white dark:bg-slate-900 rounded border border-blue-100 dark:border-blue-800">
            <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
              {suggestion}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleGetSuggestion}
              variant="outline"
              size="sm"
              className="flex-1 text-blue-600 border-blue-200"
            >
              Otra sugerencia
            </Button>
            {onUseSuggestion && (
              <Button
                onClick={() => {
                  onUseSuggestion(suggestion)
                  setIsOpen(false)
                }}
                size="sm"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Usar como base
              </Button>
            )}
          </div>
        </div>
      )}

      {!suggestion && !loading && !error && (
        <Button
          onClick={handleGetSuggestion}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          Obtener Sugerencia
        </Button>
      )}
    </div>
  )
}
