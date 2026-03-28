"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/components/session-wrapper"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import {
  BookOpen,
  Target,
  Zap,
  Brain,
  Heart,
  Users,
  Briefcase,
  TrendingUp,
  CheckCircle,
  Clock,
  Star,
  ArrowRight,
  Sparkles,
  Filter,
  BarChart3,
} from "lucide-react"

// Definición de áreas de desarrollo según el Blueprint
const developmentAreas = [
  {
    id: "autoconocimiento",
    name: "Autoconocimiento",
    icon: Brain,
    color: "bg-purple-500",
    description: "Comprende tu personalidad, valores y motivaciones",
    relatedTests: ["disc", "mbti", "big-five"],
  },
  {
    id: "inteligencia-emocional",
    name: "Inteligencia Emocional",
    icon: Heart,
    color: "bg-red-500",
    description: "Gestiona tus emociones y relaciones interpersonales",
    relatedTests: ["emotional-intelligence", "soft-skills"],
  },
  {
    id: "liderazgo",
    name: "Liderazgo",
    icon: Users,
    color: "bg-blue-500",
    description: "Desarrolla habilidades para liderar equipos",
    relatedTests: ["disc", "soft-skills"],
  },
  {
    id: "carrera",
    name: "Desarrollo de Carrera",
    icon: Briefcase,
    color: "bg-green-500",
    description: "Planifica y acelera tu trayectoria profesional",
    relatedTests: ["riasec", "soft-skills"],
  },
  {
    id: "productividad",
    name: "Productividad",
    icon: TrendingUp,
    color: "bg-orange-500",
    description: "Optimiza tu tiempo y resultados",
    relatedTests: ["disc", "big-five"],
  },
  {
    id: "comunicacion",
    name: "Comunicación",
    icon: Zap,
    color: "bg-yellow-500",
    description: "Mejora tu expresión verbal y escrita",
    relatedTests: ["disc", "soft-skills", "emotional-intelligence"],
  },
]

// Recursos por área (Libro + Mini Reto) según Blueprint B3
const resourcesByArea: Record<string, { books: any[]; challenges: any[] }> = {
  autoconocimiento: {
    books: [
      {
        id: "ikigai",
        title: "Ikigai: Los secretos de Japón para una vida larga y feliz",
        author: "Héctor García & Francesc Miralles",
        slug: "ikigai",
        relevance: 95,
        forProfiles: ["I", "S", "INFP", "INFJ"],
        keyInsight:
          "Encuentra tu propósito conectando lo que amas, lo que necesita el mundo, lo que puedes aportar y lo que te pagan",
      },
      {
        id: "el-poder-del-ahora",
        title: "El Poder del Ahora",
        author: "Eckhart Tolle",
        slug: "el-poder-del-ahora",
        relevance: 90,
        forProfiles: ["S", "C", "ISFJ", "ISTJ"],
        keyInsight: "La presencia consciente es la clave para el autoconocimiento profundo",
      },
      {
        id: "los-7-habitos",
        title: "Los 7 Hábitos de la Gente Altamente Efectiva",
        author: "Stephen Covey",
        slug: "los-7-habitos",
        relevance: 92,
        forProfiles: ["D", "C", "ENTJ", "INTJ"],
        keyInsight: "Comienza con el fin en mente y trabaja desde adentro hacia afuera",
      },
    ],
    challenges: [
      {
        id: "diario-reflexion",
        title: "Diario de Reflexión Diaria",
        duration: "7 días",
        description: "Escribe 3 cosas que aprendiste sobre ti mismo cada día",
        difficulty: "Fácil",
        xp: 50,
      },
      {
        id: "mapa-valores",
        title: "Mapa de Valores Personales",
        duration: "3 días",
        description: "Identifica tus 5 valores fundamentales y cómo se reflejan en tu vida",
        difficulty: "Medio",
        xp: 75,
      },
    ],
  },
  "inteligencia-emocional": {
    books: [
      {
        id: "inteligencia-emocional-goleman",
        title: "Inteligencia Emocional",
        author: "Daniel Goleman",
        slug: "inteligencia-emocional",
        relevance: 98,
        forProfiles: ["I", "S", "ENFJ", "ESFJ"],
        keyInsight: "La IE es más importante que el IQ para el éxito personal y profesional",
      },
      {
        id: "el-arte-de-amar",
        title: "El Arte de Amar",
        author: "Erich Fromm",
        slug: "el-arte-de-amar",
        relevance: 85,
        forProfiles: ["I", "S", "INFP", "ENFP"],
        keyInsight: "El amor es un arte que requiere conocimiento y esfuerzo",
      },
      {
        id: "comunicacion-no-violenta",
        title: "Comunicación No Violenta",
        author: "Marshall Rosenberg",
        slug: "comunicacion-no-violenta",
        relevance: 90,
        forProfiles: ["S", "I", "ISFJ", "INFJ"],
        keyInsight: "Expresa necesidades sin juzgar para conectar emocionalmente",
      },
    ],
    challenges: [
      {
        id: "check-emocional",
        title: "Check-in Emocional",
        duration: "14 días",
        description: "Registra tu estado emocional 3 veces al día y qué lo provocó",
        difficulty: "Fácil",
        xp: 70,
      },
      {
        id: "practica-empatia",
        title: "Práctica de Empatía Activa",
        duration: "7 días",
        description: "Escucha sin interrumpir ni dar consejos en 3 conversaciones diarias",
        difficulty: "Medio",
        xp: 100,
      },
    ],
  },
  liderazgo: {
    books: [
      {
        id: "lideres-comen-ultimo",
        title: "Los Líderes Comen al Último",
        author: "Simon Sinek",
        slug: "los-lideres-comen-al-ultimo",
        relevance: 95,
        forProfiles: ["D", "I", "ENTJ", "ENFJ"],
        keyInsight: "El liderazgo es servicio: primero las personas, después los resultados",
      },
      {
        id: "de-cero-a-uno",
        title: "De Cero a Uno",
        author: "Peter Thiel",
        slug: "de-cero-a-uno",
        relevance: 88,
        forProfiles: ["D", "C", "ENTJ", "INTJ"],
        keyInsight: "Los grandes líderes crean algo nuevo, no copian lo existente",
      },
      {
        id: "extreme-ownership",
        title: "Extreme Ownership",
        author: "Jocko Willink",
        slug: "extreme-ownership",
        relevance: 92,
        forProfiles: ["D", "ESTJ", "ENTJ"],
        keyInsight: "Los líderes asumen responsabilidad total por todo",
      },
    ],
    challenges: [
      {
        id: "feedback-360",
        title: "Feedback 360°",
        duration: "5 días",
        description: "Pide retroalimentación honesta a 3 colegas sobre tu estilo de liderazgo",
        difficulty: "Difícil",
        xp: 150,
      },
      {
        id: "delegar-tarea",
        title: "Delegación Efectiva",
        duration: "7 días",
        description: "Delega una tarea importante y da seguimiento sin micromanagear",
        difficulty: "Medio",
        xp: 100,
      },
    ],
  },
  carrera: {
    books: [
      {
        id: "disena-tu-vida",
        title: "Diseña Tu Vida",
        author: "Bill Burnett & Dave Evans",
        slug: "disena-tu-vida",
        relevance: 96,
        forProfiles: ["R", "I", "A", "ENFP", "ENTP"],
        keyInsight: "Aplica design thinking a tu carrera para crear múltiples opciones",
      },
      {
        id: "la-semana-laboral-4-horas",
        title: "La Semana Laboral de 4 Horas",
        author: "Tim Ferriss",
        slug: "la-semana-laboral-4-horas",
        relevance: 85,
        forProfiles: ["D", "E", "ENTP", "ESTP"],
        keyInsight: "Automatiza y elimina para maximizar tu impacto con menos esfuerzo",
      },
      {
        id: "so-good-they-cant-ignore-you",
        title: "Tan Bueno Que No Puedan Ignorarte",
        author: "Cal Newport",
        slug: "so-good-they-cant-ignore-you",
        relevance: 93,
        forProfiles: ["C", "I", "INTJ", "ISTJ"],
        keyInsight: "Las habilidades raras y valiosas generan las mejores oportunidades",
      },
    ],
    challenges: [
      {
        id: "networking-semanal",
        title: "Networking Estratégico",
        duration: "30 días",
        description: "Conecta con 2 profesionales de tu industria cada semana",
        difficulty: "Medio",
        xp: 120,
      },
      {
        id: "proyecto-portfolio",
        title: "Proyecto para Portfolio",
        duration: "14 días",
        description: "Crea un proyecto que demuestre tus habilidades principales",
        difficulty: "Difícil",
        xp: 200,
      },
    ],
  },
  productividad: {
    books: [
      {
        id: "deep-work",
        title: "Deep Work: Trabajo Profundo",
        author: "Cal Newport",
        slug: "deep-work",
        relevance: 97,
        forProfiles: ["C", "S", "INTJ", "ISTJ"],
        keyInsight: "El trabajo profundo sin distracciones es la habilidad más valiosa",
      },
      {
        id: "atomic-habits",
        title: "Hábitos Atómicos",
        author: "James Clear",
        slug: "atomic-habits",
        relevance: 95,
        forProfiles: ["S", "C", "ISFJ", "ISTJ"],
        keyInsight: "Pequeños cambios del 1% compuestos generan resultados extraordinarios",
      },
      {
        id: "getting-things-done",
        title: "Getting Things Done",
        author: "David Allen",
        slug: "getting-things-done",
        relevance: 90,
        forProfiles: ["D", "C", "ESTJ", "ENTJ"],
        keyInsight: "Captura todo fuera de tu mente para liberar energía mental",
      },
    ],
    challenges: [
      {
        id: "pomodoro-semana",
        title: "Semana Pomodoro",
        duration: "7 días",
        description: "Trabaja en bloques de 25 min con descansos de 5 min, registra tu productividad",
        difficulty: "Fácil",
        xp: 60,
      },
      {
        id: "morning-routine",
        title: "Rutina Matutina Óptima",
        duration: "21 días",
        description: "Diseña y ejecuta una rutina matutina de 1 hora sin distracciones",
        difficulty: "Medio",
        xp: 150,
      },
    ],
  },
  comunicacion: {
    books: [
      {
        id: "como-ganar-amigos",
        title: "Cómo Ganar Amigos e Influir sobre las Personas",
        author: "Dale Carnegie",
        slug: "como-ganar-amigos",
        relevance: 94,
        forProfiles: ["I", "S", "ESFJ", "ENFJ"],
        keyInsight: "El interés genuino en los demás es la base de toda influencia",
      },
      {
        id: "crucial-conversations",
        title: "Conversaciones Cruciales",
        author: "Kerry Patterson",
        slug: "crucial-conversations",
        relevance: 92,
        forProfiles: ["D", "C", "ENTJ", "ESTJ"],
        keyInsight: "Las conversaciones difíciles bien manejadas transforman relaciones",
      },
      {
        id: "nunca-dividas-la-diferencia",
        title: "Nunca Dividas la Diferencia",
        author: "Chris Voss",
        slug: "never-split-the-difference",
        relevance: 88,
        forProfiles: ["D", "I", "ENTP", "ESTP"],
        keyInsight: "La empatía táctica es más poderosa que la lógica en negociaciones",
      },
    ],
    challenges: [
      {
        id: "escucha-activa",
        title: "Maestría en Escucha Activa",
        duration: "7 días",
        description: "Practica escuchar para entender, no para responder, en todas las conversaciones",
        difficulty: "Medio",
        xp: 80,
      },
      {
        id: "presentacion-5min",
        title: "Elevator Pitch Perfecto",
        duration: "5 días",
        description: "Prepara y practica una presentación de 5 minutos sobre tu propuesta de valor",
        difficulty: "Medio",
        xp: 100,
      },
    ],
  },
}

interface TestResult {
  test_type: string
  results: any
  overall_score?: number
}

export default function RecursosClient() {
  const { user } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [selectedArea, setSelectedArea] = useState<string>("all")
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([])
  const [userProfile, setUserProfile] = useState<any>(null)

  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.email) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch("/api/test-results")
        if (response.ok) {
          const data = await response.json()
          const results = Array.isArray(data) ? data : [data]
          setTestResults(results)

          // Extraer perfil dominante
          const discResult = results.find((r: any) => r.test_type === "disc")
          if (discResult?.results?.dominantType) {
            setUserProfile({
              discType: discResult.results.dominantType,
              scores: discResult.results.scores,
            })
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [user?.email])

  // Calcular recomendaciones personalizadas basadas en tests
  const getPersonalizedRecommendations = () => {
    const recommendations: any[] = []

    developmentAreas.forEach((area) => {
      const resources = resourcesByArea[area.id]
      if (!resources) return

      // Calcular relevancia basada en tests completados
      let relevanceScore = 50 // Base score

      // Verificar si el usuario tiene tests relacionados
      area.relatedTests.forEach((testType) => {
        const hasTest = testResults.some(
          (r) => r.test_type?.toLowerCase().includes(testType) || r.test_type === testType,
        )
        if (hasTest) {
          relevanceScore += 15
        }
      })

      // Ajustar por perfil DISC si existe
      if (userProfile?.discType) {
        resources.books.forEach((book) => {
          if (book.forProfiles?.includes(userProfile.discType)) {
            relevanceScore += 10
          }
        })
      }

      recommendations.push({
        area,
        resources,
        relevanceScore: Math.min(relevanceScore, 100),
      })
    })

    return recommendations.sort((a, b) => b.relevanceScore - a.relevanceScore)
  }

  const recommendations = getPersonalizedRecommendations()

  const toggleChallenge = (challengeId: string) => {
    setCompletedChallenges((prev) =>
      prev.includes(challengeId) ? prev.filter((id) => id !== challengeId) : [...prev, challengeId],
    )
  }

  const filteredRecommendations =
    selectedArea === "all" ? recommendations : recommendations.filter((r) => r.area.id === selectedArea)

  const totalXP = Object.values(resourcesByArea)
    .flatMap((r) => r.challenges)
    .filter((c) => completedChallenges.includes(c.id))
    .reduce((sum, c) => sum + c.xp, 0)

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Biblioteca de Recursos DTC</h1>
        </div>
        <p className="text-gray-600">
          Motor de recomendación personalizado basado en tus resultados de tests, metas y preferencias
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{testResults.length}</p>
                <p className="text-sm text-gray-600">Tests Completados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Star className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{totalXP}</p>
                <p className="text-sm text-gray-600">XP Ganado</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{completedChallenges.length}</p>
                <p className="text-sm text-gray-600">Retos Completados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{developmentAreas.length}</p>
                <p className="text-sm text-gray-600">Áreas de Desarrollo</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Personalization Banner */}
      {testResults.length === 0 && (
        <Card className="mb-8 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Sparkles className="h-10 w-10 text-blue-600" />
                <div>
                  <h3 className="font-bold text-lg">Personaliza tus Recomendaciones</h3>
                  <p className="text-gray-600">
                    Completa al menos un test para recibir recomendaciones de recursos basadas en tu perfil único
                  </p>
                </div>
              </div>
              <Button onClick={() => router.push("/test")} className="bg-blue-600 hover:bg-blue-700">
                Hacer Tests
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Area Filter */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-gray-600" />
          <span className="font-medium">Filtrar por Área:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedArea === "all" ? "default" : "outline"}
            className="cursor-pointer hover:bg-blue-100 px-4 py-2"
            onClick={() => setSelectedArea("all")}
          >
            Todas las Áreas
          </Badge>
          {developmentAreas.map((area) => (
            <Badge
              key={area.id}
              variant={selectedArea === area.id ? "default" : "outline"}
              className="cursor-pointer hover:bg-blue-100 px-4 py-2"
              onClick={() => setSelectedArea(area.id)}
            >
              <area.icon className="h-4 w-4 mr-1" />
              {area.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* Resources by Area */}
      <div className="space-y-8">
        {filteredRecommendations.map(({ area, resources, relevanceScore }) => (
          <Card key={area.id} className="overflow-hidden">
            <CardHeader className={`${area.color} text-white`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <area.icon className="h-8 w-8" />
                  <div>
                    <CardTitle className="text-xl">{area.name}</CardTitle>
                    <CardDescription className="text-white/90">{area.description}</CardDescription>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="bg-white/20 text-white border-0">
                    {relevanceScore}% relevante para ti
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              <Tabs defaultValue="books">
                <TabsList className="mb-4">
                  <TabsTrigger value="books">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Libros Recomendados
                  </TabsTrigger>
                  <TabsTrigger value="challenges">
                    <Target className="h-4 w-4 mr-2" />
                    Mini Retos
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="books">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {resources.books.map((book: any) => (
                      <Card key={book.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start mb-2">
                            <Badge variant="outline" className="text-xs">
                              {book.relevance}% match
                            </Badge>
                          </div>
                          <CardTitle className="text-base leading-tight">{book.title}</CardTitle>
                          <p className="text-sm text-gray-600">{book.author}</p>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-700 mb-4 italic">"{book.keyInsight}"</p>
                          <Button className="w-full" size="sm" onClick={() => router.push(`/biblioteca/${book.slug}`)}>
                            <BookOpen className="h-4 w-4 mr-2" />
                            Leer Libro
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="challenges">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {resources.challenges.map((challenge: any) => {
                      const isCompleted = completedChallenges.includes(challenge.id)
                      return (
                        <Card
                          key={challenge.id}
                          className={`transition-all ${isCompleted ? "bg-green-50 border-green-200" : ""}`}
                        >
                          <CardContent className="pt-6">
                            <div className="flex items-start gap-4">
                              <Checkbox
                                checked={isCompleted}
                                onCheckedChange={() => toggleChallenge(challenge.id)}
                                className="mt-1"
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className={`font-bold ${isCompleted ? "line-through text-gray-500" : ""}`}>
                                    {challenge.title}
                                  </h4>
                                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                    +{challenge.xp} XP
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {challenge.duration}
                                  </span>
                                  <Badge
                                    variant="outline"
                                    className={
                                      challenge.difficulty === "Fácil"
                                        ? "border-green-500 text-green-600"
                                        : challenge.difficulty === "Medio"
                                          ? "border-yellow-500 text-yellow-600"
                                          : "border-red-500 text-red-600"
                                    }
                                  >
                                    {challenge.difficulty}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CTA Final */}
      <Card className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Continua tu Desarrollo</h3>
              <p className="text-white/90">
                Habla con el Coach IA para obtener un plan de acción personalizado basado en tus recursos favoritos
              </p>
            </div>
            <Button variant="secondary" onClick={() => router.push("/ai-coach")}>
              <Brain className="h-4 w-4 mr-2" />
              Hablar con Coach IA
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
