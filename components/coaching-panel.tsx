import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Zap, AlertCircle } from 'lucide-react'
import { useCoaching } from '@/lib/hooks/use-coaching'

interface CoachingPanelProps {
  question: string
  interviewType: 'behavioral' | 'technical' | 'situational'
  roleContext?: string
  onFeedbackReceived?: (feedback: string) => void
}

export function CoachingPanel({
  question,
  interviewType,
  roleContext,
  onFeedbackReceived
}: CoachingPanelProps) {
  const [userResponse, setUserResponse] = useState('')
  const { generateFeedback, feedback, loading, error } = useCoaching()

  const handleGenerateFeedback = async () => {
    if (!userResponse.trim()) {
      alert('Por favor escribe tu respuesta primero')
      return
    }

    const result = await generateFeedback({
      question,
      userResponse,
      interviewType,
      roleContext
    })

    if (result.success && onFeedbackReceived) {
      onFeedbackReceived(result.feedback)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" />
          <div>
            <CardTitle>Coach de Entrevista IA</CardTitle>
            <CardDescription>Obtén feedback personalizado al instante</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Question Display */}
        <div className="bg-slate-50 p-4 rounded-lg">
          <p className="text-sm font-semibold text-slate-700 mb-2">Pregunta:</p>
          <p className="text-slate-900">{question}</p>
          <Badge variant="outline" className="mt-2">
            {interviewType === 'behavioral' && 'Conductual'}
            {interviewType === 'technical' && 'Técnica'}
            {interviewType === 'situational' && 'Situacional'}
          </Badge>
        </div>

        {/* User Response Input */}
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-2 block">
            Tu Respuesta
          </label>
          <Textarea
            placeholder="Escribe tu respuesta a la pregunta de entrevista..."
            value={userResponse}
            onChange={(e) => setUserResponse(e.target.value)}
            className="min-h-32"
            disabled={loading}
          />
          <p className="text-xs text-slate-500 mt-1">{userResponse.length}/500 caracteres</p>
        </div>

        {/* Generate Feedback Button */}
        <Button
          onClick={handleGenerateFeedback}
          disabled={loading || !userResponse.trim()}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analizando respuesta...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Obtener Feedback IA
            </>
          )}
        </Button>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-900">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Feedback Display */}
        {feedback && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
            <p className="font-semibold text-blue-900 mb-3">Feedback del Coach IA</p>
            <div className="bg-white rounded p-3 text-slate-700 whitespace-pre-wrap text-sm leading-relaxed">
              {feedback}
            </div>
            <Button
              onClick={() => {
                setUserResponse('')
                setUserResponse('')
              }}
              variant="outline"
              size="sm"
              className="mt-3"
            >
              Probar otra respuesta
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
