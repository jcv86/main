'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CheckCircle2, TrendingUp, Award, Target, Lightbulb, Download } from 'lucide-react'
import { CanonRouteVisualization } from '@/components/canon-route-visualization'

export default function CycleCompletionPage() {
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [a1Results, setA1Results] = useState<any>(null)
  const [a2Route, setA2Route] = useState<any>(null)
  const [a3Progress, setA3Progress] = useState<any>(null)
  const [a4Stats, setA4Stats] = useState<any>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    loadCycleData()
  }, [])

  const loadCycleData = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        console.log('[v0] User not authenticated')
        router.push('/auth/signin')
        return
      }

      setIsAuthenticated(true)
      setUserData(user)

      // Load A1 Test Results
      const { data: a1Data } = await supabase
        .from('a1_tests_results')
        .select('*')
        .eq('user_id', user.id)
        .eq('test_name', 'Despega Cerebral')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (a1Data) {
        console.log('[v0] A1 Results loaded:', a1Data)
        setA1Results(a1Data)
      }

      // Load A2 Generated Route
      const { data: a2Data } = await supabase
        .from('canon_generated_routes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (a2Data) {
        console.log('[v0] A2 Route loaded:', a2Data)
        setA2Route(a2Data)
      }

      // Load A3 Progress
      const { data: a3Data } = await supabase
        .from('despega_a3_progress')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      if (a3Data) {
        console.log('[v0] A3 Progress loaded:', a3Data)
        setA3Progress(a3Data)
      }

      // Load A4 Stats
      const { data: a4Data } = await supabase
        .from('a4_strategic_score')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (a4Data) {
        console.log('[v0] A4 Stats loaded:', a4Data)
        setA4Stats(a4Data)
      }
    } catch (error) {
      console.error('[v0] Error loading cycle data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDiscColor = (profile: string | undefined) => {
    switch (profile?.toUpperCase()) {
      case 'D': return 'bg-red/50/20 border-red-300 text-red-800'
      case 'I': return 'bg-orange/20 border-yellow-300 text-yellow'
      case 'S': return 'bg-green/50/20 border-green-300 text-green'
      case 'C': return 'bg-blue/50/20 border-blue/30 text-blue'
      default: return 'bg-muted/50/20 border-muted/30 text-gray-800'
    }
  }

  const calculateProgress = () => {
    let completed = 0
    if (a1Results) completed++
    if (a2Route) completed++
    if (a3Progress?.sessions_completed && a3Progress.sessions_completed > 0) completed++
    if (a4Stats) completed++
    return (completed / 4) * 100
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Consolidando tu ciclo...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const profileType = a1Results?.profile_type || a1Results?.result?.dominantProfile
  const overallProgress = calculateProgress()

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/50 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-balance">Tu Ciclo Completo Despega</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Consolidación de tu viaje desde el diagnóstico hasta la ejecución. Aquí está todo lo que completaste en A1, A2, A3 y A4.
          </p>
        </div>

        {/* Overall Progress */}
        <Card className="border-2 border-purple/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Progreso General del Ciclo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">{Math.round(overallProgress)}% Completado</span>
                <span className="text-sm text-muted-foreground">{Math.floor(overallProgress / 25)}/4 Pilares</span>
              </div>
              <Progress value={overallProgress} className="h-3" />
            </div>
            <div className="grid grid-cols-4 gap-2 text-xs text-center">
              <div className={`p-2 rounded ${a1Results ? 'bg-green/50/20' : 'bg-muted/50/20'}`}>
                <div className="font-semibold">A1</div>
                <div className="text-xs">{a1Results ? 'Completo' : 'Pendiente'}</div>
              </div>
              <div className={`p-2 rounded ${a2Route ? 'bg-green/50/20' : 'bg-muted/50/20'}`}>
                <div className="font-semibold">A2</div>
                <div className="text-xs">{a2Route ? 'Completo' : 'Pendiente'}</div>
              </div>
              <div className={`p-2 rounded ${a3Progress?.sessions_completed > 0 ? 'bg-green/50/20' : 'bg-muted/50/20'}`}>
                <div className="font-semibold">A3</div>
                <div className="text-xs">{a3Progress?.sessions_completed > 0 ? `${a3Progress.sessions_completed} sesiones` : 'Comenzar'}</div>
              </div>
              <div className={`p-2 rounded ${a4Stats ? 'bg-green/50/20' : 'bg-muted/50/20'}`}>
                <div className="font-semibold">A4</div>
                <div className="text-xs">{a4Stats ? 'Activo' : 'Comenzar'}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* A1: Diagnóstico */}
        <Card className={`border-2 ${a1Results ? 'border-green-300 bg-green/50/5' : 'border-muted'}`}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                A1: Tu Diagnóstico DISC
              </span>
              {a1Results && <CheckCircle2 className="w-5 h-5 text-green" />}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {a1Results ? (
              <>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Tu Perfil Dominante</p>
                    <Badge className={`px-4 py-2 text-lg font-bold ${getDiscColor(profileType)}`}>
                      {profileType || 'N/A'}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2">
                    <div className="p-3 bg-card rounded-[28px] border">
                      <p className="text-xs text-muted-foreground mb-1">D (Dominador)</p>
                      <p className="text-2xl font-bold">{a1Results.result?.D || 0}</p>
                    </div>
                    <div className="p-3 bg-card rounded-[28px] border">
                      <p className="text-xs text-muted-foreground mb-1">I (Influyente)</p>
                      <p className="text-2xl font-bold">{a1Results.result?.I || 0}</p>
                    </div>
                    <div className="p-3 bg-card rounded-[28px] border">
                      <p className="text-xs text-muted-foreground mb-1">S (Estable)</p>
                      <p className="text-2xl font-bold">{a1Results.result?.S || 0}</p>
                    </div>
                    <div className="p-3 bg-card rounded-[28px] border">
                      <p className="text-xs text-muted-foreground mb-1">C (Cauteloso)</p>
                      <p className="text-2xl font-bold">{a1Results.result?.C || 0}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-purple/5 rounded-[28px] border">
                    <p className="text-sm text-muted-foreground mb-2">Completado el</p>
                    <p className="font-semibold">
                      {new Date(a1Results.created_at).toLocaleDateString('es-ES', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
                <Link href="/despega/a1/resultado">
                  <Button variant="outline" className="w-full">Ver Informe Completo A1</Button>
                </Link>
              </>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <p>Aún no completaste el test A1</p>
                <Link href="/despega/onboarding" className="mt-2 block">
                  <Button>Comenzar Diagnóstico</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* A2: Ruta Personalizada */}
        <Card className={`border-2 ${a2Route ? 'border-green-300 bg-green/50/5' : 'border-muted'}`}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                A2: Tu Ruta Personalizada
              </span>
              {a2Route && <CheckCircle2 className="w-5 h-5 text-green" />}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {a2Route ? (
              <>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-card rounded-[28px] border">
                      <p className="text-xs text-muted-foreground mb-1">Misiones Totales</p>
                      <p className="text-2xl font-bold">{a2Route.route_data?.steps?.length || 0}</p>
                    </div>
                    <div className="p-3 bg-card rounded-[28px] border">
                      <p className="text-xs text-muted-foreground mb-1">Período</p>
                      <p className="text-lg font-bold">90 Días</p>
                    </div>
                    <div className="p-3 bg-card rounded-[28px] border">
                      <p className="text-xs text-muted-foreground mb-1">Generada el</p>
                      <p className="text-sm font-bold">
                        {new Date(a2Route.created_at).toLocaleDateString('es-ES', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-purple/5 rounded-[28px] border">
                    <p className="text-sm text-muted-foreground mb-2">Basada en tu contexto:</p>
                    <ul className="text-sm space-y-1 text-foreground">
                      <li>✓ Perfil DISC: {profileType}</li>
                      <li>✓ Ambiente de ejecución personalizado</li>
                      <li>✓ Objetivos 30/60/90 definidos</li>
                    </ul>
                  </div>
                </div>
                <Link href="/despega/a2/dashboard">
                  <Button variant="outline" className="w-full">Ver Tu Ruta Completa</Button>
                </Link>
              </>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <p>Aún no generaste tu ruta A2</p>
                <Link href="/despega/onboarding" className="mt-2 block">
                  <Button>Completar Onboarding</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* A3: Entrenamientos */}
        <Card className={`border-2 ${a3Progress?.sessions_completed > 0 ? 'border-green-300 bg-green/50/5' : 'border-muted'}`}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                A3: Tu Aterrizaje & Entrenamientos
              </span>
              {a3Progress?.sessions_completed > 0 && <CheckCircle2 className="w-5 h-5 text-green" />}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {a3Progress?.sessions_completed > 0 ? (
              <>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-card rounded-[28px] border">
                      <p className="text-xs text-muted-foreground mb-1">Sesiones Completadas</p>
                      <p className="text-2xl font-bold">{a3Progress.sessions_completed}</p>
                    </div>
                    <div className="p-3 bg-card rounded-[28px] border">
                      <p className="text-xs text-muted-foreground mb-1">Horas Entrenadas</p>
                      <p className="text-2xl font-bold">{a3Progress.hours_trained || 0}h</p>
                    </div>
                    <div className="p-3 bg-card rounded-[28px] border">
                      <p className="text-xs text-muted-foreground mb-1">Score Empleabilidad</p>
                      <p className="text-2xl font-bold">{a3Progress.employability_score || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-purple/5 rounded-[28px] border">
                    <p className="text-sm text-muted-foreground mb-2">Tu enfoque de entrenamiento:</p>
                    <p className="text-sm font-semibold text-foreground">
                      Entrenamientos personalizados para perfil {profileType}
                    </p>
                  </div>
                </div>
                <Link href="/despega/a3">
                  <Button variant="outline" className="w-full">Continuar Entrenamientos</Button>
                </Link>
              </>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <p>Aún no comenzaste entrenamientos en A3</p>
                <Link href="/despega/a3" className="mt-2 block">
                  <Button>Comenzar Entrenamientos</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* A4: Contexto Estratégico */}
        <Card className={`border-2 ${a4Stats ? 'border-green-300 bg-green/50/5' : 'border-muted'}`}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                A4: Tu Contexto Estratégico
              </span>
              {a4Stats && <CheckCircle2 className="w-5 h-5 text-green" />}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {a4Stats ? (
              <>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-card rounded-[28px] border">
                      <p className="text-xs text-muted-foreground mb-1">Score Estratégico</p>
                      <p className="text-2xl font-bold">{a4Stats.strategic_score || 0}</p>
                    </div>
                    <div className="p-3 bg-card rounded-[28px] border">
                      <p className="text-xs text-muted-foreground mb-1">Artículos Leídos</p>
                      <p className="text-2xl font-bold">{a4Stats.articles_read || 0}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-purple/5 rounded-[28px] border">
                    <p className="text-sm text-muted-foreground mb-2">Contexto personalizado para ti:</p>
                    <ul className="text-sm space-y-1 text-foreground">
                      <li>✓ Noticias del mercado filtradas por tu perfil</li>
                      <li>✓ Tendencias en tu industria</li>
                      <li>✓ Recursos curados según tus intereses</li>
                    </ul>
                  </div>
                </div>
                <Link href="/despega/a4">
                  <Button variant="outline" className="w-full">Ir a A4: Contexto Estratégico</Button>
                </Link>
              </>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <p>Aún no accediste a A4</p>
                <Link href="/despega/a4" className="mt-2 block">
                  <Button>Explorar Contexto Estratégico</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Export & Summary */}
        <Card className="border-2 border-purple/20 bg-purple/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Exportar Tu Reporte Completo
            </CardTitle>
            <CardDescription>
              Descarga un PDF con tu información completa del ciclo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Descargar Reporte PDF
              </Button>
              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Compartir Ciclo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
