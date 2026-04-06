'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle, TrendingUp, AlertTriangle, Eye, BookOpen, Target } from 'lucide-react'

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

const radarDiario: RadarDiario = {
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
      id: '3',
      prioridad: 'estructural',
      fecha: '2026-04-06',
      hora: '11:30 Chile',
      titulo: 'Mercado Laboral Chileno: IA y Startups como motor',
      traduccion: 'Chile está atrayendo inversión en tech-for-good, healthcare-tech y fintech como nunca antes.',
      errorConsensual: 'Creer que oportunidades están solo en Silicon Valley. Hay demanda local explosiva.',
      descontandoMercado: 'Equity en startups chilenas es 30-40% más accesible que US, pero riesgo más alto.',
      noEncaja: 'Aún hay fuga de talento. No se ha creado masa crítica de "successful founders" locales que inspiren.',
      incentivos: 'Gobierno chileno busca diversificar economía. Subsidios para startups y talento tech.',
      impactoTemporal: {
        corto: '6-12 meses: Nuevas aceleradoras anuncian cohorts. Demanda talent > oferta',
        medio: '1-2 años: Primera ola de startup exits crea "angel investor network" local',
        largo: '3-5 años: Chile como hub regional de IA y healthtech'
      },
      cadenaCausal: 'Capital extranjero → Startups locales ↑ → Demanda talent ↑↑ → Salarios suben → Retención talento sube',
      mapeoExposicion: {
        chile: 'Directamente: oportunidades en startups, salarios en tech sube 20-30% anual',
        global: 'Indirectamente: Chile deviene atractor de remote workers latinoamericanos',
        personal: 'Ventana de 2-4 años para early adoption de estas oportunidades con menos competencia que en US.'
      },
      evolucionNarrativa: 'De "Chile es minería y retail" a "Chile es tech hub regional".',
      narrativaZombie: '"No hay oportunidades en Chile, hay que irse a US" — Parcialmente desmentida.',
      fuentes: ['StartupChile', 'El Mercurio (Negocios)', 'Endeavor Chile']
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

export function RadarEstrategico() {
  const [selectedNoticias, setSelectedNoticias] = useState('estructural')
  const [edition, setEdition] = useState(radarDiario.edicion)

  const getPriorityBadge = (prioridad: string) => {
    const config = {
      estructural: { bg: 'bg-red-900/30', text: 'text-red-300', label: 'Estructural', icon: AlertTriangle },
      tactico: { bg: 'bg-yellow-900/30', text: 'text-yellow-300', label: 'Táctico', icon: TrendingUp },
      contextual: { bg: 'bg-green-900/30', text: 'text-green-300', label: 'Contextual', icon: Eye }
    }
    return config[prioridad as keyof typeof config] || config.contextual
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-700/50 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold text-white">Radar Estratégico</h2>
          <Badge className="bg-cyan-600/30 text-cyan-300 border border-cyan-500/50">
            {radarDiario.edicion} - {radarDiario.hora}
          </Badge>
        </div>
        <p className="text-slate-400 text-sm">{radarDiario.fecha} • Zona horaria: {radarDiario.timezone}</p>
      </div>

      {/* Lectura Base - Capa 1 */}
      <Card className="border-cyan-500/30 bg-gradient-to-br from-cyan-950/20 to-slate-950">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Target className="w-5 h-5 text-cyan-400" />
            Lectura Estratégica del Día
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-slate-300 mb-1">Estado Actual</h4>
            <p className="text-slate-200">{radarDiario.lecturaBas.estado}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-semibold text-red-400 mb-1">🔴 Riesgo Principal</h4>
              <p className="text-slate-300 text-sm">{radarDiario.lecturaBas.riesgoPrincipal}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-green-400 mb-1">🟢 Oportunidad Principal</h4>
              <p className="text-slate-300 text-sm">{radarDiario.lecturaBas.oportunidadPrincipal}</p>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-300 mb-1">Narrativa Dominante</h4>
            <p className="text-slate-200 italic">{radarDiario.lecturaBas.narrativaDominante}</p>
          </div>
          <div className="bg-slate-900/50 p-3 rounded border border-slate-700/50">
            <h4 className="text-sm font-semibold text-cyan-400 mb-1">👁️ Vigilar Ahora</h4>
            <p className="text-slate-300 text-sm">{radarDiario.lecturaBas.vigilar}</p>
          </div>
        </CardContent>
      </Card>

      {/* Noticias Profundas - Capa 2 */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-cyan-400" />
          Análisis Profundo
        </h3>
        
        <Tabs value={selectedNoticias} onValueChange={setSelectedNoticias} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-900/50">
            <TabsTrigger value="estructural" className="text-xs sm:text-sm">🔴 Estructural</TabsTrigger>
            <TabsTrigger value="tactico" className="text-xs sm:text-sm">🟡 Táctico</TabsTrigger>
            <TabsTrigger value="contextual" className="text-xs sm:text-sm">🟢 Contextual</TabsTrigger>
          </TabsList>

          {['estructural', 'tactico', 'contextual'].map((prioridad) => (
            <TabsContent key={prioridad} value={prioridad} className="space-y-4 mt-4">
              {radarDiario.noticias
                .filter((n) => n.prioridad === prioridad)
                .map((noticia) => (
                  <Card key={noticia.id} className="border-slate-700/50 bg-slate-950/50">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{noticia.titulo}</CardTitle>
                          <p className="text-xs text-slate-400">{noticia.fecha} • {noticia.hora}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="text-xs font-semibold text-slate-400 uppercase mb-1">Traducción sin jerga</h4>
                        <p className="text-slate-200">{noticia.traduccion}</p>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-xs font-semibold text-red-400 uppercase mb-1">❌ Error del consenso</h4>
                          <p className="text-slate-300 text-sm">{noticia.errorConsensual}</p>
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-cyan-400 uppercase mb-1">💹 Qué descuenta el mercado</h4>
                          <p className="text-slate-300 text-sm">{noticia.descontandoMercado}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-semibold text-yellow-400 uppercase mb-1">⚠️ Qué no encaja</h4>
                        <p className="text-slate-300 text-sm">{noticia.noEncaja}</p>
                      </div>

                      <div>
                        <h4 className="text-xs font-semibold text-slate-300 uppercase mb-1">🎯 Incentivos detrás</h4>
                        <p className="text-slate-300 text-sm">{noticia.incentivos}</p>
                      </div>

                      <div className="bg-slate-900/50 p-3 rounded border border-slate-700/50">
                        <h4 className="text-xs font-semibold text-slate-300 uppercase mb-2">📊 Impacto temporal</h4>
                        <div className="space-y-1 text-xs">
                          <p><span className="text-green-400">Corto:</span> {noticia.impactoTemporal.corto}</p>
                          <p><span className="text-yellow-400">Medio:</span> {noticia.impactoTemporal.medio}</p>
                          <p><span className="text-red-400">Largo:</span> {noticia.impactoTemporal.largo}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-semibold text-cyan-400 uppercase mb-1">🔗 Cadena causal</h4>
                        <p className="text-slate-300 text-sm font-mono">{noticia.cadenaCausal}</p>
                      </div>

                      <div>
                        <h4 className="text-xs font-semibold text-slate-300 uppercase mb-2">🗺️ Mapa de exposición</h4>
                        <div className="space-y-1 text-xs">
                          <p><span className="text-emerald-400">🇨🇱 Chile:</span> {noticia.mapeoExposicion.chile}</p>
                          <p><span className="text-blue-400">🌍 Global:</span> {noticia.mapeoExposicion.global}</p>
                          <p><span className="text-purple-400">👤 Personal:</span> {noticia.mapeoExposicion.personal}</p>
                        </div>
                      </div>

                      <div className="border-t border-slate-700/50 pt-3">
                        <h4 className="text-xs font-semibold text-slate-300 uppercase mb-1">📖 Evolución narrativa</h4>
                        <p className="text-slate-300 text-sm">{noticia.evolucionNarrativa}</p>
                      </div>

                      {noticia.narrativaZombie && (
                        <div className="bg-red-950/20 p-2 rounded border border-red-700/30">
                          <h4 className="text-xs font-semibold text-red-400 uppercase mb-1">🧟 Narrativa zombie</h4>
                          <p className="text-slate-300 text-sm">{noticia.narrativaZombie}</p>
                        </div>
                      )}

                      <div>
                        <h4 className="text-xs font-semibold text-slate-400 uppercase mb-1">📚 Fuentes</h4>
                        <p className="text-slate-300 text-xs">{noticia.fuentes.join(' • ')}</p>
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
        <Card className="border-slate-700/50 bg-slate-950/50">
          <CardHeader>
            <CardTitle className="text-base">📋 Watchlist Activa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {radarDiario.watchlist.map((item, idx) => (
              <div key={idx} className="text-sm text-slate-300 flex gap-2">
                <span className="text-cyan-400">▸</span>
                <span>{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-slate-700/50 bg-slate-950/50">
          <CardHeader>
            <CardTitle className="text-base">🔍 Narrativas en Observación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {radarDiario.narrativasEnObservacion.map((item, idx) => (
              <div key={idx} className="text-sm text-slate-300 flex gap-2">
                <span className="text-yellow-400">▸</span>
                <span>{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
