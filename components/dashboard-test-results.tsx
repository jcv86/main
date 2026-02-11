'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle2, BookOpen } from 'lucide-react'

interface TestResult {
  d_score: number
  i_score: number
  s_score: number
  c_score: number
  dominant_profile: string
  secondary_profile: string
  camino_persona?: boolean
  camino_profesional?: boolean
}

const PROFILE_INFO = {
  D: { name: 'Impulsor', color: 'bg-red-100 text-red-800', icon: '⚡' },
  I: { name: 'Catalizador', color: 'bg-amber-100 text-amber-800', icon: '🔥' },
  S: { name: 'Estabilizador', color: 'bg-green-100 text-green-800', icon: '🌳' },
  C: { name: 'Arquitecto', color: 'bg-blue-100 text-blue-800', icon: '🧩' },
}

const RECOMMENDED_BOOKS = {
  D: ['Start with Why', 'The 4-Hour Work Week'],
  I: ['How to Win Friends and Influence People', 'Contagious'],
  S: ['The Power of Now', 'Radical Candor'],
  C: ['Thinking, Fast and Slow', 'The Systems Bible'],
}

export function DashboardTestResults() {
  const [testResults, setTestResults] = useState<TestResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchTestResults = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user?.email) {
          setError('No user found')
          setLoading(false)
          return
        }

        // Get latest test result
        const { data, error: fetchError } = await supabase
          .from('unified_test_results')
          .select('test_results')
          .eq('user_email', user.email)
          .eq('test_type', 'personality_assessment')
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (fetchError) {
          console.error('[v0] Error fetching test results:', fetchError)
          setLoading(false)
          return
        }

        if (data?.test_results) {
          setTestResults(data.test_results)
        }
        setLoading(false)
      } catch (err) {
        console.error('[v0] Unexpected error:', err)
        setError('Error loading test results')
        setLoading(false)
      }
    }

    fetchTestResults()
  }, [supabase])

  if (loading) {
    return (
      <Card className="border border-border">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Cargando resultados...</span>
        </CardContent>
      </Card>
    )
  }

  if (!testResults) {
    return (
      <Alert className="bg-blue-50 border-blue-200">
        <AlertDescription className="text-blue-800">
          Completa tu evaluación de personalidad para descubrir tu perfil y obtener recomendaciones personalizadas.
        </AlertDescription>
      </Alert>
    )
  }

  const dominantInfo = PROFILE_INFO[testResults.dominant_profile as keyof typeof PROFILE_INFO]
  const bookRecommendations = RECOMMENDED_BOOKS[testResults.dominant_profile as keyof typeof RECOMMENDED_BOOKS] || []

  return (
    <div className="space-y-6">
      {/* Perfil Dominante */}
      <Card className="border-2 border-primary">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">{dominantInfo.icon}</span>
            Tu Perfil: {dominantInfo.name}
          </CardTitle>
          <CardDescription>
            Perfil secundario: {PROFILE_INFO[testResults.secondary_profile as keyof typeof PROFILE_INFO].name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {(['D', 'I', 'S', 'C'] as const).map((dim) => (
              <div key={dim} className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {testResults[`${dim.toLowerCase()}_score`]}%
                </div>
                <div className="text-sm text-muted-foreground mt-1">{PROFILE_INFO[dim].name}</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className={`h-2 rounded-full ${dim === testResults.dominant_profile ? 'bg-primary' : 'bg-muted'}`}
                    style={{ width: `${testResults[`${dim.toLowerCase()}_score`]}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Libros Recomendados */}
      {bookRecommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Libros Recomendados Para Ti
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookRecommendations.map((book) => (
                <div key={book} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <BookOpen className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-sm">{book}</p>
                      <p className="text-xs text-muted-foreground mt-1">Seleccionado para tu perfil</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Caminos Activos */}
      {(testResults.camino_persona || testResults.camino_profesional) && (
        <Card>
          <CardHeader>
            <CardTitle>Tu Foco</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {testResults.camino_persona && (
                <Badge className="bg-purple-100 text-purple-800">📚 Camino Personal</Badge>
              )}
              {testResults.camino_profesional && (
                <Badge className="bg-blue-100 text-blue-800">💼 Camino Profesional</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
