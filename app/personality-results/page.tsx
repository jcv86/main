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
          Personalidad
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

  // Chilean-adapted analysis variations with local context
  const analysisVariations = [
    {
      title: "🧠 Análisis Psicológico Profundo - Contexto Chileno",
      emoji: "🧠",
      type: "Psicológico Profundo",
      content: `Tu perfil de personalidad revela una combinación excepcional de creatividad estructurada y liderazgo empático, especialmente valorada en el contexto laboral chileno actual. Con una puntuación alta en Apertura (78%) y Responsabilidad (85%), demuestras una rara capacidad para equilibrar la innovación con la ejecución práctica.

**🎯 Insights Clave para el Mercado Chileno:**

**Perfil Cognitivo Adaptado**: Tu alta apertura combinada con consciencia elevada te posiciona como un "solucionador creativo" - un perfil muy buscado en el ecosistema de startups chilenas y empresas en transformación digital. Esta combinación es especialmente valiosa en roles de liderazgo de producto o consultoría estratégica en Santiago y regiones.

**Estilo de Liderazgo Chileno**: Tu extraversión moderada-alta (72%) junto con agreeableness equilibrada (65%) indica un estilo de liderazgo colaborativo pero decisivo, muy alineado con la cultura empresarial chilena que valora tanto la cercanía personal como los resultados. Según la Encuesta Bicentenario UC, los chilenos valoran líderes que "saben escuchar pero también tomar decisiones".

**Ventaja Competitiva Local**: Tu bajo neuroticismo (32%) es una fortaleza significativa en el contexto chileno, donde según estudios de INJUV, el 32% de jóvenes menciona "tener pega" como su mayor preocupación. Tu estabilidad emocional te permite navegar la incertidumbre laboral con mayor confianza.

**🏢 Oportunidades Estratégicas en Chile:**

**Ecosistema Tech Nacional**:
- **NotCo** (Las Condes): Product Manager Senior - Liderazgo en foodtech
- **Fintual** (Providencia): Head of Growth - Fintech en expansión
- **Cornershop by Uber** (Santiago): Innovation Lead - E-commerce
- **Chiper** (Ñuñoa): Director de Producto - Retail tech emergente
- **Betterfly** (Las Condes): VP Strategy - Insurtech con impacto social

**Consultoría Estratégica Local**:
- **McKinsey Chile** (Las Condes): Consultant/Engagement Manager
- **BCG Santiago** (Providencia): Project Leader
- **Deloitte Chile** (Santiago Centro): Senior Manager Strategy
- **EY Chile** (Las Condes): Advisory Senior Consultant

**Corporativo Tradicional en Transformación**:
- **Banco de Chile**: Gerente de Innovación Digital
- **Falabella**: Director de Transformación Customer Experience
- **CMPC**: Head of Digital Strategy
- **Entel**: Gerente de Nuevos Negocios

**📈 Desarrollo Profesional Contextualizado:**

1. **Design Thinking Chileno**: Participa en programas de la UC o Adolfo Ibáñez que integran metodologías globales con casos chilenos
2. **Metodologías Ágiles Locales**: Certificaciones Scrum con foco en empresas chilenas (muchas disponibles en Santiago)
3. **Liderazgo Adaptativo**: Programas ejecutivos en ESE Business School o UAI que entienden la cultura empresarial local

**⚠️ Consideraciones Culturales Chilenas:**
- Tu perfeccionismo puede chocar con la cultura del "pituto" (contactos) - equilibra excelencia técnica con networking local
- En Chile valoramos la "buena onda" - tu estabilidad emocional es perfecta para esto
- Considera que en empresas familiares chilenas (muchas en el mercado) la lealtad personal es tan importante como la competencia técnica

**💰 Expectativas Salariales Realistas (Chile 2024):**
- **Roles junior**: $1.200.000 - $1.800.000 CLP (considerando que 68% de jóvenes chilenos nunca ha participado en voluntariados, priorizando estabilidad económica)
- **Roles senior**: $2.500.000 - $4.000.000 CLP
- **Liderazgo**: $4.000.000 - $8.000.000 CLP
- **Bonos variables**: Comunes en startups chilenas (equity + performance)

**🌟 Contexto Cultural Relevante:**
Según estudios recientes, para los jóvenes chilenos "lo que más importa es trabajar en algo que les guste y los haga felices" - tu perfil de alta apertura y responsabilidad te permite exactamente eso. Tu combinación de creatividad, organización y estabilidad emocional es altamente valorada en la economía digital chilena actual.

**🎯 Recomendación Específica para Chile:**
Considera roles en la intersección de innovación y ejecución, especialmente en empresas que estén digitalizándose o expandiéndose regionalmente desde Chile. Tu perfil te posiciona en el **top 15%** de candidatos para roles de liderazgo en el mercado chileno, donde la combinación de creatividad estructurada y estabilidad emocional es especialmente escasa y valorada.`,
    },
    {
      title: "🚀 Análisis de Potencial Ejecutivo - Mercado Chileno",
      emoji: "🚀",
      type: "Potencial Ejecutivo",
      content: `Tu combinación única de rasgos de personalidad te posiciona como un líder natural con gran potencial ejecutivo en el contexto empresarial chileno. El equilibrio entre tu creatividad (Apertura 78%) y disciplina (Responsabilidad 85%) es extraordinario y especialmente valorado en la cultura de negocios nacional.

**🎯 Perfil Ejecutivo para Chile:**

**Capacidad de Innovación Contextualizada**: Tu alta apertura te permite ver oportunidades donde otros ven problemas, una habilidad crucial en el mercado chileno que está en plena transformación digital. Esta visión estratégica es ideal para roles de C-level en empresas chilenas que buscan expandirse regionalmente o modernizar sus operaciones.

**Gestión de Equipos Estilo Chileno**: Con extraversión 72% y agreeableness 65%, tienes el perfil perfecto para liderar equipos diversos en el contexto cultural chileno, donde según la literatura local, se valora tanto la cercanía personal como la orientación a resultados. Puedes inspirar sin intimidar, crucial en la cultura empresarial nacional.

**Resistencia al Estrés en Contexto Local**: Tu bajo neuroticismo (32%) te convierte en un líder confiable bajo presión, especialmente valioso considerando que según ENADEL, las empresas chilenas buscan líderes que puedan navegar la incertidumbre económica regional con estabilidad.

**🏆 Oportunidades Ejecutivas Específicas en Chile:**

**Startups y Scale-ups Nacionales**:
- **Fintual**: Chief Product Officer - Fintech líder en Chile y expansión LATAM
- **NotCo**: VP of Operations Chile - Foodtech unicornio con base en Santiago
- **Cornershop**: Head of Growth Chile - E-commerce con respaldo de Uber
- **Chiper**: Chief Technology Officer - Retail tech en crecimiento acelerado
- **Betterfly**: VP of Strategy - Insurtech con propósito social (muy valorado en Chile)

**Corporativo Tradicional Chileno**:
- **Banco de Chile**: Gerente General Sucursal / Director de Innovación
- **BCI**: VP de Transformación Digital y Customer Experience
- **Falabella**: Director Regional de E-commerce y Omnicanalidad
- **Ripley**: Gerente General División Digital
- **CMPC**: Director de Nuevos Negocios y Sostenibilidad
- **CAP**: Head of Digital Transformation
- **Entel**: VP de Estrategia y Desarrollo de Negocios
- **Movistar Chile**: Director de Innovación y Productos Digitales

**Consultoría Estratégica con Foco Local**:
- **McKinsey Chile**: Principal (track a Partner)
- **BCG Santiago**: Director con especialización en mercados emergentes
- **Deloitte Chile**: Managing Director Advisory
- **PwC Chile**: Partner Strategy & Operations
- **EY Chile**: Partner Consulting con foco en transformación

**📊 Proyección de Carrera Ejecutiva Chilena (5 años):**

**Año 1-2**: Senior Manager/Director ($3.000.000-5.000.000 CLP)
- Liderazgo de equipos de 10-20 personas en Santiago/regiones
- Responsabilidad P&L de $500M-1B CLP
- Proyectos de transformación digital con impacto nacional

**Año 3-4**: VP/Gerente General ($6.000.000-10.000.000 CLP)
- Liderazgo de múltiples equipos (50+ personas)
- Responsabilidad P&L de $2B-5B CLP
- Estrategia corporativa y expansión regional (Perú, Colombia)

**Año 5+**: C-Level/Socio ($12.000.000+ CLP)
- CEO/COO de empresas medianas chilenas
- Partner en consultoras internacionales con base en Chile
- Board member en múltiples empresas del ecosistema nacional

**🎯 Estrategias de Desarrollo Ejecutivo Localizadas:**

1. **Executive MBA Nacional**: 
   - **UC**: Programa con fuerte networking empresarial chileno
   - **PUC**: Enfoque en liderazgo y ética empresarial
   - **UAI**: Especialización en innovación y emprendimiento
   - **Adolfo Ibáñez**: Conexiones con ecosistema financiero nacional

2. **Board Experience Chileno**: 
   - Directorios de startups en Start-Up Chile
   - ONGs con impacto social (valorado en cultura chilena)
   - Asociaciones gremiales (CPC, SOFOFA, ACTI)

3. **Executive Mentoring Local**: 
   - Conecta con CEOs del ranking El Mercurio/Revista Capital
   - Participa en eventos de ICARE y ESE Business School
   - Networking en Círculo de Innovación y Endeavor Chile

4. **Thought Leadership Chileno**: 
   - Columnas en El Mercurio, La Tercera, o Pulso
   - Speaking en eventos como ENADE, Chile Digital Summit
   - Participación en think tanks como Libertad y Desarrollo o CIEPLAN

**⚡ Ventajas Competitivas en el Contexto Chileno:**

- **Equilibrio Cultural**: Puedes navegar tanto la formalidad corporativa como la cercanía personal valorada en Chile
- **Adaptabilidad Regional**: Capacidad para liderar tanto en Santiago como en regiones
- **Visión Global con Sensibilidad Local**: Entiendes tendencias internacionales pero las adaptas al contexto chileno
- **Estabilidad en Crisis**: Históricamente Chile ha enfrentado volatilidad (social, económica) - tu perfil aporta calma

**💼 Sectores de Alto Impacto para Liderazgo Ejecutivo:**

- **FinTech**: Revolución de servicios financieros (bancarización, inclusión)
- **HealthTech**: Transformación digital de salud (telemedicina, FONASA digital)
- **EdTech**: Innovación educativa post-pandemia (híbrido, personalización)
- **Sustainability/ESG**: Economía circular, minería sustentable, energías renovables
- **AgTech**: Agricultura de precisión (Chile como potencia agroexportadora)

**🌟 Consideraciones Culturales para Ejecutivos:**

Según "Siútico" de Óscar Contardo y estudios culturales chilenos, el liderazgo exitoso en Chile requiere:
- **Cercanía sin perder autoridad**: Tu perfil equilibrado es perfecto para esto
- **Sensibilidad a la desigualdad**: Liderazgo inclusivo y consciente de brechas sociales
- **Orientación familiar**: Equilibrio trabajo-vida valorado en cultura chilena
- **Networking auténtico**: Relaciones genuinas vs. transaccionales

Tu perfil sugiere un potencial ejecutivo excepcional para liderar la próxima generación de empresas chilenas que compiten globalmente pero mantienen raíces locales fuertes.`,
    },
    {
      title: "🎨 Análisis de Creatividad e Innovación - Ecosistema Chileno",
      emoji: "🎨",
      type: "Creatividad e Innovación",
      content: `Tu perfil revela un innovador nato con capacidad excepcional para materializar ideas creativas en el contexto del ecosistema de innovación chileno. La combinación de alta apertura (78%) con responsabilidad elevada (85%) es el sello distintivo de los grandes innovadores que pueden tanto crear como ejecutar en el mercado nacional.

**🧠 Perfil del Innovador Chileno:**

**Pensamiento Divergente Contextualizado**: Tu alta apertura te permite generar múltiples soluciones creativas a problemas específicamente chilenos - desde la inclusión financiera hasta la sostenibilidad minera. Esta capacidad de "pensar fuera de la caja" es especialmente valiosa en un país que busca diversificar su matriz económica más allá del cobre.

**Ejecución Creativa Local**: A diferencia de muchos creativos, tu alta responsabilidad te permite llevar ideas desde la conceptualización hasta la implementación exitosa en el contexto regulatorio y cultural chileno. Esta combinación es extremadamente rara y valiosa en el ecosistema nacional.

**Colaboración Innovadora Chilena**: Tu extraversión moderada-alta (72%) te permite liderar procesos de innovación colaborativa, facilitando la co-creación con equipos diversos, crucial en un país donde según estudios culturales, la colaboración y "buena onda" son fundamentales para el éxito.

**🎯 Sectores Ideales para Innovación en Chile:**

**Industrias Creativas y Marketing Nacional**:
- **Geometry Chile** (Providencia): Director Creativo con foco en marcas locales
- **BBDO Chile** (Las Condes): Head of Innovation para campañas nacionales
- **Ogilvy Santiago**: Creative Strategist especializado en consumer insights chilenos
- **DDB Chile**: Brand Innovation Manager para marcas como CCU, Nestlé Chile
- **Acid Labs** (Ñuñoa): Creative Strategist en marketing digital para startups chilenas

**Tecnología e Innovación Digital Local**:
- **Platanus** (Providencia): Product Designer para soluciones B2B chilenas
- **IDA Chile** (Santiago): Innovation Manager en consultora tech nacional
- **Banco Estado**: UX Research Lead para servicios financieros inclusivos
- **BCI**: Head of Digital Innovation en banca digital
- **Santander Chile**: Innovation Manager para productos fintech locales

**Emprendimiento e Impacto Social Chileno**:
- **Start-Up Chile**: Mentor/Advisor para startups de impacto social
- **Fundación Chile**: Director de Innovación en proyectos de desarrollo nacional
- **Endeavor Chile**: Innovation Consultant para scale-ups locales
- **CORFO**: Especialista en programas de innovación y emprendimiento
- **Socialab**: Social Innovation Lead para desafíos nacionales

**🚀 Metodologías Adaptadas al Contexto Chileno:**

1. **Design Thinking Chileno**: 
   - Programas UC Design Lab con casos de empresas nacionales
   - Workshops en Adolfo Ibáñez con foco en innovación social
   - Certificaciones locales que integran cultura y metodología

2. **Lean Startup Nacional**: 
   - Adaptado a regulaciones chilenas (SII, SERNAC, etc.)
   - Validación con usuarios chilenos y sus particularidades culturales
   - Iteración considerando estacionalidad y ciclos económicos locales

3. **Agile Innovation Local**: 
   - Frameworks adaptados a la cultura laboral chilena
   - Considerando feriados, vacaciones de invierno, y ritmos nacionales
   - Integración con equipos remotos desde regiones

**💡 Proyectos de Alto Impacto para Chile:**

**Innovación Social y Sostenibilidad Nacional**:
- **Transporte Urbano**: Soluciones para congestión en Santiago y ciudades intermedias
- **Vivienda Social**: Innovación en construcción sustentable y accesible
- **Inclusión Financiera**: Productos para sectores no bancarizados
- **Educación Rural**: Tecnología educativa para zonas aisladas
- **Adulto Mayor**: Soluciones tech para envejecimiento poblacional chileno

**Tecnología con Propósito Chileno**:
- **EdTech Nacional**: Plataformas educativas adaptadas al currículum chileno (PAES, no SAT)
- **HealthTech Local**: Telemedicina integrada con FONASA y sistema público
- **AgTech Chileno**: Agricultura de precisión para exportación (uvas, paltas, salmón)
- **CleanTech Nacional**: Energías renovables aprovechando geografía única
- **MiningTech**: Innovación en minería sustentable (cobre, litio)

**🎨 Desarrollo de Habilidades Creativas Localizadas:**

1. **Prototipado Rápido Chileno**: 
   - Herramientas adaptadas a proveedores locales
   - Fabricación local vs. importación
   - Considerando costos en pesos chilenos

2. **Storytelling Nacional**: 
   - Narrativas que resuenen con identidad chilena
   - Referencias culturales locales (desde Violeta Parra hasta Mon Laferte)
   - Humor y códigos comunicacionales chilenos

3. **Systems Thinking Local**: 
   - Ecosistemas de innovación chilenos (universidades, CORFO, privados)
   - Stakeholders específicos del contexto nacional
   - Regulaciones y políticas públicas de innovación

**🌟 Ecosistema de Innovación Chileno Específico:**

**Incubadoras y Aceleradoras Nacionales**:
- **Start-Up Chile** (CORFO): Programa gubernamental líder en LATAM
- **Chrysalis** (UC): Incubadora universitaria con foco tech
- **Wayra Chile** (Telefónica): Aceleradora con conexión corporativa
- **NXTP Labs**: Aceleradora regional con oficina en Santiago
- **Telefónica Open Future**: Innovación abierta corporativa

**Hubs de Innovación Locales**:
- **Huechuraba Innovation District**: Cluster tech en desarrollo
- **Las Condes Innovation Hub**: Concentración de startups y corporativos
- **Providencia Tech Corridor**: Eje de empresas tecnológicas
- **Ñuñoa Creative District**: Foco en industrias creativas y design

**Centros de I+D Chilenos**:
- **Universidad de Chile**: Facultad de Ingeniería y Ciencias
- **PUC**: Escuela de Ingeniería con fuerte vinculación industrial
- **Universidad Técnica Federico Santa María**: Innovación en ingeniería
- **INRIA Chile**: Centro de investigación en ciencias de la computación

**⚠️ Desafíos Específicos del Innovador Chileno:**

- **Financiamiento Local**: Equilibra perfeccionismo con recursos limitados del ecosistema
- **Talento Técnico**: Escasez de desarrolladores - considera formación de equipos
- **Mercado Pequeño**: Piensa en escalabilidad regional desde el diseño
- **Regulación**: Navega marcos regulatorios específicos chilenos
- **Cultura de Riesgo**: Educa sobre innovación en contexto más conservador

**💰 Valoración de Mercado para Innovadores Chilenos:**

- **Innovation Roles**: $2.000.000-4.000.000 CLP (junior a senior)
- **Creative Leadership**: $3.000.000-6.000.000 CLP (head/director level)
- **Entrepreneurship**: Variable, con equity y potencial upside regional
- **Innovation Consulting**: $80.000-200.000 CLP/día para freelance local

**🔮 Tendencias Futuras Relevantes para Chile:**

- **AI-Human Collaboration**: Creatividad aumentada adaptada al contexto local
- **Sustainable Innovation**: Innovación con propósito alineada con agenda 2030 Chile
- **Remote Creative Teams**: Liderazgo de equipos distribuidos Santiago-regiones
- **Purpose-Driven Innovation**: Innovación con impacto social valorada culturalmente

Tu perfil sugiere un potencial excepcional para liderar la próxima generación de innovación chilena, especialmente en la intersección de tecnología, creatividad e impacto social. Eres el tipo de profesional que puede transformar industrias tradicionales chilenas con enfoques disruptivos pero culturalmente sensibles, creando valor económico y social en el contexto nacional.`,
    },
    {
      title: "💼 Análisis de Liderazgo Transformacional - Contexto Empresarial Chileno",
      emoji: "💼",
      type: "Liderazgo Transformacional",
      content: `Tu perfil de personalidad indica un líder transformacional con capacidades excepcionales para generar cambio organizacional positivo en el contexto empresarial chileno. La sinergia entre tu apertura (78%), responsabilidad (85%) y estabilidad emocional (68%) crea un perfil de liderazgo transformacional único y altamente efectivo para el mercado nacional.

**🎯 Estilo de Liderazgo Transformacional Chileno:**

**Visión Inspiradora Contextualizada**: Tu alta apertura te permite crear visiones futuras compelling que motivan genuinamente a los equipos chilenos. Puedes articular el "por qué" del cambio de manera que resuene con los valores culturales nacionales: familia, estabilidad, progreso colectivo y orgullo nacional.

**Ejecución Sistemática Local**: Tu responsabilidad elevada asegura que las visiones se traduzcan en planes concretos adaptados al contexto chileno: considerando regulaciones locales, cultura laboral nacional, y ciclos económicos específicos. Esta combinación visión-ejecución es extraordinariamente rara en el mercado ejecutivo chileno.

**Influencia Positiva Chilena**: Con extraversión 72% y agreeableness 65%, ejerces influencia a través de la inspiración más que la autoridad, creando seguidores comprometidos que actúan por convicción. Esto es especialmente efectivo en la cultura chilena donde, según estudios culturales, se valora la cercanía personal y la autenticidad en el liderazgo.

**🏢 Oportunidades de Liderazgo Transformacional en Chile:**

**Transformación Digital Corporativa Nacional**:
- **Banco de Chile**: Chief Digital Officer - Modernización del banco más tradicional
- **BCI**: VP of Digital Transformation - Liderazgo en banca digital
- **Banco Estado**: Director de Innovación - Inclusión financiera nacional
- **Santander Chile**: Head of Digital Strategy - Transformación customer-centric
- **Falabella**: VP Digital Transformation - Omnicanalidad retail
- **Ripley**: Director de Transformación Customer Experience
- **Paris**: Chief Innovation Officer - Modernización retail tradicional
- **CMPC**: Director de Transformación Digital Industrial
- **CAP**: Head of Digital Strategy - Modernización siderúrgica
- **Arauco**: VP de Innovación y Sostenibilidad

**Telecomunicaciones y Tecnología**:
- **Entel**: VP de Transformación y Nuevos Negocios
- **Movistar Chile**: Director de Innovación Digital
- **WOM**: Head of Digital Strategy - Disrupción en telecomunicaciones
- **GTD**: Chief Transformation Officer - Modernización empresarial

**Liderazgo en Startups y Scale-ups Nacionales**:
- **Fintual**: Chief Operating Officer - Escalamiento fintech
- **NotCo**: VP of People & Culture Chile - Cultura organizacional
- **Cornershop**: Head of Operations Chile - Optimización logística
- **Chiper**: Chief Growth Officer - Expansión nacional y regional
- **Betterfly**: VP of Impact - Liderazgo con propósito social

**Consultoría de Cambio Especializada**:
- **Deloitte Chile**: Change Management Partner - Transformaciones corporativas
- **PwC Chile**: Transformation Lead - Modernización empresarial
- **KPMG Chile**: Digital Transformation Director
- **EY Chile**: People Advisory Partner - Cambio organizacional
- **McKinsey Chile**: Change Management Specialist

**🚀 Capacidades de Transformación en Contexto Chileno:**

**Gestión del Cambio Cultural**: Tu estabilidad emocional te permite navegar la resistencia al cambio típica en organizaciones chilenas tradicionales, manteniendo calma y persistencia durante períodos de incertidumbre, especialmente valorado en un contexto donde la estabilidad es culturalmente importante.

**Comunicación Adaptativa Nacional**: Puedes ajustar tu mensaje según la audiencia chilena específica: desde técnicos especializados hasta ejecutivos senior, considerando códigos culturales locales, niveles de formalidad apropiados, y referencias compartidas.

**Construcción de Coaliciones Locales**: Tu perfil social te permite crear alianzas estratégicas cross-funcionales considerando la importancia del networking y relaciones personales en la cultura empresarial chilena, donde el "pituto" y las conexiones genuinas son fundamentales.

**📊 Métricas de Impacto Potencial en Empresas Chilenas:**

**Engagement de Equipos**: +40% en equipos que lideras vs. promedio nacional
**Retención de Talento**: +35% comparado con otros líderes (crucial en mercado con escasez de talento tech)
**Velocidad de Implementación**: +50% en proyectos de cambio (importante en contexto de competencia regional)
**Satisfacción de Stakeholders**: +45% en iniciativas lideradas (valorado en cultura de consenso chilena)
**ROI de Transformación**: +30% en proyectos de cambio organizacional

**🎯 Desarrollo de Liderazgo Transformacional Chileno:**

1. **Certificaciones Locales e Internacionales**:
   - **Prosci Change Management**: Disponible en Santiago con casos chilenos
   - **Kotter Methodology**: Adaptada a contexto empresarial nacional
   - **ADKAR Model**: Implementación en empresas chilenas

2. **Executive Coaching Nacional**:
   - **ICF Chile**: Programas credenciales con coaches locales
   - **ESE Business School**: Executive coaching con enfoque chileno
   - **UAI**: Programas de liderazgo transformacional

3. **Systems Leadership Adaptado**:
   - **Programas UC**: Liderazgo sistémico con casos nacionales
   - **Adolfo Ibáñez**: Executive programs con networking local
   - **Online Internacional**: MIT, Stanford con aplicación local

**🌟 Sectores de Alto Impacto para Liderazgo Transformacional:**

**Sector Público y Gobierno**:
- **Modernización Digital**: ChileAtiende, Registro Civil, SII
- **Transformación Municipal**: Digitización de servicios locales
- **Políticas de Innovación**: CORFO, SENCE, CONICYT
- **Gestión de Crisis**: Liderazgo en emergencias (terremotos, pandemia)

**Educación Nacional**:
- **Universidades Tradicionales**: Transformación hacia modelos híbridos
- **DUOC UC/INACAP**: Modernización educación técnica
- **Colegios Particulares**: Innovación pedagógica
- **MINEDUC**: Liderazgo en políticas educativas

**Salud y Bienestar**:
- **FONASA**: Digitalización sistema público
- **Clínicas Privadas**: Transformación hacia telemedicina
- **Hospitales Públicos**: Modernización operacional
- **Farmacias**: Transformación digital del retail farmacéutico

**⚡ Ventajas Competitivas en Liderazgo Chileno:**

- **Autenticidad Cultural**: Tu perfil equilibrado genera confianza en contexto donde se valora la genuinidad
- **Adaptabilidad Regional**: Puedes liderar tanto en Santiago como en regiones, considerando diferencias culturales internas
- **Sensibilidad Social**: Entiendes desigualdades y puedes liderar transformaciones inclusivas
- **Estabilidad en Volatilidad**: Historial chileno de crisis requiere líderes que mantengan calma

**💰 Compensación de Liderazgo Transformacional Chile (2024):**

- **Director de Transformación**: $8.000.000-12.000.000 CLP + bonos por resultados
- **Chief Innovation Officer**: $10.000.000-15.000.000 CLP + equity en algunos casos
- **CEO Startup/Scale-up**: Equity significativo + $6.000.000-20.000.000 CLP base
- **Consultor Senior Independiente**: $150.000-400.000 CLP/día + retainers

**🔮 Futuro del Liderazgo Transformacional en Chile:**

Tu perfil está perfectamente alineado con las tendencias futuras del liderazgo chileno: empático pero orientado a resultados, visionario pero pragmático, innovador pero respetuoso de la cultura local, global pero con sensibilidad nacional. Eres exactamente el tipo de líder que las organizaciones chilenas necesitan para navegar exitosamente la próxima década de cambio acelerado mientras mantienen su identidad cultural.

**Recomendación Estratégica Final**: Considera roles donde puedas liderar transformaciones de alto impacto en la intersección de modernización tecnológica, desarrollo de personas y propósito social. Tu perfil sugiere potencial excepcional para convertirte en un líder de referencia en el ecosistema empresarial chileno, con capacidad de influir positivamente en múltiples organizaciones mientras contribuyes al desarrollo nacional.`,
    },
  ]

  useEffect(() => {
    // Chilean-adapted mock data
    const mockResults: PersonalityResult = {
      test_type: "Big Five - Adaptado para Chile",
      traits: {
        openness: 78,
        conscientiousness: 85,
        extraversion: 72,
        agreeableness: 65,
        neuroticism: 32,
      },
      summary:
        "Tu perfil muestra una personalidad equilibrada con alta consciencia y apertura a nuevas experiencias, especialmente valorada en el contexto laboral chileno. Eres una persona organizada, creativa y sociable, con buena estabilidad emocional - características muy buscadas en el mercado nacional.",
      strengths: [
        "Alta creatividad e innovación (valorada en ecosistema startup chileno)",
        "Excelente organización y planificación (crucial en cultura empresarial nacional)",
        "Habilidades sociales desarrolladas (importante para networking chileno)",
        "Estabilidad emocional (ventaja en mercado laboral volátil)",
        "Adaptabilidad al cambio (esencial para transformación digital)",
        "Orientación al logro (alineada con valores de progreso chilenos)",
      ],
      challenges: [
        "Puede ser demasiado crítico consigo mismo (común en cultura del esfuerzo chilena)",
        "Tendencia a sobreanalizar situaciones (equilibrar con pragmatismo local)",
        "Necesita equilibrar perfeccionismo con cultura de 'buena onda'",
        "Puede ser impaciente con procesos lentos (adaptar a ritmos institucionales chilenos)",
      ],
      career_recommendations: [
        "Roles de liderazgo e innovación en startups chilenas",
        "Posiciones que requieren creatividad en industrias tradicionales",
        "Trabajos con interacción social (valorado en cultura chilena)",
        "Proyectos complejos en transformación digital nacional",
        "Ambientes dinámicos con propósito social (importante en Chile)",
      ],
      work_style:
        "Colaborativo y orientado a objetivos, con preferencia por ambientes estructurados pero flexibles. Adaptado a la cultura laboral chilena que valora tanto los resultados como las relaciones interpersonales.",
      communication_style:
        "Directo pero empático, con habilidad para adaptar el mensaje según la audiencia chilena. Considera códigos culturales locales y la importancia de la cercanía personal en el contexto nacional.",
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
          description: `${selectedAnalysis.type} - Versión ${currentVersion + 1} (Contexto Chileno)`,
          duration: 5000,
        })
      } else {
        toast({
          title: "🧠 Análisis AI Generado",
          description: "Se ha generado un análisis completo adaptado al contexto chileno.",
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
        description:
          "Creatividad, curiosidad intelectual, apertura a nuevas experiencias (valorada en innovación chilena)",
      },
      conscientiousness: {
        name: "Responsabilidad",
        icon: Target,
        color: "text-blue-600",
        bgColor: "bg-blue-100",
        description: "Organización, disciplina, orientación al logro (esencial en cultura laboral chilena)",
      },
      extraversion: {
        name: "Extraversión",
        icon: Users,
        color: "text-green-600",
        bgColor: "bg-green-100",
        description: "Sociabilidad, asertividad, búsqueda de estimulación (importante para networking chileno)",
      },
      agreeableness: {
        name: "Amabilidad",
        icon: Heart,
        color: "text-pink-600",
        bgColor: "bg-pink-100",
        description: "Cooperación, confianza, empatía (fundamental en cultura de 'buena onda' chilena)",
      },
      neuroticism: {
        name: "Neuroticismo",
        icon: Zap,
        color: "text-orange-600",
        bgColor: "bg-orange-100",
        description: "Estabilidad emocional, manejo del estrés (ventaja en mercado laboral chileno volátil)",
      },
    }
    return traits[trait as keyof typeof traits]
  }

  const downloadResults = () => {
    if (!results) return

    const currentAnalysis = analysisVariations.find((v) => v.type === aiAnalysis.analysisType) || analysisVariations[0]

    const resultsText = `
EVALUACIÓN DE PERSONALIDAD - REPORTE INTEGRAL ADAPTADO A CHILE
==============================================================

📊 DETALLES DE LA EVALUACIÓN
Test Type: ${results.test_type}
Generado el: ${new Date().toLocaleDateString("es-CL")}
Versión del Análisis: ${aiAnalysis.version}
Tipo de Análisis: ${aiAnalysis.analysisType}
Enfoque: ${currentAnalysis.title}
Contexto: Mercado Laboral Chileno 2024

🧠 DESGLOSE DE RASGOS DE PERSONALIDAD (CONTEXTO CHILENO)
=======================================================
${Object.entries(results.traits)
  .map(([trait, score]) => {
    const traitInfo = getTraitInfo(trait)
    const level = getScoreLevel(score)
    return `${traitInfo.name}: ${score}% (${level.level})
   └─ ${traitInfo.description}`
  })
  .join("\n\n")}

📋 RESUMEN EJECUTIVO PARA EL MERCADO CHILENO
===========================================
${results.summary}

💪 FORTALEZAS CLAVE EN CONTEXTO NACIONAL
=======================================
${results.strengths.map((strength, index) => `${index + 1}. ${strength}`).join("\n")}

🎯 ÁREAS DE DESARROLLO CONSIDERANDO CULTURA CHILENA
==================================================
${results.challenges.map((challenge, index) => `${index + 1}. ${challenge}`).join("\n")}

🚀 RECOMENDACIONES DE CARRERA PARA CHILE
========================================
${results.career_recommendations.map((rec, index) => `${index + 1}. ${rec}`).join("\n")}

💼 PERFIL DE ESTILO DE TRABAJO CHILENO
=====================================
${results.work_style}

🗣️ ESTILO DE COMUNICACIÓN ADAPTADO
==================================
${results.communication_style}

🤖 ANÁLISIS IA - ${aiAnalysis.analysisType.toUpperCase()} (VERSIÓN ${aiAnalysis.version})
${"=".repeat(60 + aiAnalysis.analysisType.length)}

${aiAnalysis.analysis}

📈 REGISTRO DE PROGRESIÓN DE ANÁLISIS
====================================
Esta es la versión ${aiAnalysis.version} de tu análisis de personalidad adaptado al contexto chileno.
Las versiones anteriores se enfocaron en diferentes aspectos de tu perfil:

Versión 1: Análisis Psicológico Inicial (Contexto Chileno)
${aiAnalysis.version > 1 ? "Versión 2: Profundización Psicológica Nacional" : ""}
${aiAnalysis.version > 2 ? "Versión 3: Evaluación de Potencial Ejecutivo Chileno" : ""}
${aiAnalysis.version > 3 ? "Versión 4: Enfoque en Creatividad e Innovación Nacional" : ""}
${aiAnalysis.version > 4 ? "Versión 5: Análisis de Liderazgo Transformacional Chileno" : ""}

🔄 INSIGHTS DE REGENERACIÓN CONTEXTUALIZADA
==========================================
Cada regeneración proporciona una lente analítica diferente adaptada a Chile:
- 🧠 Psicológico: Insights profundos de personalidad y patrones cognitivos chilenos
- 🚀 Ejecutivo: Potencial de liderazgo y preparación C-level en mercado nacional
- 🎨 Creativo: Capacidad de innovación y resolución creativa de problemas locales
- 💼 Transformacional: Liderazgo de cambio e impacto organizacional en Chile

📊 RESUMEN DE PUNTUACIONES DE PERSONALIDAD
==========================================
Apertura (Openness): ${results.traits.openness}% - ${getScoreLevel(results.traits.openness).level}
Responsabilidad (Conscientiousness): ${results.traits.conscientiousness}% - ${getScoreLevel(results.traits.conscientiousness).level}
Extraversión (Extraversion): ${results.traits.extraversion}% - ${getScoreLevel(results.traits.extraversion).level}
Amabilidad (Agreeableness): ${results.traits.agreeableness}% - ${getScoreLevel(results.traits.agreeableness).level}
Neuroticismo (Neuroticism): ${results.traits.neuroticism}% - ${getScoreLevel(results.traits.neuroticism).level}

🎯 COMBINACIONES DE RASGOS MÁS FUERTES
======================================
Tu combinación de rasgos más fuerte: ${Object.entries(results.traits)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 2)
      .map(([trait]) => getTraitInfo(trait).name)
      .join(" + ")}

Esta combinación sugiere en el contexto chileno: ${
      results.traits.conscientiousness > 80 && results.traits.openness > 75
        ? "Potencial excepcional para roles de liderazgo innovador en el ecosistema nacional"
        : results.traits.extraversion > 70 && results.traits.agreeableness > 60
          ? "Fuertes capacidades de liderazgo colaborativo valoradas en la cultura empresarial chilena"
          : "Personalidad equilibrada con diversas opciones de carrera en el mercado nacional"
    }

📞 PRÓXIMOS PASOS Y RECOMENDACIONES PARA CHILE
==============================================
Basado en este análisis ${aiAnalysis.analysisType} (v${aiAnalysis.version}) adaptado al contexto chileno:

1. Considera roles que aprovechen tus rasgos principales en empresas chilenas
2. Desarrolla áreas identificadas en la sección de desafíos considerando cultura local
3. Explora caminos profesionales mencionados en el análisis IA con enfoque nacional
4. Usa este reporte para conversaciones de coaching profesional en Chile
5. Regenera análisis para diferentes perspectivas del mercado laboral chileno

🇨🇱 CONTEXTO CULTURAL CHILENO CONSIDERADO
=========================================
Este análisis ha sido adaptado considerando:
- Cultura laboral chilena y valores nacionales
- Mercado de trabajo específico de Chile
- Empresas y oportunidades locales
- Códigos de comunicación y networking chilenos
- Expectativas salariales realistas para el mercado nacional
- Tendencias de innovación y transformación digital en Chile

---
Reporte generado por Plataforma de Desarrollo Profesional
Análisis potenciado por IA GPT-4 con contexto chileno
© ${new Date().getFullYear()} - Evaluación Profesional Confidencial
Adaptado específicamente para el mercado laboral chileno
  `

    const blob = new Blob([resultsText], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url

    // Enhanced filename with Chilean context
    const timestamp = new Date().toISOString().split("T")[0]
    const analysisTypeSlug = aiAnalysis.analysisType.toLowerCase().replace(/\s+/g, "-")
    a.download = `personalidad-chile-${analysisTypeSlug}-v${aiAnalysis.version}-${timestamp}.txt`

    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "📄 Análisis Chileno Descargado",
      description: `${aiAnalysis.analysisType} v${aiAnalysis.version} - Contexto Chile - ${Math.round(resultsText.length / 1024)}KB`,
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

    const shareText = `¡Acabo de completar una evaluación integral de personalidad adaptada al contexto chileno! 🇨🇱🧠

Rasgos principales: ${topTraits.join(", ")}
Test: ${results.test_type}
Análisis: ${aiAnalysis.analysisType} v${aiAnalysis.version}
Enfoque: Mercado laboral chileno

Descubre tu perfil profesional: ${window.location.origin}/personality-test`

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Resultados de Evaluación de Personalidad - Chile",
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
          <p>Analizando tu personalidad con contexto chileno...</p>
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
      {/* Header with Chilean context */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Resultados de Evaluación de Personalidad</h1>
        <p className="text-gray-600">Análisis completo basado en el modelo Big Five - Adaptado para Chile 🇨🇱</p>
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
          <TabsTrigger value="ai-insights">AI Insights Chile</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Radar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Perfil de Personalidad - Contexto Chileno
              </CardTitle>
              <CardDescription>
                Visualización de tus cinco grandes rasgos adaptados al mercado laboral chileno
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PersonalityRadarChart data={radarData} />
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen Ejecutivo para Chile</CardTitle>
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
                  Fortalezas en Contexto Chileno
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
                  Áreas de Desarrollo Nacional
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
                Recomendaciones de Carrera para Chile
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
                <CardTitle>Estilo de Trabajo Chileno</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{results.work_style}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estilo de Comunicación Nacional</CardTitle>
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
                  Análisis AI con GPT-4 - Contexto Chileno 🇨🇱
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
                Insights profundos generados por inteligencia artificial adaptados al mercado laboral chileno -{" "}
                {aiAnalysis.analysisType}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {aiAnalysis.loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Generando análisis con GPT-4...</p>
                    <p className="text-sm text-gray-500 mt-2">Adaptando insights al contexto chileno</p>
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
                <div className="prose prose-gray max-w-none">
                  <div
                    className="whitespace-pre-wrap text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: aiAnalysis.analysis
                        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                        .replace(/\*(.*?)\*/g, "<em>$1</em>")
                        .replace(/^### (.*$)/gim, "<h3 class='text-lg font-semibold text-gray-900 mt-6 mb-3'>$1</h3>")
                        .replace(/^## (.*$)/gim, "<h2 class='text-xl font-bold text-gray-900 mt-8 mb-4'>$1</h2>")
                        .replace(/^# (.*$)/gim, "<h1 class='text-2xl font-bold text-gray-900 mt-8 mb-4'>$1</h1>")
                        .replace(/\n\n/g, "</p><p class='mb-4'>")
                        .replace(/^(.)/gm, "<p class='mb-4'>$1")
                        .replace(/<p class='mb-4'><\/p>/g, "")
                        .replace(/🇨🇱/g, '<span class="inline-block">🇨🇱</span>')
                        .replace(/(\d+\.\s)/g, '<span class="font-medium text-blue-600">$1</span>'),
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Analysis Version History */}
          {aiAnalysis.version > 1 && (
            <Card className="print:hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <RefreshCw className="w-4 h-4" />
                  Historial de Análisis Chileno
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">
                  <p className="mb-2">
                    <strong>Versión actual:</strong> {aiAnalysis.version} - {aiAnalysis.analysisType}
                  </p>
                  <p className="text-xs text-gray-500">
                    Cada regeneración proporciona una perspectiva diferente de tu perfil adaptada al contexto chileno.
                    Haz clic en "Regenerar Análisis" para explorar otros enfoques como Potencial Ejecutivo, Creatividad
                    e Innovación, o Liderazgo Transformacional.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
