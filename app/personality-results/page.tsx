"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  Heart,
  Zap,
  Shield,
  Eye,
  TrendingUp,
  Users,
  Target,
  Download,
  Share2,
  Printer,
  RefreshCw,
  Sparkles,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PersonalityResult {
  test_type: string
  traits: {
    openness: number
    conscientiousness: number
    extraversion: number
    agreeableness: number
    neuroticism: number
  }
  summary: string
  strengths: string[]
  challenges: string[]
  career_recommendations: string[]
  work_style: string
  communication_style: string
}

interface AIAnalysis {
  analysis: string
  loading: boolean
  version: number
  analysisType: string
}

// Custom Radar Chart Component for Personality
const PersonalityRadarChart = ({ data }: { data: any[] }) => {
  const size = 300
  const center = size / 2
  const maxRadius = 100
  const levels = 5

  const angleStep = (2 * Math.PI) / data.length

  const getPointPosition = (index: number, value: number) => {
    const angle = angleStep * index - Math.PI / 2
    const radius = (value / 100) * maxRadius
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    }
  }

  const getLabelPosition = (index: number) => {
    const angle = angleStep * index - Math.PI / 2
    const radius = maxRadius + 25
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    }
  }

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="border rounded-lg bg-white">
        {/* Grid circles */}
        {Array.from({ length: levels }, (_, i) => (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={(maxRadius / levels) * (i + 1)}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}

        {/* Grid lines */}
        {data.map((_, index) => {
          const pos = getPointPosition(index, 100)
          return <line key={index} x1={center} y1={center} x2={pos.x} y2={pos.y} stroke="#e5e7eb" strokeWidth="1" />
        })}

        {/* Data polygon */}
        <polygon
          points={data
            .map((item, index) => {
              const pos = getPointPosition(index, item.score)
              return `${pos.x},${pos.y}`
            })
            .join(" ")}
          fill="#8B5CF6"
          fillOpacity="0.3"
          stroke="#8B5CF6"
          strokeWidth="2"
        />

        {/* Data points */}
        {data.map((item, index) => {
          const pos = getPointPosition(index, item.score)
          return <circle key={index} cx={pos.x} cy={pos.y} r="4" fill="#8B5CF6" stroke="white" strokeWidth="2" />
        })}

        {/* Labels */}
        {data.map((item, index) => {
          const pos = getLabelPosition(index)
          return (
            <text
              key={index}
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs font-medium fill-gray-700"
            >
              {item.name}
            </text>
          )
        })}

        {/* Center label */}
        <text
          x={center}
          y={center}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-sm font-bold fill-gray-900"
        >
          Personality
        </text>
      </svg>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
        {data.map((item, index) => (
          <div key={item.name} className="p-2 bg-gray-50 rounded-lg">
            <div className="font-medium text-gray-900">{item.name}</div>
            <div className="text-2xl font-bold text-purple-600">{item.score}%</div>
            <div className="text-sm text-gray-600">{getScoreLevel(item.score).level}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

const getScoreLevel = (score: number) => {
  if (score >= 70) return { level: "Alto", color: "text-green-600" }
  if (score >= 40) return { level: "Medio", color: "text-yellow-600" }
  return { level: "Bajo", color: "text-red-600" }
}

export default function PersonalityResultsPage() {
  const [results, setResults] = useState<PersonalityResult | null>(null)
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis>({
    analysis: "",
    loading: false,
    version: 1,
    analysisType: "Psicológico Profundo",
  })
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Multiple analysis variations for regeneration - ALL 4 COMPLETE ANALYSES
  const analysisVariations = [
    {
      title: "🧠 Análisis Psicológico Profundo",
      emoji: "🧠",
      type: "Psicológico Profundo",
      content: `Tu perfil de personalidad revela una combinación excepcional de creatividad estructurada y liderazgo empático. Con una puntuación alta en Apertura (78%) y Responsabilidad (85%), demuestras una rara capacidad para equilibrar la innovación con la ejecución práctica.

**🎯 Insights Clave de Personalidad:**

**Perfil Cognitivo**: Tu alta apertura combinada con consciencia elevada sugiere un pensador estratégico que puede generar ideas innovadoras y llevarlas a la realidad de manera sistemática. Esta combinación es especialmente valiosa en roles de liderazgo de producto o consultoría estratégica.

**Estilo de Liderazgo**: Tu extraversión moderada-alta (72%) junto con agreeableness equilibrada (65%) indica un estilo de liderazgo colaborativo pero decisivo. Puedes motivar equipos sin ser dominante, una cualidad muy buscada en el mercado laboral chileno actual.

**Ventaja Competitiva**: Tu bajo neuroticismo (32%) es una fortaleza significativa en entornos de alta presión. Esta estabilidad emocional, combinada con tu creatividad, te posiciona idealmente para roles en startups o empresas en transformación digital.

**🏢 Recomendaciones Estratégicas para Chile:**

**Sector Tecnológico**: Considera roles en Product Management o Innovation Lead en empresas como:
- Cornershop (Uber) - Liderazgo de producto
- NotCo - Innovación y desarrollo  
- Fintual - Estrategia y crecimiento
- Mercado Libre Chile - Gestión de equipos

**Consultoría**: Tu perfil es ideal para consultorías estratégicas como McKinsey Chile, BCG, o Deloitte, donde la creatividad estructurada es clave.

**Corporativo**: Roles de transformación digital en empresas como Banco de Chile, Falabella, o CMPC.

**📈 Desarrollo Profesional:**
1. **Design Thinking**: Potencia tu creatividad natural con metodologías estructuradas
2. **Metodologías Ágiles**: Combina tu organización con flexibilidad  
3. **Liderazgo Adaptativo**: Desarrolla tu capacidad de liderar en ambientes cambiantes

**⚠️ Puntos Ciegos a Considerar:**
- Tu perfeccionismo puede ralentizar la toma de decisiones en entornos de startup
- Considera desarrollar mayor tolerancia a la ambigüedad para maximizar tu potencial innovador
- Equilibra tu tendencia analítica con intuición en decisiones rápidas

**💰 Expectativas Salariales (Chile 2024):**
- Roles junior: $1.2M - $1.8M CLP
- Roles senior: $2.5M - $4M CLP  
- Liderazgo: $4M - $8M CLP

Este perfil te posiciona en el **top 15%** de candidatos para roles de liderazgo en el mercado chileno actual. Tu combinación de creatividad, organización y estabilidad emocional es altamente valorada en la economía digital chilena.`,
    },
    {
      title: "🚀 Análisis de Potencial Ejecutivo",
      emoji: "🚀",
      type: "Potencial Ejecutivo",
      content: `Tu combinación única de rasgos de personalidad te posiciona como un líder natural con gran potencial ejecutivo. El equilibrio entre tu creatividad (Apertura 78%) y disciplina (Responsabilidad 85%) es extraordinario y raro en el mercado ejecutivo.

**🎯 Perfil Ejecutivo Completo:**

**Capacidad de Innovación**: Tu alta apertura te permite ver oportunidades donde otros ven problemas. Esta visión estratégica, combinada con tu capacidad de ejecución, es ideal para roles de C-level en empresas en crecimiento y transformación.

**Gestión de Equipos**: Con extraversión 72% y agreeableness 65%, tienes el perfil perfecto para liderar equipos diversos. Puedes inspirar sin intimidar, una habilidad crucial en el liderazgo moderno y especialmente valorada en la cultura empresarial chilena.

**Resistencia al Estrés**: Tu bajo neuroticismo (32%) te convierte en un líder confiable bajo presión. Esta estabilidad emocional es especialmente valiosa en roles de alta responsabilidad y toma de decisiones críticas.

**🏆 Oportunidades Ejecutivas en Chile:**

**Startups Unicornio y Scale-ups**: 
- Chief Product Officer en Fintual o NotCo
- Head of Growth en Cornershop
- VP of Strategy en empresas fintech emergentes
- Chief Innovation Officer en startups B2B

**Corporativo Tradicional**:
- Gerencia de Innovación en Banco de Chile o BCI
- Director de Transformación Digital en Falabella o Ripley
- Head of New Business en CMPC o Arauco
- VP de Estrategia en Entel o Movistar Chile

**Consultoría Estratégica**:
- Principal en McKinsey Chile
- Director en BCG Santiago  
- Partner track en Deloitte o PwC
- Managing Director en boutiques especializadas

**📊 Proyección de Carrera Ejecutiva (5 años):**

**Año 1-2**: Senior Manager/Director ($3M-5M CLP)
- Liderazgo de equipos de 10-20 personas
- Responsabilidad P&L de $500M-1B CLP
- Proyectos de transformación digital

**Año 3-4**: VP/Gerente General ($6M-10M CLP)  
- Liderazgo de múltiples equipos (50+ personas)
- Responsabilidad P&L de $2B-5B CLP
- Estrategia corporativa y M&A

**Año 5+**: C-Level/Socio ($12M+ CLP)
- CEO/COO de empresas medianas
- Partner en consultoras
- Board member en múltiples empresas

**🎯 Estrategias de Desarrollo Ejecutivo:**

1. **Executive MBA**: Considera programas en UC, PUC o internacionales (Kellogg, INSEAD)
2. **Board Experience**: Busca oportunidades en directorios de startups y ONGs
3. **Executive Mentoring**: Conecta con CEOs y ejecutivos senior en tu industria objetivo
4. **Thought Leadership**: Desarrolla tu marca personal a través de contenido, speaking y networking

**⚡ Ventajas Competitivas Únicas como Ejecutivo:**
- Capacidad de traducir visión estratégica en ejecución táctica
- Liderazgo empático pero orientado a resultados
- Adaptabilidad excepcional en entornos VUCA (volátiles, inciertos, complejos, ambiguos)
- Estabilidad emocional que inspira confianza en crisis

**🎖️ Indicadores de Éxito Ejecutivo que ya posees:**
- Capacidad de tomar decisiones complejas bajo incertidumbre
- Habilidad para comunicar visión a diferentes audiencias (técnicos, comerciales, financieros)
- Resistencia natural al estrés y presión de stakeholders
- Balance perfecto entre innovación disruptiva y pragmatismo ejecutivo

**💼 Sectores de Alto Impacto para Liderazgo:**
- **FinTech**: Revolución de servicios financieros en Chile
- **HealthTech**: Transformación digital de la salud
- **EdTech**: Innovación en educación post-pandemia
- **Sustainability**: Liderazgo en economía circular y ESG

Tu perfil sugiere un potencial ejecutivo excepcional con capacidad para liderar transformaciones organizacionales significativas en el ecosistema empresarial chileno. Eres el tipo de líder que puede navegar exitosamente la próxima década de cambio acelerado.`,
    },
    {
      title: "🎨 Análisis de Creatividad y Innovación",
      emoji: "🎨",
      type: "Creatividad e Innovación",
      content: `Tu perfil revela un innovador nato con una capacidad excepcional para materializar ideas creativas. La combinación de alta apertura (78%) con responsabilidad elevada (85%) es el sello distintivo de los grandes innovadores que pueden tanto crear como ejecutar.

**🧠 Perfil del Innovador Completo:**

**Pensamiento Divergente**: Tu alta apertura te permite generar múltiples soluciones creativas a problemas complejos. Esta capacidad de "pensar fuera de la caja" es tu mayor fortaleza profesional y te diferencia en mercados competitivos.

**Ejecución Creativa**: A diferencia de muchos creativos, tu alta responsabilidad te permite llevar ideas desde la conceptualización hasta la implementación exitosa. Esta combinación es extremadamente rara y valiosa.

**Colaboración Innovadora**: Tu extraversión moderada-alta (72%) te permite liderar procesos de innovación colaborativa, facilitando la co-creación con equipos diversos y multidisciplinarios.

**🎯 Sectores Ideales para Innovación en Chile:**

**Industrias Creativas y Marketing**:
- Director Creativo en agencias como Geometry, BBDO Chile, o Ogilvy
- Head of Innovation en Publicis, McCann, o DDB Chile
- Creative Strategist en startups de marketing digital como Acid Labs
- Brand Innovation Manager en empresas como CCU, Nestlé Chile

**Tecnología e Innovación Digital**:
- Product Designer en Platanus, Acid Labs, o IDA Chile
- Innovation Manager en Banco Estado, BCI, o Santander Chile
- UX Research Lead en empresas fintech como Fintual, Khipu
- Head of Digital Innovation en retailers como Falabella, Ripley

**Emprendimiento e Impacto Social**:
- Co-founder en startups de impacto social y sostenibilidad
- Director de Producto en scale-ups chilenas emergentes
- Innovation Consultant independiente para corporaciones
- Social Innovation Lead en fundaciones y ONGs

**🚀 Metodologías que Potencian tu Perfil Innovador:**

1. **Design Thinking**: Estructura natural para tu proceso creativo, desde empatía hasta prototipado
2. **Lean Startup**: Combina tu creatividad con validación sistemática y iteración rápida
3. **Agile Innovation**: Frameworks que aprovechan tu adaptabilidad y orientación a resultados
4. **Human-Centered Design**: Alinea perfectamente con tu empatía natural y enfoque colaborativo

**💡 Proyectos de Alto Impacto Sugeridos:**

**Innovación Social y Sostenibilidad**:
- Desarrolla soluciones para desafíos urbanos chilenos (transporte, vivienda, contaminación)
- Crea productos para la economía circular y reducción de residuos
- Innova en inclusión financiera para sectores vulnerables
- Diseña soluciones de acceso a educación de calidad

**Tecnología con Propósito**:
- EdTech para educación personalizada en Latinoamérica
- HealthTech para telemedicina y acceso rural a salud
- AgTech para agricultura sostenible y pequeños productores
- CleanTech para energías renovables y eficiencia energética

**🎨 Desarrollo de Habilidades Creativas Avanzadas:**

1. **Prototipado Rápido**: Domina herramientas como Figma, Sketch, InVision, Principle
2. **Storytelling Estratégico**: Desarrolla narrativas compelling para comunicar innovación
3. **Systems Thinking**: Entiende ecosistemas complejos de innovación y stakeholders
4. **Cultural Intelligence**: Navega contextos diversos para innovación global desde Chile

**🌟 Oportunidades de Innovación Específicas en Chile:**

**Sectores Emergentes con Alto Potencial**:
- **GreenTech**: Soluciones ambientales y cambio climático
- **HealthTech**: Telemedicina y digitalización de salud
- **AgTech**: Agricultura de precisión y sostenible  
- **FinTech**: Inclusión financiera y servicios digitales

**Ecosistema de Innovación Chileno**:
- **Incubadoras**: Start-Up Chile, CORFO, Chrysalis
- **Aceleradoras**: Wayra Chile, Telefónica Open Future, NXTP Labs
- **Hubs de Innovación**: Huechuraba, Las Condes Innovation District
- **Centros de I+D**: Universidades UC, PUC, Chile, centros tecnológicos

**⚠️ Desafíos Específicos del Innovador:**
- Equilibra perfeccionismo creativo con iteración rápida y MVP
- Gestiona múltiples ideas simultáneas sin dispersarte en demasiados proyectos
- Comunica valor de innovación a stakeholders conservadores y financieros
- Mantén foco en implementación práctica vs. solo ideación creativa

**💰 Valoración de Mercado para Innovadores:**
- **Innovation Roles**: $2M-4M CLP (junior a senior)
- **Creative Leadership**: $3M-6M CLP (head/director level)
- **Entrepreneurship**: Variable, alto potencial upside con equity
- **Innovation Consulting**: $150-300 USD/hora para freelance

**🔮 Tendencias Futuras Relevantes para tu Perfil:**
- **AI-Human Collaboration**: Creatividad aumentada por inteligencia artificial
- **Sustainable Innovation**: Innovación con propósito e impacto ambiental
- **Remote Creative Teams**: Liderazgo de equipos creativos distribuidos
- **Purpose-Driven Innovation**: Innovación alineada con valores y propósito social

Tu perfil sugiere un potencial excepcional para liderar la próxima generación de innovación en Chile, especialmente en la intersección de tecnología, creatividad y impacto social. Eres el tipo de profesional que puede transformar industrias tradicionales con enfoques disruptivos pero ejecutables, creando valor tanto económico como social.`,
    },
    {
      title: "💼 Análisis de Liderazgo Transformacional",
      emoji: "💼",
      type: "Liderazgo Transformacional",
      content: `Tu perfil de personalidad indica un líder transformacional con capacidades excepcionales para generar cambio organizacional positivo y duradero. La sinergia entre tu apertura (78%), responsabilidad (85%) y estabilidad emocional (68%) crea un perfil de liderazgo transformacional único y altamente efectivo.

**🎯 Estilo de Liderazgo Transformacional Completo:**

**Visión Inspiradora**: Tu alta apertura te permite crear visiones futuras compelling que motivan genuinamente a los equipos. Puedes articular el "por qué" detrás del cambio de manera que resuene emocionalmente y genere compromiso auténtico.

**Ejecución Sistemática**: Tu responsabilidad elevada asegura que las visiones inspiradoras se traduzcan en planes concretos, hitos medibles y resultados tangibles. Esta combinación visión-ejecución es extraordinariamente rara en líderes.

**Influencia Positiva**: Con extraversión 72% y agreeableness 65%, ejerces influencia a través de la inspiración más que la autoridad, creando seguidores comprometidos que actúan por convicción, no por obligación.

**🏢 Oportunidades de Liderazgo Transformacional en Chile:**

**Transformación Digital Corporativa**:
- Chief Digital Officer en bancos tradicionales (Banco de Chile, BCI, Santander)
- VP of Digital Transformation en retail (Falabella, Ripley, Paris)
- Director de Innovación en empresas manufactureras (CMPC, CAP, Arauco)
- Head of Digital Strategy en telecomunicaciones (Entel, Movistar, WOM)

**Liderazgo en Startups y Scale-ups**:
- CEO/Co-founder en startups de impacto social y tecnológico
- Chief Growth Officer en scale-ups con potencial unicornio
- Head of Operations en empresas en rápido crecimiento
- VP of People & Culture en organizaciones innovadoras

**Consultoría de Cambio y Transformación**:
- Change Management Partner en Big 4 (Deloitte, PwC, KPMG, EY)
- Transformation Lead en boutiques especializadas
- Executive Coach certificado para C-suite y equipos directivos
- Organizational Development Consultant independiente

**🚀 Capacidades de Transformación Específicas:**

**Gestión del Cambio**: Tu estabilidad emocional te permite navegar la resistencia al cambio con calma, persistencia y empatía, manteniendo el rumbo durante períodos de incertidumbre.

**Comunicación Adaptativa**: Puedes ajustar tu mensaje y estilo según la audiencia, desde técnicos especializados hasta ejecutivos senior, asegurando comprensión y buy-in.

**Construcción de Coaliciones**: Tu perfil social te permite crear alianzas estratégicas cross-funcionales para impulsar iniciativas de cambio complejas y multidisciplinarias.

**📊 Métricas de Impacto Potencial como Líder Transformacional:**

**Engagement de Equipos**: +40% en equipos que lideras vs. promedio organizacional
**Retención de Talento**: +35% comparado con otros líderes en la organización  
**Velocidad de Implementación**: +50% en proyectos de cambio y transformación
**Satisfacción de Stakeholders**: +45% en iniciativas lideradas por ti
**ROI de Transformación**: +30% en proyectos de cambio organizacional

**🎯 Desarrollo de Liderazgo Transformacional Avanzado:**

1. **Change Management Certification**: Prosci, Kotter, o ADKAR methodologies
2. **Executive Coaching Training**: ICF credentialed programs (PCC o MCC)
3. **Systems Leadership**: Programas especializados en MIT, Stanford, o Kellogg
4. **Digital Leadership**: Certificaciones en transformación digital y liderazgo 4.0

**🌟 Sectores de Alto Impacto para Liderazgo Transformacional:**

**Sector Público y Gobierno**:
- Modernización de servicios gubernamentales y digitales
- Transformación digital municipal y regional
- Liderazgo en políticas públicas de innovación y desarrollo
- Gestión de cambio en instituciones públicas

**Educación y Formación**:
- Transformación de universidades tradicionales hacia modelos híbridos
- Liderazgo en EdTech nacional y regional
- Innovación en formación profesional y técnica
- Change management en instituciones educativas

**Salud y Bienestar**:
- Digitalización de sistemas de salud públicos y privados
- Liderazgo en telemedicina y salud digital
- Transformación de clínicas y hospitales tradicionales
- Innovación en modelos de atención sanitaria

**⚡ Ventajas Competitivas Únicas como Líder Transformacional:**

- **Autenticidad**: Tu perfil equilibrado genera confianza natural y credibilidad
- **Adaptabilidad**: Puedes liderar efectivamente en diferentes contextos, culturas y sectores
- **Resiliencia**: Mantienes el rumbo y la motivación durante períodos prolongados de incertidumbre
- **Empatía Estratégica**: Entiendes las emociones y resistencias sin perder el foco en resultados

**🎖️ Indicadores de Liderazgo Transformacional que ya posees:**

- Capacidad de inspirar visión compartida y propósito común
- Habilidad para desarrollar líderes emergentes en tu equipo
- Competencia en gestión de stakeholders complejos y diversos
- Efectividad en comunicación multi-nivel y cross-funcional
- Balance entre empuje por resultados y cuidado por las personas

**💰 Compensación de Liderazgo Transformacional (Chile 2024):**

- **Director de Transformación**: $8M-12M CLP + bonos por resultados
- **Chief Innovation Officer**: $10M-15M CLP + equity en algunos casos
- **CEO Startup/Scale-up**: Equity significativo + $6M-20M CLP base
- **Consultor Senior Independiente**: $200-400 USD/hora + retainers

**🔮 Futuro del Liderazgo Transformacional:**

Tu perfil está perfectamente alineado con las tendencias futuras del liderazgo: empático pero orientado a resultados, visionario pero pragmático, innovador pero sistemático, global pero con sensibilidad local. Eres exactamente el tipo de líder que las organizaciones chilenas necesitan para navegar exitosamente la próxima década de cambio acelerado.

**Recomendación Estratégica Final**: Considera roles donde puedas liderar transformaciones de alto impacto, especialmente en la intersección de tecnología, personas y propósito social. Tu perfil sugiere potencial excepcional para convertirte en un líder de referencia y thought leader en el ecosistema empresarial chileno, con capacidad de influir positivamente en múltiples organizaciones y sectores.`,
    },
  ]

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockResults: PersonalityResult = {
      test_type: "Big Five",
      traits: {
        openness: 78,
        conscientiousness: 85,
        extraversion: 72,
        agreeableness: 65,
        neuroticism: 32,
      },
      summary:
        "Tu perfil muestra una personalidad equilibrada con alta consciencia y apertura a nuevas experiencias. Eres una persona organizada, creativa y sociable, con buena estabilidad emocional.",
      strengths: [
        "Alta creatividad e innovación",
        "Excelente organización y planificación",
        "Habilidades sociales desarrolladas",
        "Estabilidad emocional",
        "Adaptabilidad al cambio",
        "Orientación al logro",
      ],
      challenges: [
        "Puede ser demasiado crítico consigo mismo",
        "Tendencia a sobreanalizar situaciones",
        "Necesita equilibrar perfeccionismo",
        "Puede ser impaciente con procesos lentos",
      ],
      career_recommendations: [
        "Roles de liderazgo e innovación",
        "Posiciones que requieren creatividad",
        "Trabajos con interacción social",
        "Proyectos complejos y desafiantes",
        "Ambientes dinámicos y cambiantes",
      ],
      work_style: "Colaborativo y orientado a objetivos, con preferencia por ambientes estructurados pero flexibles.",
      communication_style: "Directo pero empático, con habilidad para adaptar el mensaje según la audiencia.",
    }

    setTimeout(() => {
      setResults(mockResults)
      generateAIAnalysis(mockResults)
      setLoading(false)
    }, 1000)
  }, [])

  const generateAIAnalysis = async (personalityResults: PersonalityResult, isRegeneration = false) => {
    setAiAnalysis((prev) => ({ ...prev, loading: true }))

    // Simulate API delay for realistic experience
    await new Promise((resolve) => setTimeout(resolve, 2500))

    try {
      // Use different analysis variations for regeneration
      const currentVersion = aiAnalysis.version
      const analysisIndex = isRegeneration ? currentVersion % analysisVariations.length : 0
      const selectedAnalysis = analysisVariations[analysisIndex]

      const mockAnalysis = `**${selectedAnalysis.title}**

${selectedAnalysis.content}`

      setAiAnalysis((prev) => ({
        analysis: mockAnalysis,
        loading: false,
        version: prev.version + (isRegeneration ? 1 : 0),
        analysisType: selectedAnalysis.type,
      }))

      if (isRegeneration) {
        toast({
          title: `✨ ${selectedAnalysis.emoji} Nuevo Análisis Generado`,
          description: `${selectedAnalysis.type} - Versión ${currentVersion + 1}`,
          duration: 5000,
        })
      } else {
        toast({
          title: "🧠 Análisis AI Generado",
          description: "Se ha generado un análisis completo basado en tu perfil de personalidad.",
          duration: 3000,
        })
      }
    } catch (error) {
      console.error("Error generating AI analysis:", error)
      setAiAnalysis((prev) => ({
        analysis: "Error generando análisis. Por favor, intenta nuevamente.",
        loading: false,
        version: prev.version,
        analysisType: prev.analysisType,
      }))
    }
  }

  const getTraitInfo = (trait: string) => {
    const traits = {
      openness: {
        name: "Apertura",
        icon: Eye,
        color: "text-purple-600",
        bgColor: "bg-purple-100",
        description: "Creatividad, curiosidad intelectual, apertura a nuevas experiencias",
      },
      conscientiousness: {
        name: "Responsabilidad",
        icon: Target,
        color: "text-blue-600",
        bgColor: "bg-blue-100",
        description: "Organización, disciplina, orientación al logro",
      },
      extraversion: {
        name: "Extraversión",
        icon: Users,
        color: "text-green-600",
        bgColor: "bg-green-100",
        description: "Sociabilidad, asertividad, búsqueda de estimulación",
      },
      agreeableness: {
        name: "Amabilidad",
        icon: Heart,
        color: "text-pink-600",
        bgColor: "bg-pink-100",
        description: "Cooperación, confianza, empatía",
      },
      neuroticism: {
        name: "Neuroticismo",
        icon: Zap,
        color: "text-orange-600",
        bgColor: "bg-orange-100",
        description: "Estabilidad emocional, manejo del estrés",
      },
    }
    return traits[trait as keyof typeof traits]
  }

  const downloadResults = () => {
    if (!results) return

    const currentAnalysis = analysisVariations.find((v) => v.type === aiAnalysis.analysisType) || analysisVariations[0]

    const resultsText = `
PERSONALITY ASSESSMENT RESULTS - COMPREHENSIVE REPORT
====================================================

📊 ASSESSMENT DETAILS
Test Type: ${results.test_type}
Generated on: ${new Date().toLocaleDateString("es-CL")}
Analysis Version: ${aiAnalysis.version}
Analysis Type: ${aiAnalysis.analysisType}
Analysis Focus: ${currentAnalysis.title}

🧠 PERSONALITY TRAITS BREAKDOWN
===============================
${Object.entries(results.traits)
  .map(([trait, score]) => {
    const traitInfo = getTraitInfo(trait)
    const level = getScoreLevel(score)
    return `${traitInfo.name}: ${score}% (${level.level})
   └─ ${traitInfo.description}`
  })
  .join("\n\n")}

📋 EXECUTIVE SUMMARY
===================
${results.summary}

💪 KEY STRENGTHS
===============
${results.strengths.map((strength, index) => `${index + 1}. ${strength}`).join("\n")}

🎯 DEVELOPMENT AREAS
===================
${results.challenges.map((challenge, index) => `${index + 1}. ${challenge}`).join("\n")}

🚀 CAREER RECOMMENDATIONS
========================
${results.career_recommendations.map((rec, index) => `${index + 1}. ${rec}`).join("\n")}

💼 WORK STYLE PROFILE
====================
${results.work_style}

🗣️ COMMUNICATION STYLE
======================
${results.communication_style}

🤖 AI ANALYSIS - ${aiAnalysis.analysisType.toUpperCase()} (VERSION ${aiAnalysis.version})
${"=".repeat(60 + aiAnalysis.analysisType.length)}

${aiAnalysis.analysis}

📈 ANALYSIS PROGRESSION LOG
==========================
This is version ${aiAnalysis.version} of your personality analysis.
Previous versions focused on different aspects of your profile:

Version 1: Initial Psychological Analysis
${aiAnalysis.version > 1 ? "Version 2: Psychological Deep Dive" : ""}
${aiAnalysis.version > 2 ? "Version 3: Executive Potential Assessment" : ""}
${aiAnalysis.version > 3 ? "Version 4: Creativity & Innovation Focus" : ""}
${aiAnalysis.version > 4 ? "Version 5: Transformational Leadership Analysis" : ""}

🔄 REGENERATION INSIGHTS
=======================
Each regeneration provides a different analytical lens:
- 🧠 Psychological: Deep personality insights and cognitive patterns
- 🚀 Executive: Leadership potential and C-level readiness  
- 🎨 Creative: Innovation capacity and creative problem-solving
- 💼 Transformational: Change leadership and organizational impact

📊 PERSONALITY SCORE SUMMARY
============================
Apertura (Openness): ${results.traits.openness}% - ${getScoreLevel(results.traits.openness).level}
Responsabilidad (Conscientiousness): ${results.traits.conscientiousness}% - ${getScoreLevel(results.traits.conscientiousness).level}
Extraversión (Extraversion): ${results.traits.extraversion}% - ${getScoreLevel(results.traits.extraversion).level}
Amabilidad (Agreeableness): ${results.traits.agreeableness}% - ${getScoreLevel(results.traits.agreeableness).level}
Neuroticismo (Neuroticism): ${results.traits.neuroticism}% - ${getScoreLevel(results.traits.neuroticism).level}

🎯 TOP TRAIT COMBINATIONS
=========================
Your strongest trait combination: ${Object.entries(results.traits)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 2)
      .map(([trait]) => getTraitInfo(trait).name)
      .join(" + ")}

This combination suggests: ${
      results.traits.conscientiousness > 80 && results.traits.openness > 75
        ? "Exceptional potential for innovative leadership roles"
        : results.traits.extraversion > 70 && results.traits.agreeableness > 60
          ? "Strong collaborative leadership capabilities"
          : "Balanced personality with diverse career options"
    }

📞 NEXT STEPS & RECOMMENDATIONS
==============================
Based on this ${aiAnalysis.analysisType} analysis (v${aiAnalysis.version}):

1. Consider roles that leverage your top traits
2. Develop areas identified in the challenges section
3. Explore career paths mentioned in the AI analysis
4. Use this report for career coaching conversations
5. Regenerate analysis for different perspectives

---
Report generated by Career Development Platform
Analysis powered by GPT-4 AI
© ${new Date().getFullYear()} - Confidential Career Assessment
  `

    const blob = new Blob([resultsText], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url

    // Enhanced filename with analysis type and timestamp
    const timestamp = new Date().toISOString().split("T")[0]
    const analysisTypeSlug = aiAnalysis.analysisType.toLowerCase().replace(/\s+/g, "-")
    a.download = `personality-analysis-${analysisTypeSlug}-v${aiAnalysis.version}-${timestamp}.txt`

    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "📄 Análisis Descargado",
      description: `${aiAnalysis.analysisType} v${aiAnalysis.version} - ${Math.round(resultsText.length / 1024)}KB descargado`,
      duration: 4000,
    })
  }

  const printResults = () => {
    window.print()
  }

  const shareResults = async () => {
    if (!results) return

    const topTraits = Object.entries(results.traits)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 2)
      .map(([trait]) => getTraitInfo(trait).name)

    const shareText = `¡Acabo de completar una evaluación integral de personalidad! 🧠

Rasgos principales: ${topTraits.join(", ")}
Test: ${results.test_type}
Análisis: ${aiAnalysis.analysisType} v${aiAnalysis.version}

Descubre tu perfil de personalidad: ${window.location.origin}/personality-test`

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Resultados de Evaluación de Personalidad",
          text: shareText,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      navigator.clipboard.writeText(shareText)
      toast({
        title: "📋 Resultados Copiados",
        description: "Los resultados han sido copiados al portapapeles.",
      })
    }
  }

  const regenerateAIAnalysis = () => {
    if (results && !aiAnalysis.loading) {
      generateAIAnalysis(results, true)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Analizando tu personalidad...</p>
        </div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-center py-12">
          <p>No se encontraron resultados. Por favor, completa la evaluación primero.</p>
        </div>
      </div>
    )
  }

  const radarData = Object.entries(results.traits).map(([trait, score]) => {
    const traitInfo = getTraitInfo(trait)
    return {
      name: traitInfo.name,
      score: score,
    }
  })

  return (
    <div className="container mx-auto p-6 max-w-6xl print:max-w-none">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Resultados de Evaluación de Personalidad</h1>
        <p className="text-gray-600">Análisis completo basado en el modelo Big Five</p>
        <div className="flex justify-center gap-2 mt-4 print:hidden">
          <Button onClick={downloadResults} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Descargar
          </Button>
          <Button onClick={printResults} variant="outline" size="sm">
            <Printer className="w-4 h-4 mr-2" />
            Imprimir
          </Button>
          <Button onClick={shareResults} variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Compartir
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 print:hidden">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="detailed">Análisis Detallado</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Radar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Perfil de Personalidad
              </CardTitle>
              <CardDescription>Visualización de tus cinco grandes rasgos de personalidad</CardDescription>
            </CardHeader>
            <CardContent>
              <PersonalityRadarChart data={radarData} />
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen Ejecutivo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{results.summary}</p>
            </CardContent>
          </Card>

          {/* Strengths and Challenges */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <TrendingUp className="w-5 h-5" />
                  Fortalezas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {results.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <Shield className="w-5 h-5" />
                  Áreas de Desarrollo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {results.challenges.map((challenge, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{challenge}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Career Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Recomendaciones de Carrera
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {results.career_recommendations.map((rec, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
                    </div>
                    <span className="text-gray-700">{rec}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-6">
          {/* Detailed Traits Analysis */}
          <div className="grid gap-6">
            {Object.entries(results.traits).map(([trait, score]) => {
              const traitInfo = getTraitInfo(trait)
              const Icon = traitInfo.icon
              const level = getScoreLevel(score)

              return (
                <Card key={trait}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${traitInfo.bgColor}`}>
                        <Icon className={`w-5 h-5 ${traitInfo.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span>{traitInfo.name}</span>
                          <Badge variant="outline" className={level.color}>
                            {score}% - {level.level}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 font-normal mt-1">{traitInfo.description}</p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Progress value={score} className="h-3" />
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Work and Communication Style */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Estilo de Trabajo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{results.work_style}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estilo de Comunicación</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{results.communication_style}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-600" />
                  Análisis AI con GPT-4
                  {aiAnalysis.version > 1 && (
                    <Badge variant="secondary" className="ml-2">
                      v{aiAnalysis.version}
                    </Badge>
                  )}
                  <Badge variant="outline" className="ml-2 text-xs">
                    {aiAnalysis.analysisType}
                  </Badge>
                </div>
                {!aiAnalysis.loading && (
                  <Button
                    onClick={regenerateAIAnalysis}
                    variant="outline"
                    size="sm"
                    className="print:hidden bg-transparent hover:bg-blue-50 transition-all duration-200"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Regenerar Análisis
                    <Sparkles className="w-3 h-3 ml-1 text-yellow-500" />
                  </Button>
                )}
              </CardTitle>
              <CardDescription>
                Insights profundos generados por inteligencia artificial - {aiAnalysis.analysisType}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {aiAnalysis.loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Generando análisis con GPT-4...</p>
                    <p className="text-sm text-gray-500 mt-2">Creando insights personalizados</p>
                    <div className="flex justify-center mt-4">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="prose max-w-none">
                  <div
                    className="text-gray-700 leading-relaxed whitespace-pre-line text-sm"
                    dangerouslySetInnerHTML={{
                      __html: aiAnalysis.analysis
                        .replace(/\*\*(.*?)\*\*/g, "<strong class='text-gray-900 font-semibold'>$1</strong>")
                        .replace(/\n/g, "<br />"),
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
