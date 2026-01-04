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
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
      case "completada":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
      case "pausada":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
      case "abandonada":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <Target className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                Sistema de Metas SMART
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                Metas inteligentes basadas en tus resultados de tests psicométricos
              </p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Meta SMART
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-indigo-600" />
                    {metaEditando ? "Editar Meta SMART" : "Crear Nueva Meta SMART"}
                  </DialogTitle>
                  <DialogDescription>
                    Define tu meta siguiendo el marco SMART: Específica, Medible, Alcanzable, Relevante y Temporal
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  {/* Información básica */}
                  <div className="space-y-4">
                    <div>
                      <Label>Nombre de la meta</Label>
                      <Input
                        placeholder="Ej: Mejorar comunicación asertiva"
                        value={nuevaMeta.nombre}
                        onChange={(e) => setNuevaMeta({ ...nuevaMeta, nombre: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Tipo de meta</Label>
                        <Select
                          value={nuevaMeta.tipo}
                          onValueChange={(value) =>
                            setNuevaMeta({ ...nuevaMeta, tipo: value as "personal" | "laboral" | "mixto" })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="personal">
                              <span className="flex items-center gap-2">
                                <Heart className="h-4 w-4" /> Personal
                              </span>
                            </SelectItem>
                            <SelectItem value="laboral">
                              <span className="flex items-center gap-2">
                                <Briefcase className="h-4 w-4" /> Laboral
                              </span>
                            </SelectItem>
                            <SelectItem value="mixto">
                              <span className="flex items-center gap-2">
                                <Sparkles className="h-4 w-4" /> Mixto
                              </span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Origen (Test relacionado)</Label>
                        <Select
                          value={nuevaMeta.origen}
                          onValueChange={(value) => setNuevaMeta({ ...nuevaMeta, origen: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona el test" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="DISC">DISC</SelectItem>
                            <SelectItem value="MBTI">MBTI</SelectItem>
                            <SelectItem value="Big Five">Big Five</SelectItem>
                            <SelectItem value="IE">Inteligencia Emocional</SelectItem>
                            <SelectItem value="RIASEC">RIASEC</SelectItem>
                            <SelectItem value="Soft Skills">Soft Skills</SelectItem>
                            <SelectItem value="Personal">Iniciativa Personal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>Motivo profundo (¿Para qué?)</Label>
                      <Textarea
                        placeholder="¿Por qué es importante esta meta para ti? ¿Qué impacto tendrá en tu vida?"
                        value={nuevaMeta.motivoProfundo}
                        onChange={(e) => setNuevaMeta({ ...nuevaMeta, motivoProfundo: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Marco SMART */}
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-yellow-500" />
                      Marco SMART
                    </h3>

                    <div>
                      <Label className="flex items-center gap-2">
                        <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-xs font-bold">S</span>
                        Específica
                      </Label>
                      <Textarea
                        placeholder="¿Qué exactamente quieres lograr? Sé lo más concreto posible"
                        value={nuevaMeta.especifica}
                        onChange={(e) => setNuevaMeta({ ...nuevaMeta, especifica: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label className="flex items-center gap-2">
                        <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-xs font-bold">M</span>
                        Medible
                      </Label>
                      <Textarea
                        placeholder="¿Cómo sabrás que lo lograste? Define números o indicadores claros"
                        value={nuevaMeta.medible}
                        onChange={(e) => setNuevaMeta({ ...nuevaMeta, medible: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label className="flex items-center gap-2">
                        <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-xs font-bold">A</span>
                        Alcanzable
                      </Label>
                      <Textarea
                        placeholder="¿Es realista dado tu contexto actual? ¿Qué recursos necesitas?"
                        value={nuevaMeta.alcanzable}
                        onChange={(e) => setNuevaMeta({ ...nuevaMeta, alcanzable: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label className="flex items-center gap-2">
                        <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-xs font-bold">R</span>
                        Relevante
                      </Label>
                      <Textarea
                        placeholder="¿Por qué es importante ahora? ¿Cómo se conecta con tu perfil de tests?"
                        value={nuevaMeta.relevante}
                        onChange={(e) => setNuevaMeta({ ...nuevaMeta, relevante: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label className="flex items-center gap-2">
                        <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-xs font-bold">T</span>
                        Temporal
                      </Label>
                      <Select
                        value={nuevaMeta.temporal}
                        onValueChange={(value) => setNuevaMeta({ ...nuevaMeta, temporal: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30 días">30 días</SelectItem>
                          <SelectItem value="60 días">60 días</SelectItem>
                          <SelectItem value="90 días">90 días</SelectItem>
                          <SelectItem value="6 meses">6 meses</SelectItem>
                          <SelectItem value="1 año">1 año</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Indicadores por período */}
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-blue-500" />
                      Indicadores de Progreso
                    </h3>

                    <div>
                      <Label className="text-sm font-medium">Indicadores a 30 días</Label>
                      {nuevaMeta.indicadores30?.map((ind, i) => (
                        <Input
                          key={i}
                          className="mt-2"
                          placeholder={`Indicador ${i + 1}`}
                          value={ind}
                          onChange={(e) => {
                            const nuevos = [...(nuevaMeta.indicadores30 || [])]
                            nuevos[i] = e.target.value
                            setNuevaMeta({ ...nuevaMeta, indicadores30: nuevos })
                          }}
                        />
                      ))}
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Indicadores a 60 días</Label>
                      {nuevaMeta.indicadores60?.map((ind, i) => (
                        <Input
                          key={i}
                          className="mt-2"
                          placeholder={`Indicador ${i + 1}`}
                          value={ind}
                          onChange={(e) => {
                            const nuevos = [...(nuevaMeta.indicadores60 || [])]
                            nuevos[i] = e.target.value
                            setNuevaMeta({ ...nuevaMeta, indicadores60: nuevos })
                          }}
                        />
                      ))}
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Indicadores a 90 días</Label>
                      {nuevaMeta.indicadores90?.map((ind, i) => (
                        <Input
                          key={i}
                          className="mt-2"
                          placeholder={`Indicador ${i + 1}`}
                          value={ind}
                          onChange={(e) => {
                            const nuevos = [...(nuevaMeta.indicadores90 || [])]
                            nuevos[i] = e.target.value
                            setNuevaMeta({ ...nuevaMeta, indicadores90: nuevos })
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Hábitos y Recursos */}
                  <div className="space-y-4 border-t pt-4">
                    <div>
                      <Label className="text-sm font-medium flex items-center gap-2">
                        <Clock className="h-4 w-4" /> Hábitos semanales
                      </Label>
                      {nuevaMeta.habitos?.map((hab, i) => (
                        <Input
                          key={i}
                          className="mt-2"
                          placeholder={`Hábito ${i + 1}`}
                          value={hab}
                          onChange={(e) => {
                            const nuevos = [...(nuevaMeta.habitos || [])]
                            nuevos[i] = e.target.value
                            setNuevaMeta({ ...nuevaMeta, habitos: nuevos })
                          }}
                        />
                      ))}
                    </div>

                    <div>
                      <Label className="text-sm font-medium flex items-center gap-2">
                        <BookOpen className="h-4 w-4" /> Recursos recomendados
                      </Label>
                      {nuevaMeta.recursos?.map((rec, i) => (
                        <Input
                          key={i}
                          className="mt-2"
                          placeholder={`Recurso ${i + 1} (libro, test, coach...)`}
                          value={rec}
                          onChange={(e) => {
                            const nuevos = [...(nuevaMeta.recursos || [])]
                            nuevos[i] = e.target.value
                            setNuevaMeta({ ...nuevaMeta, recursos: nuevos })
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <Button onClick={handleGuardarMeta} className="w-full bg-indigo-600 hover:bg-indigo-700">
                    {metaEditando ? "Guardar Cambios" : "Crear Meta SMART"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900 dark:to-slate-800 border-indigo-100 dark:border-indigo-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-indigo-600 dark:text-indigo-300 font-medium">Total Metas</p>
                    <p className="text-3xl font-bold text-indigo-900 dark:text-indigo-100">{estadisticas.total}</p>
                  </div>
                  <Target className="h-10 w-10 text-indigo-300 dark:text-indigo-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-white dark:from-green-900 dark:to-slate-800 border-green-100 dark:border-green-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 dark:text-green-300 font-medium">Activas</p>
                    <p className="text-3xl font-bold text-green-900 dark:text-green-100">{estadisticas.activas}</p>
                  </div>
                  <TrendingUp className="h-10 w-10 text-green-300 dark:text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-900 dark:to-slate-800 border-blue-100 dark:border-blue-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 dark:text-blue-300 font-medium">Completadas</p>
                    <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{estadisticas.completadas}</p>
                  </div>
                  <CheckCircle2 className="h-10 w-10 text-blue-300 dark:text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-white dark:from-amber-900 dark:to-slate-800 border-amber-100 dark:border-amber-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-amber-600 dark:text-amber-300 font-medium">Progreso Promedio</p>
                    <p className="text-3xl font-bold text-amber-900 dark:text-amber-100">
                      {estadisticas.promedioProgreso}%
                    </p>
                  </div>
                  <BarChart3 className="h-10 w-10 text-amber-300 dark:text-amber-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs principales */}
        <Tabs defaultValue="mis-metas" className="space-y-6">
          <TabsList className="bg-white dark:bg-slate-800 border dark:border-slate-700">
            <TabsTrigger
              value="mis-metas"
              className="data-[state=active]:bg-indigo-100 dark:data-[state=active]:bg-indigo-900"
            >
              <Target className="h-4 w-4 mr-2" />
              Mis Metas
            </TabsTrigger>
            <TabsTrigger
              value="plantillas"
              className="data-[state=active]:bg-indigo-100 dark:data-[state=active]:bg-indigo-900"
            >
              <Lightbulb className="h-4 w-4 mr-2" />
              Plantillas por Test
            </TabsTrigger>
            <TabsTrigger
              value="progreso"
              className="data-[state=active]:bg-indigo-100 dark:data-[state=active]:bg-indigo-900"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Mi Progreso
            </TabsTrigger>
          </TabsList>

          {/* Tab: Mis Metas */}
          <TabsContent value="mis-metas" className="space-y-6">
            {/* Filtros */}
            <div className="flex gap-4 flex-wrap">
              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todos los tipos</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="laboral">Laboral</SelectItem>
                  <SelectItem value="mixto">Mixto</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todos los estados</SelectItem>
                  <SelectItem value="activa">Activas</SelectItem>
                  <SelectItem value="completada">Completadas</SelectItem>
                  <SelectItem value="pausada">Pausadas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Lista de metas */}
            <div className="grid gap-6">
              {metasFiltradas.map((meta) => (
                <Card
                  key={meta.id}
                  className="border-l-4 border-l-indigo-500 hover:shadow-lg transition-shadow dark:bg-slate-800 dark:border-indigo-700"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {getIconoTipo(meta.tipo)}
                        <div>
                          <CardTitle className="text-lg text-slate-900 dark:text-white">{meta.nombre}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <Badge
                              variant="outline"
                              className="text-xs text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-600"
                            >
                              {meta.origen}
                            </Badge>
                            <Badge className={getColorEstado(meta.estado)}>{meta.estado}</Badge>
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setMetaEditando(meta)
                            setNuevaMeta(meta)
                            setDialogOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 italic">"{meta.motivoProfundo}"</p>

                    {/* Barra de progreso */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600 dark:text-slate-300">Progreso general</span>
                        <span className="font-medium text-indigo-600 dark:text-indigo-400">{meta.progreso}%</span>
                      </div>
                      <Progress value={meta.progreso} className="h-2" />
                    </div>

                    {/* Indicadores actuales */}
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                        <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">30 días</h4>
                        <ul className="space-y-1">
                          {meta.indicadores30.slice(0, 2).map((ind, i) => (
                            <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1">
                              <CheckCircle2 className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                              {ind}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                        <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">60 días</h4>
                        <ul className="space-y-1">
                          {meta.indicadores60.slice(0, 2).map((ind, i) => (
                            <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1">
                              <Clock className="h-3 w-3 text-amber-500 mt-0.5 flex-shrink-0" />
                              {ind}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                        <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">90 días</h4>
                        <ul className="space-y-1">
                          {meta.indicadores90.slice(0, 2).map((ind, i) => (
                            <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1">
                              <Star className="h-3 w-3 text-indigo-500 mt-0.5 flex-shrink-0" />
                              {ind}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Hábitos */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {meta.habitos.map((habito, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="text-xs bg-green-50 border-green-200 dark:bg-green-900 dark:border-green-800"
                        >
                          <Clock className="h-3 w-3 mr-1" />
                          {habito}
                        </Badge>
                      ))}
                    </div>

                    {/* Recursos */}
                    <div className="flex flex-wrap gap-2">
                      {meta.recursos.map((recurso, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="text-xs bg-blue-50 border-blue-200 dark:bg-blue-900 dark:border-blue-800"
                        >
                          <BookOpen className="h-3 w-3 mr-1" />
                          {recurso}
                        </Badge>
                      ))}
                    </div>

                    {/* Notas */}
                    {meta.notas && (
                      <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100 dark:bg-amber-900 dark:border-amber-800">
                        <p className="text-xs text-amber-800 dark:text-amber-200">
                          <AlertCircle className="h-3 w-3 inline mr-1" />
                          <strong>Última nota:</strong> {meta.notas}
                        </p>
                      </div>
                    )}

                    {/* Fechas */}
                    <div className="flex justify-between text-xs text-slate-400 mt-4 pt-3 border-t dark:border-slate-700">
                      <span>Creada: {meta.fechaCreacion}</span>
                      <span>Próxima revisión: {meta.fechaRevision}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tab: Plantillas por Test */}
          <TabsContent value="plantillas" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(plantillasMetas).map(([test, plantillas]) => (
                <Card key={test} className="hover:shadow-lg transition-shadow dark:bg-slate-800 dark:border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                      <Brain className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      {test}
                    </CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-400">
                      Metas sugeridas basadas en tu perfil
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {plantillas.map((plantilla, i) => (
                      <div
                        key={i}
                        className="p-3 bg-slate-50 rounded-lg hover:bg-indigo-50 dark:bg-slate-700 dark:hover:bg-indigo-900 cursor-pointer transition-colors"
                        onClick={() => {
                          setNuevaMeta({
                            ...nuevaMeta,
                            nombre: plantilla.nombre,
                            tipo: plantilla.tipo,
                            origen: test,
                            motivoProfundo: plantilla.motivoProfundo,
                          })
                          setDialogOpen(true)
                        }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {getIconoTipo(plantilla.tipo)}
                          <span className="font-medium text-sm text-slate-800 dark:text-slate-200">
                            {plantilla.nombre}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{plantilla.motivoProfundo}</p>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      className="w-full mt-2 bg-transparent text-indigo-600 dark:text-indigo-400 border-indigo-300 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-950"
                      onClick={() => router.push(`/test/${test.toLowerCase().replace(" ", "-")}`)}
                    >
                      Ver mi perfil {test}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tab: Mi Progreso */}
          <TabsContent value="progreso" className="space-y-6">
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                  <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
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
                            <span className="font-medium text-slate-800 dark:text-slate-200">{meta.nombre}</span>
                          </div>
                          <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                            {meta.progreso}%
                          </span>
                        </div>
                        <Progress value={meta.progreso} className="h-3" />
                        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                          <span>Inicio: {meta.fechaCreacion}</span>
                          <span>Meta: {meta.temporal}</span>
                        </div>
                      </div>
                    ))}
                </div>

                {metas.filter((m) => m.estado === "activa").length === 0 && (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    <Target className="h-12 w-12 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                    <p>No tienes metas activas. ¡Crea una nueva meta para empezar!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Conexión con tests */}
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                  <Brain className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  Metas por Origen de Test
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {["DISC", "MBTI", "Big Five", "IE", "RIASEC", "Soft Skills"].map((test) => {
                    const metasDelTest = metas.filter((m) => m.origen.includes(test))
                    return (
                      <div key={test} className="p-4 bg-slate-50 rounded-lg dark:bg-slate-700">
                        <h4 className="font-medium mb-2 text-slate-800 dark:text-slate-200">{test}</h4>
                        <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{metasDelTest.length}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
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
