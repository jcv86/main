"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "@/components/session-provider" // Corrected import path
import { createClient } from "@supabase/supabase-js"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Brain,
  Download,
  Share2,
  TrendingUp,
  Target,
  Loader2,
  Lightbulb,
  Check,
  Calendar,
  Heart,
  Users,
  Home,
  Sparkles,
  Zap,
  Eye,
  MapPin,
  Briefcase,
  Trophy,
  BookOpen,
  ArrowRight,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { EnhancedCoachFlow } from "@/components/enhanced-coach-flow"
import { UnifiedTestSystem } from "@/lib/unified-test-system" // Import UnifiedTestSystem

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
        // Fetch user's email for UnifiedTestSystem
        if (!user?.email) {
          console.error("User email not found, cannot fetch test results.")
          toast({
            title: "Error de Autenticación",
            description: "No se pudo recuperar tu información de usuario para cargar los resultados.",
            variant: "destructive",
          })
          setLoading(false)
          return
        }

        console.log("[v0] Loading MBTI results from database...")
        const data = await UnifiedTestSystem.loadTestResult(user.email, "MBTI")

        if (data && data.result) {
          setMbtiResult(data.result as MBTIResult)
        } else {
          console.warn("No MBTI results found for the user.")
          // Optionally set a state to indicate no results found and prompt the user to take the test
          setMbtiResult(null)
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
  const mbtiType = mbtiResult.type

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
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-9 gap-2">
            <TabsTrigger value="resumen-ejecutivo">Resumen</TabsTrigger>
            <TabsTrigger value="dimensiones">Dimensiones</TabsTrigger>
            <TabsTrigger value="oportunidades">Oportunidades</TabsTrigger>
            <TabsTrigger value="biblioteca">Biblioteca DTC</TabsTrigger>
            <TabsTrigger value="conexiones">Conexiones</TabsTrigger>
            <TabsTrigger value="reflexion">Reflexión</TabsTrigger>
            <TabsTrigger value="plan-90-dias">Plan 90 Días</TabsTrigger>
            <TabsTrigger value="coach">Coach IA</TabsTrigger>
            <TabsTrigger value="siguientes-pasos">Siguientes Pasos</TabsTrigger>
          </TabsList>

          {/* Resumen Ejecutivo */}
          <TabsContent value="resumen-ejecutivo" className="space-y-6">
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
              <CardHeader>
                <CardTitle className="text-3xl font-bold flex items-center gap-3">
                  <Lightbulb className="w-8 h-8 text-blue-600" />
                  Resumen Ejecutivo Integral DTC
                </CardTitle>
                <CardDescription className="text-lg">
                  Tu personalidad en una foto: cómo piensas, sientes y te relacionas con el mundo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Foto 360° del perfil */}
                <div className="bg-white rounded-xl p-6 border-2 border-blue-100">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-900">
                    <Target className="w-6 h-6" />
                    Foto 360° de tu personalidad {mbtiType}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Zap className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Energía</h4>
                          <p className="text-gray-700">
                            {mbtiType.includes("E")
                              ? "Te recargas en grupo, hablas para pensar, sociable y expresivo"
                              : "Te recargas en soledad, piensas antes de hablar, reflexivo y profundo"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <Eye className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Percepción</h4>
                          <p className="text-gray-700">
                            {mbtiType.includes("S")
                              ? "Concreto, presente, atención al detalle y experiencia práctica"
                              : "Abstracto, futuro, big picture y posibilidades creativas"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                          <Brain className="w-4 h-4 text-pink-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Decisiones</h4>
                          <p className="text-gray-700">
                            {mbtiType.includes("T")
                              ? "Lógica, objetividad, análisis crítico y justicia imparcial"
                              : "Empatía, valores, armonía y consideración de las personas"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Estilo de vida</h4>
                          <p className="text-gray-700">
                            {mbtiType.includes("J")
                              ? "Estructura, planificación, cierre y organización sistemática"
                              : "Flexibilidad, adaptación, exploración y opciones abiertas"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top 5 ideas sobre tu forma de ser */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-purple-900">
                    <Sparkles className="w-6 h-6" />
                    Top 5 ideas sobre tu forma de ser
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                      <h4 className="font-semibold text-blue-900 mb-2">1. Cómo piensas y procesas</h4>
                      <p className="text-gray-700">
                        {mbtiType.includes("N")
                          ? 'Ves patrones, conexiones y posibilidades. Tu mente vive en el "qué podría ser". Esto te hace innovador pero a veces desconectado del presente.'
                          : 'Procesas la realidad tal como es: datos, hechos, experiencia directa. Tu mente vive en el "qué es". Esto te hace práctico pero a veces te cuesta visualizar lo nuevo.'}
                      </p>
                    </div>

                    <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
                      <h4 className="font-semibold text-purple-900 mb-2">2. Cómo te ves a ti mismo</h4>
                      <p className="text-gray-700">
                        {mbtiType.includes("I")
                          ? "Te sientes más auténtico en la introspección. Valoras tu mundo interno, tus pensamientos y tu autonomía. No eres tímido, simplemente selectivo con tu energía."
                          : "Te sientes más vivo en la acción y la interacción. Valoras la conexión externa, compartir experiencias y el dinamismo. No eres superficial, simplemente expresivo."}
                      </p>
                    </div>

                    <div className="bg-white rounded-lg p-4 border-l-4 border-pink-500">
                      <h4 className="font-semibold text-pink-900 mb-2">3. Cómo te perciben los demás</h4>
                      <p className="text-gray-700">
                        {mbtiType.includes("J")
                          ? "Te ven como organizado, decisivo y confiable. Pueden pensar que eres rígido, pero en realidad buscas claridad y eficiencia para tener más control sobre tu vida."
                          : "Te ven como flexible, espontáneo y adaptable. Pueden pensar que eres indeciso, pero en realidad mantienes opciones abiertas para responder mejor a lo que surja."}
                      </p>
                    </div>

                    <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
                      <h4 className="font-semibold text-green-900 mb-2">4. Tu mayor impacto positivo</h4>
                      <p className="text-gray-700">
                        {mbtiType.includes("F")
                          ? "Creas conexión, armonía y pertenencia. Tu empatía hace que las personas se sientan vistas y valoradas. Aportas humanidad a cualquier situación."
                          : "Aportas claridad, objetividad y soluciones racionales. Tu lógica ayuda a tomar mejores decisiones sin dejarse llevar por el drama emocional."}
                      </p>
                    </div>

                    <div className="bg-white rounded-lg p-4 border-l-4 border-orange-500">
                      <h4 className="font-semibold text-orange-900 mb-2">5. Tu patrón bajo estrés</h4>
                      <p className="text-gray-700">
                        {mbtiType.includes("E")
                          ? "Bajo estrés tiendes a hablar más, buscar validación externa y dispersarte en actividades. Tu crecimiento está en aprender a estar en silencio y mirar hacia dentro."
                          : "Bajo estrés tiendes a aislarte, rumiar y desconectarte. Tu crecimiento está en aprender a pedir ayuda y compartir lo que sientes con personas de confianza."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mapa de impacto en 3 áreas */}
                <div className="bg-white rounded-xl p-6 border-2 border-blue-100">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-blue-900">
                    <MapPin className="w-6 h-6" />
                    Mapa de impacto: Dónde te juegas la vida
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg p-5 border border-pink-200">
                      <h4 className="font-bold text-lg mb-3 flex items-center gap-2 text-pink-900">
                        <Heart className="w-5 h-5" />
                        Vida Personal
                      </h4>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <ArrowRight className="w-4 h-4 text-pink-600 mt-0.5 flex-shrink-0" />
                          <span>
                            {mbtiType.includes("F")
                              ? "Tus emociones guían tus decisiones de vida: con quién estar, qué hacer, qué tolerar"
                              : "Tu lógica te protege, pero no dejes que te desconecte de lo que realmente sientes"}
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ArrowRight className="w-4 h-4 text-pink-600 mt-0.5 flex-shrink-0" />
                          <span>
                            {mbtiType.includes("I")
                              ? "Necesitas tiempo a solas para recargar. No es egoísta, es supervivencia"
                              : "Necesitas conexión social para sentirte vivo. No es superficial, es tu naturaleza"}
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-5 border border-blue-200">
                      <h4 className="font-bold text-lg mb-3 flex items-center gap-2 text-blue-900">
                        <Users className="w-5 h-5" />
                        Relaciones
                      </h4>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <ArrowRight className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span>
                            {mbtiType.includes("E")
                              ? "Tiendes a compartir rápido. Asegúrate de también escuchar profundamente a los demás"
                              : "Tiendes a guardarte las cosas. Practica compartir más, aunque te cueste"}
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ArrowRight className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span>
                            {mbtiType.includes("J")
                              ? "Tu necesidad de estructura puede frustrar a tipos más espontáneos. Suelta el control a veces"
                              : "Tu flexibilidad puede frustrar a tipos más estructurados. Comprométete con planes a veces"}
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-5 border border-green-200">
                      <h4 className="font-bold text-lg mb-3 flex items-center gap-2 text-green-900">
                        <Briefcase className="w-5 h-5" />
                        Trabajo
                      </h4>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <ArrowRight className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>
                            {mbtiType.includes("N")
                              ? "Brillas en innovación y visión, pero necesitas a alguien que ejecute los detalles"
                              : "Brillas en ejecución y operaciones, pero necesitas a alguien que piense el futuro"}
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ArrowRight className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>El trabajo es solo UN área de tu vida. No sacrifiques relaciones ni salud por él</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 3 movimientos clave próximos 90 días */}
                <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 rounded-xl p-6 border-2 border-amber-200">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-amber-900">
                    <Trophy className="w-6 h-6" />3 movimientos clave para los próximos 90 días
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-5 border-l-4 border-pink-500">
                      <h4 className="font-bold mb-2 text-pink-900">Movimiento Personal</h4>
                      <p className="text-gray-700 text-sm mb-3">
                        {mbtiType.includes("I")
                          ? "Acepta una invitación social por semana que normally rechazarías. Expande tu zona de confort."
                          : "Dedica 20 minutos diarios a estar solo en silencio. Fortalece tu mundo interno."}
                      </p>
                      <p className="text-xs text-gray-600 italic">
                        Impacto: Mayor equilibrio emocional y autoconocimiento
                      </p>
                    </div>

                    <div className="bg-white rounded-lg p-5 border-l-4 border-blue-500">
                      <h4 className="font-bold mb-2 text-blue-900">Movimiento Relacional</h4>
                      <p className="text-gray-700 text-sm mb-3">
                        {mbtiType.includes("F")
                          ? 'Practica decir "no" a peticiones que no te corresponden. Tus límites son sagrados.'
                          : "Comparte algo vulnerable con alguien cercano una vez por semana. La conexión requiere apertura."}
                      </p>
                      <p className="text-xs text-gray-600 italic">
                        Impacto: Relaciones más auténticas y satisfactorias
                      </p>
                    </div>

                    <div className="bg-white rounded-lg p-5 border-l-4 border-green-500">
                      <h4 className="font-bold mb-2 text-green-900">Movimiento Laboral</h4>
                      <p className="text-gray-700 text-sm mb-3">
                        {mbtiType.includes("N")
                          ? "Completa un proyecto concreto del inicio al fin. La ejecución también importa, no solo las ideas."
                          : "Dedica 1 hora semanal a pensar estrategia y visión. Sal de lo operativo y mira el panorama."}
                      </p>
                      <p className="text-xs text-gray-600 italic">Impacto: Mejor equilibrio entre visión y ejecución</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8 border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Heart className="w-6 h-6 text-purple-600" />
                  Impacto en tu Vida Personal
                </CardTitle>
                <CardDescription>
                  Cómo tu tipo {mbtiType} influye en tus relaciones, bienestar y vida diaria
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2 text-purple-900">
                      <Users className="w-5 h-5" />
                      Relaciones Personales
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {mbtiType.includes("E")
                        ? "Tu extraversión te hace sociable y expresivo. Con tu pareja y familia, asegúrate de dar espacio para escuchar y momentos tranquilos de intimidad."
                        : "Tu introversión te hace reflexivo y profundo. Con tu pareja y familia, comunica tus necesidades de tiempo a solas sin que se sientan rechazados."}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2 text-purple-900">
                      <Home className="w-5 h-5" />
                      Vida Familiar
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {mbtiType.includes("J")
                        ? "Tu preferencia por la estructura ayuda a organizar la vida familiar. Permite también flexibilidad y espontaneidad para momentos de diversión sin plan."
                        : "Tu espontaneidad trae energía al hogar. Complementa con algo de rutina para dar estabilidad, especialmente si hay niños."}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2 text-purple-900">
                      <Heart className="w-5 h-5" />
                      Bienestar Emocional
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {mbtiType.includes("F")
                        ? "Tu sensibilidad emocional es una fortaleza. Aprende a poner límites para no absorber las emociones de otros y proteger tu energía."
                        : "Tu enfoque lógico te protege, pero no olvides conectar con tus propias emociones. La vulnerabilidad también es valentía."}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2 text-purple-900">
                      <Sparkles className="w-5 h-5" />
                      Desarrollo Personal
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {mbtiType.includes("N")
                        ? "Tu visión de futuro inspira, pero no descuides el presente. Practica gratitud por lo que ya tienes y disfruta el momento."
                        : "Tu atención al detalle presente es valiosa. Complementa con visión de futuro para planear la vida que deseas construir."}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border-l-4 border-purple-600">
                  <h3 className="font-semibold text-lg mb-3 text-purple-900">
                    💡 Recuerda: Tu personalidad es para vivir mejor, no solo para trabajar mejor
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Conocer tu tipo MBTI te ayuda a entenderte en tus relaciones personales, a comunicarte mejor con tu
                    pareja, familia y amigos, y a crear una vida alineada con quien realmente eres. El trabajo es
                    secundario.
                  </p>
                </div>
              </CardContent>
            </Card>

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

          {/* Conexiones con Otros Módulos */}
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

          <TabsContent value="plan-90-dias" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Plan de Acción 90 Días - Desarrollo de Tipo MBTI
                </CardTitle>
                <CardDescription>
                  Transforma tu autoconocimiento MBTI en acciones concretas durante los próximos 3 meses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Progress Overview */}
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Progreso Total del Plan</span>
                    <span className="text-sm text-muted-foreground">0/12 semanas completadas</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>

                {/* Mes 1: Autoconocimiento Profundo */}
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="mes-1">
                    <AccordionTrigger className="text-lg font-semibold">
                      <div className="flex items-center gap-2">
                        <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">
                          1
                        </div>
                        Mes 1: Autoconocimiento Profundo de tu Tipo
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <p className="text-muted-foreground">
                        Explora las fortalezas y desafíos únicos de tu tipo {mbtiResult.type || "MBTI"}
                      </p>

                      <div className="grid gap-4">
                        <Card className="border-l-4 border-l-blue-500">
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-2">Semana 1-2: Entender tus Preferencias</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-start gap-2">
                                <Checkbox id="m1s1-1" />
                                <label htmlFor="m1s1-1">
                                  Estudiar en profundidad cada una de tus 4 preferencias (E/I, S/N, T/F, J/P)
                                </label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="m1s1-2" />
                                <label htmlFor="m1s1-2">
                                  Identificar 3 situaciones recientes donde cada preferencia se manifestó
                                </label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="m1s1-3" />
                                <label htmlFor="m1s1-3">
                                  Escribir un diario de reflexión sobre cómo tu tipo afecta tus decisiones
                                </label>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-blue-500">
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-2">Semana 3-4: Fortalezas y Puntos Ciegos</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-start gap-2">
                                <Checkbox id="m1s2-1" />
                                <label htmlFor="m1s2-1">Listar tus 5 principales fortalezas según tu tipo MBTI</label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="m1s2-2" />
                                <label htmlFor="m1s2-2">
                                  Identificar 3 puntos ciegos típicos de tu tipo y cómo te afectan
                                </label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="m1s2-3" />
                                <label htmlFor="m1s2-3">
                                  Pedir feedback a 2 personas cercanas sobre tus comportamientos típicos
                                </label>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
                        <p className="text-sm">
                          <strong>KPI del Mes:</strong> Completar análisis de las 4 preferencias con ejemplos reales
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Mes 2: Desarrollo de Funciones */}
                  <AccordionItem value="mes-2">
                    <AccordionTrigger className="text-lg font-semibold">
                      <div className="flex items-center gap-2">
                        <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">
                          2
                        </div>
                        Mes 2: Desarrollo de Funciones Cognitivas
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <p className="text-muted-foreground">
                        Trabaja en desarrollar tu función inferior y equilibrar tu stack cognitivo
                      </p>

                      <div className="grid gap-4">
                        <Card className="border-l-4 border-l-green-500">
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-2">Semana 5-6: Función Dominante y Auxiliar</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-start gap-2">
                                <Checkbox id="m2s1-1" />
                                <label htmlFor="m2s1-1">
                                  Identificar tu función dominante y cómo la usas diariamente
                                </label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="m2s1-2" />
                                <label htmlFor="m2s1-2">
                                  Practicar conscientemente tu función auxiliar en 3 situaciones
                                </label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="m2s1-3" />
                                <label htmlFor="m2s1-3">Documentar cómo el balance Dom-Aux mejora tus decisiones</label>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-green-500">
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-2">Semana 7-8: Desarrollar la Función Inferior</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-start gap-2">
                                <Checkbox id="m2s2-1" />
                                <label htmlFor="m2s2-1">
                                  Identificar tu función inferior y situaciones donde te falla
                                </label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="m2s2-2" />
                                <label htmlFor="m2s2-2">
                                  Crear 3 ejercicios específicos para fortalecer tu función inferior
                                </label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="m2s2-3" />
                                <label htmlFor="m2s2-3">
                                  Practicar actividades que requieran tu función inferior (15 min/día)
                                </label>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg">
                        <p className="text-sm">
                          <strong>KPI del Mes:</strong> Documentar 5 mejoras en el uso de tu función inferior
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Mes 3: Integración y Relaciones */}
                  <AccordionItem value="mes-3">
                    <AccordionTrigger className="text-lg font-semibold">
                      <div className="flex items-center gap-2">
                        <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">
                          3
                        </div>
                        Mes 3: Integración y Mejora de Relaciones
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <p className="text-muted-foreground">
                        Aplica tu autoconocimiento para mejorar relaciones y comunicación
                      </p>

                      <div className="grid gap-4">
                        <Card className="border-l-4 border-l-purple-500">
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-2">Semana 9-10: Comunicación según Tipos</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-start gap-2">
                                <Checkbox id="m3s1-1" />
                                <label htmlFor="m3s1-1">
                                  Identificar los tipos MBTI de 5 personas importantes en tu vida
                                </label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="m3s1-2" />
                                <label htmlFor="m3s1-2">Adaptar tu comunicación según el tipo de cada persona</label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="m3s1-3" />
                                <label htmlFor="m3s1-3">
                                  Practicar escucha activa enfocándote en preferencias opuestas
                                </label>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-purple-500">
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-2">Semana 11-12: Integración Total</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-start gap-2">
                                <Checkbox id="m3s2-1" />
                                <label htmlFor="m3s2-1">Crear un plan de carrera alineado con tu tipo MBTI</label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="m3s2-2" />
                                <label htmlFor="m3s2-2">
                                  Diseñar tu ambiente ideal de trabajo según tus preferencias
                                </label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="m3s2-3" />
                                <label htmlFor="m3s2-3">
                                  Escribir tu manifiesto personal integrando todos los aprendizajes
                                </label>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="bg-purple-50 dark:bg-purple-950/20 p-3 rounded-lg">
                        <p className="text-sm">
                          <strong>KPI del Mes:</strong> Completar manifiesto personal y plan de carrera MBTI-aligned
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="coach" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Habla con tu Coach IA</CardTitle>
                <CardDescription>Sofia y Dani están aquí para ayudarte a entender mejor tu tipo MBTI</CardDescription>
              </CardHeader>
              <CardContent>
                <EnhancedCoachFlow
                  testType="MBTI"
                  testResults={{
                    type: mbtiResult.type,
                    e_score: mbtiResult.e_score,
                    i_score: mbtiResult.i_score,
                    s_score: mbtiResult.s_score,
                    n_score: mbtiResult.n_score,
                    t_score: mbtiResult.t_score,
                    f_score: mbtiResult.f_score,
                    j_score: mbtiResult.j_score,
                    p_score: mbtiResult.p_score,
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

          <TabsContent value="biblioteca" className="space-y-6">
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <BookOpen className="w-7 h-7 text-blue-600" />
                  Biblioteca DTC Recomendada para {mbtiType}
                </CardTitle>
                <CardDescription className="text-base">
                  Recursos específicos para tu tipo de personalidad con mini-desafíos aplicables
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-blue-100 border-b-2 border-blue-200">
                        <th className="text-left p-4 font-bold text-blue-900">Área de Desarrollo</th>
                        <th className="text-left p-4 font-bold text-blue-900">Recurso Recomendado</th>
                        <th className="text-left p-4 font-bold text-blue-900">Por qué es clave para ti</th>
                        <th className="text-left p-4 font-bold text-blue-900">Mini-desafío (7 días)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr className="hover:bg-blue-50 transition-colors">
                        <td className="p-4">
                          <div className="font-semibold text-gray-900">Autoconocimiento profundo</div>
                          <div className="text-sm text-gray-600">Entender por qué haces lo que haces</div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-blue-900">Libro: "Gifts Differing"</div>
                          <div className="text-sm text-gray-600">Por Isabel Briggs Myers</div>
                        </td>
                        <td className="p-4 text-sm text-gray-700">
                          Explica a fondo tu tipo {mbtiType}: por qué piensas así, tus puntos ciegos y cómo crecer sin
                          perder tu esencia
                        </td>
                        <td className="p-4 text-sm">
                          <div className="bg-amber-50 rounded p-3 border-l-4 border-amber-400">
                            Lee el capítulo de tu tipo y anota 3 comportamientos tuyos que ahora entiendes mejor
                          </div>
                        </td>
                      </tr>

                      <tr className="hover:bg-blue-50 transition-colors">
                        <td className="p-4">
                          <div className="font-semibold text-gray-900">
                            {mbtiType.includes("I") ? "Comunicación asertiva" : "Escucha profunda"}
                          </div>
                          <div className="text-sm text-gray-600">
                            {mbtiType.includes("I") ? "Expresar tus ideas con claridad" : "Dar espacio a los demás"}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-blue-900">
                            {mbtiType.includes("I")
                              ? 'Libro: "Quiet" de Susan Cain'
                              : 'Libro: "El arte de la comunicación consciente"'}
                          </div>
                          <div className="text-sm text-gray-600">Comunicación efectiva</div>
                        </td>
                        <td className="p-4 text-sm text-gray-700">
                          {mbtiType.includes("I")
                            ? "Te enseña a valorar tu introversión y comunicarte sin forzarte a ser extrovertido"
                            : "Te ayuda a frenar, escuchar de verdad y no monopolizar conversaciones"}
                        </td>
                        <td className="p-4 text-sm">
                          <div className="bg-amber-50 rounded p-3 border-l-4 border-amber-400">
                            {mbtiType.includes("I")
                              ? "En 3 reuniones esta semana, comparte tu opinión aunque no te la pidan"
                              : "En 3 conversaciones esta semana, haz 3 preguntas antes de dar tu opinión"}
                          </div>
                        </td>
                      </tr>

                      <tr className="hover:bg-blue-50 transition-colors">
                        <td className="p-4">
                          <div className="font-semibold text-gray-900">Relaciones personales</div>
                          <div className="text-sm text-gray-600">Entender y conectar con otros tipos</div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-blue-900">
                            Curso: "MBTI en relaciones" (Udemy o Coursera)
                          </div>
                          <div className="text-sm text-gray-600">Aplicación práctica</div>
                        </td>
                        <td className="p-4 text-sm text-gray-700">
                          Te explica cómo tu {mbtiType} se relaciona con otros tipos, qué conflictos son típicos y cómo
                          resolverlos con pareja, familia y amigos
                        </td>
                        <td className="p-4 text-sm">
                          <div className="bg-amber-50 rounded p-3 border-l-4 border-amber-400">
                            Identifica el tipo MBTI de 2 personas cercanas y observa cómo sus diferencias generan
                            fricción
                          </div>
                        </td>
                      </tr>

                      <tr className="hover:bg-blue-50 transition-colors">
                        <td className="p-4">
                          <div className="font-semibold text-gray-900">
                            {mbtiType.includes("N") ? "Ejecución práctica" : "Pensamiento estratégico"}
                          </div>
                          <div className="text-sm text-gray-600">
                            {mbtiType.includes("N") ? "Bajar ideas a tierra" : "Ver el panorama completo"}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-blue-900">
                            {mbtiType.includes("N")
                              ? 'Libro: "Getting Things Done" de David Allen'
                              : 'Libro: "Thinking, Fast and Slow" de Daniel Kahneman'}
                          </div>
                          <div className="text-sm text-gray-600">Productividad y pensamiento</div>
                        </td>
                        <td className="p-4 text-sm text-gray-700">
                          {mbtiType.includes("N")
                            ? "Como intuitivo, tiendes a tener muchas ideas. Este libro te ayuda a organizarlas y ejecutarlas sin perderte"
                            : "Como sensorial, tiendes a lo concreto. Este libro te ayuda a pensar en grande y anticipar futuros posibles"}
                        </td>
                        <td className="p-4 text-sm">
                          <div className="bg-amber-50 rounded p-3 border-l-4 border-amber-400">
                            {mbtiType.includes("N")
                              ? "Elige UNA idea que llevas meses pensando y define los 3 primeros pasos concretos"
                              : "Dedica 30 min a imaginar cómo podría verse tu vida en 5 años si todo saliera bien"}
                          </div>
                        </td>
                      </tr>

                      <tr className="hover:bg-blue-50 transition-colors">
                        <td className="p-4">
                          <div className="font-semibold text-gray-900">Gestión emocional</div>
                          <div className="text-sm text-gray-600">
                            {mbtiType.includes("F") ? "Poner límites sanos" : "Conectar con emociones"}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-blue-900">
                            {mbtiType.includes("F")
                              ? 'Libro: "Boundaries" de Henry Cloud'
                              : 'Libro: "Permission to Feel" de Marc Brackett'}
                          </div>
                          <div className="text-sm text-gray-600">Inteligencia emocional</div>
                        </td>
                        <td className="p-4 text-sm text-gray-700">
                          {mbtiType.includes("F")
                            ? "Como feeling type, tiendes a absorber emociones ajenas. Aprende a proteger tu energía emocional"
                            : "Como thinking type, puedes desconectarte de tus emociones. Aprende a reconocerlas y nombrarlas"}
                        </td>
                        <td className="p-4 text-sm">
                          <div className="bg-amber-50 rounded p-3 border-l-4 border-amber-400">
                            {mbtiType.includes("F")
                              ? 'Di "no" a una petición esta semana sin dar explicaciones excesivas ni sentirte culpable'
                              : "Al final del día durante 7 días, nombra 3 emociones que sentiste y por qué"}
                          </div>
                        </td>
                      </tr>

                      <tr className="hover:bg-blue-50 transition-colors">
                        <td className="p-4">
                          <div className="font-semibold text-gray-900">Desarrollo profesional</div>
                          <div className="text-sm text-gray-600">Aprovechar tus fortalezas en el trabajo</div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-blue-900">Libro: "Do What You Are" de Paul Tieger</div>
                          <div className="text-sm text-gray-600">Carrera y MBTI</div>
                        </td>
                        <td className="p-4 text-sm text-gray-700">
                          Explica qué carreras y roles son naturales para {mbtiType}, cómo aprovechar tus fortalezas y
                          qué ambientes laborales drenan tu energía
                        </td>
                        <td className="p-4 text-sm">
                          <div className="bg-amber-50 rounded p-3 border-l-4 border-amber-400">
                            Escribe 3 aspectos de tu trabajo actual que drenan tu energía y 3 que te energizan. ¿Hay
                            patrón?
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-blue-900">
                    <Lightbulb className="w-5 h-5" />
                    Cómo usar estos recursos
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Prioriza por dolor:</strong> Si tienes problemas de comunicación, empieza por ese
                        recurso. Si te cuesta ejecutar ideas, ve ahí primero.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>No acumules:</strong> Mejor leer 1 libro y aplicarlo que comprar 10 y no hacer nada. Los
                        mini-desafíos son clave.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Comparte lo aprendido:</strong> Explica a alguien cercano un insight de cada recurso.
                        Enseñar es la mejor forma de aprender.
                      </span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
