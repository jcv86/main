"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Target,
  Plus,
  TrendingUp,
  CheckCircle2,
  Clock,
  Brain,
  Briefcase,
  Heart,
  Sparkles,
  ArrowRight,
  Edit,
  BookOpen,
  Lightbulb,
  BarChart3,
  Star,
  AlertCircle,
} from "lucide-react"
import { useSession } from "@/components/session-wrapper"

// Tipos
interface MetaSMART {
  id: string
  nombre: string
  tipo: "personal" | "laboral" | "mixto"
  origen: string // Qué test o área la originó
  motivoProfundo: string // Para qué
  especifica: string
  medible: string
  alcanzable: string
  relevante: string
  temporal: string
  indicadores30: string[]
  indicadores60: string[]
  indicadores90: string[]
  habitos: string[]
  recursos: string[]
  fechaCreacion: string
  fechaRevision: string
  progreso: number
  estado: "activa" | "completada" | "pausada" | "abandonada"
  notas: string
}

// Datos de ejemplo de metas basadas en tests
const metasEjemplo: MetaSMART[] = [
  {
    id: "1",
    nombre: "Mejorar comunicación asertiva",
    tipo: "mixto",
    origen: "DISC - Perfil S alto",
    motivoProfundo: "Para expresar mis ideas con confianza y establecer límites saludables en el trabajo y en casa",
    especifica: "Practicar comunicación asertiva en reuniones de trabajo y conversaciones difíciles",
    medible: "Participar activamente en al menos 3 reuniones semanales y tener 2 conversaciones difíciles al mes",
    alcanzable: "Empezar con situaciones de bajo riesgo e ir aumentando gradualmente",
    relevante: "Alineado con mi perfil DISC que indica tendencia a evitar conflictos",
    temporal: "90 días con revisiones mensuales",
    indicadores30: [
      "Participar en 1 reunión semanal con al menos 1 aporte",
      "Leer 'Comunicación No Violenta' de Marshall Rosenberg",
      "Practicar técnica DESC 3 veces",
    ],
    indicadores60: [
      "Participar activamente en 2-3 reuniones semanales",
      "Tener 1 conversación difícil aplicando técnicas aprendidas",
      "Recibir feedback de un colega de confianza",
    ],
    indicadores90: [
      "Comunicación asertiva como hábito natural",
      "Resolver al menos 2 conflictos de manera constructiva",
      "Ser reconocido por mejorar la comunicación del equipo",
    ],
    habitos: [
      "Preparar 1 punto para cada reunión",
      "Practicar frases asertivas cada mañana",
      "Reflexionar cada noche sobre situaciones del día",
    ],
    recursos: [
      "Libro: Comunicación No Violenta",
      "Test IE - Dimensión Habilidades Sociales",
      "Coach IA Sofia - Simulaciones de conversaciones",
    ],
    fechaCreacion: "2024-01-15",
    fechaRevision: "2024-02-15",
    progreso: 45,
    estado: "activa",
    notas: "Semana 3: He logrado participar en 2 reuniones. Aún me cuesta iniciar conversaciones difíciles.",
  },
  {
    id: "2",
    nombre: "Desarrollar liderazgo situacional",
    tipo: "laboral",
    origen: "Big Five - Alta Responsabilidad + MBTI ENTJ",
    motivoProfundo: "Para guiar equipos efectivamente y avanzar hacia posiciones de mayor impacto",
    especifica: "Aplicar diferentes estilos de liderazgo según la madurez del equipo y la situación",
    medible: "Liderar 2 proyectos pequeños y recibir feedback 360° de al menos 5 personas",
    alcanzable: "Aprovechar mi perfil natural de organización y visión estratégica",
    relevante: "Directamente conectado con mi meta de carrera de ser gerente en 2 años",
    temporal: "90 días con hitos mensuales",
    indicadores30: [
      "Completar curso de liderazgo situacional",
      "Identificar estilos de liderazgo actuales",
      "Mapear madurez de cada miembro del equipo",
    ],
    indicadores60: [
      "Liderar primer proyecto pequeño",
      "Aplicar al menos 2 estilos de liderazgo diferentes",
      "Recibir primer feedback informal",
    ],
    indicadores90: [
      "Completar segundo proyecto con éxito",
      "Feedback 360° con promedio > 4/5",
      "Plan de desarrollo para próximos 6 meses",
    ],
    habitos: [
      "Reunión 1:1 semanal con cada miembro del equipo",
      "Reflexión diaria de 5 min sobre decisiones de liderazgo",
      "Lectura de 15 min diarios sobre liderazgo",
    ],
    recursos: [
      "Libro: El Líder que No Tenía Cargo",
      "Test DISC - Dimensión D (Dominio)",
      "Módulo de Liderazgo en Soft Skills",
    ],
    fechaCreacion: "2024-01-20",
    fechaRevision: "2024-02-20",
    progreso: 30,
    estado: "activa",
    notas: "Iniciando el curso. El equipo ha respondido bien a las reuniones 1:1.",
  },
  {
    id: "3",
    nombre: "Equilibrio vida-trabajo",
    tipo: "personal",
    origen: "IE - Autorregulación baja + RIASEC Social",
    motivoProfundo: "Para tener energía sostenible y estar presente para mi familia",
    especifica: "Establecer límites claros entre trabajo y vida personal",
    medible: "Terminar trabajo a las 18:00 al menos 4 días/semana, dedicar 2h diarias a familia",
    alcanzable: "Reorganizar prioridades y delegar tareas no esenciales",
    relevante: "Mi perfil RIASEC Social indica que las relaciones son mi mayor fuente de satisfacción",
    temporal: "90 días con ajustes cada 2 semanas",
    indicadores30: [
      "Definir horario de trabajo fijo",
      "Identificar 3 tareas delegables",
      "Establecer ritual de desconexión",
    ],
    indicadores60: [
      "Cumplir horario 3 días/semana",
      "Delegar al menos 2 tareas",
      "Actividad familiar semanal establecida",
    ],
    indicadores90: ["Cumplir horario 4+ días/semana", "Reducir estrés laboral en 30%", "Feedback positivo de familia"],
    habitos: [
      "Alarma de cierre a las 17:45",
      "No revisar email después de las 19:00",
      "Cena en familia sin dispositivos",
    ],
    recursos: [
      "Libro: Los 7 Hábitos de la Gente Altamente Efectiva",
      "Test IE - Dimensión Autorregulación",
      "Coach IA Dani - Gestión del estrés",
    ],
    fechaCreacion: "2024-02-01",
    fechaRevision: "2024-03-01",
    progreso: 60,
    estado: "activa",
    notas: "Gran progreso esta semana. La familia ha notado el cambio positivo.",
  },
]

// Plantillas de metas basadas en tests
const plantillasMetas = {
  DISC: [
    {
      nombre: "Desarrollar flexibilidad comunicacional",
      tipo: "mixto" as const,
      motivoProfundo: "Para conectar mejor con diferentes tipos de personas",
    },
    {
      nombre: "Fortalecer toma de decisiones",
      tipo: "laboral" as const,
      motivoProfundo: "Para liderar con mayor confianza",
    },
  ],
  MBTI: [
    {
      nombre: "Equilibrar intuición con datos",
      tipo: "laboral" as const,
      motivoProfundo: "Para tomar decisiones más completas",
    },
    {
      nombre: "Desarrollar mi función inferior",
      tipo: "personal" as const,
      motivoProfundo: "Para crecer como persona integral",
    },
  ],
  "Big Five": [
    {
      nombre: "Aumentar apertura a experiencias",
      tipo: "personal" as const,
      motivoProfundo: "Para ampliar mi perspectiva y creatividad",
    },
    {
      nombre: "Fortalecer estabilidad emocional",
      tipo: "mixto" as const,
      motivoProfundo: "Para manejar mejor el estrés",
    },
  ],
  IE: [
    {
      nombre: "Mejorar autoconciencia emocional",
      tipo: "personal" as const,
      motivoProfundo: "Para entender mis reacciones y patrones",
    },
    {
      nombre: "Desarrollar empatía activa",
      tipo: "mixto" as const,
      motivoProfundo: "Para construir relaciones más profundas",
    },
  ],
  RIASEC: [
    {
      nombre: "Explorar carrera alineada con intereses",
      tipo: "laboral" as const,
      motivoProfundo: "Para encontrar trabajo significativo",
    },
    {
      nombre: "Desarrollar habilidades del código secundario",
      tipo: "laboral" as const,
      motivoProfundo: "Para ampliar opciones de carrera",
    },
  ],
  "Soft Skills": [
    {
      nombre: "Dominar una habilidad blanda clave",
      tipo: "laboral" as const,
      motivoProfundo: "Para destacar profesionalmente",
    },
    {
      nombre: "Mejorar trabajo en equipo",
      tipo: "mixto" as const,
      motivoProfundo: "Para colaborar más efectivamente",
    },
  ],
}

export default function MetasSMARTClient() {
  const router = useRouter()
  const { user } = useSession()
  const [metas, setMetas] = useState<MetaSMART[]>(metasEjemplo)
  const [filtroTipo, setFiltroTipo] = useState<string>("todas")
  const [filtroEstado, setFiltroEstado] = useState<string>("todas")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [metaEditando, setMetaEditando] = useState<MetaSMART | null>(null)

  // Estado para nueva meta
  const [nuevaMeta, setNuevaMeta] = useState<Partial<MetaSMART>>({
    nombre: "",
    tipo: "personal",
    origen: "",
    motivoProfundo: "",
    especifica: "",
    medible: "",
    alcanzable: "",
    relevante: "",
    temporal: "90 días",
    indicadores30: ["", "", ""],
    indicadores60: ["", "", ""],
    indicadores90: ["", "", ""],
    habitos: ["", "", ""],
    recursos: ["", "", ""],
    progreso: 0,
    estado: "activa",
    notas: "",
  })

  const metasFiltradas = metas.filter((meta) => {
    const pasaTipo = filtroTipo === "todas" || meta.tipo === filtroTipo
    const pasaEstado = filtroEstado === "todas" || meta.estado === filtroEstado
    return pasaTipo && pasaEstado
  })

  const estadisticas = {
    total: metas.length,
    activas: metas.filter((m) => m.estado === "activa").length,
    completadas: metas.filter((m) => m.estado === "completada").length,
    promedioProgreso: Math.round(
      metas.filter((m) => m.estado === "activa").reduce((acc, m) => acc + m.progreso, 0) /
        Math.max(metas.filter((m) => m.estado === "activa").length, 1),
    ),
  }

  const getIconoTipo = (tipo: string) => {
    switch (tipo) {
      case "personal":
        return <Heart className="h-4 w-4" />
      case "laboral":
        return <Briefcase className="h-4 w-4" />
      case "mixto":
        return <Sparkles className="h-4 w-4" />
      default:
        return <Target className="h-4 w-4" />
    }
  }

  const getColorEstado = (estado: string) => {
    switch (estado) {
      case "activa":
        return "bg-green/10 dark:bg-green text-green dark:text-green/20"
      case "completada":
        return "bg-blue/10 dark:bg-blue text-blue dark:text-blue/20"
      case "pausada":
        return "bg-yellow/10 dark:bg-yellow text-yellow dark:text-yellow/20"
      case "abandonada":
        return "bg-red/10 dark:bg-red text-red dark:text-red/20"
      default:
        return "bg-muted/10 dark:bg-gray-800 text-gray-800 dark:text-muted/20"
    }
  }

  const handleGuardarMeta = () => {
    if (metaEditando) {
      setMetas(metas.map((m) => (m.id === metaEditando.id ? ({ ...metaEditando, ...nuevaMeta } as MetaSMART) : m)))
    } else {
      const nueva: MetaSMART = {
        ...nuevaMeta,
        id: Date.now().toString(),
        fechaCreacion: new Date().toISOString().split("T")[0],
        fechaRevision: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        indicadores30: nuevaMeta.indicadores30?.filter((i) => i) || [],
        indicadores60: nuevaMeta.indicadores60?.filter((i) => i) || [],
        indicadores90: nuevaMeta.indicadores90?.filter((i) => i) || [],
        habitos: nuevaMeta.habitos?.filter((h) => h) || [],
        recursos: nuevaMeta.recursos?.filter((r) => r) || [],
      } as MetaSMART
      setMetas([...metas, nueva])
    }
    setDialogOpen(false)
    setMetaEditando(null)
    setNuevaMeta({
      nombre: "",
      tipo: "personal",
      origen: "",
      motivoProfundo: "",
      especifica: "",
      medible: "",
      alcanzable: "",
      relevante: "",
      temporal: "90 días",
      indicadores30: ["", "", ""],
      indicadores60: ["", "", ""],
      indicadores90: ["", "", ""],
      habitos: ["", "", ""],
      recursos: ["", "", ""],
      progreso: 0,
      estado: "activa",
      notas: "",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/5 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-muted/90 dark:text-white flex items-center gap-3">
                <Target className="h-8 w-8 text-blue dark:text-indigo-400" />
                Sistema de Metas SMART
              </h1>
              <p className="text-muted/60 dark:text-muted/40 mt-2">
                Metas inteligentes basadas en tus resultados de tests psicométricos
              </p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue hover:bg-indigo-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Meta SMART
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue" />
                    {metaEditando ? "Editar Meta SMART" : "Crear Nueva Meta SMART"}
                  </DialogTitle>
                  <DialogDescription>
                    Define tu meta siguiendo el marco SMART: Específica, Medible, Alcanzable, Relevante y Temporal
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  {/* Información básica */}
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre de la Meta</Label>
                    <Input
                      id="nombre"
                      value={nuevaMeta.nombre}
                      onChange={(e) => setNuevaMeta({ ...nuevaMeta, nombre: e.target.value })}
                      placeholder="Ej: Mejorar liderazgo en equipo"
                      className="dark:bg-muted/70 dark:border-muted/60"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tipo">Tipo de Meta</Label>
                    <select
                      id="tipo"
                      value={nuevaMeta.tipo}
                      onChange={(e) => setNuevaMeta({ ...nuevaMeta, tipo: e.target.value as any })}
                      className="w-full px-3 py-2 border border-muted/30 rounded-lg dark:bg-muted/70 dark:border-muted/60 dark:text-white"
                    >
                      <option value="laboral">Laboral</option>
                      <option value="personal">Personal</option>
                      <option value="mixto">Mixto</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="motivoProfundo">Motivación Profunda</Label>
                    <textarea
                      id="motivoProfundo"
                      value={nuevaMeta.motivoProfundo}
                      onChange={(e) => setNuevaMeta({ ...nuevaMeta, motivoProfundo: e.target.value })}
                      placeholder="¿Por qué es importante esta meta para ti?"
                      className="w-full px-3 py-2 border border-muted/30 rounded-lg dark:bg-muted/70 dark:border-muted/60 dark:text-white min-h-20"
                    />
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleGuardarMeta} className="bg-blue hover:bg-indigo-700">
                      {metaEditando ? "Actualizar" : "Crear"} Meta
                    </Button>
                  </DialogFooter>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="progreso" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-muted/10 dark:bg-card">
            <TabsTrigger value="progreso">Mi Progreso</TabsTrigger>
            <TabsTrigger value="metas">Todas las Metas</TabsTrigger>
            <TabsTrigger value="plantillas">Plantillas</TabsTrigger>
          </TabsList>

          {/* Tab: Mi Progreso */}
          <TabsContent value="progreso" className="space-y-6">
            <Card className="dark:bg-card dark:border-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-muted/90 dark:text-white">
                  <TrendingUp className="h-5 w-5 text-green dark:text-green/40" />
                  Resumen de Progreso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {metas
                    .filter((m) => m.estado === "activa")
                    .map((meta) => (
                      <div key={meta.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            {getIconoTipo(meta.tipo)}
                            <span className="font-medium text-muted/80 dark:text-muted/20">{meta.nombre}</span>
                          </div>
                          <span className="text-sm font-bold text-blue dark:text-indigo-400">
                            {meta.progreso}%
                          </span>
                        </div>
                        <Progress value={meta.progreso} className="h-3" />
                        <div className="flex justify-between text-xs text-muted/50 dark:text-muted/40">
                          <span>Inicio: {meta.fechaCreacion}</span>
                          <span>Meta: {meta.temporal}</span>
                        </div>
                      </div>
                    ))}
                </div>

                {metas.filter((m) => m.estado === "activa").length === 0 && (
                  <div className="text-center py-8 text-muted/50 dark:text-muted/40">
                    <Target className="h-12 w-12 mx-auto mb-3 text-muted/30 dark:text-muted/60" />
                    <p>No tienes metas activas. ¡Crea una nueva meta para empezar!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Conexión con tests */}
            <Card className="dark:bg-card dark:border-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-muted/90 dark:text-white">
                  <Brain className="h-5 w-5 text-blue dark:text-indigo-400" />
                  Metas por Origen de Test
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {["DISC", "MBTI", "Big Five", "IE", "RIASEC", "Soft Skills"].map((test) => {
                    const metasDelTest = metas.filter((m) => m.origen.includes(test))
                    return (
                      <div key={test} className="p-4 bg-muted/5 rounded-lg dark:bg-muted/70">
                        <h4 className="font-medium mb-2 text-muted/80 dark:text-muted/20">{test}</h4>
                        <p className="text-2xl font-bold text-blue dark:text-indigo-400">{metasDelTest.length}</p>
                        <p className="text-xs text-muted/50 dark:text-muted/40">
                          {metasDelTest.filter((m) => m.estado === "activa").length} activas
                        </p>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
