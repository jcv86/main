"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "@/components/session-wrapper"
import { createClient } from "@supabase/supabase-js"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Brain, Download, Share2, TrendingUp, Target, Loader2, Lightbulb, Check } from "lucide-react"
import { SofiaDaniCoach } from "@/components/sofia-dani-coach"
import { useToast } from "@/hooks/use-toast"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"

interface MBTIResult {
  type: string
  e_score: number
  i_score: number
  s_score: number
  n_score: number
  t_score: number
  f_score: number
  j_score: number
  p_score: number
  overall_score: number
  created_at: string
}

const MBTI_DESCRIPTIONS: Record<
  string,
  {
    title: string
    subtitle: string
    strengths: string[]
    challenges: string[]
    careers: string[]
    famous: string[]
  }
> = {
  INTJ: {
    title: "El Arquitecto",
    subtitle: "Pensador estratégico con plan para todo",
    strengths: ["Visión estratégica", "Pensamiento analítico", "Independencia", "Determinación"],
    challenges: ["Puede parecer arrogante", "Dificultad con emociones", "Excesivamente crítico"],
    careers: ["Científico", "Ingeniero", "Estratega de negocios", "Arquitecto"],
    famous: ["Elon Musk", "Isaac Newton", "Michelle Obama"],
  },
  INTP: {
    title: "El Lógico",
    subtitle: "Pensador innovador con sed de conocimiento",
    strengths: ["Análisis lógico", "Creatividad intelectual", "Objetividad", "Curiosidad"],
    challenges: ["Distante emocionalmente", "Insensible a veces", "Disperso"],
    careers: ["Científico", "Programador", "Profesor", "Analista"],
    famous: ["Albert Einstein", "Bill Gates", "Marie Curie"],
  },
  ENTJ: {
    title: "El Comandante",
    subtitle: "Líder audaz e imaginativo",
    strengths: ["Liderazgo natural", "Estrategia", "Eficiencia", "Carisma"],
    challenges: ["Intolerante", "Impaciente", "Dominante"],
    careers: ["CEO", "Abogado", "Emprendedor", "Director"],
    famous: ["Steve Jobs", "Margaret Thatcher", "Franklin D. Roosevelt"],
  },
  ENTP: {
    title: "El Innovador",
    subtitle: "Pensador inteligente que ama el debate",
    strengths: ["Ingenio rápido", "Creatividad", "Versatilidad", "Energía intelectual"],
    challenges: ["Argumentativo", "Insensible", "Poco práctico"],
    careers: ["Emprendedor", "Abogado", "Inventor", "Consultor"],
    famous: ["Thomas Edison", "Leonardo da Vinci", "Mark Twain"],
  },
  INFJ: {
    title: "El Abogado",
    subtitle: "Idealista tranquilo pero inspirador",
    strengths: ["Empatía profunda", "Visión", "Creatividad", "Idealismo"],
    challenges: ["Sensible a críticas", "Perfeccionista", "Retraído"],
    careers: ["Psicólogo", "Escritor", "Consejero", "Profesor"],
    famous: ["Martin Luther King Jr.", "Nelson Mandela", "Platon"],
  },
  INFP: {
    title: "El Mediador",
    subtitle: "Idealista poético guiado por valores",
    strengths: ["Empatía", "Creatividad", "Idealismo", "Pasión"],
    challenges: ["Demasiado idealista", "Difícil de conocer", "Toma decisiones con el corazón"],
    careers: ["Escritor", "Artista", "Psicólogo", "Educador"],
    famous: ["William Shakespeare", "J.R.R. Tolkien", "Vincent van Gogh"],
  },
  ENFJ: {
    title: "El Protagonista",
    subtitle: "Líder carismático e inspirador",
    strengths: ["Carismático", "Altruista", "Líder natural", "Confiable"],
    challenges: ["Demasiado idealista", "Demasiado abnegado", "Sensible"],
    careers: ["Maestro", "Coach", "Político", "Líder de ONG"],
    famous: ["Barack Obama", "Oprah Winfrey", "Martin Luther King Jr."],
  },
  ENFP: {
    title: "El Activista",
    subtitle: "Espíritu libre entusiasta y creativo",
    strengths: ["Entusiasmo", "Creatividad", "Sociable", "Optimismo"],
    challenges: ["Desorganizado", "Busca aprobación", "Se estresa fácilmente"],
    careers: ["Emprendedor", "Actor", "Consultor", "Escritor"],
    famous: ["Robin Williams", "Ellen DeGeneres", "Walt Disney"],
  },
  ISTJ: {
    title: "El Logista",
    subtitle: "Práctico, confiable y metódico",
    strengths: ["Responsable", "Organizado", "Honesto", "Leal"],
    challenges: ["Terco", "Insensible", "Resistente al cambio"],
    careers: ["Contador", "Abogado", "Ingeniero", "Militar"],
    famous: ["George Washington", "Warren Buffett", "Angela Merkel"],
  },
  ISFJ: {
    title: "El Defensor",
    subtitle: "Protector dedicado y cálido",
    strengths: ["Apoyo", "Confiable", "Paciente", "Leal"],
    challenges: ["Demasiado humilde", "Reprime sentimientos", "Resistente al cambio"],
    careers: ["Enfermero", "Maestro", "Administrador", "Trabajador social"],
    famous: ["Madre Teresa", "Beyoncé", "Kate Middleton"],
  },
  ESTJ: {
    title: "El Ejecutivo",
    subtitle: "Administrador excelente que gestiona personas y cosas",
    strengths: ["Organizado", "Práctico", "Dedicado", "Honesto"],
    challenges: ["Inflexible", "Poco cómodo con lo inusual", "Crítico"],
    careers: ["Gerente", "Juez", "Militar", "Director"],
    famous: ["Judge Judy", "Henry Ford", "Lyndon B. Johnson"],
  },
  ESFJ: {
    title: "El Cónsul",
    subtitle: "Persona extraordinariamente cariñosa y popular",
    strengths: ["Apoyo fuerte", "Confiable", "Práctico", "Sociable"],
    challenges: ["Busca aprobación", "Inflexible", "Vulnerable a críticas"],
    careers: ["Maestro", "Enfermero", "Gerente de RR.HH.", "Organizador de eventos"],
    famous: ["Taylor Swift", "Jennifer Garner", "Danny Glover"],
  },
  ISTP: {
    title: "El Virtuoso",
    subtitle: "Maestro audaz y práctico de herramientas",
    strengths: ["Optimista", "Creativo", "Práctico", "Espontáneo"],
    challenges: ["Terco", "Insensible", "Arriesgado"],
    careers: ["Mecánico", "Ingeniero", "Piloto", "Fotógrafo"],
    famous: ["Bruce Lee", "Amelia Earhart", "Steve Jobs"],
  },
  ISFP: {
    title: "El Aventurero",
    subtitle: "Artista flexible y encantador",
    strengths: ["Encantador", "Sensible al arte", "Curioso", "Apasionado"],
    challenges: ["Muy competitivo", "Impredecible", "Fácilmente estresado"],
    careers: ["Artista", "Músico", "Chef", "Diseñador"],
    famous: ["Michael Jackson", "Lady Gaga", "Britney Spears"],
  },
  ESTP: {
    title: "El Emprendedor",
    subtitle: "Perceptivo y lleno de energía",
    strengths: ["Audaz", "Racional", "Práctico", "Directo"],
    challenges: ["Insensible", "Impaciente", "Arriesgado"],
    careers: ["Emprendedor", "Paramédico", "Vendedor", "Atleta"],
    famous: ["Donald Trump", "Ernest Hemingway", "Madonna"],
  },
  ESFP: {
    title: "El Animador",
    subtitle: "Entretenedor espontáneo y entusiasta",
    strengths: ["Audaz", "Original", "Estético", "Práctico"],
    challenges: ["Sensible", "Evita conflictos", "Fácilmente aburrido"],
    careers: ["Actor", "Artista", "Diseñador", "Terapeuta"],
    famous: ["Marilyn Monroe", "Jamie Oliver", "Will Smith"],
  },
}

export default function MBTIResultsPage() {
  const { user } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const isDemoMode = searchParams.get("demo") === "true"
  const { toast } = useToast()

  const [mbtiResult, setMbtiResult] = useState<MBTIResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("resumen-ejecutivo")

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  useEffect(() => {
    if (!user && !isDemoMode) {
      router.push("/test/mbti")
      return
    }

    fetchResults()
  }, [user, isDemoMode])

  const fetchResults = async () => {
    try {
      setLoading(true)

      if (isDemoMode) {
        // Demo data
        setMbtiResult({
          type: "INTJ",
          e_score: 35,
          i_score: 65,
          s_score: 30,
          n_score: 70,
          t_score: 75,
          f_score: 25,
          j_score: 68,
          p_score: 32,
          overall_score: 85,
          created_at: new Date().toISOString(),
        })
      } else {
        const { data, error } = await supabase
          .from("test_results")
          .select("*")
          .eq("user_id", user?.id)
          .eq("test_name", "Mapa de Personalidad Despega")
          .order("created_at", { ascending: false })
          .limit(1)
          .single()

        if (error) throw error
        if (data) {
          setMbtiResult(data.result as MBTIResult)
        }
      }
    } catch (error: any) {
      console.error("Error fetching MBTI results:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los resultados",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!mbtiResult) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>No se encontraron resultados</CardTitle>
            <CardDescription>Realiza el test para ver tus resultados</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/test/mbti")} className="w-full">
              Realizar Test MBTI
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const typeInfo = MBTI_DESCRIPTIONS[mbtiResult.type] || MBTI_DESCRIPTIONS["INTJ"]

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.push("/test")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver a Tests
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Descargar PDF
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Compartir
            </Button>
          </div>
        </div>

        {/* Hero Section */}
        <Card className="border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 to-blue-50">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-purple-600 rounded-full flex items-center justify-center">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-3xl">
                  {mbtiResult.type} - {typeInfo.title}
                </CardTitle>
                <CardDescription className="text-lg mt-2">{typeInfo.subtitle}</CardDescription>
              </div>
              <Badge className="text-lg px-4 py-2" variant="secondary">
                {mbtiResult.overall_score}% Confianza
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 gap-2">
            <TabsTrigger value="resumen-ejecutivo">Resumen</TabsTrigger>
            <TabsTrigger value="dimensiones">Dimensiones</TabsTrigger>
            <TabsTrigger value="oportunidades">Oportunidades</TabsTrigger>
            <TabsTrigger value="conexiones">Conexiones</TabsTrigger>
            <TabsTrigger value="reflexion">Reflexión</TabsTrigger>
            <TabsTrigger value="coach">Coach IA</TabsTrigger>
            <TabsTrigger value="siguientes-pasos">Siguientes Pasos</TabsTrigger>
          </TabsList>

          {/* Resumen Ejecutivo */}
          <TabsContent value="resumen-ejecutivo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tu Perfil de Personalidad</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Fortalezas Clave</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {typeInfo.strengths.map((strength, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-green-600 mt-0.5" />
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Áreas de Desarrollo</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {typeInfo.challenges.map((challenge, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Target className="h-5 w-5 text-amber-600 mt-0.5" />
                            <span>{challenge}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Carreras Ideales</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {typeInfo.careers.map((career, idx) => (
                        <Badge key={idx} variant="secondary">
                          {career}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Personas Famosas con tu Tipo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {typeInfo.famous.map((person, idx) => (
                        <Badge key={idx} variant="outline">
                          {person}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dimensiones MBTI */}
          <TabsContent value="dimensiones" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tus 4 Dimensiones de Personalidad</CardTitle>
                <CardDescription>Análisis detallado de cada dimensión MBTI</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* E vs I */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Extraversión (E) vs Introversión (I)</span>
                    <span className="text-sm text-muted-foreground">
                      {mbtiResult.e_score > mbtiResult.i_score
                        ? `${mbtiResult.e_score}% E`
                        : `${mbtiResult.i_score}% I`}
                    </span>
                  </div>
                  <Progress value={mbtiResult.e_score} className="h-3" />
                  <p className="text-sm text-muted-foreground mt-2">
                    {mbtiResult.e_score > mbtiResult.i_score
                      ? "Prefieres la interacción social y obtienes energía de estar con otros."
                      : "Prefieres la reflexión interna y recargas energía en soledad."}
                  </p>
                </div>

                {/* S vs N */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Sensorial (S) vs Intuitivo (N)</span>
                    <span className="text-sm text-muted-foreground">
                      {mbtiResult.s_score > mbtiResult.n_score
                        ? `${mbtiResult.s_score}% S`
                        : `${mbtiResult.n_score}% N`}
                    </span>
                  </div>
                  <Progress value={mbtiResult.s_score} className="h-3" />
                  <p className="text-sm text-muted-foreground mt-2">
                    {mbtiResult.s_score > mbtiResult.n_score
                      ? "Te enfocas en hechos concretos y detalles del presente."
                      : "Te enfocas en patrones, posibilidades y el futuro."}
                  </p>
                </div>

                {/* T vs F */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Pensamiento (T) vs Sentimiento (F)</span>
                    <span className="text-sm text-muted-foreground">
                      {mbtiResult.t_score > mbtiResult.f_score
                        ? `${mbtiResult.t_score}% T`
                        : `${mbtiResult.f_score}% F`}
                    </span>
                  </div>
                  <Progress value={mbtiResult.t_score} className="h-3" />
                  <p className="text-sm text-muted-foreground mt-2">
                    {mbtiResult.t_score > mbtiResult.f_score
                      ? "Tomas decisiones basadas en lógica y análisis objetivo."
                      : "Tomas decisiones basadas en valores y consideraciones personales."}
                  </p>
                </div>

                {/* J vs P */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Calificador (J) vs Perceptivo (P)</span>
                    <span className="text-sm text-muted-foreground">
                      {mbtiResult.j_score > mbtiResult.p_score
                        ? `${mbtiResult.j_score}% J`
                        : `${mbtiResult.p_score}% P`}
                    </span>
                  </div>
                  <Progress value={mbtiResult.j_score} className="h-3" />
                  <p className="text-sm text-muted-foreground mt-2">
                    {mbtiResult.j_score > mbtiResult.p_score
                      ? "Prefieres estructura, planificación y cierre en decisiones."
                      : "Prefieres flexibilidad, espontaneidad y mantener opciones abiertas."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Oportunidades de Desarrollo */}
          <TabsContent value="oportunidades" className="space-y-6">
            <Card className="border-l-4 border-l-amber-500">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-amber-600" />
                  Oportunidades de Desarrollo
                </CardTitle>
                <CardDescription>
                  Áreas específicas donde puedes crecer basadas en tu tipo {mbtiResult.type}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Por qué estas oportunidades son relevantes para ti</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Tu tipo {mbtiResult.type} ({typeInfo.title}) tiene preferencias naturales que son fortalezas, pero
                    también áreas ciegas. Estas oportunidades están diseñadas para expandir tu zona de confort sin
                    cambiar quien eres esencialmente.
                  </p>
                </div>

                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <CardTitle className="text-lg">1. Balancear tus Preferencias Naturales</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm">
                      Aunque tu tipo prefiere ciertas formas de interactuar con el mundo, desarrollar el lado opuesto te
                      hará más versátil.
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex gap-2">
                        <span className="text-blue-600">→</span>
                        <span>
                          Si eres Introvertido (I): Practica interacciones sociales breves pero significativas
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-blue-600">→</span>
                        <span>Si eres Intuitivo (N): Enfócate en detalles prácticos 1 hora al día</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-blue-600">→</span>
                        <span>Si eres Pensamiento (T): Considera el impacto emocional antes de decidir</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-blue-600">→</span>
                        <span>Si eres Calificador (J): Practica la flexibilidad dejando 1 día sin plan fijo</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <CardTitle className="text-lg">2. Desarrollar Competencias Complementarias</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm">
                      Identifica qué habilidades necesitas para ser más efectivo en tu vida y carrera.
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex gap-2">
                        <span className="text-green-600">→</span>
                        <span>Toma un curso de comunicación emocional si eres tipo T (Pensamiento)</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-green-600">→</span>
                        <span>Practica mindfulness si eres tipo E (Extravertido) para conectar contigo mismo</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-green-600">→</span>
                        <span>Desarrolla habilidades de planificación si eres tipo P (Perceptivo)</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader>
                    <CardTitle className="text-lg">3. Expandir tu Círculo de Influencia</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm">
                      Conecta con personas de tipos MBTI diferentes para aprender perspectivas distintas.
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex gap-2">
                        <span className="text-purple-600">→</span>
                        <span>Busca un mentor con tipo opuesto al tuyo (ej: si eres INTJ, busca un ESFP)</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-purple-600">→</span>
                        <span>Únete a grupos con diversidad de tipos para ampliar tu visión</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-purple-600">→</span>
                        <span>Practica adaptación conductual: actúa "fuera de tipo" 1 hora/semana</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500">
                  <CardHeader>
                    <CardTitle className="text-lg">4. Alinear Carrera con Personalidad</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm">Asegúrate de que tu trabajo aprovecha tus fortalezas naturales.</p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex gap-2">
                        <span className="text-orange-600">→</span>
                        <span>Evalúa si tu rol actual te permite usar tus preferencias el 70% del tiempo</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-orange-600">→</span>
                        <span>Identifica proyectos que se alineen con tu tipo MBTI</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-orange-600">→</span>
                        <span>Considera roles que combinen tus fortalezas con áreas de crecimiento</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Conexión con Otros Módulos */}
          <TabsContent value="conexiones" className="space-y-6">
            <Card className="border-l-4 border-l-indigo-500">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Brain className="h-6 w-6 text-indigo-600" />
                  Conexión con Otros Módulos DTC
                </CardTitle>
                <CardDescription>Cómo MBTI se relaciona con los demás tests del ecosistema DTC</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">El Mapa Completo de Tu Personalidad</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    MBTI revela tus preferencias cognitivas naturales (cómo procesas información y tomas decisiones).
                    Combinado con otros tests DTC, obtienes una visión 360° de quién eres.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="border-2 border-blue-300">
                    <CardHeader>
                      <CardTitle className="text-base">DISC (Despega Cerebral)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="bg-blue-50 p-3 rounded text-sm">
                        <strong>Conexión:</strong>
                        <p className="mt-1">MBTI mide preferencias cognitivas, DISC mide comportamiento observable.</p>
                      </div>
                      <div className="text-sm">
                        <strong>Ejemplo:</strong> INTJ + alto C en DISC = Analítico estratégico. INTJ + alto D = Líder
                        visionario.
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-red-300">
                    <CardHeader>
                      <CardTitle className="text-base">Inteligencia Emocional</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="bg-red-50 p-3 rounded text-sm">
                        <strong>Conexión:</strong>
                        <p className="mt-1">
                          MBTI explica cómo prefieres procesar emociones, IE mide qué tan bien lo haces.
                        </p>
                      </div>
                      <div className="text-sm">
                        <strong>Ejemplo:</strong> Tipo F (Sentimiento) no garantiza alta IE. Puedes ser F y tener baja
                        autoconciencia emocional.
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-purple-300">
                    <CardHeader>
                      <CardTitle className="text-base">Big Five</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="bg-purple-50 p-3 rounded text-sm">
                        <strong>Conexión:</strong>
                        <p className="mt-1">
                          MBTI usa categorías (I o E), Big Five usa espectros (0-100 en Extraversion).
                        </p>
                      </div>
                      <div className="text-sm">
                        <strong>Ejemplo:</strong> Puedes ser "I" en MBTI pero tener 60% Extraversion en Big Five =
                        Introvertido social.
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-green-300">
                    <CardHeader>
                      <CardTitle className="text-base">RIASEC</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="bg-green-50 p-3 rounded text-sm">
                        <strong>Conexión:</strong>
                        <p className="mt-1">
                          MBTI sugiere cómo trabajas, RIASEC sugiere qué tipo de trabajo disfrutas.
                        </p>
                      </div>
                      <div className="text-sm">
                        <strong>Ejemplo:</strong> INTJ + Investigador (RIASEC) = Científico. INTJ + Emprendedor =
                        Fundador de startup tech.
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-yellow-300">
                    <CardHeader>
                      <CardTitle className="text-base">Soft Skills</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="bg-yellow-50 p-3 rounded text-sm">
                        <strong>Conexión:</strong>
                        <p className="mt-1">
                          MBTI muestra preferencias naturales, Soft Skills mide competencias desarrolladas.
                        </p>
                      </div>
                      <div className="text-sm">
                        <strong>Ejemplo:</strong> Ser tipo T no significa mala empatía. Soft Skills mostrará si has
                        entrenado esa habilidad.
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Ejemplos de Sinergia MBTI + Otros Tests</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Caso 1: El Estratega Empático</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• MBTI: INFJ (Visionario idealista)</li>
                        <li>• IE: Alta empatía + Alta autoconciencia</li>
                        <li>• RIASEC: Social + Artístico</li>
                        <li>• Rol ideal: Coach ejecutivo, terapeuta, líder de ONG</li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Caso 2: El Innovador Práctico</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• MBTI: ENTP (Visionario debatidor)</li>
                        <li>• DISC: Alto D + Alto I = Emprendedor carismático</li>
                        <li>• RIASEC: Emprendedor + Investigador</li>
                        <li>• Rol ideal: Fundador de startup, consultor de innovación</li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Caso 3: El Ejecutor Sistemático</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• MBTI: ISTJ (Organizado confiable)</li>
                        <li>• Big Five: Alta Conscientiousness</li>
                        <li>• Soft Skills: Alta gestión del tiempo + planificación</li>
                        <li>• Rol ideal: Director de operaciones, auditor, gerente de proyectos</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preguntas de Reflexión */}
          <TabsContent value="reflexion" className="space-y-6">
            <Card className="border-l-4 border-l-pink-500">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Lightbulb className="h-6 w-6 text-pink-600" />
                  Preguntas de Reflexión Profunda
                </CardTitle>
                <CardDescription>Explora tu tipo MBTI más allá de los resultados del test</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Por qué reflexionar es tan importante</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Tu tipo MBTI es una brújula, no una caja. Estas preguntas te ayudan a entender cómo tu tipo se
                    manifiesta en tu vida real y cómo puedes aprovecharlo mejor.
                  </p>
                </div>

                <Accordion type="single" collapsible className="space-y-4">
                  <AccordionItem value="identidad">
                    <AccordionTrigger className="bg-blue-50 px-4 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🎭</span>
                        <span className="font-semibold">Identidad y Autenticidad</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 space-y-4">
                      <Card>
                        <CardContent className="pt-6 space-y-3">
                          <h4 className="font-semibold">
                            1. ¿Siento que mi tipo MBTI realmente me describe, o me identifico más con otro tipo?
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Si no te sientes identificado, puede que estés actuando bajo presión externa. Reflexiona
                            sobre cuál es tu "yo auténtico" vs. tu "yo adaptado".
                          </p>
                          <textarea
                            placeholder="Escribe tu reflexión aquí..."
                            className="w-full min-h-[100px] p-3 border rounded-lg"
                          />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6 space-y-3">
                          <h4 className="font-semibold">
                            2. ¿En qué situaciones actúo más alineado con mi tipo MBTI? ¿En cuáles me siento forzado a
                            actuar diferente?
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Identifica contextos donde puedes ser tú mismo vs. donde debes adaptarte. El objetivo es
                            maximizar lo primero.
                          </p>
                          <textarea
                            placeholder="Escribe tu reflexión aquí..."
                            className="w-full min-h-[100px] p-3 border rounded-lg"
                          />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6 space-y-3">
                          <h4 className="font-semibold">
                            3. ¿Qué aspecto de mi tipo MBTI me resulta más difícil de aceptar?
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Ejemplo: Si eres Introvertido pero la sociedad valora la Extraversión, ¿cómo afecta eso tu
                            autoestima?
                          </p>
                          <textarea
                            placeholder="Escribe tu reflexión aquí..."
                            className="w-full min-h-[100px] p-3 border rounded-lg"
                          />
                        </CardContent>
                      </Card>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="relaciones">
                    <AccordionTrigger className="bg-green-50 px-4 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">💬</span>
                        <span className="font-semibold">Relaciones y Comunicación</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 space-y-4">
                      <Card>
                        <CardContent className="pt-6 space-y-3">
                          <h4 className="font-semibold">
                            4. ¿Cómo crees que tu tipo MBTI afecta tus relaciones más importantes?
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Reflexiona sobre conflictos recurrentes. Ejemplo: Si eres tipo J y tu pareja es P, ¿cómo
                            manejan las diferencias de planificación?
                          </p>
                          <textarea
                            placeholder="Escribe tu reflexión aquí..."
                            className="w-full min-h-[100px] p-3 border rounded-lg"
                          />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6 space-y-3">
                          <h4 className="font-semibold">
                            5. ¿Con qué tipos MBTI tengo más química? ¿Con cuáles más conflictos?
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Identifica patrones. Ejemplo: INTJ + ESFP = choque de preferencias, pero puede ser
                            complementario si hay respeto mutuo.
                          </p>
                          <textarea
                            placeholder="Escribe tu reflexión aquí..."
                            className="w-full min-h-[100px] p-3 border rounded-lg"
                          />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6 space-y-3">
                          <h4 className="font-semibold">
                            6. ¿Cómo podría adaptar mi comunicación para conectar mejor con tipos diferentes al mío?
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            La flexibilidad de tipo es una habilidad clave. Practica "hablar el idioma" de otros tipos.
                          </p>
                          <textarea
                            placeholder="Escribe tu reflexión aquí..."
                            className="w-full min-h-[100px] p-3 border rounded-lg"
                          />
                        </CardContent>
                      </Card>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="carrera">
                    <AccordionTrigger className="bg-purple-50 px-4 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">💼</span>
                        <span className="font-semibold">Carrera y Propósito</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 space-y-4">
                      <Card>
                        <CardContent className="pt-6 space-y-3">
                          <h4 className="font-semibold">
                            7. ¿Mi trabajo actual me permite expresar mis preferencias MBTI la mayoría del tiempo?
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Si pasas el 80% del tiempo actuando "fuera de tipo", es insostenible a largo plazo. ¿Qué
                            necesitas cambiar?
                          </p>
                          <textarea
                            placeholder="Escribe tu reflexión aquí..."
                            className="w-full min-h-[100px] p-3 border rounded-lg"
                          />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6 space-y-3">
                          <h4 className="font-semibold">
                            8. ¿Cuál sería mi "carrera ideal" basada en mi tipo MBTI y mis valores personales?
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            No te limites a las carreras "típicas" de tu tipo. Piensa en roles que combinen tus
                            fortalezas con tu propósito.
                          </p>
                          <textarea
                            placeholder="Escribe tu reflexión aquí..."
                            className="w-full min-h-[100px] p-3 border rounded-lg"
                          />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6 space-y-3">
                          <h4 className="font-semibold">
                            9. ¿Qué contribución quiero hacer al mundo, y cómo mi tipo MBTI puede ayudarme a lograrlo?
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Tu tipo es una herramienta para tu propósito, no el propósito en sí mismo.
                          </p>
                          <textarea
                            placeholder="Escribe tu reflexión aquí..."
                            className="w-full min-h-[100px] p-3 border rounded-lg"
                          />
                        </CardContent>
                      </Card>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="desarrollo">
                    <AccordionTrigger className="bg-orange-50 px-4 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🌱</span>
                        <span className="font-semibold">Desarrollo Personal</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 space-y-4">
                      <Card>
                        <CardContent className="pt-6 space-y-3">
                          <h4 className="font-semibold">
                            10. ¿Qué función MBTI menos desarrollada me gustaría fortalecer?
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Ejemplo: Si eres tipo T, desarrollar tu función F (Sentimiento) te hará más empático.
                          </p>
                          <textarea
                            placeholder="Escribe tu reflexión aquí..."
                            className="w-full min-h-[100px] p-3 border rounded-lg"
                          />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6 space-y-3">
                          <h4 className="font-semibold">
                            11. ¿Qué persona con tipo MBTI diferente al mío admiro, y qué puedo aprender de ella?
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Estudiar tipos complementarios te enseña lo que no ves naturalmente.
                          </p>
                          <textarea
                            placeholder="Escribe tu reflexión aquí..."
                            className="w-full min-h-[100px] p-3 border rounded-lg"
                          />
                        </CardContent>
                      </Card>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Coach IA */}
          <TabsContent value="coach" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Habla con tu Coach IA</CardTitle>
                <CardDescription>Sofia y Dani están aquí para ayudarte a entender mejor tu tipo MBTI</CardDescription>
              </CardHeader>
              <CardContent>
                <SofiaDaniCoach
                  testType="Mapa de Personalidad Despega"
                  testResults={{
                    type: mbtiResult.type,
                    scores: {
                      E: mbtiResult.e_score,
                      I: mbtiResult.i_score,
                      S: mbtiResult.s_score,
                      N: mbtiResult.n_score,
                      T: mbtiResult.t_score,
                      F: mbtiResult.f_score,
                      J: mbtiResult.j_score,
                      P: mbtiResult.p_score,
                    },
                  }}
                  userName={user?.email?.split("@")[0] || "Usuario"}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Siguientes Pasos */}
          <TabsContent value="siguientes-pasos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tus Siguientes Pasos</CardTitle>
                <CardDescription>Recomendaciones para aprovechar al máximo tu resultado</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100">
                        <span className="text-xl font-bold text-blue-600">1</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2">Completa los otros tests DTC</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          MBTI es solo una pieza. Completa DISC, IE, Big Five, RIASEC y Soft Skills para tener tu perfil
                          completo.
                        </p>
                        <Button onClick={() => router.push("/test")} variant="outline" size="sm">
                          Ver todos los tests
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100">
                        <span className="text-xl font-bold text-green-600">2</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2">Reflexiona con tu Coach IA</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Sofia y Dani pueden ayudarte a entender mejor tu tipo y cómo aplicarlo en tu vida.
                        </p>
                        <Button onClick={() => setActiveTab("coach")} variant="outline" size="sm">
                          Hablar con Coach
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100">
                        <span className="text-xl font-bold text-purple-600">3</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2">Explora Oportunidades de Desarrollo</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Identifica áreas donde puedes crecer sin cambiar quien eres esencialmente.
                        </p>
                        <Button onClick={() => setActiveTab("oportunidades")} variant="outline" size="sm">
                          Ver Oportunidades
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100">
                        <span className="text-xl font-bold text-orange-600">4</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2">Comparte tus Resultados</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Comparte tu tipo MBTI con amigos, familia o colegas para mejorar la comunicación.
                        </p>
                        <Button variant="outline" size="sm">
                          <Share2 className="h-4 w-4 mr-2" />
                          Compartir Resultados
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
