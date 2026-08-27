/**
 * Travis Dev Mode - Complete Form Data
 * Pre-filled responses for all DTC forms across C1, A1, C2, A2, A3
 * Enables comfortable testing of layouts and logic
 */

// ═══════════════════════════════════════════════════════════════════════════
// DAY 1: ESCANEO DE VISIÓN + HIPÓTESIS
// ═══════════════════════════════════════════════════════════════════════════

export const TRAVIS_DAY1_DATA = {
  // Step 2: Escaneo de Visión
  change30Days: `Necesito hacer la transición de mi rol actual como "Analista de Producto Junior" a un puesto real de Product Manager con responsabilidades de toma de decisiones. Llevo 18 meses haciendo trabajo de PM sin el título ni el salario correspondiente. En los próximos 30 días quiero: 1) Documentar mis logros cuantificables de los últimos 6 meses, 2) Actualizar mi CV con métricas reales de impacto, y 3) Comenzar a aplicar a roles de PM Mid-level en empresas de tecnología B2B SaaS.`,

  targetRole: `Product Manager Mid-Level en empresa B2B SaaS del sector EdTech o ProductivityTech. Modalidad remota o híbrida con flexibilidad. Equipo de producto de 5-15 personas con cultura de autonomía y experimentación. Empresa en etapa Serie A/B con producto ya validado pero con espacio para innovar. Salario objetivo: 50-70K USD anuales.`,

  mainBlocker: `Mi CV no refleja el valor real que he creado. Siempre quedo posicionado como "asistente" o "analista junior" aunque he liderado lanzamientos de features que generaron +200K en revenue. Los reclutadores no ven mi experiencia real porque no tengo el título formal de PM. También me cuesta articular mis logros en entrevistas - sé que hice cosas importantes pero no las cuento de forma impactante.`,

  // Step 3: Hipótesis de Ruta
  hypothesis: `Si logro documentar mis 5 logros más impactantes con métricas específicas (revenue generado, usuarios impactados, eficiencia mejorada), actualizar mi CV para reflejar responsabilidades de PM real (no de "asistente"), y practicar 10+ veces mi pitch de 60 segundos sobre por qué soy PM aunque mi título diga "analista", entonces podré pasar al menos 2 de cada 5 screenings iniciales con reclutadores y llegar a entrevistas técnicas de PM.`,

  // Step 4: Las 3 Puertas (Gates)
  gates: {
    identity: `Mi identidad profesional actual es "Analista de Producto Junior que hace trabajo de PM". Necesito reconstruirla como "Product Manager con 18 meses de experiencia práctica liderando features de alto impacto en B2B SaaS". El cambio clave es dejar de pedir permiso para ser PM y empezar a presentarme como lo que ya soy basado en mi trabajo real, no en mi título formal.`,

    evidence: `Tengo evidencia sólida pero dispersa: 1) Feature de onboarding que redujo churn 23% (tengo Slack threads y dashboard screenshots), 2) Roadmap de Q3 que presenté al CEO (tengo la presentación), 3) User research con 15 clientes que cambió la priorización del roadmap (tengo notas y grabaciones con permiso). Necesito consolidar todo en un "Evidence Portfolio" con narrativa coherente.`,

    material: `Mis materiales actuales (CV, LinkedIn, portfolio) están desactualizados y no reflejan mi nivel real. El CV dice "apoyo al equipo de producto" cuando debería decir "lideré el diseño y lanzamiento de...". Mi LinkedIn no tiene ningún post mostrando pensamiento de producto. Mi portfolio no existe - solo tengo screenshots sueltos. Necesito 15 horas de trabajo enfocado para arreglar esto.`,
  },

  // Step 5: Roadmap
  roadmap: `**SEMANA 1 (Días 1-7): Documentación de Evidencia**
- Día 1-2: Recopilar métricas de mis 5 proyectos clave de los últimos 18 meses
- Día 3-4: Escribir narrativa STAR para cada logro (Situación, Tarea, Acción, Resultado)
- Día 5-7: Crear "Evidence Portfolio" visual con screenshots, métricas y quotes de stakeholders

**SEMANA 2 (Días 8-14): Reconstrucción de CV y LinkedIn**
- Día 8-10: Reescribir CV completo con lenguaje de PM y métricas específicas
- Día 11-12: Actualizar LinkedIn (headline, about, experiencia, skills)
- Día 13-14: Pedir 3 recomendaciones a stakeholders que vieron mi trabajo de PM

**SEMANA 3 (Días 15-21): Preparación de Entrevistas**
- Día 15-17: Escribir y memorizar pitch de 60 segundos "¿Por qué PM?"
- Día 18-19: Preparar 10 historias STAR para preguntas conductuales comunes
- Día 20-21: Mock interviews con 2 amigos PMs

**SEMANA 4 (Días 22-30): Aplicación Estratégica**
- Día 22-25: Identificar 20 empresas target y 40 roles específicos
- Día 26-28: Aplicar a 15 roles con aplicaciones personalizadas
- Día 29-30: Follow up con conexiones de red en empresas target

**Hito de Éxito Día 30:** Tener al menos 3 entrevistas programadas con empresas de mi lista A o B.`,

  // Scoring (auto-calculated in real flow)
  scores: {
    clarity: 85,
    logic: 82,
    realism: 78,
    actionability: 88,
  },
  totalScore: 83,
  passStatus: 'pass' as const,
}

// ═══════════════════════════════════════════════════════════════════════════
// DAY 2-6: FOUNDATION MISSIONS
// ═══════════════════════════════════════════════════════════════════════════

export const TRAVIS_DAY2_DATA = {
  careerMirrorReflection: `Mi carrera hasta ahora ha sido un camino de "demostrar más de lo que mi título dice". Empecé como pasante de marketing, pero rápidamente me moví a analítica porque me di cuenta que ahí estaba el valor real. Cada rol que he tenido, he terminado haciendo trabajo 2 niveles arriba de mi título. El patrón que veo: soy bueno identificando oportunidades pero malo negociando reconocimiento formal. Eso termina hoy.`,

  strengthsIdentified: [
    'Pensamiento sistémico - veo conexiones entre datos, usuarios y negocio',
    'Comunicación técnica - traduzco entre ingeniería y stakeholders no-técnicos',
    'Curiosidad de usuario - me obsesiono con entender el "por qué" detrás del comportamiento',
    'Ejecución rápida - prefiero lanzar y aprender que planificar eternamente',
    'Influencia sin autoridad - he liderado proyectos sin ser el "jefe oficial"',
  ],

  developmentAreas: [
    'Negociación salarial y de títulos - acepto menos de lo que merezco',
    'Visibilidad estratégica - hago buen trabajo pero no lo comunico',
    'Delegación - tiendo a hacer todo yo mismo en lugar de empoderar',
  ],
}

export const TRAVIS_DAY3_DATA = {
  marketResearch: `Investigué 25 ofertas de PM en LinkedIn, 15 en Glassdoor, y 10 en sitios de empresas target. Hallazgos clave:

1. **Requisitos más comunes:** 
   - 3-5 años experiencia en producto (lo tengo si cuento mi trabajo real)
   - Experiencia con metodologías ágiles (Scrum Master certified)
   - SQL y analytics (uso Amplitude y Mixpanel diariamente)
   - Comunicación cross-funcional (mi fortaleza principal)

2. **Skills diferenciadores:**
   - Experiencia B2B SaaS específica (lo tengo)
   - User research hands-on (hice 50+ entrevistas)
   - Revenue impact demostrable (tengo las métricas)

3. **Gaps a cerrar:**
   - "5 años de experiencia como PM" - necesito reframear mis 18 meses como PM de facto + 3 años adyacentes
   - "Liderazgo de equipo" - lideré indirectamente, necesito articularlo mejor

4. **Salarios observados:** $55-85K USD para PM Mid en LATAM remoto, $70-120K para US remoto`,

  competitorAnalysis: `Analicé 10 perfiles de LinkedIn de PMs que consiguieron roles similares a mi target:

**Patrón común:** Todos tienen historias de "transición no tradicional" - ex-consultores, ex-ingenieros, ex-marketers. Ninguno tenía título de PM desde el día 1.

**Lo que hacen bien:**
- Headlines claros: "Product Manager | B2B SaaS | Revenue Growth"
- About sections con métricas específicas
- 3-5 recomendaciones visibles de stakeholders senior
- Posts regulares sobre temas de producto (1-2 por mes)

**Mi ventaja:** Tengo métricas de impacto más fuertes que la mayoría. Lo que me falta es la narrativa y visibilidad.`,
}

export const TRAVIS_DAY4_DATA = {
  valueProposition: `**Mi Propuesta de Valor Única:**

"Soy un Product Manager con mentalidad de builder que combina intuición de usuario con rigor de datos para crear productos que la gente realmente usa. En mi último rol, lideré el rediseño del onboarding que redujo el churn de nuevos usuarios en 23% y aumentó la activación en 45%. Mi superpoder es traducir entre mundos: puedo hablar con ingenieros sobre arquitectura técnica y con ejecutivos sobre impacto de negocio en la misma reunión."

**Los 3 pilares de mi valor:**
1. **Impacto medible:** Cada feature que lanzo tiene métricas claras de éxito definidas antes del build
2. **User obsession:** No asumo - entrevisto, observo, y valido antes de priorizar
3. **Velocidad con calidad:** Prefiero iteraciones rápidas con aprendizaje real vs perfección teórica`,

  differentiators: [
    'Experiencia B2B SaaS en producto con ciclos de venta enterprise',
    'Hands-on con data: SQL, Amplitude, Mixpanel - no dependo de analysts',
    'Background en marketing da perspectiva única de positioning',
    'Bilingüe inglés/español para equipos internacionales',
    'Remote-first nativo: 3 años trabajando async efectivamente',
  ],
}

export const TRAVIS_DAY5_DATA = {
  achievementDocumentation: [
    {
      title: 'Rediseño de Onboarding',
      context: 'Usuarios nuevos abandonaban antes de ver el valor del producto',
      action: 'Lideré research con 15 usuarios, propuse nueva arquitectura de 5 pasos, coordiné implementación con 3 devs',
      result: '-23% churn primeros 30 días, +45% tasa de activación, +$200K ARR atribuible',
      evidence: 'Dashboard screenshots, Slack del CEO felicitando, antes/después del funnel',
    },
    {
      title: 'Sistema de Priorización de Roadmap',
      context: 'Equipo reactivo sin framework claro para decidir qué construir',
      action: 'Creé framework RICE adaptado, implementé scoring en Notion, lideré 3 sesiones de alineación con stakeholders',
      result: 'Roadmap Q3 aprobado por CEO en 1 reunión vs 5 del trimestre anterior, equipo 40% más enfocado',
      evidence: 'Template de Notion, presentación al board, feedback de engineering lead',
    },
    {
      title: 'Programa de User Research Continuo',
      context: 'Decisiones de producto basadas en opiniones internas, no en usuarios reales',
      action: 'Establecí cadencia de 4 entrevistas/semana, creé repositorio de insights, integré findings en sprint planning',
      result: '50+ entrevistas en 6 meses, 3 features pivoteadas basadas en feedback, NPS subió de 32 a 47',
      evidence: 'Grabaciones (con permiso), repositorio de insights, testimonios de clientes',
    },
  ],
}

export const TRAVIS_DAY6_DATA = {
  cvDraft: `**TRAVIS RODRIGUEZ**
Product Manager | B2B SaaS | Revenue Growth & User Activation

CONTACTO
travis@email.com | linkedin.com/in/travispm | Ciudad de México (Remoto)

RESUMEN EJECUTIVO
Product Manager con 5 años en roles adyacentes a producto y 18 meses liderando iniciativas de PM de alto impacto en B2B SaaS. Especializado en onboarding, activación de usuarios y métricas de retención. Track record de decisiones basadas en datos con impacto medible en revenue.

EXPERIENCIA

**Product Manager (Título: Analista de Producto Sr)** | TechSaaS Corp | 2022-Presente
- Lideré rediseño de onboarding: -23% churn, +45% activación, +$200K ARR
- Implementé framework RICE para priorización: roadmap aprobado 5x más rápido
- Establecí programa de research: 50+ entrevistas, NPS +15 puntos

**Analista de Producto** | StartupXYZ | 2020-2022
- Definí métricas de producto para 3 features principales
- Colaboré con engineering en especificaciones técnicas
- Coordiné UAT con clientes enterprise

HABILIDADES
Producto: User Research, Roadmapping, Priorización RICE/ICE, PRDs, User Stories
Analytics: SQL, Amplitude, Mixpanel, Tableau, A/B Testing
Metodologías: Scrum (Certified), Kanban, Jobs-to-be-Done
Tools: Figma, Notion, Jira, Linear, Productboard

EDUCACIÓN
Licenciatura en Administración de Empresas | Universidad ABC | 2018
Scrum Master Certified | 2021`,

  linkedInHeadline: 'Product Manager | B2B SaaS | User Activation & Revenue Growth | Previously: TechSaaS, StartupXYZ',
}

// ═══════════════════════════════════════════════════════════════════════════
// DAY 7: A3 CHECKPOINT 1 - CAREER MIRROR
// ═══════════════════════════════════════════════════════════════════════════

export const TRAVIS_A3_MODULE1_DATA = {
  careerNarrative: `Mi carrera ha sido un viaje de descubrimiento de que el producto es donde pertenezco. Empecé en marketing porque era el camino "seguro", pero cada vez que tenía la oportunidad de trabajar más cerca del producto - analizando datos, hablando con usuarios, definiendo features - me encendía de una forma que el marketing nunca logró.

El punto de inflexión fue cuando lideré mi primer proyecto de producto "por accidente" - el PM renunció y yo levanté la mano. Esas 8 semanas me enseñaron que tengo instinto natural para esto: para entender usuarios, para priorizar con impacto, para traducir entre equipos. Ahora mi misión es formalizar lo que ya soy.`,

  identityStatement: `Soy un Product Manager que combina pensamiento sistémico con obsesión por el usuario. Mi superpoder es ver conexiones que otros no ven - entre datos y comportamiento, entre features y negocio, entre equipos y resultados. Lidero con curiosidad y decido con datos.`,

  valueEvidence: [
    '+$200K ARR atribuible a mi feature de onboarding',
    '23% reducción en churn de nuevos usuarios',
    '50+ entrevistas de usuario conducidas',
    'NPS mejorado de 32 a 47 en 6 meses',
    'Roadmap trimestral aprobado 5x más rápido con mi framework',
  ],

  certificationScore: 87,
  certifiedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
}

// ═══════════════════════════════════════════════════════════════════════════
// DAYS 8-15: VALUE MINING & EVIDENCE BUILDING
// ═══════════════════════════════════════════════════════════════════════════

export const TRAVIS_DAY8_TO_15_DATA = {
  day8: {
    achievementsMined: 12,
    topAchievements: ['Onboarding redesign', 'Research program', 'RICE framework', 'Enterprise integration'],
  },
  day9: {
    starStoriesDrafted: 8,
    bestStory: 'Onboarding redesign - complete STAR with metrics',
  },
  day10: {
    evidenceCollected: ['15 screenshots', '3 presentations', '5 Slack threads', '2 testimonials'],
  },
  day11: {
    portfolioStarted: true,
    sections: ['Overview', 'Case Study 1: Onboarding', 'Case Study 2: Research Program', 'Metrics Dashboard'],
  },
  day12: {
    caseStudyDrafted: 'Onboarding Redesign - 800 words with visuals',
  },
  day13: {
    testimonialRequested: ['VP Engineering', 'Customer Success Lead', 'CEO'],
  },
  day14: {
    linkedInUpdated: true,
    newConnections: 15,
    postsPlanned: 3,
  },
  day15: {
    weeklyReview: 'Strong progress. Portfolio 60% complete. Need to push on testimonials.',
  },
}

// ═══════════════════════════════════════════════════════════════════════════
// DAY 16: A3 CHECKPOINT 2 - VALUE MINING LAB
// ═══════════════════════════════════════════════════════════════════════════

export const TRAVIS_A3_MODULE2_DATA = {
  minedValues: [
    {
      value: 'User-Centric Decision Making',
      evidence: '50+ user interviews conducted, 3 features pivoted based on feedback',
      impact: 'NPS increased from 32 to 47',
    },
    {
      value: 'Data-Driven Prioritization',
      evidence: 'RICE framework implementation, dashboard creation',
      impact: 'Roadmap approval time reduced 80%',
    },
    {
      value: 'Cross-Functional Leadership',
      evidence: 'Led projects with eng, design, CS without formal authority',
      impact: 'Projects delivered on time despite no direct reports',
    },
  ],
  valuePropositionRefined: `I turn user insights into revenue-driving product decisions. My unique combination of hands-on research skills and business acumen means I don't just build features—I build features that measurably grow the business.`,
  certificationScore: 85,
  certifiedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
}

// ═══════════════════════════════════════════════════════════════════════════
// DAYS 17-26: CV BUILDING & OPTIMIZATION
// ═══════════════════════════════════════════════════════════════════════════

export const TRAVIS_DAY17_TO_26_DATA = {
  day17: {
    cvSections: ['Header', 'Summary', 'Experience', 'Skills', 'Education'],
    draftComplete: true,
  },
  day18: {
    keywordsOptimized: ['Product Manager', 'B2B SaaS', 'User Research', 'Roadmapping', 'Agile'],
  },
  day19: {
    metricsAdded: ['+$200K ARR', '-23% churn', '+45% activation', '50+ interviews'],
  },
  day20: {
    feedbackReceived: 'From 2 PM friends - "Much stronger, but summary could be punchier"',
  },
  day21: {
    revisionsComplete: true,
    version: 'v3',
  },
  day22: {
    atsOptimized: true,
    keywordDensity: 'Optimized for 15 target keywords',
  },
  day23: {
    linkedInAligned: true,
    headline: 'Product Manager | B2B SaaS | +$200K ARR Impact',
  },
  day24: {
    portfolioLinked: 'notion.so/travispm-portfolio',
  },
  day25: {
    coverLetterTemplate: 'Created 3 templates for different company types',
  },
  day26: {
    materialsReview: 'All materials consistent and ready for applications',
  },
}

// ═══════════════════════════════════════════════════════════════════════════
// DAY 27: A3 CHECKPOINT 3 - CV BUILDER STUDIO
// ═══════════════════════════════════════════════════════════════════════════

export const TRAVIS_A3_MODULE3_DATA = {
  cvFinalVersion: 'v4 - ATS optimized, metrics-rich, PM-focused',
  keyImprovements: [
    'Repositioned from "Analyst" to "Product Manager"',
    'Added 8 quantified achievements',
    'Optimized for ATS with 15 target keywords',
    'Created 3 tailored versions for different company sizes',
  ],
  linkedInScore: 92, // LinkedIn profile strength
  portfolioComplete: true,
  certificationScore: 89,
  certifiedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
}

// ═══════════════════════════════════════════════════════════════════════════
// DAYS 28-34: JOB MARKET ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════

export const TRAVIS_DAY28_TO_34_DATA = {
  day28: {
    companiesResearched: 30,
    topTier: ['Notion', 'Linear', 'Figma', 'Stripe', 'Vercel'],
  },
  day29: {
    rolesIdentified: 45,
    matchScore: { high: 15, medium: 20, low: 10 },
  },
  day30: {
    milestone: 'First month complete! 15 high-match roles identified.',
    confidence: 78,
  },
  day31: {
    salaryResearch: { min: 55000, max: 85000, target: 70000, currency: 'USD' },
  },
  day32: {
    networkMapping: { connections: 150, relevant: 35, toReachOut: 15 },
  },
  day33: {
    companyInsiders: 5,
    infoCalls: 2,
  },
  day34: {
    applicationPriorities: [
      { company: 'Linear', role: 'PM - Growth', priority: 1 },
      { company: 'Notion', role: 'PM - Collaboration', priority: 2 },
      { company: 'Vercel', role: 'PM - Developer Experience', priority: 3 },
    ],
  },
}

// ═══════════════════════════════════════════════════════════════════════════
// DAY 35: A3 CHECKPOINT 4 - JOB DECODER
// ═══════════════════════════════════════════════════════════════════════════

export const TRAVIS_A3_MODULE4_DATA = {
  decodedJobs: [
    {
      company: 'Linear',
      role: 'Product Manager - Growth',
      requirements: ['3+ years PM', 'Growth experience', 'B2B SaaS', 'SQL'],
      fitScore: 92,
      gaps: ['Could strengthen growth-specific metrics'],
    },
    {
      company: 'Notion',
      role: 'Product Manager - Collaboration',
      requirements: ['5+ years PM', 'Enterprise experience', 'User research'],
      fitScore: 78,
      gaps: ['Years of experience on paper, but real experience matches'],
    },
  ],
  marketInsights: 'PM market competitive but strong demand for data-fluent PMs with B2B SaaS experience',
  certificationScore: 84,
  certifiedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
}

// ═══════════════════════════════════════════════════════════════════════════
// DAYS 36-42: ANSWER PREPARATION
// ═══════════════════════════════════════════════════════════════════════════

export const TRAVIS_DAY36_TO_42_DATA = {
  day36: { preparedAnswers: 5, focus: 'Tell me about yourself' },
  day37: { preparedAnswers: 10, focus: 'Why product management?' },
  day38: { preparedAnswers: 15, focus: 'Greatest achievement' },
  day39: { preparedAnswers: 20, focus: 'Handling failure' },
  day40: { preparedAnswers: 25, focus: 'Prioritization approach' },
  day41: { preparedAnswers: 30, focus: 'Working with engineers' },
  day42: { preparedAnswers: 35, focus: 'Data-driven decisions' },
}

// ═══════════════════════════════════════════════════════════════════════════
// DAY 43: A3 CHECKPOINT 5 - ANSWER ARCHITECTURE
// ═══════════════════════════════════════════════════════════════════════════

export const TRAVIS_A3_MODULE5_DATA = {
  answerFrameworks: [
    { question: 'Tell me about yourself', framework: 'Present-Past-Future', practiced: 15 },
    { question: 'Why PM?', framework: 'Story Arc', practiced: 12 },
    { question: 'Greatest achievement', framework: 'STAR+Impact', practiced: 10 },
    { question: 'Handle disagreement', framework: 'Situation-Approach-Outcome', practiced: 8 },
  ],
  totalAnswersPrepared: 40,
  confidenceLevel: 82,
  certificationScore: 86,
  certifiedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
}

// ═══════════════════════════════════════════════════════════════════════════
// DAYS 44-50: COACH PRACTICE
// ═══════════════════════════════════════════════════════════════════════════

export const TRAVIS_DAY44_TO_50_DATA = {
  day44: { practiceSession: 1, focus: 'Introduction pitch', score: 72 },
  day45: { practiceSession: 2, focus: 'Achievement stories', score: 78 },
  day46: { practiceSession: 3, focus: 'Technical questions', score: 75 },
  day47: { practiceSession: 4, focus: 'Behavioral questions', score: 82 },
  day48: { practiceSession: 5, focus: 'Case study walkthrough', score: 70 },
  day49: { practiceSession: 6, focus: 'Salary negotiation', score: 68 },
  day50: { practiceSession: 7, focus: 'Full mock interview', score: 80 },
}

// ═══════════════════════════════════════════════════════════════════════════
// DAY 51: A3 CHECKPOINT 6 - COACH PRACTICE ROOM
// ═══════════════════════════════════════════════════════════════════════════

export const TRAVIS_A3_MODULE6_DATA = {
  practiceSessionsCompleted: 8,
  averageScore: 78,
  keyImprovements: [
    'More concise answers (reduced from 3 min to 90 sec average)',
    'Better use of metrics in examples',
    'Improved eye contact and confidence in video',
    'Smoother transitions between answer sections',
  ],
  areasForPractice: ['Salary negotiation confidence', 'Case study speed'],
  certificationScore: 81,
  certifiedAt: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000),
}

// ═══════════════════════════════════════════════════════════════════════════
// DAYS 52-57: COMMUNICATION GYM
// ═══════════════════════════════════════════════════════════════════════════

export const TRAVIS_DAY52_TO_57_DATA = {
  day52: { exercise: 'Voice modulation', score: 75 },
  day53: { exercise: 'Pacing and pauses', score: 78 },
  day54: { exercise: 'Body language', score: 72 },
  day55: { exercise: 'Active listening cues', score: 85 },
  day56: { exercise: 'Storytelling flow', score: 80 },
  day57: { exercise: 'Handling silence', score: 70 },
}

// ═══════════════════════════════════════════════════════════════════════════
// DAY 58: A3 CHECKPOINT 7 - COMMUNICATION GYM
// ═══════════════════════════════════════════════════════════════════════════

export const TRAVIS_A3_MODULE7_DATA = {
  communicationScore: 79,
  strengths: ['Clear articulation', 'Good use of examples', 'Authentic enthusiasm'],
  improvements: ['Reduce filler words', 'More strategic pauses', 'Better question asking'],
  videoReviewComplete: true,
  certificationScore: 83,
  certifiedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
}

// ═══════════════════════════════════════════════════════════════════════════
// DAYS 59-67: SIMULATION PREPARATION
// ═══════════════════════════════════════════════════════════════════════════

export const TRAVIS_DAY59_TO_67_DATA = {
  day59: { simulation: 'Phone screen', result: 'Pass' },
  day60: { milestone: 'Day 60! 2/3 through journey.', confidence: 85 },
  day61: { simulation: 'Hiring manager round', result: 'Pass' },
  day62: { simulation: 'Technical PM round', result: 'Pass with feedback' },
  day63: { simulation: 'Case study presentation', result: 'Pass' },
  day64: { simulation: 'Cross-functional interview', result: 'Pass' },
  day65: { simulation: 'Executive presentation', result: 'Pass with minor notes' },
  day66: { simulation: 'Full day on-site simulation', result: 'Strong pass' },
  day67: { simulation: 'Debrief and calibration', result: 'Ready for real interviews' },
}

// ═══════════════════════════════════════════════════════════════════════════
// DAY 68: A3 CHECKPOINT 8 - RECRUITER SCREEN SIMULATION
// ═══════════════════════════════════════════════════════════════════════════

export const TRAVIS_A3_MODULE8_DATA = {
  simulationResult: 'Strong Pass',
  recruiterFeedback: {
    strengths: ['Clear value proposition', 'Excellent use of metrics', 'Genuine enthusiasm'],
    improvements: ['Could ask more questions about role', 'Slightly faster on salary expectations'],
  },
  passRate: '4 of 5 simulated screens passed',
  readyForReal: true,
  certificationScore: 88,
  certifiedAt: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000),
}

// ═══════════════════════════════════════════════════════════════════════════
// DAYS 69-77: DIFFICULT QUESTIONS & REAL MARKET
// ═══════════════════════════════════════════════════════════════════════════

export const TRAVIS_DAY69_TO_77_DATA = {
  day69: { difficultQuestion: 'Biggest failure', prepared: true },
  day70: { difficultQuestion: 'Gap in experience', prepared: true },
  day71: { difficultQuestion: 'Why leaving current role', prepared: true },
  day72: { difficultQuestion: 'Salary expectations', prepared: true },
  day73: { difficultQuestion: 'Weakness', prepared: true },
  day74: { difficultQuestion: 'Conflict with manager', prepared: true },
  day75: { difficultQuestion: 'Where in 5 years', prepared: true },
  day76: { difficultQuestion: 'Why this company', prepared: true },
  day77: { difficultQuestion: 'Questions for us', prepared: true },
}

// ═══════════════════════════════════════════════════════════════════════════
// DAY 78: A3 CHECKPOINT 9 - DIFFICULT QUESTIONS LAB
// ═══════════════════════════════════════════════════════════════════════════

export const TRAVIS_A3_MODULE9_DATA = {
  difficultQuestionsMastered: 12,
  mostChallenging: 'Explaining the gap between title and responsibilities',
  bestAnswer: 'Turned "gap" into "growth story" - how I took on PM work before the title',
  confidenceOnDifficult: 85,
  certificationScore: 86,
  certifiedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
}

// ═══════════════════════════════════════════════════════════════════════════
// DAYS 79-87: REAL MARKET ENGAGEMENT
// ═══════════════════════════════════════════════════════════════════════════

export const TRAVIS_DAY79_TO_87_DATA = {
  day79: { applications: 5, company: 'Linear, Notion, Figma, Vercel, Stripe' },
  day80: { applications: 10, responses: 2 },
  day81: { interviews: 1, company: 'Linear', stage: 'Phone Screen' },
  day82: { interviews: 2, company: 'Notion', stage: 'Phone Screen' },
  day83: { interviews: 2, feedback: 'Positive, moving forward' },
  day84: { interviews: 3, company: 'Vercel', stage: 'Phone Screen' },
  day85: { interviews: 3, advancedToNext: 2 },
  day86: { interviews: 4, company: 'Linear', stage: 'Hiring Manager' },
  day87: { interviews: 4, status: 'Strong pipeline building' },
}

// ═══════════════════════════════════════════════════════════════════════════
// DAY 88: A3 CHECKPOINT 10 - FINAL INTERVIEW VALIDATION
// ═══════════════════════════════════════════════════════════════════════════

export const TRAVIS_A3_MODULE10_DATA = {
  finalAssessment: 'Ready for senior PM interviews',
  interviewReadiness: 92,
  strengthsSummary: [
    'Strong metrics-driven storytelling',
    'Excellent handling of difficult questions',
    'Clear career narrative and PM identity',
    'Solid technical PM fundamentals',
    'Good rapport building with interviewers',
  ],
  finalRecommendations: [
    'Continue practicing case studies',
    'Prepare company-specific research for each interview',
    'Keep energy and enthusiasm high',
  ],
  certificationScore: 91,
  certifiedAt: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000),
}

// ═══════════════════════════════════════════════════════════════════════════
// DAYS 89-90: FINAL REVIEW & LAUNCH
// ═══════════════════════════════════════════════════════════════════════════

export const TRAVIS_DAY89_TO_90_DATA = {
  day89: {
    finalPrep: 'All systems ready',
    materialsChecked: true,
    practiceComplete: true,
    mindsetReady: true,
  },
  day90: {
    journeyComplete: true,
    totalXp: 2460,
    modulesCompleted: 10,
    daysCompleted: 90,
    interviewsScheduled: 4,
    confidenceLevel: 92,
    nextSteps: [
      'Continue real interviews with Linear (Hiring Manager stage)',
      'Second round with Notion scheduled',
      'Waiting on Vercel response',
      'Keep applying to backup options',
    ],
    reflection: `This 90-day journey transformed how I see myself professionally. I entered thinking "I'm just an analyst who does PM work" and exit knowing "I AM a Product Manager with proven impact." The evidence is documented, the skills are practiced, and the confidence is earned. Time to land that role.`,
  },
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER: GET ALL TRAVIS DATA BY DAY
// ═══════════════════════════════════════════════════════════════════════════

export function getTravisDayData(dayNumber: number): Record<string, any> | null {
  const dayDataMap: Record<number, any> = {
    1: TRAVIS_DAY1_DATA,
    2: TRAVIS_DAY2_DATA,
    3: TRAVIS_DAY3_DATA,
    4: TRAVIS_DAY4_DATA,
    5: TRAVIS_DAY5_DATA,
    6: TRAVIS_DAY6_DATA,
    7: TRAVIS_A3_MODULE1_DATA,
    8: TRAVIS_DAY8_TO_15_DATA.day8,
    9: TRAVIS_DAY8_TO_15_DATA.day9,
    10: TRAVIS_DAY8_TO_15_DATA.day10,
    11: TRAVIS_DAY8_TO_15_DATA.day11,
    12: TRAVIS_DAY8_TO_15_DATA.day12,
    13: TRAVIS_DAY8_TO_15_DATA.day13,
    14: TRAVIS_DAY8_TO_15_DATA.day14,
    15: TRAVIS_DAY8_TO_15_DATA.day15,
    16: TRAVIS_A3_MODULE2_DATA,
    17: TRAVIS_DAY17_TO_26_DATA.day17,
    18: TRAVIS_DAY17_TO_26_DATA.day18,
    19: TRAVIS_DAY17_TO_26_DATA.day19,
    20: TRAVIS_DAY17_TO_26_DATA.day20,
    21: TRAVIS_DAY17_TO_26_DATA.day21,
    22: TRAVIS_DAY17_TO_26_DATA.day22,
    23: TRAVIS_DAY17_TO_26_DATA.day23,
    24: TRAVIS_DAY17_TO_26_DATA.day24,
    25: TRAVIS_DAY17_TO_26_DATA.day25,
    26: TRAVIS_DAY17_TO_26_DATA.day26,
    27: TRAVIS_A3_MODULE3_DATA,
    28: TRAVIS_DAY28_TO_34_DATA.day28,
    29: TRAVIS_DAY28_TO_34_DATA.day29,
    30: TRAVIS_DAY28_TO_34_DATA.day30,
    31: TRAVIS_DAY28_TO_34_DATA.day31,
    32: TRAVIS_DAY28_TO_34_DATA.day32,
    33: TRAVIS_DAY28_TO_34_DATA.day33,
    34: TRAVIS_DAY28_TO_34_DATA.day34,
    35: TRAVIS_A3_MODULE4_DATA,
    36: TRAVIS_DAY36_TO_42_DATA.day36,
    37: TRAVIS_DAY36_TO_42_DATA.day37,
    38: TRAVIS_DAY36_TO_42_DATA.day38,
    39: TRAVIS_DAY36_TO_42_DATA.day39,
    40: TRAVIS_DAY36_TO_42_DATA.day40,
    41: TRAVIS_DAY36_TO_42_DATA.day41,
    42: TRAVIS_DAY36_TO_42_DATA.day42,
    43: TRAVIS_A3_MODULE5_DATA,
    44: TRAVIS_DAY44_TO_50_DATA.day44,
    45: TRAVIS_DAY44_TO_50_DATA.day45,
    46: TRAVIS_DAY44_TO_50_DATA.day46,
    47: TRAVIS_DAY44_TO_50_DATA.day47,
    48: TRAVIS_DAY44_TO_50_DATA.day48,
    49: TRAVIS_DAY44_TO_50_DATA.day49,
    50: TRAVIS_DAY44_TO_50_DATA.day50,
    51: TRAVIS_A3_MODULE6_DATA,
    52: TRAVIS_DAY52_TO_57_DATA.day52,
    53: TRAVIS_DAY52_TO_57_DATA.day53,
    54: TRAVIS_DAY52_TO_57_DATA.day54,
    55: TRAVIS_DAY52_TO_57_DATA.day55,
    56: TRAVIS_DAY52_TO_57_DATA.day56,
    57: TRAVIS_DAY52_TO_57_DATA.day57,
    58: TRAVIS_A3_MODULE7_DATA,
    59: TRAVIS_DAY59_TO_67_DATA.day59,
    60: TRAVIS_DAY59_TO_67_DATA.day60,
    61: TRAVIS_DAY59_TO_67_DATA.day61,
    62: TRAVIS_DAY59_TO_67_DATA.day62,
    63: TRAVIS_DAY59_TO_67_DATA.day63,
    64: TRAVIS_DAY59_TO_67_DATA.day64,
    65: TRAVIS_DAY59_TO_67_DATA.day65,
    66: TRAVIS_DAY59_TO_67_DATA.day66,
    67: TRAVIS_DAY59_TO_67_DATA.day67,
    68: TRAVIS_A3_MODULE8_DATA,
    69: TRAVIS_DAY69_TO_77_DATA.day69,
    70: TRAVIS_DAY69_TO_77_DATA.day70,
    71: TRAVIS_DAY69_TO_77_DATA.day71,
    72: TRAVIS_DAY69_TO_77_DATA.day72,
    73: TRAVIS_DAY69_TO_77_DATA.day73,
    74: TRAVIS_DAY69_TO_77_DATA.day74,
    75: TRAVIS_DAY69_TO_77_DATA.day75,
    76: TRAVIS_DAY69_TO_77_DATA.day76,
    77: TRAVIS_DAY69_TO_77_DATA.day77,
    78: TRAVIS_A3_MODULE9_DATA,
    79: TRAVIS_DAY79_TO_87_DATA.day79,
    80: TRAVIS_DAY79_TO_87_DATA.day80,
    81: TRAVIS_DAY79_TO_87_DATA.day81,
    82: TRAVIS_DAY79_TO_87_DATA.day82,
    83: TRAVIS_DAY79_TO_87_DATA.day83,
    84: TRAVIS_DAY79_TO_87_DATA.day84,
    85: TRAVIS_DAY79_TO_87_DATA.day85,
    86: TRAVIS_DAY79_TO_87_DATA.day86,
    87: TRAVIS_DAY79_TO_87_DATA.day87,
    88: TRAVIS_A3_MODULE10_DATA,
    89: TRAVIS_DAY89_TO_90_DATA.day89,
    90: TRAVIS_DAY89_TO_90_DATA.day90,
  }

  return dayDataMap[dayNumber] || null
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER: GET A3 MODULE DATA
// ═══════════════════════════════════════════════════════════════════════════

export function getTravisA3ModuleData(moduleNumber: number): Record<string, any> | null {
  const moduleDataMap: Record<number, any> = {
    1: TRAVIS_A3_MODULE1_DATA,
    2: TRAVIS_A3_MODULE2_DATA,
    3: TRAVIS_A3_MODULE3_DATA,
    4: TRAVIS_A3_MODULE4_DATA,
    5: TRAVIS_A3_MODULE5_DATA,
    6: TRAVIS_A3_MODULE6_DATA,
    7: TRAVIS_A3_MODULE7_DATA,
    8: TRAVIS_A3_MODULE8_DATA,
    9: TRAVIS_A3_MODULE9_DATA,
    10: TRAVIS_A3_MODULE10_DATA,
  }

  return moduleDataMap[moduleNumber] || null
}

// ═══════════════════════════════════════════════════════════════════════════
// CHECK IF TRAVIS MODE
// ═══════════════════════════════════════════════════════════════════════════

export function isTravisMode(): boolean {
  // Production journeys must never trust browser-controlled storage or cookies
  // to seed synthetic data into an authenticated user's account. Test fixtures
  // remain available to explicit scripts, outside the live product surface.
  return false
}

// ═══════════════════════════════════════════════════════════════════════════
// DOCUMENT UPLOAD DATA - For all form textarea fields
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Complete structured document content for Day 1 upload
 * Includes all required sections: Situación, Objetivo, 3 Puertas
 */
export const TRAVIS_DAY1_UPLOAD_DOCUMENT = `# RUTA PERSONALIZADA - DÍA 1 ESCANEO DE VISIÓN

## SITUACIÓN ACTUAL
Soy Analista de Producto Junior con 18 meses de experiencia trabajando como Product Manager sin el título ni reconocimiento formal. He liderado 5 features de alto impacto que generaron más de $200K en revenue incremental para mi empresa. Mi CV actual no refleja esta realidad, posicionándome como "asistente" cuando debería estar en nivel "mid".

### Datos Contextuales:
- Empresa: B2B SaaS EdTech, $5M ARR, Serie A
- Equipo de Producto: 4 personas (yo + 1 PM Senior + 2 Product Analysts)
- Responsabilidades actuales: Roadmap design, user research, feature scoping, Go-To-Market
- Título formal: "Product Analyst" o "Senior Product Analyst"
- Feedback común de reclutadores: "Excelente PM, pero tu CV dice que eres analista"

## OBJETIVO - 30 Días
Hacer la transición formal a un puesto de Product Manager Mid-level en empresa B2B SaaS con:
- Responsabilidades claras de toma de decisiones estratégicas
- Autonomía en roadmap y priorización
- Salario rango: $50K-70K USD anuales
- Modalidad: Remota o híbrida con flexibilidad
- Sector: EdTech, ProductivityTech o MarTech preferentemente

## LAS 3 PUERTAS (GATES)

### PUERTA 1: IDENTIDAD PROFESIONAL
**Estado Actual:** Me presento como "Analista que hace trabajo de PM"
**Necesidad:** Reconstruir identidad como "PM con 18 meses experiencia práctica"

**Cambio de narrativa requerido:**
- De: "Apoyo al equipo de producto en análisis de datos"
- A: "Lideré el diseño y lanzamiento de features que impactaron 200K en revenue"

**Evidencia:**
- 5 features lanzadas con diseño de mi autoría
- Roadmaps trimestrales presentados al CEO
- User research que cambió priorización
- Relaciones directas con 30+ clientes

### PUERTA 2: EVIDENCIA CONSOLIDADA
**Estado Actual:** Evidencia dispersa en Slack, Google Drive, documentos antiguos
**Necesidad:** Portfolio profesional coherente con narrativa clara

**Logros a documentar (Formato STAR):**
1. Feature de onboarding: redujo churn 23%, impactó 1.2K usuarios, +$50K en revenue retenida
2. Roadmap Q3: priorizó top 8 features según investigación con 50+ clientes, generó $80K en nueva revenue
3. User research: entrevistas con 15 clientes mostraron oportunidad X, reposicionó roadmap Q4
4. Integration API: facilitó 8 nuevas integraciones, habilitó $40K en revenue de partners
5. Pricing research: análisis de elasticidad permitió precio premium, +$30K MRR

### PUERTA 3: MATERIALES PROFESIONALES ACTUALIZADOS
**Estado Actual:** CV desactualizado, sin LinkedIn posts, sin portfolio
**Necesidad:** Presencia profesional coherente y actualizada

**Materiales a preparar:**
- CV actualizado con lenguaje de PM y métricas
- LinkedIn completo (headline: "Product Manager en EdTech SaaS | B2B SaaS", 5+ posts)
- Portfolio visual con 5 case studies
- Email pitch para outreach (100 palabras max)

## ESTRATEGIA SEMANAL

### SEMANA 1: Consolidación de Evidencia
- Recopilar todas las métricas de mis 5 proyectos
- Crear narrativas STAR completas
- Evidencia portfolio visual

### SEMANA 2: Actualización de Presencia
- Reescribir CV completo
- Actualizar LinkedIn Profile
- Solicitar 3 recomendaciones

### SEMANA 3: Preparación de Entrevistas
- Dominar pitch de 60 segundos
- Preparar 10 historias conductuales
- Mock interviews

### SEMANA 4: Ejecución y Outreach
- Identificar 20 empresas target
- Aplicaciones personalizadas
- Networking directo

## MÉTRICAS DE ÉXITO
- Día 30: Al menos 3 entrevistas programadas con empresas Tier A/B
- Día 45: Al menos 1 oferta de PM Mid-level
- Incremento de tasa de conversión de screening: 20% → 40%

---
**Documento completado:** Día 1 Escaneo de Visión
**Estado:** Listo para Validación DTC`

/**
 * Document content for Day 2 - Evidence fragments
 */
export const TRAVIS_DAY2_UPLOAD_FRAGMENTS = `# EVIDENCIA CONSOLIDADA - DÍA 2

## FRAGMENTO 1: FEATURE ONBOARDING
Reduje el churn de nuevos usuarios un 23% mediante redesign de onboarding flow. Identifiqué que 45% abandonaban antes de activación clave (crear primer proyecto). Ejecuté:
- User research con 12 nuevos usuarios
- Rediseño del flow (5 pasos → 3 pasos)
- Implementación y A/B testing
- Resultado: 23% reducción churn, +1.2K usuarios retenidos, +$50K revenue

## FRAGMENTO 2: ROADMAP ESTRATÉGICO Q3
Presenté roadmap Q3 al CEO priorizando 8 features según investigación con 50+ clientes. Metodología:
- User interviews con 50 clientes
- Analysis de usage data
- Competitive analysis
- Propuesta de 3 escenarios con trade-offs
- Selección: opción media (impacto/esfuerzo)
- Resultado: Q3 fue nuestro mejor quarter, +$80K revenue

## FRAGMENTO 3: USER RESEARCH Q4
Condujo 15 entrevistas profundas con clientes Enterprise que casi churn. Descubrí: necesitaban "admin dashboard" que no estaba en roadmap.
- Cambié priorización de roadmap
- Sugerimos solución alternativa temporal
- Frenamos churn: -8% tasa de attrición Q4
- Iniciamos proyecto de admin dashboard

## FRAGMENTO 4: API INTEGRATION STRATEGY
Diseñé estrategia de integraciones API que habilitó ecosystem partners. Logros:
- 8 integraciones con partners key (Zapier, Make, Integromat)
- $40K MRR incremental de revenue de partners
- 20% de nueve revenue viene de through-partners

## FRAGMENTO 5: PRICING OPTIMIZATION
Análisis de elasticidad de precio mostró oportunidad de precio premium. Encontré que:
- Clientes Enterprise pagaban 5x más sin quejarse
- Creé tier "Professional" nuevo con pricing +40%
- Implementación sin churn
- Resultado: +$30K MRR adicional sin nuevos usuarios

## FRAGMENTO 6: GTM DE FEATURE
Lancé "Analytics Dashboard" con GTM coordinado: 
- Sales enablement
- In-app messaging
- Customer education webinar
- Sales call campaign a top 50 customers
- Resultado: 35% adoption en 2 semanas, $25K ARR nuevo

## FRAGMENTO 7: ROADMAP TRANSPARENCY
Implementé sistema de "transparent roadmap" para comunicar a clientes qué estamos construyendo y por qué:
- Publicamos roadmap cada quarter
- Explicamos reasoning
- Abiertos a feedback
- Resultado: NPS +12 puntos, reducción de "feature requests" repetidas

## FRAGMENTO 8: RETENTION STRATEGY
Identifiqué que 60% de churn ocurría en meses 4-6 de relación. Diseñé programa "Success Sprint":
- Check-ins estructurados
- Taller de "best practices"
- Customización de setup
- Resultado: churn M4-6 bajó de 8% a 2%

---
Documentación completada. Todos los fragmentos validados y certificados.`

/**
 * Get upload document content for any day
 */
export function getTravisUploadContent(dayNumber: number): string {
  const uploadContentMap: Record<number, string> = {
    1: TRAVIS_DAY1_UPLOAD_DOCUMENT,
    2: TRAVIS_DAY2_UPLOAD_FRAGMENTS,
  }

  // For days 3-90, return realistic day-specific content
  return uploadContentMap[dayNumber] || generateGenericDayContent(dayNumber)
}

/**
 * Generate content for days that don't have specific upload data
 */
function generateGenericDayContent(dayNumber: number): string {
  const phase = Math.ceil(dayNumber / 11.25) // 8 phases
  const phaseNames = [
    'Construcción de Identidad',
    'Consolidación de Evidencia',
    'Actualización de Presencia',
    'Preparación de Entrevistas',
    'Ejecución y Networking',
    'Negociación y Cierre',
    'Onboarding y Transition',
    'Consolidación y Crecimiento',
  ]

  return `# PROGRESO - DÍA ${dayNumber}

## Fase: ${phaseNames[Math.max(0, phase - 1)]}

En este día de mi ruta, he avanzado en la construcción de mi candidatura PM. 

### Lo que completé hoy:
- Revisión y validación de material preparado
- Seguimiento a aplicaciones enviadas
- Prep para entrevistas programadas
- Refinamiento de narrativa profesional

### Logros acumulados hasta día ${dayNumber}:
- ${Math.floor(dayNumber / 10)} semanas de ejecución consistente
- ~${Math.floor(dayNumber * 2)} horas de inversión personal
- ${Math.floor(dayNumber / 3)} contactos nuevos en el network
- Progreso: ${Math.round((dayNumber / 90) * 100)}% del programa

### Enfoque para próximos días:
Continuar con disciplina en los hitos semanales mientras mantengo mi rol actual. El cambio es gradual pero consistente.

---
**Documento auto-completado para continuidad de narrativa**
**Día: ${dayNumber} de 90**`
}
