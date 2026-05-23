'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowRight, Copy, Download, Lightbulb, MessageCircle, Briefcase, TrendingUp, CheckCircle2, Sparkles } from 'lucide-react'
import { useState } from 'react'

interface A1WowReportProps {
  profile: {
    D: number
    I: number
    S: number
    C: number
    primary: string
    primaryScore: number
    secondary: string
    secondaryScore: number
  }
  insights: {
    fortalezasPrincipales: string
    areasDesarrollo: string
    estiloEntrevista: string
    dinamicaEquipo: string
    carreraAlign: string
    comunicacionEfectiva: string
    gestionConflicto: string
    proxiPaso: string
  }
  userName?: string
}

export function A1WowReport({ profile, insights, userName = 'Profesional' }: A1WowReportProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null)

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text)
    setCopiedSection(section)
    setTimeout(() => setCopiedSection(null), 2000)
  }

  // Generate dynamic headline based on profile
  const generateHeadline = () => {
    const styleMap: Record<string, string> = {
      'D': 'Ejecutor Implacable',
      'I': 'Catalizador Carismático',
      'S': 'Constructor Confiable',
      'C': 'Arquitecto Meticuloso'
    }
    const primary = styleMap[profile.primary] || 'Profesional Estratégico'
    const secondary = styleMap[profile.secondary] || 'Versátil'
    return `${primary} con Toque ${secondary}`
  }

  // Generate tu tensión específica (your specific tension)
  const generateTension = () => {
    const tensions: Record<string, string> = {
      'D': 'Tu velocidad abruma a otros. Tiendes a decidir sin consenso. El riesgo: que te sigan los equipos equivocados.',
      'I': 'Tu encanto puede ser superficial. Eres brillante en vender ideas pero débil en ejecutarlas. El riesgo: falta de credibilidad cuando no entrega.',
      'S': 'Tu estabilidad puede ser parálisis. Evitas conflicto a costa de la verdad. El riesgo: que te usen para no decir "no".',
      'C': 'Tu precisión es perfeccionismo. Tardas porque buscas la opción perfecta. El riesgo: que otros avancen sin ti.'
    }
    return tensions[profile.primary] || 'Tu patrón de decisión puede generar tensiones en contextos de presión.'
  }

  // Generate roles analysis
  const generateRolesAnalysis = () => {
    const rolesMap: Record<string, { brilla: string[]; drena: string[] }> = {
      'D': {
        brilla: ['CEO/Founder', 'Sales Director', 'Crisis Manager', 'Venture Capitalist'],
        drena: ['HR Manager', 'Team Coach', 'Support Specialist', 'Compliance Officer']
      },
      'I': {
        brilla: ['Marketing Manager', 'BD/Partnerships', 'Product Manager', 'Communications Lead'],
        drena: ['Data Analyst', 'Programmer', 'Compliance Officer', 'Operations Manager']
      },
      'S': {
        brilla: ['Operations Manager', 'Project Manager', 'Team Lead', 'Customer Success Lead'],
        drena: ['Sales Representative', 'Change Manager', 'Negotiator', 'Startup Founder']
      },
      'C': {
        brilla: ['Risk Manager', 'Auditor', 'Data Analyst', 'Quality Assurance Lead'],
        drena: ['Sales Manager', 'Venture Capitalist', 'Rapid Innovator', 'Crisis Manager']
      }
    }
    return rolesMap[profile.primary] || { brilla: ['Project Manager'], drena: [] }
  }

  // Generate 7/30/90 roadmap
  const generateRoadmap = () => {
    const roadmaps: Record<string, Record<string, string[]>> = {
      'D': {
        '7dias': ['LinkedIn: cambia headline a "Strategic Leader | Results-Driven Executive"', 'Entrevista: prepara 2 historias de turnarounds', 'Networking: busca mentores que te enseñen diplomacia'],
        '30dias': ['LinkedIn: publica 2 posts sobre decisiones estratégicas rápidas', 'Entrevista: practica escuchar más que hablar', 'Career: identifica roles donde tu velocidad es activo'],
        '90dias': ['LinkedIn: documenta tu impacto cuantificado', 'Leadership: busca coaching en delegation', 'Network: construye relaciones 1-1 significativas']
      },
      'I': {
        '7dias': ['LinkedIn: actualiza foto y headline con presencia profesional', 'Entrevista: prepara 2 historias donde impactaste, no solo brillaste', 'Networking: sé específico en qué ayuda buscas'],
        '30dias': ['LinkedIn: publica 3 posts mostrando expertise, no solo opiniones', 'Entrevista: lleva métricas de tus ideas', 'Career: busca roles con co-founder/accountability'],
        '90dias': ['LinkedIn: documenta resultados de tus iniciativas', 'Leadership: completa un proyecto de punta a punta sin delegar', 'Network: crea círculo de accountability']
      },
      'S': {
        '7dias': ['LinkedIn: headline debe mostrar leadership, no ejecución', 'Entrevista: practica decir "no" y defender posiciones', 'Networking: inicia conversaciones de desafío, no solo escucha'],
        '30dias': ['LinkedIn: publica 2 posts sobre decisiones difíciles que tomaste', 'Entrevista: prepara historias donde tuviste que "romper plato"', 'Career: busca roles con mayor autonomía'],
        '90dias': ['LinkedIn: documenta cambios donde fuiste catalyst, no gestor', 'Leadership: toma curso de assertividad', 'Network: mentorea a 1 junior en ser más directo']
      },
      'C': {
        '7dias': ['LinkedIn: headline debe mostrar impacto, no perfección', 'Entrevista: practica tomar decisiones con 70% de info', 'Networking: participa en conversaciones sin tener la respuesta perfecta'],
        '30dias': ['LinkedIn: publica 2 posts sobre speed de decisión', 'Entrevista: lleva ejemplos donde "bueno rápido" venció a "perfecto lento"', 'Career: busca roles agile/startup'],
        '90dias': ['LinkedIn: documenta iteraciones rápidas que ganaron', 'Leadership: trabaja en confianza vs control', 'Network: mentorea a 1 junior en aceptar bueno suficiente']
      }
    }
    return roadmaps[profile.primary] || { '7dias': [], '30dias': [], '90dias': [] }
  }

  // Generate sales language for 3 key conversations
  const generateSalesLanguage = () => {
    const languages: Record<string, Record<string, string>> = {
      'D': {
        linkedin: 'Strategic Executive | Deliver Results in High-Pressure Environments | Accelerate Growth Through Bold Decision-Making',
        interview: 'I drive results. In [context], I made tough calls quickly, moving the company/team from [challenge] to [outcome]. I value velocity AND accountability.',
        networking: 'Looking for contexts where speed + strategic thinking create competitive advantage. If you\'re building something that needs decisions made fast, let\'s talk.'
      },
      'I': {
        linkedin: 'Build Markets & Movements | Connect Dots Others Miss | Strategic Growth through Relationships & Innovation',
        interview: 'I connect people and ideas to solve big problems. When [challenge] arose, I brought together [stakeholders] to create [innovative solution]. I thrive where collaboration drives results.',
        networking: 'Fascinated by [industry/trend]. If you\'re building something where relationships + ideas are the moat, I want to contribute.'
      },
      'S': {
        linkedin: 'Build Lasting Systems | Lead with Stability & Purpose | Enable Teams to Achieve More Together',
        interview: 'I build systems people trust. When [challenge] happened, I created structure that helped the team navigate change. I enable others to do their best work.',
        networking: 'Interested in roles where I can build sustainable operations. If you\'re scaling and need foundation, let\'s connect.'
      },
      'C': {
        linkedin: 'Think Like a System | Reduce Risk Through Precision | Drive Quality at Every Level',
        interview: 'I see what others miss—the gaps that turn into problems. With [example], I caught [risk] early, saving [impact]. Quality isn\'t optional, it\'s competitive.',
        networking: 'Looking to join organizations serious about doing things right. If you\'re building for scale + quality, I want to talk.'
      }
    }
    return languages[profile.primary] || { linkedin: '', interview: '', networking: '' }
  }

  const headline = generateHeadline()
  const tension = generateTension()
  const roles = generateRolesAnalysis()
  const roadmap = generateRoadmap()
  const language = generateSalesLanguage()

  return (
    <div className="space-y-6">
      {/* Section 1: Headline */}
      <Card className="border-2 border-emerald-500/50 bg-emerald-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            Tu Arquetipo: {headline}
          </CardTitle>
          <CardDescription>La frase que resume cómo eres visto en contextos de presión</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold text-foreground mb-4">{headline}</p>
          <p className="text-muted leading-relaxed">{insights.fortalezasPrincipales}</p>
        </CardContent>
      </Card>

      {/* Section 2: Tu Tensión Específica */}
      <Card className="border-2 border-orange/50 bg-orange/5/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-orange-400" />
            Tu Tensión Específica (La verdad incómoda)
          </CardTitle>
          <CardDescription>Dónde se quiebran los {profile.primary}s bajo presión</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-white font-semibold">{tension}</p>
          <div className="bg-blue/20 p-4 rounded-[28px] border border-blue/50">
            <p className="text-sm text-white font-medium">{insights.areasDesarrollo}</p>
          </div>
          <p className="text-sm text-white/75 italic">
            Esta tensión no es debilidad. Es el lado oscuro de tu fortaleza. La pregunta es: ¿la ves? ¿La gestionas?
          </p>
        </CardContent>
      </Card>

      {/* Section 3: Roles Analysis */}
      <Card className="border-2 border-blue/50/50 bg-blue/5/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue" />
            Roles Donde Brillas vs Drenas
          </CardTitle>
          <CardDescription>Dónde tu perfil es imprescindible vs donde se quiebra</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-green/40 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Brillas En
              </h4>
              <div className="space-y-2">
                {roles.brilla.map((role, idx) => (
                  <Badge key={idx} variant="outline" className="bg-green/10 text-white border-green/30">
                    {role}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-[rgb(80,160,170)]-400 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 rotate-180" />
                Drenas En
              </h4>
              <div className="space-y-2">
                {roles.drena.map((role, idx) => (
                  <Badge key={idx} variant="outline" className="bg-[rgba(80,160,170,0.5)]/10 text-white border-[rgb(80,160,170)]/30">
                    {role}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: 7/30/90 Roadmap */}
      <Card className="border-2 border-purple/50/50 bg-purple/5/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple" />
            Tu Ruta 7/30/90: De Aquí a Imprescindible
          </CardTitle>
          <CardDescription>Acciones concretas mapeadas a conversaciones reales (LinkedIn, Entrevista, Career)</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="7dias" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="7dias">Próximos 7 días</TabsTrigger>
              <TabsTrigger value="30dias">Mes 1</TabsTrigger>
              <TabsTrigger value="90dias">Meses 2-3</TabsTrigger>
            </TabsList>

            <TabsContent value="7dias" className="space-y-3 mt-4">
              {roadmap['7dias'].map((item, idx) => (
                <div key={idx} className="flex gap-3 p-3 bg-purple/20 rounded-[28px] border border-purple/40">
                  <CheckCircle2 className="w-5 h-5 text-purple/30 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-white">{item}</p>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="30dias" className="space-y-3 mt-4">
              {roadmap['30dias'].map((item, idx) => (
                <div key={idx} className="flex gap-3 p-3 bg-purple/20 rounded-[28px] border border-purple/40">
                  <CheckCircle2 className="w-5 h-5 text-purple/30 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-white">{item}</p>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="90dias" className="space-y-3 mt-4">
              {roadmap['90dias'].map((item, idx) => (
                <div key={idx} className="flex gap-3 p-3 bg-purple/20 rounded-[28px] border border-purple/40">
                  <CheckCircle2 className="w-5 h-5 text-purple/30 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-white">{item}</p>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Section 5: Sales Language for 3 Key Conversations */}
      <Card className="border-2 border-pink-500/50 bg-pink-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-pink-600" />
            El Lenguaje Que Vende Tu Perfil
          </CardTitle>
          <CardDescription>Las 3 conversaciones donde cambias el juego</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="linkedin" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="linkedin">LinkedIn Headline</TabsTrigger>
              <TabsTrigger value="interview">Entrevista</TabsTrigger>
              <TabsTrigger value="networking">Networking</TabsTrigger>
            </TabsList>

            <TabsContent value="linkedin" className="mt-4">
              <div className="space-y-3">
                <div className="p-4 bg-pink/20 rounded-[28px] border border-pink-400/50">
                  <p className="text-sm font-semibold text-white mb-2">Propuesta:</p>
                  <p className="text-white font-medium">{language.linkedin}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(language.linkedin, 'linkedin')}
                  className="w-full"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copiedSection === 'linkedin' ? 'Copiado!' : 'Copiar a portapapeles'}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="interview" className="mt-4">
              <div className="space-y-3">
                <div className="p-4 bg-pink/20 rounded-[28px] border border-pink-400/50">
                  <p className="text-sm font-semibold text-white mb-2">Respuesta en Entrevista a "Cuéntame de ti":</p>
                  <p className="text-white">{language.interview}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(language.interview, 'interview')}
                  className="w-full"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copiedSection === 'interview' ? 'Copiado!' : 'Copiar a portapapeles'}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="networking" className="mt-4">
              <div className="space-y-3">
                <div className="p-4 bg-pink/20 rounded-[28px] border border-pink-400/50">
                  <p className="text-sm font-semibold text-white mb-2">Pitch en Networking:</p>
                  <p className="text-white">{language.networking}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(language.networking, 'networking')}
                  className="w-full"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copiedSection === 'networking' ? 'Copiado!' : 'Copiar a portapapeles'}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <Card className="bg-background">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold text-foreground">El Siguiente Paso</h3>
            <p className="text-muted max-w-2xl mx-auto">
              Ahora tienes el mapa. Este reporte es tu brújula en los próximos 90 días. 
              La pregunta no es "¿soy {profile.primary}?" sino "¿qué hago con ello?"
            </p>
            <div className="flex gap-3 justify-center pt-4">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Download className="w-4 h-4 mr-2" />
                Descargar Reporte
              </Button>
              <Button variant="outline">
                Compartir con Coach
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
