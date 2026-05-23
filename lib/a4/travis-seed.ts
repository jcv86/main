/**
 * A4 Travis Dev Mode - Seed Data for Development
 * 
 * Seeds realistic document data when in Travis Dev Mode.
 * Never shows empty A4 in development - always has context.
 */

import { createClient } from '@/lib/supabase/client'
import type {
  DTCDocument,
  DTCDocumentType,
  DTCSourceModule,
  CreateDocumentPayload,
} from './types'
import { createDocument, relateDocuments } from './document-engine'
import { saveProfileSignals } from './document-intelligence'
import { createProfileSnapshot } from './profile-snapshot'

// ============================================
// TRAVIS MODE DETECTION
// ============================================

/**
 * Check if current session is in Travis Dev Mode
 */
export function isTravisMode(): boolean {
  if (typeof window === 'undefined') return false
  
  // Check for Travis mode indicators
  const isDemo = window.location.search.includes('demo=true')
  const isTravis = window.location.search.includes('travis=true')
  const hasTravisUser = localStorage.getItem('dtc_demo_user') !== null
  
  return isDemo || isTravis || hasTravisUser
}

// ============================================
// SEED DATA TEMPLATES
// ============================================

const TRAVIS_USER_ID = 'travis-dev-user-id'

// Identity documents from C1
const IDENTITY_DOCUMENTS: Partial<CreateDocumentPayload>[] = [
  {
    title: 'Mi Contrato de Ruta - Travis Dev',
    type: 'route_contract',
    source_module: 'c1',
    related_day: 1,
    content: `# Mi Contrato de Ruta Profesional

## Mi Visión a 90 Días
Transformarme de Product Manager tradicional a líder de producto con visión estratégica y habilidades de AI.

## Mis 3 Puertas (Hitos de Validación)
1. **Día 30**: CV actualizado con métricas de impacto cuantificadas
2. **Día 60**: Portfolio de casos STAR documentados (5 historias)
3. **Día 90**: Entrevistas practicadas con feedback positivo

## Mi Compromiso
Dedicaré 2-3 horas diarias a este proceso. Mi motivación es crecer hacia roles de Staff PM.

## Firma Digital
Travis Dev - Modo Desarrollador
Fecha: ${new Date().toLocaleDateString('es-CL')}`,
  },
  {
    title: 'Declaración de Identidad Profesional',
    type: 'identity_statement',
    source_module: 'c1',
    related_day: 1,
    content: `# Mi Identidad Profesional

Soy un **Product Manager** con 5 años de experiencia en productos B2B SaaS.

## Lo que me define:
- Pensamiento estratégico orientado a resultados
- Capacidad de traducir necesidades técnicas a valor de negocio
- Liderazgo de equipos cross-funcionales

## Mi valor único:
Combino visión de producto con ejecución técnica. Puedo hablar tanto con ingenieros como con stakeholders de negocio.

## Hacia dónde voy:
Staff Product Manager o Head of Product en una empresa tech de alto crecimiento.`,
  },
]

// Profile documents from A1
const PROFILE_DOCUMENTS: Partial<CreateDocumentPayload>[] = [
  {
    title: 'Perfil Psicológico - Resultado El Ritual',
    type: 'psychological_profile',
    source_module: 'a1',
    related_day: 5,
    content: `# Perfil Psicológico

## Perfil DISC: D-I (Dominante-Influyente)

### Características principales:
- Alta orientación a resultados
- Comunicación directa y persuasiva
- Toma de decisiones rápida
- Preferencia por ambientes dinámicos

### Fortalezas:
1. Liderazgo natural
2. Capacidad de influencia
3. Visión estratégica
4. Resiliencia ante desafíos

### Áreas de desarrollo:
1. Paciencia en procesos largos
2. Escucha activa
3. Delegación efectiva

## Estilo de entrevista recomendado:
Directo, con ejemplos de impacto concreto. Evitar respuestas muy largas.`,
  },
  {
    title: 'Perfil de Estilo de Trabajo',
    type: 'work_style_profile',
    source_module: 'a1',
    related_day: 5,
    content: `# Mi Estilo de Trabajo

## Preferencias de ambiente:
- Trabajo híbrido (3 días oficina, 2 remoto)
- Equipos pequeños y ágiles (5-15 personas)
- Cultura de experimentación

## Horarios de mayor productividad:
- Mañanas: trabajo deep focus (9-12)
- Tardes: reuniones y colaboración (14-17)

## Estilo de comunicación:
- Prefiero comunicación asíncrona para decisiones no urgentes
- Reuniones cortas y con agenda clara
- Documentación como fuente de verdad

## Manejo del estrés:
- Ejercicio diario
- Priorización estricta
- Delegación temprana`,
  },
]

// Evidence documents from C2
const EVIDENCE_DOCUMENTS: Partial<CreateDocumentPayload>[] = [
  {
    title: 'Evidencia: Lanzamiento Feature Premium',
    type: 'evidence_item',
    source_module: 'c2',
    related_day: 10,
    content: `# Caso: Lanzamiento de Feature Premium

## Contexto
Plataforma SaaS B2B con 50K usuarios activos. Necesidad de monetización adicional.

## Mi Rol
Product Manager líder del proyecto

## Métricas de Impacto:
- **+35% conversión** a plan premium (de 8% a 10.8%)
- **$2.4M ARR adicional** en primer año
- **NPS +12 puntos** post-lanzamiento
- **Time-to-market: 3 meses** (vs 6 meses estimado inicialmente)

## Acciones clave:
1. Definí roadmap con 3 fases de entrega
2. Coordiné 12 desarrolladores + 3 diseñadores
3. Implementé beta cerrada con 500 usuarios
4. Iteré en base a feedback antes del lanzamiento

## Aprendizajes:
La clave fue el beta cerrado. Sin él, habríamos lanzado features que nadie quería.`,
  },
  {
    title: 'Evidencia: Reducción de Churn',
    type: 'evidence_item',
    source_module: 'c2',
    related_day: 12,
    content: `# Caso: Reducción de Churn

## Contexto
Churn mensual de 8% - insostenible para el negocio.

## Mi Rol
Product Manager de Retención

## Métricas de Impacto:
- **Churn reducido de 8% a 4.5%** en 6 meses
- **LTV aumentado +$1,200** por cliente
- **45% reducción** en tickets de soporte
- **ROI del proyecto: 340%**

## Acciones clave:
1. Análisis de cohortes para identificar puntos de fuga
2. Implementación de onboarding guiado
3. Sistema de health score predictivo
4. Programa de success proactivo

## Aprendizajes:
El 60% del churn ocurría en los primeros 30 días. El onboarding fue la inversión más rentable.`,
  },
]

// A2 daily documents
const A2_DOCUMENTS: Partial<CreateDocumentPayload>[] = [
  {
    title: 'Misión Día 15: Análisis de Mercado',
    type: 'daily_mission',
    source_module: 'a2',
    related_day: 15,
    content: `# Misión: Análisis de Mercado Laboral

## Objetivo
Identificar 5 roles target y empresas alineadas con mi perfil.

## Roles identificados:
1. **Staff Product Manager** - Empresas: Notion, Linear, Figma
2. **Principal PM** - Empresas: Stripe, Shopify, Atlassian
3. **Head of Product** - Startups Serie B/C
4. **Director of Product** - Scale-ups chilenas
5. **VP Product** - Corporativos en transformación

## Análisis de salarios (Chile):
- Staff PM: $8-12M CLP/mes
- Principal: $10-15M CLP/mes
- Head/Director: $12-18M CLP/mes

## Skills más demandados:
- Data-informed decision making
- AI/ML product experience
- B2B SaaS background
- Remote team leadership

## Próximos pasos:
Priorizar roles de Staff PM en empresas product-led.`,
  },
  {
    title: 'CV Draft v1',
    type: 'cv_draft',
    source_module: 'a2',
    related_day: 18,
    content: `# Travis Developer - Product Manager

## Perfil Ejecutivo
Product Manager con 5+ años liderando productos B2B SaaS. Especializado en crecimiento y retención. Track record de +$3.5M en impacto de revenue.

## Experiencia

### Product Manager Senior | TechCorp (2022-Present)
- Lideré lanzamiento de feature premium: +35% conversión, $2.4M ARR
- Reduje churn de 8% a 4.5% en 6 meses
- Coordiné equipo de 15 personas cross-funcionales

### Product Manager | StartupXYZ (2019-2022)
- Crecí base de usuarios de 10K a 150K MAU
- Implementé modelo freemium: 12% conversión
- Lideré migración a nueva arquitectura

## Educación
- MBA, Universidad de Chile (2021)
- Ingeniería Civil Industrial, PUC (2018)

## Skills
Product Strategy | Data Analysis | Agile/Scrum | SQL | Figma | User Research`,
  },
]

// STAR answers
const STAR_DOCUMENTS: Partial<CreateDocumentPayload>[] = [
  {
    title: 'STAR: Liderazgo bajo presión',
    type: 'star_answer',
    source_module: 'a2',
    related_day: 25,
    content: `# STAR: Cuéntame sobre una vez que lideraste bajo presión

## Situación
En TechCorp, perdimos a 2 de 4 desarrolladores senior a mitad de un lanzamiento crítico. El deadline era inamovible - estaba comprometido con 50 clientes enterprise.

## Tarea
Como PM, necesitaba encontrar forma de entregar el MVP sin retrasar más de 2 semanas.

## Acción
1. **Día 1**: Reuní al equipo restante, hicimos repriorización brutal
2. **Día 2**: Negocié con stakeholders reducir scope en 40%
3. **Semana 1**: Contraté 2 contractors especializados
4. **Semana 2-4**: Implementé sprints diarios de 2 horas

## Resultado
- Entregamos 3 días antes del deadline ajustado
- 0 bugs críticos en producción
- El equipo reportó mayor satisfacción que en proyectos anteriores
- Los contractors se convirtieron en full-time

## Reflexión
La clave fue aceptar que el plan original ya no era viable y actuar rápido en vez de negar la realidad.`,
  },
  {
    title: 'STAR: Decisión difícil con datos',
    type: 'star_answer',
    source_module: 'a2',
    related_day: 28,
    content: `# STAR: Cuéntame sobre una decisión difícil basada en datos

## Situación
Nuestro feature más popular (usado por 70% de usuarios) tenía un bug que afectaba al 5% de los casos. Arreglarlo requería 3 sprints y retrasaría el roadmap del Q4.

## Tarea
Decidir si priorizar el fix o continuar con features planificadas que el CEO había prometido a clientes.

## Acción
1. Analicé el impacto real: 5% de casos = 2,500 usuarios afectados mensualmente
2. Calculé churn atribuible: $180K/año en riesgo
3. Comparé con valor de features planificadas: $300K estimado
4. Presenté análisis al CEO con recomendación de fix parcial (1 sprint)

## Resultado
- Implementamos fix parcial que cubría 80% de casos
- Churn del segmento afectado bajó 60%
- Roadmap se retrasó solo 2 semanas
- CEO adoptó el framework de análisis para futuras decisiones

## Reflexión
Los datos no toman la decisión - la toman las personas. Pero los datos permiten tomar decisiones defendibles.`,
  },
]

// Job analysis documents
const JOB_DOCUMENTS: Partial<CreateDocumentPayload>[] = [
  {
    title: 'Análisis: Staff PM @ Notion',
    type: 'job_analysis',
    source_module: 'a2',
    related_day: 35,
    content: `# Análisis de Puesto: Staff Product Manager @ Notion

## Información del puesto
- **Empresa**: Notion
- **Ubicación**: Remoto (América)
- **Salario estimado**: $180-250K USD
- **Nivel**: Staff (IC5-IC6)

## Requisitos clave:
1. 7+ años de experiencia en producto
2. Track record de productos 0→1
3. Experiencia en herramientas de productividad
4. Data-driven decision making

## Mi fit:
| Requisito | Mi nivel | Gap |
|-----------|----------|-----|
| Años exp | 5 años | -2 años |
| 0→1 exp | 2 productos | OK |
| Productividad | Indirecto | Pequeño |
| Data-driven | Fuerte | OK |

## Estrategia de aplicación:
1. Destacar casos de 0→1
2. Conectar experiencia B2B con productividad de equipos
3. Mostrar métricas de impacto concretas
4. Preparar respuestas sobre colaboración remota

## Probabilidad de éxito: 65%
Gap principal: años de experiencia. Mitigación: enfatizar impacto sobre tiempo.`,
  },
]

// Coach feedback documents
const FEEDBACK_DOCUMENTS: Partial<CreateDocumentPayload>[] = [
  {
    title: 'Feedback Coach - Semana 3',
    type: 'coach_feedback',
    source_module: 'coach',
    related_day: 21,
    content: `# Feedback de Coach - Semana 3

## Progreso observado:
- Excelente avance en documentación de evidencia
- CV draft tiene buena estructura
- STAR answers muestran claridad en el método

## Áreas de mejora:
1. **Métricas**: Agregar más números específicos en evidencia
2. **Concisión**: Respuestas STAR pueden ser 20% más cortas
3. **Diferenciación**: ¿Qué te hace único vs otros PMs?

## Recomendaciones para semana 4:
1. Completar 2 STAR answers más (liderazgo y fracaso)
2. Revisar CV con foco en métricas de impacto
3. Investigar 3 empresas target en profundidad

## Motivación:
Vas muy bien encaminado. El 80% de candidatos no llega a este nivel de preparación. Sigue así.

## Próxima sesión: Día 28
Tema: Simulación de entrevista conductual`,
  },
]

// ============================================
// SEEDING FUNCTIONS
// ============================================

/**
 * Seed complete Travis workspace with realistic documents
 */
export async function seedTravisDocuments(userId: string): Promise<{
  success: boolean
  documentsCreated: number
  error?: string
}> {
  try {
    let created = 0

    // Seed all document categories
    const allTemplates = [
      ...IDENTITY_DOCUMENTS,
      ...PROFILE_DOCUMENTS,
      ...EVIDENCE_DOCUMENTS,
      ...A2_DOCUMENTS,
      ...STAR_DOCUMENTS,
      ...JOB_DOCUMENTS,
      ...FEEDBACK_DOCUMENTS,
    ]

    for (const template of allTemplates) {
      const doc = await createDocument({
        user_id: userId,
        title: template.title || 'Travis Document',
        type: template.type as DTCDocumentType,
        content: template.content || '',
        source_module: template.source_module as DTCSourceModule,
        related_day: template.related_day,
        source: 'travis_seed',
        tags: ['travis-seed', 'demo'],
      })

      if (doc) {
        created++
      }
    }

    // Create profile signals
    await seedTravisProfileSignals(userId)

    // Create profile snapshot
    await createProfileSnapshot(userId, 35)

    console.log(`[Travis Seed] Created ${created} documents for user ${userId}`)

    return {
      success: true,
      documentsCreated: created,
    }
  } catch (error) {
    console.error('[Travis Seed] Error seeding documents:', error)
    return {
      success: false,
      documentsCreated: 0,
      error: String(error),
    }
  }
}

/**
 * Seed documents up to a specific day
 */
export async function seedTravisDocumentsUntilDay(
  userId: string,
  targetDay: number
): Promise<{ success: boolean; documentsCreated: number }> {
  const allTemplates = [
    ...IDENTITY_DOCUMENTS,
    ...PROFILE_DOCUMENTS,
    ...EVIDENCE_DOCUMENTS,
    ...A2_DOCUMENTS,
    ...STAR_DOCUMENTS,
    ...JOB_DOCUMENTS,
    ...FEEDBACK_DOCUMENTS,
  ].filter(t => (t.related_day || 0) <= targetDay)

  let created = 0

  for (const template of allTemplates) {
    const doc = await createDocument({
      user_id: userId,
      title: template.title || 'Travis Document',
      type: template.type as DTCDocumentType,
      content: template.content || '',
      source_module: template.source_module as DTCSourceModule,
      related_day: template.related_day,
      source: 'travis_seed',
      tags: ['travis-seed', 'demo'],
    })

    if (doc) created++
  }

  return { success: true, documentsCreated: created }
}

/**
 * Seed A3 module context documents
 */
export async function seedTravisA3Context(
  userId: string,
  moduleId: string
): Promise<{ success: boolean; documentsCreated: number }> {
  // For A3 modules, ensure STAR answers and evidence exist
  const moduleNumber = parseInt(moduleId.replace('module-', '')) || 1
  const relevantDocs = [...STAR_DOCUMENTS, ...EVIDENCE_DOCUMENTS]
    .slice(0, moduleNumber * 2)

  let created = 0

  for (const template of relevantDocs) {
    const doc = await createDocument({
      user_id: userId,
      title: template.title || 'Travis A3 Context',
      type: template.type as DTCDocumentType,
      content: template.content || '',
      source_module: template.source_module as DTCSourceModule,
      related_a3_module: moduleId,
      source: 'travis_seed',
      tags: ['travis-seed', 'a3-context'],
    })

    if (doc) created++
  }

  return { success: true, documentsCreated: created }
}

/**
 * Seed profile signals for Travis mode
 */
async function seedTravisProfileSignals(userId: string): Promise<void> {
  const signals = [
    {
      user_id: userId,
      source_module: 'a1',
      signal_type: 'strength',
      signal_value: 'Liderazgo de equipos cross-funcionales',
      confidence: 85,
      weight: 9,
      polarity: 'positive',
    },
    {
      user_id: userId,
      source_module: 'a1',
      signal_type: 'strength',
      signal_value: 'Data-driven decision making',
      confidence: 90,
      weight: 9,
      polarity: 'positive',
    },
    {
      user_id: userId,
      source_module: 'c2',
      signal_type: 'proof_of_value',
      signal_value: '+35% conversión en feature premium',
      confidence: 95,
      weight: 10,
      polarity: 'positive',
    },
    {
      user_id: userId,
      source_module: 'c2',
      signal_type: 'proof_of_value',
      signal_value: 'Reducción churn 8% a 4.5%',
      confidence: 95,
      weight: 10,
      polarity: 'positive',
    },
    {
      user_id: userId,
      source_module: 'a2',
      signal_type: 'target_role',
      signal_value: 'Staff Product Manager',
      confidence: 80,
      weight: 8,
      polarity: 'positive',
    },
    {
      user_id: userId,
      source_module: 'a1',
      signal_type: 'work_style',
      signal_value: 'structured',
      confidence: 75,
      weight: 6,
      polarity: 'neutral',
    },
    {
      user_id: userId,
      source_module: 'a3',
      signal_type: 'interview_risk',
      signal_value: 'Respuestas pueden ser demasiado largas',
      confidence: 70,
      weight: 5,
      polarity: 'negative',
    },
  ]

  await saveProfileSignals(signals as any)
}

/**
 * Clear all seeded documents for a user
 */
export async function clearSeededDocuments(userId: string): Promise<boolean> {
  const supabase = createClient()
  if (!supabase) return false

  const { error } = await supabase
    .from('dtc_documents')
    .delete()
    .eq('user_id', userId)
    .eq('source', 'travis_seed')

  if (error) {
    console.error('[Travis Seed] Error clearing documents:', error)
    return false
  }

  // Also clear signals
  await supabase
    .from('dtc_profile_signals')
    .delete()
    .eq('user_id', userId)

  return true
}
