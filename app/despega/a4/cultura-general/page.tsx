'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useCoach } from '@/contexts/coach-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { ArrowLeft, Brain, Lightbulb, Trophy, BookOpen, Zap } from 'lucide-react'

const CULTURE_CATEGORIES = [
  { id: 'economia', name: 'Economía Global', icon: '📊', description: 'Conceptos macroeconómicos y mercados' },
  { id: 'tech', name: 'Tecnología & IA', icon: '🤖', description: 'Disrupciones digitales y tendencias tech' },
  { id: 'negocios', name: 'Negocios', icon: '💼', description: 'Estrategia empresarial y emprendimiento' },
  { id: 'sociedad', name: 'Sociedad', icon: '🌍', description: 'Cambios sociales y tendencias culturales' },
  { id: 'liderazgo', name: 'Liderazgo', icon: '👥', description: 'Management y desarrollo de personas' },
  { id: 'futuro', name: 'Futuro del Trabajo', icon: '🚀', description: 'Cambios laborales y upskilling' },
]

export default function CulturaGeneralPage() {
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('economia')
  const [tests, setTests] = useState<any[]>([])
  const [completedTests, setCompletedTests] = useState<Set<string>>(new Set())
  const [userStats, setUserStats] = useState({
    totalPoints: 0,
    testsCompleted: 0,
    averageScore: 0,
  })
  const { updateProgress } = useCoach()
  const supabase = createClient()

  useEffect(() => {
    loadCultureTests()
    loadUserStats()
  }, [selectedCategory])

  const loadCultureTests = async () => {
    try {
      setLoading(true)
      console.log('[v0] Loading culture tests for category:', selectedCategory)

      // Load tests from database
      const { data: testsData, error } = await supabase
        .from('a4_gamified_tests')
        .select('*')
        .eq('category', selectedCategory)
        .eq('type', 'culture')
        .order('difficulty', { ascending: true })

      if (error) throw error

      console.log('[v0] Loaded tests:', testsData?.length || 0)
      setTests(testsData || [])

      // Load completed tests for this user
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: completed } = await supabase
          .from('a4_user_test_completions')
          .select('test_id')
          .eq('user_id', user.id)
          .eq('category', selectedCategory)

        if (completed) {
          setCompletedTests(new Set(completed.map(c => c.test_id)))
        }
      }
    } catch (error) {
      console.error('[v0] Error loading tests:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadUserStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: stats } = await supabase
        .from('a4_user_test_completions')
        .select('points, score')
        .eq('user_id', user.id)

      if (stats && stats.length > 0) {
        const totalPoints = stats.reduce((sum, s) => sum + (s.points || 0), 0)
        const averageScore = stats.reduce((sum, s) => sum + (s.score || 0), 0) / stats.length

        setUserStats({
          totalPoints,
          testsCompleted: stats.length,
          averageScore: Math.round(averageScore),
        })
      }
    } catch (error) {
      console.error('[v0] Error loading stats:', error)
    }
  }

  const completeTest = async (testId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Simulate test completion with random score
      const score = Math.floor(Math.random() * 30) + 70 // 70-100
      const points = score > 80 ? 20 : score > 70 ? 15 : 10

      // Record completion
      await supabase
        .from('a4_user_test_completions')
        .insert({
          user_id: user.id,
          test_id: testId,
          category: selectedCategory,
          score,
          points,
          completed_at: new Date().toISOString(),
        })

      console.log('[v0] Test completed with score:', score, 'points:', points)

      // Update local state
      setCompletedTests(prev => new Set([...prev, testId]))
      
      // Update user stats
      setUserStats(prev => ({
        ...prev,
        totalPoints: prev.totalPoints + points,
        testsCompleted: prev.testsCompleted + 1,
      }))

      // Trigger coach update
      await updateProgress()

      // Show success message
      alert(`¡Excelente! Ganaste ${points} puntos. Score: ${score}%`)
    } catch (error) {
      console.error('[v0] Error completing test:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-5xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <Link href="/despega/a4">
            <Button variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a A4
            </Button>
          </Link>

          <div className="flex items-start gap-4">
            <div className="p-4 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-lg">
              <Brain className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Cultura General Profesional</h1>
              <p className="text-muted-foreground">Expande tu contexto sobre mercado, negocios y futuro del trabajo</p>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Puntos Acumulados</p>
                  <div className="text-3xl font-bold">{userStats.totalPoints}</div>
                </div>
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tests Completados</p>
                  <div className="text-3xl font-bold">{userStats.testsCompleted}</div>
                </div>
                <Trophy className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Score Promedio</p>
                  <div className="text-3xl font-bold">{userStats.averageScore}%</div>
                </div>
                <Lightbulb className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Selection */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Elige tu Tema</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CULTURE_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedCategory === cat.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'
                }`}
              >
                <div className="text-3xl mb-2">{cat.icon}</div>
                <div className="font-semibold">{cat.name}</div>
                <div className="text-sm text-muted-foreground">{cat.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Tests */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Tests Disponibles</h2>

          {loading ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">Cargando tests...</p>
              </CardContent>
            </Card>
          ) : tests.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No hay tests disponibles en esta categoría</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {tests.map(test => {
                const isCompleted = completedTests.has(test.id)
                return (
                  <Card key={test.id} className="hover:shadow-lg transition">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5" />
                            {test.title}
                          </CardTitle>
                          <CardDescription>{test.description}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant={test.difficulty === 'hard' ? 'destructive' : test.difficulty === 'medium' ? 'default' : 'secondary'}>
                            {test.difficulty === 'hard' ? 'Avanzado' : test.difficulty === 'medium' ? 'Intermedio' : 'Básico'}
                          </Badge>
                          {isCompleted && (
                            <Badge className="bg-green-600">✓ Completado</Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm">{test.full_content || 'Responde 5 preguntas sobre este tema'}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground mb-1">Puntos posibles: {test.points || 20}</p>
                          <Progress value={0} className="h-1" />
                        </div>
                        <Button
                          onClick={() => completeTest(test.id)}
                          disabled={isCompleted}
                          className={isCompleted ? 'opacity-50' : ''}
                        >
                          {isCompleted ? 'Completado' : 'Responder Test'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* Tips */}
        <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <Lightbulb className="w-4 h-4 text-blue-600" />
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            <strong>Consejo:</strong> Estos tests no son para evaluar qué sabes, sino para expandir tu contexto. Cada respuesta correcta te acerca más a entender el mundo donde vivirá tu nueva identidad.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
