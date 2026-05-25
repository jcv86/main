/**
 * Travis Dev Account - Comprehensive Mockup Data Seeder
 * 
 * Creates realistic, interconnected data across all 4 pillars:
 * - A1: Identity & Self-Discovery (DISC, Cerebral, Emotional Intelligence)
 * - A2: Professional Development (Routes, Missions, Sprints)
 * - A3: Interview Training (Sessions, Feedback, Progress)
 * - A4: Strategic Knowledge (Documents, Insights reflecting A1-A3)
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials')
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Travis Dev Account - Real UUID from Supabase Auth
const TRAVIS_USER_ID = '64738eef-ee31-4da9-8270-9adfa46c74ba'
const TRAVIS_EMAIL = 'travis@nuanu.com'

// =============================================================================
// A1 - IDENTITY & SELF-DISCOVERY DATA
// =============================================================================

const a1ProfileInsights = {
  id: crypto.randomUUID(),
  user_id: TRAVIS_USER_ID,
  patron_dominante: 'D-I',
  patron_secundario: 'Influyente',
  fortalezas_principales: 'Liderazgo natural, comunicacion persuasiva, orientacion a resultados, pensamiento estrategico, capacidad de influir positivamente en equipos',
  areas_desarrollo: 'Paciencia en procesos largos, escucha activa, atencion al detalle en tareas rutinarias',
  comunicacion_efectiva: 'Estilo directo y energico. Prefiere comunicacion clara y orientada a soluciones. Motiva a traves del entusiasmo y vision compartida.',
  dinamica_equipo: 'Lidera naturalmente, genera energia positiva. Mejor en roles de direccion o innovacion que en roles de soporte.',
  gestion_conflicto: 'Aborda conflictos de frente. Busca soluciones rapidas y practicas. Puede beneficiarse de mayor diplomacia.',
  estilo_entrevista: 'Presenta con confianza y entusiasmo. Destaca logros con datos concretos. Conecta facilmente con entrevistadores.',
  carrera_align: 'Roles de liderazgo, gestion de proyectos, desarrollo de negocios, consultoria estrategica, emprendimiento',
  proxi_paso: 'Buscar posiciones de Director o VP donde pueda liderar equipos y definir estrategia',
  ritual_profile: {
    tipo_disco: 'D-I',
    score_total: 87,
    fortalezas: ['Liderazgo', 'Comunicacion', 'Vision estrategica', 'Orientacion a resultados'],
    areas_mejora: ['Paciencia', 'Detalle', 'Escucha activa']
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}

const a1TestsResults = [
  {
    id: crypto.randomUUID(),
    user_id: TRAVIS_USER_ID,
    test_type: 'cerebral',
    test_name: 'Evaluacion Cerebral DTC',
    profile_type: 'D-I',
    score: 87,
    resultado_texto: 'Perfil Dominante-Influyente con alta capacidad de liderazgo y comunicacion',
    responses: {
      total_questions: 40,
      dominant_traits: ['leadership', 'communication', 'results-oriented'],
      d_score: 85,
      i_score: 78,
      s_score: 45,
      c_score: 52
    },
    completed_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: crypto.randomUUID(),
    user_id: TRAVIS_USER_ID,
    test_type: 'inteligencia_emocional',
    test_name: 'Inteligencia Emocional',
    profile_type: 'Alto',
    score: 82,
    resultado_texto: 'Alta inteligencia emocional con fortalezas en autoconciencia y habilidades sociales',
    responses: {
      autoconciencia: 85,
      autorregulacion: 78,
      motivacion: 88,
      empatia: 75,
      habilidades_sociales: 84
    },
    completed_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: crypto.randomUUID(),
    user_id: TRAVIS_USER_ID,
    test_type: 'competencias',
    test_name: 'Evaluacion de Competencias',
    profile_type: 'Estrategico',
    score: 84,
    resultado_texto: 'Perfil estrategico con fuertes competencias en liderazgo y gestion',
    responses: {
      liderazgo: 90,
      comunicacion: 85,
      trabajo_equipo: 80,
      resolucion_problemas: 88,
      adaptabilidad: 82,
      orientacion_resultados: 92
    },
    completed_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  }
]

const a1Progress = {
  id: crypto.randomUUID(),
  user_id: TRAVIS_USER_ID,
  cerebral_completed: true,
  inteligencia_emocional_completed: true,
  mapa_personalidad_completed: true,
  cinco_dimensiones_completed: true,
  competencias_completed: true,
  brujula_vocacional_completed: true,
  tests_completed: 6,
  unified_profile: {
    perfil_disco: 'D-I',
    fortalezas: ['Liderazgo', 'Comunicacion', 'Vision estrategica'],
    areas_desarrollo: ['Paciencia', 'Detalle'],
    ie_score: 82,
    competencias_top: ['liderazgo', 'orientacion_resultados', 'resolucion_problemas']
  },
  last_updated: new Date().toISOString(),
  created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
}

// =============================================================================
// A2 - PROFESSIONAL DEVELOPMENT DATA
// =============================================================================

const a2UserRouteProgress = {
  id: crypto.randomUUID(),
  user_id: TRAVIS_USER_ID,
  route_id: null, // Will be set to first available route
  estado: 'activo',
  dia_actual: 45,
  porcentaje_completado: 50,
  fecha_inicio: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  capacidad_promedio: 7.5,
  created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  updated_at: new Date().toISOString()
}

const a2Day1Submission = {
  id: crypto.randomUUID(),
  user_id: TRAVIS_USER_ID,
  vision_role: 'Director de Producto en una empresa tech de alto crecimiento, liderando equipos multidisciplinarios y definiendo estrategia de producto',
  vision_environment: 'Startup o scale-up con cultura de innovacion, equipos autonomos, y enfoque en impacto medible',
  vision_desired_outcome: 'Liderar el lanzamiento de productos que impacten a millones de usuarios, desarrollar equipos de alto rendimiento, y posicionarme como referente en product management',
  milestone_day10: 'Completar analisis de mercado y definir propuesta de valor diferenciada',
  milestone_day20: 'Establecer red de contactos clave y obtener 3 entrevistas informativas',
  milestone_day30: 'Aplicar a 5 posiciones objetivo y preparar pitch personal',
  action_plan: {
    semana_1: ['Actualizar CV', 'Optimizar LinkedIn', 'Identificar empresas target'],
    semana_2: ['Networking eventos', 'Entrevistas informativas', 'Preparar casos practicos'],
    semana_3: ['Aplicaciones dirigidas', 'Seguimiento contactos', 'Mock interviews'],
    semana_4: ['Entrevistas reales', 'Negociacion', 'Decision final']
  },
  current_step: 4,
  completed_steps: ['vision', 'milestones', 'action_plan', 'review'],
  analysis_status: 'completed',
  analysis_result: {
    clarity_score: 92,
    actionability_score: 88,
    alignment_score: 95,
    feedback: 'Vision clara y bien articulada. Plan de accion concreto y medible.'
  },
  pass_fail_status: 'passed',
  created_at: new Date(Date.now() - 44 * 24 * 60 * 60 * 1000).toISOString(),
  updated_at: new Date().toISOString(),
  completed_at: new Date(Date.now() - 43 * 24 * 60 * 60 * 1000).toISOString()
}

const a2UserMission = {
  id: crypto.randomUUID(),
  user_id: TRAVIS_USER_ID,
  objetivo_especifico: 'Transicionar a rol de Director de Producto en empresa tech en 90 dias',
  camino: 'profesional',
  metrica_exito: 'Obtener oferta de trabajo como Director de Producto con salario >$150k',
  restricciones_contexto: 'Actualmente empleado, debe mantener discrecion. Disponibilidad limitada entre semana.',
  estado: 'activo',
  progreso_porcentaje: 50,
  fecha_inicio: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  fecha_fin_planeada: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
  created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  updated_at: new Date().toISOString()
}

// =============================================================================
// A3 - INTERVIEW TRAINING DATA
// =============================================================================

const a3UserProgress = {
  id: crypto.randomUUID(),
  user_id: TRAVIS_USER_ID,
  current_module: 'module-7',
  completed_module_ids: ['module-1', 'module-2', 'module-3', 'module-4', 'module-5', 'module-6'],
  module_states: {
    'module-1': { completed: true, score: 92, attempts: 1 },
    'module-2': { completed: true, score: 88, attempts: 1 },
    'module-3': { completed: true, score: 85, attempts: 2 },
    'module-4': { completed: true, score: 90, attempts: 1 },
    'module-5': { completed: true, score: 87, attempts: 1 },
    'module-6': { completed: true, score: 91, attempts: 1 },
    'module-7': { completed: false, score: 0, attempts: 0 }
  },
  total_xp: 2450,
  created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  updated_at: new Date().toISOString()
}

const a3SessionAttempts = [
  {
    id: crypto.randomUUID(),
    user_id: TRAVIS_USER_ID,
    module_id: 'module-6',
    module_number: 6,
    session_type: 'practice',
    lead_character: 'mentor',
    difficulty: 'intermediate',
    status: 'completed',
    progress: 100,
    score: 91,
    feedback: 'Excelente manejo de preguntas conductuales. Tu metodo STAR es solido. Trabaja en concision.',
    transcript: {
      messages: [
        { role: 'interviewer', content: 'Cuentame sobre un momento donde lideraste un cambio significativo.' },
        { role: 'user', content: 'En mi rol anterior, lidere la transformacion digital del equipo de producto...' }
      ]
    },
    session_started_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    session_completed_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    duration_seconds: 1800,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  }
]

const a3RouteProgression = {
  id: crypto.randomUUID(),
  user_id: TRAVIS_USER_ID,
  route_level: 'advanced',
  current_module_number: 7,
  total_completed: 6,
  unlocked_up_to_level: 3,
  solid_executions_at_level: 4,
  failed_attempts_at_level: 0,
  abandoned_attempts_at_level: 0,
  frustration_signals_at_level: 0,
  bonus_1_unlocked_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  can_replay_modules_7_10: true,
  created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  last_level_change: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
}

// =============================================================================
// A4 - STRATEGIC DOCUMENTS (Reflecting A1, A2, A3 insights)
// =============================================================================

const a4Documents = [
  {
    id: crypto.randomUUID(),
    user_id: TRAVIS_USER_ID,
    title: 'Perfil Profesional Integrado - Travis Dea',
    type: 'profile_summary',
    source_module: 'a1_integration',
    status: 'published',
    version: 1,
    content: `# Perfil Profesional Integrado

## Resumen Ejecutivo
Travis Dea es un profesional con perfil D-I (Dominante-Influyente) caracterizado por su capacidad de liderazgo natural, comunicacion persuasiva y orientacion a resultados. Con un score de inteligencia emocional de 82/100, demuestra alta autoconciencia y habilidades sociales.

## Fortalezas Clave (Basado en A1)
- **Liderazgo Natural**: Score 90/100 en evaluacion de competencias
- **Comunicacion Efectiva**: Estilo directo y energico que motiva equipos
- **Vision Estrategica**: Capacidad de definir direccion y alinear stakeholders
- **Orientacion a Resultados**: Score 92/100, enfocado en impacto medible

## Areas de Desarrollo
- Paciencia en procesos largos
- Atencion al detalle en tareas rutinarias
- Escucha activa mejorada

## Compatibilidad de Roles
Ideal para: Director de Producto, VP de Operaciones, Consultoria Estrategica, Emprendimiento

## Insights de Inteligencia Emocional
- Autoconciencia: 85% - Alta capacidad de reconocer emociones propias
- Autorregulacion: 78% - Buena gestion emocional, puede mejorar en situaciones de alta presion
- Motivacion: 88% - Altamente motivado por logros y reconocimiento
- Empatia: 75% - Oportunidad de desarrollo en perspectiva del otro
- Habilidades Sociales: 84% - Excelente para networking y relaciones profesionales`,
    ai_summary: 'Perfil de liderazgo D-I con fortalezas en comunicacion y resultados. IE alto (82). Ideal para roles directivos en tech.',
    source: 'system',
    tags: ['perfil', 'a1', 'liderazgo', 'inteligencia-emocional'],
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: crypto.randomUUID(),
    user_id: TRAVIS_USER_ID,
    title: 'Plan de Carrera 90 Dias - Director de Producto',
    type: 'career_plan',
    source_module: 'a2_integration',
    status: 'published',
    version: 1,
    content: `# Plan de Carrera 90 Dias

## Vision (Basado en A2 Day 1)
**Objetivo**: Director de Producto en empresa tech de alto crecimiento
**Timeline**: 90 dias desde inicio
**Metrica de Exito**: Oferta >$150k

## Progreso Actual: 50% (Dia 45 de 90)

### Fase 1: Fundamentos (Dias 1-30) - COMPLETADA
- [x] Analisis de perfil con tests A1
- [x] Definicion de vision y milestones
- [x] Optimizacion de CV y LinkedIn
- [x] Identificacion de 20 empresas target
- [x] Inicio de networking estrategico

### Fase 2: Ejecucion (Dias 31-60) - EN PROGRESO
- [x] 8 entrevistas informativas completadas
- [x] 12 aplicaciones enviadas
- [ ] 5 procesos activos en curso
- [ ] Preparacion para entrevistas finales

### Fase 3: Cierre (Dias 61-90) - PENDIENTE
- [ ] Entrevistas finales
- [ ] Negociacion de ofertas
- [ ] Decision y aceptacion

## Conexion con Preparacion A3
- Modulos 1-6 completados (score promedio: 89%)
- Metodo STAR dominado
- Casos de liderazgo preparados
- Mock interviews con feedback positivo`,
    ai_summary: 'Plan de 90 dias para transicion a Director de Producto. 50% completado. Tracking positivo con 8 entrevistas informativas y 12 aplicaciones.',
    source: 'system',
    tags: ['plan-carrera', 'a2', 'director-producto', 'progreso'],
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: crypto.randomUUID(),
    user_id: TRAVIS_USER_ID,
    title: 'Analisis de Preparacion para Entrevistas',
    type: 'interview_readiness',
    source_module: 'a3_integration',
    status: 'published',
    version: 1,
    content: `# Analisis de Preparacion para Entrevistas

## Estado de Preparacion: LISTO (Score General: 89%)

### Modulos Completados (6/10)
| Modulo | Nombre | Score | Estado |
|--------|--------|-------|--------|
| 1 | Fundamentos STAR | 92% | Completado |
| 2 | Preguntas Conductuales | 88% | Completado |
| 3 | Casos de Liderazgo | 85% | Completado |
| 4 | Negociacion | 90% | Completado |
| 5 | Preguntas Tecnicas | 87% | Completado |
| 6 | Simulacion Final | 91% | Completado |
| 7 | Nivel Avanzado | - | En Progreso |

### Fortalezas Identificadas (Conectado con A1)
Basado en tu perfil D-I y entrenamientos:
- **Presencia Ejecutiva**: Tu estilo de comunicacion directo y energico genera confianza
- **Storytelling**: Excelente uso del metodo STAR con ejemplos concretos
- **Conexion Rapida**: Habilidades sociales (84%) facilitan rapport con entrevistadores

### Areas de Mejora para Entrevistas
- Concision en respuestas (a veces muy extensas)
- Escucha activa antes de responder
- Balance entre confianza y humildad

### XP Acumulado: 2,450 puntos
Nivel: Avanzado

### Recomendacion
Estas listo para entrevistas de nivel Director. Enfocate en el modulo 7 para perfeccionar respuestas a preguntas de estrategia de producto.`,
    ai_summary: 'Preparacion de entrevistas al 89%. 6 modulos completados. Fortalezas en presencia ejecutiva y storytelling. Listo para entrevistas de nivel Director.',
    source: 'system',
    tags: ['entrevistas', 'a3', 'preparacion', 'star-method'],
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: crypto.randomUUID(),
    user_id: TRAVIS_USER_ID,
    title: 'Dashboard Ejecutivo - Transformacion Profesional',
    type: 'executive_dashboard',
    source_module: 'cross_pillar',
    status: 'published',
    version: 1,
    content: `# Dashboard Ejecutivo - Transformacion Profesional Travis Dea

## Resumen de Progreso Integral

### A1 - Identidad (100% Completado)
- Perfil: D-I (Dominante-Influyente)
- IE Score: 82/100
- Tests: 6/6 completados
- Insight Principal: Lider natural con alta capacidad de influencia

### A2 - Desarrollo Profesional (50% Completado)
- Dia Actual: 45 de 90
- Mision: Director de Producto Tech
- Aplicaciones: 12 enviadas
- Entrevistas Informativas: 8 completadas
- Procesos Activos: 5

### A3 - Entrenamiento (60% Completado)
- Modulos: 6/10 completados
- Score Promedio: 89%
- XP Total: 2,450
- Estado: Listo para entrevistas Director

### A4 - Conocimiento Estrategico
- Documentos Generados: 4
- Insights Activos: 12
- Score Estrategico: 85/100

## Conexiones Entre Pilares

### A1 → A2
Tu perfil D-I indica que prosperaras en roles de liderazgo. La mision de Director de Producto esta perfectamente alineada con tus fortalezas naturales.

### A1 → A3
Tu estilo de comunicacion directo y habilidades sociales (84%) son ventajas claras en entrevistas. El entrenamiento ha refinado estos talentos naturales.

### A2 → A3
La preparacion de casos reales de tu experiencia (A2) ha enriquecido tus respuestas en simulaciones (A3), logrando scores consistentemente >85%.

### A3 → A4
Los insights de tus entrenamientos alimentan recomendaciones estrategicas personalizadas para maximizar tu exito en el proceso de busqueda.

## Proximos Pasos Recomendados
1. Completar modulo 7 de A3 (entrevistas estrategicas)
2. Seguimiento a los 5 procesos activos de A2
3. Preparar casos especificos para empresas target
4. Revisar insights de mercado en A4`,
    ai_summary: 'Dashboard ejecutivo integrando los 4 pilares. A1: 100%, A2: 50%, A3: 60%. Perfil D-I alineado con objetivo de Director de Producto. Conexiones entre pilares optimizadas.',
    source: 'system',
    tags: ['dashboard', 'ejecutivo', 'cross-pillar', 'progreso-integral'],
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  }
]

const a4StrategicScore = {
  id: crypto.randomUUID(),
  user_id: TRAVIS_USER_ID,
  score: 85,
  score_7day_average: 82,
  last_updated_at: new Date().toISOString(),
  created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  updated_at: new Date().toISOString()
}

// =============================================================================
// DESPEGA USER PROFILE - Full access enabled
// =============================================================================

const despegaUserProfile = {
  id: crypto.randomUUID(),
  user_id: TRAVIS_USER_ID,
  onboarding_completed: true,
  onboarding_cerebral_completed: true,
  onboarding_conozcamonos_1_completed: true,
  a1_cerebral_intro_seen: true,
  a1_cerebral_completed: true,
  a1_test_completed: true,
  a1_report_seen: true,
  a1_results_saved: true,
  a2_intro_seen: true,
  a2_route_generated: true,
  a2_missions_started: true,
  conozcamonos_2_completed: true,
  a3_intro_seen: true,
  a3_intro_completed: true,
  a3_unlocked: true,
  a3_entrevista_0_completed: true,
  a3_training_started: true,
  a4_unlocked: true,
  camino_persona_active: true,
  camino_profesional_active: true,
  camino_foco: 'profesional',
  current_ciclo: 1,
  ciclo_start_date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  current_stage: 'a3_training',
  progress_percentage: 65,
  last_module_visited: 'a3-module-7',
  last_module_visited_at: new Date().toISOString(),
  created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  updated_at: new Date().toISOString()
}

// =============================================================================
// MAIN SEEDER FUNCTION
// =============================================================================

async function seedTravisData() {
  console.log('='.repeat(60))
  console.log('    TRAVIS DEV ACCOUNT - MOCKUP DATA SEEDER')
  console.log('='.repeat(60))
  console.log(`\nUser ID: ${TRAVIS_USER_ID}`)
  console.log(`Email: ${TRAVIS_EMAIL}\n`)

  try {
    // 1. Seed A1 Profile Insights
    console.log('1. Seeding A1 - Profile Insights...')
    const { error: a1InsightsError } = await supabase
      .from('a1_profile_insights')
      .upsert(a1ProfileInsights, { onConflict: 'user_id' })
    if (a1InsightsError) console.log('   Warning:', a1InsightsError.message)
    else console.log('   Done: A1 Profile Insights')

    // 2. Seed A1 Test Results
    console.log('2. Seeding A1 - Test Results...')
    for (const result of a1TestsResults) {
      const { error } = await supabase
        .from('a1_tests_results')
        .upsert(result)
      if (error) console.log(`   Warning (${result.test_type}):`, error.message)
    }
    console.log('   Done: A1 Test Results (3 tests)')

    // 3. Seed A1 Progress
    console.log('3. Seeding A1 - Progress...')
    const { error: a1ProgressError } = await supabase
      .from('a1_progress')
      .upsert(a1Progress, { onConflict: 'user_id' })
    if (a1ProgressError) console.log('   Warning:', a1ProgressError.message)
    else console.log('   Done: A1 Progress')

    // 4. Seed A2 Route Progress
    console.log('4. Seeding A2 - Route Progress...')
    const { error: a2RouteError } = await supabase
      .from('a2_user_route_progress')
      .upsert(a2UserRouteProgress)
    if (a2RouteError) console.log('   Warning:', a2RouteError.message)
    else console.log('   Done: A2 Route Progress')

    // 5. Seed A2 Day 1 Submission
    console.log('5. Seeding A2 - Day 1 Submission...')
    const { error: a2Day1Error } = await supabase
      .from('a2_day1_submissions')
      .upsert(a2Day1Submission)
    if (a2Day1Error) console.log('   Warning:', a2Day1Error.message)
    else console.log('   Done: A2 Day 1 Submission')

    // 6. Seed A2 Mission
    console.log('6. Seeding A2 - User Mission...')
    const { error: a2MissionError } = await supabase
      .from('a2_user_missions')
      .upsert(a2UserMission)
    if (a2MissionError) console.log('   Warning:', a2MissionError.message)
    else console.log('   Done: A2 User Mission')

    // 7. Seed A3 User Progress
    console.log('7. Seeding A3 - User Progress...')
    const { error: a3ProgressError } = await supabase
      .from('a3_user_progress')
      .upsert(a3UserProgress)
    if (a3ProgressError) console.log('   Warning:', a3ProgressError.message)
    else console.log('   Done: A3 User Progress')

    // 8. Seed A3 Session Attempts
    console.log('8. Seeding A3 - Session Attempts...')
    for (const session of a3SessionAttempts) {
      const { error } = await supabase
        .from('a3_session_attempts')
        .upsert(session)
      if (error) console.log('   Warning:', error.message)
    }
    console.log('   Done: A3 Session Attempts')

    // 9. Seed A3 Route Progression
    console.log('9. Seeding A3 - Route Progression...')
    const { error: a3RouteError } = await supabase
      .from('a3_route_progression')
      .upsert(a3RouteProgression)
    if (a3RouteError) console.log('   Warning:', a3RouteError.message)
    else console.log('   Done: A3 Route Progression')

    // 10. Seed A4 Documents
    console.log('10. Seeding A4 - Strategic Documents...')
    for (const doc of a4Documents) {
      const { error } = await supabase
        .from('a4_documents_extended')
        .upsert(doc)
      if (error) console.log(`   Warning (${doc.type}):`, error.message)
    }
    console.log('   Done: A4 Documents (4 docs)')

    // 11. Seed A4 Strategic Score
    console.log('11. Seeding A4 - Strategic Score...')
    const { error: a4ScoreError } = await supabase
      .from('a4_strategic_score')
      .upsert(a4StrategicScore)
    if (a4ScoreError) console.log('   Warning:', a4ScoreError.message)
    else console.log('   Done: A4 Strategic Score')

    // 12. Seed Despega User Profile
    console.log('12. Seeding Despega User Profile (Full Access)...')
    const { error: profileError } = await supabase
      .from('despega_user_profiles')
      .upsert(despegaUserProfile, { onConflict: 'user_id' })
    if (profileError) console.log('   Warning:', profileError.message)
    else console.log('   Done: Despega User Profile')

    console.log('\n' + '='.repeat(60))
    console.log('    SEEDING COMPLETE - TRAVIS HAS FULL ACCESS')
    console.log('='.repeat(60))
    console.log('\nTravis Dev Account Status:')
    console.log('  - A1 (Identity): 100% Complete')
    console.log('  - A2 (Development): 50% Complete (Day 45 of 90)')
    console.log('  - A3 (Interviews): 60% Complete (6/10 modules)')
    console.log('  - A4 (Strategic): 4 documents generated')
    console.log('  - All pillars UNLOCKED')
    console.log('  - Can navigate freely across all modules')
    console.log('\n')

  } catch (error) {
    console.error('FATAL ERROR:', error)
    process.exit(1)
  }
}

seedTravisData()
