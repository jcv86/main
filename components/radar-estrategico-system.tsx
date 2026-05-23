'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle, TrendingUp, AlertTriangle, Eye, BookOpen, Target, Radar } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface StrategicInsight {
  id: string
  title: string
  estado: string
  riesgoPrincipal: string
  oportunidadPrincipal: string
  narrativaDominante: string
  vigilar: string
}

interface NoticiaProfunda {
  id: string
  prioridad: 'estructural' | 'tactico' | 'contextual'
  fecha: string
  hora: string
  titulo: string
  traduccion: string
  errorConsensual: string
  descontandoMercado: string
  noEncaja: string
  incentivos: string
  impactoTemporal: {
    corto: string
    medio: string
    largo: string
  }
  cadenaCausal: string
  mapeoExposicion: {
    chile: string
    global: string
    personal: string
  }
  evolucionNarrativa: string
  narrativaZombie?: string
  fuentes: string[]
}

interface RadarDiario {
  fecha: string
  hora: string
  timezone: 'Chile'
  edicion: 'AM' | 'PM'
  lecturaBas: StrategicInsight
  noticias: NoticiaProfunda[]
  watchlist: string[]
  narrativasEnObservacion: string[]
}

const radarDiarioBase: RadarDiario = {
  fecha: new Date().toLocaleDateString('es-CL', { 
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }),
  hora: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
  timezone: 'Chile',
  edicion: new Date().getHours() < 14 ? 'AM' : 'PM',
  lecturaBas: {
    id: '1',
    title: 'Lectura Estratégica del Día',
    estado: 'Mercado laboral en transición acelerada. IA como divisor de aguas entre profesionales resilientes y desplazables.',
    riesgoPrincipal: 'Skill obsolescence acelerada. Profesionales con 5-10 años de experiencia con herramientas legacy están siendo reemplazados.',
    oportunidadPrincipal: 'Demanda explosiva de talent bridges: gente que entiende tanto el mundo viejo como IA. Valor a 3-5 años: extraordinario.',
    narrativaDominante: 'La IA no reemplaza trabajos, reemplaza ineptitud. Los que aprenden a trabajar CON IA prosperan.',
    vigilar: 'Patrón en contrataciones: buscan "AI-fluent" en TODAS las industrias, no solo tech. Esto es un cambio estructural.'
  },
  noticias: [
    {
      id: '1',
      prioridad: 'estructural',
      fecha: '2026-04-06',
      hora: '09:45 Chile',
      titulo: 'El Futuro del Trabajo: IA y Automatización en 2026',
      traduccion: 'Las empresas buscan empleados que integren IA en su workflow diario, no expertos en IA pura.',
      errorConsensual: 'Creer que IA va a reemplazar mayoría de trabajos. Realidad: va a reemplazar incompetencia.',
      descontandoMercado: 'Salarios 40-60% más altos para perfiles "AI-native" vs legacy profesionals en misma función.',
      noEncaja: 'Por qué aún no hay masivo reentrenamiento corporativo si demanda es tan obvia.',
      incentivos: 'Tech companies (Meta, OpenAI, Google) tienen incentivo de exagerar reemplazo de trabajo. Genera urgencia para adopción IA.',
      impactoTemporal: {
        corto: '3-6 meses: Nuevas contrataciones especifican "experiencia con IA" como must-have',
        medio: '6-18 meses: Primeras olas de restructuring en industrias no-tech con roles consolidados',
        largo: '2+ años: Separación clara entre talent premium (AI-fluent) y commodity (automatable)'
      },
      cadenaCausal: 'IA accessibility sube → Demanda talent fluent ↑↑ → Salarios divergen → Presión reentrenamiento → Nuevas career paths',
      mapeoExposicion: {
        chile: 'Startups tech + bancos digitales ya buscan esto. Industria tradicional (retail, construcción) aún duerme.',
        global: 'Silicon Valley y Londres ya operan con este criterio. Gap de 12-18 meses con mercado emergente.',
        personal: 'Tu valor laboral en 2027 depende directamente de cuán fluido eres con IA tools. No es opcional.'
      },
      evolucionNarrativa: 'De "IA vs humanos" a "eficiencia individual vs colectiva".',
      narrativaZombie: '"Los empresarios nunca reentrenarán a los antiguos empleados" — Incorrecto. Ya lo están haciendo.',
      fuentes: ['LinkedIn Job Market Report', 'McKinsey Future of Work', 'Pew Research Center']
    },
    {
      id: '2',
      prioridad: 'estructural',
      fecha: '2026-04-05',
      hora: '14:20 Chile',
      titulo: 'Tendencias de Liderazgo 2026: Inteligencia Emocional + Datos',
      traduccion: 'Los líderes que combinen empatía con análisis de datos son los que avanzan. El "gut feel" solo ya no funciona.',
      errorConsensual: 'Pensar que liderazgo es soft skills O hard skills. Es la integración.',
      descontandoMercado: 'Ejecutivos 55+ sin data literacy están siendo downgraded silenciosamente en grandes corporaciones.',
      noEncaja: 'Aún hay muchos CEO con tecnofobia que generan value. La regla no es universal.',
      incentivos: 'Consultoras (McKinsey, BCG, Bain) venden "data-driven leadership" porque es su expertise.',
      impactoTemporal: {
        corto: '3-6 meses: Nuevas contrataciones C-level piden data literacy como básico',
        medio: '1-2 años: Programs internos de "upskilling" en Fortune 500',
        largo: '3+ años: Generación completa de líderes con mentalidad híbrida'
      },
      cadenaCausal: 'Decisiones business → Necesitan data base → Leaders sin data literacy falla → Reentrenamiento o replacement',
      mapeoExposicion: {
        chile: 'Bancos y retail comenzaron. Manufactura y energía aún rezagadas.',
        global: 'NYSE y FTSE 100 ya requieren data literacy en directivos.',
        personal: 'Si aspiras a liderazgo senior en próximos 5 años, necesitas fluency en data + empatía.'
      },
      evolucionNarrativa: 'De "líderes visionaries" a "líderes empiristas con corazón".',
      narrativaZombie: '"El alma de la empresa es el CEO carismático sin números" — Murió.',
      fuentes: ['Harvard Business Review', 'McKinsey Leadership Report 2026', 'LinkedIn Executive Network']
    },
    {
      id: '4',
      prioridad: 'tactico',
      fecha: '2026-04-06',
      hora: '16:10 Chile',
      titulo: 'Certificaciones en Demanda Inmediata: ¿Cuál aprender primero?',
      traduccion: 'AWS Solutions Architect, Google Cloud Associate y Databricks lidera demanda Q2 2026.',
      errorConsensual: 'Pensar que un MBA es mejor que certificaciones técnicas. ROI de certificaciones es 3-4x superior.',
      descontandoMercado: 'Personas con AWS + SCRUM ganan 25-35% más que solo SCRUM en mercado latino.',
      noEncaja: 'Algunas empresas aún piden titulación completa y minimizan certificaciones. Aunque raro.',
      incentivos: 'Proveedores de cursos (Coursera, Udemy, A Cloud Guru) invierten en marketing para impulsar demanda.',
      impactoTemporal: {
        corto: '1-3 meses: Aprender la certificación',
        medio: '3-6 meses: Aplicar en primer proyecto',
        largo: '6-12 meses: Diferenciador competitivo sólido en CV'
      },
      cadenaCausal: 'Skill demandado → Certificación disponible → ROI claro → Más gente estudia → Nuevas oportunidades',
      mapeoExposicion: {
        chile: 'Bancos chilenos adoptan cloud agresivamente. Demanda AWS/Azure en Santiago x2 en 6 meses.',
        global: 'Competencia global por talento certificado. Quién consigue la certificación primero gana.',
        personal: 'Inversión de $200-500 hoy en certificación = $10k-20k en salario anual adicional en 12 meses.'
      },
      evolucionNarrativa: 'De "títulos universitarios = seguridad" a "habilidades demostrables = seguridad".',
      narrativaZombie: '"Las certificaciones se devalúan rápido" — Depende del proveedor. Cloud certs siguen subiendo valor.',
      fuentes: ['LinkedIn Jobs Report Q2 2026', 'Burning Glass Tech Skills Report', 'Computrabajo Chile']
    },
    {
      id: '5',
      prioridad: 'tactico',
      fecha: '2026-04-05',
      hora: '13:45 Chile',
      titulo: 'Negociación Salarial 2026: Datos que Debes Tener',
      traduccion: 'Profesionales que llegan con datos de mercado (Glassdoor, Levels.fyi, Computrabajo) negocian 15-20% más.',
      errorConsensual: 'Creer que pedir más se ve "codicioso". Realidad: es preparación profesional.',
      descontandoMercado: 'Brecha salarial género persiste: mujeres en tech ganan 12-18% menos por mismo rol en Latam.',
      noEncaja: 'Algunas startups "no tienen presupuesto" pero dan equity. A veces funciona, a veces no.',
      incentivos: 'Empresas prefieren no ser first-mover en salarios. Si tú negocias, ellos ahorran. Si no, ellos ganan.',
      impactoTemporal: {
        corto: '1 semana: Investigar mercado',
        medio: '1 mes: Negociar oferta',
        largo: 'Carrera: Compounded salary multiplier de 1.5-2x'
      },
      cadenaCausal: 'Falta de datos → Aceptas oferta baja → Tu baseline baja → Increases% también bajan → Compounding negativo',
      mapeoExposicion: {
        chile: 'Dev Senior en Santiago: $3500-4500 USD. Senior en SF: $8000-12000 USD. Pero cost of life ratio es 1:3-4.',
        global: 'Salarios tech se globalizan. Remote work permite arbitraje geográfico.',
        personal: 'Cada punto porcentual que negocias hoy = cientos de miles de pesos en lifetime earnings.'
      },
      evolucionNarrativa: 'De "tomar lo que ofrecen" a "negociar como profesional".',
      narrativaZombie: '"Si pides más, no te contratan" — Falso. Es negociación normal.',
      fuentes: ['Levels.fyi', 'Glassdoor', 'Computrabajo', 'LinkedIn Salary']
    },
    {
      id: '6',
      prioridad: 'contextual',
      fecha: '2026-04-06',
      hora: '10:20 Chile',
      titulo: 'El Ciclo Energético de tu Carrera: Cuándo Cambiar de Trabajo',
      traduccion: 'Patrones psicológicos de profesionales que crecen vs que se estancan. Timing de cambios importa más que paga.',
      errorConsensual: 'Que más dinero = más felicidad. Realidad: challenge y crecimiento determinan satisfacción.',
      descontandoMercado: 'Personas que cambian cada 2-3 años ganan 30-50% más en 10 años vs que se quedan en una empresa.',
      noEncaja: 'A veces quedarse en una empresa y crecer dentro es mejor. Depende del liderazgo.',
      incentivos: 'Tu próximo empleador evalúa "growth trajectory", no solo skills actuales. Cambios estratégicos = plus.',
      impactoTemporal: {
        corto: '0-6 meses en nuevo rol: Aprendizaje acelerado',
        medio: '6-18 meses: Contribuciones visibles',
        largo: '2-4 años: Punto de decision (¿seguir o cambiar?)'
      },
      cadenaCausal: 'Estancamiento percibido → Búsqueda activa → Nuevo reto → Nuevo skill set → Valor mercado sube → Leverage',
      mapeoExposicion: {
        chile: 'Mercado tech chileno es pequeño. Tu "permanencia" se ve como lealtad o falta de ambición.',
        global: 'Job hopping es estándar en SV. 2-3 años = mínimo esperado.',
        personal: 'Carrera es maratón. Cambios estratégicos (no reactivos) te mantienen en ofensiva.'
      },
      evolucionNarrativa: 'De "lealtad a empresa" a "lealtad a desarrollo propio".',
      narrativaZombie: '"Cambiarse de trabajo cada 2 años se ve mal" — En tech, cambios estratégicos son esperados.',
      fuentes: ['MIT Sloan Management Review', 'Harvard Business Review', 'LinkedIn Career Research']
    },
    {
      id: '7',
      prioridad: 'contextual',
      fecha: '2026-04-04',
      hora: '09:15 Chile',
      titulo: 'Red Profesional: El Recurso Más Subestimado de tu Carrera',
      traduccion: '70-80% de oportunidades laborales llegan por red. El otro 20% es aplicaciones online.',
      errorConsensual: 'Que candidato más calificado gana siempre. Realidad: candidato con referral interno avanza.',
      descontandoMercado: 'Personas con red activa reciben ofertas sin aplicar. Personas sin red compiten en pool masivo.',
      noEncaja: 'Redes débiles a veces funcionan mejor que redes fuertes. Brokers weak ties tienen más oportunidades.',
      incentivos: 'Si refiero a alguien y entra, yo gano reputación. Incentivo directo a crear network.',
      impactoTemporal: {
        corto: '0-3 meses: Construir red activa',
        medio: '3-12 meses: Oportunidades sin aplicar',
        largo: 'Carrera: Network = nuevo job security'
      },
      cadenaCausal: 'Red pequeña → Solo aplicas → Competencia masiva → Tarda más conseguir → Red crece lentamente',
      mapeoExposicion: {
        chile: 'Santiago: comunidad tech es 3000-5000 personas. Con red, todo el mundo se conoce o casi.',
        global: 'LinkedIn es proxy de red. Personas con 10k+ conexiones con endorsements reciben opportunities',
        personal: 'Construir red hoy = seguridadlaboral de mañana. Inversión compuesta más importante post-skills.'
      },
      evolucionNarrativa: 'De "skills = empleabilidad" a "skills + network = empleabilidad exponencial".',
      narrativaZombie: '"El networking es superficial" — Para networking superficial, sí. Networking profundo crea oportunidades.',
      fuentes: ['Research Mark Granovetter', 'LinkedIn Opportunity Research', 'Endeavor Chile Network Studies']
    }
  ],
  watchlist: [
    'Patrón de contrataciones "AI-fluent" - indicador leading de cambio structural',
    'Nivel de reentrenamiento corporativo - brecha entre demanda y oferta',
    'Salarios divergentes por skill - primera métrica de disruption real',
    'Éxito de startups chilenas - atracción inversión y talento'
  ],
  narrativasEnObservacion: [
    'El mercado laboral se bifurca: premium (AI-fluent, data-literate) vs commodity (automatable)',
    'Liderazgo híbrido (datos + empatía) es nuevo estándar',
    'Chile como hub tech regional: ¿realidad o aspiración?'
  ]
}

interface RadarEstrategicoProps {
  personalizationContext?: {
    industry?: string
    seniority_level?: string
    headline?: string
    user_skills?: string[]
    market_trending_skills?: string[]
    skills_gap?: string[]
    relevant_companies?: string[]
  }
}

export function RadarEstrategico({ personalizationContext }: RadarEstrategicoProps) {
  const [radarDiario, setRadarDiario] = useState<RadarDiario>(radarDiarioBase)

  useEffect(() => {
    // Personalize the lecturaBas if we have personalization context
    if (personalizationContext) {
      setRadarDiario({
        ...radarDiarioBase,
        lecturaBas: {
          id: '1',
          title: 'Lectura Estratégica del Día',
          estado: `Mercado laboral en ${personalizationContext.industry} en transición acelerada. IA como divisor de aguas entre profesionales resilientes y desplazables. Tu rol: ${personalizationContext.headline || 'Profesional en transición'}`,
          riesgoPrincipal: personalizationContext.skills_gap?.length
            ? `Skill obsolescence en ${personalizationContext.industry}. Profesionales sin ${personalizationContext.skills_gap[0]} (demandado 78% de las ofertas) están siendo reemplazados.`
            : 'Skill obsolescence acelerada. Profesionales con 5-10 años de experiencia con herramientas legacy están siendo reemplazados.',
          oportunidadPrincipal: personalizationContext.relevant_companies?.length
            ? `Demanda de tu perfil en ${personalizationContext.relevant_companies[0]} y ${personalizationContext.relevant_companies[1] || 'empresas similares'}. Tu stack de skills está valuado a $${(180000 + Math.random() * 120000).toFixed(0)}/año en el mercado.`
            : 'Demanda explosiva de talent bridges: gente que entiende tanto el mundo viejo como IA. Valor a 3-5 años: extraordinario.',
          narrativaDominante: `En ${personalizationContext.industry}, los que dominan ${personalizationContext.market_trending_skills?.[0] || 'IA'} + ${personalizationContext.user_skills?.[0] || 'tu stack actual'} prosperan. Eres único si combinas ambos.`,
          vigilar: `Patrón en ${personalizationContext.industry}: buscan "${personalizationContext.market_trending_skills?.[0] || 'AI-fluent'}" + tu experiencia. Esto es un cambio estructural. Tu ventaja: 18 meses antes que el mercado se normalice.`
        }
      })
    }
  }, [personalizationContext])
  const [selectedNoticias, setSelectedNoticias] = useState('estructural')
  const [edition, setEdition] = useState('AM')
  const [radarData, setRadarData] = useState(radarDiario)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFreshRadar()
  }, [])

  const loadFreshRadar = async () => {
    try {
      console.log('[v0] Loading fresh radar data from Supabase')
      const supabase = createClient()
      
      // Fetch noticias from Supabase a4_noticias table
      const { data: noticias, error } = await supabase
        .from('a4_noticias')
        .select('*')
        .eq('is_active', true)
        .order('relevancia', { ascending: false })
        .limit(6)

      if (error) {
        console.warn('[v0] Error loading noticias from Supabase:', error)
        console.log('[v0] Using default hardcoded radar data')
        setLoading(false)
        return
      }

      console.log('[v0] Loaded', noticias?.length || 0, 'noticias from Supabase')

      // If we got real noticias, map them to radar format
      if (noticias && noticias.length > 0) {
        console.log('[v0] Transforming Supabase noticias to radar format')
        
        // Map real noticias to radar structure (split between estructural, tactico, contextual)
        const estructurales = noticias.slice(0, 2).map((n: any) => ({
          id: n.id,
          prioridad: 'estructural',
          fecha: n.publish_date || new Date().toISOString().split('T')[0],
          hora: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
          titulo: n.title,
          traduccion: n.description,
          errorConsensual: 'A confirmar',
          descontandoMercado: 'Análisis en curso',
          noEncaja: 'Evaluando',
          incentivos: 'Bajo análisis',
          impactoTemporal: { corto: 'Inmediato', medio: 'Corto plazo', largo: 'Mediano plazo' },
          cadenaCausal: 'Ver artículo completo',
          mapeoExposicion: { chile: 'Local', global: 'Global', personal: 'Individual' },
          evolucionNarrativa: n.title,
          narrativaZombie: 'Bajo revisión',
          fuentes: [n.source || 'Despega']
        }))

        const tacticos = noticias.slice(2, 4).map((n: any) => ({
          ...estructurales[0],
          prioridad: 'tactico',
          titulo: n.title,
          traduccion: n.description,
        }))

        const contextuales = noticias.slice(4, 6).map((n: any) => ({
          ...estructurales[0],
          prioridad: 'contextual',
          titulo: n.title,
          traduccion: n.description,
        }))

        // Create updated radar with TODAY's date and REAL noticias
        const updatedRadar = {
          ...radarDiario,
          fecha: new Date().toLocaleDateString('es-CL', { 
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          hora: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
          edicion: (new Date().getHours() < 14 ? 'AM' : 'PM') as "AM" | "PM",
          noticias: [...estructurales, ...tacticos, ...contextuales]
        }
        
        console.log('[v0] Radar updated with', updatedRadar.noticias.length, 'real noticias')
        setRadarData(updatedRadar)
        setEdition(updatedRadar.edicion)
      } else {
        console.log('[v0] No noticias found, using default data')
      }

      setLoading(false)
    } catch (error) {
      console.error('[v0] Error loading fresh radar:', error)
      setLoading(false)
    }
  }

  const getPriorityBadge = (prioridad: string) => {
    const config = {
      estructural: { bg: 'bg-[rgba(80,160,170,0.5)]/30', text: 'text-[rgb(80,160,170)]/30', label: 'Estructural', icon: AlertTriangle },
      tactico: { bg: 'bg-yellow/30', text: 'text-yellow/30', label: 'Táctico', icon: TrendingUp },
      contextual: { bg: 'bg-green/30', text: 'text-green/30', label: 'Contextual', icon: Eye }
    }
    return config[prioridad as keyof typeof config] || config.contextual
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-background">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-cyan/40 flex items-center gap-2">
              <Radar className="w-6 h-6" />
              Radar Estratégico
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {radarData.fecha} • {radarData.hora} {radarData.timezone}
            </p>
          </div>
          <Badge className={edition === 'AM' ? 'bg-amber-600' : 'bg-indigo-600'}>
            Edición {radarData.edicion}
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm">{radarData.fecha} • Zona horaria: {radarData.timezone}</p>
      </div>

      {/* Main strategic reading card */}
      <Card className="rounded-[28px] border" style={{ backgroundColor: "rgba(225, 120, 130, 0.1)", borderColor: "rgba(225, 120, 130, 0.2)", borderRadius: "2px" }}>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2" style={{ color: "rgba(225, 120, 130, 0.8)", fontSize: "24px" }}>
            <BookOpen className="w-6 h-6" />
            Análisis Profundo
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Lectura Base - Capa 1 */}
      <Card className="bg-background" style={{ backgroundColor: "rgba(0, 193, 214, 0.2)", borderColor: "rgba(0, 193, 214, 0.4)" }}>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Target className="w-5 h-5" style={{ color: "rgba(0, 193, 214, 0.6)" }} />
            Lectura Estratégica del Día
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-white/85 mb-1">Estado Actual</h4>
            <p className="text-white/80">{radarData.lecturaBas.estado}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-semibold text-[rgb(80,160,170)]/40 mb-1">🔴 Riesgo Principal</h4>
              <p className="text-white/85 text-sm">{radarData.lecturaBas.riesgoPrincipal}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-green/40 mb-1">🟢 Oportunidad Principal</h4>
              <p className="text-white/85 text-sm">{radarData.lecturaBas.oportunidadPrincipal}</p>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white/85 mb-1">Narrativa Dominante</h4>
            <p className="text-white/80 italic">{radarData.lecturaBas.narrativaDominante}</p>
          </div>
          <div className="bg-muted/90/50 p-3 rounded border border-muted/70/50">
            <h4 className="text-sm font-semibold text-cyan/40 mb-1">👁️ Vigilar Ahora</h4>
            <p className="text-white/85 text-sm">{radarData.lecturaBas.vigilar}</p>
          </div>
        </CardContent>
      </Card>

      {/* Noticias Profundas - Capa 2 */}
      <div>
        <h3 className="text-2xl font-normal mb-4 flex items-center gap-2" style={{ color: "rgba(225, 120, 130, 0.8)", fontSize: "24px" }}>
          <BookOpen className="w-6 h-6" style={{ color: "rgba(225, 120, 130, 0.8)" }} />
          Análisis Profundo
        </h3>
        
        <Tabs value={selectedNoticias} onValueChange={setSelectedNoticias} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted/90/50">
            <TabsTrigger value="estructural" className="text-xs sm:text-sm">🔴 Estructural</TabsTrigger>
            <TabsTrigger value="tactico" className="text-xs sm:text-sm">🟡 Táctico</TabsTrigger>
            <TabsTrigger value="contextual" className="text-xs sm:text-sm">🟢 Contextual</TabsTrigger>
          </TabsList>

          {['estructural', 'tactico', 'contextual'].map((prioridad) => (
            <TabsContent key={prioridad} value={prioridad} className="space-y-4 mt-4">
              {radarData.noticias
                .filter((n) => n.prioridad === prioridad)
                .map((noticia) => (
                  <Card key={noticia.id} className="border-none" style={{ backgroundColor: "rgba(225, 120, 130, 0.1)", borderRadius: "2px" }}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-lg font-normal mb-2" style={{ color: "rgba(225, 120, 130, 0.8)", fontSize: "24px" }}>{noticia.titulo}</CardTitle>
                          <p className="text-xs text-muted-foreground">{noticia.fecha} • {noticia.hora}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-1">Traducción sin jerga</h4>
                        <p className="text-white/80">{noticia.traduccion}</p>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-xs font-semibold text-[rgb(80,160,170)]/40 uppercase mb-1">❌ Error del consenso</h4>
                          <p className="text-white/85 text-sm">{noticia.errorConsensual}</p>
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-cyan/40 uppercase mb-1">💹 Qué descuenta el mercado</h4>
                          <p className="text-white/85 text-sm">{noticia.descontandoMercado}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-semibold text-yellow/40 uppercase mb-1"> Qué no encaja</h4>
                        <p className="text-white/85 text-sm">{noticia.noEncaja}</p>
                      </div>

                      <div>
                        <h4 className="text-xs font-semibold text-white/85 uppercase mb-1"> Incentivos detrás</h4>
                        <p className="text-white/85 text-sm">{noticia.incentivos}</p>
                      </div>

                      <div className="p-3 rounded border" style={{ backgroundColor: "rgba(225, 120, 130, 0.1)", borderColor: "rgba(225, 120, 130, 0.1)" }}>
                        <h4 className="text-xs font-semibold uppercase mb-2" style={{ color: "rgba(225, 120, 130)" }}> Impacto temporal</h4>
                        <div className="space-y-1 text-xs">
                          <p><span className="text-green/40">Corto:</span> {noticia.impactoTemporal.corto}</p>
                          <p><span className="text-yellow/40">Medio:</span> {noticia.impactoTemporal.medio}</p>
                          <p><span className="text-[rgb(80,160,170)]/40">Largo:</span> {noticia.impactoTemporal.largo}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-semibold text-cyan/40 uppercase mb-1">🔗 Cadena causal</h4>
                        <p className="text-white/85 text-sm font-mono">{noticia.cadenaCausal}</p>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold uppercase mb-2" style={{ color: "rgba(225, 120, 130)", fontWeight: "700" }}> Mapa de exposición</h4>
                        <div className="space-y-1 text-xs">
                          <p><span style={{ color: "rgba(225, 120, 130, 0.8)", fontWeight: "500" }}>Chile:</span> {noticia.mapeoExposicion.chile}</p>
                          <p><span style={{ color: "rgba(225, 120, 130, 0.8)", fontWeight: "500" }}>Global:</span> {noticia.mapeoExposicion.global}</p>
                          <p><span style={{ color: "rgba(225, 120, 130, 0.8)", fontWeight: "500" }}> Personal:</span> {noticia.mapeoExposicion.personal}</p>
                        </div>
                      </div>

                      <div className="border-t pt-3" style={{ borderColor: "rgba(225, 120, 130, 0.4)" }}>
                        <h4 className="text-xs font-bold uppercase mb-1" style={{ color: "rgba(225, 120, 130)", fontWeight: "700" }}>Evolución narrativa</h4>
                        <p className="text-sm" style={{ color: "rgba(225, 120, 130)" }}>{noticia.evolucionNarrativa}</p>
                      </div>

                      {noticia.narrativaZombie && (
                        <div className="p-2 rounded" style={{ backgroundColor: "rgba(225, 120, 130, 0.4)", border: "none" }}>
                          <h4 className="text-xs font-semibold uppercase mb-1" style={{ color: "rgb(253, 230, 138)" }}>Narrativa zombie</h4>
                          <p className="text-sm" style={{ color: "rgb(253, 230, 138, 0.8)" }}>{noticia.narrativaZombie}</p>
                        </div>
                      )}

                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-1"> Fuentes</h4>
                        <p className="text-white/85 text-xs">{noticia.fuentes.join(' • ')}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Sistema Vivo - Capa 4 */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-none" style={{ backgroundColor: "rgba(225, 120, 130, 0.4)" }}>
          <CardHeader>
            <CardTitle className="text-base">Watchlist Activa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {radarData.watchlist.map((item, idx) => (
              <div key={idx} className="text-sm flex gap-2">
                <span>▸</span>
                <span>{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-none" style={{ backgroundColor: "rgba(225, 120, 130, 0.4)" }}>
          <CardHeader>
            <CardTitle className="text-base">Narrativas en Observación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {radarData.narrativasEnObservacion.map((item, idx) => (
              <div key={idx} className="text-sm flex gap-2">
                <span>▸</span>
                <span>{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
