import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, Lightbulb, X, Loader2 } from 'lucide-react'

interface AIAssistantProps {
  question: string
  currentResponse: string
  onUseSuggestion?: (suggestion: string) => void
  buttonLabel?: string
  title?: string
  pillarColor?: string
}

export function AIAssistant({ 
  question, 
  currentResponse, 
  onUseSuggestion,
  buttonLabel = 'Asistencia Tu Coach',
  title = 'Tu Coach IA',
  pillarColor = 'rgba(80, 160, 170, 0.6)'
}: AIAssistantProps) {
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
        className="gap-2"
        style={{
          backgroundColor: pillarColor,
          color: 'rgba(255, 255, 255, 0.92)',
          border: 'none',
          borderRadius: '20px'
        }}
      >
        <Lightbulb className="w-4 h-4" />
        {buttonLabel}
      </Button>
    )
  }

  return (
    <div 
      className="space-y-3 p-4"
      style={{
        backgroundColor: `${pillarColor.replace('0.6', '0.2')}`,
        border: `1px solid ${pillarColor}`,
        borderRadius: '2px'
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-2">
          <Lightbulb className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'rgba(255, 255, 255, 0.40)' }} />
          <div>
            <p className="font-semibold" style={{ color: 'rgba(255, 255, 255, 0.50)' }}>{title}</p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(200, 200, 200)' }}>
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
          className="p-1 rounded"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.60)',
            color: '#ffffff',
            border: '1px solid #ffffff'
          }}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {error && (
        <div className="flex gap-2 p-2 bg-red/10 dark:bg-red text-red dark:text-red/20 rounded text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {loading && (
        <div className="flex gap-2 items-center text-blue dark:text-blue-200">
          <Loader2 className="w-4 h-4 animate-spin" />
          <p className="text-sm">Generando sugerencia...</p>
        </div>
      )}

      {suggestion && (
        <div className="space-y-3">
          <div 
            className="p-3 rounded"
            style={{
              backgroundColor: 'rgba(80, 160, 170, 0)',
              border: 'none'
            }}
          >
            <p className="text-sm text-muted-foreground dark:text-white/85 whitespace-pre-wrap">
              {suggestion}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleGetSuggestion}
              variant="outline"
              size="sm"
              className="flex-1"
              style={{
                borderRadius: '20px'
              }}
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
                className="flex-1 text-white"
                style={{
                  backgroundColor: `${pillarColor.replace('0.6', '0.4')}`,
                  borderRadius: '20px'
                }}
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
          className="w-full text-white"
          style={{
            backgroundColor: `${pillarColor.replace('0.6', '0.4')}`,
            borderRadius: '20px'
          }}
        >
          Obtener Sugerencia
        </Button>
      )}
    </div>
  )
}
