"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  BookOpen,
  Target,
  Users,
  Brain,
  Rocket,
  Settings,
  ChevronRight,
  FileText,
  Lightbulb,
  TrendingUp,
  Shield,
  Zap,
  Building2,
  Scale,
  Palette,
  Briefcase,
  Code,
  Heart,
  User,
  CheckCircle,
  Star,
  MessageSquare,
} from "lucide-react"

export default function DTCTechnicalSpecificationPage() {
  const [selectedCareer, setSelectedCareer] = useState("arquitectura")

  const careers = [
    {
      id: "arquitectura",
      name: "Arquitectura y Urbanismo",
      icon: Building2,
      specialties: [
        "Diseño arquitectónico",
        "Urbanismo sostenible",
        "Arquitectura de interiores",
        "Patrimonio arquitectónico",
        "Paisajismo",
        "Innovación en materiales",
        "Diseño urbano",
      ],
      sectors: [
        "Estudios de arquitectura y diseño",
        "Empresas constructoras e inmobiliarias",
        "Consultoras de planificación urbana",
        "Instituciones públicas (municipalidades, MINVU)",
        "Docencia universitaria",
        "Emprendimientos en diseño/constructora propia",
      ],
      dtcPersonalization: [
        "Construcción de portafolio profesional visual",
        "CV con secciones para proyectos arquitectónicos",
        "Competencias en software especializado (AutoCAD, Revit, BIM)",
        "Simulador con preguntas técnicas de arquitectura",
        "Pruebas de interpretación de planos y creatividad espacial",
        "Recursos en tendencias arquitectónicas y construcción sostenible",
        "Rutas de aprendizaje en herramientas digitales y gestión de proyectos",
      ],
      detailedPersonalization: `Para Arquitectura, DTC adaptará sus módulos enfatizando la construcción de un portafolio profesional además del CV tradicional. El Generador de CV incluirá secciones para portafolio visual (imágenes de proyectos) y destacará competencias creativas y manejo de software de diseño (AutoCAD, Revit, BIM). El Simulador de Entrevistas presentará preguntas orientadas como: "Háblame de un proyecto complejo que hayas diseñado y cómo abordaste sus desafíos técnicos y estéticos". Las Pruebas Técnicas incluirán retos de interpretación de planos y creatividad espacial específicos para arquitectos. El Coach IA Especializado proporcionará recomendaciones de cursos en nuevas tendencias arquitectónicas, normas de construcción sostenible, y rutas hacia herramientas BIM o gestión de proyectos.`,
    },
    {
      id: "derecho",
      name: "Derecho",
      icon: Scale,
      specialties: [
        "Derecho civil y comercial",
        "Derecho penal",
        "Derecho laboral",
        "Derecho tributario",
        "Derecho internacional",
        "Derecho corporativo",
        "Propiedad intelectual",
        "Derecho público",
        "Litigación",
        "Mediación y arbitraje",
      ],
      sectors: [
        "Estudios jurídicos (grandes firmas y boutique)",
        "Departamentos legales corporativos",
        "Poder Judicial",
        "Ministerio Público y fiscalías",
        "Defensorías públicas",
        "Ministerios y servicios gubernamentales",
        "Organizaciones no gubernamentales",
        "Consultorías jurídicas",
        "Carrera judicial",
        "Academia y docencia",
      ],
      dtcPersonalization: [
        "CV con tono formal acorde al sector legal",
        "Destacar logros como publicaciones y competencias de debate",
        "Simulador con casos jurídicos y argumentación",
        "Escenarios de entrevistas para estudios jurídicos",
        "Simulaciones de examen oral para habilitación profesional",
        "Habilidades de argumentación persuasiva y negociación",
        "Manejo del estrés en litigios",
        "Contenidos actualizados de jurisprudencia",
        "Mentoría con egresados de Derecho UDD",
        "Recomendaciones de certificaciones especializadas",
      ],
      detailedPersonalization: `Para usuarios de Derecho, DTC enfocará sus módulos en fortalecer habilidades de comunicación, análisis crítico y networking profesional. El Generador de CV sugerirá resaltar logros relevantes como publicaciones, participación en competencias de debate o clínicas jurídicas, manejando un tono formal acorde al sector legal. En el Simulador de entrevistas, se incluirán escenarios específicos: entrevistas para puestos de abogado junior en estudios con preguntas de casos hipotéticos, o simulaciones de examen oral para habilitación profesional. La Biblioteca de habilidades destacará competencias como argumentación persuasiva, negociación, pensamiento ético y manejo del estrés. El Coach IA asesorará en planificación de carrera según intereses específicos (fiscal, corporativo, etc.) y integrará contenidos actualizados de jurisprudencia y noticias legales para mantener ejemplos relevantes y al día.`,
    },
    {
      id: "diseno",
      name: "Diseño",
      icon: Palette,
      specialties: [
        "Diseño gráfico",
        "Diseño industrial",
        "Diseño UX/UI",
        "Diseño de moda",
        "Ilustración",
        "Animación digital",
        "Branding e identidad corporativa",
        "Diseño editorial",
        "Motion graphics",
        "Diseño de productos",
      ],
      sectors: [
        "Agencias de publicidad y estudios de diseño",
        "Departamentos de marketing corporativo",
        "Industrias manufactureras (diseño de productos)",
        "Empresas de tecnología (UX/UI)",
        "Industrias creativas (editoriales, medios)",
        "Productoras audiovisuales",
        "Trabajo freelance",
        "Emprendimiento propio",
        "Startups tecnológicas",
        "Consultorías de branding",
      ],
      dtcPersonalization: [
        "Portafolio digital interactivo",
        "CV visualmente atractivo y creativo",
        "Integración con Behance, Dribbble",
        "Pruebas técnicas específicas por rama",
        "Mini-desafíos creativos evaluados por IA",
        "Simulador con jefes creativos",
        "Orientación sobre cotización freelance",
        "Manejo de retroalimentación de clientes",
        "Rol motivador especial para carreras creativas",
        "Cursos de software especializado (Adobe, Figma)",
      ],
      detailedPersonalization: `Dado el perfil eminentemente creativo, DTC pondrá énfasis en la presentación visual de logros y generación de portafolio. El Generador de CV ofrecerá plantillas visualmente atractivas, permitiendo subir diseños propios e integrar portafolios en línea. Las pruebas técnicas serán específicas: mini-desafíos donde crear un afiche bajo instrucciones o identificar problemas de usabilidad, evaluados automáticamente por GPT-4. El Simulador incluirá entrevistas con jefes creativos evaluando la capacidad de explicar ideas detrás de diseños. El Coach IA orientará sobre cotización de proyectos freelance, armado de portafolio y manejo de clientes difíciles, asumiendo un rol motivador especial recordando éxitos pasados para mantener la confianza creativa.`,
    },
    {
      id: "ingenieria-comercial",
      name: "Ingeniería Comercial",
      icon: Briefcase,
      specialties: [
        "Finanzas corporativas",
        "Marketing y marketing digital",
        "Recursos humanos",
        "Emprendimiento",
        "Economía aplicada",
        "Analítica de negocios",
        "Gestión financiera",
        "Consultoría estratégica",
        "Gestión de operaciones",
        "Business intelligence",
      ],
      sectors: [
        "Instituciones financieras (bancos, corredoras)",
        "Empresas de consultoría y auditoría (Big Four)",
        "Departamentos comerciales corporativos",
        "Retail y consumo masivo",
        "Telecomunicaciones y tecnología",
        "Emprendimientos propios (startups)",
        "PYMEs familiares",
        "Organizaciones sin fines de lucro",
        "Sector público económico",
        "Reguladores y banco central",
      ],
      dtcPersonalization: [
        "CV con datos cuantitativos de logros",
        "Integración automática con LinkedIn",
        "Pruebas de Excel/Sheets avanzado",
        "Quizzes de marketing y análisis de datos",
        "Simulador de case interviews",
        "Entrevistas grupales simuladas",
        "Planificación de carrera por especialización",
        "Networking y mentoría ejecutiva",
        "Certificaciones CFA y especializaciones",
        "Cursos de Business Analytics y Digital Marketing",
      ],
      detailedPersonalization: `Para Ingeniería Comercial, DTC hará énfasis en habilidades analíticas, de gestión y networking. El Generador de CV integrará datos cuantitativos de logros y se conectará con LinkedIn para actualizar experiencia automáticamente. Las pruebas técnicas incluirán ejercicios en Excel (modelos financieros, tablas dinámicas) y quizzes de marketing. El Simulador ofrecerá case interviews y entrevistas grupales comunes en consultorías. El Coach IA guiará la planificación según intereses específicos (marketing, finanzas) y motivará la creación de redes profesionales, sugiriendo certificaciones como CFA o cursos de Business Analytics según las brechas detectadas en el perfil.`,
    },
    {
      id: "informatica",
      name: "Ingeniería Civil Informática",
      icon: Code,
      specialties: [
        "Desarrollo de software",
        "Ciencia de datos",
        "Inteligencia artificial",
        "Machine learning",
        "Gestión de TI",
        "Redes y seguridad informática",
        "Desarrollo web/mobile",
        "Arquitectura de software",
        "Ciberseguridad",
        "DevOps y cloud computing",
        "Blockchain",
      ],
      sectors: [
        "Empresas de tecnología (multinacionales y startups)",
        "Departamentos de TI corporativos",
        "Banca y servicios financieros",
        "Consultoras de software",
        "Industria fintech",
        "Telecomunicaciones",
        "Salud digital",
        "Emprendimientos tecnológicos propios",
        "Trabajo remoto global",
        "Investigación y desarrollo",
      ],
      dtcPersonalization: [
        "Evaluaciones prácticas y coding challenges",
        "Pruebas de programación en múltiples lenguajes",
        "Validación automática con pruebas unitarias",
        "Feedback detallado de optimización de código",
        "Seguimiento de progreso técnico",
        "CV con insignias de habilidades validadas",
        "Simulador de entrevistas técnicas",
        "Explicación de conceptos complejos",
        "Planificación de rutas de especialización",
        "Integración con Kaggle y proyectos",
        "Tutorías de conceptos técnicos",
        "Actualización con tendencias tecnológicas",
      ],
      detailedPersonalization: `Dado el perfil técnico, DTC incorporará evaluaciones prácticas extensivas. Las pruebas incluirán coding challenges en el navegador con validación automática mediante pruebas unitarias, dando puntajes y feedback detallado sobre optimización. El Generador de CV añadirá insignias validadas como "Java (Nivel Avanzado) - Validado por DTC". El Simulador incluirá entrevistas técnicas donde explicar conceptos complejos o resolver problemas lógicos. El Coach IA acompañará en metas como "convertirse en Data Scientist", recomendando rutas de aprendizaje específicas, proyectos de portafolio y simulaciones técnicas periódicas, actuando también como tutor para conceptos difíciles y manteniéndose actualizado con tendencias tecnológicas.`,
    },
    {
      id: "medicina",
      name: "Medicina",
      icon: Heart,
      specialties: [
        "Medicina general",
        "Especialidades médicas",
        "Medicina familiar",
        "Medicina de urgencia",
        "Investigación médica",
        "Medicina preventiva",
        "Telemedicina",
        "Salud pública",
        "Medicina ocupacional",
        "Docencia médica",
      ],
      sectors: [
        "Hospitales públicos",
        "Clínicas privadas",
        "Centros de atención primaria",
        "Investigación médica",
        "Industria farmacéutica",
        "Organismos de salud pública",
        "Medicina ocupacional",
        "Telemedicina",
        "Docencia universitaria",
        "Organizaciones internacionales de salud",
      ],
      dtcPersonalization: [
        "CV médico con experiencia clínica",
        "Simulador con casos clínicos",
        "Evaluación de conocimientos médicos",
        "Recursos de medicina basada en evidencia",
        "Preparación para exámenes de especialización",
        "Networking con colegios médicos",
        "Sociedades científicas",
        "Actualización en literatura médica",
        "Ética médica y casos complejos",
        "Habilidades de comunicación empática",
      ],
      detailedPersonalization: `Para Medicina, DTC se enfocará en el desarrollo de competencias clínicas y profesionales. El CV médico destacará experiencia clínica, investigación y publicaciones. El Simulador incluirá casos clínicos complejos y escenarios de comunicación con pacientes. Las evaluaciones cubrirán conocimientos médicos actualizados y razonamiento clínico. El Coach IA guiará en la elección de especialidades, preparación para exámenes y desarrollo de habilidades de comunicación empática, integrando recursos de medicina basada en evidencia y conectando con redes profesionales médicas.`,
    },
    {
      id: "psicologia",
      name: "Psicología",
      icon: User,
      specialties: [
        "Psicología clínica",
        "Psicología organizacional",
        "Psicología educacional",
        "Neuropsicología",
        "Psicología social",
        "Psicología deportiva",
        "Psicogerontología",
        "Psicología forense",
        "Terapia familiar",
        "Psicología de la salud",
      ],
      sectors: [
        "Centros de salud mental",
        "Departamentos de recursos humanos",
        "Instituciones educativas",
        "Consultoría organizacional",
        "Investigación académica",
        "Práctica privada",
        "ONGs y fundaciones sociales",
        "Hospitales y clínicas",
        "Centros de rehabilitación",
        "Servicios públicos de salud mental",
      ],
      dtcPersonalization: [
        "CV con competencias terapéuticas",
        "Simulador con casos psicológicos",
        "Evaluación de habilidades de escucha",
        "Recursos de terapias actualizadas",
        "Preparación para habilitación profesional",
        "Networking con colegios profesionales",
        "Centros de formación continua",
        "Ética profesional",
        "Manejo de casos complejos",
        "Desarrollo de empatía profesional",
      ],
      detailedPersonalization: `Para Psicología, DTC se centrará en el desarrollo de competencias terapéuticas y evaluativas. El CV destacará experiencia en evaluación psicológica, intervenciones y trabajo con poblaciones específicas. El Simulador incluirá casos psicológicos complejos y situaciones de intervención en crisis. Las evaluaciones medirán habilidades de escucha activa, empatía y razonamiento clínico. El Coach IA orientará en la elección de especializaciones, preparación para habilitación profesional y desarrollo de habilidades terapéuticas, integrando recursos de terapias basadas en evidencia y conectando con redes profesionales de psicología.`,
    },
  ]

  const systemModules = [
    {
      name: "Tests Psicométricos",
      icon: Brain,
      description: "Evaluaciones de personalidad, habilidades y competencias",
      features: ["Test DISC", "Big Five", "Inteligencias múltiples", "Habilidades blandas", "Evaluación técnica"],
    },
    {
      name: "Generador de CV",
      icon: FileText,
      description: "Creación automática de CV optimizados por IA",
      features: ["Templates por carrera", "Optimización ATS", "Análisis de palabras clave", "Múltiples formatos"],
    },
    {
      name: "Simulador de Entrevistas",
      icon: Users,
      description: "Práctica de entrevistas con IA y feedback personalizado",
      features: [
        "Preguntas por industria",
        "Análisis de respuestas",
        "Feedback en tiempo real",
        "Grabación y revisión",
      ],
    },
    {
      name: "Coach IA",
      icon: Lightbulb,
      description: "Asistente inteligente para orientación profesional",
      features: ["Consejos personalizados", "Planificación de carrera", "Resolución de dudas", "Motivación continua"],
    },
    {
      name: "Biblioteca de Habilidades",
      icon: BookOpen,
      description: "Recursos de aprendizaje y desarrollo profesional",
      features: ["Cursos recomendados", "Artículos especializados", "Videos educativos", "Certificaciones"],
    },
    {
      name: "Panel de Progreso",
      icon: TrendingUp,
      description: "Seguimiento del desarrollo profesional",
      features: ["Métricas de progreso", "Objetivos personalizados", "Logros desbloqueados", "Análisis de tendencias"],
    },
  ]

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Rocket className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">DespegaTuCarrera 1.5</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Especificación técnica completa de la plataforma integral de orientación y desarrollo profesional potenciada
          por Inteligencia Artificial
        </p>
        <div className="flex items-center justify-center gap-4">
          <Badge variant="secondary" className="px-4 py-2">
            <Target className="h-4 w-4 mr-2" />7 Carreras Objetivo
          </Badge>
          <Badge variant="secondary" className="px-4 py-2">
            <Brain className="h-4 w-4 mr-2" />
            IA Generativa
          </Badge>
          <Badge variant="secondary" className="px-4 py-2">
            <Shield className="h-4 w-4 mr-2" />
            Evaluaciones Psicométricas
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visión General</TabsTrigger>
          <TabsTrigger value="careers">Carreras Objetivo</TabsTrigger>
          <TabsTrigger value="modules">Módulos del Sistema</TabsTrigger>
          <TabsTrigger value="architecture">Arquitectura Técnica</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Objetivos del Proyecto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                DTC 1.5 busca crear una experiencia personalizada que evoluciona con el usuario desde el primer día,
                combinando IA generativa, evaluaciones psicométricas y coaching personalizado para ayudar a estudiantes
                y jóvenes profesionales a despegar sus carreras de forma efectiva.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    Características Clave
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                      Personalización basada en datos psicométricos
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                      Coach IA con nivel de detalle similar a mentor humano
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                      Integraciones con servicios externos (Coursera, LinkedIn)
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                      Ecosistema completo de desarrollo profesional
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    Beneficios Esperados
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                      Autoconocimiento profundo mediante tests validados
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                      Mejora continua de habilidades técnicas y blandas
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                      Acompañamiento constante y motivacional
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                      Conexiones directas con oportunidades reales
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Visión Estratégica</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                La visión estratégica de DTC 1.5 es crear una plataforma que anticipe y responda a las necesidades
                individuales de orientación profesional de cada usuario. Gracias a la IA generativa, la plataforma podrá
                brindar asesoría con un nivel de detalle y personalización similar al de un mentor humano experimentado.
              </p>
              <p className="text-muted-foreground">
                Al mismo tiempo, la integración de datos psicométricos garantizará que las recomendaciones se basen en
                un entendimiento profundo de la personalidad, intereses y fortalezas de cada persona. Esto es
                especialmente relevante en un contexto donde el desarrollo de carrera se ha vuelto continuo y crítico.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="careers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Carreras Objetivo - Universidad del Desarrollo</CardTitle>
              <p className="text-muted-foreground">
                DTC 1.5 brindará soporte inicial para 7 carreras profesionales clave, adaptando la experiencia a las
                particularidades de cada una.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <h4 className="font-semibold mb-3">Selecciona una carrera:</h4>
                  <ScrollArea className="h-96">
                    <div className="space-y-2">
                      {careers.map((career) => {
                        const Icon = career.icon
                        return (
                          <Button
                            key={career.id}
                            variant={selectedCareer === career.id ? "default" : "outline"}
                            className="w-full justify-start h-auto p-3"
                            onClick={() => setSelectedCareer(career.id)}
                          >
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              <span className="text-sm">{career.name}</span>
                            </div>
                          </Button>
                        )
                      })}
                    </div>
                  </ScrollArea>
                </div>

                <div className="lg:col-span-3">
                  {careers
                    .filter((career) => career.id === selectedCareer)
                    .map((career) => {
                      const Icon = career.icon
                      return (
                        <div key={career.id} className="space-y-6">
                          <div className="flex items-center gap-3">
                            <div className="p-3 bg-primary/10 rounded-lg">
                              <Icon className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold">{career.name}</h3>
                              <p className="text-muted-foreground">
                                {career.specialties.length} especialidades • {career.sectors.length} sectores de empleo
                              </p>
                            </div>
                          </div>

                          <Tabs defaultValue="specialties" className="w-full">
                            <TabsList className="grid w-full grid-cols-4">
                              <TabsTrigger value="specialties">Especialidades</TabsTrigger>
                              <TabsTrigger value="sectors">Sectores</TabsTrigger>
                              <TabsTrigger value="personalization">Personalización</TabsTrigger>
                              <TabsTrigger value="details">Detalles</TabsTrigger>
                            </TabsList>

                            <TabsContent value="specialties" className="mt-4">
                              <Card>
                                <CardHeader>
                                  <CardTitle className="flex items-center gap-2">
                                    <BookOpen className="h-5 w-5" />
                                    Especialidades y Menciones
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {career.specialties.map((specialty, index) => (
                                      <div key={index} className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span className="text-sm">{specialty}</span>
                                      </div>
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>
                            </TabsContent>

                            <TabsContent value="sectors" className="mt-4">
                              <Card>
                                <CardHeader>
                                  <CardTitle className="flex items-center gap-2">
                                    <Building2 className="h-5 w-5" />
                                    Principales Sectores de Empleo
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="grid grid-cols-1 gap-2">
                                    {career.sectors.map((sector, index) => (
                                      <div key={index} className="flex items-center gap-2">
                                        <Briefcase className="h-4 w-4 text-blue-500" />
                                        <span className="text-sm">{sector}</span>
                                      </div>
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>
                            </TabsContent>

                            <TabsContent value="personalization" className="mt-4">
                              <Card>
                                <CardHeader>
                                  <CardTitle className="flex items-center gap-2">
                                    <Settings className="h-5 w-5" />
                                    Personalización DTC para {career.name}
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="grid grid-cols-1 gap-2">
                                    {career.dtcPersonalization.map((feature, index) => (
                                      <div key={index} className="flex items-start gap-2">
                                        <Star className="h-4 w-4 text-yellow-500 mt-0.5" />
                                        <span className="text-sm">{feature}</span>
                                      </div>
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>
                            </TabsContent>

                            <TabsContent value="details" className="mt-4">
                              <Card>
                                <CardHeader>
                                  <CardTitle className="flex items-center gap-2">
                                    <MessageSquare className="h-5 w-5" />
                                    Personalización Detallada
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="prose prose-sm max-w-none">
                                    <p className="text-muted-foreground leading-relaxed">
                                      {career.detailedPersonalization}
                                    </p>
                                  </div>
                                </CardContent>
                              </Card>
                            </TabsContent>
                          </Tabs>
                        </div>
                      )
                    })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modules" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {systemModules.map((module, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <module.icon className="h-5 w-5 text-primary" />
                    {module.name}
                  </CardTitle>
                  <p className="text-muted-foreground">{module.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Características:</h4>
                    <ul className="space-y-1">
                      {module.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <ChevronRight className="h-3 w-3 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="architecture" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Arquitectura del Sistema</CardTitle>
              <p className="text-muted-foreground">
                DTC 1.5 implementará una arquitectura moderna basada en microservicios con integración de IA
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Frontend</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3" />
                      Next.js 15 con App Router
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3" />
                      TypeScript para type safety
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3" />
                      Tailwind CSS para styling
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3" />
                      Shadcn/ui para componentes
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Backend</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3" />
                      API Routes de Next.js
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3" />
                      Supabase para base de datos
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3" />
                      Autenticación con Supabase Auth
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3" />
                      Row Level Security (RLS)
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">IA y Machine Learning</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3" />
                      OpenAI GPT-4 para coach IA
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3" />
                      Vercel AI SDK para integraciones
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3" />
                      Análisis de sentimientos
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3" />
                      Recomendaciones personalizadas
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Integraciones</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3" />
                      APIs de empleo (LinkedIn, Indeed)
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3" />
                      Coursera para cursos
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3" />
                      Sistemas de video llamadas
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3" />
                      Servicios de notificaciones
                    </li>
                  </ul>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3">Flujo de Datos</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Usuario completa tests psicométricos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>IA analiza resultados y crea perfil personalizado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span>Sistema genera recomendaciones específicas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Coach IA proporciona guidance personalizado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>Integración con servicios externos para oportunidades</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
