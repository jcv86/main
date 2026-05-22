'use client'

import { createClient } from '@/lib/supabase/client'
import { createDocument } from '@/lib/supabase/dtc-documents'
import { isTravisMode } from './travis-form-data'

/**
 * Travis Dev Mode - Complete Supabase Data Seeding
 * This seeds all required documents and tables for comfortable testing across all 90 days
 */

// Travis user ID for dev mode
export const TRAVIS_USER_ID = 'travis-dev-user-001'

// ═══════════════════════════════════════════════════════════════════════════
// DAY 3 - Market Signals Data
// ═══════════════════════════════════════════════════════════════════════════

export const TRAVIS_MARKET_SIGNALS = [
  {
    day_number: 3,
    job_title: 'Product Manager - Growth',
    company_name: 'EdTech Startup',
    job_url: 'https://example.com/job1',
    requirements: ['3+ years PM experience', 'B2B SaaS background', 'Data-driven approach', 'Agile methodology'],
    fears_skills: ['Enterprise sales experience', 'MBA preferred'],
    strengths_needed: ['User research', 'Roadmap planning', 'Cross-functional leadership'],
    salary_range: '$80K-110K',
    location: 'Remote',
    industry: 'EdTech',
  },
  {
    day_number: 3,
    job_title: 'Senior Product Manager',
    company_name: 'B2B SaaS Scale-up',
    job_url: 'https://example.com/job2',
    requirements: ['5+ years product experience', 'Technical background', 'Pricing strategy', 'GTM experience'],
    fears_skills: ['P&L responsibility', 'Team management'],
    strengths_needed: ['Strategic thinking', 'Stakeholder management', 'Metrics-driven'],
    salary_range: '$100K-140K',
    location: 'Hybrid',
    industry: 'SaaS',
  },
  {
    day_number: 3,
    job_title: 'Product Manager - Platform',
    company_name: 'MarTech Company',
    job_url: 'https://example.com/job3',
    requirements: ['API experience', 'Developer tools', 'Integration strategy', 'Technical writing'],
    fears_skills: ['Engineering management', 'System architecture'],
    strengths_needed: ['Technical communication', 'Partner relationships', 'Documentation'],
    salary_range: '$90K-120K',
    location: 'Remote',
    industry: 'MarTech',
  },
]

export const TRAVIS_EXTRACTED_SIGNALS = [
  { day_number: 3, signal_type: 'skill' as const, signal_text: 'Data Analysis', frequency: 8, importance: 9, related_jobs_count: 3, category: 'Technical' },
  { day_number: 3, signal_type: 'skill' as const, signal_text: 'User Research', frequency: 7, importance: 8, related_jobs_count: 3, category: 'Discovery' },
  { day_number: 3, signal_type: 'tool' as const, signal_text: 'Jira/Asana', frequency: 9, importance: 7, related_jobs_count: 3, category: 'Tools' },
  { day_number: 3, signal_type: 'soft_skill' as const, signal_text: 'Cross-functional Leadership', frequency: 6, importance: 9, related_jobs_count: 3, category: 'Leadership' },
  { day_number: 3, signal_type: 'framework' as const, signal_text: 'Agile/Scrum', frequency: 8, importance: 8, related_jobs_count: 3, category: 'Methodology' },
]

// ═══════════════════════════════════════════════════════════════════════════
// DAY 4 - Candidate Board Data
// ═══════════════════════════════════════════════════════════════════════════

export const TRAVIS_CANDIDATE_BOARD = {
  day_number: 4,
  column_1_quien_soy: `Soy un Analista de Producto con 18 meses actuando como PM sin el título. 
He liderado 5 features con impacto de +$200K en revenue.
Mi fortaleza es traducir datos en decisiones de producto.
Busco transicionar a PM Mid-level en B2B SaaS.`,
  column_2_que_quiere: `El mercado pide: Data Analysis, User Research, Cross-functional Leadership.
Tools: Jira, Amplitude, Figma, SQL.
Soft skills: Comunicación con stakeholders, priorización estratégica.
Salarios: $80K-140K para PM Mid/Senior en B2B SaaS.`,
  column_3_que_prueba: `5 features lanzadas con métricas documentadas.
Reducción de churn 23% mediante redesign de onboarding.
Roadmap Q3 generó +$80K en revenue nueva.
15 entrevistas de usuario que cambiaron priorización.
API strategy que habilitó $40K MRR de partners.`,
  column_4_que_falta: `Gap 1: No tengo título formal de PM (solo Analyst).
Gap 2: CV no refleja responsabilidades reales.
Gap 3: LinkedIn desactualizado, sin posts de thought leadership.
Gap 4: Falta portfolio visual de case studies.`,
  candidate_hypothesis: `Si actualizo mi posicionamiento de "Analyst que hace PM" a "PM con 18 meses de experiencia práctica y $200K+ en impacto documentado", entonces podré acceder a roles PM Mid-level con incremento salarial de 30-50%.`,
  candidate_archetype: 'The Proven Executor',
  status: 'completed' as const,
}

// ═══════════════════════════════════════════════════════════════════════════
// DAY 5 - Test Introduction Data
// ═══════════════════════════════════════════════════════════════════════════

export const TRAVIS_TEST_INTRODUCTION = {
  day_number: 5,
  version_a: `Hola! Soy Travis, Product Manager con experiencia en B2B SaaS. He liderado features que generaron más de $200K en revenue. Me apasiona usar datos para tomar decisiones de producto que impacten usuarios reales.`,
  version_b: `Soy Travis, PM especializado en EdTech y SaaS. En los últimos 18 meses, reduje churn 23%, diseñé roadmaps que generaron $80K en revenue nueva, y construí integraciones API que habilitaron $40K MRR de partners. Busco mi siguiente reto en una empresa que valore la ejecución basada en evidencia.`,
  version_c: `Como Product Manager en B2B SaaS, mi enfoque es simple: entender profundamente al usuario, medir todo lo que importa, y ejecutar con precisión. En mi rol actual, transformé insights de 50+ entrevistas en features que aumentaron retention 23% y generaron $200K+ en impacto directo. Estoy listo para llevar este mismo rigor a un equipo que esté construyendo algo significativo.`,
  test_type: 'linkedin_post',
  test_feedback: 'La versión C resonó mejor - específica, con números, y con call-to-action claro.',
  status: 'completed' as const,
}

// ═══════════════════════════════════════════════════════════════════════════
// DAY 6+ - Additional Day Data
// ═══════════════════════════════════════════════════════════════════════════

export const TRAVIS_DAY6_DATA = {
  day_number: 6,
  weekly_reflection: `Esta semana consolidé mi visión, extraje señales del mercado, y construí mi tablero de candidato. 
El insight más valioso: el mercado quiere exactamente lo que ya hago, solo necesito comunicarlo mejor.
Para la próxima semana: refinar mi pitch y comenzar outreach.`,
  wins: ['Completé tablero de candidato', 'Identifiqué 3 empresas target', 'Mejoré mi intro profesional'],
  challenges: ['CV todavía no refleja todo', 'Necesito más práctica con pitch verbal'],
  next_week_focus: 'Networking activo y aplicaciones estratégicas',
}

// Days 7+ Candidate Board updates
export const TRAVIS_DAY9_TASKS = {
  day_number: 9,
  column_1_quien_soy: `Lideré redesign de onboarding que redujo churn 23% en 3 meses.
Coordiné equipo de 4 personas para lanzar feature de analytics en deadline.
Implementé framework de priorización que alineó roadmap con objetivos de revenue.
Presenté business case al CEO que resultó en aprobación de $50K budget.
Diseñé sistema de feedback loops que mejoró NPS en 12 puntos.`,
}

// ═══════════════════════════════════════════════════════════════════════════
// NEW: DTC DOCUMENTS SEEDING
// ═══════════════════════════════════════════════════════════════════════════

export async function seedTravisDocuments(userId: string) {
  if (!isTravisMode()) return { success: false, reason: 'Not Travis mode' }

  console.log('[Travis] Seeding DTC documents for user:', userId)

  try {
    // Day 1 - Route Contract
    await createDocument(userId, {
      title: 'Mi Contrato de Ruta - DTC 2026',
      type: 'route_contract',
      source_module: 'a2_day_1',
      related_day: 1,
      content: `# Mi Contrato de Ruta

## Quién Soy
Soy Travis, PM con 18 meses de experiencia práctica en B2B SaaS.

## Qué Quiero
Quiero posicionarme como PM Mid-level con evidencia clara de impacto.

## Mis Valores
- Decisiones basadas en datos
- Ejecución rigurosa
- Impacto medible

## Mi Promesa
Completaré este programa con portfolio documentado que demuestre mi valor en el mercado.`,
      status: 'approved',
      source: 'travis_seed',
      tags: ['foundation', 'contract'],
    })

    // Day 2 - Evidence Vault
    await createDocument(userId, {
      title: 'Mi Bóveda de Evidencia - DTC Workspace',
      type: 'evidence_vault',
      source_module: 'a2_day_2',
      related_day: 2,
      content: `Bóveda de evidencia creada en Notion con estructura completa:
- Logros y Métricas (5 entries)
- Testimonios (3 entries)
- Certificaciones (2 entries)
- Screenshots de Resultados
- Documentos de Soporte`,
      status: 'approved',
      source: 'travis_seed',
      tags: ['vault', 'evidence'],
    })

    // Day 3 - Market Signals Document
    await createDocument(userId, {
      title: 'Análisis de Señales del Mercado - Day 3',
      type: 'market_signal',
      source_module: 'a2_day_3',
      related_day: 3,
      content: `Señales del mercado identificadas:
1. Data Analysis - Frequency: 8/10, Importance: 9/10
2. User Research - Frequency: 7/10, Importance: 8/10
3. Jira/Asana - Frequency: 9/10, Importance: 7/10
4. Cross-functional Leadership - Frequency: 6/10, Importance: 9/10
5. Agile/Scrum - Frequency: 8/10, Importance: 8/10

Target roles: PM Mid-level en B2B SaaS ($80K-140K)
Industries: EdTech, MarTech, SaaS`,
      status: 'approved',
      source: 'travis_seed',
      tags: ['market', 'signals', 'day3'],
    })

    // Day 4 - Candidate Board
    await createDocument(userId, {
      title: 'Mi Tablero de Candidato - Day 4',
      type: 'candidate_board',
      source_module: 'a2_day_4',
      related_day: 4,
      content: `## Quién Soy
Soy un Analista de Producto con 18 meses actuando como PM sin el título. He liderado 5 features con impacto de +$200K en revenue.

## Qué Quiere el Mercado
El mercado pide: Data Analysis, User Research, Cross-functional Leadership.
Tools: Jira, Amplitude, Figma, SQL.
Salarios: $80K-140K para PM Mid/Senior en B2B SaaS.

## Qué Puedo Probar
- 5 features lanzadas con métricas documentadas
- Reducción de churn 23% mediante redesign de onboarding
- Roadmap Q3 generó +$80K en revenue nueva
- 15 entrevistas de usuario que cambiaron priorización
- API strategy que habilitó $40K MRR de partners

## Mi Hipótesis
Si actualizo mi posicionamiento de "Analyst que hace PM" a "PM con 18 meses de experiencia práctica y $200K+ en impacto documentado", entonces podré acceder a roles PM Mid-level.`,
      status: 'approved',
      source: 'travis_seed',
      tags: ['board', 'candidato', 'day4'],
    })

    // Day 5 - Test Introduction
    await createDocument(userId, {
      title: 'Mis Versiones de Introducción - Day 5',
      type: 'test_introduction',
      source_module: 'a2_day_5',
      related_day: 5,
      content: `## Versión A (Simple)
Hola! Soy Travis, Product Manager con experiencia en B2B SaaS. He liderado features que generaron más de $200K en revenue. Me apasiona usar datos para tomar decisiones de producto que impacten usuarios reales.

## Versión B (Narrative)
Soy Travis, PM especializado en EdTech y SaaS. En los últimos 18 meses, reduje churn 23%, diseñé roadmaps que generaron $80K en revenue nueva, y construí integraciones API que habilitaron $40K MRR de partners.

## Versión C (Strategic)
Como Product Manager en B2B SaaS, mi enfoque es simple: entender profundamente al usuario, medir todo lo que importa, y ejecutar con precisión. En mi rol actual, transformé insights de 50+ entrevistas en features que aumentaron retention 23% y generaron $200K+ en impacto directo.

## Mejor Versión
La versión C resonó mejor - específica, con números, y con call-to-action claro.`,
      status: 'approved',
      source: 'travis_seed',
      tags: ['introduction', 'test', 'day5'],
    })

    console.log('[Travis] DTC documents seeded successfully')
    return { success: true }
  } catch (error) {
    console.error('[Travis] Error seeding DTC documents:', error)
    return { success: false, error }
  }
}



export async function seedTravisMarketSignals(userId: string) {
  const supabase = createClient()
  
  // Check if already seeded
  const { data: existing } = await supabase
    .from('a2_market_signals')
    .select('id')
    .eq('user_id', userId)
    .eq('day_number', 3)
    .limit(1)
  
  if (existing && existing.length > 0) {
    console.log('[Travis] Market signals already seeded')
    return { success: true, skipped: true }
  }

  const { error } = await supabase
    .from('a2_market_signals')
    .insert(TRAVIS_MARKET_SIGNALS.map(signal => ({ ...signal, user_id: userId })))

  if (error) {
    console.error('[Travis] Error seeding market signals:', error)
    return { success: false, error }
  }

  console.log('[Travis] Market signals seeded successfully')
  return { success: true }
}

export async function seedTravisExtractedSignals(userId: string) {
  const supabase = createClient()
  
  const { data: existing } = await supabase
    .from('a2_extracted_signals')
    .select('id')
    .eq('user_id', userId)
    .eq('day_number', 3)
    .limit(1)
  
  if (existing && existing.length > 0) {
    console.log('[Travis] Extracted signals already seeded')
    return { success: true, skipped: true }
  }

  const { error } = await supabase
    .from('a2_extracted_signals')
    .insert(TRAVIS_EXTRACTED_SIGNALS.map(signal => ({ ...signal, user_id: userId })))

  if (error) {
    console.error('[Travis] Error seeding extracted signals:', error)
    return { success: false, error }
  }

  console.log('[Travis] Extracted signals seeded successfully')
  return { success: true }
}

export async function seedTravisCandidateBoard(userId: string) {
  const supabase = createClient()
  
  const { data: existing } = await supabase
    .from('a2_candidate_boards')
    .select('id')
    .eq('user_id', userId)
    .eq('day_number', 4)
    .limit(1)
  
  if (existing && existing.length > 0) {
    console.log('[Travis] Candidate board already seeded')
    return { success: true, skipped: true }
  }

  const { error } = await supabase
    .from('a2_candidate_boards')
    .insert({ ...TRAVIS_CANDIDATE_BOARD, user_id: userId })

  if (error) {
    console.error('[Travis] Error seeding candidate board:', error)
    return { success: false, error }
  }

  console.log('[Travis] Candidate board seeded successfully')
  return { success: true }
}

export async function seedTravisTestIntroduction(userId: string) {
  const supabase = createClient()
  
  const { data: existing } = await supabase
    .from('a2_test_introductions')
    .select('id')
    .eq('user_id', userId)
    .eq('day_number', 5)
    .limit(1)
  
  if (existing && existing.length > 0) {
    console.log('[Travis] Test introduction already seeded')
    return { success: true, skipped: true }
  }

  const { error } = await supabase
    .from('a2_test_introductions')
    .insert({ ...TRAVIS_TEST_INTRODUCTION, user_id: userId })

  if (error) {
    console.error('[Travis] Error seeding test introduction:', error)
    return { success: false, error }
  }

  console.log('[Travis] Test introduction seeded successfully')
  return { success: true }
}

export async function seedTravisDay9Tasks(userId: string) {
  const supabase = createClient()
  
  // Seed Day 9 data into candidate boards (used by Day 10)
  const { data: existing } = await supabase
    .from('a2_candidate_boards')
    .select('id')
    .eq('user_id', userId)
    .eq('day_number', 9)
    .limit(1)
  
  if (existing && existing.length > 0) {
    console.log('[Travis] Day 9 tasks already seeded')
    return { success: true, skipped: true }
  }

  const { error } = await supabase
    .from('a2_candidate_boards')
    .insert({ 
      ...TRAVIS_DAY9_TASKS, 
      user_id: userId,
      column_2_que_quiere: '',
      column_3_que_prueba: '',
      column_4_que_falta: '',
      candidate_hypothesis: '',
      status: 'completed',
    })

  if (error) {
    console.error('[Travis] Error seeding Day 9 tasks:', error)
    return { success: false, error }
  }

  console.log('[Travis] Day 9 tasks seeded successfully')
  return { success: true }
}

// ═══════════════════════════════════════════════════════════════════════════
// MASTER SEED FUNCTION
// ═══════════════════════════════════════════════════════════════════════════

export async function seedAllTravisData(userId: string) {
  if (!isTravisMode()) {
    console.log('[Travis] Not in Travis mode, skipping seed')
    return { success: false, reason: 'Not in Travis mode' }
  }

  console.log('[Travis] Starting full data seed for user:', userId)

  const results = {
    marketSignals: await seedTravisMarketSignals(userId),
    extractedSignals: await seedTravisExtractedSignals(userId),
    candidateBoard: await seedTravisCandidateBoard(userId),
    testIntroduction: await seedTravisTestIntroduction(userId),
    day9Tasks: await seedTravisDay9Tasks(userId),
  }

  const allSuccess = Object.values(results).every(r => r.success)
  console.log('[Travis] Seed complete. All success:', allSuccess)

  return { success: allSuccess, results }
}

// ═══════════════════════════════════════════════════════════════════════════
// AUTO-SEED ON PAGE LOAD (for specific days)
// ═══════════════════════════════════════════════════════════════════════════

export async function ensureTravisDataForDay(userId: string, dayNumber: number) {
  if (!isTravisMode()) return { success: true, reason: 'Not Travis mode' }

  console.log(`[Travis] Ensuring data for Day ${dayNumber}`)

  try {
    // Seed DTC documents first
    await seedTravisDocuments(userId)

    // Then seed specific table data based on day
    if (dayNumber >= 3) {
      await seedTravisMarketSignals(userId)
      await seedTravisExtractedSignals(userId)
    }
    if (dayNumber >= 4) {
      await seedTravisCandidateBoard(userId)
    }
    if (dayNumber >= 5) {
      await seedTravisTestIntroduction(userId)
    }
    if (dayNumber >= 10) {
      await seedTravisDay9Tasks(userId)
    }

    return { success: true }
  } catch (error) {
    console.error(`[Travis] Error ensuring data for Day ${dayNumber}:`, error)
    return { success: false, error }
  }
}

