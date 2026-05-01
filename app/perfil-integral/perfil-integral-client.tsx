"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Brain, Heart, Users, Target, Zap, TrendingUp, AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface TestResult {
  id: number
  test_type: string
  test_name: string
  results: any
  completed_at: string
  score?: number
}

export function PerfilIntegralClient() {
  const router = useRouter()
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [userEmail, setUserEmail] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )

    async function fetchData() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth")
        return
      }

      setUserEmail(user.email || "")

      const { data: results } = await supabase
        .from("test_results")
        .select("*")
        .eq("user_email", user.email)
        .order("completed_at", { ascending: false })

      setTestResults(results || [])
      setLoading(false)
    }

    fetchData()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando tu perfil integral...</p>
        </div>
      </div>
    )
  }

  const discResult = testResults.find((t) => t.test_type === "disc" || t.test_name?.includes("DISC"))
  const mbtiResult = testResults.find((t) => t.test_type === "mbti" || t.test_name?.includes("MBTI"))
  const bigFiveResult = testResults.find((t) => t.test_type === "big-five" || t.test_name?.includes("Big Five"))
  const ieResult = testResults.find(
    (t) => t.test_type === "emotional-intelligence" || t.test_name?.includes("Inteligencia Emocional"),
  )
  const riasecResult = testResults.find((t) => t.test_type === "riasec" || t.test_name?.includes("RIASEC"))
  const softSkillsResult = testResults.find(
    (t) => t.test_type === "soft-skills" || t.test_name?.includes("Soft Skills"),
  )

  const testsCompleted = [discResult, mbtiResult, bigFiveResult, ieResult, riasecResult, softSkillsResult].filter(
    Boolean,
  ).length
  const completionPercentage = (testsCompleted / 6) * 100

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Tu Perfil Integral DTC</h1>
        <p className="text-muted-foreground text-lg">
          Una visión completa de quién eres: cómo piensas, sientes, actúas y te relacionas con el mundo
        </p>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Perfil completado</span>
            <span className="text-sm font-medium">{testsCompleted}/6 tests</span>
          </div>
          <Progress value={completionPercentage} className="h-3" />
        </div>
      </div>

      {testsCompleted === 0 && (
        <Card className="border-yellow/20 bg-yellow/5 mb-8">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow mt-0.5" />
              <div>
                <p className="font-medium text-amber-900 mb-1">Aún no tienes tests completados</p>
                <p className="text-sm text-yellow">
                  Completa al menos un test para empezar a construir tu perfil integral. Te recomendamos empezar con
                  DISC o Inteligencia Emocional.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="vision-general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 lg:w-auto">
          <TabsTrigger value="vision-general">Visión General</TabsTrigger>
          <TabsTrigger value="como-piensas">Cómo Piensas</TabsTrigger>
          <TabsTrigger value="como-sientes">Cómo Sientes</TabsTrigger>
          <TabsTrigger value="como-actuas">Cómo Actúas</TabsTrigger>
          <TabsTrigger value="que-te-motiva">Qué te Motiva</TabsTrigger>
          <TabsTrigger value="como-te-relacionas">Cómo te Relacionas</TabsTrigger>
        </TabsList>

        {/* Visión General */}
        <TabsContent value="vision-general" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* DISC Card */}
            <Card className={!discResult ? "opacity-50" : ""}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Zap className="h-8 w-8 text-blue" />
                  {discResult && <Badge variant="secondary">Completado</Badge>}
                </div>
                <CardTitle>DISC</CardTitle>
                <CardDescription>Cómo actúas y comunicas</CardDescription>
              </CardHeader>
              <CardContent>
                {discResult ? (
                  <div>
                    <p className="text-2xl font-bold text-blue mb-2">{discResult.results?.primary_type || "N/A"}</p>
                    <p className="text-sm text-muted-foreground">Perfil dominante que define tu estilo de acción</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Test pendiente</p>
                )}
              </CardContent>
            </Card>

            {/* MBTI Card */}
            <Card className={!mbtiResult ? "opacity-50" : ""}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Brain className="h-8 w-8 text-purple" />
                  {mbtiResult && <Badge variant="secondary">Completado</Badge>}
                </div>
                <CardTitle>MBTI</CardTitle>
                <CardDescription>Cómo piensas y procesas</CardDescription>
              </CardHeader>
              <CardContent>
                {mbtiResult ? (
                  <div>
                    <p className="text-2xl font-bold text-purple mb-2">{mbtiResult.results?.type || "N/A"}</p>
                    <p className="text-sm text-muted-foreground">Tu tipo de personalidad y preferencias cognitivas</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Test pendiente</p>
                )}
              </CardContent>
            </Card>

            {/* Big Five Card */}
            <Card className={!bigFiveResult ? "opacity-50" : ""}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <TrendingUp className="h-8 w-8 text-green" />
                  {bigFiveResult && <Badge variant="secondary">Completado</Badge>}
                </div>
                <CardTitle>Big Five</CardTitle>
                <CardDescription>Tus rasgos de personalidad</CardDescription>
              </CardHeader>
              <CardContent>
                {bigFiveResult ? (
                  <div>
                    <p className="text-sm font-medium mb-2">5 dimensiones evaluadas</p>
                    <p className="text-sm text-muted-foreground">Perfil completo de tu personalidad</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Test pendiente</p>
                )}
              </CardContent>
            </Card>

            {/* IE Card */}
            <Card className={!ieResult ? "opacity-50" : ""}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Heart className="h-8 w-8 text-red" />
                  {ieResult && <Badge variant="secondary">Completado</Badge>}
                </div>
                <CardTitle>Inteligencia Emocional</CardTitle>
                <CardDescription>Cómo sientes y gestionas emociones</CardDescription>
              </CardHeader>
              <CardContent>
                {ieResult ? (
                  <div>
                    <p className="text-2xl font-bold text-red mb-2">{ieResult.score || "N/A"}%</p>
                    <p className="text-sm text-muted-foreground">Nivel de inteligencia emocional</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Test pendiente</p>
                )}
              </CardContent>
            </Card>

            {/* RIASEC Card */}
            <Card className={!riasecResult ? "opacity-50" : ""}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Target className="h-8 w-8 text-orange" />
                  {riasecResult && <Badge variant="secondary">Completado</Badge>}
                </div>
                <CardTitle>RIASEC</CardTitle>
                <CardDescription>Qué te motiva profesionalmente</CardDescription>
              </CardHeader>
              <CardContent>
                {riasecResult ? (
                  <div>
                    <p className="text-sm font-medium mb-2">Intereses vocacionales identificados</p>
                    <p className="text-sm text-muted-foreground">Tu perfil de carrera ideal</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Test pendiente</p>
                )}
              </CardContent>
            </Card>

            {/* Soft Skills Card */}
            <Card className={!softSkillsResult ? "opacity-50" : ""}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Users className="h-8 w-8 text-blue" />
                  {softSkillsResult && <Badge variant="secondary">Completado</Badge>}
                </div>
                <CardTitle>Soft Skills</CardTitle>
                <CardDescription>Cómo te relacionas con otros</CardDescription>
              </CardHeader>
              <CardContent>
                {softSkillsResult ? (
                  <div>
                    <p className="text-sm font-medium mb-2">Competencias evaluadas</p>
                    <p className="text-sm text-muted-foreground">Tus fortalezas interpersonales</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Test pendiente</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Resumen Integral */}
          {testsCompleted > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Tu Perfil en una Frase</CardTitle>
                <CardDescription>Una síntesis de quién eres basada en tus tests completados</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg leading-relaxed">
                  {generateProfileSummary({
                    discResult,
                    mbtiResult,
                    bigFiveResult,
                    ieResult,
                    riasecResult,
                    softSkillsResult,
                  })}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Cómo Piensas - MBTI + Big Five */}
        <TabsContent value="como-piensas" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-purple" />
                Cómo Piensas y Procesas Información
              </CardTitle>
              <CardDescription>Tu estilo cognitivo, cómo tomas decisiones y procesas el mundo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {mbtiResult && (
                <div>
                  <h3 className="font-semibold text-lg mb-3">MBTI: {mbtiResult.results?.type}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium mb-1">Preferencias Cognitivas</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Energía: {mbtiResult.results?.dimensions?.EI > 50 ? "Extraversión" : "Introversión"}</li>
                        <li>• Información: {mbtiResult.results?.dimensions?.SN > 50 ? "Intuición" : "Sensación"}</li>
                        <li>• Decisiones: {mbtiResult.results?.dimensions?.TF > 50 ? "Sentimiento" : "Pensamiento"}</li>
                        <li>• Estilo de vida: {mbtiResult.results?.dimensions?.JP > 50 ? "Percepción" : "Juicio"}</li>
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Fortalezas Cognitivas</p>
                      <p className="text-sm text-muted-foreground">
                        {mbtiResult.results?.strengths?.[0] || "Análisis estratégico y visión de conjunto"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {bigFiveResult && (
                <div>
                  <h3 className="font-semibold text-lg mb-3">Big Five: Rasgos de Pensamiento</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Apertura a la Experiencia</span>
                        <span className="text-sm text-muted-foreground">{bigFiveResult.results?.openness || 50}%</span>
                      </div>
                      <Progress value={bigFiveResult.results?.openness || 50} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {bigFiveResult.results?.openness > 60
                        ? "Piensas de forma creativa, abstracta y disfrutas explorar nuevas ideas"
                        : "Prefieres métodos probados y enfoque práctico en la resolución de problemas"}
                    </p>
                  </div>
                </div>
              )}

              {!mbtiResult && !bigFiveResult && (
                <div className="text-center py-12">
                  <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground mb-4">Completa MBTI o Big Five para descubrir cómo piensas</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cómo Sientes - IE */}
        <TabsContent value="como-sientes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-6 w-6 text-red" />
                Cómo Sientes y Gestionas tus Emociones
              </CardTitle>
              <CardDescription>Tu relación con tus emociones y tu capacidad de regularlas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {ieResult ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Puntaje General: {ieResult.score}%</h3>
                    <Progress value={ieResult.score || 50} className="mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {(ieResult.score || 50) > 75
                        ? "Tienes una alta inteligencia emocional. Reconoces y gestionas bien tus emociones."
                        : (ieResult.score || 50) > 50
                          ? "Tu inteligencia emocional está en desarrollo. Con práctica puedes fortalecerla."
                          : "Hay oportunidades significativas para desarrollar tu inteligencia emocional."}
                    </p>
                  </div>

                  {ieResult.results?.dimensions && (
                    <div>
                      <h4 className="font-medium mb-3">Dimensiones Emocionales</h4>
                      <div className="space-y-4">
                        {Object.entries(ieResult.results.dimensions).map(([key, value]: [string, any]) => (
                          <div key={key}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium capitalize">{key.replace(/_/g, " ")}</span>
                              <span className="text-sm text-muted-foreground">{value}%</span>
                            </div>
                            <Progress value={value} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-red/5 border border-red/10 rounded-lg p-4">
                    <p className="text-sm font-medium text-red mb-2"> Para tu vida personal</p>
                    <p className="text-sm text-red">
                      Tu nivel de inteligencia emocional impacta directamente en tus relaciones con pareja, familia y
                      amigos. Una alta IE te permite conectar más profundamente, resolver conflictos de forma
                      constructiva y mantener vínculos sanos.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground mb-4">
                    Completa el test de Inteligencia Emocional para descubrir cómo sientes
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cómo Actúas - DISC */}
        <TabsContent value="como-actuas" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-6 w-6 text-blue" />
                Cómo Actúas y Comunicas
              </CardTitle>
              <CardDescription>Tu estilo de comportamiento natural y cómo te expresas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {discResult ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Perfil: {discResult.results?.primary_type}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {getDiscDescription(discResult.results?.primary_type)}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Puntajes DISC</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">Dominancia (D)</span>
                          <span className="text-sm text-muted-foreground">{discResult.results?.d_score || 0}%</span>
                        </div>
                        <Progress value={discResult.results?.d_score || 0} />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">Influencia (I)</span>
                          <span className="text-sm text-muted-foreground">{discResult.results?.i_score || 0}%</span>
                        </div>
                        <Progress value={discResult.results?.i_score || 0} />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">Estabilidad (S)</span>
                          <span className="text-sm text-muted-foreground">{discResult.results?.s_score || 0}%</span>
                        </div>
                        <Progress value={discResult.results?.s_score || 0} />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">Cumplimiento (C)</span>
                          <span className="text-sm text-muted-foreground">{discResult.results?.c_score || 0}%</span>
                        </div>
                        <Progress value={discResult.results?.c_score || 0} />
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue/5 border border-blue/10 rounded-lg p-4">
                    <p className="text-sm font-medium text-blue mb-2"> En tu vida diaria</p>
                    <p className="text-sm text-blue">
                      Tu estilo DISC influye en cómo te comunicas con tu familia, manejas el estrés en casa, y organizas
                      tu vida personal. Entenderlo te ayuda a mejorar tus relaciones y bienestar.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Zap className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground mb-4">Completa tu evaluación de personalidad para descubrir cómo actúas</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Qué te Motiva - RIASEC */}
        <TabsContent value="que-te-motiva" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-6 w-6 text-orange" />
                Qué te Motiva y Apasiona
              </CardTitle>
              <CardDescription>Tus intereses vocacionales y qué actividades te energizan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {riasecResult ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Intereses Dominantes</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {riasecResult.results?.topInterests?.map((interest: string, idx: number) => (
                        <div key={idx} className="bg-orange/5 border border-orange/20 rounded-lg p-3">
                          <p className="font-medium text-orange">{interest}</p>
                        </div>
                      )) || <p className="text-sm text-muted-foreground col-span-3">Perfil de intereses evaluado</p>}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Carreras Afines</h4>
                    <p className="text-sm text-muted-foreground">
                      Basado en tus intereses, carreras como{" "}
                      {riasecResult.results?.careerMatches?.[0] || "múltiples opciones"}
                      podrían alinearse bien contigo.
                    </p>
                  </div>

                  <div className="bg-orange/5 border border-orange/10 rounded-lg p-4">
                    <p className="text-sm font-medium text-orange mb-2"> Más allá del trabajo</p>
                    <p className="text-sm text-orange">
                      Estos intereses también pueden guiar tus hobbies, voluntariados y cómo contribuyes a tu comunidad.
                      No se trata solo de trabajo, sino de cómo quieres vivir tu vida.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground mb-4">Completa el test RIASEC para descubrir qué te motiva</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cómo te Relacionas - Soft Skills */}
        <TabsContent value="como-te-relacionas" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6 text-blue" />
                Cómo te Relacionas con Otros
              </CardTitle>
              <CardDescription>Tus habilidades interpersonales y cómo conectas con las personas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {softSkillsResult ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Competencias Interpersonales</h3>
                    {softSkillsResult.results?.skills && (
                      <div className="space-y-3">
                        {Object.entries(softSkillsResult.results.skills)
                          .slice(0, 5)
                          .map(([skill, score]: [string, any]) => (
                            <div key={skill}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium capitalize">{skill.replace(/_/g, " ")}</span>
                                <span className="text-sm text-muted-foreground">{score}%</span>
                              </div>
                              <Progress value={score} />
                            </div>
                          ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-teal-50 border border-teal-100 rounded-lg p-4">
                    <p className="text-sm font-medium text-teal-900 mb-2"> En tus relaciones personales</p>
                    <p className="text-sm text-teal-800">
                      Estas habilidades son fundamentales para tu vida personal: comunicarte efectivamente con tu
                      pareja, resolver conflictos familiares con empatía, colaborar con amigos, y construir relaciones
                      profundas y duraderas.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground mb-4">
                    Completa el test de Soft Skills para descubrir cómo te relacionas
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Helper functions
function generateProfileSummary({
  discResult,
  mbtiResult,
  bigFiveResult,
  ieResult,
  riasecResult,
  softSkillsResult,
}: any): string {
  const parts = []

  if (mbtiResult) {
    parts.push(`Eres ${mbtiResult.results?.type}`)
  }

  if (discResult) {
    parts.push(`con un estilo ${discResult.results?.primary_type} en tu comportamiento`)
  }

  if (ieResult && ieResult.score > 70) {
    parts.push(`alta inteligencia emocional`)
  }

  if (riasecResult) {
    parts.push(`te motiva el trabajo ${riasecResult.results?.topInterests?.[0]?.toLowerCase() || "práctico"}`)
  }

  if (softSkillsResult) {
    parts.push(`y te relacionas con empatía y colaboración`)
  }

  if (parts.length === 0) {
    return "Completa más tests para generar tu resumen integral personalizado."
  }

  return parts.join(", ") + ". Este es el comienzo de tu viaje de autoconocimiento profundo."
}

function getDiscDescription(type: string): string {
  const descriptions: Record<string, string> = {
    D: "Eres directo, orientado a resultados y te gusta tomar el control. Tiendes a ser decidido y competitivo.",
    I: "Eres sociable, entusiasta y te enfocas en las personas. Tiendes a ser optimista y persuasivo.",
    S: "Eres paciente, confiable y valoras la estabilidad. Tiendes a ser colaborativo y diplomático.",
    C: "Eres analítico, preciso y valoras la calidad. Tiendes a ser sistemático y cuidadoso.",
  }
  return descriptions[type] || "Tu perfil único combina diferentes estilos de comportamiento."
}
