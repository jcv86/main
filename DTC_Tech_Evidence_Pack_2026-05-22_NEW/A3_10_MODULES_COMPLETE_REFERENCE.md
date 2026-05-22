# A3 10 MODULES - COMPLETE ROUTE GENERATION REFERENCE

**Created:** May 13, 2026
**Scope:** All 10 A3 Basic Level Training Modules with Existing Code Structure
**Total XP:** 1,340 XP across 10 modules
**Design System:** Pillar 3 Colors (rgb(170, 70, 170) primary, rgb(80, 160, 170) accent)

---

## TABLE OF CONTENTS

1. [Module Definitions & Data Structure](#module-definitions)
2. [All 10 Modules with Complete Details](#all-10-modules)
3. [Progress Tracking System](#progress-tracking)
4. [Status Management](#status-management)
5. [XP & Reward System](#xp-system)
6. [API Integration](#api-integration)
7. [Database Queries](#database-queries)
8. [Component Structure](#component-structure)
9. [Styling & Visual System](#styling-system)
10. [Route Actions & Navigation](#route-actions)

---

## MODULE DEFINITIONS & DATA STRUCTURE

### Module Interface
\`\`\`typescript
interface Module {
  id: string                          // Unique identifier (kebab-case)
  number: number                      // Sequential 1-10
  title: string                       // Spanish module title
  shortDescription: string            // 1-2 sentence description
  format: string                      // Module format type
  inputMode: string                   // How user provides input
  interviewRequirement: string        // Interview required? Yes/No/Optional
  xp: number                          // Experience points awarded
  mainOutput: string                  // Primary deliverable
  cta: string                         // Call-to-action button text
  tags: string[]                      // Feature tags
  requiredActivities: string[]        // Required completion steps
  icon: React.ReactNode               // Lucide icon component
  route: string                       // Internal route path
}
```

### Status Types
\`\`\`typescript
type ModuleStatus = 'locked' | 'available' | 'in_progress' | 'completed'

interface ModuleProgreso {
  status: ModuleStatus
  progress: number                    // 0-100%
  earnedXp: number
  completedActivities: number
}
\`\`\`

---

## ALL 10 MODULES WITH COMPLETE DETAILS

### MODULE 1: ESPEJO DE CARRERA (Career Mirror)
**XP:** 80 | **Status:** Starting Module | **Interview Required:** No

\`\`\`typescript
{
  id: 'career-mirror',
  number: 1,
  title: 'Espejo de Carrera',
  shortDescription: 'Comprende tu perfil profesional, tu diagnóstico del Nivel Básico, tus fortalezas, bloqueadores, y cómo los entrevistadores pueden percibirte.',
  format: 'Módulo de autodescubrimiento',
  inputMode: 'Tarjetas interactivas, reflexiones breves, confirmaciones',
  interviewRequirement: 'Sin entrevista requerida',
  xp: 80,
  mainOutput: 'Tarjeta de Espejo de Carrera',
  cta: 'Comenzar Espejo de Carrera',
  tags: ['Sin Entrevista', 'Autodescubrimiento', 'Claridad de Perfil'],
  requiredActivities: [
    'Revisar diagnóstico',
    'Confirmar precisión del diagnóstico',
    'Seleccionar dirección principal de carrera',
    'Definir identidad profesional actual',
    'Guardar Tarjeta de Espejo de Carrera'
  ],
  route: '/despega/a3/career-mirror'
}
\`\`\`

**Description:** Self-discovery module that establishes the user's professional profile, understanding of basic level diagnosis, strengths, blockers, and interviewer perception.

**Learning Objectives:**
- Understand professional profile comprehensively
- Identify personal strengths and blockers
- Recognize how interviewers perceive you
- Establish career direction clarity

**Deliverable:** Career Mirror Card with professional summary

---

### MODULE 2: LABORATORIO DE MINERÍA DE VALOR (Value Mining Lab)
**XP:** 100 | **Status:** Builds on Module 1 | **Interview Required:** No

\`\`\`typescript
{
  id: 'value-mining-lab',
  number: 2,
  title: 'Laboratorio de Minería de Valor',
  shortDescription: 'Descubre el valor real oculto en tu experiencia laboral anterior y convierte tareas en logros.',
  format: 'Laboratorio de descubrimiento de logros',
  inputMode: 'Entrada de texto por defecto. Modo coach guiado opcional.',
  interviewRequirement: 'Sin entrevista requerida. Soporte de coach opcional disponible.',
  xp: 100,
  mainOutput: 'Banco de Logros Básico',
  cta: 'Abrir Laboratorio de Valor',
  tags: ['Constructor de Texto', 'Coach Opcional', 'Laboratorio de Logros'],
  requiredActivities: [
    'Escribir 5 tareas de experiencia anterior',
    'Transformar tareas en declaraciones de valor',
    'Completar transformación de responsabilidades',
    'Crear 3 ejemplos de logros',
    'Seleccionar 1 historia fuerte para respuestas futuras de entrevista'
  ],
  route: '/despega/a3/value-mining-lab'
}
\`\`\`

**Description:** Achievement discovery lab where users identify hidden value in past work experience and convert tasks into achievement statements.

**Learning Objectives:**
- Recognize value in past experiences
- Transform tasks into achievement stories
- Build a basic achievement bank
- Prepare strong STAR stories

**Features:**
- Text-based input (default)
- Optional AI coach guidance
- Achievement transformation framework
- Story banking system

**Deliverable:** Basic Achievement Bank with 3+ strong examples

---

### MODULE 3: ESTUDIO CONSTRUCTOR DE CV (CV Builder Studio)
**XP:** 120 | **Status:** Intermediate | **Interview Required:** No

\`\`\`typescript
{
  id: 'cv-builder-studio',
  number: 3,
  title: 'Estudio Constructor de CV',
  shortDescription: 'Crea o mejora un CV claro y atractivo para reclutadores usando el valor descubierto en módulos anteriores.',
  format: 'Módulo de creación de documentos y escritura profesional',
  inputMode: 'Carga de CV, entrada de texto manual, constructor guiado',
  interviewRequirement: 'Sin entrevista requerida',
  xp: 120,
  mainOutput: 'Borrador de CV Básico',
  cta: 'Construir Mi CV',
  tags: ['Constructor de CV', 'Sin Entrevista', 'Estudio de Documentos'],
  requiredActivities: [
    'Cargar o crear base de CV',
    'Construir resumen profesional',
    'Mejorar al menos 3 puntos de experiencia',
    'Organizar sección de habilidades',
    'Completar lista de verificación de información faltante'
  ],
  route: '/despega/a3/cv-builder-studio'
}
\`\`\`

**Description:** Document creation module for building or improving CV using value discovered in earlier modules.

**Learning Objectives:**
- Create compelling professional summary
- Enhance experience descriptions with value language
- Organize skills effectively
- Apply ATS best practices

**Input Methods:**
- CV upload
- Manual text entry
- Guided builder

**Deliverable:** Basic CV Draft ready for applications

---

### MODULE 4: DECODIFICADOR DE OFERTAS (Job Decoder)
**XP:** 100 | **Status:** Application Preparation | **Interview Required:** No

\`\`\`typescript
{
  id: 'job-decoder',
  number: 4,
  title: 'Decodificador de Ofertas',
  shortDescription: 'Analiza ofertas de trabajo reales para identificar requisitos clave, brechas de habilidades y estrategia de aplicación personalizada.',
  format: 'Herramienta de análisis de ofertas de trabajo',
  inputMode: 'Pegado de ofertas de trabajo, análisis guiado, mapeo de habilidades',
  interviewRequirement: 'Sin entrevista requerida',
  xp: 100,
  mainOutput: 'Mapa de Correspondencia de Oferta',
  cta: 'Decodificar Oferta de Trabajo',
  tags: ['Análisis de Ofertas', 'Sin Entrevista', 'Correspondencia de Rol'],
  requiredActivities: [
    'Pegar descripción de trabajo',
    'Identificar requisitos clave',
    'Categorizar obligatorios vs. opcionales',
    'Mapear experiencia actual',
    'Crear estrategia de aplicación personalizada'
  ],
  route: '/despega/a3/job-decoder'
}
\`\`\`

**Description:** Job posting analysis tool for identifying key requirements, skill gaps, and personalized application strategy.

**Learning Objectives:**
- Analyze job descriptions systematically
- Identify must-have vs. nice-to-have requirements
- Map personal experience to role requirements
- Develop targeted application strategy

**Features:**
- Job posting paste/import
- Guided analysis workflow
- Requirement categorization
- Experience mapping
- Strategy recommendations

**Deliverable:** Job Mapping Document with application strategy

---

### MODULE 5: ARQUITECTURA DE RESPUESTAS (Answer Architecture)
**XP:** 120 | **Status:** Interview Preparation | **Interview Required:** No

\`\`\`typescript
{
  id: 'answer-architecture',
  number: 5,
  title: 'Arquitectura de Respuestas',
  shortDescription: 'Domina marcos de respuesta probados (STAR, CAR) para construir respuestas de entrevista convincentes y estructuradas.',
  format: 'Módulo de arquitectura de respuestas',
  inputMode: 'Aprendizaje guiado, construcción de plantillas, práctica',
  interviewRequirement: 'Sin entrevista requerida',
  xp: 120,
  mainOutput: 'Banco de Respuestas de Entrevista',
  cta: 'Aprender Arquitectura de Respuestas',
  tags: ['Constructor de Respuestas', 'Voz Opcional', 'Método STAR'],
  requiredActivities: [
    'Dominar marcos STAR/CAR/PAR',
    'Aprender 6 tipos de preguntas comunes',
    'Practicar autopresentación de 30 segundos',
    'Construir respuesta de motivación',
    'Crear respuestas de fortaleza y desafío'
  ],
  route: '/despega/a3/answer-architecture'
}
\`\`\`

**Description:** Framework mastery module for STAR, CAR, and PAR answer structures to build compelling, structured interview responses.

**Learning Objectives:**
- Master STAR/CAR/PAR frameworks
- Learn 6 common question types
- Build 30-second pitch
- Create motivation and challenge answers

**Frameworks Taught:**
- **STAR:** Situation, Task, Action, Result
- **CAR:** Challenge, Action, Result
- **PAR:** Problem, Action, Result

**Question Types Covered:**
1. Behavioral (STAR)
2. Motivation
3. Strength/Weakness
4. Challenge/Failure
5. Technical
6. Closing questions

**Deliverable:** Interview Answer Bank with 5+ structured responses

---

### MODULE 6: SALA DE PRÁCTICA DEL COACH (Coach Practice Room)
**XP:** 130 | **Status:** Interactive Practice | **Interview Required:** No

\`\`\`typescript
{
  id: 'coach-practice-room',
  number: 6,
  title: 'Sala de Práctica del Coach',
  shortDescription: 'Practica preguntas de entrevista comunes con retroalimentación inmediata del coach de IA y métricas de mejora.',
  format: 'Simulación interactiva con coach de IA',
  inputMode: 'Práctica de preguntas rápidas, grabación de voz, escritura de respuestas',
  interviewRequirement: 'Sin entrevista requerida',
  xp: 130,
  mainOutput: 'Informe de Métricas de Práctica',
  cta: 'Entrar a Sala de Práctica',
  tags: ['Práctica Interactiva', 'Retroalimentación del Coach', 'Método STAR'],
  requiredActivities: [
    'Completar preguntas rápidas',
    'Practicar recorrido de CV',
    'Responder preguntas conductuales',
    'Recibir retroalimentación del coach',
    'Monitorear métricas de mejora'
  ],
  route: '/despega/a3/coach-practice-room'
}
\`\`\`

**Description:** Interactive simulation with AI coach for practicing common interview questions with immediate feedback and improvement metrics.

**Learning Objectives:**
- Practice interview questions in real-time
- Receive immediate AI coaching feedback
- Track improvement metrics
- Build confidence through practice

**Practice Modes:**
- Quick questions
- CV walkthrough
- Behavioral questions
- Full mock interview

**Feedback Metrics:**
- Response structure (STAR compliance)
- Clarity and conciseness
- Confidence indicators
- Story relevance
- Impact communication

**Deliverable:** Practice Metrics Report with improvement tracking

---

### MODULE 7: GIMNASIO DE COMUNICACIÓN (Communication Gym)
**XP:** 140 | **Status:** Skills Development | **Interview Required:** No

\`\`\`typescript
{
  id: 'communication-gym',
  number: 7,
  title: 'Gimnasio de Comunicación',
  shortDescription: 'Desarrolla habilidades de comunicación profesional: vocabulario, lenguaje corporal, escucha activa y generación de confianza.',
  format: 'Módulo de desarrollo de habilidades de comunicación',
  inputMode: 'Grabación de voz, autoevaluación, práctica guiada',
  interviewRequirement: 'Sin entrevista requerida',
  xp: 140,
  mainOutput: 'Perfil de Estilo de Comunicación',
  cta: 'Desarrollar Habilidades de Comunicación',
  tags: ['Comunicación Profesional', 'Práctica de Voz', 'Desarrollo de Habilidades'],
  requiredActivities: [
    'Evaluar estilo de comunicación actual',
    'Aprender vocabulario profesional',
    'Practicar señales de lenguaje corporal',
    'Dominar técnicas de escucha activa',
    'Construir habilidades de generación de confianza'
  ],
  route: '/despega/a3/communication-gym'
}
\`\`\`

**Description:** Professional communication skills development module covering vocabulary, body language, active listening, and confidence building.

**Learning Objectives:**
- Develop professional vocabulary
- Master body language signals
- Practice active listening
- Build trust and rapport
- Improve communication clarity

**Skill Modules:**
1. Professional vocabulary
2. Body language signals
3. Active listening techniques
4. Voice modulation
5. Confidence building
6. Rapport development

**Practice Activities:**
- Voice recording exercises
- Self-assessment
- Guided practice
- Peer feedback (if available)

**Deliverable:** Communication Style Profile with recommendations

---

### MODULE 8: PRIMERA SIMULACIÓN CON RECLUTADOR (First Recruiter Simulation)
**XP:** 160 | **Status:** Advanced Practice | **Interview Required:** No

\`\`\`typescript
{
  id: 'first-recruiter-simulation',
  number: 8,
  title: 'Primera Simulación con Reclutador',
  shortDescription: 'Simula tu primera interacción con un reclutador de recursos humanos para practicar el diálogo inicial y generación de confianza.',
  format: 'Simulación de reclutador virtual',
  inputMode: 'Conversación guiada, práctica de preguntas de filtrado, manejo de salario',
  interviewRequirement: 'Sin entrevista requerida',
  xp: 160,
  mainOutput: 'Informe de Retroalimentación del Reclutador',
  cta: 'Comenzar Simulación con Reclutador',
  tags: ['Simulación Interactiva', 'Práctica de Diálogo', 'Entrevista Simulada'],
  requiredActivities: [
    'Lista de verificación previa a la entrevista',
    'Sección de apertura',
    'Responder preguntas de filtrado',
    'Navegar discusión de salario',
    'Recibir informe de retroalimentación'
  ],
  route: '/despega/a3/first-recruiter-simulation'
}
\`\`\`

**Description:** Virtual recruiter simulation for practicing initial HR recruiter interaction, opening dialogue, screening questions, and salary negotiation.

**Learning Objectives:**
- Practice recruiter screening calls
- Handle common screening questions
- Manage salary discussions
- Build rapport with recruiters
- Navigate conversation flow

**Simulation Phases:**
1. Pre-interview checklist
2. Opening/rapport building
3. Screening questions
4. CV walkthrough
5. Salary discussion
6. Closing and next steps

**Screening Topics:**
- Availability and timeline
- Visa/work authorization
- Salary expectations
- Notice period
- Role fit

**Deliverable:** Recruiter Feedback Report with improvement areas

---

### MODULE 9: LABORATORIO DE PREGUNTAS DIFÍCILES Y DE RIESGO (Risk Difficult Questions Lab)
**XP:** 170 | **Status:** Advanced Preparation | **Interview Required:** No

\`\`\`typescript
{
  id: 'risk-difficult-questions-lab',
  number: 9,
  title: 'Laboratorio de Preguntas Difíciles y de Riesgo',
  shortDescription: 'Identifica y maneja preguntas difíciles o de riesgo con fórmulas de respuesta segura y práctica bajo presión.',
  format: 'Laboratorio de preguntas de riesgo',
  inputMode: 'Análisis de riesgo, construcción de respuestas seguras, simulación de presión',
  interviewRequirement: 'Sin entrevista requerida',
  xp: 170,
  mainOutput: 'Guía de Preguntas de Riesgo Preparadas',
  cta: 'Preparar Respuestas de Riesgo',
  tags: ['Gestión de Riesgo', 'Preguntas Difíciles', 'Práctica Bajo Presión'],
  requiredActivities: [
    'Identificar áreas de riesgo personal',
    'Aprender fórmulas de respuesta segura',
    'Identificar frases de alerta roja a evitar',
    'Construir respuestas seguras preparadas',
    'Completar simulación de presión de 3 preguntas'
  ],
  route: '/despega/a3/risk-difficult-questions-lab'
}
\`\`\`

**Description:** Risk management lab for identifying and handling difficult or risky questions with safe answer formulas and pressure practice.

**Learning Objectives:**
- Identify personal risk areas
- Learn safe answer formulas
- Recognize red flag phrases
- Build prepared safe answers
- Practice under pressure

**Difficult Question Types:**
1. Gaps in employment
2. Job hopping
3. Salary history
4. Firing/termination
5. Criminal history
6. Health issues
7. Visa/work authorization
8. Competition/conflicts of interest
9. Technical limitations
10. Cultural fit concerns

**Safe Answer Framework:**
- Acknowledge briefly
- Reframe positively
- Provide evidence of growth
- Connect to job requirements
- Move forward

**Red Flag Phrases to Avoid:**
- Negative language about past employers
- Lack of responsibility
- Desperation or neediness
- Unrealistic salary expectations
- Unavailability concerns

**Deliverable:** Risk Question Guide with 10+ prepared safe responses

---

### MODULE 10: MISIÓN DE ENTREVISTA BÁSICA (Basic Interview Mission)
**XP:** 220 | **Status:** Certification | **Interview Required:** YES

\`\`\`typescript
{
  id: 'basic-interview-mission',
  number: 10,
  title: 'Misión de Entrevista Básica',
  shortDescription: 'Misión final de certificación: realiza una entrevista simulada completa que valida el dominio de todas las habilidades del Nivel Básico.',
  format: 'Misión de certificación de entrevista completa',
  inputMode: 'Simulación de entrevista completa de 10+ preguntas',
  interviewRequirement: 'Entrevista simulada requerida',
  xp: 220,
  mainOutput: 'Certificación del Nivel Básico',
  cta: 'Comenzar Misión de Entrevista Básica',
  tags: ['Certificación', 'Entrevista Completa', 'Validación de Habilidades'],
  requiredActivities: [
    'Briefing de misión',
    'Apertura',
    'Preguntas de historial de antecedentes',
    'Preguntas de motivación',
    'Preguntas conductuales',
    'Preguntas de riesgo',
    'Cierre',
    'Autoevaluación en 5 criterios',
    'Generar informe de preparación',
    'Completar certificación del Nivel Básico'
  ],
  route: '/despega/a3/basic-interview-mission'
}
\`\`\`

**Description:** Final certification mission - complete full simulated interview validating mastery of all Basic Level skills.

**Learning Objectives:**
- Apply all learned frameworks in real interview context
- Manage full interview flow
- Handle diverse question types
- Demonstrate communication excellence
- Achieve Basic Level certification

**Full Interview Structure:**

**Phase 1: Opening (2-3 min)**
- Rapport building
- Role expectations clarification
- Question type overview

**Phase 2: Background & Motivation (3-4 min)**
- Background questions
- "Tell me about yourself"
- Motivation questions
- Why this company?

**Phase 3: Behavioral Questions (5-8 min)**
- 3-4 STAR-format behavioral questions
- Different competencies
- Stress response scenarios

**Phase 4: Technical/Role-Specific (3-5 min)**
- Role-specific questions
- Technical knowledge (if applicable)
- Process familiarity

**Phase 5: Risk Management (2-3 min)**
- Difficult question
- Stress management question
- Challenge question

**Phase 6: Closing (2 min)**
- Questions for interviewer
- Next steps clarification
- Rapport closing

**Self-Evaluation Criteria:**
1. Structure & Framework (STAR compliance)
2. Communication Clarity
3. Story Relevance & Impact
4. Confidence & Presence
5. Risk Management

**Deliverable:** Basic Level Certification with full feedback report

---

## PROGRESS TRACKING SYSTEM

### Progress Data Model
\`\`\`typescript
interface ModuleProgreso {
  status: 'locked' | 'available' | 'in_progress' | 'completed'
  progress: number                    // 0-100%
  earnedXp: number
  completedActivities: number
}

// Progress calculated as:
const earnedXp = Object.values(moduleProgreso)
  .reduce((sum, p) => sum + p.earnedXp, 0)

const completedModules = Object.values(moduleProgreso)
  .filter(p => p.status === 'completed').length

const progressPercentage = Math.round((earnedXp / TOTAL_XP) * 100)
\`\`\`

### Status Progression Rules
\`\`\`typescript
// Initial state: Module 1 available, all others locked
const defaultProgreso: Record<string, ModuleProgreso> = {}
BASIC_LEVEL_MODULES.forEach((module, index) => {
  defaultProgreso[module.id] = {
    status: index === 0 ? 'available' : 'locked',
    progress: 0,
    earnedXp: 0,
    completedActivities: 0
  }
})

// Status transition logic
BASIC_LEVEL_MODULES.forEach((module, index) => {
  const apiStatus = progress?.moduleStates?.[module.id]
  let status: ModuleStatus = 'locked'
  
  if (apiStatus === 'completed') {
    status = 'completed'
  } else if (apiStatus === 'in_progress') {
    status = 'in_progress'
  } else if (apiStatus === 'available' || index === 0) {
    status = 'available'
  } else {
    // Check if previous module is completed
    const prevModule = BASIC_LEVEL_MODULES[index - 1]
    const prevStatus = progress?.moduleStates?.[prevModule.id]
    if (prevStatus === 'completed') {
      status = 'available'
    }
  }
})
\`\`\`

### Progress Update Flow
1. User completes module activities
2. Module marked as 'completed'
3. Module XP awarded to user
4. Next module becomes 'available'
5. Progress percentage updated
6. User notified of advancement

---

## STATUS MANAGEMENT

### Badge Styling by Status
\`\`\`typescript
const getStatusBadge = (status: ModuleStatus) => {
  switch (status) {
    case 'completed':
      return (
        <Badge 
          style={{ 
            backgroundColor: 'rgba(170, 70, 170, 0.1)', 
            color: 'rgb(200, 130, 200)', 
            borderColor: 'rgba(170, 70, 170, 0.3)' 
          }} 
          className="border"
        >
          Completado
        </Badge>
      )
    case 'in_progress':
      return (
        <Badge 
          style={{ 
            backgroundColor: 'rgba(80, 160, 170, 0.2)', 
            color: 'rgb(80, 160, 170)', 
            borderColor: 'rgba(80, 160, 170, 0.4)' 
          }} 
          className="border"
        >
          En Progreso
        </Badge>
      )
    case 'available':
      return (
        <Badge 
          style={{ 
            backgroundColor: 'rgba(170, 70, 170, 0.2)', 
            color: 'rgb(170, 70, 170)', 
            borderColor: 'rgba(170, 70, 170, 0.4)' 
          }} 
          className="border"
        >
          Disponible
        </Badge>
      )
    case 'locked':
      return (
        <Badge className="bg-white/10 text-white/50 border-white/20 border">
          Bloqueado
        </Badge>
      )
  }
}
\`\`\`

### Visual Indicators
- **Completed (Green/Teal):** Module XP awarded, can review
- **In Progress (Teal):** Currently working, can resume
- **Available (Purple):** Ready to start, locked until prerequisites
- **Locked (Gray):** Waiting for prerequisites

---

## XP SYSTEM

### XP Distribution by Module
\`\`\`typescript
const BASIC_LEVEL_MODULES: Module[] = [
  // Module 1
  { id: 'career-mirror', xp: 80, ... },
  
  // Module 2
  { id: 'value-mining-lab', xp: 100, ... },
  
  // Module 3
  { id: 'cv-builder-studio', xp: 120, ... },
  
  // Module 4
  { id: 'job-decoder', xp: 100, ... },
  
  // Module 5
  { id: 'answer-architecture', xp: 120, ... },
  
  // Module 6
  { id: 'coach-practice-room', xp: 130, ... },
  
  // Module 7
  { id: 'communication-gym', xp: 140, ... },
  
  // Module 8
  { id: 'first-recruiter-simulation', xp: 160, ... },
  
  // Module 9
  { id: 'risk-difficult-questions-lab', xp: 170, ... },
  
  // Module 10 (Certification)
  { id: 'basic-interview-mission', xp: 220, ... }
]

const TOTAL_XP = 1,340 XP
\`\`\`

### XP Award Logic
\`\`\`typescript
progressMap[module.id] = {
  status,
  progress: status === 'completed' ? 100 : status === 'in_progress' ? 50 : 0,
  earnedXp: status === 'completed' ? module.xp : 0,
  completedActivities: status === 'completed' ? module.requiredActivities.length : 0
}
\`\`\`

---

## API INTEGRATION

### Fetch User Progress
\`\`\`typescript
useEffect(() => {
  const fetchProgreso = async () => {
    try {
      const response = await fetch('/api/a3/user-progress', {
        credentials: 'include',
        cache: 'no-store'
      })
      
      if (response.ok) {
        const { progress } = await response.json()
        
        // Map API response to module structure
        const progressMap: Record<string, ModuleProgreso> = {}
        
        BASIC_LEVEL_MODULES.forEach((module, index) => {
          const apiStatus = progress?.moduleStates?.[module.id]
          // ... status determination logic
          
          progressMap[module.id] = {
            status,
            progress: status === 'completed' ? 100 : status === 'in_progress' ? 50 : 0,
            earnedXp: status === 'completed' ? module.xp : 0,
            completedActivities: status === 'completed' 
              ? module.requiredActivities.length 
              : 0
          }
        })
        
        setModuleProgreso(progressMap)
      } else {
        // Default fallback
        setDefaultProgress()
      }
    } catch (error) {
      console.error('Error fetching progress:', error)
      setDefaultProgress()
    } finally {
      setIsLoading(false)
    }
  }
  
  fetchProgreso()
}, [])
\`\`\`

### API Response Structure
\`\`\`typescript
{
  progress: {
    moduleStates: {
      'career-mirror': 'completed',
      'value-mining-lab': 'in_progress',
      'cv-builder-studio': 'available',
      'job-decoder': 'locked',
      // ... more modules
    }
  }
}
\`\`\`

---

## DATABASE QUERIES

### Track Module Completion
\`\`\`typescript
// Pseudo-query to update module status
UPDATE user_progress
SET 
  module_states = jsonb_set(module_states, '{module_id}', '"completed"'),
  earned_xp = earned_xp + module_xp,
  completed_modules = completed_modules + 1,
  updated_at = NOW()
WHERE user_id = $1

// Calculate user totals
SELECT 
  SUM(earned_xp) as total_xp,
  COUNT(CASE WHEN status = 'completed' THEN 1 END) as modules_completed,
  ROUND((SUM(earned_xp) / 1340) * 100) as progress_percentage
FROM user_progress
WHERE user_id = $1
\`\`\`

### Retrieve Module Details
\`\`\`typescript
// Get all modules with user progress
SELECT 
  m.id,
  m.number,
  m.title,
  m.xp,
  up.status,
  up.progress,
  up.earned_xp
FROM modules m
LEFT JOIN user_progress up 
  ON m.id = up.module_id 
  AND up.user_id = $1
WHERE m.level = 'basic'
ORDER BY m.number ASC
\`\`\`

---

## COMPONENT STRUCTURE

### Main Dashboard Component
\`\`\`typescript
export default function A3BasicLevelTrainingPath() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [moduleProgreso, setModuleProgreso] = useState<Record<string, ModuleProgreso>>({})
  const [selectedPath, setSelectedPath] = useState<'30' | '60' | '90'>('30')
  const [expandedModule, setExpandedModule] = useState<string | null>(null)

  // Calculate totals
  const earnedXp = Object.values(moduleProgreso).reduce((sum, p) => sum + p.earnedXp, 0)
  const completedModules = Object.values(moduleProgreso)
    .filter(p => p.status === 'completed').length
  const progressPercentage = Math.round((earnedXp / TOTAL_XP) * 100)
  
  // Find current and next module
  const currentModule = BASIC_LEVEL_MODULES.find(m => {
    const progress = moduleProgreso[m.id]
    return progress?.status === 'in_progress' || progress?.status === 'available'
  })
  const nextModule = currentModule 
    ? BASIC_LEVEL_MODULES.find(m => m.number === currentModule.number + 1)
    : BASIC_LEVEL_MODULES[0]

  // Render module card
  // Render progress tracking
  // Render navigation
}
\`\`\`

### Module Card Component Pattern
\`\`\`typescript
<Card className="bg-black border-[rgb(170,70,170)]/30">
  <CardHeader>
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        {module.icon}
        <div>
          <CardTitle>{module.title}</CardTitle>
          <p className="text-xs text-white/60">{module.mainOutput}</p>
        </div>
      </div>
      <div className="text-right">
        <Badge>{module.xp} XP</Badge>
        {getStatusBadge(moduleProgreso[module.id]?.status)}
      </div>
    </div>
  </CardHeader>
  <CardContent>
    <p className="text-sm text-white/70 mb-4">{module.shortDescription}</p>
    <div className="space-y-2 mb-4">
      <div className="text-xs text-white/60">
        {module.requiredActivities.length} Required Activities
      </div>
      {/* Activity list */}
    </div>
    <Button onClick={() => router.push(module.route)}>
      {module.cta}
    </Button>
  </CardContent>
</Card>
\`\`\`

---

## STYLING & VISUAL SYSTEM

### Color Scheme (Pillar 3)
\`\`\`typescript
const PILLAR3_PRIMARY = 'rgb(170, 70, 170)'      // Magenta/Purple
const PILLAR3_ACCENT = 'rgb(80, 160, 170)'       // Teal

// Usage in styles:
// - Primary buttons: rgb(170, 70, 170)
// - Secondary buttons: rgb(170, 70, 170) with 0.6-0.9 opacity
// - Accents: rgb(80, 160, 170)
// - Text: white or white/60-70
// - Borders: Pillar colors with 0.2-0.4 opacity
// - Backgrounds: Pillar colors with 0.05-0.15 opacity
\`\`\`

### Tag Styling
\`\`\`typescript
const getTagStyle = (tag: string) => {
  if (tag.includes('Sin Entrevista') || tag.includes('Optional')) {
    return { 
      backgroundColor: 'rgba(80, 160, 170, 0.2)', 
      color: 'rgb(80, 160, 170)' 
    }
  }
  if (tag.includes('Required') || tag.includes('Live') || tag.includes('Voice')) {
    return { 
      backgroundColor: 'rgba(170, 70, 170, 0.2)', 
      color: 'rgb(200, 130, 200)' 
    }
  }
  if (tag.includes('Final')) {
    return { 
      backgroundColor: 'rgba(170, 70, 170, 0.3)', 
      color: 'rgb(170, 70, 170)' 
    }
  }
  return { 
    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
    color: 'rgba(255, 255, 255, 0.7)' 
  }
}
\`\`\`

### Progress Bar Styling
\`\`\`typescript
<div className="w-full h-2 bg-black border border-[rgb(80,160,170)]/20 rounded-full">
  <div
    className="h-full bg-gradient-to-r from-[rgb(170,70,170)] to-[rgb(170,70,170)]/60 
               rounded-full transition-all"
    style={{ width: `${progressPercentage}%` }}
  />
</div>
\`\`\`

---

## ROUTE ACTIONS & NAVIGATION

### Module Entry Points
\`\`\`typescript
const MODULE_ROUTES: Record<string, string> = {
  'career-mirror': '/despega/a3/career-mirror',
  'value-mining-lab': '/despega/a3/value-mining-lab',
  'cv-builder-studio': '/despega/a3/cv-builder-studio',
  'job-decoder': '/despega/a3/job-decoder',
  'answer-architecture': '/despega/a3/answer-architecture',
  'coach-practice-room': '/despega/a3/coach-practice-room',
  'communication-gym': '/despega/a3/communication-gym',
  'first-recruiter-simulation': '/despega/a3/first-recruiter-simulation',
  'risk-difficult-questions-lab': '/despega/a3/risk-difficult-questions-lab',
  'basic-interview-mission': '/despega/a3/basic-interview-mission'
}
\`\`\`

### Navigation Flow
\`\`\`typescript
// Start module
const handleStartModule = (module: Module) => {
  router.push(module.route)
  // Backend: Update status to 'in_progress'
}

// Complete module
const handleCompleteModule = () => {
  // Backend: Update status to 'completed', award XP
  // Unlock next module
  // Refresh progress
}

// Return to dashboard
const handleReturnToDashboard = () => {
  router.push('/despega/a3')
}
\`\`\`

### Current/Next Module Display
\`\`\`typescript
// Show quick access to current/next module
<div className="p-4 bg-[rgb(170,70,170)]/10 border border-[rgb(170,70,170)]/20 rounded">
  <div className="flex items-center justify-between mb-2">
    <span className="text-sm text-white/60">Continue:</span>
    <span className="text-sm font-semibold">{currentModule?.title}</span>
  </div>
  <Button onClick={() => router.push(currentModule?.route)}>
    Continue to {currentModule?.title}
  </Button>
</div>
\`\`\`

---

## COMPLETION FLOWS

### Module Completion Lifecycle
1. **User Starts Module** → Status: 'in_progress'
2. **User Completes Activities** → Activities tracked
3. **Module Marked Complete** → Status: 'completed'
4. **XP Awarded** → User earns module XP
5. **Next Module Unlocked** → Previous module prerequisite satisfied
6. **Progress Updated** → Dashboard reflects new status

### Certification Flow (Module 10)
1. User completes Modules 1-9
2. Module 10 becomes 'available'
3. User completes full interview simulation
4. Meets 5 self-evaluation criteria
5. Receives "Basic Level Certification"
6. Can advance to Module 4 (Advanced Level)

---

## ENHANCEMENT OPPORTUNITIES

### Potential Improvements:
1. **Adaptive Difficulty** - Adjust content based on performance
2. **AI Coaching** - Real-time suggestions via OpenAI integration
3. **Peer Feedback** - Community review of responses (privacy-protected)
4. **Spaced Repetition** - Recommend reviewing completed modules
5. **Time Tracking** - Monitor time spent per module
6. **Skill Gap Detection** - Identify weak areas automatically
7. **Personalized Pathways** - Customize module sequence by DISC profile
8. **Integration with Real Interviews** - Track real interview outcomes
9. **Resource Library** - Curated content by module topic
10. **Progress Notifications** - Celebrate milestones and achievements

---

## SUMMARY

**Total Modules:** 10
**Total XP:** 1,340
**Estimated Duration:** 4-6 weeks of consistent practice
**Certification:** Basic Level Interview Mastery

This framework provides a complete, structured progression from professional clarity through interview certification, with built-in progress tracking, status management, and XP rewards throughout the journey.

Each module has:
- Clear learning objectives
- Structured activities
- Defined deliverables
- XP rewards
- Progression gates
- AI coach support (in selected modules)

The system is designed to be:
- **Progressive:** Builds skills sequentially
- **Measurable:** XP and completion tracking
- **Engaging:** Clear rewards and milestones
- **Supportive:** AI coach and feedback throughout
- **Comprehensive:** Covers all interview preparation needs

Ready to be shared with other LLMs for optimization, enhancement, or alternative implementations.
